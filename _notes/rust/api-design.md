---
layout: "note"
title: "API 설계 원칙"
display_title: "API 설계 원칙 (API Design)"
kind: "concept"
kind_label: "기법"
num: "49"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["API Design", "Rust API Guidelines", "API 지침", "C-CASE", "C-CONV", "C-GETTER", "C-COMMON-TRAITS", "C-GOOD-ERR", "C-BUILDER", "Builder Pattern", "빌더 패턴", "must_use", "Sealed Trait", "봉인 트레이트", "C-SEALED", "SemVer", "유의적 버전", "Breaking Change", "깨지는 변경", "deprecated"]
description: "라이브러리가 밖에 내놓은 함수와 타입(공개 API)은 벽에 단 콘센트와 같아서, 남들이 플러그를 꽂기 시작하면 구멍 모양을 바꿀 수 없다. Rust 팀이 정리한 설계 점검표(Rust API Guidelines)를 따르면 이름과 생김새가 표준 라이브러리와 닮아서, 쓰는 사람이 문서를…"
prev_url: "/studies/rust/ci-quality-gates/"
prev_title: "CI 품질 게이트"
next_url: "/studies/rust/build-deploy/"
next_title: "빌드와 배포"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/api-design/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

라이브러리가 밖에 내놓은 함수와 타입(공개 API)은 벽에 단 콘센트와 같아서, 남들이 플러그를 꽂기 시작하면 구멍 모양을 바꿀 수 없다. Rust 팀이 정리한 설계 점검표(Rust API Guidelines)를 따르면 이름과 생김새가 표준 라이브러리와 닮아서, 쓰는 사람이 문서를 덜 보고도 맞게 짐작한다. 대신 공개한 것은 모두 약속이 되어, 열거형에 경우 하나나 트레이트에 메서드 하나만 더해도 남의 빌드가 깨질 수 있다. 그래서 나중에 바꿀 것 같은 곳은 처음 공개할 때 미리 닫아 둔다.

</div>


## 예시로 보기

단축 URL 서비스의 핵심 코드를 `store`라는 라이브러리로 떼어 1.0으로 공개했다고 하자. 다른 팀이 이것을 가져다 쓴다.

```rust
// store 1.0
pub trait Store { fn get(&self, k: &str) -> Option<String>; }
pub enum Kind { NotFound, Duplicate }
pub struct Link { pub code: String, pub url: String }
```

```rust
// 쓰는 쪽
pub struct Mem;
impl store::Store for Mem { fn get(&self, _k: &str) -> Option<String> { None } }
pub fn code(k: store::Kind) -> u8 { match k { store::Kind::NotFound => 1, store::Kind::Duplicate => 2 } }
pub fn make() -> store::Link { store::Link { code: "a".into(), url: "b".into() } }
```

1.1에서 기능을 "더하기만" 했다. 그런데 쓰는 쪽을 다시 컴파일하니 이렇게 됐다.

| 1.1에서 한 일 | 쓰는 쪽 결과 |
|---|---|
| `Store`에 몸통 없는 `fn delete(&self, k: &str) -> bool;` 추가 | `error[E0046]: not all trait items implemented, missing: delete` |
| `Store`에 몸통 있는 `fn size(&self) -> usize { 0 }` 추가 | 통과 |
| 위와 같은데, 쓰는 쪽에 `size` 메서드를 가진 자기 트레이트가 있다 | `error[E0034]: multiple applicable items in scope` |
| `Kind`에 `Unavailable` 추가 | `error[E0004]: non-exhaustive patterns` |
| `Link`에 `pub hits: u64` 추가 | `error[E0063]: missing field hits` |
| `Link`에 `#[non_exhaustive]`를 뒤늦게 붙임 | `error[E0639]: cannot create non-exhaustive struct using struct expression` |

Cargo의 SemVer 안내도 이 변경들을 큰 변경(major)이나 "깰 수도 있는 변경"으로 분류한다[^6]. 1.1이라는 번호는 "안 깨진다"는 약속인데 그 약속을 어긴 것이다.

같은 기능을 1.0에서 미리 대비해 공개했다면 결과가 다르다.

