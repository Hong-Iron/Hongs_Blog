---
layout: "note"
title: "21_polynomial-interpolation_verify.py"
display_title: "21_polynomial-interpolation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/polynomial-interpolation/"
parent_title: "다항식 보간"
description: "수치해석 · 다항식 보간 검증 코드"
permalink: "/studies/numerical-analysis/code/21_polynomial-interpolation_verify/"
---
{% raw %}
[다항식 보간](/Hongs_Blog/studies/numerical-analysis/polynomial-interpolation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다항식 보간 문서의 주장 검증."""
import math, random
from fractions import Fraction as F


def lagrange(xs, ys, x):
    total = 0
    for i, (xi, yi) in enumerate(zip(xs, ys)):
        L = 1
        for j, xj in enumerate(xs):
            if j != i:
                L = L * (x - xj) / (xi - xj)
        total += yi * L
    return total


def main():
    # 슬라이드 p.3: cos을 0, π/4, π/2에서 보간
    xs = [0, math.pi / 4, math.pi / 2]; ys = [math.cos(v) for v in xs]
    for v, w in zip(xs, ys):
        assert abs(lagrange(xs, ys, v) - w) < 1e-15
    p = lambda x: lagrange(xs, ys, x)
    print("cos 보간 p(π/8) =", round(p(math.pi / 8), 4), "참값", round(math.cos(math.pi / 8), 4))
    assert abs(p(math.pi / 8) - math.cos(math.pi / 8)) < 0.02
    # 슬라이드 p.15의 tan 표
    tx = [1.0, 1.1, 1.2, 1.3]; ty = [1.5574, 1.9648, 2.5722, 3.6021]
    assert all(abs(math.tan(a) - b) < 5e-5 for a, b in zip(tx, ty))
    true = math.tan(1.15)
    P1 = lagrange(tx[1:3], ty[1:3], 1.15)
    P2 = lagrange(tx[:3], ty[:3], 1.15)
    P3 = lagrange(tx, ty, 1.15)
    assert round(P1, 4) == 2.2685 and round(P3, 4) == 2.2296
    assert round(true - P1, 4) == -0.034 and round(true - P3, 4) == 0.0049
    assert round(P2, 4) == 2.2435 and round(true - P2, 4) == -0.009    # 슬라이드의 P2는 1, 1.1, 1.2 세 점
    # 유일성: 같은 세 점을 지나는 2차식은 하나 (무작위로 다른 방법과 비교)
    random.seed(21)
    for _ in range(100):
        pts = random.sample(range(-10, 11), 3); vals = [F(random.randint(-9, 9)) for _ in pts]
        # 방데르몽드로 계수
        M = [[F(1), F(x), F(x * x)] for x in pts]
        det = lambda m: (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))
        d = det(M); coef = []
        for c in range(3):
            Mc = [list(r) for r in M]
            for r in range(3):
                Mc[r][c] = vals[r]
            coef.append(det(Mc) / d)
        for x in range(-12, 13):
            assert coef[0] + coef[1] * x + coef[2] * x * x == lagrange([F(p) for p in pts], vals, F(x))
    # 카드 C2: (0, 1), (1, 3), (2, 7)
    assert [lagrange([0, 1, 2], [1, 3, 7], F(x)) for x in (0, 1, 2, 3)] == [1, 3, 7, 13]
    # 외삽은 위험: tan을 1~1.3으로 보간해 1.5에서
    assert abs(lagrange(tx, ty, 1.5) - math.tan(1.5)) > 5
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
