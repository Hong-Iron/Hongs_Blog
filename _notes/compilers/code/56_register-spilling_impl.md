---
layout: "note"
title: "56_register-spilling_impl.py"
display_title: "56_register-spilling_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "56"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/register-spilling/"
parent_title: "스필링"
description: "컴파일러 · 스필링 구현 코드"
permalink: "/studies/compilers/code/56_register-spilling_impl/"
---
{% raw %}
[스필링](/Hongs_Blog/studies/compilers/register-spilling/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 스필링: 색이 모자랄 때 변수 하나를 메모리로 내보내고 다시 칠하기.
# 실행: python3 56_register-spilling_impl.py  (표준 라이브러리만 쓴다)
# 슬라이드 16회 p.29~35의 고쳐 쓴 코드, 생존 변수 집합, 새 간섭 그래프, 색을 그대로 다시 만든다.
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
    # ---- 스필링 전: K = 3이면 a, b를 뺀 뒤 막힌다 (p.28) ----
    _, adj = build_rig(all_points(BLOCKS, SUCC, BOUNDARY))
    stack, left = simplify(adj, 3)
    assert stack == ["a", "b"] and left == set("cdef")

    # ---- p.30~32: c를 내보내고 코드 고쳐 쓰기 ----
    NEW = spill(BLOCKS, "c", "ca")
    assert NEW == {"B0": ["b = 3", "c0 = 1", "store c0 ca", "f = 0"],
                   "B1": ["load c1 ca", "a = b + c1", "d = -a", "e = d + f"],
                   "B2": ["f = 2 * e"],
                   "B3": ["c2 = d + e", "store c2 ca", "e = e - 1"],
                   "B4": ["load c3 ca", "b = f + c3"]}

    # ---- p.33: 고쳐 쓴 코드의 생존 변수 ----
    P = all_points(NEW, SUCC, BOUNDARY)
    assert P["B0"] == [S(""), S("b"), S("b c0"), S("b"), S("b f")]
    assert P["B1"] == [S("b f"), S("b c1 f"), S("a f"), S("d f"), S("d e f")]
    assert P["B2"] == [S("e"), S("f")]
    assert P["B3"] == [S("d e f"), S("e f c2"), S("e f"), S("f")]
    assert P["B4"] == [S("f"), S("f c3"), S("b")]
    # 새 이름 c0~c3은 저마다 딱 한 지점에서만 살아 있다
    for ci in ("c0", "c1", "c2", "c3"):
        assert sum(ci in live for pts in P.values() for live in pts) == 1

    # ---- p.34: 새 간섭 그래프 (간선 11개) ----
    edges, adj2 = build_rig(P)
    figure = {("b", "c0"), ("b", "c1"), ("b", "f"), ("a", "f"), ("c1", "f"), ("d", "e"),
              ("d", "f"), ("e", "f"), ("c2", "e"), ("c2", "f"), ("c3", "f")}
    assert edges == figure and len(edges) == 11
    # 이웃 수: 예전의 c는 5개였는데 조각난 c0~c3은 1~2개씩이다
    assert {v: len(adj2[v]) for v in ("c0", "c1", "c2", "c3")} == {"c0": 1, "c1": 2, "c2": 2, "c3": 1}

    # ---- p.35: 3색으로 칠해진다 ----
    stack, left = simplify(adj2, 3)
    assert left == set()
    color = select(adj2, stack, 3)
    assert all(color[u] != color[v] for u, v in edges) and max(color.values()) <= 2
    slide = dict(c0=0, a=0, c1=0, b=1, d=1, e=0, c3=1, f=2, c2=1)          # 그림의 r0, r1, r2
    assert all(slide[u] != slide[v] for u, v in edges) and set(slide) == set(adj2)

    # ---- 고쳐 쓴 코드는 원래 코드와 같은 b를 낸다 (두 길 모두), 레지스터 이름으로 바꿔도 같다 ----
    for path in (["B0", "B1", "B2", "B4"], ["B0", "B1", "B3", "B4"]):
        e1 = execute(BLOCKS, path)
        e2 = execute(NEW, path)
        assert e1["b"] == e2["b"]
        reg = {v: f"r{c}" for v, c in slide.items()}
        REG = {b: [" ".join(("-" + reg[x[1:]]) if x[0] == "-" and x[1:] in reg else reg.get(x, x) for x in s.split())
                   for s in NEW[b]] for b in NEW}
        assert execute(REG, path)[reg["b"]] == e1["b"] == (-7 if "B2" in path else -8)
    assert REG == {"B0": ["r1 = 3", "r0 = 1", "store r0 ca", "r2 = 0"],
                   "B1": ["load r0 ca", "r0 = r1 + r0", "r1 = -r0", "r0 = r1 + r2"],
                   "B2": ["r2 = 2 * r0"],
                   "B3": ["r1 = r1 + r0", "store r1 ca", "r0 = r0 - 1"],
                   "B4": ["load r1 ca", "r1 = r2 + r1"]}

    # ---- 치르는 값: 메모리 읽기 2번, 쓰기 2번이 코드에 생겼다 ----
    flat = [s for b in NEW.values() for s in b]
    assert sum(s.startswith("load") for s in flat) == 2 and sum(s.startswith("store") for s in flat) == 2

    # ---- 무엇을 내보내느냐에 따라 결과가 다르다 ----
    def after_spill(v):
        Pv = all_points(spill(BLOCKS, v, v + "a"), SUCC, BOUNDARY)
        return Pv, simplify(build_rig(Pv)[1], 3)[1]
    # c, d, f는 하나만 내보내도 3색으로 칠해진다
    for v in "cdf":
        assert after_spill(v)[1] == set(), v
    # e를 내보내면 아직 막힌다: e0 = d + f 바로 뒤(store 앞)에 c, d, e0, f 넷이 함께 살아 있다
    Pe, left_e = after_spill("e")
    assert left_e == {"c", "d", "e0", "f"}
    assert {"c", "d", "e0", "f"} in Pe["B1"]
    # a나 b는 처음부터 문제가 아니었다. 내보내도 c, d, e, f가 그대로 서로 이어져 있다
    for v in "ab":
        assert set("cdef") <= after_spill(v)[1], v

    # ---- 카드: d를 내보낼 때 고쳐 쓴 코드 ----
    ND = spill(BLOCKS, "d", "da")
    assert ND["B1"] == ["a = b + c", "d0 = -a", "store d0 da", "load d1 da", "e = d1 + f"]
    assert ND["B3"] == ["load d2 da", "c = d2 + e", "e = e - 1"]
    assert ND["B0"] == BLOCKS["B0"] and ND["B2"] == BLOCKS["B2"] and ND["B4"] == BLOCKS["B4"]
    flat = [s for b in ND.values() for s in b]
    assert sum(s.startswith("load") for s in flat) == 2 and sum(s.startswith("store") for s in flat) == 1

    # ---- 카드 C3: 새 이름을 붙이지 않고 모두 c로 두면 ----
    SAME = {b: [x.replace("c0", "c").replace("c1", "c").replace("c2", "c").replace("c3", "c") for x in v] for b, v in NEW.items()}
    PS = all_points(SAME, SUCC, BOUNDARY)
    es, adjs = build_rig(PS)
    assert adjs["c"] == {"b", "e", "f"}                       # 네 조각의 이웃이 한 노드에 모인다
    assert max(len(live) for pts in PS.values() for live in pts) == 3
    assert simplify(adjs, 3)[1] == set()                      # 이 예에서는 그래도 3색으로 칠해진다
    assert max(len(adj2[v]) for v in ("c0", "c1", "c2", "c3")) == 2
    print("ALL CHECKS PASSED")
```
{% endraw %}
