---
layout: "note"
title: "사격법"
display_title: "사격법 (Shooting Method)"
kind: "concept"
kind_label: "기법"
num: "36"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Shooting Method", "슈팅 방법", "경계값 문제", "Boundary-Value Problem", "BVP"]
description: "막대 양 끝의 온도처럼 조건이 시작점과 끝점에 나눠 주어진 미분방정식(경계값 문제)을 푼다. 시작점에서 모르는 기울기를 하나 짐작해 끝까지 계산해 보고, 끝점에 얼마나 빗나갔는지 보고 기울기를 고친다. 대포를 쏘아 보고 조준을 고치는 것과 같다. 방정식이 일차(선형)이면 두 번 쏘…"
prev_url: "/studies/numerical-analysis/ode-systems/"
prev_title: "연립 상미분방정식"
next_url: "/studies/numerical-analysis/finite-difference-bvp/"
next_title: "유한 차분법"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/shooting-method/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

막대 양 끝의 온도처럼 조건이 시작점과 끝점에 나눠 주어진 미분방정식(경계값 문제)을 푼다. 시작점에서 모르는 기울기를 하나 짐작해 끝까지 계산해 보고, 끝점에 얼마나 빗나갔는지 보고 기울기를 고친다. 대포를 쏘아 보고 조준을 고치는 것과 같다. 방정식이 일차(선형)이면 두 번 쏘아 보고 직선 보간 한 번으로 정답 기울기가 나온다. 비선형이면 근 찾기를 되풀이해야 하고, 답이 여러 개일 수도 있다.

</div>


## 예시로 보기

길이 10 m 막대의 양 끝 온도가 $$T(0) = 40$$, $$T(10) = 200$$이고, 옆면으로 공기(20°C)와 열을 주고받는다. 막대 안의 온도는 다음을 따른다[^1][^2].

$$\frac{d^2T}{dx^2} + h'(T_a - T) = 0, \qquad h' = 0.01,\ T_a = 20$$


$$z = T'$$로 두면 $$T' = z$$, $$z' = h'(T - T_a)$$인 연립 방정식이다. $$T(0) = 40$$은 알지만 $$z(0)$$을 모른다. 두 번 짐작해 RK4로 끝까지 계산한다[^2].

| 짐작 $$z(0)$$ | 계산한 $$T(10)$$ |
|---|---|
| 10 | 168.3797 |
| 20 | 285.8980 |

목표 200은 그 사이에 있다. 두 점을 잇는 직선으로 보간한다[^2].

$$z(0) = 10 + \frac{20 - 10}{285.8980 - 168.3797}(200 - 168.3797) = 12.6907$$


이 기울기로 다시 쏘면 $$T(10) = 200$$이 정확히 나온다. 첫 번째는 끝에서 모자라고(168), 두 번째는 넘쳤던(286) 것을 그림으로 보면 사이에서 과녁을 맞힌다[^3].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/36_shooting-method_fig1.svg" alt="그림" loading="lazy">

점선 두 개가 짐작한 두 기울기로 쏜 결과다. 하나는 끝에서 168로 모자라고, 하나는 286으로 넘친다. 두 결과를 직선으로 보간한 기울기 12.69로 쏘면 초록 선처럼 과녁 200을 맞힌다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 슬라이드의 두 $$T(10)$$(RK4, 걸음 2)과 $$z(0) = 12.6907$$, 보간한 기울기로 정확히 200, 참값과 비교, 비선형 문제를 할선법으로, 선형 보간 한 번으로는 비선형 실패, 카드 C2 — [36_shooting-method_impl.py](/Hongs_Blog/studies/numerical-analysis/code/36_shooting-method_impl/)</div>

</div>


## 정의

**초깃값 문제**는 모든 조건이 같은 $$x$$에서 주어지고, **경계값 문제**는 조건이 서로 다른 $$x$$에서 주어진다. 예: $$\frac{d^2y}{dx^2} = f(x, y)$$, $$y(0) = y_0$$, $$y(L) = y_L$$[^4][^5].

**사격법**은 경계값 문제를 초깃값 문제로 바꾼다[^2].

