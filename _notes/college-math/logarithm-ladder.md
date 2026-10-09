---
layout: "note"
title: "로그 계산 예제 사다리"
display_title: "로그 계산 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "07"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 로그의 법칙 \\logb(x^r) = r \\logb x, 지수함수의 성장 모형 a \\cdot b^t."
next_url: "/studies/college-math/trig-identities-ladder/"
next_title: "삼각함수 항등식 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/college-math/logarithm-ladder/"
---
{% raw %}
사용 개념: [로그](/Hongs_Blog/studies/college-math/logarithm/)의 법칙 $$\log_b(x^r) = r \log_b x$$, [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)의 성장 모형 $$a \cdot b^t$$.

이 방법을 떠올리는 신호는 **모르는 수가 지수 자리에 있는 식**이다. "몇 번", "몇 달 뒤", "몇 배가 되는 때"를 묻는 문제가 대개 그렇다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *식 세우기:* 모르는 수를 지수에 둔 식을 쓴다.
2. *지수 항만 남기기:* 곱해진 상수를 나눠 $$b^{(\cdots)} = c$$ 꼴로 만든다.
3. *로그로 지수 끌어내리기:* 양변에 로그(보통 $$\ln$$)를 취하고 $$\ln(b^t) = t \ln b$$를 쓴다.
4. *계산하고 확인하기:* 값을 구하고, 가까운 정수 지수로 크기가 맞는지 본다.

## 문제 1 · 완전한 풀이

서비스 사용자가 매달 15%씩 는다. 사용자가 지금의 10배가 되는 것은 몇 달 뒤인가?

1. *식 세우기:* 지금 사용자를 $$P$$라 하면 $$t$$달 뒤 $$P \cdot 1.15^t$$. 조건은 $$P \cdot 1.15^t = 10P$$.
2. *지수 항만 남기기:* 양변을 $$P$$로 나누면 $$1.15^t = 10$$. 처음 사용자 수와 무관하다.
3. *로그로 지수 끌어내리기:* $$t \ln 1.15 = \ln 10$$이므로 $$t = \dfrac{\ln 10}{\ln 1.15}$$.
4. *계산하고 확인하기:* $$t \approx 16.48$$달. $$1.15^{16} \approx 9.36$$, $$1.15^{17} \approx 10.76$$이라 16과 17 사이가 맞다.

## 문제 2 · 마지막 하위목표만 빈칸

$$5 \cdot 3^x = 200$$을 풀라.

1. *식 세우기:* 주어진 그대로 $$5 \cdot 3^x = 200$$.
2. *지수 항만 남기기:* $$3^x = 40$$.
3. *로그로 지수 끌어내리기:* $$x \ln 3 = \ln 40$$.
4. *계산하고 확인하기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$x = \dfrac{\ln 40}{\ln 3} \approx 3.358$$. $$3^3 = 27 < 40 < 81 = 3^4$$이므로 3과 4 사이가 맞다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$2^{x+1} = 3^x$$을 풀라.

1. *식 세우기:* 주어진 그대로.
2. *지수 항만 남기기:* 양변이 이미 지수 항 하나씩이다.
3. *로그로 지수 끌어내리기:* ______
4. *계산하고 확인하기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. 양변에 $$\ln$$을 취하면 $$(x + 1)\ln 2 = x \ln 3$$.
4. $$x$$가 있는 항을 모으면 $$x(\ln 3 - \ln 2) = \ln 2$$이므로 $$x = \dfrac{\ln 2}{\ln 1.5} \approx 1.710$$. 확인하면 $$2^{2.710} \approx 6.54$$, $$3^{1.710} \approx 6.54$$로 같다.

</details>


## 문제 4 · 독립 문제

성공 확률이 0.9인 독립 시도가 $$n$$번 연속 모두 성공할 확률이 $$10^{-6}$$보다 작아지는 가장 작은 $$n$$은 얼마인가? 1000번 연속 모두 성공할 확률은 대략 10의 몇 제곱인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$0.9^n < 10^{-6}$$의 양변에 $$\ln$$을 취하면 $$n \ln 0.9 < -6 \ln 10$$이다. $$\ln 0.9 < 0$$이므로 나누면 부등호가 뒤집혀 $$n > \dfrac{6 \ln 10}{-\ln 0.9} \approx 131.13$$. 가장 작은 정수는 $$n = 132$$다.

1000번 연속은 $$0.9^{1000} = 10^{1000 \log_{10} 0.9} \approx 10^{-45.76}$$이다. 그대로 곱하면 매우 작은 수지만, 로그로 보면 지수만 계산하면 된다.

**흔한 오답:** 음수 $$\ln 0.9$$로 나눌 때 부등호를 뒤집지 않아 "$$n < 131.13$$"이라고 하는 것.

</details>


## 변형 문제

문제 1에서 사용자가 두 배가 되는 데는 몇 달이 걸리는가? 성장률 $$r$$이 작을 때 두 배 시간을 빠르게 어림하는 방법도 생각해 보라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$1.15^t = 2$$에서 $$t = \dfrac{\ln 2}{\ln 1.15} \approx 4.96$$달. 성장률이 작으면 $$\ln(1 + r) \approx r$$이므로 $$t \approx \dfrac{0.693}{r}$$이다. 실무에서는 나누기 쉬운 72를 써서 "72 ÷ (퍼센트)"로 어림한다(72의 법칙). $$72 / 15 = 4.8$$달로 실제 값과 가깝다[^s1].

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 답과 확인 값 — [07_logarithm_verify.py](/Hongs_Blog/studies/college-math/code/07_logarithm_verify/)</div>

</div>


[^1]: OpenStax, *Precalculus 2e*, 4.6절 "Exponential and Logarithmic Equations"
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> $$\ln(1 + r) \approx r$$은 미분적분학의 [선형 근사](/Hongs_Blog/studies/calculus/linear-approx-newton/)에서 나온다. 72의 법칙은 금융에서 쓰는 어림 규칙이며, 성장률이 클수록 오차가 커진다.
{% endraw %}
