---
layout: "note"
title: "15_traits_verify.rs"
display_title: "15_traits_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/traits/"
parent_title: "트레이트"
description: "Rust · 트레이트 검증 코드"
permalink: "/studies/rust/code/15_traits_verify/"
---
{% raw %}
[트레이트](/Hongs_Blog/studies/rust/traits/) 문서의 검증 코드다.

```rust
//! 15 트레이트: 기본 메서드, 연관 타입과 제네릭 매개변수의 차이, 블랭킷 구현, 슈퍼트레이트, impl Trait,
//! 고아 규칙(E0117)과 뉴타입 우회, 트레이트를 가져오지 않으면 메서드를 못 부르는 것(E0599)을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/15_traits_verify.rs"

use std::fmt;
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

/// 코드 조각을 라이브러리로 컴파일해 stderr를 돌려준다.
fn compile_errors(code: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::Relaxed);
    let dir = std::env::temp_dir().join(format!("vr15_{}_{}", std::process::id(), n));
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

/// 오류 코드가 나오는지 확인하고, 첫 오류 줄을 찍는다.
fn expect_error(label: &str, code: &str, err: &str) {
    let e = compile_errors(code);
    let first = e
        .lines()
        .find(|l| l.starts_with("error"))
        .unwrap_or("(오류 없음)");
    println!("[{label}] {first}");
    assert!(e.contains(&format!("error[{err}]")), "{label}: {e}");
}

fn expect_ok(label: &str, code: &str) {
    let e = compile_errors(code);
    println!("[{label}] 컴파일 통과");
    assert!(!e.contains("error"), "{label}: {e}");
}

// 1. 기본 메서드: summarize는 몸통이 있어 구현하는 쪽이 고르지 않아도 된다.
trait Summary {
    fn author(&self) -> String;
    fn summarize(&self) -> String {
        format!("({}의 글 더 보기...)", self.author())
    }
}

struct Post {
    author: String,
}

struct Tweet {
    user: String,
    text: String,
}

impl Summary for Post {
    fn author(&self) -> String {
        self.author.clone()
    }
}

impl Summary for Tweet {
    fn author(&self) -> String {
        format!("@{}", self.user)
    }
    fn summarize(&self) -> String {
        format!("{}: {}", self.author(), self.text)
    }
}

// 2. 연관 타입: 한 타입에 한 번만 구현한다. Item이 무엇인지 부르는 쪽이 적지 않는다.
struct Countdown(u32);

impl Iterator for Countdown {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.0 == 0 {
            None
        } else {
            self.0 -= 1;
            Some(self.0 + 1)
        }
    }
}

// 제네릭 매개변수: 같은 타입에 여러 번 구현할 수 있다. 부를 때 어느 쪽인지 적어야 한다.
trait ConvertTo<T> {
    fn convert(&self) -> T;
}

impl ConvertTo<i64> for i32 {
    fn convert(&self) -> i64 {
        i64::from(*self) * 1000
    }
}

impl ConvertTo<f64> for i32 {
    fn convert(&self) -> f64 {
        f64::from(*self) / 2.0
    }
}

// 3. 블랭킷 구현: Display를 구현한 모든 타입에 Shout를 붙인다.
trait Shout {
    fn shout(&self) -> String;
}

impl<T: fmt::Display + ?Sized> Shout for T {
    fn shout(&self) -> String {
        format!("{}!", self.to_string().to_uppercase())
    }
}

// 4. 슈퍼트레이트: Labeled를 구현하려면 Display가 먼저 있어야 한다.
trait Labeled: fmt::Display {
    fn label(&self) -> String {
        format!("[{self}]")
    }
}

struct Code(u16);

impl fmt::Display for Code {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "E{:04}", self.0)
    }
}

impl Labeled for Code {}

// 5. impl Trait: 인자 자리와 반환 자리.
fn notify(item: &impl Summary) -> String {
    format!("속보! {}", item.summarize())
}

fn notify_long<T: Summary>(item: &T) -> String {
    format!("속보! {}", item.summarize())
}

fn tens() -> impl Iterator<Item = u32> {
    (1..=3).map(|x| x * 10)
}

// 6. 뉴타입으로 고아 규칙 우회: Vec<i32>에 Display를 붙이고 싶을 때.
struct Csv(Vec<i32>);

impl fmt::Display for Csv {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let parts: Vec<String> = self.0.iter().map(|x| x.to_string()).collect();
        write!(f, "{}", parts.join(","))
    }
}

fn main() {
    // 1. 기본 메서드
    let p = Post {
        author: "kim".into(),
    };
    let t = Tweet {
        user: "rustlang".into(),
        text: "1.99 released".into(),
    };
    println!("{}", p.summarize());
    println!("{}", t.summarize());
    assert_eq!(p.summarize(), "(kim의 글 더 보기...)");
    assert_eq!(t.summarize(), "@rustlang: 1.99 released");

    // 2. 연관 타입과 제네릭 매개변수
    let v: Vec<u32> = Countdown(3).collect();
    assert_eq!(v, vec![3, 2, 1]);
    let a: i64 = 7.convert();
    let b: f64 = 7.convert();
    println!("Countdown(3) = {v:?}, 7 -> i64 {a}, 7 -> f64 {b}");
    assert_eq!((a, b), (7000, 3.5));
    expect_error(
        "제네릭 트레이트를 타입 표시 없이 부름",
        "pub trait ConvertTo<T> { fn convert(&self) -> T; }
         impl ConvertTo<i64> for i32 { fn convert(&self) -> i64 { 0 } }
         impl ConvertTo<f64> for i32 { fn convert(&self) -> f64 { 0.0 } }
         pub fn f() { let _x = 7i32.convert(); }",
        "E0283",
    );
    expect_error(
        "연관 타입 트레이트를 같은 타입에 두 번 구현",
        "pub struct C;
         impl Iterator for C { type Item = u32; fn next(&mut self) -> Option<u32> { None } }
         impl Iterator for C { type Item = String; fn next(&mut self) -> Option<String> { None } }",
        "E0119",
    );

    // 3. 블랭킷 구현
    println!("{} {} {}", 42.shout(), "hi".shout(), Code(7).shout());
    assert_eq!(42.shout(), "42!");
    assert_eq!("hi".shout(), "HI!");

    // 4. 슈퍼트레이트
    assert_eq!(Code(7).label(), "[E0007]");
    println!("label = {}", Code(7).label());
    expect_error(
        "Display 없이 슈퍼트레이트 구현",
        "pub trait Labeled: std::fmt::Display { fn label(&self) -> String { format!(\"[{self}]\") } }
         pub struct S;
         impl Labeled for S {}",
        "E0277",
    );

    // 5. impl Trait
    assert_eq!(notify(&t), notify_long(&t));
    assert_eq!(tens().collect::<Vec<_>>(), vec![10, 20, 30]);
    expect_error(
        "반환 자리 impl Trait에서 두 타입을 돌려줌",
        "pub trait Summary { fn s(&self) -> u8 { 0 } }
         pub struct A; pub struct B;
         impl Summary for A {} impl Summary for B {}
         pub fn make(flag: bool) -> impl Summary { if flag { A } else { B } }",
        "E0308",
    );

    expect_error(
        "인자 자리 impl Trait 함수에 타입을 직접 적음",
        "pub trait S { fn s(&self) -> u8; }
         impl S for u8 { fn s(&self) -> u8 { *self } }
         pub fn notify(item: &impl S) -> u8 { item.s() }
         pub fn f() -> u8 { notify::<u8>(&1) }",
        "E0107",
    );

    // 필수 메서드를 빠뜨림
    expect_error(
        "필수 메서드 빠뜨림",
        "pub trait Summary { fn author(&self) -> String; }
         pub struct P;
         impl Summary for P {}",
        "E0046",
    );

    // 6. 고아 규칙
    expect_error(
        "남의 트레이트를 남의 타입에 구현 (고아 규칙)",
        "impl std::fmt::Display for Vec<i32> {
             fn fmt(&self, _f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { Ok(()) }
         }",
        "E0117",
    );
    expect_ok(
        "내 트레이트를 남의 타입에 구현",
        "pub trait Double { fn double(&self) -> Self; }
         impl Double for i32 { fn double(&self) -> i32 { self * 2 } }",
    );
    expect_ok(
        "남의 트레이트를 내 타입에 구현",
        "pub struct Meters(pub f64);
         impl std::fmt::Display for Meters {
             fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { write!(f, \"{}m\", self.0) }
         }",
    );
    assert_eq!(Csv(vec![1, 2, 3]).to_string(), "1,2,3");
    println!("Csv = {}", Csv(vec![1, 2, 3]));

    // 7. 트레이트를 스코프로 가져오지 않으면 메서드를 못 부른다.
    expect_error(
        "트레이트를 use 하지 않고 메서드 호출",
        "mod a { pub trait Hello { fn hi(&self) -> i32 { 1 } } impl Hello for i32 {} }
         pub fn f() -> i32 { 5i32.hi() }",
        "E0599",
    );
    expect_ok(
        "use로 가져온 뒤 호출",
        "mod a { pub trait Hello { fn hi(&self) -> i32 { 1 } } impl Hello for i32 {} }
         use a::Hello;
         pub fn f() -> i32 { 5i32.hi() }",
    );

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
