---
layout: "note"
title: "소유권과 이동"
display_title: "소유권과 이동 (Ownership and Move)"
kind: "concept"
kind_label: "정의"
num: "05"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Ownership", "Move", "Move Semantics", "이동", "Copy", "Clone", "Drop", "drop 순서", "Drop Order", "부분 이동", "Partial Move", "E0382", "E0507", "E0509", "E0204"]
description: "힙에 잡은 메모리마다 \"다 쓰면 치울 책임자\"를 정확히 한 명 둔다. 책임자 변수가 범위를 벗어나면 Rust가 그 자리에서 메모리를 돌려준다. 그래서 free를 잊거나 두 번 부르는 실수가 생기지 않는다. 대신 let b = a;처럼 값을 넘기면 책임도 함께 넘어가서, 그 뒤로 a…"
prev_url: "/studies/rust/expressions-control-flow/"
prev_title: "표현식과 제어 흐름"
next_url: "/studies/rust/malloc-free-vs-ownership/"
next_title: "malloc·free ↔ 소유권과 Drop"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "05_ownership-move_verify.rs", "u": "/studies/rust/code/05_ownership-move_verify/", "r": "검증"}]
permalink: "/studies/rust/ownership-move/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

힙에 잡은 메모리마다 "다 쓰면 치울 책임자"를 정확히 한 명 둔다. 책임자 변수가 범위를 벗어나면 Rust가 그 자리에서 메모리를 돌려준다. 그래서 `free`를 잊거나 두 번 부르는 실수가 생기지 않는다. 대신 `let b = a;`처럼 값을 넘기면 책임도 함께 넘어가서, 그 뒤로 `a`는 쓸 수 없다. 이 규칙은 컴파일할 때만 검사하므로 실행 비용은 없다.

</div>


## 예시로 보기

C에서는 `char *a = malloc(6); char *b = a;` 뒤에 `free(a); free(b);`를 하면 같은 자리를 두 번 돌려준다. 컴파일러는 막지 않는다. 주소를 베낀 변수가 둘이고, 둘 다 "내가 돌려줘야 한다"고 믿을 수 있기 때문이다.

Rust의 `String`도 힙에 글자를 담는다. 변수 자체는 스택에 놓인 세 칸이다. 글자가 있는 힙 주소(포인터), 지금 쓰는 바이트 수(길이), 힙에서 받아 둔 바이트 수(용량)다[^1][^2]. 64비트 기계에서 세 칸은 24바이트다.

```rust
let s1 = String::from("hello");
let s2 = s1;
println!("{s1}, world!"); // 컴파일 오류
```

`let s2 = s1;`은 스택의 세 칸만 베낀다. 힙의 `hello`는 그대로 한 벌이다[^1].

```
                 스택                         힙
         ┌─────────────────┐
  s1     │ ptr ────────────┼──┐       ┌───┬───┬───┬───┬───┐
(못 씀)  │ len  5          │  ├─────▶ │ h │ e │ l │ l │ o │
         │ cap  5          │  │       └───┴───┴───┴───┴───┘
         ├─────────────────┤  │
  s2     │ ptr ────────────┼──┘
         │ len  5          │
         │ cap  5          │
         └─────────────────┘
```

이대로 두 변수가 범위를 벗어나면 둘 다 같은 힙을 돌려주려 한다. C의 이중 해제와 같다. Rust는 이것을 막으려고 대입한 순간 `s1`을 "옮겨 간 변수"로 표시한다. 이것을 이동(move)이라 부른다. 그 뒤에 `s1`을 읽으면 컴파일러가 거절한다[^1].

```
error[E0382]: borrow of moved value: `s1`
 --> m1.rs:1:62
  |
1 | pub fn f(){ let s1=String::from("hi"); let s2=s1; println!("{s1} {s2}"); }
  |                 --                            --             ^^ value borrowed here after move
  |                 |                             |
  |                 |                             value moved here
  |                 move occurs because `s1` has type `String`, which does not implement the `Copy` trait
```

