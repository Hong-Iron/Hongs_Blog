---
layout: "note"
title: "3차 보간 곡선"
display_title: "3차 보간 곡선 (Cubic Interpolation Curve)"
kind: "concept"
kind_label: "기법"
num: "13"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Cubic Interpolation Curve", "3차 곡선", "Cubic Curve", "블렌딩 함수", "Blending Function", "보간 기하 행렬", "Interpolating Geometry Matrix", "음함수 표현", "Implicit Representation", "매개변수 곡선", "Parametric Curve"]
description: "점 네 개를 주고 그 점들을 모두 지나는 매끄러운 곡선을 그리고 싶을 때 쓴다. x, y, z를 각각 u의 3차식으로 두고 u = 0, \\frac13, \\frac23, 1에서 네 점을 지나게 하면 계수가 하나로 정해진다. 곡선은 네 점에 \"블렌딩 함수\"라는 무게를 곱해 더한 것이다…"
prev_url: "/studies/numerical-analysis/distance-intersection/"
prev_title: "점·직선·평면 사이의 거리와 교점"
next_url: "/studies/numerical-analysis/hermite-curve/"
next_title: "에르미트 곡선"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/cubic-interpolation-curve/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

점 네 개를 주고 그 점들을 모두 지나는 매끄러운 곡선을 그리고 싶을 때 쓴다. $$x$$, $$y$$, $$z$$를 각각 $$u$$의 3차식으로 두고 $$u = 0, \frac13, \frac23, 1$$에서 네 점을 지나게 하면 계수가 하나로 정해진다. 곡선은 네 점에 "블렌딩 함수"라는 무게를 곱해 더한 것이다. 다만 무게가 음수가 될 수 있어 곡선이 점들 바깥으로 튀어나가고, 조각을 이어 붙이면 이음점이 꺾일 수 있다.

</div>


## 예시로 보기

곡선을 식으로 적는 방법은 두 가지다. **음함수 표현**은 $$x^2 + y^2 - r^2 = 0$$(원)처럼 "이 식을 0으로 만드는 점들"이다. 점이 곡선 위에 있는지 확인하기는 쉽다. 하지만 곡선 위의 점을 차례로 만들어 그리기는 어렵다. **매개변수 표현**은 $$\mathbf p(u) = (x(u), y(u), z(u))$$처럼 $$u$$를 넣으면 점이 나온다. 그리기 쉽고, 도함수 $$\frac{d\mathbf p}{du}$$가 접선 방향과 빠르기를 준다[^1][^2].

점 $$(0, 0)$$, $$(1, 2)$$, $$(2, 2)$$, $$(3, 0)$$을 $$u = 0, \frac13, \frac23, 1$$에서 지나는 3차 곡선을 만들면, $$u = \frac12$$에서 점 $$(1.5, 2.25)$$를 지난다. 가운데 두 점의 높이 2보다 높이 솟는다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/13_cubic-interpolation_fig1.svg" alt="그림" width="349" height="320" loading="lazy">

회색 점선과 음영이 네 점을 이은 다각형이다. 곡선은 네 점을 모두 지나지만, 가운데에서는 다각형 위로 0.25만큼 튀어나간다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 보간 기하 행렬 $$M_I$$, 네 점 통과, 블렌딩 함수의 합 1과 인수분해, $$b_0(\frac12) = -\frac1{16}$$, 예시와 카드 C2, 이음점 기울기 — [13_cubic-interpolation_verify.py](/Hongs_Blog/studies/numerical-analysis/code/13_cubic-interpolation_verify/)</div>

</div>


## 정의

좋은 곡선 표현은 국소 조절(점 하나를 움직이면 근처만 바뀜), 매끄러움, 도함수 계산, 안정성, 그리기 쉬움을 갖춰야 한다[^3]. 다항식의 차수가 높으면 굽이가 많아 데이터에 잘 맞지만 계산이 많고 덜 매끄럽다. 차수가 낮으면 매끄럽지만 잘 맞지 않는다. 3차가 그 절충이다[^4]. 긴 곡선은 여러 조각을 이어 만든다[^5].

3차 곡선은 성분마다 계수 넷이다.

$$\mathbf p(u) = \mathbf c_0 + \mathbf c_1u + \mathbf c_2u^2 + \mathbf c_3u^3 = \mathbf u^\top\mathbf c, \qquad \mathbf u = (1, u, u^2, u^3)^\top, \quad 0 \le u \le 1$$


3차원이면 점 하나가 식 3개를 주고 미지수는 12개다. 점 네 개면 식 12개로 딱 맞는다. 네 점에 $$u = 0, \frac13, \frac23, 1$$을 고르게 짝지어 $$\mathbf p = A\mathbf c$$를 세운다. $$A$$의 각 행은 그 $$u$$에서의 $$(1, u, u^2, u^3)$$이다[^6][^7].

$$\mathbf c = A^{-1}\mathbf p = M_I\mathbf p, \qquad M_I = \begin{pmatrix}1 & 0 & 0 & 0\\ -5.5 & 9 & -4.5 & 1\\ 9 & -22.5 & 18 & -4.5\\ -4.5 & 13.5 & -13.5 & 4.5\end{pmatrix}$$


$$M_I$$를 **보간 기하 행렬**이라 한다[^8]. 그러면 $$\mathbf p(u) = \mathbf u^\top M_I\mathbf p = \mathbf b(u)^\top\mathbf p$$로 쓸 수 있다. $$\mathbf b(u) = M_I^\top\mathbf u$$의 네 성분이 **블렌딩 함수**다. 곡선의 점은 네 점 $$\mathbf p_0, \dots, \mathbf p_3$$를 무게 $$b_0(u), \dots, b_3(u)$$로 섞은 것이다[^9].

