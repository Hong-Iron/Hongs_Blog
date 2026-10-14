---
layout: "note"
title: "09_borrow-errors-ladder_p4.rs"
display_title: "09_borrow-errors-ladder_p4.rs"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "09"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/borrow-errors-ladder/"
parent_title: "빌림 오류 고치기 예제 사다리"
description: "Rust · 빌림 오류 고치기 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/09_borrow-errors-ladder_p4/"
---
{% raw %}
[빌림 오류 고치기 예제 사다리](/Hongs_Blog/studies/rust/borrow-errors-ladder/) 문서의 문제 4 풀이 코드다.

```rust
//! 빌림 오류 고치기 예제 사다리 문제 4: self.items를 도는 동안 &mut self 메서드를 부르면 E0502.
//! 필드를 따로 빌리면 고쳐진다. 번호로 도는 반복문은 원소를 clone해야만 컴파일된다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/09_borrow-errors-ladder_p4.rs"

use std::process::Command;

/// 코드 조각을 rustc로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vrL4_{}_{}", std::process::id(), code.len()));
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

const BROKEN: &str = r#"pub struct Inventory { items: Vec<String>, log: Vec<String> }
impl Inventory {
    fn record(&mut self, msg: &str) { self.log.push(msg.to_string()); }
    pub fn audit(&mut self) {
        for item in &self.items {
            self.record(item);
        }
    }
}"#;

const FIXED: &str = r#"pub struct Inventory { items: Vec<String>, log: Vec<String> }
impl Inventory {
    pub fn audit(&mut self) {
        for item in &self.items {
            self.log.push(item.clone());
        }
    }
}"#;

struct Inventory {
    items: Vec<String>,
    log: Vec<String>,
}

/// 기록하는 일을 log 필드만 받는 함수로 뺀다.
fn record(log: &mut Vec<String>, msg: &str) {
    log.push(format!("checked {msg}"));
}

impl Inventory {
    fn audit(&mut self) {
        // self.items(공유)와 self.log(가변)는 서로 다른 필드라 함께 빌릴 수 있다
        for item in &self.items {
            record(&mut self.log, item);
        }
    }
}

fn main() {
    expect_error(
        BROKEN,
        "E0502",
        &[
            "cannot borrow `*self` as mutable because it is also borrowed as immutable",
            "this for loop borrows `*self` immutably, preventing mutation within its body",
            "immutable borrow occurs here",
            "immutable borrow later used here",
            "mutable borrow occurs here",
            "consider using an index-based loop instead, or collecting modifications into a separate collection",
        ],
    );
    expect_ok(FIXED);
    // 도움말대로 번호로 돌아도, 원소를 빌린 채 &mut self 메서드를 부르면 여전히 E0502다
    expect_error(
        r#"pub struct Inventory { items: Vec<String>, log: Vec<String> }
impl Inventory {
    fn record(&mut self, msg: &str) { self.log.push(msg.to_string()); }
    pub fn audit(&mut self) {
        for i in 0..self.items.len() {
            self.record(&self.items[i]);
        }
    }
}"#,
        "E0502",
        &[
            "cannot borrow `*self` as mutable because it is also borrowed as immutable",
            "immutable borrow later used by call",
        ],
    );
    expect_ok(
        r#"pub struct Inventory { items: Vec<String>, log: Vec<String> }
impl Inventory {
    fn record(&mut self, msg: &str) { self.log.push(msg.to_string()); }
    pub fn audit(&mut self) {
        for i in 0..self.items.len() {
            let item = self.items[i].clone();
            self.record(&item);
        }
    }
}"#,
    );
    let mut inv = Inventory {
        items: vec!["apple".to_string(), "pear".to_string()],
        log: Vec::new(),
    };
    inv.audit();
    assert_eq!(inv.log, ["checked apple", "checked pear"]);
    assert_eq!(inv.items.len(), 2);
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
