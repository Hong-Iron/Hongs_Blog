---
layout: "note"
title: "35_trees_verify.py"
display_title: "35_trees_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "35"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/trees/"
parent_title: "트리"
description: "이산수학 · 트리 검증 코드"
permalink: "/studies/discrete-math/code/35_trees_verify/"
---
{% raw %}
[트리](/Hongs_Blog/studies/discrete-math/trees/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""트리 검증.

문서: 35.트리 (예시, 정의, 동치 조건, 증명, 루트 트리, 예제, 오해, 카드 C1~C4)
주장 1: 여섯 동치 조건 — n <= 6의 모든 그래프(n <= 5 전수, n = 6은 무작위 3000개)에서 여섯 조건의 판정이 같다.
주장 2: n >= 2인 트리는 잎이 둘 이상(주장 1의 모든 트리에서).
주장 3: 예시 — 폴더 트리 정점 6, 간선 5, bob-bin 경로 유일, home-/ 제거 시 끊김, bob-bin 추가 시 사이클.
주장 4: 해당하지 않는 예 — 삼각형 + 점은 n = 4, 간선 3인데 트리가 아님(카드 C2, 오해).
주장 5: 이진 트리 — 높이 h의 최대 노드 2^{h+1} - 1, 노드 n이면 높이 >= ceil(lg(n+1)) - 1, n = 1000 -> 9 (카드 C3).
주장 6: 케일리 공식 — K_n의 신장 트리 수 n^{n-2} (n = 2..6, 간선 부분집합 전수). n = 4 -> 16, n = 6 -> 1296.
주장 7: 카드 C4 — 트리에 간선 하나를 더하면 사이클이 정확히 하나(n <= 6 무작위 트리, 사이클 전수).
"""
import math
import random
from itertools import combinations


def connected(n, E):
    if n == 0:
        return True
    adj = {v: [] for v in range(n)}
    for a, b in E:
        adj[a].append(b)
        adj[b].append(a)
    seen, st = {0}, [0]
    while st:
        u = st.pop()
        for w in adj[u]:
            if w not in seen:
                seen.add(w)
                st.append(w)
    return len(seen) == n


def acyclic(n, E):
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for a, b in E:
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        parent[ra] = rb
    return True


def simple_paths(n, E, s, t):
    adj = {v: [] for v in range(n)}
    for a, b in E:
        adj[a].append(b)
        adj[b].append(a)
    count, st = 0, [[s]]
    while st:
        p = st.pop()
        if p[-1] == t:
            count += 1
            continue
        for w in adj[p[-1]]:
            if w not in p:
                st.append(p + [w])
    return count


def conditions(n, E):
    allp = list(combinations(range(n), 2))
    Es = set(E)
    c1 = connected(n, E) and acyclic(n, E)
    c2 = all(simple_paths(n, E, u, v) == 1 for u, v in allp)
    c3 = connected(n, E) and all(not connected(n, [e for e in E if e != x]) for x in E)
    c4 = acyclic(n, E) and all(not acyclic(n, E + [p]) for p in allp if p not in Es)
    c5 = connected(n, E) and len(E) == n - 1
    c6 = acyclic(n, E) and len(E) == n - 1
    return [c1, c2, c3, c4, c5, c6]


def cycles_through_new_edge(n, E):
    """E의 모든 단순 사이클의 수(간선 집합으로 셈)."""
    cyc = set()
    adj = {v: [] for v in range(n)}
    for a, b in E:
        adj[a].append(b)
        adj[b].append(a)
    for s in range(n):
        st = [[s]]
        while st:
            p = st.pop()
            for w in adj[p[-1]]:
                if w == s and len(p) >= 3:
                    cyc.add(frozenset(frozenset(e) for e in zip(p, p[1:] + [s])))
                elif w not in p:
                    st.append(p + [w])
    return len(cyc)


def main():
    rng = random.Random(35)
    trees = []
    for n in range(1, 6):
        allp = list(combinations(range(n), 2))
        for mask in range(1 << len(allp)):
            E = [allp[i] for i in range(len(allp)) if mask >> i & 1]
            c = conditions(n, E)
            assert len(set(c)) == 1, (n, E, c)
            if c[0]:
                trees.append((n, E))
    allp6 = list(combinations(range(6), 2))
    for _ in range(3000):
        E = [p for p in allp6 if rng.random() < rng.choice([0.25, 0.35, 0.5])]
        c = conditions(6, E)
        assert len(set(c)) == 1
        if c[0]:
            trees.append((6, E))
    print("[OK] 주장 1·카드 C1: 여섯 동치 조건")

    for n, E in trees:
        if n >= 2:
            deg = [0] * n
            for a, b in E:
                deg[a] += 1
                deg[b] += 1
            assert sum(d == 1 for d in deg) >= 2
    print("[OK] 주장 2: 잎이 둘 이상")

    names = ["/", "home", "usr", "alice", "bob", "bin"]
    ix = {v: i for i, v in enumerate(names)}
    F = [(ix["/"], ix["home"]), (ix["/"], ix["usr"]), (ix["home"], ix["alice"]), (ix["home"], ix["bob"]), (ix["usr"], ix["bin"])]
    assert len(names) == 6 and len(F) == 5 and all(conditions(6, F))
    assert simple_paths(6, F, ix["bob"], ix["bin"]) == 1
    assert not connected(6, [e for e in F if e != (ix["/"], ix["home"])])
    assert not acyclic(6, F + [(ix["bob"], ix["bin"])])
    print("[OK] 주장 3: 폴더 예시")

    T = [(0, 1), (1, 2), (0, 2)]
    assert len(T) == 4 - 1 and not connected(4, T) and not acyclic(4, T)
    print("[OK] 주장 4·카드 C2·오해: 삼각형 + 점")

    for h in range(0, 12):
        assert sum(2 ** d for d in range(h + 1)) == 2 ** (h + 1) - 1
    for n in range(1, 5000):
        hmin = math.ceil(math.log2(n + 1)) - 1
        assert 2 ** (hmin + 1) - 1 >= n and (hmin == 0 or 2 ** hmin - 1 < n)
    assert math.ceil(math.log2(1001)) - 1 == 9 and 2 ** 10 - 1 >= 1000 > 2 ** 9 - 1
    print("[OK] 주장 5·카드 C3: 이진 트리 높이")

    for n in range(2, 7):
        allp = list(combinations(range(n), 2))
        cnt = sum(1 for E in combinations(allp, n - 1) if acyclic(n, list(E)))
        assert cnt == n ** (n - 2)
    assert 4 ** 2 == 16 and 6 ** 4 == 1296
    print("[OK] 주장 6: 케일리 공식")

    for n, E in trees:
        Es = set(E)
        for p in combinations(range(n), 2):
            if p not in Es:
                assert cycles_through_new_edge(n, E + [p]) == 1
                break
    print("[OK] 주장 7·카드 C4: 사이클이 정확히 하나")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
