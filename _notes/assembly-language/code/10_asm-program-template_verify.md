---
layout: "note"
title: "10_asm-program-template_verify.py"
display_title: "10_asm-program-template_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/asm-program-template/"
parent_title: "프로그램 틀"
description: "어셈블리어 · 프로그램 틀 검증 코드"
permalink: "/studies/assembly-language/code/10_asm-program-template_verify/"
---
{% raw %}
[프로그램 틀](/Hongs_Blog/studies/assembly-language/asm-program-template/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""프로그램 틀 검증 (MASM이 없어 파이썬 흉내로 확인).

문서: 10.프로그램 틀
출처: 어셈블리어 4주차 4-1 p.15~16, 19 / 4-3 p.5
주장:
  1. AddTwo (p.15): mov eax,5 / add eax,6 → EAX = 0000000Bh (11).
  2. AddSub2 (4-3 p.5): 10000h + 40000h - 20000h → EAX = 00030000h, finalVal = 30000h.
  3. 4-1 p.16의 디버거 출력 EAX=00030000 은 AddTwo가 아니라 AddSub 쪽 결과다.
     EFL=00000206의 짝수 플래그(PF) = 1 도 30000h(아래 8비트 00h)와 맞고 0Bh(1이 세 개)와는 안 맞는다.
  4. 두 프로그램 모두 CF = SF = ZF = OF = 0 으로 끝난다.
  5. 틀의 줄 순서: .386 → .model → .stack → PROTO → .data → .code → main PROC … main ENDP → END main.
  6. 카드: mov eax,7 / add eax,9 → 10h. val1 = 5000h, val2 = 3000h, val3 = 1000h → 7000h.
"""

MASK = 0xFFFFFFFF


class CPU:
    def __init__(self):
        self.reg = {"eax": 0}
        self.mem = {}
        self.flags = {"CF": 0, "ZF": 0, "SF": 0, "OF": 0, "PF": 0}

    def val(self, src):
        if isinstance(src, int):
            return src
        return self.reg[src] if src in self.reg else self.mem[src]

    def put(self, dst, v):
        if dst in self.reg:
            self.reg[dst] = v & MASK
        else:
            self.mem[dst] = v & MASK

    def setflags(self, a, b, r, sub):
        res = r & MASK
        self.flags["ZF"] = int(res == 0)
        self.flags["SF"] = res >> 31
        self.flags["PF"] = int(bin(res & 0xFF).count("1") % 2 == 0)
        if sub:
            self.flags["CF"] = int(a < b)
            self.flags["OF"] = int(((a ^ b) & (a ^ res)) >> 31)
        else:
            self.flags["CF"] = int(r > MASK)
            self.flags["OF"] = int((~(a ^ b) & (a ^ res) & MASK) >> 31)

    def mov(self, dst, src):
        self.put(dst, self.val(src))

    def add(self, dst, src):
        a, b = self.val(dst), self.val(src)
        self.setflags(a, b, a + b, False)
        self.put(dst, a + b)

    def sub(self, dst, src):
        a, b = self.val(dst), self.val(src)
        self.setflags(a, b, a - b, True)
        self.put(dst, a - b)


def add_two(x=5, y=6):
    c = CPU()
    c.mov("eax", x)
    c.add("eax", y)
    return c


def add_sub2(v1=0x10000, v2=0x40000, v3=0x20000):
    c = CPU()
    c.mem.update(val1=v1, val2=v2, val3=v3, finalVal=0)
    c.mov("eax", "val1")
    c.add("eax", "val2")
    c.sub("eax", "val3")
    c.mov("finalVal", "eax")
    return c


TEMPLATE = [".386", ".model flat,stdcall", ".stack 4096", "ExitProcess PROTO, dwExitCode:DWORD",
            ".data", ".code", "main PROC", "INVOKE ExitProcess,0", "main ENDP", "END main"]


def main():
    c = add_two()
    assert c.reg["eax"] == 0x0000000B == 11
    f1 = dict(c.flags)
    print("[OK] AddTwo: EAX = 0000000Bh")

    c2 = add_sub2()
    assert c2.reg["eax"] == 0x00030000 and c2.mem["finalVal"] == 0x30000
    f2 = dict(c2.flags)
    print("[OK] AddSub2: EAX = 00030000h, finalVal = 30000h")

    assert c.reg["eax"] != 0x00030000
    assert f2["PF"] == 1 and f1["PF"] == 0
    assert (0x206 >> 2) & 1 == 1
    print("[OK] p.16의 EAX=00030000, EFL=206h(PF = 1)은 AddSub 결과와 맞고 AddTwo(0Bh, PF = 0)와는 안 맞는다")

    for f in (f1, f2):
        assert (f["CF"], f["SF"], f["ZF"], f["OF"]) == (0, 0, 0, 0)
    print("[OK] 두 프로그램 모두 CF = SF = ZF = OF = 0")

    order = [TEMPLATE.index(x) for x in (".data", ".code", "main PROC", "main ENDP", "END main")]
    assert order == sorted(order) and TEMPLATE[-1] == "END main"
    assert TEMPLATE.index(".stack 4096") < TEMPLATE.index(".data")
    assert 4096 == 0x1000
    print("[OK] 틀의 줄 순서, 스택 4096바이트 = 1000h")

    assert add_two(7, 9).reg["eax"] == 0x10
    t = CPU()
    t.mem.update(val1=0x10000, val2=0x40000, val3=0x20000, finalVal=0)
    t.mov("eax", "val1"); assert t.reg["eax"] == 0x00010000
    t.add("eax", "val2"); assert t.reg["eax"] == 0x00050000
    t.sub("eax", "val3"); assert t.reg["eax"] == 0x00030000
    u = CPU()
    u.mem.update(val1=0x5000, val2=0x3000, val3=0x1000, finalVal=0)
    u.mov("eax", "val1"); assert u.reg["eax"] == 0x5000
    u.add("eax", "val2"); assert u.reg["eax"] == 0x8000
    u.sub("eax", "val3"); assert u.reg["eax"] == 0x7000
    u.mov("finalVal", "eax"); assert (u.reg["eax"], u.mem["finalVal"]) == (0x7000, 0x7000)
    assert add_sub2(0x5000, 0x3000, 0x1000).reg["eax"] == 0x7000
    print("[OK] 추적 표 10000h → 50000h → 30000h, 카드: 7 + 9 = 10h, 5000h → 8000h → 7000h")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
