---
layout: "note"
title: "직교성과 직교 사영"
display_title: "직교성과 직교 사영 (Orthogonality and Projections)"
kind: "concept"
kind_label: "정리"
num: "16"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Orthogonal Projection", "직교 사영", "정사영", "사영", "projection", "사영 행렬", "projection matrix", "직교 여공간", "orthogonal complement", "정규방정식", "normal equations", "오차 벡터", "error vector"]
description: "점에서 평면까지 가장 가까운 곳은 평면에 수직으로 내린 발이다. 벡터를 어떤 부분공간에 직교 사영한다는 것은 이 \"수직으로 내린 발\"을 찾는 것이고, 남는 오차는 부분공간 전체와 수직이다. 이 수직 조건 하나에서 계산 공식(정규방정식)이 나오며, 풀 수 없는 방정식에 대한 최선의 …"
prev_url: "/studies/linear-algebra/determinant/"
prev_title: "행렬식"
next_url: "/studies/linear-algebra/least-squares/"
next_title: "최소제곱법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/orthogonal-projection/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

점에서 평면까지 가장 가까운 곳은 평면에 수직으로 내린 발이다. 벡터를 어떤 부분공간에 직교 사영한다는 것은 이 "수직으로 내린 발"을 찾는 것이고, 남는 오차는 부분공간 전체와 수직이다. 이 수직 조건 하나에서 계산 공식(정규방정식)이 나오며, 풀 수 없는 방정식에 대한 최선의 근사(최소제곱), 신호를 성분으로 나누기가 모두 여기서 시작한다. 다만 수직이 아니라 비스듬히 내리는 사영도 있어, 그것은 가장 가까운 점을 주지 않는다.

</div>


## 예시로 보기

$$\mathbf{b} = (1, 1, 1)$$을 $$\mathbf{a} = (1, 2, 2)$$ 방향의 직선에 사영한다. 직선 위의 점은 $$\hat{x}\mathbf{a}$$ 꼴이고, 오차 $$\mathbf{b} - \hat{x}\mathbf{a}$$가 $$\mathbf{a}$$와 수직이 되는 $$\hat{x}$$를 찾는다.

$$\mathbf{a}\cdot(\mathbf{b} - \hat{x}\mathbf{a}) = 0 \implies \hat{x} = \frac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{a}\cdot\mathbf{a}} = \frac{5}{9}.$$

사영은 $$\mathbf{p} = \frac59(1, 2, 2)$$, 오차는 $$\mathbf{e} = (\frac49, -\frac19, -\frac19)$$이다. 확인하면 $$\mathbf{a}\cdot\mathbf{e} = \frac49 - \frac29 - \frac29 = 0$$이다. 직선이 아래 정리의 부분공간 $$C(A)$$(열이 $$\mathbf{a}$$ 하나), $$\mathbf{p}$$가 사영이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- 두 부분공간 $$V, W$$의 모든 벡터가 서로 수직이면 $$V$$와 $$W$$는 **직교**한다. $$V$$와 수직인 모든 벡터의 집합을 **직교 여공간** $$V^\perp$$라 한다.
- $$\mathbf{b}$$를 부분공간 $$V$$에 **직교 사영**한 $$\mathbf{p}$$는 $$\mathbf{p} \in V$$($$\in$$은 "~에 속한다")이고 $$\mathbf{b} - \mathbf{p} \perp V$$인 벡터다[^1].

</div>


[네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/)은 서로 직교 여공간이다. $$N(A) = C(A^\top)^\perp$$, $$N(A^\top) = C(A)^\perp$$이고, 차원이 $$r + (n - r) = n$$으로 맞아 $$\mathbb{R}^n$$($$\mathbb{R}$$은 실수 전체, $$\mathbb{R}^n$$은 실수 $$n$$개짜리 목록 전체)을 빠짐없이 나눈다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">부분공간으로의 사영</div>

$$A$$($$m \times n$$)의 열이 독립이면 $$A^\top A$$는 가역이고, $$\mathbf{b}$$를 $$C(A)$$에 사영하면

$$\hat{\mathbf{x}} = (A^\top A)^{-1}A^\top\mathbf{b}, \qquad \mathbf{p} = A\hat{\mathbf{x}} = P\mathbf{b}, \qquad P = A(A^\top A)^{-1}A^\top.$$

사영 행렬 $$P$$는 $$P^2 = P$$, $$P^\top = P$$를 만족한다. 그리고 $$\mathbf{p}$$는 $$C(A)$$에서 $$\mathbf{b}$$에 가장 가까운 유일한 점이다. 모든 $$\mathbf{v} \in C(A)$$에 대해 $$\Vert \mathbf{b} - \mathbf{p}\Vert  \le \Vert \mathbf{b} - \mathbf{v}\Vert $$($$\lVert\cdot\rVert$$는 벡터의 길이)이고 등호는 $$\mathbf{v} = \mathbf{p}$$일 때뿐이다.

