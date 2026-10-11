---
layout: "note"
title: "다변수 함수와 편미분"
display_title: "다변수 함수와 편미분 (Partial Derivatives)"
kind: "concept"
kind_label: "정의"
num: "19"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Partial Derivative", "편미분", "편도함수", "다변수 함수", "multivariable function", "등고선", "level curve", "등위곡선", "클레로 정리", "Clairaut's theorem", "혼합 편미분", "mixed partial derivative", "유한 차분", "finite difference"]
description: "산의 높이는 동서 위치와 남북 위치 두 값에 따라 정해진다. 이런 여러 입력의 함수에서 \"다른 방향은 그대로 두고 동쪽으로만 한 걸음 가면 얼마나 오르나\"를 재는 것이 편미분이다. 입력마다 하나씩 편미분이 있어, 한 변수 미분의 도구를 그대로 쓴다. 이미지의 밝기 변화, 손실 함수…"
prev_url: "/studies/calculus/taylor-series/"
prev_title: "테일러 급수"
next_url: "/studies/calculus/gradient/"
next_title: "그래디언트와 방향도함수"
math: true
mermaid: false
code_count: 2
permalink: "/studies/calculus/partial-derivatives/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

산의 높이는 동서 위치와 남북 위치 두 값에 따라 정해진다. 이런 여러 입력의 함수에서 "다른 방향은 그대로 두고 동쪽으로만 한 걸음 가면 얼마나 오르나"를 재는 것이 편미분이다. 입력마다 하나씩 편미분이 있어, 한 변수 미분의 도구를 그대로 쓴다. 이미지의 밝기 변화, 손실 함수가 각 가중치에 얼마나 민감한지가 모두 편미분이다. 다만 모든 축 방향으로 편미분이 있어도 함수가 매끄럽다는 보장은 없다. 축 사이의 방향에서는 끊어져 있을 수도 있다.

</div>


## 예시로 보기

지형의 높이가 $$f(x, y) = x^2y + \sin y$$(동쪽 $$x$$, 북쪽 $$y$$)라 하자. 점 $$(1, 0)$$에서

- **동쪽으로만:** $$y = 0$$을 고정하면 $$f(x, 0) = 0$$이라 기울기 0이다. 식으로는 $$y$$를 상수로 보고 $$x$$로 미분해 $$\frac{\partial f}{\partial x} = 2xy$$, $$(1, 0)$$에서 0.
- **북쪽으로만:** $$x = 1$$을 고정하면 $$f(1, y) = y + \sin y$$라 기울기 $$1 + \cos 0 = 2$$다. 식으로는 $$\frac{\partial f}{\partial y} = x^2 + \cos y$$, $$(1, 0)$$에서 2.

같은 점이라도 방향마다 기울기가 다르다. 높이가 같은 점들을 이은 선(등고선)을 그리면 지도처럼 볼 수 있다. $$x$$만 움직이는 단면의 기울기가 아래 정의의 $$\frac{\partial f}{\partial x}$$다.

<img class="note-fig" src="/Hongs_Blog/assets/notes/calculus/19_partial-derivatives_fig1.svg" alt="그림" width="612" height="285" loading="lazy">

왼쪽 지도에서 주황 선은 $$(1, 0)$$을 지나 동쪽으로, 초록 선은 북쪽으로 가는 길이다. 오른쪽은 그 두 길을 따라 걸을 때의 높이다. 주황은 높이 0의 평지라 기울기 0이고, 초록은 출발점에서 점선(기울기 2)에 붙어 오른다[^s2].

## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title callout-title--default" markdown="span">정의</div>

$$f: \mathbb{R}^n \to \mathbb{R}$$($$\mathbb{R}$$은 실수 전체, $$\mathbb{R}^n$$은 실수 $$n$$개짜리 목록 전체)와 점 $$\mathbf{a}$$에 대해 $$x_i$$에 대한 **편미분**은 다른 변수를 고정한 한 변수 도함수다.

$$\frac{\partial f}{\partial x_i}(\mathbf{a}) = \lim_{h \to 0}\frac{f(\mathbf{a} + h\mathbf{e}_i) - f(\mathbf{a})}{h}$$

($$\mathbf{e}_i$$는 $$i$$번째 방향의 단위벡터). $$f_{x_i}$$로도 쓴다. 두 번 편미분한 것을 2계 편미분이라 하고, 서로 다른 변수로 번갈아 미분한 $$f_{xy} = \frac{\partial}{\partial y}\frac{\partial f}{\partial x}$$를 혼합 편미분이라 한다[^1].

</div>


**클레로 정리.** 2계 편미분들이 어떤 점 근처에서 연속이면 그 점에서 $$f_{xy} = f_{yx}$$다(미분 순서를 바꿔도 같다)[^1]. 위 예에서 $$f_{xy} = 2x = f_{yx}$$다.

**등고선.** $$f(x, y) = c$$를 만족하는 점들의 곡선이다. $$f(x, y) = x^2 + y^2$$의 등고선은 원점을 중심으로 한 동심원이고, 원이 촘촘한 곳일수록 가파르다.

## 예제

**편미분이 있어도 연속이 아닐 수 있다.** $$f(x, y) = \frac{xy}{x^2 + y^2}$$($$(x, y) \ne (0, 0)$$), $$f(0, 0) = 0$$.

