---
layout: "note"
title: "B-트리 노드 쪼개기"
display_title: "B-트리 노드 쪼개기 (B-Tree-Split-Child)"
kind: "concept"
kind_label: "알고리즘"
num: "14"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["B-Tree-Split-Child", "B-TREE-SPLIT-CHILD", "노드 분할", "Node Split", "가운데 키", "Median Key"]
description: "책장 한 칸이 꽉 차면 가운데 책 한 권을 위 칸으로 올리고, 남은 책을 반씩 두 칸에 나눠 꽂는 일이다. 꽉 찬 칸이 딱 절반짜리 둘로 갈리므로 두 칸 모두 \"너무 비면 안 된다\"는 규칙을 지키고, 나무의 높이도 그대로다. 다만 가운데 책이 올라갈 자리가 있어야 하므로 위 칸이 …"
prev_url: "/studies/database-design/b-tree-search/"
prev_title: "B-트리 검색"
next_url: "/studies/database-design/b-tree-insert/"
next_title: "B-트리 삽입"
math: true
mermaid: false
code_count: 0
permalink: "/studies/database-design/b-tree-split-child/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

책장 한 칸이 꽉 차면 가운데 책 한 권을 위 칸으로 올리고, 남은 책을 반씩 두 칸에 나눠 꽂는 일이다. 꽉 찬 칸이 딱 절반짜리 둘로 갈리므로 두 칸 모두 "너무 비면 안 된다"는 규칙을 지키고, 나무의 높이도 그대로다. 다만 가운데 책이 올라갈 자리가 있어야 하므로 위 칸이 꽉 차 있지 않을 때만 할 수 있다.

</div>


## 예시로 보기

가득 찬 노드에는 키를 더 넣을 수 없다. 넣으면 키가 $$2t$$개가 되어 위 한계 $$2t - 1$$을 넘는다. 그래서 키를 넣기 전에 가득 찬 노드를 둘로 쪼개 자리를 만든다[^1].

최소 차수 $$t = 4$$인 B-트리에서 노드 [N W]의 가운데 자식 [P Q R S T U V]가 키 7개로 가득 찼다[^2].

```
             [N W]
   +-----------+-----------+
[A B C] [P Q R S T U V] [X Y Z]
```

이 자식을 쪼개면 가운데 키 S가 부모로 올라가 N과 W 사이에 들어간다. S보다 작은 P, Q, R은 원래 노드에 남고, S보다 큰 T, U, V는 새 노드로 옮겨 간다[^s1].

```
            [N S W]
   +-------+-------+-------+
[A B C] [P Q R] [T U V] [X Y Z]
```

두 조각의 키는 3개씩이고, $$t - 1 = 3$$이니 아래 한계를 딱 지킨다. 쪼갠 노드가 잎이 아니라 자식 8개를 가지고 있었다면 자식도 앞의 4개와 뒤의 4개로 나눠 갖는다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: $$t = 4$$에서 [P Q R S T U V]가 [P Q R], S, [T U V]로 갈리고 자식 8개가 4개씩 갈림, 부모가 가득 차 있으면 쪼갤 수 없음, 무작위 삽입 35,940번에서 쪼갠 뒤에도 B-트리 성질을 지킴, 카드 C1·C4 — [15_b-tree-insert_impl.py](/Hongs_Blog/studies/database-design/code/15_b-tree-insert_impl/)</div>

</div>


## 정의

<div class="callout callout-definition" markdown="1">
<div class="callout-title" markdown="span">입력과 출력</div>

- **입력:** 가득 차 있지 않은 내부 노드 $$x$$와 자리 $$i$$. $$x$$의 $$i$$번째 자식 $$x.c_i$$는 가득 차 있어야 한다.
- **출력:** 돌려주는 값은 없다. $$x$$와 그 자식 $$y = x.c_i$$, 새 노드 $$z$$를 고쳐 놓는다[^3].

</div>


가득 찬 노드 $$y$$(키 $$2t - 1$$개)를 가운데 키 $$y.key_t$$ 둘레로 쪼개 키가 $$t - 1$$개씩인 두 노드 $$y$$와 $$z$$로 만든다. 가운데 키는 부모 $$x$$로 올라가 두 노드를 가르는 자리가 된다[^2].

의사코드는 자리를 1부터 센다.

