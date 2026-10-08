---
layout: "note"
title: "짝 신호와 홀 신호"
display_title: "짝 신호와 홀 신호 (Even and Odd Signals)"
kind: "concept"
kind_label: "정의"
num: "07"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-08"
status: "verified"
aliases: ["Even Signal", "Odd Signal", "우함수", "기함수", "짝 부분", "Even Part", "홀 부분", "Odd Part", "짝·홀 분해", "Even-Odd Decomposition"]
description: "시간축을 뒤집어도 그대로인 신호가 짝 신호(\\cos t처럼 세로축에 대해 좌우 대칭), 뒤집으면 부호만 바뀌는 신호가 홀 신호(\\sin t처럼 원점에 대해 대칭)다. 어떤 신호든 짝 부분과 홀 부분의 합으로 꼭 한 가지 방법으로 나눌 수 있다. 홀 신호는 t = 0에서 값이 반드시…"
prev_url: "/studies/signals-and-systems/periodic-signals/"
prev_title: "주기 신호"
next_url: "/studies/signals-and-systems/ct-complex-exponential/"
next_title: "연속 시간 복소 지수 신호"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/even-odd-signals/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

시간축을 뒤집어도 그대로인 신호가 짝 신호($$\cos t$$처럼 세로축에 대해 좌우 대칭), 뒤집으면 부호만 바뀌는 신호가 홀 신호($$\sin t$$처럼 원점에 대해 대칭)다. 어떤 신호든 짝 부분과 홀 부분의 합으로 꼭 한 가지 방법으로 나눌 수 있다. 홀 신호는 $$t = 0$$에서 값이 반드시 0이다.

</div>


## 예시로 보기

단위 계단 $$u[n]$$($$n \ge 0$$에서 1, 그 밖은 0)은 짝도 홀도 아니다. 그래도 둘로 나눌 수 있다[^1].

| $$n$$ | $$\cdots, -2, -1$$ | $$0$$ | $$1, 2, \cdots$$ |
|---|---|---|---|
| $$u[n]$$ | 0 | 1 | 1 |
| 짝 부분 $$\mathcal{E}v\{u[n]\}$$ | $$\frac12$$ | 1 | $$\frac12$$ |
| 홀 부분 $$\mathcal{O}d\{u[n]\}$$ | $$-\frac12$$ | 0 | $$\frac12$$ |

두 줄을 더하면 첫 줄이 된다. 짝 부분은 좌우가 같고, 홀 부분은 좌우 부호가 반대다.

## 정의

| | 연속 시간 | 이산 시간 |
|---|---|---|
| 짝 신호 | $$x(-t) = x(t)$$ | $$x[-n] = x[n]$$ |
| 홀 신호 | $$x(-t) = -x(t)$$ | $$x[-n] = -x[n]$$ |

홀 신호에 $$t = 0$$을 넣으면 $$x(0) = -x(0)$$이므로 $$x(0) = 0$$이다[^2].

신호를 뒤집은 것과 원래 신호를 더하면 짝, 빼면 홀이 된다. 그래서 짝 부분과 홀 부분은 다음과 같다[^1].

$$\mathcal{E}v\{x(t)\} = \tfrac12\bigl[x(t) + x(-t)\bigr], \qquad \mathcal{O}d\{x(t)\} = \tfrac12\bigl[x(t) - x(-t)\bigr]$$


두 식을 더하면 $$x(t)$$가 그대로 나온다. 짝 부분에 $$-t$$를 넣으면 식이 그대로이고, 홀 부분에 넣으면 부호만 바뀐다. 문서에서는 짧게 $$x_e(t)$$, $$x_o(t)$$로도 쓴다.

## 예제

**예** $$x[n] = 3\cos(6\pi n) + 4\sin(8\pi n)$$의 짝 부분과 홀 부분[^3]

- 뒤집기: $$\cos$$는 짝, $$\sin$$은 홀이므로 $$x[-n] = 3\cos(6\pi n) - 4\sin(8\pi n)$$.
- 짝 부분: $$\frac12(x[n] + x[-n]) = 3\cos(6\pi n)$$.
- 홀 부분: $$\frac12(x[n] - x[-n]) = 4\sin(8\pi n)$$.

계산 방법은 맞다. 다만 $$n$$이 정수이므로 $$\sin(8\pi n) = 0$$, $$\cos(6\pi n) = 1$$이라 이 신호는 사실 상수 $$x[n] = 3$$이고 홀 부분은 0이다. 같은 식을 연속 시간 $$t$$로 바꾸면 홀 부분이 실제로 $$4\sin(8\pi t)$$가 된다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$u[n]$$의 분해(그림 1.18), 무작위 신호의 분해가 짝·홀 조건을 만족하고 합이 원래 신호임, 위 예제의 분해와 정수 $$n$$에서 값이 3임을 확인 — [07_even-odd-signals_verify.py](/Hongs_Blog/studies/signals-and-systems/code/07_even-odd-signals_verify/)</div>

</div>


## 활용

- 3장 푸리에 급수에서, 실수 짝 신호는 코사인 항만, 실수 홀 신호는 사인 항만 가진다. 계산할 항이 절반으로 준다.
- 홀 신호를 대칭 구간 $$[-T, T]$$에서 적분하면 0이다. 적분 계산을 줄이는 데 자주 쓴다[^s1].

## 연결

- 선수: [독립 변수의 변환](/Hongs_Blog/studies/signals-and-systems/independent-variable-transform/) (시간 반전)
- 수학 쪽: [푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$x(t)$$의 짝 부분과 홀 부분을 식으로 쓰라.</summary>

**답:** $$x_e(t) = \frac12[x(t) + x(-t)]$$, $$x_o(t) = \frac12[x(t) - x(-t)]$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 홀 신호는 왜 $$t = 0$$에서 반드시 0인가?</summary>

**답:** 정의 $$x(-t) = -x(t)$$에 $$t = 0$$을 넣으면 $$x(0) = -x(0)$$, 즉 $$2x(0) = 0$$이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$x(t) = e^{t}$$의 짝 부분과 홀 부분은?</summary>

**답:** $$\frac12(e^t + e^{-t}) = \cosh t$$, $$\frac12(e^t - e^{-t}) = \sinh t$$.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/02.Week02_CH01_1_handout.pdf, p.39 (그림 1.18)
[^2]: 같은 자료, p.38
[^3]: 같은 자료, p.40
[^s1]: 에이전트 보충. 이 예제가 정수 $$n$$에서 상수 3이 된다는 지적, 대칭 구간 적분이 0이라는 활용, 확인 문제 C3은 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
