---
layout: "note"
title: "20_closures_verify.rs"
display_title: "20_closures_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/closures/"
parent_title: "클로저"
description: "Rust · 클로저 검증 코드"
sitemap: false
permalink: "/studies/rust/code/20_closures_verify/"
---
{% raw %}
[클로저](/Hongs_Blog/studies/rust/closures/) 문서의 검증 코드다.

```rust
//! 20 클로저: 잡는 방식(빌림·가변 빌림·이동)과 Fn·FnMut·FnOnce, move, 스레드에 넘기기(E0373),
//! Fn 자리에 FnMut 클로저(E0525), FnOnce 두 번 부르기(E0382), 필드 단위 잡기(2021+), 클로저 크기,
//! 함수 포인터로 바뀌기, 클로저 돌려주기(클로저마다 타입이 다름, E0308), async 클로저와 AsyncFn(1.85),
//! 가변으로 잡은 동안 읽기(E0502), 2018 에디션과의 차이, 타입이 처음 부를 때 굳는 것(E0308),
//! unwrap_or_else에 FnOnce 넘기기, clippy redundant_closure를 확인한다.
//! 의존성: futures = "0.3" (block_on으로 async 클로저를 돌린다)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/20_closures_verify.rs"

use std::mem::size_of_val;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::thread;

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

fn compile_errors(code: &str) -> String {
    compile_with("rustc", code, "2024")
}

/// rustc 또는 clippy-driver로 코드 조각을 주어진 에디션으로 컴파일해 stderr를 돌려준다.
fn compile_with(tool: &str, code: &str, edition: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::Relaxed);
    let dir = std::env::temp_dir().join(format!("vr20_{}_{}", std::process::id(), n));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new(tool)
        .args([
            "--edition",
            edition,
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

fn expect(label: &str, code: &str, needle: &str) {
    let e = compile_errors(code);
    let first = e
        .lines()
        .find(|l| l.starts_with("error"))
        .unwrap_or("(오류 없음)");
    println!("[{label}] {first}");
    if needle.is_empty() {
        assert!(!e.contains("error"), "{label}: {e}");
    } else {
        assert!(e.contains(needle), "{label}: {e}");
    }
}

/// 오류 메시지에 들어 있어야 할 문구를 모두 확인한다(첫 줄의 오류 코드와 note·help 문구).
fn expect_all(label: &str, code: &str, needles: &[&str]) {
    let e = compile_errors(code);
    let first = e
        .lines()
        .find(|l| l.starts_with("error"))
        .unwrap_or("(오류 없음)");
    println!("[{label}] {first}");
    for n in needles {
        assert!(e.contains(n), "{label}: {n}\n{e}");
    }
}

fn call_twice<F: Fn() -> usize>(f: F) -> usize {
    f() + f()
}

fn call_mut_twice<F: FnMut() -> usize>(mut f: F) -> usize {
    f() + f()
}

fn call_once<F: FnOnce() -> String>(f: F) -> String {
    f()
}

fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn make_op(name: &str) -> Box<dyn Fn(i32, i32) -> i32> {
    match name {
        "add" => Box::new(|a, b| a + b),
        _ => Box::new(|a, b| a * b),
    }
}

async fn apply_async<F: AsyncFn(u32) -> u32>(f: F) -> u32 {
    f(1).await + f(2).await
}

struct Point {
    x: i32,
    y: i32,
}

fn main() {
    // 0. 둘레의 값을 잡는 정렬 기준: origin에서 가까운 순서
    let origin: i32 = 10;
    let mut near = vec![3, 14, 9, 12];
    near.sort_by_key(|&x| (x - origin).abs());
    println!("origin {origin}에서 가까운 순: {near:?}");
    assert_eq!(near, [9, 12, 14, 3]);
    expect(
        "처음 부를 때 굳은 타입과 다른 타입으로 부름",
        "pub fn g() { let c = |x| x; let _s = c(String::from(\"a\")); let _n = c(5); }",
        "error[E0308]",
    );

    // 1. 세 가지 잡는 방식
    let name = String::from("kim");
    let greet = || name.len(); // 빌림만 한다 -> Fn
    assert_eq!(call_twice(greet), 6);
    println!("name은 아직 쓸 수 있다: {name}");

    let mut count = 0;
    let mut inc = || {
        count += 1;
        count
    }; // 가변 빌림 -> FnMut
    assert_eq!(call_mut_twice(&mut inc), 3); // 1 + 2
    assert_eq!(inc(), 3);
    println!("count = {count}");
    assert_eq!(count, 3);

    let owned = String::from("moved");
    let give = move || owned; // 잡은 값을 밖으로 내보낸다 -> FnOnce만
    assert_eq!(call_once(give), "moved");

    // move로 잡아도 값을 내보내지 않으면 Fn이다.
    let data = [1, 2, 3];
    let sum = move || data.iter().sum::<i32>() as usize;
    assert_eq!(call_twice(sum), 12);

    // 2. 컴파일 오류들
    expect_all(
        "Fn 자리에 값을 바꾸는 클로저",
        "fn call_twice<F: Fn()>(f: F) { f(); f(); }
         pub fn g() { let mut n = 0; let c = || n += 1; call_twice(c); }",
        &[
            "error[E0525]: expected a closure that implements the `Fn` trait, but this closure only implements `FnMut`",
            "closure is `FnMut` because it mutates the variable `n` here",
        ],
    );
    expect(
        "move를 붙여도 값을 바꾸면 Fn이 아니다",
        "fn call_twice<F: Fn()>(f: F) { f(); f(); }
         pub fn g() { let mut n = 0; let c = move || n += 1; call_twice(c); let _ = n; }",
        "error[E0525]",
    );
    expect(
        "같은 클로저를 인자 자리에 바로 씀",
        "fn call_twice<F: Fn()>(f: F) { f(); f(); }
         pub fn g() { let mut n = 0; call_twice(|| n += 1); }",
        "error[E0594]",
    );
    expect_all(
        "FnOnce 클로저를 두 번 부름",
        "pub fn g() { let s = String::from(\"a\"); let f = move || s; let _a = f(); let _b = f(); }",
        &[
            "error[E0382]: use of moved value: `f`",
            "closure cannot be invoked more than once because it moves the variable `s` out of its environment",
        ],
    );
    expect(
        "가변으로 잡은 클로저가 살아 있는 동안 읽기",
        "pub fn g() { let mut count = 0; let mut inc = || count += 1; println!(\"{count}\"); inc(); }",
        "error[E0502]",
    );
    expect_all(
        "move 없이 스레드에 빌린 값을 넘김",
        "pub fn g() { let v = vec![1]; let h = std::thread::spawn(|| v.len()); h.join().unwrap(); }",
        &[
            "error[E0373]: closure may outlive the current function, but it borrows `v`",
            "help: to force the closure to take ownership of `v` (and any other referenced variables), use the `move` keyword",
        ],
    );
    expect(
        "move를 붙이면 통과",
        "pub fn g() { let v = vec![1]; let h = std::thread::spawn(move || v.len()); h.join().unwrap(); }",
        "",
    );

    // 3. 스레드에 넘기기
    let list = [1, 2, 3];
    let h = thread::spawn(move || list.iter().map(|x| x * 10).collect::<Vec<_>>());
    assert_eq!(h.join().unwrap(), vec![10, 20, 30]);
    // 범위 스레드(scope)는 끝나기 전에 합류하므로 move 없이 빌려도 된다.
    let words = ["a", "bb", "ccc"];
    let total = thread::scope(|s| {
        let h = s.spawn(|| words.iter().map(|w| w.len()).sum::<usize>());
        h.join().unwrap()
    });
    assert_eq!(total, 6);

    // 4. 필드 단위로 잡기 (2021 에디션부터)
    let mut p = Point { x: 1, y: 2 };
    let mut bump_x = || p.x += 10; // p.x만 가변으로 빌린다
    let y = p.y; // p.y는 따로 읽어도 된다
    bump_x();
    assert_eq!((p.x, y), (11, 2));
    expect(
        "필드 단위 잡기가 없으면 막혔을 코드",
        "pub struct P { pub x: i32, pub y: i32 }
         pub fn g() { let mut p = P { x: 1, y: 2 }; let mut c = || p.x += 1; let y = &p.y; c(); let _ = y; }",
        "",
    );
    let e2018 = compile_with(
        "rustc",
        "pub struct P { pub x: i32, pub y: i32 }
         pub fn g() { let mut p = P { x: 1, y: 2 }; let mut c = || p.x += 1; let y = &p.y; c(); let _ = y; }",
        "2018",
    );
    let first = e2018.lines().find(|l| l.starts_with("error")).unwrap();
    println!("[같은 코드, 2018 에디션] {first}");
    assert!(e2018.contains("error[E0502]: cannot borrow `p.y` as immutable"));

    // 5. 클로저의 크기는 잡은 것의 크기다.
    let none = || 1;
    let big = [0u8; 100];
    let by_ref = || big.len();
    let by_move = move || big.len();
    let sizes = (
        size_of_val(&none),
        size_of_val(&by_ref),
        size_of_val(&by_move),
    );
    println!(
        "클로저 크기: 아무것도 안 잡음 {}, 참조로 잡음 {}, [u8; 100]을 move {}",
        sizes.0, sizes.1, sizes.2
    );
    assert_eq!(sizes, (0, 8, 100));

    // 6. 아무것도 잡지 않으면 함수 포인터로 바뀐다.
    let add = |a: i32, b: i32| a + b;
    let fp: fn(i32, i32) -> i32 = add;
    assert_eq!(fp(5, 7), 12);
    expect_all(
        "무언가 잡은 클로저를 함수 포인터로",
        "pub fn g() -> fn(i32) -> i32 { let n = 3; let c = move |x| x + n; c }",
        &[
            "error[E0308]: mismatched types",
            "closures can only be coerced to `fn` types if they do not capture any variables",
        ],
    );

    // 7. 클로저 돌려주기
    let add5 = make_adder(5);
    assert_eq!(add5(1), 6);
    assert_eq!(make_op("add")(3, 4), 7);
    assert_eq!(make_op("mul")(3, 4), 12);
    expect(
        "move 없이 매개변수를 잡은 클로저를 돌려줌",
        "pub fn make_adder(n: i32) -> impl Fn(i32) -> i32 { |x| x + n }",
        "error[E0373]",
    );
    // 몸통이 똑같아도 클로저마다 타입이 다르다. 그래서 한 Vec에 담으려면 Box<dyn Fn>이 필요하다.
    expect(
        "잡는 클로저 두 개를 한 Vec에",
        "pub fn g() { let n = 1; let a = move || n; let b = move || n; let _v = vec![a, b]; }",
        "no two closures, even if identical, have the same type",
    );
    let n = 1;
    let ops: Vec<Box<dyn Fn() -> i32>> = vec![Box::new(move || n), Box::new(move || n + 1)];
    assert_eq!(ops.iter().map(|f| f()).sum::<i32>(), 3);
    // 다른 스레드와 함께 쓸 콜백 목록은 + Send + Sync를 붙인다.
    let shared: Vec<Box<dyn Fn(i32) -> i32 + Send + Sync>> =
        vec![Box::new(|x| x + 1), Box::new(move |x| x * n)];
    let from_threads = thread::scope(|s| {
        let a = s.spawn(|| shared[0](1));
        let b = s.spawn(|| shared[1](5));
        (a.join().unwrap(), b.join().unwrap())
    });
    assert_eq!(from_threads, (2, 5));

    // 8. 정렬 키 클로저는 FnMut이라 바깥 값을 바꿀 수 있다.
    let mut calls = 0;
    let mut v = vec![3, 1, 2];
    v.sort_by_key(|&x| {
        calls += 1;
        x
    });
    assert_eq!(v, [1, 2, 3]);
    assert!(calls >= 3);

    // unwrap_or_else는 FnOnce를 받는다: 잡은 값을 밖으로 내보내는 클로저도 넘길 수 있다.
    let fallback = String::from("기본값");
    let missing: Option<String> = std::hint::black_box(None);
    let got = missing.unwrap_or_else(move || {
        let mut s = fallback; // 잡은 String을 꺼내 쓴다 -> 이 클로저는 FnOnce뿐이다
        s.push('!');
        s
    });
    assert_eq!(got, "기본값!");

    // 9. async 클로저 (1.85): 돌려주는 퓨처가 잡은 값을 빌린다.
    let prefix = String::from("id-");
    let tag = async |n: u32| format!("{prefix}{n}");
    let r = futures::executor::block_on(async { (tag(1).await, tag(2).await) });
    assert_eq!(r, ("id-1".to_string(), "id-2".to_string()));
    let factor = 10;
    let times = async |x: u32| x * factor;
    assert_eq!(futures::executor::block_on(apply_async(times)), 30);
    expect_all(
        "보통 클로저 + async 블록은 잡은 값을 빌린 퓨처를 못 돌려준다",
        "pub fn g() { let s = String::from(\"a\"); let c = move || async { s.len() }; let _f = c(); }",
        &[
            "error: lifetime may not live long enough",
            "closure implements `Fn`, so references to captured variables can't escape the closure",
        ],
    );
    expect(
        "async move 클로저는 잡은 값을 빌린 퓨처를 돌려준다",
        "pub async fn h() -> usize { let s = String::from(\"a\"); let c = async move || s.len(); c().await + c().await }",
        "",
    );
    println!("async 클로저: {:?}", r);

    // 10. clippy: 함수를 그대로 부르기만 하는 클로저는 함수 이름으로 바꾸라고 한다.
    let w = compile_with(
        "clippy-driver",
        "fn double(x: i32) -> i32 { x * 2 }
         pub fn h(v: Vec<i32>) -> Vec<i32> { v.into_iter().map(|x| double(x)).collect() }",
        "2024",
    );
    let first = w.lines().find(|l| l.starts_with("warning")).unwrap();
    println!("[clippy] {first}");
    assert!(w.contains("#[warn(clippy::redundant_closure)]` on by default"));

    // 11. 출력 예측 카드
    let mut log = Vec::new();
    let mut n = 1;
    let mut step = |k: i32| {
        n *= k;
        log.push(n);
    };
    step(2);
    step(3);
    step(4);
    println!("n = {n}, log = {log:?}");
    assert_eq!((n, log), (24, vec![2, 6, 24]));

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
