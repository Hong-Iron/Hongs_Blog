---
layout: "note"
title: "06_matrix-multiplication_verify.py"
display_title: "06_matrix-multiplication_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/matrix-multiplication/"
parent_title: "행렬 곱셈과 전치"
description: "선형대수학 · 행렬 곱셈과 전치 검증 코드"
permalink: "/studies/linear-algebra/code/06_matrix-multiplication_verify/"
---
{% raw %}
[행렬 곱셈과 전치](/Hongs_Blog/studies/linear-algebra/matrix-multiplication/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""행렬 곱셈과 전치 검증.

문서: 06.행렬 곱셈과 전치 (예시, 정의, 성질, 전치, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — SR = [[0,-2],[1,0]], RS = [[0,-1],[2,0]], (1,0) -> SR: (0,1), RS: (0,2).
주장 2: 무작위 1000개 — (AB)x = A(Bx), AB의 j열 = A·(B의 j열), 결합·분배·단위행렬 (유리수).
주장 3: 교환법칙은 대부분 깨진다(무작위 2×2 정수 행렬 1000쌍 중 AB = BA는 극히 드묾).
주장 4: (AB)^T = B^T A^T, A^T A는 대칭, u·v = u^T v.
주장 5: 예제 — 곱셈 횟수 (AB)x: n³ + n², A(Bx): 2n², n = 1000에서 약 500배.
주장 6: 카드 C1 — AB = [[2,1],[4,3]], BA = [[3,4],[1,2]].
"""
import random
from fractions import Fraction as F


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mv(A, x):
    return [sum(a * b for a, b in zip(row, x)) for row in A]


def T(A):
    return [list(r) for r in zip(*A)]


def main():
    R, S = [[0, -1], [1, 0]], [[2, 0], [0, 1]]
    assert mm(S, R) == [[0, -2], [1, 0]] and mm(R, S) == [[0, -1], [2, 0]]
    assert mv(mm(S, R), [1, 0]) == [0, 1] == mv(S, mv(R, [1, 0]))
    assert mv(mm(R, S), [1, 0]) == [0, 2] == mv(R, mv(S, [1, 0]))
    print("[OK] 주장 1·카드 C2: 예시")

    rng = random.Random(6)
    rm = lambda m, n: [[F(rng.randint(-9, 9), rng.randint(1, 3)) for _ in range(n)] for _ in range(m)]
    for _ in range(1000):
        m, n, p, q = (rng.randint(1, 4) for _ in range(4))
        A, B, C, B2 = rm(m, n), rm(n, p), rm(p, q), rm(n, p)
        x = [F(rng.randint(-9, 9)) for _ in range(p)]
        AB = mm(A, B)
        assert mv(AB, x) == mv(A, mv(B, x))
        for j in range(p):
            assert [row[j] for row in AB] == mv(A, [row[j] for row in B])
        assert mm(AB, C) == mm(A, mm(B, C))
        assert mm(A, [[a + b for a, b in zip(r1, r2)] for r1, r2 in zip(B, B2)]) == \
            [[a + b for a, b in zip(r1, r2)] for r1, r2 in zip(AB, mm(A, B2))]
        I = [[F(int(i == j)) for j in range(n)] for i in range(n)]
        assert mm(A, I) == A and mm(I, B) == B
        assert T(AB) == mm(T(B), T(A))
        AtA = mm(T(A), A)
        assert AtA == T(AtA)
    print("[OK] 주장 2·4·카드 C3: 정의, 성질, 전치")

    same = 0
    for _ in range(1000):
        A = [[rng.randint(-5, 5) for _ in range(2)] for _ in range(2)]
        B = [[rng.randint(-5, 5) for _ in range(2)] for _ in range(2)]
        same += mm(A, B) == mm(B, A)
    assert same < 20
    u, v = [1, 2, 3], [4, -5, 6]
    assert mm([u], T([v]))[0][0] == sum(a * b for a, b in zip(u, v)) == 12
    print(f"[OK] 주장 3: 교환되는 쌍 {same}/1000")

    n = 1000
    c1, c2 = n ** 3 + n ** 2, 2 * n ** 2
    assert 495 < c1 / c2 < 505
    print("[OK] 주장 5: 곱셈 횟수")

    A, B = [[1, 2], [3, 4]], [[0, 1], [1, 0]]
    assert mm(A, B) == [[2, 1], [4, 3]] and mm(B, A) == [[3, 4], [1, 2]]
    print("[OK] 주장 6·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
