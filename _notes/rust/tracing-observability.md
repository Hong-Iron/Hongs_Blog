---
layout: "note"
title: "tracing으로 관측하기"
display_title: "tracing으로 관측하기 (tracing)"
kind: "concept"
kind_label: "기법"
num: "43"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["tracing", "Tracing", "Observability", "관측", "Span", "스팬", "Event", "이벤트", "#[instrument]", "instrument", "Subscriber", "구독자", "EnvFilter", "RUST_LOG", "JSON 로그", "Structured Logging", "구조화 로그", "Request ID", "요청 ID", "OpenTelemetry", "tracing-opentelemetry", "FmtSpan"]
description: "로그를 한 줄씩 따로 남기는 대신, \"이 요청을 처리하는 동안\"이라는 구간을 열고 그 안에서 찍은 줄마다 구간의 이름표를 저절로 붙인다. 그래서 요청 여러 개가 한 스레드에서 번갈아 돌아도, 줄마다 어느 요청 것인지 가려낼 수 있다. 대신 무엇을 이름표로 남길지는 사람이 정한다. …"
prev_url: "/studies/rust/testing-strategy/"
prev_title: "테스트 전략"
next_url: "/studies/rust/configuration-secrets/"
next_title: "설정과 비밀값"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/tracing-observability/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

로그를 한 줄씩 따로 남기는 대신, "이 요청을 처리하는 동안"이라는 구간을 열고 그 안에서 찍은 줄마다 구간의 이름표를 저절로 붙인다. 그래서 요청 여러 개가 한 스레드에서 번갈아 돌아도, 줄마다 어느 요청 것인지 가려낼 수 있다. 대신 무엇을 이름표로 남길지는 사람이 정한다. 함수에 구간을 다는 표시는 기본으로 함수 인자를 모두 기록하므로, 비밀번호 같은 인자는 직접 빼야 한다.

</div>


## 예시로 보기

async 서버에서는 요청 하나가 끝나기 전에 다른 요청이 끼어든다([tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)). 요청마다 `println!("start {path}")`, `println!("done {path}")`를 찍으면 줄이 이렇게 섞인다.

```text
start /a
start /b
done /b
done /a
```

경로가 다르면 그나마 짝을 맞출 수 있다. 같은 경로로 요청 두 개가 오면 어느 `done`이 어느 `start`의 짝인지 알 길이 없다. 요청마다 번호를 매기고, 그 요청 안에서 찍는 모든 줄에 번호를 붙여야 한다. 줄마다 손으로 번호를 넘기면 함수 인자가 번호로 도배된다.

tracing은 이 번호를 "구간"에 한 번만 적는다. 구간 안에서 찍은 줄에는 구간의 필드가 저절로 붙는다.

```rust
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
```

`tokio::join!(request("/a"), request("/b"))`로 두 요청을 한 스레드에서 번갈아 돌리면, 찍힌 줄의 순서와 줄마다 붙은 `request_id`는 이랬다.

```text
[("start /a", 1), ("start /b", 2), ("done /b", 2), ("done /a", 1)]
```

`handle` 안에는 번호를 다루는 코드가 한 줄도 없다. 그래도 `/b`의 줄은 모두 2번, `/a`의 줄은 모두 1번을 달고 나왔다. 이 구간을 span, 구간 안에서 한 순간에 찍는 줄을 event라 부른다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 순서와 요청 ID, guard를 `.await` 너머로 쥔 틀린 판, `#[instrument]`의 필드와 `skip`, `%`와 `?`, 필터 지시문 다섯 가지, 지시문 오타와 크레이트 이름의 `-`, JSON 줄의 모양, span이 닫힐 때 찍히는 시간을 출력을 붙잡아 확인했다 — [43_tracing-observability_verify.rs](/Hongs_Blog/studies/rust/code/43_tracing-observability_verify/). OpenTelemetry 내보내기는 이 과목의 실행 환경에 크레이트가 없어 돌려 보지 않았다.</div>

</div>


