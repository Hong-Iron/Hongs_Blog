---
layout: "note"
title: "34_dtfs-properties_verify.py"
display_title: "34_dtfs-properties_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/dtfs-properties/"
parent_title: "이산 시간 푸리에 급수의 성질"
description: "신호 및 시스템 · 이산 시간 푸리에 급수의 성질 검증 코드"
permalink: "/studies/signals-and-systems/code/34_dtfs-properties_verify/"
---
{% raw %}
[이산 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/dtfs-properties/) 문서의 검증 코드다.

```python
"""이산 시간 푸리에 급수의 성질 문서: 표 3.2의 성질과 예제 3.13~3.15를 계산해 확인한다."""
import cmath, math

def dtfs(x, N):
    return [sum(x[n % N] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N)) / N for k in range(N)]
close = lambda u, v, e=1e-9: abs(u - v) < e
N = 6
x = [3, -1, 4, 1, -5, 9]; y = [2, 7, 1, 8, 2, 8]
a, b = dtfs(x, N), dtfs(y, N)
w = lambda k: cmath.exp(-2j * math.pi * k / N)
for k in range(N):
    assert close(dtfs([x[(n - 2) % N] for n in range(N)], N)[k], a[k] * w(k) ** 2)                 # 시간 이동
    assert close(dtfs([x[(-n) % N] for n in range(N)], N)[k], a[(-k) % N])                           # 시간 반전
    assert close(dtfs([x[n] * y[n] for n in range(N)], N)[k], sum(a[l] * b[(k - l) % N] for l in range(N)))   # 곱셈
    pc = [sum(x[r] * y[(n - r) % N] for r in range(N)) for n in range(N)]
    assert close(dtfs(pc, N)[k], N * a[k] * b[k])                                                     # 주기 컨벌루션
    assert close(dtfs([x[n] - x[(n - 1) % N] for n in range(N)], N)[k], (1 - w(k)) * a[k])           # 첫 번째 차
    assert close(a[(-k) % N], a[k].conjugate())                                                       # 실수 신호
    M = 2
    assert close(dtfs([cmath.exp(2j * math.pi * M * n / N) * x[n] for n in range(N)], N)[k], a[(k - M) % N])   # 주파수 이동
# 파스발
assert close(sum(v * v for v in x) / N, sum(abs(v) ** 2 for v in a))
# 시간 척도 x_(m)[n]: 주기 mN, 계수 a_k / m
m = 3
xm = [x[n // m] if n % m == 0 else 0 for n in range(m * N)]
am = dtfs(xm, m * N)
assert all(close(am[k], a[k % N] / m) for k in range(m * N))
# 예제 3.13: x = x1(구형파 N1=1, N=5) + 1 -> a_k = (1/5) sin(3πk/5)/sin(πk/5) (k≠0), a_0 = 8/5
xs = [2 if min(n, 5 - n) <= 1 else 1 for n in range(5)]
a = dtfs(xs, 5)
assert close(a[0], 8 / 5) and all(close(a[k], math.sin(3 * math.pi * k / 5) / (5 * math.sin(math.pi * k / 5))) for k in range(1, 5))
# 예제 3.14: 조건을 만족하고 전력이 가장 작은 x = 1/3 + (1/6)(-1)^n
xs = [1 / 3 + (-1) ** n / 6 for n in range(6)]
assert close(sum(xs), 2) and close(sum((-1) ** n * xs[n % 6] for n in range(2, 8)), 1)
assert close(xs[0], 0.5) and close(xs[1], 1 / 6) and close(xs[2], 0.5)
a = dtfs(xs, 6)
assert close(a[0], 1 / 3) and close(a[3], 1 / 6) and all(close(a[k], 0) for k in (1, 2, 4, 5))
# 다른 계수가 0이 아니면 전력이 커진다
xs2 = [xs[n] + 0.1 * math.cos(2 * math.pi * n / 6) for n in range(6)]
assert close(sum(xs2), 2) and close(sum((-1) ** n * xs2[n % 6] for n in range(2, 8)), 1)
assert sum(v * v for v in xs2) > sum(v * v for v in xs)
# 예제 3.15: x = 구형파(N1 = 1, N = 7), w = x ⊛ x -> w[0..3] = 3, 2, 1, 0, c_k = sin²(3πk/7)/(7 sin²(πk/7))
xs = [1 if min(n, 7 - n) <= 1 else 0 for n in range(7)]
wv = [sum(xs[r % 7] * xs[(n - r) % 7] for r in range(7)) for n in range(7)]
assert wv[0] == 3 and wv[1] == wv[6] == 2 and wv[2] == wv[5] == 1 and wv[3] == wv[4] == 0
c = dtfs(wv, 7)
d = dtfs(xs, 7)
assert all(close(c[k], 7 * d[k] ** 2) for k in range(7))
assert all(close(c[k], math.sin(3 * math.pi * k / 7) ** 2 / (7 * math.sin(math.pi * k / 7) ** 2)) for k in range(1, 7)) and close(c[0], 9 / 7)
print("ALL CHECKS PASSED")
```
{% endraw %}
