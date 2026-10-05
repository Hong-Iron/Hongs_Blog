---
layout: "note"
title: "미분방정식과 오일러 방법"
display_title: "미분방정식과 오일러 방법 (Differential Equations and Euler's Method)"
kind: "concept"
kind_label: "기법"
num: "29"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-09-26"
status: "verified"
aliases: ["Differential Equation", "미분방정식", "상미분방정식", "ODE", "ordinary differential equation", "초깃값 문제", "initial value problem", "오일러 방법", "Euler's method", "오일러법", "수치 적분", "numerical integration", "안정성", "stability", "반암시적 오일러", "semi-implicit Euler", "심플렉틱 오일러", "symplectic Euler", "룽게-쿠타", "Runge–Kutta", "RK4"]
description: "미분방정식은 \"지금 상태가 이렇다면 이만큼 변한다\"는 규칙이다. 오일러 방법은 지금의 변화율을 믿고 아주 짧은 시간만큼 나아가기를 반복해서 미래를 계산한다. 게임이 매 프레임 물체의 위치를 갱신하는 것과 같은 방식이라 단순하고 어디든 쓸 수 있다. 대신 걸음마다 오차가 쌓여 걸음 …"
prev_url: "/studies/calculus/lagrange-multipliers/"
prev_title: "라그랑주 승수법"
next_url: "/studies/calculus/fourier-series/"
next_title: "푸리에 급수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/ode-euler/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

미분방정식은 "지금 상태가 이렇다면 이만큼 변한다"는 규칙이다. 오일러 방법은 지금의 변화율을 믿고 아주 짧은 시간만큼 나아가기를 반복해서 미래를 계산한다. 게임이 매 프레임 물체의 위치를 갱신하는 것과 같은 방식이라 단순하고 어디든 쓸 수 있다. 대신 걸음마다 오차가 쌓여 걸음 크기에 비례하는 오차가 남고, 빠르게 변하는 문제에서 걸음이 크면 답이 진동하다 폭발한다.

</div>


## 예시로 보기

통장에 1이 있고 이자가 "지금 잔액만큼의 비율로" 계속 붙는다. 이 규칙이 $$y' = y$$, $$y(0) = 1$$이고, 정확한 답은 $$y(t) = e^t$$다. 오일러 방법은 걸음 크기 $$h$$마다 "잔액 + $$h$$ × 지금의 변화율"로 갱신한다. $$y_{k+1} = y_k + h y_k = (1 + h)y_k$$다.

| 걸음 크기 $$h$$ | 걸음 수 | $$t = 1$$에서의 값 | 참값 $$e$$와의 오차 |
|---|---|---|---|
| 0.5 | 2 | $$1.5^2 = 2.25$$ | 0.468 |
| 0.1 | 10 | $$1.1^{10} \approx 2.5937$$ | 0.125 |
| 0.01 | 100 | $$1.01^{100} \approx 2.7048$$ | 0.0135 |

$$h$$를 10분의 1로 줄이면 오차도 약 10분의 1이 된다. $$h = \frac1n$$이면 값이 정확히 $$\left(1 + \frac1n\right)^n$$이라, [수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/)에서 본 $$e$$의 정의가 곧 오일러 방법의 극한이다. 표의 한 줄 한 줄이 아래 정의의 $$y_k$$이고, 규칙 "변화율 = 잔액"이 $$f(t, y) = y$$다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

**초깃값 문제**는 함수 $$f(t, y)$$와 시작값 $$y(t_0) = y_0$$이 주어질 때 $$y'(t) = f(t, y(t))$$를 만족하는 함수 $$y$$를 찾는 문제다. **오일러 방법**은 걸음 크기 $$h > 0$$로 $$t_k = t_0 + kh$$에서의 근삿값을

$$y_{k+1} = y_k + h\,f(t_k, y_k)$$

로 차례로 구한다. 한 걸음은 지금 점에서의 [선형 근사](/Hongs_Blog/studies/calculus/linear-approx-newton/)를 따라가는 것이다[^1].

</div>


