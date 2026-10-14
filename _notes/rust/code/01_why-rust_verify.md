---
layout: "note"
title: "01_why-rust_verify.rs"
display_title: "01_why-rust_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/why-rust/"
parent_title: "Rust가 푸는 문제"
description: "Rust · Rust가 푸는 문제 검증 코드"
permalink: "/studies/rust/code/01_why-rust_verify/"
---
{% raw %}
[Rust가 푸는 문제](/Hongs_Blog/studies/rust/why-rust/) 문서의 검증 코드다.

```rust
//! 01 Rust가 푸는 문제: 배열 밖 읽기는 쓰레기 값 대신 panic이 되고, 해제 뒤 사용·이동 뒤 사용·데이터 경쟁은 컴파일 단계에서 막힌다는 것을 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/01_why-rust_verify.rs"

use std::hint::black_box;
use std::panic;

/// 클로저를 실행해 panic 메시지를 돌려준다. panic이 없으면 None.
fn panic_message<F: FnOnce() -> R + panic::UnwindSafe, R>(f: F) -> Option<String> {
    let old = panic::take_hook();
    panic::set_hook(Box::new(|_| {}));
    let result = panic::catch_unwind(f);
    panic::set_hook(old);
    match result {
        Ok(_) => None,
        Err(payload) => Some(
            payload
                .downcast_ref::<String>()
                .cloned()
                .or_else(|| payload.downcast_ref::<&str>().map(|s| s.to_string()))
                .unwrap_or_default(),
        ),
    }
}

/// 코드 조각을 라이브러리로 컴파일해 stderr를 돌려준다.
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

fn main() {
    // 1. 배열 밖 읽기: 실행 중에 정해지는 번호로 읽으면 panic이 난다.
    let v = [10, 20, 30];
    let idx = black_box(10usize);
    let msg = panic_message(|| v[idx]).expect("panic이 나야 한다");
    println!("v[10] -> panic: {msg}");
    assert_eq!(msg, "index out of bounds: the len is 3 but the index is 10");

    // 2. 실패할 수 있다는 것을 타입으로 받는 방법: get은 Option을 돌려준다.
    assert_eq!(v.get(idx), None);
    assert_eq!(v.get(1), Some(&20));
    println!("v.get(10) = {:?}, v.get(1) = {:?}", v.get(idx), v.get(1));

    // 3. 해제된 값을 가리키는 참조(C의 use-after-free)는 컴파일되지 않는다.
    let dangle = compile_errors(
        "pub fn f() {\n    let r;\n    {\n        let s = String::from(\"hi\");\n        r = &s;\n    }\n    println!(\"{r}\");\n}\n",
    );
    assert!(dangle.contains("error[E0597]"), "{dangle}");
    assert!(dangle.contains("`s` does not live long enough"), "{dangle}");
    println!("dangling reference -> E0597");

    // 4. 넘겨준 값을 다시 쓰기(이중 해제의 씨앗)는 컴파일되지 않는다.
    let moved = compile_errors(
        "pub fn f() {\n    let s = String::from(\"hi\");\n    let t = s;\n    println!(\"{s} {t}\");\n}\n",
    );
    assert!(moved.contains("error[E0382]"), "{moved}");
    assert!(moved.contains("borrow of moved value: `s`"), "{moved}");
    println!("use after move -> E0382");

    // 5. 두 스레드가 잠금 없이 같은 Vec을 고치는 코드(데이터 경쟁)는 컴파일되지 않는다.
    let race = compile_errors(
        "pub fn f() {\n    let mut v = vec![1];\n    let h = std::thread::spawn(|| v.push(2));\n    v.push(3);\n    h.join().unwrap();\n}\n",
    );
    assert!(race.contains("error[E0373]"), "{race}");
    assert!(race.contains("error[E0499]"), "{race}");
    println!("data race -> E0373, E0499");

    // 6. 같은 일을 안전하게: Mutex로 감싸고 scope 스레드로 빌려 쓰면 컴파일되고 결과가 정해진다.
    let shared = std::sync::Mutex::new(vec![1]);
    std::thread::scope(|s| {
        s.spawn(|| shared.lock().unwrap().push(2));
        s.spawn(|| shared.lock().unwrap().push(3));
    });
    let mut got = shared.into_inner().unwrap();
    got.sort_unstable();
    assert_eq!(got, vec![1, 2, 3]);
    println!("Mutex + scope -> {got:?}");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
