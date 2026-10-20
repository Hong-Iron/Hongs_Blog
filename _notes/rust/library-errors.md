---
layout: "note"
title: "라이브러리 에러 설계"
display_title: "라이브러리 에러 설계 (Library Error Design)"
kind: "concept"
kind_label: "기법"
num: "24"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Library Error Design", "thiserror", "non_exhaustive", "C-GOOD-ERR", "Error enum"]
description: "남이 가져다 쓰는 코드(라이브러리)의 에러는 부른 사람이 \"무엇이 잘못됐는지\"를 갈라 처리할 수 있어야 한다. 그래서 실패하는 방식마다 이름을 하나씩 붙인 열거형을 공개하고, 원인 에러는 사슬로 이어 둔다. thiserror를 쓰면 이 일을 짧게 적을 수 있다. 다만 공개한 에러는…"
prev_url: "/studies/rust/error-propagation/"
prev_title: "물음표 연산자와 에러 전파"
next_url: "/studies/rust/application-errors/"
next_title: "애플리케이션 에러 처리"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "24_library-errors_verify.rs", "u": "/studies/rust/code/24_library-errors_verify/", "r": "검증"}]
permalink: "/studies/rust/library-errors/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

남이 가져다 쓰는 코드(라이브러리)의 에러는 부른 사람이 "무엇이 잘못됐는지"를 갈라 처리할 수 있어야 한다. 그래서 실패하는 방식마다 이름을 하나씩 붙인 열거형을 공개하고, 원인 에러는 사슬로 이어 둔다. thiserror를 쓰면 이 일을 짧게 적을 수 있다. 다만 공개한 에러는 약속이 되므로, 나중에 종류를 늘릴 여지를 남기고 다른 라이브러리의 에러 타입을 그대로 내보이지 않아야 한다.

</div>


## 예시로 보기

설정 파일을 읽어 포트 번호를 돌려주는 작은 라이브러리를 만든다. 실패하는 방식은 넷이다. 파일을 못 읽음, 키가 없음, 숫자가 아님, 범위를 넘음. 에러를 문자열 하나로 돌려주면 부른 쪽은 "키가 없을 때만 기본값을 쓴다" 같은 처리를 하려고 문자열을 비교해야 한다. 메시지 한 글자만 바뀌어도 그 코드가 깨진다.

실패 방식마다 variant를 하나씩 둔다.

```rust
#[derive(Debug, thiserror::Error)]
#[non_exhaustive]
pub enum ConfigError {
    #[error("failed to read config file `{path}`")]
    Read {
        path: String,
        #[source]
        source: std::io::Error,
    },
    #[error("missing key `{0}`")]
    MissingKey(String),
    #[error("`{key}` must be between {min} and {max}, got {value}")]
    OutOfRange { key: &'static str, value: i64, min: i64, max: i64 },
    #[error("value is not an integer")]
    NotInteger(#[from] std::num::ParseIntError),
}
```

부른 쪽은 `match`로 가른다. `MissingKey`면 기본값을 쓰고, 나머지는 위로 넘긴다. 메시지는 사람이 읽을 것이고, 프로그램은 variant를 본다.

검증 코드에서 출력과 사슬은 이랬다.

| 입력 | `to_string()` | `source()` |
|---|---|---|
| `host=x` | ``missing key `port` `` | 없음 |
| `port=70000` | ``` `port` must be between 1 and 65535, got 70000 ``` | 없음 |
| `port=abc` | `value is not an integer` | `invalid digit found in string` |
| 없는 파일 | ``failed to read config file `/no/such/dir/app.conf` `` | `No such file or directory (os error 2)` |

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: thiserror가 만든 메시지·`From`·`source`, `Send + Sync + 'static`, 불투명 에러의 `kind()`, 다른 크레이트에서 `#[non_exhaustive]` enum을 와일드카드 없이 `match`하면 E0004인 것을 실행해 확인했다 — [24_library-errors_verify.rs](/Hongs_Blog/studies/rust/code/24_library-errors_verify/)</div>

</div>


## thiserror가 만들어 주는 것

thiserror는 `std::error::Error`를 구현해 주는 derive 매크로다[^1]. 손으로 쓸 `Display`, `Error::source`, `From`을 속성 몇 개로 만든다.

| 속성 | 만드는 것 |
|---|---|
| `#[error("...")]` | `Display`. 필드를 `{path}`, `{0}`처럼 넣는다[^1] |
| `#[source]` 또는 이름이 `source`인 필드 | `source()`가 그 필드를 돌려준다[^1] |
| `#[from]` | 그 필드 타입에서 이 에러로 가는 `From` 구현. 그 필드를 `source`로도 쓴다[^1] |
| `#[error(transparent)]` | `Display`와 `source()`를 안쪽 에러에 그대로 넘긴다[^1] |

`#[from]`이 있으면 [물음표 연산자](/Hongs_Blog/studies/rust/error-propagation/)가 저절로 변환한다. `raw.parse::<i64>()?`가 `NotInteger`가 된다. `#[from]` variant에는 원인 필드 말고 다른 필드를 둘 수 없다[^1]. 경로처럼 맥락을 같이 담고 싶으면 `Read`처럼 `#[source]`를 쓰고 `map_err`로 직접 만든다.

