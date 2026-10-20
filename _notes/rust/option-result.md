---
layout: "note"
title: "Option과 Result"
display_title: "Option과 Result"
kind: "concept"
kind_label: "자료구조"
num: "12"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Option", "Result", "Some", "None", "Ok", "Err", "null", "널", "결합 메서드", "Combinator", "map", "and_then", "ok_or", "unwrap_or_else", "unwrap", "expect", "빈 자리 최적화", "Null Pointer Optimization", "Niche Optimization"]
description: "Rust에는 \"아무것도 없음\"을 뜻하는 null이 없다. 값이 없을 수도 있으면 \"있음 또는 없음\" 상자(Option)에, 실패할 수도 있으면 \"성공 또는 실패 사유\" 상자(Result)에 담아 돌려준다. 상자를 열어 보지 않고는 안의 값을 못 쓰므로, 없는 값을 있는 줄 알고 쓰…"
prev_url: "/studies/rust/enums-pattern-matching/"
prev_title: "열거형과 패턴 매칭"
next_url: "/studies/rust/collections/"
next_title: "컬렉션"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "12_option-result_verify.rs", "u": "/studies/rust/code/12_option-result_verify/", "r": "검증"}]
permalink: "/studies/rust/option-result/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

Rust에는 "아무것도 없음"을 뜻하는 null이 없다. 값이 없을 수도 있으면 "있음 또는 없음" 상자(`Option`)에, 실패할 수도 있으면 "성공 또는 실패 사유" 상자(`Result`)에 담아 돌려준다. 상자를 열어 보지 않고는 안의 값을 못 쓰므로, 없는 값을 있는 줄 알고 쓰는 실수를 컴파일러가 막는다. 대신 상자를 억지로 여는 `unwrap`을 남발하면 그 자리에서 프로그램이 멈추므로, 서비스 코드에서는 실패 갈래를 직접 다룬다.

</div>


## 예시로 보기

Java에서 `map.get(key)`는 키가 없으면 `null`을 돌려준다. 돌려받은 값이 `null`인지 확인하지 않고 메서드를 부르면 실행 중에 `NullPointerException`이 난다([참조 비교와 null](/Hongs_Blog/studies/java/java-reference-equality/)). 타입만 봐서는 null이 올 수 있는지 알 수 없다는 게 문제다. null을 만든 토니 호어는 이것을 "10억 달러짜리 실수"라 불렀다[^1].

Rust는 "없을 수도 있음"을 타입에 적는다. 표준 라이브러리에 이런 열거형이 있다[^1].

```rust
enum Option<T> { None, Some(T) }
enum Result<T, E> { Ok(T), Err(E) }
```

`Option<i8>`과 `i8`은 서로 다른 타입이다. 그래서 둘을 바로 더하면 컴파일되지 않는다[^1].

```text
let x: i8 = 5;
let y: Option<i8> = Some(5);
let sum = x + y;
error[E0277]: cannot add `Option<i8>` to `i8`
```

거꾸로 말하면, 타입이 `Option`이 아닌 값은 반드시 들어 있다고 믿어도 된다[^1]. `HashMap::get`은 `Option<&V>`를 돌려주고, 문자열을 숫자로 바꾸는 `"30".parse::<u8>()`은 `Result<u8, ParseIntError>`를 돌려준다.

`Option`과 `Result`의 차이는 하나다. 없을 때 이유가 필요한가.

| 타입 | 실패 쪽 | 쓰는 때 | 예 |
|---|---|---|---|
| `Option<T>` | `None` (이유 없음) | 없는 게 정상인 경우 | 맵에서 키 찾기, 목록의 첫 원소 |
| `Result<T, E>` | `Err(E)` (이유를 담는다) | 실패를 설명해야 하는 경우 | 파싱, 파일 열기, 네트워크 요청 |

## 상자를 여는 법

`match`나 `if let`으로 열면 된다([열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/)). 하지만 "있으면 바꾸고 없으면 그대로 둔다" 같은 일은 매번 `match`를 쓰기엔 길다. 그래서 상자를 연 채로 다루는 메서드(결합 메서드, combinator)가 있다[^2][^3].

