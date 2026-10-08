---
layout: "note"
title: "38_ct-fourier-transform_verify.py"
display_title: "38_ct-fourier-transform_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "38"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/ct-fourier-transform/"
parent_title: "연속 시간 푸리에 변환"
description: "신호 및 시스템 · 연속 시간 푸리에 변환 검증 코드"
permalink: "/studies/signals-and-systems/code/38_ct-fourier-transform_verify/"
---
{% raw %}
[연속 시간 푸리에 변환](/Hongs_Blog/studies/signals-and-systems/ct-fourier-transform/) 문서의 검증 코드다.

```python
"""연속 시간 푸리에 변환 문서: 분석식을 수치 적분해 예제 4.1·4.2·4.4·4.5의 결과와 비교하고, 주기 사각파의 T·a_k가 포락선 2sin(ωT1)/ω를 찍은 값임을 확인한다."""
import cmath, math

def ft(x, w, lo, hi, n=40000):
    d = (hi - lo) / n
    return sum(x(lo + (i + 0.5) * d) * cmath.exp(-1j * w * (lo + (i + 0.5) * d)) for i in range(n)) * d
close = lambda u, v, e=1e-4: abs(u - v) < e
a = 1.3
for w in (0.0, 0.7, a, 3.0):
    X = ft(lambda t: math.exp(-a * t), w, 0, 30)                                  # 예제 4.1
    assert close(X, 1 / (a + 1j * w))
    assert close(abs(X), 1 / math.sqrt(a * a + w * w)) and close(cmath.phase(X), -math.atan(w / a))
    assert close(ft(lambda t: math.exp(-a * abs(t)), w, -30, 30, 80000), 2 * a / (a * a + w * w))   # 예제 4.2
assert close(1 / math.sqrt(2 * a * a), math.sqrt(2) / (2 * a), 1e-12)                 # ω = a에서 크기 √2/(2a)
# 복소수 a = 1 + 2j 도 실수부가 양수면 같은 꼴
ac = 1 + 2j
assert close(ft(lambda t: cmath.exp(-ac * t), 0.5, 0, 30), 1 / (ac + 0.5j))
# 예제 4.4: 사각 펄스 -> 2 sin(ωT1)/ω = 2T1 sinc(ωT1/π), ω = 0 에서 2T1
T1 = 1.5
sinc = lambda x: 1.0 if x == 0 else math.sin(math.pi * x) / (math.pi * x)
for w in (0.0, 0.4, math.pi / T1, 2.5):
    want = 2 * T1 if w == 0 else 2 * math.sin(w * T1) / w
    assert close(ft(lambda t: 1.0, w, -T1, T1), want) and close(want, 2 * T1 * sinc(w * T1 / math.pi), 1e-12)
# 예제 4.5: 역변환 (1/2π)∫_{-W}^{W} e^{jωt} dω = sin(Wt)/(πt) = (W/π) sinc(Wt/π)
W = 2.0
for t in (0.0, 0.3, 1.0, math.pi / W):
    x = sum(cmath.exp(1j * (-W + (i + 0.5) * 2 * W / 20000) * t) for i in range(20000)) * 2 * W / 20000 / (2 * math.pi)
    want = W / math.pi if t == 0 else math.sin(W * t) / (math.pi * t)
    assert close(x, want) and close(want, W / math.pi * sinc(W * t / math.pi), 1e-12)
# 주기 사각파 (T1 고정, T = 4T1, 8T1, 16T1): T a_k = 2 sin(ω T1)/ω |_{ω = kω0}
T1 = 1.0
for T in (4.0, 8.0, 16.0):
    w0 = 2 * math.pi / T
    for k in range(1, 6):
        ak = math.sin(k * w0 * T1) / (k * math.pi)
        assert close(T * ak, 2 * math.sin(k * w0 * T1) / (k * w0), 1e-12)
assert close(math.sin(2 * (2 * math.pi / 4)) , 0, 1e-12) and close(math.sin(4 * (2 * math.pi / 8)), 0, 1e-12)   # k=2 (T=4T1), k=4 (T=8T1)에서 0
# 합성식으로 되돌리기: e^{-t}u(t)의 X를 역변환하면 t = 1에서 e^{-1}
L, n = 400.0, 400000
d = 2 * L / n
x1 = sum((1 / (1 + 1j * (-L + (i + 0.5) * d))) * cmath.exp(1j * (-L + (i + 0.5) * d) * 1.0) for i in range(n)) * d / (2 * math.pi)
assert abs(x1 - math.exp(-1)) < 2e-3
print("ALL CHECKS PASSED")
```
{% endraw %}
