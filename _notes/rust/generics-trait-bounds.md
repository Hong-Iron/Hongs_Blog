---
layout: "note"
title: "제네릭과 트레이트 경계"
display_title: "제네릭과 트레이트 경계 (Generics, Trait Bounds)"
kind: "concept"
kind_label: "정의"
num: "17"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Generics", "Trait Bounds", "제네릭", "트레이트 경계", "타입 매개변수", "Type Parameter", "where 절", "Where Clause", "단형화", "Monomorphization", "정적 디스패치", "Static Dispatch", "const 제네릭", "Const Generics", "Sized", "?Sized"]
description: "타입 자리를 빈칸으로 둔 함수 틀을 한 번만 써 두면, 컴파일러가 실제로 쓰인 타입마다 틀을 찍어 진짜 함수를 만든다. 그래서 실행 속도는 타입마다 손으로 따로 쓴 함수와 같다. 다만 빈칸에 \"크기를 비교할 줄 아는 타입만\"처럼 조건을 달아야 몸통에서 그 값으로 비교 같은 일을 할…"
prev_url: "/studies/rust/java-interface-vs-trait/"
prev_title: "Java 인터페이스 ↔ 트레이트"
next_url: "/studies/rust/trait-objects/"
next_title: "트레이트 객체"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/generics-trait-bounds/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

타입 자리를 빈칸으로 둔 함수 틀을 한 번만 써 두면, 컴파일러가 실제로 쓰인 타입마다 틀을 찍어 진짜 함수를 만든다. 그래서 실행 속도는 타입마다 손으로 따로 쓴 함수와 같다. 다만 빈칸에 "크기를 비교할 줄 아는 타입만"처럼 조건을 달아야 몸통에서 그 값으로 비교 같은 일을 할 수 있다. 대가는 찍어 낸 사본만큼 실행 파일이 커지고 컴파일이 느려지는 것이다.

</div>


## 예시로 보기

정수 목록에서 가장 큰 값을 찾는 함수와 문자 목록에서 가장 큰 값을 찾는 함수는 몸통이 똑같다. 다른 것은 타입 이름뿐이다. 타입마다 함수를 복사해 두면, 버그 하나를 고칠 때도 복사본마다 고쳐야 한다. 타입 자리를 빈칸 `T`로 둔 함수 하나로 합쳐 본다.

```rust
fn largest<T>(list: &[T]) -> &T {
    let mut best = &list[0];
    for item in list {
        if item > best { best = item; }   // 여기서 막힌다
    }
    best
}
```

```
error[E0369]: binary operation `>` cannot be applied to type `&T`
```

`T`에는 어떤 타입이든 올 수 있다. 비교 방법을 정하지 않은 구조체도 온다. 그래서 컴파일러는 `T` 값끼리 `>`를 쓰는 것을 허락하지 않는다. Java에서 `<T>`로만 둔 값에 `doubleValue()`를 부르면 `cannot find symbol`이 나던 것과 같은 이유다([제한된 타입 파라미터와 와일드카드](/Hongs_Blog/studies/java/java-bounded-wildcard/)).

빈칸에 조건을 단다. "`T`에는 크기를 비교할 줄 아는(`PartialOrd`를 구현한) 타입만 온다"고 적으면 몸통에서 `>`를 쓸 수 있다. 이렇게 타입 매개변수에 붙인 트레이트 조건을 트레이트 경계(trait bound)라 부른다[^2].

```rust
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut best = list[0];
    for &item in list {
        if item > best { best = item; }
    }
    best
}

largest(&[34, 50, 25, 100, 65])   // 100
largest(&['y', 'm', 'a', 'q'])    // 'y'
largest(&[1.5, -2.0, 0.25])       // 1.5
```

`+`는 "둘 다"라는 뜻이다. 그럼 `Copy`는 왜 붙었을까? `let mut best = list[0];`은 슬라이스 안의 값을 밖으로 꺼낸다. 복사할 수 없는 타입이면 꺼내는 것이 곧 옮기는 것이라, 슬라이스에 빈자리가 생긴다. 그래서 `Copy`를 빼면 `error[E0508]: cannot move out of type `[T]`, a non-copy slice`다. 값을 꺼내지 않고 참조를 돌려주는 처음 모양(`-> &T`)이라면 `T: PartialOrd`만으로 컴파일된다.

