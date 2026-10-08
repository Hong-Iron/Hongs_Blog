---
layout: "note"
title: "17_surface-patches_verify.py"
display_title: "17_surface-patches_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/surface-patches/"
parent_title: "매개변수 곡면 패치"
description: "수치해석 · 매개변수 곡면 패치 검증 코드"
permalink: "/studies/numerical-analysis/code/17_surface-patches_verify/"
---
{% raw %}
[매개변수 곡면 패치](/Hongs_Blog/studies/numerical-analysis/surface-patches/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""매개변수 곡면 패치 문서의 주장 검증."""
import random
from fractions import Fraction as F
from math import comb


def lerp(a, b, t):
    return tuple(x + (y - x) * t for x, y in zip(a, b))


def bilinear(P00, P10, P01, P11, u, v):
    w = [(1 - u) * (1 - v), u * (1 - v), (1 - u) * v, u * v]
    return tuple(sum(wi * p[d] for wi, p in zip(w, (P00, P10, P01, P11))) for d in range(3))


def H(u):
    return [1 - 3 * u * u + 2 * u ** 3, 3 * u * u - 2 * u ** 3, u - 2 * u * u + u ** 3, -u * u + u ** 3]


def dH(u):
    return [-6 * u + 6 * u * u, 6 * u - 6 * u * u, 1 - 4 * u + 3 * u * u, -2 * u + 3 * u * u]


def bicubic(G, u, v, du=False, dv=False):
    """G: 4×4 기하 행렬(슬라이드 p.10의 배치), 성분은 스칼라."""
    a = dH(u) if du else H(u); b = dH(v) if dv else H(v)
    return sum(a[i] * G[i][j] * b[j] for i in range(4) for j in range(4))


def bern(i, n, t):
    return comb(n, i) * t ** i * (1 - t) ** (n - i)


def bez_surf(P, u, v):
    n, m = len(P) - 1, len(P[0]) - 1
    return tuple(sum(P[i][j][d] * bern(i, n, u) * bern(j, m, v) for i in range(n + 1) for j in range(m + 1)) for d in range(3))


MS = [[F(v, 6) for v in r] for r in [[1, 4, 1, 0], [-3, 0, 3, 0], [3, -6, 3, 0], [-1, 3, -3, 1]]]


def spline_surf(P, u, v):
    uu = [1, u, u * u, u ** 3]; vv = [1, v, v * v, v ** 3]
    a = [sum(uu[k] * MS[k][i] for k in range(4)) for i in range(4)]
    b = [sum(vv[k] * MS[k][j] for k in range(4)) for j in range(4)]
    return sum(a[i] * P[i][j] * b[j] for i in range(4) for j in range(4))


def main():
    P00, P10, P01, P11 = (0, 0, 0), (2, 0, 1), (0, 2, 1), (2, 2, 0)
    for u in (F(0), F(1, 4), F(1, 2), F(1)):
        for v in (F(0), F(1, 3), F(1)):
            nested = lerp(lerp(P00, P01, v), lerp(P10, P11, v), u)          # 슬라이드 p.6의 두 단계
            assert bilinear(P00, P10, P01, P11, u, v) == nested
    assert bilinear(P00, P10, P01, P11, F(1, 2), F(1, 2)) == (1, 1, F(1, 2))  # 카드 C2
    # 경계는 직선: v = 0이면 u에 대해 일차
    e = [bilinear(P00, P10, P01, P11, F(k, 4), F(0)) for k in range(5)]
    assert all(e[k + 1][d] - e[k][d] == e[1][d] - e[0][d] for k in range(4) for d in range(3))
    # 쌍3차 패치: 꼭짓점, 접선, 꼬임 벡터를 그대로 재현
    random.seed(17)
    G = [[F(random.randint(-5, 5)) for _ in range(4)] for _ in range(4)]
    # 배치: [[P00, P01, Pv00, Pv01], [P10, P11, Pv10, Pv11], [Pu00, Pu01, Puv00, Puv01], [Pu10, Pu11, Puv10, Puv11]]
    for (u, v), (i, j) in {(0, 0): (0, 0), (0, 1): (0, 1), (1, 0): (1, 0), (1, 1): (1, 1)}.items():
        u, v = F(u), F(v)
        assert bicubic(G, u, v) == G[i][j]
        assert bicubic(G, u, v, du=True) == G[i + 2][j]
        assert bicubic(G, u, v, dv=True) == G[i][j + 2]
        assert bicubic(G, u, v, du=True, dv=True) == G[i + 2][j + 2]   # 꼬임 벡터 P_uv
    # 경계 곡선 u = 0은 에르미트 곡선: 점 P00, P01과 접선 Pv00, Pv01
    for v in (F(1, 5), F(1, 2)):
        assert bicubic(G, F(0), v) == sum(h * g for h, g in zip(H(v), G[0]))
    # 베지어 곡면: 꼭짓점과 가장자리 (슬라이드 p.13~14)
    Pb = [[(i, j, random.randint(-3, 3)) for j in range(4)] for i in range(4)]
    assert bez_surf(Pb, F(0), F(0)) == Pb[0][0] and bez_surf(Pb, F(1), F(1)) == Pb[3][3]
    for v in (F(1, 3), F(3, 4)):
        edge = tuple(sum(Pb[0][j][d] * bern(j, 3, v) for j in range(4)) for d in range(3))
        assert bez_surf(Pb, F(0), v) == edge
    # 베지어 곡면은 국소 조절이 없다: 한 조절점을 옮기면 안쪽 어디나 바뀐다
    Pb2 = [list(r) for r in Pb]; Pb2[0][0] = (0, 0, 50)
    assert all(bez_surf(Pb, F(a, 4), F(b, 4)) != bez_surf(Pb2, F(a, 4), F(b, 4)) for a in (1, 2, 3) for b in (1, 2, 3))
    # 스플라인 곡면 p(u, v) = u^T M_S P M_S^T v 는 텐서곱이다: 모든 조절점이 1이면 1
    ones = [[1] * 4 for _ in range(4)]
    assert all(spline_surf(ones, F(a, 5), F(b, 5)) == 1 for a in range(6) for b in range(6))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