thiserror는 공개 API에 나타나지 않는다[^1]. 만들어지는 코드가 손으로 쓴 구현과 같으므로, 나중에 thiserror를 빼고 손으로 바꿔도 쓰는 사람 쪽 코드는 깨지지 않는다.

## 좋은 에러 타입의 조건

Rust API 지침의 C-GOOD-ERR은 공개 함수가 돌려주는 에러 타입에 이런 것을 바란다[^2].

- `std::error::Error`를 구현한다. 그래야 다른 에러의 `source()`가 되고, anyhow 같은 도구가 받아 줄 수 있다.
- `Send`와 `Sync`다. `Send`가 아니면 `thread::spawn`의 스레드에서 돌려받을 수 없고, `Sync`가 아니면 `Arc`로 나눠 가질 수 없다.
- `()`를 에러 타입으로 쓰지 않는다. `Error`도 `Display`도 없고, 받는 쪽이 `From<()>`을 의미 있게 만들 수 없다. 담을 정보가 없으면 빈 구조체라도 만든다.
- 메시지는 소문자로 시작하고 끝에 마침표가 없는 짧은 문장이다. 예: `"unexpected end of file"`.

검증 코드는 `fn assert_good_error<E: Error + Send + Sync + 'static>()`로 첫째와 둘째 조건을 컴파일 시점에 확인한다. 이런 함수를 라이브러리 테스트에 하나 두면, 나중에 누가 `Rc`를 담은 variant를 넣는 순간 테스트가 컴파일되지 않는다.

원인을 `source()`로 내보냈으면 메시지(`Display`)에 원인을 다시 넣지 않는다[^5]. `NotInteger`의 메시지가 `"value is not an integer: {0}"`이 아닌 이유다. 사슬을 한 줄로 이어 찍는 쪽(25번의 `{:#}`)에서 같은 문장이 두 번 나오지 않게 하려는 것이다.

## 나중을 위한 여지: `#[non_exhaustive]`

다음 버전에서 "권한 없음" variant를 하나 더 넣으면, 쓰는 사람의 `match`가 모든 경우를 다루지 못해 컴파일이 깨진다. 그래서 공개 enum에 `#[non_exhaustive]`를 붙인다. 붙이면 정의한 크레이트 바깥의 `match`는 반드시 `_` 갈래를 둬야 한다[^4]. 정의한 크레이트 안에서는 아무 효과가 없다[^4].

검증 코드에서 크레이트 둘을 따로 컴파일했다. `#[non_exhaustive] pub enum Kind { A, B }`를 가진 라이브러리를 쓰는 쪽에서 `A`, `B`만 다룬 `match`는 이렇게 멈췄다.

```
error[E0004]: non-exhaustive patterns: `_` not covered
```

`_ => 0`을 더하니 통과했다. 같은 크레이트 안의 `match`는 `_` 없이도 컴파일됐다.

## 의존성의 타입을 내보이지 않기

`ConfigError::Read`가 `std::io::Error`를 담는 것은 괜찮다. 표준 라이브러리는 늘 같이 있기 때문이다. 다른 크레이트의 에러는 다르다. 예를 들어 공개 에러에 `Json(#[from] serde_json::Error)`를 두면, serde_json이 공개 API의 일부가 된다. API 지침은 공개 API에 타입이 드러난 크레이트를 공개 의존성이라 부르고, 1.0 이상인 크레이트의 공개 의존성은 모두 안정판이어야 한다고 적는다[^3]. 특히 그 타입을 받는 `From` 구현을 공개하면 의존성이 공개 API로 새어 나간다고 짚는다[^3]. serde_json의 큰 버전을 올리는 일이 내 라이브러리의 깨지는 변경이 된다.

해결은 불투명한 겉 타입이다. 겉은 구조체 하나로 두고, 의존성 타입은 비공개 enum 안에 숨긴다. 부른 쪽이 갈라야 할 정보는 의존성 타입이 없는 공개 `kind()`로 준다.

```rust
#[derive(Debug, thiserror::Error)]
#[error(transparent)]
pub struct ParseError(#[from] Repr);      // 공개: 안이 안 보인다

#[derive(Debug, thiserror::Error)]
enum Repr {                               // 비공개
    #[error("invalid JSON")]
    Json(#[source] serde_json::Error),
    #[error("field `name` is empty")]
    EmptyName,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[non_exhaustive]
pub enum ParseErrorKind { Syntax, EmptyName }
```

`#[error(transparent)]` 덕분에 겉 에러의 메시지와 사슬은 안쪽 그대로다. `parse_name("{oops")`의 사슬은 `["invalid JSON", (serde_json의 메시지)]`로 두 칸이고, `kind()`는 `Syntax`였다.

## 활용

