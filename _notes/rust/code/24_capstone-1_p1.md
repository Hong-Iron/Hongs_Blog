---
layout: "note"
title: "24_capstone-1_p1.rs"
display_title: "24_capstone-1_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "24"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/capstone-1/"
parent_title: "캡스톤 1 도메인 타입과 에러"
description: "Rust · 캡스톤 1 도메인 타입과 에러 문제 1 풀이 코드"
permalink: "/studies/rust/code/24_capstone-1_p1/"
---
{% raw %}
[캡스톤 1 도메인 타입과 에러](/Hongs_Blog/studies/rust/capstone-1/) 문서의 문제 1 풀이 코드다.

```rust
//! 캡스톤 1단계: 단축 URL 서비스의 도메인 타입(Url, Code), 도메인 에러, 코드 생성기.
//! 의존성: thiserror = "2", proptest = "1" (proptest는 테스트에서만 쓴다)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/24_capstone-1_p1.rs"

use std::fmt;
use std::hash::{BuildHasher, RandomState};
use std::str::FromStr;

// ===== 1. 도메인 상수 =====

/// 짧은 코드의 글자 수. 62^7 = 3,521,614,606,208가지.
pub const CODE_LEN: usize = 7;
/// 받아 주는 URL의 최대 길이(바이트).
pub const MAX_URL_LEN: usize = 2048;
const ALPHABET: &[u8; 62] = b"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// ===== 2. 도메인 에러 =====

/// 입력이 도메인 규칙을 어겼을 때의 에러. 메시지는 API 응답에 그대로 실어도 안전하다.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum DomainError {
    #[error("url is empty")]
    EmptyUrl,
    #[error("url is {len} bytes, longer than the {max}-byte limit")]
    UrlTooLong { len: usize, max: usize },
    #[error("url contains a character outside visible ASCII at byte {index}")]
    InvalidCharacter { index: usize },
    #[error("url must start with http:// or https://")]
    UnsupportedScheme,
    #[error("url has no host")]
    MissingHost,
    #[error("url must not contain user info (user@host)")]
    UserInfo,
    #[error("code must be exactly {} characters from [0-9A-Za-z]", CODE_LEN)]
    InvalidCode,
}

// ===== 3. Url 뉴타입: 만들어졌으면 검증을 통과한 것 =====

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Url(String);

fn strip_prefix_ignore_case<'a>(s: &'a str, prefix: &str) -> Option<&'a str> {
    let head = s.get(..prefix.len())?;
    head.eq_ignore_ascii_case(prefix)
        .then(|| &s[prefix.len()..])
}

impl Url {
    /// 앞뒤 공백을 걷어 낸 뒤 검사한다. 검사 순서: 비었나 → 길이 → 글자 → 스킴 → 호스트.
    pub fn parse(input: &str) -> Result<Self, DomainError> {
        let s = input.trim();
        if s.is_empty() {
            return Err(DomainError::EmptyUrl);
        }
        if s.len() > MAX_URL_LEN {
            return Err(DomainError::UrlTooLong {
                len: s.len(),
                max: MAX_URL_LEN,
            });
        }
        // Location 헤더에 넣을 수 있는 글자(보이는 ASCII 0x21..=0x7E)만 받는다.
        if let Some(index) = s.bytes().position(|b| !(0x21..=0x7e).contains(&b)) {
            return Err(DomainError::InvalidCharacter { index });
        }
        let rest = strip_prefix_ignore_case(s, "https://")
            .or_else(|| strip_prefix_ignore_case(s, "http://"))
            .ok_or(DomainError::UnsupportedScheme)?;
        let authority = rest.split(['/', '?', '#']).next().unwrap_or("");
        if authority.contains('@') {
            return Err(DomainError::UserInfo);
        }
        if authority.is_empty() || authority.starts_with(':') {
            return Err(DomainError::MissingHost);
        }
        Ok(Self(s.to_owned()))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl FromStr for Url {
    type Err = DomainError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::parse(s)
    }
}

impl fmt::Display for Url {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

// ===== 4. Code 뉴타입: 정확히 7글자 base62 =====

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Code(String);

impl Code {
    pub fn parse(s: &str) -> Result<Self, DomainError> {
        if s.len() == CODE_LEN && s.bytes().all(|b| b.is_ascii_alphanumeric()) {
            Ok(Self(s.to_owned()))
        } else {
            Err(DomainError::InvalidCode)
        }
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl FromStr for Code {
    type Err = DomainError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::parse(s)
    }
}

impl fmt::Display for Code {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

// ===== 5. 코드 생성기: SplitMix64 + 거절 샘플링 =====

/// 씨앗이 같으면 같은 코드 순서를 낸다(테스트 재현용). 암호학적으로 안전한 난수는 아니다.
pub struct CodeGen {
    state: u64,
}

impl CodeGen {
    pub fn from_seed(seed: u64) -> Self {
        Self { state: seed }
    }

    /// 프로세스마다 다른 씨앗. std의 RandomState 키와 현재 시각을 섞는다.
    pub fn from_entropy() -> Self {
        Self::from_seed(RandomState::new().hash_one(std::time::SystemTime::now()))
    }

    fn next_u64(&mut self) -> u64 {
        self.state = self.state.wrapping_add(0x9E37_79B9_7F4A_7C15);
        let mut z = self.state;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
        z ^ (z >> 31)
    }

    pub fn next_code(&mut self) -> Code {
        let mut out = String::with_capacity(CODE_LEN);
        while out.len() < CODE_LEN {
            for b in self.next_u64().to_le_bytes() {
                // 248 = 62 × 4. 248 이상을 버려야 62글자가 모두 같은 확률로 나온다.
                if b < 248 && out.len() < CODE_LEN {
                    out.push(char::from(ALPHABET[usize::from(b % 62)]));
                }
            }
        }
        Code(out)
    }
}

// ===== 6. 스스로 확인 =====

fn self_check() {
    let ok = Url::parse("  https://example.com/a?b=c  ").expect("valid url");
    assert_eq!(ok.as_str(), "https://example.com/a?b=c");
    assert!(Url::parse("HTTP://Example.com").is_ok());
    let cases = [
        ("", DomainError::EmptyUrl),
        ("javascript:alert(1)", DomainError::UnsupportedScheme),
        ("ftp://example.com", DomainError::UnsupportedScheme),
        ("https://", DomainError::MissingHost),
        ("https://:8080/x", DomainError::MissingHost),
        ("https://bank.com@evil.example/", DomainError::UserInfo),
        (
            "https://exa mple.com",
            DomainError::InvalidCharacter { index: 11 },
        ),
        (
            "https://예시.com",
            DomainError::InvalidCharacter { index: 8 },
        ),
    ];
    for (input, want) in cases {
        assert_eq!(Url::parse(input), Err(want), "input {input:?}");
    }
    let long = format!("https://a.com/{}", "x".repeat(MAX_URL_LEN));
    assert!(matches!(
        Url::parse(&long),
        Err(DomainError::UrlTooLong { max: 2048, .. })
    ));

    assert!(Code::parse("aZ09xyz").is_ok());
    for bad in ["", "abc", "abcdefgh", "abc-def", "abcdéf"] {
        assert_eq!(Code::parse(bad), Err(DomainError::InvalidCode), "{bad:?}");
    }

    let mut a = CodeGen::from_seed(42);
    let mut b = CodeGen::from_seed(42);
    let first = a.next_code();
    assert_eq!(first, b.next_code());
    println!("seed 42의 첫 코드: {first}");
    let mut g = CodeGen::from_entropy();
    let mut counts = [0u32; 62];
    for _ in 0..10_000 {
        let c = g.next_code();
        assert_eq!(Code::parse(c.as_str()), Ok(c.clone()));
        for byte in c.as_str().bytes() {
            let i = ALPHABET
                .iter()
                .position(|&x| x == byte)
                .expect("in alphabet");
            counts[i] += 1;
        }
    }
    // 70,000글자 / 62 ≈ 1,129. 모든 글자가 고르게 나오는지 넉넉한 범위로 본다.
    let (min, max) = (counts.iter().min(), counts.iter().max());
    println!("글자별 등장 횟수: 최소 {min:?}, 최대 {max:?}");
    assert!(counts.iter().all(|&n| (900..1400).contains(&n)));
    println!("에러 메시지 예: {}", DomainError::InvalidCode);
}

fn main() {
    self_check();
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;
    use proptest::prelude::*;

    #[test]
    fn self_check_passes() {
        self_check();
    }

    proptest! {
        #[test]
        fn generated_codes_always_parse(seed in any::<u64>()) {
            let mut g = CodeGen::from_seed(seed);
            for _ in 0..20 {
                let c = g.next_code();
                prop_assert_eq!(Code::parse(c.as_str()), Ok(c.clone()));
            }
        }

        // 아무 문자열(".{0,64}")만 쓰면 256개 중 0개가 검사를 통과해 아래 불변식은 한 번도 확인되지 않는다.
        // 절반은 아무 문자열(panic 없음 확인), 절반은 스킴을 붙인 문자열(절반쯤 통과)로 만든다.
        #[test]
        fn url_parse_never_panics_and_keeps_invariants(
            s in prop_oneof![".{0,64}", "(?i:https?)://[ -~]{0,40}(?s:.)?"]
        ) {
            if let Ok(u) = Url::parse(&s) {
                prop_assert!(u.as_str().len() <= MAX_URL_LEN);
                prop_assert!(u.as_str().bytes().all(|b| (0x21..=0x7e).contains(&b)));
                prop_assert!(u.as_str().to_ascii_lowercase().starts_with("http"));
            }
        }

        #[test]
        fn plain_http_urls_are_accepted(host in "[a-z]{1,20}", path in "[A-Za-z0-9/_-]{0,40}") {
            let input = format!("https://{host}.com/{path}");
            prop_assert_eq!(Url::parse(&input).map(|u| u.to_string()), Ok(input));
        }
    }
}
```
{% endraw %}
