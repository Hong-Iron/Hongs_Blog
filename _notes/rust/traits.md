---
layout: "note"
title: "트레이트"
display_title: "트레이트 (Traits)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Traits", "Trait", "trait", "impl Trait", "기본 메서드", "Default Method", "연관 타입", "Associated Type", "고아 규칙", "Orphan Rule", "일관성", "Coherence", "블랭킷 구현", "Blanket Implementation", "슈퍼트레이트", "Supertrait", "뉴타입", "Newtype"]
description: "여러 타입이 \"이런 일을 할 줄 안다\"고 함께 약속하는 기능 목록이다. 목록을 한 번 정해 두면, 함수는 구체적인 타입 대신 \"이 목록을 지키는 아무 타입\"을 받을 수 있다. 목록에 몸통까지 미리 써 둘 수 있고, 이미 남이 만든 타입에도 내 목록을 붙일 수 있다. 다만 남의 목록…"
prev_url: "/studies/rust/type-driven-design/"
prev_title: "타입으로 잘못된 상태 막기"
next_url: "/studies/rust/java-interface-vs-trait/"
next_title: "Java 인터페이스 ↔ 트레이트"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "15_traits_verify.rs", "u": "/studies/rust/code/15_traits_verify/", "r": "검증"}]
permalink: "/studies/rust/traits/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

여러 타입이 "이런 일을 할 줄 안다"고 함께 약속하는 기능 목록이다. 목록을 한 번 정해 두면, 함수는 구체적인 타입 대신 "이 목록을 지키는 아무 타입"을 받을 수 있다. 목록에 몸통까지 미리 써 둘 수 있고, 이미 남이 만든 타입에도 내 목록을 붙일 수 있다. 다만 남의 목록을 남의 타입에 붙이는 것은 막혀 있다. 그리고 목록이 메서드를 부를 수 있게 하려면 그 목록을 `use`로 가져와야 한다.

</div>


## 예시로 보기

블로그 글과 짧은 게시물을 한 화면에 요약해서 보여 주는 함수를 만든다. 글 타입마다 `summarize_post`, `summarize_tweet`을 따로 만들면, 새 글 종류가 생길 때마다 화면 코드를 고쳐야 한다. "요약할 줄 안다"는 약속 하나를 정해 두고, 화면 코드는 그 약속만 믿게 한다[^1].

```rust
trait Summary {
    fn author(&self) -> String;                 // 몸통 없음: 구현하는 쪽이 반드시 채운다
    fn summarize(&self) -> String {             // 몸통 있음: 안 채우면 이것을 쓴다
        format!("({}의 글 더 보기...)", self.author())
    }
}

struct Post { author: String }
struct Tweet { user: String, text: String }

impl Summary for Post {
    fn author(&self) -> String { self.author.clone() }
}                                               // summarize는 기본 몸통을 쓴다

impl Summary for Tweet {
    fn author(&self) -> String { format!("@{}", self.user) }
    fn summarize(&self) -> String { format!("{}: {}", self.author(), self.text) }
}
```

```
(kim의 글 더 보기...)
@rustlang: 1.99 released
```

여기서 `trait Summary { ... }`가 트레이트다. `impl Summary for Post`는 "`Post`가 `Summary`를 지킨다"는 구현이다. 몸통을 미리 써 둔 `summarize`는 기본 메서드(default method)다. 기본 메서드는 같은 트레이트의 다른 메서드(`author`)를 부를 수 있다. 그 메서드에 기본 몸통이 없어도 된다[^1].

화면 코드는 구체적인 타입을 몰라도 된다.

```rust
fn notify(item: &impl Summary) -> String {
    format!("속보! {}", item.summarize())
}
```

