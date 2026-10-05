---
layout: "note"
title: "34_euler-hamilton_verify.py"
display_title: "34_euler-hamilton_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/euler-hamilton/"
parent_title: "오일러 경로와 해밀턴 경로"
description: "이산수학 · 오일러 경로와 해밀턴 경로 검증 코드"
permalink: "/studies/discrete-math/code/34_euler-hamilton_verify/"
---
{% raw %}
[오일러 경로와 해밀턴 경로](/Hongs_Blog/studies/discrete-math/euler-hamilton/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""오일러 경로와 해밀턴 경로 검증.

문서: 34.오일러 경로와 해밀턴 경로 (예시, 정리, 증명, 해밀턴, 예제, 카드 C1~C3)
주장 1: 쾨니히스베르크 — 다리 7개(A–B 둘, A–C 둘, A–D, B–D, C–D)의 차수 A5 B3 C3 D3, 오일러 트레일 없음(전수).
         A–B 다리 하나를 없애면 트레일이 생긴다(카드 C1).
주장 2: 연결된 무작위 다중 그래프 300개에서 "모든 차수 짝수 <=> 오일러 회로", "홀수 2개 <=> 회로 아닌 트레일"(전수 탐색과 비교).
주장 3: 히어홀처 구현이 짝수 차수 그래프에서 모든 간선을 한 번씩 쓰는 닫힌 트레일을 만든다.
주장 4: 나비넥타이 — 차수 c 4, 나머지 2, 회로 a b c d e c a가 유효, 해밀턴 사이클 없음(전수).
주장 5: 디랙 정리 — n = 3..7, 최소 차수 >= n/2인 무작위 그래프에 해밀턴 사이클이 있다(전수 탐색). C_n은 차수 2여도 해밀턴.
"""
import random
from collections import Counter
from itertools import combinations, permutations


def euler_exists(n, edges, closed):
    """간선 목록(중복 허용)을 모두 한 번씩 쓰는 트레일이 있는지 전수 탐색."""
    m = len(edges)
    used = [False] * m

    def go(v, k):
        if k == m:
            return True if not closed else v == start[0]
        for i, (a, b) in enumerate(edges):
            if not used[i] and v in (a, b):
                used[i] = True
                if go(b if v == a else a, k + 1):
                    used[i] = False
                    return True
                used[i] = False
        return False

    for s in range(n):
        start = [s]
        if any(s in e for e in edges) and go(s, 0):
            return True
    return m == 0


def degrees(n, edges):
    d = [0] * n
    for a, b in edges:
        d[a] += 1
        d[b] += 1
    return d


def connected_on_edges(n, edges):
    vs = {v for e in edges for v in e}
    if not vs:
        return True
    adj = {v: set() for v in vs}
    for a, b in edges:
        adj[a].add(b)
        adj[b].add(a)
    s = next(iter(vs))
    seen, st = {s}, [s]
    while st:
        u = st.pop()
        for w in adj[u]:
            if w not in seen:
                seen.add(w)
                st.append(w)
    return seen == vs


def hierholzer(n, edges):
    adj = {v: [] for v in range(n)}
    for i, (a, b) in enumerate(edges):
        adj[a].append((b, i))
        adj[b].append((a, i))
    used = [False] * len(edges)
    start = edges[0][0]
    stack, circuit = [start], []
    while stack:
        v = stack[-1]
        while adj[v] and used[adj[v][-1][1]]:
            adj[v].pop()
        if adj[v]:
            w, i = adj[v].pop()
            used[i] = True
            stack.append(w)
        else:
            circuit.append(stack.pop())
    return circuit[::-1]


def ham_cycle(n, edges):
    E = {frozenset(e) for e in edges}
    for perm in permutations(range(1, n)):
        cyc = (0,) + perm
        if all(frozenset((cyc[i], cyc[(i + 1) % n])) in E for i in range(n)):
            return True
    return False


def main():
    A, B, C, D = range(4)
    k = [(A, B), (A, B), (A, C), (A, C), (A, D), (B, D), (C, D)]
    assert degrees(4, k) == [5, 3, 3, 3]
    assert not euler_exists(4, k, closed=False)
    k2 = k[1:]
    assert sum(d % 2 for d in degrees(4, k2)) == 2 and euler_exists(4, k2, closed=False)
    print("[OK] 주장 1·카드 C1: 쾨니히스베르크")

    rng = random.Random(34)
    tested = 0
    while tested < 300:
        n = rng.randint(2, 5)
        m = rng.randint(1, 7)
        edges = [tuple(rng.sample(range(n), 2)) for _ in range(m)]
        if not connected_on_edges(n, edges):
            continue
        tested += 1
        odd = sum(d % 2 for d in degrees(n, edges))
        assert euler_exists(n, edges, closed=True) == (odd == 0)
        assert euler_exists(n, edges, closed=False) == (odd in (0, 2))
        if odd == 0:
            circ = hierholzer(n, edges)
            steps = Counter(frozenset(p) if p[0] != p[1] else p for p in zip(circ, circ[1:]))
            assert circ[0] == circ[-1] and len(circ) == len(edges) + 1
            assert steps == Counter(frozenset(e) for e in edges)
    print("[OK] 주장 2·3·카드 C3: 오일러 정리와 히어홀처")

    a, b, c, d, e = range(5)
    bow = [(a, b), (b, c), (c, a), (c, d), (d, e), (e, c)]
    assert degrees(5, bow) == [2, 2, 4, 2, 2]
    tour = [a, b, c, d, e, c, a]
    assert Counter(frozenset(p) for p in zip(tour, tour[1:])) == Counter(frozenset(x) for x in bow)
    assert not ham_cycle(5, bow)
    print("[OK] 주장 4·카드 C2: 나비넥타이")

    checked = 0
    for n in range(3, 8):
        allp = list(combinations(range(n), 2))
        for _ in range(60):
            edges = [p for p in allp if rng.random() < 0.7]
            deg = degrees(n, edges)
            if min(deg) >= n / 2:
                assert ham_cycle(n, edges)
                checked += 1
        cyc = [(i, (i + 1) % n) for i in range(n)]
        assert ham_cycle(n, cyc) and set(degrees(n, cyc)) == {2}
    assert checked > 50
    print(f"[OK] 주장 5: 디랙 정리 {checked}개 그래프, C_n")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
