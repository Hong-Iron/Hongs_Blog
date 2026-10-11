---
layout: "note"
title: "08_thompson-construction_impl.py"
display_title: "08_thompson-construction_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "08"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/thompson-construction/"
parent_title: "톰슨 구성법"
description: "컴파일러 · 톰슨 구성법 구현 코드"
permalink: "/studies/compilers/code/08_thompson-construction_impl/"
---
{% raw %}
[톰슨 구성법](/Hongs_Blog/studies/compilers/thompson-construction/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 톰슨 구성법: 정규 표현식 -> NFA (슬라이드 L03 p.18~27의 다섯 규칙 그대로)
# 실행: python3 08_thompson-construction_impl.py   (표준 라이브러리만 쓴다)
# 정규 표현식 표기: 글자 하나 = 기호, 'ε' = 빈 문자열, '|' 선택, 이어 쓰기 = 연결, '*' 반복, '+' 한 번 이상, 괄호.
# 상태 번호는 만든 순서대로 0부터 붙인다(슬라이드 그림에는 상태 이름이 없다).
import itertools
import random
import re

EPS = None  # ε-전이의 라벨


# ---------- 1. 정규 표현식을 트리로 읽는다 ----------
def parse(src):
    """우선순위: * + > 연결 > |  (슬라이드 L02 p.20)"""
    pos = 0

    def peek():
        return src[pos] if pos < len(src) else None

    def alt():
        nonlocal pos
        node = cat()
        while peek() == "|":
            pos += 1
            node = ("alt", node, cat())
        return node

    def cat():
        node = rep()
        while peek() is not None and peek() not in "|)":
            node = ("cat", node, rep())
        return node

    def rep():
        nonlocal pos
        node = atom()
        while peek() in ("*", "+"):
            node = ("star", node) if peek() == "*" else ("plus", node)
            pos += 1
        return node

    def atom():
        nonlocal pos
        c = peek()
        pos += 1
        if c == "(":
            node = alt()
            assert peek() == ")", "닫는 괄호가 없다"
            pos += 1
            return node
        if c == "ε":
            return ("eps",)
        return ("sym", c)

    tree = alt()
    assert pos == len(src), "읽다 남은 글자가 있다"
    return tree


# ---------- 2. 톰슨 구성법 ----------
class NFA:
    def __init__(self):
        self.n = 0            # 상태 수
        self.edges = []       # (출발, 라벨, 도착)
        self.start = None
        self.accept = None

    def new(self):
        self.n += 1
        return self.n - 1

    def add(self, p, label, q):
        self.edges.append((p, label, q))


def build(tree, nfa, plus_as_star_without_skip=False):
    """부분식 하나의 (시작 상태, 끝 상태)를 돌려준다."""
    kind = tree[0]
    if kind == "eps":                      # p.18: 시작 --ε--> 끝
        s, f = nfa.new(), nfa.new()
        nfa.add(s, EPS, f)
        return s, f
    if kind == "sym":                      # p.18: 시작 --a--> 끝
        s, f = nfa.new(), nfa.new()
        nfa.add(s, tree[1], f)
        return s, f
    if kind == "cat":                      # p.19: r1의 끝 --ε--> r2의 시작
        s1, f1 = build(tree[1], nfa, plus_as_star_without_skip)
        s2, f2 = build(tree[2], nfa, plus_as_star_without_skip)
        nfa.add(f1, EPS, s2)
        return s1, f2
    if kind == "alt":                      # p.20: 새 시작에서 두 갈래, 두 끝에서 새 끝으로
        s = nfa.new()
        s1, f1 = build(tree[1], nfa, plus_as_star_without_skip)
        s2, f2 = build(tree[2], nfa, plus_as_star_without_skip)
        f = nfa.new()
        nfa.add(s, EPS, s1)
        nfa.add(s, EPS, s2)
        nfa.add(f1, EPS, f)
        nfa.add(f2, EPS, f)
        return s, f
    if kind == "star":                     # p.21: 건너뛰는 길, 되돌아가는 길
        s = nfa.new()
        s1, f1 = build(tree[1], nfa, plus_as_star_without_skip)
        f = nfa.new()
        nfa.add(s, EPS, s1)
        nfa.add(s, EPS, f)                 # 0번: 건너뛴다
        nfa.add(f1, EPS, s1)               # 한 번 더
        nfa.add(f1, EPS, f)
        return s, f
    if kind == "plus":
        if plus_as_star_without_skip:      # p.22의 물음: * 그림에서 건너뛰는 길만 뺀다
            s = nfa.new()
            s1, f1 = build(tree[1], nfa, plus_as_star_without_skip)
            f = nfa.new()
            nfa.add(s, EPS, s1)
            nfa.add(f1, EPS, s1)
            nfa.add(f1, EPS, f)
            return s, f
        return build(("cat", tree[1], ("star", tree[1])), nfa)   # r+ = r r*
    raise ValueError(kind)


def thompson(src, **kw):
    nfa = NFA()
    nfa.start, nfa.accept = build(parse(src), nfa, **kw)
    return nfa


# ---------- 3. NFA를 돌린다 ----------
def closure(nfa, states):
    stack, seen = list(states), set(states)
    while stack:
        p = stack.pop()
        for (a, label, b) in nfa.edges:
            if a == p and label is EPS and b not in seen:
                seen.add(b)
                stack.append(b)
    return seen


def accepts(nfa, text):
    cur = closure(nfa, {nfa.start})
    for ch in text:
        cur = closure(nfa, {b for (a, label, b) in nfa.edges if a in cur and label == ch})
    return nfa.accept in cur


# ---------- 4. 파이썬 re로 같은 식을 만들어 견준다 ----------
def to_re(tree):
    kind = tree[0]
    if kind == "eps":
        return "(?:)"
    if kind == "sym":
        return re.escape(tree[1])
    if kind == "cat":
        return to_re(tree[1]) + to_re(tree[2])
    if kind == "alt":
        return "(?:" + to_re(tree[1]) + "|" + to_re(tree[2]) + ")"
    if kind == "star":
        return "(?:" + to_re(tree[1]) + ")*"
    if kind == "plus":
        return "(?:" + to_re(tree[1]) + ")+"


def all_strings(alphabet, max_len):
    for k in range(max_len + 1):
        for tup in itertools.product(alphabet, repeat=k):
            yield "".join(tup)


def same_language(nfa, src, alphabet, max_len):
    pat = re.compile(to_re(parse(src)))
    return all(accepts(nfa, s) == bool(pat.fullmatch(s)) for s in all_strings(alphabet, max_len))


def count(tree, kind):
    return (1 if tree[0] == kind else 0) + sum(count(t, kind) for t in tree[1:] if isinstance(t, tuple))


def random_regex(rng, depth):
    if depth == 0 or rng.random() < 0.25:
        return rng.choice(["a", "b", "ε"])
    k = rng.choice(["cat", "alt", "star"])
    if k == "star":
        return "(" + random_regex(rng, depth - 1) + ")*"
    op = "" if k == "cat" else "|"
    return "(" + random_regex(rng, depth - 1) + op + random_regex(rng, depth - 1) + ")"


if __name__ == "__main__":
    # (1) 슬라이드 p.23~27의 예 (a|b)*c: 상태 10개, ε-화살표 9개, 글자 화살표 3개
    n = thompson("(a|b)*c")
    eps = [e for e in n.edges if e[1] is EPS]
    sym = [e for e in n.edges if e[1] is not EPS]
    assert n.n == 10 and len(eps) == 9 and len(sym) == 3
    assert same_language(n, "(a|b)*c", "abc", 6)
    # 문서의 그림과 추적 표가 쓰는 번호
    assert (n.start, n.accept) == (0, 9)
    assert sorted(n.edges, key=str) == sorted([
        (0, EPS, 1), (0, EPS, 7), (1, EPS, 2), (1, EPS, 4), (2, "a", 3), (4, "b", 5),
        (3, EPS, 6), (5, EPS, 6), (6, EPS, 1), (6, EPS, 7), (7, EPS, 8), (8, "c", 9)], key=str)
    assert closure(n, {0}) == {0, 1, 2, 4, 7, 8}
    assert accepts(n, "abc") and accepts(n, "c") and not accepts(n, "ab") and not accepts(n, "ca")
    # 문서의 추적: "bc"
    c0 = closure(n, {0})
    c1 = closure(n, {b for (a, l, b) in n.edges if a in c0 and l == "b"})
    c2 = closure(n, {b for (a, l, b) in n.edges if a in c1 and l == "c"})
    assert c1 == {1, 2, 4, 5, 6, 7, 8} and c2 == {9}

    # (2) 슬라이드 p.30의 (a|b)a는 상태 8개(A~H), p.35의 letter(digit|letter)*는 10개(A~J)
    assert thompson("(a|b)a").n == 8
    ident = thompson("L(D|L)*")            # L = letter, D = digit
    assert ident.n == 10 and same_language(ident, "L(D|L)*", "LD", 7)

    # (3) 조각별 그림: 상태 수
    assert thompson("ε").n == 2 and thompson("a").n == 2
    assert thompson("ab").n == 4 and thompson("a|b").n == 6 and thompson("a*").n == 4
    # 카드: a*|b = 2 + 2(별) + 2(b) + 2(선택) = 8,  (ab)* = 6,  a|b|c = 10
    assert thompson("a*|b").n == 8 and thompson("(ab)*").n == 6 and thompson("a|b|c").n == 10
    assert thompson("ab*").n == 6 and len(thompson("ab*").edges) == 7

    # (4) p.22의 물음: r+ 는 * 그림에서 건너뛰는 화살표만 빼면 된다. r r* 와 같은 언어다.
    for src in ["a+", "(a|b)+", "(ab)+", "(a*)+", "(a|ε)+b"]:
        via_cat = thompson(src)
        via_cut = thompson(src, plus_as_star_without_skip=True)
        assert all(accepts(via_cat, s) == accepts(via_cut, s) for s in all_strings("ab", 6))
        assert same_language(via_cut, src, "ab", 6)
        assert via_cut.n < via_cat.n       # 조각을 한 번만 그리므로 더 작다

    # (5) 무작위 정규 표현식 400개: 같은 언어, 상태 수 공식, 모양의 세 성질
    rng = random.Random(8)
    for _ in range(400):
        src = random_regex(rng, 3)
        tree = parse(src)
        nfa = thompson(src)
        assert same_language(nfa, src, "ab", 5), src
        leaves = count(tree, "sym") + count(tree, "eps")
        assert nfa.n == 2 * (leaves + count(tree, "alt") + count(tree, "star")), src
        out = {p: 0 for p in range(nfa.n)}
        for (a, _, b) in nfa.edges:
            out[a] += 1
            assert b != nfa.start          # 시작 상태로 들어오는 화살표가 없다
        assert out[nfa.accept] == 0        # 끝 상태에서 나가는 화살표가 없다
        assert max(out.values()) <= 2      # 한 상태에서 나가는 화살표는 많아야 둘
    print("ALL CHECKS PASSED")
```
{% endraw %}
