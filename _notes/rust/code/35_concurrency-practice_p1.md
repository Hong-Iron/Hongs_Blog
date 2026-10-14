---
layout: "note"
title: "35_concurrency-practice_p1.rs"
display_title: "35_concurrency-practice_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "35"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/concurrency-practice/"
parent_title: "동시성 연습"
description: "Rust · 동시성 연습 문제 1 풀이 코드"
permalink: "/studies/rust/code/35_concurrency-practice_p1/"
---
{% raw %}
[동시성 연습](/Hongs_Blog/studies/rust/concurrency-practice/) 문서의 문제 1 풀이 코드다.

```rust
//! 동시성 연습 p1: 컴파일되지 않는 병렬 글자 세기를 고친 답.
//! 처음 코드(Rc<RefCell<..>> + thread::spawn)가 E0277로 막히는 것, Arc<Mutex<..>>로만 바꾸면 E0521이 남는 것,
//! 고친 두 답이 같은 결과를 내는 것을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/35_concurrency-practice_p1.rs"

use std::sync::Mutex;
use std::thread;

fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vrp1_{}_{}", std::process::id(), code.len()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new("rustc")
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
    String::from_utf8_lossy(&out.stderr).into_owned()
}

const BROKEN: &str = r#"
use std::cell::RefCell;
use std::rc::Rc;
use std::thread;

pub fn letter_counts(texts: &[&str]) -> [usize; 26] {
    let counts = Rc::new(RefCell::new([0usize; 26]));
    let mut handles = Vec::new();
    for t in texts {
        let counts = Rc::clone(&counts);
        handles.push(thread::spawn(move || {
            for b in t.bytes().filter(u8::is_ascii_lowercase) {
                counts.borrow_mut()[(b - b'a') as usize] += 1;
            }
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
    *counts.borrow()
}
"#;

/// Rc<RefCell>만 Arc<Mutex>로 바꾼 판: Send 문제는 풀리지만 빌린 texts가 'static이 아니다.
const HALF_FIXED: &str = r#"
use std::sync::{Arc, Mutex};
use std::thread;

pub fn letter_counts(texts: &[&str]) -> [usize; 26] {
    let counts = Arc::new(Mutex::new([0usize; 26]));
    let mut handles = Vec::new();
    for t in texts {
        let counts = Arc::clone(&counts);
        handles.push(thread::spawn(move || {
            for b in t.bytes().filter(u8::is_ascii_lowercase) {
                counts.lock().unwrap()[(b - b'a') as usize] += 1;
            }
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
    *counts.lock().unwrap()
}
"#;

fn count_one(t: &str) -> [usize; 26] {
    let mut c = [0usize; 26];
    for b in t.bytes().filter(u8::is_ascii_lowercase) {
        c[(b - b'a') as usize] += 1;
    }
    c
}

/// 답 A: 스레드마다 자기 배열을 세어 돌려주고, join한 쪽이 더한다. 잠금이 없다.
fn letter_counts_join(texts: &[&str]) -> [usize; 26] {
    thread::scope(|s| {
        let hs: Vec<_> = texts.iter().map(|t| s.spawn(|| count_one(t))).collect();
        let mut total = [0usize; 26];
        for h in hs {
            for (sum, x) in total.iter_mut().zip(h.join().unwrap()) {
                *sum += x;
            }
        }
        total
    })
}

/// 답 B: 공유 배열을 Mutex로 감싼다. 각 스레드는 다 센 뒤 한 번만 잠근다.
fn letter_counts_mutex(texts: &[&str]) -> [usize; 26] {
    let total = Mutex::new([0usize; 26]);
    thread::scope(|s| {
        for t in texts {
            let total = &total;
            s.spawn(move || {
                let local = count_one(t);
                let mut g = total.lock().unwrap();
                for (sum, x) in g.iter_mut().zip(local) {
                    *sum += x;
                }
            });
        }
    });
    total.into_inner().unwrap()
}

fn main() {
    let errs = compile_errors(BROKEN);
    assert!(errs.contains("error[E0277]"));
    assert!(errs.contains("`Rc<RefCell<[usize; 26]>>` cannot be sent between threads safely"));
    println!("broken: E0277 Rc<RefCell<..>> cannot be sent between threads safely");
    let half = compile_errors(HALF_FIXED);
    assert!(half.contains("error[E0521]"));
    assert!(half.contains("borrowed data escapes outside of function"));
    assert!(!half.contains("E0277"));
    println!("Arc<Mutex<..>> + thread::spawn: E0521 borrowed data escapes (texts is not 'static)");

    let texts = ["hello world", "rust threads", "abc xyz", ""];
    let a = letter_counts_join(&texts);
    let b = letter_counts_mutex(&texts);
    let seq = texts.iter().fold([0usize; 26], |mut acc, t| {
        for (s, x) in acc.iter_mut().zip(count_one(t)) {
            *s += x;
        }
        acc
    });
    assert_eq!(a, seq);
    assert_eq!(b, seq);
    let l = a[(b'l' - b'a') as usize];
    let total: usize = a.iter().sum();
    assert_eq!((l, total), (3, 27));
    println!("answer A == answer B == sequential; 'l' = {l}, letters = {total}");
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_input() {
        assert_eq!(letter_counts_join(&[]), [0; 26]);
        assert_eq!(letter_counts_mutex(&[]), [0; 26]);
    }
}
```
{% endraw %}
