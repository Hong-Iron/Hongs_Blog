---
layout: "note"
title: "23_lccde-system_verify.py"
display_title: "23_lccde-system_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/lccde-system/"
parent_title: "미분방정식으로 표현한 LTI 시스템"
description: "신호 및 시스템 · 미분방정식으로 표현한 LTI 시스템 검증 코드"
permalink: "/studies/signals-and-systems/code/23_lccde-system_verify/"
---
{% raw %}
[미분방정식으로 표현한 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/lccde-system/) 문서의 검증 코드다.

```python
"""미분방정식으로 표현한 인과 LTI 시스템 문서: 예제 2.14와 y' + ay = bx 의 계단·임펄스 응답을 수치 해와 비교한다."""
import math

def euler(a, b, x, t_end, dt=1e-5, y0=0.0):
    y, t = y0, 0.0
    while t < t_end - 1e-12:
        y += dt * (-a * y + b * x(t)); t += dt
    return y

# 예제 2.14: y' + 2y = K e^{3t} u(t), initial rest -> y = (K/5)(e^{3t} - e^{-2t}) u(t)
K = 2.0
for t in (0.2, 0.5, 1.0):
    want = K / 5 * (math.exp(3 * t) - math.exp(-2 * t))
    assert abs(euler(2, 1, lambda s: K * math.exp(3 * s), t) - want) < 2e-4 * max(1, want)
# 특수해·제차해 확인: Y = K/5 이면 3Y + 2Y = K, s = -2
assert abs(3 * K / 5 + 2 * K / 5 - K) < 1e-12
# y' + ay = bx 의 계단 응답 s(t) = (b/a)(1 - e^{-at}), 임펄스 응답 h(t) = b e^{-at} u(t)
a, b = 1.5, 2.0
for t in (0.3, 1.0, 3.0):
    assert abs(euler(a, b, lambda s: 1.0, t) - b / a * (1 - math.exp(-a * t))) < 1e-4
    # 임펄스: 짧은 펄스(폭 Δ, 넓이 1) 입력의 응답이 h(t)에 다가간다
    D = 1e-3
    got = euler(a, b, lambda s: 1 / D if s < D else 0.0, t, dt=1e-6)
    assert abs(got - b * math.exp(-a * t)) < 5e-3
    # h = s'
    d = 1e-6
    sd = lambda tt: b / a * (1 - math.exp(-a * tt))
    assert abs((sd(t + d) - sd(t - d)) / (2 * d) - b * math.exp(-a * t)) < 1e-6
# 특성근 s^2 + 3s + 2 = 0 -> -1, -2 (둘 다 음수라 자연 응답이 사라짐)
r = sorted(((-3 + s * math.sqrt(9 - 8)) / 2) for s in (1, -1))
assert r == [-2.0, -1.0]
print("ALL CHECKS PASSED")
```
{% endraw %}
