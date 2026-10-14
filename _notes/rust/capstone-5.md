---
layout: "note"
title: "캡스톤 5 안전한 종료와 부하 조절"
display_title: "캡스톤 5 안전한 종료와 부하 조절"
kind: "practice"
kind_label: "연습"
num: "46"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "4단계 서비스는 평소에는 잘 돈다. 이 단계는 평소가 아닐 때를 다룬다. 서버를 내릴 때, 요청이 한꺼번에 몰릴 때, DB가 느려질 때, 누가 큰 본문을 보낼 때다."
prev_url: "/studies/rust/capstone-4/"
prev_title: "캡스톤 4 관측성과 설정"
next_url: "/studies/rust/release-readiness-practice/"
next_title: "배포 준비 연습"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/capstone-5/"
---
{% raw %}
## 목표

4단계 서비스는 평소에는 잘 돈다. 이 단계는 평소가 아닐 때를 다룬다. 서버를 내릴 때, 요청이 한꺼번에 몰릴 때, DB가 느려질 때, 누가 큰 본문을 보낼 때다.

- `start()`: 서버와 백그라운드 통계 태스크를 같은 취소 토큰(`CancellationToken`)과 태스크 추적기(`TaskTracker`) 아래에 띄운다.
- `Running::shutdown(grace)`: 새 연결을 그만 받고, 처리 중인 요청과 태스크가 끝나기를 최대 `grace`만큼 기다린다.
- `shutdown_signal()`: Ctrl+C와 SIGTERM을 둘 다 기다린다.
- 레이어 세 개: 요청 시간 제한(넘으면 503), 서버 전체의 동시 처리 상한, 모든 요청에 걸리는 본문 크기 상한(413).
- `/health`는 DB에 묻지 않고 통계 태스크가 센 링크 수를 돌려준다.

이 단계가 없으면 이런 일이 생긴다. 4단계 서버는 Ctrl+C만 기다린다. `docker stop`은 먼저 SIGTERM을 보내고, 10초 안에 안 끝나면 SIGKILL로 죽인다[^1]. 4단계 서버는 SIGTERM을 듣지 않으므로 처리 중이던 요청은 마무리할 기회 없이 끊긴다. DB가 멈추면 요청이 끝없이 쌓이고, 요청마다 쥔 메모리와 연결이 풀리지 않는다. axum의 기본 본문 상한은 `Json` 같은 추출기에만 걸려서, 본문을 직접 읽는 핸들러가 하나 생기면 거기로는 상한 없이 들어온다[^8].

## 사용 개념

- [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/): 신호 받기 → 알리기 → 기다리기.
- [취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/): `select!`로 취소와 틱 중 먼저 오는 것을 고른다. 시간 제한은 퓨처를 버리는 취소다.
- [백프레셔와 큐 제한](/Hongs_Blog/studies/rust/backpressure/): 동시 처리 상한과 줄 세우기.
- [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/): 태스크 띄우기와 기다리기.
- [원자적 연산과 메모리 순서](/Hongs_Blog/studies/rust/atomics-memory-ordering/): 통계 값 하나를 `AtomicU64`로 나눈다.
- [sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/): 풀에서 연결을 꺼내는 도중에 취소되면 무슨 일이 생기는가.

## 설계 결정

