---
layout: "note"
title: "다항식 보간"
display_title: "다항식 보간 (Polynomial Interpolation)"
kind: "concept"
kind_label: "정리"
num: "21"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Polynomial Interpolation", "보간", "Interpolation", "외삽", "Extrapolation", "선형 보간", "Linear Interpolation", "2차 보간", "Quadratic Interpolation", "라그랑주 보간", "Lagrange Interpolation", "라그랑주 기저 함수", "Lagrange Basis Function"]
description: "몇 개의 점에서만 값을 알 때, 그 점들을 모두 정확히 지나는 다항식을 만들어 사이의 값을 짐작한다. 점이 n + 1개면 n차 이하 다항식이 딱 하나 있고, 라그랑주 공식으로 바로 적을 수 있다. 점을 늘리면 보통 더 정확해진다. 다만 점들의 범위 밖을 짐작하는 외삽은 오차가 크게…"
prev_url: "/studies/numerical-analysis/jacobi-gauss-seidel/"
prev_title: "야코비 방법과 가우스-자이델 방법"
next_url: "/studies/numerical-analysis/newton-divided-difference/"
next_title: "뉴턴 다항식과 분할 차분"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/polynomial-interpolation/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

몇 개의 점에서만 값을 알 때, 그 점들을 모두 정확히 지나는 다항식을 만들어 사이의 값을 짐작한다. 점이 $$n + 1$$개면 $$n$$차 이하 다항식이 딱 하나 있고, 라그랑주 공식으로 바로 적을 수 있다. 점을 늘리면 보통 더 정확해진다. 다만 점들의 범위 밖을 짐작하는 외삽은 오차가 크게 불어날 수 있다.

</div>


## 예시로 보기

계산기가 없던 시절 $$\tan 1.15$$를 알고 싶은데, 표에는 $$1, 1.1, 1.2, 1.3$$의 값만 있다[^1].

| $$x$$ | 1 | 1.1 | 1.2 | 1.3 |
|---|---|---|---|---|
| $$\tan x$$ | 1.5574 | 1.9648 | 2.5722 | 3.6021 |

| 쓰는 점 | 다항식 | $$P_n(1.15)$$ | 오차 |
|---|---|---|---|
| 1.1, 1.2 | 1차 | 2.2685 | −0.0340 |
| 1, 1.1, 1.2 | 2차 | 2.2435 | −0.0090 |
| 넷 다 | 3차 | 2.2296 | 0.0049 |

참값은 $$\tan1.15 \approx 2.2345$$다. 점을 늘릴수록 오차가 준다. 같은 3차식으로 범위 밖의 $$\tan1.5$$를 짐작하면 참값 14.1과 5 넘게 틀린다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/21_polynomial-interpolation_fig1.svg" alt="그림" loading="lazy">

왼쪽은 1.15 근처를 확대한 것이다. 쓰는 점이 늘수록 색 선이 굵은 회색 선($$\tan x$$)에 붙는다. 오른쪽은 자료 범위 밖까지 그린 것이다. 1.3을 넘으면 $$\tan x$$는 가파르게 솟는데 3차식은 따라가지 못해, 1.5에서 14.1과 7.8로 벌어진다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: tan 표와 세 보간값·오차, cos 보간, 무작위 100개에서 라그랑주 = 방데르몽드 연립방정식(유일성), 카드 C2, 외삽 오차 — [21_polynomial-interpolation_verify.py](/Hongs_Blog/studies/numerical-analysis/code/21_polynomial-interpolation_verify/)</div>

</div>


## 정의

**보간**은 주어진 점들을 모두 지나는 함수를 찾는 것이다. 그 함수로 알려진 점들 사이의 값을 짐작한다. 범위 밖을 짐작하는 것은 **외삽**이라 한다[^2][^3]. 복잡한 함수를 계산하기 쉬운 다항식으로 바꾸거나, 표의 사이 값을 얻을 때 쓴다[^4].

**선형 보간.** 두 점 $$(x_0, y_0)$$, $$(x_1, y_1)$$을 직선으로 잇는다[^5].

$$P_1(x) = \frac{(x_1 - x)y_0 + (x - x_0)y_1}{x_1 - x_0}$$


**2차 보간.** 세 점에 $$p(x) = a_0 + a_1x + a_2x^2$$을 맞춘다. 연립방정식을 풀어도 되지만, 라그랑주 공식으로 바로 적는다[^6][^7].

$$P_2(x) = y_0L_0(x) + y_1L_1(x) + y_2L_2(x), \qquad L_0(x) = \frac{(x - x_1)(x - x_2)}{(x_0 - x_1)(x_0 - x_2)}$$


