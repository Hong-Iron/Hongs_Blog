---
layout: "note"
title: "17_recursive-descent-parsing_impl.py"
display_title: "17_recursive-descent-parsing_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "17"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/recursive-descent-parsing/"
parent_title: "재귀 하강 파싱"
description: "컴파일러 · 재귀 하강 파싱 구현 코드"
permalink: "/studies/compilers/code/17_recursive-descent-parsing_impl/"
---
{% raw %}
[재귀 하강 파싱](/Hongs_Blog/studies/compilers/recursive-descent-parsing/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""재귀 하강 파싱(되돌아가기 있음)을 구현하고 슬라이드의 cad 추적과 id + id 연습을 재현한다.

실행: python3 17_recursive-descent-parsing_impl.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


import sys


def rd_parse(g, start, tokens):
    """되돌아가기가 있는 재귀 하강 파싱. (받아들였는가, 기록)을 돌려준다.
    기록의 한 줄: ("try", 비단말, 규칙, 위치) / ("match", 단말, 위치) / ("mismatch", 단말, 입력, 위치)"""
    tokens = list(tokens)
    log = []

    def sym(s, pos):
        if s not in g:
            if pos < len(tokens) and tokens[pos] == s:
                log.append(("match", s, pos))
                yield pos + 1
            else:
                log.append(("mismatch", s, tokens[pos] if pos < len(tokens) else "끝", pos))
            return
        for p in g[s]:                      # 규칙을 적힌 순서대로 시험한다
            log.append(("try", s, " ".join(p) or "ε", pos))
            yield from seq(p, pos)          # 실패하면 여기로 돌아와 다음 규칙으로 간다

    def seq(p, pos):
        if not p:
            yield pos
            return
        for mid in sym(p[0], pos):
            yield from seq(p[1:], mid)

    for end in sym(start, 0):
        if end == len(tokens):
            return True, log
        log.append(("mismatch", "끝", tokens[end], end))
    return False, log


def tries(log):
    return [(e[1], e[2]) for e in log if e[0] == "try"]


if __name__ == "__main__":
    # p.8~15: S → dAc | cAe | cAd, A → a, 입력 cad
    g = G("S -> d A c | c A e | c A d\nA -> a")
    ok, log = rd_parse(g, "S", "c a d".split())
    assert ok
    assert log == [
        ("try", "S", "d A c", 0), ("mismatch", "d", "c", 0),          # p.9~10
        ("try", "S", "c A e", 0), ("match", "c", 0),                  # p.11
        ("try", "A", "a", 1), ("match", "a", 1),                      # p.12
        ("mismatch", "e", "d", 2),                                    # p.13
        ("try", "S", "c A d", 0), ("match", "c", 0),                  # p.14
        ("try", "A", "a", 1), ("match", "a", 1), ("match", "d", 2),   # p.15
    ]
    assert rd_parse(g, "S", "c a".split())[0] is False
    assert rd_parse(g, "S", "c a d d".split())[0] is False

    # p.16의 연습: E → T + E | T, T → F * T | F, F → (E) | id, 입력 id + id
    e = G("E -> T + E | T\nT -> F * T | F\nF -> ( E ) | id")
    ok, log = rd_parse(e, "E", "id + id".split())
    assert ok
    assert tries(log) == [
        ("E", "T + E"), ("T", "F * T"), ("F", "( E )"), ("F", "id"),
        ("T", "F"), ("F", "( E )"), ("F", "id"),
        ("E", "T + E"), ("T", "F * T"), ("F", "( E )"), ("F", "id"),
        ("T", "F"), ("F", "( E )"), ("F", "id"),
        ("E", "T"), ("T", "F * T"), ("F", "( E )"), ("F", "id"),
        ("T", "F"), ("F", "( E )"), ("F", "id"),
    ]
    # 같은 id를 여러 번 다시 읽는다: 첫 id 2번, 둘째 id 4번
    matches = [x[2] for x in log if x[0] == "match" and x[1] == "id"]
    assert matches.count(0) == 2 and matches.count(2) == 4

    # 길이 6 이하의 모든 입력에서 문법의 언어와 같은 답을 낸다
    from itertools import product
    L = language(e, "E", 6)
    for n in range(7):
        for s in product(["+", "*", "(", ")", "id"], repeat=n):
            assert rd_parse(e, "E", s)[0] == (s in L)

    # 되돌아가기의 값: 괄호를 d겹 두른 ((…id…))에서 시험한 규칙 수가 한 겹마다 4배 넘게 는다
    nest = lambda d: ["("] * d + ["id"] + [")"] * d
    counts = [len(tries(rd_parse(e, "E", nest(d))[1])) for d in range(7)]
    assert counts == [14, 69, 292, 1187, 4770, 19105, 76448]
    assert all(counts[i + 1] > 4 * counts[i] for i in range(6))

    # 좌인수분해한 문법에서는 같은 입력에서 한 겹마다 7번씩만 는다
    f = G("E -> T E'\nE' -> + E | ε\nT -> F T'\nT' -> * T | ε\nF -> ( E ) | id")
    counts2 = [len(tries(rd_parse(f, "E", nest(d))[1])) for d in range(7)]
    assert counts2 == [7 * d + 8 for d in range(7)]
    for n in range(6):
        for s in product(["+", "*", "(", ")", "id"], repeat=n):
            assert rd_parse(f, "E", s)[0] == (s in L)

    # p.17, 4회 p.42: 좌재귀 문법에서는 입력을 읽지 못한 채 자기 자신을 끝없이 부른다
    sys.setrecursionlimit(500)
    try:
        rd_parse(G("S -> S a | b"), "S", "b a".split())
        raise AssertionError("끝났다")
    except RecursionError:
        pass

    # 카드 C1: S → aBc | aBd, B → b, 입력 abd
    ok, log = rd_parse(G("S -> a B c | a B d\nB -> b"), "S", "a b d".split())
    assert ok and tries(log) == [("S", "a B c"), ("B", "b"), ("S", "a B d"), ("B", "b")]

    print("ALL CHECKS PASSED")
```
{% endraw %}
