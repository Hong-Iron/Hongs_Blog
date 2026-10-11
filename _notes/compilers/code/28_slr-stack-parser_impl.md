---
layout: "note"
title: "28_slr-stack-parser_impl.py"
display_title: "28_slr-stack-parser_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "28"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/slr-stack-parser/"
parent_title: "SLR 파서의 스택 동작"
description: "컴파일러 · SLR 파서의 스택 동작 구현 코드"
permalink: "/studies/compilers/code/28_slr-stack-parser_impl/"
---
{% raw %}
[SLR 파서의 스택 동작](/Hongs_Blog/studies/compilers/slr-stack-parser/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 구현과 검증: 스택으로 도는 SLR 파서 (L08 p.12~34). id * id $의 스택 변화와, 다시 읽는 방식과의 비교.
# 실행: python3 28_slr-stack-parser_impl.py
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


def parse_rerun(tokens, prods, trans, action):
    """L08 p.12~21의 방식: 결정할 때마다 왼쪽 부분을 1번 상태부터 다시 읽는다. (받아들였나, 결정 목록, 읽은 기호 수)"""
    toks = list(tokens) + ["$"]
    left, pos, walked, decisions = [], 0, 0, []
    while True:
        st = 1
        for x in left:
            st = trans[(st, x)]
            walked += 1
        acts = action.get((st, toks[pos]), set())
        if not acts:
            decisions.append("error")
            return False, decisions, walked
        a = next(iter(acts))
        if a[0] == "S":
            decisions.append("shift")
            left.append(toks[pos])
            pos += 1
        else:
            p = int(a[1:])
            l, r = prods[p]
            if p == 0:
                decisions.append("accept")
                return True, decisions, walked
            decisions.append("reduce %s -> %s" % (l, " ".join(r)))
            del left[-len(r):]
            left.append(l)


if __name__ == "__main__":
    states, trans, action, gototab = slr_table(G2, G2_ORDER)

    # (1) L08 p.22~34: id * id $의 스택 변화
    ok, tr = parse("id * id".split(), G2, action, gototab)
    assert ok
    stacks = [(st, a) for st, _, _, a in tr]
    slide = [
        ([1], "shift"),                         # p.22~23: S5
        ([1, 5], "reduce T -> id"),             # p.24~25: 하나 꺼내고 GOTO(1, T) = 3
        ([1, 3], "shift"),                      # p.26: S6
        ([1, 3, 6], "shift"),                   # p.27: S5
        ([1, 3, 6, 5], "reduce T -> id"),       # p.28~29: GOTO(6, T) = 3
        ([1, 3, 6, 3], "reduce E -> T"),        # p.30~31: GOTO(6, E) = 8
        ([1, 3, 6, 8], "reduce E -> T * E"),    # p.32~33: 셋 꺼내고 GOTO(1, E) = 2
        ([1, 2], "accept"),                     # p.34
    ]
    assert stacks == slide, stacks

    # (2) 스택에는 '왼쪽 부분을 1번 상태부터 읽으며 지나온 상태들'이 그대로 들어 있다
    def check_invariant(tr):
        for st, syms, _, _ in tr:
            path, cur = [1], 1
            for x in syms:
                cur = trans[(cur, x)]
                path.append(cur)
            assert st == path

    # (3) 길이 7 이하 모든 토큰열: 다시 읽는 방식과 스택 방식의 결정이 같고, 답도 뻔한 방법과 같다
    n = 0
    for s in all_strings(["id", "*", "(", ")"], 7):
        ok, tr = parse(s, G2, action, gototab)
        ok2, dec, walked = parse_rerun(s, G2, trans, action)
        assert ok == ok2 == derives(G2, "E", s)
        assert dec == [a for *_, a in tr]
        check_invariant(tr)
        n += 1
    print("토큰열 %d개: 두 방식의 결정이 모두 같고, 스택 불변식이 지켜진다" % n)

    # (4) 다시 읽는 방식은 얼마나 더 읽나: id * id 는 14번, 스택은 7번 밀어 넣는다
    ok, dec, walked = parse_rerun("id * id".split(), G2, trans, action)
    assert walked == 14 and len(dec) - 1 == 7
    for k in (10, 20, 40):
        s = ["id"] + ["*", "id"] * (k - 1)
        ok, dec, walked = parse_rerun(s, G2, trans, action)
        ok, tr = parse(s, G2, action, gototab)
        pushes = len(tr) - 1
        assert ok and pushes == (2 * k - 1) + 2 * k            # 이동 2k-1번, 환원 2k번
        assert walked == 4 * k * k - k                         # 토큰 수의 제곱에 비례해 늘어난다
        print("id가 %d개: 다시 읽기 %d번, 스택에 넣기 %d번" % (k, walked, pushes))

    # (5) 오류는 표의 빈칸에서 난다
    ok, tr = parse("id id".split(), G2, action, gototab)
    assert not ok and tr[-1][0] == [1, 5] and tr[-1][2][0] == "id"
    ok, tr = parse("id *".split(), G2, action, gototab)
    assert not ok and tr[-1][0] == [1, 3, 6] and tr[-1][2][0] == "$"
    print("ALL CHECKS PASSED")
```
{% endraw %}
