---
layout: "note"
title: "16_mips-encoding-ladder_p4.py"
display_title: "16_mips-encoding-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "16"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/mips-encoding-ladder/"
parent_title: "명령어 인코딩 예제 사다리"
description: "컴퓨터 구조 · 명령어 인코딩 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/computer-architecture/code/16_mips-encoding-ladder_p4/"
---
{% raw %}
[명령어 인코딩 예제 사다리](/Hongs_Blog/studies/computer-architecture/mips-encoding-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 16.명령어 인코딩 예제 사다리의 문제 1~4 답 확인.
# 개념 코드 16_mips-instruction-formats_impl.py의 인코더·디코더를 복사해 넣었다(파일끼리 import하지 않는다).
# 실제 어셈블러가 아니다.
# 실행: python3 16_mips-encoding-ladder_p4.py
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


def grouped(word, widths):
    b, out, i = format(word, "032b"), [], 0
    for w in widths:
        out.append(b[i:i + w])
        i += w
    return " ".join(out)


if __name__ == "__main__":
    R, I = (6, 5, 5, 5, 5, 6), (6, 5, 5, 16)
    NIB = (4,) * 8
    # 표의 값
    assert (R_FUNCT["sub"], R_FUNCT["srl"], I_OP["addi"], I_OP["slti"], I_OP["sw"]) == (0x22, 0x02, 0x08, 0x0A, 0x2B)
    assert (reg("$a0"), reg("$t0"), reg("$t3"), reg("$s1"), reg("$s5")) == (4, 8, 11, 17, 21)

    # 문제 1
    w = encode("sub $t2, $s3, $s4")
    assert w == 0x02745022 and decode(w) == "sub $t2, $s3, $s4"
    assert grouped(w, R) == "000000 10011 10100 01010 00000 100010"
    assert grouped(w, NIB) == "0000 0010 0111 0100 0101 0000 0010 0010"
    assert (reg("$t2"), reg("$s3"), reg("$s4")) == (10, 19, 20)

    # 문제 2
    w = encode("addi $t0, $s5, -12")
    assert w == 0x22A8FFF4 and decode(w) == "addi $t0, $s5, -12"
    assert grouped(w, I) == "001000 10101 01000 1111111111110100"
    assert grouped(w, NIB) == "0010 0010 1010 1000 1111 1111 1111 0100"
    assert (~0x000C) & 0xFFFF == 0xFFF3 and 0xFFF3 + 1 == 0xFFF4 == (-12) & 0xFFFF

    # 문제 3
    w = encode("sw $t3, 48($s2)")
    assert w == 0xAE4B0030 and decode(w) == "sw $t3, 48($s2)"
    assert grouped(w, I) == "101011 10010 01011 0000000000110000"
    assert grouped(w, NIB) == "1010 1110 0100 1011 0000 0000 0011 0000"
    assert reg("$s2") == 18 and 48 == 0x30

    # 문제 4
    w = encode("slti $t0, $a0, 1")
    assert w == 0x28880001 and grouped(w, I) == "001010 00100 01000 0000000000000001"
    assert grouped(w, NIB) == "0010 1000 1000 1000 0000 0000 0000 0001"
    assert decode(0x001140C2) == "srl $t0, $s1, 3"
    assert grouped(0x001140C2, R) == "000000 00000 10001 01000 00011 000010"
    assert grouped(0x001140C2, NIB) == "0000 0000 0001 0001 0100 0000 1100 0010"
    print("ALL CHECKS PASSED")
```
{% endraw %}
