---
layout: "note"
title: "상수계수 2계 선형 미분방정식"
display_title: "상수계수 2계 선형 미분방정식 (Second-Order Linear ODE with Constant Coefficients)"
kind: "concept"
kind_label: "기법"
num: "02"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Second-Order Linear ODE with Constant Coefficients", "특성방정식", "Characteristic Equation", "제차", "Homogeneous", "비제차", "Non-homogeneous", "일반해", "General Solution", "특수해", "Particular Solution", "미정계수법", "Method of Undetermined Coefficients", "초기 조건", "Initial Condition"]
description: "지수함수 e^{\\lambda x}는 미분해도 모양이 그대로이고 앞에 \\lambda만 붙는다. 그래서 ay'' + by' + cy = 0에 e^{\\lambda x}를 넣으면 미분방정식이 2차방정식 a\\lambda^2 + b\\lambda + c = 0으로 바뀌고, 그 두 근이 답의 모…"
prev_url: "/studies/signals-and-systems/first-order-linear-ode/"
prev_title: "1계 선형 미분방정식"
next_url: "/studies/signals-and-systems/ct-dt-signals/"
next_title: "연속 시간 신호와 이산 시간 신호"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/second-order-linear-ode/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

지수함수 $$e^{\lambda x}$$는 미분해도 모양이 그대로이고 앞에 $$\lambda$$만 붙는다. 그래서 $$ay'' + by' + cy = 0$$에 $$e^{\lambda x}$$를 넣으면 미분방정식이 2차방정식 $$a\lambda^2 + b\lambda + c = 0$$으로 바뀌고, 그 두 근이 답의 모양을 정한다. 근이 실수면 늘거나 줄고, 복소수면 진동하며 늘거나 준다. 오른쪽에 입력이 있으면 그 입력과 닮은 해를 하나 더 찾아 더한다. 단, 계수 $$a, b, c$$가 상수일 때만 이 방법이 통한다.

</div>


## 예시로 보기

용수철에 매단 추, 진자, 저항·코일·축전기가 함께 있는 회로는 모두 2계 식이다. 예를 들어 $$y'' - y' - 6y = 0$$을 보자[^1].

1. $$y = e^{\lambda x}$$를 넣는다. $$y' = \lambda e^{\lambda x}$$, $$y'' = \lambda^2 e^{\lambda x}$$이므로 $$e^{\lambda x}(\lambda^2 - \lambda - 6) = 0$$이다.
2. $$e^{\lambda x}$$는 0이 아니므로 $$\lambda^2 - \lambda - 6 = (\lambda - 3)(\lambda + 2) = 0$$, 즉 $$\lambda = 3, -2$$다.
3. 두 해를 섞은 $$y = C_1 e^{-2x} + C_2 e^{3x}$$가 모든 해다.

미분 문제가 인수분해 문제로 바뀐 것이 핵심이다. 지수함수를 넣는 이유는, 미분해도 상수배만 다른 함수여야 식의 각 항이 같은 모양으로 묶여 상쇄될 수 있기 때문이다[^2].

## 정의

**제차식.** 오른쪽이 0인 $$ay'' + by' + cy = 0$$ ($$a \neq 0$$, $$a, b, c$$는 실수 상수)에 $$y = e^{\lambda x}$$를 넣어 얻는 $$a\lambda^2 + b\lambda + c = 0$$을 특성방정식이라 한다. 근 $$\lambda_{1,2} = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$의 종류에 따라 일반해(모든 해를 담은 식)가 셋으로 갈린다[^2].

| 근 | 일반해 |
|---|---|
| 서로 다른 두 실근 $$\lambda_1 \neq \lambda_2$$ ($$b^2 > 4ac$$) | $$y = C_1 e^{\lambda_1 x} + C_2 e^{\lambda_2 x}$$ |
| 중근 $$\lambda$$ ($$b^2 = 4ac$$) | $$y = C_1 e^{\lambda x} + C_2 x e^{\lambda x}$$ |
| 켤레 복소근 $$\lambda = \alpha \pm j\beta$$ ($$b^2 < 4ac$$) | $$y = e^{\alpha x}(C_1\cos\beta x + C_2 \sin\beta x)$$ |

