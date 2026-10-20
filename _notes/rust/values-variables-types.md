---
layout: "note"
title: "값·변수·타입"
display_title: "값·변수·타입 (Values, Variables and Types)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Values Variables and Types", "let", "mut", "가림", "Shadowing", "const", "스칼라 타입", "Scalar Types", "정수 넘침", "Integer Overflow", "checked_add", "wrapping_add", "saturating_add", "overflowing_add", "as 변환", "Numeric Cast", "char", "usize"]
description: "Rust의 변수는 기본으로 \"한 번 적으면 못 고치는 칸\"이다. 고칠 칸은 처음부터 고친다고 밝혀야 해서, 코드를 읽는 사람이 어디서 값이 바뀌는지 바로 안다. 숫자 타입은 크기가 정해져 있어 넘칠 수 있다. 개발용 빌드에서는 넘치는 순간 멈추지만, 배포용 빌드에서는 Java처럼 …"
prev_url: "/studies/rust/cargo-packages/"
prev_title: "cargo와 패키지 구조"
next_url: "/studies/rust/expressions-control-flow/"
next_title: "표현식과 제어 흐름"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "03_values-variables-types_verify.rs", "u": "/studies/rust/code/03_values-variables-types_verify/", "r": "검증"}]
permalink: "/studies/rust/values-variables-types/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

Rust의 변수는 기본으로 "한 번 적으면 못 고치는 칸"이다. 고칠 칸은 처음부터 고친다고 밝혀야 해서, 코드를 읽는 사람이 어디서 값이 바뀌는지 바로 안다. 숫자 타입은 크기가 정해져 있어 넘칠 수 있다. 개발용 빌드에서는 넘치는 순간 멈추지만, 배포용 빌드에서는 Java처럼 조용히 감아 돌아 엉뚱한 값이 된다. 큰 타입을 작은 타입으로 `as`로 바꿀 때도 경고 없이 잘린다.

</div>


## 예시로 보기

긴 함수 안에서 `count`라는 변수의 값이 이상하다. 파이썬이나 Java라면 `count =`가 나오는 모든 줄을 찾아봐야 한다. Rust에서는 `let count`에 `mut`가 없으면 그 값은 처음 적은 뒤로 절대 바뀌지 않는다. `mut`가 붙은 변수만 의심하면 된다.

```rust
let x = 5;
x = 6;      // error[E0384]: cannot assign twice to immutable variable `x`
```

```rust
let mut x = 5;   // mut: 바꿀 수 있는 변수
x = 6;           // 된다
```

한 번 이름을 붙인 값은 바꿀 수 없다는 것이 기본이다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 이 문서의 컴파일 오류(E0384, E0308, 상수 넘침, 범위 밖 리터럴, const 타입 생략), 기본 타입 `i32`·`f64`, 크기, 넘침의 네 결과(dev panic, `-C overflow-checks=off`와 `-O`에서 감기, 0으로 나누기와 `i32::MIN / -1`은 검사를 꺼도 panic), 네 메서드, `as` 변환 결과를 `rustc` 1.99.0으로 확인했다 — [03_values-variables-types_verify.rs](/Hongs_Blog/studies/rust/code/03_values-variables-types_verify/)</div>

</div>


## 가림: 같은 이름으로 새 변수 만들기

`let`을 다시 쓰면 같은 이름의 새 변수가 생기고, 앞의 변수는 가려진다. 이것을 가림(shadowing)이라고 부른다[^1].

```rust
let spaces = "   ";         // &str
let spaces = spaces.len();  // usize. 새 변수라 타입이 달라도 된다
```

`mut`와 무엇이 다를까? `mut`는 같은 칸의 값을 바꾸므로 타입은 그대로여야 한다[^1].

```rust
let mut spaces = "   ";
spaces = spaces.len();   // error[E0308]: mismatched types
                         //   expected `&str`, found `usize`
```

가림은 블록 안에서만 유효하다. 블록이 끝나면 바깥 이름이 다시 보인다.

```rust
let x = 5;
let x = x + 1;      // 6
{
    let x = x * 2;  // 안쪽: 12
}
// 바깥: 6
```

가림은 "문자열로 받은 입력을 숫자로 바꾼 뒤 같은 이름을 쓰고 싶을 때"처럼 단계를 거쳐 값의 모양이 바뀔 때 쓴다. `input_str`, `input_num` 같은 이름을 따로 짓지 않아도 된다.

## 상수

