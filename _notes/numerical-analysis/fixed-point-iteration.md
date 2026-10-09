---
layout: "note"
title: "고정점 반복"
display_title: "고정점 반복 (Fixed-Point Iteration)"
kind: "concept"
kind_label: "알고리즘"
num: "30"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Fixed-Point Iteration", "단순 고정점 반복", "Simple Fixed-Point Iteration", "고정점", "Fixed Point", "선형 수렴", "Linear Convergence", "연립 비선형 방정식", "System of Nonlinear Equations"]
description: "f(x) = 0을 x = g(x) 꼴로 바꿔 놓고, 아무 값이나 g에 넣고 나온 값을 다시 넣기를 되풀이한다. 넣은 값과 나온 값이 같아지는 점(고정점)이 원래 식의 근이다. 식을 바꾸는 방법은 여러 가지인데, 근 근처에서 g의 기울기의 절댓값이 1보다 작으면 오차가 매번 그 비율…"
prev_url: "/studies/numerical-analysis/secant-method/"
prev_title: "할선법"
next_url: "/studies/numerical-analysis/multivariate-newton/"
next_title: "다변수 뉴턴 방법"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/fixed-point-iteration/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

$$f(x) = 0$$을 $$x = g(x)$$ 꼴로 바꿔 놓고, 아무 값이나 $$g$$에 넣고 나온 값을 다시 넣기를 되풀이한다. 넣은 값과 나온 값이 같아지는 점(고정점)이 원래 식의 근이다. 식을 바꾸는 방법은 여러 가지인데, 근 근처에서 $$g$$의 기울기의 절댓값이 1보다 작으면 오차가 매번 그 비율로 줄어 수렴하고, 1보다 크면 발산한다. 계산은 단순하지만 수렴이 느리다(선형 수렴).

</div>


## 예시로 보기

$$f(x) = e^{-x} - x = 0$$은 $$x = e^{-x}$$로 바꿀 수 있다. $$x_0 = 0$$에서 되풀이한다[^1].

| $$i$$ | $$x_i$$ | $$\lvert\epsilon_a\rvert$$ (%) | $$\lvert\epsilon_t\rvert$$ (%) |
|---|---|---|---|
| 0 | 0 | | 100.0 |
| 1 | 1.000000 | 100.0 | 76.3 |
| 2 | 0.367879 | 171.8 | 35.1 |
| 3 | 0.692201 | 46.9 | 22.1 |
| 4 | 0.500473 | 38.3 | 11.8 |
| 10 | 0.564879 | 1.11 | 0.399 |

근(0.56714329)의 양쪽을 오가며 다가간다. 오차는 매번 약 0.567배로 준다. 근에서 $$g'(x) = -e^{-x}$$의 절댓값이 $$e^{-0.567} \approx 0.567$$이기 때문이다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/30_fixed-point-iteration_fig1.svg" alt="그림" loading="lazy">

곡선 $$y = e^{-x}$$에서 값을 읽고(세로로), 직선 $$y = x$$에서 그 값을 다음 입력으로 옮기는(가로로) 일을 되풀이한 그림이다. 사각형이 근을 감싸며 점점 작아진다. 근의 양쪽을 번갈아 오가는 것이 보인다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표, 오차 비율 → 0.567, 세 가지 $$g$$의 수렴과 발산, 근 양쪽을 오감, 카드 C2, 연립 방정식의 두 방법(발산과 수렴), 반복 함수의 편미분 — [30_fixed-point-iteration_impl.py](/Hongs_Blog/studies/numerical-analysis/code/30_fixed-point-iteration_impl/)</div>

</div>


## 정의

$$f(x) = 0$$을 $$x$$가 왼쪽에 오도록 $$x = g(x)$$로 바꾸고, 시작값 $$x_0$$에서 다음을 되풀이한다[^2].

$$x_{i+1} = g(x_i)$$


바꾸는 방법은 여러 가지다. $$x^2 - x - 2 = 0$$($$x > 0$$, 근 2)은 $$g(x) = x^2 - 2$$, $$\sqrt{x + 2}$$, $$1 + \frac2x$$ 등으로 쓸 수 있다. $$\sin x = 0$$은 양변에 $$x$$를 더해 $$x = \sin x + x$$로 쓴다[^3]. 시작값과 바꾼 꼴에 따라 발산할 수도 있다[^2].

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">수렴 조건</div>

