---
layout: "note"
title: "연관 규칙"
display_title: "연관 규칙 (Association Rule)"
kind: "concept"
kind_label: "정의"
num: "11"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Association Rule", "연관 규칙 마이닝", "Association Rule Mining", "신뢰도", "Confidence", "강한 규칙", "Strong Rule", "최소 신뢰도", "min_conf", "지지도-신뢰도 틀", "Support-Confidence Framework"]
description: "\"기저귀를 사는 사람은 맥주도 산다\"처럼 한 묶음이 다른 묶음을 부르는 관계를 규칙 꼴로 적은 것이다. 규칙의 힘은 두 수로 잰다. 둘을 함께 산 거래가 전체에서 얼마나 되는지(지지도)와, 앞쪽을 산 거래 중 뒤쪽도 산 비율(신뢰도)이다. 둘 다 기준을 넘으면 강한 규칙이라 부른다…"
prev_url: "/studies/data-science/frequent-patterns/"
prev_title: "빈발 패턴"
next_url: "/studies/data-science/closed-maximal-patterns/"
next_title: "닫힌 패턴과 최대 패턴"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-science/association-rules/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

"기저귀를 사는 사람은 맥주도 산다"처럼 한 묶음이 다른 묶음을 부르는 관계를 규칙 꼴로 적은 것이다. 규칙의 힘은 두 수로 잰다. 둘을 함께 산 거래가 전체에서 얼마나 되는지(지지도)와, 앞쪽을 산 거래 중 뒤쪽도 산 비율(신뢰도)이다. 둘 다 기준을 넘으면 강한 규칙이라 부른다. 다만 신뢰도가 높아도 뒤쪽 물건이 원래 아주 흔하면 규칙은 아무것도 알려 주지 않을 수 있다.

</div>


## 예시로 보기

[빈발 패턴](/Hongs_Blog/studies/data-science/frequent-patterns/)의 영수증 5장에서 {맥주, 기저귀}가 빈발이었다. 그런데 "같이 자주 산다"보다 "기저귀를 사면 맥주도 살 것 같다"가 더 쓸모 있다[^1]. 같은 빈발 집합에서 방향이 다른 두 규칙이 나온다[^2].

| 규칙 | 지지도 | 신뢰도 |
|---|---|---|
| 기저귀 → 맥주 | 둘 다 든 거래 3/5 = 60% | 기저귀가 든 4장 중 맥주도 든 3장 = 75% |
| 맥주 → 기저귀 | 60% | 맥주가 든 3장 중 기저귀도 든 3장 = 100% |

지지도는 같고 신뢰도만 다르다. 신뢰도의 분모가 규칙의 앞쪽이기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 규칙의 지지도·신뢰도, 슬라이드 p.23의 여섯 규칙, 카드 C3 — [10_frequent-patterns_verify.py](/Hongs_Blog/studies/data-science/code/10_frequent-patterns_verify/), [13_apriori_impl.py](/Hongs_Blog/studies/data-science/code/13_apriori_impl/)</div>

</div>


## 정의

**연관 규칙** $$X \Rightarrow Y$$는 항목 집합 $$X$$와 $$Y$$($$X \cap Y = \varnothing$$) 사이의 관계다. 빈발 패턴보다 많은 것을 말해 준다[^1]. 규칙의 힘은 두 수로 잰다[^2].

1. **지지도**(인기): $$X$$와 $$Y$$가 함께 나타나는 거래의 비율이다. $$s(X \Rightarrow Y) = \frac{\operatorname{support}(X \cup Y)}{\vert D\vert }$$. 여기서 $$X \cup Y$$는 "두 묶음을 합친 항목 집합", 즉 둘 다 산 거래를 센다.
2. **신뢰도**(상관): $$X$$를 담은 거래가 $$Y$$도 담을 조건부 확률이다.

$$c(X \Rightarrow Y) = P(Y \mid X) = \frac{\operatorname{support}(X \cup Y)}{\operatorname{support}(X)}$$


**연관 규칙 마이닝**은 두 단계다[^3].

1. 지지도가 min_sup 이상인 빈발 항목 집합을 모두 찾는다.
2. 그 빈발 집합에서 신뢰도가 min_conf 이상인 강한 규칙을 만든다.

