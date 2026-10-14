---
layout: "note"
title: "45_service-basics-practice_p4.rs"
display_title: "45_service-basics-practice_p4.rs"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "45"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/service-basics-practice/"
parent_title: "서비스 기초 연습"
description: "Rust · 서비스 기초 연습 문제 4 풀이 코드"
permalink: "/studies/rust/code/45_service-basics-practice_p4/"
---
{% raw %}
[서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/) 문서의 문제 4 풀이 코드다.

```rust
//! 서비스 기초 연습 p4: 메모 API. PUT·GET·DELETE /notes/{key}, 키 검사(400), 없는 키(404),
//! x-api-key 헤더 검사(401), 에러 타입 하나로 JSON 응답. oneshot으로 시험한다.
//! 의존성: axum = "0.8", tokio = { version = "1", features = ["full"] }, tower = { version = "0.5", features = ["util"] },
//!         serde = { version = "1", features = ["derive"] }, serde_json = "1"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/45_service-basics-practice_p4.rs"

use std::collections::HashMap;
use std::sync::Arc;

use axum::body::{Body, to_bytes};
use axum::extract::{Path, State};
use axum::http::{HeaderMap, Request, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::put;
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;
use tower::ServiceExt;

struct AppState {
    api_key: String,
    notes: RwLock<HashMap<String, String>>,
}

#[derive(Deserialize, Serialize)]
struct Note {
    text: String,
}

enum ApiError {
    Unauthorized,
    BadKey(String),
    NotFound(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, msg) = match self {
            ApiError::Unauthorized => (
                StatusCode::UNAUTHORIZED,
                "missing or wrong x-api-key".to_string(),
            ),
            ApiError::BadKey(k) => (
                StatusCode::BAD_REQUEST,
                format!("bad key {k:?}: use 1-32 letters or digits"),
            ),
            ApiError::NotFound(k) => (StatusCode::NOT_FOUND, format!("note {k:?} not found")),
        };
        (status, Json(serde_json::json!({ "error": msg }))).into_response()
    }
}

// 하위목표 1: 공통 검사 두 가지를 함수로 뺀다.
fn authorize(state: &AppState, headers: &HeaderMap) -> Result<(), ApiError> {
    match headers.get("x-api-key") {
        Some(v) if v.as_bytes() == state.api_key.as_bytes() => Ok(()),
        _ => Err(ApiError::Unauthorized),
    }
}

fn valid_key(key: &str) -> Result<(), ApiError> {
    let ok = (1..=32).contains(&key.len()) && key.chars().all(|c| c.is_ascii_alphanumeric());
    if ok {
        Ok(())
    } else {
        Err(ApiError::BadKey(key.to_string()))
    }
}

// 하위목표 2: 핸들러. State·HeaderMap·Path를 먼저, 본문 Json은 마지막에.
async fn put_note(
    State(s): State<Arc<AppState>>,
    headers: HeaderMap,
    Path(key): Path<String>,
    Json(note): Json<Note>,
) -> Result<StatusCode, ApiError> {
    authorize(&s, &headers)?;
    valid_key(&key)?;
    let created = s.notes.write().await.insert(key, note.text).is_none();
    Ok(if created {
        StatusCode::CREATED
    } else {
        StatusCode::OK
    })
}

async fn get_note(
    State(s): State<Arc<AppState>>,
    Path(key): Path<String>,
) -> Result<Json<Note>, ApiError> {
    valid_key(&key)?;
    let notes = s.notes.read().await;
    let text = notes.get(&key).cloned().ok_or(ApiError::NotFound(key))?;
    Ok(Json(Note { text }))
}

async fn delete_note(
    State(s): State<Arc<AppState>>,
    headers: HeaderMap,
    Path(key): Path<String>,
) -> Result<StatusCode, ApiError> {
    authorize(&s, &headers)?;
    valid_key(&key)?;
    match s.notes.write().await.remove(&key) {
        Some(_) => Ok(StatusCode::NO_CONTENT),
        None => Err(ApiError::NotFound(key)),
    }
}

// 하위목표 3: 라우터 조립
fn app(api_key: &str) -> Router {
    let state = Arc::new(AppState {
        api_key: api_key.to_string(),
        notes: RwLock::default(),
    });
    Router::new()
        .route(
            "/notes/{key}",
            put(put_note).get(get_note).delete(delete_note),
        )
        .with_state(state)
}

async fn send(
    app: &Router,
    method: &str,
    uri: &str,
    key: Option<&str>,
    body: Option<&str>,
) -> (u16, String) {
    let mut b = Request::builder().method(method).uri(uri);
    if let Some(k) = key {
        b = b.header("x-api-key", k);
    }
    let req = match body {
        Some(s) => b
            .header("content-type", "application/json")
            .body(Body::from(s.to_string())),
        None => b.body(Body::empty()),
    }
    .expect("request");
    let res = app.clone().oneshot(req).await.expect("infallible");
    let status = res.status().as_u16();
    let bytes = to_bytes(res.into_body(), 1 << 16).await.expect("body");
    (status, String::from_utf8_lossy(&bytes).into_owned())
}

async fn scenario() -> Vec<(u16, String)> {
    let app = app("k-123");
    let note = Some(r#"{"text":"buy milk"}"#);
    vec![
        send(&app, "PUT", "/notes/todo", None, note).await,
        send(&app, "PUT", "/notes/todo", Some("k-123"), note).await,
        send(&app, "PUT", "/notes/todo", Some("k-123"), note).await,
        send(&app, "GET", "/notes/todo", None, None).await,
        send(&app, "GET", "/notes/bad-key", None, None).await,
        send(&app, "DELETE", "/notes/todo", Some("k-123"), None).await,
        send(&app, "GET", "/notes/todo", None, None).await,
    ]
}

#[tokio::main]
async fn main() {
    let got = scenario().await;
    for g in &got {
        println!("{g:?}");
    }
    let codes: Vec<u16> = got.iter().map(|g| g.0).collect();
    assert_eq!(codes, [401, 201, 200, 200, 400, 204, 404]);
    assert_eq!(got[3].1, r#"{"text":"buy milk"}"#);
    assert_eq!(got[6].1, r#"{"error":"note \"todo\" not found"}"#);
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn wrong_key_is_unauthorized_even_for_delete() {
        let app = app("k-123");
        assert_eq!(
            send(&app, "DELETE", "/notes/x", Some("nope"), None).await.0,
            401
        );
    }

    #[tokio::test]
    async fn key_longer_than_32_is_rejected() {
        let app = app("k");
        let long = format!("/notes/{}", "a".repeat(33));
        assert_eq!(send(&app, "GET", &long, None, None).await.0, 400);
    }
}
```
{% endraw %}
