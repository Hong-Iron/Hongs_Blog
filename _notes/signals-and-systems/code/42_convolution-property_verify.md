---
layout: "note"
title: "42_convolution-property_verify.py"
display_title: "42_convolution-property_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "42"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/convolution-property/"
parent_title: "컨벌루션 성질과 주파수 응답"
description: "신호 및 시스템 · 컨벌루션 성질과 주파수 응답 검증 코드"
permalink: "/studies/signals-and-systems/code/42_convolution-property_verify/"
---
{% raw %}
[컨벌루션 성질과 주파수 응답](/Hongs_Blog/studies/signals-and-systems/convolution-property/) 문서의 검증 코드다.

```python
"""컨벌루션 성질 문서: Y = HX를 예제 4.15~4.20에서 확인한다. 시간 영역 컨벌루션과 주파수 영역 곱의 역변환을 비교한다."""
import cmath, math

def conv_at(x, h, t, lo, hi, n=40000):
    d = (hi - lo) / n
    return sum(x(lo + (i + 0.5) * d) * h(t - lo - (i + 0.5) * d) for i in range(n)) * d
close = lambda u, v, e=1e-3: abs(u - v) < e
# 예제 4.15: h = δ(t - t0) -> H = e^{-jωt0}, |H| = 1, 위상 -ωt0
t0 = 0.7
for w in (0.5, 2.0):
    H = cmath.exp(-1j * w * t0)
    assert close(abs(H), 1, 1e-12) and close(cmath.phase(H), -w * t0, 1e-12)
# 예제 4.19 (a ≠ b): y = (e^{-at} - e^{-bt})u(t)/(b - a)
a, b = 1.0, 3.0
x = lambda t: math.exp(-b * t) if t > 0 else 0.0
h = lambda t: math.exp(-a * t) if t > 0 else 0.0
for t in (0.2, 0.8, 2.0):
    assert close(conv_at(x, h, t, 0, t), (math.exp(-a * t) - math.exp(-b * t)) / (b - a))
# 부분 분수: 1/((a+s)(b+s)) = [1/(a+s) - 1/(b+s)]/(b-a)
for s in (0.5j, 2j, 1 + 1j):
    assert close(1 / ((a + s) * (b + s)), (1 / (a + s) - 1 / (b + s)) / (b - a), 1e-12)
# a = b: y = t e^{-at} u(t), 1/(a+jω)²
for t in (0.3, 1.5):
    assert close(conv_at(h, h, t, 0, t), t * math.exp(-a * t))
# t e^{-at}u(t)의 변환 1/(a+jω)²
def ft(f, w, lo, hi, n=60000):
    d = (hi - lo) / n
    return sum(f(lo + (i + 0.5) * d) * cmath.exp(-1j * w * (lo + (i + 0.5) * d)) for i in range(n)) * d
for w in (0.0, 1.0):
    assert close(ft(lambda t: t * math.exp(-a * t), w, 0, 40), 1 / (a + 1j * w) ** 2, 1e-4)
# 예제 4.20: sin(ωi t)/(πt) * sin(ωc t)/(πt) = sin(ω0 t)/(πt), ω0 = min
wi, wc = 2.0, 3.0
sx = lambda W: (lambda t: W / math.pi if t == 0 else math.sin(W * t) / (math.pi * t))
for t in (0.0, 0.5, 1.3):
    got = conv_at(sx(wi), sx(wc), t, -400, 400, 400000)
    assert abs(got - sx(min(wi, wc))(t)) < 5e-3, (t, got)
# 예제 4.18: 이상적 저역 통과 h = sin(ωc t)/(πt)는 t < 0에서 0이 아니다 (비인과)
assert abs(sx(wc)(-0.4)) > 0.1
# 예제 4.17: 적분기 H = 1/(jω) + πδ(ω); 예제 4.16: 미분기 H = jω
# 직렬 연결: H1·H2 = H2·H1 (곱의 교환법칙)
H1 = lambda w: 1 / (1 + 1j * w); H2 = lambda w: cmath.exp(-0.5j * w)
assert all(close(H1(w) * H2(w), H2(w) * H1(w), 1e-15) for w in (0.3, 2.0))
print("ALL CHECKS PASSED")
```
{% endraw %}
