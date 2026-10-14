---
layout: "note"
title: "53_codegen-practice_p3.py"
display_title: "53_codegen-practice_p3.py"
kind: "code"
kind_label: "코드 · 문제 3 풀이"
num: "53"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/codegen-practice/"
parent_title: "코드 생성 연습"
description: "컴파일러 · 코드 생성 연습 문제 3 풀이 코드"
sitemap: false
permalink: "/studies/compilers/code/53_codegen-practice_p3/"
---
{% raw %}
[코드 생성 연습](/Hongs_Blog/studies/compilers/codegen-practice/) 문서의 문제 3 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 코드 생성 연습 문제 3: 인자가 둘인 함수 호출  c = call add2(5, 7).
# 실행: python3 53_codegen-practice_p3.py  (표준 라이브러리만 쓴다)
# 흉내기(Machine)와 호출 명령 만드는 함수는 53_codegen-function-call_impl.py의 것을 복사했다.
# 인자가 둘일 때 넣는 순서는 슬라이드에 없다. 여기서는 첫 인자를 먼저(더 높은 주소에) 넣는다.
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
    S0 = 1000
    before, after = call_sequence(["5", "7"], 4)             # main의 c는 $sp+4
    assert before == ["subi $sp $sp 4",
                      "li $r0 5", "sw $r0 0($sp)", "subi $sp $sp 4",
                      "li $r0 7", "sw $r0 0($sp)", "subi $sp $sp 4"]
    pro = prologue(2, 1)
    assert pro == ["addi $r0 $sp 16", "sw $r0 0($sp)", "subi $sp $sp 4",
                   "sw $ra 0($sp)", "subi $sp $sp 4", "subi $sp $sp 4"]
    o = offsets(2, 1)
    assert o == {"local0": 4, "ra": 8, "link": 12, "param1": 16, "param0": 20, "ret": 24}
    body = ["lw $r0 20($sp)", "lw $r1 16($sp)", "add $r2 $r0 $r1", "sw $r2 4($sp)",   # t0 = x + y
            "lw $r0 4($sp)", "sw $r0 24($sp)"]                                         # return t0
    epi = epilogue(1)
    assert epi == ["lw $ra 8($sp)", "lw $r0 12($sp)", "subi $sp $r0 4", "jr $ra"]
    prog = before + ["jal add2"] + after + ["j END", "add2:"] + pro + body + epi + ["END:"]
    m = Machine(prog, {"$sp": S0, "$ra": -1}, {S0 + 4: 0})
    low = S0
    while m.pc < len(m.code):
        m.step()
        low = min(low, m.reg["$sp"])
    assert m.mem[S0 + 4] == 12 and m.reg["$sp"] == S0
    assert S0 - low == 24                                    # 레코드 6칸: 반환값, x, y, 제어 링크, 돌아갈 주소, t0
    assert (m.mem[S0], m.mem[S0 - 4], m.mem[S0 - 8], m.mem[S0 - 12], m.mem[S0 - 20]) == (12, 5, 7, S0 + 4, 12)
    # 제어 링크 오프셋을 인자 하나짜리 때처럼 12로 두면 $sp가 4 낮은 곳으로 돌아가 엉뚱한 칸(x)을 읽는다
    bad = ["addi $r0 $sp 12"] + pro[1:]
    prog = before + ["jal add2"] + after + ["j END", "add2:"] + bad + body + epi + ["END:"]
    m = Machine(prog, {"$sp": S0, "$ra": -1}, {S0 + 4: 0}).run()
    assert m.reg["$sp"] == S0 - 4 and m.mem[S0 + 4] == 0     # c에는 12가 들어가지 않는다
    assert m.mem[S0] == 5                                    # x의 값 5를 반환값인 줄 알고 옮겼다
    print("ALL CHECKS PASSED")
```
{% endraw %}