| 메서드 | `Some(x)` / `Ok(x)`일 때 | `None` / `Err(e)`일 때 | 예 |
|---|---|---|---|
| `map(f)` | `Some(f(x))` | 그대로 | `Some(4).map(\|x\| x * 10)` → `Some(40)` |
| `and_then(f)` | `f(x)` (`f`가 상자를 돌려준다) | 그대로 | `Some(4).and_then(\|x\| x.checked_sub(5))` → `None` |
| `filter(p)` | 조건이 참이면 그대로, 아니면 `None` | `None` | `Some(4).filter(\|x\| x % 2 == 0)` → `Some(4)` |
| `ok_or(e)` | `Ok(x)` | `Err(e)` | `None.ok_or("없음")` → `Err("없음")` |
| `map_err(f)` | 그대로 | `Err(f(e))` | 에러 타입 바꾸기 |
| `ok()` | `Some(x)` | `None` | `Result`를 `Option`으로 |
| `unwrap_or(v)` | `x` | `v` | 기본값 |
| `unwrap_or_else(f)` | `x` | `f()` 또는 `f(e)` | 기본값을 계산해야 할 때 |

`map`과 `and_then`이 헷갈리면 돌려주는 타입을 본다. 함수가 그냥 값을 돌려주면 `map`이다. 함수가 또 상자를 돌려주면 `and_then`이다. `and_then` 자리에 `map`을 쓰면 `Some(Some(3))`처럼 상자가 두 겹이 된다.

`unwrap_or(v)`는 `v`를 미리 계산한다. 값이 있어서 `v`가 필요 없어도 계산한다. 그래서 `v` 자리에 함수 호출을 넣을 거면 필요할 때만 계산하는 `unwrap_or_else`를 쓰라고 std 문서가 권한다[^3]. `ok_or`와 `ok_or_else`도 같은 관계다[^3].

### `?`로 실패를 위로 넘기기

여러 단계가 이어질 때 단계마다 `match`를 쓰면 코드가 오른쪽으로 밀린다. 식 뒤에 `?`를 붙이면, 성공이면 안의 값을 꺼내고 실패면 그 자리에서 함수를 끝내고 실패를 돌려준다[^2][^4].

```rust
fn greeting(db: &HashMap<u32, &str>, id: u32, age_text: &str) -> Result<String, LookupError> {
    let name = find_name(db, id).ok_or(LookupError::NoSuchUser(id))?;
    let age = parse_age(age_text)?;
    Ok(format!("{name}({age})"))
}
```

`find_name`은 `Option`을 돌려주므로 `ok_or`로 `Result`로 바꾼 뒤 `?`를 붙였다. `?`는 함수의 반환 타입이 `Option`이나 `Result`일 때만 쓸 수 있다[^2]. 에러 타입이 다를 때 어떻게 바뀌는지는 [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)에서 다룬다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: E0277 메시지, 표의 결과, `?`의 세 경우, 아래의 크기와 패닉 메시지, `must_use` 경고, clippy 린트를 실행해 확인했다 — [12_option-result_verify.rs](/Hongs_Blog/studies/rust/code/12_option-result_verify/)</div>

</div>


## 상자는 공짜일 때가 많다

"null 대신 상자를 쓰면 메모리를 더 먹지 않나?" 참조 `&T`는 절대 null이 아니다. 그래서 컴파일러는 "주소 0"을 `None`으로 쓴다. 태그 칸이 따로 필요 없다. std는 `&T`, `&mut T`, `Box<T>`, 함수 포인터, `NonZero` 정수 같은 타입에 대해 `Option<T>`가 `T`와 크기가 같다고 보장한다. 이것을 빈 자리 최적화(null pointer optimization)라 부른다[^2].

| 타입 | 크기(이 기계) | `Option`을 씌운 크기 | 보장 |
|---|---|---|---|
| `&u64` | 8 | 8 | std 보장 |
| `Box<u64>` | 8 | 8 | std 보장 |
| `NonZero<u32>` | 4 | 4 | std 보장[^5] |
| `u32` | 4 | 8 | 없음. 0도 쓸 수 있는 값이라 빈자리가 없다 |

`u32`는 모든 비트 조합이 쓸 수 있는 값이라 `None`을 숨길 자리가 없다. 그래서 태그 칸이 붙어 8바이트가 된다. 0이 올 수 없는 값이면 `NonZero<u32>`에 담아 이 손해를 없앤다. `Result<NonZero<i32>, ()>`도 4바이트다. `Result`는 한쪽이 보장 목록의 타입이고 다른 쪽이 크기 0인 타입이면 같은 보장을 받는다[^4].

