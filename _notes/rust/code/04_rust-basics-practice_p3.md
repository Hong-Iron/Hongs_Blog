---
layout: "note"
title: "04_rust-basics-practice_p3.rs"
display_title: "04_rust-basics-practice_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "04"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/rust-basics-practice/"
parent_title: "Rust 첫걸음 연습"
description: "Rust · Rust 첫걸음 연습 문제 3 풀이 코드"
permalink: "/studies/rust/code/04_rust-basics-practice_p3/"
---
{% raw %}
[Rust 첫걸음 연습](/Hongs_Blog/studies/rust/rust-basics-practice/) 문서의 문제 3 풀이 코드다.

```rust
//! 04 Rust 첫걸음 연습 p3: 콜라츠 단계 수를 loop의 break 값으로 돌려준다. 3n + 1이 u32를 넘으면 None.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/04_rust-basics-practice_p3.rs"

/// n이 1이 될 때까지 짝수면 반으로, 홀수면 3n + 1로 바꾼다. 몇 번 바꿨는지 돌려준다.
/// n = 0이면 영원히 0이라 None, 중간에 u32를 넘으면 None.
fn collatz_steps(n: u32) -> Option<u32> {
    if n == 0 {
        return None;
    }
    let mut n = n;
    let mut steps = 0;
    loop {
        if n == 1 {
            break Some(steps);
        }
        n = if n.is_multiple_of(2) {
            n / 2
        } else {
            match n.checked_mul(3).and_then(|m| m.checked_add(1)) {
                Some(next) => next,
                None => break None,
            }
        };
        steps += 1;
    }
}

fn main() {
    assert_eq!(collatz_steps(1), Some(0));
    assert_eq!(collatz_steps(6), Some(8)); // 6 3 10 5 16 8 4 2 1
    assert_eq!(collatz_steps(7), Some(16));
    assert_eq!(collatz_steps(27), Some(111));
    assert_eq!(collatz_steps(0), None);
    assert_eq!(collatz_steps(u32::MAX), None); // 홀수라 바로 3n + 1을 하고 넘친다
    println!(
        "1 -> {:?}, 6 -> {:?}, 27 -> {:?}, 0 -> {:?}, u32::MAX -> {:?}",
        collatz_steps(1),
        collatz_steps(6),
        collatz_steps(27),
        collatz_steps(0),
        collatz_steps(u32::MAX)
    );

    // 1..10000에서 가장 오래 걸리는 수.
    let (best, steps) = (1..10_000u32)
        .map(|n| (n, collatz_steps(n).expect("작은 수는 넘치지 않는다")))
        .max_by_key(|&(_, s)| s)
        .unwrap();
    assert_eq!((best, steps), (6171, 261));
    println!("1..10000에서 가장 긴 것: {best} ({steps}단계)");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example() {
        assert_eq!(collatz_steps(6), Some(8));
        assert_eq!(collatz_steps(0), None);
    }
}
```
{% endraw %}
