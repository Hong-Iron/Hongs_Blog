---
layout: "note"
title: "32_mutex-rwlock_verify.rs"
display_title: "32_mutex-rwlock_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/mutex-rwlock/"
parent_title: "Mutex와 RwLock"
description: "Rust · Mutex와 RwLock 검증 코드"
sitemap: false
permalink: "/studies/rust/code/32_mutex-rwlock_verify/"
---
{% raw %}
[Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/) 문서의 검증 코드다.

```rust
//! Mutex와 RwLock 문서의 주장을 확인한다: 가드가 사라질 때 풀리는 것, 독(poisoning)과 복구,
//! RwLock의 읽기 여럿·쓰기 하나, 읽는 쪽 panic은 독을 남기지 않는 것, 잠금 순서, 2024 if let 범위,
//! `let _ = m.lock()`과 `.await` 너머로 가드를 쥐는 코드가 막히는 것(drop(g)로는 안 풀리고 블록으로 감싸야 풀린다).
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/32_mutex-rwlock_verify.rs"

use std::sync::{Arc, Mutex, RwLock, TryLockError};
use std::thread;

fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr32_{}_{}", std::process::id(), code.len()));
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

/// 스레드 n개가 각자 k번씩 1을 더한다.
fn counter(n: usize, k: usize) -> usize {
    let total = Arc::new(Mutex::new(0usize));
    let handles: Vec<_> = (0..n)
        .map(|_| {
            let total = Arc::clone(&total);
            thread::spawn(move || {
                for _ in 0..k {
                    *total.lock().unwrap() += 1;
                }
            })
        })
        .collect();
    for h in handles {
        h.join().unwrap();
    }
    *total.lock().unwrap()
}

struct Account {
    id: u32,
    balance: Mutex<i64>,
}

/// 두 계좌를 잠글 때 항상 id가 작은 쪽부터 잠근다. 방향이 달라도 순서는 같다.
fn transfer(from: &Account, to: &Account, amount: i64) {
    let (first, second) = if from.id < to.id {
        (from, to)
    } else {
        (to, from)
    };
    let mut a = first.balance.lock().unwrap();
    let mut b = second.balance.lock().unwrap();
    if from.id < to.id {
        *a -= amount;
        *b += amount;
    } else {
        *b -= amount;
        *a += amount;
    }
}

fn main() {
    std::panic::set_hook(Box::new(|_| {})); // 일부러 낸 panic의 메시지를 숨긴다

    // 1. 카운터: 4 스레드 × 10,000번 = 40,000
    let c = counter(4, 10_000);
    assert_eq!(c, 40_000);
    println!("Arc<Mutex<usize>> counter: {c}");

    // 2. 가드가 살아 있는 동안 다른 잠금은 실패하고, 가드가 사라지면 풀린다.
    let m = Mutex::new(vec![1, 2]);
    {
        let mut g = m.lock().unwrap();
        g.push(3);
        assert!(matches!(m.try_lock(), Err(TryLockError::WouldBlock)));
    } // g가 여기서 drop되어 풀린다
    assert_eq!(*m.try_lock().unwrap(), vec![1, 2, 3]);
    println!("guard alive: try_lock WouldBlock; after drop: ok");

    // 3. 같은 스레드에서 두 번 잠그기: lock()은 멈추거나 panic할 수 있으므로 try_lock으로만 본다.
    let g = m.lock().unwrap();
    assert!(m.try_lock().is_err());
    drop(g);

    // 4. 독: 잠근 채 panic한 스레드가 있으면 다음 lock()은 Err다. into_inner로 복구할 수 있다.
    let shared = Arc::new(Mutex::new(0));
    let s2 = Arc::clone(&shared);
    let r = thread::spawn(move || {
        let mut g = s2.lock().unwrap();
        *g = 41; // 불변식을 반쯤 고친 상태에서
        panic!("half-updated");
    })
    .join();
    assert!(r.is_err());
    assert!(shared.is_poisoned());
    let mut g = match shared.lock() {
        Ok(g) => g,
        Err(poisoned) => poisoned.into_inner(),
    };
    assert_eq!(*g, 41); // panic 전에 쓴 값이 그대로 남아 있다
    *g += 1;
    drop(g);
    shared.clear_poison();
    assert!(!shared.is_poisoned());
    assert_eq!(*shared.lock().unwrap(), 42);
    println!("poison: lock() Err, into_inner -> 41, clear_poison -> ok");

    // 5. RwLock: 읽기 가드 둘이 동시에 있고, 그동안 쓰기는 막힌다.
    let rw = RwLock::new(String::from("v1"));
    {
        let r1 = rw.read().unwrap();
        let r2 = rw.read().unwrap();
        assert_eq!((r1.as_str(), r2.as_str()), ("v1", "v1"));
        assert!(matches!(rw.try_write(), Err(TryLockError::WouldBlock)));
    }
    rw.write().unwrap().push_str("+w");
    {
        let _w = rw.write().unwrap();
        assert!(matches!(rw.try_read(), Err(TryLockError::WouldBlock)));
    }
    assert_eq!(*rw.read().unwrap(), "v1+w");
    println!("RwLock: two readers at once, writer blocked; writer blocks readers");

    // 6. 읽는 쪽의 panic은 독을 남기지 않고, 쓰는 쪽의 panic은 남긴다.
    let rw = Arc::new(RwLock::new(0));
    let rr = Arc::clone(&rw);
    let _ = thread::spawn(move || {
        let _r = rr.read().unwrap();
        panic!("reader");
    })
    .join();
    assert!(!rw.is_poisoned());
    let rw2 = Arc::clone(&rw);
    let _ = thread::spawn(move || {
        let _w = rw2.write().unwrap();
        panic!("writer");
    })
    .join();
    assert!(rw.is_poisoned());
    println!("RwLock poison: reader panic -> no, writer panic -> yes");

    // 7. 잠금 순서: 반대 방향 이체를 동시에 많이 해도 멈추지 않고 합이 그대로다.
    let a = Arc::new(Account {
        id: 1,
        balance: Mutex::new(1_000),
    });
    let b = Arc::new(Account {
        id: 2,
        balance: Mutex::new(1_000),
    });
    let hs: Vec<_> = (0..4)
        .map(|i| {
            let (a, b) = (Arc::clone(&a), Arc::clone(&b));
            thread::spawn(move || {
                for _ in 0..10_000 {
                    if i % 2 == 0 {
                        transfer(&a, &b, 1);
                    } else {
                        transfer(&b, &a, 1);
                    }
                }
            })
        })
        .collect();
    for h in hs {
        h.join().unwrap();
    }
    let (x, y) = (*a.balance.lock().unwrap(), *b.balance.lock().unwrap());
    assert_eq!((x, y), (1_000, 1_000));
    println!("lock ordering: 40,000 opposite transfers finished, balances {x} {y}");

    // 8. 2024 에디션: if let의 임시 가드는 else에 들어가기 전에 풀린다.
    let opt = Mutex::new(None::<i32>);
    let relocked = if let Some(v) = *opt.lock().unwrap() {
        v
    } else {
        // 2021이었다면 여기서 바깥 가드가 아직 살아 있어 try_lock이 실패한다
        *opt.try_lock().expect("2024: guard already dropped") = Some(7);
        -1
    };
    assert_eq!(relocked, -1);
    assert_eq!(*opt.lock().unwrap(), Some(7));
    println!("edition 2024 if-let: guard dropped before else");

    // 9. 컴파일러가 막는 실수
    let underscore = compile_errors(
        "use std::sync::Mutex;\npub fn f(m: &Mutex<i32>) { let _ = m.lock().unwrap(); }\n",
    );
    assert!(underscore.contains("let_underscore_lock"));
    assert!(underscore.contains("non-binding let on a synchronization lock"));
    println!("let _ = m.lock(): error (let_underscore_lock)");

    let across_await = compile_errors(
        "use std::sync::Mutex;\nasync fn other() {}\nfn need_send<T: Send>(_: T) {}\npub fn f(m: &'static Mutex<i32>) { need_send(async move { let g = m.lock().unwrap(); other().await; drop(g); }); }\n",
    );
    assert!(across_await.contains("error"));
    assert!(across_await.contains("future cannot be sent between threads safely"));
    println!("MutexGuard held across .await: future is not Send");

    let scoped = compile_errors(
        "use std::sync::Mutex;\nasync fn other() {}\nfn need_send<T: Send>(_: T) {}\npub fn f(m: &'static Mutex<i32>) { need_send(async move { { let mut g = m.lock().unwrap(); *g += 1; } other().await; }); }\n",
    );
    assert!(!scoped.contains("error"), "{scoped}");
    let dropped = compile_errors(
        "use std::sync::Mutex;\nasync fn other() {}\nfn need_send<T: Send>(_: T) {}\npub fn f(m: &'static Mutex<i32>) { need_send(async move { let mut g = m.lock().unwrap(); *g += 1; drop(g); other().await; }); }\n",
    );
    assert!(dropped.contains("future cannot be sent between threads safely"));
    println!("guard in inner block before .await: Send; drop(g) before .await: still not Send");

    let _ = std::panic::take_hook();
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counter_small() {
        assert_eq!(counter(1, 0), 0);
        assert_eq!(counter(3, 7), 21);
    }

    #[test]
    fn transfer_both_directions() {
        let a = Account {
            id: 1,
            balance: Mutex::new(10),
        };
        let b = Account {
            id: 2,
            balance: Mutex::new(0),
        };
        transfer(&a, &b, 3);
        transfer(&b, &a, 1);
        assert_eq!(*a.balance.lock().unwrap(), 8);
        assert_eq!(*b.balance.lock().unwrap(), 2);
    }
}
```
{% endraw %}
