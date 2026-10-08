---
layout: "note"
title: "양의 정부호 행렬과 이차형식"
display_title: "양의 정부호 행렬과 이차형식 (Positive Definite Matrices)"
kind: "concept"
kind_label: "정의"
num: "23"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-09-26"
status: "verified"
aliases: ["Positive Definite Matrix", "양의 정부호", "양정치", "positive definite", "양의 준정부호", "positive semidefinite", "PSD", "이차형식", "quadratic form", "에너지", "실베스터 판정", "Sylvester's criterion", "숄레스키 분해", "Cholesky decomposition"]
description: "대칭행렬로 만든 이차식(이차형식)이 원점을 뺀 모든 곳에서 양수이면 그 행렬은 양의 정부호다. 그래프로 그리면 어느 방향으로 가도 올라가는 그릇 모양이라, 바닥(최솟점)이 딱 하나 있다. 최적화의 \"극소 판정\", 공분산 행렬, 최소제곱에 나오는 행렬이 모두 이 성질을 가진다. 판정…"
prev_url: "/studies/linear-algebra/spectral-theorem/"
prev_title: "대칭행렬과 스펙트럼 정리"
next_url: "/studies/linear-algebra/svd/"
next_title: "특잇값 분해"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/positive-definite/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

대칭행렬로 만든 이차식(이차형식)이 원점을 뺀 모든 곳에서 양수이면 그 행렬은 양의 정부호다. 그래프로 그리면 어느 방향으로 가도 올라가는 그릇 모양이라, 바닥(최솟점)이 딱 하나 있다. 최적화의 "극소 판정", 공분산 행렬, 최소제곱에 나오는 행렬이 모두 이 성질을 가진다. 판정은 고윳값, 피벗, 왼쪽 위 행렬식 중 무엇으로 해도 된다. 다만 성분이 모두 양수라고 양의 정부호인 것은 아니다.

</div>


## 예시로 보기

$$S = \begin{pmatrix}2 & -1\\ -1 & 2\end{pmatrix}$$로 만든 식은

$$\mathbf{x}^\top S\mathbf{x} = 2x^2 - 2xy + 2y^2 = x^2 + y^2 + (x - y)^2.$$

세 제곱의 합이라 $$(x, y) \ne (0, 0)$$이면 늘 양수다. 그래프는 원점이 바닥인 그릇이다. 반면 $$\begin{pmatrix}1 & 2\\ 2 & 1\end{pmatrix}$$의 식 $$x^2 + 4xy + y^2$$은 $$(1, -1)$$에서 $$1 - 4 + 1 = -2$$로 음수다. 한쪽은 올라가고 한쪽은 내려가는 말안장이다. $$S$$가 아래 정의의 행렬, $$x^2 + y^2 + (x - y)^2$$이 에너지다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

대칭행렬 $$S$$가 모든 $$\mathbf{x} \ne \mathbf{0}$$에서 $$\mathbf{x}^\top S\mathbf{x} > 0$$이면 **양의 정부호**, $$\ge 0$$이면 **양의 준정부호**라 한다. $$\mathbf{x}^\top S\mathbf{x}$$를 **이차형식**(에너지)이라 한다[^1].

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">판정법</div>

대칭행렬 $$S$$에 대해 다음은 동치다.
1. $$S$$는 양의 정부호다.
2. 고윳값이 모두 양수다.
3. 소거의 피벗이 모두 양수다(행 바꾸기 없이).
4. 왼쪽 위 $$k \times k$$ 부분행렬의 행렬식이 $$k = 1, \dots, n$$ 모두 양수다(실베스터 판정).
5. 열이 독립인 어떤 $$A$$로 $$S = A^\top A$$라 쓸 수 있다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 (1 ⇔ 2, 5 ⇒ 1)</summary>

*(2 ⇒ 1)* [스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/)로 $$S = Q\Lambda Q^\top$$. $$\mathbf{y} = Q^\top\mathbf{x}$$로 두면 $$\mathbf{x}^\top S\mathbf{x} = \mathbf{y}^\top\Lambda\mathbf{y} = \sum\lambda_iy_i^2$$. $$\mathbf{x} \ne \mathbf{0}$$이면 $$\mathbf{y} \ne \mathbf{0}$$이고($$Q$$ 가역) 모든 $$\lambda_i > 0$$이라 양수다.<br>
*(1 ⇒ 2)* 고유벡터 $$\mathbf{q}$$를 넣으면 $$\mathbf{q}^\top S\mathbf{q} = \lambda\Vert \mathbf{q}\Vert ^2 > 0$$이라 $$\lambda > 0$$.<br>
*(5 ⇒ 1)* $$\mathbf{x}^\top A^\top A\mathbf{x} = \Vert A\mathbf{x}\Vert ^2 \ge 0$$이고, 열이 독립이라 $$\mathbf{x} \ne \mathbf{0}$$이면 $$A\mathbf{x} \ne \mathbf{0}$$이어서 양수다.<br>
3, 4와의 동치는 [증명 생략: Strang 5판 6.5절]. ∎

