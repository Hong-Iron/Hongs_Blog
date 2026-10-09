---
layout: "note"
title: "테일러 급수"
display_title: "테일러 급수 (Taylor Series)"
kind: "concept"
kind_label: "정리"
num: "18"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Taylor Series", "테일러 급수", "테일러 다항식", "Taylor polynomial", "매클로린 급수", "Maclaurin series", "테일러 정리", "Taylor's theorem", "나머지 항", "remainder", "거듭제곱 급수", "power series", "수렴 반지름", "radius of convergence"]
description: "한 점에서의 값, 기울기, 휘는 정도, … 를 차례로 맞춰 가며 함수를 다항식으로 흉내 내는 방법이다. 그 점 가까이에서는 몇 항만으로도 매우 정확하고, 오차가 얼마 이하인지 계산할 수 있어 계산기와 수학 라이브러리가 이 원리로 지수함수와 사인함수를 계산한다. 대신 그 점에서 멀어…"
prev_url: "/studies/calculus/series-convergence/"
prev_title: "급수의 수렴"
next_url: "/studies/calculus/partial-derivatives/"
next_title: "다변수 함수와 편미분"
math: true
mermaid: false
code_count: 3
permalink: "/studies/calculus/taylor-series/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

한 점에서의 값, 기울기, 휘는 정도, … 를 차례로 맞춰 가며 함수를 다항식으로 흉내 내는 방법이다. 그 점 가까이에서는 몇 항만으로도 매우 정확하고, 오차가 얼마 이하인지 계산할 수 있어 계산기와 수학 라이브러리가 이 원리로 지수함수와 사인함수를 계산한다. 대신 그 점에서 멀어질수록 오차가 커지고, 수렴하는 범위(수렴 반지름) 밖에서는 항을 아무리 늘려도 소용없다. 심지어 급수가 수렴해도 원래 함수와 다를 수 있다.

</div>


## 예시로 보기

$$x = 0$$ 근처에서 $$e^x$$를 다항식으로 흉내 낸다. $$e^x$$는 몇 번 미분해도 $$e^x$$이고 $$x = 0$$에서 값이 1이라, 값·기울기·휨·…을 모두 1로 맞추는 다항식은 $$1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots$$이다. $$x = 1$$을 넣어 $$e$$를 계산한다.

| 항의 차수 $$n$$ | $$\sum_{k=0}^{n}\frac{1}{k!}$$ | 오차 한계 $$\frac{3}{(n+1)!}$$ |
|---|---|---|
| 1 | 2 | 1.5 |
| 2 | 2.5 | 0.5 |
| 3 | 2.6667 | 0.125 |
| 5 | 2.71667 | 0.0042 |
| 10 | 2.7182818011 | $$7.5 \times 10^{-8}$$ |

참값 $$e = 2.718281828\ldots$$에 빠르게 다가간다. 같은 다항식을 $$x$$ 전체에 그려 보면, 차수를 올릴수록 $$e^x$$와 겹치는 구간이 0을 중심으로 넓어진다. 오차 한계는 아래의 나머지 공식에서 나온다. 기준점 0이 아래 정의의 $$a$$, 차수 $$n$$까지의 다항식이 $$T_n$$이다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/calculus/18_taylor-series_fig1.svg" alt="그림" loading="lazy">

굵은 회색 선이 $$e^x$$이고, 색 선이 $$T_1, T_2, T_3, T_5$$다. 0 가까이에서는 모두 붙어 있고, 0에서 멀어질수록 낮은 차수부터 떨어져 나간다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$f$$가 $$a$$에서 $$n$$번 미분 가능할 때, $$a$$에서의 $$n$$차 **테일러 다항식**은

$$T_n(x) = \sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x - a)^k = f(a) + f'(a)(x - a) + \frac{f''(a)}{2!}(x - a)^2 + \cdots$$

이다. $$n \to \infty$$로 늘린 급수가 **테일러 급수**, $$a = 0$$인 경우가 **매클로린 급수**다[^1].

