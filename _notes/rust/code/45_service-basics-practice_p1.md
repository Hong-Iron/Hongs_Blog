---
layout: "note"
title: "45_service-basics-practice_p1.rs"
display_title: "45_service-basics-practice_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "45"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/service-basics-practice/"
parent_title: "서비스 기초 연습"
description: "Rust · 서비스 기초 연습 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/45_service-basics-practice_p1/"
---
{% raw %}
[서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/) 문서의 문제 1 풀이 코드다.

```rust
//! 서비스 기초 연습 p1: 환경 값에서 설정을 읽고, 오류를 모두 모아 보고하고, 관리자 비밀번호를 가린다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/45_service-basics-practice_p1.rs"

use std::collections::HashMap;
use std::fmt;

#[derive(Clone)]
pub struct Secret(String);

impl Secret {
    pub fn expose(&self) -> &str {
        &self.0
    }
}

impl fmt::Debug for Secret {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("Secret([REDACTED])")
    }
}

#[derive(Debug)]
pub struct Limits {
    pub max_body_kb: u32,
    pub allowed_origins: Vec<String>,
    pub admin_password: Secret,
}

pub fn load(env: &HashMap<&str, &str>) -> Result<Limits, Vec<String>> {
    let mut errs = Vec::new();

    // 하위목표 1: 기본값이 있는 숫자
    let max_body_kb = match env.get("APP_MAX_BODY_KB") {
        None => 64,
        Some(v) => match v.parse::<u32>() {
            Ok(n) if (1..=10_240).contains(&n) => n,
            _ => {
                errs.push(format!("APP_MAX_BODY_KB={v:?}: expected 1..=10240"));
                0
            }
        },
    };

    // 하위목표 2: 쉼표로 나눈 목록, 항목마다 검사
    let allowed_origins: Vec<String> = env
        .get("APP_ALLOWED_ORIGINS")
        .map(|v| {
            v.split(',')
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect()
        })
        .unwrap_or_default();
    if allowed_origins.is_empty() {
        errs.push("APP_ALLOWED_ORIGINS is required".to_string());
    }
    for o in &allowed_origins {
        if !(o.starts_with("http://") || o.starts_with("https://")) {
            errs.push(format!(
                "APP_ALLOWED_ORIGINS item {o:?}: must start with http:// or https://"
            ));
        }
    }

    // 하위목표 3: 비밀값. 오류 메시지에 값을 넣지 않는다.
    let admin_password = match env.get("APP_ADMIN_PASSWORD") {
        None => {
            errs.push("APP_ADMIN_PASSWORD is required".to_string());
            None
        }
        Some(p) if p.chars().count() < 12 => {
            errs.push("APP_ADMIN_PASSWORD: must be at least 12 characters".to_string());
            None
        }
        Some(p) => Some(Secret(p.to_string())),
    };

    match admin_password {
        Some(admin_password) if errs.is_empty() => Ok(Limits {
            max_body_kb,
            allowed_origins,
            admin_password,
        }),
        _ => Err(errs),
    }
}

fn main() {
    let good: HashMap<&str, &str> = [
        (
            "APP_ALLOWED_ORIGINS",
            "https://a.example, http://localhost:5173",
        ),
        ("APP_ADMIN_PASSWORD", "correct-horse-battery"),
    ]
    .into();
    let l = load(&good).expect("valid");
    let dbg = format!("{l:?}");
    println!("{dbg}");
    assert_eq!(l.max_body_kb, 64);
    assert_eq!(
        l.allowed_origins,
        ["https://a.example", "http://localhost:5173"]
    );
    assert!(!dbg.contains("correct-horse"));
    assert_eq!(l.admin_password.expose(), "correct-horse-battery");

    let bad: HashMap<&str, &str> = [
        ("APP_MAX_BODY_KB", "0"),
        ("APP_ALLOWED_ORIGINS", "https://a.example,ftp://x"),
        ("APP_ADMIN_PASSWORD", "hunter2"),
    ]
    .into();
    let errs = load(&bad).unwrap_err();
    for e in &errs {
        println!("  - {e}");
    }
    assert_eq!(errs.len(), 3);
    assert!(!errs.join("\n").contains("hunter2"));
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_env_reports_two_missing() {
        let errs = load(&HashMap::new()).unwrap_err();
        assert_eq!(
            errs,
            [
                "APP_ALLOWED_ORIGINS is required",
                "APP_ADMIN_PASSWORD is required"
            ]
        );
    }

    #[test]
    fn non_number_body_limit() {
        let env: HashMap<&str, &str> = [
            ("APP_MAX_BODY_KB", "lots"),
            ("APP_ALLOWED_ORIGINS", "https://a"),
            ("APP_ADMIN_PASSWORD", "123456789012"),
        ]
        .into();
        assert_eq!(
            load(&env).unwrap_err(),
            ["APP_MAX_BODY_KB=\"lots\": expected 1..=10240"]
        );
    }
}
```
{% endraw %}
