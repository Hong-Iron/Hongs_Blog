---
layout: "note"
title: "28_decompositions-compared_verify.py"
display_title: "28_decompositions-compared_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/decompositions-compared/"
parent_title: "LU·QR·고윳값·SVD 비교"
description: "선형대수학 · LU·QR·고윳값·SVD 비교 검증 코드"
permalink: "/studies/linear-algebra/code/28_decompositions-compared_verify/"
---
{% raw %}
[LU·QR·고윳값·SVD 비교](/Hongs_Blog/studies/linear-algebra/decompositions-compared/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""LU·QR·고윳값·SVD 비교 검증.

문서: 28.LU·QR·고윳값·SVD 비교 (어느 쪽일까 C1~C4, 결정적 차이, 둘 다 아닐 때)
주장 1: C1 — n = 1000, 우변 500개: 재사용 2/3 n³ + 500·2n² vs 매번 500·(2/3 n³) 연산 수 비. 작은 행렬로 LU 재사용 풀이가 정확.
주장 2: C2 — 불량 조건 다항식 맞추기(t^0..t^7, 20점)에서 QR 최소제곱의 계수 오차 < 정규방정식(LU식 소거) 오차.
주장 3: C3 — 마르코프 [[0.8,0.3],[0.2,0.7]]: A^k = XΛ^kX^{-1}, 비대칭 [[1,1],[0,1]]에서 σ(A²) ≠ σ(A)².
주장 4: C4 — 3×5 직사각 행렬의 SVD(A^T A 야코비) 재구성, 대칭 양의 정부호에서 고윳값 = 특잇값.
주장 5: 둘 다 아닐 때 — 숄레스키 LL^T 재구성, 곱셈 수 n³/6 대 LU n³/3 (공식 세기, n = 10..200).
"""
import math
import random


def lu_solve_many(A, bs):
    n = len(A)
    U = [r[:] for r in A]
    L = [[0.0] * n for _ in range(n)]
    perm = list(range(n))
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(U[i][k]))
        U[k], U[p] = U[p], U[k]
        L[k], L[p] = L[p], L[k]
        perm[k], perm[p] = perm[p], perm[k]
        for i in range(k + 1, n):
            l = U[i][k] / U[k][k]
            L[i][k] = l
            U[i] = [a - l * b for a, b in zip(U[i], U[k])]
    for i in range(n):
        L[i][i] = 1.0
    out = []
    for b in bs:
        c = [0.0] * n
        for i in range(n):
            c[i] = b[perm[i]] - sum(L[i][j] * c[j] for j in range(i))
        x = [0.0] * n
        for i in range(n - 1, -1, -1):
            x[i] = (c[i] - sum(U[i][j] * x[j] for j in range(i + 1, n))) / U[i][i]
        out.append(x)
    return out


def qr_lstsq(A, b):
    m, n = len(A), len(A[0])
    Q, R = [], [[0.0] * n for _ in range(n)]
    for j in range(n):
        v = [A[i][j] for i in range(m)]
        for i in range(j):
            R[i][j] = sum(Q[i][k] * v[k] for k in range(m))
            v = [v[k] - R[i][j] * Q[i][k] for k in range(m)]
        R[j][j] = math.sqrt(sum(t * t for t in v))
        Q.append([t / R[j][j] for t in v])
    c = [sum(Q[j][i] * b[i] for i in range(m)) for j in range(n)]
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (c[i] - sum(R[i][j] * x[j] for j in range(i + 1, n))) / R[i][i]
    return x


def normal_lstsq(A, b):
    m, n = len(A), len(A[0])
    G = [[sum(A[k][i] * A[k][j] for k in range(m)) for j in range(n)] for i in range(n)]
    g = [sum(A[k][i] * b[k] for k in range(m)) for i in range(n)]
    return lu_solve_many(G, [g])[0]


def jacobi(S, tol=1e-28, sweeps=200):
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


def T(A):
    return [list(r) for r in zip(*A)]


def main():
    n, k = 1000, 500
    reuse, redo = 2 / 3 * n ** 3 + k * 2 * n ** 2, k * 2 / 3 * n ** 3
    assert redo / reuse > 100
    rng = random.Random(28)
    A = [[rng.uniform(-3, 3) for _ in range(6)] for _ in range(6)]
    bs = [[rng.uniform(-3, 3) for _ in range(6)] for _ in range(20)]
    for b, x in zip(bs, lu_solve_many(A, bs)):
        assert all(abs(sum(A[i][j] * x[j] for j in range(6)) - b[i]) < 1e-9 for i in range(6))
    print(f"[OK] 주장 1·C1: 재사용 이득 {redo / reuse:.0f}배")

    ts = [i / 19 for i in range(20)]
    true = [1.0, -2.0, 0.5, 3.0, -1.0, 2.0, -0.5, 1.5]
    Av = [[t ** p for p in range(8)] for t in ts]
    bv = [sum(c * t ** p for p, c in enumerate(true)) for t in ts]
    eq = max(abs(a - b) for a, b in zip(qr_lstsq(Av, bv), true))
    en = max(abs(a - b) for a, b in zip(normal_lstsq(Av, bv), true))
    assert eq < en
    print(f"[OK] 주장 2·C2: QR {eq:.1e} < 정규방정식 {en:.1e}")

    M = [[0.8, 0.3], [0.2, 0.7]]
    X = [[0.6, 1.0], [0.4, -1.0]]
    d = X[0][0] * X[1][1] - X[0][1] * X[1][0]
    Xi = [[X[1][1] / d, -X[0][1] / d], [-X[1][0] / d, X[0][0] / d]]
    Mk = [[1.0, 0.0], [0.0, 1.0]]
    for kk in range(1, 30):
        Mk = mm(Mk, M)
        R = mm(mm(X, [[1.0, 0.0], [0.0, 0.5 ** kk]]), Xi)
        assert all(abs(Mk[i][j] - R[i][j]) < 1e-12 for i in range(2) for j in range(2))
    J = [[1.0, 1.0], [0.0, 1.0]]
    sv = lambda A: sorted(math.sqrt(max(v, 0)) for v in jacobi(mm(T(A), A))[0])
    s1, s2 = sv(J), sv(mm(J, J))
    assert abs(s2[1] - s1[1] ** 2) > 0.1
    print("[OK] 주장 3·C3: 고윳값으로 A^k, SVD는 거듭제곱을 따르지 않음")

    A = [[rng.uniform(-3, 3) for _ in range(5)] for _ in range(3)]
    lam, V = jacobi(mm(T(A), A))
    order = sorted(range(5), key=lambda i: -lam[i])[:3]
    recon = [[0.0] * 5 for _ in range(3)]
    for i in order:
        s = math.sqrt(lam[i])
        v = [V[k][i] for k in range(5)]
        u = [sum(A[r][c] * v[c] for c in range(5)) / s for r in range(3)]
        for r in range(3):
            for c in range(5):
                recon[r][c] += s * u[r] * v[c]
    assert all(abs(recon[r][c] - A[r][c]) < 1e-9 for r in range(3) for c in range(5))
    B = [[rng.uniform(-2, 2) for _ in range(4)] for _ in range(6)]
    S = [[v + (1.0 if i == j else 0) for j, v in enumerate(row)] for i, row in enumerate(mm(T(B), B))]
    ev = sorted(jacobi(S)[0])
    svs = sorted(math.sqrt(v) for v in jacobi(mm(T(S), S))[0])
    assert all(abs(a - b) < 1e-8 for a, b in zip(ev, svs))
    print("[OK] 주장 4·C4: 직사각 SVD, 대칭 양의 정부호에서 고윳값 = 특잇값")

    n = 4
    Lc = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1):
            s = S[i][j] - sum(Lc[i][t] * Lc[j][t] for t in range(j))
            Lc[i][j] = math.sqrt(s) if i == j else s / Lc[j][j]
    RR = mm(Lc, T(Lc))
    assert all(abs(RR[i][j] - S[i][j]) < 1e-9 for i in range(n) for j in range(n))
    for nn in (10, 50, 200):
        chol = sum(j for i in range(nn) for j in range(i + 1))          # L[i][j]마다 내적의 곱셈 j번: 약 n³/6
        lu = sum((nn - k) * (nn - k + 1) for k in range(1, nn + 1))      # 약 n³/3
        assert abs(chol / (nn ** 3 / 6) - 1) < 3.5 / nn and abs(chol / lu - 0.5) < 3.0 / nn
    print("[OK] 주장 5: 숄레스키 재구성, LU의 약 절반")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
