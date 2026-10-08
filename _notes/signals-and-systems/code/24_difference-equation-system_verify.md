---
layout: "note"
title: "24_difference-equation-system_verify.py"
display_title: "24_difference-equation-system_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/difference-equation-system/"
parent_title: "차분방정식으로 표현한 LTI 시스템"
description: "신호 및 시스템 · 차분방정식으로 표현한 LTI 시스템 검증 코드"
permalink: "/studies/signals-and-systems/code/24_difference-equation-system_verify/"
---
{% raw %}
[차분방정식으로 표현한 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/difference-equation-system/) 문서의 검증 코드다.

```python
"""차분방정식으로 표현한 인과 LTI 시스템 문서: 예제 2.15, 계단·임펄스 응답, FIR 임펄스 응답, 완전해 예를 재귀 계산과 비교한다."""
from fractions import Fraction as F

def run(a_coef, b_coef, x, N, y_init=None):
    """sum_k a_k y[n-k] = sum_k b_k x[n-k] 를 n = 0..N-1 동안 재귀로 계산 (initial rest 또는 y_init로 y[-1] 등 지정)"""
    y = dict(y_init or {})
    for n in range(N):
        acc = sum(b * x(n - k) for k, b in enumerate(b_coef)) - sum(a_coef[k] * y.get(n - k, 0) for k in range(1, len(a_coef)))
        y[n] = acc / a_coef[0]
    return y

d = lambda n: 1 if n == 0 else 0
u = lambda n: 1 if n >= 0 else 0
# 예제 2.15: y[n] - ½ y[n-1] = x[n], x = Kδ -> y[n] = K (½)^n
K = F(3)
y = run([1, F(-1, 2)], [1], lambda n: K * d(n), 12)
assert all(y[n] == K * F(1, 2) ** n for n in range(12))
# y[n] - a y[n-1] = b x[n]: 계단 응답 s[n] = b(1 - a^{n+1})/(1 - a), 임펄스 응답 h[n] = b a^n
a, b = F(1, 3), F(2)
s = run([1, -a], [b], u, 12); h = run([1, -a], [b], d, 12)
assert all(s[n] == b * (1 - a ** (n + 1)) / (1 - a) for n in range(12))
assert all(h[n] == b * a ** n for n in range(12))
assert all(h[n] == s[n] - s.get(n - 1, 0) for n in range(12))
# FIR: a = [a0], b = [b0..bM] -> h[n] = b_n / a0 (0 <= n <= M), 그 뒤로 0
a0, bs = F(2), [F(1), F(4), F(-2)]
h = run([a0], bs, d, 8)
assert [h[n] for n in range(8)] == [v / a0 for v in bs] + [0] * 5
# 완전해 예: y[n] - 0.6 y[n-1] = u[n], y[n] = 0.3(0.6)^n + 5/2 가 n >= 1 에서 식을 만족하고 y[1] = 2.68
yc = lambda n: F(3, 10) * F(3, 5) ** n + F(5, 2)
assert yc(1) == F(268, 100)
assert all(yc(n) - F(3, 5) * yc(n - 1) == 1 for n in range(1, 15))
# 특성방정식 r - a = 0: y = r^n 을 넣으면 y[n] - a y[n-1] = r^{n-1}(r - a)
r = F(5, 7)
assert all(r ** n - r * r ** (n - 1) == 0 for n in range(1, 6))
print("ALL CHECKS PASSED")
```
{% endraw %}
