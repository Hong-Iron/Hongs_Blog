---
layout: "note"
title: "시불변성"
display_title: "시불변성 (Time Invariance)"
kind: "concept"
kind_label: "정의"
num: "16"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Time Invariance", "Time-Invariant System", "시불변 시스템", "시변 시스템", "Time-Varying System", "시간 불변"]
description: "시불변 시스템은 오늘 실험하든 내일 실험하든 결과가 같다. 같은 입력을 2초 늦게 넣으면 출력도 모양 그대로 2초 늦게 나온다. 회로의 저항과 축전기 값이 시간에 따라 바뀌지 않으면 시불변이다. 식 안에 입력과 별도로 시간 t나 n이 직접 곱해져 있거나, 시간축을 늘이고 줄이는 연…"
prev_url: "/studies/signals-and-systems/stability/"
prev_title: "안정성"
next_url: "/studies/signals-and-systems/linearity/"
next_title: "선형성"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/time-invariance/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

시불변 시스템은 오늘 실험하든 내일 실험하든 결과가 같다. 같은 입력을 2초 늦게 넣으면 출력도 모양 그대로 2초 늦게 나온다. 회로의 저항과 축전기 값이 시간에 따라 바뀌지 않으면 시불변이다. 식 안에 입력과 별도로 시간 $$t$$나 $$n$$이 직접 곱해져 있거나, 시간축을 늘이고 줄이는 연산이 있으면 대개 시불변이 깨진다.

</div>


## 예시로 보기

$$y(t) = x(2t)$$(빨리 감기)를 시험해 보자(예제 1.16, 그림 1.47)[^1].

1. 입력 $$x_1(t)$$: $$-2 \le t \le 2$$에서 1인 직사각형. 출력 $$y_1(t) = x_1(2t)$$는 $$-1 \le t \le 1$$에서 1이다.
2. 입력을 2만큼 늦춘다: $$x_2(t) = x_1(t - 2)$$는 $$0 \le t \le 4$$에서 1이다.
3. 그 출력: $$y_2(t) = x_2(2t) = x_1(2t - 2)$$는 $$0 \le t \le 2$$에서 1이다.
4. 비교: 시불변이라면 $$y_2$$가 $$y_1(t - 2)$$, 즉 $$1 \le t \le 3$$에서 1이어야 한다. 실제로는 $$0 \le t \le 2$$이므로 다르다.

실제로는 $$y_2(t) = x_1(2(t-1)) = y_1(t - 1)$$이다. 시스템이 시간을 절반으로 압축하므로 입력의 지연도 절반만 반영된다. 그래서 시변 시스템이다.

## 정의

시스템 $$x(t) \to y(t)$$가 시불변이라는 것은 모든 입력과 모든 이동량 $$t_0$$에 대해 다음이 늘 맞는다는 뜻이다[^2].

$$x(t - t_0) \to y(t - t_0)$$


이산 시간에서는 $$x[n - n_0] \to y[n - n_0]$$이다.

**확인 절차**[^2]

1. 임의의 입력 $$x_1$$의 출력 $$y_1$$을 식으로 쓴다.
2. $$x_2(t) = x_1(t - t_0)$$을 넣은 출력 $$y_2$$를 식으로 쓴다. 식의 $$x$$ 자리에 $$x_2$$를 넣는다.
3. $$y_1$$의 식에서 $$t$$를 모두 $$t - t_0$$으로 바꾼 $$y_1(t - t_0)$$을 쓴다.
4. 2와 3이 모든 $$t$$에서 같으면 시불변, 하나라도 다르면 시변이다.

2와 3의 차이가 핵심이다. 2에서는 입력 안의 $$t$$만 밀리고, 3에서는 식 안의 모든 $$t$$가 밀린다.

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$y[n] = nx[n]$$에서 $$y_2[n] = nx_1[n - n_0]$$이다.</summary>

시스템 규칙은 "입력에 지금 시각 $$n$$을 곱한다"이다. 입력 자리에 $$x_2[n] = x_1[n - n_0]$$을 넣으면 곱하는 수는 그대로 $$n$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 그런데 $$y_1[n - n_0] = (n - n_0)x_1[n - n_0]$$이다.</summary>

$$y_1[n] = nx_1[n]$$의 모든 $$n$$을 $$n - n_0$$으로 바꾸면 곱하는 수도 $$n - n_0$$이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. 그래서 시변이다.</summary>

$$n_0 \neq 0$$이고 $$x_1[n - n_0] \neq 0$$인 $$n$$에서 두 식이 $$n_0 x_1[n - n_0]$$만큼 다르다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 판정의 핵심 아이디어는?</summary>

시스템이 "지금이 몇 시인지" 알고 그에 따라 다르게 행동하는지 본다. 시각이 입력을 통하지 않고 식에 직접 들어 있으면 시변이다.

</details>



## 예제

**예제 1.14** $$y(t) = \sin[x(t)]$$[^3]

- $$y_2(t) = \sin[x_2(t)] = \sin[x_1(t - t_0)]$$.
- $$y_1(t - t_0) = \sin[x_1(t - t_0)]$$.
- 같으므로 시불변이다. $$\sin$$이 비선형이어도 시불변일 수 있다.

**예제 1.15** $$y[n] = nx[n]$$[^3]

- 반례: $$x_1[n] = \delta[n]$$이면 $$y_1[n] = n\delta[n] = 0$$(임펄스가 있는 $$n = 0$$에서 곱하는 수가 0).
- $$x_2[n] = \delta[n - 1]$$이면 $$y_2[n] = n\delta[n-1] = \delta[n-1]$$(임펄스가 $$n = 1$$로 옮겨 가 1이 곱해짐).
- 입력은 1만큼 밀렸는데 출력은 0에서 $$\delta[n-1]$$로 바뀌었다. $$y_1$$을 민 것(여전히 0)과 다르므로 시변이다.