1. *축 위:* $$x$$축 위에서 $$f(x, 0) = 0$$, $$y$$축 위에서 $$f(0, y) = 0$$이라 원점에서 두 편미분이 모두 0이다.
2. *대각선 위:* $$y = x$$ 위에서 $$f(x, x) = \frac{x^2}{2x^2} = \frac12$$. 원점에 아무리 가까이 가도 $$\frac12$$다.
3. *결론:* 원점의 값 0과 다르므로 $$f$$는 원점에서 연속이 아니다. 두 축 방향만 봐서는 축 사이에서 무슨 일이 일어나는지 알 수 없다. 그래서 다변수에서는 "미분 가능"을 편미분의 존재보다 강하게 정의한다([그래디언트와 방향도함수](/Hongs_Blog/studies/calculus/gradient/)).

<img class="note-fig" src="/Hongs_Blog/assets/notes/calculus/19_partial-derivatives_fig2.svg" alt="그림" width="437" height="353" loading="lazy">

색이 원점에서 부채꼴로 퍼진다. 원점을 지나는 직선 위에서는 값이 일정하다는 뜻이다. 두 축(실선) 위는 0인 옅은 띠이고, 대각선(점선) 위는 가장 진한 빨강 $$\frac12$$다. 원점에 어느 방향으로 다가가느냐에 따라 다가가는 값이 다르다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시의 두 편미분(식과 수치 차분), 무작위 다항식·삼각 함수에서 기호 편미분 = 중앙 차분, 클레로 정리($$f_{xy} = f_{yx}$$), 예제의 축·대각선 값, 등고선 $$x^2 + y^2 = c$$ 위에서 값이 일정, 이미지 차분 예 — [19_partial-derivatives_verify.py](/Hongs_Blog/studies/calculus/code/19_partial-derivatives_verify/)</div>

</div>


## 활용

- **이미지 윤곽.** [이미지 함수](/Hongs_Blog/studies/human-interface-media/image-function/) $$i(x, y)$$의 편미분을 이웃 픽셀의 차이 $$i(x + 1, y) - i(x, y)$$로 어림하면 가로 방향 밝기 변화가 나온다. 윤곽 검출 필터(소벨 등)는 이 차분에 잡음을 줄이는 가중치를 더한 것이다[^s1].
- **민감도.** 손실 함수가 가중치 $$w_i$$ 하나를 조금 바꿀 때 얼마나 변하는지가 $$\frac{\partial L}{\partial w_i}$$다. 모든 가중치의 편미분을 모은 것이 [그래디언트](/Hongs_Blog/studies/calculus/gradient/)다.
- **수치 편미분.** 식을 모르는 함수는 $$\frac{f(\mathbf{a} + h\mathbf{e}_i) - f(\mathbf{a} - h\mathbf{e}_i)}{2h}$$로 어림한다. 변수가 $$n$$개면 함수를 $$2n$$번 불러야 해서, 변수가 많은 학습에서는 역전파를 쓴다([연쇄 법칙 ↔ 역전파](/Hongs_Blog/studies/calculus/backprop-bridge/)).

## 연결

- 선수: [도함수](/Hongs_Blog/studies/calculus/derivative/), [벡터](/Hongs_Blog/studies/linear-algebra/vectors/)
- 이어지는 개념: [그래디언트와 방향도함수](/Hongs_Blog/studies/calculus/gradient/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$f(x, y) = x^2y + \sin y$$의 두 편미분과 혼합 편미분 $$f_{xy}$$, $$f_{yx}$$를 구하라.</summary>

**답:** $$f_x = 2xy$$, $$f_y = x^2 + \cos y$$, $$f_{xy} = 2x = f_{yx}$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 원점에서 두 편미분이 모두 있는데 원점에서 연속이 아닌 함수를 들라.</summary>

**답:** $$f(x, y) = \frac{xy}{x^2 + y^2}$$, $$f(0, 0) = 0$$. 두 축 위에서 0이라 편미분은 0이지만, 대각선 $$y = x$$ 위에서는 늘 $$\frac12$$이라 원점에서 연속이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$f(x, y) = x^2 + 4y^2$$의 등고선 $$f = 4$$를 그림으로 설명하고, 어느 방향이 더 가파른지 말하라.</summary>

**답:** $$\frac{x^2}{4} + y^2 = 1$$, 가로 반지름 2, 세로 반지름 1인 타원이다. 같은 높이 차이에 필요한 거리가 $$y$$ 방향에서 더 짧아 $$y$$ 방향이 더 가파르다. 실제로 $$f_y = 8y$$가 $$f_x = 2x$$보다 빨리 커진다.

</details>


[^1]: OpenStax, *Calculus Volume 3*, 4.1절 "Functions of Several Variables"(등고선), 4.2절 "Limits and Continuity", 4.3절 "Partial Derivatives"(정의, 2계 편미분, 클레로 정리).
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 소벨 필터는 영상 처리 교재의 표준 윤곽 검출 연산자다. 19_partial-derivatives_verify.py에서 밝기가 선형으로 변하는 작은 이미지의 차분이 편미분과 같음을 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 두 장은 원본에 없다. [19_partial-derivatives_plot.py](/Hongs_Blog/studies/calculus/code/19_partial-derivatives_plot/)로 그렸고, $$(1, 0)$$의 두 편미분 0과 2(중앙 차분), 예제 함수가 축 위에서 0, 대각선 위에서 원점에 $$10^{-8}$$까지 가까워도 $$\frac12$$인 것을 같은 코드로 확인했다.
{% endraw %}
