---
layout: "note"
title: "49_activation-record_verify.py"
display_title: "49_activation-record_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "49"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/activation-record/"
parent_title: "활성 레코드"
description: "컴파일러 · 활성 레코드 검증 코드"
sitemap: false
permalink: "/studies/compilers/code/49_activation-record_verify/"
---
{% raw %}
[활성 레코드](/Hongs_Blog/studies/compilers/activation-record/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 활성 레코드: 함수 한 번의 실행에 필요한 것을 스택에 모아 둔 덩어리.
# 실행: python3 49_activation-record_verify.py  (표준 라이브러리만 쓴다)
# 문서의 3주소 코드를 활성 레코드만으로 실행해 스택 그림을 다시 만든다.

TAC = [
    "begin fib",            # 0
    "t0 = n <= 1",          # 1
    "if t0 goto L0",        # 2
    "t1 = n - 1",           # 3
    "param t1",             # 4
    "t2 = call fib, 1",     # 5
    "t3 = n - 2",           # 6
    "param t3",             # 7
    "t4 = call fib, 1",     # 8
    "t5 = t2 + t4",         # 9
    "return t5",            # 10
    "L0:",                  # 11
    "return n",             # 12
    "end fib",              # 13
    "begin main",           # 14
    "param 1",              # 15
    "t0 = call fib, 1",     # 16
    "a = t0",               # 17
    "end main",             # 18
]
LOCALS = {"fib": ["t0", "t1", "t2", "t3", "t4", "t5"], "main": ["a", "t0"]}
PARAMS = {"fib": ["n"], "main": []}


def make_record(func, args, link, ret_addr):
    """문서의 칸 순서: 반환값, 입력 인자, 제어 링크, 저장한 기계 상태, 지역·임시 변수.
    main의 레코드는 문서 그림처럼 지역 변수 칸만 둔다."""
    cells = []
    if func != "main":
        cells.append(["(result)", None])
        cells += [[p, v] for p, v in zip(PARAMS[func], args)]
        cells.append(["control link", link])
        cells.append(["return address", ret_addr])
    cells += [[v, None] for v in LOCALS[func]]
    return cells


def run(tac, first_arg=None, watch=None):
    """스택(칸의 목록)만으로 3주소 코드를 실행한다. 스택의 뒤쪽이 꼭대기다.
    frames = 실행 중인 레코드들의 (함수 이름, 시작 칸 번호)."""
    tac = list(tac)
    if first_arg is not None:
        tac[15] = f"param {first_arg}"
    start = {t.split()[1]: i for i, t in enumerate(tac) if t.startswith("begin")}
    labels = {t[:-1]: i for i, t in enumerate(tac) if t.endswith(":")}
    stack, frames, pending = [], [], []
    stack += make_record("main", [], None, None)
    frames.append(("main", 0))
    pc = start["main"] + 1
    max_cells = len(stack)
    snaps = {}

    def find(name):
        f, base = frames[-1]
        for i in range(base, len(stack)):
            if stack[i][0] == name:
                return i
        raise KeyError(name)

    def val(x):
        return int(x) if x.lstrip("-").isdigit() else stack[find(x)][1]

    while True:
        ins = tac[pc]
        t = ins.replace(",", "").split()
        if watch and pc in watch and pc not in snaps:
            snaps[pc] = [list(c) for c in stack]
        pc += 1
        if ins.endswith(":"):
            continue
        if t[0] == "end":
            if t[1] == "main":
                return stack, snaps, max_cells
        elif t[0] == "param":
            pending.append(val(t[1]))
        elif t[0] == "if":
            if val(t[1]):
                pc = labels[t[3]]
        elif t[0] == "return":
            v = val(t[1])
            f, base = frames.pop()
            stack[base][1] = v                      # 반환값 칸을 채운다
            ret = stack[base + 1 + len(PARAMS[f]) + 1][1]
            link = stack[base + 1 + len(PARAMS[f])][1]
            assert link == frames[-1][1]            # 제어 링크는 부른 쪽 레코드를 가리킨다
            del stack[base + 1:]                    # 레코드를 걷는다 (반환값만 잠깐 남겨 둔다)
            dst = tac[ret - 1].split()[0]
            result = stack.pop()[1]
            stack[find(dst)][1] = result            # 돌아간 자리에서 반환값을 옮긴다
            pc = ret
        elif len(t) >= 4 and t[2] == "call":
            f, n = t[3], int(t[4])
            args, pending[:] = pending[-n:], pending[:-n]
            base = len(stack)
            stack += make_record(f, args, frames[-1][1], pc)
            frames.append((f, base))
            max_cells = max(max_cells, len(stack))
            pc = start[f] + 1
        elif len(t) == 3:
            stack[find(t[0])][1] = val(t[2])
        else:
            a, b = val(t[2]), val(t[4])
            stack[find(t[0])][1] = {"+": a + b, "-": a - b, "<=": a <= b}[t[3]]


if __name__ == "__main__":
    # ---- fib(1)의 활성 레코드 ----
    rec = make_record("fib", [1], 0, 17)
    assert [c[0] for c in rec] == ["(result)", "n", "control link", "return address",
                                   "t0", "t1", "t2", "t3", "t4", "t5"]
    assert rec[1] == ["n", 1] and len(rec) == 10

    # ---- main이 fib(1)을 부른다 ----
    stack, snaps, max_cells = run(TAC, watch={15, 1, 12})
    # main이 불렸을 때 스택에는 a, t0
    assert [c[0] for c in snaps[15]] == ["a", "t0"]
    # fib(1)이 불린 직후. main의 두 칸 아래에 fib의 열 칸
    s = snaps[1]
    assert [c[0] for c in s] == ["a", "t0", "(result)", "n", "control link", "return address",
                                 "t0", "t1", "t2", "t3", "t4", "t5"]
    assert s[3] == ["n", 1]
    assert s[4] == ["control link", 0]              # main의 레코드가 시작하는 칸
    assert s[5] == ["return address", 17] and TAC[17] == "a = t0" and TAC[16] == "t0 = call fib, 1"
    # return n 직전. fib의 t0 = true, t1~t5는 쓰이지 않았다
    s = snaps[12]
    assert s[6] == ["t0", True] and all(c[1] is None for c in s[7:])
    # 끝난 뒤. fib의 레코드는 사라지고 a = 1, t0 = 1
    assert stack == [["a", 1], ["t0", 1]]
    assert max_cells == 12

    # ---- 재귀: 같은 fib라도 부를 때마다 레코드가 따로 생긴다 ----
    def py_fib(n):
        return n if n <= 1 else py_fib(n - 1) + py_fib(n - 2)
    for n in range(0, 13):
        stack, _, max_cells = run(TAC, first_arg=n)
        assert stack[0] == ["a", py_fib(n)], n
        assert max_cells == 2 + 10 * max(n, 1)      # main 2칸 + 레코드 10칸 × 가장 깊은 겹 수
    # fib(3): 가장 깊을 때 n = 3, 2, 1의 레코드 셋이 함께 있다. n과 t0~t5가 저마다 따로다
    stack, snaps, _ = run(TAC, first_arg=3, watch={12})
    s = snaps[12]                                   # 처음으로 return n에 닿았을 때 = fib(1) 안
    ns = [c[1] for c in s if c[0] == "n"]
    links = [c[1] for c in s if c[0] == "control link"]
    assert ns == [3, 2, 1] and links == [0, 2, 12]

    # ---- 카드: main이 fib(2)를 불렀을 때, 처음 return n에 닿는 순간 ----
    stack, snaps, max_cells = run(TAC, first_arg=2, watch={12})
    s = snaps[12]
    assert len(s) == 22 and [c[1] for c in s if c[0] == "n"] == [2, 1]
    assert [c[1] for c in s if c[0] == "control link"] == [0, 2]
    assert [c[1] for c in s if c[0] == "return address"] == [17, 6]      # main의 a = t0, fib의 t3 = n - 2
    assert stack == [["a", 1], ["t0", 1]]
    print("ALL CHECKS PASSED")
```
{% endraw %}
