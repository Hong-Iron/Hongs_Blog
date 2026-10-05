---
layout: "note"
title: "12_linear-transformations_verify.py"
display_title: "12_linear-transformations_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/linear-transformations/"
parent_title: "선형변환"
description: "선형대수학 · 선형변환 검증 코드"
permalink: "/studies/linear-algebra/code/12_linear-transformations_verify/"
---
{% raw %}
[선형변환](/Hongs_Blog/studies/linear-algebra/linear-transformations/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형변환 검증.

문서: 12.선형변환 (예시 표, 정의, 동치, 기하적 성질, 증명, 예제, 오해, 카드 C1~C4)
주장 1: 표 — 회전·반사·사영·전단 행렬이 e1, e2를 표대로 보낸다(θ, k 무작위).
주장 2: 회전은 길이·내적을 보존, R_α R_β = R_{α+β}, (cos(θ+90°), sin(θ+90°)) = (-sin θ, cos θ).
주장 3: 사영은 핵 (0,1)을 가짐, 반사 두 번은 I, 전단은 넓이(행렬식) 1.
주장 4: 무작위 행렬에서 직선의 상이 직선(세 점이 한 직선), 평행선의 상이 평행, 등간격 점의 상이 등간격, T(0) = 0.
주장 5: 합성 — S(T(x)) = (BA)x.
주장 6: 예제·카드 C1 — y = x 반사 [[0,1],[1,0]]: (3,1) -> (1,3), (2,2) 고정, A² = I.
주장 7: 카드 C2 — R90(2,1) = (-1,2). 카드 C3 — (x², y) 비선형. 오해 — diag(2,1)은 길이를 바꾼다, 평행이동은 비선형.
"""
import math
import random


def mv(A, x):
    return tuple(sum(a * b for a, b in zip(row, x)) for row in A)


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def R(t):
    return [[math.cos(t), -math.sin(t)], [math.sin(t), math.cos(t)]]


def close(u, v, tol=1e-9):
    return all(abs(a - b) < tol for a, b in zip(u, v))


def cross(u, v):
    return u[0] * v[1] - u[1] * v[0]


def main():
    rng = random.Random(12)
    for _ in range(200):
        t, k = rng.uniform(-7, 7), rng.uniform(-5, 5)
        assert close(mv(R(t), (1, 0)), (math.cos(t), math.sin(t))) and close(mv(R(t), (0, 1)), (-math.sin(t), math.cos(t)))
        assert close((math.cos(t + math.pi / 2), math.sin(t + math.pi / 2)), (-math.sin(t), math.cos(t)))
        Sh = [[1, k], [0, 1]]
        assert mv(Sh, (1, 0)) == (1, 0) and close(mv(Sh, (0, 1)), (k, 1))
    Ref, P = [[1, 0], [0, -1]], [[1, 0], [0, 0]]
    assert mv(Ref, (1, 0)) == (1, 0) and mv(Ref, (0, 1)) == (0, -1)
    assert mv(P, (1, 0)) == (1, 0) and mv(P, (0, 1)) == (0, 0)
    print("[OK] 주장 1·스스로 설명 2: 표의 행렬")

    for _ in range(300):
        a, b = rng.uniform(-5, 5), rng.uniform(-5, 5)
        u, v = (rng.uniform(-3, 3), rng.uniform(-3, 3)), (rng.uniform(-3, 3), rng.uniform(-3, 3))
        Ru, Rv = mv(R(a), u), mv(R(a), v)
        assert abs(sum(x * y for x, y in zip(Ru, Rv)) - sum(x * y for x, y in zip(u, v))) < 1e-9
        AB = mm(R(a), R(b))
        assert all(close(AB[i], R(a + b)[i]) for i in range(2))
    print("[OK] 주장 2: 회전의 성질")

    assert mv(P, (0, 1)) == (0, 0) and mm(Ref, Ref) == [[1, 0], [0, 1]]
    assert all(1 * 1 - k * 0 == 1 for k in range(-5, 6))
    print("[OK] 주장 3: 사영·반사·전단")

    for _ in range(300):
        A = [[rng.uniform(-3, 3) for _ in range(2)] for _ in range(2)]
        p, d, q = [(rng.uniform(-3, 3), rng.uniform(-3, 3)) for _ in range(3)]
        pts = [mv(A, (p[0] + t * d[0], p[1] + t * d[1])) for t in (0, 1, 2, 3.5)]
        for x in pts[1:]:
            assert abs(cross((x[0] - pts[0][0], x[1] - pts[0][1]), mv(A, d))) < 1e-9
        assert close((pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]), (pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]))
        pts2 = [mv(A, (q[0] + t * d[0], q[1] + t * d[1])) for t in (0, 1)]
        dir1 = (pts[1][0] - pts[0][0], pts[1][1] - pts[0][1])
        dir2 = (pts2[1][0] - pts2[0][0], pts2[1][1] - pts2[0][1])
        assert abs(cross(dir1, dir2)) < 1e-9
        assert mv(A, (0, 0)) == (0, 0)
    print("[OK] 주장 4·카드 C4: 직선, 평행, 등간격, 원점")

    for _ in range(200):
        A = [[rng.randint(-5, 5) for _ in range(3)] for _ in range(2)]
        B = [[rng.randint(-5, 5) for _ in range(2)] for _ in range(4)]
        x = [rng.randint(-5, 5) for _ in range(3)]
        assert mv(B, mv(A, x)) == mv(mm(B, A), x)
    print("[OK] 주장 5: 합성 = 곱")

    F = [[0, 1], [1, 0]]
    assert mv(F, (3, 1)) == (1, 3) and mv(F, (2, 2)) == (2, 2) and mm(F, F) == [[1, 0], [0, 1]]
    assert mv(F, (1, 0)) == (0, 1) and mv(F, (0, 1)) == (1, 0)
    print("[OK] 주장 6·예제·카드 C1")

    assert mv([[0, -1], [1, 0]], (2, 1)) == (-1, 2)
    sq = lambda v: (v[0] ** 2, v[1])
    assert sq((2, 0)) == (4, 0) and tuple(2 * c for c in sq((1, 0))) == (2, 0)
    D = [[2, 0], [0, 1]]
    assert math.hypot(*mv(D, (1, 0))) == 2
    tr = lambda v: (v[0] + 1, v[1])
    assert tr((0, 0)) != (0, 0)
    print("[OK] 주장 7·카드 C2·C3·오해")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
