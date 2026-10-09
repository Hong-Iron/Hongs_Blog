---
layout: "note"
title: "근 찾기 방법 비교"
display_title: "근 찾기 방법 비교 (Root-Finding Methods Compared)"
kind: "concept"
kind_label: "비교"
num: "32"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Root-Finding Methods Compared", "구간법과 열린 방법", "Bracketing vs Open Methods"]
description: "근을 찾는 네 방법은 \"안전함\"과 \"빠르기\"를 맞바꾼다. 이분법은 근을 사이에 둔 구간을 반씩 줄여 늘 성공하지만 느리다. 뉴턴 방법과 할선법은 직선으로 근을 짐작해 빠르지만 실패할 수 있고, 고정점 반복은 가장 단순하지만 식을 잘 바꿔야 수렴한다. 상황에 따라 무엇을 아는지(근이…"
prev_url: "/studies/numerical-analysis/multivariate-newton/"
prev_title: "다변수 뉴턴 방법"
next_url: "/studies/numerical-analysis/taylor-method/"
next_title: "테일러 급수 방법"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/root-finding-compared/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

근을 찾는 네 방법은 "안전함"과 "빠르기"를 맞바꾼다. 이분법은 근을 사이에 둔 구간을 반씩 줄여 늘 성공하지만 느리다. 뉴턴 방법과 할선법은 직선으로 근을 짐작해 빠르지만 실패할 수 있고, 고정점 반복은 가장 단순하지만 식을 잘 바꿔야 수렴한다. 상황에 따라 무엇을 아는지(근이 있는 구간, 도함수)가 선택을 가른다.

</div>


## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. $$f(a) < 0 < f(b)$$인 구간을 알고, 반드시 근을 찾아야 하는 프로그램(실패하면 안 됨)이다.</summary>

**이분법.** 연속이고 부호가 다르면 늘 수렴하고 필요한 횟수도 미리 안다. 뉴턴과 할선법은 구간을 벗어나 발산할 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. $$f$$가 다항식이라 도함수가 쉽고, 근 근처의 좋은 시작값이 있다. 가장 빨리 높은 정확도가 필요하다.</summary>

**뉴턴 방법.** 근 근처에서 오차가 매번 제곱으로 준다(검증 코드에서 오차 $$10^{-10}$$까지 4번). 이분법은 33번 걸린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">3. $$f$$는 시뮬레이션 결과라 값만 알고 도함수를 모른다. 빠르게 수렴하길 원한다.</summary>

**할선법.** 도함수 대신 두 점의 기울기를 써서 뉴턴에 가깝게 빠르다(5번). 뉴턴 방법은 도함수가 필요하다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">4. $$x^3 - 2x + 2 = 0$$을 $$x_0 = 0$$에서 뉴턴 방법으로 풀었더니 0, 1, 0, 1을 맴돈다.</summary>

**이분법(구간 $$[-3, 0]$$)으로 바꾸거나 시작값을 바꾼다.** 뉴턴의 접선이 두 점 사이를 오가며 근에 가지 못한다. 이분법은 부호가 바뀌는 구간만 있으면 근 $$x \approx -1.769$$를 찾는다.

</details>


## 결정적 차이

$$f(x) = e^{-x} - x$$, 오차 $$10^{-10}$$까지의 반복 횟수는 검증 코드로 셌다[^s1].

| | 이분법 | 뉴턴 | 할선 | 고정점 |
|---|---|---|---|---|
| 필요한 것 | 부호가 다른 두 점 | 시작점 하나, $$f'$$ | 시작점 둘 | $$x = g(x)$$ 꼴, 시작점 하나 |
| 수렴 보장 | 있음(연속일 때) | 없음 | 없음 | $$\lvert g'\rvert < 1$$일 때 |
| 수렴 빠르기 | 매번 절반 | 이차 | 약 1.618차 | 선형 |
| 반복 횟수 | 33 | 4 | 5 | 40 |
| 실패하는 경우 | 불연속(1/x)[^1] | $$f' = 0$$, 맴돌기, 발산[^2] | 두 점 값이 같음[^3] | $$\lvert g'\rvert > 1$$ |

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/32_root-finding-compared_fig1.svg" alt="그림" width="539" height="335" loading="lazy">

세로축은 한 칸이 10배인 눈금이다. 이분법(파랑)은 들쭉날쭉하면서 일정한 빠르기로, 고정점(보라)은 곧은 선으로 천천히 내려간다. 뉴턴(주황)과 할선(초록)은 아래로 꺾이며 몇 번 만에 목표 오차 아래로 떨어진다[^s2].

가르는 질문은 두 가지다. 근을 사이에 둔 구간을 아는가(구간법 대 열린 방법), 도함수를 쉽게 계산할 수 있는가(뉴턴 대 할선).

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 같은 문제에서 네 방법의 반복 횟수, 뉴턴의 0 나누기와 맴돌기, 맴도는 문제를 이분법이 풂 — [32_root-finding-compared_verify.py](/Hongs_Blog/studies/numerical-analysis/code/32_root-finding-compared_verify/)</div>

</div>


## 둘 다 아닐 때

- **안전함과 빠르기를 모두:** 이분법으로 구간을 지키면서 뉴턴이나 할선 걸음을 시도하고, 걸음이 구간을 벗어나면 이분법 걸음을 쓰는 혼합 방법(브렌트 방법)이 표준 라이브러리의 기본이다(SciPy `brentq`)[^s1].
- **다항식의 모든 근:** 동반 행렬의 고윳값으로 한꺼번에 구한다(NumPy `roots`)[^s1].
- **연립 비선형 방정식:** [다변수 뉴턴 방법](/Hongs_Blog/studies/numerical-analysis/multivariate-newton/)이나 연립 [고정점 반복](/Hongs_Blog/studies/numerical-analysis/fixed-point-iteration/).

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 도함수를 모르고, 근이 있는 구간 $$[a, b]$$를 알며, 실패하면 안 된다. 무엇을 쓰고, 할선법은 왜 덜 맞는가?</summary>

**답:** 이분법(또는 브렌트 같은 혼합 방법). 할선법은 빠르지만 수렴이 보장되지 않아 구간 밖으로 나갈 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 이분법이 뉴턴 방법보다 느린 이유를 각 방법이 쓰는 정보로 설명하라.</summary>

**답:** 이분법은 함수 값의 부호만 쓴다. 근에 얼마나 가까운지는 무시하고 늘 절반만 줄인다. 뉴턴은 값의 크기와 기울기까지 써서 근의 위치를 직접 짐작하므로, 근 근처에서 오차가 제곱으로 준다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 네 방법의 수렴 빠르기를 순서대로 쓰라.</summary>

**답:** 뉴턴(이차) > 할선(약 1.618차) > 이분법(매번 절반, 선형) ≈ 고정점(선형, 비율 $$\vert g'(r)\vert $$). 같은 문제에서 4, 5, 33, 40번.

</details>


[^1]: 수치해석 16회 강의 자료 「na16_nonlinear」, p.12~13
[^2]: 같은 자료, p.18
[^3]: 같은 자료, p.21
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 네 상황 문제, 반복 횟수 비교와 맴도는 예, 수렴 차수 정리, 브렌트 방법과 라이브러리, 카드는 원본에 없다. 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림은 원본에 없다. [32_root-finding-compared_plot.py](/Hongs_Blog/studies/numerical-analysis/code/32_root-finding-compared_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: 검증 코드와 같은 시작값에서 반복 횟수 33, 4, 5, 40.
{% endraw %}
