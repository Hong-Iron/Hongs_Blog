---
layout: "note"
title: "44_inverse-transform-ladder_p4.py"
display_title: "44_inverse-transform-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "44"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/inverse-transform-ladder/"
parent_title: "푸리에 역변환 예제 사다리"
description: "신호 및 시스템 · 푸리에 역변환 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/signals-and-systems/code/44_inverse-transform-ladder_p4/"
---
{% raw %}
[푸리에 역변환 예제 사다리](/Hongs_Blog/studies/signals-and-systems/inverse-transform-ladder/) 문서의 문제 4 풀이 코드다.

```python
"""푸리에 역변환 예제 사다리 문제 1~4: 부분 분수가 원래 유리함수와 같은지, 시간 함수가 미분방정식을 만족하는지 확인한다."""
import math
close = lambda u, v, e=1e-9: abs(u - v) < e
for w in (0.0, 0.8, 2.5):
    s = 1j * w
    assert close(1 / ((s + 2) * (s + 5)), (1 / 3) / (s + 2) - (1 / 3) / (s + 5))                     # 문제 1
    assert close((s + 3) / ((s + 1) * (s + 2)), 2 / (s + 1) - 1 / (s + 2))                           # 문제 2
    assert close(1 / ((s + 1) ** 2 * (s + 2)), 1 / (s + 1) ** 2 - 1 / (s + 1) + 1 / (s + 2))          # 문제 3
    assert close((s + 4) / ((s + 2) * (s + 3)) * (1 / (s + 2)),                                       # 문제 4: H X
                 -1 / (s + 2) + 2 / (s + 2) ** 2 + 1 / (s + 3))
# 문제 4 시간 해: y = (-e^{-2t} + 2te^{-2t} + e^{-3t})u(t) 가 y'' + 5y' + 6y = x' + 4x, x = e^{-2t} 를 만족
y = lambda t: -math.exp(-2 * t) + 2 * t * math.exp(-2 * t) + math.exp(-3 * t)
h = 1e-4
for t in (0.3, 1.2):
    d1 = (y(t + h) - y(t - h)) / (2 * h); d2 = (y(t + h) - 2 * y(t) + y(t - h)) / h ** 2
    assert abs(d2 + 5 * d1 + 6 * y(t) - (-2 * math.exp(-2 * t) + 4 * math.exp(-2 * t))) < 1e-5
assert abs(y(0)) < 1e-12
print("ALL CHECKS PASSED")
```
{% endraw %}
