---
layout: "note"
title: "08_axis-rotation_verify.py"
display_title: "08_axis-rotation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/axis-rotation/"
parent_title: "임의 축 회전"
description: "수치해석 · 임의 축 회전 검증 코드"
permalink: "/studies/numerical-analysis/code/08_axis-rotation_verify/"
---
{% raw %}
[임의 축 회전](/Hongs_Blog/studies/numerical-analysis/axis-rotation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""임의 축 회전 문서의 주장 검증. 오른손 좌표계, 반시계 방향이 양의 각."""
import math, random


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(3)) for i in range(3)]


def Rx(t):
    c, s = math.cos(t), math.sin(t); return [[1, 0, 0], [0, c, -s], [0, s, c]]


def Ry(t):
    c, s = math.cos(t), math.sin(t); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]


def Rz(t):
    c, s = math.cos(t), math.sin(t); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]


def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def rodrigues(A, P, t):
    """A는 단위 벡터. P' = P cosθ + (A×P) sinθ + A(A·P)(1 − cosθ)."""
    d = sum(a * p for a, p in zip(A, P)); c = cross(A, P)
    return [P[i] * math.cos(t) + c[i] * math.sin(t) + A[i] * d * (1 - math.cos(t)) for i in range(3)]


def five_steps(A, t):
    """슬라이드 p.16의 X' = R_α⁻¹ R_β⁻¹ R_θ R_β R_α X. R_α: z축 회전으로 A를 xz 평면에, R_β: y축 회전으로 x축에."""
    al = math.atan2(A[1], A[0]); be = math.atan2(A[2], math.hypot(A[0], A[1]))
    Ra, Rb = Rz(-al), Ry(be)
    assert all(abs(x - y) < 1e-9 for x, y in zip(mv(Rb, mv(Ra, A)), [1, 0, 0]))
    return mm(Rz(al), mm(Ry(-be), mm(Rx(t), mm(Rb, Ra))))


def close(a, b, e=1e-9):
    return all(abs(x - y) < e for x, y in zip(a, b))


def main():
    q = math.pi / 2
    assert close(mv(Rz(q), [1, 0, 0]), [0, 1, 0])          # z축: x → y
    assert close(mv(Rx(q), [0, 1, 0]), [0, 0, 1])          # x축: y → z
    assert close(mv(Ry(q), [0, 0, 1]), [1, 0, 0])          # y축: z → x
    # 순서를 바꾸면 결과가 다르다
    assert not close(mv(mm(Rx(q), Ry(q)), [1, 0, 0]), mv(mm(Ry(q), Rx(q)), [1, 0, 0]))
    # 다섯 단계 = 로드리게스 공식
    random.seed(8)
    for _ in range(300):
        A = [random.uniform(-1, 1) for _ in range(3)]; ln = math.sqrt(sum(a * a for a in A)); A = [a / ln for a in A]
        t = random.uniform(-3, 3); P = [random.uniform(-3, 3) for _ in range(3)]
        assert close(mv(five_steps(A, t), P), rodrigues(A, P, t))
    # (1,1,1) 축으로 120° 돌리면 x → y → z → x
    A = [1 / math.sqrt(3)] * 3
    assert close(rodrigues(A, [1, 0, 0], 2 * math.pi / 3), [0, 1, 0])
    assert close(rodrigues(A, [0, 1, 0], 2 * math.pi / 3), [0, 0, 1])
    # 카드 C2: z축 (0,0,1)로 90°, P = (2, 0, 5) → (0, 2, 5)
    assert close(rodrigues([0, 0, 1], [2, 0, 5], math.pi / 2), [0, 2, 5])
    # 축 방향 성분은 그대로, 길이도 그대로
    P = [1, 2, 3]; r = rodrigues(A, P, 1.234)
    assert abs(sum(r) - sum(P)) < 1e-9 and abs(sum(x * x for x in r) - 14) < 1e-9
    # A가 단위 벡터가 아니면 공식이 틀린다
    assert not close(rodrigues([0, 0, 2], [2, 0, 5], math.pi / 2), [0, 2, 5])
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
