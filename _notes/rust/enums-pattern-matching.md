---
layout: "note"
title: "열거형과 패턴 매칭"
display_title: "열거형과 패턴 매칭 (Enums and Pattern Matching)"
kind: "concept"
kind_label: "자료구조"
num: "11"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Enums and Pattern Matching", "enum", "열거형", "match", "패턴", "Pattern", "매치 가드", "Match Guard", "if let", "let else", "let-else", "let 체인", "Let Chains", "matches!", "non_exhaustive", "태그 있는 공용체", "Tagged Union", "합 타입", "Sum Type"]
description: "열거형은 \"이것 아니면 저것\" 중 하나인 값이다. 택배 상자에 \"깨지기 쉬움\", \"냉장\" 같은 딱지가 붙어 있고 딱지마다 안에 든 물건이 다른 것과 같다. match로 딱지를 보고 갈래를 나누는데, 컴파일러가 빠뜨린 딱지가 없는지 검사해 준다. 단, 로 \"나머지 전부\"를 받아 버리…"
prev_url: "/studies/rust/structs-methods/"
prev_title: "구조체와 메서드"
next_url: "/studies/rust/option-result/"
next_title: "Option과 Result"
math: false
mermaid: false
code_count: 1
permalink: "/studies/rust/enums-pattern-matching/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

열거형은 "이것 아니면 저것" 중 하나인 값이다. 택배 상자에 "깨지기 쉬움", "냉장" 같은 딱지가 붙어 있고 딱지마다 안에 든 물건이 다른 것과 같다. `match`로 딱지를 보고 갈래를 나누는데, 컴파일러가 빠뜨린 딱지가 없는지 검사해 준다. 단, `_`로 "나머지 전부"를 받아 버리면 나중에 딱지가 새로 생겨도 컴파일러가 알려 주지 못한다.

</div>


## 예시로 보기

도형이 원 아니면 직사각형이라고 하자. 원에는 반지름 하나, 직사각형에는 가로와 세로가 필요하다. 구조체 하나로 만들면 `kind`, `radius`, `width`, `height`를 다 넣고, 원일 때 `width`는 무시하자고 약속해야 한다. 약속은 깨지기 쉽다.

열거형은 갈래(변형, variant)마다 다른 데이터를 담는다[^1].

```rust
enum Shape {
    Circle(f64),        // 반지름
    Rect(f64, f64),     // 가로, 세로
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => 3.0 * r * r,
            Shape::Rect(w, h) => w * h,
        }
    }
}
```

`match`는 위에서부터 패턴을 맞춰 보고, 처음 맞는 갈래를 실행한다. `Shape::Circle(r)`이라는 패턴은 "원이면 안의 값을 `r`이라 부르겠다"는 뜻이다. 원이 아닌데 `r`을 꺼낼 길은 없다.

변형 모양은 네 가지가 다 된다. 데이터 없음, 이름 붙은 필드, 값 하나, 값 여럿이다[^1].

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(u8, u8, u8),
}
```

### C의 공용체, Java의 enum과 무엇이 다른가

C의 공용체(union)는 필드들이 같은 자리를 함께 쓴다. 그래서 크기는 가장 큰 필드만큼이다. 지금 어느 필드가 들어 있는지는 적어 두지 않는다[^2]. 프로그래머가 따로 `kind` 변수를 들고 다니며 맞춰야 한다. Rust에도 `union`이 있지만, 엉뚱한 필드를 읽을 수 있으므로 필드를 읽으려면 `unsafe`가 필요하다(E0133)[^2].

Rust 열거형은 공용체에 "지금 어느 변형인가"를 적는 칸(태그)을 컴파일러가 붙인 것이다. 이 기계에서 크기를 재 보면 이렇다.

```
union ShapeData { circle: f64, rect: [f64; 2] }   16바이트  [ 데이터 16 ]
enum Shape { Circle(f64), Rect(f64, f64) }        24바이트  [ 태그 8 | 데이터 16 ]
```

태그는 1바이트면 충분하지만, 뒤의 `f64`를 8바이트 경계에 맞추느라 8바이트를 차지한다. 태그를 컴파일러가 관리하므로 `match` 없이 데이터를 꺼낼 수 없다.

Java의 enum은 정해진 상수 몇 개 중 하나다. 필드를 둘 수 있지만, 필드는 enum 타입에 한 번 선언되고 모든 상수가 같은 필드를 가진다. 값은 상수를 만들 때 한 번 정해진다[^3]. Rust 변형은 변형마다 필드의 개수와 타입이 다르고, 값을 실행 중에 새로 만든다. `Message::Write(String::from("hi"))`처럼 매번 다른 글을 담는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 크기 16과 24, union 읽기 E0133, 아래의 E0004와 E0308, let 체인의 에디션 제한, `#[non_exhaustive]` 동작(크레이트 둘을 따로 컴파일), clippy 린트를 확인했다 — [11_enums-pattern-matching_verify.rs](/Hongs_Blog/studies/rust/code/11_enums-pattern-matching_verify/)</div>

