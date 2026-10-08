---
layout: "note"
title: "22_spectral-theorem_verify.py"
display_title: "22_spectral-theorem_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/spectral-theorem/"
parent_title: "대칭행렬과 스펙트럼 정리"
description: "선형대수학 · 대칭행렬과 스펙트럼 정리 검증 코드"
permalink: "/studies/linear-algebra/code/22_spectral-theorem_verify/"
---
{% raw %}
[대칭행렬과 스펙트럼 정리](/Hongs_Blog/studies/linear-algebra/spectral-theorem/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""대칭행렬과 스펙트럼 정리 검증.

문서: 22.대칭행렬과 스펙트럼 정리 (예시, 정리, 역, 증명, 가정, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — [[2,1],[1,2]] = 3 q1q1^T + q2q2^T (유리수), 비대칭 [[1,1],[0,2]]의 고유벡터 (1,0),(1,1) 내적 1.
주장 2: 무작위 대칭 행렬(야코비, n <= 6) — Q^T Q = I, QΛQ^T = S, 각 q q^T가 사영(P² = P, P^T = P).
주장 3: 서로 다른 고윳값의 고유벡터는 수직, 역 — QΛQ^T는 대칭.
주장 4: 가정 — 회전의 고윳값 ±i, [[1,1],[0,1]] 대각화 불가.
주장 5: 예제 — 그래프 라플라시안: 대칭, x^T L x = Σ(x_i - x_j)², dim N(L) = 연결 성분 수(무작위 그래프 300개, 유리수 랭크).
주장 6: 카드 C2 — [[3,1],[1,3]] = 4·(1/2)[[1,1],[1,1]] + 2·(1/2)[[1,-1],[-1,1]].
"""
import math
import random
from fractions import Fraction as F


def jacobi(S, tol=1e-26, sweeps=100):
    n = len(S)
    A = [row[:] for row in S]
    V = [[float(i == j) for j in range(n)] for i in range(n)]
    for _ in range(sweeps):
        if sum(A[i][j] ** 2 for i in range(n) for j in range(n) if i != j) < tol:
            break
        for p in range(n):
            for q in range(p + 1, n):
                if abs(A[p][q]) < 1e-300:
                    continue
                th = 0.5 * math.atan2(2 * A[p][q], A[q][q] - A[p][p])
                c, s = math.cos(th), math.sin(th)
                for k in range(n):
                    A[k][p], A[k][q] = c * A[k][p] - s * A[k][q], s * A[k][p] + c * A[k][q]
                for k in range(n):
                    A[p][k], A[q][k] = c * A[p][k] - s * A[q][k], s * A[p][k] + c * A[q][k]
                for k in range(n):
                    V[k][p], V[k][q] = c * V[k][p] - s * V[k][q], s * V[k][p] + c * V[k][q]
    return [A[i][i] for i in range(n)], V


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


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


def components(n, E):
    parent = list(range(n))

    def f(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for u, v in E:
        parent[f(u)] = f(v)
    return len({f(i) for i in range(n)})


def main():
    P1 = [[F(1, 2), F(1, 2)], [F(1, 2), F(1, 2)]]
    P2 = [[F(1, 2), F(-1, 2)], [F(-1, 2), F(1, 2)]]
    assert [[3 * a + b for a, b in zip(r1, r2)] for r1, r2 in zip(P1, P2)] == [[2, 1], [1, 2]]
    N = [[1, 1], [0, 2]]
    assert [sum(N[i][j] * v[j] for j in range(2)) for i, v in ((0, (1, 0)), (1, (1, 0)))] == [1, 0]
    assert [sum(N[i][j] * v[j] for j in range(2)) for i, v in ((0, (1, 1)), (1, (1, 1)))] == [2, 2]
    assert 1 * 1 + 0 * 1 == 1
    print("[OK] 주장 1·카드 C4·오해: 예시와 비대칭 예")

    rng = random.Random(22)
    for _ in range(200):
        n = rng.randint(2, 6)
        S = [[0.0] * n for _ in range(n)]
        for i in range(n):
            for j in range(i, n):
                S[i][j] = S[j][i] = rng.uniform(-3, 3)
        lam, Q = jacobi(S)
        QtQ = mm([list(r) for r in zip(*Q)], Q)
        assert all(abs(QtQ[i][j] - (i == j)) < 1e-10 for i in range(n) for j in range(n))
        R = mm(mm(Q, [[lam[i] if i == j else 0 for j in range(n)] for i in range(n)]), [list(r) for r in zip(*Q)])
        assert all(abs(R[i][j] - S[i][j]) < 1e-9 for i in range(n) for j in range(n))
        for k in range(n):
            q = [Q[i][k] for i in range(n)]
            Pk = [[q[i] * q[j] for j in range(n)] for i in range(n)]
            P2k = mm(Pk, Pk)
            assert all(abs(P2k[i][j] - Pk[i][j]) < 1e-10 for i in range(n) for j in range(n))
        for a in range(n):
            for b in range(a + 1, n):
                if abs(lam[a] - lam[b]) > 1e-6:
                    assert abs(sum(Q[i][a] * Q[i][b] for i in range(n))) < 1e-9
        Qr = Q
        L2 = [rng.uniform(-3, 3) for _ in range(n)]
        A2 = mm(mm(Qr, [[L2[i] if i == j else 0 for j in range(n)] for i in range(n)]), [list(r) for r in zip(*Qr)])
        assert all(abs(A2[i][j] - A2[j][i]) < 1e-12 for i in range(n) for j in range(n))
    print("[OK] 주장 2·3·카드 C1·C3: Q^T Q = I, 분해, 사영, 수직, 역")

    tr, det = 0, 1
    disc = tr * tr - 4 * det
    assert disc < 0
    assert 2 - rank([[0, 1], [0, 0]]) == 1
    print("[OK] 주장 4: 가정별 반례")

    for _ in range(300):
        n = rng.randint(1, 8)
        E = [(u, v) for u in range(n) for v in range(u + 1, n) if rng.random() < 0.25]
        L = [[F(0)] * n for _ in range(n)]
        for u, v in E:
            L[u][u] += 1
            L[v][v] += 1
            L[u][v] -= 1
            L[v][u] -= 1
        assert all(L[i][j] == L[j][i] for i in range(n) for j in range(n))
        x = [F(rng.randint(-5, 5)) for _ in range(n)]
        quad = sum(x[i] * L[i][j] * x[j] for i in range(n) for j in range(n))
        assert quad == sum((x[u] - x[v]) ** 2 for u, v in E) and quad >= 0
        assert n - rank(L) == components(n, E)
    print("[OK] 주장 5: 라플라시안")

    S = [[F(3), F(1)], [F(1), F(3)]]
    assert [[4 * a + 2 * b for a, b in zip(r1, r2)] for r1, r2 in zip(P1, P2)] == S
    print("[OK] 주장 6·카드 C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
