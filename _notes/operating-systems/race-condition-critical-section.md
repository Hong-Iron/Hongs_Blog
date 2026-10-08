---
layout: "note"
title: "경쟁 조건과 임계 구역"
display_title: "경쟁 조건과 임계 구역 (Race Condition and Critical Section)"
kind: "concept"
kind_label: "모델"
num: "21"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
updated: "2026-10-07"
status: "verified"
aliases: ["Race Condition", "Critical Section", "경쟁 조건", "임계 구역", "상호 배제", "Mutual Exclusion", "기아", "Starvation", "병행성", "Concurrency", "원자적 연산", "Atomic Operation"]
description: "두 사람이 같은 공책의 같은 칸을 동시에 고치면, 누가 마지막에 썼느냐에 따라 결과가 달라진다. 프로세스나 스레드가 공유 데이터를 함께 읽고 쓸 때도 똑같은 일이 생기고, 이것을 경쟁 조건이라고 부른다. 해결책은 공유 데이터를 만지는 코드 구간(임계 구역)에 한 번에 하나만 들어가…"
prev_url: "/studies/operating-systems/microkernel/"
prev_title: "마이크로커널"
next_url: "/studies/operating-systems/hardware-mutual-exclusion/"
next_title: "상호 배제의 하드웨어 지원"
math: true
mermaid: false
code_count: 1
permalink: "/studies/operating-systems/race-condition-critical-section/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 사람이 같은 공책의 같은 칸을 동시에 고치면, 누가 마지막에 썼느냐에 따라 결과가 달라진다. 프로세스나 스레드가 공유 데이터를 함께 읽고 쓸 때도 똑같은 일이 생기고, 이것을 경쟁 조건이라고 부른다. 해결책은 공유 데이터를 만지는 코드 구간(임계 구역)에 한 번에 하나만 들어가게 막는 것(상호 배제)이다. 하지만 막는 방법이 서툴면 서로 영원히 기다리거나(교착상태), 어떤 프로세스만 계속 밀려나는(기아) 새 문제가 생긴다.

</div>


## 예시로 보기

키보드에서 글자를 받아 화면에 다시 찍는 함수가 있다. 메모리를 아끼려고 여러 프로그램이 이 함수 하나를 함께 쓴다[^1].

```c
void echo() {
    chin = getchar();   // chin, chout은 모든 프로세스가 함께 쓰는 전역 변수
    chout = chin;
    putchar(chout);
}
```

프로세서 두 개에서 P1과 P2가 동시에 `echo`를 실행하면 이런 순서가 생길 수 있다[^2].

| 시점 | P1 | P2 | chin |
|---|---|---|---|
| 1 | `chin = getchar()` → 'x' | | x |
| 2 | | `chin = getchar()` → 'y' | y |
| 3 | `chout = chin` | `chout = chin` | y |
| 4 | `putchar(chout)` → y | `putchar(chout)` → y | |

P1이 받은 'x'는 사라지고, 'y'가 두 번 찍힌다. 한 번에 한 프로세스만 `echo`에 들어가게 하면 이 일은 없다. P2는 P1이 끝날 때까지 기다렸다가 들어간다[^3].

프로세서가 하나여도 같은 일이 생긴다. P1이 1번 줄 직후 인터럽트로 끊기고 P2가 실행되면 된다[^s1].

## 정확히 말하면

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**경쟁 조건**(race condition)은 여러 프로세스나 스레드가 공유 데이터를 읽고 쓰는데, 최종 결과가 실행 순서에 따라 달라지는 상황이다. 결과는 경주에서 마지막에 들어온 쪽이 정한다[^4].

**임계 구역**(critical section)은 공유 자원을 쓰는 코드 구간이다. 그 자원은 한 번에 한 프로세스만 써야 한다(임계 자원). **상호 배제**(mutual exclusion)는 한 프로세스가 임계 구역에 있는 동안 다른 프로세스가 그 자원의 임계 구역에 들어오지 못하게 하는 것이다[^5].

</div>


`x = x + 1`도 기계어로는 읽기, 더하기, 쓰기의 세 단계다. 두 프로세스가 동시에 하면 세 단계가 섞이는 방법이 $$\binom{6}{3} = 20$$가지다. 그중 2가지만 x가 2가 되고, 18가지는 한쪽의 더하기가 사라져 1이 된다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 20가지 순서를 모두 실행해 결과 2는 2가지, 결과 1은 18가지 — [21_race-condition_verify.py](/Hongs_Blog/studies/operating-systems/code/21_race-condition_verify/)</div>

</div>


### 운영체제가 신경 쓸 것

프로세스가 함께 돌면 운영체제는 네 가지를 해야 한다[^6].

