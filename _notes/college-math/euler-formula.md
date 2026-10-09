---
layout: "note"
title: "복소수의 극형식과 오일러 공식"
display_title: "복소수의 극형식과 오일러 공식 (Polar Form and Euler's Formula)"
kind: "concept"
kind_label: "정리"
num: "19"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Euler's Formula", "Polar Form of Complex Numbers", "오일러 공식", "극형식", "편각", "argument", "arg", "드무아브르 공식", "De Moivre's theorem", "1의 거듭제곱근", "roots of unity", "오일러 항등식", "Euler's identity"]
description: "복소수를 (원점까지의 거리, 방향각)으로 적으면, 곱셈이 \"거리끼리 곱하고 각끼리 더하기\"가 된다. 즉 복소수를 곱하는 것은 평면에서 늘리고 돌리는 것이다. 오일러 공식은 이 회전을 지수함수 모양으로 적어, 삼각함수의 덧셈정리를 지수법칙 하나로 대신하게 한다. 다만 허수 지수는 \"…"
prev_url: "/studies/college-math/complex-numbers/"
prev_title: "복소수"
next_url: "/studies/college-math/sequences-sigma/"
next_title: "수열과 합의 기호"
math: true
mermaid: false
code_count: 2
permalink: "/studies/college-math/euler-formula/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

복소수를 (원점까지의 거리, 방향각)으로 적으면, 곱셈이 "거리끼리 곱하고 각끼리 더하기"가 된다. 즉 복소수를 곱하는 것은 평면에서 늘리고 돌리는 것이다. 오일러 공식은 이 회전을 지수함수 모양으로 적어, 삼각함수의 덧셈정리를 지수법칙 하나로 대신하게 한다. 다만 허수 지수는 "몇 번 곱하기"로 읽을 수 없으므로 정의로 받아들이고 성질로 정당화해야 한다.

</div>


## 예시로 보기

1에 $$i$$를 거듭 곱하면 $$1 \to i \to -1 \to -i \to 1$$이다. 평면에서 $$(1, 0) \to (0, 1) \to (-1, 0) \to (0, -1)$$로, 매번 90°씩 돈다. $$i$$는 거리 1, 각 $$\pi/2$$인 복소수이고, 곱할 때마다 각 $$\pi/2$$가 더해진다.

$$1 + i$$는 거리 $$\sqrt2$$, 각 $$\pi/4$$다. 여덟 번 곱하면 거리는 $$(\sqrt2)^8 = 16$$, 각은 $$8 \times \pi/4 = 2\pi$$(한 바퀴)다. 그래서 $$(1 + i)^8 = 16$$이다. 전개하면 항이 아홉 개지만, 극형식으로는 한 줄이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/19_euler-formula_fig1.svg" alt="그림" loading="lazy">

점이 $$k = 0$$부터 $$k = 8$$까지 한 번에 45°씩 돌면서 원점에서 $$\sqrt2$$배씩 멀어진다. 여덟 번이면 한 바퀴를 돌아 가로축 위의 16에 닿는다[^s2].

복소수의 거리가 아래 정의의 $$r$$, 방향각이 $$\theta$$다. 복소수를 극좌표의 점 $$(r, \theta)$$로 보는 것과 같다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

0이 아닌 복소수 $$z = a + bi$$는 $$r = \vert z\vert $$와 방향각 $$\theta$$로

$$z = r(\cos\theta + i\sin\theta)$$

처럼 쓸 수 있다. 이것을 극형식, $$\theta$$를 편각 $$\arg z$$라 한다[^1]. $$\theta$$는 $$2\pi$$의 정수배만큼 여러 값이 가능하고, $$(-\pi, \pi]$$에서 고른 것을 주값이라 한다(파이썬 `cmath.phase`).

**오일러 공식.** 실수 $$\theta$$에 대해 $$e^{i\theta} = \cos\theta + i\sin\theta$$로 정한다. 그러면 $$z = re^{i\theta}$$다.

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. **곱과 몫:** $$z_1 = r_1 e^{i\theta_1}$$, $$z_2 = r_2 e^{i\theta_2}$$이면 $$z_1 z_2 = r_1 r_2\, e^{i(\theta_1 + \theta_2)}$$, $$\ \dfrac{z_1}{z_2} = \dfrac{r_1}{r_2}\,e^{i(\theta_1 - \theta_2)}$$ ($$z_2 \ne 0$$)
2. **드무아브르:** 정수 $$n$$에 대해 $$(\cos\theta + i\sin\theta)^n = \cos n\theta + i\sin n\theta$$
3. **1의 $$n$$제곱근:** $$z^n = 1$$의 해는 $$\omega_k = e^{2\pi i k/n}$$ ($$k = 0, 1, \dots, n - 1$$) $$n$$개이고, $$n \ge 2$$이면 $$\sum_{k=0}^{n-1}\omega_k = 0$$($$\sum$$은 차례로 모두 더한다는 기호)
4. $$\cos\theta = \dfrac{e^{i\theta} + e^{-i\theta}}{2}$$, $$\ \sin\theta = \dfrac{e^{i\theta} - e^{-i\theta}}{2i}$$. 특히 $$e^{i\pi} + 1 = 0$$.

