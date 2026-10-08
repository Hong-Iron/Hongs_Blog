---
layout: "note"
title: "LU 분해"
display_title: "LU 분해 (LU Decomposition)"
kind: "concept"
kind_label: "알고리즘"
num: "08"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-09-25"
status: "verified"
aliases: ["LU Decomposition", "LU 분해", "LU factorization", "PA = LU", "아래삼각행렬", "lower triangular", "위삼각행렬", "upper triangular", "전진 대입", "forward substitution", "순열 행렬", "permutation matrix"]
description: "가우스 소거를 할 때 \"몇 배를 뺐는지\"(곱수)를 버리지 않고 아래쪽 삼각 모양의 행렬에 적어 두면, 원래 행렬이 그 행렬과 소거 결과(위쪽 삼각 모양)의 곱으로 쪼개진다. 한 번 쪼개 두면 방정식의 우변이 바뀔 때마다 비싼 소거를 다시 하지 않고, 삼각행렬 두 개로 빠르게 푼다.…"
prev_url: "/studies/linear-algebra/inverse-matrix/"
prev_title: "역행렬"
next_url: "/studies/linear-algebra/linear-independence/"
next_title: "선형독립"
math: true
mermaid: false
code_count: 2
permalink: "/studies/linear-algebra/lu-decomposition/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

가우스 소거를 할 때 "몇 배를 뺐는지"(곱수)를 버리지 않고 아래쪽 삼각 모양의 행렬에 적어 두면, 원래 행렬이 그 행렬과 소거 결과(위쪽 삼각 모양)의 곱으로 쪼개진다. 한 번 쪼개 두면 방정식의 우변이 바뀔 때마다 비싼 소거를 다시 하지 않고, 삼각행렬 두 개로 빠르게 푼다. 같은 회로에 입력만 바꿔 여러 번 시뮬레이션하는 경우처럼 반복 풀이가 많을 때 특히 이득이다. 다만 피벗 자리에 0이 오면 행을 바꿔야 해서, 일반적으로는 행 순서를 바꾸는 행렬까지 붙은 꼴이 된다.

</div>


## 예시로 보기

[가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)의 예 $$A = \begin{pmatrix}1 & 2 & 1\\ 3 & 8 & 1\\ 0 & 4 & 1\end{pmatrix}$$을 소거할 때 곱수는 $$\ell_{21} = 3$$(2행 − 3 × 1행), $$\ell_{31} = 0$$, $$\ell_{32} = 2$$(3행 − 2 × 2행)였다. 곱수를 제자리에 적으면

$$L = \begin{pmatrix}1 & 0 & 0\\ 3 & 1 & 0\\ 0 & 2 & 1\end{pmatrix}, \qquad U = \begin{pmatrix}1 & 2 & 1\\ 0 & 2 & -2\\ 0 & 0 & 5\end{pmatrix}, \qquad LU = A.$$

$$\mathbf{b} = (2, 12, 2)$$를 풀 때는 먼저 $$L\mathbf{c} = \mathbf{b}$$에서 위부터 $$c_1 = 2$$, $$c_2 = 12 - 3 \cdot 2 = 6$$, $$c_3 = 2 - 0 - 2 \cdot 6 = -10$$을 얻는다. 이것은 소거가 $$\mathbf{b}$$에 한 일과 같다. 이어서 $$U\mathbf{x} = \mathbf{c}$$를 아래부터 풀면 $$\mathbf{x} = (2, 1, -2)$$다. 곱수가 아래 정의의 $$L$$의 성분이다.

## 정의

**입력:** $$n \times n$$ 행렬 $$A$$. **출력:** 순열 $$P$$, 대각이 1인 아래삼각행렬 $$L$$, 위삼각행렬 $$U$$로 $$PA = LU$$.

```
LU(A)                               # 인덱스 1부터
  U ← A, L ← 0, P ← I
  for k = 1 to n
      p ← k..n 중 |U[i][k]|가 가장 큰 행        # 부분 피벗팅
      U, P, 그리고 L의 1..k−1열에서 k행과 p행을 바꾼다
      for i = k+1 to n
          L[i][k] ← U[i][k] / U[k][k]          # 곱수를 기록
          U[i] ← U[i] − L[i][k]·U[k]
  L의 대각을 1로
  return P, L, U

SOLVE(P, L, U, b)
  L c = P b 를 위에서부터 (전진 대입)
  U x = c   를 아래에서부터 (후진 대입)
```

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">곱수가 그대로 $$L$$이 된다</div>

행 바꾸기가 필요 없으면(피벗이 모두 0이 아니면) $$A = LU$$이고, $$L$$의 $$(i, k)$$ 성분은 소거에서 쓴 곱수 $$\ell_{ik}$$이다[^1].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 스케치</summary>

1. *소거 = 기본 행렬 곱:* "$$i$$행 $$- \ell_{ik} \times k$$행"은 단위행렬의 $$(i, k)$$ 자리에 $$-\ell_{ik}$$를 넣은 $$E_{ik}$$를 왼쪽에 곱하는 것이다. 소거 전체는 $$(\cdots E_{32}E_{31}E_{21})A = U$$다.
2. *되돌리기:* $$E_{ik}^{-1}$$은 같은 자리에 $$+\ell_{ik}$$를 넣은 행렬이다(빼기를 되돌리는 더하기). 그래서 $$A = (E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}\cdots)U$$.
3. *곱수가 섞이지 않는다:* 역행렬들을 이 순서로 곱하면 각 $$\ell_{ik}$$가 서로 곱해지지 않고 제자리에 그대로 놓인다. 뒤쪽 행렬의 1이 아닌 성분은 앞쪽 행렬의 1이 아닌 성분과 만나지 않기 때문이다. 그 곱이 $$L$$이다. ∎

