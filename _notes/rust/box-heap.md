---
layout: "note"
title: "Box와 힙"
display_title: "Box와 힙 (Box)"
kind: "concept"
kind_label: "자료구조"
num: "27"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Box", "Box<T>", "Heap", "힙", "Stack", "스택", "Recursive Type", "재귀 타입", "E0072", "Box<dyn Trait>", "Box<[T]>", "Box<str>", "Fat Pointer", "넓은 포인터", "Null Pointer Optimization"]
description: "Box는 값을 프로그램이 따로 빌려 쓰는 넓은 메모리(힙)에 맡겨 두고, 손에는 그 자리를 적은 쪽지(주소 하나)만 들고 다니는 방법이다. 쪽지는 늘 같은 크기라서, 자기 안에 자기를 품는 타입이나 종류가 섞인 값도 담을 수 있고, 큰 값을 넘길 때도 쪽지만 건네면 된다. 대신 맡…"
prev_url: "/studies/rust/panic-policy/"
prev_title: "panic을 쓸 때"
next_url: "/studies/rust/rc-arc-weak/"
next_title: "Rc·Arc·Weak"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "27_box-heap_verify.rs", "u": "/studies/rust/code/27_box-heap_verify/", "r": "검증"}]
permalink: "/studies/rust/box-heap/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

`Box`는 값을 프로그램이 따로 빌려 쓰는 넓은 메모리(힙)에 맡겨 두고, 손에는 그 자리를 적은 쪽지(주소 하나)만 들고 다니는 방법이다. 쪽지는 늘 같은 크기라서, 자기 안에 자기를 품는 타입이나 종류가 섞인 값도 담을 수 있고, 큰 값을 넘길 때도 쪽지만 건네면 된다. 대신 맡길 때와 찾으러 갈 때 비용이 조금 든다. 쪽지의 주인은 한 명뿐이고, 주인이 사라지면 맡긴 값도 함께 치워진다.

</div>


## 예시로 보기

함수 안의 변수는 스택(stack)에 놓인다. 스택은 접시를 쌓듯 맨 위에 놓고 맨 위에서 꺼내는 곳이라 빠르다. 대신 스택에 놓는 값은 컴파일할 때 크기가 정해져 있어야 한다[^1]. 크기를 모르거나 바뀌는 값은 힙(heap)에 둔다. 힙에 자리를 달라고 하면 할당자가 빈 곳을 찾아 그 주소를 돌려준다. 주소는 크기가 정해져 있으므로 스택에 둘 수 있다[^1].

이 규칙에 처음 걸리는 곳이 자기 자신을 품는 타입이다. 수 목록을 "첫 수, 그리고 나머지 목록"으로 정의해 본다.

```rust
pub enum List { Cons(i32, List), Nil }
```

```
error[E0072]: recursive type `List` has infinite size
help: insert some indirection (e.g., a `Box`, `Rc`, or `&`) to break the cycle
```

Rust는 열거형의 크기를 가장 큰 variant에 맞춘다[^2]. `Cons`의 크기를 알려면 안에 든 `List`의 크기를 알아야 하는데, 그 `List`가 또 `Cons`일 수 있으니 끝이 없다. 컴파일러가 제안한 대로 나머지 목록을 `Box`에 넣는다.

```rust
enum List { Cons(i32, Box<List>), Nil }

let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
```

이제 `Cons`는 `i32` 하나와 주소 하나만 담는다. 주소는 가리키는 값이 얼마나 크든 크기가 같다. 그래서 컴파일러가 `List`의 크기를 정할 수 있다[^2]. 검증 코드에서 `size_of::<List>()`는 16이었다. 4 + 8 = 12인데 16이 된 것은 빈칸 때문이다. 주소 칸은 8의 배수 위치에 와야 하고, 값 전체의 크기도 8의 배수여야 한다[^5].

```
스택                힙
list
┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────┐
│ Cons 1  │       │ Cons 2  │       │ Cons 3  │       │ Nil │
│ 주소 ───┼─────► │ 주소 ───┼─────► │ 주소 ───┼─────► │     │
└─────────┘       └─────────┘       └─────────┘       └─────┘
```

트리도 같다. C로 만든 [이진 탐색 트리](/Hongs_Blog/studies/data-structures/bst-search-insert/)는 왼쪽·오른쪽 자식 포인터가 `NULL`일 수 있었다. Rust에서는 "없을 수도 있는 자식"을 `Option<Box<Node>>`로 쓴다.

```rust
struct Node { key: i32, left: Option<Box<Node>>, right: Option<Box<Node>> }

fn insert(slot: &mut Option<Box<Node>>, key: i32) {
    match slot {
        None => *slot = Some(Box::new(Node { key, left: None, right: None })),
        Some(n) if key < n.key => insert(&mut n.left, key),
        Some(n) => insert(&mut n.right, key),
    }
}
```

