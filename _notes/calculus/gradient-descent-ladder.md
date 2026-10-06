---
layout: "note"
title: "경사 하강법 예제 사다리"
display_title: "경사 하강법 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "26"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 경사 하강법, 헤세 행렬, 그래디언트."
prev_url: "/studies/calculus/integration-ladder/"
prev_title: "적분 계산 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/calculus/gradient-descent-ladder/"
---
{% raw %}
사용 개념: [경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/), [헤세 행렬](/Hongs_Blog/studies/calculus/hessian/), [그래디언트](/Hongs_Blog/studies/calculus/gradient/).

경사 하강법 문제는 "몇 걸음 돌려 보라"처럼 보여도 핵심은 **학습률이 안전한지 먼저 판정하는 것**이다. 곡률이 가장 큰 방향이 허용 학습률을 정한다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *기울기 식:* $$\nabla f$$($$\nabla f$$는 편미분을 모은 벡터(그래디언트))를 구한다.
2. *곡률과 학습률 범위:* 헤세 행렬의 가장 큰 고윳값 $$L$$을 구하고 $$\eta < \frac2L$$인지 본다.
3. *갱신 실행:* $$\mathbf{x} \leftarrow \mathbf{x} - \eta\nabla f(\mathbf{x})$$를 필요한 만큼 돌린다. 이차함수면 방향마다 곱해지는 인수 $$1 - \eta\lambda$$로 한꺼번에 쓴다.
4. *수렴 판단:* 인수의 절댓값으로 수렴·진동·발산을 가리고, 도착점이 최솟점과 맞는지 확인한다.

## 문제 1 · 완전한 풀이

$$f(x, y) = x^2 + 4y^2$$, 시작점 $$(2, 1)$$, 학습률 $$0.1$$. 두 걸음 뒤의 위치와, $$\vert x\vert  < 0.01$$이 되는 걸음 수를 구하라.

1. *기울기:* $$\nabla f = (2x, 8y)$$.
2. *곡률과 범위:* 헤세 행렬 $$\operatorname{diag}(2, 8)$$, $$L = 8$$이라 $$\eta < 0.25$$. $$0.1$$은 안전하다.
3. *갱신:* $$x \leftarrow (1 - 0.2)x = 0.8x$$, $$y \leftarrow (1 - 0.8)y = 0.2y$$. $$(2, 1) \to (1.6, 0.2) \to (1.28, 0.04)$$.
4. *수렴 판단:* 두 인수 모두 절댓값이 1보다 작아 $$(0, 0)$$으로 수렴한다. 느린 쪽은 $$x$$다. $$2 \cdot 0.8^k < 0.01$$에서 $$k > \frac{\ln 0.005}{\ln 0.8} \approx 23.7$$이라 24걸음이다.

## 문제 2 · 마지막 하위목표만 빈칸

데이터 $$(1, 2)$$, $$(2, 4)$$에 직선 $$y = wx$$를 맞춘다. 손실은 평균제곱오차 $$f(w) = \frac12\big((w - 2)^2 + (2w - 4)^2\big)$$이고 $$w_0 = 0$$, 학습률 $$0.1$$이다.

1. *기울기:* $$f(w) = \frac52(w - 2)^2$$이라 $$f'(w) = 5(w - 2)$$.
2. *곡률과 범위:* $$f'' = 5 = L$$, $$\eta < 0.4$$. $$0.1$$은 안전하다.
3. *갱신:* $$w \leftarrow w - 0.5(w - 2)$$. $$0 \to 1 \to 1.5 \to 1.75$$.
4. *수렴 판단:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

2까지의 거리가 매 걸음 절반이 된다(인수 $$1 - 0.1 \cdot 5 = 0.5$$). 그래서 $$w = 2$$로 수렴하고, 10걸음 뒤 오차는 $$\frac{2}{1024} \approx 0.002$$다. $$w = 2$$는 두 점을 정확히 지나는 직선 $$y = 2x$$이자 최소제곱 해다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$f(x, y) = x^2 + xy + y^2$$, 시작점 $$(1, 0)$$, 학습률 $$\frac13$$. 세 걸음을 추적하고 수렴 속도를 설명하라.

1. *기울기:* $$\nabla f = (2x + y,\ x + 2y)$$.
2. *곡률과 범위:* ______
3. *갱신:* ______
4. *수렴 판단:* 방향 $$(1, -1)$$ 성분이 매 걸음 $$\frac23$$배가 되어 $$(0, 0)$$으로 수렴한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 헤세 행렬 $$\begin{pmatrix}2 & 1\\ 1 & 2\end{pmatrix}$$의 고윳값은 3(방향 $$(1, 1)$$)과 1(방향 $$(1, -1)$$). $$L = 3$$이라 $$\eta < \frac23$$이고, $$\frac13$$은 안전하다.
3. $$(1, 0) \to \left(\frac13, -\frac13\right) \to \left(\frac29, -\frac29\right) \to \left(\frac{4}{27}, -\frac{4}{27}\right)$$. 방향 $$(1, 1)$$의 인수는 $$1 - \frac13 \cdot 3 = 0$$이라 첫 걸음에 사라지고, 방향 $$(1, -1)$$의 인수는 $$1 - \frac13 \cdot 1 = \frac23$$이다.

</details>


## 문제 4 · 독립 문제

$$f(x, y) = 3x^2 + y^2$$을 $$(1, 1)$$에서 학습률 $$0.4$$로 시작하면 어떻게 되는가? 두 방향이 같은 속도로 줄게 하는 고정 학습률도 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

헤세 행렬 $$\operatorname{diag}(6, 2)$$라 $$L = 6$$, 허용 범위 $$\eta < \frac13$$. $$0.4$$는 넘는다. $$x$$ 인수 $$1 - 6 \cdot 0.4 = -1.4$$라 $$x$$가 부호를 바꾸며 발산하고, $$y$$ 인수는 $$0.2$$라 $$y$$만 수렴한다. 첫 걸음은 $$(-1.4, 0.2)$$.<br>
두 인수의 절댓값을 같게 하려면 $$-(1 - 6\eta) = 1 - 2\eta$$, 곧 $$\eta = \frac{2}{L + \mu} = \frac28 = 0.25$$. 이때 인수는 $$-0.5$$와 $$0.5$$다.

**흔한 오답:** $$y$$ 방향이 수렴하니 괜찮다고 보는 것. 한 방향이라도 발산하면 전체가 발산한다.

</details>


## 변형 문제

$$f(x, y) = x^2 - y^2$$을 $$(1, 0)$$에서 학습률 $$0.1$$로 시작하면 어디에 멈추는가? 그 점은 최솟점인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$y$$가 늘 0이라 $$x \leftarrow 0.8x$$만 일어나 $$(0, 0)$$에 멈춘다. 하지만 헤세 행렬 $$\operatorname{diag}(2, -2)$$의 고윳값 부호가 섞여 있어 안장점이다. 시작점을 $$(1, 10^{-8})$$로 바꾸면 $$y$$가 매 걸음 1.2배로 커져 약 100걸음 뒤 빠져나간다. 자세한 내용은 [경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/)의 자주 하는 오해에 있다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 위치·걸음 수·고윳값을 코드로 재계산 — [26_gradient-descent_verify.py](/Hongs_Blog/studies/calculus/code/26_gradient-descent_verify/)</div>

</div>


[^1]: Boyd, Vandenberghe, *Convex Optimization*, 9.3절 "Gradient descent method"(이차함수에서의 수렴과 조건수의 영향).
{% endraw %}
