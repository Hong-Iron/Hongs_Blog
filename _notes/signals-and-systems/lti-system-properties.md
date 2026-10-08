---
layout: "note"
title: "임펄스 응답으로 본 LTI 시스템의 성질"
display_title: "임펄스 응답으로 본 LTI 시스템의 성질 (Properties of LTI Systems)"
kind: "concept"
kind_label: "정리"
num: "21"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Properties of LTI Systems", "LTI 시스템의 기억", "LTI 시스템의 가역성", "LTI 시스템의 인과성", "LTI 시스템의 안정성", "절대 합 가능", "Absolutely Summable", "절대 적분 가능", "Absolutely Integrable", "역시스템", "Inverse System"]
description: "LTI 시스템은 임펄스 응답 h 하나로 모든 것이 정해지므로, 1장에서 입력과 출력을 다 시험해야 했던 성질들을 h의 모양만 보고 판정할 수 있다. 0 밖에서 0이면 기억이 없고, 음의 시각에서 0이면 인과적이고, 크기를 모두 더한 값이 유한하면 안정이다. 역시스템은 컨벌루션해서 …"
prev_url: "/studies/signals-and-systems/convolution-properties/"
prev_title: "컨벌루션의 성질"
next_url: "/studies/signals-and-systems/step-response/"
next_title: "단위 계단 응답"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/lti-system-properties/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

LTI 시스템은 임펄스 응답 $$h$$ 하나로 모든 것이 정해지므로, 1장에서 입력과 출력을 다 시험해야 했던 성질들을 $$h$$의 모양만 보고 판정할 수 있다. 0 밖에서 0이면 기억이 없고, 음의 시각에서 0이면 인과적이고, 크기를 모두 더한 값이 유한하면 안정이다. 역시스템은 컨벌루션해서 $$\delta$$가 되는 $$h_1$$이다. 이 판정법은 LTI 시스템에만 쓸 수 있다.

</div>


## 예시로 보기

| 시스템 | $$h[n]$$ | 기억 | 인과 | 안정 |
|---|---|---|---|---|
| $$y[n] = 3x[n]$$ | $$3\delta[n]$$ | 없음 | 예 | 예 |
| $$y[n] = x[n - 2]$$ | $$\delta[n - 2]$$ | 있음 | 예 | 예 |
| $$y[n] = x[n] + x[n + 1]$$ | $$\delta[n] + \delta[n+1]$$ | 있음 | 아니오 ($$h[-1] = 1$$) | 예 |
| 누산기 $$\sum_{k \le n}x[k]$$ | $$u[n]$$ | 있음 | 예 | 아니오 ($$\sum u = \infty$$) |

표의 칸을 채우는 데 입력 신호를 하나도 넣지 않았다. $$h$$만 봤다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

임펄스 응답이 $$h[n]$$ ($$h(t)$$)인 LTI 시스템에 대해[^1][^2][^3][^4]

| 성질 | 이산 시간 조건 | 연속 시간 조건 |
|---|---|---|
| 기억 없음 | $$n \ne 0$$에서 $$h[n] = 0$$, 즉 $$h[n] = K\delta[n]$$ | $$h(t) = K\delta(t)$$ |
| 가역 | $$h[n] * h_1[n] = \delta[n]$$인 $$h_1$$이 있다 | $$h(t) * h_1(t) = \delta(t)$$ |
| 인과 | $$n < 0$$에서 $$h[n] = 0$$ | $$t < 0$$에서 $$h(t) = 0$$ |
| 안정 | $$\sum_{k=-\infty}^{\infty}\lvert h[k]\rvert < \infty$$ | $$\int_{-\infty}^{\infty}\lvert h(\tau)\rvert d\tau < \infty$$ |

기억 없음과 인과는 "필요충분"이다(⇔). 안정 조건도 필요충분이다.

</div>


**기억 없음.** $$y[n] = \cdots + x[n+1]h[-1] + x[n]h[0] + x[n-1]h[1] + \cdots$$이므로, $$x[n]$$만 쓰려면 $$h[0]$$ 말고는 모두 0이어야 한다[^1]. 그러면 $$y[n] = Kx[n]$$이고, $$K = 1$$이면 항등 시스템 $$x * \delta = x$$다.