</div>


## 빠짐없는 match

`match`는 가능한 값을 모두 덮어야 컴파일된다[^4]. 변형 하나를 빠뜨리면 이렇게 막힌다.

```text
error[E0004]: non-exhaustive patterns: `S::C` not covered
```

이 검사 덕분에 열거형에 변형을 새로 넣으면, 그 열거형을 `match`하는 모든 곳이 컴파일 오류로 드러난다. 고칠 곳을 컴파일러가 목록으로 준다.

"나머지 전부"는 `_`나 이름 하나로 받는다. 이 갈래는 맨 끝에 둔다. 패턴은 위에서부터 맞춰 보므로, 앞에 두면 뒤 갈래는 영영 실행되지 않는다[^4].

## 패턴으로 쓸 수 있는 것

| 문법 | 예 | 뜻 |
|---|---|---|
| 값 | `Message::Move { x: 0, y }` | `x`가 0일 때만 맞고, `y`는 꺼낸다 |
| 여럿 중 하나 | `1 \| 2` | 1이나 2 |
| 범위 | `90..=100` | 90 이상 100 이하(숫자와 `char`만)[^5] |
| 나머지 무시 | `(first, .., last)` | 가운데를 건너뛴다[^5] |
| 가드 | `Some(x) if x % 2 == 0` | 패턴이 맞고 조건도 참일 때 |
| `@` 바인딩 | `s @ 90..=100` | 범위를 검사하면서 그 값을 `s`라 부른다[^5] |

```rust
fn grade(score: u32) -> String {
    match score {
        s @ 90..=100 => format!("A({s})"),
        s @ 80..=89 => format!("B({s})"),
        0..=79 => "C".to_string(),
        s => format!("잘못된 점수 {s}"),
    }
}
```

가드는 조심해야 한다. 컴파일러는 가드의 조건식을 빠짐없음 검사에 넣지 않는다[^5]. `Some(n) if n >= 0`과 `Some(n) if n < 0`은 사람이 보기엔 모든 정수를 덮지만, 컴파일러는 E0004를 낸다. 마지막 갈래는 가드 없는 `Some(n)`으로 쓴다.

## 짧게 쓰는 네 가지

갈래 하나만 관심 있을 때 `match`는 길다. 그래서 줄인 문법이 있다.

**`if let`.** 패턴 하나가 맞을 때만 실행하고 나머지는 무시한다. `match`를 짧게 쓴 것이고, 대신 빠짐없음 검사를 잃는다[^6].

```rust
if let Some(max) = config_max {
    println!("최대 {max}");
}
```

**`let ... else`** (Rust 1.65부터). 패턴이 맞으면 꺼낸 이름을 바깥에서 계속 쓰고, 안 맞으면 `else`로 간다. `else`는 반드시 빠져나가야 한다. `return`, `break`, `continue`, `panic!` 중 하나로 끝나야 한다[^7]. 안 그러면 이렇게 막힌다.

```text
error[E0308]: `else` clause of `let...else` does not diverge
```

```rust
fn parse_pair(line: &str) -> Result<(String, i64), String> {
    let Some((key, value)) = line.split_once('=') else {
        return Err(format!("'=' 없음: {line}"));
    };
    let Ok(n) = value.trim().parse::<i64>() else {
        return Err(format!("숫자 아님: {}", value.trim()));
    };
    Ok((key.trim().to_string(), n))
}
```

`if let`으로 쓰면 성공 경로가 점점 오른쪽으로 들여 써진다. `let ... else`는 실패를 위에서 걸러 내고 성공 경로를 평평하게 둔다[^6]. `Option`을 돌려주는 함수에서 `else { return None; }`만 할 거라면 clippy의 `question_mark`(기본으로 켜짐)가 `?`를 쓰라고 경고한다. `?`는 [Option과 Result](/Hongs_Blog/studies/rust/option-result/)에 있다.

