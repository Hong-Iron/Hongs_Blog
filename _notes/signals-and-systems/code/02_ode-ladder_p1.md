---
layout: "note"
title: "02_ode-ladder_p1.py"
display_title: "02_ode-ladder_p1.py"
kind: "code"
kind_label: "코드 · 문제 1 풀이"
num: "02"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/ode-ladder/"
parent_title: "미분방정식 풀이 예제 사다리"
description: "신호 및 시스템 · 미분방정식 풀이 예제 사다리 문제 1 풀이 코드"
permalink: "/studies/signals-and-systems/code/02_ode-ladder_p1/"
---
{% raw %}
[미분방정식 풀이 예제 사다리](/Hongs_Blog/studies/signals-and-systems/ode-ladder/) 문서의 문제 1 풀이 코드다.

```python
"""미분방정식 풀이 예제 사다리 문제 1: y'' - 4y' + 3y = x, y(0) = 0, y'(0) = 0 의 해를 구하고 확인한다."""
import math
from fractions import Fraction as F

A, B = F(1, 3), F(4, 9)                       # 특수해 Ax + B
assert 3 * A == 1 and -4 * A + 3 * B == 0
# C1 + C2 = -B, C1 + 3C2 = -A
C2 = (-A + B) / 2
C1 = -B - C2
assert (C1, C2) == (F(-1, 2), F(1, 18))
y = lambda x: float(C1) * math.exp(x) + float(C2) * math.exp(3 * x) + float(A) * x + float(B)
h = 1e-4
d1 = lambda f, x: (f(x + h) - f(x - h)) / (2 * h)
d2 = lambda f, x: (f(x + h) - 2 * f(x) + f(x - h)) / (h * h)
assert abs(y(0)) < 1e-12 and abs(d1(y, 0)) < 1e-6
for x in (-1.0, 0.0, 0.5, 1.2):
    assert abs(d2(y, x) - 4 * d1(y, x) + 3 * y(x) - x) < 1e-4
print("ALL CHECKS PASSED")
```
{% endraw %}