</div>


**가정과 그 필요성.**
- 드무아브르는 **정수** $$n$$에서만 맞는다. $$1 = e^{i \cdot 0} = e^{i \cdot 2\pi}$$인데 둘 다 $$\frac12$$제곱하면 $$e^{0} = 1$$과 $$e^{i\pi} = -1$$로 갈린다. 분수 지수에서는 편각을 어떻게 적느냐에 따라 답이 달라진다.
- "편각은 더해진다"는 **$$2\pi$$의 배수를 무시할 때만** 맞다. 주값끼리 더하면 범위를 벗어날 수 있다. $$\arg(-1) = \pi$$인데 $$(-1)(-1) = 1$$의 주값은 $$0$$이지 $$2\pi$$가 아니다.
- 1의 제곱근의 합이 0이려면 $$n \ge 2$$여야 한다. $$n = 1$$이면 근은 1 하나라 합이 1이다.

**오일러 공식을 받아들이는 근거.** 정의이지만 멋대로 고른 것이 아니다.
- 지수법칙을 지킨다: $$e^{i\alpha}e^{i\beta} = e^{i(\alpha + \beta)}$$는 정리 1이 곧 덧셈정리이기 때문이다.
- 실수 지수의 극한 정의와 맞는다: $$\left(1 + \frac{i\theta}{n}\right)^n$$은 $$n$$이 커지면 $$\cos\theta + i\sin\theta$$에 다가간다(검증 코드로 확인. 증명은 [테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/)).

## 증명

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *곱:* $$r_1 r_2(\cos\theta_1 + i\sin\theta_1)(\cos\theta_2 + i\sin\theta_2)$$을 전개하면 실수부 $$\cos\theta_1\cos\theta_2 - \sin\theta_1\sin\theta_2$$, 허수부 $$\sin\theta_1\cos\theta_2 + \cos\theta_1\sin\theta_2$$다. [덧셈정리](/Hongs_Blog/studies/college-math/trig-identities/)로 각각 $$\cos(\theta_1 + \theta_2)$$, $$\sin(\theta_1 + \theta_2)$$다. 몫은 $$z_2 \cdot \frac{r_1}{r_2}e^{i(\theta_1 - \theta_2)} = z_1$$임을 곱의 결과로 확인한다.
2. *드무아브르:* 양의 정수 $$n$$은 1을 $$n - 1$$번 되풀이 적용한다. $$n = 0$$은 $$1 = 1$$. 음의 정수는 $$e^{-i\theta} = 1/e^{i\theta}$$(몫)에서 나온다.
3. *1의 제곱근:* 드무아브르로 $$\omega_k^n = e^{2\pi i k} = 1$$. $$\vert z\vert ^n = 1$$이므로 모든 해의 거리는 1이고, 각 $$n\theta$$가 $$2\pi$$의 배수여야 하므로 $$\theta = 2\pi k / n$$. 서로 다른 것은 $$k = 0, \dots, n - 1$$의 $$n$$개다. 합 $$S$$에 $$\omega_1 \ne 1$$을 곱하면 각 항이 다음 항으로 옮겨 가 $$\omega_1 S = S$$이므로 $$S = 0$$이다.
4. $$e^{\pm i\theta} = \cos\theta \pm i\sin\theta$$를 더하고 빼서 푼다. $$\theta = \pi$$를 넣으면 $$e^{i\pi} = -1$$. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 증명 1에서 "실수부가 cos(θ₁ + θ₂)"가 되는 근거는?</summary>

$$\cos\theta_1\cos\theta_2 - \sin\theta_1\sin\theta_2$$가 코사인의 덧셈정리 오른쪽과 같다. $$i \cdot i = -1$$이 빼기 부호를 만든다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 증명 3에서 ω₁S = S이면 왜 S = 0인가?</summary>

$$(\omega_1 - 1)S = 0$$이고 $$n \ge 2$$이면 $$\omega_1 \ne 1$$이므로 양변을 $$\omega_1 - 1$$로 나눌 수 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 정리의 핵심 아이디어는?</summary>

