---
layout: "note"
title: "서비스 기초 연습"
display_title: "서비스 기초 연습"
kind: "practice"
kind_label: "연습"
num: "45"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "9단원 앞쪽의 네 가지, 설정 읽기, 성질 테스트, 로그에서 비밀값 빼기, 작은 HTTP API를 서비스의 한 조각씩으로 짜 보는 네 문제다. 표준 라이브러리 밖의 크레이트를 쓰므로, 각 코드 파일 첫 주석의 의존성을 Cargo.toml에 넣고 cargo run과 cargo tes…"
prev_url: "/studies/rust/async-practice/"
prev_title: "async 연습"
next_url: "/studies/rust/capstone-2/"
next_title: "캡스톤 2 SQLite 저장소"
math: false
mermaid: false
code_count: 4
permalink: "/studies/rust/service-basics-practice/"
---
{% raw %}
9단원 앞쪽의 네 가지, 설정 읽기, 성질 테스트, 로그에서 비밀값 빼기, 작은 HTTP API를 서비스의 한 조각씩으로 짜 보는 네 문제다. 표준 라이브러리 밖의 크레이트를 쓰므로, 각 코드 파일 첫 주석의 의존성을 `Cargo.toml`에 넣고 `cargo run`과 `cargo test`로 돌린다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 답과 변형 문제를 코드로 확인했다. p2는 proptest로 입력 256개씩, p4는 `oneshot`으로 요청 7개 시나리오와 테스트 둘을 돌렸다 — [p1](/Hongs_Blog/studies/rust/code/45_service-basics-practice_p1/) · [p2](/Hongs_Blog/studies/rust/code/45_service-basics-practice_p2/) · [p3](/Hongs_Blog/studies/rust/code/45_service-basics-practice_p3/) · [p4](/Hongs_Blog/studies/rust/code/45_service-basics-practice_p4/)</div>

</div>


## p1 · 틀린 것을 모두 모으는 설정 읽기

다음 세 값을 환경에서 읽어 `Limits`를 만드는 함수 `fn load(env: &HashMap<&str, &str>) -> Result<Limits, Vec<String>>`를 써라.

| 변수 | 없을 때 | 규칙 |
|---|---|---|
| `APP_MAX_BODY_KB` | 64 | 1~10240의 정수 |
| `APP_ALLOWED_ORIGINS` | 오류(필수) | 쉼표로 나눈 목록. 앞뒤 공백을 지우고 빈 항목은 버린다. 항목마다 `http://`나 `https://`로 시작 |
| `APP_ADMIN_PASSWORD` | 오류(필수) | 12글자 이상. `Limits`를 `{:?}`로 찍어도 보이면 안 된다 |

- 틀린 것은 첫 번째에서 멈추지 말고 모두 모아 돌려준다.
- 비밀번호가 틀렸을 때 오류 메시지에 그 값을 넣지 않는다.
- (가) 함수를 써라. (나) 아래 입력에서 오류 목록은 무엇인가?

```rust
[("APP_MAX_BODY_KB", "0"), ("APP_ALLOWED_ORIGINS", "https://a.example,ftp://x"), ("APP_ADMIN_PASSWORD", "hunter2")]
```

사용 개념: [설정과 비밀값](/Hongs_Blog/studies/rust/configuration-secrets/)의 오류 모으기와 `Secret` 감싸개.

풀이 전략: 변수마다 따로 검사하고, 틀리면 오류를 `Vec`에 넣은 뒤 다음 변수로 간다. 맞는지 틀렸는지는 맨 끝에서 한 번에 판정한다. 비밀번호는 `Debug`가 가려진 글자만 찍는 새 타입에 넣는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *비밀값 상자:* 필드가 하나인 튜플 구조체에 손으로 `Debug`를 짠다. 안의 값은 `expose()`로만 꺼낸다.

```rust
#[derive(Clone)]
pub struct Secret(String);

impl Secret {
    pub fn expose(&self) -> &str {
        &self.0
    }
}

impl fmt::Debug for Secret {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("Secret([REDACTED])")
    }
}

#[derive(Debug)]
pub struct Limits {
    pub max_body_kb: u32,
    pub allowed_origins: Vec<String>,
    pub admin_password: Secret,
}
```

{: start="2"}
2. *기본값이 있는 숫자:* 없으면 64. 있으면 파싱과 범위를 함께 본다. 틀리면 오류를 넣고 아무 값(0)이나 둔다. 어차피 끝에서 `Err`가 된다.

