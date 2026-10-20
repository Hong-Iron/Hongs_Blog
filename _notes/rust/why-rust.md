---
layout: "note"
title: "Rust가 푸는 문제"
display_title: "Rust가 푸는 문제 (Why Rust)"
kind: "concept"
kind_label: "모델"
num: "01"
course: "Rust"
course_slug: "rust"
course_url: "/studies/rust/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-14"
status: "verified"
aliases: ["Why Rust", "Rust", "메모리 안전", "Memory Safety", "데이터 경쟁", "Data Race", "비용 없는 고수준 기능", "Zero-Cost Abstraction", "가비지 컬렉터", "Garbage Collector"]
description: "C는 빠르지만, 다 쓴 메모리를 또 쓰거나 배열 끝을 넘어 읽어도 아무도 막지 않는다. Java와 파이썬은 이런 실수를 막는 대신, 실행 중에 메모리를 치우는 청소부를 따로 돌린다. Rust는 청소부 없이 컴파일러가 코드를 미리 검사해서 이런 실수를 거의 다 막는다. 대가는 배우기…"
next_url: "/studies/rust/cargo-packages/"
next_title: "cargo와 패키지 구조"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "01_why-rust_verify.rs", "u": "/studies/rust/code/01_why-rust_verify/", "r": "검증"}]
permalink: "/studies/rust/why-rust/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

C는 빠르지만, 다 쓴 메모리를 또 쓰거나 배열 끝을 넘어 읽어도 아무도 막지 않는다. Java와 파이썬은 이런 실수를 막는 대신, 실행 중에 메모리를 치우는 청소부를 따로 돌린다. Rust는 청소부 없이 컴파일러가 코드를 미리 검사해서 이런 실수를 거의 다 막는다. 대가는 배우기 어렵고, 컴파일이 오래 걸리고, 컴파일러가 거절하는 코드를 고치는 데 시간이 든다는 점이다.

</div>


## 예시로 보기

길이 3인 배열에서 10번 칸을 읽는 코드를 C와 Rust로 같이 써 본다. 번호 10은 실행 중에 사용자 입력으로 정해진다고 하자.

```c
int v[3] = {10, 20, 30};
int i = 10;               /* 실행 중에 정해진다 */
printf("%d\n", v[i]);     /* 배열 밖. 무엇이 찍힐지 정해져 있지 않다 */
```

C에서는 이 줄이 그냥 실행된다. 배열 뒤에 우연히 있던 메모리를 읽어 엉뚱한 수를 찍거나, 프로그램이 죽거나, 아무 일 없는 척한다. 어느 쪽인지 정해져 있지 않다.

```rust
let v = [10, 20, 30];
let i = black_box(10usize); // 실행 중에 정해지는 번호
let x = v[i];               // 여기서 프로그램이 멈춘다(panic)
```

Rust는 번호로 읽을 때마다 번호가 길이보다 작은지 확인한다. 아니면 그 자리에서 프로그램을 멈춘다. 이렇게 오류로 멈추는 것을 panic이라고 부른다[^1].

```
index out of bounds: the len is 3 but the index is 10
```

쓰레기 값을 들고 계속 달리는 것보다, 어디서 무엇이 틀렸는지 말하고 멈추는 쪽이 고치기 쉽다. 멈추기도 싫으면 `v.get(i)`를 쓴다. 칸이 있으면 `Some(값)`, 없으면 `None`을 돌려주므로 없을 때를 직접 처리할 수 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 panic 메시지, `get`의 결과, 아래 세 컴파일 오류(E0597, E0382, E0373·E0499)와 Mutex로 고친 판의 결과를 `rustc` 1.99.0으로 확인했다 — [01_why-rust_verify.rs](/Hongs_Blog/studies/rust/code/01_why-rust_verify/)</div>

</div>


## 컴파일러가 막는 실수들

배열 밖 읽기는 실행 중에 잡는다. 더 무서운 실수들은 아예 컴파일 단계에서 잡는다. Rust 책은 이것을 "컴파일러가 문지기 노릇을 한다"고 표현한다[^2].

