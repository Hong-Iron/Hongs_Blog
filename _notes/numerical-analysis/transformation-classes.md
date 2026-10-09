---
layout: "note"
title: "기하 변환의 종류"
display_title: "기하 변환의 종류 (Classes of Transformations)"
kind: "concept"
kind_label: "정의"
num: "03"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Classes of Transformations", "강체 변환", "Rigid-body Transformation", "등거리 변환", "Isometry", "닮음 변환", "Similarity Transformation", "전단", "Shear", "아핀 변환", "Affine Transformation", "사영 변환", "Projective Transformation", "불변량", "Invariant"]
description: "도형을 옮기고 돌리고 늘이는 변환은 \"무엇을 그대로 두는가\"로 나뉜다. 길이까지 지키면 강체 변환, 모양(각)만 지키면 닮음 변환, 평행만 지키면 아핀 변환, 곧은 선만 지키면 사영 변환이다. 뒤로 갈수록 더 많은 변환이 들어가지만 지켜 주는 성질은 줄어든다. 그래서 어떤 계산을 …"
prev_url: "/studies/numerical-analysis/lines-planes/"
prev_title: "직선과 평면의 방정식"
next_url: "/studies/numerical-analysis/homogeneous-coordinates/"
next_title: "동차 좌표"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/transformation-classes/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

도형을 옮기고 돌리고 늘이는 변환은 "무엇을 그대로 두는가"로 나뉜다. 길이까지 지키면 강체 변환, 모양(각)만 지키면 닮음 변환, 평행만 지키면 아핀 변환, 곧은 선만 지키면 사영 변환이다. 뒤로 갈수록 더 많은 변환이 들어가지만 지켜 주는 성질은 줄어든다. 그래서 어떤 계산을 변환 뒤에도 믿을 수 있는지는 변환의 종류에 달려 있다.

</div>


## 예시로 보기

정사각형 그림 하나에 네 가지 변환을 해 본다[^1].

| 변환 | 그림 | 그대로인 것 | 바뀌는 것 |
|---|---|---|---|
| 회전·평행이동 | 같은 정사각형이 다른 자리에서 기울어짐 | 길이, 각, 넓이 | 위치, 방향 |
| 고르게 2배 | 두 배 큰 정사각형 | 각(모양) | 길이, 넓이 |
| 전단 | 옆으로 밀린 평행사변형 | 평행, 넓이 | 각, 길이 |
| 원근 | 먼 쪽이 좁은 사다리꼴 | 곧은 선 | 평행, 비 |

원근 그림에서 $$x = \pm1$$인 두 평행선은 거리 $$z = 1$$에서 폭 2, $$z = 3$$에서 폭 $$\frac23$$으로 보인다. 평행선이 좁아진다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/03_transformation-classes_fig1.svg" alt="그림" loading="lazy">

점선이 원래 정사각형이다. 오른쪽으로 갈수록 모양이 더 많이 바뀌고, 그대로 남는 성질은 줄어든다. 전단에서는 직각이 34°로 눕고, 원근에서는 평행하던 두 변이 먼 쪽으로 갈수록 좁아진다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 강체·닮음·전단·아핀 변환에서 무작위 점 300세트로 길이·각·중점·평행 판정, 원근의 폭, 카드 C2 — [03_transformation-classes_verify.py](/Hongs_Blog/studies/numerical-analysis/code/03_transformation-classes_verify/)</div>

</div>


## 정의

변환해도 바뀌지 않는 성질을 **불변량**이라 한다. 슬라이드가 쓰는 성질은 다음과 같다[^2][^3].

- 위치(원점에서의 거리), 거리(두 점 사이), 각(두 선 사이), 방향(절대 각)
- 곧은 선을 곧은 선으로 보냄(공선성)
- 거리를 지킴: 그러면 각, 넓이, 부피도 지킨다
- 각을 지킴(등각)

2차원 변환을 $$x' = ax + by + t_x$$, $$y' = cx + dy + t_y$$로 쓴다. $$(x, y)$$는 원래 좌표, $$(x', y')$$는 변환 뒤 좌표, $$(t_x, t_y)$$는 평행이동이다. 행렬 $$M = \begin{pmatrix}a & b\\ c & d\end{pmatrix}$$의 조건이 종류를 가른다.

