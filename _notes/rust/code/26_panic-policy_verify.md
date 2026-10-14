---
layout: "note"
title: "26_panic-policy_verify.rs"
display_title: "26_panic-policy_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/panic-policy/"
parent_title: "panic을 쓸 때"
description: "Rust · panic을 쓸 때 검증 코드"
sitemap: false
permalink: "/studies/rust/code/26_panic-policy_verify/"
---
{% raw %}
[panic을 쓸 때](/Hongs_Blog/studies/rust/panic-policy/) 문서의 검증 코드다.

```rust
//! panic을 쓸 때의 규칙을 확인한다: catch_unwind는 풀기(unwind) panic만 잡는다,
//! panic = "abort"이면 잡지 못하고 Drop도 돌지 않는다, 스레드 panic은 join()의 Err로 온다,
//! tokio 태스크 panic은 JoinError(is_panic)로 온다, clippy::unwrap_used·expect_used 린트 이름.
//! 의존성: tokio = { version = "1", features = ["full"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/26_panic-policy_verify.rs"

// 정책 예: 제품 코드에서는 unwrap 금지(테스트는 허용). expect는 이유를 적고 쓴다.
#![cfg_attr(not(test), deny(clippy::unwrap_used))]

use std::any::Any;
use std::panic;
use std::process::Command;

fn payload_text(p: &(dyn Any + Send)) -> String {
    if let Some(s) = p.downcast_ref::<&str>() {
        format!("&str: {s}")
    } else if let Some(s) = p.downcast_ref::<String>() {
        format!("String: {s}")
    } else {
        "unknown".to_string()
    }
}

fn tmpdir(tag: &str) -> std::path::PathBuf {
    let dir = std::env::temp_dir().join(format!("vr26_{}_{}", std::process::id(), tag));
    std::fs::create_dir_all(&dir).expect("임시 폴더를 만들 수 있어야 한다");
    dir
}

/// 같은 프로그램을 panic 전략만 바꿔 컴파일하고 실행한다.
fn run_with_strategy(strategy: &str) -> std::process::Output {
    let dir = tmpdir(strategy);
    let src = dir.join("main.rs");
    let exe = dir.join("prog");
    std::fs::write(
        &src,
        r#"
struct Guard;
impl Drop for Guard {
    fn drop(&mut self) { println!("drop guard"); }
}
fn main() {
    let r = std::panic::catch_unwind(|| {
        let _g = Guard;
        panic!("inside");
    });
    println!("caught = {}", r.is_err());
}
"#,
    )
    .expect("소스를 쓸 수 있어야 한다");
    let build = Command::new("rustc")
        .args(["--edition", "2024", "-C"])
        .arg(format!("panic={strategy}"))
        .arg("-o")
        .arg(&exe)
        .arg(&src)
        .output()
        .expect("rustc가 PATH에 있어야 한다");
    assert!(
        build.status.success(),
        "{}",
        String::from_utf8_lossy(&build.stderr)
    );
    Command::new(&exe)
        .output()
        .expect("만든 프로그램을 실행할 수 있어야 한다")
}

fn clippy_on(code: &str, lints: &[&str]) -> String {
    let dir = tmpdir("clippy");
    let file = dir.join("snippet.rs");
    std::fs::write(&file, code).expect("소스를 쓸 수 있어야 한다");
    let mut cmd = Command::new("clippy-driver");
    cmd.args([
        "--edition",
        "2024",
        "--crate-type=lib",
        "--emit=metadata",
        "--out-dir",
    ])
    .arg(&dir);
    for l in lints {
        cmd.args(["-W", l]);
    }
    let out = cmd
        .arg(&file)
        .output()
        .expect("clippy-driver가 PATH에 있어야 한다");
    String::from_utf8_lossy(&out.stderr).into_owned()
}

fn main() {
    // panic 메시지가 stderr를 어지럽히지 않게 훅을 비운다(잡히는 것은 그대로다).
    panic::set_hook(Box::new(|_| {}));

    // 1. catch_unwind: 풀기 panic을 잡고 payload를 돌려준다
    let r = panic::catch_unwind(|| panic!("literal message"));
    let p = r.expect_err("panic이 났으니 Err여야 한다");
    assert_eq!(payload_text(p.as_ref()), "&str: literal message");
    let n = 7;
    let r = panic::catch_unwind(|| panic!("formatted {n}"));
    let p = r.expect_err("panic이 났으니 Err여야 한다");
    assert_eq!(payload_text(p.as_ref()), "String: formatted 7");
    println!("1. catch_unwind: &str 또는 String payload");

    // 2. 스레드 panic은 join()이 Err로 돌려준다. 다른 스레드는 계속 돈다.
    let worker_id = std::hint::black_box(3);
    let bad = std::thread::spawn(move || -> u32 { panic!("worker {worker_id} failed") });
    let good = std::thread::spawn(|| 40 + 2);
    let bad_res = bad.join();
    let good_res = good.join();
    let p = bad_res.expect_err("panic한 스레드의 join은 Err");
    assert_eq!(payload_text(p.as_ref()), "String: worker 3 failed");
    assert_eq!(good_res.ok(), Some(42));
    println!("2. thread join: Err(payload), 옆 스레드는 Ok(42)");

    // 3. tokio 태스크 panic은 JoinError로 온다. 런타임과 다른 태스크는 멀쩡하다.
    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(2)
        .build()
        .expect("런타임을 만들 수 있어야 한다");
    let (is_panic, other) = rt.block_on(async {
        let t = tokio::spawn(async { panic!("task blew up") });
        let ok = tokio::spawn(async { 5 });
        let e = t.await.expect_err("panic한 태스크는 JoinError");
        let msg = payload_text(e.into_panic().as_ref());
        assert_eq!(msg, "&str: task blew up");
        (true, ok.await.ok())
    });
    assert!(is_panic);
    assert_eq!(other, Some(5));
    // 취소한 태스크는 is_cancelled
    let cancelled = rt.block_on(async {
        let t = tokio::spawn(async {
            tokio::time::sleep(std::time::Duration::from_secs(60)).await;
        });
        t.abort();
        let e = t.await.expect_err("abort한 태스크는 JoinError");
        (e.is_cancelled(), e.is_panic())
    });
    assert_eq!(cancelled, (true, false));
    println!("3. tokio: JoinError::is_panic / is_cancelled");

    // 4. panic 전략: unwind면 Drop이 돌고 잡힌다. abort면 그 자리에서 프로세스가 죽는다.
    let unwind = run_with_strategy("unwind");
    let out = String::from_utf8_lossy(&unwind.stdout);
    println!("4. unwind: 종료 {:?}, 출력 {:?}", unwind.status.code(), out);
    assert_eq!(unwind.status.code(), Some(0));
    assert_eq!(out, "drop guard\ncaught = true\n");
    let abort = run_with_strategy("abort");
    let out = String::from_utf8_lossy(&abort.stdout);
    #[cfg(unix)]
    {
        use std::os::unix::process::ExitStatusExt;
        println!(
            "   abort: 종료 코드 {:?}, 신호 {:?}, 출력 {:?}",
            abort.status.code(),
            abort.status.signal(),
            out
        );
        assert_eq!(abort.status.signal(), Some(6)); // SIGABRT
    }
    assert!(!abort.status.success());
    assert_eq!(out, ""); // Drop도, "caught" 줄도 없다

    // 5. clippy 린트 이름 확인
    let msg = clippy_on(
        "pub fn a(x: Option<i32>) -> i32 { x.unwrap() }\n\
         pub fn b(x: Result<i32, String>) -> i32 { x.expect(\"checked above\") }\n",
        &["clippy::unwrap_used", "clippy::expect_used"],
    );
    assert!(msg.contains("#unwrap_used"), "{msg}");
    assert!(msg.contains("#expect_used"), "{msg}");
    assert!(
        msg.contains("used `unwrap()` on an `Option` value"),
        "{msg}"
    );
    assert!(msg.contains("used `expect()` on a `Result` value"), "{msg}");
    println!("5. clippy::unwrap_used, clippy::expect_used 확인");

    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    #[test]
    #[should_panic(expected = "index out of bounds")]
    fn indexing_past_end_panics() {
        let v: Vec<i32> = (1..=3).collect();
        let i = v.len();
        let _ = v[i];
    }

    #[test]
    fn get_returns_none_instead() {
        let v = [1, 2, 3];
        assert_eq!(v.get(3), None);
        // 테스트에서는 unwrap이 허용된다(cfg_attr(not(test), ...)).
        assert_eq!(*v.first().unwrap(), 1);
    }
}
```
{% endraw %}
