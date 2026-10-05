---
layout: "note"
title: "공분산 행렬과 다변량 정규분포"
display_title: "공분산 행렬과 다변량 정규분포 (Covariance Matrix and Multivariate Normal)"
kind: "concept"
kind_label: "정의"
num: "19"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
aliases: ["Multivariate Normal Distribution", "다변량 정규분포", "다변수 정규분포", "공분산 행렬", "covariance matrix", "마할라노비스 거리", "Mahalanobis distance", "신뢰 타원", "confidence ellipse", "숄레스키 분해로 표본 만들기"]
description: "변수가 여럿이면 각자의 흩어짐과 둘씩의 공분산을 한 행렬에 모은다. 다변량 정규분포는 평균 벡터와 이 공분산 행렬만으로 정해지는 여러 차원의 종 모양이다. 밀도가 같은 점들은 타원을 그리는데, 타원의 축 방향과 길이가 공분산 행렬의 고유벡터와 고윳값에서 나온다. 한 변수가 다른 변…"
prev_url: "/studies/probability-statistics/covariance/"
prev_title: "공분산과 상관계수"
next_url: "/studies/probability-statistics/tail-bounds/"
next_title: "확률 부등식"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/multivariate-normal/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

변수가 여럿이면 각자의 흩어짐과 둘씩의 공분산을 한 행렬에 모은다. 다변량 정규분포는 평균 벡터와 이 공분산 행렬만으로 정해지는 여러 차원의 종 모양이다. 밀도가 같은 점들은 타원을 그리는데, 타원의 축 방향과 길이가 공분산 행렬의 고유벡터와 고윳값에서 나온다. 한 변수가 다른 변수들의 일차 결합이라 공분산 행렬이 뒤집히지 않으면 밀도 식을 그대로 쓸 수 없다.

</div>


## 예시로 보기

두 센서의 오차 $$(X_1, X_2)$$가 평균 $$(1, -2)$$, 공분산 행렬

$$\Sigma = \begin{pmatrix}4 & 2\\ 2 & 3\end{pmatrix}$$

인 다변량 정규분포를 따른다. 대각선 4와 3은 각자의 분산, 2는 둘의 공분산이다(상관계수 $$\frac{2}{2\sqrt3} \approx 0.58$$). 표본을 20만 개 뽑아 찍으면 점들이 오른쪽 위로 기운 타원 모양 구름을 이룬다. 타원의 긴 축은 $$\Sigma$$의 큰 고윳값 $$\frac{7 + \sqrt{17}}{2} \approx 5.56$$의 고유벡터 방향, 짧은 축은 작은 고윳값 $$\approx 1.44$$의 방향이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

확률벡터 $$\mathbf{X} = (X_1, \dots, X_n)^\top$$의 **공분산 행렬**은 $$\Sigma = \mathbb{E}\big[(\mathbf{X} - \boldsymbol\mu)(\mathbf{X} - \boldsymbol\mu)^\top\big]$$, 곧 $$\Sigma_{ij} = \operatorname{Cov}(X_i, X_j)$$다. $$\Sigma$$가 양의 정부호일 때 **다변량 정규분포** $$\mathcal{N}(\boldsymbol\mu, \Sigma)$$의 밀도는

$$f(\mathbf{x}) = \frac{1}{(2\pi)^{n/2}\sqrt{\det\Sigma}}\exp\left(-\frac12(\mathbf{x} - \boldsymbol\mu)^\top\Sigma^{-1}(\mathbf{x} - \boldsymbol\mu)\right)$$

이다[^1].

</div>


**성질.**
1. $$\Sigma$$는 대칭이고 [양의 준정부호](/Hongs_Blog/studies/linear-algebra/positive-definite/)다. 어떤 방향 $$\mathbf{v}$$로 쏜 값 $$\mathbf{v}^\top\mathbf{X}$$의 분산이 $$\mathbf{v}^\top\Sigma\mathbf{v}$$이고, 분산은 음수일 수 없기 때문이다.
2. 일차 변환: $$\operatorname{Cov}(A\mathbf{X} + \mathbf{b}) = A\Sigma A^\top$$. 다변량 정규의 일차 변환은 다시 다변량 정규다.
3. 결합 정규일 때는 공분산 0이 곧 독립이다. $$\Sigma$$가 대각이면 지수 안의 이차형식이 변수별 합으로 갈라져 밀도가 곱이 된다.

지수 안의 $$(\mathbf{x} - \boldsymbol\mu)^\top\Sigma^{-1}(\mathbf{x} - \boldsymbol\mu)$$를 **마할라노비스 거리**의 제곱이라 한다. 방향마다의 흩어짐으로 나눠 잰 거리라, 이 값이 같은 점들이 밀도가 같은 타원을 이룬다. 2차원에서 이 값이 $$c$$ 이하일 확률은 $$1 - e^{-c/2}$$라, $$c = 5.991$$인 타원에 95%가 들어간다.

## 예제

