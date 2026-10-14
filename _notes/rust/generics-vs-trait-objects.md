---
layout: "note"
title: "제네릭과 트레이트 객체 비교"
display_title: "제네릭과 트레이트 객체 비교"
kind: "concept"
kind_label: "비교"
num: "19"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Generics vs Trait Objects", "정적 디스패치와 동적 디스패치", "Static vs Dynamic Dispatch", "impl Trait vs dyn Trait", "열거형 디스패치", "Enum Dispatch"]
description: "둘 다 \"이 트레이트를 구현한 아무 타입\"을 받는 방법이다. 가르는 질문은 \"어느 타입인지가 컴파일할 때 정해지는가, 실행 중에 정해지는가\"다. 제네릭은 컴파일러가 타입마다 함수 사본을 찍어 두고 부를 몸통을 미리 정한다. 트레이트 객체는 사본 하나만 두고, 부를 때마다 값 옆의 …"
prev_url: "/studies/rust/trait-objects/"
prev_title: "트레이트 객체"
next_url: "/studies/rust/closures/"
next_title: "클로저"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/generics-vs-trait-objects/"
---
{% raw %}
둘 다 "이 트레이트를 구현한 아무 타입"을 받는 방법이다. 가르는 질문은 "**어느 타입인지가 컴파일할 때 정해지는가, 실행 중에 정해지는가**"다. 제네릭은 컴파일러가 타입마다 함수 사본을 찍어 두고 부를 몸통을 미리 정한다[^2]. 트레이트 객체는 사본 하나만 두고, 부를 때마다 값 옆의 표(vtable)를 보고 몸통을 고른다. Book은 한 번에 한 타입만 담는 목록이라면 제네릭이 낫고, 여러 타입을 한 목록에 담아야 하면 트레이트 객체를 쓰라고 정리한다[^1].

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (가) 설정 파일을 여는 함수가 `&str`, `String`, `PathBuf` 가운데 무엇이든 받게 하고 싶다. (나) GUI 화면이 버튼, 글상자, 그리고 라이브러리 사용자가 나중에 만들 위젯까지 한 목록에 담아 차례로 그린다. 각각 제네릭과 트레이트 객체 중 무엇이 맞는가?</summary>

**답:** (가)는 제네릭이다. 표준 라이브러리의 `File::open`도 `open<P: AsRef<Path>>(path: P)`다[^3]. 부르는 자리마다 넘기는 타입이 정해져 있다. 제네릭 바깥 함수는 `as_ref()`로 바꾸는 일만 하고 무거운 몸통은 안쪽 함수 하나에 두면, 사본이 늘어도 부담이 작다([제네릭과 트레이트 경계](/Hongs_Blog/studies/rust/generics-trait-bounds/)의 안쪽 함수 기법). (나)는 트레이트 객체다. `Vec<Box<dyn Draw>>`라야 버튼과 글상자를 한 목록에 담는다. `Screen<T: Draw>`로 만들면 한 화면에 한 종류만 담긴다[^1].<br>
**이유:** (가)는 한 호출 안에 타입이 하나다. (나)는 한 목록 안에 타입이 여럿이고, 어떤 타입이 올지 라이브러리를 컴파일할 때 모른다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (다) 이미지 필터가 픽셀 수백만 개마다 `Pixel` 트레이트의 메서드 하나를 부른다. 프로그램이 쓰는 픽셀 타입은 하나로 정해져 있다. (라) 웹 서비스가 시작할 때 설정을 읽어 저장소를 SQLite와 메모리 중 하나로 고르고, 핸들러 여러 개가 그 저장소를 같이 쓴다. 각각 무엇이 맞는가?</summary>

**답:** (다)는 제네릭이다. 몸통이 작고 호출이 아주 많은 곳이라, 컴파일러가 몸통을 펼쳐 넣고 루프를 더 빠르게 바꿀 수 있어야 한다. 아래 측정에서 정수 넓이 합은 제네릭이 dyn보다 약 4배 빨랐다. (라)는 트레이트 객체(`Arc<dyn Repo + Send + Sync>`)가 자연스럽다. 저장소는 실행 중에 정해지고, 핸들러는 사본 하나로 둘 중 무엇이든 쓴다.<br>
**이유:** (라)에서 간접 호출 한 번의 비용은 아래 측정으로 원소 하나에 1ns가 안 된다. 데이터베이스 요청 한 번에 비하면 묻힌다. 선택지가 둘로 정해져 있으니 열거형도 맞는 답이다(아래 "둘 다 아닐 때").<br>
**흔한 오답:** (라)를 제네릭 `AppState<R: Repo>`로 만든다. 될 수는 있지만 `R`이 핸들러와 라우터 타입 전체로 퍼지고, 실행 중에 고른 값을 담으려면 결국 두 경우를 따로 컴파일해야 한다.

</details>


## 결정적 차이

