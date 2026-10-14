---
layout: "note"
title: "39_backpressure_impl.rs"
display_title: "39_backpressure_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "39"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/backpressure/"
parent_title: "백프레셔와 큐 제한"
description: "Rust · 백프레셔와 큐 제한 구현 코드"
permalink: "/studies/rust/code/39_backpressure_impl/"
---
{% raw %}
[백프레셔와 큐 제한](/Hongs_Blog/studies/rust/backpressure/) 문서의 구현 코드다.

```rust
//! 생산자가 소비자보다 빠를 때 큐가 어떻게 되는지 잰다: 무제한 채널, 크기 제한 채널(send가 기다림),
//! try_send로 버리기(load shedding), Semaphore로 동시 실행 수 제한, try_acquire로 바로 거절,
//! axum 서버에 건 동시 처리 상한이 ConcurrencyLimitLayer와 GlobalConcurrencyLimitLayer에서 다르게 듣는 것.
//! 의존성: tokio = { version = "1", features = ["full"] }, axum = "0.8", tower = { version = "0.5", features = ["limit"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/39_backpressure_impl.rs"

use axum::Router;
use axum::routing::get;
use std::sync::Arc;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::{Duration, Instant};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::sync::{Semaphore, mpsc};
use tokio::task::JoinSet;
use tokio::time::sleep;
use tower::limit::{ConcurrencyLimitLayer, GlobalConcurrencyLimitLayer};

const N: usize = 200; // 일감 수
const CAP: usize = 16; // 크기 제한 채널의 칸 수

/// 일감 하나에 1ms 걸리는 소비자
async fn slow_consume(item: usize) -> usize {
    sleep(Duration::from_millis(1)).await;
    item
}

/// axum 서버를 127.0.0.1:0에 띄우고, 연결 4개로 동시에 요청해 핸들러가 함께 돈 최대 개수를 잰다.
/// 상한은 1이다. global이면 GlobalConcurrencyLimitLayer, 아니면 ConcurrencyLimitLayer를 Router::layer로 건다.
async fn served_peak(global: bool) -> usize {
    let now = Arc::new(AtomicUsize::new(0));
    let peak = Arc::new(AtomicUsize::new(0));
    let handler = {
        let (now, peak) = (now.clone(), peak.clone());
        move || async move {
            let n = now.fetch_add(1, Ordering::SeqCst) + 1;
            peak.fetch_max(n, Ordering::SeqCst);
            sleep(Duration::from_millis(30)).await;
            now.fetch_sub(1, Ordering::SeqCst);
            "ok"
        }
    };
    let router = Router::new().route("/work", get(handler));
    let app = if global {
        router.layer(GlobalConcurrencyLimitLayer::new(1))
    } else {
        router.layer(ConcurrencyLimitLayer::new(1))
    };
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    let server = tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
    let mut clients = JoinSet::new();
    for _ in 0..4 {
        clients.spawn(async move {
            let mut s = tokio::net::TcpStream::connect(addr).await.unwrap();
            s.write_all(b"GET /work HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n")
                .await
                .unwrap();
            let mut reply = String::new();
            s.read_to_string(&mut reply).await.unwrap();
            assert!(reply.starts_with("HTTP/1.1 200"), "{reply}");
        });
    }
    while let Some(r) = clients.join_next().await {
        r.unwrap();
    }
    server.abort();
    peak.load(Ordering::SeqCst)
}

#[tokio::main(flavor = "current_thread")]
async fn main() {
    // 0. 크기 2 채널의 칸: try_send 두 번은 들어가고 세 번째는 Full로 값을 돌려준다
    let (tx, mut rx) = mpsc::channel::<u32>(2);
    let r = [tx.try_send(1), tx.try_send(2), tx.try_send(3)];
    println!(
        "channel(2): try_send 1 {:?}, 2 {:?}, 3 {:?}, 남은 칸 {}",
        r[0],
        r[1],
        r[2],
        tx.capacity()
    );
    assert!(r[0].is_ok() && r[1].is_ok());
    assert!(matches!(r[2], Err(mpsc::error::TrySendError::Full(3))));
    assert_eq!(tx.capacity(), 0);
    assert_eq!(rx.recv().await, Some(1));
    assert_eq!(tx.capacity(), 1);
    drop(rx);
    let closed = tx.try_send(4);
    let closed_dbg = format!("{closed:?}");
    assert!(matches!(closed, Err(mpsc::error::TrySendError::Closed(4))));
    assert_eq!(format!("{:?}", r[2]), r#"Err("Full(..)")"#);
    assert_eq!(closed_dbg, r#"Err("Closed(..)")"#);
    println!(
        "recv 한 번 뒤 남은 칸 1, 수신자를 버린 뒤 try_send(4) -> {closed_dbg} (값 4를 품고 있다)"
    );

    // 1. 무제한 채널: send가 기다리지 않으니 생산자가 모든 일을 큐에 쌓고 끝난다
    let (tx, mut rx) = mpsc::unbounded_channel::<usize>();
    let done = Arc::new(AtomicUsize::new(0)); // 소비자가 처리한 개수
    let d2 = done.clone();
    let consumer = tokio::spawn(async move {
        let t = Instant::now();
        let mut n = 0;
        while let Some(i) = rx.recv().await {
            slow_consume(i).await;
            n += 1;
            d2.store(n, Ordering::SeqCst);
        }
        (n, t.elapsed())
    });
    let mut max_len_unbounded = 0;
    for i in 0..N {
        tx.send(i).unwrap(); // 절대 기다리지 않는다
        let queued = i + 1 - done.load(Ordering::SeqCst); // 보냈지만 아직 처리 안 된 개수
        max_len_unbounded = max_len_unbounded.max(queued);
    }
    drop(tx);
    let (consumed, spent) = consumer.await.unwrap();
    assert_eq!(consumed, N);
    let per_item = spent.as_secs_f64() * 1000.0 / N as f64;
    println!("무제한 채널: 큐 최대 길이 {max_len_unbounded} / 일감 {N}");
    println!("소비자 한 개당 평균 {per_item:.1}ms (sleep(1ms)를 부른다)");
    assert_eq!(max_len_unbounded, N);
    assert!(per_item >= 1.0);

    // 2. 크기 제한 채널: 큐가 차면 send().await가 기다린다 → 생산자가 소비자 속도로 느려진다
    let (tx, mut rx) = mpsc::channel::<usize>(CAP);
    let consumer = tokio::spawn(async move {
        let mut n = 0;
        while let Some(i) = rx.recv().await {
            slow_consume(i).await;
            n += 1;
        }
        n
    });
    let t = Instant::now();
    let mut max_len_bounded = 0;
    for i in 0..N {
        tx.send(i).await.unwrap(); // 칸이 없으면 여기서 기다린다
        max_len_bounded = max_len_bounded.max(tx.max_capacity() - tx.capacity());
    }
    let producer_ms = t.elapsed().as_millis();
    drop(tx);
    assert_eq!(consumer.await.unwrap(), N);
    println!(
        "크기 {CAP} 채널: 큐 최대 길이 {max_len_bounded}, 생산자가 다 보내는 데 {producer_ms}ms"
    );
    assert!(max_len_bounded <= CAP);
    assert!(producer_ms as usize >= N - CAP); // 1ms짜리 소비를 (N - CAP)번은 기다렸다

    // 3. try_send: 기다리지 않고, 큐가 차 있으면 그 일을 버린다(load shedding)
    let (tx, mut rx) = mpsc::channel::<usize>(CAP);
    let consumer = tokio::spawn(async move {
        let mut n = 0;
        while let Some(i) = rx.recv().await {
            slow_consume(i).await;
            n += 1;
        }
        n
    });
    let (mut accepted, mut shed) = (0, 0);
    for i in 0..N {
        match tx.try_send(i) {
            Ok(()) => accepted += 1,
            Err(mpsc::error::TrySendError::Full(_)) => shed += 1,
            Err(mpsc::error::TrySendError::Closed(_)) => unreachable!(),
        }
        if i % 10 == 9 {
            sleep(Duration::from_millis(2)).await; // 생산자는 10개마다 2ms 쉰다: 소비자보다 약 5배 빠르다
        }
    }
    drop(tx);
    let consumed = consumer.await.unwrap();
    println!("try_send: 받아들임 {accepted}, 버림 {shed}, 처리 {consumed}");
    assert_eq!(accepted + shed, N);
    assert_eq!(consumed, accepted);
    assert!(shed > 0);

    // 4. Semaphore: 동시에 도는 일을 4개로 묶는다
    let sem = Arc::new(Semaphore::new(4));
    let in_flight = Arc::new(AtomicUsize::new(0));
    let peak = Arc::new(AtomicUsize::new(0));
    let mut set = JoinSet::new();
    let t = Instant::now();
    for _ in 0..40 {
        let permit = sem.clone().acquire_owned().await.unwrap(); // 자리가 없으면 여기서 기다린다
        let (inf, pk) = (in_flight.clone(), peak.clone());
        set.spawn(async move {
            let now = inf.fetch_add(1, Ordering::SeqCst) + 1;
            pk.fetch_max(now, Ordering::SeqCst);
            sleep(Duration::from_millis(10)).await;
            inf.fetch_sub(1, Ordering::SeqCst);
            drop(permit); // 끝나면 자리를 돌려준다
        });
    }
    while set.join_next().await.is_some() {}
    let ms = t.elapsed().as_millis();
    println!(
        "Semaphore(4): 일 40개, 최대 동시 실행 {}, {ms}ms",
        peak.load(Ordering::SeqCst)
    );
    assert_eq!(peak.load(Ordering::SeqCst), 4);
    assert!(ms >= 100); // 40 / 4 = 10묶음 × 10ms

    // 5. try_acquire: 자리가 없으면 기다리지 않고 바로 거절한다(HTTP라면 503)
    let sem = Arc::new(Semaphore::new(3));
    let mut set = JoinSet::new();
    let mut rejected = 0;
    for _ in 0..10 {
        match sem.clone().try_acquire_owned() {
            Ok(permit) => {
                set.spawn(async move {
                    sleep(Duration::from_millis(50)).await;
                    drop(permit);
                });
            }
            Err(_) => rejected += 1,
        }
    }
    let served = set.len();
    while set.join_next().await.is_some() {}
    println!("try_acquire(3자리): 동시 요청 10개 중 처리 {served}, 거절 {rejected}");
    assert_eq!((served, rejected), (3, 7));

    // 6. axum 서버의 동시 처리 상한 1: Router::layer(ConcurrencyLimitLayer)는 연결 사이에 상한을 나누지 않는다
    let per_layer = served_peak(false).await;
    let global = served_peak(true).await;
    println!(
        "axum 상한 1, 연결 4개: ConcurrencyLimitLayer 최대 동시 {per_layer}, GlobalConcurrencyLimitLayer 최대 동시 {global}"
    );
    assert_eq!(per_layer, 4);
    assert_eq!(global, 1);

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
