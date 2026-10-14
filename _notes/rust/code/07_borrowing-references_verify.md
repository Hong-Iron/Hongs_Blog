---
layout: "note"
title: "07_borrowing-references_verify.rs"
display_title: "07_borrowing-references_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/borrowing-references/"
parent_title: "빌림과 참조"
description: "Rust · 빌림과 참조 검증 코드"
sitemap: false
permalink: "/studies/rust/code/07_borrowing-references_verify/"
---
{% raw %}
[빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/) 문서의 검증 코드다.

```rust
//! 빌림과 참조 문서의 주장을 확인한다: 공유 참조 여럿 또는 가변 참조 하나 규칙의 오류 코드(E0499·E0502·E0596·E0506·E0505),
//! 빌림이 마지막 사용에서 끝나는 것(NLL), 다시 빌리기(reborrow), 두 단계 빌림, 필드별 빌림, 참조의 크기.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/07_borrowing-references_verify.rs"

use std::process::Command;
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

/// 코드 조각을 rustc로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::SeqCst);
    let dir = std::env::temp_dir().join(format!("vr07_{}_{n}", std::process::id()));
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

fn compile_checks() {
    // 가변 참조 둘을 동시에
    expect_error(
        r#"pub fn f(){ let mut s=String::new(); let a=&mut s; let b=&mut s; a.push('x'); b.push('y'); }"#,
        "E0499",
        "cannot borrow `s` as mutable more than once at a time",
    );
    // 공유 참조가 살아 있는데 가변으로 빌림
    expect_error(
        r#"pub fn f(){ let mut v=vec![1]; let first=&v[0]; v.push(2); println!("{first}"); }"#,
        "E0502",
        "cannot borrow `v` as mutable because it is also borrowed as immutable",
    );
    // 공유 참조로 고치기
    expect_error(
        r#"pub fn f(s:&String){ s.push_str("x"); }"#,
        "E0596",
        "cannot borrow `*s` as mutable, as it is behind a `&` reference",
    );
    // 빌려 준 동안 원래 변수에 대입
    expect_error(
        r#"pub fn f(){ let mut x=1; let r=&x; x=5; println!("{r} {x}"); }"#,
        "E0506",
        "cannot assign to `x` because it is borrowed",
    );
    // 빌려 준 동안 원래 값을 옮김
    expect_error(
        r#"pub fn f(){ let s=String::new(); let r=&s; let t=s; println!("{r} {t}"); }"#,
        "E0505",
        "cannot move out of `s` because it is borrowed",
    );
    // 반복하는 동안 같은 Vec에 넣기
    expect_error(
        r#"pub fn f(){ let mut v=vec![1,2]; for x in &v { if *x>0 { v.push(*x); } } }"#,
        "E0502",
        "cannot borrow `v` as mutable because it is also borrowed as immutable",
    );
    // Nomicon의 compute(&x, &mut x)는 부를 수 없다
    expect_error(
        r#"fn compute(input:&u32, output:&mut u32){ if *input>10 { *output=1; } if *input>5 { *output*=2; } }
           pub fn f(){ let mut x=20; compute(&x, &mut x); }"#,
        "E0502",
        "cannot borrow `x` as mutable because it is also borrowed as immutable",
    );
    // NLL: 마지막 사용 뒤에는 가변으로 빌릴 수 있다
    expect_ok(
        r#"pub fn f(){ let mut s=String::from("a"); let r1=&s; let r2=&s; println!("{r1}{r2}"); let r3=&mut s; r3.push('b'); }"#,
    );
    // 함수에 &mut를 넘기면 자동으로 다시 빌린다: 같은 r를 두 번 넘길 수 있다
    expect_ok(
        r#"fn add(v:&mut Vec<i32>){v.push(1);} pub fn f(){ let mut v=vec![]; let r=&mut v; add(r); add(r); r.push(3); }"#,
    );
    // let으로 그냥 옮기면 &mut는 이동한다(Copy가 아니다)
    expect_error(
        r#"pub fn f(){ let mut v=vec![1]; let r=&mut v; let r2=r; r2.push(1); r.push(2); }"#,
        "E0382",
        "borrow of moved value: `r`",
    );
    // 공유 참조는 Copy라서 대입해도 둘 다 쓸 수 있다
    expect_ok(r#"pub fn f(){ let v=vec![1]; let r=&v; let r2=r; println!("{r:?}{r2:?}"); }"#);
    // 명시적으로 다시 빌린 r2를 다 쓰고 나면 r를 다시 쓸 수 있다
    expect_ok(
        r#"pub fn f(){ let mut v=vec![1]; let r=&mut v; let r2=&mut *r; r2.push(1); r.push(2); }"#,
    );
    // r2가 아직 살아 있는데 r를 쓰면 E0499
    expect_error(
        r#"pub fn f(){ let mut v=vec![1]; let r=&mut v; let r2=&mut *r; r.push(2); r2.push(1); }"#,
        "E0499",
        "cannot borrow `*r` as mutable more than once at a time",
    );
    // 두 단계 빌림: v.push(v.len())는 된다
    expect_ok(r#"pub fn f(){ let mut v=vec![1usize]; v.push(v.len()); }"#);
    // 서로 다른 필드는 따로 가변으로 빌릴 수 있다
    expect_ok(
        r#"pub struct P{pub x:i32,pub y:i32} pub fn f(p:&mut P){ let a=&mut p.x; let b=&mut p.y; *a+=1; *b+=1; }"#,
    );
    // 메서드로 빌리면 self 전체를 빌린 것이 된다
    expect_error(
        r#"pub struct P{x:i32,y:i32} impl P{ fn xm(&mut self)->&mut i32{&mut self.x} fn ym(&mut self)->&mut i32{&mut self.y} }
           pub fn f(p:&mut P){ let a=p.xm(); let b=p.ym(); *a+=1; *b+=1; }"#,
        "E0499",
        "cannot borrow `*p` as mutable more than once at a time",
    );
}

fn lint_checks() {
    let n = SNIPPET.fetch_add(1, Ordering::SeqCst);
    let dir = std::env::temp_dir().join(format!("vr07c_{}_{n}", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(
        &file,
        "fn len(s: &str) -> usize { s.len() }\npub fn f(s: &str) -> usize { len(&s) }",
    )
    .unwrap();
    let out = Command::new("clippy-driver")
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
        .expect("clippy-driver 실행");
    let _ = std::fs::remove_dir_all(&dir);
    let stderr = String::from_utf8_lossy(&out.stderr);
    assert!(stderr.contains("clippy::needless_borrow"), "{stderr}");
    println!("clippy needless_borrow 기본 경고 확인");
}

fn add_one(v: &mut Vec<i32>) {
    v.push(1);
}

fn runtime_checks() {
    // 참조는 주소 하나 크기다
    assert_eq!(std::mem::size_of::<&String>(), std::mem::size_of::<usize>());
    assert_eq!(
        std::mem::size_of::<&mut i32>(),
        std::mem::size_of::<usize>()
    );

    // NLL 예
    let mut s = String::from("hello");
    let r1 = &s;
    let r2 = &s;
    let both = format!("{r1} and {r2}");
    let r3 = &mut s;
    r3.push('!');
    assert_eq!((both.as_str(), s.as_str()), ("hello and hello", "hello!"));

    // 자동 다시 빌리기
    let mut v = Vec::new();
    let r = &mut v;
    add_one(r);
    add_one(r);
    r.push(3);
    assert_eq!(v, [1, 1, 3]);

    // 한 슬라이스의 두 칸을 동시에 가변으로: split_at_mut
    let mut a = [10, 20, 30, 40];
    let (left, right) = a.split_at_mut(2);
    std::mem::swap(&mut left[0], &mut right[1]);
    assert_eq!(a, [40, 20, 30, 10]);

    // 두 단계 빌림
    let mut w = vec![7usize];
    w.push(w.len());
    assert_eq!(w, [7, 1]);
    println!("runtime: NLL, reborrow, split_at_mut, two-phase ok");
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
    fn reborrow_lets_us_pass_twice() {
        let mut v = Vec::new();
        let r = &mut v;
        add_one(r);
        add_one(r);
        assert_eq!(v.len(), 2);
    }
}
```
{% endraw %}
