---
layout: "note"
title: "14_left-recursion-elimination_verify.py"
display_title: "14_left-recursion-elimination_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/left-recursion-elimination/"
parent_title: "좌재귀 없애기"
description: "컴파일러 · 좌재귀 없애기 검증 코드"
permalink: "/studies/compilers/code/14_left-recursion-elimination_verify/"
---
{% raw %}
[좌재귀 없애기](/Hongs_Blog/studies/compilers/left-recursion-elimination/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""좌재귀 없애기 문서의 예를 확인한다: 슬라이드의 변환, 변환 전후 언어 비교, 간접 좌재귀, 좌재귀에서 재귀 하강이 끝나지 않는 것.

실행: python3 14_left-recursion-elimination_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def eliminate_immediate(g, S, new):
    """S → S α1 | … | S αm | β1 | … | βn 을 S → β1 new | …, new → α1 new | … | ε 으로 고친다."""
    alphas = [p[1:] for p in g[S] if p and p[0] == S]
    betas = [p for p in g[S] if not (p and p[0] == S)]
    if not alphas:
        return dict(g)
    out = {}
    for A, prods in g.items():
        if A == S:
            out[S] = [b + (new,) for b in betas]
            out[new] = [a + (new,) for a in alphas] + [()]
        else:
            out[A] = list(prods)
    return out


def nullable_set(g):
    nul = set()
    changed = True
    while changed:
        changed = False
        for A, prods in g.items():
            if A not in nul and any(all(s in nul for s in p) for p in prods):
                nul.add(A)
                changed = True
    return nul


def left_recursive(g):
    """A ⇒+ A α 인 비단말 A들. '맨 왼쪽에 올 수 있다' 관계를 끝까지 따라가 자기 자신으로 돌아오는지 본다."""
    nul = nullable_set(g)
    edge = {A: set() for A in g}
    for A, prods in g.items():
        for p in prods:
            for s in p:
                if s in g:
                    edge[A].add(s)
                if s not in nul:
                    break
    out = set()
    for A in g:
        seen, todo = set(), list(edge[A])
        while todo:
            x = todo.pop()
            if x not in seen:
                seen.add(x)
                todo.extend(edge[x])
        if A in seen:
            out.add(A)
    return out


def naive_descent_depth(g, start, limit=200):
    """맨 왼쪽 비단말을 첫 규칙으로만 바꿔 갈 때, 입력을 한 글자도 못 읽은 채 몇 번 내려가는가."""
    depth, sym = 0, start
    while sym in g and depth < limit:
        p = g[sym][0]
        if not p or p[0] not in g:
            break
        sym = p[0]
        depth += 1
    return depth


if __name__ == "__main__":
    # p.43: S → Sa | b  ⇒  S → bA, A → aA | ε
    g = G("S -> S a | b")
    h = eliminate_immediate(g, "S", "A")
    assert show(h) == {"S": ["b A"], "A": ["a A", "ε"]}
    assert language(g, "S", 9) == language(h, "S", 9) == {("b",) + ("a",) * k for k in range(9)}
    assert left_recursive(g) == {"S"} and left_recursive(h) == set()

    # p.42: 좌재귀 문법에서 첫 규칙만 따라 내려가면 입력을 읽지 못한 채 끝없이 내려간다.
    assert naive_descent_depth(g, "S") == 200
    assert naive_descent_depth(h, "S") == 0

    # p.43 일반 꼴: α 둘, β 둘
    g2 = G("S -> S a | S b c | d | e f")
    h2 = eliminate_immediate(g2, "S", "A")
    assert show(h2) == {"S": ["d A", "e f A"], "A": ["a A", "b c A", "ε"]}
    assert language(g2, "S", 8) == language(h2, "S", 8)

    # 산술식: E → E + T | T
    g3 = G("E -> E + T | T\nT -> id")
    h3 = eliminate_immediate(g3, "E", "E'")
    assert show(h3) == {"E": ["T E'"], "E'": ["+ T E'", "ε"], "T": ["id"]}
    assert language(g3, "E", 9) == language(h3, "E", 9)

    # p.42의 질문: S → Aa | b, A → Sb 는 좌재귀인가? S ⇒ Aa ⇒ Sba 라서 그렇다(간접 좌재귀).
    g4 = G("S -> A a | b\nA -> S b")
    assert left_recursive(g4) == {"S", "A"}
    # A를 S의 규칙에 넣어 직접 좌재귀로 만든 뒤 같은 방법으로 없앤다.
    g4b = G("S -> S b a | b")
    assert language(g4, "S", 9) == language(g4b, "S", 9)
    h4 = eliminate_immediate(g4b, "S", "S'")
    assert show(h4) == {"S": ["b S'"], "S'": ["b a S'", "ε"]}
    assert language(g4, "S", 9) == language(h4, "S", 9) and left_recursive(h4) == set()

    # 우재귀는 좌재귀가 아니다
    assert left_recursive(G("E -> T + E | T\nT -> F * T | F\nF -> ( E ) | id")) == set()
    # 빈 문자열이 될 수 있는 기호 뒤에 숨은 좌재귀도 잡는다: S → B S c | d, B → ε | b
    assert left_recursive(G("S -> B S c | d\nB -> ε | b")) == {"S"}

    # 카드: L → L , id | id  /  A → Bc | d, B → Ae  /  A → Ab | Ac | d
    c1 = eliminate_immediate(G("L -> L , id | id"), "L", "L'")
    assert show(c1) == {"L": ["id L'"], "L'": [", id L'", "ε"]}
    assert left_recursive(G("A -> B c | d\nB -> A e")) == {"A", "B"}
    assert left_recursive(G("S -> a S b | ε")) == set()
    c3 = eliminate_immediate(G("A -> A b | A c | d"), "A", "A'")
    assert show(c3) == {"A": ["d A'"], "A'": ["b A'", "c A'", "ε"]}

    print("ALL CHECKS PASSED")
```
{% endraw %}
