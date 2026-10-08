---
layout: "note"
title: "FP-Growth 예제 사다리"
display_title: "FP-Growth 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "15"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: FP-Growth의 트리 압축과 조건부 패턴 베이스, 연관 규칙의 신뢰도."
prev_url: "/studies/data-science/apriori-ladder/"
prev_title: "Apriori 예제 사다리"
next_url: "/studies/data-science/k-means-ladder/"
next_title: "k-평균 예제 사다리"
math: false
mermaid: false
code_count: 1
permalink: "/studies/data-science/fp-growth-ladder/"
---
{% raw %}
사용 개념: [FP-Growth](/Hongs_Blog/studies/data-science/fp-growth/)의 트리 압축과 조건부 패턴 베이스, [연관 규칙](/Hongs_Blog/studies/data-science/association-rules/)의 신뢰도.

"FP-Growth로 빈발 항목 집합을 찾으라"는 문제는 늘 같은 하위목표로 나뉜다. ① 항목 개수를 세어 순서 정하기 ② 거래를 그 순서로 다시 적어 트리 만들기 ③ 맨 아래 항목부터 조건부 패턴 베이스와 조건부 FP-tree 구하기 ④ 빈발 패턴 모으기. 규칙까지 물으면 ⑤ 가장 긴 빈발 집합에서 신뢰도를 계산한다. 같은 개수의 항목은 알파벳순(한글은 가나다순)으로 놓는다.

## 문제 1 · 완전한 풀이

거래 9개(10: A, B, E / 20: A, B, D / 30: B, C / 40: B, D / 50: A, C / 60: B, C / 70: A, C / 80: A, B, C, E / 90: A, B, C), 최소 지지 개수 2[^1].

1. *순서 정하기:* B 7, A 6, C 6, D 2, E 2 → <B, A, C, D, E>.
2. *트리 만들기:* 다시 적은 거래 BAE, BAD, BC, BD, AC, BC, AC, BACE, BAC를 차례로 넣는다. 루트 아래 B:7(그 아래 A:4, C:2, D:1)과 A:2(그 아래 C:2). A:4 아래 E:1, D:1, C:2(그 아래 E:1).
3. *조건부 베이스와 트리:*
    - E: {B, A}:1, {B, A, C}:1 → B 2, A 2, C 1 → <B:2, A:2>
    - D: {B, A}:1, {B}:1 → <B:2>
    - C: {B, A}:2, {B}:2, {A}:2 → <B:4, A:2>, <A:2>
    - A: {B}:4 → <B:4>
