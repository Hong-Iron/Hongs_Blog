---
layout: "note"
title: "07_reflection_verify.py"
display_title: "07_reflection_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/reflection/"
parent_title: "반사와 반전"
description: "수치해석 · 반사와 반전 검증 코드"
permalink: "/studies/numerical-analysis/code/07_reflection_verify/"
---
{% raw %}
[반사와 반전](/Hongs_Blog/studies/numerical-analysis/reflection/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""반사와 반전 문서의 주장 검증."""
import math, random


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(len(v))) for i in range(len(A))]


def close(a, b, e=1e-9):
    return all(abs(x - y) < e for x, y in zip(a, b))


def det3(m):
    return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
            + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))


def R2(t):
    return [[math.cos(t), -math.sin(t), 0], [math.sin(t), math.cos(t), 0], [0, 0, 1]]


def T2(a, b):
    return [[1, 0, a], [0, 1, b], [0, 0, 1]]


Fx = [[1, 0, 0], [0, -1, 0], [0, 0, 1]]                   # x축에 대한 반사


def main():
    assert mv(Fx, [3, 2, 1]) == [3, -2, 1]
    assert mv([[-1, 0, 0], [0, 1, 0], [0, 0, 1]], [3, 2, 1]) == [-3, 2, 1]
    # 2차원 원점 반전 (x, y) → (−x, −y)은 180° 회전과 같다
    assert close(mv(R2(math.pi), [3, 2, 1]), [-3, -2, 1])
    # 3차원 원점 반전은 행렬식 −1이라 회전이 아니다
    assert det3([[-1, 0, 0], [0, -1, 0], [0, 0, -1]]) == -1
    # 원점을 지나는 각 θ의 직선: R F R⁻¹ = [[cos2θ, sin2θ], [sin2θ, −cos2θ]]
    for th in (0.3, 1.0, 2.2):
        M = mm(R2(th), mm(Fx, R2(-th)))
        c, s = math.cos(2 * th), math.sin(2 * th)
        assert close(M[0][:2] + M[1][:2], [c, s, s, -c])
    # 카드 C2: y = x(θ = 45°)에 대한 반사로 (3, 1) → (1, 3)
    assert close(mv(mm(R2(math.pi / 4), mm(Fx, R2(-math.pi / 4))), [3, 1, 1]), [1, 3, 1])
    # 점 P = (0, 1)을 지나는 수평선 y = 1: X' = T R F R⁻¹ T⁻¹ X
    M = mm(T2(0, 1), mm(R2(0), mm(Fx, mm(R2(0), T2(0, -1)))))
    assert close(mv(M, [2, 3, 1]), [2, -1, 1])
    # 평면 반사: 점 P를 지나고 법선 n인 평면, X' = X − 2((X − P)·n̂)n̂ 와 슬라이드의 T R⁻¹ F_xy R T⁻¹ 비교
    random.seed(4)
    for _ in range(100):
        n = [random.uniform(-1, 1) for _ in range(3)]; ln = math.sqrt(sum(x * x for x in n)); n = [x / ln for x in n]
        P = [random.uniform(-2, 2) for _ in range(3)]; X = [random.uniform(-2, 2) for _ in range(3)]
        d = sum((X[i] - P[i]) * n[i] for i in range(3))
        ref = [X[i] - 2 * d * n[i] for i in range(3)]
        # R: n을 z축으로 돌리는 회전 (z축 회전 뒤 y축 회전)
        a = math.atan2(n[1], n[0]); b = math.atan2(math.hypot(n[0], n[1]), n[2])
        Rz = [[math.cos(-a), -math.sin(-a), 0], [math.sin(-a), math.cos(-a), 0], [0, 0, 1]]
        Ry = [[math.cos(-b), 0, math.sin(-b)], [0, 1, 0], [-math.sin(-b), 0, math.cos(-b)]]
        R = mm(Ry, Rz)
        assert close(mv(R, n), [0, 0, 1])
        Rt = [list(r) for r in zip(*R)]
        Fxy = [[1, 0, 0], [0, 1, 0], [0, 0, -1]]
        Y = [X[i] - P[i] for i in range(3)]
        Y = mv(Rt, mv(Fxy, mv(R, Y)))
        assert close([Y[i] + P[i] for i in range(3)], ref)
        twice = [ref[i] - 2 * sum((ref[j] - P[j]) * n[j] for j in range(3)) * n[i] for i in range(3)]
        assert close(twice, X)                                  # 두 번 반사하면 제자리
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
