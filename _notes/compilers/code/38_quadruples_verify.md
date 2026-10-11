---
layout: "note"
title: "38_quadruples_verify.py"
display_title: "38_quadruples_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "38"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/quadruples/"
parent_title: "쿼드러플"
description: "컴파일러 · 쿼드러플 검증 코드"
permalink: "/studies/compilers/code/38_quadruples_verify/"
---
{% raw %}
[쿼드러플](/Hongs_Blog/studies/compilers/quadruples/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 38_quadruples_verify.py
# 쿼드러플 문서의 표를 확인한다. 3주소 코드 한 줄을 (op, arg1, arg2, result) 네 칸으로 옮기는
# to_quad가 슬라이드 L11 p.21의 표 12줄과 p.20의 다섯 줄을 그대로 내는지 보고,
# 연결 리스트에 차례로 이어 붙인 뒤 실행한 값이 식을 직접 계산한 값과 같은지 본다.
# 실행: python3 38_quadruples_verify.py
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


class Node:
    def __init__(self, quad):
        self.quad, self.next = quad, None


class QuadList:
    """HEAD에서 시작해 next로 이어지는 단일 연결 리스트. 새 쿼드러플은 맨 끝에 붙인다."""
    def __init__(self):
        self.head = self.tail = None

    def append(self, quad):
        n = Node(quad)
        if self.head is None:
            self.head = self.tail = n
        else:
            self.tail.next = n
            self.tail = n

    def __iter__(self):
        n = self.head
        while n:
            yield n.quad
            n = n.next


# p.21 표: (3주소 코드, op, arg1, arg2, result)
TABLE = [
    ("a = b",          "=",      "b", None, "a"),
    ("a = b - c",      "-",      "b", "c",  "a"),
    ("a = -b",         "-",      "b", None, "a"),
    ("L:",             "label",  "L", None, None),
    ("goto L",         "goto",   "L", None, None),
    ("if x goto L",    "if",     "x", "L",  None),
    ("param x",        "param",  "x", None, None),
    ("call f, 2",      "call",   "f", "2",  None),
    ("x = call f, 2",  "call",   "f", "2",  "x"),
    ("return x",       "return", "x", None, None),
    ("x[i] = y",       "[]=",    "i", "y",  "x"),
    ("x = y[i]",       "=[]",    "y", "i",  "x"),
]

P20 = """
t0 = -a
t1 = b * t0
t2 = b * t1
t3 = t1 + t2
c = t3
"""

if __name__ == "__main__":
    for line, *quad in TABLE:
        assert to_quad(line) == tuple(quad), line

    # p.20: 다섯 줄이 다섯 칸짜리 리스트가 된다. 슬라이드는 마지막 op를 copy로 적었다
    lst = QuadList()
    for q in quads(P20):
        lst.append(q)
    assert list(lst) == [
        ("-", "a", None, "t0"),
        ("*", "b", "t0", "t1"),
        ("*", "b", "t1", "t2"),
        ("+", "t1", "t2", "t3"),
        ("=", "t3", None, "c"),
    ]
    assert lst.head.quad[3] == "t0" and lst.tail.quad[3] == "c"

    # 실행하면 c = b*(-a) + b*(b*(-a))
    for a in range(-4, 5):
        for b in range(-4, 5):
            _, env = run(list(lst), {"a": a, "b": b})
            assert env["c"] == b * (-a) + b * (b * (-a))
    _, env = run(list(lst), {"a": 2, "b": 3})
    assert (env["t0"], env["t1"], env["t2"], env["t3"], env["c"]) == (-2, -6, -18, -24, -24)   # 카드 C2

    # 같은 op '-'라도 arg2가 비었으면 단항, 차 있으면 이항이다
    _, env = run([to_quad("a = -b"), to_quad("d = b - c")], {"b": 7, "c": 2})
    assert env["a"] == -7 and env["d"] == 5

    # 카드 C3: ifnot t0 goto L1 / x = t1
    assert to_quad("ifnot t0 goto L1") == ("ifnot", "t0", "L1", None)
    assert to_quad("x = t1") == ("=", "t1", None, "x")

    print("ALL CHECKS PASSED")
```
{% endraw %}
