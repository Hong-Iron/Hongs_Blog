---
layout: "note"
title: "05_regular-expression-practice_p6.py"
display_title: "05_regular-expression-practice_p6.py"
kind: "code"
kind_label: "코드 · 문제 6 풀이"
num: "05"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/regular-expression-practice/"
parent_title: "정규 표현식 연습"
description: "컴파일러 · 정규 표현식 연습 문제 6 풀이 코드"
permalink: "/studies/compilers/code/05_regular-expression-practice_p6/"
---
{% raw %}
[정규 표현식 연습](/Hongs_Blog/studies/compilers/regular-expression-practice/) 문서의 문제 6 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 정규 표현식 연습: 문제 1~6의 답을 확인한다
# 실행: python3 05_regular-expression-practice_p6.py   (표준 라이브러리만 쓴다)
# 수업 표기(기본 다섯 식)를 파이썬 re 표기로 옮겨 길이 제한 안의 모든 문자열에서 견준다.
# 옮기는 규칙: ε -> 빈 묶음 (), 나머지는 그대로. 한 글자가 한 기호다.
import itertools
import re


def to_py(src):
    return "".join("()" if c == "ε" else re.escape(c) if c not in "()|*+" else c for c in src)


def lang(src, alphabet, max_len):
    pat = re.compile(to_py(src))
    return {"".join(t) for k in range(max_len + 1) for t in itertools.product(alphabet, repeat=k)
            if pat.fullmatch("".join(t))}


def strings(alphabet, max_len):
    return {"".join(t) for k in range(max_len + 1) for t in itertools.product(alphabet, repeat=k)}


if __name__ == "__main__":
    # 문제 1: 우선순위. a|bc* 를 괄호로 다 묶으면 a|(b(c*))
    assert lang("a|bc*", "abc", 6) == lang("a|(b(c*))", "abc", 6)
    assert lang("a|bc*", "abc", 6) != lang("(a|b)c*", "abc", 6)
    assert lang("a|bc*", "abc", 6) != lang("a|(bc)*", "abc", 6)
    got = lang("a|bc*", "abc", 3)
    assert got == {"a", "b", "bc", "bcc"}
    assert "ac" not in got and "" not in got and "bcbc" not in lang("a|bc*", "abc", 4)

    # 문제 2: 정수 (슬라이드 예 4). d = 숫자 하나
    assert lang("dd*", "d", 7) == strings("d", 7) - {""}
    assert all(re.fullmatch(r"[0-9][0-9]*", s) for s in ["0", "11", "1530", "007"])
    assert not re.fullmatch(r"[0-9][0-9]*", "")
    # 변형: 앞에 0이 붙지 않는 정수. z = 0, n = 1~9
    assert lang("z|n(z|n)*", "zn", 6) == {s for s in strings("zn", 6) if s and (s == "z" or s[0] == "n")}
    nolead = re.compile(r"0|[1-9][0-9]*")
    assert all(nolead.fullmatch(s) for s in ["0", "11", "1530"]) and not nolead.fullmatch("007")

    # 문제 3: 식별자 (슬라이드 예 5). l = 글자, d = 숫자, u = 밑줄
    ident = "(l|u)(l|d|u)*"
    assert lang(ident, "ldu", 6) == {s for s in strings("ldu", 6) if s and s[0] != "d"}
    wrong = "(l|d|u)(l|d|u)*"                 # 흔한 오답: 첫 글자를 따로 떼지 않았다
    assert "dl" in lang(wrong, "ldu", 3) and "dl" not in lang(ident, "ldu", 3)
    real = re.compile(r"([A-Za-z]|_)([A-Za-z]|[0-9]|_)*")
    assert all(real.fullmatch(s) for s in ["aaa", "i", "funcAtoB", "_var", "main", "variable123"])
    assert not real.fullmatch("123variable")

    # 문제 4: 실수 (슬라이드 예 6). m = 빼기, p = 점, q = 더하기, E = 지수 표시
    flt = "(m|ε)dd*pdd*(ε|E(q|m|ε)dd*)"
    assert lang(flt, "mdpEq", 6) == {s for s in strings("mdpEq", 6) if re.fullmatch(r"m?d+pd+(E[qm]?d+)?", s)}
    real = re.compile(r"(-|)[0-9][0-9]*\.[0-9][0-9]*(|E(\+|-|)[0-9][0-9]*)")
    for s in ["0.5", "3.14", "-6.111", "1.0E+3", "100.0", "-10.53E-1", "9.123E3"]:
        assert real.fullmatch(s), s
    for s in ["5", ".5", "5.", "1.0E", "+1.0", "1.0E+-3"]:
        assert not real.fullmatch(s), s

    # 문제 5: 법칙으로 줄이기
    A = "ab"
    assert lang("(a|ε)*", A, 6) == lang("a*", A, 6)
    assert lang("(a*)*b|(a*)*c", "abc", 6) == lang("a*(b|c)", "abc", 6)
    assert lang("ab|ac|a", "abc", 4) == lang("a(b|c|ε)", "abc", 4) == {"ab", "ac", "a"}
    assert lang("(a|b)*", A, 6) == lang("(a*b*)*", A, 6) == strings(A, 6)
    assert lang("(a|b)*", A, 6) != lang("a*|b*", A, 6) and "ab" not in lang("a*|b*", A, 6)

    # 문제 6: 실전 표기를 기본 다섯 식으로
    assert {s for s in strings("ab", 6) if re.fullmatch(r"a?b+", s)} == lang("(a|ε)bb*", "ab", 6)
    assert {s for s in strings("ab", 6) if re.fullmatch(r"[ab]{2}", s)} == lang("(a|b)(a|b)", "ab", 6)
    assert {s for s in strings("ab", 6) if re.fullmatch(r"(ab){1,2}", s)} == lang("ab|abab", "ab", 6) == lang("ab(ab|ε)", "ab", 6)
    assert {s for s in strings("abc", 4) if re.fullmatch(r"[^c]+", s)} == lang("(a|b)(a|b)*", "abc", 4)
    print("ALL CHECKS PASSED")
```
{% endraw %}
