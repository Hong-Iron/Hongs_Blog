---
layout: "note"
title: "45_global-available-expressions_impl.py"
display_title: "45_global-available-expressions_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "45"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/global-available-expressions/"
parent_title: "전역 사용 가능한 식 분석"
description: "컴파일러 · 전역 사용 가능한 식 분석 구현 코드"
permalink: "/studies/compilers/code/45_global-available-expressions_impl/"
---
{% raw %}
[전역 사용 가능한 식 분석](/Hongs_Blog/studies/compilers/global-available-expressions/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 전역 사용 가능한 식 분석과 전역 복사 전파·공통 부분식 제거.
# 실행: python3 45_global-available-expressions_impl.py  (표준 라이브러리만 쓴다)
# 슬라이드 13회 p.20~35의 집합과 결과 코드를 그대로 다시 만든다.
# 식은 문장 문자열 그대로 다룬다: "a = 1", "b = a + c".
import random


def parse(s):
    t = s.split()
    return t[0], tuple(t[2:])          # (왼쪽 변수, 오른쪽 토큰들)


def is_var(x):
    return x.isalpha() or (x[0].isalpha() and x[1:].isdigit())


def mentions(expr, v):
    dst, rhs = parse(expr)
    return dst == v or v in rhs


def transfer(avail, stmt):
    """문장 하나를 지난 뒤의 사용 가능한 식 집합."""
    dst, rhs = parse(stmt)
    out = {e for e in avail if not mentions(e, dst)}   # dst가 들어 있는 식은 무효
    if dst not in rhs:                                 # b = 1 + b 꼴은 지난 뒤에 참이 아니다
        out.add(stmt)
    return out


def rewrite(avail, stmt):
    """복사 전파(상수 포함)와 공통 부분식 제거를 한 문장에 적용한다."""
    dst, rhs = parse(stmt)
    rhs = list(rhs)
    for i, x in enumerate(rhs):
        if is_var(x):
            for e in sorted(avail):
                d2, r2 = parse(e)
                if d2 == x and len(r2) == 1:           # x = y 또는 x = 상수
                    rhs[i] = r2[0]
                    break
    if len(rhs) == 3:
        for e in sorted(avail):
            d2, r2 = parse(e)
            if list(r2) == rhs and d2 != dst:          # 오른쪽이 같은 식이 이미 있다
                rhs = [d2]
                break
    return f"{dst} = {' '.join(rhs)}"


def block_points(stmts, start):
    pts = [set(start)]
    for s in stmts:
        pts.append(transfer(pts[-1], s))
    return pts


def analyze(blocks, pred, entry_in, order=None, trace=None):
    """고정점까지 되풀이한다. entry_in[b] = 바깥에서 b로 들어올 때의 집합.
    아직 계산하지 않은 앞 블록은 교집합에서 뺀다(낙관적으로 시작)."""
    order = order or list(blocks)
    IN = {b: None for b in blocks}
    OUT = {b: None for b in blocks}
    rounds = 0
    while True:
        rounds += 1
        changed = False
        for b in order:
            sets = [OUT[p] for p in pred.get(b, []) if OUT[p] is not None]
            if b in entry_in:
                sets.append(set(entry_in[b]))
            if not sets:
                continue
            new_in = set.intersection(*sets)           # 앞 블록들 결과의 교집합
            new_out = block_points(blocks[b], new_in)[-1]
            if new_in != IN[b] or new_out != OUT[b]:
                changed = True
            IN[b], OUT[b] = new_in, new_out
        if trace is not None:
            trace.append({b: (None if IN[b] is None else block_points(blocks[b], IN[b])) for b in blocks})
        if not changed:
            return IN, OUT, rounds


def optimize(blocks, pred, entry_in, order=None):
    """분석 -> 문장 고치기를 더 바뀌지 않을 때까지 되풀이한다."""
    blocks = {b: list(v) for b, v in blocks.items()}
    while True:
        IN, OUT, _ = analyze(blocks, pred, entry_in, order)
        new = {}
        for b in blocks:
            if IN[b] is None:
                new[b] = blocks[b]
                continue
            av, out = set(IN[b]), []
            for s in blocks[b]:
                s2 = rewrite(av, s)
                out.append(s2)
                av = transfer(av, s2)
            new[b] = out
        if new == blocks:
            return blocks, IN, OUT
        blocks = new


def ev(rhs, env):
    v = [env[x] if is_var(x) else (x if x in "+-*" else int(x)) for x in rhs]
    if len(v) == 1:
        return v[0]
    return {"+": v[0] + v[2], "-": v[0] - v[2], "*": v[0] * v[2]}[v[1]]


def run(blocks, succ, start, env, choices, IN=None, max_steps=15):
    """IN을 주면 블록에 들어설 때마다 그 집합의 식이 실제로 참인지 확인한다."""
    env = dict(env)
    b, k = start, 0
    for _ in range(max_steps):
        if IN is not None and IN[b] is not None:
            for e in IN[b]:
                d, r = parse(e)
                assert env[d] == ev(r, env), (e, b)
        for s in blocks[b]:
            d, r = parse(s)
            env[d] = ev(r, env)
        nxt = succ.get(b, [])
        if not nxt or k >= len(choices):
            break
        b = nxt[choices[k] % len(nxt)]
        k += 1
    return env


if __name__ == "__main__":
    # ---- 복습 표 (p.20): t0 = a * a 뒤에 t0 = a + b ----
    pts = block_points(["t0 = a * a", "t0 = a + b"], set())
    assert pts == [set(), {"t0 = a * a"}, {"t0 = a + b"}]

    # ---- 단순한 예 (p.21~27) ----
    blocks = {"B1": ["a = 1", "b = a + b"], "B2": ["b = a + c"], "B3": ["c = a + b"], "B4": ["d = b + c"]}
    succ = {"B1": ["B2", "B3"], "B2": ["B4"], "B3": ["B4"]}
    pred = {"B2": ["B1"], "B3": ["B1"], "B4": ["B2", "B3"]}
    opt, IN, OUT = optimize(blocks, pred, {"B1": set()})
    assert opt == {"B1": ["a = 1", "b = 1 + b"], "B2": ["b = 1 + c"], "B3": ["c = 1 + b"], "B4": ["d = b + c"]}  # p.27
    # p.22: {} a = 1 {a = 1} b = 1 + b {a = 1}
    assert block_points(opt["B1"], IN["B1"]) == [set(), {"a = 1"}, {"a = 1"}]
    # p.24
    assert OUT["B2"] == {"a = 1", "b = 1 + c"} and OUT["B3"] == {"a = 1", "c = 1 + b"}
    # p.25: 다음 블록의 시작 집합은 교집합
    assert IN["B4"] == OUT["B2"] & OUT["B3"] == {"a = 1"}
    # p.26
    assert OUT["B4"] == {"a = 1", "d = b + c"}
    # 합집합으로 잘못 합치면: 왼쪽 길로 왔는데 c = 1 + b가 참이라고 믿게 된다
    wrong = OUT["B2"] | OUT["B3"]
    env = run(opt, succ, "B1", {"a": 0, "b": 5, "c": 7, "d": 0}, [0], max_steps=2)  # B1 -> B2까지
    assert "c = 1 + b" in wrong and env["c"] != 1 + env["b"]

    # ---- 고리가 있는 예 (p.28~35) ----
    blocks = {"B1": ["b = a + b"], "B2": ["b = a + c"], "B3": ["c = a + b"], "B4": ["a = b + c"]}
    succ = {"B1": ["B2", "B3"], "B2": ["B4"], "B3": ["B4"], "B4": ["B1"]}
    pred = {"B1": ["B4"], "B2": ["B1"], "B3": ["B1"], "B4": ["B2", "B3"]}
    entry = {"B1": {"a = 1"}}          # 고리 앞 블록의 결과 (p.29)
    trace = []
    IN, OUT, rounds = analyze(blocks, pred, entry, order=["B1", "B2", "B3", "B4"], trace=trace)
    assert rounds == 3
    # p.30: 첫 바퀴
    assert trace[0] == {"B1": [{"a = 1"}, {"a = 1"}],
                        "B2": [{"a = 1"}, {"a = 1", "b = a + c"}],
                        "B3": [{"a = 1"}, {"a = 1", "c = a + b"}],
                        "B4": [{"a = 1"}, {"a = b + c"}]}
    # p.31: 고리 첫 블록의 시작 집합 = {a = 1} ∩ {a = b + c} = {}
    assert {"a = 1"} & trace[0]["B4"][-1] == set()
    # p.32, p.34: 둘째 바퀴
    assert trace[1] == {"B1": [set(), set()],
                        "B2": [set(), {"b = a + c"}],
                        "B3": [set(), {"c = a + b"}],
                        "B4": [set(), {"a = b + c"}]}
    assert trace[2] == trace[1]
    # p.35: 고칠 것이 없다
    opt, _, _ = optimize(blocks, pred, entry, order=["B1", "B2", "B3", "B4"])
    assert opt == blocks
    # 첫 바퀴만 보고 a를 1로 바꾸면 틀린다: 고리를 한 바퀴 돌면 a는 1이 아니다
    hasty = dict(blocks, B1=["b = 1 + b"])
    start = {"a": 1, "b": 2, "c": 3}
    path = [0, 0, 0]                   # B1 B2 B4 B1
    good = run(blocks, succ, "B1", start, path)
    bad = run(hasty, succ, "B1", start, path)
    assert good["b"] != bad["b"]
    assert run(blocks, succ, "B1", start, [0, 0])["a"] == 7      # 둘째로 B1에 올 때 a는 1이 아니다

    # ---- 무작위 그래프: 집합의 식은 실제로 참이고, 고친 뒤에도 모든 변수 값이 같다 ----
    rnd = random.Random(7)
    VARS = "abcd"
    changed_any = 0
    for trial in range(1500):
        n = rnd.randint(2, 5)
        names = [f"N{i}" for i in range(n)]
        blocks = {}
        for b in names:
            st = []
            for _ in range(rnd.randint(0, 3)):
                x = rnd.choice(VARS)
                r = rnd.random()
                if r < 0.2:
                    st.append(f"{x} = {rnd.randint(0, 3)}")
                elif r < 0.35:
                    st.append(f"{x} = {rnd.choice(VARS)}")
                else:
                    st.append(f"{x} = {rnd.choice(VARS)} {rnd.choice('+-')} {rnd.choice(VARS)}")
            blocks[b] = st
        succ = {b: rnd.sample(names, rnd.randint(0, 2)) for b in names}
        pred = {}
        for b, ss in succ.items():
            for s in ss:
                pred.setdefault(s, []).append(b)
        opt, IN, OUT = optimize(blocks, pred, {"N0": set()})
        changed_any += opt != blocks
        for _ in range(6):
            env = {v: rnd.randint(-3, 3) for v in VARS}
            ch = [rnd.randint(0, 1) for _ in range(rnd.randint(0, 8))]
            e2 = run(opt, succ, "N0", env, ch, IN=IN)   # 집합이 참인지 확인하며 돈다
            e1 = run(blocks, succ, "N0", env, ch)
            assert e1 == e2, (blocks, succ, opt)
    assert changed_any > 100

    # ---- 카드 C1: 두 길이 같은 식을 만들면 교집합에 남는다 ----
    blocks = {"B1": ["a = 1"], "B2": ["c = a + b"], "B3": ["c = a + b"], "B4": ["d = a + b"]}
    pred = {"B2": ["B1"], "B3": ["B1"], "B4": ["B2", "B3"]}
    opt, IN, OUT = optimize(blocks, pred, {"B1": set()})
    assert IN["B4"] == {"a = 1", "c = 1 + b"}
    assert opt == {"B1": ["a = 1"], "B2": ["c = 1 + b"], "B3": ["c = 1 + b"], "B4": ["d = c"]}
    print("ALL CHECKS PASSED")
```
{% endraw %}