## span과 event

span은 시작과 끝이 있는 시간 구간이다. event는 한 순간에 일어난 일이고, span 안에서 일어날 수 있다[^1].

```text
시간 →
request id=1  [=====================================]   span
               start ●                      done ●     event
request id=2        [====================]
                     start ●       done ●
```

- 수준은 다섯 가지다. 매크로 이름이 곧 수준이다: `trace!`, `debug!`, `info!`, `warn!`, `error!`[^1].
- 찍힌 span과 event를 받아서 어디에 쓸지 정하는 쪽을 구독자(subscriber)라 부른다. 구독자는 메타데이터(수준, target 등)를 보고 관심 없는 것을 거른다. 관심 있는 구독자가 하나도 없으면 그 span이나 event는 아예 만들어지지 않는다[^1].
- 구독자를 거는 것은 실행 파일의 일이다. 라이브러리가 전역 구독자를 걸면, 그 라이브러리를 쓰는 실행 파일이 나중에 자기 구독자를 걸 때 부딪친다[^1].

JSON 구독자로 찍은 첫 줄은 이렇다.

```json
{"fields":{"attempts":1,"message":"login ok"},"level":"INFO","span":{"name":"login","user":"alice"},"spans":[{"name":"login","user":"alice"}],"target":"r_43_tracing_observability_verify","timestamp":"2026-10-14T15:05:33.787483Z"}
```

| 키 | 담긴 것 |
|---|---|
| `fields` | event의 메시지(`message`)와 키=값 필드 |
| `span` | 지금 들어가 있는 span과 그 필드 |
| `spans` | 들어가 있는 span 전부. 바깥에서 안쪽 순서[^6] |
| `target` | event를 찍은 모듈 경로. 따로 적지 않으면 매크로를 부른 모듈 경로다[^1] |
| `level`, `timestamp` | 수준과 시각 |

`target`이 `r_43_tracing_observability_verify`인 것은 검사 도구가 이 파일을 그 이름의 실행 파일로 빌드했기 때문이다. 내 프로젝트라면 `shortener::db`처럼 크레이트 이름과 모듈 경로가 온다([모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)).

## #[instrument]로 함수에 span 달기

함수 위에 `#[instrument]`를 붙이면, 함수가 불릴 때마다 함수 이름의 span을 만들고 들어간다. 따로 정하지 않으면 수준은 INFO다[^2].

```rust
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
```

- **인자는 기본으로 모두 필드가 된다.** 정수·문자열처럼 tracing이 직접 아는 타입은 그대로, 나머지는 `Debug` 출력으로 남는다[^2]. 검증 코드에서 `skip`을 뺀 판 `login_leaky("carol", "s3cret-pass")`의 span은 `{"name":"login_leaky","password":"s3cret-pass","user":"carol"}`였다. 비밀번호가 그대로 찍혔다.
- **`skip(password)`** 은 그 인자를 뺀다. `skip_all`은 인자를 전부 뺀다. 뺀 인자는 `Debug`를 구현하지 않아도 된다[^2]. 위 `login`으로 찍은 줄 전체에 `hunter2`라는 글자는 없었다.
- **`fields(...)`** 는 필드를 더한다. 값은 함수 몸통이 시작될 때 계산된다[^2].
- **나중에 채우는 필드.** `fields(status = tracing::field::Empty)`로 이름만 먼저 선언하고, 몸통에서 `Span::current().record("status", "paid")`로 값을 넣는다[^1]. 선언하지 않은 이름을 `record`하면 오류 없이 아무 일도 일어나지 않는다[^3]. 이 차이는 [서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/)의 p3에서 직접 확인한다.
- **`ret`와 `err`.** `ret`는 함수가 돌려준 값을 event로 찍는다. `Result`면 `Ok`일 때만 찍는다. `err`는 `Err`를 돌려줄 때 ERROR 수준 event를 찍고, 기본으로 `Display`로 적는다[^2].
- `async fn`에도 붙일 수 있다[^2].

