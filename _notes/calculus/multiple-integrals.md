---
layout: "note"
title: "중적분과 변수변환"
display_title: "중적분과 변수변환 (Multiple Integrals and Change of Variables)"
kind: "concept"
kind_label: "기법"
num: "25"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
updated: "2026-10-06"
status: "verified"
aliases: ["Multiple Integral", "중적분", "이중적분", "double integral", "반복적분", "iterated integral", "푸비니 정리", "Fubini's theorem", "변수변환", "change of variables", "극좌표 적분", "polar integral", "가우스 적분", "Gaussian integral", "박스-뮬러 변환", "Box–Muller transform", "몬테카를로 적분", "Monte Carlo integration"]
description: "땅 위에 쌓인 눈의 총량을 구하려면, 땅을 작은 칸으로 나눠 칸마다 \"넓이 × 눈 높이\"를 더하면 된다. 이것이 이중적분이고, 실제 계산은 한 방향씩 차례로 적분(반복적분)해서 한다. 원이나 부채꼴처럼 둥근 영역은 극좌표로 바꾸면 쉬워지는데, 좌표를 바꾸면 작은 칸의 넓이가 달라지…"
prev_url: "/studies/calculus/matrix-calculus/"
prev_title: "행렬 미분"
next_url: "/studies/calculus/gradient-descent/"
next_title: "경사 하강법"
math: true
mermaid: false
code_count: 1
permalink: "/studies/calculus/multiple-integrals/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

땅 위에 쌓인 눈의 총량을 구하려면, 땅을 작은 칸으로 나눠 칸마다 "넓이 × 눈 높이"를 더하면 된다. 이것이 이중적분이고, 실제 계산은 한 방향씩 차례로 적분(반복적분)해서 한다. 원이나 부채꼴처럼 둥근 영역은 극좌표로 바꾸면 쉬워지는데, 좌표를 바꾸면 작은 칸의 넓이가 달라지므로 그 배율(야코비 행렬식)을 곱해 줘야 한다. 이 보정을 빠뜨리는 것이 가장 흔한 실수이고, 극좌표에서는 반지름만큼의 배율이다.

</div>


## 예시로 보기

정사각형 $$[0, 1] \times [0, 1]$$ 위의 곡면 $$z = xy$$ 아래 부피를 구한다. 먼저 $$y$$를 고정하고 $$x$$로 적분한 뒤, 그 결과를 $$y$$로 적분한다.

$$\int_0^1\left(\int_0^1 xy\,dx\right)dy = \int_0^1\frac{y}{2}\,dy = \frac14.$$

$$x$$부터 하든 $$y$$부터 하든 같다. 원판 $$x^2 + y^2 \le 1$$처럼 둥근 영역에서는 반지름 $$r$$과 각 $$\theta$$로 나누는 편이 편하다. 이때 작은 칸 "$$r$$ 방향 $$dr$$, 각 방향 $$d\theta$$"의 넓이는 $$dr \times d\theta$$가 아니라 약 $$r\,dr\,d\theta$$다. 바깥쪽 칸일수록 호의 길이 $$r\,d\theta$$가 길기 때문이다. 칸의 넓이가 아래 정리의 $$dA$$, 배율 $$r$$이 야코비 행렬식이다.

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

영역 $$R$$ 위의 **이중적분** $$\iint_R f\,dA$$는 $$R$$을 작은 칸으로 나눠 "칸의 넓이 × 칸 안의 함숫값"을 더한 [리만 합](/Hongs_Blog/studies/calculus/riemann-integral/)의 극한이다. $$f \ge 0$$이면 곡면 아래의 부피다[^1].

</div>


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">푸비니 정리와 변수변환</div>

1. **반복적분(푸비니):** $$f$$가 직사각형 $$[a, b] \times [c, d]$$에서 연속이면 $$\iint f\,dA = \int_c^d\int_a^b f\,dx\,dy = \int_a^b\int_c^d f\,dy\,dx$$.
2. **변수변환:** $$(u, v) \mapsto (x, y) = T(u, v)$$가 영역 $$S$$를 $$R$$로 일대일로 보내고 미분 가능하면

$$\iint_R f(x, y)\,dx\,dy = \iint_S f(T(u, v))\,\left\vert \det J_T(u, v)\right\vert \,du\,dv.$$

극좌표 $$x = r\cos\theta$$, $$y = r\sin\theta$$에서는 $$\vert \det J\vert  = r$$이라 $$dx\,dy = r\,dr\,d\theta$$다.

</div>


$$\vert \det J_T\vert $$는 [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)이 넓이의 배율이라는 사실에서 나온다. $$T$$를 한 점 근처에서 [선형 근사](/Hongs_Blog/studies/calculus/multivariable-chain-rule/)하면 작은 사각형 $$du \times dv$$가 넓이 $$\vert \det J_T\vert \,du\,dv$$인 평행사변형이 된다.

**떠올리는 신호.** 영역이 원·부채꼴·고리이거나 식에 $$x^2 + y^2$$이 있으면 극좌표, 영역이 기울어진 평행사변형이면 그것을 직사각형으로 펴는 일차 변환을 쓴다.

## 예제

**가우스 적분.** $$I = \int_{-\infty}^{\infty}e^{-x^2}dx$$는 원시함수를 기본 함수로 쓸 수 없는데, 제곱해서 이중적분으로 바꾸면 풀린다.

