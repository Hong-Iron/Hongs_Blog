---
layout: "note"
title: "49_api-design_verify.rs"
display_title: "49_api-design_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "49"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/api-design/"
parent_title: "API 설계 원칙"
description: "Rust · API 설계 원칙 검증 코드"
permalink: "/studies/rust/code/49_api-design_verify/"
---
{% raw %}
[API 설계 원칙](/Hongs_Blog/studies/rust/api-design/) 문서의 검증 코드다.

```rust
//! 49 API 설계 원칙: 소비형 빌더와 #[must_use], 봉인 트레이트(다른 크레이트에서 구현하면 E0277),
//! 라이브러리를 고친 뒤 쓰는 쪽이 깨지는 경우(E0046·E0004·E0063·E0034·E0639)와 그것을 막는 설계,
//! 이름 규칙 린트(wrong_self_convention과 avoid-breaking-exported-api)를 rustc·clippy-driver로 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/49_api-design_verify.rs"

use std::error::Error;
use std::fmt;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::time::Duration;

// ---------- 1. 소비형 빌더 ----------

/// 서버 설정. 필드는 닫혀 있고 빌더로만 만든다(C-STRUCT-PRIVATE, C-BUILDER).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ServerConfig {
    addr: String,
    timeout: Duration,
    max_body_bytes: usize,
}

impl ServerConfig {
    /// 꼭 있어야 하는 값(주소)은 빌더를 만들 때 받는다. 나머지는 기본값이 있다.
    pub fn builder(addr: impl Into<String>) -> ServerConfigBuilder {
        ServerConfigBuilder {
            addr: addr.into(),
            timeout: Duration::from_secs(30),
            max_body_bytes: 1024 * 1024,
        }
    }

    /// `get_addr`가 아니다(C-GETTER).
    pub fn addr(&self) -> &str {
        &self.addr
    }

    pub fn timeout(&self) -> Duration {
        self.timeout
    }

    pub fn max_body_bytes(&self) -> usize {
        self.max_body_bytes
    }
}

/// 타입에 붙인 `#[must_use]`: 빌더를 만들고 버리면 경고가 난다.
#[derive(Debug, Clone)]
#[must_use = "빌더는 build()를 불러야 설정이 된다"]
pub struct ServerConfigBuilder {
    addr: String,
    timeout: Duration,
    max_body_bytes: usize,
}

impl ServerConfigBuilder {
    pub fn timeout(mut self, timeout: Duration) -> Self {
        self.timeout = timeout;
        self
    }

    pub fn max_body_bytes(mut self, n: usize) -> Self {
        self.max_body_bytes = n;
        self
    }

    /// 검사는 마지막에 한 번 한다.
    pub fn build(self) -> Result<ServerConfig, BuildError> {
        if self.addr.is_empty() {
            return Err(BuildError::EmptyAddr);
        }
        if self.timeout.is_zero() {
            return Err(BuildError::ZeroTimeout);
        }
        if self.max_body_bytes == 0 {
            return Err(BuildError::ZeroBodyLimit);
        }
        Ok(ServerConfig {
            addr: self.addr,
            timeout: self.timeout,
            max_body_bytes: self.max_body_bytes,
        })
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[non_exhaustive]
pub enum BuildError {
    EmptyAddr,
    ZeroTimeout,
    ZeroBodyLimit,
}

impl fmt::Display for BuildError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let msg = match self {
            BuildError::EmptyAddr => "address is empty",
            BuildError::ZeroTimeout => "timeout must be greater than zero",
            BuildError::ZeroBodyLimit => "body limit must be greater than zero",
        };
        f.write_str(msg)
    }
}

impl Error for BuildError {}

fn assert_good_error<E: Error + Send + Sync + 'static>() {}
fn assert_send_sync<T: Send + Sync>() {}

// ---------- 2. 봉인 트레이트 ----------

mod private {
    pub trait Sealed {}
}

