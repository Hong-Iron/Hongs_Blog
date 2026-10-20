---
layout: "note"
title: "캡스톤 3 axum API"
display_title: "캡스톤 3 axum API"
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
description: "2단계 저장소 앞에 HTTP 문을 단다. 이 단계가 끝나면 서비스는 세 가지 요청에 답한다."
prev_url: "/studies/rust/capstone-2/"
prev_title: "캡스톤 2 SQLite 저장소"
next_url: "/studies/rust/capstone-4/"
next_title: "캡스톤 4 관측성과 설정"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "46_capstone-3_p1.rs", "u": "/studies/rust/code/46_capstone-3_p1/", "r": "문제 1 풀이"}]
permalink: "/studies/rust/capstone-3/"
---
{% raw %}
## 목표

2단계 저장소 앞에 HTTP 문을 단다. 이 단계가 끝나면 서비스는 세 가지 요청에 답한다.

- `POST /links`, 본문 `{"url": "…"}` → 201과 `{"code": "…", "url": "…"}`.
- `GET /{code}` → 307과 `Location: <원래 주소>`. 없는 코드는 404.
- `GET /health` → 200과 `{"status":"ok"}`.

실패는 모두 `{"error":{"kind":"…","message":"…"}}` 모양의 JSON으로 답한다. 예외는 하나다. 경로는 맞는데 메서드가 틀린 요청(`GET /links`)에는 라우터가 빈 본문의 405를 직접 낸다. 이 구멍은 변형 2에서 막는다.

이 단계를 대충 하면 운영에서 세 가지가 깨진다. 첫째, axum의 기본 거절 응답은 평문(`text/plain`)이라서 JSON을 기대하는 클라이언트가 415·400 응답을 읽다가 파싱 에러를 낸다. 둘째, 저장소 에러를 문자열로 그대로 돌려주면 DB 드라이버의 메시지가 바깥에 보인다. 셋째, 영구 이동(301·308)으로 보내면 브라우저가 그 답을 기억해서, 링크를 지워도 사람들이 계속 옛 주소로 간다.

## 사용 개념

- [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/): `Router`, 추출기(extractor), `IntoResponse`.
- [제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/): `AppState<S>`와 `create_link::<S>`.
- [Rc·Arc·Weak](/Hongs_Blog/studies/rust/rc-arc-weak/): 요청마다 상태를 복제해도 실제 저장소는 하나다.
- [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/): 서비스 에러를 HTTP 응답 하나로 바꾸는 경계.
- [테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/): 소켓 없이 라우터에 요청을 넣는 테스트.

## 설계 결정

| 결정 | 고른 것 | 까닭과 다른 길 |
|---|---|---|
| 상태 공유 | 제네릭 `AppState<S>`, 필드는 `Arc` | `Arc<dyn LinkStore>`가 더 짧아 보이지만 2단계 트레이트는 메서드마다 `impl Future`를 돌려줘서 `dyn`으로 쓸 수 없다. 그래서 라우터에 `create_link::<S>`처럼 타입을 박아 등록한다 |
| `Clone` | 손으로 쓴 `impl<S> Clone` | `#[derive(Clone)]`은 제네릭 매개변수에 `Clone` 경계를 붙인다[^1]. `SqliteStore`는 `Clone`이 아니라서 derive하면 `AppState<SqliteStore>`도 `Clone`이 아니게 된다. axum의 `State`로 꺼내려면 상태 타입이 `Clone`이어야 한다[^2] |
| 본문 거절 처리 | 인자를 `Result<Json<CreateLink>, JsonRejection>`으로 받는다 | 그냥 `Json<…>`으로 받으면 거절될 때 핸들러가 불리지 않고 axum의 기본 응답이 나간다. `Result`로 감싸면 핸들러가 거절 값을 받는다[^3] |
| 모르는 필드 | `#[serde(deny_unknown_fields)]` | serde는 기본으로 JSON의 모르는 필드를 무시한다[^4]. `{"url": …, "x": 1}`을 조용히 받아 주면 클라이언트가 이름을 틀려도 모른다 |
| 상태 코드 | 잘못된 URL 422, 없음 404, 재시도 소진 503, 저장소 고장 500 | JSON 문법이 깨진 400과 뜻이 틀린 422를 axum이 이미 나눠 준다. 도메인 검사 실패도 "문법은 맞는데 뜻이 틀림"이라 422로 맞췄다 |
| 리다이렉트 | `Redirect::temporary`(307) | `Redirect::to`는 303이고 다음 요청을 GET으로 바꾼다. 307은 메서드와 본문을 그대로 둔다[^5]. 308(`permanent`)은 따로 지시가 없어도 캐시될 수 있는 응답이고 307은 아니다[^6] |
| 형식이 틀린 코드 | 404 | 400을 주면 "그런 형식은 없다"와 "그런 링크는 없다"를 구별해 알려 준다. 2단계 `resolve`가 DB에 묻지 않고 바로 `NotFound`를 내는 것을 그대로 쓴다 |
| 없는 경로 | `.fallback(not_found)` | `/a/b/c`처럼 어떤 라우트에도 안 맞는 경로도 같은 JSON 404를 받는다 |