복소근일 때는 오일러 공식 $$e^{j\beta x} = \cos\beta x + j\sin\beta x$$로 $$C_1 e^{(\alpha + j\beta)x} + C_2 e^{(\alpha - j\beta)x}$$를 풀어 쓴 뒤, 계수를 새 상수로 묶는다. $$e^{\alpha x}$$는 크기가 늘거나 줄게 하고, $$\cos$$와 $$\sin$$은 진동하게 한다. 이 교재는 허수 단위를 $$j$$로 쓴다(1주차 자료는 $$i$$와 섞어 쓴다)[^3].

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/02_second-order-linear-ode_fig1.svg" alt="그림" loading="lazy">

위 두 칸은 실근(예 1)과 중근($$y'' - 2y' + y = 0$$, $$y(0) = 0$$, $$y'(0) = 1$$이면 $$y = xe^x$$)의 해이고, 아래 두 칸은 복소근의 해다. 복소근이면 진동하고, 점선이 정하는 진폭은 실수부 $$\alpha$$가 양수면 커지고(예 2) 음수면 줄어든다($$-0.5 \pm j3$$)[^s2].

**비제차식.** $$ay'' + by' + cy = g(x)$$의 일반해는 "제차식의 일반해 $$y_h$$ + 특수해 $$y_p$$ 하나"다. $$y_p$$는 미정계수법으로 찾는다. 다항식을 미분하면 다항식, 지수함수는 지수함수, $$\sin$$·$$\cos$$은 $$\sin$$·$$\cos$$이 나오므로 $$g$$와 같은 꼴에 모르는 계수를 붙여 넣고 계수를 맞춘다[^4].

| $$g(x)$$ | $$y_p$$의 꼴 |
|---|---|
| 상수 1 | $$A$$ |
| $$5x + 7$$ | $$Ax + B$$ |
| $$3x^2 - 2$$ | $$Ax^2 + Bx + C$$ |
| $$\sin 4x$$ 또는 $$\cos 4x$$ | $$A\cos 4x + B\sin 4x$$ |
| $$e^{5x}$$ | $$Ae^{5x}$$ |

이 표는 $$g$$가 다항식, $$\sin$$·$$\cos$$, 지수함수와 그 선형결합일 때만 쓸 수 있다[^4]. 또 $$g$$의 꼴이 이미 $$y_h$$에 들어 있으면(예: $$g = e^{x}$$인데 특성근에 1이 있으면) 그 꼴을 넣어도 0이 되므로 $$x$$를 한 번 더 곱한 꼴을 넣어야 한다[^s1].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 특성방정식의 근이 $$\alpha \pm j\beta$$이면 $$y = e^{\alpha x}(C_1 \cos\beta x + C_2\sin\beta x)$$로 쓸 수 있다.</summary>

$$e^{(\alpha \pm j\beta)x} = e^{\alpha x}e^{\pm j\beta x}$$이고 오일러 공식으로 $$e^{\pm j\beta x} = \cos\beta x \pm j\sin\beta x$$다. $$C_1e^{j\beta x} + C_2 e^{-j\beta x} = (C_1 + C_2)\cos\beta x + j(C_1 - C_2)\sin\beta x$$이므로 앞의 두 괄호를 새 상수로 바꾼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 비제차식의 일반해는 $$y_h + y_p$$다.</summary>

식이 선형이라 $$y$$에 대해 덧셈이 그대로 통한다. $$y_p$$를 넣으면 $$g$$, $$y_h$$를 넣으면 0이 나오므로 둘의 합을 넣으면 $$g + 0 = g$$다. 반대로 해 두 개의 차이는 제차식을 만족하므로 모든 해가 이 꼴이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 방법의 핵심 아이디어는?</summary>

미분해도 꼴이 변하지 않는 함수(지수함수)를 넣어, 미분 연산을 곱셈($$\lambda$$)으로 바꾼다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 생각을 쓸 수 있는 다른 상황은?</summary>

상수계수 선형 점화식 $$a_n = c_1 a_{n-1} + c_2 a_{n-2}$$에 $$r^n$$을 넣는 것. 2장의 차분방정식, 3장에서 $$e^{st}$$를 LTI 시스템에 넣는 것도 같은 생각이다.

