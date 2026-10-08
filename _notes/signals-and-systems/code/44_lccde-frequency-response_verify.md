---
layout: "note"
title: "44_lccde-frequency-response_verify.py"
display_title: "44_lccde-frequency-response_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "44"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/lccde-frequency-response/"
parent_title: "미분방정식 시스템의 주파수 응답"
description: "신호 및 시스템 · 미분방정식 시스템의 주파수 응답 검증 코드"
permalink: "/studies/signals-and-systems/code/44_lccde-frequency-response_verify/"
---
{% raw %}
[미분방정식 시스템의 주파수 응답](/Hongs_Blog/studies/signals-and-systems/lccde-frequency-response/) 문서의 검증 코드다.

```python
"""미분방정식 시스템의 주파수 응답 문서: 예제 4.24~4.26의 H(jω), 부분 분수, 출력을 수치 해와 비교한다."""
import math
close = lambda u, v, e=1e-9: abs(u - v) < e
# 예제 4.25: H = (jω+2)/((jω)²+4jω+3) = ½/(jω+1) + ½/(jω+3)
for w in (0.0, 0.7, 3.0):
    s = 1j * w
    assert close((s + 2) / (s * s + 4 * s + 3), 0.5 / (s + 1) + 0.5 / (s + 3))
# 예제 4.26: Y = (jω+2)/((jω+1)²(jω+3)) = ¼/(jω+1) + ½/(jω+1)² - ¼/(jω+3)
for w in (0.0, 0.7, 3.0):
    s = 1j * w
    assert close((s + 2) / ((s + 1) ** 2 * (s + 3)), 0.25 / (s + 1) + 0.5 / (s + 1) ** 2 - 0.25 / (s + 3))
# 계수 연립식 A11 + A21 = 0, 4A11 + A12 + 2A21 = 1, 3A11 + 3A12 + A21 = 2
A11, A12, A21 = 0.25, 0.5, -0.25
assert close(A11 + A21, 0) and close(4 * A11 + A12 + 2 * A21, 1) and close(3 * A11 + 3 * A12 + A21, 2)
# 출력 y = [¼e^{-t} + ½te^{-t} - ¼e^{-3t}]u(t)를 미분방정식 y'' + 4y' + 3y = x' + 2x, x = e^{-t}u(t)에 넣어 확인 (t > 0)
y = lambda t: 0.25 * math.exp(-t) + 0.5 * t * math.exp(-t) - 0.25 * math.exp(-3 * t)
h = 1e-4
for t in (0.3, 1.0, 2.5):
    d1 = (y(t + h) - y(t - h)) / (2 * h); d2 = (y(t + h) - 2 * y(t) + y(t - h)) / (h * h)
    x = math.exp(-t); dx = -math.exp(-t)
    assert abs(d2 + 4 * d1 + 3 * y(t) - (dx + 2 * x)) < 1e-5
assert abs(y(0)) < 1e-12                                          # 초기 휴지: y(0) = 0
# 예제 4.25의 h(t) = ½(e^{-t} + e^{-3t})u(t)도 같은 식을 만족 (입력 δ: t > 0에서 오른쪽 0)
hh = lambda t: 0.5 * (math.exp(-t) + math.exp(-3 * t))
for t in (0.4, 1.7):
    d1 = (hh(t + h) - hh(t - h)) / (2 * h); d2 = (hh(t + h) - 2 * hh(t) + hh(t - h)) / (h * h)
    assert abs(d2 + 4 * d1 + 3 * hh(t)) < 1e-5
# 부분 분수 참고: 1/(x²(x+4)) = -1/16/x + 1/4/x² + 1/16/(x+4)
for xv in (1.0, 2.5, -1.3):
    assert close(1 / (xv * xv * (xv + 4)), -1 / 16 / xv + 0.25 / xv ** 2 + 1 / 16 / (xv + 4))
# 1/((x-2)(x-1)) = 1/(x-2) - 1/(x-1)
for xv in (0.0, 3.0, 5.5):
    assert close(1 / ((xv - 2) * (xv - 1)), 1 / (xv - 2) - 1 / (xv - 1))
print("ALL CHECKS PASSED")
```
{% endraw %}
