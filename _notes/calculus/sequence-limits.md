---
layout: "note"
title: "수열의 극한과 e"
display_title: "수열의 극한과 e (Limits of Sequences)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Limit of a Sequence", "수열의 극한", "수렴", "convergence", "발산", "divergence", "단조 수렴 정리", "monotone convergence theorem", "자연상수 e", "수렴 속도", "rate of convergence", "조화수", "harmonic number"]
description: "수열이 뒤로 갈수록 어떤 값에 한없이 가까워지면 그 값에 수렴한다고 한다. \"커지기만 하는데 넘을 수 없는 벽이 있으면 반드시 어떤 값에 수렴한다\"는 사실로 (1 + 1/n)ⁿ이 한 값에 다가감을 알 수 있고, 그 값이 e다. 반복 알고리즘이 끝나는지, 오차가 얼마나 빨리 주는지를…"
prev_url: "/studies/calculus/continuity/"
prev_title: "연속과 사잇값 정리"
next_url: "/studies/calculus/derivative/"
next_title: "도함수"
math: true
mermaid: false
code_count: 2
permalink: "/studies/calculus/sequence-limits/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

수열이 뒤로 갈수록 어떤 값에 한없이 가까워지면 그 값에 수렴한다고 한다. "커지기만 하는데 넘을 수 없는 벽이 있으면 반드시 어떤 값에 수렴한다"는 사실로 (1 + 1/n)ⁿ이 한 값에 다가감을 알 수 있고, 그 값이 e다. 반복 알고리즘이 끝나는지, 오차가 얼마나 빨리 주는지를 이 언어로 말한다. 다만 이웃한 항의 차이가 0으로 줄어든다고 해서 수렴하는 것은 아니다.

</div>


## 예시로 보기

$$a_n = 1/n$$은 $$1, 0.5, 0.333, \dots$$로 0에 다가간다. "0에서 0.001 안으로 들어오는 것은 몇 번째부터인가?"에는 1001번째부터라고 답할 수 있다. 허용 오차를 0.000001로 줄여도 1,000,001번째부터라는 답이 있다. 어떤 허용 오차를 불러도 "그 뒤로는 늘 그 안"인 시점이 있다는 것이 수렴이다. 허용 오차가 아래 정의의 $$\varepsilon$$, 그 시점이 $$N$$이다.

$$(1 + 1/n)^n$$은 $$2, 2.25, 2.37, 2.44, \dots$$로 늘어나지만 3을 넘지 못한다. 계속 커지기만 하는데 넘지 못하는 벽이 있으니 어떤 값에 멈춰 다가가야 한다. 그 값이 $$e \approx 2.71828$$이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/calculus/03_sequence-limits_fig1.svg" alt="그림" loading="lazy">

점은 오른쪽으로 갈수록 오르기만 하고, 오르는 폭은 점점 줄어든다. 주황 선 3에는 닿지 못하고 초록 점선 $$e$$ 아래에 붙는다[^s1].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

수열 $$(a_n)$$이 $$L$$에 **수렴**한다는 것은

$$\forall \varepsilon > 0\ \exists N\ \forall n \ge N\ \ \vert a_n - L\vert  < \varepsilon$$

이라는 뜻이고 $$\lim_{n \to \infty} a_n = L$$로 쓴다. 수렴하지 않으면 **발산**한다고 한다. 한없이 커지거나($$\to \infty$$), 진동한다[^1].

</div>


극한 법칙(합·곱·몫)과 조임 정리는 [함수의 극한](/Hongs_Blog/studies/calculus/limits/)과 같이 맞는다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정리</div>

1. $$\vert r\vert  < 1$$이면 $$r^n \to 0$$. $$r = 1$$이면 1, $$\vert r\vert  > 1$$이거나 $$r = -1$$이면 발산한다.
2. **단조 수렴 정리:** 늘 증가(또는 늘 감소)하고 위(아래)로 유계인 수열은 수렴한다. [증명 생략: 실수의 완비성과 동치인 성질이다]
3. $$a_n = (1 + 1/n)^n$$은 증가하고 $$a_n < 3$$이다. 따라서 수렴하고, 그 극한을 $$e$$로 정한다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

1. $$0 < \vert r\vert  < 1$$이면 $$1/\vert r\vert  = 1 + h$$($$h > 0$$)로 쓸 수 있다. 베르누이 부등식(이산수학 귀납법 사다리)으로 $$(1 + h)^n \ge 1 + nh$$이므로 $$\vert r\vert ^n \le \frac{1}{1 + nh} \to 0$$.
3. [증명 스케치] 이항정리로 전개하면 $$a_n = \sum_{k=0}^{n}\frac{1}{k!}\left(1 - \frac1n\right)\cdots\left(1 - \frac{k-1}{n}\right)$$이다. $$n$$이 커지면 각 괄호가 커지고 항도 하나 늘어서 $$a_n$$이 증가한다. 또 각 항은 $$\frac{1}{k!} \le \frac{1}{2^{k-1}}$$ 이하라서 $$a_n < 1 + (1 + \frac12 + \frac14 + \cdots) = 3$$이다. ∎

</details>


## 예제

$$\lim_{n \to \infty}\frac{3n^2 + n}{n^2 + 5}$$를 구한다.

