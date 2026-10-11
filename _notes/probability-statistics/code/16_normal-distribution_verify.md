---
layout: "note"
title: "16_normal-distribution_verify.py"
display_title: "16_normal-distribution_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/normal-distribution/"
parent_title: "정규분포"
description: "확률과 통계 · 정규분포 검증 코드"
permalink: "/studies/probability-statistics/code/16_normal-distribution_verify/"
---
{% raw %}
[정규분포](/Hongs_Blog/studies/probability-statistics/normal-distribution/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""정규분포 검증.

문서: 16.정규분포 (예시, 정의, 증명, 예제, 오해, 카드 C1~C4)
주장 1: 정의 — 밀도의 넓이 1(가우스 적분), 평균 μ, 분산 σ²(여러 μ, σ).
주장 2: 68-95-99.7과 1.96: Φ(z) = (1 + erf(z/√2))/2로 0.6827, 0.9545, 0.9973, 0.9500.
주장 3: 성질 — aX + b ~ N(aμ + b, a²σ²), 독립 정규의 합은 정규(모의실험의 평균·분산과 구간 확률).
주장 4: 예제·카드 C2 — 응답 시간 N(200, 20²): P(< 160) = Φ(-2) ≈ 0.0228, 95% 구간 [160.8, 239.2].
        카드 C1 — N(100, 15²)에서 P(> 130) ≈ 0.0228.
주장 5: 카드 C4 — 지수분포 Exp(1)에서 평균 ± 1 SD 안의 확률은 1 - e^{-2} ≈ 0.865(0.68이 아니다).
        오해 — 꼬리가 두꺼운 분포(자유도 3의 t)는 3σ 밖 확률이 정규보다 크다(모의실험).
주장 6: 박스–뮬러 표본의 구간 확률이 Φ와 맞다.
"""
import math
import random


def simpson(f, a, b, n=4000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


Phi = lambda z: 0.5 * (1 + math.erf(z / math.sqrt(2)))


def main():
    for mu, s in ((0, 1), (200, 20), (-3, 0.5)):
        pdf = lambda x: math.exp(-(x - mu) ** 2 / (2 * s * s)) / (s * math.sqrt(2 * math.pi))
        lo, hi = mu - 12 * s, mu + 12 * s
        assert abs(simpson(pdf, lo, hi) - 1) < 1e-10
        m = simpson(lambda x: x * pdf(x), lo, hi)
        v = simpson(lambda x: (x - m) ** 2 * pdf(x), lo, hi)
        assert abs(m - mu) < 1e-8 * (1 + abs(mu)) and abs(v - s * s) < 1e-8 * s * s
        assert abs(simpson(pdf, mu - s, mu + s) - (2 * Phi(1) - 1)) < 1e-10
    print("[OK] 주장 1: 넓이·평균·분산")

    got = [round(2 * Phi(k) - 1, 4) for k in (1, 2, 3)] + [round(2 * Phi(1.96) - 1, 4)]
    assert got == [0.6827, 0.9545, 0.9973, 0.95]
    print("[OK] 주장 2: 68-95-99.7, 1.96")

    rng = random.Random(16)
    zs = [rng.gauss(0, 1) for _ in range(200000)]
    ys = [3 * z - 1 for z in zs]
    m = sum(ys) / len(ys)
    v = sum((y - m) ** 2 for y in ys) / len(ys)
    assert abs(m + 1) < 0.03 and abs(v - 9) < 0.1
    sums = [rng.gauss(1, 2) + rng.gauss(3, 1.5) for _ in range(200000)]
    m = sum(sums) / len(sums)
    v = sum((t - m) ** 2 for t in sums) / len(sums)
    assert abs(m - 4) < 0.03 and abs(v - 6.25) < 0.1
    frac = sum(1 for t in sums if abs(t - 4) < 2.5) / len(sums)
    assert abs(frac - (2 * Phi(1) - 1)) < 0.005
    print("[OK] 주장 3: 선형 변환과 합")

    assert abs(Phi((160 - 200) / 20) - 0.0228) < 1e-4
    assert abs(200 - 1.96 * 20 - 160.8) < 1e-9 and abs(200 + 1.96 * 20 - 239.2) < 1e-9
    assert abs(1 - Phi((130 - 100) / 15) - 0.0228) < 1e-4
    print("[OK] 주장 4: 예제·카드 C1·C2")

    assert abs((1 - math.exp(-2)) - 0.865) < 1e-3
    def t3():
        z = rng.gauss(0, 1)
        chi = sum(rng.gauss(0, 1) ** 2 for _ in range(3))
        return z / math.sqrt(chi / 3)
    ts = [t3() for _ in range(200000)]
    sd = math.sqrt(sum(t * t for t in ts) / len(ts))
    beyond = sum(1 for t in ts if abs(t) > 3 * sd) / len(ts)
    assert beyond > 2 * (1 - (2 * Phi(3) - 1))
    print(f"[OK] 주장 5: 지수분포 0.865, t(3)의 3σ 밖 {beyond:.4f} 대 정규 0.0027")

    bm = []
    for _ in range(100000):
        u1, u2 = 1 - rng.random(), rng.random()
        bm.append(math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2))
    for z in (-1.5, 0.0, 0.7, 2.0):
        assert abs(sum(1 for b in bm if b <= z) / len(bm) - Phi(z)) < 0.005
    print("[OK] 주장 6: 박스–뮬러")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
