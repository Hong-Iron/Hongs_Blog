---
layout: "note"
title: "이분법"
display_title: "이분법 (Bisection Method)"
kind: "concept"
kind_label: "알고리즘"
num: "28"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Bisection Method", "구간 반분법", "구간법", "Bracketing Method", "증분 탐색", "Incremental Search", "근 찾기", "Root Finding", "상대 오차", "Relative Approximate Error"]
description: "함수 값의 부호가 다른 두 점 사이에는 연속 함수라면 반드시 근이 있다. 이분법은 가운데 점의 부호를 보고 근이 있는 반쪽만 남기기를 되풀이한다. 구간이 매번 정확히 절반이 되므로 반드시 수렴하고, 몇 번 만에 원하는 정확도가 되는지 미리 안다. 대신 느리고, 함수가 끊어진 곳에서…"
prev_url: "/studies/numerical-analysis/direct-search/"
prev_title: "직접 탐색법"
next_url: "/studies/numerical-analysis/secant-method/"
next_title: "할선법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/bisection-method/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

함수 값의 부호가 다른 두 점 사이에는 연속 함수라면 반드시 근이 있다. 이분법은 가운데 점의 부호를 보고 근이 있는 반쪽만 남기기를 되풀이한다. 구간이 매번 정확히 절반이 되므로 반드시 수렴하고, 몇 번 만에 원하는 정확도가 되는지 미리 안다. 대신 느리고, 함수가 끊어진 곳에서는 근이 아닌 곳으로 갈 수 있으며, 부호가 같은 두 점 사이의 근은 찾지 못한다.

</div>


## 예시로 보기

질량 68.1 kg인 낙하산병이 10초 동안 떨어져 속도 40 m/s가 되려면 항력 계수 $$c$$가 얼마여야 하는가? 식으로 $$c$$를 따로 떼어 낼 수 없어, 다음 $$f(c) = 0$$의 근을 수치로 찾는다($$g = 9.8\ \mathrm{m/s^2}$$)[^1].

$$f(c) = \frac{9.8 \cdot 68.1}{c}\left(1 - e^{-(c/68.1)\cdot10}\right) - 40$$


$$f(12) > 0$$, $$f(16) < 0$$이라 $$[12, 16]$$에 근이 있다.

| 반복 | $$x_l$$ | $$x_u$$ | $$x_r$$ | $$\lvert\epsilon_a\rvert$$ (%) | $$\lvert\epsilon_t\rvert$$ (%) |
|---|---|---|---|---|---|
| 1 | 12 | 16 | 14 | | 5.279 |
| 2 | 14 | 16 | 15 | 6.667 | 1.487 |
| 3 | 14 | 15 | 14.5 | 3.448 | 1.896 |
| 4 | 14.5 | 15 | 14.75 | 1.695 | 0.204 |
| 5 | 14.75 | 15 | 14.875 | 0.840 | 0.641 |
| 6 | 14.75 | 14.875 | 14.8125 | 0.422 | 0.219 |