</div>


$$T_n$$은 $$a$$에서 $$f$$와 값, 1계, …, $$n$$계 도함수가 모두 같은 유일한 $$n$$차 이하 다항식이다. $$\frac{1}{k!}$$은 $$(x - a)^k$$을 $$k$$번 미분하면 $$k!$$이 나오는 것을 상쇄한다. $$n = 1$$이면 [선형 근사](/Hongs_Blog/studies/calculus/linear-approx-newton/)다.

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">테일러 정리 (나머지 한계)</div>

$$f$$가 $$a$$와 $$x$$를 포함하는 구간에서 $$n + 1$$번 미분 가능하고 $$f^{(n+1)}$$이 연속이며, 그 구간에서 $$\vert f^{(n+1)}\vert  \le M$$이면

$$\vert f(x) - T_n(x)\vert  \le \frac{M\,\vert x - a\vert ^{n+1}}{(n + 1)!}.$$

나머지 $$R_n(x) = f(x) - T_n(x)$$가 $$n \to \infty$$에서 0으로 가는 $$x$$에서 테일러 급수는 $$f(x)$$와 같다.

</div>


| 함수 | 매클로린 급수 | $$f$$와 같아지는 범위 |
|---|---|---|
| $$e^x$$ | $$\sum_{k \ge 0}\frac{x^k}{k!}$$ | 모든 실수 |
| $$\sin x$$ | $$x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots$$ | 모든 실수 |
| $$\cos x$$ | $$1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots$$ | 모든 실수 |
| $$\frac{1}{1 - x}$$ | $$\sum_{k \ge 0} x^k$$ | $$-1 < x < 1$$ |
| $$\ln(1 + x)$$ | $$x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots$$ | $$-1 < x \le 1$$ |

거듭제곱 급수 $$\sum c_k x^k$$가 수렴하는 $$x$$는 $$\vert x\vert  < R$$인 구간(끝점은 따로 확인)이고, $$R$$을 **수렴 반지름**이라 한다. [비 판정](/Hongs_Blog/studies/calculus/series-convergence/)으로 구한다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/calculus/18_taylor-series_fig2.svg" alt="그림" loading="lazy">

$$\ln(1 + x)$$의 수렴 반지름은 1이다. 1 안쪽에서는 항을 늘릴수록 굵은 회색 선에 더 붙는다. 1 바깥에서는 항을 늘릴수록 오히려 더 빨리 벗어난다[^s2].

## 증명

미적분의 기본정리에서 출발해 부분적분을 되풀이하면 나머지가 적분 꼴로 나오고, 그것을 어림한다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

1. *출발(n = 0):* [기본정리](/Hongs_Blog/studies/calculus/ftc/)로 $$f(x) = f(a) + \int_a^x f'(t)\,dt$$. 즉 $$R_0(x) = \int_a^x f'(t)\,dt$$.
2. *주장:* $$R_n(x) = \int_a^x f^{(n+1)}(t)\,\frac{(x - t)^n}{n!}\,dt$$.
3. *귀납 단계:* $$R_{n-1}(x) = \int_a^x f^{(n)}(t)\frac{(x - t)^{n-1}}{(n-1)!}dt$$에 [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/)을 쓴다. $$u = f^{(n)}(t)$$, $$dv = \frac{(x - t)^{n-1}}{(n-1)!}dt$$, $$v = -\frac{(x - t)^n}{n!}$$이다.

$$R_{n-1}(x) = \left[-f^{(n)}(t)\frac{(x - t)^n}{n!}\right]_a^x + \int_a^x f^{(n+1)}(t)\frac{(x - t)^n}{n!}dt = \frac{f^{(n)}(a)}{n!}(x - a)^n + R_n(x).$$

첫 항이 $$T_n$$에 새로 붙는 항이라 $$f = T_{n-1} + R_{n-1} = T_n + R_n$$이다.

