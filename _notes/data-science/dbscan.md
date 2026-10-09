---
layout: "note"
title: "DBSCAN"
display_title: "DBSCAN"
kind: "concept"
kind_label: "알고리즘"
num: "31"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["DBSCAN", "Density-Based Spatial Clustering of Applications with Noise", "밀도 기반 군집화", "Density-based Clustering", "Eps", "MinPts", "핵심점", "Core Point", "경계점", "Border Point", "잡음점", "Noise Point", "직접 밀도 도달", "Directly Density-reachable", "밀도 도달", "Density-reachable", "밀도 연결", "Density-connected"]
description: "점들이 빽빽하게 이어진 곳을 하나의 무리로 본다. 반지름 안에 이웃이 충분히 많은 점을 중심점으로 삼고, 중심점끼리 이웃을 타고 퍼져 나가며 닿는 점들을 한 무리로 묶는다. 어디에도 닿지 않는 외딴 점은 잡음으로 남긴다. 무리 수를 정할 필요가 없고 고리나 나선 같은 모양도 찾지만…"
prev_url: "/studies/data-science/em-algorithm/"
prev_title: "EM 알고리즘"
next_url: "/studies/data-science/clique/"
next_title: "CLIQUE"
math: true
mermaid: false
code_count: 2
permalink: "/studies/data-science/dbscan/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

점들이 빽빽하게 이어진 곳을 하나의 무리로 본다. 반지름 안에 이웃이 충분히 많은 점을 중심점으로 삼고, 중심점끼리 이웃을 타고 퍼져 나가며 닿는 점들을 한 무리로 묶는다. 어디에도 닿지 않는 외딴 점은 잡음으로 남긴다. 무리 수를 정할 필요가 없고 고리나 나선 같은 모양도 찾지만, 반지름과 이웃 수를 잘 골라야 하고 빽빽함이 무리마다 크게 다르면 잘 못 나눈다.

</div>


## 예시로 보기

[k-평균](/Hongs_Blog/studies/data-science/k-means/)과 [GMM](/Hongs_Blog/studies/data-science/gaussian-mixture-model/)은 무리 수를 정해야 하고, 둥근 모양이나 종 모양을 가정하며, 이상치에 흔들리고, 고리처럼 생긴 무리를 찾지 못한다[^1]. 고리 하나 안에 덩어리 하나가 있는 자료를 k-평균($$k = 2$$)에 넣으면 고리를 반으로 자른다. DBSCAN은 고리와 덩어리를 따로 묶는다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/data-science/31_dbscan_fig1.svg" alt="그림" loading="lazy">

고리 점 40개와 가운데 덩어리 15개에, 고리 바깥에 살짝 붙은 점 2개와 멀리 떨어진 점 3개를 더했다. k-평균은 고리와 덩어리를 섞어 둘로 자른다. DBSCAN(Eps 1, MinPts 3)은 고리와 덩어리를 따로 묶고, 붙은 점 2개는 경계점, 먼 점 3개는 잡음으로 남긴다[^s2].

1차원 점 1, 2, 3, 4, 10, 11, 12, 20을 반지름 Eps = 1, 최소 이웃 수 MinPts = 3(자기 자신 포함)으로 묶는다[^s1].

| 점 | 반지름 1 안의 점 | 개수 | 종류 |
|---|---|---|---|
| 1 | 1, 2 | 2 | 경계점(핵심점 2의 이웃) |
| 2 | 1, 2, 3 | 3 | 핵심점 |
| 3 | 2, 3, 4 | 3 | 핵심점 |
| 4 | 3, 4 | 2 | 경계점 |
| 10 | 10, 11 | 2 | 경계점 |
| 11 | 10, 11, 12 | 3 | 핵심점 |
| 12 | 11, 12 | 2 | 경계점 |
| 20 | 20 | 1 | 잡음 |

핵심점 2와 3은 서로 반지름 안이라 이어진다. 결과는 무리 {1, 2, 3, 4}, {10, 11, 12}와 잡음 20이다. 무리 수 2는 알고리즘이 스스로 찾았다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 무작위 자료 200개에서 "핵심점 그래프의 연결 요소 + 그 이웃 경계점"이라는 정의와 같음, 고리 + 덩어리 예 — [31_dbscan_impl.py](/Hongs_Blog/studies/data-science/code/31_dbscan_impl/)</div>

</div>


## 정의

**DBSCAN**(잡음이 있는 자료의 밀도 기반 공간 군집화)은 밀도로 이어진 점들을 한 군집으로 본다[^2]. 매개변수는 둘이다[^3].

- **Eps:** 이웃으로 볼 최대 반지름. 두 점의 거리가 Eps 이하면 이웃이다.
- **MinPts:** Eps 안에 있어야 할 최소 점 수. 이웃이 MinPts 이상이면 핵심점이다.

점의 관계는 셋이다[^4].

- **직접 밀도 도달:** $$p$$가 $$q$$의 반지름 안에 있고 $$q$$가 핵심점이면, $$p$$는 $$q$$에서 직접 밀도 도달 가능하다. 비대칭이다.
- **밀도 도달:** $$q = p_1 \to p_2 \to \cdots \to p_n = p$$처럼 직접 밀도 도달이 사슬로 이어지면 $$p$$는 $$q$$에서 밀도 도달 가능하다.
- **밀도 연결:** 어떤 점 $$o$$에서 $$p$$와 $$q$$가 모두 밀도 도달 가능하면 둘은 밀도 연결이다. 대칭이다.