**let 체인** (Rust 1.88부터, 2024 에디션에서만). `if`와 `while`의 조건에서 `let` 패턴과 보통 조건을 `&&`로 잇는다. 앞에서 꺼낸 이름을 뒤 조건과 본문에서 쓴다[^8].

```rust
if let Some((k, v)) = line.split_once('=')
    && k.trim() == "port"
    && let Ok(p) = v.trim().parse::<u16>()
    && p != 0
{
    return Some(p);
}
```

전에는 `if let` 안에 `if`를 또 넣어야 했다. 2021 에디션에서 같은 코드를 쓰면 `let chains are only allowed in Rust 2024 or later`로 막힌다.

**`matches!`.** 값이 패턴에 맞는지를 `bool`로 돌려준다. 가드도 쓸 수 있다[^9]. <code>match s { S::A &#124; S::B =&gt; true, _ =&gt; false }</code>를 쓰면 clippy의 `match_like_matches_macro`(기본으로 켜짐)가 <code>matches!(s, S::A &#124; S::B)</code>로 바꾸라고 경고한다.

## 활용

- **에러 타입.** 라이브러리는 "무엇이 잘못됐나"를 열거형 하나로 돌려준다. 변형마다 필요한 정보를 담는다: `NotFound { id }`, `Timeout(Duration)`. [라이브러리 에러 설계](/Hongs_Blog/studies/rust/library-errors/)에서 쓴다.
- **`#[non_exhaustive]`.** 공개 라이브러리의 열거형에 붙이면, 그 크레이트 밖에서 `match`할 때 변형을 다 적어도 `_` 갈래가 있어야 컴파일된다(E0004). 크레이트 안에서는 아무 효과가 없다[^10]. 라이브러리가 나중에 변형을 더해도 쓰는 쪽 코드가 깨지지 않게 하는 장치다. 대신 쓰는 쪽은 새 변형이 생겨도 컴파일러의 알림을 받지 못한다.
- **상태 기계.** 연결 상태, 주문 상태처럼 "지금 어느 단계인가"를 열거형으로 두고, 단계마다 필요한 데이터만 변형에 담는다. [타입으로 잘못된 상태 막기](/Hongs_Blog/studies/rust/type-driven-design/)에서 다룬다.
- **크기.** 열거형의 크기는 가장 큰 변형에 맞춰진다. 변형 하나만 아주 크면 작은 변형도 그만큼 자리를 차지한다. clippy의 `large_enum_variant`가 이런 경우를 경고하고, 큰 변형을 `Box`로 감싸라고 권한다[^11]. `Box`는 [Box와 힙](/Hongs_Blog/studies/rust/box-heap/)에 있다.
- **흔한 실수.**
  - 습관적으로 `_ => {}`를 붙인다. 열거형에 변형이 늘어도 컴파일러가 침묵한다. 내 코드의 열거형이면 변형을 모두 적는다. 팀 규칙으로 막고 싶으면 clippy의 `wildcard_enum_match_arm`(restriction 그룹, 기본으로 꺼짐)을 켠다[^11].
  - 가드로 경우를 나누고 "다 덮었다"고 생각한다. 가드는 빠짐없음 검사에 들어가지 않는다.
  - `bool` 필드 여러 개로 상태를 나타낸다. 두 `bool`이면 네 조합이 생기는데 그중 말이 안 되는 조합도 만들 수 있다. 열거형 하나로 바꾼다.

## 연결

- 선수: [표현식과 제어 흐름](/Hongs_Blog/studies/rust/expressions-control-flow/)(`match`도 값을 내는 표현식이다), [구조체와 메서드](/Hongs_Blog/studies/rust/structs-methods/)(변형 안의 데이터는 구조체 모양이다)
- 가장 많이 쓰는 열거형 둘: [Option과 Result](/Hongs_Blog/studies/rust/option-result/)
- Java는 "여러 모양 중 하나"를 상속과 다형성으로 푼다([다형성](/Hongs_Blog/studies/java/java-polymorphism/)). 새 모양을 더하기는 쉽고, 모든 모양을 빠짐없이 다뤘는지는 컴파일러가 모른다. Rust 열거형은 반대다. 모양 목록이 닫혀 있어 빠짐없음을 검사하지만, 모양을 더하면 모든 `match`를 고쳐야 한다. 열린 목록이 필요하면 [트레이트 객체](/Hongs_Blog/studies/rust/trait-objects/)를 쓴다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음 코드는 컴파일되는가? 안 되면 오류 코드와 이유, 고치는 법은?</summary>

```rust
fn abs(x: Option<i32>) -> i32 {
    match x {
        Some(n) if n >= 0 => n,
        Some(n) if n < 0 => -n,
        None => 0,
    }
}
```
**답:** 안 된다. E0004(non-exhaustive patterns).<br>
**이유:** 컴파일러는 가드의 조건을 빠짐없음 검사에 넣지 않는다. 두 가드가 모든 정수를 덮는다는 것을 모른다. 두 번째 갈래를 가드 없는 `Some(n) => -n`으로 바꾼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 상황에 `match`, `if let`, `let ... else`, `matches!` 중 무엇이 가장 알맞은가? (가) 요청 줄이 `key=value` 모양이 아니면 바로 에러를 돌려주고, 맞으면 이어서 처리한다. (나) 메시지 목록에서 `Quit`의 개수를 센다. (다) 주문 상태 네 가지에 따라 고객에게 보낼 문구를 정한다. (라) 캐시에 값이 있으면 로그를 남긴다. 없으면 아무것도 안 한다.</summary>

**답:** (가) `let ... else` (나) `matches!` (다) `match` (라) `if let`<br>
**이유:** (가)는 실패하면 빠져나가고 성공 경로를 평평하게 이어 가는 모양이다. (나)는 맞는지 아닌지만 `bool`로 필요하다. (다)는 모든 상태를 빠짐없이 다뤄야 하므로 검사를 받는 `match`다. (라)는 한 갈래만 관심 있다.<br>
**흔한 오답:** (다)를 `if let` 여러 개로 쓴다. 상태가 늘면 빠뜨려도 컴파일러가 모른다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 위의 `grade`에 95, 90, 89, 79, 101을 차례로 넣으면 무엇이 나오는가?</summary>

**답:** `A(95) A(90) B(89) C 잘못된 점수 101`<br>
**이유:** `90..=100`은 양 끝을 포함하므로 90은 A다. 89는 `80..=89`에 맞는다. 79는 `0..=79`에 맞는데 이 갈래는 값을 꺼내지 않으므로 숫자 없이 `C`다. 101은 앞의 어느 범위에도 없어 마지막 갈래로 간다.

</details>


[^1]: The Rust Programming Language, 6.1 Defining an Enum — https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html
[^2]: The Rust Reference, Unions(items.union.common-storage, items.union.fields.intro, items.union.fields.read-safety) — https://doc.rust-lang.org/reference/items/unions.html
[^3]: The Java Tutorials, Enum Types — https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html
[^4]: The Rust Programming Language, 6.2 The match Control Flow Construct, Matches Are Exhaustive와 Catch-All Patterns — https://doc.rust-lang.org/book/ch06-02-match.html
[^5]: The Rust Programming Language, 19.3 Pattern Syntax(Matching Ranges of Values, Extra Conditionals with Match Guards, @ Bindings, Remaining Parts of a Value with ..) — https://doc.rust-lang.org/book/ch19-03-pattern-syntax.html
[^6]: The Rust Programming Language, 6.3 Concise Control Flow with if let and let...else — https://doc.rust-lang.org/book/ch06-03-if-let.html
[^7]: Announcing Rust 1.65.0, let-else statements — https://blog.rust-lang.org/2022/11/03/Rust-1.65.0/
[^8]: Announcing Rust 1.88.0, Let chains — https://blog.rust-lang.org/2025/06/26/Rust-1.88.0/
[^9]: std 문서, Macro `std::matches` — https://doc.rust-lang.org/std/macro.matches.html
[^10]: The Rust Reference, Type system attributes, The non_exhaustive attribute — https://doc.rust-lang.org/reference/attributes/type_system.html
[^11]: Clippy Lints, `large_enum_variant`, `wildcard_enum_match_arm`, `match_like_matches_macro`, `question_mark` — https://rust-lang.github.io/rust-clippy/master/index.html (rustc 1.99.0의 `clippy-driver`로 기본 켜짐·꺼짐을 확인했다)
{% endraw %}
