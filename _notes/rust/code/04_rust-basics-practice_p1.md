---
layout: "note"
title: "04_rust-basics-practice_p1.rs"
display_title: "04_rust-basics-practice_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "04"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/rust-basics-practice/"
parent_title: "Rust 첫걸음 연습"
description: "Rust · Rust 첫걸음 연습 문제 1 풀이 코드"
permalink: "/studies/rust/code/04_rust-basics-practice_p1/"
---
{% raw %}
[Rust 첫걸음 연습](/Hongs_Blog/studies/rust/rust-basics-practice/) 문서의 문제 1 풀이 코드다.

```rust
//! 04 Rust 첫걸음 연습 p1: 두 u8의 평균을 넘침 없이 구한다. 그냥 (a + b) / 2는 dev 빌드에서 panic이다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/04_rust-basics-practice_p1.rs"

use std::hint::black_box;
use std::panic;

/// 고치기 전: u8끼리 더하므로 합이 255를 넘으면 넘친다.
fn average_naive(a: u8, b: u8) -> u8 {
    (a + b) / 2
}

/// 풀이 1: 더 넓은 타입(u16)으로 바꿔 더한다. 결과는 반드시 0..=255라 try_from이 실패하지 않는다.
fn average_widen(a: u8, b: u8) -> u8 {
    let sum = u16::from(a) + u16::from(b);
    u8::try_from(sum / 2).expect("두 u8의 평균은 u8 범위 안이다")
}

/// 풀이 2: 넓히지 않고, 각각 반으로 나눈 뒤 둘 다 홀수일 때만 1을 더한다.
fn average_halves(a: u8, b: u8) -> u8 {
    a / 2 + b / 2 + ((a % 2) & (b % 2))
}

fn main() {
    let cases: [(u8, u8, u8); 6] = [
        (200, 100, 150),
        (255, 255, 255),
        (1, 2, 1),
        (3, 5, 4),
        (0, 0, 0),
        (254, 255, 254),
    ];
    for (a, b, want) in cases {
        assert_eq!(average_widen(a, b), want, "widen {a} {b}");
        assert_eq!(average_halves(a, b), want, "halves {a} {b}");
    }
    // 모든 쌍에서 두 풀이가 정수 평균(내림)과 같다.
    for a in 0..=255u8 {
        for b in 0..=255u8 {
            let want = ((u32::from(a) + u32::from(b)) / 2) as u8;
            assert_eq!(average_widen(a, b), want);
            assert_eq!(average_halves(a, b), want);
            assert_eq!(a.midpoint(b), want); // 표준 라이브러리의 midpoint도 같다
        }
    }
    println!("두 풀이: 65,536쌍 모두 일치");

    // 고치기 전 함수는 합이 255를 넘으면 panic한다(dev 프로필).
    assert_eq!(average_naive(black_box(100), black_box(50)), 75);
    let old = panic::take_hook();
    panic::set_hook(Box::new(|_| {}));
    let r = panic::catch_unwind(|| average_naive(black_box(200), black_box(100)));
    panic::set_hook(old);
    let msg = r.unwrap_err().downcast_ref::<&str>().map(|s| s.to_string());
    assert_eq!(msg.as_deref(), Some("attempt to add with overflow"));
    println!("average_naive(200, 100) -> panic: attempt to add with overflow");
    // release처럼 감으면 (200 + 100) mod 256 = 44, 44 / 2 = 22라는 틀린 값이 나온다.
    assert_eq!(200u8.wrapping_add(100) / 2, 22);
    println!("감아 돌면 22 (틀린 값)");

    // 변형: as로 고친 판에 clippy pedantic이 거는 린트.
    let dir = std::env::temp_dir().join(format!("vr_{}_p1", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(
        &file,
        "pub fn f(a: u8, b: u8) -> u8 {\n    ((a as u16 + b as u16) / 2) as u8\n}\n",
    )
    .unwrap();
    let out = std::process::Command::new("clippy-driver")
        .args(["--edition", "2024", "--crate-type=lib", "--emit=metadata"])
        .args(["-W", "clippy::pedantic", "--out-dir"])
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("clippy-driver 실행");
    let err = String::from_utf8_lossy(&out.stderr);
    assert!(err.contains("clippy::cast_possible_truncation"), "{err}");
    assert!(err.contains("clippy::cast_lossless"), "{err}");
    assert!(err.contains("clippy::manual_midpoint"), "{err}");
    println!("as 판 + pedantic -> cast_possible_truncation, cast_lossless, manual_midpoint");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example() {
        assert_eq!(average_widen(200, 100), 150);
        assert_eq!(average_halves(200, 100), 150);
    }
}
```
{% endraw %}
