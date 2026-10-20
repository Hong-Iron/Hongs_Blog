---
layout: "note"
title: "수명"
display_title: "수명 (Lifetimes)"
kind: "concept"
kind_label: "정의"
num: "08"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Lifetimes", "Lifetime", "수명 매개변수", "Lifetime Parameter", "수명 생략", "Lifetime Elision", "'static", "정적 수명", "impl Trait 캡처", "Precise Capturing", "use<..>", "E0106", "E0515", "E0597", "E0700"]
description: "참조를 돌려주는 함수는 \"이 참조는 어느 입력에서 빌려 온 것이고, 그래서 그 입력이 살아 있는 동안만 쓸 수 있다\"고 시그니처에 적어야 한다. 그 꼬리표가 수명이다. 수명은 값을 더 오래 살게 하지 않는다. 부르는 쪽과 함수 안을 따로 검사할 수 있게 해 주는 약속일 뿐이다. 대…"
prev_url: "/studies/rust/borrowing-references/"
prev_title: "빌림과 참조"
next_url: "/studies/rust/slices-strings/"
next_title: "슬라이스와 String·&str"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "08_lifetimes_verify.rs", "u": "/studies/rust/code/08_lifetimes_verify/", "r": "검증"}]
permalink: "/studies/rust/lifetimes/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

참조를 돌려주는 함수는 "이 참조는 어느 입력에서 빌려 온 것이고, 그래서 그 입력이 살아 있는 동안만 쓸 수 있다"고 시그니처에 적어야 한다. 그 꼬리표가 수명이다. 수명은 값을 더 오래 살게 하지 않는다. 부르는 쪽과 함수 안을 따로 검사할 수 있게 해 주는 약속일 뿐이다. 대부분은 컴파일러가 정해진 세 규칙으로 채워 주고, 규칙으로 정할 수 없을 때만 직접 적는다.

</div>


## 예시로 보기

두 문자열 중 긴 쪽을 돌려주는 함수를 만든다. 복사하지 않고 참조를 돌려주고 싶다[^1].

```rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}
```

컴파일러는 거절한다.

```
error[E0106]: missing lifetime specifier
  = help: this function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `x` or `y`
```

왜 컴파일러가 이걸 알아야 할까? 부르는 쪽을 보자.

```rust
let s1 = String::from("long string");
let result;
{
    let s2 = String::from("xyz");
    result = longest(s1.as_str(), s2.as_str());
}                       // s2는 여기서 버려진다
println!("{result}");   // result가 s2를 가리킨다면?
```

`result`가 `s1`을 가리키면 괜찮고 `s2`를 가리키면 돌려준 자리를 읽는다. 어느 쪽인지는 실행해 봐야 안다. 컴파일러는 함수 몸통을 보지 않고 시그니처만 보고 부르는 쪽을 검사한다. 그래서 시그니처에 관계를 적어야 한다.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

`'a`(작은따옴표 a, "수명 a"라고 읽는다)는 "x와 y가 둘 다 살아 있는 구간"이다. 돌려준 참조는 그 구간 안에서만 쓸 수 있다. 즉 둘 중 **짧은 쪽**까지다[^1]. 그래서 위의 부르는 코드는 `s2`가 짧으므로 E0597(`s2` does not live long enough)로 거절된다. 실제로 `result`가 `s1`을 가리킬 것이라도 그렇다.

```
  줄    s1     s2     result 쓸 수 있는 구간 'a = min(s1, s2)
  1     ●
  3     │      ●
  4     │      │      ← longest 호출
  5     │      ✕      ← s2 버려짐: 'a 끝
  6     │             println!(result)  ✗ 'a 밖
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: E0106(세 경우)·E0515(두 경우)·E0597(세 경우)·E0373·규칙 3 위반 오류, 2021 에디션의 E0700과 2024 에디션의 지나친 캡처 E0597, `use<>`로 고친 것, 생략 규칙대로 컴파일되는 경우를 rustc 1.99로 확인했다. `longest`, 구조체 수명, `Box::leak`은 실행해 확인했다. `needless_lifetimes`가 기본 경고인 것은 clippy-driver로 확인했다 — [08_lifetimes_verify.rs](/Hongs_Blog/studies/rust/code/08_lifetimes_verify/)</div>

</div>


## 정의

수명은 참조가 유효해야 하는 코드 구간에 붙인 이름이다[^2]. 수명 표시는 어떤 참조도 더 오래 살게 하지 않는다. 여러 참조의 수명이 서로 어떤 관계인지 적을 뿐이다[^1].

기호로 쓰면 이렇다.

- `&'a T` — `'a` 동안 유효한 `T`의 공유 참조. `&'a mut T`도 같다.
- `fn f<'a>(x: &'a str) -> &'a str` — 돌려준 참조는 `x`가 빌려 온 값이 살아 있는 동안만 쓸 수 있다.
- `T: 'a` — 타입 `T` 안에 든 참조가 모두 `'a` 이상 산다.
- `'static` — 프로그램이 끝날 때까지. 문자열 리터럴 `"hi"`는 `&'static str`이다. 실행 파일 안에 들어 있기 때문이다[^1].

