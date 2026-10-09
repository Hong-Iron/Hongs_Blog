---
layout: "note"
title: "야코비와 가우스-자이델 예제 사다리"
display_title: "야코비와 가우스-자이델 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "20"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: 야코비 방법과 가우스-자이델 방법의 갱신식, 대각 우세, 멈추는 기준."
prev_url: "/studies/numerical-analysis/b-spline-ladder/"
prev_title: "B-스플라인 예제 사다리"
next_url: "/studies/numerical-analysis/runge-kutta-ladder/"
next_title: "룽게-쿠타 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/jacobi-gs-ladder/"
---
{% raw %}
사용 개념: [야코비 방법과 가우스-자이델 방법](/Hongs_Blog/studies/numerical-analysis/jacobi-gauss-seidel/)의 갱신식, 대각 우세, 멈추는 기준.

하위목표는 넷이다. ① 대각 우세 확인: 필요하면 행 순서를 바꾼다 ② 식마다 자기 변수로 풀기 ③ 한 회차 갱신: 야코비는 옛 값만, 가우스-자이델은 방금 고친 값을 바로 쓴다 ④ 멈춤 판정: 상대 변화 $$\left\vert \frac{x^{(k)} - x^{(k-1)}}{x^{(k)}}\right\vert $$을 허용 오차와 비교한다[^s1].

## 문제 1 · 완전한 풀이

$$3x + y = 5$$, $$x + 2y = 5$$(참값 $$(1, 2)$$)를 $$(0, 0)$$에서 가우스-자이델로 두 회차 돌려라.

1. *대각 우세 확인:* $$3 > 1$$, $$2 > 1$$. 그대로 쓴다.
2. *자기 변수로 풀기:* $$x = \frac{5 - y}{3}$$, $$y = \frac{5 - x}{2}$$.
3. *한 회차 갱신:* 1회차 $$x = \frac53$$, 이 새 $$x$$로 $$y = \frac{5 - 5/3}{2} = \frac53$$. 2회차 $$x = \frac{5 - 5/3}{3} = \frac{10}{9}$$, $$y = \frac{5 - 10/9}{2} = \frac{35}{18} \approx 1.944$$.
4. *멈춤 판정:* $$x$$의 상대 변화 $$\left\vert \frac{10/9 - 5/3}{10/9}\right\vert  = 50\%$$라 아직 멈추지 않는다.

같은 1회차를 야코비로 하면 $$y = \frac{5 - 0}{2} = 2.5$$다. 옛 $$x = 0$$을 쓰기 때문이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [20_jacobi-gs-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/20_jacobi-gs-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

$$4x - y = 2$$, $$-x + 4y = 7$$(참값 $$(1, 2)$$)을 $$(0, 0)$$에서 가우스-자이델로 두 회차 돌리고, 허용 오차 1%로 멈출지 판정하라.

1. *대각 우세 확인:* $$4 > 1$$, $$4 > 1$$.
2. *자기 변수로 풀기:* $$x = \frac{2 + y}{4}$$, $$y = \frac{7 + x}{4}$$.
3. *한 회차 갱신:* 1회차 $$(0.5, 1.875)$$, 2회차 $$(0.96875, 1.9921875)$$.
4. *멈춤 판정:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$x$$의 상대 변화 $$\left\vert \frac{0.96875 - 0.5}{0.96875}\right\vert  \approx 48.4\%$$로 1%보다 크다. 멈추지 않고 다음 회차로 간다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$x + 5y = 11$$, $$4x + y = 6$$을 $$(0, 0)$$에서 야코비로 두 회차 돌려라.

1. *대각 우세 확인:* ______
2. *자기 변수로 풀기:* $$x = \frac{6 - y}{4}$$, $$y = \frac{11 - x}{5}$$.
3. *한 회차 갱신:* ______
4. *멈춤 판정:* 참값 $$(1, 2)$$에 다가가는 중이다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 쓰인 순서대로면 1행 $$\vert 1\vert  < 5$$라 대각 우세가 아니다. 두 식을 바꿔 $$4x + y = 6$$, $$x + 5y = 11$$로 쓰면 $$4 > 1$$, $$5 > 1$$이다.
3. 1회차(옛 값 $$(0, 0)$$만 씀): $$x = 1.5$$, $$y = 2.2$$. 2회차(옛 값 $$(1.5, 2.2)$$): $$x = \frac{6 - 2.2}{4} = 0.95$$, $$y = \frac{11 - 1.5}{5} = 1.9$$.

</details>


## 문제 4 · 독립 문제

(a) 문제 2의 계를 이완 계수 $$\lambda = 1.2$$인 가우스-자이델로 $$(0, 0)$$에서 한 회차 돌려라. (b) $$x + 2y = 3$$, $$2x + y = 3$$에 야코비를 $$(0, 0)$$에서 네 회차 돌리면 어떻게 되는가? 이유는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) $$x$$: 새 값 0.5를 섞어 $$1.2 \times 0.5 + (-0.2) \times 0 = 0.6$$. $$y$$: 새 $$x = 0.6$$으로 $$\frac{7 + 0.6}{4} = 1.9$$, 섞으면 $$1.2 \times 1.9 = 2.28$$. 결과 $$(0.6, 2.28)$$. 참값 2를 넘는 $$y$$처럼 과이완은 한 걸음을 키운다.<br>
(b) $$(3, 3) \to (-3, -3) \to (9, 9) \to (-15, -15)$$로 발산한다. 대각이 1이고 나머지가 2라 대각 우세가 아니고, 오차가 회차마다 2배로 커진다. 참값은 $$(1, 1)$$이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [20_jacobi-gs-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/20_jacobi-gs-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 원본에 없다. 슬라이드 11회 p.4~13의 갱신식, 수렴 조건, 이완을 연습하도록 만들었고, 답은 분수로 정확히 계산하는 문제 코드로 확인했다.
{% endraw %}