- 여러 프로세스를 추적한다.
- 자원을 주고 거둔다.
- 데이터와 자원을 다른 프로세스의 간섭에서 보호한다.
- 프로세스의 결과가 처리 속도와 상관없게 한다.

### 프로세스끼리 얽히는 세 가지 방식

| 서로를 아는 정도 | 관계 | 예 | 생길 수 있는 문제 |
|---|---|---|---|
| 서로 모름 | 경쟁 | 독립된 프로그램들이 같은 프린터를 씀 | 상호 배제, 교착상태, 기아 |
| 간접적으로 앎 (공유 객체를 통해) | 공유로 협력 | 같은 버퍼·파일을 함께 씀 | 위 셋 + 데이터 일관성 |
| 직접 앎 (서로의 ID로 통신) | 통신으로 협력 | 메시지를 주고받으며 함께 일함 | 교착상태, 기아 |

이 표는 슬라이드 그림(표 5.2)과 발표자 노트를 정리한 것이다[^7].

### 자원 경쟁의 세 가지 제어 문제

| 문제 | 내용 |
|---|---|
| 상호 배제 | 임계 자원은 한 번에 하나만 써야 한다. 예: 두 프로그램의 출력이 프린터에서 섞이면 안 된다 |
| 교착상태 | P1이 자원 R1을 쥐고 R2를, P2가 R2를 쥐고 R1을 기다리면 둘 다 영원히 멈춘다 → [교착상태](/Hongs_Blog/studies/operating-systems/deadlock/) |
| 기아 | 운영체제가 일부 프로세스에게만 자원을 계속 줘서, 어떤 프로세스는 영원히 차례가 오지 않는다 |

이 표는 슬라이드 15와 발표자 노트를 정리한 것이다[^8].

### 상호 배제의 요구 사항

어떤 방법이든 다음 여섯 가지를 지켜야 한다[^9].

1. 한 자원의 임계 구역에는 한 번에 한 프로세스만 있을 수 있다.
2. 임계 구역 밖에서 멈춘 프로세스가 다른 프로세스를 방해하면 안 된다.
3. 교착상태나 기아가 없어야 한다. 임계 구역에 들어가려는 프로세스가 끝없이 기다리면 안 된다.
4. 임계 구역이 비어 있으면, 들어가려는 프로세스를 늦추면 안 된다.
5. 프로세스의 상대 속도나 개수를 가정하면 안 된다.
6. 프로세스는 임계 구역에 유한한 시간만 머문다.

## 스스로 설명해 보기

1. `echo` 예에서 'x'가 사라진다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   chin이 전역 변수라 두 프로세스가 같은 칸을 쓴다. P1이 'x'를 넣은 뒤 출력하기 전에 P2가 같은 칸에 'y'를 덮어썼다.
   </details>
2. 프로세서가 하나여도 경쟁 조건이 생긴다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   여러 프로세스가 번갈아 실행되기 때문이다. 인터럽트는 아무 명령어 사이에서나 올 수 있어서, P1이 임계 구역 한가운데서 끊기고 P2가 같은 데이터를 고칠 수 있다.
   </details>
3. 요구 사항 5(속도를 가정하지 않는다)가 필요하다.
   <details class="inline-fold" markdown="1"><summary markdown="span">근거</summary>
   "P1은 빠르니 P2보다 먼저 끝나겠지"에 기대는 방법은 기계가 바뀌거나 부하가 달라지면 깨진다. 경쟁 조건은 바로 그 드문 순서에서 터진다.
   </details>
- 핵심 아이디어는?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  공유 데이터를 고치는 여러 단계를 남이 끼어들 수 없는 한 덩어리처럼 만든다. 그 덩어리가 임계 구역이고, 막는 장치가 상호 배제다.
  </details>
- 같은 생각을 쓰는 다른 곳은?
  <details class="inline-fold" markdown="1"><summary markdown="span">답</summary>
  데이터베이스의 트랜잭션. 계좌 이체의 "출금 + 입금"이 중간에 끼어들 수 없는 한 덩어리처럼 처리된다.
  </details>

## 활용

- 은행 계좌 잔액, 재고 수량, 조회수처럼 여러 요청이 동시에 고치는 값은 모두 경쟁 조건의 대상이다[^s1].
- 경쟁 조건으로 생긴 버그는 드문 순서에서만 나타나서 재현하기 어렵다. 디버거를 붙이면 속도가 바뀌어 사라지기도 한다. 2장의 "비결정적 동작"이 이것이다 → [프로세스](/Hongs_Blog/studies/operating-systems/process/)
- 상호 배제를 구현하는 방법: [하드웨어 지원](/Hongs_Blog/studies/operating-systems/hardware-mutual-exclusion/), [세마포어](/Hongs_Blog/studies/operating-systems/semaphore/), [모니터](/Hongs_Blog/studies/operating-systems/monitor/), [메시지 전달](/Hongs_Blog/studies/operating-systems/message-passing/)