$$f$$가 $$y$$에 대해 립시츠 조건 $$\vert f(t, y) - f(t, z)\vert  \le K\vert y - z\vert $$을 만족하면 해가 존재하고 하나뿐이다[^2]. 가장 기본적인 경우는 $$y' = ky$$다. 해는 $$y = y_0 e^{kt}$$이고, 다른 해 $$z$$가 있어도 $$(z e^{-kt})' = (z' - kz)e^{-kt} = 0$$이라 $$z = y_0 e^{kt}$$뿐이다. 성장($$k > 0$$)과 감쇠($$k < 0$$)의 기본 모델이다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">오일러 방법의 오차</div>

위의 립시츠 조건과 구간 $$[t_0, T]$$에서 $$\vert y''\vert  \le M$$이면, 모든 $$t_k \le T$$에서

$$\vert y_k - y(t_k)\vert  \le \frac{hM}{2K}\left(e^{K(t_k - t_0)} - 1\right).$$

곧 전역 오차는 $$h$$에 비례한다(1차 방법). 한 걸음에서 생기는 오차는 테일러 전개의 나머지 $$\frac{h^2}{2}y''$$ 크기라 $$h^2$$에 비례하고, $$\frac{T - t_0}{h}$$걸음이 쌓여 $$h$$가 된다[^2].

</div>


## 예제

**걸음이 크면 폭발한다(안정성).** $$y' = -10y$$, $$y(0) = 1$$. 참값 $$e^{-10t}$$은 빠르게 0으로 줄어든다.

1. *갱신 인수:* $$y_{k+1} = y_k + h(-10y_k) = (1 - 10h)y_k$$.
2. *$$h = 0.05$$:* 인수 0.5. 매 걸음 절반씩, 참값처럼 줄어든다.
3. *$$h = 0.15$$:* 인수 $$-0.5$$. 부호가 바뀌며 줄어든다. 참값에는 없는 진동이지만 0으로는 간다.
4. *$$h = 0.25$$:* 인수 $$-1.5$$. 부호를 바꾸며 커져 40걸음이면 $$10^6$$을 넘는다.
5. *결론:* 줄어들려면 $$\vert 1 - 10h\vert  < 1$$, 곧 $$h < \frac{2}{10} = 0.2$$. 일반적으로 $$y' = -\lambda y$$($$\lambda > 0$$)에서 $$h < \frac{2}{\lambda}$$가 안정 조건이다. 빨리 변하는 성분(큰 $$\lambda$$)이 걸음 크기를 제한한다.

이 조건은 [경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/)의 학습률 조건 $$\eta < \frac2L$$과 같은 식이다. 경사 하강법은 미분방정식 $$\mathbf{x}' = -\nabla f(\mathbf{x})$$(기울기 흐름)에 걸음 크기 $$\eta$$로 오일러 방법을 쓴 것이기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표의 값과 오차, $$h = \frac1n$$에서 $$\left(1 + \frac1n\right)^n$$과 일치, 지수함수 해와 유일성(수치), 전역 오차가 $$h$$에 비례·한 걸음 오차가 $$h^2$$에 비례, 안정성 예제의 세 인수와 폭발, 용수철의 에너지 실험, RK4의 오차 비율, 경사 하강법과 오일러 걸음의 일치 — [29_ode-euler_verify.py](/Hongs_Blog/studies/calculus/code/29_ode-euler_verify/)</div>

</div>


## 활용

- **게임과 물리 시뮬레이션.** 용수철 $$x'' = -x$$를 위치·속도 두 변수의 연립방정식 $$x' = v$$, $$v' = -x$$로 바꿔 푼다. 오일러 방법을 그대로 쓰면 에너지 $$x^2 + v^2$$이 매 걸음 $$(1 + h^2)$$배가 되어, $$h = 0.1$$로 1,000걸음이면 약 2만 배로 불어난다. 속도를 먼저 갱신하고 **새 속도로** 위치를 갱신하는 반암시적(심플렉틱) 오일러는 같은 조건에서 에너지가 처음 값의 약 ±5% 안에서 오르내릴 뿐이다[^s1].
- **더 정확한 방법.** 한 걸음 안에서 기울기를 네 번 재서 섞는 룽게–쿠타 4차 방법(RK4)은 전역 오차가 $$h^4$$에 비례한다. $$h$$를 절반으로 줄이면 오차가 약 16분의 1이 된다. SciPy의 `solve_ivp`는 기본값으로 걸음 크기를 스스로 조절하는 룽게–쿠타 방법(RK45)을 쓴다[^s1].
- **모델링.** 인구·전염병(SIR 모형)·회로·화학 반응처럼 "변화율이 현재 상태로 정해지는" 현상은 모두 미분방정식으로 쓰고, 대부분 수치적으로 푼다.

## 연결

- 선수: [선형 근사](/Hongs_Blog/studies/calculus/linear-approx-newton/)(한 걸음), [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)($$y' = ky$$의 해)
- 같은 구조: [경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/) = 기울기 흐름의 오일러 방법, [선형 점화식](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/)(선형 연립 미분방정식에 오일러 방법을 쓰면 $$\mathbf{y}_{k+1} = (I + hA)\mathbf{y}_k$$라는 행렬 거듭제곱이 된다)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$y' = -2y$$, $$y(0) = 1$$을 걸음 크기 $$0.25$$로 두 걸음 풀어 $$y(0.5)$$의 근삿값을 구하고 참값과 비교하라.</summary>

**답:** 인수 $$1 - 0.25 \cdot 2 = 0.5$$라 $$y_1 = 0.5$$, $$y_2 = 0.25$$. 참값 $$e^{-1} \approx 0.368$$. 걸음이 커서 실제보다 빨리 줄었다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$y' = -\lambda y$$ ($$\lambda > 0$$)는 늘 0으로 줄어드는데, 오일러 방법의 답은 왜 걸음이 크면 발산하는가?</summary>

**답:** 한 걸음마다 $$1 - h\lambda$$가 곱해진다. $$h > \frac2\lambda$$이면 이 수가 $$-1$$보다 작아, 부호를 바꾸며 절댓값이 커진다. 지금의 기울기를 믿고 너무 멀리 가서 0을 크게 지나치고, 반대편의 더 큰 기울기로 다시 더 크게 지나치기를 되풀이한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 경사 하강법 $$\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\nabla f(\mathbf{x}_k)$$를 미분방정식과 오일러 방법의 말로 옮겨라. 학습률은 무엇에 해당하는가?</summary>

**답:** 미분방정식 $$\mathbf{x}'(t) = -\nabla f(\mathbf{x}(t))$$(늘 가장 가파른 내리막으로 흐르는 공)에 오일러 방법을 쓰면 $$\mathbf{x}_{k+1} = \mathbf{x}_k + h\cdot(-\nabla f(\mathbf{x}_k))$$다. 학습률 $$\eta$$가 걸음 크기 $$h$$다. 그래서 두 곳의 안정 조건($$\eta < \frac2L$$, $$h < \frac2\lambda$$)이 같은 모양이다.

</details>


[^1]: OpenStax, *Calculus Volume 2*, 4.1절 "Basics of Differential Equations", 4.2절 "Direction Fields and Numerical Methods"(오일러 방법).
[^2]: Burden, Faires, *Numerical Analysis*, 5.1절(초깃값 문제의 기본 이론: 립시츠 조건과 해의 존재·유일성), 5.2절 "Euler's Method"(오차 한계), 5.4절(룽게–쿠타 방법).
[^s1]: 에이전트 보충. 명시적 오일러와 반암시적 오일러의 에너지 실험, RK4의 오차 비율은 29_ode-euler_verify.py로 확인했다. 반암시적 오일러가 에너지를 오래 보존하는 이론은 Hairer, Lubich, Wanner, *Geometric Numerical Integration* 1장의 심플렉틱 오일러 방법에 있다. `solve_ivp`의 기본값 `method='RK45'`는 SciPy 문서에 적혀 있다.
{% endraw %}
