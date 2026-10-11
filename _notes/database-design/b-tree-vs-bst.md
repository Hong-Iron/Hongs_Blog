---
layout: "note"
title: "B-트리와 이진 탐색 트리 비교"
display_title: "B-트리와 이진 탐색 트리 비교"
kind: "concept"
kind_label: "비교"
num: "16"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
updated: "2026-10-12"
status: "verified"
aliases: ["B-Tree vs Binary Search Tree", "B-Tree vs BST", "두 갈래 분기와 여러 갈래 분기"]
description: "둘 다 \"작은 키는 왼쪽, 큰 키는 오른쪽\"이라는 규칙으로 키를 찾아 내려가는 탐색 트리다. 가르는 질문은 \"노드 하나를 읽는 값이 비싼가\"다. 노드를 읽을 때마다 디스크를 한 번 읽어야 하면, 노드 하나에 키를 많이 담아 트리를 낮추는 쪽이 이긴다."
prev_url: "/studies/database-design/b-tree-insert/"
prev_title: "B-트리 삽입"
next_url: "/studies/database-design/b-tree-delete/"
next_title: "B-트리 삭제"
math: true
mermaid: false
code_count: 0
permalink: "/studies/database-design/b-tree-vs-bst/"
---
{% raw %}
둘 다 "작은 키는 왼쪽, 큰 키는 오른쪽"이라는 규칙으로 키를 찾아 내려가는 탐색 트리다. 가르는 질문은 "노드 하나를 읽는 값이 비싼가"다. 노드를 읽을 때마다 디스크를 한 번 읽어야 하면, 노드 하나에 키를 많이 담아 트리를 낮추는 쪽이 이긴다.

## 어느 쪽일까

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** (a) 키 100만 개짜리 색인이 디스크에 있고, 찾을 때마다 노드를 디스크에서 읽어 와야 한다. (b) 키 1,000개를 주기억장치에만 두고 찾는다. 디스크는 쓰지 않는다. 어느 쪽인가?</summary>

**답:** (a) B-트리. 키 100만 개면 가장 고르게 균형 잡힌 이진 탐색 트리도 높이가 19라 디스크를 스무 번 가까이 읽는다. 최소 차수 $$t = 100$$인 B-트리는 높이가 2다. (b) 이진 탐색 트리로 충분하다. 노드를 읽는 값이 싸면 노드를 크게 만들 까닭이 없다.<br>
**이유:** B-트리가 줄여 주는 것은 디스크를 읽는 횟수다. 주기억장치 안에서 견주는 횟수는 둘 다 $$\lg n$$쯤으로 비슷하다([B-트리 검색](/Hongs_Blog/studies/database-design/b-tree-search/)의 표)[^s1].

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** (c) "새 키를 넣을 때마다 그 키만 담은 새 잎을 만들어 매단다." (d) "키를 계속 넣었더니 맨 위 노드가 새로 생기고 모든 잎이 한꺼번에 한 칸씩 깊어졌다." 각각 어느 쪽의 이야기인가?</summary>

**답:** (c) 이진 탐색 트리. B-트리는 새 잎을 만들지 않고 이미 있는 잎에 넣는다. 새 잎을 매달면 그 잎만 깊어져 잎의 깊이가 달라지기 때문이다. (d) B-트리. 가득 찬 뿌리가 쪼개지면 새 뿌리가 위에 얹힌다. 이진 탐색 트리는 뿌리가 그대로이고 새 잎이 달린 길만 길어진다[^1].

</details>


## 결정적 차이

| | 이진 탐색 트리 | B-트리 |
|---|---|---|
| 노드 하나의 키 | 1개 | 여러 개. 뿌리가 아니면 $$t - 1$$개부터 $$2t - 1$$개까지 |
| 한 노드에서 고르는 길 | 2갈래 | $$x.n + 1$$갈래($$x.n$$은 그 노드의 키 수) |
| 새 키가 들어가는 곳 | 새로 만든 잎 | 이미 있는 잎. 가득 차 있으면 먼저 쪼갠다 |
| 자라는 쪽 | 아래. 잎 밑에 잎이 달린다 | 위. 뿌리가 쪼개질 때만 높아진다 |
| 잎의 깊이 | 제각각일 수 있다. 맞추려면 레드-블랙 트리처럼 따로 고치는 규칙이 필요하다 | 늘 모두 같다 |
| 슬라이드 그림의 디스크 읽기 | 5번 | 2번 |
| 키 100만 개일 때 높이 | 가장 고를 때 19 | $$t = 100$$이면 2 |