비유가 틀어지는 곳이 하나 있다. "약속 목록"은 문서처럼 들리지만, 트레이트는 컴파일러가 실제로 검사한다. 필수 메서드 하나를 빠뜨리면 `error[E0046]: not all trait items implemented, missing: `author``로 컴파일이 멈춘다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 출력, 연관 타입과 제네릭 매개변수의 차이(E0283·E0119), 블랭킷 구현, 슈퍼트레이트(E0277), 반환 자리 `impl Trait`의 한 타입 제한(E0308), 고아 규칙(E0117)과 뉴타입, 트레이트를 가져오지 않은 호출(E0599), 인자 자리 `impl Trait` 함수에 타입을 적은 호출(E0107)을 rustc 1.99로 컴파일해 확인했다 — [15_traits_verify.rs](/Hongs_Blog/studies/rust/code/15_traits_verify/)</div>

</div>


## 정의

트레이트는 타입이 갖춰야 할 메서드·타입·상수의 목록이다. 목록의 항목에 몸통(또는 값)이 없으면 구현하는 쪽이 반드시 채워야 하고, 있으면 그것이 기본값이 된다[^2]. 어떤 타입이 트레이트를 지킨다고 알리려면 `impl 트레이트 for 타입 { ... }` 블록을 쓴다.

```rust
trait Example {
    const LIMIT: u32;            // 연관 상수: 구현하는 쪽이 값을 정한다
    type Output;                 // 연관 타입: 구현하는 쪽이 타입을 정한다
    fn must(&self);              // 필수 메서드
    fn may(&self) {}             // 기본 메서드
}
```

### 연관 타입과 제네릭 매개변수

트레이트가 "어떤 타입을 다루는지"를 적는 길은 두 가지다.

| | 연관 타입 `trait Iterator { type Item; }` | 제네릭 매개변수 `trait ConvertTo<T>` |
|---|---|---|
| 한 타입에 구현할 수 있는 횟수 | 한 번 | `T`를 바꿔 가며 여러 번 |
| 부르는 쪽이 타입을 적어야 하나 | 아니다 | 여러 구현이 있으면 적어야 한다 |

연관 타입이 있는 트레이트는 한 타입에 한 번만 구현한다. 그래서 `Counter`에 `next`를 부를 때 무엇이 나오는지 매번 적을 필요가 없다. 제네릭 매개변수가 있는 트레이트는 `ConvertTo<i64>`와 `ConvertTo<f64>`처럼 같은 타입에 여러 번 구현할 수 있다. 대신 부를 때 어느 쪽인지 적어야 한다[^3].

```rust
impl ConvertTo<i64> for i32 { fn convert(&self) -> i64 { i64::from(*self) * 1000 } }
impl ConvertTo<f64> for i32 { fn convert(&self) -> f64 { f64::from(*self) / 2.0 } }

let a: i64 = 7.convert();   // 7000
let b: f64 = 7.convert();   // 3.5
let c = 7.convert();        // error[E0283]: type annotations needed
```

고르는 기준은 "이 타입에 대해 답이 하나뿐인가"다. 반복자가 내놓는 원소 타입은 하나뿐이니 연관 타입이다. 무엇으로 바꿀 수 있는가는 여러 답이 있으니 제네릭 매개변수다(`From<T>`가 그 예다).

### 고아 규칙

트레이트를 타입에 구현하려면 트레이트와 타입 가운데 적어도 하나는 지금 크레이트(컴파일 단위가 되는 패키지 한 덩어리)에서 정의한 것이어야 한다. 이 제한을 고아 규칙(orphan rule)이라 부른다. 부모가 둘 다 다른 곳에 있는 구현을 고아에 빗댄 이름이다[^1].

| 트레이트 | 타입 | 구현할 수 있나 | 예 |
|---|---|---|---|
| 내 것 | 내 것 | 된다 | `impl Summary for Post` |
| 내 것 | 남의 것 | 된다 | `impl Double for i32` |
| 남의 것 | 내 것 | 된다 | `impl Display for Meters` |
| 남의 것 | 남의 것 | 안 된다 | `impl Display for Vec<i32>` → E0117 |

```
error[E0117]: only traits defined in the current crate can be implemented for types defined outside of the crate
```

