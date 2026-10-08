---
layout: "note"
title: "15_stability_verify.py"
display_title: "15_stability_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/stability/"
parent_title: "안정성"
description: "신호 및 시스템 · 안정성 검증 코드"
permalink: "/studies/signals-and-systems/code/15_stability_verify/"
---
{% raw %}
[안정성](/Hongs_Blog/studies/signals-and-systems/stability/) 문서의 검증 코드다.

```python
"""안정성 문서: 유계 입력을 넣었을 때 출력이 유계인지 본다 (누산기, 이동 평균, 예제 1.13, 1계 미분방정식)."""
import math, random
random.seed(5)

# 누산기에 단위 계단: y[n] = (n+1)u[n] -> 끝없이 커진다
u = lambda n: 1 if n >= 0 else 0
acc = lambda n: sum(u(k) for k in range(-50, n + 1))
assert [acc(n) for n in range(4)] == [1, 2, 3, 4] and acc(1000) == 1001
# 이동 평균: |x| <= B 이면 |y| <= B
B, M = 2.0, 3
x = {n: random.uniform(-B, B) for n in range(-100, 101)}
y = [sum(x[n - k] for k in range(-M, M + 1)) / (2 * M + 1) for n in range(-90, 91)]
assert max(abs(v) for v in y) <= B
# 예제 1.13 S1: y(t) = t x(t), x = 1 -> y = t (유계 아님)
assert all(abs(t * 1) > 10 ** k for k, t in enumerate([20, 200, 2000], 1))
# S2: y = e^{x(t)}, |x| < B -> e^{-B} < y < e^{B}
for _ in range(1000):
    v = random.uniform(-B, B)
    assert math.exp(-B) <= math.exp(v) <= math.exp(B)
# dy/dt + a y = b x 의 입력 0 응답 C e^{-at}: a > 0이면 줄고 a < 0이면 커진다
for a in (0.5, -0.5):
    vals = [math.exp(-a * t) for t in (0, 10, 20)]
    assert (vals[-1] < vals[0]) == (a > 0)
# 같은 시스템에 x = 1을 넣고 오일러 방법으로 풀면 a > 0일 때 b/a로 수렴, a < 0이면 발산
for a, ok in ((0.5, True), (-0.5, False)):
    yv, dt = 0.0, 1e-3
    for _ in range(40000): yv += dt * (-a * yv + 1.0)
    assert (abs(yv - 1 / a) < 1e-2) == ok
print("ALL CHECKS PASSED")
```
{% endraw %}
