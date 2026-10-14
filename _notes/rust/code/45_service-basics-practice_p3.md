---
layout: "note"
title: "45_service-basics-practice_p3.rs"
display_title: "45_service-basics-practice_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "45"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/service-basics-practice/"
parent_title: "서비스 기초 연습"
description: "Rust · 서비스 기초 연습 문제 3 풀이 코드"
permalink: "/studies/rust/code/45_service-basics-practice_p3/"
---
{% raw %}
[서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/) 문서의 문제 3 풀이 코드다.

```rust
//! 서비스 기초 연습 p3: 주문 처리 함수에 span을 달되 카드 번호는 빼고, 처리 결과(status)는 나중에 span에 기록한다.
//! JSON 로그를 붙잡아 한 주문의 로그만 골라내고, 카드 번호가 어디에도 없는지 확인한다.
//! 변형: fields(status = Empty)를 빼고 record하면 아무 오류 없이 status가 빠진다.
//! 의존성: tracing = "0.1", tracing-subscriber = { version = "0.3", features = ["json"] }, serde_json = "1"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/45_service-basics-practice_p3.rs"

use std::io;
use std::sync::{Arc, Mutex};

use serde_json::Value;
use tracing::field::Empty;
use tracing::{Span, info, instrument, warn};

#[derive(Clone, Default)]
struct Buf(Arc<Mutex<Vec<u8>>>);

impl io::Write for Buf {
    fn write(&mut self, b: &[u8]) -> io::Result<usize> {
        self.0.lock().expect("lock").extend_from_slice(b);
        Ok(b.len())
    }
    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}

/// card는 skip으로 span 필드에서 뺀다. status는 지금은 비워 두고(Empty) 나중에 채운다.
#[instrument(skip(card), fields(status = Empty))]
fn handle_order(order_id: u64, amount: u64, card: &str) -> bool {
    info!(last4 = &card[card.len() - 4..], "charging");
    let ok = amount <= 1_000;
    Span::current().record("status", if ok { "paid" } else { "declined" });
    if ok {
        info!("order done");
    } else {
        warn!(amount, "limit exceeded");
    }
    ok
}

/// 변형: status를 미리 선언하지 않았다. record는 오류 없이 아무 일도 하지 않는다.
#[instrument(skip(card))]
fn handle_order_undeclared(order_id: u64, amount: u64, card: &str) -> bool {
    let ok = amount <= 1_000 && !card.is_empty();
    Span::current().record("status", if ok { "paid" } else { "declined" });
    info!("order done");
    ok
}

fn main() {
    let buf = Buf::default();
    let w = buf.clone();
    let sub = tracing_subscriber::fmt()
        .json()
        .with_writer(move || w.clone())
        .finish();
    tracing::subscriber::with_default(sub, || {
        handle_order(1, 500, "4111111111111111");
        handle_order(2, 5_000, "5500000000000004");
        handle_order_undeclared(3, 500, "4111111111111111");
    });
    let text = String::from_utf8(buf.0.lock().expect("lock").clone()).expect("utf8");
    let lines: Vec<Value> = text
        .lines()
        .map(|l| serde_json::from_str(l).expect("json"))
        .collect();

    let order2: Vec<&Value> = lines
        .iter()
        .filter(|l| l["span"]["order_id"] == 2)
        .collect();
    for l in &order2 {
        println!("{}", serde_json::to_string(l).expect("json"));
    }
    let order3: Vec<&Value> = lines
        .iter()
        .filter(|l| l["span"]["order_id"] == 3)
        .collect();
    println!("변형(선언 안 함): {}", order3[0]["span"]);
    assert_eq!(order3.len(), 1);
    assert!(order3[0]["span"].get("status").is_none());
    assert_eq!(lines.len(), 5);
    assert_eq!(order2.len(), 2);
    assert!(
        order2[0]["span"].get("status").is_none(),
        "기록 전 이벤트에는 status가 없다"
    );
    assert_eq!(order2[1]["span"]["status"], "declined");
    assert_eq!(order2[1]["fields"]["amount"], 5000);
    assert_eq!(order2[0]["fields"]["last4"], "0004");
    assert!(!text.contains("4111111111111111") && !text.contains("5500000000000004"));
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