### 필드 값을 적는 법

`?`를 앞에 붙이면 그 값의 `Debug` 출력으로, `%`를 붙이면 `Display` 출력으로 남긴다[^1]. 위 `login("bob", "pw")`가 찍은 WARN 줄의 필드는 `"reason": "(\"too short\", 2)"`였다. 튜플은 `Display`가 없어서 `%`로는 적을 수 없다. `user = %user`는 따옴표 없는 사람용 글자를 남긴다.

## async 코드에서 span 붙이기

동기 코드라면 `let _g = span.enter();`로 span에 들어가고, `_g`가 사라질 때 나온다[^1]. async 코드에서는 이 방법이 틀린다. `Span::enter`가 돌려준 guard를 `.await` 너머로 쥐고 있으면 trace가 틀어진다고 문서가 경고한다[^1][^3].

까닭은 퓨처가 멈추는 방식에 있다([Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)). `.await`에서 퓨처가 멈춰도 guard는 살아 있다. 그래서 스레드는 여전히 "지금 이 span 안"이라고 여긴다. 그사이 같은 스레드에서 도는 다른 요청이 span에 들어가면, 스레드에는 span 두 개가 겹쳐 쌓인다. 먼저 멈췄던 요청이 다시 돌 때 맨 위에 있는 것은 남의 span이다.

```rust
async fn request_entered(path: &'static str) {
    let id = NEXT_ID.fetch_add(1, Ordering::Relaxed);
    let _g = info_span!("request", request_id = id).entered(); // guard를 쥔 채로
    handle(path).await;                                          // .await
}
```

이 판을 두 가지 방법으로 번갈아 돌렸다.

```text
tokio::join!   [("start /a", 3), ("start /b", 4), ("done /b", 4), ("done /a", 3)]
futures::join! [("start /a", 5), ("start /b", 6), ("done /a", 6), ("done /b", 6)]
```

첫 줄은 맞게 나왔다. `/b`가 먼저 다시 돌아 자기 span을 닫은 덕분이다. 둘째 줄은 `/a`가 먼저 다시 돌았고, `done /a`에 `/b`의 번호 6이 붙었다. 같은 코드가 운에 따라 맞기도 틀리기도 한다.

`.instrument(span)`은 퓨처가 poll될 때마다 span에 들어가고, 퓨처가 멈추면 나온다[^3][^4]. 위 예시가 이 방법을 썼고, 번갈아 돌아도 이름표가 섞이지 않았다. `tokio::spawn`으로 새 태스크를 띄울 때 지금 span을 넘기려면 `.in_current_span()`을 붙인다[^4].

## 필터: EnvFilter와 RUST_LOG

운영 중에는 INFO만 보다가, 문제가 생긴 모듈 하나만 DEBUG로 자세히 보고 싶다. 이것을 정하는 글자가 지시문(directive)이다. 모양은 `target[span{field=value}]=level`이고, 쉼표로 여러 개를 잇는다[^5]. 수준만 적은 지시문(`info`)은 다른 지시문이 켜지 않은 나머지 전부의 최대 수준이 된다[^5].

검증 코드는 같은 장면을 지시문만 바꿔 다섯 번 돌렸다.

| 지시문 | 결과 |
|---|---|
| `info` | `db` 모듈의 DEBUG 쿼리 줄이 없다 |
| `info,r_43_tracing_observability_verify::db=debug` | 쿼리 줄 2개가 DEBUG로 더 나온다. 그 줄의 `spans`에는 바깥 `request` span이 들어 있다 |
| `warn` | 1줄뿐이다. `login rejected` |
| `info,r_43_tracing_observability_verify::db=debgu` | `debgu` 오타 지시문만 버려지고 `info`로 돈다. 쿼리 줄이 없다 |
| `warn,my-crate=info` / `warn,my_crate=info` | target이 `my_crate::api`인 줄이 0줄 / 1줄 |

