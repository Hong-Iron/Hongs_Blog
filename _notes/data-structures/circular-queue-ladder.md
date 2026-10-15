---
layout: "note"
title: "원형 큐 추적 예제 사다리"
display_title: "원형 큐 추적 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "14"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 원형 큐의 AddQ, DeleteQ와 빔·가득 참 판정."
prev_url: "/studies/data-structures/stack-applications-practice/"
prev_title: "스택 응용 연습"
next_url: "/studies/data-structures/linked-list-practice/"
next_title: "연결 리스트 연습"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/circular-queue-ladder/"
---
{% raw %}
사용 개념: [원형 큐](/Hongs_Blog/studies/data-structures/circular-queue/)의 AddQ, DeleteQ와 빔·가득 참 판정.

"연산을 차례로 한 뒤의 front, rear, 칸 내용을 써라"는 문제는 같은 하위목표의 되풀이다. 칸 수를 $$n$$이라 하자. `front`는 첫 원소의 한 칸 앞, `rear`는 마지막 원소의 칸이다.

- ① 넣을 칸 계산: $$\text{next} = (\texttt{rear} + 1) \bmod n$$.
- ② 넣기: next가 `front`와 같으면 가득 찼으니 아무것도 바꾸지 않는다. 다르면 `rear`를 next로 옮기고 그 칸에 쓴다.
- ③ 빼기: `front == rear`면 비었다. 아니면 `front`를 $$(\texttt{front} + 1) \bmod n$$으로 옮기고 그 칸의 값을 돌려준다. 칸의 값은 지우지 않는다.
- ④ 세기: 원소 수는 $$(\texttt{rear} - \texttt{front} + n) \bmod n$$이고, $$n - 1$$이면 가득 찼다.

## 문제 1 · 완전한 풀이

6칸 원형 큐에 A, B, C가 [2], [3], [4]에 들어 있다. front = 1, rear = 4다. AddQ(D), DeleteQ(), AddQ(E)를 차례로 한다.

1. *AddQ(D), 넣을 칸 계산:* next = (4 + 1) mod 6 = 5.
2. *넣기:* 5는 front(1)와 다르다. rear = 5, [5]에 D를 쓴다.
3. *DeleteQ(), 빼기:* front(1) ≠ rear(5)라 비지 않았다. front = (1 + 1) mod 6 = 2, [2]의 A를 돌려준다. A는 칸에 남아 있다.
4. *AddQ(E), 넣을 칸 계산:* next = (5 + 1) mod 6 = 0. 끝 칸 다음은 0번 칸이다.
5. *넣기:* 0은 front(2)와 다르다. rear = 0, [0]에 E를 쓴다.
6. *세기:* (0 − 2 + 6) mod 6 = 4개. B, C, D, E가 [3], [4], [5], [0]에 있다. 5개가 아니니 가득 차지 않았다.

마지막 상태는 front = 2, rear = 0이고 칸에는 E, −, A, B, C, D가 적혀 있다.

## 문제 2 · 마지막 하위목표만 빈칸

4칸 원형 큐가 front = rear = 0으로 비어 있다. AddQ(1), AddQ(2), DeleteQ(), AddQ(3), AddQ(4)를 차례로 한다.

1. *AddQ(1):* next = 1, front(0)와 다르다. rear = 1, [1] = 1.
2. *AddQ(2):* next = 2. rear = 2, [2] = 2.
3. *DeleteQ():* front = 1, [1]의 1을 돌려준다.
4. *AddQ(3):* next = 3. rear = 3, [3] = 3.
5. *AddQ(4):* next = (3 + 1) mod 4 = 0, front(1)와 다르다. rear = 0, [0] = 4.
6. *세기:* 원소 수와 가득 찼는지 ______. 이어서 AddQ(5)를 하면 ______.

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

원소 수는 (0 − 1 + 4) mod 4 = 3이다. $$n - 1 = 3$$이므로 가득 찼다. 칸에는 4, 1, 2, 3이 적혀 있고, 큐에 든 것은 2, 3, 4다([1]의 1은 빼낸 값이다).<br>
AddQ(5)는 next = (0 + 1) mod 4 = 1이 front와 같아서 들어가지 않는다. front와 rear는 그대로다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

5칸 원형 큐가 front = rear = 3으로 비어 있다. AddQ(a), AddQ(b), AddQ(c), DeleteQ(), AddQ(d), AddQ(e), AddQ(f), DeleteQ(), DeleteQ()를 차례로 한다.

1. *AddQ(a):* rear = 4.
2. *AddQ(b):* rear = ______
3. *AddQ(c):* rear = 1.
4. *DeleteQ():* front = ______, 돌려준 값 ______
5. *AddQ(d):* rear = 2.
6. *AddQ(e):* rear = 3. *세기:* ______
7. *AddQ(f):* ______
8. *DeleteQ():* front = 0, b를 돌려준다.
9. *DeleteQ():* front = ______, 돌려준 값 ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

{: start="2"}
2. next = (4 + 1) mod 5 = 0이라 rear = 0이다. b는 [0]에 들어간다.
4. front = (3 + 1) mod 5 = 4, 돌려준 값은 [4]의 a다.
6. 원소 수는 (3 − 4 + 5) mod 5 = 4다. $$n - 1 = 4$$라 가득 찼다.
7. next = (3 + 1) mod 5 = 4가 front와 같아서 f는 들어가지 않는다.
9. front = 1, 돌려준 값은 [1]의 c다. 남은 것은 [2]의 d와 [3]의 e, 두 개다.

</details>


## 문제 4 · 독립 문제

8칸 원형 큐에서 front = 6, rear = 2다. (가) 원소는 몇 개이고 어느 칸에 어떤 순서로 있는가? (나) 가득 찰 때까지 몇 개를 더 넣을 수 있고, 그때 rear는 얼마인가? (다) 가득 찬 뒤 DeleteQ를 두 번 하면 front와 원소 수는? (라) (나)의 가득 찬 상태에서, "rear를 먼저 옮기고 나서 `front == rear`인지 보는" AddQ로 하나를 더 넣으려 하면 어떻게 되는가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) (2 − 6 + 8) mod 8 = 4개다. front의 다음 칸부터 [7], [0], [1], [2] 순서다.<br>
(나) 8칸에는 7개까지 든다. 3개를 더 넣을 수 있고, rear는 3, 4, 5로 간다. rear = 5에서 (5 + 1) mod 8 = 6 = front라 가득 찼다.<br>
(다) front는 7, 0으로 간다. front = 0이고 원소 수는 (5 − 0 + 8) mod 8 = 5다.<br>
(라) rear가 먼저 6으로 가서 front와 같아진다. 가득 찼다고 알리고 돌아오지만 `front == rear`는 빈 큐의 표시라, 들어 있던 일곱 개를 꺼낼 수 없게 된다. 옮길 칸을 먼저 계산해 견주고 자리가 있을 때만 rear를 옮겨야 한다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 컴파일해 실행(ASan·UBSan). 네 문제의 단계마다 front, rear, 원소 수, 돌려준 값, 칸 내용을 확인했다 — [14_circular-queue-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/14_circular-queue-ladder_p4/)</div>

</div>
{% endraw %}
