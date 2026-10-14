---
layout: "note"
title: "14_type-driven-design_verify.rs"
display_title: "14_type-driven-design_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/type-driven-design/"
parent_title: "타입으로 잘못된 상태 막기"
description: "Rust · 타입으로 잘못된 상태 막기 검증 코드"
sitemap: false
permalink: "/studies/rust/code/14_type-driven-design_verify/"
---
{% raw %}
[타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/) 문서의 검증 코드다.

```rust
//! 타입으로 잘못된 상태 막기 문서의 주장을 확인한다: 뉴타입 섞임 막기(E0308), 검사하는 생성자와
//! 닫힌 필드(E0451), TryFrom·FromStr, bool 대신 열거형 상태, PhantomData 상태 표시(타입 상태)와
//! 없는 메서드(E0599)·소비된 값(E0382), 크기 0 표시와 NonZero.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/14_type-driven-design_verify.rs"

use std::marker::PhantomData;
use std::mem::size_of;
use std::num::NonZero;
use std::str::FromStr;

mod domain {
    /// 검사를 통과한 이메일만 담는다. 필드가 닫혀 있어 바깥에서 직접 만들 수 없다.
    #[derive(Debug, Clone, PartialEq, Eq, Hash)]
    pub struct Email {
        value: String,
    }

    #[derive(Debug, PartialEq, Eq)]
    pub enum EmailError {
        Empty,
        MissingAt,
        BadDomain,
    }

    impl Email {
        pub fn parse(raw: &str) -> Result<Self, EmailError> {
            let s = raw.trim();
            if s.is_empty() {
                return Err(EmailError::Empty);
            }
            let Some((local, domain)) = s.split_once('@') else {
                return Err(EmailError::MissingAt);
            };
            if local.is_empty() || !domain.contains('.') || domain.starts_with('.') {
                return Err(EmailError::BadDomain);
            }
            Ok(Self {
                value: s.to_ascii_lowercase(),
            })
        }

        pub fn as_str(&self) -> &str {
            &self.value
        }
    }

    impl TryFrom<&str> for Email {
        type Error = EmailError;
        fn try_from(raw: &str) -> Result<Self, Self::Error> {
            Email::parse(raw)
        }
    }
}

use domain::{Email, EmailError};

#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]
struct Meters(f64);

impl FromStr for Meters {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let v: f64 = s
            .trim()
            .trim_end_matches('m')
            .parse()
            .map_err(|_| format!("길이 아님: {s}"))?;
        if v.is_finite() && v >= 0.0 {
            Ok(Meters(v))
        } else {
            Err(format!("음수나 무한대: {s}"))
        }
    }
}

/// bool 두 개(connected, authenticated) 대신 상태 셋
#[derive(Debug, PartialEq)]
enum Conn {
    Disconnected,
    Connected { peer: String },
    Authenticated { peer: String, user: String },
}

impl Conn {
    fn login(self, user: &str) -> Result<Conn, (Conn, &'static str)> {
        match self {
            Conn::Connected { peer } => Ok(Conn::Authenticated {
                peer,
                user: user.to_string(),
            }),
            other => Err((other, "연결된 상태에서만 로그인할 수 있다")),
        }
    }
}

// 타입 상태: 크기 0짜리 표시 타입으로 문의 상태를 타입에 적는다.
struct Open;
struct Closed;

struct Door<State> {
    opened_count: u32,
    _state: PhantomData<State>,
}

impl Door<Closed> {
    fn new() -> Self {
        Door {
            opened_count: 0,
            _state: PhantomData,
        }
    }
    fn open(self) -> Door<Open> {
        Door {
            opened_count: self.opened_count + 1,
            _state: PhantomData,
        }
    }
}

impl Door<Open> {
    fn close(self) -> Door<Closed> {
        Door {
            opened_count: self.opened_count,
            _state: PhantomData,
        }
    }
}

impl<S> Door<S> {
    fn opened_count(&self) -> u32 {
        self.opened_count
    }
}

fn compile(code: &str, tag: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr14_{}_{}", std::process::id(), tag));
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

const DOOR: &str = "use std::marker::PhantomData;\npub struct Open; pub struct Closed;\npub struct Door<S> { _s: PhantomData<S> }\nimpl Door<Closed> { pub fn new() -> Self { Door { _s: PhantomData } } pub fn open(self) -> Door<Open> { Door { _s: PhantomData } } }\nimpl Door<Open> { pub fn close(self) -> Door<Closed> { Door { _s: PhantomData } } }\n";

fn main() {
    // 1. 뉴타입: 같은 f64라도 섞이지 않는다
    let e = compile(
        "pub struct Miles(pub f64);\npub struct Kilometers(pub f64);\npub fn drive(_d: Miles) {}\npub fn f() { drive(Kilometers(3.0)); }",
        "newtype",
    );
    assert!(e.contains("E0308"), "{e}");
    println!("Kilometers를 Miles 자리에: E0308");
    assert_eq!(size_of::<Meters>(), size_of::<f64>());
    assert_eq!("12.5m".parse::<Meters>(), Ok(Meters(12.5)));
    assert!("-3".parse::<Meters>().is_err());
    assert!("abc".parse::<Meters>().is_err());

    // 2. 검사하는 생성자
    let ok = Email::parse("  Ann@Example.com ").unwrap();
    assert_eq!(ok.as_str(), "ann@example.com");
    assert_eq!(Email::parse(""), Err(EmailError::Empty));
    assert_eq!(Email::parse("ann.example.com"), Err(EmailError::MissingAt));
    assert_eq!(Email::parse("ann@localhost"), Err(EmailError::BadDomain));
    assert_eq!(Email::parse("@x.com"), Err(EmailError::BadDomain));
    let via_try: Result<Email, _> = "b@x.org".try_into();
    assert!(via_try.is_ok());

    // 바깥 모듈에서 닫힌 필드로 직접 만들면 E0451
    let e = compile(
        "mod d { pub struct Email { value: String } impl Email { pub fn as_str(&self) -> &str { &self.value } } }\npub fn f() -> usize { let e = d::Email { value: String::new() }; e.as_str().len() }",
        "private",
    );
    assert!(e.contains("E0451"), "{e}");
    println!("닫힌 필드로 직접 만들기: E0451");

    // 3. bool 대신 열거형 상태
    let c = Conn::Connected {
        peer: "10.0.0.1".into(),
    };
    let c = c.login("ann").unwrap();
    assert_eq!(
        c,
        Conn::Authenticated {
            peer: "10.0.0.1".into(),
            user: "ann".into()
        }
    );
    let (back, why) = Conn::Disconnected.login("ann").unwrap_err();
    assert_eq!(back, Conn::Disconnected);
    println!("Disconnected에서 login: {why}");

    // 4. 타입 상태
    let door = Door::<Closed>::new();
    let door = door.open();
    let door = door.close();
    let door = door.open();
    println!("문을 연 횟수 {}", door.opened_count());
    assert_eq!(door.opened_count(), 2);
    // 표시 타입은 크기를 더하지 않는다
    assert_eq!(size_of::<PhantomData<Open>>(), 0);
    assert_eq!(size_of::<Open>(), 0);
    assert_eq!(size_of::<Door<Open>>(), size_of::<u32>());

    // PhantomData 없이 타입 인자만 두면 E0392
    let e = compile("pub struct Door<S> { pub n: u32 }", "e0392");
    assert!(e.contains("E0392"), "{e}");
    println!("쓰이지 않은 타입 인자: E0392");

    // 열린 문을 또 열면 E0599 (그런 메서드가 없다)
    let e = compile(
        &format!("{DOOR}pub fn f() {{ let d = Door::<Closed>::new().open(); let _ = d.open(); }}"),
        "twice",
    );
    assert!(e.contains("E0599"), "{e}");
    println!("열린 문을 또 open: E0599");
    // 바꾼 뒤 옛 값을 쓰면 E0382
    let e = compile(
        &format!(
            "{DOOR}pub fn f() {{ let d = Door::<Closed>::new(); let o = d.open(); let _ = o.close(); let _ = d.open(); }}"
        ),
        "used",
    );
    assert!(e.contains("E0382"), "{e}");
    println!("바뀌기 전 상태를 다시 쓰기: E0382");

    // 5. NonZero
    assert_eq!(NonZero::new(0u32), None);
    let n = NonZero::new(8u32).unwrap();
    assert_eq!(n.get(), 8);
    assert_eq!(size_of::<Option<NonZero<u32>>>(), 4);

    // 6. 확인 문제 C3 실행 추적
    let inputs = [" Kim@Corp.io", "lee@corp", "", "park@corp.io"];
    let out: Vec<String> = inputs
        .iter()
        .map(|s| match Email::parse(s) {
            Ok(e) => e.as_str().to_string(),
            Err(err) => format!("{err:?}"),
        })
        .collect();
    println!("C3: {}", out.join(" | "));
    assert_eq!(
        out.join(" | "),
        "kim@corp.io | BadDomain | Empty | park@corp.io"
    );

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
