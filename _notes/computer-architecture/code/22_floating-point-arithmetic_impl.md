---
layout: "note"
title: "22_floating-point-arithmetic_impl.py"
display_title: "22_floating-point-arithmetic_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "22"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/floating-point-arithmetic/"
parent_title: "부동소수점 연산"
description: "컴퓨터 구조 · 부동소수점 연산 구현 코드"
permalink: "/studies/computer-architecture/code/22_floating-point-arithmetic_impl/"
---
{% raw %}
[부동소수점 연산](/Hongs_Blog/studies/computer-architecture/floating-point-arithmetic/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 22.부동소수점 연산: 단정도(32비트) 덧셈과 곱셈을 비트열 수준에서 절차대로 한다.
# 실제 회로가 아니라 파이썬 흉내다. 답은 struct가 만든 실제 단정도 값과 비트 단위로 대조한다.
# 정규화된 수(지수 칸 1~254)만 다룬다. 0, 아주 작은 수, 무한대, NaN은 다루지 않는다.
# 실행: python3 22_floating-point-arithmetic_impl.py
import random
import struct


def f2b(x):
    return struct.unpack(">I", struct.pack(">f", x))[0]


def b2f(b):
    return struct.unpack(">f", struct.pack(">I", b))[0]


def unpack(b):
    return b >> 31, (b >> 23) & 0xFF, b & 0x7FFFFF


def pack(s, e, sig):
    assert 1 <= e <= 254, "지수가 범위를 벗어났다"
    assert (1 << 23) <= sig < (1 << 24)
    return (s << 31) | (e << 23) | (sig & 0x7FFFFF)


def shift_right_sticky(x, d):
    """오른쪽으로 d칸 민다. 밀려 나간 비트에 1이 하나라도 있으면 맨 아랫비트를 1로 남긴다."""
    if d == 0:
        return x
    if d > 60:
        return 1 if x else 0
    lost = x & ((1 << d) - 1)
    return (x >> d) | (1 if lost else 0)


def fp_add(a, b, steps=None):
    """단정밀도 비트열 둘을 더한다(정규화된 수만). 반올림은 가까운 쪽, 정확히 가운데면 짝수 쪽."""
    sa, ea, fa = unpack(a)
    sb, eb, fb = unpack(b)
    assert 1 <= ea <= 254 and 1 <= eb <= 254
    ma, mb = ((1 << 23) | fa) << 3, ((1 << 23) | fb) << 3     # 숨은 1을 붙이고 여분 3비트를 둔다
    if (ea, ma) < (eb, mb):                                   # 크기가 큰 쪽을 a로
        sa, ea, ma, sb, eb, mb = sb, eb, mb, sa, ea, ma
    d = ea - eb
    mb = shift_right_sticky(mb, d)                            # 1. 지수 맞추기
    total = ma + mb if sa == sb else ma - mb                  # 2. 유효숫자 더하기
    e = ea
    if steps is not None:
        steps.append(("맞춘 뒤", e, ma, mb))
        steps.append(("더한 뒤", e, total))
    if total == 0:
        return 0
    if total >= (1 << 27):                                    # 3. 정규화: 한 칸 넘쳤으면 오른쪽으로
        total = shift_right_sticky(total, 1)
        e += 1
    while total < (1 << 26):                                  #    앞자리가 비었으면 왼쪽으로
        total <<= 1
        e -= 1
    if steps is not None:
        steps.append(("정규화 뒤", e, total))
    extra, sig = total & 7, total >> 3                        # 4. 반올림
    if extra > 4 or (extra == 4 and sig & 1):
        sig += 1
    if sig == (1 << 24):                                      #    반올림으로 넘쳤으면 다시 정규화
        sig >>= 1
        e += 1
    if steps is not None:
        steps.append(("반올림 뒤", e, sig))
    return pack(sa, e, sig)


def fp_mul(a, b, steps=None):
    """단정밀도 비트열 둘을 곱한다(정규화된 수만)."""
    sa, ea, fa = unpack(a)
    sb, eb, fb = unpack(b)
    assert 1 <= ea <= 254 and 1 <= eb <= 254
    e = ea + eb - 127                                         # 1. 지수 더하기(바이어스가 두 번 들어가 한 번 뺀다)
    prod = ((1 << 23) | fa) * ((1 << 23) | fb)                # 2. 유효숫자 곱하기(48비트)
    if steps is not None:
        steps.append(("곱한 뒤", e, prod))
    shift = 23
    if prod >= (1 << 47):                                     # 3. 정규화: 10.xxx 또는 11.xxx이면 한 칸
        shift, e = 24, e + 1
    sig, rest, half = prod >> shift, prod & ((1 << shift) - 1), 1 << (shift - 1)
    if rest > half or (rest == half and sig & 1):             # 4. 반올림
        sig += 1
    if sig == (1 << 24):
        sig >>= 1
        e += 1
    if steps is not None:
        steps.append(("반올림 뒤", e, sig))
    return pack(sa ^ sb, e, sig)                              # 5. 부호


def add_f(x, y):
    return b2f(fp_add(f2b(x), f2b(y)))


def normal(b):
    return 1 <= (b >> 23) & 0xFF <= 254


if __name__ == "__main__":
    # 10진수 예
    assert abs((9.987e1 + 2.640e-1) - 100.134) < 1e-9 and round(100.134, 1) == 100.1

    # 예 1: 12.5 + 0.4375
    assert (f2b(12.5), f2b(0.4375), f2b(12.9375)) == (0x41480000, 0x3EE00000, 0x414F0000)
    assert 12.5 == 0b11001 / 2 == 0b11001 / 16 * 2 ** 3 and 0.4375 == 0b111 / 4 * 2 ** -2
    st = []
    assert fp_add(0x41480000, 0x3EE00000, st) == 0x414F0000
    assert unpack(0x41480000)[1] - unpack(0x3EE00000)[1] == 5
    name, e, ma, mb = st[0]
    assert e - 127 == 3
    assert format(ma, "027b").startswith("11001000") and format(mb, "027b").startswith("00000111")
    assert format(st[1][2], "027b").startswith("11001111") and 0b11001111 / 2 ** 7 * 8 == 12.9375

    # 예 2: 12.5 + (-12.0) = 0.5
    st = []
    assert fp_add(f2b(12.5), f2b(-12.0), st) == 0x3F000000 == f2b(0.5)
    assert format(st[1][2], "027b").startswith("00001") and st[2][1] - 127 == -1

    # 반올림: 2^24 근처
    assert 2 ** 24 == 16777216
    assert add_f(16777216.0, 1.0) == 16777216.0 and add_f(16777216.0, 3.0) == 16777220.0
    assert b2f(f2b(16777216.0) + 1) == 16777218.0          # 바로 다음 수가 2 떨어져 있다
    assert f2b(16777216.0) & 1 == 0 and f2b(16777220.0) & 1 == 0 and f2b(16777218.0) & 1 == 1

    # 곱셈 예: 12.5 × 0.4375
    st = []
    assert fp_mul(0x41480000, 0x3EE00000, st) == 0x40AF0000 == f2b(5.46875)
    assert 130 + 125 - 127 == 128 and st[0][1] == 128 and st[1][1] == 129
    assert format(st[0][2], "b").startswith("10101111") and 0b11001 * 0b111 == 0b10101111
    assert 0b10101111 / 32 == 5.46875

    # 무작위 대조: struct가 만든 값과 비트가 같다
    rng = random.Random(22)
    n_add = n_mul = 0
    for _ in range(200000):
        a, b = rng.getrandbits(32), rng.getrandbits(32)
        if rng.random() < 0.7:                              # 지수가 가까운 쌍을 많이 넣는다
            ea = rng.randint(60, 190)
            eb = max(1, min(254, ea + rng.randint(-30, 30)))
            a = (a & 0x807FFFFF) | (ea << 23)
            b = (b & 0x807FFFFF) | (eb << 23)
        if not (normal(a) and normal(b)):
            continue
        x, y = b2f(a), b2f(b)
        try:
            want = f2b(x + y)
        except OverflowError:
            want = None
        if want is not None and normal(want):
            assert fp_add(a, b) == want, (hex(a), hex(b))
            assert fp_add(b, a) == want
            n_add += 1
        try:
            want = f2b(x * y)
        except OverflowError:
            want = None
        if want is not None and normal(want):
            try:
                got = fp_mul(a, b)
            except AssertionError:
                continue                                    # 반올림 전 지수가 범위 밖인 경계는 건너뛴다
            assert got == want, (hex(a), hex(b))
            n_mul += 1
    assert n_add > 190000 and n_mul > 160000, (n_add, n_mul)

    # 더하는 순서가 답을 바꾼다
    A = 16777216.0
    assert add_f(add_f(A, 1.0), 1.0) == A and add_f(A, add_f(1.0, 1.0)) == A + 2
    assert 0.1 + 0.2 != 0.3 and 0.1 + 0.2 == 0.30000000000000004      # 배정도에서는 다르다
    assert fp_add(f2b(0.1), f2b(0.2)) == f2b(0.3) == 0x3E99999A       # 단정도에서는 같은 비트가 나온다

    # 카드
    assert (f2b(5.0), f2b(0.375)) == (0x40A00000, 0x3EC00000)
    assert fp_add(0x40A00000, 0x3EC00000) == 0x40AC0000 == f2b(5.375) and 0b101011 / 8 == 5.375
    x = 16777216.0
    for _ in range(100):
        x = add_f(x, 1.0)
    assert x == 16777216.0
    acc = 1.0
    for _ in range(99):
        acc = add_f(acc, 1.0)
    assert acc == 100.0 and add_f(16777216.0, acc) == 16777316.0
    assert (f2b(6.0), f2b(1.5)) == (0x40C00000, 0x3FC00000)
    st = []
    assert fp_mul(0x40C00000, 0x3FC00000, st) == 0x41100000 == f2b(9.0)
    assert st[0][1] == 129 and st[1][1] == 130 and 0b11 * 0b11 == 0b1001
    print("ALL CHECKS PASSED")
```
{% endraw %}