근 근처에서 $$\vert g'(x)\vert  < 1$$이면 고정점 반복은 수렴한다. 이때 오차는 대략 앞 오차에 비례해(그 이하로) 줄어든다. 그래서 선형 수렴이라 한다[^4].

</div>


<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">이유</summary>

근 $$r$$은 $$r = g(r)$$이다. 빼면 $$x_{i+1} - r = g(x_i) - g(r) = g'(\xi)(x_i - r)$$인 $$\xi$$가 $$x_i$$와 $$r$$ 사이에 있다([평균값 정리](/Hongs_Blog/studies/calculus/mean-value-theorem/)). 그래서 오차는 매번 $$\vert g'(\xi)\vert $$배가 된다. 이 값이 1보다 작으면 오차가 0으로 간다.

</details>


$$x^2 - x - 2 = 0$$의 세 꼴을 근 2에서 보면 $$g(x) = x^2 - 2$$는 $$g'(2) = 4$$라 발산하고, $$\sqrt{x + 2}$$는 $$\frac14$$, $$1 + \frac2x$$는 $$-\frac12$$라 수렴한다. $$g'$$이 음수이면 근의 양쪽을 번갈아 오간다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/30_fixed-point-iteration_fig2.svg" alt="그림" loading="lazy">

왼쪽 $$g(x) = x^2 - 2$$는 근 바로 옆 2.1에서 시작해도 한 번마다 근에서 크게 멀어진다. 오른쪽 $$g(x) = 1 + \frac2x$$는 1에서 시작해 근 2의 양쪽을 번갈아 오가며 다가간다[^s2].

### 연립 비선형 방정식

$$u(x, y) = x^2 + xy - 10 = 0$$, $$v(x, y) = y + 3xy^2 - 57 = 0$$(참값 $$x = 2$$, $$y = 3$$)을 $$x = g_1(x, y)$$, $$y = g_2(x, y)$$로 바꾼다. 꼴이 여러 가지다[^5].

- 방법 i: $$x = \frac{10 - x^2}{y}$$, $$y = 57 - 3xy^2$$. $$(1.5, 3.5)$$에서 $$x_1 = 2.21429$$, $$y_1 = -24.375$$, $$x_2 = -0.2091$$, $$y_2 = 429.71$$로 발산한다[^6].
- 방법 ii: $$x = \sqrt{10 - xy}$$, $$y = \sqrt{\frac{57 - y}{3x}}$$. $$x_1 = 2.17945$$, $$y_1 = 2.86051$$, $$x_2 = 1.94053$$, $$y_2 = 3.04955$$로 수렴한다[^7].

두 방법 모두 $$y$$를 고칠 때 방금 구한 새 $$x$$를 쓴다(가우스-자이델과 같은 방식). 수렴의 충분조건은 근 근처에서 다음과 같다[^7].

$$\left\vert \frac{\partial g_1}{\partial x}\right\vert  + \left\vert \frac{\partial g_1}{\partial y}\right\vert  < 1, \qquad \left\vert \frac{\partial g_2}{\partial x}\right\vert  + \left\vert \frac{\partial g_2}{\partial y}\right\vert  < 1$$


<div class="callout callout-warning" markdown="1">
<div class="callout-title" markdown="span">원본 오류 의심</div>

원문: "Converges if $$\vert \partial u/\partial x\vert  + \vert \partial u/\partial y\vert  < 1$$ and $$\vert \partial v/\partial x\vert  + \vert \partial v/\partial y\vert  < 1$$" (p.9) / 문제점: 같은 자료 p.7에서 $$u$$, $$v$$는 원래 방정식 $$x^2 + xy - 10$$, $$y + 3xy^2 - 57$$로 정의되었다. 이 함수들로 재면 근에서 $$\vert u_x\vert  + \vert u_y\vert  = 7 + 2 = 9$$라 조건을 만족할 수 없다. 조건은 반복 함수 $$g_1$$, $$g_2$$의 편미분에 대한 것이다 / 수정안: $$u$$, $$v$$ 자리에 $$g_1$$, $$g_2$$ / 근거: 1차원 조건 $$\vert g'(x)\vert  < 1$$을 두 변수로 넓힌 것이고, 30_fixed-point-iteration_impl.py에서 계산[^7]