| 결정 | 고른 것 | 까닭과 다른 길 |
|---|---|---|
| 종료 순서 | 신호 → 토큰 취소 → 트래커 닫기 → 기다리기 | tokio 문서가 말하는 세 단계 그대로다: 언제 끝낼지 정하고, 태스크에 알리고, 끝나기를 기다린다[^2] |
| 알리기 | `CancellationToken`, 통계 태스크에는 `child_token()` | 부모를 취소하면 자식도 취소되고, 자식을 취소해도 부모는 그대로다[^3]. 통계 태스크만 따로 멈출 일이 생겨도 서버는 안 멈춘다. `watch` 채널로도 같은 일을 할 수 있지만 "취소됨" 하나만 알리면 되므로 토큰이 짧다 |
| 기다리기 | `TaskTracker` | `JoinSet`은 끝난 태스크의 반환값을 `join_next`로 꺼낼 때까지 쥐고 있고, `TaskTracker`는 끝난 태스크를 바로 지운다. `wait()`는 트래커가 닫히고 비었을 때만 끝난다[^4] |
| 유예 시간 | 10초, 넘기면 경고 후 종료 코드 1 | 끝없이 기다리면 배포가 멈춘다. 숫자는 `docker stop`의 기본 유예(10초)에 맞닿아 있어서 변형 2에서 다시 따진다 |
| 시간 제한 | tower-http `TimeoutLayer::with_status_code(503, …)` | `TimeoutLayer::new`는 0.6.7부터 폐기 예정이고 기본 응답은 408이다[^5]. 408은 "클라이언트가 요청을 늦게 보냈다"는 뜻이라 서버가 느린 상황과 맞지 않는다. tower의 `timeout`은 응답 대신 에러를 내서 `HandleErrorLayer`로 응답을 따로 만들어야 한다[^17] |
| 동시 처리 상한 | `GlobalConcurrencyLimitLayer`, 넘치면 줄 세움 | 세마포어 하나를 모든 복제가 나눠 쓴다. `ConcurrencyLimitLayer`는 감싸는 서비스마다 상한을 새로 만든다[^6]. 변형 1에서 차이를 잰다. 넘칠 때 바로 거절하려면 `load_shed`를 쓴다[^7] |
| 본문 상한 | `DefaultBodyLimit::disable()` + `RequestBodyLimitLayer` | `DefaultBodyLimit`은 그것을 지키는 추출기에만 걸리고, `RequestBodyLimit`은 어떤 방법으로 읽든 모든 요청에 걸린다. axum 문서가 이 짝을 예로 든다[^8] |
| 레이어 순서 | 추적 → 시간 제한 → 동시 처리 상한 → 본문 상한 | `ServiceBuilder`에서는 먼저 쓴 레이어가 요청을 먼저 받는다[^9]. 추적을 맨 바깥에 두어야 503·413 응답도 요청 로그에 남는다 |
| 통계 태스크 | `interval` + `MissedTickBehavior::Delay` | 첫 틱은 바로 끝나고, 기본값 `Burst`는 늦어진 틱을 몰아서 친다[^10]. `Delay`는 늦게 친 시점부터 다시 간격을 잰다[^11]. DB가 잠깐 멈췄다 풀릴 때 `COUNT(*)`가 연달아 몰리지 않는다 |
| `/health` | `AtomicU64`를 `Relaxed`로 읽기 | 헬스 체크가 몰려도 DB 연결을 쓰지 않는다. 값 하나를 읽고 쓰는 것뿐이라 다른 메모리와 순서를 맞출 필요가 없다 |
| 메모리 DB 풀 | `test_before_acquire(false)` 추가 | 시간 제한이 연결을 꺼내는 도중의 퓨처를 버리면 sqlx는 그 연결을 버린다[^12]. 메모리 DB는 연결 하나가 곧 DB다. 하위목표 6 |

## 코드 설명

**하위목표 1: 레이어를 쌓는다.**

```rust
.with_state(state)
// 추출기별 기본 상한은 끄고, 모든 요청에 걸리는 tower-http 상한 하나만 둔다.
.layer(DefaultBodyLimit::disable())
.layer(
    ServiceBuilder::new()
        .layer(TraceLayer::new_for_http() /* 4단계와 같다 */)
        .layer(TimeoutLayer::with_status_code(StatusCode::SERVICE_UNAVAILABLE, cfg.request_timeout))
        .layer(GlobalConcurrencyLimitLayer::new(cfg.max_in_flight))
        .layer(RequestBodyLimitLayer::new(cfg.max_body_bytes)),
)
```

설정에 `REQUEST_TIMEOUT_MS`(기본 5,000), `MAX_IN_FLIGHT`(기본 256), `STATS_INTERVAL_MS`(기본 30,000)가 더해졌다. 0이나 숫자가 아닌 값은 4단계와 같은 방식으로 거절한다.

