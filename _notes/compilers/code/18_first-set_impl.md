---
layout: "note"
title: "18_first-set_impl.py"
display_title: "18_first-set_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "18"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/first-set/"
parent_title: "FIRST 집합"
description: "컴파일러 · FIRST 집합 구현 코드"
permalink: "/studies/compilers/code/18_first-set_impl/"
---
{% raw %}
[FIRST 집합](/Hongs_Blog/studies/compilers/first-set/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""FIRST 집합을 구하고 슬라이드 값을 재현한다. 정의대로 문자열을 모두 만들어 구한 값과도 견준다.

실행: python3 18_first-set_impl.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def first_by_definition(g, maxlen):
    """정의 그대로: A가 만드는 문자열(길이 maxlen 이하)의 첫 글자를 모은다. 빈 문자열을 만들면 ε도 넣는다."""
    out = {}
    for A in g:
        L = language(g, A, maxlen)
        out[A] = {s[0] for s in L if s} | ({EPS} if () in L else set())
    return out


def first_rounds(g):
    """한 바퀴(모든 규칙을 적힌 순서로 한 번씩) 돌 때마다의 FIRST를 기록한다."""
    first = {A: set() for A in g}
    snaps = []
    changed = True
    while changed:
        changed = False
        for A, prods in g.items():
            for p in prods:
                f = first_of(p, first, g)
                if not f <= first[A]:
                    first[A] |= f
                    changed = True
        snaps.append({A: set(v) for A, v in first.items()})
    return snaps


if __name__ == "__main__":
    import random

    # p.27: E → TE', E' → +E | ε, T → FT', T' → *T | ε, F → (E) | id
    g = G("E -> T E'\nE' -> + E | ε\nT -> F T'\nT' -> * T | ε\nF -> ( E ) | id")
    first = first_sets(g)
    assert first == {"F": {"(", "id"}, "T'": {"*", EPS}, "T": {"(", "id"},
                     "E'": {"+", EPS}, "E": {"(", "id"}}
    assert first == first_by_definition(g, 6)

    # p.31: 규칙 오른쪽 기호열의 FIRST
    S = lambda s: tuple(s.split())
    assert first_of(S("T E'"), first, g) == {"(", "id"}
    assert first_of(S("+ E"), first, g) == {"+"}
    assert first_of(S("F T'"), first, g) == {"(", "id"}
    assert first_of(S("* T"), first, g) == {"*"}
    assert first_of(S("( E )"), first, g) == {"("}
    assert first_of((), first, g) == {EPS}                      # p.32: First(ε) = {ε}
    # 앞 기호가 빈 문자열이 될 수 있으면 다음 기호까지 본다
    assert first_of(S("T' E'"), first, g) == {"*", "+", EPS}
    assert first_of(S("T' E' )"), first, g) == {"*", "+", ")"}
    assert first_of(S("E' T"), first, g) == {"+", "(", "id"}

    # p.18: S → aA | b | A, A → (S)
    g2 = G("S -> a A | b | A\nA -> ( S )")
    assert first_sets(g2) == {"S": {"a", "b", "("}, "A": {"("}}

    # 본문 예: S → A B c, A → a | ε, B → b | ε
    g3 = G("S -> A B c\nA -> a | ε\nB -> b | ε")
    f3 = first_sets(g3)
    assert f3 == {"S": {"a", "b", "c"}, "A": {"a", EPS}, "B": {"b", EPS}}
    # ε을 빼지 않고 합치면 틀린다: S는 반드시 c로 끝나므로 빈 문자열을 못 만든다
    assert EPS not in f3["S"] and () not in language(g3, "S", 3)

    # 카드: S → A B, A → a | ε, B → b | ε 는 S도 ε을 가진다
    g4 = G("S -> A B\nA -> a | ε\nB -> b | ε")
    assert first_sets(g4)["S"] == {"a", "b", EPS}

    # 무작위 문법 300개: 되풀이로 구한 값 = 정의대로 구한 값
    rng = random.Random(7)
    checked = 0
    while checked < 300:
        nts = ["S", "A", "B"]
        rg = {}
        for A in nts:
            prods = set()
            for _ in range(rng.randint(1, 3)):
                prods.add(tuple(rng.choice(nts + ["a", "b", "c"]) for _ in range(rng.randint(0, 3))))
            rg[A] = sorted(prods)
        if any(not language(rg, A, 4) for A in nts):      # 문자열을 하나도 못 만드는 비단말이 있으면 건너뛴다
            continue
        assert first_sets(rg) == first_by_definition(rg, 7), rg
        checked += 1

    # 카드: S → A b | c, A → a A | ε
    assert first_sets(G("S -> A b | c\nA -> a A | ε")) == {"S": {"a", "b", "c"}, "A": {"a", EPS}}

    # 본문의 추적 표: 규칙을 적힌 순서(E, E', T, T', F)로 돌면 네 바퀴째에 바뀌는 것이 없다
    r = first_rounds(g)
    assert len(r) == 4 and r[2] == r[3] == first
    assert r[0] == {"E": set(), "E'": {"+", EPS}, "T": set(), "T'": {"*", EPS}, "F": {"(", "id"}}
    assert r[1] == {"E": set(), "E'": {"+", EPS}, "T": {"(", "id"}, "T'": {"*", EPS}, "F": {"(", "id"}}

    print("ALL CHECKS PASSED")
```
{% endraw %}
