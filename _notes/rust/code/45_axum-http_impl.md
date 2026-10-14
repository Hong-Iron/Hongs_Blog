---
layout: "note"
title: "45_axum-http_impl.rs"
display_title: "45_axum-http_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "45"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/axum-http/"
parent_title: "axum으로 HTTP 서비스 만들기"
description: "Rust · axum으로 HTTP 서비스 만들기 구현 코드"
sitemap: false
permalink: "/studies/rust/code/45_axum-http_impl/"
---
{% raw %}
[axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/) 문서의 구현 코드다.

```rust
//! axum 0.8 서비스 하나: 라우터, 추출기(Path·Query·Json·State), Arc 공유 상태,
//! IntoResponse 에러 타입(내부 에러는 로그로만), TraceLayer·TimeoutLayer, TraceLayer가 남기는 로그,
//! oneshot 테스트, 진짜 소켓 요청과 안전한 종료.
//! 의존성: axum = "0.8", tokio = { version = "1", features = ["full"] }, tower = { version = "0.5", features = ["util"] },
//!         tower-http = { version = "0.7", features = ["trace", "timeout"] }, serde = { version = "1", features = ["derive"] },
//!         serde_json = "1", thiserror = "2", anyhow = "1", tracing = "0.1",
//!         tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/45_axum-http_impl.rs"
//! 진짜 서버로 띄우려면 main의 주소를 "0.0.0.0:3000"으로 바꾸고, 종료 신호를 tokio::signal::ctrl_c()로 바꾼다.

use std::collections::HashMap;
use std::sync::Arc;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::Duration;

use anyhow::Context;
use axum::body::{Body, to_bytes};
use axum::extract::{Path, Query, State};
use axum::http::{Request, StatusCode, header};
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::sync::RwLock;
use tower::ServiceExt;
use tower_http::timeout::TimeoutLayer;
use tower_http::trace::TraceLayer;

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq)]
struct Item {
    id: u64,
    name: String,
}

#[derive(Deserialize)]
struct NewItem {
    name: String,
}

#[derive(Deserialize)]
struct ListParams {
    limit: Option<usize>,
}

/// 모든 요청이 함께 보는 상태. Router가 요청마다 clone하므로 Arc 하나만 복사된다.
#[derive(Default)]
struct AppState {
    items: RwLock<HashMap<u64, Item>>,
    next_id: AtomicU64,
}

type Shared = Arc<AppState>;

#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error("item {0} not found")]
    NotFound(u64),
    #[error("name must not be empty")]
    EmptyName,
    /// 사용자 잘못이 아닌 실패. 자세한 원인은 로그에만 남기고 응답에는 싣지 않는다.
    #[error(transparent)]
    Internal(#[from] anyhow::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, msg) = match &self {
            AppError::NotFound(_) => (StatusCode::NOT_FOUND, self.to_string()),
            AppError::EmptyName => (StatusCode::UNPROCESSABLE_ENTITY, self.to_string()),
            AppError::Internal(e) => {
                tracing::error!(error = format!("{e:#}"), "internal error");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "internal error".to_string(),
                )
            }
        };
        (status, Json(serde_json::json!({ "error": msg }))).into_response()
    }
}

async fn health() -> &'static str {
    "ok"
}

async fn create_item(
    State(state): State<Shared>,
    Json(input): Json<NewItem>, // 본문을 읽는 추출기는 마지막 인자
) -> Result<(StatusCode, Json<Item>), AppError> {
    if input.name.trim().is_empty() {
        return Err(AppError::EmptyName);
    }
    let id = state.next_id.fetch_add(1, Ordering::Relaxed) + 1;
    let item = Item {
        id,
        name: input.name,
    };
    state.items.write().await.insert(id, item.clone());
    Ok((StatusCode::CREATED, Json(item)))
}

async fn get_item(
    State(state): State<Shared>,
    Path(id): Path<u64>,
) -> Result<Json<Item>, AppError> {
    let items = state.items.read().await;
    items
        .get(&id)
        .cloned()
        .map(Json)
        .ok_or(AppError::NotFound(id))
}

async fn list_items(
    State(state): State<Shared>,
    Query(params): Query<ListParams>,
) -> Json<Vec<Item>> {
    let items = state.items.read().await;
    let mut all: Vec<Item> = items.values().cloned().collect();
    all.sort_by_key(|i| i.id);
    all.truncate(params.limit.unwrap_or(usize::MAX));
    Json(all)
}

/// 항목을 파일로 내보낸다. 일부러 없는 폴더에 써서 내부 에러를 낸다.
async fn export_item(State(state): State<Shared>, Path(id): Path<u64>) -> Result<String, AppError> {
    let name = {
        let items = state.items.read().await;
        items.get(&id).ok_or(AppError::NotFound(id))?.name.clone()
    };
    let path = format!("/no-such-dir-vault/{id}.txt");
    tokio::fs::write(&path, name)
        .await
        .with_context(|| format!("writing {path}"))?; // anyhow::Error -> AppError::Internal
    Ok(path)
}

async fn slow() -> &'static str {
    tokio::time::sleep(Duration::from_secs(5)).await;
    "too late"
}

fn app(state: Shared) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/items", get(list_items).post(create_item))
        .route("/items/{id}", get(get_item))
        .route("/items/{id}/export", get(export_item))
        .route("/slow", get(slow))
        .layer(TimeoutLayer::with_status_code(
            StatusCode::REQUEST_TIMEOUT,
            Duration::from_millis(100),
        ))
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}

async fn call(app: &Router, req: Request<Body>) -> (StatusCode, String) {
    let res = app.clone().oneshot(req).await.expect("Router never fails");
    let status = res.status();
    let bytes = to_bytes(res.into_body(), 1 << 20).await.expect("body");
    (status, String::from_utf8(bytes.to_vec()).expect("utf8"))
}

fn get_req(uri: &str) -> Request<Body> {
    Request::get(uri).body(Body::empty()).expect("request")
}

fn post_json(uri: &str, body: &str) -> Request<Body> {
    Request::post(uri)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(body.to_owned()))
        .expect("request")
}

/// oneshot으로 라우터를 시험하고 (조건, 설명) 목록을 돌려준다.
async fn router_checks() -> Vec<(bool, String)> {
    let app = app(Shared::default());
    let mut out = Vec::new();

    let r = call(&app, get_req("/health")).await;
    out.push((
        r == (StatusCode::OK, "ok".into()),
        format!("GET /health -> {r:?}"),
    ));

    let r = call(&app, post_json("/items", r#"{"name":"pen"}"#)).await;
    out.push((
        r == (StatusCode::CREATED, r#"{"id":1,"name":"pen"}"#.into()),
        format!("POST /items -> {r:?}"),
    ));
    call(&app, post_json("/items", r#"{"name":"cup"}"#)).await;

    let r = call(&app, get_req("/items/2")).await;
    out.push((
        r == (StatusCode::OK, r#"{"id":2,"name":"cup"}"#.into()),
        format!("GET /items/2 -> {r:?}"),
    ));

    let r = call(&app, get_req("/items/9")).await;
    out.push((
        r == (
            StatusCode::NOT_FOUND,
            r#"{"error":"item 9 not found"}"#.into(),
        ),
        format!("GET /items/9 -> {r:?}"),
    ));

    let r = call(&app, get_req("/items?limit=1")).await;
    out.push((
        r == (StatusCode::OK, r#"[{"id":1,"name":"pen"}]"#.into()),
        format!("GET /items?limit=1 -> {r:?}"),
    ));

    let r = call(&app, post_json("/items", r#"{"name":"  "}"#)).await;
    out.push((
        r.0 == StatusCode::UNPROCESSABLE_ENTITY,
        format!("빈 이름 -> {r:?}"),
    ));

    // 추출기 거부: 핸들러는 불리지 않고 axum이 바로 응답한다.
    let r = call(&app, get_req("/items/abc")).await;
    out.push((
        r.0 == StatusCode::BAD_REQUEST,
        format!("Path 파싱 실패 -> {}", r.0),
    ));
    let r = call(&app, post_json("/items", r#"{"name":"#)).await;
    out.push((
        r.0 == StatusCode::BAD_REQUEST,
        format!("JSON 문법 오류 -> {}", r.0),
    ));
    let r = call(&app, post_json("/items", r#"{"title":"x"}"#)).await;
    out.push((
        r.0 == StatusCode::UNPROCESSABLE_ENTITY,
        format!("필드 누락 -> {}", r.0),
    ));
    let no_ct = Request::post("/items")
        .body(Body::from(r#"{"name":"x"}"#))
        .expect("request");
    let r = call(&app, no_ct).await;
    out.push((
        r.0 == StatusCode::UNSUPPORTED_MEDIA_TYPE,
        format!("Content-Type 없음 -> {}", r.0),
    ));
    let r = call(
        &app,
        Request::delete("/items/1")
            .body(Body::empty())
            .expect("request"),
    )
    .await;
    out.push((
        r.0 == StatusCode::METHOD_NOT_ALLOWED,
        format!("DELETE /items/1 -> {}", r.0),
    ));
    let r = call(&app, get_req("/nope")).await;
    out.push((
        r.0 == StatusCode::NOT_FOUND,
        format!("없는 경로 -> {}", r.0),
    ));

    let r = call(&app, get_req("/items/1/export")).await;
    out.push((
        r == (
            StatusCode::INTERNAL_SERVER_ERROR,
            r#"{"error":"internal error"}"#.into(),
        ),
        format!("내부 에러 -> {r:?} (경로·OS 오류는 응답에 없다)"),
    ));

    let r = call(&app, get_req("/slow")).await;
    out.push((
        r.0 == StatusCode::REQUEST_TIMEOUT,
        format!("GET /slow (100ms 제한) -> {}", r.0),
    ));
    out
}

/// 로그를 메모리에 모으는 writer.
#[derive(Clone, Default)]
struct LogBuf(Arc<std::sync::Mutex<Vec<u8>>>);

impl std::io::Write for LogBuf {
    fn write(&mut self, b: &[u8]) -> std::io::Result<usize> {
        self.0.lock().expect("lock").extend_from_slice(b);
        Ok(b.len())
    }
    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

/// TraceLayer와 내부 에러가 남기는 로그를 JSON으로 붙잡아 본다.
/// oneshot은 지금 태스크 안에서 돌므로, 이 스레드의 기본 구독자(set_default)가 그대로 받는다.
async fn logging_checks() -> Vec<(bool, String)> {
    let buf = LogBuf::default();
    let w = buf.clone();
    let sub = tracing_subscriber::fmt()
        .json()
        .with_writer(move || w.clone())
        .with_env_filter(tracing_subscriber::EnvFilter::new("debug"))
        .finish();
    let guard = tracing::subscriber::set_default(sub);
    let app = app(Shared::default());
    call(&app, post_json("/items", r#"{"name":"pen"}"#)).await;
    call(&app, get_req("/items/1/export")).await;
    drop(guard);

    let text = String::from_utf8(buf.0.lock().expect("lock").clone()).expect("utf8");
    let lines: Vec<serde_json::Value> = text
        .lines()
        .map(|l| serde_json::from_str(l).expect("JSON 한 줄"))
        .collect();
    let export: Vec<&serde_json::Value> = lines
        .iter()
        .filter(|l| l["span"]["uri"] == "/items/1/export")
        .collect();
    for l in &export {
        println!(
            "    {} {} | {} | span={}",
            l["level"].as_str().unwrap_or(""),
            l["target"].as_str().unwrap_or(""),
            l["fields"],
            l["span"]
        );
    }
    let msgs: Vec<&str> = export
        .iter()
        .map(|l| l["fields"]["message"].as_str().unwrap_or(""))
        .collect();
    let internal = export
        .iter()
        .find(|l| l["fields"]["message"] == "internal error");
    vec![
        (
            lines.iter().all(|l| l["span"]["name"] == "request"),
            "모든 줄이 TraceLayer의 request span 안에서 찍혔다".into(),
        ),
        (
            msgs.first() == Some(&"started processing request")
                && msgs.contains(&"finished processing request"),
            format!("내보내기 요청의 이벤트 순서: {msgs:?}"),
        ),
        (
            internal.is_some_and(|l| {
                l["level"] == "ERROR"
                    && l["fields"]["error"]
                        .as_str()
                        .is_some_and(|e| e.starts_with("writing /no-such-dir-vault/1.txt: "))
            }),
            "내부 에러의 원인 사슬은 ERROR 로그에만 남는다".into(),
        ),
    ]
}

/// 0.7 문법 `/:id`는 0.8에서 라우트를 등록할 때 panic한다.
fn old_syntax_panics() -> (bool, String) {
    let prev = std::panic::take_hook();
    std::panic::set_hook(Box::new(|_| {}));
    let res = std::panic::catch_unwind(|| {
        let _r: Router = Router::new().route("/items/:id", get(health));
    });
    std::panic::set_hook(prev);
    match res {
        Err(e) => {
            let msg = e
                .downcast_ref::<String>()
                .cloned()
                .or_else(|| e.downcast_ref::<&str>().map(|s| s.to_string()))
                .unwrap_or_default();
            (true, msg)
        }
        Ok(()) => (false, "panic 없음".into()),
    }
}

/// 127.0.0.1:0에 띄우고, TcpStream으로 HTTP 요청을 직접 보낸 뒤, 종료 신호를 보내 끝낸다.
async fn real_socket_check() -> (bool, String) {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0")
        .await
        .expect("bind");
    let addr = listener.local_addr().expect("addr");
    let (tx, rx) = tokio::sync::oneshot::channel::<()>();
    let server = tokio::spawn(async move {
        axum::serve(listener, app(Shared::default()))
            .with_graceful_shutdown(async {
                let _ = rx.await;
            })
            .await
    });

    let mut stream = tokio::net::TcpStream::connect(addr).await.expect("connect");
    stream
        .write_all(b"GET /health HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n")
        .await
        .expect("write");
    let mut raw = String::new();
    stream.read_to_string(&mut raw).await.expect("read");

    tx.send(()).expect("shutdown signal");
    let joined = tokio::time::timeout(Duration::from_secs(5), server).await;
    let stopped = matches!(joined, Ok(Ok(Ok(()))));
    let first_line = raw.lines().next().unwrap_or("").to_string();
    let ok = first_line == "HTTP/1.1 200 OK" && raw.ends_with("ok") && stopped;
    (
        ok,
        format!(
            "{first_line} / 본문 끝 {:?} / 서버 종료 {stopped}",
            raw.rsplit("\r\n").next()
        ),
    )
}

#[tokio::main]
async fn main() {
    let mut all_ok = true;
    for (ok, msg) in router_checks().await {
        println!("[{}] {msg}", if ok { "ok" } else { "FAIL" });
        all_ok &= ok;
    }
    for (ok, msg) in logging_checks().await {
        println!("[{}] {msg}", if ok { "ok" } else { "FAIL" });
        all_ok &= ok;
    }
    let (ok, msg) = old_syntax_panics();
    println!(
        "[{}] `/items/:id` 등록 -> panic: {msg}",
        if ok { "ok" } else { "FAIL" }
    );
    all_ok &= ok && msg.contains("{capture}");
    let (ok, msg) = real_socket_check().await;
    println!("[{}] 진짜 소켓: {msg}", if ok { "ok" } else { "FAIL" });
    all_ok &= ok;
    assert!(all_ok);
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn create_then_get() {
        let app = app(Shared::default());
        let (s, _) = call(&app, post_json("/items", r#"{"name":"pen"}"#)).await;
        assert_eq!(s, StatusCode::CREATED);
        let (s, body) = call(&app, get_req("/items/1")).await;
        assert_eq!(s, StatusCode::OK);
        let item: Item = serde_json::from_str(&body).unwrap();
        assert_eq!(item.name, "pen");
    }

    #[tokio::test]
    async fn all_router_checks_pass() {
        for (ok, msg) in router_checks().await {
            assert!(ok, "{msg}");
        }
    }
}
```
{% endraw %}
