---
layout: "note"
title: "06_coordinate-frame_verify.py"
display_title: "06_coordinate-frame_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/coordinate-frame/"
parent_title: "좌표계 변환"
description: "수치해석 · 좌표계 변환 검증 코드"
permalink: "/studies/numerical-analysis/code/06_coordinate-frame_verify/"
---
{% raw %}
[좌표계 변환](/Hongs_Blog/studies/numerical-analysis/coordinate-frame/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""좌표계 변환 문서의 주장 검증."""
import math, random


def cross(a, b):
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(len(v))) for i in range(len(A))]


def frame_matrix(X0, U, V):
    N = cross(U, V); ln = math.sqrt(dot(N, N)); N = tuple(x / ln for x in N)
    Rinv = [list(U) + [0], list(V) + [0], list(N) + [0], [0, 0, 0, 1]]   # 행에 U, V, N
    Tinv = [[1, 0, 0, -X0[0]], [0, 1, 0, -X0[1]], [0, 0, 1, -X0[2]], [0, 0, 0, 1]]
    return mm(Rinv, Tinv), Rinv, Tinv, N


def main():
    X0, U, V = (1, 2, 3), (0, 1, 0), (-1, 0, 0)
    W, Rinv, Tinv, N = frame_matrix(X0, U, V)
    assert N == (0, 0, 1)
    assert mv(W, [1, 3, 3, 1]) == [1, 0, 0, 1]                    # 예시로 보기
    assert mv(W, [1, 2, 3, 1]) == [0, 0, 0, 1]                    # 새 원점은 (0, 0, 0)
    assert mv(W, [0, 2, 5, 1]) == [0, 1, 2, 1]                    # 카드 C2
    # 순서가 중요하다: R⁻¹T⁻¹ ≠ T⁻¹R⁻¹
    assert mv(mm(Tinv, Rinv), [1, 3, 3, 1]) != mv(W, [1, 3, 3, 1])
    # 좌표계를 +t만큼 옮기는 것 = 점을 −t만큼 옮기는 것
    assert mv(frame_matrix((5, 0, 0), (1, 0, 0), (0, 1, 0))[0], [7, 1, 1, 1]) == [2, 1, 1, 1]
    # 좌표계를 θ만큼 돌리는 것 = 점을 −θ만큼 돌리는 것
    th = 0.5; c, s = math.cos(th), math.sin(th)
    W2 = frame_matrix((0, 0, 0), (c, s, 0), (-s, c, 0))[0]
    p = [2.0, 1.0, 0.0]
    q = mv(W2, p + [1])
    r = [c * p[0] + s * p[1], -s * p[0] + c * p[1], 0]                 # −θ 회전
    assert all(abs(a - b) < 1e-12 for a, b in zip(q, r))
    # 로컬 좌표 = (U·(X−X0), V·(X−X0), N·(X−X0)), 되돌리면 X0 + aU + bV + cN
    random.seed(2)
    for _ in range(100):
        a = random.random() * 6
        U = (math.cos(a), math.sin(a), 0); V = (0, 0, 1)
        X0 = tuple(random.uniform(-3, 3) for _ in range(3)); X = [random.uniform(-3, 3) for _ in range(3)]
        W, _, _, N = frame_matrix(X0, U, V)
        loc = mv(W, X + [1])
        back = [X0[i] + loc[0] * U[i] + loc[1] * V[i] + loc[2] * N[i] for i in range(3)]
        assert all(abs(x - y) < 1e-9 for x, y in zip(back, X))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
