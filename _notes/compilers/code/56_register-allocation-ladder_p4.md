---
layout: "note"
title: "56_register-allocation-ladder_p4.py"
display_title: "56_register-allocation-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "56"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/register-allocation-ladder/"
parent_title: "레지스터 할당 예제 사다리"
description: "컴파일러 · 레지스터 할당 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/compilers/code/56_register-allocation-ladder_p4/"
---
{% raw %}
[레지스터 할당 예제 사다리](/Hongs_Blog/studies/compilers/register-allocation-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 레지스터 할당 예제 사다리 문제 4: 16회 슬라이드의 코드에서 K = 3일 때 c 대신 f, e를 내보내 본다.
# 실행: python3 56_register-allocation-ladder_p4.py  (표준 라이브러리만 쓴다)
# 함수는 56_register-spilling_impl.py에서 복사했다.
from itertools import combinations, product

BLOCKS = {"B0": ["b = 3", "c = 1", "f = 0"],
          "B1": ["a = b + c", "d = -a", "e = d + f"],
          "B2": ["f = 2 * e"],
          "B3": ["c = d + e", "e = e - 1"],
          "B4": ["b = f + c"]}
SUCC = {"B0": ["B1"], "B1": ["B2", "B3"], "B2": ["B4"], "B3": ["B4"]}
BOUNDARY = {"B4": {"b"}}


def parse(s):
    """(쓰는 변수 또는 None, 읽는 변수들). load x m은 x를 쓰고, store x m은 x를 읽는다."""
    t = s.replace(",", "").split()
    if t[0] == "load":
        return t[1], []
    if t[0] == "store":
        return None, [t[1]]
    ops = [x.lstrip("-") for x in t[2:] if x not in "+-*"]
    return t[0], [x for x in ops if not x.isdigit()]


def block_points(stmts, out):
    pts, live = [set(out)], set(out)
    for s in reversed(stmts):
        dst, used = parse(s)
        live.discard(dst)
        live |= set(used)
        pts.append(set(live))
    return pts[::-1]


def all_points(blocks, succ, boundary):
    IN = {b: set() for b in blocks}
    OUT = {b: set() for b in blocks}
    while True:
        changed = False
        for b in list(blocks)[::-1]:
            out = set(boundary.get(b, set()))
            for s in succ.get(b, []):
                out |= IN[s]
            new_in = block_points(blocks[b], out)[0]
            changed |= out != OUT[b] or new_in != IN[b]
            OUT[b], IN[b] = out, new_in
        if not changed:
            return {b: block_points(blocks[b], OUT[b]) for b in blocks}


def build_rig(points):
    edges, nodes = set(), set()
    for pts in points.values():
        for live in pts:
            nodes |= live
            edges |= set(combinations(sorted(live), 2))
    adj = {v: set() for v in nodes}
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
    return edges, adj


def simplify(adj, K):
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
    color = {}
    for t in reversed(stack):
        used = {color[n] for n in adj[t] if n in color}
        color[t] = min(c for c in range(K) if c not in used)
    return color


def spill(blocks, v, addr):
    """v를 읽는 문장 앞에 load, v를 쓰는 문장 뒤에 store를 넣고, 쓰일 때마다 새 이름 v0, v1, …을 준다."""
    out, k = {}, 0
    for b, stmts in blocks.items():
        new = []
        for s in stmts:
            dst, used = parse(s)
            if dst != v and v not in used:
                new.append(s)
                continue
            name = f"{v}{k}"
            k += 1
            t = s.split()
            if v in used:
                new.append(f"load {name} {addr}")
            new.append(" ".join(name if x == v else ("-" + name if x == "-" + v else x) for x in t))
            if dst == v:
                new.append(f"store {name} {addr}")
        out[b] = new
    return out


def execute(blocks, path):
    env, mem = {}, {}
    val = lambda x: -env[x[1:]] if x[0] == "-" and not x[1:].isdigit() else (int(x) if x.lstrip("-").isdigit() else env[x])
    for b in path:
        for s in blocks[b]:
            t = s.split()
            if t[0] == "load":
                env[t[1]] = mem[t[2]]
            elif t[0] == "store":
                mem[t[2]] = env[t[1]]
            elif len(t) == 3:
                env[t[0]] = val(t[2])
            else:
                a, c = val(t[2]), val(t[4])
                env[t[0]] = {"+": a + c, "-": a - c, "*": a * c}[t[3]]
    return env


if __name__ == "__main__":
    S = lambda s: set(s.split())
    # ---- f를 내보낸다 ----
    NEW = spill(BLOCKS, "f", "fa")
    assert NEW == {"B0": ["b = 3", "c = 1", "f0 = 0", "store f0 fa"],
                   "B1": ["a = b + c", "d = -a", "load f1 fa", "e = d + f1"],
                   "B2": ["f2 = 2 * e", "store f2 fa"],
                   "B3": ["c = d + e", "e = e - 1"],
                   "B4": ["load f3 fa", "b = f3 + c"]}
    P = all_points(NEW, SUCC, BOUNDARY)
    assert P["B0"] == [S(""), S("b"), S("b c"), S("b c f0"), S("b c")]
    assert P["B1"] == [S("b c"), S("a c"), S("c d"), S("c d f1"), S("c d e")]
    assert P["B2"] == [S("c e"), S("c f2"), S("c")]
    assert P["B3"] == [S("d e"), S("c e"), S("c")]
    assert P["B4"] == [S("c"), S("c f3"), S("b")]
    edges, adj = build_rig(P)
    assert edges == {("a", "c"), ("b", "c"), ("b", "f0"), ("c", "d"), ("c", "e"), ("c", "f0"),
                     ("c", "f1"), ("c", "f2"), ("c", "f3"), ("d", "e"), ("d", "f1")}
    assert max(len(live) for pts in P.values() for live in pts) == 3      # 한 지점에 많아야 셋
    stack, left = simplify(adj, 3)
    assert left == set()
    color = select(adj, stack, 3)
    assert color == {"f3": 0, "f2": 0, "c": 1, "f1": 0, "f0": 0, "d": 2, "e": 0, "b": 2, "a": 0}
    assert all(color[u] != color[v] for u, v in edges)
    for path in (["B0", "B1", "B2", "B4"], ["B0", "B1", "B3", "B4"]):
        assert execute(BLOCKS, path)["b"] == execute(NEW, path)["b"]
    flat = [s for b in NEW.values() for s in b]
    assert sum(s.startswith("load") for s in flat) == 2 and sum(s.startswith("store") for s in flat) == 2

    # ---- e를 내보내면 아직 막힌다 ----
    NEW_E = spill(BLOCKS, "e", "ea")
    assert NEW_E["B1"] == ["a = b + c", "d = -a", "e0 = d + f", "store e0 ea"]
    assert NEW_E["B3"] == ["load e2 ea", "c = d + e2", "load e3 ea", "e3 = e3 - 1", "store e3 ea"]
    PE = all_points(NEW_E, SUCC, BOUNDARY)
    assert PE["B1"][3] == S("c d e0 f")                                   # e0 = d + f 바로 뒤
    _, adj_e = build_rig(PE)
    assert simplify(adj_e, 3)[1] == S("c d e0 f")
    for path in (["B0", "B1", "B2", "B4"], ["B0", "B1", "B3", "B4"]):
        assert execute(BLOCKS, path)["b"] == execute(NEW_E, path)["b"]
    print("ALL CHECKS PASSED")
```
{% endraw %}
