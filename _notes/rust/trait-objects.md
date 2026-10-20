---
layout: "note"
title: "트레이트 객체"
display_title: "트레이트 객체 (Trait Objects)"
kind: "concept"
kind_label: "정의"
num: "18"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Trait Objects", "Trait Object", "dyn Trait", "dyn", "vtable", "가상 메서드 표", "Virtual Method Table", "동적 디스패치", "Dynamic Dispatch", "넓은 포인터", "Wide Pointer", "Fat Pointer", "dyn 호환성", "Dyn Compatibility", "객체 안전성", "Object Safety", "Box<dyn Error>"]
description: "값을 가리키는 주소 옆에, 그 값의 타입이 메서드 몸통을 어디에 두었는지 적은 표의 주소를 붙여 들고 다니는 방식이다. 그래서 원과 사각형처럼 서로 다른 타입을 한 목록에 담아 두고, 실행 중에 표를 보고 맞는 몸통을 부른다. 대신 부를 때마다 표를 한 번 더 거치고, 컴파일러가 …"
prev_url: "/studies/rust/generics-trait-bounds/"
prev_title: "제네릭과 트레이트 경계"
next_url: "/studies/rust/generics-vs-trait-objects/"
next_title: "제네릭과 트레이트 객체 비교"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "18_trait-objects_verify.rs", "u": "/studies/rust/code/18_trait-objects_verify/", "r": "검증"}]
permalink: "/studies/rust/trait-objects/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

값을 가리키는 주소 옆에, 그 값의 타입이 메서드 몸통을 어디에 두었는지 적은 표의 주소를 붙여 들고 다니는 방식이다. 그래서 원과 사각형처럼 서로 다른 타입을 한 목록에 담아 두고, 실행 중에 표를 보고 맞는 몸통을 부른다. 대신 부를 때마다 표를 한 번 더 거치고, 컴파일러가 몸통을 호출 자리에 펼쳐 넣지 못한다. 또 타입마다 다른 사본이 필요한 메서드가 있는 트레이트는 이렇게 쓸 수 없다.

</div>


## 예시로 보기

도형 편집기가 원, 직사각형, 크기 1짜리 단위 도형을 한 목록에 담아 두고 넓이를 모두 더한다고 하자. [제네릭](/Hongs_Blog/studies/rust/generics-trait-bounds/) 함수 `all<T: Shape>(xs: Vec<T>)`에는 한 번에 한 타입만 들어간다. 원과 정사각형을 함께 담은 `all(vec![Circle, Square])`는 `error[E0308]: mismatched types`다([19_generics-vs-trait-objects_bench.rs](/Hongs_Blog/studies/rust/code/19_generics-vs-trait-objects_bench/)에서 확인). 게다가 목록을 사용자가 실행 중에 채운다면, 어떤 타입이 몇 개 올지 컴파일러는 알 수 없다.

목록의 칸을 "`Shape`를 구현한 무언가를 가리키는 상자"로 둔다.

```rust
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> String { "도형".to_string() }   // 기본 몸통
}
// Circle { r }, Rect { w, h }, Unit이 각각 Shape를 구현한다. name을 다시 정의한 것은 Circle뿐이다.

let shapes: Vec<Box<dyn Shape>> = vec![
    Box::new(Circle { r: 1.0 }),
    Box::new(Rect { w: 2.0, h: 3.0 }),
    Unit.boxed(),                        // Box::new(Unit)과 같다. 아래 dyn 호환성 절에서 다시 본다
];
for s in &shapes {
    println!("{} 넓이 {:.2}, 값 크기 {}바이트", s.name(), s.area(), size_of_val(&**s));
}
```

```
원(r=1) 넓이 3.14, 값 크기 8바이트
도형 넓이 6.00, 값 크기 16바이트
도형 넓이 1.00, 값 크기 0바이트
```

`dyn Shape`가 트레이트 객체(trait object)다. `dyn`은 dynamic의 줄임말로, 어떤 타입인지가 실행 중에 정해진다는 표시다. 트레이트 객체는 참조나 `Box` 같은 포인터 뒤에 `dyn`과 트레이트 이름을 적어 만든다[^1].