레이어마다 실제로 무엇을 돌려주는지는 이렇다. 표의 값은 이 파일의 테스트와, 같은 파일 사본에 출력 줄을 넣어 돌린 결과다.

| 상황 | 응답 |
|---|---|
| 처리가 300ms 걸리는데 제한이 50ms | 503, 본문 없음(`content-length: 0`) |
| `Content-Length`가 상한 256을 넘음 | 413, `text/plain`, 본문 `length limit exceeded`. 핸들러는 불리지 않는다 |
| `Content-Length` 없이 조각으로 1,000바이트 | 413, 우리 JSON `{"error":{"kind":"bad_request","message":"Failed to buffer the request body: length limit exceeded"}}` |
| 상한 1, 각 200ms, 제한 300ms, 요청 2개 동시 | 둘 다 307, 합쳐 390ms 넘게 걸림 |

`Content-Length`가 상한을 넘으면 tower-http는 본문을 읽기 전에 바로 413을 낸다. 상한 정보가 없으면 본문을 읽다가 상한에서 에러를 내고, 응답은 그 에러를 받은 쪽이 만든다[^13]. 우리 서비스에서는 `Json` 추출기가 그 에러를 받아 3단계의 `ApiError`로 JSON을 만든다. 결과적으로 같은 413인데 본문 모양이 둘이다. 3단계가 지키려던 "에러는 모두 JSON" 약속이 레이어에서 깨진 자리다. 503도 마찬가지로 빈 본문이다.

마지막 줄이 가장 중요하다. 둘째 요청은 허가를 200ms 기다린 뒤 200ms 일했다. 합이 400ms라 제한 300ms를 넘는데도 503이 아니다. 동시 처리 상한은 허가를 기다리는 일을 "준비됐는가"(`poll_ready`) 단계에서 하고, `TimeoutLayer`의 시계는 요청을 넘겨받는 순간(`call`)부터 돈다. 줄 선 시간은 재지 않는다. 같은 조건에서 요청 3개를 보내면 셋 다 307이고, 각각 203ms, 406ms, 608ms에 끝났다. 셋째는 줄에서만 400ms를 섰다. 시간 제한은 "느린 핸들러"를 끊어 줄 뿐 "긴 줄"은 막지 않는다. 줄이 길어질 때 바로 거절하려면 `load_shed`로 준비 안 된 서비스 앞에서 요청을 버린다[^7].

**하위목표 2: 백그라운드 태스크.** 30초마다 링크 수를 센다. 취소되면 다음 틱을 기다리지 않고 바로 끝난다.

```rust
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
```

첫 틱은 바로 끝나므로[^10] 서버가 뜨자마자 한 번 센다. 자체 테스트는 간격을 20ms로 두고, 링크를 하나 만든 뒤 60ms 기다려 `/health`가 `{"links":1,"status":"ok"}`인지 본다. 세다가 실패하면 경고만 남기고 다음 틱에 다시 센다. 통계 하나 못 센 일로 서버를 내리지 않는다.

**하위목표 3: 띄우기와 내리기.**

```rust
let (token, tracker) = (CancellationToken::new(), TaskTracker::new());
tracker.spawn(stats_task(Arc::clone(&state.store), Arc::clone(&state.stats),
                         cfg.stats_interval, token.child_token()));
let listener = TcpListener::bind(cfg.bind).await?;
let signal = token.clone().cancelled_owned();
tracker.spawn(async move {
    if let Err(e) = axum::serve(listener, app).with_graceful_shutdown(signal).await {
        tracing::error!(error = %e, "server error");
    }
    tracing::info!("server stopped");
});
```

`bind`는 태스크를 띄우기 전에 한다. 포트가 이미 쓰이고 있으면 `start`가 바로 `Err`를 돌려주고, 태스크 안에서 조용히 죽지 않는다. 서버는 태스크 안으로 옮겨 가므로, 토큰을 빌리는 `cancelled()` 대신 토큰을 값으로 가져가는 `cancelled_owned()`를 쓴다[^3].

