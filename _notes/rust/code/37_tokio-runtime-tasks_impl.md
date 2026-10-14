---
layout: "note"
title: "37_tokio-runtime-tasks_impl.rs"
display_title: "37_tokio-runtime-tasks_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "37"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/tokio-runtime-tasks/"
parent_title: "tokio 런타임과 태스크"
description: "Rust · tokio 런타임과 태스크 구현 코드"
sitemap: false
permalink: "/studies/rust/code/37_tokio-runtime-tasks_impl/"
---
{% raw %}
[tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/) 문서의 구현 코드다.

```rust
//! tokio 런타임 두 종류, spawn·JoinHandle·JoinSet, 실행기를 막는 코드의 지연, spawn_blocking,
//! tokio::sync::Mutex를 확인한다.
//! 의존성: tokio = { version = "1", features = ["full"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/37_tokio-runtime-tasks_impl.rs"
//!
//! 보통 프로그램은 main에 #[tokio::main]을 붙인다. 이 파일은 런타임 두 종류를 한 프로그램에서
//! 비교하려고 Builder로 직접 만든다. #[tokio::main]은 아래와 같다(tokio::main 문서):
//!   Builder::new_multi_thread().enable_all().build().unwrap().block_on(async { 본문 })

use std::sync::Arc;
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::time::{Duration, Instant};
use tokio::runtime::Builder;
use tokio::task::JoinSet;

/// 10ms마다 깨어나는 "심장 박동" 태스크를 돌리면서 `work`를 실행하고,
/// 박동 사이 간격의 최댓값(ms)을 돌려준다. 실행기가 막히면 이 값이 커진다.
async fn max_heartbeat_gap<F: std::future::Future<Output = ()>>(work: F) -> u128 {
    let stop = Arc::new(AtomicBool::new(false));
    let s2 = stop.clone();
    let beat = tokio::spawn(async move {
        let mut last = Instant::now();
        let mut worst = 0;
        while !s2.load(Ordering::SeqCst) {
            tokio::time::sleep(Duration::from_millis(10)).await;
            worst = worst.max(last.elapsed().as_millis());
            last = Instant::now();
        }
        worst
    });
    tokio::time::sleep(Duration::from_millis(30)).await; // 박동이 자리 잡게 둔다
    work.await;
    tokio::time::sleep(Duration::from_millis(30)).await;
    stop.store(true, Ordering::SeqCst);
    beat.await.unwrap()
}

fn main() {
    let main_thread = std::thread::current().id();

    // 1. current_thread: 모든 태스크가 block_on을 부른 이 스레드에서 돈다
    let rt = Builder::new_current_thread().enable_all().build().unwrap();
    let same = rt.block_on(async move {
        tokio::spawn(async move { std::thread::current().id() == main_thread })
            .await
            .unwrap()
    });
    println!("current_thread: 태스크가 main 스레드에서 돌았나? {same}");
    assert!(same);

    // 2. multi_thread: 작업 스레드(worker) 풀에서 돈다
    let rt_multi = Builder::new_multi_thread()
        .worker_threads(2)
        .enable_all()
        .build()
        .unwrap();
    let (name, other) = rt_multi.block_on(async move {
        tokio::spawn(async move {
            let t = std::thread::current();
            (t.name().map(str::to_owned), t.id() != main_thread)
        })
        .await
        .unwrap()
    });
    println!("multi_thread: 태스크가 돈 스레드 이름 {name:?}, main과 다른 스레드인가? {other}");
    assert!(other);

    rt.block_on(async {
        // 3. JoinHandle: 값, panic, abort
        let h = tokio::spawn(async { 6 * 7 });
        assert_eq!(h.await.unwrap(), 42);

        let h = tokio::spawn(async { panic!("태스크 안에서 panic") });
        let err = h.await.unwrap_err();
        println!("panic한 태스크: is_panic={}", err.is_panic());
        assert!(err.is_panic()); // panic은 그 태스크 안에 갇히고 JoinError로 돌아온다

        let h = tokio::spawn(async {
            tokio::time::sleep(Duration::from_secs(60)).await;
        });
        h.abort();
        let err = h.await.unwrap_err();
        println!("abort한 태스크: is_cancelled={}", err.is_cancelled());
        assert!(err.is_cancelled());

        // 4. JoinHandle을 버려도 태스크는 계속 돈다(떼어 놓기, detach)
        let done = Arc::new(AtomicBool::new(false));
        let d2 = done.clone();
        drop(tokio::spawn(async move {
            tokio::time::sleep(Duration::from_millis(20)).await;
            d2.store(true, Ordering::SeqCst);
        }));
        tokio::time::sleep(Duration::from_millis(60)).await;
        println!("JoinHandle을 버린 태스크가 끝까지 돌았나? {}", done.load(Ordering::SeqCst));
        assert!(done.load(Ordering::SeqCst));

        // 5. JoinSet: 끝난 순서대로 받는다
        let mut set = JoinSet::new();
        for ms in [30u64, 10, 20] {
            set.spawn(async move {
                tokio::time::sleep(Duration::from_millis(ms)).await;
                ms
            });
        }
        let mut order = Vec::new();
        while let Some(r) = set.join_next().await {
            order.push(r.unwrap());
        }
        println!("JoinSet이 돌려준 순서: {order:?}");
        assert_eq!(order, [10, 20, 30]);

        // 5-1. JoinSet을 버리면 남은 태스크는 abort된다
        let finished = Arc::new(AtomicBool::new(false));
        let f2 = finished.clone();
        let mut set = JoinSet::new();
        set.spawn(async move {
            tokio::time::sleep(Duration::from_millis(20)).await;
            f2.store(true, Ordering::SeqCst);
        });
        drop(set);
        tokio::time::sleep(Duration::from_millis(60)).await;
        assert!(!finished.load(Ordering::SeqCst));
        println!("JoinSet을 버린 뒤 태스크가 끝났나? false");

        // 6. 실행기를 막으면 다른 태스크가 멈춘다
        let blocked = max_heartbeat_gap(async {
            std::thread::sleep(Duration::from_millis(300)); // 잘못: 작업 스레드를 붙잡는다
        })
        .await;
        let offloaded = max_heartbeat_gap(async {
            tokio::task::spawn_blocking(|| std::thread::sleep(Duration::from_millis(300)))
                .await
                .unwrap();
        })
        .await;
        let slept = max_heartbeat_gap(async {
            tokio::time::sleep(Duration::from_millis(300)).await;
        })
        .await;
        println!(
            "박동 최대 간격: thread::sleep {blocked}ms / spawn_blocking {offloaded}ms / tokio::time::sleep {slept}ms"
        );
        assert!(blocked >= 250);
        assert!(offloaded < 150);
        assert!(slept < 150);

        // 7. 태스크는 가볍다: 1만 개를 띄워도 금방 끝난다
        let t = Instant::now();
        let counter = Arc::new(AtomicUsize::new(0));
        let mut set = JoinSet::new();
        for _ in 0..10_000 {
            let c = counter.clone();
            set.spawn(async move {
                c.fetch_add(1, Ordering::Relaxed);
            });
        }
        while set.join_next().await.is_some() {}
        println!("태스크 1만 개: {}ms", t.elapsed().as_millis());
        assert_eq!(counter.load(Ordering::Relaxed), 10_000);
    });

    // 8. tokio::sync::Mutex: 잠금을 .await 너머로 들고 있어도 된다(multi_thread에서 spawn 가능)
    let total = rt_multi.block_on(async {
        let shared = Arc::new(tokio::sync::Mutex::new(0u32));
        let mut set = JoinSet::new();
        for _ in 0..4 {
            let s = shared.clone();
            set.spawn(async move {
                let mut g = s.lock().await;
                tokio::time::sleep(Duration::from_millis(5)).await; // 잠금을 든 채 기다린다
                *g += 1;
            });
        }
        while set.join_next().await.is_some() {}
        *shared.lock().await
    });
    println!("tokio::sync::Mutex로 센 값: {total}");
    assert_eq!(total, 4);

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use std::sync::{Arc, Mutex};

    // #[tokio::test]는 테스트마다 current_thread 런타임을 만든다.
    #[tokio::test]
    async fn std_mutex_is_fine_without_await_inside() {
        let m = Arc::new(Mutex::new(Vec::new()));
        let mut hs = Vec::new();
        for i in 0..8 {
            let m = m.clone();
            hs.push(tokio::spawn(async move {
                m.lock().unwrap().push(i); // 잠깐 잡고 바로 놓는다. .await가 끼지 않는다.
            }));
        }
        for h in hs {
            h.await.unwrap();
        }
        let mut v = m.lock().unwrap().clone();
        v.sort_unstable();
        assert_eq!(v, (0..8).collect::<Vec<_>>());
    }

    #[tokio::test]
    async fn current_thread_test_runtime() {
        let flavor = tokio::runtime::Handle::current().runtime_flavor();
        assert_eq!(flavor, tokio::runtime::RuntimeFlavor::CurrentThread);
    }
}
```
{% endraw %}
