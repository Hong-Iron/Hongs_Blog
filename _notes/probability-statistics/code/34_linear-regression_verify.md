---
layout: "note"
title: "34_linear-regression_verify.py"
display_title: "34_linear-regression_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/linear-regression/"
parent_title: "선형회귀"
description: "확률과 통계 · 선형회귀 검증 코드"
permalink: "/studies/probability-statistics/code/34_linear-regression_verify/"
---
{% raw %}
[선형회귀](/Hongs_Blog/studies/probability-statistics/linear-regression/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형회귀 검증.

문서: 34.선형회귀 (예시, 정의, 예제, 카드 C1~C3)
주장 1: 예시·카드 C1 — x = 1..5, y = 2.1, 3.9, 6.2, 7.8, 10.1: 기울기 1.99, 절편 0.05, R² ≈ 0.997, RSS 0.107.
주장 2: 정리 — 정규 잡음에서 로그 가능도의 최댓점 = 최소제곱 해(무작위 자료, 좌표 흔들기), σ̂²(MLE) = RSS/n.
주장 3: 보장 — 모의실험에서 β̂의 평균이 참 β(불편), 분산이 σ²(XᵀX)⁻¹의 대각.
주장 4: 실패 시나리오 — 곡선 관계(y = x²)에 직선을 맞추면 잔차가 U자 모양(양-음-양), 이상치 하나가 기울기를 크게 바꾼다.
주장 5: 카드 C3 — 공통 원인 z가 x와 y를 함께 움직이면, y가 x와 무관해도 x만으로 한 회귀의 R²가 높다.
"""
import math
import random


def ols(xs, ys):
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    b1 = sum((a - mx) * (b - my) for a, b in zip(xs, ys)) / sum((a - mx) ** 2 for a in xs)
    return my - b1 * mx, b1


def main():
    x = [1, 2, 3, 4, 5]
    y = [2.1, 3.9, 6.2, 7.8, 10.1]
    b0, b1 = ols(x, y)
    rss = sum((c - b0 - b1 * a) ** 2 for a, c in zip(x, y))
    tss = sum((c - sum(y) / 5) ** 2 for c in y)
    assert abs(b1 - 1.99) < 1e-9 and abs(b0 - 0.05) < 1e-9 and abs(rss - 0.107) < 1e-9 and abs(1 - rss / tss - 0.9973) < 1e-4
    print("[OK] 주장 1·카드 C1")

    rng = random.Random(34)
    for _ in range(50):
        xs = [rng.uniform(0, 10) for _ in range(20)]
        ys = [1 + 2 * a + rng.gauss(0, 1.5) for a in xs]
        c0, c1 = ols(xs, ys)
        rss = sum((c - c0 - c1 * a) ** 2 for a, c in zip(xs, ys))
        ll = lambda b0_, b1_, s2: -10 * math.log(2 * math.pi * s2) - sum((c - b0_ - b1_ * a) ** 2 for a, c in zip(xs, ys)) / (2 * s2)
        base = ll(c0, c1, rss / 20)
        for _ in range(20):
            assert ll(c0 + rng.uniform(-0.2, 0.2), c1 + rng.uniform(-0.05, 0.05), rss / 20) <= base + 1e-12
            assert ll(c0, c1, rss / 20 * rng.uniform(0.5, 1.5)) <= base + 1e-12
    print("[OK] 주장 2: MLE = 최소제곱, σ̂² = RSS/n")

    xs = [i / 2 for i in range(12)]
    ests = []
    for _ in range(20000):
        ys = [1 + 2 * a + rng.gauss(0, 1) for a in xs]
        ests.append(ols(xs, ys))
    m0 = sum(e[0] for e in ests) / len(ests)
    m1 = sum(e[1] for e in ests) / len(ests)
    v1 = sum((e[1] - m1) ** 2 for e in ests) / len(ests)
    sxx = sum((a - sum(xs) / 12) ** 2 for a in xs)
    assert abs(m0 - 1) < 0.02 and abs(m1 - 2) < 0.005 and abs(v1 / (1 / sxx) - 1) < 0.05
    print("[OK] 주장 3: 불편, 분산 σ²/Sxx")

    xs = [i / 4 for i in range(-8, 9)]
    ys = [a * a for a in xs]
    c0, c1 = ols(xs, ys)
    res = [c - c0 - c1 * a for a, c in zip(xs, ys)]
    assert res[0] > 0 and res[len(res) // 2] < 0 and res[-1] > 0
    xs = list(range(10))
    ys = [2 * a + 1 for a in xs]
    _, s_clean = ols(xs, ys)
    ys[9] = -50
    _, s_out = ols(xs, ys)
    assert s_clean == 2 and s_out < 0
    print("[OK] 주장 4: 잔차의 U자, 이상치")

    zs = [rng.gauss(0, 1) for _ in range(500)]
    xs = [z + rng.gauss(0, 0.3) for z in zs]
    ys = [3 * z + rng.gauss(0, 0.3) for z in zs]
    c0, c1 = ols(xs, ys)
    rss = sum((c - c0 - c1 * a) ** 2 for a, c in zip(xs, ys))
    tss = sum((c - sum(ys) / len(ys)) ** 2 for c in ys)
    assert 1 - rss / tss > 0.85
    print(f"[OK] 주장 5·카드 C3: 공통 원인만으로 R² = {1 - rss / tss:.2f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
