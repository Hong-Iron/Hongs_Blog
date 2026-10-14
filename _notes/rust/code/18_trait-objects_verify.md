---
layout: "note"
title: "18_trait-objects_verify.rs"
display_title: "18_trait-objects_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/trait-objects/"
parent_title: "트레이트 객체"
description: "Rust · 트레이트 객체 검증 코드"
sitemap: false
permalink: "/studies/rust/code/18_trait-objects_verify/"
---
{% raw %}
[트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/) 문서의 검증 코드다.

```rust
//! 18 트레이트 객체: 포인터 크기(데이터 포인터 + vtable 포인터), 서로 다른 타입을 한 Vec에 담기,
//! dyn 호환성(E0038) 규칙과 `where Self: Sized` 탈출구, Box<dyn Error>와 ?, 기본 수명 'static,
//! dyn 값은 포인터 뒤에서만 쓴다는 것(E0277), Send 없는 Box<dyn Error>를 스레드에서 돌려받지 못하는 것을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/18_trait-objects_verify.rs"

use std::error::Error;
use std::fmt;
use std::mem::{size_of, size_of_val};
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

fn compile_errors(code: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::Relaxed);
    let dir = std::env::temp_dir().join(format!("vr18_{}_{}", std::process::id(), n));
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

trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String {
        "도형".to_string()
    }
    // Self: Sized가 붙은 메서드는 vtable에 들어가지 않는다. 그래서 트레이트는 dyn 호환을 유지한다.
    fn boxed(self) -> Box<dyn Shape>
    where
        Self: Sized + 'static,
    {
        Box::new(self)
    }
}

struct Circle {
    r: f64,
}

struct Rect {
    w: f64,
    h: f64,
}

struct Unit;

impl Shape for Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.r * self.r
    }
    fn name(&self) -> String {
        format!("원(r={})", self.r)
    }
}

impl Shape for Rect {
    fn area(&self) -> f64 {
        self.w * self.h
    }
}

impl Shape for Unit {
    fn area(&self) -> f64 {
        1.0
    }
}

#[derive(Debug)]
struct ConfigError {
    key: String,
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "설정 키 {} 가 없다", self.key)
    }
}

impl Error for ConfigError {}

fn parse_port(s: &str) -> Result<u16, Box<dyn Error + Send + Sync>> {
    if s.is_empty() {
        return Err(Box::new(ConfigError { key: "port".into() }));
    }
    let n: u16 = s.parse()?; // ParseIntError가 Box<dyn Error>로 바뀐다
    Ok(n)
}

fn main() {
    // 1. 크기: 보통 참조는 주소 하나, 트레이트 객체를 가리키는 참조는 주소 둘.
    let w = size_of::<usize>();
    let sizes = [
        ("&Circle", size_of::<&Circle>()),
        ("&dyn Shape", size_of::<&dyn Shape>()),
        ("Box<Circle>", size_of::<Box<Circle>>()),
        ("Box<dyn Shape>", size_of::<Box<dyn Shape>>()),
        ("&[u8]", size_of::<&[u8]>()),
    ];
    for (n, s) in sizes {
        println!("{n:>15}: {s}바이트");
    }
    assert_eq!(size_of::<&dyn Shape>(), 2 * size_of::<usize>());
    assert_eq!(size_of::<Box<dyn Shape>>(), 2 * w);
    assert_eq!(size_of::<&Circle>(), w);
    assert_eq!(size_of::<Box<Circle>>(), w);

    // 2. 서로 다른 타입을 한 Vec에
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { r: 1.0 }),
        Box::new(Rect { w: 2.0, h: 3.0 }),
        Unit.boxed(),
    ];
    for s in &shapes {
        println!(
            "{} 넓이 {:.2}, 값 크기 {}바이트",
            s.name(),
            s.area(),
            size_of_val(&**s)
        );
    }
    let total: f64 = shapes.iter().map(|s| s.area()).sum();
    assert!((total - (std::f64::consts::PI + 7.0)).abs() < 1e-12);
    // size_of_val은 dyn 뒤에 숨은 실제 타입의 크기를 돌려준다.
    assert_eq!(size_of_val(&*shapes[0]), 8);
    assert_eq!(size_of_val(&*shapes[1]), 16);
    assert_eq!(size_of_val(&*shapes[2]), 0);

    // 2-1. dyn Shape는 크기를 모르므로 값 그대로 받거나 Vec에 바로 담을 수 없다.
    expect(
        "dyn Shape를 값으로 받음",
        "pub trait Shape { fn area(&self) -> f64; }
         pub fn f(x: dyn Shape) -> f64 { x.area() }",
        "error[E0277]",
    );
    expect(
        "Vec<dyn Shape>",
        "pub trait Shape { fn area(&self) -> f64; }
         pub fn f(x: Vec<dyn Shape>) -> usize { x.len() }",
        "error[E0277]",
    );

    // 3. dyn 호환성
    expect(
        "제네릭 메서드가 있는 트레이트",
        "pub trait Store { fn put<T>(&self, x: T); }
         pub fn f(_s: &dyn Store) {}",
        "error[E0038]",
    );
    expect(
        "Self를 돌려주는 메서드",
        "pub trait Cloner { fn dup(&self) -> Self; }
         pub fn f(_s: &dyn Cloner) {}",
        "error[E0038]",
    );
    expect(
        "Self: Sized로 빼낸 메서드",
        "pub trait Cloner { fn dup(&self) -> Self where Self: Sized; fn id(&self) -> u8; }
         pub fn f(s: &dyn Cloner) -> u8 { s.id() }",
        "",
    );
    expect(
        "Self: Sized 메서드를 dyn에서 부름",
        "pub trait Cloner { fn dup(&self) -> Self where Self: Sized; }
         pub fn f(s: &dyn Cloner) { let _ = s.dup(); }",
        "error",
    );
    expect(
        "async fn이 있는 트레이트",
        "pub trait Fetch { async fn get(&self) -> u8; }
         pub fn f(_s: &dyn Fetch) {}",
        "error[E0038]",
    );
    expect(
        "Clone은 dyn 호환이 아니다",
        "pub fn f(_s: &dyn Clone) {}",
        "error[E0038]",
    );

    // 4. Box<dyn Error>와 ?
    assert_eq!(parse_port("8080").unwrap(), 8080);
    let e1 = parse_port("").unwrap_err();
    let e2 = parse_port("80x").unwrap_err();
    println!("에러 1: {e1}");
    println!("에러 2: {e2}");
    assert_eq!(e1.to_string(), "설정 키 port 가 없다");
    assert_eq!(e2.to_string(), "invalid digit found in string");
    assert!(e1.downcast_ref::<ConfigError>().is_some());
    assert!(e2.downcast_ref::<std::num::ParseIntError>().is_some());

    // 5. Box<dyn Trait>의 기본 수명은 'static
    expect(
        "빌린 &str를 Box<dyn Display>로",
        "pub fn f<'a>(s: &'a str) -> Box<dyn std::fmt::Display> { Box::new(s) }",
        "error",
    );
    expect(
        "수명을 적은 Box<dyn Display + 'a>",
        "pub fn f<'a>(s: &'a str) -> Box<dyn std::fmt::Display + 'a> { Box::new(s) }",
        "",
    );

    // 6. 자동 트레이트는 + 로 덧붙인다.
    expect(
        "Send가 아닌 값을 Box<dyn Shape + Send>에",
        "pub trait Shape {}
         pub struct S(std::rc::Rc<u8>);
         impl Shape for S {}
         pub fn f(s: S) -> Box<dyn Shape + Send> { Box::new(s) }",
        "error[E0277]",
    );

    // 7. Send가 없는 Box<dyn Error>는 스레드 밖으로 돌려받을 수 없다.
    expect(
        "Box<dyn Error>를 돌려주는 스레드",
        "pub fn f() {
             let h = std::thread::spawn(|| -> Result<(), Box<dyn std::error::Error>> { Ok(()) });
             let _ = h.join();
         }",
        "error[E0277]",
    );
    expect(
        "Box<dyn Error + Send + Sync>를 돌려주는 스레드",
        "pub fn f() {
             let h = std::thread::spawn(|| -> Result<(), Box<dyn std::error::Error + Send + Sync>> { Ok(()) });
             let _ = h.join();
         }",
        "",
    );

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