{: start="4"}
4. *한계:* $$\vert f^{(n+1)}\vert  \le M$$이면 $$\vert R_n(x)\vert  \le M\left\vert \int_a^x\frac{\vert x - t\vert ^n}{n!}dt\right\vert  = \frac{M\vert x - a\vert ^{n+1}}{(n+1)!}$$. ∎

적분의 평균값 정리를 한 번 더 쓰면 $$R_n(x) = \frac{f^{(n+1)}(c)}{(n+1)!}(x - a)^{n+1}$$인 $$c$$가 $$a$$와 $$x$$ 사이에 있다는 라그랑주 꼴이 나온다[^1].

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 3단계에서 대괄호 항이 $$\frac{f^{(n)}(a)}{n!}(x - a)^n$$만 남는 이유는?</summary>

$$t = x$$를 넣으면 $$(x - x)^n = 0$$이라 0이다. $$t = a$$를 넣으면 $$-f^{(n)}(a)\frac{(x - a)^n}{n!}$$이고, 빼면 부호가 바뀌어 $$+\frac{f^{(n)}(a)}{n!}(x - a)^n$$이 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. e^x의 테일러 급수가 모든 x에서 e^x와 같은 이유를 4단계로 설명하라.</summary>

$$0$$과 $$x$$ 사이에서 $$\vert f^{(n+1)}\vert  = e^t \le e^{\vert x\vert } = M$$이고 $$M$$은 $$n$$과 무관하다. $$\frac{\vert x\vert ^{n+1}}{(n+1)!}$$은 $$n$$이 커지면 0으로 간다(계승이 거듭제곱보다 빨리 자란다). 그래서 나머지가 0으로 간다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

"값 = 기준값 + 변화의 누적"을 되풀이 적용하되, 매번 부분적분으로 기준점의 정보를 한 항씩 꺼낸다. 남는 것은 늘 "다음 도함수 × 작은 가중치"의 적분이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 도구를 쓰는 다른 상황은?</summary>

수치 미분의 오차 분석이다. $$f(x + h) = f(x) + hf'(x) + \frac{h^2}{2}f''(c)$$에서 앞방향 차분의 오차가 $$h$$에 비례하고, 두 방향을 빼면 $$h^2$$ 항이 지워져 중앙 차분의 오차가 $$h^2$$에 비례한다([도함수](/Hongs_Blog/studies/calculus/derivative/)의 수치 미분 표).

</details>


## 가정이 필요한 이유

| 가정·조건 | 없으면 | 예 |
|---|---|---|
| 나머지가 0으로 간다 | 급수가 수렴해도 $$f$$와 다를 수 있다 | $$f(x) = e^{-1/x^2}$$ ($$f(0) = 0$$)은 0에서 모든 도함수가 0이라 매클로린 급수가 0이지만, $$x \ne 0$$에서 $$f(x) > 0$$ |
| 수렴 반지름 안 | 항을 늘려도 수렴하지 않는다 | $$\ln(1 + x)$$의 급수에 $$x = 2$$를 넣은 부분합: $$2, 0, 2.67, -1.33, 5.07, -5.6, \dots$$ |
| $$f^{(n+1)}$$이 있고 유계 | 오차가 $$\vert x - a\vert ^{n+1}$$의 상수배로 줄지 않는다 | $$\vert x\vert ^{3/2}$$의 0에서 1차 근사는 $$T_1 = 0$$이고, 오차 $$\vert x\vert ^{3/2}$$은 $$x^2$$보다 느리게 준다. $$f''$$이 0 근처에서 한없이 커진다 |

**역.** 거듭제곱 급수 $$\sum c_k(x - a)^k$$가 $$a$$ 근처에서 $$f$$와 같으면, 그 계수는 반드시 $$c_k = \frac{f^{(k)}(a)}{k!}$$이다(항별로 미분해 $$x = a$$를 넣는다)[^1]. 그래서 $$\frac{1}{1 - x^2} = \sum x^{2k}$$처럼 다른 방법으로 얻은 급수도 곧 테일러 급수다.

