---
layout: "note"
title: "39_periodic-fourier-transform_verify.py"
display_title: "39_periodic-fourier-transform_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "39"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/periodic-fourier-transform/"
parent_title: "주기 신호의 푸리에 변환"
description: "신호 및 시스템 · 주기 신호의 푸리에 변환 검증 코드"
permalink: "/studies/signals-and-systems/code/39_periodic-fourier-transform_verify/"
---
{% raw %}
[주기 신호의 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/periodic-fourier-transform/) 문서의 검증 코드다.

```python
"""주기 신호의 푸리에 변환 문서: 임펄스 넓이 2πa_k를 예제 4.6~4.8에서 계산하고, 합성식에 넣으면 원래 주기 신호가 됨을 확인한다."""
import cmath, math
close = lambda u, v, e=1e-9: abs(u - v) < e
# 예제 4.6: 사각파 (T = 4T1) -> 넓이 2 sin(kω0T1)/k : k = 0 에서 π (= 2π·½), k = ±1 에서 2
T1 = 1.0; T = 4.0; w0 = 2 * math.pi / T
area = lambda k: 2 * math.pi * (2 * T1 / T) if k == 0 else 2 * math.sin(k * w0 * T1) / k
assert close(area(0), math.pi) and close(area(1), 2) and close(area(-1), 2) and close(area(2), 0) and close(area(3), -2 / 3)
assert all(close(area(k), 2 * math.pi * (math.sin(k * w0 * T1) / (k * math.pi))) for k in range(1, 6))
assert all(close(area(k), math.pi * (math.sin(math.pi * k / 2) / (math.pi * k / 2))) for k in range(1, 6))   # π sinc(k/2)
# 합성: (1/2π)∫ Σ 2π a_k δ(ω - kω0) e^{jωt} dω = Σ a_k e^{jkω0t}
x = lambda t, N=2000: sum((area(k) / (2 * math.pi)) * cmath.exp(1j * k * w0 * t) for k in range(-N, N + 1)).real
assert abs(x(0.3) - 1) < 2e-3 and abs(x(1.7)) < 2e-3
# 예제 4.7: sin ω0t -> (π/j)[δ(ω-ω0) - δ(ω+ω0)] = -jπδ(ω-ω0) + jπδ(ω+ω0), cos ω0t -> π[δ(ω-ω0)+δ(ω+ω0)]
assert close(math.pi / 1j, -1j * math.pi)
w = 3.0
for t in (0.2, 1.1):
    s = (1 / (2 * math.pi)) * ((-1j * math.pi) * cmath.exp(1j * w * t) + (1j * math.pi) * cmath.exp(-1j * w * t))
    c = (1 / (2 * math.pi)) * (math.pi * cmath.exp(1j * w * t) + math.pi * cmath.exp(-1j * w * t))
    assert close(s, math.sin(w * t)) and close(c, math.cos(w * t))
# 1 <-> 2πδ(ω): (1/2π)·2π·e^{j0t} = 1
assert close((1 / (2 * math.pi)) * 2 * math.pi * cmath.exp(0j), 1)
# 예제 4.8: 임펄스 열 -> (2π/T) Σ δ(ω - 2πk/T): 간격 2π/T, 넓이 2π/T. T를 키우면 간격이 줄어든다
for T in (0.5, 2.0, 8.0):
    ak = 1 / T
    assert close(2 * math.pi * ak, 2 * math.pi / T)
assert 2 * math.pi / 8.0 < 2 * math.pi / 2.0 < 2 * math.pi / 0.5
print("ALL CHECKS PASSED")
```
{% endraw %}
