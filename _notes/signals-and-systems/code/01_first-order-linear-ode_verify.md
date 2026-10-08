---
layout: "note"
title: "01_first-order-linear-ode_verify.py"
display_title: "01_first-order-linear-ode_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/first-order-linear-ode/"
parent_title: "1계 선형 미분방정식"
description: "신호 및 시스템 · 1계 선형 미분방정식 검증 코드"
permalink: "/studies/signals-and-systems/code/01_first-order-linear-ode_verify/"
---
{% raw %}
[1계 선형 미분방정식](/Hongs_Blog/studies/signals-and-systems/first-order-linear-ode/) 문서의 검증 코드다.

```python
"""1계 선형 미분방정식 문서의 풀이를 검증한다. 해를 식에 넣어 양변을 비교하고, RC 회로는 오일러 방법과 비교한다."""
import math

h = 1e-5
d = lambda f, x: (f(x + h) - f(x - h)) / (2 * h)
xs = [-1.0, -0.3, 0.0, 0.7, 1.5, 2.2]

def check(name, y, lhs, rhs):
    for x in xs:
        assert abs(lhs(y, x) - rhs(x)) < 1e-5, (name, x, lhs(y, x), rhs(x))

for C in (-2.0, 0.0, 1.3):
    # 변수분리형 y' = y^2 e^{-x}  ->  y = 1/(e^{-x} + k)
    y = lambda x, k=C + 5: 1 / (math.exp(-x) + k)
    check("separable", y, lambda y, x: d(y, x) - y(x) ** 2 * math.exp(-x), lambda x: 0)
    # y' + y = x  ->  y = x - 1 + C e^{-x}
    check("ex1", lambda x, C=C: x - 1 + C * math.exp(-x), lambda y, x: d(y, x) + y(x), lambda x: x)
    # y' + 2y = 5  ->  y = 5/2 + C e^{-2x}
    check("ex2", lambda x, C=C: 2.5 + C * math.exp(-2 * x), lambda y, x: d(y, x) + 2 * y(x), lambda x: 5)
    # y' + y = x^2  ->  y = x^2 - 2x + 2 + C e^{-x}
    check("ex3", lambda x, C=C: x * x - 2 * x + 2 + C * math.exp(-x), lambda y, x: d(y, x) + y(x), lambda x: x * x)

# RC 회로 dv/dt + v/RC = vs/RC, vs = 1 (t>=0), v(0)=0  ->  v = 1 - e^{-t/RC}
RC, dt, v, t = 0.5, 1e-5, 0.0, 0.0
while t < 2.0 - 1e-12:
    v += dt * (1 - v) / RC
    t += dt
assert abs(v - (1 - math.exp(-2.0 / RC))) < 1e-4
# 시상수 RC가 지나면 최종값의 약 63%
assert abs((1 - math.exp(-1)) - 0.632) < 1e-3
print("ALL CHECKS PASSED")
```
{% endraw %}
