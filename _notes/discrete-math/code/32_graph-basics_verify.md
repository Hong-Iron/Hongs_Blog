---
layout: "note"
title: "32_graph-basics_verify.py"
display_title: "32_graph-basics_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/graph-basics/"
parent_title: "그래프의 기초"
description: "이산수학 · 그래프의 기초 검증 코드"
permalink: "/studies/discrete-math/code/32_graph-basics_verify/"
---
{% raw %}
[그래프의 기초](/Hongs_Blog/studies/discrete-math/graph-basics/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""그래프의 기초 검증.

문서: 32.그래프의 기초 (예시, 정의, 악수 정리, 증명, 예제, 오해, 카드 C1~C4)
주장 1: 예시 — 간선 AB, AC, BC, CD, DE의 차수 A2 B2 C3 D2 E1, 합 10 = 2·5.
주장 2: 악수 정리 — 무작위 단순 그래프 1000개에서 Σdeg = 2m, 홀수 차수 정점은 짝수 개.
         무작위 방향 그래프에서 진입 합 = 진출 합 = m.
주장 3: 동치 정의 — 그래프 <-> 대칭·비반사 관계(n <= 4의 모든 관계 전수).
주장 4: K_n의 간선 수 C(n, 2), 단순 그래프의 간선 수 최대(n <= 5의 모든 그래프 전수).
주장 5: 예제 — 인접 행렬이 대칭, 대각 0, 행 합 = 차수, 리스트 길이 합 = 2m = 10.
주장 6: 카드 C2 — 차수열 3, 3, 2, 2, 1은 불가능(합이 홀수, 그리고 n = 5의 모든 그래프 전수로도 없음).
         카드 C3 — 행렬에서 읽은 사이클 1-2-3-4의 차수 모두 2.
주장 7: 오해·카드 C4 — 10^12비트 = 125 GB, n + 2m = 1.1 × 10^7.
"""
import random
from itertools import combinations, product
from math import comb


def degrees(n, edges):
    d = [0] * n
    for u, v in edges:
        d[u] += 1
        d[v] += 1
    return d


def main():
    V = "ABCDE"
    E = [("A", "B"), ("A", "C"), ("B", "C"), ("C", "D"), ("D", "E")]
    deg = {v: sum(v in e for e in E) for v in V}
    assert deg == {"A": 2, "B": 2, "C": 3, "D": 2, "E": 1} and sum(deg.values()) == 10 == 2 * len(E)
    print("[OK] 주장 1: 예시")

    rng = random.Random(32)
    for _ in range(1000):
        n = rng.randint(1, 20)
        edges = [e for e in combinations(range(n), 2) if rng.random() < rng.random()]
        d = degrees(n, edges)
        assert sum(d) == 2 * len(edges) and sum(x % 2 for x in d) % 2 == 0
        arcs = {(u, v) for u in range(n) for v in range(n) if u != v and rng.random() < 0.3}
        indeg = [sum(1 for a in arcs if a[1] == v) for v in range(n)]
        outdeg = [sum(1 for a in arcs if a[0] == v) for v in range(n)]
        assert sum(indeg) == sum(outdeg) == len(arcs)
    print("[OK] 주장 2·카드 C1: 악수 정리")

    for n in range(1, 5):
        pairs = [(u, v) for u in range(n) for v in range(n)]
        graphs = {frozenset(s) for k in range(comb(n, 2) + 1) for s in combinations(combinations(range(n), 2), k)}
        rels = set()
        for bits in product((0, 1), repeat=len(pairs)):
            R = {p for p, b in zip(pairs, bits) if b}
            if all((v, u) in R for u, v in R) and all((u, u) not in R for u in range(n)):
                rels.add(frozenset(tuple(sorted(p)) for p in R))
        assert rels == graphs
    print("[OK] 주장 3: 그래프 = 대칭·비반사 관계")

    for n in range(1, 6):
        allpairs = list(combinations(range(n), 2))
        assert len(allpairs) == comb(n, 2) == n * (n - 1) // 2
    assert comb(4, 2) == 6
    print("[OK] 주장 4: K_n의 간선 수")

    idx = {v: i for i, v in enumerate(V)}
    A = [[0] * 5 for _ in range(5)]
    adj = {v: [] for v in V}
    for u, v in E:
        A[idx[u]][idx[v]] = A[idx[v]][idx[u]] = 1
        adj[u].append(v)
        adj[v].append(u)
    assert A == [[0, 1, 1, 0, 0], [1, 0, 1, 0, 0], [1, 1, 0, 1, 0], [0, 0, 1, 0, 1], [0, 0, 0, 1, 0]]
    assert all(A[i][j] == A[j][i] for i in range(5) for j in range(5)) and all(A[i][i] == 0 for i in range(5))
    assert [sum(r) for r in A] == [deg[v] for v in V] and sum(len(x) for x in adj.values()) == 10
    assert {v: sorted(x) for v, x in adj.items()} == {"A": ["B", "C"], "B": ["A", "C"], "C": ["A", "B", "D"], "D": ["C", "E"], "E": ["D"]}
    print("[OK] 주장 5: 행렬과 리스트")

    target = sorted([3, 3, 2, 2, 1])
    assert sum(target) % 2 == 1
    allpairs = list(combinations(range(5), 2))
    for mask in range(1 << len(allpairs)):
        edges = [allpairs[i] for i in range(len(allpairs)) if mask >> i & 1]
        assert sorted(degrees(5, edges)) != target
    M = {(1, 2): 1, (1, 3): 0, (1, 4): 1, (2, 3): 1, (2, 4): 0, (3, 4): 1}
    edges = [(u - 1, v - 1) for (u, v), b in M.items() if b]
    assert degrees(4, edges) == [2, 2, 2, 2] and len(edges) == 4
    print("[OK] 주장 6·카드 C2·C3")

    n, avg = 10 ** 6, 10
    m = n * avg // 2
    assert m == 5 * 10 ** 6 and n * n == 10 ** 12 and n * n / 8 / 1e9 == 125 and n + 2 * m == 1.1e7
    print("[OK] 주장 7·오해·카드 C4: 메모리 계산")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
