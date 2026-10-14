---
layout: "note"
title: "37_tokio-runtime-tasks_verify.rs"
display_title: "37_tokio-runtime-tasks_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/tokio-runtime-tasks/"
parent_title: "tokio 런타임과 태스크"
description: "Rust · tokio 런타임과 태스크 검증 코드"
sitemap: false
permalink: "/studies/rust/code/37_tokio-runtime-tasks_verify/"
---
{% raw %}
[tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/) 문서의 검증 코드다.

```rust
//! tokio::spawn의 경계(F: Future + Send + 'static, F::Output: Send + 'static)와 같은 함수를
//! 표준 라이브러리만으로 만들어, 지역 변수를 빌리는 async 블록이 왜 거부되는지 오류 코드로 확인한다.
//! 의존성: 없음 (표준 라이브러리만). rustc를 PATH에서 부른다.
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/37_tokio-runtime-tasks_verify.rs"

fn compile_errors(code: &str, tag: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr37_{}_{}", std::process::id(), tag));
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

/// tokio::spawn과 같은 경계를 가진 가짜 spawn
const SPAWN_LIKE: &str = r#"
use std::future::Future;
pub fn spawn_like<F>(f: F) where F: Future + Send + 'static, F::Output: Send + 'static { drop(f); }
"#;

fn main() {
    // 1. 지역 변수를 빌리면 E0373: async 블록이 함수보다 오래 살 수 있다
    let e = compile_errors(
        &format!(
            "{SPAWN_LIKE}pub fn f() {{ let v = vec![1, 2]; spawn_like(async {{ println!(\"{{v:?}}\"); }}); }}\n"
        ),
        "borrow",
    );
    println!("--- 빌린 채로 spawn ---\n{}", e.lines().next().unwrap());
    assert!(e.contains("error[E0373]"), "{e}");
    assert!(
        e.contains("help: to force the async block to take ownership"),
        "{e}"
    );

    // 2. async move로 옮기면 통과
    let e = compile_errors(
        &format!(
            "{SPAWN_LIKE}pub fn f() {{ let v = vec![1, 2]; spawn_like(async move {{ println!(\"{{v:?}}\"); }}); }}\n"
        ),
        "move",
    );
    assert!(!e.contains("error"), "{e}");

    // 3. 'static은 "영원히 산다"가 아니다: String을 옮겨 넣으면 'static 경계를 채우고, 태스크가 끝나면 버려진다
    let e = compile_errors(
        &format!(
            "{SPAWN_LIKE}pub fn f() {{ let s = String::from(\"x\"); spawn_like(async move {{ s.len() }}); }}\n"
        ),
        "static",
    );
    assert!(!e.contains("error"), "{e}");

    // 4. 여러 태스크가 같은 값을 보려면 Arc로 나눠 준다
    let e = compile_errors(
        &format!(
            "{SPAWN_LIKE}use std::sync::Arc;\npub fn f() {{ let v = Arc::new(vec![1]); for _ in 0..2 {{ let v = v.clone(); spawn_like(async move {{ v.len() }}); }} }}\n"
        ),
        "arc",
    );
    assert!(!e.contains("error"), "{e}");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