**1계 미분방정식** $$\dot y(t) + \alpha(t)y(t) = \beta(t)x(t)$$[^4]

- $$y_1$$을 $$t_0$$만큼 밀면 $$\dot y_1(t - t_0) + \alpha(t - t_0)y_1(t - t_0) = \beta(t - t_0)x_1(t - t_0)$$을 만족한다.
- 계수가 시간에 따라 바뀌지 않으면($$\alpha(t) = \alpha(t - t_0)$$, $$\beta(t) = \beta(t - t_0)$$, 곧 상수) 이 식은 $$x_2$$에 대한 원래 식과 같아진다. 그래서 $$y_1(t - t_0)$$이 $$x_2$$의 출력이고 시불변이다.
- 계수가 시간의 함수면 시변이다. 예: $$\alpha(t) = 0.8 + 0.5t$$.

경계 사례: 입력 0의 응답이 0이 아닌 시스템(초기 조건이 남아 있는 시스템)은 입력을 밀어도 초기 조건은 밀리지 않아 시불변 판정이 달라진다. 2장은 "입력 전에는 조용했다"(initial rest)는 조건을 붙여 이 문제를 피한다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 입력을 밀어 넣은 출력과 출력을 민 것을 비교해 예제 1.14(시불변), 1.15·1.16(시변), 지연기·누산기(시불변), 상수 계수 미분방정식(시불변)과 시간 계수 미분방정식(시변)을 판정. 예제 1.16의 $$y_2(t) = y_1(t - 1)$$ 확인 — [16_time-invariance_verify.py](/Hongs_Blog/studies/signals-and-systems/code/16_time-invariance_verify/)</div>

</div>


단계별 연습: [시스템 성질 판별 예제 사다리](/Hongs_Blog/studies/signals-and-systems/system-properties-ladder/)

## 활용

- 시불변이면서 선형인 시스템(LTI)은 임펄스 하나의 응답만 알면 모든 입력의 응답을 구할 수 있다. 2장 전체가 이 사실 위에 있다.
- 실제 회로는 부품이 데워지거나 낡으면서 조금씩 시변이 된다. 짧은 시간에는 시불변으로 보고 계산한다[^s1].

## 연결

- 선수: [독립 변수의 변환](/Hongs_Blog/studies/signals-and-systems/independent-variable-transform/) (시간 이동)
- 짝: [선형성](/Hongs_Blog/studies/signals-and-systems/linearity/) (둘이 모이면 LTI)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"출력 식에 $$t$$가 안 보이면 시불변이다."</div>

틀렸다. $$y(t) = x(2t)$$에는 $$t$$가 따로 곱해져 있지 않지만 시변이다. 시간축을 압축하는 연산이 지연량까지 바꾸기 때문이다. 확인: 예제 1.16에서 입력을 2만큼 늦추면 출력은 1만큼만 늦는다. 반대로 비선형 함수가 있어도 시불변일 수 있다($$\sin[x(t)]$$).

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"시불변이면 출력이 시간에 따라 변하지 않는다."</div>

틀렸다. 출력 신호는 당연히 시간에 따라 변한다. 변하지 않는 것은 시스템의 규칙이다. 이름의 "불변"이 신호가 아니라 시스템을 꾸민다는 점을 놓쳐서 생기는 오해다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 시불변성의 정의를 식으로 쓰고, 확인할 때 비교하는 두 신호를 말하라.</summary>

**답:** $$x(t - t_0) \to y(t - t_0)$$ (모든 $$t_0$$). 비교하는 것: 입력을 민 뒤 시스템에 넣은 출력 $$y_2(t)$$와, 원래 출력을 민 $$y_1(t - t_0)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 시불변인가? ① $$y(t) = x(t - 3)$$ ② $$y[n] = x[-n]$$ ③ $$y(t) = x(t)\cos t$$ ④ $$y[n] = x[n]^2 + 1$$</summary>

**답:** ① 시불변 ② 시변 (입력을 $$n_0$$ 늦추면 출력은 $$n_0$$ 앞당겨진다) ③ 시변 ($$\cos t$$가 시각을 직접 쓴다) ④ 시불변.<br>
**흔한 오답:** ②를 시불변으로 고르는 것.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예제 1.16에서 $$y_2(t) = x_1(2t - 2) = y_1(t - 1)$$이다. 마지막 등호의 이유는?</summary>

**답:** $$y_1(s) = x_1(2s)$$에 $$s = t - 1$$을 넣으면 $$y_1(t - 1) = x_1(2(t-1)) = x_1(2t - 2)$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$y[n] = x[2n]$$(두 칸마다 하나씩 뽑기)이 시변임을 보이는 입력과 이동량을 들라.</summary>

**답:** $$x_1 = \delta[n]$$이면 $$y_1 = \delta[n]$$. $$x_2 = \delta[n-1]$$이면 $$y_2[n] = \delta[2n - 1] = 0$$(모든 정수 $$n$$에서 $$2n \ne 1$$). 시불변이라면 $$y_1[n-1] = \delta[n-1]$$이어야 하는데 0이므로 시변이다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/04.Week04_CH01_3_handout.pdf, p.18 (예제 1.16, 그림 1.47)
[^2]: 같은 자료, p.15
[^3]: 같은 자료, p.17 (예제 1.14, 1.15)
[^4]: 같은 자료, p.16
[^s1]: 에이전트 보충. 초기 조건이 남은 시스템에 관한 경계 사례, 부품 노화 예, 스스로 설명해 보기, 오해 항목, 확인 문제 C2~C4는 원본에 없다. 판정은 검증 코드로 확인했다.
{% endraw %}