5, 3, 8, 1, 4, 9, 7을 넣고 중위 순회하면 `[1, 3, 4, 5, 7, 8, 9]`가 나온다. `Option`을 씌우면 칸이 커지지 않을까? 커지지 않는다. `Option<Box<i32>>`도 8바이트다. 표준 라이브러리는 `Option<Box<U>>`가 `Box<U>`와 같은 크기임을 보장한다[^6]. `Box`의 주소는 절대 널(0번지)이 아니므로[^3], 남는 널 자리를 `None`으로 쓴다. C에서 `NULL`인지 확인하던 일을 Rust에서는 `match`가 빠짐없이 하게 만든다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: E0072(`Option<Node>`로 감싼 경우 포함), 목록 합 6과 트리 중위 순회, 크기 표의 열 가지 값, `Box<dyn Shape>` 목록의 넓이 합, `Box`를 함수로 넘겨도 힙 주소가 같은 것, `Drop` 횟수, clippy 린트 네 개가 기본으로 켜진 것을 실행해 확인했다 — [27_box-heap_verify.rs](/Hongs_Blog/studies/rust/code/27_box-heap_verify/)</div>

</div>


## 정의

`Box<T>`는 힙에 놓인 `T` 값 하나를 혼자 가지는 포인터다. `Box::new(v)`는 힙에 자리를 받아 `v`를 옮겨 넣는다. `Box`가 범위를 벗어나면 안의 값을 치우고(drop) 그 자리를 돌려준다[^3]. 주인이 한 명이라는 점은 다른 값과 같다. `let b = a;`로 옮기면 `a`는 비고, 치우기는 한 번만 일어난다. 검증 코드에서 `Box` 두 개를 만들어 하나를 옮기고 둘 다 `Vec`에 넣었더니 `Drop`이 정확히 두 번 돌았다.

| 하는 일 | 쓰는 법 | 드는 것 |
|---|---|---|
| 힙에 넣기 | `Box::new(v)` | 할당 한 번, `v`를 힙으로 옮기기 |
| 안의 값 쓰기 | `*b + 1`, `b.area()` | 주소 한 번 따라가기. 메서드 호출은 저절로 따라간다 |
| 넘기기 | `f(b)` | 주소 한 칸만 옮긴다 |
| 치우기 | 범위 끝, 또는 `drop(b)` | 안의 값 drop, 자리 돌려주기 |
| 일부러 새게 하기 | `Box::leak(b)` | [malloc·free ↔ 소유권과 Drop](/Hongs_Blog/studies/rust/malloc-free-vs-ownership/) |

`T`의 크기를 컴파일할 때 알면 `Box<T>`는 포인터 하나로 표현되고, C의 `T*`와 함수 호출 규약(ABI)이 같다고 표준 문서가 보장한다[^3]. 크기를 모르는 타입(슬라이스 `[T]`, `str`, `dyn Trait`)을 가리키는 포인터는 두 배 크기다. 주소 옆에 길이나 vtable(메서드 표)의 주소를 함께 적기 때문이다[^4].

### 크기

64비트 기계에서 잰 값이다.

| 타입 | 크기(바이트) | 들어 있는 것 |
|---|---|---|
| `&i32` | 8 | 주소 |
| `Box<i32>` | 8 | 주소 |
| `Box<[i32; 1000]>` | 8 | 주소. 가리키는 배열은 힙에서 4000바이트 |
| `Option<Box<i32>>` | 8 | 주소. `None`은 널 |
| `Box<[i32]>` | 16 | 주소 + 원소 개수 |
| `Box<str>` | 16 | 주소 + 바이트 길이 |
| `Box<dyn Display>` | 16 | 주소 + vtable 주소 |
| `Vec<i32>` | 24 | 주소 + 길이 + 용량 |
| `List` (위의 목록) | 16 | `i32`, 빈칸, 주소 |
| `[i32; 1000]` | 4000 | 원소 1000개 그대로 |

마지막 두 줄을 비교하면 `Box`가 하는 일이 보인다. 배열을 그대로 두면 변수 하나가 4000바이트다. `Box`에 넣으면 변수는 8바이트다.

### `Box<dyn Trait>`: 종류가 다른 값을 한 목록에

정사각형과 원을 한 `Vec`에 담고 싶다. 둘은 타입도 크기도 다르다. 그래서 `Vec<Square>`처럼 한 타입으로 적을 수 없다. 각각을 `Box`에 넣고 "`Shape` 트레이트를 구현한 무엇"으로 본다[^2]. 트레이트 객체의 원리는 [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/)에 있다.

