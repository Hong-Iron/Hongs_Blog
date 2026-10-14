---
layout: "note"
title: "56_register-allocation-ladder_p2.py"
display_title: "56_register-allocation-ladder_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "56"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/register-allocation-ladder/"
parent_title: "레지스터 할당 예제 사다리"
description: "컴파일러 · 레지스터 할당 예제 사다리 문제 2 풀이 코드"
sitemap: false
permalink: "/studies/compilers/code/56_register-allocation-ladder_p2/"
---
{% raw %}
[레지스터 할당 예제 사다리](/Hongs_Blog/studies/compilers/register-allocation-ladder/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 레지스터 할당 예제 사다리 문제 2: 직선 코드 다섯 줄, K = 3.
# 실행: python3 56_register-allocation-ladder_p2.py  (표준 라이브러리만 쓴다)
# 함수는 56_register-spilling_impl.py에서 복사했다.
from itertools import combinations, product


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


CODE = {"B": ["a = 1", "b = 2", "c = a + b", "d = c + a", "e = d + b"]}

if __name__ == "__main__":
    S = lambda s: set(s.split())
    P = all_points(CODE, {}, {"B": {"e"}})
    assert P["B"] == [S(""), S("a"), S("a b"), S("a b c"), S("b d"), S("e")]
    edges, adj = build_rig(P)
    assert edges == {("a", "b"), ("a", "c"), ("b", "c"), ("b", "d")}
    # K = 2: d, e를 빼면 a, b, c 삼각형이 남아 막힌다
    assert simplify(adj, 2) == (["d", "e"], set("abc"))
    # K = 3: 이름 순으로 다 빠진다. 꺼내며 가장 작은 번호를 주면 e, d, c가 r0, b가 r1, a가 r2
    stack, left = simplify(adj, 3)
    assert stack == list("abcde") and left == set()
    color = select(adj, stack, 3)
    assert color == {"e": 0, "d": 0, "c": 0, "b": 1, "a": 2}
    # 레지스터로 바꾼 코드: e = 6
    reg = {v: f"r{c}" for v, c in color.items()}
    REG = {"B": [" ".join(reg.get(x, x) for x in s.split()) for s in CODE["B"]]}
    assert REG["B"] == ["r2 = 1", "r1 = 2", "r0 = r2 + r1", "r0 = r0 + r2", "r0 = r0 + r1"]
    assert execute(CODE, ["B"])["e"] == execute(REG, ["B"])["r0"] == 6
    print("ALL CHECKS PASSED")
```
{% endraw %}
