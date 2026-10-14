---
layout: "note"
title: "캡스톤 4 관측성과 설정"
display_title: "캡스톤 4 관측성과 설정"
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
description: "3단계 서비스는 돌아가지만 운영하기는 어렵다. 포트와 DB가 코드에 박혀 있고, 500이 나도 왜 났는지 남는 것이 없다. 이 단계에서 세 가지를 더한다."
prev_url: "/studies/rust/capstone-3/"
prev_title: "캡스톤 3 axum API"
next_url: "/studies/rust/capstone-5/"
next_title: "캡스톤 5 안전한 종료와 부하 조절"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/capstone-4/"
---
{% raw %}
## 목표

3단계 서비스는 돌아가지만 운영하기는 어렵다. 포트와 DB가 코드에 박혀 있고, 500이 나도 왜 났는지 남는 것이 없다. 이 단계에서 세 가지를 더한다.

- 환경 변수에서 읽는 `Config`. 값마다 기본값과 허용 범위가 있고, 틀린 값이면 서버가 뜨기 전에 멈춘다.
- 로그에 찍혀도 값이 보이지 않는 `Secret<T>`.
- tracing: 저장소·서비스 함수마다 스팬(span, 시작과 끝이 있는 구간), 요청마다 스팬 하나, 사람이 읽는 형식과 JSON 형식 중 고르기.

이 단계가 없으면 이런 일이 생긴다. 컨테이너에서 띄우려고 포트를 바꾸려면 다시 컴파일해야 한다. `MAX_BODY_BYTES=16k`처럼 잘못 쓴 값을 조용히 기본값으로 바꾸면, 운영자는 설정이 먹었다고 믿는다. 설정 전체를 `{:?}`로 찍는 순간 DB 비밀번호가 로그 수집기로 간다. 사용자가 준 주소를 통째로 기록하면 `?token=…` 같은 남의 비밀도 같이 간다. 이 파일의 자체 테스트는 마지막 두 가지를 직접 확인한다.

## 사용 개념

- [설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/): 타입 있는 설정, 시작할 때 검증, 비밀값 감싸기.
- [tracing으로 관측하기](/Hongs_Blog/studies/rust/tracing-observability/): 스팬과 이벤트, `#[instrument]`, 구독자(subscriber).
- [꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/): `Debug`를 손으로 구현해 출력을 바꾼다.
- [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/): 라우터에 레이어(layer) 걸기.

## 설계 결정

| 결정 | 고른 것 | 까닭과 다른 길 |
|---|---|---|
| 설정 출처 | 환경 변수 | 배포마다 달라지는 값은 코드와 떼어 환경 변수에 두라는 것이 12-factor의 권고다[^1]. 설정 파일은 실수로 저장소에 올라가기 쉽다 |
| 읽는 방식 | `Config::from_lookup(get)` + 얇은 `from_env` | 테스트에서 `std::env::set_var`로 값을 바꾸면 안 된다. 2024 에디션에서 `unsafe` 함수가 됐고[^2], 여러 스레드가 도는 프로그램에서는 쓰지 않는 것만 안전하다고 std 문서가 적는다[^3]. `cargo test`는 테스트를 여러 스레드로 동시에 돌린다[^4]. 그래서 "키를 주면 값을 주는 함수"를 받는다 |
| 기본 바인드 | `127.0.0.1:3000` | 실수로 외부에 열리지 않게 한다. 컨테이너에서는 `0.0.0.0`을 명시해야 밖에서 닿는다(6단계 Dockerfile) |
| 틀린 값 | `ConfigError { key, reason }`, 서버는 종료 코드 2로 멈춤 | 기본값으로 바꿔 계속 뜨면 문제가 몇 주 뒤에 드러난다 |
| 에러 메시지 | 키와 이유만, 입력값은 싣지 않음 | `DATABASE_URL=postgres://admin:hunter2@db/links`가 틀렸다는 메시지에 `hunter2`가 찍히면 안 된다 |
| 비밀값 | 직접 쓴 `Secret<T>`: `Debug`만 가리고 `expose()`로 꺼냄 | `secrecy` 크레이트는 같은 일에 더해 메모리에서 지우기(zeroize)까지 한다[^5]. 이 과목 의존성 목록에 없어서 쓰지 않았다 |
| 로그 필터 | `RUST_LOG`, 없거나 틀리면 `info` | `EnvFilter::try_from_default_env`는 `RUST_LOG`가 없거나 지시문 하나라도 틀리면 에러를 낸다[^6]. 그 에러에서 `info`로 물러선다 |
| 로그 형식 | `LOG_FORMAT=json`이면 한 줄에 JSON 객체 하나 | 수집기는 줄마다 JSON을 파싱한다[^7]. 기본은 사람이 읽는 형식 |
| 기록하지 않는 것 | 사용자 URL, 요청 본문 | URL의 쿼리에는 토큰이 들어 있을 수 있다. 코드만 기록해도 링크를 찾는 데 충분하다 |
| 요청 스팬 | tower-http `TraceLayer`, 스팬과 응답 이벤트 모두 INFO | 기본 수준은 문서에 적혀 있지 않고, 문서의 예시 로그는 DEBUG로 찍혀 있다[^8]. `info` 필터에서도 보이게 명시했다 |
| 본문 상한 | `DefaultBodyLimit::max(cfg.max_body_bytes)`, 기본 16KiB | axum 기본값은 2MB다[^9]. 주소가 최대 2048바이트인 서비스에 2MB 본문을 받을 까닭이 없다 |

