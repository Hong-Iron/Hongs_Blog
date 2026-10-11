---
layout: "note"
title: "39_rotate-instructions_verify.py"
display_title: "39_rotate-instructions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "39"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/rotate-instructions/"
parent_title: "회전 명령"
description: "어셈블리어 · 회전 명령 검증 코드"
permalink: "/studies/assembly-language/code/39_rotate-instructions_verify/"
---
{% raw %}
[회전 명령](/Hongs_Blog/studies/assembly-language/rotate-instructions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""회전 명령(ROL, ROR, RCL, RCR) 검증. 실행: python3 39_rotate-instructions_verify.py
MASM이 없어 시프트·회전 명령을 파이썬 함수로 흉내 낸다(한 칸씩 n번 민다).
슬라이드 wk10-3-1 p.11~12, wk10-3-2 p.2~7의 값과 Your turn 답을 단언하고, 8비트 전수 검사를 한다."""
def mask(bits):
    return (1 << bits) - 1


def signed(x, bits=8):
    """비트열 x를 부호 있는 수(2의 보수)로 읽는다."""
    return x - (1 << bits) if x >> (bits - 1) else x


def shl(x, n, bits=8, cf=0):
    """왼쪽 시프트(SHL = SAL). (결과, CF)를 돌려준다. 한 칸씩 n번 민다."""
    for _ in range(n):
        cf = (x >> (bits - 1)) & 1          # 밀려 나가는 맨 위 비트가 CF로 간다
        x = (x << 1) & mask(bits)           # 맨 아래 빈칸은 0
    return x, cf


sal = shl      # SAL은 SHL의 다른 이름이다


def shr(x, n, bits=8, cf=0):
    """논리 오른쪽 시프트. 맨 위 빈칸을 0으로 채운다."""
    for _ in range(n):
        cf = x & 1
        x >>= 1
    return x, cf


def sar(x, n, bits=8, cf=0):
    """산술 오른쪽 시프트. 맨 위 빈칸을 원래 부호 비트로 채운다."""
    for _ in range(n):
        cf = x & 1
        x = (x >> 1) | (x & (1 << (bits - 1)))
    return x, cf


def rol(x, n, bits=8, cf=0):
    """왼쪽 회전. 맨 위 비트가 CF와 맨 아래 비트 두 곳으로 간다."""
    for _ in range(n):
        cf = (x >> (bits - 1)) & 1
        x = ((x << 1) & mask(bits)) | cf
    return x, cf


def ror(x, n, bits=8, cf=0):
    """오른쪽 회전. 맨 아래 비트가 CF와 맨 위 비트 두 곳으로 간다."""
    for _ in range(n):
        cf = x & 1
        x = (x >> 1) | (cf << (bits - 1))
    return x, cf


def rcl(x, n, bits=8, cf=0):
    """CF를 낀 왼쪽 회전. CF가 맨 아래로 들어오고 맨 위 비트가 CF로 나간다."""
    for _ in range(n):
        out = (x >> (bits - 1)) & 1
        x = ((x << 1) & mask(bits)) | cf
        cf = out
    return x, cf


def rcr(x, n, bits=8, cf=0):
    """CF를 낀 오른쪽 회전. CF가 맨 위로 들어오고 맨 아래 비트가 CF로 나간다."""
    for _ in range(n):
        out = x & 1
        x = (x >> 1) | (cf << (bits - 1))
        cf = out
    return x, cf


def shld(dest, src, n, bits=16):
    """dest를 왼쪽으로 n칸 밀고, 빈 아래 칸을 src의 위쪽 n비트로 채운다. src는 그대로."""
    cf = 0
    for i in range(n):
        cf = (dest >> (bits - 1)) & 1
        incoming = (src >> (bits - 1 - i)) & 1
        dest = ((dest << 1) & mask(bits)) | incoming
    return dest, cf


def shrd(dest, src, n, bits=16):
    """dest를 오른쪽으로 n칸 밀고, 빈 위 칸을 src의 아래쪽 n비트로 채운다. src는 그대로."""
    cf = 0
    for i in range(n):
        cf = dest & 1
        incoming = (src >> i) & 1
        dest = (dest >> 1) | (incoming << (bits - 1))
    return dest, cf


if __name__ == "__main__":
    # --- 슬라이드 wk10-3-1 p.11 / wk10-3-2 p.2: ROL ---
    assert rol(0b11110000, 1) == (0b11100001, 1)
    assert rol(0x3F, 4)[0] == 0xF3
    # --- wk10-3-1 p.12 / wk10-3-2 p.3: ROR ---
    assert ror(0b11110000, 1) == (0b01111000, 0)
    assert ror(0x3F, 4)[0] == 0xF3
    # --- wk10-3-2 p.4 Your turn ---
    al, cf = ror(0x6B, 1); assert (al, cf) == (0xB5, 1)     # a
    al, cf = rol(al, 3);   assert (al, cf) == (0xAD, 1)     # b
    # --- p.5: RCL ---
    bl, cf = 0x88, 0                                        # clc
    bl, cf = rcl(bl, 1, cf=cf); assert (cf, bl) == (1, 0b00010000)
    bl, cf = rcl(bl, 1, cf=cf); assert (cf, bl) == (0, 0b00100001)
    # --- p.6: RCR ---
    ah, cf = rcr(0x10, 1, cf=1); assert (cf, ah) == (0, 0b10001000)
    # --- p.7 Your turn ---
    al, cf = rcr(0x6B, 1, cf=1); assert (al, cf) == (0xB5, 1)   # a
    al, cf = rcl(al, 3, cf=cf);  assert (al, cf) == (0xAE, 1)   # b
    # stc 대신 clc였다면 rcr의 결과는 35h
    assert rcr(0x6B, 1, cf=0) == (0x35, 1)
    # 중간 단계 (문서의 추적 표)
    assert rcl(0xB5, 1, cf=1) == (0x6B, 1)
    assert rcl(0x6B, 1, cf=1) == (0xD7, 0)
    assert rcl(0xD7, 1, cf=0) == (0xAE, 1)
    # --- 8비트 전수 검사 ---
    for x in range(256):
        assert rol(x, 8)[0] == x and ror(x, 8)[0] == x          # 8칸 돌면 제자리
        for n in range(0, 9):
            assert ror(rol(x, n)[0], n)[0] == x                 # 되돌릴 수 있다
            assert bin(rol(x, n)[0]).count("1") == bin(x).count("1")   # 잃는 비트가 없다
            assert rol(x, n)[0] == ror(x, (8 - n) % 8)[0]       # 왼쪽 n칸 = 오른쪽 8-n칸
        assert rol(x, 4)[0] == ((x << 4) | (x >> 4)) & 0xFF     # 4칸 = 위아래 니블 바꾸기
        for c in (0, 1):
            y, c2 = rcl(x, 9, cf=c); assert (y, c2) == (x, c)   # CF까지 9칸이 한 바퀴
            y, c2 = rcr(x, 9, cf=c); assert (y, c2) == (x, c)
            y, c2 = rcl(x, 1, cf=c)
            assert rcr(y, 1, cf=c2) == (x, c)
            # RCL 1칸: 9비트 수 (CF,x)를 왼쪽으로 한 칸 돌린 것
            nine = (c << 8) | x
            nine = ((nine << 1) | (nine >> 8)) & 0x1FF
            assert (y, c2) == (nine & 0xFF, nine >> 8)
    # ROL 뒤의 CF는 새 맨 아래 비트, ROR 뒤의 CF는 새 맨 위 비트
    for x in range(256):
        y, c = rol(x, 1); assert c == y & 1
        y, c = ror(x, 1); assert c == y >> 7
    # 카드
    assert rol(0x81, 1) == (0x03, 1)
    assert ror(0x81, 1) == (0xC0, 1)
    assert rcl(0x81, 1, cf=0) == (0x02, 1)
    assert rcr(0x81, 1, cf=0) == (0x40, 1)
    assert rol(0x26, 4)[0] == 0x62
    # 두 바이트를 이어 한 칸 오른쪽으로: SHR 위 바이트, RCR 아래 바이트
    hi, lo = 0x81, 0x03                      # 8103h
    hi, c = shr(hi, 1); lo, c = rcr(lo, 1, cf=c)
    assert (hi << 8 | lo) == 0x8103 >> 1 == 0x4081
    for v in range(0, 65536, 7):
        hi, lo = v >> 8, v & 0xFF
        hi, c = shr(hi, 1); lo, c2 = rcr(lo, 1, cf=c)
        assert (hi << 8 | lo) == v >> 1 and c2 == v & 1
    print("ALL CHECKS PASSED")
```
{% endraw %}