힙을 실제로 두 벌로 만들고 싶으면 `s1.clone()`을 부른다. 새 힙 자리를 잡아 글자를 베낀다. 이동한 `s2`의 힙 주소는 `s1`이 갖던 주소와 같고, `clone`한 값의 주소는 다르다는 것을 코드로 확인했다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 오류 코드 E0382·E0507·E0509·E0204·E0184·E0040을 rustc 1.99로 컴파일해 확인했다. `size_of::<String>()`이 24, 이동 뒤 힙 주소가 같고 `clone` 뒤 주소가 다른 것, drop 순서 전부(문서의 추적 문제 포함)를 실행해 확인했다 — [05_ownership-move_verify.rs](/Hongs_Blog/studies/rust/code/05_ownership-move_verify/)</div>

</div>


## 정의

소유권 규칙은 셋이다[^1].

1. 값마다 주인(owner)인 변수가 하나 있다.
2. 한 번에 주인은 하나뿐이다.
3. 주인이 범위를 벗어나면 값은 버려진다(drop).

"버린다"는 그 값의 `Drop::drop`을 부르고, 이어서 필드들을 차례로 버린다는 뜻이다[^3]. `String`의 drop은 힙 버퍼를 돌려준다.

값을 다른 곳에 넣으면 무슨 일이 생기는지는 타입이 정한다[^4].

| 타입이 | `let b = a;` 뒤의 `a` | 힙 | 예 |
|---|---|---|---|
| `Copy`를 구현한다 | 그대로 쓸 수 있다(복사) | 없다 | `i32`, `f64`, `bool`, `char`, `&T`, `(i32, i32)` |
| `Copy`가 아니다 | 못 쓴다(이동) | 한 벌 그대로 | `String`, `Vec<T>`, `Box<T>`, `(i32, String)` |
| 어느 쪽이든 `b = a.clone()` | 그대로 쓸 수 있다 | 새로 한 벌 | `String::clone`은 버퍼를 베낀다 |

복사와 이동은 둘 다 스택의 바이트를 그대로 베끼는 일이다. 차이는 베낀 뒤 원래 변수를 계속 쓸 수 있느냐뿐이다. `Copy`의 동작은 바꿀 수 없고 늘 바이트를 그대로 베낀다. `Clone`은 `.clone()`을 직접 불러야 하고, 타입마다 하는 일을 정할 수 있다[^5].

어떤 타입이 `Copy`가 되려면 모든 필드가 `Copy`여야 한다. `Drop`을 구현한 타입은 `Copy`가 될 수 없다[^5]. 힙을 가진 값을 바이트만 베끼면 다시 이중 해제가 되기 때문이다.

Rust Reference에 따르면 값을 꺼내 옮길 수 있는 자리는 넷뿐이다[^4].

- 지금 빌려 주지 않은 변수
- 임시값
- 옮길 수 있는 자리의 필드. 단, 그 바깥 타입이 `Drop`을 구현하지 않아야 한다
- `Box<T>`를 역참조한 것

그래서 `let s = v[0];`(Vec 칸에서 꺼내기)는 E0507, `Drop`을 구현한 구조체에서 필드를 꺼내면 E0509다. 지역 변수에서 옮기면 그 자리는 "비었다"로 표시되고, 새 값을 넣기 전까지 읽을 수 없다[^4].

### 함수에 넘기기와 돌려받기

함수 인자도 대입과 같다. `String`을 넘기면 함수 쪽 매개변수가 새 주인이 되고, 함수가 끝날 때 거기서 버려진다. `i32`를 넘기면 복사되어 부른 쪽 변수도 그대로 쓸 수 있다[^1].

```rust
fn takes_ownership(some_string: String) {
    println!("{some_string}");
} // 여기서 some_string의 힙을 돌려준다

fn gives_back(a_string: String) -> String {
    a_string // 부른 쪽으로 옮겨 간다
}
```

돌려주는 값도 옮겨 간다. 받는 쪽 변수가 새 주인이다. 쓰고 돌려받으려고 매번 넘겼다 받는 것은 번거롭다. 그래서 주인은 그대로 두고 잠깐 쓰게만 하는 참조가 있다: [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/).

### 부분 이동

구조체의 필드 하나만 옮길 수도 있다. 그러면 남은 필드는 여전히 쓸 수 있지만, 구조체 전체는 쓸 수 없다[^4].

```rust
struct P { a: String, b: String }

fn f(p: P) {
    let a = p.a;   // p.a만 옮겨 갔다
    let b = p.b;   // 남은 필드는 꺼낼 수 있다
    // let q = p;  // E0382: use of partially moved value: `p`
}
```

범위가 끝날 때는 아직 남아 있는 필드만 버려진다[^3].