```rust
let shapes: Vec<Box<dyn Shape>> = vec![Box::new(Square(2.0)), Box::new(Circle(1.0))];
let total: f64 = shapes.iter().map(|s| s.area()).sum();
```

검증 코드는 원의 넓이를 계산하기 쉽게 $$3r^2$$으로 두었다. 넓이 합은 $$4 + 3 = 7$$이고, 이름은 `["square 2", "circle 1"]`이다. 목록의 칸은 모두 16바이트(`Box<dyn Shape>`)로 같다. 실제 값의 크기는 힙에서만 다르다.

### 큰 값 넘기기

큰 데이터를 그냥 넘기면 소유권이 옮겨 갈 때 스택에서 데이터가 복사될 수 있다. `Box`에 넣어 두면 작은 주소만 복사된다[^2]. 검증 코드에서 8KB 배열(`[u64; 1024]`)을 담은 `Box`를 함수로 넘겼다. 넘기기 전과 함수 안에서 본 힙 주소가 같았다.

## 활용

- **언제 쓰나.** 책은 세 경우를 든다[^2]. 크기를 컴파일할 때 모르는데 정확한 크기가 필요한 자리에 써야 할 때(재귀 타입), 큰 데이터의 소유권을 복사 없이 넘길 때, 구체 타입은 상관없이 어떤 트레이트를 구현한 값을 가지고 싶을 때(트레이트 객체)다.
- **실제 쓰임.** 트리와 연결 리스트, 컴파일러가 만드는 구문 트리처럼 노드가 노드를 품는 구조. 플러그인·핸들러 목록(`Vec<Box<dyn Handler>>`). 에러 상자 `Box<dyn Error + Send + Sync>`([물음표 연산자와 에러 전파](/Hongs_Blog/studies/rust/error-propagation/)).
- **큰 variant 줄이기.** 열거형은 가장 큰 variant만큼 자리를 차지한다. 큰 variant 하나만 `Box`로 감싸면 나머지 variant까지 작아진다. clippy의 `large_enum_variant`가 이 자리를 알려 준다([열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/)).
- **다 만든 목록 얼리기.** 더 늘리지 않을 `Vec<T>`는 `into_boxed_slice()`로 `Box<[T]>`가 되고, `String`은 `into_boxed_str()`로 `Box<str>`가 된다. 손잡이가 24바이트에서 16바이트로 준다. 작은 문자열을 수백만 개 들고 있는 맵이라면 차이가 쌓인다.
- **필요 없는 Box.** 검증 코드에서 clippy를 기본 설정으로 돌렸을 때 다음 네 린트가 모두 경고했다. `box_collection`(`Box<Vec<T>>`. `Vec`은 이미 힙에 있다), `vec_box`(`Vec<Box<T>>`, `T`의 크기를 알 때. 같은 파일의 `Vec<Box<dyn Shape>>`에는 걸리지 않았다), `redundant_allocation`(`Box<Rc<T>>`처럼 상자 안의 상자), `boxed_local`(상자에 넣을 필요가 없는 지역 값)[^7].
- **성능.** `Box`는 데이터를 힙에 둔다는 것 말고는 따로 드는 비용이 없다[^2]. 그런데 힙에 자리를 받는 것은 스택에 놓는 것보다 느리고, 힙의 값은 주소를 따라가야 읽을 수 있다[^1]. 작은 값을 습관처럼 상자에 넣지 않는다. 뜨거운 반복문 안의 할당은 [성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)의 방법으로 재 보고 줄인다.
- **C와 주고받기.** 크기를 아는 `T`의 `Box<T>`는 C의 `T*`와 모양이 같다[^3]. 그래서 C 라이브러리에 Rust 값을 넘길 때 쓴다. 주소를 넘긴 뒤의 규칙은 [unsafe와 안전한 감싸기](/Hongs_Blog/studies/rust/unsafe-abstractions/)에 있다.

## 연결

