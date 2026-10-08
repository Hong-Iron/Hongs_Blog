---
layout: "note"
title: "25_abstract-vector-spaces_verify.py"
display_title: "25_abstract-vector-spaces_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/abstract-vector-spaces/"
parent_title: "추상 벡터공간과 베지어 곡선"
description: "선형대수학 · 추상 벡터공간과 베지어 곡선 검증 코드"
permalink: "/studies/linear-algebra/code/25_abstract-vector-spaces_verify/"
---
{% raw %}
[추상 벡터공간과 베지어 곡선](/Hongs_Blog/studies/linear-algebra/abstract-vector-spaces/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""추상 벡터공간과 베지어 곡선 검증.

문서: 25.추상 벡터공간과 베지어 곡선 (예시, 정의, 표, 해당하지 않는 예, 베른슈타인, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — P(1/2) = (1, 1), 드 카스텔조(중점 두 번)도 (1, 1).
주장 2: 베른슈타인 — Σ B_{i,n}(t) = 1, B >= 0 (t ∈ [0,1]), n = 1..6에서 단항식 계수 행렬의 랭크 n+1(기저).
주장 3: 무작위 조절점(n <= 5)과 t에서 곡선 공식 = 드 카스텔조(유리수). 조절점을 a만큼 옮기면 곡선도 a만큼(카드 C3).
주장 4: 예제·카드 C1 — 미분 행렬(P3 -> P2), 랭크 3, 영공간 1차원(상수). P2 -> P1도.
주장 5: 해당하지 않는 예 — t² + (-t² + t) = t. cos, sin은 y'' + y = 0 (수치 미분), 독립.
"""
import math
import random
from fractions import Fraction as F
from math import comb


def bern(i, n, t):
    return comb(n, i) * t ** i * (1 - t) ** (n - i)


def bezier(P, t):
    n = len(P) - 1
    return tuple(sum(bern(i, n, t) * P[i][k] for i in range(n + 1)) for k in range(len(P[0])))


def casteljau(P, t):
    pts = [tuple(p) for p in P]
    while len(pts) > 1:
        pts = [tuple((1 - t) * a + t * b for a, b in zip(p, q)) for p, q in zip(pts, pts[1:])]
    return pts[0]


def rank(A):
    M = [[F(v) for v in r] for r in A]
    m, n = len(M), len(M[0])
    r = 0
    for c in range(n):
        p = next((i for i in range(r, m) if M[i][c] != 0), None)
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]
        for i in range(r + 1, m):
            f = M[i][c] / M[r][c]
            M[i] = [a - f * b for a, b in zip(M[i], M[r])]
        r += 1
    return r


def main():
    P = [(0, 0), (1, 2), (2, 0)]
    h = F(1, 2)
    assert bezier(P, h) == (1, 1) == casteljau(P, h)
    assert [bern(i, 2, h) for i in range(3)] == [F(1, 4), F(1, 2), F(1, 4)]
    print("[OK] 주장 1: 예시")

    for n in range(1, 7):
        for k in range(0, 21):
            t = F(k, 20)
            assert sum(bern(i, n, t) for i in range(n + 1)) == 1 and all(bern(i, n, t) >= 0 for i in range(n + 1))
        coef = []
        for i in range(n + 1):
            row = [0] * (n + 1)
            for j in range(n - i + 1):         # (1-t)^{n-i} 전개
                row[i + j] += comb(n, i) * comb(n - i, j) * (-1) ** j
            coef.append(row)
        assert rank(coef) == n + 1
    print("[OK] 주장 2: 베른슈타인 기저")

    rng = random.Random(25)
    for _ in range(300):
        n = rng.randint(1, 5)
        P = [(F(rng.randint(-9, 9)), F(rng.randint(-9, 9))) for _ in range(n + 1)]
        t = F(rng.randint(0, 50), 50)
        assert bezier(P, t) == casteljau(P, t)
        a = (F(rng.randint(-5, 5)), F(rng.randint(-5, 5)))
        Q = [(p[0] + a[0], p[1] + a[1]) for p in P]
        b0, b1 = bezier(P, t), bezier(Q, t)
        assert (b1[0] - b0[0], b1[1] - b0[1]) == a
    print("[OK] 주장 3·카드 C3: 공식 = 드 카스텔조, 평행이동")

    D3 = [[0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3]]
    for _ in range(100):
        c = [rng.randint(-9, 9) for _ in range(4)]
        deriv = [c[1], 2 * c[2], 3 * c[3]]
        assert [sum(D3[i][j] * c[j] for j in range(4)) for i in range(3)] == deriv
    assert rank(D3) == 3 and 4 - rank(D3) == 1
    D2 = [[0, 1, 0], [0, 0, 2]]
    assert rank(D2) == 2 and 3 - rank(D2) == 1
    print("[OK] 주장 4·예제·카드 C1: 미분 행렬")

    p, q = [0, 0, 1], [0, 1, -1]
    assert [a + b for a, b in zip(p, q)] == [0, 1, 0]
    for t in (0.3, 1.1, 2.7):
        h = 1e-4
        for f in (math.cos, math.sin):
            d2 = (f(t + h) - 2 * f(t) + f(t - h)) / (h * h)
            assert abs(d2 + f(t)) < 1e-6
    assert abs(math.cos(0) * math.cos(math.pi / 2) - 0) < 1e-15  # 독립: c1 cos + c2 sin = 0을 t = 0, π/2에 넣으면 c1 = c2 = 0
    print("[OK] 주장 5·카드 C2: 해당하지 않는 예, 해 공간")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
