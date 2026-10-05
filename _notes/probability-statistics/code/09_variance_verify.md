---
layout: "note"
title: "09_variance_verify.py"
display_title: "09_variance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/variance/"
parent_title: "분산과 표준편차"
description: "확률과 통계 · 분산과 표준편차 검증 코드"
permalink: "/studies/probability-statistics/code/09_variance_verify/"
---
{% raw %}
[분산과 표준편차](/Hongs_Blog/studies/probability-statistics/variance/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""분산과 표준편차 검증.

문서: 09.분산과 표준편차 (예시, 정의, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — 서버 A(늘 100 ms)와 B(50 또는 150 ms 반반): 평균 100으로 같고 분산 0과 2500, 표준편차 0과 50.
주장 2: 정의 — E[(X - μ)²] = E[X²] - μ²(무작위 분포), 주사위 35/12.
주장 3: 성질 — Var(aX + b) = a²Var(X), 독립이면 Var(X + Y) = Var X + Var Y(두 주사위 35/6),
        Var(X + X) = 4 Var X(독립 아님).
주장 4: 예제 — 독립 n개의 평균의 분산은 σ²/n(모의실험, n = 1, 4, 16, 64).
주장 5: 활용 — 10^9 근처 값 네 개(분산 22.5)에서 E[X²] - μ² 공식은 부동소수점 오차로 틀리고, 웰퍼드 방법은 맞다.
주장 6: 카드 C2 — Var X = 2이면 Var(3X + 5) = 18.
"""
from fractions import Fraction
from itertools import product
import random


def var(pmf):
    mu = sum(p * x for x, p in pmf.items())
    return sum(p * (x - mu) ** 2 for x, p in pmf.items())


def main():
    A = {100: Fraction(1)}
    B = {50: Fraction(1, 2), 150: Fraction(1, 2)}
    assert var(A) == 0 and var(B) == 2500
    assert sum(p * x for x, p in B.items()) == 100
    print("[OK] 주장 1: 두 서버")

    rng = random.Random(9)
    for _ in range(200):
        xs = rng.sample(range(-10, 11), 4)
        ps = [Fraction(rng.randint(1, 9)) for _ in xs]
        t = sum(ps)
        pmf = {x: p / t for x, p in zip(xs, ps)}
        mu = sum(p * x for x, p in pmf.items())
        assert var(pmf) == sum(p * x * x for x, p in pmf.items()) - mu * mu
    die = {k: Fraction(1, 6) for k in range(1, 7)}
    assert var(die) == Fraction(35, 12)
    print("[OK] 주장 2: 계산 공식, 주사위 35/12")

    for a, b in ((3, 5), (-2, 7), (0, 4)):
        assert var({a * x + b: p for x, p in die.items()} if a else {b: Fraction(1)}) == a * a * var(die)
    s2 = {}
    for x, y in product(range(1, 7), repeat=2):
        s2[x + y] = s2.get(x + y, 0) + Fraction(1, 36)
    assert var(s2) == Fraction(35, 6) == 2 * var(die)
    assert var({2 * x: p for x, p in die.items()}) == 4 * var(die)
    print("[OK] 주장 3: 성질")

    sigma2 = 35 / 12
    for n in (1, 4, 16, 64):
        means = [sum(rng.randint(1, 6) for _ in range(n)) / n for _ in range(8000)]
        m = sum(means) / len(means)
        v = sum((t - m) ** 2 for t in means) / len(means)
        assert abs(v / (sigma2 / n) - 1) < 0.06
    print("[OK] 주장 4: 평균의 분산 σ²/n")

    data = [1e9 + 4, 1e9 + 7, 1e9 + 13, 1e9 + 16]
    n = len(data)
    naive = sum(x * x for x in data) / n - (sum(data) / n) ** 2
    mean = M2 = 0.0
    for k, x in enumerate(data, 1):
        d = x - mean
        mean += d / k
        M2 += d * (x - mean)
    welford = M2 / n
    assert abs(welford - 22.5) < 1e-6 and abs(naive - 22.5) > 1
    print(f"[OK] 주장 5: 순진한 공식 {naive}, 웰퍼드 {welford}")

    assert 3 * 3 * 2 == 18
    print("[OK] 주장 6: 카드 C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
