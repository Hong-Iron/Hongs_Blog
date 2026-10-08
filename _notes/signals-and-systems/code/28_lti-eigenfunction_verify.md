---
layout: "note"
title: "28_lti-eigenfunction_verify.py"
display_title: "28_lti-eigenfunction_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/lti-eigenfunction/"
parent_title: "LTI 시스템의 고유함수"
description: "신호 및 시스템 · LTI 시스템의 고유함수 검증 코드"
permalink: "/studies/signals-and-systems/code/28_lti-eigenfunction_verify/"
---
{% raw %}
[LTI 시스템의 고유함수](/Hongs_Blog/studies/signals-and-systems/lti-eigenfunction/) 문서의 검증 코드다.

```python
"""LTI 시스템의 고유함수 문서: e^{st}를 넣은 출력이 H(s)e^{st}임을 수치 컨벌루션으로 확인하고, 예제 3.1과 이산 시간 z^n을 확인한다."""
import cmath, math

def conv_at(x, h, t, lo, hi, n=40000):
    d = (hi - lo) / n
    return sum(h(lo + (i + 0.5) * d) * x(t - lo - (i + 0.5) * d) for i in range(n)) * d   # ∫ h(τ) x(t-τ) dτ

# h(t) = e^{-t}u(t): H(s) = 1/(s+1) (Re s > -1)
h = lambda tau: math.exp(-tau) if tau > 0 else 0.0
for s in (1j * 2, -0.3 + 1j * 1.5, 0.5):
    x = lambda t, s=s: cmath.exp(s * t)
    H = 1 / (s + 1)
    for t in (0.0, 0.7, 2.0):
        y = conv_at(x, h, t, 0, 40)
        assert abs(y - H * x(t)) < 1e-3 * abs(x(t)), (s, t, y, H * x(t))
# 예제 3.1: y(t) = x(t-3) -> H(s) = e^{-3s}, H(j2) = e^{-j6}
for w in (2, 4, 7):
    assert abs(cmath.exp(-3 * 1j * w) - cmath.exp(-1j * 3 * w)) < 1e-15
for t in (0.1, 1.3, 2.9):
    xin = math.cos(4 * t) + math.cos(7 * t)
    y_direct = math.cos(4 * (t - 3)) + math.cos(7 * (t - 3))
    y_eig = (0.5 * cmath.exp(-12j) * cmath.exp(4j * t) + 0.5 * cmath.exp(12j) * cmath.exp(-4j * t)
             + 0.5 * cmath.exp(-21j) * cmath.exp(7j * t) + 0.5 * cmath.exp(21j) * cmath.exp(-7j * t))
    assert abs(y_eig - y_direct) < 1e-12
# 이산 시간: h = [1, 0.5, 0.25] -> y[n] = H(z) z^n, H(z) = Σ h[k] z^{-k}
hd = [1, 0.5, 0.25]
for z in (cmath.exp(0.8j), 0.9 * cmath.exp(-0.3j), 1.2):
    H = sum(hk * z ** (-k) for k, hk in enumerate(hd))
    for n in range(-3, 5):
        y = sum(hk * z ** (n - k) for k, hk in enumerate(hd))
        assert abs(y - H * z ** n) < 1e-12
# 고유값·고유벡터 예 (7주차 p.15~16): A = [[2,1],[1,2]] -> λ = 1, 3
A = [[2, 1], [1, 2]]
for lam, v in ((1, (1, -1)), (3, (1, 1))):
    Av = (A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1])
    assert Av == (lam * v[0], lam * v[1])
print("ALL CHECKS PASSED")
```
{% endraw %}
