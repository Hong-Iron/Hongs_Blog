---
layout: "note"
title: "에르미트 곡선"
display_title: "에르미트 곡선 (Hermite Curve)"
kind: "concept"
kind_label: "기법"
num: "14"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Hermite Curve", "에르미트 보간", "Hermite Interpolation", "에르미트 기하 행렬", "Hermite Geometry Matrix", "접선 벡터", "Tangent Vector"]
description: "점 네 개 대신 \"양 끝점 두 개와, 각 끝점에서 어느 방향으로 얼마나 빠르게 떠나는지(접선) 두 개\"로 3차 곡선을 정한다. 다음 조각이 같은 끝점에서 같은 접선으로 출발하게 하면 이음점이 꺾이지 않고 매끄럽게 이어진다. 대신 사용자가 접선 벡터를 직접 정해야 하는데, 점만 가지…"
prev_url: "/studies/numerical-analysis/cubic-interpolation-curve/"
prev_title: "3차 보간 곡선"
next_url: "/studies/numerical-analysis/curve-continuity/"
next_title: "곡선의 연속성"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/hermite-curve/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

점 네 개 대신 "양 끝점 두 개와, 각 끝점에서 어느 방향으로 얼마나 빠르게 떠나는지(접선) 두 개"로 3차 곡선을 정한다. 다음 조각이 같은 끝점에서 같은 접선으로 출발하게 하면 이음점이 꺾이지 않고 매끄럽게 이어진다. 대신 사용자가 접선 벡터를 직접 정해야 하는데, 점만 가지고 있을 때는 알맞은 접선을 알기 어렵다.

</div>


## 예시로 보기

[3차 보간 곡선](/Hongs_Blog/studies/numerical-analysis/cubic-interpolation-curve/)을 이어 붙이면 이음점에서 기울기가 어긋난다. 검증 코드의 예에서 앞 조각은 이음점에서 $$(3, -9)$$ 방향으로 들어오고, 뒤 조각은 $$(3, -15)$$ 방향으로 나간다. 그래서 이음점이 꺾인다[^1].

에르미트 곡선은 끝점의 접선을 직접 준다. $$\mathbf p(0) = (0, 0)$$, $$\mathbf p(1) = (4, 0)$$, $$\mathbf p'(0) = (0, 6)$$(위로 출발), $$\mathbf p'(1) = (0, -6)$$(아래로 도착)이면 아치 모양이 되고 가운데 $$u = \frac12$$에서 $$(2, 1.5)$$를 지난다. 다음 조각을 $$\mathbf p'(0) = (0, -6)$$으로 시작하면 이음점이 매끄럽다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/14_hermite-curve_fig1.svg" alt="그림" loading="lazy">

왼쪽은 두 조각이 이음점 $$(4, 0)$$에서 같은 접선 $$(0, -6)$$을 써서 꺾이지 않고 이어지는 모습이다. 오른쪽은 접선 방향은 그대로 두고 길이만 6에서 12로 늘린 것이다. 가운데 높이가 1.5에서 3으로 두 배가 된다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$M_H = A^{-1}$$, 블렌딩 함수, 끝점과 접선 재현, 예시와 카드 C2, 이음점의 C¹, 접선 길이에 따른 모양 — [14_hermite-curve_verify.py](/Hongs_Blog/studies/numerical-analysis/code/14_hermite-curve_verify/)</div>

</div>


## 정의

**에르미트 곡선**은 3차 곡선 $$\mathbf p(u) = \mathbf u^\top\mathbf c$$의 계수를 양 끝의 위치와 도함수로 정한다. 도함수는 $$\mathbf p'(u) = \mathbf c_1 + 2\mathbf c_2u + 3\mathbf c_3u^2$$이다. 네 조건을 모으면 $$\mathbf q = A\mathbf c$$다[^2].

$$\mathbf q = \begin{pmatrix}\mathbf p(0)\\ \mathbf p(1)\\ \mathbf p'(0)\\ \mathbf p'(1)\end{pmatrix} = \begin{pmatrix}1 & 0 & 0 & 0\\ 1 & 1 & 1 & 1\\ 0 & 1 & 0 & 0\\ 0 & 1 & 2 & 3\end{pmatrix}\begin{pmatrix}\mathbf c_0\\ \mathbf c_1\\ \mathbf c_2\\ \mathbf c_3\end{pmatrix}$$


