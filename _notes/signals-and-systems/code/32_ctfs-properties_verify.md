---
layout: "note"
title: "32_ctfs-properties_verify.py"
display_title: "32_ctfs-properties_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "3-1학기"
parent_url: "/studies/signals-and-systems/ctfs-properties/"
parent_title: "연속 시간 푸리에 급수의 성질"
description: "신호 및 시스템 · 연속 시간 푸리에 급수의 성질 검증 코드"
permalink: "/studies/signals-and-systems/code/32_ctfs-properties_verify/"
---
{% raw %}
[연속 시간 푸리에 급수의 성질](/Hongs_Blog/studies/signals-and-systems/ctfs-properties/) 문서의 검증 코드다.

```python
"""연속 시간 푸리에 급수의 성질 문서: 표 3.1의 성질과 예제 3.6~3.9, 파스발 관계를 분석식 수치 적분으로 확인한다."""
import cmath, math

def coef(x, T, k, n=8000):
    w0 = 2 * math.pi / T; d = T / n
    return sum(x(-T / 2 + (i + 0.5) * d) * cmath.exp(-1j * k * w0 * (-T / 2 + (i + 0.5) * d)) for i in range(n)) * d / T

T = 2.0; w0 = math.pi
x = lambda t: 1 + math.sin(w0 * t) + 2 * math.cos(w0 * t) + math.cos(2 * w0 * t + math.pi / 4)   # 예제 3.4 꼴
y = lambda t: math.cos(w0 * t) - 0.5 * math.sin(3 * w0 * t)
K = range(-4, 5)
a = {k: coef(x, T, k) for k in range(-8, 9)}
b = {k: coef(y, T, k) for k in range(-8, 9)}
t0 = 0.37
for k in K:
    assert abs(coef(lambda t: 2 * x(t) - 3 * y(t), T, k) - (2 * a[k] - 3 * b[k])) < 1e-9          # 선형성
    assert abs(coef(lambda t: x(t - t0), T, k) - cmath.exp(-1j * k * w0 * t0) * a[k]) < 1e-9       # 시간 이동
    assert abs(coef(lambda t: x(-t), T, k) - a[-k]) < 1e-9                                           # 시간 반전
    assert abs(coef(lambda t: x(3 * t), T / 3, k) - a[k]) < 1e-9                                     # 척도: 주기 T/3, 계수 그대로
    assert abs(coef(lambda t: x(t) * y(t), T, k) - sum(a[l] * b[k - l] for l in range(-4, 5))) < 1e-9   # 곱셈
    dx = lambda t: w0 * math.cos(w0 * t) - 2 * w0 * math.sin(w0 * t) - 2 * w0 * math.sin(2 * w0 * t + math.pi / 4)
    assert abs(coef(dx, T, k) - 1j * k * w0 * a[k]) < 1e-9                                           # 미분
    assert abs(a[-k] - a[k].conjugate()) < 1e-9                                                       # 실수 신호의 켤레 대칭
# 주기 컨벌루션 ↔ T a_k b_k
def pconv(t, n=1500):
    d = T / n
    return sum(x((i + 0.5) * d) * y(t - (i + 0.5) * d) for i in range(n)) * d
for k in (-1, 0, 1, 3):
    assert abs(coef(pconv, T, k, 600) - T * a[k] * b[k]) < 1e-6
# 파스발: (1/T)∫|x|^2 = Σ|a_k|^2
P = sum(x(-T / 2 + (i + 0.5) * T / 8000) ** 2 for i in range(8000)) / 8000
assert abs(P - sum(abs(v) ** 2 for v in a.values())) < 1e-9
# 예제 3.6: g(t) = x(t-1) - 0.5, x = 사각파(T = 4, T1 = 1) -> d_k = sin(πk/2)/(kπ) e^{-jkπ/2}, d_0 = 0
sq = lambda t: 1.0 if abs(((t + 2) % 4) - 2) < 1 else 0.0
g = lambda t: sq(t - 1) - 0.5
for k in range(-4, 5):
    want = 0 if k == 0 else math.sin(math.pi * k / 2) / (k * math.pi) * cmath.exp(-1j * k * math.pi / 2)
    assert abs(coef(g, 4.0, k, 40000) - want) < 2e-4, k
# 예제 3.7: 삼각파 (x(0) = 0, x(±2) = 1, 주기 4) -> e_k = 2 sin(πk/2) e^{-jkπ/2} / (j (kπ)^2), e_0 = 1/2
tri = lambda t: abs(((t + 2) % 4) - 2) / 2
for k in range(-4, 5):
    want = 0.5 if k == 0 else 2 * math.sin(math.pi * k / 2) * cmath.exp(-1j * k * math.pi / 2) / (1j * (k * math.pi) ** 2)
    assert abs(coef(tri, 4.0, k, 40000) - want) < 1e-6, k
# 예제 3.8: 임펄스 열 -> a_k = 1/T (폭 ε 펄스로 근사)
eps = 1e-3; Tt = 2.0
imp = lambda t: 1 / eps if abs(t) < eps / 2 else 0.0
for k in range(0, 4):
    assert abs(coef(imp, Tt, k, 200000) - 1 / Tt) < 1e-3
# 사각파의 도함수 q(t) = δ(t+T1) - δ(t-T1) 의 계수 b_k = 2j sin(k w0 T1)/T = jk w0 c_k
T1, Tq = 1.0, 4.0; wq = 2 * math.pi / Tq
for k in range(1, 4):
    bk = (cmath.exp(1j * k * wq * T1) - cmath.exp(-1j * k * wq * T1)) / Tq
    ck = math.sin(k * wq * T1) / (k * math.pi)
    assert abs(bk - 2j * math.sin(k * wq * T1) / Tq) < 1e-12 and abs(bk - 1j * k * wq * ck) < 1e-12
# 예제 3.9: 답 x(t) = ±cos(πt/2). b_k = e^{-jπk/2} a_{-k} 인 신호 x(-t+1)이 홀함수, b_1 = ±j/2
for s in (1, -1):
    xs = lambda t, s=s: s * math.cos(math.pi * t / 2)
    a1 = coef(xs, 4.0, 1)
    assert abs(a1 - s * 0.5) < 1e-9
    b1 = cmath.exp(-1j * math.pi / 2) * coef(xs, 4.0, -1)
    assert abs(b1 - (-s) * 0.5j) < 1e-9                                  # b_1 = -j a_{-1}: s = -1 이면 j/2, s = 1 이면 -j/2
    assert abs(b1 - coef(lambda t: xs(-t + 1), 4.0, 1)) < 1e-9           # x(-t+1)의 계수와 같다 (e^{-jπk/2} 쪽이 맞다)
    assert all(abs(xs(-(-t) + 1) + xs(-t + 1)) < 1e-12 for t in (0.3, 1.1))   # x(-t+1)은 홀함수
    assert abs(sum(xs(-2 + (i + 0.5) * 4 / 4000) ** 2 for i in range(4000)) / 4000 - 0.5) < 1e-9
print("ALL CHECKS PASSED")
```
{% endraw %}