| | 제네릭 (`T: Trait`, `impl Trait`) | 트레이트 객체 (`dyn Trait`) |
|---|---|---|
| 몸통을 고르는 때 | 컴파일할 때(정적 디스패치)[^1] | 실행 중에 vtable을 보고(동적 디스패치)[^1] |
| 한 목록에 섞어 담기 | 안 된다. `all(vec![Circle, Square])`는 E0308 | 된다. `Vec<Box<dyn Shape>>` |
| 담는 쪽 타입 | `Screen<T>`처럼 바깥 타입에도 `T`가 붙는다 | `Screen` 하나 |
| 함수 사본(타입 6개로 부름) | 6개 | 1개 |
| 목적 파일(타입 40개로 부름) | 82,088바이트 | 30,200바이트 |
| 컴파일 시간(타입 40개로 부름) | 약 245ms | 약 85ms |
| 정수 넓이 합, 원소 200만 개 | 약 0.41ms | 약 1.59ms |
| 실수 넓이 합, 원소 200만 개 | 약 1.48ms | 약 1.59ms |
| 가리키는 포인터 | `&T` 8바이트 | `&dyn Trait` 16바이트 |
| 트레이트에 거는 조건 | 없다 | dyn 호환이어야 한다([트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/)) |

선택을 바꾸는 줄은 둘째와 일곱째다. 섞어 담아야 하면 트레이트 객체밖에 없다. 몸통이 작은 메서드를 아주 많이 부르면 제네릭이 빠르다. 나머지 줄은 둘 다 될 때 저울질하는 값이다.

숫자는 모두 이 기계(aarch64 macOS, rustc 1.99)에서 잰 것이다. 실행 시간은 `opt-level=3`으로 만든 프로그램을 7번 돌린 것 가운데 가장 짧은 값이다. 목적 파일 크기와 컴파일 시간은 `opt-level=2`로 3번 컴파일한 것 가운데 가장 짧은 값이다. 여러 번 되풀이해 돌리면 같은 칸이 20%까지 오르내렸다. 기계가 바뀌면 배수도 바뀐다. 내 코드의 결정은 내 코드로 재야 한다([성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)).

### 실행 시간 전체

넓이를 모두 더하는 같은 일을 여섯 가지로 했다. 원은 넓이 $$3r^2$$, 정사각형은 $$s^2$$이다.

| 방식 | 실수(`f64`) 합 | 정수(`u64`) 합 |
|---|---|---|
| 제네릭 `Vec<Circle>` | 1,483µs | 406µs |
| `&dyn Shape` (값은 한 `Vec`에 붙어 있음) | 1,592µs | 1,589µs |
| `Box<dyn Shape>` (값마다 따로 힙) | 1,592µs | 1,592µs |
| 열거형 `Vec<AnyShape>` | 1,513µs | 550µs |
| `Box<dyn Shape>`, 원과 정사각형을 번갈아 섞음 | 2,912µs | 2,911µs |
| 열거형, 원과 정사각형을 번갈아 섞음 | 1,514µs | 549µs |

정수 합에서는 제네릭이 dyn보다 약 3.9배 빨랐다. 원소 하나로 나누면 차이는 약 0.6ns다. 실수 합에서는 네 방식이 1.4~1.8ms 안에 몰렸고, 돌릴 때마다 그 안의 순서가 바뀌었다.

왜 실수 합에서는 차이가 사라질까? 실수 덧셈은 묶는 순서를 바꾸면 결과가 달라질 수 있다. `(0.1 + 0.2) + 0.3`은 `0.6000000000000001`이고 `0.1 + (0.2 + 0.3)`은 `0.6`이다. 그래서 컴파일러는 실수 합을 적힌 순서대로 하나씩 더한다. 같은 모양의 합 루프를 어셈블리로 보면, 정수 합은 레지스터 네 개(`x8`, `x10`, `x11`, `x12`)에 나눠 쌓고 실수 합은 레지스터 하나(`d0`)에 차례로 쌓았다. 실수 쪽은 덧셈마다 앞 덧셈을 기다리는 한 줄짜리 사슬이 시간을 정한다. 그 사슬이 네 방식 모두에 똑같이 있어서 dyn의 간접 호출 비용이 대부분 그 뒤에 가려졌다. 정수 쪽에서 제네릭은 몸통을 펼쳐 넣은 뒤 합을 네 갈래로 나눠 더할 수 있었다. dyn은 몸통을 모르니 원소마다 vtable을 거쳐 함수를 한 번씩 불러야 한다. 그 호출이 시간을 정해서, dyn은 정수 합과 실수 합이 똑같이 약 1.59ms였다. Book이 동적 디스패치가 인라인을 막아 일부 최적화를 막는다고 적은 것이 이 차이다[^1].

