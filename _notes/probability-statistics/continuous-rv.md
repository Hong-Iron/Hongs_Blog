---
layout: "note"
title: "연속 확률변수와 확률밀도"
display_title: "연속 확률변수와 확률밀도 (Continuous Random Variables and Densities)"
kind: "concept"
kind_label: "정의"
num: "14"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Continuous Random Variable", "연속 확률변수", "확률밀도함수", "PDF", "probability density function", "확률밀도", "density", "밀도의 변수변환", "change of variables for densities"]
description: "대기 시간이나 측정값처럼 값이 끊김 없이 이어지면, 딱 한 값이 나올 확률은 0이고 구간에 들어갈 확률만 의미가 있다. 그 확률을 곡선 아래 넓이로 주는 함수가 확률밀도다. 확률을 모래로 비유하면, 밀도는 각 지점에 쌓인 모래의 높이이고 구간의 확률은 그 구간 위 모래의 양이다. …"
prev_url: "/studies/probability-statistics/discrete-distributions-compared/"
prev_title: "이항·기하·포아송 비교"
next_url: "/studies/probability-statistics/uniform-exponential/"
next_title: "균등분포와 지수분포"
math: true
mermaid: false
code_count: 1
permalink: "/studies/probability-statistics/continuous-rv/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

대기 시간이나 측정값처럼 값이 끊김 없이 이어지면, 딱 한 값이 나올 확률은 0이고 구간에 들어갈 확률만 의미가 있다. 그 확률을 곡선 아래 넓이로 주는 함수가 확률밀도다. 확률을 모래로 비유하면, 밀도는 각 지점에 쌓인 모래의 높이이고 구간의 확률은 그 구간 위 모래의 양이다. 밀도 자체는 확률이 아니라 "단위 길이당 확률"이라 1을 넘을 수도 있다.

</div>


## 예시로 보기

0과 1 사이 값을 가지며 큰 값일수록 잘 나오는 $$X$$가 밀도 $$f(x) = 2x$$를 따른다고 하자. 삼각형 넓이가 $$\frac12 \cdot 1 \cdot 2 = 1$$이라 전체 확률은 1이다.

- $$X \le \frac12$$일 확률은 밑변 $$\frac12$$, 높이 1인 삼각형의 넓이 $$\frac14$$다.
- $$f(1) = 2$$는 1보다 크지만 문제없다. $$x = 1$$ 근처 폭 0.01 구간의 확률이 약 $$2 \times 0.01 = 0.02$$라는 뜻이다.
- $$X$$가 정확히 $$\frac12$$일 확률은 폭이 0인 구간의 넓이라 0이다.

곡선 $$f$$가 아래 정의의 확률밀도, "넓이"가 적분이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

확률변수 $$X$$에 대해 모든 구간 $$[a, b]$$에서

$$P(a \le X \le b) = \int_a^b f(x)\,dx$$

인 함수 $$f \ge 0$$이 있으면 $$X$$를 **연속 확률변수**, $$f$$를 **확률밀도함수(PDF)**라 한다. $$\int_{-\infty}^{\infty}f(x)\,dx = 1$$이다[^1].

</div>


- **CDF와의 관계:** $$F(x) = P(X \le x) = \int_{-\infty}^{x}f(t)\,dt$$. [미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/)로 $$f$$가 연속인 점에서 $$F'(x) = f(x)$$다. 예시에서 $$F(x) = x^2$$, $$F' = 2x$$.
- **한 점의 확률:** $$P(X = a) = \int_a^a f = 0$$. 그래서 $$P(a < X < b)$$와 $$P(a \le X \le b)$$가 같다.
- **기댓값과 분산:** 합을 적분으로 바꾼다. $$\mathbb{E}[X] = \int x f(x)\,dx$$($$\mathbb{E}[\cdot]$$은 평균(기댓값)), $$\mathbb{E}[g(X)] = \int g(x)f(x)\,dx$$(LOTUS), 분산은 이산일 때와 같은 식이다. 예시는 $$\mathbb{E}[X] = \int_0^1 2x^2dx = \frac23$$, $$\operatorname{Var}[X] = \frac12 - \frac49 = \frac{1}{18}$$이다. 기댓값이 있으려면 [이상적분](/Hongs_Blog/studies/calculus/improper-integrals/) $$\int\vert x\vert f(x)\,dx$$가 수렴해야 한다.

