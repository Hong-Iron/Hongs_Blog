---
layout: "note"
title: "캡스톤 2 SQLite 저장소"
display_title: "캡스톤 2 SQLite 저장소"
kind: "practice"
kind_label: "연습"
num: "46"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
description: "1단계의 Url과 Code를 SQLite에 저장하고 되찾는다. 이 단계가 끝나면 다음이 된다."
prev_url: "/studies/rust/service-basics-practice/"
prev_title: "서비스 기초 연습"
next_url: "/studies/rust/capstone-3/"
next_title: "캡스톤 3 axum API"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "46_capstone-2_p1.rs", "u": "/studies/rust/code/46_capstone-2_p1/", "r": "문제 1 풀이"}]
permalink: "/studies/rust/capstone-2/"
---
{% raw %}
## 목표

1단계의 `Url`과 `Code`를 SQLite에 저장하고 되찾는다. 이 단계가 끝나면 다음이 된다.

- `LinkStore` 트레이트: 저장소가 해 줄 일(넣기, 찾기, 세기)만 적은 약속.
- `SqliteStore`: sqlx 0.9로 그 약속을 지키는 구현. 시작할 때 SQL로 테이블을 만든다.
- 서비스 함수 `shorten`: 코드가 이미 있으면 새로 뽑아 다시 넣는다(최대 5번).
- DB 에러를 서비스 에러로 바꾸기: "이미 있음"은 재시도 신호로, 나머지는 "저장소 고장"으로.

이 단계 없이 핸들러에서 SQL을 직접 부르면 세 가지가 깨진다. 코드가 우연히 겹친 사용자는 500을 받는다. DB 드라이버의 에러 문장이 그대로 응답에 실린다. 저장소를 바꾸거나 느린 저장소로 테스트하려면 핸들러를 고쳐야 한다(5단계는 일부러 느린 저장소로 시간 제한을 시험한다).

## 사용 개념

- [sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/): 풀, `query`·`query_scalar`, `bind`.
- [트레이트](/Hongs_Blog/studies/rust/traits/)와 [Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/): 트레이트 메서드가 퓨처를 돌려준다.
- [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/): 층마다 에러 타입을 두고 경계에서 바꾼다.
- [Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/): 코드 생성기를 여러 태스크가 나눠 쓴다.

## 설계 결정

| 결정 | 고른 것 | 까닭과 다른 길 |
|---|---|---|
| 쿼리 방식 | 실행 중에 검사하는 `sqlx::query`·`query_scalar` | `query!` 매크로는 컴파일할 때 DB에 접속해 SQL을 검사한다. 강력하지만 빌드에 `DATABASE_URL`이나 미리 받아 둔 쿼리 정보가 필요하다. 한 파일 프로그램이라 실행 시 검사를 골랐다 |
| 스키마 | 시작할 때 `CREATE TABLE IF NOT EXISTS` 한 문장 | 실제 서비스는 `sqlx::migrate!`로 버전 붙은 마이그레이션 파일을 쓴다. 테이블이 하나뿐이라 문장 하나로 충분하다 |
| 자리표시자 | `$1`, `$2` | sqlx 문서는 SQLite에서도 `?`보다 `$N`을 권한다[^1] |
| 충돌 처리 | INSERT를 해 보고 기본 키 위반이면 다시 뽑는다 | "SELECT로 있는지 보고 INSERT"는 두 요청이 같은 코드를 동시에 보면 둘 다 "없음"을 듣는다. 확인과 넣기 사이에 틈이 있다. 기본 키 제약은 DB가 원자적으로 지켜 준다 |
| 찾기 | `UPDATE … SET hits = hits + 1 … RETURNING url` 한 문장 | 찾기와 조회수 올리기를 왕복 한 번에 한다. 대신 읽기마다 쓰기가 생겨 SQLite의 쓰기 잠금을 잡는다 |
| 트레이트 메서드 | `fn insert(…) -> impl Future<Output = …> + Send` | `async fn`을 공개 트레이트에 바로 쓰면 반환 퓨처에 `Send`를 요구할 수 없어서 rustc가 경고한다[^2]. axum 핸들러와 `tokio::spawn`은 `Send` 퓨처가 필요하다 |

## 코드 설명

**하위목표 1: 저장소의 약속을 트레이트로 적는다.** `Future`는 2024 에디션 프렐류드에 들어 있어서 따로 `use`하지 않는다[^3].

