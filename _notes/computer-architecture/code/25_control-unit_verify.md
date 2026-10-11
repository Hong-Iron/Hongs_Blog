---
layout: "note"
title: "25_control-unit_verify.py"
display_title: "25_control-unit_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/control-unit/"
parent_title: "제어 장치와 제어 신호"
description: "컴퓨터 구조 · 제어 장치와 제어 신호 검증 코드"
permalink: "/studies/computer-architecture/code/25_control-unit_verify/"
---
{% raw %}
[제어 장치와 제어 신호](/Hongs_Blog/studies/computer-architecture/control-unit/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 주 제어와 ALU 제어를 게이트 식으로 만들고 표와 같은지 전수 검사한다 (실제 하드웨어가 아니라 파이썬 흉내다)
# 실행: python3 25_control-unit_verify.py
from itertools import product

X = None
SIGNALS = ["RegDst", "ALUSrc", "MemtoReg", "RegWrite", "MemRead", "MemWrite", "Branch", "ALUOp1", "ALUOp0"]
# 공개 강의 자료에서 확인한 표 (X = 아무 값이나 괜찮다)
TABLE = {
    "R형": [1, 0, 0, 1, 0, 0, 0, 1, 0],
    "lw":  [0, 1, 1, 1, 1, 0, 0, 0, 0],
    "sw":  [X, 1, X, 0, 0, 1, 0, 0, 0],
    "beq": [X, 0, X, 0, 0, 0, 1, 0, 1],
}
OPCODE = {"R형": 0b000000, "lw": 0b100011, "sw": 0b101011, "beq": 0b000100, "j": 0b000010}
FUNCT = {"add": 0b100000, "sub": 0b100010, "and": 0b100100, "or": 0b100101, "slt": 0b101010}
ALU_CODE = {"and": 0b0000, "or": 0b0001, "add": 0b0010, "sub": 0b0110, "slt": 0b0111}


def bits(x, n):
    return [(x >> i) & 1 for i in range(n)]       # [0번 비트, 1번 비트, ...]


def main_control_gates(opcode):
    """AND 게이트 넷이 명령어 종류를 알아보고, OR 게이트가 신호를 만든다."""
    o = bits(opcode, 6)
    n = [1 - b for b in o]
    rformat = n[5] & n[4] & n[3] & n[2] & n[1] & n[0]
    lw = o[5] & n[4] & n[3] & n[2] & o[1] & o[0]
    sw = o[5] & n[4] & o[3] & n[2] & o[1] & o[0]
    beq = n[5] & n[4] & n[3] & o[2] & n[1] & n[0]
    return dict(RegDst=rformat, ALUSrc=lw | sw, MemtoReg=lw, RegWrite=rformat | lw, MemRead=lw,
                MemWrite=sw, Branch=beq, ALUOp1=rformat, ALUOp0=beq)


def alu_control_table(aluop, funct):
    if aluop == 0b00:
        return ALU_CODE["add"]
    if aluop == 0b01:
        return ALU_CODE["sub"]
    return {FUNCT[k]: ALU_CODE[k] for k in FUNCT}[funct]


def alu_control_gates(aluop1, aluop0, funct):
    f = bits(funct, 6)
    op3 = 0
    op2 = aluop0 | (aluop1 & f[1])
    op1 = (1 - aluop1) | (1 - f[2])
    op0 = aluop1 & (f[3] | f[0])
    return (op3 << 3) | (op2 << 2) | (op1 << 1) | op0


if __name__ == "__main__":
    # 1. opcode 값: R형 0, lw 35, sw 43, beq 4, j 2
    assert [OPCODE[k] for k in ("R형", "lw", "sw", "beq", "j")] == [0, 35, 43, 4, 2]
    assert [hex(OPCODE[k]) for k in ("lw", "sw")] == ["0x23", "0x2b"]
    # 2. 게이트 식이 표와 같다 (X 칸은 견주지 않는다)
    for name, row in TABLE.items():
        g = main_control_gates(OPCODE[name])
        for sig, want in zip(SIGNALS, row):
            assert want is X or g[sig] == want, (name, sig)
    # 네 AND 게이트는 64가지 opcode 가운데 자기 것 하나에만 1을 낸다
    for op in range(64):
        g = main_control_gates(op)
        hit = [k for k in ("R형", "lw", "sw", "beq") if OPCODE[k] == op]
        if not hit:
            assert g["RegWrite"] == 0 and g["MemWrite"] == 0 and g["Branch"] == 0   # 모르는 명령어는 아무것도 고치지 않는다
    # X 칸에 게이트 식이 실제로 내는 값: sw와 beq에서 RegDst = 0, MemtoReg = 0
    assert main_control_gates(OPCODE["sw"])["RegDst"] == 0 and main_control_gates(OPCODE["beq"])["MemtoReg"] == 0
    # 3. ALU 제어 표
    assert alu_control_table(0b00, 0) == 0b0010 and alu_control_table(0b01, 0) == 0b0110
    assert [alu_control_table(0b10, FUNCT[k]) for k in ("add", "sub", "and", "or", "slt")] == [0b0010, 0b0110, 0b0000, 0b0001, 0b0111]
    # 4. ALU 제어의 게이트 식이 표와 같다: ALUOp 00·01에서는 funct 64가지 모두, ALUOp 10에서는 다섯 funct
    for funct in range(64):
        assert alu_control_gates(0, 0, funct) == 0b0010
        assert alu_control_gates(0, 1, funct) == 0b0110
    for k in FUNCT:
        assert alu_control_gates(1, 0, FUNCT[k]) == ALU_CODE[k], k
    # 5. PCSrc = Branch AND Zero: 넷 가운데 하나만 1
    assert [(b, z, b & z) for b, z in product((0, 1), repeat=2)] == [(0, 0, 0), (0, 1, 0), (1, 0, 0), (1, 1, 1)]
    # 6. 카드: 신호 9비트를 표의 순서로 이어 쓴 값
    row = lambda name: "".join("X" if v is X else str(v) for v in TABLE[name])
    assert row("R형") == "100100010" and row("lw") == "011110000" and row("sw") == "X1X001000" and row("beq") == "X0X000101"
    # X가 아닌 칸만 세면: 레지스터나 메모리를 고치는 신호(RegWrite, MemWrite)는 X가 될 수 없다
    for name in TABLE:
        assert TABLE[name][3] is not X and TABLE[name][5] is not X
    print("ALL CHECKS PASSED")
```
{% endraw %}
