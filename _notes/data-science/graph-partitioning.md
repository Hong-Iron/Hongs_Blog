---
layout: "note"
title: "그래프 분할과 정규화 컷"
display_title: "그래프 분할과 정규화 컷 (Graph Partitioning and Normalized Cut)"
kind: "concept"
kind_label: "정의"
num: "37"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Graph Partitioning", "그래프 군집화", "Graph Clustering", "유사도 그래프", "Similarity Graph", "가우스 커널", "Gaussian Kernel", "ε-이웃 그래프", "ε-neighborhood Graph", "k-최근접 이웃 그래프", "k-NN Graph", "컷", "Cut", "정규화 컷", "Normalized Cut", "NCut", "부피", "Volume"]
description: "친구 관계, 도로망, 웹 링크처럼 자료가 \"누가 누구와 이어졌나\"로 주어지면 점의 좌표가 없어 k-평균을 쓸 수 없다. 이때 군집화는 그래프를 몇 조각으로 자르는 일이 된다. 조각 안은 촘촘히 이어지고 조각 사이를 잇는 선은 적게 자르고 싶다. 그런데 잘리는 선만 줄이려 하면 외딴…"
prev_url: "/studies/data-science/contrast--pca-nmf/"
prev_title: "PCA와 NMF 비교"
next_url: "/studies/data-science/spectral-clustering/"
next_title: "스펙트럼 군집화"
math: true
mermaid: false
code_count: 0
permalink: "/studies/data-science/graph-partitioning/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

친구 관계, 도로망, 웹 링크처럼 자료가 "누가 누구와 이어졌나"로 주어지면 점의 좌표가 없어 k-평균을 쓸 수 없다. 이때 군집화는 그래프를 몇 조각으로 자르는 일이 된다. 조각 안은 촘촘히 이어지고 조각 사이를 잇는 선은 적게 자르고 싶다. 그런데 잘리는 선만 줄이려 하면 외딴 점 하나만 떼어 내는 쓸모없는 답이 나오므로, 조각의 크기로 나눠 균형을 맞춘 정규화 컷을 쓴다. 정규화 컷을 정확히 최소화하는 것은 계산이 매우 어렵다(NP-hard).

</div>


## 예시로 보기

소셜 네트워크, 도로망, 신경망, 바이러스 전파, 웹, 단백질 상호작용처럼 현실 자료는 그래프로 주어지는 경우가 많다. k-평균과 GMM은 점마다 벡터가 있어야 한다[^1]. 또 고리처럼 휜 군집은 이어진 정도로 묶는 편이 낫다. DBSCAN도 이어짐을 보지만 Eps와 MinPts에 민감하다[^2].

삼각형 두 개(꼭짓점 0, 1, 2와 3, 4, 5)를 선 하나(2–3)로 이은 그래프를 자른다. 모든 선의 무게는 1이다[^s1].

| 나눔 | 잘리는 선의 무게 합 (컷) | 정규화 컷 |
|---|---|---|
| {0, 1, 2} / {3, 4, 5} | 1 | $$\frac17 + \frac17 \approx 0.29$$ |
| {0} / 나머지 | 2 | $$\frac22 + \frac{2}{12} \approx 1.17$$ |

두 삼각형으로 자르는 것이 답이다. 그런데 큰 덩어리 끝에 무게 0.5인 선으로 꼭짓점 하나가 매달려 있으면, 컷만 최소화하는 답은 그 꼭짓점 하나만 떼어 낸다(컷 0.5). 정규화 컷은 그런 작은 조각에 벌을 줘서 두 큰 덩어리로 나눈다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 삼각형의 컷 1과 정규화 컷 2/7, 매달린 꼭짓점 예에서 컷 최소와 정규화 컷 최소가 다름(모든 나눔 시험) — [38_spectral-clustering_impl.py](/Hongs_Blog/studies/data-science/code/38_spectral-clustering_impl/)</div>

</div>


## 정의

**유사도 그래프 만들기.** 자료 $$X$$를 그래프 $$W$$로 바꾼다. $$W_{ij}$$는 점 $$i$$와 $$j$$의 유사도다[^3].