Java 제네릭과 다른 점이 하나 보인다. Java의 빈칸에는 `int` 같은 기본 타입을 바로 넣을 수 없었다([제네릭](/Hongs_Blog/studies/java/java-generics/)). Rust의 `T`에는 `i32`, `char`, `f64`가 감싸지 않은 채로 바로 들어간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 세 결과(`100 y 1.5`), 경계가 없을 때 E0369, `Copy` 없이 값을 꺼낼 때 E0508, `-> &T` 버전이 `PartialOrd`만으로 컴파일되는 것, `where` 절, 조건부 메서드의 E0599, `?Sized`가 없을 때 E0277, const 제네릭 전치와 E0308, LLVM IR에서 센 함수 사본 개수(1개, 6개, 2개, 바깥 6개와 안쪽 1개)를 rustc 1.99로 확인했다 — [17_generics-trait-bounds_verify.rs](/Hongs_Blog/studies/rust/code/17_generics-trait-bounds_verify/)</div>

</div>


## 정의

함수, 구조체, 열거형, `impl` 블록의 이름 뒤 꺾쇠 `<T>` 안에 둔 이름이 타입 매개변수다. 쓰는 쪽이 그 자리를 실제 타입으로 채운다. 경계 `T: A + B`는 "`T` 자리에는 `A`와 `B`를 모두 구현한 타입만 온다"는 약속이다. 그 대가로 몸통에서는 `T` 값에 `A`와 `B`의 메서드를 쓸 수 있다. 경계에 없는 메서드는 쓸 수 없다.

경계를 적는 길은 세 가지다[^2].

| 적는 법 | 예 | 언제 쓰나 |
|---|---|---|
| 꺾쇠 안 | `fn notify<T: Summary>(item: &T)` | 경계가 짧을 때 |
| `impl Trait` | `fn notify(item: &impl Summary)` | 매개변수 하나에 경계 하나일 때. 위 줄을 줄여 쓴 것이다 |
| `where` 절 | 아래 | 경계가 길거나 여러 개일 때 |

`impl Trait`로 쓰면 부르는 쪽이 `notify::<Post>(…)`처럼 타입을 직접 적을 수 없다. 자세한 것은 [트레이트](/Hongs_Blog/studies/rust/traits/)의 `impl Trait` 절에 있다.

### where 절

경계가 늘어나면 함수 이름과 매개변수가 꺾쇠 속에 묻힌다. 경계를 시그니처 뒤의 `where` 절로 옮기면 이름, 매개변수, 반환 타입이 한눈에 보인다[^2].

```rust
fn describe<T, U>(t: &T, u: &U) -> String
where
    T: Display + Clone,
    U: Clone + Debug,
{
    format!("{t} / {u:?}")
}

describe(&"hi", &vec![1, 2])   // "hi / [1, 2]"
```

`where` 절에는 타입 매개변수가 아닌 타입에도 경계를 걸 수 있다. 예: `T::Item: Copy`(반복자의 원소 타입), `String: PartialEq<T>`[^3].

### 경계를 조건으로 메서드 붙이기

`impl` 블록에 경계를 달면, 그 경계를 채운 타입에만 메서드가 생긴다[^2].

```rust
struct Pair<T> { a: T, b: T }

impl<T> Pair<T> {
    fn new(a: T, b: T) -> Self { Pair { a, b } }          // 모든 T
}

impl<T: Display + PartialOrd> Pair<T> {
    fn show_larger(&self) -> String { /* … */ }           // 출력·비교가 되는 T만
}

Pair::new(3, 9).show_larger()   // "큰 쪽 b = 9"
```

`Display`가 없는 `NoDisplay`로 만든 `Pair<NoDisplay>`에서 `show_larger`를 부르면 이렇게 막힌다.

```
error[E0599]: the method `show_larger` exists for struct `Pair<NoDisplay>`, but its trait bounds were not satisfied
```

메서드는 있는데 경계를 못 채웠다고 정확히 알려 준다.

### 숨은 경계 Sized와 ?Sized

크기를 컴파일할 때 아는 타입을 `Sized`라 한다. `i32`는 4바이트, `String`은 늘 같은 크기다. 반면 `str`(글자 수가 값마다 다른 문자열 본체), `[u8]`, `dyn Display`는 크기를 모른다. 타입 매개변수에는 적지 않아도 `Sized` 경계가 붙어 있다. 이 숨은 경계는 `?Sized`로 푼다[^4].

```rust
fn byte_len<T: AsRef<[u8]>>(x: &T) -> usize { x.as_ref().len() }
byte_len("hi")
// error[E0277]: the size for values of type `str` cannot be known at compilation time
```