```rust
let max_body_kb = match env.get("APP_MAX_BODY_KB") {
    None => 64,
    Some(v) => match v.parse::<u32>() {
        Ok(n) if (1..=10_240).contains(&n) => n,
        _ => {
            errs.push(format!("APP_MAX_BODY_KB={v:?}: expected 1..=10240"));
            0
        }
    },
};
```

{: start="3"}
3. *목록과 항목마다 검사:* 쉼표로 나누고 다듬은 뒤, 비었으면 "필수" 오류, 아니면 항목마다 앞머리를 본다.

```rust
let allowed_origins: Vec<String> = env
    .get("APP_ALLOWED_ORIGINS")
    .map(|v| {
        v.split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect()
    })
    .unwrap_or_default();
if allowed_origins.is_empty() {
    errs.push("APP_ALLOWED_ORIGINS is required".to_string());
}
for o in &allowed_origins {
    if !(o.starts_with("http://") || o.starts_with("https://")) {
        errs.push(format!(
            "APP_ALLOWED_ORIGINS item {o:?}: must start with http:// or https://"
        ));
    }
}
```

{: start="4"}
4. *비밀값은 값 없이 보고:* 길이는 바이트가 아니라 글자 수(`chars().count()`)로 센다. 한글 비밀번호도 글자 수로 따지기 위해서다.

```rust
let admin_password = match env.get("APP_ADMIN_PASSWORD") {
    None => {
        errs.push("APP_ADMIN_PASSWORD is required".to_string());
        None
    }
    Some(p) if p.chars().count() < 12 => {
        errs.push("APP_ADMIN_PASSWORD: must be at least 12 characters".to_string());
        None
    }
    Some(p) => Some(Secret(p.to_string())),
};
```

{: start="5"}
5. *끝에서 한 번에 판정:*

```rust
match admin_password {
    Some(admin_password) if errs.is_empty() => Ok(Limits {
        max_body_kb,
        allowed_origins,
        admin_password,
    }),
    _ => Err(errs),
}
```

{: start="6"}
6. *(나) 결과:* 세 변수가 모두 틀려서 오류가 3개다. `hunter2`는 어디에도 없다.

```text
  - APP_MAX_BODY_KB="0": expected 1..=10240
  - APP_ALLOWED_ORIGINS item "ftp://x": must start with http:// or https://
  - APP_ADMIN_PASSWORD: must be at least 12 characters
```

맞는 입력(`APP_ALLOWED_ORIGINS`에 `"https://a.example, http://localhost:5173"`, 비밀번호 `"correct-horse-battery"`)을 `{:?}`로 찍으면 `Limits { max_body_kb: 64, allowed_origins: ["https://a.example", "http://localhost:5173"], admin_password: Secret([REDACTED]) }`이다. 공백이 지워졌고 비밀번호는 가려졌다.

</details>


**변형.** 빈 환경(`HashMap::new()`)을 넣으면 오류는 몇 개이고 무엇인가? `APP_MAX_BODY_KB=lots`만 틀리고 나머지가 맞으면?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

빈 환경이면 2개다: `APP_ALLOWED_ORIGINS is required`, `APP_ADMIN_PASSWORD is required`. `APP_MAX_BODY_KB`는 없으면 64라서 오류가 아니다. `lots`만 틀리면 1개, `APP_MAX_BODY_KB="lots": expected 1..=10240`이다. 숫자가 아닌 것과 범위 밖인 것을 같은 갈래(`_`)에서 받아 같은 메시지를 낸다. 둘 다 테스트(`empty_env_reports_two_missing`, `non_number_body_limit`)로 확인했다.

</details>


## p2 · 고르게 나누기의 성질 테스트

`total`개를 `parts`명에게 최대한 고르게 나누는 `fn split_even(total: u64, parts: usize) -> Vec<u64>`를 써라. 나머지는 앞사람부터 하나씩 더 받는다. 예: `split_even(10, 3) = [4, 3, 3]`, `split_even(2, 4) = [1, 1, 0, 0]`.

- (가) 함수를 써라. `parts`가 0이면 panic한다.
- (나) 어떤 입력에서도 맞아야 하는 성질 셋을 적고 proptest 테스트로 만들어라.
- (다) 나머지를 버리는 틀린 구현 `vec![total / parts as u64; parts]`를 `total ∈ 0..10000`, `parts ∈ 1..50`에서 같은 성질로 검사하면, 축소가 끝난 반례 `(total, parts)`는 무엇인가?

사용 개념: [테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/)의 성질 테스트와 축소, [panic을 쓸 때](/Hongs_Blog/studies/rust/panic-policy/).