- 선수: [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)(주인 한 명), [열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/)(재귀 열거형), [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/)(`dyn`)
- C에서 `malloc`으로 노드를 만들던 [단순 연결 리스트](/Hongs_Blog/studies/data-structures/singly-linked-list/)의 `link` 포인터가 Rust에서는 `Option<Box<Node>>`다. `free`를 부르는 대신 주인이 사라질 때 치워진다: [malloc·free ↔ 소유권과 Drop](/Hongs_Blog/studies/rust/malloc-free-vs-ownership/)
- 주인이 여럿이어야 할 때: [Rc·Arc·Weak](/Hongs_Blog/studies/rust/rc-arc-weak/)
- `Box<dyn Trait>`와 제네릭 중 고르기: [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`Box`를 함수에 넘기면 안의 큰 값이 통째로 복사된다"</div>

틀렸다. 옮겨 가는 것은 스택의 주소 한 칸(8바이트)이고, 힙의 값은 제자리에 있다. C에서 구조체를 값으로 넘기면 통째로 복사되는 것을 떠올리면 그럴듯해 보인다. 실제로 복사가 일어나는 쪽은 상자에 넣지 않은 큰 배열을 값으로 넘길 때다. 확인하는 법: 넘기기 전과 넘긴 뒤에 `as_ptr()`로 힙 주소를 찍어 본다. 검증 코드에서 8KB 배열을 담은 `Box`의 주소가 같았다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 연결 리스트 노드를 `pub struct Node { pub val: i32, pub next: Option<Node> }`로 정의했다. "`Option`이 있으니 끝이 있다"는 생각은 맞는가? 컴파일되는가?</summary>

**답:** 안 된다. E0072 ``recursive type `Node` has infinite size``다. `next: Option<Box<Node>>`로 고친다.<br>
**이유:** `Option<Node>`의 `Some` 칸에는 `Node`가 통째로 들어간다. `Option`은 "값이 없을 수 있음"을 나타낼 뿐, 값을 다른 곳에 두지 않는다. 크기 계산이 여전히 끝나지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 64비트 기계에서 `size_of`의 값을 예측하라: `Box<[i32; 1000]>`, `Option<Box<i32>>`, `Box<str>`, `Box<dyn Display>`.</summary>

**답:** 8, 8, 16, 16.<br>
**이유:** 크기를 아는 타입을 가리키면 주소 하나, 크기를 모르는 타입(`str`, `dyn`)을 가리키면 주소에 길이나 vtable 주소가 붙는다. `None`은 널 주소로 나타내므로 `Option`이 칸을 늘리지 않는다. 검증 코드의 실행 결과와 같다.<br>
**흔한 오답:** `Box<[i32; 1000]>`을 4000이나 4008로 답한다. 배열은 힙에 있고 상자는 주소만 든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 중 `Box`가 필요한 것은? (가) 자식이 둘인 트리 노드의 자식 칸 (나) 서로 다른 도형 타입을 한 `Vec`에 담기 (다) 함수 안에서 잠깐 쓰는 `i32` (라) 여기저기 넘길 `Vec<String>`</summary>

**답:** (가), (나).<br>
**이유:** (가)는 재귀 타입이라 크기를 정하려면 상자가 필요하다. (나)는 크기가 다른 값을 같은 크기의 칸에 담아야 한다. (다)는 스택에 두면 된다. 상자에 넣으면 clippy `boxed_local`이 경고한다. (라)의 `Vec`은 이미 데이터를 힙에 두고 넘길 때는 24바이트만 옮긴다. `Box<Vec<_>>`는 `box_collection` 경고를 받는다.

</details>


[^1]: The Rust Programming Language, 4.1 What Is Ownership? — The Stack and the Heap — https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html
[^2]: The Rust Programming Language, 15.1 Using `Box<T>` to Point to Data on the Heap (세 가지 쓰임, cons list와 E0072, 비재귀 열거형의 크기) — https://doc.rust-lang.org/book/ch15-01-box.html
[^3]: std 문서, Module `std::boxed` (Memory layout: `T: Sized`이면 포인터 하나이고 C의 `T*`와 ABI 호환, 늘 정렬된 널 아닌 포인터, 범위를 벗어나면 안의 값을 drop) — https://doc.rust-lang.org/std/boxed/index.html
[^4]: The Rust Reference, Dynamically Sized Types (DST를 가리키는 포인터는 크기를 아는 타입의 포인터보다 두 배 크고, 길이나 vtable 주소를 함께 담는다) — https://doc.rust-lang.org/reference/dynamically-sized-types.html
[^5]: The Rust Reference, Type layout — Size and alignment("The size of a value is always a multiple of its alignment"), Pointers and references layout, The `Rust` representation(필드 위치는 그 필드 정렬의 배수) — https://doc.rust-lang.org/reference/type-layout.html
[^6]: std 문서, Module `std::option` — Representation (`T`가 `Box<U>`(`U: Sized`)이면 `Option<T>`가 `T`와 같은 크기·정렬·호출 규약) — https://doc.rust-lang.org/std/option/index.html
[^7]: Clippy Lints, `box_collection`(perf, warn), `boxed_local`(perf, warn) — https://rust-lang.github.io/rust-clippy/master/index.html#box_collection . `vec_box`와 `redundant_allocation`은 같은 목록의 린트로, 검증 코드에서 clippy 1.99의 경고문과 "on by default"를 확인했다.
{% endraw %}
