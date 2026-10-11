---
layout: "note"
title: "39_tac-translation-practice_p4.py"
display_title: "39_tac-translation-practice_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "39"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/tac-translation-practice/"
parent_title: "3주소 코드 변환 연습"
description: "컴파일러 · 3주소 코드 변환 연습 문제 4 풀이 코드"
permalink: "/studies/compilers/code/39_tac-translation-practice_p4/"
---
{% raw %}
[3주소 코드 변환 연습](/Hongs_Blog/studies/compilers/tac-translation-practice/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 39_tac-translation-practice_p4.py
# 3주소 코드 변환 연습의 문제 1~4의 답을 확인한다. 문서에 적은 3주소 코드를 쿼드러플로 읽어 실행하고,
# 원래 고급 언어 코드를 파이썬으로 옮긴 것과 결과를 견준다. 쿼드러플 표도 확인한다.
# 개념 코드(37번의 실행기)에서 필요한 부분을 복사해 넣었다. 표준 라이브러리만 쓴다.
# 실행: python3 39_tac-translation-practice_p4.py
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


P1 = """
t0 = a + b
t1 = a - c
t2 = t0 * t1
d = t2
"""

P2 = """
t0 = a < b
if t0 goto L0
goto L1
L0:
m = a
goto L2
L1:
m = b
L2:
t1 = m * 2
r = t1
"""

P3 = """
s = 0
i = 1
L0:
t0 = i <= n
ifnot t0 goto L1
t1 = s + i
s = t1
t2 = i + 1
i = t2
goto L0
L1:
"""

P4 = """
L0:
t0 = i < n
ifnot t0 goto L1
t1 = a[i]
t2 = t1 == k
ifnot t2 goto L2
t3 = c + 1
c = t3
L2:
t4 = i + 1
i = t4
goto L0
L1:
"""

if __name__ == "__main__":
    # 문제 1: d = (a + b) * (a - c)
    assert quads(P1) == [("+", "a", "b", "t0"), ("-", "a", "c", "t1"), ("*", "t0", "t1", "t2"), ("=", "t2", None, "d")]
    for a in range(-4, 5):
        for b in range(-4, 5):
            for c in range(-4, 5):
                assert run(quads(P1), {"a": a, "b": b, "c": c})[1]["d"] == (a + b) * (a - c)
    e = run(quads(P1), {"a": 5, "b": 1, "c": 2})[1]
    assert (e["t0"], e["t1"], e["t2"], e["d"]) == (6, 3, 18, 18)

    # 문제 2: if (a < b) { m = a; } else { m = b; }  r = m * 2;
    for a in range(-5, 6):
        for b in range(-5, 6):
            assert run(quads(P2), {"a": a, "b": b})[1]["r"] == min(a, b) * 2
    # goto L2 를 빼면 참일 때 거짓 쪽까지 실행해 m = b 가 된다
    broken = quads(P2.replace("m = a\ngoto L2", "m = a"))
    assert run(broken, {"a": 1, "b": 9})[1]["r"] == 18 and run(quads(P2), {"a": 1, "b": 9})[1]["r"] == 2

    # 문제 3: s = 0; i = 1; while (i <= n) { s = s + i; i = i + 1; }
    for n in range(-2, 12):
        e = run(quads(P3), {"n": n})[1]
        assert e["s"] == sum(range(1, n + 1)) and e["i"] == max(1, n + 1)
    assert run(quads(P3), {"n": 4})[1]["s"] == 10
    q3 = quads(P3)
    assert len(q3) == 11
    assert q3[2] == ("label", "L0", None, None) and q3[3] == ("<=", "i", "n", "t0")
    assert q3[4] == ("ifnot", "t0", "L1", None) and q3[6] == ("=", "t1", None, "s")
    assert q3[9] == ("goto", "L0", None, None) and q3[10] == ("label", "L1", None, None)
    # n = 4일 때 ifnot 줄은 5번 실행된다(참 4번, 거짓 1번)
    count = [0]
    orig = BINOPS["<="]
    BINOPS["<="] = lambda x, y: (count.__setitem__(0, count[0] + 1), orig(x, y))[1]
    run(q3, {"n": 4})
    BINOPS["<="] = orig
    assert count[0] == 5

    # 문제 4: while (i < n) { if (a[i] == k) { c = c + 1; } i = i + 1; }
    arr = [3, 7, 3, 1, 3, 9]
    for k in (1, 3, 5):
        e = run(quads(P4), {"i": 0, "n": len(arr), "c": 0, "k": k, "a": dict(enumerate(arr))})[1]
        assert e["c"] == arr.count(k) and e["i"] == len(arr)
    assert quads(P4)[3] == ("=[]", "a", "i", "t1")
    assert quads(P4)[5] == ("ifnot", "t2", "L2", None)
    # i = i + 1 을 L2 위로 올리면(if 몸통 안에 두면) 맞지 않는 칸에서 i가 늘지 않아 끝나지 않는다
    bad = quads("""L0:
t0 = i < n
ifnot t0 goto L1
t1 = a[i]
t2 = t1 == k
ifnot t2 goto L2
t3 = c + 1
c = t3
t4 = i + 1
i = t4
L2:
goto L0
L1:""")
    try:
        run(bad, {"i": 0, "n": 6, "c": 0, "k": 3, "a": dict(enumerate(arr))}, limit=5000)
        looped = False
    except AssertionError:
        looped = True
    assert looped

    print("ALL CHECKS PASSED")
```
{% endraw %}
