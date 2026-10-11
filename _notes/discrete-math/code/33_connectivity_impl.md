---
layout: "note"
title: "33_connectivity_impl.py"
display_title: "33_connectivity_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "33"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/connectivity/"
parent_title: "경로와 연결성"
description: "이산수학 · 경로와 연결성 구현 코드"
permalink: "/studies/discrete-math/code/33_connectivity_impl/"
---
{% raw %}
[경로와 연결성](/Hongs_Blog/studies/discrete-math/connectivity/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""그래프 탐색: 너비 우선 탐색(BFS), 깊이 우선 탐색(DFS), 연결 성분.

문서: 33.경로와 연결성
그래프는 인접 리스트 dict[정점, list[정점]]로 준다(무방향이면 양쪽 목록에 모두 넣는다).
bfs(adj, s): s에서 각 정점까지의 최단 거리(간선 수)와 방문 순서. O(n + m).
dfs_order(adj, s): 반복문과 스택으로 구현한 DFS 방문 순서(재귀 깊이 제한을 피한다). O(n + m).
components(adj): 연결 성분 목록.
"""
from collections import deque


def bfs(adj, s):
    dist, order, q = {s: 0}, [s], deque([s])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                order.append(v)
                q.append(v)
    return dist, order


def dfs_order(adj, s):
    seen, order, stack = set(), [], [s]
    while stack:
        u = stack.pop()
        if u in seen:
            continue
        seen.add(u)
        order.append(u)
        for v in reversed(adj[u]):  # 목록 앞쪽 이웃을 먼저 방문하도록 거꾸로 넣는다
            if v not in seen:
                stack.append(v)
    return order


def components(adj):
    seen, comps = set(), []
    for s in adj:
        if s not in seen:
            _, order = bfs(adj, s)
            seen.update(order)
            comps.append(sorted(order))
    return comps


def undirected(edges, vertices=()):
    adj = {v: [] for v in vertices}
    for u, v in edges:
        adj.setdefault(u, []).append(v)
        adj.setdefault(v, []).append(u)
    return adj


if __name__ == "__main__":
    # 문서의 예: 1-2, 1-3, 2-4, 3-4, 4-5, 그리고 따로 떨어진 6-7
    adj = undirected([(1, 2), (1, 3), (2, 4), (3, 4), (4, 5), (6, 7)])
    dist, order = bfs(adj, 1)
    assert dist == {1: 0, 2: 1, 3: 1, 4: 2, 5: 3} and order == [1, 2, 3, 4, 5]
    assert dfs_order(adj, 1) == [1, 2, 4, 3, 5]
    assert components(adj) == [[1, 2, 3, 4, 5], [6, 7]]
    # 긴 경로에서도 재귀 제한 없이 동작
    big = undirected([(i, i + 1) for i in range(100000)])
    assert len(dfs_order(big, 0)) == 100001 and bfs(big, 0)[0][100000] == 100000
    print("ALL CHECKS PASSED")
```
{% endraw %}