```rust
pub async fn shutdown(self, grace: Duration) -> bool {
    self.token.cancel();
    self.tracker.close();
    let done = tokio::time::timeout(grace, self.tracker.wait()).await.is_ok();
    if !done {
        tracing::warn!(remaining = self.tracker.len(), "grace period over, exiting anyway");
    }
    done
}
```

`close()`를 빼면 `wait()`는 영원히 끝나지 않는다. 트래커가 열려 있으면 비어 있어도 기다리기 때문이다[^4].

**하위목표 4: 신호를 받는다.** 유닉스에서는 SIGTERM도 기다린다. `docker stop`이 먼저 보내는 신호가 이것이다[^1].

```rust
async fn shutdown_signal() {
    let ctrl_c = async { tokio::signal::ctrl_c().await.ok(); };
    #[cfg(unix)]
    let term = async {
        use tokio::signal::unix::{SignalKind, signal};
        if let Ok(mut s) = signal(SignalKind::terminate()) { s.recv().await; }
    };
    #[cfg(not(unix))]
    let term = std::future::pending::<()>();
    tokio::select! { () = ctrl_c => {}, () = term => {} }
}
```

한 번 등록하면 Ctrl+C의 원래 동작(프로세스 종료)은 돌아오지 않는다[^14]. 그래서 신호를 받은 뒤에는 반드시 직접 끝내야 한다. `serve_forever`는 `shutdown`이 `false`를 돌려주면 `std::process::exit(1)`로 나간다.

**하위목표 5: 처리 중인 요청이 끝나는지 본다.** axum 문서는 `with_graceful_shutdown`이 신호가 오면 종료를 준비한다고만 적고, 처리 중인 요청을 어떻게 하는지는 말하지 않는다[^15]. 그래서 테스트로 확인한다. 자체 테스트는 `resolve`를 300ms 늦추는 `Slow` 저장소를 끼운다.

```rust
let in_flight = tokio::spawn(async move { http(addr, "GET", &format!("/{code}"), "").await });
tokio::time::sleep(Duration::from_millis(50)).await;
let t0 = Instant::now();
assert!(running.shutdown(SHUTDOWN_GRACE).await, "graceful shutdown timed out");
let r = in_flight.await.expect("join");
assert_eq!(r.status, 307);
assert!(tokio::net::TcpStream::connect(addr).await.is_err(), "종료 뒤 새 연결은 거절돼야 한다");
```

실행 출력은 `종료 중에도 끝난 요청: 307 (252.7455ms 걸려 종료)`이다. 요청이 시작된 지 50ms 뒤에 종료를 시작했으니 남은 250ms를 기다려 준 것이다. 로그를 시간순으로 찍어 보면 `stats task stopped` → `finished processing request`(`status`:307, `latency`:"303 ms") → `server stopped` 순서다. 통계 태스크는 취소되자 바로 끝났고, 서버는 마지막 요청을 보낸 뒤에 멈췄다. 종료 뒤에는 새 연결이 거절된다.

**하위목표 6: 시간 제한이 메모리 DB를 지우지 않게 한다.** 시간 제한은 핸들러 퓨처를 버리는 취소다. 그 퓨처가 풀에서 연결을 꺼내는 도중이었다면 어떻게 될까? sqlx 문서는 연결을 꺼낸 뒤 `acquire`가 취소되면 그 연결을 풀에 돌려주지 않고 버린다고 적고, 크기 1인 메모리 SQLite 풀이 이것에 특히 약하다고 적는다[^12]. 2단계의 메모리 DB 풀이 바로 그것이다. 연결이 버려지면 표가 통째로 사라진다.

