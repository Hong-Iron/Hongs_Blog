---
layout: "note"
title: "20_convolution-properties_verify.py"
display_title: "20_convolution-properties_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/convolution-properties/"
parent_title: "컨벌루션의 성질"
description: "신호 및 시스템 · 컨벌루션의 성질 검증 코드"
permalink: "/studies/signals-and-systems/code/20_convolution-properties_verify/"
---
{% raw %}
[컨벌루션의 성질](/Hongs_Blog/studies/signals-and-systems/convolution-properties/) 문서의 검증 코드다.

```python
"""컨벌루션의 성질 문서: 교환·분배·결합법칙을 무작위 수열로 확인하고, 예제 2.10의 값을 계산한다."""
import random
from fractions import Fraction as F

def conv(x, h):
    (nx, xs), (nh, hs) = x, h
    ys = [0] * (len(xs) + len(hs) - 1)
    for i, a in enumerate(xs):
        for j, b in enumerate(hs):
            ys[i + j] += a * b
    return nx + nh, ys

def add(x, y):
    (nx, xs), (ny, ys) = x, y
    lo, hi = min(nx, ny), max(nx + len(xs), ny + len(ys))
    get = lambda s, n: s[1][n - s[0]] if 0 <= n - s[0] < len(s[1]) else 0
    return lo, [get(x, n) + get(y, n) for n in range(lo, hi)]

def norm(s):
    n0, v = s
    while v and v[0] == 0: v = v[1:]; n0 += 1
    while v and v[-1] == 0: v = v[:-1]
    return (n0, v) if v else (0, [])

random.seed(2)
rs = lambda: (random.randint(-3, 3), [random.randint(-4, 4) for _ in range(random.randint(1, 6))])
for _ in range(300):
    x, h1, h2 = rs(), rs(), rs()
    assert norm(conv(x, h1)) == norm(conv(h1, x))                                   # 교환
    assert norm(conv(x, add(h1, h2))) == norm(add(conv(x, h1), conv(x, h2)))        # 분배
    assert norm(conv(conv(x, h1), h2)) == norm(conv(x, conv(h1, h2)))               # 결합
    assert norm(conv(conv(x, h1), h2)) == norm(conv(conv(x, h2), h1))               # 직렬 순서 무관

# 예제 2.10: x = (1/2)^n u[n] + 2^n u[-n], h = u[n] -> y = 4 - (1/2)^n (n >= 0), 2^{n+1} (n < 0)
x = lambda k: (F(1, 2) ** k if k >= 0 else 0) + (F(2) ** k if k <= 0 else 0)
u = lambda k: 1 if k >= 0 else 0
for n in range(-5, 8):
    got = sum(x(k) * u(n - k) for k in range(-90, n + 1))
    want = 4 - F(1, 2) ** n if n >= 0 else F(2) ** (n + 1)
    assert abs(got - want) < F(1, 2 ** 80), n
vals = {n: 4 - F(1, 2) ** n if n >= 0 else F(2) ** (n + 1) for n in range(-3, 3)}
assert vals[-3] == F(1, 4) and vals[-2] == F(1, 2) and vals[-1] == 1 and vals[0] == 3 and vals[1] == F(7, 2) and vals[2] == F(15, 4)
# 비선형 max 시스템 예(6주차 p.3): max는 중첩을 깨뜨린다
m1, m2 = [[0, 1], [2, 3]], [[4, 5], [0, 1]]
comb = [[m1[i][j] - m2[i][j] for j in range(2)] for i in range(2)]
assert max(map(max, comb)) == 2 and max(map(max, m1)) - max(map(max, m2)) == -2
print("ALL CHECKS PASSED")
```
{% endraw %}
