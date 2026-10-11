---
layout: "note"
title: "19_multivariate-normal_verify.py"
display_title: "19_multivariate-normal_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/multivariate-normal/"
parent_title: "공분산 행렬과 다변량 정규분포"
description: "확률과 통계 · 공분산 행렬과 다변량 정규분포 검증 코드"
permalink: "/studies/probability-statistics/code/19_multivariate-normal_verify/"
---
{% raw %}
[공분산 행렬과 다변량 정규분포](/Hongs_Blog/studies/probability-statistics/multivariate-normal/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""공분산 행렬과 다변량 정규분포 검증.

문서: 19.공분산 행렬과 다변량 정규분포 (예시, 정의, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — Σ = [[4, 2], [2, 3]]: 고윳값 (7 ± √17)/2 ≈ 5.56, 1.44, 숄레스키 L = [[2, 0], [1, √2]], LLᵀ = Σ.
        X = μ + LZ 표본의 공분산 ≈ Σ.
주장 2: 정의 — 공분산 행렬은 대칭·준정부호(vᵀΣv = Var(vᵀX) >= 0), Cov(AX + b) = AΣAᵀ(무작위 이산 분포로 정확히).
주장 3: 밀도의 넓이 1(2차원 수치 적분), 마할라노비스 거리 제곱 <= 5.991인 타원에 약 95%(모의실험, 1 - e^{-c/2}).
주장 4: 결합 정규에서 공분산 0이면 밀도가 곱으로 나뉜다. 반례 — X ~ N(0, 1), Y = S·X(S = ±1): 둘 다 정규이고 무상관인데 |Y| = |X|라 독립 아님.
주장 5: 카드 C1 — Var(X1 + X2) = [1 1] Σ [1 1]ᵀ = 11.
"""
from fractions import Fraction
import math
import random


def main():
    S = [[4.0, 2.0], [2.0, 3.0]]
    tr, det = 7.0, 8.0
    l1, l2 = (tr + math.sqrt(tr * tr - 4 * det)) / 2, (tr - math.sqrt(tr * tr - 4 * det)) / 2
    assert abs(l1 - (7 + math.sqrt(17)) / 2) < 1e-12 and abs(l1 - 5.56) < 0.01 and abs(l2 - 1.44) < 0.01
    L = [[2.0, 0.0], [1.0, math.sqrt(2)]]
    LLt = [[sum(L[i][k] * L[j][k] for k in range(2)) for j in range(2)] for i in range(2)]
    assert all(abs(LLt[i][j] - S[i][j]) < 1e-12 for i in range(2) for j in range(2))
    rng = random.Random(19)
    mu = [1.0, -2.0]
    pts = []
    for _ in range(200000):
        z = [rng.gauss(0, 1), rng.gauss(0, 1)]
        pts.append([mu[i] + sum(L[i][k] * z[k] for k in range(2)) for i in range(2)])
    m = [sum(p[i] for p in pts) / len(pts) for i in range(2)]
    C = [[sum((p[i] - m[i]) * (p[j] - m[j]) for p in pts) / len(pts) for j in range(2)] for i in range(2)]
    assert all(abs(C[i][j] - S[i][j]) < 0.05 for i in range(2) for j in range(2))
    print("[OK] 주장 1: 고윳값, 숄레스키, 표본 공분산")

    for _ in range(100):
        pts_d = [[rng.randint(-2, 2) for _ in range(3)] for _ in range(4)]
        ps = [Fraction(rng.randint(1, 5)) for _ in pts_d]
        t = sum(ps)
        ps = [p / t for p in ps]
        mean = [sum(p * v[i] for p, v in zip(ps, pts_d)) for i in range(3)]
        Sig = [[sum(p * (v[i] - mean[i]) * (v[j] - mean[j]) for p, v in zip(ps, pts_d)) for j in range(3)] for i in range(3)]
        for _ in range(5):
            vv = [rng.randint(-3, 3) for _ in range(3)]
            assert sum(vv[i] * Sig[i][j] * vv[j] for i in range(3) for j in range(3)) >= 0
        A = [[rng.randint(-2, 2) for _ in range(3)] for _ in range(2)]
        Y = [[sum(A[r][i] * v[i] for i in range(3)) + 5 for r in range(2)] for v in pts_d]
        my = [sum(p * y[r] for p, y in zip(ps, Y)) for r in range(2)]
        CY = [[sum(p * (y[r] - my[r]) * (y[s] - my[s]) for p, y in zip(ps, Y)) for s in range(2)] for r in range(2)]
        ASA = [[sum(A[r][i] * Sig[i][j] * A[s][j] for i in range(3) for j in range(3)) for s in range(2)] for r in range(2)]
        assert CY == ASA
    print("[OK] 주장 2: 준정부호, Cov(AX + b) = AΣAᵀ")

    Sinv = [[3 / 8, -2 / 8], [-2 / 8, 4 / 8]]
    dens = lambda x, y: math.exp(-0.5 * sum(d[i] * Sinv[i][j] * d[j] for i in range(2) for j in range(2) for d in [[x - mu[0], y - mu[1]]])) / (2 * math.pi * math.sqrt(det))
    n, R = 400, 12.0
    h = 2 * R / n
    tot = sum(dens(mu[0] - R + (i + .5) * h, mu[1] - R + (j + .5) * h) for i in range(n) for j in range(n)) * h * h
    assert abs(tot - 1) < 1e-6
    d2 = lambda p: sum((p[i] - mu[i]) * Sinv[i][j] * (p[j] - mu[j]) for i in range(2) for j in range(2))
    inside = sum(1 for p in pts if d2(p) <= 5.991) / len(pts)
    assert abs(inside - 0.95) < 0.003 and abs((1 - math.exp(-5.991 / 2)) - 0.95) < 1e-3
    print("[OK] 주장 3: 넓이 1, 95% 타원")

    Sd = [[4.0, 0.0], [0.0, 3.0]]
    f2 = lambda x, y: math.exp(-0.5 * (x * x / 4 + y * y / 3)) / (2 * math.pi * math.sqrt(12))
    g = lambda x, s2: math.exp(-x * x / (2 * s2)) / math.sqrt(2 * math.pi * s2)
    for x, y in ((0.3, -1.2), (2.0, 0.5)):
        assert abs(f2(x, y) - g(x, 4) * g(y, 3)) < 1e-15
    xs = [rng.gauss(0, 1) for _ in range(100000)]
    ys = [x * rng.choice((-1, 1)) for x in xs]
    cov = sum(a * b for a, b in zip(xs, ys)) / len(xs)
    assert abs(cov) < 0.02
    both_big = sum(1 for a, b in zip(xs, ys) if abs(a) > 1 and abs(b) > 1) / len(xs)
    p_big = sum(1 for a in xs if abs(a) > 1) / len(xs)
    assert abs(both_big - p_big) < 1e-12 and both_big > 1.5 * p_big * p_big
    print("[OK] 주장 4: 결합 정규의 무상관 = 독립, 반례")

    a = [1.0, 1.0]
    assert sum(a[i] * S[i][j] * a[j] for i in range(2) for j in range(2)) == 11
    print("[OK] 주장 5·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
