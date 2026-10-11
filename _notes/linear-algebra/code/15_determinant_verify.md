---
layout: "note"
title: "15_determinant_verify.py"
display_title: "15_determinant_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/determinant/"
parent_title: "행렬식"
description: "선형대수학 · 행렬식 검증 코드"
permalink: "/studies/linear-algebra/code/15_determinant_verify/"
---
{% raw %}
[행렬식](/Hongs_Blog/studies/linear-algebra/determinant/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""행렬식 검증.

문서: 15.행렬식 (예시, 정의, 결과, 정리, 예제, 활용, 오해, 카드 C1~C3)
주장 1: 예시 — [[3,1],[1,2]] = 5(평행사변형 넓이, 신발끈으로 계산), 열 바꾸면 -5, [[1,2],[2,4]] = 0.
주장 2: 세 성질 — det I = 1, 행 바꾸면 부호 반대, 한 행에 선형(무작위 유리수).
주장 3: 라이프니츠 = 소거(±피벗 곱) = 첫 행 여인수 전개 (무작위 n <= 5).
주장 4: det(AB) = det A det B, det A^T = det A, det A^{-1} = 1/det A, (det ≠ 0) <=> 가역(피벗 n개).
주장 5: 예제 — Strang 행렬 10, 카드 C1 — 0(셋째 행 = -7·1행 + 4·2행).
주장 6: 오해·카드 C3 — det(cA) = c^n det A, det(2I) = 4 ≠ 2.
주장 7: 활용 — 방향 판정(무작위 삼각형: det 부호 = 반시계 여부, atan2로 확인), 신발끈 공식 = 삼각분할 넓이 합, 20! ≈ 2.4 × 10^18.
"""
import math
import random
from fractions import Fraction as F
from itertools import permutations


def leibniz(A):
    n = len(A)
    tot = F(0)
    for p in permutations(range(n)):
        s = sum(1 for i in range(n) for j in range(i + 1, n) if p[i] > p[j])
        prod = F(1)
        for i in range(n):
            prod *= A[i][p[i]]
        tot += (-1) ** s * prod
    return tot


def elim_det(A):
    M = [[F(v) for v in r] for r in A]
    n, sign, prod = len(M), 1, F(1)
    for k in range(n):
        p = next((i for i in range(k, n) if M[i][k] != 0), None)
        if p is None:
            return F(0)
        if p != k:
            M[k], M[p] = M[p], M[k]
            sign = -sign
        prod *= M[k][k]
        for i in range(k + 1, n):
            f = M[i][k] / M[k][k]
            M[i] = [a - f * b for a, b in zip(M[i], M[k])]
    return sign * prod


def cofactor(A):
    n = len(A)
    if n == 1:
        return F(A[0][0])
    return sum((-1) ** j * A[0][j] * cofactor([r[:j] + r[j + 1:] for r in A[1:]]) for j in range(n))


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def shoelace(pts):
    return F(sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts))), 2)


def main():
    assert leibniz([[3, 1], [1, 2]]) == 5 and leibniz([[1, 3], [2, 1]]) == -5 and leibniz([[1, 2], [2, 4]]) == 0
    assert shoelace([(0, 0), (3, 1), (4, 3), (1, 2)]) == 5
    print("[OK] 주장 1: 예시")

    rng = random.Random(15)
    rm = lambda n: [[F(rng.randint(-5, 5), rng.randint(1, 3)) for _ in range(n)] for _ in range(n)]
    for n in range(1, 5):
        assert leibniz([[F(int(i == j)) for j in range(n)] for i in range(n)]) == 1
    for _ in range(300):
        n = rng.randint(2, 4)
        A = rm(n)
        i, j = rng.sample(range(n), 2)
        B = [r[:] for r in A]
        B[i], B[j] = B[j], B[i]
        assert leibniz(B) == -leibniz(A)
        row, c = rng.randrange(n), F(rng.randint(-5, 5), 2)
        v = [F(rng.randint(-5, 5)) for _ in range(n)]
        C = [r[:] for r in A]
        C[row] = [c * a + b for a, b in zip(A[row], v)]
        D = [r[:] for r in A]
        D[row] = v
        assert leibniz(C) == c * leibniz(A) + leibniz(D)
    print("[OK] 주장 2: 세 성질")

    for _ in range(300):
        n = rng.randint(1, 5)
        A = rm(n)
        if rng.random() < 0.3 and n >= 2:
            A[1] = [2 * a for a in A[0]]
        L = leibniz(A)
        assert L == elim_det(A) == cofactor(A)
    print("[OK] 주장 3: 세 계산법 일치")

    for _ in range(300):
        n = rng.randint(1, 4)
        A, B = rm(n), rm(n)
        assert leibniz(mm(A, B)) == leibniz(A) * leibniz(B)
        assert leibniz([list(r) for r in zip(*A)]) == leibniz(A)
        dA = leibniz(A)
        pivots_full = elim_det(A) != 0
        assert pivots_full == (dA != 0)
        if dA != 0:
            n_ = len(A)
            M = [r[:] + [F(int(i == j)) for j in range(n_)] for i, r in enumerate(A)]
            for c in range(n_):
                p = next(i for i in range(c, n_) if M[i][c] != 0)
                M[c], M[p] = M[p], M[c]
                M[c] = [x / M[c][c] for x in M[c]]
                for i in range(n_):
                    if i != c and M[i][c] != 0:
                        f = M[i][c]
                        M[i] = [a - f * b for a, b in zip(M[i], M[c])]
            Ai = [r[n_:] for r in M]
            assert leibniz(Ai) == 1 / dA
    print("[OK] 주장 4: 곱, 전치, 역, 가역성")

    assert elim_det([[1, 2, 1], [3, 8, 1], [0, 4, 1]]) == 10 == 1 * (8 - 4) - 2 * (3 - 0) + 1 * (12 - 0)
    C1 = [[2, 1, 0], [4, 3, 1], [2, 5, 4]]
    assert elim_det(C1) == 0 and [(-7) * a + 4 * b for a, b in zip(C1[0], C1[1])] == C1[2]
    print("[OK] 주장 5·예제·카드 C1")

    for _ in range(200):
        n = rng.randint(1, 4)
        A, c = rm(n), F(rng.randint(-4, 4), rng.randint(1, 3))
        assert leibniz([[c * a for a in r] for r in A]) == c ** n * leibniz(A)
    assert leibniz([[2, 0], [0, 2]]) == 4 != 1 + 1
    print("[OK] 주장 6·오해·카드 C3")

    for _ in range(500):
        a, b, c = [(rng.uniform(-5, 5), rng.uniform(-5, 5)) for _ in range(3)]
        d = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        ang = math.atan2(c[1] - a[1], c[0] - a[0]) - math.atan2(b[1] - a[1], b[0] - a[0])
        ang = (ang + math.pi) % (2 * math.pi) - math.pi
        if abs(d) > 1e-9:
            assert (d > 0) == (ang > 0)
    for _ in range(200):
        k = rng.randint(3, 8)
        angs = sorted(rng.uniform(0, 2 * math.pi) for _ in range(k))
        pts = [(F(round(10 * math.cos(t))), F(round(10 * math.sin(t)))) for t in angs]
        tri = sum(F((pts[i][0] - pts[0][0]) * (pts[i + 1][1] - pts[0][1]) - (pts[i][1] - pts[0][1]) * (pts[i + 1][0] - pts[0][0]), 2)
                  for i in range(1, k - 1))
        assert shoelace(pts) == tri
    assert abs(math.factorial(20) / 2.4e18 - 1) < 0.02
    print("[OK] 주장 7: 방향 판정, 신발끈, 20!")
    # 수치해석(2-2) 과목별 관점: 슬라이드 p.20의 예와 3×3 여인수 전개
    d2 = lambda m: m[0][0] * m[1][1] - m[0][1] * m[1][0]
    assert d2([[1, 2], [3, 4]]) == -2 and d2([[3, 4], [1, 2]]) == 2
    assert d2([[1, 2], [5, 8]]) == -2 and d2([[1, 2], [1, 2]]) == 0
    A3 = [[2, -1, 3], [1, 6, -4], [5, 0, 8]]
    exp = 2 * (6 * 8 - (-4) * 0) - (-1) * (1 * 8 - (-4) * 5) + 3 * (1 * 0 - 6 * 5)
    assert exp == 96 + 28 - 90 == 34
    col = -(-1) * (1 * 8 - (-4) * 5) + 6 * (2 * 8 - 3 * 5) - 0      # 둘째 열로 전개해도 같다
    assert col == 34
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