풀이 전략: "이 입력이면 이 값"을 늘어놓는 대신, 결과가 늘 지켜야 하는 규칙을 찾는다. 나눈 결과라면 개수, 합, 고른 정도가 보인다. 축소 결과를 예측할 때는 "두 값을 더 줄이면 왜 통과하는가"를 따진다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 몫과 나머지:* 몫 `q`를 모두에게 주고, 나머지 `r`명에게 하나씩 더 준다. `i < r`이 참이면 1인 `u64::from(bool)`을 쓴다.

```rust
pub fn split_even(total: u64, parts: usize) -> Vec<u64> {
    assert!(parts > 0, "parts must be positive");
    let q = total / parts as u64;
    let r = (total % parts as u64) as usize;
    (0..parts).map(|i| q + u64::from(i < r)).collect()
}
```

{: start="2"}
2. *(나) 성질 셋:* 길이가 `parts`다. 합이 `total`이다. 최댓값과 최솟값의 차가 1 이하다. 어긋나면 어느 성질인지 돌려주는 함수로 묶는다.

```rust
fn properties(f: fn(u64, usize) -> Vec<u64>, total: u64, parts: usize) -> Result<(), String> {
    let v = f(total, parts);
    if v.len() != parts {
        return Err(format!("len {} != {parts}", v.len()));
    }
    if v.iter().sum::<u64>() != total {
        return Err(format!("sum {} != {total}", v.iter().sum::<u64>()));
    }
    let (mn, mx) = (
        v.iter().min().copied().unwrap_or(0),
        v.iter().max().copied().unwrap_or(0),
    );
    if mx - mn > 1 {
        return Err(format!("max-min = {}", mx - mn));
    }
    Ok(())
}

proptest! {
    #[test]
    fn split_even_keeps_all_three_properties(total in 0u64..1_000_000, parts in 1usize..100) {
        prop_assert_eq!(properties(split_even, total, parts), Ok(()));
    }
}
```

{: start="3"}
3. *(다) 어디서 깨지나:* 나머지가 0이 아니면 합이 모자란다. `total = 0`이면 나머지가 없어 통과하고, `parts = 1`이면 나머지가 늘 0이라 통과한다. 축소는 두 값을 아래로 줄이다가 더 줄이면 통과하는 곳에서 멈춘다.
4. *(다) 결과:* `(1, 2)`이다. 그때 틀린 구현은 `[0, 0]`을 돌려주고, 성질 검사는 `Err("sum 0 != 1")`이다. 실행 결과도 `Some((1, 2))`, `Some([0, 0])`이었다.

</details>


**변형.** `split_even(5, 0)`은 어떻게 되는가? 0명에게 나누는 경우를 `Result`로 돌려주지 않고 panic으로 둔 것은 왜 괜찮은가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`assert!`가 `parts must be positive` 메시지로 panic한다. 테스트 `zero_parts_panics`가 `#[should_panic(expected = "parts must be positive")]`로 확인한다. 0명에게 나누는 것은 부르는 쪽 코드의 버그이지, 실행 중에 흔히 올 수 있는 입력이 아니다. 사용자가 고르는 값이라면 앞 단계에서 검사해 `Result`로 돌려준다. 메시지를 넣었기 때문에 `assert!` 없이 0으로 나눠 panic할 때보다 원인이 바로 보인다.

</details>


## p3 · 카드 번호가 없는 주문 로그

주문 처리 함수 `fn handle_order(order_id: u64, amount: u64, card: &str) -> bool`에 `#[instrument]`를 달아라.

- span에는 `order_id`와 `amount`가 남고 `card`는 남지 않는다.
- 결제 결과 `status`(`"paid"` 또는 `"declined"`)는 처리 도중에 정해진다. 정해진 뒤의 줄에는 span에 `status`가 붙는다.
- 함수 안에서 카드의 마지막 네 자리만 `last4` 필드로 남기고 `"charging"`을 찍는다. 금액이 1000 이하면 `"order done"`을, 넘으면 WARN으로 `"limit exceeded"`를 찍는다.
- (가) 함수를 써라. (나) `handle_order(1, 500, "4111111111111111")`과 `handle_order(2, 5_000, "5500000000000004")`를 JSON 구독자 아래에서 부른다. 주문 2의 줄은 몇 개이고, 각 줄의 `span`에 `status`가 있는가? (다) 카드 번호가 출력 어디에도 없음을 어떻게 확인하나?