```rust
// store 1.0, 대비한 판
pub trait Store { fn get(&self, k: &str) -> Option<String>; }   // 나중 메서드는 몸통과 함께 더한다
#[non_exhaustive]
pub enum Kind { NotFound, Duplicate }
#[non_exhaustive]
pub struct Link { pub code: String, pub url: String }
impl Link { pub fn new(code: &str, url: &str) -> Self { /* ... */ } }
```

이 판에서 1.1로 가며 몸통 있는 `delete`, `Kind::Unavailable`, `Link::hits`를 더해도 쓰는 쪽은 그대로 컴파일됐다. 쓰는 쪽은 처음부터 `match`에 `_` 갈래를 두고, `Link::new`로 만들었기 때문이다. 대가도 있다. 밖에서 `Link { code, url }`로 직접 만들면 E0639로 막힌다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표의 여섯 결과, 대비한 판의 1.0 → 1.1이 쓰는 쪽을 깨지 않는 것과 리터럴 E0639, 소비형 빌더와 검사, `Command`를 두 번 실행하기, `#[must_use]` 경고와 clippy 린트, 봉인 트레이트의 E0277·E0603, `wrong_self_convention`과 `avoid-breaking-exported-api`를 rustc 1.99.0과 clippy로 컴파일해 확인했다. 라이브러리와 쓰는 쪽은 서로 다른 크레이트로 따로 컴파일했다 — [49_api-design_verify.rs](/Hongs_Blog/studies/rust/code/49_api-design_verify/). `result_unit_err`, 기본으로 꺼진 `missing_debug_implementations`, 이름 바꾸기의 E0425와 `#[deprecated]` 경고는 [배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/)의 p1·p2 코드에서 확인했다.</div>

</div>


## 이름 짓기

Rust 코드의 대소문자 규칙은 이렇다[^1].

| 무엇 | 모양 | 예 |
|---|---|---|
| 타입, 트레이트, 열거형의 경우(variant), 타입 매개변수 | `UpperCamelCase` | `ShortLink`, `T` |
| 모듈, 함수, 메서드, 매크로, 지역 변수 | `snake_case` | `parse_code` |
| 상수, `static` | `SCREAMING_SNAKE_CASE` | `MAX_LEN` |
| 수명 | 짧은 소문자 | `'a` |

줄임말은 한 단어로 친다. `UUID`가 아니라 `Uuid`다[^1]. 크레이트 이름에 `-rs`나 `-rust`를 붙이지 않는다. 모든 크레이트가 Rust이니 붙여 봐야 아무 정보가 없다[^1]. 대소문자는 rustc가 기본 경고(`non_camel_case_types`, `non_snake_case`)로 잡는다.

### 변환 메서드: as_, to_, into_

앞에 붙는 말이 비용과 소유권을 알려 준다[^1].

| 접두사 | 비용 | 소유권 | 표준 라이브러리 예 |
|---|---|---|---|
| `as_` | 공짜 | 빌린 것 → 빌린 것 | `str::as_bytes()` |
| `to_` | 비싸다 | 빌린 것 → 빌린 것이나 새 값(`Copy` 타입은 가진 것 → 가진 것) | `str::to_lowercase()`, `Path::to_str` |
| `into_` | 경우마다 다르다 | 가진 것 → 가진 것 | `String::into_bytes()`, `BufWriter::into_inner()` |

`into_`의 비용은 타입마다 다르다. `String::into_bytes()`는 안의 `Vec<u8>`을 꺼내기만 하니 공짜지만, `BufWriter::into_inner()`는 쌓인 데이터를 먼저 내보내야 해서 비쌀 수 있다[^1]. 감싼 값을 돌려주는 메서드는 `into_inner()`라고 부른다[^1].

### getter는 get_ 없이

필드를 읽는 메서드에는 `get_`을 붙이지 않는다. `first()`, `first_mut()`처럼 쓴다[^1]. `get`이라는 이름은 꺼낼 것이 하나뿐이고 뻔할 때만 쓴다. 예: `Cell::get`[^1]. 컬렉션의 반복자 메서드는 `iter()`, `iter_mut()`, `into_iter()` 세 이름으로 맞춘다[^1].

### 린트가 잡는 것과 사람이 볼 것

