---
layout: "note"
title: "적분 계산 예제 사다리"
display_title: "적분 계산 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "14"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
updated: "2026-09-25"
status: "verified"
description: "사용 개념: 치환적분, 부분적분, 미적분의 기본정리."
prev_url: "/studies/calculus/optimization-ladder/"
prev_title: "최적화 문제 예제 사다리"
next_url: "/studies/calculus/gradient-descent-ladder/"
next_title: "경사 하강법 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/calculus/integration-ladder/"
---
{% raw %}
사용 개념: [치환적분](/Hongs_Blog/studies/calculus/substitution/), [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/), [미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/).

적분 계산의 핵심은 **치환과 부분적분 중 무엇을 쓸지 신호로 가르는 것**이다. 안쪽 함수의 도함수가 곱해져 있으면 치환, 성질이 다른 두 함수의 곱이면 부분적분이다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *신호 읽기:* 안쪽 함수와 그 도함수가 함께 있는가, 아니면 미분하면 단순해지는 인수가 있는가.
2. *방법과 역할 정하기:* 치환이면 $$u$$와 $$du$$, 부분적분이면 $$u$$와 $$dv$$를 정한다. 정적분의 치환이면 끝값도 바꾼다.
3. *변환한 적분 계산:* 기본 공식으로 끝낸다. 필요하면 한 번 더 같은 방법을 쓴다.
4. *정리와 검산:* 결과를 미분해 피적분함수가 나오는지 본다. 정적분이면 끝값을 넣는다.

## 문제 1 · 완전한 풀이

\$$\int x\cos x\,dx$$

1. *신호:* $$x$$의 도함수 1은 곱해져 있지 않다(치환 아님). $$x$$는 미분하면 1로 단순해진다.
2. *역할:* 부분적분. $$u = x$$, $$dv = \cos x\,dx$$, $$du = dx$$, $$v = \sin x$$.
3. *계산:* $$x\sin x - \int\sin x\,dx = x\sin x + \cos x + C$$.
4. *검산:* $$(x\sin x + \cos x)' = \sin x + x\cos x - \sin x = x\cos x$$.

## 문제 2 · 마지막 하위목표만 빈칸

\$$\int_0^1 x e^{x^2}\,dx$$

1. *신호:* 안쪽 $$x^2$$의 도함수 $$2x$$의 절반이 곱해져 있다.
2. *역할:* 치환. $$u = x^2$$, $$x\,dx = \frac12 du$$, 끝값 $$0 \to 0$$, $$1 \to 1$$.
3. *계산:* $$\frac12\int_0^1 e^u du = \frac12\big[e^u\big]_0^1$$.
4. *정리와 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\frac12(e - 1) \approx 0.859$$. 원시함수 $$\frac12 e^{x^2}$$을 미분하면 $$x e^{x^2}$$이고, 원래 끝값 0과 1을 넣어도 같은 값이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

\$$\int x^2 e^x\,dx$$

1. *신호:* 다항식 × 지수. $$x^2$$은 두 번 미분하면 상수가 된다.
2. *역할:* 부분적분. $$u = x^2$$, $$dv = e^x dx$$.
3. *계산:* ______
4. *정리와 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. $$x^2e^x - \int 2xe^x dx$$. 남은 적분에 다시 $$u = 2x$$로 부분적분하면 $$\int 2xe^xdx = 2xe^x - 2e^x$$. 그래서 $$x^2e^x - 2xe^x + 2e^x + C$$.
4. $$(x^2 - 2x + 2)e^x + C$$. 미분하면 $$(2x - 2)e^x + (x^2 - 2x + 2)e^x = x^2e^x$$.

</details>


## 문제 4 · 독립 문제

$$\int_1^e x\ln x\,dx$$를 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\ln x$$가 미분하면 단순해지므로 $$u = \ln x$$, $$dv = x\,dx$$, $$v = \frac{x^2}{2}$$. $$\frac{x^2}{2}\ln x - \int\frac{x^2}{2}\cdot\frac1x dx = \frac{x^2}{2}\ln x - \frac{x^2}{4}$$. 끝값을 넣으면 $$\left(\frac{e^2}{2} - \frac{e^2}{4}\right) - \left(0 - \frac14\right) = \frac{e^2 + 1}{4} \approx 2.097$$.

**흔한 오답:** $$u = x$$로 두는 것. 그러면 $$dv = \ln x\,dx$$를 적분해야 해서 더 어려워진다.

</details>


## 변형 문제

$$\int_0^\pi e^x\sin x\,dx$$처럼 부분적분을 두 번 해도 원래 적분이 되돌아오면 어떻게 끝내는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

되돌아온 적분을 $$I$$로 두고 방정식을 푼다. $$I = \big[e^x\sin x\big]_0^\pi - \big[e^x\cos x\big]_0^\pi - I$$에서 $$2I = 0 - (-e^\pi - 1)$$, 즉 $$I = \frac{e^\pi + 1}{2} \approx 12.07$$. 자세한 과정은 [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/)의 예제에 있다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 원시함수를 수치 미분으로, 모든 정적분 값을 심프슨 규칙으로 확인 — [14_integration-by-parts_verify.py](/Hongs_Blog/studies/calculus/code/14_integration-by-parts_verify/)</div>

</div>


[^1]: OpenStax, *Calculus Volume 1*, 5.5절 "Substitution". OpenStax, *Calculus Volume 2*, 3.1절 "Integration by Parts", 3.5절 "Other Strategies for Integration"(방법 고르기).
{% endraw %}
