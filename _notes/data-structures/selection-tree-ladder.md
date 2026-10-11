---
layout: "note"
title: "승자 트리와 패자 트리 재경기 예제 사다리"
display_title: "승자 트리와 패자 트리 재경기 예제 사다리"
kind: "practice"
kind_label: "연습"
num: "35"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
updated: "2026-10-12"
status: "verified"
description: "사용 개념: 승자 트리, 패자 트리."
prev_url: "/studies/data-structures/bst-ladder/"
prev_title: "이진 탐색 트리 삽입·삭제 예제 사다리"
next_url: "/studies/data-structures/graph-spanning-practice/"
next_title: "그래프 탐색과 신장 트리 연습"
math: true
mermaid: false
code_count: 1
permalink: "/studies/data-structures/selection-tree-ladder/"
---
{% raw %}
사용 개념: [승자 트리](/Hongs_Blog/studies/data-structures/winner-tree/), [패자 트리](/Hongs_Blog/studies/data-structures/loser-tree/).

"선수 값 하나를 바꾸고 다시 겨룬 뒤의 트리를 써라"는 문제는 같은 하위목표의 되풀이다. ① 길 찾기: 바뀐 선수의 칸 번호를 구하고 2로 나누어 가며 뿌리까지의 경기 노드를 적는다 ② 층마다 다시 겨루기 ③ 우승자 읽기. ②에서 승자 트리는 두 자식 칸의 승자끼리 겨뤄 이긴 쪽을 적고, 패자 트리는 올라온 선수와 칸에 적힌 패자가 겨뤄 진 쪽을 적는다[^1].

모든 문제에서 작은 값이 이긴다. 값이 같으면 번호가 앞선(왼쪽) 선수가 이긴다. 선수가 $$n$$명이면 경기 노드는 1 ~ $$n - 1$$번, 선수는 $$n$$ ~ $$2n - 1$$번 칸이다. 트리는 아래 층부터 `/`로 끊어 적는다[^s1].

## 문제 1 · 완전한 풀이

선수 16명의 값이 4, 3, 6, 8, 1, 5, 7, 3, 2, 6, 9, 4, 5, 2, 5, 8이다. 최소 승자 트리는 3 6 1 3 2 4 2 5 / 3 1 2 2 / 1 2 / 1이다. 우승자의 값 1을 6으로 바꾸고 다시 겨룬다[^2].

1. *길 찾기:* 우승자는 다섯째 선수다. 0부터 세면 4번이라 칸 번호는 $$16 + 4 = 20$$. 2로 나누어 가면 10, 5, 2, 1번 노드다.
2. *10번 노드:* 두 자식은 20번 칸(6)과 21번 칸(5). 5가 이긴다.
3. *5번 노드:* 두 자식은 10번 노드(5)와 11번 노드(3). 3이 이긴다.
4. *2번 노드:* 두 자식은 4번 노드(3)와 5번 노드(3). 값이 같아 번호가 앞선 둘째 선수의 3이 이긴다.
5. *1번 노드:* 두 자식은 2번 노드(3)와 3번 노드(2). 2가 이긴다.
6. *우승자 읽기:* 새 우승자는 2(아홉째 선수)다. 트리는 3 6 5 3 2 4 2 5 / 3 3 2 2 / 3 2 / 2가 된다. 경기는 4번 치렀다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [34_winner-tree_impl.c](/Hongs_Blog/studies/data-structures/code/34_winner-tree_impl/), [35_selection-tree-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/35_selection-tree-ladder_p4/)</div>

</div>


## 문제 2 · 마지막 하위목표만 빈칸

선수 8명의 값이 7, 2, 9, 4, 6, 1, 8, 3이다. 최소 승자 트리는 2 4 1 3 / 2 1 / 1이다(4 ~ 7번 노드 / 2 ~ 3번 노드 / 1번 노드). 우승자의 값 1을 10으로 바꾸고 다시 겨룬다.

1. *길 찾기:* 우승자는 여섯째 선수(5번)다. 칸 번호는 $$8 + 5 = 13$$이고 길은 6, 3, 1번 노드다.
2. *6번 노드:* 두 자식은 12번 칸(6)과 13번 칸(10). 6이 이긴다.
3. *3번 노드:* 두 자식은 6번 노드(6)와 7번 노드(3). 3이 이긴다.
4. *1번 노드와 우승자 읽기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

1번 노드의 두 자식은 2번 노드(2)와 3번 노드(3)다. 2가 이긴다. 새 우승자는 2(둘째 선수)이고, 트리는 2 4 6 3 / 2 3 / 2가 된다. 경기는 3번($$\log_2 8$$) 치렀다.

</details>


## 문제 3 · 하위목표 절반이 빈칸

문제 2와 같은 8명(7, 2, 9, 4, 6, 1, 8, 3)으로 최소 패자 트리를 만들고, 우승자의 값 1을 5로 바꿔 다시 겨룬다.

