---
layout: "note"
title: "생성함수"
display_title: "생성함수 (Generating Functions)"
kind: "concept"
kind_label: "기법"
num: "22"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Generating Function", "생성함수", "형식적 멱급수", "formal power series", "합성곱", "convolution", "보통 생성함수", "ordinary generating function"]
description: "수열 a₀, a₁, a₂, …을 다항식(멱급수) a₀ + a₁x + a₂x² + …의 계수로 싣는 방법이다. 그러면 수열의 셈 규칙과 점화식이 다항식의 곱셈·나눗셈이 되어, 대수 계산으로 답을 얻는다. 주사위 합의 경우의 수, 동전으로 금액 만들기가 다항식을 곱해 계수를 읽는 일로…"
prev_url: "/studies/discrete-math/linear-recurrences/"
prev_title: "선형 점화식"
next_url: "/studies/discrete-math/sums-asymptotics/"
next_title: "합의 계산과 어림"
math: true
mermaid: false
code_count: 1
permalink: "/studies/discrete-math/generating-functions/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

수열 a₀, a₁, a₂, …을 다항식(멱급수) a₀ + a₁x + a₂x² + …의 계수로 싣는 방법이다. 그러면 수열의 셈 규칙과 점화식이 다항식의 곱셈·나눗셈이 되어, 대수 계산으로 답을 얻는다. 주사위 합의 경우의 수, 동전으로 금액 만들기가 다항식을 곱해 계수를 읽는 일로 바뀐다. x에 실제 값을 넣는 것이 아니라 계수를 담는 그릇으로 쓰므로, 무한합이 수렴하는지는 대개 따지지 않는다.

</div>


## 예시로 보기

주사위 하나를 $$x + x^2 + \cdots + x^6$$으로 적는다. 지수가 눈, 계수가 그 눈이 나오는 방법의 수(모두 1)다. 두 개를 던진 결과는 곱이다.

$$(x + x^2 + \cdots + x^6)^2 = x^2 + 2x^3 + 3x^4 + 4x^5 + 5x^6 + 6x^7 + 5x^8 + \cdots + x^{12}$$

$$x^7$$의 계수 6이 합이 7인 경우의 수다. 곱할 때 지수가 더해지므로, "두 주사위의 눈을 더한다"가 "다항식을 곱한다"로 바뀌었다. 수열 $$(0, 1, 1, 1, 1, 1, 1)$$이 아래 정의의 $$a_n$$, 다항식이 생성함수다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

수열 $$(a_n)$$의 (보통) **생성함수**는 $$G(x) = \sum_{n \ge 0} a_n x^n$$($$\sum$$은 차례로 모두 더한다는 기호)이다. $$x$$의 값이 아니라 계수를 다루는 형식적 멱급수로 본다[^1].

</div>


자주 쓰는 짝이다. 왼쪽을 알면 오른쪽의 계수가 바로 나온다.

| 생성함수 | 수열 $$a_n$$ | 근거 |
|---|---|---|
| $$\dfrac{1}{1 - x}$$ | $$1, 1, 1, \dots$$ | [등비급수](/Hongs_Blog/studies/college-math/geometric-series/) |
| $$\dfrac{1}{1 - cx}$$ | $$c^n$$ | 등비급수에 $$cx$$ 대입 |
| $$(1 + x)^m$$ | $$\binom{m}{n}$$ | [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/) |
| $$\dfrac{1}{(1 - x)^k}$$ | $$\binom{n + k - 1}{k - 1}$$ | [중복조합](/Hongs_Blog/studies/discrete-math/multiset-counting/): $$k$$종류에서 $$n$$개 |

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">곱은 합성곱</div>

$$A(x) = \sum a_n x^n$$, $$B(x) = \sum b_n x^n$$이면 $$A(x)B(x)$$의 $$x^n$$ 계수는 $$\sum_{i=0}^{n} a_i b_{n-i}$$이다(합성곱).

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명</summary>

곱을 전개하면 $$a_i x^i \cdot b_j x^j$$ 항들의 합이고, $$x^n$$이 되는 것은 $$i + j = n$$인 쌍이다. 셈으로 읽으면: $$A$$에서 $$i$$를, $$B$$에서 $$n - i$$를 가져와 합이 $$n$$이 되는 방법을 모두 센다. ∎

</details>


## 예제

**동전 바꾸기.** 1원·2원·5원 동전(개수 제한 없음)으로 10원을 만드는 방법의 수.

1. *동전마다 생성함수:* 1원은 $$1 + x + x^2 + \cdots = \frac{1}{1 - x}$$, 2원은 $$1 + x^2 + x^4 + \cdots = \frac{1}{1 - x^2}$$, 5원은 $$\frac{1}{1 - x^5}$$. 지수가 그 동전으로 낸 금액이다.
2. *곱하기:* 금액을 나눠 내는 방법이 곱의 계수가 된다. $$G(x) = \frac{1}{(1 - x)(1 - x^2)(1 - x^5)}$$.
3. *계수 읽기:* $$x^{10}$$의 계수는 10이다. 5원을 0개(2원 0~5개: 6가지), 1개(2원 0~2개: 3가지), 2개(1가지)로 나눠 세도 $$6 + 3 + 1 = 10$$이다.

