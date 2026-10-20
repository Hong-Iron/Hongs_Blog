---
layout: "note"
title: "axum으로 HTTP 서비스 만들기"
display_title: "axum으로 HTTP 서비스 만들기 (axum)"
kind: "concept"
kind_label: "기법"
num: "45"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["axum", "Axum", "Router", "라우터", "Handler", "핸들러", "Extractor", "추출기", "Path", "Query", "Json", "State", "IntoResponse", "Rejection", "거부", "tower", "Layer", "레이어", "Middleware", "미들웨어", "TraceLayer", "TimeoutLayer", "oneshot", "axum::serve", "with_graceful_shutdown", "axum 0.8"]
description: "axum은 \"이 주소로 이런 요청이 오면 이 함수를 부른다\"는 표를 만들고, 요청에서 함수가 필요한 조각(주소 속 번호, JSON 본문, 모든 요청이 함께 쓰는 상태)을 꺼내 함수 인자로 넣어 주는 라이브러리다. 꺼내기에 실패하면 함수를 부르지 않고 알맞은 오류 응답을 대신 보낸다…"
prev_url: "/studies/rust/configuration-secrets/"
prev_title: "설정과 비밀값"
next_url: "/studies/rust/sqlx-database/"
next_title: "sqlx로 데이터베이스 쓰기"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "45_axum-http_impl.rs", "u": "/studies/rust/code/45_axum-http_impl/", "r": "구현"}]
permalink: "/studies/rust/axum-http/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

axum은 "이 주소로 이런 요청이 오면 이 함수를 부른다"는 표를 만들고, 요청에서 함수가 필요한 조각(주소 속 번호, JSON 본문, 모든 요청이 함께 쓰는 상태)을 꺼내 함수 인자로 넣어 주는 라이브러리다. 꺼내기에 실패하면 함수를 부르지 않고 알맞은 오류 응답을 대신 보낸다. 그래서 함수는 정상적인 경우만 신경 쓰면 된다. 대신 함수 모양이 규칙에서 조금만 어긋나도 컴파일 오류가 길고 읽기 어렵다. 0.8에서 주소에 변수를 적는 문법이 바뀌어, 예전 글의 문법을 그대로 쓰면 서버가 뜨는 순간 멈춘다.

</div>


## 예시로 보기

틀 없이 HTTP 서버를 짜면 핸들러마다 같은 일을 되풀이한다. 주소 문자열을 잘라 번호를 꺼내고, 숫자가 아니면 400을 보낸다. 본문이 JSON인지 헤더를 보고, 파싱하고, 필드가 빠졌으면 또 오류를 보낸다. 핸들러 하나에서 검사 하나를 잊으면 그 요청은 panic이나 엉뚱한 500으로 끝난다.

axum에서는 이 검사를 함수의 인자 타입이 대신한다.

```rust
async fn get_item(
    State(state): State<Shared>, // 모든 요청이 함께 보는 상태
    Path(id): Path<u64>,         // /items/{id}의 id. 숫자가 아니면 핸들러까지 오지 않는다
) -> Result<Json<Item>, AppError> {
    let items = state.items.read().await;
    items.get(&id).cloned().map(Json).ok_or(AppError::NotFound(id))
}

fn app(state: Shared) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/items", get(list_items).post(create_item))
        .route("/items/{id}", get(get_item))
        .route("/items/{id}/export", get(export_item))
        .route("/slow", get(slow))
        .layer(TimeoutLayer::with_status_code(
            StatusCode::REQUEST_TIMEOUT,
            Duration::from_millis(100),
        ))
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}
```

이 라우터에 요청을 차례로 넣은 결과다(`pen`, `cup` 순서로 넣은 뒤).

| 요청 | 상태 | 본문 |
|---|---|---|
| `GET /health` | 200 | `ok` |
| `POST /items` `{"name":"pen"}` | 201 | `{"id":1,"name":"pen"}` |
| `GET /items/2` | 200 | `{"id":2,"name":"cup"}` |
| `GET /items/9` | 404 | `{"error":"item 9 not found"}` |
| `GET /items?limit=1` | 200 | `[{"id":1,"name":"pen"}]` |
| `POST /items` `{"name":"  "}` | 422 | `{"error":"name must not be empty"}` |

