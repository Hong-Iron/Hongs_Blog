---
layout: "note"
title: "행렬식"
display_title: "행렬식 (Determinants)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Determinant", "행렬식", "det", "부호 있는 넓이", "signed area", "부호 있는 부피", "여인수 전개", "cofactor expansion", "라이프니츠 공식", "Leibniz formula", "방향 판정", "orientation test", "신발끈 공식", "shoelace formula"]
description: "행렬식은 선형변환이 넓이(3차원에서는 부피)를 몇 배로 바꾸는지를 나타내는 수 하나다. 넓이 1인 정사각형이 넓이 5인 평행사변형이 되면 행렬식은 5이고, 뒤집어지면(시계 방향과 반시계 방향이 바뀌면) 음수가 된다. 행렬식이 0이면 공간이 더 낮은 차원으로 눌려 되돌릴 수 없으므로…"
prev_url: "/studies/linear-algebra/change-of-basis/"
prev_title: "기저 변환"
next_url: "/studies/linear-algebra/orthogonal-projection/"
next_title: "직교성과 직교 사영"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/determinant/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

행렬식은 선형변환이 넓이(3차원에서는 부피)를 몇 배로 바꾸는지를 나타내는 수 하나다. 넓이 1인 정사각형이 넓이 5인 평행사변형이 되면 행렬식은 5이고, 뒤집어지면(시계 방향과 반시계 방향이 바뀌면) 음수가 된다. 행렬식이 0이면 공간이 더 낮은 차원으로 눌려 되돌릴 수 없으므로, 가역성을 숫자 하나로 판정한다. 다만 계산은 공식을 전개하지 말고 소거로 해야 하며(전개하면 크기가 커질수록 항의 수가 폭발한다), 행렬식은 덧셈에 대해서는 나누어지지 않는다.

</div>


## 예시로 보기

$$A = \begin{pmatrix}3 & 1\\ 1 & 2\end{pmatrix}$$는 $$\mathbf{e}_1$$을 $$(3, 1)$$로, $$\mathbf{e}_2$$를 $$(1, 2)$$로 보낸다. 넓이 1인 단위 정사각형이 두 열로 만든 평행사변형이 된다. 그 넓이는 $$3 \cdot 2 - 1 \cdot 1 = 5$$다.

두 열의 순서를 바꾼 $$\begin{pmatrix}1 & 3\\ 2 & 1\end{pmatrix}$$은 넓이는 같지만 방향이 뒤집혀 행렬식이 $$-5$$다. 열이 평행한 $$\begin{pmatrix}1 & 2\\ 2 & 4\end{pmatrix}$$는 평행사변형이 선분으로 납작해져 행렬식이 0이다. 넓이의 배율 5가 아래 정의의 $$\det A$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$n \times n$$ 행렬의 **행렬식** $$\det A$$는 다음 세 성질을 만족하는 유일한 함수다[^1].
1. $$\det I = 1$$.
2. 두 행을 바꾸면 부호가 바뀐다.
3. 각 행에 대해 선형이다(다른 행을 고정하면 한 행에 대한 일차함수).

$$2 \times 2$$에서는 $$\det\begin{pmatrix}a & b\\ c & d\end{pmatrix} = ad - bc$$이다. 일반적으로는 순열 $$\sigma$$에 대한 합 $$\det A = \sum_\sigma \operatorname{sgn}(\sigma)\,a_{1\sigma(1)}\cdots a_{n\sigma(n)}$$(라이프니츠 공식)이다.

</div>


세 성질에서 나머지가 모두 나온다.
- 같은 행이 둘이면 0(바꿔도 같은 행렬인데 부호가 바뀌어야 하므로).
- 한 행에 다른 행의 상수배를 더해도 그대로(선형성으로 나뉜 뒤 같은 행이 둘인 항이 0).
- 삼각행렬이면 대각 성분의 곱.
- 그래서 **소거로 계산한다.** $$\det A = \pm(\text{피벗의 곱})$$이고, 부호는 행을 바꾼 횟수의 홀짝이다([LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/)의 $$U$$ 대각).

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">행렬식의 핵심 성질</div>

$$\det(AB) = \det A \cdot \det B$$, $$\det A^\top = \det A$$($$^\top$$는 행과 열을 바꾸는 전치), $$A$$가 가역 $$\iff \det A \ne 0$$이고 그때 $$\det A^{-1} = \frac{1}{\det A}$$.

</div>


가역성과의 관계는 소거에서 바로 보인다. 피벗이 $$n$$개면 곱이 0이 아니고, 피벗이 모자라면 대각에 0이 생긴다([가역 행렬 정리](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)). 곱의 성질은 "두 변환을 차례로 하면 넓이 배율이 곱해진다"는 뜻이다.

## 예제

$$A = \begin{pmatrix}1 & 2 & 1\\ 3 & 8 & 1\\ 0 & 4 & 1\end{pmatrix}$$의 행렬식.

