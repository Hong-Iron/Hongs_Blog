---
layout: "note"
title: "다단계 캐시"
display_title: "다단계 캐시 (Multilevel Cache)"
kind: "concept"
kind_label: "기법"
num: "42"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
updated: "2026-10-12"
status: "verified"
aliases: ["Multilevel Cache", "Multi-level Cache", "2단계 캐시", "L1 캐시", "L2 캐시", "L3 캐시", "지역 실패율", "Local Miss Rate", "전역 실패율", "Global Miss Rate", "캐시 계층", "Cache Hierarchy"]
description: "캐시 하나로는 \"찾기가 빠를 것\"과 \"웬만하면 다 들어 있을 것\"을 함께 얻기 어렵다. 그래서 작고 빠른 캐시를 프로세서 바로 옆에 두고, 그 뒤에 크고 조금 느린 캐시를 하나 더 둔다. 책상 위에 몇 권, 손 닿는 책꽂이에 수십 권을 두는 것과 같다. 앞의 캐시가 놓친 것을 뒤의…"
prev_url: "/studies/computer-architecture/cache-performance-amat/"
prev_title: "캐시 성능과 평균 접근 시간"
next_url: "/studies/computer-architecture/cache-tlb-interaction/"
next_title: "캐시와 TLB와 페이지 테이블의 상호작용"
math: true
mermaid: false
code_count: 1
permalink: "/studies/computer-architecture/multilevel-cache/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

캐시 하나로는 "찾기가 빠를 것"과 "웬만하면 다 들어 있을 것"을 함께 얻기 어렵다. 그래서 작고 빠른 캐시를 프로세서 바로 옆에 두고, 그 뒤에 크고 조금 느린 캐시를 하나 더 둔다. 책상 위에 몇 권, 손 닿는 책꽂이에 수십 권을 두는 것과 같다. 앞의 캐시가 놓친 것을 뒤의 캐시가 대부분 받아 줘서, 멀리 메모리까지 가는 일이 크게 준다. 대신 뒤의 캐시도 놓치면 두 캐시를 다 찾아본 시간까지 얹혀서 가장 느린 경우는 더 느려진다.

</div>


## 예시로 보기

캐시에서 찾는 데 1사이클, 실패율 5%, 메모리까지 다녀오는 데 100사이클이면 평균 접근 시간은 $$1 + 0.05 \times 100 = 6$$사이클이다. 실패율을 더 낮추려고 캐시를 키우면 찾는 시간이 늘어 클록 주기가 길어진다. 메모리를 빠르게 만들 수도 없다.

캐시와 메모리 사이에 캐시를 하나 더 넣는다. 뒤의 캐시는 찾는 데 10사이클이 걸리지만 커서, 앞의 캐시가 놓친 것 중 80%를 갖고 있다. 접근 1,000번을 따라가 본다.

| | 횟수 | 한 번에 드는 사이클 | 합 |
|---|---|---|---|
| 앞의 캐시를 찾아본다 | 1,000 | 1 | 1,000 |
| 앞에서 실패해 뒤의 캐시를 찾아본다 | 50 | 10 | 500 |
| 뒤에서도 실패해 메모리에 간다 | 10 | 100 | 1,000 |
| 합 | | | 2,500 |

