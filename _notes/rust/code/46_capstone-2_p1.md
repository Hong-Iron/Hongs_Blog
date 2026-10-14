---
layout: "note"
title: "46_capstone-2_p1.rs"
display_title: "46_capstone-2_p1.rs"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "46"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/capstone-2/"
parent_title: "캡스톤 2 SQLite 저장소"
description: "Rust · 캡스톤 2 SQLite 저장소 문제 1 풀이 코드"
sitemap: false
permalink: "/studies/rust/code/46_capstone-2_p1/"
---
{% raw %}
[캡스톤 2 SQLite 저장소](/Hongs_Blog/studies/rust/capstone-2/) 문서의 문제 1 풀이 코드다.

```rust
//! 캡스톤 2단계: 1단계 도메인 위에 LinkStore 트레이트와 SQLite 저장소(sqlx)를 얹는다.
//! 코드 충돌 재시도, DB 에러를 도메인 에러로 바꾸기, 동시 삽입을 확인한다.
//! 의존성: thiserror = "2", tokio = { version = "1", features = ["full"] },
//!         sqlx = { version = "0.9", default-features = false, features = ["runtime-tokio", "sqlite"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/4.연습문제/46_capstone-2_p1.rs"
//! 파일 DB로 써 보기: 코드의 "sqlite::memory:"를 "sqlite://links.db"로 바꾼다.

use std::fmt;
use std::hash::{BuildHasher, RandomState};
use std::str::FromStr;
use std::sync::{Arc, Mutex, PoisonError};

use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};

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

// ===== 9. 스스로 확인 =====

async fn self_check() {
    let store = SqliteStore::connect("sqlite::memory:").await.expect("db");
    let codes = Mutex::new(CodeGen::from_seed(1));

    // (가) 저장하고 되찾기, 조회수
    let (code, url) = shorten(&store, &codes, "https://example.com/a")
        .await
        .unwrap();
    assert_eq!(resolve(&store, code.as_str()).await.unwrap(), url);
    let hits: i64 = sqlx::query_scalar("SELECT hits FROM links WHERE code = $1")
        .bind(code.as_str())
        .fetch_one(&store.pool)
        .await
        .unwrap();
    assert_eq!(hits, 1);
    assert!(matches!(
        resolve(&store, "zzzzzzz").await,
        Err(LinkError::NotFound)
    ));
    assert!(matches!(
        resolve(&store, "../etc").await,
        Err(LinkError::NotFound)
    ));
    assert!(matches!(
        shorten(&store, &codes, "ftp://x").await,
        Err(LinkError::Invalid(DomainError::UnsupportedScheme))
    ));

    // (나) 충돌 재시도: 씨앗 7이 처음 낼 코드를 미리 넣어 둔다.
    let taken = CodeGen::from_seed(7).next_code();
    store.insert(&taken, &url).await.unwrap();
    let again = store.insert(&taken, &url).await;
    assert!(matches!(again, Err(StoreError::Duplicate)));
    let (got, _) = shorten(
        &store,
        &Mutex::new(CodeGen::from_seed(7)),
        "https://b.example",
    )
    .await
    .unwrap();
    assert_ne!(got, taken);
    println!("충돌한 코드 {taken} → 다시 뽑은 코드 {got}");

    // (다) 재시도 소진: 씨앗 9가 낼 코드 5개를 모두 미리 차지한다.
    let mut g = CodeGen::from_seed(9);
    for _ in 0..MAX_ATTEMPTS {
        store.insert(&g.next_code(), &url).await.unwrap();
    }
    let r = shorten(
        &store,
        &Mutex::new(CodeGen::from_seed(9)),
        "https://c.example",
    )
    .await;
    assert!(matches!(r, Err(LinkError::CodeSpaceExhausted(5))));

    // (라) DB에 잘못된 값이 들어 있으면 Corrupt
    sqlx::query("INSERT INTO links (code, url) VALUES ('bad0000', 'javascript:x')")
        .execute(&store.pool)
        .await
        .unwrap();
    let bad = Code::parse("bad0000").unwrap();
    assert!(matches!(
        store.resolve(&bad).await,
        Err(StoreError::Corrupt(_))
    ));

    // (마) 동시에 50개: 태스크로 보내려면 저장소와 퓨처가 Send여야 한다.
    let store = Arc::new(store);
    let codes = Arc::new(Mutex::new(CodeGen::from_entropy()));
    let before = store.count().await.unwrap();
    let mut handles = Vec::new();
    for i in 0..50 {
        let (store, codes) = (Arc::clone(&store), Arc::clone(&codes));
        handles.push(tokio::spawn(async move {
            shorten(&*store, &codes, &format!("https://n{i}.example")).await
        }));
    }
    for h in handles {
        h.await.unwrap().unwrap();
    }
    assert_eq!(store.count().await.unwrap(), before + 50);

    // (바) 풀을 닫은 뒤의 에러는 Backend로 남는다(원인 체인 보존).
    store.close().await;
    let err = shorten(&*store, &codes, "https://d.example")
        .await
        .unwrap_err();
    let source = std::error::Error::source(&err).map(|s| s.to_string());
    println!("닫힌 풀: {err} / 원인: {source:?}");
    assert!(matches!(err, LinkError::Storage(StoreError::Backend(_))));
}

#[tokio::main]
async fn main() {
    self_check().await;
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn self_check_passes() {
        self_check().await;
    }

    #[tokio::test]
    async fn each_memory_db_is_separate() {
        let a = SqliteStore::connect("sqlite::memory:").await.unwrap();
        let b = SqliteStore::connect("sqlite::memory:").await.unwrap();
        a.insert(
            &Code::parse("abcdefg").unwrap(),
            &Url::parse("https://a.b").unwrap(),
        )
        .await
        .unwrap();
        assert_eq!(a.count().await.unwrap(), 1);
        assert_eq!(b.count().await.unwrap(), 0);
    }
}
```
{% endraw %}
