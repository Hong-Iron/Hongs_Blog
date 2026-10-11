---
layout: "note"
title: "17_mips-branch-jump_verify.py"
display_title: "17_mips-branch-jump_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/mips-branch-jump/"
parent_title: "MIPS 분기와 점프"
description: "컴퓨터 구조 · MIPS 분기와 점프 검증 코드"
permalink: "/studies/computer-architecture/code/17_mips-branch-jump_verify/"
---
{% raw %}
[MIPS 분기와 점프](/Hongs_Blog/studies/computer-architecture/mips-branch-jump/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 17.MIPS 분기와 점프 문서의 값 확인.
# MIPS 인코더·디코더와 작은 흉내기(파이썬). 실제 하드웨어가 아니다.
# 실행: python3 17_mips-branch-jump_verify.py
REGS = ["zero", "at", "v0", "v1", "a0", "a1", "a2", "a3",
        "t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7",
        "s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7",
        "t8", "t9", "k0", "k1", "gp", "sp", "fp", "ra"]

# opcode·funct 값은 MIPS Green Sheet(Reference Data)의 표를 따른다.
R_FUNCT = {"sll": 0x00, "srl": 0x02, "sra": 0x03, "jr": 0x08,
           "mfhi": 0x10, "mflo": 0x12, "mult": 0x18, "multu": 0x19,
           "div": 0x1A, "divu": 0x1B,
           "add": 0x20, "addu": 0x21, "sub": 0x22, "subu": 0x23,
           "and": 0x24, "or": 0x25, "xor": 0x26, "nor": 0x27,
           "slt": 0x2A, "sltu": 0x2B}
I_OP = {"beq": 0x04, "bne": 0x05, "addi": 0x08, "addiu": 0x09,
        "slti": 0x0A, "sltiu": 0x0B, "andi": 0x0C, "ori": 0x0D,
        "xori": 0x0E, "lui": 0x0F, "lb": 0x20, "lw": 0x23,
        "lbu": 0x24, "sb": 0x28, "sw": 0x2B}
J_OP = {"j": 0x02, "jal": 0x03}
FUNCT_R = {v: k for k, v in R_FUNCT.items()}
OP_I = {v: k for k, v in I_OP.items()}
OP_J = {v: k for k, v in J_OP.items()}
SHIFTS = ("sll", "srl", "sra")
ZERO_EXT = ("andi", "ori", "xori", "lui")
MEMOPS = ("lw", "sw", "lb", "lbu", "sb")
MASK = 0xFFFFFFFF


def reg(name):
    name = name.strip()
    assert name.startswith("$"), name
    name = name[1:]
    return int(name) if name.isdigit() else REGS.index(name)


def rname(n):
    return "$" + REGS[n]


def signed16(x):
    x &= 0xFFFF
    return x - 0x10000 if x & 0x8000 else x


def signed32(x):
    x &= MASK
    return x - (1 << 32) if x & 0x80000000 else x


def fields_r(op, rs, rt, rd, shamt, funct):
    return (op << 26) | (rs << 21) | (rt << 16) | (rd << 11) | (shamt << 6) | funct


def fields_i(op, rs, rt, imm):
    return (op << 26) | (rs << 21) | (rt << 16) | (imm & 0xFFFF)


def split_instr(text):
    text = text.split("#")[0].strip()
    parts = text.split(None, 1)
    args = [a.strip() for a in parts[1].split(",")] if len(parts) > 1 else []
    return parts[0], args


def target_of(tok, labels):
    return labels[tok] if labels and tok in labels else int(tok, 0)


def encode(text, addr=0, labels=None):
    """어셈블리 한 줄을 32비트 기계어로 바꾼다. addr는 이 명령이 놓인 주소."""
    m, a = split_instr(text)
    if m in R_FUNCT:
        f = R_FUNCT[m]
        if m in SHIFTS:                       # sll rd, rt, shamt
            sh = int(a[2], 0)
            assert 0 <= sh < 32
            return fields_r(0, 0, reg(a[1]), reg(a[0]), sh, f)
        if m == "jr":
            return fields_r(0, reg(a[0]), 0, 0, 0, f)
        if m in ("mult", "multu", "div", "divu"):
            return fields_r(0, reg(a[0]), reg(a[1]), 0, 0, f)
        if m in ("mfhi", "mflo"):
            return fields_r(0, 0, 0, reg(a[0]), 0, f)
        return fields_r(0, reg(a[1]), reg(a[2]), reg(a[0]), 0, f)   # add rd, rs, rt
    if m in I_OP:
        op = I_OP[m]
        if m in MEMOPS:                       # lw rt, offset(rs)
            off, base = a[1].rstrip(")").split("(")
            off = int(off, 0)
            assert -32768 <= off <= 32767
            return fields_i(op, reg(base), reg(a[0]), off)
        if m in ("beq", "bne"):               # beq rs, rt, label
            diff = target_of(a[2], labels) - (addr + 4)
            assert diff % 4 == 0
            off = diff // 4
            assert -32768 <= off <= 32767, "분기 거리가 16비트를 넘는다"
            return fields_i(op, reg(a[0]), reg(a[1]), off)
        if m == "lui":
            imm = int(a[1], 0)
            assert 0 <= imm <= 0xFFFF
            return fields_i(op, 0, reg(a[0]), imm)
        imm = int(a[2], 0)
        if m in ZERO_EXT:
            assert 0 <= imm <= 0xFFFF
        else:
            assert -32768 <= imm <= 32767
        return fields_i(op, reg(a[1]), reg(a[0]), imm)   # addi rt, rs, imm
    if m in J_OP:
        t = target_of(a[0], labels)
        assert t % 4 == 0
        assert (t & 0xF0000000) == ((addr + 4) & 0xF0000000), "위 4비트가 다르다"
        return (J_OP[m] << 26) | ((t >> 2) & 0x03FFFFFF)
    raise ValueError("모르는 명령: " + text)


def split_fields(word):
    return {"op": word >> 26, "rs": (word >> 21) & 31, "rt": (word >> 16) & 31,
            "rd": (word >> 11) & 31, "shamt": (word >> 6) & 31, "funct": word & 63,
            "imm": word & 0xFFFF, "addr": word & 0x03FFFFFF}


def decode(word, addr=0):
    """32비트 기계어를 어셈블리 한 줄로 되돌린다. 분기·점프의 목적지는 16진 주소로 적는다."""
    f = split_fields(word)
    if f["op"] == 0:
        m = FUNCT_R[f["funct"]]
        if m in SHIFTS:
            return "%s %s, %s, %d" % (m, rname(f["rd"]), rname(f["rt"]), f["shamt"])
        if m == "jr":
            return "jr %s" % rname(f["rs"])
        if m in ("mult", "multu", "div", "divu"):
            return "%s %s, %s" % (m, rname(f["rs"]), rname(f["rt"]))
        if m in ("mfhi", "mflo"):
            return "%s %s" % (m, rname(f["rd"]))
        return "%s %s, %s, %s" % (m, rname(f["rd"]), rname(f["rs"]), rname(f["rt"]))
    if f["op"] in OP_J:
        t = ((addr + 4) & 0xF0000000) | (f["addr"] << 2)
        return "%s 0x%08x" % (OP_J[f["op"]], t)
    m = OP_I[f["op"]]
    if m in MEMOPS:
        return "%s %s, %d(%s)" % (m, rname(f["rt"]), signed16(f["imm"]), rname(f["rs"]))
    if m in ("beq", "bne"):
        t = (addr + 4 + signed16(f["imm"]) * 4) & MASK
        return "%s %s, %s, 0x%08x" % (m, rname(f["rs"]), rname(f["rt"]), t)
    if m == "lui":
        return "lui %s, 0x%x" % (rname(f["rt"]), f["imm"])
    if m in ZERO_EXT:
        return "%s %s, %s, 0x%x" % (m, rname(f["rt"]), rname(f["rs"]), f["imm"])
    return "%s %s, %s, %d" % (m, rname(f["rt"]), rname(f["rs"]), signed16(f["imm"]))


def assemble(source, base=0x00400000):
    """여러 줄을 두 번 훑어 (주소, 기계어, 원문) 목록과 라벨 표를 돌려준다."""
    labels, lines, addr = {}, [], base
    for raw in source.strip().splitlines():
        line = raw.split("#")[0].strip()
        while ":" in line:
            lab, line = line.split(":", 1)
            labels[lab.strip()] = addr
            line = line.strip()
        if line:
            lines.append((addr, line))
            addr += 4
    return [(a, encode(t, a, labels), t) for a, t in lines], labels


class Machine:
    """MIPS 일부를 흉내 내는 작은 기계. 기계어를 해독해 실행한다.
    지연 분기는 흉내 내지 않는다(jal은 PC+4를 $ra에 넣는다)."""

    def __init__(self, source, base=0x00400000, big_endian=True):
        self.code, self.labels = assemble(source, base)
        self.words = {a: w for a, w, _ in self.code}
        self.text = {a: t for a, _, t in self.code}
        self.r = [0] * 32
        self.hi = self.lo = 0
        self.mem = {}
        self.pc = base
        self.big = big_endian
        self.steps = 0
        self.log = []

    def load_word(self, addr):
        assert addr % 4 == 0, "워드 주소는 4의 배수여야 한다"
        bs = [self.mem.get(addr + i, 0) for i in range(4)]
        if not self.big:
            bs.reverse()
        return (bs[0] << 24) | (bs[1] << 16) | (bs[2] << 8) | bs[3]

    def store_word(self, addr, val):
        assert addr % 4 == 0, "워드 주소는 4의 배수여야 한다"
        bs = [(val >> s) & 0xFF for s in (24, 16, 8, 0)]
        if not self.big:
            bs.reverse()
        for i, b in enumerate(bs):
            self.mem[addr + i] = b

    def set(self, n, val):
        if n != 0:                      # $zero는 써도 0이다
            self.r[n] = val & MASK

    def step(self):
        pc = self.pc
        f = split_fields(self.words[pc])
        r, npc = self.r, pc + 4
        rs, rt = r[f["rs"]], r[f["rt"]]
        simm = signed16(f["imm"])
        if f["op"] == 0:
            m = FUNCT_R[f["funct"]]
            if m in ("add", "sub"):
                v = signed32(rs) + signed32(rt) if m == "add" else signed32(rs) - signed32(rt)
                assert -2**31 <= v < 2**31, "오버플로 예외"
                self.set(f["rd"], v)
            elif m == "addu": self.set(f["rd"], rs + rt)
            elif m == "subu": self.set(f["rd"], rs - rt)
            elif m == "and": self.set(f["rd"], rs & rt)
            elif m == "or": self.set(f["rd"], rs | rt)
            elif m == "xor": self.set(f["rd"], rs ^ rt)
            elif m == "nor": self.set(f["rd"], ~(rs | rt))
            elif m == "slt": self.set(f["rd"], int(signed32(rs) < signed32(rt)))
            elif m == "sltu": self.set(f["rd"], int(rs < rt))
            elif m == "sll": self.set(f["rd"], rt << f["shamt"])
            elif m == "srl": self.set(f["rd"], rt >> f["shamt"])
            elif m == "sra": self.set(f["rd"], signed32(rt) >> f["shamt"])
            elif m == "jr": npc = rs
            elif m == "mult":
                p = (signed32(rs) * signed32(rt)) & 0xFFFFFFFFFFFFFFFF
                self.hi, self.lo = p >> 32, p & MASK
            elif m == "multu":
                p = rs * rt
                self.hi, self.lo = p >> 32, p & MASK
            elif m == "div":
                a, b = signed32(rs), signed32(rt)
                q = abs(a) // abs(b)
                q = -q if (a < 0) != (b < 0) else q
                self.lo, self.hi = q & MASK, (a - q * b) & MASK
            elif m == "divu":
                self.lo, self.hi = rs // rt, rs % rt
            elif m == "mfhi": self.set(f["rd"], self.hi)
            elif m == "mflo": self.set(f["rd"], self.lo)
        elif f["op"] in OP_J:
            if OP_J[f["op"]] == "jal":
                self.set(31, pc + 4)
            npc = ((pc + 4) & 0xF0000000) | (f["addr"] << 2)
        else:
            m = OP_I[f["op"]]
            if m == "addi":
                v = signed32(rs) + simm
                assert -2**31 <= v < 2**31, "오버플로 예외"
                self.set(f["rt"], v)
            elif m == "addiu": self.set(f["rt"], rs + simm)
            elif m == "slti": self.set(f["rt"], int(signed32(rs) < simm))
            elif m == "sltiu": self.set(f["rt"], int(rs < (simm & MASK)))
            elif m == "andi": self.set(f["rt"], rs & f["imm"])
            elif m == "ori": self.set(f["rt"], rs | f["imm"])
            elif m == "xori": self.set(f["rt"], rs ^ f["imm"])
            elif m == "lui": self.set(f["rt"], f["imm"] << 16)
            elif m == "lw": self.set(f["rt"], self.load_word((rs + simm) & MASK))
            elif m == "sw": self.store_word((rs + simm) & MASK, rt)
            elif m == "lb":
                b = self.mem.get((rs + simm) & MASK, 0)
                self.set(f["rt"], b - 256 if b & 0x80 else b)
            elif m == "lbu": self.set(f["rt"], self.mem.get((rs + simm) & MASK, 0))
            elif m == "sb": self.mem[(rs + simm) & MASK] = rt & 0xFF
            elif m == "beq":
                if rs == rt: npc = pc + 4 + simm * 4
            elif m == "bne":
                if rs != rt: npc = pc + 4 + simm * 4
        self.pc = npc & MASK
        self.steps += 1
        return pc

    def run(self, max_steps=100000, hook=None):
        """PC가 프로그램 밖으로 나가면 멈춘다."""
        while self.pc in self.words:
            pc = self.step()
            if hook:
                hook(self, pc)
            assert self.steps < max_steps, "끝나지 않는다"
        return self

    def reg(self, name):
        return self.r[reg(name)]


IF_ELSE = """
      slt $t0, $s0, $s1
      beq $t0, $zero, Else
      add $s2, $s0, $zero
      j   End
Else: add $s2, $s1, $zero
End:
"""

LOOP = """
      add  $s1, $zero, $zero
      add  $s0, $zero, $zero
Loop: slt  $t0, $s0, $s2
      beq  $t0, $zero, Exit
      sll  $t1, $s0, 2
      add  $t1, $t1, $s3
      lw   $t2, 0($t1)
      add  $s1, $s1, $t2
      addi $s0, $s0, 1
      j    Loop
Exit:
"""


def run_loop(values):
    m = Machine(LOOP)
    m.r[reg("$s2")], m.r[reg("$s3")] = len(values), 0x10000000
    for i, v in enumerate(values):
        m.store_word(0x10000000 + 4 * i, v & MASK)
    rows = []

    def hook(mm, pc):
        if mm.text[pc].startswith("addi $s0"):
            rows.append((mm.reg("$t1"), signed32(mm.reg("$t2")), signed32(mm.reg("$s1")), mm.reg("$s0")))
    m.run(hook=hook)
    return m, rows


if __name__ == "__main__":
    # if-else: 둘 중 작은 값, 실행한 줄 수
    for a in range(-20, 21):
        for b in range(-20, 21):
            m = Machine(IF_ELSE)
            m.r[reg("$s0")], m.r[reg("$s1")] = a & MASK, b & MASK
            m.run()
            assert signed32(m.reg("$s2")) == min(a, b)
            assert m.steps == (4 if a < b else 3)
    m = Machine(IF_ELSE); m.r[16], m.r[17] = 3, 9; m.run()
    assert m.reg("$s2") == 3 and m.steps == 4
    m = Machine(IF_ELSE); m.r[16], m.r[17] = 9, 3; m.run()
    assert m.reg("$s2") == 3 and m.steps == 3

    # j End를 빼먹으면 then과 else를 둘 다 실행한다
    m = Machine(IF_ELSE.replace("      j   End\n", "")); m.r[16], m.r[17] = 3, 9; m.run()
    assert m.reg("$s2") == 9

    # 반복문 추적 표
    m, rows = run_loop([3, 8, -2, 6])
    assert rows == [(0x10000000, 3, 3, 1), (0x10000004, 8, 11, 2),
                    (0x10000008, -2, 9, 3), (0x1000000C, 6, 15, 4)]
    assert signed32(m.reg("$s1")) == 15 and m.steps == 36 == 2 + 8 * 4 + 2

    # 크기 비교 네 가지
    forms = {"<": ("slt $t0, $s0, $s1", "bne"), ">=": ("slt $t0, $s0, $s1", "beq"),
             ">": ("slt $t0, $s1, $s0", "bne"), "<=": ("slt $t0, $s1, $s0", "beq")}
    truth = {"<": lambda a, b: a < b, ">=": lambda a, b: a >= b,
             ">": lambda a, b: a > b, "<=": lambda a, b: a <= b}
    for op, (first, br) in forms.items():
        src = "%s\n%s $t0, $zero, L\naddi $s2, $zero, 0\nj End\nL: addi $s2, $zero, 1\nEnd:" % (first, br)
        for a in range(-5, 6):
            for b in range(-5, 6):
                m = Machine(src); m.r[16], m.r[17] = a & MASK, b & MASK; m.run()
                assert m.reg("$s2") == int(truth[op](a, b)), (op, a, b)

    # 카드 C1
    C1 = "slt $t0, $s0, $s1\nbne $t0, $zero, Skip\nsub $s0, $s0, $s1\nSkip:"
    for x, y, want in ((10, 4, 6), (4, 10, 4), (7, 7, 0)):
        m = Machine(C1); m.r[16], m.r[17] = x, y; m.run()
        assert m.reg("$s0") == want
    # 카드 C2
    m, rows = run_loop([5, -1, 7])
    assert [r[2] for r in rows] == [5, 4, 11] and m.reg("$s0") == 3 and m.steps == 28

    # 컴파일러 51.수업용 MIPS 명령어의 과목별 관점 표와 카드 C4: 수업용 표기를 실제 MIPS로 옮긴 것
    m = Machine("addi $t0, $zero, 5\naddi $t1, $t0, -2\nslt $t3, $t1, $t0\nbne $t3, $zero, L\naddi $s7, $zero, 1\nL:")
    m.run()
    assert (m.reg("$t0"), m.reg("$t1"), m.reg("$t3"), m.reg("$s7")) == (5, 3, 1, 0)   # L로 가서 $s7은 0
    for a in range(-4, 5):
        for b in range(-4, 5):
            m = Machine("slt $t3, $t1, $t0\nslt $t2, $t0, $t1\nmult $t0, $t1\nmflo $t4")   # sgt, blt의 앞줄, mul
            m.r[reg("$t0")], m.r[reg("$t1")] = a & MASK, b & MASK
            m.run()
            assert m.reg("$t3") == int(a > b) and m.reg("$t2") == int(a < b) and signed32(m.reg("$t4")) == a * b
    print("ALL CHECKS PASSED")
```
{% endraw %}
