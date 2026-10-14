---
layout: "note"
title: "09_borrow-errors-ladder_p1.rs"
display_title: "09_borrow-errors-ladder_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "09"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/borrow-errors-ladder/"
parent_title: "빌림 오류 고치기 예제 사다리"
description: "Rust · 빌림 오류 고치기 예제 사다리 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/09_borrow-errors-ladder_p1/"
---
{% raw %}
[빌림 오류 고치기 예제 사다리](/Hongs_Blog/studies/rust/borrow-errors-ladder/) 문서의 문제 1 풀이 코드다.

```rust
//! 빌림 오류 고치기 예제 사다리 문제 1: 앞 칸의 참조를 쥔 채 push하면 E0502. 값을 복사해 두면 고쳐진다.
//! 순서를 바꿔도 고쳐지고, 원소가 String이면 복사가 안 되어(E0507) clone이 필요하다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/09_borrow-errors-ladder_p1.rs"

use std::process::Command;

/// 코드 조각을 rustc로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vrL1_{}_{}", std::process::id(), code.len()));
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

/// 오류 코드와, 문서에 옮긴 메시지 조각(본문·라벨·도움말)이 모두 나오는지 확인한다.
fn expect_error(code: &str, err: &str, phrases: &[&str]) {
    let stderr = compile_errors(code);
    assert!(
        stderr.contains(&format!("error[{err}]")),
        "{err} 기대, 실제:\n{stderr}"
    );
    for phrase in phrases {
        assert!(stderr.contains(phrase), "'{phrase}' 기대, 실제:\n{stderr}");
        println!("{err} 확인: {phrase}");
    }
}

fn expect_ok(code: &str) {
    let stderr = compile_errors(code);
    assert!(
        !stderr.contains("error"),
        "컴파일 성공 기대, 실제:\n{stderr}"
    );
}

const BROKEN: &str = r#"pub fn push_and_report(v: &mut Vec<i32>, x: i32) -> i32 {
    let first = &v[0];
    v.push(x);
    *first
}"#;

const FIXED: &str = r#"pub fn push_and_report(v: &mut Vec<i32>, x: i32) -> i32 {
    let first = v[0];
    v.push(x);
    first
}"#;

/// 고친 버전: 첫 값을 복사해 두고 push한다.
fn push_and_report(v: &mut Vec<i32>, x: i32) -> i32 {
    let first = v[0];
    v.push(x);
    first
}

fn main() {
    expect_error(
        BROKEN,
        "E0502",
        &[
            "cannot borrow `*v` as mutable because it is also borrowed as immutable",
            "immutable borrow occurs here",
            "mutable borrow occurs here",
            "immutable borrow later used here",
        ],
    );
    expect_ok(FIXED);
    // 다른 고침: push를 먼저 하고 그 뒤에 읽는다
    expect_ok(r#"pub fn push_and_report(v: &mut Vec<i32>, x: i32) -> i32 { v.push(x); v[0] }"#);
    // 원소가 String이면 복사해 꺼낼 수 없다. 도움말의 첫 제안(&v[0])은 처음 오류로 돌아간다
    expect_error(
        r#"pub fn push_and_report(v: &mut Vec<String>, x: String) -> String {
    let first = v[0];
    v.push(x);
    first
}"#,
        "E0507",
        &[
            "cannot move out of index of `Vec<String>`",
            "consider borrowing here",
            "consider cloning the value if the performance cost is acceptable",
        ],
    );
    expect_ok(
        r#"pub fn push_and_report(v: &mut Vec<String>, x: String) -> String {
    let first = v[0].clone();
    v.push(x);
    first
}"#,
    );
    let mut v = vec![10, 20, 30, 40];
    assert_eq!(push_and_report(&mut v, 50), 10);
    assert_eq!(v, [10, 20, 30, 40, 50]);
    // push가 버퍼를 옮겨도 복사해 둔 값은 그대로다
    let mut w = Vec::with_capacity(1);
    w.push(7);
    let before = w.as_ptr();
    assert_eq!(push_and_report(&mut w, 8), 7);
    println!("buffer moved: {}", before != w.as_ptr());
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