## unwrap은 왜 조심하나

`unwrap()`은 상자를 억지로 연다. `None`이나 `Err`이면 그 자리에서 패닉(panic)으로 멈춘다. 메시지는 이렇다.

```text
called `Option::unwrap()` on a `None` value
called `Result::unwrap()` on an `Err` value: ParseIntError { kind: InvalidDigit }
```

std 문서는 `unwrap`이 패닉할 수 있으므로 쓰지 말라고 권한다. 패닉은 복구할 수 없는 오류를 위한 것이고 프로그램 전체를 멈출 수 있다[^3]. 서버에서 요청 하나의 입력이 이상하다고 프로세스가 죽으면 다른 손님의 요청까지 같이 끊긴다.

그래도 `unwrap`·`expect`가 맞는 자리가 있다[^6].

- 예제 코드와 시제품: 에러 처리를 나중에 정할 자리 표시다.
- 테스트: 테스트에서 패닉은 곧 "실패"라는 뜻이라 원하는 동작이다.
- 사람이 코드를 보고 절대 실패하지 않음을 아는 경우: 코드에 박아 둔 `"127.0.0.1".parse()` 같은 것이다. 이때는 `expect`로 "왜 실패하지 않는가"를 적는다. std 문서는 `expect` 메시지에 "왜 `Some`일 거라 믿는지"를 쓰라고 권한다[^3]. 예: `.expect("설정 파일에 port가 있어야 한다")`.

어느 경우에 패닉을 써도 되는지는 [panic을 쓸 때](/Hongs_Blog/studies/rust/panic-policy/)에서 정리한다.

## 활용

- **서비스 코드 규칙.** 요청 처리 경로에서는 `unwrap`을 쓰지 않고 `?`로 에러를 위로 올린다. 맨 위(핸들러)에서 에러를 HTTP 상태 코드로 바꾼다. [애플리케이션 에러 처리](/Hongs_Blog/studies/rust/application-errors/)
- **clippy로 막기.** `unwrap_used`, `expect_used`는 restriction 그룹이라 기본으로 꺼져 있다. 팀 규칙으로 막으려면 `Cargo.toml`의 `[lints.clippy]` 표에 `unwrap_used = "deny"`를 적거나[^8] `#![deny(clippy::unwrap_used)]`로 켠다. 테스트 모듈에는 `#[allow(clippy::unwrap_used)]`를 붙여 풀어 준다. `if o.is_some() { o.unwrap() }`처럼 확인한 뒤 `unwrap`하는 코드는 기본으로 켜진 `unnecessary_unwrap`이 `if let`으로 바꾸라고 경고한다[^7].
- **`Result`를 버리지 않는다.** `Result`에는 `#[must_use]`가 붙어 있어, 돌려받은 `Result`를 쓰지 않으면 `unused_must_use` 경고가 난다[^4]. 에러를 일부러 무시할 때는 `let _ = …;`로 의도를 드러낸다.
- **흔한 실수.**
  - `Option<Option<T>>`나 `Result<Option<T>, E>`가 생겼는데 무슨 뜻인지 정하지 않는다. `map` 대신 `and_then`을 써야 했던 경우가 많다. 일부러 쓴다면 바깥과 안쪽 `None`의 뜻을 문서에 적는다.
  - 에러 이유를 버린다. `.ok()`로 `Result`를 `Option`으로 바꾸면 실패 사유가 사라진다. 로그에 사유가 필요하면 바꾸기 전에 남긴다.
  - `Option<bool>`처럼 상태 세 개를 상자 하나로 나타낸다. "예/아니오/모름"이면 변형 셋짜리 열거형이 읽기 쉽다. [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)

## 연결