`get_item` 안에는 문자열을 자르거나 상태 코드를 고르는 줄이 없다. 요청을 받아 응답을 돌려주는 함수를 핸들러(handler), 요청에서 조각을 꺼내는 `Path`, `State` 같은 타입을 추출기(extractor)라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 추출기 거부 네 가지, 405와 404, 내부 에러의 500과 로그, 100ms 시간 제한의 408, 0.7 문법의 panic 메시지, `127.0.0.1:0`에 실제로 띄워 보낸 요청과 안전한 종료를 실행해 확인했다 — [45_axum-http_impl.rs](/Hongs_Blog/studies/rust/code/45_axum-http_impl/)</div>

</div>


## 라우터와 0.8의 경로 문법

`Router::new().route(경로, 메서드 라우터)`로 표를 채운다. 같은 경로에 메서드 여러 개를 `get(list_items).post(create_item)`처럼 잇는다[^1].

axum 0.8.0(2025년 1월 1일 발표)에서 경로 변수 문법이 `/:single`, `/*many`에서 `/{single}`, `/{*many}`로 바뀌었다[^2][^3]. 예전 문법으로는 `:`나 `*`로 시작하는 경로 조각을 그대로 쓸 수 없었기 때문이다[^2]. 글자 그대로의 중괄호는 `{{`, `}}`처럼 두 번 쓴다[^2].

0.7 시절 글을 보고 `/items/:id`를 등록하면 컴파일은 된다. 그리고 `route`를 부르는 순간 panic한다.

```text
Path segments must not start with `:`. For capture groups, use `{capture}`. If you meant to literally match a segment starting with a colon, call `without_v07_checks` on the router.
```

`without_v07_checks`는 이 검사를 끈다. 정말로 `:`로 시작하는 경로가 필요할 때만 쓴다[^4]. `route`는 경로가 다른 경로와 겹치거나 비어 있어도 panic한다[^4]. 라우터는 서버가 뜰 때 한 번 만들어지므로, `app()`을 부르는 테스트가 하나만 있어도 이런 실수는 배포 전에 잡힌다.

라우터가 고른 결과도 확인했다. 표에 없는 경로 `GET /nope`은 404, 경로는 있는데 메서드가 없는 `DELETE /items/1`은 405였다.

## 핸들러와 추출기

axum은 다음 조건을 갖춘 함수를 핸들러로 받는다[^5].

- `async fn`이다.
- 인자는 16개 이하이고 모두 `Send`다.
- 마지막 인자를 뺀 나머지는 요청의 머리(주소, 헤더)만 읽는 추출기(`FromRequestParts`)다. 마지막 인자만 본문을 읽는 추출기(`FromRequest`)일 수 있다.
- 돌려주는 값은 응답으로 바꿀 수 있다(`IntoResponse`).
- 돌려주는 퓨처가 `Send`다.

추출기는 인자 순서대로 왼쪽부터 돈다. 요청 본문은 한 번만 읽을 수 있는 흐름이라 본문을 읽는 추출기는 하나만 둘 수 있고, 반드시 마지막 인자여야 한다[^6][^7].

| 추출기 | 꺼내는 것 | 이 코드에서 |
|---|---|---|
| `Path<T>` | 주소 속 변수. 여러 개면 튜플이나 구조체로 받는다[^8] | `Path<u64>` ← `/items/{id}` |
| `Query<T>` | `?` 뒤의 쿼리 문자열 | `limit: Option<usize>`. 없으면 `None` |
| `Json<T>` | JSON 본문. 마지막 인자 | `Json<NewItem>` |
| `State<T>` | 라우터에 넣어 둔 공유 상태 | `State<Shared>` |
| `HeaderMap` | 헤더 전체 | 연습 p4의 `x-api-key` |

### 꺼내기에 실패하면

추출기가 실패하면 axum은 오류 응답을 보내고 핸들러를 부르지 않는다[^6]. `Json`은 Content-Type이 JSON이 아닐 때, JSON 문법이 틀렸을 때, 문법은 맞지만 타입에 안 맞을 때, 본문을 읽지 못할 때 거부한다[^7]. 상태 코드는 문서에 적혀 있지 않아 실행해서 확인했다.

| 요청 | 거부한 추출기 | 응답 |
|---|---|---|
| `GET /items/abc` | `Path<u64>` | 400 Bad Request |
| `POST /items` 본문 `{"name":` | `Json` (문법 오류) | 400 Bad Request |
| `POST /items` 본문 `{"title":"x"}` | `Json` (`name` 없음) | 422 Unprocessable Entity |
| `POST /items`, Content-Type 없음 | `Json` | 415 Unsupported Media Type |

