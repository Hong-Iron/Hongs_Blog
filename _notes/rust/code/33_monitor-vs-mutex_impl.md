---
layout: "note"
title: "33_monitor-vs-mutex_impl.rs"
display_title: "33_monitor-vs-mutex_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "33"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/monitor-vs-mutex/"
parent_title: "모니터 ↔ Mutex"
description: "Rust · 모니터 ↔ Mutex 구현 코드"
sitemap: false
permalink: "/studies/rust/code/33_monitor-vs-mutex_impl/"
---
{% raw %}
[모니터 ↔ Mutex](/Hongs_Blog/studies/rust/monitor-vs-mutex/) 문서의 구현 코드다.

```rust
//! 모니터의 생산자-소비자(유한 버퍼)를 Mutex + Condvar 두 개로 옮긴다.
//! 확인하는 것: 버퍼가 용량을 넘지 않는 것, 넣은 값이 빠짐없이 한 번씩 나오는 것,
//! 기다리는 스레드가 없을 때의 notify는 남지 않는 것(csignal과 같다).
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/33_monitor-vs-mutex_impl.rs"

use std::collections::VecDeque;
use std::sync::{Arc, Condvar, Mutex};
use std::thread;
use std::time::Duration;

/// 모니터 boundedbuffer: 공유 데이터(VecDeque)는 Mutex 안에만 있다.
/// 바깥에서는 append와 take로만 만질 수 있다.
pub struct BoundedBuffer<T> {
    inner: Mutex<State<T>>,
    not_full: Condvar,  // cond notfull
    not_empty: Condvar, // cond notempty
    cap: usize,
}

struct State<T> {
    buf: VecDeque<T>,
    max_seen: usize, // 검증용: 버퍼에 동시에 있었던 최대 개수
}

impl<T> BoundedBuffer<T> {
    pub fn new(cap: usize) -> Self {
        assert!(cap > 0);
        BoundedBuffer {
            inner: Mutex::new(State {
                buf: VecDeque::with_capacity(cap),
                max_seen: 0,
            }),
            not_full: Condvar::new(),
            not_empty: Condvar::new(),
            cap,
        }
    }

    /// 가득 차 있으면 빈 칸이 생길 때까지 기다린 뒤 넣는다.
    pub fn append(&self, x: T) {
        let guard = self.inner.lock().unwrap();
        // 메사 방식: 깨어나면 조건을 다시 본다(while). wait_while이 그 반복이다.
        let mut st = self
            .not_full
            .wait_while(guard, |st| st.buf.len() == self.cap)
            .unwrap();
        st.buf.push_back(x);
        st.max_seen = st.max_seen.max(st.buf.len());
        drop(st); // 잠금을 먼저 풀고 깨운다(풀지 않고 깨워도 맞다)
        self.not_empty.notify_one();
    }

    /// 비어 있으면 물건이 생길 때까지 기다린 뒤 꺼낸다.
    pub fn take(&self) -> T {
        let mut st = self.inner.lock().unwrap();
        while st.buf.is_empty() {
            st = self.not_empty.wait(st).unwrap(); // 직접 쓴 while 반복
        }
        let x = st.buf.pop_front().expect("not empty");
        drop(st);
        self.not_full.notify_one();
        x
    }

    pub fn max_seen(&self) -> usize {
        self.inner.lock().unwrap().max_seen
    }
}

/// 전이 문제의 답: 자리 N개짜리 주차장(계수 세마포어)을 Mutex<usize> + Condvar 하나로 만든다.
pub struct Parking {
    free: Mutex<usize>,
    has_space: Condvar,
}

impl Parking {
    pub fn new(n: usize) -> Self {
        Parking {
            free: Mutex::new(n),
            has_space: Condvar::new(),
        }
    }

    pub fn enter(&self) {
        let mut f = self
            .has_space
            .wait_while(self.free.lock().unwrap(), |f| *f == 0)
            .unwrap();
        *f -= 1;
    }

    pub fn leave(&self) {
        *self.free.lock().unwrap() += 1;
        self.has_space.notify_one();
    }
}

/// 차 cars대가 각자 rounds번 들어왔다 나간다. 동시에 안에 있던 차의 최대 수를 돌려준다.
fn parking_max_inside(n: usize, cars: usize, rounds: usize) -> usize {
    use std::sync::atomic::{AtomicUsize, Ordering};
    let lot = Parking::new(n);
    let inside = AtomicUsize::new(0);
    let max_inside = AtomicUsize::new(0);
    thread::scope(|s| {
        for _ in 0..cars {
            s.spawn(|| {
                for _ in 0..rounds {
                    lot.enter();
                    let now = inside.fetch_add(1, Ordering::SeqCst) + 1;
                    max_inside.fetch_max(now, Ordering::SeqCst);
                    thread::yield_now();
                    inside.fetch_sub(1, Ordering::SeqCst);
                    lot.leave();
                }
            });
        }
    });
    max_inside.load(Ordering::SeqCst)
}

/// 생산자 p명이 각자 n개를 넣고, 소비자 c명이 모두 꺼낸다. 꺼낸 값들을 돌려준다.
fn run(cap: usize, producers: usize, consumers: usize, n: usize) -> (Vec<usize>, usize) {
    let bb = Arc::new(BoundedBuffer::new(cap));
    let total = producers * n;
    assert_eq!(total % consumers, 0);
    let per_consumer = total / consumers;
    let ps: Vec<_> = (0..producers)
        .map(|p| {
            let bb = Arc::clone(&bb);
            thread::spawn(move || {
                for i in 0..n {
                    bb.append(p * n + i);
                }
            })
        })
        .collect();
    let cs: Vec<_> = (0..consumers)
        .map(|_| {
            let bb = Arc::clone(&bb);
            thread::spawn(move || (0..per_consumer).map(|_| bb.take()).collect::<Vec<_>>())
        })
        .collect();
    for p in ps {
        p.join().unwrap();
    }
    let mut got: Vec<usize> = cs.into_iter().flat_map(|c| c.join().unwrap()).collect();
    got.sort_unstable();
    (got, bb.max_seen())
}

fn main() {
    // 1. 용량 4, 생산자 3, 소비자 2, 각 10,000개
    let (got, max_seen) = run(4, 3, 2, 10_000);
    assert_eq!(got, (0..30_000).collect::<Vec<_>>());
    assert!(max_seen <= 4);
    println!(
        "bounded buffer: {} items, each once, max in buffer {max_seen} <= 4",
        got.len()
    );

    // 2. 용량 1이면 넣기와 꺼내기가 번갈아 일어나야 한다.
    let (got, max_seen) = run(1, 2, 2, 5_000);
    assert_eq!(got.len(), 10_000);
    assert_eq!(max_seen, 1);
    println!("capacity 1: max in buffer {max_seen}");

    // 3. 기다리는 스레드가 없을 때 notify_one은 아무 흔적도 남기지 않는다.
    let pair = (Mutex::new(()), Condvar::new());
    pair.1.notify_one(); // 아무도 기다리지 않는다
    let g = pair.0.lock().unwrap();
    let (_g, res) = pair.1.wait_timeout(g, Duration::from_millis(50)).unwrap();
    assert!(res.timed_out());
    println!("notify with no waiter is lost: later wait timed out");

    // 4. 전이 문제: leave가 먼저 불려도 자리 수(데이터)가 기억하므로 enter는 기다리지 않는다.
    let lot = Parking::new(0);
    lot.leave();
    lot.enter();
    let max_inside = parking_max_inside(3, 8, 2_000);
    assert!((1..=3).contains(&max_inside));
    println!("parking lot N=3: leave-then-enter does not block; max inside {max_inside} <= 3");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fifo_single_thread() {
        let bb = BoundedBuffer::new(3);
        bb.append('a');
        bb.append('b');
        assert_eq!(bb.take(), 'a');
        bb.append('c');
        assert_eq!(bb.take(), 'b');
        assert_eq!(bb.take(), 'c');
    }

    #[test]
    fn many_shapes() {
        for (cap, p, c, n) in [(1, 1, 1, 100), (2, 4, 1, 50), (8, 1, 4, 400), (3, 3, 3, 99)] {
            let (got, max_seen) = run(cap, p, c, n);
            assert_eq!(got, (0..p * n).collect::<Vec<_>>());
            assert!(max_seen <= cap);
        }
    }
}
```
{% endraw %}
