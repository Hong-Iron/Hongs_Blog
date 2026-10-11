---
layout: "note"
title: "33_connectivity_verify.py"
display_title: "33_connectivity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "33"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/connectivity/"
parent_title: "경로와 연결성"
description: "이산수학 · 경로와 연결성 검증 코드"
permalink: "/studies/discrete-math/code/33_connectivity_verify/"
---
{% raw %}
[경로와 연결성](/Hongs_Blog/studies/discrete-math/connectivity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""경로와 연결성 검증.

문서: 33.경로와 연결성 (예시, 정의, 정리, 증명, 탐색, 보행의 수, 예제, 카드 C1~C3)
주장 1: 예시 — BFS 거리 {1:0, 2:1, 3:1, 4:2, 5:3}, 큐 순서, 성분 {1..5}, {6, 7}.
주장 2: BFS 거리 = 모든 단순 경로를 전수로 찾은 최단 길이(무작위 그래프 300개, n <= 8).
주장 3: 최단 보행은 경로 — 길이 <= 6인 모든 보행 중 가장 짧은 것에 정점 반복이 없다(작은 그래프 전수).
주장 4: 무방향 도달 가능성은 반사·대칭·추이, 방향 그래프 1 -> 2에서는 대칭이 깨진다.
주장 5: (A^k)_{uv} = 길이 k 보행 수 (무작위 그래프, k <= 5, 보행 전수 세기).
주장 6: 예제·오해 — 간선 1-2, 2-3, 1-3에서 DFS 깊이는 3이 2, BFS 거리는 1.
주장 7: 카드 C2 — a..f 그래프의 BFS 거리.
"""
import random
from collections import deque
from itertools import combinations


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


def und(edges, verts):
    adj = {v: [] for v in verts}
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    for v in adj:
        adj[v].sort()
    return adj


def walks(adj, s, k):
    """길이 k인 보행을 모두 나열."""
    out = [[s]]
    for _ in range(k):
        out = [w + [v] for w in out for v in adj[w[-1]]]
    return out


def main():
    adj = und([(1, 2), (1, 3), (2, 4), (3, 4), (4, 5), (6, 7)], range(1, 8))
    dist, order = bfs(adj, 1)
    assert dist == {1: 0, 2: 1, 3: 1, 4: 2, 5: 3} and order == [1, 2, 3, 4, 5]
    assert 6 not in dist and set(bfs(adj, 6)[0]) == {6, 7}
    print("[OK] 주장 1: 예시")

    rng = random.Random(33)
    for _ in range(300):
        n = rng.randint(2, 8)
        edges = [e for e in combinations(range(n), 2) if rng.random() < 0.35]
        adj = und(edges, range(n))
        dist, _ = bfs(adj, 0)
        best = {0: 0}
        stack = [[0]]
        while stack:
            p = stack.pop()
            u = p[-1]
            best[u] = min(best.get(u, 99), len(p) - 1)
            for v in adj[u]:
                if v not in p:
                    stack.append(p + [v])
        assert dist == best
    print("[OK] 주장 2·카드 C2의 방법: BFS = 전수 최단")

    for _ in range(100):
        n = rng.randint(2, 6)
        edges = [e for e in combinations(range(n), 2) if rng.random() < 0.5]
        adj = und(edges, range(n))
        for t in range(1, n):
            ws = [w for k in range(0, 7) for w in walks(adj, 0, k) if w[-1] == t]
            if ws:
                shortest = min(ws, key=len)
                assert len(set(shortest)) == len(shortest)
    print("[OK] 주장 3: 최단 보행은 경로")

    for _ in range(100):
        n = rng.randint(1, 8)
        edges = [e for e in combinations(range(n), 2) if rng.random() < 0.3]
        adj = und(edges, range(n))
        R = {(u, v) for u in range(n) for v in bfs(adj, u)[0]}
        assert all((u, u) in R for u in range(n))
        assert all((v, u) in R for u, v in R)
        assert all((u, w) in R for u, v in R for x, w in R if x == v)
    dadj = {1: [2], 2: []}
    assert 2 in bfs(dadj, 1)[0] and 1 not in bfs(dadj, 2)[0]
    print("[OK] 주장 4·카드 C3: 동치관계와 방향 그래프의 비대칭")

    def matmul(X, Y):
        n = len(X)
        return [[sum(X[i][k] * Y[k][j] for k in range(n)) for j in range(n)] for i in range(n)]
    for _ in range(30):
        n = rng.randint(2, 5)
        edges = [e for e in combinations(range(n), 2) if rng.random() < 0.6]
        adj = und(edges, range(n))
        A = [[1 if v in adj[u] else 0 for v in range(n)] for u in range(n)]
        P = [[int(i == j) for j in range(n)] for i in range(n)]
        for k in range(1, 6):
            P = matmul(P, A)
            for u in range(n):
                counts = [0] * n
                for w in walks(adj, u, k):
                    counts[w[-1]] += 1
                assert counts == P[u]
    print("[OK] 주장 5: A^k와 보행 수")

    tri = {1: [2, 3], 2: [1, 3], 3: [1, 2]}
    depth, stack, seen = {}, [(1, 0)], set()
    while stack:
        u, d = stack.pop()
        if u in seen:
            continue
        seen.add(u)
        depth[u] = d
        for v in reversed(tri[u]):
            if v not in seen:
                stack.append((v, d + 1))
    assert depth[3] == 2 and bfs(tri, 1)[0][3] == 1
    print("[OK] 주장 6·오해: DFS 깊이 2, BFS 거리 1")

    letters = "abcdef"
    adj = und([("a", "b"), ("a", "c"), ("b", "d"), ("c", "d"), ("d", "e"), ("e", "f")], letters)
    dist, order = bfs(adj, "a")
    assert dist == {"a": 0, "b": 1, "c": 1, "d": 2, "e": 3, "f": 4} and order == list(letters)
    print("[OK] 주장 7·카드 C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