| 실수 | C에서 | Rust에서 | 자세히 |
|---|---|---|---|
| 돌려준 메모리를 가리키는 포인터로 읽기(해제 뒤 사용) | 컴파일되고, 실행 결과는 정해져 있지 않다 | 컴파일 오류 E0597 | [수명](/Hongs_Blog/studies/rust/lifetimes/) |
| 이미 넘겨준 값을 또 쓰기(두 번 해제의 씨앗) | 컴파일된다 | 컴파일 오류 E0382 | [소유권과 이동](/Hongs_Blog/studies/rust/ownership-move/) |
| 두 스레드가 잠금 없이 같은 값을 고치기(데이터 경쟁) | 컴파일된다 | 컴파일 오류 E0373, E0499 | [스레드와 Send·Sync](/Hongs_Blog/studies/rust/threads-send-sync/) |
| 배열 밖 읽기 | 컴파일된다 | 실행 중 panic | 위 예시 |

예를 들어 블록 안에서 만든 문자열을 블록 밖에서 참조로 읽으려 하면 이렇게 거절한다.

```rust
let r;
{
    let s = String::from("hi");
    r = &s;
}               // s는 여기서 치워진다
println!("{r}"); // error[E0597]: `s` does not live long enough
```

이것을 청소부(가비지 컬렉터) 없이 한다는 점이 핵심이다. Java는 아무도 가리키지 않는 객체를 실행 중에 청소부가 찾아 치운다([참조 타입과 메모리 영역](/Hongs_Blog/studies/java/java-reference-types/)). Rust는 값마다 주인을 하나 정해 두고, 주인이 사라지는 자리에서 컴파일러가 치우는 코드를 넣는다. 이 규칙을 소유권(ownership)이라고 부르고, 이것으로 가비지 컬렉터 없이 메모리 안전을 보장한다[^3].

### 데이터 경쟁과 경쟁 조건은 다르다

데이터 경쟁(data race)은 다음 세 가지가 한꺼번에 일어나는 것이다[^4].

- 두 개 이상의 스레드가 같은 메모리 자리를 동시에 건드린다.
- 그중 하나 이상이 쓴다.
- 그중 하나 이상이 잠금 같은 동기화 없이 건드린다.

안전한 Rust 코드에는 데이터 경쟁이 없다고 보장한다. 하지만 일반적인 경쟁 조건(race condition)까지 막지는 않는다[^4]. 예를 들어 두 스레드가 각각 잠금을 걸고 "잔액 읽기"와 "잔액 쓰기"를 따로 하면, 메모리는 안전해도 순서에 따라 결과가 틀릴 수 있다. 운영체제에서 배운 임계 구역 문제는 여전히 직접 설계해야 한다([경쟁 조건과 임계 구역](/Hongs_Blog/studies/operating-systems/race-condition-critical-section/)).

## 빠르기: 비용 없는 고수준 기능

Rust는 반복자나 제네릭 같은 고수준 기능을, 사람이 손으로 짠 저수준 코드만큼 빠르게 번역하는 것을 목표로 한다. 이 목표를 영어로 zero-cost abstractions(비용 없는 고수준 기능)라고 부른다[^2]. 가비지 컬렉터가 없으니 청소부가 일하느라 프로그램이 잠깐 멈추는 일도 없다.

목표라는 점에 주의한다. 모든 고수준 코드가 저절로 빨라지는 것은 아니다. 측정 방법은 [성능 측정과 최적화](/Hongs_Blog/studies/rust/performance-measurement/)에서 다룬다.

## 실제로 얼마나 효과가 있나

Google은 Android의 새 코드를 메모리 안전한 언어(Rust, Java, Kotlin)로 쓰는 쪽으로 옮긴 결과를 공개했다.

- 2024년 글: Android 취약점 가운데 메모리 안전 문제의 비율은 2019년 76%에서 2024년 24%로 내려갔고, 업계 평균 70%보다 한참 낮다[^5].
- 2025년 글: 2025년 데이터에서 메모리 안전 취약점이 처음으로 전체의 20% 아래로 내려갔다. Rust 코드의 메모리 안전 취약점 밀도는 Android의 C·C++ 코드보다 1000배 넘게 낮다[^6].
- 같은 글은 속도 이야기도 한다. 중간·큰 크기의 변경에서 Rust 변경을 되돌리는 비율이 C++보다 약 4배 낮고, 코드 리뷰에 드는 시간은 약 25% 적다[^6].