clippy의 `wrong_self_convention`은 `into_`가 `self`를, `as_`가 `&self`를 받는지 본다. 그런데 공개 메서드에서는 기본으로 아무 말도 하지 않는다. clippy 설정 `avoid-breaking-exported-api`의 기본값이 `true`이기 때문이다. 고치면 남을 깨뜨릴 제안은 숨기는 설정이다[^8]. 검증 코드에서 같은 `into_string(&self)`가 비공개일 때는 경고, 공개일 때는 조용했다. `clippy.toml`에 `avoid-breaking-exported-api = false`를 두니 공개 메서드에도 경고가 났다. 1.0을 내기 전, 아직 이름을 바꿀 수 있을 때 켜 둔다.

`get_` 접두사, 할당하면서 `as_`라고 부른 메서드, `bool` 인자에는 기본 린트가 없다. 이런 것은 공개 전 리뷰에서 사람이 본다([배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/) p1).

## 표준 트레이트와 에러 타입

다른 크레이트는 고아 규칙 때문에 내 타입에 `Debug`나 `Clone`을 대신 붙여 줄 수 없다. 그래서 타입을 만든 쪽이 `Debug`, `Clone`, `PartialEq`, `Eq`, `Hash`, `Default`, `Display` 같은 흔한 트레이트를 먼저 구현해 둔다(C-COMMON-TRAITS)[^2]. 이유는 [트레이트](/Hongs_Blog/studies/rust/traits/)의 고아 규칙에, 목록은 [꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/)에 있다. 점검표는 모든 공개 타입이 `Debug`를 구현하라고도 적는다(C-DEBUG)[^5]. rustc의 `missing_debug_implementations` 린트가 빠진 곳을 알려 준다. 이 린트는 기본으로 꺼져 있어서 `#![warn(missing_debug_implementations)]`로 켠다.

공개 함수의 에러 타입은 `std::error::Error`를 구현하고 `Send`·`Sync`여야 하며, `()`를 에러로 쓰지 않는다(C-GOOD-ERR)[^2]. 자세한 설계는 [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)에 있다. `Result<T, ()>`를 돌려주는 공개 함수는 clippy 기본 린트 `result_unit_err`가 짚는다.

## 빌더

인자가 많거나 선택 설정이 많은 값, 만들면서 작업(task)을 띄우거나 프로세스를 시작하는 값은 빌더로 만든다(C-BUILDER)[^3]. 빌더는 설정을 하나씩 받아 두었다가 마지막 메서드에서 값을 만든다. 모양은 두 가지다.

| | 비소비형: `&mut self`를 받고 돌려준다 | 소비형: `self`를 받고 돌려준다 |
|---|---|---|
| 예 | `std::process::Command` | 아래 `ServerConfigBuilder` |
| 한 줄로 이어 쓰기 | 된다 | 된다 |
| 조건에 따라 하나만 설정 | `if slow { cmd.arg("-v"); }` | `if slow { b = b.timeout(t); }`처럼 다시 묶는다 |
| 마지막 메서드 | `&self`를 받아 같은 빌더로 여러 번 만든다 | `self`를 받아 빌더가 사라진다 |

API 지침은 비소비형을 먼저 권한다. 만들어질 값이 빌더의 설정을 가져가야(소유해야) 할 때 소비형을 쓴다[^3]. 검증 코드는 `Command` 하나로 `rustc --version`을 두 번 실행해 같은 결과를 받았다. 비소비형이라 가능한 일이다.

```rust
#[derive(Debug, Clone)]
#[must_use = "빌더는 build()를 불러야 설정이 된다"]
pub struct ServerConfigBuilder { addr: String, timeout: Duration, max_body_bytes: usize }

impl ServerConfig {
    pub fn builder(addr: impl Into<String>) -> ServerConfigBuilder { /* 기본값 30초, 1MiB */ }
    pub fn addr(&self) -> &str { &self.addr }          // get_addr가 아니다
}

impl ServerConfigBuilder {
    pub fn timeout(mut self, timeout: Duration) -> Self { self.timeout = timeout; self }
    pub fn max_body_bytes(mut self, n: usize) -> Self { self.max_body_bytes = n; self }
    pub fn build(self) -> Result<ServerConfig, BuildError> { /* 0이면 Err */ }
}

let cfg = ServerConfig::builder("0.0.0.0:8080").timeout(Duration::from_secs(5)).build()?;
```