/// 짧은 코드를 만드는 방식. 봉인되어 있어 이 크레이트 밖에서는 구현할 수 없다(C-SEALED).
pub trait Codec: private::Sealed {
    fn encode(&self, n: u64) -> String;
}

pub struct Base62;
pub struct Decimal;

impl private::Sealed for Base62 {}
impl private::Sealed for Decimal {}

const ALPHABET: &[u8; 62] = b"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

impl Codec for Base62 {
    fn encode(&self, mut n: u64) -> String {
        if n == 0 {
            return "0".to_string();
        }
        let mut out = Vec::new();
        while n > 0 {
            out.push(ALPHABET[usize::try_from(n % 62).expect("62 미만")]);
            n /= 62;
        }
        out.reverse();
        String::from_utf8(out).expect("ASCII")
    }
}

impl Codec for Decimal {
    fn encode(&self, n: u64) -> String {
        n.to_string()
    }
}

// ---------- 3. rustc·clippy-driver 도우미 ----------

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("vr49_{}_{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn stderr(o: &Output) -> String {
    String::from_utf8_lossy(&o.stderr).into_owned()
}

/// 라이브러리 크레이트 `store`(또는 `name`)를 rlib으로 만든다.
fn build_lib(dir: &Path, name: &str, src: &str) -> Output {
    let file = dir.join(format!("{name}.rs"));
    std::fs::write(&file, src).unwrap();
    Command::new("rustc")
        .args([
            "--edition",
            "2024",
            "--crate-type=rlib",
            "--crate-name",
            name,
        ])
        .arg("--out-dir")
        .arg(dir)
        .arg(&file)
        .output()
        .expect("rustc 실행")
}

/// 라이브러리를 쓰는 쪽 크레이트를 컴파일한다.
fn build_user(dir: &Path, lib: &str, src: &str) -> Output {
    let file = dir.join("user.rs");
    std::fs::write(&file, src).unwrap();
    Command::new("rustc")
        .args(["--edition", "2024", "--crate-type=lib", "--emit=metadata"])
        .arg("--extern")
        .arg(format!(
            "{lib}={}",
            dir.join(format!("lib{lib}.rlib")).display()
        ))
        .arg("-L")
        .arg(dir)
        .arg("--out-dir")
        .arg(dir)
        .arg(&file)
        .output()
        .expect("rustc 실행")
}

/// stderr에서 `error[E....]` 코드만 모은다.
fn error_codes(err: &str) -> Vec<String> {
    let mut codes: Vec<String> = err
        .match_indices("error[E")
        .map(|(i, _)| err[i + 6..i + 11].to_string())
        .collect();
    codes.dedup();
    codes
}

fn clippy(dir: &Path, src: &str, extra: &[&str], conf_dir: Option<&Path>) -> String {
    let file = dir.join("lint.rs");
    std::fs::write(&file, src).unwrap();
    let mut cmd = Command::new("clippy-driver");
    cmd.args(["--edition", "2024", "--crate-type=lib", "--emit=metadata"])
        .args(extra)
        .arg("--out-dir")
        .arg(dir)
        .arg(&file);
    match conf_dir {
        Some(c) => cmd.env("CLIPPY_CONF_DIR", c),
        None => cmd.env("CLIPPY_CONF_DIR", dir),
    };
    stderr(&cmd.output().expect("clippy-driver 실행"))
}

// ---------- 4. 확인 ----------