76%와 24%는 취약점 네 개 중 셋이 메모리 문제였다가 넷 중 하나로 줄었다는 뜻이다. 이 숫자들은 한 회사, 한 코드베이스의 결과다. Rust만의 효과도 아니다. 같은 기간에 Java·Kotlin 코드도 늘었다.

## 대가

- **배우기 어렵다.** 소유권·빌림·수명은 다른 언어에 없는 규칙이라 처음에는 컴파일러와 싸우는 느낌이 든다. 2025년 Rust 설문에서도 언어가 점점 복잡해진다는 걱정이 이어졌다[^7].
- **컴파일이 느리다.** 같은 설문에서 느린 컴파일과 디스크 사용량이 여전히 큰 불만으로 꼽혔다[^7]. 최적화를 켠 release 빌드는 더 오래 걸린다[^8]. 개발 중에는 실행 파일을 만들지 않고 검사만 하는 `cargo check`로 시간을 줄인다([cargo와 패키지 구조](/Hongs_Blog/studies/rust/cargo-packages/)).
- **안전 검사를 끄는 문이 있다.** `unsafe` 블록 안에서는 컴파일러가 일부 검사를 사람에게 맡긴다. Android 글도 Rust 코드의 약 4%가 `unsafe` 블록 안에 있고 보안 걱정은 주로 그 부분에 몰린다고 적는다[^6]. [unsafe와 안전한 감싸기](/Hongs_Blog/studies/rust/unsafe-abstractions/)에서 다룬다.

## 활용

- **쓰이는 곳.** Rust 책은 명령줄 도구, 웹 서비스, DevOps 도구, 임베디드 장치, Firefox 브라우저의 큰 부분을 예로 든다[^2]. 이 과목은 웹 서비스 쪽을 따라간다. 마지막 캡스톤은 axum과 SQLite로 짜는 단축 URL 서비스다.
- **언제 고르나.** 메모리를 직접 다뤄야 할 만큼 빠르기나 자원이 중요하면서, C·C++의 메모리 버그가 감당하기 힘든 곳이다. 브라우저·운영체제 부품, 네트워크 서버, 명령줄 도구가 대표적이다.
- **언제 안 고르나.** 몇 번 돌리고 버릴 스크립트, 실험 위주의 데이터 분석처럼 빨리 써 보는 것이 중요한 곳에서는 파이썬이 더 낫다. 팀에 Rust를 아는 사람이 없고 마감이 급한 경우도 대가가 크다.
- **흔한 실수.** "Rust면 버그가 없다"고 믿는 것. 논리 오류, 경쟁 조건, 교착 상태, 넘침에 따른 panic은 여전히 생긴다.

## 연결

