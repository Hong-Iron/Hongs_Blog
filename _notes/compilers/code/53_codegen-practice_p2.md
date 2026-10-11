---
layout: "note"
title: "53_codegen-practice_p2.py"
display_title: "53_codegen-practice_p2.py"
kind: "code"
kind_label: "코드 · 문제 2 풀이"
num: "53"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/codegen-practice/"
parent_title: "코드 생성 연습"
description: "컴파일러 · 코드 생성 연습 문제 2 풀이 코드"
permalink: "/studies/compilers/code/53_codegen-practice_p2/"
---
{% raw %}
[코드 생성 연습](/Hongs_Blog/studies/compilers/codegen-practice/) 문서의 문제 2 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 코드 생성 연습 문제 2: if-else를 수업용 MIPS 명령으로.
# 실행: python3 53_codegen-practice_p2.py  (표준 라이브러리만 쓴다)
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


# 3주소 코드:  t0 = x == 0 / ifnot t0 goto L1 / y = 1 / goto L2 / L1: / y = 2 / L2:
# 스택: t0는 $sp+12, x는 $sp+8, y는 $sp+4
ASM = ["lw $r0 8($sp)", "seqi $r1 $r0 0", "sw $r1 12($sp)",      # t0 = x == 0
       "lw $r0 12($sp)", "beqz $r0 L1",                          # ifnot t0 goto L1
       "li $r0 1", "sw $r0 4($sp)",                              # y = 1
       "j L2",                                                   # goto L2
       "L1:",
       "li $r0 2", "sw $r0 4($sp)",                              # y = 2
       "L2:"]

if __name__ == "__main__":
    SP = 1000
    for x in range(-3, 4):
        m = Machine(ASM, {"$sp": SP}, {SP + 8: x}).run()
        assert m.mem[SP + 4] == (1 if x == 0 else 2)
        assert m.mem[SP + 12] == int(x == 0)
        # 어느 길로 가든 메모리 읽기 2번, 쓰기 2번
        assert (m.loads, m.stores) == (2, 2)
    # j L2를 빼먹으면 x == 0일 때 y = 1 뒤에 y = 2까지 실행된다
    broken = [ln for ln in ASM if ln != "j L2"]
    assert Machine(broken, {"$sp": SP}, {SP + 8: 0}).run().mem[SP + 4] == 2
    print("ALL CHECKS PASSED")
```
{% endraw %}