```rust
pub trait LinkStore: Send + Sync + 'static {
    fn insert(&self, code: &Code, url: &Url) -> impl Future<Output = Result<(), StoreError>> + Send;
    fn resolve(&self, code: &Code) -> impl Future<Output = Result<Option<Url>, StoreError>> + Send;
    fn count(&self) -> impl Future<Output = Result<u64, StoreError>> + Send;
}
```

구현 쪽에서는 `async fn insert(…)`로 써도 된다. 트레이트가 `-> impl Future + Send`로 선언했어도 구현은 `async fn`으로 쓸 수 있고, 컴파일러가 그 퓨처가 정말 `Send`인지 확인한다[^2]. 이 트레이트는 `dyn LinkStore`로 쓸 수 없다. 반환 타입이 구현마다 달라서다. 그래서 3단계는 제네릭 `AppState<S>`를 쓴다.

**하위목표 2: 스키마와 연결.** 메모리 DB(`sqlite::memory:`)는 연결이 모두 닫히면 내용이 사라진다. 그래서 메모리 DB일 때만 연결을 1개로 두고, 놀고 있는 연결을 닫는 시간(`idle_timeout`)과 연결 수명(`max_lifetime`)을 끈다. 풀 문서는 실제 서비스에서는 수명을 무한으로 두지 말라고 하므로[^4] 파일 DB에는 이 설정을 쓰지 않는다.

```rust
const SCHEMA: &str = "CREATE TABLE IF NOT EXISTS links (
    code       TEXT PRIMARY KEY NOT NULL CHECK (length(code) = 7),
    url        TEXT NOT NULL CHECK (length(url) <= 2048),
    hits       INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
) STRICT";
```

`CHECK`는 1단계 규칙의 일부를 DB에도 적어 둔 것이다. 누가 SQL로 직접 넣어도 7글자가 아닌 코드는 들어가지 않는다. `STRICT`는 SQLite가 `TEXT` 열에 정수를 넣는 식의 느슨한 변환을 하지 못하게 한다. 메모리 DB 두 개를 열면 서로 다른 DB가 된다는 것은 테스트 `each_memory_db_is_separate`로 확인했다.

**하위목표 3: DB 에러를 저장소 에러로 바꾼다.** sqlx의 `Error::Database`는 드라이버 에러를 `Box<dyn DatabaseError>`로 담는다[^5]. `is_unique_violation()`은 고유 키·기본 키 위반인지 알려 준다[^6].

```rust
fn map_insert_error(e: sqlx::Error) -> StoreError {
    match e {
        sqlx::Error::Database(db) if db.is_unique_violation() => StoreError::Duplicate,
        other => StoreError::Backend(other),
    }
}
```

`StoreError::Backend`는 원인을 `#[source]`로 품는다. 응답에는 "storage failure"만 싣고, 원인은 4단계에서 로그로 남긴다. 자체 테스트 (바)는 풀을 닫은 뒤 삽입해서 `Storage(Backend(PoolClosed))` 사슬이 남는지 본다. 실행 출력은 `닫힌 풀: storage failure / 원인: Some("database error")`이다.

DB에서 읽은 주소도 `Url::parse`로 다시 검사한다. 테스트 (라)는 `javascript:x`를 SQL로 직접 넣고, `resolve`가 그것을 돌려주지 않고 `Corrupt`를 내는지 본다.

**하위목표 4: 재시도 루프.** 잠금 가드를 문장 끝에서 바로 버리는 것이 핵심이다.

```rust
for _ in 0..MAX_ATTEMPTS {
    let code = codes.lock().unwrap_or_else(PoisonError::into_inner).next_code();
    match store.insert(&code, &url).await {
        Ok(()) => return Ok((code, url)),
        Err(StoreError::Duplicate) => continue,
        Err(e) => return Err(LinkError::Storage(e)),
    }
}
Err(LinkError::CodeSpaceExhausted(MAX_ATTEMPTS))
```

`let guard = codes.lock()…;`로 가드를 변수에 담고 `.await`를 지나면 `shorten`의 퓨처는 `Send`가 아니게 된다. std의 `MutexGuard`는 `Send`가 아니기 때문이다. 그러면 테스트 (마)의 `tokio::spawn`이 컴파일되지 않는다. 테스트 (나)는 씨앗 7이 처음 낼 코드를 미리 넣어 두고 다시 뽑는지 본다(`충돌한 코드 TDoRgdH → 다시 뽑은 코드 SeywTyE`). 테스트 (다)는 씨앗 9가 낼 코드 5개를 모두 차지해 `CodeSpaceExhausted(5)`를 받는다.

