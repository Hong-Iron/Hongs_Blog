---
layout: "note"
title: "52_codegen-simple-operations_impl.py"
display_title: "52_codegen-simple-operations_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "52"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/codegen-simple-operations/"
parent_title: "단순 연산과 분기의 코드 생성"
description: "컴파일러 · 단순 연산과 분기의 코드 생성 구현 코드"
permalink: "/studies/compilers/code/52_codegen-simple-operations_impl/"
---
{% raw %}
[단순 연산과 분기의 코드 생성](/Hongs_Blog/studies/compilers/codegen-simple-operations/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 3주소 코드 한 줄을 수업용 MIPS 명령 몇 줄로 바꾸기 (단순 연산, 비교, 분기).
# 실행: python3 52_codegen-simple-operations_impl.py  (표준 라이브러리만 쓴다)
# 슬라이드 15회 p.10~18의 어셈블리를 글자 그대로 다시 만들고, 흉내기로 돌려 3주소 코드와 같은 값을 내는지 본다.
# 흉내기(Machine)는 51_mips-instructions_impl.py의 것을 복사했다.
import re

CMP = {"eq": lambda a, b: a == b, "ne": lambda a, b: a != b, "gt": lambda a, b: a > b,
       "ge": lambda a, b: a >= b, "lt": lambda a, b: a < b, "le": lambda a, b: a <= b}
ARITH = {"add": lambda a, b: a + b, "sub": lambda a, b: a - b, "mul": lambda a, b: a * b,
         "div": lambda a, b: int(a / b)}


class Machine:
    def __init__(self, program, regs=None, mem=None):
        self.code = [ln.strip() for ln in program if ln.strip()]
        self.labels = {ln[:-1]: i for i, ln in enumerate(self.code) if ln.endswith(":")}
        self.reg = dict(regs or {})
        self.mem = dict(mem or {})
        self.pc = 0
        self.loads = self.stores = self.steps = 0

    def addr(self, s):
        off, base = re.fullmatch(r"(-?\d+)\((\$\w+)\)", s).groups()
        return self.reg[base] + int(off)

    def step(self):
        ln = self.code[self.pc]
        self.pc += 1
        if ln.endswith(":"):
            return
        self.steps += 1
        op, *a = ln.split()
        R = self.reg
        if op == "lw":
            R[a[0]] = self.mem[self.addr(a[1])]
            self.loads += 1
        elif op == "sw":
            self.mem[self.addr(a[1])] = R[a[0]]
            self.stores += 1
        elif op == "li":
            R[a[0]] = int(a[1])
        elif op in ARITH:
            R[a[0]] = ARITH[op](R[a[1]], R[a[2]])
        elif op[:-1] in ARITH and op.endswith("i"):
            R[a[0]] = ARITH[op[:-1]](R[a[1]], int(a[2]))
        elif op[0] == "s" and op[1:] in CMP:
            R[a[0]] = int(CMP[op[1:]](R[a[1]], R[a[2]]))
        elif op[0] == "s" and op.endswith("i") and op[1:-1] in CMP:
            R[a[0]] = int(CMP[op[1:-1]](R[a[1]], int(a[2])))
        elif op == "j":
            self.pc = self.labels[a[0]]
        elif op in ("beqz", "bnez"):
            if CMP[op[1:3]](R[a[0]], 0):
                self.pc = self.labels[a[1]]
        elif op[0] == "b" and op.endswith("i") and op[1:-1] in CMP:
            if CMP[op[1:-1]](R[a[0]], int(a[1])):
                self.pc = self.labels[a[2]]
        elif op[0] == "b" and op[1:] in CMP:
            if CMP[op[1:]](R[a[0]], R[a[1]]):
                self.pc = self.labels[a[2]]
        elif op == "jr":
            self.pc = R[a[0]]
        elif op == "jal":                    # 슬라이드에 없는 명령. 실제 MIPS의 jal처럼 돌아올 자리를 $ra에 넣고 뛴다
            R["$ra"] = self.pc
            self.pc = self.labels[a[0]]
        else:
            raise ValueError(ln)

    def run(self, limit=100000):
        while self.pc < len(self.code):
            self.step()
            limit -= 1
            assert limit > 0, "끝나지 않는다"
        return self


OPS = {"+": "add", "-": "sub", "*": "mul", "/": "div",
       "==": "seq", "!=": "sne", ">": "sgt", ">=": "sge", "<": "slt", "<=": "sle"}


def gen(tac, off):
    """3주소 코드 한 줄 -> 명령 목록. off[변수] = $sp에서 떨어진 바이트 수(심벌 테이블 구실).
    줄마다 레지스터 번호를 $r0부터 새로 쓴다."""
    t = tac.split()
    if tac.endswith(":"):
        return [tac]
    if t[0] == "goto":
        return [f"j {t[1]}"]
    if t[0] in ("if", "ifnot"):
        br = "bnez" if t[0] == "if" else "beqz"
        return [f"lw $r0 {off[t[1]]}($sp)", f"{br} $r0 {t[3]}"]
    dst, x, op, y = t[0], t[2], t[3], t[4]
    out = [f"lw $r0 {off[x]}($sp)"]
    if y.lstrip("-").isdigit():                      # 오른쪽이 상수면 즉시값 명령
        out.append(f"{OPS[op]}i $r1 $r0 {y}")
        res = "$r1"
    else:
        out.append(f"lw $r1 {off[y]}($sp)")
        out.append(f"{OPS[op]} $r2 $r0 $r1")
        res = "$r2"
    out.append(f"sw {res} {off[dst]}($sp)")
    return out


def gen_all(tacs, off):
    return [ln for t in tacs for ln in gen(t, off)]


def run_tac(tacs, env):
    """3주소 코드를 직접 실행한다(비교 기준)."""
    env = dict(env)
    labels = {t[:-1]: i for i, t in enumerate(tacs) if t.endswith(":")}
    pc = 0
    PY = {"+": lambda a, b: a + b, "-": lambda a, b: a - b, "*": lambda a, b: a * b,
          "<": lambda a, b: int(a < b), "<=": lambda a, b: int(a <= b), ">": lambda a, b: int(a > b),
          ">=": lambda a, b: int(a >= b), "==": lambda a, b: int(a == b), "!=": lambda a, b: int(a != b)}
    while pc < len(tacs):
        t = tacs[pc].split()
        pc += 1
        if tacs[pc - 1].endswith(":"):
            continue
        if t[0] == "goto":
            pc = labels[t[1]]
        elif t[0] in ("if", "ifnot"):
            if bool(env[t[1]]) == (t[0] == "if"):
                pc = labels[t[3]]
        else:
            v = lambda x: int(x) if x.lstrip("-").isdigit() else env[x]
            env[t[0]] = PY[t[3]](v(t[2]), v(t[4]))
    return env


if __name__ == "__main__":
    SP = 1000
    # ---- p.10~13: a = b + c (a는 $sp+12, b는 $sp+8, c는 $sp+4) ----
    off = {"a": 12, "b": 8, "c": 4}
    asm = gen("a = b + c", off)
    assert asm == ["lw $r0 8($sp)", "lw $r1 4($sp)", "add $r2 $r0 $r1", "sw $r2 12($sp)"]
    for b in range(-3, 4):
        for c in range(-3, 4):
            m = Machine(asm, {"$sp": SP}, {SP + 8: b, SP + 4: c}).run()
            assert m.mem[SP + 12] == b + c and (m.loads, m.stores) == (2, 1)

    m = Machine(asm, {"$sp": SP}, {SP + 8: 2, SP + 4: 5}).run()
    assert (m.reg["$r0"], m.reg["$r1"], m.reg["$r2"], m.mem[SP + 12]) == (2, 5, 7, 7)

    # ---- p.14: a = b < 3 (a는 $sp+8, b는 $sp+4) ----
    off = {"a": 8, "b": 4}
    asm = gen("a = b < 3", off)
    assert asm == ["lw $r0 4($sp)", "slti $r1 $r0 3", "sw $r1 8($sp)"]
    for b in range(0, 7):
        assert Machine(asm, {"$sp": SP}, {SP + 4: b}).run().mem[SP + 8] == int(b < 3)

    # ---- p.16: t0 = b < 3; if t0 goto L0; L0: ----
    off = {"t0": 8, "b": 4}
    asm = gen_all(["t0 = b < 3", "if t0 goto L0", "L0:"], off)
    assert asm == ["lw $r0 4($sp)", "slti $r1 $r0 3", "sw $r1 8($sp)",
                   "lw $r0 8($sp)", "bnez $r0 L0", "L0:"]

    # ---- p.17~18 연습: while (x < y) x = x + 1 (t0는 $sp+12, x는 $sp+8, y는 $sp+4) ----
    tac = ["L0:", "t0 = x < y", "ifnot t0 goto L1", "x = x + 1", "goto L0", "L1:"]
    off = {"t0": 12, "x": 8, "y": 4}
    asm = gen_all(tac, off)
    assert asm == ["L0:",
                   "lw $r0 8($sp)", "lw $r1 4($sp)", "slt $r2 $r0 $r1", "sw $r2 12($sp)",
                   "lw $r0 12($sp)", "beqz $r0 L1",
                   "lw $r0 8($sp)", "addi $r1 $r0 1", "sw $r1 8($sp)",
                   "j L0",
                   "L1:"]
    for x in range(-2, 6):
        for y in range(-2, 6):
            m = Machine(asm, {"$sp": SP}, {SP + 8: x, SP + 4: y}).run()
            env = run_tac(tac, {"x": x, "y": y})
            assert m.mem[SP + 8] == env["x"] == max(x, y)
            assert m.mem[SP + 12] == env["t0"] == 0
            k = max(0, y - x)                         # 고리를 도는 횟수
            assert (m.loads, m.stores) == (4 * k + 3, 2 * k + 1)
    # x = 0, y = 3: 세 바퀴에 메모리 읽기 15번, 쓰기 7번
    m = Machine(asm, {"$sp": SP}, {SP + 8: 0, SP + 4: 3}).run()
    assert (m.loads, m.stores) == (15, 7)
    # p.29: 방금 쓴 값을 바로 다시 읽는다 (sw $r2 12($sp) 다음 줄이 lw $r0 12($sp))
    assert asm[4] == "sw $r2 12($sp)" and asm[5] == "lw $r0 12($sp)"

    # ---- 무작위 직선 코드: 어셈블리와 3주소 코드가 같은 값을 낸다 ----
    import random
    rnd = random.Random(5)
    names = ["a", "b", "c", "d"]
    off = {v: 4 * (i + 1) for i, v in enumerate(names)}
    for _ in range(500):
        tac = []
        for _ in range(rnd.randint(1, 6)):
            y = rnd.choice(names) if rnd.random() < 0.6 else str(rnd.randint(-3, 3))
            tac.append(f"{rnd.choice(names)} = {rnd.choice(names)} {rnd.choice(['+', '-', '*', '<', '<=', '>', '>=', '==', '!='])} {y}")
        env0 = {v: rnd.randint(-4, 4) for v in names}
        m = Machine(gen_all(tac, off), {"$sp": SP}, {SP + off[v]: env0[v] for v in names}).run()
        env = run_tac(tac, env0)
        assert all(m.mem[SP + off[v]] == env[v] for v in names)

    # ---- 카드: x = 1, y = 3이면 두 바퀴, 읽기 11번, 쓰기 5번 ----
    tac = ["L0:", "t0 = x < y", "ifnot t0 goto L1", "x = x + 1", "goto L0", "L1:"]
    m = Machine(gen_all(tac, {"t0": 12, "x": 8, "y": 4}), {"$sp": SP}, {SP + 8: 1, SP + 4: 3}).run()
    assert (m.mem[SP + 8], m.loads, m.stores) == (3, 11, 5)
    # ---- 카드: d = a * 4 (d는 $sp+16, a는 $sp+12) ----
    assert gen("d = a * 4", {"d": 16, "a": 12}) == ["lw $r0 12($sp)", "muli $r1 $r0 4", "sw $r1 16($sp)"]
    # ---- 연습 p1의 변형: 조건을 x <= y로 바꾸면 slt만 sle로 바뀌고, x = 0, y = 3에서 네 바퀴 뒤 x = 4 ----
    tac2 = [t.replace("x < y", "x <= y") for t in tac]
    asm2 = gen_all(tac2, {"t0": 12, "x": 8, "y": 4})
    asm1 = gen_all(tac, {"t0": 12, "x": 8, "y": 4})
    assert [a for a, b in zip(asm1, asm2) if a != b] == ["slt $r2 $r0 $r1"] and "sle $r2 $r0 $r1" in asm2
    assert Machine(asm2, {"$sp": SP}, {SP + 8: 0, SP + 4: 3}).run().mem[SP + 8] == 4
    print("ALL CHECKS PASSED")
```
{% endraw %}
