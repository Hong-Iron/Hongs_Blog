---
layout: "note"
title: "10_structs-methods_verify.rs"
display_title: "10_structs-methods_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/structs-methods/"
parent_title: "구조체와 메서드"
description: "Rust · 구조체와 메서드 검증 코드"
sitemap: false
permalink: "/studies/rust/code/10_structs-methods_verify/"
---
{% raw %}
[구조체와 메서드](/Hongs_Blog/studies/rust/structs-methods/) 문서의 검증 코드다.

```rust
//! 구조체와 메서드 문서의 주장을 확인한다: 필드 이름 줄여 쓰기, 갱신 문법의 이동, self 세 가지,
//! 연관 함수, 튜플 구조체의 타입 구별, 유닛 구조체 크기, derive 출력, 컴파일 오류 코드와 clippy 린트.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/10_structs-methods_verify.rs"

use std::mem::size_of;

#[derive(Debug, Clone, PartialEq)]
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    // 매개변수 이름과 필드 이름이 같으면 `email: email` 대신 `email`만 쓴다.
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}

#[derive(Debug)]
struct Counter {
    count: u32,
}

impl Counter {
    /// 연관 함수(self가 없다). `Counter::new()`로 부른다.
    fn new() -> Self {
        Self { count: 0 }
    }

    /// &self: 읽기만 한다.
    fn get(&self) -> u32 {
        self.count
    }

    /// &mut self: 고친다.
    fn bump(&mut self) -> u32 {
        self.count += 1;
        self.count
    }

    /// self: 값을 통째로 받아 소비한다. 부른 뒤에는 원래 변수를 못 쓴다.
    fn finish(self) -> String {
        format!("최종 {}", self.count)
    }
}

impl Default for Counter {
    fn default() -> Self {
        Self::new()
    }
}

struct Meters(f64);
struct AlwaysEqual;

fn rust_tool(name: &str) -> std::process::Command {
    std::process::Command::new(name)
}

/// 코드 조각을 컴파일하고 stderr를 돌려준다. clippy가 참이면 clippy-driver로 돌린다.
fn compile(code: &str, clippy: bool, extra: &[&str]) -> String {
    let dir = std::env::temp_dir().join(format!(
        "vr10_{}_{}_{}",
        std::process::id(),
        code.len(),
        clippy
    ));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = rust_tool(if clippy { "clippy-driver" } else { "rustc" })
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "--emit=metadata",
            "--out-dir",
        ])
        .arg(&dir)
        .args(extra)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

const USER: &str = "pub struct User { pub active: bool, pub username: String, pub email: String, pub sign_in_count: u64 }\n";

fn main() {
    // 1. 필드 이름 줄여 쓰기
    let u = build_user("a@x.com".to_string(), "ann".to_string());
    assert_eq!(u.username, "ann");
    assert_eq!(u.sign_in_count, 1);

    // 2. 갱신 문법: 지정하지 않은 필드는 옮겨 오거나 복사한다.
    let user1 = build_user("a@x.com".to_string(), "ann".to_string());
    let user2 = User {
        email: "b@x.com".to_string(),
        ..user1
    };
    assert_eq!(user2.username, "ann");
    // user1.email은 옮겨지지 않았으므로 아직 쓸 수 있다.
    assert_eq!(user1.email, "a@x.com");
    println!("user2 = {user2:?}");

    // user1 전체를 쓰면 E0382 (username이 옮겨 갔다)
    let e = compile(
        &format!(
            "{USER}pub fn f(user1: User) -> usize {{ let user2 = User {{ email: String::new(), ..user1 }}; let _ = user2; let whole = user1; whole.email.len() }}"
        ),
        false,
        &[],
    );
    assert!(e.contains("E0382"), "{e}");
    assert!(e.contains("partially moved"), "{e}");
    println!("갱신 문법 뒤 user1 전체 사용: E0382 (partially moved)");

    // user1.email만 쓰면 컴파일된다.
    let e = compile(
        &format!(
            "{USER}pub fn f(user1: User) -> usize {{ let user2 = User {{ email: String::new(), ..user1 }}; let _ = user2; user1.email.len() }}"
        ),
        false,
        &[],
    );
    assert!(!e.contains("error"), "{e}");

    // String 필드 둘 다 새로 주면 user1은 그대로 쓸 수 있다(Copy 필드만 복사).
    let e = compile(
        &format!(
            "{USER}pub fn f(user1: User) -> usize {{ let user2 = User {{ email: String::new(), username: String::new(), ..user1 }}; let _ = user2; let whole = user1; whole.email.len() }}"
        ),
        false,
        &[],
    );
    assert!(!e.contains("error"), "{e}");

    // 3. self 세 가지
    let mut c = Counter::new();
    assert_eq!(c.get(), 0);
    assert_eq!(c.bump(), 1);
    assert_eq!(c.bump(), 2);
    let s = c.finish();
    assert_eq!(s, "최종 2");
    let d = Counter::default();
    assert_eq!(d.get(), 0);
    println!("{d:?}");

    // finish(self) 뒤에 c를 쓰면 E0382
    let e = compile(
        "pub struct C { n: u32 }\nimpl C { pub fn finish(self) -> u32 { self.n } pub fn get(&self) -> u32 { self.n } }\npub fn f(c: C) -> u32 { let a = c.finish(); a + c.get() }",
        false,
        &[],
    );
    assert!(e.contains("E0382"), "{e}");
    println!("소비하는 메서드 뒤 사용: E0382");

    // 불변 변수에서 &mut self 메서드를 부르면 E0596
    let e = compile(
        "pub struct C { n: u32 }\nimpl C { pub fn bump(&mut self) { self.n += 1; } }\npub fn f() { let c = C { n: 0 }; c.bump(); }",
        false,
        &[],
    );
    assert!(e.contains("E0596"), "{e}");
    println!("let c에서 &mut self 메서드: E0596");

    // 4. 튜플 구조체: 필드 타입이 같아도 서로 다른 타입이다.
    let e = compile(
        "pub struct Meters(pub f64);\npub struct Seconds(pub f64);\npub fn run(d: Meters) -> f64 { d.0 }\npub fn f() -> f64 { run(Seconds(3.0)) }",
        false,
        &[],
    );
    assert!(e.contains("E0308"), "{e}");
    println!("Seconds를 Meters 자리에: E0308");
    let m = Meters(5.0);
    assert_eq!(m.0, 5.0);

    // 5. 유닛 구조체는 크기가 0
    let _a = AlwaysEqual;
    assert_eq!(size_of::<AlwaysEqual>(), 0);
    assert_eq!(size_of::<Meters>(), size_of::<f64>());

    // 5-1. 기본 배치는 순서를 바꿀 수 있다(관찰값), repr(C)는 선언 순서
    struct Loose {
        _a: u8,
        _b: u32,
        _c: u8,
    }
    #[repr(C)]
    struct LooseC {
        _a: u8,
        _b: u32,
        _c: u8,
    }
    println!(
        "Loose {} 바이트, repr(C) {} 바이트",
        size_of::<Loose>(),
        size_of::<LooseC>()
    );
    assert_eq!(size_of::<Loose>(), 8);
    assert_eq!(size_of::<LooseC>(), 12);

    // 6. derive(Debug) 출력 모양
    let p = Counter { count: 3 };
    assert_eq!(format!("{p:?}"), "Counter { count: 3 }");
    assert_eq!(format!("{p:#?}"), "Counter {\n    count: 3,\n}");

    // derive(PartialEq): 필드를 모두 비교한다
    let a = build_user("a".into(), "b".into());
    let b = a.clone();
    assert_eq!(a, b);

    // 7. 자동 참조: c.get()은 Counter::get(&c)와 같다.
    let c2 = Counter { count: 7 };
    assert_eq!(Counter::get(&c2), c2.get());

    // 8. clippy: pub fn new() -> Self 가 있고 Default가 없으면 new_without_default (기본 켜짐)
    let e = compile(
        "pub struct C { n: u32 }\nimpl C { pub fn new() -> Self { C { n: 0 } } pub fn n(&self) -> u32 { self.n } }",
        true,
        &[],
    );
    assert!(e.contains("clippy::new_without_default"), "{e}");
    println!("clippy::new_without_default 기본으로 경고");

    // clippy: Default로 만든 뒤 바로 필드를 다시 넣으면 field_reassign_with_default (기본 켜짐)
    let e = compile(
        "#[derive(Default)] pub struct Cfg { pub a: u32, pub b: u32 }\npub fn f() -> Cfg { let mut c = Cfg::default(); c.a = 1; c }",
        true,
        &[],
    );
    assert!(e.contains("clippy::field_reassign_with_default"), "{e}");
    println!("clippy::field_reassign_with_default 기본으로 경고");

    // 9. 확인 문제 C3의 실행 추적
    let mut t = Counter::new();
    t.bump();
    let snapshot = t.get();
    t.bump();
    t.bump();
    let out = format!("{snapshot} {} {}", t.get(), t.finish());
    println!("C3: {out}");
    assert_eq!(out, "1 3 최종 3");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
