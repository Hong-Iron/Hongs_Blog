---
layout: "note"
title: "군집 분석"
display_title: "군집 분석 (Cluster Analysis)"
kind: "concept"
kind_label: "정의"
num: "24"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Cluster Analysis", "군집화", "Clustering", "군집", "Cluster", "비지도 학습", "Unsupervised Learning", "군집 내 유사도", "Intra-cluster Similarity", "군집 간 유사도", "Inter-cluster Similarity"]
description: "정답 표시가 없는 자료를 비슷한 것끼리 몇 무리로 나누는 일이다. 좋은 무리는 안쪽끼리는 서로 닮고, 다른 무리와는 확실히 다르다. 고객을 취향별로 나누거나, 사진의 색을 몇 가지로 줄이는 데 쓴다. 다만 정답이 없어 \"잘 나눴다\"를 재는 기준부터 정해야 하고, 그 기준(거리, 확…"
prev_url: "/studies/data-science/contrast--bagging-boosting/"
prev_title: "배깅과 부스팅 비교"
next_url: "/studies/data-science/k-means/"
next_title: "k-평균"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-science/cluster-analysis/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

정답 표시가 없는 자료를 비슷한 것끼리 몇 무리로 나누는 일이다. 좋은 무리는 안쪽끼리는 서로 닮고, 다른 무리와는 확실히 다르다. 고객을 취향별로 나누거나, 사진의 색을 몇 가지로 줄이는 데 쓴다. 다만 정답이 없어 "잘 나눴다"를 재는 기준부터 정해야 하고, 그 기준(거리, 확률, 밀도, 연결)에 따라 같은 자료도 다르게 나뉜다.

</div>


## 예시로 보기

분류는 "이 사진은 고양이"처럼 정답을 보고 배운다. 그런데 정답 없이 고객 수만 명의 구매 기록만 있다면, 비슷한 고객끼리 묶는 것부터 해야 한다[^1]. 정답이 없으니 오답률도 계산할 수 없다. 그래서 군집화는 어렵고 주관적이다[^1].

쓰임 두 가지[^2][^3].

- **자료 요약:** 숫자 손글씨 사진들을 군집화하면 군집 중심이 "평균적인 0, 1, 2…"의 모습이 된다. 중심은 실제 사진이 아니지만 그 무리를 잘 대표한다.
- **색 줄이기:** 사진의 각 화소는 (R, G, B) 세 값이다. 화소들을 $$k$$개 군집으로 묶고 각 화소를 자기 군집의 중심 색으로 바꾸면, 사진에 쓰인 색이 $$k$$가지로 준다. 압축이자 영상 분할이다.

## 정의

**군집**은 같은 군집 안에서는 서로 비슷하고 다른 군집의 점들과는 다른 자료점의 모임이다[^1].

**군집 분석**은 자료점 $$\{\mathbf x_i\}_{i=1}^{n}$$, $$\mathbf x_i \in \mathbb{R}^d$$($$d$$는 자료의 차원)를 $$k$$개 무리로 나누는 일이다. 출력은 군집 중심과 각 점의 소속이다. 미리 정한 정답 표시가 없는 비지도 학습이다[^1].

좋은 군집화는[^4]

- **군집 내 유사도가 높다:** 군집 안쪽이 촘촘하다.
- **군집 간 유사도가 낮다:** 군집끼리 뚜렷이 다르다.

"얼마나 비슷해야 충분히 비슷한가"는 주관적이고, 응용마다 알맞은 유사도가 다르다. 그래서 군집화 방법은 기준에 따라 거리 기반, 확률 기반, 밀도 기반, 연결 기반으로 나뉜다[^4].

| 기준 | 이 과목의 방법 |
|---|---|
| 거리 | [k-평균](/Hongs_Blog/studies/data-science/k-means/), [k-메도이드](/Hongs_Blog/studies/data-science/k-medoids/) |
| 확률 | [가우스 혼합 모델](/Hongs_Blog/studies/data-science/gaussian-mixture-model/) |
| 밀도 | [DBSCAN](/Hongs_Blog/studies/data-science/dbscan/), [CLIQUE](/Hongs_Blog/studies/data-science/clique/) |

## 연결

- 선수: [민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/)(비슷함을 재는 법)
- 이상치 찾기: [데이터 정제](/Hongs_Blog/studies/data-science/data-cleaning/)의 이상치 분석은 어느 군집에도 들지 않는 값을 잡음으로 본다.
- 방법 비교: [군집화 알고리즘 비교](/Hongs_Blog/studies/data-science/contrast--clustering-algorithms/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 군집 분석의 입력과 출력을 쓰고, 좋은 군집화의 두 조건을 쓰라.</summary>

**답:** 입력은 정답 없는 자료점 $$n$$개($$d$$차원 벡터), 출력은 군집 중심과 각 점의 소속이다. 군집 안쪽 유사도는 높고, 군집 사이 유사도는 낮아야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 중 군집 분석으로 풀 일과 분류로 풀 일을 가르라. ① 스팸/정상 표시가 붙은 메일로 새 메일을 판정 ② 표시 없는 뉴스 기사 수만 건을 주제별로 묶기 ③ 사진의 색을 16가지로 줄이기</summary>

**답:** ① 분류(정답 표시로 배운다). ② 군집 분석. ③ 군집 분석(화소 색을 16개 군집으로 묶고 중심 색으로 바꾼다).

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/07.7-1_basic-clustering.pdf, p.3
[^2]: 같은 자료, p.5
[^3]: 같은 자료, p.6
[^4]: 같은 자료, p.4
{% endraw %}