4. *빈발 패턴:* {B,E}, {A,E}, {A,B,E}, {B,D}, {B,C}:4, {A,C}:4, {A,B,C}:2, {A,B}:4와 1항목 다섯 개.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [15_fp-growth_impl.py](/Hongs_Blog/studies/data-science/code/15_fp-growth_impl/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

3-1 슬라이드 p.36 연습 2. 거래 T1: E, K, M, N, O, Y / T2: D, E, K, N, O, Y / T3: A, E, K, M / T4: C, K, M, U, Y / T5: C, E, I, K, O, O. 최소 지지 개수 3, 최소 신뢰도 50%[^2].

1. *순서 정하기:* K 5, E 4, M 3, O 3, Y 3 (나머지는 3 미만) → <K, E, M, O, Y>.
2. *트리 만들기:* KEMOY, KEOY, KEM, KMY, KEO.
3. *조건부 베이스와 트리:* Y: {K,E,M,O}:1, {K,E,O}:1, {K,M}:1 → <K:3>. O: {K,E,M}:1, {K,E}:2 → <K:3, E:3>. M: {K,E}:2, {K}:1 → <K:3>. E: {K}:4 → <K:4>.
4. *빈발 패턴:* {K,Y}:3, {K,O}:3, {E,O}:3, {K,E,O}:3, {K,M}:3, {K,E}:4.
5. *규칙:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

가장 긴 빈발 집합 {K, E, O}(지지 3)에서: K → EO = 3/5 = 60%, E → KO = 3/4 = 75%, O → KE = 3/3 = 100%, KE → O = 3/4 = 75%, KO → E = 3/3 = 100%, EO → K = 3/3 = 100%. 모두 50% 이상이라 여섯 개 모두 강하다[^3].

</details>


## 문제 3 · 하위목표 절반이 빈칸

거래 5개: ① a, c, d, f, g, i, m, p ② a, b, c, f, l, m, o ③ b, f, h, j, o ④ b, c, k, p, s ⑤ a, c, e, f, l, m, n, p. 최소 지지 개수 3[^s1].

1. *순서 정하기:* c 4, f 4, a 3, b 3, m 3, p 3 → <c, f, a, b, m, p>.
2. *트리 만들기:* ______
3. *조건부 베이스와 트리:* ______
4. *빈발 패턴:* 2항목 이상은 {c,p}, {c,f}, {a,c}, {a,f}, {a,c,f}, {c,m}, {f,m}, {a,m}, {c,f,m}, {a,c,m}, {a,f,m}, {a,c,f,m}, 모두 지지 3.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 다시 적은 거래: cfamp, cfabm, fb, cbp, cfamp.
```
(루트)
├─ c:4
│  ├─ f:3
│  │  └─ a:3
│  │     ├─ m:2
│  │     │  └─ p:2
│  │     └─ b:1
│  │        └─ m:1
│  └─ b:1
│     └─ p:1
└─ f:1
   └─ b:1
```

{: start="3"}
3. p: {c,f,a,m}:2, {c,b}:1 → c 3만 빈발 → <c:3>. m: {c,f,a}:2, {c,f,a,b}:1 → <c:3, f:3, a:3>. b: {c,f,a}:1, {c}:1, {f}:1 → c 2, f 2, a 1이라 빈발 없음. a: {c,f}:3 → <c:3, f:3>. f: {c}:3 → <c:3>.<br>
m의 조건부 트리가 가지 하나(c-f-a)라, 그 항목들의 모든 조합에 m을 붙인 7개가 바로 빈발 패턴이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [15_fp-growth-ladder_p4.py](/Hongs_Blog/studies/data-science/code/15_fp-growth-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

거래 6개: ① 우유, 빵, 버터 ② 빵, 버터 ③ 우유, 빵 ④ 우유, 빵, 버터, 잼 ⑤ 빵, 잼 ⑥ 우유, 버터. 최소 지지 개수 2로 FP-tree를 그리고 빈발 항목 집합을 모두 찾으라. 가장 긴 빈발 집합에서 신뢰도 60% 이상인 규칙을 쓰라[^s1].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

순서: 빵 5, 버터 4, 우유 4, 잼 2 → <빵, 버터, 우유, 잼>.
```
(루트)
├─ 빵:5
│  ├─ 버터:3
│  │  └─ 우유:2
│  │     └─ 잼:1
│  ├─ 우유:1
│  └─ 잼:1
└─ 버터:1
   └─ 우유:1
```
잼: {빵, 버터, 우유}:1, {빵}:1 → <빵:2> → {빵, 잼}:2.<br>
우유: {빵, 버터}:2, {빵}:1, {버터}:1 → 빵 3, 버터 3 → {빵, 우유}:3, {버터, 우유}:3, {빵, 버터, 우유}:2.<br>
버터: {빵}:3 → {빵, 버터}:3.<br>
가장 긴 빈발 집합 {빵, 버터, 우유}:2의 규칙: 빵 → 버터·우유 40%, 버터 → 빵·우유 50%, 우유 → 빵·버터 50%, 빵·버터 → 우유 66.7%, 빵·우유 → 버터 66.7%, 버터·우유 → 빵 66.7%. 60% 이상은 앞쪽이 두 항목인 세 규칙이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [15_fp-growth-ladder_p4.py](/Hongs_Blog/studies/data-science/code/15_fp-growth-ladder_p4/)</div>

</div>


[^1]: 3-2학기/데이터 과학/1.수업자료/03.3-1_FP.pdf, p.30~35
[^2]: 같은 자료, p.36. 풀이는 3-2학기/데이터 과학/1.수업자료/03.3-4-solutions.pdf, p.3~8
[^3]: 3-2학기/데이터 과학/1.수업자료/03.3-4-solutions.pdf, p.10
[^s1]: 에이전트 보충. 문제 3의 거래는 Han, Pei, Yin, SIGMOD 2000의 예이고, 같은 개수의 항목을 알파벳순으로 놓아 원 논문의 트리(f, c 순서)와 모양이 다르다. 문제 4는 원본에 없다. 답은 문제 코드로 확인했다.
{% endraw %}
