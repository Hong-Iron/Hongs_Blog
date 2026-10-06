---
layout: "note"
title: "이상적분"
display_title: "이상적분 (Improper Integrals)"
kind: "concept"
kind_label: "정의"
num: "15"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Improper Integral", "이상적분", "특이적분", "p-적분", "p-integral", "비교 판정", "comparison test", "가우스 적분", "Gaussian integral", "감마 함수"]
description: "끝이 없는 구간이나, 값이 한없이 커지는 점이 있는 구간에서의 적분이다. 끝을 유한한 곳에서 잘라 적분한 뒤, 자르는 곳을 한없이 밀어 극한을 본다. 무한히 긴 꼬리도 충분히 빨리 얇아지면 넓이가 유한하다. 하지만 거리에 반비례하는 곡선처럼 느리게 얇아지면 넓이가 무한대가 되고, …"
prev_url: "/studies/calculus/integration-by-parts/"
prev_title: "부분적분"
next_url: "/studies/calculus/sum-integral-bounds/"
next_title: "합 ↔ 적분"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/improper-integrals/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

끝이 없는 구간이나, 값이 한없이 커지는 점이 있는 구간에서의 적분이다. 끝을 유한한 곳에서 잘라 적분한 뒤, 자르는 곳을 한없이 밀어 극한을 본다. 무한히 긴 꼬리도 충분히 빨리 얇아지면 넓이가 유한하다. 하지만 거리에 반비례하는 곡선처럼 느리게 얇아지면 넓이가 무한대가 되고, 이 경계를 모르면 발산하는 적분에 공식을 기계적으로 넣는 실수를 한다.

</div>


## 예시로 보기

$$y = \frac{1}{x^2}$$과 $$y = \frac1x$$은 둘 다 $$x$$가 커지면 0으로 간다. $$x = 1$$부터 $$t$$까지의 넓이를 비교한다.

| $$t$$ | $$\int_1^t \frac{dx}{x^2} = 1 - \frac1t$$ | $$\int_1^t \frac{dx}{x} = \ln t$$ |
|---|---|---|
| 10 | 0.9 | 2.30 |
| 1,000 | 0.999 | 6.91 |
| $$10^6$$ | 0.999999 | 13.8 |

$$\frac{1}{x^2}$$은 넓이가 1로 모이고, $$\frac1x$$은 느리지만 끝없이 자란다. 앞의 것을 "수렴한다", 뒤의 것을 "발산한다"고 한다. 자른 곳 $$t$$가 아래 정의의 극한 변수다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

- 무한 구간: $$\int_a^\infty f(x)\,dx = \lim_{t \to \infty}\int_a^t f(x)\,dx$$($$\lim$$은 한없이 가까이 갈 때 다가가는 값(극한)).
- 끝점에서 값이 한없이 커질 때($$a$$에서): $$\int_a^b f(x)\,dx = \lim_{t \to a^+}\int_t^b f(x)\,dx$$.
- 극한이 유한하면 **수렴**, 아니면 **발산**한다.
- 양쪽이 모두 무한이거나 가운데에 문제점이 있으면 둘로 나누고, **두 조각이 모두 수렴할 때만** 전체가 수렴한다: $$\int_{-\infty}^{\infty} f = \int_{-\infty}^{c} f + \int_{c}^{\infty} f$$.<br>
[^1]

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">p-적분</div>

$$\int_1^\infty \frac{dx}{x^p}$$는 $$p > 1$$일 때 $$\frac{1}{p - 1}$$로 수렴하고, $$p \le 1$$이면 발산한다. $$\int_0^1 \frac{dx}{x^p}$$는 거꾸로 $$p < 1$$일 때 $$\frac{1}{1 - p}$$로 수렴하고, $$p \ge 1$$이면 발산한다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

$$p \ne 1$$이면 $$\int_1^t x^{-p}dx = \frac{t^{1-p} - 1}{1 - p}$$. $$t \to \infty$$에서 $$t^{1-p}$$은 $$p > 1$$이면 0으로, $$p < 1$$이면 무한대로 간다. $$p = 1$$이면 $$\ln t \to \infty$$. $$[0, 1]$$ 쪽은 $$t \to 0^+$$에서 같은 계산이다. ∎

</details>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">비교 판정</div>

$$0 \le f(x) \le g(x)$$이면, $$\int_a^\infty g$$가 수렴할 때 $$\int_a^\infty f$$도 수렴하고, $$\int_a^\infty f$$가 발산할 때 $$\int_a^\infty g$$도 발산한다.

</div>


넓이가 유한한 영역 안에 들어가는 영역은 넓이가 유한하다는 뜻이다. 누적 함수 $$\int_a^t f$$가 증가하고 $$\int_a^\infty g$$로 위가 막혀 있어 수렴한다(단조 수렴).

## 예제

**가우스 함수의 꼬리.** $$\int_0^\infty e^{-x^2}dx$$가 수렴하는지 본다. 원시함수는 기본 함수로 쓸 수 없다.

1. *조각내기:* $$[0, 1]$$은 보통 정적분(연속함수)이라 유한하다.
2. *비교할 함수 찾기:* $$x \ge 1$$이면 $$x^2 \ge x$$라 $$e^{-x^2} \le e^{-x}$$.
3. *비교:* $$\int_1^\infty e^{-x}dx = e^{-1}$$로 수렴하므로 $$\int_1^\infty e^{-x^2}dx$$도 수렴한다.

