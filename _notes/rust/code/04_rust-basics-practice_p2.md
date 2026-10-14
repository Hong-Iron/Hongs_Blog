---
layout: "note"
title: "04_rust-basics-practice_p2.rs"
display_title: "04_rust-basics-practice_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "04"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/rust-basics-practice/"
parent_title: "Rust 첫걸음 연습"
description: "Rust · Rust 첫걸음 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/04_rust-basics-practice_p2/"
---
{% raw %}
[Rust 첫걸음 연습](/Hongs_Blog/studies/rust/rust-basics-practice/) 문서의 문제 2 풀이 코드다.

```rust
//! 04 Rust 첫걸음 연습 p2: FizzBuzz를 if 사슬 없이 match 하나로, 결과를 값으로 돌려받게 쓴다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/04_rust-basics-practice_p2.rs"

/// n을 3과 5로 나눈 나머지의 짝으로 갈래를 고른다. match 전체가 이 함수의 값이다.
fn fizzbuzz(n: u32) -> String {
    match (n % 3, n % 5) {
        (0, 0) => "FizzBuzz".to_string(),
        (0, _) => "Fizz".to_string(),
        (_, 0) => "Buzz".to_string(),
        _ => n.to_string(),
    }
}

/// 갈래 순서를 바꾼 틀린 판: (0, _)가 먼저 와서 15도 Fizz가 된다.
/// 컴파일러는 unreachable_patterns 경고를 낸다. 여기서는 실행 결과를 보려고 그 경고만 끈다.
#[allow(unreachable_patterns)]
fn fizzbuzz_wrong_order(n: u32) -> String {
    match (n % 3, n % 5) {
        (0, _) => "Fizz".to_string(),
        (_, 0) => "Buzz".to_string(),
        (0, 0) => "FizzBuzz".to_string(),
        _ => n.to_string(),
    }
}

const WRONG_ORDER: &str = "pub fn f(n: u32) -> &'static str {\n    match (n % 3, n % 5) {\n        (0, _) => \"Fizz\",\n        (_, 0) => \"Buzz\",\n        (0, 0) => \"FizzBuzz\",\n        _ => \"\",\n    }\n}\n";

fn compile_stderr(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr_{}_{}", std::process::id(), code.len()));
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

fn main() {
    let got: Vec<String> = (1..=15).map(fizzbuzz).collect();
    let want = [
        "1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14",
        "FizzBuzz",
    ];
    assert_eq!(got, want);
    println!("{}", got.join(" "));

    // 순서를 바꾸면 컴파일은 되지만 15가 Fizz가 된다. (0, 0) 갈래에는 영영 닿지 않는다.
    assert_eq!(fizzbuzz_wrong_order(15), "Fizz");
    assert_eq!(fizzbuzz_wrong_order(30), "Fizz");
    println!("갈래 순서를 바꾸면 15 -> {}", fizzbuzz_wrong_order(15));

    // 경고 끄기 없이 컴파일하면 컴파일러가 닿지 않는 갈래를 알려 준다.
    let warn = compile_stderr(WRONG_ORDER);
    assert!(warn.contains("warning: unreachable pattern"), "{warn}");
    assert!(warn.contains("no value can reach this"), "{warn}");
    println!("컴파일러: warning: unreachable pattern");

    // 1..=100에서 FizzBuzz는 15의 배수 6개, Fizz는 33 - 6 = 27개, Buzz는 20 - 6 = 14개.
    let all: Vec<String> = (1..=100).map(fizzbuzz).collect();
    let count = |w: &str| all.iter().filter(|s| *s == w).count();
    assert_eq!(
        (count("FizzBuzz"), count("Fizz"), count("Buzz")),
        (6, 27, 14)
    );
    println!(
        "1..=100: FizzBuzz {}, Fizz {}, Buzz {}",
        count("FizzBuzz"),
        count("Fizz"),
        count("Buzz")
    );

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example() {
        assert_eq!(fizzbuzz(9), "Fizz");
        assert_eq!(fizzbuzz(10), "Buzz");
        assert_eq!(fizzbuzz(45), "FizzBuzz");
        assert_eq!(fizzbuzz(7), "7");
    }
}
```
{% endraw %}
