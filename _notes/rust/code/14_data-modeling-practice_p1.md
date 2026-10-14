---
layout: "note"
title: "14_data-modeling-practice_p1.rs"
display_title: "14_data-modeling-practice_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "14"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/data-modeling-practice/"
parent_title: "데이터 모델링 연습"
description: "Rust · 데이터 모델링 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/14_data-modeling-practice_p1/"
---
{% raw %}
[데이터 모델링 연습](/Hongs_Blog/studies/rust/data-modeling-practice/) 문서의 문제 1 풀이 코드다.

```rust
//! p1 주문 상태 모델링: bool 필드 대신 열거형 상태와 self를 받는 전환 메서드.
//! 변형: clone 없이 반복문에서 전환하면 E0382, 실패할 때 옛 상태를 돌려주면 clone이 필요 없다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/14_data-modeling-practice_p1.rs"

const TAG: &str = "p1";

/// 코드 조각을 rustc로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let dir =
        std::env::temp_dir().join(format!("vrM{}_{}_{}", TAG, std::process::id(), code.len()));
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
    let _ = std::fs::remove_dir_all(&dir);
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn expect_phrases(code: &str, phrases: &[&str]) {
    let stderr = compile_errors(code);
    for phrase in phrases {
        assert!(stderr.contains(phrase), "'{phrase}' 기대, 실제:\n{stderr}");
        println!("컴파일 확인: {phrase}");
    }
}

fn expect_ok(code: &str) {
    let stderr = compile_errors(code);
    assert!(
        !stderr.contains("error"),
        "컴파일 성공 기대, 실제:\n{stderr}"
    );
}

#[derive(Debug, Clone, PartialEq)]
enum Order {
    Pending {
        items: u32,
    },
    Paid {
        items: u32,
        amount: u64,
    },
    Shipped {
        items: u32,
        amount: u64,
        tracking: String,
    },
    Cancelled {
        reason: String,
    },
}

#[derive(Debug, PartialEq)]
enum TransitionError {
    NotAllowed {
        from: &'static str,
        action: &'static str,
    },
    EmptyTracking,
}

impl Order {
    fn new(items: u32) -> Self {
        Order::Pending { items }
    }

    fn name(&self) -> &'static str {
        match self {
            Order::Pending { .. } => "Pending",
            Order::Paid { .. } => "Paid",
            Order::Shipped { .. } => "Shipped",
            Order::Cancelled { .. } => "Cancelled",
        }
    }

    fn pay(self, amount: u64) -> Result<Order, TransitionError> {
        match self {
            Order::Pending { items } => Ok(Order::Paid { items, amount }),
            other => Err(TransitionError::NotAllowed {
                from: other.name(),
                action: "pay",
            }),
        }
    }

    fn ship(self, tracking: &str) -> Result<Order, TransitionError> {
        if tracking.trim().is_empty() {
            return Err(TransitionError::EmptyTracking);
        }
        match self {
            Order::Paid { items, amount } => Ok(Order::Shipped {
                items,
                amount,
                tracking: tracking.trim().to_string(),
            }),
            other => Err(TransitionError::NotAllowed {
                from: other.name(),
                action: "ship",
            }),
        }
    }

    fn cancel(self, reason: &str) -> Result<Order, TransitionError> {
        match self {
            Order::Pending { .. } | Order::Paid { .. } => Ok(Order::Cancelled {
                reason: reason.to_string(),
            }),
            other => Err(TransitionError::NotAllowed {
                from: other.name(),
                action: "cancel",
            }),
        }
    }

    /// 변형: 실패하면 옛 주문을 에러와 함께 돌려준다. 부르는 쪽이 clone하지 않아도 된다.
    fn try_pay(self, amount: u64) -> Result<Order, (Order, TransitionError)> {
        match self {
            Order::Pending { items } => Ok(Order::Paid { items, amount }),
            other => {
                let from = other.name();
                Err((
                    other,
                    TransitionError::NotAllowed {
                        from,
                        action: "pay",
                    },
                ))
            }
        }
    }

    /// 운송장 번호는 Shipped에만 있다.
    fn tracking(&self) -> Option<&str> {
        match self {
            Order::Shipped { tracking, .. } => Some(tracking),
            _ => None,
        }
    }
}

fn run(script: &[&str]) -> String {
    let mut order = Order::new(2);
    let mut log = Vec::new();
    for step in script {
        let (cmd, arg) = step.split_once(' ').unwrap_or((step, ""));
        let next = match cmd {
            "pay" => order.clone().pay(arg.parse().unwrap_or(0)),
            "ship" => order.clone().ship(arg),
            "cancel" => order.clone().cancel(arg),
            _ => Err(TransitionError::NotAllowed {
                from: order.name(),
                action: "unknown",
            }),
        };
        match next {
            Ok(o) => {
                order = o;
                log.push(order.name().to_string());
            }
            Err(e) => log.push(format!("거절 {e:?}")),
        }
    }
    log.join(", ")
}

fn main() {
    let o = Order::new(2).pay(5000).unwrap().ship(" CJ123 ").unwrap();
    assert_eq!(o.tracking(), Some("CJ123"));
    assert_eq!(
        Order::new(1).ship("CJ1"),
        Err(TransitionError::NotAllowed {
            from: "Pending",
            action: "ship"
        })
    );
    let out = run(&[
        "ship CJ1",
        "pay 5000",
        "pay 5000",
        "ship CJ9",
        "cancel 변심",
    ]);
    println!("{out}");
    assert_eq!(
        out,
        "거절 NotAllowed { from: \"Pending\", action: \"ship\" }, Paid, 거절 NotAllowed { from: \"Paid\", action: \"pay\" }, Shipped, 거절 NotAllowed { from: \"Shipped\", action: \"cancel\" }"
    );
    let out2 = run(&["pay 100", "ship  ", "cancel 품절"]);
    println!("{out2}");
    assert_eq!(out2, "Paid, 거절 EmptyTracking, Cancelled");

    // 변형: clone 없이 self를 받는 전환을 반복문에서 부르면 E0382
    expect_phrases(
        r#"pub enum Order { Pending, Paid }
impl Order {
    fn pay(self) -> Result<Order, &'static str> {
        match self { Order::Pending => Ok(Order::Paid), _ => Err("not allowed") }
    }
}
pub fn run(n: usize) -> usize {
    let mut order = Order::Pending;
    let mut fails = 0;
    for _ in 0..n {
        match order.pay() {
            Ok(o) => order = o,
            Err(_) => fails += 1,
        }
    }
    fails
}"#,
        &[
            "error[E0382]: use of moved value: `order`",
            "moved due to this method call, in previous iteration of loop",
            "this reinitialization might get skipped",
        ],
    );
    // 실패할 때 옛 상태를 돌려주면 clone 없이 컴파일된다
    expect_ok(
        r#"pub enum Order { Pending, Paid }
impl Order {
    fn pay(self) -> Result<Order, (Order, &'static str)> {
        match self { Order::Pending => Ok(Order::Paid), other => Err((other, "not allowed")) }
    }
}
pub fn run(n: usize) -> usize {
    let mut order = Order::Pending;
    let mut fails = 0;
    for _ in 0..n {
        match order.pay() {
            Ok(o) => order = o,
            Err((o, _)) => { order = o; fails += 1; }
        }
    }
    fails
}"#,
    );
    let paid = Order::new(3).try_pay(900).unwrap();
    let (back, err) = paid.clone().try_pay(1).unwrap_err();
    assert_eq!(back, paid);
    assert_eq!(
        err,
        TransitionError::NotAllowed {
            from: "Paid",
            action: "pay"
        }
    );
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cancelled_has_no_tracking() {
        let o = Order::new(1).cancel("x").unwrap();
        assert_eq!(o.tracking(), None);
        assert_eq!(o, Order::Cancelled { reason: "x".into() });
    }
}
```
{% endraw %}