fn check_builder() {
    let cfg = ServerConfig::builder("0.0.0.0:8080")
        .timeout(Duration::from_secs(5))
        .build()
        .unwrap();
    assert_eq!(cfg.addr(), "0.0.0.0:8080");
    assert_eq!(cfg.timeout(), Duration::from_secs(5));
    assert_eq!(cfg.max_body_bytes(), 1024 * 1024);

    // 조건에 따라 설정할 때 소비형 빌더는 다시 묶어야 한다.
    let slow_network = true;
    let mut b = ServerConfig::builder("127.0.0.1:3000");
    if slow_network {
        b = b.timeout(Duration::from_secs(60));
    }
    assert_eq!(b.build().unwrap().timeout(), Duration::from_secs(60));

    let e = ServerConfig::builder("x").max_body_bytes(0).build();
    assert_eq!(e, Err(BuildError::ZeroBodyLimit));
    assert_eq!(
        e.unwrap_err().to_string(),
        "body limit must be greater than zero"
    );
    assert_eq!(
        ServerConfig::builder("").build(),
        Err(BuildError::EmptyAddr)
    );
    assert_good_error::<BuildError>();
    assert_send_sync::<ServerConfig>();
    println!("빌더: 기본값·체인·조건부 설정·검사 오류 확인");

    // 비소비형 빌더의 예: std::process::Command는 &mut self를 받고, 같은 빌더로 두 번 실행할 수 있다.
    let mut cmd = Command::new("rustc");
    cmd.arg("--version");
    let first = cmd.output().unwrap();
    let second = cmd.output().unwrap();
    assert_eq!(first.stdout, second.stdout);
    let version = String::from_utf8_lossy(&first.stdout);
    assert!(version.starts_with("rustc "), "{version}");
    println!("Command 빌더 두 번 실행: {}", version.trim());
}

fn check_must_use() {
    let d = tmp("mustuse");
    let base = "pub struct B { port: u16 }\n\
                impl B {\n\
                    pub fn new() -> Self { B { port: 80 } }\n\
                    ATTR\n\
                    pub fn port(mut self, p: u16) -> Self { self.port = p; self }\n\
                    pub fn get(&self) -> u16 { self.port }\n\
                }\n\
                impl Default for B { fn default() -> Self { Self::new() } }\n\
                pub fn forget(b: B) { b.port(8080); }\n";
    let plain = base.replace("ATTR", "");
    let marked = base.replace(
        "ATTR",
        "#[must_use = \"새 빌더를 돌려줄 뿐 원래 값은 그대로다\"]",
    );
    let r1 = clippy(&d, &plain, &[], None);
    // "error"가 없어야 조각이 실제로 컴파일된 것이다(호출이 실패해도 "must be used"는 안 나온다).
    assert!(
        !r1.contains("error") && !r1.contains("must be used"),
        "붙이지 않으면 조용히 버려진다: {r1}"
    );
    let r2 = clippy(&d, &marked, &[], None);
    assert!(
        r2.contains("unused return value of `B::port` that must be used"),
        "{r2}"
    );
    assert!(r2.contains("새 빌더를 돌려줄 뿐 원래 값은 그대로다"));
    let r3 = clippy(&d, &plain, &["-W", "clippy::pedantic"], None);
    assert!(r3.contains("clippy::return-self-not-must-use"), "{r3}");
    assert!(r3.contains("clippy::must-use-candidate"), "{r3}");
    // 타입에 #[must_use]를 붙이면 Self를 돌려주는 메서드는 따로 표시하지 않아도 된다.
    let typed = plain.replace("pub struct B", "#[must_use]\npub struct B");
    let r4 = clippy(&d, &typed, &["-W", "clippy::pedantic"], None);
    // 같은 실행에서 pedantic 린트가 실제로 돌았는지(must_use_candidate가 `get`을 짚는지)도 본다.
    assert!(r4.contains("clippy::must-use-candidate"), "{r4}");
    assert!(!r4.contains("return-self-not-must-use"), "{r4}");
    assert!(r4.contains("unused `B` that must be used"), "{r4}");
    println!(
        "must_use: 없으면 조용히 버림, 메서드나 타입에 붙이면 경고, pedantic은 return_self_not_must_use"
    );
}

const SEALED_LIB: &str = "mod private {\n    pub trait Sealed {}\n}\n\
/// 이 트레이트는 봉인되어 있다.\n\
pub trait Codec: private::Sealed {\n    fn encode(&self, n: u64) -> String;\n}\n\
pub struct Decimal;\n\
impl private::Sealed for Decimal {}\n\
impl Codec for Decimal {\n    fn encode(&self, n: u64) -> String { n.to_string() }\n}\n";

