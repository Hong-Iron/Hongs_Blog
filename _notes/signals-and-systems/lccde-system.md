---
layout: "note"
title: "미분방정식으로 표현한 LTI 시스템"
display_title: "미분방정식으로 표현한 LTI 시스템 (Systems Described by Differential Equations)"
kind: "concept"
kind_label: "기법"
num: "23"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Linear Constant-Coefficient Differential Equation", "LCCDE", "선형 상수계수 미분방정식", "초기 휴지 조건", "Initial Rest", "자연 응답", "Natural Response", "강제 응답", "Forced Response", "입력 0 응답", "영상태 응답", "보조 조건", "Auxiliary Condition"]
description: "회로나 자동차처럼 물리 법칙으로 만든 시스템은 입력과 출력의 관계가 상수계수 미분방정식으로 적힌다. 그런데 미분방정식만으로는 답이 하나로 정해지지 않는다. 그래서 \"입력이 들어오기 전에는 시스템이 완전히 조용했다\"(초기 휴지 조건)를 덧붙인다. 그러면 시스템이 인과적인 LTI가 되…"
prev_url: "/studies/signals-and-systems/step-response/"
prev_title: "단위 계단 응답"
next_url: "/studies/signals-and-systems/difference-equation-system/"
next_title: "차분방정식으로 표현한 LTI 시스템"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/lccde-system/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

회로나 자동차처럼 물리 법칙으로 만든 시스템은 입력과 출력의 관계가 상수계수 미분방정식으로 적힌다. 그런데 미분방정식만으로는 답이 하나로 정해지지 않는다. 그래서 "입력이 들어오기 전에는 시스템이 완전히 조용했다"(초기 휴지 조건)를 덧붙인다. 그러면 시스템이 인과적인 LTI가 되고, 출력은 입력을 따라가는 부분(강제 응답)과 시스템이 스스로 움직이는 부분(자연 응답)의 합이 된다. 초기 휴지 조건 없이 다른 초기값을 주면 LTI가 아닐 수 있다.

</div>


## 예시로 보기

자동차 예제 1.9의 식 $$\frac{dv}{dt} + \frac{\rho}{m}v = \frac1m f$$에서 $$\frac{\rho}{m} = 2$$, $$\frac1m = 1$$로 두면 $$\frac{dy}{dt} + 2y = x$$다[^1]. 입력 $$x$$는 엔진 힘, 출력 $$y$$는 속도다.

이 식을 만족하는 $$y$$는 무수히 많다. 예를 들어 입력이 0이어도 $$y = Ae^{-2t}$$는 모든 $$A$$에 대해 식을 만족한다. 차가 처음에 얼마나 빨리 달리고 있었는지 모르면 미래의 속도도 모른다. 그래서 출발 조건이 하나 더 필요하다[^1].

## 정의

**$$N$$차 선형 상수계수 미분방정식**[^2]

$$\sum_{k=0}^{N}a_k\frac{d^ky(t)}{dt^k} = \sum_{k=0}^{M}b_k\frac{d^kx(t)}{dt^k}$$


차수 $$N$$은 출력 $$y$$를 가장 많이 미분한 횟수다.

- $$N = 0$$이면 $$y(t) = \frac{1}{a_0}\sum_k b_k\frac{d^kx}{dt^k}$$로 출력이 입력의 식으로 바로 나온다.
- $$N \ge 1$$이면 해는 특수해(강제 응답)와 $$\sum a_k\frac{d^ky}{dt^k} = 0$$의 해(자연 응답)의 합이다. 입출력 관계를 완전히 정하려면 보조 조건이 필요하다.

**해의 구조**[^3]

| 부분 | 만족하는 식 | 뜻 |
|---|---|---|
| 제차해, 자연 응답 $$y_h$$ | $$L[y_h] = 0$$ | 입력이 없을 때의 해. 시스템 고유의 성질과 초기 에너지가 정한다 |
| 특수해, 강제 응답 $$y_p$$ | $$L[y_p] = x$$ | 실제 입력이 만든 해. 입력의 모양을 닮는다 |
| 전체 | $$L[y_h + y_p] = 0 + x = x$$ | 선형이라 두 해의 합도 해다 |

여기서 $$L$$은 "왼쪽 미분 연산 전체"를 줄여 쓴 것이다. LTI 시스템에서는 $$y = y_{\text{natural}} + y_{\text{forced}}$$ 또는 $$y = y_{\text{zero-input}} + y_{\text{zero-state}}$$로도 쓴다.

