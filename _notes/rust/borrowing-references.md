---
layout: "note"
title: "빌림과 참조"
display_title: "빌림과 참조 (Borrowing and References)"
kind: "concept"
kind_label: "정의"
num: "07"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Borrowing", "References", "참조", "빌림", "가변 참조", "Mutable Reference", "공유 참조", "Shared Reference", "NLL", "Non-Lexical Lifetimes", "다시 빌리기", "Reborrow", "두 단계 빌림", "Two-Phase Borrow", "빌림 검사기", "Borrow Checker", "E0499", "E0502", "E0506", "E0505", "E0596"]
description: "값의 주인은 그대로 두고, 남이 잠깐 들여다보거나 고치게 해 주는 것이 참조다. 도서관 책처럼, 여러 명이 동시에 읽는 것은 괜찮지만 누가 고치는 동안에는 아무도 읽거나 고치지 못한다. 이 규칙 덕분에 \"읽는 중에 바뀌는\" 버그와 데이터 경쟁이 컴파일 단계에서 막힌다. 대신 컴파일…"
prev_url: "/studies/rust/malloc-free-vs-ownership/"
prev_title: "malloc·free ↔ 소유권과 Drop"
next_url: "/studies/rust/lifetimes/"
next_title: "수명"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "07_borrowing-references_verify.rs", "u": "/studies/rust/code/07_borrowing-references_verify/", "r": "검증"}]
permalink: "/studies/rust/borrowing-references/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

값의 주인은 그대로 두고, 남이 잠깐 들여다보거나 고치게 해 주는 것이 참조다. 도서관 책처럼, 여러 명이 동시에 읽는 것은 괜찮지만 누가 고치는 동안에는 아무도 읽거나 고치지 못한다. 이 규칙 덕분에 "읽는 중에 바뀌는" 버그와 데이터 경쟁이 컴파일 단계에서 막힌다. 대신 컴파일러가 "아직 쓰는 중"이라고 보는 참조가 있으면, 옳은 코드도 거절당할 수 있다.

</div>


## 예시로 보기

[소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)만 있으면 길이 하나 재는 데도 `String`을 넘겼다가 돌려받아야 한다. 값 대신 그 값이 있는 곳을 가리키는 것을 넘기면 된다. `&s`가 `s`를 가리키는 참조(reference)이고, 참조를 만드는 것을 빌림(borrow)이라 부른다[^1].

```rust
fn calculate_length(s: &String) -> usize {
    s.len()
} // s는 참조일 뿐이라 여기서 String을 버리지 않는다

let s1 = String::from("hello");
let len = calculate_length(&s1); // s1은 그대로 주인이다
```

```
  main 스택                calculate_length 스택            힙
  s1  ┌ ptr ──────────────────────────────────────────▶ [h e l l o]
      │ len 5   ◀─────────┐
      └ cap 5             │
                      s   └─ (s1의 주소 한 칸, 8바이트)
```

참조는 주소 한 칸이다. C 문서의 `swap_by_pointer(&a, &b)`와 같은 그림이다([포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/)). 다른 점은 Rust 참조가 절대 엉뚱한 곳(빈 주소, 이미 돌려준 자리)을 가리키지 않는다는 것이다[^1].

고치려면 가변 참조 `&mut`를 쓴다. 변수도 `let mut`여야 한다[^1].

```rust
fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
let mut s = String::from("hello");
change(&mut s);
```

그런데 왜 규칙이 필요할까? `Vec` 첫 칸의 참조를 쥐고 `push`를 하는 코드를 보자.

```rust
let mut v = vec![1];
let first = &v[0];
v.push(2);          // 버퍼가 꽉 차면 더 큰 자리로 옮긴다
println!("{first}"); // 옛 자리를 읽게 된다
```

C였다면 `realloc` 뒤 옛 주소를 읽는 버그다. Rust는 거절한다.

```
error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable
 --> b2.rs:1:49
  |
1 | pub fn f(){ let mut v=vec![1]; let first=&v[0]; v.push(2); println!("{first}"); }
  |                                           -     ^^^^^^^^^             ----- immutable borrow later used here
  |                                           |     |
  |                                           |     mutable borrow occurs here
  |                                           immutable borrow occurs here
```

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 오류 코드 E0499·E0502(세 경우)·E0596·E0506·E0505·E0382, 컴파일되는 경우(NLL, 자동 다시 빌리기, 명시적 다시 빌리기, 두 단계 빌림, 필드별 빌림, 공유 참조 복사)를 rustc 1.99로 확인했다. 참조 크기 8바이트, `split_at_mut`, `v.push(v.len())`를 실행해 확인했다 — [07_borrowing-references_verify.rs](/Hongs_Blog/studies/rust/code/07_borrowing-references_verify/)</div>

