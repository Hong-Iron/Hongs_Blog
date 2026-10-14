---
layout: "note"
title: "표현식과 제어 흐름"
display_title: "표현식과 제어 흐름 (Expressions and Control Flow)"
kind: "concept"
kind_label: "정의"
num: "04"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Expressions and Control Flow", "표현식", "Expression", "문장", "Statement", "if", "match", "loop", "while", "for", "break", "레이블", "Loop Label", "레이블 블록", "Labeled Block", "범위", "Range", "유닛 타입", "Unit Type"]
description: "Rust에서는 if, match, 중괄호 블록, loop가 모두 계산기처럼 값 하나를 내놓는다. 그래서 C·Java의 삼항 연산자나 \"일단 변수를 만들고 갈래마다 대입\" 같은 요령이 필요 없다. 대신 줄 끝 세미콜론 하나가 값을 \"없음\"으로 바꾸고, 모든 갈래가 같은 타입을 내야 …"
prev_url: "/studies/rust/values-variables-types/"
prev_title: "값·변수·타입"
next_url: "/studies/rust/ownership-move/"
next_title: "소유권과 이동"
math: true
mermaid: false
code_count: 1
permalink: "/studies/rust/expressions-control-flow/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

Rust에서는 `if`, `match`, 중괄호 블록, `loop`가 모두 계산기처럼 값 하나를 내놓는다. 그래서 C·Java의 삼항 연산자나 "일단 변수를 만들고 갈래마다 대입" 같은 요령이 필요 없다. 대신 줄 끝 세미콜론 하나가 값을 "없음"으로 바꾸고, 모든 갈래가 같은 타입을 내야 하고, `match`는 가능한 경우를 하나도 빠짐없이 다뤄야 한다. 어기면 컴파일되지 않는다.

</div>


## 예시로 보기

점수를 등급으로 바꾸는 코드를 Java로 쓰면 보통 이렇게 된다.

```java
char g;                       // 일단 칸을 만들고
if (score >= 90) g = 'A';     // 갈래마다 대입한다
else if (score >= 80) g = 'B';
else g = 'F';
```

어느 갈래에서 대입을 빼먹으면 Java는 컴파일 오류를 내지만, 칸을 먼저 만들고 채우는 모양 자체가 실수를 부른다. Rust는 `if`나 `match` 전체가 값이므로 바로 받는다.

```rust
let g = match score {   // score: u8
    90..=100 => 'A',
    80..=89 => 'B',
    70..=79 => 'C',
    0..=69 => 'F',
    _ => '?',           // 101..=255
};
```

`match`는 위에서부터 패턴을 맞춰 보고 처음 맞은 갈래의 값을 낸다. `90..=100`은 90부터 100까지(100 포함)라는 범위 패턴이고, `_`는 무엇이든 받는 패턴이다[^3].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 이 문서의 컴파일 오류(E0308 세 가지, E0317, E0004, E0571, `let` 문장 오류), `loop`의 break 값 20, 레이블 break 추적 결과, 레이블 블록 검색, 범위 개수와 합, `{ 1; }`의 타입이 `()`인 것을 `rustc` 1.99.0으로 확인했다 — [04_expressions-control-flow_verify.rs](/Hongs_Blog/studies/rust/code/04_expressions-control-flow_verify/)</div>

</div>


## 문장과 표현식

계산해서 값을 내는 코드 조각을 표현식(expression)이라고 부른다. `5 + 6`, 함수 호출, 블록이 모두 표현식이다. 일을 하지만 값을 내지 않는 것은 문장(statement)이다. `let x = 6;`이 문장이다. Rust는 표현식 중심 언어라서 이 구분이 중요하다[^1].

`let`은 문장이라 값이 없다. 그래서 C처럼 `a = b = 0`이나 `x = (y = 6)`을 쓸 수 없다[^1].

```rust
let x = (let y = 6);   // error: expected expression, found `let` statement
```

대입 `x = 2`는 표현식이지만 값이 `()`다. `()`는 "값 없음"을 뜻하는 유닛 타입(unit type)이고 크기가 0바이트다. 그래서 `let y = (x = 2);`의 `y`는 `()`가 되고, 이것을 `i32` 자리에 쓰면 E0308이 난다.

### 블록의 값과 세미콜론

중괄호 블록은 마지막 줄의 값을 낸다. 단, 마지막 줄에 세미콜론이 없을 때만이다. 세미콜론을 붙이면 표현식이 문장이 되어 값이 사라진다[^1].

```rust
let y = {
    let x = 3;
    x + 1        // 세미콜론 없음: 블록의 값은 4
};

fn plus_one(x: i32) -> i32 {
    x + 1        // 이 값이 돌려줄 값. return을 쓰지 않는다
}
```

