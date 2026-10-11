---
layout: "note"
title: "04_x86-registers_verify.py"
display_title: "04_x86-registers_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/x86-registers/"
parent_title: "x86 레지스터"
description: "어셈블리어 · x86 레지스터 검증 코드"
permalink: "/studies/assembly-language/code/04_x86-registers_verify/"
---
{% raw %}
[x86 레지스터](/Hongs_Blog/studies/assembly-language/x86-registers/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""x86 레지스터 검증 (MASM이 없어 파이썬 흉내로 확인).

문서: 04.x86 레지스터
출처: 어셈블리어 3주차 3-2 p.8~13, 4주차 4-1 p.16 (디버거 출력)
주장:
  1. EAX(32비트)의 아래 16비트가 AX, AX의 위 8비트가 AH, 아래 8비트가 AL이다.
     AL에 써도 나머지 24비트는 그대로이고, AX에 써도 위 16비트는 그대로다. 8비트 전수 검사.
  2. 예: EAX = 12345678h → AX = 5678h, AH = 56h, AL = 78h.
     AL ← FFh → EAX = 123456FFh. AH ← 00h → 123400FFh. AX ← ABCDh → 1234ABCDh.
  3. 8비트 이름이 있는 것은 EAX·EBX·ECX·EDX 넷뿐, ESI·EDI·EBP·ESP는 16비트 이름만 있다.
  4. 4-1 p.16의 EFL = 00000206h 를 비트로 풀면 CF = 0, ZF = 0, SF = 0, OF = 0 이고
     짝수 플래그(PF)와 인터럽트 허용(IF) 비트가 1이다. 표시된 CF/SF/ZF/OF 값과 맞는다.
  5. 짝수 플래그: 결과 아래 8비트에서 1의 개수가 짝수면 1. 00h → 1, 0Bh → 0.
"""


class Reg32:
    def __init__(self, v=0):
        self.e = v & 0xFFFFFFFF

    @property
    def x(self):                 # 16비트 이름 (AX)
        return self.e & 0xFFFF

    @x.setter
    def x(self, v):
        self.e = (self.e & 0xFFFF0000) | (v & 0xFFFF)

    @property
    def h(self):                 # 위 8비트 (AH)
        return (self.e >> 8) & 0xFF

    @h.setter
    def h(self, v):
        self.e = (self.e & 0xFFFF00FF) | ((v & 0xFF) << 8)

    @property
    def l(self):                 # 아래 8비트 (AL)
        return self.e & 0xFF

    @l.setter
    def l(self, v):
        self.e = (self.e & 0xFFFFFF00) | (v & 0xFF)


FLAG_BIT = {"CF": 0, "PF": 2, "AF": 4, "ZF": 6, "SF": 7, "IF": 9, "DF": 10, "OF": 11}


def flags_of(efl):
    return {name: (efl >> bit) & 1 for name, bit in FLAG_BIT.items()}


def parity_flag(result):
    return 1 if bin(result & 0xFF).count("1") % 2 == 0 else 0


def main():
    a = Reg32(0x12345678)
    assert (a.x, a.h, a.l) == (0x5678, 0x56, 0x78)
    a.l = 0xFF
    assert a.e == 0x123456FF
    a.h = 0x00
    assert a.e == 0x123400FF
    a.x = 0xABCD
    assert a.e == 0x1234ABCD
    print("[OK] EAX = 12345678h → AX 5678h, AH 56h, AL 78h, 부분 쓰기 세 가지")

    for v in range(256):
        r = Reg32(0xDEADBEEF)
        r.l = v
        assert r.e >> 8 == 0xDEADBE and r.l == v
        r = Reg32(0xDEADBEEF)
        r.h = v
        assert r.e & 0xFFFF00FF == 0xDEAD00EF and r.h == v
        r = Reg32(0xDEADBEEF)
        r.x = v * 257
        assert r.e >> 16 == 0xDEAD and r.x == v * 257
        assert r.x == r.h * 256 + r.l
    print("[OK] 8비트 값 256개 전부: 한 조각에 써도 다른 조각은 그대로, AX = AH*256 + AL")

    table = {"EAX": ("AX", "AH", "AL"), "EBX": ("BX", "BH", "BL"),
             "ECX": ("CX", "CH", "CL"), "EDX": ("DX", "DH", "DL")}
    only16 = {"ESI": "SI", "EDI": "DI", "EBP": "BP", "ESP": "SP"}
    assert len(table) == 4 and len(only16) == 4
    assert len(table) + len(only16) == 8          # 범용 레지스터 여덟 개
    assert len(["CS", "SS", "DS", "ES", "FS", "GS"]) == 6
    print("[OK] 범용 8개(8비트 이름 있는 것 4개), 세그먼트 6개")

    f = flags_of(0x00000206)
    assert (f["CF"], f["SF"], f["ZF"], f["OF"]) == (0, 0, 0, 0)
    assert f["PF"] == 1 and f["IF"] == 1 and f["AF"] == 0
    assert 0x206 == (1 << 9) | (1 << 2) | (1 << 1)
    print("[OK] EFL = 206h: CF = SF = ZF = OF = 0, PF = 1, IF = 1")

    assert parity_flag(0x00030000) == 1 and parity_flag(0x0000000B) == 0
    assert parity_flag(0b10110010) == 1 and parity_flag(0b10110011) == 0
    print("[OK] 짝수 플래그: 00h → 1, 0Bh(1이 세 개) → 0")

    # 카드: EBX = 0000A1B2h 에서 BL ← 00h, BH ← FFh
    b = Reg32(0x0000A1B2)
    b.l = 0x00
    assert b.e == 0x0000A100
    b.h = 0xFF
    assert b.e == 0x0000FF00 and b.x == 0xFF00
    # 카드: ECX = FFFFFFFFh 에서 CX ← 0
    c = Reg32(0xFFFFFFFF)
    c.x = 0
    assert c.e == 0xFFFF0000
    print("[OK] 카드: EBX A1B2h → A100h → FF00h, ECX FFFFFFFFh → FFFF0000h")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
