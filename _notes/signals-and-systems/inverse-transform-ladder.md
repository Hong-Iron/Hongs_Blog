---
layout: "note"
title: "푸리에 역변환 예제 사다리"
display_title: "푸리에 역변환 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "44"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: 미분방정식 시스템의 주파수 응답, 컨벌루션 성질과 주파수 응답"
prev_url: "/studies/signals-and-systems/fourier-coefficient-ladder/"
prev_title: "푸리에 계수 계산 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/inverse-transform-ladder/"
---
{% raw %}
사용 개념: [미분방정식 시스템의 주파수 응답](/Hongs_Blog/studies/signals-and-systems/lccde-frequency-response/), [컨벌루션 성질과 주파수 응답](/Hongs_Blog/studies/signals-and-systems/convolution-property/)

$$j\omega$$의 유리함수를 시간 함수로 되돌리는 문제다. 하위목표는 다음과 같다[^s1].

1. *인수분해:* 분모를 $$(j\omega + a)$$ 꼴로 나눈다.
2. *부분 분수:* 서로 다른 근은 $$\frac{A}{j\omega + a}$$, 중근은 $$\frac{A}{j\omega+a} + \frac{B}{(j\omega+a)^2}$$.
3. *계수 구하기:* 해당 인수를 곱하고 근을 넣거나, 계수 비교.
4. *표로 되돌리기:* $$\frac{1}{a + j\omega} \to e^{-at}u(t)$$, $$\frac{1}{(a + j\omega)^2} \to te^{-at}u(t)$$.

## 문제 1 · 완전한 풀이

\$$Y = \dfrac{1}{(j\omega + 2)(j\omega + 5)}$$

1. *인수분해:* 이미 되어 있다.
2. *부분 분수:* $$\frac{A}{j\omega + 2} + \frac{B}{j\omega + 5}$$.
3. *계수:* $$A = \frac{1}{j\omega + 5}\big\vert _{j\omega = -2} = \frac13$$, $$B = \frac{1}{j\omega + 2}\big\vert _{j\omega = -5} = -\frac13$$.
4. *되돌리기:* $$y(t) = \frac13(e^{-2t} - e^{-5t})u(t)$$.

## 문제 2 · 마지막 하위목표만 빈칸

\$$H = \dfrac{j\omega + 3}{(j\omega + 1)(j\omega + 2)}$$

1. *인수분해:* 되어 있다.
2. *부분 분수:* $$\frac{A}{j\omega + 1} + \frac{B}{j\omega + 2}$$.
3. *계수:* $$A = \frac{-1 + 3}{-1 + 2} = 2$$, $$B = \frac{-2 + 3}{-2 + 1} = -1$$.
4. *되돌리기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$h(t) = (2e^{-t} - e^{-2t})u(t)$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

\$$Y = \dfrac{1}{(j\omega + 1)^2(j\omega + 2)}$$

1. *인수분해:* 되어 있다(중근 $$-1$$).
2. *부분 분수:* ______
3. *계수:* ______
4. *되돌리기:* $$y(t) = (te^{-t} - e^{-t} + e^{-2t})u(t)$$.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$\frac{A}{j\omega + 1} + \frac{B}{(j\omega + 1)^2} + \frac{C}{j\omega + 2}$$.
3. $$B = \frac{1}{j\omega + 2}\big\vert _{-1} = 1$$, $$C = \frac{1}{(j\omega+1)^2}\big\vert _{-2} = 1$$, $$A = \frac{d}{d(j\omega)}\frac{1}{j\omega + 2}\big\vert _{-1} = -1$$.

</details>


## 문제 4 · 독립 문제

$$\frac{d^2y}{dt^2} + 5\frac{dy}{dt} + 6y = \frac{dx}{dt} + 4x$$인 시스템에 $$x(t) = e^{-2t}u(t)$$를 넣었을 때 $$y(t)$$를 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$H = \frac{j\omega + 4}{(j\omega+2)(j\omega+3)}$$, $$Y = HX = \frac{j\omega + 4}{(j\omega + 2)^2(j\omega + 3)} = -\frac{1}{j\omega + 2} + \frac{2}{(j\omega+2)^2} + \frac{1}{j\omega + 3}$$. 그래서 $$y(t) = (-e^{-2t} + 2te^{-2t} + e^{-3t})u(t)$$.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 부분 분수가 원래 유리함수와 같음, 문제 4의 $$y(t)$$가 미분방정식과 $$y(0) = 0$$을 만족 — [44_inverse-transform-ladder_p4.py](/Hongs_Blog/studies/signals-and-systems/code/44_inverse-transform-ladder_p4/)</div>

</div>


[^s1]: 에이전트 보충. 하위목표 라벨과 네 문제는 원본 예제 4.19, 4.25, 4.26을 본떠 만들었다. 검증 코드로 확인했다.
{% endraw %}
