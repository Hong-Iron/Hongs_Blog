---
layout: "note"
title: "35_concurrency-practice_p3.rs"
display_title: "35_concurrency-practice_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "35"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/concurrency-practice/"
parent_title: "동시성 연습"
description: "Rust · 동시성 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/35_concurrency-practice_p3/"
---
{% raw %}
[동시성 연습](/Hongs_Blog/studies/rust/concurrency-practice/) 문서의 문제 3 풀이 코드다.

```rust
//! 동시성 연습 p3: sync_channel로 만든 3단계 파이프라인(만들기 → 제곱 → 더하기).
//! 확인하는 것: 결과 합, 단계 사이 큐에 쌓인 개수가 용량을 넘지 않는 것,
//! 송신자 하나를 버리지 않으면 마지막 단계가 끝나지 않는 것(recv_timeout으로 확인).
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/35_concurrency-practice_p3.rs"

use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::mpsc::{self, RecvTimeoutError};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

const CAP: usize = 4;

/// 1..=n을 흘려 제곱의 합을 구한다. 제곱 단계는 일꾼 w명이다.
/// in_flight: 1단계가 보냈지만 2단계가 아직 꺼내지 않은 개수의 최댓값을 잰다.
fn pipeline(n: u64, w: usize) -> (u64, usize) {
    let (num_tx, num_rx) = mpsc::sync_channel::<u64>(CAP);
    let (sq_tx, sq_rx) = mpsc::sync_channel::<u64>(CAP);
    let num_rx = Arc::new(Mutex::new(num_rx));
    let pending = Arc::new(AtomicUsize::new(0));
    let max_pending = Arc::new(AtomicUsize::new(0));

    let producer = {
        let (pending, max_pending) = (Arc::clone(&pending), Arc::clone(&max_pending));
        thread::spawn(move || {
            for x in 1..=n {
                let now = pending.fetch_add(1, Ordering::Relaxed) + 1;
                max_pending.fetch_max(now, Ordering::Relaxed);
                num_tx.send(x).unwrap(); // 큐가 차면 여기서 기다린다
            }
            // num_tx는 여기서 drop된다
        })
    };
    let workers: Vec<_> = (0..w)
        .map(|_| {
            let num_rx = Arc::clone(&num_rx);
            let sq_tx = sq_tx.clone();
            let pending = Arc::clone(&pending);
            thread::spawn(move || {
                loop {
                    let next = num_rx.lock().unwrap().recv();
                    let Ok(x) = next else { break };
                    pending.fetch_sub(1, Ordering::Relaxed);
                    sq_tx.send(x * x).unwrap();
                }
            })
        })
        .collect();
    drop(sq_tx); // 원본 송신자를 버려야 아래 반복이 끝난다
    let sum = sq_rx.iter().sum();
    producer.join().unwrap();
    for h in workers {
        h.join().unwrap();
    }
    (sum, max_pending.load(Ordering::Relaxed))
}

fn main() {
    let (sum, max_pending) = pipeline(1_000, 3);
    assert_eq!(sum, (1..=1_000u64).map(|x| x * x).sum::<u64>());
    // 보낼 차례를 세는 순간과 send 사이에 틈이 있어 CAP 위로 일꾼 수 + 1개까지 셀 수 있다
    assert!(max_pending <= CAP + 3 + 1, "{max_pending}");
    println!("pipeline: sum of squares 1..=1000 = {sum}, max pending {max_pending}");

    // 원본 송신자를 버리지 않은 판: 일이 다 끝나도 수신 쪽은 끝을 알 수 없다.
    let (tx, rx) = mpsc::sync_channel::<u64>(CAP);
    let tx2 = tx.clone();
    thread::spawn(move || {
        for x in 1..=3 {
            tx2.send(x).unwrap();
        }
    })
    .join()
    .unwrap();
    let got: Vec<u64> = (0..3).map(|_| rx.recv().unwrap()).collect();
    assert_eq!(got, vec![1, 2, 3]);
    assert_eq!(
        rx.recv_timeout(Duration::from_millis(50)),
        Err(RecvTimeoutError::Timeout)
    );
    drop(tx);
    assert_eq!(
        rx.recv_timeout(Duration::from_millis(50)),
        Err(RecvTimeoutError::Disconnected)
    );
    println!("forgot drop(tx): Timeout (would hang with recv); after drop: Disconnected");
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shapes() {
        assert_eq!(pipeline(0, 2).0, 0);
        assert_eq!(pipeline(3, 1).0, 14);
        assert_eq!(pipeline(100, 8).0, 338_350);
    }
}
```
{% endraw %}
