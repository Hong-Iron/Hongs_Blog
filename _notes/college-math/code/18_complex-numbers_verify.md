---
layout: "note"
title: "18_complex-numbers_verify.py"
display_title: "18_complex-numbers_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "공학수학"
parent_url: "/studies/college-math/complex-numbers/"
parent_title: "복소수"
description: "대학수학 · 복소수 검증 코드"
permalink: "/studies/college-math/code/18_complex-numbers_verify/"
---
{% raw %}
[복소수](/Hongs_Blog/studies/college-math/complex-numbers/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""복소수 검증.

문서: 18.복소수 (예시, 정의, 정리, 예제, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: (2 + 3i)(1 - i) = 5 + i, (5 + i)/(1 - i) = 2 + 3i, |3 + 4i| = 5, z·z̄ = |z|².
주장 2: x² + 2x + 5 = 0의 근은 -1 ± 2i이다.
주장 3: 실수 계수 다항식의 켤레: p(z̄) = conj(p(z)). 그래서 실수가 아닌 근은 켤레 쌍으로 나온다.
주장 4: √(-4)·√(-9) = (2i)(3i) = -6 ≠ √36 = 6.
주장 5: 파이썬은 j를 허수 단위로 쓴다: (1j)**2 == -1, abs(3+4j) == 5.0.
주장 6: 카드 C1 — (1 + 2i)(3 - i) = 5 + 5i, (1 + 2i)/(3 - i) = (1 + 7i)/10.
"""
import cmath
import random
from fractions import Fraction as F


class Q:
    """유리수 복소수 (정확 계산)."""
    def __init__(s, a, b=0): s.a, s.b = F(a), F(b)
    def __add__(s, o): return Q(s.a + o.a, s.b + o.b)
    def __mul__(s, o): return Q(s.a * o.a - s.b * o.b, s.a * o.b + s.b * o.a)
    def conj(s): return Q(s.a, -s.b)
    def norm2(s): return s.a * s.a + s.b * s.b
    def __truediv__(s, o):
        n = s * o.conj(); d = o.norm2()
        return Q(n.a / d, n.b / d)
    def __eq__(s, o): return (s.a, s.b) == (o.a, o.b)


def main():
    assert Q(2, 3) * Q(1, -1) == Q(5, 1) and Q(5, 1) / Q(1, -1) == Q(2, 3)
    assert abs(3 + 4j) == 5.0
    z = Q(7, -2)
    assert (z * z.conj()) == Q(z.norm2(), 0)
    print("[OK] 주장 1: 곱·나눗셈·크기·켤레")

    for r in (Q(-1, 2), Q(-1, -2)):
        assert r * r + Q(2) * r + Q(5) == Q(0)
    print("[OK] 주장 2: -1 ± 2i")

    rng = random.Random(18)
    for _ in range(2000):
        coeffs = [rng.randint(-9, 9) for _ in range(rng.randint(1, 6))]
        z = Q(rng.randint(-9, 9), rng.randint(-9, 9))
        def p(w):
            acc = Q(0)
            for c in reversed(coeffs):
                acc = acc * w + Q(c)
            return acc
        assert p(z.conj()) == p(z).conj()
    print("[OK] 주장 3: 실수 계수 다항식 2,000개에서 p(z̄) = conj p(z)")

    prod = cmath.sqrt(-4) * cmath.sqrt(-9)
    assert prod == -6 and cmath.sqrt(36) == 6
    print(f"[OK] 주장 4·카드 C3: √-4·√-9 = {prod}, √36 = 6")

    assert (1j) ** 2 == -1
    print("[OK] 주장 5")

    assert Q(1, 2) * Q(3, -1) == Q(5, 5) and Q(1, 2) / Q(3, -1) == Q(F(1, 10), F(7, 10))
    print("[OK] 카드 C1: 5 + 5i, (1 + 7i)/10")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
