---
layout: "note"
title: "50_release-readiness-practice_p1.rs"
display_title: "50_release-readiness-practice_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "50"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/release-readiness-practice/"
parent_title: "배포 준비 연습"
description: "Rust · 배포 준비 연습 문제 1 풀이 코드"
permalink: "/studies/rust/code/50_release-readiness-practice_p1/"
---
{% raw %}
[배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/) 문서의 문제 1 풀이 코드다.

```rust
//! 50 배포 준비 연습 p1: 공개 API 리뷰. 고치기 전 API에서 rustc·clippy가 잡는 것과 사람이 봐야 하는 것을 가르고,
//! 고친 API는 같은 글자를 라이브러리로 컴파일해 rustc·clippy(pedantic, avoid-breaking-exported-api = false)가 조용한지 본다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/50_release-readiness-practice_p1.rs"

use std::path::{Path, PathBuf};
use std::process::Command;

/// 고치기 전 API(문제에 실은 글자).
const ORIGINAL: &str = r#"pub struct shortLink {
    pub URL: String,
    code: String,
}

impl shortLink {
    pub fn get_code(&self) -> &str {
        &self.code
    }

    pub fn as_url(&self) -> String {
        self.URL.clone()
    }

    pub fn into_parts(&self) -> (String, String) {
        (self.code.clone(), self.URL.clone())
    }
}

pub fn parse_code(s: &str) -> Result<String, ()> {
    if !s.is_empty() && s.chars().all(|c| c.is_ascii_alphanumeric()) {
        Ok(s.to_string())
    } else {
        Err(())
    }
}

pub fn shorten(url: &str, permanent: bool) -> shortLink {
    let code = if permanent { "p1" } else { "t1" };
    shortLink { URL: url.to_string(), code: code.to_string() }
}
"#;

/// 고친 API. 이 파일에서 그대로 쓰이고, 같은 글자(stringify!)가 라이브러리로 따로 컴파일되어 린트 검사를 받는다.
macro_rules! fixed_api {
    ($($item:item)*) => {
        $($item)*
        const FIXED_SRC: &str = stringify!($($item)*);
    };
}

fixed_api! {
    #[derive(Debug, Clone, PartialEq, Eq, Hash)]
    pub struct ShortLink {
        url: String,
        code: String,
    }

    impl ShortLink {
        #[must_use]
        pub fn code(&self) -> &str {
            &self.code
        }

        #[must_use]
        pub fn url(&self) -> &str {
            &self.url
        }

        #[must_use]
        pub fn into_parts(self) -> (String, String) {
            (self.code, self.url)
        }
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
    pub enum Lifetime {
        Permanent,
        Expiring,
    }

    #[derive(Debug, Clone, PartialEq, Eq)]
    #[non_exhaustive]
    pub enum ParseCodeError {
        Empty,
        InvalidChar { at: usize, ch: char },
    }

    impl std::fmt::Display for ParseCodeError {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            match self {
                ParseCodeError::Empty => f.write_str("code is empty"),
                ParseCodeError::InvalidChar { at, ch } => {
                    write!(f, "invalid character {ch:?} at byte {at}")
                }
            }
        }
    }

    impl std::error::Error for ParseCodeError {}

    /// 짧은 코드를 검사한다.
    ///
    /// # Errors
    ///
    /// 비어 있으면 `Empty`, ASCII 영숫자가 아닌 글자가 있으면 `InvalidChar`.
    pub fn parse_code(s: &str) -> Result<String, ParseCodeError> {
        if s.is_empty() {
            return Err(ParseCodeError::Empty);
        }
        match s.char_indices().find(|(_, c)| !c.is_ascii_alphanumeric()) {
            Some((at, ch)) => Err(ParseCodeError::InvalidChar { at, ch }),
            None => Ok(s.to_string()),
        }
    }

    #[must_use]
    pub fn shorten(url: &str, lifetime: Lifetime) -> ShortLink {
        let code = match lifetime {
            Lifetime::Permanent => "p1",
            Lifetime::Expiring => "t1",
        };
        ShortLink {
            url: url.to_string(),
            code: code.to_string(),
        }
    }
}

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("vr50p1_{}_{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

/// 라이브러리로 컴파일해 경고 줄(`warning: ...`)의 첫 줄만 모은다. `clippy`면 clippy-driver를 쓴다.
/// clippy 설정은 `STRICT`(avoid-breaking-exported-api = false)를 쓴다.
fn warnings(dir: &Path, src: &str, clippy: bool, extra: &[&str]) -> Vec<String> {
    warnings_with(dir, src, clippy, extra, STRICT)
}

const STRICT: &str = "avoid-breaking-exported-api = false\n";

fn warnings_with(
    dir: &Path,
    src: &str,
    clippy: bool,
    extra: &[&str],
    clippy_toml: &str,
) -> Vec<String> {
    let file = dir.join("api.rs");
    std::fs::write(&file, src).unwrap();
    let conf = dir.join("conf");
    std::fs::create_dir_all(&conf).unwrap();
    std::fs::write(conf.join("clippy.toml"), clippy_toml).unwrap();
    let out = Command::new(if clippy { "clippy-driver" } else { "rustc" })
        .args(["--edition", "2024", "--crate-type=lib", "--emit=metadata"])
        .args(extra)
        .arg("--out-dir")
        .arg(dir)
        .arg(&file)
        .env("CLIPPY_CONF_DIR", &conf)
        .output()
        .expect("컴파일러 실행");
    assert!(out.status.success());
    String::from_utf8_lossy(&out.stderr)
        .lines()
        .filter(|l| l.starts_with("warning: ") && !l.contains("warnings emitted"))
        .filter(|l| !l.contains("warning emitted"))
        .map(str::to_string)
        .collect()
}

fn main() {
    let d = tmp("lint");
    let rustc_found = warnings(
        &d,
        ORIGINAL,
        false,
        &["-W", "missing_debug_implementations"],
    );
    println!("rustc: {rustc_found:#?}");
    assert_eq!(
        rustc_found,
        [
            "warning: type `shortLink` should have an upper camel case name",
            "warning: type does not implement `Debug`; consider adding `#[derive(Debug)]` or a manual implementation",
            "warning: structure field `URL` should have a snake case name",
        ]
    );
    // missing_debug_implementations는 기본으로 꺼져 있다. -W 없이는 대소문자 경고 둘만 나온다.
    let rustc_default = warnings(&d, ORIGINAL, false, &[]);
    assert_eq!(rustc_default.len(), 2, "{rustc_default:?}");
    assert!(!rustc_default.iter().any(|w| w.contains("Debug")));
    // clippy 기본 설정: result_unit_err만 더 나오고, 공개 메서드의 wrong_self_convention은 조용하다.
    let clippy_default = warnings_with(&d, ORIGINAL, true, &[], "");
    assert!(clippy_default.iter().any(|w| w.contains("Result<_, ()>")));
    assert!(!clippy_default.iter().any(|w| w.contains("into_*")));
    assert_eq!(clippy_default.len(), 3, "{clippy_default:?}");
    let clippy_found = warnings(&d, ORIGINAL, true, &[]);
    println!("clippy: {clippy_found:#?}");
    assert!(
        clippy_found
            .iter()
            .any(|w| w == "warning: this returns a `Result<_, ()>`")
    );
    assert!(
        clippy_found
            .iter()
            .any(|w| w == "warning: methods called `into_*` usually take `self` by value")
    );
    // 사람이 봐야 하는 것: get_ 접두사, 돈이 드는 as_, pub 필드, bool 인자에는 린트가 없다.
    for w in &clippy_found {
        assert!(!w.contains("get_code") && !w.contains("as_url") && !w.contains("bool"));
    }
    // 경고 첫 줄에는 항목 이름이 잘 안 나오므로, 위의 검사만으로는 다른 린트가 없다고 못 한다. 네 줄을 그대로 맞춘다.
    assert_eq!(
        clippy_found,
        [
            "warning: type `shortLink` should have an upper camel case name",
            "warning: methods called `into_*` usually take `self` by value",
            "warning: this returns a `Result<_, ()>`",
            "warning: structure field `URL` should have a snake case name",
        ],
        "{clippy_found:?}"
    );

    // 고친 API는 rustc(missing_debug_implementations)와 clippy pedantic 모두 조용하다.
    let fixed_rustc = warnings(
        &d,
        FIXED_SRC,
        false,
        &["-W", "missing_debug_implementations"],
    );
    assert!(fixed_rustc.is_empty(), "{fixed_rustc:?}");
    let fixed_clippy = warnings(&d, FIXED_SRC, true, &["-W", "clippy::pedantic"]);
    assert!(fixed_clippy.is_empty(), "{fixed_clippy:?}");
    println!("고친 API: rustc·clippy pedantic 경고 0");
    // 변형: #[must_use]를 모두 빼면 pedantic의 must_use_candidate가 네 곳(code, url, into_parts, shorten)을 짚는다.
    assert_eq!(FIXED_SRC.matches("#[must_use]").count(), 4);
    let without = FIXED_SRC.replace("#[must_use]", "");
    let w = warnings(&d, &without, true, &["-W", "clippy::pedantic"]);
    assert_eq!(w.len(), 4, "{w:?}");
    assert!(
        w.iter()
            .all(|l| l.contains("could have a `#[must_use]` attribute"))
    );
    println!("#[must_use]를 빼면: {w:?}");

    // 고친 API의 동작.
    let link = shorten("https://example.com", Lifetime::Permanent);
    assert_eq!(link.code(), "p1");
    assert_eq!(link.url(), "https://example.com");
    let (code, url) = link.clone().into_parts();
    assert_eq!((code.as_str(), url.as_str()), ("p1", "https://example.com"));
    assert_eq!(shorten("x", Lifetime::Expiring).code(), "t1");
    assert_eq!(parse_code("abc9"), Ok("abc9".to_string()));
    assert_eq!(parse_code(""), Err(ParseCodeError::Empty));
    let e = parse_code("ab-c").unwrap_err();
    assert_eq!(e, ParseCodeError::InvalidChar { at: 2, ch: '-' });
    assert_eq!(e.to_string(), "invalid character '-' at byte 2");
    let boxed: Box<dyn std::error::Error + Send + Sync> = Box::new(e);
    assert_eq!(boxed.to_string(), "invalid character '-' at byte 2");
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn non_ascii_is_rejected() {
        assert_eq!(
            parse_code("한"),
            Err(ParseCodeError::InvalidChar { at: 0, ch: '한' })
        );
    }

    #[test]
    fn lifetime_is_clearer_than_bool() {
        assert_ne!(
            shorten("u", Lifetime::Permanent),
            shorten("u", Lifetime::Expiring)
        );
    }
}
```
{% endraw %}