1. 2계 방정식을 1계 연립으로 바꾼다($$z = y'$$).
2. 모르는 처음 값 $$z(0)$$을 짐작하고 초깃값 문제로 끝까지 적분한다(예: RK4).
3. 끝점의 값 $$y(L)$$이 경계 조건 $$y_L$$과 맞을 때까지 $$z(0)$$을 고친다.

**선형 방정식.** $$y(L)$$이 $$z(0)$$의 일차 함수라, 두 번 쏜 결과를 직선 보간한 값이 정답이다[^2][^s1].

**비선형 방정식.** $$y(L) = f(z_0)$$이 $$z_0$$의 비선형 함수다. 경계 조건으로 근 찾기 문제를 세운다[^6].

$$g(z_0) = f(z_0) - y_L = 0$$


$$g$$를 계산할 때마다 미분방정식을 끝까지 푸는 셈이다. [할선법](/Hongs_Blog/studies/numerical-analysis/secant-method/)이나 이분법으로 근을 찾는다[^6].

## 활용

- 막대·보의 온도와 처짐, 우주선이 목표 지점에 도착하는 궤도 찾기, 양자역학의 고유값 문제에 쓴다[^s1].
- 비선형 예: $$y'' = 1.5y^2$$, $$y(0) = 4$$, $$y(1) = 1$$. 짐작 $$-7$$, $$-9$$에서 할선법을 되풀이하면 $$z(0) = -8$$(참값 $$y = \frac{4}{(1 + x)^2}$$)을 찾는다. 같은 두 짐작으로 직선 보간 한 번만 하면 빗나간다(검증 코드)[^s1].
- 흔한 실수: 비선형 문제에 직선 보간 한 번으로 끝내는 것. 또 비선형 경계값 문제는 답이 여럿일 수 있어(위 예는 $$z(0) \approx -35.9$$인 답도 있다), 짐작한 시작값 근처의 답만 찾는다는 것을 잊는 것.

## 연결

- 선수: [연립 상미분방정식](/Hongs_Blog/studies/numerical-analysis/ode-systems/)(초깃값 문제 풀이), [할선법](/Hongs_Blog/studies/numerical-analysis/secant-method/)(비선형의 근 찾기)
- 직선 보간: [다항식 보간](/Hongs_Blog/studies/numerical-analysis/polynomial-interpolation/)
- 같은 문제를 연립 일차방정식으로: [유한 차분법](/Hongs_Blog/studies/numerical-analysis/finite-difference-bvp/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 사격법의 세 단계를 쓰고, 선형과 비선형에서 기울기를 고치는 방법의 차이를 말하라.</summary>

**답:** 1계 연립으로 바꾸기 → 모르는 처음 기울기를 짐작해 끝까지 적분 → 끝점 값이 맞을 때까지 기울기 고치기. 선형이면 두 번 쏜 뒤 직선 보간 한 번, 비선형이면 $$g(z_0) = f(z_0) - y_L$$의 근을 할선법 등으로 되풀이해 찾는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 선형 경계값 문제에서 $$z(0) = 0$$이면 $$y(L) = 100$$, $$z(0) = 10$$이면 $$y(L) = 180$$이다. $$y(L) = 140$$이 되려면 $$z(0)$$은?</summary>

**답:** $$0 + \frac{10 - 0}{180 - 100}(140 - 100) = 5$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 선형 방정식이면 직선 보간 한 번으로 정확한 답이 나오는 이유는?</summary>

**답:** 선형 방정식의 풀이는 처음 값에 대해 일차로 바뀐다(두 풀이의 섞음도 풀이다). 그래서 끝점 값 $$y(L)$$이 $$z(0)$$의 일차 함수, 곧 직선이다. 직선 위의 두 점으로 그은 직선은 그 직선 자체라 보간이 정확하다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/19.na19_diff_eq2.pdf, p.6
[^2]: 같은 자료, p.7
[^3]: 같은 자료, p.8
[^4]: 같은 자료, p.4
[^5]: 같은 자료, p.5
[^6]: 같은 자료, p.9
[^s1]: 에이전트 보충. 선형이면 보간이 정확한 이유, 쓰는 곳, 비선형 예($$y'' = 1.5y^2$$)와 두 번째 답, 흔한 실수, 카드 C2·C3은 원본에 없다. 슬라이드의 168.3797, 285.8980은 RK4 걸음 2로 계산한 값이다. 참값은 168.3817, 285.9019다. 구현 코드로 확인했다.
[^s2]: 에이전트 보충. 그림은 원본에 없다. [36_shooting-method_plot.py](/Hongs_Blog/studies/numerical-analysis/code/36_shooting-method_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: 걸음 2의 RK4로 $$T(10)$$ = 168.3797과 285.8980, 보간한 기울기 12.6907로 정확히 200. 곡선은 걸음 0.05로 그렸다.
{% endraw %}
