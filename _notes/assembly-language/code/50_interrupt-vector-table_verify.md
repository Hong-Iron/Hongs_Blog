---
layout: "note"
title: "50_interrupt-vector-table_verify.py"
display_title: "50_interrupt-vector-table_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "50"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/interrupt-vector-table/"
parent_title: "INT 명령과 인터럽트 벡터 표"
description: "어셈블리어 · INT 명령과 인터럽트 벡터 표 검증 코드"
permalink: "/studies/assembly-language/code/50_interrupt-vector-table_verify/"
---
{% raw %}
[INT 명령과 인터럽트 벡터 표](/Hongs_Blog/studies/assembly-language/interrupt-vector-table/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 50.INT 명령과 인터럽트 벡터 표 문서의 계산 확인. 실행: python3 50_interrupt-vector-table_verify.py
# 16비트 실주소 모드를 실제로 돌리지 않는다. 1MB 바이트 배열 위에서 INT/IRET의 동작을 흉내 낸다.
# INT가 스택에 플래그·CS·IP를 넣는 순서는 슬라이드에 없고 Intel 설명서의 실주소 모드 동작을 따랐다.

def linear(seg, off):
    return ((seg << 4) + off) & 0xFFFFF


class Machine:
    def __init__(self):
        self.mem = bytearray(1 << 20)
        self.cs, self.ip, self.flags = 0, 0, 0x0202  # IF=1
        self.ss, self.sp = 0x9000, 0x0100

    def w16(self, addr, v):
        self.mem[addr] = v & 0xFF
        self.mem[addr + 1] = (v >> 8) & 0xFF

    def r16(self, addr):
        return self.mem[addr] | (self.mem[addr + 1] << 8)

    def push(self, v):
        self.sp = (self.sp - 2) & 0xFFFF
        self.w16(linear(self.ss, self.sp), v)

    def pop(self):
        v = self.r16(linear(self.ss, self.sp))
        self.sp = (self.sp + 2) & 0xFFFF
        return v

    def set_vector(self, n, seg, off):
        self.w16(n * 4, off)        # 낮은 주소에 오프셋
        self.w16(n * 4 + 2, seg)    # 높은 주소에 세그먼트

    def get_vector(self, n):
        return self.r16(n * 4 + 2), self.r16(n * 4)

    def int_(self, n):
        self.push(self.flags)
        self.push(self.cs)
        self.push(self.ip)          # INT 다음 명령의 주소
        self.flags &= ~0x0200       # IF = 0
        self.cs, self.ip = self.get_vector(n)

    def iret(self):
        self.ip = self.pop()
        self.cs = self.pop()
        self.flags = self.pop()


if __name__ == "__main__":
    # 오프셋 = 인터럽트 번호 × 4 (wk14-17 p.5)
    assert 0x10 * 4 == 0x0040 and 0x21 * 4 == 0x0084 and 0x16 * 4 == 0x0058
    assert 0x09 * 4 == 0x0024 and 0x00 * 4 == 0 and 0xFF * 4 == 0x03FC
    assert 0xFF * 4 + 4 == 0x0400  # 표의 끝 = BIOS 데이터 영역의 시작
    assert 256 * 4 == 1024
    # 슬라이드 표의 줄: 번호 00-03 / 04-07 / 08-0B / 0C-0F / 10-13 의 오프셋
    for first, off in [(0x00, 0x0000), (0x04, 0x0010), (0x08, 0x0020), (0x0C, 0x0030), (0x10, 0x0040)]:
        assert first * 4 == off
    # 슬라이드 표의 값으로 표를 채운다
    rows = {
        0x00: ["02C1:5186", "0070:0C67", "0DAD:2C1B", "0070:0C67"],
        0x04: ["0070:0C67", "F000:FF54", "F000:837B", "F000:837B"],
        0x08: ["0D70:022C", "0DAD:2BAD", "0070:0325", "0070:039F"],
        0x0C: ["0070:0419", "0070:0493", "0070:050D", "0070:0C67"],
        0x10: ["C000:0CD7", "F000:F84D", "F000:F841", "0070:237D"],
    }
    m = Machine()
    for first, vecs in rows.items():
        for i, v in enumerate(vecs):
            seg, off = (int(x, 16) for x in v.split(":"))
            m.set_vector(first + i, seg, off)
    assert m.get_vector(0x09) == (0x0DAD, 0x2BAD)   # wk14-17 p.22 그림의 BIOS INT 9 주소와 같다
    assert m.get_vector(0x10) == (0xC000, 0x0CD7)
    # 메모리에는 리틀 엔디언으로: INT 9 칸(0024h~0027h) = AD 2B AD 0D
    assert bytes(m.mem[0x24:0x28]) == bytes([0xAD, 0x2B, 0xAD, 0x0D])
    # INT 10h 칸(0040h~0043h) = D7 0C 00 C0
    assert bytes(m.mem[0x40:0x44]) == bytes([0xD7, 0x0C, 0x00, 0xC0])

    # wk13-2-1 p.11 그림: INT 10h 칸에 F000:F065
    m = Machine()
    m.set_vector(0x10, 0xF000, 0xF065)
    assert linear(0xF000, 0xF065) == 0xFF065
    m.cs, m.ip = 0x1000, 0x0105     # int 10h 다음 명령(add...)의 주소라고 하자
    sp0, flags0 = m.sp, m.flags
    m.int_(0x10)
    assert (m.cs, m.ip) == (0xF000, 0xF065)
    assert m.sp == sp0 - 6          # 플래그, CS, IP 세 워드
    assert m.flags & 0x0200 == 0
    m.iret()
    assert (m.cs, m.ip, m.sp, m.flags) == (0x1000, 0x0105, sp0, flags0)

    # 카드 C2: INT 1Ch의 칸은 0070h, INT 16h는 0058h
    assert 0x1C * 4 == 0x0070
    print("ALL CHECKS PASSED")
```
{% endraw %}
