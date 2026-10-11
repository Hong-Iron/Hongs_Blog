---
layout: "note"
title: "43_local-optimization-ladder_p4.py"
display_title: "43_local-optimization-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "43"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/local-optimization-ladder/"
parent_title: "지역 최적화 예제 사다리"
description: "컴파일러 · 지역 최적화 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/compilers/code/43_local-optimization-ladder_p4/"
---
{% raw %}
[지역 최적화 예제 사다리](/Hongs_Blog/studies/compilers/local-optimization-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 43_local-optimization-ladder_p4.py
# 지역 최적화 예제 사다리의 문제 1~4의 답을 확인한다. 사용 가능한 식 분석(복사 전파, 공통 부분식 제거)과
# 생존 변수 분석(죽은 코드 제거)을 차례로 돌려 문서에 적은 중간 집합과 최종 코드를 다시 만들고,
# 고치기 전후 코드가 블록 뒤에서 쓰이는 변수에 같은 값을 남기는지 실행해 견준다.
# 개념 코드(42, 43번의 구현)에서 필요한 부분을 복사해 넣었다. 표준 라이브러리만 쓴다.
# 실행: python3 43_local-optimization-ladder_p4.py
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
    naive=True면 슬라이드 규칙 그대로, 자기 자신을 읽는 대입(x = x + 1)도 집합에 넣는다.
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


def optimize(text, live_out, do_fold=False):
    qs = quads(text)
    start = fold(qs) if do_fold else qs
    mid, asets = available(start)
    out, lsets = live(mid, live_out)
    return qs, mid, asets, out, lsets


def same(before, after, keep, rng, trials=300):
    names = sorted({a for q in before for a in (q[1], q[2], q[3]) if is_var(a)})
    for _ in range(trials):
        env = {n: rng.randint(-20, 20) for n in names}
        e1, e2 = run(before, env)[1], run(after, env)[1]
        assert all(e1[k] == e2[k] for k in keep)
    return True


if __name__ == "__main__":
    rng = random.Random(4343)

    # 문제 1
    qs, mid, asets, out, lsets = optimize("t0 = b + c\nt1 = b + c\nd = t0 * t1\ne = d\nf = e + t0", {"f"})
    assert [show(q) for q in mid] == ["t0 = b + c", "t1 = t0", "d = t0 * t0", "e = d", "f = d + t0"]
    assert asets[2] == ["t0 = b + c", "t1 = t0", "d = t0 * t0"]
    assert lsets == [{"b", "c"}, None, {"t0"}, None, {"d", "t0"}]
    assert [show(q) for q in out] == ["t0 = b + c", "d = t0 * t0", "f = d + t0"]
    assert same(qs, out, ["f"], rng)
    assert run(out, {"b": 1, "c": 2})[1]["f"] == 12

    # 문제 2
    qs, mid, asets, out, lsets = optimize("t0 = a * b\nt1 = t0\nt2 = a * b\nt3 = t1 + t2\nx = t3", {"x"})
    assert [show(q) for q in mid] == ["t0 = a * b", "t1 = t0", "t2 = t0", "t3 = t0 + t0", "x = t3"]
    assert lsets == [{"a", "b"}, None, None, {"t0"}, {"t3"}]
    assert [show(q) for q in out] == ["t0 = a * b", "t3 = t0 + t0", "x = t3"]
    assert same(qs, out, ["x"], rng)

    # 문제 3
    qs, mid, asets, out, lsets = optimize("p = a + b\nq = p\na = q * 2\nr = a + b\ns = q + r", {"s", "a"})
    assert [show(q) for q in mid] == ["p = a + b", "q = p", "a = p * 2", "r = a + b", "s = p + r"]
    assert asets[1] == ["p = a + b", "q = p"]
    assert asets[2] == ["q = p", "a = p * 2"]                 # p = a + b 가 빠진다
    assert lsets == [{"a", "b"}, None, {"p", "b"}, {"p", "a", "b"}, {"p", "a", "r"}]
    assert [show(q) for q in out] == ["p = a + b", "a = p * 2", "r = a + b", "s = p + r"]
    assert same(qs, out, ["s", "a"], rng)
    # r = a + b 를 r = p 로 바꾸면 틀린다
    wrong = quads("p = a + b\na = p * 2\nr = p\ns = p + r")
    e1, e2 = run(qs, {"a": 1, "b": 2})[1], run(wrong, {"a": 1, "b": 2})[1]
    assert (e1["s"], e2["s"]) == (11, 6)

    # 문제 4
    qs, mid, asets, out, lsets = optimize(
        "t0 = 3 * 4\nt1 = x + t0\nt2 = x + 12\ny = t1\nx = y + t2\nt3 = x + 12\nz = t3", {"z", "x"}, do_fold=True)
    assert [show(q) for q in mid] == ["t0 = 12", "t1 = x + 12", "t2 = t1", "y = t1",
                                      "x = t1 + t1", "t3 = x + 12", "z = t3"]
    assert asets[4] == ["t0 = 12", "t2 = t1", "y = t1", "x = t1 + t1"]   # t1 = x + 12 가 빠진다
    assert [show(q) for q in out] == ["t1 = x + 12", "x = t1 + t1", "t3 = x + 12", "z = t3"]
    assert same(qs, out, ["z", "x"], rng)
    e = run(out, {"x": 1})[1]
    assert (e["x"], e["z"]) == (26, 38)
    # (b) 산술 단순화: t1 + t1 = t1 << 1 (정수)
    for t in range(-100, 101):
        assert t + t == t << 1
    # (c) 뒤에서 z만 쓰이면: x는 t3 = x + 12 가 읽으므로 x = t1 + t1 은 여전히 남는다
    out_c = live(mid, {"z"})[0]
    assert [show(q) for q in out_c] == ["t1 = x + 12", "x = t1 + t1", "t3 = x + 12", "z = t3"]

    print("ALL CHECKS PASSED")
```
{% endraw %}
