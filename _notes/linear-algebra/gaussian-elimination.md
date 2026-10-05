---
layout: "note"
title: "가우스 소거법"
display_title: "가우스 소거법 (Gaussian Elimination)"
kind: "concept"
kind_label: "알고리즘"
num: "05"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
updated: "2026-10-02"
status: "verified"
aliases: ["Gaussian Elimination", "가우스 소거법", "소거법", "elimination", "행 연산", "elementary row operation", "기본 행 연산", "피벗", "pivot", "부분 피벗팅", "partial pivoting", "후진 대입", "back substitution", "행 사다리꼴", "row echelon form", "기약 행 사다리꼴", "RREF", "첨가행렬", "augmented matrix", "자유변수", "free variable"]
description: "연립방정식에서 한 식의 몇 배를 다른 식에서 빼 미지수를 하나씩 지워 나가, 맨 아래 식에 미지수가 하나만 남는 계단 모양을 만든다. 그다음 아래에서부터 거꾸로 대입하면 답이 나온다. 중학교에서 배운 가감법을 식이 수천 개여도 똑같이 기계적으로 할 수 있게 정리한 것이고, 계단 모…"
prev_url: "/studies/linear-algebra/matrix-vector/"
prev_title: "행렬과 행렬-벡터 곱"
next_url: "/studies/linear-algebra/matrix-multiplication/"
next_title: "행렬 곱셈과 전치"
math: true
mermaid: false
code_count: 2
permalink: "/studies/linear-algebra/gaussian-elimination/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

연립방정식에서 한 식의 몇 배를 다른 식에서 빼 미지수를 하나씩 지워 나가, 맨 아래 식에 미지수가 하나만 남는 계단 모양을 만든다. 그다음 아래에서부터 거꾸로 대입하면 답이 나온다. 중학교에서 배운 가감법을 식이 수천 개여도 똑같이 기계적으로 할 수 있게 정리한 것이고, 계단 모양을 보면 해가 하나인지, 없는지, 무한히 많은지도 바로 알 수 있다. 다만 컴퓨터로 할 때 아주 작은 수로 나누면 반올림 오차가 폭발하므로, 절댓값이 큰 수를 피벗으로 고르는 부분 피벗팅이 필요하다.

</div>


## 예시로 보기

$$x + 2y + z = 2$$, $$3x + 8y + z = 12$$, $$4y + z = 2$$를 푼다. 계수와 우변을 한 표(첨가행렬)로 쓴다.

| 단계 | 한 일 | 첨가행렬 $$[A \mid \mathbf{b}]$$ |
|---|---|---|
| 0 | 시작 | $$\left[\begin{smallmatrix}1 & 2 & 1 & \mid & 2\\ 3 & 8 & 1 & \mid & 12\\ 0 & 4 & 1 & \mid & 2\end{smallmatrix}\right]$$ |
| 1 | 2행 $$-$$ 3 × 1행 ($$x$$ 지우기) | $$\left[\begin{smallmatrix}1 & 2 & 1 & \mid & 2\\ 0 & 2 & -2 & \mid & 6\\ 0 & 4 & 1 & \mid & 2\end{smallmatrix}\right]$$ |
| 2 | 3행 $$-$$ 2 × 2행 ($$y$$ 지우기) | $$\left[\begin{smallmatrix}1 & 2 & 1 & \mid & 2\\ 0 & 2 & -2 & \mid & 6\\ 0 & 0 & 5 & \mid & -10\end{smallmatrix}\right]$$ |
| 3 | 후진 대입 | $$5z = -10 \Rightarrow z = -2$$, $$2y - 2z = 6 \Rightarrow y = 1$$, $$x + 2y + z = 2 \Rightarrow x = 2$$ |

대각선의 1, 2, 5가 아래 알고리즘의 **피벗**, 뺄 때 곱한 3과 2가 **곱수**다[^1].

## 정의

**입력:** $$n \times n$$ 행렬 $$A$$와 $$\mathbf{b} \in \mathbb{R}^n$$. **출력:** $$A\mathbf{x} = \mathbf{b}$$의 해 $$\mathbf{x}$$(해가 하나일 때).