**초기 휴지 조건**(initial rest)[^4]. 입력이 가해지기 전에는 시스템 안이 모두 0이다. 과거에 저장된 에너지나 기억이 없다.

$$t \le t_0 \text{에서 } x(t) = 0 \;\Rightarrow\; t \le t_0 \text{에서 } y(t) = 0$$


그러면 $$t > t_0$$의 출력은 초기 조건 $$y(t_0) = \frac{dy(t_0)}{dt} = \cdots = \frac{d^{N-1}y(t_0)}{dt^{N-1}} = 0$$으로 풀면 된다. 초기 휴지 조건과 함께라면 이 미분방정식은 인과적인 LTI 시스템이다[^4]. 언제 실험하든 같은 응답을 기대할 수 있다.

**$$e^{st}$$를 쓰는 이유.**[^5] 미분해도 $$\frac{d}{dt}e^{st} = se^{st}$$로 모양이 유지된다. $$s = \sigma + j\omega$$의 $$\sigma$$는 성장($$\sigma > 0$$)·감쇠($$\sigma < 0$$)를, $$\omega$$는 진동을 정한다. 특성방정식 $$s^2 + 3s + 2 = 0$$의 근이 $$-1, -2$$이면 자연 응답 $$e^{-t}, e^{-2t}$$가 모두 줄어들어 시스템이 안정하다.

## 예제

**예제 2.14** $$\frac{dy}{dt} + 2y = Ke^{3t}u(t)$$, 초기 휴지 조건[^6]

1. *특수해:* $$t > 0$$에서 입력이 $$Ke^{3t}$$이므로 같은 꼴 $$y_p = Ye^{3t}$$를 넣는다. $$3Y + 2Y = K$$에서 $$Y = \frac K5$$.
2. *제차해:* $$y_h = Ae^{st}$$를 $$\frac{dy}{dt} + 2y = 0$$에 넣으면 $$Ae^{st}(s + 2) = 0$$, $$s = -2$$. 그래서 $$y_h = Ae^{-2t}$$.
3. *일반해:* $$y = Ae^{-2t} + \frac K5e^{3t}$$ ($$t > 0$$). 아직 $$A$$가 정해지지 않았다.
4. *초기 휴지:* $$t < 0$$에서 $$x = 0$$이므로 $$y = 0$$, 그래서 $$y(0) = 0$$. $$0 = A + \frac K5$$에서 $$A = -\frac K5$$.
5. *답:* $$y(t) = \frac K5\left[e^{3t} - e^{-2t}\right]u(t)$$.

<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: 6주차 p.24 "s = −2 이므로 $$y_p(t) = Ae^{-2t}$$" / 문제점: 제차 방정식 $$\frac{dy}{dt} + 2y = 0$$에서 구한 해이므로 특수해 $$y_p$$가 아니라 제차해 $$y_h$$다. 바로 다음 줄은 $$y(t) = Ae^{-2t} + \frac K5e^{3t}$$로 바르게 더한다 / 수정안: $$y_h(t) = Ae^{-2t}$$ / 근거: 같은 쪽 첫 줄 "$$y_h(t)$$를 결정하기 위해 $$y_h(t) = Ae^{st}$$로 가정"

</div>


**$$\dot y + ay = bx$$의 계단 응답과 임펄스 응답**[^7]

- 계단 응답 $$\dot s + as = bu$$, $$s(0) = 0$$: 제차해 $$Ce^{-at}$$, 입력이 상수 $$b$$라 특수해 $$A$$를 넣으면 $$aA = b$$, $$A = \frac ba$$. $$s(0) = \frac ba + C = 0$$이므로 $$s(t) = \frac ba(1 - e^{-at})u(t)$$.
- 임펄스 응답 $$\dot h + ah = b\delta$$, $$h(0) = 0$$: $$t > 0$$에서는 오른쪽이 0이라 $$h = ce^{-at}u(t)$$. 이것을 식에 넣으면 $$-ace^{-at}u + ce^{-at}\delta + ace^{-at}u = ce^{-at}\delta(t) = c\delta(t)$$ (표본화 성질 $$f(t)\delta(t) = f(0)\delta(t)$$). 오른쪽 $$b\delta$$와 맞추면 $$c = b$$.
- 결과 $$h(t) = be^{-at}u(t)$$. $$h(0^-) = 0$$이던 값이 임펄스 때문에 $$h(0^+) = b$$로 뛴다. 계단 응답을 미분한 것과 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제 2.14의 해, $$\dot y + ay = bx$$의 계단 응답, 폭 $$10^{-3}$$ 펄스 입력 응답이 $$be^{-at}$$에 다가감, $$h = s'$$를 오일러 방법으로 확인 — [23_lccde-system_verify.py](/Hongs_Blog/studies/signals-and-systems/code/23_lccde-system_verify/)</div>