### drop 순서

범위가 끝나면 그 안의 변수를 **선언한 순서의 거꾸로** 버린다. 늦게 만든 값이 먼저 만든 값을 쓰고 있을 수 있으니 늦게 만든 것부터 치운다. 한 값 안에서는 순서가 반대다. 구조체 필드는 **선언한 순서대로**, 튜플은 앞 칸부터, 배열과 `Vec`는 첫 원소부터 버린다[^3][^6].

```rust
let a = Noisy("a");
let b = Noisy("b");
let t = (Noisy("t0"), Noisy("t1"));
// 범위 끝: drop(t0) → drop(t1) → drop(b) → drop(a)
```

새 값을 대입하면 옛 값은 그 자리에서 바로 버려진다[^1]. 더 일찍 버리고 싶으면 `drop(x)`를 부른다. 이 함수는 값을 옮겨 받고 아무것도 하지 않는다. 받은 매개변수가 함수 끝에서 버려진다. `x.drop()`처럼 메서드를 직접 부르는 것은 막혀 있다(E0040). 범위 끝에서 한 번 더 불려 이중 해제가 되기 때문이다[^6].

### 설계 이유

C처럼 사람이 `free`를 부르면 잊거나 두 번 부른다. Java처럼 실행 중에 쓰레기 수집기(GC)가 치우면 언제 멈출지 예측하기 어렵고 그 비용을 늘 낸다. Rust는 "누가 치우는가"를 컴파일할 때 정해 두고, 치우는 코드는 컴파일러가 범위 끝에 끼워 넣는다[^1]. Rust는 깊은 복사를 저절로 하지 않으므로, 대입·인자 넘기기는 늘 싸다. 비싼 복사는 코드에 `.clone()`으로 보인다[^1].

### 예와 아닌 예

이동이 일어나는 예:
- `let v2 = v;` (`Vec<i32>`)
- `takes(s)`처럼 `String`을 인자로 넘기기
- `for x in v { … }` — `v` 전체가 반복문으로 옮겨 간다

이동이 아닌 예:
- `let y = x;` (`i32`) — 복사다
- `let r = &s;` — 빌림이다. 주인은 그대로 `s`다

## 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`let s2 = s1;` 뒤에 `s1`을 쓸 수 없는 이유를 "이중 해제"라는 말을 써서 설명하라. 왜 `let y = x;`(`i32`)에서는 같은 일이 없는가?</summary>

이동은 포인터·길이·용량만 베끼므로 힙 버퍼를 가리키는 변수가 둘이 된다. 둘 다 범위 끝에서 버퍼를 돌려주면 이중 해제다. 그래서 하나만 주인으로 남긴다. `i32`에는 힙도 `Drop`도 없어서, 바이트를 베낀 두 값이 서로 아무 영향도 주지 않는다. 그래서 `Copy`다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`Drop`을 구현한 타입이 `Copy`가 될 수 없는 이유는?</summary>

`Copy`는 바이트만 베낀다. 치우는 일(`Drop`)이 있는 값을 바이트째 둘로 만들면 치우는 일이 두 번 일어난다. 컴파일러는 이 조합을 E0184로 막는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">`Drop`을 구현한 구조체에서는 필드를 옮겨 꺼낼 수 없는(E0509) 이유는?</summary>

필드 하나를 꺼내 가면 그 구조체는 일부가 빈 상태가 된다. 그런데 `Drop::drop(&mut self)`는 범위 끝에서 **완전한** `self`를 받기로 되어 있다. 빈 필드가 있는 값을 넘길 수 없으니 꺼내기 자체를 막는다. `Drop`이 없는 구조체는 남은 필드만 따로 버리면 되므로 부분 이동이 된다.

</details>


## 예제

**하위목표: 누가 언제 버려지는가 적기.** 아래 코드의 출력 순서를 예측한다.

```rust
fn consume(n: Noisy) { log("consume b"); } // n은 여기서 버려진다

let a = Noisy("a");
let b = Noisy("b");
let pair = (Noisy("p0"), Noisy("p1"));
consume(b);
log("end");
```

1. *주인 바뀜 찾기:* `consume(b)`에서 `b`의 주인이 매개변수 `n`으로 바뀐다.
2. *함수 끝:* `consume`이 끝날 때 `n`이 버려진다. `consume b` 다음에 `drop(b)`.
3. *범위 끝:* 남은 변수는 `a`, `pair`다. 선언의 역순이므로 `pair`가 먼저다. `pair` 안은 앞 칸부터다.
4. *결과:* `consume b / drop(b) / end / drop(p0) / drop(p1) / drop(a)`. 실행 결과와 같다.