</details>


**비용.** 분해는 소거와 같은 약 $$\frac23 n^3$$번의 연산이다. 한 번의 풀이(전진 + 후진 대입)는 약 $$2n^2$$번이다. 같은 $$A$$로 우변 $$k$$개를 풀면 $$\frac23 n^3 + 2kn^2$$번이라, 매번 소거하는 $$k \cdot \frac23 n^3$$보다 훨씬 싸다.

## 예제

**행 바꾸기가 필요한 경우.** $$A = \begin{pmatrix}0 & 1\\ 1 & 1\end{pmatrix}$$은 첫 피벗 자리가 0이라 $$A = LU$$로 쓸 수 없다.

1. *피벗 찾기:* 첫 열에서 0이 아닌 수가 있는 2행을 올린다. $$P = \begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}$$.
2. *분해:* $$PA = \begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$이 이미 위삼각이라 $$L = I$$, $$U = PA$$.
3. *풀이:* $$\mathbf{b} = (1, 3)$$이면 $$P\mathbf{b} = (3, 1)$$. $$L\mathbf{c} = (3, 1)$$에서 $$\mathbf{c} = (3, 1)$$, $$U\mathbf{x} = \mathbf{c}$$에서 $$y = 1$$, $$x = 2$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 $$L$$, $$U$$, $$\mathbf{c} = (2, 6, -10)$$, $$\mathbf{x} = (2, 1, -2)$$, 행 바꾸기 예제, 무작위 행렬 200개에서 $$PA = LU$$와 곱수 크기 1 이하, 풀이의 잔차, 우변이 여러 개일 때 연산 수 비교, 카드의 값 — [08_lu-decomposition_impl.py](/Hongs_Blog/studies/linear-algebra/code/08_lu-decomposition_impl/), [08_lu-decomposition_verify.py](/Hongs_Blog/studies/linear-algebra/code/08_lu-decomposition_verify/)</div>

</div>


## 활용

- **라이브러리.** LAPACK의 `getrf`(부분 피벗팅 LU)와 `getrs`(풀이)가 표준이고, SciPy의 `scipy.linalg.lu_factor`, `lu_solve`가 이것을 부른다[^s1]. `numpy.linalg.solve`도 내부에서 LU를 쓴다.
- **반복 풀이.** 회로 시뮬레이션, 유한요소 해석, 뉴턴 방법의 반복처럼 같은(또는 거의 같은) 행렬로 여러 번 푸는 곳.
- **행렬식.** $$\det A = \pm u_{11}u_{22}\cdots u_{nn}$$($$\pm$$는 행 바꾼 횟수의 홀짝)라, 행렬식도 분해의 부산물로 $$O(n^3)$$에 얻는다([행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)).

## 연결

- 선수: [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)(기본 행렬과 그 역)
- 같은 과정: [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)
- 이어지는 개념: [QR 분해](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/), [고윳값 분해](/Hongs_Blog/studies/linear-algebra/diagonalization/), [특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/). 무엇을 풀려는지에 따라 분해를 고른다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$A = \begin{pmatrix}2 & 1\\ 6 & 8\end{pmatrix}$$를 $$LU$$로 분해하라(행 바꾸기 없이).</summary>

**답:** 곱수 $$\ell_{21} = 6/2 = 3$$. 2행 $$-$$ 3 × 1행 $$= (0, 5)$$. $$L = \begin{pmatrix}1 & 0\\ 3 & 1\end{pmatrix}$$, $$U = \begin{pmatrix}2 & 1\\ 0 & 5\end{pmatrix}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 아래 코드가 하는 일을 쉬운 말로 설명하라. `L`은 대각이 1인 아래삼각행렬이다.</summary>

```python
for i in range(n):
    c[i] = b[i] - sum(L[i][j] * c[j] for j in range(i))
```
**답:** $$L\mathbf{c} = \mathbf{b}$$를 위에서부터 푸는 전진 대입이다. 이미 구한 $$c_0, \dots, c_{i-1}$$에 곱수를 곱해 빼면 $$c_i$$가 나온다. 소거가 우변 $$\mathbf{b}$$에 했던 일을 다시 하는 것과 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 같은 $$A$$로 우변 100개를 풀 때 LU 분해를 먼저 해 두는 것이 유리한 이유를 연산 수로 설명하라.</summary>

**답:** 분해는 한 번 $$\frac23 n^3$$, 풀이는 한 번에 $$2n^2$$이라 합이 $$\frac23 n^3 + 200n^2$$이다. 매번 소거하면 $$100 \times \frac23 n^3$$이다. $$n = 1000$$이면 약 77배, $$n$$이 더 커지면 100배에 가까워진다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 2.6절 "Elimination = Factorization: A = LU"(곱수가 $$L$$에 그대로 놓이는 이유, 연산 수), 2.7절 "Transposes and Permutations"($$PA = LU$$).
[^s1]: 에이전트 보충. SciPy 문서는 `lu_factor`가 LAPACK `getrf`를 쓴다고 밝힌다. 행렬식과 $$U$$의 대각 원소 곱의 관계는 08_lu-decomposition_verify.py에서 확인했다.
{% endraw %}
