---
layout: "note"
title: "14_data-modeling-practice_p2.rs"
display_title: "14_data-modeling-practice_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "14"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/data-modeling-practice/"
parent_title: "데이터 모델링 연습"
description: "Rust · 데이터 모델링 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/14_data-modeling-practice_p2/"
---
{% raw %}
[데이터 모델링 연습](/Hongs_Blog/studies/rust/data-modeling-practice/) 문서의 문제 2 풀이 코드다.

```rust
//! p2 단어 빈도 상위 k개: HashMap entry로 세고, (개수 내림차순, 단어 오름차순)으로 정렬해
//! 실행할 때마다 같은 결과를 낸다. 변형: 키 함수가 원소를 빌린 &str을 돌려주면 컴파일되지 않고,
//! sort_by(비교 함수)와 sort_by_cached_key는 clone 없이 또는 키를 한 번만 만들어 같은 결과를 낸다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/14_data-modeling-practice_p2.rs"

use std::cmp::Reverse;
use std::collections::HashMap;

const TAG: &str = "p2";

/// 코드 조각을 rustc로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let dir =
        std::env::temp_dir().join(format!("vrM{}_{}_{}", TAG, std::process::id(), code.len()));
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
    let _ = std::fs::remove_dir_all(&dir);
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn expect_phrases(code: &str, phrases: &[&str]) {
    let stderr = compile_errors(code);
    for phrase in phrases {
        assert!(stderr.contains(phrase), "'{phrase}' 기대, 실제:\n{stderr}");
        println!("컴파일 확인: {phrase}");
    }
}

fn top_k(text: &str, k: usize) -> Vec<(String, usize)> {
    let mut counts: HashMap<String, usize> = HashMap::new();
    for raw in text.split_whitespace() {
        let word = raw
            .trim_matches(|c: char| !c.is_alphanumeric())
            .to_lowercase();
        if word.is_empty() {
            continue;
        }
        *counts.entry(word).or_insert(0) += 1;
    }
    let mut pairs: Vec<(String, usize)> = counts.into_iter().collect();
    pairs.sort_by_key(|(w, c)| (Reverse(*c), w.clone()));
    pairs.truncate(k);
    pairs
}

/// 변형 1: 비교 함수로 정렬하면 단어를 clone하지 않는다.
fn sort_cmp(pairs: &mut [(String, usize)]) {
    pairs.sort_by(|(wa, ca), (wb, cb)| cb.cmp(ca).then_with(|| wa.cmp(wb)));
}

/// 변형 2: 키를 원소마다 한 번만 만든다.
fn sort_cached(pairs: &mut [(String, usize)]) {
    pairs.sort_by_cached_key(|(w, c)| (Reverse(*c), w.clone()));
}

fn main() {
    let got = top_k("The cat and the hat, and THE bat!", 2);
    println!("{got:?}");
    assert_eq!(got, vec![("the".to_string(), 3), ("and".to_string(), 2)]);

    // 개수가 같으면 단어 순서
    let got = top_k("b a c b a c d", 3);
    assert_eq!(
        got,
        vec![
            ("a".to_string(), 2),
            ("b".to_string(), 2),
            ("c".to_string(), 2)
        ]
    );

    // k가 단어 수보다 크면 있는 만큼
    assert_eq!(top_k("x y", 10).len(), 2);
    assert!(top_k("... !!!", 3).is_empty());

    // 같은 입력을 100번 돌려도 결과가 같다(HashMap 순서에 기대지 않는다)
    let first = top_k("q w e r t y q w e q", 4);
    for _ in 0..100 {
        assert_eq!(top_k("q w e r t y q w e q", 4), first);
    }
    println!("{first:?}");

    // 변형: 키 함수가 원소 안의 &str을 돌려주면 수명 오류
    expect_phrases(
        r#"use std::cmp::Reverse;
pub fn f(pairs: &mut Vec<(String, usize)>) {
    pairs.sort_by_key(|(w, c)| (Reverse(*c), w.as_str()));
}"#,
        &[
            "error: lifetime may not live long enough",
            "returning this value requires that `'1` must outlive `'2`",
        ],
    );
    let base: Vec<(String, usize)> = [("b", 2), ("a", 2), ("z", 5), ("c", 1), ("y", 5)]
        .iter()
        .map(|(w, c)| (w.to_string(), *c))
        .collect();
    let mut by_key = base.clone();
    by_key.sort_by_key(|(w, c)| (Reverse(*c), w.clone()));
    let mut by_cmp = base.clone();
    sort_cmp(&mut by_cmp);
    let mut by_cached = base.clone();
    sort_cached(&mut by_cached);
    assert_eq!(by_key, by_cmp);
    assert_eq!(by_key, by_cached);
    println!("{by_cmp:?}");
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_from_problem() {
        assert_eq!(
            top_k("The cat and the hat, and THE bat!", 2),
            vec![("the".to_string(), 3), ("and".to_string(), 2)]
        );
    }
}
```
{% endraw %}
