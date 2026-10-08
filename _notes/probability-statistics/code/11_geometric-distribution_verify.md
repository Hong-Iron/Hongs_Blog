---
layout: "note"
title: "11_geometric-distribution_verify.py"
display_title: "11_geometric-distribution_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/geometric-distribution/"
parent_title: "기하분포"
description: "확률과 통계 · 기하분포 검증 코드"
permalink: "/studies/probability-statistics/code/11_geometric-distribution_verify/"
---
{% raw %}
[기하분포](/Hongs_Blog/studies/probability-statistics/geometric-distribution/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""기하분포 검증.

문서: 11.기하분포 (예시, 정의, 증명, 예제, 활용, 오해, 카드 C1~C3)
주장 1: 정의 — P(X = k) = (1 - p)^{k-1} p의 합 1, 평균 1/p, 분산 (1 - p)/p²(급수를 충분히 길게 더해).
        실패 수 규약 Y = X - 1의 평균 (1 - p)/p.
주장 2: 무기억성 — P(X > m + n | X > m) = P(X > n)(분수로 정확히), 모의실험.
주장 3: 예시·카드 C1 — 주사위로 6이 나올 때까지: 평균 6, 6번 넘게 걸릴 확률 (5/6)^6 ≈ 0.335.
주장 4: 예제 — 쿠폰 수집: 10종류면 평균 10 H_10 ≈ 29.29(모의실험).
주장 5: 활용 — 재전송 성공 확률 0.8이면 평균 1.25번. 균일 해싱의 실패 탐색 탐사 수 (m+1)/(m-n+1) <= 1/(1 - α),
        α = 0.5에서 2, 0.9에서 10 이하(모의실험).
"""
from fractions import Fraction
import random


def main():
    for p in (0.5, 0.2, 1 / 6, 0.05):
        ks = range(1, 4000)
        pm = [(1 - p) ** (k - 1) * p for k in ks]
        assert abs(sum(pm) - 1) < 1e-12
        mu = sum(k * q for k, q in zip(ks, pm))
        var = sum((k - mu) ** 2 * q for k, q in zip(ks, pm))
        assert abs(mu - 1 / p) < 1e-9 and abs(var - (1 - p) / p ** 2) < 1e-6
        assert abs(sum((k - 1) * q for k, q in zip(ks, pm)) - (1 - p) / p) < 1e-9
    print("[OK] 주장 1: 합, 평균, 분산, 두 규약")

    p = Fraction(1, 6)
    tail = lambda n: (1 - p) ** n
    for m in range(6):
        for n in range(6):
            assert tail(m + n) / tail(m) == tail(n)
    rng = random.Random(11)
    def geo():
        k = 1
        while rng.random() >= 1 / 6:
            k += 1
        return k
    xs = [geo() for _ in range(100000)]
    over3 = [x for x in xs if x > 3]
    assert abs(sum(1 for x in over3 if x > 5) / len(over3) - float(tail(2))) < 0.01
    print("[OK] 주장 2: 무기억성")

    assert abs(sum(xs) / len(xs) - 6) < 0.05 and abs(float(tail(6)) - 0.335) < 1e-3
    print("[OK] 주장 3: 주사위 6")

    H10 = sum(1 / i for i in range(1, 11))
    assert abs(10 * H10 - 29.29) < 1e-2
    tot = 0
    for _ in range(20000):
        seen, c = set(), 0
        while len(seen) < 10:
            seen.add(rng.randrange(10))
            c += 1
        tot += c
    assert abs(tot / 20000 - 10 * H10) < 0.3
    print("[OK] 주장 4: 쿠폰 수집 29.29")

    assert 1 / 0.8 == 1.25
    for m, alpha in ((1000, 0.5), (1000, 0.9)):
        n = int(alpha * m)
        exact = (m + 1) / (m - n + 1)
        assert exact <= 1 / (1 - alpha) + 1e-12
        tot = 0
        for _ in range(4000):
            full = set(rng.sample(range(m), n))
            order = rng.sample(range(m), m)
            probes = 0
            for s in order:
                probes += 1
                if s not in full:
                    break
            tot += probes
        assert abs(tot / 4000 / exact - 1) < 0.08
    print("[OK] 주장 5: 재전송, 균일 해싱")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