**경계 사례.** 반복문 안에서 옮기면 두 번째 바퀴에 이미 빈 변수를 쓰게 되므로 E0382이고, 메시지에 `value moved here, in previous iteration of loop`가 붙는다. 옮긴 변수에 새 값을 대입하면(`s = String::from("b");`) 다시 쓸 수 있다.

**가정을 빼면 깨지는 예.** "주인은 하나"를 빼고 `String`이 `Copy`라고 가정하면 앞의 그림에서 두 변수가 같은 버퍼를 두 번 돌려준다. 실제로 `#[derive(Clone, Copy)] struct S { s: String }`은 E0204로 거절된다.

## 활용

- **API의 인자 타입 고르기.** 함수가 값을 저장하거나 다른 곳에 넘기려면 값으로(`String`) 받는다. 안에서 받은 참조를 `clone`하지 않는다. 읽기만 하면 참조(`&str`)로 받는다. 받아서 버리기만 하는 값 인자를 쓰지 않는다. 부르는 쪽이 복사 여부를 정하게 하라는 지침이다[^7].
- **생성자는 값을 받는다.** `User::new(name: String)`처럼 받으면, 부르는 쪽에 이미 `String`이 있을 때 복사 없이 옮겨 넣는다. `&str`로 받고 안에서 `to_string()`하면 늘 한 번 더 할당한다.
- **`clone`은 비용이 보이는 곳이다.** 빌림 오류를 없애려고 `.clone()`을 뿌리면 힙 할당이 늘어난다. 먼저 참조로 풀 수 있는지 본다. `clone`이 맞는 경우도 많다(작은 값, 스레드로 넘기기).
- **이동의 비용.** 이동은 스택 바이트를 베끼는 것이다. `String`은 24바이트, `Vec`도 24바이트를 베낀다. 힙의 내용 크기와 상관없다.
- **clippy.** `clone_on_copy`(`Copy` 타입에 `.clone()`)는 기본으로 경고한다. `needless_pass_by_value`(값으로 받고 읽기만 함)는 `pedantic` 묶음에서, `redundant_clone`(필요 없는 `clone`)은 `nursery` 묶음에서만 경고한다. 큰 서비스에서는 CI에 `-W clippy::pedantic`을 켜고 필요 없는 것만 끈다[^8].
- **흔한 실수.** `for s in names { … }` 뒤에 `names`를 또 쓰려다 E0382. 반복만 할 거면 `for s in &names`로 빌린다.
- **자원 정리.** 파일, 소켓, 락(lock)도 `Drop`으로 닫힌다. 그래서 Rust 코드에는 `close()`나 `finally`가 거의 없다[^6].

## 연결

