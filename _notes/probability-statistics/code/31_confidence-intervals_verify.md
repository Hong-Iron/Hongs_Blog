---
layout: "note"
title: "31_confidence-intervals_verify.py"
display_title: "31_confidence-intervals_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/confidence-intervals/"
parent_title: "신뢰구간"
description: "확률과 통계 · 신뢰구간 검증 코드"
permalink: "/studies/probability-statistics/code/31_confidence-intervals_verify/"
---
{% raw %}
[신뢰구간](/Hongs_Blog/studies/probability-statistics/confidence-intervals/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""신뢰구간 검증.

문서: 31.신뢰구간 (예시, 정의, 예제, 오해, 카드 C1~C3)
주장 1: 예시 — 정규 모집단에서 X̄ ± 1.96σ/√n 구간 1,000개 중 약 95%가 참 평균을 담는다(모의실험).
주장 2: 예제 — 벤치마크 25회, 평균 120, 표준편차 10: 정규 근사 [116.1, 123.9], t(24)의 97.5% 분위수 ≈ 2.064로 [115.9, 124.1].
        t 구간은 작은 n에서 정규 구간보다 적중률이 정확하다(n = 5 모의실험).
주장 3: 폭은 1/√n: 표본 4배면 폭 절반.
주장 4: 카드 C1 — 400명 중 80명 클릭: [0.161, 0.239]. 카드 C3 — σ = 10, 폭 ±1(95%)에 n = 385.
"""
import math
import random

Phi = lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2)))


def t_pdf(t, nu):
    c = math.exp(math.lgamma((nu + 1) / 2) - math.lgamma(nu / 2)) / math.sqrt(nu * math.pi)
    return c * (1 + t * t / nu) ** (-(nu + 1) / 2)


def t_cdf(t, nu, n=4000):
    h = t / n
    s = t_pdf(0, nu) + t_pdf(t, nu) + 4 * sum(t_pdf((2 * i - 1) * h, nu) for i in range(1, n // 2 + 1)) + 2 * sum(t_pdf(2 * i * h, nu) for i in range(1, n // 2))
    return 0.5 + s * h / 3


def t_quantile(p, nu):
    lo, hi = 0.0, 50.0
    for _ in range(80):
        mid = (lo + hi) / 2
        if t_cdf(mid, nu) < p:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def main():
    rng = random.Random(31)
    cover = 0
    for _ in range(1000):
        xs = [rng.gauss(50, 8) for _ in range(30)]
        m = sum(xs) / 30
        cover += abs(m - 50) <= 1.96 * 8 / math.sqrt(30)
    assert abs(cover / 1000 - 0.95) < 0.02
    print("[OK] 주장 1: 적중률 95%")

    se = 10 / 5
    assert abs(120 - 1.96 * se - 116.08) < 1e-9 and abs(120 + 1.96 * se - 123.92) < 1e-9
    t24 = t_quantile(0.975, 24)
    assert abs(t24 - 2.064) < 1e-3
    assert abs(120 - t24 * se - 115.87) < 0.01 and abs(120 + t24 * se - 124.13) < 0.01
    t4 = t_quantile(0.975, 4)
    cz = ct = 0
    for _ in range(20000):
        xs = [rng.gauss(0, 1) for _ in range(5)]
        m = sum(xs) / 5
        s = math.sqrt(sum((x - m) ** 2 for x in xs) / 4)
        cz += abs(m) <= 1.96 * s / math.sqrt(5)
        ct += abs(m) <= t4 * s / math.sqrt(5)
    assert abs(ct / 20000 - 0.95) < 0.01 and abs(cz / 20000 - 0.88) < 0.01 and abs(t4 - 2.776) < 1e-3
    print(f"[OK] 주장 2: t(24) = {t24:.4f}, n = 5 적중률 정규 {cz / 20000:.3f} 대 t {ct / 20000:.3f}")

    assert abs((1.96 * 10 / math.sqrt(400)) / (1.96 * 10 / math.sqrt(100)) - 0.5) < 1e-12
    print("[OK] 주장 3: 폭 1/√n")

    p = 80 / 400
    half = 1.96 * math.sqrt(p * (1 - p) / 400)
    assert abs(half - 0.0392) < 1e-4 and abs(p - half - 0.161) < 1e-3 and abs(p + half - 0.239) < 1e-3
    assert math.ceil((1.96 * 10 / 1) ** 2) == 385
    print("[OK] 주장 4: 카드 C1·C3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
