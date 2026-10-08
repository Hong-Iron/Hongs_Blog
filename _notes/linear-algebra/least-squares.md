---
layout: "note"
title: "최소제곱법"
display_title: "최소제곱법 (Least Squares)"
kind: "concept"
kind_label: "기법"
num: "17"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Least Squares", "최소제곱법", "최소자승법", "선형 회귀", "linear regression", "회귀 직선", "regression line", "곡선 맞추기", "curve fitting", "잔차", "residual", "오차 제곱합", "sum of squared errors", "정규방정식", "normal equations"]
description: "측정값이 조금씩 흔들리면 모든 점을 정확히 지나는 직선은 없다. 최소제곱법은 각 점에서 직선까지의 세로 차이(잔차)를 제곱해 더한 값이 가장 작은 직선을 고른다. 식이 미지수보다 많아 풀 수 없는 연립방정식 대신, 우변을 풀 수 있는 곳(열공간)으로 사영한 방정식을 푸는 것과 같다…"
prev_url: "/studies/linear-algebra/orthogonal-projection/"
prev_title: "직교성과 직교 사영"
next_url: "/studies/linear-algebra/gram-schmidt-qr/"
next_title: "그람-슈미트와 QR 분해"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/least-squares/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

측정값이 조금씩 흔들리면 모든 점을 정확히 지나는 직선은 없다. 최소제곱법은 각 점에서 직선까지의 세로 차이(잔차)를 제곱해 더한 값이 가장 작은 직선을 고른다. 식이 미지수보다 많아 풀 수 없는 연립방정식 대신, 우변을 풀 수 있는 곳(열공간)으로 사영한 방정식을 푸는 것과 같다. 회귀 분석, 곡선 맞추기, GPS 위치 계산이 모두 이 방법이다. 다만 제곱을 쓰기 때문에 튀는 점(이상치) 하나에 크게 끌려가고, 줄이는 것은 수직 거리가 아니라 세로 거리다.

</div>


## 예시로 보기

공부 시간 $$t$$(시간)와 점수 $$y$$가 $$(1, 2)$$, $$(2, 3)$$, $$(3, 5)$$, $$(4, 6)$$이다. 직선 $$y = C + Dt$$가 네 점을 모두 지나려면

$$\begin{pmatrix}1 & 1\\ 1 & 2\\ 1 & 3\\ 1 & 4\end{pmatrix}\begin{pmatrix}C\\ D\end{pmatrix} = \begin{pmatrix}2\\ 3\\ 5\\ 6\end{pmatrix}$$

이어야 하는데, 식 4개에 미지수 2개라 해가 없다. 정규방정식 $$A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}$$($$^\top$$는 행과 열을 바꾸는 전치)는 $$\begin{pmatrix}4 & 10\\ 10 & 30\end{pmatrix}\begin{pmatrix}C\\ D\end{pmatrix} = \begin{pmatrix}16\\ 47\end{pmatrix}$$이고, 풀면 $$C = 0.5$$, $$D = 1.4$$다. 잔차는 $$0.1, -0.3, 0.3, -0.1$$이고 제곱합 0.2가 어떤 직선보다도 작다. 데이터 행렬이 아래의 $$A$$, 점수가 $$\mathbf{b}$$, 기울기와 절편이 $$\hat{\mathbf{x}}$$다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">최소제곱 해</div>

$$A$$($$m \times n$$, $$m > n$$)의 열이 독립일 때, 오차 제곱합 $$\Vert A\mathbf{x} - \mathbf{b}\Vert ^2$$($$\lVert\cdot\rVert$$는 벡터의 길이)을 가장 작게 하는 $$\mathbf{x}$$는 하나뿐이고, **정규방정식**

$$A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}$$

의 해다. 이때 $$A\hat{\mathbf{x}}$$는 $$\mathbf{b}$$를 $$C(A)$$에 [직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)한 $$\mathbf{p}$$이고, 잔차 $$\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}}$$는 $$A$$의 모든 열과 수직이다[^1].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

$$A\mathbf{x}$$는 $$\mathbf{x}$$가 무엇이든 $$C(A)$$ 안의 점이다. 그러므로 $$\Vert A\mathbf{x} - \mathbf{b}\Vert $$를 가장 작게 하는 것은 "$$C(A)$$에서 $$\mathbf{b}$$에 가장 가까운 점"을 찾는 것이고, 그 점은 직교 사영 $$\mathbf{p}$$ 하나뿐이다([사영 정리](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)). 열이 독립이라 $$A\mathbf{x} = \mathbf{p}$$의 해 $$\hat{\mathbf{x}}$$도 하나뿐이고, 사영의 조건이 곧 정규방정식이다. ∎

