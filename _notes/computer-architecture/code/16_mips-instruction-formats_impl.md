---
layout: "note"
title: "16_mips-instruction-formats_impl.py"
display_title: "16_mips-instruction-formats_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "16"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/mips-instruction-formats/"
parent_title: "MIPS 명령어 형식"
description: "컴퓨터 구조 · MIPS 명령어 형식 구현 코드"
sitemap: false
permalink: "/studies/computer-architecture/code/16_mips-instruction-formats_impl/"
---
{% raw %}
[MIPS 명령어 형식](/Hongs_Blog/studies/computer-architecture/mips-instruction-formats/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 16.MIPS 명령어 형식: MIPS 명령 일부의 인코더·디코더.
# encode()는 어셈블리어 한 줄을 32비트 기계어로, decode()는 거꾸로 바꾼다.
# 실제 어셈블러가 아니다. opcode·funct 값은 MIPS Green Sheet의 표를 옮겼다.
# 실행: python3 16_mips-instruction-formats_impl.py
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


def random_instruction(rng):
    m = rng.choice(sorted(R_FUNCT) + sorted(I_OP) + sorted(J_OP))
    r = lambda: rname(rng.randrange(32))
    simm = lambda: str(rng.randint(-32768, 32767))
    uimm = lambda: "0x%x" % rng.randrange(65536)
    if m in SHIFTS:
        return "%s %s, %s, %d" % (m, r(), r(), rng.randrange(32)), 0
    if m == "jr":
        return "jr %s" % r(), 0
    if m in ("mult", "multu", "div", "divu"):
        return "%s %s, %s" % (m, r(), r()), 0
    if m in ("mfhi", "mflo"):
        return "%s %s" % (m, r()), 0
    if m in R_FUNCT:
        return "%s %s, %s, %s" % (m, r(), r(), r()), 0
    if m in MEMOPS:
        return "%s %s, %s(%s)" % (m, r(), simm(), r()), 0
    if m in ("beq", "bne"):
        addr = 0x00400000 + 4 * rng.randrange(1000)
        target = addr + 4 + 4 * rng.randint(-32768, 32767)
        return "%s %s, %s, 0x%08x" % (m, r(), r(), target & MASK), addr
    if m == "lui":
        return "lui %s, %s" % (r(), uimm()), 0
    if m in ZERO_EXT:
        return "%s %s, %s, %s" % (m, r(), r(), uimm()), 0
    if m in J_OP:
        addr = 0x00400000 + 4 * rng.randrange(1000)
        return "%s 0x%08x" % (m, 4 * rng.randrange(1 << 26)), addr
    return "%s %s, %s, %s" % (m, r(), r(), simm()), 0


if __name__ == "__main__":
    # Green Sheet의 값 그대로인지
    assert (R_FUNCT["add"], R_FUNCT["sub"], R_FUNCT["and"], R_FUNCT["or"], R_FUNCT["nor"],
            R_FUNCT["slt"], R_FUNCT["sll"], R_FUNCT["srl"], R_FUNCT["jr"]) == \
           (0x20, 0x22, 0x24, 0x25, 0x27, 0x2A, 0x00, 0x02, 0x08)
    assert (I_OP["beq"], I_OP["bne"], I_OP["addi"], I_OP["slti"], I_OP["andi"], I_OP["ori"],
            I_OP["lui"], I_OP["lw"], I_OP["sw"]) == (4, 5, 8, 0xA, 0xC, 0xD, 0xF, 0x23, 0x2B)
    assert (J_OP["j"], J_OP["jal"]) == (2, 3)

    # 문서의 값
    doc = {"add $t0, $s1, $s2": 0x02324020, "lw $t0, 32($s3)": 0x8E680020,
           "addi $s1, $s2, -5": 0x2251FFFB, "sll $t2, $s0, 4": 0x00105100,
           "sub $s0, $t3, $t5": 0x016D8022, "or $v0, $a0, $a1": 0x00851025,
           "lw $t2, 16($t1)": 0x8D2A0010}
    for text, word in doc.items():
        assert encode(text) == word, text
        assert decode(word) == text, text
    assert format(0x02324020, "032b") == "000000" "10001" "10010" "01000" "00000" "100000"
    assert format(0x8E680020, "032b") == "100011" "10011" "01000" "0000000000100000"
    assert format(0x2251FFFB, "032b") == "001000" "10010" "10001" "1111111111111011"
    assert format(0x00105100, "032b") == "000000" "00000" "10000" "01010" "00100" "000000"
    assert format(0x016D8022, "032b") == "000000" "01011" "01101" "10000" "00000" "100010"
    assert format(0x00851025, "032b") == "000000" "00100" "00101" "00010" "00000" "100101"
    assert format(0x8D2A0010, "032b") == "100011" "01001" "01010" "0000000000010000"
    f = split_fields(0x016D8022)
    assert (f["op"], f["rs"], f["rt"], f["rd"], f["shamt"], f["funct"]) == (0, 11, 13, 16, 0, 0x22)
    assert (reg("$s1"), reg("$s2"), reg("$t0"), reg("$s3")) == (17, 18, 8, 19)
    assert (2**16 - 5) == 0xFFFB == 65531 and signed32(0xFFFFFFFB) == -5

    # 오해 항목: 적은 순서대로 넣으면 다른 명령이 된다
    wrong = fields_r(0, reg("$t0"), reg("$s1"), reg("$s2"), 0, 0x20)
    assert wrong == 0x01119020 and decode(wrong) == "add $s2, $t0, $s1"

    # 형식에 들어가지 않는 것
    for bad in ("lw $t0, 40000($s3)", "sll $t0, $t1, 32", "addi $t0, $s1, 70000"):
        try:
            encode(bad)
            raise SystemExit("막지 못했다: " + bad)
        except AssertionError:
            pass
    try:
        encode("add $t0, $s1, 5")
        raise SystemExit("막지 못했다")
    except (AssertionError, ValueError):
        pass

    # 무작위 왕복
    rng = random.Random(16)
    seen = set()
    for _ in range(2000):
        text, addr = random_instruction(rng)
        word = encode(text, addr)
        assert 0 <= word < 2**32
        assert decode(word, addr) == text, (text, hex(word), decode(word, addr))
        assert encode(decode(word, addr), addr) == word
        seen.add(text.split()[0])
    assert len(seen) == len(R_FUNCT) + len(I_OP) + len(J_OP)
    print("ALL CHECKS PASSED")
```
{% endraw %}