```
B-TREE-SPLIT-CHILD(x, i)
1   z = ALLOCATE-NODE()
2   y = x.c_i
3   z.leaf = y.leaf
4   z.n = t - 1
5   for j = 1 to t - 1
6       z.key_j = y.key_(j+t)
7   if not y.leaf
8       for j = 1 to t
9           z.c_j = y.c_(j+t)
10  y.n = t - 1
11  for j = x.n + 1 downto i + 1
12      x.c_(j+1) = x.c_j
13  x.c_(i+1) = z
14  for j = x.n downto i
15      x.key_(j+1) = x.key_j
16  x.key_i = y.key_t
17  x.n = x.n + 1
18  DISK-WRITE(y)
19  DISK-WRITE(z)
20  DISK-WRITE(x)
```

| 행 | 하는 일 |
|---|---|
| 1~3 | 새 노드 $$z$$를 만든다. $$z$$는 $$y$$ 옆에 놓일 노드라 잎인지 아닌지가 $$y$$와 같다 |
| 4~6 | $$y$$의 큰 쪽 키 $$t - 1$$개($$y.key_{t+1}$$부터 끝까지)를 $$z$$로 옮긴다 |
| 7~9 | $$y$$가 잎이 아니면 큰 쪽 자식 $$t$$개도 $$z$$로 옮긴다 |
| 10 | $$y$$의 키 수를 $$t - 1$$로 줄인다. 작은 쪽 키 $$t - 1$$개만 $$y$$에 남는다 |
| 11~13 | $$x$$의 자식을 뒤에서부터 한 칸씩 밀어 자리를 내고, $$z$$를 $$y$$ 바로 오른쪽 자식으로 넣는다 |
| 14~16 | $$x$$의 키를 뒤에서부터 한 칸씩 밀어 자리를 내고, $$y$$의 가운데 키 $$y.key_t$$를 올려 $$y$$와 $$z$$ 사이에 둔다 |
| 17 | $$x$$의 키 수를 1 늘린다 |
| 18~20 | 고친 세 노드를 디스크에 쓴다 |

위 표는 슬라이드의 줄 설명을 옮긴 것이다. 슬라이드는 4~9행을 "잘라 붙이기"라고 부른다[^4].

### 쪼갠 뒤에도 B-트리다

- **키 수.** $$y$$와 $$z$$는 키가 $$t - 1$$개씩이라 아래 한계를 지킨다. $$x$$는 키가 하나 늘지만, 가득 차 있지 않았으니 $$2t - 1$$개를 넘지 않는다.
- **범위.** $$y$$에는 가운데 키보다 작은 키만, $$z$$에는 큰 키만 있다. 가운데 키가 $$x$$에서 $$y$$와 $$z$$ 사이에 들어갔으니 "키가 범위를 가른다"가 그대로 맞다.
- **깊이.** $$z$$는 $$y$$와 같은 깊이에 놓인다. 잎들의 깊이가 바뀌지 않고 트리의 높이도 그대로다.

세 줄은 슬라이드의 그림을 성질 하나하나에 맞춰 본 것이다[^s2].

### 부모가 가득 차 있으면

가운데 키가 올라갈 자리가 없다. 부모도 쪼개야 하고, 그 부모의 부모도 가득 차 있으면 또 쪼개야 해서 뿌리까지 줄줄이 올라갈 수 있다. 그래서 삽입은 내려가는 길에 만나는 가득 찬 노드를 미리 쪼개 둔다. 그러면 어떤 노드를 쪼갤 때든 그 부모는 가득 차 있지 않다[^2]. 이 약속을 지키는 쪽은 [B-트리 삽입](/Hongs_Blog/studies/database-design/b-tree-insert/)이다.

### 걸리는 시간

키 $$t - 1$$개와 자식 $$t$$개를 옮기고, 부모에서 키와 자식을 많아야 $$2t$$개쯤 한 칸씩 민다. 그래서 $$O(t)$$다[^5]. 디스크에는 세 노드를 한 번씩, 모두 3번 쓴다(18~20행).

## 활용

- 구현: [15_b-tree-insert_impl.py](/Hongs_Blog/studies/database-design/code/15_b-tree-insert_impl/)의 `split_child`
- 삽입에서 쓰이는 자리는 두 곳이다. 가득 찬 뿌리를 쪼갤 때(트리가 한 층 높아진다)와 내려갈 자식이 가득 차 있을 때다: [B-트리 삽입](/Hongs_Blog/studies/database-design/b-tree-insert/)
- 흔한 실수: 가운데 키를 두 조각 가운데 한쪽에 남긴다. 가운데 키는 어느 조각에도 남지 않고 부모로 올라간다. 남기면 한 조각의 키가 $$t$$개가 되고 부모에는 두 조각을 가를 키가 없다.
- 삭제의 "합치기"는 이 동작을 거꾸로 한 것이다. 부모의 키 하나를 내려 두 노드를 하나로 만든다: [B-트리 삭제](/Hongs_Blog/studies/database-design/b-tree-delete/)

