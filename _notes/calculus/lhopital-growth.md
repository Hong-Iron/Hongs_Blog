---
layout: "note"
title: "로피탈 정리와 증가 속도"
display_title: "로피탈 정리와 증가 속도 (L'Hôpital's Rule and Growth Rates)"
kind: "concept"
kind_label: "정리"
num: "09"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["L'Hôpital's Rule", "로피탈 정리", "부정형", "indeterminate form", "증가 속도", "rate of growth", "함수의 증가 속도 비교", "expm1"]
description: "분자와 분모가 함께 0으로 가거나 함께 한없이 커지는 극한은 모양만 보고는 값을 알 수 없다. 로피탈 정리는 이때 분자와 분모를 각각 미분한 비의 극한을 보면 된다고 알려 준다. 이것으로 \"로그는 어떤 거듭제곱보다도 느리고, 지수는 어떤 거듭제곱보다도 빠르다\"는 알고리즘 분석의 기…"
prev_url: "/studies/calculus/mean-value-theorem/"
prev_title: "평균값 정리"
next_url: "/studies/calculus/linear-approx-newton/"
next_title: "선형 근사와 뉴턴 방법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/lhopital-growth/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

분자와 분모가 함께 0으로 가거나 함께 한없이 커지는 극한은 모양만 보고는 값을 알 수 없다. 로피탈 정리는 이때 분자와 분모를 각각 미분한 비의 극한을 보면 된다고 알려 준다. 이것으로 "로그는 어떤 거듭제곱보다도 느리고, 지수는 어떤 거듭제곱보다도 빠르다"는 알고리즘 분석의 기본 서열이 증명된다. 단, 0/0이나 ∞/∞ 꼴이 아닌 곳에 쓰면 틀린 답이 나온다.

</div>


## 예시로 보기

$$\frac{\ln x}{x}$$는 $$x \to \infty$$에서 분자도 분모도 한없이 커진다. 누가 더 빨리 크는지가 답을 정한다. 둘의 순간 증가율(도함수)을 비교하면 분자는 $$1/x$$, 분모는 1이다. 로그는 갈수록 느리게 늘고 $$x$$는 일정하게 늘어서, 비는 $$\frac{1/x}{1} \to 0$$이다. 그래서 $$\frac{\ln x}{x} \to 0$$이다. 분자와 분모의 "빠르기"가 아래 정리의 $$f'$$, $$g'$$이다.

## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">로피탈 정리</div>

$$f$$, $$g$$가 $$a$$ 근처(점 $$a$$ 제외)에서 미분 가능하고 $$g' \ne 0$$이며, $$x \to a$$일 때
- $$f(x) \to 0$$, $$g(x) \to 0$$이거나 ($$\frac00$$ 꼴)
- $$f(x) \to \pm\infty$$, $$g(x) \to \pm\infty$$이고 ($$\frac{\infty}{\infty}$$ 꼴)

$$\lim_{x \to a}\frac{f'(x)}{g'(x)}$$가 있으면(무한대 포함), $$\lim_{x \to a}\frac{f(x)}{g(x)}$$도 그 값과 같다. $$a = \pm\infty$$여도 된다[^1].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 [증명 스케치]</summary>

$$\frac00$$ 꼴이고 $$f(a) = g(a) = 0$$으로 이어 붙였다고 하자. 평균값 정리를 두 함수에 함께 쓰는 코시 평균값 정리로 $$\frac{f(x)}{g(x)} = \frac{f(x) - f(a)}{g(x) - g(a)} = \frac{f'(c)}{g'(c)}$$인 $$c$$가 $$a$$와 $$x$$ 사이에 있다. $$x \to a$$이면 $$c \to a$$라 오른쪽이 가정한 극한으로 간다. 코시 평균값 정리는 $$h(t) = f(t)(g(x) - g(a)) - g(t)(f(x) - f(a))$$에 롤의 정리를 쓰면 나온다. $$\frac{\infty}{\infty}$$ 꼴은 같은 생각이 조금 더 복잡하다. ∎

</details>


**증가 속도의 서열.** 로피탈 정리를 되풀이하면, $$\varepsilon > 0$$, $$k > 0$$, $$b > 1$$에 대해 $$x \to \infty$$일 때

$$\frac{\ln x}{x^\varepsilon} \to 0, \qquad \frac{x^k}{b^x} \to 0$$

이다. 둘째는 분자를 $$\lceil k \rceil$$($$\lceil\ \rceil$$는 소수점 아래를 올린 정수)번 미분하면 분자가 상수나 0으로 줄지만 분모는 $$b^x(\ln b)^{\lceil k \rceil}$$로 여전히 한없이 크기 때문이다. [거듭제곱함수와 지수함수 비교](/Hongs_Blog/studies/college-math/power-vs-exponential/)의 서열 $$\lg n \ll n^\varepsilon \ll n^k \ll b^n$$을 이것이 증명한다.

## 예제