거부 응답을 내 형식으로 바꾸고 싶으면 인자를 `Result<Json<T>, JsonRejection>`처럼 받는다[^6]. 본문은 기본으로 2MB까지만 받는다. 이 한도는 `Json`, `String`, `Bytes`에 걸리고, `DefaultBodyLimit`로 바꾼다[^6].

## 공유 상태

```rust
#[derive(Default)]
struct AppState {
    items: RwLock<HashMap<u64, Item>>, // tokio::sync::RwLock
    next_id: AtomicU64,
}

type Shared = Arc<AppState>;
```

- 상태는 요청마다 복제된다. `Arc`로 감싸면 복제가 참조 수를 하나 올리는 일로 끝난다[^1]. 그래서 `AppState` 자체에는 `Clone`이 필요 없다.
- `Router::with_state(state)`로 상태를 넣는다. `Router<S>`는 "상태 `S`가 아직 없는 라우터"라는 뜻이다. `axum::serve`에는 상태를 다 채운 `Router<()>`만 넘길 수 있다[^4].
- 핸들러가 라우터와 다른 타입의 상태를 꺼내려 하면 컴파일 오류다[^9].
- **잠금 고르기.** 잠근 `std::sync::Mutex`를 쥔 채 `.await`하면 퓨처가 `Send`가 아니게 되고[^9], 그러면 그 함수는 핸들러 조건을 못 채운다. 이 코드는 `tokio::sync::RwLock`을 썼다. 다만 어느 핸들러도 잠금을 쥔 채 다른 것을 기다리지 않으므로 `std::sync::RwLock`으로 바꿔도 된다. 기다리지 않는 짧은 잠금에는 std 쪽이 싸다([tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)). 내보내기 핸들러는 파일을 쓰기 전에 블록 `{ … }`을 닫아 잠금을 먼저 놓는다.
- `GET`은 읽기 잠금, `POST`는 쓰기 잠금을 잡는다. 읽는 요청 여럿은 함께 들어가고 쓰는 요청은 혼자 들어간다. 운영체제의 [독자-저자 문제](/Hongs_Blog/studies/operating-systems/readers-writers/)와 같은 모양이다.
- 실제 서비스에서는 이 자리에 DB 연결 풀이 들어간다([sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/)).

## 에러를 응답으로: IntoResponse

axum은 모든 서비스의 에러 타입이 `Infallible`(절대 실패하지 않음)이기를 요구한다. 에러가 그 아래 HTTP 라이브러리(hyper)까지 내려가면 응답 없이 연결이 끊기기 때문이다[^10]. 그래서 핸들러가 돌려주는 `Err`는 "실패"가 아니다. `IntoResponse`를 거쳐 평범한 응답이 된다[^10]. 문서는 핸들러에서 `?`를 쓸 수 있게 응답으로 바뀌는 중간 에러 타입을 두라고 권한다[^10].

```rust
#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error("item {0} not found")]
    NotFound(u64),
    #[error("name must not be empty")]
    EmptyName,
    #[error(transparent)]
    Internal(#[from] anyhow::Error), // 사용자 잘못이 아닌 실패
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, msg) = match &self {
            AppError::NotFound(_) => (StatusCode::NOT_FOUND, self.to_string()),
            AppError::EmptyName => (StatusCode::UNPROCESSABLE_ENTITY, self.to_string()),
            AppError::Internal(e) => {
                tracing::error!(error = format!("{e:#}"), "internal error");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string())
            }
        };
        (status, Json(serde_json::json!({ "error": msg }))).into_response()
    }
}
```

사용자 잘못(없는 번호, 빈 이름)은 그 이유를 응답에 싣는다. 서버 쪽 실패는 이유를 로그에만 남기고 응답에는 `"internal error"`만 싣는다. 파일 경로나 DB 메시지가 바깥으로 나가지 않게 하려는 것이다([애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)).

`export_item`은 일부러 없는 폴더에 파일을 쓴다. `tokio::fs::write(...).await.with_context(...)?`에서 `?`가 `anyhow::Error`를 `#[from]`을 거쳐 `AppError::Internal`로 바꾼다. 응답은 `500 {"error":"internal error"}`였다. 경로와 운영체제 오류는 아래 ERROR 로그에만 있었다.