꼭 있어야 하는 값(주소)은 `builder`의 인자로 받고, 나머지는 기본값을 둔다. 검사는 `build()`에서 한 번 한다. `max_body_bytes(0)`이면 `Err(BuildError::ZeroBodyLimit)`, 메시지는 `body limit must be greater than zero`였다. `ServerConfig`의 필드는 닫혀 있어서 빌더를 거치지 않고는 만들 수 없다. 필드를 공개하면 표현 방식을 못 바꾸고 검사도 못 한다(C-STRUCT-PRIVATE)[^4]. 필수 값이 빠진 채 `build()`를 부르는 실수를 컴파일 때 막는 타입 상태 빌더는 [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)에 있다.

## `#[must_use]`: 버리면 경고

`#[must_use]`는 "이 값은 써야 한다"는 표시다. 함수에 붙이면 그 호출 결과를 버리는 문장에서, 구조체·열거형에 붙이면 그 타입의 값을 버리는 문장에서 `unused_must_use` 린트가 경고한다[^7]. 일부러 버릴 때는 `let _ = f();`로 적는 것이 관례다[^7]. 트레이트 구현 쪽 함수에 붙이면 아무 효과가 없다[^7].

새 값을 돌려줄 뿐 원래 값은 그대로인 메서드에 특히 필요하다. 부르는 사람이 "제자리에서 바뀐다"고 착각하기 쉽기 때문이다. 표준 라이브러리가 이미 그렇게 한다. 검증 코드에서 결과를 버린 세 줄은 이렇게 경고했다.

| 버린 문장 | rustc가 붙인 설명 |
|---|---|
| `x.wrapping_add(1);` | `this returns the result of the operation, without modifying the original` |
| `s.trim();` | `this returns the trimmed string as a slice, without modifying the original` |
| `v.iter().map(\|n\| n + 1);` | `iterators are lazy and do nothing unless consumed` |

소비형 빌더의 설정 메서드도 같다. `#[must_use]` 없이 `b.port(8080);`라고 쓰면 아무 경고 없이 새 빌더가 버려진다. 붙이면 `unused return value of B::port that must be used`가 나고, `#[must_use = "..."]`의 문장이 설명으로 붙는다. 빌더 타입 자체에 붙이면 그 타입을 돌려주는 메서드마다 붙일 필요가 없다. clippy의 pedantic 묶음에는 `Self`를 돌려주는데 `#[must_use]`가 없는 메서드를 짚는 `return_self_not_must_use`와, 붙일 만한 공개 함수를 알려 주는 `must_use_candidate`가 있다. 타입에 `#[must_use]`가 있으면 앞의 린트는 조용했다.

## 봉인 트레이트

크레이트가 구현을 모두 제공하고, 밖에서는 쓰기만 해야 하는 트레이트가 있다. 예: 짧은 코드를 만드는 방식 `Codec`(base62, 10진수). 이런 트레이트는 남이 구현하지 못하게 봉인한다(C-SEALED)[^4].

```rust
mod private {
    pub trait Sealed {}
}

/// 이 트레이트는 봉인되어 있다.
pub trait Codec: private::Sealed {
    fn encode(&self, n: u64) -> String;
}

pub struct Decimal;
impl private::Sealed for Decimal {}
impl Codec for Decimal { /* ... */ }
```

`Codec`을 구현하려면 `Sealed`도 구현해야 한다. 그런데 `Sealed`는 비공개 모듈 안에 들어 있으므로 바깥 크레이트는 그 이름을 부를 수 없다[^4]. 다른 크레이트에서 `impl codec::Codec for Hex`를 쓰니 이렇게 멈췄다.

```text
error[E0277]: the trait bound `Hex: codec::private::Sealed` is not satisfied
  = note: `Codec` is a "sealed trait", because to implement it you also need to implement
          `codec::private::Sealed`, which is not accessible; ...
```

`impl codec::private::Sealed for Hex`로 직접 구현하려 하면 `error[E0603]: module private is private`다. `&dyn Codec`으로 받아 `encode`를 부르는 것은 그대로 됐다.

봉인하면 몸통 없는 메서드를 더해도 깨지는 변경이 아니다. 구현이 모두 내 크레이트 안에 있으니 함께 고치면 된다. 검증 코드에서 봉인한 `Codec`에 `fn decode(&self, s: &str) -> Option<u64>;`를 더한 판으로도 쓰는 쪽이 통과했다. 있는 메서드를 지우거나 시그니처를 바꾸는 것은 여전히 깨진다[^4]. 봉인했다는 사실은 문서에 적어 둔다. 그래야 쓰는 사람이 구현하려고 애쓰지 않는다[^4].

