---
layout: "note"
title: "반사와 반전"
display_title: "반사와 반전 (Reflection and Inversion)"
kind: "concept"
kind_label: "기법"
num: "07"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Reflection and Inversion", "반사", "Reflection", "대칭 이동", "반전", "Inversion", "점대칭", "거울 변환"]
description: "반사는 거울에 비친 모습처럼 선(3차원에서는 면)을 기준으로 반대편 같은 거리로 점을 보내는 것이고, 반전은 한 점을 기준으로 정반대로 보내는 것이다. 축에 대한 반사는 좌표 하나의 부호만 바꾸면 되므로, 아무 선이나 면에 대한 반사는 \"그 선을 축으로 옮기기 → 축에 대해 반사 …"
prev_url: "/studies/numerical-analysis/coordinate-frame/"
prev_title: "좌표계 변환"
next_url: "/studies/numerical-analysis/axis-rotation/"
next_title: "임의 축 회전"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/reflection/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

반사는 거울에 비친 모습처럼 선(3차원에서는 면)을 기준으로 반대편 같은 거리로 점을 보내는 것이고, 반전은 한 점을 기준으로 정반대로 보내는 것이다. 축에 대한 반사는 좌표 하나의 부호만 바꾸면 되므로, 아무 선이나 면에 대한 반사는 "그 선을 축으로 옮기기 → 축에 대해 반사 → 되돌리기"로 만든다. 반사는 길이와 각은 지키지만 왼손을 오른손으로 바꾸므로 회전으로는 만들 수 없다.

</div>


## 예시로 보기

$$x$$축에 대한 반사는 $$(x, y) \to (x, -y)$$로 쉽다. 그런데 직선 $$y = 1$$에 대한 반사는? 직선을 $$x$$축으로 내리고(아래로 1), 반사하고, 다시 올린다(위로 1).

점 $$(2, 3)$$: 내리면 $$(2, 2)$$ → 반사 $$(2, -2)$$ → 올리면 $$(2, -1)$$. 실제로 $$(2, 3)$$과 $$(2, -1)$$은 $$y = 1$$에서 2씩 떨어져 있다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/07_reflection_fig1.svg" alt="그림" loading="lazy">

파란 F가 원래 모양, 주황 F가 $$y = 1$$에 대한 반사다. 각 점이 직선에서 같은 거리만큼 반대편으로 간다. 반사된 F는 위아래가 뒤집혀서, 원래 F를 어떻게 돌려도 이 모양이 되지 않는다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 축 반사, 2차원 반전 = 180° 회전, 3차원 반전의 행렬식 −1, 원점을 지나는 직선 반사 공식, 예시, 무작위 평면 100개에서 반사 공식과 두 번 반사, 카드 C2 — [07_reflection_verify.py](/Hongs_Blog/studies/numerical-analysis/code/07_reflection_verify/)</div>

</div>


## 정의

**반사**는 직선(3차원에서는 평면)에 대해 거울처럼 뒤집는다. **반전**은 한 점에 대해 $$(x, y) \to (-x, -y)$$로 뒤집는다[^1]. 2차원에서 원점 반전은 180° 회전과 같다. 3차원에서 원점 반전 $$(x, y, z) \to (-x, -y, -z)$$는 행렬식이 $$-1$$이라 회전이 아니다[^2][^s1].

축에 대한 반사는 부호 하나만 바꾼다[^3].

$$F_x = \begin{pmatrix}1 & 0\\ 0 & -1\end{pmatrix}\ (x\text{축}), \qquad F_y = \begin{pmatrix}-1 & 0\\ 0 & 1\end{pmatrix}\ (y\text{축})$$


**원점을 지나고 $$x$$축과 각 $$\theta$$를 이루는 직선.** $$-\theta$$만큼 돌려 직선을 $$x$$축에 눕히고, 반사하고, 다시 $$\theta$$만큼 돌린다[^4]. 곱하면 다음과 같다[^s1].

$$R_\theta F_x R_\theta^{-1} = \begin{pmatrix}\cos2\theta & \sin2\theta\\ \sin2\theta & -\cos2\theta\end{pmatrix}$$


**점 $$P(a, b)$$를 지나는 직선.** 앞뒤로 평행이동을 하나씩 더한다[^5].

