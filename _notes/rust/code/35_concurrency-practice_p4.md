---
layout: "note"
title: "35_concurrency-practice_p4.rs"
display_title: "35_concurrency-practice_p4.rs"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "35"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/concurrency-practice/"
parent_title: "동시성 연습"
description: "Rust · 동시성 연습 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/35_concurrency-practice_p4/"
---
{% raw %}
[동시성 연습](/Hongs_Blog/studies/rust/concurrency-practice/) 문서의 문제 4 풀이 코드다.

```rust
//! 동시성 연습 p4: 멈춤 깃발과 진행률. 어느 Ordering이면 충분한지 고르는 문제의 답을 돌려 본다.
//! 멈춤 깃발과 진행률은 Relaxed로 충분하다(다른 데이터를 깃발로 넘기지 않고, 결과는 join으로 받는다).
//! 깃발로 데이터를 넘기는 판은 Release/Acquire가 필요하다.
//! 주의: 이 실행이 통과해도 순서가 옳다는 증명은 아니다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/35_concurrency-practice_p4.rs"

use std::sync::atomic::{AtomicBool, AtomicU64, AtomicUsize, Ordering};
use std::thread;
use std::time::Duration;

/// 일꾼 넷이 stop이 켜질 때까지 일한다. 각자 처리한 개수를 join으로 돌려준다.
fn run_until_stopped() -> (u64, u64) {
    let stop = AtomicBool::new(false);
    let progress = AtomicU64::new(0);
    let per_worker: Vec<u64> = thread::scope(|s| {
        let hs: Vec<_> = (0..4)
            .map(|_| {
                s.spawn(|| {
                    let mut done = 0u64;
                    while !stop.load(Ordering::Relaxed) {
                        done += 1;
                        progress.fetch_add(1, Ordering::Relaxed);
                        if done.is_multiple_of(1024) {
                            thread::yield_now();
                        }
                    }
                    done
                })
            })
            .collect();
        // 진행률이 1,000을 넘을 때까지 기다린 뒤 멈춘다
        while progress.load(Ordering::Relaxed) < 1_000 {
            thread::sleep(Duration::from_millis(1));
        }
        stop.store(true, Ordering::Relaxed);
        hs.into_iter().map(|h| h.join().unwrap()).collect()
    });
    // scope가 끝났으므로(join) 일꾼들의 모든 쓰기가 보인다
    (per_worker.iter().sum(), progress.load(Ordering::Relaxed))
}

/// 깃발로 결과를 넘기는 판: 결과는 보통 변수가 아니라 원자 변수 둘이지만,
/// 두 변수의 순서를 지켜야 하므로 Release/Acquire가 필요하다.
fn handoff() -> usize {
    let result = AtomicUsize::new(0);
    let ready = AtomicBool::new(false);
    thread::scope(|s| {
        s.spawn(|| {
            result.store(42, Ordering::Relaxed);
            ready.store(true, Ordering::Release);
        });
        while !ready.load(Ordering::Acquire) {
            std::hint::spin_loop();
        }
        result.load(Ordering::Relaxed)
    })
}

fn main() {
    let (sum, progress) = run_until_stopped();
    assert_eq!(sum, progress);
    assert!(progress >= 1_000);
    println!("stop flag (Relaxed): workers stopped, sum of per-worker counts == progress counter");

    for _ in 0..1_000 {
        assert_eq!(handoff(), 42);
    }
    println!("Release/Acquire handoff: 1000/1000 saw 42");
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn handoff_once() {
        assert_eq!(handoff(), 42);
    }
}
```
{% endraw %}
