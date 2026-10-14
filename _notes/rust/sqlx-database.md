---
layout: "note"
title: "sqlx로 데이터베이스 쓰기"
display_title: "sqlx로 데이터베이스 쓰기 (sqlx)"
kind: "concept"
kind_label: "기법"
num: "46"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["sqlx", "SQLx", "SqlitePool", "Connection Pool", "연결 풀", "Bind Parameter", "바인드 매개변수", "FromRow", "Transaction", "트랜잭션", "Migration", "마이그레이션", "SQL Injection", "SQL 주입", "SqlSafeStr", "AssertSqlSafe"]
description: "sqlx는 Rust 프로그램이 SQL 문장을 그대로 써서 데이터베이스와 주고받게 해 주는 라이브러리다. 연결 몇 개를 미리 열어 두고 돌려 쓰며, 사용자 입력은 문장에 이어 붙이지 않고 따로 실어 보낸다. 그래서 입력에 따옴표나 SQL 조각이 섞여도 문장이 바뀌지 않는다. 대신 S…"
prev_url: "/studies/rust/axum-http/"
prev_title: "axum으로 HTTP 서비스 만들기"
next_url: "/studies/rust/performance-measurement/"
next_title: "성능 측정과 최적화"
math: true
mermaid: false
code_count: 2
permalink: "/studies/rust/sqlx-database/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

sqlx는 Rust 프로그램이 SQL 문장을 그대로 써서 데이터베이스와 주고받게 해 주는 라이브러리다. 연결 몇 개를 미리 열어 두고 돌려 쓰며, 사용자 입력은 문장에 이어 붙이지 않고 따로 실어 보낸다. 그래서 입력에 따옴표나 SQL 조각이 섞여도 문장이 바뀌지 않는다. 대신 SQL은 문자열이라 오타나 잘못된 열 이름은 실행해 봐야 드러난다. 빌드 때 실제 DB에 대 보고 검사하는 방법도 있지만, 그러려면 빌드 환경에 DB 주소나 미리 떠 둔 정보가 있어야 한다.

</div>


## 예시로 보기

단축 주소 서비스가 `links` 표에 코드와 원래 주소를 저장한다고 하자. 요청이 올 때마다 DB 연결을 새로 열면 연결을 여는 시간이 요청마다 붙는다. 연결 하나를 모든 요청이 같이 쓰면, 한 연결은 보통 여러 스레드가 동시에 쓸 수 없어서 줄을 서야 한다[^1]. 그래서 연결 여러 개를 미리 열어 두고 빌려 쓰고 돌려주는 연결 풀(connection pool)을 쓴다.

```rust
let pool = SqlitePoolOptions::new()
    .max_connections(4)
    .connect("sqlite::memory:")
    .await?;

sqlx::query("INSERT INTO links (code, url) VALUES (?, ?)")
    .bind(code)
    .bind(url)
    .execute(&pool)
    .await?;
```

`?` 자리는 값이 들어갈 빈칸이다. `.bind(code)`가 그 빈칸에 들어갈 값을 따로 싣는다. 이것을 바인드 매개변수(bind parameter)라 부른다. SQLite에서는 `?`를 나온 순서대로 채운다[^2]. 다만 sqlx의 `query` 함수 문서는 SQLite에서도 `$1`, `$2`처럼 번호를 붙인 자리를 쓰라고 한다. 번호가 있으면 값 하나를 여러 자리에서 다시 쓸 수 있다[^3]. 이 문서의 코드는 `?`를, [캡스톤 2](/Hongs_Blog/studies/rust/capstone-2/)는 `$1`을 쓰고, 둘 다 SQLite에서 돈다.

