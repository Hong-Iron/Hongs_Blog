---
layout: "note"
title: "29_ll-vs-lr_verify.py"
display_title: "29_ll-vs-lr_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "29"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/ll-vs-lr/"
parent_title: "LL 파싱과 LR 파싱 비교"
description: "컴파일러 · LL 파싱과 LR 파싱 비교 검증 코드"
permalink: "/studies/compilers/code/29_ll-vs-lr_verify/"
---
{% raw %}
[LL 파싱과 LR 파싱 비교](/Hongs_Blog/studies/compilers/ll-vs-lr/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 검증: LL 파싱과 LR 파싱 비교. 같은 문법에서 LL(1) 표와 SLR 표의 충돌, 규칙을 쓰는 순서.
# 실행: python3 29_ll-vs-lr_verify.py
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


def ll1_conflicts(prods):
    """LL(1) 표를 만들어 한 칸에 규칙이 둘 이상 들어가는 칸을 돌려준다."""
    first, follow, nullable = first_follow(prods)
    table = {}
    for p, (l, r) in enumerate(prods):
        if p == 0:
            continue
        look, allnull = set(), True
        for x in r:
            look |= first[x] if x in first else {x}
            if x not in nullable:
                allnull = False
                break
        if allnull:
            look |= follow[l]
        for a in look:
            table.setdefault((l, a), []).append(p)
    return sorted(k for k, v in table.items() if len(v) > 1)


def build_tree(tokens, prods, action, gototab):
    """LR 파서로 파스 트리를 만든다. 노드 = (규칙 번호, 자식들), 잎 = 토큰. 환원한 규칙 번호의 순서도 돌려준다."""
    toks = list(tokens) + ["$"]
    st, vals, pos, order = [1], [], 0, []
    while True:
        a = next(iter(action[(st[-1], toks[pos])]))
        if a[0] == "S":
            st.append(int(a[1:]))
            vals.append(toks[pos])
            pos += 1
        else:
            p = int(a[1:])
            if p == 0:
                return vals[0], order
            l, r = prods[p]
            kids = vals[len(vals) - len(r):]
            del st[len(st) - len(r):]
            del vals[len(vals) - len(r):]
            vals.append((p, kids))
            order.append(p)
            st.append(gototab[(st[-1], l)])


def preorder(node, left_first=True):
    if isinstance(node, str):
        return []
    p, kids = node
    out = [p]
    for k in (kids if left_first else reversed(kids)):
        out += preorder(k, left_first)
    return out


if __name__ == "__main__":
    # (1) 강의의 문법 E -> T + E | T, T -> F * T | F, F -> ( E ) | id
    #     그대로는 LL(1)이 아니다(앞부분이 같은 규칙이 있다). SLR 표에는 충돌이 없다
    assert ll1_conflicts(G1) != []
    assert conflicts(slr_table(G1, G1_ORDER)[2]) == []
    # 좌인수분해한 문법(L05 p.33의 표)은 LL(1)이고 SLR이기도 하다
    GF = [("S'", ("E",)), ("E", ("T", "E'")), ("E'", ("+", "E")), ("E'", ()),
          ("T", ("F", "T'")), ("T'", ("*", "T")), ("T'", ()), ("F", ("(", "E", ")")), ("F", ("id",))]
    assert ll1_conflicts(GF) == []
    assert conflicts(slr_table(GF, ["E", "E'", "T", "T'", "F", "(", ")", "id", "+", "*"])[2]) == []
    # 좌재귀 문법 E -> E + T | T, T -> id: LL(1)은 못 쓰고 SLR은 쓴다
    GL = [("S'", ("E",)), ("E", ("E", "+", "T")), ("E", ("T",)), ("T", ("id",))]
    assert ll1_conflicts(GL) == [("E", "id")]
    assert conflicts(slr_table(GL, ["E", "T", "id", "+"])[2]) == []
    print("G1: LL(1) 충돌 있음 / SLR 충돌 없음.  좌재귀 문법: LL(1) 충돌 있음 / SLR 충돌 없음")

    # (2) 같은 파스 트리를 만드는 순서가 다르다: id * id
    states, trans, action, gototab = slr_table(G1, G1_ORDER)
    tree, lr_order = build_tree("id * id".split(), G1, action, gototab)
    name = lambda p: "%s -> %s" % (G1[p][0], " ".join(G1[p][1]))
    ll_order = preorder(tree)                       # 왼쪽 끝 유도 = 뿌리부터, 왼쪽 자식 먼저
    rm_order = preorder(tree, left_first=False)     # 오른쪽 끝 유도 = 뿌리부터, 오른쪽 자식 먼저
    assert [name(p) for p in ll_order] == ["E -> T", "T -> F * T", "F -> id", "T -> F", "F -> id"]
    assert [name(p) for p in rm_order] == ["E -> T", "T -> F * T", "T -> F", "F -> id", "F -> id"]   # L07 p.3
    assert lr_order == list(reversed(rm_order))     # LR 파서의 환원 순서 = 오른쪽 끝 유도의 역순
    assert [name(p) for p in lr_order][0] == "F -> id" and [name(p) for p in ll_order][0] == "E -> T"
    print("LL이 쓰는 규칙 순서:", ", ".join(name(p) for p in ll_order))
    print("LR이 쓰는 규칙 순서:", ", ".join(name(p) for p in lr_order))
    print("ALL CHECKS PASSED")
```
{% endraw %}
