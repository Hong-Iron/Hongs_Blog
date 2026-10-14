---
layout: "note"
title: "35_concurrency-practice_p2.rs"
display_title: "35_concurrency-practice_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "35"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/concurrency-practice/"
parent_title: "동시성 연습"
description: "Rust · 동시성 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/35_concurrency-practice_p2/"
---
{% raw %}
[동시성 연습](/Hongs_Blog/studies/rust/concurrency-practice/) 문서의 문제 2 풀이 코드다.

```rust
//! 동시성 연습 p2: 잠금 순서가 엇갈려 생기는 교착상태와 그 고침.
//! 엇갈린 순서는 Barrier로 "둘 다 첫 잠금을 쥔 순간"을 만든 뒤 try_lock으로 순환 대기를 확인한다(진짜로 멈추지 않게).
//! 고친 판은 4 스레드 × 10,000번을 돌려 멈추지 않고 합계가 맞는 것을 본다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/35_concurrency-practice_p2.rs"

use std::sync::{Barrier, Mutex, TryLockError};
use std::thread;

struct Shop {
    inventory: Mutex<i64>, // 재고 개수
    ledger: Mutex<i64>,    // 현금
}

/// 엇갈린 순서를 그대로 흉내 낸다: sell은 inventory→ledger, restock은 ledger→inventory.
/// 둘 다 첫 잠금을 쥔 뒤 두 번째 잠금을 try_lock으로 시도해 막히는지 돌려준다.
fn crossed_order_blocks(shop: &Shop) -> (bool, bool) {
    let barrier = Barrier::new(2);
    thread::scope(|s| {
        let sell = s.spawn(|| {
            let _inv = shop.inventory.lock().unwrap();
            barrier.wait(); // 상대도 첫 잠금을 쥐었다
            let blocked = matches!(shop.ledger.try_lock(), Err(TryLockError::WouldBlock));
            barrier.wait(); // 상대도 시도할 때까지 첫 잠금을 쥐고 있는다
            blocked
        });
        let restock = s.spawn(|| {
            let _led = shop.ledger.lock().unwrap();
            barrier.wait();
            let blocked = matches!(shop.inventory.try_lock(), Err(TryLockError::WouldBlock));
            barrier.wait();
            blocked
        });
        (sell.join().unwrap(), restock.join().unwrap())
    })
}

/// 고친 판: 두 함수 모두 inventory → ledger 순서로 잠근다.
fn sell(shop: &Shop, price: i64) {
    let mut inv = shop.inventory.lock().unwrap();
    let mut cash = shop.ledger.lock().unwrap();
    *inv -= 1;
    *cash += price;
}

fn restock(shop: &Shop, cost: i64) {
    let mut inv = shop.inventory.lock().unwrap(); // 원래는 ledger를 먼저 잠갔다
    let mut cash = shop.ledger.lock().unwrap();
    *cash -= cost;
    *inv += 1;
}

fn stress(threads: usize, rounds: usize) -> (i64, i64) {
    let shop = Shop {
        inventory: Mutex::new(100),
        ledger: Mutex::new(0),
    };
    thread::scope(|s| {
        for t in 0..threads {
            let shop = &shop;
            s.spawn(move || {
                for _ in 0..rounds {
                    if t % 2 == 0 {
                        sell(shop, 3);
                    } else {
                        restock(shop, 2);
                    }
                }
            });
        }
    });
    (
        shop.inventory.into_inner().unwrap(),
        shop.ledger.into_inner().unwrap(),
    )
}

fn main() {
    let shop = Shop {
        inventory: Mutex::new(0),
        ledger: Mutex::new(0),
    };
    let (a, b) = crossed_order_blocks(&shop);
    assert!(a && b);
    println!("crossed order: sell waits for ledger, restock waits for inventory -> circular wait");

    let (inv, cash) = stress(4, 10_000);
    // 판매 2 스레드 × 10,000 = 20,000번, 입고 2 스레드 × 10,000 = 20,000번
    assert_eq!(inv, 100 - 20_000 + 20_000);
    assert_eq!(cash, 20_000 * 3 - 20_000 * 2);
    println!("same order: 40,000 ops finished, inventory {inv}, cash {cash}");
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn single_ops() {
        let (inv, cash) = stress(1, 5);
        assert_eq!((inv, cash), (95, 15));
        let (inv, cash) = stress(2, 3);
        assert_eq!((inv, cash), (100, 3));
    }
}
```
{% endraw %}
