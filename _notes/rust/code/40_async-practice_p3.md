---
layout: "note"
title: "40_async-practice_p3.rs"
display_title: "40_async-practice_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "40"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/async-practice/"
parent_title: "async 연습"
description: "Rust · async 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/40_async-practice_p3/"
---
{% raw %}
[async 연습](/Hongs_Blog/studies/rust/async-practice/) 문서의 문제 3 풀이 코드다.

```rust
//! async 연습 p3: 일감 12개를 동시에 최대 3개씩, 하나에 60ms 제한으로 처리한다.
//! 늦는 일은 TimedOut으로 표시하고, 결과는 번호 순으로 돌려준다.
//! 변형: 자리(permit) 기다리기까지 시간 제한 안에 넣으면, 줄 서 있던 일까지 TimedOut이 되는 것을 확인한다.
//! 의존성: tokio = { version = "1", features = ["full"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/40_async-practice_p3.rs"

use std::sync::Arc;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::Duration;
use tokio::sync::Semaphore;
use tokio::task::JoinSet;
use tokio::time::{sleep, timeout};

#[derive(Debug, PartialEq)]
enum Outcome {
    Done(u32),
    TimedOut,
}

/// 일감 id 하나를 처리한다. id가 4의 배수면 200ms, 아니면 20ms 걸린다.
async fn job(id: u32, in_flight: Arc<AtomicUsize>, peak: Arc<AtomicUsize>) -> u32 {
    let now = in_flight.fetch_add(1, Ordering::SeqCst) + 1;
    peak.fetch_max(now, Ordering::SeqCst);
    // 취소돼도 in_flight를 줄이도록 Drop에서 처리한다
    struct Leave(Arc<AtomicUsize>);
    impl Drop for Leave {
        fn drop(&mut self) {
            self.0.fetch_sub(1, Ordering::SeqCst);
        }
    }
    let _leave = Leave(in_flight);
    let ms = if id.is_multiple_of(4) { 200 } else { 20 };
    sleep(Duration::from_millis(ms)).await;
    id * id
}

async fn run_all(ids: Vec<u32>, limit: usize, per_job: Duration) -> (Vec<(u32, Outcome)>, usize) {
    let sem = Arc::new(Semaphore::new(limit));
    let in_flight = Arc::new(AtomicUsize::new(0));
    let peak = Arc::new(AtomicUsize::new(0));
    let mut set = JoinSet::new();
    for id in ids {
        let permit = sem
            .clone()
            .acquire_owned()
            .await
            .expect("세마포어를 닫지 않는다");
        let (inf, pk) = (in_flight.clone(), peak.clone());
        set.spawn(async move {
            let r = match timeout(per_job, job(id, inf, pk)).await {
                Ok(v) => Outcome::Done(v),
                Err(_) => Outcome::TimedOut,
            };
            drop(permit); // timeout으로 끝나도 자리는 여기서 돌려준다
            (id, r)
        });
    }
    let mut out = Vec::new();
    while let Some(r) = set.join_next().await {
        out.push(r.expect("태스크가 panic하지 않는다"));
    }
    out.sort_by_key(|(id, _)| *id);
    (out, peak.load(Ordering::SeqCst))
}

/// 변형: 일을 모두 먼저 띄우고, 각 태스크가 timeout 안에서 자리를 기다린다.
async fn run_all_wait_inside(ids: Vec<u32>, limit: usize, per_job: Duration) -> Vec<u32> {
    let sem = Arc::new(Semaphore::new(limit));
    let in_flight = Arc::new(AtomicUsize::new(0));
    let peak = Arc::new(AtomicUsize::new(0));
    let mut set = JoinSet::new();
    for id in ids {
        let (sem, inf, pk) = (sem.clone(), in_flight.clone(), peak.clone());
        set.spawn(async move {
            let r = timeout(per_job, async {
                let _permit = sem.acquire().await.expect("세마포어를 닫지 않는다");
                job(id, inf, pk).await
            })
            .await;
            (id, r.is_err())
        });
    }
    let mut late = Vec::new();
    while let Some(r) = set.join_next().await {
        let (id, timed_out) = r.expect("태스크가 panic하지 않는다");
        if timed_out {
            late.push(id);
        }
    }
    late.sort_unstable();
    late
}

#[tokio::main]
async fn main() {
    let (out, peak) = run_all((1..=12).collect(), 3, Duration::from_millis(60)).await;
    for (id, r) in &out {
        println!("{id:>2}: {r:?}");
    }
    let timed_out: Vec<u32> = out
        .iter()
        .filter(|(_, r)| *r == Outcome::TimedOut)
        .map(|(id, _)| *id)
        .collect();
    println!("늦은 일: {timed_out:?}, 최대 동시 실행 {peak}");
    assert_eq!(timed_out, [4, 8, 12]);
    assert_eq!(out[2], (3, Outcome::Done(9)));
    assert_eq!(peak, 3);

    let late_inside = run_all_wait_inside((1..=12).collect(), 3, Duration::from_millis(60)).await;
    println!("변형(자리 기다리기까지 제한 안에): 늦은 일 {late_inside:?}");
    assert!(late_inside.len() > timed_out.len());
    assert!(timed_out.iter().all(|id| late_inside.contains(id)));
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