</details>


**적용 조건.** (1) 관측(식)이 미지수보다 많고, (2) 모형이 **미지수에 대해 일차**여야 한다. $$y = C + Dt + Et^2$$은 $$t$$에 대해서는 이차지만 $$(C, D, E)$$에 대해서는 일차라 최소제곱으로 맞출 수 있다. $$A$$의 열이 $$1, t, t^2$$의 값이 된다. $$y = ae^{bt}$$처럼 미지수가 지수에 들어가면 그대로는 안 되고, $$\ln y = \ln a + bt$$로 바꿔 맞춘다(오차를 재는 방식이 달라진다).

**알아보는 신호.** "가장 잘 맞는", "오차 제곱합을 최소로", 데이터 점에 직선·곡선을 맞추기, 식이 미지수보다 많은 연립방정식.

**대표 문제.** 직선 맞추기(예시), 다항식 곡선 맞추기(연습의 문제 4), 주기 신호에 $$a\sin t + b\cos t$$ 맞추기, 여러 기지국과의 거리로 위치 추정(선형화한 뒤 최소제곱).

## 증명

위 증명은 사영을 쓴다. 같은 결론을 미분으로도 얻을 수 있다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">미분으로 보기</summary>

1. *목표 함수:* $$E(\mathbf{x}) = \Vert A\mathbf{x} - \mathbf{b}\Vert ^2 = \mathbf{x}^\top A^\top A\mathbf{x} - 2\mathbf{b}^\top A\mathbf{x} + \mathbf{b}^\top\mathbf{b}$$.
2. *기울기가 0:* 각 $$x_j$$로 편미분하면 $$\nabla E = 2A^\top A\mathbf{x} - 2A^\top\mathbf{b}$$이고, 이것이 $$\mathbf{0}$$인 곳이 정규방정식이다([편미분](/Hongs_Blog/studies/calculus/partial-derivatives/)과 [행렬 미분](/Hongs_Blog/studies/calculus/matrix-calculus/)).
3. *최소인 이유:* $$A^\top A$$가 양의 정부호($$\mathbf{x}^\top A^\top A\mathbf{x} = \Vert A\mathbf{x}\Vert ^2 > 0$$)라 $$E$$는 그릇 모양이고, 기울기가 0인 점은 유일한 최솟점이다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 사영 증명에서 "$$A\mathbf{x}$$는 늘 $$C(A)$$ 안의 점"이 왜 핵심인가?</summary>

우리가 고를 수 있는 것은 $$\mathbf{x}$$뿐이고, 그 결과는 열공간을 벗어날 수 없다. 그래서 "가장 좋은 $$\mathbf{x}$$"는 "열공간에서 가장 가까운 점"으로 바뀌고, 사영 정리를 그대로 쓸 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 절편 $$C$$가 있는 직선 맞추기에서 잔차의 합이 늘 0인 이유는?</summary>

$$A$$의 첫 열이 모두 1인 벡터다. 잔차는 모든 열과 수직이므로 $$(1, \dots, 1)\cdot\mathbf{e} = \sum e_i = 0$$이다. 예시의 $$0.1 - 0.3 + 0.3 - 0.1 = 0$$이 그것이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 기법의 핵심 아이디어는?</summary>

풀 수 없는 방정식을 "풀 수 있는 것 중 가장 가까운 방정식"으로 바꾼다. 가장 가까움은 수직 조건으로, 수직 조건은 연립방정식으로 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 방법을 쓸 수 있는 다른 상황은?</summary>

확률에서 표본 평균은 $$\sum(x_i - c)^2$$을 최소로 하는 $$c$$다(열이 1뿐인 최소제곱). 신경망 학습의 평균제곱오차(MSE) 손실도 같은 목표를 경사 하강법으로 줄인다.

</details>


## 예제

**$$(0, 6)$$, $$(1, 0)$$, $$(2, 0)$$에 직선 맞추기.**