fn check_sealed() {
    assert_eq!(Base62.encode(125), "21");
    assert_eq!(Base62.encode(0), "0");
    assert_eq!(Base62.encode(61), "Z");
    assert_eq!(Decimal.encode(125), "125");
    let codecs: [&dyn Codec; 2] = [&Base62, &Decimal];
    let all: Vec<String> = codecs.iter().map(|c| c.encode(3844)).collect();
    assert_eq!(all, ["100", "3844"]);

    let d = tmp("sealed");
    let lib = build_lib(&d, "codec", SEALED_LIB);
    assert!(lib.status.success(), "{}", stderr(&lib));
    let outside = build_user(
        &d,
        "codec",
        "pub struct Hex;\nimpl codec::Codec for Hex {\n    fn encode(&self, n: u64) -> String { format!(\"{n:x}\") }\n}\n",
    );
    let e = stderr(&outside);
    assert_eq!(error_codes(&e), ["E0277"], "{e}");
    assert!(
        e.contains("the trait bound `Hex: codec::private::Sealed` is not satisfied"),
        "{e}"
    );
    assert!(e.contains("`Codec` is a \"sealed trait\""), "{e}");
    let name_it = build_user(
        &d,
        "codec",
        "pub struct Hex;\nimpl codec::private::Sealed for Hex {}\n",
    );
    let e = stderr(&name_it);
    assert_eq!(error_codes(&e), ["E0603"], "{e}");
    assert!(e.contains("module `private` is private"), "{e}");
    let use_it = build_user(
        &d,
        "codec",
        "use codec::Codec;\npub fn f() -> String { codec::Decimal.encode(7) }\n\
         pub fn g(c: &dyn codec::Codec) -> String { c.encode(7) }\n",
    );
    assert!(use_it.status.success(), "{}", stderr(&use_it));
    println!(
        "봉인 트레이트: 밖에서 구현 E0277(sealed trait 안내), Sealed 이름 부르기 E0603, 쓰기는 통과"
    );
}

/// 1판: 아무 대비 없이 공개한 라이브러리.
const NAIVE_V1: &str = "pub trait Store { fn get(&self, k: &str) -> Option<String>; }\n\
pub enum Kind { NotFound, Duplicate }\n\
pub struct Link { pub code: String, pub url: String }\n";

/// 1판을 쓰는 쪽 코드: 트레이트 구현, 모든 variant를 다룬 match, 구조체 리터럴.
const NAIVE_USER: &str = "pub struct Mem;\n\
impl store::Store for Mem { fn get(&self, _k: &str) -> Option<String> { None } }\n\
pub fn code(k: store::Kind) -> u8 { match k { store::Kind::NotFound => 1, store::Kind::Duplicate => 2 } }\n\
pub fn make() -> store::Link { store::Link { code: \"a\".into(), url: \"b\".into() } }\n";

/// 쓰는 쪽에 같은 이름(size)의 메서드를 가진 자기 트레이트가 있다.
const CLASH_USER: &str = "use store::Store;\npub struct Mem;\n\
impl Store for Mem { fn get(&self, _k: &str) -> Option<String> { None } }\n\
pub trait Ext { fn size(&self) -> usize { 1 } }\nimpl Ext for Mem {}\n\
pub fn s(m: &Mem) -> usize { m.size() + m.get(\"k\").map_or(0, |v| v.len()) }\n";

/// 1판을 미래에 대비해 공개했다면.
const READY_V1: &str = "mod private { pub trait Sealed {} }\n\
pub trait Store { fn get(&self, k: &str) -> Option<String>; }\n\
pub trait Codec: private::Sealed { fn encode(&self, n: u64) -> String; }\n\
pub struct Decimal;\nimpl private::Sealed for Decimal {}\n\
impl Codec for Decimal { fn encode(&self, n: u64) -> String { n.to_string() } }\n\
#[non_exhaustive]\npub enum Kind { NotFound, Duplicate }\n\
#[non_exhaustive]\npub struct Link { pub code: String, pub url: String }\n\
impl Link { pub fn new(code: &str, url: &str) -> Self { Link { code: code.into(), url: url.into() } } }\n";

