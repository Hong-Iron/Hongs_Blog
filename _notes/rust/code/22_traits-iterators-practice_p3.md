---
layout: "note"
title: "22_traits-iterators-practice_p3.rs"
display_title: "22_traits-iterators-practice_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "22"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/traits-iterators-practice/"
parent_title: "트레이트와 반복자 연습"
description: "Rust · 트레이트와 반복자 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/22_traits-iterators-practice_p3/"
---
{% raw %}
[트레이트와 반복자 연습](/Hongs_Blog/studies/rust/traits-iterators-practice/) 문서의 문제 3 풀이 코드다.

```rust
//! 22 트레이트와 반복자 연습 p3: 글에서 가장 많이 나온 단어 k개를 반복자와 HashMap으로 구한다.
//! 같은 횟수면 사전 순으로 앞선 단어가 먼저다.
//! 변형: 정렬 키에서 단어를 빼면 동점인 단어의 순서가 HashMap 순회 순서를 따라 실행마다 달라지는 것을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/22_traits-iterators-practice_p3.rs"

use std::cmp::Reverse;
use std::collections::HashMap;

fn top_words(text: &str, k: usize) -> Vec<(String, usize)> {
    let mut freq: HashMap<String, usize> = HashMap::new();
    for w in text
        .split(|c: char| !c.is_alphanumeric())
        .filter(|w| !w.is_empty())
        .map(str::to_lowercase)
    {
        *freq.entry(w).or_insert(0) += 1;
    }
    let mut pairs: Vec<(String, usize)> = freq.into_iter().collect();
    pairs.sort_by_key(|(w, n)| (Reverse(*n), w.clone()));
    pairs.into_iter().take(k).collect()
}

/// 변형: 횟수만 키로 쓴다. 정렬은 안정적이지만, 동점끼리의 처음 순서가 HashMap 순회 순서라 정해지지 않는다.
fn top_words_count_only(text: &str, k: usize) -> Vec<(String, usize)> {
    let mut freq: HashMap<String, usize> = HashMap::new();
    for w in text
        .split(|c: char| !c.is_alphanumeric())
        .filter(|w| !w.is_empty())
        .map(str::to_lowercase)
    {
        *freq.entry(w).or_insert(0) += 1;
    }
    let mut pairs: Vec<(String, usize)> = freq.into_iter().collect();
    pairs.sort_by_key(|(_, n)| Reverse(*n));
    pairs.into_iter().take(k).collect()
}

fn main() {
    let text = "The cat and the dog. And THE bird!";
    let top = top_words(text, 3);
    println!("{top:?}");
    assert_eq!(
        top,
        [
            ("the".to_string(), 3),
            ("and".to_string(), 2),
            ("bird".to_string(), 1)
        ]
    );

    // 변형: 셋째 자리에 오는 단어가 HashMap마다 달라진다(200번 중 두 가지 이상).
    let thirds: std::collections::BTreeSet<String> = (0..200)
        .map(|_| top_words_count_only(text, 3)[2].0.clone())
        .collect();
    println!("횟수만 키로 쓸 때 셋째 자리에 나온 단어: {thirds:?}");
    assert!(thirds.len() >= 2);
    assert!(
        thirds
            .iter()
            .all(|w| ["bird", "cat", "dog"].contains(&w.as_str()))
    );
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_text() {
        assert!(top_words("  ... !!", 3).is_empty());
    }

    #[test]
    fn k_larger_than_words() {
        assert_eq!(top_words("a b a", 10).len(), 2);
    }
}
```
{% endraw %}
