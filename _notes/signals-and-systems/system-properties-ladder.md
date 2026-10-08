---
layout: "note"
title: "시스템 성질 판별 예제 사다리"
display_title: "시스템 성질 판별 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "17"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
description: "사용 개념: 기억과 가역성, 인과성, 안정성, 시불변성, 선형성"
prev_url: "/studies/signals-and-systems/dt-period-ladder/"
prev_title: "이산 신호 주기 예제 사다리"
next_url: "/studies/signals-and-systems/convolution-ladder/"
next_title: "컨벌루션 계산 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/system-properties-ladder/"
---
{% raw %}
사용 개념: [기억과 가역성](/Hongs_Blog/studies/signals-and-systems/memory-invertibility/), [인과성](/Hongs_Blog/studies/signals-and-systems/causality/), [안정성](/Hongs_Blog/studies/signals-and-systems/stability/), [시불변성](/Hongs_Blog/studies/signals-and-systems/time-invariance/), [선형성](/Hongs_Blog/studies/signals-and-systems/linearity/)

시험은 식 하나를 주고 여섯 성질을 모두 묻는 꼴이 흔하다. 성질마다 보는 곳이 다르다[^s1].

| 하위목표 | 보는 곳 |
|---|---|
| ① 기억 | 입력 괄호 안이 지금 시각과 다른가 |
| ② 인과 | 입력 괄호 안이 미래가 될 때가 있는가 |
| ③ 안정 | 유계 입력에서 출력이 커질 수 있는가 (반례 하나 또는 한계 증명) |
| ④ 시불변 | 시각이 입력 밖에 직접 있는가, 시간축을 늘이거나 뒤집는가 |
| ⑤ 선형 | 입력 0 → 출력 0인가, 입력에 대해 1차인가 |

## 문제 1 · 완전한 풀이

$$y(t) = tx(t)$$ (예제 1.13, 1.17)[^1]

1. *기억:* $$x(t)$$만 쓰므로 기억 없음.
2. *인과:* 기억 없으므로 인과.
3. *안정:* $$x = 1$$이면 $$y = t$$로 끝없이 커지므로 불안정.
4. *시불변:* $$x_1(t - t_0)$$의 출력은 $$tx_1(t - t_0)$$, 출력을 민 것은 $$(t - t_0)x_1(t - t_0)$$. 다르므로 시변.
5. *선형:* $$t(ax_1 + bx_2) = a\,tx_1 + b\,tx_2 = ay_1 + by_2$$이므로 선형.

## 문제 2 · 마지막 하위목표만 빈칸

\$$y[n] = x[n] - x[n+1]$$

1. *기억:* 다음 시각 입력을 쓰므로 기억 있음.
2. *인과:* $$x[n+1]$$이 미래라 비인과.
3. *안정:* $$\vert x\vert  \le B$$이면 $$\vert y\vert  \le 2B$$이므로 안정.
4. *시불변:* 시각이 입력 밖에 없으므로 시불변.
5. *선형:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

선형. 입력 0에 출력 0이고, $$ax_1 + bx_2$$를 넣으면 $$a(x_1[n] - x_1[n+1]) + b(x_2[n] - x_2[n+1]) = ay_1 + by_2$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$y(t) = x(2t)$$ (예제 1.16)[^2]

1. *기억:* ______
2. *인과:* $$t > 0$$이면 $$2t > t$$라 미래 입력을 쓰므로 비인과.
3. *안정:* ______
4. *시불변:* 입력을 2 늦추면 출력은 1만 늦으므로 시변.
5. *선형:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 기억 있음 ($$t \ne 0$$이면 다른 시각의 입력을 쓴다).
3. 안정 ($$\vert x\vert  \le B$$이면 $$\vert x(2t)\vert  \le B$$).
5. 선형.

</details>


## 문제 4 · 독립 문제

$$y[n] = \mathrm{Re}\{x[n]\} + x[n-1]^2$$의 기억, 인과, 안정, 시불변, 선형을 판별하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

기억 있음($$x[n-1]$$), 인과(과거만 씀), 안정($$\vert y\vert  \le B + B^2$$), 시불변(시각이 입력 밖에 없음), 비선형(제곱 항. 입력 $$x = 1$$을 2배 하면 $$\mathrm{Re}$$ 부분은 2배지만 제곱 부분은 4배가 된다).

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 다섯 성질의 판정을 무작위 입력으로 시험 — [17_system-properties-ladder_p4.py](/Hongs_Blog/studies/signals-and-systems/code/17_system-properties-ladder_p4/)</div>

</div>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/04.Week04_CH01_3_handout.pdf, p.14, p.22
[^2]: 같은 자료, p.18
[^s1]: 에이전트 보충. 판별 순서 표, 문제 2·4, 문제 3의 기억·안정·선형 판정은 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
