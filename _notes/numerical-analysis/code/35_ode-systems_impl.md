---
layout: "note"
title: "35_ode-systems_impl.py"
display_title: "35_ode-systems_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "35"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/ode-systems/"
parent_title: "연립 상미분방정식"
description: "수치해석 · 연립 상미분방정식 구현 코드"
permalink: "/studies/numerical-analysis/code/35_ode-systems_impl/"
---
{% raw %}
[연립 상미분방정식](/Hongs_Blog/studies/numerical-analysis/ode-systems/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""연립 상미분방정식 구현과 검증. 벡터 y = [y1, ..., yn]."""
import math


def euler_sys(F, x, Y, h):
    return [y + h * d for y, d in zip(Y, F(x, Y))]


def rk4_sys(F, x, Y, h):
    k1 = F(x, Y)
    k2 = F(x + h / 2, [y + h / 2 * k for y, k in zip(Y, k1)])
    k3 = F(x + h / 2, [y + h / 2 * k for y, k in zip(Y, k2)])
    k4 = F(x + h, [y + h * k for y, k in zip(Y, k3)])
    return [y + h / 6 * (a + 2 * b + 2 * c + d) for y, a, b, c, d in zip(Y, k1, k2, k3, k4)]


def main():
    # 슬라이드 p.3: dy1/dx = −0.5 y1, dy2/dx = 4 − 0.3 y2 − 0.1 y1, h = 0.5
    F = lambda x, Y: [-0.5 * Y[0], 4 - 0.3 * Y[1] - 0.1 * Y[0]]
    Y = [4.0, 6.0]; table = [Y]
    for i in range(4):
        Y = euler_sys(F, 0.5 * i, Y, 0.5); table.append(Y)
    slide = [(4, 6), (3, 6.9), (2.25, 7.715), (1.6875, 8.44525), (1.265625, 9.094087)]
    assert all(abs(a - s[0]) < 1e-9 and abs(b - s[1]) < 1e-6 for (a, b), s in zip(table, slide))
    # RK4로 더 정확히: y1 = 4e^{−x/2}의 참값과 비교
    Y = [4.0, 6.0]
    for i in range(4):
        Y = rk4_sys(F, 0.5 * i, Y, 0.5)
    assert abs(Y[0] - 4 * math.exp(-1)) < 1e-4 and abs(table[-1][0] - 4 * math.exp(-1)) > 0.2
    # 고차 방정식 → 1계 연립: y'' = −y, y(0) = 0, y'(0) = 1 → (y, z), y' = z, z' = −y, 참값 sin x
    G = lambda x, Y: [Y[1], -Y[0]]
    Y = [0.0, 1.0]; h = 0.01
    for i in range(int(round(math.pi / 2 / h))):
        Y = rk4_sys(G, i * h, Y, h)
    assert abs(Y[0] - math.sin(157 * h)) < 1e-9
    # 카드 C2: y'' + 3y' + 2y = 0을 연립으로, (y, z) = (1, 0)에서 오일러 h = 0.1 한 걸음
    H = lambda x, Y: [Y[1], -3 * Y[1] - 2 * Y[0]]
    assert euler_sys(H, 0.0, [1.0, 0.0], 0.1) == [1.0, -0.2]
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
