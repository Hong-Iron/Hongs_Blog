---
layout: "note"
title: "캐시 교체 정책"
display_title: "캐시 교체 정책 (Cache Replacement Policy)"
kind: "concept"
kind_label: "기법"
num: "40"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Cache Replacement Policy", "블록 교체", "LRU", "Least Recently Used", "무작위 교체", "Random Replacement", "FIFO", "희생 블록", "Victim"]
description: "새 덩어리를 넣어야 하는데 그 묶음의 자리가 다 찼을 때, 누구를 내보낼지 정하는 규칙이다. 가장 좋은 답은 앞으로 가장 늦게 쓰일 것을 내보내는 것이지만 앞날은 알 수 없다. 그래서 가장 오래 안 쓴 것을 내보내거나 아무거나 골라 내보낸다. 오래 안 쓴 것을 내보내는 쪽이 보통 …"
prev_url: "/studies/computer-architecture/cache-write-policy/"
prev_title: "캐시 쓰기 정책"
next_url: "/studies/computer-architecture/cache-performance-amat/"
next_title: "캐시 성능과 평균 접근 시간"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/cache-replacement/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

새 덩어리를 넣어야 하는데 그 묶음의 자리가 다 찼을 때, 누구를 내보낼지 정하는 규칙이다. 가장 좋은 답은 앞으로 가장 늦게 쓰일 것을 내보내는 것이지만 앞날은 알 수 없다. 그래서 가장 오래 안 쓴 것을 내보내거나 아무거나 골라 내보낸다. 오래 안 쓴 것을 내보내는 쪽이 보통 실패가 적지만, 자리가 많아지면 누가 오래됐는지 적어 두는 회로가 빠르게 커진다.

</div>


## 예시로 보기

[직접 사상 캐시](/Hongs_Blog/studies/computer-architecture/direct-mapped-cache/)에서는 들어갈 줄이 하나라 고를 것이 없었다. [집합 연관 캐시](/Hongs_Blog/studies/computer-architecture/set-associative-cache/)는 한 집합에 자리가 여럿이라 고를 수 있다. 잘못 고르면 곧 다시 쓸 블록을 내보내 실패가 하나 는다.

자리가 3개인 집합 하나에 블록 7, 2, 7, 5, 9, 7, 2, 3, 7, 9, 7, 5를 차례로 읽는다. 블록 7을 자주 쓴다. 두 규칙을 견준다.

- **가장 오래 안 쓴 것을 내보낸다(LRU).**
- **가장 먼저 들어온 것을 내보낸다(FIFO).**

| 순서 | 블록 | LRU | LRU가 내보낸 것 | FIFO | FIFO가 내보낸 것 |
|---|---|---|---|---|---|
| 1 | 7 | 실패 | | 실패 | |
| 2 | 2 | 실패 | | 실패 | |
| 3 | 7 | 적중 | | 적중 | |
| 4 | 5 | 실패 | | 실패 | |
| 5 | 9 | 실패 | 2 | 실패 | 7 |
| 6 | 7 | 적중 | | 실패 | 2 |
| 7 | 2 | 실패 | 5 | 실패 | 5 |
| 8 | 3 | 실패 | 9 | 실패 | 9 |
| 9 | 7 | 적중 | | 적중 | |
| 10 | 9 | 실패 | 2 | 실패 | 7 |
| 11 | 7 | 적중 | | 실패 | 2 |
| 12 | 5 | 실패 | 3 | 실패 | 3 |
| 실패 합 | | 8 | | 10 | |

5번에서 갈린다. 집합에는 7, 2, 5가 있다. FIFO는 맨 먼저 들어온 7을 내보낸다. 7은 3번에서 방금 또 썼는데도 들어온 순서만 본다. 바로 다음 6번이 7이라 실패한다. LRU는 7을 방금 썼다는 것을 알아서 2를 내보낸다.

