---
layout: "note"
title: "23_error-propagation_verify.rs"
display_title: "23_error-propagation_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/error-propagation/"
parent_title: "물음표 연산자와 에러 전파"
description: "Rust · 물음표 연산자와 에러 전파 검증 코드"
permalink: "/studies/rust/code/23_error-propagation_verify/"
---
{% raw %}
[물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/) 문서의 검증 코드다.

```rust
//! `?`가 하는 일(From 변환, Option의 None 전파), 직접 쓴 match와 같은 결과, Box<dyn Error + Send + Sync>,
//! source() 사슬, main이 Err를 돌려줄 때의 종료 코드와 출력, 그리고 컴파일 오류(E0277)를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/23_error-propagation_verify.rs"

use std::error::Error;
use std::fmt;
use std::num::ParseIntError;

// ---------- 1. 직접 만든 에러 타입과 From ----------

#[derive(Debug)]
enum ConfigError {
    Missing(&'static str),
    BadNumber(ParseIntError),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ConfigError::Missing(key) => write!(f, "missing key `{key}`"),
            // 원인은 source()로 내보내므로 메시지에 다시 넣지 않는다.
            ConfigError::BadNumber(_) => write!(f, "port is not a number"),
        }
    }
}

impl Error for ConfigError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            ConfigError::Missing(_) => None,
            ConfigError::BadNumber(e) => Some(e),
        }
    }
}

impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadNumber(e)
    }
}

/// "port=8080" 같은 줄들에서 port 값을 찾는다.
fn find_port(text: &str) -> Option<&str> {
    let line = text.lines().find(|l| l.starts_with("port="))?; // None이면 바로 None을 돌려준다
    Some(line.trim_start_matches("port="))
}

/// `?` 버전: ParseIntError가 From을 거쳐 ConfigError로 바뀐다.
fn read_port(text: &str) -> Result<u16, ConfigError> {
    let raw = find_port(text).ok_or(ConfigError::Missing("port"))?;
    let port: u16 = raw.parse()?;
    Ok(port)
}

/// 같은 일을 match로 풀어 쓴 버전(참조서의 Err(e) => return Err(From::from(e))).
fn read_port_by_hand(text: &str) -> Result<u16, ConfigError> {
    let raw = match find_port(text) {
        Some(v) => v,
        None => return Err(ConfigError::Missing("port")),
    };
    let port: u16 = match raw.parse::<u16>() {
        Ok(v) => v,
        Err(e) => return Err(From::from(e)),
    };
    Ok(port)
}

// ---------- 2. Box<dyn Error + Send + Sync> ----------

type BoxError = Box<dyn Error + Send + Sync>;

fn parse_pair(s: &str) -> Result<(i32, i32), BoxError> {
    let (a, b) = s.split_once(',').ok_or("no comma")?; // &str도 From으로 BoxError가 된다
    let a: i32 = a.trim().parse()?; // ParseIntError -> BoxError
    let b: i32 = b.trim().parse()?;
    if b == 0 {
        return Err(format!("second value must not be zero: {s}").into()); // String -> BoxError
    }
    Ok((a, b))
}

// ---------- 3. source() 사슬 ----------

fn chain(e: &(dyn Error + 'static)) -> Vec<String> {
    let mut out = vec![e.to_string()];
    let mut cur = e.source();
    while let Some(inner) = cur {
        out.push(inner.to_string());
        cur = inner.source();
    }
    out
}

// ---------- 컴파일러 도우미 ----------

fn tmpdir(tag: &str) -> std::path::PathBuf {
    let dir = std::env::temp_dir().join(format!("vr23_{}_{}", std::process::id(), tag));
    std::fs::create_dir_all(&dir).expect("임시 폴더");
    dir
}

fn compile_errors(tag: &str, code: &str) -> String {
    let dir = tmpdir(tag);
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).expect("쓰기");
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

/// 바이너리로 컴파일해 실행하고 (종료 코드, stdout, stderr)를 돌려준다.
fn build_and_run(tag: &str, code: &str) -> (Option<i32>, String, String) {
    let dir = tmpdir(tag);
    let file = dir.join("main.rs");
    let exe = dir.join("prog");
    std::fs::write(&file, code).expect("쓰기");
    let out = std::process::Command::new("rustc")
        .args(["--edition", "2024", "-o"])
        .arg(&exe)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    assert!(
        out.status.success(),
        "{}",
        String::from_utf8_lossy(&out.stderr)
    );
    let run = std::process::Command::new(&exe).output().expect("실행");
    (
        run.status.code(),
        String::from_utf8_lossy(&run.stdout).into_owned(),
        String::from_utf8_lossy(&run.stderr).into_owned(),
    )
}

fn main() {
    // 1. ? 와 손으로 쓴 match는 모든 입력에서 같은 결과를 낸다.
    let inputs = [
        "port=8080",
        "host=a\nport=443",
        "port=http",
        "host=a",
        "port=70000",
    ];
    for s in inputs {
        let a = read_port(s).map_err(|e| e.to_string());
        let b = read_port_by_hand(s).map_err(|e| e.to_string());
        assert_eq!(a, b, "입력 {s:?}");
    }
    assert_eq!(read_port("port=8080").ok(), Some(8080));
    let e = read_port("port=http").unwrap_err();
    assert!(matches!(e, ConfigError::BadNumber(_)));
    assert_eq!(e.to_string(), "port is not a number");
    let e = read_port("host=a").unwrap_err();
    assert_eq!(e.to_string(), "missing key `port`");
    // 70000은 u16 범위를 넘는다.
    assert_eq!(
        chain(&read_port("port=70000").unwrap_err()),
        vec![
            "port is not a number",
            "number too large to fit in target type"
        ]
    );
    println!("1. ?와 match 풀어 쓰기: 5개 입력에서 결과가 같다");

    // Option의 ?
    assert_eq!(find_port("a=1\nb=2"), None);
    assert_eq!(find_port("port=1"), Some("1"));

    // 2. BoxError
    assert_eq!(parse_pair("3, 4").ok(), Some((3, 4)));
    assert_eq!(parse_pair("34").unwrap_err().to_string(), "no comma");
    assert_eq!(
        parse_pair("x,4").unwrap_err().to_string(),
        "invalid digit found in string"
    );
    assert_eq!(
        parse_pair("1,0").unwrap_err().to_string(),
        "second value must not be zero: 1,0"
    );
    // Send + Sync이므로 다른 스레드에서 만들어 돌려받을 수 있다.
    let from_thread = std::thread::spawn(|| parse_pair("a,b"))
        .join()
        .expect("스레드가 panic하지 않았다");
    assert!(from_thread.is_err());
    // 상자 안의 진짜 타입으로 되돌리기(downcast)
    let boxed = parse_pair("x,1").unwrap_err();
    assert!(boxed.downcast_ref::<ParseIntError>().is_some());
    println!("2. Box<dyn Error + Send + Sync>: &str, String, ParseIntError가 모두 ?로 들어간다");

    // 3. 사슬
    let c = chain(&read_port("port=-1").unwrap_err());
    println!("3. 사슬: {c:?}");
    assert_eq!(
        c,
        vec!["port is not a number", "invalid digit found in string"]
    );

    // 4. main이 Err를 돌려주면: 종료 코드 1, stderr에 "Error: " + Debug 형식
    let (code, out, err) = build_and_run(
        "main_err",
        r#"
fn main() -> Result<(), std::num::ParseIntError> {
    println!("start");
    let n: i32 = "12a".parse()?;
    println!("never {n}");
    Ok(())
}
"#,
    );
    println!("4. main이 Err: 종료 코드 {code:?}, stderr {:?}", err.trim());
    assert_eq!(code, Some(1));
    assert_eq!(out, "start\n");
    assert_eq!(err.trim(), "Error: ParseIntError { kind: InvalidDigit }");
    let (code, _, _) = build_and_run("main_ok", "fn main() -> Result<(), String> { Ok(()) }\n");
    assert_eq!(code, Some(0));

    // 5. 컴파일 오류
    // (가) 반환 타입이 ()인 함수에서 ?
    let e = compile_errors("unit", "pub fn f() { let _n: i32 = \"1\".parse()?; }\n");
    assert!(e.contains("error[E0277]"), "{e}");
    assert!(e.contains("can only be used in a function that returns `Result` or `Option`"));
    // (나) Result를 돌려주는 함수에서 Option에 ?
    let e = compile_errors(
        "mix",
        "pub fn f(v: &[i32]) -> Result<i32, String> { let x = v.first()?; Ok(*x) }\n",
    );
    assert!(e.contains("error[E0277]"), "{e}");
    assert!(
        e.contains("the `?` operator can only be used on `Result`s"),
        "{e}"
    );
    // (다) From 구현이 없으면 변환하지 못한다
    let e = compile_errors(
        "nofrom",
        "pub struct MyErr;\npub fn f() -> Result<i32, MyErr> { let n = \"1\".parse::<i32>()?; Ok(n) }\n",
    );
    assert!(e.contains("error[E0277]"), "{e}");
    assert!(
        e.contains("`?` couldn't convert the error to `MyErr`"),
        "{e}"
    );
    println!("5. 컴파일 오류 세 가지 모두 E0277");

    // 6. clippy 기본 린트: question_mark(match로 풀어 쓴 전파), result_large_err(큰 에러 타입)
    let dir = tmpdir("clippy");
    let file = dir.join("lints.rs");
    std::fs::write(
        &file,
        "pub fn f(s: &str) -> Result<i32, std::num::ParseIntError> {\n    let n = match s.parse::<i32>() {\n        Ok(v) => v,\n        Err(e) => return Err(e),\n    };\n    Ok(n)\n}\npub fn h(ok: bool) -> Result<(), [u8; 512]> {\n    if ok { Ok(()) } else { Err([0; 512]) }\n}\n",
    )
    .expect("쓰기");
    let out = std::process::Command::new("clippy-driver")
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
        .expect("clippy-driver 실행");
    let msg = String::from_utf8_lossy(&out.stderr);
    assert!(
        msg.contains("`#[warn(clippy::question_mark)]` on by default"),
        "{msg}"
    );
    assert!(
        msg.contains("`#[warn(clippy::result_large_err)]` on by default"),
        "{msg}"
    );
    println!("6. clippy::question_mark, clippy::result_large_err 기본으로 경고");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn question_mark_matches_manual_match() {
        for s in ["port=1", "port=", "", "port=65535", "port=65536"] {
            assert_eq!(
                read_port(s).map_err(|e| e.to_string()),
                read_port_by_hand(s).map_err(|e| e.to_string())
            );
        }
    }

    #[test]
    fn box_error_is_send_sync() {
        fn needs<T: Send + Sync + 'static>() {}
        needs::<BoxError>();
    }
}
```
{% endraw %}
