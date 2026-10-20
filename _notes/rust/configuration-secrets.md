---
layout: "note"
title: "설정과 비밀값"
display_title: "설정과 비밀값 (Configuration and Secrets)"
kind: "concept"
kind_label: "기법"
num: "44"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Configuration", "Config", "설정", "Secrets", "비밀값", "Secret", "Twelve-Factor App", "12-Factor", "환경 변수", "Environment Variable", "std::env::var", "Fail Fast", "빨리 실패하기", "secrecy", "SecretBox", "SecretString", "ExposeSecret", "REDACTED", "set_var"]
description: "서버 주소, DB 주소, API 토큰처럼 배포할 때마다 바뀌는 값은 코드에 적지 않고 바깥(환경 변수)에서 받는다. 프로그램은 뜨자마자 이 값들을 한 번에 읽어 검사하고, 틀린 것이 있으면 일을 시작하기 전에 틀린 것을 모두 알려 주고 멈춘다. 비밀번호와 토큰은 출력하면 가려진 글…"
prev_url: "/studies/rust/tracing-observability/"
prev_title: "tracing으로 관측하기"
next_url: "/studies/rust/axum-http/"
next_title: "axum으로 HTTP 서비스 만들기"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "44_configuration-secrets_verify.rs", "u": "/studies/rust/code/44_configuration-secrets_verify/", "r": "검증"}]
permalink: "/studies/rust/configuration-secrets/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

서버 주소, DB 주소, API 토큰처럼 배포할 때마다 바뀌는 값은 코드에 적지 않고 바깥(환경 변수)에서 받는다. 프로그램은 뜨자마자 이 값들을 한 번에 읽어 검사하고, 틀린 것이 있으면 일을 시작하기 전에 틀린 것을 모두 알려 주고 멈춘다. 비밀번호와 토큰은 출력하면 가려진 글자만 보이는 상자에 넣는다. 그러면 설정 전체를 로그에 찍어도 비밀값은 새지 않는다. 다만 이 상자는 "찍기"만 막는다. 상자에서 꺼낸 값을 직접 다른 곳에 적는 실수까지는 막지 못한다.

</div>


## 예시로 보기

설정을 그때그때 읽는 서버를 생각해 보자.

```rust
async fn get_link(/* … */) {
    let url = std::env::var("DATABASE_URL").unwrap();
    let ms: u64 = std::env::var("APP_TIMEOUT_MS").unwrap().parse().unwrap();
    // …
}
```

이 코드에는 문제가 셋 있다.

- 변수가 빠져도 서버는 멀쩡히 뜬다. 첫 요청이 이 핸들러에 닿는 순간 panic한다.
- panic 메시지가 어떤 변수인지 말하지 않는다. 실행해 보니 메시지는 ``called `Result::unwrap()` on an `Err` value: NotPresent``뿐이었다.
- 틀린 값이 셋이면, 하나 고치고 다시 띄워야 다음 것이 보인다.

그래서 설정은 시작할 때 한 번에 읽어 타입 있는 구조체 하나로 만든다. 검증 코드의 `Config::from_lookup`에 틀린 값 셋을 주고 `DATABASE_URL`을 빠뜨리면, 서버를 띄우기 전에 이렇게 알려 준다.

```text
invalid configuration (4 problems):
  - APP_BIND_ADDR has invalid value "localhost": expected host:port
  - DATABASE_URL is required
  - APP_API_TOKEN has invalid value "[REDACTED]": must be at least 16 characters
  - APP_TIMEOUT_MS has invalid value "0": expected 1..=60000
```

넷째 줄까지 한 번에 나온다. 토큰은 짧아서 거부됐지만, 토큰 글자 자체는 메시지에 없다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 기본값, 오류 네 개 모으기, 값 여러 개를 함께 보는 규칙, 설정이 틀리면 소켓 단계에 가지 않는 것, Debug·Display 가리기, `unwrap()`의 panic 메시지, 모듈 밖에서 `.0`으로 꺼낼 때의 E0616, 2024 에디션의 `set_var` E0133을 실행해 확인했다 — [44_configuration-secrets_verify.rs](/Hongs_Blog/studies/rust/code/44_configuration-secrets_verify/)</div>

