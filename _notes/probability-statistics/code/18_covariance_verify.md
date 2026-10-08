---
layout: "note"
title: "18_covariance_verify.py"
display_title: "18_covariance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/covariance/"
parent_title: "공분산과 상관계수"
description: "확률과 통계 · 공분산과 상관계수 검증 코드"
permalink: "/studies/probability-statistics/code/18_covariance_verify/"
---
{% raw %}
[공분산과 상관계수](/Hongs_Blog/studies/probability-statistics/covariance/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""공분산과 상관계수 검증.

문서: 18.공분산과 상관계수 (예시, 정의, 증명, 예제, 오해, 카드 C1~C3)
주장 1: 예시 — 자료 x = 1..5, y = 2, 4, 5, 4, 5: 공분산 1.2, 상관계수 √0.6 ≈ 0.775 = 가운데로 옮긴 두 벡터의 코사인.
주장 2: 정의 — Cov = E[XY] - E[X]E[Y], Var(X + Y) = Var X + Var Y + 2Cov(무작위 결합분포), |ρ| <= 1, 일차 관계면 ρ = ±1.
주장 3: 반례·카드 C2 — X가 -1, 0, 1 균등, Y = X²: 공분산 0이지만 독립이 아니다.
주장 4: 카드 C1 — 결합분포 표 [[0.4, 0.1], [0.1, 0.4]]: 공분산 0.15, 상관계수 0.6.
주장 5: 카드 C3 — Var 4, 9, ρ = 0.5이면 Var(X + Y) = 19, ρ = -0.5면 7.
"""
from fractions import Fraction
import math
import random


def main():
    x = [1, 2, 3, 4, 5]
    y = [2, 4, 5, 4, 5]
    mx, my = sum(x) / 5, sum(y) / 5
    dx = [a - mx for a in x]
    dy = [b - my for b in y]
    cov = sum(a * b for a, b in zip(dx, dy)) / 5
    rho = cov / math.sqrt(sum(a * a for a in dx) / 5 * sum(b * b for b in dy) / 5)
    cosine = sum(a * b for a, b in zip(dx, dy)) / math.sqrt(sum(a * a for a in dx) * sum(b * b for b in dy))
    assert abs(cov - 1.2) < 1e-12 and abs(rho - math.sqrt(0.6)) < 1e-12 and abs(rho - cosine) < 1e-12
    print("[OK] 주장 1: 표본 상관 = 코사인")

    rng = random.Random(18)
    for _ in range(300):
        pts = [(rng.randint(-3, 3), rng.randint(-3, 3)) for _ in range(5)]
        ps = [Fraction(rng.randint(1, 9)) for _ in pts]
        t = sum(ps)
        ps = [p / t for p in ps]
        E = lambda g: sum(p * g(a, b) for p, (a, b) in zip(ps, pts))
        ex, ey = E(lambda a, b: a), E(lambda a, b: b)
        c = E(lambda a, b: (a - ex) * (b - ey))
        assert c == E(lambda a, b: a * b) - ex * ey
        vx, vy = E(lambda a, b: (a - ex) ** 2), E(lambda a, b: (b - ey) ** 2)
        assert E(lambda a, b: (a + b - ex - ey) ** 2) == vx + vy + 2 * c
        if vx and vy:
            assert c * c <= vx * vy
    for a, b in ((2, 1), (-3, 5)):
        xs = [rng.gauss(0, 1) for _ in range(1000)]
        ys = [a * t + b for t in xs]
        m1, m2 = sum(xs) / 1000, sum(ys) / 1000
        r = sum((p - m1) * (q - m2) for p, q in zip(xs, ys)) / math.sqrt(sum((p - m1) ** 2 for p in xs) * sum((q - m2) ** 2 for q in ys))
        assert abs(r - math.copysign(1, a)) < 1e-12
    print("[OK] 주장 2: 공식, 합의 분산, |ρ| <= 1")

    X = [-1, 0, 1]
    EX = sum(Fraction(v, 3) for v in X)
    EY = sum(Fraction(v * v, 3) for v in X)
    EXY = sum(Fraction(v * v * v, 3) for v in X)
    assert EXY - EX * EY == 0
    p_x0_y0 = Fraction(1, 3)                         # X = 0이면 Y = 0이므로 P(X=0, Y=0) = P(X=0)
    p_x0, p_y0 = Fraction(1, 3), Fraction(sum(1 for v in X if v * v == 0), 3)
    assert p_x0_y0 != p_x0 * p_y0                    # 1/3 ≠ 1/9
    print("[OK] 주장 3·카드 C2: 무상관 ≠ 독립")

    J = {(0, 0): 0.4, (0, 1): 0.1, (1, 0): 0.1, (1, 1): 0.4}
    c = J[(1, 1)] - 0.5 * 0.5
    assert abs(c - 0.15) < 1e-12 and abs(c / 0.25 - 0.6) < 1e-12
    print("[OK] 주장 4·카드 C1")

    assert 4 + 9 + 2 * 0.5 * 2 * 3 == 19 and 4 + 9 - 2 * 0.5 * 2 * 3 == 7
    print("[OK] 주장 5·카드 C3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
