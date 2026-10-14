---
layout: "note"
title: "41_modules-workspaces_verify.rs"
display_title: "41_modules-workspaces_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "41"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/modules-workspaces/"
parent_title: "모듈과 워크스페이스"
description: "Rust · 모듈과 워크스페이스 검증 코드"
permalink: "/studies/rust/code/41_modules-workspaces_verify/"
---
{% raw %}
[모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/) 문서의 검증 코드다.

```rust
//! 모듈과 가시성(pub, pub(crate), pub(super), pub use)을 인라인 mod로 확인하고,
//! 컴파일 오류 코드(E0603, E0616, E0451)와 크레이트 경계를 넘는 pub(crate), 기능 플래그(cfg feature),
//! 워크스페이스([workspace.dependencies], [workspace.lints])를 rustc·cargo로 실제로 돌려 확인한다.
//! 의존성: 없음 (표준 라이브러리만)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/41_modules-workspaces_verify.rs"

use std::path::{Path, PathBuf};
use std::process::Command;

mod shop {
    // 바깥에 보여 줄 이름만 다시 내보낸다(re-export). 사용자는 shop::Item으로 쓴다.
    pub use self::catalog::Item;

    pub mod catalog {
        pub struct Item {
            pub name: String,
            price_cents: u32, // 필드는 따로 pub을 붙여야 보인다
        }

        impl Item {
            pub fn new(name: &str, price_cents: u32) -> Item {
                Item {
                    name: name.to_string(),
                    price_cents,
                }
            }
            pub fn price(&self) -> u32 {
                super::pricing::discounted(self.price_cents)
            }
        }

        /// 이 크레이트 안 어디서나 보인다. 다른 크레이트에서는 안 보인다.
        pub(crate) fn count_for_metrics() -> usize {
            1
        }
    }

    // pub이 없으니 shop과 그 자손만 본다.
    mod pricing {
        pub(super) fn discounted(cents: u32) -> u32 {
            cents - cents / 10
        }
    }
}

fn rustc(dir: &Path, file: &str, code: &str, extra: &[&str]) -> (bool, String) {
    let f = dir.join(file);
    std::fs::write(&f, code).expect("write");
    let out = Command::new("rustc")
        .args(["--edition", "2024", "--emit=metadata", "--out-dir"])
        .arg(dir)
        .args(extra)
        .arg(&f)
        .output()
        .expect("rustc 실행");
    (
        out.status.success(),
        String::from_utf8_lossy(&out.stderr).into_owned(),
    )
}

fn tmp(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("vr_mod_{}_{name}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).expect("mkdir");
    d
}

const SHOP: &str = r#"
#![allow(dead_code)]
pub mod shop {
    pub use self::catalog::Item;
    pub mod catalog {
        pub struct Item { pub name: String, price_cents: u32 }
        impl Item { pub fn new(n: &str, p: u32) -> Item { Item { name: n.into(), price_cents: p } } }
        pub(crate) fn count_for_metrics() -> usize { 1 }
    }
    mod pricing { pub(super) fn discounted(c: u32) -> u32 { c } }
}
"#;

fn write(root: &Path, rel: &str, s: &str) {
    let f = root.join(rel);
    std::fs::create_dir_all(f.parent().expect("parent")).expect("mkdir");
    std::fs::write(f, s).expect("write");
}

/// 워크스페이스 두 멤버: core(라이브러리)와 app(바이너리). 공통 의존성과 린트를 루트에서 정한다.
fn workspace_demo(with_unsafe: bool) -> (bool, String, PathBuf) {
    let root = tmp(if with_unsafe { "ws_unsafe" } else { "ws" });
    write(
        &root,
        "Cargo.toml",
        r#"[workspace]
members = ["crates/*"]
resolver = "3"

[workspace.package]
edition = "2024"
version = "0.1.0"

[workspace.dependencies]
shop-core = { path = "crates/core" }

[workspace.lints.rust]
unsafe_code = "forbid"
"#,
    );
    write(
        &root,
        "crates/core/Cargo.toml",
        "[package]\nname = \"shop-core\"\nversion.workspace = true\nedition.workspace = true\n\n[lints]\nworkspace = true\n",
    );
    let body = if with_unsafe {
        "pub fn price() -> u32 { unsafe { std::hint::unreachable_unchecked() } }\n"
    } else {
        "pub fn price() -> u32 { 900 }\n"
    };
    write(&root, "crates/core/src/lib.rs", body);
    write(
        &root,
        "crates/app/Cargo.toml",
        "[package]\nname = \"shop-app\"\nversion.workspace = true\nedition.workspace = true\n\n[dependencies]\nshop-core.workspace = true\n\n[lints]\nworkspace = true\n",
    );
    write(
        &root,
        "crates/app/src/main.rs",
        "fn main() { println!(\"price={}\", shop_core::price()); }\n",
    );
    let out = Command::new("cargo")
        .args(["run", "--offline", "-q", "-p", "shop-app"])
        .current_dir(&root)
        .env_remove("CARGO_TARGET_DIR")
        .output()
        .expect("cargo");
    let text =
        String::from_utf8_lossy(&out.stdout).into_owned() + &String::from_utf8_lossy(&out.stderr);
    (out.status.success(), text, root)
}

fn main() {
    let mut ok = true;
    let mut check = |cond: bool, what: String| {
        println!("[{}] {what}", if cond { "ok" } else { "FAIL" });
        ok &= cond;
    };

    // 1. 같은 크레이트 안에서 쓰기
    let item = shop::Item::new("pen", 1000);
    check(
        item.price() == 900 && item.name == "pen",
        "re-export한 shop::Item, private pricing을 거친 가격 900".into(),
    );
    check(
        shop::catalog::count_for_metrics() == 1,
        "pub(crate) 함수는 크레이트 안에서 보인다".into(),
    );

    // 2. 컴파일러가 막는 것
    let d = tmp("err");
    let lib = ["--crate-type=lib"];
    let (_, e) = rustc(
        &d,
        "a.rs",
        &format!("{SHOP}pub fn f() -> u32 {{ shop::pricing::discounted(1) }}"),
        &lib,
    );
    check(
        e.contains("E0603") && e.contains("module `pricing` is private"),
        "private 모듈의 함수 -> E0603".into(),
    );
    let (_, e) = rustc(
        &d,
        "b.rs",
        &format!("{SHOP}pub fn f(i: &shop::Item) -> u32 {{ i.price_cents }}"),
        &lib,
    );
    check(e.contains("E0616"), "private 필드 읽기 -> E0616".into());
    let (_, e) = rustc(
        &d,
        "c.rs",
        &format!(
            "{SHOP}pub fn f() -> shop::Item {{ shop::Item {{ name: String::new(), price_cents: 1 }} }}"
        ),
        &lib,
    );
    check(
        e.contains("E0451"),
        "private 필드가 있는 구조체를 바깥에서 리터럴로 만들기 -> E0451".into(),
    );

    // 3. 크레이트 경계: 같은 코드를 라이브러리로 만들고 다른 크레이트에서 쓴다.
    let (built, e) = rustc(
        &d,
        "shoplib.rs",
        SHOP,
        &["--crate-type=rlib", "--crate-name=shoplib"],
    );
    check(built, format!("라이브러리 크레이트 빌드 {}", e.trim()));
    let ext = format!("shoplib={}", d.join("libshoplib.rmeta").display());
    let (good, e) = rustc(
        &d,
        "user1.rs",
        "pub fn f() -> String { shoplib::shop::Item::new(\"pen\", 1).name }",
        &["--crate-type=lib", "--extern", &ext],
    );
    check(
        good,
        format!("다른 크레이트에서 pub 경로 사용 OK {}", e.trim()),
    );
    let (_, e) = rustc(
        &d,
        "user2.rs",
        "pub fn f() -> usize { shoplib::shop::catalog::count_for_metrics() }",
        &["--crate-type=lib", "--extern", &ext],
    );
    check(
        e.contains("E0603") && e.contains("function `count_for_metrics` is private"),
        "다른 크레이트에서 pub(crate) -> E0603".into(),
    );

    // 4. 기능 플래그: cargo는 --features json을 --cfg feature="json"으로 넘긴다.
    let feat = r#"
pub fn formats() -> Vec<&'static str> {
    let mut v = vec!["text"];
    #[cfg(feature = "json")]
    v.push("json");
    #[cfg(feature = "yaml")]
    v.push("yaml");
    v
}
"#;
    let (a, _) = rustc(
        &d,
        "f1.rs",
        feat,
        &[
            "--crate-type=lib",
            "--cfg",
            "feature=\"json\"",
            "--cfg",
            "feature=\"yaml\"",
        ],
    );
    check(a, "더하기만 하는 기능 둘은 함께 켜도 컴파일된다".into());
    let exclusive = "#[cfg(all(feature = \"sqlite\", feature = \"postgres\"))]\ncompile_error!(\"feature \\\"sqlite\\\" and feature \\\"postgres\\\" cannot be enabled at the same time\");\n";
    let (b, e) = rustc(
        &d,
        "f2.rs",
        exclusive,
        &[
            "--crate-type=lib",
            "--cfg",
            "feature=\"sqlite\"",
            "--cfg",
            "feature=\"postgres\"",
        ],
    );
    check(
        !b && e.contains("cannot be enabled at the same time"),
        "서로 배타적인 기능 둘 -> compile_error!".into(),
    );

    // 5. 워크스페이스
    let (built, text, root) = workspace_demo(false);
    check(
        built && text.contains("price=900"),
        format!(
            "워크스페이스 빌드·실행: {}",
            text.lines().last().unwrap_or("")
        ),
    );
    check(
        root.join("Cargo.lock").exists(),
        "Cargo.lock은 루트에 하나".into(),
    );
    check(
        !root.join("crates/app/Cargo.lock").exists()
            && root.join("target").exists()
            && !root.join("crates/app/target").exists(),
        "target/도 루트에 하나".into(),
    );
    let (built, text, _) = workspace_demo(true);
    let line = text
        .lines()
        .find(|l| l.contains("error"))
        .unwrap_or("")
        .to_string();
    check(
        !built && text.contains("usage of an `unsafe` block") && text.contains("-F unsafe-code"),
        format!("[workspace.lints] unsafe_code = \"forbid\"가 멤버에 걸린다: {line}"),
    );

    assert!(ok);
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::shop;

    #[test]
    fn child_module_test_sees_parent_items() {
        assert_eq!(shop::Item::new("cup", 2000).price(), 1800);
    }
}
```
{% endraw %}
