---
layout: "note"
title: "유클리드 호제법 예제 사다리"
display_title: "유클리드 호제법 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "27"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 최대공약수와 유클리드 호제법의 확장 호제법과 베주 항등식."
prev_url: "/studies/discrete-math/master-theorem-ladder/"
prev_title: "마스터 정리 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/discrete-math/gcd-ladder/"
---
{% raw %}
사용 개념: [최대공약수와 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/)의 확장 호제법과 베주 항등식.

이 방법을 떠올리는 신호는 **"두 수의 정수 배를 더해 어떤 값을 만들라"**는 요구다. 일차 부정방정식 $$ax + by = c$$, 모듈러 역원, 물통 문제가 모두 이 모양이다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *나눗셈 줄 세우기:* $$r_{i+1} = r_{i-1} - q_i r_i$$로 나머지가 0이 될 때까지 표를 채운다.
2. *최대공약수 읽기:* 0 바로 앞의 나머지가 $$g$$다. $$c$$가 있으면 $$g \mid c$$인지 본다.
3. *계수 구하기:* $$s, t$$ 열을 같은 몫으로 갱신하거나, 줄을 거꾸로 대입해 $$g = as + bt$$를 만든다.
4. *답 정리와 검산:* 필요하면 $$c/g$$를 곱하고, $$as + bt$$를 직접 계산해 확인한다.

## 문제 1 · 완전한 풀이

$$252s + 105t = \gcd(252, 105)$$인 $$s, t$$를 구하라.

1. *줄 세우기:* $$252 = 2 \cdot 105 + 42$$, $$105 = 2 \cdot 42 + 21$$, $$42 = 2 \cdot 21 + 0$$.
2. *gcd:* 21.
3. *계수:* 거꾸로 대입한다. $$21 = 105 - 2 \cdot 42 = 105 - 2(252 - 2 \cdot 105) = 5 \cdot 105 - 2 \cdot 252$$.
4. *검산:* $$s = -2$$, $$t = 5$$. $$-504 + 525 = 21$$.

## 문제 2 · 마지막 하위목표만 빈칸

$$1071s + 462t = \gcd(1071, 462)$$.

1. *줄 세우기:* $$1071 = 2 \cdot 462 + 147$$, $$462 = 3 \cdot 147 + 21$$, $$147 = 7 \cdot 21 + 0$$.
2. *gcd:* 21.
3. *계수:* $$21 = 462 - 3 \cdot 147 = 462 - 3(1071 - 2 \cdot 462) = 7 \cdot 462 - 3 \cdot 1071$$.
4. *답 정리와 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$s = -3$$, $$t = 7$$. $$1071 \times (-3) + 462 \times 7 = -3213 + 3234 = 21$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$12x + 18y = 30$$의 정수해를 하나 구하고, 모든 해를 쓰라.

1. *줄 세우기:* $$18 = 1 \cdot 12 + 6$$, $$12 = 2 \cdot 6 + 0$$(큰 수를 앞에 두었다).
2. *gcd:* 6이고 $$6 \mid 30$$이라 해가 있다.
3. *계수:* ______
4. *답 정리와 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. $$6 = 18 - 12$$, 즉 $$12 \cdot (-1) + 18 \cdot 1 = 6$$.
4. $$30 = 5 \times 6$$이라 $$x = -5$$, $$y = 5$$. 검산 $$-60 + 90 = 30$$. 모든 해는 $$x = -5 + 3k$$, $$y = 5 - 2k$$($$k \in \mathbb{Z}$$). 더하고 빼는 3과 2는 $$\frac{18}{6}$$, $$\frac{12}{6}$$이다.

</details>


## 문제 4 · 독립 문제

$$91x + 35y = 14$$의 정수해를 하나 구하라. $$91x + 35y = 10$$에는 왜 정수해가 없는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$91 = 2 \cdot 35 + 21$$, $$35 = 1 \cdot 21 + 14$$, $$21 = 1 \cdot 14 + 7$$, $$14 = 2 \cdot 7$$. $$\gcd = 7$$. 거꾸로 대입하면 $$7 = 21 - 14 = 21 - (35 - 21) = 2 \cdot 21 - 35 = 2(91 - 2 \cdot 35) - 35 = 2 \cdot 91 - 5 \cdot 35$$. $$14 = 2 \times 7$$이라 $$x = 4$$, $$y = -10$$.

$$91x + 35y$$는 어떤 정수 $$x, y$$에서도 7의 배수다. 10은 7의 배수가 아니라 만들 수 없다.

</details>


## 변형 문제

$$\gcd(89, 55)$$를 구하는 데 나눗셈이 몇 번 필요한가? 비슷한 크기의 다른 수보다 많은 이유는?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

9번이다. $$89 = 1 \cdot 55 + 34$$, $$55 = 1 \cdot 34 + 21$$, … 처럼 몫이 매번 1이라 나머지가 가장 느리게 줄어든다. 이웃한 피보나치 수에서는 나머지가 바로 앞의 피보나치 수가 되기 때문이다. 이것이 유클리드 호제법의 최악의 경우다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 줄과 계수, 해의 존재 조건과 모든 해의 꼴, 피보나치 쌍의 나눗셈 횟수 — [27_gcd-euclid_verify.py](/Hongs_Blog/studies/discrete-math/code/27_gcd-euclid_verify/)</div>

</div>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 9장 "Number Theory"(확장 호제법, 일차 결합, 물통 문제).
{% endraw %}
