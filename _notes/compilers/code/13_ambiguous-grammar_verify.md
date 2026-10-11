---
layout: "note"
title: "13_ambiguous-grammar_verify.py"
display_title: "13_ambiguous-grammar_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/ambiguous-grammar/"
parent_title: "모호한 문법"
description: "컴파일러 · 모호한 문법 검증 코드"
permalink: "/studies/compilers/code/13_ambiguous-grammar_verify/"
---
{% raw %}
[모호한 문법](/Hongs_Blog/studies/compilers/ambiguous-grammar/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""모호한 문법 문서의 예를 확인한다: 파스 트리 수 세기, 고친 문법이 같은 언어를 만드는지, 매달린 else 문법.

실행: python3 13_ambiguous-grammar_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def language(g, start, maxlen):
    """문법 g가 start에서 만들 수 있는, 길이 maxlen 이하인 단말 문자열 전부."""
    L = {A: set() for A in g}
    changed = True
    while changed:
        changed = False
        for A, prods in g.items():
            for p in prods:
                parts = {()}
                for s in p:
                    choices = L[s] if s in g else {(s,)}
                    parts = {x + y for x in parts for y in choices
                             if len(x) + len(y) <= maxlen}
                    if not parts:
                        break
                if not parts <= L[A]:
                    L[A] |= parts
                    changed = True
    return L[start]


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


if __name__ == "__main__":
    T = lambda s: tuple(s.split())

    # p.35~36: E → E + E | E * E | (E) | id 에서 id * id + id 의 파스 트리는 둘이다.
    amb = G("E -> E + E | E * E | ( E ) | id")
    ts = parse_trees(amb, "E", T("id * id + id"))
    assert sorted(bracket(t) for t in ts) == ["E[E[E[id] * E[id]] + E[id]]", "E[E[id] * E[E[id] + E[id]]]"]

    # p.41: 고친 문법은 같은 언어를 만들고, 모든 문자열의 파스 트리가 하나다.
    fix = G("E -> T + E | T\nT -> F * T | F\nF -> ( E ) | id")
    assert language(amb, "E", 9) == language(fix, "E", 9)
    assert all(len(parse_trees(fix, "E", s)) == 1 for s in language(fix, "E", 9))
    assert bracket(parse_trees(fix, "E", T("id * id + id"))[0]) == "E[T[F[id] * T[F[id]]] + E[T[F[id]]]]"
    # 고친 문법은 같은 연산자를 오른쪽부터 묶는다: id + id + id = id + (id + id)
    assert bracket(parse_trees(fix, "E", T("id + id + id"))[0]) == "E[T[F[id]] + E[T[F[id]] + E[T[F[id]]]]]"
    # 모호한 문법에서 id가 n개인 덧셈의 트리 수: 1, 1, 2, 5, 14 (카탈랑 수)
    counts = [len(parse_trees(amb, "E", T(" + ".join(["id"] * n)))) for n in range(1, 6)]
    assert counts == [1, 1, 2, 5, 14]

    # p.37~38: 매달린 else. 트리가 둘이다.
    d0 = G("E -> if E then E | if E then E else E | other")
    s = T("if other then if other then other else other")
    ts = sorted(bracket(t) for t in parse_trees(d0, "E", s))
    assert ts == ["E[if E[other] then E[if E[other] then E[other] else E[other]]]",
                  "E[if E[other] then E[if E[other] then E[other]] else E[other]]"]

    # p.39~40: 슬라이드의 고친 문법. 트리는 하나뿐이고 else는 가까운 then에 붙는다.
    d1 = G("""E -> M | U
M -> if M then M else M | other
U -> if E then E | if E then M else U""")
    t1 = parse_trees(d1, "E", s)
    assert len(t1) == 1
    assert bracket(t1[0]) == "E[U[if E[M[other]] then E[M[if M[other] then M[other] else M[other]]]]]"
    assert all(len(parse_trees(d1, "E", x)) == 1 for x in language(d1, "E", 13))

    # 그런데 슬라이드의 고친 문법은 원래 문법보다 문자열 하나를 덜 만든다(길이 9 이하에서).
    missing = language(d0, "E", 9) - language(d1, "E", 9)
    assert missing == {T("if if other then other then other else other")}
    assert language(d1, "E", 13) < language(d0, "E", 13)

    # MATCHED의 조건 자리를 E로 바꾸면 언어가 같아지고 모호하지도 않다.
    d2 = G("""E -> M | U
M -> if E then M else M | other
U -> if E then E | if E then M else U""")
    assert language(d0, "E", 13) == language(d2, "E", 13)
    assert all(len(parse_trees(d2, "E", x)) == 1 for x in language(d2, "E", 13))

    # 카드: id + id + id 의 트리 둘, S → SS | a 에서 aaa 의 트리 둘
    assert sorted(bracket(t) for t in parse_trees(amb, "E", T("id + id + id"))) == [
        "E[E[E[id] + E[id]] + E[id]]", "E[E[id] + E[E[id] + E[id]]]"]
    assert len(parse_trees(G("S -> S S | a"), "S", T("a a a"))) == 2
    assert bracket(parse_trees(fix, "E", T("id + id * id"))[0]) == "E[T[F[id]] + E[T[F[id] * T[F[id]]]]]"
    # 균형 괄호 문법은 모호하지 않다
    bal = G("B -> ( B ) | ε")
    assert all(len(parse_trees(bal, "B", x)) == 1 for x in language(bal, "B", 10))

    # 이어 붙이기 규칙 B → B B 가 있으면 ()()() 를 묶는 방법이 둘이다(모호하다)
    cat = G("B -> ( B ) | ( ) | B B")
    assert len(parse_trees(cat, "B", tuple("()()()"))) == 2
    # B → ( B ) B | ε 은 같은 균형 괄호를 만들면서 나무가 하나다
    one = G("B -> ( B ) B | ε")
    assert language(one, "B", 10) == language(G("B -> ( B ) | B B | ε"), "B", 10)
    assert all(len(parse_trees(one, "B", x)) == 1 for x in language(one, "B", 10))

    print("ALL CHECKS PASSED")
```
{% endraw %}
