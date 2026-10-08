---
layout: "note"
title: "41_duality_verify.py"
display_title: "41_duality_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "41"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/fourier-duality/"
parent_title: "푸리에 변환의 쌍대성"
description: "신호 및 시스템 · 푸리에 변환의 쌍대성 검증 코드"
permalink: "/studies/signals-and-systems/code/41_duality_verify/"
---
{% raw %}
[푸리에 변환의 쌍대성](/Hongs_Blog/studies/signals-and-systems/fourier-duality/) 문서의 검증 코드다.

```python
"""쌍대성 문서: 예제 4.13 F{2/(1+t²)} = 2πe^{-|ω|}와 사각 펄스 ↔ sinc 쌍의 대칭을 수치 적분으로 확인한다."""
import cmath, math

def ft(x, w, lo, hi, n):
    d = (hi - lo) / n
    return sum(x(lo + (i + 0.5) * d) * cmath.exp(-1j * w * (lo + (i + 0.5) * d)) for i in range(n)) * d
for w in (0.0, 0.5, 1.5, 3.0):
    assert abs(ft(lambda t: 2 / (1 + t * t), w, -2000, 2000, 800000) - 2 * math.pi * math.exp(-abs(w))) < 3e-3
# x1 = 사각 펄스(T1) -> 2 sin(ωT1)/ω ; x2 = sin(Wt)/(πt) -> 사각(W). 쌍대성: X1(t) <-> 2π x1(-ω)
T1 = 1.0
X1 = lambda t: 2.0 * T1 if t == 0 else 2 * math.sin(t * T1) / t
for w in (0.0, 0.5, 2.0):
    got = ft(X1, w, -3000, 3000, 1200000)
    want = 2 * math.pi * (1.0 if abs(w) < T1 else 0.0)
    assert abs(got - want) < 2e-2, (w, got)
# δ(t) <-> 1 이면 1 <-> 2πδ(ω): 1을 넓은 구간에서 적분하면 ω = 0에서만 커진다
assert abs(ft(lambda t: 1.0, 0.0, -50, 50, 1000) - 100) < 1e-9 and abs(ft(lambda t: 1.0, 1.0, -50 * math.pi, 50 * math.pi, 100000)) < 1e-6
print("ALL CHECKS PASSED")
```
{% endraw %}
