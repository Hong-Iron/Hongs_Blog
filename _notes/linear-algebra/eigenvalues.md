---
layout: "note"
title: "고윳값과 고유벡터"
display_title: "고윳값과 고유벡터 (Eigenvalues and Eigenvectors)"
kind: "concept"
kind_label: "정의"
num: "19"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-09-25"
status: "verified"
aliases: ["Eigenvalue", "고윳값", "고유값", "Eigenvector", "고유벡터", "특성방정식", "characteristic equation", "특성다항식", "characteristic polynomial", "고유공간", "eigenspace", "거듭제곱법", "power iteration", "마르코프 행렬", "Markov matrix", "페이지랭크", "PageRank"]
description: "행렬을 곱하면 대부분의 벡터는 방향이 바뀐다. 그런데 어떤 특별한 방향의 벡터는 방향은 그대로 두고 길이만 몇 배가 된다. 이 방향이 고유벡터, 그 배율이 고윳값이다. 변환을 여러 번 되풀이할 때 무엇이 남고 무엇이 사라지는지, 시스템이 안정한지 폭발하는지가 모두 고윳값으로 정해진…"
prev_url: "/studies/linear-algebra/gram-schmidt-qr/"
prev_title: "그람-슈미트와 QR 분해"
next_url: "/studies/linear-algebra/diagonalization/"
next_title: "대각화와 행렬 거듭제곱"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/eigenvalues/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

행렬을 곱하면 대부분의 벡터는 방향이 바뀐다. 그런데 어떤 특별한 방향의 벡터는 방향은 그대로 두고 길이만 몇 배가 된다. 이 방향이 고유벡터, 그 배율이 고윳값이다. 변환을 여러 번 되풀이할 때 무엇이 남고 무엇이 사라지는지, 시스템이 안정한지 폭발하는지가 모두 고윳값으로 정해진다. 웹 페이지 순위(페이지랭크)도 한 행렬의 고유벡터다. 다만 회전처럼 실수 고유벡터가 아예 없는 행렬도 있고, 소거로 얻는 피벗은 고윳값이 아니다.

</div>


## 예시로 보기

어느 도시의 인구가 매년 도심에서 20%는 교외로, 교외에서 30%는 도심으로 옮긴다. (도심, 교외) 비율 $$\mathbf{u}$$는 매년 $$A = \begin{pmatrix}0.8 & 0.3\\ 0.2 & 0.7\end{pmatrix}$$을 곱해 바뀐다. 처음에 모두 도심 $$(1, 0)$$이면 $$(0.8, 0.2)$$, $$(0.7, 0.3)$$, $$(0.65, 0.35)$$, … 로 $$(0.6, 0.4)$$에 다가간다.

$$(0.6, 0.4)$$에 $$A$$를 곱하면 $$(0.48 + 0.12,\ 0.12 + 0.28) = (0.6, 0.4)$$ 그대로다. 배율 1인 고유벡터다. 또 $$(1, -1)$$에 곱하면 $$(0.5, -0.5)$$로 방향은 같고 길이가 절반이다. 배율 $$\frac12$$인 고유벡터다. 모든 출발점은 이 둘의 결합이라, 해마다 $$(1, -1)$$ 성분이 절반씩 줄어 결국 $$(0.6, 0.4)$$만 남는다. 두 배율 1과 $$\frac12$$가 아래 정의의 $$\lambda$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

정사각 행렬 $$A$$에 대해 $$A\mathbf{x} = \lambda\mathbf{x}$$인 **영이 아닌** 벡터 $$\mathbf{x}$$가 있으면 $$\lambda$$를 **고윳값**, $$\mathbf{x}$$를 $$\lambda$$에 대한 **고유벡터**라 한다. $$\lambda$$에 대한 고유벡터들과 $$\mathbf{0}$$의 집합 $$N(A - \lambda I)$$를 **고유공간**이라 한다[^1].

</div>


**동치인 다른 정의.** 다음은 모두 같은 말이다.
1. $$\lambda$$는 $$A$$의 고윳값이다.
2. $$A - \lambda I$$가 특이 행렬이다($$N(A - \lambda I) \ne \{\mathbf{0}\}$$).
3. $$\det(A - \lambda I) = 0$$(**특성방정식**). 좌변은 $$\lambda$$에 대한 $$n$$차 다항식(특성다항식)이다.

$$A\mathbf{x} = \lambda\mathbf{x}$$를 $$(A - \lambda I)\mathbf{x} = \mathbf{0}$$으로 옮기면 1과 2가 같고, [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)이 0인 것이 특이와 같아 2와 3이 같다.