- 선수 없음. 이 과목의 출발점이다.
- C에서 메모리를 직접 빌리고 돌려주는 법: [동적 메모리 할당](/Hongs_Blog/studies/data-structures/dynamic-memory-allocation/). Rust가 그것을 어떻게 바꾸는지는 [malloc·free ↔ 소유권과 Drop](/Hongs_Blog/studies/rust/malloc-free-vs-ownership/)에서 비교한다.
- 다음 문서: [cargo와 패키지 구조](/Hongs_Blog/studies/rust/cargo-packages/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"Rust는 실행 중 검사를 전혀 하지 않아서 빠르다"</div>

틀렸다. 배열 번호 검사처럼 컴파일러가 미리 알 수 없는 것은 실행 중에 검사한다. 그럴듯해 보이는 이유는 "컴파일 단계에서 막는다"는 말이 자주 들리기 때문이다. 실제로는 컴파일 단계에서 막을 수 있는 것(해제 뒤 사용, 데이터 경쟁)은 미리 막고, 나머지(배열 범위, dev 빌드의 정수 넘침)는 실행 중에 검사해 panic으로 멈춘다. 위 예시처럼 `black_box(10)`으로 실행 중 번호를 만들어 읽어 보면 panic 메시지로 확인할 수 있다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** Rust가 Java·파이썬과 C 사이에서 고른 길을 두 문장으로 쓰라. 무엇을 막고, 무엇 없이 막는가?</summary>

**답:** C처럼 가비지 컬렉터 없이 돌아가면서도, Java처럼 해제 뒤 사용·두 번 해제·데이터 경쟁 같은 메모리 실수를 막는다. 막는 일은 주로 컴파일러가 소유권 규칙으로 컴파일 단계에서 한다.<br>
**흔한 오답:** "Rust는 가비지 컬렉터가 아주 빠르다." Rust에는 가비지 컬렉터가 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 중 안전한 Rust가 컴파일 단계에서 막는 것은? (가) 두 스레드가 잠금 없이 같은 `Vec`에 `push` (나) 두 스레드가 각각 `Mutex`를 잡고 잔액을 읽은 뒤, 잠금을 놓고 다시 잡아 잔액을 쓰는 코드의 잘못된 결과 (다) 실행 중에 정해진 번호로 배열 밖 읽기</summary>

**답:** (가)만이다.<br>
**이유:** (가)는 데이터 경쟁이라 E0373·E0499로 거절된다. (나)는 메모리 안전하지만 순서에 따라 결과가 틀리는 경쟁 조건이다. Rust는 이것을 막지 않는다. (다)는 컴파일러가 번호를 모르므로 실행 중 검사로 panic이 난다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** C에서 `v[10]`(길이 3)은 무엇을 찍을지 정해져 있지 않은데, Rust는 왜 panic으로 멈추는 쪽을 골랐나? 멈추기 싫을 때는 무엇을 쓰나?</summary>

**답:** 엉뚱한 메모리를 읽고 계속 달리면 틀린 값이 퍼지고 보안 구멍이 된다. 그 자리에서 이유와 함께 멈추는 편이 원인을 찾기 쉽고 공격에 쓰일 수 없다. 멈추기 싫으면 `v.get(10)`을 써서 `None`을 받아 처리한다.

</details>


[^1]: The Rust Programming Language, 3.2 Data Types, Invalid Array Element Access — https://doc.rust-lang.org/book/ch03-02-data-types.html
[^2]: The Rust Programming Language, Introduction, Who Rust Is For(Teams of Developers, Companies, People Who Value Speed and Stability) — https://doc.rust-lang.org/book/ch00-00-introduction.html
[^3]: The Rust Programming Language, 4. Understanding Ownership — https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html
[^4]: The Rustonomicon, Data Races and Race Conditions — https://doc.rust-lang.org/nomicon/races.html
[^5]: Google Security Blog, "Eliminating Memory Safety Vulnerabilities at the Source" (2024-09-25). 원문: "Memory safety issues, which accounted for 76% of Android vulnerabilities in 2019, and are currently 24% in 2024, well below the 70% industry norm" — https://security.googleblog.com/2024/09/eliminating-memory-safety-vulnerabilities-Android.html
[^6]: Google Security Blog, "Rust in Android: move fast and fix things" (2025-11-13). 원문 숫자: "memory safety vulnerabilities falling below 20% of total vulnerabilities for the first time", "a 1000x reduction in memory safety vulnerability density compared to Android's C and C++ code", "For medium and large changes, the rollback rate of Rust changes in Android is ~4x lower than C++", "about 25% less time in code review", "the approximately 4% of code written within unsafe{} blocks" — https://security.googleblog.com/2025/11/rust-in-android-move-fast-fix-things.html
[^7]: Rust Blog, 2025 State of Rust Survey Results (2026-03-02), Challenges and wishes about Rust. 원문: "resource usage (slow compile times and storage usage) is still up there", "concerns persist about the language becoming more and more complex" — https://blog.rust-lang.org/2026/03/02/2025-State-Of-Rust-Survey-results
[^8]: The Rust Programming Language, 1.3 Hello, Cargo!, Building for Release — https://doc.rust-lang.org/book/ch01-03-hello-cargo.html
{% endraw %}
