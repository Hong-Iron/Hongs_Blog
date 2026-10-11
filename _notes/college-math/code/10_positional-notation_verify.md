---
layout: "note"
title: "10_positional-notation_verify.py"
display_title: "10_positional-notation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/positional-notation/"
parent_title: "진법과 자릿수"
description: "대학수학 · 진법과 자릿수 검증 코드"
permalink: "/studies/college-math/code/10_positional-notation_verify/"
---
{% raw %}
[진법과 자릿수](/Hongs_Blog/studies/college-math/positional-notation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""진법과 자릿수 검증.

문서: 10.진법과 자릿수 (예시, 정의, 증명, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: 반복 나눗셈으로 얻은 나머지를 거꾸로 읽으면 b진 표현이다 (13 = 1101_2, 45 = 101101_2 = 0x2D, 255 = 0xFF).
주장 2: n >= 1의 b진 자릿수는 floor(log_b n) + 1이다. 정수 연산으로 b = 2, 3은 n < 100,000, b = 4..16은 n < 20,000 전수 확인.
        파이썬 int.bit_length()는 floor(lg n) + 1과 같다.
주장 3: 서로 다른 값 N개를 구별하려면 ceil(lg N)비트가 필요하다. N = 1000 -> 10, 수 1000 자체는 10비트,
        N = 1024 -> 10비트, 수 1024 자체는 11비트.
주장 4: 부동소수점 log10으로 자릿수를 세면 n = 10^15 - 1에서 틀린다.
주장 5: 8진 755 = rwxr-xr-x, 24비트 색은 16,777,216가지, IPv4 주소는 2^32개.
주장 6: 숫자 문자열은 호너 방법(지금까지 값 × 10 + 새 숫자)으로 수가 된다.
"""
import math


def to_base(n, b):
    digits = "0123456789ABCDEF"
    if n == 0:
        return "0"
    out = []
    while n:
        n, r = divmod(n, b)
        out.append(digits[r])
    return "".join(reversed(out))


def digit_count_exact(n, b):
    """b^(m-1) <= n < b^m 인 m을 정수로만 찾는다."""
    m = 1
    while b ** m <= n:
        m += 1
    return m


def floor_log_exact(n, b):
    k = 0
    while b ** (k + 1) <= n:
        k += 1
    return k


def main():
    assert to_base(13, 2) == "1101" and to_base(45, 2) == "101101" and to_base(45, 16) == "2D"
    assert to_base(255, 16) == "FF" and to_base(255, 2) == "11111111" and to_base(2025, 10) == "2025"
    assert int("101101", 2) == 45 == 0x2D
    acc = 0
    for ch in "2025":
        acc = acc * 10 + int(ch)
    assert acc == ((2 * 10 + 0) * 10 + 2) * 10 + 5 == 2025
    for n in range(0, 5000):
        for b in (2, 8, 10, 16):
            assert int(to_base(n, b), b) == n
    print("[OK] 주장 1·카드 C1: 13 = 1101₂, 45 = 101101₂ = 0x2D, 255 = 0xFF, 왕복 변환 20,000건")

    for b in range(2, 17):
        for n in range(1, 100_000 if b <= 3 else 20_000):
            m = digit_count_exact(n, b)
            assert len(to_base(n, b)) == m == floor_log_exact(n, b) + 1
            assert b ** (m - 1) <= n < b ** m
    for n in range(1, 200_000):
        assert n.bit_length() == floor_log_exact(n, 2) + 1
    print("[OK] 주장 2·카드 C3: 자릿수 = floor(log_b n) + 1 (정수 연산 전수), bit_length 일치")

    need = lambda N: (N - 1).bit_length()  # ceil(lg N) for N >= 1
    assert need(1000) == 10 and (1000).bit_length() == 10
    assert need(1024) == 10 and (1024).bit_length() == 11
    assert all(need(N) == math.ceil(math.log2(N)) for N in range(1, 5000))
    print("[OK] 카드 C2: 값 1000개 -> 10비트, 수 1000 -> 10비트 / 값 1024개 -> 10비트, 수 1024 -> 11비트")

    n = 10 ** 15 - 1
    float_digits = math.floor(math.log10(n)) + 1
    assert len(str(n)) == 15 and float_digits == 16
    print(f"[OK] 주장 4: n = 10^15 - 1은 15자리인데 floor(log10 n) + 1 = {float_digits} (log10 n -> {math.log10(n)!r})")

    perms = "".join(("r" if d & 4 else "-") + ("w" if d & 2 else "-") + ("x" if d & 1 else "-") for d in (7, 5, 5))
    assert perms == "rwxr-xr-x" and 0o755 == 493
    assert 2 ** 24 == 16_777_216 and 2 ** 32 == 4_294_967_296
    print("[OK] 활용: 0o755 = rwxr-xr-x, 2^24 = 16,777,216색, IPv4 2^32개")

    # 오해: 8 = 1000₂은 4비트인데 lg 8 = 3
    assert (8).bit_length() == 4 and math.log2(8) == 3
    print("[OK] 오해: 8은 lg 8 = 3이지만 4비트(1000₂)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
