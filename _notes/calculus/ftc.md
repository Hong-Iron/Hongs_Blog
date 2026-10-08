---
layout: "note"
title: "미적분의 기본정리"
display_title: "미적분의 기본정리 (Fundamental Theorem of Calculus)"
kind: "concept"
kind_label: "정리"
num: "12"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Fundamental Theorem of Calculus", "FTC", "미적분학의 기본정리", "원시함수", "antiderivative", "부정적분", "indefinite integral", "누적 함수", "accumulation function", "적분의 평균값 정리", "누적합", "prefix sum"]
description: "물탱크의 물 양이 늘어나는 속도는 지금 수도꼭지에서 들어오는 양 그 자체다. 거꾸로, 한 시간 동안 들어온 물의 총량은 물 양의 처음과 끝 차이다. 이 두 문장이 미적분의 기본정리이고, \"잘게 나눠 더한 극한\"이던 적분을 \"미분하면 그 함수가 되는 함수(원시함수)의 양 끝 값 차이…"
prev_url: "/studies/calculus/riemann-integral/"
prev_title: "정적분과 리만 합"
next_url: "/studies/calculus/substitution/"
next_title: "치환적분"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/ftc/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

물탱크의 물 양이 늘어나는 속도는 지금 수도꼭지에서 들어오는 양 그 자체다. 거꾸로, 한 시간 동안 들어온 물의 총량은 물 양의 처음과 끝 차이다. 이 두 문장이 미적분의 기본정리이고, "잘게 나눠 더한 극한"이던 적분을 "미분하면 그 함수가 되는 함수(원시함수)의 양 끝 값 차이"로 바꿔 준다. 다만 적분하는 함수가 구간 전체에서 연속이어야 하고, 원시함수를 식으로 쓸 수 없는 함수도 많아 그때는 수치 적분을 쓴다.

</div>


## 예시로 보기

배열의 누적합(prefix sum)이 같은 구조다. 배열 $$a = [3, 1, 4, 1, 5]$$의 누적합은 $$S = [0, 3, 4, 8, 9, 14]$$이고, $$S[k]$$는 앞에서부터 $$k$$개를 더한 값이다.

- 누적합의 차이는 원래 값이다: $$S[3] - S[2] = 4 = a$$의 세 번째 값.
- 구간의 합은 누적합 두 값의 차이다: 두 번째부터 네 번째까지의 합 $$1 + 4 + 1 = 6 = S[4] - S[1]$$.

첫째 줄이 아래 정리의 1부(누적 함수를 미분하면 원래 함수), 둘째 줄이 2부(구간의 적분 = 원시함수의 차)다. 배열 $$a$$가 함수 $$f$$, 누적합 $$S$$가 $$F$$, "차이"가 도함수, "합"이 적분에 대응한다. 연속에서는 칸의 폭이 0으로 가는 극한이 붙는다.

## 정의