1. *소거:* 2행 $$-$$ 3 × 1행, 3행 $$-$$ 2 × 2행(행 바꾸기 없음). 행렬식은 변하지 않는다.
2. *삼각꼴:* 대각이 1, 2, 5인 위삼각행렬.
3. *곱:* $$\det A = 1 \cdot 2 \cdot 5 = 10$$. 첫 행으로 전개해도 $$1(8 - 4) - 2(3 - 0) + 1(12 - 0) = 10$$이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 5, $$-5$$, 0과 평행사변형 넓이, 세 성질, 라이프니츠 공식 = 소거 공식 = 여인수 전개(무작위 유리수 행렬), $$\det(AB)$$, $$\det A^\top$$, $$\det A^{-1}$$, 가역성 판정, $$\det(cA) = c^n\det A$$, 방향 판정과 신발끈 공식, 연산 수 $$n!$$ 대 $$n^3$$ — [15_determinant_verify.py](/Hongs_Blog/studies/linear-algebra/code/15_determinant_verify/)</div>

</div>


## 활용

- **가역성 확인.** 행렬식이 0이면 해가 없거나 무한히 많다. 수치 계산에서는 "0에 가까운가"보다 조건수로 판단하는 편이 믿을 만하다([노름과 조건수](/Hongs_Blog/studies/linear-algebra/conditioning/)).
- **계산 기하.** 세 점 $$a, b, c$$가 반시계 방향인지는 $$\det\begin{pmatrix}b - a & c - a\end{pmatrix}$$의 부호로 판정한다. 볼록 껍질, 선분 교차 판정의 기본 연산이다. 다각형의 넓이는 이웃한 꼭짓점 쌍의 $$2 \times 2$$ 행렬식을 더한 값의 절반이다(신발끈 공식)[^s1].
- **적분의 변수 변환.** 좌표를 바꿀 때 넓이 요소에 곱하는 보정값이 야코비 행렬의 행렬식이다([중적분과 변수변환](/Hongs_Blog/studies/calculus/multiple-integrals/)).
- **계산 비용.** 라이프니츠 공식은 항이 $$n!$$개라 $$n = 20$$이면 $$2.4 \times 10^{18}$$개다. 소거는 약 $$\frac23 n^3$$번이다.
- 알고리즘에서: 코딩 테스트에서는 위 계산 기하의 방향 판정을 외적(CCW)이라 부른다. 좌표가 정수면 곱셈과 뺄셈만 써서 선분 교차, 점이 삼각형 안에 있는지, 각도 순 정렬을 오차 없이 한다([계산 기하 기초](/Hongs_Blog/studies/algorithms/geometry-ccw/)). [IU와 콘의 보드게임](/Hongs_Blog/studies/algorithms/pg1841/)은 이 부호만으로 꼭짓점에서 본 핀들의 각도 순서를 정한다.

## 연결

- 선수: [선형변환](/Hongs_Blog/studies/linear-algebra/linear-transformations/)(넓이 배율), [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/)(계산 방법)
- 이어지는 개념: [고윳값과 고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/)($$\det(A - \lambda I) = 0$$)
- 같은 값: [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/)으로 닮은 행렬은 행렬식이 같다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$\det(2A) = 2\det A$$"</div>

틀렸다. $$\det$$가 "선형"이라는 말을 행렬 전체에 대한 선형으로 오해하기 쉽다. 선형인 것은 **한 행**에 대해서다. $$2A$$는 모든 행이 2배라 $$n$$개 행 각각에서 2가 나와 $$\det(2A) = 2^n\det A$$다. 넓이로 봐도 가로·세로를 모두 2배 하면 넓이는 4배다. 같은 이유로 $$\det(A + B) \ne \det A + \det B$$다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\begin{pmatrix}2 & 1 & 0\\ 4 & 3 & 1\\ 2 & 5 & 4\end{pmatrix}$$의 행렬식을 소거로 구하라.</summary>

**답:** 2행 $$-$$ 2 × 1행 $$= (0, 1, 1)$$, 3행 $$-$$ 1행 $$= (0, 4, 4)$$, 이어서 3행 $$-$$ 4 × 2행 $$= (0, 0, 0)$$. 피벗이 모자라 행렬식은 0이다. 셋째 행이 $$-7 \times$$ 1행 $$+ 4 \times$$ 2행이라 세 행이 종속이기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 행렬식이 0인 행렬에 역행렬이 없는 이유를 넓이로 설명하라.</summary>

**답:** 넓이(부피) 배율이 0이라는 것은 공간이 한 차원 이상 낮은 곳(선, 평면)으로 눌렸다는 뜻이다. 서로 다른 여러 점이 같은 점으로 겹쳐 가므로 어느 점에서 왔는지 되돌릴 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$\det(A + B) = \det A + \det B$$가 틀리는 예를 들라.</summary>

**답:** $$A = B = I_2$$. $$\det(2I) = 4$$인데 $$\det I + \det I = 2$$다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 5.1절 "The Properties of Determinants"(세 성질과 그 결과, $$\det AB$$, $$\det A^\top$$), 5.2절 "Permutations and Cofactors"(라이프니츠 공식, 여인수 전개), 5.3절 "Cramer's Rule, Inverses, and Volumes"(넓이·부피).
[^s1]: 에이전트 보충. 방향 판정과 신발끈 공식은 계산 기하 교재의 표준 도구다. 15_determinant_verify.py에서 무작위 삼각형·다각형으로 확인했다.
{% endraw %}
