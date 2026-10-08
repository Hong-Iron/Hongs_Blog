---
layout: "note"
title: "40_fourier-transform-properties_verify.py"
display_title: "40_fourier-transform-properties_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "수학"
parent_url: "/studies/signals-and-systems/fourier-transform-properties/"
parent_title: "푸리에 변환의 성질"
description: "신호 및 시스템 · 푸리에 변환의 성질 검증 코드"
permalink: "/studies/signals-and-systems/code/40_fourier-transform-properties_verify/"
---
{% raw %}
[푸리에 변환의 성질](/Hongs_Blog/studies/signals-and-systems/fourier-transform-properties/) 문서의 검증 코드다.

```python
"""푸리에 변환의 성질 문서: 표 4.1의 성질과 예제 4.9~4.12, 4.14를 수치 적분으로 확인한다."""
import cmath, math

def ft(x, w, lo=-25, hi=25, n=50000):
    d = (hi - lo) / n
    return sum(x(lo + (i + 0.5) * d) * cmath.exp(-1j * w * (lo + (i + 0.5) * d)) for i in range(n)) * d
close = lambda u, v, e=2e-4: abs(u - v) < e
g = lambda t: math.exp(-t * t) * (1 + 0.5 * t)          # 매끄럽고 빨리 줄어드는 시험 신호
G = lambda w: ft(g, w)
for w in (-1.3, 0.0, 0.8, 2.0):
    assert close(ft(lambda t: g(t - 1.5), w), cmath.exp(-1j * w * 1.5) * G(w))                    # 시간 이동
    assert close(abs(ft(lambda t: g(t - 1.5), w)), abs(G(w)))                                      # 크기는 그대로
    assert close(ft(lambda t: cmath.exp(2j * t) * g(t), w), G(w - 2))                              # 주파수 이동
    assert close(ft(lambda t: g(-t), w), G(-w))                                                    # 시간 반전
    assert close(G(-w), G(w).conjugate())                                                          # 실수 신호의 켤레 대칭
    for a in (2.0, 0.5, -3.0):
        assert close(ft(lambda t: g(a * t), w), G(w / a) / abs(a))                                 # 척도
    dg = lambda t: math.exp(-t * t) * (0.5 - 2 * t * (1 + 0.5 * t))
    assert close(ft(dg, w), 1j * w * G(w))                                                         # 미분
    tg = lambda t: t * g(t)
    h = 1e-4
    assert close(ft(tg, w), 1j * (G(w + h) - G(w - h)) / (2 * h), 5e-4)                            # 주파수 미분 t x(t) <-> j dX/dω
# 실수·짝 -> 실수·짝, 실수·홀 -> 순허수·홀
ev = lambda t: math.exp(-t * t); od = lambda t: t * math.exp(-t * t)
for w in (0.4, 1.7):
    E, O = ft(ev, w), ft(od, w)
    assert abs(E.imag) < 1e-9 and close(E, ft(ev, -w)) and abs(O.real) < 1e-9 and close(O, -ft(od, -w))
# 짝·홀 분해: Ev{e^{-at}u(t)} <-> Re{1/(a+jω)}, e^{-a|t|} = 2Ev{...} -> 2a/(a²+ω²) (예제 4.10)
a = 1.2
for w in (0.0, 0.9):
    assert close(2 * (1 / (a + 1j * w)).real, 2 * a / (a * a + w * w), 1e-12)
# 파스발: ∫|x|² = (1/2π)∫|X|²   (x = e^{-at}u(t): 1/(2a))
lhs = 1 / (2 * a)
L, n = 2000.0, 400000; d = 2 * L / n
rhs = sum(1 / (a * a + (-L + (i + 0.5) * d) ** 2) for i in range(n)) * d / (2 * math.pi)
assert abs(lhs - rhs) < 1e-3
# 예제 4.9: X = e^{-j5ω/2}[sin(ω/2) + 2 sin(3ω/2)]/ω
x49 = lambda t: (0.5 if 2 <= t <= 3 else 0.0) + (1.0 if 1 <= t <= 4 else 0.0)
for w in (0.3, 1.1, 2.6):
    assert close(ft(x49, w, 0, 5, 50000), cmath.exp(-2.5j * w) * (math.sin(w / 2) + 2 * math.sin(1.5 * w)) / w)
# 예제 4.11: u(t) <-> 1/(jω) + πδ(ω), jω·(1/(jω)) = 1 (ω ≠ 0)
# 예제 4.12: X = 2 sin ω/(jω²) - 2cos ω/(jω), x(t) = t (|t| < 1)
for w in (0.5, 1.4, 3.0):
    assert close(ft(lambda t: t, w, -1, 1, 40000), 2 * math.sin(w) / (1j * w * w) - 2 * math.cos(w) / (1j * w))
assert close(2 * 1 - 1 - 1, 0, 1e-12)                          # G(0) = 2 - 1 - 1 = 0
# 예제 4.14: E = 5/8 (a), 1 (b); D = 0 (a), -1/(2√π) (b)
sp = math.sqrt(math.pi)
Ea = (sp ** 2 * 0.5 + (sp / 2) ** 2 * 1.0 + sp ** 2 * 0.5) / (2 * math.pi)
Eb = (sp ** 2 * 1 + sp ** 2 * 1) / (2 * math.pi)
assert close(Ea, 5 / 8, 1e-12) and close(Eb, 1, 1e-12)
def D(X, n=200000):
    dd = 2.0 / n
    return sum(1j * (-1 + (i + 0.5) * dd) * X(-1 + (i + 0.5) * dd) for i in range(n)) * dd / (2 * math.pi)
Xa = lambda w: sp / 2 if abs(w) < 0.5 else sp
Xb = lambda w: -1j * sp if w < 0 else 1j * sp
assert close(D(Xa), 0, 1e-6) and close(D(Xb), -1 / (2 * sp), 1e-6)
print("ALL CHECKS PASSED")
```
{% endraw %}
