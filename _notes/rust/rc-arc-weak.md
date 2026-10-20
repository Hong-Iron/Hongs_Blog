---
layout: "note"
title: "Rc·Arc·Weak"
display_title: "Rc·Arc·Weak (Reference Counting)"
kind: "concept"
kind_label: "자료구조"
num: "28"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
aliases: ["Rc", "Rc<T>", "Arc", "Arc<T>", "Weak", "Weak<T>", "Reference Counting", "참조 세기", "strong_count", "weak_count", "Reference Cycle", "순환 참조", "Shared Ownership"]
description: "Rc는 값 하나를 여러 곳이 함께 가지게 하고, 지금 몇 곳이 쥐고 있는지 세다가 0이 되는 순간 치운다. 누가 마지막까지 쓸지 미리 알 수 없을 때 쓴다. 대신 함께 가진 값은 읽기만 할 수 있고, 둘이 서로를 쥐면 개수가 영영 0이 되지 않아 메모리가 샌다. 서로 가리켜야 하는…"
prev_url: "/studies/rust/box-heap/"
prev_title: "Box와 힙"
next_url: "/studies/rust/interior-mutability/"
next_title: "내부 가변성"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "28_rc-arc-weak_verify.rs", "u": "/studies/rust/code/28_rc-arc-weak_verify/", "r": "검증"}]
permalink: "/studies/rust/rc-arc-weak/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

`Rc`는 값 하나를 여러 곳이 함께 가지게 하고, 지금 몇 곳이 쥐고 있는지 세다가 0이 되는 순간 치운다. 누가 마지막까지 쓸지 미리 알 수 없을 때 쓴다. 대신 함께 가진 값은 읽기만 할 수 있고, 둘이 서로를 쥐면 개수가 영영 0이 되지 않아 메모리가 샌다. 서로 가리켜야 하는 한쪽은 개수에 들어가지 않는 약한 연결(`Weak`)로 둔다. 스레드 여럿이 함께 쥐려면 개수를 세는 동안 서로 끼어들 수 없게 만든 `Arc`를 쓰는데, 그만큼 조금 느리다.

</div>


## 예시로 보기

`Box`는 주인이 한 명이다. 그런데 그래프에서는 노드 하나를 간선 여러 개가 가리킨다. 어느 간선이 마지막까지 남을지는 실행해 봐야 안다. 주인을 한 명으로 정할 수 없으니, 주인 여럿이 함께 가지고 마지막 주인이 떠날 때 치우는 방법이 필요하다[^1].

```rust
let a = Rc::new(String::from("shared"));   // 개수 1
let b = Rc::clone(&a);                     // 개수 2
{
    let _c = Rc::clone(&a);                // 개수 3
}                                          // _c가 사라져 2
drop(b);                                   // 1
```

검증 코드에서 단계마다 `Rc::strong_count(&a)`를 찍으면 `[1, 2, 3, 2, 1]`이다. `Rc::clone`은 문자열을 복사하지 않는다. 같은 힙 자리를 가리키는 손잡이를 하나 더 만들고 개수를 1 올릴 뿐이다[^1][^3]. 검증 코드에서 두 손잡이의 `as_ptr()`이 같았고 `Rc::ptr_eq`도 참이었다. 손잡이(`Rc`, `Arc`, `Weak`)는 모두 8바이트, 주소 한 칸이었다. 그러니 개수는 손잡이마다 따로 있는 것이 아니라 힙에서 값 옆에 하나 있다.

```
스택          힙
a ──┐       ┌──────────────────────────┐
    ├─────► │ strong 2 · weak 0        │
b ──┘       │ "shared"                 │
            └──────────────────────────┘
```

함께 가진 값은 고칠 수 없다. `Rc`는 안의 값을 공유 참조로만 보여 주기 때문이다[^1][^3]. `Rc<Vec<i32>>`에 `push`하면 컴파일되지 않는다.

```
error[E0596]: cannot borrow data in an `Rc` as mutable
```

