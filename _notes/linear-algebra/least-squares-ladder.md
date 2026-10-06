---
layout: "note"
title: "최소제곱 예제 사다리"
display_title: "최소제곱 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "17"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 최소제곱법, 직교성과 직교 사영."
prev_url: "/studies/linear-algebra/elimination-ladder/"
prev_title: "가우스 소거 예제 사다리"
next_url: "/studies/linear-algebra/diagonalization-ladder/"
next_title: "고윳값과 대각화 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/linear-algebra/least-squares-ladder/"
---
{% raw %}
사용 개념: [최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/), [직교성과 직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/).

이 방법을 떠올리는 신호는 **데이터 점이 미지수보다 많고, "가장 잘 맞는" 직선·곡선을 찾으라**는 요구다. 모형이 미지수에 대해 일차이기만 하면 곡선도 같은 절차로 맞춘다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *모형을 $$A\mathbf{x} \approx \mathbf{b}$$로:* 미지수를 $$\mathbf{x}$$로, 데이터 한 점을 한 행으로 적는다. $$A$$의 열은 모형의 각 항($$1$$, $$t$$, $$t^2$$, …)의 값이다.
2. *정규방정식 만들기:* $$A^\top A$$($$^\top$$는 행과 열을 바꾸는 전치)와 $$A^\top\mathbf{b}$$를 계산한다.
3. *풀기:* $$A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}$$를 푼다(작으면 소거, 크면 QR).
4. *잔차 검산:* $$\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}}$$가 $$A^\top\mathbf{e} = \mathbf{0}$$을 만족하는지 보고, 제곱합으로 맞음의 정도를 적는다.

## 문제 1 · 완전한 풀이

$$(0, 6)$$, $$(1, 0)$$, $$(2, 0)$$에 직선 $$y = C + Dt$$를 맞춘다.

1. *모형:* $$A = \begin{pmatrix}1 & 0\\ 1 & 1\\ 1 & 2\end{pmatrix}$$, $$\mathbf{b} = (6, 0, 0)$$.
2. *정규방정식:* $$A^\top A = \begin{pmatrix}3 & 3\\ 3 & 5\end{pmatrix}$$, $$A^\top\mathbf{b} = (6, 0)$$.
3. *풀기:* 두 식을 빼면 $$2D = -6$$, $$D = -3$$, $$C = 5$$. 직선 $$y = 5 - 3t$$.
4. *잔차:* $$\mathbf{e} = (1, -2, 1)$$. $$A^\top\mathbf{e} = (0, 0)$$, 제곱합 6.

## 문제 2 · 마지막 하위목표만 빈칸

$$(0, 1)$$, $$(1, 3)$$, $$(2, 4)$$에 직선을 맞춘다.

1. *모형:* 문제 1과 같은 $$A$$, $$\mathbf{b} = (1, 3, 4)$$.
2. *정규방정식:* $$A^\top\mathbf{b} = (8, 11)$$.
3. *풀기:* $$3C + 3D = 8$$, $$3C + 5D = 11$$에서 $$D = \frac32$$, $$C = \frac76$$.
4. *잔차 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

예측값 $$\frac76, \frac83, \frac{25}{6}$$이라 $$\mathbf{e} = (-\frac16, \frac13, -\frac16)$$. 합 0, $$t$$와의 내적 $$0 + \frac13 - \frac13 = 0$$. 제곱합 $$\frac1{36} + \frac19 + \frac1{36} = \frac16$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$(-1, 0)$$, $$(0, 1)$$, $$(1, 2)$$, $$(2, 1)$$에 직선을 맞춘다.

1. *모형:* $$A = \begin{pmatrix}1 & -1\\ 1 & 0\\ 1 & 1\\ 1 & 2\end{pmatrix}$$, $$\mathbf{b} = (0, 1, 2, 1)$$.
2. *정규방정식:* $$A^\top A = \begin{pmatrix}4 & 2\\ 2 & 6\end{pmatrix}$$, $$A^\top\mathbf{b} = (4, 4)$$.
3. *풀기:* ______
4. *잔차 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. $$4C + 2D = 4$$, $$2C + 6D = 4$$. 첫 식에서 $$D = 2 - 2C$$, 대입하면 $$2C + 12 - 12C = 4$$, $$C = \frac45$$, $$D = \frac25$$.
4. 예측값 $$\frac25, \frac45, \frac65, \frac85$$이라 $$\mathbf{e} = (-\frac25, \frac15, \frac45, -\frac35)$$. 합 0, $$t$$와의 내적 $$\frac25 + 0 + \frac45 - \frac65 = 0$$. 제곱합 $$\frac65$$.

</details>


## 문제 4 · 독립 문제

$$(-1, 3)$$, $$(0, 1)$$, $$(1, 1)$$, $$(2, 3)$$에 포물선 $$y = C + Dt + Et^2$$을 맞추라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$A$$의 열은 $$1$$, $$t$$, $$t^2$$이다: $$A = \begin{pmatrix}1 & -1 & 1\\ 1 & 0 & 0\\ 1 & 1 & 1\\ 1 & 2 & 4\end{pmatrix}$$. $$A^\top A = \begin{pmatrix}4 & 2 & 6\\ 2 & 6 & 8\\ 6 & 8 & 18\end{pmatrix}$$, $$A^\top\mathbf{b} = (8, 4, 16)$$. 풀면 $$(C, D, E) = (1, -1, 1)$$, 곧 $$y = 1 - t + t^2$$이고 잔차가 모두 0이다. 네 점이 정확히 이 포물선 위에 있어서 $$\mathbf{b}$$가 이미 $$C(A)$$ 안에 있었다. 최소제곱은 정확한 해가 있으면 그것을 돌려준다.

**흔한 오답:** 포물선이라 비선형 문제로 보고 포기하는 것. 미지수 $$C, D, E$$에 대해서는 일차다.

</details>


## 변형 문제

$$(0, 2)$$, $$(1, 5.5)$$, $$(2, 15)$$, $$(3, 40)$$에 $$y = ae^{bt}$$를 맞추려면 어떻게 하는가? 이때 줄이는 오차는 무엇인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

양변에 로그를 취해 $$\ln y = \ln a + bt$$로 바꾸면 미지수 $$\ln a$$, $$b$$에 대해 일차다. $$\ln y$$에 직선을 맞추면 $$\ln a \approx 0.700$$, $$b \approx 0.999$$, 곧 $$y \approx 2.01e^{0.999t}$$다. 이때 줄이는 것은 $$\ln y$$의 차이, 곧 **비율(상대) 오차**다. 원래 $$y$$의 제곱 오차를 줄이는 해와는 조금 다르다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 정규방정식·해·잔차를 유리수로 계산, 변형 문제의 계수 — [17_least-squares_verify.py](/Hongs_Blog/studies/linear-algebra/code/17_least-squares_verify/)</div>

</div>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 4.3절 "Least Squares Approximations"(직선과 포물선 맞추기).
{% endraw %}