## 연결

- 선수: [B-트리](/Hongs_Blog/studies/database-design/b-tree/)(가득 찬 노드, 키 수의 한계)
- 이 동작을 부르는 절차: [B-트리 삽입](/Hongs_Blog/studies/database-design/b-tree-insert/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** $$t = 3$$이다. 노드 [G M]의 첫째 자식 [A B C D E]를 쪼개면 [G M]과 그 자식들은 어떻게 되는가? 나머지 자식은 [J K L], [N O]다.</summary>

**답:** `[C G M] / [A B] [D E] [J K L] [N O]`. 가운데 키 C가 올라가 G 앞에 들어가고, [A B]와 [D E]로 갈린다.<br>
**이유:** 키 5개의 가운데는 셋째인 C다($$y.key_t = y.key_3$$). 두 조각의 키는 $$t - 1 = 2$$개씩이다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 의사코드의 11~16행이 하는 일을 한 문장으로 쓰라.</summary>

**답:** 부모 $$x$$의 자식과 키를 한 칸씩 오른쪽으로 밀어 빈자리를 만들고, 새 노드 $$z$$를 $$y$$ 바로 오른쪽 자식으로, $$y$$의 가운데 키를 그 둘 사이의 키로 끼워 넣는다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 쪼갤 노드의 부모가 가득 차 있으면 왜 안 되는가? 삽입은 이 조건을 어떻게 늘 맞춰 두는가?</summary>

**답:** 가운데 키가 부모로 올라가 부모의 키가 하나 늘기 때문이다. 부모가 가득 차 있으면 $$2t$$개가 되어 위 한계를 넘는다. 삽입은 뿌리에서 내려가는 길에 가득 찬 노드를 만나면 그 자리에서 먼저 쪼갠다. 그래서 다음 노드를 쪼갤 때 그 부모(방금 지나온 노드)는 가득 차 있지 않다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C4** $$t = 2$$이다. `[20 40] / [10] [25 30 35] [50]`에서 가운데 자식을 쪼갠 결과를 적어라. 쪼갠 뒤 뿌리는 가득 찼는가?</summary>

**답:** `[20 30 40] / [10] [25] [35] [50]`. 뿌리의 키가 3개($$2t - 1$$)라 가득 찼다.<br>
**이유:** 쪼개기는 부모의 키를 하나 늘린다. 부모가 이렇게 가득 차면, 다음에 이 부모 밑으로 또 쪼갤 일이 생기기 전에 부모부터 쪼개야 한다.

</details>


[^1]: 데이터베이스 설계 3회 강의 자료 「3-2_B-tree-insertion」, p.19 (What if the leaf node is full?)
[^2]: 같은 자료, p.20 (Minimum degree t = 4 그림, "whenever we want to split a full node, we are assured that its parent is not full"), p.22. 04.4-1_B-tree-deletion.pdf, p.6
[^3]: 같은 자료, p.21 (Input & Output, 의사코드)
[^4]: 같은 자료, p.23~24 (줄 설명, "Cutting and Pasting")
[^5]: 같은 자료, p.30 ("The overhead of B-Tree-Split-Child: $$O(t)$$")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 슬라이드 그림은 부모를 "… N W …"로, 다른 자식을 줄여서 그렸다. 두 그림은 부모를 [N W]로 두고 양옆에 잎 [A B C]와 [X Y Z]를 채워, 구현 코드로 쪼갠 결과를 그린 것이다. 자식 8개가 4개씩 갈리는 것도 같은 코드로 확인했다.
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 쪼갠 뒤에도 성질을 지킨다는 세 줄, 디스크 쓰기 횟수, 흔한 실수, 카드 C1~C4는 슬라이드에 글로 없다. 의사코드와 p.20 그림에서 끌어냈고, 카드의 트리는 구현 코드로 확인했다. C1의 트리는 04.4-1_B-tree-deletion.pdf p.10에서 F를 넣을 때 일어나는 쪼개기다.
{% endraw %}