## 코드 설명

**하위목표 1: 상태를 정한다.** 핸들러가 함께 쓰는 것은 저장소와 코드 생성기 둘이다. 둘 다 `Arc`로 감싸서 복제가 참조 수 하나 올리는 일로 끝나게 한다.

```rust
pub struct AppState<S> {
    store: Arc<S>,
    codes: Arc<Mutex<CodeGen>>,
}

// #[derive(Clone)]은 S: Clone을 요구하므로 손으로 쓴다.
impl<S> Clone for AppState<S> {
    fn clone(&self) -> Self {
        Self { store: Arc::clone(&self.store), codes: Arc::clone(&self.codes) }
    }
}
```

`Mutex`는 std 것이다. 2단계에서 본 대로 잠금은 `next_code()` 한 줄에서 풀리고 `.await`를 넘지 않는다.

**하위목표 2: 실패를 응답 하나로 모은다.** axum은 모든 서비스가 실패하지 않을 것(`Infallible`)을 요구한다. 에러가 hyper까지 올라가면 응답 없이 연결이 끊기기 때문이다[^7]. 그래서 핸들러의 에러는 `IntoResponse`를 구현한 타입이어야 한다.

```rust
pub enum ApiError {
    BadJson(JsonRejection),
    Link(LinkError),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, kind, message) = match &self {
            Self::BadJson(r) => (r.status(), "bad_request", r.body_text()),
            Self::Link(LinkError::Invalid(e)) => (StatusCode::UNPROCESSABLE_ENTITY, "invalid_url", e.to_string()),
            Self::Link(LinkError::NotFound) => (StatusCode::NOT_FOUND, "not_found", "no such link".into()),
            Self::Link(LinkError::CodeSpaceExhausted(_)) => (StatusCode::SERVICE_UNAVAILABLE, "unavailable", "try again later".into()),
            // 내부 원인(DB 메시지)은 응답에 싣지 않는다. 4단계에서 로그로 남긴다.
            Self::Link(LinkError::Storage(_)) => (StatusCode::INTERNAL_SERVER_ERROR, "internal", "internal error".into()),
        };
        let body = serde_json::json!({ "error": { "kind": kind, "message": message } });
        (status, Json(body)).into_response()
    }
}
```

`From<JsonRejection>`과 `From<LinkError>`를 구현해 두어서 핸들러 안에서 `?` 하나로 바뀐다. 거절 쪽은 axum이 정한 상태 코드(`r.status()`)와 문장(`r.body_text()`)을 그대로 쓰고 겉모양만 우리 JSON으로 바꾼다. `DomainError`의 메시지는 1단계에서 바깥에 보여도 되는 문장만 골랐으므로 그대로 싣는다. `Storage`만 "internal error"로 가린다.

