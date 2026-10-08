---
layout: "note"
title: "03_transformation-classes_verify.py"
display_title: "03_transformation-classes_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/transformation-classes/"
parent_title: "기하 변환의 종류"
description: "수치해석 · 기하 변환의 종류 검증 코드"
permalink: "/studies/numerical-analysis/code/03_transformation-classes_verify/"
---
{% raw %}
[기하 변환의 종류](/Hongs_Blog/studies/numerical-analysis/transformation-classes/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""기하 변환의 종류 문서의 주장 검증. 2차원 변환 x' = Mx + t."""
import math, random


def apply(M, t, p):
    return (M[0][0] * p[0] + M[0][1] * p[1] + t[0], M[1][0] * p[0] + M[1][1] * p[1] + t[1])


def dist(p, q):
    return math.hypot(p[0] - q[0], p[1] - q[1])


def angle(p, q, r):
    """q에서 p와 r 쪽으로 난 두 선분 사이의 각."""
    a = (p[0] - q[0], p[1] - q[1]); b = (r[0] - q[0], r[1] - q[1])
    return math.acos(max(-1, min(1, (a[0] * b[0] + a[1] * b[1]) / (math.hypot(*a) * math.hypot(*b)))))


def det(M):
    return M[0][0] * M[1][1] - M[0][1] * M[1][0]


def check(M, t, keeps_dist, keeps_angle, k=1.0):
    random.seed(7)
    for _ in range(300):
        p, q, r = [(random.uniform(-3, 3), random.uniform(-3, 3)) for _ in range(3)]
        P, Q, R = (apply(M, t, x) for x in (p, q, r))
        if keeps_dist:
            assert abs(dist(P, Q) - dist(p, q)) < 1e-9
        if keeps_angle:
            assert abs(angle(P, Q, R) - angle(p, q, r)) < 1e-7
            assert abs(dist(P, Q) - k * dist(p, q)) < 1e-9
        # 아핀이면 언제나: 중점은 중점으로, 평행은 평행으로
        m = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
        Pm = apply(M, t, m)
        assert abs(Pm[0] - (P[0] + Q[0]) / 2) < 1e-9 and abs(Pm[1] - (P[1] + Q[1]) / 2) < 1e-9
        d = (q[0] - p[0], q[1] - p[1]); s = (r[0] + d[0], r[1] + d[1])
        S = apply(M, t, s)
        D1 = (Q[0] - P[0], Q[1] - P[1]); D2 = (S[0] - R[0], S[1] - R[1])
        assert abs(D1[0] * D2[1] - D1[1] * D2[0]) < 1e-9


def main():
    th = 0.7
    rot = [[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]]
    ref = [[1, 0], [0, -1]]
    for M in (rot, ref):                                     # 강체 변환: M^T M = I, det = ±1
        MtM = [[sum(M[k][i] * M[k][j] for k in range(2)) for j in range(2)] for i in range(2)]
        assert all(abs(MtM[i][j] - (i == j)) < 1e-12 for i in range(2) for j in range(2))
        check(M, (2, -1), True, True)
    assert abs(det(rot) - 1) < 1e-12 and det(ref) == -1
    sim = [[2 * x for x in row] for row in rot]                 # 닮음: kM, k = 2
    check(sim, (1, 1), False, True, k=2)
    shear = [[1, 1.5], [0, 1]]                                  # x 방향 전단, k = 1.5
    assert det(shear) == 1
    check(shear, (0, 0), False, False)
    assert abs(angle((1, 0), (0, 0), (0, 1)) - angle(apply(shear, (0, 0), (1, 0)), (0, 0), apply(shear, (0, 0), (0, 1)))) > 0.5
    aff = [[2, 1], [0.5, 3]]
    assert det(aff) != 0
    check(aff, (4, -2), False, False)
    # 카드 C2: [[0, -2], [2, 0]]은 90° 회전 뒤 2배 (닮음)
    M = [[0, -2], [2, 0]]
    check(M, (0, 0), False, True, k=2)
    # 원근 투영은 평행을 지키지 않는다: z = 1과 z = 3 사이로 뻗은 두 평행선 x = ±1
    proj = lambda x, z: x / z
    w1 = proj(1, 1) - proj(-1, 1); w3 = proj(1, 3) - proj(-1, 3)
    assert w1 == 2 and abs(w3 - 2 / 3) < 1e-12
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
