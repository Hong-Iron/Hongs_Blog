---
layout: "note"
title: "컨벌루션 계산 예제 사다리"
display_title: "컨벌루션 계산 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "19"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: 컨벌루션 합, 컨벌루션 적분"
prev_url: "/studies/signals-and-systems/system-properties-ladder/"
prev_title: "시스템 성질 판별 예제 사다리"
next_url: "/studies/signals-and-systems/fourier-coefficient-ladder/"
next_title: "푸리에 계수 계산 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/convolution-ladder/"
---
{% raw %}
사용 개념: [컨벌루션 합](/Hongs_Blog/studies/signals-and-systems/convolution-sum/), [컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/)

신호 두 개와 "$$y = x * h$$를 구하라"가 주어지면 이 방법을 쓴다. 하위목표는 늘 같다[^s1].

1. *뒤집고 밀기:* 둘 중 단순한 쪽을 뒤집어 $$h(t - \tau)$$를 그린다.
2. *구간 나누기:* 겹침의 끝점이 바뀌는 $$t$$들을 찾아 구간을 나눈다.
3. *구간별 적분(합):* 각 구간에서 겹치는 범위로 적분한다.
4. *확인:* 경계에서 값이 이어지는지, 결과의 길이(폭)가 두 신호 폭의 합인지 본다.

## 문제 1 · 완전한 풀이

$$x(t) = u(t) - u(t-1)$$, $$h(t) = e^{-t}u(t)$$. $$y = x * h$$를 구하라.

1. *뒤집고 밀기:* $$x$$가 단순하므로 교환법칙으로 $$y(t) = \int h(\tau)x(t - \tau)d\tau$$. $$x(t - \tau)$$는 $$\tau \in [t - 1, t]$$에서 1이다.
2. *구간 나누기:* $$h(\tau)$$는 $$\tau > 0$$에서만 0이 아니다. 끝점 $$t$$와 $$t - 1$$이 0을 지나는 시각은 $$t = 0$$, $$t = 1$$.
3. *구간별 적분:*
    - $$t < 0$$: 겹침 없음, 0.
    - $$0 \le t < 1$$: $$\int_0^t e^{-\tau}d\tau = 1 - e^{-t}$$.
    - $$t \ge 1$$: $$\int_{t-1}^{t}e^{-\tau}d\tau = e^{-(t-1)} - e^{-t} = (e - 1)e^{-t}$$.
4. *확인:* $$t = 1$$에서 $$1 - e^{-1}$$과 $$(e - 1)e^{-1} = 1 - e^{-1}$$이 같다.

## 문제 2 · 마지막 하위목표만 빈칸

$$x[n] = u[n] - u[n-3]$$ (0, 1, 2에서 1), $$h[n] = (0.5)^n u[n]$$.

1. *뒤집고 밀기:* $$y[n] = \sum_k x[k]h[n-k]$$, $$h[n-k]$$는 $$k \le n$$에서 0이 아니다.
2. *구간 나누기:* $$n < 0$$, $$0 \le n \le 2$$, $$n \ge 3$$.
3. *구간별 합:* $$0 \le n \le 2$$: $$\sum_{k=0}^{n}0.5^{n-k} = 2 - 0.5^n$$. $$n \ge 3$$: $$\sum_{k=0}^{2}0.5^{n-k} = 0.5^n(1 + 2 + 4) = 7 \cdot 0.5^n$$.
4. *확인:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$n = 2$$: $$2 - 0.25 = 1.75$$. $$n = 3$$: $$7 \times 0.125 = 0.875$$이고 재귀로 보면 $$y[3] = 0.5 \cdot y[2] + x[3] = 0.875$$. 이산 신호라 경계에서 같은 값일 필요는 없지만, $$y[n] = 0.5y[n-1] + x[n]$$로 확인하면 맞다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$x(t) = u(t) - u(t-2)$$, $$h(t) = u(t) - u(t-3)$$.

1. *뒤집고 밀기:* $$x(\tau)$$와 $$h(t - \tau)$$ ($$\tau \in [t-3, t]$$에서 1).
2. *구간 나누기:* ______
3. *구간별 적분:* ______
4. *확인:* 폭 2와 3의 사각 펄스라 결과의 폭은 5, 꼭대기 높이는 짧은 쪽 폭인 2.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 끝점이 0과 2를 지나는 시각: $$t = 0, 2, 3, 5$$.
3. $$t < 0$$: 0. $$0 \le t < 2$$: $$t$$. $$2 \le t < 3$$: 2. $$3 \le t < 5$$: $$5 - t$$. $$t \ge 5$$: 0. (사다리꼴, $$a = 2$$, $$b = 3$$)

</details>


## 문제 4 · 독립 문제

$$x[n] = 2^n u[-n]$$, $$h[n] = u[n - 2]$$. $$y[n]$$을 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$h[n-k] = u[n-2-k]$$는 $$k \le n - 2$$에서 1. $$x[k]$$는 $$k \le 0$$에서 0이 아니다.
- $$n - 2 \ge 0$$ ($$n \ge 2$$): $$\sum_{k=-\infty}^{0}2^k = 2$$.
- $$n < 2$$: $$\sum_{k=-\infty}^{n-2}2^k = 2^{n-2} \cdot 2 = 2^{n-1}$$.<br>
예제 2.5의 결과를 2칸 늦춘 것과 같다(시불변).

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 네 문제의 결과를 정의대로의 합·수치 적분과 비교 — [19_convolution-ladder_p4.py](/Hongs_Blog/studies/signals-and-systems/code/19_convolution-ladder_p4/)</div>

</div>


[^s1]: 에이전트 보충. 하위목표 라벨과 네 문제는 원본 예제 2.4~2.8과 7주차 사다리꼴 예를 본떠 만들었다. 검증 코드로 확인했다.
{% endraw %}
