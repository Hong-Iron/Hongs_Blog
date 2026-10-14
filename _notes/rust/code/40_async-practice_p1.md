---
layout: "note"
title: "40_async-practice_p1.rs"
display_title: "40_async-practice_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "40"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/async-practice/"
parent_title: "async 연습"
description: "Rust · async 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/40_async-practice_p1/"
---
{% raw %}
[async 연습](/Hongs_Blog/studies/rust/async-practice/) 문서의 문제 1 풀이 코드다.

```rust
//! async 연습 p1: 퓨처를 만드는 순간, await하는 순간, spawn하는 순간 중 언제 일이 시작되는지 시간으로 확인한다.
//! 의존성: tokio = { version = "1", features = ["full"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/40_async-practice_p1.rs"

use std::time::{Duration, Instant};
use tokio::time::sleep;

async fn fetch(id: u32) -> u32 {
    sleep(Duration::from_millis(100)).await;
    id * 10
}

/// 걸린 시간을 100ms 단위로 반올림한다(작은 흔들림을 지운다).
fn rounded(t: Instant) -> u128 {
    (t.elapsed().as_millis() + 50) / 100 * 100
}

#[tokio::main]
async fn main() {
    // (가) 만들어 두고 차례로 await
    let t = Instant::now();
    let a = fetch(1);
    let b = fetch(2);
    let sum = a.await + b.await;
    let ga = rounded(t);
    println!("(가) 합 {sum}, 약 {ga}ms");

    // (나) join!으로 같이 기다리기
    let t = Instant::now();
    let (x, y) = tokio::join!(fetch(1), fetch(2));
    let gb = rounded(t);
    println!("(나) 합 {}, 약 {gb}ms", x + y);

    // (다) spawn한 뒤 다른 일을 하고 나서 await
    let t = Instant::now();
    let h1 = tokio::spawn(fetch(1));
    let h2 = tokio::spawn(fetch(2));
    sleep(Duration::from_millis(100)).await; // 다른 일 100ms
    let s = h1.await.unwrap() + h2.await.unwrap();
    let gc = rounded(t);
    println!("(다) 합 {s}, 약 {gc}ms");

    // (라) 퓨처를 만들고 다른 일을 한 뒤 await
    let t = Instant::now();
    let f = fetch(1);
    sleep(Duration::from_millis(100)).await; // 다른 일 100ms
    let v = f.await;
    let gd = rounded(t);
    println!("(라) 값 {v}, 약 {gd}ms");

    // (마) 둘 다 만들어 둔 뒤 join!에 넘기기
    let t = Instant::now();
    let (a, b) = (fetch(1), fetch(2));
    let (x, y) = tokio::join!(a, b);
    let ge = rounded(t);
    println!("(마) 합 {}, 약 {ge}ms", x + y);

    // (바) 변형: (라)를 spawn으로 바꾸기
    let t = Instant::now();
    let f = tokio::spawn(fetch(1));
    sleep(Duration::from_millis(100)).await; // 다른 일 100ms
    let v2 = f.await.unwrap();
    let gf = rounded(t);
    println!("(바) 값 {v2}, 약 {gf}ms");

    assert_eq!((ga, gb, gc, gd, ge, gf), (200, 100, 100, 200, 100, 100));
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
