---
layout: "note"
title: "16_orthogonal-projection_verify.py"
display_title: "16_orthogonal-projection_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/orthogonal-projection/"
parent_title: "직교성과 직교 사영"
description: "선형대수학 · 직교성과 직교 사영 검증 코드"
permalink: "/studies/linear-algebra/code/16_orthogonal-projection_verify/"
---
{% raw %}
[직교성과 직교 사영](/Hongs_Blog/studies/linear-algebra/orthogonal-projection/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""직교성과 직교 사영 검증.

문서: 16.직교성과 직교 사영 (예시, 정의, 정리, 증명, 가정, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — b = (1,1,1), a = (1,2,2): x̂ = 5/9, e = (4/9,-1/9,-1/9) ⊥ a.
주장 2: 예제 — A = [[1,0],[1,1],[1,2]], b = (6,0,0): x̂ = (5,-3), p = (5,2,-1), e = (1,-2,1) ⊥ 열.
주장 3: 무작위 독립 열 A(유리수)에서 P² = P, P^T = P, A^T e = 0, 직선 공식 aa^T/a^Ta와 일치.
주장 4: 가장 가까움 — 무작위 v ∈ C(A)에서 |b - v|² = |b - p|² + |p - v|² >= |b - p|².
주장 5: 직교 여공간 — N(A)의 기저는 행과 수직이고 dim N(A) + rank = n.
주장 6: 가정 — 종속 열 (1,1),(2,2)에서 A^T A의 행렬식 0. 오해·카드 C4 — [[1,1],[0,0]]: P² = P, P^T ≠ P, (0,1) -> (1,0)인데 가장 가까운 점은 (0,0).
주장 7: 카드 C2 — (2,0)을 (1,1)에: p = (1,1), e = (1,-1).
"""
import random
from fractions import Fraction as F


def T(A):
    return [list(r) for r in zip(*A)]


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mv(A, x):
    return [sum(a * b for a, b in zip(r, x)) for r in A]


def inv(A):
    n = len(A)
    M = [[F(v) for v in row] + [F(int(i == j)) for j in range(n)] for i, row in enumerate(A)]
    for c in range(n):
        p = next((i for i in range(c, n) if M[i][c] != 0), None)
        if p is None:
            return None
        M[c], M[p] = M[p], M[c]
        M[c] = [x / M[c][c] for x in M[c]]
        for i in range(n):
            if i != c and M[i][c] != 0:
                f = M[i][c]
                M[i] = [a - f * b for a, b in zip(M[i], M[c])]
    return [row[n:] for row in M]


def dot(u, v):
    return sum(a * b for a, b in zip(u, v))


def main():
    a, b = [1, 2, 2], [1, 1, 1]
    xh = F(dot(a, b), dot(a, a))
    e = [bi - xh * ai for ai, bi in zip(a, b)]
    assert xh == F(5, 9) and e == [F(4, 9), F(-1, 9), F(-1, 9)] and dot(a, e) == 0
    print("[OK] 주장 1: 예시")

    A = [[1, 0], [1, 1], [1, 2]]
    b = [6, 0, 0]
    AtA, Atb = mm(T(A), A), mv(T(A), b)
    assert AtA == [[3, 3], [3, 5]] and Atb == [6, 0]
    xh = mv(inv(AtA), Atb)
    p = mv(A, xh)
    e = [bi - pi for bi, pi in zip(b, p)]
    assert xh == [5, -3] and p == [5, 2, -1] and e == [1, -2, 1] and mv(T(A), e) == [0, 0]
    print("[OK] 주장 2: 예제")

    rng = random.Random(16)
    done = 0
    while done < 300:
        m, n = rng.randint(2, 5), rng.randint(1, 3)
        if n > m:
            continue
        A = [[F(rng.randint(-4, 4)) for _ in range(n)] for _ in range(m)]
        G = inv(mm(T(A), A))
        if G is None:
            continue
        done += 1
        P = mm(A, mm(G, T(A)))
        assert mm(P, P) == P and T(P) == P
        b = [F(rng.randint(-5, 5)) for _ in range(m)]
        p = mv(P, b)
        e = [x - y for x, y in zip(b, p)]
        assert mv(T(A), e) == [0] * n
        for _ in range(5):
            c = [F(rng.randint(-5, 5), rng.randint(1, 3)) for _ in range(n)]
            v = mv(A, c)
            lhs = dot([x - y for x, y in zip(b, v)], [x - y for x, y in zip(b, v)])
            rhs = dot(e, e) + dot([x - y for x, y in zip(p, v)], [x - y for x, y in zip(p, v)])
            assert lhs == rhs and lhs >= dot(e, e)
        if n == 1:
            col = [r[0] for r in A]
            Pl = [[ci * cj / dot(col, col) for cj in col] for ci in col]
            assert Pl == P
    print("[OK] 주장 3·4·카드 C1·C3: P의 성질, 수직, 가장 가까움")

    for _ in range(200):
        m, n = rng.randint(1, 4), rng.randint(2, 5)
        A = [[F(rng.randint(-3, 3)) for _ in range(n)] for _ in range(m)]
        # 영공간 기저(유리수 RREF)
        M = [r[:] for r in A]
        piv, r = [], 0
        for c in range(n):
            pr = next((i for i in range(r, m) if M[i][c] != 0), None)
            if pr is None:
                continue
            M[r], M[pr] = M[pr], M[r]
            M[r] = [x / M[r][c] for x in M[r]]
            for i in range(m):
                if i != r and M[i][c] != 0:
                    f = M[i][c]
                    M[i] = [x - f * y for x, y in zip(M[i], M[r])]
            piv.append(c)
            r += 1
            if r == m:
                break
        null = []
        for fcol in [j for j in range(n) if j not in piv]:
            v = [F(0)] * n
            v[fcol] = F(1)
            for i, c in enumerate(piv):
                v[c] = -M[i][fcol]
            null.append(v)
        assert len(null) + len(piv) == n
        assert all(dot(row, v) == 0 for row in A for v in null)
    print("[OK] 주장 5: 직교 여공간과 차원")

    D = [[1, 2], [1, 2]]
    AtA = mm(T(D), D)
    assert AtA[0][0] * AtA[1][1] - AtA[0][1] * AtA[1][0] == 0
    P = [[1, 1], [0, 0]]
    assert mm(P, P) == P and T(P) != P and mv(P, [0, 1]) == [1, 0]
    assert dot([0, 1], [0, 1]) < dot([-1, 1], [-1, 1])
    print("[OK] 주장 6·오해·카드 C4")

    a, b = [1, 1], [2, 0]
    xh = F(dot(a, b), dot(a, a))
    assert xh == 1 and [xh * x for x in a] == [1, 1] and [bi - xh * ai for ai, bi in zip(a, b)] == [1, -1]
    print("[OK] 주장 7·카드 C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
