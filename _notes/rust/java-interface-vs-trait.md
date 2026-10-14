---
layout: "note"
title: "Java 인터페이스 ↔ 트레이트"
display_title: "Java 인터페이스 ↔ 트레이트: 버튼 목록을 지키겠다는 약속"
kind: "concept"
kind_label: "브리지"
num: "16"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Java Interface vs Rust Trait", "인터페이스와 트레이트", "implements와 impl", "트레이트 업캐스팅", "Trait Upcasting"]
description: "둘 다 \"이 버튼들을 빠짐없이 만들어 두겠다\"는 약속이다. 쓰는 쪽은 버튼 이름만 알고, 실제 동작은 약속을 지킨 타입이 정한다. 다른 점은 셋이다. 트레이트는 남이 만든 타입에도 나중에 붙일 수 있고, 함께 물려줄 필드가 아예 없으며, 기본으로는 실행 중이 아니라 컴파일할 때 어…"
prev_url: "/studies/rust/traits/"
prev_title: "트레이트"
next_url: "/studies/rust/generics-trait-bounds/"
next_title: "제네릭과 트레이트 경계"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/java-interface-vs-trait/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

둘 다 "이 버튼들을 빠짐없이 만들어 두겠다"는 약속이다. 쓰는 쪽은 버튼 이름만 알고, 실제 동작은 약속을 지킨 타입이 정한다. 다른 점은 셋이다. 트레이트는 남이 만든 타입에도 나중에 붙일 수 있고, 함께 물려줄 필드가 아예 없으며, 기본으로는 실행 중이 아니라 컴파일할 때 어느 몸통을 부를지 정한다.

</div>


## 먼저 비교해 보기

표를 펼치기 전에, 두 코드에서 같은 일을 하는 줄끼리 선을 그어 본다. Java 쪽은 [인터페이스](/Hongs_Blog/studies/java/java-interface/) 문서의 리모컨 예 그대로다.

| 소프트웨어 프로젝트: Java 인터페이스 | Rust: 트레이트 |
|---|---|
| `interface RemoteControl { int MAX_VOLUME = 10; void turnOn(); void turnOff(); }` | `trait RemoteControl { fn turn_on(&self) -> String; fn turn_off(&self) -> String; }` |
| `class Television implements RemoteControl { public void turnOn() {...} ... }` | `struct Television;` 와 `impl RemoteControl for Television { fn turn_on(&self) -> String {...} ... }` |
| `default void setMute(boolean mute) {...}` | `fn restart(&self) -> String { ... }` (몸통 있는 메서드) |
| `RemoteControl rc = new Television(); rc.turnOn();` | `let rc: &dyn RemoteControl = &Television; rc.turn_on();` |
| `RemoteControl[] rcs = { new Lights(), new Television(), new Lights() };` | `let rcs: Vec<Box<dyn RemoteControl>> = vec![Box::new(Lights), Box::new(Television), Box::new(Lights)];` |
| `interface InterfaceC extends InterfaceA, InterfaceB` | `trait SmartDevice: RemoteControl + Searchable {}` |

<details class="callout callout-example" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| Java | Rust | 공통 구조 |
|---|---|---|
| `interface` | `trait` | 몸통 없는 메서드 목록 |
| `implements` 를 클래스 선언에 적음 | `impl 트레이트 for 타입` 블록을 따로 씀 | "이 타입이 약속을 지킨다"는 선언 |
| 추상 메서드 | 몸통 없는 트레이트 메서드 | 구현 쪽이 반드시 채운다 |
| `default` 메서드 | 기본 메서드 | 안 채우면 이 몸통을 쓴다 |
| 인터페이스 상수(`public static final`) | 연관 상수 `const MAX_VOLUME: u8 = 10;` | 이름으로 읽는 값 |
| 인터페이스 타입 변수 `RemoteControl rc` | `&dyn RemoteControl`, `Box<dyn RemoteControl>` | 든 값에 따라 다른 몸통이 실행된다 |
| 인터페이스 상속 `extends A, B` | 슈퍼트레이트 `trait C: A + B` | 큰 목록을 지키려면 작은 목록도 지켜야 한다 |
| `Walker.super.hello()` | `<Robot as Talker>::hello(&r)`, `Walker::hello(&r)` | 같은 이름 메서드 중 하나를 골라 부른다 |
| 다중 구현 `implements A, B` | `impl A for X`, `impl B for X` 를 따로 | 한 타입이 여러 목록을 지킨다 |

