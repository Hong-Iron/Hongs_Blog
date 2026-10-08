---
layout: "note"
title: "단위 임펄스와 단위 계단"
display_title: "단위 임펄스와 단위 계단 (Unit Impulse and Unit Step)"
kind: "concept"
kind_label: "정의"
num: "10"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
updated: "2026-10-08"
status: "verified"
aliases: ["Unit Impulse", "Unit Step", "단위 샘플", "Unit Sample", "디랙 델타", "Dirac Delta", "크로네커 델타", "Kronecker Delta", "누적 합", "Running Sum", "표본화 성질", "Sampling Property", "체 거르기 성질", "Sifting Property", "단위 계단 함수", "Unit Step Function"]
description: "단위 계단은 스위치를 켜는 순간이다. 0이던 값이 t = 0에 1로 올라가 그대로 머문다. 단위 임펄스는 그 스위치를 켜는 \"순간의 충격\" 하나다. 폭은 0이고 넓이는 1인 아주 뾰족한 바늘이라, 계단을 미분하면 임펄스가 나오고 임펄스를 쌓아 올리면(누적하면) 계단이 된다. 신호에…"
prev_url: "/studies/signals-and-systems/dt-complex-exponential/"
prev_title: "이산 시간 복소 지수 신호"
next_url: "/studies/signals-and-systems/sampling-quantization/"
next_title: "표본화와 양자화"
math: true
mermaid: false
code_count: 1
permalink: "/studies/signals-and-systems/unit-impulse-step/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

단위 계단은 스위치를 켜는 순간이다. 0이던 값이 $$t = 0$$에 1로 올라가 그대로 머문다. 단위 임펄스는 그 스위치를 켜는 "순간의 충격" 하나다. 폭은 0이고 넓이는 1인 아주 뾰족한 바늘이라, 계단을 미분하면 임펄스가 나오고 임펄스를 쌓아 올리면(누적하면) 계단이 된다. 신호에 임펄스를 곱하면 그 한 순간의 값만 뽑혀 나온다. 연속 시간 임펄스는 보통의 함수가 아니라 넓이만 의미가 있는 극한이므로, 높이를 묻거나 곱하기 둘을 하면 안 된다.

</div>


## 예시로 보기

이산 시간에서 둘의 관계는 간단하다[^1].

| $$n$$ | $$\cdots$$ | $$-2$$ | $$-1$$ | $$0$$ | $$1$$ | $$2$$ | $$\cdots$$ |
|---|---|---|---|---|---|---|---|
| $$\delta[n]$$ | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| $$u[n]$$ | 0 | 0 | 0 | 1 | 1 | 1 | 1 |
| $$u[n] - u[n-1]$$ | 0 | 0 | 0 | 1 | 0 | 0 | 0 |

계단에서 한 칸 늦은 계단을 빼면, 값이 바뀌는 $$n = 0$$에서만 1이 남는다. 그것이 임펄스다. 거꾸로 임펄스를 왼쪽 끝부터 $$n$$까지 더해 가면 $$n < 0$$에서는 아직 1을 만나지 못해 0이고, $$n \ge 0$$에서는 1을 한 번 만나 1이다. 그것이 계단이다.

## 정의

### 이산 시간

$$\delta[n] = \begin{cases}0 & n \neq 0\\ 1 & n = 0\end{cases}, \qquad u[n] = \begin{cases}0 & n < 0\\ 1 & n \ge 0\end{cases}$$


단위 임펄스는 단위 샘플이라고도 부른다[^1]. 두 신호는 서로 바꿔 쓸 수 있다[^1][^2].

- 첫 번째 차: $$\delta[n] = u[n] - u[n-1]$$
- 누적 합: $$u[n] = \sum_{m=-\infty}^{n}\delta[m]$$
- 합 변수를 $$k = n - m$$으로 바꾸면 $$u[n] = \sum_{k=0}^{\infty}\delta[n - k]$$. 계단은 $$0, 1, 2, \dots$$칸 늦춘 임펄스들을 겹쳐 쌓은 것이다. 예: $$u[2] = \delta[2-0] + \delta[2-1] + \delta[2-2] + \cdots$$에서 $$\delta[0]$$인 셋째 항만 1이다.

**표본화 성질.** 신호에 $$\delta[n - n_0]$$을 곱하면 $$n = n_0$$의 값만 남는다[^3].

$$x[n]\,\delta[n - n_0] = x[n_0]\,\delta[n - n_0]$$


### 연속 시간

$$u(t) = \begin{cases}0 & t < 0\\ 1 & t > 0\end{cases}$$


