---
layout: "note"
title: "구조체와 메서드"
display_title: "구조체와 메서드 (Structs and Methods)"
kind: "concept"
kind_label: "자료구조"
num: "10"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Structs and Methods", "struct", "impl", "메서드", "Method", "연관 함수", "Associated Function", "튜플 구조체", "Tuple Struct", "유닛 구조체", "Unit-Like Struct", "구조체 갱신 문법", "Struct Update Syntax", "Functional Update Syntax", "필드 이름 줄여 쓰기", "Field Init Shorthand", "derive"]
description: "관련된 값 몇 개를 한 묶음으로 묶고 이름을 붙인 것이 구조체다. Java의 클래스처럼 함수를 붙일 수 있지만, 상속은 없고 데이터와 함수를 따로 적는다. 함수마다 묶음을 읽기만 할지, 고칠지, 아예 가져가 버릴지를 첫 인자에 적어야 한다. 이 선택을 잘못하면 컴파일러가 막는다."
prev_url: "/studies/rust/slices-strings/"
prev_title: "슬라이스와 String·&str"
next_url: "/studies/rust/enums-pattern-matching/"
next_title: "열거형과 패턴 매칭"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/structs-methods/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

관련된 값 몇 개를 한 묶음으로 묶고 이름을 붙인 것이 구조체다. Java의 클래스처럼 함수를 붙일 수 있지만, 상속은 없고 데이터와 함수를 따로 적는다. 함수마다 묶음을 읽기만 할지, 고칠지, 아예 가져가 버릴지를 첫 인자에 적어야 한다. 이 선택을 잘못하면 컴파일러가 막는다.

</div>


## 예시로 보기

사용자 한 명의 정보를 변수 넷에 따로 들고 다니면, 함수에 넘길 때마다 넷을 다 적어야 하고 순서도 헷갈린다. 넷을 한 묶음(구조체)으로 묶는다[^1].

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,          // username: username 을 줄여 쓴 것
        email,
        sign_in_count: 1,
    }
}
```

매개변수와 필드의 이름이 같으면 `email: email` 대신 `email`만 쓴다(필드 이름 줄여 쓰기)[^1].

메모리에서 `User` 값 하나는 이렇게 놓인다. `String` 필드는 글자를 힙에 두고, 구조체 안에는 그 주소와 길이만 든다.

```
스택: user1
┌──────────────┐
│ active  true │
│ username ────┼──▶ 힙 "ann"
│ email ───────┼──▶ 힙 "a@x.com"
│ sign_in 1    │
└──────────────┘
```

### 일부만 바꿔 새로 만들기

기존 값에서 한두 필드만 바꾼 새 값을 만들 때는 `..`을 쓴다(구조체 갱신 문법)[^1].

```rust
let user2 = User {
    email: String::from("b@x.com"),
    ..user1
};
```

`..user1`은 "나머지 필드는 `user1`에서 가져온다"는 뜻이다. 가져온다는 말은 대입 `=`과 같다. `Copy`인 필드(`bool`, `u64`)는 복사되고, `String`인 `username`은 `user2`로 옮겨 간다[^1][^3].

```
user1.username ──X   (옮겨 갔다)
user2.username ─────▶ 힙 "ann"
user1.email ────────▶ 힙 "a@x.com"   (새 값을 줬으니 그대로 남는다)
```

그래서 `user1`을 통째로 쓰면 컴파일되지 않는다.

```text
error[E0382]: use of partially moved value: `user1`
  = note: partial move occurs because `user1.username` has type `String`, which does not implement the `Copy` trait
