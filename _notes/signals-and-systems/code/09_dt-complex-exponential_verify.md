---
layout: "note"
title: "09_dt-complex-exponential_verify.py"
display_title: "09_dt-complex-exponential_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/dt-complex-exponential/"
parent_title: "이산 시간 복소 지수 신호"
description: "신호 및 시스템 · 이산 시간 복소 지수 신호 검증 코드"
permalink: "/studies/signals-and-systems/code/09_dt-complex-exponential_verify/"
---
{% raw %}
[이산 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/dt-complex-exponential/) 문서의 검증 코드다.

```python
"""이산 시간 복소 지수 신호 문서: 주기 판정, 기본 주기, 2π 주기성, 예제 1.6, 그림 1.25·1.27의 N과 m을 확인한다."""
import cmath, math
from fractions import Fraction as F

def period(w_over_pi):
    """ω0 = (w_over_pi)·π 일 때 e^{jω0 n}의 (N, m). ω0/2π가 유리수가 아니면 None."""
    if w_over_pi is None: return None
    r = F(w_over_pi) / 2              # ω0/2π = m/N (기약분수)
    if r == 0: return (1, 0)
    return (r.denominator, r.numerator)

# 그림 1.27: cos(ω0 n)의 ω0 = 0, π/8, π/4, π/2, π, 3π/2, 7π/4, 15π/8, 2π
cases = {F(1, 8): (16, 1), F(1, 4): (8, 1), F(1, 2): (4, 1), F(1): (2, 1),
         F(3, 2): (4, 3), F(7, 4): (8, 7), F(15, 8): (16, 15)}
for w, nm in cases.items():
    assert period(w) == nm, (w, period(w))
# 그림 1.25: 2π/12 -> N=12, 8π/31 -> N=31, m=4
assert period(F(2, 12)) == (12, 1) and period(F(8, 31)) == (31, 4)
# 그림 1.25(c): cos(n/6)은 ω0/2π = 1/(12π)가 무리수라 주기가 없다. 정수 N에서 되돌아오지 않음을 확인
best = min(abs(math.cos((n0 + N) / 6) - math.cos(n0 / 6)) + abs(math.cos((1 + N) / 6) - math.cos(1 / 6)) for N in range(1, 5000) for n0 in [0])
assert best > 1e-6
# 30π/8 -> N=8, m=15 / 300π/8 -> N=4, m=75 / 7π -> N=2, m=7
assert period(F(30, 8)) == (8, 15) and period(F(300, 8)) == (4, 75) and period(F(7)) == (2, 7)
# ω0와 ω0+2πk는 정수 n에서 같은 신호: 7π ≡ π, 15π/8 ≡ -π/8
for n in range(-20, 21):
    assert abs(cmath.exp(7j * math.pi * n) - cmath.exp(1j * math.pi * n)) < 1e-9
    assert abs(math.cos(15 * math.pi / 8 * n) - math.cos(math.pi / 8 * n)) < 1e-9
    assert abs(cmath.exp(1j * math.pi * n) - (-1) ** n) < 1e-9
# 기본 주기 N = m(2π/ω0)
for w in cases:
    N, m = period(w)
    assert F(m) * 2 / F(w) == N
# 예제 1.6: e^{j(2π/3)n} + e^{j(3π/4)n} -> 각 주기 3, 8 -> 전체 24
N1, N2 = period(F(2, 3))[0], period(F(3, 4))[0]
assert (N1, N2) == (3, 8) and math.lcm(N1, N2) == 24
x = lambda n: cmath.exp(2j * math.pi / 3 * n) + cmath.exp(3j * math.pi / 4 * n)
Nmin = next(N for N in range(1, 100) if all(abs(x(n + N) - x(n)) < 1e-9 for n in range(60)))
assert Nmin == 24
# 크기 |x[n]| = 2|cos(πn/24)| 의 기본 주기는 24 (cos(πn/24) 자체는 48)
mag = lambda n: abs(x(n))
assert all(abs(mag(n) - 2 * abs(math.cos(math.pi * n / 24))) < 1e-9 for n in range(100))
Nmag = next(N for N in range(1, 100) if all(abs(mag(n + N) - mag(n)) < 1e-9 for n in range(100)))
assert Nmag == 24
Ncos = next(N for N in range(1, 100) if all(abs(math.cos(math.pi * (n + N) / 24) - math.cos(math.pi * n / 24)) < 1e-9 for n in range(100)))
assert Ncos == 48
# 고조파 φ_k[n] = e^{jk(2π/N)n}: φ_{k+N} = φ_k, 서로 다른 것은 N개
N = 6
phi = lambda k, n: cmath.exp(1j * k * 2 * math.pi / N * n)
for k in range(-8, 9):
    assert all(abs(phi(k + N, n) - phi(k, n)) < 1e-9 for n in range(-12, 13))
distinct = {tuple(round(phi(k, n).real, 9) + 1j * round(phi(k, n).imag, 9) for n in range(N)) for k in range(-20, 20)}
assert len(distinct) == N
# C α^n: |α|<1 감소, |α|>1 증가, α<0이면 부호가 번갈아 바뀜
for a in (1.2, 0.8, -0.8, -1.2):
    s = [a ** n for n in range(10)]
    assert (abs(s[-1]) > abs(s[0])) == (abs(a) > 1)
    assert all((s[i] * s[i + 1] < 0) == (a < 0) for i in range(9))
print("ALL CHECKS PASSED")
```
{% endraw %}
