---
layout: "note"
title: "상호 배제의 하드웨어 지원"
display_title: "상호 배제의 하드웨어 지원 (Hardware Support for Mutual Exclusion)"
kind: "concept"
kind_label: "기법"
num: "22"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
updated: "2026-10-07"
status: "verified"
aliases: ["Hardware Support for Mutual Exclusion", "인터럽트 금지", "Interrupt Disabling", "비교 후 교환", "Compare and Swap", "CAS", "교환 명령어", "Exchange Instruction", "XCHG", "바쁜 대기", "Busy Waiting", "스핀락", "Spinlock"]
description: "임계 구역을 지키는 가장 밑바닥 방법은 하드웨어에 기대는 것이다. 하나는 임계 구역 동안 인터럽트를 꺼서 아무도 끼어들지 못하게 하는 것이고, 다른 하나는 \"확인하고 바꾸기\"를 끊기지 않는 명령어 하나로 해 주는 특수 명령어다. 단순하고 프로세스 수에 상관없이 쓸 수 있다. 하지만…"
prev_url: "/studies/operating-systems/race-condition-critical-section/"
prev_title: "경쟁 조건과 임계 구역"
next_url: "/studies/operating-systems/semaphore/"
next_title: "세마포어"
math: false
mermaid: false
code_count: 0
permalink: "/studies/operating-systems/hardware-mutual-exclusion/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

임계 구역을 지키는 가장 밑바닥 방법은 하드웨어에 기대는 것이다. 하나는 임계 구역 동안 인터럽트를 꺼서 아무도 끼어들지 못하게 하는 것이고, 다른 하나는 "확인하고 바꾸기"를 끊기지 않는 명령어 하나로 해 주는 특수 명령어다. 단순하고 프로세스 수에 상관없이 쓸 수 있다. 하지만 들어가지 못한 프로세스가 문 앞에서 계속 확인하며 프로세서를 낭비하고(바쁜 대기), 누가 다음에 들어갈지 정하지 않아 기아가 생길 수 있다.

</div>


## 예시로 보기

화장실 문에 "사용 중" 팻말이 있다고 하자[^s1]. 들어가는 사람은 팻말을 보고, 비어 있으면 뒤집고 들어간다. 그런데 두 사람이 동시에 팻말을 보면 둘 다 "비어 있음"을 보고 둘 다 들어간다. "보기"와 "뒤집기" 사이에 틈이 있기 때문이다.

이 틈을 없애려면 "보고, 비어 있으면 뒤집기"를 한 동작으로 해야 한다. 특수 기계어 명령어가 바로 이 한 동작이다.

## 정확히 말하면

### 인터럽트 금지

프로세서가 하나면 프로세스는 번갈아 실행될 뿐 겹치지 않는다. 프로세스는 운영체제 서비스를 부르거나 인터럽트를 받기 전까지 계속 실행된다. 그래서 임계 구역 동안 인터럽트를 막으면 상호 배제가 보장된다[^1].

```c
while (true) {
    /* 인터럽트 금지 */;
    /* 임계 구역 */;
    /* 인터럽트 허용 */;
    /* 나머지 */;
}
```

대가가 크다. 그동안 프로세서가 다른 프로세스로 넘어갈 수 없어 효율이 떨어진다. 그리고 프로세서가 여러 개면 통하지 않는다. 한 프로세서의 인터럽트를 막아도 다른 프로세서의 프로세스는 같은 데이터를 만질 수 있다[^1].

### 특수 기계어 명령어

**비교 후 교환(compare&swap).** 메모리 값을 시험값과 비교해서, 같을 때만 새 값으로 바꾸고, 바꾸기 전 값을 돌려준다. 이 전체가 끊기지 않는 한 명령어(원자적)로 실행된다[^2].

```c
int compare_and_swap(int *word, int testval, int newval) {
    int oldval;
    oldval = *word;
    if (oldval == testval) *word = newval;
    return oldval;
}
```

이것으로 잠금을 만든다. 공유 변수 `bolt`를 0으로 시작한다. 들어가려는 프로세스는 `bolt`가 0일 때만 1로 바꾼다. 돌려받은 값이 0이면 자기가 바꾼 것이니 들어가고, 1이면 남이 이미 들어가 있으니 다시 시도한다[^3].

```c
while (compare_and_swap(&bolt, 0, 1) == 1)
    /* 아무것도 안 함 */;
/* 임계 구역 */;
bolt = 0;
```

**교환(exchange).** 레지스터와 메모리의 내용을 끊기지 않게 맞바꾼다. Intel IA-32와 IA-64에 `XCHG` 명령어가 있다[^4]. 프로세스마다 지역 변수 `key`를 1로 두고, `bolt`와 맞바꾼다. 바꿔 온 값이 0이면 들어간다. 이때 `bolt`는 이미 1이 되어 있다. 나올 때 `bolt`를 0으로 돌려놓는다[^5].