1. *가장 빨리 자라는 항으로 나누기:* 분자와 분모를 $$n^2$$으로 나누면 $$\frac{3 + 1/n}{1 + 5/n^2}$$.
2. *아는 극한 쓰기:* $$1/n \to 0$$, $$5/n^2 \to 0$$.
3. *극한 법칙:* $$\frac{3 + 0}{1 + 0} = 3$$.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$(1+1/n)^n$$이 증가하고 3 미만(유리수로 정확히 $$n \le 60$$, 실수로 $$n \le 2000$$), $$N = 1001$$, 예제와 $$0.9^n$$, 조화수가 한없이 커짐, 뉴턴 반복의 자릿수 두 배 — [03_sequence-limits_verify.py](/Hongs_Blog/studies/calculus/code/03_sequence-limits_verify/)</div>

</div>


## 활용

- **반복 알고리즘의 수렴.** 반복할 때마다 오차가 일정한 비율로 주면(선형 수렴) 한 번에 자릿수가 일정하게 늘고, 오차가 제곱으로 주면(이차 수렴) 맞는 자릿수가 두 배씩 는다. $$\sqrt2$$를 $$x \mapsto \frac12(x + 2/x)$$로 구하면 오차가 0.086, 0.0025, 2.1e−6, 1.6e−12로 이차 수렴한다([뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/)).
- **멈춤 조건.** 반복 알고리즘은 "이웃 값의 차가 충분히 작으면 멈춘다"를 흔히 쓴다. 아래 오해처럼 이것만으로 수렴이 보장되지는 않아서, 최대 반복 횟수를 함께 둔다.
- **$$e$$가 나오는 곳.** 연속 복리, 지수적 감쇠, 확률의 $$\left(1 - \frac1n\right)^n \to \frac1e$$(해시에서 한 칸이 끝까지 비어 있을 확률 등)가 모두 이 극한이다.

## 연결

- 선수: [극한](/Hongs_Blog/studies/calculus/limits/), [수열과 합의 기호](/Hongs_Blog/studies/college-math/sequences-sigma/), [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)
- 이어지는 개념: [급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/), [선형 근사와 뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/)
- [등비급수](/Hongs_Blog/studies/college-math/geometric-series/)의 "$$\vert r\vert  < 1$$이면 $$r^n \to 0$$"을 정리 1이 증명한다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"이웃한 항의 차가 0으로 가면 수열은 수렴한다"</div>

틀렸다. 걸음이 점점 작아지니 어딘가에 멈출 것 같다. 하지만 조화수 $$H_n = 1 + \frac12 + \cdots + \frac1n$$은 이웃 차 $$\frac{1}{n+1}$$이 0으로 가는데도 한없이 커진다. $$H_{2^k} \ge 1 + k/2$$라서 $$H_{65536} \ge 9$$이고, 걸음이 작아도 끝없이 쌓인다. 반복 알고리즘의 멈춤 조건으로 "변화량이 작다"만 쓰면 이런 수열에서 틀린 답에 멈출 수 있다.

</div>


<img class="note-fig" src="/Hongs_Blog/assets/notes/calculus/03_sequence-limits_fig2.svg" alt="그림" loading="lazy">

가로축이 로그 눈금이라, $$n$$을 10배 할 때마다 $$H_n$$이 비슷한 폭으로 계속 오른다. 주황 점은 $$n = 2^k$$일 때의 아래 한계 $$1 + k/2$$이고, 파란 선은 늘 그 위에 있다[^s1].

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 수열 aₙ이 L에 수렴한다는 것을 ε과 N으로 쓰라.</summary>

**답:** 모든 $$\varepsilon > 0$$에 대해 어떤 $$N$$이 있어, $$n \ge N$$인 모든 $$n$$에서 $$\vert a_n - L\vert  < \varepsilon$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (a) lim (3n² + n)/(n² + 5) (b) 0.9ⁿ < 0.001이 처음 맞는 n을 구하라.</summary>

**답:** (a) 3. (b) $$n > \frac{\ln 0.001}{\ln 0.9} \approx 65.6$$이므로 $$n = 66$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 이웃한 항의 차가 0으로 가는데 수렴하지 않는 수열을 들고, 왜 수렴하지 않는지 보여라.</summary>

**답:** 조화수 $$H_n$$. $$\frac13 + \frac14 \ge \frac12$$, $$\frac15 + \cdots + \frac18 \ge \frac12$$처럼 $$2^{k-1}$$개씩 묶으면 각 묶음이 $$\frac12$$ 이상이라 $$H_{2^k} \ge 1 + \frac{k}{2}$$이고, 한없이 커진다.

</details>


[^1]: OpenStax, *Calculus Volume 2*, 5.1절 "Sequences"(수열의 극한, 단조 수렴 정리)
[^s1]: 에이전트 보충. 그림 두 장은 원본에 없다. [03_sequence-limits_plot.py](/Hongs_Blog/studies/calculus/code/03_sequence-limits_plot/)로 그렸고, $$(1 + 1/n)^n$$이 $$n \le 40$$에서 증가하고 3 미만임(유리수로 정확히), $$H_{2^k} \ge 1 + k/2$$($$k \le 16$$), $$H_{65536} \ge 9$$를 같은 코드로 확인했다.
{% endraw %}
