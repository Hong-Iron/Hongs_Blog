---
layout: "note"
title: "31_fourier-transform_verify.py"
display_title: "31_fourier-transform_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/fourier-transform/"
parent_title: "푸리에 변환과 합성곱"
description: "미분적분학 · 푸리에 변환과 합성곱 검증 코드"
permalink: "/studies/calculus/code/31_fourier-transform_verify/"
---
{% raw %}
[푸리에 변환과 합성곱](/Hongs_Blog/studies/calculus/fourier-transform/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""푸리에 변환과 합성곱 검증.

문서: 31.푸리에 변환과 합성곱 (예시, 정의, 정리, 증명, 예제, 활용, 카드 C1~C3)
규약: f̂(ξ) = ∫ f(x) e^{-2πixξ} dx.
주장 1: 예시·카드 C1 — 폭 1 상자함수의 변환 = sin(πξ)/(πξ): ξ = 0에서 1, 1/2에서 2/π, 정수에서 0.
        폭 2 상자함수는 첫 0점이 ξ = 1/2로 당겨진다(늘이기-줄이기).
주장 2: 정의 — e^{-πx²}의 변환은 자기 자신, 역변환으로 원래 함수가 돌아온다(수치).
주장 3: 정리 — 합성곱 정리: 가우스 * 가우스, 상자 * 상자(= 삼각형, 변환 sinc²)에서 (f*g)^ = f̂ ĝ(수치).
주장 4: 정리 — 이동 f(x - a) ↦ e^{-2πiaξ} f̂, 변조 f(x) cos(2πξ0 x) ↦ (f̂(ξ - ξ0) + f̂(ξ + ξ0))/2.
주장 5: 예제·카드 C3 — 0~4 kHz 신호에 100 kHz 코사인을 곱하면 스펙트럼이 96~104 kHz로 옮겨진다(DFT 빈으로 확인),
        반송파 간격이 8 kHz면 경계에서만 맞닿고, 그보다 넓으면 떨어지며, 5 kHz면 겹친다.
주장 6: 활용 — 이산 순환 합성곱 = DFT의 곱의 역변환(무작위 수열), 불확정성 Δx·Δξ >= 1/(4π)(가우스는 등호).
"""
import cmath
import math
import random

L, N = 12.0, 12000
XS = [-L + (i + 0.5) * 2 * L / N for i in range(N)]
DX = 2 * L / N


def ft(f, xi, xs=XS, dx=DX):
    return sum(f(x) * cmath.exp(-2j * math.pi * x * xi) for x in xs) * dx


def box(w):
    return lambda x: 1.0 if abs(x) < w / 2 else 0.0


def sinc_w(w, xi):
    return w if xi == 0 else math.sin(math.pi * w * xi) / (math.pi * xi)


def dft(a):
    n = len(a)
    return [sum(a[j] * cmath.exp(-2j * math.pi * j * k / n) for j in range(n)) for k in range(n)]


def idft(A):
    n = len(A)
    return [sum(A[k] * cmath.exp(2j * math.pi * j * k / n) for k in range(n)) / n for j in range(n)]


def main():
    for xi in (0.0, 0.25, 0.5, 1.0, 1.5, 2.0, 3.3):
        assert abs(ft(box(1), xi) - sinc_w(1, xi)) < 2e-3
        assert abs(ft(box(2), xi) - sinc_w(2, xi)) < 2e-3
    assert abs(sinc_w(1, 0.5) - 2 / math.pi) < 1e-15
    assert all(abs(sinc_w(1, k)) < 1e-15 for k in (1, 2, 3))
    assert abs(sinc_w(2, 0.5)) < 1e-15 and sinc_w(1, 0.5) > 0.6
    print("[OK] 주장 1·카드 C1: 상자함수 ↔ sinc")

    g = lambda x: math.exp(-math.pi * x * x)
    for xi in (0.0, 0.3, 0.7, 1.2):
        assert abs(ft(g, xi) - g(xi)) < 1e-9
    xis = [-6 + (i + 0.5) * 12 / 3000 for i in range(3000)]
    for x in (0.0, 0.4, 1.1):
        back = sum(g(t) * cmath.exp(2j * math.pi * x * t) for t in xis) * 12 / 3000
        assert abs(back - g(x)) < 1e-9
    print("[OK] 주장 2: 가우스 자기 변환, 역변환")

    def conv(f1, f2, x, xs=XS, dx=DX):
        return sum(f1(y) * f2(x - y) for y in xs) * dx
    gg = lambda x: math.exp(-math.pi * x * x / 2) / math.sqrt(2)
    for x in (0.0, 0.5, 1.3):
        assert abs(conv(g, g, x) - gg(x)) < 1e-9
    for xi in (0.0, 0.2, 0.6):
        assert abs(ft(gg, xi) - ft(g, xi) ** 2) < 1e-9
    tri = lambda x: max(0.0, 1 - abs(x))
    for x in (0.0, 0.3, 0.8, 1.2):
        assert abs(conv(box(1), box(1), x) - tri(x)) < 2e-3
    for xi in (0.1, 0.5, 1.5, 2.5):
        assert abs(ft(tri, xi) - sinc_w(1, xi) ** 2) < 1e-4
    print("[OK] 주장 3: 합성곱 정리")

    for a in (0.7, -1.9):
        for xi in (0.2, 0.9):
            assert abs(ft(lambda x: g(x - a), xi) - cmath.exp(-2j * math.pi * a * xi) * g(xi)) < 1e-8
    xi0 = 3.0
    for xi in (-3.2, 0.0, 2.5, 3.0, 3.4):
        lhs = ft(lambda x: g(x) * math.cos(2 * math.pi * xi0 * x), xi)
        assert abs(lhs - (g(xi - xi0) + g(xi + xi0)) / 2) < 1e-8
    print("[OK] 주장 4: 이동·변조")

    n = 512   # 1빈 = 1 kHz로 본다
    rng = random.Random(31)
    amp = [(rng.uniform(0.2, 1), rng.uniform(0, 2 * math.pi)) for _ in range(5)]   # 0~4 kHz
    sig = [sum(A * math.cos(2 * math.pi * k * t / n + ph) for k, (A, ph) in enumerate(amp)) for t in range(n)]

    def band(carrier):
        mod = [s * math.cos(2 * math.pi * carrier * t / n) for t, s in enumerate(sig)]
        S = dft(mod)
        return {k for k in range(n // 2) if abs(S[k]) > 1e-6}
    b100 = band(100)
    assert b100 <= set(range(96, 105)) and {96, 104} <= b100
    assert band(100) & band(108) == {104}          # 간격 8 kHz: 경계 104 kHz에서만 맞닿는다
    assert not (band(100) & band(109))             # 8 kHz보다 넓으면 겹치지 않는다
    assert band(100) & band(105) == set(range(101, 105))   # 5 kHz면 101~104 kHz가 겹친다
    print(f"[OK] 주장 5·카드 C3: 100 kHz 반송파 → {min(b100)}~{max(b100)} kHz")

    for _ in range(20):
        m = rng.randint(4, 16)
        a = [rng.uniform(-1, 1) for _ in range(m)]
        b = [rng.uniform(-1, 1) for _ in range(m)]
        direct = [sum(a[j] * b[(k - j) % m] for j in range(m)) for k in range(m)]
        via = idft([p * q for p, q in zip(dft(a), dft(b))])
        assert all(abs(u - v) < 1e-9 for u, v in zip(direct, via))

    def spreads(f, xs_f=XS, dx_f=DX):
        w = [abs(f(x)) ** 2 for x in xs_f]
        tot = sum(w)
        mx = sum(x * p for x, p in zip(xs_f, w)) / tot
        vx = sum((x - mx) ** 2 * p for x, p in zip(xs_f, w)) / tot
        grid = [-8 + (i + 0.5) * 16 / 800 for i in range(800)]
        xs2 = XS[::6]
        F = [abs(ft(f, t, xs2, DX * 6)) ** 2 for t in grid]
        tf = sum(F)
        mf = sum(t * p for t, p in zip(grid, F)) / tf
        vf = sum((t - mf) ** 2 * p for t, p in zip(grid, F)) / tf
        return math.sqrt(vx), math.sqrt(vf)
    for s in (0.5, 1.0, 2.0):
        dx_, dxi = spreads(lambda x, s=s: math.exp(-x * x / (2 * s * s)))
        assert abs(dx_ * dxi - 1 / (4 * math.pi)) < 1e-3
    for f in (tri, lambda x: math.exp(-abs(x)) if abs(x) < 12 else 0.0):
        dx_, dxi = spreads(f)
        assert dx_ * dxi > 1 / (4 * math.pi)
    print("[OK] 주장 6: 이산 합성곱, 불확정성")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
