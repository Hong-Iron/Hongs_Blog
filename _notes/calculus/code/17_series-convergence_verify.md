---
layout: "note"
title: "17_series-convergence_verify.py"
display_title: "17_series-convergence_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/series-convergence/"
parent_title: "급수의 수렴"
description: "미분적분학 · 급수의 수렴 검증 코드"
permalink: "/studies/calculus/code/17_series-convergence_verify/"
---
{% raw %}
[급수의 수렴](/Hongs_Blog/studies/calculus/series-convergence/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""급수의 수렴 검증.

문서: 17.급수의 수렴 (예시, 판정법, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 예시 표의 부분합(n = 10, 1000, 10^6)과 극한 π²/6, ln 2로 다가감(실험).
주장 2: 적분 판정의 끼우기 — p = 1, 2, 0.5에서 ∫_1^{n+1} <= S_n <= 1 + ∫_1^n.
주장 3: 예제 Σk²/2^k = 6, Σk/2^k = 2, Σ1/k! = e - 1 (유리수 부분합과 꼬리 한계).
주장 4: 교대급수 오차 |S - S_n| <= b_{n+1} (Σ(-1)^{k+1}/k, n <= 1000).
주장 5: 재배열 1 + 1/3 - 1/2 + 1/5 + 1/7 - 1/4 + ... -> (3/2) ln 2 (실험).
주장 6: 카드 C3 — (k/(k+1))^k -> 1/e, Σ k!/k^k 부분합이 모임. 카드 C2 — 조화급수 묶음이 1/2 이상.
주장 7: 부동소수점 — Σ1/k² (k <= 10^6)를 큰 것부터와 작은 것부터 더하면 끝자리가 다르고, 작은 것부터가 π²/6 - 꼬리에 더 가깝다.
"""
import math
from fractions import Fraction as F


def main():
    t = {10: (2.929, 1.550, 0.6456), 1000: (7.485, 1.6439, 0.6926), 10 ** 6: (14.39, 1.644933, 0.693147)}
    for n, (a, b, c) in t.items():
        h = math.fsum(1 / k for k in range(1, n + 1))
        s2 = math.fsum(1 / k ** 2 for k in range(1, n + 1))
        al = math.fsum((-1) ** (k + 1) / k for k in range(1, n + 1))
        digits = lambda x: len(str(x).split(".")[1])
        assert abs(h - a) < 0.5 * 10 ** -digits(a) + 1e-12
        assert abs(s2 - b) < 0.5 * 10 ** -digits(b) + 1e-12
        assert abs(al - c) < 0.5 * 10 ** -digits(c) + 1e-12
    assert f"{math.pi ** 2 / 6:.6f}" == "1.644934" and f"{math.log(2):.6f}" == "0.693147"
    print("[OK] 주장 1: 예시 표")

    for p in (1, 2, 0.5):
        I = (lambda a, b: math.log(b / a)) if p == 1 else (lambda a, b, p=p: (b ** (1 - p) - a ** (1 - p)) / (1 - p))
        for n in (1, 10, 1000, 10 ** 5):
            s = math.fsum(k ** -p for k in range(1, n + 1))
            assert I(1, n + 1) <= s + 1e-12 and s <= 1 + I(1, n) + 1e-12
    print("[OK] 주장 2: 적분 판정의 끼우기")

    s = sum(F(k * k, 2 ** k) for k in range(1, 200))
    assert 6 - s < F(1, 10 ** 50) and s < 6
    s = sum(F(k, 2 ** k) for k in range(1, 200))
    assert 2 - s == F(201, 2 ** 199)
    s = sum(F(1, math.factorial(k)) for k in range(1, 30))
    assert abs(float(s) - (math.e - 1)) < 1e-15
    print("[OK] 주장 3·예제: 6, 2, e - 1")

    S = math.log(2)
    part = 0.0
    for n in range(1, 1001):
        part += (-1) ** (n + 1) / n
        assert abs(S - part) <= 1 / (n + 1) + 1e-15
    print("[OK] 주장 4: 교대급수 오차 한계")

    total, odd, even = 0.0, 1, 2
    for _ in range(10 ** 6):
        total += 1 / odd + 1 / (odd + 2) - 1 / even
        odd += 4
        even += 2
    assert abs(total - 1.5 * math.log(2)) < 1e-5 and abs(total - math.log(2)) > 0.3
    print(f"[OK] 주장 5: 재배열 합 {total:.6f} ≈ 1.5 ln 2 = {1.5 * math.log(2):.6f}")

    for k in (10, 1000, 10 ** 6):
        assert abs((k / (k + 1)) ** k - 1 / math.e) < 1 / k
    part = [0.0]
    for k in range(1, 60):
        part.append(part[-1] + math.exp(math.lgamma(k + 1) - k * math.log(k)))
    assert abs(part[-1] - part[-10]) < 1e-15
    for j in range(1, 20):
        assert math.fsum(1 / k for k in range(2 ** (j - 1) + 1, 2 ** j + 1)) >= 0.5
    print(f"[OK] 주장 6·카드 C2·C3: Σ k!/k^k ≈ {part[-1]:.6f}, 조화급수 묶음 >= 1/2")

    n = 10 ** 6
    big_first = 0.0
    for k in range(1, n + 1):
        big_first += 1 / (k * k)
    small_first = 0.0
    for k in range(n, 0, -1):
        small_first += 1 / (k * k)
    ref = math.fsum(1 / (k * k) for k in range(1, n + 1))
    assert big_first != small_first and abs(small_first - ref) <= abs(big_first - ref)
    print(f"[OK] 주장 7: 순서에 따른 차이 {abs(big_first - small_first):.2e}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
