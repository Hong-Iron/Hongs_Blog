---
layout: "note"
title: "동차 좌표"
display_title: "동차 좌표 (Homogeneous Coordinates)"
kind: "concept"
kind_label: "기법"
num: "04"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Homogeneous Coordinates", "동차 좌표계", "평행이동 행렬", "Translation Matrix", "합성 변환", "Composite Transformation", "점 중심 회전", "Rotation around a Point"]
description: "회전과 확대는 행렬 곱인데 평행이동만 덧셈이라, 여러 변환을 이어 붙이면 곱과 덧셈이 뒤엉킨다. 점 (x, y) 끝에 1을 하나 붙여 (x, y, 1)로 쓰면 평행이동도 행렬 곱이 된다. 그러면 아무리 많은 변환도 행렬 하나로 미리 곱해 두고 모든 점에 한 번씩만 곱하면 된다. 다…"
prev_url: "/studies/numerical-analysis/transformation-classes/"
prev_title: "기하 변환의 종류"
next_url: "/studies/numerical-analysis/normal-transform/"
next_title: "법선 벡터의 변환"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/homogeneous-coordinates/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

회전과 확대는 행렬 곱인데 평행이동만 덧셈이라, 여러 변환을 이어 붙이면 곱과 덧셈이 뒤엉킨다. 점 $$(x, y)$$ 끝에 1을 하나 붙여 $$(x, y, 1)$$로 쓰면 평행이동도 행렬 곱이 된다. 그러면 아무리 많은 변환도 행렬 하나로 미리 곱해 두고 모든 점에 한 번씩만 곱하면 된다. 다만 행렬 곱은 순서를 바꾸면 결과가 달라지므로, 곱하는 순서가 곧 변환하는 순서다.

</div>


## 예시로 보기

점 $$(2, 1)$$을 점 $$P = (1, 1)$$을 중심으로 90° 돌린다. 회전 행렬은 원점을 중심으로만 돌린다. 그래서 세 단계로 나눈다[^1].

| 단계 | 하는 일 | 식 | 결과 |
|---|---|---|---|
| 1 | $$P$$를 원점으로 옮김 | $$X - P$$ | $$(1, 0)$$ |
| 2 | 원점 중심 90° 회전 | $$R(X - P)$$ | $$(0, 1)$$ |
| 3 | 원점을 다시 $$P$$로 | $$R(X - P) + P$$ | $$(1, 2)$$ |

점이 1만 개라면 점마다 빼기, 곱하기, 더하기를 해야 한다. 동차 좌표에서는 세 단계를 $$3 \times 3$$ 행렬 하나 $$H = T(P)\,R\,T(-P)$$로 미리 곱해 둔다. 그 뒤로는 점마다 행렬 곱 한 번이다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시, (hx, hy, h)가 같은 점, 방향 벡터는 평행이동되지 않음, TM ≠ MT, 무작위 200쌍에서 합성 공식, 역행렬 공식, 카드 C2 — [04_homogeneous-coordinates_verify.py](/Hongs_Blog/studies/numerical-analysis/code/04_homogeneous-coordinates_verify/)</div>

</div>


## 정의

**동차 좌표**는 2차원 점 $$(x, y)$$를 3차원 벡터 $$(hx, hy, h)$$($$h \ne 0$$)로 나타낸다. $$h$$가 무엇이든 같은 점이다. 마지막 성분으로 나누면 원래 점이 나온다[^3].

$$\begin{pmatrix}hx\\ hy\\ h\end{pmatrix} \;\Longleftrightarrow\; \begin{pmatrix}x\\ y\end{pmatrix}$$


그림으로 보면 $$(hx, hy, h)$$는 원점을 지나는 직선이다. 이 직선이 높이 $$h = 1$$인 평면과 만나는 점이 $$(x, y)$$다. 원점을 지나는 직선과 2차원 점이 일대일로 짝지어진다[^4]. 계산할 때는 $$h = 1$$을 쓴다[^5].

이 공간에서 $$xy$$ 방향 전단은 높이 $$h$$인 평면을 옆으로 민다. 높이 1인 평면에서 보면 그것이 평행이동이다[^6].

$$\begin{pmatrix}1 & 0 & a\\ 0 & 1 & b\\ 0 & 0 & 1\end{pmatrix}\begin{pmatrix}x\\ y\\ 1\end{pmatrix} = \begin{pmatrix}x + a\\ y + b\\ 1\end{pmatrix}$$


