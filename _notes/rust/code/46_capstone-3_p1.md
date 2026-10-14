---
layout: "note"
title: "46_capstone-3_p1.rs"
display_title: "46_capstone-3_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "46"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/capstone-3/"
parent_title: "캡스톤 3 axum API"
description: "Rust · 캡스톤 3 axum API 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/46_capstone-3_p1/"
---
{% raw %}
[캡스톤 3 axum API](/Hongs_Blog/studies/rust/capstone-3/) 문서의 문제 1 풀이 코드다.

```rust
//! 캡스톤 3단계: 2단계 저장소 위에 axum HTTP API를 얹는다.
//! POST /links → 201 {"code","url"}, GET /{code} → 307 Location, GET /health → 200.
//! 핸들러·추출기의 에러는 {"error":{"kind","message"}} JSON으로 답한다(라우터가 직접 내는 405만 빈 본문).
//! 1·2단계의 자체 테스트는 각 단계 파일에 있다.
//! 의존성: thiserror = "2", tokio = { version = "1", features = ["full"] }, axum = "0.8",
//!         serde = { version = "1", features = ["derive"] }, serde_json = "1", tower = { version = "0.5", features = ["util"] },
//!         sqlx = { version = "0.9", default-features = false, features = ["runtime-tokio", "sqlite"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/46_capstone-3_p1.rs"
//! 진짜 서버로: SERVE=1 cargo run --bin <이름>  → 127.0.0.1:3000, sqlite://links.db, Ctrl+C로 끝낸다.

use std::fmt;
use std::hash::{BuildHasher, RandomState};
use std::net::SocketAddr;
use std::str::FromStr;
use std::sync::{Arc, Mutex, PoisonError};

use axum::extract::rejection::JsonRejection;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Redirect, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;

// ===== 1. 도메인 상수 =====

/// 짧은 코드의 글자 수. 62^7 = 3,521,614,606,208가지.
pub const CODE_LEN: usize = 7;
/// 받아 주는 URL의 최대 길이(바이트).
pub const MAX_URL_LEN: usize = 2048;
const ALPHABET: &[u8; 62] = b"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// ===== 2. 도메인 에러 =====

/// 입력이 도메인 규칙을 어겼을 때의 에러. 메시지는 API 응답에 그대로 실어도 안전하다.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum DomainError {
    #[error("url is empty")]
    EmptyUrl,
    #[error("url is {len} bytes, longer than the {max}-byte limit")]
    UrlTooLong { len: usize, max: usize },
    #[error("url contains a character outside visible ASCII at byte {index}")]
    InvalidCharacter { index: usize },
    #[error("url must start with http:// or https://")]
    UnsupportedScheme,
    #[error("url has no host")]
    MissingHost,
    #[error("url must not contain user info (user@host)")]
    UserInfo,
    #[error("code must be exactly {} characters from [0-9A-Za-z]", CODE_LEN)]
    InvalidCode,
}

// ===== 3. Url 뉴타입: 만들어졌으면 검증을 통과한 것 =====

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Url(String);

fn strip_prefix_ignore_case<'a>(s: &'a str, prefix: &str) -> Option<&'a str> {
    let head = s.get(..prefix.len())?;
    head.eq_ignore_ascii_case(prefix)
        .then(|| &s[prefix.len()..])
}

impl Url {
    /// 앞뒤 공백을 걷어 낸 뒤 검사한다. 검사 순서: 비었나 → 길이 → 글자 → 스킴 → 호스트.
    pub fn parse(input: &str) -> Result<Self, DomainError> {
        let s = input.trim();
        if s.is_empty() {
            return Err(DomainError::EmptyUrl);
        }
        if s.len() > MAX_URL_LEN {
            return Err(DomainError::UrlTooLong {
                len: s.len(),
                max: MAX_URL_LEN,
            });
        }
        // Location 헤더에 넣을 수 있는 글자(보이는 ASCII 0x21..=0x7E)만 받는다.
        if let Some(index) = s.bytes().position(|b| !(0x21..=0x7e).contains(&b)) {
            return Err(DomainError::InvalidCharacter { index });
        }
        let rest = strip_prefix_ignore_case(s, "https://")
            .or_else(|| strip_prefix_ignore_case(s, "http://"))
            .ok_or(DomainError::UnsupportedScheme)?;
        let authority = rest.split(['/', '?', '#']).next().unwrap_or("");
        if authority.contains('@') {
            return Err(DomainError::UserInfo);
        }
        if authority.is_empty() || authority.starts_with(':') {
            return Err(DomainError::MissingHost);
        }
        Ok(Self(s.to_owned()))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl FromStr for Url {
    type Err = DomainError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::parse(s)
    }
}

impl fmt::Display for Url {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

// ===== 4. Code 뉴타입: 정확히 7글자 base62 =====

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Code(String);

impl Code {
    pub fn parse(s: &str) -> Result<Self, DomainError> {
        if s.len() == CODE_LEN && s.bytes().all(|b| b.is_ascii_alphanumeric()) {
            Ok(Self(s.to_owned()))
        } else {
            Err(DomainError::InvalidCode)
        }
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl FromStr for Code {
    type Err = DomainError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::parse(s)
    }
}

impl fmt::Display for Code {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

// ===== 5. 코드 생성기: SplitMix64 + 거절 샘플링 =====

/// 씨앗이 같으면 같은 코드 순서를 낸다(테스트 재현용). 암호학적으로 안전한 난수는 아니다.
pub struct CodeGen {
    state: u64,
}

impl CodeGen {
    pub fn from_seed(seed: u64) -> Self {
        Self { state: seed }
    }

    /// 프로세스마다 다른 씨앗. std의 RandomState 키와 현재 시각을 섞는다.
    pub fn from_entropy() -> Self {
        Self::from_seed(RandomState::new().hash_one(std::time::SystemTime::now()))
    }

    fn next_u64(&mut self) -> u64 {
        self.state = self.state.wrapping_add(0x9E37_79B9_7F4A_7C15);
        let mut z = self.state;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
        z ^ (z >> 31)
    }

    pub fn next_code(&mut self) -> Code {
        let mut out = String::with_capacity(CODE_LEN);
        while out.len() < CODE_LEN {
            for b in self.next_u64().to_le_bytes() {
                // 248 = 62 × 4. 248 이상을 버려야 62글자가 모두 같은 확률로 나온다.
                if b < 248 && out.len() < CODE_LEN {
                    out.push(char::from(ALPHABET[usize::from(b % 62)]));
                }
            }
        }
        Code(out)
    }
}

// ===== 6. 저장소 에러와 LinkStore 트레이트 (2단계) =====

#[derive(Debug, thiserror::Error)]
pub enum StoreError {
    #[error("code already exists")]
    Duplicate,
    #[error("stored row is invalid")]
    Corrupt(#[from] DomainError),
    #[error("database error")]
    Backend(#[source] sqlx::Error),
}

/// 저장소가 해 줄 일. 반환 퓨처에 `Send`를 요구해야 axum 핸들러(3단계)에서 쓸 수 있다.
pub trait LinkStore: Send + Sync + 'static {
    fn insert(&self, code: &Code, url: &Url)
    -> impl Future<Output = Result<(), StoreError>> + Send;
    fn resolve(&self, code: &Code) -> impl Future<Output = Result<Option<Url>, StoreError>> + Send;
    fn count(&self) -> impl Future<Output = Result<u64, StoreError>> + Send;
}

// ===== 7. SqliteStore =====

const SCHEMA: &str = "CREATE TABLE IF NOT EXISTS links (
    code       TEXT PRIMARY KEY NOT NULL CHECK (length(code) = 7),
    url        TEXT NOT NULL CHECK (length(url) <= 2048),
    hits       INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
) STRICT";

pub struct SqliteStore {
    pool: SqlitePool,
}

impl SqliteStore {
    /// 연결하고 스키마를 만든다. 메모리 DB는 연결이 모두 닫히면 사라지므로 연결 하나를 계속 쥔다.
    pub async fn connect(db_url: &str) -> Result<Self, sqlx::Error> {
        let opts = SqliteConnectOptions::from_str(db_url)?.create_if_missing(true);
        let pool = if db_url.contains(":memory:") {
            SqlitePoolOptions::new()
                .max_connections(1)
                .idle_timeout(None)
                .max_lifetime(None)
        } else {
            SqlitePoolOptions::new().max_connections(8)
        }
        .connect_with(opts)
        .await?;
        sqlx::query(SCHEMA).execute(&pool).await?;
        Ok(Self { pool })
    }

    pub async fn close(&self) {
        self.pool.close().await;
    }
}

fn map_insert_error(e: sqlx::Error) -> StoreError {
    match e {
        sqlx::Error::Database(db) if db.is_unique_violation() => StoreError::Duplicate,
        other => StoreError::Backend(other),
    }
}

impl LinkStore for SqliteStore {
    async fn insert(&self, code: &Code, url: &Url) -> Result<(), StoreError> {
        sqlx::query("INSERT INTO links (code, url) VALUES ($1, $2)")
            .bind(code.as_str())
            .bind(url.as_str())
            .execute(&self.pool)
            .await
            .map_err(map_insert_error)?;
        Ok(())
    }

    async fn resolve(&self, code: &Code) -> Result<Option<Url>, StoreError> {
        // 찾기와 조회수 올리기를 한 문장으로 한다(왕복 1번, 경쟁 없음).
        let raw: Option<String> =
            sqlx::query_scalar("UPDATE links SET hits = hits + 1 WHERE code = $1 RETURNING url")
                .bind(code.as_str())
                .fetch_optional(&self.pool)
                .await
                .map_err(StoreError::Backend)?;
        // DB에서 읽은 값도 다시 검증한다. 누가 SQL로 직접 넣은 값일 수 있다.
        Ok(raw.map(|s| Url::parse(&s)).transpose()?)
    }

    async fn count(&self) -> Result<u64, StoreError> {
        let n: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM links")
            .fetch_one(&self.pool)
            .await
            .map_err(StoreError::Backend)?;
        Ok(u64::try_from(n).unwrap_or(0))
    }
}

// ===== 8. 서비스 함수: 재시도와 에러 바꾸기 =====

pub const MAX_ATTEMPTS: u32 = 5;

#[derive(Debug, thiserror::Error)]
pub enum LinkError {
    #[error(transparent)]
    Invalid(#[from] DomainError),
    #[error("link not found")]
    NotFound,
    #[error("no free code after {0} attempts")]
    CodeSpaceExhausted(u32),
    #[error("storage failure")]
    Storage(#[source] StoreError),
}

pub async fn shorten<S: LinkStore>(
    store: &S,
    codes: &Mutex<CodeGen>,
    raw_url: &str,
) -> Result<(Code, Url), LinkError> {
    let url = Url::parse(raw_url)?;
    for _ in 0..MAX_ATTEMPTS {
        // 잠금은 이 문장 끝에서 풀린다. std MutexGuard를 .await 너머로 들고 가면 퓨처가 Send가 아니다.
        let code = codes
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .next_code();
        match store.insert(&code, &url).await {
            Ok(()) => return Ok((code, url)),
            Err(StoreError::Duplicate) => continue,
            Err(e) => return Err(LinkError::Storage(e)),
        }
    }
    Err(LinkError::CodeSpaceExhausted(MAX_ATTEMPTS))
}

/// 형식이 틀린 코드는 DB에 묻지 않고 "없음"으로 답한다.
pub async fn resolve<S: LinkStore>(store: &S, raw_code: &str) -> Result<Url, LinkError> {
    let Ok(code) = Code::parse(raw_code) else {
        return Err(LinkError::NotFound);
    };
    store
        .resolve(&code)
        .await
        .map_err(LinkError::Storage)?
        .ok_or(LinkError::NotFound)
}

// ===== 9. HTTP 계층: 상태, 요청·응답 모양 (3단계) =====

/// 핸들러가 공유하는 것. 복제는 Arc 두 개를 복제할 뿐이라 싸다.
pub struct AppState<S> {
    store: Arc<S>,
    codes: Arc<Mutex<CodeGen>>,
}

// #[derive(Clone)]은 S: Clone을 요구하므로 손으로 쓴다.
impl<S> Clone for AppState<S> {
    fn clone(&self) -> Self {
        Self {
            store: Arc::clone(&self.store),
            codes: Arc::clone(&self.codes),
        }
    }
}

impl<S> AppState<S> {
    pub fn new(store: S, codes: CodeGen) -> Self {
        Self {
            store: Arc::new(store),
            codes: Arc::new(Mutex::new(codes)),
        }
    }
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct CreateLink {
    url: String,
}

#[derive(Serialize)]
struct LinkBody {
    code: String,
    url: String,
}

// ===== 10. 에러 → HTTP 응답 =====

pub enum ApiError {
    BadJson(JsonRejection),
    Link(LinkError),
}

impl From<JsonRejection> for ApiError {
    fn from(r: JsonRejection) -> Self {
        Self::BadJson(r)
    }
}

impl From<LinkError> for ApiError {
    fn from(e: LinkError) -> Self {
        Self::Link(e)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, kind, message) = match &self {
            Self::BadJson(r) => (r.status(), "bad_request", r.body_text()),
            Self::Link(LinkError::Invalid(e)) => (
                StatusCode::UNPROCESSABLE_ENTITY,
                "invalid_url",
                e.to_string(),
            ),
            Self::Link(LinkError::NotFound) => {
                (StatusCode::NOT_FOUND, "not_found", "no such link".into())
            }
            Self::Link(LinkError::CodeSpaceExhausted(_)) => (
                StatusCode::SERVICE_UNAVAILABLE,
                "unavailable",
                "try again later".into(),
            ),
            // 내부 원인(DB 메시지)은 응답에 싣지 않는다. 4단계에서 로그로 남긴다.
            Self::Link(LinkError::Storage(_)) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "internal",
                "internal error".into(),
            ),
        };
        let body = serde_json::json!({ "error": { "kind": kind, "message": message } });
        (status, Json(body)).into_response()
    }
}

// ===== 11. 핸들러와 라우터 =====

async fn create_link<S: LinkStore>(
    State(st): State<AppState<S>>,
    body: Result<Json<CreateLink>, JsonRejection>,
) -> Result<(StatusCode, Json<LinkBody>), ApiError> {
    let Json(req) = body?;
    let (code, url) = shorten(&*st.store, &st.codes, &req.url).await?;
    let body = LinkBody {
        code: code.to_string(),
        url: url.to_string(),
    };
    Ok((StatusCode::CREATED, Json(body)))
}

async fn follow<S: LinkStore>(
    State(st): State<AppState<S>>,
    Path(code): Path<String>,
) -> Result<Redirect, ApiError> {
    let url = resolve(&*st.store, &code).await?;
    // 307: 임시 이동. 브라우저가 영구 저장하지 않으므로 링크를 지우거나 세면 바로 반영된다.
    Ok(Redirect::temporary(url.as_str()))
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok" }))
}

async fn not_found() -> ApiError {
    ApiError::Link(LinkError::NotFound)
}

pub fn router<S: LinkStore>(state: AppState<S>) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/links", post(create_link::<S>))
        .route("/{code}", get(follow::<S>))
        .fallback(not_found)
        .with_state(state)
}

// ===== 12. 진짜 소켓으로 보내는 작은 HTTP 클라이언트 (자체 테스트용) =====

pub struct Reply {
    status: u16,
    head: String,
    body: String,
}

pub async fn http(addr: SocketAddr, method: &str, path: &str, body: &str) -> Reply {
    let mut s = tokio::net::TcpStream::connect(addr).await.expect("connect");
    let req = format!(
        "{method} {path} HTTP/1.1\r\nHost: {addr}\r\nConnection: close\r\n\
         Content-Type: application/json\r\nContent-Length: {}\r\n\r\n{body}",
        body.len()
    );
    s.write_all(req.as_bytes()).await.expect("write");
    let mut raw = String::new();
    s.read_to_string(&mut raw).await.expect("read");
    let (head, body) = raw.split_once("\r\n\r\n").expect("head/body");
    let status = head.split(' ').nth(1).and_then(|c| c.parse().ok());
    Reply {
        status: status.expect("status"),
        head: head.to_ascii_lowercase(),
        body: body.to_owned(),
    }
}

// ===== 13. main: 자체 테스트(기본) 또는 서버(SERVE=1) =====

async fn self_check() {
    let store = SqliteStore::connect("sqlite::memory:").await.expect("db");
    let app = router(AppState::new(store, CodeGen::from_seed(3)));
    let listener = TcpListener::bind("127.0.0.1:0").await.expect("bind");
    let addr = listener.local_addr().expect("addr");
    let (tx, rx) = tokio::sync::oneshot::channel::<()>();
    let server = tokio::spawn(async move {
        axum::serve(listener, app)
            .with_graceful_shutdown(async {
                rx.await.ok();
            })
            .await
    });

    let r = http(addr, "POST", "/links", r#"{"url":"https://example.com/x"}"#).await;
    assert_eq!(r.status, 201, "{}", r.body);
    let v: serde_json::Value = serde_json::from_str(&r.body).expect("json");
    let code = v["code"].as_str().expect("code").to_owned();
    println!("POST /links → 201 {}", r.body);

    let r = http(addr, "GET", &format!("/{code}"), "").await;
    assert_eq!(r.status, 307);
    assert!(r.head.contains("location: https://example.com/x"));
    let r = http(addr, "GET", "/health", "").await;
    assert_eq!((r.status, r.body.as_str()), (200, r#"{"status":"ok"}"#));
    let r = http(addr, "GET", "/nope123", "").await;
    assert_eq!(r.status, 404);
    assert!(r.body.contains(r#""kind":"not_found""#));
    let r = http(addr, "POST", "/links", r#"{"url":"javascript:alert(1)"}"#).await;
    assert_eq!(r.status, 422);
    println!("잘못된 URL → 422 {}", r.body);

    tx.send(()).expect("server alive");
    server.await.expect("join").expect("serve");
}

async fn serve_forever() {
    let store = SqliteStore::connect("sqlite://links.db").await.expect("db");
    let app = router(AppState::new(store, CodeGen::from_entropy()));
    let listener = TcpListener::bind("127.0.0.1:3000").await.expect("bind");
    axum::serve(listener, app)
        .with_graceful_shutdown(async {
            tokio::signal::ctrl_c().await.ok();
        })
        .await
        .expect("serve");
}

#[tokio::main]
async fn main() {
    if std::env::var_os("SERVE").is_some() {
        serve_forever().await;
        return;
    }
    self_check().await;
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;

    async fn app() -> Router {
        let store = SqliteStore::connect("sqlite::memory:").await.unwrap();
        router(AppState::new(store, CodeGen::from_seed(5)))
    }

    async fn send(app: Router, method: &str, uri: &str, ctype: &str, body: &str) -> Response {
        let req = Request::builder()
            .method(method)
            .uri(uri)
            .header("content-type", ctype)
            .body(Body::from(body.to_owned()))
            .unwrap();
        app.oneshot(req).await.unwrap()
    }

    async fn json_of(resp: Response) -> serde_json::Value {
        let bytes = axum::body::to_bytes(resp.into_body(), 64 * 1024)
            .await
            .unwrap();
        serde_json::from_slice(&bytes).unwrap()
    }

    #[tokio::test]
    async fn self_check_passes() {
        self_check().await;
    }

    #[tokio::test]
    async fn create_then_follow() {
        let app = app().await;
        let resp = send(
            app.clone(),
            "POST",
            "/links",
            "application/json",
            r#"{"url":"http://a.b/c"}"#,
        )
        .await;
        assert_eq!(resp.status(), StatusCode::CREATED);
        let code = json_of(resp).await["code"].as_str().unwrap().to_owned();
        let resp = send(app, "GET", &format!("/{code}"), "", "").await;
        assert_eq!(resp.status(), StatusCode::TEMPORARY_REDIRECT);
        assert_eq!(resp.headers()["location"], "http://a.b/c");
    }

    #[tokio::test]
    async fn bad_requests_get_json_errors() {
        let cases = [
            ("text/plain", r#"{"url":"http://a.b"}"#, 415),
            ("application/json", r#"{"url":"#, 400),
            ("application/json", r#"{"link":"http://a.b"}"#, 422),
            ("application/json", r#"{"url":"http://a.b","x":1}"#, 422),
            ("application/json", r#"{"url":"http://user@a.b"}"#, 422),
        ];
        for (ctype, body, want) in cases {
            let resp = send(app().await, "POST", "/links", ctype, body).await;
            assert_eq!(resp.status().as_u16(), want, "{body}");
            assert!(json_of(resp).await["error"]["kind"].is_string());
        }
    }

    #[tokio::test]
    async fn wrong_method_is_405() {
        let resp = send(app().await, "GET", "/links", "", "").await;
        assert_eq!(resp.status(), StatusCode::METHOD_NOT_ALLOWED);
    }
}
```
{% endraw %}
