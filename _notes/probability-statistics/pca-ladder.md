---
layout: "note"
title: "주성분 분석 예제 사다리"
display_title: "주성분 분석 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "36"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
description: "사용 개념: 주성분 분석, 고윳값과 고유벡터, 공분산."
prev_url: "/studies/probability-statistics/hypothesis-testing-ladder/"
prev_title: "가설검정 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/probability-statistics/pca-ladder/"
---
{% raw %}
사용 개념: [주성분 분석](/Hongs_Blog/studies/probability-statistics/pca/), [고윳값과 고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/), [공분산](/Hongs_Blog/studies/probability-statistics/covariance/).

손으로 하는 PCA는 2차원 자료면 충분히 연습된다. 핵심은 **가운데로 옮기는 것을 잊지 않고, 고유벡터를 단위 길이로 맞추는 것**이다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *가운데로 옮기기:* 변수마다 평균을 빼고, 단위가 다르면 표준편차로도 나눈다.
2. *공분산 행렬:* $$\Sigma = \frac1n\sum\tilde{\mathbf{x}}_i\tilde{\mathbf{x}}_i^\top$$.
3. *고유분해:* 고윳값을 큰 순서로, 고유벡터를 단위 길이로 구한다. 2×2 대칭행렬 $$\begin{pmatrix}a & b\\ b & a\end{pmatrix}$$는 고윳값 $$a \pm b$$, 방향 $$\frac{1}{\sqrt2}(1, \pm1)$$이다.
4. *투영과 설명 비율:* 점수 $$\tilde{\mathbf{x}}^\top\mathbf{v}_1$$과 비율 $$\frac{\lambda_1}{\lambda_1 + \lambda_2}$$을 구한다.

## 문제 1 · 완전한 풀이

점 $$(2, 1), (-2, -1), (1, 2), (-1, -2)$$의 첫 주성분과 설명된 분산 비율, 점 $$(2, 1)$$의 점수는?

1. *가운데:* 평균이 $$(0, 0)$$이라 그대로다.
2. *공분산:* $$\frac14\begin{pmatrix}4 + 4 + 1 + 1 & 2 + 2 + 2 + 2\\ 8 & 10\end{pmatrix} = \begin{pmatrix}2.5 & 2\\ 2 & 2.5\end{pmatrix}$$.
3. *고유분해:* $$a = 2.5$$, $$b = 2$$라 고윳값 4.5와 0.5, 첫 방향 $$\frac{1}{\sqrt2}(1, 1)$$.
4. *투영과 비율:* 비율 $$\frac{4.5}{5} = 90\%$$. $$(2, 1)$$의 점수 $$\frac{3}{\sqrt2} \approx 2.12$$.

## 문제 2 · 마지막 하위목표만 빈칸

공분산 행렬이 $$\begin{pmatrix}2 & 1\\ 1 & 2\end{pmatrix}$$인 평균 0의 자료에서 첫 주성분 하나만 남긴다.

1. *가운데:* 평균이 0이다.
2. *공분산:* 주어졌다.
3. *고유분해:* 고윳값 3(방향 $$\frac{1}{\sqrt2}(1, 1)$$)과 1(방향 $$\frac{1}{\sqrt2}(1, -1)$$).
4. *투영과 설명 비율:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

첫 주성분이 전체 분산 $$2 + 2 = 4$$ 중 3, 곧 75%를 설명한다. 점 $$(x_1, x_2)$$는 점수 $$\frac{x_1 + x_2}{\sqrt2}$$ 하나로 요약되고, 버린 25%는 $$\frac{x_1 - x_2}{\sqrt2}$$ 방향의 흩어짐이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

점 $$(1, 1), (2, 2), (3, 3), (4, 4)$$의 주성분 분석을 하라.

1. *가운데로 옮기기:* ______
2. *공분산 행렬:* ______
3. *고유분해:* 고윳값 2.5와 0, 첫 방향 $$\frac{1}{\sqrt2}(1, 1)$$.
4. *투영과 비율:* 첫 주성분이 100%를 설명한다. 점들이 한 직선 위에 있어 1차원으로 줄여도 정보를 잃지 않는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 평균 $$(2.5, 2.5)$$를 빼면 $$(-1.5, -1.5), (-0.5, -0.5), (0.5, 0.5), (1.5, 1.5)$$.
2. 두 좌표가 같아 모든 성분이 $$\frac{2.25 + 0.25 + 0.25 + 2.25}{4} = 1.25$$. $$\Sigma = \begin{pmatrix}1.25 & 1.25\\ 1.25 & 1.25\end{pmatrix}$$이라 $$a \pm b$$로 고윳값 2.5와 0.

</details>


## 문제 4 · 독립 문제

두 센서 값의 공분산 행렬이 $$\begin{pmatrix}4 & 2\\ 2 & 3\end{pmatrix}$$이다. 첫 주성분이 설명하는 분산의 비율을 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

대각 성분이 달라 $$a \pm b$$ 공식은 쓸 수 없다. 특성방정식 $$\lambda^2 - 7\lambda + 8 = 0$$에서 $$\lambda = \frac{7 \pm \sqrt{17}}{2} \approx 5.56, 1.44$$. 비율 $$\frac{5.56}{7} \approx 79.5\%$$.

**흔한 오답:** 가장 큰 대각 성분 4를 첫 주성분의 분산으로 쓰는 것($$\frac47 \approx 57\%$$). 두 변수의 공분산 2 때문에 기울어진 방향의 분산이 더 크다.

</details>


## 변형 문제

점 $$(2, 0), (0, 2), (-2, 0), (0, -2)$$의 첫 주성분은 무엇인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

공분산 행렬이 $$\begin{pmatrix}2 & 0\\ 0 & 2\end{pmatrix}$$로, 모든 방향의 분산이 2로 같다. 고윳값이 겹쳐 첫 주성분 방향이 하나로 정해지지 않는다. 어떤 단위벡터를 골라도 50%를 설명한다. 이런 자료는 PCA로 차원을 줄여도 얻는 것이 없다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1·2·3·4의 공분산·고윳값·비율·점수 — [36_pca_verify.py](/Hongs_Blog/studies/probability-statistics/code/36_pca_verify/)</div>

</div>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 7.3절 "Principal Component Analysis (PCA by the SVD)".
{% endraw %}
