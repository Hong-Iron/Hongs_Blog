---
layout: "note"
title: "37_three-address-code_verify.py"
display_title: "37_three-address-code_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/three-address-code/"
parent_title: "3주소 코드"
description: "컴파일러 · 3주소 코드 검증 코드"
permalink: "/studies/compilers/code/37_three-address-code_verify/"
---
{% raw %}
[3주소 코드](/Hongs_Blog/studies/compilers/three-address-code/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 37_three-address-code_verify.py
# 3주소 코드 문서의 예를 확인한다. 3주소 코드를 쿼드러플로 읽어 실행하는 작은 실행기를 두고,
# 슬라이드의 if-else 예(L11 p.17), while 예(p.18), for 연습(p.19)의 실행 결과를
# 원래 고급 언어 코드를 파이썬으로 옮긴 것과 견준다. 표준 라이브러리만 쓴다.
# 실행: python3 37_three-address-code_verify.py
import re

_TOK = re.compile(r"[A-Za-z_]\w*|\d+|==|!=|<=|>=|&&|\|\||<<|[-+*/%<>!]")
BINOPS = {
    "+": lambda a, b: a + b, "-": lambda a, b: a - b, "*": lambda a, b: a * b,
    "/": lambda a, b: int(a / b), "%": lambda a, b: a - b * int(a / b),
    "<<": lambda a, b: a << b,
    "&&": lambda a, b: bool(a) and bool(b), "||": lambda a, b: bool(a) or bool(b),
    "==": lambda a, b: a == b, "!=": lambda a, b: a != b,
    "<": lambda a, b: a < b, ">": lambda a, b: a > b,
    "<=": lambda a, b: a <= b, ">=": lambda a, b: a >= b,
}


def to_quad(line):
    """3주소 코드 한 줄 -> 쿼드러플 (op, arg1, arg2, result). 빈 칸은 None."""
    s = line.strip()
    m = re.fullmatch(r"(\w+):", s)
    if m:
        return ("label", m.group(1), None, None)
    m = re.fullmatch(r"goto (\w+)", s)
    if m:
        return ("goto", m.group(1), None, None)
    m = re.fullmatch(r"(if|ifnot) (\w+) goto (\w+)", s)
    if m:
        return (m.group(1), m.group(2), m.group(3), None)
    m = re.fullmatch(r"param (\w+)", s)
    if m:
        return ("param", m.group(1), None, None)
    m = re.fullmatch(r"(?:(\w+) = )?call (\w+), (\d+)", s)
    if m:
        return ("call", m.group(2), m.group(3), m.group(1))
    m = re.fullmatch(r"return(?: (\w+))?", s)
    if m:
        return ("return", m.group(1), None, None)
    m = re.fullmatch(r"(\w+)\[(\w+)\] = (\w+)", s)
    if m:
        return ("[]=", m.group(2), m.group(3), m.group(1))
    m = re.fullmatch(r"(\w+) = (\w+)\[(\w+)\]", s)
    if m:
        return ("=[]", m.group(2), m.group(3), m.group(1))
    lhs, rhs = [p.strip() for p in s.split(" = ", 1)]
    t = _TOK.findall(rhs)
    if len(t) == 1:
        return ("=", t[0], None, lhs)
    if len(t) == 2 and t[0] in ("-", "!"):
        return (t[0], t[1], None, lhs)
    assert len(t) == 3 and t[1] in BINOPS, line
    return (t[1], t[0], t[2], lhs)


def quads(text):
    return [to_quad(l) for l in text.strip().splitlines() if l.strip() and l.strip() != "..."]


def run(qs, env, funcs=None, limit=100000):
    """쿼드러플 목록을 실행한다. (return 값, 바뀐 env)를 돌려준다."""
    env = dict(env)
    funcs = funcs or {}
    label = {q[1]: i for i, q in enumerate(qs) if q[0] == "label"}
    params = []

    def v(a):
        if a in ("true", "false"):
            return a == "true"
        if re.fullmatch(r"\d+", str(a)):
            return int(a)
        return env[a]

    pc = steps = 0
    while pc < len(qs):
        steps += 1
        assert steps < limit, "끝나지 않는다"
        op, a1, a2, res = qs[pc]
        pc += 1
        if op == "label":
            pass
        elif op == "goto":
            pc = label[a1]
        elif op == "if":
            if v(a1):
                pc = label[a2]
        elif op == "ifnot":
            if not v(a1):
                pc = label[a2]
        elif op == "param":
            params.append(v(a1))
        elif op == "call":
            n = int(a2)
            args = params[len(params) - n:]
            del params[len(params) - n:]
            r = funcs[a1](*args)
            if res is not None:
                env[res] = r
        elif op == "return":
            return (v(a1) if a1 is not None else None), env
        elif op == "[]=":
            env.setdefault(res, {})[v(a1)] = v(a2)
        elif op == "=[]":
            env[res] = env[a1][v(a2)]
        elif op == "=":
            env[res] = v(a1)
        elif a2 is None:
            env[res] = (-v(a1)) if op == "-" else (not v(a1))
        else:
            env[res] = BINOPS[op](v(a1), v(a2))
    return None, env


EX0 = """
t0 = A * B
t1 = A + t0
t2 = t1 - 1
"""

EX1 = """
t0 = x == y
if t0 goto L0
goto L1
L0:
t0 = x + 1
x = t0
goto L2
L1:
t1 = x + 2
x = t1
L2:
t2 = x + 3
x = t2
return x
"""

EX2 = """
L0:
t0 = x < y
ifnot t0 goto L1
t1 = x + 1
x = t1
goto L0
L1:
t2 = x - 1
param t2
call foo, 1
"""

# p.19 연습의 답(보충): for (i = 0; i < 10; i++) { b[i] = i + 1; }
FOR = """
i = 0
L0:
t0 = i < 10
ifnot t0 goto L1
t1 = i + 1
b[i] = t1
t2 = i + 1
i = t2
goto L0
L1:
"""


def operands_of(q):
    """한 명령에 나오는 주소(변수·상수·임시 변수)의 수. 레이블과 함수 이름은 빼고 센다."""
    op, a1, a2, res = q
    if op in ("label", "goto"):
        return 0
    if op in ("if", "ifnot"):
        return 1
    if op == "call":
        return 1 + (res is not None)      # 인자 개수 n, 그리고 받을 변수
    return sum(x is not None for x in (a1, a2, res))


if __name__ == "__main__":
    # p.10~12: A + A * B - 1 의 세 줄
    for A in range(-5, 6):
        for B in range(-5, 6):
            _, env = run(quads(EX0), {"A": A, "B": B})
            assert env["t2"] == A + A * B - 1

    # p.17: if-else 예. 원래 코드와 같은 값을 돌려준다
    def src1(x, y):
        if x == y:
            x = x + 1
        else:
            x = x + 2
        x = x + 3
        return x
    for x in range(-6, 7):
        for y in range(-6, 7):
            ret, _ = run(quads(EX1), {"x": x, "y": y})
            assert ret == src1(x, y)
    assert run(quads(EX1), {"x": 5, "y": 5})[0] == 9      # 카드 C3
    assert run(quads(EX1), {"x": 5, "y": 7})[0] == 10

    # p.18: while 예. foo가 받는 값이 같다
    for x in range(-6, 7):
        for y in range(-6, 7):
            got = []
            run(quads(EX2), {"x": x, "y": y}, {"foo": lambda a: got.append(a)})
            xx = x
            while xx < y:
                xx = xx + 1
            assert got == [xx - 1]
    got = []
    run(quads(EX2), {"x": 2, "y": 5}, {"foo": lambda a: got.append(a)})
    assert got == [4]

    # p.19 연습: b[0..9] = 1..10, 끝나면 i = 10
    _, env = run(quads(FOR), {})
    assert env["b"] == {k: k + 1 for k in range(10)} and env["i"] == 10

    # 모든 명령은 주소를 많아야 세 개 쓴다
    for text in (EX0, EX1, EX2, FOR):
        assert all(operands_of(q) <= 3 for q in quads(text))

    # 값을 받는 호출: y = foo(x1, x2)
    CALL = "param a\nparam b\ny = call foo, 2"
    _, env = run(quads(CALL), {"a": 3, "b": 4}, {"foo": lambda p, q: p * 10 + q})
    assert env["y"] == 34

    # 단항 연산과 불 연산 (p.14)
    _, env = run(quads("t0 = -2\nt1 = !true\nt2 = A || 1\nt3 = t0 <= 0"), {"A": 0})
    assert env["t0"] == -2 and env["t1"] is False and env["t2"] is True and env["t3"] is True

    print("ALL CHECKS PASSED")
```
{% endraw %}
