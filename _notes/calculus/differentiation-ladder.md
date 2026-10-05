---
layout: "note"
title: "미분 계산 예제 사다리"
display_title: "미분 계산 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "06"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 미분 법칙의 기본 도함수와 곱·몫 법칙, 연쇄 법칙."
next_url: "/studies/calculus/optimization-ladder/"
next_title: "최적화 문제 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/calculus/differentiation-ladder/"
---
{% raw %}
사용 개념: [미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/)의 기본 도함수와 곱·몫 법칙, [연쇄 법칙](/Hongs_Blog/studies/calculus/chain-rule/).

미분 계산의 핵심은 **식의 가장 바깥 연산이 무엇인지 알아보는 것**이다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *구조 읽기:* 가장 바깥 연산이 합, 곱, 몫, 합성 중 무엇인지 정한다.
2. *바깥 규칙 적용:* 그 연산의 규칙을 쓴다. 합성이면 바깥 도함수를 안쪽 값에서 계산한다.
3. *안쪽으로 들어가기:* 규칙이 요구하는 안쪽 도함수를 같은 방법으로 구해 곱한다.
4. *정리와 검산:* 식을 정리하고, 한 점에서 수치 미분과 비교한다.

## 문제 1 · 완전한 풀이

\$$\dfrac{d}{dx}(x^2 + 1)^5$$

1. *구조 읽기:* 가장 바깥은 5제곱, 그 안에 $$x^2 + 1$$. 합성이다.
2. *바깥 규칙:* $$u^5$$의 도함수 $$5u^4$$을 $$u = x^2 + 1$$에서: $$5(x^2 + 1)^4$$.
3. *안쪽:* $$(x^2 + 1)' = 2x$$를 곱한다.
4. *정리와 검산:* $$10x(x^2 + 1)^4$$. $$x = 1$$이면 $$10 \cdot 16 = 160$$이고, 수치 미분 $$\frac{(1.001^2+1)^5 - (0.999^2+1)^5}{0.002} \approx 160.0$$과 맞다.

## 문제 2 · 마지막 하위목표만 빈칸

\$$\dfrac{d}{dx}\,x e^{2x}$$

1. *구조 읽기:* 가장 바깥은 곱 $$x \cdot e^{2x}$$.
2. *바깥 규칙:* $$(x)' e^{2x} + x\,(e^{2x})'$$.
3. *안쪽:* $$(e^{2x})' = e^{2x} \cdot 2$$(합성).
4. *정리와 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$e^{2x} + 2x e^{2x} = (1 + 2x)e^{2x}$$. $$x = 0$$이면 1이고, $$x e^{2x}$$는 원점 근처에서 $$x$$와 거의 같아 기울기 1이 맞다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

\$$\dfrac{d}{dx}\sin^3(2x)$$

1. *구조 읽기:* ______
2. *바깥 규칙:* $$3u^2$$을 $$u = \sin(2x)$$에서: $$3\sin^2(2x)$$.
3. *안쪽:* ______
4. *정리와 검산:* $$6\sin^2(2x)\cos(2x)$$.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 세 겹의 합성이다: 세제곱 ∘ 사인 ∘ 2배. 가장 바깥은 세제곱.
3. $$(\sin 2x)' = \cos(2x) \cdot 2$$. 합성이 한 겹 더 있어 2를 곱한다.

</details>


## 문제 4 · 독립 문제

$$\dfrac{d}{dx}\,x^x$$ ($$x > 0$$)

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

밑과 지수에 모두 $$x$$가 있어 거듭제곱 법칙도 지수 법칙도 바로 쓸 수 없다. $$x^x = e^{x\ln x}$$로 바꾸면 합성이다. $$(x^x)' = e^{x\ln x}\cdot(x\ln x)' = x^x(\ln x + 1)$$.

**흔한 오답:** 거듭제곱 법칙으로 $$x \cdot x^{x-1} = x^x$$라고 하거나, 지수 법칙으로 $$x^x \ln x$$라고 하는 것. 둘 다 한쪽을 상수로 착각했다.

</details>


## 변형 문제

시그모이드 $$\sigma(x) = \dfrac{1}{1 + e^{-x}}$$의 도함수를 $$\sigma$$만으로 나타내라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\sigma = (1 + e^{-x})^{-1}$$을 합성으로 보면 $$\sigma' = -(1 + e^{-x})^{-2}\cdot(-e^{-x}) = \frac{e^{-x}}{(1 + e^{-x})^2} = \sigma\cdot\frac{e^{-x}}{1 + e^{-x}} = \sigma(1 - \sigma)$$.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 답을 무작위 점에서 수치 미분과 비교 — [06_chain-rule_verify.py](/Hongs_Blog/studies/calculus/code/06_chain-rule_verify/)</div>

</div>


[^1]: OpenStax, *Calculus Volume 1*, 3.6절 "The Chain Rule"(합성의 구조를 바깥부터 읽는 전략)
{% endraw %}
