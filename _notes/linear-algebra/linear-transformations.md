---
layout: "note"
title: "선형변환"
display_title: "선형변환 (Linear Transformations)"
kind: "concept"
kind_label: "정의"
num: "12"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Linear Transformation", "선형변환", "일차변환", "linear map", "선형사상", "회전 행렬", "rotation matrix", "반사", "reflection", "사영", "projection", "전단", "shear", "늘이기", "scaling", "핵", "kernel", "상", "image"]
description: "모눈종이를 돌리거나, 뒤집거나, 한쪽으로 기울이거나, 늘여도 모눈의 선들은 여전히 곧고, 평행하고, 같은 간격이다. 그리고 원점은 제자리에 있다. 이런 변환이 선형변환이고, 모두 행렬 하나로 쓸 수 있다. 그래서 이미지 회전, 3D 그래픽스의 좌표 변환, 데이터의 차원 축소가 모두…"
prev_url: "/studies/linear-algebra/four-subspaces/"
prev_title: "랭크와 네 부분공간"
next_url: "/studies/linear-algebra/rotation-bridge/"
next_title: "덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬"
math: true
mermaid: false
code_count: 1
permalink: "/studies/linear-algebra/linear-transformations/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

모눈종이를 돌리거나, 뒤집거나, 한쪽으로 기울이거나, 늘여도 모눈의 선들은 여전히 곧고, 평행하고, 같은 간격이다. 그리고 원점은 제자리에 있다. 이런 변환이 선형변환이고, 모두 행렬 하나로 쓸 수 있다. 그래서 이미지 회전, 3D 그래픽스의 좌표 변환, 데이터의 차원 축소가 모두 행렬 곱이 된다. 다만 선형이라고 길이나 각을 지키는 것은 아니며(늘이기, 기울이기), 원점을 옮기는 평행이동은 선형이 아니다.

</div>


## 예시로 보기

평면의 네 가지 변환이 기준 벡터 $$\mathbf{e}_1 = (1, 0)$$, $$\mathbf{e}_2 = (0, 1)$$을 어디로 보내는지 보면 행렬이 바로 나온다([열 = 기준 벡터의 도착점](/Hongs_Blog/studies/linear-algebra/matrix-vector/)).

| 변환 | $$\mathbf{e}_1$$ → | $$\mathbf{e}_2$$ → | 행렬 |
|---|---|---|---|
| 각 $$\theta$$만큼 회전 | $$(\cos\theta, \sin\theta)$$ | $$(-\sin\theta, \cos\theta)$$ | $$\begin{pmatrix}\cos\theta & -\sin\theta\\ \sin\theta & \cos\theta\end{pmatrix}$$ |
| $$x$$축에 대한 반사 | $$(1, 0)$$ | $$(0, -1)$$ | $$\begin{pmatrix}1 & 0\\ 0 & -1\end{pmatrix}$$ |
| $$x$$축으로의 사영 | $$(1, 0)$$ | $$(0, 0)$$ | $$\begin{pmatrix}1 & 0\\ 0 & 0\end{pmatrix}$$ |
| 가로 방향 전단 | $$(1, 0)$$ | $$(k, 1)$$ | $$\begin{pmatrix}1 & k\\ 0 & 1\end{pmatrix}$$ |

회전의 두 열은 [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)의 정의 그대로다. $$\mathbf{e}_2$$는 $$\mathbf{e}_1$$보다 90° 앞서 있으므로 $$(\cos(\theta + 90°), \sin(\theta + 90°)) = (-\sin\theta, \cos\theta)$$로 간다. 각 변환이 아래 정의의 $$T$$, 표의 행렬이 $$A$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

함수 $$T: \mathbb{R}^n \to \mathbb{R}^m$$($$\mathbb{R}$$은 실수 전체, $$\mathbb{R}^n$$은 실수 $$n$$개짜리 목록 전체)이 모든 벡터 $$\mathbf{u}, \mathbf{v}$$와 스칼라 $$c$$에 대해

$$T(\mathbf{u} + \mathbf{v}) = T(\mathbf{u}) + T(\mathbf{v}), \qquad T(c\mathbf{v}) = cT(\mathbf{v})$$

를 만족하면 **선형변환**이다. $$T(\mathbf{v}) = \mathbf{0}$$인 $$\mathbf{v}$$의 집합을 **핵**, $$T$$의 값 전체를 **상**이라 한다[^1].

</div>


**동치인 다른 정의.**
1. 두 조건을 합친 한 조건: $$T(c\mathbf{u} + d\mathbf{v}) = cT(\mathbf{u}) + dT(\mathbf{v})$$.
2. 행렬 꼴: 어떤 $$m \times n$$ 행렬 $$A$$가 있어 $$T(\mathbf{x}) = A\mathbf{x}$$. $$A$$의 $$j$$열은 $$T(\mathbf{e}_j)$$다([선형 함수는 행렬이다](/Hongs_Blog/studies/linear-algebra/matrix-vector/)). 이때 핵은 $$N(A)$$, 상은 $$C(A)$$다([네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/)).

