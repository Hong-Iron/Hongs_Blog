---
layout: "note"
title: "41_local-optimizations_verify.py"
display_title: "41_local-optimizations_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "41"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/local-optimizations/"
parent_title: "지역 최적화 기법"
description: "컴파일러 · 지역 최적화 기법 검증 코드"
permalink: "/studies/compilers/code/41_local-optimizations_verify/"
---
{% raw %}
[지역 최적화 기법](/Hongs_Blog/studies/compilers/local-optimizations/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 41_local-optimizations_verify.py
# 지역 최적화 다섯 기법의 슬라이드 예(L12 p.5~6, p.11, p.14~20)를 실행해, 고치기 전과 뒤의 코드가
# 같은 값을 내는지 확인한다. 정수 a * 2 = a << 1, 10 * 2 = 20, p.20 연습의 답,
# 조건을 어기면 값이 달라지는 반례도 본다. 표준 라이브러리만 쓴다.
# 실행: python3 41_local-optimizations_verify.py
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


def same(before, after, keep, names, rng, trials=300):
    for _ in range(trials):
        env = {n: rng.randint(-20, 20) for n in names}
        e1, e2 = run(before, env)[1], run(after, env)[1]
        if any(e1[k] != e2[k] for k in keep):
            return False
    return True


if __name__ == "__main__":
    rng = random.Random(41)

    # p.15 공통 부분식 제거 -> p.17 복사 전파 -> p.18 죽은 코드 제거
    S0 = quads("t0 = x + x\ny = t0 * x\nt2 = x + x\nt3 = t2 == y")
    S1 = quads("t0 = x + x\ny = t0 * x\nt2 = t0\nt3 = t2 == y")
    S2 = quads("t0 = x + x\ny = t0 * x\nt2 = t0\nt3 = t0 == y")
    S3 = quads("t0 = x + x\ny = t0 * x\nt3 = t0 == y")
    for after in (S1, S2, S3):
        assert same(S0, after, ["y", "t3"], ["x"], rng)
    # 분석 코드가 같은 차례로 같은 결과를 낸다
    assert available(S0)[0] == S2
    assert live(S2, {"y", "t3"})[0] == S3

    # p.14의 조건: 두 대입 사이에 a, b, v0가 바뀌면 안 된다
    BAD0 = quads("v0 = a + b\na = a + 1\nv1 = a + b")
    BAD1 = quads("v0 = a + b\na = a + 1\nv1 = v0")
    assert not same(BAD0, BAD1, ["v1"], ["a", "b"], rng)
    BAD2 = quads("v0 = a + b\nv0 = 0\nv1 = a + b")
    BAD3 = quads("v0 = a + b\nv0 = 0\nv1 = v0")
    assert not same(BAD2, BAD3, ["v1"], ["a", "b"], rng)
    assert available(BAD0)[0] == BAD0 and available(BAD2)[0] == BAD2

    # p.16의 조건: v0 = v1 뒤에 v1이 바뀌면 복사 전파를 못 한다
    C0 = quads("v0 = v1\nv1 = v1 + 1\na = v0 * 2")
    C1 = quads("v0 = v1\nv1 = v1 + 1\na = v1 * 2")
    assert not same(C0, C1, ["a"], ["v1"], rng)
    assert available(C0)[0] == C0

    # p.19 산술 단순화: 정수에서 a * 2 = a << 1
    for a in range(-1000, 1001):
        assert a * 2 == a << 1
    assert simplify(quads("x = a * 2")) == quads("x = a << 1")
    assert same(quads("x = a * 2"), quads("x = a << 1"), ["x"], ["a"], rng)
    # p.19 상수 접기
    assert fold(quads("x = 10 * 2")) == quads("x = 20")
    # p.11: t0 = 10 + 100; y = t0  ->  y = 110  (상수 접기 + 복사 전파 + 죽은 코드 제거)
    B = quads("t0 = 10 + 100\ny = t0\nt1 = x == 10")
    step = live(available(fold(B))[0], {"y", "t1", "x"})[0]
    assert [show(q) for q in step] == ["y = 110", "t1 = x == 10"]

    # p.5 -> p.6: 아홉 줄을 네 줄로. 실행 결과(b1, b2, b3)가 같다
    P5 = quads("""t0 = x + x
t1 = t0 < y
b1 = t1
t2 = x + x
t3 = t2 == y
b2 = t3
t4 = x + x
t5 = t4 > y
b3 = t5""")
    P6 = quads("t0 = x + x\nb1 = t0 < y\nb2 = t0 == y\nb3 = t0 > y")
    assert same(P5, P6, ["b1", "b2", "b3"], ["x", "y"], rng)
    # 이 강의의 두 분석만으로는 일곱 줄까지 줄어든다(b1 = t1 꼴의 복사가 남는다)
    mine = live(available(P5)[0], {"b1", "b2", "b3"})[0]
    assert [show(q) for q in mine] == ["t0 = x + x", "t1 = t0 < y", "b1 = t1",
                                       "t3 = t0 == y", "b2 = t3", "t5 = t0 > y", "b3 = t5"]
    assert same(P5, mine, ["b1", "b2", "b3"], ["x", "y"], rng)

    # p.20 연습(보충): t4만 뒤에서 쓰인다
    P20 = quads("t0 = a * a\nt1 = a * a\nt2 = t0 + t1\nt3 = t0 + t0\nt4 = t3 + 1")
    s1 = available(P20)[0]
    assert [show(q) for q in s1] == ["t0 = a * a", "t1 = t0", "t2 = t0 + t0", "t3 = t2", "t4 = t2 + 1"]
    s2 = live(s1, {"t4"})[0]
    assert [show(q) for q in s2] == ["t0 = a * a", "t2 = t0 + t0", "t4 = t2 + 1"]
    s3 = simplify(quads("t2 = t0 * 2"))            # t0 + t0 를 t0 * 2 로 보면 시프트로도 쓸 수 있다
    for a in range(-50, 51):
        assert run(P20, {"a": a})[1]["t4"] == run(s2, {"a": a})[1]["t4"] == 2 * a * a + 1
        assert (a * a) + (a * a) == (a * a) << 1
    assert show(s3[0]) == "t2 = t0 << 1"

    # 카드 C2: x = y * 2 가 죽은 코드인지는 뒤에서 x를 쓰는지에 달렸다
    K = quads("x = y * 2\nz = y + 1")
    assert [show(q) for q in live(K, {"z"})[0]] == ["z = y + 1"]
    assert live(K, {"z", "x"})[0] == K
    # 카드 C3 (apply): 네 기법을 차례로
    C3 = quads("t0 = 4 * 2\nt1 = b + c\nt2 = b + c\nt3 = t1 * t0\nd = t2\ne = d + t3")
    r = live(available(fold(C3))[0], {"e"})[0]
    assert [show(q) for q in r] == ["t1 = b + c", "t3 = t1 * 8", "e = t1 + t3"]
    assert same(C3, r, ["e"], ["b", "c"], rng)

    print("ALL CHECKS PASSED")
```
{% endraw %}
