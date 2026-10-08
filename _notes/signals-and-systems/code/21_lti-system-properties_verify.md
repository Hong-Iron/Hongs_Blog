---
layout: "note"
title: "21_lti-system-properties_verify.py"
display_title: "21_lti-system-properties_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/lti-system-properties/"
parent_title: "임펄스 응답으로 본 LTI 시스템의 성질"
description: "신호 및 시스템 · 임펄스 응답으로 본 LTI 시스템의 성질 검증 코드"
permalink: "/studies/signals-and-systems/code/21_lti-system-properties_verify/"
---
{% raw %}
[임펄스 응답으로 본 LTI 시스템의 성질](/Hongs_Blog/studies/signals-and-systems/lti-system-properties/) 문서의 검증 코드다.

```python
"""임펄스 응답으로 본 LTI 시스템의 성질 문서: 역시스템, 인과성, 안정성 판정을 확인한다 (예제 2.11~2.13)."""
import math
from fractions import Fraction as F

def conv(x, h):
    (nx, xs), (nh, hs) = x, h
    ys = [0] * (len(xs) + len(hs) - 1)
    for i, a in enumerate(xs):
        for j, b in enumerate(hs):
            ys[i + j] += a * b
    return nx + nh, ys

# 예제 2.12: 누산기 h = u[n]과 첫 번째 차 h1 = δ[n] - δ[n-1]의 컨벌루션은 δ[n] (길이 N으로 자른 u로 확인)
N = 30
n0, y = conv((0, [1] * N), (0, [1, -1]))
assert y[:N] == [1] + [0] * (N - 1)          # 잘린 끝(n = N)만 -1이 남는다
# 예제 2.11: δ[n - n0] * δ[n + n0] = δ[n]
for k in (1, 3, 7):
    assert conv((k, [1]), (-k, [1])) == (0, [1])
# 시간 이동 시스템: x * δ[n - n0] = x[n - n0]
xs = [3, -1, 4, 1, 5]
assert conv((0, xs), (2, [1])) == (2, xs)
# 기억 없는 LTI: h = Kδ -> y = Kx
assert conv((0, xs), (0, [7])) == (0, [7 * v for v in xs])

# 인과성: h[n] = 0 (n < 0)이면 y[n]은 x[k], k <= n 만 쓴다
h = {0: 2, 1: -1, 2: 3}                         # 인과
hn = {-1: 1, 0: 1}                              # 비인과
def depends_on_future(hd):
    return any(k < 0 for k, v in hd.items() if v != 0)
assert not depends_on_future(h) and depends_on_future(hn)

# 안정성: Σ|h| < ∞ 이면 |y| <= B Σ|h|
B = 3
hs = [F(1, 2) ** k for k in range(60)]                     # (1/2)^n u[n], Σ|h| = 2
for xs in ([B] * 40, [(-1) ** n * B for n in range(40)]):
    _, ys = conv((0, xs), (0, hs))
    assert max(abs(v) for v in ys) <= B * sum(abs(v) for v in hs)
# 누산기: Σ|u| 가 끝없이 커지고, 계단 입력의 출력도 커진다
assert sum([1] * 1000) == 1000
_, ys = conv((0, [1] * 200), (0, [1] * 200))
assert max(ys) == 200
# 연속 시간: ∫|δ(t - t0)| = 1 (안정), ∫_0^T |u| = T (불안정), ∫|e^{-2t}u(t)| = 1/2 (안정)
assert abs(sum(math.exp(-2 * (i + 0.5) * 1e-3) for i in range(20000)) * 1e-3 - 0.5) < 1e-6
print("ALL CHECKS PASSED")
```
{% endraw %}
