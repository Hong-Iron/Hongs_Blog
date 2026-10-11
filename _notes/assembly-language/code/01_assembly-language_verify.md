---
layout: "note"
title: "01_assembly-language_verify.py"
display_title: "01_assembly-language_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
parent_url: "/studies/assembly-language/assembly-language/"
parent_title: "어셈블리어와 기계어"
description: "어셈블리어 · 어셈블리어와 기계어 검증 코드"
permalink: "/studies/assembly-language/code/01_assembly-language_verify/"
---
{% raw %}
[어셈블리어와 기계어](/Hongs_Blog/studies/assembly-language/assembly-language/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""어셈블리어와 기계어 검증 (MASM이 없어 파이썬 흉내로 확인).

문서: 01.어셈블리어와 기계어
출처: 어셈블리어 1주차 슬라이드 p.10 (Translating Languages)
주장:
  1. 어셈블리 네 줄(mov eax,A / mul B / add eax,C / call WriteInt)과 기계어 네 줄이 한 줄에 하나씩 짝지어진다.
  2. 슬라이드의 기계어 첫 바이트는 인텔 명령 부호와 맞는다.
     A1 = mov eax,메모리 / F7 /4 = mul / 03 /r = add 레지스터,메모리 / E8 = call.
     F7 25 의 25h = 00 100 101b (가운데 100b = 4 → MUL),
     03 05 의 05h = 00 000 101b (가운데 000b = EAX).
  3. 변수 주소 00000000, 00000004, 00000008은 4씩 떨어져 있다 (32비트 변수 셋).
  4. 네 줄을 흉내 내면 EAX = A * B + C 다.
  5. 카드: 16진수 한 글자는 4비트, 기계어 03 05 00000008 은 6바이트.
"""
import random

ASM = ["mov eax,A", "mul B", "add eax,C", "call WriteInt"]
MACHINE = ["A1 00000000", "F7 25 00000004", "03 05 00000008", "E8 00500000"]

OPCODES = {0xA1: "mov eax,mem", 0xF7: "group3", 0x03: "add r32,r/m32", 0xE8: "call rel32"}
GROUP3 = {4: "mul", 5: "imul", 6: "div", 7: "idiv", 2: "not", 3: "neg", 0: "test"}
REG32 = ["eax", "ecx", "edx", "ebx", "esp", "ebp", "esi", "edi"]


def modrm(b):
    return b >> 6, (b >> 3) & 7, b & 7


def decode(line):
    parts = line.split()
    op = int(parts[0], 16)
    kind = OPCODES[op]
    if kind == "group3":
        mod, reg, rm = modrm(int(parts[1], 16))
        assert (mod, rm) == (0, 5)          # 주소 32비트가 바로 뒤따르는 꼴
        return GROUP3[reg], int(parts[2], 16)
    if kind == "add r32,r/m32":
        mod, reg, rm = modrm(int(parts[1], 16))
        assert (mod, rm) == (0, 5)
        return "add " + REG32[reg], int(parts[2], 16)
    if kind == "mov eax,mem":
        return "mov eax", int(parts[1], 16)
    return "call", int(parts[1], 16)


def run(a, b, c):
    """네 줄을 흉내 낸다. 32비트 부호 없는 곱의 아래 32비트가 EAX에 남는다."""
    mem = {0: a, 4: b, 8: c}
    eax = edx = 0
    out = None
    for line in MACHINE:
        what, arg = decode(line)
        if what == "mov eax":
            eax = mem[arg]
        elif what == "mul":
            prod = eax * mem[arg]
            eax, edx = prod & 0xFFFFFFFF, prod >> 32
        elif what == "add eax":
            eax = (eax + mem[arg]) & 0xFFFFFFFF
        elif what == "call":
            out = eax
    return out


def main():
    assert len(ASM) == len(MACHINE) == 4
    names = [decode(m)[0] for m in MACHINE]
    assert names == ["mov eax", "mul", "add eax", "call"]
    for a, n in zip(ASM, names):
        assert a.split()[0] == n.split()[0]
    print("[OK] p.10: 어셈블리 네 줄 = 기계어 네 줄, 줄마다 같은 명령")

    assert modrm(0x25) == (0, 4, 5) and modrm(0x05) == (0, 0, 5)
    print("[OK] 25h = 00 100 101b (MUL), 05h = 00 000 101b (EAX)")

    addrs = [decode(m)[1] for m in MACHINE[:3]]
    assert addrs == [0, 4, 8]
    print("[OK] A, B, C의 주소 0, 4, 8: 4바이트씩 떨어짐")

    assert run(3, 4, 5) == 17
    rnd = random.Random(1)
    for _ in range(1000):
        a, b, c = (rnd.randrange(0, 60000) for _ in range(3))
        assert run(a, b, c) == (a * b + c) & 0xFFFFFFFF
    print("[OK] 흉내 실행: A*B+C (3*4+5 = 17, 무작위 1,000회)")

    nbytes = sum(len(tok) // 2 for tok in "03 05 00000008".split())
    assert nbytes == 6 and len("00000008") * 4 == 32
    print("[OK] 카드: 03 05 00000008 은 6바이트, 16진 여덟 글자 = 32비트")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