도함수가 $$f$$인 함수 $$F$$($$F' = f$$)를 $$f$$의 **원시함수**라 한다. $$f$$의 원시함수 전체를 $$\int f(x)\,dx = F(x) + C$$로 쓰고 부정적분이라 부른다. 원시함수끼리는 상수만 다르다([평균값 정리](/Hongs_Blog/studies/calculus/mean-value-theorem/)의 따름정리: 도함수가 0이면 상수)[^1].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">미적분의 기본정리</div>

$$f$$가 $$[a, b]$$에서 연속이라 하자.
1. $$F(x) = \int_a^x f(t)\,dt$$로 두면, $$F$$는 $$(a, b)$$에서 미분 가능하고 $$F'(x) = f(x)$$이다.
2. $$G$$가 $$[a, b]$$에서 $$f$$의 원시함수이면 $$\int_a^b f(x)\,dx = G(b) - G(a)$$이다. 이것을 $$\big[G(x)\big]_a^b$$로 쓴다.

</div>


$$\int_0^3 t^2\,dt$$는 $$G(t) = \frac{t^3}{3}$$으로 $$9 - 0 = 9$$다. [리만 합](/Hongs_Blog/studies/calculus/riemann-integral/)의 표가 다가가던 값이 한 줄로 나온다.

## 증명

2부는 망원 합과 평균값 정리로, 1부는 차분몫을 좁은 구간의 평균값으로 보는 방법으로 증명한다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 펼치기</summary>

**2부.** $$[a, b]$$의 아무 분할 $$a = x_0 < \cdots < x_n = b$$를 잡는다.
1. *망원 합:* $$G(b) - G(a) = \sum_{i=1}^{n}\big(G(x_i) - G(x_{i-1})\big)$$. 가운데 값이 지워진다.
2. *평균값 정리:* 칸마다 $$G(x_i) - G(x_{i-1}) = G'(c_i)\Delta x_i = f(c_i)\Delta x_i$$인 $$c_i \in (x_{i-1}, x_i)$$가 있다.
3. *리만 합:* 그래서 $$G(b) - G(a) = \sum f(c_i)\Delta x_i$$. 좌변은 분할과 무관한 수이고, 우변은 어떤 분할에서든 리만 합이다. $$f$$가 연속이라 적분 가능하므로 칸을 잘게 하면 우변은 $$\int_a^b f$$로 간다. 따라서 둘은 같다.

**1부.** $$x \in (a, b)$$와 작은 $$h \ne 0$$을 잡는다.

{: start="4"}
4. *차분몫 = 좁은 구간의 평균:* $$\frac{F(x + h) - F(x)}{h} = \frac1h\int_x^{x+h} f(t)\,dt$$(구간을 나눠 더하는 성질).
5. *평균값이 실제로 나오는 점:* $$f$$는 $$x$$와 $$x + h$$ 사이의 닫힌 구간에서 최솟값 $$m_h$$, 최댓값 $$M_h$$를 가지고, 평균은 그 사이에 있다. [사잇값 정리](/Hongs_Blog/studies/calculus/continuity/)로 평균과 같은 값 $$f(c_h)$$가 그 구간 안의 점 $$c_h$$에서 나온다.
6. *극한:* $$h \to 0$$이면 $$c_h \to x$$이고, $$f$$가 연속이라 $$f(c_h) \to f(x)$$. ∎

</details>


### 스스로 설명해 보기

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">1. 2부의 3단계에서 "좌변은 분할과 무관"이 왜 중요한가?</summary>

우변의 리만 합은 분할마다 다른 $$c_i$$로 만들어지지만, 모두 같은 수 $$G(b) - G(a)$$와 같다. 그래서 칸을 잘게 하는 극한을 취해도 값이 변하지 않고, 그 극한이 곧 적분이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">2. 1부의 5단계에 사잇값 정리가 필요한 이유는?</summary>

평균 $$\frac1h\int_x^{x+h}f$$는 최솟값과 최댓값 사이의 **어떤 수**일 뿐이다. 그 수가 $$f$$의 **실제 값**이 되는 점이 있어야 6단계에서 연속성을 쓸 수 있다. 연속함수는 사이의 값을 모두 지나므로 그런 점이 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">이 증명의 핵심 아이디어는?</summary>

차이의 합은 끝값의 차이(망원 합)이고, 칸마다의 차이는 평균값 정리로 "기울기 × 폭"이 된다. 그래서 "원시함수의 차 = 기울기 × 폭의 합 = 리만 합"이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">같은 구조를 쓰는 다른 상황은?</summary>

이산에서는 누적합: $$\sum_{i=l}^{r} a_i = S[r] - S[l - 1]$$. 2차원 누적합으로 직사각형 구간의 합을 네 값으로 구하는 것도 같은 생각이다.

</details>


## 가정이 필요한 이유

| 가정 | 없으면 | 예 |
|---|---|---|
| 1부: $$f$$가 연속 | $$F$$가 미분 불가능하거나 $$F' \ne f$$인 점이 생긴다 | $$f(t) = 0$$ ($$t < 0$$), $$1$$ ($$t \ge 0$$)을 $$[-1, 1]$$에서 적분하면 $$F(x) = \max(x, 0)$$이 $$x = 0$$에서 꺾여 미분 불가능 |
| 2부: $$G' = f$$가 구간 **전체**에서 성립 | 틀린 값이 나온다 | $$\int_{-1}^{1}\frac{1}{x^2}\,dx$$에 $$G = -\frac1x$$를 대입하면 $$-2$$. 하지만 $$x = 0$$에서 $$G$$가 정의되지 않고 적분은 발산한다(아래 오해) |

**대우.** 1부의 대우: $$F$$가 어떤 점에서 미분 불가능하면, $$f$$는 그 점에서 연속이 아니다. 위 계단 함수가 그 예다.

## 예제

$$\frac{d}{dx}\int_1^{x^2}\frac{\sin t}{t}\,dt$$를 구한다.

1. *바깥과 안쪽:* $$H(u) = \int_1^{u}\frac{\sin t}{t}dt$$라 하면 구하는 것은 $$H(x^2)$$의 도함수다.
2. *1부:* $$H'(u) = \frac{\sin u}{u}$$.
3. *[연쇄 법칙](/Hongs_Blog/studies/calculus/chain-rule/):* $$H'(x^2)\cdot 2x = \frac{\sin x^2}{x^2}\cdot 2x = \frac{2\sin x^2}{x}$$.

$$\frac{\sin t}{t}$$의 원시함수는 기본 함수로 쓸 수 없지만, 1부 덕분에 도함수는 바로 나온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 누적합 예시, $$\int_0^3 t^2 = 9$$와 여러 다항식·지수·삼각 함수에서 수치 적분 = 원시함수의 차, 누적 함수의 수치 미분 = $$f$$, 예제의 도함수(수치 적분 후 수치 미분), 계단 함수의 꺾임, $$1/x^2$$의 리만 합이 한없이 커짐 — [12_ftc_verify.py](/Hongs_Blog/studies/calculus/code/12_ftc_verify/)</div>

</div>


## 활용

- **적분 계산의 기본.** 원시함수표($$x^n$$, $$e^x$$, $$\sin x$$, $$\frac1x$$ 등)를 [미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/)을 거꾸로 읽어 만든다. $$\int \frac1x dx = \ln\vert x\vert  + C$$이고, 이것으로 $$\ln x = \int_1^x \frac1t dt$$를 로그의 정의로 삼기도 한다.
- **누적합과 구간 합 질의.** 배열을 한 번 훑어 누적합을 만들면 어떤 구간의 합도 $$O(1)$$에 답한다. 이미지 처리의 적분 영상(integral image)도 2차원 누적합이다[^s1].
- **변화량과 순변화.** 속도를 적분하면 위치의 변화, 유입률을 적분하면 누적량의 변화다(순변화 정리)[^1].
- 알고리즘에서: 누적 합을 만드는 코드와 2차원 누적 합, 구간 더하기를 양 끝 표시로 바꾸는 차분 배열은 [누적 합과 차분 배열](/Hongs_Blog/studies/algorithms/prefix-sum/)에 있다. [광고 삽입](/Hongs_Blog/studies/algorithms/pg72414/)은 1초마다 보는 사람 수를 쌓아 두고, 광고 구간의 총 재생 시간을 누적값 두 개의 차로 구한다(2부). [파괴되지 않은 건물](/Hongs_Blog/studies/algorithms/pg92344/)은 직사각형마다 모서리 네 칸에만 변화량을 적고, 마지막에 가로·세로로 한 번씩 누적해 칸마다의 값을 되찾는다.

## 연결

- 선수: [정적분과 리만 합](/Hongs_Blog/studies/calculus/riemann-integral/), [평균값 정리](/Hongs_Blog/studies/calculus/mean-value-theorem/)
- 이 정리로 만드는 기법: [치환적분](/Hongs_Blog/studies/calculus/substitution/)(연쇄 법칙의 역), [부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/)(곱의 법칙의 역)
- 이산판: [합 ↔ 적분](/Hongs_Blog/studies/calculus/sum-integral-bounds/)에서 차분·누적합과 미분·적분을 나란히 비교한다.

## 자주 하는 오해

<div class="callout callout-misconception" markdown="1">
<div class="callout-title" markdown="span">"원시함수를 찾아 끝값을 넣으면 언제나 정적분이다"</div>

틀렸다. 공식 $$G(b) - G(a)$$가 너무 편해 조건을 잊기 쉽다. $$\int_{-1}^{1}\frac{dx}{x^2}$$에 $$G(x) = -\frac1x$$를 넣으면 $$-1 - 1 = -2$$가 나온다. 하지만 적분하는 함수는 늘 양수라 음수가 나올 수 없다. 원인은 $$x = 0$$에서 $$\frac{1}{x^2}$$이 연속이 아니고 $$G$$도 정의되지 않는다는 것이다. 실제로 이 적분은 무한대로 발산한다([이상적분](/Hongs_Blog/studies/calculus/improper-integrals/)). 끝값을 넣기 전에 구간 안에 끊긴 점이 없는지 먼저 본다.

</div>


## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 미적분의 기본정리 1부와 2부를 가정까지 포함해 쓰라.</summary>

**답:** $$f$$가 $$[a, b]$$에서 연속일 때, (1) $$F(x) = \int_a^x f(t)dt$$는 미분 가능하고 $$F' = f$$. (2) $$G' = f$$인 $$G$$에 대해 $$\int_a^b f = G(b) - G(a)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\frac{d}{dx}\int_0^{x^3} e^{-t^2}\,dt$$를 구하라.</summary>

**답:** 1부와 연쇄 법칙으로 $$e^{-(x^3)^2}\cdot 3x^2 = 3x^2 e^{-x^6}$$.

**흔한 오답:** 연쇄 법칙의 $$3x^2$$을 빠뜨린 $$e^{-x^6}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$\int_{-1}^{1} \frac{dx}{x^2} = \left[-\frac1x\right]_{-1}^{1} = -2$$라는 계산의 잘못을 지적하라.</summary>

**답:** 2부는 $$f$$가 구간 전체에서 연속이고 $$G' = f$$가 구간 전체에서 맞아야 쓸 수 있다. $$\frac{1}{x^2}$$은 $$x = 0$$에서 정의되지 않는다. 양수 함수의 적분이 음수라는 것도 모순이다. 실제로는 발산한다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 배열의 누적합 S[k] = a₁ + ⋯ + a_k에 대한 두 사실을 미적분의 기본정리 1부·2부와 짝지어라.</summary>

**답:** $$S[k] - S[k-1] = a_k$$ ↔ 1부 $$F' = f$$(누적한 것의 변화율은 원래 값). $$\sum_{i=l}^{r} a_i = S[r] - S[l-1]$$ ↔ 2부 $$\int_a^b f = G(b) - G(a)$$(구간의 누적은 끝값의 차).

</details>


[^1]: OpenStax, *Calculus Volume 1*, 4.10절 "Antiderivatives", 5.3절 "The Fundamental Theorem of Calculus"(적분의 평균값 정리, 1부와 2부), 5.4절 "Integration Formulas and the Net Change Theorem".
[^s1]: 에이전트 보충. 2차원 누적합(합 영역 표, summed-area table)은 비올라–존스 얼굴 검출에서 "integral image"라는 이름으로 쓰였다. 누적합의 $$O(1)$$ 구간 질의와 누적합 예시는 12_ftc_verify.py에서 확인했다.
{% endraw %}
