---
layout: "note"
title: "04_homogeneous-coordinates_verify.py"
display_title: "04_homogeneous-coordinates_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/homogeneous-coordinates/"
parent_title: "동차 좌표"
description: "수치해석 · 동차 좌표 검증 코드"
permalink: "/studies/numerical-analysis/code/04_homogeneous-coordinates_verify/"
---
{% raw %}
[동차 좌표](/Hongs_Blog/studies/numerical-analysis/homogeneous-coordinates/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""동차 좌표 문서의 주장 검증. 2차원 점은 (x, y, 1), 3×3 행렬."""
import math, random
from fractions import Fraction as F


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(len(v))) for i in range(len(A))]


def T(tx, ty):
    return [[1, 0, tx], [0, 1, ty], [0, 0, 1]]


def S(sx, sy):
    return [[sx, 0, 0], [0, sy, 0], [0, 0, 1]]


def R(c, s):
    return [[c, -s, 0], [s, c, 0], [0, 0, 1]]


def main():
    # 평행이동이 행렬 곱이 된다
    assert mv(T(3, -2), [5, 7, 1]) == [8, 5, 1]
    # (hx, hy, h)는 모두 같은 점: 전단으로 본 평행이동 (슬라이드 p.39)
    h = 4
    out = mv(T(3, -2), [5 * h, 7 * h, h]); assert [out[0] / out[2], out[1] / out[2]] == [8, 5]
    # 방향 벡터(w = 0)는 평행이동되지 않는다
    assert mv(T(3, -2), [1, 0, 0]) == [1, 0, 0]
    # 점 P = (1, 1)을 중심으로 90° 회전: X' = R(X − P) + P = T(P) R T(−P) X
    H = mm(T(1, 1), mm(R(0, 1), T(-1, -1)))
    assert mv(H, [2, 1, 1]) == [1, 2, 1]                     # 예시로 보기
    assert mv(H, [1, 1, 1]) == [1, 1, 1]                     # 중심은 그대로
    # 순서: TM = [L T; 0 1], MT = [L LT; 0 1] (슬라이드 p.41)
    L = S(2, 2)
    TM = mm(T(3, 0), L); MT = mm(L, T(3, 0))
    assert TM[0][2] == 3 and MT[0][2] == 6 and TM != MT
    assert mv(TM, [1, 1, 1]) == [5, 2, 1] and mv(MT, [1, 1, 1]) == [8, 2, 1]   # 카드 C2
    # 두 변환을 이으면 [M2 M1, M2 T1 + T2] (슬라이드 p.43)
    random.seed(3)
    for _ in range(200):
        M1 = [[random.randint(-3, 3) for _ in range(2)] for _ in range(2)]
        M2 = [[random.randint(-3, 3) for _ in range(2)] for _ in range(2)]
        T1 = [random.randint(-3, 3) for _ in range(2)]; T2 = [random.randint(-3, 3) for _ in range(2)]
        H1 = [M1[0] + [T1[0]], M1[1] + [T1[1]], [0, 0, 1]]
        H2 = [M2[0] + [T2[0]], M2[1] + [T2[1]], [0, 0, 1]]
        H21 = mm(H2, H1)
        M21 = mm(M2, M1); t = [a + b for a, b in zip(mv(M2, T1), T2)]
        assert H21 == [M21[0] + [t[0]], M21[1] + [t[1]], [0, 0, 1]]
    # 역행렬: H = M T(먼저 평행이동) 이면 H⁻¹ = T⁻¹ M⁻¹ = [M⁻¹, −T_s]
    Ms = [[F(2), F(1)], [F(1), F(1)]]; Ts = [F(3), F(-1)]
    Minv = [[F(1), F(-1)], [F(-1), F(2)]]
    Mh = [Ms[0] + [0], Ms[1] + [0], [0, 0, 1]]; Th = T(*Ts)
    Hh = mm(Mh, Th)
    Hinv = mm(T(-Ts[0], -Ts[1]), [Minv[0] + [0], Minv[1] + [0], [0, 0, 1]])
    assert Hinv[0][2] == -3 and Hinv[1][2] == 1
    assert mm(Hh, Hinv) == [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    # 연속 회전은 각을 더한다
    a, b = 0.4, 1.1
    Rab = mm(R(math.cos(b), math.sin(b)), R(math.cos(a), math.sin(a)))
    assert abs(Rab[0][0] - math.cos(a + b)) < 1e-12 and abs(Rab[1][0] - math.sin(a + b)) < 1e-12
    # 회전의 역행렬은 전치
    c, s = math.cos(a), math.sin(a)
    I = mm(R(c, s), R(c, -s)); assert all(abs(I[i][j] - (i == j)) < 1e-12 for i in range(3) for j in range(3))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