섞은 `Box<dyn Shape>`는 한 가지 타입만 담았을 때보다 약 1.8배 느렸다. 한 가지 타입만 있으면 간접 호출이 매번 같은 몸통으로 가지만, 섞으면 원소마다 가는 곳이 바뀐다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: E0308(제네릭 `Vec`에 두 타입), LLVM IR의 `total` 정의 6개 대 1개, `report` 정의 40개 대 1개, 목적 파일 크기, 원만 담은 네 방식과 섞어 담은 두 방식이 각각 같은 합을 낸다는 것, 어셈블리에서 합을 쌓는 레지스터 수(정수 4개, 실수 1개), 실수 덧셈의 순서 차이를 확인하고 시간을 쟀다 — [19_generics-vs-trait-objects_bench.rs](/Hongs_Blog/studies/rust/code/19_generics-vs-trait-objects_bench/)</div>

</div>


## 둘 다 아닐 때

담을 타입이 컴파일할 때 정해진 몇 가지뿐이면 열거형이 셋째 길이다. 변형마다 한 타입을 담고, 메서드는 `match`로 가른다.

```rust
enum AnyShape { C(Circle), S(Square) }

impl AnyShape {
    fn area(&self) -> f64 {
        match self {
            AnyShape::C(c) => c.area(),
            AnyShape::S(s) => s.area(),
        }
    }
}
```

Book도 고정된 타입 몇 가지를 한 목록에 담을 때는 열거형이 충분히 좋은 방법이라고 적는다[^1]. 위 측정에서 열거형은 섞어 담았을 때도 정수 합 549µs로, 섞은 `Box<dyn Shape>`(2,911µs)보다 약 5배 빨랐다. 원소마다 힙에 따로 할당하지 않고, `match`가 변형을 빠짐없이 다뤘는지 컴파일러가 검사한다는 장점도 있다([열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/)).

대가는 확장이다. 새 도형을 더하려면 열거형과 모든 `match`를 고쳐야 한다. 라이브러리 사용자는 내 열거형에 변형을 더할 수 없다. 그래서 (나)의 GUI처럼 사용자가 타입을 더해야 하면 열거형은 안 된다. 또 열거형 하나의 크기는 가장 큰 변형이 정한다. 한 변형만 아주 크면 clippy `large_enum_variant`(perf, 기본 경고)가 알린다[^4]. 그 변형의 내용을 `Box`로 감싸 줄인다.

| | 제네릭 | 트레이트 객체 | 열거형 |
|---|---|---|---|
| 섞어 담기 | 안 된다 | 된다 | 된다 |
| 나중에 타입 더하기 | 된다 | 된다(남의 크레이트도) | 열거형을 고쳐야 한다 |
| 몸통 펼쳐 넣기 | 된다 | 안 된다 | 된다 |

다른 길도 있다. 동작이 함수 하나뿐이면 트레이트를 만들지 않고 클로저나 함수를 넘긴다([클로저](/Hongs_Blog/studies/rust/closures/)). 한 함수가 늘 한 타입만 돌려준다면 반환 자리 `impl Trait`로 타입 이름만 숨긴다([트레이트](/Hongs_Blog/studies/rust/traits/)).

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 계산기의 식 트리를 만든다. 마디는 숫자, 더하기, 곱하기 세 종류뿐이고 늘릴 계획이 없다. 마디마다 `eval`을 부른다. 제네릭, 트레이트 객체, 열거형 중 무엇을 쓰겠는가? 나머지 둘이 왜 덜 맞는지도 쓰라.</summary>

**답:** 열거형이다. `enum Expr { Num(f64), Add(Box<Expr>, Box<Expr>), Mul(Box<Expr>, Box<Expr>) }`처럼 두고 `eval`을 `match`로 쓴다. 자기를 품는 자리는 `Box`로 감싸야 크기가 정해진다([Box와 힙](/Hongs_Blog/studies/rust/box-heap/)).<br>
**이유:** 제네릭은 한 트리 안에 숫자 마디와 더하기 마디가 섞이므로 맞지 않는다. 트레이트 객체(`Box<dyn Node>`)도 되지만, 종류가 셋으로 정해져 있으니 확장성이라는 장점을 쓸 일이 없다. 그러면서 마디마다 간접 호출을 낸다. 열거형은 섞어 담고, 몸통을 펼쳐 넣을 수 있으며, 새 종류를 빠뜨린 `match`를 컴파일러가 잡아 준다.<br>
**흔한 오답:** "섞이니까 무조건 `dyn`이다." 섞인 타입이 정해진 몇 가지라면 열거형도 섞어 담는다.

</details>


[^1]: The Rust Programming Language, 18.2 Using Trait Objects to Abstract over Shared Behavior (Defining a Trait for Common Behavior: fixed set of types, homogeneous collections; Performing Dynamic Dispatch: runtime cost, prevents inlining) — https://doc.rust-lang.org/book/ch18-02-trait-objects.html
[^2]: The Rust Programming Language, 10.1 Generic Data Types — Performance of Code Using Generics — https://doc.rust-lang.org/book/ch10-01-syntax.html
[^3]: std 문서, Struct `std::fs::File` — `open` — https://doc.rust-lang.org/std/fs/struct.File.html
[^4]: Clippy Lints, large_enum_variant (Enum size is bounded by the largest variant) — https://rust-lang.github.io/rust-clippy/master/index.html
{% endraw %}
