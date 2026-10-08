---
layout: "note"
title: "11_four-subspaces_verify.py"
display_title: "11_four-subspaces_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/four-subspaces/"
parent_title: "랭크와 네 부분공간"
description: "선형대수학 · 랭크와 네 부분공간 검증 코드"
permalink: "/studies/linear-algebra/code/11_four-subspaces_verify/"
---
{% raw %}
[랭크와 네 부분공간](/Hongs_Blog/studies/linear-algebra/four-subspaces/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""랭크와 네 부분공간 검증.

문서: 11.랭크와 네 부분공간 (예시, 정의, 정리, 증명, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — [[1,2,3],[2,4,6]]: r = 1, 영공간 기저 2개가 A x = 0이고 (1,2,3)과 수직, 왼쪽 영공간 (2,-1), (1,0)은 해 없음.
주장 2: 예제·카드 C2 — [[1,2,0],[0,0,1],[1,2,1]]: r = 2, N(A) = span(-2,1,0), 피벗 열 1, 3, N(A^T) = span(1,1,-1).
주장 3: 무작위 유리수 행렬 500개 — rank(A) = rank(A^T), 특수해 n - r개가 독립이고 해, 영공간 ⊥ 행, dim N(A^T) = m - r.
주장 4: 해의 존재 — (b ∈ C(A)) <=> (소거에서 모순 없음) <=> (N(A^T)의 기저와 모두 수직), 해의 꼴 x_p + x_n.
주장 5: 오해·카드 C4 — [[1,2],[2,4]]: (1,2)는 해 무한, (1,0)은 해 없음, 0 아닌 행 2개인데 랭크 1.
주장 6: 조건등색 — 무작위 3×31 정수 행렬(랭크 3)의 영공간 28차원, 영공간 벡터를 더한 서로 다른 스펙트럼이 같은 반응.
주장 7: 연결 — 연결 그래프의 근접 행렬 랭크 n - 1, 영공간(사이클) 차원 m - n + 1.
"""
import random
from fractions import Fraction as F


def rref(A):
    M = [[F(v) for v in row] for row in A]
    m, n = len(M), len(M[0])
    piv, r = [], 0
    for c in range(n):
        p = next((i for i in range(r, m) if M[i][c] != 0), None)
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]
        M[r] = [x / M[r][c] for x in M[r]]
        for i in range(m):
            if i != r and M[i][c] != 0:
                f = M[i][c]
                M[i] = [a - f * b for a, b in zip(M[i], M[r])]
        piv.append(c)
        r += 1
        if r == m:
            break
    return M, piv


def null_basis(A):
    R, piv = rref(A)
    n = len(A[0])
    free = [j for j in range(n) if j not in piv]
    basis = []
    for f in free:
        v = [F(0)] * n
        v[f] = F(1)
        for i, c in enumerate(piv):
            v[c] = -R[i][f]
        basis.append(v)
    return basis


def T(A):
    return [list(r) for r in zip(*A)]


def mv(A, x):
    return [sum(a * b for a, b in zip(row, x)) for row in A]


def dot(u, v):
    return sum(a * b for a, b in zip(u, v))


def rank(A):
    return len(rref(A)[1])


def solvable(A, b):
    R, piv = rref([list(r) + [bi] for r, bi in zip(A, b)])
    return len(A[0]) not in piv


def main():
    A = [[1, 2, 3], [2, 4, 6]]
    assert rank(A) == 1
    N = null_basis(A)
    assert len(N) == 2 and all(mv(A, v) == [0, 0] for v in N) and all(dot(v, [1, 2, 3]) == 0 for v in N)
    assert null_basis(T(A)) == [[-2, 1]] and dot([1, 2], [2, -1]) == 0
    assert not solvable(A, [1, 0]) and solvable(A, [1, 2])
    assert dot([1, 2, 3], [-2, 1, 0]) == 0
    print("[OK] 주장 1: 예시")

    B = [[1, 2, 0], [0, 0, 1], [1, 2, 1]]
    R, piv = rref(B)
    assert piv == [0, 2] and null_basis(B) == [[-2, 1, 0]]
    assert null_basis(T(B)) == [[-1, -1, 1]] and mv(T(B), [1, 1, -1]) == [0, 0, 0]
    assert dot([1, 1, -1], [1, 0, 1]) == 0 and dot([1, 1, -1], [0, 1, 1]) == 0
    print("[OK] 주장 2·예제·카드 C2")

    rng = random.Random(11)
    for _ in range(500):
        m, n = rng.randint(1, 5), rng.randint(1, 5)
        A = [[F(rng.randint(-3, 3)) for _ in range(n)] for _ in range(m)]
        if rng.random() < 0.4 and m >= 2:
            A[-1] = [a + b for a, b in zip(A[0], A[1 % m])]
        r = rank(A)
        assert r == rank(T(A))
        N = null_basis(A)
        assert len(N) == n - r and all(mv(A, v) == [0] * m for v in N)
        if N:
            assert rank(T(N)) == len(N)
        for v in N:
            for row in A:
                assert dot(row, v) == 0
        assert len(null_basis(T(A))) == m - r
        LN = null_basis(T(A))
        for _ in range(3):
            b = [F(rng.randint(-3, 3)) for _ in range(m)]
            s1 = solvable(A, b)
            s2 = all(dot(y, b) == 0 for y in LN)
            assert s1 == s2
            x = [F(rng.randint(-3, 3)) for _ in range(n)]
            bb = mv(A, x)
            assert solvable(A, bb)
            if N:
                ts = [F(rng.randint(-3, 3)) for _ in N]
                x2 = [xi + sum(t * v[i] for t, v in zip(ts, N)) for i, xi in enumerate(x)]
                assert mv(A, x2) == bb
    print("[OK] 주장 3·4·카드 C1·C3: 차원, 수직, 해의 존재와 꼴")

    S = [[1, 2], [2, 4]]
    assert solvable(S, [1, 2]) and len(null_basis(S)) == 1 and not solvable(S, [1, 0])
    assert rank(S) == 1 and sum(any(row) for row in S) == 2
    print("[OK] 주장 5·오해·카드 C4")

    C = [[rng.randint(0, 9) for _ in range(31)] for _ in range(3)]
    assert rank(C) == 3
    N = null_basis(C)
    assert len(N) == 28
    i1 = [F(rng.randint(10, 20)) for _ in range(31)]
    i2 = [a + F(1, 100) * b for a, b in zip(i1, N[0])]
    assert i1 != i2 and mv(C, i1) == mv(C, i2)
    print("[OK] 주장 6: 조건등색 모형")

    for _ in range(50):
        n = rng.randint(2, 7)
        edges = [(i, rng.randrange(i)) for i in range(1, n)]
        extra = [(u, v) for u in range(n) for v in range(u) if rng.random() < 0.3 and (u, v) not in edges]
        E = edges + extra
        Inc = [[(1 if k == u else -1 if k == v else 0) for k in range(n)] for u, v in E]
        assert rank(Inc) == n - 1 and len(null_basis(T(Inc))) == len(E) - n + 1
    print("[OK] 주장 7: 근접 행렬의 랭크와 사이클 공간")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
