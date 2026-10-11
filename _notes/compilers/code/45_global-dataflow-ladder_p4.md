---
layout: "note"
title: "45_global-dataflow-ladder_p4.py"
display_title: "45_global-dataflow-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "45"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
parent_url: "/studies/compilers/global-dataflow-ladder/"
parent_title: "전역 분석 예제 사다리"
description: "컴파일러 · 전역 분석 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/compilers/code/45_global-dataflow-ladder_p4/"
---
{% raw %}
[전역 분석 예제 사다리](/Hongs_Blog/studies/compilers/global-dataflow-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 전역 분석 예제 사다리 문제 4: 고리가 있는 그래프에서 생존 변수 분석, 죽은 코드 제거, 사용 가능한 식.
# 실행: python3 45_global-dataflow-ladder_p4.py  (표준 라이브러리만 쓴다)
# 분석 함수는 44_global-live-variable-analysis_impl.py와 45_global-available-expressions_impl.py에서 복사했다.


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


def aparse(s):
    t = s.split()
    return t[0], tuple(t[2:])          # (왼쪽 변수, 오른쪽 토큰들)


def a_a_is_var(x):
    return x.isalpha() or (x[0].isalpha() and x[1:].isdigit())


def mentions(expr, v):
    dst, rhs = aparse(expr)
    return dst == v or v in rhs


def transfer(avail, stmt):
    """문장 하나를 지난 뒤의 사용 가능한 식 집합."""
    dst, rhs = aparse(stmt)
    out = {e for e in avail if not mentions(e, dst)}   # dst가 들어 있는 식은 무효
    if dst not in rhs:                                 # b = 1 + b 꼴은 지난 뒤에 참이 아니다
        out.add(stmt)
    return out


def rewrite(avail, stmt):
    """복사 전파(상수 포함)와 공통 부분식 제거를 한 문장에 적용한다."""
    dst, rhs = aparse(stmt)
    rhs = list(rhs)
    for i, x in enumerate(rhs):
        if a_is_var(x):
            for e in sorted(avail):
                d2, r2 = aparse(e)
                if d2 == x and len(r2) == 1:           # x = y 또는 x = 상수
                    rhs[i] = r2[0]
                    break
    if len(rhs) == 3:
        for e in sorted(avail):
            d2, r2 = aparse(e)
            if list(r2) == rhs and d2 != dst:          # 오른쪽이 같은 식이 이미 있다
                rhs = [d2]
                break
    return f"{dst} = {' '.join(rhs)}"


def avail_points(stmts, start):
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
            new_out = avail_points(blocks[b], new_in)[-1]
            if new_in != IN[b] or new_out != OUT[b]:
                changed = True
            IN[b], OUT[b] = new_in, new_out
        if trace is not None:
            trace.append({b: (None if IN[b] is None else avail_points(blocks[b], IN[b])) for b in blocks})
        if not changed:
            return IN, OUT, rounds


BLOCKS = {"B1": ["s = 0", "i = 0", "k = 9"],
          "B2": ["t = i + 1", "k = s + t"],
          "B3": ["s = s + t", "u = k + 1"],
          "B4": ["s = s - t"],
          "B5": ["i = t", "k = i + s"]}
SUCC = {"B1": ["B2"], "B2": ["B3", "B4"], "B3": ["B5"], "B4": ["B5"], "B5": ["B2"]}
PRED = {"B2": ["B1", "B5"], "B3": ["B2"], "B4": ["B2"], "B5": ["B3", "B4"]}
BOUNDARY = {"B5": {"s"}}              # 고리를 나간 뒤에는 s만 쓰인다


def execute(blocks, turns):
    """turns[k] = k번째 바퀴에서 B3(0)으로 갈지 B4(1)로 갈지. 바퀴를 다 돌고 나갈 때의 s."""
    env = {}

    def do(b):
        for st in blocks[b]:
            t = st.split()
            v = lambda x: int(x) if x.isdigit() else env[x]
            env[t[0]] = v(t[2]) if len(t) == 3 else {"+": v(t[2]) + v(t[4]), "-": v(t[2]) - v(t[4])}[t[3]]
    do("B1")
    for turn in turns:
        do("B2")
        do("B3" if turn == 0 else "B4")
        do("B5")
    return env["s"]


if __name__ == "__main__":
    S = lambda s: set(s.split())
    # (가) 생존 변수 분석: 첫 바퀴는 B5의 끝을 {s}로 두고, 둘째 바퀴에서 {s} ∪ {i, s}로 고친다
    trace = []
    IN, OUT, rounds = liveness(BLOCKS, SUCC, BOUNDARY, order=["B5", "B3", "B4", "B2", "B1"], trace=trace)
    assert rounds == 3
    assert trace[0]["B5"] == [S("s t"), S("i s"), S("s")]
    assert trace[1]["B5"] == [S("s t"), S("i s"), S("i s")] and trace[2] == trace[1]
    assert trace[1]["B2"] == [S("i s"), S("s t"), S("k s t")]
    assert trace[1]["B3"] == [S("k s t"), S("k s t"), S("s t")]
    assert trace[1]["B4"] == [S("s t"), S("s t")]
    assert trace[1]["B1"] == [S(""), S("s"), S("i s"), S("i s")]
    # 첫 바퀴와 둘째 바퀴에서 달라지는 곳은 B5의 끝 집합 하나뿐이다
    diff = [(b, i) for b in BLOCKS for i in range(len(trace[0][b])) if trace[0][b][i] != trace[1][b][i]]
    assert diff == [("B5", 2)]
    # (나) 죽은 코드 제거. 한 번에 보이는 것: u = k + 1, k = i + s, k = 9
    pts = trace[1]
    dead1 = [(b, s) for b in BLOCKS for i, s in enumerate(BLOCKS[b]) if s.split()[0] not in pts[b][i + 1]]
    assert dead1 == [("B1", "k = 9"), ("B3", "u = k + 1"), ("B5", "k = i + s")]
    # u = k + 1을 지운 뒤 다시 분석해야 k = s + t도 죽은 코드로 드러난다
    opt, IN2, OUT2 = dead_code_elimination(BLOCKS, SUCC, BOUNDARY)
    assert opt == {"B1": ["s = 0", "i = 0"], "B2": ["t = i + 1"], "B3": ["s = s + t"],
                   "B4": ["s = s - t"], "B5": ["i = t"]}
    assert sum(len(v) for v in BLOCKS.values()) - sum(len(v) for v in opt.values()) == 4
    # 고친 뒤에도 나갈 때의 s가 같다 (길이 0~6인 모든 길)
    from itertools import product
    for n in range(7):
        for turns in product((0, 1), repeat=n):
            assert execute(BLOCKS, turns) == execute(opt, turns)
    assert execute(BLOCKS, (0, 0, 1)) == 1 + 2 - 3 == 0
    # (다) 사용 가능한 식: B2의 시작 집합. 첫 바퀴에는 B1의 결과 그대로, 고정점에서는 빈 집합
    trace = []
    AIN, AOUT, rounds = analyze(BLOCKS, PRED, {"B1": set()}, order=["B1", "B2", "B3", "B4", "B5"], trace=trace)
    assert rounds == 3
    assert trace[0]["B2"][0] == {"s = 0", "i = 0", "k = 9"}
    assert trace[0]["B5"][-1] == {"i = t", "k = i + s"}
    assert AIN["B2"] == {"s = 0", "i = 0", "k = 9"} & {"i = t", "k = i + s"} == set()
    # 그래서 t = i + 1의 i를 0으로 바꾸면 안 된다: 두 바퀴째에 i는 1이다
    hasty = dict(BLOCKS, B2=["t = 0 + 1", "k = s + t"])
    assert execute(BLOCKS, (0, 0)) == 3 and execute(hasty, (0, 0)) == 2
    print("ALL CHECKS PASSED")
```
{% endraw %}
