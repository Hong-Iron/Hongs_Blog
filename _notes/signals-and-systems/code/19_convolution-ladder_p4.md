---
layout: "note"
title: "19_convolution-ladder_p4.py"
display_title: "19_convolution-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "19"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/convolution-ladder/"
parent_title: "컨벌루션 계산 예제 사다리"
description: "신호 및 시스템 · 컨벌루션 계산 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/signals-and-systems/code/19_convolution-ladder_p4/"
---
{% raw %}
[컨벌루션 계산 예제 사다리](/Hongs_Blog/studies/signals-and-systems/convolution-ladder/) 문서의 문제 4 풀이 코드다.

```python
"""컨벌루션 계산 예제 사다리 문제 1~4의 답을 수치 적분과 정의대로의 합으로 확인한다."""
import math
from fractions import Fraction as F

def conv_at(x, h, t, lo, hi, n=40000):
    d = (hi - lo) / n
    return sum(x(lo + (i + 0.5) * d) * h(t - lo - (i + 0.5) * d) for i in range(n)) * d

# 문제 1
x = lambda s: 1.0 if 0 < s < 1 else 0.0
h = lambda s: math.exp(-s) if s > 0 else 0.0
y1 = lambda t: 0.0 if t < 0 else (1 - math.exp(-t) if t < 1 else (math.e - 1) * math.exp(-t))
for t in (-0.5, 0.3, 0.99, 1.0, 2.5):
    assert abs(conv_at(x, h, t, -1, 3) - y1(t)) < 1e-3, t
# 문제 2
xd = lambda k: 1 if 0 <= k <= 2 else 0
hd = lambda k: F(1, 2) ** k if k >= 0 else 0
for n in range(-2, 10):
    got = sum(xd(k) * hd(n - k) for k in range(-5, 15))
    want = 0 if n < 0 else (2 - F(1, 2) ** n if n <= 2 else 7 * F(1, 2) ** n)
    assert got == want, n
# 문제 3
x = lambda s: 1.0 if 0 < s < 2 else 0.0
h = lambda s: 1.0 if 0 < s < 3 else 0.0
y3 = lambda t: 0.0 if t < 0 or t >= 5 else (t if t < 2 else (2.0 if t < 3 else 5 - t))
for t in (-1, 1, 2.5, 4, 6):
    assert abs(conv_at(x, h, t, -1, 6) - y3(t)) < 1e-3, t
# 문제 4
xd = lambda k: F(2) ** k if k <= 0 else 0
hd = lambda k: 1 if k >= 2 else 0
for n in range(-4, 6):
    got = sum(xd(k) * hd(n - k) for k in range(-90, 1))
    want = 2 if n >= 2 else F(2) ** (n - 1)
    assert abs(got - want) < F(1, 2 ** 80), n
print("ALL CHECKS PASSED")
```
{% endraw %}
