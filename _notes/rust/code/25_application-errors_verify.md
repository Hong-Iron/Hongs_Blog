---
layout: "note"
title: "25_application-errors_verify.rs"
display_title: "25_application-errors_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/application-errors/"
parent_title: "애플리케이션 에러 처리"
description: "Rust · 애플리케이션 에러 처리 검증 코드"
sitemap: false
permalink: "/studies/rust/code/25_application-errors_verify/"
---
{% raw %}
[애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/) 문서의 검증 코드다.

```rust
//! anyhow로 하는 애플리케이션 에러 처리: Context/with_context, bail!, ensure!,
//! {} / {:#} / {:?} 출력 형식, chain()과 root_cause(), downcast_ref로 라이브러리 에러 되찾기,
//! 그리고 HTTP 상태 코드처럼 "종류별로 다르게 처리"해야 할 때의 경계를 확인한다.
//! 의존성: anyhow = "1", thiserror = "2"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/25_application-errors_verify.rs"

use anyhow::{Context, Result, bail, ensure};

/// 라이브러리 쪽 에러(24번 문서처럼 thiserror로 만든 것)라고 생각한다.
#[derive(Debug, thiserror::Error)]
enum StoreError {
    #[error("record {0} not found")]
    NotFound(u32),
    #[error("store is read-only")]
    ReadOnly,
}

fn store_get(id: u32) -> Result<String, StoreError> {
    match id {
        1 => Ok("alice".into()),
        2 => Err(StoreError::ReadOnly),
        _ => Err(StoreError::NotFound(id)),
    }
}

fn parse_id(raw: &str) -> Result<u32> {
    let id: u32 = raw
        .trim()
        .parse()
        .with_context(|| format!("invalid id {raw:?}"))?;
    ensure!(id != 0, "id must be positive");
    Ok(id)
}

fn handle(raw: &str) -> Result<String> {
    if raw.is_empty() {
        bail!("empty request");
    }
    let id = parse_id(raw).context("bad request")?;
    let name = store_get(id).with_context(|| format!("failed to load user {id}"))?;
    Ok(name)
}

/// 애플리케이션 경계(예: HTTP 핸들러)에서 종류별로 상태 코드를 고른다.
fn status_of(err: &anyhow::Error) -> u16 {
    // chain 전체에서 라이브러리 에러를 찾는다. context로 감싸도 찾을 수 있다.
    for cause in err.chain() {
        if let Some(se) = cause.downcast_ref::<StoreError>() {
            return match se {
                StoreError::NotFound(_) => 404,
                StoreError::ReadOnly => 503,
            };
        }
        if cause.downcast_ref::<std::num::ParseIntError>().is_some() {
            return 400;
        }
    }
    500
}

fn main() {
    assert_eq!(handle("1").unwrap(), "alice");

    let e = handle("abc").unwrap_err();
    let plain = format!("{e}");
    let alt = format!("{e:#}");
    let dbg = format!("{e:?}");
    println!("{{}}   => {plain}");
    println!("{{:#}} => {alt}");
    println!("{{:?}} =>\n{dbg}");
    assert_eq!(plain, "bad request");
    assert_eq!(
        alt,
        "bad request: invalid id \"abc\": invalid digit found in string"
    );
    // {:?}는 맨 바깥 메시지, 빈 줄, "Caused by:" 목록. (RUST_BACKTRACE가 없으면 백트레이스는 없다)
    assert!(dbg.starts_with("bad request\n\nCaused by:\n"), "{dbg}");
    assert!(dbg.contains("    0: invalid id \"abc\"\n"), "{dbg}");
    assert!(
        dbg.contains("    1: invalid digit found in string"),
        "{dbg}"
    );

    let causes: Vec<String> = e.chain().map(|c| c.to_string()).collect();
    assert_eq!(
        causes,
        vec![
            "bad request",
            "invalid id \"abc\"",
            "invalid digit found in string"
        ]
    );
    assert_eq!(e.root_cause().to_string(), "invalid digit found in string");

    // bail!, ensure!
    assert_eq!(handle("").unwrap_err().to_string(), "empty request");
    assert_eq!(
        format!("{:#}", handle("0").unwrap_err()),
        "bad request: id must be positive"
    );

    // context를 덧대도 원래 라이브러리 에러를 되찾을 수 있다
    let e = handle("7").unwrap_err();
    assert_eq!(
        format!("{e:#}"),
        "failed to load user 7: record 7 not found"
    );
    assert!(e.downcast_ref::<StoreError>().is_some());
    assert!(matches!(
        e.downcast_ref::<StoreError>(),
        Some(StoreError::NotFound(7))
    ));

    // 경계에서 상태 코드 고르기
    assert_eq!(status_of(&handle("7").unwrap_err()), 404);
    assert_eq!(status_of(&handle("2").unwrap_err()), 503);
    assert_eq!(status_of(&handle("x").unwrap_err()), 400);
    assert_eq!(status_of(&handle("").unwrap_err()), 500); // bail!은 문자열뿐이라 종류를 모른다
    assert_eq!(status_of(&handle("0").unwrap_err()), 500); // ensure!도 마찬가지
    println!("상태 코드: 404, 503, 400, 500, 500");

    // anyhow::Error는 Send + Sync + 'static
    fn needs<T: Send + Sync + 'static>() {}
    needs::<anyhow::Error>();

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn context_does_not_hide_source() {
        let e = handle("9").unwrap_err();
        assert_eq!(e.chain().count(), 2);
        assert_eq!(status_of(&e), 404);
    }
}
```
{% endraw %}
