---
layout: "note"
title: "20_ll1-table-ladder_p4.py"
display_title: "20_ll1-table-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "20"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/ll1-table-ladder/"
parent_title: "LL(1) 파싱 표 예제 사다리"
description: "컴파일러 · LL(1) 파싱 표 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/compilers/code/20_ll1-table-ladder_p4/"
---
{% raw %}
[LL(1) 파싱 표 예제 사다리](/Hongs_Blog/studies/compilers/ll1-table-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""LL(1) 파싱 표 예제 사다리의 답을 확인한다.

실행: python3 20_ll1-table-ladder_p4.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def tab(text, start):
    t = ll1_table(G(text), start)
    return {k: [" ".join(p) or EPS for p in v] for k, v in t.items()}


if __name__ == "__main__":
    e = EPS
    # 문제 1
    assert tab("S -> ( L ) | a\nL -> S L'\nL' -> , S L' | ε", "S") == {
        ("S", "("): ["( L )"], ("S", "a"): ["a"],
        ("L", "("): ["S L'"], ("L", "a"): ["S L'"],
        ("L'", ","): [", S L'"], ("L'", ")"): [e]}

    # 문제 2
    assert tab("S -> A B\nA -> a A | ε\nB -> b B | c", "S") == {
        ("S", "a"): ["A B"], ("S", "b"): ["A B"], ("S", "c"): ["A B"],
        ("A", "a"): ["a A"], ("A", "b"): [e], ("A", "c"): [e],
        ("B", "b"): ["b B"], ("B", "c"): ["c"]}

    # 문제 3
    assert tab("S -> a B D h\nB -> c C\nC -> b C | ε\nD -> E F\nE -> g | ε\nF -> f | ε", "S") == {
        ("S", "a"): ["a B D h"], ("B", "c"): ["c C"],
        ("C", "b"): ["b C"], ("C", "g"): [e], ("C", "f"): [e], ("C", "h"): [e],
        ("D", "g"): ["E F"], ("D", "f"): ["E F"], ("D", "h"): ["E F"],
        ("E", "g"): ["g"], ("E", "f"): [e], ("E", "h"): [e],
        ("F", "f"): ["f"], ("F", "h"): [e]}

    # 문제 4: 매달린 else. [S', e] 칸에 규칙이 둘 들어간다
    t4 = tab("S -> i E t S S' | a\nS' -> e S | ε\nE -> b", "S")
    assert t4 == {("S", "i"): ["i E t S S'"], ("S", "a"): ["a"],
                  ("S'", "e"): ["e S", e], ("S'", END): [e], ("E", "b"): ["b"]}
    g4 = G("S -> i E t S S' | a\nS' -> e S | ε\nE -> b")
    first = first_sets(g4)
    assert first == {"S": {"i", "a"}, "S'": {"e", e}, "E": {"b"}}
    assert follow_sets(g4, "S", first) == {"S": {END, "e"}, "S'": {END, "e"}, "E": {"t"}}

    print("ALL CHECKS PASSED")
```
{% endraw %}
