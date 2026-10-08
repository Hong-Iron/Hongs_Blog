---
layout: "note"
title: "33_dt-fourier-series_verify.py"
display_title: "33_dt-fourier-series_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "33"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/dt-fourier-series/"
parent_title: "이산 시간 푸리에 급수"
description: "신호 및 시스템 · 이산 시간 푸리에 급수 검증 코드"
permalink: "/studies/signals-and-systems/code/33_dt-fourier-series_verify/"
---
{% raw %}
[이산 시간 푸리에 급수](/Hongs_Blog/studies/signals-and-systems/dt-fourier-series/) 문서의 검증 코드다.

```python
"""이산 시간 푸리에 급수 문서: 분석식(합)으로 계수를 구해 N = 4 예, 예제 3.10~3.12의 값과 비교하고, 합성식이 원래 수열을 정확히 되살림을 확인한다."""
import cmath, math

def dtfs(x, N):
    return [sum(x[n] * cmath.exp(-2j * math.pi * k * n / N) for n in range(N)) / N for k in range(N)]
def synth(a, N, n):
    return sum(a[k] * cmath.exp(2j * math.pi * k * n / N) for k in range(N))
close = lambda u, v, e=1e-12: abs(u - v) < e

# N = 4 예: x = [1, 0, 2, -1] -> a = [1/2, -(1+j)/4, 1, (-1+j)/4]
a = dtfs([1, 0, 2, -1], 4)
for got, want in zip(a, [0.5, -(1 + 1j) / 4, 1, (-1 + 1j) / 4]):
    assert close(got, want)
assert all(close(synth(a, 4, n), x) for n, x in enumerate([1, 0, 2, -1]))
# 한 주기 합: Σ e^{jk(2π/N)n} = N (k가 N의 배수), 0 (그 밖)
for N in (4, 5, 8):
    for k in range(-2 * N, 2 * N + 1):
        s = sum(cmath.exp(2j * math.pi * k * n / N) for n in range(N))
        assert close(s, N if k % N == 0 else 0, 1e-9)
# 계수는 주기 N으로 되풀이: a_{k+N} = a_k
x = [3, -1, 4, 1, -5, 9]
for k in range(6):
    ak = sum(x[n] * cmath.exp(-2j * math.pi * k * n / 6) for n in range(6)) / 6
    akN = sum(x[n] * cmath.exp(-2j * math.pi * (k + 6) * n / 6) for n in range(6)) / 6
    assert close(ak, akN, 1e-9)
# 예제 3.10: sin(2πn/5) -> a1 = 1/(2j), a_{-1} = a4 = -1/(2j) / sin(3·2πn/5) -> a3 = 1/(2j), a_{-3} = a2 = -1/(2j)
a = dtfs([math.sin(2 * math.pi * n / 5) for n in range(5)], 5)
assert close(a[1], 1 / 2j, 1e-12) and close(a[4], -1 / 2j, 1e-12) and all(close(a[k], 0, 1e-12) for k in (0, 2, 3))
a = dtfs([math.sin(3 * 2 * math.pi * n / 5) for n in range(5)], 5)
assert close(a[3], 1 / 2j, 1e-12) and close(a[2], -1 / 2j, 1e-12) and all(close(a[k], 0, 1e-12) for k in (0, 1, 4))
# 예제 3.11: x = 1 + sin(2πn/N) + 3cos(2πn/N) + cos(4πn/N + π/2), N = 8
N = 8
a = dtfs([1 + math.sin(2 * math.pi * n / N) + 3 * math.cos(2 * math.pi * n / N) + math.cos(4 * math.pi * n / N + math.pi / 2) for n in range(N)], N)
want = {0: 1, 1: 1.5 - 0.5j, N - 1: 1.5 + 0.5j, 2: 0.5j, N - 2: -0.5j}
assert all(close(a[k], want.get(k, 0), 1e-12) for k in range(N))
assert close(abs(a[1]), math.sqrt(10) / 2) and abs(math.degrees(cmath.phase(a[1])) + 18.43) < 1e-2
assert all(close(a[(-k) % N], a[k].conjugate(), 1e-12) for k in range(N))
# 예제 3.12: 구형파 (|n| <= N1에서 1), a_k = (1/N) sin(2πk(N1+½)/N)/sin(πk/N), a_0 = (2N1+1)/N
for N, N1 in ((10, 2), (20, 2), (9, 2), (5, 1), (7, 1)):
    xs = [1 if min(n, N - n) <= N1 else 0 for n in range(N)]
    a = dtfs(xs, N)
    for k in range(N):
        want = (2 * N1 + 1) / N if k == 0 else math.sin(2 * math.pi * k * (N1 + 0.5) / N) / (N * math.sin(math.pi * k / N))
        assert close(a[k], want, 1e-12), (N, k)
a = dtfs([1 if min(n, 10 - n) <= 2 else 0 for n in range(10)], 10)
assert close(a[0], 0.5) and abs(a[1].real - 0.3236) < 1e-4 and close(a[2], 0, 1e-12) and abs(a[3].real + 0.1236) < 1e-4 and close(a[4], 0, 1e-12)
# 그림 3.18: N = 9, 2N1+1 = 5. M = 4 (N개 항)이면 부분합이 정확히 같다
N = 9; xs = [1 if min(n, N - n) <= 2 else 0 for n in range(N)]; a = dtfs(xs, N)
part = lambda M, n: sum(a[k % N] * cmath.exp(2j * math.pi * k * n / N) for k in range(-M, M + 1))
assert all(close(part(4, n), xs[n], 1e-12) for n in range(N))
assert any(abs(part(2, n) - xs[n]) > 0.05 for n in range(N))
print("ALL CHECKS PASSED")
```
{% endraw %}