곱셈을 "크기는 곱하고 각은 더한다"로 보면, 곱셈의 문제가 각의 덧셈 문제가 된다. 로그가 곱을 합으로 바꾸는 것과 같은 모양이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 아이디어를 쓰는 다른 상황은?</summary>

[로그](/Hongs_Blog/studies/college-math/logarithm/)는 양수의 곱을 합으로 바꾼다. 선형대수학의 회전 행렬은 각을 더하는 곱셈이다([덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬](/Hongs_Blog/studies/linear-algebra/rotation-bridge/)). FFT는 1의 제곱근을 곱하며 각을 돌려 계산한다.

</details>


## 예제

**거듭제곱.** $$(1 + \sqrt3 i)^6$$을 구한다.

1. *극형식으로:* $$r = \sqrt{1 + 3} = 2$$, $$\theta = \frac{\pi}{3}$$.
2. *드무아브르:* $$2^6 e^{i \cdot 6\pi/3} = 64 e^{2\pi i}$$.
3. *되돌리기:* $$e^{2\pi i} = 1$$이므로 $$64$$.

**1의 세제곱근.** $$\omega_k = e^{2\pi i k/3}$$에서 $$1$$, $$-\frac12 + \frac{\sqrt3}{2}i$$, $$-\frac12 - \frac{\sqrt3}{2}i$$. 단위원을 셋으로 나눈 점이고, 합은 0이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/college-math/19_euler-formula_fig2.svg" alt="그림" loading="lazy">

1의 세제곱근은 단위원을 셋으로, 다섯제곱근은 다섯으로 똑같이 나눈 점이다. 원점에서 각 점으로 가는 화살표를 끝과 끝을 이어 모두 붙이면 제자리로 돌아오므로 합이 0이다[^s2].

**삼각함수 공식 끌어내기.** $$(\cos\theta + i\sin\theta)^3 = \cos 3\theta + i\sin 3\theta$$의 왼쪽을 전개해 실수부를 비교하면 $$\cos 3\theta = \cos^3\theta - 3\cos\theta\sin^2\theta = 4\cos^3\theta - 3\cos\theta$$다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 곱의 성질(무작위 5,000쌍), 예제의 거듭제곱, $$(1 + i\theta/n)^n$$의 극한, $$e^{i\pi} + 1$$, $$n = 2..49$$의 1의 제곱근 합, 삼중각 공식, 편각과 분수 지수의 반례 — [19_euler-formula_verify.py](/Hongs_Blog/studies/college-math/code/19_euler-formula_verify/)</div>

</div>


## 활용

- **FFT.** 이산 푸리에 변환은 1의 $$n$$제곱근 $$e^{-2\pi i k/n}$$을 곱해 더한다. 단위원 위의 대칭 덕분에 계산을 절반씩 나눠 $$O(n \log n)$$으로 줄인다([이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/))[^2].
- **페이저.** 사인파 $$A\cos(\omega t + \varphi)$$를 $$\operatorname{Re}(Ae^{i\varphi}e^{i\omega t})$$로 쓰면, 같은 주파수의 [사인파](/Hongs_Blog/studies/college-math/sinusoid/)를 더하는 일이 복소수 $$Ae^{i\varphi}$$끼리 더하는 일이 된다.
- **2D 회전.** 점 $$(x, y)$$를 $$\theta$$만큼 돌리는 것은 $$x + iy$$에 $$e^{i\theta}$$를 곱하는 것이다. 게임 엔진의 회전 누적, 그리고 3D의 쿼터니언이 이 생각을 넓힌 것이다[^s1].
- **파이썬.** `cmath.exp(1j*math.pi)`는 `(-1+1.2246e-16j)`이다. 허수부의 작은 값은 `math.pi`의 오차다.
- 알고리즘에서: 두 방향 $$u$$, $$v$$를 복소수로 보면 $$u$$의 켤레에 $$v$$를 곱한 $$\bar u v$$의 편각은 $$u$$에서 $$v$$로 돈 각이고, 그 허수부가 [계산 기하 기초](/Hongs_Blog/studies/algorithms/geometry-ccw/)의 외적이다. 외적이 양수면 이 각이 $$0$$과 $$\pi$$ 사이라서 $$v$$가 $$u$$의 왼쪽에 있다. $$n \times n$$ 격자의 칸 $$(r, c)$$를 $$r + ci$$로 보면, [구현과 시뮬레이션](/Hongs_Blog/studies/algorithms/simulation/)의 시계 방향 90도 회전 $$(r, c) \to (c, n - 1 - r)$$은 $$-i$$를 곱해 $$(c, -r)$$을 얻은 뒤 열 쪽으로 $$n - 1$$칸 옮긴 것이다.