함께 가지면서 고쳐야 하면 `Rc` 안에 `RefCell`을 넣는다[^3]. [내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/)에서 다룬다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: `strong_count` 변화 `[1, 2, 3, 2, 1]`, 손잡이 크기 8바이트, Rc 순환에서 `Drop` 0번, `Weak`로 고친 트리에서 `Drop` 2번, 부모가 사라진 뒤 `upgrade()`가 `None`, `Arc`로 스레드 4개가 나눠 읽은 합 100, E0277(`Rc`, `Box<Rc<i32>>`)·E0596, clippy 린트 두 개를 실행해 확인했다 — [28_rc-arc-weak_verify.rs](/Hongs_Blog/studies/rust/code/28_rc-arc-weak_verify/)</div>

</div>


## 정의

`Rc<T>`는 힙에 놓인 `T` 하나를 여러 손잡이가 함께 가지게 한다[^3]. 힙의 그 자리에는 개수 두 개가 붙어 있다. 값을 쥐고 있는 강한 손잡이 수(strong)와 약한 손잡이 수(weak)다.

| 연산 | strong | weak | 일어나는 일 |
|---|---|---|---|
| `Rc::new(v)` | 1 | 0 | 힙에 자리를 받아 `v`를 넣는다 |
| `Rc::clone(&a)` | +1 | | 같은 자리를 가리키는 손잡이 하나 더 |
| `Rc` 하나가 범위를 벗어남 | −1 | | 0이 되면 값을 drop |
| `Rc::downgrade(&a)` | | +1 | `Weak` 손잡이를 만든다 |
| `w.upgrade()` | 값이 살아 있으면 +1 | | `Option<Rc<T>>`. 값이 이미 치워졌으면 `None` |
| `Weak` 하나가 범위를 벗어남 | | −1 | |

두 가지 규칙이 늘 지켜진다.

- 값은 strong이 1 이상인 동안만 살아 있다. weak가 몇이든 상관없다[^2].
- 힙 자리 자체는 strong과 weak가 모두 0이 될 때 돌려준다. `Weak`는 값을 살려 두지 않지만 자리는 붙잡는다[^3].

`Weak`로는 값을 바로 쓸 수 없다. 값이 이미 치워졌을 수 있기 때문이다[^3]. 쓸 때마다 `upgrade()`로 `Option`을 받아, 없는 경우를 반드시 처리한다. 그래서 치워진 값을 가리키는 주소를 쓰는 일이 생기지 않는다[^2].

## 순환이 새는 이유와 Weak로 끊기

두 노드가 서로를 `Rc`로 가리키게 만든다.

```rust
struct StrongNode { next: RefCell<Option<Rc<StrongNode>>> }

let x = Rc::new(StrongNode { next: RefCell::new(None) });
let y = Rc::new(StrongNode { next: RefCell::new(Some(Rc::clone(&x))) });
*x.next.borrow_mut() = Some(Rc::clone(&y));     // x → y → x
```

이때 두 노드의 strong은 `(2, 2)`다. 변수 `x`, `y`가 범위를 벗어나면 각각 1씩 줄지만, 서로가 쥐고 있는 1이 남는다. 검증 코드에서 범위를 벗어난 뒤 `Drop`은 한 번도 돌지 않았다. 책도 고리 안의 개수는 0이 되지 않아 값이 영영 치워지지 않는다고 적는다[^2].

```
범위를 벗어난 뒤:
          ┌──────────────┐  next   ┌──────────────┐
          │ x: strong 1  │ ──────► │ y: strong 1  │
          │              │ ◄────── │              │
          └──────────────┘  next   └──────────────┘
   (이 둘을 가리키는 변수는 이제 없다)
```

고치는 법은 방향을 정하는 것이다. 트리라면 부모가 자식을 가지고(`Rc`), 자식은 부모를 가리키기만 한다(`Weak`)[^2][^3].

```rust
struct TreeNode {
    name: &'static str,
    parent: RefCell<Weak<TreeNode>>,
    children: RefCell<Vec<Rc<TreeNode>>>,
}

*leaf.parent.borrow_mut() = Rc::downgrade(&parent);
parent.children.borrow_mut().push(Rc::clone(&leaf));
```

