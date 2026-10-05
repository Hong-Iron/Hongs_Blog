---
layout: "note"
title: "선형 근사와 뉴턴 방법"
display_title: "선형 근사와 뉴턴 방법 (Linear Approximation and Newton's Method)"
kind: "concept"
kind_label: "알고리즘"
num: "10"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-09-25"
status: "verified"
aliases: ["Linear Approximation", "Newton's Method", "선형 근사", "접선 근사", "tangent line approximation", "미분", "differential", "뉴턴 방법", "뉴턴-랩슨", "Newton-Raphson", "이차 수렴", "quadratic convergence", "바빌로니아 방법"]
description: "매끄러운 곡선은 한 점 근처를 확대하면 직선(접선)처럼 보인다. 그래서 복잡한 함수값을 접선으로 어림하고(선형 근사), 방정식의 근은 \"접선이 0이 되는 곳\"으로 거듭 옮겨 가며 찾는다(뉴턴 방법). 뉴턴 방법은 근 근처에서 한 번 반복할 때마다 맞는 자릿수가 거의 두 배로 는다.…"
prev_url: "/studies/calculus/lhopital-growth/"
prev_title: "로피탈 정리와 증가 속도"
next_url: "/studies/calculus/riemann-integral/"
next_title: "정적분과 리만 합"
math: true
mermaid: false
code_count: 2
permalink: "/studies/calculus/linear-approx-newton/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

매끄러운 곡선은 한 점 근처를 확대하면 직선(접선)처럼 보인다. 그래서 복잡한 함수값을 접선으로 어림하고(선형 근사), 방정식의 근은 "접선이 0이 되는 곳"으로 거듭 옮겨 가며 찾는다(뉴턴 방법). 뉴턴 방법은 근 근처에서 한 번 반복할 때마다 맞는 자릿수가 거의 두 배로 는다. 다만 출발점이 나쁘거나 기울기가 0에 가까우면 엉뚱한 곳으로 튀거나 끝없이 맴돈다.

</div>


## 예시로 보기

$$\sqrt{4.1}$$을 계산기 없이 어림한다. $$f(x) = \sqrt x$$는 $$x = 4$$에서 값 2, 기울기 $$f'(4) = \frac{1}{2\sqrt4} = \frac14$$다. 4에서 0.1만큼 가면 접선을 따라 $$0.1 \times \frac14 = 0.025$$ 오른다.

$$\sqrt{4.1} \approx 2 + 0.025 = 2.025 \quad (\text{참값 } 2.02485\ldots,\ \text{오차 } 1.5 \times 10^{-4})$$


뉴턴 방법은 이 생각을 근 찾기에 쓴다. $$x^2 = 2$$의 근을 찾을 때 지금의 추측 $$x_n$$에서 접선을 긋고, 접선이 0이 되는 곳을 다음 추측으로 삼는다.

| $$n$$ | $$x_n$$ | 오차 $$\vert x_n - \sqrt2\vert $$ |
|---|---|---|
| 0 | 1 | 0.41 |
| 1 | 1.5 | $$8.6 \times 10^{-2}$$ |
| 2 | 1.41667 | $$2.5 \times 10^{-3}$$ |
| 3 | 1.4142157 | $$2.1 \times 10^{-6}$$ |
| 4 | 1.41421356237469 | $$1.6 \times 10^{-12}$$ |

오차가 대략 제곱씩 줄어, 맞는 자릿수가 1, 2, 5, 11로 두 배씩 는다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">선형 근사</div>

$$f$$가 $$a$$에서 미분 가능하면 $$a$$ 근처에서

$$f(x) \approx L(x) = f(a) + f'(a)(x - a)$$

이다. $$L$$은 $$a$$에서의 접선이다[^1]. 자주 쓰는 예: $$\sin x \approx x$$, $$\ln(1 + x) \approx x$$, $$(1 + x)^n \approx 1 + nx$$ ($$x$$가 작을 때).

</div>


<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">뉴턴 방법</div>

**입력:** 미분 가능한 $$f$$, 그 도함수 $$f'$$, 출발점 $$x_0$$, 허용 오차 $$\text{tol}$$, 최대 반복 횟수.<br>
**출력:** $$f(x) = 0$$의 근의 어림.
```
x ← x₀
반복 (최대 횟수까지):
    f'(x) = 0이면 실패로 멈춘다
    x_new ← x − f(x) / f'(x)
    |x_new − x| ≤ tol이면 x_new를 돌려준다
    x ← x_new
```
갱신식은 $$x_n$$에서의 접선 $$y = f(x_n) + f'(x_n)(x - x_n)$$이 0이 되는 $$x$$다[^2].

</div>


**수렴 속도.** 근 $$r$$에서 $$f'(r) \ne 0$$이고 $$f$$가 두 번 미분 가능하며 출발점이 충분히 가까우면, $$\vert x_{n+1} - r\vert  \approx \frac{\vert f''(r)\vert }{2\vert f'(r)\vert }\,\vert x_n - r\vert ^2$$로 이차 수렴한다. [증명 스케치: $$f$$를 $$x_n$$에서 테일러 전개해 2차 항까지 쓰면 나온다([테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/))] 같은 정밀도 $$10^{-12}$$까지 $$\sqrt2$$를 구할 때 [이분법](/Hongs_Blog/studies/calculus/continuity/)은 40번, 뉴턴 방법은 5번이다.

