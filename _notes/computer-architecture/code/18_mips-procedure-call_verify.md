---
layout: "note"
title: "18_mips-procedure-call_verify.py"
display_title: "18_mips-procedure-call_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/mips-procedure-call/"
parent_title: "MIPS 프로시저 호출"
description: "컴퓨터 구조 · MIPS 프로시저 호출 검증 코드"
sitemap: false
permalink: "/studies/computer-architecture/code/18_mips-procedure-call_verify/"
---
{% raw %}
[MIPS 프로시저 호출](/Hongs_Blog/studies/computer-architecture/mips-procedure-call/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 18.MIPS 프로시저 호출 문서의 값 확인.
# 작은 MIPS 흉내기(파이썬)로 스택과 $ra의 변화를 따라간다. 실제 하드웨어가 아니다.
# 지연 분기는 흉내 내지 않는다: jal은 PC + 4를 $ra에 넣는다.
# 실행: python3 18_mips-procedure-call_verify.py
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


DIFF = """
main:   addi $s0, $zero, 99
        addi $a0, $zero, 10
        addi $a1, $zero, 7
        addi $a2, $zero, 4
        addi $a3, $zero, 2
        jal  diff
        add  $s1, $v0, $zero
        j    Done
diff:   addi $sp, $sp, -4
        sw   $s0, 0($sp)
        add  $t0, $a0, $a1
        add  $t1, $a2, $a3
        sub  $s0, $t0, $t1
        add  $v0, $s0, $zero
        lw   $s0, 0($sp)
        addi $sp, $sp, 4
        jr   $ra
Done:
"""

SUM = """
main:   addi $a0, $zero, 3
        jal  sum
        add  $s0, $v0, $zero
        j    Done
sum:    addi $sp, $sp, -8
        sw   $ra, 4($sp)
        sw   $a0, 0($sp)
        slti $t0, $a0, 1
        beq  $t0, $zero, Rec
        add  $v0, $zero, $zero
        addi $sp, $sp, 8
        jr   $ra
Rec:    addi $a0, $a0, -1
        jal  sum
        lw   $a0, 0($sp)
        lw   $ra, 4($sp)
        addi $sp, $sp, 8
        add  $v0, $a0, $v0
        jr   $ra
Done:
"""
SP0 = 0x7FFFFFFC


def run_sum(n, src=SUM, max_steps=100000):
    m = Machine(src.replace("$zero, 3", "$zero, %d" % n))
    m.r[29] = SP0
    low, snap, events = [SP0], {}, []

    def hook(mm, pc):
        t = " ".join(mm.text[pc].split())
        if mm.r[29] < low[0]:
            low[0] = mm.r[29]
        if t == "sw $a0, 0($sp)":                 # 맡긴 직후
            events.append(("save", mm.r[4], mm.r[31], mm.r[29]))
            if mm.r[29] <= low[0]:
                snap.clear()
                snap.update({a: mm.load_word(a) for a in range(mm.r[29], SP0, 4)})
        if t.startswith("jal"):
            events.append(("jal", mm.r[4], mm.r[31], mm.r[29]))
        if t.startswith("jr"):
            events.append(("ret", mm.r[4], mm.r[31], mm.r[29], mm.r[2]))
    m.run(max_steps=max_steps, hook=hook)
    return m, low[0], snap, events


if __name__ == "__main__":
    # 첫 예: diff
    code, labels = assemble(DIFF)
    assert labels == {"main": 0x00400000, "diff": 0x00400020, "Done": 0x00400044}
    assert code[5][0] == 0x00400014 and code[-1][0] == 0x00400040
    m = Machine(DIFF); m.r[29] = SP0; m.run()
    assert m.reg("$s1") == 11 == (10 + 7) - (4 + 2)
    assert m.reg("$s0") == 99 and m.reg("$ra") == 0x00400018 and m.r[29] == SP0

    # 실패 시나리오 2 / 카드 C4: $s0을 맡기지 않으면 값은 맞게 돌려주지만 main의 $s0이 바뀐다
    broken = DIFF.replace("        sw   $s0, 0($sp)\n", "").replace("        lw   $s0, 0($sp)\n", "")
    m = Machine(broken); m.r[29] = SP0; m.run()
    assert m.reg("$s1") == 11 and m.reg("$s0") == 11

    # 재귀 sum: 주소
    code, labels = assemble(SUM)
    assert labels == {"main": 0x00400000, "sum": 0x00400010, "Rec": 0x00400030, "Done": 0x0040004C}
    addr = {" ".join(t.split()): a for a, _, t in code}
    assert addr["jal sum"] == 0x00400034 and addr["lw $a0, 0($sp)"] == 0x00400038
    assert addr["jr $ra"] == 0x00400048

    # 추적 표
    m, low, snap, ev = run_sum(3)
    assert m.reg("$s0") == 6 and m.r[29] == SP0 and m.steps == 48 and low == 0x7FFFFFDC
    assert ev == [
        ("jal", 3, 0x00400008, 0x7FFFFFFC),
        ("save", 3, 0x00400008, 0x7FFFFFF4),
        ("jal", 2, 0x00400038, 0x7FFFFFF4),
        ("save", 2, 0x00400038, 0x7FFFFFEC),
        ("jal", 1, 0x00400038, 0x7FFFFFEC),
        ("save", 1, 0x00400038, 0x7FFFFFE4),
        ("jal", 0, 0x00400038, 0x7FFFFFE4),
        ("save", 0, 0x00400038, 0x7FFFFFDC),
        ("ret", 0, 0x00400038, 0x7FFFFFE4, 0),
        ("ret", 1, 0x00400038, 0x7FFFFFEC, 1),
        ("ret", 2, 0x00400038, 0x7FFFFFF4, 3),
        ("ret", 3, 0x00400008, 0x7FFFFFFC, 6),
    ]
    # 가장 깊을 때의 스택
    assert snap == {0x7FFFFFF8: 0x00400008, 0x7FFFFFF4: 3, 0x7FFFFFF0: 0x00400038, 0x7FFFFFEC: 2,
                    0x7FFFFFE8: 0x00400038, 0x7FFFFFE4: 1, 0x7FFFFFE0: 0x00400038, 0x7FFFFFDC: 0}
    assert SP0 - low == 32

    # n = 0..7: 결과와 $sp 복구, 프레임은 (n + 1)겹
    for n in range(8):
        m, low, _, _ = run_sum(n)
        assert m.reg("$s0") == n * (n + 1) // 2 and m.r[29] == SP0 and SP0 - low == 8 * (n + 1)

    # 카드 C2
    m, low, snap, _ = run_sum(2)
    assert low == 0x7FFFFFE4 and snap[0x7FFFFFF8] == 0x00400008 and snap[0x7FFFFFF0] == 0x00400038
    assert m.reg("$s0") == 3

    # 실패 시나리오 1: $ra를 맡기지 않으면 값은 6까지 쌓이지만 main으로 돌아오지 못한다
    bad = SUM.replace("        sw   $ra, 4($sp)\n", "").replace("        lw   $ra, 4($sp)\n", "")
    bcode, _ = assemble(bad)
    baddr = {" ".join(t.split()): a for a, _, t in bcode}
    assert baddr["jal sum"] == 0x00400030
    mm = Machine(bad); mm.r[29] = SP0
    pcs, returns = [], []
    try:
        for _ in range(100000):
            pc = mm.step()
            pcs.append(pc)
            if " ".join(mm.text[pc].split()).startswith("jr"):
                returns.append((mm.pc, mm.r[2]))
        raise SystemExit("멈추지 않았다")
    except AssertionError as e:
        assert "오버플로" in str(e)
    assert returns == [(0x00400034, 0), (0x00400034, 1), (0x00400034, 3), (0x00400034, 6)]
    assert 0x00400008 not in pcs and mm.r[31] == 0x00400034 and mm.r[29] == SP0
    print("ALL CHECKS PASSED")
```
{% endraw %}
