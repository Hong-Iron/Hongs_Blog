---
layout: "note"
title: "15_uniform-exponential_verify.py"
display_title: "15_uniform-exponential_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/uniform-exponential/"
parent_title: "균등분포와 지수분포"
description: "확률과 통계 · 균등분포와 지수분포 검증 코드"
permalink: "/studies/probability-statistics/code/15_uniform-exponential_verify/"
---
{% raw %}
[균등분포와 지수분포](/Hongs_Blog/studies/probability-statistics/uniform-exponential/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""균등분포와 지수분포 검증.

문서: 15.균등분포와 지수분포 (예시, 정의, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 균등분포 Unif(a, b)의 평균 (a+b)/2, 분산 (b-a)²/12. 카드 C1 — Unif(0, 10): P(> 7) = 0.3, 분산 100/12.
주장 2: 지수분포 Exp(λ)의 넓이 1, CDF 1 - e^{-λx}, 평균 1/λ, 분산 1/λ², 중앙값 ln 2/λ. 카드 C2 — λ = 3: P(X > 1) = e^{-3}, 중앙값 0.231.
주장 3: 무기억성 P(X > s + t | X > s) = P(X > t)(식과 모의실험).
주장 4: 예제 — 포아송 과정(λ = 3)을 1초씩 나눈 모의실험: 도착 간격의 평균 1/3, 1초 동안 도착 0개의 비율 e^{-3}.
주장 5: 활용 — 역변환 -ln(1 - U)/λ의 표본 CDF가 1 - e^{-λx}와 맞다. 카드 C3 — 독립 지수 셋(각 0.01/시간)의 최솟값은
        Exp(0.03), 평균 33.3시간.
"""
import math
import random


def simpson(f, a, b, n=4000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    for a, b in ((0, 10), (-2, 5)):
        g = lambda x: 1 / (b - a)
        m = simpson(lambda x: x * g(x), a, b)
        v = simpson(lambda x: x * x * g(x), a, b) - m * m
        assert abs(m - (a + b) / 2) < 1e-9 and abs(v - (b - a) ** 2 / 12) < 1e-9
    assert abs(simpson(lambda x: 0.1, 7, 10) - 0.3) < 1e-12 and abs(100 / 12 - 8.333) < 1e-3
    print("[OK] 주장 1·카드 C1: 균등분포")

    for lam in (0.5, 3.0):
        f = lambda x: lam * math.exp(-lam * x)
        top = 60 / lam
        assert abs(simpson(f, 0, top) - 1) < 1e-9
        for x in (0.1, 1.0, 2.5):
            assert abs(simpson(f, 0, x) - (1 - math.exp(-lam * x))) < 1e-9
        m = simpson(lambda x: x * f(x), 0, top)
        v = simpson(lambda x: x * x * f(x), 0, top) - m * m
        assert abs(m - 1 / lam) < 1e-8 and abs(v - 1 / lam ** 2) < 1e-7
        med = math.log(2) / lam
        assert abs(1 - math.exp(-lam * med) - 0.5) < 1e-12
    assert abs(math.exp(-3) - 0.0498) < 1e-4 and abs(math.log(2) / 3 - 0.231) < 1e-3
    print("[OK] 주장 2·카드 C2: 지수분포")

    lam = 0.7
    S = lambda x: math.exp(-lam * x)
    for s in (0.5, 2.0):
        for t in (0.3, 1.7):
            assert abs(S(s + t) / S(s) - S(t)) < 1e-12
    rng = random.Random(15)
    xs = [-math.log(1 - rng.random()) / lam for _ in range(200000)]
    over = [x for x in xs if x > 2.0]
    assert abs(sum(1 for x in over if x > 3.0) / len(over) - S(1.0)) < 0.01
    print("[OK] 주장 3: 무기억성")

    # 1초를 1000조각으로 나눈 베르누이(p = 0.003)로 포아송 과정을 흉내 낸다
    arrivals, seconds = [], 20000
    for step in range(seconds * 1000):
        if rng.random() < 0.003:
            arrivals.append(step / 1000)
    gaps = [b - a for a, b in zip(arrivals, arrivals[1:])]
    assert abs(sum(gaps) / len(gaps) - 1 / 3) < 0.01
    counts = [0] * seconds
    for a in arrivals:
        counts[int(a)] += 1
    assert abs(sum(1 for c in counts if c == 0) / seconds - math.exp(-3)) < 0.005
    print("[OK] 주장 4: 도착 간격과 빈 1초")

    for x in (0.2, 1.0, 3.0):
        assert abs(sum(1 for v in xs if v <= x) / len(xs) - (1 - S(x))) < 0.005
    mins = [min(-math.log(1 - rng.random()) / 0.01 for _ in range(3)) for _ in range(100000)]
    assert abs(sum(mins) / len(mins) - 100 / 3) < 0.5
    assert abs(sum(1 for v in mins if v > 50) / len(mins) - math.exp(-0.03 * 50)) < 0.005
    print("[OK] 주장 5·카드 C3: 역변환, 최솟값")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
