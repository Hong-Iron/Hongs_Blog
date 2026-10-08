---
layout: "note"
title: "안정성"
display_title: "안정성 (Stability)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
aliases: ["Stability", "Stable System", "안정 시스템", "불안정 시스템", "Unstable System", "BIBO 안정", "Bounded-Input Bounded-Output", "유계 입력 유계 출력"]
description: "안정 시스템은 작게 건드리면 작게 반응한다. 크기가 한계 안에 있는 입력을 넣으면 출력도 어떤 한계 안에 머문다(유계 입력 유계 출력, BIBO). 매달린 진자는 살짝 밀면 조금 흔들리다 돌아오니 안정적이고, 거꾸로 세운 진자는 살짝만 밀어도 넘어지니 불안정하다. 안정성은 \"어떤\"…"
prev_url: "/studies/signals-and-systems/causality/"
prev_title: "인과성"
next_url: "/studies/signals-and-systems/time-invariance/"
next_title: "시불변성"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/stability/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

안정 시스템은 작게 건드리면 작게 반응한다. 크기가 한계 안에 있는 입력을 넣으면 출력도 어떤 한계 안에 머문다(유계 입력 유계 출력, BIBO). 매달린 진자는 살짝 밀면 조금 흔들리다 돌아오니 안정적이고, 거꾸로 세운 진자는 살짝만 밀어도 넘어지니 불안정하다. 안정성은 "어떤" 유계 입력에도 출력이 유계여야 하므로, 유계 입력 하나라도 출력을 끝없이 키우면 불안정이다.

</div>


## 예시로 보기

그림 1.46의 두 진자다[^1]. 입력 $$x(t)$$는 진자에 가한 힘, 출력 $$y(t)$$는 수직선에서 벗어난 각이다.

- (a) 매달린 진자: 중력이 진자를 수직선 쪽으로 되돌리는 힘으로 작용한다. 작은 힘에는 작은 흔들림만 생긴다.
- (b) 거꾸로 선 진자: 중력이 수직선에서 더 멀어지는 쪽으로 작용한다. 작은 힘에도 각이 계속 커진다.

먹이가 끝없이 공급되고 천적이 없는 곳의 개체 수도 불안정 시스템의 예다. 작은 입력에도 응답이 제한 없이 커진다[^1].

## 정의

$$\text{시스템 } x \to y \text{가 안정} \iff \text{모든 유계 입력 } x\text{에 대해 } y\text{가 유계}$$


$$\text{불안정} \iff \text{어떤 유계 입력 } x\text{에 대해 } y\text{가 유계가 아님}$$


유계는 "크기가 어떤 상수 $$B$$를 넘지 않는다", 즉 모든 시각에 $$\vert x\vert  \le B$$라는 뜻이다[^2].

## 예제

**이동 평균** $$y[n] = \frac{1}{2M+1}\sum_{k=-M}^{M}x[n-k]$$: 모든 $$n$$에서 $$\vert x[n]\vert  \le B$$이면 $$2M + 1$$개의 평균도 $$B$$를 넘지 않아 $$\vert y[n]\vert  \le B$$다. 안정이다[^2].

**누산기** $$y[n] = \sum_{k=-\infty}^{n}x[k]$$: 입력이 유계여도 합은 계속 커질 수 있다[^2].

- 유계 입력 $$x[n] = u[n]$$ (크기 1 이하)을 넣는다.
- $$y[n] = \sum_{k=-\infty}^{n}u[k] = (n+1)u[n]$$이므로 $$y[0] = 1, y[1] = 2, y[2] = 3, \dots$$
- 끝없이 커지므로 불안정이다.

**예제 1.13**[^3]

