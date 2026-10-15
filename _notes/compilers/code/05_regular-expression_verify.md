---
layout: "note"
title: "05_regular-expression_verify.py"
display_title: "05_regular-expression_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/regular-expression/"
parent_title: "정규 표현식"
description: "컴파일러 · 정규 표현식 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/05_regular-expression_verify/"
---
{% raw %}
[정규 표현식](/Hongs_Blog/studies/compilers/regular-expression/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 정규 표현식: 기본 다섯 식의 뜻을 집합 연산으로 직접 계산해, 문서의 규칙과 예를 확인한다
# 실행: python3 05_regular-expression_verify.py   (표준 라이브러리만 쓴다)
# 표기: 글자 하나 = 기호, 'ε', '|', 이어 쓰기, '*', '+', 괄호. 언어는 길이 N 이하의 문자열만 모아 견준다.
import itertools
import random
import re

N = 6


def parse(src):
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
            node = ("star", node) if peek() == "*" else ("cat", node, ("star", node))   # r+ = r r*
            pos += 1
        return node

    def atom():
        nonlocal pos
        c = peek()
        pos += 1
        if c == "(":
            node = alt()
            assert peek() == ")"
            pos += 1
            return node
        return ("eps",) if c == "ε" else ("sym", c)

    tree = alt()
    assert pos == len(src)
    return tree


def lang(tree):
    """L(r)에서 길이 N 이하인 문자열의 집합. 기본 다섯 식의 표를 그대로 옮긴 것이다."""
    kind = tree[0]
    if kind == "eps":
        return {""}
    if kind == "sym":
        return {tree[1]}
    if kind == "alt":
        return lang(tree[1]) | lang(tree[2])
    if kind == "cat":
        return {s1 + s2 for s1 in lang(tree[1]) for s2 in lang(tree[2]) if len(s1 + s2) <= N}
    if kind == "star":
        base, out, frontier = lang(tree[1]), {""}, {""}
        while frontier:
            frontier = {s1 + s2 for s1 in frontier for s2 in base if len(s1 + s2) <= N} - out
            out |= frontier
        return out


def L(src):
    return lang(parse(src))


def all_strings(alphabet, max_len):
    return {"".join(t) for k in range(max_len + 1) for t in itertools.product(alphabet, repeat=k)}


def py(pattern, alphabet):
    """파이썬 re가 통째로 맞다고 하는, 길이 N 이하의 문자열."""
    return {s for s in all_strings(alphabet, N) if re.fullmatch(pattern, s)}


def random_regex(rng, depth):
    if depth == 0 or rng.random() < 0.3:
        return rng.choice(["a", "b", "ε"])
    k = rng.choice(["cat", "alt", "star"])
    if k == "star":
        return "(" + random_regex(rng, depth - 1) + ")*"
    return "(" + random_regex(rng, depth - 1) + ("" if k == "cat" else "|") + random_regex(rng, depth - 1) + ")"


if __name__ == "__main__":
    # 기본 다섯 식
    assert L("ε") == {""} and L("a") == {"a"} and L("a|b") == {"a", "b"} and L("ab") == {"ab"}
    assert L("a*") == {"a" * i for i in range(N + 1)}
    # a+ = aa*
    assert L("a+") == L("aa*") == {"a" * i for i in range(1, N + 1)}
    # 우선순위  (r1)|((r2)*(r3)) = r1|r2*r3
    assert L("(a)|((b)*(c))") == L("a|b*c") == {"a"} | {"b" * i + "c" for i in range(N)}
    assert L("a|b*c") != L("(a|b)*c") and L("a|b*c") != L("a|(bc)*")
    assert "bbc" in L("a|b*c") and "abc" not in L("a|b*c") and "abc" in L("(a|b)*c")
    # 대수 법칙. 무작위 식 300조에 대해 길이 N 이하에서 언어가 같은지 본다
    rng = random.Random(5)
    for _ in range(300):
        r1, r2, r3 = (random_regex(rng, 2) for _ in range(3))
        assert L(f"{r1}|{r2}") == L(f"{r2}|{r1}")                               # 교환
        assert L(f"{r1}|({r2}|{r3})") == L(f"({r1}|{r2})|{r3}")                 # 결합
        assert L(f"{r1}({r2}{r3})") == L(f"({r1}{r2}){r3}")                     # 결합
        assert L(f"{r1}({r2}|{r3})") == L(f"{r1}{r2}|{r1}{r3}")                 # 분배
        assert L(f"{r1}ε") == L(f"ε{r1}") == L(r1)                              # ε은 항등원
        assert L(f"({r1})*") == L(f"({r1}|ε)*")                                 # 닫힘 안의 ε
        assert L(f"(({r1})*)*") == L(f"({r1})*")                                # 멱등
        assert L(f"({r1})+") == L(f"{r1}({r1})*")
    # 연결은 순서를 바꾸면 달라진다 (교환 법칙이 표에 없는 까닭)
    assert L("ab") != L("ba")
    # | 는 연결 위로 분배되지 않는다:  a|(bc) ≠ (a|b)(a|c)
    assert L("a|bc") != L("(a|b)(a|c)")

    # 토큰 예. l = 글자, d = 숫자, u = 밑줄, p = 점, m = 빼기, q = 더하기, E = 지수 표시
    integer = "dd*"                                        # 예 4의 답(보충): digit+
    assert L(integer) == L("d+") == py("d+", "d")
    identifier = "(l|u)(l|d|u)*"                           # 예 5의 답(보충)
    assert L(identifier) == {s for s in all_strings("ldu", N) if s and s[0] != "d"}
    flt = "(m|ε)dd*pdd*(ε|E(q|m|ε)dd*)"                    # 예 6의 답(보충)
    assert L(flt) == py("m?d+pd+(E[qm]?d+)?", "mdpEq")
    # 문서의 실수 예 일곱 개를 실제 글자로 확인한다
    real = re.compile(r"(-|)[0-9][0-9]*\.[0-9][0-9]*(|E(\+|-|)[0-9][0-9]*)")
    for s in ["0.5", "3.14", "-6.111", "1.0E+3", "100.0", "-10.53E-1", "9.123E3"]:
        assert real.fullmatch(s), s
    for s in ["5", ".5", "5.", "1.0E", "--1.0", "1.0e3", "1.0E+-3"]:
        assert not real.fullmatch(s), s
    ident = re.compile(r"([A-Za-z]|_)([A-Za-z]|[0-9]|_)*")
    for s in ["aaa", "i", "funcAtoB", "_var", "main", "variable123"]:
        assert ident.fullmatch(s)
    assert not ident.fullmatch("1abc") and not ident.fullmatch("")
    # Whitespace = (빈칸|\t|\n)+
    ws = re.compile("( |\t|\n)( |\t|\n)*")
    assert all(ws.fullmatch(s) for s in [" ", "\t", "\n", "\t\t", " \n\t"]) and not ws.fullmatch("")

    # 실전 표기가 기본 다섯 식으로 풀린다 (알파벳 {a, b, c})
    assert py("a?", "abc") == L("a|ε")
    assert py("a+", "abc") == L("aa*")
    assert py("[abc]", "abc") == L("a|b|c")
    assert py(".", "abc") == L("a|b|c")
    assert py("a{2,}", "abc") == L("aaa*")
    assert py("a{3}", "abc") == L("aaa")
    assert py("[^a]", "abc") == L("b|c")
    assert py("(ab)?c+", "abc") == L("(ab|ε)cc*")

    # 카드 값
    assert sorted(L("(a|b)(a|b)")) == ["aa", "ab", "ba", "bb"]
    assert L("(a|b)*") == all_strings("ab", N)
    assert L("a*b*") != L("(ab)*") and "aab" in L("a*b*") and "abab" not in L("a*b*") and "abab" in L("(ab)*")
    assert L("(a*b*)*") == L("(a|b)*")
    assert L("ab|c*") == {"ab"} | {"c" * i for i in range(N + 1)}
    # 괄호 짝 (^n )^n : 'x' = 여는 괄호, 'y' = 닫는 괄호. 그럴듯한 후보 x*y* 는 짝이 안 맞는 것도 받아들인다
    assert "xxy" in L("x*y*") and "xy" in L("x*y*")
    assert L("(xy)*") != {"x" * i + "y" * i for i in range(N // 2 + 1)}
    print("ALL CHECKS PASSED")
```
{% endraw %}
