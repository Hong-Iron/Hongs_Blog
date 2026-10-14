---
layout: "note"
title: "28_rc-arc-weak_verify.rs"
display_title: "28_rc-arc-weak_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/rc-arc-weak/"
parent_title: "Rc·Arc·Weak"
description: "Rust · Rc·Arc·Weak 검증 코드"
permalink: "/studies/rust/code/28_rc-arc-weak_verify/"
---
{% raw %}
[Rc·Arc·Weak](/Hongs_Blog/studies/rust/rc-arc-weak/) 문서의 검증 코드다.

```rust
//! Rc·Arc·Weak: strong_count의 변화, 손잡이 크기(8바이트), Rc 순환이 Drop을 막아 누수가 나는 것(Drop 횟수 0),
//! 뒤쪽 연결을 Weak로 바꾸면 Drop이 모두 도는 것, upgrade()가 None을 돌려주는 때,
//! Rc는 스레드로 보낼 수 없고(E0277) Arc는 되는 것, clippy의 arc_with_non_send_sync(기본 경고)와
//! clone_on_ref_ptr(기본 꺼짐)를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/28_rc-arc-weak_verify.rs"

use std::cell::{Cell, RefCell};
use std::rc::{Rc, Weak};
use std::sync::Arc;

thread_local! {
    static DROPS: Cell<u32> = const { Cell::new(0) };
}
fn drops() -> u32 {
    DROPS.with(|d| d.get())
}
fn reset() {
    DROPS.with(|d| d.set(0));
}

// ---------- 순환: 둘 다 Rc ----------

struct StrongNode {
    _name: &'static str,
    next: RefCell<Option<Rc<StrongNode>>>,
}
impl Drop for StrongNode {
    fn drop(&mut self) {
        DROPS.with(|d| d.set(d.get() + 1));
    }
}

// ---------- 부모는 자식을 Rc로, 자식은 부모를 Weak로 ----------

struct TreeNode {
    name: &'static str,
    parent: RefCell<Weak<TreeNode>>,
    children: RefCell<Vec<Rc<TreeNode>>>,
}
impl Drop for TreeNode {
    fn drop(&mut self) {
        DROPS.with(|d| d.set(d.get() + 1));
    }
}
fn tree_node(name: &'static str) -> Rc<TreeNode> {
    Rc::new(TreeNode {
        name,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(Vec::new()),
    })
}

fn compile_errors(code: &str) -> String {
    compile_with("rustc", "rustc", code, &[])
}

fn compile_with(tool: &str, tag: &str, code: &str, extra: &[&str]) -> String {
    let dir = std::env::temp_dir().join(format!("vr28_{}_{tag}", std::process::id()));
    std::fs::create_dir_all(&dir).expect("임시 폴더");
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).expect("쓰기");
    let out = std::process::Command::new(tool)
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "--emit=metadata",
            "--out-dir",
        ])
        .arg(&dir)
        .args(extra)
        .arg(&file)
        .output()
        .expect("컴파일러 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn main() {
    // 1. strong_count 추적
    let a = Rc::new(String::from("shared"));
    let mut trace = vec![Rc::strong_count(&a)];
    let b = Rc::clone(&a);
    trace.push(Rc::strong_count(&a));
    {
        let _c = Rc::clone(&a);
        trace.push(Rc::strong_count(&a));
    }
    trace.push(Rc::strong_count(&a));
    drop(b);
    trace.push(Rc::strong_count(&a));
    println!("1. strong_count: {trace:?}");
    assert_eq!(trace, vec![1, 2, 3, 2, 1]);
    // clone은 같은 힙 데이터를 가리킨다(복사 아님)
    let d = Rc::clone(&a);
    assert!(Rc::ptr_eq(&a, &d));
    assert_eq!(a.as_ptr(), d.as_ptr());
    drop(d);
    // 손잡이는 주소 한 칸뿐이다: 개수는 손잡이가 아니라 힙의 값 옆에 있다
    assert_eq!(std::mem::size_of::<Rc<String>>(), 8);
    assert_eq!(std::mem::size_of::<Arc<String>>(), 8);
    assert_eq!(std::mem::size_of::<Weak<String>>(), 8);
    println!("   size_of: Rc 8, Arc 8, Weak 8");

    // 2. Rc 순환 → 누수
    reset();
    {
        let x = Rc::new(StrongNode {
            _name: "x",
            next: RefCell::new(None),
        });
        let y = Rc::new(StrongNode {
            _name: "y",
            next: RefCell::new(Some(Rc::clone(&x))),
        });
        *x.next.borrow_mut() = Some(Rc::clone(&y)); // x → y → x
        assert_eq!((Rc::strong_count(&x), Rc::strong_count(&y)), (2, 2));
    } // 변수 x, y가 사라져도 서로를 붙잡고 있어 count가 1로 남는다
    let leaked = drops();
    println!("2. Rc 순환: 범위를 벗어난 뒤 Drop 횟수 = {leaked}");
    assert_eq!(leaked, 0);

    // 3. Weak로 끊기
    reset();
    {
        let parent = tree_node("root");
        let leaf = tree_node("leaf");
        *leaf.parent.borrow_mut() = Rc::downgrade(&parent);
        parent.children.borrow_mut().push(Rc::clone(&leaf));
        assert_eq!(Rc::strong_count(&parent), 1);
        assert_eq!(Rc::weak_count(&parent), 1);
        assert_eq!(Rc::strong_count(&leaf), 2);
        let p = leaf.parent.borrow().upgrade().map(|p| p.name);
        assert_eq!(p, Some("root"));
        assert_eq!(parent.children.borrow()[0].name, "leaf");
    }
    let freed = drops();
    println!("3. 부모←자식을 Weak로: Drop 횟수 = {freed}");
    assert_eq!(freed, 2);

    // 4. upgrade는 강한 참조가 모두 사라지면 None
    reset();
    let leaf = tree_node("leaf");
    {
        let parent = tree_node("root");
        *leaf.parent.borrow_mut() = Rc::downgrade(&parent);
        assert!(leaf.parent.borrow().upgrade().is_some());
    }
    assert!(leaf.parent.borrow().upgrade().is_none());
    assert_eq!(drops(), 1); // 부모만 해제되었다
    println!("4. 부모가 사라진 뒤 upgrade() = None");

    // 5. Arc는 스레드 사이에서 나눠 가질 수 있다
    let data = Arc::new(vec![1u64, 2, 3, 4]);
    let handles: Vec<_> = (0..4)
        .map(|i| {
            let data = Arc::clone(&data);
            std::thread::spawn(move || data[i] * 10)
        })
        .collect();
    let sum: u64 = handles
        .into_iter()
        .map(|h| h.join().expect("스레드 panic 없음"))
        .sum();
    assert_eq!(sum, 100);
    assert_eq!(Arc::strong_count(&data), 1); // 스레드가 끝나며 clone이 모두 사라졌다
    println!("5. Arc 4개 스레드: 합 {sum}, 끝난 뒤 strong_count 1");

    // 6. Rc는 Send가 아니다
    let e = compile_errors(
        "use std::rc::Rc;\npub fn f() { let a = Rc::new(5); std::thread::spawn(move || println!(\"{a}\")); }\n",
    );
    assert!(e.contains("error[E0277]"), "{e}");
    assert!(
        e.contains("`Rc<i32>` cannot be sent between threads safely"),
        "{e}"
    );
    println!("6. Rc를 스레드로 보내기: E0277");
    // Box는 안의 값에 따라 정해진다: Box<i32>는 되고 Box<Rc<i32>>는 E0277
    let ok = compile_errors(
        "pub fn f() { let b = Box::new(5); std::thread::spawn(move || println!(\"{b}\")); }\n",
    );
    assert!(ok.is_empty(), "{ok}");
    let e = compile_errors(
        "use std::rc::Rc;\npub fn f() { let b = Box::new(Rc::new(5)); std::thread::spawn(move || println!(\"{b}\")); }\n",
    );
    assert!(e.contains("error[E0277]"), "{e}");
    println!("   Box<i32>는 스레드로 보낼 수 있고 Box<Rc<i32>>는 E0277");

    // 7. Rc<T>는 &T만 준다: 안의 값을 바로 바꿀 수 없다
    let e =
        compile_errors("use std::rc::Rc;\npub fn f() { let a = Rc::new(vec![1]); a.push(2); }\n");
    assert!(e.contains("error[E0596]"), "{e}");
    assert!(
        e.contains("cannot borrow data in an `Rc` as mutable"),
        "{e}"
    );
    println!("7. Rc 안의 Vec에 push: E0596");

    // 8. clippy: 스레드로 못 보내는 값을 Arc에 담으면 기본 경고
    let e = compile_with(
        "clippy-driver",
        "arc",
        "pub fn f() -> usize { let a = std::sync::Arc::new(std::cell::RefCell::new(0)); std::sync::Arc::strong_count(&a) }\n",
        &[],
    );
    assert!(
        e.contains("`#[warn(clippy::arc_with_non_send_sync)]` on by default"),
        "{e}"
    );
    assert!(
        e.contains("if the `Arc` will not be used across threads replace it with an `Rc`"),
        "{e}"
    );
    // a.clone() 대신 Rc::clone(&a)를 강제하는 린트는 기본으로 꺼져 있다
    let snippet = "use std::rc::Rc; pub fn f(a: &Rc<i32>) -> Rc<i32> { a.clone() }\n";
    let off = compile_with("clippy-driver", "corp_off", snippet, &[]);
    // "error"가 없어야 조각이 실제로 컴파일된 것이다(호출이 실패해도 린트 이름은 안 나온다).
    assert!(
        !off.contains("error") && !off.contains("clone_on_ref_ptr"),
        "{off}"
    );
    let on = compile_with(
        "clippy-driver",
        "corp_on",
        snippet,
        &["-W", "clippy::clone_on_ref_ptr"],
    );
    assert!(
        on.contains("using `.clone()` on a ref-counted pointer"),
        "{on}"
    );
    println!("8. clippy: arc_with_non_send_sync 기본 경고, clone_on_ref_ptr는 켜야 걸린다");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 문서 확인 문제 C1의 순서 그대로
    #[test]
    fn card_c1_trace() {
        let a = Rc::new(5);
        let b = Rc::clone(&a);
        {
            let _c = Rc::clone(&b);
            assert_eq!(Rc::strong_count(&a), 3);
        }
        let w = Rc::downgrade(&a);
        drop(b);
        assert_eq!((Rc::strong_count(&a), Rc::weak_count(&a)), (1, 1));
        drop(a);
        assert!(w.upgrade().is_none());
    }

    #[test]
    fn weak_does_not_keep_value_alive() {
        let strong = Rc::new(5);
        let weak = Rc::downgrade(&strong);
        assert_eq!(weak.upgrade().as_deref(), Some(&5));
        drop(strong);
        assert!(weak.upgrade().is_none());
    }

    #[test]
    fn breaking_cycle_by_hand_frees_nodes() {
        reset();
        let x = Rc::new(StrongNode {
            _name: "x",
            next: RefCell::new(None),
        });
        let y = Rc::new(StrongNode {
            _name: "y",
            next: RefCell::new(Some(Rc::clone(&x))),
        });
        *x.next.borrow_mut() = Some(Rc::clone(&y));
        x.next.borrow_mut().take(); // 순환을 손으로 끊는다
        drop(x);
        drop(y);
        assert_eq!(drops(), 2);
    }
}
```
{% endraw %}