테스트 `dropped_queries_keep_memory_db`는 `resolve` 퓨처를 1~29번 poll한 뒤 버리기를 290번 되풀이하고, 링크 수가 1로 남았는지 본다. 2단계 설정 그대로면 첫 번째로 버린 순간 DB가 사라진다. 이 테스트는 `called Result::unwrap() on an Err value: Backend(Database(SqliteError { code: 1, message: "no such table: links" }))`로 실패한다. sqlx 문서의 처방대로 연결 전 점검을 꺼서 꺼내기와 돌려주기 사이의 `.await`를 없앤다[^12].

```rust
SqlitePoolOptions::new()
    .max_connections(1)
    .idle_timeout(None)
    .max_lifetime(None)
    .test_before_acquire(false)
```

이 한 줄을 더하면 테스트가 통과한다. 기존 시간 제한 테스트는 이 문제를 못 잡았다. `Slow`는 DB에 가기 전에 잠들기 때문에, 시간 제한이 늘 잠자는 중에 퓨처를 버렸다. 파일 DB(기본값 `sqlite://links.db`)는 연결이 버려져도 다음에 새로 열면 데이터가 그대로라서 이 설정이 필요 없다. 실제 배포는 파일 DB를 쓰고, 메모리 DB는 테스트에서만 쓴다.

시간 제한이 DB의 일까지 멈추지는 않는다는 점도 알아 둔다. 오래 걸리는 재귀 쿼리를 50ms 만에 버리고 바로 `count()`를 불러 보면, 결과는 맞지만 7.96초 뒤에야 돌아왔다. 버린 쿼리가 하나뿐인 연결 위에서 끝까지 돌았기 때문이다. 클라이언트는 503을 받지만, DB는 그 뒤로도 한동안 바쁘다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: rustfmt·clippy(`-D warnings`)·테스트 6개(`self_check_passes`, `slow_handler_times_out_with_503`, `concurrency_limit_queues_and_queue_time_is_not_timed`, `body_limit_applies_without_content_length`, `dropped_queries_keep_memory_db`, `config_rejects_bad_limits`)·자체 테스트 통과, `ALL CHECKS PASSED` — [46_capstone-5_p1.rs](/Hongs_Blog/studies/rust/code/46_capstone-5_p1/). `test_before_acquire(false)`를 지운 사본에서는 `dropped_queries_keep_memory_db`가 실패했다.</div>

</div>


## 변형 문제

**변형 1.** `GlobalConcurrencyLimitLayer::new(cfg.max_in_flight)`를 `tower::limit::ConcurrencyLimitLayer::new(cfg.max_in_flight)`로 바꾼다. `MAX_IN_FLIGHT=1`일 때 200ms 걸리는 `GET /abcdefg`가 허가를 쥐고 있는 동안 `GET /health`가 오면 언제 끝나는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

실행해 보면 `/health`가 약 22ms(세 번 재서 21.8~23.0ms)에 끝난다. 원래 코드(`Global…`)에서는 203ms, 즉 앞 요청이 끝날 때까지 기다렸다.

까닭을 문서로 끝까지 설명할 수는 없다. tower 문서는 `ConcurrencyLimitLayer`가 감싸는 서비스마다 상한을 따로 만든다고 적는다[^6]. axum 문서는 `Router::layer`가 "라우터의 모든 라우트에" 레이어를 적용한다고만 적고, 그 과정에서 서비스를 몇 번 감싸는지는 적지 않는다[^16]. 그래서 상한이 몇 개 생기는지는 axum이 라우트를 안에서 어떻게 만드는지에 달려 있고, 라우터를 짜는 방식에 따라 결과가 달라진다.

- 이 파일의 구성(`with_state` 뒤에 `ServiceBuilder`로 건 경우): 같은 `/abcdefg` 요청 3개는 `oneshot`으로도 진짜 소켓으로도 약 203·406·609ms에 하나씩 끝났다. 같은 라우트끼리는 줄을 섰지만, `/health`는 그 줄과 상관없이 바로 지나갔다.
- [백프레셔와 큐 제한](/Hongs_Blog/studies/rust/backpressure/)의 실험(상태 없는 라우터에 `layer(ConcurrencyLimitLayer::new(1))`을 바로 건 경우): 같은 라우트에 연결 4개가 동시에 들어와 핸들러 4개가 함께 돌았다. 같은 라우트조차 묶이지 않았다.

