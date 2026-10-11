---
layout: "note"
title: "16_abstract-syntax-tree_impl.py"
display_title: "16_abstract-syntax-tree_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "16"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/abstract-syntax-tree/"
parent_title: "추상 구문 트리"
description: "컴파일러 · 추상 구문 트리 구현 코드"
permalink: "/studies/compilers/code/16_abstract-syntax-tree_impl/"
---
{% raw %}
[추상 구문 트리](/Hongs_Blog/studies/compilers/abstract-syntax-tree/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""추상 구문 트리 문서의 예를 확인한다: 의미 동작으로 AST 만들기, 파스 트리에서 세 가지 노드를 지우는 방법과 같은 결과인지, while 문 예.

실행: python3 16_abstract-syntax-tree_impl.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def min_len(g):
    """비단말마다 만들 수 있는 가장 짧은 문자열의 길이."""
    INF = 10 ** 9
    m = {A: INF for A in g}
    changed = True
    while changed:
        changed = False
        for A, prods in g.items():
            for p in prods:
                t = sum(m[s] if s in g else 1 for s in p)
                if t < m[A]:
                    m[A] = t
                    changed = True
    return m


def parse_trees(g, start, tokens):
    """tokens의 파스 트리를 모두 돌려준다. 비단말 노드는 (이름, 자식...), 단말은 문자열."""
    tokens = tuple(tokens)
    m = min_len(g)
    memo = {}

    def sym(s, i, j):
        if s not in g:
            return [s] if j == i + 1 and tokens[i] == s else []
        key = (s, i, j)
        if key in memo:
            return memo[key]
        memo[key] = []
        out = []
        for p in g[s]:
            for kids in seq(p, i, j):
                out.append((s,) + kids)
        memo[key] = out
        return out

    def seq(p, i, j):
        if not p:
            return [()] if i == j else []
        first_min = m[p[0]] if p[0] in g else 1
        rest_min = sum(m[x] if x in g else 1 for x in p[1:])
        out = []
        for k in range(i + first_min, j - rest_min + 1):
            heads = sym(p[0], i, k)
            if heads:
                for tail in seq(p[1:], k, j):
                    for h in heads:
                        out.append((h,) + tail)
        return out

    return sym(start, 0, len(tokens))


def leaves(t):
    """트리의 잎을 왼쪽부터 읽는다."""
    if isinstance(t, str):
        return [t]
    return [x for c in t[1:] for x in leaves(c)]


def bracket(t):
    """트리를 한 줄 글로 적는다. 예: E[E[id] + E[id]]"""
    if isinstance(t, str):
        return t
    return t[0] + "[" + " ".join(bracket(c) for c in t[1:]) + "]" if len(t) > 1 else t[0] + "[ε]"


def ast_expr(tree, lexemes):
    """p.55의 의미 동작을 그대로 따른다. lexemes는 id 토큰들의 실제 이름(왼쪽부터)."""
    names = iter(lexemes)

    def go(t):
        kids = t[1:]
        if len(kids) == 3 and kids[1] in ("+", "*"):      # E → E1 + E2, E → E1 * E2
            left = go(kids[0])
            right = go(kids[2])
            return (kids[1], left, right)                  # new Node(op, E1.node, E2.node)
        if len(kids) == 3 and kids[0] == "(":              # E → ( E1 ): E.node = E1.node
            return go(kids[1])
        if len(kids) == 1 and kids[0] == "id":             # E → id: new Leaf(id, id.value)
            return ("id", next(names))
        if len(kids) == 1:                                 # E → T 같은 단위 규칙: 자식 것을 그대로
            return go(kids[0])
        raise ValueError(t)

    return go(tree)


def prune(tree, lexemes):
    """p.51~53의 세 단계로 파스 트리를 줄인다. 의미 동작으로 만든 것과 같은 결과여야 한다."""
    names = iter(lexemes)

    def step1(t):                                          # 자식이 하나뿐인 노드를 자식으로 바꾼다
        if isinstance(t, str):
            return ("id", next(names)) if t == "id" else t
        kids = [step1(c) for c in t[1:]]
        return kids[0] if len(kids) == 1 else (t[0],) + tuple(kids)

    def is_leaf(t):
        return isinstance(t, str) or t[0] == "id"

    def step2(t):                                          # 괄호 같은 문법 기호를 지운다
        if is_leaf(t):
            return t
        kids = [step2(c) for c in t[1:] if c not in ("(", ")")]
        return kids[0] if len(kids) == 1 else (t[0],) + tuple(kids)

    def step3(t):                                          # 연산자를 부모 자리로 올린다
        if is_leaf(t):
            return t
        left, op, right = t[1:]
        return (op, step3(left), step3(right))

    return step3(step2(step1(tree)))


def count_nodes(t):
    if isinstance(t, str):
        return 1
    if t[0] == "id" and isinstance(t[1], str) and len(t) == 2 and t[1] != "id":
        return 1
    return 1 + sum(count_nodes(c) for c in t[1:])


def infix(a):
    """AST를 괄호를 모두 친 식으로 되돌린다."""
    if a[0] == "id":
        return a[1]
    return "(" + infix(a[1]) + " " + a[0] + " " + infix(a[2]) + ")"


def postorder(a):
    """AST를 자식 먼저, 부모 나중 순서로 읽는다."""
    if a[0] == "id":
        return [a[1]]
    return postorder(a[1]) + postorder(a[2]) + [a[0]]


def ast_while(tokens, lexemes):
    """p.60: S → while ( C ) { B }, C → id comp id, B → type id ; | id ( ) ;"""
    g = G("S -> while ( C ) { B }\nC -> id comp id\nB -> type id ; | id ( ) ;")
    (tree,) = parse_trees(g, "S", tokens)
    lex = iter(lexemes)
    c = tree[3]
    id1, comp, id2 = next(lex), next(lex), next(lex)
    cnode = ("cond", ("comp", comp, ("id", id1), ("id", id2)))
    b = tree[6]
    if b[1] == "type":
        ty, name = next(lex), next(lex)
        bnode = ("block", ("declaration", ("type", ty), ("id", name)))
    else:
        bnode = ("block", ("call", ("id", next(lex))))
    assert c[0] == "C" and b[0] == "B"
    return ("while", cnode, bnode)


if __name__ == "__main__":
    g = G("E -> E + E | E * E | ( E ) | id")

    # p.49~53, 56~59: (A + B) * C
    toks = "( id + id ) * id".split()
    trees = parse_trees(g, "E", toks)
    assert len(trees) == 1
    tree = trees[0]
    assert bracket(tree) == "E[E[( E[E[id] + E[id]] )] * E[id]]"
    a = ast_expr(tree, "ABC")
    assert a == ("*", ("+", ("id", "A"), ("id", "B")), ("id", "C"))
    assert prune(tree, "ABC") == a
    # 파스 트리는 노드 13개, AST는 5개
    assert count_nodes(tree) == 13 and count_nodes(a) == 5
    assert infix(a) == "((A + B) * C)" and postorder(a) == ["A", "B", "+", "C", "*"]

    # p.54: 제목의 (id * id) + id 라면 뿌리가 + 여야 한다. 그림(뿌리가 *)은 (id + id) * id 의 AST다.
    t2 = parse_trees(g, "E", "( id * id ) + id".split())[0]
    a2 = ast_expr(t2, "ABC")
    assert a2 == ("+", ("*", ("id", "A"), ("id", "B")), ("id", "C"))
    assert a2 != a and a[0] == "*" and a2[0] == "+"

    # 모호하지 않은 문법(E → T + E | T ...)의 파스 트리에서도 같은 AST가 나온다
    g2 = G("E -> T + E | T\nT -> F * T | F\nF -> ( E ) | id")
    t3 = parse_trees(g2, "E", toks)[0]
    assert ast_expr(t3, "ABC") == a
    assert count_nodes(t3) == 18
    # id * id + id: 문법이 * 를 먼저 묶으므로 뿌리가 +
    t4 = parse_trees(g2, "E", "id * id + id".split())[0]
    assert ast_expr(t4, "ABC") == ("+", ("*", ("id", "A"), ("id", "B")), ("id", "C"))

    # 11회 p.8~9: id * id (A, B)
    t5 = parse_trees(g, "E", "id * id".split())[0]
    assert ast_expr(t5, "AB") == ("*", ("id", "A"), ("id", "B"))

    # p.60: while (leftVar < rightVar) { int a; }
    w = ast_while("while ( id comp id ) { type id ; }".split(), ["leftVar", "<", "rightVar", "int", "a"])
    assert w == ("while",
                 ("cond", ("comp", "<", ("id", "leftVar"), ("id", "rightVar"))),
                 ("block", ("declaration", ("type", "int"), ("id", "a"))))
    w2 = ast_while("while ( id comp id ) { id ( ) ; }".split(), ["i", "<", "n", "step"])
    assert w2[2] == ("block", ("call", ("id", "step")))

    print("ALL CHECKS PASSED")
```
{% endraw %}