## 코드 설명

**하위목표 1: 설정을 타입으로 읽는다.** 문자열 그대로 들고 다니지 않고 `SocketAddr`, `usize`, 열거형으로 바꿔 둔다. 바꾸지 못하면 그 자리에서 에러다.

```rust
pub fn from_lookup(get: impl Fn(&str) -> Option<String>) -> Result<Self, ConfigError> {
    let bad = |key, reason| ConfigError { key, reason };
    let bind = match get("BIND_ADDR") {
        None => SocketAddr::from(([127, 0, 0, 1], 3000)),
        Some(v) => v.parse().map_err(|_| bad("BIND_ADDR", "expected ip:port"))?,
    };
    let database_url = get("DATABASE_URL").unwrap_or_else(|| "sqlite://links.db".into());
    if !database_url.starts_with("sqlite:") {
        return Err(bad("DATABASE_URL", "only sqlite: urls are supported"));
    }
    let max_body_bytes = match get("MAX_BODY_BYTES") {
        None => 16 * 1024,
        Some(v) => v.parse().ok()
            .filter(|n| (64..=1024 * 1024).contains(n))
            .ok_or(bad("MAX_BODY_BYTES", "expected an integer in 64..=1048576"))?,
    };
    // … LOG_FORMAT: 없거나 "pretty" → Pretty, "json" → Json, 나머지는 에러
    Ok(Self { bind, database_url: Secret::new(database_url), max_body_bytes, log_format })
}
```

`BIND_ADDR=localhost`는 에러다. `SocketAddr`의 `parse`는 이름을 찾아 주지 않고 `ip:port` 모양만 받는다. `MAX_BODY_BYTES=-1`도 `usize`로 안 바뀌어 에러다. 테스트 `config_defaults_and_errors`는 키마다 틀린 값을 넣고, 돌아온 에러의 `key`가 맞는지 본다. 테스트에서는 클로저 <code>&#124;k&#124; (k == key).then(&#124;&#124; val.to_string())</code>를 넘기기 때문에 전역 환경을 한 번도 건드리지 않는다.

**하위목표 2: 비밀값은 `Debug`에서 가린다.**

```rust
#[derive(Clone)]
pub struct Secret<T>(T);

impl<T> fmt::Debug for Secret<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("[REDACTED]")
    }
}
```

`Config`는 `#[derive(Debug)]`를 그대로 쓴다. 필드 하나만 감쌌는데 구조체 전체를 안심하고 찍을 수 있다. 시작할 때 남기는 이벤트 `tracing::info!(config = ?cfg, "starting")`의 필드는 실제로 이렇게 찍힌다.

```text
"config":"Config { bind: 127.0.0.1:0, database_url: [REDACTED], max_body_bytes: 256, log_format: Pretty }"
```

`Display`는 일부러 구현하지 않았다. `format!("{}", cfg.database_url)`은 컴파일되지 않는다. 값이 필요한 곳은 `cfg.database_url.expose()`라고 써야 하고, 그래서 비밀값을 꺼내는 자리를 검색 한 번으로 모두 찾는다.