세미콜론 하나를 잘못 붙이면 이렇게 된다[^1].

```
error[E0308]: mismatched types
 --> src/main.rs:1:28
  |
1 | fn plus_one(x: i32) -> i32 {
  |    --------            ^^^ expected `i32`, found `()`
  |    |
  |    implicitly returns `()` as its body has no tail or `return` expression
2 |     x + 1;
  |          - help: remove this semicolon to return this value
```

`x + 1;`로 끝난 몸통의 값은 `()`인데, 함수는 `i32`를 약속했다. 컴파일러가 세미콜론을 빼라고 직접 알려 준다.

## if

`if`의 조건은 반드시 `bool`이어야 한다. C·파이썬처럼 0을 거짓으로 봐 주지 않는다[^2].

```rust
let number = 3;
if number { }        // error[E0308]: expected `bool`, found integer
if number != 0 { }   // 된다
```

`if`를 값으로 쓰면 두 갈래가 같은 타입을 내야 한다. 변수 하나의 타입은 컴파일할 때 하나로 정해져야 하기 때문이다[^2].

```rust
let n = if c { 5 } else { "six" };  // error[E0308]: `if` and `else` have incompatible types
let n = if c { 5 };                 // error[E0317]: `if` may be missing an `else` clause
```

두 번째 줄은 `c`가 거짓일 때 `n`에 넣을 값이 없다. `else` 없는 `if`의 값은 `()`이므로 `5`와 타입이 어긋난다.

## match는 모든 경우를 다룬다

`match`는 가능한 모든 값을 덮어야 컴파일된다. 이것을 "빠짐없다(exhaustive)"고 한다[^3]. 컴파일러는 무엇이 빠졌는지까지 알려 준다.

```rust
fn f(n: u8) -> &'static str {
    match n {
        0 => "zero",
        1..=9 => "small",
    }   // error[E0004]: non-exhaustive patterns: `10_u8..=u8::MAX` not covered
}
```

Java의 `switch`에서 `break`를 빼면 아래 갈래로 흘러내려 간다([제어문](/Hongs_Blog/studies/java/java-control-flow/)). Rust의 `match`는 맞은 갈래 하나만 실행하므로 흘러내림이 없다.

갈래는 위에서부터 맞춰 본다. 넓은 패턴을 앞에 두면 뒤의 좁은 패턴에는 영영 닿지 않는다. 컴파일은 되지만 `unreachable pattern` 경고가 난다([Rust 첫걸음 연습](/Hongs_Blog/studies/rust/rust-basics-practice/)의 p2).

`match`의 진짜 힘은 열거형과 만날 때 나온다. [열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/)에서 이어 간다.

## 반복: loop, while, for

| 반복 | 언제 | 값 |
|---|---|---|
| `loop` | 끝날 조건이 몸통 가운데에 있을 때 | `break 값`으로 값을 낸다 |
| `while 조건` | 조건이 참인 동안 | 언제나 `()` |
| `for x in 모음` | 범위나 모음의 원소를 하나씩 | 언제나 `()` |

### loop와 break 값

`loop`는 `break`를 만날 때까지 돈다. `break` 뒤에 값을 붙이면 그 값이 `loop` 전체의 값이 된다[^2].

```rust
let mut counter = 0;
let result = loop {
    counter += 1;
    if counter == 10 {
        break counter * 2;
    }
};   // result = 20
```

값을 낼 수 있는 것은 `loop`와 레이블 블록뿐이다[^4]. `while`이나 `for`에서 `break i;`를 쓰면 E0571이 난다. `while`은 조건이 처음부터 거짓이면 몸통을 한 번도 안 돌아서 `break`에 닿지 못할 수 있다. 그때 낼 값이 없기 때문이다.

`break`가 없는 `loop`는 끝나지 않는다. 그 타입은 "절대 값이 나오지 않음"을 뜻하는 `!`다[^4]. 서버의 요청 받기 반복이 이런 모양이다.

### 레이블: 바깥 반복을 끝내기

반복 안에 반복이 있을 때 `break`는 가장 안쪽 반복만 끝낸다. 바깥까지 끝내려면 반복에 이름(레이블)을 붙인다. 레이블은 작은따옴표로 시작한다[^2].

```rust
'outer: for i in 0..3 {
    for j in 0..3 {
        if i + j == 3 {
            break 'outer;      // 두 반복을 모두 끝낸다
        }
        if j > i {
            continue 'outer;   // 바깥 반복의 다음 i로 간다
        }
        trace.push((i, j));
    }
}
```