문서가 약속하지 않는 동작에 서버 전체 상한을 맡길 수 없다. `GlobalConcurrencyLimitLayer`는 세마포어 하나를 모든 복제가 나눠 쓰고, 레이어를 복제해도 새 세마포어를 만들지 않는다고 문서가 적는다[^6]. 그래서 이 파일은 `Global…`을 쓴다. `/health`만은 상한에 막히지 않게 하고 싶다면, 상한을 건 라우터와 `/health` 라우터를 따로 만들어 레이어를 각각 건 뒤 `merge`한다. 일부 라우트에만 미들웨어를 걸 때 axum 문서가 권하는 방법이다[^16].

</details>


**변형 2.** 이 서비스를 `docker stop`으로 내린다. `SHUTDOWN_GRACE`가 10초인데 처리 중인 요청 하나가 9.5초 더 걸린다. 무슨 일이 생기고, 어떻게 고치는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`docker stop`은 SIGTERM을 보내고 기본 10초 뒤 SIGKILL을 보낸다[^1]. 우리 유예도 10초라서 두 시계가 거의 같이 끝난다. 요청이 9.5초에 끝나면 남은 여유는 0.5초뿐이고, 그 사이 종료 처리가 조금만 늦어도 SIGKILL에 잘린다. 요청이 10초를 넘기면 `shutdown`이 `false`를 돌려주고 `exit(1)`을 하려는 순간과 SIGKILL이 겹친다. 고치는 방법은 둘 중 하나다. 앱의 유예를 바깥보다 짧게 잡는다(예: 8초). 또는 바깥의 유예를 늘린다(`docker stop -t 30`, `docker run --stop-timeout 30`)[^1]. 어느 쪽이든 "앱 유예 < 오케스트레이터 유예"가 되게 한다. 덧붙여 지금 설정에서는 핸들러가 5초(`REQUEST_TIMEOUT_MS`)를 넘기면 503으로 끊기므로 9.5초짜리 핸들러는 생기지 않는다. 다만 하위목표 1에서 본 대로 줄 선 시간은 재지 않으니, 줄이 길면 종료 때 기다릴 요청이 남는다. 세 숫자를 "요청 시간 제한 < 앱 유예 < 오케스트레이터 유예"로 맞춘다.

</details>


**변형 3.** 누군가 `stats_task`의 `() = token.cancelled() => break,` 줄을 지웠다. 컴파일되는가? 자체 테스트는 어떻게 끝나는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

컴파일된다(`token`을 안 쓴다는 경고 하나가 나오고, 이 과목의 clippy 설정에서는 그 경고로 멈춘다). 경고를 무시하고 돌리면 통계 태스크가 영원히 돈다. 트래커가 닫혀도 태스크 하나가 남아 있어서 `wait()`가 끝나지 않는다[^4]. 10초 유예가 지나면 `shutdown`이 `false`를 돌려주고, 자체 테스트는 `graceful shutdown timed out`으로 실패한다. 6단계 파일의 사본에서 재 보면 그 테스트가 10.13초 만에 실패했다. `tracker.close()`를 지워도 똑같이 10.13초 뒤 같은 메시지로 실패한다.

</details>