평행이동을 뺀 변환(회전, 확대, 전단)을 $$L$$, 평행이동을 $$T$$라 하면 블록 행렬로 다음과 같다. 3차원 점은 $$(x, y, z, 1)$$과 $$4 \times 4$$ 행렬을 쓴다[^5].

$$M = \begin{pmatrix}L & 0\\ 0 & 1\end{pmatrix}, \quad T = \begin{pmatrix}I & \mathbf t\\ 0 & 1\end{pmatrix}, \quad TM = \begin{pmatrix}L & \mathbf t\\ 0 & 1\end{pmatrix}, \quad MT = \begin{pmatrix}L & L\mathbf t\\ 0 & 1\end{pmatrix} \ne TM$$


$$TM$$은 먼저 $$L$$을 하고 나중에 옮긴다. $$MT$$는 먼저 옮기고 나중에 $$L$$을 해서, 옮긴 거리까지 $$L$$로 바뀐다.

**두 변환 잇기.** $$[M_1, T_1]$$ 다음에 $$[M_2, T_2]$$를 하면 다음과 같다[^7].

$$\begin{pmatrix}M_2 & T_2\\ 0 & 1\end{pmatrix}\begin{pmatrix}M_1 & T_1\\ 0 & 1\end{pmatrix} = \begin{pmatrix}M_2M_1 & M_2T_1 + T_2\\ 0 & 1\end{pmatrix}$$


**역행렬.** $$H = MT$$(먼저 $$\mathbf t_s$$만큼 옮기고 $$M_s$$)이면, 거꾸로 되돌려 $$H^{-1} = T^{-1}M^{-1}$$이다[^7].

$$H^{-1} = \begin{pmatrix}I & -\mathbf t_s\\ 0 & 1\end{pmatrix}\begin{pmatrix}M_s^{-1} & 0\\ 0 & 1\end{pmatrix}$$


**회전.** 2차원 회전 $$R_\theta = \begin{pmatrix}\cos\theta & -\sin\theta\\ \sin\theta & \cos\theta\end{pmatrix}$$의 역행렬은 $$R_{-\theta} = R_\theta^\top$$이고, 연속 회전 $$R_\beta R_\alpha = R_{\alpha + \beta}$$는 각을 더한다[^8].

마지막 성분이 0인 $$(x, y, 0)$$은 평행이동해도 그대로다. 그래서 위치가 아닌 방향(벡터)을 나타낼 때 쓴다[^s1].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$TM$$의 오른쪽 위 칸이 $$\mathbf t$$인 이유</summary>

블록 곱셈으로 오른쪽 위는 $$I\cdot0 + \mathbf t\cdot1 = \mathbf t$$다. $$L$$을 먼저 하고 나중에 옮기므로 이동량은 그대로 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. $$MT$$의 오른쪽 위 칸이 $$L\mathbf t$$인 이유</summary>

$$L\cdot\mathbf t + 0\cdot1 = L\mathbf t$$다. 먼저 옮긴 뒤에 $$L$$을 하므로 $$L$$이 이동량에도 작용한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. $$H^{-1} = T^{-1}M^{-1}$$에서 순서가 뒤집히는 이유</summary>

$$(AB)^{-1} = B^{-1}A^{-1}$$이다. 양말을 신고 신발을 신었으면 신발부터 벗는 것처럼, 마지막에 한 것부터 거꾸로 되돌린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법의 핵심 아이디어는?</summary>

차원을 하나 늘리면 평행이동(덧셈)이 그 공간에서는 전단(선형변환)이 된다. 그래서 모든 아핀 변환을 행렬 곱 하나로 쓸 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법을 쓸 수 있는 다른 상황은?</summary>

덧셈이 섞인 변환을 곱 하나로 묶고 싶을 때. 예: 3차원 그래픽스의 $$4 \times 4$$ 행렬, 원근 투영(마지막 성분으로 나누기), 평면 $$ax + by + cz + d = 0$$을 $$(a, b, c, d)$$ 하나로 다루기.

</details>


## 예제

**확대와 평행이동의 순서.** 점 $$(1, 1)$$에 2배 확대 $$S$$와 $$(3, 0)$$ 평행이동 $$T$$를 한다.

- 목표 1, 먼저 확대: $$(2, 2)$$ → 옮김: $$(5, 2)$$. 행렬로 $$TS$$.
- 목표 2, 먼저 옮김: $$(4, 1)$$ → 확대: $$(8, 2)$$. 행렬로 $$ST$$.

