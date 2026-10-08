---
layout: "note"
title: "10_quaternion_verify.py"
display_title: "10_quaternion_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/quaternion/"
parent_title: "쿼터니언"
description: "수치해석 · 쿼터니언 검증 코드"
permalink: "/studies/numerical-analysis/code/10_quaternion_verify/"
---
{% raw %}
[쿼터니언](/Hongs_Blog/studies/numerical-analysis/quaternion/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""쿼터니언 문서의 주장 검증. q = (w, x, y, z)."""
import math, random


def qmul(p, q):
    w1, x1, y1, z1 = p; w2, x2, y2, z2 = q
    return (w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
            w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
            w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
            w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2)


def conj(q):
    return (q[0], -q[1], -q[2], -q[3])


def rotate(q, v):
    return qmul(qmul(q, (0,) + tuple(v)), conj(q))[1:]


def axis_angle(n, t):
    return (math.cos(t / 2),) + tuple(math.sin(t / 2) * a for a in n)


def mat(q):
    w, x, y, z = q   # 슬라이드 p.27
    return [[1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * w * z, 2 * x * z + 2 * w * y],
            [2 * x * y + 2 * w * z, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * w * x],
            [2 * x * z - 2 * w * y, 2 * y * z + 2 * w * x, 1 - 2 * x * x - 2 * y * y]]


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(3)) for i in range(3)]


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]


def Rx(t):
    c, s = math.cos(t), math.sin(t); return [[1, 0, 0], [0, c, -s], [0, s, c]]


def Ry(t):
    c, s = math.cos(t), math.sin(t); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]


def Rz(t):
    c, s = math.cos(t), math.sin(t); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]


def close(a, b, e=1e-9):
    return all(abs(x - y) < e for x, y in zip(a, b))


def main():
    one, i, j, k = (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1)
    neg = (-1, 0, 0, 0)
    assert qmul(i, i) == qmul(j, j) == qmul(k, k) == neg
    assert qmul(i, j) == k and qmul(j, i) == (0, 0, 0, -1)
    assert qmul(j, k) == i and qmul(k, i) == j and qmul(qmul(i, j), k) == neg
    # z축 90°: (1, 0, 0) → (0, 1, 0)
    q = axis_angle((0, 0, 1), math.pi / 2)
    assert close(rotate(q, (1, 0, 0)), (0, 1, 0))
    assert close(q, (math.sqrt(2) / 2, 0, 0, math.sqrt(2) / 2))
    # 카드 C2: x축 180° → q = (0, 1, 0, 0), (0, 1, 0) → (0, −1, 0)
    q = axis_angle((1, 0, 0), math.pi)
    assert close(q, (0, 1, 0, 0)) and close(rotate(q, (0, 1, 0)), (0, -1, 0))
    random.seed(10)
    for _ in range(300):
        n = [random.uniform(-1, 1) for _ in range(3)]; ln = math.sqrt(sum(a * a for a in n)); n = [a / ln for a in n]
        t = random.uniform(-3, 3); v = [random.uniform(-2, 2) for _ in range(3)]
        q = axis_angle(n, t)
        # 로드리게스 공식과 같다
        d = sum(a * b for a, b in zip(n, v)); c = [n[1] * v[2] - n[2] * v[1], n[2] * v[0] - n[0] * v[2], n[0] * v[1] - n[1] * v[0]]
        rod = [v[m] * math.cos(t) + c[m] * math.sin(t) + n[m] * d * (1 - math.cos(t)) for m in range(3)]
        assert close(rotate(q, v), rod)
        assert close(mv(mat(q), v), rod)                     # 행렬 공식
        assert close(rotate(tuple(-a for a in q), v), rod)   # q와 −q는 같은 회전
    # 슬라이드 p.26: q = q_x q_y q_z ↔ X' = Rx Ry Rz X
    for _ in range(100):
        a, b, g = (random.uniform(-3, 3) for _ in range(3))
        q = qmul(qmul(axis_angle((1, 0, 0), a), axis_angle((0, 1, 0), b)), axis_angle((0, 0, 1), g))
        M = mm(Rx(a), mm(Ry(b), Rz(g)))
        assert all(close(mat(q)[r], M[r]) for r in range(3))
        assert abs(sum(x * x for x in q) - 1) < 1e-12      # 단위 쿼터니언끼리 곱해도 단위
    # 곱하는 순서가 다르면 다른 회전
    p, q = axis_angle((1, 0, 0), 1.0), axis_angle((0, 1, 0), 1.0)
    assert not close(qmul(p, q), qmul(q, p))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
