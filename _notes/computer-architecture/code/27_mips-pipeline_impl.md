---
layout: "note"
title: "27_mips-pipeline_impl.py"
display_title: "27_mips-pipeline_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "27"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/mips-pipeline/"
parent_title: "5단계 파이프라인"
description: "컴퓨터 구조 · 5단계 파이프라인 구현 코드"
sitemap: false
permalink: "/studies/computer-architecture/code/27_mips-pipeline_impl/"
---
{% raw %}
[5단계 파이프라인](/Hongs_Blog/studies/computer-architecture/mips-pipeline/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 5단계 MIPS 파이프라인 흉내기 (실제 하드웨어가 아니라 파이썬 흉내다)
# 실행: python3 27_mips-pipeline_impl.py
# 다루는 명령어: add, sub, and, or, slt, lw, sw, beq, j
# 단계: IF(가져오기) ID(해독·레지스터 읽기) EX(ALU) MEM(데이터 메모리) WB(레지스터 쓰기)
# 사이클 번호는 1부터 센다. 주소는 바이트 단위, 첫 명령어의 주소는 0이다.
# 단일 사이클 흉내기(24_single-cycle-datapath_impl.py)의 필요한 부분을 복사해 넣었다(파일끼리 import하지 않는다).
import random

REG = {"$zero": 0, "$at": 1, "$v0": 2, "$v1": 3, "$a0": 4, "$a1": 5, "$a2": 6, "$a3": 7,
       "$t0": 8, "$t1": 9, "$t2": 10, "$t3": 11, "$t4": 12, "$t5": 13, "$t6": 14, "$t7": 15,
       "$s0": 16, "$s1": 17, "$s2": 18, "$s3": 19, "$s4": 20, "$s5": 21, "$s6": 22, "$s7": 23,
       "$t8": 24, "$t9": 25, "$k0": 26, "$k1": 27, "$gp": 28, "$sp": 29, "$fp": 30, "$ra": 31}
FUNCT = {"add": 0x20, "sub": 0x22, "and": 0x24, "or": 0x25, "slt": 0x2A}
OPCODE = {"lw": 0x23, "sw": 0x2B, "beq": 0x04, "j": 0x02}
MASK = 0xFFFFFFFF
HANDLER = 0x80000180      # 예외가 나면 가는 주소


def reg(tok):
    tok = tok.strip()
    return REG[tok] if tok in REG else int(tok.lstrip("$"))


def assemble(src):
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
        if op in FUNCT:
            rd, rs, rt = reg(a[0]), reg(a[1]), reg(a[2])
            w = (rs << 21) | (rt << 16) | (rd << 11) | FUNCT[op]
        elif op in ("lw", "sw"):
            rt = reg(a[0])
            imm, rs = a[1].rstrip(")").split("(")
            w = (OPCODE[op] << 26) | (reg(rs) << 21) | (rt << 16) | (int(imm, 0) & 0xFFFF)
        elif op == "beq":
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
    return x | 0xFFFF0000 if x & 0x8000 else x


def to_signed(x):
    return x - (1 << 32) if x & 0x80000000 else x


CONTROL = {   # X 칸은 0으로 채웠다
    0x00: dict(RegDst=1, ALUSrc=0, MemtoReg=0, RegWrite=1, MemRead=0, MemWrite=0, Branch=0, ALUOp=0b10, Jump=0),
    0x23: dict(RegDst=0, ALUSrc=1, MemtoReg=1, RegWrite=1, MemRead=1, MemWrite=0, Branch=0, ALUOp=0b00, Jump=0),
    0x2B: dict(RegDst=0, ALUSrc=1, MemtoReg=0, RegWrite=0, MemRead=0, MemWrite=1, Branch=0, ALUOp=0b00, Jump=0),
    0x04: dict(RegDst=0, ALUSrc=0, MemtoReg=0, RegWrite=0, MemRead=0, MemWrite=0, Branch=1, ALUOp=0b01, Jump=0),
    0x02: dict(RegDst=0, ALUSrc=0, MemtoReg=0, RegWrite=0, MemRead=0, MemWrite=0, Branch=0, ALUOp=0b00, Jump=1),
}
NOCTRL = dict(RegDst=0, ALUSrc=0, MemtoReg=0, RegWrite=0, MemRead=0, MemWrite=0, Branch=0, ALUOp=0, Jump=0)


def alu_control(aluop, funct):
    if aluop == 0b00:
        return 0b0010
    if aluop == 0b01:
        return 0b0110
    return {0x20: 0b0010, 0x22: 0b0110, 0x24: 0b0000, 0x25: 0b0001, 0x2A: 0b0111}[funct]


def alu(ctl, a, b):
    """결과, zero, 넘침(부호 있는 덧셈·뺄셈의 결과가 32비트에 안 들어감)."""
    ovf = 0
    if ctl == 0b0000:
        r = a & b
    elif ctl == 0b0001:
        r = a | b
    elif ctl == 0b0010:
        s = to_signed(a) + to_signed(b)
        r, ovf = s & MASK, int(not -2**31 <= s < 2**31)
    elif ctl == 0b0110:
        s = to_signed(a) - to_signed(b)
        r, ovf = s & MASK, int(not -2**31 <= s < 2**31)
    else:
        r = 1 if to_signed(a) < to_signed(b) else 0
    return r, int(r == 0), ovf


# ---------------- 단일 사이클 (기준) ----------------
def single_cycle(words, regs=None, mem=None, exceptions=False, limit=100000):
    regs = list(regs) if regs else [0] * 32
    mem = dict(mem) if mem else {}
    pc, order, exc = 0, [], None
    while 0 <= pc < 4 * len(words):
        ins = words[pc // 4]
        order.append(pc)
        assert len(order) < limit
        op, rs, rt, rd = ins >> 26, (ins >> 21) & 31, (ins >> 16) & 31, (ins >> 11) & 31
        c = CONTROL[op]
        ext = sign_extend16(ins & 0xFFFF)
        a, b2 = regs[rs], regs[rt]
        res, zero, ovf = alu(alu_control(c["ALUOp"], ins & 0x3F), a, ext if c["ALUSrc"] else b2)
        if exceptions and op == 0 and ovf:           # add·sub의 넘침: 레지스터를 고치지 않고 처리기로 간다
            exc = dict(EPC=pc, Cause=12)
            order.pop()
            pc = HANDLER
            break
        md = mem.get(res, 0) if c["MemRead"] else 0
        if c["MemWrite"]:
            mem[res] = b2
        dest = rd if c["RegDst"] else rt
        if c["RegWrite"] and dest:
            regs[dest] = md if c["MemtoReg"] else res
        pc4 = pc + 4
        if c["Jump"]:
            pc = (pc4 & 0xF0000000) | ((ins & 0x3FFFFFF) << 2)
        elif c["Branch"] and zero:
            pc = (pc4 + (ext << 2)) & MASK
        else:
            pc = pc4
    return regs, mem, order, exc


# ---------------- 파이프라인 ----------------
def bubble():
    return dict(seq=None, pc=None, ins=0, rs=0, rt=0, rd=0, dest=0, ext=0, a=0, b=0, alu=0, wdata=0,
                memdata=0, pc4=0, zero=0, target=0, **NOCTRL)


def pipeline(words, regs=None, mem=None, forwarding=True, branch_stage="ID", exceptions=False, limit=200000, bug=""):
    """돌려주는 것: 레지스터, 메모리, 통계, 사이클별 표.
    forwarding=False면 값을 당겨 쓰는 길이 없어 ID에서 기다리기만 한다.
    branch_stage: beq를 ID에서 정하면 1개, MEM에서 정하면 3개를 버린다. 예측은 늘 '안 간다'.
    bug: 일부러 틀리게 만든 전방 전달. "mem_first"는 MEM/WB를 먼저 보고, "no_zero"는 $zero 검사를 뺀다."""
    regs = list(regs) if regs else [0] * 32
    mem = dict(mem) if mem else {}
    pc = 0
    IFID, IDEX, EXMEM, MEMWB = bubble(), bubble(), bubble(), bubble()
    seqno, cycle, pending = 0, 0, None
    table = {}            # seq -> dict(pc=, stages={cycle: 이름})
    order = []            # WB까지 끝낸 명령어의 주소 (끝낸 순서)
    stats = dict(stalls=0, flushed=0, fwdA={0b10: 0, 0b01: 0}, fwdB={0b10: 0, 0b01: 0}, exc=None, log=[])

    def mark(reg_, name):
        if reg_["seq"] is not None:
            table[reg_["seq"]]["stages"][cycle] = name

    def busy():
        return any(r["seq"] is not None for r in (IFID, IDEX, EXMEM, MEMWB))

    while 0 <= pc < 4 * len(words) or busy():
        cycle += 1
        assert cycle < limit
        # ---- WB: 사이클 앞 절반에 레지스터에 쓴다 ----
        mark(MEMWB, "WB")
        wb_val = MEMWB["memdata"] if MEMWB["MemtoReg"] else MEMWB["alu"]
        if MEMWB["RegWrite"] and MEMWB["dest"]:
            regs[MEMWB["dest"]] = wb_val
        if MEMWB["seq"] is not None:
            order.append(MEMWB["pc"])
        # ---- MEM ----
        mark(EXMEM, "MEM")
        newMEMWB = dict(EXMEM)
        if EXMEM["MemRead"]:
            newMEMWB["memdata"] = mem.get(EXMEM["alu"], 0)
        if EXMEM["MemWrite"]:
            mem[EXMEM["alu"]] = EXMEM["wdata"]
        redirect, kill_if, kill_id, kill_ex = None, False, False, False
        if branch_stage == "MEM" and EXMEM["Branch"] and EXMEM["zero"]:
            redirect, kill_if, kill_id, kill_ex = EXMEM["target"], True, True, True
        # ---- EX ----
        mark(IDEX, "EX")
        fa = fb = 0
        a, b = IDEX["a"], IDEX["b"]
        if forwarding:
            nz = (lambda d: True) if bug == "no_zero" else (lambda d: d != 0)
            ex_a = EXMEM["RegWrite"] and nz(EXMEM["dest"]) and EXMEM["dest"] == IDEX["rs"]
            ex_b = EXMEM["RegWrite"] and nz(EXMEM["dest"]) and EXMEM["dest"] == IDEX["rt"]
            mem_a = MEMWB["RegWrite"] and nz(MEMWB["dest"]) and MEMWB["dest"] == IDEX["rs"]
            mem_b = MEMWB["RegWrite"] and nz(MEMWB["dest"]) and MEMWB["dest"] == IDEX["rt"]
            if bug == "mem_first":
                ex_a, ex_b = ex_a and not mem_a, ex_b and not mem_b
            # EX 해저드: 바로 앞 명령어의 ALU 결과 (EX/MEM에 있다)
            if ex_a:
                fa, a = 0b10, EXMEM["alu"]
            # MEM 해저드: 두 칸 앞 명령어의 결과 (MEM/WB에 있다). EX 해저드가 아닐 때만
            elif mem_a:
                fa, a = 0b01, wb_val
            if ex_b:
                fb, b = 0b10, EXMEM["alu"]
            elif mem_b:
                fb, b = 0b01, wb_val
        if IDEX["seq"] is not None:
            if fa:
                stats["fwdA"][fa] += 1
            if fb:
                stats["fwdB"][fb] += 1
            if fa or fb:
                stats["log"].append((cycle, IDEX["pc"], fa, fb))
        res, zero, ovf = alu(alu_control(IDEX["ALUOp"], IDEX["ins"] & 0x3F), a, IDEX["ext"] if IDEX["ALUSrc"] else b)
        newEXMEM = dict(IDEX, alu=res, zero=zero, wdata=b, dest=IDEX["rd"] if IDEX["RegDst"] else IDEX["rt"],
                        target=(IDEX["pc4"] + (IDEX["ext"] << 2)) & MASK)
        if exceptions and IDEX["seq"] is not None and (IDEX["ins"] >> 26) == 0 and ovf and not kill_ex:
            # 넘침: 이 명령어와 뒤따르던 명령어들을 버리고 처리기로 간다. 앞선 명령어는 끝까지 간다
            stats["exc"] = dict(EPC=IDEX["pc"], Cause=12, cycle=cycle)
            redirect, kill_if, kill_id, kill_ex = HANDLER, True, True, True
        # ---- ID: 사이클 뒤 절반에 레지스터를 읽는다 ----
        mark(IFID, "ID")
        ins = IFID["ins"]
        op, rs, rt, rd = ins >> 26, (ins >> 21) & 31, (ins >> 16) & 31, (ins >> 11) & 31
        live = IFID["seq"] is not None
        c = CONTROL[op] if live else NOCTRL
        reads = {0x00: (rs, rt), 0x23: (rs,), 0x2B: (rs, rt), 0x04: (rs, rt), 0x02: ()}[op] if live else ()
        stall = False
        va, vb = regs[rs], regs[rt]
        if live and forwarding:
            # 적재-사용 해저드 (교재의 조건 그대로: rs·rt 칸과 견준다)
            if op != 0x02 and IDEX["MemRead"] and IDEX["rt"] != 0 and IDEX["rt"] in (rs, rt):
                stall = True
            # ID에서 정하는 beq: 비교할 값이 아직 안 나왔으면 기다린다
            if op == 0x04 and branch_stage == "ID":
                d = IDEX["rd"] if IDEX["RegDst"] else IDEX["rt"]
                if IDEX["RegWrite"] and d != 0 and d in (rs, rt):
                    stall = True                      # 바로 앞 명령어가 EX에 있다
                elif EXMEM["MemRead"] and EXMEM["dest"] != 0 and EXMEM["dest"] in (rs, rt):
                    stall = True                      # 두 칸 앞의 lw가 MEM에 있다
                elif EXMEM["RegWrite"] and EXMEM["dest"] != 0:
                    if EXMEM["dest"] == rs:
                        va = EXMEM["alu"]             # EX/MEM에서 비교기로 당겨 쓴다
                    if EXMEM["dest"] == rt:
                        vb = EXMEM["alu"]
        elif live:
            d = IDEX["rd"] if IDEX["RegDst"] else IDEX["rt"]
            if IDEX["RegWrite"] and d != 0 and d in reads:
                stall = True
            if EXMEM["RegWrite"] and EXMEM["dest"] != 0 and EXMEM["dest"] in reads:
                stall = True
        newIDEX = bubble()
        id_redirect = None
        if live and not stall:
            newIDEX = dict(bubble(), seq=IFID["seq"], pc=IFID["pc"], ins=ins, rs=rs, rt=rt, rd=rd,
                           ext=sign_extend16(ins & 0xFFFF), a=va, b=vb, pc4=IFID["pc4"], **c)
            if c["Jump"]:
                id_redirect = (IFID["pc4"] & 0xF0000000) | ((ins & 0x3FFFFFF) << 2)
            elif op == 0x04 and branch_stage == "ID" and va == vb:
                id_redirect = (IFID["pc4"] + (sign_extend16(ins & 0xFFFF) << 2)) & MASK
        # ---- IF ----
        newIFID = IFID if stall else bubble()
        fetched = None
        if 0 <= pc < 4 * len(words):
            if pending is None:                       # 이 주소의 명령어를 처음 가져온다
                pending = seqno
                table[seqno] = dict(pc=pc, stages={})
                seqno += 1
            table[pending]["stages"][cycle] = "IF"    # 쉬는 동안에는 같은 명령어를 다시 가져온다
            fetched = dict(bubble(), seq=pending, pc=pc, ins=words[pc // 4], pc4=pc + 4)
            if not stall:
                newIFID, pending = fetched, None
        next_pc = pc if stall else (pc + 4 if fetched else pc)
        if stall and not kill_id:
            stats["stalls"] += 1
        # ---- 버리기 ----
        if redirect is None and id_redirect is not None:
            redirect, kill_if = id_redirect, True
        if kill_ex and newEXMEM["seq"] is not None:
            stats["flushed"] += 1
            table[newEXMEM["seq"]]["flushed"] = cycle
            newEXMEM = bubble()
        if kill_id:
            victim = newIDEX if newIDEX["seq"] is not None else (IFID if stall and live else None)
            if victim is not None:
                stats["flushed"] += 1
                table[victim["seq"]]["flushed"] = cycle
            newIDEX = bubble()
            if stall:
                newIFID = bubble()
        if kill_if:
            if fetched is not None:
                stats["flushed"] += 1
                table[fetched["seq"]]["flushed"] = cycle
            pending = None
            if not (stall and not kill_id):
                newIFID = bubble()
        if redirect is not None:
            next_pc = redirect
        pc = next_pc
        IFID, IDEX, EXMEM, MEMWB = newIFID, newIDEX, newEXMEM, newMEMWB
    stats["cycles"] = cycle
    stats["done"] = len(order)
    return regs, mem, stats, table, order


def diagram(table, lines, upto=None):
    """명령어 x 사이클 표를 마크다운으로."""
    last = max(max(t["stages"]) for t in table.values())
    last = min(last, upto) if upto else last
    out = ["| 명령어 | " + " | ".join(str(c) for c in range(1, last + 1)) + " |", "|---" * (last + 1) + "|"]
    for seq in sorted(table):
        t = table[seq]
        cells = []
        for c in range(1, last + 1):
            s = t["stages"].get(c, "")
            if "flushed" in t and c > t["flushed"]:
                s = "버림" if c == t["flushed"] + 1 else ""
            cells.append(s)
        out.append(f"| `{lines[t['pc'] // 4]}` | " + " | ".join(cells) + " |")
    return "\n".join(out)


def stages_of(table, seq):
    t = table[seq]
    return "".join(f"{c}:{t['stages'][c]} " for c in sorted(t["stages"]) if "flushed" not in t or c <= t["flushed"]).strip()


def random_program(rng, n):
    out = []
    for i in range(n):
        k = rng.random()
        r = lambda: rng.randint(0, 6)
        if k < 0.45:
            out.append(f"{rng.choice(list(FUNCT))} ${r()}, ${r()}, ${r()}")
        elif k < 0.63:
            out.append(f"lw ${r()}, {4 * rng.randint(0, 5)}($28)")
        elif k < 0.78:
            out.append(f"sw ${r()}, {4 * rng.randint(0, 5)}($28)")
        elif k < 0.93:
            out.append(f"beq ${r()}, ${r()}, {rng.randint(0, min(4, n - 1 - i))}")
        else:
            out.append(f"j {4 * rng.randint(i + 1, n)}")
    return "\n".join(out)


def random_state(rng):
    regs = [0] * 32
    for i in range(1, 7):
        regs[i] = rng.choice([0, 1, 2, 3, 5, 0xFFFFFFFF, 0xFFFFFFFE, 7])
    regs[28] = 64
    mem = {64 + 4 * i: rng.choice([0, 1, 2, 9, 0xFFFFFFFD]) for i in range(6)}
    return regs, mem


SHOW = False

if __name__ == "__main__":
    import sys
    SHOW = "--show" in sys.argv

    def show(title, table, lines):
        if SHOW:
            print("\n##", title)
            print(diagram(table, lines))

    R = lambda **kw: [kw.get(f"r{i}", 0) for i in range(32)]

    # 1. 해저드가 없는 다섯 명령어: 사이클 수 = 4 + 명령어 수 (27 문서)
    src = "lw $t0, 0($gp)\nadd $t1, $s1, $s2\nsub $t2, $s3, $s4\nand $t3, $s5, $s6\nsw $t4, 4($gp)"
    words, lines = assemble(src)
    regs = [0] * 32; regs[28] = 64
    r, m, st, tb, od = pipeline(words, regs, {64: 5})
    assert st["cycles"] == 9 == 4 + 5 and st["stalls"] == 0 and st["flushed"] == 0
    assert stages_of(tb, 0) == "1:IF 2:ID 3:EX 4:MEM 5:WB" and stages_of(tb, 4) == "5:IF 6:ID 7:EX 8:MEM 9:WB"
    # 5번째 사이클에는 다섯 단계가 모두 차 있다
    assert sorted(tb[s]["stages"][5] for s in tb) == ["EX", "ID", "IF", "MEM", "WB"]
    show("27 해저드 없음", tb, lines)
    for n in (1, 10, 100, 1000):
        w, _ = assemble("\n".join(["add $t1, $s1, $s2"] * n))
        assert pipeline(w)[2]["cycles"] == n + 4

    assert 5 + (100 - 1) == 104 and 104 + 10 + 6 == 120      # 어셈블리어 03 문서의 카드 C4

    # 2. 전방 전달 (29 문서): sub 뒤의 네 명령어가 $t0를 쓴다
    src = "sub $t0, $s1, $s2\nand $t1, $t0, $s3\nor $t2, $s4, $t0\nadd $t3, $t0, $t0\nsw $t4, 8($t0)"
    words, lines = assemble(src)
    regs = [0] * 32; regs[17], regs[18], regs[19], regs[20], regs[12] = 30, 10, 12, 3, 99
    ref = single_cycle(words, regs)
    r, m, st, tb, od = pipeline(words, regs)
    assert (r, m) == (ref[0], ref[1]) and st["cycles"] == 9 and st["stalls"] == 0
    assert r[8] == 20 and r[9] == (20 & 12) == 4 and r[10] == (3 | 20) == 23 and r[11] == 40 and m[28] == 99
    # and: ForwardA = 10 (EX/MEM에서), or: ForwardB = 01 (MEM/WB에서), add와 sw는 당겨 쓰지 않는다(레지스터 파일이 해결)
    assert st["log"] == [(4, 4, 0b10, 0), (5, 8, 0, 0b01)]
    show("29 전방 전달 있음", tb, lines)
    r, m, st2, tb2, od = pipeline(words, regs, forwarding=False)
    assert (r, m) == (ref[0], ref[1]) and st2["stalls"] == 2 and st2["cycles"] == 11
    assert stages_of(tb2, 1) == "2:IF 3:ID 4:ID 5:ID 6:EX 7:MEM 8:WB"
    show("29 전방 전달 없음", tb2, lines)
    # 같은 레지스터를 잇달아 고칠 때: 가장 새 값(EX/MEM)을 쓴다
    words, lines = assemble("add $t0, $t0, $s1\nadd $t0, $t0, $s2\nadd $t0, $t0, $s3")
    regs = [0] * 32; regs[8], regs[17], regs[18], regs[19] = 1, 10, 100, 1000
    r, m, st, tb, od = pipeline(words, regs)
    assert r[8] == 1111 and st["log"] == [(4, 4, 0b10, 0), (5, 8, 0b10, 0)]
    assert pipeline(words, regs, bug="mem_first")[0][8] == 1011      # 옛 값 11을 당겨 써서 틀린다
    # '$zero로는 당겨 쓰지 않는다' 조건이 없으면 틀린다
    words, lines = assemble("add $zero, $s1, $s2\nadd $t1, $zero, $zero")
    assert pipeline(words, regs)[0][9] == 0 and single_cycle(words, regs)[0][9] == 0
    assert pipeline(words, regs, bug="no_zero")[0][9] == 220         # 110 + 110
    # 일부러 틀리게 만든 두 가지는 무작위 프로그램에서도 단일 사이클과 어긋난다
    rngb = random.Random(29); bad = {"mem_first": 0, "no_zero": 0}
    for _ in range(1500):
        wb_, _l = assemble(random_program(rngb, rngb.randint(3, 25)))
        rg, mm = random_state(rngb)
        ref_ = single_cycle(wb_, rg, mm)
        for k in bad:
            q = pipeline(wb_, rg, mm, bug=k)
            bad[k] += (q[0], q[1]) != (ref_[0], ref_[1])
    assert bad["mem_first"] > 0 and bad["no_zero"] > 0
    # 카드: add $t0, $s0, $s1 / sub $t1, $t0, $s2 / and $t2, $t0, $t1
    words, lines = assemble("add $t0, $s0, $s1\nsub $t1, $t0, $s2\nand $t2, $t0, $t1")
    regs = [0] * 32; regs[16], regs[17], regs[18] = 6, 3, 4
    r, m, st, tb, od = pipeline(words, regs)
    assert st["log"] == [(4, 4, 0b10, 0), (5, 8, 0b01, 0b10)] and r[9] == 5 and r[10] == (9 & 5) == 1

    # 카드: 세 칸 앞 명령어의 결과는 당겨 쓰지 않는다(레지스터 파일이 해결)
    words, lines = assemble("sub $t0, $s1, $s2\nadd $t5, $s3, $s4\nand $t6, $s3, $s4\nor $t2, $t0, $s4")
    r, m, st, tb, od = pipeline(words, [0] * 17 + [30, 10, 12, 3] + [0] * 11)
    assert st["log"] == [] and r[10] == (20 | 3) == 23

    # 3. 적재-사용 해저드 (30 문서)
    src = "lw $t0, 0($gp)\nadd $t1, $t0, $s1\nsub $t2, $t0, $s2\nor $t3, $t1, $t2"
    words, lines = assemble(src)
    regs = [0] * 32; regs[28], regs[17], regs[18] = 64, 4, 1
    ref = single_cycle(words, regs, {64: 10})
    r, m, st, tb, od = pipeline(words, regs, {64: 10})
    assert (r, m) == (ref[0], ref[1]) and st["stalls"] == 1 and st["cycles"] == 9 == 4 + 4 + 1
    assert stages_of(tb, 1) == "2:IF 3:ID 4:ID 5:EX 6:MEM 7:WB"
    assert stages_of(tb, 2) == "3:IF 4:IF 5:ID 6:EX 7:MEM 8:WB"
    assert st["log"][0] == (5, 4, 0b01, 0)          # 한 사이클 쉰 뒤 MEM/WB에서 당겨 쓴다
    assert r[9] == 14 and r[10] == 9 and r[11] == (14 | 9) == 15
    show("30 적재-사용", tb, lines)
    r, m, st2, tb2, od = pipeline(words, regs, {64: 10}, forwarding=False)
    assert st2["stalls"] == 4 and st2["cycles"] == 12
    # 순서를 바꾸면 쉬는 사이클이 사라진다: d = a - b; e = c - d
    a = "lw $t1, 0($gp)\nlw $t2, 4($gp)\nsub $t3, $t1, $t2\nsw $t3, 12($gp)\nlw $t4, 8($gp)\nsub $t5, $t4, $t3\nsw $t5, 16($gp)"
    b = "lw $t1, 0($gp)\nlw $t2, 4($gp)\nlw $t4, 8($gp)\nsub $t3, $t1, $t2\nsw $t3, 12($gp)\nsub $t5, $t4, $t3\nsw $t5, 16($gp)"
    mem0 = {64: 9, 68: 4, 72: 20}
    ra = pipeline(assemble(a)[0], regs, mem0); rb = pipeline(assemble(b)[0], regs, mem0)
    assert ra[2]["cycles"] == 13 and ra[2]["stalls"] == 2 and rb[2]["cycles"] == 11 and rb[2]["stalls"] == 0
    assert ra[1] == rb[1] and ra[1][76] == 5 and ra[1][80] == 15
    # 교재 조건은 rt 칸만 보므로, 읽지 않는 경우에도 쉰다(해는 없다): lw 뒤에 같은 레지스터에 다시 lw
    w, _ = assemble("lw $t0, 0($gp)\nlw $t0, 4($gp)")
    assert pipeline(w, regs, mem0)[2]["stalls"] == 1 and pipeline(w, regs, mem0)[0][8] == 4 and pipeline(w, regs, mem0)[2]["cycles"] == 7
    # lw 뒤의 sw가 그 값을 저장할 때도 한 사이클 쉰다(이 설계에는 MEM 단계로 당겨 쓰는 길이 없다)
    w, _ = assemble("lw $t0, 0($gp)\nsw $t0, 8($gp)")
    q = pipeline(w, regs, mem0)
    assert q[2]["stalls"] == 1 and q[1][72] == 9

    # 카드: lw, lw, add, sw
    w, _ = assemble("lw $t0, 0($gp)\nlw $t1, 4($gp)\nadd $t2, $t0, $t1\nsw $t2, 8($gp)")
    q = pipeline(w, regs, mem0)
    assert q[2]["stalls"] == 1 and q[2]["cycles"] == 9 and stages_of(q[3], 2) == "3:IF 4:ID 5:ID 6:EX 7:MEM 8:WB" and q[1][72] == 13

    # 4. 제어 해저드 (31 문서)
    src = """
        sub $t0, $s1, $s2
        beq $s3, $s4, far
        and $t1, $s1, $s2
        or  $t2, $s1, $s2
        add $t3, $s1, $s2
   far: slt $t4, $s1, $s2
    """
    words, lines = assemble(src)
    regs = [0] * 32; regs[17], regs[18], regs[19], regs[20] = 9, 5, 7, 7
    ref = single_cycle(words, regs)
    assert ref[2] == [0, 4, 20]
    r, m, st, tb, od = pipeline(words, regs, branch_stage="MEM")
    assert (r, m, od) == (ref[0], ref[1], ref[2]) and st["flushed"] == 3 and st["cycles"] == 4 + 3 + 3 == 10
    show("31 MEM에서 정함(3개 버림)", tb, lines)
    assert stages_of(tb, 5) == "6:IF 7:ID 8:EX 9:MEM 10:WB"
    r, m, st, tb, od = pipeline(words, regs, branch_stage="ID")
    assert (r, m, od) == (ref[0], ref[1], ref[2]) and st["flushed"] == 1 and st["cycles"] == 4 + 3 + 1 == 8
    assert stages_of(tb, 2) == "3:IF" and stages_of(tb, 3) == "4:IF 5:ID 6:EX 7:MEM 8:WB"
    show("31 ID에서 정함(1개 버림)", tb, lines)
    regs[20] = 8          # 안 가면 버리는 것이 없다
    for bs in ("ID", "MEM"):
        r, m, st, tb, od = pipeline(words, regs, branch_stage=bs)
        assert st["flushed"] == 0 and st["cycles"] == 4 + 6 and od == single_cycle(words, regs)[2]
    # ID에서 비교하려면 값이 일찍 필요하다: 바로 앞이 ALU 명령이면 1번, 바로 앞이 lw면 2번, 두 칸 앞이 lw면 1번 쉰다
    regs = [0] * 32; regs[28] = 64
    for srcx, want in [("add $1, $2, $3\nbeq $1, $4, 0", 1), ("lw $1, 0($gp)\nbeq $1, $0, 0", 2),
                       ("lw $1, 0($gp)\nadd $4, $5, $6\nbeq $1, $4, 0", 1),
                       ("add $1, $2, $3\nadd $4, $5, $6\nadd $7, $5, $6\nbeq $1, $4, 0", 0)]:
        w, _ = assemble(srcx)
        assert pipeline(w, regs, {64: 3})[2]["stalls"] == want, srcx
    # j는 ID에서 알아보므로 늘 1개를 버린다
    w, ln = assemble("j far\nadd $1, $2, $3\nfar: add $4, $5, $6")
    q = pipeline(w)
    assert q[2]["flushed"] == 1 and q[2]["cycles"] == 4 + 2 + 1
    # 반복문: 뒤로 가는 beq가 n-1번 가고 1번 안 간다 -> ID에서 정하면 n-1개를 버린다
    loop = """
  loop: add $s0, $s0, $t1
        slt $t2, $s0, $s1
        beq $t2, $t1, loop
        add $s2, $s0, $s0
        sub $s3, $s2, $t1
        or  $s4, $s2, $t1
    """
    words, lines = assemble(loop)
    regs = [0] * 32; regs[9], regs[17] = 1, 10
    ref = single_cycle(words, regs)
    assert ref[0][16] == 10 and ref[0][18] == 20 and len(ref[2]) == 33
    r, m, st, tb, od = pipeline(words, regs)
    assert (r, m, od) == (ref[0], ref[1], ref[2])
    assert st["flushed"] == 9 and st["stalls"] == 10 and st["cycles"] == 4 + 33 + 9 + 10
    r, m, st, tb, od = pipeline(words, regs, branch_stage="MEM")
    assert st["flushed"] == 27 and st["stalls"] == 0 and st["cycles"] == 4 + 33 + 27

    # 5. 무작위 프로그램: 네 가지 파이프라인 설정이 단일 사이클과 늘 같다
    rng = random.Random(27)
    total = eq = 0
    for _ in range(4000):
        words, lines = assemble(random_program(rng, rng.randint(1, 30)))
        regs, mem = random_state(rng)
        ref = single_cycle(words, regs, mem)
        for fwd in (True, False):
            for bs in ("ID", "MEM"):
                r, m, st, tb, od = pipeline(words, regs, mem, forwarding=fwd, branch_stage=bs)
                assert r == ref[0] and m == ref[1] and od == ref[2], (lines, fwd, bs)
                # 사이클 수 = 4 + 끝낸 명령어 수 + 쉰 사이클 + 버린 명령어 수.
                # 쉬거나 버린 칸이 마지막 명령어보다 뒤에 있으면 사이클을 늘리지 않으므로 <= 다
                if od:
                    assert 4 + len(od) <= st["cycles"] <= 4 + len(od) + st["stalls"] + 3 * st["flushed"] + 3
                    eq += st["cycles"] == 4 + len(od) + st["stalls"] + st["flushed"]
                total += 1
    assert total == 16000 and eq > 8000

    # 6. 예외 (32 문서): 넘침이 난 add와 그 뒤 명령어는 버리고, 앞 명령어는 끝낸다
    src = "sub $t0, $s1, $s2\nadd $t1, $s3, $s3\nand $t2, $s1, $s2\nor $t3, $s1, $s2\nslt $t4, $s1, $s2"
    words, lines = assemble(src)
    regs = [0] * 32; regs[17], regs[18], regs[19], regs[9] = 9, 5, 0x7FFFFFFF, 123
    ref = single_cycle(words, regs, exceptions=True)
    assert ref[3] == dict(EPC=4, Cause=12) and ref[2] == [0] and ref[0][9] == 123 and ref[0][8] == 4
    r, m, st, tb, od = pipeline(words, regs, exceptions=True)
    assert r == ref[0] and od == [0] and st["exc"] == dict(EPC=4, Cause=12, cycle=4)
    assert r[9] == 123 and r[10] == 0 and r[11] == 0 and st["flushed"] == 3 and st["cycles"] == 5
    show("32 예외", tb, lines)
    # 카드: 셋째 자리(8번지)에서 넘치면 앞의 둘은 끝내고 셋을 버린다
    words, lines = assemble("sub $t0, $s1, $s2\nand $t2, $s1, $s2\nadd $t1, $s3, $s3\nor $t3, $s1, $s2\nslt $t4, $s1, $s2")
    r, m, st, tb, od = pipeline(words, regs, exceptions=True)
    assert od == [0, 4] and st["exc"] == dict(EPC=8, Cause=12, cycle=5) and st["flushed"] == 3 and r[10] == (9 & 5) == 1 and r[9] == 123
    assert sorted(tb[q]["pc"] for q in tb if "flushed" in tb[q]) == [8, 12, 16]
    # 예외를 끄면 add는 넘친 채로 쓴다(검사하지 않는 addu처럼 동작)
    assert pipeline(words, regs)[0][9] == 0xFFFFFFFE

    # 7. 연습 문서(파이프라인 해저드 예제 사다리)의 값. 분기는 ID에서 정한다
    def lad(title, src, regs, mem):
        words, lines = assemble(src)
        ref = single_cycle(words, regs, mem)
        r, m, st, tb, od = pipeline(words, regs, mem)
        assert (r, m, od) == (ref[0], ref[1], ref[2])
        show(title, tb, lines)
        if SHOW:
            print(st)
        return r, m, st, tb
    regs = [0] * 32; regs[28], regs[16], regs[17], regs[18] = 64, 6, 2, 8
    r, m, st, tb = lad("사다리 1", "lw $t0, 0($gp)\nadd $t1, $t0, $s0\nsub $t2, $t1, $t0\nsw $t2, 4($gp)", regs, {64: 10})
    assert st["stalls"] == 1 and st["flushed"] == 0 and st["cycles"] == 9 and m[68] == 6
    assert st["log"] == [(5, 4, 0b01, 0), (6, 8, 0b10, 0), (7, 12, 0, 0b10)]
    r, m, st, tb = lad("사다리 2", "add $t0, $s2, $gp\nlw $t1, 0($t0)\nand $t2, $t1, $t0\nor $t3, $t2, $t1", regs, {72: 7})
    assert st["stalls"] == 1 and st["cycles"] == 9 and r[8] == 72 and r[9] == 7 and r[10] == (7 & 72) == 0 and r[11] == 7
    assert st["log"] == [(4, 4, 0b10, 0), (6, 8, 0b01, 0), (7, 12, 0b10, 0)]
    r, m, st, tb = lad("사다리 3", "add $t0, $s0, $s1\nbeq $t0, $s2, L\nsub $t1, $s0, $s1\nL: or $t2, $t0, $s0", regs, {})
    assert st["stalls"] == 1 and st["flushed"] == 1 and st["cycles"] == 4 + 3 + 1 + 1 == 9 and r[9] == 0 and r[10] == (8 | 6) == 14
    src4 = "lw $t0, 0($gp)\nlw $t1, 4($gp)\nadd $t2, $t0, $t1\nbeq $t2, $zero, done\nsw $t2, 8($gp)\ndone: sub $t3, $t2, $t0"
    r, m, st, tb = lad("사다리 4", src4, regs, {64: 10, 68: 5})
    assert st["stalls"] == 2 and st["flushed"] == 0 and st["cycles"] == 4 + 6 + 2 == 12 and m[72] == 15 and r[11] == 5
    r, m, st, tb = lad("사다리 4 (간다)", src4, regs, {64: 10, 68: 0xFFFFFFF6})
    assert st["stalls"] == 2 and st["flushed"] == 1 and st["cycles"] == 4 + 5 + 2 + 1 == 12 and 72 not in m and r[11] == 0xFFFFFFF6
    print("ALL CHECKS PASSED")
```
{% endraw %}
