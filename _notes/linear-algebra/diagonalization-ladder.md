---
layout: "note"
title: "고윳값과 대각화 예제 사다리"
display_title: "고윳값과 대각화 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "20"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 고윳값과 고유벡터, 대각화와 행렬 거듭제곱."
prev_url: "/studies/linear-algebra/least-squares-ladder/"
prev_title: "최소제곱 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/linear-algebra/diagonalization-ladder/"
---
{% raw %}
사용 개념: [고윳값과 고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/), [대각화와 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/diagonalization/).

이 방법을 떠올리는 신호는 **같은 행렬을 여러 번 곱하거나($$A^k$$), 반복 과정의 장기 행동(정상 상태, 수렴, 폭발)을 묻는** 문제다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *고윳값:* $$\det(A - \lambda I) = 0$$을 푼다. $$2 \times 2$$면 $$\lambda^2 - (\operatorname{tr}A)\lambda + \det A = 0$$.
2. *고유벡터:* 고윳값마다 $$(A - \lambda I)\mathbf{x} = \mathbf{0}$$의 영이 아닌 해를 구한다.
3. *대각화 판정:* 독립인 고유벡터가 $$n$$개면 $$X$$(열 = 고유벡터), $$\Lambda$$(대각 = 고윳값)를 세운다.
4. *목표 계산과 검산:* $$A^k = X\Lambda^kX^{-1}$$ 또는 $$\mathbf{u}_k = \sum c_i\lambda_i^k\mathbf{x}_i$$($$\sum$$은 차례로 모두 더한다는 기호)를 쓰고, $$k = 1$$이나 $$AX = X\Lambda$$로 확인한다.

## 문제 1 · 완전한 풀이

$$A = \begin{pmatrix}2 & 1\\ 1 & 2\end{pmatrix}$$의 $$A^k$$.

1. *고윳값:* $$\lambda^2 - 4\lambda + 3 = 0$$, $$\lambda = 3, 1$$.
2. *고유벡터:* $$\lambda = 3$$: $$(1, 1)$$. $$\lambda = 1$$: $$(1, -1)$$.
3. *판정:* 서로 다른 고윳값이라 독립. $$X = \begin{pmatrix}1 & 1\\ 1 & -1\end{pmatrix}$$, $$\Lambda = \operatorname{diag}(3, 1)$$.
4. *계산과 검산:* $$A^k = \frac12\begin{pmatrix}3^k + 1 & 3^k - 1\\ 3^k - 1 & 3^k + 1\end{pmatrix}$$. $$k = 1$$이면 $$A$$가 나온다.

## 문제 2 · 마지막 하위목표만 빈칸

$$A = \begin{pmatrix}4 & 1\\ 2 & 3\end{pmatrix}$$의 $$A^k$$.

1. *고윳값:* $$\lambda^2 - 7\lambda + 10 = 0$$, $$\lambda = 5, 2$$.
2. *고유벡터:* $$\lambda = 5$$: $$A - 5I = \begin{pmatrix}-1 & 1\\ 2 & -2\end{pmatrix}$$에서 $$(1, 1)$$. $$\lambda = 2$$: $$A - 2I = \begin{pmatrix}2 & 1\\ 2 & 1\end{pmatrix}$$에서 $$(1, -2)$$.
3. *판정:* $$X = \begin{pmatrix}1 & 1\\ 1 & -2\end{pmatrix}$$, $$\Lambda = \operatorname{diag}(5, 2)$$.
4. *계산과 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$X^{-1} = \frac13\begin{pmatrix}2 & 1\\ 1 & -1\end{pmatrix}$$. $$A^k = X\operatorname{diag}(5^k, 2^k)X^{-1} = \frac13\begin{pmatrix}2 \cdot 5^k + 2^k & 5^k - 2^k\\ 2 \cdot 5^k - 2 \cdot 2^k & 5^k + 2 \cdot 2^k\end{pmatrix}$$. $$k = 1$$이면 $$\frac13\begin{pmatrix}12 & 3\\ 6 & 9\end{pmatrix} = A$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

