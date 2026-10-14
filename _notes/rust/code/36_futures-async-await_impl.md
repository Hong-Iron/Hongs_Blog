---
layout: "note"
title: "36_futures-async-await_impl.rs"
display_title: "36_futures-async-await_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "36"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/futures-async-await/"
parent_title: "Future와 async·await"
description: "Rust · Future와 async·await 구현 코드"
permalink: "/studies/rust/code/36_futures-async-await_impl/"
---
{% raw %}
[Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/) 문서의 구현 코드다.

```rust
//! 손으로 만든 Future 두 개와 최소 실행기(block_on)로 poll·Waker·게으름·상태 기계 크기를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/36_futures-async-await_impl.rs"

use std::future::Future;
use std::pin::{Pin, pin};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};
use std::task::{Context, Poll, Wake, Waker};
use std::thread;
use std::time::{Duration, Instant};

// ---------- 1. 최소 실행기: std::task::Wake 문서의 block_on과 같은 모양 ----------

/// 깨우면 잠든 스레드를 다시 깨운다(unpark). 몇 번 깨웠는지도 센다.
struct ThreadWaker {
    thread: thread::Thread,
    wakes: AtomicUsize,
}

impl Wake for ThreadWaker {
    fn wake(self: Arc<Self>) {
        self.wake_by_ref();
    }
    fn wake_by_ref(self: &Arc<Self>) {
        self.wakes.fetch_add(1, Ordering::SeqCst);
        self.thread.unpark();
    }
}

/// 퓨처 하나를 끝날 때까지 돌린다. 돌려준 값, poll 횟수, wake 횟수를 같이 준다.
fn block_on<F: Future>(fut: F) -> (F::Output, usize, usize) {
    let mut fut = pin!(fut); // 스택에 고정한다. 이제 fut은 옮겨지지 않는다.
    let tw = Arc::new(ThreadWaker {
        thread: thread::current(),
        wakes: AtomicUsize::new(0),
    });
    let waker = Waker::from(tw.clone());
    let mut cx = Context::from_waker(&waker);
    let mut polls = 0;
    loop {
        polls += 1;
        match fut.as_mut().poll(&mut cx) {
            Poll::Ready(v) => return (v, polls, tw.wakes.load(Ordering::SeqCst)),
            // Pending이면 잔다. wake가 unpark하면 깨어나 다시 poll한다.
            // (park는 이유 없이 깨어날 수도 있다. 그래도 다시 poll하면 되므로 맞다.)
            Poll::Pending => thread::park(),
        }
    }
}

// ---------- 2. 손으로 만든 Future 1: n번 Pending을 내고 끝난다 ----------

struct Countdown {
    left: u32,
}

impl Future for Countdown {
    type Output = &'static str;
    fn poll(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        if self.left == 0 {
            Poll::Ready("발사")
        } else {
            self.left -= 1;
            // Pending을 내기 전에 "다시 불러 달라"고 알린다. 이것을 빼면 실행기가 영원히 잔다.
            cx.waker().wake_by_ref();
            Poll::Pending
        }
    }
}

// ---------- 3. 손으로 만든 Future 2: 다른 스레드가 시간이 지나면 깨운다 ----------

struct Shared {
    done: bool,
    waker: Option<Waker>,
}

struct Delay {
    shared: Arc<Mutex<Shared>>,
}

impl Delay {
    fn new(dur: Duration) -> Self {
        let shared = Arc::new(Mutex::new(Shared {
            done: false,
            waker: None,
        }));
        let s2 = shared.clone();
        thread::spawn(move || {
            thread::sleep(dur);
            let mut g = s2.lock().unwrap();
            g.done = true;
            if let Some(w) = g.waker.take() {
                w.wake(); // 저장해 둔 Waker로 실행기를 깨운다
            }
        });
        Delay { shared }
    }
}

impl Future for Delay {
    type Output = ();
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<()> {
        let mut g = self.shared.lock().unwrap();
        if g.done {
            Poll::Ready(())
        } else {
            // 가장 최근 Context의 Waker를 저장한다(퓨처가 다른 태스크로 옮겨질 수 있으므로).
            g.waker = Some(cx.waker().clone());
            Poll::Pending
        }
    }
}

// ---------- 4. 게으름: async fn을 불러도 본문은 아직 돌지 않는다 ----------

static BODY_RUNS: AtomicUsize = AtomicUsize::new(0);

async fn side_effect() -> u32 {
    BODY_RUNS.fetch_add(1, Ordering::SeqCst);
    42
}

// ---------- 5. 상태 기계의 크기: .await를 건너 살아 있는 지역 변수만 퓨처 안에 들어간다 ----------

async fn yield_once() {
    let mut first = true;
    std::future::poll_fn(move |cx| {
        if first {
            first = false;
            cx.waker().wake_by_ref();
            Poll::Pending
        } else {
            Poll::Ready(())
        }
    })
    .await;
}

async fn holds_buffer_across_await() -> u8 {
    let buf = [7u8; 1024];
    yield_once().await; // buf가 이 .await 뒤에도 쓰이므로 퓨처 안에 저장된다
    buf[1023]
}

async fn drops_buffer_before_await() -> u8 {
    let last = {
        let buf = [7u8; 1024];
        buf[1023]
    }; // buf는 여기서 끝난다
    yield_once().await;
    last
}

// ---------- 6. 순서: async 블록 두 개를 차례로 await하면 차례로 돈다 ----------

async fn step(log: Arc<Mutex<Vec<String>>>, name: &'static str) {
    log.lock().unwrap().push(format!("{name} 시작"));
    yield_once().await;
    log.lock().unwrap().push(format!("{name} 끝"));
}

fn main() {
    // (1) Countdown: 3번 Pending → 4번째 poll에서 Ready
    let (v, polls, wakes) = block_on(Countdown { left: 3 });
    println!("Countdown: 값={v}, poll {polls}번, wake {wakes}번");
    assert_eq!((v, polls, wakes), ("발사", 4, 3));

    // (2) Delay: poll은 2번이면 된다. 기다리는 동안 CPU를 쓰지 않는다(바쁜 대기 없음).
    let t = Instant::now();
    let ((), polls, wakes) = block_on(Delay::new(Duration::from_millis(50)));
    let ms = t.elapsed().as_millis();
    println!("Delay(50ms): poll {polls}번, wake {wakes}번, {ms}ms 걸림");
    assert_eq!(polls, 2);
    assert_eq!(wakes, 1);
    assert!(ms >= 50);

    // (3) 게으름
    let fut = side_effect();
    println!(
        "퓨처를 만든 직후 본문 실행 횟수: {}",
        BODY_RUNS.load(Ordering::SeqCst)
    );
    assert_eq!(BODY_RUNS.load(Ordering::SeqCst), 0);
    let (v, _, _) = block_on(fut);
    println!(
        "block_on 뒤 본문 실행 횟수: {}, 값 {v}",
        BODY_RUNS.load(Ordering::SeqCst)
    );
    assert_eq!(BODY_RUNS.load(Ordering::SeqCst), 1);
    drop(side_effect()); // 만들고 버리면 본문은 끝내 돌지 않는다
    assert_eq!(BODY_RUNS.load(Ordering::SeqCst), 1);

    // (4) 상태 기계 크기
    let a = std::mem::size_of_val(&holds_buffer_across_await());
    let b = std::mem::size_of_val(&drops_buffer_before_await());
    println!("버퍼를 .await 너머로 들고 가는 퓨처: {a}바이트, 미리 버리는 퓨처: {b}바이트");
    assert!(a >= 1024);
    assert!(b < 64);
    assert_eq!(block_on(holds_buffer_across_await()).0, 7);
    assert_eq!(block_on(drops_buffer_before_await()).0, 7);

    // (5) 차례로 await: A가 끝나야 B가 시작한다(동시에 돌지 않는다)
    let log = Arc::new(Mutex::new(Vec::new()));
    let l2 = log.clone();
    block_on(async move {
        step(l2.clone(), "A").await;
        step(l2, "B").await;
    });
    let got = log.lock().unwrap().clone();
    println!("차례로 await한 순서: {got:?}");
    assert_eq!(got, ["A 시작", "A 끝", "B 시작", "B 끝"]);

    // (6) Waker::noop: 테스트용. 깨울 필요가 없는 퓨처를 한 번만 poll해 본다.
    let mut cx = Context::from_waker(Waker::noop());
    let mut f = pin!(async { 10 });
    assert_eq!(f.as_mut().poll(&mut cx), Poll::Ready(10));

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn countdown_zero_is_ready_at_once() {
        let (v, polls, wakes) = block_on(Countdown { left: 0 });
        assert_eq!((v, polls, wakes), ("발사", 1, 0));
    }

    #[test]
    fn nested_futures_compose() {
        let (v, _, _) = block_on(async {
            Countdown { left: 2 }.await;
            Delay::new(Duration::from_millis(5)).await;
            side_effect().await + 1
        });
        assert_eq!(v, 43);
    }
}
```
{% endraw %}
