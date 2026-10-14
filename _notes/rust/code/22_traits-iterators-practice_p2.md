---
layout: "note"
title: "22_traits-iterators-practice_p2.rs"
display_title: "22_traits-iterators-practice_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "22"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/traits-iterators-practice/"
parent_title: "트레이트와 반복자 연습"
description: "Rust · 트레이트와 반복자 연습 문제 2 풀이 코드"
permalink: "/studies/rust/code/22_traits-iterators-practice_p2/"
---
{% raw %}
[트레이트와 반복자 연습](/Hongs_Blog/studies/rust/traits-iterators-practice/) 문서의 문제 2 풀이 코드다.

```rust
//! 22 트레이트와 반복자 연습 p2: 피보나치 반복자를 직접 만들고, 어댑터 사슬로 짝수 항의 합을 구한다.
//! u64를 넘기 직전에 스스로 멈추게 해 몇 개의 항이 u64에 들어가는지도 센다.
//! 변형: take_while 대신 filter로 거르면 답은 같아도 끝까지(93항) 다 본다는 것을 센다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/22_traits-iterators-practice_p2.rs"

/// 1, 1, 2, 3, 5, ... 를 내주는 반복자. 다음 항이 u64를 넘으면 None으로 끝난다.
struct Fib {
    cur: Option<u64>,
    next: Option<u64>,
}

fn fib() -> Fib {
    Fib {
        cur: Some(1),
        next: Some(1),
    }
}

impl Iterator for Fib {
    type Item = u64;
    fn next(&mut self) -> Option<u64> {
        let out = self.cur?;
        let after = match (self.cur, self.next) {
            (Some(a), Some(b)) => a.checked_add(b),
            _ => None,
        };
        self.cur = self.next;
        self.next = after;
        Some(out)
    }
}

fn even_sum_below(limit: u64) -> u64 {
    fib()
        .take_while(|&x| x <= limit)
        .filter(|x| x % 2 == 0)
        .sum()
}

fn main() {
    let first: Vec<u64> = fib().take(10).collect();
    println!("앞 10개: {first:?}");
    assert_eq!(first, [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);

    let s = even_sum_below(4_000_000);
    println!("4,000,000 이하 짝수 항의 합: {s}");
    assert_eq!(s, 4_613_732);

    let count = fib().count();
    let last = fib().last().unwrap();
    println!("u64에 들어가는 항: {count}개, 마지막 {last}");
    assert_eq!(count, 93);
    assert_eq!(last, 12_200_160_415_121_876_738);

    // 변형: take_while은 처음으로 한도를 넘는 항을 보고 멈춘다. filter는 끝까지 본다.
    let mut seen_tw = 0;
    let a: u64 = fib()
        .inspect(|_| seen_tw += 1)
        .take_while(|&x| x <= 4_000_000)
        .filter(|x| x % 2 == 0)
        .sum();
    let mut seen_f = 0;
    let b: u64 = fib()
        .inspect(|_| seen_f += 1)
        .filter(|&x| x <= 4_000_000)
        .filter(|x| x % 2 == 0)
        .sum();
    println!("take_while: 합 {a}, 본 항 {seen_tw}개 / filter: 합 {b}, 본 항 {seen_f}개");
    assert_eq!((a, seen_tw), (4_613_732, 34));
    assert_eq!((b, seen_f), (4_613_732, 93));
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn small_limits() {
        assert_eq!(even_sum_below(1), 0);
        assert_eq!(even_sum_below(2), 2);
        assert_eq!(even_sum_below(10), 10);
    }

    #[test]
    fn ends_without_overflow() {
        assert_eq!(fib().nth(92), Some(12_200_160_415_121_876_738));
        assert_eq!(fib().nth(93), None);
    }
}
```
{% endraw %}
