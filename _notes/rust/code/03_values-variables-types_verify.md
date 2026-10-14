---
layout: "note"
title: "03_values-variables-types_verify.rs"
display_title: "03_values-variables-types_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/values-variables-types/"
parent_title: "값·변수·타입"
description: "Rust · 값·변수·타입 검증 코드"
sitemap: false
permalink: "/studies/rust/code/03_values-variables-types_verify/"
---
{% raw %}
[값·변수·타입](/Hongs_Blog/studies/rust/values-variables-types/) 문서의 검증 코드다.

```rust
//! 03 값·변수·타입: 기본 불변, 가림(shadowing), 기본 타입, 정수 넘침(dev panic / overflow-checks 끄면 감기),
//! checked_·wrapping_·saturating_·overflowing_ 메서드, as 변환의 잘림과 포화, char 4바이트를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/03_values-variables-types_verify.rs"

use std::any::type_name_of_val;
use std::hint::black_box;
use std::panic;
use std::path::PathBuf;
use std::process::Command;

fn panic_message<F: FnOnce() -> R + panic::UnwindSafe, R>(f: F) -> Option<String> {
    let old = panic::take_hook();
    panic::set_hook(Box::new(|_| {}));
    let result = panic::catch_unwind(f);
    panic::set_hook(old);
    result.err().map(|p| {
        p.downcast_ref::<String>()
            .cloned()
            .or_else(|| p.downcast_ref::<&str>().map(|s| s.to_string()))
            .unwrap_or_default()
    })
}

fn snippet_dir(tag: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("vr_{}_{}", std::process::id(), tag));
    std::fs::create_dir_all(&dir).unwrap();
    dir
}

/// 코드 조각을 라이브러리로 컴파일해 stderr를 돌려준다. emit은 "metadata"(검사만) 또는 "link"(끝까지).
fn compile_errors(tag: &str, code: &str, emit: &str) -> String {
    let dir = snippet_dir(tag);
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = Command::new("rustc")
        .args(["--edition", "2024", "--crate-type=lib"])
        .arg(format!("--emit={emit}"))
        .arg("--out-dir")
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

/// 실행 파일로 컴파일해 돌린다. (성공 여부, stdout, stderr)
fn compile_and_run(tag: &str, code: &str, flags: &[&str]) -> (bool, String, String) {
    let dir = snippet_dir(tag);
    let file = dir.join("main.rs");
    let exe = dir.join("prog");
    std::fs::write(&file, code).unwrap();
    let build = Command::new("rustc")
        .args(["--edition", "2024"])
        .args(flags)
        .arg("-o")
        .arg(&exe)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    assert!(
        build.status.success(),
        "{}",
        String::from_utf8_lossy(&build.stderr)
    );
    let out = Command::new(&exe).output().expect("실행");
    (
        out.status.success(),
        String::from_utf8_lossy(&out.stdout).into_owned(),
        String::from_utf8_lossy(&out.stderr).into_owned(),
    )
}

const OVERFLOW_PROG: &str = r#"use std::hint::black_box;
fn main() {
    let x: u8 = black_box(255);
    println!("{}", x + 1);
    let y: i32 = black_box(i32::MAX);
    println!("{}", y + 1);
}
"#;

fn main() {
    // 1. 기본 불변: 다시 대입하면 E0384.
    let e = compile_errors(
        "imm",
        "pub fn f() -> i32 {\n    let x = 5;\n    x = 6;\n    x\n}\n",
        "metadata",
    );
    assert!(e.contains("error[E0384]: cannot assign twice to immutable variable `x`"));
    println!("불변 변수에 다시 대입 -> E0384");

    // 2. 가림: 같은 이름으로 새 변수를 만든다. 타입이 바뀌어도 된다.
    let spaces = "   ";
    let spaces = spaces.len();
    assert_eq!(spaces, 3);
    assert_eq!(type_name_of_val(&spaces), "usize");
    // mut로는 타입을 바꿀 수 없다: E0308.
    let e = compile_errors(
        "mutty",
        "pub fn f() {\n    let mut spaces = \"   \";\n    spaces = spaces.len();\n    let _ = spaces;\n}\n",
        "metadata",
    );
    assert!(e.contains("error[E0308]: mismatched types"));
    assert!(e.contains("expected `&str`, found `usize`"));
    println!("가림으로 &str -> usize: {spaces}, mut로 바꾸면 -> E0308");

    // 가림은 안쪽 블록에서만 유효하다.
    let x = 5;
    let x = x + 1;
    {
        let x = x * 2;
        assert_eq!(x, 12);
        println!("가림 블록: 안쪽 x = {x}");
    }
    assert_eq!(x, 6);
    println!("가림 블록: 바깥 x = {x}");

    // 3. 타입을 적지 않은 리터럴의 기본 타입.
    let i = 5;
    let f = 2.0;
    assert_eq!(type_name_of_val(&i), "i32");
    assert_eq!(type_name_of_val(&f), "f64");
    println!(
        "5 -> {}, 2.0 -> {}",
        type_name_of_val(&i),
        type_name_of_val(&f)
    );

    // 4. 크기.
    assert_eq!(size_of::<char>(), 4);
    assert_eq!(size_of::<bool>(), 1);
    assert_eq!(size_of::<usize>(), 8); // 이 기계는 64비트
    assert_eq!(size_of::<i128>(), 16);
    assert_eq!('가' as u32, 0xAC00);
    assert_eq!("가".len(), 3); // 문자열은 UTF-8 바이트로 센다
    assert_eq!("가".chars().count(), 1);
    println!(
        "char {}B, '가'=U+{:04X}, \"가\".len()={}",
        size_of::<char>(),
        '가' as u32,
        "가".len()
    );

    // 5. 서로 다른 정수 타입은 자동으로 섞이지 않는다.
    let e = compile_errors(
        "mix",
        "pub fn f() -> u64 {\n    let a: u32 = 5;\n    let b: u64 = 7;\n    a + b\n}\n",
        "metadata",
    );
    assert!(e.contains("error[E0308]"));
    let a: u32 = 5;
    let b: u64 = 7;
    assert_eq!(u64::from(a) + b, 12);
    println!("u32 + u64 -> E0308, u64::from(a) + b = 12");

    // 6. 넘침: 이 파일은 dev 프로필이라 넘침 검사가 켜져 있다.
    let x: u8 = black_box(255);
    let msg = panic_message(|| x + 1).unwrap();
    assert_eq!(msg, "attempt to add with overflow");
    println!("dev: 255u8 + 1 -> panic: {msg}");

    // 컴파일러가 값을 아는 넘침은 deny 린트로 막힌다. 다만 검사만 하는 단계(--emit=metadata, cargo check)에서는 안 보인다.
    let lit = "pub fn f() -> u8 {\n    let x: u8 = 255 + 1;\n    x\n}\n";
    let full = compile_errors("lit_full", lit, "link");
    let meta = compile_errors("lit_meta", lit, "metadata");
    assert!(full.contains("error: this arithmetic operation will overflow"));
    assert!(!meta.contains("error"));
    println!("상수 255 + 1: 끝까지 컴파일 -> 오류, 검사만 -> 오류 없음");
    let e = compile_errors("lit256", "pub fn f() -> u8 {\n    256\n}\n", "metadata");
    assert!(e.contains("error: literal out of range for `u8`"));

    // overflow-checks를 끄면(=release 기본값) 감아 돈다. 켜면 panic.
    let (ok, out, _) = compile_and_run("off", OVERFLOW_PROG, &["-C", "overflow-checks=off"]);
    assert!(ok);
    assert_eq!(out, "0\n-2147483648\n");
    println!("overflow-checks=off -> {}", out.replace('\n', " "));
    let (ok, out, err) = compile_and_run("on", OVERFLOW_PROG, &["-C", "overflow-checks=on"]);
    assert!(!ok);
    assert_eq!(out, "");
    assert!(err.contains("attempt to add with overflow"));
    println!("overflow-checks=on  -> panic");
    // -O(최적화)만 주고 overflow-checks를 따로 정하지 않아도 꺼진다(debug-assertions가 꺼지므로).
    let (ok, out, _) = compile_and_run("opt", OVERFLOW_PROG, &["-O"]);
    assert!(ok);
    assert_eq!(out, "0\n-2147483648\n");

    // 0으로 나누기와 i32::MIN / -1은 overflow-checks를 꺼도 panic이다.
    let div = r#"use std::hint::black_box;
fn main() {
    let m: i32 = black_box(i32::MIN);
    let d: i32 = black_box(-1);
    println!("{}", m / d);
}
"#;
    let (ok, _, err) = compile_and_run("div", div, &["-C", "overflow-checks=off"]);
    assert!(!ok);
    assert!(err.contains("attempt to divide with overflow"));
    let zero_prog = "use std::hint::black_box;\nfn main() {\n    let z: i32 = black_box(0);\n    println!(\"{}\", 1 / z);\n}\n";
    let (ok, _, err) = compile_and_run("zero", zero_prog, &["-C", "overflow-checks=off"]);
    assert!(!ok);
    assert!(err.contains("attempt to divide by zero"));
    let z: i32 = black_box(0);
    let msg = panic_message(|| 1 / z).unwrap();
    assert_eq!(msg, "attempt to divide by zero");
    println!("i32::MIN / -1 (checks off) -> panic, 1 / 0 -> panic: {msg}");

    // 7. 넘침을 직접 다루는 네 메서드.
    let x: u8 = black_box(250);
    assert_eq!(x.checked_add(10), None);
    assert_eq!(x.checked_add(5), Some(255));
    assert_eq!(x.wrapping_add(10), 4);
    assert_eq!(x.saturating_add(10), 255);
    assert_eq!(x.overflowing_add(10), (4, true));
    assert_eq!(0u8.saturating_sub(1), 0);
    println!(
        "250u8 + 10: checked {:?}, wrapping {}, saturating {}, overflowing {:?}",
        x.checked_add(10),
        x.wrapping_add(10),
        x.saturating_add(10),
        x.overflowing_add(10)
    );

    // 8. as 변환: 조용히 자르거나 포화시킨다. try_from은 실패를 알려 준다.
    let big: i32 = black_box(300);
    let neg: i32 = black_box(-1);
    assert_eq!(big as u8, 44); // 300 = 256 + 44, 아래 8비트만 남는다
    assert_eq!(neg as u32, 4_294_967_295);
    assert_eq!(neg as u8, 255);
    assert_eq!(black_box(3.99f64) as i32, 3); // 0 쪽으로 버림
    assert_eq!(black_box(-3.99f64) as i32, -3);
    assert_eq!(black_box(-1.5f64) as u8, 0); // 포화
    assert_eq!(black_box(1e10f64) as i32, i32::MAX);
    assert_eq!(black_box(f64::NAN) as i32, 0);
    assert!(u8::try_from(big).is_err());
    assert_eq!(u8::try_from(black_box(200i32)), Ok(200u8));
    println!(
        "300 as u8 = {}, -1 as u32 = {}, 3.99 as i32 = {}, -1.5 as u8 = {}, 1e10 as i32 = {}, NaN as i32 = {}",
        big as u8,
        neg as u32,
        black_box(3.99f64) as i32,
        black_box(-1.5f64) as u8,
        black_box(1e10f64) as i32,
        black_box(f64::NAN) as i32
    );

    // 9. 부동소수점: 0.1 + 0.2는 0.3이 아니다.
    let s = black_box(0.1f64) + black_box(0.2f64);
    assert_ne!(s, 0.3);
    assert!((s - 0.3).abs() < 1e-12);
    println!("0.1 + 0.2 = {s}");

    // 10. const는 타입을 꼭 적고, 컴파일할 때 값이 정해진다.
    const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
    assert_eq!(THREE_HOURS_IN_SECONDS, 10_800);
    let e = compile_errors("constty", "const N = 5;\n", "metadata");
    assert!(e.contains("missing type for `const` item"), "{e}");
    println!("const 타입 생략 -> 오류");

    // 11. 확인 문제 C1: 가림은 되고, mut에 다른 타입을 넣으면 E0308.
    let a = compile_errors(
        "c1a",
        "pub fn f() -> &'static str {\n    let x = 5;\n    let _ = x;\n    let x = \"five\";\n    x\n}\n",
        "metadata",
    );
    assert!(!a.contains("error"), "{a}");
    let b = compile_errors(
        "c1b",
        "pub fn f() {\n    let mut x = 5;\n    let _ = x;\n    x = \"five\";\n    let _ = x;\n}\n",
        "metadata",
    );
    assert!(b.contains("error[E0308]"), "{b}");
    println!("C1: 가림 -> 컴파일됨, mut에 &str -> E0308");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