</div>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 예제 2.14의 4단계에서 왜 $$y(0) = 0$$인가?</summary>

초기 휴지 조건 때문이다. 입력이 $$t < 0$$에서 0이므로 출력도 $$t < 0$$에서 0이고, 출력이 0에서 갑자기 뛰지 않으므로 $$y(0) = 0$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 임펄스 응답 계산에서 $$ce^{-at}\delta(t) = c\delta(t)$$인 이유는?</summary>

표본화 성질이다. $$\delta(t)$$는 $$t = 0$$에서만 0이 아니므로 곱한 함수의 $$t = 0$$ 값 $$ce^0 = c$$만 남는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">핵심 아이디어는?</summary>

미분방정식이 "규칙", 초기 휴지 조건이 "출발점"이다. 둘이 함께여야 입력 하나에 출력 하나가 정해지는 시스템이 된다.

</details>


## 활용

- RC 회로, 자동차, 화학 반응의 농도, 용수철 진동 등 물리 시스템의 응답 계산[^8].
- 회로 시뮬레이터는 이런 미분방정식을 수치로 푼다. 아날로그 컴퓨터는 적분기를 이어 같은 식을 만든다 → [블록 다이어그램](/Hongs_Blog/studies/signals-and-systems/block-diagram/)
- 흔한 실수: 일반해를 쓰고 초기 조건을 넣지 않아 상수 $$A$$가 남는 것, 특수해 꼴이 제차해와 겹칠 때 $$t$$를 곱하지 않는 것.

## 연결

- 선수: [상수계수 2계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/second-order-linear-ode/) (풀이 방법), [단위 계단 응답](/Hongs_Blog/studies/signals-and-systems/step-response/)
- 이산 시간 버전: [차분방정식으로 표현한 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/difference-equation-system/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"미분방정식으로 적힌 시스템은 늘 LTI다."</div>

틀렸다. 식이 선형이고 계수가 상수라서 그럴듯하다. 하지만 초기 조건이 0이 아니면(예: $$y(0) = 1$$로 고정) 입력이 0이어도 출력이 $$e^{-2t}$$로 0이 아니므로 선형이 아니다(증분 선형). 확인: [선형성](/Hongs_Blog/studies/signals-and-systems/linearity/)의 "입력 0 → 출력 0"을 깬다. 초기 휴지 조건을 붙여야 LTI가 된다[^s1].

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\frac{dy}{dt} + 3y = 6u(t)$$, 초기 휴지 조건. $$y(t)$$를 구하라.</summary>

**답:** 특수해 $$Y = 2$$, 제차해 $$Ae^{-3t}$$, $$y(0) = 0$$에서 $$A = -2$$. $$y(t) = 2(1 - e^{-3t})u(t)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 초기 휴지 조건이 왜 필요한가? 없으면 무엇이 정해지지 않는가?</summary>

**답:** 미분방정식의 해에는 제차해 $$Ae^{st}$$처럼 정해지지 않은 상수가 남는다. 초기 휴지 조건이 출발 상태를 0으로 정해 그 상수를 결정하고, 시스템을 인과적인 LTI로 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 자연 응답과 강제 응답 중 무엇이 입력의 모양을 닮고, 무엇이 시스템의 특성근으로 정해지는가?</summary>

**답:** 강제 응답(특수해)이 입력을 닮는다(예제 2.14에서 $$e^{3t}$$). 자연 응답(제차해)은 특성근으로 정해진다($$e^{-2t}$$).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 임펄스 응답을 구할 때 $$t > 0$$에서 $$\dot h + ah = 0$$으로 놓는 이유는?</summary>

**답:** 입력 $$b\delta(t)$$는 $$t = 0$$에서만 0이 아니다. $$t > 0$$에서는 입력이 0이므로 제차 방정식만 남는다. $$t = 0$$의 임펄스는 계수 $$c$$를 정하는 데만 쓴다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/06.Week06_CH02_2_handout.pdf, p.21
[^2]: 같은 자료, p.26
[^3]: 같은 자료, p.22
[^4]: 같은 자료, p.25~26
[^5]: 같은 자료, p.40~41
[^6]: 같은 자료, p.23~24 (예제 2.14)
[^7]: 같은 자료, p.36~37
[^8]: 같은 자료, p.20
[^s1]: 에이전트 보충. 오해 항목의 반례와 확인 문제는 원본에 없다. 해는 검증 코드로 확인했다.
{% endraw %}