</div>


## 정의

참조의 규칙은 둘이다[^1].

1. 어느 순간이든 **가변 참조 하나** 또는 **공유 참조 여럿** 가운데 하나만 있을 수 있다.
2. 참조는 늘 살아 있는 값을 가리켜야 한다.

Rustonomicon은 같은 것을 "참조는 가리키는 값보다 오래 살 수 없다", "가변 참조는 다른 이름으로 겹쳐 가리킬 수 없다(aliasing 금지)"로 적는다[^2]. 1번 규칙을 줄여 "공유 XOR 가변"이라고 부른다.

| | `&T` (공유 참조) | `&mut T` (가변 참조) |
|---|---|---|
| 동시에 몇 개 | 여럿 | 하나, 그동안 다른 참조 없음 |
| 가리키는 값 고치기 | 안 된다(E0596) | 된다 |
| `Copy`인가 | 그렇다 | 아니다(옮겨 간다)[^3] |
| 살아 있는 동안 주인이 할 수 있는 것 | 읽기 | 아무것도 못 한다 |

"살아 있는 동안"은 **만든 곳부터 마지막으로 쓴 곳까지**다. 블록 끝까지가 아니다. 이것을 NLL(non-lexical lifetimes)이라 부른다[^1][^4].

```rust
let mut s = String::from("hello");
let r1 = &s;
let r2 = &s;
println!("{r1} and {r2}");
// r1, r2는 여기서 마지막으로 쓰였다

let r3 = &mut s; // 괜찮다
println!("{r3}");
```

### 빌림 규칙을 어기면 나는 오류

| 상황 | 코드 모양 | 오류 |
|---|---|---|
| 가변 참조 둘 | `let a = &mut s; let b = &mut s; a…; b…;` | E0499 |
| 공유 참조가 살아 있는데 가변 빌림 | `let r = &v[0]; v.push(2); r…` | E0502 |
| 공유 참조로 고치기 | `fn f(s: &String) { s.push_str("x") }` | E0596 |
| 빌려 준 동안 원래 변수에 대입 | `let r = &x; x = 5; r…` | E0506 |
| 빌려 준 동안 값을 옮기기 | `let r = &s; let t = s; r…` | E0505 |

### 다시 빌리기

`&mut`는 `Copy`가 아니다. 그래서 `let r2 = r;`로 넘기면 `r`가 옮겨 가고, 그 뒤 `r`를 쓰면 E0382다[^3]. 그런데 함수 인자로는 같은 `&mut`를 여러 번 넘길 수 있다.

```rust
fn add(v: &mut Vec<i32>) { v.push(1); }

let mut v = vec![];
let r = &mut v;
add(r);   // r를 옮기지 않고, r를 통해 잠깐 새로 빌린다
add(r);
r.push(3);
```

함수가 `&mut Vec<i32>`를 기대하는 자리에 `r`를 주면, 컴파일러는 `&mut *r`(r가 가리키는 것을 다시 가변으로 빌림)를 넘긴다. 이것을 다시 빌리기(reborrow)라 부른다. 새로 빌린 참조가 살아 있는 동안 `r`는 쉬고, 다 쓰면 `r`를 다시 쓸 수 있다. 직접 `let r2 = &mut *r;`라고 써도 같다. `r2`가 살아 있는데 `r`를 쓰면 E0499다[^s1].

### 두 단계 빌림

`v.push(v.len())`은 가변 빌림(`push`의 `&mut self`) 안에서 공유 빌림(`v.len()`)을 쓰는 것처럼 보인다. 그래도 컴파일된다. 메서드를 부를 때 컴파일러는 `&mut v`를 먼저 "예약"만 해 두고, 인자를 다 계산한 뒤에 실제로 가변으로 쓴다[^s1].

### 필드는 따로 빌린다