$$u(t)$$는 $$t = 0$$에서 끊겨 원래는 미분할 수 없다. 그래서 $$\Delta$$라는 짧은 시간 동안 0에서 1로 곧게 오르는 $$u_\Delta(t)$$로 바꿔 생각한다[^4].

1. $$u_\Delta(t)$$를 미분한 $$\delta_\Delta(t) = \dfrac{du_\Delta(t)}{dt}$$는 폭 $$\Delta$$, 높이 $$\dfrac1\Delta$$인 짧은 펄스다. 넓이는 늘 $$1$$이다.
2. $$\Delta \to 0$$이면 폭은 0으로, 높이는 무한대로 가지만 넓이는 1 그대로다. 이 극한을 단위 임펄스 $$\delta(t) = \lim_{\Delta\to0}\delta_\Delta(t)$$라 한다.
3. 그래서 $$\delta(t) = \dfrac{du(t)}{dt}$$, $$u(t) = \displaystyle\int_{-\infty}^{t}\delta(\tau)\,d\tau$$다[^5].

그림에서는 화살표로 그리고, 화살표 옆의 숫자는 높이가 아니라 넓이다. $$k\delta(t)$$는 넓이 $$k$$인 임펄스이고 $$\int_{-\infty}^{t}k\delta(\tau)d\tau = ku(t)$$다[^4]. 적분 변수를 $$\sigma = t - \tau$$로 바꾸면 $$u(t) = \int_0^\infty\delta(t - \sigma)\,d\sigma$$로, 이산 시간의 "늦춘 임펄스들의 합"과 같은 모양이 된다[^4].

**표본화 성질.** $$\Delta$$가 아주 작으면 그 짧은 구간에서 $$x(t)$$는 거의 상수 $$x(0)$$이다. 그래서 $$x(t)\delta_\Delta(t) \approx x(0)\delta_\Delta(t)$$이고, 극한에서 등호가 된다[^6].

$$x(t)\,\delta(t - t_0) = x(t_0)\,\delta(t - t_0), \qquad \int_{-\infty}^{\infty}x(t)\,\delta(t - \sigma)\,dt = x(\sigma)$$


두 번째 식은 첫 식을 적분하고 임펄스의 넓이가 1임을 쓴 것이다. 이 성질은 $$x$$가 $$t_0$$에서 연속일 때 맞다[^s1].

### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$u[n] = \sum_{k=0}^{\infty}\delta[n - k]$$다.</summary>

$$\delta[n - k]$$는 $$k = n$$일 때만 1이다. $$n \ge 0$$이면 그런 $$k$$가 합의 범위 $$0, 1, 2, \dots$$ 안에 꼭 하나 있어 합이 1, $$n < 0$$이면 없어서 0이다. 이것이 $$u[n]$$의 정의다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. $$\int_{-\infty}^{\infty}x(t)\delta(t - \sigma)dt = x(\sigma)$$다.</summary>

표본화 성질로 $$x(t)\delta(t - \sigma) = x(\sigma)\delta(t - \sigma)$$다. $$x(\sigma)$$는 상수라 적분 밖으로 나오고, 남은 $$\int\delta(t - \sigma)dt$$는 넓이 1이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">연속 시간 임펄스를 정의하는 핵심 아이디어는?</summary>

모양(폭, 높이)은 버리고 넓이 1만 남긴 극한으로 본다. 그러면 끊긴 계단의 "미분"에 뜻을 줄 수 있다.

</details>



## 예제

**예제 1.7** 끊긴 신호 $$x(t) = 2u(t-1) - 3u(t-2) + 2u(t-4)$$의 도함수[^7]

- 값: $$1 < t < 2$$에서 2, $$2 < t < 4$$에서 $$2 - 3 = -1$$, $$t > 4$$에서 $$-1 + 2 = 1$$.
- 미분: 크기 $$k$$인 계단을 미분하면 그 자리에 넓이 $$k$$인 임펄스가 생긴다. 그래서 $$\dot x(t) = 2\delta(t-1) - 3\delta(t-2) + 2\delta(t-4)$$.
- 되돌리기: $$x(t) = \int_0^t\dot x(\tau)d\tau$$이므로, $$t$$까지 지나온 임펄스 넓이를 더하면 원래 값(2, $$-1$$, 1)이 나온다.