</details>



## 예제

**문제를 알아보는 신호:** 계수가 모두 상수이고, $$y$$와 도함수가 1차로만 나온다.

**예 1 (초기 조건이 있는 실근)** $$y'' + 11y' + 24y = 0$$, $$y(0) = 0$$, $$y'(0) = -7$$[^5]

- 특성근: $$\lambda^2 + 11\lambda + 24 = (\lambda + 8)(\lambda + 3) = 0$$이므로 $$\lambda = -8, -3$$.
- 일반해: $$y = C_1 e^{-8x} + C_2 e^{-3x}$$.
- 초기 조건: $$C_1 + C_2 = 0$$, $$-8C_1 - 3C_2 = -7$$을 풀면 $$C_1 = 1.4$$, $$C_2 = -1.4$$.
- 답: $$y = 1.4e^{-8x} - 1.4e^{-3x}$$.

**예 2 (복소근)** $$y'' - 4y' + 9y = 0$$, $$y(0) = 0$$, $$y'(0) = -8$$[^6]

- 특성근: $$\lambda = \dfrac{4 \pm \sqrt{16 - 36}}{2} = 2 \pm j\sqrt5$$.
- 일반해: $$y = e^{2x}(C_3\cos\sqrt5 x + C_4 \sin\sqrt5 x)$$.
- 초기 조건: $$y(0) = C_3 = 0$$. 그러면 $$y' = 2e^{2x}C_4\sin\sqrt5x + \sqrt5 e^{2x}C_4\cos\sqrt5 x$$이고 $$y'(0) = \sqrt5 C_4 = -8$$이므로 $$C_4 = -\dfrac{8\sqrt5}{5}$$.
- 답: $$y = -\dfrac{8\sqrt5}{5}e^{2x}\sin(\sqrt5 x)$$.

**예 3 (미정계수법)** $$x'' - x' + x = 2\sin 3t$$[^7]

- 특수해 꼴: $$\sin 3t$$를 미분하면 $$\sin$$과 $$\cos$$이 번갈아 나오므로 $$x_p = A\cos 3t + B\sin 3t$$.
- 넣기: $$x_p'' - x_p' + x_p = -(8A + 3B)\cos 3t + (3A - 8B)\sin 3t$$.
- 계수 맞추기: $$8A + 3B = 0$$, $$3A - 8B = 2$$에서 $$A = \dfrac{6}{73}$$, $$B = -\dfrac{16}{73}$$.

경계 사례: 중근 $$y'' - 2y' + y = 0$$이면 $$\lambda = 1$$ 하나뿐이라 $$e^x$$만으로는 상수가 하나 모자란다. 두 번째 해 $$xe^x$$를 넣어야 초기 조건 두 개를 맞출 수 있다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 1주차 예제 모두(실근·중근·복소근, 초기 조건, 미정계수법 두 개)의 해를 식에 넣어 양변이 같음, 특성근과 연립식의 해 일치 — [02_second-order-linear-ode_verify.py](/Hongs_Blog/studies/signals-and-systems/code/02_second-order-linear-ode_verify/)</div>

</div>


예제를 단계별로 연습하려면 [미분방정식 풀이 예제 사다리](/Hongs_Blog/studies/signals-and-systems/ode-ladder/)를 본다.

## 활용

- 2장에서 시스템을 미분방정식으로 적고 출력을 구할 때 이 방법을 그대로 쓴다. 제차해는 시스템이 스스로 움직이는 부분(고유 응답), 특수해는 입력을 따라가는 부분(강제 응답)이 된다[^s1].
- 특성근의 실수부가 음수면 제차해가 시간이 지나며 사라진다. 이것이 15번 문서의 안정성과 이어진다.
- 흔한 실수: 복소근인데 $$e^{\alpha x}$$를 빼먹고 $$\cos$$·$$\sin$$만 쓰는 것, 초기 조건을 넣기 전에 일반해를 실수 꼴로 정리하지 않아 계산이 길어지는 것.

## 연결

- 선수: [1계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/first-order-linear-ode/), [복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)
- 같은 구조: [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/) (특성방정식의 근으로 일반항을 쓰는 방법이 똑같다)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"특수해를 찾았으면 그게 답이다."</div>