1. *모형을 $$A\mathbf{x} \approx \mathbf{b}$$로:* $$A = \begin{pmatrix}1 & 0\\ 1 & 1\\ 1 & 2\end{pmatrix}$$, $$\mathbf{b} = (6, 0, 0)$$.
2. *정규방정식:* $$A^\top A = \begin{pmatrix}3 & 3\\ 3 & 5\end{pmatrix}$$, $$A^\top\mathbf{b} = (6, 0)$$.
3. *풀기:* $$\hat{\mathbf{x}} = (5, -3)$$, 곧 $$y = 5 - 3t$$.
4. *잔차 검산:* $$\mathbf{e} = (6, 0, 0) - (5, 2, -1) = (1, -2, 1)$$. $$A^\top\mathbf{e} = (0, 0)$$이고 제곱합은 6이다. [직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)의 예제와 같은 계산이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 정규방정식과 $$(0.5, 1.4)$$, 잔차와 제곱합 0.2, 예제 $$(5, -3)$$, 무작위 데이터에서 최소제곱 해의 제곱합이 주변의 무작위 직선보다 작음, $$A^\top\mathbf{e} = \mathbf{0}$$, 잔차 합 0, 이상치 하나가 기울기를 크게 바꿈, 세로 거리와 수직 거리의 해가 다름, 정규방정식의 조건수가 제곱이 됨 — [17_least-squares_verify.py](/Hongs_Blog/studies/linear-algebra/code/17_least-squares_verify/)</div>

</div>


## 활용

- **회귀 분석과 머신러닝.** 선형 회귀는 이 방법 그대로다. 특징이 서로 겹치면($$A$$의 열이 거의 종속) $$A^\top A$$가 거의 특이해져 계수가 불안정하다. 이때 $$\lambda\Vert \mathbf{x}\Vert ^2$$을 더한 릿지 회귀 $$(A^\top A + \lambda I)\hat{\mathbf{x}} = A^\top\mathbf{b}$$를 쓴다[^s1].
- **수치 계산.** $$A^\top A$$를 만들면 [조건수가 제곱](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/)이 되어 오차가 커진다. 라이브러리(`numpy.linalg.lstsq`)는 정규방정식 대신 QR 분해나 특잇값 분해로 푼다[^s1].
- **이상치.** 제곱 때문에 멀리 떨어진 점 하나가 직선을 크게 끌어당긴다. 절댓값 합을 줄이는 방법(최소 절대 편차)이나 이상치를 걸러 내는 방법을 함께 쓴다.
- 연습: [최소제곱 예제 사다리](/Hongs_Blog/studies/linear-algebra/least-squares-ladder/)

## 연결

- 선수: [직교성과 직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)
- 안정적인 계산: [그람-슈미트와 QR 분해](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/)
- 해가 없는 이유: [랭크와 네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/)($$\mathbf{b} \notin C(A)$$)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"최소제곱 직선은 점들에서 직선까지의 수직 거리를 최소로 한다"</div>

틀렸다. "점과 직선 사이의 거리"라고 하면 수직 거리가 먼저 떠오른다. 하지만 최소제곱은 $$y$$ 방향(세로)의 차이 $$y_i - (C + Dt_i)$$만 줄인다. $$t$$는 정확하고 $$y$$에만 오차가 있다고 보는 모형이기 때문이다. 수직 거리를 줄이면 다른 직선이 나오고(전체 최소제곱, 주성분 분석의 첫 방향), $$t$$와 $$y$$의 역할을 바꾸면 또 다른 직선이 나온다. 예를 들어 $$(0, 0)$$, $$(1, 1)$$, $$(2, 1)$$, $$(3, 3)$$에서 세 직선의 기울기는 모두 다르다.

</div>


## 과목별 관점

**수치해석 (2-2학기).** 곡선이 자료에서 얼마나 떨어졌는지 재는 세 가지 오차를 먼저 비교한다. $$e_k = f(x_k) - y_k$$라 하면 다음과 같다[^n1].

$$E_\infty = \max_k\vert e_k\vert , \qquad E_1 = \frac1N\sum_k\vert e_k\vert , \qquad E_2 = \left(\frac1N\sum_k e_k^2\right)^{1/2}$$


최대 오차는 극단적인 자료에 민감하고, 평균 오차는 계산이 쉬워 자주 쓰고, 제곱 평균 제곱근(RMS) 오차는 자료에 통계적 성질이 있을 때 쓴다. 슬라이드의 자료 $$(-1, 10), (0, 9), (1, 7), (2, 5), (3, 4), (4, 3), (5, 0), (6, -1)$$과 $$f(x) = 8.6 - 1.6x$$에서 $$E_\infty = 0.8$$, $$E_1 = 0.325$$, $$E_2 \approx 0.41833$$이다[^n2]. 최소제곱 직선은 $$E_2$$를 가장 작게 하는 직선이다. $$E_2$$가 최소인 것과 $$\sum e_k^2$$이 최소인 것은 같다[^n3].