**상관된 표본 만들기.** 표준정규 난수는 서로 독립인 것만 쉽게 만들 수 있다. 예시의 $$\Sigma$$를 따르는 표본은?

1. *분해:* $$\Sigma = LL^\top$$인 아래삼각 $$L$$을 구한다(숄레스키 분해). $$L = \begin{pmatrix}2 & 0\\ 1 & \sqrt2\end{pmatrix}$$.
2. *변환:* 독립 표준정규 $$\mathbf{Z} = (Z_1, Z_2)$$로 $$\mathbf{X} = \boldsymbol\mu + L\mathbf{Z}$$.
3. *확인:* 성질 2로 $$\operatorname{Cov}(\mathbf{X}) = L I L^\top = \Sigma$$. 20만 개 표본의 공분산이 $$\Sigma$$와 0.05 이내로 맞는다.

[고윳값 분해](/Hongs_Blog/studies/linear-algebra/spectral-theorem/) $$\Sigma = Q\Lambda Q^\top$$에서 $$L = Q\Lambda^{1/2}$$을 써도 된다. 이쪽은 "축마다 $$\sqrt{\lambda_i}$$로 늘린 뒤 회전한다"는 타원 그림과 바로 맞는다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 고윳값과 숄레스키 분해, 표본 공분산, 공분산 행렬의 준정부호성과 $$\operatorname{Cov}(A\mathbf{X} + \mathbf{b}) = A\Sigma A^\top$$(무작위 이산 분포 100개로 정확히), 밀도의 넓이 1, 95% 타원, 대각 공분산에서 밀도가 곱으로 나뉨, 결합 정규가 아닐 때의 반례 — [19_multivariate-normal_verify.py](/Hongs_Blog/studies/probability-statistics/code/19_multivariate-normal_verify/)</div>

</div>


## 활용

- **이상 탐지.** 정상 데이터의 평균과 공분산을 구하고, 마할라노비스 거리가 큰 점을 이상치로 본다. 변수끼리 상관이 있어도 방향마다 알맞게 잰다.
- **칼만 필터와 가우스 과정.** 상태의 불확실성을 평균 벡터와 공분산 행렬로 들고 다니며, 일차 변환(성질 2)과 조건부 분포로 갱신한다.
- **차원 축소.** 공분산 행렬의 고유벡터가 데이터가 가장 퍼진 방향이다. 이것이 [주성분 분석](/Hongs_Blog/studies/probability-statistics/pca/)이다.
- **흔한 실수.** 각 변수가 정규분포이면 함께도 다변량 정규라고 여기는 것. $$X \sim \mathcal{N}(0, 1)$$과 무작위 부호 $$S = \pm1$$로 만든 $$Y = SX$$는 둘 다 표준정규이고 공분산도 0이지만 $$\vert Y\vert  = \vert X\vert $$라 독립이 아니다. 결합이 정규일 때만 성질 3이 성립한다.

## 연결

- 선수: [공분산](/Hongs_Blog/studies/probability-statistics/covariance/), [정규분포](/Hongs_Blog/studies/probability-statistics/normal-distribution/), [양의 정부호 행렬](/Hongs_Blog/studies/linear-algebra/positive-definite/)
- 계산 도구: [숄레스키 분해](/Hongs_Blog/studies/linear-algebra/decompositions-compared/), [스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 공분산 행렬이 $$\begin{pmatrix}4 & 2\\ 2 & 3\end{pmatrix}$$일 때 $$\operatorname{Var}[X_1 + X_2]$$는?</summary>

**답:** $$A = (1\ 1)$$이라 $$A\Sigma A^\top = 4 + 3 + 2 \times 2 = 11$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 공분산 행렬이 늘 양의 준정부호인 이유를 설명하라.</summary>

**답:** 어떤 벡터 $$\mathbf{v}$$에 대해서도 $$\mathbf{v}^\top\Sigma\mathbf{v} = \operatorname{Var}[\mathbf{v}^\top\mathbf{X}]$$이고, 분산은 제곱의 평균이라 음수가 될 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 독립 표준정규 난수만 만들 수 있을 때, 공분산이 $$\Sigma = \begin{pmatrix}4 & 2\\ 2 & 3\end{pmatrix}$$인 2차원 정규 표본을 만드는 절차를 식으로 쓰라.</summary>

**답:** $$\Sigma = LL^\top$$, $$L = \begin{pmatrix}2 & 0\\ 1 & \sqrt2\end{pmatrix}$$로 분해하고 $$\mathbf{X} = \boldsymbol\mu + L\mathbf{Z}$$. 곧 $$X_1 = \mu_1 + 2Z_1$$, $$X_2 = \mu_2 + Z_1 + \sqrt2 Z_2$$. 검산: $$\operatorname{Var}[X_2] = 1 + 2 = 3$$, $$\operatorname{Cov} = 2 \cdot 1 = 2$$.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 7.5절 "Multivariate Normal"(정의, 일차 변환, 결합 정규에서 무상관 = 독립, 각자 정규여도 결합이 정규가 아닌 예).
{% endraw %}