### 수명 생략 세 규칙

매번 적으면 번거로워서, 컴파일러는 함수 시그니처의 빈 수명을 세 규칙으로 채운다. 입력 참조의 수명을 입력 수명, 출력의 수명을 출력 수명이라 부른다[^1][^3].

1. 입력의 빈 수명은 저마다 다른 수명 매개변수가 된다. `fn f(x: &i32, y: &i32)` → `fn f<'a, 'b>(x: &'a i32, y: &'b i32)`.
2. 입력 수명이 정확히 하나면, 그것이 모든 출력의 빈 수명이 된다. `fn f(x: &str) -> &str` → `fn f<'a>(x: &'a str) -> &'a str`.
3. 입력에 `&self`나 `&mut self`가 있으면, `self`의 수명이 모든 출력의 빈 수명이 된다.

세 규칙을 다 써도 출력 수명이 정해지지 않으면 컴파일러는 추측하지 않고 E0106을 낸다[^1]. `longest(x: &str, y: &str) -> &str`은 입력 수명이 둘이고 `self`가 없어서 규칙 2·3이 적용되지 않는다. `fn mk() -> &str`은 입력이 없어서 정할 것이 없다[^3].

규칙 3은 편하지만 함정도 있다. `fn pick(&self, k: &str) -> &str { k }`는 출력이 `self`의 수명을 받으므로, `k`를 돌려주면 "lifetime may not live long enough"로 거절된다. 이럴 때는 `fn pick<'k>(&self, k: &'k str) -> &'k str`처럼 직접 적는다.

### 지역 값의 참조는 돌려줄 수 없다

함수 안에서 만든 값은 함수가 끝나면 버려진다. 그것을 가리키는 참조를 돌려주면 돌려준 자리를 가리키게 된다. 수명을 어떻게 적어도 고칠 수 없다.

| 코드 | 오류 |
|---|---|
| `fn dangle() -> &String { let s = …; &s }` | E0106 — 입력이 없어 수명을 정할 수 없다. 메시지: "there is no value for it to be borrowed from"[^4] |
| `fn f<'a>(x: &'a str) -> &'a str { let s = …; &s }` | E0515 — cannot return reference to local variable `s`[^1] |
| `fn f() -> &'static str { let s = …; &s }` | E0515 — `'static`을 붙여도 같다 |

고치는 길은 하나다. 참조 대신 소유한 값(`String`)을 돌려준다[^1][^2]. 컴파일러도 E0106의 도움말에서 "you are more likely to want to return an owned value"라고 권한다.

### 참조를 담는 구조체

구조체가 참조를 필드로 가지면 수명 매개변수를 달아야 한다. 안 달면 E0106이다[^1].

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}
```

이 구조체는 `part`가 가리키는 값보다 오래 살 수 없다. 파서(parser)가 입력 문자열을 복사하지 않고 조각만 들고 있는 토큰 구조체가 이런 모양이다.

### `'static`

`'static`은 두 자리에서 다른 뜻이다.

- `&'static T`: 프로그램 끝까지 유효한 참조. 리터럴, `static` 변수, `Box::leak`이 돌려준 참조가 그렇다[^5].
- `T: 'static` 경계: `T` 안에 짧게 사는 참조가 **없다**. `String`, `Vec<i32>`처럼 참조가 없는 소유 타입은 모두 `'static`을 만족한다. 값이 프로그램 끝까지 산다는 뜻이 아니다[^s1].

