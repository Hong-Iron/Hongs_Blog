---
layout: "note"
title: "02_cargo-packages_verify.rs"
display_title: "02_cargo-packages_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/cargo-packages/"
parent_title: "cargo와 패키지 구조"
description: "Rust · cargo와 패키지 구조 검증 코드"
sitemap: false
permalink: "/studies/rust/code/02_cargo-packages_verify/"
---
{% raw %}
[cargo와 패키지 구조](/Hongs_Blog/studies/rust/cargo-packages/) 문서의 검증 코드다.

```rust
//! 02 cargo와 패키지 구조: cargo가 넣어 주는 환경 변수, cargo new가 만드는 파일, Cargo.lock,
//! dev와 release 프로필의 차이(debug_assertions, overflow-checks), 기능(feature) 켜기를 확인한다.
//! 의존성: 없음 (표준 라이브러리만). 임시 폴더에 의존성 없는 패키지를 만들어 cargo로 빌드한다(인터넷 필요 없음).
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/02_cargo-packages_verify.rs"

use std::path::{Path, PathBuf};
use std::process::Command;

/// 임시 패키지 폴더에서 cargo를 실행하고 (성공 여부, stdout, stderr)를 돌려준다.
fn cargo(dir: &Path, target: &Path, args: &[&str]) -> (bool, String, String) {
    let out = Command::new("cargo")
        .args(args)
        .current_dir(dir)
        .env("CARGO_TARGET_DIR", target)
        .env("CARGO_TERM_COLOR", "never")
        .env_remove("RUSTFLAGS")
        .output()
        .expect("cargo 실행");
    (
        out.status.success(),
        String::from_utf8_lossy(&out.stdout).into_owned(),
        String::from_utf8_lossy(&out.stderr).into_owned(),
    )
}

const MAIN_RS: &str = r#"use std::hint::black_box;

fn main() {
    println!("debug_assertions={}", cfg!(debug_assertions));
    println!("fancy={}", cfg!(feature = "fancy"));
    let x: u8 = black_box(255);
    println!("255+1={}", x + 1);
}
"#;

fn main() {
    // 1. cargo가 컴파일할 때 넣어 주는 환경 변수. 이 파일은 harness 패키지(vault-rust 0.1.0)로 빌드된다.
    assert_eq!(env!("CARGO_PKG_NAME"), "vault-rust");
    assert_eq!(env!("CARGO_PKG_VERSION"), "0.1.0");
    // Cargo.toml에 description이 없으면 빈 문자열이다.
    assert_eq!(env!("CARGO_PKG_DESCRIPTION"), "");
    println!(
        "CARGO_PKG_NAME={} CARGO_PKG_VERSION={}",
        env!("CARGO_PKG_NAME"),
        env!("CARGO_PKG_VERSION")
    );
    // rs_check는 cargo run(dev 프로필)으로 실행하므로 debug_assertions가 켜져 있다.
    const { assert!(cfg!(debug_assertions)) };
    println!("이 파일: debug_assertions={}", cfg!(debug_assertions));

    // 2. cargo new가 만드는 것.
    let root: PathBuf = std::env::temp_dir().join(format!("vr_cargo_{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&root);
    std::fs::create_dir_all(&root).unwrap();
    let target = root.join("target");
    let (ok, _, err) = cargo(&root, &target, &["new", "--vcs", "none", "hello"]);
    assert!(ok, "{err}");
    let pkg = root.join("hello");
    let manifest = std::fs::read_to_string(pkg.join("Cargo.toml")).unwrap();
    println!("--- cargo new가 만든 Cargo.toml ---\n{manifest}---");
    assert!(manifest.contains("name = \"hello\""));
    assert!(manifest.contains("version = \"0.1.0\""));
    assert!(manifest.contains("edition = \"2024\""));
    assert!(manifest.contains("[dependencies]"));
    assert!(pkg.join("src/main.rs").exists());
    assert!(
        !pkg.join("Cargo.lock").exists(),
        "빌드 전에는 Cargo.lock이 없다"
    );

    // 3. 기능(feature)과 release 프로필 설정을 덧붙인다.
    let manifest = manifest + "\n[features]\nfancy = []\n";
    std::fs::write(pkg.join("Cargo.toml"), &manifest).unwrap();
    std::fs::write(pkg.join("src/main.rs"), MAIN_RS).unwrap();

    // 4. dev 프로필: debug_assertions 켜짐, 정수 넘침은 panic.
    let (ok, out, err) = cargo(&pkg, &target, &["run", "-q"]);
    println!("cargo run          -> ok={ok} {}", out.replace('\n', " "));
    assert!(!ok);
    assert!(out.contains("debug_assertions=true"));
    assert!(out.contains("fancy=false"));
    assert!(err.contains("attempt to add with overflow"), "{err}");
    assert!(
        pkg.join("Cargo.lock").exists(),
        "첫 빌드 뒤 Cargo.lock이 생긴다"
    );

    // 5. release 프로필: debug_assertions 꺼짐, 넘침은 감아 돌아 0.
    let (ok, out, err) = cargo(&pkg, &target, &["run", "-q", "--release"]);
    println!("cargo run --release -> ok={ok} {}", out.replace('\n', " "));
    assert!(ok, "{err}");
    assert!(out.contains("debug_assertions=false"));
    assert!(out.contains("255+1=0"));

    // 6. 기능 켜기: --features fancy.
    let (ok, out, err) = cargo(
        &pkg,
        &target,
        &["run", "-q", "--release", "--features", "fancy"],
    );
    println!("--features fancy    -> ok={ok} {}", out.replace('\n', " "));
    assert!(ok, "{err}");
    assert!(out.contains("fancy=true"));

    // 7. release 프로필에서도 넘침 검사를 켤 수 있다.
    let manifest = manifest + "\n[profile.release]\noverflow-checks = true\n";
    std::fs::write(pkg.join("Cargo.toml"), &manifest).unwrap();
    let (ok, out, err) = cargo(&pkg, &target, &["run", "-q", "--release"]);
    println!(
        "release + overflow-checks = true -> ok={ok} {}",
        out.replace('\n', " ")
    );
    assert!(!ok);
    assert!(out.contains("debug_assertions=false"));
    assert!(err.contains("attempt to add with overflow"), "{err}");

    // 8. cargo check는 실행 파일을 만들지 않는다.
    let (ok, _, err) = cargo(&pkg, &root.join("target-check"), &["check", "-q"]);
    assert!(ok, "{err}");
    assert!(!root.join("target-check/debug/hello").exists());
    println!("cargo check -> 실행 파일 없음");

    // 9. Cargo.toml에 없는 기능 이름(오타)은 unexpected_cfgs 경고로 알려 준다.
    std::fs::write(
        pkg.join("src/main.rs"),
        "fn main() {\n    println!(\"{}\", cfg!(feature = \"fanci\"));\n}\n",
    )
    .unwrap();
    let (ok, _, err) = cargo(&pkg, &root.join("target-check"), &["check"]);
    assert!(ok, "{err}");
    assert!(
        err.contains("unexpected `cfg` condition value: `fanci`"),
        "{err}"
    );
    println!("기능 이름 오타 -> warning: unexpected `cfg` condition value");

    let _ = std::fs::remove_dir_all(&root);
    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
