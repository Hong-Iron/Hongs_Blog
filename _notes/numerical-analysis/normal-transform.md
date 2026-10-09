---
layout: "note"
title: "법선 벡터의 변환"
display_title: "법선 벡터의 변환 (Transforming Normal Vectors)"
kind: "concept"
kind_label: "정리"
num: "05"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Transforming Normal Vectors", "법선 변환", "Normal Transformation", "역전치 행렬", "Inverse Transpose", "평면의 변환", "Transforming Planes"]
description: "면을 변환할 때 그 면에 수직인 화살표(법선)까지 같은 행렬로 바꾸면, 화살표가 더는 면에 수직이 아닐 수 있다. 면을 한쪽으로만 늘이면 면은 눕는데 화살표는 반대로 서기 때문이다. 법선은 변환 행렬의 역행렬을 전치한 (M^{-1})^\\top로 바꿔야 수직이 유지된다. 회전처럼 길…"
prev_url: "/studies/numerical-analysis/homogeneous-coordinates/"
prev_title: "동차 좌표"
next_url: "/studies/numerical-analysis/coordinate-frame/"
next_title: "좌표계 변환"
math: true
mermaid: false
code_count: 2
permalink: "/studies/numerical-analysis/normal-transform/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

면을 변환할 때 그 면에 수직인 화살표(법선)까지 같은 행렬로 바꾸면, 화살표가 더는 면에 수직이 아닐 수 있다. 면을 한쪽으로만 늘이면 면은 눕는데 화살표는 반대로 서기 때문이다. 법선은 변환 행렬의 역행렬을 전치한 $$(M^{-1})^\top$$로 바꿔야 수직이 유지된다. 회전처럼 길이와 각을 지키는 변환에서만 두 행렬이 같아 그냥 $$M$$을 써도 된다.

</div>


## 예시로 보기

조명 계산은 면의 법선을 쓴다. 법선이 틀리면 면이 엉뚱하게 밝거나 어둡게 칠해진다.

직선 $$x + y = 1$$의 법선은 $$\mathbf n = (1, 1)$$, 직선을 따라가는 방향(접선)은 $$\mathbf t = (1, -1)$$이다. $$x$$ 방향으로 2배 늘리는 $$M = \begin{pmatrix}2 & 0\\ 0 & 1\end{pmatrix}$$을 한다.

| | 접선 $$M\mathbf t$$ | 법선 후보 | 내적 |
|---|---|---|---|
| $$M$$으로 바꾼 법선 | $$(2, -1)$$ | $$M\mathbf n = (2, 1)$$ | $$4 - 1 = 3$$ (수직 아님) |
| $$(M^{-1})^\top$$으로 바꾼 법선 | $$(2, -1)$$ | $$(\tfrac12, 1)$$ | $$1 - 1 = 0$$ (수직) |

직선이 옆으로 늘어나 더 눕는다. 그러니 법선은 오히려 더 서야 한다. $$(M^{-1})^\top$$는 $$x$$ 성분을 절반으로 줄여 법선을 세운다[^s1].

<img class="note-fig" src="/Hongs_Blog/assets/notes/numerical-analysis/05_normal-transform_fig1.svg" alt="그림" width="544" height="223" loading="lazy">