**하위목표 3: 핸들러.** 본문을 읽는 추출기는 인자 목록의 맨 끝에 와야 한다. 본문은 한 번만 읽을 수 있기 때문이다[^8].

```rust
async fn create_link<S: LinkStore>(
    State(st): State<AppState<S>>,
    body: Result<Json<CreateLink>, JsonRejection>,
) -> Result<(StatusCode, Json<LinkBody>), ApiError> {
    let Json(req) = body?;
    let (code, url) = shorten(&*st.store, &st.codes, &req.url).await?;
    Ok((StatusCode::CREATED, Json(LinkBody { code: code.to_string(), url: url.to_string() })))
}

async fn follow<S: LinkStore>(
    State(st): State<AppState<S>>,
    Path(code): Path<String>,
) -> Result<Redirect, ApiError> {
    let url = resolve(&*st.store, &code).await?;
    Ok(Redirect::temporary(url.as_str()))
}
```

`Redirect`는 주소를 헤더 값으로 바꾸다 실패하면 500을 낸다[^12]. 1단계가 보이는 ASCII만 받기 때문에 이 경로는 생기지 않는다. 6단계의 성질 테스트(property-based testing)가 이 약속을 지킨다.

**하위목표 4: 라우터를 조립한다.** axum 0.8부터 경로 변수는 `/:code`가 아니라 `/{code}`로 쓴다[^9].

```rust
pub fn router<S: LinkStore>(state: AppState<S>) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/links", post(create_link::<S>))
        .route("/{code}", get(follow::<S>))
        .fallback(not_found)
        .with_state(state)
}
```

`/links`는 `/{code}`와도 모양이 맞지만, 고정 경로가 먼저 잡힌다. 그래서 `GET /links`는 리다이렉트 시도가 아니라 405가 된다. fallback은 어떤 라우트에도 안 맞는 경로에만 불리고, 경로는 맞는데 메서드가 틀린 경우에는 불리지 않는다[^10]. `with_state`를 부르면 상태를 다 채운 `Router<()>`가 되고, `axum::serve`에는 이것만 넘길 수 있다[^10].

라우터 테스트와 같은 요청을 넣어 응답 본문까지 찍어 보면 이렇다.

```text
POST text/plain        → 415 {"error":{"kind":"bad_request","message":"Expected request with `Content-Type: application/json`"}}
{"url":                → 400 {"error":{"kind":"bad_request","message":"Failed to parse the request body as JSON: url: EOF while parsing a value at line 1 column 7"}}
{"link":"http://a.b"}  → 422 {"error":{"kind":"bad_request","message":"Failed to deserialize the JSON body into the target type: link: unknown field `link`, expected `url` at line 1 column 7"}}
{"url":"http://user@a.b"} → 422 {"error":{"kind":"invalid_url","message":"url must not contain user info (user@host)"}}
GET /a/b/c             → 404 {"error":{"kind":"not_found","message":"no such link"}}
GET /links             → 405 (본문 없음, allow: POST)
```

`deny_unknown_fields`가 없었다면 `{"link": …}`는 "`url` 필드가 없다"는 메시지를 받았을 것이다. 지금은 무엇이 틀렸는지(`link`라는 모르는 필드)를 정확히 알려 준다.

**하위목표 5: 테스트한다.** `tower::ServiceExt::oneshot`은 서비스를 소비해서 준비되면 요청 하나를 넣는다[^11]. `Router`는 서비스이므로 소켓을 열지 않고 요청을 넣고 응답을 받는다. 테스트마다 `app.clone()`을 넘기는 까닭은 `oneshot`이 서비스를 가져가기 때문이다.

```rust
async fn send(app: Router, method: &str, uri: &str, ctype: &str, body: &str) -> Response {
    let req = Request::builder()
        .method(method).uri(uri).header("content-type", ctype)
        .body(Body::from(body.to_owned())).unwrap();
    app.oneshot(req).await.unwrap()
}
```