**기하적 성질.** 선형변환은 원점을 원점으로 보내고($$T(\mathbf{0}) = T(0\mathbf{v}) = 0$$), 직선을 직선(또는 한 점)으로, 평행선을 평행선으로 보내며, 같은 간격의 점들을 같은 간격으로 보낸다. 직선 $$\mathbf{p} + t\mathbf{d}$$의 상이 $$T(\mathbf{p}) + tT(\mathbf{d})$$이기 때문이다.

**설계 이유.** "덧셈과 스칼라배를 보존한다"는 조건 하나로 정의해 두면, 기저 벡터의 상만 알면 전부 정해지고, 합성이 [행렬 곱](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/)이 된다. 계산과 이론이 모두 행렬로 옮겨 간다.

**해당하는 예:** 위의 회전·반사·사영·전단, 미분 연산 $$p(x) \mapsto p'(x)$$(다항식 공간 위의 선형변환, [추상 벡터공간](/Hongs_Blog/studies/linear-algebra/abstract-vector-spaces/)). **해당하지 않는 예:** 평행이동 $$\mathbf{x} \mapsto \mathbf{x} + \mathbf{b}$$($$T(\mathbf{0}) \ne \mathbf{0}$$), $$(x, y) \mapsto (x^2, y)$$($$T(2\mathbf{e}_1) = (4, 0) \ne 2T(\mathbf{e}_1)$$).

## 증명

기하적 성질과 합성의 행렬을 보인다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *원점:* $$T(\mathbf{0}) = T(0 \cdot \mathbf{0}) = 0 \cdot T(\mathbf{0}) = \mathbf{0}$$.
2. *직선:* $$T(\mathbf{p} + t\mathbf{d}) = T(\mathbf{p}) + tT(\mathbf{d})$$. $$T(\mathbf{d}) \ne \mathbf{0}$$이면 점 $$T(\mathbf{p})$$를 지나고 방향이 $$T(\mathbf{d})$$인 직선이고, $$T(\mathbf{d}) = \mathbf{0}$$이면 한 점이다. 방향이 같은 두 직선(평행선)은 상의 방향도 $$T(\mathbf{d})$$로 같아 평행하다.
3. *같은 간격:* 직선 위의 점 $$t = 0, 1, 2, \dots$$는 $$T(\mathbf{p}) + tT(\mathbf{d})$$로 가서 간격 $$T(\mathbf{d})$$로 고르게 놓인다.
4. *합성:* $$S(T(\mathbf{x})) = B(A\mathbf{x}) = (BA)\mathbf{x}$$. 합성도 선형이고, 행렬은 곱 $$BA$$다. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 1단계에서 "$$\mathbf{0} = 0\cdot\mathbf{0}$$"을 쓰는 이유는?</summary>

스칼라배 조건 $$T(c\mathbf{v}) = cT(\mathbf{v})$$를 적용할 모양을 만들려고 한다. $$c = 0$$을 넣으면 우변이 영벡터가 되어 $$T(\mathbf{0}) = \mathbf{0}$$이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 회전 행렬의 둘째 열이 $$(-\sin\theta, \cos\theta)$$인 이유는?</summary>

$$\mathbf{e}_2$$는 각 90°의 단위벡터라 $$\theta$$만큼 돌리면 각 $$\theta + 90°$$인 단위벡터 $$(\cos(\theta + 90°), \sin(\theta + 90°))$$가 된다. 삼각함수의 성질로 이것은 $$(-\sin\theta, \cos\theta)$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 개념의 핵심 아이디어는?</summary>

두 가지 연산(덧셈, 스칼라배)을 보존하는 함수는 기저에서의 값만으로 정해진다. 무한히 많은 점의 움직임이 행렬의 몇 개 숫자로 요약된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어가 쓰이는 다른 상황은?</summary>

미분과 적분이 선형이라 [미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/)의 "합의 미분 = 미분의 합"이 맞는다. 신호 처리의 선형 필터도 입력의 합에 대한 출력이 출력의 합이라는 성질로 설계한다.

</details>


## 예제

**반사를 행렬로.** 직선 $$y = x$$에 대한 반사.

1. *기준 벡터의 상:* $$\mathbf{e}_1 = (1, 0)$$은 $$(0, 1)$$로, $$\mathbf{e}_2 = (0, 1)$$은 $$(1, 0)$$으로 간다(좌표를 바꾼다).
2. *행렬:* $$A = \begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}$$.
3. *확인:* $$(3, 1) \mapsto (1, 3)$$. 직선 $$y = x$$ 위의 $$(2, 2)$$는 그대로다. 두 번 반사하면 $$A^2 = I$$로 제자리다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 네 행렬이 기준 벡터를 표대로 보냄, 회전이 길이·각을 보존하고 $$R_\alpha R_\beta = R_{\alpha + \beta}$$, 반사·사영·전단의 성질, 무작위 행렬 변환이 직선을 직선으로·평행선을 평행선으로·등간격을 등간격으로 보냄, 평행이동과 $$(x^2, y)$$가 선형이 아님, 예제와 카드의 값 — [12_linear-transformations_verify.py](/Hongs_Blog/studies/linear-algebra/code/12_linear-transformations_verify/)</div>

