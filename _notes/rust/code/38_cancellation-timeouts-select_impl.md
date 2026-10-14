---
layout: "note"
title: "38_cancellation-timeouts-select_impl.rs"
display_title: "38_cancellation-timeouts-select_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "38"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/cancellation-timeouts-select/"
parent_title: "취소·타임아웃·select"
description: "Rust · 취소·타임아웃·select 구현 코드"
permalink: "/studies/rust/code/38_cancellation-timeouts-select_impl/"
---
{% raw %}
[취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/) 문서의 구현 코드다.

```rust
//! 취소 = 퓨처를 버리는 것, timeout의 동작과 한계, select!의 무작위·biased 순서,
//! 취소에 안전한(cancel safe) 퓨처와 아닌 퓨처, CancellationToken을 확인한다.
//! 의존성: tokio = { version = "1", features = ["full"] }, tokio-util = { version = "0.7", features = ["rt"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/38_cancellation-timeouts-select_impl.rs"
//!
//! tokio::time::pause(가짜 시계)는 test-util 기능이 필요한데 harness에 없다. 그래서 실제 시간을
//! 쓰고, 시간 간격을 넉넉히 벌려 결과가 흔들리지 않게 했다.

use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;
use tokio::sync::mpsc;
use tokio::time::{sleep, timeout};
use tokio_util::sync::CancellationToken;

/// 버려질 때 깃발을 세운다. 퓨처 안의 지역 변수가 취소 때 정리되는지 보는 데 쓴다.
struct Guard(Arc<AtomicBool>);
impl Drop for Guard {
    fn drop(&mut self) {
        self.0.store(true, Ordering::SeqCst);
    }
}

async fn slow_job(dropped: Arc<AtomicBool>, after_await: Arc<AtomicBool>) -> u32 {
    let _g = Guard(dropped);
    sleep(Duration::from_millis(200)).await; // 여기서 취소된다
    after_await.store(true, Ordering::SeqCst); // 이 줄은 끝내 돌지 않는다
    1
}

/// 취소에 안전하지 않다: 첫 메시지를 지역 변수에 받아 둔 채 둘째를 기다린다.
async fn read_two(rx: &mut mpsc::Receiver<u32>) -> Option<(u32, u32)> {
    let a = rx.recv().await?;
    let b = rx.recv().await?; // 여기서 취소되면 a는 사라진다
    Some((a, b))
}

/// 취소에 안전하다: 받아 둔 첫 메시지를 퓨처 밖(`pending`)에 둔다.
async fn read_two_safe(
    rx: &mut mpsc::Receiver<u32>,
    pending: &mut Option<u32>,
) -> Option<(u32, u32)> {
    if pending.is_none() {
        *pending = Some(rx.recv().await?);
    }
    let b = rx.recv().await?;
    Some((pending.take().unwrap(), b))
}

/// 30ms마다 1..=n을 보내는 생산자
fn producer(n: u32) -> mpsc::Receiver<u32> {
    let (tx, rx) = mpsc::channel(16);
    tokio::spawn(async move {
        for i in 1..=n {
            sleep(Duration::from_millis(30)).await;
            tx.send(i).await.unwrap();
        }
    });
    rx
}

#[tokio::main(flavor = "current_thread")]
async fn main() {
    // 1. timeout이 지나면 안쪽 퓨처를 버린다: 지역 변수는 정리되고, .await 뒤 코드는 돌지 않는다
    let dropped = Arc::new(AtomicBool::new(false));
    let after = Arc::new(AtomicBool::new(false));
    let r = timeout(
        Duration::from_millis(20),
        slow_job(dropped.clone(), after.clone()),
    )
    .await;
    println!(
        "timeout 결과 is_err={}, Guard 정리됨={}, .await 뒤 코드 실행됨={}",
        r.is_err(),
        dropped.load(Ordering::SeqCst),
        after.load(Ordering::SeqCst)
    );
    assert!(r.is_err());
    assert!(dropped.load(Ordering::SeqCst));
    assert!(!after.load(Ordering::SeqCst));

    // 2. 이미 끝난 퓨처는 시간 0이어도 Ok
    assert_eq!(timeout(Duration::ZERO, async { 5 }).await, Ok(5));

    // 3. 양보(.await)하지 않는 퓨처는 timeout이 끊지 못한다
    let r = timeout(Duration::from_millis(10), async {
        std::thread::sleep(Duration::from_millis(100)); // .await가 없다
        "다 돌았다"
    })
    .await;
    println!("양보 없는 100ms 작업에 10ms timeout: {r:?}");
    assert_eq!(r, Ok("다 돌았다"));

    // 4. select!: 둘 다 준비돼 있으면 기본은 무작위, biased면 위에서부터
    let (mut first_default, mut first_biased) = (0, 0);
    for _ in 0..1000 {
        tokio::select! {
            _ = std::future::ready(()) => first_default += 1,
            _ = std::future::ready(()) => {},
        }
        tokio::select! {
            biased;
            _ = std::future::ready(()) => first_biased += 1,
            _ = std::future::ready(()) => {},
        }
    }
    println!("1000번 중 첫 가지가 뽑힌 횟수: 기본 {first_default}, biased {first_biased}");
    assert!(first_default > 300 && first_default < 700);
    assert_eq!(first_biased, 1000);

    // 5. 취소 안전성: 10ms 타이머와 경쟁시키며 메시지 6개를 받는다
    let mut rx = producer(6);
    let mut got_recv = Vec::new();
    loop {
        tokio::select! {
            m = rx.recv() => match m { Some(m) => got_recv.push(m), None => break },
            _ = sleep(Duration::from_millis(10)) => {} // 하트비트 같은 다른 일
        }
    }
    let mut rx = producer(6);
    let mut got_two = Vec::new();
    loop {
        tokio::select! {
            p = read_two(&mut rx) => match p { Some((a, b)) => got_two.extend([a, b]), None => break },
            _ = sleep(Duration::from_millis(10)) => {}
        }
    }
    let mut rx = producer(6);
    let mut pending = None;
    let mut got_safe = Vec::new();
    loop {
        tokio::select! {
            p = read_two_safe(&mut rx, &mut pending) => match p { Some((a, b)) => got_safe.extend([a, b]), None => break },
            _ = sleep(Duration::from_millis(10)) => {}
        }
    }
    println!("recv(): {got_recv:?} / read_two: {got_two:?} / read_two_safe: {got_safe:?}");
    assert_eq!(got_recv, [1, 2, 3, 4, 5, 6]);
    assert!(got_two.len() < 6); // 메시지를 잃는다
    assert_eq!(got_safe, [1, 2, 3, 4, 5, 6]);

    // 6. CancellationToken: 부모를 취소하면 자식도, 자식을 취소해도 부모는 그대로
    let parent = CancellationToken::new();
    let child_a = parent.child_token();
    let child_b = parent.child_token();
    child_a.cancel();
    assert!(child_a.is_cancelled() && !parent.is_cancelled() && !child_b.is_cancelled());
    parent.cancel();
    assert!(child_b.is_cancelled());
    println!("자식 취소 → 부모 그대로, 부모 취소 → 자식도 취소: 확인");

    // 6-1. 작업 루프가 토큰을 보고 스스로 정리하고 끝난다
    let token = CancellationToken::new();
    let t2 = token.clone();
    let worker = tokio::spawn(async move {
        let mut ticks = 0u32;
        loop {
            tokio::select! {
                biased; // 종료 신호를 먼저 본다
                _ = t2.cancelled() => break,
                _ = sleep(Duration::from_millis(5)) => ticks += 1,
            }
        }
        ticks // 정리할 일이 있으면 여기서 한다(버퍼 비우기 등)
    });
    sleep(Duration::from_millis(30)).await;
    token.cancel();
    let ticks = worker.await.unwrap();
    println!("작업 루프: 취소 신호를 받고 스스로 끝남 (그 전에 {ticks}번 일함)");
    assert!(ticks > 0);

    // 6-2. run_until_cancelled: 먼저 취소되면 None
    let token = CancellationToken::new();
    token.cancel();
    let r = token
        .run_until_cancelled(sleep(Duration::from_secs(10)))
        .await;
    assert_eq!(r, None);

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