**실패하는 경우.**
- 기울기가 0인 점에 닿으면 나눌 수 없다($$x^2 - 2$$를 $$x_0 = 0$$에서 시작).
- 맴돈다: $$f(x) = x^3 - 2x + 2$$를 $$x_0 = 0$$에서 시작하면 $$0 \to 1 \to 0 \to 1 \to \cdots$$.
- 근에서 멀리 시작하면 다른 근으로 가거나 발산한다. 그래서 실무에서는 이분법으로 근을 가둔 뒤 뉴턴 방법으로 빠르게 다듬는 식으로 섞는다.

## 예제

$$\sqrt2$$를 뉴턴 방법으로 구하는 첫 두 걸음을 추적한다. $$f(x) = x^2 - 2$$, $$f'(x) = 2x$$라 갱신식은 $$x - \frac{x^2 - 2}{2x} = \frac12\left(x + \frac2x\right)$$다(바빌로니아 방법).

1. *$$x_0 = 1$$:* $$\frac12(1 + 2) = 1.5$$.
2. *$$x_1 = 1.5$$:* $$\frac12\left(1.5 + \frac{2}{1.5}\right) = \frac12(1.5 + 1.3333) = 1.41667$$.
3. *멈춤 판단:* 이웃 값의 차가 0.083으로 아직 크니 계속한다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 구현과 자체 테스트(√2, 3차 방정식, 기울기 0에서 오류, 순환) — [10_linear-approx-newton_impl.py](/Hongs_Blog/studies/calculus/code/10_linear-approx-newton_impl/). 표의 값과 오차, 이분법 40번 대 뉴턴 5번, 선형 근사 예 — [10_linear-approx-newton_verify.py](/Hongs_Blog/studies/calculus/code/10_linear-approx-newton_verify/)</div>

</div>


## 활용

- **라이브러리 구현.** 제곱근·나눗셈·역수는 뉴턴 방법으로 몇 번의 곱셈만에 전체 정밀도에 이른다. 오래된 3D 게임의 "빠른 역제곱근"은 비트 조작으로 얻은 첫 추측에 뉴턴 한 걸음을 더한 것이다[^s1].
- **최적화.** 최솟값에서는 $$f' = 0$$이므로 $$f'$$에 뉴턴 방법을 쓰면 $$x_{n+1} = x_n - \frac{f'(x_n)}{f''(x_n)}$$이다. 곡률(이계도함수)까지 써서 경사 하강법보다 적은 걸음으로 수렴한다(다변수는 [헤세 행렬](/Hongs_Blog/studies/calculus/hessian/)).
- **어림 계산.** 성장률 $$r$$이 작을 때 $$\ln(1 + r) \approx r$$이라 두 배 시간이 약 $$0.693/r$$이다([로그 계산 예제 사다리](/Hongs_Blog/studies/college-math/logarithm-ladder/)의 72의 법칙).

## 연결

- 선수: [도함수의 활용과 최적화](/Hongs_Blog/studies/calculus/curve-analysis/)
- 비교: [이분법](/Hongs_Blog/studies/calculus/continuity/)(느리지만 늘 수렴)과 뉴턴 방법(빠르지만 출발점에 민감). 수렴 속도의 말은 [수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/).
- 이어지는 개념: [테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/)(오차 분석), [미분방정식과 오일러 방법](/Hongs_Blog/studies/calculus/ode-euler/)(선형 근사로 한 걸음씩)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** f(x) = x² − 2, x₀ = 1로 뉴턴 방법을 세 번 반복한 값 x₁, x₂, x₃를 구하라.</summary>

**답:** $$x_1 = 1.5$$, $$x_2 = \frac{17}{12} \approx 1.41667$$, $$x_3 = \frac{577}{408} \approx 1.4142157$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 뉴턴 방법의 갱신식 x − f(x)/f′(x)가 하는 일을 한 문장으로 설명하라.</summary>

**답:** 지금 점에서 곡선을 접선으로 바꾸고, 그 접선이 0이 되는 곳으로 옮겨 간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 뉴턴 방법이 근에 수렴하지 않고 맴도는 예를 들고, 이런 실패에 대비해 구현에 무엇을 넣어야 하는지 쓰라.</summary>

**답:** $$f(x) = x^3 - 2x + 2$$를 $$x_0 = 0$$에서 시작하면 $$0, 1, 0, 1, \dots$$로 맴돈다. 최대 반복 횟수를 두고, 기울기가 0이면 멈추며, 필요하면 이분법으로 근을 가둔 구간 안에서만 뉴턴 걸음을 받아들인다.

</details>


[^1]: OpenStax, *Calculus Volume 1*, 4.2절 "Linear Approximations and Differentials"
[^2]: OpenStax, *Calculus Volume 1*, 4.9절 "Newton's Method"(실패하는 경우 포함)
[^s1]: 에이전트 보충. "빠른 역제곱근"(fast inverse square root)은 게임 Quake III Arena의 소스 코드로 알려진 기법이다.
{% endraw %}
