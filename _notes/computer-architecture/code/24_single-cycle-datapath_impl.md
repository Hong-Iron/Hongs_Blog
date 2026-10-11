---
layout: "note"
title: "24_single-cycle-datapath_impl.py"
display_title: "24_single-cycle-datapath_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "24"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/single-cycle-datapath/"
parent_title: "단일 사이클 데이터패스"
description: "컴퓨터 구조 · 단일 사이클 데이터패스 구현 코드"
permalink: "/studies/computer-architecture/code/24_single-cycle-datapath_impl/"
---
{% raw %}
[단일 사이클 데이터패스](/Hongs_Blog/studies/computer-architecture/single-cycle-datapath/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 단일 사이클 MIPS 데이터패스 흉내기 (실제 하드웨어가 아니라 파이썬 흉내다)
# 실행: python3 24_single-cycle-datapath_impl.py
# 다루는 명령어: add, sub, and, or, slt, lw, sw, beq, j
# 주소는 바이트 단위(워드 = 4바이트), 레지스터 번호는 0~31, 코드의 배열 인덱스는 0부터 센다.
# 명령어 메모리와 데이터 메모리는 따로 둔다(교재의 단일 사이클 그림과 같다).
import random

REG = {"$zero": 0, "$at": 1, "$v0": 2, "$v1": 3, "$a0": 4, "$a1": 5, "$a2": 6, "$a3": 7,
       "$t0": 8, "$t1": 9, "$t2": 10, "$t3": 11, "$t4": 12, "$t5": 13, "$t6": 14, "$t7": 15,
       "$s0": 16, "$s1": 17, "$s2": 18, "$s3": 19, "$s4": 20, "$s5": 21, "$s6": 22, "$s7": 23,
       "$t8": 24, "$t9": 25, "$k0": 26, "$k1": 27, "$gp": 28, "$sp": 29, "$fp": 30, "$ra": 31}
FUNCT = {"add": 0x20, "sub": 0x22, "and": 0x24, "or": 0x25, "slt": 0x2A}
OPCODE = {"lw": 0x23, "sw": 0x2B, "beq": 0x04, "j": 0x02}
MASK = 0xFFFFFFFF


def reg(tok):
    tok = tok.strip()
    return REG[tok] if tok in REG else int(tok.lstrip("$"))


def assemble(src):
    """어셈블리 문자열 -> 32비트 기계어 목록. 첫 명령어의 주소는 0이다."""
    lines, labels = [], {}
    for raw in src.strip().splitlines():
        line = raw.split("#")[0].strip()
        if not line:
            continue
        while ":" in line:
            lab, line = line.split(":", 1)
            labels[lab.strip()] = 4 * len(lines)
            line = line.strip()
        if line:
            lines.append(line)
    words = []
    for i, line in enumerate(lines):
        op, rest = (line.split(None, 1) + [""])[:2]
        a = [x.strip() for x in rest.split(",")] if rest else []
        pc = 4 * i
        if op in FUNCT:                       # add rd, rs, rt
            rd, rs, rt = reg(a[0]), reg(a[1]), reg(a[2])
            w = (rs << 21) | (rt << 16) | (rd << 11) | FUNCT[op]
        elif op in ("lw", "sw"):              # lw rt, imm(rs)
            rt = reg(a[0])
            imm, rs = a[1].rstrip(")").split("(")
            w = (OPCODE[op] << 26) | (reg(rs) << 21) | (rt << 16) | (int(imm, 0) & 0xFFFF)
        elif op == "beq":                     # beq rs, rt, label
            rs, rt = reg(a[0]), reg(a[1])
            off = (labels[a[2]] - (pc + 4)) // 4 if a[2] in labels else int(a[2], 0)
            w = (OPCODE[op] << 26) | (rs << 21) | (rt << 16) | (off & 0xFFFF)
        elif op == "j":
            tgt = labels[a[0]] if a[0] in labels else int(a[0], 0)
            w = (OPCODE[op] << 26) | ((tgt >> 2) & 0x3FFFFFF)
        else:
            raise ValueError(line)
        words.append(w)
    return words, lines


def sign_extend16(x):
    """16비트 값을 32비트로 늘린다. 맨 위 비트를 위쪽 16칸에 복사한다."""
    return x | 0xFFFF0000 if x & 0x8000 else x


def to_signed(x):
    return x - (1 << 32) if x & 0x80000000 else x


# ---------------- 제어 ----------------
def main_control(opcode):
    """opcode 6비트 -> 제어 신호. None은 '아무 값이나 괜찮다'(X)는 뜻이다."""
    X = None
    table = {
        0x00: dict(RegDst=1, ALUSrc=0, MemtoReg=0, RegWrite=1, MemRead=0, MemWrite=0, Branch=0, ALUOp=0b10, Jump=0),
        0x23: dict(RegDst=0, ALUSrc=1, MemtoReg=1, RegWrite=1, MemRead=1, MemWrite=0, Branch=0, ALUOp=0b00, Jump=0),
        0x2B: dict(RegDst=X, ALUSrc=1, MemtoReg=X, RegWrite=0, MemRead=0, MemWrite=1, Branch=0, ALUOp=0b00, Jump=0),
        0x04: dict(RegDst=X, ALUSrc=0, MemtoReg=X, RegWrite=0, MemRead=0, MemWrite=0, Branch=1, ALUOp=0b01, Jump=0),
        0x02: dict(RegDst=X, ALUSrc=X, MemtoReg=X, RegWrite=0, MemRead=0, MemWrite=0, Branch=0, ALUOp=X, Jump=1),
    }
    return table[opcode]


def alu_control(aluop, funct):
    """ALUOp 2비트와 funct 6비트 -> ALU 제어 4비트."""
    if aluop == 0b00:
        return 0b0010            # 더하기 (lw, sw의 주소 계산)
    if aluop == 0b01:
        return 0b0110            # 빼기 (beq의 비교)
    return {0x20: 0b0010, 0x22: 0b0110, 0x24: 0b0000, 0x25: 0b0001, 0x2A: 0b0111}[funct]


def alu(ctl, a, b):
    if ctl == 0b0000:
        r = a & b
    elif ctl == 0b0001:
        r = a | b
    elif ctl == 0b0010:
        r = (a + b) & MASK
    elif ctl == 0b0110:
        r = (a - b) & MASK
    elif ctl == 0b0111:
        r = 1 if to_signed(a) < to_signed(b) else 0
    else:
        raise ValueError(ctl)
    return r, int(r == 0)


# ---------------- 한 사이클 ----------------
def step(pc, regs, mem, words, xfill=0, override=None):
    """클록 한 번. 도선마다 흐르는 값을 사전으로 돌려준다. xfill은 X 칸에 넣을 값(0 또는 1).
    override는 {opcode: 제어 신호 사전}으로, 제어 표의 한 줄을 바꾸거나 새 줄을 넣어 볼 때 쓴다."""
    ins = words[pc // 4]
    opcode, rs, rt, rd = ins >> 26, (ins >> 21) & 31, (ins >> 16) & 31, (ins >> 11) & 31
    imm16, funct, addr26 = ins & 0xFFFF, ins & 0x3F, ins & 0x3FFFFFF
    row = dict(main_control(opcode)) if opcode in (0, 0x23, 0x2B, 4, 2) else {}
    row.update((override or {}).get(opcode, {}))
    c = {k: (xfill if v is None else v) for k, v in row.items()}
    pc4 = (pc + 4) & MASK
    rd1, rd2 = regs[rs], regs[rt]
    ext = sign_extend16(imm16)
    alu_b = ext if c["ALUSrc"] else rd2
    ctl = alu_control(c["ALUOp"], funct) if not c["Jump"] else 0b0010
    result, zero = alu(ctl, rd1, alu_b)
    memdata = mem.get(result, 0) if c["MemRead"] else None
    if c["MemWrite"]:
        assert result % 4 == 0
        mem[result] = rd2
    write_reg = rd if c["RegDst"] else rt
    write_data = memdata if c["MemtoReg"] else result
    if c["RegWrite"] and write_reg != 0:
        regs[write_reg] = write_data
    branch_target = (pc4 + ((ext << 2) & MASK)) & MASK
    pcsrc = c["Branch"] & zero
    jump_target = (pc4 & 0xF0000000) | (addr26 << 2)
    next_pc = jump_target if c["Jump"] else (branch_target if pcsrc else pc4)
    wires = dict(pc=pc, ins=ins, opcode=opcode, rs=rs, rt=rt, rd=rd, imm16=imm16, funct=funct,
                 ReadData1=rd1, ReadData2=rd2, SignExt=ext, ALUb=alu_b, ALUctl=ctl, ALUResult=result,
                 Zero=zero, MemData=memdata, WriteReg=write_reg if c["RegWrite"] else None,
                 WriteData=write_data if c["RegWrite"] else None, BranchTarget=branch_target,
                 PCSrc=pcsrc, next_pc=next_pc, **c)
    return next_pc, wires


def run(words, regs=None, mem=None, xfill=0, limit=100000, override=None):
    regs = list(regs) if regs else [0] * 32
    mem = dict(mem) if mem else {}
    pc, trace = 0, []
    while 0 <= pc < 4 * len(words):
        pc, w = step(pc, regs, mem, words, xfill, override)
        trace.append(w)
        assert len(trace) < limit
    return regs, mem, trace


# ---------------- 제어 신호 없이 뜻만 따라 하는 기준 해석기 ----------------
def reference(lines_words, regs=None, mem=None):
    """명령어의 뜻(레지스터 전송 식)만으로 실행한다. 데이터패스·제어 신호를 쓰지 않는다."""
    words = lines_words
    regs = list(regs) if regs else [0] * 32
    mem = dict(mem) if mem else {}
    pc, order = 0, []
    while 0 <= pc < 4 * len(words):
        ins = words[pc // 4]
        order.append(pc)
        op, rs, rt, rd = ins >> 26, (ins >> 21) & 31, (ins >> 16) & 31, (ins >> 11) & 31
        imm = to_signed(sign_extend16(ins & 0xFFFF))
        npc = pc + 4
        if op == 0:
            f, a, b = ins & 0x3F, regs[rs], regs[rt]
            v = {0x20: (a + b) & MASK, 0x22: (a - b) & MASK, 0x24: a & b, 0x25: a | b,
                 0x2A: int(to_signed(a) < to_signed(b))}[f]
            if rd:
                regs[rd] = v
        elif op == 0x23:
            if rt:
                regs[rt] = mem.get((regs[rs] + imm) & MASK, 0)
        elif op == 0x2B:
            mem[(regs[rs] + imm) & MASK] = regs[rt]
        elif op == 0x04:
            if regs[rs] == regs[rt]:
                npc = pc + 4 + 4 * imm
        elif op == 0x02:
            npc = ((pc + 4) & 0xF0000000) | ((ins & 0x3FFFFFF) << 2)
        pc = npc
    return regs, mem, order


def random_program(rng, n):
    """끝나는 것이 보장되는 무작위 프로그램(분기와 점프는 앞으로만 간다)."""
    out = []
    for i in range(n):
        k = rng.random()
        r = lambda: rng.randint(0, 8)
        if k < 0.45:
            out.append(f"{rng.choice(list(FUNCT))} ${r()}, ${r()}, ${r()}")
        elif k < 0.62:
            out.append(f"lw ${r()}, {4 * rng.randint(0, 7)}($28)")
        elif k < 0.79:
            out.append(f"sw ${r()}, {4 * rng.randint(0, 7)}($28)")
        elif k < 0.93:
            out.append(f"beq ${r()}, ${r()}, {rng.randint(0, min(4, n - 1 - i))}")
        else:
            out.append(f"j {4 * rng.randint(i + 1, n)}")
    return "\n".join(out)


def random_state(rng):
    regs = [0] * 32
    for i in range(1, 9):
        regs[i] = rng.choice([0, 1, 2, 3, 5, 0xFFFFFFFF, 0xFFFFFFFE, 7])
    regs[28] = 64
    mem = {64 + 4 * i: rng.choice([0, 1, 2, 9, 0xFFFFFFFD]) for i in range(8)}
    return regs, mem


if __name__ == "__main__":
    # 1. 기계어로 옮기기: 필드 값이 MIPS 참조표와 같다
    w, _ = assemble("add $t0, $s1, $s2\nlw $t0, 8($s3)\nsw $t0, 12($s3)\nbeq $t0, $t1, 3\nj 0x40")
    assert w[0] == 0x02324020 and w[0] >> 26 == 0 and w[0] & 0x3F == 0x20
    assert w[1] == 0x8E680008 and w[1] >> 26 == 0x23 == 35
    assert w[2] == 0xAE68000C and w[2] >> 26 == 0x2B == 43
    assert w[3] == 0x11090003 and w[3] >> 26 == 4
    assert w[4] == 0x08000010 and w[4] >> 26 == 2

    # 2. 문서 '예시로 보기'의 네 명령어 (문서 표의 값)
    regs = [0] * 32
    regs[REG["$s1"]], regs[REG["$s2"]], regs[REG["$s3"]], regs[REG["$t1"]] = 7, 5, 100, 12
    mem = {108: 40}
    src = """
        add $t0, $s1, $s2
        lw  $t2, 8($s3)
        sw  $t0, 12($s3)
        beq $t0, $t1, skip
        sub $t3, $t2, $t0
  skip: or  $t4, $t0, $t2
    """
    words, lines = assemble(src)
    r, m, tr = run(words, regs, mem)
    t = tr[0]   # add
    assert (t["ReadData1"], t["ReadData2"], t["ALUb"], t["ALUResult"], t["WriteReg"], t["WriteData"]) == (7, 5, 5, 12, 8, 12)
    assert t["next_pc"] == 4 and t["MemData"] is None
    # add를 실행할 때도 분기용 가산기는 (쓸모없는) 값을 계산한다. 멀티플렉서가 고르지 않을 뿐이다
    assert t["SignExt"] == 0x4020 and t["BranchTarget"] == 4 + (0x4020 << 2) and t["PCSrc"] == 0
    t = tr[1]   # lw
    assert (t["ReadData1"], t["SignExt"], t["ALUb"], t["ALUResult"], t["MemData"], t["WriteReg"], t["WriteData"]) == (100, 8, 8, 108, 40, 10, 40)
    t = tr[2]   # sw
    assert (t["ReadData1"], t["ReadData2"], t["ALUResult"], t["WriteReg"]) == (100, 12, 112, None) and m[112] == 12
    t = tr[3]   # beq: 12 == 12 -> 간다
    assert (t["ReadData1"], t["ReadData2"], t["ALUResult"], t["Zero"], t["PCSrc"]) == (12, 12, 0, 1, 1)
    assert t["SignExt"] == 1 and t["BranchTarget"] == 12 + 4 + 4 * 1 == 20 and t["next_pc"] == 20
    assert [x["pc"] for x in tr] == [0, 4, 8, 12, 20]         # sub(16번지)는 건너뛴다
    assert r[REG["$t3"]] == 0 and r[REG["$t4"]] == (12 | 40) == 44
    # 같지 않으면 다음 명령어로 간다
    regs2 = list(regs); regs2[REG["$t1"]] = 13
    r2, _, tr2 = run(words, regs2, mem)
    assert [x["pc"] for x in tr2] == [0, 4, 8, 12, 16, 20] and tr2[3]["Zero"] == 0 and r2[REG["$t3"]] == 40 - 12 == 28

    # 3. 카드와 연습 문서의 값
    # C(trace): lw $t5, -4($s3), $s3 = 100, 메모리 96번지 = 77
    words3, _ = assemble("lw $t5, -4($s3)")
    regs3 = [0] * 32; regs3[REG["$s3"]] = 100
    r3, _, tr3 = run(words3, regs3, {96: 77})
    assert tr3[0]["SignExt"] == 0xFFFFFFFC and tr3[0]["ALUResult"] == 96 and r3[REG["$t5"]] == 77
    # 뒤로 가는 분기: 40번지의 beq, 오프셋 -3 -> 40 + 4 - 12 = 32
    words4, _ = assemble("\n".join(["add $0, $0, $0"] * 10 + ["beq $0, $0, -3"]))
    _, w4 = step(40, [0] * 32, {}, words4)
    assert w4["SignExt"] == 0xFFFFFFFD and w4["BranchTarget"] == 32
    # j: 주소 칸 26비트를 왼쪽으로 두 칸 밀고 PC+4의 위 4비트를 붙인다
    words5, _ = assemble("j 0x40")
    _, w5 = step(0, [0] * 32, {}, words5)
    assert w5["next_pc"] == 0x40 and w5["Jump"] == 1
    # slt는 부호 있는 비교다: -1 < 1
    words6, _ = assemble("slt $t0, $t1, $t2")
    regs6 = [0] * 32; regs6[9], regs6[10] = 0xFFFFFFFF, 1
    assert run(words6, regs6)[0][8] == 1
    # $zero에는 써도 0이다
    words7, _ = assemble("add $zero, $t1, $t2")
    assert run(words7, regs6)[0][0] == 0

    # 4. X 칸(아무 값)은 정말 결과를 바꾸지 않는다, 그리고 기준 해석기와 늘 같다
    rng = random.Random(24)
    for _ in range(3000):
        words, _ = assemble(random_program(rng, rng.randint(1, 25)))
        regs, mem = random_state(rng)
        ref = reference(words, regs, mem)
        for xf in (0, 1):
            got = run(words, regs, mem, xfill=xf)
            assert got[0] == ref[0] and got[1] == ref[1]
            assert [t["pc"] for t in got[2]] == ref[2]

    # 5. 명령어 종류마다 쓰는 부품 (문서 표): 데이터 메모리를 읽는 것은 lw뿐, 쓰는 것은 sw뿐
    use = {}
    for name, op in [("R", 0), ("lw", 0x23), ("sw", 0x2B), ("beq", 4), ("j", 2)]:
        c = main_control(op)
        use[name] = (c["RegWrite"], c["MemRead"], c["MemWrite"])
    assert use == {"R": (1, 0, 0), "lw": (1, 1, 0), "sw": (0, 0, 1), "beq": (0, 0, 0), "j": (0, 0, 0)}

    # 6. 제어 신호를 하나 틀리게 주면 결과가 달라진다 (25 문서)
    regs = [0] * 32
    regs[REG["$s3"]], regs[REG["$t0"]], regs[REG["$t1"]] = 100, 12, 5
    words, _ = assemble("sw $t0, 12($s3)")
    good = run(words, regs, {})
    bad = run(words, regs, {}, override={0x2B: dict(RegWrite=1, RegDst=0, MemtoReg=0)})   # sw인데 RegWrite = 1
    assert good[0][8] == 12 and bad[0][8] == 112            # $t0가 주소 112로 덮였다
    words, _ = assemble("add $t2, $t0, $t1")
    assert run(words, regs)[0][10] == 17
    bad = run(words, regs, override={0: dict(RegDst=0)})    # R형인데 RegDst = 0: rd가 아니라 rt에 쓴다
    assert bad[0][10] == 0 and bad[0][9] == 17
    bad = run(words, regs, override={0: dict(ALUSrc=1)})    # R형인데 ALUSrc = 1: 아래 16비트를 더한다
    assert bad[0][10] == (12 + sign_extend16(words[0] & 0xFFFF)) & MASK != 17
    words, _ = assemble("lw $t2, 0($s3)")
    assert run(words, regs, {100: 77})[0][10] == 77
    bad = run(words, regs, {100: 77}, override={0x23: dict(MemtoReg=0)})   # lw인데 MemtoReg = 0: 주소를 쓴다
    assert bad[0][10] == 100
    # beq인데 Branch = 0이면 같아도 가지 않는다
    words, _ = assemble("beq $t0, $t0, 1\nadd $t3, $t0, $t1\nadd $t4, $t0, $t1")
    assert run(words, regs)[0][11] == 0 and run(words, regs, override={4: dict(Branch=0)})[0][11] == 17

    # 7. 새 명령어 addi(opcode 8)를 넣는 제어 줄 (25 문서 카드): 데이터패스는 그대로 둔다
    ADDI = {8: dict(RegDst=0, ALUSrc=1, MemtoReg=0, RegWrite=1, MemRead=0, MemWrite=0, Branch=0, ALUOp=0b00, Jump=0)}
    w_addi = (8 << 26) | (REG["$t0"] << 21) | (REG["$t5"] << 16) | (-7 & 0xFFFF)     # addi $t5, $t0, -7
    assert run([w_addi], regs, override=ADDI)[0][13] == 5

    # 8. 연습 문서(데이터패스 추적 예제 사다리)의 값
    nop = "add $0, $0, $0"
    regs = [0] * 32
    regs[REG["$s0"]], regs[REG["$s1"]], regs[REG["$s2"]], regs[REG["$t1"]] = 200, 9, 9, 31
    def at(pc, text, regs, mem):
        words, _ = assemble("\n".join([nop] * (pc // 4) + [text]))
        rr, mm = list(regs), dict(mem)
        npc, w = step(pc, rr, mm, words)
        return npc, w, rr, mm
    npc, w, rr, mm = at(24, "lw $t1, 12($s0)", regs, {212: 55})          # 문제 1
    assert w["ins"] == 0x8E09000C and (w["opcode"], w["rs"], w["rt"], w["imm16"]) == (35, 16, 9, 12)
    assert (w["ReadData1"], w["SignExt"], w["ALUResult"], w["MemData"], w["WriteReg"], w["WriteData"], npc) == (200, 12, 212, 55, 9, 55, 28)
    npc, w, rr, mm = at(28, "sw $t1, -8($s0)", regs, {})                 # 문제 2
    assert w["ins"] == 0xAE09FFF8 and (w["opcode"], w["rs"], w["rt"], w["imm16"]) == (43, 16, 9, 0xFFF8)
    assert (w["ReadData1"], w["ReadData2"], w["SignExt"], w["ALUResult"], w["WriteReg"], npc) == (200, 31, 0xFFFFFFF8, 192, None, 32) and mm == {192: 31}
    npc, w, rr, mm = at(48, "beq $s1, $s2, -5", regs, {})                # 문제 3
    assert w["ins"] == 0x1232FFFB and (w["ReadData1"], w["ReadData2"], w["ALUctl"], w["ALUResult"], w["Zero"]) == (9, 9, 0b0110, 0, 1)
    assert w["SignExt"] == 0xFFFFFFFB and w["BranchTarget"] == 52 - 20 == 32 and npc == 32 and w["PCSrc"] == 1
    regs4 = list(regs); regs4[REG["$s1"]], regs4[REG["$s2"]] = 0xFFFFFFFB, 3
    npc, w = step(0, regs4, {}, [0x0232402A])                              # 문제 4: slt $t0, $s1, $s2
    assert assemble("slt $t0, $s1, $s2")[0] == [0x0232402A]
    assert (w["opcode"], w["rs"], w["rt"], w["rd"], w["funct"]) == (0, 17, 18, 8, 0x2A)
    assert (w["ALUctl"], w["ALUResult"], w["Zero"], w["WriteReg"], w["WriteData"], npc) == (0b0111, 1, 0, 8, 1, 4) and regs4[8] == 1
    # 같은 비트를 부호 없는 수로 견주면 답이 뒤집힌다 (흔한 오답)
    assert not (0xFFFFFFFB < 3)
    print("ALL CHECKS PASSED")
```
{% endraw %}
