---
layout: "note"
title: "51_mips-instructions_impl.py"
display_title: "51_mips-instructions_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "51"
course: "컴파일러"
course_slug: "compilers"
course_url: "/studies/compilers/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/compilers/mips-instructions/"
parent_title: "코드 생성용 MIPS 명령어"
description: "컴파일러 · 코드 생성용 MIPS 명령어 구현 코드"
sitemap: false
permalink: "/studies/compilers/code/51_mips-instructions_impl/"
---
{% raw %}
[코드 생성용 MIPS 명령어](/Hongs_Blog/studies/compilers/mips-instructions/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 단순화한 MIPS 명령어 흉내기.
# 실행: python3 51_mips-instructions_impl.py  (표준 라이브러리만 쓴다)
# 문서의 명령 표기를 그대로 받는다: 피연산자는 빈칸으로 나누고 레지스터는 $r0, $r1, …, $sp, $ra.
# 실제 MIPS 어셈블러가 아니다. 문서의 표에 적은 뜻(reg1 = reg2 + reg3 등)대로 움직이는지만 확인한다.
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
        elif op == "jal":                    # 문서의 명령 표에 없는 명령. 실제 MIPS의 jal처럼 돌아올 자리를 $ra에 넣고 뛴다
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


def one(line, **regs):
    m = Machine([line], {"$" + k: v for k, v in regs.items()}).run()
    return m.reg


if __name__ == "__main__":
    vals = range(-3, 4)
    # ---- 세 레지스터 산술 ----
    for x in vals:
        for y in vals:
            assert one("add $r0 $r1 $r2", r1=x, r2=y)["$r0"] == x + y
            assert one("sub $r0 $r1 $r2", r1=x, r2=y)["$r0"] == x - y
            assert one("mul $r0 $r1 $r2", r1=x, r2=y)["$r0"] == x * y
            # ---- 비교 여섯 가지: 참이면 1, 거짓이면 0 ----
            for name, py in (("seq", x == y), ("sne", x != y), ("sgt", x > y),
                             ("sge", x >= y), ("slt", x < y), ("sle", x <= y)):
                assert one(f"{name} $r0 $r1 $r2", r1=x, r2=y)["$r0"] == int(py)
                assert one(f"{name}i $r0 $r1 {y}", r1=x)["$r0"] == int(py)      # 즉시값 꼴
            # ---- 즉시값 산술 ----
            assert one(f"addi $r0 $r1 {y}", r1=x)["$r0"] == x + y
            assert one(f"subi $r0 $r1 {y}", r1=x)["$r0"] == x - y
            assert one(f"muli $r0 $r1 {y}", r1=x)["$r0"] == x * y
    assert one("div $r0 $r1 $r2", r1=7, r2=2)["$r0"] == 3
    assert one("divi $r0 $r1 2", r1=7)["$r0"] == 3
    assert one("li $r0 3")["$r0"] == 3
    # subi는 addi에 음수를 넣은 것과 같다
    for x in vals:
        for y in vals:
            assert one(f"subi $r0 $r1 {y}", r1=x)["$r0"] == one(f"addi $r0 $r1 {-y}", r1=x)["$r0"]

    # ---- 메모리를 만지는 것은 lw와 sw뿐 ----
    m = Machine(["lw $r0 8($sp)", "sw $r0 4($sp)"], {"$sp": 100}, {108: 42}).run()
    assert m.reg["$r0"] == 42 and m.mem[104] == 42 and (m.loads, m.stores) == (1, 1)

    # ---- 분기 ----
    def taken(line, **regs):
        m = Machine([line, "li $r9 1", "L:"], {"$" + k: v for k, v in regs.items()}).run()
        return "$r9" not in m.reg          # 뛰었으면 li를 건너뛴다
    assert taken("j L")
    for x in vals:
        assert taken("beqz $r0 L", r0=x) == (x == 0)
        assert taken("bnez $r0 L", r0=x) == (x != 0)
        for y in vals:
            for name, py in (("beq", x == y), ("bne", x != y), ("bgt", x > y),
                             ("bge", x >= y), ("blt", x < y), ("ble", x <= y)):
                assert taken(f"{name} $r0 $r1 L", r0=x, r1=y) == py
                assert taken(f"{name}i $r0 {y} L", r0=x) == py
    # ---- jr: 레지스터에 든 자리로 뛴다 ----
    m = Machine(["jr $ra", "li $r0 1", "li $r1 2"], {"$ra": 2}).run()
    assert "$r0" not in m.reg and m.reg["$r1"] == 2
    # ---- 스택 한 칸 만들기: subi $sp $sp 4. 낮은 주소 쪽으로 자란다 ----
    m = Machine(["li $r0 3", "sw $r0 0($sp)", "subi $sp $sp 4"], {"$sp": 100}).run()
    assert m.mem[100] == 3 and m.reg["$sp"] == 96

    # ---- 카드 C2 ----
    m = Machine(["li $r0 5", "subi $r1 $r0 2", "slti $r2 $r1 3", "sgt $r3 $r0 $r1"]).run()
    assert (m.reg["$r1"], m.reg["$r2"], m.reg["$r3"]) == (3, 0, 1)
    print("ALL CHECKS PASSED")
```
{% endraw %}