```
GAUSS(A, b)                      # 첨가행렬 M = [A | b], 인덱스는 1부터
  for k = 1 to n                  # 전진 소거
      p ← k..n 중 |M[i][k]|가 가장 큰 행 i     # 부분 피벗팅
      M의 k행과 p행을 바꾼다
      if M[k][k] = 0: 특이 행렬(해가 하나가 아님)
      for i = k+1 to n
          ℓ ← M[i][k] / M[k][k]                # 곱수
          M[i] ← M[i] − ℓ·M[k]                 # 피벗 아래를 0으로
  for i = n downto 1              # 후진 대입
      x[i] ← (M[i][n+1] − Σ_{j>i} M[i][j]·x[j]) / M[i][i]
  return x
```

**기본 행 연산**은 세 가지다. (1) 한 행에 다른 행의 상수배를 더하기, (2) 두 행 바꾸기, (3) 한 행에 0이 아닌 수를 곱하기. 소거법은 이 연산만 쓴다.

**루프 불변식.** $$k$$번째 반복이 끝날 때 (I1) 현재 $$M$$이 나타내는 연립방정식은 원래 것과 해 집합이 같다. (I2) 1열부터 $$k$$열까지 피벗 아래는 모두 0이다.

**해의 종류.** 정사각이 아니거나 피벗이 모자라도 소거는 계속할 수 있다. 끝까지 줄인 계단 모양(행 사다리꼴)에서 판정한다.

| 계단 모양의 모습 | 해 |
|---|---|
| $$[0 \ \cdots \ 0 \mid c]$$ ($$c \ne 0$$)인 줄이 있다 | 없음 ($$0 = c$$는 모순) |
| 그런 줄이 없고, 모든 열에 피벗이 있다 | 하나 |
| 그런 줄이 없고, 피벗이 없는 열(자유변수)이 있다 | 무한히 많음(자유변수를 마음대로 정한다) |

## 증명

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**기본 행 연산은 해 집합을 바꾸지 않는다.**
1. *해가 그대로 해:* $$\mathbf{x}$$가 $$i$$행과 $$k$$행의 식을 만족하면 "$$i$$행 $$- \ell \times k$$행"의 식도 만족한다. 두 식의 좌변·우변에 같은 연산을 한 것이기 때문이다. 행 바꾸기와 0 아닌 수 곱하기도 마찬가지다.
2. *되돌릴 수 있다:* "$$i$$행 $$- \ell \times k$$행"은 "$$i$$행 $$+ \ell \times k$$행"으로, 행 바꾸기는 한 번 더 바꾸기로, $$c$$배는 $$\frac1c$$배로 되돌린다. 그래서 새 식의 해도 원래 식의 해다(1을 거꾸로 적용).

**불변식.** (I1)은 매 반복이 기본 행 연산만 쓰므로 위 결과로 유지된다. (I2)는 $$k$$번째 반복이 $$k$$열의 피벗 아래를 0으로 만들고, 앞 열들은 이미 0인 행들끼리의 연산이라 0이 유지된다.

**종료와 정확성.** $$k = n$$까지 돌면 위삼각꼴 $$U\mathbf{x} = \mathbf{c}$$가 남는다. 피벗이 모두 0이 아니면 마지막 식에서 $$x_n$$이 하나로 정해지고, 위로 올라가며 $$x_{n-1}, \dots, x_1$$이 차례로 하나씩 정해진다(후진 대입). (I1)로 이것이 원래 식의 유일한 해다.

**비용.** $$k$$번째 반복에서 $$(n - k)$$개 행의 $$(n - k + 1)$$개 원소를 갱신하므로 곱셈이 약 $$(n - k)^2$$번이다. $$\sum_{k=1}^{n}(n - k)^2 \approx \frac{n^3}{3}$$번의 곱셈과 같은 수의 뺄셈, 합쳐서 약 $$\frac{2}{3}n^3$$번의 연산이다. 후진 대입은 $$O(n^2)$$이다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 2단계의 "되돌릴 수 있다"가 없으면 무엇이 문제인가?</summary>

