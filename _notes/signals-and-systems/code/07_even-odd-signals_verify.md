---
layout: "note"
title: "07_even-odd-signals_verify.py"
display_title: "07_even-odd-signals_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/even-odd-signals/"
parent_title: "짝 신호와 홀 신호"
description: "신호 및 시스템 · 짝 신호와 홀 신호 검증 코드"
permalink: "/studies/signals-and-systems/code/07_even-odd-signals_verify/"
---
{% raw %}
[짝 신호와 홀 신호](/Hongs_Blog/studies/signals-and-systems/even-odd-signals/) 문서의 검증 코드다.

```python
"""짝 신호와 홀 신호 문서: 짝·홀 분해를 계산해 그림 1.18과 예제 값을 확인한다."""
import math, random
from fractions import Fraction as F

u = lambda n: F(1) if n >= 0 else F(0)
Ev = lambda x, n: (x(n) + x(-n)) / 2
Od = lambda x, n: (x(n) - x(-n)) / 2
for n in range(-5, 6):
    assert Ev(u, n) == (1 if n == 0 else F(1, 2))
    assert Od(u, n) == (0 if n == 0 else (F(1, 2) if n > 0 else F(-1, 2)))
    assert Ev(u, n) + Od(u, n) == u(n)
# 아무 신호나 분해하면 짝 부분은 짝, 홀 부분은 홀, 둘의 합은 원래 신호
random.seed(1)
vals = {n: random.uniform(-3, 3) for n in range(-10, 11)}
x = lambda n: vals[n]
for n in range(-10, 11):
    assert abs(Ev(x, n) - Ev(x, -n)) < 1e-12 and abs(Od(x, n) + Od(x, -n)) < 1e-12
    assert abs(Ev(x, n) + Od(x, n) - x(n)) < 1e-12
assert Od(x, 0) == 0
# 예제: 3cos(6πn) + 4sin(8πn)의 짝 부분 3cos(6πn), 홀 부분 4sin(8πn) (연속 시간 t로 확인)
y = lambda t: 3 * math.cos(6 * math.pi * t) + 4 * math.sin(8 * math.pi * t)
for t in [0.013, 0.21, -0.37, 0.5]:
    assert abs((y(t) + y(-t)) / 2 - 3 * math.cos(6 * math.pi * t)) < 1e-12
    assert abs((y(t) - y(-t)) / 2 - 4 * math.sin(8 * math.pi * t)) < 1e-12
# 정수 n에서는 sin(8πn) = 0이라 이산 신호로는 x[n] = 3 이 된다
assert all(abs(y(n) - 3) < 1e-9 for n in range(-4, 5))
print("ALL CHECKS PASSED")
```
{% endraw %}