</div>


## 설정은 코드 밖에

The Twelve-Factor App은 설정(config)을 "배포마다 달라질 수 있는 모든 것"으로 정한다. DB 같은 자원의 주소, 바깥 서비스의 자격 증명, 배포마다 다른 호스트 이름이 여기에 들어간다[^1]. 코드에 상수로 적으면 안 된다. 설정과 코드를 엄격히 떼어 놓으라는 것이다[^1].

떼어 놓았는지 보는 시험이 있다. "이 저장소를 지금 당장 오픈소스로 공개해도 자격 증명이 새지 않는가?"[^1] 코드에 토큰 기본값이 하나라도 있으면 이 시험에서 떨어진다.

Twelve-Factor는 설정을 환경 변수에 두라고 권한다[^1]. 이유는 세 가지다.

- 코드를 고치지 않고 배포마다 바꿀 수 있다[^1].
- 실수로 저장소에 커밋될 일이 적다. 설정 파일은 실수로 커밋되기 쉽다[^1].
- 언어와 운영체제를 가리지 않는 표준이다[^1].

`development`, `production`처럼 설정을 이름 붙은 묶음으로 관리하는 방식은 권하지 않는다. 배포가 늘 때마다 묶음이 늘어나 관리하기 어려워진다[^1]. 검증 코드의 `APP_ENV`는 묶음이 아니다. 규칙 하나(운영에서는 바깥에 열린 주소만)를 켜는 변수 하나일 뿐이고, 나머지 설정은 저마다 따로 받는다.

## 타입 있는 설정 구조체

문자열은 문 앞에서 한 번만 타입으로 바꾼다. 그 뒤로 프로그램의 나머지는 틀린 포트나 0초짜리 시간 제한을 볼 일이 없다([타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)).

```rust
#[derive(Debug)]
struct Config {
    bind_addr: SocketAddr,
    database_url: Secret<String>,
    api_token: Secret<String>,
    request_timeout: Duration,
    env: Env, // Dev | Prod
}
```

| 변수 | 들어가는 타입 | 없을 때 | 규칙 |
|---|---|---|---|
| `APP_BIND_ADDR` | `SocketAddr` | `127.0.0.1:8080` | `"localhost"`처럼 주소:포트 꼴이 아니면 거부 |
| `DATABASE_URL` | `Secret<String>` | 오류(필수) | — |
| `APP_API_TOKEN` | `Secret<String>` | 오류(필수) | 16자 이상 |
| `APP_TIMEOUT_MS` | `Duration` | 5초 | 1~60000 |
| `APP_ENV` | `Env` | `Dev` | `dev` 또는 `prod` |

필수값 둘만 주면 나머지는 기본값으로 채워져 `127.0.0.1:8080`, 5초, `Dev`가 됐다.

값 하나만 봐서는 모르는 규칙도 있다. 검증 코드는 운영(`prod`)인데 자기 컴퓨터 안에서만 닿는 주소(`127.0.0.1`)에 묶으려 하면 거부한다. 2024 에디션의 let 체인으로 적었다([열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/)).

```rust
if let (Some(Env::Prod), Some(a)) = (&env, &bind_addr)
    && a.ip().is_loopback()
{
    errs.push(ConfigError::Invalid { key: "APP_BIND_ADDR", value: a.to_string(),
                                     reason: "prod must not bind to loopback" });
}
```

`prod`에 기본 주소를 쓰면 거부됐고, `prod`에 `0.0.0.0:80`을 주면 통과했다.

### 환경을 직접 읽지 않는 까닭