`trace`에는 `(0, 0), (1, 0), (1, 1)`만 남는다. 한 줄씩 따라가면 이렇다.

| i | j | `i + j == 3`? | `j > i`? | 한 일 |
|---|---|---|---|---|
| 0 | 0 | 아니오 | 아니오 | `(0, 0)` 기록 |
| 0 | 1 | 아니오 | 예 | 다음 i로 |
| 1 | 0 | 아니오 | 아니오 | `(1, 0)` 기록 |
| 1 | 1 | 아니오 | 아니오 | `(1, 1)` 기록 |
| 1 | 2 | 예 | | 두 반복 모두 끝 |

`i = 2`는 아예 오지 않는다.

### 레이블 블록: 반복이 아닌 곳에서 일찍 빠져나오기

반복이 아닌 블록에도 레이블을 붙이고 `break '이름 값`으로 빠져나올 수 있다. 이때는 레이블을 꼭 써야 한다. 블록의 값은 `break`로 낸 값이거나 마지막 줄의 값이다[^4].

```rust
type Row = [i32; 3]; // 칸 3개짜리 한 줄

fn find(grid: &[Row], target: i32) -> Option<(usize, usize)> {
    'search: {
        for (r, row) in grid.iter().enumerate() {
            for (c, &v) in row.iter().enumerate() {
                if v == target {
                    break 'search Some((r, c));
                }
            }
        }
        None
    }
}
```

첫 줄이 1, 2, 3이고 둘째 줄이 4, 5, 6인 격자에서 5를 찾으면 `Some((1, 1))`, 9를 찾으면 `None`이다. 함수 하나뿐이라면 `return Some((r, c))`로도 되지만, 함수 한가운데의 계산 한 덩어리만 일찍 끝내고 싶을 때 레이블 블록이 쓸모 있다.

### for와 범위

`for`는 모음의 원소를 처음부터 끝까지 하나씩 꺼낸다. 번호를 직접 늘리는 `while`은 번호나 조건을 잘못 적으면 panic이 나거나 원소를 빠뜨린다. `for`는 그럴 일이 없어서 Rust에서 가장 많이 쓰는 반복이다[^2].

| 범위 | 뜻 | 원소 수 |
|---|---|---|
| `1..10` | 1부터 9까지(10 제외) | 9 |
| `1..=10` | 1부터 10까지(10 포함) | 10 |
| `5..5` | 비어 있음 | 0 |
| `(1..4).rev()` | 3, 2, 1 | 3 |

C의 `for (i = 0; i < n; i++)`는 Rust에서 `for i in 0..n`이다. 하지만 배열을 돌 때는 번호 없이 `for x in &v`나 `for (i, x) in v.iter().enumerate()`를 쓰는 편이 낫다. 반복자는 [반복자](/Hongs_Blog/studies/rust/iterators/)에서 다룬다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">블록·if·loop의 값</div>

블록 `{ 문장들; 꼬리 }`의 값은 꼬리 표현식의 값이다. 꼬리가 없으면(마지막이 세미콜론으로 끝나면) 값은 `()`다. `if 조건 { A } else { B }`의 값은 조건이 참이면 `A`, 거짓이면 `B`의 값이고, `A`와 `B`의 타입이 같아야 한다. `loop`의 값은 그것을 끝낸 `break 값`의 값이고, `break`가 없으면 타입은 `!`다.

기호로 쓰면, $$T(e)$$(표현식 $$e$$의 타입)라 할 때 $$T(\{\, s_1; \dots; s_k;\ e \,\}) = T(e)$$, $$T(\{\, s_1; \dots; s_k; \,\}) = ()$$, 그리고 `if c {a} else {b}`가 타입을 가지려면 $$T(c) = \texttt{bool}$$이고 $$T(a) = T(b)$$여야 한다.

</div>


## 활용

- **실제 쓰임.** 설정값을 고를 때 `let level = match env.as_str() { "prod" => Level::Info, _ => Level::Debug };`처럼 `match` 한 번으로 불변 변수에 바로 넣는다. `mut` 변수를 만들고 갈래마다 대입하는 코드보다 짧고, 갈래를 빼먹으면 컴파일러가 잡는다.
- **재시도 반복.** "성공할 때까지 최대 n번 시도"는 `loop`와 `break 결과`로 쓴다. 성공 값을 바깥 변수에 담아 두는 요령이 필요 없다.
- **흔한 실수.**
  - 함수 끝 줄에 습관처럼 세미콜론을 붙여 E0308을 만난다. 오류 메시지의 `remove this semicolon`을 따르면 된다.
  - 마지막 줄에 `return x;`를 쓴다. 동작은 같지만 Rust답지 않다.
  - `match`에서 `_` 갈래를 너무 일찍 써서 새 경우가 생겨도 컴파일러가 알려 주지 못하게 만든다. 열거형에서는 가능하면 경우를 모두 적는다.
