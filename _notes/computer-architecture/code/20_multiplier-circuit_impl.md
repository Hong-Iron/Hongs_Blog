---
layout: "note"
title: "20_multiplier-circuit_impl.py"
display_title: "20_multiplier-circuit_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "20"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/multiplier-circuit/"
parent_title: "곱셈 회로"
description: "컴퓨터 구조 · 곱셈 회로 구현 코드"
permalink: "/studies/computer-architecture/code/20_multiplier-circuit_impl/"
---
{% raw %}
[곱셈 회로](/Hongs_Blog/studies/computer-architecture/multiplier-circuit/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 20.곱셈 회로: 시프트-덧셈 곱셈기 두 가지를 레지스터 값 수준에서 흉내 낸다.
# 실제 회로가 아니라 파이썬 흉내다. mult·mfhi·mflo는 작은 MIPS 흉내기로 확인한다.
# 실행: python3 20_multiplier-circuit_impl.py
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
def multiply_v1(m, q, n, trace=None):
    """첫 번째 회로: 곱해지는 수를 2n비트 칸에서 왼쪽으로 밀고, 곱하는 수를 오른쪽으로 민다."""
    mcand, mplier, prod = m, q, 0
    if trace is not None:
        trace.append((0, "처음", mplier, mcand, prod))
    for i in range(1, n + 1):
        if mplier & 1:
            prod = (prod + mcand) & ((1 << (2 * n)) - 1)
            what = "맨 아랫비트 1: 더한다"
        else:
            what = "맨 아랫비트 0: 안 더한다"
        mcand = (mcand << 1) & ((1 << (2 * n)) - 1)
        mplier >>= 1
        if trace is not None:
            trace.append((i, what, mplier, mcand, prod))
    return prod


def multiply_v2(m, q, n, trace=None):
    """고친 회로: 곱과 곱하는 수가 2n비트 칸 하나를 나눠 쓴다. 덧셈기는 n비트(올림 1비트 포함)."""
    reg = q                                   # 위쪽 n비트 0, 아래쪽 n비트 = 곱하는 수
    if trace is not None:
        trace.append((0, "처음", reg))
    for i in range(1, n + 1):
        if reg & 1:
            reg += m << n                     # 위쪽 절반에 더한다. 올림은 2n번 비트에 잠깐 남는다
            what = "맨 아랫비트 1: 위쪽 절반에 더한다"
        else:
            what = "맨 아랫비트 0: 안 더한다"
        reg >>= 1                             # 올림까지 함께 오른쪽으로 한 칸
        if trace is not None:
            trace.append((i, what, reg))
    return reg


def bits(x, w):
    return format(x, "0%db" % w)


if __name__ == "__main__":
    # 손 계산
    assert 0b1101 * 0b1011 == 143 == 0b10001111
    assert (13 << 0) + (13 << 1) + (13 << 3) == 143

    # 첫 번째 회로의 추적 표
    tr = []
    assert multiply_v1(13, 11, 4, tr) == 143
    table = [(i, bits(q, 4), bits(m, 8), bits(p, 8), p) for i, _, q, m, p in tr]
    assert table == [(0, "1011", "00001101", "00000000", 0),
                     (1, "0101", "00011010", "00001101", 13),
                     (2, "0010", "00110100", "00100111", 39),
                     (3, "0001", "01101000", "00100111", 39),
                     (4, "0000", "11010000", "10001111", 143)]
    assert ["1" in w.split(":")[0] for _, w, _, _, _ in tr[1:]] == [True, True, False, True]

    # 칸을 아낀 회로의 추적 표: 위쪽 5비트(올림 포함), 아래쪽 4비트
    tr = []
    assert multiply_v2(13, 11, 4, tr) == 143
    assert [(i, bits(r >> 4, 5), bits(r & 15, 4)) for i, _, r in tr] == [
        (0, "00000", "1011"), (1, "00110", "1101"), (2, "01001", "1110"),
        (3, "00100", "1111"), (4, "01000", "1111")]

    # 전수 검사와 불변식
    for n in (4, 8):
        for m in range(1 << n):
            for q in range(1 << n):
                assert multiply_v1(m, q, n) == m * q == multiply_v2(m, q, n)
    for m in range(16):
        for q in range(16):
            tr = []
            multiply_v1(m, q, 4, tr)
            for i, _, _, mcand, prod in tr:
                assert prod == m * (q % (1 << i))             # 곱 칸 = M × Q의 아래 i비트
                assert mcand == (m << i) % 256                # 곱해지는 수 칸 = M × 2^i (8비트 칸)
                if i < 4:
                    assert (m << i) < 256
    assert 15 * 15 == 225 == 0b11100001 and 225 >= 2 ** 7

    # MIPS: mult, mfhi, mflo
    assert encode("mult $s2, $s3") == 0x02530018 and R_FUNCT["mfhi"] == 0x10 and R_FUNCT["mflo"] == 0x12
    for a, b, hi, lo in ((100000, 100000, 0x2, 0x540BE400), (70000, 70000, 0x1, 0x24101100)):
        mm = Machine("mult $s2, $s3\nmfhi $s0\nmflo $s1")
        mm.r[reg("$s2")], mm.r[reg("$s3")] = a, b
        mm.run()
        assert (mm.reg("$s0"), mm.reg("$s1")) == (hi, lo) and (hi << 32) | lo == a * b
    assert 10 ** 10 == 0x2540BE400 and 0x540BE400 == 1410065408
    assert 70000 ** 2 == 4900000000 == 0x124101100 and 0x24101100 == 605032704
    # 부호 있는 곱셈: 크기끼리 곱하고 부호를 붙인 값이 mult와 같다
    for a in range(-20, 21):
        for b in range(-20, 21):
            mag = multiply_v1(abs(a), abs(b), 8)
            want = -mag if (a < 0) != (b < 0) else mag
            mm = Machine("mult $s2, $s3\nmflo $s1")
            mm.r[reg("$s2")], mm.r[reg("$s3")] = a & MASK, b & MASK
            mm.run()
            assert signed32(mm.reg("$s1")) == want == a * b

    # 카드 C1
    tr = []
    multiply_v1(6, 5, 4, tr)
    assert [p for _, _, _, _, p in tr[1:]] == [6, 6, 30, 30]
    print("ALL CHECKS PASSED")
```
{% endraw %}
