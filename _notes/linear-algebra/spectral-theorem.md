---
layout: "note"
title: "대칭행렬과 스펙트럼 정리"
display_title: "대칭행렬과 스펙트럼 정리 (Symmetric Matrices and the Spectral Theorem)"
kind: "concept"
kind_label: "정리"
num: "22"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Spectral Theorem", "스펙트럼 정리", "대칭행렬", "symmetric matrix", "직교 대각화", "orthogonal diagonalization", "스펙트럼 분해", "spectral decomposition", "주축 정리", "principal axis theorem", "그래프 라플라시안", "graph Laplacian"]
description: "대각선을 기준으로 접으면 겹치는 행렬(대칭행렬)은 가장 다루기 좋은 행렬이다. 고윳값이 모두 실수이고, 서로 수직인 고유벡터들로 공간 전체를 덮을 수 있다. 그래서 대칭행렬이 하는 일은 늘 \"서로 수직인 몇 개의 축을 따라 늘이거나 줄이기\"다. 데이터의 공분산 행렬, 곡면의 휘어짐…"
prev_url: "/studies/linear-algebra/recurrence-matrix-bridge/"
prev_title: "선형 점화식 ↔ 행렬 거듭제곱"
next_url: "/studies/linear-algebra/positive-definite/"
next_title: "양의 정부호 행렬과 이차형식"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/spectral-theorem/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

대각선을 기준으로 접으면 겹치는 행렬(대칭행렬)은 가장 다루기 좋은 행렬이다. 고윳값이 모두 실수이고, 서로 수직인 고유벡터들로 공간 전체를 덮을 수 있다. 그래서 대칭행렬이 하는 일은 늘 "서로 수직인 몇 개의 축을 따라 늘이거나 줄이기"다. 데이터의 공분산 행렬, 곡면의 휘어짐(헤세 행렬), 그래프 라플라시안이 모두 대칭이라 이 정리가 곳곳에 쓰인다. 대칭이 아니면 고유벡터가 기울어지거나 고윳값이 복소수가 될 수 있다.

</div>


## 예시로 보기

$$S = \begin{pmatrix}2 & 1\\ 1 & 2\end{pmatrix}$$는 대칭이다. 고윳값은 3과 1, 고유벡터는 $$(1, 1)$$과 $$(1, -1)$$로 서로 수직이다. 길이 1로 맞춘 $$\mathbf{q}_1 = \frac{1}{\sqrt2}(1, 1)$$, $$\mathbf{q}_2 = \frac{1}{\sqrt2}(1, -1)$$을 쓰면

$$S = 3\,\mathbf{q}_1\mathbf{q}_1^\top + 1\,\mathbf{q}_2\mathbf{q}_2^\top = \frac32\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix} + \frac12\begin{pmatrix}1 & -1\\ -1 & 1\end{pmatrix}.$$

단위원을 $$S$$로 보내면 $$(1, 1)$$ 방향으로 3배, $$(1, -1)$$ 방향으로 1배 늘어난 타원이 된다. 두 축이 수직인 것이 대칭의 선물이다. 반면 대칭이 아닌 $$\begin{pmatrix}1 & 1\\ 0 & 2\end{pmatrix}$$의 고유벡터 $$(1, 0)$$과 $$(1, 1)$$은 45°로 기울어져 있다. $$\mathbf{q}$$들을 열로 세운 것이 아래 정리의 $$Q$$다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">스펙트럼 정리</div>

실수 대칭행렬 $$S = S^\top$$($$n \times n$$)에 대해
1. 모든 고윳값이 실수다.
2. 서로 다른 고윳값의 고유벡터는 서로 수직이다.
3. 정규직교 고유벡터 $$n$$개가 있어 $$S = Q\Lambda Q^\top$$($$Q^\top Q = I$$)로 대각화된다. 곧 $$S = \lambda_1\mathbf{q}_1\mathbf{q}_1^\top + \cdots + \lambda_n\mathbf{q}_n\mathbf{q}_n^\top$$(스펙트럼 분해)[^1].