`bad_requests_get_json_errors`는 위 표의 415·400·422 다섯 경우가 상태 코드와 `error.kind`를 모두 갖췄는지 본다. 응답 본문은 `axum::body::to_bytes(…, 64 * 1024)`처럼 상한을 주고 읽는다. 상한 없이 읽으면 테스트도 큰 응답에 메모리를 다 쓴다.

자체 테스트(`self_check`)만 진짜 소켓을 쓴다. `127.0.0.1:0`으로 열어 운영체제가 빈 포트를 고르게 하고, 하네스에 HTTP 클라이언트 크레이트가 없어서 `TcpStream`에 요청 줄을 직접 써서 보낸다. 끝나면 `oneshot` 채널로 `with_graceful_shutdown`에 신호를 준다. 실행 출력은 이렇다.

```text
POST /links → 201 {"code":"pJ1XgKB","url":"https://example.com/x"}
잘못된 URL → 422 {"error":{"kind":"invalid_url","message":"url must start with http:// or https://"}}
ALL CHECKS PASSED
```

씨앗을 3으로 고정해서 코드는 실행할 때마다 `pJ1XgKB`다. 남은 문제는 `serve_forever`다. 주소 `127.0.0.1:3000`과 DB `sqlite://links.db`가 코드에 박혀 있어서, 다른 포트나 DB로 띄우려면 다시 컴파일해야 한다. 4단계가 이것을 설정으로 뺀다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: rustfmt·clippy(`-D warnings`)·테스트 4개(`self_check_passes`, `create_then_follow`, `bad_requests_get_json_errors`, `wrong_method_is_405`)·자체 테스트 통과, `ALL CHECKS PASSED` — [46_capstone-3_p1.rs](/Hongs_Blog/studies/rust/code/46_capstone-3_p1/). 위 응답 표와 변형 문제의 답은 같은 파일의 사본에 출력 줄이나 한 줄 수정을 넣어 실행한 결과다.</div>

</div>


## 변형 문제

**변형 1.** `create_link`의 인자를 `body: Result<Json<CreateLink>, JsonRejection>` 대신 `Json(req): Json<CreateLink>`로 바꾸고 `let Json(req) = body?;` 줄을 지운다. 컴파일되는가? `Content-Type: text/plain`으로 보낸 요청의 응답은 어떻게 바뀌고, 어느 테스트가 실패하는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

컴파일된다. 상태 코드는 그대로 415다. 바뀌는 것은 본문이다. 핸들러가 불리지 않고 axum의 기본 거절 응답이 나가서 `content-type: text/plain; charset=utf-8`에 본문은 ``Expected request with `Content-Type: application/json` ``(54바이트)가 된다. 400도 같은 식으로 평문이 된다. `bad_requests_get_json_errors`가 실패한다. 상태 코드 검사는 통과하지만 `json_of`가 평문을 JSON으로 읽다가 `unwrap`에서 패닉한다. 상태 코드만 보는 테스트였다면 이 회귀를 놓쳤을 것이다.

</details>


**변형 2.** `GET /links`와 `DELETE /abcdefg`의 405도 우리 JSON 모양으로 답하게 하려면 라우터에 무엇을 더하는가? `Allow` 헤더는 남는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`Router::method_not_allowed_fallback`에 핸들러를 준다. 경로에 등록된 메서드 라우터가 있는데 메서드가 틀렸을 때만 불린다[^10].

```rust
async fn method_not_allowed() -> (StatusCode, Json<serde_json::Value>) {
    (StatusCode::METHOD_NOT_ALLOWED,
     Json(serde_json::json!({ "error": { "kind": "method_not_allowed", "message": "method not allowed" } })))
}
// router(): .fallback(not_found).method_not_allowed_fallback(method_not_allowed)
```

실행해 보면 `GET /links`는 405에 `content-type: application/json`, `allow: POST`, 본문 `{"error":{"kind":"method_not_allowed","message":"method not allowed"}}`를 받는다. `DELETE /abcdefg`는 `allow: GET,HEAD`가 남는다. `Allow` 헤더는 axum이 그대로 붙여 준다.

