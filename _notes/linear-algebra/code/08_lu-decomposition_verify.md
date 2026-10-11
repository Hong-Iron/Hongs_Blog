---
layout: "note"
title: "08_lu-decomposition_verify.py"
display_title: "08_lu-decomposition_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/lu-decomposition/"
parent_title: "LU 분해"
description: "선형대수학 · LU 분해 검증 코드"
permalink: "/studies/linear-algebra/code/08_lu-decomposition_verify/"
---
{% raw %}
[LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""LU 분해 검증.

문서: 08.LU 분해 (예시, 알고리즘, 정리, 증명, 비용, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — 곱수 3, 0, 2가 L에 제자리로, LU = A, c = (2, 6, -10), x = (2, 1, -2) (유리수로 정확히).
주장 2: 정리 — 행 바꾸기 없는 무작위 행렬 300개에서 기본 행렬 역의 곱 = 곱수를 제자리에 놓은 L.
주장 3: 예제 — [[0,1],[1,1]]은 행 바꾸기 없이 LU 불가(첫 피벗 0), P를 쓰면 L = I, U = PA, x = (2, 1).
주장 4: 무작위 부동소수점 행렬에서 PA = LU, 곱수 |ℓ| <= 1, 풀이 잔차가 작다.
주장 5: 비용 — 분해 곱셈 수 ≈ n³/3, 풀이 ≈ n², 우변 100개에서 분해 재사용이 약 100배 싸다.
주장 6: 활용 — det A = (-1)^{바꾼 횟수} × U 대각의 곱(유리수 전개와 비교).
주장 7: 카드 C1 — [[2,1],[6,8]] -> L = [[1,0],[3,1]], U = [[2,1],[0,5]].
"""
import random
from fractions import Fraction as F
from itertools import permutations


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def lu_exact(A):
    n = len(A)
    U = [[F(v) for v in row] for row in A]
    L = [[F(int(i == j)) for j in range(n)] for i in range(n)]
    Es = []
    for k in range(n):
        if U[k][k] == 0:
            return None
        for i in range(k + 1, n):
            l = U[i][k] / U[k][k]
            L[i][k] = l
            U[i] = [a - l * b for a, b in zip(U[i], U[k])]
            E_inv = [[F(int(r == c)) for c in range(n)] for r in range(n)]
            E_inv[i][k] = l
            Es.append(E_inv)
    return L, U, Es


def lu_float(A):
    n = len(A)
    U = [list(map(float, r)) for r in A]
    L = [[0.0] * n for _ in range(n)]
    perm, swaps = list(range(n)), 0
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(U[i][k]))
        if p != k:
            U[k], U[p] = U[p], U[k]
            L[k], L[p] = L[p], L[k]
            perm[k], perm[p] = perm[p], perm[k]
            swaps += 1
        for i in range(k + 1, n):
            l = U[i][k] / U[k][k]
            L[i][k] = l
            for j in range(k, n):
                U[i][j] -= l * U[k][j]
    for i in range(n):
        L[i][i] = 1.0
    return perm, L, U, swaps


def solve(perm, L, U, b):
    n = len(L)
    c = [0.0] * n
    for i in range(n):
        c[i] = b[perm[i]] - sum(L[i][j] * c[j] for j in range(i))
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (c[i] - sum(U[i][j] * x[j] for j in range(i + 1, n))) / U[i][i]
    return c, x


def det_exact(A):
    n = len(A)
    total = F(0)
    for p in permutations(range(n)):
        inv = sum(1 for i in range(n) for j in range(i + 1, n) if p[i] > p[j])
        prod = F(1)
        for i in range(n):
            prod *= A[i][p[i]]
        total += (-1) ** inv * prod
    return total


def main():
    A = [[1, 2, 1], [3, 8, 1], [0, 4, 1]]
    L, U, _ = lu_exact(A)
    assert L == [[1, 0, 0], [3, 1, 0], [0, 2, 1]] and U == [[1, 2, 1], [0, 2, -2], [0, 0, 5]] and mm(L, U) == A
    c, x = solve([0, 1, 2], L, U, [2, 12, 2])
    assert c == [2, 6, -10] and x == [2, 1, -2]
    print("[OK] 주장 1: 예시")

    rng = random.Random(8)
    done = 0
    while done < 300:
        n = rng.randint(1, 5)
        A = [[rng.randint(-5, 5) for _ in range(n)] for _ in range(n)]
        r = lu_exact(A)
        if r is None:
            continue
        done += 1
        L, U, Es = r
        P = [[F(int(i == j)) for j in range(n)] for i in range(n)]
        for E in Es:
            P = mm(P, E)
        assert P == L and mm(L, U) == A
    print("[OK] 주장 2: 곱수가 그대로 L")

    assert lu_exact([[0, 1], [1, 1]]) is None
    perm, L, U, _ = lu_float([[0, 1], [1, 1]])
    assert perm == [1, 0] and L == [[1, 0], [0, 1]] and U == [[1, 1], [0, 1]]
    assert solve(perm, L, U, [1, 3])[1] == [2, 1]
    print("[OK] 주장 3: 행 바꾸기")

    for _ in range(200):
        n = rng.randint(1, 8)
        A = [[rng.uniform(-5, 5) for _ in range(n)] for _ in range(n)]
        perm, L, U, _ = lu_float(A)
        LU = mm(L, U)
        assert all(abs(A[perm[i]][j] - LU[i][j]) < 1e-9 for i in range(n) for j in range(n))
        assert all(abs(L[i][j]) <= 1 + 1e-12 for i in range(n) for j in range(i))
        b = [rng.uniform(-5, 5) for _ in range(n)]
        x = solve(perm, L, U, b)[1]
        assert all(abs(sum(A[i][j] * x[j] for j in range(n)) - b[i]) < 1e-8 for i in range(n))
    print("[OK] 주장 4: PA = LU, 곱수, 잔차")

    for n in (10, 100, 1000):
        fac = sum((n - k) * (n - k + 1) for k in range(1, n + 1))
        sol = sum(i for i in range(n)) + sum(n - 1 - i + 1 for i in range(n))
        assert abs(fac / (n ** 3 / 3) - 1) < 3.5 / n and abs(sol / n ** 2 - 1) < 2 / n
    n, k = 1000, 100
    reuse, redo = 2 / 3 * n ** 3 + 2 * k * n ** 2, k * 2 / 3 * n ** 3
    assert 70 < redo / reuse < 100
    print(f"[OK] 주장 5: 연산 수, 재사용 이득 {redo / reuse:.0f}배")

    for _ in range(100):
        n = rng.randint(1, 5)
        A = [[rng.randint(-5, 5) for _ in range(n)] for _ in range(n)]
        d = det_exact(A)
        if d == 0:
            continue
        perm, L, U, swaps = lu_float(A)
        prod = 1.0
        for i in range(n):
            prod *= U[i][i]
        assert abs((-1) ** swaps * prod - float(d)) < 1e-6 * max(1, abs(float(d)))
    print("[OK] 주장 6: 행렬식")

    L, U, _ = lu_exact([[2, 1], [6, 8]])
    assert L == [[1, 0], [3, 1]] and U == [[2, 1], [0, 5]]
    print("[OK] 주장 7·카드 C1")
    # 수치해석(2-2) 과목별 관점: 둘리틀 공식, 슬라이드 예, 오차 줄이기, 열마다 풀어 역행렬
    from fractions import Fraction as Fr
    def doolittle(M):
        n = len(M); L = [[Fr(int(i == j)) for j in range(n)] for i in range(n)]; U = [[Fr(0)] * n for _ in range(n)]
        for j in range(n):
            for i in range(j + 1):                       # 위에서부터 U의 j열
                U[i][j] = Fr(M[i][j]) - sum(L[i][k] * U[k][j] for k in range(i))
            for i in range(j + 1, n):                    # 그 아래 L의 j열
                L[i][j] = (Fr(M[i][j]) - sum(L[i][k] * U[k][j] for k in range(j))) / U[j][j]
        return L, U
    def fwd(L, r):
        x = []
        for i in range(len(r)):
            x.append((r[i] - sum(L[i][k] * x[k] for k in range(i))) / L[i][i])
        return x
    def bwd(U, r):
        n = len(r); x = [Fr(0)] * n
        for i in reversed(range(n)):
            x[i] = (r[i] - sum(U[i][k] * x[k] for k in range(i + 1, n))) / U[i][i]
        return x
    Mn = [[6, 4, 2], [3, -2, -1], [3, 4, 1]]
    Ln, Un = doolittle(Mn)
    assert Ln == [[1, 0, 0], [Fr(1, 2), 1, 0], [Fr(1, 2), Fr(-1, 2), 1]] and Un == [[6, 4, 2], [0, -4, -2], [0, 0, -1]]
    yv = fwd(Ln, [Fr(12), Fr(0), Fr(8)]); assert yv == [12, -6, -1]
    assert bwd(Un, yv) == [1, 1, 1]                                  # 카드 C4
    cols = [bwd(Un, fwd(Ln, [Fr(int(i == j)) for i in range(3)])) for j in range(3)]
    Minv = [[cols[j][i] for j in range(3)] for i in range(3)]
    assert Minv == [[Fr(1, 12), Fr(1, 6), 0], [Fr(-1, 4), 0, Fr(1, 2)], [Fr(3, 4), Fr(-1, 2), -1]]
    assert all(sum(Mn[i][k] * Minv[k][j] for k in range(3)) == int(i == j) for i in range(3) for j in range(3))
    # 오차 줄이기: 부동소수 해 x0에서 M Δx = M x0 − r을 풀어 x = x0 − Δx
    import random as _r
    _r.seed(8)
    H = [[1.0 / (i + j + 1) for j in range(6)] for i in range(6)]       # 힐베르트 행렬(조건이 나쁨)
    xt = [1.0] * 6; rr = [sum(H[i][j] * xt[j] for j in range(6)) for i in range(6)]
    def solve_f(A, b):
        n = len(b); M = [row[:] + [b[i]] for i, row in enumerate(A)]
        for c in range(n):
            for r_ in range(c + 1, n):
                f = M[r_][c] / M[c][c]
                M[r_] = [a - f * bb for a, bb in zip(M[r_], M[c])]
        x = [0.0] * n
        for i in reversed(range(n)):
            x[i] = (M[i][n] - sum(M[i][k] * x[k] for k in range(i + 1, n))) / M[i][i]
        return x
    x0 = solve_f(H, rr)
    Hx = [[Fr(v) for v in row] + [Fr(rr[i])] for i, row in enumerate(H)]      # 부동소수 H, r의 정확한 해
    for c in range(6):
        Hx[c] = [v / Hx[c][c] for v in Hx[c]]
        for r_ in range(6):
            if r_ != c:
                Hx[r_] = [a - Hx[r_][c] * b for a, b in zip(Hx[r_], Hx[c])]
    xe = [row[6] for row in Hx]
    exact_res = [sum(Fr(H[i][j]) * Fr(x0[j]) for j in range(6)) - Fr(rr[i]) for i in range(6)]   # 잔차는 정밀하게
    dx = solve_f(H, [float(v) for v in exact_res])
    x1 = [a - b for a, b in zip(x0, dx)]
    err0 = max(abs(Fr(a) - b) for a, b in zip(x0, xe)); err1 = max(abs(Fr(a) - b) for a, b in zip(x1, xe))
    assert err1 < err0 / 10
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
