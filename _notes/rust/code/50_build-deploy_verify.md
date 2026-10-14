---
layout: "note"
title: "50_build-deploy_verify.rs"
display_title: "50_build-deploy_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "50"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/build-deploy/"
parent_title: "빌드와 배포"
description: "Rust · 빌드와 배포 검증 코드"
sitemap: false
permalink: "/studies/rust/code/50_build-deploy_verify/"
---
{% raw %}
[빌드와 배포](/Hongs_Blog/studies/rust/build-deploy/) 문서의 검증 코드다.

```rust
//! 50 빌드와 배포: env!·option_env!로 빌드할 때의 값을 실행 파일에 넣기, cfg!와 #[cfg]의 차이(E0425),
//! build.rs의 cargo::rustc-env, 환경 변수가 바뀌면 다시 빌드되는 것, --locked, release의 기본 strip,
//! musl 타깃의 기본 crt-static을 rustc·cargo로 확인한다. Dockerfile은 실행하지 않고 글자로 점검한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/50_build-deploy_verify.rs"

use std::path::{Path, PathBuf};
use std::process::{Command, Output};

// ---------- 1. 이 실행 파일에 박힌 빌드 정보 ----------

const PKG_NAME: &str = env!("CARGO_PKG_NAME");
const PKG_VERSION: &str = env!("CARGO_PKG_VERSION");
/// 빌드할 때 VAULT_DEMO_GIT_HASH가 없었으면 "unknown". 빌드는 어느 쪽이든 된다.
const GIT_HASH: &str = match option_env!("VAULT_DEMO_GIT_HASH") {
    Some(h) => h,
    None => "unknown",
};

fn version_line() -> String {
    format!("{PKG_NAME} {PKG_VERSION} ({GIT_HASH})")
}

/// `[package]` 아래 `key = "값"`을 읽는다.
fn package_value(manifest: &str, key: &str) -> Option<String> {
    let mut in_package = false;
    for line in manifest.lines() {
        let line = line.trim();
        if line.starts_with('[') {
            in_package = line == "[package]";
            continue;
        }
        if in_package
            && let Some((k, v)) = line.split_once('=')
            && k.trim() == key
        {
            return Some(v.trim().trim_matches('"').to_string());
        }
    }
    None
}

fn check_embedded() {
    let manifest =
        std::fs::read_to_string(concat!(env!("CARGO_MANIFEST_DIR"), "/Cargo.toml")).unwrap();
    assert_eq!(
        package_value(&manifest, "version").as_deref(),
        Some(PKG_VERSION)
    );
    assert_eq!(package_value(&manifest, "name").as_deref(), Some(PKG_NAME));
    assert_eq!(GIT_HASH, "unknown");
    println!(
        "이 파일: {} / debug_assertions={}",
        version_line(),
        cfg!(debug_assertions)
    );
}

// ---------- 2. rustc로 env!·option_env!·cfg! 확인 ----------

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("vr50_{}_{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn stderr(o: &Output) -> String {
    String::from_utf8_lossy(&o.stderr).into_owned()
}

fn stdout(o: &Output) -> String {
    String::from_utf8_lossy(&o.stdout).into_owned()
}

/// 실행 파일로 컴파일한다. `env`가 Some이면 APP_GIT_HASH를 그 값으로 준다.
fn rustc_bin(dir: &Path, src: &str, env: Option<&str>) -> Output {
    let file = dir.join("main.rs");
    std::fs::write(&file, src).unwrap();
    let mut cmd = Command::new("rustc");
    cmd.args(["--edition", "2024", "-o"])
        .arg(dir.join("app"))
        .arg(&file)
        .env_remove("APP_GIT_HASH");
    if let Some(v) = env {
        cmd.env("APP_GIT_HASH", v);
    }
    cmd.output().expect("rustc 실행")
}

fn run_app(dir: &Path) -> String {
    stdout(&Command::new(dir.join("app")).output().unwrap())
        .trim()
        .to_string()
}

fn check_env_macros() {
    let d = tmp("env");
    let strict = "fn main() { println!(\"{}\", env!(\"APP_GIT_HASH\")); }\n";
    let missing = rustc_bin(&d, strict, None);
    assert!(!missing.status.success());
    let e = stderr(&missing);
    assert!(
        e.contains("environment variable `APP_GIT_HASH` not defined at compile time"),
        "{e}"
    );
    let given = rustc_bin(&d, strict, Some("abc1234"));
    assert!(given.status.success(), "{}", stderr(&given));
    assert_eq!(run_app(&d), "abc1234");
    // 실행할 때의 환경 변수는 상관없다. 값은 이미 실행 파일 안에 있다.
    let at_run = Command::new(d.join("app"))
        .env("APP_GIT_HASH", "zzz")
        .output()
        .unwrap();
    assert_eq!(stdout(&at_run).trim(), "abc1234");

    let custom = "fn main() { println!(\"{}\", env!(\"APP_GIT_HASH\", \"set APP_GIT_HASH to the commit hash\")); }\n";
    let e = stderr(&rustc_bin(&d, custom, None));
    assert!(
        e.contains("error: set APP_GIT_HASH to the commit hash"),
        "{e}"
    );

    let loose =
        "fn main() { println!(\"{}\", option_env!(\"APP_GIT_HASH\").unwrap_or(\"unknown\")); }\n";
    assert!(rustc_bin(&d, loose, None).status.success());
    assert_eq!(run_app(&d), "unknown");
    assert!(rustc_bin(&d, loose, Some("abc1234")).status.success());
    assert_eq!(run_app(&d), "abc1234");
    println!(
        "env!: 없으면 컴파일 오류(두 번째 인자로 메시지), option_env!: 없으면 None, 실행 때 값은 무관"
    );
}

fn rustc_lib(dir: &Path, src: &str) -> Output {
    let file = dir.join("lib.rs");
    std::fs::write(&file, src).unwrap();
    Command::new("rustc")
        .args(["--edition", "2024", "--crate-type=lib", "--emit=metadata"])
        .arg("--out-dir")
        .arg(dir)
        .arg(&file)
        .output()
        .expect("rustc 실행")
}

fn check_cfg_macro() {
    let d = tmp("cfg");
    // cfg!는 true/false만 낸다. 두 갈래 모두 이 플랫폼에서 컴파일되어야 한다.
    let with_macro = "#[cfg(windows)]\nfn only_windows() -> u32 { 1 }\n\
                      pub fn f() -> u32 { if cfg!(windows) { only_windows() } else { 0 } }\n";
    let with_attr = "#[cfg(windows)]\nfn only_windows() -> u32 { 1 }\n\
                     pub fn f() -> u32 {\n    #[cfg(windows)]\n    return only_windows();\n    #[cfg(not(windows))]\n    return 0;\n}\n";
    if cfg!(windows) {
        println!("windows에서는 cfg 비교를 건너뛴다");
        return;
    }
    let bad = rustc_lib(&d, with_macro);
    let e = stderr(&bad);
    assert!(
        e.contains("error[E0425]: cannot find function `only_windows` in this scope"),
        "{e}"
    );
    let ok = rustc_lib(&d, with_attr);
    assert!(ok.status.success(), "{}", stderr(&ok));
    println!("cfg!(windows) 갈래에서 #[cfg(windows)] 함수를 부르면 E0425, #[cfg]로 가르면 통과");
}

fn check_musl_static() {
    let cfg_of = |target: &str, extra: &[&str]| {
        stdout(
            &Command::new("rustc")
                .args(["--print", "cfg", "--target", target])
                .args(extra)
                .output()
                .unwrap(),
        )
    };
    let musl = cfg_of("x86_64-unknown-linux-musl", &[]);
    let musl_arm = cfg_of("aarch64-unknown-linux-musl", &[]);
    let gnu = cfg_of("x86_64-unknown-linux-gnu", &[]);
    let musl_dynamic = cfg_of(
        "x86_64-unknown-linux-musl",
        &["-C", "target-feature=-crt-static"],
    );
    let has = |s: &str| s.lines().any(|l| l == "target_feature=\"crt-static\"");
    assert!(musl.contains("target_env=\"musl\""));
    assert!(has(&musl) && has(&musl_arm));
    assert!(gnu.contains("target_env=\"gnu\""));
    assert!(!has(&gnu));
    // 호출이 실패하면 stdout이 비어 `!has`가 그냥 참이 되므로, 같은 출력에 musl 대상이 찍혔는지 먼저 본다.
    assert!(
        musl_dynamic.contains("target_env=\"musl\""),
        "{musl_dynamic}"
    );
    assert!(!has(&musl_dynamic));
    println!(
        "crt-static 기본값: x86_64·aarch64 musl 켬, x86_64 gnu 끔, musl에 -crt-static 주면 끔"
    );
}

// ---------- 3. cargo 패키지로 build.rs·프로필·--locked 확인 ----------

const DEMO_MANIFEST: &str =
    "[package]\nname = \"buildinfo-demo\"\nversion = \"1.4.2\"\nedition = \"2024\"\n";

const DEMO_BUILD_RS: &str = r#"fn main() {
    println!("cargo::rerun-if-changed=build.rs");
    let target = std::env::var("TARGET").expect("cargo가 TARGET을 준다");
    println!("cargo::rustc-env=BUILD_TARGET={target}");
}
"#;

const DEMO_MAIN_RS: &str = r#"const VERSION: &str = env!("CARGO_PKG_VERSION");
const GIT_HASH: Option<&str> = option_env!("GIT_HASH");

fn main() {
    println!(
        "{} {} ({}) target={} debug_assertions={}",
        env!("CARGO_PKG_NAME"),
        VERSION,
        GIT_HASH.unwrap_or("unknown"),
        env!("BUILD_TARGET"),
        cfg!(debug_assertions),
    );
}
"#;

fn cargo(dir: &Path, args: &[&str], git_hash: Option<&str>) -> Output {
    let mut cmd = Command::new("cargo");
    cmd.args(args)
        .arg("--offline")
        .current_dir(dir)
        .env("CARGO_TARGET_DIR", dir.join("target"))
        .env_remove("GIT_HASH");
    if let Some(h) = git_hash {
        cmd.env("GIT_HASH", h);
    }
    cmd.output().expect("cargo 실행")
}

/// `cargo -v`의 출력에서 이 패키지의 실행 파일을 컴파일한 rustc 줄을 찾는다.
fn bin_rustc_line(err: &str) -> String {
    err.lines()
        .find(|l| l.contains("--crate-name buildinfo_demo") && l.contains("--crate-type bin"))
        .unwrap_or_else(|| panic!("rustc 줄이 없다:\n{err}"))
        .to_string()
}

fn host_triple() -> String {
    let out = stdout(&Command::new("rustc").arg("-vV").output().unwrap());
    out.lines()
        .find_map(|l| l.strip_prefix("host: "))
        .unwrap()
        .to_string()
}

fn check_cargo_project() {
    let d = tmp("cargo");
    std::fs::create_dir_all(d.join("src")).unwrap();
    std::fs::write(d.join("Cargo.toml"), DEMO_MANIFEST).unwrap();
    std::fs::write(d.join("build.rs"), DEMO_BUILD_RS).unwrap();
    std::fs::write(d.join("src/main.rs"), DEMO_MAIN_RS).unwrap();

    // --locked: Cargo.lock이 없으면 만들지 않고 멈춘다.
    let locked = cargo(&d, &["build", "--locked", "-q"], None);
    assert!(!locked.status.success());
    assert!(
        stderr(&locked).contains("cannot create the lock file"),
        "{}",
        stderr(&locked)
    );

    // release의 기본: debug = false이므로 cargo가 -C strip=debuginfo를 넘긴다.
    let rel = cargo(&d, &["build", "--release", "-v"], None);
    assert!(rel.status.success(), "{}", stderr(&rel));
    let line = bin_rustc_line(&stderr(&rel));
    assert!(line.contains("-C opt-level=3"), "{line}");
    assert!(line.contains("-C strip=debuginfo"), "{line}");
    let sym = cargo(
        &d,
        &[
            "build",
            "--release",
            "-v",
            "--config",
            "profile.release.strip=\"symbols\"",
        ],
        None,
    );
    let line = bin_rustc_line(&stderr(&sym));
    assert!(line.contains("-C strip=symbols"), "{line}");
    let lines = cargo(
        &d,
        &[
            "build",
            "--release",
            "-v",
            "--config",
            "profile.release.debug=\"line-tables-only\"",
        ],
        None,
    );
    assert!(lines.status.success(), "{}", stderr(&lines));
    let line = bin_rustc_line(&stderr(&lines));
    assert!(line.contains("-C debuginfo=line-tables-only"), "{line}");
    assert!(!line.contains("-C strip="), "{line}");
    println!(
        "release 기본 -C strip=debuginfo, strip=\"symbols\"면 -C strip=symbols, 줄 정보를 켜면 strip 없음"
    );

    let host = host_triple();
    let dev = cargo(&d, &["run", "-q"], None);
    assert!(dev.status.success(), "{}", stderr(&dev));
    assert_eq!(
        stdout(&dev).trim(),
        format!("buildinfo-demo 1.4.2 (unknown) target={host} debug_assertions=true")
    );
    // 환경 변수만 바꿔도 cargo가 알아채고 다시 컴파일한다.
    let dev_hash = cargo(&d, &["run", "-q"], Some("abc1234"));
    assert_eq!(
        stdout(&dev_hash).trim(),
        format!("buildinfo-demo 1.4.2 (abc1234) target={host} debug_assertions=true")
    );
    let rel_hash = cargo(&d, &["run", "--release", "-q"], Some("abc1234"));
    let rel_out = stdout(&rel_hash);
    assert_eq!(
        rel_out.trim(),
        format!("buildinfo-demo 1.4.2 (abc1234) target={host} debug_assertions=false")
    );
    println!("데모 패키지: {}", rel_out.trim());

    // 이제 Cargo.lock이 있다. --locked는 통과하고, 버전을 올려 lock이 바뀌어야 하면 멈춘다.
    let ok = cargo(&d, &["build", "--locked", "-q"], None);
    assert!(ok.status.success(), "{}", stderr(&ok));
    std::fs::write(
        d.join("Cargo.toml"),
        DEMO_MANIFEST.replace("1.4.2", "1.4.3"),
    )
    .unwrap();
    let stale = cargo(&d, &["build", "--locked", "-q"], None);
    assert!(!stale.status.success());
    assert!(
        stderr(&stale).contains("cannot update the lock file"),
        "{}",
        stderr(&stale)
    );
    println!("--locked: lock 없음 → 멈춤, lock 있음 → 통과, lock을 고쳐야 함 → 멈춤");
}

// ---------- 4. Dockerfile 글자 점검 (실행하지 않는다) ----------

/// 문서에 실은 Dockerfile과 같은 글자.
const DOCKERFILE: &str = r#"# syntax=docker/dockerfile:1

# 1단계: 빌드. 툴체인과 소스가 있는 큰 이미지
FROM rust:1.99-slim-trixie AS builder
WORKDIR /app
COPY . .
ARG GIT_HASH=unknown
ENV GIT_HASH=${GIT_HASH}
RUN cargo build --release --locked --bin shortener

# 2단계: 실행. 실행 파일 하나만 옮긴다
FROM debian:trixie-slim AS runtime
COPY --from=builder /app/target/release/shortener /usr/local/bin/shortener
USER 10001:10001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD ["/usr/local/bin/shortener", "healthcheck"]
ENTRYPOINT ["/usr/local/bin/shortener"]
"#;

const DOCKERIGNORE: &str = "target/\n.git/\n";

/// 배포 이미지가 지켜야 할 것. 어긴 항목의 이름을 돌려준다.
fn lint_dockerfile(text: &str) -> Vec<&'static str> {
    let lines: Vec<&str> = text
        .lines()
        .map(str::trim)
        .filter(|l| !l.is_empty() && !l.starts_with('#'))
        .collect();
    let froms: Vec<usize> = lines
        .iter()
        .enumerate()
        .filter(|(_, l)| l.starts_with("FROM "))
        .map(|(i, _)| i)
        .collect();
    let mut problems = Vec::new();
    if froms.len() < 2 {
        problems.push("다단계 빌드가 아니다");
        return problems;
    }
    let last = &lines[*froms.last().unwrap()..];
    let builder_image = lines[froms[0]];
    if !builder_image.contains(" AS builder") {
        problems.push("빌드 단계에 이름이 없다");
    }
    if !lines
        .iter()
        .any(|l| l.contains("cargo build --release --locked"))
    {
        problems.push("--release --locked로 빌드하지 않는다");
    }
    let release_of = |image: &str| {
        ["bookworm", "trixie", "forky"]
            .into_iter()
            .find(|r| image.contains(r))
    };
    if release_of(builder_image).is_none() || release_of(builder_image) != release_of(last[0]) {
        problems.push("두 단계의 Debian 판이 다르다");
    }
    if !last.iter().any(|l| l.starts_with("COPY --from=builder")) {
        problems.push("빌드 결과를 옮기지 않는다");
    }
    if last
        .iter()
        .any(|l| l.contains("cargo ") || l.contains("rustup"))
    {
        problems.push("실행 단계에 툴체인을 쓴다");
    }
    match last.iter().find_map(|l| l.strip_prefix("USER ")) {
        Some(u) if !u.starts_with("root") && !u.starts_with('0') => {}
        _ => problems.push("root로 돈다"),
    }
    if text.matches("HEALTHCHECK").count() != 1 {
        problems.push("HEALTHCHECK가 정확히 하나가 아니다");
    }
    if !last.iter().any(|l| l.starts_with("ENTRYPOINT [")) {
        problems.push("ENTRYPOINT가 exec 형식이 아니다");
    }
    problems
}

fn check_dockerfile() {
    let problems = lint_dockerfile(DOCKERFILE);
    assert!(problems.is_empty(), "{problems:?}");
    assert!(DOCKERIGNORE.lines().any(|l| l == "target/"));
    let bad = DOCKERFILE
        .replace("USER 10001:10001\n", "")
        .replace(
            "ENTRYPOINT [\"/usr/local/bin/shortener\"]",
            "ENTRYPOINT /usr/local/bin/shortener",
        )
        .replace("debian:trixie-slim", "debian:bookworm-slim");
    let got = lint_dockerfile(&bad);
    assert_eq!(
        got,
        [
            "두 단계의 Debian 판이 다르다",
            "root로 돈다",
            "ENTRYPOINT가 exec 형식이 아니다"
        ]
    );
    println!("Dockerfile 글자 점검: 문제 0, 망가뜨린 판은 {got:?}");
}

fn main() {
    check_embedded();
    check_env_macros();
    check_cfg_macro();
    check_musl_static();
    check_cargo_project();
    check_dockerfile();
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn single_stage_is_rejected() {
        let one = "FROM rust:1.99-trixie\nRUN cargo build --release --locked\nCMD [\"app\"]\n";
        assert_eq!(lint_dockerfile(one), ["다단계 빌드가 아니다"]);
    }

    #[test]
    fn package_value_reads_only_package() {
        let m = "[package]\nname = \"a\"\nversion = \"1.0.0\"\n[dependencies]\nversion = \"9\"\n";
        assert_eq!(package_value(m, "version").as_deref(), Some("1.0.0"));
        assert_eq!(package_value(m, "edition"), None);
    }

    #[test]
    fn version_line_has_three_parts() {
        assert_eq!(version_line().split(' ').count(), 3);
    }
}
```
{% endraw %}