쓰는 사람이 구현해야 하는 트레이트(테스트용 가짜 저장소를 만들 `Store` 같은 것)는 봉인할 수 없다. 이때는 새 메서드를 늘 기본 몸통과 함께 더한다. Java가 인터페이스에 `default` 메서드를 넣은 까닭과 같다. 추상 메서드 하나를 더하면 구현 클래스가 모두 `does not override abstract method` 오류를 낸다([디폴트·정적·private 메서드](/Hongs_Blog/studies/java/java-interface-methods/)). Rust의 E0046과 같은 일이다.

## 무엇이 깨는 변경인가

Cargo의 SemVer 안내가 나눈 것 가운데 자주 부딪히는 것을 모았다[^6]. "큰 변경"은 버전의 맨 앞 숫자를 올려야 하는 변경이다.

| 변경 | 분류 | 막는 법 |
|---|---|---|
| 공개 항목의 이름 바꾸기·옮기기·지우기 | 큰 변경 | 옛 이름을 `#[deprecated]`로 남긴다 |
| 새 공개 항목 더하기 | 작은 변경 | — |
| 트레이트에 몸통 없는 항목 더하기 | 큰 변경 | 기본 몸통을 준다, 또는 처음부터 봉인한다 |
| 트레이트에 몸통 있는 항목 더하기 | 깰 수도 있다(이름 충돌, E0034) | 쓰는 쪽은 `Ext::size(&m)`처럼 트레이트 이름을 붙여 부르면 피한다 |
| `#[non_exhaustive]` 없는 열거형에 경우 더하기 | 큰 변경 | 처음 공개할 때 `#[non_exhaustive]` |
| 필드가 모두 공개인 구조체에 필드 더하기(공개든 비공개든) | 큰 변경 | 처음부터 `#[non_exhaustive]`와 생성자나 `Default` |
| 이미 있는 열거형·구조체에 `#[non_exhaustive]` 붙이기 | 큰 변경 | 처음 공개할 때 붙인다 |
| 비공개 필드가 이미 있는 구조체의 비공개 필드 더하기·빼기 | 작은 변경 | — |
| 최소 Rust 버전 올리기 | 깰 수도 있다. 보통 작은 변경으로 다룬다 | `rust-version`에 적는다 |

`#[deprecated(since = "1.4.0", note = "use lookup instead")]`를 붙이면 rustc가 그 항목을 쓰는 곳마다 경고하고, rustdoc이 문서에 표시한다[^7]. 이름을 바꿀 때 옛 이름을 이렇게 한동안 남기면 작은 변경으로 낼 수 있다.

1.0 전의 판은 규칙이 한 칸씩 밀린다. 0.y.z에서는 y가 큰 변경, z가 작은 변경 자리다. 0.0.z는 무엇이든 큰 변경이다. Cargo는 "왼쪽에서 처음 0이 아닌 자리"가 바뀌면 호환되지 않는다고 보기 때문이다[^6]. 그래서 0.4.2에 열거형 경우를 더하면 0.5.0을 낸다. 이 표를 사람이 매번 지키기 어려우니 CI에서 cargo-semver-checks로 이전 판과 비교한다([CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/)).

## 활용

- **공개 전 점검표.** 대소문자와 `as_`·`to_`·`into_`(C-CASE, C-CONV), getter 이름(C-GETTER), 흔한 트레이트와 `Debug`(C-COMMON-TRAITS, C-DEBUG), 에러 타입(C-GOOD-ERR), 닫힌 필드(C-STRUCT-PRIVATE), 봉인 여부(C-SEALED), 공개 열거형·구조체의 `#[non_exhaustive]`. 지침 전체 목록은 점검표 쪽에 있다[^5].
- **린트로 맡길 것.** 라이브러리 `Cargo.toml`에 `[lints.rust] missing_debug_implementations = "warn"`, 1.0 전에는 `clippy.toml`에 `avoid-breaking-exported-api = false`를 둔다. pedantic의 `must_use_candidate`, `missing_errors_doc`도 공개 API에 쓸모가 있다. 묶음과 기본값은 이 기계의 clippy로 확인했다.
- **흔한 실수.**
  - `shorten(url, true)`처럼 `bool` 인자를 받는다. 부르는 쪽 코드만 보고는 `true`가 무슨 뜻인지 모른다. `Lifetime::Permanent` 같은 열거형으로 받으면 읽히고, 나중에 경우를 더하기도 쉽다(C-CUSTOM-TYPE)[^3].
  - 검사해야 할 값을 `pub` 필드로 연다. 누구나 바꿀 수 있으니 검사가 무의미해진다[^4].
  - 다른 크레이트의 타입을 공개 API에 드러낸다. 그 크레이트의 큰 버전이 내 큰 버전이 된다([라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)의 불투명 에러).
