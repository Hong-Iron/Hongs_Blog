---
layout: "note"
title: "15_grammar-rewriting-ladder_p4.py"
display_title: "15_grammar-rewriting-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "15"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/grammar-rewriting-ladder/"
parent_title: "문법 고치기 예제 사다리"
description: "컴파일러 · 문법 고치기 예제 사다리 문제 4 풀이 코드"
sitemap: false
permalink: "/studies/compilers/code/15_grammar-rewriting-ladder_p4/"
---
{% raw %}
[문법 고치기 예제 사다리](/Hongs_Blog/studies/compilers/grammar-rewriting-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""문법 고치기 예제 사다리의 답을 확인한다: 고친 문법이 원래 문법과 같은 언어를 만들고 LL(1) 표에 충돌이 없는지.

실행: python3 15_grammar-rewriting-ladder_p4.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


EPS = "ε"
END = "$"


def first_of(seq, first, g):
    """기호열 seq의 FIRST. first는 비단말별 FIRST 집합."""
    out = set()
    for s in seq:
        if s not in g:
            out.add(s)
            return out
        out |= first[s] - {EPS}
        if EPS not in first[s]:
            return out
    out.add(EPS)
    return out


def first_sets(g):
    """더 늘어나지 않을 때까지 규칙을 되풀이해 모든 비단말의 FIRST를 구한다."""
    first = {A: set() for A in g}
    changed = True
    while changed:
        changed = False
        for A, prods in g.items():
            for p in prods:
                f = first_of(p, first, g)
                if not f <= first[A]:
                    first[A] |= f
                    changed = True
    return first


def follow_sets(g, start, first):
    """더 늘어나지 않을 때까지 세 규칙을 되풀이해 모든 비단말의 FOLLOW를 구한다."""
    follow = {A: set() for A in g}
    follow[start].add(END)
    changed = True
    while changed:
        changed = False
        for B, prods in g.items():
            for p in prods:
                for i, A in enumerate(p):
                    if A not in g:
                        continue
                    fb = first_of(p[i + 1:], first, g)
                    add = fb - {EPS}
                    if EPS in fb:
                        add |= follow[B]
                    if not add <= follow[A]:
                        follow[A] |= add
                        changed = True
    return follow


def ll1_table(g, start):
    """표[(비단말, 단말)] = 그 칸에 들어가는 생성 규칙들의 목록. 두 개 이상이면 충돌이다."""
    first = first_sets(g)
    follow = follow_sets(g, start, first)
    table = {}
    for A, prods in g.items():
        for p in prods:
            f = first_of(p, first, g)
            cols = f - {EPS}
            if EPS in f:
                cols |= follow[A]
            for x in cols:
                table.setdefault((A, x), []).append(p)
    return table


def conflicts(table):
    return {k: v for k, v in table.items() if len(v) > 1}


def same(g1, s1, g2, s2, n):
    return language(g1, s1, n) == language(g2, s2, n)


def is_ll1(g, start):
    return not conflicts(ll1_table(g, start))


if __name__ == "__main__":
    # 문제 1: DECL → DECL type id ; | DECL type id = id ; | ε
    o1 = G("DECL -> DECL type id ; | DECL type id = id ; | ε")
    a1 = G("DECL -> A\nA -> type id ; A | type id = id ; A | ε")           # 좌재귀를 없앤 직후
    b1 = G("DECL -> type id ; DECL | type id = id ; DECL | ε")              # 줄인 꼴
    c1 = G("DECL -> type id DECL' | ε\nDECL' -> ; DECL | = id ; DECL")       # 좌인수분해
    assert same(o1, "DECL", a1, "DECL", 12) and same(o1, "DECL", b1, "DECL", 12) and same(o1, "DECL", c1, "DECL", 12)
    assert not is_ll1(o1, "DECL") and not is_ll1(b1, "DECL") and is_ll1(c1, "DECL")
    assert ("type", "id", ";", "type", "id", "=", "id", ";") in language(c1, "DECL", 8)

    # 문제 2: E → E + T | T, T → id | id ( )
    o2 = G("E -> E + T | T\nT -> id | id ( )")
    a2 = G("E -> T E'\nE' -> + T E' | ε\nT -> id | id ( )")
    b2 = G("E -> T E'\nE' -> + T E' | ε\nT -> id T'\nT' -> ( ) | ε")
    assert same(o2, "E", a2, "E", 9) and same(o2, "E", b2, "E", 9)
    assert not is_ll1(o2, "E") and not is_ll1(a2, "E") and is_ll1(b2, "E")

    # 문제 3: S → S ; a | a b | a c
    o3 = G("S -> S ; a | a b | a c")
    a3 = G("S -> a b S' | a c S'\nS' -> ; a S' | ε")
    b3 = G("S -> a S''\nS'' -> b S' | c S'\nS' -> ; a S' | ε")
    assert same(o3, "S", a3, "S", 10) and same(o3, "S", b3, "S", 10)
    assert not is_ll1(a3, "S") and is_ll1(b3, "S")

    # 문제 4: B → B or C | C, C → C and D | D, D → not D | id | id ( )
    o4 = G("B -> B or C | C\nC -> C and D | D\nD -> not D | id | id ( )")
    b4 = G("""B -> C B'
B' -> or C B' | ε
C -> D C'
C' -> and D C' | ε
D -> not D | id D'
D' -> ( ) | ε""")
    assert same(o4, "B", b4, "B", 8)
    assert not is_ll1(o4, "B") and is_ll1(b4, "B")
    # 순서를 바꿔 좌인수분해만 먼저 하면 좌재귀가 남아 여전히 LL(1)이 아니다
    half = G("B -> B or C | C\nC -> C and D | D\nD -> not D | id D'\nD' -> ( ) | ε")
    assert not is_ll1(half, "B")

    print("ALL CHECKS PASSED")
```
{% endraw %}
