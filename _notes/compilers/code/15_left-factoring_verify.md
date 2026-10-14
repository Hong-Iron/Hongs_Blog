---
layout: "note"
title: "15_left-factoring_verify.py"
display_title: "15_left-factoring_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/left-factoring/"
parent_title: "좌인수분해"
description: "컴파일러 · 좌인수분해 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/15_left-factoring_verify/"
---
{% raw %}
[좌인수분해](/Hongs_Blog/studies/compilers/left-factoring/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""좌인수분해 문서의 예를 확인한다: 슬라이드의 네 단계 절차, 변환 전후 언어 비교.

실행: python3 15_left-factoring_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
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


def common_prefix(seqs):
    out = []
    for col in zip(*seqs):
        if len(set(col)) != 1:
            break
        out.append(col[0])
    return tuple(out)


def left_factor(g):
    """같은 기호로 시작하는 규칙이 둘 이상 남지 않을 때까지 슬라이드의 1~3단계를 되풀이한다."""
    g = {A: list(ps) for A, ps in g.items()}
    again = True
    while again:
        again = False
        for A in list(g):
            groups = {}
            for p in g[A]:
                if p:
                    groups.setdefault(p[0], []).append(p)
            for head, group in groups.items():
                if len(group) < 2:
                    continue
                alpha = common_prefix(group)              # 1단계: 가장 긴 공통 앞부분
                new = A + "'"
                while new in g:
                    new += "'"
                pos = g[A].index(group[0])
                g[A] = [p for p in g[A][:pos] if p not in group] + [alpha + (new,)] + \
                       [p for p in g[A][pos:] if p not in group]   # 2단계: A → α A'
                # 3단계: A' → β 들. 새 비단말은 A 바로 뒤에 넣는다.
                items = list(g.items())
                k = [x for x, _ in items].index(A)
                items.insert(k + 1, (new, [p[len(alpha):] for p in group]))
                g = dict(items)
                again = True
                break
            if again:
                break
    return g


def needs_factoring(g):
    return {A for A, ps in g.items() if len({p[0] for p in ps if p}) < len([p for p in ps if p])}


if __name__ == "__main__":
    # p.44~45: E → T + E | T, T → F * T | F, F → (E) | id
    g = G("E -> T + E | T\nT -> F * T | F\nF -> ( E ) | id")
    assert needs_factoring(g) == {"E", "T"}
    h = left_factor(g)
    assert show(h) == {"E": ["T E'"], "E'": ["+ E", "ε"], "T": ["F T'"], "T'": ["* T", "ε"], "F": ["( E )", "id"]}
    assert needs_factoring(h) == set()
    assert language(g, "E", 9) == language(h, "E", 9)

    # 공통 앞부분은 '가장 긴 것'을 뽑는다: A → a b c | a b d | e  ⇒  A → a b A' | e, A' → c | d
    g2 = G("A -> a b c | a b d | e")
    h2 = left_factor(g2)
    assert show(h2) == {"A": ["a b A'", "e"], "A'": ["c", "d"]}
    assert language(g2, "A", 5) == language(h2, "A", 5)

    # 한 번으로 끝나지 않는 경우(4단계: 되풀이): A → a b c | a b d | a e
    g3 = G("A -> a b c | a b d | a e")
    h3 = left_factor(g3)
    assert show(h3) == {"A": ["a A'"], "A'": ["b A''", "e"], "A''": ["c", "d"]}
    assert language(g3, "A", 5) == language(h3, "A", 5)

    # p.47의 연습: 우재귀로 고친 DECL 문법을 좌인수분해한다.
    d = G("DECL -> type id ; DECL | type id = id ; DECL | ε")
    hd = left_factor(d)
    assert show(hd) == {"DECL": ["type id DECL'", "ε"], "DECL'": ["; DECL", "= id ; DECL"]}
    orig = G("DECL -> DECL type id ; | DECL type id = id ; | ε")
    assert language(orig, "DECL", 12) == language(d, "DECL", 12) == language(hd, "DECL", 12)

    # 매달린 else: S → if E then S | if E then S else S | other
    de = left_factor(G("S -> i E t S | i E t S e S | a\nE -> b"))
    assert show(de) == {"S": ["i E t S S'", "a"], "S'": ["ε", "e S"], "E": ["b"]}

    # 카드 C1: S → id | id ( ) | id ( L )
    c1 = left_factor(G("S -> id | id ( ) | id ( L )\nL -> x"))
    assert show(c1) == {"S": ["id S'"], "S'": ["ε", "( S''"], "S''": [")", "L )"], "L": ["x"]}

    print("ALL CHECKS PASSED")
```
{% endraw %}
