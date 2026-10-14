---
layout: "note"
title: "30_errors-memory-practice_p2.rs"
display_title: "30_errors-memory-practice_p2.rs"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "30"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/errors-memory-practice/"
parent_title: "에러와 메모리 연습"
description: "Rust · 에러와 메모리 연습 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/30_errors-memory-practice_p2/"
---
{% raw %}
[에러와 메모리 연습](/Hongs_Blog/studies/rust/errors-memory-practice/) 문서의 문제 2 풀이 코드다.

```rust
//! 연습 p2: anyhow로 설정을 읽는 애플리케이션 코드의 출력({} / {:#} / {:?})을 예측하고,
//! 종료 코드를 에러 종류에 따라 고르는 풀이.
//! 의존성: anyhow = "1"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/30_errors-memory-practice_p2.rs"

use anyhow::{Context, Result, bail, ensure};

struct Settings {
    workers: u32,
    db_url: String,
}

fn get<'a>(text: &'a str, key: &str) -> Option<&'a str> {
    text.lines()
        .filter_map(|l| l.split_once('='))
        .find(|(k, _)| k.trim() == key)
        .map(|(_, v)| v.trim())
}

fn load(text: &str) -> Result<Settings> {
    let workers: u32 = get(text, "workers")
        .context("`workers` is missing")?
        .parse()
        .context("`workers` must be a number")?;
    ensure!(
        (1..=64).contains(&workers),
        "`workers` must be 1..=64, got {workers}"
    );
    let db_url = get(text, "db_url").unwrap_or("sqlite::memory:").to_string();
    if !db_url.starts_with("sqlite:") {
        bail!("only sqlite is supported: {db_url}");
    }
    Ok(Settings { workers, db_url })
}

fn start(text: &str) -> Result<String> {
    let s = load(text).context("failed to load settings")?;
    Ok(format!("{} workers on {}", s.workers, s.db_url))
}

/// 풀이 (나): 설정 문제는 78(EX_CONFIG 관례), 나머지는 1.
fn exit_code(e: &anyhow::Error) -> i32 {
    if e.chain()
        .any(|c| c.downcast_ref::<std::num::ParseIntError>().is_some())
    {
        78
    } else {
        1
    }
}

fn main() {
    assert_eq!(start("workers=4").unwrap(), "4 workers on sqlite::memory:");

    let e = start("workers=four").unwrap_err();
    println!("{{}}:   {e}");
    println!("{{:#}}: {e:#}");
    println!("{{:?}}:\n{e:?}");
    assert_eq!(e.to_string(), "failed to load settings");
    assert_eq!(
        format!("{e:#}"),
        "failed to load settings: `workers` must be a number: invalid digit found in string"
    );
    assert_eq!(
        format!("{e:?}"),
        "failed to load settings\n\nCaused by:\n    0: `workers` must be a number\n    1: invalid digit found in string"
    );

    assert_eq!(
        format!("{:#}", start("workers=0").unwrap_err()),
        "failed to load settings: `workers` must be 1..=64, got 0"
    );
    assert_eq!(
        format!("{:#}", start("db_url=postgres://x").unwrap_err()),
        "failed to load settings: `workers` is missing"
    );
    assert_eq!(
        format!("{:#}", start("workers=2\ndb_url=postgres://x").unwrap_err()),
        "failed to load settings: only sqlite is supported: postgres://x"
    );

    assert_eq!(exit_code(&start("workers=four").unwrap_err()), 78);
    assert_eq!(exit_code(&start("workers=0").unwrap_err()), 1);
    println!("종료 코드: 78, 1");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn chain_length() {
        assert_eq!(start("workers=x").unwrap_err().chain().count(), 3);
        assert_eq!(start("workers=0").unwrap_err().chain().count(), 2);
    }
}
```
{% endraw %}
