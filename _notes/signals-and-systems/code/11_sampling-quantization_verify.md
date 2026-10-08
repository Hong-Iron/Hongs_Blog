---
layout: "note"
title: "11_sampling-quantization_verify.py"
display_title: "11_sampling-quantization_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/sampling-quantization/"
parent_title: "표본화와 양자화"
description: "신호 및 시스템 · 표본화와 양자화 검증 코드"
permalink: "/studies/signals-and-systems/code/11_sampling-quantization_verify/"
---
{% raw %}
[표본화와 양자화](/Hongs_Blog/studies/signals-and-systems/sampling-quantization/) 문서의 검증 코드다.

```python
"""표본화와 양자화 문서: 표본화 x[n] = x(nTs), b비트 양자화 단계 수 2^b와 최대 오차를 확인한다."""
import math

# 표본화: 주파수 f인 코사인을 Ts 간격으로 뽑으면 x[n] = cos(2π f Ts n)
f, Ts = 2.0, 0.05
xs = [math.cos(2 * math.pi * f * n * Ts) for n in range(40)]
assert all(abs(xs[n] - math.cos(2 * math.pi * (f * Ts) * n)) < 1e-12 for n in range(40))
assert all(abs(xs[n + 10] - xs[n]) < 1e-9 for n in range(30))          # f·Ts = 1/10 -> 10개마다 반복

def quantize(v, b, lo=-1.0, hi=1.0):
    k = 2 ** b; step = (hi - lo) / k
    i = min(k - 1, max(0, int((v - lo) / step)))
    return lo + (i + 0.5) * step, step

for b in (1, 2, 4, 6, 8):
    vals = [-1 + 2 * i / 9999 for i in range(10000)]
    q = [quantize(v, b) for v in vals]
    levels = {round(a, 12) for a, _ in q}
    assert len(levels) == 2 ** b                                         # 단계 수 2^b (64, 16, 4, 2 등)
    step = q[0][1]
    assert max(abs(v - a) for v, (a, _) in zip(vals, q)) <= step / 2 + 1e-12   # 오차는 한 칸의 절반 이하
assert [2 ** b for b in (6, 4, 2, 1)] == [64, 16, 4, 2] and 2 ** 8 == 256
print("ALL CHECKS PASSED")
```
{% endraw %}
