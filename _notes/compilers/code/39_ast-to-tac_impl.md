---
layout: "note"
title: "39_ast-to-tac_impl.py"
display_title: "39_ast-to-tac_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "39"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/ast-to-tac/"
parent_title: "AST에서 3주소 코드 만들기"
description: "컴파일러 · AST에서 3주소 코드 만들기 구현 코드"
permalink: "/studies/compilers/code/39_ast-to-tac_impl/"
---
{% raw %}
[AST에서 3주소 코드 만들기](/Hongs_Blog/studies/compilers/ast-to-tac/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 39_ast-to-tac_impl.py
# AST를 후위 순서로 돌며 쿼드러플을 만드는 생성기. 슬라이드 L11 p.22~31의 A + A * B - 1 추적과
# p.32 while 연습, p.17 if-else 예, p.18 while 예를 다시 만들고, 만든 코드를 실행한 값이
# AST를 직접 계산한 값과 같은지 무작위 식 2,000개로 견준다. 표준 라이브러리만 쓴다.
# AST 노드: ("id", 이름), ("num", 값), (연산자, 왼쪽, 오른쪽), ("=", ("id", 이름), 식),
#           ("while", 조건, 문장), ("if", 조건, 문장, 문장), ("block", [문장...]),
#           ("call", 함수 이름, [식...]), ("return", 식)
# 실행: python3 39_ast-to-tac_impl.py
import random
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


class Gen:
    def __init__(self):
        self.out, self.nt, self.nl, self.log = [], 0, 0, []

    def temp(self):
        self.nt += 1
        return "t%d" % (self.nt - 1)

    def label(self):
        self.nl += 1
        return "L%d" % (self.nl - 1)

    def emit(self, *q):
        self.out.append(q)

    def expr(self, n):
        """식 노드의 '계산 결과가 담긴 이름'을 돌려준다."""
        kind = n[0]
        if kind == "id":                       # 규칙: 이름을 돌려준다
            self.log.append(("visit", n[1]))
            return n[1]
        if kind == "num":                      # 규칙: 값을 돌려준다
            self.log.append(("visit", n[1]))
            return str(n[1])
        if kind == "call":
            args = [self.expr(a) for a in n[2]]
            for a in args:
                self.emit("param", a, None, None)
            t = self.temp()
            self.emit("call", n[1], str(len(args)), t)
            return t
        a1 = self.expr(n[1])                   # arg1 = 왼쪽 자식의 계산 결과
        a2 = self.expr(n[2])                   # arg2 = 오른쪽 자식의 계산 결과
        t = self.temp()                        # result = 새 임시 변수
        self.emit(kind, a1, a2, t)             # 리스트 맨 끝에 붙인다
        self.log.append(("emit", kind, a1, a2, t))
        return t

    def stmt(self, n):
        kind = n[0]
        if kind == "block":
            for s in n[1]:
                self.stmt(s)
        elif kind == "=":
            self.emit("=", self.expr(n[2]), None, n[1][1])
        elif kind == "while":                  # p.32의 규칙 순서 그대로
            li = self.label()
            self.emit("label", li, None, None)
            cond = self.expr(n[1])
            lj = self.label()
            self.emit("ifnot", cond, lj, None)
            self.stmt(n[2])
            self.emit("goto", li, None, None)
            self.emit("label", lj, None, None)
        elif kind == "if":                     # p.17 예의 모양(보충: 규칙은 슬라이드에 없다)
            cond = self.expr(n[1])
            lt, lf, le = self.label(), self.label(), self.label()
            self.emit("if", cond, lt, None)
            self.emit("goto", lf, None, None)
            self.emit("label", lt, None, None)
            self.stmt(n[2])
            self.emit("goto", le, None, None)
            self.emit("label", lf, None, None)
            self.stmt(n[3])
            self.emit("label", le, None, None)
        elif kind == "call":
            args = [self.expr(a) for a in n[2]]
            for a in args:
                self.emit("param", a, None, None)
            self.emit("call", n[1], str(len(args)), None)
        elif kind == "return":
            self.emit("return", self.expr(n[1]), None, None)
        else:
            raise ValueError(kind)


def show(q):
    op, a1, a2, res = q
    if op == "label":
        return a1 + ":"
    if op == "goto":
        return "goto " + a1
    if op in ("if", "ifnot"):
        return "%s %s goto %s" % (op, a1, a2)
    if op == "param":
        return "param " + a1
    if op == "call":
        return ("%s = " % res if res else "") + "call %s, %s" % (a1, a2)
    if op == "return":
        return "return " + a1
    if op == "=":
        return "%s = %s" % (res, a1)
    if a2 is None:
        return "%s = %s%s" % (res, op, a1)
    return "%s = %s %s %s" % (res, a1, op, a2)


def evaluate(n, env):
    if n[0] == "id":
        return env[n[1]]
    if n[0] == "num":
        return n[1]
    return BINOPS[n[0]](evaluate(n[1], env), evaluate(n[2], env))


def random_expr(rng, depth):
    if depth == 0 or rng.random() < 0.3:
        return ("id", rng.choice("ABC")) if rng.random() < 0.6 else ("num", rng.randint(0, 9))
    return (rng.choice("+-*"), random_expr(rng, depth - 1), random_expr(rng, depth - 1))


def postorder_ops(n, out):
    if n[0] not in ("id", "num"):
        postorder_ops(n[1], out)
        postorder_ops(n[2], out)
        out.append(n[0])
    return out


if __name__ == "__main__":
    A, B, X, Y = ("id", "A"), ("id", "B"), ("id", "x"), ("id", "y")

    # p.22~31: (A + A * B) - 1
    tree = ("-", ("+", A, ("*", A, B)), ("num", 1))
    g = Gen()
    assert g.expr(tree) == "t2"
    assert g.out == [("*", "A", "B", "t0"), ("+", "A", "t0", "t1"), ("-", "t1", "1", "t2")]
    assert [show(q) for q in g.out] == ["t0 = A * B", "t1 = A + t0", "t2 = t1 - 1"]
    # 방문 순서: A, A, B, (* 완성), (+ 완성), 1, (- 완성)
    assert g.log == [("visit", "A"), ("visit", "A"), ("visit", "B"), ("emit", "*", "A", "B", "t0"),
                     ("emit", "+", "A", "t0", "t1"), ("visit", 1), ("emit", "-", "t1", "1", "t2")]

    # p.32 연습(보충): while (x <= y) x = x + 1
    g = Gen()
    g.stmt(("while", ("<=", X, Y), ("=", X, ("+", X, ("num", 1)))))
    assert [show(q) for q in g.out] == [
        "L0:", "t0 = x <= y", "ifnot t0 goto L1", "t1 = x + 1", "x = t1", "goto L0", "L1:"]
    assert g.out[1] == ("<=", "x", "y", "t0") and g.out[2] == ("ifnot", "t0", "L1", None)
    for x in range(-5, 6):
        for y in range(-5, 6):
            _, env = run(g.out, {"x": x, "y": y})
            assert env["x"] == max(x, y + 1)

    # p.18: while (x < y) { x = x + 1; } foo(x - 1);  슬라이드와 한 글자도 다르지 않다
    g = Gen()
    g.stmt(("block", [("while", ("<", X, Y), ("block", [("=", X, ("+", X, ("num", 1)))])),
                      ("call", "foo", [("-", X, ("num", 1))])]))
    assert [show(q) for q in g.out] == [
        "L0:", "t0 = x < y", "ifnot t0 goto L1", "t1 = x + 1", "x = t1", "goto L0", "L1:",
        "t2 = x - 1", "param t2", "call foo, 1"]

    # p.17: if-else. 슬라이드는 L0 안에서 t0를 다시 쓰고, 이 생성기는 늘 새 임시 변수를 쓴다.
    # 그래서 임시 변수 번호만 하나씩 밀린다. 실행 결과는 같다.
    g = Gen()
    g.stmt(("block", [("if", ("==", X, Y), ("block", [("=", X, ("+", X, ("num", 1)))]),
                       ("block", [("=", X, ("+", X, ("num", 2)))])),
                      ("=", X, ("+", X, ("num", 3))), ("return", X)]))
    mine = [show(q) for q in g.out]
    assert mine == ["t0 = x == y", "if t0 goto L0", "goto L1", "L0:", "t1 = x + 1", "x = t1", "goto L2",
                    "L1:", "t2 = x + 2", "x = t2", "L2:", "t3 = x + 3", "x = t3", "return x"]
    slide = quads("""t0 = x == y
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
return x""")
    for x in range(-5, 6):
        for y in range(-5, 6):
            assert run(g.out, {"x": x, "y": y})[0] == run(slide, {"x": x, "y": y})[0]

    # 무작위 식 2,000개: 만든 코드의 실행값 = AST를 직접 계산한 값,
    # 쿼드러플의 op 순서 = AST 후위 순회에서 연산자가 나오는 순서, 쿼드러플 수 = 연산자 노드 수
    rng = random.Random(39)
    for _ in range(2000):
        t = random_expr(rng, 4)
        env = {k: rng.randint(-9, 9) for k in "ABC"}
        g = Gen()
        r = g.expr(t)
        _, e2 = run(g.out, env)
        got = e2[r] if r in e2 else (int(r) if r.lstrip("-").isdigit() else env[r])
        assert got == evaluate(t, env)
        assert [q[0] for q in g.out] == postorder_ops(t, [])

    # 연습 문서와 카드: a = b * c + b * c
    g = Gen()
    bc = ("*", ("id", "b"), ("id", "c"))
    g.stmt(("=", ("id", "a"), ("+", bc, bc)))
    assert [show(q) for q in g.out] == ["t0 = b * c", "t1 = b * c", "t2 = t0 + t1", "a = t2"]

    # 카드 C1: (a - b) * (c + 1)
    g = Gen()
    g.expr(("*", ("-", ("id", "a"), ("id", "b")), ("+", ("id", "c"), ("num", 1))))
    assert g.out == [("-", "a", "b", "t0"), ("+", "c", "1", "t1"), ("*", "t0", "t1", "t2")]
    # while 연습의 실행값: x = 2, y = 5 -> x = 6
    g = Gen()
    g.stmt(("while", ("<=", X, Y), ("=", X, ("+", X, ("num", 1)))))
    assert len(g.out) == 7 and run(g.out, {"x": 2, "y": 5})[1]["x"] == 6

    print("ALL CHECKS PASSED")
```
{% endraw %}
