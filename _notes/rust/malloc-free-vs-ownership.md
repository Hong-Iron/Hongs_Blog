---
layout: "note"
title: "malloc·free ↔ 소유권과 Drop"
display_title: "malloc·free ↔ 소유권과 Drop: 힙 자리마다 돌려줄 사람 한 명"
kind: "concept"
kind_label: "브리지"
num: "06"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["malloc free vs ownership", "RAII", "해제 뒤 사용", "Use After Free", "이중 해제", "Double Free", "메모리 누수", "Memory Leak", "mem::forget", "Box::leak"]
description: "C에서는 빌린 힙 자리를 언제 돌려줄지 사람이 기억한다. Rust에서는 힙 자리마다 주인 변수가 하나 있고, 주인이 범위를 벗어날 때 컴파일러가 끼워 넣은 코드가 돌려준다. 그래서 C의 네 실수 가운데 해제 뒤 사용, 이중 해제, 지역 변수 주소 돌려주기는 컴파일 오류가 된다. 누…"
prev_url: "/studies/rust/ownership-move/"
prev_title: "소유권과 이동"
next_url: "/studies/rust/borrowing-references/"
next_title: "빌림과 참조"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "06_malloc-free-vs-ownership_verify.rs", "u": "/studies/rust/code/06_malloc-free-vs-ownership_verify/", "r": "검증"}]
permalink: "/studies/rust/malloc-free-vs-ownership/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

C에서는 빌린 힙 자리를 언제 돌려줄지 사람이 기억한다. Rust에서는 힙 자리마다 주인 변수가 하나 있고, 주인이 범위를 벗어날 때 컴파일러가 끼워 넣은 코드가 돌려준다. 그래서 C의 네 실수 가운데 해제 뒤 사용, 이중 해제, 지역 변수 주소 돌려주기는 컴파일 오류가 된다. 누수만은 다르다. Rust도 안전한 코드로 샐 수 있고, 그것을 버그로 막아 주지 않는다.

</div>


## 먼저 비교해 보기

아래 대응표를 펼치기 전에, 왼쪽 C 코드의 각 줄이 오른쪽 Rust 코드의 어느 줄과 같은 일을 하는지, 그리고 C 쪽에서 실수할 수 있는 자리가 Rust 쪽에서는 어떻게 되는지 먼저 적어 본다.

| 자료구조: [동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/) | Rust: [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/) |
|---|---|
| `nums = calloc(n, sizeof *nums);` | `let nums = vec![0.0; n];` |
| `if (nums == NULL) return 1;` | (할당이 실패하면 기본으로 프로그램을 멈춘다) |
| `nums[i] = …;` | `nums[i] = …;` |
| `p = realloc(p, 8 * sizeof *p);` | `v.resize(8, 0);` 또는 `v.push(x)` |
| `free(nums);` | (범위 끝 `}`에서 저절로) |
| `void problem(int N) { float *nums = calloc(…); }` — 누수 | `fn problem(n: usize) { let nums = vec![0.0f32; n]; }` |
| `free(p); free(p);` | `drop(b); drop(b);` |
| `free(p); … p[0]` | `drop(b); … *b` |
| `int *q = p; p = realloc(p, …); q[0]` | `let q = &v[0]; v.push(50); println!("{q}")` |

<details class="callout callout-example" markdown="1">
<summary class="callout-title" markdown="span">대응 관계</summary>

