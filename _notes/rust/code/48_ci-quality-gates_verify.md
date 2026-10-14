---
layout: "note"
title: "48_ci-quality-gates_verify.rs"
display_title: "48_ci-quality-gates_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "48"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/ci-quality-gates/"
parent_title: "CI 품질 게이트"
description: "Rust · CI 품질 게이트 검증 코드"
permalink: "/studies/rust/code/48_ci-quality-gates_verify/"
---
{% raw %}
[CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/) 문서의 검증 코드다.

```rust
//! CI 품질 게이트의 동작을 실제 도구로 확인한다: rustfmt --check 종료 코드, -D warnings,
//! must_use, forbid, rust-version 검사. 그리고 문서의 워크플로와 Cargo.toml 예를 글자로 점검한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/48_ci-quality-gates_verify.rs"

use std::path::{Path, PathBuf};
use std::process::{Command, Output};

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("vr48_{}_{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn rustc_lib(dir: &Path, code: &str, extra: &[&str]) -> Output {
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    Command::new("rustc")
        .args(["--edition", "2024", "--crate-type=lib", "--emit=metadata"])
        .args(extra)
        .arg("--out-dir")
        .arg(dir)
        .arg(&file)
        .output()
        .expect("rustc 실행")
}

fn stderr(o: &Output) -> String {
    String::from_utf8_lossy(&o.stderr).into_owned()
}

fn check_rustfmt() {
    let d = tmp("fmt");
    let ugly = d.join("ugly.rs");
    let pretty = d.join("pretty.rs");
    std::fs::write(&ugly, "fn main(){let x=1;println!(\"{}\",x);}\n").unwrap();
    std::fs::write(
        &pretty,
        "fn main() {\n    let x = 1;\n    println!(\"{}\", x);\n}\n",
    )
    .unwrap();
    let code = |p: &Path| {
        Command::new("rustfmt")
            .args(["--edition", "2024", "--check"])
            .arg(p)
            .output()
            .unwrap()
            .status
            .code()
    };
    let (u, p) = (code(&ugly), code(&pretty));
    println!("rustfmt --check 종료 코드: 서식 다름 {u:?}, 서식 맞음 {p:?}");
    assert_eq!(u, Some(1));
    assert_eq!(p, Some(0));
}

fn check_deny_warnings() {
    let d = tmp("warn");
    let code = "pub fn f() { let unused = 1; }\n";
    let plain = rustc_lib(&d, code, &[]);
    let denied = rustc_lib(&d, code, &["-D", "warnings"]);
    assert!(plain.status.success(), "경고만 있으면 빌드는 된다");
    assert!(stderr(&plain).contains("warning: unused variable"));
    assert!(!denied.status.success(), "-D warnings면 경고가 에러가 된다");
    assert!(stderr(&denied).contains("error: unused variable"));
    println!("-D warnings: 경고만 있던 코드가 빌드 실패로 바뀜");
}

fn check_must_use() {
    let d = tmp("mustuse");
    let warn = rustc_lib(
        &d,
        "pub fn f() -> Result<(), ()> { Ok(()) }\npub fn g() { f(); }\n",
        &[],
    );
    assert!(warn.status.success());
    assert!(stderr(&warn).contains("unused `Result` that must be used"));
    let deny = rustc_lib(
        &d,
        "#![deny(unused_must_use)]\n#[must_use]\npub fn token() -> u32 { 7 }\npub fn g() { token(); }\npub fn h() { let _ = token(); }\n",
        &[],
    );
    assert!(!deny.status.success());
    let e = stderr(&deny);
    assert!(
        e.contains("unused return value of `token` that must be used"),
        "{e}"
    );
    assert_eq!(e.matches("must be used").count(), 1, "`let _ =`은 허용된다");
    println!("must_use: 버린 Result는 경고, deny면 에러, `let _ =`은 통과");
}

fn check_forbid() {
    let d = tmp("forbid");
    let o = rustc_lib(
        &d,
        "#![forbid(unsafe_code)]\n#[allow(unsafe_code)]\npub fn f() {}\n",
        &[],
    );
    assert!(!o.status.success());
    assert!(stderr(&o).contains("E0453"), "{}", stderr(&o));
    println!("forbid(unsafe_code) 아래 allow: E0453");
}

fn check_rust_version() {
    let d = tmp("msrv");
    std::fs::create_dir_all(d.join("src")).unwrap();
    std::fs::write(
        d.join("Cargo.toml"),
        "[package]\nname = \"msrv-demo\"\nversion = \"0.1.0\"\nedition = \"2024\"\nrust-version = \"1.200\"\n",
    )
    .unwrap();
    std::fs::write(d.join("src/lib.rs"), "pub fn f() {}\n").unwrap();
    let o = Command::new("cargo")
        .args(["check", "--offline", "-q"])
        .current_dir(&d)
        .env("CARGO_TARGET_DIR", d.join("target"))
        .output()
        .unwrap();
    assert!(!o.status.success());
    let e = stderr(&o);
    println!("rust-version 1.200: {}", e.trim());
    assert!(e.contains("requires rustc 1.200"), "{e}");
    let ignored = Command::new("cargo")
        .args(["check", "--offline", "-q", "--ignore-rust-version"])
        .current_dir(&d)
        .env("CARGO_TARGET_DIR", d.join("target"))
        .output()
        .unwrap();
    assert!(ignored.status.success(), "{}", stderr(&ignored));
    println!("--ignore-rust-version: 통과");
}

/// 문서에 실은 Cargo.toml 예. MSRV와 [lints]가 있는지 본다.
const MANIFEST: &str = r#"[package]
name = "shortener"
version = "0.3.1"
edition = "2024"
rust-version = "1.88"

[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
pedantic = { level = "warn", priority = -1 }
unwrap_used = "warn"
"#;

fn manifest_value<'a>(text: &'a str, section: &str, key: &str) -> Option<&'a str> {
    let mut in_section = false;
    for line in text.lines() {
        let line = line.trim();
        if line.starts_with('[') {
            in_section = line == format!("[{section}]");
            continue;
        }
        if in_section
            && let Some((k, v)) = line.split_once('=')
            && k.trim() == key
        {
            return Some(v.trim().trim_matches('"'));
        }
    }
    None
}

fn is_bare_version(v: &str) -> bool {
    !v.is_empty()
        && v.split('.').count() <= 3
        && v.split('.')
            .all(|p| !p.is_empty() && p.bytes().all(|b| b.is_ascii_digit()))
}

/// 문서에 실은 워크플로(요약 없이 같은 글자).
const WORKFLOW: &str = r#"name: CI

on:
  push:
    branches: [main]
  pull_request:

env:
  CARGO_TERM_COLOR: always
  RUSTFLAGS: "-Dwarnings"

jobs:
  fmt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: rustup update stable && rustup default stable
      - run: rustup component add rustfmt
      - run: cargo fmt --all -- --check

  clippy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: rustup update stable && rustup default stable
      - run: rustup component add clippy
      - uses: Swatinem/rust-cache@v2
      - run: cargo clippy --all-targets --all-features

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: rustup update stable && rustup default stable
      - uses: Swatinem/rust-cache@v2
      - uses: taiki-e/install-action@v2
        with:
          tool: cargo-nextest
      - run: cargo nextest run --all-features
      - run: cargo test --doc --all-features

  msrv:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: taiki-e/install-action@cargo-hack
      - run: cargo hack check --rust-version --workspace --all-targets --ignore-private

  deny:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        checks:
          - advisories
          - bans licenses sources
    continue-on-error: ${{ matrix.checks == 'advisories' }}
    steps:
      - uses: actions/checkout@v6
      - uses: EmbarkStudios/cargo-deny-action@v2
        with:
          command: check ${{ matrix.checks }}

  semver:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: obi1kenobi/cargo-semver-checks-action@v2
"#;

/// 워크플로에 꼭 있어야 할 명령. 하나라도 없으면 게이트가 빠진 것이다.
const GATES: [&str; 9] = [
    "cargo fmt --all -- --check",
    "RUSTFLAGS: \"-Dwarnings\"",
    "cargo clippy --all-targets --all-features",
    "cargo nextest run",
    "cargo test --doc",
    "cargo hack check --rust-version",
    "EmbarkStudios/cargo-deny-action@v2",
    "obi1kenobi/cargo-semver-checks-action@v2",
    "Swatinem/rust-cache@v2",
];

fn missing_gates(workflow: &str) -> Vec<&'static str> {
    GATES
        .iter()
        .copied()
        .filter(|g| !workflow.contains(g))
        .collect()
}

/// `jobs:` 아래 두 칸 들여 쓴 이름들.
fn workflow_jobs(workflow: &str) -> Vec<&str> {
    workflow
        .lines()
        .skip_while(|l| *l != "jobs:")
        .skip(1)
        .filter(|l| l.starts_with("  ") && !l.starts_with("   ") && l.ends_with(':'))
        .map(|l| l.trim().trim_end_matches(':'))
        .collect()
}

fn main() {
    check_rustfmt();
    check_deny_warnings();
    check_must_use();
    check_forbid();
    check_rust_version();

    let msrv = manifest_value(MANIFEST, "package", "rust-version").unwrap();
    assert!(is_bare_version(msrv));
    assert!(!is_bare_version("^1.88"), "semver 연산자는 안 된다");
    assert!(!is_bare_version("1.88.0-nightly"));
    assert_eq!(
        manifest_value(MANIFEST, "lints.rust", "unsafe_code"),
        Some("forbid")
    );
    println!("Cargo.toml 예: rust-version {msrv}, unsafe_code forbid");
    let jobs = workflow_jobs(WORKFLOW);
    println!("워크플로 job: {jobs:?}");
    assert_eq!(jobs, ["fmt", "clippy", "test", "msrv", "deny", "semver"]);
    let missing = missing_gates(WORKFLOW);
    assert!(missing.is_empty(), "빠진 게이트: {missing:?}");
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn version_shapes() {
        assert!(is_bare_version("1"));
        assert!(is_bare_version("1.88"));
        assert!(is_bare_version("1.88.0"));
        assert!(!is_bare_version("1.88.0.1"));
        assert!(!is_bare_version(">=1.88"));
    }

    #[test]
    fn detects_missing_gate() {
        let without_doc = WORKFLOW.replace("cargo test --doc", "echo skip");
        assert_eq!(missing_gates(&without_doc), vec!["cargo test --doc"]);
    }

    #[test]
    fn reads_sections() {
        assert_eq!(manifest_value(MANIFEST, "package", "edition"), Some("2024"));
        assert_eq!(manifest_value(MANIFEST, "lints.rust", "missing"), None);
    }
}
```
{% endraw %}