**인과.** $$y[n] = \sum_k h[k]x[n-k]$$에서 $$k < 0$$인 항은 미래 입력 $$x[n - k]$$를 쓴다. 이 항들이 모두 0이려면 $$h[k] = 0$$ ($$k < 0$$)이어야 한다. 이때 $$y[n] = \sum_{k=0}^{\infty}h[k]x[n-k]$$, $$y(t) = \int_0^\infty h(\tau)x(t-\tau)d\tau$$로 쓸 수 있다[^3].

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">안정 조건이 충분조건인 이유</summary>

모든 $$n$$에서 $$\vert x[n]\vert  < B$$라 하자[^4].
1. $$\vert y[n]\vert  = \left\vert \sum_k h[k]x[n-k]\right\vert $$ (컨벌루션)
2. $$\le \sum_k \vert h[k]\vert \vert x[n-k]\vert $$ (합의 크기는 크기의 합을 넘지 않는다)
3. $$\le B\sum_k\vert h[k]\vert $$ (모든 $$\vert x\vert  < B$$)
4. 그래서 $$\sum\vert h[k]\vert  < \infty$$이면 모든 $$n$$에서 $$\vert y[n]\vert $$이 같은 수로 묶인다. 연속 시간도 합을 적분으로 바꿔 같다.

필요조건(절대 합이 무한대면 불안정한 유계 입력이 있다)은 $$x[n] = \mathrm{sign}(h[-n])$$을 넣어 $$y[0] = \sum\vert h[k]\vert $$로 만드는 방법으로 보인다[^s1].

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 왜 인과 조건이 $$h[n] = 0$$ ($$n < 0$$)인가?</summary>

$$h[n]$$은 $$n = 0$$에 넣은 임펄스에 대한 출력이다. $$n < 0$$에 출력이 나오면, 입력이 들어오기도 전에 반응한 것이므로 미래 입력을 쓴 셈이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 누산기의 역시스템이 첫 번째 차 $$\delta[n] - \delta[n-1]$$인 이유는?</summary>

분배법칙으로 $$u * (\delta[n] - \delta[n-1]) = u[n] - u[n-1] = \delta[n]$$이다. 그래서 둘을 직렬로 이으면 항등 시스템이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

LTI 시스템의 모든 성질은 $$h$$ 안에 들어 있다. 입력 전체를 시험하는 대신 $$h$$ 한 줄을 검사한다.

</details>


## 예제

**예제 2.11 순수 시간 이동** $$y(t) = x(t - t_0)$$[^5]

- 임펄스 응답: $$\delta(t)$$를 넣으면 $$h(t) = \delta(t - t_0)$$.
- 성질 ①: $$x(t) * \delta(t - t_0) = x(t - t_0)$$. 옮긴 임펄스와 컨벌루션하면 신호가 그만큼 옮겨진다. 표본화 성질 $$\int x(\tau)\delta(\tau - a)d\tau = x(a)$$와 $$\delta$$가 짝함수($$\delta(t) = \delta(-t)$$)라는 것에서 나온다.
- 역시스템: 다시 앞당기면 된다. $$h_1(t) = \delta(t + t_0)$$이고 $$\delta(t - t_0) * \delta(t + t_0) = \delta(t)$$.
- 기억: $$t_0 = 0$$이면 항등 시스템이라 기억 없음, $$t_0 \ne 0$$이면 기억 있음. 인과: $$t_0 \ge 0$$이면 인과(지연), $$t_0 < 0$$이면 비인과.
- 안정: $$\int\vert \delta(\tau - t_0)\vert d\tau = 1$$이라 안정이다(예제 2.13)[^6].

**예제 2.12 누산기** $$h[n] = u[n]$$[^7]

- 출력: $$n - k < 0$$이면 $$u[n-k] = 0$$이므로 $$y[n] = \sum_{k=-\infty}^{n}x[k]$$. 지금까지 들어온 입력을 모두 더한다.
- 역시스템: $$y[n] = x[n] - x[n-1]$$(첫 번째 차). 임펄스 응답 $$h_1 = \delta[n] - \delta[n-1]$$.
- 확인: $$u * \delta[n] = u[n]$$, $$u * \delta[n-1] = u[n-1]$$이므로 $$h * h_1 = u[n] - u[n-1] = \delta[n]$$.
- 안정: $$\sum\vert u[n]\vert  = \infty$$라 불안정. 연속 시간 적분기도 $$h(t) = u(t)$$, $$\int\vert u\vert  = \infty$$로 불안정이다(예제 2.13). 적분기의 역시스템은 미분기다[^6].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 누산기와 첫 번째 차의 컨벌루션이 $$\delta$$, $$\delta[n-k] * \delta[n+k] = \delta$$, 이동·기억 없는 시스템의 출력, 절대 합 2인 $$h$$의 출력 한계 $$B\sum\vert h\vert $$, 누산기의 발산 확인 — [21_lti-system-properties_verify.py](/Hongs_Blog/studies/signals-and-systems/code/21_lti-system-properties_verify/)</div>

