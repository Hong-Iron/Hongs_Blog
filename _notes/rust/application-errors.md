---
layout: "note"
title: "애플리케이션 에러 처리"
display_title: "애플리케이션 에러 처리 (Application Error Handling)"
kind: "concept"
kind_label: "기법"
num: "25"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Application Error Handling", "anyhow", "anyhow::Context", "bail", "ensure", "Error chain formatting"]
description: "실행 파일(서버, 명령줄 도구)에서 에러는 대부분 \"무엇을 하다가 왜 실패했는지 사람에게 알리고 멈추거나 넘어가는\" 것으로 끝난다. 그래서 종류를 가르는 enum보다, 어떤 에러든 받아서 설명을 한 겹씩 덧붙이는 상자 하나가 편하다. anyhow가 그 상자다. 대신 시그니처만 보고…"
prev_url: "/studies/rust/library-errors/"
prev_title: "라이브러리 에러 설계"
next_url: "/studies/rust/panic-policy/"
next_title: "panic을 쓸 때"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/application-errors/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

실행 파일(서버, 명령줄 도구)에서 에러는 대부분 "무엇을 하다가 왜 실패했는지 사람에게 알리고 멈추거나 넘어가는" 것으로 끝난다. 그래서 종류를 가르는 enum보다, 어떤 에러든 받아서 설명을 한 겹씩 덧붙이는 상자 하나가 편하다. anyhow가 그 상자다. 대신 시그니처만 보고는 어떤 에러가 올지 알 수 없으므로, 종류에 따라 다르게 대응해야 하는 자리에서는 이 방식이 모자라다.

</div>


## 예시로 보기

요청에서 사용자 번호를 읽고 저장소에서 이름을 찾는 핸들러를 짠다. 실패는 세 층에서 난다. 숫자 해석(`ParseIntError`), 내가 정한 규칙(번호는 0이 아님), 저장소(`StoreError`). 로그에 남길 때는 "어느 요청에서, 무엇을 하다가, 무엇 때문에"가 모두 보여야 한다.

```rust
use anyhow::{Context, Result, bail, ensure};

fn parse_id(raw: &str) -> Result<u32> {
    let id: u32 = raw.trim().parse()
        .with_context(|| format!("invalid id {raw:?}"))?;
    ensure!(id != 0, "id must be positive");
    Ok(id)
}

fn handle(raw: &str) -> Result<String> {
    if raw.is_empty() {
        bail!("empty request");
    }
    let id = parse_id(raw).context("bad request")?;
    let name = store_get(id).with_context(|| format!("failed to load user {id}"))?;
    Ok(name)
}
```