## 예제

**오일러 공식.** $$e^{i\theta} = \cos\theta + i\sin\theta$$를 급수로 보인다. 복소수에서는 $$e^z = \sum\frac{z^k}{k!}$$를 지수함수의 정의로 쓴다.

1. *대입:* $$e^{i\theta} = \sum_{k \ge 0}\frac{(i\theta)^k}{k!}$$.
2. *$$i$$의 거듭제곱:* $$i^k$$는 $$1, i, -1, -i$$를 되풀이한다.
3. *짝수·홀수 항 나누기:* 짝수 항은 $$1 - \frac{\theta^2}{2!} + \frac{\theta^4}{4!} - \cdots = \cos\theta$$, 홀수 항은 $$i\left(\theta - \frac{\theta^3}{3!} + \cdots\right) = i\sin\theta$$.
4. *결론:* 두 급수가 모든 $$\theta$$에서 절대수렴해 항을 나눠 더해도 된다. $$e^{i\theta} = \cos\theta + i\sin\theta$$. [오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/)의 증명이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표와 오차 한계, 카드 C2의 오차 $$0.00289 \le 0.0043$$, 표의 다섯 급수를 여러 $$x$$에서 부분합으로 비교, $$\ln(1 + x)$$의 $$x = 2$$ 발산, $$e^{-1/x^2}$$이 0 근처에서 어떤 $$x^n$$보다 빨리 0으로 감, 오일러 공식(복소수 부분합), 수치 미분 오차의 차수 — [18_taylor-series_verify.py](/Hongs_Blog/studies/calculus/code/18_taylor-series_verify/)</div>

</div>


## 활용

- **수학 라이브러리의 $$e^x$$.** $$x = k\ln 2 + r$$($$\vert r\vert  \le 0.35$$)로 나눠 $$e^x = 2^k e^r$$로 계산하면, $$e^r$$은 테일러 급수 15항 정도로 배정밀도 끝자리까지 맞는다. 구현: [18_taylor-series_impl.py](/Hongs_Blog/studies/calculus/code/18_taylor-series_impl/). 실제 라이브러리는 같은 구조에서 계수를 오차가 고르게 퍼지는 다항식(최소최대 근사)으로 바꿔 항 수를 더 줄인다[^s1].
- **작은 각 근사.** $$\sin\theta \approx \theta$$, $$\cos\theta \approx 1 - \frac{\theta^2}{2}$$. 게임 물리와 그래픽스에서 계산을 줄이고, 오차는 다음 항 $$\frac{\theta^3}{6}$$으로 가늠한다.
- **2차 근사와 최적화.** 한 점 근처에서 함수를 $$f(a) + f'(a)(x - a) + \frac{f''(a)}{2}(x - a)^2$$로 보고 그 포물선의 꼭짓점으로 가는 것이 최적화의 뉴턴 방법이다([헤세 행렬과 극값 판정](/Hongs_Blog/studies/calculus/hessian/)).
- **흔한 실수.** 기준점이 0이 아닌데 $$(x - a)^k$$ 대신 $$x^k$$을 쓰는 것. 나머지 한계의 $$M$$을 구간 전체가 아닌 기준점 한 곳에서만 재는 것.

## 연결

- 선수: [급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/), [미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/)
- 증명의 도구: [미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/), [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/)
- 1차의 경우: [선형 근사와 뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/)
- 쓰이는 곳: [오일러 공식](/Hongs_Blog/studies/college-math/euler-formula/), [지수함수](/Hongs_Blog/studies/college-math/exponential-function/)와 [삼각함수](/Hongs_Blog/studies/college-math/trig-functions/)의 급수 표현

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"항을 더 늘리면 어디서든 더 정확해진다"</div>

