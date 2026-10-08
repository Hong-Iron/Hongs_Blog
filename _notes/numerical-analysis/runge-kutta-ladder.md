---
layout: "note"
title: "룽게-쿠타 예제 사다리"
display_title: "룽게-쿠타 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "34"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: 룽게-쿠타 방법의 2차 RK(w2 = \\frac{1}{2a}, w1 = 1 - w2)와 RK4."
prev_url: "/studies/numerical-analysis/jacobi-gs-ladder/"
prev_title: "야코비와 가우스-자이델 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/runge-kutta-ladder/"
---
{% raw %}
사용 개념: [룽게-쿠타 방법](/Hongs_Blog/studies/numerical-analysis/runge-kutta/)의 2차 RK($$w_2 = \frac{1}{2a}$$, $$w_1 = 1 - w_2$$)와 RK4.

한 걸음의 하위목표는 넷이다. ① 첫 기울기: $$k_1 = f(x_i, y_i)$$ ② 다음 기울기들: $$k_1$$로 짐작한 점에서 잰다 ③ 결합: 무게 평균 ④ 다음 점과 확인: $$y_{i+1} = y_i + h \times$$(평균 기울기), 참값이 있으면 비교한다[^s1].

## 문제 1 · 완전한 풀이

$$y' = y$$, $$y(0) = 1$$에 RK4로 $$h = 0.1$$ 한 걸음을 가라.

1. *첫 기울기:* $$k_1 = f(0, 1) = 1$$.
2. *다음 기울기들:* $$k_2 = f(0.05, 1 + 0.05 \cdot 1) = 1.05$$, $$k_3 = f(0.05, 1 + 0.05 \cdot 1.05) = 1.0525$$, $$k_4 = f(0.1, 1 + 0.1 \cdot 1.0525) = 1.10525$$.
3. *결합:* $$\frac16(1 + 2.1 + 2.105 + 1.10525) = \frac{6.31025}{6} \approx 1.0517083$$.
4. *다음 점과 확인:* $$y_1 = 1 + 0.1 \times 1.0517083 = 1.1051708$$. 참값 $$e^{0.1} = 1.1051709$$와 일곱째 자리까지 같다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [34_runge-kutta-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/34_runge-kutta-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

$$y' = -2y$$, $$y(0) = 1$$에 중점 방법($$a = \frac12$$, $$w_1 = 0$$, $$w_2 = 1$$)으로 $$h = 0.1$$ 한 걸음을 가라.

1. *첫 기울기:* $$k_1 = -2$$.
2. *다음 기울기들:* 반 걸음 앞 $$(0.05,\ 1 + 0.05 \cdot (-2)) = (0.05, 0.9)$$에서 $$k_2 = -1.8$$.
3. *결합:* $$w_1k_1 + w_2k_2 = -1.8$$.
4. *다음 점과 확인:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$y_1 = 1 + 0.1 \times (-1.8) = 0.82$$. 참값 $$e^{-0.2} \approx 0.8187$$. 오일러였다면 $$1 - 0.2 = 0.8$$로 더 많이 빗나간다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$y' = x - y$$, $$y(0) = 1$$에 호인 방법($$a = 1$$)으로 $$h = 0.2$$ 한 걸음을 가라.

1. *첫 기울기:* ______
2. *다음 기울기들:* $$k_2 = -0.6$$.
3. *결합:* ______
4. *다음 점과 확인:* $$y_1 = 0.84$$. 참값 $$y = x - 1 + 2e^{-x}$$에서 $$y(0.2) \approx 0.8375$$.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. $$k_1 = f(0, 1) = 0 - 1 = -1$$. ($$k_2$$는 끝점 짐작 $$(0.2,\ 1 + 0.2 \cdot (-1)) = (0.2, 0.8)$$에서 $$0.2 - 0.8 = -0.6$$.)
3. 호인은 $$w_1 = w_2 = \frac12$$이라 $$\frac{-1 + (-0.6)}{2} = -0.8$$. $$y_1 = 1 + 0.2 \times (-0.8) = 0.84$$.

</details>


## 문제 4 · 독립 문제

$$y' = y^2$$, $$y(0) = 1$$에 랄스턴 방법($$a = \frac34$$)으로 $$h = 0.1$$ 한 걸음을 가고, 참값 $$y = \frac{1}{1 - x}$$와 비교하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

무게 $$w_2 = \frac{1}{2 \cdot 3/4} = \frac23$$, $$w_1 = \frac13$$. $$k_1 = 1$$, $$k_2 = f(0.075,\ 1 + 0.075) = 1.075^2 = 1.155625$$. 결합 $$\frac13 + \frac23 \times 1.155625 \approx 1.10375$$. $$y_1 \approx 1.110375$$. 참값 $$\frac{1}{0.9} \approx 1.111111$$과 0.0007 차이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [34_runge-kutta-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/34_runge-kutta-ladder_p4/)</div>

</div>


[^s1]: 에이전트 보충. 이 문서의 문제와 수치는 원본에 없다. 슬라이드 18회 p.8~10의 2차 RK 유도와 RK4를 연습하도록 만들었고, 답은 문제 코드로 확인했다.
{% endraw %}
