---
layout: "note"
title: "03_token-lexeme_verify.py"
display_title: "03_token-lexeme_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/token-lexeme/"
parent_title: "토큰과 렉심"
description: "컴파일러 · 토큰과 렉심 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/03_token-lexeme_verify/"
---
{% raw %}
[토큰과 렉심](/Hongs_Blog/studies/compilers/token-lexeme/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 토큰과 렉심: 문서의 예(A = B + C)와 C 함수 예의 토큰 줄을 작은 어휘 분석기로 확인한다
# 실행: python3 03_token-lexeme_verify.py   (표준 라이브러리만 쓴다)
# 토큰 이름은 문서에 나온 것(ID, IF, COMMA, LPAREN, ASSIGN, ADD, COMPARISON, NUMBER)을 쓰고,
# 나머지(BOOL, INT, RETURN, RPAREN, LBRACE, RBRACE, SEMI)는 같은 방식으로 지었다.
import re

# 위에 적힌 것이 먼저다. 예약어가 식별자보다 위에 있어야 한다.
SPECS = [
    ("WHITESPACE", r"[ \t\n]+"),
    ("COMMENT", r"/\*.*?\*/"),
    ("BOOL", r"bool\b"), ("INT", r"int\b"), ("RETURN", r"return\b"), ("IF", r"if\b"),
    ("ID", r"[A-Za-z_][A-Za-z0-9_]*"),
    ("NUMBER", r"[0-9]+(\.[0-9]+)?"),
    ("COMPARISON", r"<=|>=|==|<|>"),
    ("ASSIGN", r"="), ("ADD", r"\+"),
    ("LPAREN", r"\("), ("RPAREN", r"\)"), ("LBRACE", r"\{"), ("RBRACE", r"\}"),
    ("COMMA", r","), ("SEMI", r";"),
]
WITH_VALUE = {"ID", "NUMBER", "COMPARISON"}     # 이름만으로는 어느 글자였는지 모르는 토큰
DISCARD = {"WHITESPACE", "COMMENT"}


def lex(text, keep_all=False):
    out, pos = [], 0
    while pos < len(text):
        best = None
        for name, pat in SPECS:                 # 가장 길게 맞는 것, 길이가 같으면 위에 적힌 것
            m = re.compile(pat, re.S).match(text, pos)
            if m and m.end() > pos and (best is None or m.end() > best[1]):
                best = (name, m.end())
        assert best, f"{pos}번 글자에서 시작하는 토큰이 없다"
        name, end = best
        if keep_all or name not in DISCARD:
            out.append((name, text[pos:end]))
        pos = end
    return out


def show(tokens):
    return " ".join(f"<{n}, {v}>" if n in WITH_VALUE else f"<{n}>" for n, v in tokens)


if __name__ == "__main__":
    # A = B + C
    toks = lex("A = B + C")
    assert [v for _, v in toks] == ["A", "=", "B", "+", "C"]                 # 렉심
    assert [n for n, _ in toks] == ["ID", "ASSIGN", "ID", "ADD", "ID"]       # 토큰 이름
    assert show(toks) == "<ID, A> <ASSIGN> <ID, B> <ADD> <ID, C>"
    # 문서의 C 함수 예
    src = "bool compare(int a, int b) {\n/* compare a and b */\nreturn a >= b;\n}"
    toks = lex(src)
    assert show(toks) == ("<BOOL> <ID, compare> <LPAREN> <INT> <ID, a> <COMMA> <INT> <ID, b> <RPAREN> <LBRACE> "
                          "<RETURN> <ID, a> <COMPARISON, >=> <ID, b> <SEMI> <RBRACE>")
    assert len(toks) == 16
    everything = lex(src, keep_all=True)
    assert sum(n == "COMMENT" for n, _ in everything) == 1
    assert len(everything) > len(toks)                     # 빈칸과 주석은 버려졌다
    assert "".join(v for _, v in everything) == src        # 렉심을 이으면 원래 글이 된다
    # 한 토큰에 렉심 여럿: pi, score, i, j, k 는 모두 ID
    assert {n for n, _ in lex("pi score i j k")} == {"ID"}
    assert [n for n, _ in lex("0 3.14")] == ["NUMBER", "NUMBER"]
    assert lex("if") == [("IF", "if")] and lex("iff") == [("ID", "iff")]
    # 카드 값
    assert show(lex("if (x1 >= 10) y = y + 1;")) == (
        "<IF> <LPAREN> <ID, x1> <COMPARISON, >=> <NUMBER, 10> <RPAREN> <ID, y> <ASSIGN> <ID, y> <ADD> <NUMBER, 1> <SEMI>")
    assert len(lex("if (x1 >= 10) y = y + 1;")) == 12
    assert len({v for n, v in lex("a = a + b") if n == "ID"}) == 2 and len(lex("a = a + b")) == 5
    print("ALL CHECKS PASSED")
```
{% endraw %}