**하위목표 3: 함수마다 스팬을 단다.** `#[instrument]`는 함수가 불릴 때마다 함수 이름의 INFO 스팬을 만들고, 인자를 모두 `Debug`로 기록한다[^10]. 기본값이 "다 기록"이라서, 기록하면 안 되는 것을 빼는 쪽으로 쓴다.

```rust
// url은 기록하지 않는다. 사용자 URL의 쿼리에 토큰이 들어 있을 수 있다.
#[instrument(skip(self, url), fields(code = %code), err(level = Level::WARN))]
async fn insert(&self, code: &Code, url: &Url) -> Result<(), StoreError> { … }

#[instrument(skip(self), fields(code = %code))]
async fn resolve(&self, code: &Code) -> Result<Option<Url>, StoreError> { … }

#[instrument(skip_all)]
pub async fn shorten<S: LinkStore>(store: &S, codes: &Mutex<CodeGen>, raw_url: &str) -> … { … }
```

- `fields(code = %code)`는 `code`를 `Display`로 남긴다. `%`는 `Display`, `?`는 `Debug`다[^11]. 인자와 같은 이름의 필드를 정의하면 그 인자는 따로 기록되지 않는다[^10]. 그래서 `code`는 `Code("pJ1XgKB")`가 아니라 `pJ1XgKB`로 한 번만 찍힌다.
- `err(level = Level::WARN)`은 `Err`가 나올 때 이벤트를 남긴다. 기본 수준은 ERROR다[^10]. 코드가 겹치는 일은 재시도로 풀리는 정상 상황이라 WARN으로 낮췄다.
- `shorten`은 `skip_all`이다. `store`의 타입 `S`와 `CodeGen`은 `Debug`가 없어서, 빼지 않으면 컴파일되지 않는다(변형 2).

서비스 함수 안에는 이벤트를 남긴다: `tracing::info!(code = %code, attempt, "link created")`, 겹쳤을 때 `tracing::warn!(attempt, "code collision, retrying")`.

**하위목표 4: 500의 원인은 로그로만 보낸다.** 3단계는 저장소 에러를 "internal error"로 가리고 원인을 버렸다. 이제 응답을 만들기 직전에 원인 사슬을 남긴다.

```rust
Self::Link(LinkError::Storage(e)) => {
    tracing::error!(error = %e, cause = ?std::error::Error::source(e), "storage failure");
    (StatusCode::INTERNAL_SERVER_ERROR, "internal", "internal error".into())
}
```

응답 본문은 3단계와 같다. 운영자는 같은 요청 스팬 안의 ERROR 줄에서 `error`(저장소 에러의 문장)와 `cause`(그 아래 sqlx 에러의 `Debug`)를 함께 본다.

**하위목표 5: 레이어를 건다.** `Router::layer`는 이미 등록된 라우트에만 붙는다[^12]. 그래서 라우트와 fallback을 다 등록한 뒤, `with_state` 다음에 건다.

```rust
.with_state(state)
.layer(DefaultBodyLimit::max(cfg.max_body_bytes))
.layer(
    TraceLayer::new_for_http()
        .make_span_with(DefaultMakeSpan::new().level(Level::INFO))
        .on_response(DefaultOnResponse::new().level(Level::INFO)),
)
```

자체 테스트는 상한을 256바이트로 두고 300바이트가 넘는 주소를 보낸다. `Json` 추출기가 본문을 모으다 상한에 걸리고, 그 거절이 3단계의 `ApiError`를 거쳐 JSON이 된다.

```text
256바이트 넘는 본문 → 413 {"error":{"kind":"bad_request","message":"Failed to buffer the request body: length limit exceeded"}}
```