/// 대비한 1판의 2판: 기본 몸통 있는 메서드, 봉인 트레이트의 필수 메서드, variant, 필드를 더했다.
const READY_V2: &str = "mod private { pub trait Sealed {} }\n\
pub trait Store {\n    fn get(&self, k: &str) -> Option<String>;\n    fn delete(&self, _k: &str) -> bool { false }\n}\n\
pub trait Codec: private::Sealed {\n    fn encode(&self, n: u64) -> String;\n    fn decode(&self, s: &str) -> Option<u64>;\n}\n\
pub struct Decimal;\nimpl private::Sealed for Decimal {}\n\
impl Codec for Decimal {\n    fn encode(&self, n: u64) -> String { n.to_string() }\n    fn decode(&self, s: &str) -> Option<u64> { s.parse().ok() }\n}\n\
#[non_exhaustive]\npub enum Kind { NotFound, Duplicate, Unavailable }\n\
#[non_exhaustive]\npub struct Link { pub code: String, pub url: String, pub hits: u64 }\n\
impl Link { pub fn new(code: &str, url: &str) -> Self { Link { code: code.into(), url: url.into(), hits: 0 } } }\n";

const READY_USER: &str = "pub struct Mem;\n\
impl store::Store for Mem { fn get(&self, _k: &str) -> Option<String> { None } }\n\
pub fn code(k: store::Kind) -> u8 { match k { store::Kind::NotFound => 1, store::Kind::Duplicate => 2, _ => 0 } }\n\
pub fn make() -> store::Link { store::Link::new(\"a\", \"b\") }\n\
pub fn url(l: &store::Link) -> &str { let store::Link { url, .. } = l; url }\n\
pub fn enc(c: &dyn store::Codec) -> String { c.encode(7) }\n";

/// 라이브러리 판 `lib_src`로 `user_src`를 컴파일해 오류 코드를 돌려준다(빈 목록이면 통과).
fn against(dir: &Path, lib_src: &str, user_src: &str) -> Vec<String> {
    let lib = build_lib(dir, "store", lib_src);
    assert!(lib.status.success(), "{}", stderr(&lib));
    let user = build_user(dir, "store", user_src);
    let codes = error_codes(&stderr(&user));
    assert_eq!(user.status.success(), codes.is_empty(), "{}", stderr(&user));
    codes
}

