---
layout: "note"
title: "35_fourier-series-lti_verify.py"
display_title: "35_fourier-series-lti_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "35"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/fourier-series-lti/"
parent_title: "푸리에 급수와 LTI 시스템"
description: "신호 및 시스템 · 푸리에 급수와 LTI 시스템 검증 코드"
permalink: "/studies/signals-and-systems/code/35_fourier-series-lti_verify/"
---
{% raw %}
[푸리에 급수와 LTI 시스템](/Hongs_Blog/studies/signals-and-systems/fourier-series-lti/) 문서의 검증 코드다.

```python
"""푸리에 급수와 LTI 시스템 문서: 출력 계수 b_k = a_k H(jkω0)를 예제 3.16, 3.17에서 직접 컨벌루션 결과와 비교한다."""
import cmath, math

close = lambda u, v, e=1e-6: abs(u - v) < e
# 예제 3.16: x = 1 + ½cos2πt + cos4πt + ⅔cos6πt, h = e^{-t}u(t), H(jω) = 1/(1+jω)
a = {0: 1, 1: 0.25, -1: 0.25, 2: 0.5, -2: 0.5, 3: 1 / 3, -3: 1 / 3}
H = lambda w: 1 / (1 + 1j * w)
b = {k: v * H(2 * math.pi * k) for k, v in a.items()}
assert close(b[0], 1, 1e-12) and close(b[1], 0.25 / (1 + 2j * math.pi), 1e-12)
assert all(close(b[-k], b[k].conjugate(), 1e-12) for k in (1, 2, 3))
D1 = abs(b[1]); th1 = cmath.phase(b[1])
assert close(D1, 1 / (4 * math.sqrt(1 + 4 * math.pi ** 2)), 1e-12) and close(th1, -math.atan(2 * math.pi), 1e-12)
assert close(b[1].real, 1 / (4 * (1 + 4 * math.pi ** 2)), 1e-12) and close(b[1].imag, -math.pi / (2 * (1 + 4 * math.pi ** 2)), 1e-12)
x = lambda t: 1 + 0.5 * math.cos(2 * math.pi * t) + math.cos(4 * math.pi * t) + 2 / 3 * math.cos(6 * math.pi * t)
y_fs = lambda t: sum(v * cmath.exp(2j * math.pi * k * t) for k, v in b.items()).real
def y_conv(t, L=30.0, n=60000):
    d = L / n
    return sum(math.exp(-(i + 0.5) * d) * x(t - (i + 0.5) * d) for i in range(n)) * d
for t in (0.0, 0.31, 0.77):
    assert close(y_fs(t), y_conv(t), 1e-4)
# 예제 3.17: h = α^n u[n], x = cos(2πn/N) -> y = Re-form, N = 4: y = cos(πn/2 - atan α)/sqrt(1+α²)
for al in (0.5, -0.3, 0.9):
    for N in (4, 7):
        Hd = lambda w: 1 / (1 - al * cmath.exp(-1j * w))
        for n in range(0, 12):
            yc = sum(al ** k * math.cos(2 * math.pi * (n - k) / N) for k in range(0, 400))
            yf = (0.5 * Hd(2 * math.pi / N) * cmath.exp(2j * math.pi * n / N) + 0.5 * Hd(-2 * math.pi / N) * cmath.exp(-2j * math.pi * n / N)).real
            assert close(yc, yf, 1e-9)
            if N == 4:
                assert close(yf, math.cos(math.pi * n / 2 - math.atan(al)) / math.sqrt(1 + al * al), 1e-12)
print("ALL CHECKS PASSED")
```
{% endraw %}
