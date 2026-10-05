---
layout: "note"
title: "13_discrete-distributions-compared_verify.py"
display_title: "13_discrete-distributions-compared_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/discrete-distributions-compared/"
parent_title: "이항·기하·포아송 비교"
description: "확률과 통계 · 이항·기하·포아송 비교 검증 코드"
permalink: "/studies/probability-statistics/code/13_discrete-distributions-compared_verify/"
---
{% raw %}
[이항·기하·포아송 비교](/Hongs_Blog/studies/probability-statistics/discrete-distributions-compared/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이항·기하·포아송 비교 검증.

문서: 13.이항·기하·포아송 비교 (카드 C1~C4, 결정적 차이)
주장 1: 결정적 차이 표의 평균과 분산(각 분포에서 수치로).
주장 2: 카드 C2 — 비밀번호 N개 중 하나: 복원 추측(기하) 평균 N, 비복원 추측(균등 1..N) 평균 (N + 1)/2(N = 1000, 모의실험).
주장 3: 카드 C3 — 하루 평균 2건: 오류가 없을 확률 e^{-2} ≈ 0.135, 5건 이상 ≈ 0.053.
주장 4: 카드 C4 — 1000명 중 오늘 생일인 사람 수: Binomial(1000, 1/365)의 P(0) ≈ 0.0643, 포아송 근사 0.0646.
주장 5: 둘 다 아닐 때 — 몰려 오는(버스트) 도착은 분산 > 평균(과대산포): 포아송 평균을 무작위로 섞으면 분산이 커진다.
"""
from math import comb, exp, factorial
import random


def main():
    n, p, lam = 20, 0.3, 4.0
    b = [comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(n + 1)]
    g = [(1 - p) ** (k - 1) * p for k in range(1, 3000)]
    po = [exp(-lam) * lam ** k / factorial(k) for k in range(100)]
    mv = lambda pm, off: (sum((k + off) * q for k, q in enumerate(pm)),
                          sum((k + off) ** 2 * q for k, q in enumerate(pm)) - sum((k + off) * q for k, q in enumerate(pm)) ** 2)
    mb, vb = mv(b, 0)
    mg, vg = mv(g, 1)
    mp, vp = mv(po, 0)
    assert abs(mb - n * p) < 1e-9 and abs(vb - n * p * (1 - p)) < 1e-9
    assert abs(mg - 1 / p) < 1e-9 and abs(vg - (1 - p) / p ** 2) < 1e-6
    assert abs(mp - lam) < 1e-9 and abs(vp - lam) < 1e-9
    print("[OK] 주장 1: 평균과 분산")

    rng = random.Random(13)
    N = 1000
    with_rep = []
    for _ in range(5000):
        k = 1
        while rng.randrange(N) != 0:
            k += 1
        with_rep.append(k)
    without = [rng.sample(range(N), N).index(0) + 1 for _ in range(3000)]
    assert abs(sum(with_rep) / 5000 / N - 1) < 0.05 and abs(sum(without) / 3000 / ((N + 1) / 2) - 1) < 0.05
    print("[OK] 주장 2: 비밀번호 추측")

    assert abs(exp(-2) - 0.135) < 1e-3
    assert abs(1 - sum(exp(-2) * 2 ** k / factorial(k) for k in range(5)) - 0.053) < 1e-3
    print("[OK] 주장 3: 하루 평균 2건")

    assert abs((364 / 365) ** 1000 - 0.0643) < 1e-4 and abs(exp(-1000 / 365) - 0.0646) < 1e-4
    print("[OK] 주장 4: 오늘 생일")

    def pois(l):
        L, k, pr = exp(-l), 0, 1.0
        while True:
            pr *= rng.random()
            if pr < L:
                return k
            k += 1
    plain = [pois(3.0) for _ in range(30000)]
    mixed = [pois(rng.choice((0.5, 5.5))) for _ in range(30000)]
    def mvar(xs):
        m = sum(xs) / len(xs)
        return m, sum((x - m) ** 2 for x in xs) / len(xs)
    m1, v1 = mvar(plain)
    m2, v2 = mvar(mixed)
    assert abs(v1 / m1 - 1) < 0.05 and v2 / m2 > 2.5
    print(f"[OK] 주장 5: 과대산포(분산/평균 {v1 / m1:.2f} 대 {v2 / m2:.2f})")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
