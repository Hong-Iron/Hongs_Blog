---
layout: "note"
title: "37_graph-spanning-practice_p5.py"
display_title: "37_graph-spanning-practice_p5.py"
kind: "code"
kind_label: "코드 · 문제 5 풀이"
num: "37"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/graph-spanning-practice/"
parent_title: "그래프 탐색과 신장 트리 연습"
description: "자료구조 · 그래프 탐색과 신장 트리 연습 문제 5 풀이 코드"
sitemap: false
permalink: "/studies/data-structures/code/37_graph-spanning-practice_p5/"
---
{% raw %}
[그래프 탐색과 신장 트리 연습](/Hongs_Blog/studies/data-structures/graph-spanning-practice/) 문서의 문제 5 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""그래프 탐색과 신장 트리 연습: 문제 p1 ~ p5의 답 확인.

문서: 1-2학기/자료구조/4.연습문제/37.그래프 탐색과 신장 트리 연습.md
출처: 자료구조 11주차 슬라이드 p.3, 7~26, 31~41, 10주차 p.36~39의 그래프와 값.
실행: python3 37_graph-spanning-practice_p5.py

확인하는 것
  p1. 11주차 p.7 그래프를 1에서 너비 우선 탐색: 방문 순서 1 2 4 5 3 6 9 7 8, 큐가 변하는 여덟 장면,
      신장 트리 간선 여덟 개. 인접 행렬이면 9 x 11 = 99칸, 인접 리스트면 노드 24개를 본다.
  p2. p.3 그래프를 1에서 깊이 우선 탐색: 방문 순서 1 2 5 9 6 4 7 8 3, 신장 트리가 슬라이드 그림과 같다.
      같은 그래프의 너비 우선 신장 트리와는 다르다(깊이 5 대 4, 겹치는 간선 4개).
      이 그래프(점 9, 간선 12)를 탐색할 때 인접 행렬이면 81칸, 인접 리스트면 원소 24개를 본다.
  p3. 10주차 p.36 그래프: p.37의 신장 트리 비용 51, 크루스칼의 최소 비용 41, 버린 간선 6-7, 2-5, 9-11.
      p.39의 방송 트리 비용 4 + 8 + 5 + 6 + 7 + 8 + 3 = 41.
  p4. 11주차 p.31 그래프: 크루스칼이 고르고 버리는 순서, 5에서 시작한 프림의 순서, 솔린의 두 바퀴. 모두 합 46.
  p5. 버리기 전략 둘: 비싼 간선부터 보며 끊어도 연결이면 버린다 -> 3-6, 2-4, 1-3을 버리고 46.
      사이클을 찾아 가장 비싼 간선 버리기도 46. 무작위 그래프 300개에서 버리기 전략 = 크루스칼.
