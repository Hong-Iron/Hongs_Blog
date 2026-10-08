---
layout: "note"
title: "02_lines-planes_verify.py"
display_title: "02_lines-planes_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/lines-planes/"
parent_title: "직선과 평면의 방정식"
description: "수치해석 · 직선과 평면의 방정식 검증 코드"
permalink: "/studies/numerical-analysis/code/02_lines-planes_verify/"
---
{% raw %}
[직선과 평면의 방정식](/Hongs_Blog/studies/numerical-analysis/lines-planes/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""직선과 평면의 방정식 문서의 주장 검증."""
from fractions import Fraction as F


def cross(a, b):
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def sub(a, b):
    return tuple(x - y for x, y in zip(a, b))


def solve3(A, b):
    """크라메르 공식. 행렬식이 0이면 None."""
    def det(m):
        return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]))
    d = det(A)
    if d == 0:
        return None
    out = []
    for c in range(3):
        M = [list(r) for r in A]
        for r in range(3):
            M[r][c] = b[r]
        out.append(F(det(M), d))
    return tuple(out)


def main():
    # 슬라이드 p.19: x = u + 1, y = 2u − 1
    pts = {u: (u + 1, 2 * u - 1) for u in (-1, 0, F(1, 2), 1)}
    assert pts[-1] == (0, -3) and pts[0] == (1, -1) and pts[F(1, 2)] == (F(3, 2), 0) and pts[1] == (2, 1)
    # 슬라이드 p.23: x = −4u + 1, y = 3u + 2, z = 5u − 3
    seg = lambda u: (-4 * u + 1, 3 * u + 2, 5 * u - 3)
    assert seg(0) == (1, 2, -3) and seg(1) == (-3, 5, 2)
    assert seg(F(1, 2)) == (-1, F(7, 2), F(-1, 2))                      # 카드 C2
    # 두 점을 지나는 직선 x = p0 + (p1 − p0)u
    p0, p1 = (1, 2, -3), (-3, 5, 2)
    assert all(seg(u) == tuple(a + (b - a) * u for a, b in zip(p0, p1)) for u in (0, F(1, 3), 2))
    # 점이 직선 위에 있는지: u_x = u_y = u_z (a의 성분이 0이 아닐 때)
    a, b = (-4, 3, 5), (1, 2, -3)
    us = lambda p: tuple(F(pi - bi, ai) for pi, ai, bi in zip(p, a, b))
    assert len(set(us(seg(F(2, 7))))) == 1 and len(set(us((0, 0, 0)))) > 1
    # 성분이 0이면 나눌 수 없다: 방향 (1, 0, 0)
    try:
        F(1, 0)
        raise AssertionError
    except ZeroDivisionError:
        pass
    # 2차원 직선 2x + y − 4 = 0의 양쪽
    f = lambda x, y: 2 * x + y - 4
    assert f(1, 2) == 0 and f(0, 0) < 0 and f(3, 3) > 0 and f(0, 0) * f(3, 3) < 0
    # 세 점을 지나는 평면: a'x + b'y + c'z + 1 = 0
    sol = solve3([(2, 0, 0), (0, 3, 0), (0, 0, 6)], (-1, -1, -1))
    assert sol == (F(-1, 2), F(-1, 3), F(-1, 6))                          # x/2 + y/3 + z/6 = 1
    # 원점을 지나는 평면이면 d = 0이라 나눌 수 없다: 세 점 (1,0,0), (0,1,0), (1,1,0)은 z = 0
    assert solve3([(1, 0, 0), (0, 1, 0), (1, 1, 0)], (-1, -1, -1)) is None
    # 법선: 세 점의 두 차이 벡터의 외적
    P, Q, R = (2, 0, 0), (0, 3, 0), (0, 0, 6)
    n = cross(sub(Q, P), sub(R, P))
    assert n == (18, 12, 6) and dot(n, sub((1, 1, 1), P)) == 18 + 12 + 6 - 36
    # 직선과 평면의 교점 u = −(b − x0)·n / (a·n)
    a, b, x0, n = (1, 1, 1), (0, 0, 0), (0, 0, 2), (0, 0, 1)
    u = F(-dot(sub(b, x0), n), dot(a, n)); assert u == 2
    assert tuple(ai * u + bi for ai, bi in zip(a, b)) == (2, 2, 2)
    a2 = (1, 1, 0)
    assert dot(a2, n) == 0 and dot(sub(b, x0), n) != 0                    # 평행, 만나지 않음
    assert dot(a2, n) == 0 and dot(sub((5, 5, 2), x0), n) == 0            # 평면 위의 직선
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