풀을 함수나 태스크에 넘길 때는 `clone()`해도 된다. `Pool`은 안쪽 상태를 가리키는 참조 세기 손잡이라서 복제가 싸고, 모든 복제본이 같은 풀을 쓴다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 풀, 바인드, `FromRow`, UNIQUE 위반, 주입, 트랜잭션 되돌리기, 메모리 DB의 범위, 마이그레이션을 모두 SQLite 메모리 DB로 실행해 확인했다 — [46_sqlx-database_impl.rs](/Hongs_Blog/studies/rust/code/46_sqlx-database_impl/). `format!`으로 만든 문자열을 `sqlx::query`에 넘기면 컴파일 오류가 나는 것은 rustc로 직접 컴파일해 확인했다 — [46_sqlx-database_verify.rs](/Hongs_Blog/studies/rust/code/46_sqlx-database_verify/)</div>

</div>


## 왜 이어 붙이면 안 되는가

`format!`으로 사용자 입력을 SQL 문장 안에 넣는다고 하자.

```rust
let sql = format!("SELECT COUNT(*) FROM links WHERE code = '{code}'");
```

`code`에 `x' OR '1'='1`이 들어오면 문장은 `... WHERE code = 'x' OR '1'='1'`이 된다. 조건이 늘 참이 되어 모든 줄을 센다. 실행해 보면 세 줄이 든 표에서 이어 붙인 쪽은 3을, 바인드 쪽은 0을 돌려준다. 이렇게 입력이 문장의 모양을 바꾸는 공격을 SQL 주입(SQL injection)이라 부른다.

사고가 아닌 평범한 입력도 깨진다. `it's`처럼 작은따옴표가 든 값을 넣으면 문장의 따옴표 짝이 어긋나 문법 오류가 난다. sqlx 문서도 같은 예를 든다[^3]. 바인드로 보낸 값은 문장과 따로 가서 문장의 문법에 영향을 주지 않는다[^3].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">두 문장 주입은 SQLite에서 실제로 돈다</div>

`sqlx::query` 문서는 준비된 문장이 대개 문장 하나만 받으므로 `foo'; DELETE FROM articles; --` 같은 입력은 오류가 된다고 적는다[^3]. sqlx 0.9.0 + SQLite에서는 그렇지 않았다. 이어 붙인 `UPDATE ... WHERE code = 'a'; DELETE FROM links; --'`를 `execute`로 보내자 바뀐 줄이 4개였고 표가 비었다. 같은 입력을 바인드로 보내면 그냥 없는 코드여서 아무 일도 없었다. 드라이버마다 다르다고 보고, 막는 방법은 바인드 하나뿐이라고 생각한다.

</div>


### sqlx 0.9가 거는 과속 방지턱

sqlx 0.9의 `query`는 문자열로 `SqlSafeStr`을 구현한 타입만 받는다. 이 트레이트를 스스로 구현한 문자열 타입은 `&'static str`(프로그램에 박힌 글자)뿐이다[^4]. 그래서 `format!`이 만든 `String`을 넘기면 컴파일이 멈춘다.

```text
error[E0277]: dynamic SQL strings should be audited for possible injections
  |
3 |     let _q = sqlx::query::<sqlx::Sqlite>(sql);
  |                                          ^^^ dynamic SQL string
  = help: the trait `SqlSafeStr` is not implemented for `String`
  = note: prefer literal SQL strings with bind parameters or `QueryBuilder` to add dynamic data to a query.
```

꼭 동적 문자열을 써야 하면 `AssertSqlSafe(sql)`로 감싼다. 감싼다는 것은 "주입이 없는지 내가 확인했다"는 서명이다[^4]. 정렬 열 이름처럼 SQL의 모양 자체가 바뀌어야 할 때는 `QueryBuilder`를 쓰고, 값은 `push_bind`로만 넣는다. `push`로 넣은 글자는 거르지 않는다[^5].

## 줄을 구조체로 받기: FromRow

`#[derive(FromRow)]`를 붙이면 결과 줄 하나를 구조체 하나로 바꿔 준다. 필드 이름과 열 이름이 글자 그대로 같아야 한다. 다르면 `#[sqlx(rename = "...")]`를 쓴다[^6].

```rust
#[derive(Debug, FromRow)]
struct Link { id: i64, code: String, url: String, hits: i64 }

let link = sqlx::query_as::<_, Link>("SELECT id, code, url, hits FROM links WHERE code = ?")
    .bind(code)
    .fetch_optional(&pool)   // 없으면 Ok(None)
    .await?;
```

