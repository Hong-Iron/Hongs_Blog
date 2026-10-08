---
layout: "note"
title: "07_inverse-matrix_verify.py"
display_title: "07_inverse-matrix_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/inverse-matrix/"
parent_title: "역행렬"
description: "선형대수학 · 역행렬 검증 코드"
permalink: "/studies/linear-algebra/code/07_inverse-matrix_verify/"
---
{% raw %}
[역행렬](/Hongs_Blog/studies/linear-algebra/inverse-matrix/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""역행렬 검증.

문서: 07.역행렬 (예시, 정의, 2×2 공식, 가역 행렬 정리, 가우스–조르당, 곱과 전치, 예제, 카드 C1~C3)
주장 1: 예시 — A(1,2) = (4,11), A^{-1}(4,11) = (1,2), A^{-1}A = I. B는 (2,-1)과 0을 모두 0으로.
주장 2: 가우스–조르당(유리수)이 무작위 가역 행렬 300개에서 AA^{-1} = A^{-1}A = I, 2×2 공식과 일치.
주장 3: 가역 행렬 정리 — 무작위 행렬(특이 포함, n <= 4)에서
         (피벗 n개) <=> (Ax = 0의 해가 0뿐, 성분 -8..8 전수로 반례 탐색) <=> (가우스–조르당 성공) <=> (여러 b에서 해가 하나).
주장 4: (AB)^{-1} = B^{-1}A^{-1}, (A^T)^{-1} = (A^{-1})^T.
주장 5: 예제 — [[2,1],[5,3]]^{-1} = [[3,-1],[-5,2]]. 카드 C1 — [[4,7],[2,6]]^{-1} = [[0.6,-0.7],[-0.2,0.4]].
"""
import random
from fractions import Fraction as F
from itertools import product


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mv(A, x):
    return [sum(a * b for a, b in zip(r, x)) for r in A]


def eye(n):
    return [[F(int(i == j)) for j in range(n)] for i in range(n)]


def gauss_jordan(A):
    n = len(A)
    M = [[F(v) for v in row] + [F(int(i == j)) for j in range(n)] for i, row in enumerate(A)]
    pivots = 0
    for c in range(n):
        p = next((i for i in range(c, n) if M[i][c] != 0), None)
        if p is None:
            return None, pivots
        M[c], M[p] = M[p], M[c]
        piv = M[c][c]
        M[c] = [x / piv for x in M[c]]
        for i in range(n):
            if i != c and M[i][c] != 0:
                f = M[i][c]
                M[i] = [a - f * b for a, b in zip(M[i], M[c])]
        pivots += 1
    return [row[n:] for row in M], pivots


def pivot_count(A):
    M = [[F(v) for v in row] for row in A]
    n, m = len(M), len(M[0])
    r = 0
    for c in range(m):
        p = next((i for i in range(r, n) if M[i][c] != 0), None)
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]
        for i in range(r + 1, n):
            f = M[i][c] / M[r][c]
            M[i] = [a - f * b for a, b in zip(M[i], M[r])]
        r += 1
    return r


def T(A):
    return [list(r) for r in zip(*A)]


def main():
    A = [[2, 1], [5, 3]]
    Ai = [[3, -1], [-5, 2]]
    assert mv(A, [1, 2]) == [4, 11] and mv(Ai, [4, 11]) == [1, 2] and mm(Ai, A) == [[1, 0], [0, 1]]
    B = [[1, 2], [2, 4]]
    assert mv(B, [2, -1]) == [0, 0] == mv(B, [0, 0])
    print("[OK] 주장 1: 예시")

    rng = random.Random(7)
    count = 0
    while count < 300:
        n = rng.randint(1, 5)
        A = [[rng.randint(-6, 6) for _ in range(n)] for _ in range(n)]
        inv, _ = gauss_jordan(A)
        if inv is None:
            continue
        count += 1
        assert mm(A, inv) == eye(n) == mm(inv, A)
        if n == 2:
            (a, b), (c, d) = A
            det = F(a * d - b * c)
            assert inv == [[d / det, -b / det], [-c / det, a / det]]
    print("[OK] 주장 2: 가우스–조르당과 2×2 공식")

    for _ in range(400):
        n = rng.randint(1, 3)
        A = [[rng.randint(-2, 2) for _ in range(n)] for _ in range(n)]
        if rng.random() < 0.4 and n >= 2:
            A[1] = [2 * v for v in A[0]]
        c4 = pivot_count(A) == n
        nontrivial = any(any(x) and mv(A, list(x)) == [0] * n for x in product(range(-8, 9), repeat=n))  # 성분이 -2..2라 영공간 벡터(외적)의 성분은 8 이하
        c3 = not nontrivial
        inv, _ = gauss_jordan(A)
        c1 = inv is not None
        c2 = True
        if c1:
            for _ in range(5):
                b = [rng.randint(-5, 5) for _ in range(n)]
                x = mv(inv, b)
                c2 = c2 and mv(A, x) == b
        else:
            c2 = False
        assert c1 == c3 == c4 == c2
    print("[OK] 주장 3·카드 C3: 가역 행렬 정리의 네 조건")

    done = 0
    while done < 200:
        n = rng.randint(1, 4)
        A = [[rng.randint(-5, 5) for _ in range(n)] for _ in range(n)]
        B = [[rng.randint(-5, 5) for _ in range(n)] for _ in range(n)]
        Ai, Bi = gauss_jordan(A)[0], gauss_jordan(B)[0]
        if Ai is None or Bi is None:
            continue
        done += 1
        assert gauss_jordan(mm(A, B))[0] == mm(Bi, Ai)
        assert gauss_jordan(T(A))[0] == T(Ai)
    print("[OK] 주장 4·카드 C2: 곱과 전치의 역")

    assert gauss_jordan([[2, 1], [5, 3]])[0] == [[3, -1], [-5, 2]]
    assert gauss_jordan([[4, 7], [2, 6]])[0] == [[F(3, 5), F(-7, 10)], [F(-1, 5), F(2, 5)]]
    assert gauss_jordan([[1, 2], [2, 4]])[0] is None and pivot_count([[1, 2], [2, 4]]) == 1
    print("[OK] 주장 5·예제·카드 C1")
    # 수치해석(2-2) 과목별 관점: 부분 피벗팅 가우스–조르당, 여인수 역행렬, 슬라이드 예
    def gj_pivot(A):
        n = len(A); M = [[F(x) for x in r] + [F(int(i == j)) for j in range(n)] for i, r in enumerate(A)]
        swaps = []
        for j in range(n):
            i = max(range(j, n), key=lambda r: abs(M[r][j]))
            assert M[i][j] != 0
            if i != j:
                M[i], M[j] = M[j], M[i]; swaps.append((j, i))
            M[j] = [x / M[j][j] for x in M[j]]
            for k in range(n):
                if k != j:
                    M[k] = [x - M[k][j] * y for x, y in zip(M[k], M[j])]
        return [r[n:] for r in M], swaps
    A = [[2, -1, 3], [1, 6, -4], [5, 0, 8]]
    Ai, sw = gj_pivot(A)
    assert sw[0] == (0, 2)                                   # 첫 열의 5가 있는 셋째 행과 바꿈
    assert Ai == [[F(v, 34) for v in r] for r in [[48, 8, -14], [-28, 1, 11], [-30, -5, 13]]]
    def det3(m):
        return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))
    def minor(m, i, j):
        return [[m[r][c] for c in range(3) if c != j] for r in range(3) if r != i]
    d = det3(A); assert d == 34
    cof = [[F((-1) ** (i + j) * (minor(A, j, i)[0][0] * minor(A, j, i)[1][1] - minor(A, j, i)[0][1] * minor(A, j, i)[1][0]), d) for j in range(3)] for i in range(3)]
    assert cof == Ai                                         # A⁻¹의 (i, j) = (−1)^{i+j}|A_ji| / |A|
    B = [[1, -3, 1], [4, 1, -2], [-2, 3, 0]]
    assert det3(B) == 8
    Bi, _ = gj_pivot(B)
    assert Bi == [[F(v, 8) for v in r] for r in [[6, 3, 5], [4, 2, 6], [14, 3, 13]]]
    X = [sum(Bi[i][k] * b for k, b in enumerate([5, -2, 1])) for i in range(3)]
    assert X == [F(29, 8), F(22, 8), F(77, 8)]
    Ci, sw = gj_pivot([[1, 2], [3, 4]])                      # 카드 C4
    assert sw == [(0, 1)] and Ci == [[-2, 1], [F(3, 2), F(-1, 2)]]
    assert 1 * 6 - (-3) * (-2) == 0                          # x − 3y = 5, −2x + 6y = 1: 평행
    assert [[1, 0, 0], [0, 1, 0], [0, 0, 1]] != Ai
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