**하위목표 6: 로그를 테스트한다.** 로그가 새지 않는지는 눈으로 볼 일이 아니라 테스트할 일이다. JSON 로그를 메모리에 모으는 `Capture` 작성기를 만들고, <code>with_writer(move &#124;&#124; writer.clone())</code>로 넘긴다. `Fn() -> W` 클로저가 곧 `MakeWriter`이기 때문이다[^13]. 전역 구독자는 프로세스에 하나뿐이라 `OnceLock`으로 한 번만 설치하고, `try_init`으로 이미 있으면 넘어간다[^14].

자체 테스트가 고른 요청 로그 한 줄은 이렇다.

```json
{"timestamp":"2026-10-14T15:05:34.079713Z","level":"INFO","fields":{"message":"finished processing request","latency":"0 ms","status":201},"target":"tower_http::trace::on_response","span":{"method":"POST","uri":"/links","version":"HTTP/1.1","name":"request"},"spans":[{"method":"POST","uri":"/links","version":"HTTP/1.1","name":"request"}]}
```

`spans`는 바깥 스팬부터 안쪽 스팬까지의 목록이다[^7]. 서비스 함수가 남긴 이벤트는 두 스팬 안에 있다: `"fields":{"message":"link created","code":"pJ1XgKB","attempt":1}`, `"spans":[{"method":"POST","uri":"/links",…,"name":"request"},{"name":"shorten"}]`. 수집기에서 `span.uri`로 묶으면 요청 하나에 속한 줄이 모인다. 자체 테스트가 확인하는 것은 다섯 가지다.

```rust
assert!(line.contains(r#""method":"POST""#));
assert!(logs.contains("[REDACTED]"));
assert!(!logs.contains("sqlite::memory:"), "비밀값이 로그에 샜다");
assert!(!logs.contains("token=abc"), "사용자 URL이 로그에 샜다");
assert!(logs.contains(&format!(r#""code":"{code}""#)));
```

자체 테스트가 보내는 주소는 `https://example.com/x?token=abc`다. 리다이렉트 응답의 `Location`에는 이 주소가 그대로 있어야 하고, 로그에는 없어야 한다. 두 조건을 같이 확인한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: rustfmt·clippy(`-D warnings`)·테스트 4개(`self_check_passes`, `create_then_follow`, `config_defaults_and_errors`, `secret_is_redacted_in_debug`)·자체 테스트 통과, `ALL CHECKS PASSED` — [46_capstone-4_p1.rs](/Hongs_Blog/studies/rust/code/46_capstone-4_p1/). 위의 `starting`·`link created` 줄과 변형 문제의 답은 같은 파일 사본에 로그 출력이나 한 줄 수정을 넣어 실행한 결과다.</div>

</div>


## 변형 문제

**변형 1.** `insert`의 `#[instrument(skip(self, url), …)]`를 `skip(self)`로 줄였다. 자체 테스트의 `assert!(!logs.contains("token=abc"))`는 실패하는가? 실패하지 않는다면 언제 URL이 새는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

실패하지 않는다. 실행하면 `ALL CHECKS PASSED`가 나온다. 스팬의 필드는 그 스팬 안에서 이벤트가 찍힐 때 함께 나간다. 삽입이 성공하면 `insert` 스팬 안에서는 이벤트가 하나도 없고, `link created`는 `insert`가 끝난 뒤 `shorten` 스팬에서 찍힌다.

코드가 겹치면 이야기가 달라진다. 씨앗 3이 처음 낼 코드를 미리 넣어 두고 실행하면 `err(level = WARN)`이 `insert` 스팬 안에서 이벤트를 남기고, 그 줄에 `"span":{"code":"pJ1XgKB","url":"Url(\"https://example.com/x?token=abc\")","name":"insert"}`가 찍힌다. 그래서 `사용자 URL이 로그에 샜다` 단언이 실패한다. 로그 누출 테스트는 성공 경로만이 아니라 에러 경로도 지나가게 짜야 한다.

</details>


**변형 2.** `shorten`의 `#[instrument(skip_all)]`을 `#[instrument]`로 바꾸면 컴파일되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

컴파일되지 않는다. `#[instrument]`는 건너뛰지 않은 인자를 모두 `Debug`로 기록한다[^10]. 실제 에러는 E0277 네 개다: ``error[E0277]: `S` doesn't implement `Debug` ``와 ``error[E0277]: `CodeGen` doesn't implement `Debug` ``가 두 번씩 나온다. `S: Debug` 경계를 더하거나 `CodeGen`에 `Debug`를 derive하면 컴파일은 된다. 하지만 그러면 `raw_url`도 기록되어 변형 1과 같은 누출이 생긴다. 이 함수에서는 `skip_all`이 맞다.

</details>


**변형 3.** 테스트에서 `Config::from_lookup` 대신 `unsafe { std::env::set_var("MAX_BODY_BYTES", "10") }` 뒤에 `Config::from_env()`를 부르면 무엇이 문제인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

2024 에디션에서는 `set_var`가 `unsafe`라서 블록 없이는 컴파일되지 않는다[^2]. `unsafe`로 감싸도 문제는 그대로다. std 문서는 Windows가 아닌 운영체제의 다중 스레드 프로그램에서는 `set_var`를 아예 쓰지 않는 것만 안전하다고 적는다[^3]. `cargo test`는 테스트를 여러 스레드로 동시에 돌리고, 환경 변수 같은 공유 상태에 기대지 말라고 한다[^4]. 다른 테스트가 같은 순간 `from_env()`로 `MAX_BODY_BYTES`를 읽으면 `10`을 보고 실패할 수도 있다. 함수를 받는 `from_lookup`은 테스트마다 자기만의 "환경"을 넘기므로 이런 간섭이 없다.

</details>


[^1]: The Twelve-Factor App, III. Config(배포마다 바뀌는 값은 코드와 엄격히 떼어 환경 변수에) — https://12factor.net/config
[^2]: Edition Guide, Rust 2024 "Unsafe functions"(`std::env::set_var`, `remove_var`가 `unsafe`가 됨) — https://doc.rust-lang.org/edition-guide/rust-2024/newly-unsafe-functions.html
[^3]: std 문서, `std::env::set_var`의 Safety(다중 스레드 프로그램에서는 Windows가 아니면 쓰지 않는 것만 안전) — https://doc.rust-lang.org/std/env/fn.set_var.html
[^4]: The Rust Programming Language, 11.2 Controlling How Tests Are Run("run in parallel using threads", 환경 변수 같은 공유 상태에 기대지 말 것) — https://doc.rust-lang.org/book/ch11-02-running-tests.html
[^5]: secrecy 문서, 크레이트 소개(`SecretBox`, `ExposeSecret`, 디버그 로그로 새지 않게, drop 때 zeroize) — https://docs.rs/secrecy/latest/secrecy/
[^6]: tracing-subscriber 문서, struct `EnvFilter`(`DEFAULT_ENV`는 `RUST_LOG`, `try_from_default_env`는 없거나 틀린 지시문이면 에러) — https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html
[^7]: tracing-subscriber 문서, struct `fmt::format::Json`(줄마다 JSON, `fields`, 바깥부터 안쪽 순서의 `spans`) — https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/struct.Json.html
[^8]: tower-http 0.7.1 문서, `trace` 모듈(`new_for_http`, `DefaultMakeSpan`, `DefaultOnResponse::level`, 예시 출력은 DEBUG) — https://docs.rs/tower-http/0.7.1/tower_http/trace/index.html
[^9]: axum 0.8.9 문서, struct `DefaultBodyLimit`(`Bytes` 기반 추출기는 기본 2MB, `max(n)`으로 바꿈) — https://docs.rs/axum/0.8.9/axum/extract/struct.DefaultBodyLimit.html
[^10]: tracing 0.1.44 문서, attribute macro `instrument`(기본 INFO, 인자를 `Debug`로 기록, `skip`·`skip_all`·`fields`, 같은 이름 필드는 인자를 건너뜀, `err`는 기본 ERROR이고 `err(level = …)`로 바꿈) — https://docs.rs/tracing/0.1.44/tracing/attr.instrument.html
[^11]: tracing 문서, 크레이트 소개의 Recording Fields(`?`는 `Debug`, `%`는 `Display`) — https://docs.rs/tracing/latest/tracing/
[^12]: axum 0.8.9 문서, `Router::layer`("the middleware is only applied to existing routes") — https://docs.rs/axum/0.8.9/axum/struct.Router.html
[^13]: tracing-subscriber 문서, trait `MakeWriter`(`F: Fn() -> W`인 클로저에 구현돼 있다) — https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/trait.MakeWriter.html
[^14]: tracing-subscriber 0.3.23 문서, `fmt` 모듈(`try_init`은 구독자가 아직 없을 때만 설치, `RUST_LOG` 필터와 `try_from_default_env` 물러서기 예) — https://docs.rs/tracing-subscriber/0.3.23/tracing_subscriber/fmt/index.html
{% endraw %}
