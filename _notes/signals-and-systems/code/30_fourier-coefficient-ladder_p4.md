---
layout: "note"
title: "30_fourier-coefficient-ladder_p4.py"
display_title: "30_fourier-coefficient-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "30"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/fourier-coefficient-ladder/"
parent_title: "푸리에 계수 계산 예제 사다리"
description: "신호 및 시스템 · 푸리에 계수 계산 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/signals-and-systems/code/30_fourier-coefficient-ladder_p4/"
---
{% raw %}
[푸리에 계수 계산 예제 사다리](/Hongs_Blog/studies/signals-and-systems/fourier-coefficient-ladder/) 문서의 문제 4 풀이 코드다.

```python
"""푸리에 계수 계산 예제 사다리 문제 1~4의 답을 분석식 수치 적분으로 확인한다."""
import cmath, math

def coef(x, T, k, n=40000):
    w0 = 2 * math.pi / T; d = T / n
    return sum(x(-T / 2 + (i + 0.5) * d) * cmath.exp(-1j * k * w0 * (-T / 2 + (i + 0.5) * d)) for i in range(n)) * d / T
close = lambda u, v, e=1e-4: abs(u - v) < e
x1 = lambda t: 2 + math.cos(3 * t) - 4 * math.sin(6 * t)
want1 = {0: 2, 1: 0.5, -1: 0.5, 2: 2j, -2: -2j}
assert all(close(coef(x1, 2 * math.pi / 3, k), want1.get(k, 0), 1e-9) for k in range(-3, 4))
x2 = lambda t: 1.0 if (t % 2) < 1 else -1.0
assert all(close(coef(x2, 2.0, k), 0 if k % 2 == 0 else 2 / (1j * k * math.pi)) for k in range(-4, 5))
sq = lambda t: 1.0 if abs(((t + 2) % 4) - 2) < 1 else 0.0
for k in range(-3, 4):
    want = 0.5 if k == 0 else math.sin(math.pi * k / 2) / (k * math.pi) * cmath.exp(-1j * k * math.pi / 2)
    assert close(coef(lambda t: sq(t - 1), 4.0, k), want)
tri = lambda t: abs(((t + 2) % 4) - 2)
for k in range(-5, 6):
    want = 1 if k == 0 else (0 if k % 2 == 0 else -4 / (k * math.pi) ** 2)
    assert close(coef(tri, 4.0, k), want, 1e-6), k
print("ALL CHECKS PASSED")
```
{% endraw %}
