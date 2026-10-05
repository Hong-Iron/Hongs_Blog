---
layout: "note"
title: "부분적분"
display_title: "부분적분 (Integration by Parts)"
kind: "concept"
kind_label: "기법"
num: "14"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
aliases: ["Integration by Parts", "부분적분", "부분 적분법", "표 방법", "tabular method", "LIATE", "감마 함수", "Gamma function"]
description: "곱의 미분 법칙을 거꾸로 쓰는 기법이다. 두 함수의 곱을 적분할 때, 한쪽은 미분하고 다른 쪽은 적분해 더 쉬운 적분으로 바꾼다. 다항식 × 지수함수, 다항식 × 삼각함수, 로그처럼 치환이 통하지 않는 곱에 쓴다. 어느 쪽을 미분할지 잘못 고르면 식이 오히려 복잡해지므로, 미분할수…"
prev_url: "/studies/calculus/substitution/"
prev_title: "치환적분"
next_url: "/studies/calculus/improper-integrals/"
next_title: "이상적분"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/integration-by-parts/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

곱의 미분 법칙을 거꾸로 쓰는 기법이다. 두 함수의 곱을 적분할 때, 한쪽은 미분하고 다른 쪽은 적분해 더 쉬운 적분으로 바꾼다. 다항식 × 지수함수, 다항식 × 삼각함수, 로그처럼 치환이 통하지 않는 곱에 쓴다. 어느 쪽을 미분할지 잘못 고르면 식이 오히려 복잡해지므로, 미분할수록 단순해지는 쪽을 고르는 것이 요령이다.

</div>


## 예시로 보기

$$\int x e^x\,dx$$에서 $$x$$는 미분하면 1로 단순해지고, $$e^x$$는 적분해도 그대로다. 그래서 $$x$$를 미분할 쪽($$u$$), $$e^x\,dx$$를 적분할 쪽($$dv$$)으로 나눈다.

$$\int x e^x dx = x e^x - \int 1 \cdot e^x dx = x e^x - e^x + C = (x - 1)e^x + C$$

미분해 보면 $$\big((x - 1)e^x\big)' = e^x + (x - 1)e^x = x e^x$$로 맞다. $$x$$가 아래 공식의 $$u$$, $$e^x$$가 $$v$$의 도함수다. 반대로 $$u = e^x$$, $$dv = x\,dx$$로 고르면 $$\frac{x^2}{2}e^x - \int\frac{x^2}{2}e^x dx$$가 되어 차수가 오히려 올라간다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">부분적분</div>

$$u$$, $$v$$가 연속인 도함수를 가지면

$$\int u\,dv = uv - \int v\,du, \qquad \int_a^b u(x)v'(x)\,dx = \big[u(x)v(x)\big]_a^b - \int_a^b v(x)u'(x)\,dx.$$

[^1]

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

곱의 법칙 $$(uv)' = u'v + uv'$$의 양변을 $$[a, b]$$에서 적분한다. [기본정리 2부](/Hongs_Blog/studies/calculus/ftc/)로 좌변은 $$\big[uv\big]_a^b$$이다. $$\int_a^b uv'$$을 남기고 나머지를 넘기면 된다. ∎

</details>


**$$u$$ 고르는 요령.** 미분하면 단순해지는 쪽을 $$u$$로 둔다. 흔히 로그 → 역삼각 → 다항식 → 삼각 → 지수 순서로 앞쪽을 $$u$$로 고른다(머리글자로 LIATE라 부르는 경험칙)[^s1]. 규칙이 아니라 요령이라 예외가 있다.

**반복과 표.** $$\int x^n e^x dx$$처럼 여러 번 해야 하면, $$u$$를 계속 미분한 열과 $$dv$$를 계속 적분한 열을 나란히 쓰고 대각선으로 곱해 부호를 $$+, -, +, \dots$$로 번갈아 더한다(표 방법).

| 부호 | $$u$$와 도함수 | $$dv$$와 적분 |
|---|---|---|
| $$+$$ | $$x^2$$ | $$e^x$$ |
| $$-$$ | $$2x$$ | $$e^x$$ |
| $$+$$ | $$2$$ | $$e^x$$ |
| | $$0$$ | $$e^x$$ |

