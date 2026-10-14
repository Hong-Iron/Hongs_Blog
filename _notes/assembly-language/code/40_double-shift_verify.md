---
layout: "note"
title: "40_double-shift_verify.py"
display_title: "40_double-shift_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/double-shift/"
parent_title: "이중 시프트 SHLD·SHRD"
description: "어셈블리어 · 이중 시프트 SHLD·SHRD 검증 코드"
sitemap: false
permalink: "/studies/assembly-language/code/40_double-shift_verify/"
---
{% raw %}
[이중 시프트 SHLD·SHRD](/Hongs_Blog/studies/assembly-language/double-shift/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이중 시프트(SHLD, SHRD) 검증. 실행: python3 40_double-shift_verify.py
MASM이 없어 시프트·회전 명령을 파이썬 함수로 흉내 낸다(한 칸씩 n번 민다).
슬라이드 wk10-3-2 p.9~14의 값과 Your turn 답을 단언하고, 이어 붙인 수의 시프트와 같은지 검사한다."""
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
    # --- 슬라이드 wk10-3-2 p.9: SHLD 그림 (8비트로 그린 그림) ---
    assert shld(0b11100000, 0b10011101, 1, bits=8) == (0b11000001, 1)
    # --- p.10: wval = 9BA6h, AX = AC36h, shld wval,ax,4 ---
    assert shld(0x9BA6, 0xAC36, 4)[0] == 0xBA6A
    # --- p.12: SHRD 그림 (8비트) ---
    assert shrd(0b11000001, 0b00011101, 1, bits=8) == (0b11100000, 1)
    # --- p.13: AX = 234Bh, DX = 7654h, shrd ax,dx,4 ---
    assert shrd(0x234B, 0x7654, 4)[0] == 0x4234
    # --- p.14 Your turn: AX = 7C36h, DX = 9FA6h ---
    dx, cf = shld(0x9FA6, 0x7C36, 4); assert dx == 0xFA67
    dx, cf = shrd(dx, 0x7C36, 8);     assert dx == 0x36FA
    # 둘째 줄을 처음 DX에 바로 하면 다른 값이 나온다 (앞줄 결과에 이어서 해야 한다)
    assert shrd(0x9FA6, 0x7C36, 8)[0] == 0x369F
    # --- 16비트 표본 검사: 두 값을 이어 붙인 32비트 수로 본 식과 같다 ---
    import random
    random.seed(40)
    for _ in range(20000):
        d, s, n = random.randrange(65536), random.randrange(65536), random.randrange(1, 16)
        assert shld(d, s, n)[0] == (((d << 16 | s) << n) >> 16) & 0xFFFF
        assert shrd(d, s, n)[0] == ((s << 16 | d) >> n) & 0xFFFF
        assert shld(d, s, n)[1] == (d >> (16 - n)) & 1       # CF = dest에서 마지막으로 나간 비트
        assert shrd(d, s, n)[1] == (d >> (n - 1)) & 1
        # src 대신 0을 넣으면 보통 시프트와 같다
        assert shld(d, 0, n)[0] == shl(d, n, 16)[0]
        assert shrd(d, 0, n)[0] == shr(d, n, 16)[0]
    # --- 8비트 전수 검사 (count = 1..7) ---
    for d in range(256):
        for s in range(256):
            for n in (1, 3, 7):
                assert shld(d, s, n, 8)[0] == (((d << 8 | s) << n) >> 8) & 0xFF
                assert shrd(d, s, n, 8)[0] == ((s << 8 | d) >> n) & 0xFF
    # --- 쓰임: 64비트 수 EDX:EAX를 왼쪽으로 4칸 (shld edx,eax,4 뒤 shl eax,4) ---
    for _ in range(5000):
        v = random.getrandbits(64)
        edx, eax = v >> 32, v & 0xFFFFFFFF
        edx, _ = shld(edx, eax, 4, 32)
        eax, _ = shl(eax, 4, 32)
        assert (edx << 32 | eax) == (v << 4) & (2 ** 64 - 1)
    # 문서의 예: 12345678h:9ABCDEF0h << 4
    edx, _ = shld(0x12345678, 0x9ABCDEF0, 4, 32); eax, _ = shl(0x9ABCDEF0, 4, 32)
    assert (edx, eax) == (0x23456789, 0xABCDEF00)
    # 순서를 바꿔 EAX를 먼저 밀면 다른(틀린) 값이 된다
    eax2, _ = shl(0x9ABCDEF0, 4, 32); edx2, _ = shld(0x12345678, eax2, 4, 32)
    assert edx2 == 0x2345678A != 0x23456789
    # 카드
    assert shld(0x1234, 0xABCD, 8)[0] == 0x34AB
    assert shrd(0x1234, 0xABCD, 8)[0] == 0xCD12
    assert shld(0x00FF, 0x8000, 1) == (0x01FF, 0)
    print("ALL CHECKS PASSED")
```
{% endraw %}
