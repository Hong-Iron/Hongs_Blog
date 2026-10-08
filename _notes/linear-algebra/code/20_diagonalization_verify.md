---
layout: "note"
title: "20_diagonalization_verify.py"
display_title: "20_diagonalization_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/diagonalization/"
parent_title: "대각화와 행렬 거듭제곱"
description: "선형대수학 · 대각화와 행렬 거듭제곱 검증 코드"
permalink: "/studies/linear-algebra/code/20_diagonalization_verify/"
---
{% raw %}
[대각화와 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/diagonalization/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""대각화와 행렬 거듭제곱 검증.

문서: 20.대각화와 행렬 거듭제곱 (예시, 정리, 동역학계, 증명, 가정, 예제, 활용, 오해, 카드 C1~C4),
      4.연습문제/20.고윳값과 대각화 예제 사다리
주장 1: 예시 — X Λ X^{-1} = A(유리수 8/10 등), A^k -> [[0.6,0.6],[0.4,0.4]].
주장 2: 예제 — [[2,1],[1,2]]^k = (1/2)[[3^k+1, 3^k-1],[3^k-1, 3^k+1]] (k <= 30, 정수).
         카드 C2 — [[1,2],[2,1]]^5 = [[121,122],[122,121]].
주장 3: 무작위 대각화 가능 행렬(X, Λ를 정수로 만들어 A = XΛX^{-1}) — A^k = XΛ^kX^{-1}, AX = XΛ (유리수).
주장 4: 서로 다른 고윳값의 고유벡터는 독립(무작위 3×3 삼각 행렬, 고유벡터를 풀어 랭크 3).
주장 5: J = [[1,1],[0,1]]: J^k = [[1,k],[0,1]], N(J - I) 1차원. I는 고윳값이 겹쳐도 대각.
주장 6: 동역학계 — u_k = Σ c_i λ_i^k x_i, c = X^{-1} u_0 (유리수).
주장 7: 사다리 — [[4,1],[2,3]]^k 공식(k <= 10), 날씨 행렬 정상 상태 (2/3, 1/3), [[3,1],[0,2]]^k, 변형 J^k.
"""
import random
from fractions import Fraction as F


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mpow(A, k):
    n = len(A)
    R = [[F(int(i == j)) for j in range(n)] for i in range(n)]
    for _ in range(k):
        R = mm(R, A)
    return R


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


def diag(v):
    return [[v[i] if i == j else F(0) for j in range(len(v))] for i in range(len(v))]


def main():
    A = [[F(8, 10), F(3, 10)], [F(2, 10), F(7, 10)]]
    X = [[F(6, 10), F(1)], [F(4, 10), F(-1)]]
    L = diag([F(1), F(1, 2)])
    assert mm(X, mm(L, inv(X))) == A
    Ak = mpow(A, 60)
    assert all(abs(float(Ak[i][j]) - [[0.6, 0.6], [0.4, 0.4]][i][j]) < 1e-15 for i in range(2) for j in range(2))
    print("[OK] 주장 1: 예시")

    B = [[F(2), F(1)], [F(1), F(2)]]
    for k in range(0, 31):
        assert mpow(B, k) == [[F(3 ** k + 1, 2), F(3 ** k - 1, 2)], [F(3 ** k - 1, 2), F(3 ** k + 1, 2)]]
    assert mpow([[F(1), F(2)], [F(2), F(1)]], 5) == [[121, 122], [122, 121]]
    print("[OK] 주장 2·예제·카드 C2")

    rng = random.Random(20)
    done = 0
    while done < 200:
        n = rng.randint(1, 4)
        X = [[F(rng.randint(-3, 3)) for _ in range(n)] for _ in range(n)]
        Xi = inv(X)
        if Xi is None:
            continue
        done += 1
        lam = [F(rng.randint(-3, 3), rng.randint(1, 2)) for _ in range(n)]
        A = mm(X, mm(diag(lam), Xi))
        assert mm(A, X) == mm(X, diag(lam))
        k = rng.randint(0, 6)
        assert mpow(A, k) == mm(X, mm(diag([l ** k for l in lam]), Xi))
        u0 = [F(rng.randint(-5, 5)) for _ in range(n)]
        c = [sum(Xi[i][j] * u0[j] for j in range(n)) for i in range(n)]
        uk = [sum(mpow(A, k)[i][j] * u0[j] for j in range(n)) for i in range(n)]
        assert uk == [sum(c[t] * lam[t] ** k * X[i][t] for t in range(n)) for i in range(n)]
    print("[OK] 주장 3·6·카드 C1·C4: A^k = XΛ^kX^{-1}, 동역학계")

    for _ in range(200):
        d = rng.sample(range(-5, 6), 3)
        T = [[F(d[0]), F(rng.randint(-3, 3)), F(rng.randint(-3, 3))],
             [F(0), F(d[1]), F(rng.randint(-3, 3))],
             [F(0), F(0), F(d[2])]]
        vecs = []
        for lam in d:
            M = [[T[i][j] - (lam if i == j else 0) for j in range(3)] for i in range(3)]
            # 영공간 벡터 하나(RREF)
            R = [r[:] for r in M]
            piv, r = [], 0
            for col in range(3):
                p = next((i for i in range(r, 3) if R[i][col] != 0), None)
                if p is None:
                    continue
                R[r], R[p] = R[p], R[r]
                R[r] = [x / R[r][col] for x in R[r]]
                for i in range(3):
                    if i != r and R[i][col] != 0:
                        f = R[i][col]
                        R[i] = [a - f * b for a, b in zip(R[i], R[r])]
                piv.append(col)
                r += 1
            free = [j for j in range(3) if j not in piv][0]
            v = [F(0)] * 3
            v[free] = F(1)
            for i, col in enumerate(piv):
                v[col] = -R[i][free]
            assert [sum(T[i][j] * v[j] for j in range(3)) for i in range(3)] == [lam * x for x in v]
            vecs.append(v)
        assert rank(vecs) == 3
    print("[OK] 주장 4: 서로 다른 고윳값 -> 독립")

    J = [[F(1), F(1)], [F(0), F(1)]]
    for k in range(20):
        assert mpow(J, k) == [[1, k], [0, 1]]
    assert 2 - rank([[0, 1], [0, 0]]) == 1
    I2 = [[F(1), F(0)], [F(0), F(1)]]
    assert 2 - rank([[0, 0], [0, 0]]) == 2 and mpow(I2, 5) == I2
    print("[OK] 주장 5·오해·카드 C3: J는 대각화 불가, I는 가능")

    C = [[F(4), F(1)], [F(2), F(3)]]
    for lam, v in ((5, [1, 1]), (2, [1, -2])):
        assert [sum(C[i][j] * v[j] for j in range(2)) for i in range(2)] == [lam * x for x in v]
    X = [[F(1), F(1)], [F(1), F(-2)]]
    assert mm(X, mm(diag([F(5), F(2)]), inv(X))) == C
    assert inv(X) == [[F(2, 3), F(1, 3)], [F(1, 3), F(-1, 3)]]
    for k in range(11):
        assert mpow(C, k) == [[F(2 * 5 ** k + 2 ** k, 3), F(5 ** k - 2 ** k, 3)],
                              [F(2 * 5 ** k - 2 * 2 ** k, 3), F(5 ** k + 2 * 2 ** k, 3)]]
    W = [[F(9, 10), F(2, 10)], [F(1, 10), F(8, 10)]]
    s = [F(2, 3), F(1, 3)]
    assert [sum(W[i][j] * s[j] for j in range(2)) for i in range(2)] == s
    assert [sum(W[i][j] * v[j] for j in range(2)) for i, v in ((0, [1, -1]), (1, [1, -1]))] == [F(7, 10), F(-7, 10)]
    Wk = mpow(W, 80)
    assert all(abs(float(Wk[i][j]) - float(s[i])) < 1e-12 for i in range(2) for j in range(2))
    T = [[F(3), F(1)], [F(0), F(2)]]
    for k in range(11):
        assert mpow(T, k) == [[3 ** k, 3 ** k - 2 ** k], [0, 2 ** k]]
    assert inv([[1, 1], [0, -1]]) == [[1, 1], [0, -1]]
    print("[OK] 주장 7: 사다리")
    # 수치해석(2-2) 과목별 관점: 슬라이드의 [[5,-1],[3,1]], 카드 C5의 [[2,1],[0,3]]
    A = [[F(5), F(-1)], [F(3), F(1)]]
    tr_, dt = A[0][0] + A[1][1], A[0][0] * A[1][1] - A[0][1] * A[1][0]
    assert (tr_, dt) == (6, 8) and all(l * l - 6 * l + 8 == 0 for l in (2, 4))
    P = [[F(1), F(1)], [F(3), F(1)]]; Pi = [[F(-1, 2), F(1, 2)], [F(3, 2), F(-1, 2)]]
    mul = lambda X, Y: [[sum(X[i][k] * Y[k][j] for k in range(2)) for j in range(2)] for i in range(2)]
    assert mul(P, Pi) == [[1, 0], [0, 1]] and mul(Pi, mul(A, P)) == [[2, 0], [0, 4]]
    B = [[F(2), F(1)], [F(0), F(3)]]; Q = [[F(1), F(1)], [F(0), F(1)]]; Qi = [[F(1), F(-1)], [F(0), F(1)]]
    assert mul(Qi, mul(B, Q)) == [[2, 0], [0, 3]] and all(l * l - 5 * l + 6 == 0 for l in (2, 3))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
