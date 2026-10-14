---
layout: "note"
title: "40_graceful-shutdown_impl.rs"
display_title: "40_graceful-shutdown_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "40"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/graceful-shutdown/"
parent_title: "안전한 종료"
description: "Rust · 안전한 종료 구현 코드"
sitemap: false
permalink: "/studies/rust/code/40_graceful-shutdown_impl/"
---
{% raw %}
[안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/) 문서의 구현 코드다.

```rust
//! 안전한 종료 순서를 흉내 낸 서버로 확인한다: 신호 → 새 요청 받기 중단 → 처리 중인 요청 마저 끝내기(마감 시간)
//! → 마감을 넘기면 강제 취소 → 기록(telemetry) 비우기 → 종료. 신호는 토큰을 직접 취소해 흉내 낸다.
//! 덧붙여, 기다리지 않고 런타임을 버리면(main이 그냥 끝나면) 처리 중인 태스크가 사라지는 것과,
//! 런타임을 버릴 때 spawn_blocking 작업은 끝까지 기다리는 것(shutdown_timeout은 기다리지 않는 것)을 확인한다.
//! 의존성: tokio = { version = "1", features = ["full"] }, tokio-util = { version = "0.7", features = ["rt"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/40_graceful-shutdown_impl.rs"
//!
//! 진짜 서버에서는 shutdown_signal이 Ctrl+C(SIGINT)를 기다리다 토큰을 취소한다.
//! 이 파일은 스스로 끝나야 하므로 Ctrl+C 대신 main이 토큰을 취소한다.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tokio::sync::mpsc;
use tokio::time::{sleep, timeout};
use tokio_util::sync::CancellationToken;
use tokio_util::task::TaskTracker;

/// 요청 하나: 번호와 처리에 걸리는 시간
struct Req {
    id: u32,
    cost: Duration,
}

/// 사건 기록. 프로그램이 끝나기 전에 flush해야 밖으로 나간다(로그·지표 수집기 흉내).
#[derive(Default)]
struct Telemetry {
    buffer: Mutex<Vec<String>>,
    flushed: Mutex<Vec<String>>,
}

impl Telemetry {
    fn record(&self, s: String) {
        self.buffer.lock().unwrap().push(s);
    }
    fn flush(&self) {
        let mut b = self.buffer.lock().unwrap();
        self.flushed.lock().unwrap().append(&mut b);
    }
}

/// 진짜 서버의 종료 신호: Ctrl+C가 오거나, 다른 곳에서 토큰이 취소되면 끝난다.
async fn shutdown_signal(token: CancellationToken) {
    tokio::select! {
        r = tokio::signal::ctrl_c() => {
            r.expect("Ctrl+C 처리기 설치");
            token.cancel();
        }
        _ = token.cancelled() => {}
    }
}

async fn handle(req: Req, hard: CancellationToken, tel: Arc<Telemetry>) {
    tokio::select! {
        _ = sleep(req.cost) => tel.record(format!("완료 {}", req.id)),
        _ = hard.cancelled() => tel.record(format!("강제 중단 {}", req.id)),
    }
}

/// 요청을 받아 TaskTracker에 태스크로 띄운다. 종료 토큰이 취소되면 받기를 멈춘다.
async fn accept_loop(
    mut incoming: mpsc::Receiver<Req>,
    shutdown: CancellationToken,
    hard: CancellationToken,
    tracker: TaskTracker,
    tel: Arc<Telemetry>,
) -> mpsc::Receiver<Req> {
    loop {
        tokio::select! {
            biased; // 종료 신호를 먼저 본다. 요청이 쉬지 않고 와도 종료가 밀리지 않는다.
            _ = shutdown.cancelled() => break,
            Some(req) = incoming.recv() => {
                tel.record(format!("받음 {}", req.id));
                tracker.spawn(handle(req, hard.clone(), tel.clone()));
            }
            else => break,
        }
    }
    tel.record("받기 중단".into());
    incoming // 받지 않은 요청이 남아 있는지 보려고 돌려준다
}

struct Outcome {
    log: Vec<String>,
    drained_in_time: bool,
    not_accepted: usize,
    shutdown_ms: u128,
}

/// 서버를 띄우고, `cancel_after` 뒤에 종료를 시작해 `deadline` 안에 마무리한다.
async fn run(costs: &[u64], gap_ms: u64, cancel_after: u64, deadline: Duration) -> Outcome {
    let shutdown = CancellationToken::new();
    let hard = CancellationToken::new(); // 마감을 넘겼을 때만 쓰는 두 번째 단계
    let tracker = TaskTracker::new();
    let tel = Arc::new(Telemetry::default());

    let signal = tokio::spawn(shutdown_signal(shutdown.clone()));

    let (tx, rx) = mpsc::channel(64);
    let costs = costs.to_vec();
    let client = tokio::spawn(async move {
        for (i, ms) in costs.into_iter().enumerate() {
            let req = Req {
                id: i as u32 + 1,
                cost: Duration::from_millis(ms),
            };
            if tx.send(req).await.is_err() {
                break;
            }
            sleep(Duration::from_millis(gap_ms)).await;
        }
    });
    let acceptor = tokio::spawn(accept_loop(
        rx,
        shutdown.clone(),
        hard.clone(),
        tracker.clone(),
        tel.clone(),
    ));

    sleep(Duration::from_millis(cancel_after)).await;
    // ---- 여기부터 종료 순서 ----
    let t = Instant::now();
    shutdown.cancel(); // 1. 신호 (진짜로는 Ctrl+C)
    signal.await.unwrap();
    let mut rest = acceptor.await.unwrap(); // 2. 받기 중단을 확인한다
    tracker.close(); // 3. 더 띄울 태스크가 없다고 알린다(close 없이는 wait가 끝나지 않는다)
    let drained_in_time = timeout(deadline, tracker.wait()).await.is_ok(); // 4. 마감 시간 안에 기다린다
    if !drained_in_time {
        hard.cancel(); // 5. 마감을 넘기면 남은 일을 강제로 끊는다
        tracker.wait().await;
    }
    tel.record("기록 비움".into());
    tel.flush(); // 6. 마지막으로 기록을 내보낸다
    let shutdown_ms = t.elapsed().as_millis();
    client.abort();
    rest.close();
    let mut not_accepted = 0;
    while rest.try_recv().is_ok() {
        not_accepted += 1;
    }
    let log = tel.flushed.lock().unwrap().clone();
    Outcome {
        log,
        drained_in_time,
        not_accepted,
        shutdown_ms,
    }
}

fn count(log: &[String], prefix: &str) -> usize {
    log.iter().filter(|s| s.starts_with(prefix)).count()
}

fn pos(log: &[String], s: &str) -> usize {
    log.iter().position(|x| x == s).unwrap()
}

/// 런타임을 새로 만들어 태스크 하나(50ms)를 띄우고 10ms 뒤 런타임을 버린다. 태스크가 끝까지 돌았는지 돌려준다.
fn drop_runtime_mid_task() -> bool {
    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(1)
        .enable_all()
        .build()
        .unwrap();
    let done = Arc::new(AtomicBool::new(false));
    let d = done.clone();
    rt.spawn(async move {
        sleep(Duration::from_millis(50)).await;
        d.store(true, Ordering::SeqCst);
    });
    std::thread::sleep(Duration::from_millis(10));
    drop(rt); // #[tokio::main]의 main이 끝날 때와 같다
    std::thread::sleep(Duration::from_millis(80)); // 태스크가 살아 있었다면 끝났을 시간
    done.load(Ordering::SeqCst)
}

/// 200ms짜리 spawn_blocking 작업이 있는 런타임을 끝내는 데 걸린 시간(ms).
fn runtime_exit_ms(use_shutdown_timeout: bool) -> u128 {
    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(1)
        .enable_all()
        .build()
        .unwrap();
    rt.spawn_blocking(|| std::thread::sleep(Duration::from_millis(200)));
    std::thread::sleep(Duration::from_millis(10)); // 작업이 시작되게 한다
    let t = Instant::now();
    if use_shutdown_timeout {
        rt.shutdown_timeout(Duration::from_millis(20));
    } else {
        drop(rt);
    }
    t.elapsed().as_millis()
}

#[tokio::main]
async fn main() {
    // 장면 1: 요청 6개가 20ms 간격으로 오고 하나에 80ms 걸린다. 50ms에 종료 시작, 마감 1초.
    let o = run(&[80; 6], 20, 50, Duration::from_secs(1)).await;
    println!("장면 1 기록: {:?}", o.log);
    let accepted = count(&o.log, "받음");
    println!(
        "받음 {accepted}, 완료 {}, 강제 중단 {}, 받지 않은 요청 {}, 마감 안에 끝남 {}, 종료에 {}ms",
        count(&o.log, "완료"),
        count(&o.log, "강제 중단"),
        o.not_accepted,
        o.drained_in_time,
        o.shutdown_ms
    );
    assert!(o.drained_in_time);
    assert!((2..6).contains(&accepted)); // 종료 전에 받은 것만 받았다
    assert_eq!(count(&o.log, "완료"), accepted); // 받은 것은 모두 끝냈다
    assert_eq!(count(&o.log, "강제 중단"), 0);
    // 순서: 받기 중단 → (처리 중이던 요청 완료) → 기록 비움
    let stop = pos(&o.log, "받기 중단");
    assert!(o.log[..stop].iter().all(|s| !s.starts_with("완료")));
    assert_eq!(o.log.last().unwrap(), "기록 비움");

    // 장면 2: 5초짜리 요청이 끼어 있다. 마감 100ms가 지나면 강제로 끊고 끝난다.
    let o = run(&[30, 5000, 30], 10, 40, Duration::from_millis(100)).await;
    println!("장면 2 기록: {:?}", o.log);
    println!(
        "마감 안에 끝남 {}, 강제 중단 {}, 종료에 {}ms",
        o.drained_in_time,
        count(&o.log, "강제 중단"),
        o.shutdown_ms
    );
    assert!(!o.drained_in_time);
    assert_eq!(count(&o.log, "강제 중단"), 1);
    assert!(o.log.contains(&"강제 중단 2".to_string()));
    assert!(o.shutdown_ms >= 100 && o.shutdown_ms < 1000); // 5초를 기다리지 않았다
    assert_eq!(o.log.last().unwrap(), "기록 비움");

    // 장면 3: close를 부르지 않으면 wait는 태스크가 모두 끝나도 돌아오지 않는다
    let tracker = TaskTracker::new();
    tracker.spawn(async {});
    sleep(Duration::from_millis(10)).await;
    let without_close = timeout(Duration::from_millis(50), tracker.wait())
        .await
        .is_ok();
    tracker.close();
    let with_close = timeout(Duration::from_millis(50), tracker.wait())
        .await
        .is_ok();
    println!("close 없이 wait: {without_close}, close 뒤 wait: {with_close}");
    assert!(!without_close && with_close);

    // 장면 4: 기다리지 않고 런타임을 버리면 처리 중인 태스크는 끝나지 못한다
    let finished = tokio::task::spawn_blocking(drop_runtime_mid_task)
        .await
        .unwrap();
    println!("런타임을 버렸을 때 50ms 태스크가 끝까지 돌았나: {finished}");
    assert!(!finished);

    // 장면 5: 런타임을 버리면 spawn_blocking 작업(200ms)은 끝날 때까지 기다린다
    let (drop_ms, timeout_ms) =
        tokio::task::spawn_blocking(|| (runtime_exit_ms(false), runtime_exit_ms(true)))
            .await
            .unwrap();
    println!(
        "블로킹 작업이 남은 런타임 끝내기: drop {drop_ms}ms, shutdown_timeout(20ms) {timeout_ms}ms"
    );
    assert!(drop_ms >= 150);
    assert!(timeout_ms < 100);

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