- **오타는 조용히 버려진다.** `EnvFilter::new`는 잘못된 지시문을 버리고 나머지로 만든다. `try_new`는 `Err`를 돌려준다[^5]. 실행해 보니 `new`는 표준 에러에 `ignoring ... error parsing level filter: expected one of "off", "error", "warn", "info", "debug", "trace", or a number 0-5` 한 줄만 남겼다.
- **크레이트 이름의 `-`는 target에서 `_`다**[^5]. `my-crate=info`라고 적으면 target `my_crate::api`와 맞지 않아 0줄이었다.
- **RUST_LOG.** `EnvFilter::from_default_env()`는 환경 변수 `RUST_LOG`를 읽는다. 잘못된 지시문은 버린다. 변수가 없거나 비었거나 전부 잘못됐으면 ERROR만 켠다[^5]. 엄격한 판 `try_from_default_env()`는 잘못된 지시문이 하나라도 있거나 변수가 없으면 `Err`다[^5].

## JSON으로 찍기

사람이 터미널에서 읽을 때는 기본 글자 출력이 편하다. 로그 수집기가 읽을 때는 한 줄에 JSON 객체 하나씩 찍는 편이 낫다. 키로 거르고 모을 수 있기 때문이다. tracing-subscriber의 JSON 출력이 이 모양이고, 사람이 읽으려면 `jq` 같은 도구로 펴 본다[^7].

```rust
let subscriber = tracing_subscriber::fmt()
    .json()                                  // json 기능 필요
    .with_writer(cap.clone())                // 출력 대상
    .with_env_filter(EnvFilter::new(filter)) // env-filter 기능 필요
    .finish();
tracing::subscriber::with_default(subscriber, || { /* 이 안에서 찍은 것만 cap으로 */ });
```

- `.json()`은 `json` 기능, `.with_env_filter`는 `env-filter` 기능이 켜져 있어야 한다[^6].
- `with_writer`가 받는 출력 대상은 `MakeWriter` 트레이트를 구현한다. 구독자는 event마다 이것을 불러 새 writer를 얻는다. `Fn() -> W` 꼴의 클로저도 그대로 쓸 수 있다[^9]. 검증 코드는 `Arc<Mutex<Vec<u8>>>`에 모으는 writer를 만들어 출력을 붙잡았다.
- `with_default`는 클로저가 도는 동안 지금 스레드에만 구독자를 건다[^8]. 테스트에서 쓰기 좋다. 서비스의 `main`에서는 `.init()`으로 전역에 한 번 건다. 이미 전역 구독자가 있으면 `init`은 panic하고 `try_init`은 그냥 넘어간다[^6].
- 단위 테스트 출력을 `cargo test`가 붙잡게 하려면 `.with_test_writer()`를 쓴다[^6].
- `flatten_event(true)`는 `fields` 안의 내용을 맨 위로 올린다. `with_current_span(false)`, `with_span_list(false)`는 `span`, `spans` 키를 뺀다[^7].

### span이 얼마나 걸렸나

`.with_span_events(FmtSpan::CLOSE)`를 더하면 span이 닫힐 때 event가 하나 더 찍힌다. 시각을 찍는 설정이면 이 event에 span이 들어가 있던 시간(busy)과 들어가 있지 않고 살아만 있던 시간(idle)이 붙는다[^6][^10]. 30ms 잠드는 퓨처에 span을 붙여 보니 닫힘 event의 필드는 이랬다.

```json
{"message":"close","time.busy":"29.1µs","time.idle":"36.1ms"}
```

잠든 시간은 idle로 잡혔다. 계산에 쓴 시간은 busy다. 요청이 느린데 busy가 작고 idle이 크면, CPU가 아니라 DB나 네트워크를 기다린 것이다([성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)). 숫자는 실행마다 조금씩 다르다.

## 요청 ID

예시의 요청 번호는 `AtomicU64` 카운터로 만들었다. HTTP 서비스에서는 tower-http의 `request_id` 모듈이 이 일을 한다[^11].

