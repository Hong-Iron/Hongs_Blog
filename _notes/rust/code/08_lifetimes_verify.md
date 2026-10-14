---
layout: "note"
title: "08_lifetimes_verify.rs"
display_title: "08_lifetimes_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/lifetimes/"
parent_title: "수명"
description: "Rust · 수명 검증 코드"
sitemap: false
permalink: "/studies/rust/code/08_lifetimes_verify/"
---
{% raw %}
[수명](/Hongs_Blog/studies/rust/lifetimes/) 문서의 검증 코드다.

```rust
//! 수명 문서의 주장을 확인한다: 지역 변수의 참조를 돌려줄 때의 오류(E0106·E0515), 짧게 사는 값의 참조(E0597),
//! 수명 생략 세 규칙, 'static 경계(E0597·E0373), 2021과 2024 에디션의 impl Trait 수명 캡처 차이(E0700, use<>),
//! clippy의 needless_lifetimes. 실행 부분은 longest, 구조체 수명, 메서드의 수명 생략, Box::leak을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/08_lifetimes_verify.rs"

use std::process::Command;
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

/// 코드 조각을 tool(rustc 또는 clippy-driver)로 컴파일해 stderr를 돌려준다.
fn compile_with(tool: &str, edition: &str, code: &str, extra: &[&str]) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::SeqCst);
    let dir = std::env::temp_dir().join(format!("vr08_{}_{n}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = Command::new(tool)
        .args([
            "--edition",
            edition,
            "--crate-type=lib",
            "--emit=metadata",
            "--out-dir",
        ])
        .arg(&dir)
        .args(extra)
        .arg(&file)
        .output()
        .expect("컴파일러 실행");
    let _ = std::fs::remove_dir_all(&dir);
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn expect_error_ed(edition: &str, code: &str, err: &str, phrase: &str) {
    let stderr = compile_with("rustc", edition, code, &[]);
    assert!(
        stderr.contains(&format!("error[{err}]")),
        "{err} 기대({edition}), 실제:\n{stderr}"
    );
    assert!(stderr.contains(phrase), "'{phrase}' 기대, 실제:\n{stderr}");
    println!("{err} 확인 ({edition}): {phrase}");
}

fn expect_error(code: &str, err: &str, phrase: &str) {
    expect_error_ed("2024", code, err, phrase);
}

fn expect_ok_ed(edition: &str, code: &str) {
    let stderr = compile_with("rustc", edition, code, &[]);
    assert!(
        !stderr.contains("error"),
        "컴파일 성공 기대({edition}), 실제:\n{stderr}"
    );
}

fn expect_ok(code: &str) {
    expect_ok_ed("2024", code);
}

const EVENS: &str =
    r#"pub fn evens(v:&[i32])->impl Iterator<Item=i32>{ v.iter().copied().filter(|x| x%2==0) }"#;
const LEN_OF: &str = r#"pub fn len_of(x:&str)->impl Fn()->usize{ let n=x.len(); move || n }
pub fn g()->usize{ let f={ let s=String::from("hi"); len_of(&s) }; f() }"#;
const LEN_OF_USE: &str = r#"pub fn len_of(x:&str)->impl Fn()->usize + use<>{ let n=x.len(); move || n }
pub fn g()->usize{ let f={ let s=String::from("hi"); len_of(&s) }; f() }"#;

fn compile_checks() {
    // 지역 String의 참조를 돌려주려 함: 입력 참조가 없으니 수명을 정할 수 없다
    expect_error(
        r#"pub fn dangle() -> &String { let s=String::from("hi"); &s }"#,
        "E0106",
        "there is no value for it to be borrowed from",
    );
    // 입력 참조가 둘이면 어느 쪽인지 모른다
    expect_error(
        r#"pub fn longest(x:&str,y:&str)->&str{ if x.len()>y.len(){x}else{y} }"#,
        "E0106",
        "but the signature does not say whether it is borrowed from `x` or `y`",
    );
    // 수명을 적어도 지역 변수를 가리키면 E0515
    expect_error(
        r#"pub fn f<'a>(_x:&'a str)->&'a str{ let s=String::from("hi"); &s }"#,
        "E0515",
        "cannot return reference to local variable `s`",
    );
    // 'static을 붙여도 같다
    expect_error(
        r#"pub fn f()->&'static str{ let s=String::from("a"); &s }"#,
        "E0515",
        "returns a reference to data owned by the current function",
    );
    // 안쪽 블록의 x를 바깥 r가 가리킨다
    expect_error(
        r#"pub fn f(){ let r; { let x=5; r=&x; } println!("{r}"); }"#,
        "E0597",
        "`x` does not live long enough",
    );
    // longest의 결과를 string2보다 오래 쓴다
    expect_error(
        r#"fn longest<'a>(x:&'a str,y:&'a str)->&'a str{ if x.len()>y.len(){x}else{y} }
           pub fn f(){ let s1=String::from("long string"); let result; { let s2=String::from("xyz"); result=longest(s1.as_str(),s2.as_str()); } println!("{result}"); }"#,
        "E0597",
        "`s2` does not live long enough",
    );
    // 참조를 담는 구조체에는 수명 매개변수가 필요하다
    expect_error(
        r#"pub struct Excerpt{ pub part:&str }"#,
        "E0106",
        "missing lifetime specifier",
    );
    // 규칙 1·2: 입력 참조가 하나면 출력도 그 수명
    expect_ok(r#"pub fn first_word(s:&str)->&str{ s.split(' ').next().unwrap_or("") }"#);
    // 규칙 3: &self가 있으면 출력은 self의 수명 (다른 입력 참조가 있어도)
    expect_ok(
        r#"pub struct W{ v:Vec<i32> } impl W{ pub fn get(&self, _k:&str)->&i32{ &self.v[0] } }"#,
    );
    // 규칙 3이 원하는 것과 다르면 컴파일러가 막는다: 인자의 참조를 돌려주려 할 때
    let pick = compile_with(
        "rustc",
        "2024",
        r#"pub struct W; impl W{ pub fn pick(&self, k:&str)->&str{ k } }"#,
        &[],
    );
    assert!(
        pick.contains("error: lifetime may not live long enough"),
        "{pick}"
    );
    println!("규칙 3 확인: pick은 k를 돌려줄 수 없다");
    // 출력이 한쪽에서만 오면 그쪽에만 수명을 단다
    expect_ok(r#"pub fn first<'a>(a:&'a str,_b:&str)->&'a str{ a }"#);
    // T: 'static 경계에 지역 변수의 참조를 넣으면 E0597
    expect_error(
        r#"fn keep<T:'static>(_t:T){} pub fn f(){ let x=5; keep(&x); }"#,
        "E0597",
        "argument requires that `x` is borrowed for `'static`",
    );
    // thread::spawn은 'static을 요구한다
    expect_error(
        r#"pub fn f(){ let v=vec![1]; let h=std::thread::spawn(|| v.len()); h.join().unwrap(); }"#,
        "E0373",
        "closure may outlive the current function, but it borrows `v`",
    );
    // impl Trait 수명 캡처: 2021은 E0700, 2024는 통과
    expect_error_ed(
        "2021",
        EVENS,
        "E0700",
        "captures lifetime that does not appear in bounds",
    );
    expect_ok_ed("2024", EVENS);
    // 2024는 모든 수명을 캡처하므로 필요 없는 캡처가 생길 수 있다
    expect_ok_ed("2021", LEN_OF);
    expect_error_ed(
        "2024",
        LEN_OF,
        "E0597",
        "Rust 2024 has adjusted the `impl Trait` lifetime capture rules",
    );
    // use<>로 아무것도 캡처하지 않는다고 밝히면 통과
    expect_ok_ed("2024", LEN_OF_USE);
}