`const`는 컴파일할 때 값이 정해지는 이름이다. `mut`를 붙일 수 없고, 타입을 반드시 적어야 하며, 실행 중에야 알 수 있는 값은 넣을 수 없다[^1].

```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;  // 10800
const N = 5;   // error: missing type for `const` item
```

## 스칼라 타입

값 하나를 담는 타입(스칼라 타입)은 정수, 부동소수점 수, 불(bool), 문자(char) 넷이다[^2].

| 종류 | 타입 | 크기 | 메모 |
|---|---|---|---|
| 부호 있는 정수 | `i8` `i16` `i32` `i64` `i128` `isize` | 숫자만큼의 비트 | 타입을 안 적으면 `i32` |
| 부호 없는 정수 | `u8` `u16` `u32` `u64` `u128` `usize` | 위와 같음 | 배열 번호와 길이는 `usize` |
| 부동소수점 | `f32` `f64` | 4, 8바이트 | 타입을 안 적으면 `f64` |
| 불 | `bool` | 1바이트 | `true`, `false` |
| 문자 | `char` | 4바이트 | 유니코드 스칼라 값 하나 |

`isize`와 `usize`는 컴퓨터에 따라 크기가 다르다. 64비트 컴퓨터에서는 64비트, 32비트 컴퓨터에서는 32비트다[^2]. 정수 기본이 `i32`, 실수 기본이 `f64`인 것도 Rust 책이 밝힌 규칙이다[^2].

Java와 비교하면 부호 없는 정수(`u8`~`u128`)가 있다는 것이 다르다([변수와 기본 타입](/Hongs_Blog/studies/java/java-primitive-types/)). C와 비교하면 `int`가 몇 비트인지 컴퓨터마다 다른 일이 없다. `i32`는 어디서나 32비트다.

### char는 4바이트, 문자열 길이는 바이트로 센다

`char`는 4바이트이고 유니코드 스칼라 값 하나를 담는다. 한글, 이모지도 `char` 하나다. 범위는 `U+0000`~`U+D7FF`와 `U+E000`~`U+10FFFF`다[^2]. 그래서 C의 1바이트 `char`와 다르다.

```rust
'가' as u32          // 0xAC00 (44032)
"가".len()           // 3. 문자열은 UTF-8 바이트 수로 센다
"가".chars().count() // 1
```

`String`과 `&str`의 바이트·글자 문제는 [슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/)에서 이어진다.

### 타입끼리 저절로 섞이지 않는다

C와 Java는 `int + long`을 하면 작은 쪽을 큰 쪽으로 자동으로 바꿔 준다. Rust는 해 주지 않는다.

```rust
let a: u32 = 5;
let b: u64 = 7;
a + b              // error[E0308]: mismatched types
u64::from(a) + b   // 12. 넓히는 변환은 From으로 적는다
```

귀찮지만 "어디서 타입이 바뀌는지"가 코드에 다 드러난다.

## 정수 넘침

`u8`은 0부터 255까지만 담는다. 255에 1을 더하면 칸이 모자란다. 이것을 정수 넘침(integer overflow)이라고 부른다. Rust가 하는 일은 빌드 종류에 따라 다르다[^2].

| 상황 | 255u8 + 1의 결과 |
|---|---|
| 개발용 빌드(`cargo build`, `cargo run`) | panic: `attempt to add with overflow` |
| 배포용 빌드(`--release`) | `0`. 감아 돈다(2의 보수 감기) |
| 배포용이지만 `overflow-checks = true` | panic |
| 컴파일러가 값을 미리 아는 경우(`let x: u8 = 255 + 1;`) | 컴파일 오류: `this arithmetic operation will overflow` |

빌드 종류의 차이는 사실 프로필의 `overflow-checks` 설정 하나에서 온다. `dev`는 true, `release`는 false가 기본값이다[^3]. `rustc`에 직접 `-C overflow-checks=off`를 주거나 최적화 플래그 `-O`만 줘도 감는 쪽으로 바뀐다. `i32::MAX + 1`도 같은 식으로 `-2147483648`이 된다.

감아 도는 결과에 기대는 코드는 오류로 본다[^2]. 넘침을 "가끔 생기는 일"로 다뤄야 한다면 메서드로 뜻을 적는다[^2].

| 메서드 | `250u8.____(10)` | 뜻 |
|---|---|---|
| `checked_add` | `None` | 넘치면 `None`. 넘치지 않으면 `Some(값)` |
| `wrapping_add` | `4` | 어느 빌드에서나 감는다 |
| `saturating_add` | `255` | 끝값에서 멈춘다 |
| `overflowing_add` | `(4, true)` | 감은 값과 넘쳤는지 여부 |