이 규칙이 없으면 두 크레이트가 같은 타입에 같은 트레이트를 따로 구현할 수 있다. 그러면 컴파일러는 어느 구현을 쓸지 정할 수 없다. 규칙 덕분에 남의 코드가 내 코드를 깨지 못하고, 반대도 마찬가지다[^1]. 이 성질을 일관성(coherence)이라 부른다. 구현이 일관되려면 고아 규칙을 지키고, 같은 타입에 겹치는 구현도 없어야 한다[^4].

<details class="callout callout-example" markdown="1">
<summary class="callout-title" markdown="span">기호로 쓰면 (Reference의 정확한 규칙)</summary>

구현 `impl<P1..=Pn> Trait<T1..=Tn> for T0`(구현이 받는 타입 매개변수 $$P_1, \dots, P_n$$, 트레이트의 타입 인자 $$T_1, \dots, T_n$$, 구현 대상 $$T_0$$)은 다음 가운데 하나를 만족할 때만 허용된다[^4].

1. `Trait`가 지금 크레이트에서 정의한 트레이트다.
2. 다음 둘을 모두 만족한다.
   - $$T_0, \dots, T_n$$ 가운데 적어도 하나가 지금 크레이트의 타입이다. 그런 것 중 첫째를 $$T_i$$라 한다.
   - $$T_0, \dots, T_{i-1}$$ 안에 다른 타입에 싸이지 않은 채 드러난 타입 매개변수 $$P_j$$가 없다.

또 `Box<T>` 같은 기본(fundamental) 타입은 특별하다. `Box<LocalType>`은 지금 크레이트의 타입으로 친다[^4].

</details>


남의 트레이트를 남의 타입에 꼭 붙이고 싶으면, 그 타입을 필드 하나짜리 내 구조체로 감싼다(뉴타입 패턴). 감싼 타입은 내 것이므로 규칙을 통과한다. 감싸개는 컴파일할 때 사라지므로 실행 비용이 없다[^3].

```rust
struct Csv(Vec<i32>);
impl fmt::Display for Csv {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let parts: Vec<String> = self.0.iter().map(|x| x.to_string()).collect();
        write!(f, "{}", parts.join(","))   // Csv(vec![1, 2, 3]) -> "1,2,3"
    }
}
```

### 블랭킷 구현

조건을 만족하는 모든 타입에 한꺼번에 구현할 수도 있다. 이것을 블랭킷 구현(blanket implementation)이라 부른다. 표준 라이브러리는 `Display`를 구현한 모든 타입에 `ToString`을 붙인다. 그래서 `3.to_string()`이 된다[^1].

```rust
impl<T: Display> ToString for T { /* ... */ }   // 표준 라이브러리 안의 모양
```

### 슈퍼트레이트

"이 트레이트를 구현하려면 저 트레이트도 있어야 한다"를 `trait A: B`로 적는다. 이때 `B`를 `A`의 슈퍼트레이트(supertrait)라 부른다. `A`의 기본 메서드 안에서 `B`의 메서드를 쓸 수 있다[^5][^3].

```rust
trait Labeled: fmt::Display {
    fn label(&self) -> String { format!("[{self}]") }   // Display가 있으니 {self}를 쓴다
}
```

`Display` 없이 `impl Labeled for S {}`를 쓰면 `error[E0277]: `S` doesn't implement `std::fmt::Display``가 난다.

### impl Trait

- **인자 자리** `fn notify(item: &impl Summary)`는 트레이트 경계를 쓴 긴 꼴 `fn notify<T: Summary>(item: &T)`을 줄여 쓴 것이다[^1]. 경계는 [제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/)에서 자세히 다룬다.
- **반환 자리** `fn tens() -> impl Iterator<Item = u32>`는 "구체적인 타입은 숨기고, 이 트레이트를 지킨다는 것만 알린다"는 뜻이다. 클로저나 긴 반복자 타입처럼 이름을 적기 어려운 타입을 돌려줄 때 쓴다. 단 한 함수가 돌려주는 실제 타입은 하나뿐이어야 한다. 조건에 따라 `A`나 `B`를 돌려주면 `error[E0308]: `if` and `else` have incompatible types`다[^1]. 둘 중 하나를 돌려주려면 [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/)를 쓴다.
- **2024 에디션의 수명 캡처.** 반환 자리 `impl Trait`는 2024 에디션부터 범위 안의 모든 제네릭 매개변수와 수명을 저절로 붙잡는다. 일부만 붙잡게 하려면 `impl Sized + use<'a, T>`처럼 `use<..>`로 적는다(1.82부터)[^6].