```

"어? 그럼 `user1`은 아예 못 쓰나?" 그렇지 않다. 옮겨 가지 않은 `user1.email`은 계속 쓸 수 있다. `String` 필드 둘 다 새 값을 주면 `Copy` 필드만 복사되므로 `user1` 전체가 그대로 남는다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 오류 코드와 세 경우(통째로 사용 → E0382, `user1.email`만 사용 → 컴파일됨, 두 `String` 필드 모두 새로 줌 → 컴파일됨)를 `rustc`로 확인했다 — [10_structs-methods_verify.rs](/Hongs_Blog/studies/rust/code/10_structs-methods_verify/)</div>

</div>


## 메서드와 `self`

구조체에 붙는 함수는 `impl` 블록 안에 쓴다. `impl` 안의 함수를 모두 연관 함수(associated function)라 부르고, 그중 첫 인자가 `self`인 것을 메서드라 부른다[^2].

```rust
impl Counter {
    fn new() -> Self { Self { count: 0 } }        // 연관 함수: Counter::new()
    fn get(&self) -> u32 { self.count }          // 읽기만
    fn bump(&mut self) -> u32 { self.count += 1; self.count }  // 고친다
    fn finish(self) -> String { format!("최종 {}", self.count) } // 가져간다
}
```

`impl` 안에서 `Self`는 "지금 `impl`하는 타입"의 다른 이름이다. `&self`는 `self: &Self`를 줄여 쓴 것이다[^2]. 세 가지 첫 인자는 [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)와 [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)의 규칙을 그대로 따른다.

| 첫 인자 | 메서드가 받는 것 | 부른 뒤 원래 변수 | 쓰는 때 |
|---|---|---|---|
| `&self` | 읽기 전용 빌림 | 그대로 쓸 수 있다 | 값을 읽어 계산한다 |
| `&mut self` | 고칠 수 있는 빌림 | 그대로 쓸 수 있다. 단 변수가 `let mut`이어야 한다 | 필드를 고친다 |
| `self` | 값 전체(소유권) | 못 쓴다(E0382) | 값을 다른 것으로 바꾸거나 끝낸다 |

`let c = Counter::new();`처럼 `mut` 없이 만든 변수에서 `c.bump()`를 부르면 E0596으로 막힌다. `c.finish()` 뒤에 `c.get()`을 부르면 E0382로 막힌다.

C에는 `->`와 `.`이 따로 있지만 Rust에는 `.`뿐이다. `c.get()`이라고 쓰면 컴파일러가 메서드의 첫 인자 모양에 맞게 `&`, `&mut`, `*`를 알아서 붙인다(자동 참조)[^2]. 그래서 `c.get()`은 `Counter::get(&c)`와 같다.

한 타입에 `impl` 블록을 여러 개 둘 수 있다[^2]. 트레이트 구현을 따로 묶을 때 쓴다.

### 생성자는 그냥 연관 함수다

Rust에는 Java의 생성자([생성자](/Hongs_Blog/studies/java/java-constructor/)) 같은 특별한 문법이 없다. `new`도 키워드가 아니라 이름 짓는 관례일 뿐이다[^2]. Rust API 지침은 이렇게 정한다[^4].

- 생성자는 `self` 없는 연관 함수다. 대표 생성자 이름은 `new`다.
- 다른 방법으로 만드는 생성자는 `with_…`(예: `Vec::with_capacity`), 다른 타입에서 바꿔 만드는 생성자는 `from_…`로 시작한다.
- 인자 없는 `new`가 있으면 `Default`도 구현하고, 둘이 똑같이 동작하게 한다.

## 구조체의 세 모양

| 모양 | 예 | 필드 접근 | 쓰는 때 |
|---|---|---|---|
| 이름 붙은 필드 | `struct User { email: String, … }` | `u.email` | 대부분 |
| 튜플 구조체 | `struct Meters(f64);` | `m.0` | 필드 하나에 의미만 붙일 때 |
| 유닛 구조체 | `struct AlwaysEqual;` | 없음 | 데이터 없이 트레이트만 구현할 때 |

튜플 구조체는 필드 타입이 같아도 서로 다른 타입이다[^1]. `struct Meters(f64)`와 `struct Seconds(f64)`가 있을 때 `Meters`를 받는 함수에 `Seconds(3.0)`을 주면 E0308로 막힌다. 이 성질은 [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)의 뉴타입이 된다.

유닛 구조체는 크기가 0바이트다. `Meters`는 안의 `f64`와 똑같이 8바이트다. 감싸도 메모리가 늘지 않는다.

## derive로 흔한 기능 붙이기

`#[derive(...)]`를 구조체 위에 붙이면 컴파일러가 흔한 트레이트의 구현을 대신 써 준다. 붙일 수 있는 것은 `Debug`, `PartialEq`, `Eq`, `PartialOrd`, `Ord`, `Clone`, `Copy`, `Hash`, `Default`다[^5]. 만들어 주는 구현은 필드마다 같은 트레이트를 부른다. 그래서 필드가 모두 그 트레이트를 구현해야 붙일 수 있다[^5].

```rust
#[derive(Debug)]
struct Counter { count: u32 }

println!("{:?}", Counter { count: 3 });   // Counter { count: 3 }
println!("{:#?}", Counter { count: 3 });  // 여러 줄로 보기 좋게
```

`PartialOrd`를 derive하면 필드를 선언한 순서대로 비교한다[^5]. 필드 순서를 바꾸면 정렬 결과가 바뀐다는 뜻이다. 트레이트 하나하나는 [꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/)에서 다룬다.

## 활용

- **API 서비스의 요청·응답 본문.** JSON 본문은 보통 이름 붙은 필드의 구조체에 `#[derive(Debug, Clone, serde::Deserialize)]`를 붙여 받는다. [axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)에서 쓴다.
- **설정 값의 기본값.** `#[derive(Default)]`로 기본값을 만들고 갱신 문법으로 몇 개만 바꾼다: `Config { port: 8080, ..Config::default() }`. clippy의 `field_reassign_with_default`(기본으로 켜짐)는 `let mut c = Config::default(); c.port = 8080;`처럼 만든 직후 필드를 다시 넣는 코드를 갱신 문법으로 바꾸라고 경고한다[^6].
- **`new`만 있고 `Default`가 없을 때.** `pub fn new() -> Self`가 있는 공개 타입에 `Default`가 없으면 clippy의 `new_without_default`(기본으로 켜짐)가 경고한다[^6].
- **흔한 실수.**
  - 메서드마다 습관적으로 `&mut self`를 쓴다. 읽기만 하는 메서드까지 `&mut self`면, 그 값을 읽는 동안 다른 빌림을 못 만들어 호출하는 쪽이 불편해진다. 고치지 않으면 `&self`로 둔다.
  - 갱신 문법이 원본을 "복사"한다고 생각한다. `String`·`Vec` 같은 필드는 옮겨 간다. 원본을 계속 쓰려면 `..user1.clone()`처럼 복제본에서 가져온다.
  - 필드를 모두 `pub`으로 연다. 바깥에서 필드를 직접 바꿀 수 있으면 "이메일에는 @가 있다" 같은 약속을 지킬 수 없다. 필드를 닫고 검사하는 생성자를 두는 법은 [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)에 있다.