</details>


`rcs`를 차례로 켜면 두 언어 모두 `Turn on lights`, `Turn on TV`, `Turn on lights`를 찍는다. 같은 호출이 든 값에 따라 다른 몸통으로 간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: Rust 쪽 출력, 연관 상수, `&dyn` 크기(16바이트), 업캐스팅, 오류 코드 E0038·E0277·E0599·E0034·E0423, 트레이트에 필드를 적을 때의 구문 오류를 rustc 1.99로 확인했다 — [16_java-interface-vs-trait_verify.rs](/Hongs_Blog/studies/rust/code/16_java-interface-vs-trait_verify/)</div>

</div>


## 어디까지 같은가

같은 것.

- 빠뜨린 메서드는 컴파일 오류다. Java는 `is not abstract and does not override abstract method`, Rust는 `error[E0046]: not all trait items implemented`.
- 변수의 타입이 부를 수 있는 메서드를 정한다. Java에서 `InterfaceA ia`로 `methodB()`를 부르면 `cannot find symbol`이었듯, Rust에서 `&dyn A`로 `b()`를 부르면 `error[E0599]: no method named `b` found for reference `&dyn A``다.
- 인터페이스로 객체를 만들 수 없듯, 트레이트도 값이 아니다. `let x = RemoteControl;`은 `error[E0423]: cannot find value `RemoteControl` in this scope`다.
- 큰 목록을 구현하려면 작은 목록도 구현해야 한다. `trait C: A + B`에서 `B`를 빠뜨리면 `error[E0277]: the trait bound `X: B` is not satisfied`다[^1].

깨지는 지점.

1. **남의 타입에도 붙인다.** Java에서는 `String`에 내 인터페이스를 붙일 수 없다. 클래스를 고칠 수 없기 때문이다. Rust의 `impl` 블록은 타입 선언 밖에 따로 있으므로, 트레이트가 내 것이면 `impl Shouty for String`이 된다. 대신 트레이트와 타입이 둘 다 남의 것이면 막힌다(고아 규칙)[^2].
2. **물려줄 상태가 없다.** Java 인터페이스는 객체마다 다른 필드를 못 가진다는 점에서 트레이트와 같다. 그런데 Java에는 필드를 물려주는 추상 클래스와 클래스 상속이 따로 있다([추상 클래스와 인터페이스 비교](/Hongs_Blog/studies/java/abstract-class-vs-interface/)). Rust에는 구조체 상속이 없다. 공통 필드가 필요하면 그 필드를 담은 구조체를 필드로 넣고(합성), 공통 동작은 트레이트로 맞춘다. 트레이트에 `count: u32;`를 적으면 `error: expected one of `!` or `::`, found `:``로 구문부터 막힌다.
3. **기본은 정적 디스패치다.** Java의 인터페이스 호출은 늘 실행할 때 객체의 클래스를 보고 몸통을 고른다([다형성](/Hongs_Blog/studies/java/java-polymorphism/)의 동적 바인딩). Rust에서 `fn press(rc: &impl RemoteControl)`처럼 쓰면 컴파일러가 쓰인 타입마다 함수를 따로 만들고, 호출할 몸통을 컴파일할 때 정한다(정적 디스패치). Java처럼 실행 중에 고르려면 `dyn`을 직접 적는다[^3]. 그래서 `&Lights`는 8바이트, `&dyn RemoteControl`은 주소 둘을 담아 16바이트다.
4. **상수가 dyn을 막는다.** Java 인터페이스 상수는 흔히 쓴다. Rust에서 트레이트에 연관 상수를 넣으면 그 트레이트는 `dyn`으로 쓸 수 없다. `&dyn RemoteControl`이 `error[E0038]: the trait `RemoteControl` is not dyn compatible`로 막히고, 컴파일러는 상수를 다른 트레이트로 옮기라고 권한다[^4]. 그래서 검증 코드는 `MAX_VOLUME`을 `trait Volume`에 따로 두었다. 대신 연관 상수는 구현마다 값을 바꿀 수 있다(`Television` 10, `Lights` 0). Java 인터페이스 상수는 하나뿐이다.
5. **연관 타입.** `Iterator`의 `type Item;`처럼 "구현하는 쪽이 정하는 타입"을 목록에 넣을 수 있다. Java라면 `Iterator<T>`처럼 제네릭 매개변수로 적을 자리다. 차이는 [트레이트](/Hongs_Blog/studies/rust/traits/)의 연관 타입 절에 있다.
6. **이름 충돌 처리.** Java는 디폴트 메서드 둘이 겹치면 구현 클래스에서 `types Walker and Talker are incompatible`로 막고 다시 정의하게 한다. Rust는 두 트레이트를 함께 구현하는 것은 허락하고, 부르는 자리에서 `Robot.hello()`를 `error[E0034]: multiple applicable items in scope`로 막는다. `Walker::hello(&r)`처럼 어느 트레이트인지 적으면 풀린다. 또 Rust에는 Java의 `Walker.super.hello()`처럼 다시 정의한 메서드에서 원래 기본 몸통을 부르는 문법이 없다[^2].
7. **업캐스팅.** `&dyn SmartDevice`를 `&dyn RemoteControl`로 넘기는 것은 Java에서 자식 인터페이스를 부모 변수에 넣는 것과 같다. Rust는 1.86부터 이것을 허락한다[^5]. 그 전에는 직접 바꾸는 메서드를 만들어야 했다.

