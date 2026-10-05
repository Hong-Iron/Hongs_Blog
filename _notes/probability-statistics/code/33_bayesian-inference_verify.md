---
layout: "note"
title: "33_bayesian-inference_verify.py"
display_title: "33_bayesian-inference_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "33"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/bayesian-inference/"
parent_title: "베이즈 추론과 MAP"
description: "확률과 통계 · 베이즈 추론과 MAP 검증 코드"
permalink: "/studies/probability-statistics/code/33_bayesian-inference_verify/"
---
{% raw %}
[베이즈 추론과 MAP](/Hongs_Blog/studies/probability-statistics/bayesian-inference/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""베이즈 추론과 MAP 검증.

문서: 33.베이즈 추론과 MAP (예시, 정의, 예제, 카드 C1~C3)
주장 1: 예시 — 동전 3번 모두 앞면: MLE 1, 균등 사전(Beta(1,1))의 사후 평균 4/5, Beta(2,2) 사전의 MAP 4/5.
주장 2: 켤레 — Beta(a, b) 사전 × 이항 가능도 ∝ Beta(a + k, b + n - k)(격자에서 정규화한 사후 밀도와 비교).
        사후 평균 (a+k)/(a+b+n), MAP (a+k-1)/(a+b+n-2).
주장 3: 예제 — 가중치에 정규 사전 N(0, τ²), 잡음 N(0, σ²)이면 MAP = 릿지 해(λ = σ²/τ²), 음의 로그 사후 최솟점과 일치.
주장 4: 데이터가 많아지면 사후 평균이 MLE에 가까워진다(사전의 영향 감소).
주장 5: 카드 C1 — Beta(2, 2) 사전, 10번 중 7번 성공: 사후 Beta(9, 5), 평균 9/14 ≈ 0.643, MAP 8/12 ≈ 0.667.
"""
from fractions import Fraction
import math
import random


def beta_pdf(x, a, b):
    return math.exp((a - 1) * math.log(x) + (b - 1) * math.log(1 - x) - (math.lgamma(a) + math.lgamma(b) - math.lgamma(a + b)))


def main():
    assert Fraction(3, 3) == 1
    assert Fraction(1 + 3, 2 + 3) == Fraction(4, 5) and Fraction(2 + 3 - 1, 4 + 3 - 2) == Fraction(4, 5)
    print("[OK] 주장 1: 1, 4/5, 4/5")

    rng = random.Random(33)
    N = 4000
    grid = [(i + 0.5) / N for i in range(N)]
    for _ in range(20):
        a, b = rng.randint(1, 5), rng.randint(1, 5)
        n = rng.randint(1, 20)
        k = rng.randint(0, n)
        un = [beta_pdf(x, a, b) * x ** k * (1 - x) ** (n - k) for x in grid]
        Z = sum(un) / N
        for i in (N // 7, N // 2, 5 * N // 6):
            assert abs(un[i] / Z - beta_pdf(grid[i], a + k, b + n - k)) < 1e-6 * (1 + beta_pdf(grid[i], a + k, b + n - k))
        mean = sum(x * u for x, u in zip(grid, un)) / N / Z
        assert abs(mean - (a + k) / (a + b + n)) < 1e-6
        if a + k > 1 and b + n - k > 1:
            mode = grid[max(range(N), key=lambda i: un[i])]
            assert abs(mode - (a + k - 1) / (a + b + n - 2)) < 1e-3
    print("[OK] 주장 2: 베타–이항 켤레")

    for _ in range(30):
        m, d = rng.randint(3, 8), rng.randint(1, 3)
        X = [[rng.uniform(-2, 2) for _ in range(d)] for _ in range(m)]
        y = [rng.uniform(-2, 2) for _ in range(m)]
        s2, t2 = rng.uniform(0.2, 2), rng.uniform(0.2, 2)
        lam = s2 / t2
        A = [[sum(X[r][i] * X[r][j] for r in range(m)) + (lam if i == j else 0) for j in range(d)] for i in range(d)]
        bb = [sum(X[r][i] * y[r] for r in range(m)) for i in range(d)]
        M = [A[i][:] + [bb[i]] for i in range(d)]
        for c in range(d):
            piv = max(range(c, d), key=lambda i: abs(M[i][c]))
            M[c], M[piv] = M[piv], M[c]
            for i in range(c + 1, d):
                f = M[i][c] / M[c][c]
                M[i] = [u - f * v for u, v in zip(M[i], M[c])]
        w = [0.0] * d
        for i in range(d - 1, -1, -1):
            w[i] = (M[i][d] - sum(M[i][j] * w[j] for j in range(i + 1, d))) / M[i][i]
        nlp = lambda v: sum((y[r] - sum(X[r][j] * v[j] for j in range(d))) ** 2 for r in range(m)) / (2 * s2) + sum(t * t for t in v) / (2 * t2)
        base = nlp(w)
        for _ in range(30):
            assert nlp([t + rng.uniform(-0.3, 0.3) for t in w]) >= base - 1e-12
    print("[OK] 주장 3: MAP = 릿지")

    p_true = 0.3
    gaps = []
    for n in (10, 100, 10000):
        k = sum(rng.random() < p_true for _ in range(n))
        gaps.append(abs((2 + k) / (4 + n) - k / n))
    assert gaps[0] > gaps[2] and gaps[2] < 1e-3
    print("[OK] 주장 4: 사전의 영향 감소")

    assert Fraction(9, 14) == Fraction(2 + 7, 4 + 10) and Fraction(8, 12) == Fraction(2 + 7 - 1, 4 + 10 - 2)
    print("[OK] 주장 5·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