사용 개념: [tracing으로 관측하기](/Hongs_Blog/studies/rust/tracing-observability/)의 `skip`, 나중에 채우는 필드, JSON 출력.

풀이 전략: 빼야 할 인자는 `skip`으로, 나중에 정해질 필드는 이름만 먼저 선언한다. 그리고 출력을 문자열로 붙잡아 기계로 검사한다. 눈으로 보는 확인은 다음 사람이 코드를 고칠 때 지켜 주지 못한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *(가) 속성:* `skip(card)`로 카드를 빼고, `fields(status = Empty)`로 이름만 선언한다. `Empty`는 `tracing::field::Empty`다.

```rust
#[instrument(skip(card), fields(status = Empty))]
fn handle_order(order_id: u64, amount: u64, card: &str) -> bool {
    info!(last4 = &card[card.len() - 4..], "charging");
    let ok = amount <= 1_000;
    Span::current().record("status", if ok { "paid" } else { "declined" });
    if ok {
        info!("order done");
    } else {
        warn!(amount, "limit exceeded");
    }
    ok
}
```

`&card[card.len() - 4..]`는 카드 문자열이 4바이트보다 짧으면 panic한다. 실제 코드에서는 앞 단계에서 형식을 검사한 뒤 부른다.

{: start="2"}
2. *(나) 줄 세기:* 주문마다 `charging` 한 줄과 결과 한 줄, 모두 4줄이다. 주문 2의 줄은 2개다. 첫 줄은 `record`보다 먼저 찍혀서 `status`가 없고, 둘째 줄에는 `"status":"declined"`가 있다.

```text
{"fields":{"last4":"0004","message":"charging"},"level":"INFO","span":{"amount":5000,"name":"handle_order","order_id":2},…}
{"fields":{"amount":5000,"message":"limit exceeded"},"level":"WARN","span":{"amount":5000,"name":"handle_order","order_id":2,"status":"declined"},…}
```

{: start="3"}
3. *(다) 기계로 확인:* `with_writer`에 메모리 버퍼를 주고, 붙잡은 글자 전체에 두 카드 번호가 없는지 `assert!`한다. 주문 2의 줄은 `l["span"]["order_id"] == 2`로 골라낸다.

```rust
let sub = tracing_subscriber::fmt()
    .json()
    .with_writer(move || w.clone())
    .finish();
tracing::subscriber::with_default(sub, || { /* 두 주문 */ });
assert!(!text.contains("4111111111111111") && !text.contains("5500000000000004"));
```

</details>


**변형.** `fields(status = Empty)`를 빼고 `#[instrument(skip(card))]`만 둔 채 똑같이 `record("status", …)`를 부르면 어떻게 되나? 컴파일 오류인가, 실행 중 오류인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

둘 다 아니다. 오류 없이 `status`가 빠진다. `Span::record`는 span을 만들 때 선언한 필드만 받고, 선언하지 않은 이름은 조용히 무시한다. 실행해 보면 그 함수의 span은 `{"amount":500,"name":"handle_order_undeclared","order_id":3}`였다. 그래서 나중에 채울 필드는 반드시 `Empty`로 먼저 선언하고, 붙었는지를 테스트로 본다.

</details>


## p4 · 메모 API

키 하나에 메모 하나를 저장하는 HTTP API를 axum으로 짜라.

| 요청 | 인증 | 응답 |
|---|---|---|
| `PUT /notes/{key}` 본문 `{"text":"…"}` | `x-api-key` 헤더 필요 | 새로 만들면 201, 바꾸면 200 |
| `GET /notes/{key}` | 없음 | 200 `{"text":"…"}`, 없으면 404 |
| `DELETE /notes/{key}` | `x-api-key` 헤더 필요 | 지우면 204, 없으면 404 |

- 키는 영문자·숫자로 1~32글자다. 아니면 400이다.
- 헤더가 없거나 틀리면 401이다.
- 오류는 모두 에러 타입 하나에서 `{"error":"…"}` JSON으로 만든다.
- (가) 라우터를 써라. (나) API 키가 `k-123`인 라우터에 아래 요청 7개를 차례로 `oneshot`으로 보낸다. 상태 코드 목록은?

```text
1. PUT /notes/todo (키 없음)   {"text":"buy milk"}
2. PUT /notes/todo (k-123)     {"text":"buy milk"}
3. PUT /notes/todo (k-123)     {"text":"buy milk"}
4. GET /notes/todo
5. GET /notes/bad-key
6. DELETE /notes/todo (k-123)
7. GET /notes/todo
```

