---
layout: "note"
title: "19_follow-set_impl.py"
display_title: "19_follow-set_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "19"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/follow-set/"
parent_title: "FOLLOW 집합"
description: "컴파일러 · FOLLOW 집합 구현 코드"
permalink: "/studies/compilers/code/19_follow-set_impl/"
---
{% raw %}
[FOLLOW 집합](/Hongs_Blog/studies/compilers/follow-set/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""FOLLOW 집합을 구하고 슬라이드 값을 재현한다. 문장 형식을 모두 만들어 구한 값과도 견준다.

실행: python3 19_follow-set_impl.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def follow_by_definition(g, start, maxlen):
    """정의 그대로: 시작 기호에서 나오는 문장 형식(길이 maxlen 이하)을 모두 만들고,
    각 비단말 바로 오른쪽에 올 수 있는 단말을 모은다. 오른쪽이 모두 사라질 수 있으면 $를 넣는다."""
    langs = {A: language(g, A, maxlen) for A in g}

    def heads(beta):
        out, nullable = set(), True
        for s in beta:
            if s not in g:
                out.add(s)
                nullable = False
                break
            out |= {w[0] for w in langs[s] if w}
            if () not in langs[s]:
                nullable = False
                break
        return out | ({END} if nullable else set())

    seen, todo = {(start,)}, [(start,)]
    follow = {A: set() for A in g}
    while todo:
        form = todo.pop()
        for i, s in enumerate(form):
            if s in g:
                follow[s] |= heads(form[i + 1:])
                for p in g[s]:
                    new = form[:i] + p + form[i + 1:]
                    if len(new) <= maxlen and new not in seen:
                        seen.add(new)
                        todo.append(new)
    return follow


def follow_rounds(g, start, first):
    """한 바퀴 돌 때마다의 FOLLOW를 기록한다."""
    follow = {A: set() for A in g}
    follow[start].add(END)
    snaps = []
    changed = True
    while changed:
        changed = False
        for B, prods in g.items():
            for p in prods:
                for i, A in enumerate(p):
                    if A not in g:
                        continue
                    fb = first_of(p[i + 1:], first, g)
                    add = (fb - {EPS}) | (follow[B] if EPS in fb else set())
                    if not add <= follow[A]:
                        follow[A] |= add
                        changed = True
        snaps.append({A: set(v) for A, v in follow.items()})
    return snaps


if __name__ == "__main__":
    import random

    # p.29: E → TE', E' → +E | ε, T → FT', T' → *T | ε, F → (E) | id
    g = G("E -> T E'\nE' -> + E | ε\nT -> F T'\nT' -> * T | ε\nF -> ( E ) | id")
    first = first_sets(g)
    follow = follow_sets(g, "E", first)
    assert follow == {"E": {END, ")"}, "E'": {END, ")"}, "T": {"+", END, ")"},
                      "T'": {"+", END, ")"}, "F": {"*", "+", END, ")"}}
    assert follow == follow_by_definition(g, "E", 7)
    # FOLLOW에는 ε이 들어가지 않는다
    assert all(EPS not in s for s in follow.values())

    # p.18: S → aA | b | A, A → (S)
    g2 = G("S -> a A | b | A\nA -> ( S )")
    assert follow_sets(g2, "S", first_sets(g2)) == {"S": {END, ")"}, "A": {END, ")"}}

    # 본문 예: S → A B c, A → a | ε, B → b | ε
    g3 = G("S -> A B c\nA -> a | ε\nB -> b | ε")
    f3 = follow_sets(g3, "S", first_sets(g3))
    assert f3 == {"S": {END}, "A": {"b", "c"}, "B": {"c"}}

    # 셋째 규칙을 빼먹으면 틀린다: p.29에서 Follow(T)의 $ 와 ) 는 Follow(E)에서 넘어온 것이다
    assert first_of(("E'",), first, g) - {EPS} == {"+"} and follow["T"] - {"+"} == follow["E"]

    # 무작위 문법 100개(규칙 오른쪽 길이 2 이하): 되풀이로 구한 값 = 정의대로 구한 값
    rng = random.Random(11)
    checked = 0
    while checked < 100:
        nts = ["S", "A", "B"]
        rg = {}
        for A in nts:
            prods = set()
            for _ in range(rng.randint(1, 3)):
                prods.add(tuple(rng.choice(nts + ["a", "b", "c"]) for _ in range(rng.randint(0, 2))))
            rg[A] = sorted(prods)
        if any(not language(rg, A, 3) for A in nts):       # 짧은 문자열을 못 만드는 비단말이 있으면 건너뛴다
            continue
        reach, todo = {"S"}, ["S"]
        while todo:
            for p in rg[todo.pop()]:
                for s in p:
                    if s in rg and s not in reach:
                        reach.add(s)
                        todo.append(s)
        if reach != set(nts):                             # 시작 기호에서 닿지 않는 비단말이 있으면 건너뛴다
            continue
        fo = follow_sets(rg, "S", first_sets(rg))
        assert fo == follow_by_definition(rg, "S", 6), rg
        checked += 1

    # 카드: S → A b | c, A → a A | ε  /  S → a S b | ε  /  S → A B, A → a | ε, B → b | ε
    c1 = G("S -> A b | c\nA -> a A | ε")
    assert follow_sets(c1, "S", first_sets(c1)) == {"S": {END}, "A": {"b"}}
    c2 = G("S -> a S b | ε")
    assert follow_sets(c2, "S", first_sets(c2)) == {"S": {END, "b"}}
    c3 = G("S -> A B\nA -> a | ε\nB -> b | ε")
    assert follow_sets(c3, "S", first_sets(c3)) == {"S": {END}, "A": {"b", END}, "B": {END}}

    # 본문의 추적 표: 세 바퀴째에 바뀌는 것이 없다
    r = follow_rounds(g, "E", first)
    assert len(r) == 3 and r[1] == r[2] == follow
    assert r[0] == {"E": {END, ")"}, "E'": {END}, "T": {END, "+"}, "T'": {END, "+"}, "F": {END, "*", "+"}}

    # 카드 C5: 셋째 규칙(뒤가 비면 부모의 FOLLOW를 물려받는다)을 쓰지 않으면
    no3 = {A: set() for A in g}
    no3["E"].add(END)
    for B, prods in g.items():
        for p in prods:
            for i, A in enumerate(p):
                if A in g:
                    no3[A] |= first_of(p[i + 1:], first, g) - {EPS}
    assert no3 == {"E": {END, ")"}, "E'": set(), "T": {"+"}, "T'": set(), "F": {"*"}}

    print("ALL CHECKS PASSED")
```
{% endraw %}
