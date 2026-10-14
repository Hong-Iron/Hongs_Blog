---
layout: "note"
title: "22_traits-iterators-practice_p4.rs"
display_title: "22_traits-iterators-practice_p4.rs"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "22"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/traits-iterators-practice/"
parent_title: "트레이트와 반복자 연습"
description: "Rust · 트레이트와 반복자 연습 문제 4 풀이 코드"
permalink: "/studies/rust/code/22_traits-iterators-practice_p4/"
---
{% raw %}
[트레이트와 반복자 연습](/Hongs_Blog/studies/rust/traits-iterators-practice/) 문서의 문제 4 풀이 코드다.

```rust
//! 22 트레이트와 반복자 연습 p4: 대소문자를 가리지 않는 사용자 이름 키.
//! PartialEq·Eq·Hash·PartialOrd·Ord를 같은 기준(소문자)으로 맞춰 HashSet과 정렬이 함께 맞게 동작하게 한다.
//! 변형: Ord만 대소문자를 구별하게 두면 BTreeSet의 개수가 만드는 방법(collect·insert)에 따라 달라지는 것을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/22_traits-iterators-practice_p4.rs"

use std::cmp::Ordering;
use std::collections::{BTreeSet, HashSet};
use std::hash::{Hash, Hasher};

#[derive(Debug, Clone)]
struct Username(String);

impl Username {
    fn key(&self) -> impl Iterator<Item = u8> + '_ {
        self.0.bytes().map(|b| b.to_ascii_lowercase())
    }
}

impl PartialEq for Username {
    fn eq(&self, other: &Self) -> bool {
        self.0.eq_ignore_ascii_case(&other.0)
    }
}

impl Eq for Username {}

impl Hash for Username {
    fn hash<H: Hasher>(&self, state: &mut H) {
        for b in self.key() {
            state.write_u8(b);
        }
        state.write_u8(0xff);
    }
}

impl Ord for Username {
    fn cmp(&self, other: &Self) -> Ordering {
        self.key().cmp(other.key())
    }
}

impl PartialOrd for Username {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

/// 변형: Eq·Hash는 대소문자를 무시하는데 Ord만 원래 문자열로 비교한다(규칙 위반).
#[derive(Debug, Clone)]
struct CaseSensitiveOrd(String);

impl PartialEq for CaseSensitiveOrd {
    fn eq(&self, other: &Self) -> bool {
        self.0.eq_ignore_ascii_case(&other.0)
    }
}

impl Eq for CaseSensitiveOrd {}

impl Hash for CaseSensitiveOrd {
    fn hash<H: Hasher>(&self, state: &mut H) {
        for b in self.0.bytes() {
            state.write_u8(b.to_ascii_lowercase());
        }
        state.write_u8(0xff);
    }
}

impl Ord for CaseSensitiveOrd {
    fn cmp(&self, other: &Self) -> Ordering {
        self.0.cmp(&other.0)
    }
}

impl PartialOrd for CaseSensitiveOrd {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

/// 처음 나온 표기를 남기고 중복을 없앤 뒤, 대소문자를 무시한 사전 순으로 돌려준다.
fn unique_sorted(names: &[&str]) -> Vec<String> {
    let mut seen = HashSet::new();
    let mut kept: Vec<Username> = names
        .iter()
        .map(|n| Username(n.to_string()))
        .filter(|u| seen.insert(u.clone()))
        .collect();
    kept.sort();
    kept.into_iter().map(|u| u.0).collect()
}

fn main() {
    let input = ["Kim", "kim", "LEE", "Park", "lee", "KIM"];
    let out = unique_sorted(&input);
    println!("{out:?}");
    assert_eq!(out, ["Kim", "LEE", "Park"]);

    // HashSet과 BTreeSet이 같은 개수를 센다: Eq·Hash·Ord가 같은 기준이라서다.
    let h: HashSet<Username> = input.iter().map(|n| Username(n.to_string())).collect();
    let b: BTreeSet<Username> = input.iter().map(|n| Username(n.to_string())).collect();
    assert_eq!((h.len(), b.len()), (3, 3));
    println!("HashSet {}개, BTreeSet {}개", h.len(), b.len());

    // 변형: Ord만 어긋나면 결과가 정해지지 않는다. 같은 입력인데 만드는 방법에 따라 개수가 다르다.
    let h2: HashSet<CaseSensitiveOrd> = input
        .iter()
        .map(|n| CaseSensitiveOrd(n.to_string()))
        .collect();
    let b2: BTreeSet<CaseSensitiveOrd> = input
        .iter()
        .map(|n| CaseSensitiveOrd(n.to_string()))
        .collect();
    let mut b3: BTreeSet<CaseSensitiveOrd> = BTreeSet::new();
    for n in input {
        b3.insert(CaseSensitiveOrd(n.to_string()));
    }
    let o2: Vec<&str> = b2.iter().map(|u| u.0.as_str()).collect();
    let o3: Vec<&str> = b3.iter().map(|u| u.0.as_str()).collect();
    println!("변형: HashSet {}개", h2.len());
    println!("변형: BTreeSet collect {}개 {o2:?}", b2.len());
    println!("변형: BTreeSet insert {}개 {o3:?}", b3.len());
    assert_eq!(h2.len(), 3);
    // 아래 두 값은 rustc 1.99.0 표준 라이브러리에서 본 결과다. 규칙을 어긴 타입이라 약속된 값이 아니다.
    assert_eq!(o2, ["Kim", "LEE", "Park", "kim", "lee"]);
    assert_eq!(o3, ["KIM", "Kim", "LEE", "Park", "kim", "lee"]);
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::hash::DefaultHasher;

    fn h(u: &Username) -> u64 {
        let mut s = DefaultHasher::new();
        u.hash(&mut s);
        s.finish()
    }

    #[test]
    fn equal_means_same_hash() {
        let pairs = [("Kim", "KIM"), ("a", "A"), ("Rust", "rUST")];
        for (x, y) in pairs {
            let (a, b) = (Username(x.into()), Username(y.into()));
            assert_eq!(a, b);
            assert_eq!(h(&a), h(&b));
            assert_eq!(a.cmp(&b), Ordering::Equal);
        }
    }

    #[test]
    fn prefix_free() {
        // ("ab", "c")와 ("a", "bc")를 구별하기 위한 끝 표시
        let a = (Username("ab".into()), Username("c".into()));
        let b = (Username("a".into()), Username("bc".into()));
        let mut s1 = DefaultHasher::new();
        a.hash(&mut s1);
        let mut s2 = DefaultHasher::new();
        b.hash(&mut s2);
        assert_ne!(s1.finish(), s2.finish());
    }
}
```
{% endraw %}