- **성능.** 구조체는 필드를 모아 놓은 값이다. 따로 힙을 쓰지 않고, 메서드 호출 `c.get()`은 `Counter::get(&c)`라는 보통 함수 호출이다. 필드를 메모리에 놓는 순서는 컴파일러가 정한다. 선언 순서와 같다는 보장이 없다[^7]. 그래서 `{ a: u8, b: u32, c: u8 }`은 이 기계에서 8바이트인데, `#[repr(C)]`를 붙여 C처럼 선언 순서대로 놓게 하면 빈칸이 끼어 12바이트가 된다. C 라이브러리와 구조체를 주고받을 때만 `#[repr(C)]`를 붙인다.

## 연결

- 선수: [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)(갱신 문법과 `self`가 값을 옮긴다), [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)(`&self`, `&mut self`)
- 데이터가 "여러 모양 중 하나"이면 구조체가 아니라 [열거형](/Hongs_Blog/studies/rust/enums-pattern-matching/)을 쓴다.
- Java의 클래스와 비교: [클래스와 객체](/Hongs_Blog/studies/java/class-and-object/). Rust 구조체에는 상속이 없다. 공통 동작은 [트레이트](/Hongs_Blog/studies/rust/traits/)로 묶는다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `let user2 = User { email: String::from("b@x.com"), ..user1 };` 다음 줄에 `println!("{}", user1.username);`을 쓰면 컴파일되는가? `user1.email`이면? 이유는?</summary>

**답:** `user1.username`은 안 된다(E0382). `user1.email`은 된다.<br>
**이유:** `..user1`은 지정하지 않은 필드를 대입처럼 가져온다. `username`은 `String`이라 `user2`로 옮겨 갔다. `email`은 새 값을 줬으므로 `user1`에서 가져가지 않았다.<br>
**흔한 오답:** "갱신 문법은 복사이므로 둘 다 된다." `Copy`가 아닌 필드는 옮겨 간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 장바구니 타입 `Cart`에 세 메서드를 만든다. 각각 첫 인자를 `self`, `&self`, `&mut self` 중 무엇으로 하는가? (가) 담긴 물건 가격의 합 `total` (나) 물건 하나를 넣는 `add` (다) 장바구니를 주문서 `Order`로 바꾸고 장바구니는 더 못 쓰게 하는 `checkout`</summary>

**답:** (가) `&self` (나) `&mut self` (다) `self`<br>
**이유:** 읽기만 하면 `&self`, 필드를 고치면 `&mut self`, 값을 다른 것으로 바꾸고 원래 것을 못 쓰게 하려면 소유권을 가져가는 `self`다. (다)를 `&self`로 하면 주문한 뒤에도 장바구니에 물건을 더 넣을 수 있어 버그가 생긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 위의 `Counter`로 다음 코드를 돌리면 무엇이 찍히는가?</summary>

```rust
let mut t = Counter::new();
t.bump();
let snapshot = t.get();
t.bump();
t.bump();
println!("{snapshot} {} {}", t.get(), t.finish());
```
**답:** `1 3 최종 3`<br>
**이유:** `snapshot`은 첫 `bump` 직후의 값 1을 복사해 둔 것이라 뒤의 `bump`에 영향받지 않는다. `println!`의 인자는 왼쪽부터 계산되므로 `t.get()`이 3을 읽은 뒤 `t.finish()`가 `t`를 가져간다.

</details>


[^1]: The Rust Programming Language, 5.1 Defining and Instantiating Structs — https://doc.rust-lang.org/book/ch05-01-defining-structs.html
[^2]: The Rust Programming Language, 5.3 Methods — https://doc.rust-lang.org/book/ch05-03-method-syntax.html
[^3]: The Rust Reference, Struct expressions, Functional update syntax — https://doc.rust-lang.org/reference/expressions/struct-expr.html
[^4]: Rust API Guidelines, Predictability, C-CTOR: Constructors are static, inherent methods — https://rust-lang.github.io/api-guidelines/predictability.html
[^5]: The Rust Programming Language, Appendix C: Derivable Traits — https://doc.rust-lang.org/book/appendix-03-derivable-traits.html
[^6]: Clippy Lints, `new_without_default`, `field_reassign_with_default` — https://rust-lang.github.io/rust-clippy/master/index.html (rustc 1.99.0의 `clippy-driver`로 두 린트가 기본으로 경고하는 것을 확인했다)
[^7]: The Rust Reference, Type layout, The Rust representation과 The C representation — https://doc.rust-lang.org/reference/type-layout.html
{% endraw %}
