---
layout: "note"
title: "23_positive-definite_verify.py"
display_title: "23_positive-definite_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/positive-definite/"
parent_title: "양의 정부호 행렬과 이차형식"
description: "선형대수학 · 양의 정부호 행렬과 이차형식 검증 코드"
permalink: "/studies/linear-algebra/code/23_positive-definite_verify/"
---
{% raw %}
[양의 정부호 행렬과 이차형식](/Hongs_Blog/studies/linear-algebra/positive-definite/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""양의 정부호 행렬과 이차형식 검증.

문서: 23.양의 정부호 행렬과 이차형식 (예시, 정의, 판정법, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — 2x² - 2xy + 2y² = x² + y² + (x-y)² (유리수 무작위), [[1,2],[2,1]]은 (1,-1)에서 -2.
주장 2: 예제 — 3×3 삼중대각 피벗 2, 3/2, 4/3, 왼쪽 위 행렬식 2, 3, 4, 고윳값 2-√2, 2, 2+√2.
주장 3: 무작위 대칭 행렬 1000개 — (고윳값 모두 > 0, 야코비) <=> (피벗 모두 > 0) <=> (실베스터) <=> (숄레스키 성공),
         그리고 양의 정부호이면 무작위 방향 200개에서 에너지 > 0, 아니면 음이 아닌 에너지가 아닌 방향(고유벡터)이 있다.
주장 4: A^T A는 준정부호(에너지 = |Ax|² >= 0), 열이 독립이면 정부호.
주장 5: 숄레스키 S = L L^T 재구성.
주장 6: 카드 — C1 [[4,2],[2,3]] 피벗 4, 2, 행렬식 8. C2 [[1,2],[2,1]] 고윳값 3, -1.
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


def pivots(S):
    M = [[F(v) for v in r] for r in S]
    n = len(M)
    out = []
    for k in range(n):
        if M[k][k] == 0:
            out.append(F(0))
            return out
        out.append(M[k][k])
        for i in range(k + 1, n):
            f = M[i][k] / M[k][k]
            M[i] = [a - f * b for a, b in zip(M[i], M[k])]
    return out


def det(A):
    M = [[F(v) for v in r] for r in A]
    n, d = len(M), F(1)
    for k in range(n):
        p = next((i for i in range(k, n) if M[i][k] != 0), None)
        if p is None:
            return F(0)
        if p != k:
            M[k], M[p] = M[p], M[k]
            d = -d
        d *= M[k][k]
        for i in range(k + 1, n):
            f = M[i][k] / M[k][k]
            M[i] = [a - f * b for a, b in zip(M[i], M[k])]
    return d


def cholesky(S):
    n = len(S)
    L = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1):
            s = S[i][j] - sum(L[i][k] * L[j][k] for k in range(j))
            if i == j:
                if s <= 1e-12:
                    return None
                L[i][i] = math.sqrt(s)
            else:
                L[i][j] = s / L[j][j]
    return L


def energy(S, x):
    return sum(x[i] * S[i][j] * x[j] for i in range(len(x)) for j in range(len(x)))


def main():
    rng = random.Random(23)
    for _ in range(500):
        x, y = F(rng.randint(-20, 20), rng.randint(1, 5)), F(rng.randint(-20, 20), rng.randint(1, 5))
        assert 2 * x * x - 2 * x * y + 2 * y * y == x * x + y * y + (x - y) ** 2
    assert energy([[1, 2], [2, 1]], [1, -1]) == -2
    print("[OK] 주장 1: 예시")

    T = [[2, -1, 0], [-1, 2, -1], [0, -1, 2]]
    assert pivots(T) == [2, F(3, 2), F(4, 3)]
    assert [det([r[:k] for r in T[:k]]) for k in (1, 2, 3)] == [2, 3, 4]
    lam = sorted(jacobi([list(map(float, r)) for r in T])[0])
    assert all(abs(a - b) < 1e-12 for a, b in zip(lam, [2 - math.sqrt(2), 2, 2 + math.sqrt(2)]))
    print("[OK] 주장 2: 예제")

    pd_count = 0
    for _ in range(1000):
        n = rng.randint(1, 4)
        S = [[0] * n for _ in range(n)]
        for i in range(n):
            for j in range(i, n):
                S[i][j] = S[j][i] = rng.randint(-3, 3)
        for i in range(n):
            S[i][i] += rng.randint(0, 6)
        lam, V = jacobi([list(map(float, r)) for r in S])
        c_eig = min(lam) > 1e-9
        pv = pivots(S)
        c_piv = len(pv) == n and all(p > 0 for p in pv)
        c_syl = all(det([r[:k] for r in S[:k]]) > 0 for k in range(1, n + 1))
        c_chol = cholesky([list(map(float, r)) for r in S]) is not None
        if abs(min(lam)) < 1e-9:
            continue
        assert c_eig == c_piv == c_syl == c_chol
        if c_eig:
            pd_count += 1
            for _ in range(200):
                x = [rng.gauss(0, 1) for _ in range(n)]
                assert energy(S, x) > 0
        else:
            k = lam.index(min(lam))
            v = [V[i][k] for i in range(n)]
            assert energy(S, v) < 0
    assert pd_count > 100
    print(f"[OK] 주장 3: 다섯 판정 일치(양의 정부호 {pd_count}개)")

    for _ in range(300):
        m, n = rng.randint(1, 5), rng.randint(1, 4)
        A = [[rng.randint(-3, 3) for _ in range(n)] for _ in range(m)]
        AtA = [[sum(A[k][i] * A[k][j] for k in range(m)) for j in range(n)] for i in range(n)]
        x = [rng.randint(-5, 5) for _ in range(n)]
        Ax = [sum(A[i][j] * x[j] for j in range(n)) for i in range(m)]
        assert energy(AtA, x) == sum(v * v for v in Ax) >= 0
    print("[OK] 주장 4·카드 C3: A^T A")

    for _ in range(200):
        n = rng.randint(1, 5)
        A = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(n + 2)]
        S = [[sum(A[k][i] * A[k][j] for k in range(n + 2)) + (1 if i == j else 0) for j in range(n)] for i in range(n)]
        L = cholesky(S)
        R = [[sum(L[i][k] * L[j][k] for k in range(n)) for j in range(n)] for i in range(n)]
        assert all(abs(R[i][j] - S[i][j]) < 1e-9 for i in range(n) for j in range(n))
    print("[OK] 주장 5: 숄레스키")

    assert pivots([[4, 2], [2, 3]]) == [4, 2] and det([[4, 2], [2, 3]]) == 8
    assert sorted(round(v) for v in jacobi([[1.0, 2.0], [2.0, 1.0]])[0]) == [-1, 3]
    print("[OK] 주장 6·카드 C1·C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
