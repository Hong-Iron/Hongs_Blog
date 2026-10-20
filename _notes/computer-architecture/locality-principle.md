---
layout: "note"
title: "지역성의 원리"
display_title: "지역성의 원리 (Principle of Locality)"
kind: "concept"
kind_label: "정의"
num: "35"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Principle of Locality", "Locality of Reference", "참조 지역성", "시간 지역성", "Temporal Locality", "공간 지역성", "Spatial Locality"]
description: "프로그램은 메모리 전체를 고르게 쓰지 않는다. 방금 쓴 곳을 곧 다시 쓰고, 방금 쓴 곳의 바로 옆을 곧 쓴다. 이 버릇 덕분에 작은 빠른 메모리에 \"요즘 쓰는 것\"만 올려 두어도 대부분의 요청을 빠르게 처리한다. 하지만 이것은 프로그램의 버릇일 뿐 법칙이 아니어서, 메모리를 여기…"
prev_url: "/studies/computer-architecture/superscalar-out-of-order/"
prev_title: "슈퍼스칼라와 비순차 실행"
next_url: "/studies/computer-architecture/direct-mapped-cache/"
next_title: "직접 사상 캐시"
math: false
mermaid: false
code_count: 1
code_files: [{"t": "35_locality-principle_verify.py", "u": "/studies/computer-architecture/code/35_locality-principle_verify/", "r": "검증"}]
permalink: "/studies/computer-architecture/locality-principle/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

프로그램은 메모리 전체를 고르게 쓰지 않는다. 방금 쓴 곳을 곧 다시 쓰고, 방금 쓴 곳의 바로 옆을 곧 쓴다. 이 버릇 덕분에 작은 빠른 메모리에 "요즘 쓰는 것"만 올려 두어도 대부분의 요청을 빠르게 처리한다. 하지만 이것은 프로그램의 버릇일 뿐 법칙이 아니어서, 메모리를 여기저기 건너뛰며 쓰는 프로그램에서는 빠른 메모리가 거의 도움이 안 된다.

</div>


## 예시로 보기

빠른 메모리는 비싸서 조금밖에 못 둔다. 그 조금으로 큰 메모리를 빠르게 보이게 하려면, 프로세서가 다음에 어디를 읽을지 미리 짐작해야 한다. 짐작의 근거가 프로그램의 버릇이다.

정수 8개를 더하는 일을 10번 되풀이하는 코드를 보자.

```c
for (r = 0; r < 10; r++)
    for (i = 0; i < 8; i++)
        sum += a[i];
```

- `a[0]`을 읽은 다음에는 `a[1]`, 그다음에는 `a[2]`를 읽는다. 방금 읽은 곳의 **바로 옆**이다.
- 바깥 반복이 한 번 돌 때마다 `a[0]`~`a[7]`을 **다시** 읽는다. `sum`, `i`와 반복문의 명령어들은 80번 내내 다시 쓴다.

캐시 흉내기에 이 접근 80번을 넣어 보았다. 캐시는 워드 4개(16바이트)를 한 덩어리로 가져오는 8줄짜리다.

| 캐시가 한 번에 가져오는 양 | 실패 | 적중 |
|---|---|---|
| 워드 4개 | 2 | 78 |
| 워드 1개 | 8 | 72 |

