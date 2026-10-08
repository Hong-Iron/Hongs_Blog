---
layout: "note"
title: "직선과 평면의 방정식"
display_title: "직선과 평면의 방정식 (Lines and Planes)"
kind: "concept"
kind_label: "정의"
num: "02"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Lines and Planes", "매개변수 방정식", "Parametric Equation", "매개변수", "Parametric Variable", "선분", "Line Segment", "법선 벡터", "Normal Vector", "평면의 방정식", "Plane Equation"]
description: "직선은 \"한 점에서 출발해 한 방향으로 u만큼 가기\"로, 평면은 \"한 점을 지나고 한 방향(법선)에 수직인 점들\"로 적는다. 이렇게 벡터로 적으면 2차원과 3차원에서 같은 식을 쓰고, 선분은 u를 0과 1 사이로 묶기만 하면 된다. 식에 점을 넣어 나온 값의 부호로 그 점이 어느 …"
prev_url: "/studies/numerical-analysis/cross-product/"
prev_title: "외적"
next_url: "/studies/numerical-analysis/transformation-classes/"
next_title: "기하 변환의 종류"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/lines-planes/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

직선은 "한 점에서 출발해 한 방향으로 $$u$$만큼 가기"로, 평면은 "한 점을 지나고 한 방향(법선)에 수직인 점들"로 적는다. 이렇게 벡터로 적으면 2차원과 3차원에서 같은 식을 쓰고, 선분은 $$u$$를 0과 1 사이로 묶기만 하면 된다. 식에 점을 넣어 나온 값의 부호로 그 점이 어느 쪽에 있는지도 바로 안다. 다만 컴퓨터의 계산에는 작은 오차가 끼므로 "정확히 0인가"는 "충분히 0에 가까운가"로 바꿔 물어야 한다.

</div>


## 예시로 보기

고등학교에서 배운 $$y = mx + b$$는 수직선($$x = 3$$)을 적지 못한다. 기울기가 무한대라서다. 3차원에서는 $$y = mx + b$$ 같은 식 하나로 직선을 적을 수도 없다.

대신 새 변수 $$u$$(매개변수)를 하나 두고 $$x$$와 $$y$$를 각각 $$u$$로 적는다. 슬라이드의 예 $$x = u + 1$$, $$y = 2u - 1$$에서 $$u$$에 값을 넣으면 점이 나온다[^1].

| $$u$$ | −1 | 0 | 0.5 | 1 |
|---|---|---|---|---|
| $$(x, y)$$ | $$(0, -3)$$ | $$(1, -1)$$ | $$(1.5, 0)$$ | $$(2, 1)$$ |

$$u$$가 1씩 늘 때마다 점이 $$(1, 2)$$만큼 움직인다. 이 $$(1, 2)$$가 직선의 방향이고, $$u = 0$$일 때의 점 $$(1, -1)$$이 출발점이다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 두 예시 표, 세 점을 지나는 평면, 원점을 지나는 평면에서 실패, 직선과 평면의 교점과 평행 판정, 카드 C2 — [02_lines-planes_verify.py](/Hongs_Blog/studies/numerical-analysis/code/02_lines-planes_verify/)</div>

</div>


## 정의

### 직선

직선은 서로 다른 두 점, 또는 한 점과 한 방향으로 하나로 정해진다[^2]. 출발점 $$\mathbf b$$와 방향 $$\mathbf a$$로 적으면 다음과 같다[^3].

$$\mathbf x = \mathbf a u + \mathbf b, \qquad u \in \mathbb{R}$$


두 점 $$\mathbf p_0$$, $$\mathbf p_1$$을 지나는 직선은 방향을 $$\mathbf p_1 - \mathbf p_0$$로 잡는다: $$\mathbf x = \mathbf p_0 + (\mathbf p_1 - \mathbf p_0)u$$. $$u = 0$$이면 $$\mathbf p_0$$, $$u = 1$$이면 $$\mathbf p_1$$이다[^4].

