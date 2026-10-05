---
layout: "note"
title: "20_tail-bounds_verify.py"
display_title: "20_tail-bounds_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/tail-bounds/"
parent_title: "확률 부등식"
description: "확률과 통계 · 확률 부등식 검증 코드"
permalink: "/studies/probability-statistics/code/20_tail-bounds_verify/"
---
{% raw %}
[확률 부등식](/Hongs_Blog/studies/probability-statistics/tail-bounds/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""확률 부등식 검증.

문서: 20.확률 부등식 (예시, 정리, 증명, 예제, 오해, 카드 C1~C4)
주장 1: 정리 — 무작위 비음수·일반 분포에서 마르코프 P(X >= a) <= E[X]/a, 체비쇼프 P(|X - μ| >= kσ) <= 1/k²(분수로 정확히).
주장 2: 빡빡함 — 마르코프는 X = a(확률 μ/a) 아니면 0일 때 등호, 체비쇼프는 세 점 분포에서 등호.
주장 3: 예시·예제 — 공정한 동전 100번에서 앞면 75번 이상: 마르코프 0.667, 체비쇼프 0.04, 체르노프 e^{-25/6} ≈ 0.0155,
        정확값 약 2.8e-7(체르노프는 약 5만 배, 체비쇼프는 10만 배 이상 큼). 다수결 240번의 실패 확률 <= e^{-10}.
주장 4: 체르노프 한계 — 무작위 n, p, δ에서 P(X >= (1+δ)μ) <= exp(-δ²μ/3), P(X <= (1-δ)μ) <= exp(-δ²μ/2)(이항분포 정확값).
주장 5: 가정의 필요성 — 음수가 있으면 마르코프가 깨진다(±1 반반: P(X >= 1) = 1/2 > E[X] = 0),
        독립이 없으면 체르노프가 깨진다(n개가 모두 같은 동전: P(X >= 0.75n) = 1/2).
주장 6: 카드 — C1 평균 100 ms, P(>= 1000) <= 0.1, C2 평균 100·SD 10에서 P(|X-100| >= 30) <= 1/9.
"""
from fractions import Fraction
from math import comb, exp
import random


def main():
    rng = random.Random(20)
    for _ in range(500):
        vals = [rng.randint(0, 20) for _ in range(5)]
        ps = [Fraction(rng.randint(1, 9)) for _ in vals]
        t = sum(ps)
        ps = [p / t for p in ps]
        mu = sum(p * v for p, v in zip(ps, vals))
        var = sum(p * (v - mu) ** 2 for p, v in zip(ps, vals))
        for a in range(1, 25):
            assert sum(p for p, v in zip(ps, vals) if v >= a) <= mu / a
        if var > 0:
            for k in (Fraction(3, 2), 2, 3):
                assert sum(p for p, v in zip(ps, vals) if (v - mu) ** 2 >= k * k * var) <= 1 / (k * k)
    print("[OK] 주장 1: 마르코프·체비쇼프")

    a, mu = 10, Fraction(3)
    dist = {a: mu / a, 0: 1 - mu / a}                  # X = a (확률 μ/a), 아니면 0
    assert sum(p * v for v, p in dist.items()) == mu
    assert sum(p for v, p in dist.items() if v >= a) == mu / a            # 마르코프 등호
    k = 2
    q = Fraction(1, 2 * k * k)
    three = {-k: q, 0: 1 - 2 * q, k: q}                # 평균 0, 분산 1
    m = sum(p * v for v, p in three.items())
    v2 = sum(p * (v - m) ** 2 for v, p in three.items())
    assert m == 0 and v2 == 1
    assert sum(p for v, p in three.items() if abs(v - m) >= k) == Fraction(1, k * k)   # 체비쇼프 등호
    print("[OK] 주장 2: 등호 사례")

    exact = sum(comb(100, j) for j in range(75, 101)) / 2 ** 100
    assert abs(50 / 75 - 0.667) < 1e-3 and 25 / 625 == 0.04
    assert abs(exp(-0.25 * 50 / 3) - 0.0155) < 1e-4 and abs(exact - 2.8e-7) < 0.05e-7
    assert 40000 < exp(-25 / 6) / exact < 70000 and 0.04 / exact > 100000
    assert abs(exp(-240 / 24) - 4.5e-5) < 0.05e-5                     # 예제: 다수결 240번
    maj = sum(comb(240, j) * 0.75 ** j * 0.25 ** (240 - j) for j in range(0, 121))
    assert maj <= exp(-240 / 24)
    print(f"[OK] 주장 3: 동전 100번 (정확값 {exact:.2e}), 다수결 실패 {maj:.1e} <= e^-10")

    for _ in range(300):
        n = rng.randint(10, 200)
        p = rng.uniform(0.05, 0.9)
        mu = n * p
        delta = rng.uniform(0.05, 1.0)
        pm = [comb(n, j) * p ** j * (1 - p) ** (n - j) for j in range(n + 1)]
        up = sum(q for j, q in enumerate(pm) if j >= (1 + delta) * mu)
        lo = sum(q for j, q in enumerate(pm) if j <= (1 - delta) * mu)
        assert up <= exp(-delta * delta * mu / 3) + 1e-12
        assert lo <= exp(-delta * delta * mu / 2) + 1e-12
    print("[OK] 주장 4: 체르노프 한계(이항 300가지)")

    pm1 = {-1: Fraction(1, 2), 1: Fraction(1, 2)}
    EX = sum(p * v for v, p in pm1.items())
    assert sum(p for v, p in pm1.items() if v >= 1) == Fraction(1, 2) > EX / 1 == 0   # 음수가 있으면 마르코프 실패
    n = 100
    same = {0: Fraction(1, 2), n: Fraction(1, 2)}      # 동전 하나를 n번 복사한 합
    mu_s = sum(p * v for v, p in same.items())
    assert mu_s == 50
    assert sum(p for v, p in same.items() if v >= Fraction(3, 2) * mu_s) == Fraction(1, 2) > exp(-0.25 * mu_s / 3)
    print("[OK] 주장 5: 가정의 필요성")

    assert Fraction(100, 1000) == Fraction(1, 10) and Fraction(1, 9) == 1 / Fraction(3) ** 2
    print("[OK] 주장 6: 카드")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