`Config::from_lookup`은 "이름을 주면 값을 돌려주는 함수"를 받는다.

```rust
fn from_lookup(lookup: impl Fn(&str) -> Option<String>) -> Result<Config, ConfigErrors>
fn from_env() -> Result<Config, ConfigErrors> {
    Config::from_lookup(|k| std::env::var(k).ok())
}
```

운영에서는 `std::env::var`를 넘기고, 테스트에서는 `HashMap`을 넘긴다. 테스트가 진짜 환경 변수를 바꾸지 않아도 된다. 진짜 환경을 바꾸는 `std::env::set_var`는 2024 에디션에서 `unsafe` 함수가 됐다. 여러 스레드가 도는 프로그램에서는 플랫폼에 따라 메모리 안전을 깰 수 있기 때문이다[^3]. `cargo test`는 테스트를 여러 스레드에서 동시에 돌린다([테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/)). `unsafe` 없이 부르면 이렇게 멈춘다.

```text
error[E0133]: call to unsafe function `set_var` is unsafe and requires unsafe block
```

예전 에디션 코드를 옮길 때는 `deprecated_safe_2024` 린트가 이 호출을 `unsafe` 블록으로 감싸 준다. 감싸기만 할 뿐 안전한지 따져 주지는 않는다[^3].

`.ok()`에는 함정이 하나 있다. `env::var`는 변수가 없을 때 `NotPresent`를, 값이 올바른 유니코드가 아닐 때 `NotUnicode`를 돌려준다[^2]. `.ok()`는 둘 다 `None`으로 만들어서, 값이 깨진 변수도 "is required"로 보고된다. 둘을 가려 알리려면 `VarError`를 `match`하거나 `var_os`를 쓴다[^2].

## 틀린 것을 모두 모아 보고하기

변수마다 따로 검사하고, 틀리면 오류를 `Vec`에 넣고 다음 변수로 간다. 모든 칸이 채워지고 오류가 하나도 없을 때만 `Config`를 만든다.

```rust
match (bind_addr, database_url, api_token, request_timeout, env) {
    (Some(bind_addr), Some(database_url), Some(api_token), Some(request_timeout), Some(env))
        if errs.is_empty() => Ok(Config { bind_addr, database_url, api_token, request_timeout, env }),
    _ => Err(ConfigErrors(errs)),
}
```

오류 한 개는 thiserror로 만든 `ConfigError`이고, `ConfigErrors`는 그 목록을 `Display`로 예쁘게 찍는다([라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)). 비밀값이 틀렸을 때는 오류에 값 대신 `"[REDACTED]"`를 넣었다. 실행 결과 `short-secret`이라는 글자는 메시지 어디에도 없었다.

## 빨리 실패하기

검증 코드의 `start`는 설정 → 소켓 열기 순서로 돈다. 설정이 틀리면 `?`로 바로 빠져나가 소켓 단계에 가지 않는다. 실행해 보니 실패한 경우 `binding …` 로그가 하나도 없었다. 이렇게 틀린 것을 알자마자 멈추는 것을 빨리 실패하기(fail fast)라 부른다.

- 배포 직후 프로세스가 바로 끝나므로 배포한 사람이 곧바로 안다.
- 요청을 받기 전에 멈추므로 사용자가 반쯤 고장 난 서버를 만날 일이 없다.
- `main`에서는 `Config::from_env()`가 `Err`면 목록을 표준 에러에 찍고 0이 아닌 종료 코드로 끝낸다. 로그 구독자를 걸기 전일 수 있으므로 표준 에러에 직접 찍는다.

## 비밀값 감싸기

설정 구조체에 `#[derive(Debug)]`를 붙이면 편하다. 그러면 `tracing::info!(?cfg)` 한 줄로 시작 설정을 남길 수 있다. 그런데 토큰이 그냥 `String`이면 그 줄에 토큰이 찍힌다. 그래서 비밀값만 따로 감싼다.