- **실행 파일만 내는 서비스라면.** 쓰는 사람이 컴파일러가 아니라 HTTP 클라이언트다. 위 규칙은 워크스페이스 안 크레이트끼리의 경계에서 쓰고, 버전 약속은 HTTP API 쪽에서 따로 지킨다.

## 연결

- 선수: [트레이트](/Hongs_Blog/studies/rust/traits/)(슈퍼트레이트, 기본 메서드), [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)(`#[non_exhaustive]`의 효과), [모듈과 워크스페이스](/Hongs_Blog/studies/rust/modules-workspaces/)(공개 범위)
- 뉴타입과 타입 상태 빌더: [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)
- 깨는 변경을 기계로 찾기: [CI 품질 게이트](/Hongs_Blog/studies/rust/ci-quality-gates/)
- 같은 문제를 Java는 `default` 메서드로 푼다: [디폴트·정적·private 메서드](/Hongs_Blog/studies/java/java-interface-methods/)
- 직접 리뷰하고 번호를 정해 보기: [배포 준비 연습](/Hongs_Blog/studies/rust/release-readiness-practice/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"새 것을 더하기만 하면 아무도 안 깨진다"</div>

틀렸다. 몸통 없는 트레이트 메서드는 그 트레이트를 구현한 모든 타입을 깨고(E0046), 열거형의 새 경우는 모든 경우를 적은 `match`를 깨고(E0004), 필드가 모두 공개인 구조체의 새 필드는 구조체 리터럴을 깬다(E0063). 몸통 있는 메서드조차 쓰는 쪽의 같은 이름 메서드와 부딪힐 수 있다(E0034). "더하기"가 안전한지는 쓰는 쪽이 그 타입을 어떻게 쓸 수 있느냐로 정해진다. 그래서 쓰는 방법을 처음부터 좁혀 둔다. `_` 갈래를 강제하고(`#[non_exhaustive]`), 생성자로만 만들게 하고, 구현을 막는다(봉인). 확인은 이전 판과 새 판으로 쓰는 쪽 코드를 각각 컴파일해 보는 것이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `codec` 크레이트의 `Codec`은 `pub trait Codec: private::Sealed`이고 `private`은 비공개 모듈이다. 다른 크레이트에서 `impl codec::Codec for Hex { ... }`는 컴파일되는가? `fn show(c: &dyn codec::Codec) -> String { c.encode(7) }`는?</summary>

**답:** 앞의 것은 안 된다(E0277, `Hex: codec::private::Sealed` is not satisfied). 뒤의 것은 된다.<br>
**이유:** `Codec`을 구현하려면 슈퍼트레이트 `Sealed`도 구현해야 하는데, 바깥 크레이트는 비공개 모듈 안의 `Sealed`를 부를 수 없다(직접 부르면 E0603). 쓰는 데는 `Sealed`의 이름이 필요 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 메서드에 붙일 이름을 고르라. (가) `&self`에서 안의 `&str`을 그대로 빌려준다 (나) `&self`에서 소문자로 바꾼 새 `String`을 만든다 (다) `self`를 받아 안의 `Vec<u8>`을 꺼낸다 (라) 필드 `code`를 읽는다. 후보: `as_str`, `to_lowercase`, `into_bytes`, `get_code`, `code`</summary>

**답:** (가) `as_str` (나) `to_lowercase` (다) `into_bytes` (라) `code`<br>
**이유:** `as_`는 공짜로 빌린 것을 빌려주고, `to_`는 비용이 드는 변환, `into_`는 가진 것을 넘긴다. getter에는 `get_`을 붙이지 않는다.<br>
**흔한 오답:** (나)를 `as_lowercase`라고 부른다. 새 `String`을 할당하므로 공짜가 아니다. 이 실수는 clippy가 잡지 못한다. `wrong_self_convention`은 `self`를 받는 모양만 본다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `pub struct Link { pub code: String, pub url: String }`을 1.0으로 내려 한다. 1.x 동안 필드를 더해도 작은 변경이 되게 하려면 무엇을 바꾸는가? 그 대가로 쓰는 쪽은 무엇을 못 하게 되는가?</summary>

**답:** `#[non_exhaustive]`를 붙이고 `Link::new` 같은 생성자(또는 `Default`)를 준다. 아니면 필드를 닫고 getter를 둔다. 대가로 쓰는 쪽은 `Link { code, url }` 리터럴로 만들 수 없고(E0639), 구조체를 패턴으로 풀 때 `..`을 써야 한다.<br>
**흔한 오답:** "1.1에서 `#[non_exhaustive]`를 붙이면 된다." 이미 있는 구조체에 붙이는 것 자체가 큰 변경이다. 리터럴로 만들던 쪽이 그 순간 깨진다.

</details>


[^1]: Rust API Guidelines, Naming — https://rust-lang.github.io/api-guidelines/naming.html (C-CASE: RFC 430 대소문자, 줄임말은 `Uuid`, 크레이트 이름에 `-rs`·`-rust` 금지 / C-CONV: `as_`·`to_`·`into_`의 비용·소유권 표와 예 `str::as_bytes`, `Path::to_str`, `str::to_lowercase`, `String::into_bytes`, `BufWriter::into_inner` / C-GETTER: `first`·`first_mut`, `Cell::get` / C-ITER: `iter`·`iter_mut`·`into_iter`)
[^2]: Rust API Guidelines, Interoperability — https://rust-lang.github.io/api-guidelines/interoperability.html (C-COMMON-TRAITS: 고아 규칙 때문에 타입을 정의한 크레이트가 흔한 트레이트를 구현한다 / C-GOOD-ERR: `Error`, `Send`·`Sync`, `()` 금지 / C-SEND-SYNC)
[^3]: Rust API Guidelines, Type safety — https://rust-lang.github.io/api-guidelines/type-safety.html (C-BUILDER: 복잡한 값과 부작용이 있는 생성, 비소비형 권장과 `Command` 예, 최종 값이 입력을 가져가야 하면 소비형 / C-CUSTOM-TYPE: `bool`·`Option` 대신 열거형)
[^4]: Rust API Guidelines, Future proofing — https://rust-lang.github.io/api-guidelines/future-proofing.html (C-SEALED: 비공개 슈퍼트레이트, 메서드 추가는 깨지 않지만 제거·변경은 깬다, 봉인했다고 문서에 적는다 / C-STRUCT-PRIVATE: 공개 필드는 표현을 못 바꾸게 묶고 검사를 막는다)
[^5]: Rust API Guidelines, Checklist — https://rust-lang.github.io/api-guidelines/checklist.html (항목 ID 목록, C-DEBUG: 모든 공개 타입이 `Debug`를 구현한다)
[^6]: The Cargo Book, SemVer Compatibility — https://doc.rust-lang.org/cargo/reference/semver.html (0.y.z와 왼쪽에서 처음 0이 아닌 자리, `trait-new-item-no-default`·`trait-new-default-item`·`enum-variant-new`·`struct-add-public-field-when-no-private`·`attr-adding-non-exhaustive`, 공개 항목 이름 바꾸기, 비공개 필드 추가, `env-new-rust`)
[^7]: The Rust Reference, Diagnostic attributes — https://doc.rust-lang.org/reference/attributes/diagnostics.html (`must_use`와 `unused_must_use`, 트레이트 구현의 함수에서는 효과 없음, `let _ =`은 관례, `deprecated`의 `since`·`note`)
[^8]: Clippy, Lint Configuration — https://doc.rust-lang.org/clippy/lint_configuration.html (`avoid-breaking-exported-api`: 고치면 다른 크레이트를 깰 제안을 숨긴다, 기본값 `true`, 영향받는 린트에 `wrong_self_convention`·`upper_case_acronyms`·`enum_variant_names` 등)
{% endraw %}