1. *제곱:* $$I^2 = \int e^{-x^2}dx\int e^{-y^2}dy = \iint_{\mathbb{R}^2}e^{-(x^2 + y^2)}\,dx\,dy$$($$\mathbb{R}$$은 실수 전체, $$\mathbb{R}^n$$은 실수 $$n$$개짜리 목록 전체).
2. *극좌표:* $$x^2 + y^2 = r^2$$, $$dx\,dy = r\,dr\,d\theta$$. $$I^2 = \int_0^{2\pi}\int_0^\infty e^{-r^2}r\,dr\,d\theta$$.
3. *안쪽 적분:* $$u = r^2$$으로 [치환](/Hongs_Blog/studies/calculus/substitution/)하면 $$\int_0^\infty e^{-r^2}r\,dr = \frac12$$. 곱하기 $$2\pi$$로 $$I^2 = \pi$$.
4. *결론:* $$I = \sqrt\pi$$. [이상적분](/Hongs_Blog/studies/calculus/improper-integrals/) 문서에서 미뤄 둔 값이다. 정규분포의 넓이가 1이 되도록 앞에 붙는 $$\frac{1}{\sqrt{2\pi}}$$가 여기서 나온다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 $$\frac14$$(두 순서의 반복적분과 2차원 리만 합), 원판 넓이 $$\pi R^2$$(극좌표, 배율 $$r$$을 빼면 틀림), 가우스 적분 $$\sqrt\pi$$(수치), 타원 넓이 $$\pi ab$$(변환 $$x = au$$, $$y = bv$$의 행렬식), 몬테카를로로 원의 넓이 추정, 박스–뮬러 표본의 평균·분산 — [25_multiple-integrals_verify.py](/Hongs_Blog/studies/calculus/code/25_multiple-integrals_verify/)</div>

</div>


## 활용

- **확률.** 두 확률변수의 결합 확률밀도를 영역에서 이중적분하면 그 영역에 들 확률이다([결합분포와 조건부 기댓값](/Hongs_Blog/studies/probability-statistics/joint-distributions/)).
- **정규분포 표본 만들기.** 박스–뮬러 변환은 균등분포 난수 두 개 $$U_1, U_2$$로 $$R = \sqrt{-2\ln U_1}$$, $$\Theta = 2\pi U_2$$를 만들고 $$(R\cos\Theta, R\sin\Theta)$$를 내놓는다. 극좌표 변수변환 덕분에 두 좌표가 서로 독립인 표준정규분포를 따른다[^s1].
- **몬테카를로 적분.** 차원이 높으면 칸으로 나누는 방법은 칸 수가 폭발한다. 무작위 점을 뿌려 평균을 내면 오차가 표본 수의 제곱근에 반비례해, 차원과 상관없이 쓸 수 있다. 렌더링의 조명 계산이 이 방법이다[^s1].
- 알고리즘에서: 겹친 직사각형들의 넓이는 x마다 세로로 덮인 길이를 구해 x 방향으로 쌓는 반복적분이다. [세그먼트 트리와 스위핑](/Hongs_Blog/studies/algorithms/segment-tree-sweep/)에서 안쪽 적분은 세그먼트 트리가, 바깥 적분은 사건 순회가 맡는다. 격자의 어떤 직사각형 합이든 모서리 네 값을 더하고 빼서 구하는 [2차원 누적 합](/Hongs_Blog/studies/algorithms/prefix-sum/)은 이중적분을 칸 단위로 한 것이다.

## 연결

- 선수: [미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/), [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)(넓이 배율), [극좌표](/Hongs_Blog/studies/college-math/polar-parametric/)
- 배율의 근거: [야코비 행렬](/Hongs_Blog/studies/calculus/multivariable-chain-rule/)
- 미뤄 둔 값: [이상적분](/Hongs_Blog/studies/calculus/improper-integrals/)의 $$\int e^{-x^2}dx$$

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$\iint_{[0,1]\times[0,2]}(x + y)\,dA$$를 구하라.</summary>

**답:** $$\int_0^2\int_0^1(x + y)\,dx\,dy = \int_0^2\left(\frac12 + y\right)dy = 1 + 2 = 3$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 반지름 $$R$$인 원판의 넓이를 극좌표 적분으로 구하라.</summary>

**답:** $$\int_0^{2\pi}\int_0^R r\,dr\,d\theta = 2\pi \cdot \frac{R^2}{2} = \pi R^2$$. 배율 $$r$$을 빼면 $$2\pi R$$이라는 틀린 답이 나온다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 극좌표로 바꿀 때 $$dx\,dy = r\,dr\,d\theta$$에서 $$r$$이 붙는 이유를 두 가지 방법으로 설명하라.</summary>

**답:** (1) 그림으로: 반지름 $$dr$$, 각 $$d\theta$$인 작은 칸은 가로 $$dr$$, 세로(호의 길이) $$r\,d\theta$$인 거의 직사각형이라 넓이가 $$r\,dr\,d\theta$$다. (2) 식으로: 변환 $$(r, \theta) \mapsto (r\cos\theta, r\sin\theta)$$의 야코비 행렬식이 $$r$$이고, 행렬식이 넓이의 배율이다.

</details>


[^1]: OpenStax, *Calculus Volume 3*, 5.1절 "Double Integrals over Rectangular Regions"(리만 합, 푸비니 정리), 5.2절 "Double Integrals over General Regions", 5.3절 "Double Integrals in Polar Coordinates", 5.7절 "Change of Variables in Multiple Integrals"(야코비 행렬식).
[^s1]: 에이전트 보충. 박스–뮬러 변환은 Box, Muller, "A note on the generation of random normal deviates", *Annals of Mathematical Statistics* 29 (1958)의 방법이다. 몬테카를로 적분의 오차가 $$1/\sqrt N$$에 비례한다는 것은 중심극한정리에서 나온다(확률과 통계). 경로 추적 렌더링이 렌더링 방정식을 몬테카를로로 푸는 방식은 Kajiya, "The Rendering Equation", *SIGGRAPH* (1986)에서 나왔다. 둘 다 25_multiple-integrals_verify.py에서 실험으로 확인했다.
{% endraw %}