## 이 연결로 얻는 것

- Java에서 "인터페이스 타입으로 받고, 구현 객체를 넣는다"로 설계하던 곳은 Rust에서 두 갈래가 된다. 쓰이는 타입이 컴파일할 때 정해지면 제네릭(`impl Trait`), 실행 중에 섞여 들어오면 `dyn Trait`다. 고르는 법은 [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)에 있다.
- Java에서 상속으로 하던 "공통 필드 + 공통 메서드"는 Rust에서 "구조체를 필드로 담기 + 트레이트 기본 메서드"로 나눠 쓴다. 상속 사슬이 없으니 부모 클래스를 고쳐 자식이 깨지는 문제가 없다.
- 남의 타입에 동작을 더하고 싶을 때 Java에서는 감싸는 클래스(어댑터)를 만들었다. Rust는 내 트레이트를 그 타입에 바로 구현하면 된다. 남의 트레이트일 때만 감싸는 타입(뉴타입)이 필요하다[^6].

## 전이 문제

Python에는 "이 메서드들을 가진 객체면 받는다"를 적는 `typing.Protocol`이 있다. 클래스가 Protocol을 상속한다고 선언하지 않아도, 메서드 이름과 모양이 맞으면 타입 검사기가 통과시킨다. Java 인터페이스, Rust 트레이트와 비교해 (가) 약속을 지킨다는 선언이 어디에 있는가 (나) 언제 검사하는가를 표로 정리하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

| | Java 인터페이스 | Rust 트레이트 | Python `Protocol` |
|---|---|---|---|
| 선언 위치 | 클래스 선언의 `implements` | 따로 쓰는 `impl 트레이트 for 타입` | 선언이 없다. 메서드 모양이 맞으면 된다 |
| 검사 시점 | 컴파일할 때 | 컴파일할 때 | 타입 검사기(mypy 등)를 돌릴 때. 실행에는 영향이 없다 |

공통 구조는 "메서드 목록을 기준으로 받을 값을 정한다"이다. Rust는 선언을 타입 밖에 두어 남의 타입에도 붙일 수 있고, Python은 선언 자체를 없앴다. Java는 둘 다 못 한다. 이 답의 Python 쪽 설명은 PEP 544의 내용이며 이 문서의 검증 코드로 확인하지 않았다[확인필요].