- `SetRequestIdLayer`는 들어온 요청에 ID 헤더를 단다. `PropagateRequestIdLayer`는 요청의 ID를 응답 헤더로 옮긴다[^11].
- 문서 예제는 `x-request-id` 헤더를 쓰고, `MakeRequestUuid`로 UUID를 만든다. 이미 ID가 달린 요청이나 응답은 덮어쓰지 않는다[^11]. 앞단의 프록시가 단 ID를 그대로 이어 쓸 수 있다.
- 이 모듈은 tower-http의 `request-id` 기능이 있어야 한다[^11]. 이 과목의 harness는 그 기능을 켜지 않아 돌려 보지 않았다.

응답 헤더에 ID가 실려 나가므로, 사용자가 오류 화면의 ID를 알려 주면 그 ID로 로그를 찾는다. axum에서 요청마다 span을 여는 `TraceLayer`와 그 로그 모양은 [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)에 있다.

## OpenTelemetry로 내보내기

서비스가 여러 개로 나뉘면 요청 하나가 서비스 몇 개를 거친다. 서비스마다 따로 남은 로그를 사람이 손으로 이어 붙이기는 어렵다. tracing-opentelemetry는 여러 시스템의 span을 하나의 trace로 잇고, OpenTelemetry를 받는 추적 시스템으로 보내는 레이어다[^12]. 지금 버전은 0.34.0이다[^12].

- 설정 순서는 문서 예제를 따른다. exporter를 단 `SdkTracerProvider`를 만들고, 거기서 tracer를 얻고, `tracing_opentelemetry::layer().with_tracer(tracer)`로 레이어를 만들어 `Registry` 구독자에 얹는다. 문서 예제의 exporter는 표준 출력으로 찍는 `opentelemetry_stdout`이다[^12].
- 코드에 단 `#[instrument]`와 `info_span!`은 그대로 둔다. 구독자 쪽에 레이어 하나가 더해질 뿐이다.
- `otel.name`(내보낼 span 이름 바꾸기), `otel.kind`(`"client"`, `"server"` 등), `otel.status_code` 같은 특별한 필드 이름이 있다[^12].
- 이 크레이트는 trace와 metric만 보낸다. 로그를 OpenTelemetry 수집기로 보내지는 않는다[^12].

이 과목의 실행 환경에는 opentelemetry 크레이트가 없다. 그래서 이 절에는 돌려 보지 않은 설정 코드를 적지 않았다. 실제로 쓸 때는 docs.rs의 예제를 그 버전 그대로 옮긴다.

## 활용

- **초기화는 `main` 한 곳.** 서비스의 `main`에서 설정을 읽은 직후 구독자를 건다. 라이브러리 크레이트는 `tracing`만 의존하고 구독자를 걸지 않는다[^1].
- **남길 것과 뺄 것.** 요청 ID, 사용자 ID, 상태 코드, 걸린 시간은 필드로 남긴다. 비밀번호, 토큰, 카드 번호는 `skip`으로 빼고, 필요하면 마지막 네 자리처럼 줄인 값만 남긴다([설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/)).
- **큰 인자.** 요청 구조체 전체를 인자로 받는 함수에 `#[instrument]`를 그냥 붙이면 부를 때마다 `Debug` 출력을 만든다. `skip_all`로 빼고 `fields(id = %req.id)`처럼 필요한 것만 고른다[^2].
- **비용.** 필터가 끈 수준의 span과 event는 만들어지지 않는다[^1]. 그래서 자세한 `debug!`를 코드에 남겨 두고, 운영에서는 `RUST_LOG=info`로 끄고, 문제가 생기면 모듈 하나만 켠다.
- **에러 로그.** 에러 사슬 전체를 남기려면 `{e:#}`로 적는다([애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)).
- **흔한 실수.**
  - async 함수에서 `let _g = span.enter();` 뒤에 `.await`. `.instrument(span)`이나 `#[instrument]`를 쓴다.
  - `RUST_LOG`에 오타를 내고 왜 DEBUG가 안 나오는지 헤맨다. 시작할 때 표준 에러에 `ignoring` 줄이 있는지 본다. 운영에서 오타를 막으려면 `try_from_default_env()`의 `Err`를 보고 시작을 멈춘다. 이때 변수가 없는 경우도 `Err`이므로 그 경우만 기본값으로 바꿔 준다[^5].
  - 크레이트 이름 `my-app`을 지시문에 그대로 `my-app=debug`로 적는다. `my_app=debug`로 적는다.