### 트레이트 메서드는 가져와야 보인다

트레이트의 메서드를 부르려면 그 트레이트가 지금 범위에 있어야 한다. `mod a`에서 `i32`에 `Hello`를 구현해 두어도, 밖에서 `use a::Hello;` 없이 `5i32.hi()`를 쓰면 `error[E0599]: no method named `hi` found for type `i32` in the current scope`다. 이 규칙 덕분에 두 크레이트가 같은 이름의 메서드를 붙여도, 가져온 쪽만 보인다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`impl Display for Vec<i32>`를 막는 이유를, "두 크레이트가 각자 이 구현을 가졌다면"이라는 가정에서 출발해 설명하라.</summary>

내 프로그램이 크레이트 X와 Y를 함께 쓰고, 둘 다 `Vec<i32>`에 `Display`를 구현했다고 하자. `println!("{}", v)`는 둘 중 어느 `fmt`를 불러야 할지 정할 수 없다. 더 나쁜 것은, X만 쓰던 프로그램이 Y를 의존성에 추가하는 순간 깨진다는 점이다. 고아 규칙은 "트레이트나 타입 중 하나의 주인만 구현할 수 있다"로 이 충돌을 미리 막는다. 주인이 정해져 있으면 같은 구현이 두 곳에 생길 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`Iterator`의 원소 타입을 `trait Iterator<Item>`이 아니라 `type Item;`으로 둔 이유는?</summary>

제네릭 매개변수였다면 한 타입이 `Iterator<u32>`와 `Iterator<String>`을 동시에 구현할 수 있다. 그러면 `counter.next()`를 부를 때마다 어느 구현인지 적어야 한다. 반복자가 내놓는 원소 타입은 그 반복자에 대해 하나로 정해져 있으므로, 한 번만 구현하게 하는 연관 타입이 맞다. 그 대가로 부르는 쪽은 타입을 적지 않아도 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">반환 자리 `impl Trait`에서 두 타입 중 하나를 돌려줄 수 없는 이유를, "숨긴 타입"이 무엇인지에서 출발해 설명하라.</summary>

`-> impl Summary`는 컴파일러가 아는 구체적인 타입 하나를 부르는 쪽에게 숨긴 것이다. 부르는 쪽은 그 값의 크기와 메서드 위치를 컴파일할 때 정해 둔다. 조건에 따라 `A`나 `B`가 나오면 숨긴 타입이 하나로 정해지지 않아 크기도 메서드 위치도 정할 수 없다. 실행 중에 고르려면 값 옆에 "어느 타입인가"를 들고 다녀야 하는데, 그것이 트레이트 객체다.

</details>


## 활용

