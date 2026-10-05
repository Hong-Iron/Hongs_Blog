---
layout: "note"
title: "치환적분"
display_title: "치환적분 (Integration by Substitution)"
kind: "concept"
kind_label: "기법"
num: "13"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
aliases: ["Integration by Substitution", "치환적분", "u-치환", "u-substitution", "변수 바꾸기", "change of variables"]
description: "연쇄 법칙을 거꾸로 쓰는 기법이다. 적분할 식 안에 \"안쪽 함수\"와 \"그 안쪽 함수의 도함수\"가 함께 보이면, 안쪽 함수를 새 변수 하나로 묶어 식을 단순하게 만든다. 모양만 맞으면 복잡한 식이 기본 공식 하나로 줄어든다. 다만 도함수가 곱해져 있지 않으면(상수배 차이는 괜찮다) …"
prev_url: "/studies/calculus/ftc/"
prev_title: "미적분의 기본정리"
next_url: "/studies/calculus/integration-by-parts/"
next_title: "부분적분"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/substitution/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

연쇄 법칙을 거꾸로 쓰는 기법이다. 적분할 식 안에 "안쪽 함수"와 "그 안쪽 함수의 도함수"가 함께 보이면, 안쪽 함수를 새 변수 하나로 묶어 식을 단순하게 만든다. 모양만 맞으면 복잡한 식이 기본 공식 하나로 줄어든다. 다만 도함수가 곱해져 있지 않으면(상수배 차이는 괜찮다) 쓸 수 없고, 정적분에서는 끝값도 새 변수에 맞게 바꿔야 한다.

</div>


## 예시로 보기

$$\int 2x\cos(x^2)\,dx$$를 본다. 안쪽 함수 $$x^2$$의 도함수 $$2x$$가 바깥에 곱해져 있다. [연쇄 법칙](/Hongs_Blog/studies/calculus/chain-rule/)으로 $$\big(\sin(x^2)\big)' = \cos(x^2)\cdot 2x$$이므로 답은 $$\sin(x^2) + C$$다.

치환으로 적으면 $$u = x^2$$, $$du = 2x\,dx$$로 두어 $$\int\cos u\,du = \sin u + C = \sin(x^2) + C$$이다. 안쪽 함수 $$x^2$$이 아래 정리의 $$g(x)$$, $$\cos$$가 $$f$$다. "$$du = 2x\,dx$$"는 미분 기호를 분수처럼 다루는 기억법이고, 근거는 아래의 연쇄 법칙이다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">치환적분</div>

$$g'$$이 연속이고 $$f$$가 $$g$$의 치역에서 연속이면

$$\int f\big(g(x)\big)g'(x)\,dx = \int f(u)\,du \Big\vert _{u = g(x)}, \qquad \int_a^b f\big(g(x)\big)g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du.$$

[^1]

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

$$F$$를 $$f$$의 원시함수라 하자. 연쇄 법칙으로 $$\big(F(g(x))\big)' = f(g(x))g'(x)$$이므로 $$F(g(x))$$가 왼쪽 피적분함수의 원시함수다. [기본정리 2부](/Hongs_Blog/studies/calculus/ftc/)로 $$\int_a^b f(g(x))g'(x)dx = F(g(b)) - F(g(a)) = \int_{g(a)}^{g(b)}f(u)du$$. ∎

</details>


**알아보는 신호.** 식 안에 괄호·지수·분모처럼 "안에 든 함수"가 있고, 그 도함수(의 상수배)가 바깥에 곱해져 있다. 대표적인 모양은 다음과 같다.