위 다섯 줄은 슬라이드의 내용이다[^2]. 슬라이드 그림의 5번과 2번은 뿌리가 주기억장치에 있다고 보고 센 수다[^3]. 마지막 줄은 높이의 식에 수를 넣은 것이다[^s1]. 선택을 가르는 줄은 "노드 하나의 키"다. 나머지 줄은 거기서 따라 나온다. 노드에 키를 여럿 담으니 갈림길이 많아지고, 갈림길이 많으니 트리가 낮아진다. 낮은 트리를 계속 낮게 두려고 잎의 깊이를 맞추고, 깊이를 맞추려고 새 잎을 달지 않고 쪼갠다.

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 키 100만 개에서 가장 고른 이진 탐색 트리의 높이 19, $$t = 100$$인 B-트리의 높이가 가장 클 때도 가장 작을 때도 2 — [12_b-tree-height_verify.py](/Hongs_Blog/studies/database-design/code/12_b-tree-height_verify/)</div>

</div>


## 둘 다 아닐 때

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 둘 다 맞지 않는 상황 두 가지와 그때의 선택지를 쓰라.</summary>

**답:** ① 크기 순서는 쓸 일이 없고 "이 키가 있는가"만 빨리 알면 될 때 → 해시. 키를 계산해 자리로 바로 가므로 트리를 내려갈 일이 없다. 대신 "어디부터 어디까지" 같은 범위 검색은 못 한다([파일 조직](/Hongs_Blog/studies/operating-systems/file-organization/)의 직접 파일, [딕셔너리와 집합](/Hongs_Blog/studies/algorithms/hash-dict-set/)). ② 디스크에 두되 정렬된 순서로 한 구간을 죽 읽는 일이 잦을 때 → B-트리의 변형인 B+-트리. 슬라이드는 B+-트리와 B*-트리를 이름만 든다[^s2].

</details>


[^1]: 데이터베이스 설계 3회 강의 자료 「3-2_B-tree-insertion」, p.18 (새 잎을 만드는 이진 탐색 트리와 그럴 수 없는 B-트리), p.26 ("B-trees grow in height at the top … instead of at the bottom")
[^2]: 데이터베이스 설계 3회 강의 자료 「3_B-tree」, p.13~14 (노드의 키 수, "(x.n + 1)-way decision"). 03.3-2_B-tree-insertion.pdf, p.11 (two-way와 multi-way), p.18, p.26
[^3]: 데이터베이스 설계 3회 강의 자료 「3_B-tree」, p.13 ("# of disk I/Os = 5"와 "# of disk I/Os = 2", "Stored in the main memory")
[^s1]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 키 100만 개의 수, 주기억장치에서는 이진 탐색 트리로 충분하다는 판단, 줄 사이의 인과 설명은 슬라이드에 없다. 수는 [B-트리의 높이](/Hongs_Blog/studies/database-design/b-tree-height/)의 두 식과 높이 $$h$$인 이진 트리의 노드 수 한계 $$2^{h+1} - 1$$에서 나오고 검증 코드로 확인했다. 슬라이드의 말은 이진 탐색 트리가 "큰 데이터베이스에서는 디스크를 많이 읽게 되어 알맞지 않다"까지다(03.3_B-tree.pdf p.13).
[^s2]: <span class="fn-tag" title="수업 자료에 없고 따로 보탠 내용">보충</span> 해시와 B+-트리를 고르는 기준은 슬라이드에 없다. 해시의 "하나 찾기는 좋고 범위 검색은 못 한다"는 [파일 조직](/Hongs_Blog/studies/operating-systems/file-organization/)의 표 12.1에 있다. B+-트리가 구간을 차례로 읽기에 알맞다는 것은 Elmasri & Navathe, *Fundamentals of Database Systems*의 색인 구조 장에 나오는 내용이고, 이 과목 슬라이드로는 확인할 수 없다.
{% endraw %}
