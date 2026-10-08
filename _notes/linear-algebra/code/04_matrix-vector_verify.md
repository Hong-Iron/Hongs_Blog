---
layout: "note"
title: "04_matrix-vector_verify.py"
display_title: "04_matrix-vector_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/matrix-vector/"
parent_title: "행렬과 행렬-벡터 곱"
description: "선형대수학 · 행렬과 행렬-벡터 곱 검증 코드"
permalink: "/studies/linear-algebra/code/04_matrix-vector_verify/"
---
{% raw %}
[행렬과 행렬-벡터 곱](/Hongs_Blog/studies/linear-algebra/matrix-vector/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""행렬과 행렬-벡터 곱 검증.

문서: 04.행렬과 행렬-벡터 곱 (예시, 정의, 선형성, 정리, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — [[2,1],[1,3]]·(4,5) = (13, 19), 열 관점과 행 관점이 같다.
주장 2: 무작위 행렬 1000개에서 열 관점 = 행 관점, 선형성 A(cx + dy) = cAx + dAy (유리수 정확).
주장 3: 선형 함수(무작위 행렬로 만든 T)는 열이 T(e_j)인 행렬과 같다. A e_j = a_j.
주장 4: 예제 — Strang 행렬 A·(2, 1, -2) = (2, 12, 2).
주장 5: 오해·카드 C4 — 평행이동은 T(0) ≠ 0, T(2e1) ≠ 2T(e1). 동차 좌표 3×3 행렬로 평행이동.
주장 6: 카드 C1 — (0, 2, 4). 카드 C2의 행렬로 (x, y, z) = 임의 값에서 원래 식과 같다. 카드 C3 — T(x, y) = xT(e1) + yT(e2).
"""
import random
from fractions import Fraction as F


def col_view(A, x):
    m = len(A)
    out = [0] * m
    for j, xj in enumerate(x):
        for i in range(m):
            out[i] += xj * A[i][j]
    return tuple(out)


def row_view(A, x):
    return tuple(sum(a * b for a, b in zip(row, x)) for row in A)


def main():
    A = [[2, 1], [1, 3]]
    assert col_view(A, (4, 5)) == row_view(A, (4, 5)) == (13, 19)
    print("[OK] 주장 1: 예시")

    rng = random.Random(4)
    for _ in range(1000):
        m, n = rng.randint(1, 5), rng.randint(1, 5)
        A = [[F(rng.randint(-9, 9), rng.randint(1, 3)) for _ in range(n)] for _ in range(m)]
        x = [F(rng.randint(-9, 9)) for _ in range(n)]
        y = [F(rng.randint(-9, 9), 2) for _ in range(n)]
        c, d = F(rng.randint(-5, 5)), F(rng.randint(-5, 5), 3)
        assert col_view(A, x) == row_view(A, x)
        lhs = row_view(A, [c * p + d * q for p, q in zip(x, y)])
        rhs = tuple(c * p + d * q for p, q in zip(row_view(A, x), row_view(A, y)))
        assert lhs == rhs
        E = [[F(int(i == j)) for i in range(n)] for j in range(n)]
        T = lambda v, A=A: row_view(A, v)
        B = [[T(E[j])[i] for j in range(n)] for i in range(m)]
        assert B == A and all(T(E[j]) == tuple(A[i][j] for i in range(m)) for j in range(n))
        assert T(x) == row_view(B, x)
    print("[OK] 주장 2·3: 두 관점, 선형성, 선형 함수 = 행렬")

    S = [[1, 2, 1], [3, 8, 1], [0, 4, 1]]
    assert row_view(S, (2, 1, -2)) == (2, 12, 2)
    print("[OK] 주장 4: 예제")

    T = lambda v: (v[0] + 1, v[1])
    assert T((0, 0)) != (0, 0) and T((2, 0)) == (3, 0) and tuple(2 * p for p in T((1, 0))) == (4, 0)
    H = [[1, 0, 1], [0, 1, 0], [0, 0, 1]]
    for _ in range(100):
        v = (rng.randint(-9, 9), rng.randint(-9, 9))
        assert row_view(H, (v[0], v[1], 1)) == (v[0] + 1, v[1], 1)
    print("[OK] 주장 5·오해·카드 C4: 평행이동과 동차 좌표")

    C1 = [[1, 2], [3, 4], [5, 6]]
    assert col_view(C1, (2, -1)) == (0, 2, 4)
    C2 = [[1, -1, 0], [2, 0, 1], [0, 1, 3]]
    for _ in range(100):
        x, y, z = (rng.randint(-9, 9) for _ in range(3))
        assert row_view(C2, (x, y, z)) == (x - y, 2 * x + z, y + 3 * z)
    C3 = [[2, -1], [1, 3]]
    for _ in range(100):
        x, y = rng.randint(-9, 9), rng.randint(-9, 9)
        assert row_view(C3, (x, y)) == tuple(x * p + y * q for p, q in zip((2, 1), (-1, 3)))
    print("[OK] 주장 6·카드 C1·C2·C3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