$$b_0(u) = -\tfrac92(u - \tfrac13)(u - \tfrac23)(u - 1), \quad b_1(u) = \tfrac{27}{2}u(u - \tfrac23)(u - 1)$$


$$b_2(u) = -\tfrac{27}{2}u(u - \tfrac13)(u - 1), \quad b_3(u) = \tfrac92u(u - \tfrac13)(u - \tfrac23)$$


$$b_i$$는 자기 점의 $$u$$에서 1이고 나머지 세 $$u$$에서 0이다[^10]. 네 무게의 합은 늘 1이다. 그러나 $$b_0(\frac12) = -\frac1{16}$$처럼 음수가 될 수 있다. 그래서 곡선이 네 점이 만드는 볼록 다각형 밖으로 나갈 수 있다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/13_cubic-interpolation_fig2.svg" alt="그림" width="502" height="351" loading="lazy">

네 함수는 자기 점의 $$u$$에서 1, 다른 세 점에서 0이다. 음영 부분이 무게가 0 아래로 내려가는 구간이다. 가운데 두 점 사이에서는 양 끝 점의 무게 $$b_0$$, $$b_3$$이 음수가 된다[^s2].

점이 네 개보다 많으면 네 개씩 묶어 조각마다 곡선을 만든다($$\mathbf p_0..\mathbf p_3$$, $$\mathbf p_3..\mathbf p_6$$, …). 이음점에서 위치는 이어지지만 기울기는 맞지 않을 수 있다[^11].

## 활용

- 키프레임 애니메이션에서 정해 둔 위치를 모두 정확히 지나야 할 때 쓴다. 이음점의 꺾임이 문제면 [에르미트 곡선](/Hongs_Blog/studies/numerical-analysis/hermite-curve/)이나 [B-스플라인](/Hongs_Blog/studies/numerical-analysis/b-spline/)으로 바꾼다.
- 흔한 실수: 곡선이 점들 사이에만 머문다고 생각하는 것. 예시에서 곡선은 2.25까지 솟는다.

## 연결

- 선수: [직선과 평면의 방정식](/Hongs_Blog/studies/numerical-analysis/lines-planes/)(매개변수 표현), [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)($$M_I = A^{-1}$$)
- 같은 틀 $$\mathbf u^\top M\mathbf p$$로 만드는 다른 곡선: [에르미트 곡선](/Hongs_Blog/studies/numerical-analysis/hermite-curve/), [베지어 곡선](/Hongs_Blog/studies/linear-algebra/abstract-vector-spaces/), [B-스플라인](/Hongs_Blog/studies/numerical-analysis/b-spline/)
- 다항식 보간의 일반론은 12회에서 다룬다.

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 3차 보간 곡선을 행렬로 쓰는 식과 $$M_I$$를 구하는 방법을 쓰라.</summary>

**답:** $$\mathbf p(u) = \mathbf u^\top M_I\mathbf p$$. $$u = 0, \frac13, \frac23, 1$$에서의 $$(1, u, u^2, u^3)$$을 행으로 세운 $$A$$의 역행렬이 $$M_I$$다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 점 $$(0, 0)$$, $$(1, 2)$$, $$(2, 2)$$, $$(3, 0)$$의 3차 보간 곡선에서 $$u = \frac12$$일 때 점은? 블렌딩 함수 값은 $$b(\frac12) = (-\frac1{16}, \frac9{16}, \frac9{16}, -\frac1{16})$$이다.</summary>

**답:** $$x = \frac{0\cdot(-1) + 1\cdot9 + 2\cdot9 + 3\cdot(-1)}{16} = 1.5$$, $$y = \frac{2\cdot9 + 2\cdot9}{16} = 2.25$$. 점 $$(1.5, 2.25)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 블렌딩 함수가 음수가 될 수 있다는 것이 곡선 모양에 왜 중요한가?</summary>

**답:** 무게가 모두 0 이상이고 합이 1이면 곡선의 점은 조절점들의 가중 평균이라 볼록 껍질 안에 있다. 무게가 음수이면 그 보장이 없어, 곡선이 점들 바깥으로 튀어나가거나 출렁일 수 있다.

</details>


[^1]: 수치해석 7회 강의 자료 「na07_curves」, p.2
[^2]: 같은 자료, p.3
[^3]: 같은 자료, p.4
[^4]: 같은 자료, p.6
[^5]: 같은 자료, p.7
[^6]: 같은 자료, p.8~9
[^7]: 같은 자료, p.10~11
[^8]: 같은 자료, p.12
[^9]: 같은 자료, p.13~14
[^10]: 같은 자료, p.14~15
[^11]: 같은 자료, p.16
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 예시 점과 $$u = \frac12$$ 값, 음수 블렌딩 값과 볼록 껍질 설명, 활용, 흔한 실수, 카드 C2·C3은 원본에 없다. 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림 두 장은 원본에 없다. [13_cubic-interpolation_plot.py](/Hongs_Blog/studies/numerical-analysis/code/13_cubic-interpolation_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: 네 점 통과, $$\mathbf p(\frac12) = (1.5, 2.25)$$, $$b_0(\frac12) = -\frac1{16}$$, 네 함수의 합 1.
{% endraw %}
