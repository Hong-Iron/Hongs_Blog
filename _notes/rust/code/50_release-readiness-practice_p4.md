---
layout: "note"
title: "50_release-readiness-practice_p4.rs"
display_title: "50_release-readiness-practice_p4.rs"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "50"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/release-readiness-practice/"
parent_title: "배포 준비 연습"
description: "Rust · 배포 준비 연습 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/50_release-readiness-practice_p4/"
---
{% raw %}
[배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/) 문서의 문제 4 풀이 코드다.

```rust
//! 50 배포 준비 연습 p4: 커밋 해시를 실행 파일에 넣는 build.rs. 우선순위는 환경 변수 GIT_HASH → git → "unknown".
//! 임시 cargo 패키지와 임시 git 저장소를 만들어 네 경우(git 없음, 환경 변수, 커밋, 다음 커밋)와
//! HEAD 파일만 지켜보면 다음 커밋에서 해시가 낡는 것을 확인한다.
//! 의존성: 없음 (표준 라이브러리만). git과 cargo가 PATH에 있어야 한다.
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/50_release-readiness-practice_p4.rs"

use std::path::{Path, PathBuf};
use std::process::{Command, Output};

/// 문제의 답: 패키지 맨 위에 두는 build.rs.
const BUILD_RS: &str = r#"use std::process::Command;

fn main() {
    // 1. 밖에서 준 값이 먼저다. .git이 없는 Docker 빌드에서 쓴다.
    println!("cargo::rerun-if-env-changed=GIT_HASH");
    let hash = std::env::var("GIT_HASH")
        .ok()
        .filter(|h| !h.is_empty())
        .or_else(git_hash)
        .unwrap_or_else(|| "unknown".to_string());
    println!("cargo::rustc-env=GIT_HASH={hash}");
}

fn git(args: &[&str]) -> Option<String> {
    let dir = std::env::var("CARGO_MANIFEST_DIR").ok()?;
    let out = Command::new("git").args(args).current_dir(dir).output().ok()?;
    if !out.status.success() {
        return None;
    }
    Some(String::from_utf8(out.stdout).ok()?.trim().to_string())
}

fn git_hash() -> Option<String> {
    let hash = git(&["rev-parse", "--short=7", "HEAD"])?;
    // 2. 커밋이 바뀌면 다시 돈다: HEAD(브랜치를 바꿀 때)와 HEAD가 가리키는 브랜치 파일(커밋할 때).
    let git_dir = git(&["rev-parse", "--git-dir"])?;
    println!("cargo::rerun-if-changed={git_dir}/HEAD");
    if let Some(branch) = git(&["symbolic-ref", "-q", "HEAD"]) {
        println!("cargo::rerun-if-changed={git_dir}/{branch}");
    }
    Some(hash)
}
"#;

const MAIN_RS: &str = "fn main() {\n    println!(\"{}\", env!(\"GIT_HASH\"));\n}\n";

const MANIFEST: &str = "[package]\nname = \"hash-demo\"\nversion = \"0.1.0\"\nedition = \"2024\"\n";

fn root() -> PathBuf {
    std::env::temp_dir().join(format!("vr50p4_{}", std::process::id()))
}

fn package(name: &str, build_rs: &str) -> PathBuf {
    let d = root().join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(d.join("src")).unwrap();
    std::fs::write(d.join("Cargo.toml"), MANIFEST).unwrap();
    std::fs::write(d.join("build.rs"), build_rs).unwrap();
    std::fs::write(d.join("src/main.rs"), MAIN_RS).unwrap();
    std::fs::write(d.join("README"), "v1\n").unwrap();
    d
}

/// 사용자의 git 설정(서명, 훅)이 끼어들지 않게 하고, 임시 폴더 위쪽의 저장소를 찾지 않게 한다.
fn isolate(cmd: &mut Command) -> &mut Command {
    cmd.env("GIT_CONFIG_GLOBAL", "/dev/null")
        .env("GIT_CONFIG_NOSYSTEM", "1")
        .env("GIT_CEILING_DIRECTORIES", root())
        .env_remove("GIT_DIR")
        .env_remove("GIT_WORK_TREE")
}

fn git(dir: &Path, args: &[&str]) -> String {
    let out = isolate(&mut Command::new("git"))
        .args(["-c", "user.name=demo", "-c", "user.email=demo@example.com"])
        .args(args)
        .current_dir(dir)
        .output()
        .expect("git 실행");
    assert!(
        out.status.success(),
        "git {args:?}: {}",
        String::from_utf8_lossy(&out.stderr)
    );
    String::from_utf8_lossy(&out.stdout).trim().to_string()
}

fn commit(dir: &Path, readme: &str) -> String {
    std::fs::write(dir.join("README"), readme).unwrap();
    git(dir, &["add", "Cargo.toml", "build.rs", "src", "README"]);
    git(dir, &["commit", "-q", "-m", readme.trim()]);
    git(dir, &["rev-parse", "--short=7", "HEAD"])
}

fn run(dir: &Path, git_hash: Option<&str>) -> String {
    let mut cmd = Command::new("cargo");
    isolate(&mut cmd)
        .args(["run", "-q", "--offline"])
        .current_dir(dir)
        .env("CARGO_TARGET_DIR", dir.join("target"))
        .env_remove("GIT_HASH");
    if let Some(h) = git_hash {
        cmd.env("GIT_HASH", h);
    }
    let out: Output = cmd.output().expect("cargo 실행");
    assert!(
        out.status.success(),
        "{}",
        String::from_utf8_lossy(&out.stderr)
    );
    String::from_utf8_lossy(&out.stdout).trim().to_string()
}

fn main() {
    let _ = std::fs::remove_dir_all(root());

    // (가) git 저장소가 아니다: unknown. (나) 환경 변수를 주면 그 값.
    let plain = package("plain", BUILD_RS);
    assert_eq!(run(&plain, None), "unknown");
    assert_eq!(run(&plain, Some("deadbee")), "deadbee");
    assert_eq!(run(&plain, None), "unknown");
    println!("git 없음: unknown, GIT_HASH=deadbee: deadbee");

    // (다) 커밋이 있다: git이 준 7글자. (라) 다음 커밋을 하면 다시 빌드되어 새 해시.
    let repo = package("repo", BUILD_RS);
    git(&repo, &["init", "-q", "-b", "main"]);
    let first = commit(&repo, "v1\n");
    assert_eq!(first.len(), 7);
    assert_eq!(run(&repo, None), first);
    let second = commit(&repo, "v2\n");
    assert_ne!(first, second);
    assert_eq!(run(&repo, None), second);
    // 환경 변수가 git보다 먼저다.
    assert_eq!(run(&repo, Some("cafe123")), "cafe123");
    println!("커밋 {first} → {second}: 실행 파일의 해시도 따라 바뀜");

    // 변형: HEAD 파일만 지켜보면 같은 브랜치의 다음 커밋을 놓친다.
    let head_only_rs = BUILD_RS.replace(
        "    if let Some(branch) = git(&[\"symbolic-ref\", \"-q\", \"HEAD\"]) {\n        println!(\"cargo::rerun-if-changed={git_dir}/{branch}\");\n    }\n",
        "",
    );
    assert_ne!(head_only_rs, BUILD_RS, "바꿀 줄을 찾았다");
    let stale = package("stale", &head_only_rs);
    git(&stale, &["init", "-q", "-b", "main"]);
    let a = commit(&stale, "v1\n");
    assert_eq!(run(&stale, None), a);
    let b = commit(&stale, "v2\n");
    assert_eq!(
        std::fs::read_to_string(stale.join(".git/HEAD")).unwrap(),
        "ref: refs/heads/main\n"
    );
    let shown = run(&stale, None);
    assert_eq!(shown, a, "HEAD 파일은 그대로라 build.rs가 다시 돌지 않았다");
    assert_ne!(shown, b);
    println!("HEAD만 지켜봄: 실제 {b}, 실행 파일은 여전히 {shown}");

    let _ = std::fs::remove_dir_all(root());
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn build_rs_emits_both_instructions() {
        assert!(BUILD_RS.contains("cargo::rerun-if-env-changed=GIT_HASH"));
        assert!(BUILD_RS.contains("cargo::rustc-env=GIT_HASH={hash}"));
        assert!(MAIN_RS.contains("env!(\"GIT_HASH\")"));
    }
}
```
{% endraw %}
