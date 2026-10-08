---
layout: "note"
title: "19_convolution-integral_verify.py"
display_title: "19_convolution-integral_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/convolution-integral/"
parent_title: "컨벌루션 적분"
description: "신호 및 시스템 · 컨벌루션 적분 검증 코드"
permalink: "/studies/signals-and-systems/code/19_convolution-integral_verify/"
---
{% raw %}
[컨벌루션 적분](/Hongs_Blog/studies/signals-and-systems/convolution-integral/) 문서의 검증 코드다.

```python
"""컨벌루션 적분 문서: 예제 2.6~2.8과 사각 펄스 두 개의 컨벌루션(7주차)을 수치 적분으로 확인한다."""
import math

def conv_at(x, h, t, lo, hi, n=40000):
    """y(t) = ∫ x(τ) h(t - τ) dτ, 중점 규칙"""
    d = (hi - lo) / n
    return sum(x(lo + (i + 0.5) * d) * h(t - lo - (i + 0.5) * d) for i in range(n)) * d

u = lambda t: 1.0 if t > 0 else 0.0
# 예제 2.6: x = e^{-at}u(t), h = u(t) -> y = (1/a)(1 - e^{-at}) u(t)
a = 1.5
for t in (-1.0, 0.3, 1.0, 4.0):
    got = conv_at(lambda s: math.exp(-a * s) * u(s), u, t, -1, 6)
    want = (1 - math.exp(-a * t)) / a if t > 0 else 0.0
    assert abs(got - want) < 1e-3, (t, got, want)
# 예제 2.7: x = 1 (0<t<T), h = t (0<t<2T)
T = 1.0
x = lambda s: 1.0 if 0 < s < T else 0.0
h = lambda s: s if 0 < s < 2 * T else 0.0
def y27(t):
    if t < 0 or t > 3 * T: return 0.0
    if t < T: return t * t / 2
    if t < 2 * T: return T * t - T * T / 2
    return -t * t / 2 + T * t + 1.5 * T * T
for t in (-0.5, 0.4, 1.3, 1.9, 2.5, 2.9, 3.5):
    assert abs(conv_at(x, h, t, -1, 4) - y27(t)) < 1e-3, t
# 구간 경계에서 이어진다
for tb in (T, 2 * T, 3 * T):
    assert abs(y27(tb - 1e-9) - y27(tb + 1e-9)) < 1e-6
# 예제 2.8: x = e^{2t}u(-t), h = u(t-3) -> y = ½e^{2(t-3)} (t <= 3), ½ (t >= 3)
x = lambda s: math.exp(2 * s) if s < 0 else 0.0
h = lambda s: 1.0 if s > 3 else 0.0
for t in (0.0, 2.0, 3.0, 5.0):
    want = 0.5 * math.exp(2 * (t - 3)) if t <= 3 else 0.5
    assert abs(conv_at(x, h, t, -15, 0, 60000) - want) < 1e-3, t
# 7주차 참조: 높이 1, 폭 a와 b(b > a)인 사각 펄스 -> 사다리꼴
A, B = 1.0, 2.5
x = lambda s: 1.0 if 0 < s < A else 0.0
h = lambda s: 1.0 if 0 < s < B else 0.0
def trap(t):
    if t < 0 or t >= A + B: return 0.0
    if t < A: return t
    if t < B: return A
    return A + B - t
for t in (-0.2, 0.5, 1.5, 2.0, 2.8, 3.4, 4.0):
    assert abs(conv_at(x, h, t, -1, 5) - trap(t)) < 1e-3, t
print("ALL CHECKS PASSED")
```
{% endraw %}
