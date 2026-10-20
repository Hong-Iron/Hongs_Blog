---
layout: "note"
title: "정렬 추적 연습"
display_title: "정렬 추적 연습"
kind: "practice"
kind_label: "연습"
num: "43"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "삽입 정렬, 선택 정렬, 병합 정렬을 손으로 따라가는 문제 다섯 개다. 답을 펼치기 전에 종이에 배열을 한 줄씩 써 본다. 퀵 정렬의 분할은 퀵 정렬 분할 예제 사다리에 따로 있다."
prev_url: "/studies/data-structures/quick-partition-ladder/"
prev_title: "퀵 정렬 분할 예제 사다리"
next_url: "/studies/data-structures/external-sort-ladder/"
next_title: "외부 정렬 시간 계산 예제 사다리"
math: true
mermaid: false
code_count: 1
code_files: [{"t": "43_sort-tracing-practice_p5.py", "u": "/studies/data-structures/code/43_sort-tracing-practice_p5/", "r": "문제 5 풀이"}]
permalink: "/studies/data-structures/sort-tracing-practice/"
---
{% raw %}
삽입 정렬, 선택 정렬, 병합 정렬을 손으로 따라가는 문제 다섯 개다. 답을 펼치기 전에 종이에 배열을 한 줄씩 써 본다. 퀵 정렬의 분할은 [퀵 정렬 분할 예제 사다리](/Hongs_Blog/studies/data-structures/quick-partition-ladder/)에 따로 있다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 다섯 문제의 배열, 비교 횟수, 나누고 합친 차례 — [43_sort-tracing-practice_p5.py](/Hongs_Blog/studies/data-structures/code/43_sort-tracing-practice_p5/)</div>

</div>


## p1 · 삽입 정렬 따라가기

`[5, 2, 4, 6, 1, 3]`을 삽입 정렬한다. 값을 하나 끼울 때마다의 배열과 그 바퀴의 비교 횟수를 쓰고, 비교의 합을 구하라.

사용 개념: [삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/)

풀이 전략: 바퀴마다 "꺼낸 값보다 큰 값은 민다, 크지 않은 값을 만나면 멈춘다"만 되풀이한다. 멈출 때의 비교도 한 번으로 센다. 맨 앞까지 가면 멈추는 비교가 없다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

| 꺼낸 값 | 견준 값 | 비교 | 끝난 뒤 배열 |
|---|---|---|---|
| 2 | 5(민다) | 1 | [2, 5, 4, 6, 1, 3] |
| 4 | 5(민다), 2(멈춘다) | 2 | [2, 4, 5, 6, 1, 3] |
| 6 | 5(멈춘다) | 1 | [2, 4, 5, 6, 1, 3] |
| 1 | 6, 5, 4, 2(모두 민다) | 4 | [1, 2, 4, 5, 6, 3] |
| 3 | 6, 5, 4(민다), 2(멈춘다) | 4 | [1, 2, 3, 4, 5, 6] |

합은 $$1 + 2 + 1 + 4 + 4 = 12$$번이다.

</details>


변형: 같은 길이의 역순 `[6, 5, 4, 3, 2, 1]`이면 비교는 몇 번인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

바퀴마다 맨 앞까지 가서 $$1 + 2 + 3 + 4 + 5 = 15$$번이다. $$\frac{(n - 1)n}{2}$$에 $$n = 6$$을 넣은 값이다.

</details>


## p2 · 선택 정렬 따라가기

같은 `[5, 2, 4, 6, 1, 3]`을 선택 정렬(가장 큰 값을 오른쪽 끝으로)한다. 한 바퀴마다의 배열을 쓰고, 비교의 합을 구하라.

사용 개념: [선택 정렬](/Hongs_Blog/studies/data-structures/selection-sort/)

풀이 전략: 바퀴마다 "아직 자리가 정해지지 않은 앞부분"의 범위를 먼저 적는다. 그 안에서 가장 큰 값을 찾아 범위의 맨 끝 칸과 맞바꾼다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

| 바퀴 | 찾는 범위 | 가장 큰 값 | 끝난 뒤 배열 |
|---|---|---|---|
| 1 | 여섯 칸 | 6 (3번 칸 ↔ 5번 칸) | [5, 2, 4, 3, 1, 6] |
| 2 | 앞의 다섯 칸 | 5 (0번 칸 ↔ 4번 칸) | [1, 2, 4, 3, 5, 6] |
| 3 | 앞의 네 칸 | 4 (2번 칸 ↔ 3번 칸) | [1, 2, 3, 4, 5, 6] |
| 4 | 앞의 세 칸 | 3 (이미 제자리) | [1, 2, 3, 4, 5, 6] |
| 5 | 앞의 두 칸 | 2 (이미 제자리) | [1, 2, 3, 4, 5, 6] |

비교는 $$5 + 4 + 3 + 2 + 1 = 15$$번이다. 셋째 바퀴에서 이미 정렬이 끝났지만 선택 정렬은 그것을 알지 못해 끝까지 돈다. p1의 삽입 정렬은 같은 입력에서 12번이었다.

