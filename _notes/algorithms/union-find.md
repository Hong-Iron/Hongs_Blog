---
layout: "note"
title: "유니온 파인드"
display_title: "유니온 파인드 (Union-Find)"
kind: "concept"
kind_label: "자료구조"
num: "15"
course: "알고리즘"
course_slug: "algorithms"
course_url: "/studies/algorithms/"
track: "알고리즘"
updated: "2026-10-06"
status: "verified"
aliases: ["Union-Find", "Disjoint Set Union", "DSU", "서로소 집합", "분리 집합", "경로 압축", "union by size"]
description: "반 친구들을 무리로 나눌 때 무리마다 대표 한 명을 정하고, 각자는 \"내 위의 사람\"만 기억한다. 위로 따라가 대표가 같으면 같은 무리다. 두 무리를 합칠 때는 한쪽 대표를 다른 쪽 대표 밑에 넣기만 하면 된다. 작은 무리를 큰 무리 밑에 넣고, 대표를 찾을 때 지나온 사람들을 대…"
prev_url: "/studies/algorithms/trie/"
prev_title: "트라이"
next_url: "/studies/algorithms/brute-force/"
next_title: "완전탐색"
math: true
mermaid: false
code_count: 1
permalink: "/studies/algorithms/union-find/"
---
{% raw %}
<div class="callout callout-summary" markdown="1">
<div class="callout-title callout-title--default" markdown="span">요약</div>

반 친구들을 무리로 나눌 때 무리마다 대표 한 명을 정하고, 각자는 "내 위의 사람"만 기억한다. 위로 따라가 대표가 같으면 같은 무리다. 두 무리를 합칠 때는 한쪽 대표를 다른 쪽 대표 밑에 넣기만 하면 된다. 작은 무리를 큰 무리 밑에 넣고, 대표를 찾을 때 지나온 사람들을 대표에 바로 이어 두면 두 일이 거의 한 번에 끝난다. 대신 한 번 합친 무리를 다시 나누지는 못한다.

</div>


## 예시로 보기

0 ~ 5번 여섯 명이 처음엔 모두 혼자다. parent[x]는 x의 "위 사람"이고, 자기 자신이면 대표다. 크기가 같으면 첫째 인자의 대표를 위로 둔다.

| 일 | parent | 무리 |
|---|---|---|
| 처음 | [0, 1, 2, 3, 4, 5] | {0} {1} {2} {3} {4} {5} |
| union(0, 1) | [0, 0, 2, 3, 4, 5] | {0, 1} … |
| union(2, 3) | [0, 0, 2, 2, 4, 5] | {0, 1} {2, 3} … |
| union(1, 3) | [0, 0, 0, 2, 4, 5] | {0, 1, 2, 3} {4} {5} |
| union(4, 5) | [0, 0, 0, 2, 4, 4] | {0, 1, 2, 3} {4, 5} |
| find(3) | [0, 0, 0, **0**, 4, 4] | 3 → 2 → 0, 대표 0. 3을 0에 바로 잇는다 |

union(1, 3)은 1의 대표 0과 3의 대표 2를 찾아, 2를 0 밑에 넣는다. 3은 여전히 2 밑이지만 2를 거쳐 0에 닿는다. find(3)이 한 번 올라간 뒤로는 3이 0을 바로 가리켜 다음부터 빠르다.

```python
parent = list(range(n))
size = [1] * n

def find(x):
    root = x
    while parent[root] != root:       # 대표까지 올라간다
        root = parent[root]
    while parent[x] != root:          # 지나온 칸을 대표에 바로 잇는다(경로 압축)
        parent[x], x = root, parent[x]
    return root

def union(a, b):
    a, b = find(a), find(b)
    if a == b:
        return False                  # 이미 같은 무리
    if size[a] < size[b]:             # 작은 무리를 큰 무리 밑에
        a, b = b, a
    parent[b] = a
    size[a] += size[b]
    return True
```

재귀로 `find`를 짜면 깊이가 깊을 때 파이썬 재귀 한도에 걸릴 수 있어 반복문으로 썼다.

## 규칙과 비용

**규칙(표현 불변식):** parent를 따라가면 늘 대표에 닿고(사이클이 없다), 같은 무리의 모든 칸은 같은 대표에 닿는다. 무리는 서로 겹치지 않는다. "같은 무리"는 [동치관계](/Hongs_Blog/studies/discrete-math/equivalence-relations/)이고, 무리들이 곧 분할이다.

- **작은 무리를 큰 무리 밑에(크기로 합치기):** 어떤 칸의 깊이가 1 늘 때마다 그 칸이 든 무리의 크기가 두 배 이상이 된다. 크기는 n을 넘을 수 없으니 깊이는 log₂ n 이하다. 그래서 find가 $$O(\log n)$$이다[^1].
- **경로 압축까지 쓰면:** 여러 번 연산의 평균 비용이 거의 상수(역아커만 함수 α(n), 현실의 n에서는 4 이하)가 된다[^2].

<div class="callout callout-check" markdown="1">
<div class="callout-title" markdown="span">검증: 예시 표의 parent 배열과 find의 경로 압축, 확인 문제 C1·C3의 답을 코드로 확인했다. 무작위 500번에서 크기로 합치기만으로 깊이가 log₂ n 이하였고, 무작위 1,500번에서 "같은 무리인가"가 BFS로 구한 연결 여부와 같았다 — [15_union-find_impl.py](/Hongs_Blog/studies/algorithms/code/15_union-find_impl/)</div>