`add` 자리에 `sub`, `mul`, `div`, `pow` 등을 넣은 같은 이름의 메서드가 모두 있다. 예를 들어 `0u8.saturating_sub(1)`은 0이다.

### 검사를 꺼도 panic인 것

다음은 `overflow-checks`를 꺼도 panic이다. 검증 코드에서 `-C overflow-checks=off`로 컴파일해 확인했다.

- 0으로 나누기: `attempt to divide by zero`
- `i32::MIN / -1`: 답 2147483648이 `i32`에 안 들어간다. `attempt to divide with overflow`. Reference는 이 검사가 옛 이유로 넘침 검사를 꺼도 남는다고 적는다[^4].

C에서는 둘 다 정의되지 않은 동작이다. Rust는 어느 빌드에서나 멈춘다.

## as 변환은 조용히 자른다

`as`는 숫자 타입을 바꾸는 가장 짧은 방법이다. 대신 실패를 알려 주지 않는다[^4].

| 식 | 결과 | 규칙 |
|---|---|---|
| `300i32 as u8` | `44` | 큰 정수 → 작은 정수: 아래 비트만 남긴다(300 = 256 + 44) |
| `-1i32 as u32` | `4294967295` | 같은 크기: 비트를 그대로 읽는다 |
| `3.99f64 as i32` | `3` | 실수 → 정수: 0 쪽으로 버린다 |
| `-1.5f64 as u8` | `0` | 범위 밖 실수: 끝값으로 붙는다(포화) |
| `1e10f64 as i32` | `2147483647` | 위와 같음 |
| `f64::NAN as i32` | `0` | NaN은 0 |

Java의 `(byte) 300`도 44가 된다([타입 변환](/Hongs_Blog/studies/java/java-type-conversion/)). 반면 실수 → 정수에서 범위를 넘으면 C는 정의되지 않은 동작이지만 Rust는 끝값으로 붙인다.

잘리면 안 되는 자리에서는 `try_from`을 쓴다. 범위를 넘으면 `Err`를 돌려준다.

```rust
u8::try_from(300i32)  // Err(..)
u8::try_from(200i32)  // Ok(200)
```

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">변수와 정수 넘침</div>

변수는 `let 이름: 타입 = 값;`으로 만든다. `mut`가 없으면 값을 다시 대입할 수 없다(E0384). 같은 이름으로 `let`을 다시 쓰면 새 변수가 생겨 앞의 변수를 가린다.

기호로 쓰면, $$n$$비트 부호 없는 정수 타입이 담는 값은 $$0 \le x \le 2^n - 1$$이고, 부호 있는 정수 타입은 $$-2^{n-1} \le x \le 2^{n-1} - 1$$이다. 두 값의 수학적 합 $$s = a + b$$가 이 범위를 벗어나면 넘침이다. 넘침 검사가 켜져 있으면 panic이고, 꺼져 있으면 결과는 $$s \bmod 2^n$$을 그 타입의 비트로 읽은 값이다.

</div>


예를 들어 `u8`($$n = 8$$)에서 $$250 + 10 = 260$$이고 $$260 \bmod 256 = 4$$다. `wrapping_add`가 4를 준 이유다.

## 활용

- **실제 쓰임.** 길이·번호 계산에서 `len() - 1`을 할 때 `len()`이 0이면 `usize`가 넘친다. dev에서는 panic, release에서는 `usize::MAX`라는 거대한 수가 된다. `checked_sub`이나 `saturating_sub`을 쓰거나 비었는지 먼저 본다.
- **돈과 개수.** 금액·재고처럼 넘치면 안 되는 값은 `checked_*`로 계산하고 `None`을 에러로 바꾼다([Option과 Result](/Hongs_Blog/studies/rust/option-result/)). 해시나 난수처럼 감는 것이 원래 뜻인 계산은 `wrapping_*`을 쓴다.
- **release에서도 잡기.** 넘침이 곧 보안 문제인 서비스는 `[profile.release] overflow-checks = true`를 켠다([cargo와 패키지 구조](/Hongs_Blog/studies/rust/cargo-packages/)).
- **clippy.** 기본으로는 꺼져 있지만 켜 둘 만한 린트가 있다[^5].
  - `cast_possible_truncation`, `cast_sign_loss`, `cast_possible_wrap`(pedantic): `as`로 잘리거나 부호가 바뀔 수 있는 변환을 짚는다.
  - `arithmetic_side_effects`(restriction): 넘칠 수 있는 모든 산술을 짚는다. 결제 코드처럼 엄격한 곳에서 쓴다.
  - `shadow_unrelated`(restriction): 앞의 값과 관계없는 값으로 가리는 것을 짚는다.