| 시점 | parent strong | parent weak | leaf strong | `leaf.parent.upgrade()` |
|---|---|---|---|---|
| 연결 직후 | 1 | 1 | 2 | `Some("root")` |
| 범위를 벗어난 뒤 | — | — | — | (둘 다 치워짐, `Drop` 2번) |

부모만 먼저 사라지는 경우도 있다. 검증 코드에서 `leaf`는 바깥에 두고 부모만 안쪽 범위에서 만들었다. 범위를 벗어나자 부모의 `Drop`만 돌았고, 그 뒤 `leaf.parent.upgrade()`는 `None`이었다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">고리에 `Weak`가 하나라도 있으면 새지 않는 이유</summary>

1. *고리가 모두 `Rc`일 때.* 고리 위의 노드는 저마다 앞 노드에게서 강한 연결 하나를 받는다. 그래서 바깥 변수가 모두 사라져도 각 노드의 strong은 1 이상이다. 값은 strong이 1 이상인 동안 살아 있으므로(정의의 첫 규칙) 아무도 치워지지 않는다.
2. *연결 하나를 `Weak`로 바꾸면.* 그 연결이 가리키는 노드 $$v$$는 고리 안에서 강한 연결을 받지 않는다. 바깥 변수가 사라지면 $$v$$의 strong은 0이 되어 치워진다.
3. *연쇄.* $$v$$가 치워지면 $$v$$가 들고 있던 `Rc` 필드도 drop되어 다음 노드의 strong이 1 줄고, 그 노드도 0이 된다. 고리를 따라 차례로 모두 치워진다.
4. 책은 같은 결론을 "약한 참조가 섞인 고리는 관련된 값들의 strong이 0이 되면 끊긴다"로 적는다[^2]. 검증 코드의 `Drop` 2번(실험)이 이 흐름과 맞는다.

</details>


## Rc와 Arc

`Rc`는 개수를 보통의 메모리 쓰기로 고친다. 그래서 아주 싸지만, 두 스레드가 동시에 개수를 고치면 값이 틀어질 수 있다. 그래서 `Rc`는 `Send`가 아니고, 다른 스레드로 넘기려 하면 컴파일러가 막는다[^3].

```
error[E0277]: `Rc<i32>` cannot be sent between threads safely
```

`Arc`의 A는 atomic이다. 개수를 고치는 동안 다른 스레드가 끼어들 수 없는 원자적 연산으로 센다[^5]. 쓰는 법은 `Rc`와 같다[^5]. 검증 코드에서 `Arc<Vec<u64>>`를 스레드 4개에 `Arc::clone`으로 나눠 주고 각자 원소 하나에 10을 곱해 돌려받았다. 합은 100이었고, 스레드가 모두 끝난 뒤 strong은 1로 돌아왔다.

| | `Box<T>` | `Rc<T>` | `Arc<T>` |
|---|---|---|---|
| 주인 | 한 명 | 여럿 | 여럿 |
| 안의 값 고치기 | 된다 | 안 된다. `RefCell`과 함께 | 안 된다. `Mutex`와 함께 |
| 다른 스레드로 넘기기 | 안의 값에 달렸다. `Box<i32>`는 되고 `Box<Rc<i32>>`는 E0277 | 안 된다(E0277) | `T`가 `Send + Sync`면 된다[^4] |
| 개수 세는 비용 | 없음 | 보통 메모리 쓰기 | 원자적 연산 |

원자적 연산은 보통 메모리 접근보다 비싸다. 스레드끼리 나누지 않을 값이면 `Rc`가 싸다[^4]. 책도 스레드 안전에는 성능 비용이 따르므로 꼭 필요할 때만 치르라고 적는다[^5].

`Arc`는 주인을 여럿 두는 일만 스레드에 안전하게 만든다. 안의 데이터까지 안전하게 만들어 주지는 않는다. `Arc<T>`는 `T`가 `Send`이고 `Sync`일 때만 스레드 사이를 오갈 수 있다. 그래서 `Arc<RefCell<T>>`는 스레드끼리 나눌 수 없다[^4]. 고쳐야 할 데이터는 `Arc<Mutex<T>>`로 둔다([Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/)).

## 활용