$$y = Ax + B$$의 정규방정식을 합으로 쓰면 다음과 같다. 두 편미분을 0으로 놓아 얻는다[^n4].

$$\left(\sum x_k^2\right)A + \left(\sum x_k\right)B = \sum x_ky_k, \qquad \left(\sum x_k\right)A + NB = \sum y_k$$


같은 자료에서 $$92A + 20B = 25$$, $$20A + 8B = 37$$이라 $$y = -1.6071429x + 8.6428571$$이다[^n5]. 포물선 $$y = Ax^2 + Bx + C$$도 같은 방법으로 $$3 \times 3$$ 연립방정식이 된다. 자료 $$(-3, 3), (0, 1), (2, 1), (4, 3)$$이면 $$353A + 45B + 29C = 79$$, $$45A + 29B + 3C = 5$$, $$29A + 3B + 4C = 8$$이고 $$A = \frac{585}{3278}$$, $$B = -\frac{631}{3278}$$, $$C = \frac{1394}{1639}$$다[^n6]. 미지수에 대해 일차가 아닌 모형은 [자료 선형화](/Hongs_Blog/studies/numerical-analysis/data-linearization/)로 바꾸거나 직접 최소화한다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 최소제곱 해를 주는 정규방정식을 쓰고, 잔차가 만족하는 조건을 말하라.</summary>

**답:** $$A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}$$. 잔차 $$\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}}$$는 $$A$$의 모든 열과 수직이다($$A^\top\mathbf{e} = \mathbf{0}$$).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$(0, 1)$$, $$(1, 3)$$, $$(2, 4)$$에 직선 $$y = C + Dt$$를 맞추라.</summary>

**답:** $$A^\top A = \begin{pmatrix}3 & 3\\ 3 & 5\end{pmatrix}$$, $$A^\top\mathbf{b} = (8, 11)$$. $$2D = 3$$에서 $$D = 1.5$$, $$C = \frac76$$. 잔차 $$(-\frac16, \frac13, -\frac16)$$은 합이 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 모형 중 선형 최소제곱으로 바로 맞출 수 있는 것은? (가) $$y = a + bt^3$$ (나) $$y = a\sin t + b\cos t$$ (다) $$y = ae^{bt}$$ (라) $$y = a + b\ln t$$</summary>

**답:** (가), (나), (라). 미지수 $$a, b$$에 대해 일차이기 때문이다. (다)는 $$b$$가 지수에 들어가 일차가 아니다. $$\ln y = \ln a + bt$$로 바꾸면 맞출 수 있지만, 그때는 $$\ln y$$의 오차를 줄이는 다른 문제가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 절편이 있는 직선 맞추기에서 잔차의 합이 0인 이유는?</summary>

**답:** $$A$$의 첫 열이 $$(1, \dots, 1)$$이고 잔차는 모든 열과 수직이라 $$(1, \dots, 1)\cdot\mathbf{e} = \sum e_i = 0$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C5** C2의 최소제곱 직선 $$y = 1.5t + \frac76$$에 대해 세 점의 $$E_\infty$$와 $$E_1$$을 구하라.</summary>

**답:** 오차의 절댓값은 $$\frac16, \frac13, \frac16$$이다. $$E_\infty = \frac13$$, $$E_1 = \frac{1}{3}\left(\frac16 + \frac13 + \frac16\right) = \frac29$$[^sn1].

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 4.3절 "Least Squares Approximations"(정규방정식, 직선 맞추기의 예 $$\mathbf{b} = (6, 0, 0)$$, 포물선 맞추기, 사영과 미분 두 관점).
[^s1]: 에이전트 보충. 릿지 회귀는 통계학습 교재의 표준 방법이다. NumPy 문서는 `lstsq`가 LAPACK의 SVD 기반 `gelsd`를 쓴다고 밝힌다. 정규방정식의 조건수가 $$A$$의 조건수의 제곱임은 17_least-squares_verify.py에서 수치로 확인했다.
[^n1]: 2-2학기/수치해석/1.수업자료/13.na13_least-squares.pdf, p.3
[^n2]: 같은 자료, p.4~5
[^n3]: 같은 자료, p.6~7
[^n4]: 같은 자료, p.8~11
[^n5]: 같은 자료, p.12~13
[^n6]: 같은 자료, p.32~36
[^sn1]: 에이전트 보충. 카드 C5는 원본에 없다. 17_least-squares_verify.py로 확인했다.
{% endraw %}
