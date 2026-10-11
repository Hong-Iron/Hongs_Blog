---
layout: "note"
title: "23_markov-chains_verify.py"
display_title: "23_markov-chains_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/markov-chains/"
parent_title: "마르코프 연쇄"
description: "확률과 통계 · 마르코프 연쇄 검증 코드"
permalink: "/studies/probability-statistics/code/23_markov-chains_verify/"
---
{% raw %}
[마르코프 연쇄](/Hongs_Blog/studies/probability-statistics/markov-chains/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""마르코프 연쇄 검증.

문서: 23.마르코프 연쇄 (예시, 정의, 정리, 예제, 실패 시나리오, 카드 C1~C3)
주장 1: 예시 — 날씨 연쇄 P = [[0.9, 0.1], [0.5, 0.5]]: 비에서 시작하면 (0.5, 0.5), (0.7, 0.3), (0.78, 0.22), ...
        정상분포 (5/6, 1/6), 오차가 매일 0.4배(두 번째 고윳값).
주장 2: 정리 — 무작위 양의 전이행렬(n = 2..6)에서 거듭제곱이 시작점과 무관한 π로 수렴, πP = π, 모의실험의 체류 비율 ≈ π,
        평균 귀환 시간 = 1/π_i(비 → 비 평균 6일, 모의실험).
주장 3: 보장하지 않는 것 — 주기 연쇄 [[0,1],[1,0]]는 분포가 번갈아 수렴하지 않고, 가약 연쇄는 정상분포가 여럿.
주장 4: 카드 C2 — P²의 (비 → 맑음) 성분 0.7.
"""
from fractions import Fraction
import random


def mul(a, P):
    return [sum(a[i] * P[i][j] for i in range(len(a))) for j in range(len(P[0]))]


def matmul(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def stationary(P, iters=5000):
    n = len(P)
    d = [1 / n] * n
    for _ in range(iters):
        d = mul(d, P)
    return d


def main():
    P = [[Fraction(9, 10), Fraction(1, 10)], [Fraction(1, 2), Fraction(1, 2)]]
    d = [Fraction(0), Fraction(1)]
    seq = []
    for _ in range(3):
        d = mul(d, P)
        seq.append(d)
    assert seq == [[Fraction(1, 2), Fraction(1, 2)], [Fraction(7, 10), Fraction(3, 10)], [Fraction(39, 50), Fraction(11, 50)]]
    pi = [Fraction(5, 6), Fraction(1, 6)]
    assert mul(pi, P) == pi
    d = [Fraction(0), Fraction(1)]
    errs = []
    for _ in range(6):
        d = mul(d, P)
        errs.append(abs(d[0] - pi[0]))
    assert all(b / a == Fraction(2, 5) for a, b in zip(errs, errs[1:]))
    print("[OK] 주장 1: 날씨 연쇄")

    rng = random.Random(23)
    for _ in range(100):
        n = rng.randint(2, 6)
        P2 = []
        for _ in range(n):
            row = [rng.random() + 0.01 for _ in range(n)]
            s = sum(row)
            P2.append([x / s for x in row])
        piv = stationary(P2)
        assert all(abs(a - b) < 1e-12 for a, b in zip(mul(piv, P2), piv))
        for start in range(n):
            d = [1.0 if i == start else 0.0 for i in range(n)]
            for _ in range(400):
                d = mul(d, P2)
            assert all(abs(a - b) < 1e-9 for a, b in zip(d, piv))
    Pw = [[0.9, 0.1], [0.5, 0.5]]
    state, rainy, steps = 1, 0, 300000
    returns, last = [], None
    for t in range(steps):
        state = 0 if rng.random() < Pw[state][0] else 1
        if state == 1:
            rainy += 1
            if last is not None:
                returns.append(t - last)
            last = t
    assert abs(rainy / steps - 1 / 6) < 0.005 and abs(sum(returns) / len(returns) - 6) < 0.1
    print("[OK] 주장 2: 수렴, 체류 비율, 귀환 시간")

    flip = [[0, 1], [1, 0]]
    d = [1, 0]
    ds = []
    for _ in range(4):
        d = mul(d, flip)
        ds.append(d)
    assert ds == [[0, 1], [1, 0], [0, 1], [1, 0]] and mul([0.5, 0.5], flip) == [0.5, 0.5]
    red = [[1, 0, 0], [0, 0.5, 0.5], [0, 0.5, 0.5]]
    for cand in ([1, 0, 0], [0, 0.5, 0.5], [0.4, 0.3, 0.3]):
        assert all(abs(a - b) < 1e-12 for a, b in zip(mul(cand, red), cand))
    print("[OK] 주장 3: 주기·가약 연쇄")

    P2 = matmul(P, P)
    assert P2[1][0] == Fraction(7, 10)
    print("[OK] 주장 4: 카드 C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
