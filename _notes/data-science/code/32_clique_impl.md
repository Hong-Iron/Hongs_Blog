---
layout: "note"
title: "32_clique_impl.py"
display_title: "32_clique_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "32"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/clique/"
parent_title: "CLIQUE"
description: "데이터 과학 · CLIQUE 구현 코드"
permalink: "/studies/data-science/code/32_clique_impl/"
---
{% raw %}
[CLIQUE](/Hongs_Blog/studies/data-science/clique/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""CLIQUE(격자 기반 부분공간 군집화) 구현과 자체 테스트.

문서: 32.CLIQUE (예시, 의사코드, 카드)
출처: 데이터 과학 7회 슬라이드 7-2 p.14~18
방법: 차원마다 [0, 10)을 같은 폭 ξ칸으로 나누고, 칸들의 곱(단위)에 든 점의 비율이 τ 이상이면 밀집 단위.
      1차원 밀집 단위에서 시작해, (k-1)차원 밀집 단위끼리만 이어 k차원 후보를 만든다(아프리오리 성질).
      같은 부분공간의 이웃한 밀집 단위를 이어 군집을 만든다.
주장:
  1. 단위에 든 점은 그 단위를 어느 부분공간에 비추어도 비춘 단위 안에 있다 -> 비춘 단위의 개수 >= 원래 단위의 개수.
     그래서 k차원 밀집 단위의 모든 (k-1)차원 투영은 밀집이다 (무작위 200회).
  2. 예: 점 300개. 군집 A는 (x1, x2)에서만 모이고 x3은 고르게 퍼짐, 나머지는 잡음.
     2차원 부분공간 (x1, x2)에서 밀집 단위가 이웃해 군집 하나가 되고, 3차원 전체에서는 밀집 단위가 없다.
"""
import random
from itertools import combinations


def unit_of(p, dims, xi, width):
    return tuple((d, min(int(p[d] // width), xi - 1)) for d in dims)


def dense_units(P, dims, xi, tau, width=10 / 10):
    cnt = {}
    for p in P:
        u = unit_of(p, dims, xi, 10 / xi)
        cnt[u] = cnt.get(u, 0) + 1
    return {u: c for u, c in cnt.items() if c / len(P) >= tau}


def clique(P, D, xi, tau):
    result = {}
    L = {}
    for d in range(D):
        for u, c in dense_units(P, (d,), xi, tau).items():
            L[u] = c
    result[1] = L
    k = 1
    while L:
        cands = set()
        keys = list(L)
        for a in keys:
            for b in keys:
                da = [x[0] for x in a]; db = [x[0] for x in b]
                if a[:-1] == b[:-1] and da[-1] < db[-1]:
                    c = a + (b[-1],)
                    if all(tuple(s) in L for s in combinations(c, k)):
                        cands.add(c)
        cnt = {}
        for p in P:
            for c in cands:
                if all(min(int(p[d] // (10 / xi)), xi - 1) == i for d, i in c):
                    cnt[c] = cnt.get(c, 0) + 1
        L = {c: n for c, n in cnt.items() if n / len(P) >= tau}
        k += 1
        if L:
            result[k] = L
    return result


def connected(units):
    units = list(units); seen = set(); groups = []
    for u in units:
        if u in seen:
            continue
        g = []; st = [u]; seen.add(u)
        while st:
            x = st.pop(); g.append(x)
            for y in units:
                if y not in seen and sum(abs(a[1] - b[1]) for a, b in zip(x, y)) == 1:
                    seen.add(y); st.append(y)
        groups.append(sorted(g))
    return groups


def main():
    rnd = random.Random(8)
    for _ in range(200):
        P = [tuple(rnd.uniform(0, 10) for _ in range(3)) for _ in range(rnd.randint(20, 80))]
        xi = rnd.randint(2, 5)
        full = dense_units(P, (0, 1, 2), xi, 0)
        for u, c in full.items():
            for s in combinations(u, 2):
                proj = sum(1 for p in P if all(min(int(p[d] // (10 / xi)), xi - 1) == i for d, i in s))
                assert proj >= c
    print("[OK] 무작위 200회: 단위의 투영에 든 점 수 >= 단위에 든 점 수 (아프리오리 성질)")

    A = [(rnd.uniform(2, 4), rnd.uniform(6, 8), rnd.uniform(0, 10)) for _ in range(120)]
    noise = [tuple(rnd.uniform(0, 10) for _ in range(3)) for _ in range(180)]
    P = A + noise
    res = clique(P, 3, 5, 0.15)
    two = res.get(2, {})
    sub = {u for u in two if [d for d, _ in u] == [0, 1]}
    assert sub and all([d for d, _ in u] == [0, 1] for u in two)
    groups = connected(sub)
    assert len(groups) == 1
    assert 3 not in res
    print("     2차원 밀집 단위:", sorted(two), "/ 3차원 밀집 단위:", res.get(3, {}))
    print("[OK] (x1, x2) 부분공간에서만 군집 하나가 나타나고, 3차원 전체에는 밀집 단위가 없다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