| 모양 | 치환 | 결과 |
|---|---|---|
| $$\int \frac{g'(x)}{g(x)}dx$$ | $$u = g(x)$$ | $$\ln\vert g(x)\vert  + C$$ |
| $$\int g'(x)e^{g(x)}dx$$ | $$u = g(x)$$ | $$e^{g(x)} + C$$ |
| $$\int (ax + b)^n dx$$ | $$u = ax + b$$ | $$\frac{(ax + b)^{n+1}}{a(n+1)} + C$$ ($$n \ne -1$$) |

## 예제

**정적분의 끝값 바꾸기.** $$\int_0^1 x e^{x^2}\,dx$$.

1. *신호:* 안쪽 $$x^2$$, 도함수 $$2x$$의 절반 $$x$$가 곱해져 있다.
2. *치환:* $$u = x^2$$, $$du = 2x\,dx$$라 $$x\,dx = \frac12 du$$. 끝값은 $$x = 0 \to u = 0$$, $$x = 1 \to u = 1$$.
3. *계산:* $$\frac12\int_0^1 e^u du = \frac12(e - 1) \approx 0.859$$.

**탄젠트.** $$\int \tan x\,dx = \int\frac{\sin x}{\cos x}dx$$. $$u = \cos x$$, $$du = -\sin x\,dx$$로 $$-\int\frac{du}{u} = -\ln\vert \cos x\vert  + C$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시와 탄젠트의 원시함수를 수치 미분해 피적분함수와 비교, $$\int_0^1 xe^{x^2} = \frac{e - 1}{2}$$(수치 적분), 표의 세 모양, 카드의 답 — [13_substitution_verify.py](/Hongs_Blog/studies/calculus/code/13_substitution_verify/)</div>

</div>


## 활용

- **확률밀도의 변환.** 확률변수 $$X$$를 단조함수로 바꾼 $$Y = g(X)$$의 확률밀도는 $$f_Y(y) = f_X\big(g^{-1}(y)\big)\left\vert \frac{d}{dy}g^{-1}(y)\right\vert $$다. 적분의 치환에서 $$du$$와 $$dx$$의 비율을 곱해 주는 것과 같다([연속 확률변수와 확률밀도](/Hongs_Blog/studies/probability-statistics/continuous-rv/))[^s1].
- **흔한 실수.** 정적분에서 $$u$$로 바꾼 뒤 끝값을 $$x$$의 값 그대로 두는 것. 또는 $$u$$로 적분한 결과를 $$x$$로 되돌리지 않고 원래 끝값을 넣는 것. 둘 중 한 방식으로 통일한다.
- 연습: [적분 계산 예제 사다리](/Hongs_Blog/studies/calculus/integration-ladder/)

## 연결

- 선수: [미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/), [연쇄 법칙](/Hongs_Blog/studies/calculus/chain-rule/)
- 짝을 이루는 기법: [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/)(곱의 법칙의 역)
- 일반화: 다변수에서는 치환의 비율 $$\frac{du}{dx}$$가 야코비 행렬식이 된다([중적분과 변수변환](/Hongs_Blog/studies/calculus/multiple-integrals/)).

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\int_0^{\pi/2} \sin^3 x \cos x\,dx$$를 구하라.</summary>

**답:** $$u = \sin x$$, $$du = \cos x\,dx$$, 끝값 $$0 \to 0$$, $$\frac\pi2 \to 1$$. $$\int_0^1 u^3 du = \frac14$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** ∫ x/(1 + x²) dx와 ∫ 1/(1 + x²) dx 중 u = 1 + x² 치환이 통하는 쪽은? 다른 쪽은 왜 안 되는가?</summary>

**답:** 첫째다. $$du = 2x\,dx$$라 $$\frac12\int\frac{du}{u} = \frac12\ln(1 + x^2) + C$$. 둘째는 분자에 $$x$$가 없어 $$du$$를 만들 수 없다. 둘째의 답은 $$\arctan x + C$$로, $$\arctan$$의 도함수를 거꾸로 읽어 얻는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** ∫ cos(x²) dx에 u = x²을 쓰면 왜 풀리지 않는가?</summary>

**답:** $$du = 2x\,dx$$인데 식에 $$x$$가 곱해져 있지 않다. $$dx = \frac{du}{2\sqrt u}$$로 바꾸면 $$\int\frac{\cos u}{2\sqrt u}du$$가 되어 더 쉬워지지 않는다. 실제로 이 함수의 원시함수는 기본 함수로 쓸 수 없고, 정적분은 수치 적분으로 구한다.

</details>


[^1]: OpenStax, *Calculus Volume 1*, 5.5절 "Substitution", 5.6절 "Integrals Involving Exponential and Logarithmic Functions", 5.7절 "Integrals Resulting in Inverse Trigonometric Functions".
[^s1]: 에이전트 보충. 단조 변환의 확률밀도 공식은 확률론 교재의 "확률변수의 함수" 절에 있는 표준 결과다. 확률과 통계 과목에서 증명과 함께 다룬다.
{% endraw %}
