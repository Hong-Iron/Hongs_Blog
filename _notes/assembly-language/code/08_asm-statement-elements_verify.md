---
layout: "note"
title: "08_asm-statement-elements_verify.py"
display_title: "08_asm-statement-elements_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/asm-statement-elements/"
parent_title: "어셈블리 문장의 구성"
description: "어셈블리어 · 어셈블리 문장의 구성 검증 코드"
permalink: "/studies/assembly-language/code/08_asm-statement-elements_verify/"
---
{% raw %}
[어셈블리 문장의 구성](/Hongs_Blog/studies/assembly-language/asm-statement-elements/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""어셈블리 문장의 구성 검증 (MASM이 없어 파이썬으로 규칙을 흉내 냈다).

문서: 08.어셈블리 문장의 구성
출처: 어셈블리어 4주차 4-1 p.4~13
주장:
  1. 정수 상수: 30d = 30, 6Ah = 106, 42 = 42, 1101b = 13, 0A5h = 165. 꼬리 글자가 진법을 정한다.
  2. A5h는 글자로 시작해서 식별자 규칙에 걸린다. 그래서 앞에 0을 붙여 0A5h로 쓴다.
  3. 정수 식(p.5): 16 / 5 = 3, -(3 + 4) * (6 - 1) = -35, -3 + 4 * 6 - 1 = 20, 25 mod 3 = 1.
  4. 식별자: 1~247자, 첫 글자는 글자·_·@·?·$, 대소문자를 가리지 않는다.
  5. 문장 가르기: [레이블:] 니모닉 [피연산자] [; 주석]. p.13의 여섯 문장.
  6. add eax,36 * 25 의 상수식은 900.
"""
import re

RADIX = {"h": 16, "d": 10, "b": 2}


def is_identifier(s):
    return re.fullmatch(r"[A-Za-z_@?$][A-Za-z0-9_@?$]{0,246}", s) is not None


def parse_int(tok):
    """MASM 정수 상수. 숫자로 시작해야 한다. 꼬리 글자 h/d/b가 없으면 10진수."""
    t = tok.lower()
    sign = 1
    if t[0] in "+-":
        sign = -1 if t[0] == "-" else 1
        t = t[1:]
    if not t[0].isdigit():
        raise ValueError("숫자로 시작하지 않는다: " + tok)
    if t[-1] == "h":
        return sign * int(t[:-1], 16)
    if t[-1] in "bd" and all(c in "01" for c in t[:-1]) and t[-1] == "b":
        return sign * int(t[:-1], 2)
    if t[-1] == "d":
        return sign * int(t[:-1], 10)
    return sign * int(t, 10)


def trunc_div(a, b):
    q = abs(a) // abs(b)
    return q if (a >= 0) == (b >= 0) else -q


def eval_expr(text):
    """우선순위: 괄호 > 단항 +,- > *, /, MOD > 이항 +,-"""
    toks = re.findall(r"\d+[A-Za-z0-9]*|mod|[()+\-*/]", text.lower())
    pos = [0]

    def peek():
        return toks[pos[0]] if pos[0] < len(toks) else None

    def take():
        pos[0] += 1
        return toks[pos[0] - 1]

    def primary():
        t = take()
        if t == "(":
            v = add()
            assert take() == ")"
            return v
        return parse_int(t)

    def unary():
        if peek() in ("+", "-"):
            return -unary() if take() == "-" else unary()
        return primary()

    def mul():
        v = unary()
        while peek() in ("*", "/", "mod"):
            op = take()
            r = unary()
            if op == "*":
                v = v * r
            elif op == "/":
                v = trunc_div(v, r)
            else:
                v = v - trunc_div(v, r) * r
        return v

    def add():
        v = mul()
        while peek() in ("+", "-"):
            v = v + mul() if take() == "+" else v - mul()
        return v

    v = add()
    assert pos[0] == len(toks)
    return v


def split_statement(line):
    """(레이블, 니모닉, 피연산자 목록, 주석)"""
    comment = None
    if ";" in line:
        line, comment = line.split(";", 1)
        comment = comment.strip()
    line = line.strip()
    label = None
    m = re.match(r"([A-Za-z_@?$][A-Za-z0-9_@?$]*):\s*(.*)", line)
    if m:
        label, line = m.group(1), m.group(2)
    if not line:
        return label, None, [], comment
    parts = line.split(None, 1)
    mnem = parts[0]
    ops = [o.strip() for o in parts[1].split(",")] if len(parts) > 1 else []
    return label, mnem, ops, comment


def main():
    assert [parse_int(t) for t in ("30d", "6Ah", "42", "1101b", "0A5h")] == [30, 106, 42, 13, 165]
    print("[OK] p.4: 30d, 6Ah, 42, 1101b, 0A5h = 30, 106, 42, 13, 165")

    assert is_identifier("A5h") and not is_identifier("0A5h")
    try:
        parse_int("A5h")
        raise AssertionError
    except ValueError:
        pass
    print("[OK] A5h는 식별자 모양이라 상수로 읽히지 않는다. 0A5h는 상수다")

    cases = {"16 / 5": 3, "-(3 + 4) * (6 - 1)": -35, "-3 + 4 * 6 - 1": 20, "25 mod 3": 1}
    for text, want in cases.items():
        assert eval_expr(text) == want, text
    print("[OK] p.5 정수 식 네 개: 3, -35, 20, 1")

    assert all(is_identifier(s) for s in ("myArray", "L1", "_main", "@count", "?x", "$first", "val1"))
    assert not any(is_identifier(s) for s in ("1stValue", "my-var", "", "a b"))
    assert is_identifier("a" * 247) and not is_identifier("a" * 248)
    assert "MyArray".lower() == "myarray"
    print("[OK] p.7 식별자 규칙: 첫 글자, 길이 1~247")

    p13 = {
        "stc ; set Carry flag": (None, "stc", [], "set Carry flag"),
        "inc eax ; register": (None, "inc", ["eax"], "register"),
        "inc myByte ; memory": (None, "inc", ["myByte"], "memory"),
        "add ebx,ecx ; register, register": (None, "add", ["ebx", "ecx"], "register, register"),
        "sub myByte,25 ; memory, constant": (None, "sub", ["myByte", "25"], "memory, constant"),
        "add eax,36 * 25 ; register, constant-expression":
            (None, "add", ["eax", "36 * 25"], "register, constant-expression"),
    }
    for line, want in p13.items():
        assert split_statement(line) == want, line
    assert [len(v[2]) for v in p13.values()] == [0, 1, 1, 2, 2, 2]
    assert eval_expr("36 * 25") == 900
    print("[OK] p.13 여섯 문장: 피연산자 0, 1, 1, 2, 2, 2개. 36 * 25 = 900")

    assert split_statement("L1: add ax,cx   ; 더한다") == ("L1", "add", ["ax", "cx"], "더한다")
    assert split_statement("target: mov eax,5") == ("target", "mov", ["eax", "5"], None)
    # 카드
    assert eval_expr("-5 + 3 * 4 mod 5") == -3 and eval_expr("(2 + 3) * 4 / 3") == 6
    assert parse_int("0FFh") == 255 and parse_int("11111111b") == 255 and parse_int("255d") == 255
    print("[OK] 레이블이 붙은 문장, 카드 값(-3, 6, 255)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
