---
layout: "note"
title: "40_async-practice_p4.rs"
display_title: "40_async-practice_p4.rs"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "40"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/async-practice/"
parent_title: "async 연습"
description: "Rust · async 연습 문제 4 풀이 코드"
permalink: "/studies/rust/code/40_async-practice_p4/"
---
{% raw %}
[async 연습](/Hongs_Blog/studies/rust/async-practice/) 문서의 문제 4 풀이 코드다.

```rust
//! async 연습 p4: 큐를 처리하는 작업자가 종료 신호를 받으면 새 메시지를 막고(close),
//! 이미 큐에 들어온 메시지는 모두 처리한 뒤 끝나게 한다.
//! 변형: close 없이 "남은 것 다 꺼내기"만 하면, 보내는 쪽이 살아 있는 한 작업자가 끝나지 않는 것을 확인한다.
//! 의존성: tokio = { version = "1", features = ["full"] }, tokio-util = { version = "0.7", features = ["rt"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/40_async-practice_p4.rs"

use std::time::Duration;
use tokio::sync::mpsc;
use tokio::time::sleep;
use tokio_util::sync::CancellationToken;

/// 고치기 전: 종료 신호가 오면 바로 끝난다. 큐에 남은 메시지는 사라진다.
async fn worker_bad(mut rx: mpsc::Receiver<u32>, token: CancellationToken) -> Vec<u32> {
    let mut done = Vec::new();
    loop {
        tokio::select! {
            biased;
            _ = token.cancelled() => break,
            m = rx.recv() => match m {
                Some(m) => { sleep(Duration::from_millis(5)).await; done.push(m); }
                None => break,
            },
        }
    }
    done
}

/// 고친 뒤: 신호가 오면 close로 새 메시지를 막고, 남은 메시지를 다 처리한다.
async fn worker_good(mut rx: mpsc::Receiver<u32>, token: CancellationToken) -> Vec<u32> {
    let mut done = Vec::new();
    loop {
        tokio::select! {
            biased;
            _ = token.cancelled() => break,
            m = rx.recv() => match m {
                Some(m) => { sleep(Duration::from_millis(5)).await; done.push(m); }
                None => return done,
            },
        }
    }
    rx.close(); // 이제 send는 실패한다. 이미 들어온 것은 남아 있다.
    while let Some(m) = rx.recv().await {
        sleep(Duration::from_millis(5)).await;
        done.push(m);
    }
    done
}

/// 변형: 신호 뒤 close 없이 남은 것을 꺼낸다. 보내는 쪽이 살아 있으면 recv가 None을 내지 않는다.
async fn worker_no_close(mut rx: mpsc::Receiver<u32>, token: CancellationToken) -> Vec<u32> {
    let mut done = Vec::new();
    token.cancelled().await;
    while let Some(m) = rx.recv().await {
        done.push(m);
    }
    done
}

async fn scenario(good: bool) -> (Vec<u32>, bool) {
    let (tx, rx) = mpsc::channel(32);
    let token = CancellationToken::new();
    for i in 1..=20 {
        tx.send(i).await.unwrap(); // 20개를 한꺼번에 넣는다
    }
    let w = if good {
        tokio::spawn(worker_good(rx, token.clone()))
    } else {
        tokio::spawn(worker_bad(rx, token.clone()))
    };
    sleep(Duration::from_millis(22)).await; // 몇 개 처리했을 때 종료 신호
    token.cancel();
    let done = w.await.unwrap();
    let late_send_failed = tx.send(99).await.is_err(); // 받는 쪽이 닫혔거나 사라졌다
    (done, late_send_failed)
}

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let (bad, _) = scenario(false).await;
    let (good, late_failed) = scenario(true).await;
    println!(
        "고치기 전 처리 {}개, 고친 뒤 처리 {}개, 종료 뒤 send 실패 {late_failed}",
        bad.len(),
        good.len()
    );
    assert!(bad.len() < 20);
    assert_eq!(good, (1..=20).collect::<Vec<_>>());
    assert!(late_failed);

    let (tx, rx) = mpsc::channel(32);
    let token = CancellationToken::new();
    for i in 1..=5 {
        tx.send(i).await.unwrap();
    }
    let w = tokio::spawn(worker_no_close(rx, token.clone()));
    token.cancel();
    let ended = tokio::time::timeout(Duration::from_millis(100), w)
        .await
        .is_ok();
    println!("변형(close 없이 비우기, tx가 살아 있음): 100ms 안에 끝남 {ended}");
    assert!(!ended);
    drop(tx);
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
