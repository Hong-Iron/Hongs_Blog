---
layout: "note"
title: "미분방정식 풀이 예제 사다리"
display_title: "미분방정식 풀이 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "02"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: 상수계수 2계 선형 미분방정식"
next_url: "/studies/signals-and-systems/dt-period-ladder/"
next_title: "이산 신호 주기 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/ode-ladder/"
---
{% raw %}
사용 개념: [상수계수 2계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/second-order-linear-ode/)

이 방법을 떠올리는 신호는 "계수가 모두 상수이고 $$y$$와 도함수가 1차로만 나오는 식"이다. 풀이는 늘 같은 하위목표로 나뉜다. ① 특성방정식 풀기 ② 제차해 쓰기 ③ (오른쪽이 있으면) 특수해 찾기 ④ 초기 조건으로 상수 정하기[^s1].

## 문제 1 · 완전한 풀이

$$y'' - 4y' + 3y = x$$, $$y(0) = 0$$, $$y'(0) = 0$$[^1]

1. *특성방정식:* $$\lambda^2 - 4\lambda + 3 = (\lambda - 1)(\lambda - 3) = 0$$이므로 $$\lambda = 1, 3$$.
2. *제차해:* $$y_h = C_1e^x + C_2e^{3x}$$.
3. *특수해:* 오른쪽이 1차식이므로 $$y_p = Ax + B$$. 넣으면 $$-4A + 3(Ax + B) = x$$, 즉 $$3A = 1$$, $$-4A + 3B = 0$$에서 $$A = \frac13$$, $$B = \frac49$$.
4. *초기 조건:* $$y = C_1e^x + C_2e^{3x} + \frac x3 + \frac49$$. $$y(0) = C_1 + C_2 + \frac49 = 0$$, $$y'(0) = C_1 + 3C_2 + \frac13 = 0$$을 풀면 $$C_2 = \frac{1}{18}$$, $$C_1 = -\frac12$$.

## 문제 2 · 마지막 하위목표만 빈칸

$$y'' + 11y' + 24y = 0$$, $$y(0) = 0$$, $$y'(0) = -7$$[^2]

1. *특성방정식:* $$(\lambda + 8)(\lambda + 3) = 0$$이므로 $$\lambda = -8, -3$$.
2. *제차해:* $$y = C_1e^{-8x} + C_2e^{-3x}$$.
3. *특수해:* 오른쪽이 0이라 필요 없다.
4. *초기 조건:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$C_1 + C_2 = 0$$, $$-8C_1 - 3C_2 = -7$$에서 $$C_1 = 1.4$$, $$C_2 = -1.4$$. $$y = 1.4e^{-8x} - 1.4e^{-3x}$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$y'' - 4y' + 9y = 0$$, $$y(0) = 0$$, $$y'(0) = -8$$[^3]

1. *특성방정식:* ______
2. *제차해 (실수 꼴):* ______
3. *특수해:* 필요 없다.
4. *초기 조건:* $$y(0) = 0$$에서 코사인 계수가 0, $$y'(0) = -8$$에서 사인 계수가 정해진다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. $$\lambda = 2 \pm j\sqrt5$$.
2. $$y = e^{2x}(C_3\cos\sqrt5x + C_4\sin\sqrt5x)$$.
4. $$C_3 = 0$$, $$\sqrt5C_4 = -8$$이므로 $$y = -\frac{8\sqrt5}{5}e^{2x}\sin\sqrt5x$$.

</details>


## 문제 4 · 독립 문제

$$x'' - x' + x = 2\sin 3t$$의 특수해를 구하라[^4].

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$x_p = A\cos3t + B\sin3t$$를 넣으면 $$-(8A + 3B)\cos3t + (3A - 8B)\sin3t = 2\sin3t$$. $$8A + 3B = 0$$, $$3A - 8B = 2$$에서 $$A = \frac{6}{73}$$, $$B = -\frac{16}{73}$$.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 해를 식에 넣어 양변이 같음 — [02_second-order-linear-ode_verify.py](/Hongs_Blog/studies/signals-and-systems/code/02_second-order-linear-ode_verify/), 문제 1의 상수는 [02_ode-ladder_p1.py](/Hongs_Blog/studies/signals-and-systems/code/02_ode-ladder_p1/)</div>

</div>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/01.Week01_2_미분방정식.pdf, p.12 (초기 조건은 원본에 없다)
[^2]: 같은 자료, p.9
[^3]: 같은 자료, p.10
[^4]: 같은 자료, p.13
[^s1]: 에이전트 보충. 하위목표 라벨, 문제 1의 초기 조건과 상수 계산은 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
