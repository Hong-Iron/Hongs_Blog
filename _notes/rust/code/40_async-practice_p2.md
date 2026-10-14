---
layout: "note"
title: "40_async-practice_p2.rs"
display_title: "40_async-practice_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "40"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/async-practice/"
parent_title: "async 연습"
description: "Rust · async 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/40_async-practice_p2/"
---
{% raw %}
[async 연습](/Hongs_Blog/studies/rust/async-practice/) 문서의 문제 2 풀이 코드다.

```rust
//! async 연습 p2: async 함수 안의 무거운 계산이 같은 런타임의 다른 요청을 멈추게 하는 것을 재고,
//! spawn_blocking으로 옮겨 고친다.
//! 의존성: tokio = { version = "1", features = ["full"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/40_async-practice_p2.rs"

use std::time::{Duration, Instant};

/// 무거운 계산 흉내: FNV-1a 해시를 구하고, 약 200ms 동안 CPU를 붙잡는다(.await 없음).
fn heavy_hash(data: &[u8]) -> u64 {
    let start = Instant::now();
    let mut h: u64 = 0xcbf2_9ce4_8422_2325;
    for b in data {
        h ^= u64::from(*b);
        h = h.wrapping_mul(0x0100_0000_01b3);
    }
    while start.elapsed() < Duration::from_millis(200) {
        std::hint::spin_loop(); // 계산이 더 오래 걸리는 상황을 흉내 낸다
    }
    h
}

/// 고치기 전: async 함수 안에서 바로 계산한다
async fn checksum_bad(data: Vec<u8>) -> u64 {
    heavy_hash(&data)
}

/// 고친 뒤: 블로킹용 스레드 풀로 보낸다
async fn checksum_good(data: Vec<u8>) -> u64 {
    tokio::task::spawn_blocking(move || heavy_hash(&data))
        .await
        .expect("계산 태스크가 panic하지 않는다")
}

/// 10ms마다 응답해야 하는 가벼운 작업(ping)이 예정보다 늦은 시간의 최댓값(ms)
async fn worst_ping_while<F: std::future::Future<Output = u64> + Send + 'static>(job: F) -> u128 {
    let pinger = tokio::spawn(async {
        let mut worst = 0;
        for _ in 0..30 {
            let t = Instant::now();
            tokio::time::sleep(Duration::from_millis(10)).await;
            worst = worst.max(t.elapsed().as_millis().saturating_sub(10));
        }
        worst
    });
    tokio::time::sleep(Duration::from_millis(20)).await;
    let h = tokio::spawn(job);
    let _ = h.await.unwrap();
    pinger.await.unwrap()
}

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let data = vec![7u8; 4096];
    let bad = worst_ping_while(checksum_bad(data.clone())).await;
    let good = worst_ping_while(checksum_good(data.clone())).await;
    println!("ping 최대 지연: 고치기 전 {bad}ms, 고친 뒤 {good}ms");
    assert!(bad >= 150);
    assert!(good < 50);
    assert_eq!(checksum_bad(data.clone()).await, checksum_good(data).await);
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
