---
layout: "note"
title: "군집 수 고르기"
display_title: "군집 수 고르기 (Choosing the Number of Clusters)"
kind: "concept"
kind_label: "기법"
num: "28"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
updated: "2026-10-09"
status: "verified"
aliases: ["Choosing the Number of Clusters", "엘보 방법", "Elbow Method", "실루엣 점수", "Silhouette Score", "실루엣 계수", "Silhouette Coefficient", "응집도", "Cohesion", "분리도", "Separation"]
description: "k-평균은 무리 수를 미리 알려 줘야 한다. 무리를 늘리면 점들이 중심에 가까워져 오차가 늘 줄기 때문에, 오차만 보고 고르면 \"모든 점이 자기 혼자 무리\"가 정답이 된다. 엘보 방법은 무리를 하나 늘려도 오차가 별로 줄지 않기 시작하는 꺾이는 곳을 고르고, 실루엣 점수는 점마다 …"
prev_url: "/studies/data-science/contrast--kmeans-kmedoids/"
prev_title: "k-평균과 k-메도이드 비교"
next_url: "/studies/data-science/gaussian-mixture-model/"
next_title: "가우스 혼합 모델"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-science/choosing-k/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

k-평균은 무리 수를 미리 알려 줘야 한다. 무리를 늘리면 점들이 중심에 가까워져 오차가 늘 줄기 때문에, 오차만 보고 고르면 "모든 점이 자기 혼자 무리"가 정답이 된다. 엘보 방법은 무리를 하나 늘려도 오차가 별로 줄지 않기 시작하는 꺾이는 곳을 고르고, 실루엣 점수는 점마다 "자기 무리에 얼마나 붙어 있고 다른 무리와 얼마나 떨어져 있는지"를 재서 가장 높은 곳을 고른다. 엘보는 꺾이는 곳이 뚜렷하지 않을 때가 있고, 실루엣은 모든 점 쌍의 거리를 재야 해 비싸다.

</div>


## 예시로 보기

1차원 점 1, 2, 3 / 10, 11, 12 / 20, 21, 22는 눈으로 봐도 세 무리다. $$k$$마다 가장 좋은 k-평균 답의 오차 $$J$$와 평균 실루엣을 계산했다[^s1].

| $$k$$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $$J$$ | 548 | 127.5 | 6 | 4.5 | 3 |
| 줄어든 양 | | 420.5 | 121.5 | 1.5 | 1.5 |
| 평균 실루엣 | | 0.665 | **0.854** | 0.620 | 0.392 |

$$J$$는 $$k$$를 늘릴수록 계속 줄지만, $$k = 3$$ 다음부터 거의 줄지 않는다. 그래프의 팔꿈치(엘보)가 $$k = 3$$이다. 실루엣도 $$k = 3$$에서 가장 높다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 위 표, 엘보와 실루엣 모두 $$k = 3$$, 카드 C2, 잘못 넣은 점의 $$s < 0$$, 모든 2분할에서 $$-1 \le s \le 1$$ — [28_choosing-k_verify.py](/Hongs_Blog/studies/data-science/code/28_choosing-k_verify/)</div>

</div>


## 정의

**엘보 방법**은 $$k$$를 늘려 가며 군집화를 되풀이하고 목적 함수 값을 그려, 감소가 크게 느려지는 "팔꿈치"를 고른다. 팔꿈치에서 목적 함수는 최소가 아니지만 충분히 작고 쓸모 있다[^1]. 그 앞까지는 의미 있는 구조를 찾아 크게 줄고, 그 뒤는 조금씩만 준다.

**실루엣 점수**는 좋은 군집이 안쪽은 촘촘하고 서로 떨어져 있다는 생각을 점마다 잰다[^2]. 점 $$\mathbf x_i$$가 군집 $$C_i$$에 속할 때

- $$a(i) = \frac{1}{\vert C_i\vert  - 1}\sum_{\mathbf x_j \in C_i, j \ne i} d(\mathbf x_i, \mathbf x_j)$$: 같은 군집 다른 점들까지의 평균 거리(응집도). **작을수록** 촘촘하다.
- $$b(i) = \min_{k \ne i}\frac{1}{\vert C_k\vert }\sum_{\mathbf x_j \in C_k} d(\mathbf x_i, \mathbf x_j)$$: 가장 가까운 다른 군집 점들까지의 평균 거리(분리도). **클수록** 떨어져 있다.

