---
layout: "note"
title: "32_hypothesis-testing_verify.py"
display_title: "32_hypothesis-testing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/hypothesis-testing/"
parent_title: "가설검정과 p값"
description: "확률과 통계 · 가설검정과 p값 검증 코드"
permalink: "/studies/probability-statistics/code/32_hypothesis-testing_verify/"
---
{% raw %}
[가설검정과 p값](/Hongs_Blog/studies/probability-statistics/hypothesis-testing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""가설검정과 p값 검증.

문서: 32.가설검정과 p값, 4.연습문제/32.가설검정 예제 사다리
주장 1: 예시·예제 — A/B: 1000명 중 100 대 130: 합동 비율 0.115, 표준오차 0.01427, z ≈ 2.10, 양측 p ≈ 0.035.
        순열 검정(모의실험)의 p값도 비슷하다.
주장 2: p값의 뜻 — 귀무가설이 참일 때 p값은 균등분포라, p < 0.05가 약 5%(모의실험 A/A 테스트).
주장 3: 다중 검정 — 독립 검정 20개에서 하나라도 p < 0.05일 확률 1 - 0.95^20 ≈ 0.64(식과 모의실험), 본페로니 0.05/20.
주장 4: 검정력 — 참 전환율 10% 대 13%, 1000명씩이면 α = 0.05에서 검정력 약 0.56(모의실험), 2,000명씩이면 커진다.
주장 5: 사다리 — 동전 100번 60번: 정규 근사(연속성 보정) 양측 0.0574, 정확 0.0569. 지연 z = 2.4, 한쪽 0.0082.
        불량 1000개 중 30개(주장 2%): 정규 근사 0.012, 보정 0.016, 정확 이항 0.021.
"""
from math import comb, erf, sqrt
import random

Phi = lambda z: 0.5 * (1 + erf(z / sqrt(2)))


def ztest(a, b, n):
    p = (a + b) / (2 * n)
    se = sqrt(p * (1 - p) * 2 / n)
    z = (b - a) / n / se
    return p, se, z, 2 * (1 - Phi(abs(z)))


def main():
    p, se, z, pv = ztest(100, 130, 1000)
    assert abs(p - 0.115) < 1e-12 and abs(se - 0.01427) < 1e-5 and abs(z - 2.10) < 0.01 and abs(pv - 0.035) < 0.001
    rng = random.Random(32)
    pool = [1] * 230 + [0] * 1770
    extreme = 0
    for _ in range(4000):
        rng.shuffle(pool)
        d = abs(sum(pool[:1000]) - sum(pool[1000:]))
        extreme += d >= 30
    assert abs(extreme / 4000 - pv) < 0.012
    lo, hi = 0.03 - 1.96 * se, 0.03 + 1.96 * se
    assert abs(lo - 0.002) < 0.0005 and abs(hi - 0.058) < 0.0005   # 차이의 구간 약 0.2%p ~ 5.8%p
    print(f"[OK] 주장 1: A/B z = {z:.3f}, p = {pv:.4f}, 순열 {extreme / 4000:.4f}")

    small = 0
    for _ in range(3000):
        a = sum(rng.random() < 0.1 for _ in range(1000))
        b = sum(rng.random() < 0.1 for _ in range(1000))
        small += ztest(a, b, 1000)[3] < 0.05
    assert abs(small / 3000 - 0.05) < 0.012
    print("[OK] 주장 2: A/A에서 유의 비율 약 5%")

    assert abs(1 - 0.95 ** 20 - 0.64) < 0.005
    fam = sum(1 for _ in range(20000) if any(rng.random() < 0.05 for _ in range(20))) / 20000
    assert abs(fam - 0.6415) < 0.01
    print("[OK] 주장 3: 다중 검정 0.64")

    def power(n, reps=2000):
        hit = 0
        for _ in range(reps):
            a = sum(rng.random() < 0.10 for _ in range(n))
            b = sum(rng.random() < 0.13 for _ in range(n))
            hit += ztest(a, b, n)[3] < 0.05
        return hit / reps
    p1, p2 = power(1000), power(2000)
    assert 0.5 < p1 < 0.62 and p2 > 0.8
    se_alt = sqrt(0.1 * 0.9 / 1000 + 0.13 * 0.87 / 1000)
    theory = 1 - Phi(1.96 - 0.03 / se_alt) + Phi(-1.96 - 0.03 / se_alt)   # 정규 근사 검정력
    assert abs(theory - 0.56) < 0.01
    print(f"[OK] 주장 4: 검정력 {p1:.2f} → {p2:.2f}")

    assert abs(2 * (1 - Phi(1.9)) - 0.0574) < 1e-4
    assert abs(2 * sum(comb(100, k) for k in range(60, 101)) / 2 ** 100 - 0.0569) < 1e-4
    assert abs(1 - Phi(8 / (20 / 6)) - 0.0082) < 1e-4
    sd = sqrt(1000 * 0.02 * 0.98)
    assert abs(1 - Phi(10 / sd) - 0.012) < 1e-3 and abs(1 - Phi(9.5 / sd) - 0.016) < 1e-3
    exact = sum(comb(1000, k) * 0.02 ** k * 0.98 ** (1000 - k) for k in range(30, 1001))
    assert abs(exact - 0.021) < 1e-3
    print("[OK] 주장 5: 예제 사다리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
