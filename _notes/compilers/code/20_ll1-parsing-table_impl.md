---
layout: "note"
title: "20_ll1-parsing-table_impl.py"
display_title: "20_ll1-parsing-table_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "20"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/ll1-parsing-table/"
parent_title: "LL(1) 파싱 표"
description: "컴파일러 · LL(1) 파싱 표 구현 코드"
permalink: "/studies/compilers/code/20_ll1-parsing-table_impl/"
---
{% raw %}
[LL(1) 파싱 표](/Hongs_Blog/studies/compilers/ll1-parsing-table/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""LL(1) 파싱 표를 만들고 슬라이드의 표를 재현한다. LL(1)이 아닌 문법에서 충돌이 나는 칸도 확인한다.

실행: python3 20_ll1-parsing-table_impl.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def cells(table):
    return {k: [" ".join(p) or EPS for p in v] for k, v in table.items()}


if __name__ == "__main__":
    # p.20, 31~32: E → TE', E' → +E | ε, T → FT', T' → *T | ε, F → (E) | id
    g = G("E -> T E'\nE' -> + E | ε\nT -> F T'\nT' -> * T | ε\nF -> ( E ) | id")
    table = ll1_table(g, "E")
    assert cells(table) == {
        ("E", "("): ["T E'"], ("E", "id"): ["T E'"],
        ("E'", "+"): ["+ E"], ("E'", ")"): [EPS], ("E'", END): [EPS],
        ("T", "("): ["F T'"], ("T", "id"): ["F T'"],
        ("T'", "+"): [EPS], ("T'", "*"): ["* T"], ("T'", ")"): [EPS], ("T'", END): [EPS],
        ("F", "("): ["( E )"], ("F", "id"): ["id"],
    }
    assert conflicts(table) == {}
    # 30칸 가운데 13칸만 차 있다. 나머지 17칸은 문법 오류다.
    assert len(table) == 13 and 5 * 6 - len(table) == 17

    # p.31: FIRST만으로 채우는 칸은 8개, p.32: ε 규칙을 FOLLOW로 채우는 칸은 5개
    first = first_sets(g)
    by_first = sum(len(first_of(p, first, g) - {EPS}) for ps in g.values() for p in ps)
    assert by_first == 8 and len(table) - by_first == 5

    # p.18: S → aA | b | A, A → (S)
    g2 = G("S -> a A | b | A\nA -> ( S )")
    assert cells(ll1_table(g2, "S")) == {("S", "a"): ["a A"], ("S", "b"): ["b"], ("S", "("): ["A"],
                                         ("A", "("): ["( S )"]}

    # 좌인수분해를 안 한 문법: 같은 칸에 규칙이 둘 들어간다
    g3 = G("E -> T + E | T\nT -> F * T | F\nF -> ( E ) | id")
    assert set(conflicts(ll1_table(g3, "E"))) == {("E", "("), ("E", "id"), ("T", "("), ("T", "id")}

    # 좌재귀 문법: S → Sa | b
    g4 = G("S -> S a | b")
    assert cells(conflicts(ll1_table(g4, "S"))) == {("S", "b"): ["S a", "b"]}

    # 모호한 문법(매달린 else)은 좌인수분해를 해도 충돌이 남는다
    g5 = G("S -> i E t S S' | a\nS' -> e S | ε\nE -> b")
    assert cells(conflicts(ll1_table(g5, "S"))) == {("S'", "e"): ["e S", EPS]}

    # ε 규칙을 FIRST 칸에만 넣고 FOLLOW를 안 쓰면 E'와 T'의 ε 칸 5개가 비어 id $ 조차 못 읽는다
    only_first = {}
    for A, ps in g.items():
        for p in ps:
            for x in first_of(p, first, g) - {EPS}:
                only_first[(A, x)] = [p]
    assert ("T'", END) not in only_first and ("E'", END) not in only_first

    # 카드: S → a S b | ε 의 표, S → a A a | ε, A → a b S | ε 의 충돌
    assert cells(ll1_table(G("S -> a S b | ε"), "S")) == {("S", "a"): ["a S b"], ("S", "b"): [EPS], ("S", END): [EPS]}
    bad = cells(conflicts(ll1_table(G("S -> a A a | ε\nA -> a b S | ε"), "S")))
    assert bad == {("S", "a"): ["a A a", EPS], ("A", "a"): ["a b S", EPS]}
    # FIRST끼리 겹치지 않아도 FIRST와 FOLLOW가 겹치면 충돌한다
    assert cells(ll1_table(G("S -> A b | c\nA -> a A | ε"), "S")) == {
        ("S", "a"): ["A b"], ("S", "b"): ["A b"], ("S", "c"): ["c"], ("A", "a"): ["a A"], ("A", "b"): [EPS]}

    print("ALL CHECKS PASSED")
```
{% endraw %}
