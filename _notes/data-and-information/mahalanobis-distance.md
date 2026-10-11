---
layout: "note"
title: "마할라노비스 거리"
display_title: "마할라노비스 거리 (Mahalanobis Distance)"
kind: "concept"
kind_label: "정의"
num: "09"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
updated: "2026-10-11"
status: "verified"
aliases: ["Mahalanobis Distance", "마할라노비스", "분포를 반영한 거리", "통계적 거리"]
description: "자료가 퍼져 있는 모양을 자로 삼아 재는 거리다. 키가 10 cm 다른 것과 몸무게가 10 kg 다른 것을 같은 \"10\"으로 볼 수 없듯이, 자료가 원래 많이 흩어지는 방향으로 떨어진 것은 덜 멀다고 치고, 좀처럼 흩어지지 않는 방향으로 떨어진 것은 더 멀다고 친다. 그래서 단위가…"
prev_url: "/studies/data-and-information/distance-similarity/"
prev_title: "거리와 유사도"
next_url: "/studies/data-and-information/string-similarity/"
next_title: "문자열 유사도"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-and-information/mahalanobis-distance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

자료가 퍼져 있는 모양을 자로 삼아 재는 거리다. 키가 10 cm 다른 것과 몸무게가 10 kg 다른 것을 같은 "10"으로 볼 수 없듯이, 자료가 원래 많이 흩어지는 방향으로 떨어진 것은 덜 멀다고 치고, 좀처럼 흩어지지 않는 방향으로 떨어진 것은 더 멀다고 친다. 그래서 단위가 달라도, 두 값이 함께 움직여도 공평하게 잰다. 대신 자료의 퍼진 모양을 먼저 알아야 하고, 자료가 적거나 한 줄로 늘어서 있으면 그 모양을 믿을 수 없어 거리도 믿을 수 없다.

</div>


## 예시로 보기

자로 재는 거리(유클리드 거리)는 모든 방향을 똑같이 본다. 자료가 한 방향으로 길쭉하게 퍼져 있으면 이것이 이상한 답을 낸다.

슬라이드의 첫 그림에는 넓게 흩어진 무리 안의 두 점 A, B와 좁게 뭉친 무리 안의 두 점 C, D가 있다. 슬라이드는 거리가 자료의 퍼진 모양을 반영해야 하는지, $$d(A, B)$$와 $$d(C, D)$$ 중 어느 쪽이 작아야 하는지 묻는다[^1]. 좁게 뭉친 무리에서는 조금만 떨어져도 큰 차이다.

둘째 그림에는 오른쪽 위로 비스듬히 길게 퍼진 점들이 있고, 가운데(원점)에서 같은 거리에 두 점 A와 B가 있다. A는 점들이 길게 뻗은 방향에, B는 그 옆구리 방향에 있다[^1]. 자로 재면 둘은 원점에서 똑같이 멀다. 하지만 A 근처에는 다른 점이 많고 B 근처에는 없다. 길게 뻗은 방향으로는 멀리 떨어진 점이 흔하니 A는 "보통 있는 점"이고, B는 "튀는 점"이다. 그래서 A를 B보다 가깝다고 보는 것이 맞다[^1].

숫자로 본다. 자료의 가로 방향 분산이 4(표준편차 2), 세로 방향 분산이 1(표준편차 1)이고 두 방향이 따로 논다고 하자.

| 점 | 자로 잰 거리 | 그 방향의 표준편차 | 표준편차 몇 개만큼인가 |
|---|---|---|---|
| A = (2, 0) | 2 | 2 | 1 |
| B = (0, 2) | 2 | 1 | 2 |

A는 표준편차 한 개만큼, B는 두 개만큼 떨어져 있다. "표준편차 몇 개만큼인가"가 마할라노비스 거리다. 방향마다 흩어진 정도로 나눈 뒤 잰다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 공분산이 단위행렬이면 유클리드와 같음, 대각이면 표준편차로 나눈 유클리드, 예시의 1과 2, 기울어진 예의 0.471과 1.414, 거리의 네 조건(무작위 2,000회), 단위를 바꿔도 값이 그대로, 카드의 값 — [09_mahalanobis-distance_verify.py](/Hongs_Blog/studies/data-and-information/code/09_mahalanobis-distance_verify/)</div>

</div>


## 정의

