---
layout: "note"
title: "02_twos-complement_verify.py"
display_title: "02_twos-complement_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "수학"
parent_url: "/studies/data-and-information/twos-complement/"
parent_title: "정수의 2진 표현과 2의 보수"
description: "자료와 정보 · 정수의 2진 표현과 2의 보수 검증 코드"
permalink: "/studies/data-and-information/code/02_twos-complement_verify/"
---
{% raw %}
[정수의 2진 표현과 2의 보수](/Hongs_Blog/studies/data-and-information/twos-complement/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""정수의 2진 표현과 2의 보수 문서의 값 확인.

문서: 02.정수의 2진 표현과 2의 보수
출처: 자료와 정보 2회 슬라이드 p.5~6
주장:
  1. N비트 부호 없는 정수는 0 ~ 2^N - 1, 2의 보수는 -2^(N-1) ~ 2^(N-1) - 1을 겹치지 않고 모두 나타낸다.
  2. 2의 보수 값 w = -a_(N-1) 2^(N-1) + sum_{i<N-1} a_i 2^i. 슬라이드 예 1010 -> -8 + 2 = -6.
  3. 슬라이드의 8비트 표 열 줄.
  4. 비트를 모두 뒤집고 1을 더하면 부호가 바뀐다 (가장 작은 수 -2^(N-1)만 예외).
  5. 2의 보수 덧셈은 부호를 따지지 않고 그냥 더한 뒤 넘친 비트를 버리면 된다 (8비트 전수 검사).
  6. 범위를 넘으면 값이 반대쪽 끝으로 돈다: 127 + 1 -> -128.
실행: python3 02_twos-complement_verify.py
"""


def unsigned(bits):
    return sum(int(b) << i for i, b in enumerate(reversed(bits)))


def signed(bits):
    n = len(bits)
    return -int(bits[0]) * 2 ** (n - 1) + unsigned(bits[1:]) if n > 1 else -int(bits[0])


def to_bits(v, n):
    return format(v % (1 << n), "0{}b".format(n))


def negate(bits):
    n = len(bits)
    inv = "".join("1" if b == "0" else "0" for b in bits)
    return to_bits(unsigned(inv) + 1, n)


if __name__ == "__main__":
    for n in range(1, 11):
        allb = [to_bits(v, n) for v in range(1 << n)]
        assert sorted(unsigned(b) for b in allb) == list(range(1 << n))
        assert sorted(signed(b) for b in allb) == list(range(-(1 << (n - 1)), 1 << (n - 1)))
    assert signed("1010") == -6 and unsigned("1010") == 10
    table = [("00000000", 0, 0), ("00000001", 1, 1), ("00000010", 2, 2), ("01111110", 126, 126),
             ("01111111", 127, 127), ("10000000", 128, -128), ("10000001", 129, -127),
             ("10000010", 130, -126), ("11111110", 254, -2), ("11111111", 255, -1)]
    for b, u, s in table:
        assert unsigned(b) == u and signed(b) == s, b
    # 뒤집고 1 더하기
    assert negate("00000110") == "11111010" and signed("11111010") == -6
    for v in range(-127, 128):
        assert signed(negate(to_bits(v, 8))) == -v
    assert negate("10000000") == "10000000"  # -128은 짝이 없다
    # 덧셈: 부호 없이 더하고 넘친 비트를 버린다
    for a in range(-128, 128):
        for b in range(-128, 128):
            if -128 <= a + b <= 127:
                r = to_bits(unsigned(to_bits(a, 8)) + unsigned(to_bits(b, 8)), 8)
                assert signed(r) == a + b
    assert signed(to_bits(127 + 1, 8)) == -128
    # 문서 예: 5 + (-6) = -1
    assert to_bits(5, 8) == "00000101" and to_bits(-6, 8) == "11111010"
    assert to_bits(unsigned("00000101") + unsigned("11111010"), 8) == "11111111"
    # 카드: 4비트 1101 -> 부호 없이 13, 2의 보수로 -3 / -5의 8비트 표현
    assert unsigned("1101") == 13 and signed("1101") == -3
    assert to_bits(-5, 8) == "11111011"
    assert signed("10000001") == -127 and unsigned("10000001") == 129
    print("ALL CHECKS PASSED")
```
{% endraw %}