- $$S_1$$: $$y(t) = tx(t)$$. 유계인 상수 입력 $$x(t) = 1$$을 넣으면 $$y(t) = t$$이고, $$\vert y(t)\vert $$는 어느 상수든 언젠가 넘는다. 불안정.
- $$S_2$$: $$y(t) = e^{x(t)}$$. 임의의 유계 입력 $$-B < x(t) < B$$를 넣으면 $$e^{-B} < y(t) < e^{B}$$다. 출력이 $$e^B$$로 묶이므로 안정.

**1계 미분방정식** $$\dfrac{dy}{dt} + ay = bx$$: 입력이 0일 때의 출력은 $$Ce^{-at}$$다. $$a > 0$$이면 줄어들고, $$a < 0$$이면 시간이 지날수록 무한대로 간다. 그래서 $$a > 0$$이면 안정, $$a < 0$$이면 불안정이다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 누산기의 계단 응답 $$n+1$$, 이동 평균의 출력 한계, $$tx(t)$$의 발산, $$e^{x}$$의 범위, 1계 미분방정식에 상수 입력을 넣었을 때 $$a > 0$$이면 $$b/a$$로 수렴하고 $$a < 0$$이면 발산함을 수치로 확인 — [15_stability_verify.py](/Hongs_Blog/studies/signals-and-systems/code/15_stability_verify/)</div>

</div>


## 활용

- 앰프에서 마이크를 스피커에 가까이 대면 소리가 끝없이 커지는 하울링이 생긴다. 피드백 연결이 불안정해진 경우다[^s1].
- 2장에서 LTI 시스템은 임펄스 응답의 절댓값 합이 유한할 때 안정이라는 간단한 판정법을 배운다.
- 2계 미분방정식의 특성근 실수부가 모두 음수면 입력 0 응답이 사라져 안정적이다 → [상수계수 2계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/second-order-linear-ode/)

## 연결

- 선수: [시스템과 시스템 연결](/Hongs_Blog/studies/signals-and-systems/systems-interconnection/), [단위 임펄스와 단위 계단](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"몇 가지 유계 입력을 넣어 출력이 유계였으니 안정이다."</div>

틀렸다. 안정은 "모든" 유계 입력에 대한 약속이라, 몇 개의 예로는 증명이 안 된다. 누산기에 $$x[n] = (-1)^n u[n]$$을 넣으면 출력은 1, 0, 1, 0으로 유계라서 안정처럼 보인다. 그러나 $$u[n]$$ 하나가 출력을 끝없이 키우므로 불안정이다. 불안정을 보일 때는 반례 하나면 되고, 안정을 보일 때는 임의의 $$B$$로 한계를 증명해야 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$y[n] = x[n] + 0.5x[n-1]$$은 안정인가? 이유를 한계로 보이라.</summary>

**답:** 안정. $$\vert x[n]\vert  \le B$$이면 $$\vert y[n]\vert  \le \vert x[n]\vert  + 0.5\vert x[n-1]\vert  \le 1.5B$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$y(t) = \int_{-\infty}^{t}x(\tau)d\tau$$가 불안정임을 보이는 입력을 들라.</summary>

**답:** $$x(t) = u(t)$$. 크기가 1 이하인 유계 입력인데 출력은 $$t\,u(t)$$로 끝없이 커진다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 예제 1.13의 $$y = tx(t)$$는 왜 $$x(t) = 1$$ 하나만으로 불안정이라고 말할 수 있는가?</summary>

**답:** 불안정의 정의가 "출력을 유계가 아니게 만드는 유계 입력이 하나라도 있다"이기 때문이다. $$x = 1$$은 유계이고 출력 $$t$$는 유계가 아니므로 충분하다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/04.Week04_CH01_3_handout.pdf, p.12 (그림 1.46)
[^2]: 같은 자료, p.13
[^3]: 같은 자료, p.14 (예제 1.13)
[^s1]: 에이전트 보충. 하울링 예, LTI 안정 판정법 예고, 오해 항목의 $$(-1)^n u[n]$$ 예, 확인 문제 C1·C2는 원본에 없다. 계산은 검증 코드로 확인했다.
{% endraw %}