`Json`을 응답으로 돌려주면 `Content-Type: application/json`이 저절로 붙는다[^7].

## 미들웨어: tower 레이어

axum은 자기만의 미들웨어 방식이 없다. `tower::Service`를 그대로 쓰므로 tower와 tower-http의 미들웨어를 가져다 쓴다[^1]. 미들웨어 하나를 레이어(layer)라 부른다.

- **순서.** `Router::layer`로 여러 개를 달면 아래에서 위로 돈다. 마지막에 단 레이어가 요청을 가장 먼저 받는다[^11]. 위 `app()`에서는 `TraceLayer`가 바깥, `TimeoutLayer`가 안쪽이다. 그래서 `TraceLayer`는 시간 제한이 만든 408까지 본다. 위에서 아래 순서로 읽고 싶으면 `tower::ServiceBuilder`로 묶는다[^11].
- **이미 있는 경로에만.** `Router::layer`는 그때까지 등록된 경로에만 걸린다[^4]. 경로를 다 등록한 뒤 레이어를 단다. `route_layer`는 경로가 맞은 요청에만 돈다[^4].

### TimeoutLayer

tower-http의 `TimeoutLayer::with_status_code(상태 코드, 시간)`은 요청이 시간 안에 끝나지 않으면 그 상태 코드로 응답한다. 예전 생성자 `new`는 0.6.7부터 쓰지 말라고 표시됐고, 기본으로 408을 돌려준다[^12]. `/slow`는 5초를 자는데 제한이 100ms라 408 Request Timeout을 받았다.

tower-http의 시간 제한은 스스로 응답을 만들어 주니 `Router::layer`에 바로 단다. tower 쪽 시간 제한처럼 에러를 내는 미들웨어는 `HandleErrorLayer`로 감싸 에러를 응답으로 바꿔야 한다[^10]. 취소가 핸들러 퓨처에 어떻게 닿는지는 [취소·타임아웃·select](/Hongs_Blog/studies/rust/cancellation-timeouts-select/)에 있다.

### TraceLayer

`TraceLayer::new_for_http()`는 요청마다 span을 열고, 요청이 들어올 때와 응답이 나갈 때 event를 찍는다. 응답이 실패인지는 상태 코드로 가른다[^13]. 내보내기 요청 하나가 남긴 JSON 줄을 줄여 옮기면 이렇다. 다섯 줄 모두 `{"method":"GET","name":"request","uri":"/items/1/export","version":"HTTP/1.1"}` span을 달고 있었다.

```text
DEBUG tower_http::trace::on_request    started processing request
ERROR r_45_axum_http_impl              internal error   error="writing /no-such-dir-vault/1.txt: No such file or directory (os error 2)"
DEBUG tower_http::trace::on_response   finished processing request   status=500 latency="0 ms"
ERROR tower_http::trace::on_failure    response failed   classification="Status code: 500 Internal Server Error"
DEBUG tower_http::trace::on_eos        end of stream
```

- 핸들러 안에서 찍은 `internal error`도 같은 span을 달았다. `#[instrument]` 없이도 요청 단위로 줄을 묶을 수 있다([tracing으로 관측하기](/Hongs_Blog/studies/rust/tracing-observability/)).
- 들어옴·나감 줄은 DEBUG다. 운영에서 보려면 `RUST_LOG=info,tower_http=debug`처럼 tower-http만 켠다.
- 500 응답에는 ERROR 수준의 `response failed` 줄이 하나 더 붙었다.
- span에 요청 ID 같은 필드를 넣으려면 `make_span_with`에 span을 만드는 클로저를 준다[^13].

## 테스트: 소켓 없이 oneshot

`Router`는 tower의 `Service`다. `tower::ServiceExt::oneshot`은 서비스를 받아(가져가) 준비되면 요청 하나로 부른다[^14]. 포트를 열지 않고 라우터에 요청을 바로 넣을 수 있다.

```rust
async fn call(app: &Router, req: Request<Body>) -> (StatusCode, String) {
    let res = app.clone().oneshot(req).await.expect("Router never fails");
    let status = res.status();
    let bytes = to_bytes(res.into_body(), 1 << 20).await.expect("body");
    (status, String::from_utf8(bytes.to_vec()).expect("utf8"))
}
```

