---
layout: "note"
title: "동차 좌표 예제 사다리"
display_title: "동차 좌표 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "04"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: 동차 좌표의 평행이동 행렬과 곱하는 순서."
next_url: "/studies/numerical-analysis/axis-rotation-ladder/"
next_title: "임의 축 회전 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/homogeneous-ladder/"
---
{% raw %}
사용 개념: [동차 좌표](/Hongs_Blog/studies/numerical-analysis/homogeneous-coordinates/)의 평행이동 행렬과 곱하는 순서.

"여러 변환을 행렬 하나로"는 같은 하위목표의 되풀이다. ① 순서 정하기: 말로 일어나는 순서대로 변환을 적는다 ② 행렬 쓰기: 변환마다 $$3 \times 3$$ 행렬 ③ 곱하기: 먼저 일어나는 것을 가장 오른쪽에 두고 곱한다 ④ 확인: 점에 적용하거나 특별한 점(중심, 고정점)이 제대로 가는지 본다[^s1].

## 문제 1 · 완전한 풀이

점 $$(1, 1)$$을 중심으로 2배 확대하는 행렬을 만들고 점 $$(3, 2)$$에 적용하라.

1. *순서 정하기:* 중심을 원점으로 옮김 → 2배 확대 → 원래 자리로.
2. *행렬 쓰기:* $$T(-1, -1)$$, $$S(2) = \mathrm{diag}(2, 2, 1)$$, $$T(1, 1)$$.
3. *곱하기:* $$H = T(1, 1)\,S(2)\,T(-1, -1) = \begin{pmatrix}2 & 0 & -1\\ 0 & 2 & -1\\ 0 & 0 & 1\end{pmatrix}$$.
4. *확인:* $$H(3, 2, 1)^\top = (5, 3, 1)^\top$$. 중심에서 $$(2, 1)$$ 떨어진 점이 $$(4, 2)$$ 떨어진 곳으로 갔다. 중심 $$(1, 1)$$은 $$H(1, 1, 1)^\top = (1, 1, 1)^\top$$로 그대로다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [04_homogeneous-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/04_homogeneous-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

점 $$(2, 0)$$을 중심으로 90° 돌리는 행렬을 만들고 점 $$(3, 0)$$에 적용하라.

1. *순서 정하기:* $$(2, 0)$$을 원점으로 → 90° 회전 → 되돌리기.
2. *행렬 쓰기:* $$T(-2, 0)$$, $$R_{90} = \begin{pmatrix}0 & -1 & 0\\ 1 & 0 & 0\\ 0 & 0 & 1\end{pmatrix}$$, $$T(2, 0)$$.
3. *곱하기:* $$H = T(2, 0)\,R_{90}\,T(-2, 0) = \begin{pmatrix}0 & -1 & 2\\ 1 & 0 & -2\\ 0 & 0 & 1\end{pmatrix}$$.
4. *확인:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$H(3, 0, 1)^\top = (0 - 0 + 2,\ 3 + 0 - 2,\ 1) = (2, 1, 1)$$. 중심의 오른쪽 1에 있던 점이 중심의 위쪽 1로 갔다(반시계 90°). 중심 $$(2, 0)$$은 그대로다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

직선 $$y = 1$$에 대해 반사한 다음 $$(3, 0)$$만큼 옮기는 행렬을 만들고 점 $$(1, 4)$$에 적용하라.

1. *순서 정하기:* ______
2. *행렬 쓰기:* $$T(0, -1)$$, $$F_x = \mathrm{diag}(1, -1, 1)$$, $$T(0, 1)$$, $$T(3, 0)$$.
3. *곱하기:* ______
4. *확인:* $$(4, -2)$$.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. 직선 $$y = 1$$을 $$x$$축으로 내림 → $$x$$축 반사 → 다시 올림 → $$(3, 0)$$ 이동.
3. 반사 부분 $$T(0, 1)F_xT(0, -1) = \begin{pmatrix}1 & 0 & 0\\ 0 & -1 & 2\\ 0 & 0 & 1\end{pmatrix}$$, 곧 $$y \to 2 - y$$. 맨 왼쪽에 $$T(3, 0)$$을 곱해 $$H = \begin{pmatrix}1 & 0 & 3\\ 0 & -1 & 2\\ 0 & 0 & 1\end{pmatrix}$$. $$(1, 4) \to (1 + 3, -4 + 2) = (4, -2)$$.

</details>


## 문제 4 · 독립 문제

점을 원점 중심으로 90° 돌린 뒤 $$(1, 2)$$만큼 옮기는 행렬 $$H$$와 그 역행렬 $$H^{-1}$$을 구하라. $$H$$로 옮긴 점 $$(3, 4)$$가 $$H^{-1}$$로 되돌아오는지 확인하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$H = T(1, 2)R_{90} = \begin{pmatrix}0 & -1 & 1\\ 1 & 0 & 2\\ 0 & 0 & 1\end{pmatrix}$$. $$H(3, 4) = (-4 + 1, 3 + 2) = (-3, 5)$$.<br>
역행렬은 거꾸로 되돌린다: 먼저 $$(-1, -2)$$ 이동, 다음 $$-90°$$ 회전. $$H^{-1} = R_{-90}T(-1, -2) = \begin{pmatrix}0 & 1 & -2\\ -1 & 0 & 1\\ 0 & 0 & 1\end{pmatrix}$$. $$H^{-1}(-3, 5) = (5 - 2, 3 + 1) = (3, 4)$$로 돌아온다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [04_homogeneous-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/04_homogeneous-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 원본에 없다. 슬라이드 4회 p.32(점 중심 회전)와 p.41~43(곱하는 순서, 역행렬)을 연습하도록 만들었고, 답은 문제 코드로 확인했다.
{% endraw %}
