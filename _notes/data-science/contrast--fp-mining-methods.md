---
layout: "note"
title: "빈발 패턴 마이닝 방법 비교"
display_title: "빈발 패턴 마이닝 방법 비교"
kind: "concept"
kind_label: "비교"
num: "16"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Apriori vs ECLAT vs FP-Growth", "빈발 패턴 알고리즘 비교"]
description: "세 방법은 같은 자료에서 같은 빈발 패턴을 찾는다. 다른 것은 지지도를 세는 방법과, 그 대가로 무엇을 많이 쓰느냐다. 고르는 질문은 둘이다. DB를 여러 번 훑을 여유가 있는가? 메모리에 무엇을 들고 있을 수 있는가?"
prev_url: "/studies/data-science/fp-growth/"
prev_title: "FP-Growth"
next_url: "/studies/data-science/lift/"
next_title: "리프트"
math: false
mermaid: false
code_count: 0
permalink: "/studies/data-science/contrast--fp-mining-methods/"
---
{% raw %}
세 방법은 같은 자료에서 같은 빈발 패턴을 찾는다[^1]. 다른 것은 지지도를 세는 방법과, 그 대가로 무엇을 많이 쓰느냐다. 고르는 질문은 둘이다. DB를 여러 번 훑을 여유가 있는가? 메모리에 무엇을 들고 있을 수 있는가?

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 거래 수억 건이 디스크에 있어 한 번 훑는 데 몇 시간 걸리고, 가장 긴 빈발 집합은 8개 항목쯤이다. (b) 거래 수천 건이 메모리에 다 들어가고, 구현을 빨리 끝내야 하는 수업 과제다. Apriori와 FP-Growth 중 무엇이 알맞은가?</summary>

**답:** (a) FP-Growth. DB를 두 번만 훑는다. Apriori는 약 8번 훑어야 한다. (b) Apriori. 결합과 가지치기만으로 짧게 구현할 수 있고, 자료가 작아 여러 번 훑어도 부담이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 항목 수는 적지만(수십 개) 거래가 아주 많고, 항목마다 든 거래 번호를 비트열로 메모리에 둘 수 있다. 어느 방법이 잘 맞는가? 같은 자료에서 흔한 항목이 거의 모든 거래에 들어 있다면 무엇이 문제인가?</summary>

**답:** ECLAT. 비트열의 AND로 교집합을 빠르게 구하고 DB는 한 번만 읽는다. 다만 흔한 항목의 TID 목록은 거래 수만큼 길어 교집합 하나에도 시간과 메모리가 많이 든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 설명은 어느 방법인가? ① 크기를 한 단계씩 늘리며 너비 우선으로 찾는다 ② 항목 → 거래 번호 표를 만든다 ③ 거래를 빈도순으로 정렬해 앞부분을 공유하는 트리로 압축한다 ④ 후보를 만들지 않는다</summary>

**답:** ① Apriori ② ECLAT ③ FP-Growth ④ FP-Growth. ECLAT은 깊이 우선이지만 교집합할 후보 짝은 만든다.

</details>


## 결정적 차이

| | Apriori | ECLAT | FP-Growth |
|---|---|---|---|
| 데이터 형식 | 수평 (거래 목록) | 수직 (TID 목록) | 압축 (FP-tree, 조건부 트리) |
| DB 훑기 | 많다 (가장 긴 빈발 집합 크기만큼) | 1번 (TID 목록 만들 때) | 2번 |
| 후보 생성 | 한다 | 한다 | 하지 않는다 |
| 지지도 세는 법 | DB를 훑어 센다 | TID 목록의 교집합 | FP-tree에서 패턴을 키운다 |
| 탐색 순서 | 너비 우선 (크기별) | 깊이 우선 | 깊이 우선 |
| 메모리 | 많음 ~ 아주 많음 | 많음 ~ 아주 많음 | 적음 (FP-tree만) |
| 핵심 생각 | 아프리오리 성질로 후보 가지치기 | 교집합으로 지지도 | 앞부분 트리로 후보 생성 피하기 |

표는 슬라이드 요약을 옮긴 것이다[^2]. 선택을 가르는 것은 "DB 훑기"와 "메모리" 두 줄이다. 디스크 읽기가 비싸면 Apriori가 빠지고, 메모리가 빠듯하면 ECLAT이 빠진다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 같은 자료(거래 9개, min_sup 2)에서 세 구현의 결과가 같고, 각각 무작위 자료 300개에서 모든 부분집합을 세는 방법과 같다 — [13_apriori_impl.py](/Hongs_Blog/studies/data-science/code/13_apriori_impl/), [14_eclat_impl.py](/Hongs_Blog/studies/data-science/code/14_eclat_impl/), [15_fp-growth_impl.py](/Hongs_Blog/studies/data-science/code/15_fp-growth_impl/)</div>

</div>


## 셋 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 세 방법 모두 결과가 너무 많아 쓸 수 없는 상황과, 그때의 선택지를 쓰라.</summary>

**답:** 최소 지지도를 낮추거나 거래가 길면 빈발 패턴이 수백만 개로 늘어난다. 이때는 모든 빈발 패턴 대신 [닫힌 패턴이나 최대 패턴](/Hongs_Blog/studies/data-science/closed-maximal-patterns/)만 찾거나, 지지도·신뢰도 대신 [리프트](/Hongs_Blog/studies/data-science/lift/)와 [널 불변 측정](/Hongs_Blog/studies/data-science/null-invariant-measures/)으로 흥미로운 것만 고른다[^s1].

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/03.3-1_FP.pdf, p.35 (Discussion: Apriori vs FP-Growth)
[^2]: 같은 자료, p.39 (Summary: FP Mining Methods)
[^s1]: 에이전트 보충. 상황 문제 C1~C4는 원본에 없다.
{% endraw %}