상자 안의 값은 8바이트, 16바이트, 0바이트로 크기가 제각각이다. 그래도 목록의 칸은 모두 같은 크기다. 칸에 값이 아니라 주소 두 개가 들어 있기 때문이다.

```
Vec 버퍼의 칸 하나 = Box<dyn Shape> (16바이트)
┌───────────────┬───────────────┐
│  데이터 주소  │    표 주소    │
└───────┬───────┴───────┬───────┘
        ▼               ▼
  Circle { r: 1.0 }    Circle용 vtable
  (힙, 8바이트)        ┌──────────────────────────┐
                       │ area → Circle의 area 몸통 │
                       │ name → Circle의 name 몸통 │
                       │ 값의 크기 같은 정보       │
                       └──────────────────────────┘
```

`s.name()`을 부르면 표 주소를 따라가 `name` 칸에 적힌 주소로 간다. `Rect`의 표에는 `Rect`가 쓰는 몸통, 곧 트레이트의 기본 몸통이 적혀 있다. 그래서 같은 `s.name()`이 원에서는 `원(r=1)`을, 직사각형에서는 `도형`을 찍는다. 이 그림에서 두 칸의 순서는 설명을 위해 정한 것이다. Rust는 이런 포인터의 크기조차 "주소 두 개"라고 약속하지 않는다(아래 포인터 크기 절)[^4].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 출력, 포인터 크기(8·16바이트), `size_of_val`이 돌려준 실제 크기, `dyn` 값을 그대로 받을 때의 E0277, dyn 호환이 아닌 트레이트의 E0038 네 가지와 `where Self: Sized`로 빼낸 메서드, `Box<dyn Error + Send + Sync>`와 `?`·`downcast_ref`, 기본 수명 `'static` 오류, `+ Send` 경계의 E0277, `Send` 없는 `Box<dyn Error>`를 스레드에서 돌려받을 때의 E0277을 rustc 1.99로 확인했다 — [18_trait-objects_verify.rs](/Hongs_Blog/studies/rust/code/18_trait-objects_verify/)</div>

</div>


## 정의

`dyn Shape`는 "`Shape`를 구현한 어떤 타입의 값인데, 어느 타입인지는 모른다"는 타입이다. 어느 타입인지 모르니 크기도 모른다. 그래서 트레이트 객체는 크기를 모르는 타입(DST)이고, 늘 `&dyn Shape`나 `Box<dyn Shape>` 같은 포인터 뒤에서 쓴다[^2]. 트레이트 객체를 가리키는 포인터에는 둘이 들어 있다[^2].

- `Shape`를 구현한 타입 `T`의 값을 가리키는 주소
- 가상 메서드 표(virtual method table), 줄여서 vtable의 주소. vtable에는 `Shape`와 그 슈퍼트레이트의 메서드마다, `T`가 쓰는 몸통의 주소(함수 포인터)가 들어 있다.

트레이트 객체의 메서드를 부르면 vtable에서 함수 주소를 읽어 그 주소로 간접 호출한다[^2]. 어느 몸통인지 실행 중에 정해지므로 이것을 동적 디스패치(dynamic dispatch)라 부른다. 이렇게 찾는 데는 정적 디스패치에 없는 실행 비용이 들고, 컴파일러는 몸통을 호출 자리에 펼쳐 넣을(인라인) 수 없다. 그만큼 할 수 있는 최적화도 줄어든다[^1]. 얼마나 차이 나는지는 [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)에서 쟀다.

### 포인터 크기

| 타입 | 크기(이 기계, 64비트) | 들고 있는 것 |
|---|---|---|
| `&Circle` | 8바이트 | 주소 |
| `Box<Circle>` | 8바이트 | 주소 |
| `&dyn Shape` | 16바이트 | 주소 + vtable 주소 |
| `Box<dyn Shape>` | 16바이트 | 주소 + vtable 주소 |
| `&[u8]` | 16바이트 | 주소 + 원소 개수 |