## 연결

- 선수: [스레드](/Hongs_Blog/studies/operating-systems/thread/) (공유 메모리), [프로세스](/Hongs_Blog/studies/operating-systems/process/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"`x++`은 한 줄이니 끊기지 않는다"</div>

틀렸다. 소스 코드에서 한 줄이라 한 번에 끝나는 것처럼 보인다. 하지만 기계어로는 메모리에서 읽기, 더하기, 메모리에 쓰기의 세 명령어다. 인터럽트나 다른 프로세서는 그 사이에 끼어들 수 있다. 확인하는 방법: 검증 코드에서 세 단계를 섞는 20가지 순서 중 18가지가 틀린 값을 낸다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"프로세서가 하나면 동시에 실행되지 않으니 경쟁 조건이 없다"</div>

틀렸다. 동시에 실행되지 않아도 번갈아 실행된다. 임계 구역 중간에서 끊기면 같은 문제가 생긴다. 프로세서가 하나일 때는 끊기는 원인이 인터럽트이고, 여럿일 때는 진짜 동시 실행이 더해질 뿐이다.

</div>


## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 상호 배제 방법이 지켜야 할 요구 사항 여섯 가지를 쓰라.</summary>


**답:** ① 임계 구역에 한 번에 하나만 ② 임계 구역 밖에서 멈춘 프로세스는 남을 방해하지 않음 ③ 교착상태·기아 없음 ④ 임계 구역이 비면 바로 들어감 ⑤ 상대 속도·개수를 가정하지 않음 ⑥ 임계 구역에는 유한 시간만 머묾.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> 다음은 상호 배제 실패, 교착상태, 기아 중 무엇인가? ① 두 스레드가 같은 연결 리스트에 동시에 노드를 넣어 하나가 사라짐 ② 우선순위가 낮은 프로세스가 높은 프로세스들에 밀려 몇 시간째 프린터를 못 씀 ③ 두 프로세스가 서로 상대가 쥔 파일의 잠금을 기다림</summary>


**답:** ① 상호 배제 실패. ② 기아. ③ 교착상태.<br>
**흔한 오답:** ②를 교착상태로 보는 것. 교착상태는 아무도 진행하지 못하는 것이고, 기아는 다른 프로세스는 잘 진행하는데 특정 프로세스만 밀리는 것이다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> 공유 변수 x = 0. 프로세스 A와 B가 각각 x = x + 1을 (읽기, 더하기, 쓰기)로 실행한다. 순서가 A 읽기, B 읽기, A 더하기, A 쓰기, B 더하기, B 쓰기라면 최종 x는?</summary>


**답:** 1.<br>
**이유:** A와 B가 둘 다 0을 읽었다. A가 1을 쓰고, B도 자기 레지스터의 0 + 1 = 1을 쓴다. A의 더하기가 B의 쓰기에 덮였다.

</details>

<details markdown="1"><summary markdown="span"><b>C4</b> 요구 사항 4(임계 구역이 비어 있으면 들어가려는 프로세스를 늦추지 않는다)를 어기는 방법의 예를 하나 들고, 왜 문제인지 쓰라.</summary>


**답:** 두 프로세스가 반드시 번갈아 들어가게 하는 방법(차례 변수 turn을 두고 A, B, A, B 순서로만). B가 오랫동안 들어갈 일이 없으면, A는 임계 구역이 비어 있어도 B의 차례가 지나갈 때까지 들어가지 못한다. 빠른 프로세스가 느린 프로세스의 속도에 묶인다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/05.Chapter05-new (Google Slides).pdf, p.9
[^2]: 같은 자료, p.10
[^3]: 같은 자료, p.11
[^4]: 같은 자료, p.12
[^5]: 같은 자료, p.15. 정의 문장은 Stallings 6판 표 5.1(핵심 용어)을 따랐다.
[^6]: 같은 자료, p.13
[^7]: 같은 자료, p.14
[^8]: 같은 자료, p.15
[^9]: 같은 자료, p.16~17
[^s1]: 에이전트 보충. 이 장은 교수 자료가 없어 지금 자료와 같은 시리즈(Stallings 6판, Dave Bremer 작성)의 공개 슬라이드를 원본으로 썼다. 단일 프로세서에서의 경쟁 조건, `x = x + 1`의 20가지 순서, 계좌·재고 예, 확인 문제 C3·C4는 슬라이드에 없다. C4의 차례 변수 방법은 Stallings 6판 부록 A의 첫 번째 시도와 같다.
{% endraw %}
