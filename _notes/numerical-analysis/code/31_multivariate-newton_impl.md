---
layout: "note"
title: "31_multivariate-newton_impl.py"
display_title: "31_multivariate-newton_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "31"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/multivariate-newton/"
parent_title: "다변수 뉴턴 방법"
description: "수치해석 · 다변수 뉴턴 방법 구현 코드"
permalink: "/studies/numerical-analysis/code/31_multivariate-newton_impl/"
---
{% raw %}
[다변수 뉴턴 방법](/Hongs_Blog/studies/numerical-analysis/multivariate-newton/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다변수 뉴턴 방법 구현과 검증."""
import math


def newton2(u, v, J, x, y, n):
    out = [(x, y)]
    for _ in range(n):
        ux, uy, vx, vy = J(x, y); U, V = u(x, y), v(x, y)
        det = ux * vy - uy * vx
        x, y = x - (U * vy - V * uy) / det, y - (V * ux - U * vx) / det     # 슬라이드 p.12
        out.append((x, y))
    return out


def main():
    u = lambda x, y: x * x + x * y - 10
    v = lambda x, y: y + 3 * x * y * y - 57
    J = lambda x, y: (2 * x + y, x, 3 * y * y, 1 + 6 * x * y)
    assert J(1.5, 3.5) == (6.5, 1.5, 36.75, 32.5)                            # 슬라이드 p.13
    it = newton2(u, v, J, 1.5, 3.5, 5)
    assert round(it[1][0], 5) == 2.03603 and round(it[1][1], 5) == 2.84388   # 슬라이드 p.14
    assert abs(it[-1][0] - 2) < 1e-12 and abs(it[-1][1] - 3) < 1e-12
    # 이차 수렴: 오차가 매번 대략 제곱
    e = [math.dist(p, (2, 3)) for p in it]
    assert e[3] < e[2] ** 2 * 10 and e[2] < e[1] ** 2 * 10
    print("오차", ["%.1e" % v for v in e])
    # 같은 식 = J Δ = −F 를 푸는 것
    x, y = 1.5, 3.5; ux, uy, vx, vy = J(x, y)
    dx = -(u(x, y) * vy - v(x, y) * uy) / (ux * vy - uy * vx); dy = -(v(x, y) * ux - u(x, y) * vx) / (ux * vy - uy * vx)
    assert abs(ux * dx + uy * dy + u(x, y)) < 1e-12 and abs(vx * dx + vy * dy + v(x, y)) < 1e-12
    # 시작점이 멀면 다른 근이나 발산으로 간다
    far = newton2(u, v, J, -3.0, -4.0, 30)[-1]
    assert math.dist(far, (2, 3)) > 1
    assert abs(u(*far)) < 1e-9 and abs(v(*far)) < 1e-9                       # 다른 근
    print("다른 시작점의 근", tuple(round(c, 5) for c in far))
    # 카드 C2: u = x² + y² − 4, v = x − y, (1, 2)에서 한 걸음
    u2 = lambda x, y: x * x + y * y - 4; v2 = lambda x, y: x - y
    J2 = lambda x, y: (2 * x, 2 * y, 1, -1)
    p = newton2(u2, v2, J2, 1.0, 2.0, 1)[1]
    assert abs(p[0] - 1.5) < 1e-12 and abs(p[1] - 1.5) < 1e-12
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
