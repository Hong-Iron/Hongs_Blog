---
layout: "note"
title: "복소수"
display_title: "복소수 (Complex Numbers)"
kind: "concept"
kind_label: "정의"
num: "18"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Complex Numbers", "허수", "imaginary number", "허수 단위", "i", "실수부", "real part", "허수부", "imaginary part", "켤레복소수", "complex conjugate", "절댓값", "modulus", "복소평면", "complex plane"]
description: "제곱해서 −1이 되는 수를 하나 새로 들여와 만든 수의 체계다. 실수가 한 줄로 늘어선 수직선이라면, 복소수는 평면 위의 점이다. 이 확장 덕분에 모든 다항식이 근을 갖게 되고, 회전과 진동을 곱셈 하나로 다룰 수 있게 된다. 대신 복소수 사이에는 \"어느 쪽이 더 큰가\"라는 순서가…"
prev_url: "/studies/college-math/polar-parametric/"
prev_title: "극좌표와 매개변수 곡선"
next_url: "/studies/college-math/euler-formula/"
next_title: "복소수의 극형식과 오일러 공식"
math: true
mermaid: false
code_count: 1
permalink: "/studies/college-math/complex-numbers/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

제곱해서 −1이 되는 수를 하나 새로 들여와 만든 수의 체계다. 실수가 한 줄로 늘어선 수직선이라면, 복소수는 평면 위의 점이다. 이 확장 덕분에 모든 다항식이 근을 갖게 되고, 회전과 진동을 곱셈 하나로 다룰 수 있게 된다. 대신 복소수 사이에는 "어느 쪽이 더 큰가"라는 순서가 없다.

</div>


## 예시로 보기

$$x^2 + 2x + 5 = 0$$은 판별식이 $$4 - 20 = -16 < 0$$이라 실수 근이 없다. 제곱해서 $$-1$$이 되는 수 $$i$$를 허락하면 $$\sqrt{-16} = 4i$$이므로 근의 공식이 그대로 통한다.

$$x = \frac{-2 \pm 4i}{2} = -1 \pm 2i$$


$$-1 + 2i$$를 평면의 점 $$(-1, 2)$$로 그리면, 두 근은 가로축에 대해 대칭인 두 점이다. 가로축이 실수부, 세로축이 허수부다.

계산은 $$i^2 = -1$$만 기억하고 다항식처럼 한다.

$$(2 + 3i)(1 - i) = 2 - 2i + 3i - 3i^2 = 2 + i + 3 = 5 + i$$


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$i^2 = -1$$인 수 $$i$$(허수 단위)와 실수 $$a$$, $$b$$로 된 $$z = a + bi$$를 **복소수**라 하고, 그 집합을 $$\mathbb{C}$$로 쓴다[^1].
- 실수부 $$\operatorname{Re} z = a$$, 허수부 $$\operatorname{Im} z = b$$. $$b = 0$$이면 실수, $$a = 0$$이면 순허수다.
- 덧셈·곱셈: $$(a + bi) + (c + di) = (a + c) + (b + d)i$$, $$\ (a + bi)(c + di) = (ac - bd) + (ad + bc)i$$
- 켤레: $$\bar z = a - bi$$. 절댓값: $$\vert z\vert  = \sqrt{a^2 + b^2}$$ (원점까지의 거리). 둘 사이에 $$z\bar z = \vert z\vert ^2$$가 맞는다.
- 나눗셈: 분모의 켤레를 위아래에 곱해 분모를 실수로 만든다. $$\dfrac{z}{w} = \dfrac{z\bar w}{\vert w\vert ^2}$$ ($$w \ne 0$$)

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">켤레근</div>

계수가 모두 실수인 다항식 $$p$$에 대해 $$p(\bar z) = \overline{p(z)}$$다. 따라서 $$z$$가 근이면 $$\bar z$$도 근이다. 실수가 아닌 근은 켤레 쌍으로 나온다[^2].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

켤레는 덧셈과 곱셈을 보존한다: $$\overline{z + w} = \bar z + \bar w$$, $$\overline{zw} = \bar z\,\bar w$$ (정의대로 전개해 확인). 실수 $$c$$는 $$\bar c = c$$다. 그래서 $$\overline{\sum c_k z^k} = \sum c_k \bar z^k$$. $$p(z) = 0$$이면 $$p(\bar z) = \bar 0 = 0$$. ∎

</details>


**복소수에는 크기 순서가 없다.** 실수처럼 "양수끼리 곱하면 양수"인 순서를 매겼다고 하자. $$i > 0$$이면 $$i \cdot i = -1 > 0$$이라 모순이다. $$i < 0$$이면 $$-i > 0$$이고 $$(-i)(-i) = -1 > 0$$이라 역시 모순이다. 그래서 $$\vert z\vert $$로 크기를 비교할 수는 있어도 $$z$$ 자체의 대소는 없다.

## 예제

