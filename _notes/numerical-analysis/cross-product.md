---
layout: "note"
title: "외적"
display_title: "외적 (Cross Product)"
kind: "concept"
kind_label: "정의"
num: "01"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
updated: "2026-10-09"
status: "verified"
aliases: ["Cross Product", "벡터곱", "Vector Product", "오른손 법칙", "Right-hand Rule"]
description: "3차원 벡터 두 개를 넣으면 둘 모두에 수직인 새 벡터 하나가 나오는 곱셈이다. 오른손 네 손가락을 첫 벡터에서 둘째 벡터 쪽으로 감으면 엄지가 그 방향이고, 길이는 두 벡터가 만드는 평행사변형의 넓이다. 평면의 수직 방향(법선)이나 삼각형 넓이를 한 번에 구할 수 있다. 다만 3…"
next_url: "/studies/numerical-analysis/lines-planes/"
next_title: "직선과 평면의 방정식"
math: true
mermaid: false
code_count: 1
permalink: "/studies/numerical-analysis/cross-product/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

3차원 벡터 두 개를 넣으면 둘 모두에 수직인 새 벡터 하나가 나오는 곱셈이다. 오른손 네 손가락을 첫 벡터에서 둘째 벡터 쪽으로 감으면 엄지가 그 방향이고, 길이는 두 벡터가 만드는 평행사변형의 넓이다. 평면의 수직 방향(법선)이나 삼각형 넓이를 한 번에 구할 수 있다. 다만 3차원에서만 정의되고, 순서를 바꾸면 방향이 뒤집힌다.

</div>


## 예시로 보기

책상 위에 삼각형 하나가 있다. 이 삼각형 면에 수직으로 선 방향을 알고 싶다. 내적은 두 벡터가 얼마나 같은 쪽을 보는지 숫자 하나로만 알려 준다. 수직 방향을 직접 주지는 않는다.

삼각형의 세 꼭짓점이 $$(1, 0, 0)$$, $$(0, 1, 0)$$, $$(0, 0, 1)$$이면 두 변은 $$(-1, 1, 0)$$, $$(-1, 0, 1)$$이다. 두 변의 외적은 $$(1, 1, 1)$$이다. 이 벡터가 삼각형 면에 수직이다. 길이 $$\sqrt3$$의 절반 $$\frac{\sqrt3}{2}$$가 삼각형의 넓이다[^s1].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시, 무작위 벡터 1,000쌍에서 수직·반대칭·넓이 공식·행렬식 꼴, 카드 C2·C4 — [01_cross-product_verify.py](/Hongs_Blog/studies/numerical-analysis/code/01_cross-product_verify/)</div>

</div>


## 정의

두 3차원 벡터 $$\mathbf a = (a_1, a_2, a_3)$$, $$\mathbf b = (b_1, b_2, b_3)$$의 외적은 다음 벡터다[^1].

$$\mathbf a \times \mathbf b = (a_2b_3 - a_3b_2,\ a_3b_1 - a_1b_3,\ a_1b_2 - a_2b_1)$$


성분마다 나머지 두 축의 성분으로 $$2 \times 2$$ 행렬식을 만든다. 첫 성분은 $$\begin{vmatrix}a_2 & a_3\\ b_2 & b_3\end{vmatrix}$$이다. 그래서 단위 벡터 $$\mathbf i, \mathbf j, \mathbf k$$를 첫 행에 넣은 $$3 \times 3$$ 행렬식으로 외워도 된다[^2].

$$\mathbf a \times \mathbf b = \begin{vmatrix}\mathbf i & \mathbf j & \mathbf k\\ a_1 & a_2 & a_3\\ b_1 & b_2 & b_3\end{vmatrix}$$


작은 예: $$(1, 2, 3) \times (4, 5, 6) = (2\cdot6 - 3\cdot5,\ 3\cdot4 - 1\cdot6,\ 1\cdot5 - 2\cdot4) = (-3, 6, -3)$$.

성질[^3]:

- $$\mathbf a \times \mathbf b$$는 $$\mathbf a$$와 $$\mathbf b$$ 모두에 수직이다.
- 두 벡터가 평행하면 $$\mathbf a \times \mathbf b = \mathbf 0$$이다.
- 순서를 바꾸면 부호가 바뀐다: $$\mathbf a \times \mathbf b = -(\mathbf b \times \mathbf a)$$.
- 방향은 오른손 법칙을 따른다: $$\mathbf i \times \mathbf j = \mathbf k$$.
- 길이는 $$\vert \mathbf a \times \mathbf b\vert  = \vert \mathbf a\vert \vert \mathbf b\vert \sin\theta$$이다. $$\theta$$는 두 벡터의 사잇각이다.