- **기본 메서드로 API를 키우기.** 라이브러리가 트레이트에 새 메서드를 더할 때 기본 몸통을 주면, 그 트레이트를 이미 구현한 사용자 코드가 깨지지 않는다. `Iterator`가 `next` 하나만 요구하고 수십 개의 어댑터를 기본 메서드로 주는 것이 이 방식이다([반복자](/Hongs_Blog/studies/rust/iterators/)).
- **흔한 트레이트를 미리 구현하기.** 고아 규칙 때문에 내 타입을 쓰는 다른 크레이트는 `Debug`나 `Display` 같은 남의 트레이트를 내 타입에 붙일 수 없다. 그래서 타입을 만든 크레이트가 흔한 트레이트를 먼저 구현해 둔다(Rust API Guidelines C-COMMON-TRAITS)[^7]. 목록은 [꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/)에 있다.
- **확장 트레이트.** 남의 타입에 메서드를 더하고 싶으면 내 트레이트를 만들어 구현한다(`impl StrExt for str`). 예: `trait StrExt { fn word_count(&self) -> usize; }`. 쓰는 쪽은 `use`로 가져와야 보이므로, 원치 않는 곳에 새 메서드가 끼어들지 않는다.
- **clippy.** `impl_trait_in_params`는 인자 자리 `impl Trait`를 알려 준다[^8]. 인자 자리 `impl Trait`를 쓴 함수는 부르는 쪽이 `notify::<Post>(...)`처럼 타입을 직접 적을 수 없다(`error[E0107]: function takes 0 generic arguments but 1 generic argument was supplied`). 그래서 공개 API에서 이 린트를 켜고 `<T: Summary>` 꼴로 통일하기도 한다. 기본 설정의 clippy는 이 린트를 알리지 않는다(1.99에서 확인).
- **흔한 실수.**
  - 다른 모듈이나 크레이트의 트레이트 메서드를 쓰면서 `use`를 빠뜨린다(E0599). 컴파일러 도움말이 가져올 경로를 알려 준다.
  - 기본 메서드를 다시 정의한 쪽에서 원래 기본 몸통을 부르려 한다. 그런 문법은 없다[^1]. 공통 부분은 따로 함수로 빼서 양쪽에서 부른다.

## 연결