</div>


이 조건은 충분조건일 뿐이다. 방법 ii는 근에서 $$\vert \partial g_1/\partial x\vert  + \vert \partial g_1/\partial y\vert  = 0.75 + 0.5 = 1.25$$로 조건을 만족하지 않는데도 수렴했다[^s1].

## 활용

- 계산이 단순해 다른 방법의 바탕이 된다. 야코비·가우스-자이델 반복, PageRank의 거듭제곱법, 뉴턴 방법 자체도 $$g(x) = x - f(x)/f'(x)$$인 고정점 반복이다[^s1].
- 흔한 실수: 처음 떠오른 $$g$$를 그대로 쓰는 것. $$g'$$의 크기를 근 근처에서 확인하고, 1보다 크면 식을 다르게 바꾼다.

## 연결

- 선수: [이분법](/Hongs_Blog/studies/numerical-analysis/bisection-method/)(근 찾기의 틀), [평균값 정리](/Hongs_Blog/studies/calculus/mean-value-theorem/)(수렴 이유)
- 연립 일차방정식의 고정점 반복: [야코비 방법과 가우스-자이델 방법](/Hongs_Blog/studies/numerical-analysis/jacobi-gauss-seidel/)
- 더 빠른 연립 비선형 풀이: [다변수 뉴턴 방법](/Hongs_Blog/studies/numerical-analysis/multivariate-newton/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 고정점 반복의 갱신식과 수렴 조건을 쓰라. 왜 "선형 수렴"이라 하나?</summary>

**답:** $$x_{i+1} = g(x_i)$$, 근 근처에서 $$\vert g'(x)\vert  < 1$$. 오차가 매번 약 $$\vert g'(r)\vert $$배, 곧 앞 오차에 비례해 줄기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$g(x) = \cos x$$, $$x_0 = 0$$으로 두 번 반복하라.</summary>

**답:** $$x_1 = \cos0 = 1$$, $$x_2 = \cos1 \approx 0.5403$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$x^2 - x - 2 = 0$$을 $$x = x^2 - 2$$로 바꾸면 근 2 바로 옆에서 시작해도 발산하는 이유는?</summary>

**답:** $$g'(x) = 2x$$라 $$g'(2) = 4$$다. 근 근처에서 오차가 매번 약 4배로 불어난다. 평균값 정리로 $$x_{i+1} - 2 = g'(\xi)(x_i - 2)$$이기 때문이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 연립 고정점 반복의 수렴 조건(편미분 절댓값 합 < 1)을 만족하지 않는데도 수렴하는 예를 들라.</summary>

**답:** 방법 ii, $$g_1 = \sqrt{10 - xy}$$. 근 $$(2, 3)$$에서 $$\vert \partial g_1/\partial x\vert  + \vert \partial g_1/\partial y\vert  = 0.75 + 0.5 = 1.25 > 1$$인데 $$(1.5, 3.5)$$에서 수렴한다. 조건은 충분조건이지 필요조건이 아니다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/17.na17_nonlinear2.pdf, p.5
[^2]: 같은 자료, p.3
[^3]: 같은 자료, p.4
[^4]: 같은 자료, p.6
[^5]: 같은 자료, p.2, p.7
[^6]: 같은 자료, p.8
[^7]: 같은 자료, p.9
[^s1]: 에이전트 보충. 오차 비율 0.567, 평균값 정리로 쓴 이유, 세 꼴의 기울기, 방법 ii의 편미분 합 1.25, 활용, 흔한 실수, 카드 C2~C4는 원본에 없다. 방법 i의 $$y_1$$은 정확히 −24.375이고 슬라이드는 −24.3으로 줄여 썼다. 구현 코드로 확인했다.
[^s2]: 에이전트 보충. 그림 두 장은 원본에 없다. [30_fixed-point-iteration_plot.py](/Hongs_Blog/studies/numerical-analysis/code/30_fixed-point-iteration_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: 표의 $$x_2$$, $$x_4$$, $$x_{10}$$, 오차 비율 $$-0.567$$, $$x^2 - 2$$의 발산과 $$1 + \frac2x$$의 수렴.
{% endraw %}
