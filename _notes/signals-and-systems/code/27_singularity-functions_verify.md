---
layout: "note"
title: "27_singularity-functions_verify.py"
display_title: "27_singularity-functions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/singularity-functions/"
parent_title: "특이함수"
description: "신호 및 시스템 · 특이함수 검증 코드"
permalink: "/studies/signals-and-systems/code/27_singularity-functions_verify/"
---
{% raw %}
[특이함수](/Hongs_Blog/studies/signals-and-systems/singularity-functions/) 문서의 검증 코드다.

```python
"""특이함수 문서: r_Δ = δ_Δ * δ_Δ 가 삼각 펄스임을 확인하고, 예제 2.16에서 짧은 펄스들의 응답이 h(t) = e^{-2t}u(t)로 모이는지 본다."""
import math

def conv_at(x, h, t, lo, hi, n=20000):
    dd = (hi - lo) / n
    return sum(x(lo + (i + 0.5) * dd) * h(t - lo - (i + 0.5) * dd) for i in range(n)) * dd

for D in (0.5, 0.2):
    dD = lambda s, D=D: 1 / D if 0 <= s < D else 0.0
    tri = lambda t, D=D: 0.0 if t < 0 or t > 2 * D else (t / D ** 2 if t <= D else (2 * D - t) / D ** 2)
    for t in (0.1 * D, 0.5 * D, D, 1.5 * D, 1.9 * D, 2.5 * D):
        assert abs(conv_at(dD, dD, t, -0.1, 2 * D + 0.1) - tri(t)) < 2e-2 / D, (D, t)
    area = sum(tri((i + 0.5) * 2 * D / 10000) for i in range(10000)) * 2 * D / 10000
    assert abs(area - 1) < 1e-6                          # 넓이 1

def respond(x, t_end, dt=1e-5):                           # y' + 2y = x, initial rest
    y, t = 0.0, 0.0
    while t < t_end - 1e-12:
        y += dt * (-2 * y + x(t)); t += dt
    return y

h = lambda t: math.exp(-2 * t)
errs = {}
for D in (0.25, 0.1, 0.0025):
    dD = lambda s, D=D: 1 / D if 0 <= s < D else 0.0
    rD = lambda s, D=D: 0.0 if s < 0 or s > 2 * D else (s / D ** 2 if s <= D else (2 * D - s) / D ** 2)
    errs[D] = max(abs(respond(f, 1.0) - h(1.0)) for f in (dD, rD))
assert errs[0.0025] < errs[0.1] < errs[0.25] and errs[0.0025] < 1e-2
print("ALL CHECKS PASSED")
```
{% endraw %}