왼쪽은 원래 직선과 법선이다. 오른쪽에서 주황 화살표 $$M\mathbf n$$은 늘어난 직선에 비스듬하고, 초록 화살표 $$(M^{-1})^\top\mathbf n$$만 수직으로 선다[^s2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표, 무작위 가역 행렬 200개에서 법선의 수직과 평면 변환 공식, 직교 행렬이면 $$(M^{-1})^\top = M$$, 카드 C2 — [05_normal-transform_verify.py](/Hongs_Blog/studies/numerical-analysis/code/05_normal-transform_verify/)</div>

</div>


## 정의

<div class="callout callout-theorem" markdown="1">
<div class="callout-title" markdown="span">법선의 변환</div>

면의 법선 $$N$$과 접선 $$T$$가 수직($$N^\top T = 0$$)일 때, 점과 접선을 가역 행렬 $$M$$으로 바꾸면 $$G = (M^{-1})^\top$$로 바꾼 법선 $$GN$$이 새 접선 $$MT$$에 수직이다. $$M$$이 직교 행렬이면 $$G = M$$이다.

</div>


슬라이드는 $$GN$$과 $$MT$$가 수직일 조건을 다음처럼 적는다[^1].

$$(GN)\cdot(MT) = (GN)^\top(MT) = N^\top G^\top M\,T = 0$$


$$N^\top T = 0$$이므로 $$G^\top M = I$$이면 충분하다. 곧 $$G = (M^{-1})^\top$$다. $$M$$이 직교 행렬이면 $$M^{-1} = M^\top$$이라 $$G = M$$이다[^1][^s1].

### 평면 전체의 변환

평면을 법선과 상수 한 묶음 $$L = \langle N, D\rangle = \langle N, -N\cdot P\rangle$$로 적는다. $$P$$는 평면 위의 한 점이다. 아핀 변환 $$F = TM = \begin{pmatrix}M & T\\ 0 & 1\end{pmatrix}$$로 평면을 옮기면 새 평면은 다음과 같다[^2].

$$N' = (M^{-1})^\top N, \qquad D' = D - N\cdot M^{-1}T, \qquad L' = (F^{-1})^\top L$$


$$D'$$는 새 평면 위의 점 $$FP = MP + T$$를 넣어 얻는다.

<details class="callout callout-proof" markdown="1">
<summary class="callout-title" markdown="span">유도 과정</summary>

\$$D' = -N'\cdot(FP) = -\left((M^{-1})^\top N\right)^\top(MP + T)$$

$$= -N^\top M^{-1}MP - N^\top M^{-1}T$$ (전치의 곱 $$(AB)^\top = B^\top A^\top$$)

$$= D - N\cdot M^{-1}T$$ ($$D = -N\cdot P$$)

</details>


## 활용

- 그래픽스 셰이더는 모델 행렬 $$M$$과 별도로 "법선 행렬" $$(M^{-1})^\top$$(왼쪽 위 $$3 \times 3$$)을 넘긴다. 모델에 축마다 다른 확대가 있을 때 조명이 틀어지지 않게 하려는 것이다[^s1].
- 흔한 실수: 바꾼 법선을 다시 단위 길이로 만들지 않는 것. $$(M^{-1})^\top$$는 길이를 바꾼다.

## 연결

- 선수: [직선과 평면의 방정식](/Hongs_Blog/studies/numerical-analysis/lines-planes/), [동차 좌표](/Hongs_Blog/studies/numerical-analysis/homogeneous-coordinates/), [직교성과 직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/)(직교 행렬)
- 역행렬과 전치: [역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 점을 $$M$$으로 바꿀 때 법선은 무엇으로 바꾸는가? 그냥 $$M$$을 써도 되는 경우는?</summary>

**답:** $$(M^{-1})^\top$$. $$M$$이 직교 행렬(회전, 반사)이면 $$(M^{-1})^\top = M$$이라 그냥 써도 된다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 전단 $$M = \begin{pmatrix}1 & 1\\ 0 & 1\end{pmatrix}$$으로 $$x$$축(법선 $$(0, 1)$$)을 바꾼다. $$M\mathbf n$$과 $$(M^{-1})^\top\mathbf n$$ 중 어느 것이 수직인가?</summary>

**답:** $$(M^{-1})^\top = \begin{pmatrix}1 & 0\\ -1 & 1\end{pmatrix}$$이라 $$(M^{-1})^\top(0, 1) = (0, 1)$$이다. $$x$$축은 전단해도 $$x$$축이라 수직이다. $$M(0, 1) = (1, 1)$$은 $$x$$축에 수직이 아니다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** $$N^\top G^\top MT = 0$$에서 $$G = (M^{-1})^\top$$를 끌어낼 때 쓰는 사실은?</summary>

**답:** 원래 법선과 접선이 수직이라는 $$N^\top T = 0$$. 가운데 $$G^\top M$$이 단위행렬이면 식이 $$N^\top T = 0$$으로 돌아가므로 0이 맞다. $$G^\top M = I$$를 풀면 $$G = (M^{-1})^\top$$다.

</details>


[^1]: 수치해석 5회 강의 자료 「na05_ortho」, p.6
[^2]: 수치해석 6회 강의 자료 「na06_rotation」, p.43
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 p.6은 직교 행렬일 때 $$G = M$$만 결론으로 적는다. 일반식 $$G = (M^{-1})^\top$$는 같은 식에서 바로 나오고 6회 p.43의 평면 변환에 쓰인다. 예시 표, 셰이더의 법선 행렬, 흔한 실수, 카드 C2·C3은 원본에 없다. 검증 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 그림은 원본에 없다. [05_normal-transform_plot.py](/Hongs_Blog/studies/numerical-analysis/code/05_normal-transform_plot/)로 그렸고, 같은 코드로 다음 값을 확인했다: $$M\mathbf n\cdot M\mathbf t = 3$$, $$(M^{-1})^\top\mathbf n = (\frac12, 1)$$과 $$M\mathbf t$$의 내적 0. 화살표는 방향만 보이도록 길이를 같게 그렸다.
{% endraw %}
