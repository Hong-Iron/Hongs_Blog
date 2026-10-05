---
layout: "note"
title: "36_bipartite-coloring_verify.py"
display_title: "36_bipartite-coloring_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/bipartite-coloring/"
parent_title: "이분 그래프와 그래프 색칠"
description: "이산수학 · 이분 그래프와 그래프 색칠 검증 코드"
permalink: "/studies/discrete-math/code/36_bipartite-coloring_verify/"
---
{% raw %}
[이분 그래프와 그래프 색칠](/Hongs_Blog/studies/discrete-math/bipartite-coloring/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이분 그래프와 그래프 색칠 검증.

문서: 36.이분 그래프와 그래프 색칠 (예시, 정의, 판정 정리, 증명, 탐욕 색칠, 예제, 카드 C1~C3)
주장 1: 예시 — A-B, B-C, C-D, D-A, A-E는 2색, A-C를 더하면 2색 불가(삼각형).
주장 2: 판정 — n <= 7 무작위 그래프 수천 개에서 "2-색칠 가능(전수) <=> 홀수 길이 사이클 없음(사이클 전수)".
주장 3: BFS 거리의 짝홀로 칠한 색이 이분 그래프에서 늘 올바른 2-색칠.
주장 4: 탐욕 색칠 — 무작위 순서에서 늘 Δ + 1 이하, 결과가 올바른 색칠.
주장 5: 예제·카드 C3 — 경로 a-b-c-d를 a, d, b, c 순서로 칠하면 1, 1, 2, 3.
주장 6: 카드 C1 — C5 아님, C6 이분, K_{3,3} 이분, 삼각형 + 꼬리 아님.
"""
import random
from collections import deque
from itertools import combinations, product


def adj_of(n, E):
    adj = {v: [] for v in range(n)}
    for a, b in E:
        adj[a].append(b)
        adj[b].append(a)
    return adj


def two_colorable_brute(n, E):
    return any(all(c[a] != c[b] for a, b in E) for c in product((0, 1), repeat=n))


def has_odd_cycle(n, E):
    adj = adj_of(n, E)
    for s in range(n):
        st = [[s]]
        while st:
            p = st.pop()
            for w in adj[p[-1]]:
                if w == s and len(p) >= 3 and len(p) % 2 == 1:
                    return True
                if w not in p:
                    st.append(p + [w])
    return False


def bfs_color(n, E):
    adj = adj_of(n, E)
    color = {}
    for s in range(n):
        if s in color:
            continue
        color[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for w in adj[u]:
                if w not in color:
                    color[w] = 1 - color[u]
                    q.append(w)
    return color


def greedy(n, E, order):
    adj = adj_of(n, E)
    col = {}
    for v in order:
        used = {col[w] for w in adj[v] if w in col}
        c = 1
        while c in used:
            c += 1
        col[v] = c
    return col


def main():
    A, B, C, D, E_ = range(5)
    G1 = [(A, B), (B, C), (C, D), (D, A), (A, E_)]
    assert two_colorable_brute(5, G1) and not two_colorable_brute(5, G1 + [(A, C)])
    print("[OK] 주장 1: 예시")

    rng = random.Random(36)
    for _ in range(3000):
        n = rng.randint(1, 7)
        E = [p for p in combinations(range(n), 2) if rng.random() < rng.choice([0.2, 0.3, 0.45])]
        bip = two_colorable_brute(n, E)
        assert bip == (not has_odd_cycle(n, E))
        if bip:
            col = bfs_color(n, E)
            assert all(col[a] != col[b] for a, b in E)
        order = list(range(n))
        rng.shuffle(order)
        g = greedy(n, E, order)
        delta = max([len(v) for v in adj_of(n, E).values()] + [0])
        assert all(g[a] != g[b] for a, b in E) and max(g.values(), default=0) <= delta + 1
    print("[OK] 주장 2·3·4·카드 C2: 판정 정리, BFS 색칠, 탐욕 상한")

    a, b, c, d = range(4)
    P = [(a, b), (b, c), (c, d)]
    good, bad = greedy(4, P, [a, b, c, d]), greedy(4, P, [a, d, b, c])
    assert [good[v] for v in (a, b, c, d)] == [1, 2, 1, 2]
    assert [bad[v] for v in (a, d, b, c)] == [1, 1, 2, 3]
    print("[OK] 주장 5·카드 C3: 순서에 따른 탐욕 색칠")

    cyc = lambda n: [(i, (i + 1) % n) for i in range(n)]
    K33 = [(i, j) for i in range(3) for j in range(3, 6)]
    tail = [(0, 1), (1, 2), (2, 0), (2, 3)]
    assert not two_colorable_brute(5, cyc(5)) and two_colorable_brute(6, cyc(6))
    assert two_colorable_brute(6, K33) and not two_colorable_brute(4, tail)
    print("[OK] 주장 6·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