fn lint_checks() {
    let out = compile_with(
        "clippy-driver",
        "2024",
        r#"pub fn same<'a>(s:&'a str)->&'a str{ s }"#,
        &[],
    );
    assert!(out.contains("clippy::needless_lifetimes"), "{out}");
    println!("clippy needless_lifetimes 기본 경고 확인");
}

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

struct Excerpt<'a> {
    part: &'a str,
}

impl Excerpt<'_> {
    // 규칙 3: 돌려주는 &str은 self의 수명을 받는다
    fn announce_and_return(&self, announcement: &str) -> &str {
        assert!(!announcement.is_empty());
        self.part
    }
}

fn runtime_checks() {
    let s1 = String::from("long string is long");
    let r;
    {
        let s2 = String::from("xyz");
        let inner = longest(s1.as_str(), s2.as_str());
        assert_eq!(inner, "long string is long");
        r = longest(s1.as_str(), "literal is 'static");
    }
    assert_eq!(r, "long string is long");

    let novel = String::from("Call me Ishmael. Some years ago...");
    let first = novel.split('.').next().unwrap();
    let e = Excerpt { part: first };
    assert_eq!(e.announce_and_return("hi"), "Call me Ishmael");

    let s: &'static str = "I have a static lifetime.";
    let leaked: &'static mut Vec<i32> = Box::leak(Box::new(vec![1, 2]));
    leaked.push(3);
    assert_eq!((s.len(), leaked.len()), (25, 3));
    println!("runtime: longest, Excerpt, 'static ok");
}

fn main() {
    compile_checks();
    lint_checks();
    runtime_checks();
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn longest_picks_longer() {
        assert_eq!(longest("ab", "abc"), "abc");
        assert_eq!(longest("abc", "ab"), "abc");
        assert_eq!(longest("ab", "cd"), "cd");
    }
}
```
{% endraw %}
