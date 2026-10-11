---
layout: "note"
title: "17_polar-parametric_verify.py"
display_title: "17_polar-parametric_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/polar-parametric/"
parent_title: "극좌표와 매개변수 곡선"
description: "대학수학 · 극좌표와 매개변수 곡선 검증 코드"
permalink: "/studies/college-math/code/17_polar-parametric_verify/"
---
{% raw %}
[극좌표와 매개변수 곡선](/Hongs_Blog/studies/college-math/polar-parametric/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""극좌표와 매개변수 곡선 검증.

문서: 17.극좌표와 매개변수 곡선 (예시, 정의, 예제, 카드 C1~C3)
주장 1: (-1, √3)은 극좌표 (2, 2π/3), 극좌표 (3, π/6)은 (3√3/2, 3/2).
주장 2: (r, θ)와 (r, θ + 2πk)는 같은 점이다.
주장 3: (2 cos t, 2 sin t)와 (2 cos 2t, 2 sin 2t)는 모두 x² + y² = 4 위에 있고, 둘째가 두 배 빠르다.
주장 4: 선형 보간 P + t(Q - P)에서 (0, 0) -> (4, 2)의 t = 0.25는 (1, 0.5), t = 0.5는 (2, 1).
주장 5: 포물선 운동 (vt cos α, vt sin α - ½gt²)는 v = 20, α = 45°, g = 9.8에서 약 40.8 m 떨어진 곳에 떨어진다 (v² sin 2α / g).
"""
import math


def to_polar(x, y):
    return math.hypot(x, y), math.atan2(y, x)


def main():
    r, t = to_polar(-1, math.sqrt(3))
    assert math.isclose(r, 2) and math.isclose(t, 2 * math.pi / 3)
    x, y = 3 * math.cos(math.pi / 6), 3 * math.sin(math.pi / 6)
    assert math.isclose(x, 3 * math.sqrt(3) / 2) and math.isclose(y, 1.5)
    print("[OK] 주장 1·카드 C1")

    for k in (-3, -1, 1, 5):
        assert math.isclose(2 * math.cos(1 + 2 * math.pi * k), 2 * math.cos(1)) and math.isclose(2 * math.sin(1 + 2 * math.pi * k), 2 * math.sin(1))
    print("[OK] 주장 2: 각에 2πk를 더해도 같은 점")

    for i in range(1000):
        t = i / 100
        p1 = (2 * math.cos(t), 2 * math.sin(t)); p2 = (2 * math.cos(2 * t), 2 * math.sin(2 * t))
        assert math.isclose(p1[0] ** 2 + p1[1] ** 2, 4) and math.isclose(p2[0] ** 2 + p2[1] ** 2, 4)
    h = 1e-6
    speed = lambda f, t: math.dist(f(t + h), f(t)) / h
    f1 = lambda t: (2 * math.cos(t), 2 * math.sin(t)); f2 = lambda t: (2 * math.cos(2 * t), 2 * math.sin(2 * t))
    assert math.isclose(speed(f1, 0.3), 2, rel_tol=1e-5) and math.isclose(speed(f2, 0.3), 4, rel_tol=1e-5)
    print("[OK] 주장 3·카드 C2: 같은 원, 속력 2와 4")

    lerp = lambda P, Q, t: (P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1]))
    assert lerp((0, 0), (4, 2), 0.25) == (1, 0.5) and lerp((0, 0), (4, 2), 0.5) == (2, 1)
    print("[OK] 주장 4·카드 C3: 선형 보간")

    v, a, g = 20, math.radians(45), 9.8
    T = 2 * v * math.sin(a) / g
    xr = v * T * math.cos(a)
    assert math.isclose(xr, v * v * math.sin(2 * a) / g) and f"{xr:.1f}" == "40.8"
    yT = v * T * math.sin(a) - 0.5 * g * T * T
    assert abs(yT) < 1e-9
    print(f"[OK] 주장 5: 사거리 {xr:.2f} m")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
