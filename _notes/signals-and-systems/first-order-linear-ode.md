---
layout: "note"
title: "1계 선형 미분방정식"
display_title: "1계 선형 미분방정식 (First-Order Linear ODE)"
kind: "concept"
kind_label: "기법"
num: "01"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["First-Order Linear ODE", "미분방정식", "Differential Equation", "상미분방정식", "Ordinary Differential Equation", "ODE", "편미분방정식", "Partial Differential Equation", "계수", "Order", "차수", "Degree", "변수분리형", "Separable Equation", "적분인자", "Integrating Factor"]
description: "미분방정식은 \"지금 값이 이렇다면 이만큼 변한다\"는 규칙으로 함수를 찾는 식이다. 전기 회로나 자동차처럼 시간에 따라 변하는 시스템은 대부분 이런 식으로 적힌다. 미분이 한 번만 들어 있고 y가 곱셈이나 제곱 없이 1차로만 나오면, 양변에 알맞은 지수함수를 곱해 한 번에 적분할 수…"
next_url: "/studies/signals-and-systems/second-order-linear-ode/"
next_title: "상수계수 2계 선형 미분방정식"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/first-order-linear-ode/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

미분방정식은 "지금 값이 이렇다면 이만큼 변한다"는 규칙으로 함수를 찾는 식이다. 전기 회로나 자동차처럼 시간에 따라 변하는 시스템은 대부분 이런 식으로 적힌다. 미분이 한 번만 들어 있고 $$y$$가 곱셈이나 제곱 없이 1차로만 나오면, 양변에 알맞은 지수함수를 곱해 한 번에 적분할 수 있다. 다만 이 방법은 $$y$$에 대해 1차인 식에서만 통한다.

</div>


## 예시로 보기

저항 $$R$$과 축전기 $$C$$를 전원 $$v_s(t)$$에 이은 회로(RC 회로)가 있다. 축전기 전압 $$v_c(t)$$는 다음 규칙을 따른다[^1].

$$\frac{dv_c(t)}{dt} + \frac{1}{RC}v_c(t) = \frac{1}{RC}v_s(t)$$


전원을 $$t = 0$$에 켜서 $$v_s = 1$$로 두면, 축전기는 처음엔 빨리 차다가 점점 느리게 찬다. 풀면 $$v_c(t) = 1 - e^{-t/RC}$$이다[^s1]. $$RC$$만큼 시간이 지나면 최종값의 약 63%까지 찬다. 이 식을 왜, 어떻게 이렇게 푸는지가 이 문서의 내용이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/01_first-order-linear-ode_fig1.svg" alt="그림" loading="lazy">

세 곡선 모두 $$t = RC$$에서 최종값의 63%를 지난다. $$RC$$가 클수록 같은 높이에 늦게 닿는다[^s2].

## 정의

미분방정식은 독립 변수($$x$$나 $$t$$), 종속 변수($$y$$), 그리고 $$y$$의 도함수가 함께 들어간 방정식이다[^2].

| 구분 | 뜻 | 예 |
|---|---|---|
| 상미분방정식(ODE) | 독립 변수가 하나뿐이고 보통의 도함수만 있다 | $$\dfrac{dy}{dx} + 6y = e^{-x}$$ |
| 편미분방정식(PDE) | 독립 변수가 둘 이상이고 편도함수가 있다 | $$\dfrac{\partial^2 u}{\partial x^2} + \dfrac{\partial^2 u}{\partial y^2} = 0$$ |
| 계수(order) | 식에 들어 있는 가장 높은 도함수의 차수 | $$y'' + 3xy' + 4y = 1$$은 2계 |
| 차수(degree) | 계수를 정한 그 도함수가 몇 제곱인가 | $$(y'')^2 + 4y + 4 = 0$$은 차수 2 |

**선형 미분방정식**은 $$y$$와 그 도함수들이 모두 1제곱으로만 나오고, 그 계수가 상수이거나 $$x$$만의 함수인 식이다[^3]. $$y$$끼리 곱하거나 $$\sin y$$처럼 $$y$$를 함수 안에 넣으면 비선형이다. 진자의 운동 방정식 $$\theta'' + \omega^2 \sin\theta = 0$$은 비선형이지만, 각이 작을 때 $$\sin\theta \approx \theta$$로 바꾸면 선형 식 $$\theta'' + \omega^2\theta = 0$$이 된다.

### 변수분리형

$$y' = F(x)G(y)$$ 꼴이면 $$y$$가 들어간 것은 왼쪽, $$x$$가 들어간 것은 오른쪽으로 모은 뒤 양변을 적분한다[^4].

$$\frac{1}{G(y)}\,dy = F(x)\,dx$$


예: $$\dfrac{dy}{dx} = y^2 e^{-x}$$이면 $$\dfrac{1}{y^2}dy = e^{-x}dx$$다. 양변을 적분하면 $$-\dfrac{1}{y} = -e^{-x} + k_1$$이므로 $$y = \dfrac{1}{e^{-x} + k_2}$$다.

### 1계 선형: 적분인자

$$y' + p(x)y = g(x)$$ 꼴이면 양변에 $$u(x) = e^{\int p(x)\,dx}$$(적분인자)를 곱한다[^5].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">유도 과정</summary>

