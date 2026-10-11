---
layout: "note"
title: "직접 사상과 집합 연관 비교"
display_title: "직접 사상과 집합 연관 비교"
kind: "concept"
kind_label: "비교"
num: "38"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
updated: "2026-10-12"
status: "verified"
aliases: ["Direct-Mapped vs Set-Associative", "캐시 사상 방식 비교", "캐시 배치 정책", "Cache Placement Policy"]
description: "둘 다 주소의 가운데 비트로 \"볼 곳\"을 정하고 태그로 확인한다. 가르는 질문은 \"볼 곳에 자리가 하나인가 여럿인가\"다. 그 답이 서로 쫓아내는 실패의 수, 한 번 찾는 데 걸리는 시간, 회로의 양을 함께 정한다."
prev_url: "/studies/computer-architecture/set-associative-cache/"
prev_title: "집합 연관 캐시"
next_url: "/studies/computer-architecture/cache-write-policy/"
next_title: "캐시 쓰기 정책"
math: true
mermaid: false
code_count: 0
permalink: "/studies/computer-architecture/direct-vs-associative-cache/"
---
{% raw %}
둘 다 주소의 가운데 비트로 "볼 곳"을 정하고 태그로 확인한다. 가르는 질문은 "볼 곳에 자리가 하나인가 여럿인가"다. 그 답이 서로 쫓아내는 실패의 수, 한 번 찾는 데 걸리는 시간, 회로의 양을 함께 정한다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 줄 8개짜리 캐시(블록 4바이트)가 있다. 프로그램이 블록 2, 10, 5를 되풀이해 읽는다. 직접 사상과 2-way 중 어느 쪽이 나은가? 한 바퀴 3번 중 각각 몇 번 적중하는가?</summary>

**답:** 2-way. 직접 사상은 1번, 2-way는 3번 적중한다.<br>
**이유:** 직접 사상에서 블록 2와 10은 8로 나눈 나머지가 같아 2번 줄을 두고 서로 쫓아낸다. 블록 5만 늘 적중한다. 2-way(집합 4개)에서 2와 10은 같은 2번 집합에 가지만 자리가 둘이라 함께 머문다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 프로세서의 클록 주기가 1단계 캐시의 적중 시간에 맞춰져 있다. 실패율은 이미 낮고, 실패해도 바로 뒤의 큰 캐시가 금방 채워 준다. 직접 사상과 4-way 중 어느 쪽으로 기우는가?</summary>

**답:** 직접 사상(또는 way 수가 적은 쪽).<br>
**이유:** way가 많으면 태그 여러 개를 비교하고 맞은 쪽 데이터를 골라야 해서 적중 시간이 는다. 적중 시간이 클록 주기를 늘리면 모든 명령어가 느려진다. 실패 손실이 작을 때는 실패율을 조금 낮추는 것보다 적중 시간을 지키는 쪽이 이득이다. 수로 견주는 법은 [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)에 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 실패하면 수십 사이클 떨어진 주기억장치까지 가야 하는 마지막 단계 캐시다. 적중 시간이 조금 늘어도 괜찮다. 어느 쪽인가?</summary>

**답:** 집합 연관(way 수가 많은 쪽).<br>
**이유:** 실패 한 번이 비쌀수록, 서로 쫓아내는 실패를 없애는 값이 커진다. 적중 시간이 조금 느는 손해보다 실패율이 주는 이득이 크다.

</details>


## 결정적 차이

| | 직접 사상 | $$n$$-way 집합 연관 |
|---|---|---|
| 블록이 갈 수 있는 자리 | 줄 1개 | 집합 1개 안의 $$n$$개 |
| 인덱스가 고르는 것 | 줄. 비트 수는 $$\log_2$$(줄 수) | 집합. 비트 수는 $$\log_2$$(줄 수 ÷ $$n$$) |
| 한 번 찾을 때 | 태그 1개 비교 | 태그 $$n$$개를 동시에 비교하고, 맞은 자리의 데이터를 고른다 |
| 적중 시간 | 짧다. 비교가 끝나기 전에 데이터를 먼저 꺼낼 수 있다 | 조금 길다. 어느 자리가 맞았는지 알아야 데이터가 나온다 |
| 서로 쫓아내는 실패 | 많다 | 적다 |
| 내보낼 블록 고르기 | 필요 없다 | 필요하다 |
| 줄마다 드는 비트 | 태그가 짧다 | way를 두 배 할 때마다 태그가 1비트 는다 |

선택을 가르는 줄은 "적중 시간"과 "서로 쫓아내는 실패" 둘이다. 한쪽을 얻으면 다른 쪽을 내준다[^1]. 비트 수 차이는 작다. 데이터 64 KiB, 블록 32바이트 캐시에서 직접 사상은 559,104비트, 8-way는 565,248비트로 1.1% 차이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: C1의 1/3과 3/3, 아래 C4의 7/9·6/9·0/9, 비트 수 — [37_set-associative-cache_impl.py](/Hongs_Blog/studies/computer-architecture/code/37_set-associative-cache_impl/) (실제 하드웨어가 아니라 파이썬 흉내)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 줄 8개짜리 캐시(블록 4바이트)에 블록 0~8의 아홉 개를 차례로 되풀이해 읽는다. 직접 사상은 9번 중 7번, 2-way는 6번, 완전 연관(가장 오래 안 쓴 것을 내보냄)은 0번 적중한다. way 수를 바꿔서는 풀리지 않는다. 무엇을 바꿔야 하는가?</summary>

**답:** 캐시 크기(줄 수)를 늘린다. 줄이 9개 이상 들어가면 어떤 방식이든 첫 바퀴 뒤로는 모두 적중한다.<br>
**이유:** 여기서 모자란 것은 자리를 고를 자유가 아니라 자리의 수다. 쓰는 블록이 캐시에 다 들어가지 않아서 나는 실패는 연관도로 못 없앤다. 실패를 원인별로 가르는 법은 [캐시 성능과 평균 접근 시간](/Hongs_Blog/studies/computer-architecture/cache-performance-amat/)에 있다.

</details>


그 밖에 둘 다 아닌 경우.

- 칸 수가 아주 적고 실패 한 번이 매우 비싼 구조에는 완전 연관을 쓴다. [TLB](/Hongs_Blog/studies/operating-systems/tlb/)가 그렇다.
- 캐시 하나로 적중 시간과 실패율을 다 잡기 어려우면 캐시를 여러 단계로 둔다: [다단계 캐시](/Hongs_Blog/studies/computer-architecture/multilevel-cache/).

[^1]: ShanghaiTech CS 110 Computer Architecture (UC Berkeley CS61C 슬라이드 기반), 2022, "Caches Part II", 슬라이드 24, 26 (집합 연관의 비용: 비교기 N개와 선택 회로 지연, 직접 사상이냐 집합 연관이냐는 실패의 값과 구현의 값 사이의 선택), https://robotics.shanghaitech.edu.cn/courses/ca/22s/lectures/2022-CA-L17_Caches_II.pdf. MIT 6.004 Computation Structures, Fall 2023, L13 "Caches", 슬라이드 16, 23~25, https://shd.mit.edu/2024/lectures/readings/6191-fall2023/L13.pdf
{% endraw %}