참값은 14.7802다. 참 오차 $$\epsilon_t$$는 들쭉날쭉하지만 근사 오차 $$\epsilon_a$$는 매번 줄어든다[^1][^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 표의 모든 값, 20번 뒤 폭 $$4/2^{19}$$, 필요한 횟수 공식, 카드 C2, $$1/x$$에서 불연속점으로 감, 부호가 같으면 시작 못 함, 증분 탐색의 간격 — [28_bisection_impl.py](/Hongs_Blog/studies/numerical-analysis/code/28_bisection_impl/)</div>

</div>


## 정의

**바탕.** $$f$$가 $$[x_l, x_u]$$에서 연속이고 $$f(x_l)f(x_u) < 0$$이면 그 사이에 근이 적어도 하나 있다([사잇값 정리](/Hongs_Blog/studies/calculus/continuity/))[^2]. 부호가 바뀌지 않으면 근이 없을 수도, 짝수 개 있을 수도 있다. 부호가 바뀌면 근이 하나보다 많을 수도 있다[^3][^4].

**입력:** $$f(x_l)f(x_u) < 0$$인 두 점, 허용 오차 $$\epsilon_s$$(%). **출력:** 근의 근삿값.

1. 부호가 다른 $$x_l$$, $$x_u$$를 고른다[^5].
2. 가운데 $$x_r = \frac{x_l + x_u}{2}$$를 근의 추정값으로 둔다[^6].
3. $$f(x_l)f(x_r) < 0$$이면 근은 $$[x_l, x_r]$$에 있어 $$x_u \leftarrow x_r$$. $$f(x_l)f(x_r) > 0$$이면 $$x_l \leftarrow x_r$$. $$= 0$$이면 $$x_r$$이 근이라 멈춘다[^7].
4. 상대 근사 오차 $$\vert \epsilon_a\vert  = \left\vert \frac{x_r^{\text{new}} - x_r^{\text{old}}}{x_r^{\text{new}}}\right\vert  \times 100$$을 구한다[^8].
5. $$\vert \epsilon_a\vert  \le \epsilon_s$$이면 멈추고, 아니면 2로 간다. 반복 횟수의 상한도 둔다[^9].

$$n$$번 뒤 구간의 폭은 $$\frac{x_u - x_l}{2^n}$$이다. 그래서 폭을 $$\varepsilon$$ 이하로 하려면 $$n \ge \log_2\frac{x_u - x_l}{\varepsilon}$$번이면 된다. 폭 4를 $$10^{-6}$$으로 줄이려면 22번이다[^s1].

**시작 구간 찾기(증분 탐색).** 작은 간격으로 함수 값을 계산하며 부호가 바뀌는 곳을 찾는다. 간격이 너무 작으면 오래 걸리고, 너무 크면 가까이 붙은 두 근을 한 칸에 넣어 놓친다[^10].

| 장점 | 단점 |
|---|---|
| 늘 수렴한다 | 느리다 |
| 구간이 반드시 매번 절반이 된다 | 시작점 하나가 근에 가까워도 그 이점을 못 살린다[^11] |

부호는 바뀌지만 근이 없는 경우도 있다. $$f(x) = \frac1x$$는 $$x = 0$$에서 끊어져 부호가 바뀐다. 이분법은 근이 아니라 이 끊어진 점으로 간다[^12].

## 활용

- 근이 있는 구간을 확실히 알 때 안전한 방법이다. 뉴턴 방법과 섞어(브렌트 방법) 안전함과 빠르기를 함께 얻는다[^s1].
- 흔한 실수: 연속인지 확인하지 않고 부호만 보는 것($$\frac1x$$). 또 $$f(x_l)f(x_r)$$을 곱할 때 값이 아주 크거나 작으면 넘침이 생기므로 부호만 비교하는 편이 안전하다.

## 연결

- 선수: [연속과 사잇값 정리](/Hongs_Blog/studies/calculus/continuity/), [이분 탐색](/Hongs_Blog/studies/algorithms/binary-search/)
- 같은 구조의 브리지: [매개변수 탐색 ↔ 사잇값 정리](/Hongs_Blog/studies/algorithms/parametric-search-ivt/)
- 더 빠른 방법들과 비교: [근 찾기 방법 비교](/Hongs_Blog/studies/numerical-analysis/root-finding-compared/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 이분법의 한 단계와 멈추는 기준을 쓰라.</summary>

**답:** $$x_r = \frac{x_l + x_u}{2}$$. $$f(x_l)f(x_r) < 0$$이면 $$x_u = x_r$$, $$> 0$$이면 $$x_l = x_r$$, $$= 0$$이면 끝. $$\vert \epsilon_a\vert  = \vert \frac{x_r^{\text{new}} - x_r^{\text{old}}}{x_r^{\text{new}}}\vert  \times 100 \le \epsilon_s$$이면 멈춘다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$f(x) = x^2 - 3$$을 $$[1, 2]$$에서 세 번 반복하라. 각 $$x_r$$은?</summary>

**답:** $$f(1) = -2$$, $$f(2) = 1$$. $$x_r = 1.5$$($$f = -0.75$$, $$[1.5, 2]$$) → $$1.75$$($$f = 0.0625$$, $$[1.5, 1.75]$$) → $$1.625$$. 참값 $$\sqrt3 \approx 1.732$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 양 끝의 부호가 다른데 이분법이 근이 아닌 곳으로 가는 예를 들고 이유를 대라.</summary>

**답:** $$f(x) = \frac1x$$, $$[-1, 1.5]$$. 부호는 바뀌지만 $$x = 0$$에서 끊어져 근이 없다. 사잇값 정리의 "연속" 가정이 깨져, 이분법은 끊어진 점 0으로 다가간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 단계 3의 `if f(xl)·f(xr) < 0 then xu ← xr else xl ← xr`가 하는 일을 한 문장으로 쓰라.</summary>

**답:** 가운데 점과 왼쪽 끝의 부호가 다르면 근이 왼쪽 반에, 같으면 오른쪽 반에 있으므로 근이 있는 반쪽만 남긴다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/16.na16_nonlinear.pdf, p.11
[^2]: 같은 자료, p.2
[^3]: 같은 자료, p.3
[^4]: 같은 자료, p.4
[^5]: 같은 자료, p.5
[^6]: 같은 자료, p.6
[^7]: 같은 자료, p.7
[^8]: 같은 자료, p.8
[^9]: 같은 자료, p.9
[^10]: 같은 자료, p.10
[^11]: 같은 자료, p.12
[^12]: 같은 자료, p.13
[^s1]: 에이전트 보충. 참값 14.7802(이분법 100번으로 계산), 필요한 횟수 공식, 브렌트 방법, 흔한 실수, 카드 C2~C4는 원본에 없다. 구현 코드로 확인했다.
{% endraw %}
