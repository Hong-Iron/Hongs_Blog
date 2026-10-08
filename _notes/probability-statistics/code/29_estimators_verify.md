---
layout: "note"
title: "29_estimators_verify.py"
display_title: "29_estimators_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "29"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/estimators/"
parent_title: "표본분포와 추정량"
description: "확률과 통계 · 표본분포와 추정량 검증 코드"
permalink: "/studies/probability-statistics/code/29_estimators_verify/"
---
{% raw %}
[표본분포와 추정량](/Hongs_Blog/studies/probability-statistics/estimators/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""표본분포와 추정량 검증.

문서: 29.표본분포와 추정량 (예시, 정의, 증명, 예제, 카드 C1~C3)
주장 1: 예시 — 표본평균의 표본분포: 평균 μ, 분산 σ²/n(주사위 n = 4, 모의실험), 표본마다 값이 다르다.
주장 2: 정리 — MSE = 편향² + 분산(무작위 이산 분포 위의 추정량으로 정확히).
주장 3: 증명 — E[Σ(X_i - X̄)²] = (n - 1)σ²(주사위 n = 2, 3 전수로 분수 확인).
주장 4: 예제·카드 C3 — 정규 자료 n = 5: 불편 표본분산(n-1)의 MSE 2σ⁴/4 = 0.5σ⁴, n으로 나눈 것의 MSE 9/25 = 0.36σ⁴(식과 모의실험).
주장 5: 카드 C1 — 편향 2, 분산 5면 MSE 9.
"""
from fractions import Fraction
from itertools import product
import random


def main():
    rng = random.Random(29)
    means = [sum(rng.randint(1, 6) for _ in range(4)) / 4 for _ in range(100000)]
    m = sum(means) / len(means)
    v = sum((x - m) ** 2 for x in means) / len(means)
    assert abs(m - 3.5) < 0.01 and abs(v - 35 / 12 / 4) < 0.01 and len(set(means)) > 10
    print("[OK] 주장 1: 표본평균의 분포")

    for _ in range(100):
        vals = [Fraction(rng.randint(-5, 5)) for _ in range(4)]
        ps = [Fraction(rng.randint(1, 5)) for _ in vals]
        t = sum(ps)
        ps = [p / t for p in ps]
        theta = Fraction(rng.randint(-3, 3))
        E = sum(p * x for p, x in zip(ps, vals))
        mse = sum(p * (x - theta) ** 2 for p, x in zip(ps, vals))
        var = sum(p * (x - E) ** 2 for p, x in zip(ps, vals))
        assert mse == (E - theta) ** 2 + var
    print("[OK] 주장 2: MSE = 편향² + 분산")

    s2 = Fraction(35, 12)
    for n in (2, 3):
        tot = Fraction(0)
        for w in product(range(1, 7), repeat=n):
            xb = Fraction(sum(w), n)
            tot += sum((x - xb) ** 2 for x in w)
        assert tot / 6 ** n == (n - 1) * s2
    print("[OK] 주장 3: (n - 1)σ²")

    n = 5
    assert Fraction(2, n - 1) == Fraction(1, 2) and Fraction(2 * n - 1, n * n) == Fraction(9, 25)
    un, bi = [], []
    for _ in range(100000):
        xs = [rng.gauss(0, 1) for _ in range(n)]
        xb = sum(xs) / n
        ss = sum((x - xb) ** 2 for x in xs)
        un.append((ss / (n - 1) - 1) ** 2)
        bi.append((ss / n - 1) ** 2)
    assert abs(sum(un) / len(un) - 0.5) < 0.02 and abs(sum(bi) / len(bi) - 0.36) < 0.015
    print("[OK] 주장 4·카드 C3: n - 1과 n의 MSE")

    assert 2 ** 2 + 5 == 9
    print("[OK] 주장 5·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