- **clippy.** `needless_return`(style, 기본 경고)은 마지막 줄의 `return`을, `let_and_return`(style, 기본 경고)은 변수에 담았다가 바로 돌려주는 코드를 짚는다. `never_loop`(correctness, 기본 오류)는 처음 한 바퀴에서 반드시 빠져나오는 반복을 잡는다. `manual_range_contains`(style)는 `x >= 3 && x < 8`을 `(3..8).contains(&x)`로 바꾸라고 한다[^5].

## 연결

- 선수: [값·변수·타입](/Hongs_Blog/studies/rust/values-variables-types/)
- Java의 `if`·`switch`·반복문: [제어문](/Hongs_Blog/studies/java/java-control-flow/)
- 다음 단계: `match`와 열거형 [열거형과 패턴 매칭](/Hongs_Blog/studies/rust/enums-pattern-matching/), `Option`으로 "없음" 다루기 [Option과 Result](/Hongs_Blog/studies/rust/option-result/)
- 연습: [Rust 첫걸음 연습](/Hongs_Blog/studies/rust/rust-basics-practice/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"세미콜론은 문법상 붙이는 장식이라 있든 없든 같다"</div>

틀렸다. Rust에서 세미콜론은 "이 표현식의 값을 버린다"는 뜻이다. C·Java에서는 줄 끝마다 붙이니 습관처럼 보이지만, 블록의 마지막 줄에 붙이면 블록의 값이 `()`로 바뀐다. `fn plus_one(x: i32) -> i32 { x + 1; }`을 컴파일하면 `expected i32, found ()`와 함께 세미콜론을 지우라는 도움말이 나오는 것으로 확인할 수 있다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 컴파일되는가? 안 되면 왜? `fn half(x: i32) -> i32 { if x > 0 { x / 2 } }`</summary>

**답:** 안 된다(E0317).<br>
**이유:** `if`가 함수의 꼬리 값이다. `x > 0`이 거짓이면 낼 값이 없으므로 `else` 없는 `if`의 값은 `()`가 되어 `i32`와 어긋난다. `else { 0 }`처럼 다른 갈래를 적어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 코드가 찍는 값은? `let mut n = 0; let v = loop { n += 3; if n > 10 { break n - 10; } }; println!("{v}");`</summary>

**답:** `2`<br>
**이유:** `n`은 3, 6, 9, 12로 커진다. 12에서 처음 10을 넘으므로 `break 12 - 10`이 `loop`의 값이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 2차원 격자에서 처음 찾은 칸의 좌표를 값으로 얻고 싶다. (가) `while`과 `break (r, c)` (나) `loop` 두 겹과 레이블 없는 `break (r, c)` (다) 레이블 블록과 `break 'search Some((r, c))` 중 무엇이 맞고, 나머지는 왜 안 되는가?</summary>

**답:** (다)다.<br>
**이유:** (가) `while`에서는 `break`에 값을 줄 수 없다(E0571). (나) 레이블 없는 `break`는 안쪽 `loop`만 끝내므로 바깥 반복이 계속 돈다. (다) 레이블 블록은 두 겹의 반복을 한 번에 빠져나오면서 값을 내고, 못 찾으면 꼬리의 `None`이 값이 된다.

</details>


[^1]: The Rust Programming Language, 3.3 Functions, Statements and Expressions · Functions with Return Values — https://doc.rust-lang.org/book/ch03-03-how-functions-work.html
[^2]: The Rust Programming Language, 3.5 Control Flow(if Expressions, Using if in a let Statement, Returning Values from Loops, Loop Labels, Looping Through a Collection with for) — https://doc.rust-lang.org/book/ch03-05-control-flow.html
[^3]: The Rust Programming Language, 6.2 The match Control Flow Construct, Matches Are Exhaustive · Catch-All Patterns and the _ Placeholder — https://doc.rust-lang.org/book/ch06-02-match.html
[^4]: The Rust Reference, Loops and other breakable expressions(Infinite loops, Labelled block expressions, break and loop values) — https://doc.rust-lang.org/reference/expressions/loop-expr.html
[^5]: Clippy Lints, `needless_return`·`let_and_return`·`manual_range_contains`(style, 기본 warn), `never_loop`(correctness, 기본 deny) — https://rust-lang.github.io/rust-clippy/master/index.html
{% endraw %}