$$\lim_{x \to 0}\frac{e^x - 1 - x}{x^2}$$를 구한다.

1. *꼴 확인:* 분자·분모 모두 0으로 간다. $$\frac00$$.
2. *한 번 미분:* $$\frac{e^x - 1}{2x}$$. 아직 $$\frac00$$.
3. *한 번 더:* $$\frac{e^x}{2} \to \frac12$$.
4. *결론:* 극한은 $$\frac12$$. 뜻은 $$x$$가 작을 때 $$e^x \approx 1 + x + \frac{x^2}{2}$$라는 것이다([테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/)).

$$0 \cdot \infty$$나 $$1^\infty$$ 꼴도 바꿔서 쓴다. $$x \ln x = \frac{\ln x}{1/x}$$($$\frac{-\infty}{\infty}$$)는 $$x \to 0^+$$에서 $$\frac{1/x}{-1/x^2} = -x \to 0$$. $$\left(1 + \frac{a}{x}\right)^x$$은 로그를 취하면 $$\frac{\ln(1 + a/x)}{1/x} \to a$$라서 $$e^a$$로 간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예제의 1/2, $$x\ln x \to 0$$, $$(1 + a/x)^x \to e^a$$, $$\ln x / x^{0.1}$$이 아주 느리게 0으로 감, $$x^{10}/1.1^x$$, 오해의 반례, `expm1`의 정확도 — [09_lhopital-growth_verify.py](/Hongs_Blog/studies/calculus/code/09_lhopital-growth_verify/)</div>

</div>


## 활용

- **점근 표기의 근거.** 알고리즘의 비용을 비교할 때 "$$n \lg n$$은 결국 $$n^2$$보다 작다", "다항 시간은 결국 지수 시간보다 빠르다"는 모두 이 극한이다. 다만 "결국"이 늦게 올 수 있다. $$\frac{\ln x}{x^{0.1}}$$은 $$x = 10^{10}$$에서 아직 약 2.3이고, $$x = 10^{100}$$이 되어야 $$2.3 \times 10^{-8}$$이다.
- **수치 계산.** $$\frac{e^x - 1}{x}$$를 아주 작은 $$x$$에서 그대로 계산하면 $$e^x$$와 1이 거의 같아 유효숫자가 사라진다($$x = 10^{-12}$$에서 오차가 $$10^{-5}$$ 정도). 극한값 1 근처의 이런 식은 `math.expm1(x)`($$e^x - 1$$을 정확히 계산)과 `math.log1p(x)`($$\ln(1 + x)$$)를 쓴다.

## 연결

- 선수: [평균값 정리](/Hongs_Blog/studies/calculus/mean-value-theorem/)
- 증명하는 곳: [거듭제곱함수와 지수함수 비교](/Hongs_Blog/studies/college-math/power-vs-exponential/), [로그함수와 로그 스케일](/Hongs_Blog/studies/college-math/log-scale/)의 "로그는 어떤 거듭제곱보다 느리다"
- 이어지는 개념: 이산수학의 [점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/), [이상적분](/Hongs_Blog/studies/calculus/improper-integrals/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"분수의 극한은 늘 분자와 분모를 미분해서 구하면 된다"</div>

틀렸다. 로피탈 정리가 강력해서 모든 분수에 쓰고 싶어진다. 이 정리는 $$\frac00$$이나 $$\frac{\infty}{\infty}$$ 꼴에서만 맞는다. $$\lim_{x \to 0}\frac{x + 1}{x + 2}$$는 그냥 대입해 $$\frac12$$인데, 미분하면 $$\frac11 = 1$$로 틀린 값이 나온다. 쓰기 전에 꼴부터 확인한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 로피탈 정리를 쓸 수 있는 조건을 쓰라.</summary>

**답:** 극한이 $$\frac00$$ 또는 $$\frac{\infty}{\infty}$$ 꼴이고, 근처에서 미분 가능하며 $$g' \ne 0$$이고, $$\lim \frac{f'}{g'}$$이 존재해야 한다. 그때 $$\lim\frac{f}{g} = \lim\frac{f'}{g'}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\lim_{x \to 0} \frac{e^x - 1 - x}{x^2}$$를 구하라.</summary>

**답:** $$\frac00$$ 꼴이라 두 번 쓰면 $$\frac{e^x - 1}{2x} \to \frac{e^x}{2} \to \frac12$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 로피탈 정리를 잘못 써서 틀린 답이 나오는 예를 들라.</summary>

**답:** $$\lim_{x \to 0}\frac{x + 1}{x + 2} = \frac12$$인데, 미분한 비 $$\frac11 = 1$$을 답으로 쓰면 틀린다. $$\frac12$$은 $$\frac00$$ 꼴이 아니라서 정리의 가정이 깨졌다.

</details>


[^1]: OpenStax, *Calculus Volume 1*, 4.8절 "L'Hôpital's Rule"(부정형, 증가 속도 비교)
{% endraw %}
