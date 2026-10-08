---
layout: "note"
title: "주기 신호"
display_title: "주기 신호 (Periodic Signals)"
kind: "concept"
kind_label: "정의"
num: "06"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Periodic Signal", "주기", "Period", "기본 주기", "Fundamental Period", "비주기 신호", "Aperiodic Signal"]
description: "일정한 시간마다 똑같은 모양이 끝없이 되풀이되는 신호다. 시계 초침처럼, 한 바퀴 시간만큼 밀어도 그림이 그대로다. 되풀이 간격 중 가장 짧은 것을 기본 주기라 한다. 한 구간만 반복처럼 보여서는 안 되고, 모든 시간에서 맞아야 한다. 그래서 한쪽은 \\cos, 다른 쪽은 \\sin으…"
prev_url: "/studies/signals-and-systems/independent-variable-transform/"
prev_title: "독립 변수의 변환"
next_url: "/studies/signals-and-systems/even-odd-signals/"
next_title: "짝 신호와 홀 신호"
math: true
mermaid: false
code_count: 0
permalink: "/studies/signals-and-systems/periodic-signals/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

일정한 시간마다 똑같은 모양이 끝없이 되풀이되는 신호다. 시계 초침처럼, 한 바퀴 시간만큼 밀어도 그림이 그대로다. 되풀이 간격 중 가장 짧은 것을 기본 주기라 한다. 한 구간만 반복처럼 보여서는 안 되고, 모든 시간에서 맞아야 한다. 그래서 한쪽은 $$\cos$$, 다른 쪽은 $$\sin$$으로 이어 붙인 신호는 주기 신호가 아니다.

</div>


## 예시로 보기

$$\cos 2t$$의 주기를 구해 보자[^1]. $$T$$만큼 밀어도 같아야 하므로 $$\cos 2(t + T) = \cos(2t + 2T) = \cos 2t$$여야 한다. 코사인은 각이 $$2\pi$$ 늘 때마다 되풀이되니 $$2T = 2\pi$$, 즉 $$T = \pi$$다.

$$\pi$$만큼 밀어도 같다면 $$2\pi$$, $$3\pi$$만큼 밀어도 같다. 이 가운데 가장 작은 $$\pi$$가 기본 주기다.

## 정의

연속 시간 신호 $$x(t)$$는 다음을 만족하는 양수 $$T$$가 있으면 주기가 $$T$$인 주기 신호다[^1].

$$x(t) = x(t + T) \quad \text{모든 } t\text{에 대해}$$


기호로 쓰면 $$\exists T > 0 \;\text{s.t.}\; \forall t,\; x(t) = x(t + T)$$다. 여기서 $$\exists$$는 "있다", $$\forall$$는 "모든"을 뜻한다.

- 주기가 $$T$$이면 모든 정수 $$m$$에 대해 $$x(t) = x(t + mT)$$다. 그래서 $$2T, 3T, \dots$$도 주기다.
- 기본 주기 $$T_0$$은 위 식을 만족하는 가장 작은 양수 $$T$$다.
- 이산 시간 신호 $$x[n]$$은 $$x[n] = x[n + N]$$인 양의 정수 $$N$$이 있으면 주기 $$N$$인 주기 신호다. 기본 주기 $$N_0$$도 가장 작은 $$N$$이다.

상수 신호 $$x(t) = c$$는 어떤 $$T$$로 밀어도 같다. 가장 작은 양수가 없으므로 기본 주기가 정의되지 않는다[^s1].

## 예제

**예제 1.4 (주기 신호가 아닌 예)**[^2]

$$x(t) = \begin{cases}\cos t & t < 0\\ \sin t & t \ge 0\end{cases}$$


- 각 조각만 보면 $$\cos(t + 2\pi) = \cos t$$, $$\sin(t + 2\pi) = \sin t$$라서 $$2\pi$$마다 되풀이되는 것처럼 보인다.
- 그런데 $$t = 0$$에서 $$\cos 0 = 1$$이 $$\sin 0 = 0$$으로 갑자기 바뀐다. 이 끊김은 $$t = 0$$ 한 곳에만 있고 $$2\pi$$나 $$-2\pi$$에는 없다.
- 그래서 $$2\pi$$만큼 밀면 끊김의 위치가 달라지고, 신호는 주기적이지 않다.

## 활용

- 교류 전기, 음의 높이, 시계 신호는 주기 신호다. 3장의 푸리에 급수는 주기 신호를 정현파들의 합으로 나눈다.
- 주기 신호는 에너지가 무한대이고 평균 전력은 유한한 전력 신호다 → [신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/)
- 이산 시간 정현파는 연속 시간과 달리 늘 주기적이지는 않다 → [이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/)

## 연결

- 선수: [독립 변수의 변환](/Hongs_Blog/studies/signals-and-systems/independent-variable-transform/) (주기는 시간 이동에 대해 변하지 않는 성질이다)
- 다음: [연속 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/ct-complex-exponential/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\sin(3t + 1)$$의 기본 주기는?</summary>

**답:** $$3T = 2\pi$$이므로 $$T_0 = \dfrac{2\pi}{3}$$. 위상 $$+1$$은 주기와 관계없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** "어느 구간에서 $$2\pi$$마다 같은 모양이 보이면 주기 신호다"가 틀렸음을 보이는 예를 들라.</summary>

**답:** 예제 1.4처럼 $$t < 0$$에서는 $$\cos t$$, $$t \ge 0$$에서는 $$\sin t$$인 신호. 양쪽 구간 안에서는 $$2\pi$$마다 되풀이되지만, $$t = 0$$의 끊김이 한 번만 나타나 전체로는 주기적이지 않다. 다른 예: $$\sin t \cdot u(t)$$.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/02.Week02_CH01_1_handout.pdf, p.36
[^2]: 같은 자료, p.37 (예제 1.4, 그림 1.16)
[^s1]: 에이전트 보충. 상수 신호의 기본 주기가 정의되지 않는다는 설명(3주차 자료 p.4의 "$$\omega_0 = 0$$이면 기본 주기 정의 안 됨"과 같은 내용), 확인 문제 C1, C2의 $$\sin t \cdot u(t)$$ 예는 원본에 없다.
{% endraw %}