</div>


**역.** 실수 행렬 $$A$$가 $$A = Q\Lambda Q^\top$$($$Q$$ 직교, $$\Lambda$$ 실수 대각)로 쓰이면 $$A^\top = Q\Lambda^\top Q^\top = A$$라 대칭이다. 그래서 실수 행렬에서 "직교하는 고유벡터로 대각화된다" $$\iff$$ "대칭"이다.

**가정 목록.** 실수 성분, 그리고 $$S^\top = S$$. 복소수 행렬에서는 대칭 대신 켤레 전치와 같다는 조건(에르미트)이 같은 역할을 한다.

스펙트럼 분해의 각 항 $$\mathbf{q}_i\mathbf{q}_i^\top$$은 $$\mathbf{q}_i$$ 방향으로의 [사영 행렬](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)이다. 대칭행렬은 "서로 수직인 방향들로 사영한 뒤 각각 $$\lambda_i$$배 해서 더하는 것"이다.

## 증명

실수 고윳값과 수직성은 짧게 보이고, 겹치는 고윳값까지 포함한 대각화는 스케치한다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**1. 실수 고윳값.** $$S\mathbf{x} = \lambda\mathbf{x}$$($$\mathbf{x}$$는 복소수일 수 있음)라 하자. 켤레를 $$\bar{\ }$$로 쓴다.
- $$\bar{\mathbf{x}}^\top S\mathbf{x} = \lambda\,\bar{\mathbf{x}}^\top\mathbf{x}$$이고 $$\bar{\mathbf{x}}^\top\mathbf{x} = \sum\vert x_i\vert ^2 > 0$$은 실수다.
- 좌변의 켤레는 $$\mathbf{x}^\top S\bar{\mathbf{x}}$$($$S$$가 실수)이고, 이것은 $$1 \times 1$$이라 전치해도 같아 $$\bar{\mathbf{x}}^\top S^\top\mathbf{x} = \bar{\mathbf{x}}^\top S\mathbf{x}$$다. 켤레가 자기 자신이므로 좌변은 실수다.
- 그래서 $$\lambda = \frac{\bar{\mathbf{x}}^\top S\mathbf{x}}{\bar{\mathbf{x}}^\top\mathbf{x}}$$는 실수다.

**2. 수직.** $$S\mathbf{x}_1 = \lambda_1\mathbf{x}_1$$, $$S\mathbf{x}_2 = \lambda_2\mathbf{x}_2$$, $$\lambda_1 \ne \lambda_2$$라 하자.
- $$\lambda_1\mathbf{x}_1^\top\mathbf{x}_2 = (S\mathbf{x}_1)^\top\mathbf{x}_2 = \mathbf{x}_1^\top S^\top\mathbf{x}_2 = \mathbf{x}_1^\top S\mathbf{x}_2 = \lambda_2\mathbf{x}_1^\top\mathbf{x}_2$$.
- 빼면 $$(\lambda_1 - \lambda_2)\mathbf{x}_1^\top\mathbf{x}_2 = 0$$이고, $$\lambda_1 \ne \lambda_2$$라 $$\mathbf{x}_1^\top\mathbf{x}_2 = 0$$.

**3. 대각화 [증명 스케치].** 모든 정사각 행렬은 직교 행렬 $$Q$$로 $$S = QTQ^\top$$($$T$$ 위삼각, 슈어 분해)로 쓸 수 있다. $$S$$가 대칭이면 $$T = Q^\top SQ$$도 대칭인데, 대칭인 위삼각행렬은 대각행렬뿐이다. 그래서 $$T = \Lambda$$. 겹치는 고윳값이 있어도 맞는다[^1]. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 2단계에서 $$(S\mathbf{x}_1)^\top\mathbf{x}_2 = \mathbf{x}_1^\top S\mathbf{x}_2$$가 되려면 무엇이 필요한가?</summary>

