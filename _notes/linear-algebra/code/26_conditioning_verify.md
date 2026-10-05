---
layout: "note"
title: "26_conditioning_verify.py"
display_title: "26_conditioning_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/conditioning/"
parent_title: "노름과 조건수"
description: "선형대수학 · 노름과 조건수 검증 코드"
permalink: "/studies/linear-algebra/code/26_conditioning_verify/"
---
{% raw %}
[노름과 조건수](/Hongs_Blog/studies/linear-algebra/conditioning/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""노름과 조건수 검증.

문서: 26.노름과 조건수 (예시, 정의, 정리, 증명, 부동소수점, 예제, 활용, 오해, 카드 C1~C3)
주장 1: 예시 — [[1,1],[1,1.0001]]: b = (2, 2.0001) -> (1,1), b = (2, 2.0002) -> (0,2) (유리수로 정확히), κ2 ≈ 4.0 × 10^4.
주장 2: 벡터 노름의 성질(무작위), 행렬 노름: 1-노름 = 열 절댓값 합 최대, ∞-노름 = 행 합 최대, 2-노름 = σ1
         (무작위 벡터로 비율의 최댓값을 탐색해 넘지 않음, 공식 값에 가까이 도달).
주장 3: 오차 증폭 — 무작위 가역 행렬과 δb에서 상대 오차 비 <= κ (1-노름, 정확한 유리수 역행렬로 κ1 계산).
주장 4: 힐베르트 행렬 — κ2(H10) ≈ 1.6 × 10^13 (거듭제곱법, H와 정확한 H^{-1}), 부분 피벗팅 풀이 오차 n=4: < 1e-12, n=10: ~6e-4.
주장 5: 카드 — C2 diag(100, 0.01) κ = 10^4, C3 0.1 I_10: det 1e-10, κ = 1.
주장 6: 활용 — 릿지: κ(A^T A + λI) = (σ1² + λ)/(σn² + λ) < κ(A)² (2×2 무작위).
"""
import math
import random
from fractions import Fraction as F


def solve_exact(A, b):
    n = len(A)
    M = [[F(v) for v in r] + [F(bb)] for r, bb in zip(A, b)]
    for c in range(n):
        p = next(i for i in range(c, n) if M[i][c] != 0)
        M[c], M[p] = M[p], M[c]
        M[c] = [x / M[c][c] for x in M[c]]
        for i in range(n):
            if i != c and M[i][c] != 0:
                f = M[i][c]
                M[i] = [a - f * bb for a, bb in zip(M[i], M[c])]
    return [M[i][n] for i in range(n)]


def inv_exact(A):
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
                M[i] = [a - f * bb for a, bb in zip(M[i], M[c])]
    return [row[n:] for row in M]


def solve_float(A, b):
    n = len(A)
    M = [list(map(float, r)) + [float(bb)] for r, bb in zip(A, b)]
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(M[i][k]))
        M[k], M[p] = M[p], M[k]
        for i in range(k + 1, n):
            f = M[i][k] / M[k][k]
            M[i] = [a - f * c for a, c in zip(M[i], M[k])]
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (M[i][n] - sum(M[i][j] * x[j] for j in range(i + 1, n))) / M[i][i]
    return x


def sym_lmax(S, iters=3000):
    n = len(S)
    x = [1.0 / (i + 1.3) for i in range(n)]
    lam = 0.0
    for _ in range(iters):
        y = [sum(S[i][j] * x[j] for j in range(n)) for i in range(n)]
        lam = math.sqrt(sum(v * v for v in y))
        x = [v / lam for v in y]
    return lam


def norm1(A):
    return max(sum(abs(A[i][j]) for i in range(len(A))) for j in range(len(A[0])))


def norminf(A):
    return max(sum(abs(v) for v in r) for r in A)


def main():
    A = [[1, 1], [1, F(10001, 10000)]]
    assert solve_exact(A, [2, F(20001, 10000)]) == [1, 1] and solve_exact(A, [2, F(20002, 10000)]) == [0, 2]
    a, b, c, d = 1.0, 1.0, 1.0, 1.0001
    G = [[a * a + c * c, a * b + c * d], [a * b + c * d, b * b + d * d]]
    tr, det = G[0][0] + G[1][1], G[0][0] * G[1][1] - G[0][1] ** 2
    l1 = (tr + math.sqrt(tr * tr - 4 * det)) / 2
    kappa = math.sqrt(l1 / (det / l1))
    assert 3.9e4 < kappa < 4.1e4
    print(f"[OK] 주장 1: 예시, κ = {kappa:.4g}")

    rng = random.Random(26)
    for _ in range(500):
        n = rng.randint(1, 6)
        x = [rng.uniform(-5, 5) for _ in range(n)]
        y = [rng.uniform(-5, 5) for _ in range(n)]
        cc = rng.uniform(-3, 3)
        for nm in (lambda v: sum(abs(t) for t in v), lambda v: math.sqrt(sum(t * t for t in v)), lambda v: max(abs(t) for t in v)):
            assert nm([p + q for p, q in zip(x, y)]) <= nm(x) + nm(y) + 1e-12
            assert abs(nm([cc * p for p in x]) - abs(cc) * nm(x)) < 1e-9
    for _ in range(100):
        m, n = rng.randint(1, 4), rng.randint(1, 4)
        M = [[rng.uniform(-3, 3) for _ in range(n)] for _ in range(m)]
        best1 = bestinf = best2 = 0.0
        for _ in range(400):
            v = [rng.uniform(-1, 1) for _ in range(n)]
            Mv = [sum(M[i][j] * v[j] for j in range(n)) for i in range(m)]
            best1 = max(best1, sum(abs(t) for t in Mv) / sum(abs(t) for t in v))
            bestinf = max(bestinf, max(abs(t) for t in Mv) / max(abs(t) for t in v))
            best2 = max(best2, math.sqrt(sum(t * t for t in Mv)) / math.sqrt(sum(t * t for t in v)))
        for j in range(n):
            e = [0.0] * n
            e[j] = 1.0
            Me = [sum(M[i][k] * e[k] for k in range(n)) for i in range(m)]
            best1 = max(best1, sum(abs(t) for t in Me))
        sgn = [1.0 if v >= 0 else -1.0 for v in max(M, key=lambda r: sum(abs(t) for t in r))]
        Ms = [sum(M[i][k] * sgn[k] for k in range(n)) for i in range(m)]
        bestinf = max(bestinf, max(abs(t) for t in Ms))
        MtM = [[sum(M[k][i] * M[k][j] for k in range(m)) for j in range(n)] for i in range(n)]
        s1 = math.sqrt(sym_lmax(MtM, 500))
        assert best1 <= norm1(M) + 1e-9 and abs(best1 - norm1(M)) < 1e-9
        assert bestinf <= norminf(M) + 1e-9 and abs(bestinf - norminf(M)) < 1e-9
        assert best2 <= s1 + 1e-9 and best2 > 0.9 * s1
    print("[OK] 주장 2: 노름의 성질과 공식")

    done = 0
    while done < 200:
        n = rng.randint(1, 4)
        A = [[F(rng.randint(-5, 5)) for _ in range(n)] for _ in range(n)]
        Ai = inv_exact(A)
        if Ai is None:
            continue
        done += 1
        kap = norm1(A) * norm1(Ai)
        b = [F(rng.randint(-9, 9)) for _ in range(n)]
        if all(v == 0 for v in b):
            continue
        db = [F(rng.randint(-9, 9), 1000) for _ in range(n)]
        x = solve_exact(A, b)
        dx = [sum(Ai[i][j] * db[j] for j in range(n)) for i in range(n)]
        nx = sum(abs(v) for v in x)
        if nx == 0:
            continue
        lhs = sum(abs(v) for v in dx) / nx
        rhs = kap * sum(abs(v) for v in db) / sum(abs(v) for v in b)
        assert lhs <= rhs
    print("[OK] 주장 3: 오차 증폭 부등식")

    n = 10
    H = [[F(1, i + j + 1) for j in range(n)] for i in range(n)]
    Hi = inv_exact(H)
    kap2 = sym_lmax([[float(v) for v in r] for r in H]) * sym_lmax([[float(v) for v in r] for r in Hi])
    assert 1.5e13 < kap2 < 1.7e13
    errs = {}
    for m in (4, 6, 8, 10, 12):
        Hm = [[F(1, i + j + 1) for j in range(m)] for i in range(m)]
        bm = [sum(r) for r in Hm]
        x = solve_float([[float(v) for v in r] for r in Hm], [float(v) for v in bm])
        errs[m] = max(abs(v - 1) for v in x)
    assert errs[4] < 1e-12 and 1e-4 < errs[10] < 1e-2 and errs[4] < errs[6] < errs[8] < errs[10]
    print(f"[OK] 주장 4: κ(H10) = {kap2:.3g}, 오차 {errs[4]:.1e} ... {errs[10]:.1e}")

    assert 100 / 0.01 == 1e4
    det = 0.1 ** 10
    assert abs(det - 1e-10) < 1e-20
    print("[OK] 주장 5·카드 C2·C3")

    for _ in range(200):
        A = [[rng.uniform(-3, 3) for _ in range(2)] for _ in range(2)]
        G = [[sum(A[k][i] * A[k][j] for k in range(2)) for j in range(2)] for i in range(2)]
        tr, dt = G[0][0] + G[1][1], G[0][0] * G[1][1] - G[0][1] ** 2
        if dt < 1e-8:
            continue
        l1 = (tr + math.sqrt(max(tr * tr - 4 * dt, 0))) / 2
        l2 = dt / l1
        lam = rng.uniform(0.01, 2)
        assert (l1 + lam) / (l2 + lam) <= l1 / l2 + 1e-9
    print("[OK] 주장 6: 릿지로 조건수 감소")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
