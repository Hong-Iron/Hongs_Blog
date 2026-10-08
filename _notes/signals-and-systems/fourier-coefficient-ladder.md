---
layout: "note"
title: "푸리에 계수 계산 예제 사다리"
display_title: "푸리에 계수 계산 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "30"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: 연속 시간 푸리에 급수, 연속 시간 푸리에 급수의 성질"
prev_url: "/studies/signals-and-systems/convolution-ladder/"
prev_title: "컨벌루션 계산 예제 사다리"
next_url: "/studies/signals-and-systems/inverse-transform-ladder/"
next_title: "푸리에 역변환 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/fourier-coefficient-ladder/"
---
{% raw %}
사용 개념: [연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/), [연속 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/ctfs-properties/)

주기 신호와 "푸리에 계수를 구하라"가 주어지면 쓴다. 하위목표는 다음과 같다[^s1].

1. *기본 주파수:* 주기 $$T$$에서 $$\omega_0 = \frac{2\pi}{T}$$.
2. *빠른 길 찾기:* 정현파의 합이면 오일러 관계로 바로 읽는다. 아는 신호를 옮기거나 미분한 것이면 성질 표를 쓴다.
3. *적분:* 둘 다 아니면 분석식 $$a_k = \frac1T\int_Tx(t)e^{-jk\omega_0t}dt$$를 계산한다. $$k = 0$$은 따로 한다.
4. *확인:* 실수 신호면 $$a_{-k} = a_k^*$$인지, 짝·홀 대칭과 계수의 실수·허수가 맞는지 본다.

## 문제 1 · 완전한 풀이

$$x(t) = 2 + \cos(3t) - 4\sin(6t)$$의 계수를 구하라.

1. *기본 주파수:* $$\cos 3t$$와 $$\sin 6t$$의 공통 주기는 $$\frac{2\pi}{3}$$이므로 $$\omega_0 = 3$$.
2. *빠른 길:* 오일러 관계로 $$\cos3t = \frac12(e^{j3t} + e^{-j3t})$$, $$\sin6t = \frac{1}{2j}(e^{j6t} - e^{-j6t})$$.
3. *읽기:* $$a_0 = 2$$, $$a_{\pm1} = \frac12$$, $$a_2 = -\frac{4}{2j} = 2j$$, $$a_{-2} = -2j$$, 나머지 0.
4. *확인:* 실수 신호라 $$a_{-2} = a_2^* = -2j$$. 맞다.

## 문제 2 · 마지막 하위목표만 빈칸

주기 2, 한 주기에서 $$0 < t < 1$$이면 1, $$1 < t < 2$$이면 $$-1$$인 사각파.

1. *기본 주파수:* $$\omega_0 = \pi$$.
2. *빠른 길:* 없음. 적분한다.
3. *적분:* $$a_0 = 0$$ (넓이가 상쇄). $$k \ne 0$$이면 $$a_k = \frac12\left[\int_0^1e^{-jk\pi t}dt - \int_1^2e^{-jk\pi t}dt\right] = \frac{1 - (-1)^k}{jk\pi}$$. 짝수 $$k$$는 0, 홀수 $$k$$는 $$\frac{2}{jk\pi}$$.
4. *확인:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

실수 신호라 $$a_{-k} = a_k^*$$: $$\frac{2}{j(-k)\pi} = -\frac{2}{jk\pi} = \left(\frac{2}{jk\pi}\right)^*$$. 맞다. 또 $$x(-t) = -x(t)$$(홀 신호)이므로 계수가 순허수이고 홀이어야 하는데, $$a_k = -\frac{2j}{k\pi}$$로 순허수·홀이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

예제 3.5의 대칭 사각파($$T = 4$$, $$\vert t\vert  < 1$$에서 1)의 계수가 $$a_k = \frac{\sin(\pi k/2)}{k\pi}$$, $$a_0 = \frac12$$이다. $$y(t) = x(t - 1)$$의 계수를 구하라.

1. *기본 주파수:* $$\omega_0 = \frac\pi2$$.
2. *빠른 길:* ______
3. *적분:* 필요 없다.
4. *확인:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 시간 이동 성질: $$b_k = a_ke^{-jk(\pi/2)\cdot1} = \frac{\sin(\pi k/2)}{k\pi}e^{-jk\pi/2}$$, $$b_0 = \frac12$$.
4. $$\vert b_k\vert  = \vert a_k\vert $$ (이동은 크기를 바꾸지 않음). 실수 신호라 $$b_{-k} = b_k^*$$인지 보면 $$a_{-k} = a_k$$, $$e^{jk\pi/2} = (e^{-jk\pi/2})^*$$이므로 맞다.

</details>


## 문제 4 · 독립 문제

주기 4, 한 주기에서 $$x(t) = \vert t\vert $$ ($$-2 \le t \le 2$$)인 삼각파의 계수를 구하라. (힌트 없이)

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

예제 3.7의 삼각파는 $$\vert t\vert /2$$($$x(\pm2) = 1$$)이므로 이 신호는 그 두 배다. 선형성으로 계수도 두 배다. 그래서 $$a_0 = 1$$, $$k \ne 0$$이면 $$a_k = 2 \cdot \frac{2\sin(\pi k/2)}{j(k\pi)^2}e^{-jk\pi/2}$$. 정리하면 홀수 $$k$$에서 $$-\frac{4}{(k\pi)^2}$$, 짝수 $$k \ne 0$$에서 0이다. 실수·짝 신호라 계수가 실수·짝인 것과 맞다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 계수를 분석식 수치 적분과 비교 — [30_fourier-coefficient-ladder_p4.py](/Hongs_Blog/studies/signals-and-systems/code/30_fourier-coefficient-ladder_p4/)</div>

</div>


[^s1]: 에이전트 보충. 하위목표 라벨과 네 문제는 원본 예제 3.3~3.7을 본떠 만들었다. 검증 코드로 확인했다.
{% endraw %}