## 연결

- 선수: [복소수](/Hongs_Blog/studies/college-math/complex-numbers/), [극좌표](/Hongs_Blog/studies/college-math/polar-parametric/), [삼각함수 항등식](/Hongs_Blog/studies/college-math/trig-identities/), [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)
- 이어지는 곳: 선형대수학의 [덧셈정리 ↔ 복소수 곱 ↔ 회전 행렬](/Hongs_Blog/studies/linear-algebra/rotation-bridge/)과 [이산 푸리에 변환](/Hongs_Blog/studies/linear-algebra/dft/), 미분적분학의 [테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/)와 [푸리에 변환](/Hongs_Blog/studies/calculus/fourier-transform/)

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"$$e^{i\theta}$$는 $$e$$를 $$i\theta$$번 곱한 것이다"</div>

틀렸다. 실수 지수를 "몇 번 곱하기"로 배워서 같은 뜻일 것 같다. 하지만 "$$i$$번 곱하기"는 뜻이 없다. $$e^{i\theta}$$는 $$\cos\theta + i\sin\theta$$라는 **정의**이고, 이 정의가 지수법칙 $$e^{i\alpha}e^{i\beta} = e^{i(\alpha + \beta)}$$를 지키고 실수 지수의 극한 정의와 맞기 때문에 같은 기호를 쓴다. 그래서 크기가 늘 1이고($$\vert e^{i\theta}\vert  = 1$$), 실수 지수함수처럼 한없이 커지지 않고 원을 돈다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 극형식으로 쓴 두 복소수를 곱하면 크기와 편각은 각각 어떻게 되는가? 그 근거가 되는 정리는?</summary>

**답:** 크기는 곱해지고 편각은 더해진다($$2\pi$$ 배수를 무시하고). 곱을 전개하면 실수부와 허수부가 삼각함수의 덧셈정리 모양이 되기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (1 + i)⁸과 (1 + √3 i)⁶을 극형식으로 계산하라.</summary>

**답:** $$(\sqrt2 e^{i\pi/4})^8 = 16 e^{2\pi i} = 16$$. $$(2e^{i\pi/3})^6 = 64e^{2\pi i} = 64$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** z⁴ = 1의 해를 모두 쓰고, 그 합이 0인 이유를 설명하라.</summary>

**답:** $$1, i, -1, -i$$. 모두 거리 1이고 90°씩 떨어져 있다. 합을 $$S$$라 하면 $$iS$$는 각 항을 다음 항으로 옮긴 것이라 $$iS = S$$이고, $$i \ne 1$$이므로 $$S = 0$$이다. 그림으로는 정사각형의 꼭짓점 벡터들이 서로 상쇄된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** "arg(z₁z₂) = arg z₁ + arg z₂"를 주값으로 계산하면 틀리는 예를 들고, 올바르게 고쳐 쓰라.</summary>

**답:** $$z_1 = z_2 = -1$$이면 주값 $$\arg(-1) = \pi$$라 합은 $$2\pi$$인데 $$\arg(1) = 0$$이다. 올바른 진술은 "$$\arg(z_1 z_2) \equiv \arg z_1 + \arg z_2 \pmod{2\pi}$$", 즉 $$2\pi$$의 정수배를 무시하면 같다는 것이다.

</details>


[^1]: OpenStax, *Precalculus 2e*, 8.5절 "Polar Form of Complex Numbers"(극형식, 곱과 몫, 드무아브르 정리, $$n$$제곱근)
[^2]: Strang, *Introduction to Linear Algebra* 5판, 9.1절 "Complex Numbers"(오일러 공식, 1의 거듭제곱근). FFT는 같은 책 9.3절.
[^s1]: 에이전트 보충. 쿼터니언은 3차원 회전을 나타내는 수 체계로, 복소수 곱이 2차원 회전인 것을 넓힌 것이다. 게임 엔진의 회전 표현에 흔히 쓴다.
[^s2]: 에이전트 보충. 그림 두 장은 원본에 없다. [19_euler-formula_plot.py](/Hongs_Blog/studies/college-math/code/19_euler-formula_plot/)로 그렸고, 그림에 쓴 값($$(1 + i)^8 = 16$$, 한 번 곱할 때마다 거리가 $$\sqrt2$$배, 1의 세제곱근과 다섯제곱근의 합이 0)을 같은 코드로 확인했다.
{% endraw %}