같은 접근에서 아무거나 골라 내보내면 평균 약 7.9번 실패하고, 앞날을 다 알고 고르면 6번 실패한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 추적 표, 무작위 교체의 평균(씨앗 2,000개), 어떤 규칙도 앞날을 아는 교체보다 실패가 적지 않은 것(무작위 접근열 300개), LRU가 지는 예, LRU 비트 수, 2-way는 1비트로 정확한 LRU가 되는 것(무작위 200번), 카드 C2 — [40_cache-replacement_verify.py](/Hongs_Blog/studies/computer-architecture/code/40_cache-replacement_verify/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 정의

실패가 났고 블록이 갈 집합에 빈 자리가 없을 때, 그 집합의 블록 중 내보낼 하나를 고르는 규칙이 교체 정책이다. 빈 자리(유효 비트가 0인 줄)가 있으면 거기부터 채운다.

| 규칙 | 내보내는 것 | 적어 둘 것 |
|---|---|---|
| LRU (least recently used) | 마지막으로 쓴 때가 가장 오래된 블록 | 집합 안에서 쓴 순서. 적중할 때마다 고친다 |
| FIFO (first-in first-out) | 가장 먼저 들어온 블록 | 들어온 순서. 실패할 때만 고친다 |
| 무작위 (random) | 아무거나 하나 | 없다 |

LRU의 근거는 [시간 지역성](/Hongs_Blog/studies/computer-architecture/locality-principle/)이다. 한동안 안 쓴 것은 앞으로도 안 쓸 가능성이 크다고 본다[^1].

**LRU의 값.** way가 $$n$$개면 "쓴 순서"는 $$n!$$가지다($$n!$$은 1부터 $$n$$까지 곱한 수). 이것을 구별해 적으려면 집합마다 적어도 $$\lceil \log_2 n! \rceil$$비트가 든다($$\lceil x \rceil$$는 $$x$$를 올림한 정수)[^1].

| way 수 | 2 | 4 | 8 | 16 |
|---|---|---|---|---|
| 순서의 가짓수 $$n!$$ | 2 | 24 | 40,320 | 약 $$2.1 \times 10^{13}$$ |
| 집합마다 드는 비트 | 1 | 5 | 16 | 45 |

2-way는 쉽다. 집합마다 1비트로 "어느 쪽을 덜 최근에 썼나"만 적으면 정확한 LRU다[^2]. way가 늘면 비트 수보다도, 적중할 때마다 순서를 고치는 회로가 부담이다. 그래서 실제 캐시는 LRU를 값싸게 흉내 낸 규칙을 흔히 쓴다[^1]. 한 예는 "방금 쓴 것만 아니면 된다"이다. 가리키는 손가락 하나를 두고, 손가락이 가리키는 자리를 쓰면 손가락을 다음 자리로 옮긴다. 내보낼 때는 손가락이 가리키는 자리를 내보낸다[^2].

**무작위 교체.** 아무것도 적지 않는다. 평균 실패는 LRU보다 조금 많지만, 어떤 접근 순서에서도 매번 틀리게 고르는 일은 없다[^1].

## 예제

**LRU가 FIFO에 지는 접근.** 자리 4개에 블록 1, 2, 3, 1, 4, 1, 5, 2, 1, 3, 1, 4를 읽으면 LRU는 8번, FIFO는 6번 실패한다. LRU는 "최근에 안 쓴 것은 앞으로도 안 쓴다"에 걸었는데, 이 접근에서는 내보낸 블록(2, 3)이 곧 다시 온다. LRU가 평균적으로 낫다는 것이지 모든 접근에서 낫다는 것이 아니다.

**LRU가 가장 못하는 접근.** 자리 4개에 블록 0, 1, 2, 3, 4를 차례로 40바퀴(200번) 읽는다.

| 규칙 | LRU | FIFO | 무작위 (평균) | 앞날을 아는 교체 |
|---|---|---|---|---|
| 실패 (200번 중) | 200 | 200 | 약 83 (41%) | 53 |

LRU와 FIFO는 다섯 번째 블록이 들어올 때마다 바로 다음에 쓸 블록을 내보낸다. 무작위는 다음에 쓸 블록이 아닌 것을 고를 때가 많아서 절반 넘게 적중한다.

## 활용

- 운영체제의 [페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/)과 같은 문제다. 다른 점은 누가, 얼마나 급하게, 몇 개 중에서 고르느냐다.

| | 캐시 교체 | 페이지 교체 |
|---|---|---|
| 고르는 주체 | 하드웨어 회로 | 운영체제(소프트웨어) |
| 쓸 수 있는 시간 | 실패를 처리하는 몇 사이클 | 디스크를 기다리는 동안 명령어 수천 개를 돌릴 시간 |
| 후보 | 한 집합의 자리 몇 개 | 메모리의 프레임 전체 |
| 실패 한 번의 값 | 메모리에 다녀오는 시간 | 디스크에 다녀오는 시간. 훨씬 크다 |

- 실패 한 번이 아주 비싼 가상 메모리에서는 실패를 줄이려고 공을 더 들일 만하다. 그래서 페이지 교체는 LRU에 가까운 규칙을 쓴다[^3]. 캐시는 빠르게 정해야 해서 단순한 규칙에 머문다.
- 캐시가 크고 way가 많을수록 규칙 사이의 실패율 차이는 작아진다. 내보낼 후보가 많으면 아무거나 골라도 곧 쓸 블록일 가능성이 낮기 때문이다 [확인필요].
- 흔한 실수: LRU를 "가장 적게 쓴 것"으로 읽는다. 기준은 쓴 횟수가 아니라 마지막으로 쓴 때다. 운영체제 과목의 [캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/)에 이 오해의 예가 있다.

## 연결

- 선수: [집합 연관 캐시](/Hongs_Blog/studies/computer-architecture/set-associative-cache/)
- 내보낼 블록을 고친 적이 있으면 메모리에 되써야 한다: [캐시 쓰기 정책](/Hongs_Blog/studies/computer-architecture/cache-write-policy/)
- 같은 문제를 운영체제가 푸는 법(최적, LRU, FIFO, 클록): [페이지 교체 알고리즘](/Hongs_Blog/studies/operating-systems/page-replacement/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** LRU, FIFO, 무작위 교체가 각각 무엇을 내보내는지 쓰고, 적어 두어야 하는 정보가 많은 순서로 늘어놓으라.</summary>

**답:** LRU는 마지막으로 쓴 때가 가장 오래된 블록, FIFO는 가장 먼저 들어온 블록, 무작위는 아무거나. 적어 둘 정보는 LRU(적중할 때마다 순서를 고친다) > FIFO(실패할 때만 고친다) > 무작위(없다) 순이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 자리가 2개인 집합 하나에 블록 4, 8, 4, 6, 8, 4를 차례로 읽는다. LRU로 추적해 접근마다 적중 여부와 내보낸 블록을 쓰라. FIFO였다면 실패는 몇 번인가?</summary>

**답:** LRU: 4 실패, 8 실패, 4 적중, 6 실패(8을 내보냄), 8 실패(4를 내보냄), 4 실패(6을 내보냄). 실패 5번. FIFO: 4 실패, 8 실패, 4 적중, 6 실패(4를 내보냄), 8 적중, 4 실패(8을 내보냄). 실패 4번.<br>
**이유:** 6이 들어올 때 LRU는 방금 쓴 4를 지키고 8을 내보냈는데, 바로 다음에 8이 왔다. 짧은 접근에서는 어느 규칙이 이길지 정해져 있지 않다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 2-way 캐시에서는 정확한 LRU를 쓰기 쉬운데 8-way에서는 흉내 낸 규칙을 쓰는 까닭을, 집합마다 적어야 하는 정보의 양으로 설명하라.</summary>

**답:** 2-way는 순서가 2가지뿐이라 1비트로 "어느 쪽이 더 오래됐나"만 적으면 된다. 8-way는 순서가 $$8! = 40{,}320$$가지라 집합마다 적어도 16비트가 들고, 적중할 때마다 그 순서를 고치는 회로가 필요하다. 적중은 매 사이클 일어날 수 있어서 이 회로가 적중 시간을 늘린다.

</details>


[^1]: MIT 6.004 Computation Structures, Fall 2023, L13 "Caches", 슬라이드 17 (Replacement Policies: 최적 정책은 미래를 알아야 한다, LRU는 N!가지 순서를 적어야 하고 캐시는 흔히 더 싼 근사를 쓴다, 무작위는 아주 좋지는 않지만 일부러 괴롭히는 접근 순서가 없다), https://shd.mit.edu/2024/lectures/readings/6191-fall2023/L13.pdf. Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 5장 "Large and Fast: Exploiting Memory Hierarchy"
[^2]: ShanghaiTech CS 110 Computer Architecture (UC Berkeley CS61C 슬라이드 기반), 2022, "Caches Part II", 슬라이드 24~25 (2-way는 집합마다 1비트, 교체 손가락을 쓰는 "not-most-recently used" 예), https://robotics.shanghaitech.edu.cn/courses/ca/22s/lectures/2022-CA-L17_Caches_II.pdf
[^3]: University of Utah CS 3810, Lecture 20 "Cache Hierarchies, Virtual Memory", 슬라이드 7, 12 (캐시의 교체 선택지: 무작위, LRU, FIFO. 가상 메모리는 실패 손실이 커서 실패를 줄이는 데 공을 들인다), https://users.cs.utah.edu/~rajeev/cs3810/slides/3810-20.pdf
{% endraw %}