`let a = &mut p.x; let b = &mut p.y;`는 된다. 컴파일러가 두 필드가 겹치지 않는다는 것을 안다. 그러나 `fn xm(&mut self) -> &mut i32` 같은 메서드를 두 번 부르면 E0499다. 메서드 시그니처는 "self 전체를 빌린다"고만 말하기 때문이다[^s1]. 한 슬라이스의 두 칸이 필요하면 겹치지 않는 두 조각으로 나눠 주는 `split_at_mut`를 쓴다.

### 설계 이유

데이터 경쟁은 ① 두 포인터 이상이 같은 데이터에 동시에 접근하고, ② 그중 하나 이상이 쓰고, ③ 접근을 맞추는 장치가 없을 때 생긴다[^1]. "가변 하나 또는 공유 여럿"은 ①과 ②가 함께 일어나지 못하게 한다. 한 스레드 안에서도 같은 규칙이 "반복하는 중에 컬렉션이 바뀌는" 버그를 막는다.

컴파일러 최적화에도 쓰인다. `fn compute(input: &u32, output: &mut u32)`에서 `input`과 `output`이 같은 곳을 가리킬 수 없으므로, `*input`을 레지스터에 한 번 읽어 두고 다시 읽지 않아도 된다. Rustonomicon은 다른 언어 대부분에서는 프로그램 전체를 분석하지 않는 한 이 최적화가 옳지 않다고 적는다. 두 포인터가 겹칠 수 있기 때문이다[^5]. 실제로 `compute(&x, &mut x)`는 E0502로 거절된다.

### 예와 아닌 예

빌림 규칙에 맞는 예:
- `let a = &v; let b = &v;` 공유 둘
- `let r = &mut v; r.push(1); let s = &v;` — `r`의 마지막 사용 뒤 공유 빌림
- `let a = &mut p.x; let b = &mut p.y;` 다른 필드

맞지 않는 예:
- `for x in &v { v.push(*x); }` — 반복하는 동안 가변 빌림(E0502)
- `let a = &mut v[0]; let b = &mut v[1];` — 컴파일러는 인덱스가 다른지 모른다(E0499)

## 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`let first = &v[0]; v.push(2); println!("{first}");`가 E0502인 이유를 "버퍼가 옮겨 간다"는 말을 써서 설명하라.</summary>

`push`는 용량이 차면 더 큰 버퍼를 받아 내용을 옮기고 옛 버퍼를 돌려준다. `first`는 옛 버퍼의 칸을 가리키므로 그 뒤에 읽으면 돌려준 자리를 읽게 된다. 컴파일러는 버퍼가 실제로 옮겨 갈지 모른다. 대신 `push`가 `&mut self`를 받는다는 것만 보고, 공유 참조가 살아 있는 동안의 가변 빌림을 거절한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`add(r); add(r);`는 되는데 `let r2 = r; r2.push(1); r.push(2);`는 왜 안 되는가?</summary>

함수 인자 자리에서는 `&mut *r`로 다시 빌리므로 `r`가 옮겨 가지 않는다. 다시 빌린 참조는 함수가 끝나면 쓸 일이 없어 빌림이 끝난다. `let r2 = r;`는 타입을 적지 않은 대입이라 그냥 이동이다. `&mut`는 `Copy`가 아니라서 `r`가 비워지고, 그 뒤 `r.push`는 E0382다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 구조체에서 `&mut p.x`와 `&mut p.y`는 함께 되는데, `p.xm()`과 `p.ym()`(둘 다 `&mut self`)은 왜 안 되는가?</summary>

필드 접근은 컴파일러가 경로(`p.x`, `p.y`)를 보고 겹치지 않는다는 것을 안다. 메서드 호출에서는 시그니처만 본다. `&mut self`는 `p` 전체를 빌린다는 뜻이므로 두 번째 호출은 같은 값을 두 번 가변으로 빌리는 것이다.

</details>


## 예제

**하위목표: 빌림이 어디서 시작해 어디서 끝나는지 줄마다 표시하기.**

```rust
let mut s = String::from("a");   // 1
let r1 = &s;                      // 2  r1 시작
let r2 = &s;                      // 3  r2 시작
println!("{r1}{r2}");             // 4  r1, r2 마지막 사용 → 끝
let r3 = &mut s;                  // 5  r3 시작 (살아 있는 공유 참조 없음)
r3.push('b');                     // 6  r3 마지막 사용
println!("{s}");                  // 7  주인이 읽기 → "ab"
```

