---
layout: "note"
title: "02_second-order-linear-ode_verify.py"
display_title: "02_second-order-linear-ode_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/second-order-linear-ode/"
parent_title: "상수계수 2계 선형 미분방정식"
description: "신호 및 시스템 · 상수계수 2계 선형 미분방정식 검증 코드"
permalink: "/studies/signals-and-systems/code/02_second-order-linear-ode_verify/"
---
{% raw %}
[상수계수 2계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/second-order-linear-ode/) 문서의 검증 코드다.

```python
"""상수계수 2계 선형 미분방정식 문서의 예제를 검증한다. 특성방정식의 근, 초기 조건, 해를 식에 넣었을 때 양변이 같은지 확인한다."""
import cmath, math

h = 1e-4
d1 = lambda f, x: (f(x + h) - f(x - h)) / (2 * h)
d2 = lambda f, x: (f(x + h) - 2 * f(x) + f(x - h)) / (h * h)
xs = [-0.5, 0.0, 0.3, 0.9, 1.4]

def satisfies(y, a, b, c, g, tol=1e-4):
    for x in xs:
        lhs = a * d2(y, x) + b * d1(y, x) + c * y(x)
        assert abs(lhs - g(x)) < tol * max(1, abs(g(x)), abs(y(x))), (x, lhs, g(x))

def roots(a, b, c):
    s = cmath.sqrt(b * b - 4 * a * c)
    return sorted([(-b + s) / (2 * a), (-b - s) / (2 * a)], key=lambda z: (z.real, z.imag))

# 예 1: y'' - y' - 6y = 0  ->  근 -2, 3
r = roots(1, -1, -6); assert abs(r[0] + 2) < 1e-12 and abs(r[1] - 3) < 1e-12
satisfies(lambda x: 0.7 * math.exp(-2 * x) - 1.1 * math.exp(3 * x), 1, -1, -6, lambda x: 0)

# 예 2: y'' + 11y' + 24y = 0, y(0)=0, y'(0)=-7  ->  C1 = 1.4, C2 = -1.4
r = roots(1, 11, 24); assert abs(r[0] + 8) < 1e-12 and abs(r[1] + 3) < 1e-12
y = lambda x: 1.4 * math.exp(-8 * x) - 1.4 * math.exp(-3 * x)
satisfies(y, 1, 11, 24, lambda x: 0)
assert abs(y(0)) < 1e-12 and abs(d1(y, 0) + 7) < 1e-4

# 예 3: y'' + 2y' + 3y = 0  ->  근 -1 ± j sqrt(2)
r = roots(1, 2, 3); assert abs(r[1] - complex(-1, math.sqrt(2))) < 1e-12
satisfies(lambda x: math.exp(-x) * (0.4 * math.cos(math.sqrt(2) * x) - 0.9 * math.sin(math.sqrt(2) * x)), 1, 2, 3, lambda x: 0)

# 예 4: y'' - 4y' + 9y = 0, y(0)=0, y'(0)=-8  ->  y = -(8 sqrt5 / 5) e^{2x} sin(sqrt5 x)
r = roots(1, -4, 9); assert abs(r[1] - complex(2, math.sqrt(5))) < 1e-12
y = lambda x: -8 * math.sqrt(5) / 5 * math.exp(2 * x) * math.sin(math.sqrt(5) * x)
satisfies(y, 1, -4, 9, lambda x: 0)
assert abs(y(0)) < 1e-12 and abs(d1(y, 0) + 8) < 1e-4

# 중근: y'' - 2y' + y = 0  ->  y = (C1 + C2 x) e^x
satisfies(lambda x: (1.5 - 0.8 * x) * math.exp(x), 1, -2, 1, lambda x: 0)

# 미정계수법 1: y'' - 4y' + 3y = x  ->  y_p = x/3 + 4/9
satisfies(lambda x: x / 3 + 4 / 9 + 2 * math.exp(x) - math.exp(3 * x), 1, -4, 3, lambda x: x)

# 미정계수법 2: x'' - x' + x = 2 sin 3t  ->  x_p = 6/73 cos 3t - 16/73 sin 3t
satisfies(lambda t: 6 / 73 * math.cos(3 * t) - 16 / 73 * math.sin(3 * t), 1, -1, 1, lambda t: 2 * math.sin(3 * t))
# 연립식 8A + 3B = 0, 3A - 8B = 2 의 해
A, B = 6 / 73, -16 / 73
assert abs(8 * A + 3 * B) < 1e-12 and abs(3 * A - 8 * B - 2) < 1e-12
print("ALL CHECKS PASSED")
```
{% endraw %}