- **흔한 실수.** dev에서 테스트가 통과했다고 release에서도 같다고 믿는다. 넘침 경로는 release에서 panic 대신 틀린 값으로 바뀐다.

## 연결

- 선수: [cargo와 패키지 구조](/Hongs_Blog/studies/rust/cargo-packages/)(프로필과 `overflow-checks`)
- Java에서 같은 넘침: [연산자와 오버플로](/Hongs_Blog/studies/java/java-operators/). Java는 언제나 감는다. Rust의 release 기본값과 같고, dev 기본값과 다르다.
- 감는다는 것이 CPU에서 무슨 일인지: [올림 플래그와 넘침 플래그 비교](/Hongs_Blog/studies/assembly-language/carry-vs-overflow-flag/)
- 다음: [표현식과 제어 흐름](/Hongs_Blog/studies/rust/expressions-control-flow/). 타입으로 잘못된 값을 아예 못 만들게 하는 법은 [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/).

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"Rust는 정수 넘침을 언제나 막아 준다"</div>

틀렸다. dev 빌드에서만 검사해서 panic을 낸다. 그럴듯한 이유는 개발 중에는 넘칠 때마다 멈추는 것을 자주 보기 때문이다. 실제로 release 빌드의 기본값은 `overflow-checks = false`라서 `255u8 + 1`은 조용히 0이 된다. `cargo run`과 `cargo run --release`로 같은 코드를 돌려 보면 하나는 멈추고 하나는 0을 찍는다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 컴파일되는가? 안 되면 왜? (가) `let x = 5; let x = "five";` (나) `let mut x = 5; x = "five";`</summary>

**답:** (가)는 된다. (나)는 E0308로 안 된다.<br>
**이유:** (가)는 가림이라 새 변수가 생기고 타입이 달라도 된다. (나)는 같은 칸에 다시 넣는 것이라 처음 타입 `i32`에 `&str`을 넣을 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `let x: u8 = black_box(250);`일 때 `x.checked_add(10)`, `x.wrapping_add(10)`, `x.saturating_add(10)`, `x + 10`(dev 빌드)의 결과를 예측하라.</summary>

**답:** `None`, `4`, `255`, panic(`attempt to add with overflow`)<br>
**이유:** 260은 `u8`을 넘는다. 감으면 $$260 - 256 = 4$$, 붙이면 255다. dev 빌드는 넘침 검사가 켜져 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 사용자가 보낸 `i64` 나이 값을 `u8` 칸에 저장하려 한다. `age as u8`과 `u8::try_from(age)` 중 무엇을 쓰고, 다른 쪽은 왜 안 되는가? 입력이 300이면 각각 무엇이 되는가?</summary>

**답:** `u8::try_from(age)`를 쓴다. 300이면 `Err`를 돌려주므로 잘못된 입력을 거절할 수 있다. `age as u8`은 아래 8비트만 남겨 44가 되고, 아무 경고도 없다.<br>
**흔한 오답:** "`as`는 범위를 넘으면 panic한다." 정수끼리의 `as`는 어느 빌드에서나 자르기만 한다.

</details>


[^1]: The Rust Programming Language, 3.1 Variables and Mutability(Constants, Shadowing) — https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html
[^2]: The Rust Programming Language, 3.2 Data Types(Integer Types, Integer Overflow, Floating-Point Types, The Character Type) — https://doc.rust-lang.org/book/ch03-02-data-types.html
[^3]: The Cargo Book, Profiles, Default profiles · overflow-checks — https://doc.rust-lang.org/cargo/reference/profiles.html
[^4]: The Rust Reference, Operator expressions, Overflow · Type cast expressions, Numeric cast — https://doc.rust-lang.org/reference/expressions/operator-expr.html
[^5]: Clippy Lints, `cast_possible_truncation`·`cast_sign_loss`·`cast_possible_wrap`(pedantic), `arithmetic_side_effects`·`shadow_unrelated`(restriction), 모두 기본 allow — https://rust-lang.github.io/rust-clippy/master/index.html
{% endraw %}
