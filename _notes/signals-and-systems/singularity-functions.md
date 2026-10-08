---
layout: "note"
title: "특이함수"
display_title: "특이함수 (Singularity Functions)"
kind: "concept"
kind_label: "정의"
num: "27"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Singularity Functions", "이상화된 짧은 펄스", "Idealized Short Pulse", "단위 램프", "Unit Ramp", "컨벌루션으로 정의한 임펄스", "Defining the Unit Impulse through Convolution"]
description: "특이함수는 값이 갑자기 뛰거나(불연속) 기울기가 갑자기 바뀌는 함수로, 단위 계단·단위 임펄스·단위 램프가 대표다. 그중 단위 임펄스는 \"충분히 짧고 넓이가 1인 펄스\"를 이상화한 것이다. 실제 시스템은 아주 짧은 시간의 모양 차이를 구별하지 못해서, 짧은 펄스가 사각형이든 삼각형…"
prev_url: "/studies/signals-and-systems/block-diagram/"
prev_title: "블록 다이어그램"
next_url: "/studies/signals-and-systems/lti-eigenfunction/"
next_title: "LTI 시스템의 고유함수"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/singularity-functions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

특이함수는 값이 갑자기 뛰거나(불연속) 기울기가 갑자기 바뀌는 함수로, 단위 계단·단위 임펄스·단위 램프가 대표다. 그중 단위 임펄스는 "충분히 짧고 넓이가 1인 펄스"를 이상화한 것이다. 실제 시스템은 아주 짧은 시간의 모양 차이를 구별하지 못해서, 짧은 펄스가 사각형이든 삼각형이든 같은 반응을 보인다. 그래서 임펄스를 모양이 아니라 "컨벌루션했을 때 신호를 그대로 돌려주는 것"으로 정의한다. 단, 펄스가 시스템의 반응 속도보다 충분히 짧을 때만 이 근사가 맞다.

</div>


## 예시로 보기

$$\frac{dy}{dt} + 2y = x$$ 시스템(임펄스 응답 $$h(t) = e^{-2t}u(t)$$)에 넓이 1인 짧은 펄스 두 종류를 넣어 본다(예제 2.16)[^1].

- $$\delta_\Delta(t)$$: 폭 $$\Delta$$, 높이 $$\frac1\Delta$$인 사각 펄스.
- $$r_\Delta(t) = \delta_\Delta(t) * \delta_\Delta(t)$$: 폭 $$2\Delta$$, 꼭대기 높이 $$\frac1\Delta$$인 삼각 펄스.

$$\Delta = 0.25$$이면 두 응답의 모양이 눈에 띄게 다르다. $$\Delta = 0.1$$, $$0.0025$$로 줄이면 차이가 줄고, 모두 $$h(t) = e^{-2t}u(t)$$로 모인다.

## 정의

**특이함수**는 함수나 그 도함수가 불연속인 함수다. 급격한 변화와 불연속을 나타낼 때 쓴다. 대표는 단위 계단, 단위 임펄스, 단위 램프다[^2].

**짧은 펄스의 극한으로 본 임펄스.**[^3] 넓이가 1인 펄스 $$p_\Delta(t)$$가 모든 신호에 대해 $$\lim_{\Delta\to0}x(t) * p_\Delta(t) = x(t)$$를 만족하면, 그 극한을 $$\delta(t)$$로 쓸 수 있다. 사각 펄스 $$\delta_\Delta$$, 삼각 펄스 $$r_\Delta$$ 모두 그렇다. 그래서 $$\lim(p_\Delta * p_\Delta) = \delta$$이고 $$x * \delta * \delta = x$$다.

삼각 펄스는 두 사각 펄스의 컨벌루션이다. [사각 펄스 두 개의 컨벌루션](/Hongs_Blog/studies/signals-and-systems/convolution-integral/)에서 폭이 같으면 삼각형이 되기 때문이다[^4].

$$r_\Delta(t) = \delta_\Delta(t) * \delta_\Delta(t) = \begin{cases}\dfrac{t}{\Delta^2} & 0 \le t \le \Delta\\[2mm] \dfrac{2\Delta - t}{\Delta^2} & \Delta \le t \le 2\Delta\\[2mm] 0 & \text{그 밖}\end{cases}$$


$$0 \le t \le \Delta$$에서는 $$\int_0^t(\frac1\Delta)^2d\tau = \frac{t}{\Delta^2}$$, $$\Delta \le t \le 2\Delta$$에서는 $$\int_{t-\Delta}^{\Delta}(\frac1\Delta)^2d\tau = \frac{2\Delta - t}{\Delta^2}$$다. 넓이는 $$\frac12 \cdot 2\Delta \cdot \frac1\Delta = 1$$이다.

**컨벌루션으로 정의한 임펄스.**[^5] 단위 임펄스는 항등 시스템의 임펄스 응답이다. 곧 모든 신호에 대해

$$x(t) = x(t) * \delta(t)$$


를 만족하는 것으로 정의한다. 여기에 모든 $$t$$에서 $$x(t) = 1$$을 넣으면 $$1 = \int_{-\infty}^{\infty}\delta(\tau)\cdot1\,d\tau$$, 곧 단위 임펄스의 넓이는 1이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$\delta_\Delta * \delta_\Delta$$를 수치 적분해 위 삼각 펄스 식과 일치, 넓이 1, 예제 2.16에서 $$\Delta = 0.25 \to 0.1 \to 0.0025$$로 줄일수록 두 펄스의 응답이 $$e^{-2t}$$에 가까워짐 — [27_singularity-functions_verify.py](/Hongs_Blog/studies/signals-and-systems/code/27_singularity-functions_verify/)</div>

</div>


## 활용

- 망치로 구조물을 한 번 쳐서(짧은 충격) 진동을 재는 충격 시험은, 충격이 구조물의 반응보다 충분히 짧으면 임펄스 응답을 잰 것으로 본다[^s1].
- 펄스가 얼마나 짧아야 하는지는 시스템이 정한다. 예제 2.16의 시스템은 시간 상수가 0.5초라 $$\Delta = 0.0025$$면 충분히 짧지만 $$0.25$$는 부족하다.

## 연결

- 선수: [컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/), [미분방정식으로 표현한 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/lccde-system/)
- 1장의 정의: [단위 임펄스와 단위 계단](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/) (사각 펄스의 극한)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 임펄스를 "높이가 무한대인 바늘"이 아니라 "컨벌루션하면 신호를 그대로 돌려주는 것"으로 정의하면 무엇이 좋은가?</summary>

**답:** 펄스의 구체적인 모양(사각형, 삼각형, 종 모양)에 상관없이 성질 하나로 정의할 수 있다. 실제 시스템은 아주 짧은 펄스의 모양을 구별하지 못하므로, 시스템이 보는 그대로의 정의다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$r_\Delta(t)$$의 $$t = \Delta/2$$와 $$t = 1.5\Delta$$에서의 값은?</summary>

**답:** 둘 다 $$\frac{1}{2\Delta}$$. $$\frac{\Delta/2}{\Delta^2}$$와 $$\frac{2\Delta - 1.5\Delta}{\Delta^2}$$.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/07.Week07_CH03_1_handout.pdf, p.6 (예제 2.16)
[^2]: 같은 자료, p.1
[^3]: 같은 자료, p.5
[^4]: 같은 자료, p.1~4
[^5]: 같은 자료, p.1, p.7
[^s1]: 에이전트 보충. 충격 시험 예와 시간 상수 비교, 확인 문제는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