**설계 이유.** $$\mathbf{x} \ne \mathbf{0}$$을 요구하는 것은 $$\mathbf{x} = \mathbf{0}$$이면 모든 $$\lambda$$에서 $$A\mathbf{0} = \lambda\mathbf{0}$$이라 아무 정보가 없기 때문이다. 고윳값이 행렬의 성질이 되려면 영벡터를 빼야 한다.

**해당하는 예:** 위의 인구 이동 행렬($$\lambda = 1, \frac12$$). $$x$$축으로의 사영($$x$$축 방향은 $$\lambda = 1$$, $$y$$축 방향은 $$\lambda = 0$$). $$y = x$$에 대한 반사($$(1, 1)$$은 $$\lambda = 1$$, $$(1, -1)$$은 $$\lambda = -1$$). **해당하지 않는 예:** 90° 회전은 모든 벡터의 방향을 바꿔 실수 고유벡터가 없다(특성방정식 $$\lambda^2 + 1 = 0$$의 근 $$\pm i$$). 영벡터는 어떤 행렬의 고유벡터도 아니다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">합과 곱</div>

$$n \times n$$ 행렬의 고윳값(복소수 포함, 중복을 세어 $$n$$개) $$\lambda_1, \dots, \lambda_n$$에 대해 $$\lambda_1 + \cdots + \lambda_n = \operatorname{tr}A$$(대각합), $$\lambda_1 \cdots \lambda_n = \det A$$. 삼각행렬의 고윳값은 대각 성분이다.

</div>


## 증명

$$2 \times 2$$에서 특성다항식을 직접 전개해 합과 곱을 보인다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *전개:* $$A = \begin{pmatrix}a & b\\ c & d\end{pmatrix}$$이면 $$\det(A - \lambda I) = (a - \lambda)(d - \lambda) - bc = \lambda^2 - (a + d)\lambda + (ad - bc)$$.
2. *근과 계수:* 이 이차식의 두 근을 $$\lambda_1, \lambda_2$$라 하면 $$\lambda^2 - (\lambda_1 + \lambda_2)\lambda + \lambda_1\lambda_2$$와 같다([근과 계수의 관계](/Hongs_Blog/studies/college-math/polynomial/)).
3. *비교:* $$\lambda_1 + \lambda_2 = a + d = \operatorname{tr}A$$, $$\lambda_1\lambda_2 = ad - bc = \det A$$.
4. *삼각행렬:* $$A - \lambda I$$도 삼각이라 행렬식은 대각의 곱 $$\prod(a_{ii} - \lambda)$$이고, 근이 $$a_{ii}$$다. ∎

$$n \times n$$에서는 $$\det(A - \lambda I)$$의 $$\lambda^{n-1}$$ 계수가 대각의 곱에서만 나와 $$(-1)^{n-1}\operatorname{tr}A$$이고, 상수항이 $$\det A$$라 같은 결론이다[^1].

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 $$A - \lambda I$$가 대각 성분에서만 $$\lambda$$를 빼는 이유는?</summary>

$$\lambda I$$는 대각이 $$\lambda$$, 나머지가 0인 행렬이다. $$A\mathbf{x} = \lambda\mathbf{x}$$의 우변을 $$\lambda I\mathbf{x}$$로 써야 행렬끼리 뺄 수 있다. $$A - \lambda$$라는 "행렬 − 수"는 정의되지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 회전 행렬의 특성방정식이 $$\lambda^2 + 1 = 0$$인 이유를 3단계로 설명하라.</summary>

$$R_{90°} = \begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}$$의 대각합은 0, 행렬식은 1이라 특성다항식은 $$\lambda^2 - 0\lambda + 1$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 개념의 핵심 아이디어는?</summary>

복잡한 변환도 특별한 방향에서는 "늘이기"뿐이다. 그 방향과 배율을 찾는 문제를 "행렬이 특이해지는 $$\lambda$$ 찾기"로 바꾸면 방정식이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓰는 다른 상황은?</summary>

이산수학의 [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)에서 $$a_n = r^n$$을 넣어 특성방정식을 얻는 것이 같은 발상이다. "모양을 유지하고 배율만 바뀌는 해"를 먼저 찾는다([선형 점화식 ↔ 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/)).

</details>


## 예제

$$A = \begin{pmatrix}2 & 1\\ 1 & 2\end{pmatrix}$$의 고윳값과 고유벡터.

