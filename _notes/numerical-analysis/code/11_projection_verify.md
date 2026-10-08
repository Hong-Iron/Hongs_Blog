---
layout: "note"
title: "11_projection_verify.py"
display_title: "11_projection_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/projection/"
parent_title: "평행 투영과 원근 투영"
description: "수치해석 · 평행 투영과 원근 투영 검증 코드"
permalink: "/studies/numerical-analysis/code/11_projection_verify/"
---
{% raw %}
[평행 투영과 원근 투영](/Hongs_Blog/studies/numerical-analysis/projection/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""평행 투영과 원근 투영 문서의 주장 검증."""
from fractions import Fraction as F


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(4)) for i in range(4)]


def par(d):
    return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, d], [0, 0, 0, 1]]


def per(d):
    return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, F(1, d), 0]]


def proj(M, p):
    x = mv(M, list(p) + [1])
    return tuple(F(c) / x[3] for c in x[:3])


def main():
    assert proj(par(5), (2, 4, 9)) == (2, 4, 5)
    # 평행 투영: 평행한 두 선분은 평행하게 남는다
    a, b = proj(par(1), (0, 0, 3)), proj(par(1), (2, 1, 7))
    c, e = proj(par(1), (5, 5, 0)), proj(par(1), (7, 6, 4))
    assert (b[0] - a[0], b[1] - a[1]) == (e[0] - c[0], e[1] - c[1])
    # 원근 투영 x' = x/(z/d)
    assert proj(per(1), (2, 4, 4)) == (F(1, 2), 1, 1)
    assert proj(per(1), (2, 4, 8)) == (F(1, 4), F(1, 2), 1)   # 두 배 멀면 절반 크기
    assert proj(per(2), (3, 6, 6)) == (1, 2, 2)               # 카드 C2
    # z'/w' = d: 모든 점이 화면 z = d 위로
    assert all(proj(per(3), (1, 1, z))[2] == 3 for z in (1, 5, 100))
    # z 방향 평행선 x = ±1은 멀어질수록 한 점(0, 0)으로 모인다 (소실점)
    gaps = [proj(per(1), (1, 0, z))[0] - proj(per(1), (-1, 0, z))[0] for z in (1, 10, 1000)]
    assert gaps == [2, F(1, 5), F(1, 500)]
    # 원근 투영은 선분의 비(중점)를 지키지 않는다
    p, q = (0, 2, 2), (0, 2, 6)
    m = proj(per(1), (0, 2, 4))
    assert m[1] != (proj(per(1), p)[1] + proj(per(1), q)[1]) / 2
    # 직선은 직선으로 간다: 한 직선 위 세 점의 상이 한 직선 위
    pts = [proj(per(1), (1 + t, 2 - t, 3 + 2 * t)) for t in (0, 1, 5)]
    (x1, y1, _), (x2, y2, _), (x3, y3, _) = pts
    assert (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1) == 0
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