실제 값은 $$\frac{\sqrt\pi}{2}$$이고, 이 값은 극좌표로 바꾼 중적분으로 구한다([중적분과 변수변환](/Hongs_Blog/studies/calculus/multiple-integrals/)).

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표의 값, p-적분의 값($$p = 0.5, 2, 3$$)과 발산($$p = 1$$), 비교 판정의 예와 $$\frac{\sqrt\pi}{2}$$(수치 적분), 카드의 값, 오해의 대칭 극한과 두 조각의 발산 — [15_improper-integrals_verify.py](/Hongs_Blog/studies/calculus/code/15_improper-integrals_verify/)</div>

</div>


## 활용

- **확률분포.** 확률밀도는 전체 넓이가 1이어야 한다. 지수분포 $$\lambda e^{-\lambda x}$$($$x \ge 0$$)는 $$\int_0^\infty\lambda e^{-\lambda x}dx = 1$$이다. 정규분포의 넓이 1은 가우스 적분 $$\int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi$$에서 나온다([정규분포](/Hongs_Blog/studies/probability-statistics/normal-distribution/)).
- **꼬리가 두꺼운 분포.** 파일 크기나 웹 트래픽처럼 꼬리가 $$x^{-p}$$ 모양으로 얇아지는 분포는 $$p$$에 따라 평균이 무한대가 될 수 있다. 평균이 있으려면 $$\int^\infty x\cdot x^{-p}dx$$가 수렴해야 하고, p-적분에 따라 $$p > 2$$가 필요하다[^s1].
- **급수 판정.** 합 $$\sum \frac{1}{n^p}$$($$\sum$$은 차례로 모두 더한다는 기호)의 수렴을 같은 모양의 적분으로 판정한다([급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/)의 적분 판정).

## 연결

- 선수: [치환적분](/Hongs_Blog/studies/calculus/substitution/), [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/)(예: $$\int_0^\infty xe^{-x}dx = 1$$), [로피탈 정리](/Hongs_Blog/studies/calculus/lhopital-growth/)(끝값의 극한 $$te^{-t} \to 0$$)
- 이어지는 개념: [급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/), [합 ↔ 적분](/Hongs_Blog/studies/calculus/sum-integral-bounds/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$\int_{-\infty}^{\infty} x\,dx$$는 대칭이라 0이다"</div>

틀렸다. $$\int_{-t}^{t}x\,dx = 0$$이 모든 $$t$$에서 맞으니 극한도 0처럼 보인다. 하지만 정의는 두 조각 $$\int_{-\infty}^0 x\,dx$$와 $$\int_0^\infty x\,dx$$가 **각각** 수렴하기를 요구하고, 둘 다 발산한다. 대칭으로 자르는 방식만 특별히 0이 나오는 것이다. $$\int_{-t}^{2t}x\,dx = \frac{3t^2}{2}$$처럼 자르는 방식을 바꾸면 무한대로 간다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\int_0^\infty x e^{-x}\,dx$$를 극한까지 포함해 구하라.</summary>

**답:** 부분적분으로 $$\int_0^t xe^{-x}dx = \big[-xe^{-x} - e^{-x}\big]_0^t = 1 - te^{-t} - e^{-t}$$. $$t \to \infty$$에서 $$te^{-t} \to 0$$(로피탈)이라 값은 1.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 다음 중 수렴하는 것을 고르라. (가) ∫₁^∞ dx/x (나) ∫₁^∞ dx/x^1.01 (다) ∫₀^1 dx/√x (라) ∫₀^1 dx/x²</summary>

**답:** (나)와 (다). p-적분에서 $$[1, \infty)$$는 $$p > 1$$, $$(0, 1]$$은 $$p < 1$$이어야 수렴한다. (나)는 $$p = 1.01$$로 $$\frac{1}{0.01} = 100$$, (다)는 $$p = \frac12$$로 2. (가)는 $$p = 1$$, (라)는 $$p = 2$$라 발산한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 대칭 극한 $$\lim_{t\to\infty}\int_{-t}^{t} f$$는 유한한데 $$\int_{-\infty}^{\infty} f$$는 발산하는 예를 들라.</summary>

**답:** $$f(x) = x$$. 대칭 극한은 늘 0이지만 $$\int_0^\infty x\,dx$$가 발산해 전체는 발산이다.

</details>


[^1]: OpenStax, *Calculus Volume 2*, 3.7절 "Improper Integrals"(무한 구간, 불연속 피적분함수, 비교 판정).
[^s1]: 에이전트 보충. 파레토 분포(꼬리 $$x^{-p}$$ 모양의 밀도)의 평균이 $$p > 2$$에서만 유한하다는 것은 p-적분에서 바로 나온다. 인터넷 트래픽의 꼬리가 두껍다는 관찰은 Crovella & Bestavros(1997, *IEEE/ACM Transactions on Networking* 5(6))가 대표적이다. 웹 전송 크기의 꼬리가 지수 약 1.06인 파레토 분포로 잘 맞았다. 이 지수는 "$$x$$보다 클 확률"의 지수라 밀도로는 약 2.06이고, 위 판정대로 평균은 유한하지만 분산은 무한하다.
{% endraw %}