</details>


$$2 \times 2$$에서 3과 4는 한 줄이다. $$\begin{pmatrix}a & b\\ b & c\end{pmatrix}$$의 피벗은 $$a$$와 $$\frac{ac - b^2}{a}$$이라, $$a > 0$$이고 $$ac - b^2 > 0$$이면 양의 정부호다.

## 예제

$$S = \begin{pmatrix}2 & -1 & 0\\ -1 & 2 & -1\\ 0 & -1 & 2\end{pmatrix}$$가 양의 정부호인지 판정한다.

1. *피벗:* 2, 그다음 $$2 - \frac12 = \frac32$$, 그다음 $$2 - \frac{1}{3/2} = \frac43$$. 모두 양수다.
2. *실베스터:* 왼쪽 위 행렬식이 2, 3, 4로 모두 양수다(피벗의 누적곱 $$2$$, $$2 \cdot \frac32$$, $$3 \cdot \frac43$$).
3. *결론:* 양의 정부호다. 고윳값은 $$2 - \sqrt2$$, 2, $$2 + \sqrt2$$로 모두 양수다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 제곱합 표현과 $$(1, -1)$$에서 $$-2$$, 예제의 피벗·행렬식·고윳값, 무작위 대칭 행렬 1,000개에서 다섯 판정(에너지는 무작위 방향 표본)이 서로 일치, $$A^\top A$$가 늘 준정부호, 숄레스키 분해 $$S = LL^\top$$, 카드의 값 — [23_positive-definite_verify.py](/Hongs_Blog/studies/linear-algebra/code/23_positive-definite_verify/)</div>

</div>


## 활용

- **최적화의 극소 판정.** 함수의 기울기가 0인 점에서 2차 도함수 행렬(헤세 행렬)이 양의 정부호면 그 점은 극소다. 그릇의 바닥이기 때문이다([헤세 행렬과 극값 판정](/Hongs_Blog/studies/calculus/hessian/)).
- **공분산 행렬.** 공분산 행렬은 늘 양의 준정부호다. $$\mathbf{w}^\top\Sigma\mathbf{w}$$가 $$\mathbf{w}$$ 방향 분산이라 음수일 수 없다([공분산 행렬과 다변량 정규분포](/Hongs_Blog/studies/probability-statistics/multivariate-normal/)).
- **숄레스키 분해.** 양의 정부호 $$S$$는 $$S = LL^\top$$($$L$$ 아래삼각)로 쪼개진다. LU의 절반 비용으로 연립방정식을 풀고, 다변수 정규분포 표본을 만들 때 쓴다[^s1].

## 연결

- 선수: [대칭행렬과 스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/)
- 같은 성질을 가진 행렬: [최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/)의 $$A^\top A$$
- 이어지는 개념: [특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\begin{pmatrix}4 & 2\\ 2 & 3\end{pmatrix}$$이 양의 정부호인지 피벗으로 판정하라.</summary>

**답:** 피벗 4와 $$3 - \frac{2 \cdot 2}{4} = 2$$. 모두 양수라 양의 정부호다. 행렬식 $$12 - 4 = 8 > 0$$으로도 확인된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 성분이 모두 양수인데 양의 정부호가 아닌 대칭행렬을 들라.</summary>

**답:** $$\begin{pmatrix}1 & 2\\ 2 & 1\end{pmatrix}$$. 고윳값이 3과 $$-1$$이고, $$(1, -1)$$에서 에너지가 $$-2$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 어떤 행렬 $$A$$든 $$A^\top A$$가 양의 준정부호인 이유는?</summary>

**답:** $$\mathbf{x}^\top A^\top A\mathbf{x} = (A\mathbf{x})^\top(A\mathbf{x}) = \Vert A\mathbf{x}\Vert ^2 \ge 0$$이다. $$A$$의 열이 독립이면 $$\mathbf{x} \ne \mathbf{0}$$에서 $$A\mathbf{x} \ne \mathbf{0}$$이라 양의 정부호다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 6.5절 "Positive Definite Matrices"(에너지 $$\mathbf{x}^\top S\mathbf{x}$$, 다섯 가지 판정, $$A^\top A$$, 숄레스키).
[^s1]: 에이전트 보충. 숄레스키 분해의 연산 수가 LU의 약 절반($$\frac13n^3$$)이라는 것과, 공분산 $$\Sigma = LL^\top$$로 $$L\mathbf{z}$$($$\mathbf{z}$$는 표준정규)를 만들어 다변수 정규 표본을 얻는 방법은 수치 선형대수·통계 계산의 표준 내용이다.
{% endraw %}
