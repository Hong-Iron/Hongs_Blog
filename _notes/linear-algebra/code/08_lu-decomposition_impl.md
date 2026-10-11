---
layout: "note"
title: "08_lu-decomposition_impl.py"
display_title: "08_lu-decomposition_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "08"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/lu-decomposition/"
parent_title: "LU 분해"
description: "선형대수학 · LU 분해 구현 코드"
permalink: "/studies/linear-algebra/code/08_lu-decomposition_impl/"
---
{% raw %}
[LU 분해](/Hongs_Blog/studies/linear-algebra/lu-decomposition/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""LU 분해(부분 피벗팅)와 풀이.

문서: 08.LU 분해
lu(A): PA = LU를 만든다. perm[i]는 PA의 i행이 A의 몇 번째 행인지. L은 대각이 1인 아래삼각(곱수), U는 위삼각.
        O(n³). 피벗이 0이면(특이 행렬) ValueError.
lu_solve(perm, L, U, b): Lc = Pb(전진 대입), Ux = c(후진 대입). O(n²).
인덱스는 0부터 센다.
"""
import random


def lu(A, pivot=True):
    n = len(A)
    U = [list(map(float, row)) for row in A]
    L = [[0.0] * n for _ in range(n)]
    perm = list(range(n))
    for k in range(n):
        if pivot:
            p = max(range(k, n), key=lambda i: abs(U[i][k]))
            if p != k:
                U[k], U[p] = U[p], U[k]
                L[k], L[p] = L[p], L[k]        # 이미 구한 곱수도 같이 바꾼다
                perm[k], perm[p] = perm[p], perm[k]
        if U[k][k] == 0:
            raise ValueError("피벗이 0: 특이 행렬이거나 행 바꾸기가 필요")
        for i in range(k + 1, n):
            l = U[i][k] / U[k][k]
            L[i][k] = l
            for j in range(k, n):
                U[i][j] -= l * U[k][j]
    for i in range(n):
        L[i][i] = 1.0
    return perm, L, U


def lu_solve(perm, L, U, b):
    n = len(L)
    pb = [float(b[perm[i]]) for i in range(n)]
    c = [0.0] * n
    for i in range(n):                          # 전진 대입: L의 대각은 1
        c[i] = pb[i] - sum(L[i][j] * c[j] for j in range(i))
    x = [0.0] * n
    for i in range(n - 1, -1, -1):              # 후진 대입
        x[i] = (c[i] - sum(U[i][j] * x[j] for j in range(i + 1, n))) / U[i][i]
    return x


def matmul(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


if __name__ == "__main__":
    A = [[1, 2, 1], [3, 8, 1], [0, 4, 1]]
    perm, L, U = lu(A, pivot=False)
    assert L == [[1, 0, 0], [3, 1, 0], [0, 2, 1]] and U == [[1, 2, 1], [0, 2, -2], [0, 0, 5]]
    assert lu_solve(perm, L, U, [2, 12, 2]) == [2, 1, -2]
    try:
        lu([[0, 1], [1, 1]], pivot=False)
        raise AssertionError("예외가 나야 한다")
    except ValueError:
        pass
    perm, L, U = lu([[0, 1], [1, 1]])
    assert perm == [1, 0] and lu_solve(perm, L, U, [1, 3]) == [2, 1]
    rng = random.Random(8)
    for _ in range(200):
        n = rng.randint(1, 8)
        A = [[rng.uniform(-5, 5) for _ in range(n)] for _ in range(n)]
        perm, L, U = lu(A)
        PA = [A[perm[i]] for i in range(n)]
        LU = matmul(L, U)
        assert all(abs(PA[i][j] - LU[i][j]) < 1e-9 for i in range(n) for j in range(n))
        assert all(abs(L[i][j]) <= 1 + 1e-12 for i in range(n) for j in range(i))   # 피벗팅: 곱수 크기 <= 1
        for _ in range(3):
            b = [rng.uniform(-5, 5) for _ in range(n)]
            x = lu_solve(perm, L, U, b)
            assert all(abs(sum(A[i][j] * x[j] for j in range(n)) - b[i]) < 1e-8 for i in range(n))
    print("ALL CHECKS PASSED")
```
{% endraw %}
