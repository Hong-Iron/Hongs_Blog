---
layout: "note"
title: "희소 행렬 전치 예제 사다리"
display_title: "희소 행렬 전치 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "12"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-15"
status: "verified"
description: "사용 개념: 희소 행렬의 전치의 세 단계, 3원소 목록."
prev_url: "/studies/data-structures/array-mapping-ladder/"
prev_title: "배열 위치 공식 예제 사다리"
next_url: "/studies/data-structures/stack-applications-practice/"
next_title: "스택 응용 연습"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/sparse-transpose-ladder/"
---
{% raw %}
사용 개념: [희소 행렬의 전치](/Hongs_Blog/studies/data-structures/sparse-matrix-transpose/)의 세 단계, [3원소 목록](/Hongs_Blog/studies/data-structures/sparse-matrix-triples/).

"3원소 목록을 전치하라"는 문제는 같은 하위목표의 되풀이다. ① 목록 적기: 2차원 배열이 주어졌으면 윗줄부터, 줄 안에서는 왼쪽부터 읽어 (행, 열, 값)을 적는다. ② 개수 세기: 열 번호마다 묶음이 몇 개인지 센다. ③ 시작 칸 정하기: 앞 열들의 개수를 더한다. 1열은 0번 칸이다. ④ 꽂기: 목록을 앞에서부터 읽어 그 열의 시작 칸에 (열, 행, 값)으로 꽂고, 시작 칸을 1 올린다. 행·열 번호는 1부터, 목록의 칸 번호는 0부터 센다.

## 문제 1 · 완전한 풀이

다음 4 × 5 행렬을 전치한다.

```
0 0 3 0 4
0 0 5 7 0
0 0 0 0 0
0 2 6 0 0
```

1. *목록 적기:* (1, 3, 3), (1, 5, 4), (2, 3, 5), (2, 4, 7), (4, 2, 2), (4, 3, 6).
2. *개수 세기:* 열 번호가 1인 묶음은 없고, 2는 하나, 3은 셋, 4는 하나, 5는 하나다. 개수는 0, 1, 3, 1, 1.
3. *시작 칸 정하기:* 1열은 0. 2열은 0 + 0 = 0. 3열은 0 + 1 = 1. 4열은 1 + 3 = 4. 5열은 4 + 1 = 5. 시작 칸은 0, 0, 1, 4, 5.
4. *꽂기:* (1, 3, 3)은 열 번호가 3이라 1번 칸에 (3, 1, 3)으로 꽂고 3열의 시작 칸을 2로 올린다. 같은 식으로 (1, 5, 4)는 5번 칸, (2, 3, 5)는 2번 칸, (2, 4, 7)은 4번 칸, (4, 2, 2)는 0번 칸, (4, 3, 6)은 3번 칸에 간다.

칸 번호 순으로 읽은 결과는 (2, 4, 2), (3, 1, 3), (3, 2, 5), (3, 4, 6), (4, 2, 7), (5, 1, 4)다.

## 문제 2 · 마지막 하위목표만 빈칸

```
0 0 2 0
1 0 4 0
0 0 0 0
0 7 9 3
```

1. *목록 적기:* (1, 3, 2), (2, 1, 1), (2, 3, 4), (4, 2, 7), (4, 3, 9), (4, 4, 3).
2. *개수 세기:* 1, 1, 3, 1.
3. *시작 칸 정하기:* 0, 1, 2, 5.
4. *꽂기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

묶음을 차례로 읽으면 꽂는 칸이 2, 0, 3, 1, 4, 5다. (1, 3, 2)는 3열의 시작 칸 2에, (2, 1, 1)은 1열의 시작 칸 0에, (2, 3, 4)는 한 칸 올라간 3에, (4, 2, 7)은 2열의 시작 칸 1에, (4, 3, 9)는 4에, (4, 4, 3)은 5에 간다.<br>
결과는 (1, 2, 1), (2, 4, 7), (3, 1, 2), (3, 2, 4), (3, 4, 9), (4, 4, 3)이다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

```
6 0 0 0 1
0 0 3 0 0
2 0 8 0 5
```

1. *목록 적기:* (1, 1, 6), (1, 5, 1), (2, 3, 3), (3, 1, 2), (3, 3, 8), (3, 5, 5).
2. *개수 세기:* ______
3. *시작 칸 정하기:* 0, 2, 2, 4, 4.
4. *꽂기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. 열 번호 1, 3, 5에 둘씩 있고 2, 4에는 없다. 개수는 2, 0, 2, 0, 2다. 3번의 시작 칸에서 이웃한 값의 차이를 보면 거꾸로 알아낼 수도 있다.
4. 꽂는 칸은 차례로 0, 4, 2, 1, 3, 5다. 결과는 (1, 1, 6), (1, 3, 2), (3, 2, 3), (3, 3, 8), (5, 1, 1), (5, 3, 5)다. 새 2행과 4행에는 묶음이 없다.

</details>


## 문제 4 · 독립 문제

5행 3열 행렬의 3원소 목록이 (1, 2, 4), (2, 1, 7), (3, 2, 1), (3, 3, 9), (5, 1, 6), (5, 3, 2)다. (가) 전치한 목록을 구하라. (나) 세 단계에서 고리가 모두 몇 번 도는지 세고, 2차원 배열에서 칸마다 옮기는 방법, 열 번호마다 목록 전체를 훑는 방법과 견주라.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) 개수는 2, 2, 2이고 시작 칸은 0, 2, 4다. 꽂는 칸은 차례로 2, 0, 3, 4, 1, 5다. 결과는 (1, 2, 7), (1, 5, 6), (2, 1, 4), (2, 3, 1), (3, 3, 9), (3, 5, 2)이고, 전치한 행렬은 3행 5열이다.<br>
(나) 열 수 $$n = 3$$, 0이 아닌 칸 수 $$t = 6$$이다. 세 단계는 개수 칸을 0으로 만드는 데 3번, 세는 데 6번, 시작 칸에 2번, 꽂는 데 6번, 모두 $$2t + 2n - 1 = 17$$번이다. 2차원 배열은 $$5 \times 3 = 15$$번, 열마다 훑기는 $$3 \times 6 = 18$$번이다. 이 행렬은 칸 15개 가운데 6개가 0이 아니라 세 방법이 비슷하다. 세 단계가 크게 앞서는 것은 0이 훨씬 많은 큰 행렬에서다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 네 문제의 개수, 시작 칸, 꽂는 칸, 결과 목록을 확인했고, 결과가 2차원 배열을 뒤집어 만든 목록과 같다. 문제 4의 횟수 17, 15, 18 — [12_sparse-transpose-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/12_sparse-transpose-ladder_p4/)</div>

</div>
{% endraw %}
