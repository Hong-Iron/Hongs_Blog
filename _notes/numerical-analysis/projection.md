---
layout: "note"
title: "평행 투영과 원근 투영"
display_title: "평행 투영과 원근 투영 (Parallel and Perspective Projection)"
kind: "concept"
kind_label: "기법"
num: "11"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Parallel Projection", "Perspective Projection", "투영", "Projection", "직교 투영", "Orthographic Projection", "원근 단축", "Perspective Foreshortening", "소실점", "Vanishing Point"]
description: "3차원 장면을 2차원 화면에 옮기는 방법은 두 가지다. 평행 투영은 모든 점을 같은 방향으로 곧장 화면에 떨어뜨려, 멀든 가깝든 크기가 그대로이고 평행선이 평행하게 남는다. 원근 투영은 눈 한 점을 향해 모이는 선으로 옮겨, 먼 것이 작게 보이고 평행선이 한 점으로 모인다. 원근이…"
prev_url: "/studies/numerical-analysis/quaternion/"
prev_title: "쿼터니언"
next_url: "/studies/numerical-analysis/distance-intersection/"
next_title: "점·직선·평면 사이의 거리와 교점"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/projection/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

3차원 장면을 2차원 화면에 옮기는 방법은 두 가지다. 평행 투영은 모든 점을 같은 방향으로 곧장 화면에 떨어뜨려, 멀든 가깝든 크기가 그대로이고 평행선이 평행하게 남는다. 원근 투영은 눈 한 점을 향해 모이는 선으로 옮겨, 먼 것이 작게 보이고 평행선이 한 점으로 모인다. 원근이 실제 눈에 가깝지만, 길이와 평행을 재야 하는 설계도에는 평행 투영을 쓴다.

</div>


## 예시로 보기

눈이 원점에 있고 화면이 $$z = 1$$에 있다. 높이 4인 막대가 거리 4에 있으면 화면에서 높이 1로 보인다. 같은 막대가 거리 8로 물러나면 높이 0.5로 보인다. 두 배 멀면 절반 크기다(원근 단축)[^s1].

철길처럼 $$z$$ 방향으로 뻗은 두 평행선 $$x = \pm1$$은 거리 1에서 폭 2, 거리 10에서 폭 0.2, 거리 1000에서 0.002로 보인다. 멀어질수록 한 점(소실점)으로 모인다. 평행 투영이었다면 폭이 늘 2다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 평행 투영의 평행 유지, 원근 투영의 예시 값, 화면 깊이가 늘 $$d$$, 소실점, 중점이 깨짐, 직선이 직선으로 감, 카드 C2 — [11_projection_verify.py](/Hongs_Blog/studies/numerical-analysis/code/11_projection_verify/)</div>

</div>


## 정의

**투영**은 3차원 월드의 점을 2차원 화면으로 옮긴다[^1].

| | 평행(직교) 투영 | 원근 투영 |
|---|---|---|
| 길이 | 늘거나 줄 수 있다 | 늘거나 줄 수 있다 |
| 각 | 지키지 않을 수 있다 | 지키지 않을 수 있다 |
| 평행선 | 평행하게 남는다 | 평행하지 않을 수 있다 |
| 거리에 따른 크기 | 같다 | 가까운 것이 크다(원근 단축) |

표는 슬라이드 p.29~30을 옮긴 것이다[^2].

**평행 투영**은 평면 $$z = d$$로 $$z$$ 좌표만 $$d$$로 바꾼다[^3].

$$\begin{pmatrix}x'\\ y'\\ z'\\ 1\end{pmatrix} = \begin{pmatrix}1 & 0 & 0 & 0\\ 0 & 1 & 0 & 0\\ 0 & 0 & 0 & d\\ 0 & 0 & 0 & 1\end{pmatrix}\begin{pmatrix}x\\ y\\ z\\ 1\end{pmatrix}$$