```rust
mod secret {
    use std::fmt;

    #[derive(Clone)]
    pub struct Secret<T>(T); // 필드가 private: 모듈 밖에서 .0으로 못 꺼낸다

    impl<T> Secret<T> {
        pub fn new(value: T) -> Self { Secret(value) }
        pub fn expose(&self) -> &T { &self.0 } // 꺼내는 길은 이것 하나
    }

    impl<T> fmt::Debug for Secret<T> {
        fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            f.write_str("Secret([REDACTED])")
        }
    }

    impl<T> fmt::Display for Secret<T> {
        fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            f.write_str("[REDACTED]")
        }
    }
}
```

`Config`를 `{:?}`로 찍은 결과는 이랬다. `DATABASE_URL`의 `?password=pw1`도, 토큰도 없다.

```text
Config { bind_addr: 127.0.0.1:8080, database_url: Secret([REDACTED]), api_token: Secret([REDACTED]), request_timeout: 5s, env: Dev }
```

- **꺼내는 곳을 하나로.** 진짜 값은 `expose()`로만 꺼낸다. 모듈 밖에서 `s.0`으로 꺼내려 하면 ``error[E0616]: field `0` of struct `Secret` is private``로 막힌다([모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)). 코드에서 `expose(`를 검색하면 비밀값이 나가는 곳이 모두 나온다.
- **DB 주소도 통째로 감싼다.** 접속 주소 안에 비밀번호가 들어 있기 때문이다([sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/)).
- **`T: Debug`를 요구하지 않는다.** `impl<T> Debug for Secret<T>`는 안의 값을 찍지 않으므로, `Debug`가 없는 타입도 감쌀 수 있다.
- **손으로 짠 `Debug`보다 감싼 타입.** `Config`에 `Debug`를 직접 짜서 토큰 필드만 빼는 방법도 있다. 그러면 나중에 비밀 필드를 하나 더할 때 빼는 것을 잊는다. 타입이 스스로 가리면 `Config`든 에러든 로그든 어디로 가도 가려진다. 손으로 짠 `Debug`가 필드를 빠뜨린 것은 clippy의 `missing_fields_in_debug`(pedantic)가 잡는다. 이 린트는 `debug_struct`로 짠 경우만 보고, `write!`로 짠 것은 보지 않는다[^7].

### 실무에서 많이 쓰는 secrecy

같은 생각을 크레이트로 만든 것이 secrecy다. 지금 버전은 0.10.3이다[^4]. 이 과목의 실행 환경에는 없어서 돌려 보지 않았고, 위에서 30줄짜리 `Secret<T>`를 직접 짰다.

| | 검증 코드의 `Secret<T>` | secrecy의 `SecretBox<S>` |
|---|---|---|
| 꺼내기 | `expose()` | `ExposeSecret` 트레이트의 `expose_secret(&self) -> &S`. 문서는 비밀값에 닿는 유일한 메서드라고 적는다[^5] |
| `Debug` | `Secret([REDACTED])` | `SecretBox<타입 이름>([REDACTED])`[^6] |
| `Display` | `[REDACTED]` | 구현하지 않는다[^6]. 그래서 `{}`로 찍는 코드는 아예 컴파일되지 않는다 |
| 버릴 때 | 메모리를 그대로 둔다 | zeroize 크레이트로 메모리를 지운다[^4] |
| serde | 없음 | `serde` 기능을 켜면 `Deserialize`는 된다. `Serialize`는 안의 타입이 `SerializableSecret`을 구현해야 된다[^4] |
| 자주 쓰는 이름 | — | `SecretString`, `SecretSlice`[^4] |

secrecy도 `mlock`·`mprotect` 같은 운영체제 수준의 메모리 보호는 하지 않는다[^4].

## 활용