경계 사례: $$u(t)$$의 $$t = 0$$에서의 값은 정하지 않는다. 이산 시간 $$u[0] = 1$$과 다르다. 적분이나 에너지 계산에서 한 점의 값은 결과를 바꾸지 않기 때문이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$\delta[n] = u[n] - u[n-1]$$, 두 누적 합 공식, 이산 표본화 성질, 폭 $$\Delta$$ 펄스의 넓이 1과 $$\Delta \to 0$$에서 $$\int x\delta_\Delta = x(\sigma)$$로 다가감, 예제 1.7의 값과 복원을 계산해 확인 — [10_unit-impulse-step_verify.py](/Hongs_Blog/studies/signals-and-systems/code/10_unit-impulse-step_verify/)</div>

</div>


## 활용

- 2장의 핵심: 어떤 신호든 늦춘 임펄스들의 합 $$x[n] = \sum_k x[k]\delta[n - k]$$로 쓸 수 있다. 그래서 시스템이 임펄스 하나에 어떻게 반응하는지(임펄스 응답)만 알면 모든 입력의 출력을 구한다.
- 계단 입력은 "스위치를 켰을 때"의 반응을 보는 표준 시험 신호다. RC 회로의 충전 곡선이 계단 응답이다.
- 영상에서 2차원 임펄스 격자를 곱해 화소를 뽑는다 → [표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/)
- 단위 계단 $$u(t)$$는 에너지가 무한대이고 평균 전력이 $$\frac12$$인 전력 신호다[^5].

## 연결

- 선수: [독립 변수의 변환](/Hongs_Blog/studies/signals-and-systems/independent-variable-transform/) (이동 $$\delta[n - k]$$), [미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/) (미분과 누적의 관계)
- 같은 구조: 이산의 "차분 ↔ 누적 합"이 연속의 "미분 ↔ 적분"이다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$\delta(0) = 1$$이다."</div>

틀렸다. 이산 시간 $$\delta[0] = 1$$과 이름이 같아 그럴듯하다. 연속 시간 $$\delta(t)$$는 높이가 아니라 넓이가 1이다. 폭 $$\Delta$$ 펄스의 높이 $$1/\Delta$$는 $$\Delta \to 0$$에서 무한대로 간다. 확인: 높이가 1이고 폭이 0이면 넓이가 0이 되어 $$\int\delta = 1$$과 모순이다.

</div>


<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$x(t)\delta(t - t_0)$$는 그냥 숫자 $$x(t_0)$$다."</div>

틀렸다. 곱한 결과는 여전히 넓이 $$x(t_0)$$인 임펄스 신호 $$x(t_0)\delta(t - t_0)$$다. 숫자 $$x(t_0)$$이 되려면 적분까지 해야 한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\delta[n]$$과 $$u[n]$$을 서로의 식으로 나타내라 (두 방향 모두).</summary>

**답:** $$\delta[n] = u[n] - u[n-1]$$, $$u[n] = \sum_{m=-\infty}^{n}\delta[m] = \sum_{k=0}^{\infty}\delta[n-k]$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\int_{-\infty}^{\infty}(t^2 + 1)\,\delta(t - 3)\,dt$$를 구하라.</summary>

**답:** 표본화 성질로 $$t = 3$$의 값만 남아 $$3^2 + 1 = 10$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$x(t) = u(t) - u(t-2)$$를 그리고, 도함수를 임펄스로 쓰라.</summary>

**답:** $$0 < t < 2$$에서 1인 직사각형 펄스. 도함수는 $$\delta(t) - \delta(t - 2)$$ (올라갈 때 넓이 $$+1$$, 내려갈 때 $$-1$$).

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 연속 시간 단위 계단은 원래 미분할 수 없는데, 왜 $$\delta(t) = du/dt$$라고 쓸 수 있는가?</summary>

**답:** $$u$$를 $$\Delta$$ 동안 곧게 오르는 $$u_\Delta$$로 근사하면 미분할 수 있고, 그 도함수는 넓이 1인 펄스 $$\delta_\Delta$$다. $$\Delta \to 0$$의 극한을 $$\delta$$로 정의했으므로, 극한의 뜻으로 $$du/dt = \delta$$라고 쓴다.

</details>


[^1]: 3-1학기/신호 및 시스템/1.수업자료/03.Week03_CH01_2_handout.pdf, p.29
[^2]: 같은 자료, p.30~31
[^3]: 같은 자료, p.31
[^4]: 같은 자료, p.33
[^5]: 같은 자료, p.32
[^6]: 같은 자료, p.34
[^7]: 같은 자료, p.38 (예제 1.7)
[^s1]: 에이전트 보충. 표본화 성질에 연속 조건이 필요하다는 점, $$u(0)$$을 정하지 않는 이유, 스스로 설명해 보기, 오해 항목, 확인 문제 C2~C4는 원본에 없다. Oppenheim·Willsky 2판 1.4절의 내용이며 검증 코드로 확인했다.
{% endraw %}
