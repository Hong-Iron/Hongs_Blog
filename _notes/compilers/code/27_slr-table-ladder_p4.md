---
layout: "note"
title: "27_slr-table-ladder_p4.py"
display_title: "27_slr-table-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "27"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/slr-table-ladder/"
parent_title: "SLR 파싱 표 예제 사다리"
description: "컴파일러 · SLR 파싱 표 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/compilers/code/27_slr-table-ladder_p4/"
---
{% raw %}
[SLR 파싱 표 예제 사다리](/Hongs_Blog/studies/compilers/slr-table-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 문제 코드: SLR 파싱 표 예제 사다리의 문제 1~4. 네 문법의 상태, FOLLOW, 표를 확인한다.
# 실행: python3 27_slr-table-ladder_p4.py
# 표준 라이브러리만 쓴다. 다른 파일을 불러오지 않으려고 공통 도구를 이 파일 안에 그대로 넣었다.
# 상태 번호는 슬라이드처럼 1부터 센다. 규칙 번호는 코드에서 0부터(S' -> S가 0)이고, 슬라이드는 1부터다.

# ---------- 공통 도구: 문법, LR(0) 항목 집합, FOLLOW, SLR 표, 스택 파서 ----------
# 문법은 (왼쪽, 오른쪽 튜플)의 목록이다. 0번은 덧붙인 규칙 S' -> S.
# 상태 번호는 1부터 센다(슬라이드와 같다). 파이썬 리스트 인덱스는 0부터다.

def nonterminals(prods):
    return [a for a in dict.fromkeys(l for l, _ in prods)]


def terminals(prods):
    nts = set(nonterminals(prods))
    out = []
    for _, r in prods:
        for x in r:
            if x not in nts and x not in out:
                out.append(x)
    return out


def closure(items, prods):
    """항목 (규칙 번호, 점 위치)의 집합에, 점 바로 뒤 논터미널의 규칙을 점을 맨 앞에 두고 더한다."""
    nts = set(nonterminals(prods))
    out = set(items)
    work = list(items)
    while work:
        p, d = work.pop()
        rhs = prods[p][1]
        if d < len(rhs) and rhs[d] in nts:
            for q, (l, _) in enumerate(prods):
                if l == rhs[d] and (q, 0) not in out:
                    out.add((q, 0))
                    work.append((q, 0))
    return frozenset(out)


def goto(state, x, prods):
    """점 뒤가 x인 항목들의 점을 한 칸 옮기고 closure를 취한다."""
    moved = {(p, d + 1) for p, d in state if d < len(prods[p][1]) and prods[p][1][d] == x}
    return closure(moved, prods) if moved else None


def canonical(prods, order):
    """항목 DFA를 만든다. order는 기호를 살피는 순서(상태 번호가 이 순서로 정해진다)."""
    start = closure({(0, 0)}, prods)
    states = [start]
    trans = {}
    i = 0
    while i < len(states):
        for x in order:
            t = goto(states[i], x, prods)
            if t is None:
                continue
            if t not in states:
                states.append(t)
            trans[(i + 1, x)] = states.index(t) + 1
        i += 1
    return states, trans


def first_follow(prods):
    nts = nonterminals(prods)
    first = {a: set() for a in nts}
    nullable = set()
    changed = True
    while changed:
        changed = False
        for l, r in prods:
            allnull = True
            for x in r:
                add = first[x] if x in first else {x}
                if not add <= first[l]:
                    first[l] |= add
                    changed = True
                if x not in nullable:
                    allnull = False
                    break
            if allnull and l not in nullable:
                nullable.add(l)
                changed = True
    follow = {a: set() for a in nts}
    follow[prods[0][0]].add("$")
    changed = True
    while changed:
        changed = False
        for l, r in prods:
            for i, x in enumerate(r):
                if x not in follow:
                    continue
                add = set()
                rest_null = True
                for y in r[i + 1:]:
                    add |= first[y] if y in first else {y}
                    if y not in nullable:
                        rest_null = False
                        break
                if rest_null:
                    add |= follow[l]
                if not add <= follow[x]:
                    follow[x] |= add
                    changed = True
    return first, follow, nullable


def slr_table(prods, order, use_follow=True):
    """ACTION[(상태, 터미널)] = {"S6", "R3", ...}의 집합, GOTO[(상태, 논터미널)] = 상태.
    use_follow=False면 LR(0)처럼 점이 끝난 항목이 있는 상태의 모든 터미널 칸에 환원을 넣는다."""
    states, trans = canonical(prods, order)
    _, follow, _ = first_follow(prods)
    nts = set(nonterminals(prods))
    terms = terminals(prods) + ["$"]
    action, gototab = {}, {}
    for (i, x), j in trans.items():
        if x in nts:
            gototab[(i, x)] = j
        else:
            action.setdefault((i, x), set()).add("S%d" % j)
    for i, st in enumerate(states, 1):
        for p, d in st:
            l, r = prods[p]
            if d == len(r):
                look = follow[l] if use_follow else set(terms)
                if p == 0:
                    look = {"$"}
                for a in look:
                    action.setdefault((i, a), set()).add("R%d" % p)
    return states, trans, action, gototab


def conflicts(action):
    return sorted((k, sorted(v)) for k, v in action.items() if len(v) > 1)


def parse(tokens, prods, action, gototab):
    """스택 파서. 돌려주는 것: (받아들였나, 추적).
    추적의 한 줄 = (상태 스택, 기호 스택, 남은 입력, 한 일)."""
    toks = list(tokens) + ["$"]
    st, syms, pos, trace = [1], [], 0, []
    while True:
        acts = action.get((st[-1], toks[pos]), set())
        assert len(acts) <= 1, "충돌이 있는 표로는 파싱하지 않는다"
        if not acts:
            trace.append((list(st), list(syms), toks[pos:], "error"))
            return False, trace
        a = next(iter(acts))
        if a[0] == "S":
            trace.append((list(st), list(syms), toks[pos:], "shift"))
            st.append(int(a[1:]))
            syms.append(toks[pos])
            pos += 1
        else:
            p = int(a[1:])
            l, r = prods[p]
            if p == 0:
                trace.append((list(st), list(syms), toks[pos:], "accept"))
                return True, trace
            trace.append((list(st), list(syms), toks[pos:], "reduce %s -> %s" % (l, " ".join(r))))
            if r:
                del st[-len(r):]
                del syms[-len(r):]
            st.append(gototab[(st[-1], l)])
            syms.append(l)


def derives(prods, start, tokens):
    """느리지만 뻔한 방법: 구간마다 '이 기호가 이 구간을 만들 수 있나'를 모두 따진다(빈 규칙 없는 문법용)."""
    toks = tuple(tokens)
    nts = set(nonterminals(prods))
    memo = {}

    def seq(rhs, i, j):
        if not rhs:
            return i == j
        if len(rhs) == 1:
            return sym(rhs[0], i, j)
        return any(sym(rhs[0], i, m) and seq(rhs[1:], m, j) for m in range(i + 1, j - len(rhs) + 2))

    def sym(x, i, j):
        if x not in nts:
            return j == i + 1 and toks[i] == x
        if j <= i:
            return False
        key = (x, i, j)
        if key not in memo:
            memo[key] = False
            memo[key] = any(seq(r, i, j) for l, r in prods if l == x)
        return memo[key]

    return sym(start, 0, len(toks))


def all_strings(alphabet, maxlen):
    level = [()]
    for _ in range(maxlen + 1):
        for s in level:
            yield s
        level = [s + (a,) for s in level for a in alphabet]


def show_item(prods, item):
    p, d = item
    l, r = prods[p]
    return "%s -> %s.%s" % (l, " ".join(r[:d]), " ".join(r[d:]))


# 강의 7~8회의 문법 (L07 p.21, L08 p.7)
G2 = [("S'", ("E",)), ("E", ("T", "*", "E")), ("E", ("T",)), ("T", ("(", "E", ")")), ("T", ("id",))]
G2_ORDER = ["E", "T", "(", ")", "id", "*"]
# 강의 7회 앞부분의 문법 (L07 p.3~18)
G1 = [("S'", ("E",)), ("E", ("T", "+", "E")), ("E", ("T",)), ("T", ("F", "*", "T")), ("T", ("F",)),
      ("F", ("(", "E", ")")), ("F", ("id",))]
G1_ORDER = ["E", "T", "F", "(", ")", "id", "+", "*"]


def slide_table(prods, order):
    """슬라이드 표기로 바꾼 표: 규칙 번호는 1부터(S' -> S가 (1)), 환원은 R(k)."""
    states, trans, action, gototab = slr_table(prods, order)
    terms = terminals(prods) + ["$"]
    nts = nonterminals(prods)[1:]
    rows = {}
    for i in range(1, len(states) + 1):
        row = []
        for a in terms:
            cell = sorted(action.get((i, a), []))
            row.append("/".join(c if c[0] == "S" else "R(%d)" % (int(c[1:]) + 1) for c in cell))
        row += [str(gototab.get((i, A), "")) for A in nts]
        rows[i] = row
    kernels = {i: sorted(show_item(prods, it) for it in s if it[1] > 0 or it[0] == 0)
               for i, s in enumerate(states, 1)}
    return terms + nts, rows, kernels, first_follow(prods)[1]


if __name__ == "__main__":
    # 문제 1: (1) S' -> S, (2) S -> ( S ), (3) S -> a
    P1 = [("S'", ("S",)), ("S", ("(", "S", ")")), ("S", ("a",))]
    cols, rows, kern, follow = slide_table(P1, ["S", "(", ")", "a"])
    assert cols == ["(", ")", "a", "$", "S"] and follow["S"] == {")", "$"}
    assert kern == {1: ["S' -> .S"], 2: ["S' -> S."], 3: ["S -> (.S )"], 4: ["S -> a."],
                    5: ["S -> ( S.)"], 6: ["S -> ( S )."]}
    assert rows == {1: ["S3", "", "S4", "", "2"], 2: ["", "", "", "R(1)", ""], 3: ["S3", "", "S4", "", "5"],
                    4: ["", "R(3)", "", "R(3)", ""], 5: ["", "S6", "", "", ""], 6: ["", "R(2)", "", "R(2)", ""]}

    # 문제 2: (1) S' -> S, (2) S -> a S, (3) S -> b
    P2 = [("S'", ("S",)), ("S", ("a", "S")), ("S", ("b",))]
    cols, rows, kern, follow = slide_table(P2, ["S", "a", "b"])
    assert cols == ["a", "b", "$", "S"] and follow["S"] == {"$"}
    assert kern == {1: ["S' -> .S"], 2: ["S' -> S."], 3: ["S -> a.S"], 4: ["S -> b."], 5: ["S -> a S."]}
    assert rows == {1: ["S3", "S4", "", "2"], 2: ["", "", "R(1)", ""], 3: ["S3", "S4", "", "5"],
                    4: ["", "", "R(3)", ""], 5: ["", "", "R(2)", ""]}

    # 문제 3: (1) S' -> E, (2) E -> E + T, (3) E -> T, (4) T -> id  (좌재귀)
    P3 = [("S'", ("E",)), ("E", ("E", "+", "T")), ("E", ("T",)), ("T", ("id",))]
    cols, rows, kern, follow = slide_table(P3, ["E", "T", "id", "+"])
    assert cols == ["+", "id", "$", "E", "T"] and follow["E"] == {"+", "$"} and follow["T"] == {"+", "$"}
    assert kern == {1: ["S' -> .E"], 2: ["E -> E.+ T", "S' -> E."], 3: ["E -> T."], 4: ["T -> id."],
                    5: ["E -> E +.T"], 6: ["E -> E + T."]}
    assert rows == {1: ["", "S4", "", "2", "3"], 2: ["S5", "", "R(1)", "", ""], 3: ["R(3)", "", "R(3)", "", ""],
                    4: ["R(4)", "", "R(4)", "", ""], 5: ["", "S4", "", "", "6"], 6: ["R(2)", "", "R(2)", "", ""]}
    assert conflicts(slr_table(P3, ["E", "T", "id", "+"], use_follow=False)[2]) == []
    ok, tr = parse("id + id + id".split(), P3, *slr_table(P3, ["E", "T", "id", "+"])[2:])
    assert ok and max(len(t[0]) for t in tr) == 4          # 좌재귀라 스택이 깊어지지 않는다

    # 문제 4: (1) S' -> E, (2) E -> T + E, (3) E -> T, (4) T -> id  (우재귀)
    P4 = [("S'", ("E",)), ("E", ("T", "+", "E")), ("E", ("T",)), ("T", ("id",))]
    cols, rows, kern, follow = slide_table(P4, ["E", "T", "id", "+"])
    assert follow["E"] == {"$"} and follow["T"] == {"+", "$"}
    assert kern == {1: ["S' -> .E"], 2: ["S' -> E."], 3: ["E -> T.", "E -> T.+ E"], 4: ["T -> id."],
                    5: ["E -> T +.E"], 6: ["E -> T + E."]}
    assert rows == {1: ["", "S4", "", "2", "3"], 2: ["", "", "R(1)", "", ""], 3: ["S5", "", "R(3)", "", ""],
                    4: ["R(4)", "", "R(4)", "", ""], 5: ["", "S4", "", "6", "3"], 6: ["", "", "R(2)", "", ""]}
    assert conflicts(slr_table(P4, ["E", "T", "id", "+"], use_follow=False)[2]) == [((3, "+"), ["R2", "S5"])]
    ok, tr = parse("id + id + id".split(), P4, *slr_table(P4, ["E", "T", "id", "+"])[2:])
    assert ok and max(len(t[0]) for t in tr) == 6          # 우재귀라 끝까지 쌓고 나서 줄인다
    print("ALL CHECKS PASSED")
```
{% endraw %}
