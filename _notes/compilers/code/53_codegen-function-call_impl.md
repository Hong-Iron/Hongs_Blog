---
layout: "note"
title: "53_codegen-function-call_impl.py"
display_title: "53_codegen-function-call_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "53"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/codegen-function-call/"
parent_title: "함수 호출의 코드 생성"
description: "컴파일러 · 함수 호출의 코드 생성 구현 코드"
permalink: "/studies/compilers/code/53_codegen-function-call_impl/"
---
{% raw %}
[함수 호출의 코드 생성](/Hongs_Blog/studies/compilers/codegen-function-call/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 함수 호출의 코드 생성: 활성 레코드를 스택에 쌓고 걷는 명령들.
# 실행: python3 53_codegen-function-call_impl.py  (표준 라이브러리만 쓴다)
# 슬라이드 15회 p.19~28의 명령과 오프셋(16, 4, 20, 8, 12)을 그대로 돌려 본다.
# 흉내기(Machine)는 51_mips-instructions_impl.py의 것을 복사했다.
# 슬라이드에는 foo로 뛰는 명령이 없다. 여기서는 jal(돌아올 자리를 $ra에 넣고 뛴다)을 인자를 넣은 바로 뒤에 둔다.
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


def call_sequence(args, dst_off):
    """부르는 쪽: 반환값 칸, 인자 칸을 만들고 뛴다. 돌아와서 반환값을 dst에 옮긴다.
    args = 상수 문자열 목록. dst_off = 부르기 전 $sp 기준 dst의 오프셋."""
    out = ["subi $sp $sp 4"]                               # 반환값 칸
    for a in args:
        out += [f"li $r0 {a}", "sw $r0 0($sp)", "subi $sp $sp 4"]
    return out, ["lw $r0 0($sp)", f"sw $r0 {dst_off}($sp)"]


def prologue(nparams, nlocals):
    """불린 쪽 머리: 제어 링크, 돌아갈 주소, 지역 변수 칸."""
    return [f"addi $r0 $sp {4 * (nparams + 2)}", "sw $r0 0($sp)", "subi $sp $sp 4",
            "sw $ra 0($sp)", "subi $sp $sp 4",
            f"subi $sp $sp {4 * nlocals}"]


def epilogue(nlocals):
    """불린 쪽 꼬리: 돌아갈 주소를 되찾고, 제어 링크로 $sp를 되돌리고, 돌아간다."""
    return [f"lw $ra {4 * nlocals + 4}($sp)", f"lw $r0 {4 * nlocals + 8}($sp)", "subi $sp $r0 4", "jr $ra"]


def offsets(nparams, nlocals):
    """불린 함수 안에서 $sp 기준 오프셋."""
    o = {f"local{i}": 4 * (nlocals - i) for i in range(nlocals)}       # local0이 가장 높은 주소
    o["ra"] = 4 * nlocals + 4
    o["link"] = 4 * nlocals + 8
    for i in range(nparams):
        o[f"param{i}"] = 4 * nlocals + 12 + 4 * (nparams - 1 - i)
    o["ret"] = 4 * nlocals + 12 + 4 * nparams
    return o


if __name__ == "__main__":
    # ================= 슬라이드의 예: b = call foo(3), foo는 t0 = a + 1; return t0 =================
    S0 = 1000                 # 부르기 전의 $sp (스택 꼭대기 다음 빈칸)
    B = S0 + 4                # main의 b가 든 칸
    before, after = call_sequence(["3"], 4)
    assert before == ["subi $sp $sp 4", "li $r0 3", "sw $r0 0($sp)", "subi $sp $sp 4"]        # p.20~21
    pro = prologue(1, 1)
    assert pro == ["addi $r0 $sp 12", "sw $r0 0($sp)", "subi $sp $sp 4",                     # p.22
                   "sw $ra 0($sp)", "subi $sp $sp 4",                                         # p.23
                   "subi $sp $sp 4"]                                                          # p.24
    body = ["lw $r0 16($sp)", "addi $r1 $r0 1", "sw $r1 4($sp)",                              # p.25: t0 = a + 1
            "lw $r0 4($sp)", "sw $r0 20($sp)"]                                                # p.25: 반환값 넣기
    epi = epilogue(1)
    assert epi == ["lw $ra 8($sp)", "lw $r0 12($sp)", "subi $sp $r0 4", "jr $ra"]             # p.26~28
    assert after == ["lw $r0 0($sp)", "sw $r0 4($sp)"]                                        # p.28
    o = offsets(1, 1)
    assert o == {"local0": 4, "ra": 8, "link": 12, "param0": 16, "ret": 20}

    # (1) 슬라이드 순서 그대로 한 줄로 돌린다. jr $ra가 돌아갈 자리는 미리 $ra에 넣어 둔다
    line = before + pro + body + epi[:-1]
    ret_to = len(line) + 1                                  # jr 다음 줄
    prog = line + ["jr $ra"] + after
    m = Machine(prog, {"$sp": S0, "$ra": ret_to}, {B: 0})
    snaps = {}
    while m.pc < len(m.code):
        m.step()
        snaps[m.pc] = (m.reg["$sp"], dict(m.mem))
    # 단계마다의 $sp (p.20~24): 반환값 칸, 인자, 제어 링크, 돌아갈 주소, t0 칸
    assert snaps[1][0] == S0 - 4
    assert snaps[4][0] == S0 - 8 and snaps[4][1][S0 - 4] == 3
    assert snaps[7][0] == S0 - 12 and snaps[7][1][S0 - 8] == B        # 제어 링크 = b가 든 칸의 주소
    assert snaps[9][0] == S0 - 16 and snaps[9][1][S0 - 12] == ret_to
    assert snaps[10][0] == S0 - 20
    # 레코드 다섯 칸의 주소 (높은 주소부터): 반환값, a, 제어 링크, 돌아갈 주소, t0
    sp_in = S0 - 20
    assert [sp_in + k for k in (20, 16, 12, 8, 4)] == [S0, S0 - 4, S0 - 8, S0 - 12, S0 - 16]
    # 끝난 뒤 (p.27~28)
    assert m.reg["$sp"] == S0                               # $sp가 부르기 전으로 돌아왔다
    assert m.mem[S0] == 4 and m.mem[S0 - 16] == 4           # 반환값 4, t0 = 4
    assert m.mem[B] == 4                                    # b = 4
    assert m.reg["$ra"] == ret_to

    # (2) jal을 넣어 제대로 된 프로그램으로 돌려도 같다
    prog = before + ["jal foo"] + after + ["j END", "foo:"] + pro + body + epi + ["END:"]
    m = Machine(prog, {"$sp": S0, "$ra": -1}, {B: 0}).run()
    assert m.mem[B] == 4 and m.reg["$sp"] == S0

    # (3) 제어 링크 없이 "지역 변수 수만큼 더해서" 되돌려도 여기서는 같은 곳이다: 레코드는 5칸 = 20바이트
    assert sp_in + 20 == S0

    # ================= 일반화: 재귀 fib (14회 p.25의 3주소 코드) =================
    # fib의 지역·임시 변수 t0~t5는 local0~local5. 인자 n은 param0.
    f = offsets(1, 6)
    L = lambda k: f[f"local{k}"]
    N, RET = f["param0"], f["ret"]

    def call_fib(arg_local, dst_local):
        # 인자를 넣는 동안 $sp가 4 내려가므로 지역 변수 오프셋에 4를 더한다
        return ["subi $sp $sp 4", f"lw $r0 {L(arg_local) + 4}($sp)", "sw $r0 0($sp)", "subi $sp $sp 4",
                "jal fib", "lw $r0 0($sp)", f"sw $r0 {L(dst_local)}($sp)"]

    fib = (["fib:"] + prologue(1, 6)
           + [f"lw $r0 {N}($sp)", "slei $r1 $r0 1", f"sw $r1 {L(0)}($sp)"]            # t0 = n <= 1
           + [f"lw $r0 {L(0)}($sp)", "bnez $r0 L0"]                                   # if t0 goto L0
           + [f"lw $r0 {N}($sp)", "subi $r1 $r0 1", f"sw $r1 {L(1)}($sp)"]            # t1 = n - 1
           + call_fib(1, 2)                                                           # param t1; t2 = call fib, 1
           + [f"lw $r0 {N}($sp)", "subi $r1 $r0 2", f"sw $r1 {L(3)}($sp)"]            # t3 = n - 2
           + call_fib(3, 4)                                                           # param t3; t4 = call fib, 1
           + [f"lw $r0 {L(2)}($sp)", f"lw $r1 {L(4)}($sp)", "add $r2 $r0 $r1", f"sw $r2 {L(5)}($sp)"]   # t5 = t2 + t4
           + [f"lw $r0 {L(5)}($sp)", f"sw $r0 {RET}($sp)"] + epilogue(6)               # return t5
           + ["L0:", f"lw $r0 {N}($sp)", f"sw $r0 {RET}($sp)"] + epilogue(6))          # return n

    def py_fib(n):
        return n if n <= 1 else py_fib(n - 1) + py_fib(n - 2)

    for n in range(0, 11):
        before, after = call_sequence([str(n)], 4)          # main: a = fib(n), a는 $sp+4
        prog = before + ["jal fib"] + after + ["j END"] + fib + ["END:"]
        m = Machine(prog, {"$sp": S0, "$ra": -1}, {S0 + 4: 0})
        low = S0
        while m.pc < len(m.code):
            m.step()
            low = min(low, m.reg["$sp"])
        assert m.mem[S0 + 4] == py_fib(n), n
        assert m.reg["$sp"] == S0
        # 레코드 하나는 10칸(반환값 1 + 인자 1 + 링크 1 + 주소 1 + 지역 6) = 40바이트, 가장 깊을 때 max(n, 1)겹
        assert S0 - low == 40 * max(n, 1), (n, S0 - low)
    # fib(1) 한 번: 14회 p.29~30. 반환값 칸에 1, main의 a = 1
    before, after = call_sequence(["1"], 4)
    m = Machine(before + ["jal fib"] + after + ["j END"] + fib + ["END:"], {"$sp": S0, "$ra": -1}, {S0 + 4: 0}).run()
    assert m.mem[S0] == 1 and m.mem[S0 + 4] == 1
    assert m.mem[S0 - 16] == 1                              # fib(1)의 t0 = (1 <= 1) = 참

    # ---- 카드: 인자 없음, 지역 변수 둘인 함수 g: t0 = 2; t1 = t0 + 5; return t1 ----
    assert prologue(0, 2)[0] == "addi $r0 $sp 8" and prologue(0, 2)[-1] == "subi $sp $sp 8"
    og = offsets(0, 2)
    assert og == {"local0": 8, "local1": 4, "ra": 12, "link": 16, "ret": 20}
    g = (["g:"] + prologue(0, 2)
         + ["li $r0 2", "sw $r0 8($sp)", "lw $r0 8($sp)", "addi $r1 $r0 5", "sw $r1 4($sp)",
            "lw $r0 4($sp)", "sw $r0 20($sp)"] + epilogue(2))
    assert epilogue(2) == ["lw $ra 12($sp)", "lw $r0 16($sp)", "subi $sp $r0 4", "jr $ra"]
    before, after = call_sequence([], 4)
    m = Machine(before + ["jal g"] + after + ["j END"] + g + ["END:"], {"$sp": S0, "$ra": -1}, {S0 + 4: 0}).run()
    assert m.mem[S0 + 4] == 7 and m.reg["$sp"] == S0
    print("ALL CHECKS PASSED")
```
{% endraw %}
