---
layout: "note"
title: "29_interior-mutability_verify.rs"
display_title: "29_interior-mutability_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "29"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/interior-mutability/"
parent_title: "내부 가변성"
description: "Rust · 내부 가변성 검증 코드"
sitemap: false
permalink: "/studies/rust/code/29_interior-mutability_verify/"
---
{% raw %}
[내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/) 문서의 검증 코드다.

```rust
//! 내부 가변성: &self로는 Vec에 push할 수 없는 것(E0596), &self 메서드 안에서 Cell로 세기, RefCell의 빌림 규칙은 실행 중에 검사된다
//! (try_borrow_mut는 Err(BorrowMutError), borrow_mut는 panic), 빌림을 너무 오래 쥐는 흔한 실수,
//! OnceCell 캐시, LazyLock 정적 값이 여러 스레드에서도 한 번만 초기화되는 것,
//! Cell을 스레드끼리 나누면 컴파일 오류(E0277)이고 Mutex는 되는 것, Rc<RefCell<T>>로 주인 여럿이 함께 고치는 것,
//! RefCell 빌림을 쥔 채 .await하면 clippy가 기본으로 경고하는 것을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/29_interior-mutability_verify.rs"

use std::cell::{Cell, OnceCell, RefCell};
use std::collections::HashMap;
use std::rc::Rc;
use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::{Arc, LazyLock, Mutex};

// ---------- 1. Cell: &self로 세기 ----------

struct Parser {
    calls: Cell<u32>,
}
impl Parser {
    fn parse(&self, s: &str) -> Option<i32> {
        self.calls.set(self.calls.get() + 1); // &self인데도 바꿀 수 있다
        s.parse().ok()
    }
}

// ---------- 2. RefCell: 가짜 메신저(테스트 대역) ----------

trait Messenger {
    fn send(&self, msg: &str);
}
struct MockMessenger {
    sent: RefCell<Vec<String>>,
}
impl Messenger for MockMessenger {
    fn send(&self, msg: &str) {
        self.sent.borrow_mut().push(msg.to_string());
    }
}
fn warn_if_over(m: &dyn Messenger, used: u32, limit: u32) {
    if used * 100 >= limit * 90 {
        m.send("over 90% of quota");
    }
}

// ---------- 3. 빌림을 오래 쥐는 실수 ----------

struct Registry {
    names: RefCell<Vec<String>>,
}
impl Registry {
    fn add(&self, n: &str) {
        self.names.borrow_mut().push(n.to_string());
    }
    /// 틀린 버전: 읽기 빌림을 쥔 채 add를 부른다 → 실행 중 panic
    fn copy_first_buggy(&self) {
        let names = self.names.borrow();
        if let Some(first) = names.first() {
            self.add(first); // 여기서 borrow_mut → 이미 빌려 있어 panic
        }
    }
    /// 고친 버전: 필요한 값을 복사해 빌림을 먼저 끝낸다
    fn copy_first_fixed(&self) {
        let first = self.names.borrow().first().cloned(); // 이 줄 끝에서 빌림이 끝난다
        if let Some(first) = first {
            self.add(&first);
        }
    }
}

// ---------- 4. OnceCell 캐시 ----------

struct Report {
    rows: Vec<u64>,
    total: OnceCell<u64>,
    computed: Cell<u32>,
}
impl Report {
    fn total(&self) -> u64 {
        *self.total.get_or_init(|| {
            self.computed.set(self.computed.get() + 1);
            self.rows.iter().sum()
        })
    }
}

// ---------- 5. LazyLock 정적 값 ----------

static INIT_COUNT: AtomicU32 = AtomicU32::new(0);
static STATUS_TEXT: LazyLock<HashMap<u16, &'static str>> = LazyLock::new(|| {
    INIT_COUNT.fetch_add(1, Ordering::SeqCst);
    HashMap::from([
        (200, "OK"),
        (404, "Not Found"),
        (503, "Service Unavailable"),
    ])
});

fn compile_errors(code: &str) -> String {
    compile_with("rustc", "rustc", code)
}

fn compile_with(tool: &str, tag: &str, code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr29_{}_{tag}", std::process::id()));
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
        .arg(&file)
        .output()
        .expect("컴파일러 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn panic_message(r: std::thread::Result<()>) -> String {
    let p = r.expect_err("panic이 나야 한다");
    if let Some(s) = p.downcast_ref::<String>() {
        s.clone()
    } else if let Some(s) = p.downcast_ref::<&str>() {
        s.to_string()
    } else {
        "unknown".into()
    }
}

fn main() {
    std::panic::set_hook(Box::new(|_| {}));

    // 1. Cell
    let p = Parser {
        calls: Cell::new(0),
    };
    let r: Vec<Option<i32>> = ["1", "x", "3"].iter().map(|s| p.parse(s)).collect();
    assert_eq!(r, vec![Some(1), None, Some(3)]);
    assert_eq!(p.calls.get(), 3);
    println!(
        "1. Cell: &self 메서드 세 번 호출, calls = {}",
        p.calls.get()
    );

    // 2. RefCell 대역
    let m = MockMessenger {
        sent: RefCell::new(vec![]),
    };
    warn_if_over(&m, 95, 100);
    warn_if_over(&m, 10, 100);
    assert_eq!(*m.sent.borrow(), vec!["over 90% of quota".to_string()]);
    // RefCell 없이 &self에서 Vec에 push하면 컴파일 오류
    let e = compile_errors(
        "pub struct M { sent: Vec<String> }\nimpl M { pub fn send(&self, m: &str) { self.sent.push(m.to_string()); } }\n",
    );
    assert!(e.contains("error[E0596]"), "{e}");
    assert!(
        e.contains("cannot borrow `self.sent` as mutable, as it is behind a `&` reference"),
        "{e}"
    );

    // 2-1. Rc<RefCell<T>>: 주인 여럿이 같은 Vec을 고친다
    let shared = Rc::new(RefCell::new(Vec::new()));
    let a = Rc::clone(&shared);
    let b = Rc::clone(&shared);
    a.borrow_mut().push("from a");
    b.borrow_mut().push("from b");
    assert_eq!(*shared.borrow(), vec!["from a", "from b"]);
    assert_eq!(Rc::strong_count(&shared), 3);
    println!("2. Rc<RefCell<Vec>>: 주인 셋, 내용 {:?}", shared.borrow());

    // 3. 실행 중 빌림 검사
    let c = RefCell::new(5);
    {
        let r1 = c.borrow();
        let r2 = c.borrow(); // 읽기 빌림은 여러 개 가능
        assert_eq!(*r1 + *r2, 10);
        let err = c
            .try_borrow_mut()
            .expect_err("읽기 빌림 중에는 쓰기 빌림 불가");
        assert_eq!(format!("{err:?}"), "BorrowMutError");
        assert_eq!(err.to_string(), "RefCell already borrowed");
    }
    {
        let mut w = c.borrow_mut();
        *w += 1;
        let err = c.try_borrow().expect_err("쓰기 빌림 중에는 읽기 빌림 불가");
        assert_eq!(format!("{err:?}"), "BorrowError");
        assert_eq!(err.to_string(), "RefCell already mutably borrowed");
    }
    assert_eq!(*c.borrow(), 6); // 빌림이 끝나면 다시 된다
    // borrow_mut 충돌은 panic
    let msg = panic_message(std::panic::catch_unwind(|| {
        let c = RefCell::new(0);
        let _a = c.borrow_mut();
        let _b = c.borrow_mut();
    }));
    println!("3. borrow_mut 두 번: panic 메시지 {msg:?}");
    assert_eq!(msg, "RefCell already borrowed");

    // 흔한 실수
    let reg = Registry {
        names: RefCell::new(vec!["a".into()]),
    };
    let msg = panic_message(std::panic::catch_unwind(std::panic::AssertUnwindSafe(
        || reg.copy_first_buggy(),
    )));
    assert_eq!(msg, "RefCell already borrowed");
    reg.copy_first_fixed();
    assert_eq!(*reg.names.borrow(), vec!["a", "a"]);
    println!("   빌림을 쥔 채 add: panic / 복사 후 add: [\"a\", \"a\"]");
    // 같은 버그를 RefCell 없이 &mut self로 쓰면 컴파일 오류(E0502)로 잡힌다
    let e = compile_errors(
        "pub struct R { names: Vec<String> }\n\
         impl R {\n\
         fn add(&mut self, n: &str) { self.names.push(n.to_string()); }\n\
         pub fn copy_first(&mut self) { if let Some(first) = self.names.first() { self.add(first); } }\n\
         }\n",
    );
    assert!(e.contains("error[E0502]"), "{e}");
    println!("   같은 코드를 &mut self로: E0502");

    // 4. OnceCell
    let rep = Report {
        rows: vec![10, 20, 30],
        total: OnceCell::new(),
        computed: Cell::new(0),
    };
    assert_eq!(rep.total(), 60);
    assert_eq!(rep.total(), 60);
    assert_eq!(rep.computed.get(), 1);
    // set은 한 번만 된다: 두 번째는 넣으려던 값을 Err로 돌려준다
    let once = OnceCell::new();
    assert_eq!(once.set(92), Ok(()));
    assert_eq!(once.set(62), Err(62));
    assert_eq!(once.get(), Some(&92));
    println!("4. OnceCell: total() 두 번, 계산은 한 번 / set 두 번째는 Err(62)");

    // 5. LazyLock: 8개 스레드가 동시에 읽어도 초기화는 한 번
    assert_eq!(INIT_COUNT.load(Ordering::SeqCst), 0); // 아직 아무도 안 읽었다
    let hs: Vec<_> = (0..8)
        .map(|_| std::thread::spawn(|| STATUS_TEXT[&404]))
        .collect();
    for h in hs {
        assert_eq!(h.join().expect("panic 없음"), "Not Found");
    }
    assert_eq!(INIT_COUNT.load(Ordering::SeqCst), 1);
    println!("5. LazyLock: 스레드 8개, 초기화 1번");

    // 6. 스레드 경계
    let e = compile_errors(
        "use std::cell::Cell;\npub fn f() { let c = Cell::new(0); std::thread::scope(|s| { s.spawn(|| c.set(1)); }); }\n",
    );
    assert!(e.contains("error[E0277]"), "{e}");
    assert!(
        e.contains("`Cell<i32>` cannot be shared between threads safely"),
        "{e}"
    );
    assert!(
        e.contains("use `std::sync::RwLock` or `std::sync::atomic::AtomicI32` instead"),
        "{e}"
    );
    let e = compile_errors(
        "use std::{cell::RefCell, sync::Arc};\npub fn f() { let c = Arc::new(RefCell::new(0)); std::thread::spawn(move || *c.borrow_mut() += 1); }\n",
    );
    assert!(e.contains("error[E0277]"), "{e}");
    assert!(
        e.contains("`RefCell<i32>` cannot be shared between threads safely"),
        "{e}"
    );
    let counter = Arc::new(Mutex::new(0));
    let hs: Vec<_> = (0..4)
        .map(|_| {
            let c = Arc::clone(&counter);
            std::thread::spawn(move || {
                for _ in 0..1000 {
                    *c.lock().expect("잠금이 오염되지 않았다") += 1;
                }
            })
        })
        .collect();
    for h in hs {
        h.join().expect("panic 없음");
    }
    assert_eq!(*counter.lock().expect("잠금"), 4000);
    println!("6. Cell·RefCell을 스레드로: E0277 / Arc<Mutex>: 4000");

    // 7. RefCell 빌림을 쥔 채 .await → clippy 기본 경고
    let e = compile_with(
        "clippy-driver",
        "await",
        "pub async fn w(c: &std::cell::RefCell<i32>) { let b = c.borrow_mut(); std::future::ready(()).await; drop(b); }\n",
    );
    assert!(
        e.contains("`#[warn(clippy::await_holding_refcell_ref)]` on by default"),
        "{e}"
    );
    assert!(
        e.contains("this `RefCell` reference is held across an await point"),
        "{e}"
    );
    println!("7. clippy: await_holding_refcell_ref 기본 경고");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cell_replace_and_take() {
        let c = Cell::new(3);
        assert_eq!(c.replace(7), 3);
        assert_eq!(c.take(), 7);
        assert_eq!(c.get(), 0);
    }

    #[test]
    fn borrow_ends_at_scope_end() {
        let c = RefCell::new(vec![1]);
        {
            let r = c.borrow();
            assert!(c.try_borrow_mut().is_err());
            drop(r);
        }
        c.borrow_mut().push(2);
        assert_eq!(c.borrow().len(), 2);
    }
}
```
{% endraw %}