| 종류 | 조건 | 지키는 것 | 예 |
|---|---|---|---|
| 강체(등거리) 변환 | $$M^\top = M^{-1}$$, $$\det M = \pm1$$ | 거리, 각, 넓이 | 평행이동, 회전, 반사[^4][^5] |
| 닮음 변환 | $$M = kM_0$$, $$M_0M_0^\top = I$$, $$\det M_0 = \pm1$$ | 각(모양), 길이의 비 | 강체 변환 + 고른 확대[^6][^7] |
| 전단 | $$x$$ 방향: $$a = d = 1$$, $$b = k$$, $$c = 0$$ | 넓이($$\det M = 1$$), 평행 | 축 방향으로 좌표에 비례해 밀기[^8][^9] |
| 아핀 변환 | $$\det M \ne 0$$ | 곧은 선, 평행, 한 선 위 길이의 비 | 위 모두 + 축마다 다른 확대[^10][^11] |

$$k$$는 확대 배율이다. 닮음 변환에서 길이는 모두 $$k$$배가 된다.

종류들은 포함 관계를 이룬다. 강체 ⊂ 닮음 ⊂ 아핀 ⊂ 사영이다. 선형변환(원점을 지키는 $$\mathbf x' = M\mathbf x$$)은 회전, 고른 확대, 축별 확대, 전단을 포함하지만 평행이동은 포함하지 않는다. 원근 투영은 아핀이 아니고 사영 변환에만 들어간다[^12].

가역 선형변환은 연립방정식 $$\mathbf x' = M\mathbf x$$에서 $$\vert M\vert  \ne 0$$일 때 역변환이 하나로 정해진다. 평행이동을 더한 $$\mathbf x' = M\mathbf x + \mathbf t$$가 아핀 변환이다[^13].

## 활용

- 아핀 변환은 중점을 중점으로 보낸다. 그래서 삼각형을 아핀 변환한 뒤 무게중심을 구하든, 무게중심을 변환하든 같다. 원근 투영에서는 이것이 깨진다. 3D 그래픽스가 원근 보정 텍스처 매핑을 따로 하는 이유다[^s1].
- 흔한 실수: 아핀 변환 뒤에도 각이 그대로라고 믿는 것. 전단 하나로 직각이 약 34°가 된다(검증 코드, $$k = 1.5$$).

## 연결

- 선수: [선형변환](/Hongs_Blog/studies/linear-algebra/linear-transformations/), [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)($$\vert M\vert $$의 뜻: 넓이 배율)
- 평행이동까지 행렬 하나로: [동차 좌표](/Hongs_Blog/studies/numerical-analysis/homogeneous-coordinates/)
- 사영 변환의 예: [평행 투영과 원근 투영](/Hongs_Blog/studies/numerical-analysis/projection/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 강체, 닮음, 아핀 변환의 행렬 조건과 각각이 지키는 성질을 쓰라.</summary>

**답:** 강체: $$M^\top M = I$$, $$\vert M\vert  = \pm1$$, 거리·각·넓이. 닮음: $$M = kM_0$$($$M_0$$는 직교 행렬), 각과 길이의 비. 아핀: $$\vert M\vert  \ne 0$$, 곧은 선·평행·한 선 위 길이의 비.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$M = \begin{pmatrix}0 & -2\\ 2 & 0\end{pmatrix}$$은 어떤 종류의 변환이고, 무엇을 하는가?</summary>

**답:** $$M = 2\begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}$$이고 괄호 안은 90° 회전(직교 행렬)이다. 그래서 닮음 변환이다. 90° 돌리고 2배로 늘린다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 전단은 넓이를 지킨다. 그런데 왜 강체 변환이 아닌가?</summary>

**답:** 강체 변환은 거리를 지켜야 한다. 전단은 $$\vert M\vert  = 1$$이라 넓이는 그대로지만, 정사각형의 변이 비스듬히 늘어나 길이와 각이 바뀐다. 넓이를 지키는 것은 거리를 지키는 것보다 약한 조건이다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/04.na04_transformation.pdf, p.2~4
[^2]: 같은 자료, p.5~7
[^3]: 같은 자료, p.8
[^4]: 같은 자료, p.9
[^5]: 같은 자료, p.10
[^6]: 같은 자료, p.11
[^7]: 같은 자료, p.12
[^8]: 같은 자료, p.13
[^9]: 같은 자료, p.14
[^10]: 같은 자료, p.15
[^11]: 같은 자료, p.16
[^12]: 같은 자료, p.20
[^13]: 같은 자료, p.17~19
[^s1]: 에이전트 보충. 원근 그림의 폭 계산, 무게중심과 원근 보정 텍스처 매핑, 흔한 실수의 각도, 카드 C2·C3은 원본에 없다. 검증 코드로 확인했다.
[^s2]: 에이전트 보충. 그림은 원본에 없다. [03_transformation-classes_plot.py](/Hongs_Blog/studies/numerical-analysis/code/03_transformation-classes_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: 회전·평행이동 뒤 변의 길이 1, 고르게 2배 뒤 직각, 전단 $$k = 1.5$$에서 각 33.7°, 원근의 폭 2와 $$\frac23$$.
{% endraw %}