</div>


직선($$A = \mathbf{a}$$ 한 열)에서는 $$P = \frac{\mathbf{a}\mathbf{a}^\top}{\mathbf{a}^\top\mathbf{a}}$$이 되어 예시의 공식과 같다.

## 증명

"오차가 모든 열과 수직"을 식으로 쓰면 정규방정식이 되고, 피타고라스 정리로 가장 가까움을 보인다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *수직 조건:* $$\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}}$$가 $$C(A)$$와 수직이려면 모든 열과 수직이면 된다. 곧 $$A^\top(\mathbf{b} - A\hat{\mathbf{x}}) = \mathbf{0}$$, 즉 $$A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}$$(정규방정식).
2. *$$A^\top A$$는 가역:* $$A^\top A\mathbf{x} = \mathbf{0}$$이면 $$\mathbf{x}^\top A^\top A\mathbf{x} = \Vert A\mathbf{x}\Vert ^2 = 0$$이라 $$A\mathbf{x} = \mathbf{0}$$이다. 열이 독립이므로 $$\mathbf{x} = \mathbf{0}$$. [가역 행렬 정리](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)로 $$A^\top A$$는 가역이다.
3. *$$P$$의 성질:* $$P^2 = A(A^\top A)^{-1}(A^\top A)(A^\top A)^{-1}A^\top = P$$. $$P^\top = A((A^\top A)^{-1})^\top A^\top = P$$($$A^\top A$$가 대칭이라 역도 대칭).
4. *가장 가까움:* $$\mathbf{v} \in C(A)$$이면 $$\mathbf{b} - \mathbf{v} = (\mathbf{b} - \mathbf{p}) + (\mathbf{p} - \mathbf{v})$$. 앞은 $$C(A)$$와 수직이고 뒤는 $$C(A)$$ 안에 있어 서로 수직이다. 피타고라스로 $$\Vert \mathbf{b} - \mathbf{v}\Vert ^2 = \Vert \mathbf{b} - \mathbf{p}\Vert ^2 + \Vert \mathbf{p} - \mathbf{v}\Vert ^2 \ge \Vert \mathbf{b} - \mathbf{p}\Vert ^2$$, 등호는 $$\mathbf{v} = \mathbf{p}$$일 때뿐이다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 "모든 열과 수직"만 확인하면 $$C(A)$$ 전체와 수직인 이유는?</summary>

$$C(A)$$의 벡터는 열들의 선형결합이고, 내적은 선형이다. 각 열과의 내적이 0이면 그 결합과의 내적도 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 2단계의 $$\mathbf{x}^\top A^\top A\mathbf{x} = \Vert A\mathbf{x}\Vert ^2$$은 어떻게 나오는가?</summary>

$$\mathbf{x}^\top A^\top = (A\mathbf{x})^\top$$이라 $$(A\mathbf{x})^\top(A\mathbf{x}) = (A\mathbf{x})\cdot(A\mathbf{x})$$이다. 길이의 제곱이 0이면 벡터가 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정리의 핵심 아이디어는?</summary>

"가장 가깝다"는 최소화 문제를 "오차가 수직이다"라는 방정식으로 바꾼다. 방정식은 풀 수 있고, 피타고라스가 둘이 같은 말임을 보장한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

푸리에 급수의 계수는 신호를 각 사인파 방향에 사영한 것이다([푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/)). 확률에서 조건부 기댓값은 "정보로 만들 수 있는 것 중 가장 가까운 예측"으로, 같은 수직 조건을 만족한다.

</details>


## 가정이 필요한 이유

| 가정 | 없으면 | 예 |
|---|---|---|
| $$A$$의 열이 독립 | $$A^\top A$$가 비가역이라 공식을 쓸 수 없다(사영 자체는 있다) | 열이 $$(1, 1)$$, $$(2, 2)$$면 $$A^\top A = \begin{pmatrix}2 & 4\\ 4 & 8\end{pmatrix}$$, 행렬식 0 |
| $$P^\top = P$$(수직으로 내림) | $$P^2 = P$$여도 가장 가까운 점이 아니다 | $$P = \begin{pmatrix}1 & 1\\ 0 & 0\end{pmatrix}$$은 $$P^2 = P$$인 비스듬한 사영. $$(0, 1) \mapsto (1, 0)$$이지만 $$x$$축에서 가장 가까운 점은 $$(0, 0)$$ |

**역.** $$P^2 = P$$이고 $$P^\top = P$$인 행렬은 모두 자기 열공간으로의 직교 사영이다[^1].

## 예제

$$\mathbf{b} = (6, 0, 0)$$을 $$(1, 1, 1)$$과 $$(0, 1, 2)$$가 만드는 평면에 사영한다.

