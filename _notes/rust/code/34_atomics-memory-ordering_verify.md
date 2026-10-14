---
layout: "note"
title: "34_atomics-memory-ordering_verify.rs"
display_title: "34_atomics-memory-ordering_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/atomics-memory-ordering/"
parent_title: "원자적 연산과 메모리 순서"
description: "Rust · 원자적 연산과 메모리 순서 검증 코드"
permalink: "/studies/rust/code/34_atomics-memory-ordering_verify/"
---
{% raw %}
[원자적 연산과 메모리 순서](/Hongs_Blog/studies/rust/atomics-memory-ordering/) 문서의 검증 코드다.

```rust
//! 원자적 연산과 메모리 순서 문서의 주장을 확인한다: Relaxed 카운터가 정확한 것,
//! 따로 한 load·store는 갱신을 잃는 것, fetch_add가 옛 값을 돌려주고 넘치면 감기는 것,
//! compare_exchange, Release/Acquire 깃발로 데이터 넘기기, Acquire/Release 스핀락,
//! 잘못된 Ordering을 컴파일러가 막는 것.
//! 주의: 이 실행이 통과해도 순서가 옳다는 증명은 아니다. 한 기계(이 Mac은 aarch64)에서 본 결과일 뿐이다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/34_atomics-memory-ordering_verify.rs"

use std::cell::UnsafeCell;
use std::sync::atomic::{AtomicBool, AtomicU8, AtomicU64, AtomicUsize, Ordering};
use std::sync::{Arc, Barrier};
use std::thread;

fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr34_{}_{}", std::process::id(), code.len()));
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

/// 스레드 n개가 k번씩 fetch_add(1, Relaxed). 한 변수의 고침 순서는 모두가 같게 보므로 합은 정확하다.
fn relaxed_counter(n: usize, k: usize) -> usize {
    let c = AtomicUsize::new(0);
    thread::scope(|s| {
        for _ in 0..n {
            s.spawn(|| {
                for _ in 0..k {
                    c.fetch_add(1, Ordering::Relaxed);
                }
            });
        }
    });
    c.load(Ordering::Relaxed)
}

/// load와 store를 따로 하면 각 연산은 원자적이어도 "읽고-더하고-쓰기" 전체는 아니다.
/// Barrier로 두 스레드가 모두 읽은 뒤에 쓰게 해서 한쪽 갱신이 사라지는 순서를 매번 만든다.
fn split_load_store() -> usize {
    let c = AtomicUsize::new(0);
    let barrier = Barrier::new(2);
    thread::scope(|s| {
        for _ in 0..2 {
            s.spawn(|| {
                let seen = c.load(Ordering::Relaxed);
                barrier.wait();
                c.store(seen + 1, Ordering::Relaxed);
            });
        }
    });
    c.load(Ordering::Relaxed)
}

/// Release로 깃발을 세우기 전에 쓴 데이터는, Acquire로 그 깃발을 본 쪽에서 반드시 보인다.
fn publish_with_flag(rounds: usize) -> usize {
    let mut ok = 0;
    for r in 0..rounds {
        let data = AtomicU64::new(0);
        let ready = AtomicBool::new(false);
        let expected = 1_000 + r as u64;
        thread::scope(|s| {
            s.spawn(|| {
                data.store(expected, Ordering::Relaxed);
                ready.store(true, Ordering::Release); // 이 앞의 쓰기를 내보낸다
            });
            s.spawn(|| {
                while !ready.load(Ordering::Acquire) {
                    std::hint::spin_loop();
                }
                assert_eq!(data.load(Ordering::Relaxed), expected);
            });
        });
        ok += 1;
    }
    ok
}

/// 가장 작은 스핀락. Mara Bos, Rust Atomics and Locks 4장의 모양을 따른다.
pub struct SpinLock<T> {
    locked: AtomicBool,
    value: UnsafeCell<T>,
}

// SAFETY: value는 locked를 쥔 스레드 하나만 만진다. 그래서 T: Send이면 여러 스레드가 공유해도 된다.
unsafe impl<T: Send> Sync for SpinLock<T> {}

impl<T> SpinLock<T> {
    pub const fn new(value: T) -> Self {
        SpinLock {
            locked: AtomicBool::new(false),
            value: UnsafeCell::new(value),
        }
    }

    /// 잠그고 f를 부른 뒤 푼다. 가드 대신 클로저를 받아 짧게 만들었다.
    pub fn with<R>(&self, f: impl FnOnce(&mut T) -> R) -> R {
        while self.locked.swap(true, Ordering::Acquire) {
            std::hint::spin_loop();
        }
        // SAFETY: swap이 false를 돌려줬으므로 지금 잠금을 쥔 것은 이 스레드뿐이다.
        let r = f(unsafe { &mut *self.value.get() });
        self.locked.store(false, Ordering::Release);
        r
    }
}

fn spinlock_counter(n: usize, k: usize) -> u64 {
    let lock = Arc::new(SpinLock::new(0u64));
    let hs: Vec<_> = (0..n)
        .map(|_| {
            let lock = Arc::clone(&lock);
            thread::spawn(move || {
                for _ in 0..k {
                    lock.with(|v| *v += 1); // 보통 변수(u64)를 고친다
                }
            })
        })
        .collect();
    for h in hs {
        h.join().unwrap();
    }
    lock.with(|v| *v)
}

/// compare_exchange로 "처음 한 번만" 값을 정한다.
fn first_writer_wins(n: usize) -> (usize, usize) {
    let winner = AtomicUsize::new(usize::MAX);
    let wins = AtomicUsize::new(0);
    thread::scope(|s| {
        for id in 0..n {
            let (winner, wins) = (&winner, &wins);
            s.spawn(move || {
                if winner
                    .compare_exchange(usize::MAX, id, Ordering::AcqRel, Ordering::Acquire)
                    .is_ok()
                {
                    wins.fetch_add(1, Ordering::Relaxed);
                }
            });
        }
    });
    (winner.load(Ordering::Acquire), wins.load(Ordering::Relaxed))
}

fn main() {
    // 1. Relaxed 카운터: 4 × 100,000 = 400,000
    let c = relaxed_counter(4, 100_000);
    assert_eq!(c, 400_000);
    println!("Relaxed fetch_add counter: {c}");

    // 2. 따로 한 load + store는 갱신을 잃는다.
    let lost = split_load_store();
    assert_eq!(lost, 1);
    println!("separate load/store from 2 threads: {lost} (one update lost)");

    // 3. fetch_add는 옛 값을 돌려주고, 넘치면 감긴다(panic하지 않는다).
    let a = AtomicU8::new(254);
    assert_eq!(a.fetch_add(1, Ordering::Relaxed), 254);
    assert_eq!(a.fetch_add(1, Ordering::Relaxed), 255);
    assert_eq!(a.load(Ordering::Relaxed), 0);
    println!("AtomicU8 254 -> fetch_add returns 254, 255, then value 0 (wraps)");

    // 4. compare_exchange: 여러 스레드 중 정확히 하나만 이긴다.
    let (w, wins) = first_writer_wins(8);
    assert!(w < 8);
    assert_eq!(wins, 1);
    let x = AtomicUsize::new(5);
    assert_eq!(
        x.compare_exchange(4, 9, Ordering::Relaxed, Ordering::Relaxed),
        Err(5)
    );
    assert_eq!(
        x.compare_exchange(5, 9, Ordering::Relaxed, Ordering::Relaxed),
        Ok(5)
    );
    println!("compare_exchange: exactly one winner of 8 (id {w}); Err(current) on mismatch");

    // 5. Release/Acquire 깃발: 2,000번 모두 데이터가 보였다.
    let ok = publish_with_flag(2_000);
    assert_eq!(ok, 2_000);
    println!("Release/Acquire flag: {ok}/2000 rounds saw the data");

    // 6. Acquire/Release 스핀락이 보통 u64를 지킨다.
    let s = spinlock_counter(4, 50_000);
    assert_eq!(s, 200_000);
    println!("SpinLock counter: {s}");

    // 7. 잘못된 Ordering은 컴파일 오류다(invalid_atomic_ordering, 기본이 deny).
    let bad_load = compile_errors(
        "use std::sync::atomic::{AtomicBool, Ordering};\npub fn f(a: &AtomicBool) -> bool { a.load(Ordering::Release) }\n",
    );
    assert!(bad_load.contains("atomic loads cannot have `Release` or `AcqRel` ordering"));
    let bad_store = compile_errors(
        "use std::sync::atomic::{AtomicBool, Ordering};\npub fn f(a: &AtomicBool) { a.store(true, Ordering::Acquire) }\n",
    );
    assert!(bad_store.contains("atomic stores cannot have `Acquire` or `AcqRel` ordering"));
    println!("load(Release) / store(Acquire): compile error (invalid_atomic_ordering)");

    // 8. 원자 타입은 Sync라서 &로 여러 스레드가 함께 쓴다. static에도 둘 수 있다.
    static HITS: AtomicUsize = AtomicUsize::new(0);
    thread::scope(|s| {
        for _ in 0..3 {
            s.spawn(|| HITS.fetch_add(1, Ordering::Relaxed));
        }
    });
    assert_eq!(HITS.load(Ordering::Relaxed), 3);
    println!("static AtomicUsize hits: 3");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counters() {
        assert_eq!(relaxed_counter(1, 10), 10);
        assert_eq!(relaxed_counter(8, 1_000), 8_000);
        assert_eq!(spinlock_counter(2, 1_000), 2_000);
    }

    #[test]
    fn split_always_loses_one() {
        for _ in 0..20 {
            assert_eq!(split_load_store(), 1);
        }
    }
}
```
{% endraw %}