$$(S\mathbf{x}_1)^\top = \mathbf{x}_1^\top S^\top$$이고, 여기서 $$S^\top = S$$(대칭)을 써야 $$\mathbf{x}_1^\top S\mathbf{x}_2$$가 된다. 대칭이 아니면 이 단계에서 막힌다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 3단계에서 "대칭인 위삼각행렬은 대각"인 이유는?</summary>

위삼각이라 대각 아래가 0이고, 대칭이라 대각 위는 아래를 비춘 값이니 역시 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정리의 핵심 아이디어는?</summary>

"$$\mathbf{x}^\top S\mathbf{y} = \mathbf{y}^\top S\mathbf{x}$$"(대칭성)를 고유벡터에 대입하면, 고윳값이 실수여야 하고 서로 다른 고유 방향은 수직이어야 한다는 결론이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

푸리에 급수의 사인·코사인들이 서로 직교하는 이유도 같다. 두 번 미분하는 연산(대칭인 "행렬")의 서로 다른 고윳값에 대한 고유함수이기 때문이다([푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/)).

</details>


## 가정이 필요한 이유

| 가정 | 없으면 | 예 |
|---|---|---|
| 대칭 $$S^\top = S$$ | 고유벡터가 수직이 아닐 수 있다 | $$\begin{pmatrix}1 & 1\\ 0 & 2\end{pmatrix}$$: 고유벡터 $$(1, 0)$$, $$(1, 1)$$, 내적 1 |
| 대칭 | 고윳값이 실수가 아닐 수 있다 | 90° 회전 $$\begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}$$: 고윳값 $$\pm i$$ |
| 대칭 | 대각화 자체가 안 될 수 있다 | $$\begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$ |

## 예제

**그래프 라플라시안.** 그래프에서 $$L = D - A$$($$D$$는 차수의 대각행렬, $$A$$는 [인접 행렬](/Hongs_Blog/studies/discrete-math/graph-basics/))는 대칭이다.

1. *대칭:* $$A$$가 대칭이고 $$D$$는 대각이라 $$L$$도 대칭이다. 스펙트럼 정리로 실수 고윳값과 직교 고유벡터를 가진다.
2. *이차형식:* $$\mathbf{x}^\top L\mathbf{x} = \sum_{\{i, j\} \in E}(x_i - x_j)^2 \ge 0$$($$\in$$은 "~에 속한다")이라 고윳값이 모두 0 이상이다.
3. *고윳값 0:* $$\mathbf{x}^\top L\mathbf{x} = 0$$이려면 모든 간선의 양 끝 값이 같아야 한다. 곧 [연결 성분](/Hongs_Blog/studies/discrete-math/connectivity/)마다 상수인 벡터다. 그래서 고윳값 0의 개수(고유공간의 차원)가 연결 성분의 수다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 분해와 비대칭 예의 기울어진 고유벡터, 무작위 대칭 행렬(야코비 방법)에서 $$Q^\top Q = I$$와 $$Q\Lambda Q^\top = S$$, 서로 다른 고윳값의 고유벡터 수직, 스펙트럼 분해의 각 항이 사영 행렬, 가정별 반례, 라플라시안의 이차형식과 "영공간의 차원 = 연결 성분 수"(무작위 그래프, 유리수 랭크) — [22_spectral-theorem_verify.py](/Hongs_Blog/studies/linear-algebra/code/22_spectral-theorem_verify/)</div>

</div>


## 활용

- **주성분 분석.** 데이터의 공분산 행렬은 대칭이라 직교하는 주축과 분산(고윳값)으로 분해된다. 고윳값이 큰 축 몇 개로 데이터를 요약한다([특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/)).
- **스펙트럼 군집화.** 그래프 라플라시안의 작은 고윳값에 대한 고유벡터로 정점을 좌표화해 무리를 나눈다[^s1].
- **최적화.** 헤세 행렬은 대칭이라 고윳값의 부호로 극소·극대·안장점을 가린다([양의 정부호](/Hongs_Blog/studies/linear-algebra/positive-definite/)).
- 알고리즘에서: 연결 성분의 수만 필요하면 고윳값을 구하지 않고 [깊이 우선 탐색(DFS)](/Hongs_Blog/studies/algorithms/dfs/)으로 $$O(\vert V\vert  + \vert E\vert )$$에 센다. DFS가 찾은 덩어리마다 그 점들에서만 1이고 나머지는 0인 벡터가 곧 라플라시안 $$L$$의 고윳값 0에 대한 고유벡터다.

