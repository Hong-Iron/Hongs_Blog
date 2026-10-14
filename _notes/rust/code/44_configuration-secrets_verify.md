---
layout: "note"
title: "44_configuration-secrets_verify.rs"
display_title: "44_configuration-secrets_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "44"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/configuration-secrets/"
parent_title: "설정과 비밀값"
description: "Rust · 설정과 비밀값 검증 코드"
sitemap: false
permalink: "/studies/rust/code/44_configuration-secrets_verify/"
---
{% raw %}
[설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/) 문서의 검증 코드다.

```rust
//! 환경 변수에서 타입 있는 설정을 읽고, 시작할 때 한 번에 검사해 틀리면 바로 멈춘다(fail fast).
//! 비밀값은 Secret<T>로 감싸 Debug·Display가 가려진 글자만 찍게 한다.
//! env::var(..).unwrap()의 panic 메시지에 변수 이름이 없는 것도 확인한다.
//! 의존성: thiserror = "2"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/44_configuration-secrets_verify.rs"

use std::collections::HashMap;
use std::fmt;
use std::net::SocketAddr;
use std::time::Duration;

mod secret {
    use std::fmt;

    /// 비밀값 감싸개. 안의 값은 expose()로만 꺼낸다. 필드가 private이라 `.0`으로 꺼낼 수 없다.
    #[derive(Clone)]
    pub struct Secret<T>(T);

    impl<T> Secret<T> {
        pub fn new(value: T) -> Self {
            Secret(value)
        }
        /// 비밀값을 꺼내는 길을 이 메서드 하나로 모은다. 검색 한 번으로 꺼내는 곳을 모두 찾는다.
        pub fn expose(&self) -> &T {
            &self.0
        }
    }

    impl<T> fmt::Debug for Secret<T> {
        fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            f.write_str("Secret([REDACTED])")
        }
    }

    impl<T> fmt::Display for Secret<T> {
        fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            f.write_str("[REDACTED]")
        }
    }
}

use secret::Secret;

#[derive(Debug, Clone, PartialEq, Eq)]
enum Env {
    Dev,
    Prod,
}

#[derive(Debug)]
struct Config {
    bind_addr: SocketAddr,
    database_url: Secret<String>,
    api_token: Secret<String>,
    request_timeout: Duration,
    env: Env,
}

#[derive(Debug, thiserror::Error, PartialEq)]
enum ConfigError {
    #[error("{0} is required")]
    Missing(&'static str),
    #[error("{key} has invalid value {value:?}: {reason}")]
    Invalid {
        key: &'static str,
        value: String,
        reason: &'static str,
    },
}

/// 모든 오류를 모아서 한 번에 보여 준다. 첫 오류에서 멈추면 고치고 다시 띄우기를 여러 번 해야 한다.
#[derive(Debug)]
struct ConfigErrors(Vec<ConfigError>);

impl fmt::Display for ConfigErrors {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        writeln!(f, "invalid configuration ({} problems):", self.0.len())?;
        for e in &self.0 {
            writeln!(f, "  - {e}")?;
        }
        Ok(())
    }
}

impl std::error::Error for ConfigErrors {}

impl Config {
    /// lookup은 "이름 -> 값"을 돌려주는 함수. 운영에서는 std::env::var, 테스트에서는 HashMap.
    fn from_lookup(lookup: impl Fn(&str) -> Option<String>) -> Result<Config, ConfigErrors> {
        let mut errs = Vec::new();

        let bind_addr = match lookup("APP_BIND_ADDR") {
            None => Some(SocketAddr::from(([127, 0, 0, 1], 8080))), // 기본값
            Some(v) => match v.parse() {
                Ok(a) => Some(a),
                Err(_) => {
                    errs.push(ConfigError::Invalid {
                        key: "APP_BIND_ADDR",
                        value: v,
                        reason: "expected host:port",
                    });
                    None
                }
            },
        };

        let database_url = lookup("DATABASE_URL").map(Secret::new);
        if database_url.is_none() {
            errs.push(ConfigError::Missing("DATABASE_URL"));
        }

        // 비밀값은 잘못돼도 값 자체를 오류 메시지에 넣지 않는다.
        let api_token = match lookup("APP_API_TOKEN") {
            None => {
                errs.push(ConfigError::Missing("APP_API_TOKEN"));
                None
            }
            Some(t) if t.len() < 16 => {
                errs.push(ConfigError::Invalid {
                    key: "APP_API_TOKEN",
                    value: "[REDACTED]".into(),
                    reason: "must be at least 16 characters",
                });
                None
            }
            Some(t) => Some(Secret::new(t)),
        };

        let request_timeout = match lookup("APP_TIMEOUT_MS").map(|v| (v.parse::<u64>(), v)) {
            None => Some(Duration::from_millis(5_000)),
            Some((Ok(ms), _)) if (1..=60_000).contains(&ms) => Some(Duration::from_millis(ms)),
            Some((_, v)) => {
                errs.push(ConfigError::Invalid {
                    key: "APP_TIMEOUT_MS",
                    value: v,
                    reason: "expected 1..=60000",
                });
                None
            }
        };

        let env = match lookup("APP_ENV").as_deref() {
            None | Some("dev") => Some(Env::Dev),
            Some("prod") => Some(Env::Prod),
            Some(other) => {
                errs.push(ConfigError::Invalid {
                    key: "APP_ENV",
                    value: other.into(),
                    reason: "expected dev or prod",
                });
                None
            }
        };

        // 여러 값을 함께 봐야 하는 규칙: 운영에서는 외부에 열린 주소만 허용.
        if let (Some(Env::Prod), Some(a)) = (&env, &bind_addr)
            && a.ip().is_loopback()
        {
            errs.push(ConfigError::Invalid {
                key: "APP_BIND_ADDR",
                value: a.to_string(),
                reason: "prod must not bind to loopback",
            });
        }

        match (bind_addr, database_url, api_token, request_timeout, env) {
            (
                Some(bind_addr),
                Some(database_url),
                Some(api_token),
                Some(request_timeout),
                Some(env),
            ) if errs.is_empty() => Ok(Config {
                bind_addr,
                database_url,
                api_token,
                request_timeout,
                env,
            }),
            _ => Err(ConfigErrors(errs)),
        }
    }

    fn from_env() -> Result<Config, ConfigErrors> {
        Config::from_lookup(|k| std::env::var(k).ok())
    }
}

fn map(pairs: &[(&str, &str)]) -> HashMap<String, String> {
    pairs
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_string()))
        .collect()
}

fn load(pairs: &[(&str, &str)]) -> Result<Config, ConfigErrors> {
    let m = map(pairs);
    Config::from_lookup(|k| m.get(k).cloned())
}

/// 시작 순서: 설정 → (실패면 여기서 끝) → 소켓 열기. 설정이 틀리면 포트를 열기 전에 멈춘다.
fn start(pairs: &[(&str, &str)], log: &mut Vec<String>) -> Result<(), ConfigErrors> {
    let cfg = load(pairs)?;
    log.push(format!("config loaded: {cfg:?}"));
    log.push(format!("binding {}", cfg.bind_addr));
    Ok(())
}

fn compile_errors(code: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr_{}_{}", std::process::id(), code.len()));
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

const TOKEN: &str = "tok_live_0123456789abcdef";

fn main() {
    let mut ok = true;
    let mut check = |cond: bool, what: String| {
        println!("[{}] {what}", if cond { "ok" } else { "FAIL" });
        ok &= cond;
    };

    // 1. 필수값만 주면 나머지는 기본값.
    let cfg = load(&[
        ("DATABASE_URL", "sqlite://app.db?password=pw1"),
        ("APP_API_TOKEN", TOKEN),
    ])
    .expect("ok");
    check(
        cfg.bind_addr.to_string() == "127.0.0.1:8080"
            && cfg.request_timeout == Duration::from_secs(5)
            && cfg.env == Env::Dev,
        "기본값: 127.0.0.1:8080, 5초, dev".into(),
    );
    let dbg = format!("{cfg:?}");
    println!("    {dbg}");
    check(
        !dbg.contains(TOKEN) && !dbg.contains("pw1"),
        "Debug에 토큰과 DB 비밀번호가 없다".into(),
    );
    check(
        format!("{}", cfg.api_token) == "[REDACTED]",
        "Display도 가린다".into(),
    );
    check(
        cfg.api_token.expose() == TOKEN,
        "expose()로만 진짜 값을 꺼낸다".into(),
    );
    check(
        cfg.database_url.expose().starts_with("sqlite://"),
        "DB 주소도 expose()로 꺼낸다".into(),
    );

    // 2. 여러 오류를 한꺼번에 모은다.
    let err = load(&[
        ("APP_BIND_ADDR", "localhost"),
        ("APP_API_TOKEN", "short-secret"),
        ("APP_TIMEOUT_MS", "0"),
    ])
    .unwrap_err();
    let text = err.to_string();
    println!("{text}");
    check(
        err.0.len() == 4,
        format!("오류 {}개를 한 번에 보고", err.0.len()),
    );
    check(
        err.0.contains(&ConfigError::Missing("DATABASE_URL")),
        "DATABASE_URL 누락".into(),
    );
    check(
        !text.contains("short-secret"),
        "잘못된 비밀값도 오류 메시지에 찍지 않는다".into(),
    );

    // 3. 여러 값을 함께 보는 규칙.
    let err = load(&[
        ("DATABASE_URL", "x"),
        ("APP_API_TOKEN", TOKEN),
        ("APP_ENV", "prod"),
    ])
    .unwrap_err();
    check(
        err.to_string().contains("prod must not bind to loopback"),
        "prod인데 127.0.0.1이면 거부".into(),
    );
    check(
        load(&[
            ("DATABASE_URL", "x"),
            ("APP_API_TOKEN", TOKEN),
            ("APP_ENV", "prod"),
            ("APP_BIND_ADDR", "0.0.0.0:80"),
        ])
        .is_ok(),
        "prod + 0.0.0.0:80은 통과".into(),
    );

    // 4. fail fast: 설정이 틀리면 소켓 단계까지 가지 않는다.
    let mut log = Vec::new();
    let r = start(&[("APP_API_TOKEN", TOKEN)], &mut log);
    check(
        r.is_err() && log.is_empty(),
        "설정 실패 시 binding 로그 없음".into(),
    );
    let r = start(&[("DATABASE_URL", "x"), ("APP_API_TOKEN", TOKEN)], &mut log);
    check(
        r.is_ok() && log.len() == 2 && !log[0].contains(TOKEN),
        "성공 시 로그에도 토큰 없음".into(),
    );

    // 5. 진짜 환경 변수 읽기: 이 프로세스에는 DATABASE_URL이 없다고 가정하지 않고, 결과 타입만 확인한다.
    let from_env = Config::from_env();
    check(
        from_env.is_ok() || !from_env.as_ref().unwrap_err().0.is_empty(),
        "from_env()는 std::env::var로 같은 검사를 한다".into(),
    );

    // 5-1. 흔한 실수: env::var(..).unwrap()의 panic 메시지에는 변수 이름이 없다.
    let prev = std::panic::take_hook();
    std::panic::set_hook(Box::new(|_| {}));
    let caught = std::panic::catch_unwind(|| std::env::var("VAULT_SURELY_MISSING_VAR").unwrap());
    std::panic::set_hook(prev);
    let panic_msg = caught
        .err()
        .and_then(|e| e.downcast_ref::<String>().cloned())
        .unwrap_or_default();
    println!("    unwrap panic: {panic_msg}");
    check(
        panic_msg.contains("NotPresent") && !panic_msg.contains("VAULT_SURELY_MISSING_VAR"),
        "unwrap() panic은 NotPresent만 말하고 어떤 변수인지 말하지 않는다".into(),
    );

    // 6. 컴파일러가 막아 주는 것.
    let base = "mod secret { pub struct Secret<T>(T); impl<T> Secret<T> { pub fn new(v: T) -> Self { Secret(v) } } }\n";
    let e = compile_errors(&format!(
        "{base}pub fn f() -> String {{ let s = secret::Secret::new(String::new()); s.0 }}"
    ));
    check(e.contains("E0616"), "모듈 밖에서 s.0 접근 -> E0616".into());
    let e = compile_errors("pub fn f() { std::env::set_var(\"K\", \"V\"); }");
    check(
        e.contains("E0133"),
        "2024 에디션: unsafe 없이 set_var -> E0133".into(),
    );

    assert!(ok);
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn debug_redacts_secret() {
        let s = Secret::new("abc".to_string());
        assert_eq!(format!("{s:?}"), "Secret([REDACTED])");
        assert_eq!(format!("{s}"), "[REDACTED]");
    }

    #[test]
    fn invalid_timeout_reported_with_key() {
        let err = load(&[
            ("DATABASE_URL", "x"),
            ("APP_API_TOKEN", TOKEN),
            ("APP_TIMEOUT_MS", "abc"),
        ])
        .unwrap_err();
        assert_eq!(err.0.len(), 1);
        assert!(
            err.to_string()
                .contains("APP_TIMEOUT_MS has invalid value \"abc\"")
        );
    }
}
```
{% endraw %}