`"hi"`는 `&str`이다. 매개변수가 `&T`이므로 `T`는 `str`이 되는데, `str`은 `Sized`가 아니다. `T: AsRef<[u8]> + ?Sized`로 바꾸면 컴파일된다. 값은 늘 참조 `&T` 뒤에 있으니 크기를 몰라도 문제가 없다.

같은 방법으로 `dyn` 값도 받는다.

```rust
fn shout<T: Display + ?Sized>(x: &T) -> String { format!("{x}!") }

let d: &dyn Display = &5;
shout("hi")   // "hi!"   (T = str)
shout(d)      // "5!"    (T = dyn Display)
```

`dyn Display`가 무엇인지는 [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/)에 있다.

### const 제네릭

타입이 아니라 값을 빈칸으로 둘 수도 있다. 쓸 수 있는 값의 타입은 정수 타입, `char`, `bool`뿐이다[^3]. 주로 배열 길이를 타입에 넣을 때 쓴다.

```rust
fn sum_array<const N: usize>(xs: [i32; N]) -> i32 { xs.iter().sum() }
sum_array([1, 2, 3])   // 6
sum_array([10; 5])     // 50

struct Matrix<const R: usize, const C: usize> { cells: [ [i32; C]; R ] }   // C칸짜리 행이 R개

impl<const R: usize, const C: usize> Matrix<R, C> {
    fn transpose(&self) -> Matrix<C, R> { /* … */ }   // R행 C열 → C행 R열
}
```

행이 `[1, 2, 3]`, `[4, 5, 6]`인 2행 3열 행렬을 전치하면 행이 `[1, 4]`, `[2, 5]`, `[3, 6]`인 3행 2열 행렬이 된다. 행과 열 수가 타입에 들어 있으므로, `Matrix<2, 3>`을 `Matrix<3, 2>` 자리에 그대로 넘기면 `error[E0308]: mismatched types`로 컴파일 때 막힌다. 실행 중에 길이를 검사할 필요가 없다.

## 단형화: 타입마다 사본을 찍는다

컴파일러는 제네릭 함수가 불린 곳을 모두 찾아, 거기 쓰인 타입마다 제네릭이 아닌 함수를 하나씩 만든다. 이것을 단형화(monomorphization)라 부른다. 여러 모양을 받던 코드를 한 모양짜리 코드 여럿으로 바꾼다는 뜻이다. Book의 예로는 `Option<i32>`와 `Option<f64>`를 쓰면 컴파일러가 `Option_i32`, `Option_f64` 같은 두 정의로 펼친다. 그래서 실행할 때는 손으로 타입마다 따로 쓴 것과 똑같이 돌고, 제네릭 때문에 드는 실행 비용이 없다[^1].

어느 몸통을 부를지 컴파일할 때 이미 정해지므로 이런 호출을 정적 디스패치(static dispatch)라 부른다[^5]. 컴파일러는 몸통을 아니까 호출 자리에 몸통을 펼쳐 넣을(인라인) 수 있다.

검증 코드는 `sum_sq<T: Copy + Into<f64>>`를 여러 방식으로 부르고, 최적화한 LLVM IR(컴파일러 안쪽의 중간 코드)에서 `sum_sq` 정의를 셌다. 사본이 부르는 쪽에 녹아 사라지지 않도록 `#[inline(never)]`로 인라인은 막았다.

| 부른 타입 | 생긴 `sum_sq` 정의 |
|---|---|
| `u8` 하나 | 1개 |
| `u8`, `u16`, `u32`, `i8`, `i16`, `i32` | 6개 |
| `u8`, `u16`, `u8` (세 번 부름) | 2개 |

```
소스                          컴파일 뒤
sum_sq(&[u8])   ──────────▶  sum_sq::<u8>   ◀── 같은 타입은 사본 하나를 같이 쓴다
sum_sq(&[u16])  ──────────▶  sum_sq::<u16>
sum_sq(&[u8])   ─────────────────┘
```

사본 수는 부른 횟수가 아니라 서로 다른 타입의 수다.

### 대가: 실행 파일 크기와 컴파일 시간

사본마다 기계어가 따로 생기고, 컴파일러는 사본마다 최적화를 다시 한다. [19_generics-vs-trait-objects_bench.rs](/Hongs_Blog/studies/rust/code/19_generics-vs-trait-objects_bench/)는 문자열을 몇 개 만드는 함수 `report`를 타입 40개로 불러 봤다. 이 기계(aarch64 macOS, rustc 1.99, `opt-level=2`)에서 잰 값이다.

