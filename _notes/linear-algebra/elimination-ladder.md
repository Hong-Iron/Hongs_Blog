---
layout: "note"
title: "가우스 소거 예제 사다리"
display_title: "가우스 소거 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "05"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
updated: "2026-10-06"
status: "verified"
description: "사용 개념: 가우스 소거법, 행렬과 행렬-벡터 곱."
next_url: "/studies/linear-algebra/least-squares-ladder/"
next_title: "최소제곱 예제 사다리"
math: true
mermaid: false
code_count: 0
permalink: "/studies/linear-algebra/elimination-ladder/"
---
{% raw %}
사용 개념: [가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/), [행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/).

이 방법을 떠올리는 신호는 **미지수 여러 개에 대한 일차식 여러 개**다. 식의 개수와 상관없이 같은 절차로 해가 있는지, 몇 개인지, 무엇인지를 모두 얻는다. 풀이는 늘 같은 네 하위목표로 나뉜다[^1].

1. *첨가행렬 쓰기:* 계수와 우변을 $$[A \mid \mathbf{b}]$$로 적는다. 없는 항은 0.
2. *전진 소거:* 왼쪽 열부터 피벗을 정하고(0이면 아래 행과 바꾼다) 그 아래를 0으로 만든다.
3. *해의 종류 판정:* $$[0 \cdots 0 \mid c \ne 0]$$ 줄이 있으면 해 없음. 피벗 없는 열이 있으면 그 변수는 자유변수.
4. *후진 대입과 검산:* 아래에서부터 풀고, 원래 식에 넣어 확인한다.

## 문제 1 · 완전한 풀이

$$x + 2y + z = 2$$, $$3x + 8y + z = 12$$, $$4y + z = 2$$.

1. *첨가행렬:* $$\left[\begin{smallmatrix}1 & 2 & 1 & \mid & 2\\ 3 & 8 & 1 & \mid & 12\\ 0 & 4 & 1 & \mid & 2\end{smallmatrix}\right]$$.
2. *전진 소거:* 2행 $$-$$ 3 × 1행 → $$(0, 2, -2 \mid 6)$$. 3행 $$-$$ 2 × 2행 → $$(0, 0, 5 \mid -10)$$.
3. *판정:* 피벗 1, 2, 5가 세 열 모두에 있다. 해가 하나다.
4. *후진 대입과 검산:* $$z = -2$$, $$y = \frac{6 + 2z}{2} = 1$$, $$x = 2 - 2y - z = 2$$. $$3 \cdot 2 + 8 \cdot 1 - 2 = 12$$, $$4 - 2 = 2$$.

## 문제 2 · 마지막 하위목표만 빈칸

$$x + 2y = 5$$, $$3x + 4y = 6$$.

1. *첨가행렬:* $$\left[\begin{smallmatrix}1 & 2 & \mid & 5\\ 3 & 4 & \mid & 6\end{smallmatrix}\right]$$.
2. *전진 소거:* 2행 $$-$$ 3 × 1행 → $$(0, -2 \mid -9)$$.
3. *판정:* 피벗 1, $$-2$$. 해가 하나다.
4. *후진 대입과 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

$$y = \frac{-9}{-2} = 4.5$$, $$x = 5 - 2(4.5) = -4$$. 검산 $$3(-4) + 4(4.5) = -12 + 18 = 6$$.

</details>


## 문제 3 · 하위목표 절반이 빈칸

$$x + y + z = 1$$, $$x + 2y + 3z = 2$$, $$2x + 3y + 4z = 4$$.

1. *첨가행렬:* $$\left[\begin{smallmatrix}1 & 1 & 1 & \mid & 1\\ 1 & 2 & 3 & \mid & 2\\ 2 & 3 & 4 & \mid & 4\end{smallmatrix}\right]$$.
2. *전진 소거:* 2행 $$-$$ 1행 → $$(0, 1, 2 \mid 1)$$. 3행 $$-$$ 2 × 1행 → $$(0, 1, 2 \mid 2)$$.
3. *판정:* ______
4. *후진 대입과 검산:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="3"}
3. 3행 $$-$$ 2행 → $$(0, 0, 0 \mid 1)$$, 즉 $$0 = 1$$. 해가 없다.
4. 대입할 해가 없다. 식으로 보면 셋째 식의 좌변은 첫째와 둘째 식 좌변의 합인데($$2x + 3y + 4z$$), 우변은 $$1 + 2 = 3$$이 아니라 4라 모순이다.

</details>


## 문제 4 · 독립 문제

$$x + y + z = 2$$, $$x + 2y + 3z = 3$$, $$2x + 3y + 4z = 5$$의 모든 해를 구하라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

소거하면 $$(0, 1, 2 \mid 1)$$이 두 번 나오고 셋째 줄은 $$(0, 0, 0 \mid 0)$$이다. 셋째 열에 피벗이 없어 $$z = t$$가 자유변수다. $$y = 1 - 2t$$, $$x = 2 - y - z = 1 + t$$. 모든 해는 $$(x, y, z) = (1, 1, 0) + t(1, -2, 1)$$, $$t \in \mathbb{R}$$($$\in$$은 "~에 속한다")이다. 방향 $$(1, -2, 1)$$은 $$A\mathbf{x} = \mathbf{0}$$의 해다.

**흔한 오답:** 문제 3과 좌변이 같으니 "해 없음"이라고 쓰는 것. 우변이 $$2 + 3 = 5$$로 맞아 모순이 생기지 않는다.

</details>


## 변형 문제

$$y = 1$$, $$x + y = 3$$을 $$\left[\begin{smallmatrix}0 & 1 & \mid & 1\\ 1 & 1 & \mid & 3\end{smallmatrix}\right]$$로 소거하려는데 첫 피벗 자리가 0이다. 어떻게 하는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

두 행을 바꾼다. $$\left[\begin{smallmatrix}1 & 1 & \mid & 3\\ 0 & 1 & \mid & 1\end{smallmatrix}\right]$$이 되어 바로 위삼각꼴이다. $$y = 1$$, $$x = 2$$. 행 바꾸기도 해를 바꾸지 않는 기본 행 연산이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 모든 문제를 유리수 소거로 풀어 판정과 해를 비교, 문제 4의 일반해를 여러 $$t$$에서 대입 — [05_gaussian-elimination_verify.py](/Hongs_Blog/studies/linear-algebra/code/05_gaussian-elimination_verify/)</div>

</div>


[^1]: Strang, *Introduction to Linear Algebra* 5판, 2.2절 "The Idea of Elimination"(행 바꾸기가 필요한 경우 포함), 3.3절 "The Complete Solution to Ax = b"(특수해 + 영공간).
{% endraw %}
