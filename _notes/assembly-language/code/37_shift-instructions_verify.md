---
layout: "note"
title: "37_shift-instructions_verify.py"
display_title: "37_shift-instructions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 과학"
parent_url: "/studies/assembly-language/shift-instructions/"
parent_title: "시프트 명령"
description: "어셈블리어 · 시프트 명령 검증 코드"
permalink: "/studies/assembly-language/code/37_shift-instructions_verify/"
---
{% raw %}
[시프트 명령](/Hongs_Blog/studies/assembly-language/shift-instructions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""시프트 명령(SHL, SHR, SAL, SAR) 검증. 실행: python3 37_shift-instructions_verify.py
MASM이 없어 시프트·회전 명령을 파이썬 함수로 흉내 낸다(한 칸씩 n번 민다).
슬라이드 wk10-3-1 p.7~10의 값과 Your turn 답을 단언하고, 8비트 256가지 값을 모두 검사한다."""
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
    # --- 슬라이드 wk10-3-1 p.7: 빠른 곱셈 ---
    assert shl(5, 1)[0] == 10
    assert shl(5, 2)[0] == 20
    # --- p.8: SHR로 나누기 ---
    dl, _ = shr(80, 1); assert dl == 40
    dl, _ = shr(dl, 2); assert dl == 10
    # --- p.9: SAR은 부호를 지킨다 (-80 = B0h) ---
    dl = (-80) & 0xFF; assert dl == 0xB0
    dl, _ = sar(dl, 1); assert signed(dl) == -40 and dl == 0xD8
    dl, _ = sar(dl, 2); assert signed(dl) == -10 and dl == 0xF6
    # --- p.4, p.5 그림: 11001111을 한 칸 오른쪽으로 ---
    assert shr(0b11001111, 1) == (0b01100111, 1)
    assert sar(0b11001111, 1) == (0b11100111, 1)
    # --- p.10 Your turn ---
    al, cf = shr(0x6B, 1); assert (al, cf) == (0x35, 1)      # a
    al, cf = shl(al, 3);   assert (al, cf) == (0xA8, 1)      # b
    al, cf = sar(0x8C, 1); assert (al, cf) == (0xC6, 0)      # c
    al, cf = sar(al, 3);   assert (al, cf) == (0xF8, 1)      # d
    # --- 예시로 보기 추적 표: 01101011을 한 칸씩 ---
    assert shl(0b01101011, 1) == (0b11010110, 0)
    assert shl(0b11010110, 1) == (0b10101100, 1)
    assert shr(0b01101011, 1) == (0b00110101, 1)
    # --- 8비트 전수 검사 ---
    for x in range(256):
        for n in range(0, 9):
            # 왼쪽으로 n칸 = 2^n을 곱하고 8비트만 남긴다
            assert shl(x, n)[0] == (x * 2 ** n) % 256
            # 부호 없는 수를 오른쪽으로 n칸 = 2^n으로 나눈 몫
            assert shr(x, n)[0] == x // 2 ** n
            # 부호 있는 수를 산술 오른쪽으로 n칸 = 2^n으로 나누고 내림
            assert signed(sar(x, n)[0]) == signed(x) // 2 ** n
            if n >= 1:
                # CF는 마지막으로 밀려 나간 비트
                assert shl(x, n)[1] == (x >> (8 - n)) & 1
                assert shr(x, n)[1] == (x >> (n - 1)) & 1
        # 곱셈 결과가 8비트에 들어갈 때만 "곱하기 2"가 그대로 맞다
        assert (shl(x, 1)[0] == x * 2) == (x < 128)
    assert sal is shl                       # SAL은 SHL과 같은 명령이다
    # 넘치는 예: 200을 한 칸 밀면 400이 아니라 144, CF = 1
    assert shl(200, 1) == (144, 1)
    # 부호 없는 200에 SAR을 쓰면 오히려 커진다: 228
    assert sar(200, 1)[0] == 228
    # 그림의 값을 수로 읽으면: 207 → 103 (SHR), -49 → -25 (SAR)
    assert shr(207, 1)[0] == 103 and signed(207) == -49 and signed(sar(207, 1)[0]) == -25
    # 음수에 SHR을 쓰면 부호가 깨진다: -80 → 88
    assert shr(0xB0, 1)[0] == 88
    # SAR의 내림: -5 >> 1 = -3 (0 쪽이 아니라 아래쪽으로)
    assert signed(sar((-5) & 0xFF, 1)[0]) == -3
    assert signed(sar(0xFF, 7)[0]) == -1       # -1은 아무리 밀어도 -1
    # 카드
    assert shl(0x3C, 2) == (0xF0, 0)           # C2
    assert shr(0xF0, 3) == (0x1E, 0)
    assert shl(7, 3)[0] == 56                  # 7 × 8
    assert shl(3, 4)[0] + shl(3, 1)[0] == 54   # 3 × 18 = 3×16 + 3×2
    assert shl(0x80, 1) == (0x00, 1)
    # 32비트: 123 × 36 = 123×32 + 123×4
    assert shl(123, 5, 32)[0] + shl(123, 2, 32)[0] == 123 * 36
    print("ALL CHECKS PASSED")
```
{% endraw %}
