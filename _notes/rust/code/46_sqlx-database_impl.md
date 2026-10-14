---
layout: "note"
title: "46_sqlx-database_impl.rs"
display_title: "46_sqlx-database_impl.rs"
kind: "code"
kind_label: "코드 · 구현"
num: "46"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/sqlx-database/"
parent_title: "sqlx로 데이터베이스 쓰기"
description: "Rust · sqlx로 데이터베이스 쓰기 구현 코드"
permalink: "/studies/rust/code/46_sqlx-database_impl/"
---
{% raw %}
[sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/) 문서의 구현 코드다.

```rust
//! sqlx 0.9 + SQLite로 풀, 바인드, FromRow, 트랜잭션, 마이그레이션을 확인한다.
//! 의존성: sqlx = { version = "0.9", default-features = false, features = ["runtime-tokio", "sqlite", "macros", "migrate"] }, tokio = { version = "1", features = ["full"] }
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/46_sqlx-database_impl.rs"
//!
//! 컴파일 시간 검사 매크로(`query!`)와 `migrate!`는 쓰지 않는다. 둘 다 빌드할 때
//! DATABASE_URL이나 migrations 폴더가 필요하기 때문이다. 여기서는 실행 시간 질의만 쓴다.

use std::str::FromStr;

use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};
use sqlx::{AssertSqlSafe, Connection, FromRow, SqliteConnection};

#[derive(Debug, Clone, PartialEq, FromRow)]
struct Link {
    id: i64,
    code: String,
    url: String,
    hits: i64,
}

const SCHEMA: &str = "CREATE TABLE links (
    id   INTEGER PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    url  TEXT NOT NULL,
    hits INTEGER NOT NULL DEFAULT 0
)";

/// 풀 하나를 만든다. "sqlite::memory:"를 한 번 파싱한 옵션이므로 풀 안의 연결은 같은 DB를 본다.
async fn new_pool() -> sqlx::Result<SqlitePool> {
    let pool = SqlitePoolOptions::new()
        .max_connections(4)
        .connect("sqlite::memory:")
        .await?;
    sqlx::query(SCHEMA).execute(&pool).await?;
    Ok(pool)
}

/// 바인드로 넣는다. 값은 SQL 문장과 따로 간다.
async fn insert(pool: &SqlitePool, code: &str, url: &str) -> sqlx::Result<i64> {
    let res = sqlx::query("INSERT INTO links (code, url) VALUES (?, ?)")
        .bind(code)
        .bind(url)
        .execute(pool)
        .await?;
    Ok(res.last_insert_rowid())
}

async fn find(pool: &SqlitePool, code: &str) -> sqlx::Result<Option<Link>> {
    sqlx::query_as::<_, Link>("SELECT id, code, url, hits FROM links WHERE code = ?")
        .bind(code)
        .fetch_optional(pool)
        .await
}

/// 나쁜 예: 사용자 입력을 SQL 문장에 이어 붙인다. sqlx 0.9는 String을 그냥 받지 않으므로
/// AssertSqlSafe로 감싸야 컴파일된다. 감싼 순간 책임은 쓴 사람에게 넘어온다.
async fn count_by_code_unsafe(pool: &SqlitePool, code: &str) -> sqlx::Result<i64> {
    let sql = format!("SELECT COUNT(*) FROM links WHERE code = '{code}'");
    sqlx::query_scalar(AssertSqlSafe(sql)).fetch_one(pool).await
}

async fn count_by_code(pool: &SqlitePool, code: &str) -> sqlx::Result<i64> {
    sqlx::query_scalar("SELECT COUNT(*) FROM links WHERE code = ?")
        .bind(code)
        .fetch_one(pool)
        .await
}

async fn total(pool: &SqlitePool) -> sqlx::Result<i64> {
    sqlx::query_scalar("SELECT COUNT(*) FROM links")
        .fetch_one(pool)
        .await
}

/// 두 줄을 한 트랜잭션으로 넣는다. 중간에 `?`로 빠져나가면 commit이 불리지 않는다.
async fn insert_pair(pool: &SqlitePool, a: (&str, &str), b: (&str, &str)) -> sqlx::Result<()> {
    let mut tx = pool.begin().await?;
    sqlx::query("INSERT INTO links (code, url) VALUES (?, ?)")
        .bind(a.0)
        .bind(a.1)
        .execute(&mut *tx)
        .await?;
    sqlx::query("INSERT INTO links (code, url) VALUES (?, ?)")
        .bind(b.0)
        .bind(b.1)
        .execute(&mut *tx)
        .await?;
    tx.commit().await
}

async fn check_pool_and_crud() -> sqlx::Result<()> {
    let pool = new_pool().await?;
    let id = insert(&pool, "abc", "https://example.com").await?;
    assert_eq!(id, 1);
    let got = find(&pool, "abc").await?.expect("방금 넣은 줄");
    assert_eq!(
        got,
        Link {
            id: 1,
            code: "abc".into(),
            url: "https://example.com".into(),
            hits: 0
        }
    );
    assert!(find(&pool, "zzz").await?.is_none());

    // UNIQUE 위반은 Database 에러로 오고, 종류를 물어볼 수 있다.
    let err = insert(&pool, "abc", "https://other.example")
        .await
        .unwrap_err();
    let db_err = err.as_database_error().expect("DB 에러");
    assert!(db_err.is_unique_violation());
    println!("UNIQUE 위반 메시지: {}", db_err.message());

    // 풀에서 연결 두 개를 동시에 빌려도 같은 DB를 본다(sqlx가 이름 붙은 공유 캐시로 연다).
    let mut c1 = pool.acquire().await?;
    let mut c2 = pool.acquire().await?;
    sqlx::query("INSERT INTO links (code, url) VALUES ('c1', 'u')")
        .execute(&mut *c1)
        .await?;
    let n: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM links")
        .fetch_one(&mut *c2)
        .await?;
    assert_eq!(n, 2);
    drop((c1, c2));
    println!("풀 크기 {} (최대 4)", pool.size());
    pool.close().await;
    Ok(())
}

async fn check_injection() -> sqlx::Result<()> {
    let pool = new_pool().await?;
    insert(&pool, "a", "https://a.example").await?;
    insert(&pool, "b", "https://b.example").await?;
    insert(&pool, "c", "https://c.example").await?;
    let evil = "x' OR '1'='1";
    let bad = count_by_code_unsafe(&pool, evil).await?;
    let good = count_by_code(&pool, evil).await?;
    println!("주입 문자열 {evil:?}: 이어 붙이기 {bad}줄, 바인드 {good}줄");
    assert_eq!(bad, 3);
    assert_eq!(good, 0);

    // 정상 입력도 이어 붙이기는 깨진다: 작은따옴표가 든 코드.
    let quote = "it's";
    assert!(count_by_code_unsafe(&pool, quote).await.is_err());
    assert_eq!(count_by_code(&pool, quote).await?, 0);

    // 세미콜론 뒤에 두 번째 문장을 붙이면 SQLite 드라이버는 문장을 차례로 모두 실행한다.
    // 이어 붙인 문자열을 execute로 보내면 DELETE까지 돈다(sqlx 0.9.0 + SQLite에서 확인).
    let drop_attempt = "a'; DELETE FROM links; --";
    let sql = format!("UPDATE links SET hits = hits WHERE code = '{drop_attempt}'");
    let res = sqlx::query(AssertSqlSafe(sql)).execute(&pool).await?;
    println!(
        "두 문장 주입: 바뀐 줄 {}, 남은 줄 {}",
        res.rows_affected(),
        total(&pool).await?
    );
    assert_eq!(total(&pool).await?, 0, "DELETE가 실행됐다");
    // 같은 입력을 바인드로 보내면 그냥 없는 코드일 뿐이다.
    insert(&pool, "a", "u").await?;
    sqlx::query("UPDATE links SET hits = hits WHERE code = ?")
        .bind(drop_attempt)
        .execute(&pool)
        .await?;
    assert_eq!(total(&pool).await?, 1);
    Ok(())
}

async fn check_transactions() -> sqlx::Result<()> {
    let pool = new_pool().await?;

    // 1) commit 없이 버리면 되돌린다.
    {
        let mut tx = pool.begin().await?;
        sqlx::query("INSERT INTO links (code, url) VALUES ('t1', 'u')")
            .execute(&mut *tx)
            .await?;
        let inside: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM links")
            .fetch_one(&mut *tx)
            .await?;
        assert_eq!(inside, 1);
    } // tx가 여기서 drop된다.
    assert_eq!(total(&pool).await?, 0, "drop하면 rollback");

    // 2) 둘째 INSERT가 UNIQUE로 실패하면 첫째도 남지 않는다.
    insert(&pool, "dup", "u").await?;
    let r = insert_pair(&pool, ("new1", "u"), ("dup", "u")).await;
    assert!(r.is_err());
    assert!(find(&pool, "new1").await?.is_none(), "첫째 줄도 되돌려졌다");

    // 3) 둘 다 성공하면 commit된다.
    insert_pair(&pool, ("p1", "u"), ("p2", "u")).await?;
    assert_eq!(total(&pool).await?, 3);
    Ok(())
}

async fn check_memory_scope() -> sqlx::Result<()> {
    // in_memory(true)만 켜고 공유 캐시를 끄면 연결마다 따로 DB가 생긴다.
    let private = SqliteConnectOptions::new().in_memory(true);
    let mut a = SqliteConnection::connect_with(&private).await?;
    let mut b = SqliteConnection::connect_with(&private).await?;
    sqlx::query("CREATE TABLE t (x INTEGER)")
        .execute(&mut a)
        .await?;
    let seen_by_b = sqlx::query("SELECT * FROM t").execute(&mut b).await;
    assert!(seen_by_b.is_err(), "b는 a의 표를 못 본다");

    // "sqlite::memory:"를 한 번 파싱한 옵션은 공유 캐시라 서로 본다.
    let shared = SqliteConnectOptions::from_str("sqlite::memory:")?;
    let mut c = SqliteConnection::connect_with(&shared).await?;
    let mut d = SqliteConnection::connect_with(&shared).await?;
    sqlx::query("CREATE TABLE t (x INTEGER)")
        .execute(&mut c)
        .await?;
    sqlx::query("SELECT * FROM t").execute(&mut d).await?;

    // 마지막 연결이 닫히면 메모리 DB는 사라진다.
    c.close().await?;
    d.close().await?;
    let mut e = SqliteConnection::connect_with(&shared).await?;
    let after_close = sqlx::query("SELECT * FROM t").execute(&mut e).await;
    assert!(after_close.is_err(), "모든 연결이 닫히면 표도 사라진다");
    println!("메모리 DB: 비공유는 연결마다 따로, 공유도 마지막 연결이 닫히면 사라짐");
    Ok(())
}

async fn check_migrations() -> Result<(), Box<dyn std::error::Error>> {
    let dir = std::env::temp_dir().join(format!("vr_mig_{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir)?;
    std::fs::write(dir.join("1_create_links.sql"), format!("{SCHEMA};"))?;
    std::fs::write(
        dir.join("2_add_created.sql"),
        "ALTER TABLE links ADD COLUMN created_at TEXT;",
    )?;
    std::fs::write(dir.join("notes.txt"), "이 파일은 이름 형식이 달라 무시된다")?;

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await?;
    let migrator = sqlx::migrate::Migrator::new(dir.as_path()).await?;
    assert_eq!(migrator.iter().count(), 2);
    migrator.run(&pool).await?;
    migrator.run(&pool).await?; // 두 번 돌려도 이미 한 것은 건너뛴다
    let applied: Vec<i64> =
        sqlx::query_scalar("SELECT version FROM _sqlx_migrations ORDER BY version")
            .fetch_all(&pool)
            .await?;
    assert_eq!(applied, vec![1, 2]);
    sqlx::query("INSERT INTO links (code, url, created_at) VALUES ('m', 'u', 'now')")
        .execute(&pool)
        .await?;
    println!("마이그레이션 적용 버전: {applied:?}");
    std::fs::remove_dir_all(&dir)?;
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    check_pool_and_crud().await?;
    check_injection().await?;
    check_transactions().await?;
    check_memory_scope().await?;
    check_migrations().await?;
    println!("ALL CHECKS PASSED");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn bind_treats_input_as_value() {
        let pool = new_pool().await.unwrap();
        insert(&pool, "a", "u").await.unwrap();
        assert_eq!(count_by_code(&pool, "a' OR '1'='1").await.unwrap(), 0);
        assert_eq!(count_by_code(&pool, "a").await.unwrap(), 1);
    }
}
```
{% endraw %}