날씨가 맑으면 다음 날도 맑을 확률 0.9, 흐리면 다음 날 맑을 확률 0.2다. (맑음, 흐림) 확률은 $$A = \begin{pmatrix}0.9 & 0.2\\ 0.1 & 0.8\end{pmatrix}$$을 곱해 바뀐다. 오래 지나면 맑은 날의 비율은?

1. *고윳값:* 대각합 1.7, 행렬식 0.7이라 $$\lambda^2 - 1.7\lambda + 0.7 = 0$$, $$\lambda = 1, 0.7$$.
2. *고유벡터:* $$\lambda = 1$$: $$A - I = \begin{pmatrix}-0.1 & 0.2\\ 0.1 & -0.2\end{pmatrix}$$에서 $$(2, 1)$$. $$\lambda = 0.7$$: $$(1, -1)$$.
3. *판정:* ______
4. *계산과 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. 서로 다른 고윳값이라 대각화된다. $$X = \begin{pmatrix}2 & 1\\ 1 & -1\end{pmatrix}$$, $$\Lambda = \operatorname{diag}(1, 0.7)$$.
4. $$\mathbf{u}_k = c_1(2, 1) + c_2(0.7)^k(1, -1)$$에서 $$0.7^k \to 0$$이라 $$(2, 1)$$ 방향만 남는다. 확률의 합이 1이 되도록 나누면 $$(\frac23, \frac13)$$. 맑은 날이 $$\frac23$$이다. 검산: $$A(\frac23, \frac13) = (0.6 + \frac{0.2}{3},\ \frac{0.1 \cdot 2}{3} + \frac{0.8}{3}) = (\frac23, \frac13)$$.

</details>


## 문제 4 · 독립 문제

$$A = \begin{pmatrix}3 & 1\\ 0 & 2\end{pmatrix}$$의 $$A^k$$를 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

삼각행렬이라 고윳값은 3, 2. $$\lambda = 3$$: $$(1, 0)$$. $$\lambda = 2$$: $$A - 2I = \begin{pmatrix}1 & 1\\ 0 & 0\end{pmatrix}$$에서 $$(1, -1)$$. $$X = \begin{pmatrix}1 & 1\\ 0 & -1\end{pmatrix} = X^{-1}$$. $$A^k = \begin{pmatrix}3^k & 3^k - 2^k\\ 0 & 2^k\end{pmatrix}$$. $$k = 2$$이면 $$\begin{pmatrix}9 & 5\\ 0 & 4\end{pmatrix}$$로 직접 곱한 것과 같다.

</details>


## 변형 문제

$$J = \begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$은 하위목표 3에서 막힌다. 왜 막히고, $$J^k$$는 어떻게 구하는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

고윳값 1이 두 번인데 $$J - I = \begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$$의 영공간이 1차원이라 독립인 고유벡터가 하나뿐이다. 대각화되지 않는다. 직접 곱해 보면 $$J^2 = \begin{pmatrix}1 & 2\\ 0 & 1\end{pmatrix}$$이고 귀납법으로 $$J^k = \begin{pmatrix}1 & k\\ 0 & 1\end{pmatrix}$$이다. 고윳값이 1인데도 $$k$$에 비례해 자란다. 이런 행렬은 조르당 형식으로 다룬다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1, 4의 공식과 문제 2의 $$A^k$$(유리수로 $$k \le 10$$), 문제 3의 정상 상태, 변형의 $$J^k$$ — [20_diagonalization_verify.py](/Hongs_Blog/studies/linear-algebra/code/20_diagonalization_verify/)</div>

</div>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 6.1절(고윳값 구하기), 6.2절 "Diagonalizing a Matrix"(대각화와 $$A^k$$, 대각화되지 않는 경우).
{% endraw %}
