---
layout: "note"
title: "10_unit-impulse-step_verify.py"
display_title: "10_unit-impulse-step_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/unit-impulse-step/"
parent_title: "단위 임펄스와 단위 계단"
description: "신호 및 시스템 · 단위 임펄스와 단위 계단 검증 코드"
permalink: "/studies/signals-and-systems/code/10_unit-impulse-step_verify/"
---
{% raw %}
[단위 임펄스와 단위 계단](/Hongs_Blog/studies/signals-and-systems/unit-impulse-step/) 문서의 검증 코드다.

```python
"""단위 임펄스와 단위 계단 문서: 두 식의 관계, 누적 합, 표본화 성질, 예제 1.7을 확인한다."""
import math

d = lambda n: 1 if n == 0 else 0
u = lambda n: 1 if n >= 0 else 0
for n in range(-10, 11):
    assert d(n) == u(n) - u(n - 1)                                  # 첫 번째 차
    assert u(n) == sum(d(m) for m in range(-200, n + 1))           # 누적 합 (m <= n)
    assert u(n) == sum(d(n - k) for k in range(0, 200))            # 지연된 임펄스의 합 (k >= 0)
# 표본화 성질 x[n]δ[n-n0] = x[n0]δ[n-n0]
x = lambda n: 3 * n * n - 2
for n0 in (-2, 0, 5):
    assert all(x(n) * d(n - n0) == x(n0) * d(n - n0) for n in range(-10, 11))
assert sum(x(n) * d(n - 5) for n in range(-50, 50)) == x(5)

# 연속 시간: 폭 Δ, 높이 1/Δ 인 펄스 δ_Δ 로 근사
def integ(f, a, b, n=20000):
    hh = (b - a) / n
    return sum(f(a + (i + 0.5) * hh) for i in range(n)) * hh
for D in (0.1, 0.01, 0.001):
    dD = lambda t, D=D: 1 / D if 0 <= t < D else 0
    assert abs(integ(dD, -1, 1, 200000) - 1) < 1e-2                 # 넓이 1
    xc = lambda t: math.cos(t) + t * t
    s = integ(lambda t: xc(t) * dD(t - 0.7), 0.6, 0.8 + D, 200000)
    assert abs(s - xc(0.7)) < 2 * D + 1e-2                          # Δ→0이면 x(σ)
# u(t) = ∫_{-∞}^{t} δ_Δ: 램프 근사 u_Δ(t)는 Δ 동안 0에서 1로 오른다
D = 0.05
uD = lambda t: 0 if t < 0 else (t / D if t < D else 1)
assert uD(-0.1) == 0 and abs(uD(D / 2) - 0.5) < 1e-12 and uD(1) == 1
# 예제 1.7: x(t) = 2u(t-1) - 3u(t-2) + 2u(t-4), 도함수는 넓이 2, -3, 2의 임펄스
uc = lambda t: 1 if t > 0 else 0
xt = lambda t: 2 * uc(t - 1) - 3 * uc(t - 2) + 2 * uc(t - 4)
assert [xt(t) for t in (0.5, 1.5, 3, 5)] == [0, 2, -1, 1]
areas = {1: 2, 2: -3, 4: 2}
rec = lambda t: sum(a for t0, a in areas.items() if t0 < t)      # ∫_0^t 도함수 = 지나온 임펄스 넓이의 합
assert all(rec(t) == xt(t) for t in (0.5, 1.5, 3, 5))
print("ALL CHECKS PASSED")
```
{% endraw %}
