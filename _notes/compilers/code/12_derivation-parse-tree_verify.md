---
layout: "note"
title: "12_derivation-parse-tree_verify.py"
display_title: "12_derivation-parse-tree_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/derivation-parse-tree/"
parent_title: "유도와 파스 트리"
description: "컴파일러 · 유도와 파스 트리 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/12_derivation-parse-tree_verify/"
---
{% raw %}
[유도와 파스 트리](/Hongs_Blog/studies/compilers/derivation-parse-tree/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""유도와 파스 트리 문서의 예를 확인한다: 슬라이드의 좌측·우측 유도, 잎을 왼쪽부터 읽기, 파스 트리와 좌측 유도의 일대일 대응.

실행: python3 12_derivation-parse-tree_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
"""


def G(text):
    """'A -> x B | ε' 꼴의 줄들을 {비단말: [생성 규칙(기호 튜플), ...]}로 바꾼다. ε은 빈 튜플."""
    g = {}
    for line in text.strip().splitlines():
        head, body = line.split("->")
        alts = g.setdefault(head.strip(), [])
        for alt in body.split("|"):
            syms = tuple(s for s in alt.split() if s != "ε")
            alts.append(syms)
    return g


def show(g):
    return {A: [" ".join(p) or "ε" for p in ps] for A, ps in g.items()}


def min_len(g):
    """비단말마다 만들 수 있는 가장 짧은 문자열의 길이."""
    INF = 10 ** 9
    m = {A: INF for A in g}
    changed = True
    while changed:
        changed = False
        for A, prods in g.items():
            for p in prods:
                t = sum(m[s] if s in g else 1 for s in p)
                if t < m[A]:
                    m[A] = t
                    changed = True
    return m


def parse_trees(g, start, tokens):
    """tokens의 파스 트리를 모두 돌려준다. 비단말 노드는 (이름, 자식...), 단말은 문자열."""
    tokens = tuple(tokens)
    m = min_len(g)
    memo = {}

    def sym(s, i, j):
        if s not in g:
            return [s] if j == i + 1 and tokens[i] == s else []
        key = (s, i, j)
        if key in memo:
            return memo[key]
        memo[key] = []
        out = []
        for p in g[s]:
            for kids in seq(p, i, j):
                out.append((s,) + kids)
        memo[key] = out
        return out

    def seq(p, i, j):
        if not p:
            return [()] if i == j else []
        first_min = m[p[0]] if p[0] in g else 1
        rest_min = sum(m[x] if x in g else 1 for x in p[1:])
        out = []
        for k in range(i + first_min, j - rest_min + 1):
            heads = sym(p[0], i, k)
            if heads:
                for tail in seq(p[1:], k, j):
                    for h in heads:
                        out.append((h,) + tail)
        return out

    return sym(start, 0, len(tokens))


def leaves(t):
    """트리의 잎을 왼쪽부터 읽는다."""
    if isinstance(t, str):
        return [t]
    return [x for c in t[1:] for x in leaves(c)]


def bracket(t):
    """트리를 한 줄 글로 적는다. 예: E[E[id] + E[id]]"""
    if isinstance(t, str):
        return t
    return t[0] + "[" + " ".join(bracket(c) for c in t[1:]) + "]" if len(t) > 1 else t[0] + "[ε]"


def derivation(tree, leftmost=True):
    """파스 트리에서 좌측(또는 우측) 유도의 문장 형식들을 차례로 만든다."""
    form = [tree]
    steps = [[n if isinstance(n, str) else n[0] for n in form]]
    while any(not isinstance(n, str) for n in form):
        idxs = [i for i, n in enumerate(form) if not isinstance(n, str)]
        i = idxs[0] if leftmost else idxs[-1]
        form[i:i + 1] = list(form[i][1:])
        steps.append([n if isinstance(n, str) else n[0] for n in form])
    return [" ".join(s) for s in steps]


def count_leftmost_derivations(g, start, tokens):
    """tokens에 이르는 좌측 유도가 몇 가지인지 직접 센다(ε 규칙이 없는 문법용)."""
    tokens = tuple(tokens)

    def go(form):
        i = next((k for k, s in enumerate(form) if s in g), None)
        if i is None:
            return 1 if form == tokens else 0
        if len(form) > len(tokens) or form[:i] != tokens[:i]:
            return 0
        return sum(go(form[:i] + p + form[i + 1:]) for p in g[form[i]])

    return go((start,))


if __name__ == "__main__":
    g = G("E -> E + E | E * E | ( E ) | id")
    s = "id * id + id".split()
    trees = parse_trees(g, "E", s)
    # 슬라이드 p.24~30의 트리: 뿌리가 + 이고 왼쪽 자식이 id * id
    t = [x for x in trees if x[2] == "+"][0]
    assert bracket(t) == "E[E[E[id] * E[id]] + E[id]]"

    # p.20, p.25~29의 좌측 유도
    assert derivation(t, True) == ["E", "E + E", "E * E + E", "id * E + E", "id * id + E", "id * id + id"]
    # p.20, p.31의 우측 유도
    assert derivation(t, False) == ["E", "E + E", "E + id", "E * E + id", "E * id + id", "id * id + id"]
    # 두 유도는 같은 트리에서 나왔고, 걸음 수는 비단말 노드 수(5)와 같다
    assert len(derivation(t, True)) - 1 == len(derivation(t, False)) - 1 == 5

    # p.30: 잎을 왼쪽부터 읽으면 원래 문자열이다
    for x in trees:
        assert leaves(x) == s

    # p.19: E ⇒ (E) ⇒ (E + E) ⇒ (id + E) ⇒ (id + id)
    t2 = parse_trees(g, "E", "( id + id )".split())
    assert len(t2) == 1
    assert derivation(t2[0], True) == ["E", "( E )", "( E + E )", "( id + E )", "( id + id )"]

    # 파스 트리 하나에 좌측 유도 하나: 트리 수와 좌측 유도 수가 같다
    for text in ["id", "id + id", "id * id + id", "id + id + id + id", "( id + id ) * id"]:
        toks = text.split()
        ts = parse_trees(g, "E", toks)
        assert len(ts) == count_leftmost_derivations(g, "E", toks)
        assert len({tuple(derivation(x, True)) for x in ts}) == len(ts)
    assert len(trees) == 2 and len(parse_trees(g, "E", "id + id + id + id".split())) == 5

    # 문장 형식과 문장: E * E + E 는 문장 형식이지만 문장은 아니다(비단말이 남아 있다)
    forms = derivation(t, True)
    assert "E * E + E" in forms and all(tok in ("id", "+", "*") for tok in forms[-1].split())

    # 카드: id + id * id 를 뿌리가 + 인 트리로 읽을 때의 우측 유도
    t3 = [x for x in parse_trees(g, "E", "id + id * id".split()) if x[2] == "+"][0]
    assert derivation(t3, False) == ["E", "E + E", "E + E * E", "E + E * id", "E + id * id", "id + id * id"]
    assert derivation(t3, True) == ["E", "E + E", "id + E", "id + E * E", "id + id * E", "id + id * id"]

    print("ALL CHECKS PASSED")
```
{% endraw %}