- 선수: [구조체와 메서드](/Hongs_Blog/studies/rust/structs-methods/)(`impl` 블록과 `&self`), [열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/)
- 연산 목록만 정하고 구현은 숨기는 생각은 자료구조의 [추상 자료형](/Hongs_Blog/studies/data-structures/abstract-data-type/)과 같다.
- Java 인터페이스와 무엇이 같고 다른가: [Java 인터페이스 ↔ 트레이트](/Hongs_Blog/studies/rust/java-interface-vs-trait/)
- 트레이트를 함수의 조건으로 쓰기: [제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/). 실행 중에 고르기: [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/). 둘을 가르는 법: [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)
- 표준 라이브러리의 대표 트레이트: [반복자](/Hongs_Blog/studies/rust/iterators/), [꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"트레이트는 내가 만든 타입에만 구현할 수 있다"</div>

틀렸다. 트레이트가 내 것이면 `i32`, `String`, `Vec<T>`처럼 표준 라이브러리 타입에도 구현할 수 있다. 그럴듯해 보이는 이유는 Java에서 `String`에 내 인터페이스를 붙일 길이 없었기 때문이다. 실제 제한은 "트레이트와 타입이 둘 다 남의 것"인 경우 하나뿐이다. 확인하는 법: `trait Double { fn double(&self) -> Self; } impl Double for i32 { ... }`는 오류 없이 컴파일되고, `impl Display for Vec<i32>`만 E0117로 막힌다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`-> impl Trait`는 아무 타입이나 돌려줄 수 있는 동적 반환이다"</div>

틀렸다. 실제 타입은 컴파일할 때 정해진 하나뿐이고, 이름만 숨긴 것이다. "트레이트를 돌려준다"는 말이 Java의 `List` 반환처럼 들려서 생기는 오해다. 확인하는 법: `if flag { A } else { B }`를 돌려주면 E0308이 난다. 실행 중에 둘 중 하나를 고르려면 `Box<dyn Trait>`를 돌려준다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 트레이트를 타입에 구현할 수 있는 조건(고아 규칙)을 쓰고, 막힌 경우를 우회하는 방법을 하나 들라.</summary>

**답:** 트레이트와 타입 가운데 적어도 하나가 지금 크레이트에서 정의한 것이어야 한다. 둘 다 남의 것이면 그 타입을 필드 하나짜리 내 구조체로 감싸(뉴타입) 감싼 타입에 구현한다.<br>
**흔한 오답:** "타입이 내 것이어야 한다." 트레이트가 내 것이어도 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음은 컴파일되는가? 안 되면 오류 코드와 이유를 쓰라.</summary>

```rust
trait ConvertTo<T> { fn convert(&self) -> T; }
impl ConvertTo<i64> for i32 { fn convert(&self) -> i64 { 0 } }
impl ConvertTo<f64> for i32 { fn convert(&self) -> f64 { 0.0 } }
fn f() { let x = 7i32.convert(); }
```
**답:** 안 된다. `error[E0283]: type annotations needed`.<br>
**이유:** 제네릭 매개변수가 있는 트레이트라 `i32`에 두 번 구현되었다. `convert`가 어느 구현인지 정할 정보가 없다. `let x: i64 = ...`처럼 받을 타입을 적으면 풀린다. 연관 타입이었다면 두 번 구현하는 것부터 E0119로 막혔을 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 본문의 `Summary`, `Post`, `Tweet`, 블랭킷 구현 `impl<T: Display + ?Sized> Shout for T`(대문자로 바꾸고 `!`를 붙인다), `Labeled`와 `Code(u16)`(`Display`가 `E` 뒤에 네 자리 숫자를 찍는다)가 있을 때 출력은?</summary>

```rust
println!("{}", Post { author: "kim".into() }.summarize());
println!("{} {}", 42.shout(), "hi".shout());
println!("{}", Code(7).label());
```
**답:**
```
(kim의 글 더 보기...)
42! HI!
[E0007]
```
**이유:** `Post`는 `summarize`를 다시 정의하지 않아 기본 몸통을 쓴다. `i32`와 `str`은 `Display`가 있으므로 블랭킷 구현 덕분에 `shout`가 생긴다. `label`은 슈퍼트레이트 `Display`의 `{self}`로 `E0007`을 만든 뒤 대괄호로 감싼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 다음 세 경우에 연관 타입과 제네릭 매개변수 중 무엇을 쓰겠는가? (가) 파서가 만들어 내는 결과 타입 (나) 어떤 타입에서 이 타입으로 바꿀 수 있는가 (다) 저장소가 돌려주는 에러 타입</summary>

**답:** (가) 연관 타입 (나) 제네릭 매개변수 (다) 연관 타입.<br>
**이유:** 파서 하나가 만드는 결과와 저장소 하나가 내는 에러는 하나로 정해진다. "무엇에서 바꿀 수 있는가"는 여러 답이 있다(`From<&str>`, `From<u32>`…). 표준 라이브러리의 `FromStr::Err`가 (다)와 같은 모양이고 `From<T>`가 (나)와 같은 모양이다.

</details>


[^1]: The Rust Programming Language, 10.2 Defining Shared Behavior with Traits (Using Default Implementations, Implementing a Trait on a Type, Trait Bound Syntax, Returning Types That Implement Traits, blanket implementations) — https://doc.rust-lang.org/book/ch10-02-traits.html
[^2]: The Rust Reference, Traits (Trait functions may omit the function body …) — https://doc.rust-lang.org/reference/items/traits.html
[^3]: The Rust Programming Language, 20.2 Advanced Traits (Associated Types, Using Supertraits, Using the Newtype Pattern to Implement External Traits) — https://doc.rust-lang.org/book/ch20-02-advanced-traits.html
[^4]: The Rust Reference, Implementations — Trait implementation coherence, Orphan rules — https://doc.rust-lang.org/reference/items/implementations.html
[^5]: The Rust Reference, Traits — Supertraits — https://doc.rust-lang.org/reference/items/traits.html
[^6]: Rust Edition Guide, Rust 2024: RPIT lifetime capture rules — https://doc.rust-lang.org/edition-guide/rust-2024/rpit-lifetime-capture.html
[^7]: Rust API Guidelines, Interoperability — Types eagerly implement common traits (C-COMMON-TRAITS) — https://rust-lang.github.io/api-guidelines/interoperability.html
[^8]: Clippy Lints, impl_trait_in_params — https://rust-lang.github.io/rust-clippy/master/index.html
{% endraw %}
