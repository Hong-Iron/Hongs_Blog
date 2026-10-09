---
layout: "note"
title: "단위 계단 응답"
display_title: "단위 계단 응답 (Unit Step Response)"
kind: "concept"
kind_label: "정의"
num: "22"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Unit Step Response", "계단 응답", "Step Response", "s[n]", "s(t)"]
description: "스위치를 켜는 입력(단위 계단)을 넣었을 때의 출력이 계단 응답이다. 실험실에서는 바늘 같은 임펄스를 만들기 어렵지만 스위치를 켜는 것은 쉬워서, 계단 응답을 재고 거기서 임펄스 응답을 얻는다. 계단이 임펄스를 쌓은 것이므로 계단 응답도 임펄스 응답을 쌓은 것이고, 반대로 계단 응…"
prev_url: "/studies/signals-and-systems/lti-system-properties/"
prev_title: "임펄스 응답으로 본 LTI 시스템의 성질"
next_url: "/studies/signals-and-systems/lccde-system/"
next_title: "미분방정식으로 표현한 LTI 시스템"
math: true
mermaid: false
code_count: 2
permalink: "/studies/signals-and-systems/step-response/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

스위치를 켜는 입력(단위 계단)을 넣었을 때의 출력이 계단 응답이다. 실험실에서는 바늘 같은 임펄스를 만들기 어렵지만 스위치를 켜는 것은 쉬워서, 계단 응답을 재고 거기서 임펄스 응답을 얻는다. 계단이 임펄스를 쌓은 것이므로 계단 응답도 임펄스 응답을 쌓은 것이고, 반대로 계단 응답의 차이(미분)가 임펄스 응답이다. LTI 시스템일 때만 이 관계가 통한다.

</div>


## 예시로 보기

누산기($$h[n] = u[n]$$)에 계단을 넣으면 $$s[n] = \sum_{k=-\infty}^{n}u[k] = (n + 1)u[n]$$, 곧 $$1, 2, 3, \dots$$이다. 이웃한 값의 차이를 구하면 $$1, 1, 1, \dots$$로 처음의 $$h[n] = u[n]$$이 다시 나온다[^s1].

## 정의

계단 응답은 $$s[n] = u[n] * h[n]$$, $$s(t) = u(t) * h(t)$$다[^1].

| | 계단 응답 ← 임펄스 응답 | 임펄스 응답 ← 계단 응답 |
|---|---|---|
| 이산 시간 | $$s[n] = \sum_{k=-\infty}^{n}h[k]$$ | $$h[n] = s[n] - s[n-1]$$ |
| 연속 시간 | $$s(t) = \int_{-\infty}^{t}h(\tau)d\tau$$ | $$h(t) = \dfrac{ds(t)}{dt}$$ |

$$s[n] = h * u = \sum_k h[k]u[n-k]$$에서 $$u[n-k]$$는 $$k \le n$$일 때만 1이므로 첫 식이 나온다. 이것은 예제 2.12 누산기의 출력 식과 같다[^1]. 둘째 식은 $$s[n]$$에서 $$s[n-1]$$을 빼면 마지막 항 $$h[n]$$만 남는다는 뜻이다.

$$\begin{aligned} s[n] &= \cdots + h[n-1] + h[n] \\ -\;s[n-1] &= \cdots + h[n-1] \\ \hline h[n] &= s[n] - s[n-1] \end{aligned}$$


## 예제

$$h(t) = e^{-2t}u(t)$$이면 $$s(t) = \int_0^t e^{-2\tau}d\tau = \frac12(1 - e^{-2t})u(t)$$다. 이것을 미분하면 $$e^{-2t}$$로 $$h(t)$$가 다시 나온다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/signals-and-systems/22_step-response_fig1.svg" alt="그림" width="640" height="266" loading="lazy">

왼쪽의 색칠한 넓이($$0 \sim 0.5$$)가 오른쪽 점의 높이 $$s(0.5)$$이고, 그 점에서 $$s$$의 기울기가 $$h(0.5)$$다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 무작위 $$h[n]$$에서 $$u * h = \sum_{k\le n}h[k]$$와 $$s[n] - s[n-1] = h[n]$$, 연속 시간 예의 적분과 미분 확인 — [22_step-response_verify.py](/Hongs_Blog/studies/signals-and-systems/code/22_step-response_verify/)</div>

</div>


## 활용

- 제어 공학에서 시스템의 빠르기를 "계단 응답이 최종값의 63%(1계) 또는 90%에 닿는 시간"으로 잰다[^s1].
- 미분방정식 시스템의 임펄스 응답을 구할 때 계단 응답을 먼저 구해 미분하면 편할 때가 있다 → [미분방정식으로 표현한 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/lccde-system/)

## 연결

- 선수: [임펄스 응답으로 본 LTI 시스템의 성질](/Hongs_Blog/studies/signals-and-systems/lti-system-properties/)
- 같은 관계: [단위 임펄스와 단위 계단](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/)의 $$u = \sum\delta$$, $$\delta = u[n] - u[n-1]$$이 시스템을 통과해도 그대로 남는다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 계단 응답이 $$s[n] = (1 - 0.5^{n+1})u[n]$$이다. $$h[2]$$는?</summary>

**답:** $$s[2] - s[1] = (1 - 0.125) - (1 - 0.25) = 0.125$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$h[n] = s[n] - s[n-1]$$이 맞는 이유를 LTI 성질로 설명하라.</summary>

**답:** $$\delta[n] = u[n] - u[n-1]$$이다. 시스템이 시불변이라 $$u[n-1]$$의 출력은 $$s[n-1]$$이고, 선형이라 차이의 출력은 출력의 차이다. 그래서 $$\delta[n]$$의 출력 $$h[n]$$은 $$s[n] - s[n-1]$$이다.

</details>


[^1]: 신호 및 시스템 6회 강의 자료 「Week06_CH02_2_handout」, p.19~20
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 누산기 예, 연속 시간 예, 제어 공학 활용, 확인 문제는 원본에 없다. 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 1장은 원본에 없다. [22_step-response_plot.py](/Hongs_Blog/studies/signals-and-systems/code/22_step-response_plot/)로 그렸고, 같은 코드로 다음을 확인했다: $$\int_0^{0.5}h = s(0.5) = \frac12(1 - e^{-1})$$, $$s'(0.5) = h(0.5) = e^{-1}$$.
{% endraw %}