</div>


## 활용

- 디지털 필터를 설계할 때 $$h$$의 절대 합을 보고 안정성을 먼저 확인한다. 실시간 필터는 $$h[n] = 0$$ ($$n < 0$$)인 인과 필터만 쓸 수 있다.
- 통신의 채널 보정(이퀄라이저)은 채널 $$h$$의 역시스템 $$h_1$$을 근사해 신호를 되살리는 것이다[^s1].
- 흔한 실수: 안정을 "$$h$$가 유계"로 착각하는 것. $$u[n]$$은 유계지만 절대 합이 무한대라 불안정이다.

## 연결

- 선수: [기억과 가역성](/Hongs_Blog/studies/signals-and-systems/memory-invertibility/), [인과성](/Hongs_Blog/studies/signals-and-systems/causality/), [안정성](/Hongs_Blog/studies/signals-and-systems/stability/) (1장의 일반 정의), [컨벌루션의 성질](/Hongs_Blog/studies/signals-and-systems/convolution-properties/)
- 다음: [단위 계단 응답](/Hongs_Blog/studies/signals-and-systems/step-response/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$h[n]$$이 유계(크기가 어떤 수를 넘지 않음)이면 시스템은 안정이다."</div>

틀렸다. "유계 입력 유계 출력"이라는 이름 때문에 $$h$$도 유계면 된다고 생각하기 쉽다. 하지만 출력은 $$h$$를 무한히 많이 더한 것이라, 각 값이 작아도 합이 무한대면 출력이 커질 수 있다. 확인: $$h = u[n]$$은 모든 값이 1 이하지만 $$x = u[n]$$을 넣으면 $$y[n] = n + 1$$로 끝없이 커진다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** LTI 시스템이 인과적일 조건과 안정할 조건을 이산·연속 시간으로 쓰라.</summary>

**답:** 인과: $$h[n] = 0$$ ($$n < 0$$), $$h(t) = 0$$ ($$t < 0$$). 안정: $$\sum\vert h[k]\vert  < \infty$$, $$\int\vert h(\tau)\vert d\tau < \infty$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$h[n] = (0.9)^n u[n]$$, $$h[n] = (1.1)^n u[n]$$, $$h[n] = (0.9)^{\vert n\vert }$$은 각각 인과·안정인가?</summary>

**답:** 첫째: 인과, 안정(합 10). 둘째: 인과, 불안정(합이 무한대). 셋째: 비인과($$n < 0$$에서 0이 아님), 안정(합 $$1 + 2 \cdot 9 = 19$$).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 안정 조건 증명에서 $$\vert \sum_k h[k]x[n-k]\vert  \le \sum_k\vert h[k]\vert \vert x[n-k]\vert $$는 어떤 성질에서 나오는가?</summary>

**답:** 삼각부등식(여러 수의 합의 크기는 각 크기의 합을 넘지 않는다)과 $$\vert ab\vert  = \vert a\vert \vert b\vert $$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$h[n] = \delta[n] - 0.5\delta[n-1]$$인 시스템의 역시스템 임펄스 응답 $$h_1$$을 구하라 (인과적인 것).</summary>

**답:** $$h_1[n] = (0.5)^n u[n]$$. $$h * h_1 = (0.5)^n u[n] - 0.5 \cdot (0.5)^{n-1}u[n-1] = (0.5)^n(u[n] - u[n-1]) = \delta[n]$$.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/06.Week06_CH02_2_handout.pdf, p.8~9
[^2]: 같은 자료, p.10 (그림 2.26)
[^3]: 같은 자료, p.15~16
[^4]: 같은 자료, p.17
[^5]: 같은 자료, p.11~12 (예제 2.11)
[^6]: 같은 자료, p.18 (예제 2.13)
[^7]: 같은 자료, p.13~14 (예제 2.12)
[^s1]: 에이전트 보충. 맨 앞 표, 안정 조건의 필요조건 증명 방법(Oppenheim·Willsky 2판 문제 2.49), 채널 보정 예, 오해 항목, 확인 문제 C2~C4는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
