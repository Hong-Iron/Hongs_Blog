---
layout: "note"
title: "05_normal-transform_verify.py"
display_title: "05_normal-transform_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/normal-transform/"
parent_title: "법선 벡터의 변환"
description: "수치해석 · 법선 벡터의 변환 검증 코드"
permalink: "/studies/numerical-analysis/code/05_normal-transform_verify/"
---
{% raw %}
[법선 벡터의 변환](/Hongs_Blog/studies/numerical-analysis/normal-transform/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""법선 벡터의 변환 문서의 주장 검증."""
import math, random
from fractions import Fraction as F


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(len(v))) for i in range(len(A))]


def tr(A):
    return [list(r) for r in zip(*A)]


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def inv(A):
    """가우스-조던, 분수."""
    n = len(A); M = [[F(x) for x in r] + [F(int(i == j)) for j in range(n)] for i, r in enumerate(A)]
    for c in range(n):
        p = next(r for r in range(c, n) if M[r][c] != 0); M[c], M[p] = M[p], M[c]
        M[c] = [x / M[c][c] for x in M[c]]
        for r in range(n):
            if r != c:
                M[r] = [x - M[r][c] * y for x, y in zip(M[r], M[c])]
    return [r[n:] for r in M]


def main():
    # 예시: 선 x + y = 1, 법선 (1, 1), 접선 (1, −1), x 방향으로 2배
    M = [[2, 0], [0, 1]]; n = [1, 1]; t = [1, -1]
    assert dot(n, t) == 0
    assert dot(mv(M, n), mv(M, t)) == 3                       # Mn은 더 이상 수직이 아니다
    G = tr(inv(M)); Gn = mv(G, n)
    assert Gn == [F(1, 2), 1] and dot(Gn, mv(M, t)) == 0      # (M⁻¹)ᵀn은 수직
    # 카드 C2: 전단 [[1, 1], [0, 1]], 법선 (0, 1)
    M = [[1, 1], [0, 1]]
    assert mv(tr(inv(M)), [0, 1]) == [0, 1] and mv(M, [0, 1]) == [1, 1]
    assert dot(mv(tr(inv(M)), [0, 1]), mv(M, [1, 0])) == 0 and dot(mv(M, [0, 1]), mv(M, [1, 0])) != 0
    # 일반: 무작위 가역 3×3 행렬에서 (M⁻¹)ᵀ N ⊥ M T
    random.seed(5)
    for _ in range(200):
        while True:
            M = [[random.randint(-4, 4) for _ in range(3)] for _ in range(3)]
            try:
                Mi = inv(M); break
            except StopIteration:
                pass
        N = [random.randint(-3, 3) for _ in range(3)]
        T1 = [random.randint(-3, 3) for _ in range(3)]
        Tt = [N[1] * T1[2] - N[2] * T1[1], N[2] * T1[0] - N[0] * T1[2], N[0] * T1[1] - N[1] * T1[0]]  # N에 수직
        assert dot(mv(tr(Mi), N), mv(M, Tt)) == 0
        # 평면 L = <N, D> 의 변환: F = [M T; 0 1], L' = (F⁻¹)ᵀ L, D' = D − N·M⁻¹T
        Tv = [random.randint(-3, 3) for _ in range(3)]
        P = [random.randint(-3, 3) for _ in range(3)]; D = -dot(N, P)
        Fm = [M[0] + [Tv[0]], M[1] + [Tv[1]], M[2] + [Tv[2]], [0, 0, 0, 1]]
        Lp = mv(tr(inv(Fm)), N + [D])
        assert Lp[:3] == mv(tr(Mi), N) and Lp[3] == D - dot(N, mv(Mi, Tv))
        for _ in range(3):                                     # 평면 위의 점은 변환 뒤에도 새 평면 위
            k = random.randint(-2, 2)
            X = [P[i] + Tt[i] * k for i in range(3)]
            assert dot(N, X) + D == 0
            FX = mv(Fm, X + [1])
            assert dot(Lp, FX) == 0
    # 직교 행렬이면 (M⁻¹)ᵀ = M
    c, s = math.cos(0.3), math.sin(0.3); Rm = [[c, -s], [s, c]]
    G = tr([[c, s], [-s, c]]); assert all(abs(G[i][j] - Rm[i][j]) < 1e-15 for i in range(2) for j in range(2))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
