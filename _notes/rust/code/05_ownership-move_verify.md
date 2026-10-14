---
layout: "note"
title: "05_ownership-move_verify.rs"
display_title: "05_ownership-move_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/ownership-move/"
parent_title: "소유권과 이동"
description: "Rust · 소유권과 이동 검증 코드"
permalink: "/studies/rust/code/05_ownership-move_verify/"
---
{% raw %}
[소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/) 문서의 검증 코드다.

```rust
//! 소유권과 이동 문서의 주장을 확인한다: 이동 뒤 원래 변수 사용 금지(오류 코드), 이동해도 힙 주소가 그대로인 것,
//! clone은 힙을 새로 잡는 것, String의 크기, Copy·Clone 규칙, drop 순서(선언의 역순, 필드는 선언 순서, 부분 이동).
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/05_ownership-move_verify.rs"

use std::process::Command;
use std::sync::Mutex;
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);
static LOG: Mutex<Vec<String>> = Mutex::new(Vec::new());

/// 코드 조각을 rustc로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::SeqCst);
    let dir = std::env::temp_dir().join(format!("vr05_{}_{n}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = Command::new("rustc")
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
        .expect("rustc 실행");
    let _ = std::fs::remove_dir_all(&dir);
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn expect_error(code: &str, err: &str, phrase: &str) {
    let stderr = compile_errors(code);
    assert!(
        stderr.contains(&format!("error[{err}]")),
        "{err} 기대, 실제:\n{stderr}"
    );
    assert!(stderr.contains(phrase), "'{phrase}' 기대, 실제:\n{stderr}");
    println!("{err} 확인: {phrase}");
}

fn expect_ok(code: &str) {
    let stderr = compile_errors(code);
    assert!(
        !stderr.contains("error"),
        "컴파일 성공 기대, 실제:\n{stderr}"
    );
}

/// clippy-driver로 코드 조각을 검사해 stderr를 돌려준다.
fn clippy(code: &str, flags: &[&str]) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::SeqCst);
    let dir = std::env::temp_dir().join(format!("vr05c_{}_{n}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = Command::new("clippy-driver")
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "--emit=metadata",
            "--out-dir",
        ])
        .arg(&dir)
        .args(flags)
        .arg(&file)
        .output()
        .expect("clippy-driver 실행");
    let _ = std::fs::remove_dir_all(&dir);
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn lint_checks() {
    // clone_on_copy: 기본으로 경고
    let c = clippy("pub fn n(x: i32) -> i32 { x.clone() + 1 }", &[]);
    assert!(c.contains("clippy::clone_on_copy"), "{c}");
    // needless_pass_by_value: pedantic에서만
    let code = "pub fn n(s: String) -> usize { s.len() }";
    // 기본 실행이 실제로 컴파일을 마쳤는지("error" 없음)도 함께 본다. 호출이 실패하면 린트가 없어도 그만이다.
    let d = clippy(code, &[]);
    assert!(
        !d.contains("error") && !d.contains("needless_pass_by_value"),
        "{d}"
    );
    assert!(clippy(code, &["-W", "clippy::pedantic"]).contains("clippy::needless_pass_by_value"));
    // redundant_clone: nursery에서만
    let code = "pub fn n(s: &str) -> usize { let t = s.to_string(); let u = t.clone(); u.len() }";
    let d = clippy(code, &[]);
    assert!(
        !d.contains("error") && !d.contains("redundant_clone"),
        "{d}"
    );
    assert!(clippy(code, &["-W", "clippy::nursery"]).contains("clippy::redundant_clone"));
    println!(
        "clippy: clone_on_copy 기본, needless_pass_by_value pedantic, redundant_clone nursery"
    );
}

fn log(s: &str) {
    LOG.lock().unwrap().push(s.to_string());
}

fn take_log() -> Vec<String> {
    std::mem::take(&mut *LOG.lock().unwrap())
}

struct Noisy(&'static str);

impl Drop for Noisy {
    fn drop(&mut self) {
        log(&format!("drop({})", self.0));
    }
}

struct Pair {
    first: Noisy,
    second: Noisy,
}

fn consume(n: Noisy) {
    log(&format!("consume {}", n.0));
} // n은 여기서 drop된다

fn give_back(n: Noisy) -> Noisy {
    n
}

fn compile_checks() {
    // 이동 뒤 원래 변수를 읽으면 E0382
    expect_error(
        r#"pub fn f(){ let s1=String::from("hi"); let s2=s1; println!("{s1} {s2}"); }"#,
        "E0382",
        "borrow of moved value: `s1`",
    );
    // 함수 인자로 넘기면 이동한다
    expect_error(
        r#"fn take(_s:String){} pub fn f(){ let s=String::from("hi"); take(s); println!("{s}"); }"#,
        "E0382",
        "value moved here",
    );
    // 반복문 안에서 이동하면 두 번째 바퀴에서 E0382
    expect_error(
        r#"pub fn f(){ let s=String::from("a"); for _ in 0..2 { drop(s); } }"#,
        "E0382",
        "in previous iteration of loop",
    );
    // Vec의 칸에서 꺼내 옮길 수 없다
    expect_error(
        r#"pub fn f(){ let v=vec![String::from("a")]; let s=v[0]; drop(s); }"#,
        "E0507",
        "cannot move out of index of `Vec<String>`",
    );
    // Drop을 구현한 타입의 필드는 꺼낼 수 없다
    expect_error(
        r#"pub struct G{pub name:String} impl Drop for G{fn drop(&mut self){}} pub fn f(g:G)->String{ g.name }"#,
        "E0509",
        "which implements the `Drop` trait",
    );
    // 부분 이동 뒤 전체를 쓰면 E0382
    expect_error(
        r#"pub struct P{pub a:String,pub b:String} pub fn f(p:P){ let a=p.a; drop(a); let q=p; drop(q); }"#,
        "E0382",
        "use of partially moved value: `p`",
    );
    // 부분 이동 뒤 남은 필드는 따로 쓸 수 있다
    expect_ok(
        r#"pub struct P{pub a:String,pub b:String} pub fn f(p:P)->String{ let a=p.a; let b=p.b; a+&b }"#,
    );
    // 옮긴 변수에 새 값을 넣으면 다시 쓸 수 있다
    expect_ok(
        r#"pub fn f(){ let mut s=String::from("a"); drop(s); s=String::from("b"); println!("{s}"); }"#,
    );
    // String 필드가 있으면 Copy가 될 수 없다
    expect_error(
        r#"#[derive(Clone,Copy)] pub struct S{pub s:String}"#,
        "E0204",
        "the trait `Copy` cannot be implemented for this type",
    );
    // Drop과 Copy는 함께 못 쓴다
    expect_error(
        r#"#[derive(Clone,Copy)] pub struct S; impl Drop for S{fn drop(&mut self){}}"#,
        "E0184",
        "the trait `Copy` cannot be implemented for this type; the type has a destructor",
    );
    // drop 메서드를 직접 부를 수 없다
    expect_error(
        r#"pub struct S; impl Drop for S{fn drop(&mut self){}} pub fn f(){ let s=S; s.drop(); }"#,
        "E0040",
        "explicit use of destructor method",
    );
}

fn heap_checks() {
    // String은 포인터·길이·용량 세 칸이다
    assert_eq!(
        std::mem::size_of::<String>(),
        3 * std::mem::size_of::<usize>()
    );
    println!("size_of::<String>() = {}", std::mem::size_of::<String>());

    // 이동: 스택의 세 칸만 옮기고 힙 주소는 그대로다
    let s1 = String::from("hello");
    let heap = s1.as_ptr();
    let s2 = s1;
    assert_eq!(s2.as_ptr(), heap);
    assert_eq!((s2.len(), s2.capacity()), (5, 5));

    // clone: 힙을 새로 잡아 내용을 베낀다
    let s3 = s2.clone();
    assert_ne!(s3.as_ptr(), s2.as_ptr());
    assert_eq!(s3, s2);

    // Copy: 정수와 Copy인 것만 담은 튜플은 대입해도 원래 변수를 쓸 수 있다
    let x = 5;
    let y = x;
    let t = (1, 2.5);
    let u = t;
    assert_eq!((x, y, t, u), (5, 5, (1, 2.5), (1, 2.5)));
    println!("move keeps heap ptr, clone makes a new one");
}

fn drop_order_checks() {
    // 지역 변수는 선언의 역순, 튜플 칸은 앞에서부터
    {
        let _a = Noisy("a");
        let _b = Noisy("b");
        let _t = (Noisy("t0"), Noisy("t1"));
    }
    assert_eq!(take_log(), ["drop(t0)", "drop(t1)", "drop(b)", "drop(a)"]);

    // 구조체 필드는 선언 순서
    {
        let p = Pair {
            second: Noisy("second"),
            first: Noisy("first"),
        };
        log(&format!("{} {}", p.first.0, p.second.0));
    }
    assert_eq!(take_log(), ["first second", "drop(first)", "drop(second)"]);

    // 문서의 추적 문제: 함수로 옮긴 값은 함수 끝에서 drop된다
    {
        let _a = Noisy("a");
        let b = Noisy("b");
        let _pair = (Noisy("p0"), Noisy("p1"));
        consume(b);
        log("end");
    }
    let trace = take_log();
    println!("trace: {}", trace.join(" / "));
    assert_eq!(
        trace,
        [
            "consume b",
            "drop(b)",
            "end",
            "drop(p0)",
            "drop(p1)",
            "drop(a)"
        ]
    );

    // 돌려받은 값은 받은 쪽 변수가 주인이 된다
    {
        let c = Noisy("c");
        let c2 = give_back(c);
        log("got back");
        drop(c2);
        log("after drop");
    }
    assert_eq!(take_log(), ["got back", "drop(c)", "after drop"]);

    // 새 값을 대입하면 옛 값은 바로 drop된다
    {
        let mut v = Noisy("old");
        log(&format!("before {}", v.0));
        v = Noisy("new");
        log("after");
        let _ = &v;
    }
    assert_eq!(
        take_log(),
        ["before old", "drop(old)", "after", "drop(new)"]
    );

    // 부분 이동: 남은 필드만 범위 끝에서 drop된다
    {
        let p = Pair {
            first: Noisy("pf"),
            second: Noisy("ps"),
        };
        let moved = p.first;
        log("moved first");
        drop(moved);
        log("end of scope");
    }
    assert_eq!(
        take_log(),
        ["moved first", "drop(pf)", "end of scope", "drop(ps)"]
    );

    // Vec 원소는 앞에서부터
    {
        let _v = Vec::from([Noisy("v0"), Noisy("v1"), Noisy("v2")]);
        let _arr = [Noisy("a0"), Noisy("a1")];
    }
    assert_eq!(
        take_log(),
        ["drop(a0)", "drop(a1)", "drop(v0)", "drop(v1)", "drop(v2)"]
    );
}

fn main() {
    compile_checks();
    lint_checks();
    heap_checks();
    drop_order_checks();
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn move_keeps_pointer_and_drops_once() {
        {
            let a = Noisy("x");
            let b = a;
            log(b.0);
        }
        assert_eq!(take_log(), ["x", "drop(x)"]);
    }
}
```
{% endraw %}