`oneshot`은 `self`를 가져가므로 `app.clone()`에 대고 부른다. 복제된 라우터들은 같은 `Arc<AppState>`를 본다. 한 복제본으로 `POST`한 항목을 다른 복제본의 `GET`이 찾았다. `expect`가 안전한 것은 라우터의 에러 타입이 `Infallible`이기 때문이다. 위 표와 거부 표가 모두 이 방법으로 얻은 결과다. `#[tokio::test]`에 넣으면 그대로 테스트가 된다([테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/)).

## 진짜로 띄우기와 안전한 종료

검증 코드는 운영체제가 고른 빈 포트에 서버를 띄우고, 소켓으로 HTTP 요청을 직접 보낸 뒤, 종료 신호를 보내 끝냈다.

```rust
let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await?;
let addr = listener.local_addr()?;
let (tx, rx) = tokio::sync::oneshot::channel::<()>();
let server = tokio::spawn(async move {
    axum::serve(listener, app(Shared::default()))
        .with_graceful_shutdown(async { let _ = rx.await; })
        .await
});
// addr로 "GET /health HTTP/1.1" 요청을 보내고 응답을 읽는다
tx.send(()).expect("shutdown signal");
```

응답의 첫 줄은 `HTTP/1.1 200 OK`, 본문은 `ok`였고, 신호를 보낸 뒤 서버 태스크는 `Ok(())`로 끝났다.

- `axum::serve`는 일부러 단순하게 만들어 설정을 받지 않는다. 연결 설정이 필요하면 hyper나 hyper-util을 직접 쓴다. HTTP/1과 HTTP/2를 모두 받는다[^15].
- 종료 신호를 주지 않으면 `serve`는 끝나지도 에러를 돌려주지도 않는다[^15]. `with_graceful_shutdown`을 붙이면 신호 퓨처가 끝난 뒤에만 `Ok(())`를 돌려준다[^16].
- 운영에서는 주소를 `"0.0.0.0:3000"`으로, 신호를 `tokio::signal::ctrl_c()`와 SIGTERM으로 바꾼다. 하던 요청을 어떻게 마치고 내려갈지는 [안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)에서 다룬다.

## 활용

- **구조.** 라우터를 만드는 `fn app(state) -> Router`를 라이브러리 쪽에 둔다. `main`은 설정 읽기([설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/)) → 로그 구독자 → DB 풀 → `app(state)` → `serve`만 한다. 테스트는 같은 `app()`을 `oneshot`으로 부른다.
- **기본으로 다는 것.** 시간 제한, `TraceLayer`, 본문 한도(작은 JSON API면 2MB보다 줄인다), 요청 ID. 몰리는 요청을 줄 세우거나 거절하는 동시 처리 한도는 [백프레셔와 큐 제한](/Hongs_Blog/studies/rust/backpressure/)에 있다.
- **에러 응답 한 곳.** 도메인 에러를 상태 코드로 바꾸는 일은 `IntoResponse` 하나에 모은다. 핸들러마다 `StatusCode`를 고르지 않는다.
- **긴 컴파일 오류 풀기.** 함수가 핸들러 조건을 못 채우면 오류 메시지가 쓸모없을 때가 많다. axum-macros의 `#[debug_handler]`를 붙이면 무엇이 어긋났는지 알려 준다[^5]. axum의 `macros` 기능을 켜야 하며 기본으로는 꺼져 있다[^1]. 이 과목의 harness는 이 기능을 켜지 않았다.
- **흔한 실수.**
  - 예전 글에서 `/:id`를 옮겨 와서 서버가 뜨자마자 panic한다. `/{id}`로 쓴다.
  - `Json`을 마지막이 아닌 자리에 둔다. 핸들러 조건을 못 채워 긴 컴파일 오류가 난다.
  - `std::sync::Mutex` 가드를 쥔 채 `.await`한다. 퓨처가 `Send`가 아니게 되어 역시 핸들러가 못 된다. clippy의 `await_holding_lock`이 잡는다([Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/)).
  - `.layer()`를 단 뒤에 `.route()`를 더해서, 새 경로에는 시간 제한과 로그가 없다.
  - `with_state`를 빠뜨려 `Router<Shared>`를 `serve`에 넘긴다. 컴파일 오류가 난다[^4].
  - 핸들러에서 `std::fs`나 무거운 계산으로 스레드를 막는다. `tokio::fs`나 `spawn_blocking`을 쓴다([tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)).

