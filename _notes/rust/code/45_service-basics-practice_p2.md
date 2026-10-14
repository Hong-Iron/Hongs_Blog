---
layout: "note"
title: "45_service-basics-practice_p2.rs"
display_title: "45_service-basics-practice_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "45"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/service-basics-practice/"
parent_title: "서비스 기초 연습"
description: "Rust · 서비스 기초 연습 문제 2 풀이 코드"
permalink: "/studies/rust/code/45_service-basics-practice_p2/"
---
{% raw %}
[서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/) 문서의 문제 2 풀이 코드다.

```rust
//! 서비스 기초 연습 p2: 몫을 고르게 나누는 함수의 성질을 proptest로 적고, 틀린 구현의 최소 반례를 축소로 찾는다.
//! 의존성: proptest = "1"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/45_service-basics-practice_p2.rs"

/// total개를 parts명에게 최대한 고르게 나눈다. 앞사람부터 하나씩 더 받는다.
pub fn split_even(total: u64, parts: usize) -> Vec<u64> {
    assert!(parts > 0, "parts must be positive");
    let q = total / parts as u64;
    let r = (total % parts as u64) as usize;
    (0..parts).map(|i| q + u64::from(i < r)).collect()
}

/// 틀린 구현: 나머지를 버린다.
fn split_even_buggy(total: u64, parts: usize) -> Vec<u64> {
    vec![total / parts as u64; parts]
}

/// 세 성질을 한 번에 검사한다. 어긋나면 어느 성질인지 돌려준다.
fn properties(f: fn(u64, usize) -> Vec<u64>, total: u64, parts: usize) -> Result<(), String> {
    let v = f(total, parts);
    if v.len() != parts {
        return Err(format!("len {} != {parts}", v.len()));
    }
    if v.iter().sum::<u64>() != total {
        return Err(format!("sum {} != {total}", v.iter().sum::<u64>()));
    }
    let (mn, mx) = (
        v.iter().min().copied().unwrap_or(0),
        v.iter().max().copied().unwrap_or(0),
    );
    if mx - mn > 1 {
        return Err(format!("max-min = {}", mx - mn));
    }
    Ok(())
}

fn find_minimal_counterexample() -> Option<(u64, usize)> {
    use proptest::test_runner::{Config, TestError, TestRng, TestRunner};
    let config = Config {
        failure_persistence: None,
        ..Config::default()
    };
    let mut runner = TestRunner::new_with_rng(
        config.clone(),
        TestRng::deterministic_rng(config.rng_algorithm),
    );
    let r = runner.run(&(0u64..10_000, 1usize..50), |(t, p)| {
        properties(split_even_buggy, t, p).map_err(proptest::test_runner::TestCaseError::fail)
    });
    match r {
        Err(TestError::Fail(_, v)) => Some(v),
        _ => None,
    }
}

fn main() {
    assert_eq!(split_even(10, 3), [4, 3, 3]);
    assert_eq!(split_even(2, 4), [1, 1, 0, 0]);
    let m = find_minimal_counterexample();
    println!("틀린 구현의 최소 반례: {m:?}");
    println!(
        "그 입력의 결과: {:?}",
        m.map(|(t, p)| split_even_buggy(t, p))
    );
    assert_eq!(m, Some((1, 2)));
    assert_eq!(properties(split_even_buggy, 1, 2), Err("sum 0 != 1".into()));
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    proptest! {
        #[test]
        fn split_even_keeps_all_three_properties(total in 0u64..1_000_000, parts in 1usize..100) {
            prop_assert_eq!(properties(split_even, total, parts), Ok(()));
        }
    }

    #[test]
    #[should_panic(expected = "parts must be positive")]
    fn zero_parts_panics() {
        split_even(5, 0);
    }
}
```
{% endraw %}