</div>


## 활용

- **쓰는 곳:** 간선이 하나씩 추가될 때 "두 점이 이어졌나" 묻기, 최소 신장 트리의 크루스칼 알고리즘(사이클 막기), 사진의 연결된 영역 묶기, 네트워크의 연결 여부.
- **고르는 기준:** 연결 관계가 한 번 주어지고 끝이면 [BFS](/Hongs_Blog/studies/algorithms/bfs/)로 덩어리를 한 번 찾으면 된다. 간선이 계속 더해지며 그때그때 물으면 유니온 파인드다. 간선을 지워야 하면 둘 다 아니다.
- **번호가 아닌 이름:** 딕셔너리 `parent = {}`로 두고, 처음 보는 이름은 자기 자신을 대표로 넣는다.
- **흔한 실수:** find를 거치지 않고 `parent[a] = b`로 합쳐 대표가 아닌 칸끼리 잇는다. 크기를 대표가 아닌 칸에서 읽는다. 재귀 find로 깊이가 수십만인 줄을 만들어 `RecursionError`가 난다.

## 연결

- 선수: [리스트와 문자열](/Hongs_Blog/studies/algorithms/list-string/), [동치관계와 분할](/Hongs_Blog/studies/discrete-math/equivalence-relations/)
- 같은 "연결 덩어리"를 [BFS](/Hongs_Blog/studies/algorithms/bfs/)는 한 번에 훑어 찾고, 유니온 파인드는 간선이 올 때마다 조금씩 합쳐 간다.
- 그래프의 간선 (u, v)마다 union(u, v)를 하고 나면, 무리가 곧 [연결 성분](/Hongs_Blog/studies/discrete-math/connectivity/)이다. 간선의 두 끝은 늘 같은 무리에 든다. 한 무리 안의 점들은 지금까지 넣은 간선만으로 서로 오갈 수 있다.
- union(a, b)로 이은 짝을 양쪽 화살표로 그리고 [추이 폐포](/Hongs_Blog/studies/discrete-math/relations/)를 구한 뒤 자기 자신과의 짝을 더하면 "같은 무리" 관계가 된다. 와셜 알고리즘은 이 관계의 n × n 표를 $$O(n^3)$$에 다 채운다. 유니온 파인드는 표 대신 무리마다 대표 하나만 기억해 훨씬 빨리 답한다.
- 깊이 한계 log₂ n은 [로그](/Hongs_Blog/studies/college-math/logarithm/)의 뜻, 곧 "1에서 시작해 두 배를 몇 번 해야 n이 되나"에서 나온다.
- 연습: [호텔 방 배정](/Hongs_Blog/studies/algorithms/pg64063/)

## 확인 문제

<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C1** 0 ~ 4번에서 union(3, 4), union(1, 2), union(2, 4)를 차례로 했다(크기가 같으면 첫째 인자의 대표가 위). find를 부르기 전 parent 배열과 무리는?</summary>

**답:** parent = [0, 1, 1, 1, 3], 무리는 {0}과 {1, 2, 3, 4}다. union(2, 4)에서 2의 대표 1과 4의 대표 3은 크기가 둘 다 2라 3을 1 밑에 둔다. 4는 아직 3을 가리킨다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C2** 작은 무리를 큰 무리 밑에 넣으면 깊이가 log₂ n 이하가 되는 까닭은?</summary>

**답:** 칸 x의 깊이가 1 느는 것은 x가 든 무리가 더 크거나 같은 무리 밑으로 들어갈 때뿐이다. 그때 x가 든 무리의 크기는 적어도 두 배가 된다. 크기는 1에서 시작해 n을 넘지 못하니, 두 배가 되는 일은 log₂ n번을 넘을 수 없다.

</details>


<details class="callout callout-question" markdown="1">
<summary class="callout-title" markdown="span">**C3** 크기를 보지 않고 늘 "둘째 인자의 대표를 첫째 인자의 대표 밑에" 넣으면 깊이가 n − 1이 되는 예를 들어라(경로 압축 없음).</summary>

**답:** 0 ~ 9번에 union(1, 0), union(2, 1), …, union(9, 8)을 차례로 한다. 매번 지금까지의 무리 전체가 새 칸 밑으로 들어가 0 → 1 → 2 → … → 9의 한 줄이 된다. 0의 깊이는 9다. 크기로 합치면 같은 순서에서도 모두 한 대표 밑에 붙어 깊이가 1이다.

</details>


[^1]: Laaksonen, *Competitive Programmer's Handbook* (2018년 7월판), 15.2 "Union-find structure": 대표로 이어지는 줄, 작은 무리를 큰 무리에 잇는 방법, 연산이 O(log n)이다.
[^2]: Cormen 외, *Introduction to Algorithms* 3판, 21.3절(순위(rank)로 합치기와 경로 압축), 21.4절(두 방법을 함께 쓰면 m번 연산이 O(m α(n)), α(n)은 실제로 쓰는 n에서 4 이하). 이 문서의 코드는 순위 대신 크기로 합친다. 크기로 합치기도 경로 압축과 함께 쓰면 같은 $$\Theta(m\,\alpha(n))$$이다(Tarjan & van Leeuwen, "Worst-case analysis of set union algorithms", *JACM* 31(2), 1984. 위키백과 "Disjoint-set data structure"가 이 논문을 근거로 "union by size or by rank"를 함께 적는다).
{% endraw %}
