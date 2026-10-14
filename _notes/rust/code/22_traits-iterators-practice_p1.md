---
layout: "note"
title: "22_traits-iterators-practice_p1.rs"
display_title: "22_traits-iterators-practice_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "22"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/traits-iterators-practice/"
parent_title: "트레이트와 반복자 연습"
description: "Rust · 트레이트와 반복자 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/22_traits-iterators-practice_p1/"
---
{% raw %}
[트레이트와 반복자 연습](/Hongs_Blog/studies/rust/traits-iterators-practice/) 문서의 문제 1 풀이 코드다.

```rust
//! 22 트레이트와 반복자 연습 p1: 도형 트레이트와 트레이트 객체로 섞인 도형을 넓이 순으로 정렬한다.
//! 변형: f64 넓이를 sort_by_key의 키로 쓰면 f64가 Ord가 아니라서 E0277로 막히는 것을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/22_traits-iterators-practice_p1.rs"

use std::f64::consts::PI;

trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String;
    fn describe(&self) -> String {
        format!("{} {:.2}", self.name(), self.area())
    }
}

struct Circle {
    r: f64,
}

struct Rect {
    w: f64,
    h: f64,
}

struct Triangle {
    base: f64,
    height: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        PI * self.r * self.r
    }
    fn name(&self) -> String {
        "원".into()
    }
}

impl Shape for Rect {
    fn area(&self) -> f64 {
        self.w * self.h
    }
    fn name(&self) -> String {
        "직사각형".into()
    }
}

impl Shape for Triangle {
    fn area(&self) -> f64 {
        self.base * self.height / 2.0
    }
    fn name(&self) -> String {
        "삼각형".into()
    }
}

/// 넓이가 큰 것부터 설명 문자열을 돌려준다.
fn ranked(shapes: &mut [Box<dyn Shape>]) -> Vec<String> {
    shapes.sort_by(|a, b| b.area().total_cmp(&a.area()));
    shapes.iter().map(|s| s.describe()).collect()
}

fn total_area(shapes: &[Box<dyn Shape>]) -> f64 {
    shapes.iter().map(|s| s.area()).sum()
}

fn example() -> Vec<Box<dyn Shape>> {
    vec![
        Box::new(Circle { r: 1.0 }),
        Box::new(Rect { w: 2.0, h: 3.0 }),
        Box::new(Triangle {
            base: 4.0,
            height: 2.0,
        }),
    ]
}

const SORT_BY_KEY: &str = "pub trait Shape { fn area(&self) -> f64; }
pub fn f(v: &mut [Box<dyn Shape>]) { v.sort_by_key(|s| s.area()); }";

fn compile_stderr(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr22p1_{}", std::process::id()));
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
    let mut shapes = example();
    let out = ranked(&mut shapes);
    let total = total_area(&shapes);
    println!("{out:?}");
    println!("합 {total:.5}");
    assert_eq!(out, ["직사각형 6.00", "삼각형 4.00", "원 3.14"]);
    assert!((total - (PI + 10.0)).abs() < 1e-12);

    // 변형: sort_by_key(|s| s.area())는 f64가 Ord가 아니라서 컴파일되지 않는다.
    let e = compile_stderr(SORT_BY_KEY);
    let first = e.lines().find(|l| l.starts_with("error")).unwrap();
    println!("[변형] {first}");
    assert!(e.contains("error[E0277]: the trait bound `f64: Ord` is not satisfied"));
    // total_cmp는 NaN까지 줄 세운다: 양수 NaN은 가장 큰 쪽에 온다.
    let mut xs = [2.0, f64::NAN, -1.0];
    xs.sort_by(f64::total_cmp);
    assert_eq!(xs[0], -1.0);
    assert!(xs[2].is_nan());
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_order() {
        let mut s = example();
        assert_eq!(ranked(&mut s)[0], "직사각형 6.00");
    }

    #[test]
    fn empty_is_zero() {
        let s: Vec<Box<dyn Shape>> = Vec::new();
        assert_eq!(total_area(&s), 0.0);
    }
}
```
{% endraw %}
