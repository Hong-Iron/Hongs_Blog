---
layout: "note"
title: "21_iterators_verify.rs"
display_title: "21_iterators_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/iterators/"
parent_title: "반복자"
description: "Rust · 반복자 검증 코드"
permalink: "/studies/rust/code/21_iterators_verify/"
---
{% raw %}
[반복자](/Hongs_Blog/studies/rust/iterators/) 문서의 검증 코드다.

```rust
//! 21 반복자: 게으름(실행 순서 추적, 쓰지 않은 map 경고), 직접 만든 Iterator, 어댑터 사슬,
//! collect로 여러 타입 만들기(Vec·String·HashSet·HashMap·Result·Option), iter·iter_mut·into_iter가 내주는 타입,
//! 2021 에디션부터 배열의 into_iter가 값을 내준다는 것, 무한 반복자와 take, clippy needless_range_loop를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/21_iterators_verify.rs"

use std::any::type_name;
use std::collections::{BTreeMap, HashMap, HashSet};
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

fn compile_output(code: &str, edition: &str) -> String {
    compile_with("rustc", code, edition)
}

/// rustc 또는 clippy-driver로 코드 조각을 컴파일해 stderr를 돌려준다.
fn compile_with(tool: &str, code: &str, edition: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::Relaxed);
    let dir = std::env::temp_dir().join(format!("vr21_{}_{}", std::process::id(), n));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new(tool)
        .args([
            "--edition",
            edition,
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

fn type_of<T>(_: &T) -> &'static str {
    type_name::<T>()
}

/// 1부터 n까지 세는 반복자. next만 만들면 나머지 메서드는 공짜로 생긴다.
struct Counter {
    n: u32,
    max: u32,
}

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.n < self.max {
            self.n += 1;
            Some(self.n)
        } else {
            None
        }
    }
}

fn main() {
    // 1. 게으름: 소비하는 메서드를 부르기 전에는 아무 일도 안 한다.
    let mut log = Vec::new();
    let it = [1, 2, 3, 4].iter().map(|x| {
        log.push(format!("map {x}"));
        x * 10
    });
    let it = it.filter(|x| *x > 15);
    // 여기까지 log는 비어 있다(빌림 때문에 지금은 볼 수 없지만, 아래 결과 순서가 증거다).
    let first: Vec<i32> = it.take(2).collect();
    assert_eq!(first, vec![20, 30]);
    println!("결과 {first:?}, 실행 기록 {log:?}");
    // 4는 map조차 되지 않았다: take(2)가 두 개를 얻자 멈췄다.
    assert_eq!(log, ["map 1", "map 2", "map 3"]);

    let warn = compile_output("pub fn f(v: &[i32]) { v.iter().map(|x| x + 1); }", "2024");
    let line = warn.lines().find(|l| l.starts_with("warning")).unwrap();
    println!("[쓰지 않은 map] {line}");
    assert!(warn.contains("unused `Map` that must be used"));
    assert!(warn.contains("iterators are lazy and do nothing unless consumed"));

    // 2. 직접 만든 반복자 + 공짜로 얻는 어댑터
    let total: u32 = Counter { n: 0, max: 5 }
        .zip(Counter { n: 0, max: 5 }.skip(1))
        .map(|(a, b)| a * b)
        .filter(|x| x % 3 == 0)
        .sum();
    // (1,2)(2,3)(3,4)(4,5) -> 2,6,12,20 -> 3의 배수 6,12 -> 18
    assert_eq!(total, 18);
    println!("Counter zip 합 = {total}");

    // 3. collect: 받을 타입이 결과를 정한다.
    let words = ["apple", "bob", "apple", "cat"];
    let v: Vec<&str> = words.iter().filter(|w| w.len() > 3).copied().collect();
    let s: String = words.iter().map(|w| w.chars().next().unwrap()).collect();
    let set: HashSet<&str> = words.iter().copied().collect();
    let freq: HashMap<&str, usize> = words.iter().fold(HashMap::new(), |mut m, w| {
        *m.entry(*w).or_insert(0) += 1;
        m
    });
    let sorted: BTreeMap<&str, usize> = freq.iter().map(|(k, v)| (*k, *v)).collect();
    assert_eq!(v, ["apple", "apple"]);
    assert_eq!(s, "abac");
    assert_eq!(set.len(), 3);
    assert_eq!(freq["apple"], 2);
    println!("String {s:?}, 종류 {}개, 빈도 {sorted:?}", set.len());

    let good: Result<Vec<i32>, _> = ["1", "2", "3"].iter().map(|s| s.parse::<i32>()).collect();
    let bad: Result<Vec<i32>, _> = ["1", "x", "3", "y"]
        .iter()
        .map(|s| s.parse::<i32>())
        .collect();
    assert_eq!(good, Ok(vec![1, 2, 3]));
    assert!(bad.is_err());
    let opt: Option<Vec<u32>> = ["7", "8"].iter().map(|s| s.parse().ok()).collect();
    assert_eq!(opt, Some(vec![7, 8]));

    // 첫 에러에서 멈춘다: 몇 개를 봤는지 센다.
    let mut seen = 0;
    let r: Result<Vec<i32>, std::num::ParseIntError> = ["1", "x", "3", "y"]
        .iter()
        .inspect(|_| seen += 1)
        .map(|s| s.parse::<i32>())
        .collect();
    assert!(r.is_err());
    println!("Result로 collect: 본 원소 {seen}개에서 멈춤");
    assert_eq!(seen, 2);

    // 4. iter / iter_mut / into_iter
    let mut names = vec![String::from("a"), String::from("b")];
    let mut t1 = String::new();
    for r in names.iter() {
        t1 = type_of(&r).to_string();
    }
    for n in names.iter_mut() {
        n.push('!');
    }
    let t3 = type_of(&names.clone().into_iter().next().unwrap()).to_string();
    println!("iter -> {t1}, into_iter -> {t3}");
    assert_eq!(t1, "&alloc::string::String");
    assert_eq!(t3, "alloc::string::String");
    assert_eq!(names, ["a!", "b!"]);
    let moved: Vec<String> = names.into_iter().collect();
    assert_eq!(moved.len(), 2);
    // names는 이제 쓸 수 없다 (into_iter가 가져갔다).

    // for 문은 into_iter를 부른다: &v는 참조를, v는 값을 내준다.
    let nums = vec![1, 2, 3];
    let mut acc = 0;
    for x in &nums {
        acc += *x;
    }
    assert_eq!(acc, 6);

    // 5. 배열의 into_iter: 2021부터 값을 내준다.
    let arr = [10u8, 20, 30];
    let first = arr.into_iter().next().unwrap();
    assert_eq!(type_of(&first), "u8");
    let e2018 = compile_output(
        "pub fn f() -> u8 { let a = [1u8, 2]; let x: u8 = a.into_iter().next().unwrap(); x }",
        "2018",
    );
    let e2024 = compile_output(
        "pub fn f() -> u8 { let a = [1u8, 2]; let x: u8 = a.into_iter().next().unwrap(); x }",
        "2024",
    );
    println!(
        "[배열 into_iter 2018] {}",
        e2018
            .lines()
            .find(|l| l.starts_with("error"))
            .unwrap_or("(오류 없음)")
    );
    assert!(e2018.contains("error[E0308]"));
    assert!(e2018.contains("expected `u8`, found `&u8`"));
    assert!(!e2024.contains("error"));

    // 6. 끝이 없는 반복자도 take로 끊으면 된다(게으르기 때문).
    let squares: Vec<u64> = (1u64..).map(|n| n * n).take(5).collect();
    assert_eq!(squares, [1, 4, 9, 16, 25]);

    // 7. clippy: 번호로만 원소를 읽는 for 문은 반복자로 바꾸라고 한다.
    let w = compile_with(
        "clippy-driver",
        "pub fn s(v: &[i32]) -> i32 { let mut t = 0; for i in 0..v.len() { t += v[i]; } t }",
        "2024",
    );
    let first = w.lines().find(|l| l.starts_with("warning")).unwrap();
    println!("[clippy] {first}");
    assert!(w.contains("#[warn(clippy::needless_range_loop)]` on by default"));

    // 8. 출력 예측 카드
    let out: Vec<(usize, char)> = "rust"
        .chars()
        .rev()
        .enumerate()
        .filter(|(i, _)| i % 2 == 0)
        .collect();
    println!("{out:?}");
    assert_eq!(out, vec![(0, 't'), (2, 'u')]);

    let chained: i32 = (1..=10)
        .filter(|n| n % 2 == 1)
        .map(|n| n * n)
        .take_while(|&n| n < 50)
        .sum();
    assert_eq!(chained, 1 + 9 + 25 + 49);
    println!("홀수 제곱 중 50 미만의 합 = {chained}");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