- **공개 enum과 불투명 구조체 고르기.** variant가 적고 안정적이며 담는 것이 표준 타입뿐이면 공개 enum이 쓰기 편하다. 의존성 에러를 담거나 내부 구조를 자주 바꿀 것 같으면 불투명 구조체와 `kind()`를 쓴다. `std::io::Error`가 뒤쪽 모양이다(`io::Error::kind()`가 `io::ErrorKind`를 준다).
- **함수마다 에러 타입 하나 vs 크레이트 전체에 하나.** 크레이트 전체를 enum 하나로 모으면 "이 함수는 `OutOfRange`를 절대 안 낸다"는 사실이 시그니처에서 사라진다. 실패 방식이 서로 크게 다른 함수 묶음은 에러 타입을 나눈다.
- **문서.** 공개 함수의 문서에 `# Errors` 절을 두고 어떤 variant가 언제 나오는지 적는다. clippy의 `missing_errors_doc`(pedantic 묶음) 린트가 빠진 곳을 알려 준다(검증 코드에서 확인).
- **흔한 실수.** `#[error("{0}")]`로 원인 메시지를 그대로 쓰면서 그 필드를 `#[from]`으로도 둔다. 메시지와 `source()`에 같은 문장이 들어가 사슬 출력에서 두 번 찍힌다.
- **흔한 실수.** 에러에 `String` 하나만 담는 variant(`Other(String)`)를 만들어 모든 경우를 몰아넣는다. 부른 쪽이 다시 문자열을 비교하게 된다.

## 연결

- 선수: [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/), [열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/)
- 받는 쪽, 즉 애플리케이션에서 이 에러들을 모으는 법: [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)
- 공개 API를 깨지 않고 고치는 일 전반: [API 설계 원칙](/Hongs_Blog/studies/rust/api-design/)
- Java에서는 예외 클래스를 상속으로 나눈다(`extends Exception`). Rust는 상속 대신 enum의 variant로 나누고, `match`가 모든 variant를 다뤘는지 컴파일러가 확인한다: [사용자 정의 예외](/Hongs_Blog/studies/java/java-custom-exception/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 라이브러리 `mylib`이 `#[non_exhaustive] pub enum Kind { A, B }`를 공개한다. 다른 크레이트에서 `match k { Kind::A => 1, Kind::B => 2 }`는 컴파일되는가? `mylib` 안에서 같은 `match`는?</summary>

**답:** 바깥에서는 안 된다(E0004, `_` not covered). 안에서는 된다.<br>
**이유:** `non_exhaustive`는 "앞으로 variant가 늘 수 있다"는 표시라서, 바깥 코드는 모르는 variant를 대비한 `_` 갈래를 둬야 한다. 정의한 크레이트는 새 variant를 넣을 때 자기 `match`를 같이 고치므로 제한이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 공개 에러 enum에 `Json(#[from] serde_json::Error)` variant를 두는 것과, 불투명 구조체 안에 숨기고 `kind()`를 주는 것은 무엇이 다른가? 어느 쪽이 serde_json의 큰 버전 업데이트에 강한가?</summary>

**답:** 숨기는 쪽이 강하다. 공개 variant와 공개 `From` 구현에는 serde_json 타입이 드러나서, serde_json을 올리면 내 공개 타입도 바뀐다(깨지는 변경). 숨기면 serde_json은 내부 사정이 되고, 공개된 것은 의존성 타입이 없는 `ParseErrorKind`뿐이다.<br>
**흔한 오답:** "`source()`로 꺼낼 수 있으니 숨겨도 드러난 것과 같다." `source()`는 `&dyn Error`를 줄 뿐 serde_json 타입을 시그니처에 드러내지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `#[error("value is not an integer")] NotInteger(#[from] ParseIntError)`에 `port=abc`를 넣었을 때 `to_string()`과 `source()`의 메시지는? 메시지를 `"value is not an integer: {0}"`로 바꾸면 사슬을 `: `로 이어 찍은 결과는 어떻게 되는가?</summary>

**답:** `value is not an integer`, `invalid digit found in string`. 바꾸면 `value is not an integer: invalid digit found in string: invalid digit found in string`처럼 원인이 두 번 찍힌다.<br>
**이유:** 사슬을 찍는 쪽은 각 에러의 메시지와 `source()`를 차례로 잇는다. 원인을 메시지에도 넣으면 겹친다.

</details>


[^1]: thiserror 2.0.21 문서(docs.rs), 크레이트 첫 페이지 — https://docs.rs/thiserror/latest/thiserror/
[^2]: Rust API Guidelines, Interoperability — Error types are meaningful and well-behaved (C-GOOD-ERR) — https://rust-lang.github.io/api-guidelines/interoperability.html
[^3]: Rust API Guidelines, Necessities — Public dependencies of a stable crate are stable (C-STABLE) — https://rust-lang.github.io/api-guidelines/necessities.html
[^4]: The Rust Reference, Type system attributes — The non_exhaustive attribute — https://doc.rust-lang.org/reference/attributes/type_system.html
[^5]: Rust 표준 라이브러리 문서, Trait `std::error::Error` — https://doc.rust-lang.org/std/error/trait.Error.html
{% endraw %}