| `report`를 만든 방식 | 정의 수 | 목적 파일 | 컴파일 시간(3번 중 가장 짧은 값) |
|---|---|---|---|
| 제네릭 `report<T: Area>(x: &T)` | 40개 | 82,088바이트 | 약 245ms |
| `report(x: &dyn Area)` | 1개 | 30,200바이트 | 약 85ms |

몸통이 크고 여러 타입으로 불리는 함수라면 사본을 줄일 수 있다. 바깥 함수는 제네릭으로 두고 타입을 바꾸는 일만 하게 한 뒤, 무거운 몸통은 제네릭이 아닌 안쪽 함수 하나에 둔다.

```rust
fn word_count<S: AsRef<str>>(s: S) -> usize {
    fn inner(s: &str) -> usize {          // 제네릭이 아니다: 사본이 하나뿐
        s.split_whitespace().filter(|w| w.len() > 3).count() + s.lines().count()
    }
    inner(s.as_ref())                     // 바깥 사본에는 변환과 호출만 남는다
}
```

`&str`, `String`, `&String`, `Box<str>`, `Cow<str>`, `Rc<str>` 여섯 타입으로 불렀더니 바깥 사본은 6개, `inner`는 1개였다.

## 활용

- **받는 타입을 넓히기.** 표준 라이브러리의 `File::open`은 `pub fn open<P: AsRef<Path>>(path: P)`다[^6]. 그래서 `&str`, `String`, `PathBuf`를 모두 받는다. 내 API도 "경로로 볼 수 있는 것", "문자열로 바꿀 수 있는 것"(`impl Into<String>`)처럼 경계로 받으면 부르는 쪽이 변환을 덜 쓴다.
- **구조체 정의에는 경계를 달지 않는다.** Rust API 지침(C-STRUCT-BOUNDS)은 `struct Bad<T: Clone + Debug + PartialEq>`보다 `#[derive(Clone, Debug, PartialEq)] struct Good<T>`를 권한다. `derive`가 만드는 `impl`이 이미 "`T`가 그 트레이트를 구현할 때만"이라는 경계를 가지기 때문이다. 예외는 셋이다. 구조체가 트레이트의 연관 타입을 쓸 때, 경계가 `?Sized`일 때, `Drop` 구현이 경계를 요구할 때다[^7]. 경계는 그것이 필요한 `impl` 블록과 함수에 단다.
- **clippy.** `multiple_bound_locations`(style, 기본 경고)는 한 타입 매개변수의 경계를 꺾쇠 안과 `where` 절에 나눠 적은 것을 알린다[^8]. 한 곳에 모은다.
- **빌드 시간이 길어질 때.** 큰 제네릭 함수가 많은 타입으로 불리면 위의 표처럼 컴파일 시간과 크기가 사본 수에 비례해 는다. 안쪽 함수로 빼거나, 속도가 덜 중요한 곳은 `&dyn Trait`로 바꾼다. 고르는 기준은 [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)에 있다. 실제로 재는 법은 [성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)에 있다.
- **흔한 실수.**
  - `&str`을 받으려다 E0277을 만난다. `T`가 `str`이 되는 자리에는 `?Sized`가 필요하다.
  - 몸통에서 쓰지 않는 경계까지 단다. 경계가 많을수록 부를 수 있는 타입이 줄어든다. 몸통이 실제로 쓰는 것만 단다.

## 연결

