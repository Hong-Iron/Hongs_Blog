---
layout: "note"
title: "40_shift-rotate-ladder_p4.py"
display_title: "40_shift-rotate-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "40"
course: "어셈블리어"
course_slug: "assembly-language"
course_url: "/studies/assembly-language/"
track: "컴퓨터 시스템"
parent_url: "/studies/assembly-language/shift-rotate-ladder/"
parent_title: "시프트와 회전 예제 사다리"
description: "어셈블리어 · 시프트와 회전 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/assembly-language/code/40_shift-rotate-ladder_p4/"
---
{% raw %}
[시프트와 회전 예제 사다리](/Hongs_Blog/studies/assembly-language/shift-rotate-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""시프트와 회전 예제 사다리의 답 확인. 실행: python3 40_shift-rotate-ladder_p4.py
MASM이 없어 시프트·회전 명령을 파이썬 함수로 흉내 낸다(한 칸씩 n번 민다).
문제 1~4의 모든 중간 값과 CF를 단언한다."""
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
    # 문제 1: mov al,0D4h / shl al,1 / sar al,2 / rol al,3
    al, cf = shl(0xD4, 1); assert (al, cf) == (0xA8, 1)
    al, cf = sar(al, 2);   assert (al, cf) == (0xEA, 0)
    al, cf = rol(al, 3);   assert (al, cf) == (0x57, 1)
    # 문제 2: stc / mov bl,4Eh / rcl bl,2 / rcr bl,1
    bl, cf = rcl(0x4E, 1, cf=1); assert (bl, cf) == (0x9D, 0)
    bl, cf = rcl(bl, 1, cf=cf);  assert (bl, cf) == (0x3A, 1)
    bl, cf = rcr(bl, 1, cf=cf);  assert (bl, cf) == (0x9D, 0)
    # 문제 3: mov ax,0B3C5h / mov dx,2D4Fh / shld dx,ax,4 / shrd ax,dx,8 / ror ax,4
    dx, cf = shld(0x2D4F, 0xB3C5, 4); assert (dx, cf) == (0xD4FB, 0)
    ax, cf = shrd(0xB3C5, dx, 8);     assert (ax, cf) == (0xFBB3, 1)
    ax, cf = ror(ax, 4, 16);          assert (ax, cf) == (0x3FBB, 0)
    # 문제 4: DX = 266Ah에서 달(5~8번 비트) 꺼내기
    dx = 0x266A
    ax, _ = shr(dx, 5, 16)
    assert ax == 0x0133 and ax & 0b00001111 == 3
    assert dx >> 9 == 19 and dx & 0b11111 == 10          # 해 19, 날 10
    # 모든 (해, 달, 날) 조합에서 같은 코드가 달을 꺼낸다
    for y in range(128):
        for m in range(1, 13):
            for d in (1, 15, 31):
                v = (y << 9) | (m << 5) | d
                assert shr(v, 5, 16)[0] & 0x0F == m
                assert shr(v, 9, 16)[0] == y
    # 맨 위 비트가 1인 값(A66Ah)에서 해를 꺼낼 때: SHR은 53h, SAR은 FFD3h
    assert shr(0xA66A, 9, 16)[0] == 0x0053 and sar(0xA66A, 9, 16)[0] == 0xFFD3
    print("ALL CHECKS PASSED")
```
{% endraw %}
