---
layout: "note"
title: "09_subset-construction-ladder_p4.py"
display_title: "09_subset-construction-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "09"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/subset-construction-ladder/"
parent_title: "부분집합 구성법 예제 사다리"
description: "컴파일러 · 부분집합 구성법 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/compilers/code/09_subset-construction-ladder_p4/"
---
{% raw %}
[부분집합 구성법 예제 사다리](/Hongs_Blog/studies/compilers/subset-construction-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 부분집합 구성법 예제 사다리: 문제 1~4의 답을 확인한다
# 실행: python3 09_subset-construction-ladder_p4.py   (표준 라이브러리만 쓴다)
# eps_closure, move, subset_construction은 3.개념집/09_subset-construction_impl.py에서 복사했다.
import itertools

EPS = None


def eps_closure(edges, states):
    stack, seen = list(states), set(states)
    while stack:
        p = stack.pop()
        for (a, label, b) in edges:
            if a == p and label is EPS and b not in seen:
                seen.add(b)
                stack.append(b)
    return frozenset(seen)


def move(edges, states, sym):
    return {b for (a, label, b) in edges if a in states and label == sym}


def subset_construction(nfa, alphabet):
    start, finals, edges = nfa
    T = [eps_closure(edges, {start})]
    table = {}
    i = 0
    while i < len(T):
        for sym in alphabet:
            nxt = eps_closure(edges, move(edges, T[i], sym))
            if not nxt:
                table[(i, sym)] = None
                continue
            if nxt not in T:
                T.append(nxt)
            table[(i, sym)] = T.index(nxt)
        i += 1
    return T, table, [k for k, t in enumerate(T) if t & set(finals)]


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


F = frozenset

if __name__ == "__main__":
    # 문제 1: (0|1)*00 의 NFA (슬라이드 L03 p.13). 결과가 같은 쪽의 DFA와 같다.
    n1 = (0, {2}, [(0, "0", 0), (0, "1", 0), (0, "0", 1), (1, "0", 2)])
    T, table, acc = subset_construction(n1, "01")
    assert T == [F({0}), F({0, 1}), F({0, 1, 2})] and acc == [2]
    assert table == {(0, "0"): 1, (0, "1"): 0, (1, "0"): 2, (1, "1"): 0, (2, "0"): 2, (2, "1"): 0}
    slide_dfa = {("q0", "0"): "q1", ("q0", "1"): "q0", ("q1", "0"): "q2", ("q1", "1"): "q0",
                 ("q2", "0"): "q2", ("q2", "1"): "q0"}
    assert {(f"q{i}", s): f"q{j}" for (i, s), j in table.items()} == slide_dfa

    # 문제 2: a*b 의 톰슨 NFA. 상태 1~6, 6이 받아들이는 상태.
    n2 = (1, {6}, [(1, EPS, 2), (1, EPS, 4), (2, "a", 3), (3, EPS, 2), (3, EPS, 4), (4, EPS, 5), (5, "b", 6)])
    T, table, acc = subset_construction(n2, "ab")
    assert T == [F({1, 2, 4, 5}), F({2, 3, 4, 5}), F({6})]
    assert table == {(0, "a"): 1, (0, "b"): 2, (1, "a"): 1, (1, "b"): 2, (2, "a"): None, (2, "b"): None}
    assert acc == [2]
    assert all(dfa_accepts(table, acc, s) == (s.endswith("b") and set(s[:-1]) <= {"a"}) for s in all_strings("ab", 8))

    # 문제 3: "ab로 끝난다" (a|b)*ab 의 NFA. p -a,b-> p, p -a-> q, q -b-> r
    n3 = ("p", {"r"}, [("p", "a", "p"), ("p", "b", "p"), ("p", "a", "q"), ("q", "b", "r")])
    T, table, acc = subset_construction(n3, "ab")
    assert T == [F("p"), F("pq"), F("pr")]
    assert table == {(0, "a"): 1, (0, "b"): 0, (1, "a"): 1, (1, "b"): 2, (2, "a"): 1, (2, "b"): 0}
    assert acc == [2]
    assert all(dfa_accepts(table, acc, s) == s.endswith("ab") for s in all_strings("ab", 9))

    # 문제 4: "뒤에서 두 번째 글자가 a". s -a,b-> s, s -a-> t, t -a,b-> u
    n4 = ("s", {"u"}, [("s", "a", "s"), ("s", "b", "s"), ("s", "a", "t"), ("t", "a", "u"), ("t", "b", "u")])
    T, table, acc = subset_construction(n4, "ab")
    assert T == [F("s"), F("st"), F("stu"), F("su")]
    assert table == {(0, "a"): 1, (0, "b"): 0, (1, "a"): 2, (1, "b"): 3,
                     (2, "a"): 2, (2, "b"): 3, (3, "a"): 1, (3, "b"): 0}
    assert acc == [2, 3] and len(T) == 4 == 2 ** 2
    assert all(dfa_accepts(table, acc, s) == (len(s) >= 2 and s[-2] == "a") for s in all_strings("ab", 9))
    # 뒤에서 세 번째로 바꾸면 NFA는 상태 4개, DFA는 8개
    n5 = ("s", {"v"}, n4[2] + [("u", "a", "v"), ("u", "b", "v")])
    assert len(subset_construction(n5, "ab")[0]) == 8
    print("ALL CHECKS PASSED")
```
{% endraw %}