틀렸다. $$e^x$$와 $$\sin x$$가 모든 실수에서 수렴해 그렇게 믿기 쉽다. 하지만 $$\ln(1 + x)$$의 급수는 $$\vert x\vert  > 1$$이면 항 $$\frac{x^k}{k}$$ 자체가 커져서, $$x = 2$$에서 부분합이 $$2, 0, 2.67, -1.33, 5.07, \dots$$로 점점 크게 흔들린다. 수렴 반지름 안에서만 항을 늘리는 것이 도움이 된다. 반지름 밖의 값은 $$\ln 3 = \ln 4 - \ln\frac43$$처럼 식을 바꿔 반지름 안으로 가져와 계산한다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** e^x, sin x, cos x, 1/(1 − x)의 매클로린 급수와 성립 범위를 쓰라.</summary>

**답:** $$e^x = \sum\frac{x^k}{k!}$$, $$\sin x = \sum\frac{(-1)^k x^{2k+1}}{(2k+1)!}$$, $$\cos x = \sum\frac{(-1)^k x^{2k}}{(2k)!}$$는 모든 실수. $$\frac{1}{1 - x} = \sum x^k$$는 $$\vert x\vert  < 1$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$e^{0.5}$$를 3차 테일러 다항식(기준점 0)으로 어림하고 오차 한계를 구하라.</summary>

**답:** $$T_3(0.5) = 1 + 0.5 + 0.125 + 0.0208\overline{3} = 1.6458\overline{3}$$. $$[0, 0.5]$$에서 $$\vert f^{(4)}\vert  = e^t \le e^{0.5} < 1.65$$라 오차 $$\le \frac{1.65 \times 0.5^4}{24} \approx 0.0043$$. 실제 오차는 $$0.00289$$다.

**흔한 오답:** $$M$$을 $$e^0 = 1$$로 잡는 것. 구간 전체에서의 최댓값이어야 한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 테일러 급수가 모든 x에서 수렴하는데도 원래 함수와 다른 예를 들라.</summary>

**답:** $$f(x) = e^{-1/x^2}$$, $$f(0) = 0$$. 0에서의 모든 도함수가 0이라 매클로린 급수는 모든 $$x$$에서 0으로 수렴한다. 하지만 $$x \ne 0$$이면 $$f(x) > 0$$이다. 나머지 $$R_n(x) = f(x)$$가 0으로 가지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 1/(1 + x²)은 모든 실수에서 매끄러운데, 0에서의 테일러 급수가 \|x\| < 1에서만 수렴하는 이유를 설명하라.</summary>

**답:** 급수는 등비급수 $$\sum(-x^2)^k$$이고, 공비 $$-x^2$$의 크기가 1보다 작아야 수렴한다. $$\vert x\vert  \ge 1$$이면 항의 크기가 줄지 않는다. 더 깊은 이유는 복소수 $$x = \pm i$$에서 분모가 0이 되기 때문이다. 0에서 그 점까지의 거리 1이 수렴 반지름을 막는다[^s1].

</details>


[^1]: OpenStax, *Calculus Volume 2*, 6.1절 "Power Series and Functions"(수렴 반지름), 6.2절 "Properties of Power Series"(항별 미분, 계수의 유일성), 6.3절 "Taylor and Maclaurin Series"(테일러 정리와 나머지), 6.4절 "Working with Taylor Series".
[^s2]: 에이전트 보충. 그림 두 장은 원본에 없다. [18_taylor-series_plot.py](/Hongs_Blog/studies/calculus/code/18_taylor-series_plot/)로 그렸고, 그림에 쓴 값($$T_5(1) = 2.71667$$, $$x = 1.5$$에서 $$T_{20}$$이 $$T_5$$보다 더 벗어남)을 같은 코드로 확인했다.
[^s1]: 에이전트 보충. 수학 라이브러리의 범위 줄이기와 최소최대 다항식은 fdlibm 같은 공개 구현의 주석에 설명되어 있다. 수렴 반지름이 가장 가까운 복소 특이점까지의 거리라는 것은 복소해석의 결과로, 이 과목 범위 밖이다.
{% endraw %}