$$(1 + 2i)(3 - i)$$와 $$\dfrac{1 + 2i}{3 - i}$$를 계산한다.

1. *곱셈 전개:* $$3 - i + 6i - 2i^2 = 3 + 5i + 2 = 5 + 5i$$.
2. *나눗셈, 켤레 곱하기:* $$\dfrac{(1 + 2i)(3 + i)}{(3 - i)(3 + i)}$$.
3. *분자와 분모:* 분자 $$3 + i + 6i + 2i^2 = 1 + 7i$$, 분모 $$9 + 1 = 10$$.
4. *결과:* $$\dfrac{1 + 7i}{10} = 0.1 + 0.7i$$. 확인: $$(0.1 + 0.7i)(3 - i) = 0.3 - 0.1i + 2.1i + 0.7 = 1 + 2i$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 유리수 복소수로 정확히 계산한 곱·나눗셈·켤레, $$-1 \pm 2i$$, 실수 계수 다항식 2,000개에서 $$p(\bar z) = \overline{p(z)}$$, 오해의 $$-6$$ — [18_complex-numbers_verify.py](/Hongs_Blog/studies/college-math/code/18_complex-numbers_verify/)</div>

</div>


## 활용

- **파이썬.** 허수 단위를 공학 관례대로 `j`로 쓴다: `(1j)**2 == -1`, `abs(3+4j) == 5.0`. 음수의 제곱근은 `math.sqrt` 대신 `cmath.sqrt`를 쓴다.
- **신호와 회로.** 교류 회로와 신호 처리는 진폭과 위상을 복소수 하나로 묶어 계산한다(페이저). 푸리에 변환의 결과도 복소수다.
- **양자 컴퓨팅.** 큐비트의 상태는 복소수 진폭으로 적고, 절댓값의 제곱이 측정 확률이다[^s1].
- **다항식.** 복소수까지 허용하면 $$n$$차 다항식은 중복을 세어 근이 정확히 $$n$$개다([다항식과 방정식](/Hongs_Blog/studies/college-math/polynomial/)의 대수학의 기본정리). 행렬의 고윳값이 복소수로 나오는 것도 이 때문이다([고윳값과 고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/)).

## 연결

- 선수: [다항식과 방정식](/Hongs_Blog/studies/college-math/polynomial/)
- 이어지는 개념: [복소수의 극형식과 오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)(복소수를 거리와 각으로 보기)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"√(−4) · √(−9) = √36 = 6"</div>

틀렸다. 실수에서 $$\sqrt{a}\sqrt{b} = \sqrt{ab}$$를 써 왔으니 음수에도 될 것 같다. 이 규칙은 $$a, b \ge 0$$일 때만 맞는다. 실제로 $$\sqrt{-4} = 2i$$, $$\sqrt{-9} = 3i$$이므로 곱은 $$6i^2 = -6$$이다. 음수의 제곱근은 먼저 $$i$$를 꺼내서 계산하면 틀리지 않는다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (1 + 2i)(3 − i)와 (1 + 2i)/(3 − i)를 a + bi 꼴로 구하라.</summary>

**답:** $$5 + 5i$$와 $$\dfrac{1 + 7i}{10}$$.

**흔한 오답:** 나눗셈에서 분모의 켤레 대신 분모 자체를 곱하는 것. 켤레를 곱해야 분모가 실수 $$\vert w\vert ^2$$가 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 계수가 실수인 이차방정식이 실수가 아닌 근을 가지면 두 근은 왜 서로 켤레인가?</summary>

**답:** 켤레가 덧셈과 곱셈을 보존하고 실수 계수는 켤레를 취해도 그대로라서 $$p(\bar z) = \overline{p(z)}$$다. $$p(z) = 0$$이면 $$p(\bar z) = 0$$이므로 $$\bar z$$도 근이다. 근의 공식으로 보면 $$\pm\sqrt{D}$$의 $$\pm$$가 켤레를 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 실수에서 쓰는 규칙 √a·√b = √(ab)가 복소수에서 깨지는 예를 들라.</summary>

**답:** $$\sqrt{-4}\sqrt{-9} = (2i)(3i) = -6$$인데 $$\sqrt{(-4)(-9)} = \sqrt{36} = 6$$이다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 3.1절 "Complex Numbers"
[^2]: OpenStax, *Precalculus 2e*, 3.6절 "Zeros of Polynomial Functions"(켤레근 정리)
[^s1]: 에이전트 보충. 큐비트 상태 $$\alpha\vert 0\rangle + \beta\vert 1\rangle$$에서 $$\vert \alpha\vert ^2 + \vert \beta\vert ^2 = 1$$이고 $$\vert \alpha\vert ^2$$가 0을 측정할 확률이라는 것은 양자 계산의 표준 서술이다(Nielsen & Chuang, *Quantum Computation and Quantum Information*, 1.2절).
{% endraw %}
