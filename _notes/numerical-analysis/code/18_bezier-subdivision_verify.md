---
layout: "note"
title: "18_bezier-subdivision_verify.py"
display_title: "18_bezier-subdivision_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/bezier-subdivision/"
parent_title: "베지어 곡선의 세분화"
description: "수치해석 · 베지어 곡선의 세분화 검증 코드"
permalink: "/studies/numerical-analysis/code/18_bezier-subdivision_verify/"
---
{% raw %}
[베지어 곡선의 세분화](/Hongs_Blog/studies/numerical-analysis/bezier-subdivision/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""베지어 곡선의 세분화 문서의 주장 검증."""
import math, random
from fractions import Fraction as F


def bez(P, u):
    b = [(1 - u) ** 3, 3 * u * (1 - u) ** 2, 3 * u * u * (1 - u), u ** 3]
    return tuple(sum(bi * p[d] for bi, p in zip(b, P)) for d in range(len(P[0])))


def mid(a, b):
    return tuple((x + y) / 2 for x, y in zip(a, b))


def split(P):
    """슬라이드 p.22의 기하적 방법."""
    p0, p1, p2, p3 = P
    m = mid(p1, p2)
    l1, r2 = mid(p0, p1), mid(p2, p3)
    l2, r1 = mid(l1, m), mid(r2, m)
    l3 = mid(l2, r1)
    return [p0, l1, l2, l3], [l3, r1, r2, p3]


def inv(A):
    n = len(A); M = [[F(x) for x in r] + [F(int(i == j)) for j in range(n)] for i, r in enumerate(A)]
    for c in range(n):
        p = next(r for r in range(c, n) if M[r][c] != 0); M[c], M[p] = M[p], M[c]
        M[c] = [x / M[c][c] for x in M[c]]
        for r in range(n):
            if r != c:
                M[r] = [x - M[r][c] * y for x, y in zip(M[r], M[c])]
    return [r[n:] for r in M]


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def flat_dist(P):
    (x0, y0), (x3, y3) = P[0], P[3]
    L = math.hypot(x3 - x0, y3 - y0)
    return max(abs((x3 - x0) * (y0 - y) - (x0 - x) * (y3 - y0)) / L for x, y in (P[1], P[2]))


def subdivide(P, eps, out):
    if flat_dist(P) < eps:
        out.append(P); return
    L, R = split(P)
    subdivide(L, eps, out); subdivide(R, eps, out)


def main():
    P = [(F(0), F(0)), (F(0), F(4)), (F(4), F(4)), (F(4), F(0))]
    L, R = split(P)
    assert L == [(0, 0), (0, 2), (1, 3), (2, 3)] and R == [(2, 3), (3, 3), (4, 2), (4, 0)]   # 카드 C2
    assert bez(P, F(1, 2)) == (2, 3) == tuple(F(a + 3 * b + 3 * c + d, 8) for a, b, c, d in zip(*P))
    # 왼쪽 반 l(u) = p(u/2), 오른쪽 반 r(u) = p((1 + u)/2)
    random.seed(18)
    for _ in range(100):
        Q = [(F(random.randint(-9, 9)), F(random.randint(-9, 9))) for _ in range(4)]
        Lq, Rq = split(Q)
        for k in range(11):
            u = F(k, 10)
            assert bez(Lq, u) == bez(Q, u / 2) and bez(Rq, u) == bez(Q, (1 + u) / 2)
        # p'(1/2) = (3/4)(−p0 − p1 + p2 + p3), l'(1) = 3(l3 − l2) = p'(1/2)/2
        dp = tuple(F(3, 4) * (-a - b + c + d) for a, b, c, d in zip(*Q))
        assert tuple(3 * (x - y) for x, y in zip(Lq[3], Lq[2])) == tuple(x / 2 for x in dp)
    # 다른 곡선을 베지어로 바꾸는 행렬 (슬라이드 p.25)
    MB = [[1, 0, 0, 0], [-3, 3, 0, 0], [3, -6, 3, 0], [-1, 3, -3, 1]]
    us = [F(0), F(1, 3), F(2, 3), F(1)]
    MI = inv([[1, u, u * u, u ** 3] for u in us])
    MS = [[F(v, 6) for v in r] for r in [[1, 4, 1, 0], [-3, 0, 3, 0], [3, -6, 3, 0], [-1, 3, -3, 1]]]
    assert mm(inv(MB), MI) == [[1, 0, 0, 0], [F(-5, 6), 3, F(-3, 2), F(1, 3)], [F(1, 3), F(-3, 2), 3, F(-5, 6)], [0, 0, 0, 1]]
    assert mm(inv(MB), MS) == [[F(v, 6) for v in r] for r in [[1, 4, 1, 0], [0, 4, 2, 0], [0, 2, 4, 0], [0, 1, 4, 1]]]
    # 평평해질 때까지 나누기: 기준이 작을수록 조각이 많다
    Pf = [(0.0, 0.0), (0.0, 4.0), (4.0, 4.0), (4.0, 0.0)]
    counts = []
    for eps in (1.0, 0.1, 0.01):
        out = []; subdivide(Pf, eps, out); counts.append(len(out))
    assert counts == sorted(counts) and counts[0] < counts[-1]
    print("조각 수", counts)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
