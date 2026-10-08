---
layout: "note"
title: "군집화 알고리즘 비교"
display_title: "군집화 알고리즘 비교"
kind: "concept"
kind_label: "비교"
num: "33"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["K-means vs GMM vs DBSCAN vs CLIQUE", "군집화 방법 비교"]
description: "네 방법은 \"무엇을 비슷하다고 보는가\"가 다르다. k-평균은 중심까지의 거리, GMM은 종 모양 분포에서 나왔을 확률, DBSCAN은 점들이 빽빽하게 이어졌는지, CLIQUE는 격자 칸에 점이 많이 들었는지를 본다. 고르는 질문은 셋이다. 무리 수를 아는가? 무리 모양을 가정할 수…"
prev_url: "/studies/data-science/clique/"
prev_title: "CLIQUE"
next_url: "/studies/data-science/curse-of-dimensionality/"
next_title: "차원의 저주"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-science/contrast--clustering-algorithms/"
---
{% raw %}
네 방법은 "무엇을 비슷하다고 보는가"가 다르다. k-평균은 중심까지의 거리, GMM은 종 모양 분포에서 나왔을 확률, DBSCAN은 점들이 빽빽하게 이어졌는지, CLIQUE는 격자 칸에 점이 많이 들었는지를 본다. 고르는 질문은 셋이다. 무리 수를 아는가? 무리 모양을 가정할 수 있는가? 잡음과 차원이 많은가?

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 무리 수 5를 알고, 무리는 대체로 둥글며, 자료가 수백만 개다. (b) 무리 수를 모르고, 지도 위 GPS 점들이 길을 따라 길쭉하고 구불구불하게 모이며, 외딴 점이 섞였다. 어느 방법인가?</summary>

**답:** (a) k-평균. 둥근 군집과 알려진 $$k$$에 맞고 빠르다. (b) DBSCAN. $$k$$가 필요 없고 모양에 가정이 없으며 잡음을 따로 남긴다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) 무리 둘이 서로 겹쳐, 경계의 점마다 "어느 쪽일 확률"을 알고 싶다. (d) 속성이 50개인데, 무리마다 쓸모 있는 속성이 몇 개뿐이고 서로 다르다. 어느 방법인가?</summary>

**답:** (c) GMM. 부드러운 배정으로 점마다 군집별 확률을 주고, 타원 모양 군집도 표현한다. (d) CLIQUE. 무리마다 다른 부분공간을 찾고 쓸모없는 차원을 스스로 걸러 낸다.

</details>


## 결정적 차이

| | 모양 가정 | $$k$$ 필요 | 고차원 | 잡음에 견고 | 배정 |
|---|---|---|---|---|---|
| k-평균 | 둥근 모양 | 필요 | 약함 | 약함 | 하드 |
| k-메도이드 | 거리에 따름 | 필요 | 약함 | 더 견고 | 하드 |
| GMM | 가우스(타원) | 필요 | 약함 | 보통 | 부드러움(확률) |
| DBSCAN | 제멋대로 | 필요 없음 | 약함 | 견고 | 하드 + 잡음 |
| CLIQUE | 제멋대로(부분공간) | 필요 없음 | 강함(보통) | 견고 | 하드 + 잡음 |

표는 두 슬라이드의 비교표를 합친 것이다[^1][^2]. 선택을 가르는 열은 "$$k$$ 필요"와 "모양 가정"이다. 무리 수와 모양을 안다면 k-평균이나 GMM이 빠르고 해석하기 쉽다. 모르면 밀도 기반이 낫다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 고리 + 덩어리 자료에서 DBSCAN은 나누고 k-평균은 못 나눔, 부분공간 군집 예 — [31_dbscan_impl.py](/Hongs_Blog/studies/data-science/code/31_dbscan_impl/), [32_clique_impl.py](/Hongs_Blog/studies/data-science/code/32_clique_impl/)</div>

</div>


## 모두 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 네 방법 모두 잘 맞지 않는 상황과 선택지를 쓰라.</summary>

**답:** ① 자료가 점의 좌표보다 "누가 누구와 연결되었나"(친구 관계, 링크)로 주어질 때 → 그래프 군집화(10회). ② 차원이 아주 많고 군집이 축에 비스듬한 부분공간에 있을 때 → 주성분 분석이나 행렬 분해로 차원을 줄인 뒤 군집화(10회)[^s1].

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/07.7-1_basic-clustering.pdf, p.32
[^2]: 3-2학기/데이터 과학/1.수업자료/07.7-2_density-clustering.pdf, p.19
[^s1]: 에이전트 보충. 상황 문제와 10회로 넘기는 답은 원본에 없다. 10회 슬라이드(고차원 군집화, 그래프 군집화)의 주제다.
{% endraw %}