</details>


## p3 · 두 줄 합치기

정렬된 두 줄 A = (3, 7, 8, 12), B = (1, 4, 9)를 합친다. 값을 하나 옮길 때마다의 A, B, C를 쓰고 비교 횟수를 구하라.

사용 개념: [병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/)의 두 줄 합치기

풀이 전략: 두 줄의 맨 앞만 본다. 한 줄이 비면 남은 줄은 비교 없이 붙인다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

| 견주는 두 값 | 옮기는 값 | A | B | C |
|---|---|---|---|---|
| 3과 1 | 1 | (3, 7, 8, 12) | (4, 9) | (1) |
| 3과 4 | 3 | (7, 8, 12) | (4, 9) | (1, 3) |
| 7과 4 | 4 | (7, 8, 12) | (9) | (1, 3, 4) |
| 7과 9 | 7 | (8, 12) | (9) | (1, 3, 4, 7) |
| 8과 9 | 8 | (12) | (9) | (1, 3, 4, 7, 8) |
| 12와 9 | 9 | (12) | () | (1, 3, 4, 7, 8, 9) |
| B가 비었다 | 12 | () | () | (1, 3, 4, 7, 8, 9, 12) |

비교는 6번이다. 값이 일곱 개이므로 많아야 $$7 - 1 = 6$$번인데, 그 최대가 나왔다. 두 줄의 값이 번갈아 나올수록 비교가 많다.

</details>


변형: A = (1, 2), B = (5, 6, 7, 8)이면 비교는 몇 번인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">변형의 답</summary>

2번이다. 1과 5, 2와 5를 견주면 A가 비고, B의 네 값은 비교 없이 붙인다.

</details>


## p4 · 병합 정렬의 나누기와 합치기

`[9, 4, 7, 1, 8, 2, 6, 3, 5]`를 병합 정렬한다. 앞 조각이 반을 올림한 개수를 갖는다. (a) 처음 세 번의 나누기를 쓰라. (b) 합친 결과를 만들어지는 차례대로 모두 쓰라. (c) 합치기는 모두 몇 번인가?

사용 개념: [병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/)

풀이 전략: 9개는 5개와 4개로, 5개는 3개와 2개로, 3개는 2개와 1개로 나뉜다. 재귀는 왼쪽 조각을 끝까지 마친 뒤 오른쪽 조각으로 간다. 합친 결과는 "조각이 완성되는 차례"로 적는다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

(a) [9, 4, 7, 1, 8] / [2, 6, 3, 5] → [9, 4, 7] / [1, 8] → [9, 4] / [7].<br>
(b) [4, 9] → [4, 7, 9] → [1, 8] → [1, 4, 7, 8, 9] → [2, 6] → [3, 5] → [2, 3, 5, 6] → [1, 2, 3, 4, 5, 6, 7, 8, 9].<br>
(c) 8번이다. 값이 $$n$$개면 합치기는 늘 $$n - 1$$번이다. 합칠 때마다 조각의 수가 하나씩 줄어 9개가 1개가 되기 때문이다.

</details>


## p5 · 어느 정렬의 중간 모습인가

`[6, 3, 8, 1, 7, 2]`를 세 가지 방법으로 정렬하다가 멈췄다. (가) `[3, 6, 8, 1, 7, 2]` (나) `[6, 3, 2, 1, 7, 8]` (다) `[3, 6, 1, 8, 2, 7]`. 각각 삽입 정렬 두 바퀴 뒤, 선택 정렬 두 바퀴 뒤, 길이 1짜리 조각에서 시작한 병합 패스 한 번 뒤 가운데 어느 것인가? 다른 것은 왜 아닌가?

사용 개념: [삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/), [선택 정렬](/Hongs_Blog/studies/data-structures/selection-sort/), [병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/)의 병합 패스

풀이 전략: 방법마다 "중간에 반드시 맞는 말"이 다르다. 삽입 정렬은 앞부분이 정렬되어 있고 뒷부분은 처음 그대로다. 선택 정렬은 뒷부분에 가장 큰 값들이 제자리에 있다. 병합 패스는 두 칸씩 끊어 보면 조각마다 정렬되어 있다.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">풀이</summary>

(가) 삽입 정렬. 앞의 세 칸 3, 6, 8이 정렬되어 있고 뒤의 1, 7, 2는 처음 그대로다.<br>
(나) 선택 정렬. 가장 큰 8과 7이 맨 뒤 두 칸에 제자리를 잡았다. 첫 바퀴에서 8과 2를 맞바꿨고, 둘째 바퀴에서 7은 이미 제자리였다. 앞부분은 정렬되어 있지 않으니 삽입 정렬이 아니다.<br>
(다) 병합 패스. 두 칸씩 끊으면 (3, 6), (1, 8), (2, 7)로 조각마다 정렬되어 있다. 가장 큰 8이 맨 뒤에 없으니 선택 정렬이 아니고, 앞의 세 칸 3, 6, 1이 정렬되어 있지 않으니 삽입 정렬 두 바퀴 뒤도 아니다.

</details>
{% endraw %}
