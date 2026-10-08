---
layout: "note"
title: "22_step-response_verify.py"
display_title: "22_step-response_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/step-response/"
parent_title: "단위 계단 응답"
description: "신호 및 시스템 · 단위 계단 응답 검증 코드"
permalink: "/studies/signals-and-systems/code/22_step-response_verify/"
---
{% raw %}
[단위 계단 응답](/Hongs_Blog/studies/signals-and-systems/step-response/) 문서의 검증 코드다.

```python
"""단위 계단 응답 문서: s[n] = Σ_{k<=n} h[k], h[n] = s[n] - s[n-1], s(t) = ∫h, h = s' 를 확인한다."""
import math, random
random.seed(4)
hs = {k: random.uniform(-2, 2) for k in range(0, 15)}
h = lambda n: hs.get(n, 0.0)
u = lambda n: 1 if n >= 0 else 0
s = lambda n: sum(h(k) for k in range(-5, n + 1))
for n in range(-3, 20):
    conv = sum(u(k) * h(n - k) for k in range(-5, 40))          # u * h
    assert abs(conv - s(n)) < 1e-12
    assert abs(s(n) - s(n - 1) - h(n)) < 1e-12
# 연속 시간: h(t) = e^{-2t}u(t) -> s(t) = (1 - e^{-2t})/2 u(t), s'(t) = h(t)
st = lambda t: (1 - math.exp(-2 * t)) / 2 if t > 0 else 0.0
for t in (0.2, 0.7, 2.0):
    integ = sum(math.exp(-2 * (i + 0.5) * t / 20000) for i in range(20000)) * t / 20000
    assert abs(integ - st(t)) < 1e-8
    d = 1e-6
    assert abs((st(t + d) - st(t - d)) / (2 * d) - math.exp(-2 * t)) < 1e-6
print("ALL CHECKS PASSED")
```
{% endraw %}
