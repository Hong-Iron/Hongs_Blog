---
layout: "note"
title: "04_expressions-control-flow_verify.rs"
display_title: "04_expressions-control-flow_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/expressions-control-flow/"
parent_title: "표현식과 제어 흐름"
description: "Rust · 표현식과 제어 흐름 검증 코드"
sitemap: false
permalink: "/studies/rust/code/04_expressions-control-flow_verify/"
---
{% raw %}
[표현식과 제어 흐름](/Hongs_Blog/studies/rust/expressions-control-flow/) 문서의 검증 코드다.

```rust
//! 04 표현식과 제어 흐름: 블록·if·match·loop가 값을 내는 것, 세미콜론이 값을 ()로 바꾸는 것,
//! loop의 break 값, 레이블 break, 레이블 블록, for와 범위, 그리고 이와 관련된 컴파일 오류 코드를 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/04_expressions-control-flow_verify.rs"

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

fn plus_one(x: i32) -> i32 {
    x + 1
}

/// match로 점수를 등급으로 바꾼다. 모든 u8 값을 덮어야 컴파일된다.
fn grade(score: u8) -> char {
    match score {
        90..=100 => 'A',
        80..=89 => 'B',
        70..=79 => 'C',
        0..=69 => 'F',
        _ => '?', // 101..=255
    }
}

/// 2차원 격자에서 처음으로 target을 찾은 (행, 열). 레이블 블록으로 값을 낸다.
fn find(grid: &[[i32; 3]], target: i32) -> Option<(usize, usize)> {
    'search: {
        for (r, row) in grid.iter().enumerate() {
            for (c, &v) in row.iter().enumerate() {
                if v == target {
                    break 'search Some((r, c));
                }
            }
        }
        None
    }
}

fn main() {
    // 1. 블록은 마지막 표현식의 값을 낸다.
    let y = {
        let x = 3;
        x + 1
    };
    assert_eq!(y, 4);
    assert_eq!(plus_one(5), 6);
    println!("블록 값 {y}, plus_one(5) = {}", plus_one(5));

    // 2. 세미콜론을 붙이면 값이 ()가 된다: E0308과 "remove this semicolon".
    let e = compile_errors("pub fn plus_one(x: i32) -> i32 {\n    x + 1;\n}\n");
    assert!(e.contains("error[E0308]: mismatched types"));
    assert!(e.contains("expected `i32`, found `()`"));
    assert!(e.contains("help: remove this semicolon to return this value"));
    println!("x + 1; -> E0308 (expected `i32`, found `()`)");

    // 대입식의 값은 ()다. C처럼 a = b = 0으로 쓸 수 없다.
    let e = compile_errors(
        "pub fn f() -> i32 {\n    let mut x = 1;\n    let y = (x = 2);\n    let _ = x;\n    y\n}\n",
    );
    assert!(e.contains("error[E0308]"), "{e}");
    assert!(e.contains("expected `i32`, found `()`"), "{e}");
    println!("let y = (x = 2); -> y는 ()");

    // let은 문장이라 값이 없다.
    let e = compile_errors("pub fn f() {\n    let x = (let y = 6);\n}\n");
    assert!(e.contains("expected expression, found `let` statement"));

    // 3. if는 값을 낸다. 두 갈래의 타입이 같아야 하고, 값으로 쓰면 else가 있어야 한다.
    let n = std::hint::black_box(7);
    let parity = if n % 2 == 0 { "짝수" } else { "홀수" };
    assert_eq!(parity, "홀수");
    let e =
        compile_errors("pub fn f(c: bool) {\n    let number = if c { 5 } else { \"six\" };\n}\n");
    assert!(e.contains("error[E0308]: `if` and `else` have incompatible types"));
    let e = compile_errors("pub fn f(c: bool) -> i32 {\n    let x = if c { 1 };\n    x\n}\n");
    assert!(e.contains("error[E0317]"));
    let e = compile_errors("pub fn f() {\n    let number = 3;\n    if number {}\n}\n");
    assert!(e.contains("expected `bool`, found integer"));
    println!("if 값 {parity}; 타입 다름 -> E0308, else 없음 -> E0317, if 3 -> E0308");

    // 4. match는 모든 경우를 덮어야 한다.
    assert_eq!(
        [grade(95), grade(85), grade(72), grade(10), grade(200)],
        ['A', 'B', 'C', 'F', '?']
    );
    let e = compile_errors(
        "pub fn f(n: u8) -> &'static str {\n    match n {\n        0 => \"zero\",\n        1..=9 => \"small\",\n    }\n}\n",
    );
    assert!(e.contains("error[E0004]: non-exhaustive patterns: `10_u8..=u8::MAX` not covered"));
    println!("match 빠진 경우 -> E0004 (`10_u8..=u8::MAX` not covered)");

    // 5. loop는 break 값으로 값을 낸다.
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;
        }
    };
    assert_eq!(result, 20);
    // while·for에서는 break에 값을 줄 수 없다.
    let e = compile_errors(
        "pub fn f() -> i32 {\n    let mut i = 0;\n    while i < 3 {\n        i += 1;\n        break i;\n    }\n    0\n}\n",
    );
    assert!(e.contains("error[E0571]"));
    println!("loop break 값 {result}; while에서 break 값 -> E0571");

    // 6. 레이블 break: 바깥 반복을 끝낸다.
    let mut trace = Vec::new();
    'outer: for i in 0..3 {
        for j in 0..3 {
            if i + j == 3 {
                break 'outer;
            }
            if j > i {
                continue 'outer;
            }
            trace.push((i, j));
        }
    }
    assert_eq!(trace, vec![(0, 0), (1, 0), (1, 1)]);
    println!("레이블 break/continue 기록 {trace:?}");

    // 7. 레이블 블록으로 값을 낸다.
    let grid = [[1, 2, 3], [4, 5, 6]];
    assert_eq!(find(&grid, 5), Some((1, 1)));
    assert_eq!(find(&grid, 9), None);
    println!(
        "find 5 -> {:?}, find 9 -> {:?}",
        find(&grid, 5),
        find(&grid, 9)
    );

    // 8. for와 범위. a..b는 b를 빼고, a..=b는 b를 넣는다.
    let down: Vec<i32> = (1..4).rev().collect();
    assert_eq!(down, vec![3, 2, 1]);
    let mut sum = 0;
    for k in 1..=10 {
        sum += k;
    }
    assert_eq!(sum, 55);
    assert_eq!((1..10).count(), 9);
    assert_eq!((1..=10).count(), 10);
    assert_eq!((5..5).count(), 0);
    println!("(1..4).rev() = {down:?}, 1..=10 합 = {sum}");

    // 9. 세미콜론으로 끝난 블록의 타입은 ()다. ()는 크기가 0이다.
    let e = compile_errors("pub fn f() -> i32 {\n    let v = {\n        1;\n    };\n    v\n}\n");
    assert!(e.contains("expected `i32`, found `()`"), "{e}");
    assert_eq!(size_of::<()>(), 0);
    println!("{{ 1; }}의 타입 -> (), 크기 {}", size_of::<()>());

    // 10. 확인 문제의 답.
    let mut n = 0;
    let v = loop {
        n += 3;
        if n > 10 {
            break n - 10;
        }
    };
    assert_eq!(v, 2);
    let e = compile_errors("pub fn half(x: i32) -> i32 {\n    if x > 0 { x / 2 }\n}\n");
    assert!(e.contains("error[E0317]"), "{e}");
    println!("C2 loop 값 {v}, C1 half -> E0317");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
