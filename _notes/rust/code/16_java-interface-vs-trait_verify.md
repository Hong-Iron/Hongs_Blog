---
layout: "note"
title: "16_java-interface-vs-trait_verify.rs"
display_title: "16_java-interface-vs-trait_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/java-interface-vs-trait/"
parent_title: "Java 인터페이스 ↔ 트레이트"
description: "Rust · Java 인터페이스 ↔ 트레이트 검증 코드"
permalink: "/studies/rust/code/16_java-interface-vs-trait_verify/"
---
{% raw %}
[Java 인터페이스 ↔ 트레이트](/Hongs_Blog/studies/rust/java-interface-vs-trait/) 문서의 검증 코드다.

```rust
//! 16 Java 인터페이스 ↔ 트레이트: Java 문서의 RemoteControl 예를 트레이트로 옮기고, 같은 점과 다른 점을 확인한다.
//! 남의 타입에 내 트레이트 붙이기, 필드 없음, 기본 메서드 이름 충돌(E0034), 변수 타입이 부를 수 있는 메서드를 정함(E0599),
//! 슈퍼트레이트와 업캐스팅(1.86), 정적 디스패치 기본값, 연관 상수.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/16_java-interface-vs-trait_verify.rs"

use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

fn compile_errors(code: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::Relaxed);
    let dir = std::env::temp_dir().join(format!("vr16_{}_{}", std::process::id(), n));
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

fn expect_error(label: &str, code: &str, needle: &str) {
    let e = compile_errors(code);
    let first = e
        .lines()
        .find(|l| l.starts_with("error"))
        .unwrap_or("(오류 없음)");
    println!("[{label}] {first}");
    assert!(e.contains(needle), "{label}: {e}");
}

// Java의 interface RemoteControl { int MAX_VOLUME = 10; void turnOn(); void turnOff(); }
trait RemoteControl {
    fn turn_on(&self) -> String;
    fn turn_off(&self) -> String;
    // Java의 default 메서드에 해당한다.
    fn restart(&self) -> String {
        format!("{} / {}", self.turn_off(), self.turn_on())
    }
}

// Java 인터페이스의 상수 필드는 연관 상수로 옮긴다. 연관 상수가 있는 트레이트는 dyn으로 못 쓰므로 따로 둔다.
trait Volume {
    const MAX_VOLUME: u8 = 10;
}

struct Television;
struct Lights;

impl Volume for Television {}
impl Volume for Lights {
    const MAX_VOLUME: u8 = 0;
}

impl RemoteControl for Television {
    fn turn_on(&self) -> String {
        "Turn on TV".to_string()
    }
    fn turn_off(&self) -> String {
        "Turn off TV".to_string()
    }
}

impl RemoteControl for Lights {
    fn turn_on(&self) -> String {
        "Turn on lights".to_string()
    }
    fn turn_off(&self) -> String {
        "Turn off lights".to_string()
    }
}

// Java에서는 String에 내 인터페이스를 붙일 수 없다. Rust는 내 트레이트라면 남의 타입에도 붙인다.
trait Shouty {
    fn shouty(&self) -> String;
}

impl Shouty for String {
    fn shouty(&self) -> String {
        self.to_uppercase()
    }
}

// 정적 디스패치: 타입마다 함수가 따로 만들어진다.
fn press_static(rc: &impl RemoteControl) -> String {
    rc.turn_on()
}

// 동적 디스패치: Java의 인터페이스 변수처럼 실행 중에 고른다.
fn press_dyn(rc: &dyn RemoteControl) -> String {
    rc.turn_on()
}

// 인터페이스 상속에 해당하는 슈퍼트레이트
trait Searchable {
    fn search(&self, q: &str) -> String;
}

trait SmartDevice: RemoteControl + Searchable {}

struct SmartTelevision;

impl RemoteControl for SmartTelevision {
    fn turn_on(&self) -> String {
        "Turn on TV".to_string()
    }
    fn turn_off(&self) -> String {
        "Turn off TV".to_string()
    }
}

impl Searchable for SmartTelevision {
    fn search(&self, q: &str) -> String {
        format!("Search: {q}")
    }
}

impl SmartDevice for SmartTelevision {}

// 기본 메서드 이름이 겹칠 때
trait Walker {
    fn hello(&self) -> &'static str {
        "Walker hello"
    }
}

trait Talker {
    fn hello(&self) -> &'static str {
        "Talker hello"
    }
}

struct Robot;
impl Walker for Robot {}
impl Talker for Robot {}

fn main() {
    // 1. 같은 호출이 든 값에 따라 다른 일을 한다 (Java 문서 C4와 같은 배열)
    let rcs: Vec<Box<dyn RemoteControl>> =
        vec![Box::new(Lights), Box::new(Television), Box::new(Lights)];
    let out: Vec<String> = rcs.iter().map(|rc| rc.turn_on()).collect();
    println!("{out:?}");
    assert_eq!(out, ["Turn on lights", "Turn on TV", "Turn on lights"]);

    // 2. 기본 메서드
    assert_eq!(Television.restart(), "Turn off TV / Turn on TV");

    // 3. 연관 상수: 구현마다 값을 바꿀 수 있다 (Java 인터페이스 상수는 하나뿐).
    println!(
        "MAX_VOLUME: TV {}, Lights {}",
        Television::MAX_VOLUME,
        Lights::MAX_VOLUME
    );
    assert_eq!(
        (
            <Television as Volume>::MAX_VOLUME,
            <Lights as Volume>::MAX_VOLUME
        ),
        (10, 0)
    );

    expect_error(
        "연관 상수가 있는 트레이트를 dyn으로 사용",
        "pub trait RemoteControl { const MAX_VOLUME: u8 = 10; fn on(&self); }
         pub fn f(_x: &dyn RemoteControl) {}",
        "error[E0038]",
    );

    // 4. 남의 타입(String)에 내 트레이트
    assert_eq!(String::from("abc").shouty(), "ABC");

    // 5. 정적·동적 디스패치 모두 같은 결과. 포인터 크기는 다르다.
    assert_eq!(press_static(&Lights), press_dyn(&Lights));
    let w = std::mem::size_of::<usize>();
    assert_eq!(std::mem::size_of::<&Lights>(), w);
    assert_eq!(std::mem::size_of::<&dyn RemoteControl>(), 2 * w);
    println!(
        "&Lights {}바이트, &dyn RemoteControl {}바이트",
        std::mem::size_of::<&Lights>(),
        std::mem::size_of::<&dyn RemoteControl>()
    );

    // 6. 슈퍼트레이트와 업캐스팅
    let tv = SmartTelevision;
    let smart: &dyn SmartDevice = &tv;
    let rc: &dyn RemoteControl = smart; // 1.86부터 되는 업캐스팅
    let sc: &dyn Searchable = smart;
    assert_eq!(rc.turn_on(), "Turn on TV");
    assert_eq!(sc.search("rust"), "Search: rust");
    expect_error(
        "슈퍼트레이트 하나를 빠뜨림",
        "pub trait A { fn a(&self); } pub trait B { fn b(&self); }
         pub trait C: A + B {}
         pub struct X;
         impl A for X { fn a(&self) {} }
         impl C for X {}",
        "error[E0277]",
    );
    expect_error(
        "변수 타입에 없는 메서드 호출",
        "pub trait A { fn a(&self); } pub trait B { fn b(&self); }
         pub fn f(x: &dyn A) { x.b(); }",
        "error[E0599]",
    );

    // 7. 기본 메서드 이름 충돌: 부를 때 모호하다. 어느 트레이트인지 적으면 풀린다.
    expect_error(
        "두 트레이트의 같은 이름 메서드를 그냥 부름",
        "pub trait Walker { fn hello(&self) -> u8 { 1 } }
         pub trait Talker { fn hello(&self) -> u8 { 2 } }
         pub struct Robot; impl Walker for Robot {} impl Talker for Robot {}
         pub fn f() -> u8 { Robot.hello() }",
        "error[E0034]",
    );
    let r = Robot;
    println!("{} / {}", Walker::hello(&r), <Robot as Talker>::hello(&r));
    assert_eq!(Walker::hello(&r), "Walker hello");
    assert_eq!(<Robot as Talker>::hello(&r), "Talker hello");

    // 8. 트레이트에는 필드를 둘 수 없다.
    expect_error(
        "트레이트에 필드 선언",
        "pub trait Counter { count: u32; }",
        "error",
    );

    // 9. 트레이트로는 값을 만들 수 없다 (Java의 new RemoteControl()에 해당).
    expect_error(
        "트레이트를 값처럼 사용",
        "pub trait RemoteControl { fn on(&self); }
         pub fn f() { let _x = RemoteControl; }",
        "error",
    );

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