점의 종류는 셋이다[^5]. **핵심점**은 이웃이 충분한 점, **경계점**은 군집에 속하지만 이웃이 부족한 점, **잡음점**은 어느 군집에도 속하지 않는 점이다. DBSCAN의 군집은 밀도 연결된 점들의 가장 큰 모임이다[^5].

예에서 경계점 1은 핵심점 2에서 밀도 도달 가능하지만, 2는 1에서 밀도 도달 가능하지 않다. 1이 핵심점이 아니라 출발점이 될 수 없기 때문이다. 슬라이드 그림의 $$p$$와 $$q$$도 같다[^5].

### 의사코드

```
모든 점을 "방문 안 함"으로 둔다
방문 안 한 점 o가 남아 있는 동안:
    o를 방문함으로 표시한다
    o가 핵심점이면:
        o에서 밀도 도달 가능한 점을 모두 모아(이웃의 이웃으로 퍼져 나가며) 새 군집 C로 만든다
        C의 점을 모두 방문함으로 표시한다
    아니면:
        o를 일단 잡음으로 표시한다 (나중에 경계점이 될 수 있다)
군집들을 돌려준다. 어느 군집에도 들지 않은 점은 잡음이다
```

퍼져 나가는 부분은 핵심점에서 시작하는 [그래프 탐색](/Hongs_Blog/studies/algorithms/dfs/)이다[^6].

### 복잡도

점 $$n$$개, 차원 $$d$$에서 모든 점 쌍의 거리를 재면 $$O(n^2 d)$$다[^6]. 공간 색인(k-d 트리 등)을 쓰면 낮은 차원에서는 더 빨라진다[^s1].

## 활용

- 구현: [31_dbscan_impl.py](/Hongs_Blog/studies/data-science/code/31_dbscan_impl/)
- **장점**[^2]: 군집 수를 정하지 않는다. 모양이 제멋대로인 군집을 찾는다. 잡음과 이상치에 견고하다.
- 지도 위의 GPS 점에서 자주 머무는 장소 찾기처럼, 무리 수를 모르고 모양이 불규칙한 공간 자료에 쓴다[^s1].
- 흔한 실수: 군집마다 빽빽함이 크게 다른 자료에 Eps 하나를 쓰는 것. 성긴 군집이 잡음이 되거나 빽빽한 군집들이 하나로 붙는다.

## 연결

- 선수: [군집 분석](/Hongs_Blog/studies/data-science/cluster-analysis/), [민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/)(Eps를 재는 거리)
- 핵심점끼리 "Eps 안이면 잇는" 관계로 연결 요소를 나누면 군집이 된다: [동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)
- 고차원과 계산량 문제를 격자로 푸는 방법: [CLIQUE](/Hongs_Blog/studies/data-science/clique/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 핵심점, 경계점, 잡음점을 Eps와 MinPts로 정의하라.</summary>

**답:** 핵심점은 Eps 안의 점이 MinPts 이상인 점. 경계점은 핵심점은 아니지만 어떤 핵심점의 Eps 안에 있는 점. 잡음점은 둘 다 아닌 점.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 1차원 점 1, 2, 3, 7, 8, 9, 10, 15에 Eps = 1, MinPts = 3(자기 포함)으로 DBSCAN을 돌려라. 점마다 종류와 군집을 쓰라.</summary>

**답:** 핵심점: 2(1, 2, 3), 8(7, 8, 9), 9(8, 9, 10). 경계점: 1, 3, 7, 10. 잡음: 15. 군집 {1, 2, 3}, {7, 8, 9, 10}[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 밀도 도달은 대칭이 아닌데 밀도 연결은 대칭인 이유를 설명하라.</summary>

**답:** 밀도 도달의 사슬은 핵심점에서만 출발할 수 있다. 경계점 $$p$$는 핵심점 $$q$$에서 도달되지만 $$p$$가 핵심점이 아니라 $$p$$에서 출발하는 사슬이 없다. 밀도 연결은 "어떤 $$o$$에서 둘 다 도달된다"는 정의라 $$p$$와 $$q$$를 바꿔도 같은 $$o$$가 그대로 쓰인다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 의사코드에서 핵심점이 아닌 점을 "일단 잡음"으로 표시하는 이유를 한 문장으로 쓰라.</summary>

**답:** 그 점이 나중에 다른 핵심점의 이웃으로 밝혀지면 경계점으로 군집에 들어가야 하므로, 확정하지 않고 임시로 잡음 표시만 해 둔다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/07.7-2_density-clustering.pdf, p.8
[^2]: 같은 자료, p.9
[^3]: 같은 자료, p.10. 슬라이드는 이웃이 MinPts보다 "많으면(higher)" 핵심점이라 적는다. 보통의 정의(Ester et al., KDD 1996)와 이 문서는 "MinPts 이상"이다
[^4]: 같은 자료, p.11
[^5]: 같은 자료, p.12
[^6]: 같은 자료, p.13
[^s1]: 에이전트 보충. 1차원 예, 고리 예, 공간 색인, 쓰임 예, 흔한 실수, 카드 C2는 원본에 없다. 구현 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 1장은 원본에 없다. [31_dbscan_plot.py](/Hongs_Blog/studies/data-science/code/31_dbscan_plot/)로 그렸고, 고리와 덩어리가 서로 다른 군집이 되는 것, 붙은 점 2개가 핵심점이 아닌 경계점이고 먼 점 3개가 잡음인 것, k-평균($$k = 2$$, 열 번 다시 시작)이 고리와 덩어리를 가르지 못하는 것을 같은 코드로 확인했다.
{% endraw %}