길이 공식은 $$\vert \mathbf a \times \mathbf b\vert ^2 = \vert \mathbf a\vert ^2\vert \mathbf b\vert ^2 - (\mathbf a\cdot\mathbf b)^2$$을 성분으로 전개해 확인할 수 있다. 오른쪽은 $$\vert \mathbf a\vert ^2\vert \mathbf b\vert ^2(1 - \cos^2\theta) = \vert \mathbf a\vert ^2\vert \mathbf b\vert ^2\sin^2\theta$$다[^s1].

## 활용

- **법선 벡터.** 세 점 $$\mathbf p, \mathbf q, \mathbf r$$을 지나는 평면의 법선은 $$(\mathbf q - \mathbf p) \times (\mathbf r - \mathbf p)$$다. 그래픽스에서 삼각형 메시의 면마다 이 계산으로 조명용 법선을 만든다[^s1].
- **넓이.** 삼각형 넓이는 $$\frac12\vert (\mathbf q - \mathbf p) \times (\mathbf r - \mathbf p)\vert $$다.
- **꺾는 방향.** 2차원 벡터에 $$z = 0$$을 붙여 외적하면 $$z$$ 성분의 부호가 왼쪽으로 꺾는지(양수), 오른쪽으로 꺾는지(음수)를 알려 준다([계산 기하 기초](/Hongs_Blog/studies/algorithms/geometry-ccw/)).
- 흔한 실수: 법선의 방향이 꼭짓점을 적는 순서에 따라 뒤집힌다는 것을 잊는 것. 메시에서 꼭짓점 순서를 섞으면 면의 앞뒤가 바뀐다.

## 연결

- 선수: [내적과 노름](/Hongs_Blog/studies/linear-algebra/dot-product/), [행렬식](/Hongs_Blog/studies/linear-algebra/determinant/)(행렬식 꼴)
- 평면의 법선으로 쓰는 곳: [직선과 평면의 방정식](/Hongs_Blog/studies/numerical-analysis/lines-planes/), [좌표계 변환](/Hongs_Blog/studies/numerical-analysis/coordinate-frame/)($$N = U \times V$$)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 외적의 성분 공식과 길이 공식, 방향을 정하는 규칙을 쓰라.</summary>

**답:** $$\mathbf a \times \mathbf b = (a_2b_3 - a_3b_2, a_3b_1 - a_1b_3, a_1b_2 - a_2b_1)$$. 길이는 $$\vert \mathbf a\vert \vert \mathbf b\vert \sin\theta$$(평행사변형 넓이). 방향은 두 벡터에 수직이고 오른손 법칙을 따른다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** $$(1, 0, 2) \times (0, 3, 0)$$을 구하라.</summary>

**답:** $$(0\cdot0 - 2\cdot3,\ 2\cdot0 - 1\cdot0,\ 1\cdot3 - 0\cdot0) = (-6, 0, 3)$$.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 행렬식 꼴을 쓰면 $$\mathbf a \times \mathbf b$$가 $$\mathbf a$$에 수직인 이유를 한 줄로 설명할 수 있다. 어떻게?</summary>

**답:** $$(\mathbf a \times \mathbf b)\cdot\mathbf a$$는 첫 행의 $$\mathbf i, \mathbf j, \mathbf k$$ 자리에 $$\mathbf a$$의 성분을 넣은 행렬식이다. 그러면 첫 행과 둘째 행이 같아지고, 같은 행이 두 개인 행렬식은 0이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** 외적에는 결합법칙 $$(\mathbf a \times \mathbf b) \times \mathbf c = \mathbf a \times (\mathbf b \times \mathbf c)$$가 통하지 않는다. 단위 벡터로 반례를 들라.</summary>

**답:** $$(\mathbf i \times \mathbf i) \times \mathbf j = \mathbf 0 \times \mathbf j = \mathbf 0$$. $$\mathbf i \times (\mathbf i \times \mathbf j) = \mathbf i \times \mathbf k = -\mathbf j$$. 둘이 다르다.

</details>


[^1]: 수치해석 2회 강의 자료 「na02_vector」, p.11
[^2]: 수치해석 3회 강의 자료 「na03_matrix」, p.22
[^3]: 수치해석 2회 강의 자료 「na02_vector」, p.12
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 예시의 삼각형, 길이 공식의 유도, 법선·넓이·메시 활용, 흔한 실수, 카드 C2~C4는 원본에 없다. 검증 코드로 확인했다.
{% endraw %}