**선분**은 $$u$$를 $$[0, 1]$$로 묶은 것이다. 슬라이드의 예 $$x = -4u + 1$$, $$y = 3u + 2$$, $$z = 5u - 3$$은 $$(1, 2, -3)$$에서 $$(-3, 5, 2)$$까지의 선분이다[^5].

2차원에서 매개변수를 없애면 $$\frac{x - x_1}{x_2 - x_1} = \frac{y - y_1}{y_2 - y_1}$$(두 점을 지나는 직선)이나 $$ax + by + c = 0$$ 꼴이 된다[^6].

### 평면

평면은 한 직선 위에 있지 않은 세 점, 또는 한 점과 한 방향으로 정해진다[^7]. 그 방향이 **법선 벡터**다. 법선은 평면 위의 어떤 벡터와도 수직인 벡터다[^8].

$$(\mathbf x - \mathbf x_0)\cdot\mathbf n = 0 \quad\Longleftrightarrow\quad ax + by + cz + d = 0$$


$$\mathbf n = (a, b, c)$$이고 $$d = -\mathbf n\cdot\mathbf x_0$$이다. 평면 위의 점에서 $$\mathbf x_0$$로 가는 벡터는 평면 안에 있으니 법선과 내적하면 0이라는 뜻이다[^9]. 한 점과 평면 위의 두 방향 $$\mathbf u$$, $$\mathbf w$$로 적으면 $$\mathbf x = \mathbf x_0 + s\mathbf u + t\mathbf w$$이고, 법선은 $$\mathbf u \times \mathbf w$$다[^10].

세 점을 지나는 평면은 $$ax + by + cz + d = 0$$을 $$d$$로 나눈 $$a'x + b'y + c'z + 1 = 0$$에 세 점을 넣어 미지수 세 개의 연립방정식으로 푼다. 세 점이 $$(a, 0, 0)$$, $$(0, b, 0)$$, $$(0, 0, c)$$이면 답은 $$\frac xa + \frac yb + \frac zc = 1$$이다[^11]. 이 방법은 $$d \ne 0$$일 때만 통한다. 평면이 원점을 지나면 $$d = 0$$이라 나눌 수 없고, 연립방정식의 해가 없다[^s1].

### 점이 어디 있나

$$f(x, y) = ax + by + c$$로 두면 점 $$\mathbf p$$에 대해 다음과 같다[^12].

- $$f(\mathbf p) = 0$$이면 $$\mathbf p$$는 직선 위에 있다.
- 두 점에서 $$f$$의 부호가 같으면 두 점은 같은 쪽에 있다.
- 부호가 다르면 두 점은 서로 다른 쪽에 있다.

평면 $$ax + by + cz + d$$에서도 똑같다[^13]. 매개변수 직선 $$\mathbf x = \mathbf a u + \mathbf b$$ 위에 점 $$\mathbf p$$가 있는지는 축마다 $$u_x = \frac{p_x - b_x}{a_x}$$를 구해 셋이 같은지로 본다[^14]. 방향 $$\mathbf a$$에 0인 성분이 있으면 그 축은 나눌 수 없으므로, 그 축에서는 $$p_x = b_x$$인지를 대신 본다[^s1]. 컴퓨터에서는 반올림 오차가 있어 같음을 $$\vert u_x - u_y\vert  < \varepsilon$$처럼 작은 허용 오차 $$\varepsilon \ll 1$$로 판정한다[^15].

### 직선과 평면이 만나는 점

직선 $$\mathbf x = \mathbf a u + \mathbf b$$를 평면 $$(\mathbf x - \mathbf x_0)\cdot\mathbf n = 0$$에 넣으면 $$u$$에 대한 일차방정식이 된다[^16].

$$u = -\frac{(\mathbf b - \mathbf x_0)\cdot\mathbf n}{\mathbf a\cdot\mathbf n}$$


- $$\mathbf a\cdot\mathbf n \ne 0$$: 한 점에서 만난다.
- $$\mathbf a\cdot\mathbf n = 0$$이고 $$(\mathbf b - \mathbf x_0)\cdot\mathbf n = 0$$: 직선이 평면 안에 있다.
- $$\mathbf a\cdot\mathbf n = 0$$이고 $$(\mathbf b - \mathbf x_0)\cdot\mathbf n \ne 0$$: 평행해서 만나지 않는다.

