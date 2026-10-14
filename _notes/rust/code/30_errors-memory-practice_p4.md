---
layout: "note"
title: "30_errors-memory-practice_p4.rs"
display_title: "30_errors-memory-practice_p4.rs"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "30"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/errors-memory-practice/"
parent_title: "에러와 메모리 연습"
description: "Rust · 에러와 메모리 연습 문제 4 풀이 코드"
permalink: "/studies/rust/code/30_errors-memory-practice_p4/"
---
{% raw %}
[에러와 메모리 연습](/Hongs_Blog/studies/rust/errors-memory-practice/) 문서의 문제 4 풀이 코드다.

```rust
//! 연습 p4: RefCell로 만든 이벤트 버스에서 핸들러가 emit 도중 subscribe를 부르면
//! "RefCell already borrowed"로 panic하는 버그를 재현하고, 핸들러 목록을 복사해 빌림을 먼저 끝내 고친 풀이.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/30_errors-memory-practice_p4.rs"

use std::cell::RefCell;
use std::rc::Rc;

type Handler = Rc<dyn Fn(&Bus, &str)>;

#[derive(Default)]
struct Bus {
    handlers: RefCell<Vec<Handler>>,
    log: RefCell<Vec<String>>,
}

impl Bus {
    fn subscribe(&self, h: Handler) {
        self.handlers.borrow_mut().push(h);
    }

    /// 문제의 코드: 목록을 빌린 채로 핸들러를 부른다.
    fn emit_buggy(&self, ev: &str) {
        for h in self.handlers.borrow().iter() {
            h(self, ev);
        }
    }

    /// 풀이: Rc 복사본 목록을 만들고 빌림을 끝낸 뒤 부른다.
    fn emit(&self, ev: &str) {
        let snapshot: Vec<Handler> = self.handlers.borrow().clone();
        for h in snapshot {
            h(self, ev);
        }
    }
}

fn logger() -> Handler {
    Rc::new(|bus: &Bus, ev: &str| bus.log.borrow_mut().push(format!("log {ev}")))
}

/// "login"을 받으면 새 핸들러를 하나 더 등록한다.
fn auto_subscriber() -> Handler {
    Rc::new(|bus: &Bus, ev: &str| {
        if ev == "login" {
            bus.subscribe(logger());
        }
    })
}

fn main() {
    std::panic::set_hook(Box::new(|_| {}));

    // 버그 재현
    let bus = Bus::default();
    bus.subscribe(logger());
    bus.subscribe(auto_subscriber());
    let r = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| bus.emit_buggy("login")));
    let p = r.expect_err("panic이 나야 한다");
    let msg = p
        .downcast_ref::<&str>()
        .map(|s| s.to_string())
        .or_else(|| p.downcast_ref::<String>().cloned())
        .unwrap_or_default();
    println!("buggy: panic {msg:?}, log = {:?}", bus.log.borrow());
    assert_eq!(msg, "RefCell already borrowed");
    assert_eq!(*bus.log.borrow(), vec!["log login"]); // 첫 핸들러는 돌았다

    // 풀이
    let bus = Bus::default();
    bus.subscribe(logger());
    bus.subscribe(auto_subscriber());
    bus.emit("login");
    assert_eq!(bus.handlers.borrow().len(), 3);
    assert_eq!(*bus.log.borrow(), vec!["log login"]); // 새 핸들러는 다음 이벤트부터
    bus.emit("click");
    println!("fixed: log = {:?}", bus.log.borrow());
    assert_eq!(
        *bus.log.borrow(),
        vec!["log login", "log click", "log click"]
    );

    // try_borrow_mut로 충돌을 panic 대신 값으로 받기
    let held = bus.handlers.borrow();
    assert!(bus.handlers.try_borrow_mut().is_err());
    drop(held);
    assert!(bus.handlers.try_borrow_mut().is_ok());

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