</div>


## 활용

- **그래픽스.** 스프라이트 회전, 창 크기에 맞춘 늘이기, 기울임 글꼴(전단)이 모두 $$2 \times 2$$ 행렬이다. 여러 변환은 행렬을 미리 곱해 하나로 만든다.
- **이미지 처리.** 이미지 회전은 각 출력 픽셀에 역변환 $$A^{-1}$$을 곱해 원본의 어느 위치를 읽을지 정하고 보간한다[^s1].
- **데이터 사영.** 3차원 점을 화면(평면)에 그리는 정사영, 고차원 데이터를 2차원으로 줄여 보는 것이 사영이다. 사영은 핵이 있어(정보를 잃어) 되돌릴 수 없다.
- 알고리즘에서: [구현과 시뮬레이션](/Hongs_Blog/studies/algorithms/simulation/)에서 $$n \times n$$ 격자를 시계 방향으로 90도 돌리면 칸 $$(r, c)$$가 $$(c, n - 1 - r)$$로 가는데, 이는 회전 $$(r, c) \mapsto (c, -r)$$ 뒤에 둘째 좌표에 $$n - 1$$을 더하는 평행이동을 이은 것이다. 앞에서부터 더해 나가는 [누적 합](/Hongs_Blog/studies/algorithms/prefix-sum/)은 대각선과 그 아래가 모두 1인 행렬을 곱하는 선형변환이라, 구간 더하기 표시를 차분 배열 하나에 모두 모아 둔 뒤 한 번만 누적해도 표시마다 따로 누적해 더한 것과 같다. [블록 이동하기](/Hongs_Blog/studies/algorithms/pg60063/)처럼 원점이 아닌 점 $$\mathbf{p}$$를 축으로 돌릴 때는 $$\mathbf{p}$$를 원점으로 옮기고, 회전 행렬을 곱하고, 다시 $$\mathbf{p}$$만큼 옮긴다.
- 브리지: [격자 회전 ↔ 선형변환](/Hongs_Blog/studies/algorithms/grid-rotation-linear/)

## 연결

- 선수: [행렬 곱셈과 전치](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/), [부분공간, 기저와 차원](/Hongs_Blog/studies/linear-algebra/basis-dimension/), [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)
- 회전의 세 얼굴: [덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬](/Hongs_Blog/studies/linear-algebra/rotation-bridge/)
- 이어지는 개념: [기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/), [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)(넓이의 배율)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"선형변환은 모양과 크기를 유지한다"</div>

틀렸다. 처음 보는 예가 회전·반사라 "도형을 그대로 옮기는 변환"으로 기억하기 쉽다. 하지만 선형은 "직선·평행·등간격·원점"만 지킨다. 늘이기 $$\operatorname{diag}(2, 1)$$은 원을 타원으로, 전단은 정사각형을 평행사변형으로 바꾸고, 사영은 평면을 직선으로 눌러 버린다. 길이와 각을 모두 지키는 것은 회전·반사 같은 직교 변환뿐이다([직교성](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)).

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 직선 $$y = x$$에 대한 반사를 행렬로 쓰라.</summary>

**답:** $$\begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}$$. $$\mathbf{e}_1 \mapsto (0, 1)$$, $$\mathbf{e}_2 \mapsto (1, 0)$$을 열로 적는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$(2, 1)$$을 원점을 중심으로 90° 돌리면 어디로 가는가?</summary>

**답:** $$R_{90°} = \begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}$$이라 $$(0 \cdot 2 - 1 \cdot 1,\ 1 \cdot 2 + 0 \cdot 1) = (-1, 2)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$T(x, y) = (x^2, y)$$가 선형이 아님을 보여라.</summary>

**답:** $$T(2, 0) = (4, 0)$$인데 $$2T(1, 0) = (2, 0)$$이라 스칼라배를 보존하지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 선형변환이 직선을 직선(또는 점)으로 보내는 이유는?</summary>

**답:** 직선은 $$\mathbf{p} + t\mathbf{d}$$($$t \in \mathbb{R}$$)로 쓰고, 선형성으로 $$T(\mathbf{p} + t\mathbf{d}) = T(\mathbf{p}) + tT(\mathbf{d})$$다. 이것은 점 $$T(\mathbf{p})$$를 지나고 방향이 $$T(\mathbf{d})$$인 직선이다. $$T(\mathbf{d}) = \mathbf{0}$$이면 한 점으로 뭉개진다.

</details>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 8.1절 "The Idea of a Linear Transformation"(선형성, 직선과 평행선, 핵과 상), 8.2절 "The Matrix of a Linear Transformation"(기저의 상으로 만든 행렬, 회전·사영·반사).
[^s1]: 에이전트 보충. 역변환으로 원본 위치를 찾는 "역방향 사상"과 보간은 영상 처리 교재의 표준 방법이다. 정방향으로 픽셀을 보내면 빈 구멍이 생기기 때문이다.
{% endraw %}
