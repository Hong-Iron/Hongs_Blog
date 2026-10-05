---
layout: "note"
title: "행렬 곱셈과 전치"
display_title: "행렬 곱셈과 전치 (Matrix Multiplication and Transpose)"
kind: "concept"
kind_label: "정의"
num: "06"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Matrix Multiplication", "행렬 곱셈", "행렬곱", "Transpose", "전치", "전치행렬", "대칭행렬", "symmetric matrix", "합성", "composition", "교환법칙", "결합법칙"]
description: "두 행렬의 곱은 \"먼저 오른쪽 행렬로 바꾸고, 이어서 왼쪽 행렬로 바꾸는\" 두 변환을 하나로 합친 행렬이다. 그래서 여러 단계의 좌표 변환이나 신경망의 층들을 행렬 하나로 미리 합칠 수 있다. 합성이라 순서가 중요해서, 곱하는 순서를 바꾸면 보통 결과가 달라진다. 곱하는 순서를 괄…"
prev_url: "/studies/linear-algebra/gaussian-elimination/"
prev_title: "가우스 소거법"
next_url: "/studies/linear-algebra/inverse-matrix/"
next_title: "역행렬"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/matrix-multiplication/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

두 행렬의 곱은 "먼저 오른쪽 행렬로 바꾸고, 이어서 왼쪽 행렬로 바꾸는" 두 변환을 하나로 합친 행렬이다. 그래서 여러 단계의 좌표 변환이나 신경망의 층들을 행렬 하나로 미리 합칠 수 있다. 합성이라 순서가 중요해서, 곱하는 순서를 바꾸면 보통 결과가 달라진다. 곱하는 순서를 괄호로 어떻게 묶느냐에 따라 계산량이 수백 배 달라지기도 한다. 행과 열을 맞바꾼 전치는 곱의 순서를 뒤집는다.

</div>


## 예시로 보기

평면에서 $$R$$은 90° 회전, $$S$$는 가로로 두 배 늘이기다.

$$R = \begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}, \quad S = \begin{pmatrix}2 & 0\\ 0 & 1\end{pmatrix}$$

점 $$(1, 0)$$에 "회전 뒤 늘이기"를 하면 $$R(1, 0) = (0, 1)$$, 이어서 $$S(0, 1) = (0, 1)$$이다. "늘이기 뒤 회전"은 $$S(1, 0) = (2, 0)$$, 이어서 $$R(2, 0) = (0, 2)$$이다. 결과가 다르다. 두 과정을 하나로 합친 행렬은 각각

$$SR = \begin{pmatrix}0 & -2\\ 1 & 0\end{pmatrix}, \qquad RS = \begin{pmatrix}0 & -1\\ 2 & 0\end{pmatrix}$$

이다. $$SR$$이 "먼저 $$R$$, 다음 $$S$$"다. 오른쪽 행렬이 벡터에 먼저 작용한다. $$R$$과 $$S$$가 아래 정의의 $$B$$와 $$A$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$A \in \mathbb{R}^{m \times n}$$, $$B \in \mathbb{R}^{n \times p}$$일 때 $$AB \in \mathbb{R}^{m \times p}$$는 모든 $$\mathbf{x}$$에서 $$(AB)\mathbf{x} = A(B\mathbf{x})$$가 되도록 정한 행렬이다. 성분으로는

$$(AB)_{ij} = \sum_{k=1}^{n} a_{ik}b_{kj} = (A\text{의 } i\text{행}) \cdot (B\text{의 } j\text{열}).$$

$$A$$의 열 수와 $$B$$의 행 수가 같아야 한다[^1].

</div>


$$AB$$의 $$j$$번째 열은 $$A$$에 $$B$$의 $$j$$번째 열을 곱한 것이다. $$(AB)\mathbf{e}_j = A(B\mathbf{e}_j)$$이기 때문이다. 이것이 성분 공식의 근거다.

**성질.** 결합법칙 $$(AB)C = A(BC)$$, 분배법칙 $$A(B + C) = AB + AC$$, 단위행렬 $$AI = IA = A$$가 성립한다. **교환법칙은 성립하지 않는다.** 결합법칙은 변환의 합성이 결합적이라는 사실([함수의 합성](/Hongs_Blog/studies/college-math/function-transformation/))에서 나온다.

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">전치</div>

$$A^\top$$는 $$A$$의 행과 열을 맞바꾼 행렬이다: $$(A^\top)_{ij} = a_{ji}$$. $$A^\top = A$$인 정사각 행렬을 **대칭행렬**이라 한다.

</div>


내적은 $$\mathbf{u}\cdot\mathbf{v} = \mathbf{u}^\top\mathbf{v}$$($$1 \times n$$ 곱하기 $$n \times 1$$)이고, $$(AB)^\top = B^\top A^\top$$이다. 어떤 $$A$$든 $$A^\top A$$는 대칭이다($$(A^\top A)^\top = A^\top(A^\top)^\top = A^\top A$$).

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">$$(AB)^\top = B^\top A^\top$$의 증명</summary>

$$\big((AB)^\top\big)_{ij} = (AB)_{ji} = \sum_k a_{jk}b_{ki} = \sum_k (B^\top)_{ik}(A^\top)_{kj} = (B^\top A^\top)_{ij}$$. 곱의 순서가 뒤집혀야 인덱스가 맞는다. ∎

</details>


## 예제

**괄호 위치가 비용을 바꾼다.** $$n \times n$$ 행렬 $$A$$, $$B$$와 벡터 $$\mathbf{x}$$로 $$AB\mathbf{x}$$를 계산한다.