1. 쌍마다 유사도를 정한다. 예: 방향이 비슷한지 보는 코사인 유사도 $$w_{ij} = \frac{\mathbf x_i^\top\mathbf x_j}{\Vert \mathbf x_i\Vert \Vert \mathbf x_j\Vert }$$, 거리가 가까운지 보는 가우스 커널 $$w_{ij} = \exp\left(-\frac{\Vert \mathbf x_i - \mathbf x_j\Vert ^2}{2\sigma^2}\right)$$($$\sigma$$는 "가깝다"의 기준 거리).
2. 점마다 이웃을 골라 잇는다.
    - **ε-이웃 그래프:** 유사도가 기준 $$\epsilon$$보다 크면 이웃으로 잇는다.
    - **k-최근접 이웃 그래프:** 점마다 가장 비슷한 $$k$$개와 잇는다.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 10-2 슬라이드 p.11의 식 "$$w_{ij}$$ = similarity if $$w_{ij} < \epsilon$$, 0 otherwise" / 문제점: 바로 위 설명은 "유사도가 기준보다 크면 이웃"이다. 유사도가 작을 때 잇는 식은 설명과 반대다. 거리로 쓸 때만 "작으면 이웃"이다 / 수정안: "$$w_{ij}$$ = similarity if $$w_{ij} \ge \epsilon$$, 0 otherwise"(또는 "거리 $$< \epsilon$$이면") / 근거: 같은 슬라이드의 설명 문장

</div>


**그래프 분할.** 그래프를 겹치지 않는 부분 그래프들로 나눈다. 군집 안의 연결은 최대로, 군집 사이의 연결은 최소로 한다[^4].

**2-분할과 컷.** 유사도 행렬 $$W$$를 가진 그래프 $$G = (V, E)$$에서 꼭짓점 집합 $$V$$를 겹치지 않는 두 집합 $$A$$, $$B$$로 나눈다. **컷**은 두 집합을 가로지르는 선의 무게 합이다[^5].

$$\operatorname{cut}(A, B) = \sum_{i \in A, j \in B} w_{ij}$$


이 값만 최소화하면 답이 뻔해진다(한쪽을 비우거나, 연결이 약한 점 하나만 떼어 낸다)[^5].

**정규화 컷.** 작은 조각에 벌을 줘서 크기를 맞춘다[^6].

$$\operatorname{NCut}(A, B) = \frac{\operatorname{cut}(A, B)}{\operatorname{vol}(A)} + \frac{\operatorname{cut}(A, B)}{\operatorname{vol}(B)}, \qquad \operatorname{vol}(A) = \sum_{i \in A} d_i$$


$$d_i$$는 꼭짓점 $$i$$의 차수(이어진 선의 무게 합)다. 조각이 작으면 부피가 작아 분수가 커진다. 꼭짓점이 $$n$$개면 나누는 방법이 $$2^{n-1}$$가지이고, 이 이산 최적화는 NP-hard다. 그래서 [스펙트럼 완화](/Hongs_Blog/studies/data-science/spectral-clustering/)로 근사한다[^6].

## 연결

- 선수: [군집 분석](/Hongs_Blog/studies/data-science/cluster-analysis/), [그래프의 기초](/Hongs_Blog/studies/discrete-math/graph-basics/)(차수, 인접행렬), [코사인 유사도](/Hongs_Blog/studies/linear-algebra/dot-product/)
- 근사해: [스펙트럼 군집화](/Hongs_Blog/studies/data-science/spectral-clustering/)
- 지역 밀도로 이어짐을 보는 방법: [DBSCAN](/Hongs_Blog/studies/data-science/dbscan/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 컷과 정규화 컷의 식을 쓰고, 컷만 최소화하면 생기는 문제를 말하라.</summary>

**답:** $$\operatorname{cut}(A, B) = \sum_{i \in A, j \in B} w_{ij}$$, $$\operatorname{NCut} = \frac{\operatorname{cut}}{\operatorname{vol}(A)} + \frac{\operatorname{cut}}{\operatorname{vol}(B)}$$. 컷만 최소화하면 연결이 약한 점 하나만 떼어 내는 균형 없는 답이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 삼각형 두 개를 선 하나로 이은 그래프(무게 1)에서 두 삼각형으로 나눌 때의 컷과 정규화 컷을 구하라.</summary>

**답:** 잘리는 선은 다리 하나라 컷 1. 각 삼각형의 차수 합은 $$2 + 2 + 3 = 7$$이라 NCut $$= \frac17 + \frac17 = \frac27$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 가우스 커널 유사도와 코사인 유사도는 각각 무엇이 비슷할 때 크게 나오는가? 점 (1, 0)과 (10, 0)은 어느 쪽으로 비슷한가?</summary>

**답:** 가우스 커널은 거리가 가까울 때, 코사인은 방향이 같을 때 크다. (1, 0)과 (10, 0)은 방향이 같아 코사인 1이지만 거리가 9라 가우스 커널은 $$\sigma$$가 작으면 거의 0이다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/10.10-2_graph-clustering.pdf, p.9
[^2]: 같은 자료, p.10
[^3]: 같은 자료, p.11
[^4]: 같은 자료, p.12
[^5]: 같은 자료, p.13
[^6]: 같은 자료, p.14
[^s1]: 에이전트 보충. 두 삼각형 예, 매달린 꼭짓점 예, 카드 C2·C3은 원본에 없다. 구현 코드로 모든 나눔을 시험해 확인했다.
{% endraw %}
