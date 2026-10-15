---
layout: "note"
title: "11_context-free-grammar_verify.py"
display_title: "11_context-free-grammar_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/context-free-grammar/"
parent_title: "문맥 자유 문법"
description: "컴파일러 · 문맥 자유 문법 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/11_context-free-grammar_verify/"
---
{% raw %}
[문맥 자유 문법](/Hongs_Blog/studies/compilers/context-free-grammar/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""문맥 자유 문법 문서의 예를 확인한다: 예제 문법들이 만드는 문자열, 균형 괄호 언어, 괄호 맞추기를 못 하는 작은 DFA.

실행: python3 11_context-free-grammar_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def accepts_dfa(delta, start, finals, s):
    q = start
    for ch in s:
        q = delta[(q, ch)]
    return q in finals


def small_dfa_exists(k, maxlen):
    """상태 k개짜리 DFA 가운데 길이 maxlen 이하 문자열에서 '( n개 뒤 ) n개'만 받아들이는 것이 있는가."""
    from itertools import product
    strings = [s for n in range(maxlen + 1) for s in product("()", repeat=n)]
    want = [s == tuple("(" * (len(s) // 2) + ")" * (len(s) // 2)) and len(s) % 2 == 0 for s in strings]
    keys = [(q, ch) for q in range(k) for ch in "()"]
    for targets in product(range(k), repeat=len(keys)):
        delta = dict(zip(keys, targets))
        for bits in range(2 ** k):
            finals = {q for q in range(k) if bits >> q & 1}
            if all(accepts_dfa(delta, 0, finals, s) == w for s, w in zip(strings, want)):
                return True
    return False


if __name__ == "__main__":
    T = lambda s: tuple(s.split())

    # S → E + E, E → id. 만들 수 있는 문자열은 id + id 하나뿐이다.
    g = G("S -> E + E\nE -> id")
    assert language(g, "S", 8) == {T("id + id")}

    # BALANCED → ( BALANCED ) | ε 은 정확히 '( n개 뒤 ) n개'를 만든다.
    bal = G("B -> ( B ) | ε")
    assert language(bal, "B", 12) == {tuple("(" * n + ")" * n) for n in range(7)}

    # 상태 1~3개짜리 DFA를 모두 시험해도 길이 8 이하에서 이 언어를 맞게 가르는 것이 없다.
    for k in (1, 2, 3):
        assert not small_dfa_exists(k, 8)

    # STMT 규칙 두 개만으로는 끝나는 문장이 하나도 없다(재귀를 멈출 규칙이 없다).
    stmt = G("STMT -> if ( EXPR ) STMT else STMT | if ( EXPR ) STMT\nEXPR -> expr")
    assert language(stmt, "STMT", 15) == set()
    stmt2 = G("STMT -> if ( EXPR ) STMT else STMT | if ( EXPR ) STMT | other\nEXPR -> expr")
    assert T("if ( expr ) if ( expr ) other else other") in language(stmt2, "STMT", 11)

    # 산술식 문법. 문서의 다섯 예가 모두 나온다.
    arith = G("E -> E + E | E * E | ( E ) | id")
    L = language(arith, "E", 7)
    for s in ["id + id", "id * id", "( id )", "id + id * id", "( id + id ) * id"]:
        assert T(s) in L
    for s in ["id +", "( id", "id id", "+ id", "( )"]:
        assert T(s) not in L
    assert len(L) == 60

    # 함수 호출 문법.
    call = G("S -> id ( E ) | id ( )\nE -> id , E | id")
    L = language(call, "S", 8)
    for s in ["id ( id , id )", "id ( id )", "id ( )"]:
        assert T(s) in L
    for s in ["id ( id , )", "id ( , id )", "id id ( )"]:
        assert T(s) not in L
    # 인자가 k개면 길이가 2k + 2 (k ≥ 1), 인자가 없으면 3
    assert sorted(len(s) for s in L) == [3, 4, 6, 8]

    # while 문 문법. 조건은 '비교', '값 하나', '빈 것' 세 꼴이라 문자열이 4 + 2 + 1 = 7개다.
    wh = G("S -> while ( E )\nE -> T comparison T | T | ε\nT -> id | number")
    L = language(wh, "S", 10)
    assert len(L) == 7
    for s in ["while ( id comparison id )", "while ( id )", "while ( number )",
              "while ( number comparison number )", "while ( id comparison number )", "while ( )"]:
        assert T(s) in L
    assert T("while ( comparison id )") not in L

    # 카드 C3: 대괄호 목록 [ ], [ id ], [ id , id ], …
    lst = G("L -> [ ] | [ I ]\nI -> id , I | id")
    assert language(lst, "L", 7) == {T("[ ]"), T("[ id ]"), T("[ id , id ]"), T("[ id , id , id ]")}

    # 이산수학의 균형 괄호 세 규칙(ε, (s), st)을 그대로 옮긴 문법은 모든 균형 괄호를 만든다
    def balanced(s):
        depth = 0
        for ch in s:
            depth += 1 if ch == "(" else -1
            if depth < 0:
                return False
        return depth == 0
    from itertools import product
    dyck = {s for n in range(11) for s in product("()", repeat=n) if balanced(s)}
    full = G("B -> ( B ) | B B | ε")
    assert language(full, "B", 10) == dyck
    assert sorted(len([s for s in dyck if len(s) == 2 * k]) for k in range(6)) == [1, 1, 2, 5, 14, 42]
    # BALANCED → ( BALANCED ) | ε 은 그 가운데 겹치기만 한 것만 만든다: ()() 는 못 만든다
    assert tuple("()()") in dyck and tuple("()()") not in language(bal, "B", 10)
    assert language(bal, "B", 10) < dyck

    print("ALL CHECKS PASSED")
```
{% endraw %}