1. *특성방정식:* $$(2 - \lambda)^2 - 1 = 0$$, 곧 $$\lambda^2 - 4\lambda + 3 = 0$$. $$\lambda = 3, 1$$.
2. *$$\lambda = 3$$:* $$A - 3I = \begin{pmatrix}-1 & 1\\ 1 & -1\end{pmatrix}$$의 영공간은 $$(1, 1)$$ 방향.
3. *$$\lambda = 1$$:* $$A - I = \begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix}$$의 영공간은 $$(1, -1)$$ 방향.
4. *검산:* 합 $$3 + 1 = 4 = \operatorname{tr}A$$, 곱 $$3 = \det A$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 수렴과 두 고유벡터, 예제, $$2 \times 2$$ 공식으로 무작위 행렬의 합 = 대각합·곱 = 행렬식, 무작위 대칭 행렬(야코비 방법)에서 같은 관계, 삼각행렬, 사영·반사·회전, 오해의 피벗 대 고윳값, 거듭제곱법의 수렴 속도 $$\vert \lambda_2/\lambda_1\vert $$, 고윳값의 거듭제곱과 역수 — [19_eigenvalues_verify.py](/Hongs_Blog/studies/linear-algebra/code/19_eigenvalues_verify/)</div>

</div>


## 활용

- **거듭제곱법과 페이지랭크.** 아무 벡터에 $$A$$를 계속 곱하면 절댓값이 가장 큰 고윳값의 고유벡터 방향으로 모인다. 오차는 매번 약 $$\vert \lambda_2/\lambda_1\vert $$배로 준다. 페이지랭크는 웹 링크로 만든 마르코프 행렬의 $$\lambda = 1$$ 고유벡터를 이 방법으로 계산한다[^s1].
- **안정성.** $$\mathbf{u}_{k+1} = A\mathbf{u}_k$$ 꼴의 시스템은 모든 고윳값의 절댓값이 1보다 작으면 0으로 가라앉고, 하나라도 1보다 크면 폭발한다(대각화, 다음 문서).
- **계산.** 실제 라이브러리는 특성방정식을 풀지 않는다(고차 다항식의 근은 불안정하다). QR 알고리즘 같은 반복법을 쓴다(`numpy.linalg.eig`)[^s1].

## 연결

- 선수: [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/), [랭크와 네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/)(고유공간 = 영공간), [다항식과 방정식](/Hongs_Blog/studies/college-math/polynomial/)
- 이어지는 개념: [대각화와 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/diagonalization/), [대칭행렬과 스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"소거해서 얻은 피벗(삼각행렬의 대각)이 고윳값이다"</div>

틀렸다. 삼각행렬의 고윳값은 대각 성분이라, 소거로 삼각꼴을 만들면 고윳값이 보일 것 같다. 하지만 행 연산은 고윳값을 바꾼다. $$\begin{pmatrix}1 & 2\\ 3 & 4\end{pmatrix}$$을 소거하면 피벗은 1과 $$-2$$이지만 고윳값은 $$\frac{5 \pm \sqrt{33}}{2} \approx 5.37, -0.37$$이다. 피벗의 곱과 고윳값의 곱은 둘 다 행렬식 $$-2$$로 같을 뿐이다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 고윳값과 고유벡터의 정의, 그리고 고윳값을 구하는 방정식을 쓰라.</summary>

**답:** $$A\mathbf{x} = \lambda\mathbf{x}$$, $$\mathbf{x} \ne \mathbf{0}$$. 고윳값은 $$\det(A - \lambda I) = 0$$의 근이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\begin{pmatrix}4 & 1\\ 2 & 3\end{pmatrix}$$의 고윳값과 고유벡터를 구하라.</summary>

**답:** $$\lambda^2 - 7\lambda + 10 = 0$$에서 $$\lambda = 5, 2$$. $$\lambda = 5$$: $$(1, 1)$$. $$\lambda = 2$$: $$(1, -2)$$. 합 7 = 대각합, 곱 10 = 행렬식.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 실수 고유벡터가 하나도 없는 $$2 \times 2$$ 실수 행렬을 들고 이유를 쓰라.</summary>

**답:** 90° 회전 $$\begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}$$. 모든 영이 아닌 벡터의 방향을 바꾸고, 특성방정식 $$\lambda^2 + 1 = 0$$에 실근이 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 고윳값 $$\lambda$$에서 $$\det(A - \lambda I) = 0$$이어야 하는 이유는?</summary>

**답:** $$(A - \lambda I)\mathbf{x} = \mathbf{0}$$에 영이 아닌 해 $$\mathbf{x}$$가 있어야 한다. 그러려면 $$A - \lambda I$$가 특이 행렬이어야 하고, 특이 행렬의 행렬식은 0이다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 6.1절 "Introduction to Eigenvalues"(마르코프 행렬 예, 특성방정식, 대각합과 행렬식, 사영·반사·회전).
[^s1]: 에이전트 보충. 페이지랭크를 거듭제곱법으로 구하는 방법은 Brin·Page의 1998년 논문 이후 선형대수 교재의 표준 응용 예다(Strang 5판 10.3절 "Markov Matrices"). 라이브러리가 QR 알고리즘을 쓴다는 것은 LAPACK 문서(`geev`)에 있다.
{% endraw %}