받는 방법은 결과 줄 수에 맞춰 고른다. 정확히 한 줄이면 `fetch_one`, 없을 수도 있으면 `fetch_optional`, 여럿이면 `fetch_all`이다. 첫 열 하나만 필요하면 `query_scalar`를 쓴다[^7].

UNIQUE 같은 제약 위반은 `sqlx::Error::Database`로 온다. `err.as_database_error()`로 꺼내 `is_unique_violation()`을 물으면 "이미 있는 코드"를 사용자 잘못(409 같은 응답)으로 바꿀 수 있다. 실행해 보면 메시지는 `UNIQUE constraint failed: links.code`였다.

## 트랜잭션

여러 문장을 "전부 되거나 전부 안 되거나"로 묶을 때 트랜잭션을 쓴다. `pool.begin()`으로 열고, 문장마다 `&mut *tx`를 실행 대상으로 넘기고, 끝에 `tx.commit().await`를 부른다. commit이나 rollback을 부르지 않고 `tx`가 범위를 벗어나면 rollback이 불린다[^8].

```rust
async fn insert_pair(pool: &SqlitePool, a: (&str, &str), b: (&str, &str)) -> sqlx::Result<()> {
    let mut tx = pool.begin().await?;
    sqlx::query("INSERT INTO links (code, url) VALUES (?, ?)")
        .bind(a.0).bind(a.1).execute(&mut *tx).await?;
    sqlx::query("INSERT INTO links (code, url) VALUES (?, ?)")
        .bind(b.0).bind(b.1).execute(&mut *tx).await?;   // 여기서 실패하면
    tx.commit().await                                   // 여기에 오지 못하고 tx가 drop된다
}
```

둘째 INSERT가 UNIQUE 위반으로 실패하면 `?`가 함수를 빠져나간다. commit은 불리지 않고 `tx`가 drop되면서 첫째 INSERT도 되돌려진다. 실행해 보면 첫째 줄이 표에 남지 않았다. [물음표 연산자](/Hongs_Blog/studies/rust/error-propagation/)와 Drop이 맞물려 "실패하면 되돌린다"를 따로 적지 않아도 된다.

## 메모리 DB는 어디까지 보이나

테스트에서는 파일 없이 `sqlite::memory:`를 쓴다. 이 DB가 연결 사이에 공유되는지는 여는 방법에 달려 있다.

| 여는 방법 | 연결 둘이 같은 DB를 보나 | 근거 |
|---|---|---|
| SQLite에서 `:memory:`를 그냥 연다 | 아니다. 연결마다 따로 생긴다 | SQLite 문서[^9], 실행 확인 |
| `SqliteConnectOptions::new().in_memory(true)` (공유 캐시 끔) | 아니다 | 실행 확인 |
| `"sqlite::memory:"`를 한 번 파싱한 옵션(풀 포함) | 그렇다. sqlx가 이름 붙은 공유 캐시로 연다 | sqlx 0.9.0 소스[^10], 실행 확인 |

sqlx 0.9.0은 `sqlite::memory:`를 파싱할 때마다 `file:sqlx-in-memory-<번호>`라는 이름과 공유 캐시를 붙인다[^10]. 그래서 한 풀 안의 연결은 같은 DB를 보고, `connect("sqlite::memory:")`를 두 번 부른 두 풀은 서로 다른 DB를 본다.

함정이 하나 남는다. 공유 메모리 DB는 마지막 연결이 닫히면 사라진다[^9]. 실행해 보면 연결 둘을 다 닫고 새로 연 연결에서는 표가 없었다. 풀의 기본값은 최소 연결 0개, 쉬는 연결은 10분 뒤 닫기다[^11]. 오래 쉬는 테스트나 데모 서버에서 메모리 DB가 통째로 비는 일이 생길 수 있다. 테스트는 짧게 끝나니 대개 문제없고, 오래 떠 있는 프로그램이면 `min_connections(1)`을 주거나 파일 DB를 쓴다. 풀 크기가 1인 메모리 DB에서 `acquire`가 취소되면 연결이 버려질 수 있다는 경고도 문서에 있다[^1].

