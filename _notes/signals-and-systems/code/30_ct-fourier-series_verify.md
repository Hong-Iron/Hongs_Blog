---
layout: "note"
title: "30_ct-fourier-series_verify.py"
display_title: "30_ct-fourier-series_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "30"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/ct-fourier-series/"
parent_title: "연속 시간 푸리에 급수"
description: "신호 및 시스템 · 연속 시간 푸리에 급수 검증 코드"
permalink: "/studies/signals-and-systems/code/30_ct-fourier-series_verify/"
---
{% raw %}
[연속 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/ct-fourier-series/) 문서의 검증 코드다.

```python
"""연속 시간 푸리에 급수 문서: 분석식으로 계수를 수치 적분해 예제 3.2~3.5의 값과 비교하고, 직교성과 합성식을 확인한다."""
import cmath, math

def coef(x, T, k, n=20000):
    w0 = 2 * math.pi / T; d = T / n
    return sum(x(-T / 2 + (i + 0.5) * d) * cmath.exp(-1j * k * w0 * (-T / 2 + (i + 0.5) * d)) for i in range(n)) * d / T

# 직교성: ∫_T e^{j(k-n)w0 t} dt = T (k = n), 0 (k ≠ n)
T = 2.0; w0 = math.pi
for k in range(-3, 4):
    for m in range(-3, 4):
        I = sum(cmath.exp(1j * (k - m) * w0 * (i + 0.5) * T / 4000) for i in range(4000)) * T / 4000
        assert abs(I - (T if k == m else 0)) < 1e-9
# 예제 3.2: a0 = 1, a±1 = 1/4, a±2 = 1/2, a±3 = 1/3, w0 = 2π -> x = 1 + ½cos2πt + cos4πt + ⅔cos6πt
a = {0: 1, 1: 0.25, -1: 0.25, 2: 0.5, -2: 0.5, 3: 1 / 3, -3: 1 / 3}
x32 = lambda t: sum(v * cmath.exp(1j * k * 2 * math.pi * t) for k, v in a.items()).real
for t in (0.0, 0.13, 0.4):
    assert abs(x32(t) - (1 + 0.5 * math.cos(2 * math.pi * t) + math.cos(4 * math.pi * t) + 2 / 3 * math.cos(6 * math.pi * t))) < 1e-12
assert abs(x32(0.13) - (1 + 0.5 * math.cos(2 * math.pi * 0.13) + 0.5 * math.cos(4 * math.pi * 0.13) + 1 / 3 * math.cos(6 * math.pi * 0.13))) > 0.1
for k, v in a.items():
    assert abs(coef(x32, 1.0, k) - v) < 1e-9
# 예제 3.3: sin w0 t -> a±1 = ±1/(2j)
T = 2 * math.pi / 3
for k in range(-3, 4):
    want = 1 / 2j if k == 1 else (-1 / 2j if k == -1 else 0)
    assert abs(coef(lambda t: math.sin(3 * t), T, k) - want) < 1e-9
# 예제 3.4: x = 1 + sin w0t + 2cos w0t + cos(2w0t + π/4)
w = 1.0; T = 2 * math.pi
x34 = lambda t: 1 + math.sin(w * t) + 2 * math.cos(w * t) + math.cos(2 * w * t + math.pi / 4)
want = {0: 1, 1: 1 - 0.5j, -1: 1 + 0.5j, 2: math.sqrt(2) / 4 * (1 + 1j), -2: math.sqrt(2) / 4 * (1 - 1j)}
for k in range(-4, 5):
    assert abs(coef(x34, T, k) - want.get(k, 0)) < 1e-9
assert abs(abs(want[1]) - math.sqrt(1.25)) < 1e-12 and abs(abs(want[1]) - 1.118) < 1e-3   # |a1| = √1.25 ≈ 1.118 (1.25는 |a1|²)
assert abs(abs(want[2]) - 0.5) < 1e-12
assert abs(math.degrees(cmath.phase(want[1])) + 26.565) < 1e-2 and abs(math.degrees(cmath.phase(want[2])) - 45) < 1e-9
# 예제 3.5: 주기 사각파 (|t| < T1에서 1), a0 = 2T1/T, ak = sin(k w0 T1)/(kπ)
for T1, T in ((1.0, 4.0), (1.0, 8.0)):
    sq = lambda t, T1=T1: 1.0 if abs(t) < T1 else 0.0
    w0 = 2 * math.pi / T
    for k in range(0, 6):
        want = 2 * T1 / T if k == 0 else math.sin(k * w0 * T1) / (k * math.pi)
        assert abs(coef(sq, T, k, 80000) - want) < 2e-4, (T, k)
# T = 4T1: a1 = 1/π, a3 = -1/(3π), 짝수 k ≠ 0 은 0 / T = 8T1: a1 = √2/(2π), a2 = 1/(2π), a3 = √2/(6π)
f = lambda k, T: math.sin(k * 2 * math.pi / T) / (k * math.pi)
assert abs(f(1, 4) - 1 / math.pi) < 1e-12 and abs(f(3, 4) + 1 / (3 * math.pi)) < 1e-12 and abs(f(2, 4)) < 1e-12
assert abs(f(1, 8) - math.sqrt(2) / (2 * math.pi)) < 1e-12 and abs(f(2, 8) - 1 / (2 * math.pi)) < 1e-12 and abs(f(3, 8) - math.sqrt(2) / (6 * math.pi)) < 1e-12
# 실수 신호: a_{-k} = a_k*
for k in range(1, 4):
    assert abs(coef(x34, T, -k) - coef(x34, T, k).conjugate()) < 1e-9
print("ALL CHECKS PASSED")
```
{% endraw %}