- 선수: [열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/). `Option`과 `Result`는 평범한 열거형이다.
- `?`와 에러 타입 바꾸기: [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)
- 결합 메서드는 [클로저](/Hongs_Blog/studies/rust/closures/)를 인자로 받는다. 반복자의 `map`·`filter`와 이름이 같은 것은 우연이 아니다. `Option`은 원소가 0개나 1개인 목록처럼 동작한다: [반복자](/Hongs_Blog/studies/rust/iterators/)
- 데이터베이스의 `NULL`도 "값이 없음"이다. sqlx는 SQLite에서 `NULL`일 수 있는 값을 `Option<T>`로 받는다[^9]: [sqlx로 데이터베이스 쓰기](/Hongs_Blog/studies/rust/sqlx-database/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 함수의 반환 타입을 `Option<T>`와 `Result<T, E>` 중 무엇으로 하는가? (가) 목록에서 가장 큰 값 찾기 (나) 설정 파일을 읽어 구조체로 만들기 (다) 사용자 ID로 캐시에서 사용자 찾기</summary>

**답:** (가) `Option` (나) `Result` (다) `Option`<br>
**이유:** (가)는 목록이 비었을 때만 값이 없고 이유가 하나뿐이다. (나)는 파일이 없는지, 형식이 틀렸는지, 어느 줄이 틀렸는지 알려 줘야 한다. (다)는 캐시에 없는 게 정상이다.<br>
**흔한 오답:** (다)를 `Result`로 한다. "없음"이 에러가 아니라 흔한 결과라면 `Option`이 맞다. 캐시 서버 연결이 끊긴 것처럼 진짜 실패가 따로 있으면 `Result<Option<User>, CacheError>`가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `Option<&u64>`와 `Option<u32>`는 각각 몇 바이트인가(64비트 기계)? 왜 한쪽만 늘어나는가?</summary>

**답:** `Option<&u64>`는 8바이트(`&u64`와 같다), `Option<u32>`는 8바이트(`u32`의 4바이트보다 크다).<br>
**이유:** 참조는 절대 주소 0이 아니므로 0을 `None`으로 쓸 수 있다. std가 이것을 보장한다. `u32`는 0부터 최댓값까지 모두 쓸 수 있는 값이라 `None`을 숨길 빈자리가 없어 태그 칸이 따로 붙는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 코드는 무엇을 찍는가?</summary>

```rust
let calls = Cell::new(0);
let expensive = || { calls.set(calls.get() + 1); 0u32 };
let a = Some(1u32).unwrap_or(expensive());
let b = Some(1u32).unwrap_or_else(expensive);
let c = None.unwrap_or_else(expensive);
println!("a={a} b={b} c={c} calls={}", calls.get());
```
**답:** `a=1 b=1 c=0 calls=2`<br>
**이유:** `unwrap_or`의 인자 `expensive()`는 값이 있어도 먼저 계산되므로 한 번 불린다. `unwrap_or_else`는 상자가 비었을 때만 함수를 부르므로 `b`에서는 안 불리고 `c`에서 한 번 불린다.<br>
**흔한 오답:** `calls=1`. `unwrap_or`도 필요할 때만 계산한다고 생각한 것이다.

</details>


[^1]: The Rust Programming Language, 6.1 Defining an Enum, The Option Enum and Its Advantages Over Null Values — https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html
[^2]: std 문서, Module `std::option`(The question mark operator, Method overview, Representation) — https://doc.rust-lang.org/std/option/index.html
[^3]: std 문서, Enum `std::option::Option`(`unwrap`, `unwrap_or`, `ok_or`, `expect`의 Recommended Message Style) — https://doc.rust-lang.org/std/option/enum.Option.html
[^4]: std 문서, Module `std::result`(Results must be used, The question mark operator, Representation) — https://doc.rust-lang.org/std/result/index.html
[^5]: std 문서, Struct `std::num::NonZero`, Layout — https://doc.rust-lang.org/std/num/struct.NonZero.html
[^6]: The Rust Programming Language, 9.3 To panic! or Not to panic! — https://doc.rust-lang.org/book/ch09-03-to-panic-or-not-to-panic.html
[^7]: Clippy Lints, `unwrap_used`, `expect_used`, `unnecessary_unwrap` — https://rust-lang.github.io/rust-clippy/master/index.html (rustc 1.99.0의 `clippy-driver`로 기본 켜짐·꺼짐을 확인했다)
[^8]: The Cargo Book, The Manifest Format, The `[lints]` section — https://doc.rust-lang.org/cargo/reference/manifest.html
[^9]: sqlx 문서, Module `sqlx::sqlite::types`, Nullable — https://docs.rs/sqlx/latest/sqlx/sqlite/types/index.html
{% endraw %}