옮긴 거리 3까지 2배가 되어 6이 된다. 행렬로 쓰면 $$ST$$의 평행이동 칸이 $$S\mathbf t = (6, 0)$$이다.

## 활용

- 연습: [예제 사다리](/Hongs_Blog/studies/numerical-analysis/homogeneous-ladder/)(완전한 풀이 → 빈칸 → 독립 문제)
- 그래픽스 파이프라인(OpenGL, Direct3D)은 모델·뷰·투영 변환을 모두 $$4 \times 4$$ 행렬로 쓰고, 미리 곱한 행렬 하나를 GPU에 보낸다[^s1].
- 흔한 실수: 코드에서 행렬을 적는 순서와 변환이 일어나는 순서를 거꾸로 생각하는 것. $$\mathbf x' = ABC\mathbf x$$에서는 $$C$$가 가장 먼저 일어난다.

## 연결

- 선수: [기하 변환의 종류](/Hongs_Blog/studies/numerical-analysis/transformation-classes/)(아핀 변환), [행렬 곱셈과 전치](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/)
- 2차원 회전 행렬과 각의 덧셈: [덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬](/Hongs_Blog/studies/linear-algebra/rotation-bridge/)
- 동차 좌표를 쓰는 곳: [좌표계 변환](/Hongs_Blog/studies/numerical-analysis/coordinate-frame/), [반사와 반전](/Hongs_Blog/studies/numerical-analysis/reflection/), [평행 투영과 원근 투영](/Hongs_Blog/studies/numerical-analysis/projection/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"변환을 여러 개 하면 행렬을 적힌 순서대로 왼쪽부터 곱하면 된다"</div>

틀렸다. 점은 오른쪽에 곱해지므로, 가장 오른쪽 행렬이 가장 먼저 작용한다. 말로 "회전한 뒤 옮긴다"라고 하면 순서가 왼쪽부터 같아 보여 그럴듯하다. 실제로는 $$T R$$로 써야 한다. 위 예제처럼 확대와 평행이동만 바꿔도 $$(5, 2)$$와 $$(8, 2)$$로 결과가 다르다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 2차원 평행이동 $$(a, b)$$의 동차 좌표 행렬과, $$[M_1, T_1]$$ 다음 $$[M_2, T_2]$$를 합친 행렬을 쓰라.</summary>

**답:** $$\begin{pmatrix}1 & 0 & a\\ 0 & 1 & b\\ 0 & 0 & 1\end{pmatrix}$$. 합치면 $$\begin{pmatrix}M_2M_1 & M_2T_1 + T_2\\ 0 & 1\end{pmatrix}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 2배 확대 $$S$$와 $$(3, 0)$$ 평행이동 $$T$$에 대해 $$TS$$와 $$ST$$를 점 $$(1, 1)$$에 적용하라.</summary>

**답:** $$TS(1, 1) = (5, 2)$$, $$ST(1, 1) = (8, 2)$$. $$ST$$는 먼저 옮기므로 이동량까지 2배가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 점 $$P$$를 중심으로 회전하는 행렬이 $$T(P)\,R\,T(-P)$$인 이유를 설명하라.</summary>

**답:** 회전 행렬은 원점을 중심으로만 돌린다. 그래서 먼저 $$P$$를 원점으로 옮기고($$T(-P)$$), 돌리고($$R$$), 다시 원래 자리로 옮긴다($$T(P)$$). 가장 먼저 하는 것이 가장 오른쪽에 온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$(3, 2, 1)$$과 $$(3, 2, 0)$$에 평행이동 $$(5, 5)$$를 하면 각각 어떻게 되는가? 두 벡터는 무엇을 나타내나?</summary>

**답:** $$(8, 7, 1)$$과 $$(3, 2, 0)$$. 마지막이 1이면 위치(점)라 옮겨지고, 0이면 방향(벡터)이라 옮겨지지 않는다. 화살표를 평행이동해도 방향은 그대로인 것과 같다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/04.na04_transformation.pdf, p.32
[^2]: 같은 자료, p.33~34
[^3]: 같은 자료, p.35~36
[^4]: 같은 자료, p.36
[^5]: 같은 자료, p.40~42
[^6]: 같은 자료, p.37~39
[^7]: 같은 자료, p.43
[^8]: 같은 자료, p.28~31
[^s1]: 에이전트 보충. 예시의 수치, 확대·평행이동 예제, 방향 벡터($$w = 0$$), 그래픽스 파이프라인, 스스로 설명해 보기, 오해, 카드 C2~C4는 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
