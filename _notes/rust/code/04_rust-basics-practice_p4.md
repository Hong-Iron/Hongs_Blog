---
layout: "note"
title: "04_rust-basics-practice_p4.rs"
display_title: "04_rust-basics-practice_p4.rs"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "04"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/rust-basics-practice/"
parent_title: "Rust 첫걸음 연습"
description: "Rust · Rust 첫걸음 연습 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/04_rust-basics-practice_p4/"
---
{% raw %}
[Rust 첫걸음 연습](/Hongs_Blog/studies/rust/rust-basics-practice/) 문서의 문제 4 풀이 코드다.

```rust
//! 04 Rust 첫걸음 연습 p4: a < b < c, a + b + c = sum인 첫 피타고라스 세 수를 레이블 블록과 레이블 break로 찾는다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/04_rust-basics-practice_p4.rs"

/// a를 작은 것부터, 그 안에서 b를 작은 것부터 돌며 처음 찾은 (a, b, c)를 돌려준다.
fn triple(sum: u32) -> Option<(u32, u32, u32)> {
    'found: {
        for a in 1..sum {
            for b in (a + 1)..sum {
                let Some(c) = sum.checked_sub(a + b) else {
                    break; // a + b가 sum을 넘었다: 이 a에서 더 큰 b는 볼 필요가 없다
                };
                if c <= b {
                    break; // b가 커질수록 c는 작아진다: 이 a는 끝
                }
                if a * a + b * b == c * c {
                    break 'found Some((a, b, c));
                }
            }
        }
        None
    }
}

/// 같은 일을 하는 브루트포스: 모든 (a, b, c)를 본다.
fn triple_brute(sum: u32) -> Option<(u32, u32, u32)> {
    for a in 1..sum {
        for b in (a + 1)..sum {
            for c in (b + 1)..=sum {
                if a + b + c == sum && a * a + b * b == c * c {
                    return Some((a, b, c));
                }
            }
        }
    }
    None
}

/// 변형: 안쪽 break를 레이블 break로 바꾼 틀린 판.
fn triple_wrong(sum: u32) -> Option<(u32, u32, u32)> {
    'found: {
        for a in 1..sum {
            for b in (a + 1)..sum {
                let Some(c) = sum.checked_sub(a + b) else {
                    break 'found None;
                };
                if c <= b {
                    break 'found None;
                }
                if a * a + b * b == c * c {
                    break 'found Some((a, b, c));
                }
            }
        }
        None
    }
}

fn main() {
    assert_eq!(triple(12), Some((3, 4, 5)));
    assert_eq!(triple(30), Some((5, 12, 13)));
    assert_eq!(triple(1000), Some((200, 375, 425)));
    assert_eq!(triple(10), None);
    let (a, b, c) = triple(1000).unwrap();
    assert_eq!(a * b * c, 31_875_000);
    println!(
        "12 -> {:?}, 30 -> {:?}, 1000 -> {:?}, 곱 {}",
        triple(12),
        triple(30),
        triple(1000),
        a * b * c
    );

    for s in 1..=120 {
        assert_eq!(triple(s), triple_brute(s), "sum = {s}");
    }
    println!("sum 1..=120에서 브루트포스와 일치");

    assert_eq!(triple_wrong(1000), None);
    assert_eq!(triple_wrong(12), None);
    println!(
        "변형: 레이블 break로 바꾸면 1000 -> {:?}",
        triple_wrong(1000)
    );

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example() {
        assert_eq!(triple(12), Some((3, 4, 5)));
        assert_eq!(triple(10), None);
    }
}
```
{% endraw %}