1. *빌림마다 시작 줄:* 2, 3, 5.
2. *마지막 사용 줄:* r1·r2는 4, r3는 6.
3. *겹치는지:* 공유(2~4)와 가변(5~6)이 겹치지 않는다. 7은 모든 빌림이 끝난 뒤다.
4. *결론:* 컴파일된다. 4번 줄 뒤에 `println!("{r1}")`을 하나 더 넣으면 공유 빌림이 그 줄까지 늘어나 5번과 겹치므로 E0502다.

**경계 사례.** 가리키는 값에 `Drop`이 있는 타입을 참조로 들고 있으면, 범위 끝의 drop도 "사용"으로 친다. 그래서 그런 경우에는 빌림이 블록 끝까지 늘어날 수 있다[^4].

## 활용

- **함수 인자는 기본으로 빌림.** 읽기만 하면 `&T`, 고치면 `&mut T`, 가져가서 저장하면 `T`. 문자열과 슬라이스는 `&String`, `&Vec<T>` 대신 `&str`, `&[T]`로 받는다([슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/)).
- **반복 중에 바꾸기.** `for x in &v { v.push(…) }` 대신, 넣을 것을 따로 모은 뒤 `v.extend(new_items)`를 한다. 지우기는 <code>v.retain(&#124;x&#124; …)</code>를 쓴다.
- **두 칸 바꾸기.** `v.swap(i, j)`, 또는 `split_at_mut`, `iter_mut`. HashMap에서 한 항목만 고치려면 `entry` API를 쓴다([컬렉션](/Hongs_Blog/studies/rust/collections/)).
- **구조체 메서드끼리 부딪힐 때.** `self.items`를 도는 동안 `self.log(…)`(`&mut self`)를 부르면 E0502다. 필드를 직접 빌리거나, 기록 함수를 필드만 받는 함수로 뺀다([빌림 오류 고치기 예제 사다리](/Hongs_Blog/studies/rust/borrow-errors-ladder/) 문제 4).
- **공유하면서 고쳐야 할 때.** 규칙을 지키면서 공유 참조로 고치려면 `Cell`·`RefCell`·`Mutex`처럼 검사를 실행 시점으로 옮기는 타입을 쓴다([내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/)).
- **성능.** 참조는 주소 한 칸(8바이트)이고, 빌림 검사는 컴파일할 때만 돈다. 실행 비용이 없다. `&mut`가 겹치지 않는다는 보장은 위의 `compute`처럼 최적화를 돕는다[^5].
- **clippy.** `needless_borrow`(이미 참조인 것을 또 `&`)와 `ptr_arg`(`&String`·`&Vec` 인자)를 기본으로 경고한다[^s2].

## 연결

- 선수: [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/)
- 참조가 얼마나 오래 살 수 있는지 시그니처에 적기: [수명](/Hongs_Blog/studies/rust/lifetimes/)
- 컬렉션의 일부를 빌리기: [슬라이스와 String·&str](/Hongs_Blog/studies/rust/slices-strings/)
- 스레드 사이에서 같은 규칙이 데이터 경쟁을 막는다: [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/). 운영체제 수업의 경쟁 조건과 비교: [경쟁 조건과 임계 구역](/Hongs_Blog/studies/operating-systems/race-condition-critical-section/)
- C의 포인터 인자: [포인터 인자와 값 전달](/Hongs_Blog/studies/data-structures/pointer-parameters/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"참조는 그 변수가 있는 블록이 끝날 때까지 빌린 상태다."</div>

틀렸다. 옛 컴파일러(2018 이전)는 그렇게 봤기 때문에 오래된 글에 이런 설명이 남아 있다. 지금은 참조를 만든 곳부터 마지막으로 쓴 곳까지만 빌린다[^4]. 위 예제의 `r3 = &mut s`가 그 증거다. 블록 끝까지 빌린다면 E0502가 났어야 한다. 예외는 앞의 경계 사례처럼 drop이 마지막 사용이 되는 경우다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`&mut`는 '고칠 수 있는 참조'라는 뜻일 뿐이다."</div>

반만 맞다. 더 중요한 뜻은 "**혼자만** 가리키는 참조"다. 그래서 `&mut` 하나가 살아 있으면 주인조차 읽지 못한다. 반대로 공유 참조로도 고칠 수 있는 타입(`Cell`, `Mutex`)이 있다. 이름을 "가변/불변"보다 "독점/공유"로 읽으면 오류 메시지가 잘 풀린다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 컴파일되는가? 안 되면 오류 코드와 이유는?</summary>

```rust
let mut v = vec![1, 2];
for x in &v {
    if *x > 0 { v.push(*x); }
}
```
**답:** 안 된다. E0502.<br>
**이유:** `for x in &v`는 반복이 끝날 때까지 `v`를 공유로 빌린다. 그 안의 `v.push`는 가변 빌림이다. 실행됐다면 `push`가 버퍼를 옮기는 순간 반복자가 옛 버퍼를 읽는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 마지막 `assert_eq!`가 통과하려면 `???`는 무엇인가?</summary>

```rust
fn add_one(v: &mut Vec<i32>) { v.push(1); }
let mut v = Vec::new();
let r = &mut v;
add_one(r);
add_one(r);
r.push(3);
assert_eq!(v, ???);
```
**답:** `[1, 1, 3]`.<br>
**이유:** 두 번의 `add_one(r)`은 다시 빌리기라 `r`가 옮겨 가지 않는다. `r`의 마지막 사용(`r.push(3)`) 뒤라서 주인 `v`를 읽을 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 둘 중 컴파일되는 것은? 안 되는 쪽의 오류 코드는?</summary>

(가) `let r = &mut v; let r2 = &mut *r; r2.push(1); r.push(2);`<br>
(나) `let r = &mut v; let r2 = &mut *r; r.push(2); r2.push(1);`<br>
**답:** (가)가 된다. (나)는 E0499.<br>
**이유:** `r2`는 `r`에서 다시 빌린 것이다. `r2`가 살아 있는 동안 `r`는 쓸 수 없다. (가)는 `r2`를 다 쓴 뒤에 `r`를 쓰고, (나)는 `r2`의 마지막 사용보다 앞에서 `r`를 쓴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "가변 참조는 한 번에 하나뿐이라서 한 배열의 두 칸을 동시에 고치는 것은 불가능하다"를 깨는 예를 들라.</summary>

**답:** `let (left, right) = a.split_at_mut(2); std::mem::swap(&mut left[0], &mut right[1]);`. `[10, 20, 30, 40]`이 `[40, 20, 30, 10]`이 된다.<br>
**이유:** 규칙은 "같은 자리를 겹쳐 가리키는 가변 참조 둘"을 막는다. `split_at_mut`는 겹치지 않는 두 조각을 돌려주므로 규칙에 맞다. 구조체의 다른 필드 둘을 따로 빌리는 것도 된다.

</details>


[^1]: The Rust Programming Language, 4.2 References and Borrowing (Mutable References, Dangling References, The Rules of References) — https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html
[^2]: The Rustonomicon, References — https://doc.rust-lang.org/nomicon/references.html
[^3]: std 문서, `std::marker::Copy` (공유 참조는 Copy, `&mut T`는 Copy가 아님) — https://doc.rust-lang.org/std/marker/trait.Copy.html
[^4]: The Rustonomicon, Lifetimes (The area covered by a lifetime: 참조는 만든 곳부터 마지막 사용까지 살아 있다, destructor가 있으면 범위 끝도 사용) — https://doc.rust-lang.org/nomicon/lifetimes.html
[^5]: The Rustonomicon, Aliasing (`compute` 예) — https://doc.rust-lang.org/nomicon/aliasing.html
[^s1]: 다시 빌리기, 두 단계 빌림, 필드별 빌림과 메서드 빌림의 차이는 여기서 열어 본 1차 자료에 절로 정리되어 있지 않다. Reference의 Expressions 절은 메서드 호출의 왼쪽 피연산자가 암묵적으로 빌려진다는 것만 적는다(https://doc.rust-lang.org/reference/expressions.html). 문서의 동작은 모두 rustc 1.99.0으로 컴파일해 확인한 실험 결과다. "예약"이라는 설명은 동작을 풀어 쓴 것이다.
[^s2]: `ptr_arg`가 기본으로 경고하는 것은 rustc 1.99.0의 `clippy-driver`로 확인했다([09_slices-strings_verify.rs](/Hongs_Blog/studies/rust/code/09_slices-strings_verify/)). `needless_borrow`도 같은 방법으로 기본 경고를 확인했다([07_borrowing-references_verify.rs](/Hongs_Blog/studies/rust/code/07_borrowing-references_verify/)).
{% endraw %}
