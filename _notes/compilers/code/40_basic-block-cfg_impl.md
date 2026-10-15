---
layout: "note"
title: "40_basic-block-cfg_impl.py"
display_title: "40_basic-block-cfg_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "40"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/basic-block-cfg/"
parent_title: "기본 블록과 제어 흐름 그래프"
description: "컴파일러 · 기본 블록과 제어 흐름 그래프 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/40_basic-block-cfg_impl/"
---
{% raw %}
[기본 블록과 제어 흐름 그래프](/Hongs_Blog/studies/compilers/basic-block-cfg/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 40_basic-block-cfg_impl.py
# 3주소 코드를 기본 블록으로 자르고 제어 흐름 그래프를 만든다. 문서 예시의 네 블록과
# 간선 여섯 개를 다시 만들고, 지역·전역 최적화 뒤 코드가 원래 코드와
# 같은 결과를 내는지 실행해 견준다. 블록을 자르는 세 규칙은 Aho 외 8.4절을 따른다.
# 실행: python3 40_basic-block-cfg_impl.py
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

JUMPS = ("goto", "if", "ifnot", "return")


def leaders(qs):
    """블록의 첫 명령 자리. ① 맨 첫 명령 ② 점프가 닿는 레이블 ③ 점프 바로 다음 명령."""
    lead = {0}
    for i, q in enumerate(qs):
        if q[0] == "label":
            lead.add(i)
        if q[0] in JUMPS and i + 1 < len(qs):
            lead.add(i + 1)
    return sorted(lead)


def blocks(qs):
    ld = leaders(qs) + [len(qs)]
    return [qs[ld[k]:ld[k + 1]] for k in range(len(ld) - 1)]


def cfg(bs):
    """간선 집합. 블록은 0부터 번호를 매기고 START, END를 더한다."""
    where = {b[0][1]: k for k, b in enumerate(bs) if b[0][0] == "label"}
    edges = {("START", 0)}
    for k, b in enumerate(bs):
        op, a1, a2, _ = b[-1]
        nxt = k + 1 if k + 1 < len(bs) else "END"
        if op == "goto":
            edges.add((k, where[a1]))
        elif op in ("if", "ifnot"):
            edges.add((k, where[a2]))
            edges.add((k, nxt))
        elif op == "return":
            edges.add((k, "END"))
        else:
            edges.add((k, nxt))
    return edges


P9 = """
t0 = 10 + 100
y = t0
t1 = x == 10
if t1 goto L0
x = y
goto L1
L0:
z = y
L1:
y = 10
"""
P11 = P9.replace("t0 = 10 + 100\ny = t0", "y = 110")
P12 = P11.replace("x = y", "x = 110").replace("z = y", "z = 110")

if __name__ == "__main__":
    qs = quads(P9)
    assert leaders(qs) == [0, 4, 6, 8]
    bs = blocks(qs)
    assert [len(b) for b in bs] == [4, 2, 2, 2]
    assert bs[0][-1] == ("if", "t1", "L0", None) and bs[1][-1] == ("goto", "L1", None, None)
    assert bs[2][0] == ("label", "L0", None, None) and bs[3][0] == ("label", "L1", None, None)
    assert cfg(bs) == {("START", 0), (0, 2), (0, 1), (1, 3), (2, 3), (3, "END")}

    # 블록 안쪽 성질: 레이블은 첫 줄에만, 점프는 마지막 줄에만
    for b in bs:
        assert all(q[0] != "label" for q in b[1:]) and all(q[0] not in JUMPS for q in b[:-1])

    # 원래 코드: y = 10 + 100; if (x == 10) z = y; else x = y; y = 10;
    def src(x, z):
        y = 10 + 100
        if x == 10:
            z = y
        else:
            x = y
        y = 10
        return x, y, z
    for x in list(range(-3, 15)) + [110]:
        for text in (P9, P11, P12):
            _, env = run(quads(text), {"x": x, "z": 7})
            assert (env["x"], env["y"], env["z"]) == src(x, 7)
    assert src(10, 7) == (10, 10, 110) and src(3, 7) == (110, 10, 7)   # 카드 C3

    # 지역 최적화(P11)는 첫 블록만 바꾼다. 전역 최적화(P12)는 다른 블록까지 바꾼다
    b11, b12 = blocks(quads(P11)), blocks(quads(P12))
    assert [len(b) for b in b11] == [3, 2, 2, 2] and b11[1:] == bs[1:]
    assert b12[0] == b11[0] and b12[1][0] == ("=", "110", None, "x") and b12[2][1] == ("=", "110", None, "z")
    assert cfg(b11) == cfg(bs) == cfg(b12)

    # 3주소 코드 문서의 if-else는 블록 5개, while은 블록 3개
    IFELSE = """t0 = x == y
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
return x"""
    bi = blocks(quads(IFELSE))
    assert [len(b) for b in bi] == [2, 1, 4, 3, 4]
    assert cfg(bi) == {("START", 0), (0, 2), (0, 1), (1, 3), (2, 4), (3, 4), (4, "END")}
    WHILE = """L0:
t0 = y + z
t1 = x < t0
ifnot t1 goto L1
t2 = x + 1
x = t2
goto L0
L1:
r = x"""
    bw = blocks(quads(WHILE))
    assert [len(b) for b in bw] == [4, 3, 2]
    assert cfg(bw) == {("START", 0), (0, 2), (0, 1), (1, 0), (2, "END")}   # (1, 0)이 되돌아가는 간선

    print("ALL CHECKS PASSED")
```
{% endraw %}
