---
layout: "note"
title: "배열 위치 공식 예제 사다리"
display_title: "배열 위치 공식 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "10"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 행 우선 배치와 열 우선 배치의 ic + j, 특수 행렬을 1차원 배열에 담기의 \\frac{i(i-1)}{2} + j - 1."
prev_url: "/studies/data-structures/pointer-address-practice/"
prev_title: "포인터와 주소 계산 연습"
next_url: "/studies/data-structures/sparse-transpose-ladder/"
next_title: "희소 행렬 전치 예제 사다리"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/array-mapping-ladder/"
---
{% raw %}
사용 개념: [행 우선 배치와 열 우선 배치](/Hongs_Blog/studies/data-structures/row-major-mapping/)의 $$ic + j$$, [특수 행렬을 1차원 배열에 담기](/Hongs_Blog/studies/data-structures/triangular-matrix-mapping/)의 $$\frac{i(i-1)}{2} + j - 1$$.

"표의 이 칸은 1차원 배열의 몇 번 위치인가"는 늘 같은 하위목표로 푼다. ① 담는 순서를 정한다(어느 줄부터, 줄 안에서는 어느 쪽부터). ② 내 줄 앞에 있는 줄들의 원소 수를 센다. ③ 내 줄 안에서 내 앞에 있는 원소 수를 센다. ④ 둘을 더한다. 위치는 0부터 센다[^s1].

## 문제 1 · 완전한 풀이

4행 6열인 `int` 배열 `x`를 행 우선으로 한 덩어리에 담았다. `x[3][2]`는 몇 번 위치인가? 배열이 2000번지에서 시작하고 `int`가 4바이트면 그 칸의 주소는? 행과 열은 0부터 센다.

1. *담는 순서:* 0행, 1행, 2행, 3행. 행 안에서는 왼쪽부터다.
2. *앞 줄들의 원소 수:* 3행 앞에 행이 3개 있고 행마다 6칸이다. $$3 \times 6 = 18$$.
3. *내 줄 안에서 앞의 원소 수:* 2열 앞에 0열과 1열, 2칸이 있다.
4. *더하기:* $$18 + 2 = 20$$번 위치다. 주소는 $$2000 + 20 \times 4 = 2080$$번지다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [10_array-mapping-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/10_array-mapping-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

같은 4행 6열 배열을 이번에는 열 우선으로 담았다. `x[3][2]`는 몇 번 위치이고 주소는 몇 번지인가?

1. *담는 순서:* 0열, 1열, …, 5열. 열 안에서는 위부터다.
2. *앞 줄들의 원소 수:* 2열 앞에 열이 2개 있고 열마다 4칸이다. $$2 \times 4 = 8$$.
3. *내 줄 안에서 앞의 원소 수:* 3행 위에 0행, 1행, 2행, 3칸이 있다.
4. *더하기:* 위치는 ______, 주소는 ______번지다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

위치는 $$8 + 3 = 11$$, 주소는 $$2000 + 11 \times 4 = 2044$$번지다. 같은 칸인데 행 우선일 때의 20번과 다르다. 곱하는 수가 "건너뛸 줄 하나의 길이"라서, 행 우선에서는 열 수 6을, 열 우선에서는 행 수 4를 곱한다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

6행 6열인 아래삼각 행렬을 행 우선으로 1차원 배열에 담았다. $$x(5, 3)$$은 몇 번 위치인가? 2차원 배열에 담을 때보다 몇 칸을 아끼는가? 행과 열은 1부터 센다.

1. *담는 순서:* 1행, 2행, …, 6행. 행 안에서는 왼쪽부터이고 대각선 위쪽의 칸은 뺀다.
2. *앞 줄들의 원소 수:* $$k$$행에는 $$k$$칸이 있다. 5행 앞에는 ______칸이 있다.
3. *내 줄 안에서 앞의 원소 수:* 3열 앞에 1열과 2열, 2칸이 있다.
4. *더하기:* ______
5. *아낀 칸 수:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. $$1 + 2 + 3 + 4 = 10$$칸. 식으로는 $$\frac{5 \times 4}{2}$$다.
4. $$10 + 2 = 12$$번 위치.
5. 아래삼각은 $$\frac{6 \times 7}{2} = 21$$칸, 2차원 배열은 36칸이라 15칸을 아낀다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [10_array-mapping-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/10_array-mapping-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

위삼각 행렬은 대각선과 그 위쪽에만 값이 온다. $$x(i, j)$$에 값이 올 수 있는 조건은 $$i \le j$$다. $$n$$행 $$n$$열인 위삼각 행렬을 행 우선으로 1차원 배열에 담을 때 $$x(i, j)$$의 위치를 $$n$$, $$i$$, $$j$$의 식으로 구하라. $$n = 4$$일 때 $$x(3, 4)$$의 위치도 구하라. 행과 열은 1부터 센다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

담는 순서는 1행부터이고, 행 안에서는 대각선의 칸(열 번호가 행 번호와 같은 칸)부터 오른쪽으로 간다.

$$k$$행에는 $$k$$열부터 $$n$$열까지 $$n - k + 1$$칸이 있다. $$i$$행 앞의 원소 수는 $$k = 1$$부터 $$i - 1$$까지 더한 것이다.

$$\sum_{k=1}^{i-1} (n - k + 1) = (i - 1)(n + 1) - \frac{(i-1)i}{2} = \frac{(i - 1)(2n - i + 2)}{2}$$


$$i$$행 안에서 $$j$$열 앞에는 $$i$$열부터 $$j - 1$$열까지 $$j - i$$칸이 있다. 더하면 다음과 같다.

$$\text{위치}(i, j) = \frac{(i - 1)(2n - i + 2)}{2} + (j - i) \qquad (i \le j)$$


$$n = 4$$, $$x(3, 4)$$: $$\frac{2 \times 7}{2} + 1 = 8$$번 위치다. 4행 4열에서 각 행의 첫 칸은 0, 4, 7, 9번 위치이고 3행은 7번과 8번을 쓴다.

아래삼각과 달리 식에 $$n$$이 들어간다. 아래삼각은 앞 행들의 길이가 1, 2, 3, …으로 $$n$$과 상관없지만, 위삼각은 $$n$$, $$n - 1$$, $$n - 2$$, …로 $$n$$에서 시작해 줄어들기 때문이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$n$$ = 1~12의 모든 칸 364개에서 위 식을 2차원 배열과 비교했다 — [10_array-mapping-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/10_array-mapping-ladder_p4/)</div>

</div>


[^s1]: 답은 실제 배열에 담아 견주는 문제 코드로 확인했다.
{% endraw %}