숫자 $$k$$개로 적은 두 점 $$\mathbf x, \mathbf y \in \mathbb{R}^k$$와, 자료의 [공분산 행렬](/Hongs_Blog/studies/probability-statistics/multivariate-normal/) $$\Sigma$$(시그마, 방향마다 얼마나 흩어지고 서로 얼마나 함께 움직이는지를 적은 $$k \times k$$ 표)가 있다. $$\Sigma$$의 [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)이 있을 때, 마할라노비스 거리는 두 점의 차에 $$\Sigma^{-1}$$을 끼워 곱한 값의 제곱근이다[^2].

$$\mathrm{Maha}(\mathbf x, \mathbf y) = \sqrt{(\mathbf x - \mathbf y)^\top \Sigma^{-1} (\mathbf x - \mathbf y)}$$


슬라이드는 점을 가로로 적은 행벡터로 보아 $$\sqrt{(\mathbf x - \mathbf y)\Sigma^{-1}(\mathbf x - \mathbf y)^\top}$$로 쓴다. 같은 값이다[^2].

$$\Sigma^{-1}$$이 하는 일은 "흩어진 정도로 나누기"다. 세 경우로 나눠 보면 보인다[^s1].

| $$\Sigma$$의 모양 | 거리가 무엇이 되나 |
|---|---|
| 단위행렬 $$I$$ | $$\sqrt{\sum_i (x_i - y_i)^2}$$. 유클리드 거리 그대로다 |
| 대각 행렬(분산 $$\sigma_1^2, \dots, \sigma_k^2$$) | $$\sqrt{\sum_i \left(\frac{x_i - y_i}{\sigma_i}\right)^2}$$. 좌표마다 표준편차로 나눈 뒤의 유클리드 거리다 |
| 대각 밖에도 값이 있음 | 자료가 비스듬히 퍼진 축을 따라 나눈다. 아래 예제 |

**같은 거리의 점들.** 원점에서 유클리드 거리가 같은 점들은 원 위에 있다. 마할라노비스 거리가 같은 점들은 자료가 퍼진 모양을 따라 기운 타원 위에 있다. 슬라이드의 두 그림이 이것이다[^2].

$$\Sigma$$가 [양의 정부호](/Hongs_Blog/studies/linear-algebra/positive-definite/)이면 마할라노비스 거리는 [거리의 네 조건](/Hongs_Blog/studies/data-and-information/distance-similarity/)을 모두 지킨다. 좌표를 알맞게 늘이고 돌린 뒤의 유클리드 거리와 같기 때문이다[^s1].

## 예제

**비스듬히 퍼진 자료.** 공분산 행렬이 $$\Sigma = \begin{bmatrix} 5 & 4 \\ 4 & 5 \end{bmatrix}$$이다. 대각 밖의 4는 가로 값이 크면 세로 값도 크다는 뜻이다. 자료가 오른쪽 위 대각선을 따라 길게 퍼져 있다. 원점에서 $$A = (1, 1)$$과 $$B = (1, -1)$$까지 잰다[^s1].

1. *유클리드 거리:* 둘 다 $$\sqrt{1 + 1} \approx 1.414$$.
2. *역행렬:* $$\Sigma^{-1} = \frac{1}{5 \cdot 5 - 4 \cdot 4}\begin{bmatrix} 5 & -4 \\ -4 & 5 \end{bmatrix} = \frac19\begin{bmatrix} 5 & -4 \\ -4 & 5 \end{bmatrix}$$.
3. *A:* $$(1, 1)\,\Sigma^{-1}\,(1, 1)^\top = \frac19(5 - 4 - 4 + 5) = \frac29$$. 제곱근은 약 0.471.
4. *B:* $$(1, -1)\,\Sigma^{-1}\,(1, -1)^\top = \frac19(5 + 4 + 4 + 5) = 2$$. 제곱근은 약 1.414.
5. *읽기:* A는 자료가 길게 퍼진 대각선 방향이라 가깝고, B는 그 옆구리 방향이라 세 배 멀다.

대각선 방향의 분산은 9(표준편차 3), 옆구리 방향의 분산은 1(표준편차 1)이다. 두 점 모두 길이가 $$\sqrt2$$이니 $$\frac{\sqrt2}{3} \approx 0.471$$과 $$\frac{\sqrt2}{1} \approx 1.414$$가 되어 위 계산과 맞는다.

## 활용