- 선수: [트레이트](/Hongs_Blog/studies/rust/traits/)(경계에 쓰는 것이 트레이트다)
- Java의 같은 생각: [제네릭](/Hongs_Blog/studies/java/java-generics/), `<T extends Number>`는 [제한된 타입 파라미터와 와일드카드](/Hongs_Blog/studies/java/java-bounded-wildcard/). Java는 경계를 상속 관계(`extends`)로 적고, Rust는 구현한 트레이트로 적는다.
- 상태를 타입 매개변수로 올리는 `Door<S>`: [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)
- 실행 중에 몸통을 고르는 다른 길: [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/). 둘을 가르는 법: [제네릭과 트레이트 객체 비교](/Hongs_Blog/studies/rust/generics-vs-trait-objects/)
- 경계를 가장 많이 쓰는 곳: [클로저](/Hongs_Blog/studies/rust/closures/)(`F: Fn(i32) -> i32`), [반복자](/Hongs_Blog/studies/rust/iterators/)(`impl Iterator<Item = u32>`), [꼭 구현할 표준 트레이트](/Hongs_Blog/studies/rust/standard-traits/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"제네릭 함수는 실행 중에 타입을 확인하므로 보통 함수보다 느리다"</div>

틀렸다. 컴파일러가 쓰인 타입마다 사본을 만들고, 어느 몸통을 부를지도 컴파일 때 정한다. 실행 중에 확인할 타입이 남아 있지 않다. Java에서 `Object`로 받아 두고 꺼낼 때 변환하던 기억 때문에 그럴듯해 보인다. 비용은 실행 속도가 아니라 실행 파일 크기와 컴파일 시간에 있다. 확인하는 법: 서로 다른 타입 6개로 부른 `sum_sq`가 LLVM IR에 정의 6개로 남는다. Book도 단형화 덕분에 제네릭에 실행 비용이 없다고 적는다[^1].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음은 컴파일되는가? 안 되면 오류 코드와 이유, 고치는 법을 쓰라.</summary>

```rust
fn largest<T>(list: &[T]) -> &T {
    let mut best = &list[0];
    for item in list { if item > best { best = item; } }
    best
}
```
**답:** 안 된다. `error[E0369]: binary operation `>` cannot be applied to type `&T``.<br>
**이유:** `T`에는 비교 방법이 없는 타입도 올 수 있다. 컴파일러는 경계에 적힌 것만 `T`에 쓰게 한다. `fn largest<T: PartialOrd>(list: &[T]) -> &T`로 경계를 달면 컴파일된다. 참조를 돌려주므로 `Copy`는 필요 없다.<br>
**흔한 오답:** "`T: Copy`를 달면 된다." `Copy`는 비교를 주지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** `fn sum_sq<T: Copy + Into<f64>>(xs: &[T]) -> f64`를 `sum_sq(a) + sum_sq(b) + sum_sq(c)`로 부른다. `a`와 `c`는 `&[u8]`, `b`는 `&[u16]`이다. 최적화한 결과에 `sum_sq` 정의는 몇 개 생기는가? (인라인은 막아 두었다.)</summary>

**답:** 2개(`u8`용, `u16`용).<br>
**이유:** 사본은 서로 다른 타입마다 하나 생긴다. 같은 `u8`로 두 번 부르면 한 사본을 같이 쓴다. 검증 코드의 LLVM IR에서 센 값도 2다.<br>
**흔한 오답:** 3개. 부른 횟수가 아니라 타입 수를 센다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** `fn byte_len<T: AsRef<[u8]>>(x: &T) -> usize`에 `byte_len("hi")`를 넣으면 왜 E0277이 나는가? 경계를 어떻게 고치는가?</summary>

**답:** `"hi"`는 `&str`이라 `T`가 `str`이 된다. `str`은 크기를 컴파일할 때 모르는 타입인데, 타입 매개변수에는 `Sized` 경계가 숨어 있다. `T: AsRef<[u8]> + ?Sized`로 숨은 경계를 푼다.<br>
**이유:** 값은 `&T` 참조 뒤에만 있으므로 `T`의 크기를 몰라도 함수를 만들 수 있다. 오류 문장은 `the size for values of type `str` cannot be known at compilation time`이다.

</details>


[^1]: The Rust Programming Language, 10.1 Generic Data Types — Performance of Code Using Generics — https://doc.rust-lang.org/book/ch10-01-syntax.html
[^2]: The Rust Programming Language, 10.2 Defining Shared Behavior with Traits (Trait Bound Syntax, Multiple Trait Bounds with the + Syntax, Clearer Trait Bounds with where Clauses, Using Trait Bounds to Conditionally Implement Methods) — https://doc.rust-lang.org/book/ch10-02-traits.html
[^3]: The Rust Reference, Generic parameters — Const generics, Where clauses — https://doc.rust-lang.org/reference/items/generics.html
[^4]: The Rust Reference, Special types and traits — Sized (Type parameters (except Self in traits) are Sized by default …, relaxed by using the special ?Sized bound) — https://doc.rust-lang.org/reference/special-types-and-traits.html
[^5]: The Rust Programming Language, 18.2 Using Trait Objects to Abstract over Shared Behavior — Performing Dynamic Dispatch (static dispatch) — https://doc.rust-lang.org/book/ch18-02-trait-objects.html
[^6]: std 문서, Struct `std::fs::File` — `open` — https://doc.rust-lang.org/std/fs/struct.File.html
[^7]: Rust API Guidelines, Future proofing — Data structures do not duplicate derived trait bounds (C-STRUCT-BOUNDS) — https://rust-lang.github.io/api-guidelines/future-proofing.html
[^8]: Clippy Lints, multiple_bound_locations — https://rust-lang.github.io/rust-clippy/master/index.html
{% endraw %}
