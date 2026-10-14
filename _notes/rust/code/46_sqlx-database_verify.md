---
layout: "note"
title: "46_sqlx-database_verify.rs"
display_title: "46_sqlx-database_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "46"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/sqlx-database/"
parent_title: "sqlx로 데이터베이스 쓰기"
description: "Rust · sqlx로 데이터베이스 쓰기 검증 코드"
sitemap: false
permalink: "/studies/rust/code/46_sqlx-database_verify/"
---
{% raw %}
[sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/) 문서의 검증 코드다.

```rust
//! sqlx 0.9에서 `format!`으로 만든 String을 `sqlx::query`에 바로 넘기면 컴파일 오류가 나는지 확인한다.
//! 의존성: sqlx = { version = "0.9", default-features = false, features = ["runtime-tokio", "sqlite", "macros", "migrate"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/46_sqlx-database_verify.rs"
//!
//! 이 바이너리 옆의 deps 폴더에 있는 sqlx rlib을 `--extern`으로 넘겨 코드 조각을 rustc로 컴파일한다.

use std::path::PathBuf;
use std::process::Command;

// 이 파일 자체도 sqlx를 링크해야 deps 폴더에 rlib이 생긴다.
#[allow(dead_code)]
fn link_sqlx() -> sqlx::query::Query<'static, sqlx::Sqlite, sqlx::sqlite::SqliteArguments> {
    sqlx::query("SELECT 1")
}

fn deps_dir() -> PathBuf {
    let exe = std::env::current_exe().expect("실행 파일 경로");
    exe.parent().expect("부모 폴더").join("deps")
}

fn sqlx_rlib(deps: &PathBuf) -> PathBuf {
    let mut found: Vec<PathBuf> = std::fs::read_dir(deps)
        .expect("deps 읽기")
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(|p| {
            let name = p.file_name().unwrap().to_string_lossy().into_owned();
            name.starts_with("libsqlx-") && name.ends_with(".rlib")
        })
        .collect();
    found.sort();
    found.pop().expect("libsqlx-*.rlib")
}

fn compile_with_sqlx(code: &str) -> (bool, String) {
    let deps = deps_dir();
    let rlib = sqlx_rlib(&deps);
    let dir = std::env::temp_dir().join(format!("vr46_{}_{}", std::process::id(), code.len()));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let mut extern_arg = std::ffi::OsString::from("sqlx=");
    extern_arg.push(&rlib);
    let mut dep_arg = std::ffi::OsString::from("dependency=");
    dep_arg.push(&deps);
    let out = Command::new("rustc")
        .args(["--edition", "2024", "--crate-type=lib", "--emit=metadata"])
        .arg("-L")
        .arg(dep_arg)
        .arg("--extern")
        .arg(extern_arg)
        .arg("--out-dir")
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("rustc 실행");
    let _ = std::fs::remove_dir_all(&dir);
    (
        out.status.success(),
        String::from_utf8_lossy(&out.stderr).into_owned(),
    )
}

const DYNAMIC: &str = r#"
pub fn by_code(code: &str) {
    let sql = format!("SELECT * FROM links WHERE code = '{code}'");
    let _q = sqlx::query::<sqlx::Sqlite>(sql);
}
"#;

const ASSERTED: &str = r#"
pub fn by_code(code: &str) {
    let sql = format!("SELECT * FROM links WHERE code = '{code}'");
    let _q = sqlx::query::<sqlx::Sqlite>(sqlx::AssertSqlSafe(sql));
}
"#;

const BOUND: &str = r#"
pub fn by_code(code: &str) {
    let _q = sqlx::query::<sqlx::Sqlite>("SELECT * FROM links WHERE code = ?").bind(code.to_owned());
}
"#;

fn main() {
    let (ok, err) = compile_with_sqlx(DYNAMIC);
    assert!(!ok, "String을 바로 넘기면 컴파일되지 않아야 한다");
    assert!(err.contains("E0277"), "{err}");
    assert!(
        err.contains("dynamic SQL strings should be audited for possible injections"),
        "{err}"
    );
    let first = err
        .lines()
        .find(|l| l.starts_with("error"))
        .unwrap_or_default();
    println!("String 직접 전달: {first}");

    let (ok, err) = compile_with_sqlx(ASSERTED);
    assert!(ok, "AssertSqlSafe로 감싸면 컴파일된다: {err}");
    println!("AssertSqlSafe(String): 컴파일됨");

    let (ok, err) = compile_with_sqlx(BOUND);
    assert!(ok, "&'static str + bind는 컴파일된다: {err}");
    println!("&'static str + bind: 컴파일됨");

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