$$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}, \qquad S = \frac1n\sum_{i=1}^{n} s(i)$$


$$s(i)$$는 $$-1$$에서 1 사이다. 1에 가까우면 잘 묶였고, 0에 가까우면 두 군집의 경계에 있고, 음수면 다른 군집에 더 가까워 잘못 묶였을 가능성이 크다. $$k$$를 바꿔 가며 평균 $$S$$가 가장 높은 $$k$$를 고른다[^2].

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 7-1 슬라이드 p.19 "s(i) < 1: possibly misclassified", 그리고 $$a(i)$$ 옆 "the higher score, the more cohesive", $$b(i)$$ 옆 "the lower score, the more separated" / 문제점: $$s(i)$$는 늘 1 이하라 "< 1"은 거의 모든 점이다. 잘못 묶인 점은 $$b < a$$인 점, 즉 $$s(i) < 0$$이다. 또 $$a$$와 $$b$$는 유사도가 아니라 평균 거리라서 $$a$$는 낮을수록 촘촘하고 $$b$$는 높을수록 떨어져 있다 / 수정안: "s(i) < 0: possibly misclassified", "$$a$$: 낮을수록 응집", "$$b$$: 높을수록 분리" / 근거: 점 0, 1, 5, 6에서 1을 {5, 6}에 잘못 넣으면 $$a = 4.5$$, $$b = 1$$, $$s = -0.778$$ — 28_choosing-k_verify.py

</div>


| | 엘보 | 실루엣 |
|---|---|---|
| 생각 | 목적 함수의 개선이 느려지는 $$k$$ | 응집과 분리를 함께 최대화하는 $$k$$ |
| 쓰는 값 | 군집 안 거리(목적 함수) | 응집 대 분리의 균형 |
| 고르는 기준 | 그래프의 팔꿈치 | 평균 실루엣이 가장 높은 $$k$$ |
| 해석 | 팔꿈치가 늘 뚜렷하지는 않다 | $$-1 \sim 1$$의 수로 분명하다 |
| 계산 | 비교적 싸다 | 비싸다(모든 점 쌍의 거리) |

표는 슬라이드 p.20을 옮긴 것이다[^3].

## 연결

- 선수: [k-평균](/Hongs_Blog/studies/data-science/k-means/)(목적 함수 $$J$$)
- $$k$$를 아예 정하지 않는 방법: [DBSCAN](/Hongs_Blog/studies/data-science/dbscan/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 실루엣 점수 $$s(i)$$의 식과 $$a(i)$$, $$b(i)$$의 뜻을 쓰고, $$s(i)$$가 1, 0, 음수일 때를 해석하라.</summary>

**답:** $$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$. $$a$$는 같은 군집 다른 점까지 평균 거리, $$b$$는 가장 가까운 다른 군집 점들까지 평균 거리. 1 근처면 잘 묶임, 0 근처면 경계, 음수면 다른 군집에 더 가까워 잘못 묶였을 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 군집 A = {0, 1}, B = {5, 6}(1차원)에서 점 1의 실루엣 점수를 구하라.</summary>

**답:** $$a = \vert 1 - 0\vert  = 1$$, $$b = \frac{\vert 1 - 5\vert  + \vert 1 - 6\vert }{2} = 4.5$$. $$s = \frac{4.5 - 1}{4.5} \approx 0.778$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** k-평균의 목적 함수 $$J$$가 가장 작은 $$k$$를 고르면 안 되는 이유와, 엘보 방법이 그 문제를 피하는 방식을 설명하라.</summary>

**답:** $$J$$는 $$k$$를 늘릴수록 늘 줄고 $$k = n$$이면 0이라, 최솟값은 아무 구조도 없는 답이다. 엘보 방법은 $$J$$의 크기가 아니라 줄어드는 양을 보고, 구조를 찾는 동안의 큰 감소가 끝나고 작은 감소만 남는 지점을 고른다.

</details>


[^1]: 3-2학기/데이터 과학/1.수업자료/07.7-1_basic-clustering.pdf, p.17~18
[^2]: 같은 자료, p.19
[^3]: 같은 자료, p.20
[^s1]: 에이전트 보충. 1차원 예와 표, 카드 C2·C3은 원본에 없다. 검증 코드로 계산했다(가장 좋은 k-평균 답은 모든 나눔을 시험해 찾았다).
{% endraw %}