1. *$$(AB)\mathbf{x}$$:* 행렬 곱에 곱셈 $$n^3$$번, 이어서 행렬-벡터 곱 $$n^2$$번.
2. *$$A(B\mathbf{x})$$:* 행렬-벡터 곱 두 번, $$2n^2$$번.
3. *차이:* $$n = 1000$$이면 약 $$10^9$$번 대 $$2 \times 10^6$$번으로 500배 차이다. 결과는 결합법칙으로 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 $$SR$$, $$RS$$와 점의 이동, 정의 $$(AB)\mathbf{x} = A(B\mathbf{x})$$(무작위 1,000개, 유리수), $$AB$$의 열 = $$A \times$$ ($$B$$의 열), 결합·분배법칙, 교환법칙의 반례 비율, $$(AB)^\top = B^\top A^\top$$, $$A^\top A$$의 대칭성, 곱셈 횟수, 카드의 값 — [06_matrix-multiplication_verify.py](/Hongs_Blog/studies/linear-algebra/code/06_matrix-multiplication_verify/)</div>

</div>


## 활용

- **변환 파이프라인.** 그래픽스는 모델 → 월드 → 카메라 → 화면 변환을 행렬 곱 하나로 합쳐 두고, 수백만 개의 꼭짓점에 한 번씩만 곱한다.
- **신경망.** 활성 함수 없이 층을 쌓으면 $$W_2(W_1\mathbf{x}) = (W_2W_1)\mathbf{x}$$라 한 층과 같다. 층 사이의 비선형 함수가 꼭 필요한 이유다([뉴런의 연산 모형](/Hongs_Blog/studies/human-interface-media/neuron-computational-model/)).
- **비용과 알고리즘.** 곱셈을 그대로 하면 $$n^3$$번이다. 분할 정복으로 $$7T(n/2) + O(n^2)$$를 만든 슈트라센 방법은 $$O(n^{2.81})$$이다([마스터 정리](/Hongs_Blog/studies/discrete-math/master-theorem/)). 여러 행렬을 곱할 때 괄호 순서를 고르는 것은 동적 계획법의 대표 문제다.
- **흔한 실수.** 코드에서 `A * B`(NumPy의 성분별 곱)와 `A @ B`(행렬 곱)를 혼동하는 것.
- 알고리즘에서: 위의 괄호 순서 고르기는 마지막 곱셈의 자리를 모두 따지는 [구간 DP](/Hongs_Blog/studies/algorithms/interval-dp/)로 풀고, 행렬이 $$k$$개면 $$O(k^3)$$이다. 더하기를 min으로, 곱하기를 +로 바꾼 곱은 가운데 점 하나를 거치는 가장 싼 길을 주고, [플로이드–워셜](/Hongs_Blog/studies/algorithms/floyd-warshall/)은 이 곱을 되풀이하는 대신 같은 연산으로 거쳐도 되는 점을 하나씩 늘려 정점 $$n$$개의 모든 쌍 최단 거리를 $$O(n^3)$$에 구한다. 파이썬 2차원 리스트의 전치는 `[list(row) for row in zip(*a)]`이고, 위아래를 먼저 뒤집고 전치하면 격자가 시계 방향으로 90도 돈다([구현과 시뮬레이션](/Hongs_Blog/studies/algorithms/simulation/)). 그 밖에 [자물쇠와 열쇠](/Hongs_Blog/studies/algorithms/pg60059/)에서도 쓴다.

## 연결

- 선수: [행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/)
- 같은 구조: [함수의 합성](/Hongs_Blog/studies/college-math/function-transformation/)(교환되지 않는 합성)
- 이어지는 개념: [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/), [LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$A = \begin{pmatrix}1 & 2\\ 3 & 4\end{pmatrix}$$, $$B = \begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}$$일 때 $$AB$$와 $$BA$$를 구하라.</summary>

**답:** $$AB = \begin{pmatrix}2 & 1\\ 4 & 3\end{pmatrix}$$(열을 바꿈), $$BA = \begin{pmatrix}3 & 4\\ 1 & 2\end{pmatrix}$$(행을 바꿈). 서로 다르다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 두 정사각 행렬에서 $$AB = BA$$가 성립하지 않는 예를 들고, 변환으로 해석하라.</summary>

**답:** 90° 회전 $$R$$과 가로 두 배 늘이기 $$S$$. $$(1, 0)$$은 $$SR$$로 $$(0, 1)$$, $$RS$$로 $$(0, 2)$$에 간다. 늘인 뒤 돌리는 것과 돌린 뒤 늘이는 것은 다르다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$(AB)^\top = B^\top A^\top$$에서 순서가 뒤집히는 이유를 성분으로 설명하라.</summary>

**답:** $$(AB)^\top$$의 $$(i, j)$$ 성분은 $$(AB)_{ji} = \sum_k a_{jk}b_{ki}$$이다. 이것을 $$\sum_k (B^\top)_{ik}(A^\top)_{kj}$$로 읽으면 $$B^\top$$의 $$i$$행과 $$A^\top$$의 $$j$$열의 내적, 곧 $$B^\top A^\top$$의 성분이다. 크기로 봐도 $$A^\top B^\top$$는 보통 곱이 정의되지 않는다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 2.4절 "Rules for Matrix Operations"(곱의 네 가지 보는 법, 결합법칙, 교환 불가), 2.7절 "Transposes and Permutations"($$(AB)^\top = B^\top A^\top$$, 대칭행렬, $$A^\top A$$).
{% endraw %}