`std::thread::spawn`의 클로저는 `'static`이어야 한다. 새 스레드가 지금 함수보다 오래 살 수 있기 때문이다. 지역 `Vec`를 빌리는 클로저를 넘기면 E0373(closure may outlive the current function)이고, <code>move &#124;&#124;</code>로 소유권을 넘기면 된다([스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)).

오류 메시지가 `'static`을 붙이라고 권해도 곧바로 붙이지 않는다. 대개 진짜 문제는 사라질 값을 가리키는 참조이고, 그것을 고쳐야 한다[^1].

### 2024 에디션: `impl Trait`가 잡는 수명

반환 자리의 `impl Trait`(정확한 타입은 숨기고 "이 트레이트를 구현하는 무언가"라고만 알리는 반환 타입)는 숨긴 타입이 어떤 수명 매개변수를 쓸 수 있는지(캡처)를 정해야 한다. 2024 에디션에서 규칙이 바뀌었다[^6].

| | 2021 이전 | 2024 |
|---|---|---|
| 타입·const 매개변수 | 모두 캡처 | 모두 캡처 |
| 수명 매개변수 | `impl Trait + 'a`처럼 경계에 적은 것만 | 범위 안의 수명을 **모두** 캡처 |
| 정확히 고르기 | `+ use<..>` (1.82부터 모든 에디션) | `+ use<..>` |

그래서 다음 코드는 2021에서 E0700이었고 2024에서는 그냥 된다.

```rust
fn evens(v: &[i32]) -> impl Iterator<Item = i32> {
    v.iter().copied().filter(|x| x % 2 == 0)
}
```

반대로, 숨긴 타입이 입력 참조를 쓰지 않는데도 2024는 그 수명을 캡처한다. 그러면 부르는 쪽이 불필요하게 묶인다.

```rust
fn len_of(x: &str) -> impl Fn() -> usize {
    let n = x.len();
    move || n            // x를 쓰지 않는다
}
let f = { let s = String::from("hi"); len_of(&s) };  // 2024: E0597
```

rustc는 이 경우 "this call may capture more lifetimes than intended, because Rust 2024 has adjusted the `impl Trait` lifetime capture rules"라는 메모를 붙인다. `-> impl Fn() -> usize + use<>`라고 "아무 수명도 잡지 않는다"고 적으면 된다[^6]. `cargo fix --edition`은 `impl_trait_overcaptures` 린트로 이런 자리에 `use<..>`를 넣어 준다[^6].

## 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`longest`가 실제로는 늘 `s1`을 돌려주는 입력이라도, `s2`가 먼저 버려지면 컴파일러가 거절하는 이유는?</summary>

컴파일러는 부르는 쪽을 검사할 때 함수 몸통이 아니라 시그니처만 본다. 시그니처는 "돌려준 참조는 `x`와 `y` 둘 다 살아 있는 동안만 유효하다"고 말한다. 그 약속만으로는 `s2`가 버려진 뒤의 사용을 허락할 수 없다. 몸통을 바꿔도 부르는 쪽 검사 결과가 달라지지 않게 하려는 설계다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`fn get(&self, k: &str) -> &i32`는 수명을 하나도 안 적었는데 왜 컴파일되는가? 이때 돌려준 참조는 무엇이 살아 있는 동안 쓸 수 있는가?</summary>

규칙 1로 `self`와 `k`가 서로 다른 수명을 받는다. 규칙 2는 입력 수명이 둘이라 쓰이지 않는다. 규칙 3으로 `&self`의 수명이 출력에 붙는다. 그래서 돌려준 `&i32`는 `self`가 살아 있는 동안 쓸 수 있고, `k`는 호출 직후 버려져도 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2024에서 `len_of(&s)`가 E0597이 되는 이유를 "캡처"라는 말로 설명하고, `use<>`가 그것을 어떻게 푸는지 쓰라.</summary>

2024는 반환 `impl Trait`가 범위 안의 모든 수명을 캡처한다고 본다. 그래서 `len_of`가 돌려준 클로저는 `&s`의 수명을 품은 타입이 되고, `s`보다 오래 쓸 수 없다. 실제 클로저는 `usize`만 들고 있지만 컴파일러는 시그니처만 본다. `use<>`는 캡처 목록을 비워서 돌려준 타입이 입력 참조와 무관하다고 시그니처에 적는다.

