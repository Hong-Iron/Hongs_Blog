---
layout: "note"
title: "05_exponent-laws_verify.py"
display_title: "05_exponent-laws_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/exponent-laws/"
parent_title: "거듭제곱과 지수법칙"
description: "대학수학 · 거듭제곱과 지수법칙 검증 코드"
permalink: "/studies/college-math/code/05_exponent-laws_verify/"
---
{% raw %}
[거듭제곱과 지수법칙](/Hongs_Blog/studies/college-math/exponent-laws/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""거듭제곱과 지수법칙 검증.

문서: 05.거듭제곱과 지수법칙 (예시, 정의, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: a > 0, 정수 m, n에서 a^m a^n = a^(m+n), (a^m)^n = a^(mn), (ab)^n = a^n b^n, a^m / a^n = a^(m-n).
주장 2: a^0 = 1, a^(-n) = 1/a^n, a^(p/q) = (q제곱근 a)^p로 넓혀도 법칙이 유지된다 (유리수 지수 표본).
주장 3: 2^10 = 1024 ≈ 10^3, 2^32 = 4,294,967,296, 2^64 ≈ 1.8 × 10^19 (초당 10^9개 시험하면 약 585년), 10^12 B = 931.3 GiB.
주장 4: 밑이 음수면 (a^m)^n = a^(mn)이 깨진다: (-8)^(1/3) = -2이지만 ((-8)^2)^(1/6) = 2.
        파이썬의 (-8) ** (1/3)은 실수 -2가 아니라 복소수를 낸다.
주장 5: (a + b)^2 ≠ a^2 + b^2 (1 + 1에서 4 ≠ 2).
주장 6: 배정밀도 부동소수점은 2^53까지의 정수를 모두 정확히 담지만 2^53 + 1은 담지 못한다.
"""
import math
import random
from fractions import Fraction as F


def main():
    rng = random.Random(5)
    for _ in range(3000):
        a = F(rng.randint(1, 30), rng.randint(1, 30))
        b = F(rng.randint(1, 30), rng.randint(1, 30))
        m, n = rng.randint(-8, 8), rng.randint(-8, 8)
        assert a ** m * a ** n == a ** (m + n)
        assert (a ** m) ** n == a ** (m * n)
        assert (a * b) ** n == a ** n * b ** n
        assert a ** m / a ** n == a ** (m - n)
        assert a ** 0 == 1 and a ** (-abs(n)) == 1 / a ** abs(n)
    print("[OK] 정수 지수 법칙: 무작위 유리수 밑 3,000세트 정확히 일치")

    for _ in range(3000):
        a = rng.uniform(0.01, 50)
        p1, q1, p2, q2 = rng.randint(-9, 9), rng.randint(1, 9), rng.randint(-9, 9), rng.randint(1, 9)
        r, s = p1 / q1, p2 / q2
        assert math.isclose(a ** r * a ** s, a ** (r + s), rel_tol=1e-12)
        assert math.isclose((a ** r) ** s, a ** (r * s), rel_tol=1e-12)
        assert math.isclose(a ** (p1 / q1), (a ** (1 / q1)) ** p1, rel_tol=1e-12)
    print("[OK] 유리수 지수 법칙 (a > 0): 부동소수점 3,000세트, 상대오차 1e-12 이내")

    assert 2 ** 10 == 1024 and 2 ** 20 == 1_048_576 and 2 ** 30 == 1_073_741_824
    assert 2 ** 32 == 4_294_967_296
    assert f"{2 ** 64:.2e}" == "1.84e+19"
    years = 2 ** 64 / 1e9 / (365.25 * 86400)
    assert round(years) == 585
    gib = 10 ** 12 / 2 ** 30
    assert round(gib, 1) == 931.3
    print(f"[OK] 크기: 2^32 = {2**32:,}, 2^64 ≈ {2**64:.2e}, 1 TB = {gib:.1f} GiB")

    z = (-8) ** (1 / 3)
    assert isinstance(z, complex) and math.isclose(z.real, 1.0) and math.isclose(z.imag, math.sqrt(3))
    cube_root = -((8) ** (1 / 3))
    assert math.isclose(cube_root, -2.0)
    assert math.isclose(((-8) ** 2) ** (1 / 6), 2.0)
    print(f"[OK] 카드 C3: 실수 세제곱근 (-8)^(1/3) = -2, ((-8)^2)^(1/6) = 2, 파이썬 (-8)**(1/3) = {z:.4f}")

    assert (1 + 1) ** 2 == 4 != 1 ** 2 + 1 ** 2
    for _ in range(100):
        a, b = rng.randint(1, 50), rng.randint(1, 50)
        assert (a + b) ** 2 == a * a + 2 * a * b + b * b
    print("[OK] 오해: (1+1)^2 = 4 ≠ 2, 올바른 전개는 a^2 + 2ab + b^2")

    assert float(2 ** 53) == 2 ** 53 and float(2 ** 53 + 1) == float(2 ** 53) and int(float(2 ** 53 - 1)) == 2 ** 53 - 1
    print(f"[OK] 활용: float(2^53 + 1) = float(2^53) = {float(2**53):.0f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