- **clippy.** `print_stdout`, `print_stderr`, `dbg_macro`는 디버깅하다 남긴 `println!`, `eprintln!`, `dbg!`를 잡는다. restriction 그룹이라 기본으로는 꺼져 있다[^13]. 서비스 크레이트에서는 `[lints.clippy]`에 켜 두고 출력은 tracing으로만 한다([CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/)).

## 연결

- span이 poll마다 들어가고 나오는 까닭: [Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)
- 요청이 한 스레드에서 번갈아 도는 까닭: [tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)
- target이 모듈 경로인 까닭: [모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)
- HTTP 요청마다 span을 여는 `TraceLayer`: [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)
- 느린 곳을 찾는 다음 단계: [성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)
- 연습: [서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/)의 p3

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`#[instrument]`는 함수 이름만 남기니 아무 함수에나 붙여도 안전하다"</div>

틀렸다. `#[instrument]`는 인자를 모두 span 필드로 남긴다. 이름이 "instrument(계측)"라서 시간만 재는 장치처럼 들려 그럴듯해 보인다. 검증 코드에서 `skip` 없이 `login_leaky("carol", "s3cret-pass")`를 부르자 JSON 줄에 `"password":"s3cret-pass"`가 그대로 찍혔다. 비밀값을 받는 함수에는 `skip`이나 `skip_all`을 붙이고, 로그 출력에 그 값이 없는지 테스트로 확인한다. 검증 코드의 `password_never_logged` 테스트가 그 예다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음을 필터 `warn`인 JSON 구독자 아래에서 돌린다. 몇 줄이 찍히고, 그 줄의 `fields.message`는? `login("alice", "hunter2hunter2"); login("bob", "pw"); tokio::join!(request("/a"), request("/b"));` (`login`과 `request`는 본문의 코드다.)</summary>

**답:** 1줄. `"login rejected"`.<br>
**이유:** `warn`은 WARN보다 덜 급한 INFO·DEBUG를 끈다. INFO인 `login ok`, `start`, `done`과 DEBUG인 쿼리 줄이 모두 빠지고, `warn!`으로 찍은 bob의 줄만 남는다. span은 줄로 찍히지 않는다. 실행 결과도 1줄이었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 코드로 요청마다 span을 열었다. 테스트에서는 줄마다 맞는 `request_id`가 붙었는데, 운영에서는 가끔 다른 요청의 번호가 붙는다. 왜인가? 어떻게 고치나? `async fn serve_one(id: u64, path: &'static str) { let _g = info_span!("request", request_id = id).entered(); handle(path).await; }`</summary>

**답:** `entered()`가 돌려준 guard `_g`를 `.await` 너머로 쥐고 있기 때문이다. `handle(path).instrument(info_span!("request", request_id = id)).await`로 바꾼다.<br>
**이유:** `.await`에서 멈춘 동안에도 guard가 살아 있어 스레드에는 이 span이 남는다. 그사이 다른 요청이 자기 span에 들어가면 둘이 겹쳐 쌓인다. 먼저 멈춘 요청이 먼저 다시 돌면 맨 위의 남의 span을 단다. 검증 코드에서 `tokio::join!`으로 돌리면 맞게, `futures::join!`으로 돌리면 `done /a`에 `/b`의 번호가 붙었다. 테스트가 통과한 것은 운이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 크레이트 이름이 `my-app`이다. `RUST_LOG=info,my-app::db=debug`로 띄웠는데 `db` 모듈의 DEBUG 줄이 하나도 안 나온다. 오타 경고도 없다. 왜인가?</summary>