- **`Rc::clone(&a)`로 쓰기.** `a.clone()`도 같은 일을 하지만, `Rc::clone(&a)`로 쓰면 "깊은 복사가 아니라 개수만 올린다"가 눈에 보인다. 책과 std 문서 모두 이 형태를 관례로 든다[^1][^3]. 팀 규칙으로 강제하려면 clippy `clone_on_ref_ptr`를 켠다. 검증 코드에서 이 린트는 기본으로 꺼져 있었고, `-W clippy::clone_on_ref_ptr`를 주자 ``using `.clone()` on a ref-counted pointer``로 걸렸다.
- **서버의 공유 상태.** 설정, 연결 풀, 캐시처럼 모든 요청 처리 코드가 읽는 값은 한 번 만들어 `Arc`로 나눠 준다. 고쳐야 하는 부분만 `Mutex`나 `RwLock`으로 감싼다([axum으로 HTTP 서비스 만들기](/Hongs_Blog/studies/rust/axum-http/)).
- **뒤쪽 연결은 `Weak`.** 트리의 부모, [이중 연결 리스트](/Hongs_Blog/studies/data-structures/linked-list-variants/)의 왼쪽 링크(`llink`), 관찰자 목록처럼 "가리키되 살려 둘 책임은 없는" 연결은 `Weak`로 둔다. 컴파일러는 고리를 잡아 주지 않는다. 고리를 피하는 것은 프로그래머의 몫이라고 책이 적는다[^2].
- **누수를 찾는 법.** 오래 도는 프로그램의 메모리가 계속 는다면, 의심 가는 타입에 `Drop`을 구현해 횟수를 세 본다. 검증 코드와 [에러와 메모리 연습](/Hongs_Blog/studies/rust/errors-memory-practice/)의 p3가 이 방법을 쓴다.
- **개수로 판단하지 않기.** `Arc::strong_count`는 불러도 안전하지만, 다른 스레드가 언제든 개수를 바꿀 수 있다. 값을 읽은 순간과 그 값으로 무언가 하는 순간 사이에도 바뀐다[^4]. "개수가 1이면 내가 마지막"이라는 판단을 여러 스레드 코드에 쓰지 않는다.
- **clippy.** `arc_with_non_send_sync`(suspicious, 기본 경고)는 `Send`나 `Sync`가 아닌 값을 `Arc`에 담는 코드를 잡는다[^6]. 검증 코드에서 `Arc::new(RefCell::new(0))`에 이 경고가 나왔고, 도움말은 스레드끼리 나누지 않으면 `Rc`로 바꾸라고 했다.
- **성능.** `Rc::clone`은 개수만 올리므로 깊은 복사보다 훨씬 싸다[^1]. 그래도 개수를 고칠 때마다 힙의 개수 칸을 읽고 써야 한다. 빌림(`&T`)으로 충분한 자리에서는 손잡이를 복제하지 않고 참조를 넘긴다.

## 연결

- 선수: [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/), [Box와 힙](/Hongs_Blog/studies/rust/box-heap/)
- 함께 가지면서 고치기: [내부 가변성](/Hongs_Blog/studies/rust/interior-mutability/)(`Rc<RefCell<T>>`). std는 `Rc`의 개수 칸 자체를 `Cell<usize>`로 둔다. `Clone::clone`이 `&self`만 받는데도 개수를 올려야 하기 때문이다[^7].
- 스레드에서 나눠 쓰기: [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/), [Mutex와 RwLock](/Hongs_Blog/studies/rust/mutex-rwlock/)
- 안전한 코드로 새는 다른 길(`mem::forget`, `Box::leak`): [malloc·free ↔ 소유권과 Drop](/Hongs_Blog/studies/rust/malloc-free-vs-ownership/)
- Java는 참조를 마음대로 베끼고, 아무도 가리키지 않게 된 객체를 언제 치울지는 JVM이 정한다([참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)). `Rc`는 개수가 0이 되는 그 줄에서 바로 치운다. 언제 치워지는지 코드만 보고 알 수 있다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** `let a = Rc::new(5); let b = Rc::clone(&a); { let c = Rc::clone(&b); } let w = Rc::downgrade(&a); drop(b);` 이 끝난 뒤 `Rc::strong_count(&a)`와 `Rc::weak_count(&a)`, 그리고 `drop(a)` 뒤의 `w.upgrade()`는?</summary>