그래서 $$\int x^2 e^x dx = x^2e^x - 2xe^x + 2e^x + C = (x^2 - 2x + 2)e^x + C$$.

## 예제

**로그 하나만 있을 때.** $$\int \ln x\,dx$$.

1. *나누기:* 곱이 안 보이면 $$dv = dx$$로 둔다. $$u = \ln x$$, $$v = x$$.
2. *공식:* $$x\ln x - \int x\cdot\frac1x dx = x\ln x - x + C$$.

**원래 적분이 되돌아올 때.** $$I = \int e^x\sin x\,dx$$.

1. *한 번:* $$u = \sin x$$, $$dv = e^x dx$$로 $$I = e^x\sin x - \int e^x\cos x\,dx$$.
2. *한 번 더:* $$\int e^x\cos x\,dx = e^x\cos x + \int e^x \sin x\,dx = e^x\cos x + I$$.
3. *방정식으로 풀기:* $$I = e^x\sin x - e^x\cos x - I$$에서 $$I = \frac{e^x(\sin x - \cos x)}{2} + C$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 원시함수를 수치 미분해 피적분함수와 비교, $$\int_0^\infty x e^{-x} dx = 1$$과 $$\int_0^\infty x^n e^{-x}dx = n!$$($$n \le 6$$, 수치 적분), 푸리에 계수 예 — [14_integration-by-parts_verify.py](/Hongs_Blog/studies/calculus/code/14_integration-by-parts_verify/)</div>

</div>


## 활용

- **기댓값.** 평균 대기 시간이 1인 지수분포에서 대기 시간의 기댓값은 $$\int_0^\infty x e^{-x}dx$$이고, 부분적분으로 1이다. 같은 방법을 되풀이하면 $$\int_0^\infty x^n e^{-x}dx = n!$$이다. 이것이 계승을 실수로 넓힌 감마 함수 $$\Gamma(n + 1) = n!$$의 출발점이다.
- **푸리에 계수.** 톱니파 같은 신호를 사인파로 나눌 때 $$\int_{-\pi}^{\pi} x\sin(kx)\,dx = \frac{2\pi(-1)^{k+1}}{k}$$ 같은 적분이 나온다. $$u = x$$로 둔 부분적분 한 번이다([푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/)).
- 연습: [적분 계산 예제 사다리](/Hongs_Blog/studies/calculus/integration-ladder/)

## 연결

- 선수: [미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/), [미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/)(곱의 법칙)
- 짝을 이루는 기법: [치환적분](/Hongs_Blog/studies/calculus/substitution/)
- 이산판: 합에서는 아벨의 부분합(summation by parts)이 같은 역할을 한다. [교란법](/Hongs_Blog/studies/discrete-math/sums-asymptotics/)도 비슷하게 원래 합을 다시 만들어 방정식으로 푼다[^s1].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** ∫ x cos x dx를 구하라.</summary>

**답:** $$u = x$$, $$dv = \cos x\,dx$$, $$v = \sin x$$. $$x\sin x - \int\sin x\,dx = x\sin x + \cos x + C$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** ∫₁^e ln x dx를 구하라.</summary>

**답:** $$\big[x\ln x - x\big]_1^e = (e - e) - (0 - 1) = 1$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$\int x e^{x^2}\,dx$$와 $$\int x e^{x}\,dx$$ 중 부분적분이 필요한 쪽은? 다른 쪽은 무엇으로 푸는가?</summary>

**답:** 둘째다. $$(x - 1)e^x + C$$. 첫째는 안쪽 $$x^2$$의 도함수 $$2x$$(의 절반)가 곱해져 있어 [치환적분](/Hongs_Blog/studies/calculus/substitution/)으로 $$\frac12 e^{x^2} + C$$다. 곱이 보인다고 늘 부분적분은 아니다. "안쪽의 도함수가 있나"를 먼저 본다.

</details>


[^1]: OpenStax, *Calculus Volume 2*, 3.1절 "Integration by Parts"(공식, $$u$$ 고르기, 반복 적용, 정적분).
[^s1]: 에이전트 보충. LIATE는 여러 미적분 교재와 강의에서 쓰는 경험칙이다. 아벨의 부분합은 Graham·Knuth·Patashnik, *Concrete Mathematics* 2.6절의 "summation by parts"로 확인할 수 있다.
{% endraw %}