**점화식 풀기.** 피보나치 $$F_n = F_{n-1} + F_{n-2}$$에 $$x^n$$을 곱해 더하면 $$G(x) = x + xG(x) + x^2 G(x)$$, 즉 $$G(x) = \frac{x}{1 - x - x^2}$$. 분모를 인수분해해 부분분수로 나누면 [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/)의 비네 공식이 다시 나온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 주사위 두 개의 합 분포, 동전 10가지(전수와 계수 비교), $$1/(1-x)^k$$의 계수, 피보나치와 $$3^n$$의 생성함수 전개, 무작위 다항식 500쌍에서 곱 = 합성곱 — [22_generating-functions_verify.py](/Hongs_Blog/studies/discrete-math/code/22_generating-functions_verify/)</div>

</div>


## 활용

- **확률 분포의 합.** 독립인 두 확률변수의 합의 분포는 두 분포의 합성곱이다. 주사위 예처럼 생성함수를 곱하면 된다([중심극한정리](/Hongs_Blog/studies/probability-statistics/clt/)).
- **다항식 곱셈과 FFT.** 큰 정수의 곱셈과 신호의 합성곱은 모두 "계수의 합성곱"이다. 직접 하면 $$O(n^2)$$이지만, 이산 푸리에 변환으로 바꿔 곱하면 $$O(n \log n)$$이다([이산 푸리에 변환과 FFT](/Hongs_Blog/studies/linear-algebra/dft/)).
- **셈 문제의 자동화.** "각 종류를 짝수 개만", "최대 3개까지" 같은 조건도 종류마다 알맞은 다항식을 골라 곱하면 된다.
- 알고리즘에서: 동전 바꾸기 예제의 계수는 동전 $$c$$원마다 금액 $$k$$를 작은 것부터 올리며 `dp[k] += dp[k - c]`를 한 바퀴 돌려 구하는데, 이 한 바퀴가 $$\frac{1}{1 - x^c}$$을 곱하는 일이다. 같은 표에서 더하기 대신 `min(dp[k], dp[k - c] + 1)`을 쓰면 [동적 계획법](/Hongs_Blog/studies/algorithms/dynamic-programming/)의 가장 적은 동전 수 문제가 된다. 양수 $$a_1, \dots, a_n$$ 중 몇 개를 골라 합이 $$t$$가 되는 수는 $$(1 + x^{a_1})\cdots(1 + x^{a_n})$$의 $$x^t$$ 계수라서, [백트래킹](/Hongs_Blog/studies/algorithms/recursion-backtracking/)으로 하나씩 고르며 세는 대신 인수를 하나씩 곱하며 $$x^t$$까지의 계수만 남기면 $$n \times t$$번쯤의 계산으로 끝난다.

## 연결

- 선수: [선형 점화식](/Hongs_Blog/studies/discrete-math/linear-recurrences/), [이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/)
- 같은 계산: [중복을 허용하는 셈](/Hongs_Blog/studies/discrete-math/multiset-counting/)의 별과 막대가 $$\frac{1}{(1-x)^k}$$의 계수다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 주사위 두 개를 던져 합이 7이 되는 경우의 수를 생성함수의 계수로 구하라.</summary>

**답:** $$(x + \cdots + x^6)^2$$의 $$x^7$$ 계수. $$x^i \cdot x^{7-i}$$에서 $$i = 1, \dots, 6$$이 모두 가능하므로 6.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (a) 수열 1, 3, 9, 27, …의 생성함수 (b) 1/(1 − x)³의 xⁿ 계수를 쓰라.</summary>

**답:** (a) $$\frac{1}{1 - 3x}$$. (b) $$\binom{n + 2}{2}$$. 세 종류에서 중복을 허용해 $$n$$개를 고르는 수다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 두 생성함수를 곱했을 때 계수가 "두 선택을 합쳐 합이 n이 되는 방법의 수"가 되는 이유를 설명하라.</summary>

**답:** 곱을 전개하면 첫째에서 $$x^i$$, 둘째에서 $$x^{n-i}$$를 골라 곱한 항들이 $$x^n$$을 만들고, 각 항의 계수는 두 선택 방법 수의 곱이다. 가능한 $$i$$마다 더하면 합이 $$n$$인 모든 조합을 센 것이다(합성곱).

</details>


[^1]: Lehman·Leighton·Meyer, *Mathematics for Computer Science*, 16장 "Generating Functions". Graham·Knuth·Patashnik, *Concrete Mathematics*, 7장 "Generating Functions".
{% endraw %}