- 선수: [값·변수·타입](/Hongs_Blog/studies/rust/values-variables-types/), [표현식과 제어 흐름](/Hongs_Blog/studies/rust/expressions-control-flow/)(블록이 범위를 만든다)
- C의 `malloc`·`free`와 하나씩 견주기: [malloc·free ↔ 소유권과 Drop](/Hongs_Blog/studies/rust/malloc-free-vs-ownership/)
- 주인은 그대로 두고 잠깐 쓰기: [빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)
- 힙에 값 하나 두기: [Box와 힙](/Hongs_Blog/studies/rust/box-heap/). 주인이 여럿 필요할 때: [Rc·Arc·Weak](/Hongs_Blog/studies/rust/rc-arc-weak/)
- Java는 `new`로 만든 객체를 가리키는 참조를 마음대로 베끼고, 아무도 안 가리키면 GC가 치운다: [참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`let s2 = s1;`은 힙의 문자열까지 통째로 복사한다."</div>

틀렸다. 이동은 스택의 포인터·길이·용량 세 칸만 베낀다. 파이썬의 `b = a`나 Java의 참조 대입과 비슷해 보여서, 또는 C++의 복사 생성자를 떠올려서 이렇게 생각하기 쉽다. 실제로는 이동 전후의 `as_ptr()`이 같은 주소다. 힙을 두 벌로 만드는 것은 `.clone()`뿐이다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"이동하면 원래 변수의 메모리가 그 자리에서 지워진다."</div>

틀렸다. 옮긴 뒤 원래 변수는 컴파일러의 장부에서 "비었다"로 표시될 뿐이다. 실행 중에 아무 코드도 돌지 않는다. 힙을 돌려주는 일은 새 주인이 범위를 벗어날 때 한 번만 일어난다. 앞의 추적 예에서 `drop(b)`는 `consume` 안에서 한 번만 찍힌다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 출력을 예측하라. `Noisy`는 버려질 때 `drop(이름)`을 찍는다.</summary>

```rust
{ let mut v = Noisy("old"); println!("before {}", v.0); v = Noisy("new"); println!("after"); }
```
**답:** `before old` / `drop(old)` / `after` / `drop(new)`.<br>
**이유:** 새 값을 대입하면 옛 값은 대입하는 그 자리에서 버려진다. 범위 끝에서는 지금 들어 있는 `new`만 버려진다.<br>
**흔한 오답:** `drop(old)`를 맨 끝에 둔다. 옛 값을 범위 끝까지 들고 있는다고 생각한 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 컴파일되는가? 안 되면 오류 코드와 이유는?</summary>

```rust
let s = String::from("a");
for _ in 0..2 { drop(s); }
```
**답:** 안 된다. E0382, `value moved here, in previous iteration of loop`.<br>
**이유:** 첫 바퀴의 `drop(s)`가 `s`를 옮겨 간다. 둘째 바퀴에는 빈 변수를 다시 옮기려 하게 된다. 컴파일러는 반복문이 두 번 이상 돌 수 있다는 것만 보고 거절한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 중 `let b = a;` 뒤에 `a`를 계속 쓸 수 있는 타입을 모두 고르고, 나머지는 왜 안 되는지 쓰라: `u64`, `(i32, char)`, `(i32, String)`, `&String`, `&mut String`, `Vec<u8>`.</summary>

**답:** `u64`, `(i32, char)`, `&String`.<br>
**이유:** 이 셋은 `Copy`다. 튜플은 칸이 모두 `Copy`일 때만 `Copy`다. 공유 참조는 `Copy`다. `(i32, String)`과 `Vec<u8>`은 힙을 가진 칸이 있어서 이동한다. `&mut String`은 `Copy`가 아니다. 가변 참조가 둘이 되면 안 되기 때문이다([빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "모든 필드가 `Copy`이면 구조체에 `#[derive(Clone, Copy)]`를 붙일 수 있다"는 말을 깨는 예를 만들라. 오류 코드는?</summary>

**답:** `#[derive(Clone, Copy)] struct S; impl Drop for S { fn drop(&mut self) {} }`. 필드가 없으니 모두 `Copy`인 셈이지만 E0184로 거절된다.<br>
**이유:** `Drop`을 구현한 타입은 `Copy`가 될 수 없다는 조건이 하나 더 있다.

</details>


[^1]: The Rust Programming Language, 4.1 What Is Ownership? (Ownership Rules, Variables and Data Interacting with Move, Ownership and Functions, Return Values and Scope) — https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html
[^2]: std 문서, `String`, Representation — https://doc.rust-lang.org/std/string/struct.String.html
[^3]: The Rust Reference, Destructors (Drop scopes, 필드·튜플·배열의 drop 순서, partially initialized) — https://doc.rust-lang.org/reference/destructors.html
[^4]: The Rust Reference, Expressions, Moved and copied types — https://doc.rust-lang.org/reference/expressions.html
[^5]: std 문서, `std::marker::Copy` (Copy와 Clone의 차이, When can my type be Copy?) — https://doc.rust-lang.org/std/marker/trait.Copy.html
[^6]: The Rust Programming Language, 15.3 Running Code on Cleanup with the Drop Trait — https://doc.rust-lang.org/book/ch15-03-drop.html
[^7]: Rust API Guidelines, Flexibility, C-CALLER-CONTROL: Caller decides where to copy and place data — https://rust-lang.github.io/api-guidelines/flexibility.html
[^8]: Clippy Lints, `clone_on_copy`(complexity) — https://rust-lang.github.io/rust-clippy/stable/index.html. `needless_pass_by_value`가 pedantic에서만, `redundant_clone`이 nursery에서만 경고하는 것은 rustc 1.99.0의 `clippy-driver`로 확인했다.
{% endraw %}