| C | Rust | 같은 구조 |
|---|---|---|
| `malloc`·`calloc`이 돌려준 주소 | `Box<T>`·`Vec<T>`·`String`의 포인터 칸 | 힙 덩어리의 시작 주소를 스택 변수가 들고 있다 |
| "이 주소를 `free`할 책임이 있는 변수"(주석이나 머릿속 약속) | 주인 변수(컴파일러가 기록) | 덩어리마다 돌려줄 사람 한 명 |
| `free(p)` | 주인이 범위를 벗어날 때 부르는 `Drop::drop` | 돌려주기 |
| `q = p` (주소 베끼기) | `let b = a;` 이동 | C는 주인이 둘이 되고, Rust는 `a`를 비운다 |
| 누수: 주소를 아는 변수가 사라짐 | 주인이 범위를 벗어나면 돌려주므로 보통은 생기지 않는다 | — |
| 해제 뒤 사용 | E0382(옮긴 값 사용), E0505(빌린 동안 옮김) | 돌려준 자리를 다시 만지기 |
| 이중 해제 | E0382(`drop`이 값을 옮겨 가므로 두 번째는 빈 변수) | 같은 덩어리를 두 번 돌려주기 |
| 함수 안 변수의 주소 돌려주기 | E0106·E0515 | 사라질 자리를 가리키는 주소 |
| `realloc` 뒤 옛 주소로 읽기 | E0502(참조가 살아 있는데 `push`) | 버퍼가 옮겨 갈 수 있는데 옛 주소를 쥠 |

</details>


컴파일 오류 코드는 모두 rustc 1.99로 확인했다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 다섯 오류 코드(E0382 두 가지, E0505, E0515, E0502)를 rustc로 확인했다. 받기·돌려주기 횟수를 세는 전역 할당자로 `Box` 하나 1/1, C 문서의 `problem(100)`을 Rust로 옮겨 세 번 부르면 3/3, 대입으로 바꾸면 2/2, `Rc` 순환 4/0, `mem::forget` 1/0, `Box::leak` 1/0을 확인했다 — [06_malloc-free-vs-ownership_verify.rs](/Hongs_Blog/studies/rust/code/06_malloc-free-vs-ownership_verify/)</div>

</div>


## 어디까지 같은가

**같은 것.** 힙을 쓰는 방식은 같다. Rust의 `Vec`도 할당자에게 덩어리를 받고, 꽉 차면 더 큰 덩어리를 받아 옮기고 옛 것을 돌려준다. C 문서의 `realloc` 그림과 같은 일이다. 포인터 변수와 그것이 가리키는 힙 덩어리가 서로 다른 칸이라는 그림도 같다. Rust의 `String`은 스택의 세 칸(포인터, 길이, 용량)과 힙의 글자로 나뉜다[^1].

**C에서 실행 중에 터지던 것이 컴파일 오류가 되는 것.**

- *이중 해제.* `drop(b)`는 `b`를 옮겨 받는 함수다. 두 번째 `drop(b)`는 이미 비워진 `b`를 쓰는 것이라 E0382다. `b.drop()`처럼 치우는 메서드를 직접 부르는 길도 E0040으로 막혀 있다. 그래서 같은 값에 대한 drop은 꼭 한 번만 일어난다[^2].
- *해제 뒤 사용.* 주인을 버린 뒤 그 값을 쓰면 E0382다. 참조를 쥔 채 주인을 버리면 E0505다.
- *지역 변수 주소 돌려주기.* E0106 또는 E0515다([수명](/Hongs_Blog/studies/rust/lifetimes/)).
- *`realloc` 뒤 옛 주소.* C 문서의 확인 문제 C3에서 `q`가 옛 덩어리를 가리키던 상황이다. Rust에서는 `let q = &v[0];`을 쥔 채 `v.push(50)`을 부르면 E0502다. `push`는 버퍼를 옮길 수 있는 가변 빌림이고, 공유 참조가 살아 있는 동안 가변 빌림은 안 된다([빌림과 참조](/Hongs_Blog/studies/rust/borrowing-references/)).

**대응이 깨지는 곳 1: 누수는 막아 주지 않는다.** Rust의 약속은 "메모리 안전"이고 "새지 않음"은 그 안에 없다. Book은 누수가 Rust에서 메모리 안전하다고 적는다[^3]. 안전한 코드만으로 새는 길이 셋 있다.

| 방법 | 무슨 일 | 받기/돌려주기 |
|---|---|---|
| `Rc` 순환 | 서로를 가리키는 두 `Rc`는 개수가 0이 되지 않아 영영 안 치워진다[^3] | 4 / 0 |
| `std::mem::forget(v)` | 값을 가져가서 drop 없이 잊는다. 안전 약속에 "drop이 꼭 돈다"가 없기 때문에 `unsafe`가 아니다[^4] | 1 / 0 |
| `Box::leak(b)` | 일부러 새게 하고 `&'static mut T`를 돌려준다. 프로그램 끝까지 살 값에 쓴다[^5] | 1 / 0 |

