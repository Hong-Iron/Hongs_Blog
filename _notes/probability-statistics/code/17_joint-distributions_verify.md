---
layout: "note"
title: "17_joint-distributions_verify.py"
display_title: "17_joint-distributions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/joint-distributions/"
parent_title: "결합분포와 조건부 기댓값"
description: "확률과 통계 · 결합분포와 조건부 기댓값 검증 코드"
permalink: "/studies/probability-statistics/code/17_joint-distributions_verify/"
---
{% raw %}
[결합분포와 조건부 기댓값](/Hongs_Blog/studies/probability-statistics/joint-distributions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""결합분포와 조건부 기댓값 검증.

문서: 17.결합분포와 조건부 기댓값 (예시, 정의, 증명, 예제, 오해, 카드 C1~C4)
주장 1: 예시·카드 C1·C3 — 표 [[0.4, 0.1], [0.1, 0.4]]: 주변분포 0.5·0.5, P(Y=1 | X=1) = 0.8.
        같은 주변분포의 독립 표 [[0.25, 0.25], [0.25, 0.25]]과 다르다.
주장 2: 연속 — f(x, y) = x + y (단위정사각형): 넓이 1, 주변밀도 x + 1/2, P(X + Y <= 1) = 1/3,
        E[Y | X = x] = (x/2 + 1/3)/(x + 1/2), 그 기댓값이 E[Y] = 7/12.
주장 3: 정리 — 무작위 이산 결합분포 200개에서 아담의 법칙 E[E[Y|X]] = E[Y], 이브의 법칙 Var Y = E[Var(Y|X)] + Var(E[Y|X]).
주장 4: 카드 C2 — 두 주사위: E[합 | 첫째] = 첫째 + 3.5, 그 평균 7.
주장 5: 예제 — 요청 수 N ~ Pois(10), 처리 시간 ~ Exp(평균 0.2) 독립: 총 처리 시간 평균 2, 분산 0.8(모의실험).
"""
from fractions import Fraction
from itertools import product
import math
import random


def simpson(f, a, b, n=400):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    J = {(0, 0): Fraction(4, 10), (0, 1): Fraction(1, 10), (1, 0): Fraction(1, 10), (1, 1): Fraction(4, 10)}
    px = {x: sum(p for (a, b), p in J.items() if a == x) for x in (0, 1)}
    py = {y: sum(p for (a, b), p in J.items() if b == y) for y in (0, 1)}
    assert px == py == {0: Fraction(1, 2), 1: Fraction(1, 2)}
    assert J[(1, 1)] / px[1] == Fraction(4, 5)
    ind = {(a, b): px[a] * py[b] for a, b in J}
    assert all(v == Fraction(1, 4) for v in ind.values()) and ind != J
    print("[OK] 주장 1·카드 C1·C3")

    f = lambda x, y: x + y
    assert abs(simpson(lambda x: simpson(lambda y: f(x, y), 0, 1), 0, 1) - 1) < 1e-12
    for x in (0.2, 0.7):
        assert abs(simpson(lambda y: f(x, y), 0, 1) - (x + 0.5)) < 1e-12
    n = 1500
    s = sum((((i + .5) / n) + ((j + .5) / n)) for i in range(n) for j in range(n) if (i + .5) / n + (j + .5) / n <= 1) / n / n
    assert abs(s - 1 / 3) < 1e-3
    cond = lambda x: simpson(lambda y: y * f(x, y), 0, 1) / (x + 0.5)
    for x in (0.1, 0.5, 0.9):
        assert abs(cond(x) - (x / 2 + 1 / 3) / (x + 0.5)) < 1e-12
    EY = simpson(lambda x: cond(x) * (x + 0.5), 0, 1)
    assert abs(EY - 7 / 12) < 1e-12
    print("[OK] 주장 2: 연속 결합밀도")

    rng = random.Random(17)
    for _ in range(200):
        xs, ys = range(rng.randint(1, 4)), [rng.randint(-3, 3) for _ in range(rng.randint(1, 4))]
        w = {(x, j): Fraction(rng.randint(0, 5)) for x in xs for j in range(len(ys))}
        t = sum(w.values())
        if t == 0:
            continue
        P = {k: v / t for k, v in w.items()}
        EYv = sum(p * ys[j] for (x, j), p in P.items())
        VarY = sum(p * (ys[j] - EYv) ** 2 for (x, j), p in P.items())
        adam, ev, means = Fraction(0), Fraction(0), {}
        for x in xs:
            pxv = sum(p for (a, j), p in P.items() if a == x)
            if pxv == 0:
                continue
            m = sum(p * ys[j] for (a, j), p in P.items() if a == x) / pxv
            v = sum(p * (ys[j] - m) ** 2 for (a, j), p in P.items() if a == x) / pxv
            means[x] = (pxv, m)
            adam += pxv * m
            ev += pxv * v
        vm = sum(pxv * (m - EYv) ** 2 for pxv, m in means.values())
        assert adam == EYv and VarY == ev + vm
    print("[OK] 주장 3: 아담·이브의 법칙")

    omega = list(product(range(1, 7), repeat=2))
    for a in range(1, 7):
        rows = [w for w in omega if w[0] == a]
        assert Fraction(sum(sum(w) for w in rows), 6) == a + Fraction(7, 2)
    assert sum(Fraction(1, 6) * (a + Fraction(7, 2)) for a in range(1, 7)) == 7
    print("[OK] 주장 4·카드 C2")

    def pois(l):
        L, k, pr = math.exp(-l), 0, 1.0
        while True:
            pr *= rng.random()
            if pr < L:
                return k
            k += 1
    tot = []
    for _ in range(100000):
        N = pois(10)
        tot.append(sum(-math.log(1 - rng.random()) * 0.2 for _ in range(N)))
    m = sum(tot) / len(tot)
    v = sum((t - m) ** 2 for t in tot) / len(tot)
    assert abs(m - 2) < 0.02 and abs(v - 0.8) < 0.03
    assert abs(10 * 0.04 + 10 * 0.2 ** 2 - 0.8) < 1e-12
    print("[OK] 주장 5: 총 처리 시간 평균 2, 분산 0.8")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
