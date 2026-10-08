---
layout: "note"
title: "10_binomial_verify.py"
display_title: "10_binomial_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/binomial/"
parent_title: "베르누이 시행과 이항분포"
description: "확률과 통계 · 베르누이 시행과 이항분포 검증 코드"
permalink: "/studies/probability-statistics/code/10_binomial_verify/"
---
{% raw %}
[베르누이 시행과 이항분포](/Hongs_Blog/studies/probability-statistics/binomial/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""베르누이 시행과 이항분포 검증.

문서: 10.베르누이 시행과 이항분포 (예시, 정의, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 정의 — PMF의 합이 1(이항정리), 평균 np, 분산 np(1 - p): n <= 12, 여러 p에서 정확히(분수).
        지시 확률변수의 합으로 모든 2^n 결과를 세어도 같은 분포.
주장 2: 예시 — 패킷 10개, 손실률 0.1: 손실 없음 0.349, 1개 이하 0.736.
주장 3: 활용 — 통계적 다중화: Binomial(35, 0.1)에서 11명 이상 동시 활동 확률 0.000424, 평균 3.5, 표준편차 1.775.
주장 4: 반례 — 52장에서 5장 비복원 추출의 에이스 수(초기하)는 Binomial(5, 1/13)과 다르다(0장일 확률 0.6588 대 0.6702).
주장 5: 카드 C1 — 공정한 동전 5번 중 앞면 정확히 2번 10/32.
"""
from fractions import Fraction
from itertools import product
from math import comb, sqrt


def main():
    for n in range(1, 13):
        for p in (Fraction(1, 2), Fraction(1, 10), Fraction(3, 7)):
            pmf = [comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(n + 1)]
            assert sum(pmf) == 1
            mu = sum(k * q for k, q in enumerate(pmf))
            assert mu == n * p and sum((k - mu) ** 2 * q for k, q in enumerate(pmf)) == n * p * (1 - p)
    n, p = 6, Fraction(1, 3)
    dist = [Fraction(0)] * (n + 1)
    for w in product((0, 1), repeat=n):
        dist[sum(w)] += p ** sum(w) * (1 - p) ** (n - sum(w))
    assert dist == [comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(n + 1)]
    print("[OK] 주장 1: PMF, 평균, 분산")

    assert abs(0.9 ** 10 - 0.349) < 1e-3 and abs(0.9 ** 10 + 10 * 0.1 * 0.9 ** 9 - 0.736) < 1e-3
    print("[OK] 주장 2: 패킷 손실")

    tail = sum(comb(35, k) * 0.1 ** k * 0.9 ** (35 - k) for k in range(11, 36))
    assert abs(tail - 0.000424) < 1e-6 and abs(sqrt(35 * 0.1 * 0.9) - 1.775) < 1e-3
    print(f"[OK] 주장 3: 통계적 다중화 {tail:.6f}")

    hyper0 = Fraction(comb(48, 5), comb(52, 5))
    bin0 = Fraction(12, 13) ** 5
    assert abs(float(hyper0) - 0.6588) < 1e-4 and abs(float(bin0) - 0.6702) < 1e-4
    print("[OK] 주장 4: 초기하와의 차이")

    assert Fraction(comb(5, 2), 32) == Fraction(10, 32)
    print("[OK] 주장 5: 카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