1단계만으로는 "원래 해 ⊆ 새 해"까지만 안다. 해가 새로 생길 수도 있다. 예를 들어 행에 0을 곱하면 식이 $$0 = 0$$이 되어 해가 늘어난다. 그래서 0을 곱하는 것은 기본 행 연산에서 빠져 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 비용이 $$n^3$$에 비례하는 이유를 한 문장으로 설명하라.</summary>

피벗이 $$n$$개이고, 피벗마다 그 아래 약 $$n$$개 행의 약 $$n$$개 원소를 고치므로 $$n \times n \times n$$이다. 정확히 세면 $$\sum (n - k)^2 \approx \frac{n^3}{3}$$이다([거듭제곱의 합](/Hongs_Blog/studies/discrete-math/sums-asymptotics/)).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 알고리즘의 핵심 아이디어는?</summary>

해를 바꾸지 않는 연산만 써서, 풀기 쉬운 모양(위삼각꼴)으로 바꾼다. 어려운 문제를 같은 답을 가진 쉬운 문제로 옮기는 전략이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

[유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/)은 최대공약수를 바꾸지 않는 연산(큰 수에서 작은 수 빼기)으로 수를 줄인다. 두 알고리즘 모두 연산을 기록하면 부산물(베주 계수, LU 분해)이 나온다.

</details>


## 예제

**피벗팅이 필요한 이유.** $$10^{-20}x + y = 1$$, $$x + y = 2$$. 참값은 $$x \approx 1$$, $$y \approx 1$$이다.

1. *피벗팅 없이:* 곱수 $$\ell = 10^{20}$$. 둘째 식은 $$(1 - 10^{20})y = 2 - 10^{20}$$이 되는데, 배정밀도에서는 둘 다 $$-10^{20}$$으로 반올림되어 $$y = 1$$이다. 첫째 식에서 $$x = \frac{1 - y}{10^{-20}} = 0$$. 틀렸다.
2. *부분 피벗팅:* $$x$$ 열에서 절댓값이 큰 1이 있는 둘째 식을 피벗으로 올린다. 곱수가 $$10^{-20}$$이라 오차가 커지지 않고 $$y = 1$$, $$x = 2 - y = 1$$.
3. *원인:* 작은 피벗으로 나누면 곱수가 거대해져 원래 계수 정보가 반올림으로 지워진다. 곱수의 크기를 1 이하로 묶는 것이 부분 피벗팅이다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 각 단계 행렬과 해 $$(2, 1, -2)$$, 무작위 정수 행렬 500개에서 유리수 소거의 해를 대입해 확인, 부동소수점 해와 비교, 해의 종류 판정(무작위 특이·비특이 행렬), 행 연산이 해 집합을 보존함(작은 정수 범위 전수), 피벗팅 예제, 연산 수가 $$\frac23 n^3$$에 가까움 — [05_gaussian-elimination_impl.py](/Hongs_Blog/studies/linear-algebra/code/05_gaussian-elimination_impl/), [05_gaussian-elimination_verify.py](/Hongs_Blog/studies/linear-algebra/code/05_gaussian-elimination_verify/)</div>

</div>


## 활용

- **선형 시스템 솔버.** NumPy의 `numpy.linalg.solve`는 LAPACK의 부분 피벗팅 LU 분해(가우스 소거를 기록한 것)를 쓴다[^s1]. 같은 $$A$$로 여러 $$\mathbf{b}$$를 풀면 [LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/)를 한 번 해 두고 재사용한다.
- **규모.** $$n = 1000$$이면 약 $$6.7 \times 10^8$$번의 연산이라 현대 CPU에서 1초 안이다. $$n = 10^5$$이면 $$10^{15}$$번을 넘어, 희소 행렬 전용 방법이나 반복법을 쓴다.
- **정확한 계산.** 정수·유리수 행렬은 분수로 정확히 소거할 수 있다. 암호·부호 이론에서는 $$\bmod p$$ 산술로 같은 소거를 한다.
- 연습: [가우스 소거 예제 사다리](/Hongs_Blog/studies/linear-algebra/elimination-ladder/)
- 알고리즘에서: [플로이드–워셜](/Hongs_Blog/studies/algorithms/floyd-warshall/)도 피벗 $$k$$를 가장 바깥 반복에 두고, $$k$$행과 $$k$$열의 값으로 나머지 칸을 고치는 세 겹 반복이다. 칸을 고치는 식에서 빼기 대신 min을, 곱하기 대신 +를 써서 거리표 $$D$$를 $$D[i][j] \leftarrow \min(D[i][j],\ D[i][k] + D[k][j])$$로 고치면 모든 쌍의 최단 거리가 나온다.