- **튀는 값 찾기.** 자료의 평균에서 마할라노비스 거리가 큰 점을 이상치로 본다. 좌표 하나하나는 평범한데 조합이 이상한 점(키는 큰데 몸무게는 아주 가벼운 사람)을 잡아낸다[^s1].
- **단위에서 벗어나기.** 키를 m에서 cm로 바꾸면 유클리드 거리는 바뀌지만 마할라노비스 거리는 그대로다. 공분산이 같이 바뀌어 상쇄한다. 속성마다 따로 맞추는 [정규화](/Hongs_Blog/studies/data-science/normalization/)는 대각 행렬의 경우이고, 마할라노비스 거리는 속성끼리 함께 움직이는 것까지 걷어 낸다[^s1].
- **다변량 정규분포.** 밀도 식의 지수에 평균까지의 마할라노비스 거리의 제곱이 들어 있다. 거리가 같은 점은 밀도가 같다: [공분산 행렬과 다변량 정규분포](/Hongs_Blog/studies/probability-statistics/multivariate-normal/)
- 흔한 실수: 자료가 몇 개 없을 때 쓰는 것. 속성이 $$k$$개인데 자료가 $$k$$개 이하면 표본 공분산 행렬의 역행렬이 없다. 자료가 그보다 조금 많아도 역행렬이 크게 흔들린다[^s1].

## 연결

- 선수: [거리와 유사도](/Hongs_Blog/studies/data-and-information/distance-similarity/), [공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/)
- 퍼진 모양을 무시하는 거리: [민코프스키 거리](/Hongs_Blog/studies/data-science/minkowski-distance/)
- 식 속의 $$\mathbf v^\top A \mathbf v$$ 꼴: [양의 정부호 행렬과 이차형식](/Hongs_Blog/studies/linear-algebra/positive-definite/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 공분산 행렬이 $$\begin{bmatrix} 9 & 0 \\ 0 & 1 \end{bmatrix}$$일 때 원점에서 $$P = (3, 0)$$과 $$Q = (0, 2)$$까지의 유클리드 거리와 마할라노비스 거리를 구하라. 어느 점이 가까운가?</summary>

**답:** 유클리드로는 $$P$$가 3, $$Q$$가 2라 $$Q$$가 가깝다. 마할라노비스로는 $$P$$가 $$\frac{3}{3} = 1$$, $$Q$$가 $$\frac{2}{1} = 2$$라 $$P$$가 가깝다.<br>
**이유:** 가로 방향은 표준편차가 3이라 3만큼 떨어진 것이 흔하다. 세로 방향은 표준편차가 1이라 2만큼 떨어진 것이 드물다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 식에 $$\Sigma$$가 아니라 $$\Sigma^{-1}$$이 들어가는 이유를 말하라.</summary>

**답:** 많이 흩어지는 방향일수록 같은 차이를 작게 쳐야 하기 때문이다. 분산이 큰 방향에서 나누는 수가 커야 하는데, 나누기는 역행렬을 곱하는 것이다. 대각 행렬이면 $$\Sigma^{-1}$$의 대각이 $$\frac{1}{\sigma_i^2}$$이라 좌표 차이의 제곱을 분산으로 나눈다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 속성이 모두 같은 단위이고 서로 함께 움직이지 않으며 흩어진 정도도 같다. 유클리드 거리와 마할라노비스 거리 중 무엇을 쓰나? 반대로 키(cm)와 몸무게(kg)처럼 단위가 다르고 함께 움직이는 속성이면?</summary>

**답:** 앞의 경우는 유클리드 거리로 충분하다. 공분산 행렬이 단위행렬의 상수배라 두 거리가 상수배만 다르고 순서가 같다. 뒤의 경우는 마할라노비스 거리다. 유클리드 거리는 단위가 큰 속성이 독차지하고, 함께 움직이는 방향의 차이를 두 번 센다.

</details>


[^1]: 자료와 정보 4회 강의 자료 「D&I_강의04-1-유사도와거리」, p.10~11 (Distance on Distribution: 거리가 자료의 분포를 반영해야 하는가, A와 B가 원점에서 같은 거리여야 하는가, 분산이 큰 방향 ⇒ 멀리 있기 쉽다 ⇒ A를 B보다 가깝게 볼 수 있다)
[^2]: 같은 자료, p.11 (Mahalanobis Distance의 식, $$\Sigma$$ = covariance matrix, 같은 유클리드 거리의 원과 같은 마할라노비스 거리의 타원 그림)
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 분산 (4, 1)의 표 예시, $$\Sigma$$의 세 경우, 비스듬한 예제, 네 조건을 지킨다는 것, 활용 절, 카드는 슬라이드에 없다. 슬라이드에는 식과 그림, 세 줄의 설명만 있다. 2차원 수치는 검증 코드로 확인했다. 내용은 Mahalanobis, "On the generalised distance in statistics"(1936)와 Bishop, *Pattern Recognition and Machine Learning*, 2.3절에 있다.
{% endraw %}
