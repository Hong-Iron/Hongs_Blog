---
layout: "note"
title: "19_first-follow-ladder_p4.py"
display_title: "19_first-follow-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "19"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/first-follow-ladder/"
parent_title: "FIRST·FOLLOW 예제 사다리"
description: "컴파일러 · FIRST·FOLLOW 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/compilers/code/19_first-follow-ladder_p4/"
---
{% raw %}
[FIRST·FOLLOW 예제 사다리](/Hongs_Blog/studies/compilers/first-follow-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""FIRST·FOLLOW 예제 사다리의 답을 확인한다.

실행: python3 19_first-follow-ladder_p4.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def ff(text, start):
    g = G(text)
    first = first_sets(g)
    return first, follow_sets(g, start, first)


if __name__ == "__main__":
    e = EPS
    # 문제 1
    first, follow = ff("S -> ( L ) | a\nL -> S L'\nL' -> , S L' | ε", "S")
    assert first == {"S": {"(", "a"}, "L": {"(", "a"}, "L'": {",", e}}
    assert follow == {"S": {END, ",", ")"}, "L": {")"}, "L'": {")"}}

    # 문제 2
    first, follow = ff("S -> A B\nA -> a A | ε\nB -> b B | c", "S")
    assert first == {"S": {"a", "b", "c"}, "A": {"a", e}, "B": {"b", "c"}}
    assert follow == {"S": {END}, "A": {"b", "c"}, "B": {END}}

    # 문제 3
    first, follow = ff("S -> a B D h\nB -> c C\nC -> b C | ε\nD -> E F\nE -> g | ε\nF -> f | ε", "S")
    assert first == {"S": {"a"}, "B": {"c"}, "C": {"b", e}, "D": {"g", "f", e}, "E": {"g", e}, "F": {"f", e}}
    assert follow == {"S": {END}, "B": {"g", "f", "h"}, "C": {"g", "f", "h"}, "D": {"h"},
                      "E": {"f", "h"}, "F": {"h"}}

    # 문제 4
    first, follow = ff("S -> A B | c S d\nA -> a A | ε\nB -> b | ε", "S")
    assert first == {"S": {"a", "b", "c", e}, "A": {"a", e}, "B": {"b", e}}
    assert follow == {"S": {END, "d"}, "A": {"b", END, "d"}, "B": {END, "d"}}

    print("ALL CHECKS PASSED")
```
{% endraw %}