사용 개념: [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)의 추출기 순서, `IntoResponse` 에러, `oneshot`.

풀이 전략: 핸들러마다 되풀이되는 검사(인증, 키 모양)를 `Result<(), ApiError>`를 돌려주는 함수로 뺀다. 그러면 핸들러에서는 `?` 한 글자로 끝난다. 본문을 읽는 `Json`은 마지막 인자에 둔다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

1. *에러 타입 하나:* 세 가지 실패를 상태 코드와 메시지로 바꾼다.

```rust
enum ApiError {
    Unauthorized,
    BadKey(String),
    NotFound(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, msg) = match self {
            ApiError::Unauthorized => (
                StatusCode::UNAUTHORIZED,
                "missing or wrong x-api-key".to_string(),
            ),
            ApiError::BadKey(k) => (
                StatusCode::BAD_REQUEST,
                format!("bad key {k:?}: use 1-32 letters or digits"),
            ),
            ApiError::NotFound(k) => (StatusCode::NOT_FOUND, format!("note {k:?} not found")),
        };
        (status, Json(serde_json::json!({ "error": msg }))).into_response()
    }
}
```

{: start="2"}
2. *공통 검사 두 개:*

```rust
fn authorize(state: &AppState, headers: &HeaderMap) -> Result<(), ApiError> {
    match headers.get("x-api-key") {
        Some(v) if v.as_bytes() == state.api_key.as_bytes() => Ok(()),
        _ => Err(ApiError::Unauthorized),
    }
}

fn valid_key(key: &str) -> Result<(), ApiError> {
    let ok = (1..=32).contains(&key.len()) && key.chars().all(|c| c.is_ascii_alphanumeric());
    if ok { Ok(()) } else { Err(ApiError::BadKey(key.to_string())) }
}
```

{: start="3"}
3. *핸들러:* `State`, `HeaderMap`, `Path`를 앞에, `Json`을 마지막에 둔다. `insert`가 돌려주는 옛 값이 `None`이면 새로 만든 것이다.

```rust
async fn put_note(
    State(s): State<Arc<AppState>>,
    headers: HeaderMap,
    Path(key): Path<String>,
    Json(note): Json<Note>,
) -> Result<StatusCode, ApiError> {
    authorize(&s, &headers)?;
    valid_key(&key)?;
    let created = s.notes.write().await.insert(key, note.text).is_none();
    Ok(if created { StatusCode::CREATED } else { StatusCode::OK })
}

async fn delete_note(
    State(s): State<Arc<AppState>>,
    headers: HeaderMap,
    Path(key): Path<String>,
) -> Result<StatusCode, ApiError> {
    authorize(&s, &headers)?;
    valid_key(&key)?;
    match s.notes.write().await.remove(&key) {
        Some(_) => Ok(StatusCode::NO_CONTENT),
        None => Err(ApiError::NotFound(key)),
    }
}
```

`get_note`는 인증 없이 `valid_key`만 보고, 없으면 `ApiError::NotFound(key)`를 돌려준다.

{: start="4"}
4. *라우터 조립:* 한 경로에 메서드 셋을 잇는다.

```rust
Router::new()
    .route("/notes/{key}", put(put_note).get(get_note).delete(delete_note))
    .with_state(state)
```

{: start="5"}
5. *(나) 결과:* `[401, 201, 200, 200, 400, 204, 404]`.
   - 1은 헤더가 없어 401이다. 2는 처음 넣어 201, 3은 같은 키를 바꿔 200이다.
   - 4의 본문은 `{"text":"buy milk"}`다. 5는 `-`가 들어 있어 400이고, 본문은 `{"error":"bad key \"bad-key\": use 1-32 letters or digits"}`다.
   - 6은 지워서 204, 7은 이제 없어 404 `{"error":"note \"todo\" not found"}`다.

</details>


**변형.** 키가 틀린 `x-api-key: nope`로 `DELETE /notes/x`를 보내면 401과 404 중 무엇이 오는가? 33글자 키 `GET /notes/aaa…a`는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

401이다. `delete_note`가 `authorize`를 가장 먼저 부르기 때문이다. 순서를 바꿔 404를 먼저 보내면, 키 없는 사람도 어떤 메모가 있는지 없는지를 응답 코드로 알아낼 수 있다. 33글자 키는 `valid_key`의 `1..=32`에 걸려 400이다. 둘 다 테스트(`wrong_key_is_unauthorized_even_for_delete`, `key_longer_than_32_is_rejected`)로 확인했다.

</details>
{% endraw %}
