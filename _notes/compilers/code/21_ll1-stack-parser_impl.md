---
layout: "note"
title: "21_ll1-stack-parser_impl.py"
display_title: "21_ll1-stack-parser_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "21"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/ll1-stack-parser/"
parent_title: "LL(1) 파서의 스택 동작"
description: "컴파일러 · LL(1) 파서의 스택 동작 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/21_ll1-stack-parser_impl/"
---
{% raw %}
[LL(1) 파서의 스택 동작](/Hongs_Blog/studies/compilers/ll1-stack-parser/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""스택으로 도는 LL(1) 파서를 구현하고 슬라이드의 id * id 추적을 재현한다. 길이 6 이하 모든 입력에서 문법의 언어와 견준다.

실행: python3 21_ll1-stack-parser_impl.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def ll1_parse(g, start, table, tokens):
    """스택으로 LL(1) 파싱을 한다. (받아들였는가, 추적 표)를 돌려준다.
    추적 표의 한 줄 = (꺼내기 전 스택(맨 위가 왼쪽), 남은 입력, 한 일)."""
    inp = list(tokens) + [END]
    pos = 0
    stack = [END, start]          # 리스트의 끝이 스택의 맨 위
    rows = []
    while stack:
        before = " ".join(reversed(stack))
        rest = " ".join(inp[pos:])
        top = stack.pop()
        a = inp[pos]
        if top in g:
            cell = table.get((top, a))
            if not cell:
                rows.append((before, rest, "오류: 표[%s, %s]가 빈칸" % (top, a)))
                return False, rows
            p = cell[0]
            stack.extend(reversed(p))
            rows.append((before, rest, "%s → %s" % (top, " ".join(p) or EPS)))
        elif top == a:
            if top == END:
                rows.append((before, rest, "받아들임"))
                return True, rows
            pos += 1
            rows.append((before, rest, "%s 맞음, 입력 한 칸 전진" % top))
        else:
            rows.append((before, rest, "오류: %s ≠ %s" % (top, a)))
            return False, rows
    return False, rows


def leftmost_from_rows(rows, start, g):
    """추적 표에 적힌 규칙들을 차례로 적용해 좌측 유도를 다시 만든다."""
    form = [start]
    steps = [start]
    for _, _, act in rows:
        if "→" in act:
            head, body = [x.strip() for x in act.split("→")]
            i = next(k for k, s in enumerate(form) if s in g)
            assert form[i] == head
            form[i:i + 1] = [] if body == EPS else body.split()
            steps.append(" ".join(form))
    return steps


if __name__ == "__main__":
    from itertools import product

    g = G("E -> T E'\nE' -> + E | ε\nT -> F T'\nT' -> * T | ε\nF -> ( E ) | id")
    table = ll1_table(g, "E")
    assert conflicts(table) == {}

    # p.33~45: 입력 id * id $
    ok, rows = ll1_parse(g, "E", table, "id * id".split())
    assert ok
    assert rows == [
        ("E $", "id * id $", "E → T E'"),                       # p.33 → p.34
        ("T E' $", "id * id $", "T → F T'"),                    # p.35
        ("F T' E' $", "id * id $", "F → id"),                   # p.36
        ("id T' E' $", "id * id $", "id 맞음, 입력 한 칸 전진"),   # p.37
        ("T' E' $", "* id $", "T' → * T"),                      # p.38
        ("* T E' $", "* id $", "* 맞음, 입력 한 칸 전진"),         # p.39
        ("T E' $", "id $", "T → F T'"),                         # p.40
        ("F T' E' $", "id $", "F → id"),                        # p.41
        ("id T' E' $", "id $", "id 맞음, 입력 한 칸 전진"),        # p.42
        ("T' E' $", "$", "T' → ε"),                             # p.43
        ("E' $", "$", "E' → ε"),                                # p.44
        ("$", "$", "받아들임"),                                  # p.45
    ]
    # 적용한 규칙을 이으면 좌측 유도다
    assert leftmost_from_rows(rows, "E", g) == [
        "E", "T E'", "F T' E'", "id T' E'", "id * T E'", "id * F T' E'", "id * id T' E'", "id * id E'", "id * id"]

    # p.21~24: 입력 ( id ) $ 의 좌측 유도
    ok, rows2 = ll1_parse(g, "E", table, "( id )".split())
    assert ok
    assert leftmost_from_rows(rows2, "E", g) == [
        "E", "T E'", "F T' E'", "( E ) T' E'", "( T E' ) T' E'", "( F T' E' ) T' E'",
        "( id T' E' ) T' E'", "( id E' ) T' E'", "( id ) T' E'", "( id ) E'", "( id )"]

    # 오류: 빈칸을 만나면 멈춘다
    ok, rows3 = ll1_parse(g, "E", table, "id +".split())
    assert not ok and rows3[-1][2] == "오류: 표[E, $]가 빈칸"
    ok, rows4 = ll1_parse(g, "E", table, "id id".split())
    assert not ok and rows4[-1][2] == "오류: 표[T', id]가 빈칸"
    ok, rows5 = ll1_parse(g, "E", table, "( id".split())
    assert not ok and rows5[-1][2] == "오류: ) ≠ $"

    # 길이 6 이하의 모든 입력(19,531개)에서 문법의 언어와 같은 답을 내고, 걸음 수는 입력 길이에 비례한다
    L = language(g, "E", 6)
    total = 0
    for n in range(7):
        for s in product(["+", "*", "(", ")", "id"], repeat=n):
            ok, rows = ll1_parse(g, "E", table, s)
            assert ok == (s in L)
            if ok:
                assert len(rows) <= 7 * len(s) + 5
            total += 1
    assert total == 19531 and len(L) == 15

    # 되돌아가기가 없다: 입력 포인터는 한 번도 뒤로 가지 않는다(남은 입력이 줄기만 한다)
    ok, rows = ll1_parse(g, "E", table, "( id + id ) * id".split())
    lens = [len(r[1].split()) for r in rows]
    assert ok and lens == sorted(lens, reverse=True)

    # 카드: id + id 의 추적(14줄)과 S → a S b | ε 에서 a a b b 의 추적(8줄)
    ok, r = ll1_parse(g, "E", table, "id + id".split())
    assert ok and len(r) == 14 and r[4] == ("T' E' $", "+ id $", "T' → ε") and r[5] == ("E' $", "+ id $", "E' → + E")
    ok, r = ll1_parse(g, "E", table, "id * + id".split())
    assert not ok and r[-1] == ("T E' $", "+ id $", "오류: 표[T, +]가 빈칸")
    c = G("S -> a S b | ε")
    ok, r = ll1_parse(c, "S", ll1_table(c, "S"), "a a b b".split())
    assert ok and [x[0] for x in r] == ["S $", "a S b $", "S b $", "a S b b $", "S b b $", "b b $", "b $", "$"]

    # 본문의 오류 표: 멈추는 걸음과 그때의 스택
    assert len(rows3) == 8 and rows3[-1][:2] == ("E $", "$")
    assert len(rows4) == 5 and rows4[-1][:2] == ("T' E' $", "id $")
    assert len(rows5) == 11 and rows5[-1][:2] == (") T' E' $", "$")
    ok, r = ll1_parse(g, "E", table, "id * + id".split())
    assert len(r) == 7
    ok, r = ll1_parse(g, "E", table, [])
    assert not ok and r == [("E $", "$", "오류: 표[E, $]가 빈칸")]

    print("ALL CHECKS PASSED")
```
{% endraw %}
