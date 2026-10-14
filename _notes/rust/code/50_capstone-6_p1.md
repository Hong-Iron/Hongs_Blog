---
layout: "note"
title: "50_capstone-6_p1.rs"
display_title: "50_capstone-6_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "50"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/capstone-6/"
parent_title: "캡스톤 6 테스트·CI·배포"
description: "Rust · 캡스톤 6 테스트·CI·배포 문제 1 풀이 코드"
permalink: "/studies/rust/code/50_capstone-6_p1/"
---
{% raw %}
[캡스톤 6 테스트·CI·배포](/Hongs_Blog/studies/rust/capstone-6/) 문서의 문제 1 풀이 코드다.

```rust
//! 캡스톤 6단계: 5단계 서비스 전체를 테스트 피라미드로 묶는다(서비스 코드는 5단계와 같다).
//! unit(도메인·설정·proptest) → store(메모리 SQLite) → router(oneshot) → e2e(127.0.0.1:0 진짜 소켓 1개).
//! CI·cargo-deny·릴리스 프로필·Dockerfile은 문서 "50.캡스톤 6 테스트·CI·배포"에 있다(여기서 실행하지 않음).
//! 의존성: thiserror = "2", tokio = { version = "1", features = ["full"] }, tokio-util = { version = "0.7", features = ["rt"] },
//!         axum = "0.8", serde = { version = "1", features = ["derive"] }, serde_json = "1",
//!         tower = { version = "0.5", features = ["util", "limit"] },
//!         tower-http = { version = "0.7", features = ["trace", "timeout", "limit"] },
//!         sqlx = { version = "0.9", default-features = false, features = ["runtime-tokio", "sqlite"] },
//!         tracing = "0.1", tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] },
//!         proptest = "1" (dev)
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/50_capstone-6_p1.rs"
//! 진짜 서버로: SERVE=1 cargo run --release --bin <이름>  (설정은 5단계와 같은 환경 변수)

use std::collections::HashMap;
use std::fmt;
use std::hash::{BuildHasher, RandomState};
use std::net::SocketAddr;
use std::str::FromStr;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex, OnceLock, PoisonError};
use std::time::{Duration, Instant};

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
use tokio::time::MissedTickBehavior;
use tokio_util::sync::CancellationToken;
use tokio_util::task::TaskTracker;
use tower::ServiceBuilder;
use tower::limit::GlobalConcurrencyLimitLayer;
use tower_http::limit::RequestBodyLimitLayer;
use tower_http::timeout::TimeoutLayer;
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
            // 5단계: 시간 제한이 acquire 도중의 퓨처를 버리면 sqlx는 그 연결을 풀에 돌려주지 않고 버린다.
            // 메모리 DB는 연결 하나가 곧 DB라서 표가 통째로 사라진다. 연결 전 점검(.await 하나)을 끈다.
            SqlitePoolOptions::new()
                .max_connections(1)
                .idle_timeout(None)
                .max_lifetime(None)
                .test_before_acquire(false)
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
    /// 통계 태스크가 마지막으로 센 링크 수. /health가 DB에 묻지 않고 읽는다.
    stats: Arc<AtomicU64>,
}

// #[derive(Clone)]은 S: Clone을 요구하므로 손으로 쓴다.
impl<S> Clone for AppState<S> {
    fn clone(&self) -> Self {
        Self {
            store: Arc::clone(&self.store),
            codes: Arc::clone(&self.codes),
            stats: Arc::clone(&self.stats),
        }
    }
}

impl<S> AppState<S> {
    pub fn new(store: S, codes: CodeGen) -> Self {
        Self {
            store: Arc::new(store),
            codes: Arc::new(Mutex::new(codes)),
            stats: Arc::default(),
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

async fn health<S>(State(st): State<AppState<S>>) -> Json<serde_json::Value> {
    let links = st.stats.load(Ordering::Relaxed);
    Json(serde_json::json!({ "status": "ok", "links": links }))
}

async fn not_found() -> ApiError {
    ApiError::Link(LinkError::NotFound)
}

pub fn router<S: LinkStore>(state: AppState<S>, cfg: &Config) -> Router {
    Router::new()
        .route("/health", get(health::<S>))
        .route("/links", post(create_link::<S>))
        .route("/{code}", get(follow::<S>))
        .fallback(not_found)
        .with_state(state)
        // 추출기별 기본 상한은 끄고, 모든 요청에 걸리는 tower-http 상한 하나만 둔다.
        .layer(DefaultBodyLimit::disable())
        // ServiceBuilder는 위에 쓴 레이어가 바깥이다: 추적 → 시간 제한 → 동시 처리 상한 → 본문 상한.
        .layer(
            ServiceBuilder::new()
                .layer(
                    TraceLayer::new_for_http()
                        .make_span_with(DefaultMakeSpan::new().level(Level::INFO))
                        .on_response(DefaultOnResponse::new().level(Level::INFO)),
                )
                // 핸들러가 이 시간 안에 못 끝내면 503. 단, 아래 상한에서 줄 선 시간은 재지 않는다.
                .layer(TimeoutLayer::with_status_code(
                    StatusCode::SERVICE_UNAVAILABLE,
                    cfg.request_timeout,
                ))
                // 세마포어 하나를 서버 전체가 나눠 쓴다(ConcurrencyLimitLayer는 감싼 서비스마다 따로 센다). 넘치면 줄 세운다.
                .layer(GlobalConcurrencyLimitLayer::new(cfg.max_in_flight))
                .layer(RequestBodyLimitLayer::new(cfg.max_body_bytes)),
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
    pub request_timeout: Duration,
    pub max_in_flight: usize,
    pub stats_interval: Duration,
}

/// 정수 설정 하나를 읽는다. 없으면 기본값, 범위를 벗어나면 에러.
fn read_num(
    get: &impl Fn(&str) -> Option<String>,
    key: &'static str,
    default: u64,
    range: std::ops::RangeInclusive<u64>,
    reason: &'static str,
) -> Result<u64, ConfigError> {
    match get(key) {
        None => Ok(default),
        Some(v) => v
            .parse()
            .ok()
            .filter(|n| range.contains(n))
            .ok_or(ConfigError { key, reason }),
    }
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
        let ms = |key, default, reason| {
            read_num(&get, key, default, 1..=600_000, reason).map(Duration::from_millis)
        };
        let request_timeout = ms(
            "REQUEST_TIMEOUT_MS",
            5_000,
            "expected milliseconds in 1..=600000",
        )?;
        let stats_interval = ms(
            "STATS_INTERVAL_MS",
            30_000,
            "expected milliseconds in 1..=600000",
        )?;
        let max_in_flight = read_num(&get, "MAX_IN_FLIGHT", 256, 1..=10_000, "expected 1..=10000")?;
        Ok(Self {
            bind,
            database_url: Secret::new(database_url),
            max_body_bytes,
            log_format,
            request_timeout,
            max_in_flight: usize::try_from(max_in_flight).unwrap_or(256),
            stats_interval,
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

// ===== 14. 백그라운드 태스크: 주기적으로 링크 수 세기 (5단계) =====

/// 토큰이 취소되면 다음 틱을 기다리지 않고 바로 끝난다.
#[instrument(skip_all)]
async fn stats_task<S: LinkStore>(
    store: Arc<S>,
    stats: Arc<AtomicU64>,
    every: Duration,
    token: CancellationToken,
) {
    let mut ticker = tokio::time::interval(every);
    ticker.set_missed_tick_behavior(MissedTickBehavior::Delay);
    loop {
        tokio::select! {
            () = token.cancelled() => break,
            _ = ticker.tick() => match store.count().await {
                Ok(n) => stats.store(n, Ordering::Relaxed),
                Err(e) => tracing::warn!(error = %e, "stats count failed"),
            },
        }
    }
    tracing::info!("stats task stopped");
}

// ===== 15. 서버 시작과 안전한 종료 =====

pub const SHUTDOWN_GRACE: Duration = Duration::from_secs(10);

pub struct Running {
    pub addr: SocketAddr,
    token: CancellationToken,
    tracker: TaskTracker,
}

/// 서버와 통계 태스크를 같은 토큰·트래커 아래에 띄운다.
pub async fn start<S: LinkStore>(
    cfg: &Config,
    store: S,
    codes: CodeGen,
) -> std::io::Result<Running> {
    let state = AppState::new(store, codes);
    let (token, tracker) = (CancellationToken::new(), TaskTracker::new());
    tracker.spawn(stats_task(
        Arc::clone(&state.store),
        Arc::clone(&state.stats),
        cfg.stats_interval,
        token.child_token(),
    ));
    let listener = TcpListener::bind(cfg.bind).await?;
    let addr = listener.local_addr()?;
    let app = router(state, cfg);
    let signal = token.clone().cancelled_owned();
    tracker.spawn(async move {
        if let Err(e) = axum::serve(listener, app)
            .with_graceful_shutdown(signal)
            .await
        {
            tracing::error!(error = %e, "server error");
        }
        tracing::info!("server stopped");
    });
    tracing::info!(%addr, "listening");
    Ok(Running {
        addr,
        token,
        tracker,
    })
}

impl Running {
    /// 새 연결을 그만 받고, 처리 중인 요청과 태스크가 끝나기를 grace만큼 기다린다.
    pub async fn shutdown(self, grace: Duration) -> bool {
        self.token.cancel();
        self.tracker.close();
        let done = tokio::time::timeout(grace, self.tracker.wait())
            .await
            .is_ok();
        if !done {
            tracing::warn!(
                remaining = self.tracker.len(),
                "grace period over, exiting anyway"
            );
        }
        done
    }
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c().await.ok();
    };
    #[cfg(unix)]
    let term = async {
        use tokio::signal::unix::{SignalKind, signal};
        if let Ok(mut s) = signal(SignalKind::terminate()) {
            s.recv().await;
        }
    };
    #[cfg(not(unix))]
    let term = std::future::pending::<()>();
    tokio::select! {
        () = ctrl_c => {},
        () = term => {},
    }
}

// ===== 16. 자체 테스트용: resolve를 일부러 늦추는 저장소 =====

pub struct Slow<S> {
    inner: S,
    delay: Duration,
}

impl<S: LinkStore> LinkStore for Slow<S> {
    async fn insert(&self, code: &Code, url: &Url) -> Result<(), StoreError> {
        self.inner.insert(code, url).await
    }
    async fn resolve(&self, code: &Code) -> Result<Option<Url>, StoreError> {
        tokio::time::sleep(self.delay).await;
        self.inner.resolve(code).await
    }
    async fn count(&self) -> Result<u64, StoreError> {
        self.inner.count().await
    }
}

// ===== 17. 진짜 소켓으로 보내는 작은 HTTP 클라이언트 (자체 테스트용) =====

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

// ===== 18. main: 자체 테스트(기본) 또는 서버(SERVE=1) =====

fn test_config(extra: &[(&str, &str)]) -> Config {
    let mut vars: HashMap<String, String> = [
        ("BIND_ADDR", "127.0.0.1:0"),
        ("DATABASE_URL", "sqlite::memory:"),
        ("MAX_BODY_BYTES", "256"),
        ("STATS_INTERVAL_MS", "20"),
    ]
    .iter()
    .map(|(k, v)| (k.to_string(), v.to_string()))
    .collect();
    vars.extend(extra.iter().map(|(k, v)| (k.to_string(), v.to_string())));
    Config::from_lookup(|k| vars.get(k).cloned()).expect("test config")
}

async fn self_check() {
    captured_logs();
    let cfg = test_config(&[]);
    let store = SqliteStore::connect(cfg.database_url.expose())
        .await
        .expect("db");
    let slow = Slow {
        inner: store,
        delay: Duration::from_millis(300),
    };
    let running = start(&cfg, slow, CodeGen::from_seed(3))
        .await
        .expect("start");
    let addr = running.addr;

    let r = http(addr, "POST", "/links", r#"{"url":"https://example.com/x"}"#).await;
    assert_eq!(r.status, 201, "{}", r.body);
    let v: serde_json::Value = serde_json::from_str(&r.body).expect("json");
    let code = v["code"].as_str().expect("code").to_owned();
    tokio::time::sleep(Duration::from_millis(60)).await;
    let r = http(addr, "GET", "/health", "").await;
    assert_eq!(r.body, r#"{"links":1,"status":"ok"}"#);
    let big = format!(r#"{{"url":"https://a.b/{}"}}"#, "x".repeat(300));
    let r = http(addr, "POST", "/links", &big).await;
    assert_eq!(r.status, 413);

    // 처리 중(300ms 걸리는) 요청을 걸어 둔 채 종료를 시작한다.
    let in_flight = tokio::spawn(async move { http(addr, "GET", &format!("/{code}"), "").await });
    tokio::time::sleep(Duration::from_millis(50)).await;
    let t0 = Instant::now();
    assert!(
        running.shutdown(SHUTDOWN_GRACE).await,
        "graceful shutdown timed out"
    );
    let r = in_flight.await.expect("join");
    println!(
        "종료 중에도 끝난 요청: {} ({:?} 걸려 종료)",
        r.status,
        t0.elapsed()
    );
    assert_eq!(r.status, 307);
    assert!(r.head.contains("location: https://example.com/x"));
    assert!(
        tokio::net::TcpStream::connect(addr).await.is_err(),
        "종료 뒤 새 연결은 거절돼야 한다"
    );

    let logs = captured_logs();
    assert!(logs.contains("stats task stopped") && logs.contains("server stopped"));
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
    let running = start(&cfg, store, CodeGen::from_entropy())
        .await
        .expect("start");
    shutdown_signal().await;
    tracing::info!("shutdown signal received");
    if !running.shutdown(SHUTDOWN_GRACE).await {
        std::process::exit(1);
    }
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

// ===== 19. 테스트 피라미드 (6단계) =====
// 아래로 갈수록 느리고 넓다: unit(순수 함수, 성질 테스트) → store(메모리 SQLite)
// → router(oneshot, 소켓 없음) → e2e(127.0.0.1:0 진짜 소켓, 하나만).

#[cfg(test)]
mod unit {
    use super::*;
    use proptest::prelude::*;

    #[test]
    fn url_rules() {
        assert!(Url::parse(" https://example.com/a?b=c ").is_ok());
        let bad = [
            ("", DomainError::EmptyUrl),
            ("javascript:alert(1)", DomainError::UnsupportedScheme),
            ("https://", DomainError::MissingHost),
            ("https://bank.com@evil.example/", DomainError::UserInfo),
            ("https://a b", DomainError::InvalidCharacter { index: 9 }),
        ];
        for (input, want) in bad {
            assert_eq!(Url::parse(input), Err(want), "{input:?}");
        }
    }

    #[test]
    fn config_and_secret() {
        let cfg = Config::from_lookup(|k| (k == "DATABASE_URL").then(|| "sqlite://pw-1.db".into()))
            .unwrap();
        assert!(!format!("{cfg:?}").contains("pw-1"));
        assert_eq!(cfg.request_timeout, Duration::from_secs(5));
        let e = Config::from_lookup(|k| {
            (k == "DATABASE_URL").then(|| "postgres://u:hunter2@h/d".into())
        });
        assert!(!e.unwrap_err().to_string().contains("hunter2"));
        assert!(Config::from_lookup(|k| (k == "MAX_IN_FLIGHT").then(|| "0".into())).is_err());
    }

    proptest! {
        #[test]
        fn generated_codes_always_parse(seed in any::<u64>()) {
            let mut g = CodeGen::from_seed(seed);
            for _ in 0..20 {
                let c = g.next_code();
                prop_assert_eq!(Code::parse(c.as_str()), Ok(c.clone()));
            }
        }

        // 아무 문자열(".{0,64}")이면 256개 중 0개가 검사를 통과해 속성이 늘 참이 된다.
        // 스킴을 붙이고 끝에 아무 글자 하나를 덧붙여 절반쯤 통과하게 만든다.
        #[test]
        fn accepted_urls_fit_in_a_location_header(s in "(?i:https?)://[ -~]{0,40}(?s:.)?") {
            if let Ok(u) = Url::parse(&s) {
                prop_assert!(axum::http::HeaderValue::from_str(u.as_str()).is_ok());
            }
        }
    }
}

#[cfg(test)]
mod store {
    use super::*;

    #[tokio::test]
    async fn collision_is_retried_and_db_errors_are_mapped() {
        let store = SqliteStore::connect("sqlite::memory:").await.unwrap();
        let url = Url::parse("https://a.b").unwrap();
        let taken = CodeGen::from_seed(7).next_code();
        store.insert(&taken, &url).await.unwrap();
        assert!(matches!(
            store.insert(&taken, &url).await,
            Err(StoreError::Duplicate)
        ));
        let (got, _) = shorten(&store, &Mutex::new(CodeGen::from_seed(7)), "https://c.d")
            .await
            .unwrap();
        assert_ne!(got, taken);
        store.close().await;
        let err = shorten(&store, &Mutex::new(CodeGen::from_seed(8)), "https://e.f").await;
        assert!(matches!(
            err,
            Err(LinkError::Storage(StoreError::Backend(_)))
        ));
    }

    /// 시간 제한은 진행 중인 저장소 퓨처를 버린다. 몇 번 poll한 뒤 버리기를 되풀이해도 메모리 DB가 남아야 한다.
    #[tokio::test]
    async fn dropped_queries_keep_memory_db() {
        let store = SqliteStore::connect("sqlite::memory:").await.unwrap();
        let code = Code::parse("abcdefg").unwrap();
        store
            .insert(&code, &Url::parse("https://a.b").unwrap())
            .await
            .unwrap();
        for polls in 1..30 {
            for _ in 0..10 {
                let mut f = std::pin::pin!(store.resolve(&code));
                for _ in 0..polls {
                    let ready = std::future::poll_fn(|cx| {
                        std::task::Poll::Ready(f.as_mut().poll(cx).is_ready())
                    })
                    .await;
                    if ready {
                        break;
                    }
                    tokio::task::yield_now().await;
                }
            }
        }
        assert_eq!(store.count().await.unwrap(), 1, "메모리 DB가 사라졌다");
    }
}

#[cfg(test)]
mod router_level {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;

    async fn app(delay_ms: u64, extra: &[(&str, &str)]) -> Router {
        let store = SqliteStore::connect("sqlite::memory:").await.unwrap();
        let code = Code::parse("abcdefg").unwrap();
        store
            .insert(&code, &Url::parse("https://a.b").unwrap())
            .await
            .unwrap();
        let slow = Slow {
            inner: store,
            delay: Duration::from_millis(delay_ms),
        };
        router(
            AppState::new(slow, CodeGen::from_seed(5)),
            &test_config(extra),
        )
    }

    fn req(method: &str, uri: &str, ctype: &str, body: &'static str) -> Request<Body> {
        Request::builder()
            .method(method)
            .uri(uri)
            .header("content-type", ctype)
            .body(Body::from(body))
            .unwrap()
    }

    #[tokio::test]
    async fn status_codes() {
        let cases = [
            (req("GET", "/abcdefg", "", ""), 307),
            (req("GET", "/zzzzzzz", "", ""), 404),
            (req("GET", "/a/b/c", "", ""), 404),
            (req("GET", "/links", "", ""), 405),
            (req("GET", "/health", "", ""), 200),
            (
                req(
                    "POST",
                    "/links",
                    "application/json",
                    r#"{"url":"https://x.y"}"#,
                ),
                201,
            ),
            (
                req("POST", "/links", "text/plain", r#"{"url":"https://x.y"}"#),
                415,
            ),
            (req("POST", "/links", "application/json", r#"{"url":"#), 400),
            (
                req(
                    "POST",
                    "/links",
                    "application/json",
                    r#"{"url":"ftp://x.y"}"#,
                ),
                422,
            ),
        ];
        for (r, want) in cases {
            let uri = r.uri().clone();
            let resp = app(0, &[]).await.oneshot(r).await.unwrap();
            assert_eq!(resp.status().as_u16(), want, "{uri}");
        }
    }

    #[tokio::test]
    async fn timeout_gives_503_with_no_socket_needed() {
        let resp = app(300, &[("REQUEST_TIMEOUT_MS", "50")])
            .await
            .oneshot(req("GET", "/abcdefg", "", ""))
            .await
            .unwrap();
        assert_eq!(resp.status(), StatusCode::SERVICE_UNAVAILABLE);
    }
}

#[cfg(test)]
mod e2e {
    use super::*;

    #[tokio::test]
    async fn real_socket_round_trip_and_graceful_shutdown() {
        self_check().await;
    }
}
```
{% endraw %}
