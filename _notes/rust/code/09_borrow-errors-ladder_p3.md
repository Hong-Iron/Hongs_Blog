---
layout: "note"
title: "09_borrow-errors-ladder_p3.rs"
display_title: "09_borrow-errors-ladder_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "09"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/borrow-errors-ladder/"
parent_title: "빌림 오류 고치기 예제 사다리"
description: "Rust · 빌림 오류 고치기 예제 사다리 문제 3 풀이 코드"
permalink: "/studies/rust/code/09_borrow-errors-ladder_p3/"
---
{% raw %}
[빌림 오류 고치기 예제 사다리](/Hongs_Blog/studies/rust/borrow-errors-ladder/) 문서의 문제 3 풀이 코드다.

```rust
//! 빌림 오류 고치기 예제 사다리 문제 3: 함수 안에서 만든 String을 가리키는 &str을 돌려주면 E0515.
//! 소유한 String을 돌려주거나, 입력에서 바로 잘라 돌려주면 고쳐진다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/09_borrow-errors-ladder_p3.rs"

use std::process::Command;

/// 코드 조각을 rustc로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vrL3_{}_{}", std::process::id(), code.len()));
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

const BROKEN: &str = r#"pub fn longest_line_upper(text: &str) -> &str {
    let upper = text.to_uppercase();
    upper.lines().max_by_key(|l| l.len()).unwrap_or("")
}"#;

/// 고친 버전 1: 새로 만든 글자는 소유한 String으로 돌려준다.
fn longest_line_upper(text: &str) -> String {
    text.lines()
        .max_by_key(|l| l.len())
        .unwrap_or("")
        .to_uppercase()
}

/// 고친 버전 2: 대문자로 바꿀 필요가 없다면 입력에서 잘라 돌려준다(수명 생략 규칙 2).
fn longest_line(text: &str) -> &str {
    text.lines().max_by_key(|l| l.len()).unwrap_or("")
}

fn main() {
    expect_error(
        BROKEN,
        "E0515",
        &[
            "cannot return value referencing local variable `upper`",
            "returns a value referencing data owned by the current function",
            "`upper` is borrowed here",
        ],
    );
    expect_ok(
        r#"pub fn longest_line_upper(text: &str) -> String { text.lines().max_by_key(|l| l.len()).unwrap_or("").to_uppercase() }"#,
    );
    let text = "ab\nlonger line\nmid";
    assert_eq!(longest_line_upper(text), "LONGER LINE");
    assert_eq!(longest_line(text), "longer line");
    assert_eq!(longest_line(""), "");
    // 돌려받은 슬라이스는 입력 버퍼 안을 가리킨다
    let at = longest_line(text).as_ptr() as usize - text.as_ptr() as usize;
    assert_eq!(at, 3);
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
