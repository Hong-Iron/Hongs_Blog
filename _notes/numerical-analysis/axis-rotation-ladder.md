---
layout: "note"
title: "임의 축 회전 예제 사다리"
display_title: "임의 축 회전 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "08"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
description: "사용 개념: 임의 축 회전의 로드리게스 공식 P' = P\\cos\\theta + (A \\times P)\\sin\\theta + A(A\\cdot P)(1 - \\cos\\theta)."
prev_url: "/studies/numerical-analysis/homogeneous-ladder/"
prev_title: "동차 좌표 예제 사다리"
next_url: "/studies/numerical-analysis/b-spline-ladder/"
next_title: "B-스플라인 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/axis-rotation-ladder/"
---
{% raw %}
사용 개념: [임의 축 회전](/Hongs_Blog/studies/numerical-analysis/axis-rotation/)의 로드리게스 공식 $$P' = P\cos\theta + (A \times P)\sin\theta + A(A\cdot P)(1 - \cos\theta)$$.

하위목표는 넷이다. ① 축을 단위 벡터로: $$A$$를 길이로 나눈다 ② 축 성분: $$A\cdot P$$와 $$A(A\cdot P)$$ ③ 수직 방향: $$A \times P$$ ④ 합치기: 세 항에 $$\cos\theta$$, $$\sin\theta$$, $$1 - \cos\theta$$를 곱해 더한다[^s1].

## 문제 1 · 완전한 풀이

축 $$(0, 0, 2)$$를 중심으로 점 $$(1, 1, 1)$$을 90° 돌려라.

1. *축을 단위 벡터로:* $$A = (0, 0, 1)$$. 길이 2로 나누는 것을 잊으면 틀린다.
2. *축 성분:* $$A\cdot P = 1$$, $$A(A\cdot P) = (0, 0, 1)$$.
3. *수직 방향:* $$A \times P = (0\cdot1 - 1\cdot1,\ 1\cdot1 - 0\cdot1,\ 0) = (-1, 1, 0)$$.
4. *합치기:* $$\cos90° = 0$$, $$\sin90° = 1$$이라 $$P' = (0, 0, 0) + (-1, 1, 0) + (0, 0, 1)\cdot1 = (-1, 1, 1)$$. $$z$$는 그대로이고 $$(x, y) = (1, 1)$$이 90° 돌아 $$(-1, 1)$$이 되었다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [08_axis-rotation-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/08_axis-rotation-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

$$x$$축을 중심으로 점 $$(1, 2, 3)$$을 180° 돌려라.

1. *축을 단위 벡터로:* $$A = (1, 0, 0)$$.
2. *축 성분:* $$A\cdot P = 1$$, $$A(A\cdot P) = (1, 0, 0)$$.
3. *수직 방향:* $$A \times P = (0, -3, 2)$$.
4. *합치기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$\cos180° = -1$$, $$\sin180° = 0$$, $$1 - \cos = 2$$. $$P' = -(1, 2, 3) + 0 + 2(1, 0, 0) = (1, -2, -3)$$. $$x$$는 그대로, $$y$$와 $$z$$의 부호가 바뀐다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

축 $$(1, 1, 0)$$을 중심으로 점 $$(1, 0, 0)$$을 90° 돌려라.

1. *축을 단위 벡터로:* ______
2. *축 성분:* $$A\cdot P = \frac{1}{\sqrt2}$$, $$A(A\cdot P) = (\frac12, \frac12, 0)$$.
3. *수직 방향:* ______
4. *합치기:* $$(\frac12, \frac12, -\frac{1}{\sqrt2})$$.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1. $$A = \frac{1}{\sqrt2}(1, 1, 0)$$.
3. $$A \times P = \frac{1}{\sqrt2}(1\cdot0 - 0\cdot0,\ 0\cdot1 - 1\cdot0,\ 1\cdot0 - 1\cdot1) = (0, 0, -\frac{1}{\sqrt2})$$.
4. $$\cos = 0$$, $$\sin = 1$$이라 $$(0, 0, -\frac{1}{\sqrt2}) + (\frac12, \frac12, 0)$$. 길이는 $$\frac14 + \frac14 + \frac12 = 1$$로 그대로다.

</details>


## 문제 4 · 독립 문제

$$y$$축을 중심으로 점 $$(1, 0, 0)$$을 90° 돌린 결과를 로드리게스 공식으로 구하고, 기본 회전 행렬 $$R_y(90°)$$로 구한 결과와 비교하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$A = (0, 1, 0)$$, $$A\cdot P = 0$$, $$A \times P = (0, 0, -1)$$. $$P' = 0 + (0, 0, -1) + 0 = (0, 0, -1)$$.<br>
$$R_y(90°) = \begin{pmatrix}0 & 0 & 1\\ 0 & 1 & 0\\ -1 & 0 & 0\end{pmatrix}$$이라 $$(1, 0, 0) \to (0, 0, -1)$$로 같다. $$R_y$$가 $$z \to x$$로 보내므로 $$x \to -z$$다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [08_axis-rotation-ladder_p4.py](/Hongs_Blog/studies/numerical-analysis/code/08_axis-rotation-ladder_p4/)</div>

</div>


[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 이 문서의 문제와 수치는 원본에 없다. 슬라이드 6회 p.17~18의 로드리게스 공식을 연습하도록 만들었고, 답은 문제 코드로 확인했다.
{% endraw %}
