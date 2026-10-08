---
layout: "note"
title: "연속 시간 신호와 이산 시간 신호"
display_title: "연속 시간 신호와 이산 시간 신호 (Continuous-Time and Discrete-Time Signals)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Continuous-Time Signal", "Discrete-Time Signal", "신호", "Signal", "연속 신호", "이산 신호", "아날로그 신호", "Analog Signal", "디지털 신호", "Digital Signal", "결정론적 신호", "Deterministic Signal", "랜덤 신호", "Random Signal", "독립 변수", "Independent Variable", "C-T", "D-T"]
description: "신호는 시간에 따라 변하는 값, 곧 정보를 실어 나르는 함수다. 마이크의 전압이나 자동차의 속도처럼 모든 순간에 값이 있으면 연속 시간 신호이고, 매일 종가처럼 정해진 순간에만 값이 있으면 이산 시간 신호다. 컴퓨터는 이산 시간 신호만 다룰 수 있어서, 연속 신호를 일정한 간격으로…"
prev_url: "/studies/signals-and-systems/second-order-linear-ode/"
prev_title: "상수계수 2계 선형 미분방정식"
next_url: "/studies/signals-and-systems/signal-energy-power/"
next_title: "신호의 에너지와 전력"
math: true
mermaid: false
code_count: 0
permalink: "/studies/signals-and-systems/ct-dt-signals/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

신호는 시간에 따라 변하는 값, 곧 정보를 실어 나르는 함수다. 마이크의 전압이나 자동차의 속도처럼 모든 순간에 값이 있으면 연속 시간 신호이고, 매일 종가처럼 정해진 순간에만 값이 있으면 이산 시간 신호다. 컴퓨터는 이산 시간 신호만 다룰 수 있어서, 연속 신호를 일정한 간격으로 뽑아 이산 신호로 바꾼다. 뽑는 순간 사이의 값은 버려지므로, 간격을 너무 넓게 잡으면 원래 신호를 되살릴 수 없다.

</div>


## 예시로 보기

같은 기온을 두 방식으로 기록한다고 하자.

- 온도계 바늘을 계속 지켜보면 모든 순간의 값 $$x(t)$$가 있다. 시간 $$t$$는 실수이고 0.5초, 0.501초 어디서든 값이 있다.
- 한 시간마다 한 번 적으면 $$x[1], x[2], x[3], \dots$$만 남는다. 괄호 안의 $$n$$은 "몇 번째 기록"인지를 뜻하는 정수다.

두 번째 기록은 첫 번째 신호를 $$T_s$$(표본 간격)마다 뽑은 것이다. 그래서 $$x[n] = x(nT_s)$$로 적는다[^1]. 둘을 구별하려고 연속 시간은 둥근 괄호 $$x(t)$$, 이산 시간은 대괄호 $$x[n]$$을 쓴다.

신호의 예는 다양하다[^2].

| 신호 | 독립 변수 | 값 |
|---|---|---|
| 회로의 전압·전류 | 시간 | 볼트, 암페어 |
| 소리 | 시간 | 공기 압력의 흔들림 |
| 흑백 영상 | 가로·세로 위치(그리고 시간) | 밝기 $$f(x, y, t)$$ |
| 주가 지수, 인구 통계 | 날짜(정수) | 숫자 |

이 과목에서는 독립 변수가 시간 하나인 신호만 다룬다[^3].

## 정의

신호는 독립 변수의 함수로 적는다. 독립 변수가 연속인지, 값(진폭)이 연속인지에 따라 넷으로 나뉜다[^4].

| 이름 | 시간 | 값 |
|---|---|---|
| 아날로그 신호 | 연속 | 연속 |
| 연속 시간 신호 $$x(t)$$, $$t \in \mathbb{R}$$ | 연속 | 연속이거나 이산 |
| 이산 시간 신호 $$x[n]$$, $$n \in \mathbb{Z}$$ | 정해진 순간에만 정의 | 연속이거나 이산 |
| 디지털 신호 | 이산 | 이산 |

이산 시간 신호는 정수 $$n$$에서만 정의된다. $$x[1.5]$$ 같은 값은 0이 아니라 아예 없다.

다른 기준으로도 나눈다[^5].

| 기준 | 갈래 |
|---|---|
| 되풀이되는가 | 주기 신호, 비주기 신호 → [주기 신호](/Hongs_Blog/studies/signals-and-systems/periodic-signals/) |
| 미래를 알 수 있는가 | 결정론적 신호(시간의 함수로 완전히 적을 수 있고 과거로 미래를 예측), 랜덤 신호(어느 순간의 값이 우연에 따라 달라 미리 알 수 없음) |
| 에너지가 유한한가 | 에너지 신호, 전력 신호 → [신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/) |
| 값이 복소수인가 | 실수 신호, 복소수 신호 $$z(t) = x(t) + jy(t)$$ |
| 방향이 바뀌는가 | 직류(dc) 신호, 교류(ac) 신호 |

## 활용

- 컴퓨터, 휴대폰의 소리와 사진은 모두 이산 시간이면서 값도 몇 단계로 끊은 디지털 신호다. 연속 신호를 뽑는 과정은 [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/)에서 다룬다.
- 입력은 연속 신호인데 내부는 이산 시스템인 경우(A/D 변환기 → 이산 시스템)를 혼합(hybrid) 시스템이라 한다[^6].

## 연결

- 선수: [함수](/Hongs_Blog/studies/college-math/function/)
- 다음: [신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/), [독립 변수의 변환](/Hongs_Blog/studies/signals-and-systems/independent-variable-transform/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 다음은 연속 시간 신호인가, 이산 시간 신호인가? ① 스피커에 걸리는 전압 ② 매일 오후 6시의 환율 ③ 디지털카메라로 찍은 사진의 화소 밝기</summary>

**답:** ① 연속 시간 ② 이산 시간 ③ 이산(위치가 화소 단위로 끊겨 있다).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 이산 시간 신호와 디지털 신호는 같은 말인가? 차이를 설명하라.</summary>

**답:** 아니다. 이산 시간 신호는 시간만 끊겨 있으면 되고 값은 실수 어떤 값이든 될 수 있다. 디지털 신호는 시간도 끊기고 값도 정해진 몇 단계로만 나온다. 디지털 신호는 이산 시간 신호의 한 종류다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/02.Week02_CH01_1_handout.pdf, p.4, p.13
[^2]: 같은 자료, p.3, p.11
[^3]: 같은 자료, p.12
[^4]: 같은 자료, p.6 (정보통신기술용어해설 인용)
[^5]: 같은 자료, p.8~9
[^6]: 3-1학기/신호 및 시스템/1.수업자료/04.Week04_CH01_3_handout.pdf, p.2
{% endraw %}
