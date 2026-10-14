---
layout: "note"
title: "31_threads-send-sync_verify.rs"
display_title: "31_threads-send-sync_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/threads-send-sync/"
parent_title: "스레드와 Send·Sync"
description: "Rust · 스레드와 Send·Sync 검증 코드"
permalink: "/studies/rust/code/31_threads-send-sync_verify/"
---
{% raw %}
[스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/) 문서의 검증 코드다.

```rust
//! 스레드와 Send·Sync 문서의 주장을 확인한다: spawn·join, panic이 join의 Err로 오는 것,
//! scope가 빌림을 허락하는 것, Rc·Cell·move 없는 클로저가 막히는 오류 코드, 데이터 경쟁이 없어도 생기는 경쟁 조건.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/31_threads-send-sync_verify.rs"

use std::cell::{Cell, RefCell};
use std::rc::Rc;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Barrier, Mutex, MutexGuard};
use std::thread;

fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr31_{}_{}", std::process::id(), code.len()));
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

fn assert_send<T: Send>() {}
fn assert_sync<T: Sync>() {}

/// 일을 네 조각으로 나눠 스레드 넷이 더한다. 각 스레드는 자기 조각만 빌린다.
fn parallel_sum(data: &[u64]) -> u64 {
    let chunk = data.len().div_ceil(4).max(1);
    thread::scope(|s| {
        let handles: Vec<_> = data
            .chunks(chunk)
            .map(|part| s.spawn(move || part.iter().sum::<u64>()))
            .collect();
        handles.into_iter().map(|h| h.join().unwrap()).sum()
    })
}

/// 읽기와 쓰기를 따로 잠그면 데이터 경쟁은 없지만 갱신 하나가 사라진다.
/// Barrier로 두 스레드가 모두 읽은 뒤에 쓰게 해서 매번 같은 순서를 만든다.
fn lost_update_without_data_race() -> i32 {
    let value = Arc::new(Mutex::new(0));
    let barrier = Arc::new(Barrier::new(2));
    let handles: Vec<_> = (0..2)
        .map(|_| {
            let value = Arc::clone(&value);
            let barrier = Arc::clone(&barrier);
            thread::spawn(move || {
                let seen = *value.lock().unwrap(); // 잠그고 읽고 바로 푼다
                barrier.wait(); // 두 스레드가 모두 읽을 때까지 기다린다
                *value.lock().unwrap() = seen + 1; // 다시 잠그고 쓴다
            })
        })
        .collect();
    for h in handles {
        h.join().unwrap();
    }
    *value.lock().unwrap()
}

/// 읽기와 쓰기를 한 번의 잠금 안에서 하면 갱신이 사라지지 않는다.
fn update_in_one_lock() -> i32 {
    let value = Arc::new(Mutex::new(0));
    let handles: Vec<_> = (0..2)
        .map(|_| {
            let value = Arc::clone(&value);
            thread::spawn(move || {
                let mut g = value.lock().unwrap();
                *g += 1;
            })
        })
        .collect();
    for h in handles {
        h.join().unwrap();
    }
    *value.lock().unwrap()
}

fn main() {
    // 1. spawn은 JoinHandle을 돌려주고, join은 스레드가 돌려준 값을 준다.
    let v = String::from("abc");
    let h = thread::spawn(move || v.len());
    let got = h.join().unwrap();
    assert_eq!(got, 3);
    println!("spawn + join: {got}");

    // 2. 스레드 안의 panic은 join의 Err로 온다. 부른 쪽은 멈추지 않는다.
    std::panic::set_hook(Box::new(|_| {})); // 표준 에러에 panic 메시지가 찍히지 않게 한다
    let h = thread::spawn(|| -> i32 { panic!("boom") });
    let err = h.join().unwrap_err();
    let msg = err.downcast_ref::<&str>().copied();
    assert_eq!(msg, Some("boom"));
    let _ = std::panic::take_hook();
    println!("panic in thread -> join Err({msg:?})");

    // 3. scope 안의 스레드는 바깥 지역 변수를 빌릴 수 있다.
    let data: Vec<u64> = (1..=1000).collect();
    assert_eq!(parallel_sum(&data), 500_500);
    let mut a = vec![1, 2, 3];
    let mut x = 0;
    thread::scope(|s| {
        s.spawn(|| assert_eq!(a.len(), 3));
        s.spawn(|| x += a[0] + a[2]);
    });
    a.push(4); // scope가 끝났으므로 다시 고칠 수 있다
    assert_eq!(x, a.len());
    println!("scope: sum 1..=1000 = 500500, x = {x}");

    // 4. Send·Sync 표: 컴파일되면 true다. 안 되는 것은 아래 rustc 검사로 본다.
    assert_send::<Vec<i32>>();
    assert_sync::<Vec<i32>>();
    assert_send::<Arc<i32>>();
    assert_sync::<Arc<i32>>();
    assert_send::<Mutex<Cell<i32>>>();
    assert_sync::<Mutex<Cell<i32>>>();
    assert_send::<Cell<i32>>();
    assert_send::<RefCell<i32>>();
    assert_sync::<AtomicUsize>();
    assert_sync::<MutexGuard<'static, i32>>();
    let _ = (Rc::new(0), AtomicUsize::new(0).load(Ordering::Relaxed));

    // 5. 컴파일 오류 코드
    let rc_spawn = compile_errors(
        "use std::rc::Rc;\npub fn f() { let r = Rc::new(5); std::thread::spawn(move || { println!(\"{r}\"); }); }\n",
    );
    assert!(rc_spawn.contains("error[E0277]"));
    assert!(rc_spawn.contains("cannot be sent between threads safely"));
    println!("Rc into spawn: E0277 `Rc<i32>` cannot be sent between threads safely");

    let no_move = compile_errors(
        "pub fn f() { let v = vec![1]; let h = std::thread::spawn(|| { let _ = v.len(); }); h.join().unwrap(); }\n",
    );
    assert!(no_move.contains("error[E0373]"));
    assert!(no_move.contains("may outlive borrowed value"));
    println!("borrow without move: E0373 closure may outlive the current function");

    let cell_share = compile_errors(
        "use std::cell::Cell;\npub fn f() { let c = Cell::new(0); std::thread::scope(|s| { s.spawn(|| c.set(1)); }); }\n",
    );
    assert!(cell_share.contains("error[E0277]"));
    assert!(cell_share.contains("cannot be shared between threads safely"));
    println!("&Cell into scoped thread: E0277 `Cell<i32>` cannot be shared between threads safely");

    let guard_send = compile_errors(
        "use std::sync::{Mutex, MutexGuard};\nfn need_send<T: Send>(_: T) {}\npub fn f(m: &'static Mutex<i32>) { let g: MutexGuard<'static, i32> = m.lock().unwrap(); need_send(g); }\n",
    );
    assert!(guard_send.contains("error[E0277]"));
    println!("MutexGuard is !Send: E0277");

    let rc_scope = compile_errors(
        "use std::rc::Rc;\npub fn f() { let r = Rc::new(1); std::thread::scope(|s| { s.spawn(|| { let _ = r.clone(); }); }); }\n",
    );
    assert!(rc_scope.contains("error[E0277]"));
    println!("&Rc into scoped thread: E0277 (scope does not lift Send/Sync)");

    // 6. 데이터 경쟁은 없지만 경쟁 조건은 생긴다.
    let lost = lost_update_without_data_race();
    assert_eq!(lost, 1);
    let ok = update_in_one_lock();
    assert_eq!(ok, 2);
    println!("check-then-act with two locks: {lost} (expected 2), one lock: {ok}");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sum_matches_sequential() {
        for n in [0usize, 1, 3, 4, 5, 17, 1000] {
            let data: Vec<u64> = (0..n as u64).collect();
            assert_eq!(parallel_sum(&data), data.iter().sum::<u64>());
        }
    }

    #[test]
    fn lost_update_is_deterministic() {
        for _ in 0..20 {
            assert_eq!(lost_update_without_data_race(), 1);
        }
    }
}
```
{% endraw %}
