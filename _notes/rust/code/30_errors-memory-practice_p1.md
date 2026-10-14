---
layout: "note"
title: "30_errors-memory-practice_p1.rs"
display_title: "30_errors-memory-practice_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "30"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/errors-memory-practice/"
parent_title: "에러와 메모리 연습"
description: "Rust · 에러와 메모리 연습 문제 1 풀이 코드"
permalink: "/studies/rust/code/30_errors-memory-practice_p1/"
---
{% raw %}
[에러와 메모리 연습](/Hongs_Blog/studies/rust/errors-memory-practice/) 문서의 문제 1 풀이 코드다.

```rust
//! 연습 p1: unwrap으로 가득한 CSV 한 줄 파서를 thiserror 에러 enum과 ?로 고친 풀이.
//! 의존성: thiserror = "2"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/30_errors-memory-practice_p1.rs"

use std::num::ParseIntError;

#[derive(Debug, PartialEq)]
pub struct User {
    pub name: String,
    pub age: u8,
}

/// 문제의 원래 코드(고치기 전). 잘못된 입력에서 panic한다.
pub fn parse_user_unwrap(line: &str) -> User {
    let mut parts = line.split(',');
    let name = parts.next().unwrap().trim().to_string();
    let age = parts.next().unwrap().trim().parse().unwrap();
    User { name, age }
}

#[derive(Debug, thiserror::Error, PartialEq)]
#[non_exhaustive]
pub enum UserError {
    #[error("missing field `{0}`")]
    Missing(&'static str),
    #[error("name is empty")]
    EmptyName,
    #[error("invalid age")]
    BadAge(#[from] ParseIntError),
}

/// 풀이.
pub fn parse_user(line: &str) -> Result<User, UserError> {
    let mut parts = line.split(',');
    let name = parts.next().ok_or(UserError::Missing("name"))?.trim();
    if name.is_empty() {
        return Err(UserError::EmptyName);
    }
    let age = parts
        .next()
        .ok_or(UserError::Missing("age"))?
        .trim()
        .parse()?;
    Ok(User {
        name: name.to_string(),
        age,
    })
}

fn source_text(e: &UserError) -> Option<String> {
    std::error::Error::source(e).map(|s| s.to_string())
}

fn main() {
    assert_eq!(
        parse_user("kim, 30"),
        Ok(User {
            name: "kim".into(),
            age: 30
        })
    );
    assert_eq!(parse_user_unwrap("kim, 30").age, 30);

    let cases = ["kim", ", 3", "lee, -1", "park, 300", "choi, x"];
    let got: Vec<String> = cases
        .iter()
        .map(|c| match parse_user(c) {
            Ok(u) => format!("ok {u:?}"),
            Err(e) => format!("{e} / {:?}", source_text(&e)),
        })
        .collect();
    for (c, g) in cases.iter().zip(&got) {
        println!("{c:?} -> {g}");
    }
    assert_eq!(got[0], "missing field `age` / None");
    assert_eq!(got[1], "name is empty / None");
    assert_eq!(
        got[2],
        "invalid age / Some(\"invalid digit found in string\")"
    );
    assert_eq!(
        got[3],
        "invalid age / Some(\"number too large to fit in target type\")"
    );
    assert_eq!(
        got[4],
        "invalid age / Some(\"invalid digit found in string\")"
    );

    // 원래 코드는 같은 입력에서 panic한다
    std::panic::set_hook(Box::new(|_| {}));
    let panics = cases
        .iter()
        .filter(|c| std::panic::catch_unwind(|| parse_user_unwrap(c)).is_err())
        .count();
    let _ = std::panic::take_hook();
    // ", 3"은 이름이 빈 문자열인 채로 통과한다(원래 코드는 빈 이름을 막지 않는다)
    assert_eq!(panics, 4);
    println!("원래 코드: 5개 중 4개 입력에서 panic, 1개는 빈 이름을 그대로 받아들임");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extra_fields_are_ignored() {
        assert_eq!(parse_user("a,1,zzz").map(|u| u.age), Ok(1));
    }

    #[test]
    fn empty_line_is_empty_name() {
        // "".split(',')는 빈 조각 하나를 준다
        assert_eq!(parse_user(""), Err(UserError::EmptyName));
    }
}
```
{% endraw %}
