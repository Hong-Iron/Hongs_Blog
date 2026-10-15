---
layout: "note"
title: "42_available-expressions_impl.py"
display_title: "42_available-expressions_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "42"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/available-expressions/"
parent_title: "사용 가능한 식 분석"
description: "컴파일러 · 사용 가능한 식 분석 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/42_available-expressions_impl/"
---
{% raw %}
[사용 가능한 식 분석](/Hongs_Blog/studies/compilers/available-expressions/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 42_available-expressions_impl.py
# 기본 블록 하나에서 사용 가능한 식 분석을 하고, 그 집합으로 공통 부분식 제거와 복사 전파를 한다.
# 문서의 세 줄 표와 다섯 줄 추적을 그대로 다시 만들고, 최적화 전후 코드가 같은 값을
# 내는지 무작위 블록 3,000개로 견준다. "새 식은 늘 집합에 넣는다"를 글자 그대로 쓰면 x = x + 1 에서
# 틀린 코드가 나오는 것도 보인다. 표준 라이브러리만 쓴다.
# 실행: python3 42_available-expressions_impl.py
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


def is_var(a):
    return a is not None and not re.fullmatch(r"-?\d+", str(a)) and a not in ("true", "false")


def used(q):
    """대입문 q의 오른쪽에서 읽는 변수들."""
    return {a for a in (q[1], q[2]) if is_var(a)}


def show(q):
    op, a1, a2, res = q
    if op == "=":
        return "%s = %s" % (res, a1)
    if a2 is None:
        return "%s = %s%s" % (res, op, a1)
    return "%s = %s %s %s" % (res, a1, op, a2)


def available(qs, rewrite=True, naive=False):
    """기본 블록을 위에서 아래로 훑으며 사용 가능한 식 집합을 만든다.
    rewrite=True면 복사 전파와 공통 부분식 제거를 함께 한다.
    naive=True면 "새 식은 늘 넣는다"를 글자 그대로 따라, 자기 자신을 읽는 대입(x = x + 1)도 집합에 넣는다.
    (새 코드, 각 문장 뒤의 집합 목록)을 돌려준다. 집합은 넣은 순서를 지키는 리스트다."""
    avail, out, sets = [], [], []
    for op, a1, a2, res in qs:
        if rewrite:
            # 복사 전파: b = a 꼴이 집합에 있으면 오른쪽의 b를 a로 바꾼다
            copies = {q[3]: q[1] for q in avail if q[0] == "="}
            a1, a2 = copies.get(a1, a1), copies.get(a2, a2)
            # 공통 부분식 제거: 오른쪽이 같은 식이 집합에 있으면 그 왼쪽 변수로 바꾼다
            if op != "=":
                for q in avail:
                    if q[:3] == (op, a1, a2):
                        op, a1, a2 = "=", q[3], None
                        break
        new = (op, a1, a2, res)
        # res를 쥐고 있는 식은 모두 무효
        avail = [q for q in avail if res != q[3] and res not in used(q)]
        if naive or res not in used(new):
            avail.append(new)
        out.append(new)
        sets.append([show(q) for q in avail])
    return out, sets


def live(qs, live_out, remove=True):
    """기본 블록을 아래에서 위로 훑으며 생존 변수 집합을 만든다.
    remove=True면 왼쪽 변수가 그 문장 뒤에서 살아 있지 않은 대입을 지운다.
    (새 코드, 각 문장 '앞'의 집합 목록(지운 문장은 None))을 돌려준다."""
    cur, out, sets = set(live_out), [], []
    for q in reversed(qs):
        if remove and q[3] not in cur:
            sets.append(None)
            continue
        cur = (cur - {q[3]}) | used(q)
        out.append(q)
        sets.append(set(cur))
    return out[::-1], sets[::-1]


def fold(qs):
    """상수 접기: 두 피연산자가 모두 상수면 컴파일할 때 계산한다."""
    out = []
    for op, a1, a2, res in qs:
        if op in BINOPS and a2 is not None and not is_var(a1) and not is_var(a2):
            out.append(("=", str(BINOPS[op](int(a1), int(a2))), None, res))
        else:
            out.append((op, a1, a2, res))
    return out


def simplify(qs):
    """산술 단순화: 정수 a * 2 를 a << 1 로."""
    return [("<<", a1, "1", res) if op == "*" and a2 == "2" else (op, a1, a2, res)
            for op, a1, a2, res in qs]


VARS = ["a", "b", "c", "t0", "t1", "t2", "t3"]


def random_block(rng, n):
    qs = []
    for _ in range(n):
        res = rng.choice(VARS)
        pick = lambda: rng.choice(VARS) if rng.random() < 0.8 else str(rng.randint(0, 3))
        if rng.random() < 0.25:
            qs.append(("=", pick(), None, res))
        else:
            qs.append((rng.choice("+-*"), pick(), pick(), res))
    return qs


def random_env(rng):
    return {v: rng.randint(-5, 5) for v in VARS}


if __name__ == "__main__":
    # 세 줄 예: 분석만(코드를 고치지 않는다)
    _, sets = available(quads("t0 = a * a\nt1 = a * a\nt0 = a + t1"), rewrite=False)
    assert sets == [["t0 = a * a"], ["t0 = a * a", "t1 = a * a"], ["t1 = a * a", "t0 = a + t1"]]

    # 공통 부분식 제거: {t0 = a * a}에서 t1 = a * a  ->  t1 = t0
    out, _ = available(quads("t0 = a * a\nt1 = a * a"))
    assert show(out[1]) == "t1 = t0"
    # 복사 전파: {b = a}에서 t1 = a * b  ->  t1 = a * a
    out, _ = available(quads("b = a\nt1 = a * b"))
    assert show(out[1]) == "t1 = a * a"
    # 상수 복사도 전파된다 (b = constant number)
    out, _ = available(quads("b = 5\nt1 = a * b"))
    assert show(out[1]) == "t1 = a * 5"

    # 문서의 다섯 줄 추적
    P28 = quads("t0 = a * a\nt1 = a * a\nt2 = t0 + t1\nt0 = t0 + t0\nt3 = t0 + 1")
    out, sets = available(P28)
    assert [show(q) for q in out] == ["t0 = a * a", "t1 = t0", "t2 = t0 + t0", "t0 = t2", "t3 = t2 + 1"]
    assert sets == [
        ["t0 = a * a"],
        ["t0 = a * a", "t1 = t0"],
        ["t0 = a * a", "t1 = t0", "t2 = t0 + t0"],
        ["t0 = t2"],
        ["t0 = t2", "t3 = t2 + 1"],
    ]
    for a in range(-6, 7):
        assert run(P28, {"a": a})[1] == run(out, {"a": a})[1]
    assert run(out, {"a": 3})[1]["t3"] == 19        # 2 * 3 * 3 + 1

    # 무작위 블록 3,000개: 고친 코드가 모든 변수에서 같은 값을 낸다
    rng = random.Random(42)
    changed = 0
    for _ in range(3000):
        qs = random_block(rng, rng.randint(2, 9))
        out, _ = available(qs)
        changed += out != qs
        for _ in range(3):
            env = random_env(rng)
            assert run(qs, env)[1] == run(out, env)[1], [show(q) for q in qs]
    assert changed > 500

    # 틀리기 쉬운 규칙과 비교: "새 식은 늘 집합에 들어간다"를 글자 그대로 따르면 틀린다
    BAD = quads("x = x + 1\ny = x + 1")
    naive, nsets = available(BAD, naive=True)
    assert nsets[0] == ["x = x + 1"] and show(naive[1]) == "y = x"
    assert run(BAD, {"x": 1})[1] == {"x": 2, "y": 3}
    assert run(naive, {"x": 1})[1] == {"x": 2, "y": 2}          # 틀린 답
    fixed, fsets = available(BAD)
    assert fsets[0] == [] and fixed == BAD
    # 무작위로도 naive 쪽에서만 어긋나는 블록이 나온다
    rng = random.Random(7)
    wrong = 0
    for _ in range(3000):
        qs = random_block(rng, rng.randint(2, 9))
        env = random_env(rng)
        wrong += run(qs, env)[1] != run(available(qs, naive=True)[0], env)[1]
    assert wrong > 0

    # 카드 C2 (trace): b = a / c = b + 1 / a = 7 / d = b + 1
    out, sets = available(quads("b = a\nc = b + 1\na = 7\nd = b + 1"))
    assert [show(q) for q in out] == ["b = a", "c = a + 1", "a = 7", "d = b + 1"]
    assert sets == [["b = a"], ["b = a", "c = a + 1"], ["a = 7"], ["a = 7", "d = b + 1"]]
    # 카드 C4 (counterexample): 중간에 a가 바뀌면 두 a * b는 같은 값이 아니다
    Q = quads("t0 = a * b\na = a + 1\nt1 = a * b")
    assert available(Q)[0] == Q
    e = run(Q, {"a": 2, "b": 3})[1]
    assert (e["t0"], e["t1"]) == (6, 9)

    print("ALL CHECKS PASSED")
```
{% endraw %}
