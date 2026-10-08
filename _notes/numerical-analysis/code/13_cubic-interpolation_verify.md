---
layout: "note"
title: "13_cubic-interpolation_verify.py"
display_title: "13_cubic-interpolation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/cubic-interpolation-curve/"
parent_title: "3차 보간 곡선"
description: "수치해석 · 3차 보간 곡선 검증 코드"
permalink: "/studies/numerical-analysis/code/13_cubic-interpolation_verify/"
---
{% raw %}
[3차 보간 곡선](/Hongs_Blog/studies/numerical-analysis/cubic-interpolation-curve/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""3차 보간 곡선 문서의 주장 검증. 점은 튜플, 분수로 정확히 계산."""
from fractions import Fraction as F


def inv(A):
    n = len(A); M = [[F(x) for x in r] + [F(int(i == j)) for j in range(n)] for i, r in enumerate(A)]
    for c in range(n):
        p = next(r for r in range(c, n) if M[r][c] != 0); M[c], M[p] = M[p], M[c]
        M[c] = [x / M[c][c] for x in M[c]]
        for r in range(n):
            if r != c:
                M[r] = [x - M[r][c] * y for x, y in zip(M[r], M[c])]
    return [r[n:] for r in M]


def curve(M, P, u):
    """p(u) = u^T M p. P는 점 네 개."""
    uu = [F(1), u, u * u, u ** 3]
    b = [sum(uu[k] * M[k][i] for k in range(4)) for i in range(4)]      # 블렌딩 함수 b_i(u)
    return tuple(sum(b[i] * P[i][d] for i in range(4)) for d in range(len(P[0]))), b


def main():
    us = [F(0), F(1, 3), F(2, 3), F(1)]
    A = [[F(1), u, u * u, u ** 3] for u in us]
    MI = inv(A)
    slide = [[1, 0, 0, 0], [-5.5, 9, -4.5, 1], [9, -22.5, 18, -4.5], [-4.5, 13.5, -13.5, 4.5]]
    assert [[float(x) for x in r] for r in MI] == slide                     # 슬라이드 p.12
    P = [(0, 0), (1, 2), (2, 2), (3, 0)]
    for u, p in zip(us, P):
        assert curve(MI, P, u)[0] == p                                      # 네 점을 지난다
    for k in range(0, 31):
        u = F(k, 30)
        _, b = curve(MI, P, u)
        assert sum(b) == 1                                                  # 블렌딩 함수의 합 1
        # 슬라이드 p.14의 인수분해
        assert b[0] == F(-9, 2) * (u - F(1, 3)) * (u - F(2, 3)) * (u - 1)
        assert b[1] == F(27, 2) * u * (u - F(2, 3)) * (u - 1)
        assert b[2] == F(-27, 2) * u * (u - F(1, 3)) * (u - 1)
        assert b[3] == F(9, 2) * u * (u - F(1, 3)) * (u - F(2, 3))
    _, b = curve(MI, P, F(1, 2))
    assert b[0] == F(-1, 16) and b[0] < 0                                   # 음수 블렌딩 값
    # 예시 곡선의 u = 1/2 점
    assert curve(MI, P, F(1, 2))[0] == (F(3, 2), F(9, 4))                   # 카드 C2
    # 두 조각을 이으면 이음점에서 기울기가 다를 수 있다
    Q = [(3, 0), (4, -2), (5, 0), (6, 3)]
    def deriv(P, u):
        du = [F(0), F(1), 2 * u, 3 * u * u]
        return tuple(sum(sum(du[k] * MI[k][i] for k in range(4)) * P[i][c] for i in range(4)) for c in range(2))
    assert curve(MI, P, F(1))[0] == curve(MI, Q, F(0))[0]                   # 위치는 이어짐
    assert deriv(P, F(1)) != deriv(Q, F(0))                                 # 기울기는 다름
    assert deriv(P, F(1)) == (3, -9) and deriv(Q, F(0)) == (3, -15)
    # 음함수 표현: 반지름 2인 원 x² + y² − 4 = 0
    import math
    for t in (0.1, 1.3, 2.9):
        x, y = 2 * math.cos(t), 2 * math.sin(t)
        assert abs(x * x + y * y - 4) < 1e-12
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