</details>


## 예제

**하위목표: 생략 규칙을 차례로 적용해 빈 수명 채우기.**

| 시그니처 | 규칙 1 | 규칙 2 | 규칙 3 | 결과 |
|---|---|---|---|---|
| `fn first_word(s: &str) -> &str` | `s: &'a str` | 출력 `'a` | — | 된다 |
| `fn longest(x: &str, y: &str) -> &str` | `'a`, `'b` | 입력이 둘 | `self` 없음 | E0106 |
| `fn get(&self, k: &str) -> &i32` | `'a`, `'b` | 입력이 둘 | 출력 `'a`(self) | 된다 |
| `fn mk() -> &str` | 입력 없음 | — | — | E0106 |

**경계 사례.** 출력이 한 입력에서만 오면 그 입력에만 수명을 단다. `fn first<'a>(a: &'a str, _b: &str) -> &'a str`은 된다. `_b`는 호출 직후 버려져도 결과를 쓸 수 있다. 둘 다 `'a`로 묶으면 불필요하게 부르는 쪽을 묶는다.

**가정을 빼면 깨지는 예.** `T: 'static` 경계를 가진 `fn keep<T: 'static>(t: T)`에 `&x`(지역 변수의 참조)를 넘기면 E0597이다. 메시지는 "argument requires that `x` is borrowed for `'static`"이다.

## 활용

- **기본은 소유 타입.** 구조체 필드는 `String`, `Vec<T>`로 시작한다. 참조 필드는 수명 매개변수가 구조체를 쓰는 모든 곳으로 퍼진다. 복사가 실제로 병목일 때만 참조 필드를 쓴다(예: 큰 입력을 조각내는 파서, `serde`의 빌림 역직렬화).
- **함수는 생략 규칙에 맡긴다.** 컴파일러가 채울 수 있는 수명을 직접 적으면 clippy `needless_lifetimes`가 기본으로 경고한다. `impl<'a> S<'a>`에서 `'a`를 안 쓰면 `impl S<'_>`로 쓴다(`elidable_lifetime_names`, pedantic)[^7].
- **에러 메시지가 `'static`을 권할 때.** 먼저 "어떤 지역 값이 먼저 사라지는가"를 찾는다. 스레드·tokio 태스크에 넘기는 값이면 `move`로 소유권을 넘기거나 `Arc`로 공유한다([tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)).
- **라이브러리 API의 `impl Trait` 반환.** 2024 에디션에서 반환 타입이 입력 참조를 정말 쓰지 않으면 `+ use<>`나 `+ use<T>`를 적어 둔다. 안 적으면 부르는 쪽이 이유 없이 묶이고, 나중에 고치면 호환성이 깨진다[^6].
- **성능.** 수명은 컴파일 시간에만 있다. 실행 파일에는 흔적이 없다.

## 연결

