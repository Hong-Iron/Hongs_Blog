---
layout: "note"
title: "36_futures-async-await_verify.rs"
display_title: "36_futures-async-await_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/futures-async-await/"
parent_title: "Future와 async·await"
description: "Rust · Future와 async·await 검증 코드"
sitemap: false
permalink: "/studies/rust/code/36_futures-async-await_verify/"
---
{% raw %}
[Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/) 문서의 검증 코드다.

```rust
//! 36 문서의 컴파일러 주장을 확인한다: 버린 퓨처 경고, async 밖 .await(E0728),
//! .await 너머 Rc가 퓨처를 Send가 아니게 만드는 것, !Unpin 퓨처를 Pin 밖으로 꺼내지 못하는 것,
//! 그리고 async 관련 clippy 린트가 기본으로 켜져 있는지.
//! 의존성: 없음 (표준 라이브러리만). rustc와 clippy-driver를 PATH에서 부른다.
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/36_futures-async-await_verify.rs"

use std::process::Command;

fn compile(tool: &str, extra: &[&str], code: &str, tag: &str) -> String {
    let dir = std::env::temp_dir().join(format!("vr36_{}_{}", std::process::id(), tag));
    std::fs::create_dir_all(&dir).unwrap();
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).unwrap();
    let out = Command::new(tool)
        .args(["--edition", "2024", "--crate-type=lib", "--emit=metadata"])
        .args(extra)
        .arg("--out-dir")
        .arg(&dir)
        .arg(&file)
        .output()
        .expect("컴파일러 실행");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn rustc(code: &str, tag: &str) -> String {
    compile("rustc", &[], code, tag)
}

const REQUIRE_SEND: &str = r#"
use std::rc::Rc;
async fn tick() {}
fn require_send<T: Send>(_: T) {}
"#;

fn main() {
    // 1. 퓨처를 만들고 버리면 경고: 퓨처는 await하거나 poll해야 돈다
    let e = rustc(
        "async fn work() -> u32 { 1 }\npub fn f() { work(); }\n",
        "unused",
    );
    println!(
        "--- 버린 퓨처 ---\n{}",
        e.lines().take(8).collect::<Vec<_>>().join("\n")
    );
    assert!(e.contains("unused implementer of `Future` that must be used"));
    assert!(e.contains("futures do nothing unless you `.await` or poll them"));

    // 2. async가 아닌 함수에서 .await → E0728
    let e = rustc(
        "async fn work() -> u32 { 1 }\npub fn f() -> u32 { work().await }\n",
        "e0728",
    );
    assert!(e.contains("error[E0728]"), "{e}");
    println!("--- async 밖 .await ---\n{}", e.lines().next().unwrap());

    // 3. Rc를 .await 너머로 들고 가면 퓨처가 Send가 아니다
    let bad = format!(
        "{REQUIRE_SEND}pub fn f() {{ require_send(async {{ let r = Rc::new(1); tick().await; println!(\"{{r}}\"); }}); }}\n"
    );
    let e = rustc(&bad, "rc_bad");
    println!(
        "--- Rc를 들고 .await ---\n{}",
        e.lines().take(3).collect::<Vec<_>>().join("\n")
    );
    assert!(
        e.contains("future cannot be sent between threads safely"),
        "{e}"
    );
    assert!(e.contains("is not `Send`"), "{e}");

    // 3-1. .await 전에 Rc의 범위를 끝내면 통과
    let ok = format!(
        "{REQUIRE_SEND}pub fn f() {{ require_send(async {{ {{ let r = Rc::new(1); println!(\"{{r}}\"); }} tick().await; }}); }}\n"
    );
    let e = rustc(&ok, "rc_ok");
    assert!(!e.contains("error"), "{e}");

    // 4. !Unpin인 async 퓨처는 Pin<&mut _>에서 &mut로 꺼낼 수 없다 (E0277, Unpin 없음)
    let e = rustc(
        "use std::pin::Pin;\nuse std::future::Future;\n\
         pub fn f<F: Future>(p: Pin<&mut F>) -> &mut F { Pin::get_mut(p) }\n",
        "unpin",
    );
    assert!(e.contains("error[E0277]") && e.contains("Unpin"), "{e}");
    println!("--- Pin::get_mut ---\n{}", e.lines().next().unwrap());

    // 5. clippy: 어떤 린트가 기본으로 켜져 있나
    let lint_src = r#"
use std::sync::Mutex;
async fn tick() {}
pub async fn holds(m: &Mutex<i32>) { let g = m.lock().unwrap(); tick().await; drop(g); }
pub fn ignore() { let _ = tick(); }
pub async fn no_await() -> i32 { 1 }
pub fn not_send() -> impl std::future::Future<Output = ()> {
    async { let r = std::rc::Rc::new(1); tick().await; drop(r); }
}
"#;
    let d = compile("clippy-driver", &[], lint_src, "clippy_default");
    let p = compile(
        "clippy-driver",
        &["-W", "clippy::pedantic"],
        lint_src,
        "clippy_ped",
    );
    let n = compile(
        "clippy-driver",
        &["-W", "clippy::nursery"],
        lint_src,
        "clippy_nur",
    );
    let on_by_default = |l: &str| d.contains(&format!("`#[warn(clippy::{l})]` on by default"));
    assert!(on_by_default("await_holding_lock"));
    assert!(on_by_default("let_underscore_future"));
    assert!(
        !d.contains("unused_async")
            && p.contains("clippy::unused-async` implied by `-W clippy::pedantic`")
    );
    assert!(
        !d.contains("future_not_send")
            && n.contains("clippy::future-not-send` implied by `-W clippy::nursery`")
    );
    println!(
        "--- clippy ---\n기본: await_holding_lock, let_underscore_future / pedantic: unused_async / nursery: future_not_send"
    );

    println!("ALL CHECKS PASSED");
}
```
{% endraw %}