규칙 만들기는 이렇다[^4]. 빈발 집합 $$l$$의 공집합 아닌 진부분집합 $$s$$마다 규칙 $$s \Rightarrow (l - s)$$를 만들고, 신뢰도 $$\frac{\operatorname{support}(l)}{\operatorname{support}(s)}$$가 min_conf 이상이면 남긴다. 분자와 분모가 모두 빈발 집합의 지지도라 DB를 다시 볼 필요가 없다.

## 예제

슬라이드의 거래 4개(ACD, BCE, ABCE, BE)에서 빈발 집합 $$l = \{B, C, E\}$$(지지 2)의 규칙을 만든다. 부분집합의 지지 개수는 B 3, C 3, E 3, BC 2, BE 3, CE 2다. 최소 신뢰도는 70%다[^4].

| 규칙 | 신뢰도 | 강한가 |
|---|---|---|
| {B} → {C, E} | 2/3 = 66.7% | 아니다 |
| {C} → {B, E} | 2/3 = 66.7% | 아니다 |
| {E} → {B, C} | 2/3 = 66.7% | 아니다 |
| {B, C} → {E} | 2/2 = 100% | 강하다 |
| {B, E} → {C} | 2/3 = 66.7% | 아니다 |
| {C, E} → {B} | 2/2 = 100% | 강하다 |

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 3-1 슬라이드 p.23 "{C} → {B, E}: confidence = 2/3 = 100%" / 문제점: 2/3은 66.7%다 / 수정안: 66.7%(강한 규칙이 아니다). 슬라이드가 파란색으로 강조한 강한 규칙 {B, C} → {E}, {C, E} → {B}는 그대로 맞다 / 근거: sup({B, C, E}) = 2, sup({C}) = 3. 13_apriori_impl.py

</div>


## 연결

- 선수: [빈발 패턴](/Hongs_Blog/studies/data-science/frequent-patterns/), 신뢰도는 [조건부 확률](/Hongs_Blog/studies/probability-statistics/conditional-probability/)이다
- 빈발 집합을 찾는 방법: [Apriori 알고리즘](/Hongs_Blog/studies/data-science/apriori/)
- 지지도-신뢰도만으로 모자란 이유: [리프트](/Hongs_Blog/studies/data-science/lift/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"신뢰도가 높으면 앞쪽이 뒤쪽을 사게 만든다"</div>

아니다. 신뢰도는 $$P(Y \mid X)$$일 뿐이다. 뒤쪽 $$Y$$가 원래 아주 흔하면($$P(Y)$$가 크면) 아무 $$X$$나 넣어도 신뢰도가 높게 나온다. 학생의 75%가 시리얼을 먹는 학교에서 "축구 → 시리얼"의 신뢰도 66.7%는 오히려 축구하는 학생이 시리얼을 덜 먹는다는 뜻이다.[^5] 확인하는 법: 신뢰도를 $$P(Y)$$와 비교한다. 이것이 [리프트](/Hongs_Blog/studies/data-science/lift/)다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 규칙 $$X \Rightarrow Y$$의 지지도와 신뢰도를 식으로 쓰고, 연관 규칙 마이닝의 두 단계를 쓰라.</summary>

**답:** 지지도 $$= \frac{\operatorname{support}(X \cup Y)}{\vert D\vert }$$, 신뢰도 $$= \frac{\operatorname{support}(X \cup Y)}{\operatorname{support}(X)}$$. ① min_sup 이상인 빈발 항목 집합을 모두 찾는다. ② 그것에서 min_conf 이상인 규칙을 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 규칙 $$A \Rightarrow B$$와 $$B \Rightarrow A$$는 지지도가 늘 같지만 신뢰도는 다를 수 있다. 이유를 대라.</summary>

**답:** 지지도는 둘을 함께 담은 거래의 비율이라 방향과 무관하다. 신뢰도는 그 수를 앞쪽의 지지도로 나누는데, 앞쪽이 $$A$$냐 $$B$$냐에 따라 분모가 달라진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예시의 영수증 5장에서 규칙 달걀 → 견과의 지지도와 신뢰도를 구하라.</summary>

**답:** 달걀과 견과가 함께 든 거래는 4, 5로 2장, 지지도 40%. 달걀이 든 거래는 3, 4, 5로 3장이라 신뢰도 $$\frac23 \approx 66.7\%$$.

</details>


[^1]: 데이터 과학 3회 강의 자료 「3-1_FP」, p.9
[^2]: 같은 자료, p.10
[^3]: 같은 자료, p.11
[^4]: 같은 자료, p.23
[^5]: 데이터 과학 3회 강의 자료 「3-2_FP-eval」, p.11
{% endraw %}