</details>


**변형 3.** `create_link`의 두 인자 순서를 바꿔 `body`를 먼저, `State(st)`를 나중에 쓴다. 컴파일되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

컴파일되지 않는다. 함수 자체는 문제없지만, 라우터에 등록하는 `post(create_link::<S>)` 줄에서 E0277이 난다. 실제 메시지는 ``the trait bound `fn(Result<Json<_>, _>, _) -> _ {create_link::<S>}: Handler<_, _>` is not satisfied``이고, 덧붙인 설명은 `Consider using #[axum::debug_handler] to improve the error message`다. 본문을 소비하는 추출기는 마지막 인자만 될 수 있기 때문이다[^8]. 메시지가 원인을 직접 말해 주지 않으므로, 핸들러 에러가 이 모양이면 `#[axum::debug_handler]`를 붙여 다시 컴파일해 본다.

</details>


[^1]: std 문서, trait `Clone`의 "Derivable"(제네릭 구조체에서는 매개변수에 `Clone` 경계를 붙여 조건부로 구현) — https://doc.rust-lang.org/std/clone/trait.Clone.html
[^2]: axum 문서, struct `State`(공유 상태는 `Arc`로 감싼다, `FromRef<T> for T`는 `T: Clone`을 요구) — https://docs.rs/axum/latest/axum/extract/struct.State.html
[^3]: axum 0.8.9 문서, `extract` 모듈의 추출기 거절(rejection) 설명(`Result<Json<Value>, JsonRejection>`로 받으면 요청이 자동으로 거절되지 않고 핸들러가 거절 값을 받는다) — https://docs.rs/axum/0.8.9/axum/extract/index.html
[^4]: serde 문서, Container attributes의 `deny_unknown_fields`("by default unknown fields are ignored for self-describing formats like JSON") — https://serde.rs/container-attrs.html
[^5]: axum 0.8.9 문서, struct `Redirect`(`to`는 303, `temporary`는 307로 메서드와 본문 유지, `permanent`는 308) — https://docs.rs/axum/0.8.9/axum/response/struct.Redirect.html
[^6]: RFC 9110 HTTP Semantics, 15.1 Overview of Status Codes(따로 지시 없이 캐시될 수 있는 상태 코드 목록에 308이 있고, 나머지는 아니다)와 15.4 Redirection 3xx(307·308은 메서드를 바꾸지 않는 리다이렉트) — https://www.rfc-editor.org/rfc/rfc9110.html
[^7]: axum 문서, `error_handling` 모듈(서비스의 에러 타입은 `Infallible`, 에러가 hyper에 닿으면 응답 없이 연결이 끊긴다) — https://docs.rs/axum/latest/axum/error_handling/index.html
[^8]: axum 0.8.9 문서, struct `Json`(거절 조건 네 가지, 추출기가 여럿이면 `Json`은 마지막이어야 한다) — https://docs.rs/axum/0.8.9/axum/struct.Json.html
[^9]: Tokio Blog, "Announcing axum 0.8.0"(2025-01-01), 경로 문법 `/:single` → `/{single}` — https://tokio.rs/blog/2025-01-01-announcing-axum-0-8-0
[^10]: axum 0.8.9 문서, struct `Router`의 `fallback`·`method_not_allowed_fallback`·`with_state`(`Router<()>`만 `axum::serve`에 넘길 수 있다) — https://docs.rs/axum/0.8.9/axum/struct.Router.html
[^11]: tower 0.5.3 문서, trait `ServiceExt::oneshot`("Consume this `Service`, calling it with the provided request once it is ready") — https://docs.rs/tower/0.5.3/tower/trait.ServiceExt.html
[^12]: axum 0.8.9 소스, `impl IntoResponse for Redirect`(`HeaderValue::try_from` 실패 시 `INTERNAL_SERVER_ERROR`) — https://docs.rs/axum/0.8.9/src/axum/response/redirect.rs.html
{% endraw %}
