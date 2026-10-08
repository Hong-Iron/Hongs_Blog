---
layout: "note"
title: "이산 신호 주기 예제 사다리"
display_title: "이산 신호 주기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "09"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: 이산 시간 복소 지수 신호"
prev_url: "/studies/signals-and-systems/ode-ladder/"
prev_title: "미분방정식 풀이 예제 사다리"
next_url: "/studies/signals-and-systems/system-properties-ladder/"
next_title: "시스템 성질 판별 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/dt-period-ladder/"
---
{% raw %}
사용 개념: [이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/)

이 방법을 떠올리는 신호는 "$$\cos(\omega_0 n)$$이나 $$e^{j\omega_0 n}$$ 여러 개의 합이 주기적인가, 주기는 얼마인가"라는 질문이다. 하위목표는 ① 항마다 $$\omega_0/2\pi$$를 기약분수 $$m/N$$으로 ② 무리수가 하나라도 있으면 비주기 ③ 항별 $$N$$의 최소공배수[^s1].

## 문제 1 · 완전한 풀이

$$x[n] = e^{j(2\pi/3)n} + e^{j(3\pi/4)n}$$ (예제 1.6)[^1]

1. *기약분수:* $$\frac{2\pi/3}{2\pi} = \frac13$$ → $$N_1 = 3$$. $$\frac{3\pi/4}{2\pi} = \frac38$$ → $$N_2 = 8$$.
2. *유리수 확인:* 둘 다 유리수라 주기적이다.
3. *최소공배수:* $$\mathrm{lcm}(3, 8) = 24$$.

## 문제 2 · 마지막 하위목표만 빈칸

\$$x[n] = \cos(\pi n/4) + \sin(\pi n/6)$$

1. *기약분수:* $$\frac18$$ → $$N_1 = 8$$. $$\frac{1}{12}$$ → $$N_2 = 12$$.
2. *유리수 확인:* 주기적이다.
3. *최소공배수:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\mathrm{lcm}(8, 12) = 24$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$x[n] = \cos(30\pi n/8) + e^{j(300\pi/8)n}$$[^2]

1. *기약분수:* ______
2. *유리수 확인:* 둘 다 유리수다.
3. *최소공배수:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. $$\frac{30/8}{2} = \frac{15}{8}$$ → $$N_1 = 8$$ ($$m = 15$$). $$\frac{300/8}{2} = \frac{75}{4}$$ → $$N_2 = 4$$ ($$m = 75$$).
3. $$\mathrm{lcm}(8, 4) = 8$$.

</details>


## 문제 4 · 독립 문제

다음 각각의 기본 주기를 구하거나 비주기임을 보이라. (가) $$\cos(8\pi n/31) + \cos(\pi n/2)$$ (나) $$\cos(n/6) + \cos(\pi n)$$

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) $$\frac{4}{31}$$ → 31, $$\frac14$$ → 4. 최소공배수 124.<br>
(나) $$\frac{1}{12\pi}$$가 무리수라 첫 항이 주기적이지 않으므로 합도 비주기다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 각 항의 $$N$$, $$m$$과 문제 1의 주기 24 — [09_dt-complex-exponential_verify.py](/Hongs_Blog/studies/signals-and-systems/code/09_dt-complex-exponential_verify/), 문제 2~4의 주기는 [09_dt-period-ladder_p4.py](/Hongs_Blog/studies/signals-and-systems/code/09_dt-period-ladder_p4/)</div>

</div>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/03.Week03_CH01_2_handout.pdf, p.26
[^2]: 같은 자료, p.24 (두 주파수는 원본 MATLAB 예)
[^s1]: 에이전트 보충. 하위목표 라벨과 문제 2·4는 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
