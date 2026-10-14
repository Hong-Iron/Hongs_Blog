---
layout: "note"
title: "43_tracing-observability_verify.rs"
display_title: "43_tracing-observability_verify.rs"
kind: "code"
kind_label: "코드 · 검증"
num: "43"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/rust/tracing-observability/"
parent_title: "tracing으로 관측하기"
description: "Rust · tracing으로 관측하기 검증 코드"
sitemap: false
permalink: "/studies/rust/code/43_tracing-observability_verify/"
---
{% raw %}
[tracing으로 관측하기](/Hongs_Blog/studies/rust/tracing-observability/) 문서의 검증 코드다.

```rust
//! tracing의 span·event, #[instrument], 필드(%·?), EnvFilter 지시문, JSON 출력, 요청 ID를
//! 직접 만든 MakeWriter로 출력을 붙잡아 JSON 필드로 확인한다. 지시문 오타, 크레이트 이름의 - 와 _ 차이,
//! skip을 잊었을 때 새는 인자, span이 닫힐 때 찍히는 걸린 시간(FmtSpan::CLOSE)도 본다.
//! 의존성: tracing = "0.1", tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] },
//!         tokio = { version = "1", features = ["full"] }, serde_json = "1", futures = "0.3"
//! 실행: python3 "_시스템/Rust 계획/rs_check.py" "Rust/3.개념집/43_tracing-observability_verify.rs"

use std::io;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};

use serde_json::Value;
use tracing::{Instrument, info, info_span, instrument, warn};
use tracing_subscriber::EnvFilter;
use tracing_subscriber::fmt::MakeWriter;

/// 로그를 메모리에 모으는 writer. fmt 레이어는 이벤트마다 make_writer를 부른다.
#[derive(Clone, Default)]
struct Capture(Arc<Mutex<Vec<u8>>>);

struct CaptureWriter(Arc<Mutex<Vec<u8>>>);

impl io::Write for CaptureWriter {
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.0.lock().expect("lock").extend_from_slice(buf);
        Ok(buf.len())
    }
    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}

impl<'a> MakeWriter<'a> for Capture {
    type Writer = CaptureWriter;
    fn make_writer(&'a self) -> Self::Writer {
        CaptureWriter(self.0.clone())
    }
}

impl Capture {
    /// 모인 출력을 한 줄에 JSON 객체 하나로 읽는다.
    fn lines(&self) -> Vec<Value> {
        let bytes = self.0.lock().expect("lock").clone();
        String::from_utf8(bytes)
            .expect("utf8")
            .lines()
            .map(|l| serde_json::from_str(l).expect("JSON 한 줄"))
            .collect()
    }
}

mod db {
    use tracing::debug;
    pub fn query(sql: &str) -> usize {
        debug!(sql, "running query"); // target은 이 모듈 경로가 된다
        sql.len()
    }
}

/// 비밀번호는 skip으로 span 필드에서 뺀다. user는 Display(%)로 남긴다.
#[instrument(skip(password), fields(user = %user))]
fn login(user: &str, password: &str) -> bool {
    let ok = password.len() >= 8;
    if ok {
        info!(attempts = 1, "login ok");
    } else {
        warn!(reason = ?("too short", password.len()), "login rejected");
    }
    ok
}

/// skip을 잊은 판: 인자가 모두 span 필드가 된다.
#[instrument]
fn login_leaky(user: &str, password: &str) -> bool {
    info!("login attempt");
    password.len() >= 8 && !user.is_empty()
}

static NEXT_ID: AtomicU64 = AtomicU64::new(1);

/// 요청 하나를 흉내 낸다. 요청 ID를 span 필드에 넣고 퓨처에 instrument로 붙인다.
async fn handle(path: &'static str) {
    info!(path, "start");
    tokio::task::yield_now().await; // 다른 요청과 번갈아 돈다
    db::query("SELECT 1");
    info!(path, "done");
}

fn request(path: &'static str) -> impl Future<Output = ()> {
    let id = NEXT_ID.fetch_add(1, Ordering::Relaxed);
    handle(path).instrument(info_span!("request", request_id = id))
}

/// 틀린 판: span guard를 .await 너머로 쥔다. 멈춘 사이 다른 요청이 돌면 이름표가 섞인다.
async fn request_entered(path: &'static str) {
    let id = NEXT_ID.fetch_add(1, Ordering::Relaxed);
    let _g = info_span!("request", request_id = id).entered();
    handle(path).await;
}

/// 요청 이벤트를 ("메시지 경로", request_id) 목록으로 줄인다.
fn request_events(lines: &[Value]) -> Vec<(String, u64)> {
    lines
        .iter()
        .filter(|l| l["span"]["name"] == "request")
        .map(|l| {
            let path = l["fields"]["path"].as_str().unwrap_or("").to_string();
            (
                format!("{} {}", msg(l), path),
                l["span"]["request_id"].as_u64().unwrap_or(0),
            )
        })
        .collect()
}

/// filter를 건 JSON 구독자 아래에서 body를 돌리고, 찍힌 줄을 JSON으로 돌려준다.
fn capture_with(filter: &str, body: impl FnOnce()) -> Vec<Value> {
    let cap = Capture::default();
    let subscriber = tracing_subscriber::fmt()
        .json()
        .with_writer(cap.clone())
        .with_env_filter(EnvFilter::new(filter))
        .finish();
    tracing::subscriber::with_default(subscriber, body);
    cap.lines()
}

/// span이 닫힐 때 이벤트를 하나 더 찍게 한다(FmtSpan::CLOSE). 걸린 시간이 필드로 붙는다.
fn capture_close(body: impl FnOnce()) -> Vec<Value> {
    let cap = Capture::default();
    let subscriber = tracing_subscriber::fmt()
        .json()
        .with_writer(cap.clone())
        .with_span_events(tracing_subscriber::fmt::format::FmtSpan::CLOSE)
        .finish();
    tracing::subscriber::with_default(subscriber, body);
    cap.lines()
}

fn run_scenario(filter: &str) -> Vec<Value> {
    capture_with(filter, || {
        login("alice", "hunter2hunter2");
        login("bob", "pw");
        let rt = tokio::runtime::Builder::new_current_thread()
            .build()
            .expect("runtime");
        rt.block_on(async {
            tokio::join!(request("/a"), request("/b"));
        });
    })
}

fn msg(v: &Value) -> &str {
    v["fields"]["message"].as_str().unwrap_or("")
}

fn main() {
    let mut ok = true;
    let mut check = |cond: bool, what: String| {
        println!("[{}] {what}", if cond { "ok" } else { "FAIL" });
        ok &= cond;
    };

    // 1. info 수준만: db의 debug 이벤트는 걸러진다.
    let lines = run_scenario("info");
    println!(
        "--- 첫 줄 원문 ---\n{}\n---",
        serde_json::to_string(&lines[0]).expect("json")
    );
    let first = &lines[0];
    check(
        first["level"] == "INFO" && msg(first) == "login ok" && first["fields"]["attempts"] == 1,
        "이벤트: level·fields.message·fields.attempts".into(),
    );
    check(
        first["span"]["name"] == "login" && first["span"]["user"] == "alice",
        format!("현재 span: {}", first["span"]),
    );
    check(
        first["span"].get("password").is_none()
            && !serde_json::to_string(&lines)
                .expect("json")
                .contains("hunter2"),
        "skip(password): 비밀번호가 어디에도 없다".into(),
    );
    let second = &lines[1];
    check(
        second["level"] == "WARN" && second["fields"]["reason"] == "(\"too short\", 2)",
        format!("? 는 Debug로 기록: reason = {}", second["fields"]["reason"]),
    );
    check(
        first["target"]
            .as_str()
            .unwrap_or("")
            .ends_with("43_tracing_observability_verify"),
        format!("target = {}", first["target"]),
    );
    check(
        !lines.iter().any(|l| msg(l) == "running query"),
        "info 필터: debug 이벤트 없음".into(),
    );

    // 2. 요청 ID: 두 요청이 번갈아 돌아도 각 이벤트는 자기 요청의 span을 단다.
    let reqs = request_events(&lines);
    println!("요청 이벤트 순서: {reqs:?}");
    let interleaved =
        reqs.len() == 4 && reqs[0].0.starts_with("start") && reqs[1].0.starts_with("start");
    check(
        interleaved,
        "두 요청의 start가 done보다 먼저 모두 찍혔다(번갈아 실행)".into(),
    );
    let consistent = reqs.iter().all(|(m, id)| {
        let same_path = reqs
            .iter()
            .filter(|(_, j)| j == id)
            .all(|(n, _)| n.split(' ').nth(1) == m.split(' ').nth(1));
        same_path && *id > 0
    });
    let distinct = reqs[0].1 != reqs[1].1;
    check(
        consistent && distinct,
        "같은 요청 ID의 이벤트는 모두 같은 경로를 단다".into(),
    );

    // 2-1. 틀린 판: entered() guard를 .await 너머로 쥔다. 맞게 나오는지는 다시 poll하는 순서에 달렸다.
    let run_entered = |use_futures_join: bool| {
        let lines = capture_with("info", || {
            let rt = tokio::runtime::Builder::new_current_thread()
                .build()
                .expect("runtime");
            rt.block_on(async {
                if use_futures_join {
                    futures::join!(request_entered("/a"), request_entered("/b"));
                } else {
                    tokio::join!(request_entered("/a"), request_entered("/b"));
                }
            });
        });
        request_events(&lines)
    };
    let mixed_ok = |evs: &[(String, u64)]| {
        evs.iter().all(|(m, id)| {
            evs.iter()
                .filter(|(n, _)| n.split(' ').nth(1) == m.split(' ').nth(1))
                .all(|(_, j)| j == id)
        })
    };
    let lucky = run_entered(false);
    let unlucky = run_entered(true);
    println!("guard를 쥔 판, tokio::join!: {lucky:?}");
    println!("guard를 쥔 판, futures::join!: {unlucky:?}");
    check(
        mixed_ok(&lucky) && !mixed_ok(&unlucky),
        "guard를 .await 너머로 쥐면 다시 poll하는 순서에 따라 /a의 줄에 /b의 ID가 붙는다".into(),
    );

    // 3. 지시문으로 한 모듈만 자세히: db 모듈만 debug.
    let lines = run_scenario("info,r_43_tracing_observability_verify::db=debug");
    let q: Vec<&Value> = lines.iter().filter(|l| msg(l) == "running query").collect();
    check(
        q.len() == 2 && q[0]["fields"]["sql"] == "SELECT 1" && q[0]["level"] == "DEBUG",
        format!("db=debug 지시문: 쿼리 이벤트 {}개", q.len()),
    );
    check(
        q[0]["spans"].as_array().map(|a| a.len()) == Some(1)
            && q[0]["spans"][0]["name"] == "request",
        "spans 목록에 바깥 request span".into(),
    );

    // 4. warn으로 올리면 info 이벤트가 사라진다.
    let lines = run_scenario("warn");
    check(
        lines.len() == 1 && msg(&lines[0]) == "login rejected",
        format!("warn 필터: {}줄", lines.len()),
    );

    // 5. 잘못된 지시문: try_new는 오류, new는 그 지시문만 버리고(표준 에러에 경고) 나머지로 돈다.
    check(
        EnvFilter::try_new("info,=bogus=level").is_err(),
        "잘못된 지시문은 try_new가 Err".into(),
    );
    let typo = "info,r_43_tracing_observability_verify::db=debgu";
    let err = EnvFilter::try_new(typo)
        .map(|_| String::new())
        .unwrap_or_else(|e| e.to_string());
    println!("try_new 오류: {err}");
    let lossy = EnvFilter::new(typo).to_string();
    check(
        err.starts_with("error parsing level filter") && lossy == "info",
        format!("오타 debgu: try_new는 Err, new는 남은 지시문 {lossy:?}"),
    );
    let lines = run_scenario(typo);
    check(
        !lines.iter().any(|l| msg(l) == "running query"),
        "오타 난 db=debgu는 버려져 debug 쿼리 이벤트가 안 나온다".into(),
    );

    // 6. 지시문의 target은 모듈 경로 글자 그대로. 크레이트 이름의 '-'는 target에서 '_'다.
    let emit = || info!(target: "my_crate::api", "hello");
    let dash = capture_with("warn,my-crate=info", emit).len();
    let underscore = capture_with("warn,my_crate=info", emit).len();
    check(
        dash == 0 && underscore == 1,
        format!("my-crate=info -> {dash}줄, my_crate=info -> {underscore}줄"),
    );

    // 7. skip을 빼면 비밀번호가 span 필드로 그대로 찍힌다.
    let leaky = capture_with("info", || {
        login_leaky("carol", "s3cret-pass");
    });
    check(
        leaky[0]["span"]["password"] == "s3cret-pass",
        format!("skip 없는 #[instrument]: span = {}", leaky[0]["span"]),
    );

    // 8. FmtSpan::CLOSE: span이 닫힐 때 time.busy(들어가 있던 시간)와 time.idle(기다린 시간)이 찍힌다.
    let closed = capture_close(|| {
        let rt = tokio::runtime::Builder::new_current_thread()
            .enable_time()
            .build()
            .expect("runtime");
        rt.block_on(
            async { tokio::time::sleep(std::time::Duration::from_millis(30)).await }
                .instrument(info_span!("slow_call")),
        );
    });
    let close = closed.iter().find(|l| msg(l) == "close");
    if let Some(c) = close {
        println!("    닫힘 이벤트 fields = {}", c["fields"]);
    }
    let idle_ms = close
        .and_then(|c| c["fields"]["time.idle"].as_str())
        .and_then(|s| s.strip_suffix("ms"))
        .and_then(|s| s.parse::<f64>().ok())
        .unwrap_or(0.0);
    check(
        close.is_some_and(|c| c["fields"].get("time.busy").is_some()) && idle_ms >= 25.0,
        format!("CLOSE 이벤트: time.idle ≈ {idle_ms:.0}ms (잠든 30ms가 idle로 잡힌다)"),
    );

    assert!(ok);
    println!("ALL CHECKS PASSED");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn password_never_logged() {
        let all = serde_json::to_string(&run_scenario("trace")).unwrap();
        assert!(!all.contains("hunter2"));
        assert!(all.contains("alice"));
    }
}
```
{% endraw %}
