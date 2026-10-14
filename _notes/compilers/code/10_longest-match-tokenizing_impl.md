---
layout: "note"
title: "10_longest-match-tokenizing_impl.py"
display_title: "10_longest-match-tokenizing_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "10"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/longest-match-tokenizing/"
parent_title: "최장 일치와 토큰 인식"
description: "컴파일러 · 최장 일치와 토큰 인식 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/10_longest-match-tokenizing_impl/"
---
{% raw %}
[최장 일치와 토큰 인식](/Hongs_Blog/studies/compilers/longest-match-tokenizing/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 최장 일치와 토큰 인식 (슬라이드 L02 p.26~30의 의사코드, L03 p.37~43의 표 추적)
# 실행: python3 10_longest-match-tokenizing_impl.py   (표준 라이브러리만 쓴다)
# 의사코드는 1부터 세지만(a_1 ... a_n) 이 코드는 0부터 센다. mIdx는 "잘라 낼 글자 수"로 같은 뜻이다.
import random
import re

# 슬라이드 p.38의 전이 표. Merged = sIdentifier | lparen
TABLE = {
    ("T0", "letter"): "T1", ("T0", "("): "T4",
    ("T1", "letter"): "T2", ("T1", "digit"): "T3",
    ("T2", "letter"): "T2", ("T2", "digit"): "T3",
    ("T3", "letter"): "T2", ("T3", "digit"): "T3",
}
TOKEN_OF = {"T1": "sIdentifier", "T2": "sIdentifier", "T3": "sIdentifier", "T4": "lparen"}


def kind(ch):
    if ch.isascii() and ch.isalpha():
        return "letter"
    if ch.isascii() and ch.isdigit():
        return "digit"
    return ch


def scan_one(table, token_of, text, start, classify=kind):
    """start부터 표를 따라가며 한 토큰을 자른다. (자른 길이, 토큰 이름, 추적 줄들)을 돌려준다.
    받아들이는 상태에 닿을 때마다 그 자리를 적어 두고, 갈 곳이 없어지면 마지막으로 적은 자리에서 자른다."""
    state, last_len, last_tok, rows = "T0", 0, None, []
    i = start
    while i < len(text):
        nxt = table.get((state, classify(text[i])))
        rows.append((len(rows) + 1, state, text[i], nxt))
        if nxt is None:
            break
        state = nxt
        i += 1
        if state in token_of:
            last_len, last_tok = i - start, token_of[state]
    else:
        rows.append((len(rows) + 1, state, "End-of-input", None))
    return last_len, last_tok, rows


def tokenize(table, token_of, text, classify=kind):
    out, pos = [], 0
    while pos < len(text):
        length, tok, _ = scan_one(table, token_of, text, pos, classify)
        if length == 0:
            raise ValueError(f"{pos}번 글자 {text[pos]!r}에서 시작하는 토큰이 없다")
        out.append((tok, text[pos:pos + length]))
        pos += length
    return out


def tokenize_naive(specs, text):
    """슬라이드 L02 p.27의 의사코드 그대로. specs는 우선순위 순서의 (토큰 이름, 정규 표현식)."""
    out, rest = [], text
    while rest:
        m_idx = 0
        for i in range(1, len(rest) + 1):
            if any(re.fullmatch(p, rest[:i]) for _, p in specs):   # a1..ai ∈ L(Merged)
                m_idx = i
        if m_idx == 0:
            raise ValueError(f"{rest[0]!r}에서 시작하는 토큰이 없다")
        lexeme = rest[:m_idx]
        name = next(n for n, p in specs if re.fullmatch(p, lexeme))  # 겹치면 앞에 적힌 토큰
        out.append((name, lexeme))
        rest = rest[m_idx:]
    return out


if __name__ == "__main__":
    # (1) 슬라이드 p.38~43: COMPARE(A
    text = "COMPARE(A"
    n, tok, rows = scan_one(TABLE, TOKEN_OF, text, 0)
    assert (n, tok) == (7, "sIdentifier")
    assert rows == [(1, "T0", "C", "T1"), (2, "T1", "O", "T2"), (3, "T2", "M", "T2"), (4, "T2", "P", "T2"),
                    (5, "T2", "A", "T2"), (6, "T2", "R", "T2"), (7, "T2", "E", "T2"), (8, "T2", "(", None)]
    n, tok, rows = scan_one(TABLE, TOKEN_OF, text, 7)
    assert (n, tok) == (1, "lparen") and rows == [(1, "T0", "(", "T4"), (2, "T4", "A", None)]
    n, tok, rows = scan_one(TABLE, TOKEN_OF, text, 8)
    assert (n, tok) == (1, "sIdentifier") and rows == [(1, "T0", "A", "T1"), (2, "T1", "End-of-input", None)]
    assert tokenize(TABLE, TOKEN_OF, text) == [("sIdentifier", "COMPARE"), ("lparen", "("), ("sIdentifier", "A")]

    # (2) 표를 따라가는 방법과 의사코드가 같은 답을 낸다 (무작위 2,000개)
    specs = [("sIdentifier", r"[A-Za-z][A-Za-z0-9]*"), ("lparen", r"\(")]
    assert tokenize_naive(specs, text) == tokenize(TABLE, TOKEN_OF, text)
    rng = random.Random(10)
    for _ in range(2000):
        s = "".join(rng.choice("ab1(") for _ in range(rng.randint(0, 9)))
        try:
            a = tokenize(TABLE, TOKEN_OF, s)
        except ValueError:
            a = "error"
        try:
            b = tokenize_naive(specs, s)
        except ValueError:
            b = "error"
        assert a == b, s
    # 숫자로 시작하면 어느 토큰도 아니다 (의사코드에 오류 처리가 필요한 경우, L02 p.29)
    for f in (lambda: tokenize(TABLE, TOKEN_OF, "9a"), lambda: tokenize_naive(specs, "9a")):
        try:
            f()
            assert False
        except ValueError:
            pass
    # 문서의 추적: x1(y
    assert tokenize(TABLE, TOKEN_OF, "x1(y") == [("sIdentifier", "x1"), ("lparen", "("), ("sIdentifier", "y")]
    assert scan_one(TABLE, TOKEN_OF, "x1(y", 0)[2] == [(1, "T0", "x", "T1"), (2, "T1", "1", "T3"), (3, "T3", "(", None)]

    # (3) 우선순위(L02 p.28): 길이가 같으면 앞에 적힌 토큰, 길이가 다르면 긴 쪽
    kw = [("Keyword", r"if|else|for"), ("Identifier", r"[A-Za-z_][A-Za-z0-9_]*"),
          ("Comparison", r"<=|>=|<|>"), ("Assign", r"="), ("Whitespace", r"[ \t\n]+")]
    assert tokenize_naive(kw, "if") == [("Keyword", "if")]
    assert tokenize_naive(kw, "ifx") == [("Identifier", "ifx")]
    assert tokenize_naive(kw, "iffy if") == [("Identifier", "iffy"), ("Whitespace", " "), ("Keyword", "if")]
    assert tokenize_naive(kw, "a>=b") == [("Identifier", "a"), ("Comparison", ">="), ("Identifier", "b")]
    assert tokenize_naive(kw[::-1], "if") == [("Identifier", "if")]     # 순서를 뒤집으면 if도 식별자가 된다
    # 짧은 쪽부터 자르면(최단 일치) 망가진다
    def tokenize_shortest(specs, text):
        out = []
        while text:
            i = next(i for i in range(1, len(text) + 1) if any(re.fullmatch(p, text[:i]) for _, p in specs))
            out.append(text[:i])
            text = text[i:]
        return out
    assert tokenize_shortest(kw, "a>=b") == ["a", ">", "=", "b"]
    assert tokenize_shortest(kw, "count") == ["c", "o", "u", "n", "t"]

    # (4) "갈 곳이 없어진 바로 앞"이 아니라 "마지막으로 받아들인 자리"에서 자른다
    #     토큰이 a 와 abc 둘뿐인 표: U0 -a-> U1(받아들임) -b-> U2 -c-> U3(받아들임)
    T2 = {("T0", "a"): "U1", ("U1", "b"): "U2", ("U2", "c"): "U3"}
    TOK2 = {"U1": "A", "U3": "ABC"}
    same = lambda ch: ch
    n, tok, rows = scan_one(T2, TOK2, "abd", 0, same)
    assert (n, tok) == (1, "A")                       # ab까지 읽었지만 a만 자른다
    assert rows == [(1, "T0", "a", "U1"), (2, "U1", "b", "U2"), (3, "U2", "d", None)]
    assert tokenize(T2, TOK2, "abca", same) == [("ABC", "abc"), ("A", "a")]
    assert tokenize_naive([("A", "a"), ("ABC", "abc")], "abca") == [("ABC", "abc"), ("A", "a")]
    # (5) 카드 C1: ab1(
    assert scan_one(TABLE, TOKEN_OF, "ab1(", 0)[2] == [(1, "T0", "a", "T1"), (2, "T1", "b", "T2"),
                                                       (3, "T2", "1", "T3"), (4, "T3", "(", None)]
    assert tokenize(TABLE, TOKEN_OF, "ab1(") == [("sIdentifier", "ab1"), ("lparen", "(")]
    # (6) 최장 일치는 그리디다: 토큰이 a, ab, bc 일 때 abc 는 a / bc 로 끊을 수 있지만 ab 를 먼저 떼어 c 에서 막힌다
    g = [("A", "a"), ("AB", "ab"), ("BC", "bc")]
    try:
        tokenize_naive(g, "abc")
        assert False
    except ValueError as e:
        assert "'c'" in str(e)
    assert all(re.fullmatch(p, x) for (_, p), x in zip([g[0], g[2]], ["a", "bc"]))
    # 파이썬 re 의 | 는 왼쪽부터 맞춰 본다(최장 일치가 아니다)
    assert re.match("a|ab", "ab").group() == "a" and tokenize_naive([("A", "a"), ("AB", "ab")], "ab") == [("AB", "ab")]
    assert re.findall(r"a|ab", "ab") == ["a"]
    assert re.findall(r"<|<=", "a<=b") == ["<"] and re.findall(r"<=|<", "a<=b") == ["<="]
    assert tokenize_naive([("LT", "<"), ("LE", "<="), ("ID", "[a-z]")], "a<=b") == [("ID", "a"), ("LE", "<="), ("ID", "b")]
    print("ALL CHECKS PASSED")
```
{% endraw %}
