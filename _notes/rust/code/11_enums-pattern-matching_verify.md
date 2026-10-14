---
layout: "note"
title: "11_enums-pattern-matching_verify.rs"
display_title: "11_enums-pattern-matching_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/enums-pattern-matching/"
parent_title: "열거형과 패턴 매칭"
description: "Rust · 열거형과 패턴 매칭 검증 코드"
permalink: "/studies/rust/code/11_enums-pattern-matching_verify/"
---
{% raw %}
[열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/) 문서의 검증 코드다.

```rust
//! 열거형과 패턴 매칭 문서의 주장을 확인한다: 데이터를 가진 변형, 빠짐없는 match(E0004),
//! 가드와 빠짐없음 검사, @ 바인딩, if let·let-else·let 체인(2024 에디션), matches!,
//! #[non_exhaustive](크레이트 두 개로), C 공용체(union)와의 크기 비교, clippy 린트.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/11_enums-pattern-matching_verify.rs"

use std::mem::size_of;

#[derive(Debug)]
enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => 3.0 * r * r, // 단순화를 위해 원주율 3
            Shape::Rect(w, h) => w * h,
        }
    }
}

#[allow(dead_code)]
union ShapeData {
    circle: f64,
    rect: [f64; 2],
}

#[derive(Debug)]
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(u8, u8, u8),
}

fn describe(m: &Message) -> String {
    match m {
        Message::Quit => "종료".to_string(),
        Message::Move { x: 0, y } => format!("세로로 {y}"),
        Message::Move { x, y } => format!("({x}, {y})로"),
        Message::Write(text) if text.is_empty() => "빈 글".to_string(),
        Message::Write(text) => format!("글: {text}"),
        Message::ChangeColor(r, g, b) => format!("#{r:02x}{g:02x}{b:02x}"),
    }
}

fn grade(score: u32) -> String {
    match score {
        s @ 90..=100 => format!("A({s})"),
        s @ 80..=89 => format!("B({s})"),
        0..=79 => "C".to_string(),
        s => format!("잘못된 점수 {s}"),
    }
}

/// let-else: 패턴이 안 맞으면 else가 반드시 빠져나간다.
fn parse_pair(line: &str) -> Result<(String, i64), String> {
    let Some((key, value)) = line.split_once('=') else {
        return Err(format!("'=' 없음: {line}"));
    };
    let Ok(n) = value.trim().parse::<i64>() else {
        return Err(format!("숫자 아님: {}", value.trim()));
    };
    Ok((key.trim().to_string(), n))
}

/// let 체인 (Rust 1.88, 2024 에디션)
fn port_of(line: &str) -> Option<u16> {
    if let Some((k, v)) = line.split_once('=')
        && k.trim() == "port"
        && let Ok(p) = v.trim().parse::<u16>()
        && p != 0
    {
        Some(p)
    } else {
        None
    }
}

fn compile_with(code: &str, tool: &str, extra: &[&str], tag: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr11_{}_{}", std::process::id(), tag));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new(tool)
        .args(["--crate-type=lib", "--emit=metadata", "--out-dir"])
        .arg(&dir)
        .args(extra)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn compile(code: &str, tag: &str) -> String {
    compile_with(code, "rustc", &["--edition", "2024"], tag)
}

fn main() {
    // 1. 데이터를 가진 변형과 match
    let shapes = [Shape::Circle(1.0), Shape::Rect(2.0, 3.0)];
    let areas: Vec<f64> = shapes.iter().map(Shape::area).collect();
    assert_eq!(areas, vec![3.0, 6.0]);
    println!("{:?} {:?}", shapes[0], areas);

    // 2. C 공용체와 비교: enum은 공용체 + 어느 변형인지 적는 칸(태그)
    println!(
        "size_of: union {} / enum Shape {} / Option<Shape> {}",
        size_of::<ShapeData>(),
        size_of::<Shape>(),
        size_of::<Option<Shape>>()
    );
    assert_eq!(size_of::<ShapeData>(), 16);
    assert_eq!(size_of::<Shape>(), 24);
    println!("size_of::<Message>() = {}", size_of::<Message>());

    // 공용체 필드 읽기는 unsafe 없이 안 된다: E0133
    let e = compile(
        "pub union U { pub a: u32, pub b: f32 }\npub fn f(u: U) -> u32 { u.a }",
        "union",
    );
    assert!(e.contains("E0133"), "{e}");
    println!("union 필드 읽기: E0133");

    // 3. 빠짐없는 match: 변형 하나를 빠뜨리면 E0004
    let e = compile(
        "pub enum S { A, B, C }\npub fn f(s: S) -> u8 { match s { S::A => 1, S::B => 2 } }",
        "e0004",
    );
    assert!(e.contains("E0004"), "{e}");
    assert!(e.contains("`S::C` not covered"), "{e}");
    println!("변형 빠뜨림: E0004 `S::C` not covered");

    // 가드는 빠짐없음 검사에 들어가지 않는다
    let e = compile(
        "pub fn f(x: Option<i32>) -> i32 { match x { Some(n) if n >= 0 => n, Some(n) if n < 0 => -n, None => 0 } }",
        "guard",
    );
    assert!(e.contains("E0004"), "{e}");
    println!("가드 두 개로 모든 정수를 덮어도: E0004");

    // 4. describe와 grade (확인 문제 C3)
    let msgs = [
        Message::Move { x: 0, y: 5 },
        Message::Move { x: 2, y: 5 },
        Message::Write(String::new()),
        Message::Write("hi".into()),
        Message::ChangeColor(255, 0, 16),
        Message::Quit,
    ];
    let d: Vec<String> = msgs.iter().map(describe).collect();
    println!("describe: {d:?}");
    assert_eq!(
        d,
        vec!["세로로 5", "(2, 5)로", "빈 글", "글: hi", "#ff0010", "종료"]
    );
    let g: Vec<String> = [95, 90, 89, 79, 101].into_iter().map(grade).collect();
    println!("C3 grade: {}", g.join(" "));
    assert_eq!(g.join(" "), "A(95) A(90) B(89) C 잘못된 점수 101");

    // 5. if let / let-else / let 체인
    let config_max = Some(3u8);
    let mut seen = 0;
    if let Some(max) = config_max {
        seen = max;
    }
    assert_eq!(seen, 3);
    assert_eq!(parse_pair("retries = 3"), Ok(("retries".into(), 3)));
    assert_eq!(parse_pair("retries"), Err("'=' 없음: retries".into()));
    assert_eq!(parse_pair("retries = x"), Err("숫자 아님: x".into()));

    // Option을 돌려주는 함수에서 else { return None }만 하면 clippy::question_mark가 ?를 권한다
    let e = compile_with(
        "pub fn f(s: &str) -> Option<usize> { let Some(i) = s.find('=') else { return None; }; Some(i) }",
        "clippy-driver",
        &["--edition", "2024"],
        "clipq",
    );
    assert!(e.contains("clippy::question_mark"), "{e}");
    assert_eq!(port_of("port = 8080"), Some(8080));
    assert_eq!(port_of("port = 0"), None);
    assert_eq!(port_of("host = a"), None);

    // let-else의 else가 빠져나가지 않으면 E0308
    let e = compile(
        "pub fn f(x: Option<i32>) -> i32 { let Some(n) = x else { 0 }; n }",
        "letelse",
    );
    assert!(e.contains("E0308"), "{e}");
    assert!(e.contains("does not diverge"), "{e}");
    println!("let-else의 else가 안 빠져나감: E0308 does not diverge");

    // let 체인은 2024 에디션에서만
    let chain = "pub fn f(x: Option<i32>) -> i32 { if let Some(n) = x && n > 0 { n } else { 0 } }";
    let e2024 = compile(chain, "chain24");
    assert!(!e2024.contains("error"), "{e2024}");
    let e2021 = compile_with(chain, "rustc", &["--edition", "2021"], "chain21");
    assert!(e2021.contains("error"), "{e2021}");
    println!(
        "let 체인 2021 에디션 오류: {}",
        e2021.lines().next().unwrap_or("")
    );

    // 6. matches!
    let bar = Some(4);
    assert!(matches!(bar, Some(x) if x > 2));
    let quit_count = msgs.iter().filter(|m| matches!(m, Message::Quit)).count();
    assert_eq!(quit_count, 1);

    // 7. #[non_exhaustive]: 정의한 크레이트 밖에서는 와일드카드가 필요하다
    let dir = std::env::temp_dir().join(format!("vr11_{}_ne", std::process::id()));
    std::fs::create_dir_all(&dir).unwrap();
    let up = dir.join("upstream.rs");
    std::fs::write(
        &up,
        "#[non_exhaustive]\npub enum Error { Message(String), Other }\npub fn inside(e: &Error) -> u8 { match e { Error::Message(_) => 1, Error::Other => 2 } }",
    )
    .unwrap();
    let out = std::process::Command::new("rustc")
        .args([
            "--edition",
            "2024",
            "--crate-type=rlib",
            "--crate-name",
            "upstream",
            "--out-dir",
        ])
        .arg(&dir)
        .arg(&up)
        .output()
        .unwrap();
    assert!(
        out.status.success(),
        "{}",
        String::from_utf8_lossy(&out.stderr)
    );
    let rlib = dir.join("libupstream.rlib");
    let ext = format!("upstream={}", rlib.display());
    let down_no = "pub fn f(e: &upstream::Error) -> u8 { match e { upstream::Error::Message(_) => 1, upstream::Error::Other => 2 } }";
    let e = compile_with(
        down_no,
        "rustc",
        &["--edition", "2024", "--extern", &ext],
        "down1",
    );
    assert!(e.contains("E0004"), "{e}");
    let down_ok = "pub fn f(e: &upstream::Error) -> u8 { match e { upstream::Error::Message(_) => 1, upstream::Error::Other => 2, _ => 3 } }";
    let e = compile_with(
        down_ok,
        "rustc",
        &["--edition", "2024", "--extern", &ext],
        "down2",
    );
    assert!(!e.contains("error"), "{e}");
    println!("#[non_exhaustive] 밖에서 와일드카드 없이: E0004, 안에서는 통과");

    // 8. clippy: bool을 돌려주는 match는 matches!로 (match_like_matches_macro, 기본 켜짐)
    let e = compile_with(
        "pub enum S { A, B, C }\npub fn f(s: &S) -> bool { match s { S::A | S::B => true, _ => false } }",
        "clippy-driver",
        &["--edition", "2024"],
        "clip1",
    );
    assert!(e.contains("clippy::match_like_matches_macro"), "{e}");
    // wildcard_enum_match_arm은 restriction 그룹이라 켜야 나온다
    let code = "pub enum S { A, B, C }\npub fn f(s: &S) -> u8 { match s { S::A => 1, _ => 0 } }";
    let off = compile_with(code, "clippy-driver", &["--edition", "2024"], "clip2");
    // "error"가 없어야 조각이 실제로 컴파일된 것이다(호출이 실패해도 린트 이름은 안 나온다).
    assert!(
        !off.contains("error") && !off.contains("wildcard_enum_match_arm"),
        "{off}"
    );
    let on = compile_with(
        code,
        "clippy-driver",
        &["--edition", "2024", "-W", "clippy::wildcard_enum_match_arm"],
        "clip3",
    );
    // 린트 이름이 틀리면 "unknown lint: ...wildcard..." 경고가 나오므로 린트의 메시지로 확인한다.
    assert!(
        on.contains("wildcard match will also match any future added variants"),
        "{on}"
    );
    println!("clippy: match_like_matches_macro 기본 경고, wildcard_enum_match_arm 켜야 경고");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