## 컴파일 시간 검사와 마이그레이션

`query!`와 `query_as!` 매크로는 빌드할 때 SQL을 실제 DB에 대 보고, 열 이름·타입·바인드 개수를 검사한다. 이를 위해 빌드할 때 환경 변수 `DATABASE_URL`이 있어야 한다[^2]. CI나 도커 빌드처럼 DB가 없는 곳에서는 미리 `cargo sqlx prepare`로 질의 정보를 떠서 `.sqlx` 폴더를 저장소에 넣고, 빌드 때는 `DATABASE_URL`을 비워 둔다[^2].

표 구조를 바꾸는 SQL 파일은 `<버전>_<설명>.sql` 이름으로 한 폴더에 둔다. 버전은 0보다 큰 정수이고, 형식이 맞지 않는 파일은 조용히 건너뛴다[^12]. 적용한 버전은 DB의 `_sqlx_migrations` 표에 기록되고, `run`은 아직 안 한 것만 적용한다[^13].

| 방법 | 언제 읽나 | 필요한 것 |
|---|---|---|
| `sqlx::migrate!()` | 빌드할 때 SQL 파일을 실행 파일 안에 박는다 | `Cargo.toml` 옆의 `./migrations` 폴더(기본값)[^14] |
| `Migrator::new(path).await` | 실행할 때 폴더를 읽는다 | 실행하는 곳에 그 폴더[^13] |

배포할 때는 `migrate!`가 편하다. 실행 파일 하나에 SQL이 다 들어가기 때문이다. 검증 코드는 빌드 환경에 폴더를 둘 수 없어 `Migrator::new`로 임시 폴더를 읽었다. 파일 두 개와 이름이 다른 `notes.txt`를 두면 마이그레이션은 2개로 잡혔고, 두 번 돌려도 기록은 `[1, 2]` 그대로였다.

## 활용

- **서비스 구조.** `main`에서 풀을 하나 만들어 axum 상태에 넣고, 핸들러는 `State<SqlitePool>`으로 받는다. 시작할 때 `migrate!().run(&pool)`을 먼저 돌린다. [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/), 캡스톤 [SQLite 저장소](/Hongs_Blog/studies/rust/capstone-2/).
- **풀 크기.** 기본 최대 연결 수는 10이다. 소스 주석은 실서비스라면 더 키우라고 적는다[^11]. 다만 DB 서버의 최대 연결 수(Postgres 기본 100)를 서비스 인스턴스 수로 나눠 넘지 않게 잡는다[^1]. 연결을 못 얻으면 `acquire_timeout`(기본 30초) 뒤 에러가 난다[^11].
- **DB 주소.** 접속 주소에는 비밀번호가 들어가므로 코드에 적지 않고 환경 변수로 받는다: [설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/).
- **흔한 실수.**
  - `format!`으로 SQL을 만들고 `AssertSqlSafe`로 감싸 컴파일 오류를 지운다. 오류는 지워져도 주입은 그대로다.
  - 트랜잭션 안에서 `&pool`에 실행한다. 그 문장은 트랜잭션 밖의 다른 연결에서 돌아 되돌려지지 않는다. 트랜잭션 안에서는 `&mut *tx`를 넘긴다.
  - 잠금을 쥔 채 `.await`한다. `std::sync::Mutex` 가드를 쥐고 DB를 기다리면 clippy의 `await_holding_lock`이 잡는다.
- **SQL 자체.** 제약(NOT NULL, UNIQUE, FOREIGN KEY)과 갱신이 제약을 어겼을 때 일어나는 일은 [PRIMARY KEY·UNIQUE·FOREIGN KEY 절](/Hongs_Blog/studies/database-design/sql-key-clauses/), [갱신 연산과 제약 위반](/Hongs_Blog/studies/database-design/update-constraint-violations/)에 있다. SQLite 연결에서 sqlx는 외래 키 검사를 기본으로 켠다[^15].

