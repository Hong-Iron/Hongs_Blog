---
layout: "note"
title: "55_graph-coloring-register-allocation_impl.py"
display_title: "55_graph-coloring-register-allocation_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "55"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/graph-coloring-register-allocation/"
parent_title: "그래프 색칠 레지스터 할당"
description: "컴파일러 · 그래프 색칠 레지스터 할당 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/55_graph-coloring-register-allocation_impl/"
---
{% raw %}
[그래프 색칠 레지스터 할당](/Hongs_Blog/studies/compilers/graph-coloring-register-allocation/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 그래프 색칠로 레지스터 나눠 주기 (노드를 하나씩 빼서 스택에 쌓았다가 거꾸로 칠하기).
# 실행: python3 55_graph-coloring-register-allocation_impl.py  (표준 라이브러리만 쓴다)
# 문서의 추적(스택, 색, 레지스터로 바꾼 코드)을 그대로 다시 만든다.
import random
from itertools import combinations, product

EDGES = {("a", "c"), ("a", "f"), ("b", "c"), ("b", "f"), ("c", "d"),
         ("c", "e"), ("c", "f"), ("d", "e"), ("d", "f"), ("e", "f")}   # 문서의 간섭 그래프


def adjacency(nodes, edges):
    adj = {v: set() for v in nodes}
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
    return adj


def simplify(adj, K):
    """이웃이 K보다 적은 노드를 (이름 순으로) 하나씩 빼서 스택에 쌓는다.
    돌려주는 값: (스택, 막혔을 때 남은 노드들). 다 빼면 남은 것이 빈 집합."""
    adj = {v: set(n) for v, n in adj.items()}
    stack = []
    while adj:
        cand = sorted(v for v in adj if len(adj[v]) < K)
        if not cand:
            return stack, set(adj)
        t = cand[0]
        for n in adj[t]:
            adj[n].discard(t)
        del adj[t]
        stack.append(t)
    return stack, set()


def select(adj, stack, K):
    """스택 맨 위부터 꺼내, 이미 칠한 이웃과 다른 색 중 가장 작은 번호를 준다."""
    color = {}
    for t in reversed(stack):
        used = {color[n] for n in adj[t] if n in color}
        free = [c for c in range(K) if c not in used]
        assert free, "이웃이 K보다 적을 때 뺐으므로 남는 색이 반드시 있다"
        color[t] = free[0]
    return color


def valid(adj, color, K):
    return all(0 <= color[v] < K for v in adj) and all(color[u] != color[v] for u in adj for v in adj[u])


def colorable(adj, K):
    """전수 검사: K색으로 칠할 방법이 하나라도 있는가."""
    nodes = sorted(adj)
    for cs in product(range(K), repeat=len(nodes)):
        c = dict(zip(nodes, cs))
        if all(c[u] != c[v] for u in adj for v in adj[u]):
            return True
    return False


def ev(stmt, env):
    t = stmt.split()
    val = lambda x: -env[x[1:]] if x.startswith("-") and not x[1:].isdigit() else (env[x] if not x.lstrip("-").isdigit() else int(x))
    rhs = t[2:]
    if len(rhs) == 1:
        env[t[0]] = val(rhs[0])
    else:
        a, b = val(rhs[0]), val(rhs[2])
        env[t[0]] = {"+": a + b, "-": a - b, "*": a * b}[rhs[1]]


if __name__ == "__main__":
    adj = adjacency("abcdef", EDGES)

    # ---- K = 4 ----
    stack, left = simplify(adj, 4)
    assert left == set()
    assert stack == list("abcdef")           # 스택: 바닥 a, b, c, d, e, f 맨 위
    # 빼는 순간의 이웃 수는 모두 4보다 작다: a 2, b 2, c 3, d 2, e 1, f 0
    tmp = {v: set(n) for v, n in adj.items()}
    degs = []
    for t in stack:
        degs.append(len(tmp[t]))
        for n in tmp[t]:
            tmp[n].discard(t)
        del tmp[t]
    assert degs == [2, 2, 3, 2, 1, 0]
    color = select(adj, stack, 4)
    assert valid(adj, color, 4)
    # 문서의 색칠과 d, f의 색을 맞바꾼 색칠도 맞다. 색은 고르기 나름이라 여러 답이 있다
    swapped = dict(a=0, b=0, c=1, d=3, e=0, f=2)
    traced = dict(a=0, b=0, c=1, d=2, e=0, f=3)
    assert valid(adj, swapped, 4) and valid(adj, traced, 4)
    # 핵심 생각: a를 뺀 그래프가 4색으로 칠해지면 a도 칠할 수 있다. a의 이웃은 2개(c, f)다
    assert adj["a"] == {"c", "f"}
    rest = {v: n - {"a"} for v, n in adj.items() if v != "a"}
    assert colorable(rest, 4)

    # 레지스터 이름으로 바꾼 코드가 원래 코드와 같은 값을 낸다 (두 길 모두)
    B = {"B0": ["b = 3", "c = 1", "f = 0"], "B1": ["a = b + c", "d = -a", "e = d + f"],
         "B2": ["f = 2 * e"], "B3": ["c = d + e", "e = e - 1"], "B4": ["b = f + c"]}
    R = {"B0": ["r0 = 3", "r1 = 1", "r3 = 0"], "B1": ["r0 = r0 + r1", "r2 = -r0", "r0 = r2 + r3"],
         "B2": ["r3 = 2 * r0"], "B3": ["r1 = r2 + r0", "r0 = r0 - 1"], "B4": ["r0 = r3 + r1"]}
    reg = {v: f"r{c}" for v, c in traced.items()}
    for b in B:                               # 바꾼 코드는 색대로 이름만 바꾼 것이다
        for s, r in zip(B[b], R[b]):
            toks = [("-" + reg[x[1:]]) if x.startswith("-") and x[1:] in reg else reg.get(x, x) for x in s.split()]
            assert " ".join(toks) == r, (s, r)
    for path in (["B0", "B1", "B2", "B4"], ["B0", "B1", "B3", "B4"]):
        e1, e2 = {}, {}
        for b in path:
            for s in B[b]:
                ev(s, e1)
            for s in R[b]:
                ev(s, e2)
        assert e1["b"] == e2[reg["b"]] == (-7 if "B2" in path else -8)
    assert len(set(reg.values())) == 4        # 변수 6개를 레지스터 4개로

    # ---- K = 3: a, b를 뺀 뒤 막힌다 ----
    stack3, left3 = simplify(adj, 3)
    assert stack3 == ["a", "b"] and left3 == set("cdef")
    sub = {v: adj[v] & left3 for v in left3}
    assert all(len(sub[v]) == 3 for v in sub)             # c, d, e, f 모두 이웃 3개
    assert not colorable(adj, 3)                          # 실제로도 3색으로는 못 칠한다 (3^6 = 729가지 전수)
    assert colorable(adj, 4)

    # ---- 막혔다고 해서 못 칠하는 것은 아니다: 사각형 고리, K = 2 ----
    sq = adjacency("wxyz", {("w", "x"), ("x", "y"), ("y", "z"), ("w", "z")})
    st, lf = simplify(sq, 2)
    assert st == [] and lf == set("wxyz")                 # 모두 이웃이 2개라 하나도 못 뺀다
    assert colorable(sq, 2)                               # 그런데 w, y / x, z로 두 색이면 된다

    # ---- 무작위 그래프: 다 뺄 수 있으면 색칠은 반드시 맞다. 못 칠하는 그래프는 반드시 막힌다 ----
    rnd = random.Random(3)
    stuck_but_colorable = 0
    for _ in range(3000):
        n = rnd.randint(1, 7)
        nodes = [chr(97 + i) for i in range(n)]
        edges = {e for e in combinations(nodes, 2) if rnd.random() < 0.45}
        g = adjacency(nodes, edges)
        K = rnd.randint(1, 4)
        st, lf = simplify(g, K)
        if not lf:
            assert valid(g, select(g, st, K), K)
            assert colorable(g, K)
        else:
            stuck_but_colorable += colorable(g, K)
        if not colorable(g, K):
            assert lf
    assert stuck_but_colorable > 0

    # ---- 카드: 오각형 고리 a-b-c-d-e-a ----
    c5 = adjacency("abcde", {("a", "b"), ("b", "c"), ("c", "d"), ("d", "e"), ("a", "e")})
    st, lf = simplify(c5, 3)
    assert st == list("abcde") and lf == set()
    assert select(c5, st, 3) == {"e": 0, "d": 1, "c": 0, "b": 1, "a": 2}
    st, lf = simplify(c5, 2)
    assert st == [] and lf == set("abcde") and not colorable(c5, 2)      # 홀수 고리는 정말로 두 색으로 못 칠한다
    print("ALL CHECKS PASSED")
```
{% endraw %}