"""
import random
from collections import deque

W11_ADJ = {1: [2, 4], 2: [1, 5, 3, 6], 3: [2, 5], 4: [1, 6], 5: [2, 9, 7, 3],
           6: [2, 4, 9, 7], 7: [5, 6], 8: [9], 9: [5, 6, 8], 10: [11], 11: [10]}
W11_DFS_TREE = {(1, 2), (2, 5), (5, 9), (8, 9), (6, 9), (4, 6), (6, 7), (3, 5)}

W10_EDGES = [(1, 2, 4), (1, 4, 2), (2, 5, 8), (3, 5, 6), (4, 6, 5), (5, 6, 2), (5, 7, 6),
             (6, 7, 7), (5, 9, 4), (8, 9, 4), (8, 11, 5), (9, 11, 8), (10, 11, 3)]
W10_TREE_51 = [(1, 2), (1, 4), (2, 5), (4, 6), (3, 5), (6, 7), (5, 9), (8, 9), (9, 11), (10, 11)]

W11_EDGES = [(1, 2, 2), (1, 3, 8), (2, 3, 7), (2, 4, 9), (3, 4, 4),
             (3, 5, 10), (3, 6, 12), (5, 6, 6), (5, 7, 14), (7, 8, 3)]


def key(u, v):
    return (min(u, v), max(u, v))


def bfs(adj, start):
    """(방문 순서, 꺼낼 때마다의 큐, 신장 트리 간선, 정점별 깊이)"""
    seen = {start}
    order, snapshots, tree = [], [], []
    depth = {start: 0}
    q = deque([start])
    while q:
        v = q.popleft()
        order.append(v)
        for w in adj[v]:
            if w not in seen:
                seen.add(w)
                depth[w] = depth[v] + 1
                tree.append(key(v, w))
                q.append(w)
        snapshots.append(list(q))
    return order, snapshots, tree, depth


def dfs(adj, start):
    order, tree, depth = [], [], {start: 0}

    def go(v):
        order.append(v)
        for w in adj[v]:
            if w not in depth:
                depth[w] = depth[v] + 1
                tree.append(key(v, w))
                go(w)

    go(start)
    return order, tree, depth


def make_find(parent):
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    return find


def kruskal(n, edges):
    """(합, [(u, v, w, 골랐나)])"""
    parent = list(range(n + 1))
    find = make_find(parent)
    total, log = 0, []
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[rv] = ru
            total += w
            log.append((u, v, w, True))
        else:
            log.append((u, v, w, False))
    return total, log


def prim(n, edges, start):
    """배열 판 프림: 트리 밖 정점마다 "트리와 잇는 가장 싼 간선"을 적어 두고 n - 1번 고른다."""
    INF = float("inf")
    cost = {}
    for u, v, w in edges:
        cost[(u, v)] = cost[(v, u)] = w
    in_tree = {start}
    order = []
    for _ in range(n - 1):
        best = None
        for u in in_tree:
            for v in range(1, n + 1):
                if v not in in_tree and cost.get((u, v), INF) < INF:
                    if best is None or cost[(u, v)] < best[2]:
                        best = (u, v, cost[(u, v)])
        order.append(best)
        in_tree.add(best[1])
    return sum(e[2] for e in order), order


def sollin_rounds(n, edges):
    parent = list(range(n + 1))
    find = make_find(parent)
    rounds, comps = [], n
    while comps > 1:
        best = {}
        for idx, (u, v, w) in enumerate(edges):
            ru, rv = find(u), find(v)
            if ru == rv:
                continue
            for r in (ru, rv):
                if r not in best or (w, idx) < (edges[best[r]][2], best[r]):
                    best[r] = idx
        added = sorted(set(best.values()))
        for idx in added:
            u, v, _ = edges[idx]
            parent[find(v)] = find(u)
        rounds.append([edges[i] for i in added])
        comps -= len(added)
    return rounds


def connected(n, edges):
    parent = list(range(n + 1))
    find = make_find(parent)
    for u, v, _ in edges:
        parent[find(v)] = find(u)
    return len({find(v) for v in range(1, n + 1)}) == 1


def reverse_delete(n, edges):
    """비싼 간선부터 보며, 빼도 연결이면 버린다. (남은 합, 버린 간선들)"""
    keep = list(edges)
    dropped = []
    for e in sorted(edges, key=lambda e: -e[2]):
        rest = [x for x in keep if x != e]
        if connected(n, rest):
            keep = rest
            dropped.append(e)
    return sum(e[2] for e in keep), dropped


def find_cycle(n, edges):
    """사이클 하나를 간선 목록으로 돌려준다. 없으면 None."""
    adj = {v: [] for v in range(1, n + 1)}
    for i, (u, v, _) in enumerate(edges):
        adj[u].append((v, i))
        adj[v].append((u, i))
    seen, stack_edge = {}, {}

    def go(v, came):
        seen[v] = True
        for w, i in adj[v]:
            if i == came:
                continue
            if w in stack_edge or w == root:
                if w in on_path:
                    cyc = [i]
                    x = v
                    while x != w:
                        cyc.append(stack_edge[x][1])
                        x = stack_edge[x][0]
                    return cyc
            if w not in seen:
                stack_edge[w] = (v, i)
                on_path.add(w)
                got = go(w, i)
                if got:
                    return got
                on_path.discard(w)
        return None

    for root in range(1, n + 1):
        if root not in seen:
            on_path = {root}
            stack_edge = {}
            got = go(root, -1)
            if got:
                return [edges[i] for i in got]
    return None


def cycle_delete(n, edges):
    """사이클을 찾아 그 위의 가장 비싼 간선을 버리기를 사이클이 없을 때까지."""
    keep = list(edges)
    while True:
        cyc = find_cycle(n, keep)
        if cyc is None:
            return sum(e[2] for e in keep), keep
        keep.remove(max(cyc, key=lambda e: e[2]))


def broadcast_cost(tree_edges, weights, source):
    """뿌리에서 퍼지는 방송 트리: 노드마다 가장 먼(비싼) 자식에게 닿는 힘 한 번만 든다."""
    adj = {}
    for u, v in tree_edges:
        adj.setdefault(u, []).append(v)
        adj.setdefault(v, []).append(u)
    total, terms = 0, []
    seen = {source}
    q = deque([source])
    while q:
        v = q.popleft()
        children = [w for w in adj[v] if w not in seen]
        if children:
            need = max(weights[key(v, w)] for w in children)
            total += need
            terms.append((v, need))
        for w in children:
            seen.add(w)
            q.append(w)
    return total, terms


def main():
    # p1
    order, snaps, tree, depth = bfs(W11_ADJ, 1)
    assert order == [1, 2, 4, 5, 3, 6, 9, 7, 8]
    assert snaps == [[2, 4], [4, 5, 3, 6], [5, 3, 6], [3, 6, 9, 7], [6, 9, 7], [9, 7], [7, 8], [8], []]
    assert tree == [(1, 2), (1, 4), (2, 5), (2, 3), (2, 6), (5, 9), (5, 7), (8, 9)]
    assert 10 not in depth and 11 not in depth
    assert len(order) * 11 == 99 and sum(len(W11_ADJ[v]) for v in order) == 24
    print("[OK] p1 너비 우선: 1 2 4 5 3 6 9 7 8, 큐 [2 4] [4 5 3 6] [5 3 6] [3 6 9 7] [6 9 7] [9 7] [7 8] [8] []")

    # p2
    adj9 = {v: ns for v, ns in W11_ADJ.items() if v <= 9}
    d_order, d_tree, d_depth = dfs(adj9, 1)
    assert d_order == [1, 2, 5, 9, 6, 4, 7, 8, 3]
    assert set(d_tree) == W11_DFS_TREE and len(d_tree) == 8
    b_order, _, b_tree, b_depth = bfs(adj9, 1)
    assert set(b_tree) != set(d_tree)
    assert max(d_depth.values()) == 5 and max(b_depth.values()) == 4
    assert len(set(b_tree) & set(d_tree)) == 4
    # 점 9개, 간선 12개: 깊이 우선 탐색이 이웃을 찾느라 보는 양
    assert sum(len(ns) for ns in adj9.values()) == 24 == 2 * 12
    assert len(d_order) * 9 == 81                      # 인접 행렬: 점마다 한 줄 9칸
    assert sum(len(adj9[v]) for v in d_order) == 24    # 인접 리스트: 점마다 이웃 수만큼
    print("[OK] p2 깊이 우선: 1 2 5 9 6 4 7 8 3, 트리는 슬라이드와 같고 너비 우선 트리와 다르다(깊이 5 대 4)")
    print("[OK] 점 9개, 간선 12개 그래프의 탐색: 인접 행렬 81칸, 인접 리스트 24개, 트리 간선 8개")

    # p3
    w10 = {key(u, v): w for u, v, w in W10_EDGES}
    assert sum(w10[key(u, v)] for u, v in W10_TREE_51) == 51 and len(W10_TREE_51) == 10
    total, log = kruskal(11, W10_EDGES)
    assert total == 41
    assert [(u, v) for u, v, w, ok in log if not ok] == [(6, 7), (2, 5), (9, 11)]
    assert [w for u, v, w, ok in log if ok] == [2, 2, 3, 4, 4, 4, 5, 5, 6, 6]
    cost, terms = broadcast_cost(W10_TREE_51, w10, 1)
    assert cost == 41 and sorted(terms) == [(1, 4), (2, 8), (4, 5), (5, 6), (6, 7), (9, 8), (11, 3)]
    print("[OK] p3 10주차 그래프: 그림의 신장 트리 51, 최소 41(6-7, 2-5, 9-11을 버림), 방송 트리 비용 41")

    # p4
    total, log = kruskal(8, W11_EDGES)
    assert total == 46
    assert [(u, v, ok) for u, v, w, ok in log] == [
        (1, 2, True), (7, 8, True), (3, 4, True), (5, 6, True), (2, 3, True),
        (1, 3, False), (2, 4, False), (3, 5, True), (3, 6, False), (5, 7, True)]
    p_total, p_order = prim(8, W11_EDGES, 5)
    assert p_total == 46
    assert [key(u, v) for u, v, w in p_order] == [(5, 6), (3, 5), (3, 4), (2, 3), (1, 2), (5, 7), (7, 8)]
    assert [w for u, v, w in p_order] == [6, 10, 4, 7, 2, 14, 3]
    rounds = sollin_rounds(8, W11_EDGES)
    assert [[(u, v) for u, v, w in r] for r in rounds] == [[(1, 2), (3, 4), (5, 6), (7, 8)], [(2, 3), (3, 5), (5, 7)]]
    assert sum(w for r in rounds for _, _, w in r) == 46
    print("[OK] p4 11주차 그래프: 크루스칼·프림(5에서 시작)·솔린 모두 46")

    # p5
    total, dropped = reverse_delete(8, W11_EDGES)
    assert total == 46 and [(u, v) for u, v, w in dropped] == [(3, 6), (2, 4), (1, 3)]
    c_total, c_keep = cycle_delete(8, W11_EDGES)
    assert c_total == 46 and len(c_keep) == 7
    rng = random.Random(20261012)
    for _ in range(300):
        n = rng.randint(2, 7)
        pairs = [(u, v) for u in range(1, n + 1) for v in range(u + 1, n + 1)]
        costs = rng.sample(range(1, 100), len(pairs))
        edges = [(u, v, w) for (u, v), w in zip(pairs, costs) if rng.random() < 0.6]
        if not connected(n, edges):
            continue
        k_total, _ = kruskal(n, edges)
        assert reverse_delete(n, edges)[0] == k_total
        assert cycle_delete(n, edges)[0] == k_total
    print("[OK] p5 버리기 전략: 3-6, 2-4, 1-3을 버리고 46. 무작위 그래프에서도 크루스칼과 같은 합")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