</details>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** Java 코드를 같은 일을 하는 Rust 코드로 옮겨라. 출력은 같아야 한다.</summary>

```java
interface Greeter { String name(); default String greet() { return "Hi, " + name(); } }
class Kor implements Greeter { public String name() { return "철수"; } }
Greeter g = new Kor(); System.out.println(g.greet());
```
**답:**
```rust
trait Greeter { fn name(&self) -> String; fn greet(&self) -> String { format!("Hi, {}", self.name()) } }
struct Kor;
impl Greeter for Kor { fn name(&self) -> String { "철수".into() } }
let g: &dyn Greeter = &Kor; println!("{}", g.greet());
```
**이유:** `default` 메서드는 몸통 있는 트레이트 메서드가 되고, `implements`는 따로 쓰는 `impl` 블록이 된다. Java처럼 실행 중에 고르는 호출을 원하면 `&dyn Greeter`를 쓴다. `let g = Kor;`로 써도 출력은 같지만 정적 디스패치가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** Java 인터페이스에 흔히 두는 상수 `int MAX_VOLUME = 10;`을 Rust 트레이트에 `const MAX_VOLUME: u8 = 10;`으로 그대로 옮기면, `Vec<Box<dyn RemoteControl>>`을 만드는 줄이 왜 컴파일되지 않는가?</summary>

**답:** 연관 상수가 있는 트레이트는 dyn 호환이 아니어서 `error[E0038]`이 난다.<br>
**이유:** `dyn RemoteControl` 뒤에는 어떤 구현 타입이 있는지 모르는 값이 있다. 상수는 메서드처럼 `self`를 받아 부르는 것이 아니라 타입 이름으로 읽는다. 타입을 모르면 어느 구현의 상수인지 정할 수 없다. 상수를 다른 트레이트로 옮기거나 `fn max_volume(&self) -> u8` 메서드로 바꾸면 풀린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** Java에서는 되지만 Rust에서는 안 되는 것, Rust에서는 되지만 Java에서는 안 되는 것을 하나씩 들라.</summary>

**답:** Java만: 추상 클래스나 클래스 상속으로 필드를 물려주기(Rust 트레이트는 필드를 못 가지고, 구조체 상속도 없다). 다시 정의한 메서드에서 `X.super.m()`으로 기본 몸통 부르기. Rust만: 남이 만든 타입(`String`, `i32`)에 내 약속 붙이기. 구현마다 다른 값의 연관 상수.<br>
**흔한 오답:** "Rust는 다중 구현이 안 된다." 한 타입에 `impl` 블록을 여러 개 쓰면 된다.

</details>


## 출처

- Java 쪽 코드, 출력, 오류 메시지: [인터페이스](/Hongs_Blog/studies/java/java-interface/), [디폴트·정적·private 메서드](/Hongs_Blog/studies/java/java-interface-methods/), [다중 구현과 인터페이스 상속](/Hongs_Blog/studies/java/java-interface-inheritance/)
- Rust 쪽: 아래 각주

[^1]: The Rust Reference, Traits — Supertraits — https://doc.rust-lang.org/reference/items/traits.html
[^2]: The Rust Programming Language, 10.2 Defining Shared Behavior with Traits (Implementing a Trait on a Type, Using Default Implementations) — https://doc.rust-lang.org/book/ch10-02-traits.html
[^3]: The Rust Programming Language, 18.2 Using Trait Objects to Abstract over Shared Behavior (static dispatch, dynamic dispatch) — https://doc.rust-lang.org/book/ch18-02-trait-objects.html
[^4]: The Rust Reference, Traits — Dyn compatibility (It must not have any associated constants) — https://doc.rust-lang.org/reference/items/traits.html
[^5]: Announcing Rust 1.86.0, Trait upcasting — https://blog.rust-lang.org/2025/04/03/Rust-1.86.0/
[^6]: The Rust Programming Language, 20.2 Advanced Traits (Using the Newtype Pattern to Implement External Traits) — https://doc.rust-lang.org/book/ch20-02-advanced-traits.html
{% endraw %}