**답:** strong 1, weak 1, `None`.<br>
**이유:** `c`는 블록 끝에서, `b`는 `drop`으로 사라졌다. `b`를 복제해도 같은 자리의 개수가 오른다. `downgrade`는 weak만 올린다. `a`까지 사라지면 strong이 0이 되어 값이 치워지고, `Weak`가 남아 있어도 `upgrade`는 `None`이다. 검증 코드의 `card_c1_trace` 테스트가 이 순서 그대로 돌려 확인했다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 부모가 자식을 `Rc`로, 자식도 부모를 `Rc`로 가리키는 트리를 만들고 변수를 모두 버렸다. 메모리는 돌아오는가? 왜인가?</summary>

**답:** 돌아오지 않는다. 부모의 strong에는 자식이 쥔 1이, 자식의 strong에는 부모가 쥔 1이 남아 둘 다 0이 되지 않는다. 자식→부모를 `Weak`로 바꾸면 부모의 strong이 0이 되어 치워지고, 그 결과 자식의 strong도 0이 된다.<br>
**흔한 오답:** "변수가 범위를 벗어나면 Rust가 치워 준다." 범위를 벗어날 때 하는 일은 strong을 1 줄이는 것뿐이다. 0이 되어야 치운다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음에 `Box`, `Rc`, `Arc` 중 무엇을 쓰는가? (가) 웹 서버의 모든 요청 처리 태스크가 읽는 설정 (나) 한 스레드 GUI에서 여러 위젯이 함께 보는 테마 (다) 연결 리스트의 다음 노드</summary>

**답:** (가) `Arc`, (나) `Rc`, (다) `Box`.<br>
**이유:** (가)는 여러 스레드가 함께 가진다. (나)는 주인이 여럿이지만 한 스레드라 원자적 연산 비용을 낼 이유가 없다. (다)는 다음 노드의 주인이 앞 노드 하나뿐이다.

</details>


[^1]: The Rust Programming Language, 15.4 `Rc<T>`, the Reference Counted Smart Pointer (주인 여럿, `Rc::clone`은 개수만 올림, `strong_count`, 읽기 전용) — https://doc.rust-lang.org/book/ch15-04-rc.html
[^2]: The Rust Programming Language, 15.6 Reference Cycles Can Leak Memory (고리의 개수는 0이 되지 않음, `Weak`와 `upgrade`, 트리 예, 고리를 피하는 것은 프로그래머의 책임) — https://doc.rust-lang.org/book/ch15-06-reference-cycles.html
[^3]: std 문서, Module `std::rc` (공유 소유권, 원자적이지 않은 개수 세기와 `Send` 아님, `Weak`가 자리는 살려 둠, `Rc::clone(&from)` 관례, 안을 고치려면 `Cell`·`RefCell`) — https://doc.rust-lang.org/std/rc/index.html
[^4]: std 문서, Struct `std::sync::Arc` (원자적 연산의 비용, `T: Send + Sync`일 때만 `Send`·`Sync`, `Arc<RefCell<T>>`, `strong_count`의 주의점) — https://doc.rust-lang.org/std/sync/struct.Arc.html
[^5]: The Rust Programming Language, 16.3 Shared-State Concurrency — Atomic Reference Counting with `Arc<T>` — https://doc.rust-lang.org/book/ch16-03-shared-state.html
[^6]: Clippy Lints, `arc_with_non_send_sync`(suspicious, warn) — https://rust-lang.github.io/rust-clippy/master/index.html#arc_with_non_send_sync . `clone_on_ref_ptr`는 같은 목록의 린트로, 검증 코드에서 clippy 1.99로 기본 꺼짐과 경고문을 확인했다.
[^7]: std 문서, Module `std::cell` — When to choose interior mutability (`Clone` 구현 안의 변경: `Rc<T>`의 개수는 `Cell<usize>`) — https://doc.rust-lang.org/std/cell/index.html
{% endraw %}
