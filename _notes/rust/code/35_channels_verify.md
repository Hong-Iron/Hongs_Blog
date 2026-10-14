---
layout: "note"
title: "35_channels_verify.rs"
display_title: "35_channels_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "35"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/channels/"
parent_title: "채널"
description: "Rust · 채널 검증 코드"
sitemap: false
permalink: "/studies/rust/code/35_channels_verify/"
---
{% raw %}
[채널](/Hongs_Blog/studies/rust/channels/) 문서의 검증 코드다.

```rust
//! 채널 문서의 주장을 확인한다: 보낸 값의 소유권이 넘어가는 것(E0382), 송신자를 복제한 fan-in,
//! 송신자가 모두 사라져야 수신이 끝나는 것, 수신자가 사라지면 send가 값을 돌려주는 것,
//! sync_channel의 용량 제한과 용량 0(랑데부), Mutex로 감싼 수신자로 하는 fan-out,
//! fan-out에서 `while let`이 잠금을 쥔 채 일해 일꾼들이 한 줄로 서는 것, std::sync::mpmc가 아직 불안정인 것.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/35_channels_verify.rs"

use std::sync::mpsc::{self, RecvTimeoutError, TryRecvError, TrySendError};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};

fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr35_{}_{}", std::process::id(), code.len()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new("rustc")
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "--emit=metadata",
            "--out-dir",
        ])
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

/// 생산자 p명이 각자 (번호, 순번)을 n개 보낸다. 한 생산자의 메시지는 보낸 순서대로 온다.
fn fan_in(p: usize, n: usize) -> Vec<(usize, usize)> {
    let (tx, rx) = mpsc::channel();
    for id in 0..p {
        let tx = tx.clone();
        thread::spawn(move || {
            for i in 0..n {
                tx.send((id, i)).unwrap();
            }
        });
    }
    drop(tx); // 원본 송신자도 버려야 rx 반복이 끝난다
    rx.into_iter().collect()
}

/// 일꾼 w명이 하나의 작업 큐를 나눠 받는다(fan-out). 결과는 다른 채널로 모은다(fan-in).
fn worker_pool(jobs: Vec<u64>, w: usize) -> (u64, Vec<usize>) {
    let (job_tx, job_rx) = mpsc::channel::<u64>();
    let job_rx = Arc::new(Mutex::new(job_rx)); // Receiver는 하나뿐이라 Mutex로 나눠 쓴다
    let (res_tx, res_rx) = mpsc::channel::<(usize, u64)>();
    let mut hs = Vec::new();
    for id in 0..w {
        let job_rx = Arc::clone(&job_rx);
        let res_tx = res_tx.clone();
        hs.push(thread::spawn(move || {
            loop {
                // 잠금은 recv 한 번 동안만 쥔다. 가드는 이 문장이 끝나면 풀린다.
                let job = job_rx.lock().unwrap().recv();
                match job {
                    Ok(x) => res_tx.send((id, x * x)).unwrap(),
                    Err(_) => break, // 작업 송신자가 사라졌다
                }
            }
        }));
    }
    drop(res_tx);
    for j in jobs {
        job_tx.send(j).unwrap();
    }
    drop(job_tx);
    let mut per_worker = vec![0; w];
    let mut sum = 0;
    for (id, sq) in res_rx {
        per_worker[id] += 1;
        sum += sq;
    }
    for h in hs {
        h.join().unwrap();
    }
    (sum, per_worker)
}

/// 일꾼 4명이 20ms짜리 일 8개를 나눠 한다. 걸린 시간(ms)을 돌려준다.
/// hold_lock = true면 `while let`으로 받아, 일하는 동안에도 수신자 잠금을 쥔다.
fn pool_time(hold_lock: bool) -> u128 {
    let (tx, rx) = mpsc::channel::<u32>();
    let rx = Arc::new(Mutex::new(rx));
    let t = Instant::now();
    let hs: Vec<_> = (0..4)
        .map(|_| {
            let rx = Arc::clone(&rx);
            thread::spawn(move || {
                if hold_lock {
                    // 가드가 while let 블록 끝까지 산다: 일하는 동안 다른 일꾼이 recv하지 못한다
                    while let Ok(_job) = rx.lock().unwrap().recv() {
                        thread::sleep(Duration::from_millis(20));
                    }
                } else {
                    loop {
                        let job = rx.lock().unwrap().recv(); // 가드는 이 문장 끝에서 풀린다
                        let Ok(_job) = job else { break };
                        thread::sleep(Duration::from_millis(20));
                    }
                }
            })
        })
        .collect();
    for i in 0..8 {
        tx.send(i).unwrap();
    }
    drop(tx);
    for h in hs {
        h.join().unwrap();
    }
    t.elapsed().as_millis()
}

fn main() {
    // 1. fan-in: 3 생산자 × 1,000개
    let got = fan_in(3, 1_000);
    assert_eq!(got.len(), 3_000);
    for id in 0..3 {
        let seq: Vec<usize> = got.iter().filter(|m| m.0 == id).map(|m| m.1).collect();
        assert_eq!(seq, (0..1_000).collect::<Vec<_>>());
    }
    println!("fan-in: 3000 messages, per-producer order kept");

    // 2. 송신자가 하나라도 남아 있으면 수신은 끝나지 않는다.
    let (tx, rx) = mpsc::channel::<i32>();
    let tx2 = tx.clone();
    drop(tx);
    let first = rx.recv_timeout(Duration::from_millis(50));
    assert_eq!(first, Err(RecvTimeoutError::Timeout));
    assert_eq!(format!("{first:?}"), "Err(Timeout)");
    drop(tx2);
    let after = format!("{:?}", rx.recv());
    assert_eq!(after, "Err(RecvError)");
    println!("recv: Timeout while a clone lives, {after} after all senders dropped");

    // 3. 이미 들어간 값은 송신자가 모두 사라진 뒤에도 받을 수 있다.
    let (tx, rx) = mpsc::channel();
    tx.send("a").unwrap();
    tx.send("b").unwrap();
    drop(tx);
    assert_eq!(rx.recv(), Ok("a"));
    assert_eq!(rx.try_recv(), Ok("b"));
    assert_eq!(rx.try_recv(), Err(TryRecvError::Disconnected));
    println!("buffered messages drain after disconnect, then Disconnected");

    // 4. 수신자가 사라지면 send는 Err(SendError(값))로 값을 돌려준다.
    let (tx, rx) = mpsc::channel::<String>();
    drop(rx);
    let back = tx.send(String::from("lost?")).unwrap_err().0;
    assert_eq!(back, "lost?");
    println!("send after receiver dropped: Err returns the value {back:?}");

    // 5. sync_channel(2): 두 개까지는 바로 들어가고 세 번째 try_send는 Full이다.
    let (stx, srx) = mpsc::sync_channel::<i32>(2);
    stx.try_send(1).unwrap();
    stx.try_send(2).unwrap();
    assert_eq!(stx.try_send(3), Err(TrySendError::Full(3)));
    assert_eq!(srx.recv(), Ok(1));
    stx.try_send(3).unwrap();
    drop(srx);
    assert_eq!(stx.try_send(4), Err(TrySendError::Disconnected(4)));
    println!(
        "sync_channel(2): third try_send -> Full(3), after one recv -> ok, after receiver dropped -> Disconnected(4)"
    );

    // 6. sync_channel(0): 받는 쪽이 없으면 try_send도 Full이다(랑데부).
    let (ztx, zrx) = mpsc::sync_channel::<i32>(0);
    assert_eq!(ztx.try_send(7), Err(TrySendError::Full(7)));
    let h = thread::spawn(move || ztx.send(7)); // 받는 쪽이 올 때까지 막힌다
    assert_eq!(zrx.recv(), Ok(7));
    h.join().unwrap().unwrap();
    println!("sync_channel(0): try_send with no receiver waiting -> Full");

    // 7. fan-out + fan-in 일꾼 풀
    let jobs: Vec<u64> = (1..=100).collect();
    let (sum, per_worker) = worker_pool(jobs, 4);
    assert_eq!(sum, (1..=100u64).map(|x| x * x).sum::<u64>());
    assert_eq!(per_worker.iter().sum::<usize>(), 100);
    println!("worker pool: sum of squares {sum}, jobs per worker {per_worker:?}");

    // 8. 컴파일 오류: 보낸 값은 더 쓸 수 없고, Receiver는 여러 스레드가 함께 빌릴 수 없다.
    let moved = compile_errors(
        "pub fn f() { let (tx, _rx) = std::sync::mpsc::channel(); let s = String::from(\"hi\"); tx.send(s).unwrap(); println!(\"{s}\"); }\n",
    );
    assert!(moved.contains("error[E0382]"));
    assert!(moved.contains("borrow of moved value: `s`"));
    let share_rx = compile_errors(
        "pub fn f() { let (_tx, rx) = std::sync::mpsc::channel::<i32>(); std::thread::scope(|s| { s.spawn(|| rx.try_recv()); s.spawn(|| rx.try_recv()); }); }\n",
    );
    assert!(share_rx.contains("error[E0277]"));
    assert!(share_rx.contains("cannot be shared between threads safely"));
    println!("send moves value: E0382; &Receiver across threads: E0277 (Receiver is !Sync)");

    // 9. fan-out에서 잠금을 쥐는 범위: let은 나눠 일하고, while let은 한 줄로 선다
    let with_let = pool_time(false);
    let with_while_let = pool_time(true);
    println!("4 workers x 8 jobs of 20ms: let {with_let}ms, while let {with_while_let}ms");
    assert!(with_let < 120); // 이론값 2묶음 x 20ms = 40ms
    assert!(with_while_let >= 160); // 8개 x 20ms를 한 명씩

    // 10. 여러 소비자 채널 std::sync::mpmc는 rustc 1.99에서 아직 불안정 기능이다
    let mpmc = compile_errors(
        "pub fn f() { let (tx, rx) = std::sync::mpmc::channel::<i32>(); tx.send(1).unwrap(); let _ = rx.recv(); }\n",
    );
    assert!(mpmc.contains("error[E0658]"));
    assert!(mpmc.contains("mpmc_channel"));
    println!("std::sync::mpmc: E0658 unstable feature `mpmc_channel`");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fan_in_counts() {
        assert_eq!(fan_in(1, 0).len(), 0);
        assert_eq!(fan_in(5, 20).len(), 100);
    }

    #[test]
    fn pool_one_worker() {
        let (sum, per) = worker_pool(vec![2, 3], 1);
        assert_eq!(sum, 13);
        assert_eq!(per, vec![2]);
    }
}
```
{% endraw %}
