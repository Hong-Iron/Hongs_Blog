---
layout: "note"
title: "50_release-readiness-practice_p3.rs"
display_title: "50_release-readiness-practice_p3.rs"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "50"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/release-readiness-practice/"
parent_title: "배포 준비 연습"
description: "Rust · 배포 준비 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/50_release-readiness-practice_p3/"
---
{% raw %}
[배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/) 문서의 문제 3 풀이 코드다.

```rust
//! 50 배포 준비 연습 p3: /healthz(살아 있나), /readyz(요청을 받아도 되나), /version(무엇이 돌고 있나)과
//! 컨테이너 HEALTHCHECK가 부르는 `healthcheck` 하위 명령. oneshot과 127.0.0.1:0의 진짜 소켓으로 시험한다.
//! 의존성: axum = "0.8", tokio = { version = "1", features = ["full"] }, tower = { version = "0.5", features = ["util"] },
//!         serde = { version = "1", features = ["derive"] }, serde_json = "1"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/50_release-readiness-practice_p3.rs"
//! 진짜 서버로 띄우려면 주소를 "0.0.0.0:8080"으로 바꾸고, 종료 신호를 SIGTERM으로 받는다(40번 안전한 종료).

use std::io::{Read, Write};
use std::net::{SocketAddr, TcpStream};
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;

use axum::body::{Body, to_bytes};
use axum::extract::State;
use axum::http::{Request, StatusCode};
use axum::routing::get;
use axum::{Json, Router};
use serde::Serialize;
use tower::ServiceExt;

/// 빌드할 때 GIT_HASH를 주면 그 값, 아니면 "unknown".
const GIT_HASH: &str = match option_env!("GIT_HASH") {
    Some(h) => h,
    None => "unknown",
};

/// 준비 상태 깃발. 시작 준비가 끝나면 켜고, 종료를 시작하면 끈다.
#[derive(Clone, Default)]
struct Health {
    ready: Arc<AtomicBool>,
}

/// 살아 있나: 프로세스가 요청에 답할 수 있으면 200. 바깥(DB 등)은 보지 않는다.
async fn healthz() -> &'static str {
    "ok"
}

/// 요청을 받아도 되나: 깃발이 켜져 있을 때만 200, 아니면 503.
async fn readyz(State(h): State<Health>) -> (StatusCode, &'static str) {
    if h.ready.load(Ordering::Acquire) {
        (StatusCode::OK, "ready")
    } else {
        (StatusCode::SERVICE_UNAVAILABLE, "not ready")
    }
}

#[derive(Serialize)]
struct VersionInfo {
    name: &'static str,
    version: &'static str,
    git: &'static str,
}

async fn version() -> Json<VersionInfo> {
    Json(VersionInfo {
        name: env!("CARGO_PKG_NAME"),
        version: env!("CARGO_PKG_VERSION"),
        git: GIT_HASH,
    })
}

fn app(h: Health) -> Router {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/readyz", get(readyz))
        .route("/version", get(version))
        .with_state(h)
}

#[derive(Debug, PartialEq, Eq)]
enum Mode {
    Serve,
    HealthCheck,
}

/// 진짜 main의 첫머리: `shortener healthcheck`이면 검사만 하고 그 종료 코드로 끝난다.
fn mode(args: &[&str]) -> Mode {
    match args.get(1) {
        Some(&"healthcheck") => Mode::HealthCheck,
        _ => Mode::Serve,
    }
}

/// 같은 컨테이너 안의 서버에 GET을 보내 상태 줄의 숫자를 돌려준다. curl이 없는 이미지에서도 돈다.
fn status_of(addr: SocketAddr, path: &str, timeout: Duration) -> std::io::Result<u16> {
    let mut s = TcpStream::connect_timeout(&addr, timeout)?;
    s.set_read_timeout(Some(timeout))?;
    s.set_write_timeout(Some(timeout))?;
    write!(
        s,
        "GET {path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n"
    )?;
    let mut buf = String::new();
    s.read_to_string(&mut buf)?;
    buf.split(' ')
        .nth(1)
        .and_then(|code| code.parse().ok())
        .ok_or_else(|| std::io::Error::other("상태 줄을 읽지 못했다"))
}

/// HEALTHCHECK 종료 코드: 0 건강, 1 아픔. 2는 Docker가 예약해 두었으므로 쓰지 않는다.
fn healthcheck(addr: SocketAddr, timeout: Duration) -> u8 {
    match status_of(addr, "/healthz", timeout) {
        Ok(200) => 0,
        _ => 1,
    }
}

async fn oneshot(router: &Router, path: &str) -> (StatusCode, String) {
    let req = Request::builder().uri(path).body(Body::empty()).unwrap();
    let res = router.clone().oneshot(req).await.expect("infallible");
    let status = res.status();
    let bytes = to_bytes(res.into_body(), 1 << 16).await.unwrap();
    (status, String::from_utf8(bytes.to_vec()).unwrap())
}

async fn blocking_status(addr: SocketAddr, path: &'static str) -> std::io::Result<u16> {
    tokio::task::spawn_blocking(move || status_of(addr, path, Duration::from_secs(2)))
        .await
        .unwrap()
}

#[tokio::main]
async fn main() {
    assert_eq!(mode(&["shortener"]), Mode::Serve);
    assert_eq!(mode(&["shortener", "healthcheck"]), Mode::HealthCheck);

    // 1. oneshot: 시작 직후에는 살아 있지만 준비되지 않았다.
    let h = Health::default();
    let router = app(h.clone());
    assert_eq!(
        oneshot(&router, "/healthz").await,
        (StatusCode::OK, "ok".into())
    );
    assert_eq!(
        oneshot(&router, "/readyz").await,
        (StatusCode::SERVICE_UNAVAILABLE, "not ready".into())
    );
    h.ready.store(true, Ordering::Release);
    assert_eq!(
        oneshot(&router, "/readyz").await,
        (StatusCode::OK, "ready".into())
    );
    let (status, body) = oneshot(&router, "/version").await;
    assert_eq!(status, StatusCode::OK);
    let v: serde_json::Value = serde_json::from_str(&body).unwrap();
    assert_eq!(v["name"], env!("CARGO_PKG_NAME"));
    assert_eq!(v["version"], env!("CARGO_PKG_VERSION"));
    assert_eq!(v["git"], GIT_HASH);
    println!("/version: {body}");

    // 2. 진짜 소켓: 서버를 띄우고 healthcheck 하위 명령이 쓰는 함수로 묻는다.
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    let (stop_tx, stop_rx) = tokio::sync::oneshot::channel::<()>();
    let server = tokio::spawn(async move {
        axum::serve(listener, router)
            .with_graceful_shutdown(async {
                stop_rx.await.ok();
            })
            .await
            .unwrap();
    });
    let code = tokio::task::spawn_blocking(move || healthcheck(addr, Duration::from_secs(2)))
        .await
        .unwrap();
    assert_eq!(code, 0);
    assert_eq!(blocking_status(addr, "/readyz").await.unwrap(), 200);

    // 3. 종료를 시작한다: 준비 깃발만 끈다. 살아 있음은 그대로라 재시작되지 않고, 새 요청만 빠진다.
    h.ready.store(false, Ordering::Release);
    assert_eq!(blocking_status(addr, "/readyz").await.unwrap(), 503);
    assert_eq!(blocking_status(addr, "/healthz").await.unwrap(), 200);
    println!("종료 중: /readyz 503, /healthz 200");

    stop_tx.send(()).unwrap();
    server.await.unwrap();
    // 4. 서버가 꺼진 뒤에는 연결이 안 되므로 1.
    let code = tokio::task::spawn_blocking(move || healthcheck(addr, Duration::from_millis(500)))
        .await
        .unwrap();
    assert_eq!(code, 1);
    println!("healthcheck: 서버가 돌 때 0, 꺼진 뒤 1");
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn unknown_path_is_404() {
        let router = app(Health::default());
        assert_eq!(oneshot(&router, "/nope").await.0, StatusCode::NOT_FOUND);
    }

    #[test]
    fn other_args_serve() {
        assert_eq!(mode(&["shortener", "--port", "1"]), Mode::Serve);
        assert_eq!(mode(&[]), Mode::Serve);
    }
}
```
{% endraw %}