워드 1개씩만 가져와도 실패는 처음 한 바퀴의 8번뿐이다. 다시 읽는 버릇만으로 72번을 맞힌다. 워드 4개씩 가져오면 `a[0]`에서 한 번 실패할 때 `a[1]`~`a[3]`이 딸려 와서, 실패가 2번으로 준다. 옆을 읽는 버릇까지 쓴 것이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 아래 행·열 순서 표, 흩어진 접근의 실패율, 카드 C2 — [35_locality-principle_verify.py](/Hongs_Blog/studies/computer-architecture/code/35_locality-principle_verify/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 정의

지역성은 두 가지로 나눈다[^1].

- **시간 지역성**(temporal locality): 어떤 자리를 최근에 썼다면, 곧 그 자리를 다시 쓸 가능성이 크다.
- **공간 지역성**(spatial locality): 어떤 자리를 최근에 썼다면, 곧 그 근처 자리를 쓸 가능성이 크다.

둘 다 "가능성이 크다"는 말이다. 반드시 그렇다는 보장이 아니다.

프로그램에서 두 버릇이 나오는 곳은 다음과 같다.

| | 명령어 | 데이터 |
|---|---|---|
| 시간 지역성 | 반복문의 몸통을 되풀이해 실행한다 | 합계, 반복 변수처럼 계속 고쳐 쓰는 변수 |
| 공간 지역성 | 분기가 없으면 다음 명령어는 바로 다음 주소(PC + 4)에 있다 | 배열 원소를 차례로 읽는다. 구조체의 필드가 붙어 있다 |

캐시는 두 버릇을 서로 다른 방법으로 쓴다.

- 시간 지역성을 쓰는 방법: 한 번 읽은 것을 캐시에 **남겨 둔다**.
- 공간 지역성을 쓰는 방법: 한 워드만 필요해도 이웃한 워드까지 **한 덩어리(블록)로 가져온다**. 블록 크기를 정하는 일은 [직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)에서 다룬다.

## 예제

**같은 일을 하는데 순서만 다른 두 코드.** 16 × 16 정수 배열의 모든 원소를 더한다. C는 2차원 배열을 행 단위로 메모리에 이어 붙인다. `a[0][15]` 바로 다음 주소에 `a[1][0]`이 있다.

```c
/* (가) 행 순서 */                    /* (나) 열 순서 */
for (i = 0; i < 16; i++)              for (j = 0; j < 16; j++)
    for (j = 0; j < 16; j++)              for (i = 0; i < 16; i++)
        sum += a[i][j];                       sum += a[i][j];
```

(가)는 주소를 4바이트씩 차례로 올라간다. (나)는 한 번 읽을 때마다 한 행(64바이트)을 건너뛴다. 8줄 × 16바이트 캐시(전체 128바이트)의 흉내기 결과다.

| 순서 | 접근 | 실패 | 실패율 |
|---|---|---|---|
| (가) 행 순서 | 256 | 64 | 25% |
| (나) 열 순서 | 256 | 256 | 100% |

(가)는 블록 하나(워드 4개)에서 첫 워드만 실패하고 나머지 3개는 적중한다. 그래서 정확히 4번에 1번 실패한다. (나)는 블록을 가져와도 그 안의 이웃 워드를 쓰기 전에 다른 행으로 떠난다. 돌아왔을 때는 그 블록이 이미 쫓겨난 뒤다.

"어? 그럼 캐시가 커지면 (나)도 괜찮은가?" 줄을 16개로 늘려도 (나)는 256번 모두 실패한다. 배열 전체(1,024바이트)가 다 들어가는 64줄 캐시가 되어야 실패가 64번으로 준다. 지역성이 약한 코드는 캐시를 훨씬 크게 만들어야 겨우 같은 성능을 낸다.

**지역성이 없는 접근.** 1 MB 범위에서 아무 주소나 2,000번 읽으면 같은 캐시에서 실패율이 99%를 넘는다. 방금 읽은 곳과 다음에 읽을 곳 사이에 아무 관계가 없기 때문이다.

## 활용

- 메모리를 층으로 쌓는 모든 장치가 이 버릇에 기댄다. 캐시, [TLB](/Hongs_Blog/studies/operating-systems/tlb/), [가상 메모리](/Hongs_Blog/studies/operating-systems/virtual-memory/)가 그렇다.
- 프로그래머가 할 수 있는 일: 배열은 메모리에 놓인 순서대로 돈다. 함께 쓰는 값은 붙여 둔다.
- 흔한 실수: 연결 리스트처럼 노드가 메모리 여기저기에 흩어진 자료구조는 "다음 노드"가 옆 주소에 있지 않다. 원소 수가 같아도 배열보다 캐시 실패가 많다.

## 연결

- 선수: [메모리 계층](/Hongs_Blog/studies/operating-systems/memory-hierarchy/) (층을 나누는 까닭), [MIPS 레지스터와 메모리 피연산자](/Hongs_Blog/studies/computer-architecture/mips-operands/) (바이트 주소와 워드)
- 이 버릇을 하드웨어로 쓰는 법: [직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)
- 운영체제 쪽에서 본 같은 생각: [캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/), [가상 메모리](/Hongs_Blog/studies/operating-systems/virtual-memory/)
- 실패가 성능을 얼마나 깎는지: [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 시간 지역성과 공간 지역성을 각각 한 문장으로 쓰고, 캐시가 각각을 어떤 방법으로 쓰는지 짝지으라.</summary>

**답:** 시간 지역성: 최근에 쓴 자리를 곧 다시 쓴다 → 읽은 것을 캐시에 남겨 둔다. 공간 지역성: 최근에 쓴 자리의 근처를 곧 쓴다 → 이웃 워드까지 블록으로 함께 가져온다.<br>
**흔한 오답:** 둘을 바꿔 짝짓는 것. 블록을 키우는 것은 "옆"을 노리는 것이고, 남겨 두는 것은 "다시"를 노리는 것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 8 × 8 정수 배열(원소 4바이트, 행 단위로 이어 붙음)을 행 순서와 열 순서로 한 번씩 훑는다. 캐시는 4줄이고 한 줄에 워드 2개(8바이트)가 들어간다. 각 순서의 실패 수는?</summary>

**답:** 행 순서 32번, 열 순서 64번.<br>
**이유:** 행 순서는 블록(워드 2개)마다 첫 워드에서만 실패하므로 64 ÷ 2 = 32번이다. 열 순서는 한 번 읽을 때마다 32바이트(블록 4개)를 건너뛴다. 캐시가 4줄뿐이라 같은 열의 8개 원소가 줄을 서로 빼앗고, 옆 열로 돌아왔을 때 이웃 워드가 든 블록은 이미 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 블록을 워드 4개로 키웠더니 배열을 차례로 읽는 코드의 실패가 4분의 1로 줄었다. 같은 캐시에서 연결 리스트를 따라가는 코드는 실패가 거의 줄지 않았다. 왜인가?</summary>

**답:** 블록을 키우는 것은 공간 지역성에 거는 내기다. 배열은 다음 원소가 바로 옆 주소라 딸려 온 워드를 곧 쓴다. 연결 리스트의 다음 노드는 포인터가 가리키는 아무 주소에 있다. 그래서 딸려 온 이웃 워드를 쓸 일이 없다.

</details>


[^1]: MIT 6.004 Computation Structures, Fall 2023, L13 "Caches", 슬라이드 6 (Why Caches Work: temporal locality, spatial locality), https://shd.mit.edu/2024/lectures/readings/6191-fall2023/L13.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 5장 "Large and Fast: Exploiting Memory Hierarchy"
{% endraw %}
