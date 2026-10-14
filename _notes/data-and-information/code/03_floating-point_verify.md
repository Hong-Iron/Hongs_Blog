---
layout: "note"
title: "03_floating-point_verify.py"
display_title: "03_floating-point_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/data-and-information/floating-point/"
parent_title: "부동소수점"
description: "자료와 정보 · 부동소수점 검증 코드"
sitemap: false
permalink: "/studies/data-and-information/code/03_floating-point_verify/"
---
{% raw %}
[부동소수점](/Hongs_Blog/studies/data-and-information/floating-point/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""부동소수점 문서의 값 확인.

문서: 03.부동소수점
출처: 자료와 정보 2회 슬라이드 p.7~12
주장:
  1. 고정소수점 0.1011(2) = 0.6875. 4.50 + 2.75 = 7.25 = 111.01(2), 4.50 x 2.75 = 12.375 = 1100.011(2).
  2. 단정도 비트 0 01111100 0100...0 = 0.15625 (부호 0, 지수 124 - 127 = -3, 가수 1.25).
  3. 단정도의 끝값: 1 + 2^-23, 2 - 2^-23, 2^-126 = 1.17549435e-38, 2^127 = 1.70141183e38, 최댓값 3.40e38.
  4. 배정도 3FD5 5555 5555 5555 = 2^-2 x 1.333... = 0.333333333333333314829616256247...
  5. 배정도는 -2^53 ~ 2^53의 정수를 정확히 적는다. 2^53 + 1은 적지 못한다. 2^53 ~ 2^54는 짝수만.
  6. 이웃한 두 수의 간격은 값이 클수록 넓다: 1 근처 2^-52, 2^52 근처 1. 단정도는 1 근처 2^-23, 2^24 근처 2.
  7. 유효 자릿수: 24 x log10(2) = 7.22, 53 x log10(2) = 15.95.
  8. 0.1 + 0.2 != 0.3.
실행: python3 03_floating-point_verify.py
"""
import math
import struct
from fractions import Fraction


def f32_from_bits(bits):
    return struct.unpack(">f", int(bits, 2).to_bytes(4, "big"))[0]


def f32_bits(x):
    return format(int.from_bytes(struct.pack(">f", x), "big"), "032b")


def f32(x):
    return struct.unpack(">f", struct.pack(">f", x))[0]


def decode32(bits):
    s, e, f = int(bits[0]), int(bits[1:9], 2), int(bits[9:], 2)
    return (-1) ** s * Fraction(2) ** (e - 127) * (1 + Fraction(f, 2 ** 23))


def bin_frac(s):
    ip, fp = s.split(".")
    return int(ip, 2) + sum(int(b) * Fraction(1, 2 ** (i + 1)) for i, b in enumerate(fp))


if __name__ == "__main__":
    assert bin_frac("0.1011") == Fraction(11, 16) == Fraction("0.6875")
    assert bin_frac("100.1") == Fraction("4.5") and bin_frac("10.11") == Fraction("2.75")
    assert bin_frac("111.01") == Fraction("7.25") and bin_frac("1100.011") == Fraction("12.375")
    assert Fraction("4.5") * Fraction("2.75") == Fraction("12.375")

    b = "0" + "01111100" + "01" + "0" * 21
    assert len(b) == 32 and f32_from_bits(b) == 0.15625 and decode32(b) == Fraction(5, 32)
    assert int("01111100", 2) == 124 and 124 - 127 == -3 and 1.25 * 2 ** -3 == 0.15625

    assert abs((1 + 2 ** -23) - 1.000000119) < 1e-9
    assert abs((2 - 2 ** -23) - 1.999999881) < 1e-9
    assert abs(2 ** -126 / 1.17549435e-38 - 1) < 1e-8
    assert abs(2 ** 127 / 1.70141183e38 - 1) < 1e-8
    mx = (2 - 2 ** -23) * 2.0 ** 127
    assert abs(mx / 3.40e38 - 1) < 1e-2 and f32(mx) == mx

    x = struct.unpack(">d", bytes.fromhex("3FD5555555555555"))[0]
    assert x == 1 / 3
    assert format(Fraction(x).numerator * 10 ** 30 // Fraction(x).denominator, "d").startswith("333333333333333314829616256247")
    e = (int("3FD", 16)) - 1023
    assert e == -2

    assert float(2 ** 53) == 2 ** 53 and float(2 ** 53 + 1) == 2 ** 53
    assert float(2 ** 53 + 2) == 2 ** 53 + 2
    for k in range(-1000, 1001):
        assert int(float(2 ** 53 - abs(k))) == 2 ** 53 - abs(k)

    assert math.ulp(1.0) == 2 ** -52 and math.ulp(2.0 ** 52) == 1.0
    assert f32(1 + 2 ** -23) != 1.0 and f32(1 + 2 ** -25) == 1.0
    assert f32(2 ** 24 + 1) == 2 ** 24 and f32(2 ** 24 + 2) == 2 ** 24 + 2
    assert f32(16777217.0) == 16777216.0

    assert round(24 * math.log10(2), 2) == 7.22 and round(53 * math.log10(2), 2) == 15.95
    assert 0.1 + 0.2 != 0.3 and abs(0.1 + 0.2 - 0.3) < 1e-15

    # 카드: -6.5 = -110.1(2) = -1.101 x 2^2 -> 부호 1, 지수 129 = 10000001, 가수 101000...
    assert f32_bits(-6.5) == "1" + "10000001" + "101" + "0" * 20
    # 카드: 0.1은 2진 유한 소수가 아니다
    assert Fraction(0.1) != Fraction(1, 10)
    # 진법과 자릿수 문서의 카드 C4 (다): 0.10000001(2) = 1/2 + 1/256
    assert bin_frac("0.10000001") == Fraction("0.50390625")
    print("ALL CHECKS PASSED")
```
{% endraw %}
