---
layout: "note"
title: "14_data-modeling-practice_p3.rs"
display_title: "14_data-modeling-practice_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "14"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/data-modeling-practice/"
parent_title: "데이터 모델링 연습"
description: "Rust · 데이터 모델링 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/14_data-modeling-practice_p3/"
---
{% raw %}
[데이터 모델링 연습](/Hongs_Blog/studies/rust/data-modeling-practice/) 문서의 문제 3 풀이 코드다.

```rust
//! p3 설정 파싱: `key = value` 줄을 읽어 Config로 바꾼다. 실패는 줄 번호를 담은 에러 열거형,
//! 빠진 값은 Option과 ok_or, 기본값은 unwrap_or, 0이 아닌 포트는 NonZero<u16>.
//! 변형: workers = 0은 지금 통과한다. NonZero는 FromStr을 구현하므로 parse::<NonZero<_>>로 0을 한 번에 거른다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/14_data-modeling-practice_p3.rs"

use std::collections::HashMap;
use std::num::NonZero;

#[derive(Debug, PartialEq)]
struct Config {
    host: String,
    port: NonZero<u16>,
    workers: usize,
}

#[derive(Debug, PartialEq)]
enum ConfigError {
    BadLine { line: usize, text: String },
    Duplicate { line: usize, key: String },
    Missing(&'static str),
    BadValue { key: &'static str, value: String },
}

fn parse_config(src: &str) -> Result<Config, ConfigError> {
    let mut map: HashMap<&str, &str> = HashMap::new();
    for (i, raw) in src.lines().enumerate() {
        let line = raw.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let Some((k, v)) = line.split_once('=') else {
            return Err(ConfigError::BadLine {
                line: i + 1,
                text: line.to_string(),
            });
        };
        let (k, v) = (k.trim(), v.trim());
        if map.insert(k, v).is_some() {
            return Err(ConfigError::Duplicate {
                line: i + 1,
                key: k.to_string(),
            });
        }
    }

    let host = map.get("host").ok_or(ConfigError::Missing("host"))?;
    let port_text = map.get("port").ok_or(ConfigError::Missing("port"))?;
    let port = port_text
        .parse::<u16>()
        .ok()
        .and_then(NonZero::new)
        .ok_or_else(|| ConfigError::BadValue {
            key: "port",
            value: port_text.to_string(),
        })?;
    let workers = match map.get("workers") {
        None => 4,
        Some(w) => w.parse::<usize>().map_err(|_| ConfigError::BadValue {
            key: "workers",
            value: w.to_string(),
        })?,
    };
    Ok(Config {
        host: host.to_string(),
        port,
        workers,
    })
}

/// 변형: workers도 0을 막는다. NonZero<usize>로 바로 parse한다.
fn parse_workers(text: Option<&str>) -> Result<NonZero<usize>, ConfigError> {
    match text {
        None => Ok(NonZero::new(4).expect("4는 0이 아니다")),
        Some(w) => w
            .parse::<NonZero<usize>>()
            .map_err(|_| ConfigError::BadValue {
                key: "workers",
                value: w.to_string(),
            }),
    }
}

fn main() {
    let ok = parse_config("# 서버\nhost = 0.0.0.0\nport = 8080\n");
    println!("{ok:?}");
    assert_eq!(
        ok,
        Ok(Config {
            host: "0.0.0.0".into(),
            port: NonZero::new(8080).unwrap(),
            workers: 4
        })
    );
    let cases = [
        (
            "host = a\nport 8080",
            "BadLine { line: 2, text: \"port 8080\" }",
        ),
        (
            "host = a\nport = 1\nhost = b",
            "Duplicate { line: 3, key: \"host\" }",
        ),
        ("port = 80", "Missing(\"host\")"),
        (
            "host = a\nport = 0",
            "BadValue { key: \"port\", value: \"0\" }",
        ),
        (
            "host = a\nport = 70000",
            "BadValue { key: \"port\", value: \"70000\" }",
        ),
        (
            "host = a\nport = 1\nworkers = many",
            "BadValue { key: \"workers\", value: \"many\" }",
        ),
    ];
    for (src, want) in cases {
        let got = format!("{:?}", parse_config(src).unwrap_err());
        println!("{got}");
        assert_eq!(got, want);
    }

    // 변형: 지금은 workers = 0이 통과한다
    assert_eq!(
        parse_config("host=a\nport=1\nworkers=0").unwrap().workers,
        0
    );
    assert_eq!(parse_workers(None).unwrap().get(), 4);
    assert_eq!(parse_workers(Some("16")).unwrap().get(), 16);
    assert_eq!(
        format!("{:?}", parse_workers(Some("0")).unwrap_err()),
        "BadValue { key: \"workers\", value: \"0\" }"
    );
    // port도 parse::<NonZero<u16>>() 한 번으로 같은 결과
    for t in ["0", "1", "8080", "65535", "65536", "70000", "-1", "abc", ""] {
        let two_steps = t.parse::<u16>().ok().and_then(NonZero::new);
        let one_step = t.parse::<NonZero<u16>>().ok();
        assert_eq!(two_steps, one_step, "{t}");
    }
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn workers_given() {
        let c = parse_config("host=h\nport=1\nworkers=16").unwrap();
        assert_eq!(c.workers, 16);
        assert_eq!(c.port.get(), 1);
    }
}
```
{% endraw %}