1. *행렬:* $$A = \begin{pmatrix}1 & 0\\ 1 & 1\\ 1 & 2\end{pmatrix}$$. $$A^\top A = \begin{pmatrix}3 & 3\\ 3 & 5\end{pmatrix}$$, $$A^\top\mathbf{b} = (6, 0)$$.
2. *정규방정식:* $$3\hat{x}_1 + 3\hat{x}_2 = 6$$, $$3\hat{x}_1 + 5\hat{x}_2 = 0$$에서 $$\hat{x}_2 = -3$$, $$\hat{x}_1 = 5$$.
3. *사영과 오차:* $$\mathbf{p} = 5(1, 1, 1) - 3(0, 1, 2) = (5, 2, -1)$$, $$\mathbf{e} = (1, -2, 1)$$.
4. *검산:* $$\mathbf{e}\cdot(1, 1, 1) = 0$$, $$\mathbf{e}\cdot(0, 1, 2) = 0$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 $$\frac59$$와 수직, 예제의 $$(5, -3)$$, $$\mathbf{p}$$, $$\mathbf{e}$$, 무작위 행렬에서 $$P^2 = P$$, $$P^\top = P$$, 오차 ⊥ $$C(A)$$, 가장 가까움(무작위 $$\mathbf{v}$$ 비교), 네 부분공간의 직교 여공간 관계, 종속 열에서 $$A^\top A$$ 비가역, 비스듬한 사영의 반례 — [16_orthogonal-projection_verify.py](/Hongs_Blog/studies/linear-algebra/code/16_orthogonal-projection_verify/)</div>

</div>


## 활용

- **최소제곱.** 해가 없는 $$A\mathbf{x} = \mathbf{b}$$에서 $$\mathbf{b}$$를 열공간에 사영한 $$\mathbf{p}$$를 대신 푸는 것이 [최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/)이다.
- **신호 분해.** 신호를 서로 수직인 기저(사인파 등)에 사영하면 성분마다 따로 계산된다. 기저가 직교이면 $$A^\top A$$가 대각이라 역행렬이 필요 없다([그람–슈미트](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/)).
- **그래픽스.** 3D 장면을 화면으로 누르는 정사영, 바닥에 떨어지는 그림자(평행광)가 사영이다.

## 연결

- 선수: [랭크와 네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/), [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/)
- 이어지는 개념: [최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/), [그람-슈미트와 QR 분해](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$P^2 = P$$인 행렬은 가장 가까운 점으로 보내는 사영이다"</div>

틀렸다. $$P^2 = P$$는 "한 번 사영한 것을 또 사영해도 그대로"라는 뜻이라 사영의 조건처럼 들린다. 하지만 비스듬히 내리는 사영도 이것을 만족한다. $$P = \begin{pmatrix}1 & 1\\ 0 & 0\end{pmatrix}$$은 $$(0, 1)$$을 $$x$$축 위의 $$(1, 0)$$으로 보내는데, $$(0, 1)$$에서 $$x$$축의 가장 가까운 점은 $$(0, 0)$$이다. 가장 가까운 점을 주려면 $$P^\top = P$$(수직으로 내림)까지 필요하다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 열이 독립인 $$A$$에 대해 $$C(A)$$로의 사영 행렬 공식과 그 두 성질을 쓰라.</summary>

**답:** $$P = A(A^\top A)^{-1}A^\top$$. $$P^2 = P$$, $$P^\top = P$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\mathbf{b} = (2, 0)$$을 $$\mathbf{a} = (1, 1)$$ 방향의 직선에 사영하고 오차를 구하라.</summary>

**답:** $$\hat{x} = \frac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{a}\cdot\mathbf{a}} = \frac22 = 1$$, $$\mathbf{p} = (1, 1)$$, $$\mathbf{e} = (1, -1)$$. $$\mathbf{a}\cdot\mathbf{e} = 0$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 정규방정식 $$A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}$$는 어떤 조건을 식으로 쓴 것인가?</summary>

**답:** 오차 $$\mathbf{b} - A\hat{\mathbf{x}}$$가 $$A$$의 모든 열과 수직이라는 조건 $$A^\top(\mathbf{b} - A\hat{\mathbf{x}}) = \mathbf{0}$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$P^2 = P$$인데 가장 가까운 점을 주지 않는 행렬을 들라.</summary>

**답:** $$P = \begin{pmatrix}1 & 1\\ 0 & 0\end{pmatrix}$$. $$(0, 1) \mapsto (1, 0)$$이지만 $$x$$축에서 $$(0, 1)$$에 가장 가까운 점은 $$(0, 0)$$이다. $$P^\top \ne P$$라 수직 사영이 아니다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 4.1절 "Orthogonality of the Four Subspaces"(직교 여공간), 4.2절 "Projections"(직선·부분공간으로의 사영, $$P^2 = P$$, $$P^\top = P$$, 예 $$\mathbf{b} = (6, 0, 0)$$).
{% endraw %}
