---
layout: "note"
title: "30_fourier-series_verify.py"
display_title: "30_fourier-series_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "30"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/fourier-series/"
parent_title: "푸리에 급수"
description: "미분적분학 · 푸리에 급수 검증 코드"
permalink: "/studies/calculus/code/30_fourier-series_verify/"
---
{% raw %}
[푸리에 급수](/Hongs_Blog/studies/calculus/fourier-series/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""푸리에 급수 검증.

문서: 30.푸리에 급수 (예시, 정의, 정리, 예제, 활용, 카드 C1~C3)
주장 1: 직교성 — [-π, π]에서 sin mx, cos nx(0 <= m, n <= 6)의 적분이 0 또는 π(같은 짝), 상수 1의 제곱 적분은 2π.
주장 2: 예시·카드 C1 — 사각파(0 < x < π에서 1, -π < x < 0에서 -1)의 계수: a_k = 0, b_k = 4/(πk)(홀수), 0(짝수).
주장 3: 톱니파 f(x) = x의 계수 b_k = 2(-1)^{k+1}/k, a_k = 0.
주장 4: 수렴 정리 — 사각파 부분합이 x = π/2에서 1로, 뛰는 점 x = 0에서 0(좌우 극한의 평균)으로.
주장 5: 깁스 현상 — 사각파 부분합의 최댓값이 N이 커져도 약 1.179(뛰는 폭 2의 약 9% 초과)로 남는다.
주장 6: 파스발과 바젤 — (1/π)∫x² = 2π²/3 = Σ b_k², 그래서 Σ 1/k² = π²/6(부분합 수렴 확인).
주장 7: 카드 C3 — 톱니파 급수를 x = π/2에 넣은 1 - 1/3 + 1/5 - … = π/4.
주장 8: 최선 근사 — 잘라낸 푸리에 급수는 같은 차수 삼각다항식 중 제곱오차가 가장 작다(계수를 흔들면 오차 증가).
"""
import math
import random

N_GRID = 20000
XS = [-math.pi + (i + 0.5) * 2 * math.pi / N_GRID for i in range(N_GRID)]   # 중점 규칙
DX = 2 * math.pi / N_GRID


def integ(f):
    return sum(f(x) for x in XS) * DX


def square(x):
    return 1.0 if x > 0 else -1.0


def coeffs(f, K):
    vals = [f(x) for x in XS]
    a = [sum(v * math.cos(k * x) for v, x in zip(vals, XS)) * DX / math.pi for k in range(K + 1)]
    b = [sum(v * math.sin(k * x) for v, x in zip(vals, XS)) * DX / math.pi for k in range(K + 1)]
    a[0] /= 2
    return a, b


def partial_square(x, N):
    return 4 / math.pi * sum(math.sin(k * x) / k for k in range(1, N + 1, 2))


def main():
    for m in range(7):
        for n in range(7):
            ss = integ(lambda x: math.sin(m * x) * math.sin(n * x))
            cc = integ(lambda x: math.cos(m * x) * math.cos(n * x))
            sc = integ(lambda x: math.sin(m * x) * math.cos(n * x))
            assert abs(sc) < 1e-9
            assert abs(ss - (math.pi if m == n and m > 0 else 0)) < 1e-9
            assert abs(cc - (math.pi if m == n and m > 0 else (2 * math.pi if m == n == 0 else 0))) < 1e-9
    print("[OK] 주장 1: 직교성")

    a, b = coeffs(square, 9)
    assert all(abs(t) < 1e-9 for t in a)
    for k in range(1, 10):
        want = 4 / (math.pi * k) if k % 2 else 0.0
        assert abs(b[k] - want) < 1e-6
    print("[OK] 주장 2·카드 C1: 사각파 계수")

    a, b = coeffs(lambda x: x, 8)
    assert all(abs(t) < 1e-9 for t in a)
    for k in range(1, 9):
        assert abs(b[k] - 2 * (-1) ** (k + 1) / k) < 1e-6
    print("[OK] 주장 3: 톱니파 계수")

    for N in (11, 101, 1001):
        assert abs(partial_square(0.0, N)) < 1e-15
    errs = [abs(partial_square(math.pi / 2, N) - 1) for N in (11, 101, 1001)]
    assert errs[0] > errs[1] > errs[2] and errs[2] < 1e-3
    print("[OK] 주장 4: 연속점과 뛰는 점에서의 수렴")

    peaks = []
    for N in (51, 201, 801):
        # 첫 봉우리는 x = π/(N+1) 근처
        peaks.append(max(partial_square(j * math.pi / (N + 1) / 200, N) for j in range(1, 600)))
    gibbs = 2 / math.pi * sum(math.sin(t) / t * (math.pi / 100000) for t in [(i + 0.5) * math.pi / 100000 for i in range(100000)])
    assert abs(gibbs - 1.17898) < 1e-4
    assert all(abs(p - gibbs) < 5e-3 for p in peaks)
    assert abs((gibbs - 1) / 2 - 0.0895) < 1e-3
    print(f"[OK] 주장 5: 깁스 봉우리 {[round(p, 4) for p in peaks]} → {gibbs:.5f}")

    lhs = integ(lambda x: x * x) / math.pi
    assert abs(lhs - 2 * math.pi ** 2 / 3) < 1e-6
    s = sum(4 / k ** 2 for k in range(1, 200001))
    assert abs(s - 2 * math.pi ** 2 / 3) < 1e-4
    assert abs(sum(1 / k ** 2 for k in range(1, 200001)) - math.pi ** 2 / 6) < 1e-5
    print("[OK] 주장 6: 파스발 → 바젤")

    val = sum(2 * (-1) ** (k + 1) / k * math.sin(k * math.pi / 2) for k in range(1, 400001))
    assert abs(val - math.pi / 2) < 1e-4
    leib = sum((-1) ** j / (2 * j + 1) for j in range(200000))
    assert abs(leib - math.pi / 4) < 1e-5
    print("[OK] 주장 7·카드 C3: 라이프니츠 급수")

    rng = random.Random(30)
    f = lambda x: x
    a, b = coeffs(f, 5)
    def err(aa, bb):
        return integ(lambda x: (f(x) - aa[0] - sum(aa[k] * math.cos(k * x) + bb[k] * math.sin(k * x) for k in range(1, 6))) ** 2)
    base = err(a, b)
    for _ in range(30):
        aa = [t + rng.uniform(-0.2, 0.2) for t in a]
        bb = [t + rng.uniform(-0.2, 0.2) for t in b]
        assert err(aa, bb) > base
    print("[OK] 주장 8: 최선 제곱 근사")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