**원근 투영**은 눈(원점)에서 점 $$(x, y, z)$$로 가는 선이 화면 $$z = d$$와 만나는 점이다. 닮은 삼각형으로 $$\frac{x'}{d} = \frac xz$$라 다음과 같다[^4].

$$x' = \frac{x}{z/d}, \qquad y' = \frac{y}{z/d}$$


$$z$$로 나누기는 선형변환이 아니다. 그래서 동차 좌표의 마지막 성분 $$w'$$에 $$z/d$$를 넣고, 마지막에 $$w'$$로 나눈다[^5].

$$\begin{pmatrix}x'\\ y'\\ z'\\ w'\end{pmatrix} = \begin{pmatrix}1 & 0 & 0 & 0\\ 0 & 1 & 0 & 0\\ 0 & 0 & 1 & 0\\ 0 & 0 & 1/d & 0\end{pmatrix}\begin{pmatrix}x\\ y\\ z\\ 1\end{pmatrix}, \qquad \frac{x'}{w'} = \frac{x}{z/d},\ \frac{y'}{w'} = \frac{y}{z/d},\ \frac{z'}{w'} = d$$


## 활용

- 3D 게임과 영화는 원근 투영, CAD 도면과 2D 게임의 아이소메트릭 화면은 평행 투영을 쓴다. 그래픽스 파이프라인의 투영 행렬도 마지막 성분으로 나누는 이 방법을 쓴다(원근 나누기)[^s1].
- 원근 투영은 직선을 직선으로 보내지만 선분의 중점은 중점으로 보내지 않는다. 그래서 화면에서 텍스처 좌표를 그냥 선형 보간하면 일그러진다.
- 흔한 실수: $$w'$$로 나누는 단계를 빠뜨리는 것. 그러면 행렬 곱 결과가 원래 좌표와 같아 원근이 없다.

## 연결

- 선수: [동차 좌표](/Hongs_Blog/studies/numerical-analysis/homogeneous-coordinates/)(마지막 성분으로 나누기), [기하 변환의 종류](/Hongs_Blog/studies/numerical-analysis/transformation-classes/)(원근은 사영 변환)
- 투영 전에 카메라 좌표로 바꾸기: [좌표계 변환](/Hongs_Blog/studies/numerical-analysis/coordinate-frame/)
- 선형대수의 사영과 비교: 평행 투영은 [직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)에 평행이동을 더한 것이다

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 화면 $$z = d$$로의 원근 투영 식과, 동차 좌표 행렬로 쓰는 법을 쓰라.</summary>

**답:** $$x' = \frac{x}{z/d}$$, $$y' = \frac{y}{z/d}$$. 행렬의 마지막 행을 $$(0, 0, 1/d, 0)$$으로 두어 $$w' = z/d$$로 만들고, 결과를 $$w'$$로 나눈다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$d = 2$$일 때 점 $$(3, 6, 6)$$의 원근 투영은?</summary>

**답:** $$z/d = 3$$이라 $$(1, 2, 2)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 건물 설계 도면에는 원근 투영과 평행 투영 중 무엇을 쓰나? 다른 쪽은 왜 아닌가?</summary>

**답:** 평행 투영. 거리와 상관없이 같은 길이가 같게 그려지고 평행선이 평행하게 남아, 도면에서 길이를 재고 맞출 수 있다. 원근 투영은 먼 쪽이 작아져 같은 기둥도 길이가 다르게 그려진다.

</details>


[^1]: 2-2학기/수치해석/1.수업자료/06.na06_rotation.pdf, p.28
[^2]: 같은 자료, p.29~30
[^3]: 같은 자료, p.31
[^4]: 같은 자료, p.32
[^5]: 같은 자료, p.33
[^s1]: 에이전트 보충. 막대와 철길 예시, 쓰이는 곳, 중점과 텍스처 보간, 흔한 실수, 직교 사영과의 관계, 카드 C2·C3은 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
