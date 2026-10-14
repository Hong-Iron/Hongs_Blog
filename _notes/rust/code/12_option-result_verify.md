---
layout: "note"
title: "12_option-result_verify.rs"
display_title: "12_option-result_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/option-result/"
parent_title: "Option과 Result"
description: "Rust · Option과 Result 검증 코드"
permalink: "/studies/rust/code/12_option-result_verify/"
---
{% raw %}
[Option과 Result](/Hongs_Blog/studies/rust/option-result/) 문서의 검증 코드다.

```rust
//! Option과 Result 문서의 주장을 확인한다: Option<i8> + i8 금지(E0277), 결합 메서드의 결과,
//! unwrap_or의 즉시 계산과 unwrap_or_else의 지연 계산, ?로 일찍 돌려주기,
//! 빈 자리 최적화 크기(Option<&T> == &T 등), unwrap 패닉 메시지, must_use 경고, clippy 린트.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/12_option-result_verify.rs"

// 글자 그대로의 Some/None에 결합 메서드를 부르는 것은 동작을 보이려는 것이다.
#![allow(clippy::unnecessary_literal_unwrap)]

use std::cell::Cell;
use std::collections::HashMap;
use std::mem::size_of;
use std::num::NonZero;

#[derive(Debug, PartialEq)]
enum LookupError {
    NoSuchUser(u32),
    BadAge(String),
}

fn find_name(db: &HashMap<u32, &str>, id: u32) -> Option<String> {
    db.get(&id).map(|s| s.to_string())
}

fn parse_age(text: &str) -> Result<u8, LookupError> {
    text.trim()
        .parse::<u8>()
        .map_err(|_| LookupError::BadAge(text.to_string()))
}

/// ?는 None이나 Err를 만나면 그 자리에서 함수를 끝내고 돌려준다.
fn greeting(db: &HashMap<u32, &str>, id: u32, age_text: &str) -> Result<String, LookupError> {
    let name = find_name(db, id).ok_or(LookupError::NoSuchUser(id))?;
    let age = parse_age(age_text)?;
    Ok(format!("{name}({age})"))
}

fn compile_with(code: &str, tool: &str, extra: &[&str], tag: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr12_{}_{}", std::process::id(), tag));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = std::process::Command::new(tool)
        .args([
            "--edition",
            "2024",
            "--crate-type=lib",
            "--emit=metadata",
            "--out-dir",
        ])
        .arg(&dir)
        .args(extra)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn main() {
    // 1. Option<i8>과 i8은 더할 수 없다: E0277
    let e = compile_with(
        "pub fn f() -> i8 { let x: i8 = 5; let y: Option<i8> = Some(5); x + y }",
        "rustc",
        &[],
        "add",
    );
    assert!(e.contains("E0277"), "{e}");
    assert!(e.contains("cannot add `Option<i8>` to `i8`"), "{e}");
    println!("i8 + Option<i8>: E0277 cannot add `Option<i8>` to `i8`");

    // 2. 결합 메서드
    let some: Option<u32> = Some(4);
    let none: Option<u32> = None;
    assert_eq!(some.map(|x| x * 10), Some(40));
    assert_eq!(none.map(|x| x * 10), None);
    assert_eq!(some.and_then(|x| x.checked_sub(5)), None);
    assert_eq!(some.and_then(|x| x.checked_sub(1)), Some(3));
    assert_eq!(some.filter(|x| x % 2 == 0), Some(4));
    assert_eq!(none.ok_or("없음"), Err("없음"));
    assert_eq!(some.ok_or("없음"), Ok(4));
    assert_eq!(none.unwrap_or(7), 7);
    assert_eq!(none.unwrap_or_default(), 0);
    let r: Result<u32, String> = Err("x".into());
    assert_eq!(r.clone().ok(), None);
    assert_eq!(r.clone().unwrap_or_else(|e| e.len() as u32), 1);
    assert_eq!(r.map_err(|e| e.to_uppercase()), Err("X".to_string()));

    // 3. ?로 일찍 돌려주기
    let db: HashMap<u32, &str> = HashMap::from([(1, "ann")]);
    assert_eq!(greeting(&db, 1, "30"), Ok("ann(30)".into()));
    assert_eq!(greeting(&db, 2, "30"), Err(LookupError::NoSuchUser(2)));
    assert_eq!(
        greeting(&db, 1, "삼십"),
        Err(LookupError::BadAge("삼십".into()))
    );

    // 4. unwrap_or는 인자를 미리 계산한다, unwrap_or_else는 필요할 때만 (확인 문제 C3)
    let calls = Cell::new(0);
    let expensive = || {
        calls.set(calls.get() + 1);
        0u32
    };
    let a = Some(1u32).unwrap_or(expensive());
    let b = Some(1u32).unwrap_or_else(expensive);
    let c = None.unwrap_or_else(expensive);
    println!("C3: a={a} b={b} c={c} calls={}", calls.get());
    assert_eq!((a, b, c, calls.get()), (1, 1, 0, 2));

    // 5. 빈 자리 최적화: 보장 목록의 타입은 Option을 씌워도 크기가 그대로
    assert_eq!(size_of::<Option<&u64>>(), size_of::<&u64>());
    assert_eq!(size_of::<Option<&mut u64>>(), size_of::<&mut u64>());
    assert_eq!(size_of::<Option<Box<u64>>>(), size_of::<Box<u64>>());
    assert_eq!(size_of::<Option<fn()>>(), size_of::<fn()>());
    assert_eq!(size_of::<Option<NonZero<u32>>>(), 4);
    // 보장 목록에 없는 u32는 태그 자리가 따로 든다(관찰값)
    assert_eq!(size_of::<Option<u32>>(), 8);
    assert_eq!(size_of::<Result<NonZero<i32>, ()>>(), 4);
    println!(
        "size_of: &u64 {} / Option<&u64> {} / u32 {} / Option<u32> {} / Option<NonZero<u32>> {}",
        size_of::<&u64>(),
        size_of::<Option<&u64>>(),
        size_of::<u32>(),
        size_of::<Option<u32>>(),
        size_of::<Option<NonZero<u32>>>()
    );

    // 6. unwrap / expect 패닉 메시지
    std::panic::set_hook(Box::new(|_| {}));
    let msg = |r: Box<dyn std::any::Any + Send>| -> String {
        r.downcast_ref::<&str>()
            .map(|s| s.to_string())
            .or_else(|| r.downcast_ref::<String>().cloned())
            .unwrap_or_default()
    };
    let p = std::panic::catch_unwind(|| {
        let o: Option<u32> = None;
        o.unwrap()
    })
    .unwrap_err();
    let m1 = msg(p);
    println!("unwrap 패닉: {m1}");
    assert_eq!(m1, "called `Option::unwrap()` on a `None` value");
    let p = std::panic::catch_unwind(|| "x".parse::<u32>().unwrap()).unwrap_err();
    let m2 = msg(p);
    println!("Result unwrap 패닉: {m2}");
    assert!(m2.starts_with("called `Result::unwrap()` on an `Err` value"));
    let p = std::panic::catch_unwind(|| {
        let o: Option<u32> = None;
        o.expect("설정 파일에 port가 있어야 한다")
    })
    .unwrap_err();
    assert_eq!(msg(p), "설정 파일에 port가 있어야 한다");
    let _ = std::panic::take_hook();

    // 7. Result를 버리면 unused_must_use 경고
    let e = compile_with(
        "pub fn f() { \"5\".parse::<u32>(); }",
        "rustc",
        &[],
        "mustuse",
    );
    assert!(e.contains("unused `Result` that must be used") || e.contains("unused_must_use"));
    println!("Result 버림: unused_must_use 경고");

    // 8. clippy: unwrap_used는 restriction(기본 꺼짐), unnecessary_unwrap은 기본 켜짐
    let code = "pub fn f(o: Option<u32>) -> u32 { o.unwrap() }";
    let off = compile_with(code, "clippy-driver", &[], "u_off");
    // "error"가 없어야 조각이 실제로 컴파일된 것이다(호출이 실패해도 린트 이름은 안 나온다).
    assert!(
        !off.contains("error") && !off.contains("unwrap_used"),
        "{off}"
    );
    let on = compile_with(
        code,
        "clippy-driver",
        &["-W", "clippy::unwrap_used"],
        "u_on",
    );
    // 린트 이름만 보면 "unknown lint: `clippy::unwrap_used`" 경고와 구별되지 않으므로 메시지도 본다.
    assert!(
        on.contains("used `unwrap()` on an `Option` value") && on.contains("clippy::unwrap-used"),
        "{on}"
    );
    let e = compile_with(
        "pub fn f(o: Option<u32>) -> u32 { if o.is_some() { o.unwrap() } else { 0 } }",
        "clippy-driver",
        &[],
        "unn",
    );
    assert!(e.contains("clippy::unnecessary_unwrap"), "{e}");
    println!("clippy: unwrap_used 켜야 경고, unnecessary_unwrap 기본 경고");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
