---
layout: "note"
title: "44_global-live-variable-analysis_impl.py"
display_title: "44_global-live-variable-analysis_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "44"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "프로그래밍과 알고리즘"
parent_url: "/studies/compilers/global-live-variable-analysis/"
parent_title: "전역 생존 변수 분석"
description: "컴파일러 · 전역 생존 변수 분석 구현 코드"
permalink: "/studies/compilers/code/44_global-live-variable-analysis_impl/"
---
{% raw %}
[전역 생존 변수 분석](/Hongs_Blog/studies/compilers/global-live-variable-analysis/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 전역 생존 변수 분석과 전역 죽은 코드 제거.
# 실행: python3 44_global-live-variable-analysis_impl.py  (표준 라이브러리만 쓴다)
# 슬라이드 13회 p.5~19의 집합과 결과 코드를 그대로 다시 만든다.
# 문장 표기: "a = c + d", "d = -a", "b = 3", "c = a", "return d"
import random


def parse(s):
    """문장 문자열 -> (쓰는 변수 또는 None, 연산, 피연산자들)."""
    t = s.split()
    if t[0] == "return":
        return (None, "ret", (t[1],))
    dst, rhs = t[0], t[2:]
    if len(rhs) == 3:
        return (dst, rhs[1], (rhs[0], rhs[2]))
    if rhs[0].startswith("-") and not rhs[0][1:].isdigit():
        return (dst, "neg", (rhs[0][1:],))
    return (dst, "copy", (rhs[0],))


def is_var(x):
    return not x.lstrip("-").isdigit()


def uses(st):
    return {x for x in st[2] if is_var(x)}


def block_points(stmts, out):
    """블록을 뒤에서부터 훑어 문장 앞뒤 지점마다 살아 있는 변수 집합을 돌려준다.
    결과[i] = i번째 문장 바로 앞, 결과[-1] = 블록 끝."""
    pts = [set(out)]
    live = set(out)
    for s in reversed(stmts):
        st = parse(s)
        if st[0] is not None:
            live.discard(st[0])      # 덮어쓰는 변수는 그 앞에서 죽는다
        live |= uses(st)             # 읽는 변수는 그 앞에서 산다
        pts.append(set(live))
    return pts[::-1]


def liveness(blocks, succ, boundary, order=None, trace=None):
    """고정점까지 되풀이한다. boundary[b] = b에서 바깥으로 나갈 때 살아 있는 변수.
    돌려주는 값: (IN, OUT, 되풀이 횟수)."""
    order = order or list(blocks)[::-1]
    IN = {b: set() for b in blocks}
    OUT = {b: set() for b in blocks}
    rounds = 0
    while True:
        rounds += 1
        changed = False
        for b in order:
            out = set(boundary.get(b, set()))
            for s in succ.get(b, []):
                out |= IN[s]         # 다음 블록들의 시작 집합을 합친다
            new_in = block_points(blocks[b], out)[0]
            if out != OUT[b] or new_in != IN[b]:
                changed = True
            OUT[b], IN[b] = out, new_in
        if trace is not None:
            trace.append({b: block_points(blocks[b], OUT[b]) for b in blocks})
        if not changed:
            return IN, OUT, rounds


def dead_code_elimination(blocks, succ, boundary):
    """분석 -> 죽은 대입 지우기를 더 지울 것이 없을 때까지 되풀이한다."""
    blocks = {b: list(v) for b, v in blocks.items()}
    while True:
        IN, OUT, _ = liveness(blocks, succ, boundary)
        removed = False
        for b in blocks:
            pts = block_points(blocks[b], OUT[b])
            keep = []
            for i, s in enumerate(blocks[b]):
                dst = parse(s)[0]
                if dst is not None and dst not in pts[i + 1]:
                    removed = True   # 쓴 값이 뒤에서 안 쓰인다
                else:
                    keep.append(s)
            blocks[b] = keep
        if not removed:
            return blocks, IN, OUT


def run(blocks, succ, start, env, choices, max_steps=50):
    """choices[k] = k번째로 갈림길을 만났을 때 고를 번호. (끝난 블록, 환경, return 값)을 돌려준다."""
    env = dict(env)
    b, k, last = start, 0, start
    for _ in range(max_steps):
        last = b
        for s in blocks[b]:
            dst, op, args = parse(s)
            v = [env[x] if is_var(x) else int(x) for x in args]
            if op == "ret":
                return b, env, v[0]
            env[dst] = {"+": lambda: v[0] + v[1], "-": lambda: v[0] - v[1],
                        "*": lambda: v[0] * v[1], "neg": lambda: -v[0],
                        "copy": lambda: v[0]}[op]()
        nxt = succ.get(b, [])
        if not nxt:
            return b, env, None
        if len(nxt) == 1 and b not in EXITS:
            b = nxt[0]               # 갈림길이 아니면 그냥 넘어간다
            continue
        if k >= len(choices):
            return b, env, None
        pick = choices[k] % (len(nxt) + (1 if b in EXITS else 0))
        k += 1
        if pick == len(nxt):
            return b, env, None      # 고리 밖으로 나간다
        b = nxt[pick]
    return last, env, None       # 걸음 수를 다 썼다: 마지막으로 끝까지 돈 블록


EXITS = set()

if __name__ == "__main__":
    S = lambda *xs: set(xs)

    # ---- 단순한 예 (p.5~11) ----
    blocks = {"B1": ["a = c + d"], "B2": ["b = b + c", "d = a + c"],
              "B3": ["c = a + b"], "B4": ["a = a + b", "d = b + b", "return d"]}
    succ = {"B1": ["B2", "B3"], "B2": ["B4"], "B3": ["B4"]}
    IN, OUT, _ = liveness(blocks, succ, {})
    # 지우기 전의 집합
    assert block_points(blocks["B4"], OUT["B4"]) == [S("a", "b"), S("b"), S("d"), S()]
    opt, IN2, OUT2 = dead_code_elimination(blocks, succ, {})
    assert opt == {"B1": [], "B2": ["b = b + c"], "B3": [], "B4": ["d = b + b", "return d"]}
    # p.6: {b} d = b + b {d} return d {}
    assert block_points(opt["B4"], OUT2["B4"]) == [S("b"), S("d"), S()]
    # p.8: {b, c} b = b + c {b} / 오른쪽 블록은 {b}
    assert block_points(opt["B2"], OUT2["B2"]) == [S("b", "c"), S("b")]
    assert IN2["B3"] == OUT2["B3"] == S("b")
    # p.9~10: 첫 블록 끝 = {b, c} ∪ {b} = {b, c}, a = c + d는 지워진다
    assert OUT2["B1"] == IN2["B2"] | IN2["B3"] == S("b", "c") and IN2["B1"] == S("b", "c")
    # 지우기 전후의 return 값이 두 길 모두에서 같다
    rnd = random.Random(1)
    for _ in range(500):
        env = {v: rnd.randint(-9, 9) for v in "abcd"}
        for ch in (0, 1):
            assert run(blocks, succ, "B1", env, [ch])[2] == run(opt, succ, "B1", env, [ch])[2]
    # p.11의 한 줄짜리 결과(b = b + c; d = b + c; return d)는 원래 프로그램과 다르다
    slide11 = {"B": ["b = b + c", "d = b + c", "return d"]}
    env = {"a": 0, "b": 1, "c": 2, "d": 0}
    left = run(blocks, succ, "B1", env, [0])[2]
    right = run(blocks, succ, "B1", env, [1])[2]
    got = run(slide11, {}, "B", env, [])[2]
    assert (left, right, got) == (6, 2, 5)
    # d = b + b로 바로잡아도 오른쪽 길(b를 안 고치는 길)에서는 값이 다르다
    fixed_line = {"B": ["b = b + c", "d = b + b", "return d"]}
    assert run(fixed_line, {}, "B", env, [])[2] == 6 != right

    # ---- 고리가 있는 예 (p.12~19) ----
    blocks = {"B1": ["a = c + d"], "B2": ["b = b + c", "d = a + c"],
              "B3": ["c = a + b"], "B4": ["a = a + b", "d = b + b"]}
    succ = {"B1": ["B2", "B3"], "B2": ["B4"], "B3": ["B4"], "B4": ["B1"]}
    boundary = {"B4": {"d"}}         # 고리 다음 블록의 시작 집합 {d} (p.13)
    trace = []
    IN, OUT, rounds = liveness(blocks, succ, boundary, order=["B4", "B2", "B3", "B1"], trace=trace)
    assert rounds == 3               # 두 번째에 바뀌고 세 번째에 그대로다
    # p.14: 첫 바퀴 (고리 끝 블록의 끝 집합을 {d}로 두고)
    assert trace[0] == {"B1": [S("b", "c", "d"), S("a", "b", "c")],
                        "B2": [S("a", "b", "c"), S("a", "b", "c"), S("a", "b")],
                        "B3": [S("a", "b"), S("a", "b")],
                        "B4": [S("a", "b"), S("b"), S("d")]}
    # p.15~16: 끝 집합을 {d} ∪ {b, c, d}로 고치고 한 바퀴 더
    assert trace[1] == {"B1": [S("b", "c", "d"), S("a", "b", "c")],
                        "B2": [S("a", "b", "c"), S("a", "b", "c"), S("a", "b", "c")],
                        "B3": [S("a", "b"), S("a", "b", "c")],
                        "B4": [S("a", "b", "c"), S("b", "c"), S("b", "c", "d")]}
    assert trace[2] == trace[1]
    # p.18~19: 죽은 코드 제거 뒤
    opt, IN2, OUT2 = dead_code_elimination(blocks, succ, boundary)
    assert opt == {"B1": ["a = c + d"], "B2": ["b = b + c"], "B3": ["c = a + b"], "B4": ["d = b + b"]}
    assert block_points(opt["B1"], OUT2["B1"]) == [S("b", "c", "d"), S("a", "b", "c")]
    assert block_points(opt["B2"], OUT2["B2"]) == [S("b", "c"), S("b", "c")]
    assert block_points(opt["B3"], OUT2["B3"]) == [S("a", "b"), S("b", "c")]
    assert block_points(opt["B4"], OUT2["B4"]) == [S("b", "c"), S("b", "c", "d")]
    # 고리를 한 번만 보고 지우면 틀린다: 끝 집합 {d}로는 c = a + b가 죽은 코드로 보인다
    first = trace[0]
    assert "c" not in first["B3"][1]
    # 실행 비교: 고리를 몇 바퀴 돌든 나갈 때의 d가 같다
    EXITS.add("B4")
    for _ in range(2000):
        env = {v: rnd.randint(-5, 5) for v in "abcd"}
        ch = [rnd.randint(0, 5) for _ in range(rnd.randint(1, 12))]
        e1 = run(blocks, succ, "B1", env, ch)
        e2 = run(opt, succ, "B1", env, ch)
        assert e1[0] == e2[0]
        if e1[0] == "B4":
            assert e1[1]["d"] == e2[1]["d"]
    EXITS.clear()

    # ---- 무작위 제어 흐름 그래프: 지운 뒤에도 살아 있는 변수의 값이 같다 ----
    VARS = "abcd"
    for trial in range(1500):
        n = rnd.randint(2, 5)
        names = [f"N{i}" for i in range(n)]
        blocks = {}
        for b in names:
            st = []
            for _ in range(rnd.randint(0, 3)):
                x, y, z = (rnd.choice(VARS) for _ in range(3))
                st.append(f"{x} = {y} {rnd.choice('+-')} {z}" if rnd.random() < 0.8 else f"{x} = {y}")
            blocks[b] = st
        succ = {b: rnd.sample(names, rnd.randint(0, 2)) for b in names}
        boundary = {b: set(rnd.sample(VARS, rnd.randint(0, 2))) for b in names if not succ[b]}
        opt, IN2, OUT2 = dead_code_elimination(blocks, succ, boundary)
        assert all(len(opt[b]) <= len(blocks[b]) for b in names)
        for _ in range(8):
            env = {v: rnd.randint(-3, 3) for v in VARS}
            ch = [rnd.randint(0, 1) for _ in range(rnd.randint(0, 6))]
            e1 = run(blocks, succ, "N0", env, ch, max_steps=20)
            e2 = run(opt, succ, "N0", env, ch, max_steps=20)
            assert e1[0] == e2[0]
            for v in OUT2[e1[0]]:
                assert e1[1][v] == e2[1][v], (blocks, succ, boundary, opt)

    # ---- 카드 C2: 단순한 예에서 마지막 블록을 d = b + b; return a로 바꾼 것 ----
    blocks = {"B1": ["a = c + d"], "B2": ["b = b + c", "d = a + c"], "B3": ["c = a + b"], "B4": ["d = b + b", "return a"]}
    succ = {"B1": ["B2", "B3"], "B2": ["B4"], "B3": ["B4"]}
    opt, IN2, OUT2 = dead_code_elimination(blocks, succ, {})
    assert opt == {"B1": ["a = c + d"], "B2": [], "B3": [], "B4": ["return a"]}
    assert IN2["B4"] == IN2["B2"] == IN2["B3"] == OUT2["B1"] == {"a"} and IN2["B1"] == {"c", "d"}
    print("ALL CHECKS PASSED")
```
{% endraw %}
