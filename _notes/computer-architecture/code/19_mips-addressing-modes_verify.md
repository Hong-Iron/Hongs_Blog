---
layout: "note"
title: "19_mips-addressing-modes_verify.py"
display_title: "19_mips-addressing-modes_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/mips-addressing-modes/"
parent_title: "MIPS 주소 지정 방식"
description: "컴퓨터 구조 · MIPS 주소 지정 방식 검증 코드"
permalink: "/studies/computer-architecture/code/19_mips-addressing-modes_verify/"
---
{% raw %}
[MIPS 주소 지정 방식](/Hongs_Blog/studies/computer-architecture/mips-addressing-modes/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 19.MIPS 주소 지정 방식 문서의 값 확인: 분기 주소(PC 상대)와 점프 주소(의사 직접).
# 실제 어셈블러가 아니라 파이썬으로 짠 인코더·디코더와 작은 흉내기다.
# 실행: python3 19_mips-addressing-modes_verify.py
import random
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


def branch_target(pc, word):
    return (pc + 4 + signed16(word & 0xFFFF) * 4) & MASK


def jump_target(pc, word):
    return ((pc + 4) & 0xF0000000) | ((word & 0x03FFFFFF) << 2)


if __name__ == "__main__":
    code, labels = assemble(LOOP)
    words = {a: w for a, w, _ in code}
    assert labels == {"Loop": 0x00400008, "Exit": 0x00400028}
    assert words[0x00400008] == 0x0212402A and words[0x00400010] == 0x00104880
    assert words[0x0040000C] == 0x11000006 and words[0x0040000C] & 0xFFFF == 6
    assert words[0x00400024] == 0x08100002 and words[0x00400024] & 0x03FFFFFF == 0x0100002
    assert (0x00400028 - 0x00400010) == 0x18 == 24 and 24 // 4 == 6
    assert 0x00400008 // 4 == 0x0100002
    assert branch_target(0x0040000C, 0x11000006) == 0x00400028
    assert jump_target(0x00400024, 0x08100002) == 0x00400008

    # 예제 1: 뒤로 가는 분기
    w = encode("bne $t0, $zero, 0x00400004", 0x00400018)
    assert w == 0x1500FFFA and signed16(w) == -6 and (0x00400004 - 0x0040001C) == -24
    assert branch_target(0x00400018, w) == 0x00400004
    # 예제 2: 기계어에서 갈 곳 찾기
    assert 0x08100013 >> 26 == 2 and 0x08100013 & 0x03FFFFFF == 0x0100013
    assert 0x0100013 * 4 == 0x040004C and jump_target(0x0040000C, 0x08100013) == 0x0040004C
    assert decode(0x08100013, 0x0040000C) == "j 0x0040004c"

    # 무작위 왕복: 식으로 구한 갈 곳이 인코더에 준 갈 곳과 같다
    rng = random.Random(19)
    for _ in range(2000):
        pc = 0x00400000 + 4 * rng.randrange(100000)
        t = pc + 4 + 4 * rng.randint(-32768, 32767)
        w = encode("beq $s0, $s1, 0x%08x" % t, pc)
        assert branch_target(pc, w) == t and signed16(w) == (t - (pc + 4)) // 4
        t = ((pc + 4) & 0xF0000000) | (4 * rng.randrange(1 << 26))
        w = encode("jal 0x%08x" % t, pc)
        assert jump_target(pc, w) == t and (w & 0x03FFFFFF) == (t & 0x0FFFFFFF) >> 2

    # 닿는 범위
    assert 4 * 32768 == 131072 and 4 * 32767 == 131068 and 2 ** 28 == 256 * 2 ** 20
    assert 32768 // 1024 == 32 and 131072 // 1024 == 128
    pc = 0x00400010
    assert encode("beq $s0, $s1, 0x%08x" % (pc + 4 + 131068), pc) & 0xFFFF == 0x7FFF
    assert encode("beq $s0, $s1, 0x%08x" % (pc + 4 - 131072), pc) & 0xFFFF == 0x8000
    for t in (pc + 4 + 131072, pc + 4 - 131076):
        try:
            encode("beq $s0, $s1, 0x%08x" % t, pc)
            raise SystemExit("막지 못했다")
        except AssertionError:
            pass
    try:
        encode("j 0x10000000", pc)          # 위 4비트가 다른 구역
        raise SystemExit("막지 못했다")
    except AssertionError:
        pass

    # 예제 3: 닿지 않는 분기를 bne + j로. 40,000줄 뒤
    far = 0x00400010 + 4 + 4 * 40000
    assert far == 0x00427114
    code, _ = assemble("bne $s0, $s1, Skip\nj 0x%08x\nSkip:" % far, base=0x00400010)
    assert [w for _, w, _ in code] == [0x16110001, 0x08109C45]
    for a, b in ((5, 5), (5, 6)):           # 같으면 먼 곳으로, 다르면 다음 줄로
        pcv, w0, w1 = 0x00400010, code[0][1], code[1][1]
        nxt = branch_target(pcv, w0) if a != b else pcv + 4
        if nxt == pcv + 4:
            nxt = jump_target(pcv + 4, w1)
        assert nxt == (far if a == b else 0x00400018)

    # 카드
    assert encode("beq $s0, $s1, 0x00400040", 0x00400020) == 0x12110007
    assert (0x00400040 - 0x00400024) == 0x1C == 28
    assert decode(0x0C100004, 0x00400034) == "jal 0x00400010" and 0x0C100004 >> 26 == 3
    m = Machine("jal F\nF: add $t0, $zero, $zero", base=0x00400034)   # jal 뒤의 $ra
    m.step()
    assert m.reg("$ra") == 0x00400038
    print("ALL CHECKS PASSED")
```
{% endraw %}