평균 2.5사이클이다. 6사이클이던 것이 반 아래로 줄었다. 메모리까지 가는 접근이 50번에서 10번으로 줄었기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 6사이클과 2.5사이클, 전역 실패율 = 지역 실패율의 곱, 두 캐시를 이은 흉내기의 실패 수(821, 512)와 평균 15.5사이클이 식과 같은 것, 카드 C2 — [42_multilevel-cache_verify.py](/Hongs_Blog/studies/computer-architecture/code/42_multilevel-cache_verify/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 정의

프로세서에 가까운 쪽부터 1단계 캐시(L1), 2단계 캐시(L2)라 부른다. L2는 L1이 실패했을 때만 찾아본다. L2도 실패하면 메모리에 간다.

```
 프로세서 --> [ L1: 작고 빠르다 ] --실패--> [ L2: 크고 조금 느리다 ] --실패--> [ 메모리 ]
                    | 적중                          | 적중
                    v                               v
                 바로 준다                  L1에 채우고 준다
```

**평균 접근 시간.** L1의 실패 손실 자리에 "L2에서 찾는 평균 시간"이 들어간다[^1].

$$\text{AMAT} = T_1 + m_1 \times (T_2 + m_2 \times T_{\text{mem}})$$


$$T_1$$, $$T_2$$는 L1, L2의 적중 시간이다. $$m_1$$은 L1의 실패율, $$m_2$$는 L2가 받은 접근 중 실패한 비율, $$T_{\text{mem}}$$은 메모리에 다녀오는 시간이다. 예시는 $$1 + 0.05 \times (10 + 0.2 \times 100) = 2.5$$다. 괄호 안의 30사이클이 L1에서 본 실패 손실이다. L2가 없을 때의 100사이클이 30사이클로 준 셈이다.

**실패율을 세는 두 가지 분모.** L2의 실패율은 무엇으로 나누느냐에 따라 값이 둘이다[^1].

- **지역 실패율**(local miss rate): 그 캐시가 **받은** 접근 중 실패한 비율. L2라면 L2의 실패 수 ÷ L1의 실패 수다.
- **전역 실패율**(global miss rate): 프로세서가 낸 **모든** 접근 중 그 캐시까지 와서 실패한 비율. L2의 실패 수 ÷ 전체 접근 수다.

$$\text{L2 전역 실패율} = \frac{\text{L2 실패}}{\text{전체 접근}} = \frac{\text{L1 실패}}{\text{전체 접근}} \times \frac{\text{L2 실패}}{\text{L1 실패}} = m_1 \times m_2$$


예시에서 L2의 지역 실패율은 $$10 \div 50 = 20\%$$, 전역 실패율은 $$10 \div 1{,}000 = 1\%$$다. 위 AMAT 식의 $$m_2$$는 지역 실패율이다. 전역 실패율 $$g_2$$로 쓰면 $$T_1 + m_1 T_2 + g_2 T_{\text{mem}}$$이고 값은 같다($$1 + 0.5 + 1 = 2.5$$).

L1은 받은 접근이 곧 전체 접근이라 두 실패율이 같다.

## 예제

**흉내기로 확인.** L1은 직접 사상 256바이트, L2는 4-way 2 KiB(블록은 둘 다 16바이트)로 잇고, 배열 하나를 차례로 읽으며 변수 4개를 돌아가며 쓰는 접근 4,096번을 넣었다. 시간은 L1 1사이클, L2 10사이클, 메모리 100사이클로 쳤다.

| | L1 | L2 |
|---|---|---|
| 받은 접근 | 4,096 | 821 |
| 실패 | 821 | 512 |
| 지역 실패율 | 20.0% | 62.4% |
| 전역 실패율 | 20.0% | 12.5% |

접근마다 걸린 사이클을 더해 나눈 평균은 15.5사이클이고, 식 $$1 + 0.2004 \times (10 + 0.6236 \times 100)$$의 값과 같다. L2 없이 L1만 있으면 21.0사이클이다.

"어? L2의 실패율이 62%나 되는데 쓸모가 있나?" L2의 지역 실패율은 원래 높게 나온다[^1]. 쉬운 접근(방금 쓴 것, 바로 옆)은 L1이 다 맞히고, L1이 놓친 어려운 접근만 L2로 온다. 같은 L2에 4,096번을 모두 넣어 혼자 쓰게 하면 실패율이 12.5%다. L2가 일을 얼마나 하는지는 전역 실패율로 본다. 메모리까지 가는 접근이 20.0%에서 12.5%로 줄었다.

**세 단계.** 식의 맨 안쪽에 한 겹을 더 넣는다. L3의 적중 시간이 30사이클, 지역 실패율이 50%면

$$1 + 0.05 \times \big(10 + 0.2 \times (30 + 0.5 \times 100)\big) = 2.3\text{ 사이클}$$


## 활용

- **단계마다 목표가 다르다.** L1의 적중 시간은 모든 접근이 쓰고 클록 주기에 걸린다. 그래서 L1은 작고 단순하게 만들어 적중 시간을 줄인다. L2는 L1이 실패했을 때만 쓰이므로 적중 시간이 조금 길어도 된다. 대신 실패하면 메모리까지 가야 하니 크게, way를 많이 두어 실패율을 줄인다[^2].
- 캐시 설계 둘을 견주는 법은 [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)의 대표 문제 2에 있다. 실패 손실이 작은 자리(L1)에서는 적중 시간이 짧은 쪽이 이기고, 실패 손실이 큰 자리(마지막 단계)에서는 실패율이 낮은 쪽이 이긴다.
- 어셈블리어 과목은 L1을 프로세서 안의 캐시, L2를 그 밖의 캐시로 소개한다: [캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/)의 과목별 관점.
- 흔한 실수.
    - L2의 지역 실패율을 전역 실패율 자리에 넣는다. 예시에서 $$1 + 0.05 \times 10 + 0.2 \times 100$$으로 계산하면 21.5가 나온다.
    - L2의 적중 시간을 빼먹는다. L1이 실패하면 L2를 찾아보는 시간은 L2의 적중 여부와 관계없이 든다.

## 연결

- 선수: [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)
- 층을 쌓는 까닭: [메모리 계층](/Hongs_Blog/studies/operating-systems/memory-hierarchy/)
- 코어가 여럿일 때 어느 단계를 함께 쓰는지: [멀티코어와 병렬 처리](/Hongs_Blog/studies/computer-architecture/multicore-parallelism/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 2단계 캐시의 평균 접근 시간 식을 쓰고, L2의 지역 실패율과 전역 실패율이 각각 무엇을 무엇으로 나눈 값인지 쓰라.</summary>

**답:** AMAT = $$T_1 + m_1 \times (T_2 + m_2 \times T_{\text{mem}})$$. 지역 실패율 = L2 실패 수 ÷ L2가 받은 접근 수(= L1 실패 수). 전역 실패율 = L2 실패 수 ÷ 전체 접근 수 = $$m_1 \times m_2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** L1 적중 1사이클, L1 실패율 8%, L2 적중 12사이클, L2 지역 실패율 25%, 메모리 150사이클이다. 평균 접근 시간과 L2의 전역 실패율을 구하라. L2가 없으면 평균은 얼마인가?</summary>

**답:** $$1 + 0.08 \times (12 + 0.25 \times 150) = 1 + 0.08 \times 49.5 = 4.96$$사이클. 전역 실패율은 $$0.08 \times 0.25 = 2\%$$. L2가 없으면 $$1 + 0.08 \times 150 = 13$$사이클.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 어떤 L2 캐시의 지역 실패율이 60%다. "절반 넘게 실패하니 쓸모없는 캐시"라는 말이 왜 틀렸는지 설명하라.</summary>

**답:** L2는 L1이 놓친 접근만 받는다. 맞히기 쉬운 접근은 L1이 이미 걸러 갔으므로 L2의 지역 실패율은 높게 나오기 마련이다. L2의 쓸모는 메모리까지 가는 접근을 얼마나 줄였는지로 본다. L1 실패율이 5%면 L2가 없을 때 5%가 메모리에 가고, L2가 있으면 $$0.05 \times 0.6 = 3\%$$만 간다.

</details>


[^1]: ShanghaiTech CS 110 Computer Architecture (UC Berkeley CS61C 슬라이드 기반), 2018, "Performance and Floating Point Arithmetic", 슬라이드 5, 7 (Local vs. Global Miss Rates, 전역 실패율 = 지역 실패율의 곱, 2단계 AMAT 식, L2의 지역 실패율은 전역 실패율보다 훨씬 크다), https://robotics.shanghaitech.edu.cn/courses/ca/18s/lectures/2018-CA-L17-PerfFP.pdf
[^2]: Patterson & Hennessy, *Computer Organization and Design* (MIPS Edition), 5장 "Large and Fast: Exploiting Memory Hierarchy" (다단계 캐시에서 1단계는 적중 시간을, 2단계는 실패율을 줄이는 쪽으로 설계한다)
{% endraw %}