**하위목표 5: 잘못된 코드는 DB에 묻지 않는다.** `resolve`는 `Code::parse`가 실패하면 바로 `NotFound`를 돌려준다. `../etc` 같은 입력은 SQL까지 가지 않고, "형식이 틀림"과 "없음"을 구별해 알려 주지도 않는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: rustfmt·clippy·테스트 2개·자체 테스트 6가지(저장·조회수, 충돌 재시도, 재시도 소진, 깨진 행, 동시 삽입 50개, 닫힌 풀) 통과 — [46_capstone-2_p1.rs](/Hongs_Blog/studies/rust/code/46_capstone-2_p1/)</div>

</div>


## 변형 문제

**변형 1.** 누군가 `insert`를 아래처럼 바꿨다. 컴파일되는가? 된다면 무엇이 위험한가?

```rust
sqlx::query(&format!("INSERT INTO links (code, url) VALUES ('{}', '{}')", code, url))
```

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

컴파일되지 않는다. sqlx 0.9의 `query`는 `impl SqlSafeStr`을 받는데, 이 트레이트는 `&'static str`과 `AssertSqlSafe(…)`로 감싼 값에만 구현돼 있다. `format!`이 만든 임시 `String`의 참조는 둘 다 아니다. `AssertSqlSafe`로 감싸 억지로 통과시키면 SQL 주입이 열린다. 1단계 규칙상 주소에 `'`가 들어갈 수 있어서, `https://a.b/'); DROP TABLE links; --` 같은 주소가 문장을 끝내고 새 문장을 붙인다. sqlx 문서는 사용자 입력은 `bind`로 넘기라고 하며, 바인딩한 값은 문장의 문법에 영향을 주지 않는다고 설명한다[^1].

</details>


**변형 2.** 찾기를 `SELECT url …` 다음 `UPDATE … hits = hits + 1` 두 문장으로 나누면 무엇이 달라지는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

DB 왕복이 두 번이 된다. 두 문장 사이에 링크가 지워지면 주소는 돌려줬는데 조회수는 안 오른다. 거꾸로 장점도 있다. `SELECT`만 하는 경로는 쓰기 잠금을 잡지 않으니, 읽기가 몰릴 때 SQLite에서 덜 막힌다. 조회수를 정확히 셀 필요가 없다면 조회수만 메모리에 모았다가 몇 초마다 한 번에 쓰는 방법도 있다.

</details>


**변형 3.** `LinkStore`의 메서드를 `async fn insert(&self, …) -> Result<(), StoreError>;`로 바꾸면 어떤 경고가 나오고, 3단계에서 무엇이 깨지는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

공개 트레이트에 `async fn`을 쓰면 rustc가 `async_fn_in_trait` 경고를 낸다. 반환 퓨처가 `Send`라는 보장이 없어서다[^2]. 제네릭 핸들러 `create_link::<S>` 안에서 `store.insert(…).await`를 하면 핸들러 퓨처도 `Send`라고 증명할 수 없다. axum은 `Send` 퓨처를 내는 핸들러만 받으므로 라우터에 등록하는 줄에서 컴파일 에러가 난다. 이 과목의 clippy 설정(`-D warnings`)에서는 경고만으로도 빌드가 멈춘다.

</details>


[^1]: sqlx 0.9.0 문서, `fn query` — 자리표시자(`$N`)와 SQL 주입 설명 — https://docs.rs/sqlx/0.9.0/sqlx/fn.query.html
[^2]: Rust Blog, "Announcing `async fn` and return-position `impl Trait` in traits"(2023-12-21), "Where the gaps lie"·`Send` 경계 설명 — https://blog.rust-lang.org/2023/12/21/async-fn-rpit-in-traits/
[^3]: Edition Guide, Rust 2024 "Prelude changes"(`Future`, `IntoFuture` 추가) — https://doc.rust-lang.org/edition-guide/rust-2024/prelude.html
[^4]: sqlx-core 0.9.0 문서, `PoolOptions::max_lifetime`·`idle_timeout` — https://docs.rs/sqlx-core/0.9.0/sqlx_core/pool/struct.PoolOptions.html
[^5]: sqlx 0.9.0 문서, `enum Error`의 `Database(Box<dyn DatabaseError>)` — https://docs.rs/sqlx/0.9.0/sqlx/enum.Error.html
[^6]: sqlx-core 0.9.0 문서, `trait DatabaseError::is_unique_violation` — https://docs.rs/sqlx-core/0.9.0/sqlx_core/error/trait.DatabaseError.html
{% endraw %}
