---
layout: "note"
title: "16_sum-integral-bounds_verify.py"
display_title: "16_sum-integral-bounds_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/sum-integral-bounds/"
parent_title: "합 ↔ 적분"
description: "미분적분학 · 합 ↔ 적분 검증 코드"
permalink: "/studies/calculus/code/16_sum-integral-bounds_verify/"
---
{% raw %}
[합 ↔ 적분](/Hongs_Blog/studies/calculus/sum-integral-bounds/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""합 ↔ 적분 검증.

문서: 16.합 ↔ 적분 (비교 표, 대응 관계, 어디까지 같은가, 정리, 끼운 결과, γ, 정렬 하한, 전이 문제, 카드 C1~C3)
주장 1: 비교 표 — H_1000 = 7.485..., ln 1000 = 6.907..., 2^{k+1} - 2^k = 2^k.
주장 2: 하강 거듭제곱 — Δk^(m) = m k^(m-1), Σ_{k=0}^{n-1} k^(m) = n^(m+1)/(m+1) (m <= 4, n <= 30, 정수로 정확히).
         Σ k = n²/2 + n/2, Δk² = 2k + 1, Δ(uv) = u Δv + v_{k+1} Δu (무작위 수열).
주장 3: 정리 — 줄어드는 f(1/x, 1/x², e^{-x})와 늘어나는 f(√x, x², ln x)에서 부등식이 n <= 10^4에서 성립.
주장 4: 표 — ln(n+1) <= H_n <= 1 + ln n, n ln n - n + 1 <= ln n! <= (n+1)ln(n+1) - n, Σk^d의 끼우기(d = 1..4).
주장 5: H_n - ln n이 줄어들고 γ = 0.5772...로 간다. ln(1 + 1/n) > 1/(n+1).
주장 6: lg 1000! ≈ 8530, n lg n - n lg e와의 차가 작다.
주장 7: sin²(πx)는 정수에서 0, ∫_0^n = n/2 (카드 C2).
주장 8: 전이 문제 Σ_{i<=10^6} √i의 끼우기와 실제 값 ≈ 666,667,166.
"""
import math
import random


def falling(k, m):
    r = 1
    for j in range(m):
        r *= k - j
    return r


def simpson(f, a, b, n=20000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    H = [0.0]
    for k in range(1, 10 ** 4 + 1):
        H.append(H[-1] + 1 / k)
    # 표는 소수 셋째 자리까지 버림으로 적었다: 7.485..., 6.907...
    assert math.floor(math.log(1000) * 1000) / 1000 == 6.907 and math.floor(H[1000] * 1000) / 1000 == 7.485
    assert f"{math.log(1000) + 0.5772156649:.4f}" == "7.4850" and f"{H[1000]:.4f}" == "7.4855"
    assert all(2 ** (k + 1) - 2 ** k == 2 ** k for k in range(60))
    print("[OK] 주장 1: 비교 표")

    for m in range(1, 5):
        for k in range(-3, 30):
            assert falling(k + 1, m) - falling(k, m) == m * falling(k, m - 1)
        for n in range(0, 31):
            assert sum(falling(k, m) for k in range(n)) * (m + 1) == falling(n, m + 1)
    for n in range(1, 200):
        assert 2 * sum(range(1, n + 1)) == n * n + n
    assert all((k + 1) ** 2 - k ** 2 == 2 * k + 1 for k in range(100))
    rng = random.Random(16)
    u = [rng.randint(-9, 9) for _ in range(50)]
    v = [rng.randint(-9, 9) for _ in range(50)]
    for k in range(49):
        assert u[k + 1] * v[k + 1] - u[k] * v[k] == u[k] * (v[k + 1] - v[k]) + v[k + 1] * (u[k + 1] - u[k])
    assert sum(falling(k, 2) for k in range(4)) == 8 == falling(4, 3) // 3
    print("[OK] 주장 2·카드 C3: 하강 거듭제곱과 차분 규칙")

    dec = [(lambda x: 1 / x, lambda a, b: math.log(b / a)),
           (lambda x: 1 / x ** 2, lambda a, b: 1 / a - 1 / b),
           (lambda x: math.exp(-x), lambda a, b: math.exp(-a) - math.exp(-b))]
    inc = [(math.sqrt, lambda a, b: 2 / 3 * (b ** 1.5 - a ** 1.5)),
           (lambda x: x * x, lambda a, b: (b ** 3 - a ** 3) / 3),
           (lambda x: math.log(x) if x > 0 else 0.0, lambda a, b: (b * math.log(b) - b) - ((a * math.log(a) - a) if a > 0 else 0.0))]
    for f, I in dec:
        for n in (1, 2, 10, 100, 10 ** 4):
            s = sum(f(k) for k in range(1, n + 1))
            assert I(1, n + 1) <= s + 1e-12 and s <= f(1) + I(1, n) + 1e-12
    for f, I in inc:
        for n in (1, 2, 10, 100, 10 ** 4):
            s = sum(f(k) for k in range(1, n + 1))
            assert I(0, n) <= s + 1e-9 and s <= I(1, n + 1) + 1e-9
    print("[OK] 주장 3: 정리의 부등식")

    for n in (1, 10, 1000, 10 ** 4):
        assert math.log(n + 1) <= H[n] <= 1 + math.log(n)
        lf = math.lgamma(n + 1)
        assert n * math.log(n) - n + 1 <= lf + 1e-9 and lf <= (n + 1) * math.log(n + 1) - n
        for d in range(1, 5):
            s = sum(k ** d for k in range(1, n + 1))
            assert n ** (d + 1) / (d + 1) <= s <= (n + 1) ** (d + 1) / (d + 1)
    print("[OK] 주장 4: 표의 세 끼우기")

    g = [H[n] - math.log(n) for n in range(1, 10 ** 4 + 1)]
    assert all(a > b > 0 for a, b in zip(g, g[1:]))
    assert abs(g[-1] - 0.5772156649) < 1e-4 and all(math.log(1 + 1 / n) > 1 / (n + 1) for n in range(1, 10 ** 4))
    assert abs(H[1000] - (math.log(1000) + 0.5772156649)) < 1e-3
    print(f"[OK] 주장 5·카드 C1: H_n - ln n 감소, n = 10^4에서 {g[-1]:.5f}")

    lg1000f = math.lgamma(1001) / math.log(2)
    approx = 1000 * math.log2(1000) - 1000 * math.log2(math.e)
    assert 8525 < lg1000f < 8535 and abs(lg1000f - approx) < 10
    print(f"[OK] 주장 6: lg 1000! = {lg1000f:.1f}, 근사 {approx:.1f}")

    f = lambda x: math.sin(math.pi * x) ** 2
    assert all(f(k) < 1e-20 for k in range(0, 100))
    for n in (1, 5, 40):
        assert abs(simpson(f, 0, n, 4000 * n) - n / 2) < 1e-9
    print("[OK] 주장 7·카드 C2: sin²(πx)")

    n = 10 ** 6
    s = sum(math.sqrt(i) for i in range(1, n + 1))
    lo, hi = 2 / 3 * n ** 1.5, 2 / 3 * ((n + 1) ** 1.5 - 1)
    assert lo <= s <= hi and abs(s - 666667166) < 2
    assert round(lo) == 666666667 and round(hi) == 666667666
    print(f"[OK] 주장 8: 전이 문제 {lo:.0f} <= {s:.0f} <= {hi:.0f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