## 연결

- 선수: [행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/)
- 이어지는 개념: [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)(가우스–조르당), [LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/), [선형독립](/Hongs_Blog/studies/linear-algebra/linear-independence/)과 [랭크](/Hongs_Blog/studies/linear-algebra/four-subspaces/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"식의 개수와 미지수의 개수가 같으면 해가 하나다"</div>

틀렸다. "미지수 두 개엔 식 두 개"라는 요령 때문에 그렇게 믿기 쉽다. 하지만 식이 서로 겹치면 정보가 모자란다. $$x + y = 1$$, $$2x + 2y = 3$$은 소거하면 $$0 = 1$$이라 해가 없고, $$x + y = 1$$, $$2x + 2y = 2$$는 $$0 = 0$$이라 해가 무한히 많다. 해가 하나인지는 개수가 아니라 소거 뒤 피벗이 미지수 수만큼 나오는지로 판정한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$x + 2y = 5$$, $$3x + 4y = 6$$을 소거법으로 풀라. 곱수와 피벗을 밝혀라.</summary>

**답:** 곱수 3으로 2행 $$-$$ 3 × 1행: $$-2y = -9$$. 피벗은 1과 $$-2$$. $$y = 4.5$$, $$x = 5 - 9 = -4$$. 검산 $$3(-4) + 4(4.5) = 6$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 아래 코드가 하는 일을 한 문장으로 설명하라.</summary>

```python
for i in range(n - 1, -1, -1):
    s = sum(M[i][j] * x[j] for j in range(i + 1, n))
    x[i] = (M[i][n] - s) / M[i][i]
```
**답:** 위삼각꼴이 된 첨가행렬에서 마지막 미지수부터 거꾸로 올라가며, 이미 구한 값을 대입하고 피벗으로 나눠 미지수를 하나씩 구한다(후진 대입).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** "한 행에서 다른 행의 상수배를 빼는" 연산이 연립방정식의 해를 바꾸지 않는 이유는?</summary>

**답:** 원래 해는 두 식을 모두 만족하므로 두 식의 조합도 만족한다. 거꾸로 같은 상수배를 다시 더하면 원래 식이 돌아오므로, 새 식의 해도 원래 식을 만족한다. 해 집합이 서로 포함되어 같다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 소거 뒤 계단 모양이 다음과 같을 때 해의 개수를 판정하라. (가) $$\left[\begin{smallmatrix}1 & 2 & \mid & 3\\ 0 & 0 & \mid & 1\end{smallmatrix}\right]$$ (나) $$\left[\begin{smallmatrix}1 & 2 & \mid & 3\\ 0 & 0 & \mid & 0\end{smallmatrix}\right]$$ (다) $$\left[\begin{smallmatrix}1 & 2 & \mid & 3\\ 0 & 5 & \mid & 1\end{smallmatrix}\right]$$</summary>

**답:** (가) 없음($$0 = 1$$). (나) 무한히 많음(둘째 열에 피벗이 없어 $$y$$가 자유변수). (다) 하나(두 열 모두 피벗).

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 2.2절 "The Idea of Elimination", 2.3절 "Elimination Using Matrices", 3.3절 "The Complete Solution to Ax = b"(해의 종류), 11.1절 "Gaussian Elimination in Practice"(피벗팅과 연산 수).
[^s1]: 에이전트 보충. NumPy 문서는 `numpy.linalg.solve`가 LAPACK의 `gesv`(부분 피벗팅 LU)를 부른다고 밝힌다. 연산 수와 피벗팅 예는 05_gaussian-elimination_verify.py에서 확인했다.
{% endraw %}