$$L_1$$, $$L_2$$도 같은 꼴이다. $$L_i$$는 자기 점 $$x_i$$에서 1, 다른 두 점에서 0인 2차식(라그랑주 기저 함수)이다. 그래서 $$P_2(x_i) = y_i$$다[^8].

**$$n$$차 보간.** 서로 다른 $$n + 1$$개 점에 대해 같은 방식이다[^9].

$$P_n(x) = \sum_{i=0}^{n}y_iL_i(x), \qquad L_i(x) = \prod_{j \ne i}\frac{x - x_j}{x_i - x_j}$$


<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">유일성</div>

$$x_0, \dots, x_n$$이 서로 다르면, 이 점들을 지나는 $$n$$차 이하 다항식은 하나뿐이다.

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">증명 ($$n = 2$$)</summary>

$$Q$$도 세 점을 지나는 2차 이하 다항식이라 하자. $$R = P_2 - Q$$는 2차 이하이고 $$R(x_i) = y_i - y_i = 0$$이라 서로 다른 근이 셋이다. 0이 아닌 2차 이하 다항식의 근은 둘 이하이므로 $$R = 0$$, 곧 $$Q = P_2$$다[^10].

</details>


"서로 다르다"는 조건이 필요하다. 두 점의 $$x$$가 같고 $$y$$가 다르면 지나는 함수가 없다.

## 활용

- 표 사이 값 짐작(옛 삼각함수·로그 표), 실험 자료 사이 값, 다른 수치 방법(수치 적분, 미분방정식 풀이)의 바탕으로 쓴다.
- 흔한 실수: 점을 많이 넣으면 늘 좋아진다고 믿는 것. 고르게 놓인 점이 많으면 양 끝에서 크게 출렁일 수 있다(룽게 현상)[^s1]. 또 외삽에 보간 다항식을 믿는 것.

## 연결

- 선수: [다항식과 방정식](/Hongs_Blog/studies/college-math/polynomial/)(근의 개수), [3차 보간 곡선](/Hongs_Blog/studies/numerical-analysis/cubic-interpolation-curve/)(점 넷의 같은 문제를 행렬로)
- 점을 하나씩 더하기 쉬운 꼴: [뉴턴 다항식과 분할 차분](/Hongs_Blog/studies/numerical-analysis/newton-divided-difference/)
- 점을 정확히 지나지 않고 가까이 지나기: [최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$n + 1$$개 점의 라그랑주 보간 공식과 기저 함수 $$L_i$$를 쓰라.</summary>

**답:** $$P_n(x) = \sum_i y_iL_i(x)$$, $$L_i(x) = \prod_{j \ne i}\frac{x - x_j}{x_i - x_j}$$. $$L_i(x_k)$$는 $$k = i$$이면 1, 아니면 0.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$(0, 1)$$, $$(1, 3)$$, $$(2, 7)$$을 지나는 2차식을 구하고 $$x = 3$$에서 값을 구하라.</summary>

**답:** $$P_2(x) = x^2 + x + 1$$(세 점에 넣어 확인). $$P_2(3) = 13$$. 이 값은 범위 밖이라 외삽이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 유일성 증명에서 "$$R = P_2 - Q$$가 0이다"는 어디서 나오는가?</summary>

**답:** $$R$$은 2차 이하인데 서로 다른 근이 셋이다. 0이 아닌 2차 이하 다항식은 근이 많아야 둘이므로(대수학의 기본 성질), $$R$$은 0 다항식이어야 한다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/12.na12_interpolation.pdf, p.15
[^2]: 같은 자료, p.2
[^3]: 같은 자료, p.4
[^4]: 같은 자료, p.5
[^5]: 같은 자료, p.6~8
[^6]: 같은 자료, p.3, p.9
[^7]: 같은 자료, p.10
[^8]: 같은 자료, p.11
[^9]: 같은 자료, p.13~14
[^10]: 같은 자료, p.12
[^s1]: 에이전트 보충. 2차 보간이 1, 1.1, 1.2 세 점이라는 것(계산으로 확인), 참값과 외삽 실험, "서로 다르다" 조건의 필요성, 활용, 룽게 현상, 카드 C2·C3은 원본에 없다. 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림은 원본에 없다. [21_polynomial-interpolation_plot.py](/Hongs_Blog/studies/numerical-analysis/code/21_polynomial-interpolation_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: $$P_n(1.15)$$ = 2.2685, 2.2435, 2.2296, $$\tan1.15 = 2.2345$$, $$x = 1.5$$에서 3차식 7.8과 참값 14.1.
{% endraw %}
