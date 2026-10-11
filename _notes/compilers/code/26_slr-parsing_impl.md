---
layout: "note"
title: "26_slr-parsing_impl.py"
display_title: "26_slr-parsing_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "26"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/slr-parsing/"
parent_title: "SLR 파싱"
description: "컴파일러 · SLR 파싱 구현 코드"
permalink: "/studies/compilers/code/26_slr-parsing_impl/"
---
{% raw %}
[SLR 파싱](/Hongs_Blog/studies/compilers/slr-parsing/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 구현과 검증: LR(0)의 충돌과 SLR의 해결, ( id * id )의 결정 순서, 모호한 문법과 우선순위 선언 (L07 p.32~47).
# 실행: python3 26_slr-parsing_impl.py
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


def count_trees(prods, start, tokens):
    """파스 트리의 수를 센다(빈 규칙 없는 문법용). 2 이상이면 모호하다."""
    toks = tuple(tokens)
    nts = set(nonterminals(prods))
    memo = {}

    def seq(rhs, i, j):
        if len(rhs) == 1:
            return sym(rhs[0], i, j)
        return sum(sym(rhs[0], i, m) * seq(rhs[1:], m, j) for m in range(i + 1, j - len(rhs) + 2))

    def sym(x, i, j):
        if x not in nts:
            return int(j == i + 1 and toks[i] == x)
        if j <= i:
            return 0
        key = (x, i, j)
        if key not in memo:
            memo[key] = 0
            memo[key] = sum(seq(r, i, j) for l, r in prods if l == x)
        return memo[key]

    return sym(start, 0, len(toks))


def parse_tree(tokens, prods, action, gototab, choose):
    """충돌 칸에서는 choose(스택 맨 위 쪽 연산자, 다음 토큰, 후보들)가 고른다. 괄호 친 문자열을 돌려준다."""
    toks = list(tokens) + ["$"]
    st, vals, ops, pos = [1], [], [], 0
    while True:
        acts = action.get((st[-1], toks[pos]), set())
        if not acts:
            return None
        a = next(iter(acts)) if len(acts) == 1 else choose(vals, toks[pos], acts)
        if a[0] == "S":
            st.append(int(a[1:]))
            vals.append(toks[pos])
            pos += 1
        else:
            p = int(a[1:])
            l, r = prods[p]
            if p == 0:
                return vals[0]
            kids = vals[-len(r):]
            del st[-len(r):]
            del vals[-len(r):]
            vals.append(kids[0] if len(kids) == 1 else "(" + "".join(kids) + ")")
            st.append(gototab[(st[-1], l)])


if __name__ == "__main__":
    # (1) LR(0)로는 3번 상태에서 막힌다 (L07 p.36). FOLLOW를 보면 풀린다 (p.37~38)
    states, trans, a0, g0 = slr_table(G2, G2_ORDER, use_follow=False)
    assert conflicts(a0) == [((3, "*"), ["R2", "S6"])]
    assert {show_item(G2, it) for it in states[2]} == {"E -> T.* E", "E -> T."}
    states, trans, action, gototab = slr_table(G2, G2_ORDER)
    assert conflicts(action) == []
    _, follow, _ = first_follow(G2)
    assert follow["E"] == {")", "$"} and follow["T"] == {"*", ")", "$"}

    # (2) L07 p.33~46: ( id * id )의 결정 순서
    ok, tr = parse("( id * id )".split(), G2, action, gototab)
    rows = [(" ".join(s) + "|" + " ".join(r), a) for _, s, r, a in tr]
    slide = [
        ("|( id * id ) $", "shift"),                  # p.33
        ("(|id * id ) $", "shift"),
        ("( id|* id ) $", "reduce T -> id"),          # p.35
        ("( T|* id ) $", "shift"),                    # p.36, p.38: * 는 FOLLOW(E)에 없다
        ("( T *|id ) $", "shift"),                    # p.39
        ("( T * id|) $", "reduce T -> id"),           # p.40: ) 는 FOLLOW(T)에 있다
        ("( T * T|) $", "reduce E -> T"),             # p.41: ) 는 FOLLOW(E)에 있다
        ("( T * E|) $", "reduce E -> T * E"),         # p.42
        ("( E|) $", "shift"),                         # p.43
        ("( E )|$", "reduce T -> ( E )"),             # p.44: $ 는 FOLLOW(T)에 있다
        ("T|$", "reduce E -> T"),                     # p.45
        ("E|$", "accept"),                            # p.46
    ]
    assert ok and rows == slide, rows

    # (3) 길이 7 이하의 모든 토큰열에서 SLR 파서의 답 = 뻔한 방법의 답
    n = m = 0
    for s in all_strings(["id", "*", "(", ")"], 7):
        ok, _ = parse(s, G2, action, gototab)
        assert ok == derives(G2, "E", s), s
        n += 1
        m += ok
    print("G2 전수 비교: 토큰열 %d개 중 %d개가 문법에 맞고, 모두 일치" % (n, m))

    # (4) L07 p.47: 모호한 문법 E -> E + E | E * E | id 는 SLR 표에 충돌이 남는다
    GA = [("S'", ("E",)), ("E", ("E", "+", "E")), ("E", ("E", "*", "E")), ("E", ("id",))]
    sa, ta, aa, ga = slr_table(GA, ["E", "id", "+", "*"])
    assert first_follow(GA)[1]["E"] == {"+", "*", "$"}
    cf = conflicts(aa)
    assert len(cf) == 4 and all(len(v) == 2 and v[0][0] == "R" and v[1][0] == "S" for _, v in cf)
    plus_done = [i for i, s in enumerate(sa, 1) if (1, 3) in s][0]         # E -> E + E. 가 있는 상태
    assert sorted(aa[(plus_done, "*")]) == ["R1", "S%d" % ta[(plus_done, "*")]]   # 환원만 고르는 것이 아니라 둘 다 든다
    assert count_trees(GA, "E", "id + id * id".split()) == 2

    prec = {"+": 1, "*": 2}

    def by_precedence(vals, look, acts):
        op = vals[-2]                                   # 스택 위쪽 E op E의 op
        red = [a for a in acts if a[0] == "R"][0]
        sh = [a for a in acts if a[0] == "S"][0]
        return sh if prec[look] > prec[op] else red     # 같으면 환원(왼쪽부터 묶기)

    def always_reduce(vals, look, acts):
        return [a for a in acts if a[0] == "R"][0]

    assert parse_tree("id + id * id".split(), GA, aa, ga, by_precedence) == "(id+(id*id))"
    assert parse_tree("id * id + id".split(), GA, aa, ga, by_precedence) == "((id*id)+id)"
    assert parse_tree("id + id + id".split(), GA, aa, ga, by_precedence) == "((id+id)+id)"
    assert parse_tree("id + id * id".split(), GA, aa, ga, always_reduce) == "((id+id)*id)"
    print("모호한 문법: 충돌 칸 4개, 우선순위 선언으로 id+id*id -> (id+(id*id))")

    # (5) 모호하지 않아도 SLR이 아닌 문법이 있다: S -> L = R | R, L -> * R | id, R -> L
    GN = [("S'", ("S",)), ("S", ("L", "=", "R")), ("S", ("R",)), ("L", ("*", "R")), ("L", ("id",)), ("R", ("L",))]
    sn, tn, an, gn = slr_table(GN, ["S", "L", "R", "=", "*", "id"])
    cf = conflicts(an)
    assert len(cf) == 1 and cf[0][0][1] == "=" and sorted(a[0] for a in cf[0][1]) == ["R", "S"]
    assert all(count_trees(GN, "S", s) <= 1 for s in all_strings(["=", "*", "id"], 8))
    print("S -> L = R | R: 길이 8 이하 모든 토큰열에서 파스 트리가 많아야 하나인데도 SLR 충돌 1칸")
    print("ALL CHECKS PASSED")
```
{% endraw %}