- **구조.** `config` 모듈에 `Config`와 `Secret`을 두고, `main`은 설정 읽기 → 로그 구독자 걸기 → DB 풀 열기 → 서버 띄우기 순서로 간다. `expose()`는 DB에 접속하는 줄, 토큰을 비교하는 줄처럼 값이 정말 필요한 경계에서만 부른다. 연습 [서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/)의 p4가 `x-api-key` 헤더를 비교하는 예다.
- **기본값을 둘 것과 두지 말 것.** 묶을 주소, 시간 제한, 로그 수준처럼 틀려도 위험하지 않은 값은 개발에 맞는 기본값을 둔다. 비밀값에는 기본값을 두지 않는다. 기본 토큰이 코드에 있으면 공개 시험에서 떨어지고, 설정을 빠뜨린 운영 서버가 모두가 아는 토큰으로 뜬다.
- **바꾸려면 다시 띄운다.** 시작할 때 한 번 읽으므로, 비밀값을 바꾸려면 프로세스를 다시 띄운다. 그래서 하던 요청을 마치고 내려가는 종료가 갖춰져 있어야 한다([안전한 종료](/Hongs_Blog/studies/rust/graceful-shutdown/)).
- **로컬 `.env` 파일.** 편해서 많이 쓰지만, Twelve-Factor가 지적한 대로 파일은 실수로 커밋되기 쉽다[^1]. 쓴다면 `.gitignore`에 먼저 넣는다.
- **흔한 실수.**
  - 핸들러 안에서 `env::var(…).unwrap()`. 틀린 설정이 첫 요청 때 드러나고, panic 메시지에 변수 이름도 없다.
  - 디버깅한다고 시작할 때 `std::env::vars()`를 통째로 로그에 찍는다.
  - 검사 실패 메시지에 받은 값을 그대로 넣는다. 비밀값이면 값 대신 `[REDACTED]`를 넣는다.
  - 토큰을 `String` 필드로 둔 구조체에 `#[derive(Debug)]`를 붙인다.
- **로그와 함께.** 감싼 설정은 `tracing::info!(config = ?cfg, "starting")`로 남겨도 안전하다([tracing으로 관측하기](/Hongs_Blog/studies/rust/tracing-observability/)).

## 연결

- 문 앞에서 한 번 검사하고 타입으로 만들기: [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)
- 오류 타입 만들기: [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)
- private 필드가 꺼내는 길을 막는 규칙: [모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)
- 환경 변수 없이 테스트하기: [테스트 전략](/Hongs_Blog/studies/rust/testing-strategy/)
- 설정을 받아 쓰는 곳: [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/), [sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/)
- 연습: [서비스 기초 연습](/Hongs_Blog/studies/rust/service-basics-practice/)의 p1

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`Debug`와 `Display`를 가렸으니 비밀값은 안전하다"</div>

틀렸다. 가린 것은 `{:?}`와 `{}`로 찍는 길 두 개뿐이다. 로그 사고는 대개 이 두 길로 일어나서, 이것만 막으면 다 막은 것처럼 보인다. 하지만 `expose()`로 꺼낸 `&String`을 `format!`에 넣으면 그대로 찍힌다. `#[derive(Clone)]`이라 복사본도 생기고, 검증 코드의 `Secret<T>`는 버릴 때 메모리를 지우지도 않는다. 막는 범위를 넓히려면 `expose()`를 부르는 곳을 리뷰에서 하나하나 보고, 메모리 지우기가 필요하면 secrecy를 쓴다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `APP_BIND_ADDR=localhost`, `APP_API_TOKEN=short-secret`, `APP_TIMEOUT_MS=0`만 주고 `Config::from_lookup`을 부른다. 오류는 몇 개이고, 어떤 키들인가? 메시지에 `short-secret`이 나오는가?</summary>