| 좋은 점 | 나쁜 점 |
|---|---|
| 프로세서 하나든, 주기억장치를 함께 쓰는 여럿이든, 프로세스 수에 상관없이 쓸 수 있다 | **바쁜 대기**: 기다리는 프로세스가 계속 확인하며 프로세서 시간을 쓴다 |
| 단순해서 맞는지 확인하기 쉽다 | **기아**: 여럿이 기다릴 때 누가 들어갈지 임의라서 어떤 프로세스는 계속 밀릴 수 있다 |
| 임계 구역마다 변수를 따로 두면 여러 임계 구역을 지원한다 | **교착상태**: 낮은 우선순위 P1이 임계 구역 안에 있을 때 높은 우선순위 P2가 같은 자원을 기다리며 바쁜 대기를 하면, 우선순위 때문에 P1은 실행되지 못하고 P2는 영원히 돈다 |

이 표는 슬라이드 내용과 발표자 노트를 정리한 것이다[^6].

## 활용

- 바쁜 대기로 도는 잠금을 **스핀락**(spinlock)이라고 부른다. 임계 구역이 아주 짧고 프로세서가 여럿일 때는 잠들었다 깨는 비용보다 잠깐 도는 편이 싸서, 운영체제 커널이 많이 쓴다[^s1].
- 다른 동기화 도구([세마포어](/Hongs_Blog/studies/operating-systems/semaphore/) 등)도 결국 내부에서는 이런 원자적 명령어로 만든다.
- C11의 `atomic_compare_exchange_strong`, 자바의 `AtomicInteger.compareAndSet`이 compare&swap을 프로그래밍 언어에서 쓰는 방법이다[^s1].

## 연결

- 선수: [경쟁 조건과 임계 구역](/Hongs_Blog/studies/operating-systems/race-condition-critical-section/), [인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/)
- 프로세서가 여럿일 때의 문제: [대칭형 다중 처리](/Hongs_Blog/studies/operating-systems/smp/)
- 바쁜 대기를 없애는 방법: [세마포어](/Hongs_Blog/studies/operating-systems/semaphore/)

## 확인 문제

<details markdown="1"><summary markdown="span"><b>C1</b> 인터럽트 금지가 다중 프로세서에서 상호 배제를 보장하지 못하는 이유는?</summary>


**답:** 인터럽트 금지는 그 프로세서에서 다른 프로세스로 넘어가는 것만 막는다. 다른 프로세서에서 실행 중인 프로세스는 같은 공유 데이터에 동시에 접근할 수 있다.

</details>

<details markdown="1"><summary markdown="span"><b>C2</b> bolt = 0. 프로세스 P1이 compare_and_swap(&bolt, 0, 1)을 실행하고, 이어서 P2가 같은 호출을 한다. 각 호출이 돌려주는 값과 그 뒤 bolt 값, 누가 임계 구역에 들어가는지 쓰라.</summary>


**답:** P1: 돌려받은 값 0, bolt = 1, 들어간다. P2: 돌려받은 값 1, bolt는 1 그대로(시험값 0과 달라 바꾸지 않음), 다시 시도한다.

</details>

<details markdown="1"><summary markdown="span"><b>C3</b> compare_and_swap이 원자적이지 않고 "읽기"와 "쓰기"가 끊길 수 있다면 두 프로세스가 함께 들어가는 순서를 만들어라.</summary>


**답:** P1이 bolt를 읽음(0) → P2가 bolt를 읽음(0) → P1이 1을 씀, 0을 돌려받아 들어감 → P2도 1을 씀, 0을 돌려받아 들어감. 둘 다 임계 구역에 있다.

</details>

[^1]: 3-1학기/운영체제/1.수업자료/05.Chapter05-new (Google Slides).pdf, p.19~20
[^2]: 같은 자료, p.21~22
[^3]: 같은 자료, p.23 (그림 5.2a)
[^4]: 같은 자료, p.24
[^5]: 같은 자료, p.25 (그림 5.2b)
[^6]: 같은 자료, p.26~27
[^s1]: 에이전트 보충. 이 장은 교수 자료가 없어 지금 자료와 같은 시리즈(Stallings 6판, Dave Bremer 작성)의 공개 슬라이드를 원본으로 썼다. 화장실 팻말 비유, 스핀락, 언어별 원자 연산, 확인 문제 C2·C3은 슬라이드에 없다. 그림 5.2의 코드는 Stallings 6판 5.2절을 따랐다.
{% endraw %}