`anyhow::Result<T>`는 `Result<T, anyhow::Error>`의 줄임이다[^1]. `?`는 `std::error::Error`를 구현한 에러라면 무엇이든 `anyhow::Error`로 바꾼다[^1]. `.context(..)`는 낮은 층의 에러 위에 설명 한 줄을 덧씌운다[^1]. 설명을 만드는 데 `format!`이 들면 <code>with_context(&#124;&#124; ..)</code>를 쓴다. 클로저라서 실패할 때만 문자열을 만든다.

`handle("abc")`의 에러를 세 가지 형식으로 찍으면 이렇다(검증 코드 실행 결과).

```
{}   => bad request
{:#} => bad request: invalid id "abc": invalid digit found in string
{:?} =>
bad request

Caused by:
    0: invalid id "abc"
    1: invalid digit found in string
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 출력 형식, `chain()`과 `root_cause()`, `bail!`·`ensure!`, context를 덧씌운 뒤에도 `downcast_ref`로 라이브러리 에러를 되찾는 것, 에러 종류에 따른 상태 코드 고르기를 실행해 확인했다 — [25_application-errors_verify.rs](/Hongs_Blog/studies/rust/code/25_application-errors_verify/)</div>

</div>


## 출력 형식

| 형식 | 찍히는 것 | 쓰는 곳 |
|---|---|---|
| `{}` | 맨 바깥 설명 한 줄. 아래 원인은 안 찍는다[^2] | 사용자에게 짧게 |
| `{:#}` | 바깥부터 원인까지 `: `로 이은 한 줄[^2] | 한 줄 로그 |
| `{:?}` | 바깥 설명, 빈 줄, `Caused by:` 목록, 잡힌 경우 백트레이스[^2] | `main`이 `Err`로 끝날 때의 기본 출력[^2] |

`{}`만 찍으면 "bad request"만 남는다. 로그에는 `{:#}`나 `{:?}`를 쓴다. 이 차이를 모르면 운영 중에 원인을 잃는다.

`main`이 `anyhow::Result<()>`를 돌려주고 `Err`로 끝나면 `{:?}` 형식이 stderr에 찍힌다[^2]. [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)에서 본 `Error: ParseIntError { kind: InvalidDigit }` 같은 출력보다 사람이 읽기 좋다.

## 사슬 다루기

- `chain()`은 맨 바깥 에러부터 원인을 차례로 돌려주는 반복자다[^2]. 위 예에서는 `["bad request", "invalid id \"abc\"", "invalid digit found in string"]`이다.
- `root_cause()`는 맨 아래 원인이다[^2]. 여기서는 `"invalid digit found in string"`.
- `downcast_ref::<T>()`로 원래 타입을 꺼낸다[^1]. context를 덧씌운 뒤에도 된다. `handle("7")`의 에러는 `{:#}`로 `failed to load user 7: record 7 not found`이고, `downcast_ref::<StoreError>()`가 `Some(NotFound(7))`을 돌려줬다.

`bail!(..)`은 `return Err(anyhow!(..))`의 줄임이고, `ensure!(조건, ..)`은 조건이 거짓이면 그렇게 한다[^1]. 둘이 만드는 에러는 메시지만 있는 에러다. 아래 원인도 없고 꺼낼 타입도 없다.

## "라이브러리는 thiserror, 앱은 anyhow"와 그 한계

흔히 쓰는 어림 규칙이다. 라이브러리는 부른 쪽이 종류를 갈라야 하므로 [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)의 enum을 공개한다. 앱은 대부분 에러를 찍고 끝내므로 anyhow로 모은다. anyhow 문서 자체는 이 규칙을 적지 않는다. 다만 anyhow는 derive 매크로를 주지 않으니 직접 구현하거나 thiserror 같은 매크로를 쓰라고 적는다[^1].

규칙이 너무 단순해지는 자리가 있다. 앱 안에서도 에러 종류에 따라 다르게 대응해야 하는 경계다.

- HTTP 서버는 "없음"이면 404, "형식 틀림"이면 400, 그 밖은 500을 돌려줘야 한다.
- 일시적 실패(시간 초과)는 다시 시도하고, 영구 실패(권한 없음)는 바로 포기해야 한다.

anyhow로만 모으면 이 경계에서 `downcast_ref`로 타입을 하나씩 찾아야 한다. 검증 코드의 `status_of`가 그렇게 했다. `StoreError::NotFound`면 404, `ReadOnly`면 503, `ParseIntError`면 400이었다. 그런데 `bail!("empty request")`와 `ensure!` 에러는 메시지뿐이라 찾을 타입이 없어 500이 됐다. 원래는 400이어야 할 요청 오류다. 컴파일러는 이 빠짐을 알려 주지 않는다.

그래서 이런 경계가 있는 앱은 경계 바로 안쪽에 작은 enum(예: `ApiError { BadRequest, NotFound, Internal(anyhow::Error) }`)을 두고, 그 enum을 응답으로 바꾸는 코드를 한 곳에 모은다. 안쪽 깊은 곳은 anyhow로 편하게 쓰고, 경계만 타입으로 지킨다. axum에서 이렇게 하는 법은 [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)에서 다룬다.

## 활용

- **로그.** `tracing::error!("request failed: {e:#}")`처럼 사슬 전체를 남긴다. `{}`만 쓰면 원인이 빠진다. 구조화 로그는 [tracing으로 관측하기](/Hongs_Blog/studies/rust/tracing-observability/).
- **설명 문장.** context는 "무엇을 하다가"를 적는다(`failed to load user 7`). 원인 메시지("record 7 not found")를 다시 쓰지 않는다. 사슬이 알아서 붙인다.
- **스레드·태스크.** `anyhow::Error`는 `Send + Sync + 'static`이다[^2]. `?`가 쓰는 `From<E>` 구현도 `E: Error + Send + Sync + 'static`을 요구한다[^2]. 그래서 `Send`가 아닌 값을 담은 에러는 `?`로 넣을 수 없다.
- **백트레이스.** 원인이 백트레이스를 주지 않으면 anyhow가 잡는다. `RUST_BACKTRACE`나 `RUST_LIB_BACKTRACE`로 켠다[^1].
- **흔한 실수.** 라이브러리 공개 함수가 `anyhow::Result`를 돌려준다. 쓰는 사람은 종류를 가를 수 없고, anyhow가 공개 의존성이 된다.

## 연결

- 선수: [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/), [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)
- 복구하지 않고 멈추는 쪽: [panic을 쓸 때](/Hongs_Blog/studies/rust/panic-policy/)
- Java의 예외도 원인을 담는다(`new RuntimeException("msg", cause)`, `getCause()`). anyhow의 context는 그 감싸기를 한 메서드로 한 것이다: [예외 던지기](/Hongs_Blog/studies/java/java-throw/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 본문의 `handle`에 `"0"`을 넣었을 때 `{}`와 `{:#}`의 출력을 쓰라.</summary>

**답:** `{}`는 `bad request`, `{:#}`는 `bad request: id must be positive`.<br>
**이유:** `"0"`은 숫자로는 바뀌므로 `with_context` 쪽 에러는 생기지 않는다. `ensure!`가 메시지만 있는 에러를 만들고, `handle`의 `.context("bad request")`가 그 위에 덧씌운다. 사슬은 두 칸이다. 검증 코드의 결과와 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** HTTP 핸들러가 모두 `anyhow::Result`를 돌려주고, 경계에서 `downcast_ref`로 상태 코드를 고른다. 이 설계에서 `bail!("empty request")`가 500이 되는 까닭은? 어떻게 막는가?</summary>

**답:** `bail!`이 만든 에러는 메시지만 있고 타입이 없어서 `downcast_ref`로 찾을 것이 없다. 그래서 기본값 500으로 떨어진다. 경계 안쪽에 `ApiError::BadRequest` 같은 enum을 두고 요청 오류를 그 타입으로 돌려주면, `match`가 빠짐없이 상태 코드를 고르게 된다.<br>
**흔한 오답:** "메시지 문자열을 비교하면 된다." 메시지가 바뀌면 조용히 깨진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 각각에 anyhow와 thiserror 중 무엇이 맞는가? (가) 명령줄 백업 도구의 `main` 근처 함수들 (나) 여러 서비스가 쓰는 결제 SDK의 공개 함수 (다) 재시도 여부를 에러 종류로 정해야 하는 메시지 소비 루프</summary>

**답:** (가) anyhow. (나) thiserror. (다) 종류를 가르는 enum(thiserror)이 맞고, 안쪽 세부 원인은 anyhow로 담아도 된다.<br>
**이유:** (가)는 찍고 끝낸다. (나)는 부른 쪽이 갈라야 한다. (다)는 앱이지만 "다시 시도할까"를 타입으로 정해야 하는 경계다.

</details>


[^1]: anyhow 1.0.104 문서(docs.rs), 크레이트 첫 페이지(Details, Context, bail!/ensure!, downcast, backtrace) — https://docs.rs/anyhow/latest/anyhow/
[^2]: anyhow 문서, Struct `anyhow::Error` — Display representations, `chain`, `root_cause`, `From<E>` 구현의 경계 — https://docs.rs/anyhow/latest/anyhow/struct.Error.html
{% endraw %}
