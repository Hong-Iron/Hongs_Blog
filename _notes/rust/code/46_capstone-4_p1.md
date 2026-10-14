---
layout: "note"
title: "46_capstone-4_p1.rs"
display_title: "46_capstone-4_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "46"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/capstone-4/"
parent_title: "캡스톤 4 관측성과 설정"
description: "Rust · 캡스톤 4 관측성과 설정 문제 1 풀이 코드"
permalink: "/studies/rust/code/46_capstone-4_p1/"
---
{% raw %}
[캡스톤 4 관측성과 설정](/Hongs_Blog/studies/rust/capstone-4/) 문서의 문제 1 풀이 코드다.

```rust
//! 캡스톤 4단계: 3단계 API에 관측성과 설정을 더한다.
//! 환경 변수에서 타입 있는 Config를 읽어 검증하고, 비밀값은 Secret으로 감싸 로그에서 가린다.
//! tracing: 저장소·서비스 함수에 #[instrument], 요청마다 tower-http TraceLayer 스팬, JSON 로그 선택.
//! 의존성: thiserror = "2", tokio = { version = "1", features = ["full"] }, axum = "0.8",
//!         serde = { version = "1", features = ["derive"] }, serde_json = "1", tower = { version = "0.5", features = ["util"] },
//!         sqlx = { version = "0.9", default-features = false, features = ["runtime-tokio", "sqlite"] },
//!         tracing = "0.1", tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] },
//!         tower-http = { version = "0.7", features = ["trace"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/46_capstone-4_p1.rs"
//! 진짜 서버로: SERVE=1 BIND_ADDR=127.0.0.1:3000 DATABASE_URL=sqlite://links.db LOG_FORMAT=json RUST_LOG=info cargo run --bin <이름>

use std::fmt;
use std::hash::{BuildHasher, RandomState};
use std::net::SocketAddr;
use std::str::FromStr;
use std::sync::{Arc, Mutex, OnceLock, PoisonError};

use axum::extract::rejection::JsonRejection;
use axum::extract::{DefaultBodyLimit, Path, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Redirect, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tower_http::trace::{DefaultMakeSpan, DefaultOnResponse, TraceLayer};
use tracing::{Level, instrument};
use tracing_subscriber::EnvFilter;

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
    // url은 기록하지 않는다. 사용자 URL의 쿼리에 토큰이 들어 있을 수 있다.
    #[instrument(skip(self, url), fields(code = %code), err(level = Level::WARN))]
    async fn insert(&self, code: &Code, url: &Url) -> Result<(), StoreError> {
        sqlx::query("INSERT INTO links (code, url) VALUES ($1, $2)")
            .bind(code.as_str())
            .bind(url.as_str())
            .execute(&self.pool)
            .await
            .map_err(map_insert_error)?;
        Ok(())
    }

    #[instrument(skip(self), fields(code = %code))]
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

    #[instrument(skip(self))]
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

#[instrument(skip_all)]
pub async fn shorten<S: LinkStore>(
    store: &S,
    codes: &Mutex<CodeGen>,
    raw_url: &str,
) -> Result<(Code, Url), LinkError> {
    let url = Url::parse(raw_url)?;
    for attempt in 1..=MAX_ATTEMPTS {
        // 잠금은 이 문장 끝에서 풀린다. std MutexGuard를 .await 너머로 들고 가면 퓨처가 Send가 아니다.
        let code = codes
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .next_code();
        match store.insert(&code, &url).await {
            Ok(()) => {
                tracing::info!(code = %code, attempt, "link created");
                return Ok((code, url));
            }
            Err(StoreError::Duplicate) => {
                tracing::warn!(attempt, "code collision, retrying");
            }
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
            // 내부 원인은 응답에 싣지 않고 로그에 원인 체인까지 남긴다.
            Self::Link(LinkError::Storage(e)) => {
                tracing::error!(error = %e, cause = ?std::error::Error::source(e), "storage failure");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "internal",
                    "internal error".into(),
                )
            }
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

pub fn router<S: LinkStore>(state: AppState<S>, cfg: &Config) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/links", post(create_link::<S>))
        .route("/{code}", get(follow::<S>))
        .fallback(not_found)
        .with_state(state)
        // Json 추출기가 읽을 본문 상한(axum 기본 2MB를 설정값으로 바꾼다).
        .layer(DefaultBodyLimit::max(cfg.max_body_bytes))
        // 요청마다 스팬 하나: method, uri, version이 붙고 응답 때 상태와 지연이 찍힌다.
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::new().level(Level::INFO))
                .on_response(DefaultOnResponse::new().level(Level::INFO)),
        )
}

// ===== 12. 설정과 비밀값 (4단계) =====

/// 로그·Debug 출력에 값이 새지 않게 감싼다. 값을 꺼내려면 expose()를 불러야 한다(검색하기 쉽다).
#[derive(Clone)]
pub struct Secret<T>(T);

impl<T> Secret<T> {
    pub fn new(value: T) -> Self {
        Self(value)
    }
    pub fn expose(&self) -> &T {
        &self.0
    }
}

impl<T> fmt::Debug for Secret<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("[REDACTED]")
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LogFormat {
    Pretty,
    Json,
}

#[derive(Debug, Clone)]
pub struct Config {
    pub bind: SocketAddr,
    pub database_url: Secret<String>,
    pub max_body_bytes: usize,
    pub log_format: LogFormat,
}

/// 메시지에 입력값을 싣지 않는다. 비밀값이 섞인 변수일 수 있기 때문이다.
#[derive(Debug, thiserror::Error, PartialEq, Eq)]
#[error("invalid {key}: {reason}")]
pub struct ConfigError {
    key: &'static str,
    reason: &'static str,
}

impl Config {
    /// 환경 변수 대신 함수를 받는다. 테스트가 전역 환경을 건드리지 않아도 된다.
    pub fn from_lookup(get: impl Fn(&str) -> Option<String>) -> Result<Self, ConfigError> {
        let bad = |key, reason| ConfigError { key, reason };
        let bind = match get("BIND_ADDR") {
            None => SocketAddr::from(([127, 0, 0, 1], 3000)),
            Some(v) => v
                .parse()
                .map_err(|_| bad("BIND_ADDR", "expected ip:port"))?,
        };
        let database_url = get("DATABASE_URL").unwrap_or_else(|| "sqlite://links.db".into());
        if !database_url.starts_with("sqlite:") {
            return Err(bad("DATABASE_URL", "only sqlite: urls are supported"));
        }
        let max_body_bytes = match get("MAX_BODY_BYTES") {
            None => 16 * 1024,
            Some(v) => v
                .parse()
                .ok()
                .filter(|n| (64..=1024 * 1024).contains(n))
                .ok_or(bad("MAX_BODY_BYTES", "expected an integer in 64..=1048576"))?,
        };
        let log_format = match get("LOG_FORMAT").as_deref() {
            None | Some("pretty") => LogFormat::Pretty,
            Some("json") => LogFormat::Json,
            Some(_) => return Err(bad("LOG_FORMAT", "expected pretty or json")),
        };
        Ok(Self {
            bind,
            database_url: Secret::new(database_url),
            max_body_bytes,
            log_format,
        })
    }

    pub fn from_env() -> Result<Self, ConfigError> {
        Self::from_lookup(|k| std::env::var(k).ok())
    }
}

// ===== 13. 로그 초기화 =====

/// RUST_LOG가 있으면 그것을, 없으면 info를 쓴다. 이미 설치돼 있으면 조용히 넘어간다.
pub fn init_tracing(format: LogFormat) {
    let filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
    let builder = tracing_subscriber::fmt().with_env_filter(filter);
    let _ = match format {
        LogFormat::Json => builder.json().try_init(),
        LogFormat::Pretty => builder.try_init(),
    };
}

/// 자체 테스트용: JSON 로그를 메모리에 모은다. 전역 구독자는 프로세스에 하나라서 OnceLock으로 한 번만 설치한다.
#[derive(Clone)]
struct Capture(Arc<Mutex<Vec<u8>>>);

impl std::io::Write for Capture {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        self.0
            .lock()
            .unwrap_or_else(PoisonError::into_inner)
            .extend_from_slice(buf);
        Ok(buf.len())
    }
    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

fn captured_logs() -> String {
    static CAPTURE: OnceLock<Capture> = OnceLock::new();
    let cap = CAPTURE.get_or_init(|| {
        let cap = Capture(Arc::default());
        let writer = cap.clone();
        let _ = tracing_subscriber::fmt()
            .json()
            .with_env_filter(EnvFilter::new("info"))
            .with_writer(move || writer.clone())
            .try_init();
        cap
    });
    let bytes = cap.0.lock().unwrap_or_else(PoisonError::into_inner);
    String::from_utf8_lossy(&bytes).into_owned()
}

// ===== 14. 진짜 소켓으로 보내는 작은 HTTP 클라이언트 (자체 테스트용) =====

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

// ===== 15. main: 자체 테스트(기본) 또는 서버(SERVE=1) =====

fn test_config() -> Config {
    Config::from_lookup(|k| match k {
        "BIND_ADDR" => Some("127.0.0.1:0".into()),
        "DATABASE_URL" => Some("sqlite::memory:".into()),
        "MAX_BODY_BYTES" => Some("256".into()),
        _ => None,
    })
    .expect("test config")
}

async fn self_check() {
    captured_logs(); // 구독자 설치
    let cfg = test_config();
    tracing::info!(config = ?cfg, "starting");
    let store = SqliteStore::connect(cfg.database_url.expose())
        .await
        .expect("db");
    let app = router(AppState::new(store, CodeGen::from_seed(3)), &cfg);
    let listener = TcpListener::bind(cfg.bind).await.expect("bind");
    let addr = listener.local_addr().expect("addr");
    let (tx, rx) = tokio::sync::oneshot::channel::<()>();
    let server = tokio::spawn(async move {
        axum::serve(listener, app)
            .with_graceful_shutdown(async {
                rx.await.ok();
            })
            .await
    });

    let r = http(
        addr,
        "POST",
        "/links",
        r#"{"url":"https://example.com/x?token=abc"}"#,
    )
    .await;
    assert_eq!(r.status, 201, "{}", r.body);
    let v: serde_json::Value = serde_json::from_str(&r.body).expect("json");
    let code = v["code"].as_str().expect("code").to_owned();
    let r = http(addr, "GET", &format!("/{code}"), "").await;
    assert_eq!(r.status, 307);
    assert!(r.head.contains("location: https://example.com/x?token=abc"));
    let big = format!(r#"{{"url":"https://a.b/{}"}}"#, "x".repeat(300));
    let r = http(addr, "POST", "/links", &big).await;
    assert_eq!(r.status, 413, "{}", r.body);
    println!("256바이트 넘는 본문 → {} {}", r.status, r.body);

    tx.send(()).expect("server alive");
    server.await.expect("join").expect("serve");

    let logs = captured_logs();
    let line = logs
        .lines()
        .find(|l| l.contains("finished processing request") && l.contains("/links"))
        .expect("request log line");
    println!("로그 한 줄: {line}");
    assert!(line.contains(r#""method":"POST""#));
    assert!(logs.contains("[REDACTED]"));
    assert!(!logs.contains("sqlite::memory:"), "비밀값이 로그에 샜다");
    assert!(!logs.contains("token=abc"), "사용자 URL이 로그에 샜다");
    assert!(logs.contains(&format!(r#""code":"{code}""#)));
}

async fn serve_forever() {
    let cfg = Config::from_env().unwrap_or_else(|e| {
        eprintln!("config error: {e}");
        std::process::exit(2);
    });
    init_tracing(cfg.log_format);
    tracing::info!(config = ?cfg, "starting");
    let store = SqliteStore::connect(cfg.database_url.expose())
        .await
        .expect("db");
    let app = router(AppState::new(store, CodeGen::from_entropy()), &cfg);
    let listener = TcpListener::bind(cfg.bind).await.expect("bind");
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
        router(AppState::new(store, CodeGen::from_seed(5)), &test_config())
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
        let bytes = axum::body::to_bytes(resp.into_body(), 1024).await.unwrap();
        let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
        let resp = send(
            app,
            "GET",
            &format!("/{}", v["code"].as_str().unwrap()),
            "",
            "",
        )
        .await;
        assert_eq!(resp.status(), StatusCode::TEMPORARY_REDIRECT);
    }

    #[test]
    fn config_defaults_and_errors() {
        let cfg = Config::from_lookup(|_| None).unwrap();
        assert_eq!(cfg.bind.port(), 3000);
        assert_eq!(cfg.max_body_bytes, 16 * 1024);
        assert_eq!(cfg.log_format, LogFormat::Pretty);
        let with = |key: &'static str, val: &'static str| {
            Config::from_lookup(move |k| (k == key).then(|| val.to_string()))
        };
        assert_eq!(with("BIND_ADDR", "localhost").unwrap_err().key, "BIND_ADDR");
        assert_eq!(
            with("MAX_BODY_BYTES", "10").unwrap_err().key,
            "MAX_BODY_BYTES"
        );
        assert_eq!(
            with("MAX_BODY_BYTES", "-1").unwrap_err().key,
            "MAX_BODY_BYTES"
        );
        assert_eq!(with("LOG_FORMAT", "xml").unwrap_err().key, "LOG_FORMAT");
        let e = with("DATABASE_URL", "postgres://admin:hunter2@db/links").unwrap_err();
        assert!(!e.to_string().contains("hunter2"));
        assert_eq!(
            with("LOG_FORMAT", "json").unwrap().log_format,
            LogFormat::Json
        );
    }

    #[test]
    fn secret_is_redacted_in_debug() {
        let cfg =
            Config::from_lookup(|k| (k == "DATABASE_URL").then(|| "sqlite://pw-123.db".into()))
                .unwrap();
        let shown = format!("{cfg:?}");
        assert!(shown.contains("[REDACTED]") && !shown.contains("pw-123"));
        assert_eq!(cfg.database_url.expose(), "sqlite://pw-123.db");
    }
}
```
{% endraw %}