[^1]: Docker 문서, `docker container stop`(먼저 SIGTERM, 유예 뒤 SIGKILL, 리눅스 컨테이너 기본 10초, `-t`/`--timeout`, `--stop-timeout`) — https://docs.docker.com/reference/cli/docker/container/stop/
[^2]: Tokio 문서, Topics "Graceful Shutdown"(언제 끝낼지 정하기, 알리기, 기다리기의 세 부분, `CancellationToken`과 `TaskTracker`) — https://tokio.rs/tokio/topics/shutdown
[^3]: tokio-util 0.7.20 문서, struct `CancellationToken`(`child_token`, `cancel`, `cancelled_owned`, 자식 취소는 부모를 취소하지 않는다) — https://docs.rs/tokio-util/0.7.20/tokio_util/sync/struct.CancellationToken.html
[^4]: tokio-util 0.7.20 문서, struct `TaskTracker`(`close`, `wait`는 닫히고 비었을 때만 끝난다, `JoinSet`과의 차이) — https://docs.rs/tokio-util/0.7.20/tokio_util/task/task_tracker/struct.TaskTracker.html
[^5]: tower-http 0.7.1 문서, struct `TimeoutLayer`(`new`는 0.6.7부터 deprecated, 기본 408, `with_status_code`) — https://docs.rs/tower-http/0.7.1/tower_http/timeout/struct.TimeoutLayer.html
[^6]: tower 0.5.3 문서, struct `GlobalConcurrencyLimitLayer`(세마포어를 나눠 쓴다, 복제해도 새 세마포어를 만들지 않는다, `ConcurrencyLimitLayer`는 서비스마다 상한) — https://docs.rs/tower/0.5.3/tower/limit/concurrency/struct.GlobalConcurrencyLimitLayer.html
[^7]: tower 문서, `load_shed` 모듈("sheds load when the inner service isn't ready", 기능 `load-shed`) — https://docs.rs/tower/latest/tower/load_shed/index.html
[^8]: axum 0.8.9 문서, struct `DefaultBodyLimit`(지역 상한과 tower-http `RequestBodyLimit`의 차이, `disable()`과 `RequestBodyLimitLayer` 예) — https://docs.rs/axum/0.8.9/axum/extract/struct.DefaultBodyLimit.html
[^9]: tower 0.5.3 문서, struct `ServiceBuilder`의 "Order"("Layers that are added first will be called with the request first") — https://docs.rs/tower/0.5.3/tower/builder/struct.ServiceBuilder.html
[^10]: tokio 1.53.3 문서, fn `time::interval`("The first tick completes immediately", 기본 `MissedTickBehavior`는 `Burst`) — https://docs.rs/tokio/latest/tokio/time/fn.interval.html
[^11]: tokio 문서, enum `MissedTickBehavior`(`Burst`, `Delay`, `Skip`) — https://docs.rs/tokio/latest/tokio/time/enum.MissedTickBehavior.html
[^12]: sqlx 0.9.0 문서, struct `Pool`의 `acquire`(연결을 얻은 뒤 취소되면 돌려주지 않고 버린다, 크기 1인 메모리 SQLite 예, `test_before_acquire(false)` 권고) — https://docs.rs/sqlx/0.9.0/sqlx/struct.Pool.html
[^13]: tower-http 0.7.1 문서, `limit` 모듈(`Content-Length`가 넘으면 본문을 읽기 전에 413, 없으면 `Limited` 본문이 에러를 내고 응답은 핸들러 몫) — https://docs.rs/tower-http/0.7.1/tower_http/limit/index.html
[^14]: tokio 문서, fn `signal::ctrl_c`(유닉스에서 처음 등록하면 프로세스 전체에 처리기가 깔리고 원래 동작은 돌아오지 않는다) — https://docs.rs/tokio/latest/tokio/signal/fn.ctrl_c.html
[^15]: axum 0.8.9 문서, struct `Serve`의 `with_graceful_shutdown`("Prepares a server to handle graceful shutdown when the provided future completes") — https://docs.rs/axum/0.8.9/axum/serve/struct.Serve.html
[^16]: axum 0.8.9 문서, `Router::layer`("Apply a `tower::Layer` to all routes in the router", 이미 등록된 라우트에만, 일부 라우트에만 걸려면 라우터를 나눠 레이어를 건 뒤 `merge`) — https://docs.rs/axum/0.8.9/axum/struct.Router.html
[^17]: axum 문서, `error_handling` 모듈(실패할 수 있는 미들웨어는 `HandleErrorLayer`로 감싼다, tower `timeout` 예) — https://docs.rs/axum/latest/axum/error_handling/index.html
{% endraw %}