## 예제

**밀도의 변수변환.** 예시의 $$X$$에 대해 $$Y = X^2$$의 밀도는?

1. *CDF로 옮기기:* $$0 < y < 1$$에서 $$P(Y \le y) = P(X \le \sqrt y) = F_X(\sqrt y) = y$$.
2. *미분:* $$f_Y(y) = 1$$. $$Y$$는 0과 1 사이 균등분포다.
3. *일반식:* 증가함수 $$g$$로 $$Y = g(X)$$면 $$f_Y(y) = f_X(g^{-1}(y))\left\vert \frac{d}{dy}g^{-1}(y)\right\vert $$. 여기서는 $$2\sqrt y \cdot \frac{1}{2\sqrt y} = 1$$. 곱해지는 배율은 [치환적분](/Hongs_Blog/studies/calculus/substitution/)의 $$\frac{dx}{dy}$$와 같은 것이다. 구간의 길이가 늘거나 줄면 같은 확률이 퍼지거나 몰린다[^1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 넓이·확률·평균·분산, $$F' = f$$와 폭을 줄일 때 확률이 0으로 감, $$Y = X^2$$이 균등분포(모의실험 20만 개), 역변환 표본 — [14_continuous-rv_verify.py](/Hongs_Blog/studies/probability-statistics/code/14_continuous-rv_verify/)</div>

</div>


## 활용

- **측정과 시간.** 응답 시간, 센서 값, 위치처럼 연속적인 양의 모델.
- **난수 만들기.** 0~1 균등 난수 $$U$$에 CDF의 역함수를 씌운 $$F^{-1}(U)$$는 CDF가 $$F$$인 확률변수다. 예시의 $$X$$는 $$\sqrt U$$로 뽑는다([균등분포와 지수분포](/Hongs_Blog/studies/probability-statistics/uniform-exponential/)).
- **흔한 실수.** 밀도 값을 확률로 읽는 것, 이산일 때처럼 $$P(X = a)$$를 밀도 값으로 쓰는 것.

## 연결

- 선수: [확률변수와 분포](/Hongs_Blog/studies/probability-statistics/random-variables/)(CDF는 공통), [이상적분](/Hongs_Blog/studies/calculus/improper-integrals/)
- 이어지는 개념: [균등분포와 지수분포](/Hongs_Blog/studies/probability-statistics/uniform-exponential/), [정규분포](/Hongs_Blog/studies/probability-statistics/normal-distribution/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 밀도가 $$f(x) = 2x$$ ($$0 \le x \le 1$$)인 $$X$$의 $$P(X \le \frac12)$$와 $$\mathbb{E}[X]$$를 구하라.</summary>

**답:** $$\int_0^{1/2}2x\,dx = \frac14$$. $$\mathbb{E}[X] = \int_0^1 2x^2\,dx = \frac23$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 연속 확률변수에서 $$P(X = a) = 0$$인데도 $$X$$가 결국 어떤 값은 갖는다. 모순이 아닌 이유는?</summary>

**답:** 확률의 덧셈은 셀 수 있는 개수의 배반 사건에서만 맞는다. 구간의 점은 셀 수 없이 많아서 "확률 0인 점들을 다 더하면 0"이라는 계산이 허용되지 않는다. 확률은 점이 아니라 구간(넓이)에 실려 있다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 어떤 밀도가 $$f(0.3) = 4$$라면 "$$X = 0.3$$일 확률이 4"인가? 옳은 해석은?</summary>

**답:** 아니다. 확률은 1을 넘을 수 없고, 한 점의 확률은 0이다. $$f(0.3) = 4$$는 0.3 근처 폭 $$h$$의 작은 구간에 들어갈 확률이 약 $$4h$$라는 뜻이다.

</details>


[^1]: Blitzstein, Hwang, *Introduction to Probability* 2판, 5.1절 "Probability density functions"(정의, CDF와의 관계, 기댓값), 8.1절 "Change of variables"(단조 변환의 밀도).
{% endraw %}