틀렸다. 특수해는 해 가운데 하나일 뿐이다. 특수해만 맞춰도 식은 만족하니 그럴듯해 보인다. 하지만 초기 조건을 맞추려면 $$y_h + y_p$$에서 $$C_1, C_2$$를 정해야 한다. 확인: $$y'' - 4y' + 3y = x$$에서 $$y_p = \frac x3 + \frac49$$는 $$y(0) = 0$$을 만족하지 못한다. $$C_1e^x + C_2e^{3x}$$를 더해야 맞출 수 있다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 특성근이 ① 서로 다른 실근 ② 중근 ③ $$\alpha \pm j\beta$$일 때 일반해를 쓰라.</summary>

**답:** ① $$C_1e^{\lambda_1x} + C_2 e^{\lambda_2 x}$$ ② $$(C_1 + C_2 x)e^{\lambda x}$$ ③ $$e^{\alpha x}(C_1\cos\beta x + C_2\sin\beta x)$$.<br>
**흔한 오답:** 중근에서 $$x$$를 곱한 해를 빠뜨리는 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$y'' + 2y' + 3y = 0$$의 일반해를 구하라.</summary>

**답:** $$\lambda = -1 \pm j\sqrt2$$이므로 $$y = e^{-x}(C_1\cos\sqrt2x + C_2\sin\sqrt2x)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 왜 하필 $$e^{\lambda x}$$를 넣어 보는가?</summary>

**답:** 지수함수는 미분해도 $$\lambda$$배만 될 뿐 꼴이 같다. 그래서 $$y, y', y''$$가 모두 $$e^{\lambda x}$$의 상수배가 되어 하나로 묶이고, 미분방정식이 $$\lambda$$에 대한 대수방정식으로 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 미정계수법에서 $$g(x) = \sin 3t$$인데 $$x_p = B\sin 3t$$만 넣으면 왜 안 되는가?</summary>

**답:** 식에 $$x'$$ 항이 있어서 $$\sin 3t$$를 한 번 미분한 $$\cos 3t$$가 생긴다. $$B\sin 3t$$만으로는 이 $$\cos$$ 항을 없앨 계수가 없다. 그래서 $$A\cos 3t + B\sin 3t$$를 넣는다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/01.Week01_2_미분방정식.pdf, p.9 (ex.1)
[^2]: 같은 자료, p.8
[^3]: 같은 자료, p.8 (복소근의 풀이), 3-1학기/신호 및 시스템/1.수업자료/01.Week01_1_자연상수와 오일러 등식.pdf, p.1
[^4]: 같은 자료(01.Week01_2_미분방정식.pdf), p.11 (미정계수 테이블)
[^5]: 같은 자료, p.9 (ex.2)
[^6]: 같은 자료, p.10 (ex.4)
[^7]: 같은 자료, p.13 (ex.2)
[^s1]: 에이전트 보충. 중근의 예 $$y'' - 2y' + y = 0$$, $$g$$가 제차해와 겹칠 때 $$x$$를 곱하는 규칙, 고유 응답·강제 응답의 이름, 스스로 설명해 보기, 오해 항목, 확인 문제 C4는 원본에 없다. 표준 미분방정식 교재(Zill, *Differential Equations* 4장)의 내용이며 해는 식에 넣어 확인했다.
[^s2]: 에이전트 보충. 그림 1장은 원본에 없다. [02_second-order-linear-ode_plot.py](/Hongs_Blog/studies/signals-and-systems/code/02_second-order-linear-ode_plot/)로 그렸고, 같은 코드로 다음을 확인했다: 예 1의 $$1.4e^{-8x} - 1.4e^{-3x}$$, 예 2의 $$-\frac{8\sqrt5}{5}e^{2x}\sin\sqrt5x$$, 중근의 $$xe^x$$, 감쇠 예 $$e^{-0.5x}\cos 3x$$($$y'' + y' + 9.25y = 0$$, $$y(0) = 1$$, $$y'(0) = -0.5$$)가 각자의 식과 초기 조건을 만족함. 감쇠 예는 원본에 없는 식이다.
{% endraw %}