1. $$u(x) = e^{\int p\,dx}$$를 미분하면 $$u'(x) = p(x)u(x)$$다. (지수함수 미분과 연쇄 법칙)
2. 원래 식에 $$u$$를 곱하면 $$u y' + p u y = g u$$이고, 1번에 따라 $$p u = u'$$이므로 $$u y' + u' y = g u$$다.
3. 왼쪽은 곱의 미분 $$(uy)' = u'y + uy'$$와 같다. 그래서 $$\dfrac{d}{dx}\bigl(u(x)y\bigr) = g(x)u(x)$$다.
4. 양변을 적분하면 $$u(x)y = \int g(x)u(x)\,dx$$, 즉

$$y = \frac{1}{u(x)}\int g(x)u(x)\,dx = e^{-\int p\,dx}\left[\int g(x)e^{\int p\,dx}dx\right]$$

</details>


적분인자는 왼쪽을 "무엇의 미분" 한 덩어리로 바꿔 주는 장치다. 한 덩어리가 되면 그대로 적분할 수 있다.

## 예제

**예 1** $$y' + y = x$$[^5]

- 적분인자: $$p = 1$$이므로 $$u = e^{x}$$.
- 곱하기: $$e^x y' + e^x y = x e^x$$, 즉 $$(e^x y)' = x e^x$$.
- 적분(부분적분): $$e^x y = x e^x - e^x + C$$.
- 답: $$y = x - 1 + C e^{-x}$$.

**예 2** $$y' + 2y = 5$$[^6]

- $$u = e^{2x}$$, $$(e^{2x}y)' = 5e^{2x}$$, $$e^{2x}y = \tfrac52 e^{2x} + C$$이므로 $$y = \tfrac52 + Ce^{-2x}$$.

**예 3** $$y' + y = x^2$$[^6]

- $$u = e^{x}$$, $$e^x y = \int x^2 e^x dx = x^2e^x - 2xe^x + 2e^x + C$$ (부분적분 두 번)이므로 $$y = x^2 - 2x + 2 + Ce^{-x}$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 세 예의 해와 변수분리형 해를 식에 넣어 양변이 같음(여러 $$C$$와 $$x$$에서), RC 회로 계단 응답을 오일러 방법과 비교 — [01_first-order-linear-ode_verify.py](/Hongs_Blog/studies/signals-and-systems/code/01_first-order-linear-ode_verify/)</div>

</div>


## 활용

- 이 과목에서 시스템을 식으로 적을 때 가장 먼저 나오는 꼴이다. RC 회로, 마찰이 있는 자동차($$\dfrac{dv}{dt} + \dfrac{\rho}{m}v = \dfrac1m f$$)가 모두 $$\dfrac{dy}{dt} + ay = bx$$다[^7].
- 2장에서는 같은 식을 "입력이 들어가기 전에는 조용했다"는 조건과 함께 시스템으로 다룬다.
- 흔한 실수: 적분인자를 곱한 뒤 오른쪽 $$g(x)$$에도 곱하는 것을 잊는다. 또 $$\int p\,dx$$의 적분상수는 넣지 않아도 된다(어느 상수든 양변에 같이 곱해져 없어진다)[^s1].

## 연결

- 선수: [미분방정식과 오일러 방법](/Hongs_Blog/studies/calculus/ode-euler/) (같은 식을 수치로 푸는 방법), [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/)
- 다음: [상수계수 2계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/second-order-linear-ode/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$y' + 3y = 6$$을 적분인자로 풀라.</summary>

**답:** $$u = e^{3x}$$, $$(e^{3x}y)' = 6e^{3x}$$, $$e^{3x}y = 2e^{3x} + C$$이므로 $$y = 2 + Ce^{-3x}$$.<br>
**흔한 오답:** $$u$$를 오른쪽 6에 곱하지 않아 $$e^{3x}y = 6x + C$$로 적는 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 적분인자 $$u = e^{\int p\,dx}$$를 곱하면 왼쪽이 왜 $$(uy)'$$ 하나로 묶이는가?</summary>

**답:** $$u' = pu$$이기 때문이다. 곱하면 왼쪽은 $$uy' + puy = uy' + u'y$$이고, 이것은 곱의 미분 $$(uy)'$$ 그대로다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 다음 중 선형인 것은? ① $$y' + xy^2 = 4$$ ② $$y'' + 3xy' + 4y = 1$$ ③ $$\theta'' + \omega^2\sin\theta = 0$$</summary>

**답:** ②. ①은 $$y^2$$, ③은 $$\sin\theta$$ 때문에 비선형이다. ②의 $$3x$$처럼 계수가 $$x$$의 함수인 것은 괜찮다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/02.Week02_CH01_1_handout.pdf, p.14, p.19
[^2]: 3-1학기/신호 및 시스템/1.수업자료/01.Week01_2_미분방정식.pdf, p.1
[^3]: 같은 자료, p.2
[^4]: 같은 자료, p.5
[^5]: 같은 자료, p.6
[^6]: 같은 자료, p.7
[^7]: 3-1학기/신호 및 시스템/1.수업자료/04.Week04_CH01_3_handout.pdf, p.3~4 (예제 1.8, 1.9)
[^s1]: 에이전트 보충. RC 회로의 계단 응답 $$1 - e^{-t/RC}$$와 63% 값, 적분상수에 관한 설명, 확인 문제 C1은 원본에 없다. 해는 식에 넣어 확인했다.
[^s2]: 에이전트 보충. 그림 1장은 원본에 없다. [01_first-order-linear-ode_plot.py](/Hongs_Blog/studies/signals-and-systems/code/01_first-order-linear-ode_plot/)로 그렸고, 같은 코드로 다음을 확인했다: $$RC = 0.5, 1, 2$$에서 $$v_c(RC) = 1 - e^{-1} \approx 0.632$$이고 오일러 방법으로 푼 값과 같음.
{% endraw %}