## 연결

- 선수: [대각화와 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/diagonalization/), [정규직교 기저](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/)
- 이어지는 개념: [양의 정부호 행렬과 이차형식](/Hongs_Blog/studies/linear-algebra/positive-definite/), [특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/)
- 이산수학과의 연결: [연결 성분](/Hongs_Blog/studies/discrete-math/connectivity/)의 수 = 라플라시안의 고윳값 0의 개수

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"서로 다른 고윳값의 고유벡터는 늘 수직이다"</div>

틀렸다. 대칭행렬에서 배운 성질이라 모든 행렬에 맞는다고 기억하기 쉽다. 서로 다른 고윳값의 고유벡터는 늘 **독립**이지만, **수직**은 대칭일 때만 보장된다. $$\begin{pmatrix}1 & 1\\ 0 & 2\end{pmatrix}$$의 고유벡터 $$(1, 0)$$(고윳값 1)과 $$(1, 1)$$(고윳값 2)은 45°를 이룬다. 증명에서 $$S^\top = S$$를 쓰는 단계가 빠지면 결론도 무너진다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 스펙트럼 정리를 쓰라.</summary>

**답:** 실수 대칭행렬 $$S$$는 고윳값이 모두 실수이고, 정규직교 고유벡터로 $$S = Q\Lambda Q^\top$$($$Q^\top Q = I$$)로 대각화된다. 곧 $$S = \sum\lambda_i\mathbf{q}_i\mathbf{q}_i^\top$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$S = \begin{pmatrix}3 & 1\\ 1 & 3\end{pmatrix}$$을 $$Q\Lambda Q^\top$$로 분해하라.</summary>

**답:** 고윳값 4($$(1, 1)$$), 2($$(1, -1)$$). $$Q = \frac{1}{\sqrt2}\begin{pmatrix}1 & 1\\ 1 & -1\end{pmatrix}$$, $$\Lambda = \operatorname{diag}(4, 2)$$. 확인: $$4 \cdot \frac12\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix} + 2 \cdot \frac12\begin{pmatrix}1 & -1\\ -1 & 1\end{pmatrix} = S$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 대칭행렬에서 서로 다른 고윳값의 고유벡터가 수직인 증명의 핵심 등식과 그 근거는?</summary>

**답:** $$\lambda_1\mathbf{x}_1^\top\mathbf{x}_2 = (S\mathbf{x}_1)^\top\mathbf{x}_2 = \mathbf{x}_1^\top S\mathbf{x}_2 = \lambda_2\mathbf{x}_1^\top\mathbf{x}_2$$. 가운데 등호가 $$S^\top = S$$에서 나온다. 빼면 $$(\lambda_1 - \lambda_2)\mathbf{x}_1^\top\mathbf{x}_2 = 0$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 서로 다른 고윳값의 고유벡터가 수직이 아닌 행렬을 들라.</summary>

**답:** $$\begin{pmatrix}1 & 1\\ 0 & 2\end{pmatrix}$$. 고유벡터 $$(1, 0)$$과 $$(1, 1)$$의 내적은 1이다. 대칭이 아니다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 6.4절 "Symmetric Matrices"(실수 고윳값, 직교 고유벡터, $$S = Q\Lambda Q^\top$$, 슈어 분해로 한 증명, 스펙트럼 분해).
[^s1]: 에이전트 보충. 스펙트럼 군집화는 von Luxburg, "A tutorial on spectral clustering"(*Statistics and Computing*, 2007)에 정리되어 있다. 라플라시안의 영공간 차원과 연결 성분 수의 관계는 22_spectral-theorem_verify.py에서 무작위 그래프로 확인했다.
{% endraw %}