## 연결

- 브라우저와 웹 서버 프로세스 사이의 통로 위에서 HTTP 요청과 응답이 오간다: [프로세스 간 채널](/Hongs_Blog/studies/computer-communication/process-to-process-channel/)
- 경계에 작은 에러 enum을 두는 까닭: [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)
- 읽기·쓰기 잠금: [Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/), [독자-저자 문제](/Hongs_Blog/studies/operating-systems/readers-writers/)
- 요청마다 태스크가 도는 런타임: [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)
- 요청 단위 로그: [tracing으로 관측하기](/Hongs_Blog/studies/rust/tracing-observability/)
- 상태에 DB 풀 넣기: [sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/)
- 연습과 캡스톤: [서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/)의 p4, [캡스톤 3 axum API](/Hongs_Blog/studies/rust/capstone-3/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"핸들러가 `Err`를 돌려주면 서버가 실패로 여기고 연결을 끊는다"</div>

틀렸다. Java에서는 예외가 던져지면 그 메서드가 실패한 것으로 다루는 데 익숙하다([예외와 예외 클래스](/Hongs_Blog/studies/java/java-exception/)). 그래서 `Err`도 서버가 실패로 받아 연결을 끊을 것처럼 보인다. axum에서 핸들러의 `Err(AppError)`는 `IntoResponse`를 거쳐 평범한 응답이 된다. 연결이 끊기는 것은 에러가 hyper까지 내려갈 때뿐이고, axum은 서비스의 에러 타입을 `Infallible`로 묶어 그런 일을 막는다. 실행해 보면 `GET /items/9`는 404와 JSON 본문을, 내보내기 실패는 500과 JSON 본문을 정상적으로 돌려받았다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 본문의 `app()`에 다음 요청 넷을 보낸다. 각 응답의 상태 코드는? (가) `GET /items/abc` (나) Content-Type 헤더 없이 `POST /items` 본문 `{"name":"x"}` (다) `POST /items` 본문 `{"title":"x"}` (JSON 헤더 있음) (라) `DELETE /items/1`</summary>

**답:** (가) 400 (나) 415 (다) 422 (라) 405.<br>
**이유:** (가) `Path<u64>`가 `abc`를 숫자로 못 바꾼다. (나) `Json`은 Content-Type이 JSON이 아니면 본문을 보지도 않고 거부한다. (다) JSON 문법은 맞지만 `NewItem`에 필요한 `name`이 없다. 문법 오류(400)와 다르다. (라) `/items/{id}` 경로는 있지만 `DELETE` 메서드가 없다. 경로가 아예 없으면 404다. 네 경우 모두 핸들러는 불리지 않았다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** axum 0.8에서 `Router::new().route("/items/:id", get(get_item))`을 쓴 코드는 컴파일되는가? 실행하면 어떻게 되나? 어떻게 고치나?</summary>

**답:** 컴파일은 된다. 실행하면 `route`를 부르는 순간 panic한다(``Path segments must not start with `:`. For capture groups, use `{capture}`. …``). `/items/{id}`로 고친다.<br>
**이유:** 경로는 문자열이라 컴파일러가 문법을 모른다. 0.8은 경로 변수 문법을 `{…}`로 바꾸면서, 옛 문법을 조용히 글자 그대로 맞추는 대신 등록할 때 멈추게 했다. 라우터를 만드는 테스트가 하나라도 있으면 배포 전에 잡힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 테스트 도우미가 `app.oneshot(req)` 대신 `app.clone().oneshot(req)`를 쓴다. 왜 복제하나? 요청마다 복제하면 항목 저장소도 요청마다 따로 생기지 않나?</summary>

**답:** `oneshot`은 서비스를 `self`로 가져가기 때문에, 같은 라우터를 여러 번 쓰려면 복제본에 대고 부른다. 저장소는 따로 생기지 않는다.<br>
**이유:** 라우터를 복제하면 상태는 `Arc<AppState>`의 참조 수만 하나 오른다. 모든 복제본이 같은 `AppState`를 가리킨다. 검증 코드에서도 한 복제본으로 `POST`한 `pen`을 다른 복제본의 `GET /items/1`이 찾았다.<br>
**흔한 오답:** "`AppState`에 `Clone`이 있어야 한다." 복제되는 것은 `Arc`이므로 `AppState` 자체는 `Clone`이 아니어도 된다.

</details>


[^1]: axum 0.8.9 문서, 크레이트 첫 쪽 (Routing, Handlers, High-level features: tower를 미들웨어로 쓴다, Sharing state with handlers: 요청마다 복제되므로 `Arc`로 싸게, 기능 플래그 표: `macros`는 기본이 아니다) — https://docs.rs/axum/latest/axum/
[^2]: Announcing axum 0.8.0 (2025-01-01, Path parameter syntax changes, 중괄호 두 번 쓰기) — https://tokio.rs/blog/2025-01-01-announcing-axum-0-8-0
[^3]: axum CHANGELOG, 0.8.0 ("changing the path parameter syntax from `/:single` and `/*many` to `/{single}` and `/{*many}`") — https://github.com/tokio-rs/axum/blob/main/axum/CHANGELOG.md
[^4]: axum 문서, struct `Router` (`route`의 panic 조건, `without_v07_checks`, `Router<S>`는 상태 `S`가 빠진 라우터이고 `serve`에는 `Router<()>`만, `layer`는 이미 있는 경로에만, `route_layer`) — https://docs.rs/axum/latest/axum/struct.Router.html
[^5]: axum 문서, module `handler` (Debugging handler type errors: 핸들러 조건, `debug_handler`) — https://docs.rs/axum/latest/axum/handler/index.html
[^6]: axum 문서, module `extract` (왼쪽부터 순서대로, 본문은 한 번만이라 마지막 인자, 실패하면 핸들러를 부르지 않는다, `Result`로 거부 받기, 기본 본문 한도 2MB와 `DefaultBodyLimit`) — https://docs.rs/axum/latest/axum/extract/index.html
[^7]: axum 문서, struct `Json` (거부하는 네 경우, 마지막 추출기여야 한다, 응답에 `Content-Type: application/json`) — https://docs.rs/axum/latest/axum/struct.Json.html
[^8]: axum 문서, struct `Path` (여러 변수는 튜플이나 구조체로, `Path` 인자는 하나만) — https://docs.rs/axum/latest/axum/extract/struct.Path.html
[^9]: axum 문서, struct `State` (상태 타입이 틀리면 컴파일 오류, 잠근 `std::sync::Mutex`를 `.await` 너머로 쥐면 `!Send` 퓨처) — https://docs.rs/axum/latest/axum/extract/struct.State.html
[^10]: axum 문서, module `error_handling` (서비스는 `Infallible`, hyper까지 간 에러는 응답 없이 연결을 끊는다, 핸들러의 에러 상태는 에러가 아니다, `?`를 위한 중간 에러 타입, 에러를 내는 미들웨어는 `HandleErrorLayer`) — https://docs.rs/axum/latest/axum/error_handling/index.html
[^11]: axum 문서, module `middleware`, Ordering (`Router::layer`는 아래에서 위로, `ServiceBuilder`는 위에서 아래로) — https://docs.rs/axum/latest/axum/middleware/index.html
[^12]: tower-http 0.7 문서, struct `TimeoutLayer` (`new`는 0.6.7부터 deprecated이고 408을 돌려준다, `with_status_code`) — https://docs.rs/tower-http/latest/tower_http/timeout/struct.TimeoutLayer.html
[^13]: tower-http 0.7.1 문서, module `trace` (`TraceLayer::new_for_http`, 상태 코드로 실패를 가른다, `make_span_with`, `on_request`·`on_response`·`on_failure`) — https://docs.rs/tower-http/latest/tower_http/trace/index.html
[^14]: tower 문서, trait `ServiceExt` (`oneshot(self, req)`: "Consume this `Service`, calling it with the provided request once it is ready.") — https://docs.rs/tower/latest/tower/trait.ServiceExt.html
[^15]: axum 문서, fn `serve` (설정을 받지 않는 단순한 함수, hyper·hyper-util, HTTP/1·HTTP/2, 끝나지도 에러를 돌려주지도 않는다) — https://docs.rs/axum/latest/axum/fn.serve.html
[^16]: axum 문서, struct `serve::Serve` (`with_graceful_shutdown`, 신호 퓨처가 끝난 뒤에만 `Ok(())`) — https://docs.rs/axum/latest/axum/serve/struct.Serve.html
{% endraw %}