`std::process::exit`도 drop을 돌리지 않는다[^6]. 그래서 `unsafe` 코드를 쓸 때 "부른 쪽이 반드시 drop해 줄 것"이라고 믿으면 안 된다[^4].

**대응이 깨지는 곳 2: 할당 실패.** C는 `NULL`을 돌려주고 부른 쪽이 검사한다. `Vec::new`, `Box::new`는 실패를 값으로 돌려주지 않는다. 메모리가 모자라면 표준 라이브러리는 기본으로 표준 에러에 메시지를 찍고 프로세스를 끝낸다(abort)[^8]. 실패를 값으로 받고 싶으면 `Vec::try_reserve`처럼 `try_`가 붙은 함수를 쓴다. `try_reserve(usize::MAX)`가 `Err`를 돌려주는 것을 코드로 확인했다[^s2].

**대응이 깨지는 곳 3: 언제 돌려주는가.** C는 `free`를 부른 줄에서 돌려준다. Rust는 주인이 범위를 벗어나는 `}`에서, 또는 새 값을 대입하는 줄에서 돌려준다. 일찍 돌려주려면 `drop(x)`를 부른다[^2]. 한 범위 안의 여러 값은 선언의 역순으로 돌려준다[^6].

## 이 연결로 얻는 것

- **C 버그 목록을 컴파일러 오류 목록으로 읽기.** E0382·E0505·E0502·E0515를 보면 "C였다면 해제 뒤 사용이었을 자리"라고 번역해 읽는다. 오류를 없애려고 `clone`을 붙이기 전에, 원래 무엇이 위험했는지부터 본다.
- **C 라이브러리를 감쌀 때.** C의 `create`/`destroy` 짝을 Rust 구조체로 감싸고 `destroy`를 `Drop`에 넣으면, 부르는 쪽은 `free`를 잊을 수 없다. 이것이 표준 라이브러리의 `File`, `Vec`, `MutexGuard`가 쓰는 방식이다([unsafe와 안전한 감싸기](/Hongs_Blog/studies/rust/unsafe-abstractions/)).
- **누수 점검은 따로 한다.** 오래 도는 서버에서는 `Rc` 순환과 끝없이 자라는 `HashMap`·채널 큐가 새는 주범이다. 컴파일러가 잡아 주지 않으니, 부모 쪽 참조는 `Weak`로 두고 큐에는 상한을 둔다([Rc·Arc·Weak](/Hongs_Blog/studies/rust/rc-arc-weak/), [백프레셔와 큐 제한](/Hongs_Blog/studies/rust/backpressure/)).
- **clippy.** `mem_forget`는 `restriction` 묶음 린트라 기본으로는 꺼져 있다. `Drop`이 있는 값을 `forget`하는 것을 금지하고 싶은 코드베이스는 이 린트를 켠다[^7].

## 전이 문제

운영체제의 파일 서술자(file descriptor)도 빌리고 돌려주는 자원이다. `open`이 번호를 주고, `close`로 돌려준다. 프로세스마다 열 수 있는 개수에 한도가 있다. C에서 `fd = open(…)` 뒤 `close`를 잊는 것, `close(fd)`를 두 번 부르는 것, `close` 뒤 `read(fd)`를 부르는 것이 Rust의 `std::fs::File`에서는 각각 어떻게 되는가? 그리고 Rust로도 파일이 닫히지 않게 만드는 방법을 하나 들라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

`File`이 주인이다. 잊기: 주인이 범위를 벗어나면 `Drop`이 닫는다. 두 번 닫기: 닫는 길은 drop뿐이고, drop은 한 번만 일어난다(`drop(f)` 두 번은 E0382). 닫은 뒤 읽기: `drop(f)` 뒤 `f.read(…)`는 E0382다. 닫히지 않게 만들기: `std::mem::forget(f)`. std 문서도 이 방법이 `File`을 새게 해서 파일이 닫히지 않는다고 예로 든다[^4]. 메모리와 같은 구조가 "개수가 정해진 자원"이면 무엇에나 통한다. 락, 소켓, DB 연결도 같다.

