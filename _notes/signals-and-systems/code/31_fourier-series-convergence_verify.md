---
layout: "note"
title: "31_fourier-series-convergence_verify.py"
display_title: "31_fourier-series-convergence_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/fourier-series-convergence/"
parent_title: "푸리에 급수의 수렴"
description: "신호 및 시스템 · 푸리에 급수의 수렴 검증 코드"
permalink: "/studies/signals-and-systems/code/31_fourier-series-convergence_verify/"
---
{% raw %}
[푸리에 급수의 수렴](/Hongs_Blog/studies/signals-and-systems/fourier-series-convergence/) 문서의 검증 코드다.

```python
"""푸리에 급수의 수렴 문서: 사각파의 부분합 x_N에서 오차 에너지 E_N이 줄어들고, 불연속점 값은 ½로 가며, 깁스 현상의 넘침(약 9%)은 N이 커져도 사라지지 않음을 확인한다."""
import math

T, T1 = 4.0, 1.0
w0 = 2 * math.pi / T
a = lambda k: 2 * T1 / T if k == 0 else math.sin(k * w0 * T1) / (k * math.pi)
def xN(t, N):
    return a(0) + sum(2 * a(k) * math.cos(k * w0 * t) for k in range(1, N + 1))
sq = lambda t: 1.0 if abs(t) < T1 else 0.0
def EN(N, n=8000):
    d = T / n
    return sum((sq(-T / 2 + (i + 0.5) * d) - xN(-T / 2 + (i + 0.5) * d, N)) ** 2 for i in range(n)) * d
E = [EN(N) for N in (1, 2, 3, 7, 19, 79)]
assert all(E[i] >= E[i + 1] - 1e-12 for i in range(5))      # 늘지 않는다 (짝수 k 계수는 0이라 N = 1, 2가 같다)
assert abs(E[0] - E[1]) < 1e-9 and E[4] < 0.021 and E[5] < 0.006
# 불연속점 t = T1 에서는 두 쪽 값의 평균 ½
for N in (19, 79, 301):
    assert abs(xN(T1, N) - 0.5) < 1e-9
# 연속인 점에서는 원래 값으로
assert abs(xN(0.3, 301) - 1) < 1e-2 and abs(xN(1.7, 301)) < 1e-2
# 깁스 현상: 최대 넘침 ≈ 0.0895 (점프 1의 약 9%)
for N in (19, 79, 301):
    peak = max(xN(T1 - i * 1e-4, N) for i in range(1, 4000))
    assert 0.085 < peak - 1 < 0.095, (N, peak)
# 디리클레 조건 위반 예: ∫_0^1 1/t dt 는 발산 (부분 적분값이 끝없이 커짐)
assert math.log(1 / 1e-12) > 27
print("ALL CHECKS PASSED")
```
{% endraw %}