$$X' = T R F_x R^{-1} T^{-1} X, \qquad T = \begin{pmatrix}1 & 0 & a\\ 0 & 1 & b\\ 0 & 0 & 1\end{pmatrix}$$


**점 $$P(a, b, c)$$를 지나고 법선이 $$N$$인 평면.** 3차원에서는 좌표 평면에 대한 반사가 부호 하나를 바꾼다($$F_{xy}$$는 $$z$$ 부호)[^6]. $$R$$을 $$N$$을 $$z$$축으로 돌리는 회전, $$T = [a\ b\ c]^\top$$ 평행이동이라 하면 다음과 같다[^7].

$$X' = T R^{-1} F_{xy} R T^{-1} X$$


같은 결과를 법선으로 바로 쓸 수도 있다. $$\hat n$$을 단위 법선이라 하면 $$X' = X - 2\big((X - P)\cdot\hat n\big)\hat n$$이다. 점에서 평면까지 법선 방향으로 간 거리의 두 배만큼 반대로 보내는 것이다[^s1].

## 활용

- 그래픽스에서 거울·수면 반사는 장면을 반사 평면에 대해 뒤집어 한 번 더 그린다. 반사는 행렬식이 −1이라 삼각형의 꼭짓점 순서(앞면/뒷면)가 뒤집히므로, 그릴 때 뒷면 판정을 반대로 바꾼다[^s1].
- 흔한 실수: 법선 공식에 단위 벡터가 아닌 $$N$$을 넣는 것. 거리가 $$\vert N\vert ^2$$배로 잘못 커진다.

## 연결

- 선수: [동차 좌표](/Hongs_Blog/studies/numerical-analysis/homogeneous-coordinates/)(옮기기 → 변환 → 되돌리기)
- 같은 "축으로 옮겨서 하기" 방법: [임의 축 회전](/Hongs_Blog/studies/numerical-analysis/axis-rotation/)
- 반사는 강체 변환이다: [기하 변환의 종류](/Hongs_Blog/studies/numerical-analysis/transformation-classes/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 점 $$P$$를 지나고 $$x$$축과 각 $$\theta$$를 이루는 직선에 대한 반사 행렬을 단계로 쓰라.</summary>

**답:** $$X' = T R F_x R^{-1} T^{-1} X$$. $$T^{-1}$$로 $$P$$를 원점으로, $$R^{-1}$$으로 직선을 $$x$$축으로, $$F_x$$로 반사, $$R$$로 되돌리고, $$T$$로 원래 자리로.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 직선 $$y = x$$에 대해 점 $$(3, 1)$$을 반사하라.</summary>

**답:** $$\theta = 45°$$라 행렬은 $$\begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}$$이다. $$(1, 3)$$. $$x$$와 $$y$$가 서로 바뀐다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 2차원 원점 반전은 회전으로 만들 수 있지만 3차원 원점 반전은 만들 수 없다. 왜인가?</summary>

**답:** 2차원 반전 $$\mathrm{diag}(-1, -1)$$은 행렬식이 $$+1$$이고 180° 회전과 같다. 3차원 반전 $$\mathrm{diag}(-1, -1, -1)$$은 행렬식이 $$-1$$이다. 회전 행렬은 행렬식이 늘 $$+1$$이므로 3차원 반전은 회전이 아니다. 왼손 좌표계를 오른손으로 바꾼다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/06.na06_rotation.pdf, p.2
[^2]: 같은 자료, p.3
[^3]: 같은 자료, p.4
[^4]: 같은 자료, p.5
[^5]: 같은 자료, p.6
[^6]: 같은 자료, p.7
[^7]: 같은 자료, p.8
[^s1]: 에이전트 보충. 예시, 3차원 반전이 회전이 아니라는 점, $$\cos2\theta$$ 꼴 행렬, 법선으로 쓴 평면 반사 공식, 거울 렌더링, 흔한 실수, 카드 C2·C3은 원본에 없다. 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림은 원본에 없다. [07_reflection_plot.py](/Hongs_Blog/studies/numerical-analysis/code/07_reflection_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: $$(2, 3) \to (2, -1)$$, 직선까지 거리 2씩, 반사 행렬의 행렬식 $$-1$$.
{% endraw %}
