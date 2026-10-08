---
layout: "note"
title: "12_distance-intersection_verify.py"
display_title: "12_distance-intersection_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/distance-intersection/"
parent_title: "점·직선·평면 사이의 거리와 교점"
description: "수치해석 · 점·직선·평면 사이의 거리와 교점 검증 코드"
permalink: "/studies/numerical-analysis/code/12_distance-intersection_verify/"
---
{% raw %}
[점·직선·평면 사이의 거리와 교점](/Hongs_Blog/studies/numerical-analysis/distance-intersection/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""점·직선·평면 사이의 거리와 교점 문서의 주장 검증."""
import math, random
from fractions import Fraction as F


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def sub(a, b):
    return [x - y for x, y in zip(a, b)]


def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def solve3(A, b):
    def det(m):
        return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))
    d = det(A); out = []
    for c in range(3):
        M = [list(r) for r in A]
        for r in range(3):
            M[r][c] = b[r]
        out.append(F(det(M), d))
    return out


def point_line(Q, S, V):
    w = sub(Q, S)
    return math.sqrt(dot(w, w) - dot(w, V) ** 2 / dot(V, V))


def line_line(S1, V1, S2, V2):
    a, b, c = dot(V1, V1), dot(V1, V2), dot(V2, V2)
    den = b * b - a * c
    if den == 0:
        return None
    r1, r2 = dot(sub(S2, S1), V1), dot(sub(S2, S1), V2)
    t1 = (-c * r1 + b * r2) / den; t2 = (-b * r1 + a * r2) / den     # 슬라이드 p.37의 역행렬
    P1 = [s + t1 * v for s, v in zip(S1, V1)]; P2 = [s + t2 * v for s, v in zip(S2, V2)]
    return math.sqrt(dot(sub(P1, P2), sub(P1, P2))), t1, t2


def main():
    assert point_line([1, 1, 0], [0, 0, 0], [1, 0, 0]) == 1
    assert abs(point_line([0, 0, 5], [0, 0, 0], [1, 1, 0]) - 5) < 1e-12
    assert abs(point_line([2, 3, 4], [1, 0, 0], [0, 0, 2]) - math.sqrt(10)) < 1e-12   # 카드 C2
    random.seed(12)
    for _ in range(100):
        Q, S, V = ([random.uniform(-3, 3) for _ in range(3)] for _ in range(3))
        brute = min(math.dist(Q, [s + t / 200 * v for s, v in zip(S, V)]) for t in range(-4000, 4001))
        assert abs(point_line(Q, S, V) - brute) < 1e-2
    # 꼬인 두 직선: x축과, (0, 1, 0)을 지나 z 방향 직선 → 거리 1, t1 = 0, t2 = 0
    d, t1, t2 = line_line([0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1])
    assert d == 1 and t1 == 0 and t2 == 0
    for _ in range(50):
        S1, V1, S2, V2 = ([random.uniform(-3, 3) for _ in range(3)] for _ in range(4))
        d, t1, t2 = line_line(S1, V1, S2, V2)
        P1 = [s + t1 * v for s, v in zip(S1, V1)]; P2 = [s + t2 * v for s, v in zip(S2, V2)]
        w = sub(P1, P2)
        assert abs(dot(w, V1)) < 1e-9 and abs(dot(w, V2)) < 1e-9     # 가장 짧은 선분은 두 직선에 수직
    assert line_line([0, 0, 0], [1, 2, 3], [5, 0, 0], [2, 4, 6]) is None   # 평행이면 분모 0
    # 점과 평면: d = N·Q − N·P. N이 단위 벡터일 때만 거리
    N, P, Q = [0, 0, 1], [0, 0, 1], [3, 4, 5]
    assert dot(N, Q) - dot(N, P) == 4
    assert dot([0, 0, 2], Q) - dot([0, 0, 2], P) == 8
    assert dot(N, [3, 4, -2]) - dot(N, P) < 0                    # 법선 반대쪽
    # 직선과 평면의 교점 t = −(N·S + D)/(N·V)
    D = -dot(N, P); S, V = [1, 1, 3], [1, 0, -1]
    t = F(-(dot(N, S) + D), dot(N, V)); assert t == 2 and [s + t * v for s, v in zip(S, V)] == [3, 1, 1]
    # 세 평면의 교점 Q = M⁻¹ [N_i·P_i]
    Ns = [[1, 0, 0], [0, 1, 0], [1, 1, 1]]; Ps = [[2, 0, 0], [0, 3, 0], [0, 0, 6]]
    Qp = solve3(Ns, [dot(n, p) for n, p in zip(Ns, Ps)]); assert Qp == [2, 3, 1]
    # 두 평면의 교선: Q = [N1; N2; N1×N2]⁻¹ [N1·P1, N2·P2, 0], 방향 N1×N2
    N1, P1, N2, P2 = [1, 0, 0], [2, 0, 0], [0, 1, 1], [0, 1, 1]
    Qp = solve3([N1, N2, cross(N1, N2)], [dot(N1, P1), dot(N2, P2), 0])
    assert Qp == [2, 1, 1]
    for s in (-2, 0, 3):
        X = [q + s * c for q, c in zip(Qp, cross(N1, N2))]
        assert dot(N1, X) == dot(N1, P1) and dot(N2, X) == dot(N2, P2)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
