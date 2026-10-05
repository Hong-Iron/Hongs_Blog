---
layout: "note"
title: "17_least-squares_verify.py"
display_title: "17_least-squares_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/least-squares/"
parent_title: "최소제곱법"
description: "선형대수학 · 최소제곱법 검증 코드"
permalink: "/studies/linear-algebra/code/17_least-squares_verify/"
---
{% raw %}
[최소제곱법](/Hongs_Blog/studies/linear-algebra/least-squares/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""최소제곱법 검증.

문서: 17.최소제곱법 (예시, 정리, 증명 둘, 예제, 활용, 오해, 카드 C1~C4), 4.연습문제/17.최소제곱 예제 사다리
주장 1: 예시 — (1,2),(2,3),(3,5),(4,6): A^T A = [[4,10],[10,30]], A^T b = (16,47), (C,D) = (0.5, 1.4),
         잔차 (0.1,-0.3,0.3,-0.1), 제곱합 0.2.
주장 2: 예제 — (0,6),(1,0),(2,0): (5,-3), 잔차 (1,-2,1), A^T e = 0, 제곱합 6.
주장 3: 무작위 데이터 300개 — 최소제곱 해의 제곱합 <= 주변 무작위 계수 50개의 제곱합, A^T e = 0, 절편 있으면 잔차 합 0.
주장 4: 미분 관점 — 기울기 2A^T A x - 2A^T b가 x̂에서 0 (유리수), E(x̂ + d) - E(x̂) = |A d|² >= 0.
주장 5: 이상치 — 점 하나를 크게 옮기면 기울기가 크게 바뀐다.
주장 6: 오해 — (0,0),(1,1),(2,1),(3,3): y-on-t, t-on-y, 수직거리(전체 최소제곱) 기울기가 모두 다르다.
주장 7: 활용 — 정규방정식의 조건수 = A 조건수의 제곱(2×2 특잇값을 A^T A의 고윳값으로 계산).
주장 8: 카드 C2 — (7/6, 3/2), 잔차 (-1/6, 1/3, -1/6).
주장 9: 사다리 — P3 (4/5, 2/5) 제곱합 6/5, P4 포물선 1 - t + t² 정확히, 변형 지수 모형 ln y 맞추기.
"""
import math
import random
from fractions import Fraction as F


def fit(ts, ys, deg):
    A = [[F(t) ** k for k in range(deg + 1)] for t in ts]
    n = deg + 1
    AtA = [[sum(A[r][i] * A[r][j] for r in range(len(ts))) for j in range(n)] for i in range(n)]
    Atb = [sum(A[r][i] * F(ys[r]) for r in range(len(ts))) for i in range(n)]
    M = [AtA[i] + [Atb[i]] for i in range(n)]
    for c in range(n):
        p = next(i for i in range(c, n) if M[i][c] != 0)
        M[c], M[p] = M[p], M[c]
        M[c] = [x / M[c][c] for x in M[c]]
        for i in range(n):
            if i != c:
                f = M[i][c]
                M[i] = [a - f * b for a, b in zip(M[i], M[c])]
    x = [M[i][n] for i in range(n)]
    res = [F(ys[r]) - sum(A[r][k] * x[k] for k in range(n)) for r in range(len(ts))]
    return A, AtA, Atb, x, res


def sse(ts, ys, coefs):
    return sum((y - sum(c * t ** k for k, c in enumerate(coefs))) ** 2 for t, y in zip(ts, ys))


def main():
    A, AtA, Atb, x, res = fit([1, 2, 3, 4], [2, 3, 5, 6], 1)
    assert AtA == [[4, 10], [10, 30]] and Atb == [16, 47] and x == [F(1, 2), F(7, 5)]
    assert res == [F(1, 10), F(-3, 10), F(3, 10), F(-1, 10)] and sum(r * r for r in res) == F(1, 5)
    print("[OK] 주장 1: 예시")

    A, AtA, Atb, x, res = fit([0, 1, 2], [6, 0, 0], 1)
    assert x == [5, -3] and res == [1, -2, 1] and sum(r * r for r in res) == 6
    assert [sum(A[r][i] * res[r] for r in range(3)) for i in range(2)] == [0, 0]
    print("[OK] 주장 2: 예제")

    rng = random.Random(17)
    for _ in range(300):
        m = rng.randint(3, 8)
        ts = [rng.randint(-5, 5) for _ in range(m)]
        if len(set(ts)) < 2:
            continue
        ys = [rng.randint(-9, 9) for _ in range(m)]
        A, AtA, Atb, x, res = fit(ts, ys, 1)
        best = sse(ts, ys, x)
        for _ in range(50):
            c = [x[0] + F(rng.randint(-20, 20), 10), x[1] + F(rng.randint(-20, 20), 10)]
            assert sse(ts, ys, c) >= best
        assert [sum(A[r][i] * res[r] for r in range(m)) for i in range(2)] == [0, 0] and sum(res) == 0
        d = [F(rng.randint(-5, 5)), F(rng.randint(-5, 5))]
        grad = [2 * sum(AtA[i][j] * x[j] for j in range(2)) - 2 * Atb[i] for i in range(2)]
        assert grad == [0, 0]
        Ad = [sum(A[r][k] * d[k] for k in range(2)) for r in range(m)]
        assert sse(ts, ys, [x[0] + d[0], x[1] + d[1]]) - best == sum(v * v for v in Ad)
    print("[OK] 주장 3·4·카드 C1·C4: 최솟값, 수직, 잔차 합, 미분 관점")

    ts, ys = [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]
    slope0 = fit(ts, ys, 1)[3][1]
    slope1 = fit(ts, [1, 2, 3, 4, 25], 1)[3][1]
    assert slope0 == 1 and slope1 > 4
    print(f"[OK] 주장 5: 이상치 하나로 기울기 1 -> {float(slope1):.1f}")

    ts, ys = [0, 1, 2, 3], [0, 1, 1, 3]
    b_yt = fit(ts, ys, 1)[3][1]
    b_ty = 1 / fit(ys, ts, 1)[3][1]
    mt, my = sum(ts) / 4, sum(ys) / 4
    sxx = sum((t - mt) ** 2 for t in ts)
    syy = sum((y - my) ** 2 for y in ys)
    sxy = sum((t - mt) * (y - my) for t, y in zip(ts, ys))
    b_tls = (syy - sxx + math.sqrt((syy - sxx) ** 2 + 4 * sxy ** 2)) / (2 * sxy)
    vals = sorted([float(b_yt), float(b_ty), b_tls])
    assert vals[1] - vals[0] > 0.01 and vals[2] - vals[1] > 0.01
    print(f"[OK] 주장 6·카드 C3 방법·오해: 기울기 {float(b_yt):.3f}, {b_tls:.3f}, {float(b_ty):.3f}")

    for _ in range(100):
        a = [[rng.uniform(-3, 3) for _ in range(2)] for _ in range(4)]
        G = [[sum(a[r][i] * a[r][j] for r in range(4)) for j in range(2)] for i in range(2)]
        tr, det = G[0][0] + G[1][1], G[0][0] * G[1][1] - G[0][1] * G[1][0]
        disc = math.sqrt(max(tr * tr - 4 * det, 0))
        l1, l2 = (tr + disc) / 2, (tr - disc) / 2
        if l2 < 1e-9:
            continue
        condA = math.sqrt(l1 / l2)
        condG = l1 / l2
        assert abs(condG - condA ** 2) < 1e-6 * condG
    print("[OK] 주장 7: 조건수 제곱")

    x = fit([0, 1, 2], [1, 3, 4], 1)[3]
    res = fit([0, 1, 2], [1, 3, 4], 1)[4]
    assert x == [F(7, 6), F(3, 2)] and res == [F(-1, 6), F(1, 3), F(-1, 6)]
    print("[OK] 주장 8·카드 C2")

    A, AtA, Atb, x, res = fit([-1, 0, 1, 2], [0, 1, 2, 1], 1)
    assert AtA == [[4, 2], [2, 6]] and Atb == [4, 4] and x == [F(4, 5), F(2, 5)] and sum(r * r for r in res) == F(6, 5)
    assert res == [F(-2, 5), F(1, 5), F(4, 5), F(-3, 5)]
    A, AtA, Atb, x, res = fit([-1, 0, 1, 2], [3, 1, 1, 3], 2)
    assert x == [1, -1, 1] and all(r == 0 for r in res)
    ys = [2, 5.5, 15, 40]
    lx = fit([0, 1, 2, 3], [F(math.log(v)) for v in ys], 1)[3]
    a, b = math.exp(float(lx[0])), float(lx[1])
    assert abs(a - 2.01) < 0.01 and abs(b - 0.999) < 0.001
    print("[OK] 주장 9: 사다리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
