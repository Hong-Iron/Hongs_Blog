---
layout: "note"
title: "37_sollin-algorithm_verify.py"
display_title: "37_sollin-algorithm_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/sollin-algorithm/"
parent_title: "솔린 알고리즘"
description: "자료구조 · 솔린 알고리즘 검증 코드"
permalink: "/studies/data-structures/code/37_sollin-algorithm_verify/"
---
{% raw %}
[솔린 알고리즘](/Hongs_Blog/studies/data-structures/sollin-algorithm/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""솔린 알고리즘(Sollin, 보루프카) 검증.

문서: 1-2학기/자료구조/3.개념집/37.솔린 알고리즘.md
출처: 자료구조 11주차 슬라이드 p.31, 33, 40~41 (그림과 설명). 구현과 반례는 에이전트 보충.
실행: python3 37_sollin-algorithm_verify.py

확인하는 것
  1. 슬라이드 그래프(정점 8, 간선 10): 1바퀴에서 덩어리 8개가 간선 4개(1-2, 3-4, 5-6, 7-8)를,
     2바퀴에서 덩어리 4개가 간선 3개(2-3, 3-5, 5-7)를 골라 끝난다. 비용 합 46 = 크루스칼의 합.
  2. 같은 비용 간선이 있을 때 덩어리마다 아무 간선이나 고르면 사이클이 생긴다(삼각형, 비용 1, 1, 1).
     "비용이 같으면 번호가 앞선 간선"으로 정하면 사이클이 생기지 않는다.
  3. 무작위 연결 그래프 1,500개(정점 2~8, 비용 1~4라 같은 비용이 많다)에서
     솔린의 합 = 크루스칼의 합, 고른 간선 n - 1개, 바퀴 수 <= ceil(lg n), 바퀴마다 덩어리 수가 절반 이하.
     정점 8개 사슬 예에서는 덩어리 수가 8 -> 4 -> 2 -> 1로 꼭 3바퀴를 돈다.
  4. 비용이 모두 다른 무작위 그래프 300개에서 솔린이 고른 간선 집합 = 크루스칼이 고른 간선 집합.
  5. 비용이 모두 다른 무작위 그래프 300개(점 2~6)에서 신장 트리를 모두 만들어 보면 비용이 가장 작은 것이 꼭 하나다.
     슬라이드 그래프도 하나(46). 비용이 같은 삼각형은 셋이다.
"""
import math
import random

SLIDE_EDGES = [(1, 2, 2), (1, 3, 8), (2, 3, 7), (2, 4, 9), (3, 4, 4),
               (3, 5, 10), (3, 6, 12), (5, 6, 6), (5, 7, 14), (7, 8, 3)]


def make_find(parent):
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    return find


def kruskal(n, edges):
    """(비용 합, 고른 간선 번호 목록). 비용이 같으면 번호가 앞선 간선부터 본다."""
    parent = list(range(n + 1))
    find = make_find(parent)
    total, chosen = 0, []
    for idx in sorted(range(len(edges)), key=lambda i: (edges[i][2], i)):
        u, v, w = edges[idx]
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[rv] = ru
            total += w
            chosen.append(idx)
    return total, chosen


def sollin(n, edges):
    """(비용 합, 고른 간선 번호 목록, 바퀴 기록).

    바퀴 기록의 한 칸: (바퀴 시작 때 덩어리 수, {덩어리 대표: 고른 간선 번호}, 중복을 지우고 넣은 간선 번호들)
    덩어리마다 "밖으로 나가는 가장 싼 간선"을 고른다. 비용이 같으면 번호가 앞선 간선을 고른다.
    """
    parent = list(range(n + 1))
    find = make_find(parent)
    comps, total, chosen, rounds = n, 0, [], []
    while comps > 1:
        best = {}
        for idx, (u, v, w) in enumerate(edges):
            ru, rv = find(u), find(v)
            if ru == rv:                      # 같은 덩어리 안의 간선은 건너뛴다
                continue
            for r in (ru, rv):
                if r not in best or (w, idx) < (edges[best[r]][2], best[r]):
                    best[r] = idx
        if not best:                          # 더 이을 간선이 없다: 연결 그래프가 아니다
            break
        added = []
        for idx in sorted(set(best.values())):    # 두 덩어리가 같은 간선을 골랐으면 한 번만
            u, v, w = edges[idx]
            ru, rv = find(u), find(v)
            assert ru != rv, "번호로 순서를 정하면 한 바퀴 안에서 사이클이 생기지 않는다"
            parent[rv] = ru
            total += w
            chosen.append(idx)
            added.append(idx)
        rounds.append((comps, dict(best), added))
        comps -= len(added)
    return total, chosen, rounds


def has_cycle(n, edge_list):
    parent = list(range(n + 1))
    find = make_find(parent)
    for u, v, _ in edge_list:
        ru, rv = find(u), find(v)
        if ru == rv:
            return True
        parent[rv] = ru
    return False


def random_connected_graph(rng, n, max_cost, distinct=False):
    edges, seen = [], set()
    order = list(range(1, n + 1))
    rng.shuffle(order)
    for i in range(1, n):                     # 먼저 나무를 하나 만들어 연결을 보장한다
        u, v = order[i], order[rng.randrange(i)]
        seen.add((min(u, v), max(u, v)))
    for u in range(1, n + 1):
        for v in range(u + 1, n + 1):
            if (u, v) not in seen and rng.random() < 0.4:
                seen.add((u, v))
    pairs = sorted(seen)
    rng.shuffle(pairs)
    if distinct:
        costs = rng.sample(range(1, 10 * len(pairs) + 1), len(pairs))
    else:
        costs = [rng.randint(1, max_cost) for _ in pairs]
    for (u, v), w in zip(pairs, costs):
        edges.append((u, v, w))
    return edges


def all_min_spanning_trees(n, edges):
    """간선 n - 1개를 고르는 모든 방법을 다 보고, 비용이 가장 작은 신장 트리들을 돌려준다."""
    from itertools import combinations
    best, trees = None, []
    for combo in combinations(range(len(edges)), n - 1):
        picked = [edges[i] for i in combo]
        if has_cycle(n, picked):
            continue                          # 간선 n - 1개에 사이클이 없으면 신장 트리다
        cost = sum(e[2] for e in picked)
        if best is None or cost < best:
            best, trees = cost, [combo]
        elif cost == best:
            trees.append(combo)
    return best, trees


def main():
    # 1. 슬라이드 그래프
    total, chosen, rounds = sollin(8, SLIDE_EDGES)
    name = lambda idx: (SLIDE_EDGES[idx][0], SLIDE_EDGES[idx][1])
    assert total == 46 and kruskal(8, SLIDE_EDGES)[0] == 46
    assert len(rounds) == 2
    comps1, best1, added1 = rounds[0]
    assert comps1 == 8
    assert {r: name(i) for r, i in best1.items()} == {
        1: (1, 2), 2: (1, 2), 3: (3, 4), 4: (3, 4), 5: (5, 6), 6: (5, 6), 7: (7, 8), 8: (7, 8)}
    assert [name(i) for i in added1] == [(1, 2), (3, 4), (5, 6), (7, 8)]
    assert sum(SLIDE_EDGES[i][2] for i in added1) == 2 + 4 + 6 + 3
    comps2, best2, added2 = rounds[1]
    assert comps2 == 4
    picks2 = sorted(name(i) for i in best2.values())
    assert picks2 == [(2, 3), (2, 3), (3, 5), (5, 7)]      # {1,2}와 {3,4}가 같은 간선 2-3을 고른다
    assert [name(i) for i in added2] == [(2, 3), (3, 5), (5, 7)]
    assert sum(SLIDE_EDGES[i][2] for i in added2) == 7 + 10 + 14
    assert sorted(chosen) == sorted(kruskal(8, SLIDE_EDGES)[1])
    print("[OK] 슬라이드 그래프: 1바퀴 1-2, 3-4, 5-6, 7-8 / 2바퀴 2-3, 3-5, 5-7, 합 46 = 크루스칼")

    # 2. 같은 비용 간선과 사이클
    tri = [(1, 2, 1), (2, 3, 1), (1, 3, 1)]
    careless = {1: tri[0], 2: tri[1], 3: tri[2]}    # 덩어리 1은 1-2, 2는 2-3, 3은 1-3을 골랐다
    for comp, (u, v, w) in careless.items():
        outgoing = [e for e in tri if comp in (e[0], e[1])]
        assert (u, v, w) in outgoing and w == min(e[2] for e in outgoing)   # 저마다 가장 싼 간선이 맞다
    picked = list(set(careless.values()))
    assert len(picked) == 3 and has_cycle(3, picked)          # 간선 3개, 정점 3개: 사이클
    t3, c3, r3 = sollin(3, tri)
    assert t3 == 2 and len(c3) == 2 and not has_cycle(3, [tri[i] for i in c3])
    print("[OK] 삼각형(비용 1, 1, 1): 덩어리마다 제각각 고르면 간선 3개로 사이클, 번호로 정하면 간선 2개")

    # 3. 같은 비용이 많은 무작위 그래프
    rng = random.Random(20261012)
    max_rounds_seen = 0
    for _ in range(1500):
        n = rng.randint(2, 8)
        edges = random_connected_graph(rng, n, 4)
        st, sc, sr = sollin(n, edges)
        kt, kc = kruskal(n, edges)
        assert st == kt, (edges, st, kt)
        assert len(sc) == n - 1 and not has_cycle(n, [edges[i] for i in sc])
        assert len(sr) <= math.ceil(math.log2(n))
        comps = n
        for before, best, added in sr:
            assert before == comps
            after = comps - len(added)
            assert after <= comps // 2            # 덩어리마다 간선 하나를 고르니 절반 이하로 준다
            comps = after
        assert comps == 1
        max_rounds_seen = max(max_rounds_seen, len(sr))
    print(f"[OK] 무작위 1500개(비용 1~4): 솔린 = 크루스칼, 간선 n - 1개, 바퀴 수 <= ceil(lg n) (가장 많이 돈 것 {max_rounds_seen}바퀴)")

    # 바퀴 수가 꼭 lg n이 되는 예: 둘씩, 넷씩, 여덟이 차례로 묶인다
    chain = [(1, 2, 1), (3, 4, 1), (5, 6, 1), (7, 8, 1), (2, 3, 2), (6, 7, 2), (4, 5, 3)]
    ct, cc, cr = sollin(8, chain)
    assert ct == 11 and [before for before, _, _ in cr] == [8, 4, 2]
    print("[OK] 정점 8개 사슬 예: 덩어리 수 8 -> 4 -> 2 -> 1, 꼭 lg 8 = 3바퀴")

    # 4. 비용이 모두 다르면 고른 간선 집합까지 같다
    for _ in range(300):
        n = rng.randint(2, 8)
        edges = random_connected_graph(rng, n, 0, distinct=True)
        assert sorted(sollin(n, edges)[1]) == sorted(kruskal(n, edges)[1])
    print("[OK] 비용이 모두 다른 무작위 300개: 솔린과 크루스칼이 같은 간선을 고른다")

    # 5. 비용이 모두 다르면 최소 비용 신장 트리는 하나뿐이다 (전수)
    for _ in range(300):
        n = rng.randint(2, 6)
        edges = random_connected_graph(rng, n, 0, distinct=True)
        best, trees = all_min_spanning_trees(n, edges)
        assert len(trees) == 1 and best == kruskal(n, edges)[0]
        assert sorted(trees[0]) == sorted(kruskal(n, edges)[1])
    best, trees = all_min_spanning_trees(3, tri)
    assert best == 2 and len(trees) == 3      # 비용이 같으면 여럿일 수 있다: 삼각형은 셋
    best, trees = all_min_spanning_trees(8, SLIDE_EDGES)
    assert best == 46 and len(trees) == 1
    print("[OK] 비용이 모두 다른 무작위 300개(전수): 최소 비용 신장 트리가 꼭 하나. 삼각형(1, 1, 1)은 셋")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