$$\mathbf c = A^{-1}\mathbf q = M_H\mathbf q, \qquad M_H = \begin{pmatrix}1 & 0 & 0 & 0\\ 0 & 0 & 1 & 0\\ -3 & 3 & -2 & -1\\ 2 & -2 & 1 & 1\end{pmatrix}, \qquad \mathbf p(u) = \mathbf u^\top M_H\mathbf q$$


블렌딩 함수로 쓰면 $$\mathbf p(u) = \mathbf b(u)^\top\mathbf q$$다[^3].

$$\mathbf b(u) = \begin{pmatrix}2u^3 - 3u^2 + 1\\ -2u^3 + 3u^2\\ u^3 - 2u^2 + u\\ u^3 - u^2\end{pmatrix}$$


앞의 두 함수는 끝점의 무게이고 합이 1이다. 뒤의 두 함수는 접선의 무게이고, 양 끝에서 0이라 끝점의 위치는 바꾸지 않는다.

## 활용

- 키프레임 애니메이션의 위치·카메라 경로, 폰트와 그림 도구의 "핸들" 조절(핸들의 방향과 길이가 접선)에 쓴다. 점들만 있을 때 이웃 점의 차이로 접선을 자동으로 정하는 방식이 캣멀-롬 스플라인이다[^s1].
- 흔한 실수: 접선 벡터의 길이를 무시하는 것. 같은 방향이라도 길이를 두 배로 하면 곡선이 더 크게 부푼다(검증 코드에서 가운데 높이 1.5 → 3).

## 연결

- 선수: [3차 보간 곡선](/Hongs_Blog/studies/numerical-analysis/cubic-interpolation-curve/)(같은 $$\mathbf u^\top M\mathbf q$$ 틀), [도함수](/Hongs_Blog/studies/calculus/derivative/)
- 접선을 점으로 근사하면: [베지어 곡선](/Hongs_Blog/studies/linear-algebra/abstract-vector-spaces/)
- 이음점의 매끄러움: [곡선의 연속성](/Hongs_Blog/studies/numerical-analysis/curve-continuity/), 곡면으로 넓히면: [매개변수 곡면 패치](/Hongs_Blog/studies/numerical-analysis/surface-patches/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 에르미트 곡선을 정하는 네 값과 블렌딩 함수 네 개를 쓰라.</summary>

**답:** $$\mathbf p(0)$$, $$\mathbf p(1)$$, $$\mathbf p'(0)$$, $$\mathbf p'(1)$$. $$2u^3 - 3u^2 + 1$$, $$-2u^3 + 3u^2$$, $$u^3 - 2u^2 + u$$, $$u^3 - u^2$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$\mathbf p(0) = (0, 0)$$, $$\mathbf p(1) = (4, 0)$$, $$\mathbf p'(0) = (0, 6)$$, $$\mathbf p'(1) = (0, -6)$$일 때 $$\mathbf p(\frac12)$$는?</summary>

**답:** $$u = \frac12$$에서 블렌딩 값은 $$(\frac12, \frac12, \frac18, -\frac18)$$. $$x = \frac12\cdot4 = 2$$, $$y = \frac18\cdot6 - \frac18\cdot(-6) = 1.5$$. 점 $$(2, 1.5)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 에르미트 곡선 조각들은 이음점을 매끄럽게 만들 수 있는데 3차 보간 곡선은 왜 그렇지 못한가?</summary>

**답:** 3차 보간은 네 점의 위치만 맞추므로 이음점의 기울기는 각 조각이 알아서 정해 서로 다를 수 있다. 에르미트는 이음점의 기울기 $$\mathbf p'(1)$$을 직접 정하므로, 다음 조각의 $$\mathbf p'(0)$$을 같은 값으로 주면 기울기가 맞는다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/07.na07_curves.pdf, p.16~17
[^2]: 같은 자료, p.18~19
[^3]: 같은 자료, p.19
[^s1]: 에이전트 보충. 이음점 기울기 수치, 아치 예와 카드 C2, 블렌딩 함수의 역할 설명, 캣멀-롬 스플라인, 흔한 실수, 카드 C3은 원본에 없다. 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림은 원본에 없다. [14_hermite-curve_plot.py](/Hongs_Blog/studies/numerical-analysis/code/14_hermite-curve_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: 가운데 점 $$(2, 1.5)$$와 $$(2, 3)$$, 이음점에서 두 조각의 도함수가 모두 $$(0, -6)$$. 화살표는 접선 벡터를 $$\frac13$$ 길이로 줄여 그렸다.
{% endraw %}