**답:** 4개. `APP_BIND_ADDR`(주소:포트 꼴이 아님), `DATABASE_URL`(필수인데 없음), `APP_API_TOKEN`(16자 미만), `APP_TIMEOUT_MS`(1~60000 밖). `short-secret`은 나오지 않고 `"[REDACTED]"`가 대신 나온다.<br>
**이유:** 변수마다 따로 검사하고 오류를 모은 뒤 끝에서 한 번에 돌려준다. `APP_ENV`는 없으면 `dev`라 오류가 아니다. 그래서 `prod` 규칙도 걸리지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `secret` 모듈 밖에 `fn token(cfg: &Config) -> &str { &cfg.api_token.0 }`를 적었다. 컴파일되는가? 안 되면 왜이고, 어떻게 고치나?</summary>

**답:** 안 된다. ``error[E0616]: field `0` of struct `Secret` is private``. `cfg.api_token.expose()`를 쓴다.<br>
**이유:** 튜플 구조체 `Secret<T>(T)`의 필드에 `pub`이 없어서 `secret` 모듈과 그 안쪽에서만 보인다. 그래서 진짜 값을 꺼내는 길이 `expose()` 하나로 모인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 새 설정 `APP_BIND_ADDR`와 `APP_API_TOKEN`이 있다. 하나에는 기본값을 두고 하나에는 두지 않으려 한다. 어느 쪽에 기본값을 두나? 다른 쪽에 두면 무엇이 나빠지나?</summary>

**답:** `APP_BIND_ADDR`에 기본값(`127.0.0.1:8080`)을 둔다. `APP_API_TOKEN`은 필수로 둔다.<br>
**이유:** 주소 기본값은 틀려도 자기 컴퓨터 안에서만 열리므로 위험이 작다. 토큰 기본값은 코드에 비밀값을 적는 것이라 공개 시험에 떨어진다. 또 운영에서 토큰을 빠뜨려도 서버가 모두가 아는 토큰으로 조용히 뜬다. 빠뜨리면 시작할 때 멈추는 쪽이 낫다.

</details>


[^1]: The Twelve-Factor App, III. Config (설정의 정의, 코드와 엄격히 떼기, 오픈소스 공개 시험, 환경 변수를 권하는 이유, 이름 붙은 환경 묶음의 문제) — https://12factor.net/config
[^2]: Rust 표준 라이브러리, fn `std::env::var` (`NotPresent`, `NotUnicode`, `var_os`) — https://doc.rust-lang.org/std/env/fn.var.html
[^3]: The Rust Edition Guide, Rust 2024, Unsafe functions (`set_var`, `remove_var`가 `unsafe`가 된 까닭, `deprecated_safe_2024` 린트) — https://doc.rust-lang.org/edition-guide/rust-2024/newly-unsafe-functions.html
[^4]: secrecy 0.10.3 문서, 크레이트 첫 쪽 (`SecretBox`, `SecretString`, `SecretSlice`, 디버그 로그로 새는 것을 막는다, 버릴 때 zeroize로 지운다, serde 기능과 `SerializableSecret`, `mlock`·`mprotect`는 하지 않는다) — https://docs.rs/secrecy/latest/secrecy/
[^5]: secrecy 문서, trait `ExposeSecret` (`fn expose_secret(&self) -> &S`, "this is the only method providing access to a secret") — https://docs.rs/secrecy/latest/secrecy/trait.ExposeSecret.html
[^6]: secrecy 0.10.3 소스, `src/lib.rs`의 `impl Debug for SecretBox` (`"SecretBox<{}>([REDACTED])"`에 `type_name`을 넣는다, `Display` 구현은 없다) — https://docs.rs/secrecy/latest/src/secrecy/lib.rs.html
[^7]: Clippy Lints, `missing_fields_in_debug` — https://rust-lang.github.io/rust-clippy/master/index.html (clippy 0.1.99의 `cargo clippy --explain`으로 설명과 "Known problems"를 읽고, `-W clippy::pedantic`을 켜야 걸리는 것을 실행으로 확인했다)
{% endraw %}
