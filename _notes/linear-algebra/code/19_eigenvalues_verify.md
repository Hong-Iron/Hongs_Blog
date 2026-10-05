---
layout: "note"
title: "19_eigenvalues_verify.py"
display_title: "19_eigenvalues_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/eigenvalues/"
parent_title: "고윳값과 고유벡터"
description: "선형대수학 · 고윳값과 고유벡터 검증 코드"
permalink: "/studies/linear-algebra/code/19_eigenvalues_verify/"
---
{% raw %}
[고윳값과 고유벡터](/Hongs_Blog/studies/linear-algebra/eigenvalues/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""고윳값과 고유벡터 검증.

문서: 19.고윳값과 고유벡터 (예시, 정의, 동치, 예, 정리, 증명, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — A = [[0.8,0.3],[0.2,0.7]]: (1,0) -> (0.8,0.2) -> (0.7,0.3) -> (0.65,0.35) -> (0.6,0.4),
         A(0.6,0.4) = (0.6,0.4), A(1,-1) = (0.5,-0.5).
주장 2: 2×2 무작위 1000개 — 특성다항식 근의 합 = 대각합, 곱 = 행렬식(복소수 포함), det(A - λI) = 0.
주장 3: 무작위 대칭 행렬(야코비 방법, n <= 6) — 고윳값 합 = 대각합, 곱 = 행렬식, A v = λ v.
주장 4: 예 — 사영(1, 0), 반사 y = x(1, -1), 회전 λ² + 1 = 0, 삼각행렬의 고윳값 = 대각.
주장 5: 예제·카드 C2 — [[2,1],[1,2]]: 3, 1 / (1,1),(1,-1). [[4,1],[2,3]]: 5, 2 / (1,1),(1,-2).
주장 6: 오해 — [[1,2],[3,4]]의 피벗 1, -2와 고윳값 (5 ± √33)/2가 다르고, 곱은 둘 다 -2.
주장 7: 거듭제곱법 — 오차 비율이 |λ2/λ1| = 0.5로 줄고 (0.6,0.4)로 모인다.
주장 8: A^k의 고윳값 λ^k, A^{-1}의 고윳값 1/λ (고유벡터가 같다).
"""
import cmath
import math
import random


def eig2(A):
    (a, b), (c, d) = A
    tr, det = a + d, a * d - b * c
    disc = cmath.sqrt(tr * tr - 4 * det)
    return (tr + disc) / 2, (tr - disc) / 2


def jacobi(S, tol=1e-26, sweeps=100):
    n = len(S)
    A = [row[:] for row in S]
    V = [[float(i == j) for j in range(n)] for i in range(n)]
    for _ in range(sweeps):
        off = sum(A[i][j] ** 2 for i in range(n) for j in range(n) if i != j)
        if off < tol:
            break
        for p in range(n):
            for q in range(p + 1, n):
                if abs(A[p][q]) < 1e-15:
                    continue
                th = 0.5 * math.atan2(2 * A[p][q], A[q][q] - A[p][p])
                c, s = math.cos(th), math.sin(th)
                for k in range(n):
                    akp, akq = A[k][p], A[k][q]
                    A[k][p], A[k][q] = c * akp - s * akq, s * akp + c * akq
                for k in range(n):
                    apk, aqk = A[p][k], A[q][k]
                    A[p][k], A[q][k] = c * apk - s * aqk, s * apk + c * aqk
                for k in range(n):
                    vkp, vkq = V[k][p], V[k][q]
                    V[k][p], V[k][q] = c * vkp - s * vkq, s * vkp + c * vkq
    return [A[i][i] for i in range(n)], V


def det(A):
    n = len(A)
    M = [r[:] for r in A]
    d = 1.0
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(M[i][k]))
        if abs(M[p][k]) < 1e-300:
            return 0.0
        if p != k:
            M[k], M[p] = M[p], M[k]
            d = -d
        d *= M[k][k]
        for i in range(k + 1, n):
            f = M[i][k] / M[k][k]
            M[i] = [a - f * b for a, b in zip(M[i], M[k])]
    return d


def mv(A, x):
    return [sum(a * b for a, b in zip(r, x)) for r in A]


def main():
    A = [[0.8, 0.3], [0.2, 0.7]]
    u = [1.0, 0.0]
    seq = []
    for _ in range(3):
        u = mv(A, u)
        seq.append([round(v, 10) for v in u])
    assert seq == [[0.8, 0.2], [0.7, 0.3], [0.65, 0.35]]
    for _ in range(60):
        u = mv(A, u)
    assert abs(u[0] - 0.6) < 1e-12 and abs(u[1] - 0.4) < 1e-12
    assert all(abs(a - b) < 1e-12 for a, b in zip(mv(A, [0.6, 0.4]), [0.6, 0.4]))
    assert all(abs(a - b) < 1e-12 for a, b in zip(mv(A, [1, -1]), [0.5, -0.5]))
    print("[OK] 주장 1: 예시")

    rng = random.Random(19)
    for _ in range(1000):
        B = [[rng.uniform(-5, 5) for _ in range(2)] for _ in range(2)]
        l1, l2 = eig2(B)
        assert abs((l1 + l2) - (B[0][0] + B[1][1])) < 1e-9
        assert abs(l1 * l2 - (B[0][0] * B[1][1] - B[0][1] * B[1][0])) < 1e-9
        for l in (l1, l2):
            assert abs((B[0][0] - l) * (B[1][1] - l) - B[0][1] * B[1][0]) < 1e-9
    print("[OK] 주장 2·카드 C4: 2×2 합·곱·특성방정식")

    for _ in range(200):
        n = rng.randint(2, 6)
        S = [[0.0] * n for _ in range(n)]
        for i in range(n):
            for j in range(i, n):
                S[i][j] = S[j][i] = rng.uniform(-3, 3)
        lam, V = jacobi(S)
        assert abs(sum(lam) - sum(S[i][i] for i in range(n))) < 1e-9
        assert abs(math.prod(lam) - det(S)) < 1e-7 * max(1, abs(det(S)))
        for k in range(n):
            v = [V[i][k] for i in range(n)]
            assert all(abs(x - lam[k] * y) < 1e-8 for x, y in zip(mv(S, v), v))
    print("[OK] 주장 3: 대칭 행렬의 고윳값(야코비)")

    P, F, R = [[1, 0], [0, 0]], [[0, 1], [1, 0]], [[0, -1], [1, 0]]
    assert sorted(v.real for v in eig2(P)) == [0, 1] and sorted(v.real for v in eig2(F)) == [-1, 1]
    assert mv(F, [1, 1]) == [1, 1] and mv(F, [1, -1]) == [-1, 1]
    assert set(eig2(R)) == {1j, -1j}
    for _ in range(100):
        T = [[rng.uniform(-3, 3), rng.uniform(-3, 3)], [0.0, rng.uniform(-3, 3)]]
        assert all(abs(x - y) < 1e-9 for x, y in zip(sorted(v.real for v in eig2(T)), sorted([T[0][0], T[1][1]])))
    print("[OK] 주장 4·카드 C3: 사영·반사·회전·삼각")

    assert sorted(v.real for v in eig2([[2, 1], [1, 2]])) == [1, 3]
    assert mv([[2, 1], [1, 2]], [1, 1]) == [3, 3] and mv([[2, 1], [1, 2]], [1, -1]) == [1, -1]
    assert sorted(v.real for v in eig2([[4, 1], [2, 3]])) == [2, 5]
    assert mv([[4, 1], [2, 3]], [1, 1]) == [5, 5] and mv([[4, 1], [2, 3]], [1, -2]) == [2, -4]
    print("[OK] 주장 5·예제·카드 C2")

    M = [[1, 2], [3, 4]]
    piv = [1, 4 - 3 * 2]
    l = sorted(v.real for v in eig2(M))
    assert piv == [1, -2] and abs(l[1] - (5 + math.sqrt(33)) / 2) < 1e-12 and abs(l[0] - (5 - math.sqrt(33)) / 2) < 1e-12
    assert abs(l[0] * l[1] - (-2)) < 1e-12 and piv[0] * piv[1] == -2
    print("[OK] 주장 6·오해")

    u = [1.0, 0.0]
    errs = []
    for _ in range(20):
        u = mv(A, u)
        errs.append(abs(u[0] - 0.6))
    ratios = [errs[i + 1] / errs[i] for i in range(10)]
    assert all(abs(r - 0.5) < 1e-6 for r in ratios)
    print("[OK] 주장 7: 거듭제곱법의 수렴 비율 0.5")

    for _ in range(200):
        B = [[rng.uniform(-3, 3) for _ in range(2)] for _ in range(2)]
        l1, l2 = eig2(B)
        if abs(l1.imag) > 1e-12 or abs(l1 - l2) < 1e-6 or abs(l1 * l2) < 1e-3:
            continue
        l1 = l1.real
        v = [B[0][1], l1 - B[0][0]] if abs(B[0][1]) > 1e-9 else [l1 - B[1][1], B[1][0]]
        if max(abs(x) for x in v) < 1e-9:
            continue
        w = v
        for _ in range(3):
            w = mv(B, w)
        assert all(abs(x - l1 ** 3 * y) < 1e-6 * max(1, abs(l1) ** 3) for x, y in zip(w, v))
        d = B[0][0] * B[1][1] - B[0][1] * B[1][0]
        Binv = [[B[1][1] / d, -B[0][1] / d], [-B[1][0] / d, B[0][0] / d]]
        assert all(abs(x - y / l1) < 1e-6 * max(1, abs(1 / l1)) for x, y in zip(mv(Binv, v), v))
    print("[OK] 주장 8: A^k, A^{-1}의 고윳값")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