- 선수: [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)
- 문자열 조각을 돌려주는 함수(`first_word`)가 수명 생략의 대표 예: [슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/)
- 제네릭의 `T: 'a` 경계: [제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/)
- C에서 함수 안 변수의 주소를 돌려주던 버그: [포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/), [malloc·free ↔ 소유권과 Drop](/Hongs_Blog/studies/rust/malloc-free-vs-ownership/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`<'a>`를 붙이면 그 값이 `'a` 동안 살아 있게 된다."</div>

틀렸다. 수명 표시는 어떤 값의 수명도 바꾸지 않는다[^1]. Java의 GC처럼 "참조가 있으면 살려 둔다"를 떠올리면 이렇게 생각하기 쉽다. Rust에서 값은 주인이 범위를 벗어날 때 버려지고, 수명은 그 사실과 맞지 않는 사용을 **거절**하는 데만 쓰인다. 지역 변수의 참조를 돌려주는 함수에 수명을 붙여도 E0515가 그대로인 것이 그 증거다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`T: 'static`이면 그 값은 프로그램 끝까지 메모리에 남는다."</div>

틀렸다. `T: 'static`은 "`T` 안에 짧게 사는 참조가 없다"는 조건이다. `String`은 `'static`을 만족하지만 범위가 끝나면 평소처럼 버려진다. 프로그램 끝까지 남는 것은 `&'static T`가 가리키는 값(리터럴, `static`, `Box::leak`)이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 시그니처 가운데 수명을 적지 않아도 컴파일되는 것을 고르고, 안 되는 것은 어느 규칙에서 막히는지 쓰라. (가) `fn trim(s: &str) -> &str` (나) `fn pick(a: &str, b: &str) -> &str` (다) `fn name(&self) -> &str` (라) `fn hello() -> &str`</summary>

**답:** (가)와 (다)가 된다. (나)는 입력 수명이 둘이고 `self`가 없어 규칙 2·3이 모두 적용되지 않는다(E0106). (라)는 입력 수명이 없다(E0106).<br>
**흔한 오답:** (라)는 리터럴을 돌려주니 될 것이라고 생각한다. 생략 규칙은 `'static`을 채워 주지 않는다. `-> &'static str`이라고 적어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 컴파일되는가? 안 되면 오류 코드와 고치는 법은?</summary>

```rust
fn f<'a>(_x: &'a str) -> &'a str {
    let s = String::from("hi");
    &s
}
```
**답:** 안 된다. E0515 (cannot return reference to local variable `s`).<br>
**이유:** `s`는 함수가 끝날 때 버려진다. `'a`는 부른 쪽에서 온 `_x`의 수명이라 `s`와 무관하다. 수명으로는 고칠 수 없고 `-> String`으로 소유한 값을 돌려줘야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 같은 코드를 2021과 2024 에디션으로 각각 컴파일하면 결과가 어떻게 다른가?</summary>

```rust
fn evens(v: &[i32]) -> impl Iterator<Item = i32> { v.iter().copied().filter(|x| x % 2 == 0) }
```
**답:** 2021은 E0700(hidden type captures lifetime that does not appear in bounds), 2024는 컴파일된다.<br>
**이유:** 반환하는 반복자는 `v`를 빌린다. 2021은 경계에 적은 수명만 캡처하므로 `+ '_`나 `+ use<'_>`를 적어야 했다. 2024는 범위 안의 수명을 모두 캡처한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "규칙 3 덕분에 `&self` 메서드는 수명을 안 적어도 늘 원하는 대로 된다"를 깨는 예를 들라.</summary>

**답:** `fn pick(&self, k: &str) -> &str { k }`. 출력이 `self`의 수명을 받으므로 `k`를 돌려줄 수 없어 "lifetime may not live long enough"로 거절된다. `fn pick<'k>(&self, k: &'k str) -> &'k str`로 고친다.<br>
**이유:** 생략 규칙은 정해진 모양으로 채울 뿐, 함수가 실제로 무엇을 돌려주는지 보지 않는다.

</details>


[^1]: The Rust Programming Language, 10.3 Validating References with Lifetimes (longest, Lifetime Annotations in Function Signatures, Lifetime Annotations in Struct Definitions, Lifetime Elision, The Static Lifetime) — https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html
[^2]: The Rustonomicon, Lifetimes (named regions of code, Example: references that outlive referents) — https://doc.rust-lang.org/nomicon/lifetimes.html
[^3]: The Rust Reference, Lifetime elision, Lifetime elision in functions — https://doc.rust-lang.org/reference/lifetime-elision.html
[^4]: The Rust Programming Language, 4.2 References and Borrowing, Dangling References — https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html
[^5]: std 문서, `Box::leak` — https://doc.rust-lang.org/std/boxed/struct.Box.html
[^6]: The Rust Edition Guide, Rust 2024, RPIT lifetime capture rules — https://doc.rust-lang.org/edition-guide/rust-2024/rpit-lifetime-capture.html
[^7]: Clippy Lints — https://rust-lang.github.io/rust-clippy/stable/index.html. `needless_lifetimes`가 기본으로 경고하는 것은 검증 코드에서, `elidable_lifetime_names`가 pedantic에서 경고하는 것은 rustc 1.99.0의 `clippy-driver`로 따로 확인했다.
[^s1]: `T: 'static`과 `&'static T`의 구분은 Reference의 Lifetime elision 절과 Book 10.3의 `'static` 설명을 함께 풀어 쓴 것이다. `String`이 `'static` 경계를 만족한다는 것은 rustc로 확인할 수 있는 사실이다(`fn keep<T: 'static>(t: T)`에 `String`은 넘어가고 `&x`는 E0597).
{% endraw %}
