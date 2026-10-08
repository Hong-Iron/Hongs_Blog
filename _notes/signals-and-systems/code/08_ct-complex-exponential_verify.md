---
layout: "note"
title: "08_ct-complex-exponential_verify.py"
display_title: "08_ct-complex-exponential_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/ct-complex-exponential/"
parent_title: "연속 시간 복소 지수 신호"
description: "신호 및 시스템 · 연속 시간 복소 지수 신호 검증 코드"
permalink: "/studies/signals-and-systems/code/08_ct-complex-exponential_verify/"
---
{% raw %}
[연속 시간 복소 지수 신호](/Hongs_Blog/studies/signals-and-systems/ct-complex-exponential/) 문서의 검증 코드다.

```python
"""연속 시간 복소 지수 신호 문서: 오일러 관계, 예제 1.5, 주기, 고조파, 일반 복소 지수의 성장·감쇠를 확인한다."""
import cmath, math

ts = [i * 0.137 - 3 for i in range(50)]
for t in ts:
    w, ph, A = 2.3, 0.7, 1.8
    # A cos(ωt+φ) = (A/2)e^{jφ}e^{jωt} + (A/2)e^{-jφ}e^{-jωt} = A Re{e^{j(ωt+φ)}}
    lhs = A * math.cos(w * t + ph)
    rhs = A / 2 * cmath.exp(1j * ph) * cmath.exp(1j * w * t) + A / 2 * cmath.exp(-1j * ph) * cmath.exp(-1j * w * t)
    assert abs(lhs - rhs) < 1e-12 and abs(lhs - (A * cmath.exp(1j * (w * t + ph))).real) < 1e-12
    assert abs(A * math.sin(w * t + ph) - (A * cmath.exp(1j * (w * t + ph))).imag) < 1e-12
    # 예제 1.5: e^{j2t} + e^{j3t} = 2 e^{j2.5t} cos(0.5t), 크기 2|cos(0.5t)|
    s = cmath.exp(2j * t) + cmath.exp(3j * t)
    assert abs(s - 2 * cmath.exp(2.5j * t) * math.cos(0.5 * t)) < 1e-12
    assert abs(abs(s) - 2 * abs(math.cos(0.5 * t))) < 1e-12
    # 일반 복소 지수 C e^{at}, C=|C|e^{jθ}, a=r+jω0
    C, r, w0, th = 1.5, -0.4, 5.0, 0.3
    z = C * cmath.exp(1j * th) * cmath.exp((r + 1j * w0) * t)
    assert abs(z.real - C * math.exp(r * t) * math.cos(w0 * t + th)) < 1e-9
    assert abs(abs(z) - C * math.exp(r * t)) < 1e-9

# 기본 주기 T0 = 2π/|ω0|; e^{jω0 t}와 e^{-jω0 t}는 주기가 같다
for w0 in (1.0, -2.5, 4 * math.pi):
    T0 = 2 * math.pi / abs(w0)
    for t in ts:
        assert abs(cmath.exp(1j * w0 * (t + T0)) - cmath.exp(1j * w0 * t)) < 1e-9
# 2cos(0.5t)의 주기 4π ≈ 12.566, 크기 |cos(0.5t)|의 주기는 그 절반 2π
assert abs(4 * math.pi - 12.5664) < 1e-4
for t in ts:
    assert abs(abs(math.cos(0.5 * (t + 2 * math.pi))) - abs(math.cos(0.5 * t))) < 1e-12
assert abs(math.cos(0.5 * (1 + 2 * math.pi)) - math.cos(0.5)) > 0.1
# 고조파 φ_k(t) = e^{jkω0 t}: 기본 주기 T0/|k|, 그리고 T0마다 모두 되풀이된다
w0 = 2.0; T0 = math.pi
for k in (1, 2, 4, -3):
    for t in ts:
        assert abs(cmath.exp(1j * k * w0 * (t + T0 / abs(k))) - cmath.exp(1j * k * w0 * t)) < 1e-9
        assert abs(cmath.exp(1j * k * w0 * (t + T0)) - cmath.exp(1j * k * w0 * t)) < 1e-9
# 특수값
assert abs(cmath.exp(1j * math.pi / 2) - 1j) < 1e-15 and abs(cmath.exp(1j * math.pi) + 1) < 1e-15
# 페이저: 같은 주파수 정현파의 합 = 페이저의 합
A1, p1, A2, p2, w = 2.0, 0.4, 1.0, -1.1, 3.0
P = A1 * cmath.exp(1j * p1) + A2 * cmath.exp(1j * p2)
for t in ts:
    assert abs(A1 * math.cos(w * t + p1) + A2 * math.cos(w * t + p2) - abs(P) * math.cos(w * t + cmath.phase(P))) < 1e-12
# 1주차 예: z = 1 + j0.5 -> r ≈ 1.118, θ ≈ 0.4636 rad ≈ 26.56°
z = 1 + 0.5j
assert abs(abs(z) - 1.118) < 1e-3 and abs(cmath.phase(z) - 0.4636) < 1e-4 and abs(math.degrees(cmath.phase(z)) - 26.565) < 1e-2
print("ALL CHECKS PASSED")
```
{% endraw %}
