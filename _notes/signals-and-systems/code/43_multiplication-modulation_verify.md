---
layout: "note"
title: "43_multiplication-modulation_verify.py"
display_title: "43_multiplication-modulation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "43"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/multiplication-modulation/"
parent_title: "곱셈 성질과 진폭 변조"
description: "신호 및 시스템 · 곱셈 성질과 진폭 변조 검증 코드"
permalink: "/studies/signals-and-systems/code/43_multiplication-modulation_verify/"
---
{% raw %}
[곱셈 성질과 진폭 변조](/Hongs_Blog/studies/signals-and-systems/multiplication-modulation/) 문서의 검증 코드다.

```python
"""곱셈 성질과 진폭 변조 문서: 예제 4.21~4.23과 가변 중심 주파수 대역 통과 필터의 스펙트럼 이동을 확인한다."""
import cmath, math

def ft(x, w, lo, hi, n=80000):
    d = (hi - lo) / n
    return sum(x(lo + (i + 0.5) * d) * cmath.exp(-1j * w * (lo + (i + 0.5) * d)) for i in range(n)) * d
close = lambda u, v, e=2e-3: abs(u - v) < e
s = lambda t: math.exp(-t * t)                       # 대역이 좁은 메시지 신호
S = lambda w: math.sqrt(math.pi) * math.exp(-w * w / 4)
w0 = 12.0
# 예제 4.21: r = s cos(ω0 t) -> R = ½S(ω-ω0) + ½S(ω+ω0)
for w in (0.0, w0 - 1, w0, w0 + 2, -w0):
    assert close(ft(lambda t: s(t) * math.cos(w0 * t), w, -8, 8), 0.5 * S(w - w0) + 0.5 * S(w + w0))
# 예제 4.22: g = r cos(ω0 t) -> G = ¼S(ω-2ω0) + ½S(ω) + ¼S(ω+2ω0)
for w in (0.0, 1.0, 2 * w0, -2 * w0):
    want = 0.25 * S(w - 2 * w0) + 0.5 * S(w) + 0.25 * S(w + 2 * w0)
    assert close(ft(lambda t: s(t) * math.cos(w0 * t) ** 2, w, -8, 8), want)
# 저역 통과(|ω| < ω1)로 거르면 ½S, 곧 ½s(t)가 복원된다 (복조)
assert close(0.5 * S(0.0), ft(lambda t: 0.5 * s(t), 0.0, -8, 8))
# 예제 4.23: x = sin t sin(t/2)/(πt²) -> 사다리꼴 (높이 ½, 모서리 ±½, ±3/2)
x = lambda t: 0.5 / math.pi if t == 0 else math.sin(t) * math.sin(t / 2) / (math.pi * t * t)
trap = lambda w: 0.5 if abs(w) <= 0.5 else (0.5 * (1.5 - abs(w)) if abs(w) <= 1.5 else 0.0)
for w in (0.0, 0.3, 1.0, 1.4, 2.0):
    assert abs(ft(x, w, -600, 600, 600000) - trap(w)) < 3e-3, w
# 가변 중심 주파수: e^{jωc t}를 곱하면 스펙트럼이 ωc만큼 오른쪽으로
wc = 5.0
for w in (wc, wc + 1):
    assert close(ft(lambda t: cmath.exp(1j * wc * t) * s(t), w, -8, 8), S(w - wc))
print("ALL CHECKS PASSED")
```
{% endraw %}
