---
layout: "note"
title: "16_time-invariance_verify.py"
display_title: "16_time-invariance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/time-invariance/"
parent_title: "시불변성"
description: "신호 및 시스템 · 시불변성 검증 코드"
permalink: "/studies/signals-and-systems/code/16_time-invariance_verify/"
---
{% raw %}
[시불변성](/Hongs_Blog/studies/signals-and-systems/time-invariance/) 문서의 검증 코드다.

```python
"""시불변성 문서: 입력을 미룬 뒤 넣은 출력과 출력을 미룬 것이 같은지로 판정한다 (예제 1.14~1.16)."""
import math, random
random.seed(7)

def ti_dt(S, shifts=(1, 3, -2)):
    for n0 in shifts:
        vals = {n: random.uniform(-1, 1) for n in range(-80, 81)}
        x1 = lambda n: vals.get(n, 0.0)
        x2 = lambda n: x1(n - n0)
        if any(abs(S(x2, n) - S(x1, n - n0)) > 1e-12 for n in range(-30, 31)):
            return False
    return True

def ti_ct(S, shifts=(0.5, 2.0)):
    for t0 in shifts:
        x1 = lambda t: math.sin(1.3 * t) + 0.5 * math.cos(0.4 * t) * t
        x2 = lambda t: x1(t - t0)
        if any(abs(S(x2, t) - S(x1, t - t0)) > 1e-9 for t in [i * 0.37 - 5 for i in range(30)]):
            return False
    return True

assert ti_ct(lambda x, t: math.sin(x(t)))                 # 예제 1.14: 시불변
assert not ti_dt(lambda x, n: n * x(n))                   # 예제 1.15: 시변
assert not ti_ct(lambda x, t: x(2 * t))                   # 예제 1.16: 시변
assert ti_dt(lambda x, n: x(n - 1)) and ti_dt(lambda x, n: sum(x(k) for k in range(-200, n + 1)))
# 예제 1.15의 반례: δ[n] -> 0, δ[n-1] -> δ[n-1]
d = lambda n: 1 if n == 0 else 0
assert all(n * d(n) == 0 for n in range(-5, 6))
assert all(n * d(n - 1) == d(n - 1) for n in range(-5, 6))
# 예제 1.16: x2(t) = x1(t-2) 이면 y2(t) = y1(t-1) (2가 아니라 1만큼만 밀린다)
x1 = lambda t: 1.0 if -2 <= t <= 2 else 0.0
y1 = lambda t: x1(2 * t)
y2 = lambda t: x1(2 * t - 2)
ts = [i * 0.05 - 4 for i in range(200)]
assert all(y2(t) == y1(t - 1) for t in ts) and any(y2(t) != y1(t - 2) for t in ts)
# 계수가 상수인 미분방정식 y' + αy = βx 는 시불변, α(t)가 시간에 따라 변하면 시변 (오일러 방법으로 확인)
def solve(alpha, x, t_end, dt=1e-3):
    y, t = 0.0, 0.0
    while t < t_end - 1e-12:
        y += dt * (-alpha(t) * y + x(t)); t += dt
    return y
pulse = lambda t: 1.0 if 0 <= t < 1 else 0.0
shifted = lambda t: pulse(t - 1)
for alpha, same in ((lambda t: 0.8, True), (lambda t: 0.8 + 0.5 * t, False)):
    assert (abs(solve(alpha, shifted, 3.0) - solve(alpha, pulse, 2.0)) < 1e-3) == same
print("ALL CHECKS PASSED")
```
{% endraw %}