**만들기.**

1. *4 ~ 7번 노드:* 7 대 2, 9 대 4, 6 대 1, 8 대 3. 진 쪽을 적는다 → 7, 9, 6, 8. 올라가는 쪽은 2, 4, 1, 3.
2. *2 ~ 3번 노드:* ______
3. *1번 노드와 우승자:* 올라온 2와 1이 겨뤄 2가 진다. 1번 노드에 2, 우승자는 1.

**다시 겨루기.**

1. *길 찾기:* 13번 칸 → 6, 3, 1번 노드.
2. *6번 노드:* 올라온 5와 적혀 있던 6. 5가 이겨 올라가고 6이 그대로 남는다.
3. *3번 노드:* ______
4. *1번 노드와 우승자 읽기:* ______

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

**만들기 2.** 2 대 4에서 4가 지고 2가 올라간다. 1 대 3에서 3이 지고 1이 올라간다. 2 ~ 3번 노드에 4, 3을 적는다. 패자 트리는 7 9 6 8 / 4 3 / 2, 우승자 1이다.<br>
**다시 겨루기 3.** 올라온 5와 적혀 있던 3. 3이 이겨 올라가고 5가 남는다. **4.** 올라온 3과 적혀 있던 2. 2가 이겨 우승자가 되고 3이 남는다. 트리는 7 9 6 8 / 4 5 / 3, 새 우승자는 2다. 형제 칸은 한 번도 보지 않았다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [35_selection-tree-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/35_selection-tree-ladder_p4/)</div>

</div>


## 문제 4 · 독립 문제

선수 8명의 값이 5, 8, 2, 9, 7, 3, 6, 4다. (가) 최소 패자 트리와 우승자를 쓰라. (나) "우승자를 적고, 그 선수의 값을 아주 큰 값(∞)으로 바꾸고, 다시 겨루기"를 세 번 한다. 차례로 나오는 값 셋과, 세 번 뒤의 트리와 우승자를 쓰라. (다) 만들 때부터 세 번째 다시 겨루기까지 경기는 모두 몇 번인가?

<details class="callout callout-answer" markdown="1">
<summary class="callout-title" markdown="span">답</summary>

(가) 4 ~ 7번 노드: 5 대 8, 2 대 9, 7 대 3, 6 대 4에서 진 쪽 8, 9, 7, 6(올라가는 쪽 5, 2, 3, 4). 2 ~ 3번 노드: 5 대 2에서 5, 3 대 4에서 4(올라가는 쪽 2, 3). 1번 노드: 2 대 3에서 3. 패자 트리는 8 9 7 6 / 5 4 / 3, 우승자 2.<br>
(나) 나오는 값은 2, 3, 4다.
- 2를 ∞로(10번 칸, 길 5, 2, 1): 5번 노드에서 9가 이겨 ∞가 남고, 2번 노드에서 5가 9를 이겨 9가 남고, 1번 노드에서 3이 5를 이겨 5가 남는다. 트리 8 ∞ 7 6 / 9 4 / 5, 우승자 3.
- 3을 ∞로(13번 칸, 길 6, 3, 1): 6번 노드에 ∞가 남고 7이 올라간다. 3번 노드에서 4가 7을 이겨 7이 남고, 1번 노드에서 4가 5를 이겨 5가 그대로 남는다. 트리 8 ∞ ∞ 6 / 9 7 / 5, 우승자 4.
- 4를 ∞로(15번 칸, 길 7, 3, 1): 7번 노드에 ∞가 남고 6이 올라간다. 3번 노드에서 6이 7을 이겨 7이 그대로 남고, 1번 노드에서 5가 6을 이겨 6이 남는다. 트리 8 ∞ ∞ ∞ / 9 7 / 6, 우승자 5.<br>
(다) 만들 때 $$8 - 1 = 7$$번, 다시 겨루기 한 번에 3번씩 세 번이라 $$7 + 9 = 16$$번이다.

</details>


<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증 — [35_selection-tree-ladder_p4.c](/Hongs_Blog/studies/data-structures/code/35_selection-tree-ladder_p4/)</div>

</div>


[^1]: 자료구조 9회 강의 자료 「DS_Week9_Lecture_BST_2024」, p.53~56 (승자 트리에서 우승자를 바꾸고 다시 겨루기), p.58, p.68 (패자 트리의 정의와 다시 겨루기)
[^2]: 같은 자료, p.29 (16명의 승자 트리), p.53 ("Replace winner with 6.")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 하위목표 이름, 칸 번호 규칙, 같은 값일 때의 규칙, 문제 1의 단계별 값, 문제 2 ~ 4의 선수와 수치는 원본에 없다. 문제 1의 선수와 "우승자를 6으로"는 슬라이드의 것이고, 슬라이드는 다시 겨룬 뒤의 값을 적지 않았다. 모든 답은 문제 코드로 확인했다.
{% endraw %}
