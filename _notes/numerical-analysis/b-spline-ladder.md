---
layout: "note"
title: "B-스플라인 예제 사다리"
display_title: "B-스플라인 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "16"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: B-스플라인의 블렌딩 함수 \\mathbf b(u) = \\frac16\\big((1 - u)^3,\\ 4 - 6u^2 + 3u^3,\\ 1 + 3u + 3u^2 - 3u^3,\\ u^3\\big)."
prev_url: "/studies/numerical-analysis/axis-rotation-ladder/"
prev_title: "임의 축 회전 예제 사다리"
next_url: "/studies/numerical-analysis/jacobi-gs-ladder/"
next_title: "야코비와 가우스-자이델 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/b-spline-ladder/"
---
{% raw %}
사용 개념: [B-스플라인](/Hongs_Blog/studies/numerical-analysis/b-spline/)의 블렌딩 함수 $$\mathbf b(u) = \frac16\big((1 - u)^3,\ 4 - 6u^2 + 3u^3,\ 1 + 3u + 3u^2 - 3u^3,\ u^3\big)$$.

곡선 위의 점이나 이음점을 구하는 하위목표는 넷이다. ① 조각 고르기: 그 점을 만드는 조절점 네 개 ② 블렌딩 값: $$u$$를 넣어 네 무게 ③ 무게 합: 조절점에 무게를 곱해 더하기 ④ 확인: 무게 합이 1인지, 이음점이면 양쪽 조각이 같은지[^s1].

## 문제 1 · 완전한 풀이

조절점 $$(0, 0)$$, $$(2, 4)$$, $$(4, 4)$$, $$(6, 0)$$으로 만든 조각의 $$u = \frac12$$ 점을 구하라.

1. *조각 고르기:* 조절점이 넷뿐이라 조각 하나, $$\mathbf p_0..\mathbf p_3$$.
2. *블렌딩 값:* $$\frac16\left(\frac18,\ 4 - \frac64 + \frac38,\ 1 + \frac32 + \frac34 - \frac38,\ \frac18\right) = \left(\frac1{48}, \frac{23}{48}, \frac{23}{48}, \frac1{48}\right)$$.
3. *무게 합:* $$x = \frac{0 + 2\cdot23 + 4\cdot23 + 6}{48} = 3$$, $$y = \frac{4\cdot23 + 4\cdot23}{48} = \frac{23}{6}$$.
4. *확인:* 무게 합 $$\frac{48}{48} = 1$$. 점 $$(3, \frac{23}{6}) \approx (3, 3.83)$$은 가운데 두 조절점의 높이 4보다 조금 낮다. 조절점을 지나지 않고 안쪽으로 끌려 들어간다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [16_b-spline-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/16_b-spline-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

같은 조절점으로 조각의 출발점 $$\mathbf p(0)$$을 구하라.

1. *조각 고르기:* $$\mathbf p_0..\mathbf p_3$$.
2. *블렌딩 값:* $$\mathbf b(0) = \left(\frac16, \frac46, \frac16, 0\right)$$.
3. *무게 합:* $$\frac16\left((0, 0) + 4(2, 4) + (4, 4)\right) = (2, \frac{10}{3})$$.
4. *확인:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

무게 합 $$\frac16 + \frac46 + \frac16 = 1$$. 출발점은 $$\mathbf p_1 = (2, 4)$$가 아니라 $$\mathbf p_0, \mathbf p_1, \mathbf p_2$$의 평균 $$\frac16(\mathbf p_0 + 4\mathbf p_1 + \mathbf p_2)$$이다. 균등 B-스플라인은 $$\mathbf p_0$$에서도, $$\mathbf p_1$$에서도 시작하지 않는다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

조절점 $$(0, 0)$$, $$(1, 2)$$, $$(3, 3)$$, $$(5, 2)$$, $$(6, 0)$$에서 첫 조각과 둘째 조각의 이음점 위치와 그 점의 도함수를 구하라.

1. *조각 고르기:* ______
2. *블렌딩 값:* 첫 조각 $$u = 1$$의 무게 $$(0, \frac16, \frac46, \frac16)$$, 둘째 조각 $$u = 0$$의 무게 $$(\frac16, \frac46, \frac16, 0)$$.
3. *무게 합:* ______
4. *확인:* 양쪽 조각이 같은 점 $$(3, \frac83)$$과 같은 도함수 $$(2, 0)$$을 준다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 첫 조각 $$\mathbf p_0..\mathbf p_3$$, 둘째 조각 $$\mathbf p_1..\mathbf p_4$$. 둘이 $$\mathbf p_1, \mathbf p_2, \mathbf p_3$$를 함께 쓴다.
3. 위치 $$\frac16(\mathbf p_1 + 4\mathbf p_2 + \mathbf p_3) = \frac16\big((1, 2) + (12, 12) + (5, 2)\big) = (3, \frac83)$$. 도함수 $$\frac12(\mathbf p_3 - \mathbf p_1) = \frac12(4, 0) = (2, 0)$$.

</details>


## 문제 4 · 독립 문제

조절점 8개($$\mathbf p_0..\mathbf p_7$$)로 만든 균등 3차 B-스플라인이 있다. (a) $$\mathbf p_3$$을 옮기면 바뀌는 조각은 어느 것인가? (b) 곡선이 정확히 $$\mathbf p_0$$에서 시작하게 하려면 조절점을 어떻게 놓으면 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(a) 조각은 $$\mathbf p_0..\mathbf p_3$$, $$\mathbf p_1..\mathbf p_4$$, …, $$\mathbf p_4..\mathbf p_7$$의 다섯 개다. $$\mathbf p_3$$을 쓰는 것은 앞의 넷(0~3번 조각)이고, 마지막 조각 $$\mathbf p_4..\mathbf p_7$$은 그대로다.<br>
(b) $$\mathbf p_0$$을 세 번 겹쳐 놓는다. 첫 조각의 출발점이 $$\frac16(\mathbf p_0 + 4\mathbf p_0 + \mathbf p_0) = \mathbf p_0$$이 된다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [16_b-spline-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/16_b-spline-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 원본에 없다. 슬라이드 7회 p.29~31의 이음점 조건과 블렌딩 함수를 연습하도록 만들었고, 답은 분수로 정확히 계산하는 문제 코드로 확인했다.
{% endraw %}
