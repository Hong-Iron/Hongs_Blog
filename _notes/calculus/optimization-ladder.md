---
layout: "note"
title: "최적화 문제 예제 사다리"
display_title: "최적화 문제 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "07"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 도함수의 활용과 최적화의 임계점과 판정법."
prev_url: "/studies/calculus/differentiation-ladder/"
prev_title: "미분 계산 예제 사다리"
next_url: "/studies/calculus/integration-ladder/"
next_title: "적분 계산 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/calculus/optimization-ladder/"
---
{% raw %}
사용 개념: [도함수의 활용과 최적화](/Hongs_Blog/studies/calculus/curve-analysis/)의 임계점과 판정법.

이 방법을 떠올리는 신호는 **"가장 크게", "가장 작게", "최적의"**와 함께 서로 상충하는 두 요소가 나오는 문제다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *변수와 목적함수 정하기:* 무엇을 최대·최소로 할지 정하고 식으로 쓴다.
2. *변수 하나로 줄이기:* 제약 조건으로 다른 변수를 없애고, 변수가 움직일 수 있는 범위를 적는다.
3. *임계점 찾기:* 도함수를 0으로 놓고 푼다.
4. *판정하고 해석하기:* 끝점과 비교하거나 이계도함수로 최대·최소를 확인하고, 단위와 함께 답한다.

## 문제 1 · 완전한 풀이

울타리 100 m로 직사각형 텃밭을 두를 때 넓이의 최댓값은?

1. *변수와 목적함수:* 가로 $$w$$, 세로 $$\ell$$, 넓이 $$A = w\ell$$.
2. *하나로 줄이기:* $$2w + 2\ell = 100$$이므로 $$\ell = 50 - w$$, $$A(w) = w(50 - w)$$, $$0 < w < 50$$.
3. *임계점:* $$A'(w) = 50 - 2w = 0$$에서 $$w = 25$$.
4. *판정과 해석:* $$A''(w) = -2 < 0$$이라 최대. 정사각형 25 m × 25 m, 넓이 625 m².

## 문제 2 · 마지막 하위목표만 빈칸

$$n > 0$$에서 $$f(n) = \dfrac{100}{n} + n$$의 최솟값은?

1. *변수와 목적함수:* 주어진 $$f(n)$$.
2. *하나로 줄이기:* 이미 한 변수, $$n > 0$$.
3. *임계점:* $$f'(n) = -\frac{100}{n^2} + 1 = 0$$에서 $$n = 10$$.
4. *판정과 해석:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$f''(n) = \frac{200}{n^3} > 0$$이라 극소이고 임계점이 하나뿐이라 최소. 최솟값 $$f(10) = 20$$. 일반적으로 $$\frac{a}{n} + bn$$은 $$n = \sqrt{a/b}$$에서 최솟값 $$2\sqrt{ab}$$다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

긴 작업을 $$T$$분마다 저장한다. 저장 한 번에 5분이 들고 평균 1,440분마다 고장이 난다. 낭비율 $$W(T) = \frac{5}{T} + \frac{T}{2880}$$을 최소로 하는 $$T$$는?

1. *변수와 목적함수:* 주어진 $$W(T)$$.
2. *하나로 줄이기:* ______
3. *임계점:* ______
4. *판정과 해석:* $$W''(T) = \frac{10}{T^3} > 0$$이라 최소. 약 2시간마다 저장한다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 이미 한 변수이고 범위는 $$T > 0$$.
3. $$W'(T) = -\frac{5}{T^2} + \frac{1}{2880} = 0$$에서 $$T^2 = 14400$$, $$T = 120$$분($$T > 0$$이라 음의 근은 버린다).

</details>


## 문제 4 · 독립 문제

부피가 1,000 cm³인 뚜껑 있는 원통 캔의 겉넓이를 최소로 하는 반지름과 높이는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

겉넓이 $$S = 2\pi r^2 + 2\pi r h$$, 부피 조건 $$\pi r^2 h = 1000$$에서 $$h = \frac{1000}{\pi r^2}$$, $$S(r) = 2\pi r^2 + \frac{2000}{r}$$, $$r > 0$$. $$S'(r) = 4\pi r - \frac{2000}{r^2} = 0$$에서 $$r = \left(\frac{500}{\pi}\right)^{1/3} \approx 5.42$$ cm. $$S'' > 0$$이라 최소. 그때 $$h = \frac{1000}{\pi r^2} = 2r \approx 10.84$$ cm로, 높이가 지름과 같다.

**흔한 오답:** 부피 조건으로 변수를 줄이지 않고 $$S$$를 $$r$$과 $$h$$ 두 변수 그대로 미분하는 것.

</details>


## 변형 문제

위 원통에서 뚜껑이 없으면 최적의 높이와 반지름의 관계는 어떻게 바뀌는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$S = \pi r^2 + \frac{2000}{r}$$, $$S' = 2\pi r - \frac{2000}{r^2} = 0$$에서 $$r^3 = \frac{1000}{\pi}$$. 그때 $$h = \frac{1000}{\pi r^2} = r$$로, 높이가 반지름과 같아진다. 뚜껑 재료가 빠져 더 넓적한 캔이 유리하다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 문제 1~4의 최적값을 격자 탐색으로 확인 — [07_curve-analysis_verify.py](/Hongs_Blog/studies/calculus/code/07_curve-analysis_verify/)</div>

</div>


[^1]: OpenStax, *Calculus Volume 1*, 4.7절 "Applied Optimization Problems"(최적화 문제 풀이 전략)
{% endraw %}
