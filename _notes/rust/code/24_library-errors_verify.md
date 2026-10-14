---
layout: "note"
title: "24_library-errors_verify.rs"
display_title: "24_library-errors_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/library-errors/"
parent_title: "라이브러리 에러 설계"
description: "Rust · 라이브러리 에러 설계 검증 코드"
permalink: "/studies/rust/code/24_library-errors_verify/"
---
{% raw %}
[라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/) 문서의 검증 코드다.

```rust
//! thiserror 2로 만든 라이브러리 에러: #[error] 메시지, #[from]이 만드는 From과 source,
//! #[source], #[error(transparent)], Send + Sync + 'static, 의존성 타입을 숨기는 불투명 에러,
//! 그리고 #[non_exhaustive]가 다른 크레이트에서 match에 와일드카드를 요구하는 것(E0004)을 확인한다.
//! 의존성: thiserror = "2", serde_json = "1"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/24_library-errors_verify.rs"

use std::error::Error as StdError;

// ---------- 1. 실패 방식마다 variant 하나 ----------

/// 작은 "설정 읽기" 라이브러리의 공개 에러.
#[derive(Debug, thiserror::Error)]
#[non_exhaustive]
pub enum ConfigError {
    /// 파일을 읽지 못했다. 원인(io::Error)은 source()로 꺼낸다.
    #[error("failed to read config file `{path}`")]
    Read {
        path: String,
        #[source]
        source: std::io::Error,
    },
    /// 키가 없다.
    #[error("missing key `{0}`")]
    MissingKey(String),
    /// 값의 범위가 틀렸다.
    #[error("`{key}` must be between {min} and {max}, got {value}")]
    OutOfRange {
        key: &'static str,
        value: i64,
        min: i64,
        max: i64,
    },
    /// 숫자가 아니다. #[from]이 From<ParseIntError>를 만들고 source로도 쓴다.
    #[error("value is not an integer")]
    NotInteger(#[from] std::num::ParseIntError),
}

pub fn port_from(text: &str) -> Result<u16, ConfigError> {
    let raw = text
        .lines()
        .find_map(|l| l.strip_prefix("port="))
        .ok_or_else(|| ConfigError::MissingKey("port".into()))?;
    let v: i64 = raw.trim().parse()?; // #[from] 덕분에 ?가 바로 변환한다
    if !(1..=65535).contains(&v) {
        return Err(ConfigError::OutOfRange {
            key: "port",
            value: v,
            min: 1,
            max: 65535,
        });
    }
    Ok(v as u16)
}

pub fn load(path: &str) -> Result<u16, ConfigError> {
    let text = std::fs::read_to_string(path).map_err(|source| ConfigError::Read {
        path: path.to_string(),
        source,
    })?;
    port_from(&text)
}

// ---------- 2. 의존성 타입을 공개 API에 내보내지 않기 ----------

/// 공개 에러는 불투명한 구조체 하나. 안쪽 enum과 serde_json::Error는 비공개다.
#[derive(Debug, thiserror::Error)]
#[error(transparent)]
pub struct ParseError(#[from] Repr);

#[derive(Debug, thiserror::Error)]
enum Repr {
    #[error("invalid JSON")]
    Json(#[source] serde_json::Error),
    #[error("field `name` is empty")]
    EmptyName,
}

/// 호출자가 분기할 수 있게 공개하는 종류. 여기에는 의존성 타입이 없다.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[non_exhaustive]
pub enum ParseErrorKind {
    Syntax,
    EmptyName,
}

impl ParseError {
    pub fn kind(&self) -> ParseErrorKind {
        match &self.0 {
            Repr::Json(_) => ParseErrorKind::Syntax,
            Repr::EmptyName => ParseErrorKind::EmptyName,
        }
    }
}

pub fn parse_name(json: &str) -> Result<String, ParseError> {
    let v: serde_json::Value = serde_json::from_str(json).map_err(Repr::Json)?;
    let name = v["name"].as_str().unwrap_or_default();
    if name.is_empty() {
        return Err(Repr::EmptyName.into());
    }
    Ok(name.to_string())
}

// ---------- 도우미 ----------

fn chain(e: &(dyn StdError + 'static)) -> Vec<String> {
    let mut out = vec![e.to_string()];
    let mut cur = e.source();
    while let Some(x) = cur {
        out.push(x.to_string());
        cur = x.source();
    }
    out
}

fn assert_good_error<E: StdError + Send + Sync + 'static>() {}

fn rustc(args: &[&str], dir: &std::path::Path) -> String {
    let out = std::process::Command::new("rustc")
        .args(args)
        .current_dir(dir)
        .output()
        .expect("rustc 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

/// 크레이트 둘을 만들어 #[non_exhaustive]의 효과를 본다.
fn non_exhaustive_cross_crate() -> (String, String, String) {
    let dir = std::env::temp_dir().join(format!("vr24_{}", std::process::id()));
    std::fs::create_dir_all(&dir).expect("임시 폴더");
    std::fs::write(
        dir.join("mylib.rs"),
        "#[non_exhaustive]\npub enum Kind { A, B }\n\
         pub fn inside(k: Kind) -> u8 { match k { Kind::A => 1, Kind::B => 2 } }\n",
    )
    .expect("쓰기");
    let lib = rustc(
        &[
            "--edition",
            "2024",
            "--crate-type=rlib",
            "--crate-name",
            "mylib",
            "mylib.rs",
        ],
        &dir,
    );
    std::fs::write(
        dir.join("user_bad.rs"),
        "pub fn f(k: mylib::Kind) -> u8 { match k { mylib::Kind::A => 1, mylib::Kind::B => 2 } }\n",
    )
    .expect("쓰기");
    std::fs::write(
        dir.join("user_ok.rs"),
        "pub fn f(k: mylib::Kind) -> u8 { match k { mylib::Kind::A => 1, mylib::Kind::B => 2, _ => 0 } }\n",
    )
    .expect("쓰기");
    let common = [
        "--edition",
        "2024",
        "--crate-type=lib",
        "--emit=metadata",
        "--extern",
        "mylib=libmylib.rlib",
        "-L",
        ".",
    ];
    let mut bad = common.to_vec();
    bad.push("user_bad.rs");
    let mut ok = common.to_vec();
    ok.push("user_ok.rs");
    (lib, rustc(&bad, &dir), rustc(&ok, &dir))
}

fn main() {
    assert_good_error::<ConfigError>();
    assert_good_error::<ParseError>();

    // #[error] 메시지
    assert_eq!(port_from("port=8080").ok(), Some(8080));
    let e = port_from("host=x").unwrap_err();
    assert_eq!(e.to_string(), "missing key `port`");
    assert!(e.source().is_none());
    let e = port_from("port=70000").unwrap_err();
    assert_eq!(
        e.to_string(),
        "`port` must be between 1 and 65535, got 70000"
    );
    // #[from]: From 구현 + source
    let e = port_from("port=abc").unwrap_err();
    assert!(matches!(e, ConfigError::NotInteger(_)));
    assert_eq!(
        chain(&e),
        vec!["value is not an integer", "invalid digit found in string"]
    );
    let direct: ConfigError = "x".parse::<i64>().unwrap_err().into();
    assert!(matches!(direct, ConfigError::NotInteger(_)));
    // #[source]가 붙은 필드
    let e = load("/no/such/dir/app.conf").unwrap_err();
    let c = chain(&e);
    println!("Read 사슬: {c:?}");
    assert_eq!(c[0], "failed to read config file `/no/such/dir/app.conf`");
    assert_eq!(c[1], "No such file or directory (os error 2)");
    // 같은 크레이트 안에서는 non_exhaustive라도 와일드카드 없이 match할 수 있다
    let code = match e {
        ConfigError::Read { .. } => 1,
        ConfigError::MissingKey(_) => 2,
        ConfigError::OutOfRange { .. } => 3,
        ConfigError::NotInteger(_) => 4,
    };
    assert_eq!(code, 1);
    println!("1. thiserror 메시지·From·source 확인");

    // 불투명 에러: transparent는 Display와 source를 안쪽에 넘긴다
    assert_eq!(parse_name(r#"{"name":"kim"}"#).ok().as_deref(), Some("kim"));
    let e = parse_name("{oops").unwrap_err();
    assert_eq!(e.kind(), ParseErrorKind::Syntax);
    let c = chain(&e);
    println!("불투명 에러 사슬: {c:?}");
    assert_eq!(c[0], "invalid JSON");
    assert_eq!(c.len(), 2);
    let e = parse_name(r#"{"name":""}"#).unwrap_err();
    assert_eq!(e.kind(), ParseErrorKind::EmptyName);
    assert_eq!(e.to_string(), "field `name` is empty");
    println!("2. 불투명 에러: 의존성 타입 없이 kind()로 분기");

    // non_exhaustive (다른 크레이트)
    let (lib, bad, ok) = non_exhaustive_cross_crate();
    assert!(lib.is_empty(), "{lib}");
    assert!(bad.contains("error[E0004]"), "{bad}");
    assert!(
        bad.contains("non-exhaustive patterns: `_` not covered"),
        "{bad}"
    );
    assert!(ok.is_empty(), "{ok}");
    println!("3. non_exhaustive: 다른 크레이트에서 `_` 없는 match는 E0004");

    // 4. clippy::missing_errors_doc는 pedantic 묶음에 들어 있다
    let dir = std::env::temp_dir().join(format!("vr24c_{}", std::process::id()));
    std::fs::create_dir_all(&dir).expect("임시 폴더");
    std::fs::write(
        dir.join("doc.rs"),
        "/// Parses.\npub fn f(s: &str) -> Result<i32, std::num::ParseIntError> { s.parse() }\n",
    )
    .expect("쓰기");
    let out = std::process::Command::new("clippy-driver")
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "--emit=metadata",
            "-W",
            "clippy::pedantic",
            "doc.rs",
        ])
        .current_dir(&dir)
        .output()
        .expect("clippy-driver 실행");
    let msg = String::from_utf8_lossy(&out.stderr);
    assert!(msg.contains("missing `# Errors` section"), "{msg}");
    assert!(
        msg.contains("`-W clippy::missing-errors-doc` implied by `-W clippy::pedantic`"),
        "{msg}"
    );
    println!("4. clippy::missing_errors_doc (pedantic)");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn display_is_lowercase_without_period() {
        let msgs = [
            port_from("x").unwrap_err().to_string(),
            port_from("port=0").unwrap_err().to_string(),
            port_from("port=a").unwrap_err().to_string(),
        ];
        for m in msgs {
            assert!(!m.ends_with('.'), "{m}");
            assert!(!m.starts_with(|c: char| c.is_uppercase()), "{m}");
        }
    }
}
```
{% endraw %}
