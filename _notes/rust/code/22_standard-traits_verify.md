---
layout: "note"
title: "22_standard-traits_verify.rs"
display_title: "22_standard-traits_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/standard-traits/"
parent_title: "꼭 구현할 표준 트레이트"
description: "Rust · 꼭 구현할 표준 트레이트 검증 코드"
sitemap: false
permalink: "/studies/rust/code/22_standard-traits_verify/"
---
{% raw %}
[꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/) 문서의 검증 코드다.

```rust
//! 22 꼭 구현할 표준 트레이트: derive 결과(Debug·Clone·Copy·PartialEq·Eq·PartialOrd·Ord·Hash·Default),
//! 파생 Ord의 필드 순서 규칙, 막히는 derive(E0277·E0204·E0184)와 f64·String 필드에 붙는 묶음, Display와 to_string,
//! From·Into·TryFrom, AsRef, Send·Sync 확인, 그리고 Eq와 Hash가 어긋나면 HashMap이 같은 키를 못 찾는 반례와 clippy 린트
//! (from_over_into, derived_hash_with_manual_eq, derive_ord_xor_partial_ord)를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/22_standard-traits_verify.rs"

use std::collections::{HashMap, HashSet};
use std::fmt;
use std::hash::{BuildHasherDefault, DefaultHasher, Hash, Hasher};
use std::sync::atomic::{AtomicUsize, Ordering};

static SNIPPET: AtomicUsize = AtomicUsize::new(0);

/// rustc 또는 clippy-driver로 코드 조각을 컴파일해 stderr를 돌려준다.
fn compile_with(tool: &str, code: &str) -> String {
    let n = SNIPPET.fetch_add(1, Ordering::Relaxed);
    let dir = std::env::temp_dir().join(format!("vr22_{}_{}", std::process::id(), n));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new(tool)
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
        .expect("컴파일러 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn expect(label: &str, tool: &str, code: &str, needle: &str) {
    let e = compile_with(tool, code);
    let first = e
        .lines()
        .find(|l| l.starts_with("error") || l.starts_with("warning"))
        .unwrap_or("(오류 없음)");
    println!("[{label}] {first}");
    assert!(e.contains(needle), "{label}: {e}");
}

// 1. 흔한 derive 묶음
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Default)]
struct Version {
    major: u16,
    minor: u16,
    patch: u16,
}

// 필드 순서가 정렬 순서를 정한다.
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct ByAge {
    age: u8,
    name: &'static str,
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct ByName {
    name: &'static str,
    age: u8,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Default)]
enum Level {
    Low,
    #[default]
    Mid,
    High,
}

impl fmt::Display for Version {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "v{}.{}.{}", self.major, self.minor, self.patch)
    }
}

// 2. From·TryFrom
#[derive(Debug, PartialEq)]
struct Celsius(f64);

#[derive(Debug, PartialEq)]
struct Fahrenheit(f64);

impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Self {
        Fahrenheit(c.0 * 9.0 / 5.0 + 32.0)
    }
}

#[derive(Debug, PartialEq)]
struct Percent(u8);

impl TryFrom<i32> for Percent {
    type Error = String;
    fn try_from(v: i32) -> Result<Self, Self::Error> {
        if (0..=100).contains(&v) {
            Ok(Percent(v as u8))
        } else {
            Err(format!("0~100 밖의 값: {v}"))
        }
    }
}

// 3. AsRef: String과 &str을 모두 받는다.
fn shout<S: AsRef<str>>(s: S) -> String {
    s.as_ref().to_uppercase()
}

// 4. Eq와 Hash가 어긋난 키 (반례): 같다고 하면서 해시는 다르게 낸다.
struct BrokenKey(String);

impl PartialEq for BrokenKey {
    fn eq(&self, other: &Self) -> bool {
        self.0.eq_ignore_ascii_case(&other.0)
    }
}
impl Eq for BrokenKey {}

impl Hash for BrokenKey {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.hash(state); // 대소문자를 그대로 해시한다 -> 규칙 위반
    }
}

// 고친 키: 같다고 판단하는 기준(소문자)으로 해시한다.
struct FixedKey(String);

impl PartialEq for FixedKey {
    fn eq(&self, other: &Self) -> bool {
        self.0.eq_ignore_ascii_case(&other.0)
    }
}
impl Eq for FixedKey {}

impl Hash for FixedKey {
    fn hash<H: Hasher>(&self, state: &mut H) {
        for b in self.0.bytes() {
            state.write_u8(b.to_ascii_lowercase());
        }
        state.write_u8(0xff);
    }
}

fn assert_send_sync<T: Send + Sync>() {}

fn main() {
    // 1. derive 결과
    let v = Version {
        major: 1,
        minor: 2,
        patch: 3,
    };
    let w = v; // Copy라서 v를 계속 쓸 수 있다
    assert_eq!(v, w);
    println!("{v:?}");
    println!("{v:#?}");
    assert_eq!(format!("{v:?}"), "Version { major: 1, minor: 2, patch: 3 }");
    assert_eq!(
        Version::default(),
        Version {
            major: 0,
            minor: 0,
            patch: 0
        }
    );
    let mut vs = [
        Version {
            major: 1,
            minor: 10,
            patch: 0,
        },
        Version {
            major: 1,
            minor: 2,
            patch: 9,
        },
        Version {
            major: 0,
            minor: 99,
            patch: 99,
        },
    ];
    vs.sort();
    let shown: Vec<String> = vs.iter().map(|v| v.to_string()).collect();
    println!("정렬: {shown:?}");
    assert_eq!(shown, ["v0.99.99", "v1.2.9", "v1.10.0"]);

    let a1 = ByAge {
        age: 30,
        name: "kim",
    };
    let a2 = ByAge {
        age: 20,
        name: "lee",
    };
    let n1 = ByName {
        name: "kim",
        age: 30,
    };
    let n2 = ByName {
        name: "lee",
        age: 20,
    };
    println!(
        "ByAge: kim(30) < lee(20)? {}, ByName: kim(30) < lee(20)? {}",
        a1 < a2,
        n1 < n2
    );
    assert!(a1 > a2);
    assert!(n1 < n2);

    assert!(Level::Low < Level::High);
    assert_eq!(Level::default(), Level::Mid);
    let mut lv = [Level::High, Level::Low, Level::Mid];
    lv.sort();
    assert_eq!(lv, [Level::Low, Level::Mid, Level::High]);

    let set: HashSet<Version> = [v, w].into_iter().collect();
    assert_eq!(set.len(), 1);

    // 0. 아무것도 붙이지 않은 타입은 ==도 {:?}도 안 된다.
    let bare = compile_with(
        "rustc",
        "pub struct V(pub u8);
         pub fn f(a: V, b: V) -> bool { a == b }
         pub fn g(a: V) -> String { format!(\"{a:?}\") }",
    );
    println!(
        "[아무 트레이트도 없는 타입] {}",
        bare.lines().find(|l| l.starts_with("error")).unwrap()
    );
    assert!(bare.contains("error[E0369]: binary operation `==` cannot be applied to type `V`"));
    assert!(bare.contains("error[E0277]: `V` doesn't implement `Debug`"));

    // assert_eq!는 ==로 비교하고, 다르면 {:?}로 찍는다: PartialEq만 있으면 막힌다.
    expect(
        "PartialEq만 있는 타입에 assert_eq!",
        "rustc",
        "#[derive(PartialEq)] pub struct V(pub u8);
         pub fn f() { assert_eq!(V(1), V(1)); }",
        "error[E0277]: `V` doesn't implement `Debug`",
    );

    // 2. 막히는 derive
    expect(
        "f64 필드에 Eq derive",
        "rustc",
        "#[derive(PartialEq, Eq)] pub struct P { pub x: f64 }",
        "error[E0277]",
    );
    expect(
        "String 필드에 Copy derive",
        "rustc",
        "#[derive(Clone, Copy)] pub struct N { pub s: String }",
        "error[E0204]",
    );
    expect(
        "Drop이 있는 타입에 Copy",
        "rustc",
        "#[derive(Clone, Copy)] pub struct G;
         impl Drop for G { fn drop(&mut self) {} }",
        "error[E0184]",
    );
    expect(
        "f64 필드에 Hash derive",
        "rustc",
        "#[derive(Hash)] pub struct P { pub x: f64 }",
        "error[E0277]: the trait bound `f64: Hash` is not satisfied",
    );
    expect(
        "f64 필드에 Ord derive",
        "rustc",
        "#[derive(PartialEq, PartialOrd, Ord)] pub struct P { pub x: f64 }",
        "error[E0277]: the trait bound `f64: Ord` is not satisfied",
    );
    // f64와 String이 섞인 타입에 붙일 수 있는 묶음
    let ok = compile_with(
        "rustc",
        "#[derive(Debug, Clone, PartialEq, PartialOrd, Default)]
         pub struct Price { pub amount: f64, pub currency: String }",
    );
    println!(
        "[f64·String 필드에 Debug·Clone·PartialEq·PartialOrd·Default] {}",
        if ok.contains("error") {
            "오류"
        } else {
            "(오류 없음)"
        }
    );
    assert!(!ok.contains("error"), "{ok}");
    expect(
        "Display는 derive할 수 없다",
        "rustc",
        "#[derive(Display)] pub struct D;",
        "error",
    );
    // NaN은 자기 자신과도 같지 않다(비교 결과 자체가 없다). 그래서 f64는 Eq가 아니다.
    let nan = std::hint::black_box(f64::NAN);
    assert!(nan.partial_cmp(&nan).is_none());

    // 3. Display와 to_string, From·Into·TryFrom, AsRef
    assert_eq!(v.to_string(), "v1.2.3");
    let f: Fahrenheit = Celsius(100.0).into(); // From만 구현했는데 into가 생긴다
    assert_eq!(f, Fahrenheit(212.0));
    assert_eq!(Percent::try_from(42), Ok(Percent(42)));
    assert_eq!(
        Percent::try_from(150),
        Err("0~100 밖의 값: 150".to_string())
    );
    let p: Result<Percent, _> = (-1).try_into();
    assert!(p.is_err());
    assert_eq!(shout("abc"), "ABC");
    assert_eq!(shout(String::from("xy")), "XY");
    expect(
        "Into를 직접 구현하면 clippy가 From을 권한다",
        "clippy-driver",
        "pub struct W(pub i32);
         impl Into<i32> for W { fn into(self) -> i32 { self.0 } }",
        "an implementation of `From` is preferred",
    );

    // Borrow의 약속: String과 그 &str은 같은 해시를 낸다. 그래서 String 키 맵을 &str로 찾는다.
    let hash_of = |x: &dyn Fn(&mut DefaultHasher)| {
        let mut h = DefaultHasher::new();
        x(&mut h);
        h.finish()
    };
    let owned = String::from("abc");
    assert_eq!(hash_of(&|h| owned.hash(h)), hash_of(&|h| "abc".hash(h)));
    let by_name: HashMap<String, i32> = [(owned.clone(), 7)].into_iter().collect();
    assert_eq!(by_name.get("abc"), Some(&7));

    // 4. Send·Sync는 컴파일러가 알아서 붙인다.
    assert_send_sync::<Version>();
    assert_send_sync::<String>();
    expect(
        "Rc는 Send가 아니다",
        "rustc",
        "fn need_send<T: Send>() {}
         pub fn f() { need_send::<std::rc::Rc<u8>>(); }",
        "error[E0277]",
    );

    // 5. Eq와 Hash가 어긋나면: 같다고 하는 키를 HashMap이 못 찾는다.
    assert!(BrokenKey("Kim".into()) == BrokenKey("KIM".into()));
    // 해시 키를 고정해(DefaultHasher::new) 실행할 때마다 같은 결과가 나오게 한다.
    let mut broken: HashMap<BrokenKey, i32, BuildHasherDefault<DefaultHasher>> = HashMap::default();
    broken.insert(BrokenKey("Kim".into()), 1);
    let found_broken = broken.get(&BrokenKey("KIM".into())).copied();
    broken.insert(BrokenKey("KIM".into()), 2);
    println!(
        "어긋난 키: get(\"KIM\") = {:?}, 같은 키를 두 번 넣은 뒤 len = {}",
        found_broken,
        broken.len()
    );
    assert_eq!(found_broken, None);
    assert_eq!(broken.len(), 2);

    let mut fixed: HashMap<FixedKey, i32, BuildHasherDefault<DefaultHasher>> = HashMap::default();
    fixed.insert(FixedKey("Kim".into()), 1);
    let found_fixed = fixed.get(&FixedKey("KIM".into())).copied();
    fixed.insert(FixedKey("KIM".into()), 2);
    println!(
        "고친 키: get(\"KIM\") = {:?}, 다시 넣은 뒤 len = {}",
        found_fixed,
        fixed.len()
    );
    assert_eq!(found_fixed, Some(1));
    assert_eq!(fixed.len(), 1);

    expect(
        "Hash는 derive, PartialEq는 손으로",
        "clippy-driver",
        "#[derive(Hash, Eq)] pub struct K(pub String);
         impl PartialEq for K { fn eq(&self, o: &Self) -> bool { self.0.eq_ignore_ascii_case(&o.0) } }",
        "you are deriving `Hash` but have implemented `PartialEq` explicitly",
    );

    expect(
        "PartialOrd는 derive, Ord는 손으로",
        "clippy-driver",
        "use std::cmp::Ordering;
         #[derive(PartialEq, Eq, PartialOrd)] pub struct A(pub i32);
         impl Ord for A { fn cmp(&self, o: &Self) -> Ordering { o.0.cmp(&self.0) } }",
        "you are implementing `Ord` explicitly but have derived `PartialOrd`",
    );

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
