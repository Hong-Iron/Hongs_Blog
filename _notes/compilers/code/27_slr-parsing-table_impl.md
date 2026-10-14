---
layout: "note"
title: "27_slr-parsing-table_impl.py"
display_title: "27_slr-parsing-table_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "27"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/slr-parsing-table/"
parent_title: "SLR 파싱 표"
description: "컴파일러 · SLR 파싱 표 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/27_slr-parsing-table_impl/"
---
{% raw %}
[SLR 파싱 표](/Hongs_Blog/studies/compilers/slr-parsing-table/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 구현과 검증: SLR 파싱 표 만들기 (L08 p.6~11). 슬라이드의 ACTION·GOTO 표를 그대로 다시 만든다.
# 실행: python3 27_slr-parsing-table_impl.py
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


def table_rows(prods, order, states, action, gototab):
    terms = terminals(prods) + ["$"]
    nts = nonterminals(prods)[1:]
    rows = []
    for i in range(1, len(states) + 1):
        row = ["/".join(sorted(action.get((i, a), []))) for a in terms]
        row += [str(gototab.get((i, A), "")) for A in nts]
        rows.append(row)
    return terms + nts, rows


if __name__ == "__main__":
    states, trans, action, gototab = slr_table(G2, G2_ORDER)
    # 슬라이드의 열 순서: * ( ) id $ | E T  (L08 p.8~11)
    cols = ["*", "(", ")", "id", "$"]
    got = {i: [next(iter(action[(i, a)])) if (i, a) in action else "" for a in cols]
              + [str(gototab.get((i, A), "")) for A in ("E", "T")] for i in range(1, 10)}
    slide = {
        1: ["", "S4", "", "S5", "", "2", "3"],
        2: ["", "", "", "", "R0", "", ""],          # 슬라이드의 R(1): S' -> E 로 환원 = 받아들임
        3: ["S6", "", "R2", "", "R2", "", ""],      # 슬라이드의 R(3): E -> T
        4: ["", "S4", "", "S5", "", "7", "3"],
        5: ["R4", "", "R4", "", "R4", "", ""],      # R(5): T -> id
        6: ["", "S4", "", "S5", "", "8", "3"],
        7: ["", "", "S9", "", "", "", ""],
        8: ["", "", "R1", "", "R1", "", ""],        # R(2): E -> T * E
        9: ["R3", "", "R3", "", "R3", "", ""],      # R(4): T -> ( E )
    }
    assert got == slide, got
    assert conflicts(action) == []
    # 코드의 규칙 번호는 0부터, 슬라이드는 1부터다. 코드의 Rk = 슬라이드의 R(k+1)
    shifts = sum(1 for v in action.values() for a in v if a[0] == "S")
    reduces = sum(1 for v in action.values() for a in v if a[0] == "R")
    assert (shifts, reduces, len(gototab)) == (8, 11, 6)
    assert 9 * 5 - shifts - reduces == 26            # 빈칸(오류) 26칸

    # 1단계(GOTO)만: L08 p.8
    assert gototab == {(1, "E"): 2, (1, "T"): 3, (4, "E"): 7, (4, "T"): 3, (6, "E"): 8, (6, "T"): 3}
    # 2단계 1) 이동만: L08 p.9
    sh = {k: next(iter(v)) for k, v in action.items() if next(iter(v))[0] == "S"}
    assert sh == {(1, "("): "S4", (1, "id"): "S5", (3, "*"): "S6", (4, "("): "S4", (4, "id"): "S5",
                  (6, "("): "S4", (6, "id"): "S5", (7, ")"): "S9"}
    # 2단계 2) 환원은 FOLLOW가 정한다
    _, follow, _ = first_follow(G2)
    assert follow["E"] == {")", "$"} and follow["T"] == {"*", ")", "$"} and follow["S'"] == {"$"}
    # FOLLOW를 안 쓰면(LR(0)) 3번 줄의 * 칸에 이동과 환원이 겹친다
    _, _, a0, _ = slr_table(G2, G2_ORDER, use_follow=False)
    assert conflicts(a0) == [((3, "*"), ["R2", "S6"])]
    print("SLR 표: 이동 8칸, 환원 11칸, GOTO 6칸, 빈칸 26칸. 슬라이드 표와 일치")
    print("ALL CHECKS PASSED")
```
{% endraw %}
