---
layout: "note"
title: "54_register-interference-graph_impl.py"
display_title: "54_register-interference-graph_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "54"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/register-interference-graph/"
parent_title: "레지스터 간섭 그래프"
description: "컴파일러 · 레지스터 간섭 그래프 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/54_register-interference-graph_impl/"
---
{% raw %}
[레지스터 간섭 그래프](/Hongs_Blog/studies/compilers/register-interference-graph/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 레지스터 간섭 그래프(RIG) 만들기.
# 실행: python3 54_register-interference-graph_impl.py  (표준 라이브러리만 쓴다)
# 슬라이드 16회 p.4~8의 생존 변수 집합과 간섭 그래프를 그대로 다시 만든다.
from itertools import combinations


def parse(s):
    t = s.split()
    dst, rhs = t[0], t[2:]
    ops = [x.lstrip("-") for x in rhs if x not in "+-*"]
    return dst, [x for x in ops if not x.isdigit()]     # (쓰는 변수, 읽는 변수들)


def block_points(stmts, out):
    pts = [set(out)]
    live = set(out)
    for s in reversed(stmts):
        dst, used = parse(s)
        live.discard(dst)
        live |= set(used)
        pts.append(set(live))
    return pts[::-1]


def liveness(blocks, succ, boundary):
    IN = {b: set() for b in blocks}
    OUT = {b: set() for b in blocks}
    while True:
        changed = False
        for b in list(blocks)[::-1]:
            out = set(boundary.get(b, set()))
            for s in succ.get(b, []):
                out |= IN[s]
            new_in = block_points(blocks[b], out)[0]
            if out != OUT[b] or new_in != IN[b]:
                changed = True
            OUT[b], IN[b] = out, new_in
        if not changed:
            return IN, OUT


def all_points(blocks, succ, boundary):
    IN, OUT = liveness(blocks, succ, boundary)
    return {b: block_points(blocks[b], OUT[b]) for b in blocks}


def build_rig(points, variables):
    """같은 지점의 집합에 함께 들어 있는 두 변수마다 간선 하나."""
    edges = set()
    for pts in points.values():
        for live in pts:
            for u, v in combinations(sorted(live), 2):
                edges.add((u, v))
    adj = {v: set() for v in variables}
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
    return edges, adj


BLOCKS = {"B0": ["b = 3", "c = 1", "f = 0"],
          "B1": ["a = b + c", "d = -a", "e = d + f"],
          "B2": ["f = 2 * e"],
          "B3": ["c = d + e", "e = e - 1"],
          "B4": ["b = f + c"]}
SUCC = {"B0": ["B1"], "B1": ["B2", "B3"], "B2": ["B4"], "B3": ["B4"]}
BOUNDARY = {"B4": {"b"}}              # 다음 블록의 시작 집합 {b} (p.6)

if __name__ == "__main__":
    S = lambda s: set(s.split())
    # 복습 표 (p.4~5): {a, b} d = a + b {b, d}. a와 d는 같은 집합에 함께 든 적이 없다
    pts = block_points(["d = a + b"], {"b", "d"})
    assert pts == [{"a", "b"}, {"b", "d"}]
    assert not any({"a", "d"} <= p for p in pts)

    # p.6: 전역 생존 변수 분석
    P = all_points(BLOCKS, SUCC, BOUNDARY)
    assert P["B0"] == [S(""), S("b"), S("b c"), S("b c f")]
    assert P["B1"] == [S("b c f"), S("a c f"), S("c d f"), S("c d e f")]
    assert P["B2"] == [S("c e"), S("c f")]
    assert P["B3"] == [S("d e f"), S("c e f"), S("c f")]
    assert P["B4"] == [S("c f"), S("b")]
    # 갈림길 앞 블록의 끝 = 두 다음 블록 시작의 합집합
    assert P["B1"][-1] == P["B2"][0] | P["B3"][0]

    # p.7: 간섭 그래프. 그림의 간선 10개
    edges, adj = build_rig(P, "abcdef")
    figure = {("a", "c"), ("a", "f"), ("b", "c"), ("b", "f"), ("c", "d"),
              ("c", "e"), ("c", "f"), ("d", "e"), ("d", "f"), ("e", "f")}
    assert edges == figure and len(edges) == 10
    # p.8: b와 d는 간선이 없고(같이 써도 된다), b와 c는 간선이 있다
    assert "d" not in adj["b"] and "c" in adj["b"]
    # 이웃 수. p.12는 "a has 3 neighbors"라고 적었지만 a의 이웃은 c, f 둘이다
    deg = {v: len(adj[v]) for v in adj}
    assert deg == {"a": 2, "b": 2, "c": 5, "d": 3, "e": 3, "f": 5}
    assert adj["a"] == {"c", "f"}
    # c, d, e, f는 서로 모두 이어져 있다 (네 변수가 한 지점 {c, d, e, f}에서 함께 산다)
    assert all((u, v) in edges for u, v in combinations("cdef", 2))

    # 죽은 대입이 남아 있으면 집합만 보고 만든 그래프는 모자란다
    # y가 살아 있는 동안 x = 1을 하는데 x는 뒤에서 안 쓰인다 -> x와 y는 한 집합에 든 적이 없다
    P2 = {"B": block_points(["y = 5", "x = 1", "z = y + y"], {"z"})}
    e2, _ = build_rig(P2, "xyz")
    assert ("x", "y") not in e2       # 간선이 없으니 같은 레지스터를 줄 수 있고, 그러면 x = 1이 y를 덮어쓴다
    reg = {"x": "r0", "y": "r0", "z": "r1"}
    r = {}
    r[reg["y"]] = 5
    r[reg["x"]] = 1
    r[reg["z"]] = r[reg["y"]] + r[reg["y"]]
    assert r["r1"] == 2 != 10

    # ---- 카드: x = 1; y = x + 1; z = x + y; w = z + y, 끝에서 w만 산다 ----
    pts = block_points(["x = 1", "y = x + 1", "z = x + y", "w = z + y"], {"w"})
    assert pts == [set(), {"x"}, {"x", "y"}, {"y", "z"}, {"w"}]
    e3, a3 = build_rig({"B": pts}, "wxyz")
    assert e3 == {("x", "y"), ("y", "z")} and a3["w"] == set()
    print("ALL CHECKS PASSED")
```
{% endraw %}
