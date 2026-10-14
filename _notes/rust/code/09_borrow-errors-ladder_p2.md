---
layout: "note"
title: "09_borrow-errors-ladder_p2.rs"
display_title: "09_borrow-errors-ladder_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "09"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/borrow-errors-ladder/"
parent_title: "빌림 오류 고치기 예제 사다리"
description: "Rust · 빌림 오류 고치기 예제 사다리 문제 2 풀이 코드"
permalink: "/studies/rust/code/09_borrow-errors-ladder_p2/"
---
{% raw %}
[빌림 오류 고치기 예제 사다리](/Hongs_Blog/studies/rust/borrow-errors-ladder/) 문서의 문제 2 풀이 코드다.

```rust
//! 빌림 오류 고치기 예제 사다리 문제 2: 한 Vec의 두 칸을 &mut로 동시에 빌리면 E0499. swap이나 split_at_mut로 고친다.
//! 길이 검사를 빼면 빈 슬라이스에서 n - 1이 넘쳐 panic한다(dev 빌드).
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/09_borrow-errors-ladder_p2.rs"

use std::process::Command;

/// 코드 조각을 rustc로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vrL2_{}_{}", std::process::id(), code.len()));
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

const BROKEN: &str = r#"pub fn swap_ends(v: &mut Vec<i32>) {
    let n = v.len();
    let a = &mut v[0];
    let b = &mut v[n - 1];
    std::mem::swap(a, b);
}"#;

/// 고친 버전 1: 표준 라이브러리의 swap.
fn swap_ends(v: &mut [i32]) {
    if v.len() >= 2 {
        let n = v.len();
        v.swap(0, n - 1);
    }
}

/// 고친 버전 2: split_at_mut로 겹치지 않는 두 조각을 받는다.
fn swap_ends_split(v: &mut [i32]) {
    if v.len() >= 2 {
        let n = v.len();
        let (left, right) = v.split_at_mut(n - 1);
        std::mem::swap(&mut left[0], &mut right[0]);
    }
}

/// 길이 검사를 뺀 판: 빈 슬라이스에서 n - 1이 넘친다.
fn swap_ends_unguarded(v: &mut [i32]) {
    let n = v.len();
    v.swap(0, n - 1);
}

fn panic_message(f: impl FnOnce() + std::panic::UnwindSafe) -> String {
    let err = std::panic::catch_unwind(f).expect_err("panic 기대");
    if let Some(s) = err.downcast_ref::<String>() {
        s.clone()
    } else {
        (*err.downcast_ref::<&str>().unwrap()).to_string()
    }
}

fn main() {
    expect_error(
        BROKEN,
        "E0499",
        &[
            "cannot borrow `*v` as mutable more than once at a time",
            "first mutable borrow occurs here",
            "second mutable borrow occurs here",
            "first borrow later used here",
            "use `.split_at_mut(position)` to obtain two mutable non-overlapping sub-slices",
        ],
    );
    expect_ok(
        r#"pub fn swap_ends(v: &mut [i32]) { if v.len() >= 2 { let n = v.len(); v.swap(0, n - 1); } }"#,
    );
    let mut a = vec![1, 2, 3, 4];
    swap_ends(&mut a);
    assert_eq!(a, [4, 2, 3, 1]);
    swap_ends_split(&mut a);
    assert_eq!(a, [1, 2, 3, 4]);
    let mut one = [9];
    swap_ends(&mut one);
    swap_ends_split(&mut one);
    assert_eq!(one, [9]);
    let mut empty: [i32; 0] = [];
    swap_ends(&mut empty);
    swap_ends_split(&mut empty);
    let mut one2 = [9];
    swap_ends_unguarded(&mut one2);
    assert_eq!(one2, [9]);
    std::panic::set_hook(Box::new(|_| {}));
    let msg = panic_message(|| {
        let mut e: [i32; 0] = [];
        swap_ends_unguarded(&mut e);
    });
    let _ = std::panic::take_hook();
    println!("unguarded empty: {msg}");
    assert!(msg.contains("attempt to subtract with overflow"));
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
