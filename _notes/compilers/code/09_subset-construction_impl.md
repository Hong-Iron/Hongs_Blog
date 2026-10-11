---
layout: "note"
title: "09_subset-construction_impl.py"
display_title: "09_subset-construction_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "09"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/subset-construction/"
parent_title: "부분집합 구성법"
description: "컴파일러 · 부분집합 구성법 구현 코드"
permalink: "/studies/compilers/code/09_subset-construction_impl/"
---
{% raw %}
[부분집합 구성법](/Hongs_Blog/studies/compilers/subset-construction/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 부분집합 구성법: NFA -> DFA (슬라이드 L03 p.29~36의 네 단계)
# 실행: python3 09_subset-construction_impl.py   (표준 라이브러리만 쓴다)
# NFA는 (시작 상태, 받아들이는 상태 집합, 화살표 목록)으로 적는다. 화살표는 (출발, 라벨, 도착)이고 라벨 None이 ε이다.
import itertools
import random

EPS = None


def eps_closure(edges, states):
    """states에서 ε-화살표만 따라 닿는 상태를 모두 모은다(자기 자신 포함)."""
    stack, seen = list(states), set(states)
    while stack:
        p = stack.pop()
        for (a, label, b) in edges:
            if a == p and label is EPS and b not in seen:
                seen.add(b)
                stack.append(b)
    return frozenset(seen)


def move(edges, states, sym):
    """states의 어느 상태에서든 sym을 읽고 갈 수 있는 상태(슬라이드의 δ(T, s))."""
    return {b for (a, label, b) in edges if a in states and label == sym}


def subset_construction(nfa, alphabet):
    """T0, T1, ...을 찾은 순서대로 담은 목록과 전이 표, 받아들이는 T의 번호를 돌려준다.
    갈 곳이 없으면 표에 None(슬라이드의 ∅)을 적고 상태로 만들지 않는다."""
    start, finals, edges = nfa
    T = [eps_closure(edges, {start})]            # 1단계
    table = {}
    i = 0
    while i < len(T):                            # 3단계: 새 T가 안 나올 때까지
        for sym in alphabet:                     # 2단계
            nxt = eps_closure(edges, move(edges, T[i], sym))
            if not nxt:
                table[(i, sym)] = None
                continue
            if nxt not in T:
                T.append(nxt)
            table[(i, sym)] = T.index(nxt)
        i += 1
    accepting = [k for k, t in enumerate(T) if t & set(finals)]   # 4단계
    return T, table, accepting


def nfa_accepts(nfa, text):
    start, finals, edges = nfa
    cur = eps_closure(edges, {start})
    for ch in text:
        cur = eps_closure(edges, move(edges, cur, ch))
    return bool(cur & set(finals))


def dfa_accepts(table, accepting, text):
    state = 0
    for ch in text:
        state = table.get((state, ch))
        if state is None:
            return False
    return state in accepting


def all_strings(alphabet, max_len):
    for k in range(max_len + 1):
        for tup in itertools.product(alphabet, repeat=k):
            yield "".join(tup)


def S(text):
    return frozenset(text)


# 슬라이드 p.29: (a|b)의 NFA. A~F, F가 받아들이는 상태.
N29 = ("A", {"F"}, [("A", EPS, "B"), ("A", EPS, "C"), ("B", "a", "D"), ("C", "b", "E"),
                    ("D", EPS, "F"), ("E", EPS, "F")])
# 슬라이드 p.30~34: (a|b)a의 NFA. A~H, H가 받아들이는 상태.
N30 = ("A", {"H"}, N29[2] + [("F", EPS, "G"), ("G", "a", "H")])
# 슬라이드 p.35: sIdentifier = letter(digit|letter)* 의 NFA. A~J, J가 받아들이는 상태. l = letter, d = digit.
NID = ("A", {"J"}, [("A", "l", "B"), ("B", EPS, "C"), ("C", EPS, "D"), ("C", EPS, "J"),
                    ("D", EPS, "E"), ("D", EPS, "G"), ("E", "d", "F"), ("G", "l", "H"),
                    ("F", EPS, "I"), ("H", EPS, "I"), ("I", EPS, "J"), ("I", EPS, "D")])

if __name__ == "__main__":
    # (1) p.29의 ε-closure 예
    assert eps_closure(N29[2], {"A"}) == S("ABC")
    assert eps_closure(N29[2], set("ABCD")) == S("ABCDF")

    # (2) p.30~34: (a|b)a
    T, table, acc = subset_construction(N30, "ab")
    assert T == [S("ABC"), S("DFG"), S("EFG"), S("H")]
    assert table == {(0, "a"): 1, (0, "b"): 2, (1, "a"): 3, (1, "b"): None,
                     (2, "a"): 3, (2, "b"): None, (3, "a"): None, (3, "b"): None}
    assert acc == [3]
    assert [s for s in all_strings("ab", 4) if dfa_accepts(table, acc, s)] == ["aa", "ba"]
    # 문서의 추적: "ba"는 T0 -> T2 -> T3, "ab"는 T0 -> T1 -> 갈 곳 없음
    assert (table[(0, "b")], table[(2, "a")]) == (2, 3) and table[(table[(0, "a")], "b")] is None

    # (3) p.35~36: sIdentifier
    T, table, acc = subset_construction(NID, "ld")
    assert T == [S("A"), S("BCDEGJ"), S("DEGHIJ"), S("DEFGIJ")]
    assert table == {(0, "l"): 1, (0, "d"): None, (1, "l"): 2, (1, "d"): 3,
                     (2, "l"): 2, (2, "d"): 3, (3, "l"): 2, (3, "d"): 3}
    assert acc == [1, 2, 3]
    # 원본 오류 의심: p.36 마지막 줄은 {D,E,G,H,I,J} = T3 이라 적었다. 실제 값은 F가 든 집합이다.
    last = eps_closure(NID[2], move(NID[2], T[3], "d"))
    assert last == S("DEFGIJ") == T[3] and last != S("DEGHIJ")
    assert move(NID[2], T[3], "d") == {"F"}
    for s in all_strings("ld", 8):
        assert nfa_accepts(NID, s) == dfa_accepts(table, acc, s) == (len(s) >= 1 and s[0] == "l")

    # (4) 무작위 NFA 300개: NFA와 만든 DFA가 길이 7 이하의 모든 문자열에서 같은 답을 낸다
    rng = random.Random(9)
    for _ in range(300):
        n = rng.randint(1, 5)
        edges = [(rng.randrange(n), rng.choice(["a", "b", EPS]), rng.randrange(n))
                 for _ in range(rng.randint(0, 10))]
        nfa = (0, {q for q in range(n) if rng.random() < 0.4}, edges)
        T, table, acc = subset_construction(nfa, "ab")
        assert len(T) <= 2 ** n - 1          # 빈 집합은 상태로 만들지 않으므로 2^n - 1 이하
        assert len(set(T)) == len(T)
        for s in all_strings("ab", 7):
            assert nfa_accepts(nfa, s) == dfa_accepts(table, acc, s)

    # (5) DFA가 지수적으로 커지는 예: "뒤에서 n번째 글자가 a"
    #     NFA는 상태 n+1개, 부분집합 구성법이 만드는 DFA는 정확히 2^n개
    for n in range(1, 11):
        edges = [(0, "a", 0), (0, "b", 0), (0, "a", 1)]
        for k in range(1, n):
            edges += [(k, "a", k + 1), (k, "b", k + 1)]
        nfa = (0, {n}, edges)
        T, table, acc = subset_construction(nfa, "ab")
        assert len(T) == 2 ** n
        if n <= 4:
            for s in all_strings("ab", 9):
                assert dfa_accepts(table, acc, s) == (len(s) >= n and s[-n] == "a")

    # (6) 카드 값
    #  C2(trace): p.13의 NFA ((0|1)*00). q0 -0,1-> q0, q0 -0-> q1, q1 -0-> q2
    N13 = (0, {2}, [(0, "0", 0), (0, "1", 0), (0, "0", 1), (1, "0", 2)])
    T, table, acc = subset_construction(N13, "01")
    assert T == [frozenset({0}), frozenset({0, 1}), frozenset({0, 1, 2})]
    assert table == {(0, "0"): 1, (0, "1"): 0, (1, "0"): 2, (1, "1"): 0, (2, "0"): 2, (2, "1"): 0}
    assert acc == [2]
    #  C5(apply): ε-closure 연습. p.35의 NFA에서
    assert eps_closure(NID[2], {"B"}) == S("BCDEGJ")
    assert eps_closure(NID[2], {"F"}) == S("DEFGIJ")
    assert eps_closure(NID[2], {"H"}) == S("DEGHIJ")
    #  오해 항목: 2^10 = 1024, 실제로 만들어지는 것은 4개
    assert 2 ** 10 == 1024 and len(subset_construction(NID, "ld")[0]) == 4
    print("ALL CHECKS PASSED")
```
{% endraw %}