fn check_semver() {
    let d = tmp("semver");
    assert!(against(&d, NAIVE_V1, NAIVE_USER).is_empty());
    assert!(against(&d, NAIVE_V1, CLASH_USER).is_empty());

    let required_method = NAIVE_V1.replace(
        "fn get(&self, k: &str) -> Option<String>; }",
        "fn get(&self, k: &str) -> Option<String>; fn delete(&self, k: &str) -> bool; }",
    );
    let defaulted_method = NAIVE_V1.replace(
        "fn get(&self, k: &str) -> Option<String>; }",
        "fn get(&self, k: &str) -> Option<String>; fn size(&self) -> usize { 0 } }",
    );
    let new_variant = NAIVE_V1.replace("Duplicate }", "Duplicate, Unavailable }");
    let new_field = NAIVE_V1.replace("pub url: String }", "pub url: String, pub hits: u64 }");
    let late_non_exhaustive =
        NAIVE_V1.replace("pub struct Link", "#[non_exhaustive]\npub struct Link");

    let table = [
        (
            "트레이트에 필수 메서드 추가",
            against(&d, &required_method, NAIVE_USER),
        ),
        (
            "트레이트에 기본 몸통 있는 메서드 추가",
            against(&d, &defaulted_method, NAIVE_USER),
        ),
        (
            "  (쓰는 쪽에 같은 이름 메서드가 있을 때)",
            against(&d, &defaulted_method, CLASH_USER),
        ),
        ("enum에 variant 추가", against(&d, &new_variant, NAIVE_USER)),
        (
            "필드가 모두 pub인 구조체에 pub 필드 추가",
            against(&d, &new_field, NAIVE_USER),
        ),
        (
            "나중에 #[non_exhaustive] 붙이기",
            against(&d, &late_non_exhaustive, NAIVE_USER),
        ),
    ];
    for (what, codes) in &table {
        println!("{what}: {codes:?}");
    }
    let got: Vec<Vec<String>> = table.iter().map(|(_, c)| c.clone()).collect();
    let want: Vec<Vec<&str>> = vec![
        vec!["E0046"],
        vec![],
        vec!["E0034"],
        vec!["E0004"],
        vec!["E0063"],
        vec!["E0639"],
    ];
    assert_eq!(got, want);

    // 처음부터 대비해 두면 같은 변경이 쓰는 쪽을 깨지 않는다.
    assert!(against(&d, READY_V1, READY_USER).is_empty());
    assert!(against(&d, READY_V2, READY_USER).is_empty());
    // 대가: 대비한 판에서는 밖에서 구조체 리터럴로 만들 수 없다.
    let literal = format!(
        "{READY_USER}pub fn lit() -> store::Link {{ store::Link {{ code: String::new(), url: String::new() }} }}\n"
    );
    assert_eq!(against(&d, READY_V1, &literal), ["E0639"]);
    println!("대비한 1판 → 2판: 쓰는 쪽 통과, 대신 밖에서 구조체 리터럴은 E0639");
}

fn check_naming_lints() {
    let d = tmp("naming");
    let src = "STRUCT Code(String);\n\
               impl Code {\n\
                   FNS fn into_string(&self) -> String { self.0.clone() }\n\
                   FNS fn as_string(self) -> String { self.0 }\n\
               }\n\
               pub fn touch() -> String { let c = Code(String::new()); let a = c.into_string(); a + &c.as_string() }\n";
    let private = src.replace("STRUCT", "struct").replace("FNS ", "");
    let public = src.replace("STRUCT", "pub struct").replace("FNS", "pub");
    let r1 = clippy(&d, &private, &[], None);
    assert!(
        r1.contains("methods called `into_*` usually take `self` by value"),
        "{r1}"
    );
    assert!(
        r1.contains("methods called `as_*` usually take `self` by reference"),
        "{r1}"
    );
    let r2 = clippy(&d, &public, &[], None);
    // "error"가 없어야 조각이 실제로 컴파일된 것이다(호출이 실패해도 린트 이름은 안 나온다).
    assert!(
        !r2.contains("error") && !r2.contains("wrong_self_convention"),
        "{r2}"
    );
    let conf = d.join("conf");
    std::fs::create_dir_all(&conf).unwrap();
    std::fs::write(
        conf.join("clippy.toml"),
        "avoid-breaking-exported-api = false\n",
    )
    .unwrap();
    let r3 = clippy(&d, &public, &[], Some(&conf));
    assert!(r3.contains("clippy::wrong_self_convention"), "{r3}");
    println!(
        "wrong_self_convention: 비공개는 경고, 공개는 기본으로 조용, avoid-breaking-exported-api = false면 경고"
    );
}

fn main() {
    check_builder();
    check_must_use();
    check_sealed();
    check_semver();
    check_naming_lints();
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn base62_round_numbers() {
        assert_eq!(Base62.encode(62), "10");
        assert_eq!(Base62.encode(62 * 62), "100");
    }

    #[test]
    fn error_codes_parse() {
        let e = "error[E0046]: x\nerror[E0046]: y\nerror[E0004]: z\n";
        assert_eq!(error_codes(e), ["E0046", "E0004"]);
    }

    #[test]
    fn builder_rejects_zero_timeout() {
        let r = ServerConfig::builder("a").timeout(Duration::ZERO).build();
        assert_eq!(r, Err(BuildError::ZeroTimeout));
    }
}
```
{% endraw %}
