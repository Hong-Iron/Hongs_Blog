---
layout: "note"
title: "12_poisson_verify.py"
display_title: "12_poisson_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/poisson/"
parent_title: "포아송 분포"
description: "확률과 통계 · 포아송 분포 검증 코드"
permalink: "/studies/probability-statistics/code/12_poisson_verify/"
---
{% raw %}
[포아송 분포](/Hongs_Blog/studies/probability-statistics/poisson/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""포아송 분포 검증.

문서: 12.포아송 분포 (예시, 정의, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 정의 — PMF 합 1, 평균 = 분산 = λ(λ = 0.5, 3, 10).
주장 2: 예시·카드 C1 — λ = 3: 표의 P(0..4), P(0) = e^{-3} ≈ 0.0498, P(X >= 6) ≈ 0.0839.
주장 3: 예제 — 용량 계획: P(X > c) < 1%인 가장 작은 c는 8(P(X > 7) ≈ 0.0119, P(X > 8) ≈ 0.0038).
주장 4: 정리 — Binomial(n, λ/n) → Poisson(λ): (1 - λ/n)^n → e^{-λ}, n = 1000·p = 0.003에서 PMF 차이 최대 3.4e-4.
        카드 C2 — Binomial(1000, 0.002)의 P(0) 0.1351 대 e^{-2} 0.1353.
주장 5: 독립인 포아송의 합은 포아송(λ1 + λ2)(합성곱을 직접 계산).
"""
from math import exp, factorial, comb


def P(k, lam):
    return exp(-lam) * lam ** k / factorial(k)


def main():
    for lam in (0.5, 3.0, 10.0):
        ks = range(0, 120)
        pm = [P(k, lam) for k in ks]
        assert abs(sum(pm) - 1) < 1e-12
        mu = sum(k * q for k, q in zip(ks, pm))
        assert abs(mu - lam) < 1e-9 and abs(sum((k - mu) ** 2 * q for k, q in zip(ks, pm)) - lam) < 1e-8
    print("[OK] 주장 1: 합, 평균 = 분산 = λ")

    assert abs(P(0, 3) - 0.0498) < 1e-4
    assert [round(P(k, 3), 3) for k in range(5)] == [0.05, 0.149, 0.224, 0.224, 0.168]   # 예시 표
    assert abs(1 - sum(P(k, 3) for k in range(6)) - 0.0839) < 1e-4
    print("[OK] 주장 2: λ = 3")

    tail = lambda c: 1 - sum(P(k, 3) for k in range(c + 1))
    c = next(c for c in range(30) if tail(c) < 0.01)
    assert c == 8 and abs(tail(7) - 0.0119) < 1e-4 and abs(tail(8) - 0.0038) < 1e-4
    print("[OK] 주장 3: 용량 8")

    assert abs((1 - 3 / 1e6) ** 1e6 - exp(-3)) < 1e-5
    diff = max(abs(comb(1000, k) * 0.003 ** k * 0.997 ** (1000 - k) - P(k, 3)) for k in range(40))
    assert diff < 3.5e-4
    assert abs(0.998 ** 1000 - 0.1351) < 1e-4 and abs(exp(-2) - 0.1353) < 1e-4
    print(f"[OK] 주장 4: 이항의 극한(차이 {diff:.1e}), 카드 C2")

    for l1, l2 in ((1.0, 2.0), (0.3, 4.5)):
        for k in range(15):
            conv = sum(P(j, l1) * P(k - j, l2) for j in range(k + 1))
            assert abs(conv - P(k, l1 + l2)) < 1e-12
    print("[OK] 주장 5: 합의 분포")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