**답:** event의 target은 `my_app::db`다. 크레이트 이름의 `-`는 target에서 `_`로 바뀐다. 지시문을 `my_app::db=debug`로 적는다.<br>
**이유:** 지시문 자체는 문법이 맞아서 버려지지 않았다. 다만 그 target으로 찍히는 줄이 없을 뿐이다. 검증 코드에서도 `my-crate=info`는 0줄, `my_crate=info`는 1줄이었다.<br>
**흔한 오답:** "`RUST_LOG`를 못 읽었다." 읽었다면 `info`는 걸렸다. INFO 줄이 나오는지 보면 가려낼 수 있다.

</details>


[^1]: tracing 문서, 크레이트 첫 쪽 (Core Concepts: Spans, Events, Subscribers; Recording Fields; Configuring Attributes; In executables) — https://docs.rs/tracing/latest/tracing/
[^2]: tracing 문서, attribute macro `instrument` (기본 수준 INFO, 이름은 함수 이름, 인자 기록, `skip`·`skip_all`, `fields`, `ret`, `err`, async fn) — https://docs.rs/tracing/latest/tracing/attr.instrument.html
[^3]: tracing 문서, struct `Span` (`record`: 선언하지 않은 필드는 효과 없음, `field::Empty`, `enter`·`entered`의 `.await` 경고, `Future::instrument`) — https://docs.rs/tracing/latest/tracing/span/struct.Span.html
[^4]: tracing 문서, trait `Instrument` (poll될 때마다 들어간다, `in_current_span`) — https://docs.rs/tracing/latest/tracing/trait.Instrument.html
[^5]: tracing-subscriber 문서, struct `EnvFilter` (지시문 문법, `new`와 `try_new`, `DEFAULT_ENV = "RUST_LOG"`, `from_default_env`의 ERROR 기본값, `try_from_default_env`, 크레이트 이름의 대시는 밑줄) — https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html
[^6]: tracing-subscriber 문서, struct `fmt::SubscriberBuilder` (`json`, `with_env_filter`, `with_writer`, `with_test_writer`, `with_span_events`, `init`, `try_init`) — https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/struct.SubscriberBuilder.html
[^7]: tracing-subscriber 문서, struct `fmt::format::Json` (줄마다 JSON 하나, `jq`, `flatten_event`, `with_current_span`, `with_span_list`) — https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/struct.Json.html
[^8]: tracing 문서, fn `subscriber::with_default` — https://docs.rs/tracing/latest/tracing/subscriber/fn.with_default.html
[^9]: tracing-subscriber 문서, trait `fmt::MakeWriter` (event마다 `make_writer`를 부른다, `Fn() -> W` 클로저) — https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/trait.MakeWriter.html
[^10]: tracing-subscriber 문서, struct `fmt::format::FmtSpan` (`NEW`, `ENTER`, `EXIT`, `CLOSE`, 기본값 `NONE`) — https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/struct.FmtSpan.html
[^11]: tower-http 문서, module `request_id` (`request-id` 기능, `SetRequestIdLayer`, `PropagateRequestIdLayer`, `x-request-id`, `MakeRequestUuid`, 이미 있는 ID는 덮어쓰지 않는다) — https://docs.rs/tower-http/latest/tower_http/request_id/index.html
[^12]: tracing-opentelemetry 0.34.0 문서 (여러 시스템의 span을 trace로 잇는 레이어, `layer().with_tracer`, `SdkTracerProvider`, `otel.*` 필드, 로그는 보내지 않는다) — https://docs.rs/tracing-opentelemetry/latest/tracing_opentelemetry/
[^13]: Clippy Lints, `print_stdout`, `print_stderr`, `dbg_macro` — https://rust-lang.github.io/rust-clippy/master/index.html (clippy 0.1.99의 `cargo clippy --explain`으로 설명을, `-W clippy::restriction`을 켜야만 `print_stdout`이 걸리는 것을 실행으로 확인했다)
{% endraw %}