</details>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** C 문서의 `problem` 함수를 Rust로 옮기고, `problem(100)`을 세 번 부른 뒤 받기·돌려주기 횟수를 예측하라.</summary>

```c
void problem(int N) { float *nums = calloc((size_t)N, sizeof(float)); nums[0] = 1.0f; }
```
**답:** `fn problem(n: usize) { let mut nums = vec![0.0f32; n]; nums[0] = 1.0; }`. 받기 3번, 돌려주기 3번.<br>
**이유:** `nums`가 주인이고, 함수 끝 `}`에서 범위를 벗어나며 버퍼를 돌려준다. C에서는 받기 3번, 돌려주기 0번(1,200바이트 누수)이었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "Rust의 안전한 코드에서는 메모리가 절대 새지 않는다"를 깨는 예를 `unsafe` 없이 두 가지 들라.</summary>

**답:** `std::mem::forget(vec![1u8; 64])`, `Box::leak(Box::new(41))`, 서로를 가리키는 두 `Rc`. 이 중 둘.<br>
**이유:** Rust가 약속하는 것은 해제 뒤 사용·이중 해제가 없다는 것이다. drop이 꼭 돈다는 약속은 없다. 실험에서 세 경우 모두 돌려주기가 0번이었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** C의 이중 해제 `free(p); free(p);`를 Rust로 옮긴 `drop(b); drop(b);`는 왜 컴파일되지 않는가? 오류 코드는?</summary>

**답:** E0382, `use of moved value: `b``.<br>
**이유:** `drop`은 인자를 값으로 받는 평범한 함수다. 첫 호출이 `b`를 옮겨 가서 `b`는 빈 변수가 된다. 둘째 호출은 빈 변수를 쓰는 것이다. 치우기를 "주인 옮기기"로 표현했기 때문에 두 번 치우기가 옮긴 값 사용 오류로 바뀐다.

</details>


## 출처

- 상대 문서: [동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/) (네 함수, 누수 예 `problem`, 네 가지 실수 표, 확인 문제 C3의 `realloc` 뒤 `q`)

[^1]: The Rust Programming Language, 4.1 What Is Ownership? (The Stack and the Heap, Memory and Allocation) — https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html
[^2]: The Rust Programming Language, 15.3 Running Code on Cleanup with the Drop Trait (E0040, `std::mem::drop`) — https://doc.rust-lang.org/book/ch15-03-drop.html
[^3]: The Rust Programming Language, 15.6 Reference Cycles Can Leak Memory — https://doc.rust-lang.org/book/ch15-06-reference-cycles.html
[^4]: std 문서, `std::mem::forget` (forget이 unsafe가 아닌 이유, File 예) — https://doc.rust-lang.org/std/mem/fn.forget.html
[^5]: std 문서, `Box::leak` — https://doc.rust-lang.org/std/boxed/struct.Box.html
[^6]: The Rust Reference, Destructors (drop 순서, `process::exit`와 abort에서는 돌지 않음) — https://doc.rust-lang.org/reference/destructors.html
[^7]: Clippy Lints, `mem_forget`(restriction) — https://rust-lang.github.io/rust-clippy/stable/index.html
[^s1]: 대응표의 Rust 쪽 코드와 오류 코드는 상대 문서의 C 코드를 옮겨 rustc 1.99.0으로 컴파일해 얻었다. 받기·돌려주기 횟수는 검증 코드의 전역 할당자로 셌다. 상대 문서가 C에서 쓴 "받기와 돌려주기 횟수를 세는 감싸개"와 같은 방법이다.
[^s2]: `try_reserve`의 동작은 검증 코드에서 `usize::MAX`바이트를 요청해 `Err`가 오는 것으로만 확인했다.
[^8]: std 문서, `std::alloc::handle_alloc_error` (std를 쓰는 바이너리는 메시지를 찍고 abort) — https://doc.rust-lang.org/std/alloc/fn.handle_alloc_error.html
{% endraw %}