선분이면 구한 $$u$$가 $$[0, 1]$$ 안에 있는지도 확인한다. 예: 직선 $$\mathbf x = (1, 1, 1)u$$와 평면 $$z = 2$$는 $$u = 2$$, 점 $$(2, 2, 2)$$에서 만난다[^s1].

## 활용

- 그래픽스의 광선 추적은 화면의 각 픽셀에서 광선(직선)을 쏘아 장면의 평면·삼각형과 만나는 $$u$$ 중 가장 작은 양수를 찾는다. 위의 교점 공식이 그 첫 단계다[^s1].
- 흔한 실수: 부동소수점 계산 결과를 `== 0`으로 비교하는 것. 허용 오차로 비교한다.

## 연결

- 선수: [벡터](/Hongs_Blog/studies/linear-algebra/vectors/), [외적](/Hongs_Blog/studies/numerical-analysis/cross-product/)(세 점에서 법선)
- 거리와 여러 교점: [점·직선·평면 사이의 거리와 교점](/Hongs_Blog/studies/numerical-analysis/distance-intersection/)
- 매개변수로 곡선 적기: [극좌표와 매개변수 곡선](/Hongs_Blog/studies/college-math/polar-parametric/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 두 점을 지나는 직선과 선분, 한 점과 법선으로 정한 평면의 벡터 식을 쓰라.</summary>

**답:** 직선 $$\mathbf x = \mathbf p_0 + (\mathbf p_1 - \mathbf p_0)u$$, 선분은 $$u \in [0, 1]$$. 평면 $$(\mathbf x - \mathbf x_0)\cdot\mathbf n = 0$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$(1, 2, -3)$$에서 $$(-3, 5, 2)$$까지의 선분의 중점을 매개변수로 구하라.</summary>

**답:** $$u = 0.5$$를 넣으면 $$(-4\cdot0.5 + 1,\ 3\cdot0.5 + 2,\ 5\cdot0.5 - 3) = (-1, 3.5, -0.5)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 직선과 평면의 교점 공식에서 $$\mathbf a\cdot\mathbf n = 0$$이면 왜 "평행"인가?</summary>

**답:** 직선의 방향 $$\mathbf a$$가 법선에 수직이라는 뜻이다. 그러면 $$\mathbf a$$는 평면과 나란한 방향이다. 직선을 따라 움직여도 평면까지의 거리가 바뀌지 않는다. 그래서 처음부터 평면 위에 있거나($$(\mathbf b - \mathbf x_0)\cdot\mathbf n = 0$$), 영원히 만나지 않는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 세 점을 지나는 평면을 $$a'x + b'y + c'z + 1 = 0$$에 넣어 푸는 방법이 실패하는 세 점을 들라.</summary>

**답:** $$(1, 0, 0)$$, $$(0, 1, 0)$$, $$(1, 1, 0)$$. 이 평면은 $$z = 0$$으로 원점을 지나 $$d = 0$$이다. 세 식 $$a' = -1$$, $$b' = -1$$, $$a' + b' = -1$$이 모순이라 해가 없다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/02.na02_vector.pdf, p.18~19
[^2]: 같은 자료, p.16
[^3]: 같은 자료, p.24
[^4]: 같은 자료, p.20, p.26
[^5]: 같은 자료, p.23
[^6]: 같은 자료, p.17, p.21
[^7]: 같은 자료, p.30
[^8]: 같은 자료, p.35
[^9]: 같은 자료, p.36
[^10]: 같은 자료, p.34, p.37
[^11]: 같은 자료, p.33
[^12]: 같은 자료, p.29
[^13]: 같은 자료, p.38~39
[^14]: 같은 자료, p.27
[^15]: 같은 자료, p.28
[^16]: 같은 자료, p.40
[^s1]: 에이전트 보충. $$d = 0$$일 때와 방향 성분이 0일 때 실패한다는 조건, 교점 예, 광선 추적과 흔한 실수, 카드 C2~C4는 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