크기를 모르는 타입을 가리키는 포인터는 주소에 "나머지를 채우는 정보"를 하나 더 붙인다. 슬라이스는 원소 개수를, 트레이트 객체는 vtable 주소를 붙인다. 이런 포인터를 넓은 포인터(wide pointer)라 부른다[^3]. 실제 값의 크기도 실행 중에 vtable로 알아낸다[^3]. 위 예에서 `size_of_val`이 상자마다 다른 크기를 돌려준 것이 그것이다.

검증 코드는 `size_of::<&dyn Shape>() == 2 * size_of::<usize>()`를 확인했다. 다만 Reference는 크기를 모르는 타입의 포인터가 "적어도 보통 포인터만큼"이라는 것만 약속한다. 지금은 모두 `usize` 두 개 크기지만 거기에 기대지 말라고 적는다[^4]. `unsafe` 코드에서 이 배치를 가정하면 안 된다.

크기를 모르니 `dyn` 값을 포인터 없이 다룰 수는 없다.

```rust
fn f(x: dyn Shape) -> f64 { x.area() }     // error[E0277]: the size for values of type
fn g(x: Vec<dyn Shape>) -> usize { … }     //   `(dyn Shape + 'static)` cannot be known at compilation time
```

`Vec<T>`의 `T`에는 숨은 `Sized` 경계가 있어서([제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/)), 컴파일러는 `required by an implicit `Sized` bound in `Vec``라고 덧붙인다. 칸에 넣을 것은 `Box<dyn Shape>`나 `&dyn Shape`다.

### dyn 호환성

트레이트 객체로 쓸 수 있는 트레이트를 dyn 호환(dyn compatible)이라 부른다. 예전 이름은 객체 안전성(object safety)이다[^5]. 규칙을 쉬운 말로 줄이면 다음과 같다[^5].

- 슈퍼트레이트도 모두 dyn 호환이어야 한다. `Sized`가 슈퍼트레이트여서도 안 된다.
- 연관 상수가 없어야 하고, 제네릭이 붙은 연관 타입도 없어야 한다.
- dyn에서 부를 메서드는 다음을 지킨다.
  - 타입 매개변수가 없다(수명 매개변수는 된다).
  - `Self`를 받는 자리(`&self` 등) 말고는 쓰지 않는다.
  - 받는 자리는 `&self`, `&mut self`, `Box<Self>`, `Rc<Self>`, `Arc<Self>`, 또는 이것들을 감싼 `Pin<P>`다.
  - `async fn`이 아니고, 반환 자리에 `impl Trait`를 쓰지 않는다.
- 위를 못 지키는 메서드는 `where Self: Sized`를 붙여 "dyn에서는 부르지 않는 메서드"로 빼낼 수 있다.

검증 코드로 확인한 결과다.

| 트레이트 | `&dyn`으로 쓰면 |
|---|---|
| `trait Store { fn put<T>(&self, x: T); }` | `error[E0038]: the trait `Store` is not dyn compatible` |
| `trait Cloner { fn dup(&self) -> Self; }` | E0038 |
| `trait Fetch { async fn get(&self) -> u8; }` | E0038 |
| `Clone` (`pub trait Clone: Sized`[^6]) | E0038 |
| `fn dup(&self) -> Self where Self: Sized;` 와 `fn id(&self) -> u8;` | 오류 없음. `s.id()`는 부를 수 있다 |
| 위 트레이트에서 `s.dup()` | `error: the `dup` method cannot be invoked on a trait object` |

규칙의 까닭은 vtable의 모양에서 나온다. vtable은 메서드마다 칸이 하나 있는 고정된 표다. 제네릭 메서드 `put<T>`는 `T`마다 사본이 따로 생기는데([단형화](/Hongs_Blog/studies/rust/generics-trait-bounds/)), 어떤 `T`가 올지 모르니 표에 미리 적어 둘 수 없다. `-> Self`는 돌려받을 값의 크기를 부르는 쪽이 알아야 하는데, dyn 뒤의 타입은 모른다. `async fn`은 구현마다 크기가 다른 숨은 타입([퓨처](/Hongs_Blog/studies/rust/futures-async-await/))을 돌려준다.

`where Self: Sized`가 탈출구다. 예시의 `Shape`에는 이런 기본 메서드가 있었다.

```rust
fn boxed(self) -> Box<dyn Shape>
where
    Self: Sized + 'static,
{
    Box::new(self)
}
```

`self`를 값으로 받으니 dyn에서는 부를 수 없다. 대신 `Self: Sized`를 붙였으므로 `Shape`는 계속 dyn 호환이고, 구체 타입에서는 `Unit.boxed()`처럼 부른다.

### 수명과 자동 트레이트

트레이트 객체 안에 참조가 있을 수 있으므로, 트레이트 객체 타입에는 수명이 붙는다. 적지 않으면 기본값이 쓰인다[^7].

| 적은 것 | 실제 뜻 |
|---|---|
| `Box<dyn Display>` | `Box<dyn Display + 'static>` |
| `&'a dyn Display` | `&'a (dyn Display + 'a)` |

그래서 빌린 문자열을 상자에 넣어 돌려주면 막힌다.

```rust
fn f<'a>(s: &'a str) -> Box<dyn Display> { Box::new(s) }
// error: lifetime may not live long enough
fn g<'a>(s: &'a str) -> Box<dyn Display + 'a> { Box::new(s) }   // 된다
```

`dyn` 뒤에는 보통 트레이트를 하나만 적는다. 다만 `Send`, `Sync`, `Unpin` 같은 자동 트레이트는 `+`로 덧붙일 수 있다[^8]. `Rc`를 품은 값을 `Box<dyn Shape + Send>`에 넣으면 ``error[E0277]: `Rc<u8>` cannot be sent between threads safely``다. 스레드 사이로 보낼 상자에 `+ Send`가 왜 필요한지는 [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/)에 있다.

### Box\<dyn Error\>

가장 자주 만나는 트레이트 객체다. Book은 `Box<dyn Error>`를 우선 "어떤 종류의 에러든"으로 읽으라고 한다[^9]. 표준 라이브러리에는 `E: Error`인 모든 타입을 `Box<dyn Error>`로, `E: Error + Send + Sync`인 타입을 `Box<dyn Error + Send + Sync>`로 바꾸는 `From`이 있다[^10]. `?`는 이 `From`을 불러 에러를 상자에 넣는다[^9].

```rust
fn parse_port(s: &str) -> Result<u16, Box<dyn Error + Send + Sync>> {
    if s.is_empty() {
        return Err(Box::new(ConfigError { key: "port".into() }));
    }
    let n: u16 = s.parse()?;     // ParseIntError가 상자에 들어간다
    Ok(n)
}
```

`parse_port("")`의 에러는 `설정 키 port 가 없다`, `parse_port("80x")`의 에러는 `invalid digit found in string`이다. 상자에 넣어도 원래 타입은 남아 있다. `downcast_ref::<ConfigError>()`와 `downcast_ref::<ParseIntError>()`가 각각 `Some`을 돌려준다[^10]. 에러를 위로 넘기는 방법 전체는 [물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)에 있다.

## 활용

- **섞인 목록과 플러그인.** GUI 라이브러리가 버튼, 글상자, 그리고 사용자가 나중에 만든 위젯까지 한 목록에 담아 그리는 것이 Book의 예다[^1]. 서비스에서는 요청 처리 단계 목록, 시작할 때 설정으로 고르는 저장소(`Arc<dyn Repo + Send + Sync>`)가 같은 모양이다.
- **인자는 `&dyn`으로 빌려 받는다.** 상자를 빌려 받는 `&Box<dyn Shape>`는 한 번 더 거칠 뿐 얻는 것이 없다. clippy `borrowed_box`(complexity, 기본 경고)가 `&Box<T>`를 알린다[^11]. `&dyn Shape`로 받으면 상자에 든 값도, 스택에 있는 값도 받는다.
- **공개 트레이트에 메서드를 더할 때.** 사용자가 이미 `dyn MyTrait`로 쓰고 있다면, 제네릭 메서드나 연관 상수를 더하는 순간 사용자 코드가 E0038로 깨진다. 새 메서드에 `where Self: Sized`를 붙이면 dyn 호환이 유지된다.
- **업캐스팅.** 트레이트 객체를 가리키는 참조를 슈퍼트레이트의 트레이트 객체 참조로 바꾸는 것(`&dyn SmartDevice` → `&dyn RemoteControl`)은 1.86부터 된다[^12]. 예는 [Java 인터페이스 ↔ 트레이트](/Hongs_Blog/studies/rust/java-interface-vs-trait/)에 있다.
- **흔한 실수.**
  - 빌린 데이터를 담은 `Box<dyn Trait>`를 돌려주다 수명 오류를 만난다. 기본 수명이 `'static`이라서다. `+ 'a`를 적거나 데이터를 소유하게 바꾼다.
  - `Box<dyn Error>`를 돌려주는 클로저를 `thread::spawn`에 넘기면 ``error[E0277]: `dyn std::error::Error` cannot be sent between threads safely``다. `tokio::spawn`에 넘기는 퓨처도 `Send`여야 하므로([tokio 런타임과 태스크](/Hongs_Blog/studies/rust/tokio-runtime-tasks/)) 같은 문제가 생긴다. 처음부터 `Box<dyn Error + Send + Sync>`로 둔다.
  - 고정된 몇 가지 타입만 오는데 `dyn`을 쓴다. 그럴 때는 열거형이 더 단순하고 빠르다: [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)

## 연결

- 선수: [트레이트](/Hongs_Blog/studies/rust/traits/), [제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/)(`?Sized`, 단형화)
- Java의 인터페이스 변수는 늘 실행 중에 몸통을 고른다([다형성](/Hongs_Blog/studies/java/java-polymorphism/)의 동적 바인딩). Rust에서 그 동작을 원할 때 쓰는 것이 `dyn`이다: [Java 인터페이스 ↔ 트레이트](/Hongs_Blog/studies/rust/java-interface-vs-trait/)
- 슬라이스도 넓은 포인터다: [슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/). 힙 상자: [Box와 힙](/Hongs_Blog/studies/rust/box-heap/)
- 언제 제네릭을, 언제 `dyn`을 쓰나: [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)
- `async fn`이 있는 트레이트가 dyn으로 안 되는 까닭의 바탕: [Future와 async·await](/Hongs_Blog/studies/rust/futures-async-await/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"트레이트 객체를 쓰려면 `Box`로 힙에 올려야 한다"</div>

틀렸다. `dyn`이 요구하는 것은 포인터 뒤에 있으라는 것뿐이다. `&dyn Shape`도 트레이트 객체이고, 스택에 있는 값이나 `Vec<Circle>` 안의 값을 그대로 가리킨다. Book의 예가 `Vec<Box<dyn Draw>>`라서 `Box`가 필수처럼 보인다. 확인하는 법: `let d: &dyn Display = &5;`는 힙 할당 없이 컴파일되고, `shout(d)`가 `5!`를 돌려준다. 값을 소유해야 할 때(목록이 값을 들고 있어야 할 때)만 `Box`가 필요하다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 이 기계에서 `&Circle`은 8바이트, `&dyn Shape`는 16바이트다. 늘어난 8바이트에는 무엇이 들어 있고, 왜 필요한가?</summary>

**답:** vtable의 주소다. vtable에는 `Circle`이 쓰는 `area`, `name` 몸통의 주소가 있다.<br>
**이유:** `&dyn Shape`만 받은 코드는 뒤의 타입을 모른다. 그래서 메서드를 부를 때마다 이 표에서 몸통 주소를 읽어 간접 호출한다. 실제 값의 크기도 이 표로 알아낸다. `&[u8]`이 16바이트인 것도 같은 이유지만, 덧붙은 정보가 원소 개수라는 점이 다르다.<br>
**흔한 오답:** "값을 복사해 들고 있다." 값은 데이터 주소가 가리키는 곳에 그대로 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음은 컴파일되는가? 안 되면 오류 코드와 까닭을 쓰고, `put`을 남긴 채 `&dyn Store`를 쓰는 방법을 하나 들라.</summary>

```rust
trait Store { fn put<T>(&self, x: T); }
fn f(_s: &dyn Store) {}
```
**답:** 안 된다. `error[E0038]: the trait `Store` is not dyn compatible`.<br>
**이유:** `put<T>`는 `T`마다 사본이 생기는 제네릭 메서드라 vtable에 칸을 미리 만들 수 없다. `fn put<T>(&self, x: T) where Self: Sized;`로 바꾸면 트레이트는 dyn 호환이 되고, 대신 `put`은 `&dyn Store`에서 부를 수 없다(구체 타입에서는 부른다).<br>
**흔한 오답:** "`T`에 경계가 없어서." 경계를 달아도 제네릭 메서드라는 점은 그대로라 막힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예시의 `shapes`(원 r=1, 직사각형 2×3, 단위 도형)를 돌며 `"{} 넓이 {:.2}, 값 크기 {}바이트"`로 `s.name()`, `s.area()`, `size_of_val(&**s)`를 찍는다. 출력은? `Circle`만 `name`을 다시 정의했고, `Rect`는 `f64` 필드 둘, `Unit`은 필드가 없다.</summary>

**답:**
```
원(r=1) 넓이 3.14, 값 크기 8바이트
도형 넓이 6.00, 값 크기 16바이트
도형 넓이 1.00, 값 크기 0바이트
```
**이유:** `name`은 vtable을 거쳐 각 타입이 쓰는 몸통으로 간다. `Rect`와 `Unit`은 기본 몸통 `"도형"`을 쓴다. `size_of_val`은 포인터 크기(16)가 아니라 dyn 뒤에 숨은 실제 값의 크기를 돌려준다.<br>
**흔한 오답:** 세 줄 모두 `값 크기 16바이트`. 그것은 `size_of::<Box<dyn Shape>>()`의 값이다.

</details>


[^1]: The Rust Programming Language, 18.2 Using Trait Objects to Abstract over Shared Behavior (Defining a Trait for Common Behavior, Performing Dynamic Dispatch) — https://doc.rust-lang.org/book/ch18-02-trait-objects.html
[^2]: The Rust Reference, Trait objects (dynamically sized types, the pointer includes a pointer to an instance and a vtable, virtual dispatch) — https://doc.rust-lang.org/reference/types/trait-object.html
[^3]: The Rustonomicon, Exotically Sized Types — Dynamically Sized Types (DSTs) (wide pointer, the vtable pointer completes a trait object pointer, the runtime size can be requested from the vtable) — https://doc.rust-lang.org/nomicon/exotic-sizes.html
[^4]: The Rust Reference, Type layout — Pointers and references layout (Note: all pointers to DSTs are currently twice the size of usize, you should not rely on this) — https://doc.rust-lang.org/reference/type-layout.html
[^5]: The Rust Reference, Traits — Dyn compatibility (This concept was formerly known as object safety) — https://doc.rust-lang.org/reference/items/traits.html
[^6]: std 문서, Trait `std::clone::Clone` — https://doc.rust-lang.org/std/clone/trait.Clone.html
[^7]: The Rust Reference, Lifetime elision — Default trait object lifetimes — https://doc.rust-lang.org/reference/lifetime-elision.html
[^8]: The Rust Reference, Special types and traits — Auto traits (Auto traits may be added as an additional bound to any trait object) — https://doc.rust-lang.org/reference/special-types-and-traits.html
[^9]: The Rust Programming Language, 9.2 Recoverable Errors with Result (The Box<dyn Error> Type, the ? operator calls from) — https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html
[^10]: std 문서, Trait `std::error::Error` (`impl From<E> for Box<dyn Error + 'a>`, `downcast_ref`) — https://doc.rust-lang.org/std/error/trait.Error.html
[^11]: Clippy Lints, borrowed_box — https://rust-lang.github.io/rust-clippy/master/index.html
[^12]: Announcing Rust 1.86.0, Trait upcasting — https://blog.rust-lang.org/2025/04/03/Rust-1.86.0/
{% endraw %}
