---
layout: "note"
title: "04_signal-energy-power_verify.py"
display_title: "04_signal-energy-power_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/signal-energy-power/"
parent_title: "신호의 에너지와 전력"
description: "신호 및 시스템 · 신호의 에너지와 전력 검증 코드"
permalink: "/studies/signals-and-systems/code/04_signal-energy-power_verify/"
---
{% raw %}
[신호의 에너지와 전력](/Hongs_Blog/studies/signals-and-systems/signal-energy-power/) 문서의 검증 코드다.

```python
"""신호의 에너지와 전력 문서의 예제 값을 수치 적분과 합으로 다시 계산한다."""
import cmath, math
from fractions import Fraction

def integ(f, a, b, n=200000):          # 심프슨 공식
    n += n % 2; hh = (b - a) / n
    s = f(a) + f(b) + sum((4 if i % 2 else 2) * f(a + i * hh) for i in range(1, n))
    return s * hh / 3

def P_ct(f, T):                         # (1/2T) ∫_{-T}^{T} |x|^2 dt
    return integ(lambda t: abs(f(t)) ** 2, -T, T) / (2 * T)

# cos(2πt): P = 1/2, 에너지는 T에 비례해 커진다
assert abs(P_ct(lambda t: math.cos(2 * math.pi * t), 50) - 0.5) < 1e-6
# A e^{-t} u(t): E = A^2/2
A = 3.0
assert abs(integ(lambda t: (A * math.exp(-t)) ** 2, 0, 40) - A * A / 2) < 1e-8
# 0 <= t <= 1 에서 1인 펄스: E = 1, P -> 0
assert abs(integ(lambda t: 1.0, 0, 1) - 1) < 1e-12
assert P_ct(lambda t: 1.0 if 0 <= t <= 1 else 0.0, 1000) < 1e-3
# 상수 4: P = 16
assert abs(P_ct(lambda t: 4.0, 10) - 16) < 1e-9
# x(t) = t: P(T) = T^2/3 이 끝없이 커진다
for T in (10, 100):
    assert abs(P_ct(lambda t: t, T) - T * T / 3) < 1e-6 * T * T
# u(t): P = 1/2
assert abs(P_ct(lambda t: 1.0 if t >= 0 else 0.0, 1000) - 0.5) < 1e-3
# e^{jω0 t}: 한 주기 에너지 T0, 전력 1
w0 = 3.0; T0 = 2 * math.pi / w0
assert abs(integ(lambda t: abs(cmath.exp(1j * w0 * t)) ** 2, 0, T0) - T0) < 1e-9
# 사인파의 실효값(RMS) = 진폭/√2
rms = math.sqrt(integ(lambda t: (2 * math.sin(t)) ** 2, 0, 2 * math.pi) / (2 * math.pi))
assert abs(rms - 2 / math.sqrt(2)) < 1e-9

# 이산: x[n] = 0.5^n (n>=0), 2^n (n<0)  ->  E = 5/3 (닫힌 형태: 1/3 + 4/3)
E = sum(Fraction(1, 4) ** n for n in range(0, 200)) + sum(Fraction(1, 4) ** n for n in range(1, 200))
assert abs(float(E) - 5 / 3) < 1e-15
assert Fraction(1, 4) / (1 - Fraction(1, 4)) + 1 / (1 - Fraction(1, 4)) == Fraction(5, 3)
# u[n]: P_N = (N+1)/(2N+1) -> 1/2
for N in (10, 1000, 10 ** 6):
    PN = Fraction(N + 1, 2 * N + 1)
    assert PN == Fraction(sum(1 for n in range(-N, N + 1) if n >= 0), 2 * N + 1) or N > 1000
assert abs(float(Fraction(10 ** 6 + 1, 2 * 10 ** 6 + 1)) - 0.5) < 1e-6
print("ALL CHECKS PASSED")
```
{% endraw %}
