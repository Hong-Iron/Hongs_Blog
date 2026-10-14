---
layout: "note"
title: "25_lr0-item-automaton_impl.py"
display_title: "25_lr0-item-automaton_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "25"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/lr0-item-automaton/"
parent_title: "LR(0) 항목과 항목 오토마타"
description: "컴파일러 · LR(0) 항목과 항목 오토마타 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/25_lr0-item-automaton_impl/"
---
{% raw %}
[LR(0) 항목과 항목 오토마타](/Hongs_Blog/studies/compilers/lr0-item-automaton/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 구현과 검증: LR(0) 항목, 항목 NFA, 부분집합 구성법으로 만든 DFA (L07 p.19~31, L08 p.7).
# 실행: python3 25_lr0-item-automaton_impl.py
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


def items_of(prods):
    return [(p, d) for p, (_, r) in enumerate(prods) for d in range(len(r) + 1)]


def item_nfa(prods):
    """L07 p.20의 3~5단계. 상태 = 항목, 시작 = S' -> .S, 모든 상태가 받아들이는 상태."""
    nts = set(nonterminals(prods))
    sym, eps = {}, {}
    for p, d in items_of(prods):
        r = prods[p][1]
        if d < len(r):
            sym[((p, d), r[d])] = (p, d + 1)                                   # 4단계
            if r[d] in nts:
                eps[(p, d)] = {(q, 0) for q, (l, _) in enumerate(prods) if l == r[d]}   # 5단계
    return sym, eps


def eclose(S, eps):
    out, work = set(S), list(S)
    while work:
        for t in eps.get(work.pop(), ()):
            if t not in out:
                out.add(t)
                work.append(t)
    return frozenset(out)


def subset_construction(prods, order):
    sym, eps = item_nfa(prods)
    start = eclose({(0, 0)}, eps)
    states, trans, i = [start], {}, 0
    while i < len(states):
        for x in order:
            mv = {sym[(it, x)] for it in states[i] if (it, x) in sym}
            if not mv:
                continue
            t = eclose(mv, eps)
            if t not in states:
                states.append(t)
            trans[(i + 1, x)] = states.index(t) + 1
        i += 1
    return states, trans


def nfa_accepts(prods, symbols):
    sym, eps = item_nfa(prods)
    cur = eclose({(0, 0)}, eps)
    for x in symbols:
        cur = eclose({sym[(it, x)] for it in cur if (it, x) in sym}, eps)
        if not cur:
            return False
    return True


if __name__ == "__main__":
    # (1) 항목 수: E -> T * E는 4개, 빈 규칙은 1개 (L07 p.19)
    assert [show_item(G2, it) for it in items_of(G2) if it[0] == 1] == \
        ["E -> .T * E", "E -> T.* E", "E -> T *.E", "E -> T * E."]
    assert len(items_of([("S'", ("A",)), ("A", ())])) == 3 and items_of([("A", ())]) == [(0, 0)]
    assert len(items_of(G2)) == 14                       # L07 p.29의 NFA 상태 14개
    sym, eps = item_nfa(G2)
    assert len(sym) == 9 and sum(len(v) for v in eps.values()) == 10
    print("NFA: 상태 14개, 기호 전이 9개, 엡실론 전이 10개")

    # (2) 부분집합 구성법으로 만든 DFA = closure/goto로 만든 DFA = L07 p.30, L08 p.7의 그림
    states, trans = subset_construction(G2, G2_ORDER)
    states_c, trans_c = canonical(G2, G2_ORDER)
    assert states == states_c and trans == trans_c
    slide_states = {
        1: {"S' -> .E", "E -> .T * E", "E -> .T", "T -> .( E )", "T -> .id"},
        2: {"S' -> E."},
        3: {"E -> T.* E", "E -> T."},
        4: {"T -> (.E )", "E -> .T * E", "E -> .T", "T -> .( E )", "T -> .id"},
        5: {"T -> id."},
        6: {"E -> T *.E", "E -> .T * E", "E -> .T", "T -> .( E )", "T -> .id"},
        7: {"T -> ( E.)"},
        8: {"E -> T * E."},
        9: {"T -> ( E )."},
    }
    assert {i: {show_item(G2, it) for it in s} for i, s in enumerate(states, 1)} == slide_states
    slide_trans = {(1, "E"): 2, (1, "T"): 3, (1, "("): 4, (1, "id"): 5, (3, "*"): 6,
                   (4, "E"): 7, (4, "T"): 3, (4, "("): 4, (4, "id"): 5,
                   (6, "E"): 8, (6, "T"): 3, (6, "("): 4, (6, "id"): 5, (7, ")"): 9}
    assert trans == slide_trans
    print("DFA: 상태 9개, 전이 14개, 슬라이드 그림과 일치")

    # (3) NFA와 DFA는 같은 기호열을 받아들인다 (길이 5 이하 전부)
    syms = ["E", "T", "(", ")", "id", "*"]
    n = 0
    for s in all_strings(syms, 5):
        st, okd = 1, True
        for x in s:
            if (st, x) not in trans:
                okd = False
                break
            st = trans[(st, x)]
        assert okd == nfa_accepts(G2, s), s
        n += okd
    print("길이 5 이하 기호열 %d개 중 %d개를 받아들이고, NFA와 DFA의 답이 모두 같다" % (sum(6 ** k for k in range(6)), n))

    # (4) L07 p.31: ((((((((는 4번 상태에서 맴돈다
    st = 1
    for _ in range(8):
        st = trans[(st, "(")]
        assert st == 4
    # 확인 문제용: T * ( 를 읽은 뒤의 상태, 3번 상태의 항목
    st = 1
    for x in ["T", "*", "("]:
        st = trans[(st, x)]
    assert st == 4
    assert goto(states[0], "T", G2) == states[2]
    print("ALL CHECKS PASSED")
```
{% endraw %}
