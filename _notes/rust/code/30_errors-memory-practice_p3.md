---
layout: "note"
title: "30_errors-memory-practice_p3.rs"
display_title: "30_errors-memory-practice_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "30"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/errors-memory-practice/"
parent_title: "에러와 메모리 연습"
description: "Rust · 에러와 메모리 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/30_errors-memory-practice_p3/"
---
{% raw %}
[에러와 메모리 연습](/Hongs_Blog/studies/rust/errors-memory-practice/) 문서의 문제 3 풀이 코드다.

```rust
//! 연습 p3: 폴더 트리에서 자식이 부모를 Rc로 붙잡아 생기는 누수를 Drop 횟수로 찾고,
//! Weak로 고친 풀이. 고친 뒤 경로 문자열("/home/kim/docs")도 Weak를 따라 만든다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/30_errors-memory-practice_p3.rs"

use std::cell::{Cell, RefCell};
use std::rc::{Rc, Weak};

thread_local! {
    static DROPS: Cell<u32> = const { Cell::new(0) };
}
fn drops() -> u32 {
    DROPS.with(|d| d.get())
}
fn reset() {
    DROPS.with(|d| d.set(0));
}

// ----- 문제의 코드: parent도 Rc -----
struct LeakyDir {
    _name: String,
    parent: RefCell<Option<Rc<LeakyDir>>>,
    children: RefCell<Vec<Rc<LeakyDir>>>,
}
impl Drop for LeakyDir {
    fn drop(&mut self) {
        DROPS.with(|d| d.set(d.get() + 1));
    }
}
fn leaky_mkdir(parent: &Rc<LeakyDir>, name: &str) -> Rc<LeakyDir> {
    let child = Rc::new(LeakyDir {
        _name: name.into(),
        parent: RefCell::new(Some(Rc::clone(parent))),
        children: RefCell::new(vec![]),
    });
    parent.children.borrow_mut().push(Rc::clone(&child));
    child
}

// ----- 풀이: parent는 Weak -----
struct Dir {
    name: String,
    parent: RefCell<Weak<Dir>>,
    children: RefCell<Vec<Rc<Dir>>>,
}
impl Drop for Dir {
    fn drop(&mut self) {
        DROPS.with(|d| d.set(d.get() + 1));
    }
}
fn root() -> Rc<Dir> {
    Rc::new(Dir {
        name: String::new(),
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    })
}
fn mkdir(parent: &Rc<Dir>, name: &str) -> Rc<Dir> {
    let child = Rc::new(Dir {
        name: name.into(),
        parent: RefCell::new(Rc::downgrade(parent)),
        children: RefCell::new(vec![]),
    });
    parent.children.borrow_mut().push(Rc::clone(&child));
    child
}
fn path(d: &Rc<Dir>) -> String {
    let mut parts = vec![d.name.clone()];
    let mut cur = d.parent.borrow().upgrade();
    while let Some(p) = cur {
        parts.push(p.name.clone());
        cur = p.parent.borrow().upgrade();
    }
    parts.reverse();
    let joined = parts.join("/");
    if joined.is_empty() {
        "/".into()
    } else {
        joined
    }
}

fn main() {
    // 문제: 디렉터리 4개(/, home, kim, docs)를 만들고 모두 버린다
    reset();
    {
        let r = Rc::new(LeakyDir {
            _name: String::new(),
            parent: RefCell::new(None),
            children: RefCell::new(vec![]),
        });
        let home = leaky_mkdir(&r, "home");
        let kim = leaky_mkdir(&home, "kim");
        let docs = leaky_mkdir(&kim, "docs");
        assert!(docs.parent.borrow().is_some());
        println!(
            "leaky: strong_count(/)={}, (home)={}, (kim)={}",
            Rc::strong_count(&r),
            Rc::strong_count(&home),
            Rc::strong_count(&kim)
        );
        assert_eq!(Rc::strong_count(&r), 2);
        assert_eq!(Rc::strong_count(&home), 3);
    }
    println!("leaky: Drop {}번 (4개 중)", drops());
    assert_eq!(drops(), 0);

    // 풀이
    reset();
    {
        let r = root();
        let home = mkdir(&r, "home");
        let kim = mkdir(&home, "kim");
        let docs = mkdir(&kim, "docs");
        assert_eq!(path(&docs), "/home/kim/docs");
        assert_eq!(path(&r), "/");
        assert_eq!(Rc::strong_count(&r), 1);
        assert_eq!(Rc::weak_count(&r), 1);
        assert_eq!(Rc::strong_count(&home), 2);
    }
    println!("weak: Drop {}번 (4개 중)", drops());
    assert_eq!(drops(), 4);

    // 변형: 루트만 버리고 docs를 쥐고 있으면?
    reset();
    let docs = {
        let r = root();
        let home = mkdir(&r, "home");
        let kim = mkdir(&home, "kim");
        mkdir(&kim, "docs")
    };
    assert_eq!(drops(), 3); // 위쪽 세 개는 아무도 강하게 쥐지 않아 해제된다
    assert_eq!(path(&docs), "docs");
    println!("변형: docs만 남기면 Drop 3번, path = {:?}", path(&docs));

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
