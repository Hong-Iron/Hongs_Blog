---
layout: "note"
title: "36_shooting-method_impl.py"
display_title: "36_shooting-method_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "36"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/shooting-method/"
parent_title: "사격법"
description: "수치해석 · 사격법 구현 코드"
permalink: "/studies/numerical-analysis/code/36_shooting-method_impl/"
---
{% raw %}
[사격법](/Hongs_Blog/studies/numerical-analysis/shooting-method/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""사격법 구현과 검증. T'' = h'(T − Ta), T(0) = 40, T(10) = 200 (슬라이드 p.7)."""
import math


def rk4_sys(F, x, Y, h):
    k1 = F(x, Y)
    k2 = F(x + h / 2, [y + h / 2 * k for y, k in zip(Y, k1)])
    k3 = F(x + h / 2, [y + h / 2 * k for y, k in zip(Y, k2)])
    k4 = F(x + h, [y + h * k for y, k in zip(Y, k3)])
    return [y + h / 6 * (a + 2 * b + 2 * c + d) for y, a, b, c, d in zip(Y, k1, k2, k3, k4)]


def shoot(F, y0, z0, L, n=1000):
    h = L / n; Y = [y0, z0]
    for i in range(n):
        Y = rk4_sys(F, i * h, Y, h)
    return Y[0]


def main():
    hp, Ta = 0.01, 20.0
    F = lambda x, Y: [Y[1], hp * (Y[0] - Ta)]
    T10a = shoot(F, 40, 10, 10, 5); T10b = shoot(F, 40, 20, 10, 5)     # 슬라이드 값은 RK4, 걸음 2
    assert abs(T10a - 168.3797) < 1e-4 and abs(T10b - 285.8980) < 1e-4
    z = 10 + (20 - 10) / (T10b - T10a) * (200 - T10a)
    assert abs(z - 12.6907) < 1e-4
    assert abs(shoot(F, 40, z, 10, 5) - 200) < 1e-9                    # 선형 방정식이라 한 번에 맞는다
    Fa, Fb = shoot(F, 40, 10, 10), shoot(F, 40, 20, 10)                # 걸음을 줄이면 참값에 가깝다
    assert abs(Fa - 168.3817) < 1e-4 and abs(Fb - 285.9019) < 1e-4
    z = 10 + (20 - 10) / (Fb - Fa) * (200 - Fa)
    # 참값: T = Ta + A e^{λx} + B e^{−λx}, λ = √h'
    lam = math.sqrt(hp)
    A = (200 - Ta - (40 - Ta) * math.exp(-10 * lam)) / (math.exp(10 * lam) - math.exp(-10 * lam)); B = 40 - Ta - A
    zt = lam * (A - B)
    assert abs(z - zt) < 1e-6
    # 비선형: y'' = 1.5 y², y(0) = 4, y(1) = 1 (참값 y = 4/(1 + x)², y'(0) = −8). 할선법으로 근을 찾는다
    G = lambda x, Y: [Y[1], 1.5 * Y[0] ** 2]
    g = lambda z: shoot(G, 4, z, 1, 2000) - 1
    z0, z1 = -7.0, -9.0
    for _ in range(30):
        g0, g1 = g(z0), g(z1)
        if abs(g1) < 1e-12:
            break
        z0, z1 = z1, z1 - g1 * (z1 - z0) / (g1 - g0)
    assert abs(z1 + 8) < 1e-6
    # 다른 시작값에서는 두 번째 답 z(0) ≈ −35.86으로 간다
    w0, w1 = -34.0, -37.0
    for _ in range(40):
        h0, h1 = g(w0), g(w1)
        if abs(h1) < 1e-12:
            break
        w0, w1 = w1, w1 - h1 * (w1 - w0) / (h1 - h0)
    assert abs(w1 + 35.8585) < 1e-3
    # 선형 보간 한 번으로는 비선형 문제를 맞히지 못한다
    zl = -7 + (-9 + 7) / (g(-9) - g(-7)) * (0 - g(-7))
    assert abs(g(zl)) > 1e-3
    # 카드 C2: z(0) = 0 → T(10) = 100, z(0) = 10 → T(10) = 180, 목표 140
    assert 0 + (10 - 0) / (180 - 100) * (140 - 100) == 5
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