## 연결

- 선수: [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/), [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)
- SQL 문장: [SELECT-FROM-WHERE](/Hongs_Blog/studies/database-design/select-from-where/), [INSERT·DELETE·UPDATE](/Hongs_Blog/studies/database-design/sql-insert-delete-update/)
- 테스트에서 메모리 DB를 쓰는 법: [테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`sqlite::memory:`는 연결마다 따로라서 풀에서는 못 쓴다"</div>

sqlx에서는 틀린 말이다. SQLite만 놓고 보면 `:memory:`는 연결마다 따로 생긴다. 그래서 그럴듯해 보인다. 하지만 sqlx 0.9.0은 이 주소를 파싱할 때 이름 붙은 공유 캐시로 바꿔 열어서, 한 풀의 연결들은 같은 DB를 본다. 연결 두 개를 동시에 빌려 한쪽에서 넣고 다른 쪽에서 세어 보면 확인된다. 진짜 함정은 반대쪽이다. 마지막 연결이 닫히면 DB가 사라진다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 코드는 sqlx 0.9에서 컴파일되는가? 안 되면 왜이고, 어떻게 고치나? `let sql = format!("SELECT * FROM links WHERE code = '{code}'"); sqlx::query(sql).fetch_all(&pool).await?;`</summary>

**답:** 안 된다(E0277). `query`는 `SqlSafeStr`을 구현한 문자열만 받는데, 스스로 구현한 것은 `&'static str`뿐이다. `"SELECT * FROM links WHERE code = ?"`를 쓰고 `.bind(code)`로 값을 싣는다.<br>
**흔한 오답:** "`AssertSqlSafe(sql)`로 감싼다." 컴파일은 되지만 주입 구멍이 그대로 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 표 `links`에 `dup` 한 줄만 있다. `insert_pair(&pool, ("new1", "u"), ("dup", "u"))`를 부른 뒤 `SELECT COUNT(*) FROM links`는? `code`에는 UNIQUE가 걸려 있다.</summary>

**답:** 1.<br>
**이유:** 둘째 INSERT가 UNIQUE 위반으로 실패하고 `?`가 함수를 빠져나간다. `commit`은 불리지 않고 `tx`가 drop되며 rollback된다. 그래서 `new1`도 남지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 도커 빌드 안에서 `cargo build`를 하는데 DB가 없다. `query!`와 `sqlx::query` 중 어느 쪽이 그대로 빌드되나? 다른 쪽을 빌드되게 하려면?</summary>

**답:** `sqlx::query`(실행 시간 질의)는 그대로 빌드된다. `query!`는 빌드할 때 `DATABASE_URL`이 필요하다. 미리 `cargo sqlx prepare`로 `.sqlx` 폴더를 만들어 저장소에 넣고, 빌드 때 `DATABASE_URL`을 두지 않으면 된다.<br>
**흔한 오답:** "`query!`는 실행할 때 검사한다." 검사는 빌드 때 한다. 그래서 빌드 환경이 문제다.

</details>


[^1]: sqlx 0.9.0 문서, struct `Pool` — https://docs.rs/sqlx/latest/sqlx/struct.Pool.html (연결 하나는 여러 스레드가 동시에 못 쓴다, 복제는 참조 세기 손잡이라 싸다, Postgres 기본 100 연결, 크기 1인 메모리 SQLite에서 `acquire` 취소 시 연결이 버려질 수 있다)
[^2]: sqlx 0.9.0 문서, macro `query!` — https://docs.rs/sqlx/latest/sqlx/macro.query.html (빌드 때 `DATABASE_URL` 필요, `cargo sqlx prepare`와 `.sqlx` 폴더, SQLite·MySQL은 `?`를 순서대로 채운다)
[^3]: sqlx 0.9.0 문서, fn `query` — https://docs.rs/sqlx/latest/sqlx/fn.query.html (`format!` 예는 SQL 주입 취약점이고 아포스트로피가 든 입력에서도 깨진다, 바인드 값은 문장과 따로 가서 문법에 영향을 주지 않는다, 늘 준비된 문장을 쓴다, Postgres와 SQLite는 번호 붙은 자리 `$1`, `$2`를 쓰고 값 하나를 여러 자리에서 다시 쓸 수 있다)
[^4]: sqlx 0.9.0 문서, trait `SqlSafeStr` — https://docs.rs/sqlx/latest/sqlx/trait.SqlSafeStr.html (기본으로 구현한 것은 `&'static str`뿐, 그 밖의 문자열은 `AssertSqlSafe`, `format!`에 대한 과속 방지턱)
[^5]: sqlx 0.9.0 문서, struct `QueryBuilder` — https://docs.rs/sqlx/latest/sqlx/struct.QueryBuilder.html (실행 중에 질의를 만든다, `push_bind`, `push`는 거르지 않으니 믿을 수 없는 입력에 쓰지 않는다)
[^6]: sqlx 0.9.0 문서, trait `FromRow` — https://docs.rs/sqlx/latest/sqlx/trait.FromRow.html (derive, 필드 이름을 열 이름으로 그대로 쓴다, `rename`·`default`·`skip`·`try_from`·`flatten`)
[^7]: sqlx 0.9.0 문서, 크레이트 첫 쪽 — https://docs.rs/sqlx/latest/sqlx/ (`query`, `query_as`, `query_scalar`의 차이, `migrate!`는 정적 `Migrator`로 펼쳐진다)
[^8]: sqlx 0.9.0 문서, struct `Transaction` — https://docs.rs/sqlx/latest/sqlx/struct.Transaction.html (commit·rollback 없이 범위를 벗어나면 rollback, 둘 다 `self`를 받는다)
[^9]: SQLite, In-Memory Databases — https://www.sqlite.org/inmemorydb.html (`:memory:` 연결 둘은 서로 다른 DB, URI와 `cache=shared`로 공유, 마지막 연결이 닫히면 지워진다)
[^10]: sqlx-sqlite 0.9.0 소스, `src/options/parse.rs`의 `from_db_and_params` (`:memory:`이면 `in_memory`와 `shared_cache`를 켜고 이름을 `file:sqlx-in-memory-{seqno}`로 정한다). cargo 레지스트리에 받은 소스를 읽었다. 문서 쪽 `SqliteConnectOptions` — https://docs.rs/sqlx/latest/sqlx/sqlite/struct.SqliteConnectOptions.html 은 `shared_cache`의 기본값을 "꺼짐"으로만 적는다.
[^11]: sqlx-core 0.9.0 소스, `src/pool/options.rs`의 `PoolOptions::new()` (`max_connections: 10`, `min_connections: 0`, `acquire_timeout` 30초, `idle_timeout` 10분, `max_lifetime` 30분). 문서 쪽 `Pool`도 기본값은 `PoolOptions::new()`에 있다고 적는다.
[^12]: sqlx 0.9.0 문서, trait `MigrationSource` — https://docs.rs/sqlx/latest/sqlx/migrate/trait.MigrationSource.html (`<VERSION>_<DESCRIPTION>.sql`, 버전은 0보다 큰 `i64`, 형식이 다른 파일은 조용히 무시)
[^13]: sqlx 0.9.0 문서, struct `Migrator` — https://docs.rs/sqlx/latest/sqlx/migrate/struct.Migrator.html (`new`로 원본에서 읽는다, `run`은 남은 것을 적용하고 적용한 것이 바뀌었는지 본다, 기록 표 기본 이름 `_sqlx_migrations`)
[^14]: sqlx 0.9.0 문서, macro `migrate!` — https://docs.rs/sqlx/latest/sqlx/macro.migrate.html (기본 폴더 `./migrations`, `Cargo.toml`이 있는 폴더 기준, 실행 파일에 박는다)
[^15]: sqlx 0.9.0 문서, struct `SqliteConnectOptions` — https://docs.rs/sqlx/latest/sqlx/sqlite/struct.SqliteConnectOptions.html (`foreign_keys` 기본 켜짐, `create_if_missing` 기본 꺼짐)
{% endraw %}
