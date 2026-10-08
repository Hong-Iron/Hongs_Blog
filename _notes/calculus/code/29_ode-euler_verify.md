---
layout: "note"
title: "29_ode-euler_verify.py"
display_title: "29_ode-euler_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "29"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/ode-euler/"
parent_title: "미분방정식과 오일러 방법"
description: "미분적분학 · 미분방정식과 오일러 방법 검증 코드"
permalink: "/studies/calculus/code/29_ode-euler_verify/"
---
{% raw %}
[미분방정식과 오일러 방법](/Hongs_Blog/studies/calculus/ode-euler/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""미분방정식과 오일러 방법 검증.

문서: 29.미분방정식과 오일러 방법 (예시, 정의, 정리, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — y' = y, y(0) = 1을 t = 1까지: h = 0.5, 0.1, 0.01에서 2.25, 2.5937…, 2.7048…, 오차는 h에 거의 비례.
        h = 1/n의 오일러 값이 정확히 (1 + 1/n)^n.
주장 2: 정의 — y = y0 e^{kt}가 y' = ky를 만족(수치 미분), 다른 해 z에 대해 z e^{-kt}가 상수(수치 확인).
주장 3: 정리 — 전역 오차 O(h): y' = -y + sin t에서 h를 반으로 줄이면 오차가 약 절반. 한 걸음 오차는 O(h²).
주장 4: 예제 — y' = -10y: h = 0.05(0.5배씩), 0.15(-0.5배씩), 0.25(-1.5배씩 발산). 안정 조건 h < 2/λ = 0.2.
주장 5: 활용 — 용수철 x'' = -x: 명시적 오일러는 에너지가 매 걸음 (1 + h²)배(1000걸음, h = 0.1에서 약 2만 배),
        반암시적 오일러는 에너지가 처음 값의 ±6% 안에 머문다. RK4는 h를 반으로 줄이면 오차가 약 16분의 1.
주장 6: 카드 — C1 y' = -2y, h = 0.25 두 걸음 → 0.5, 0.25(참값 e^{-1} ≈ 0.368), C2 인수 1 - hλ,
        C3 경사 하강법 = 기울기 흐름 x' = -∇f의 오일러 방법(한 걸음이 같다).
"""
import math
import random


def euler(f, t0, y0, h, n):
    t, y = t0, y0
    for _ in range(n):
        y = y + h * f(t, y)
        t += h
    return y


def rk4(f, t0, y0, h, n):
    t, y = t0, y0
    for _ in range(n):
        k1 = f(t, y)
        k2 = f(t + h / 2, y + h / 2 * k1)
        k3 = f(t + h / 2, y + h / 2 * k2)
        k4 = f(t + h, y + h * k3)
        y += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
        t += h
    return y


def main():
    rng = random.Random(29)
    vals = {h: euler(lambda t, y: y, 0, 1.0, h, round(1 / h)) for h in (0.5, 0.1, 0.01)}
    assert abs(vals[0.5] - 2.25) < 1e-12 and abs(vals[0.1] - 2.5937) < 1e-4 and abs(vals[0.01] - 2.7048) < 1e-4
    errs = {h: math.e - v for h, v in vals.items()}
    assert abs(errs[0.5] - 0.468) < 1e-3 and abs(errs[0.1] - 0.1246) < 1e-3 and abs(errs[0.01] - 0.0135) < 1e-3
    assert 8 < errs[0.1] / errs[0.01] < 10
    for n in (1, 5, 50, 1000):
        assert abs(euler(lambda t, y: y, 0, 1.0, 1 / n, n) - (1 + 1 / n) ** n) < 1e-9
    print("[OK] 주장 1: y' = y의 오일러 값", {h: round(v, 4) for h, v in vals.items()})

    for _ in range(50):
        k, y0 = rng.uniform(-2, 2), rng.uniform(-3, 3)
        y = lambda t: y0 * math.exp(k * t)
        for t in (0.0, 0.7, 1.5):
            d = (y(t + 1e-6) - y(t - 1e-6)) / 2e-6
            assert abs(d - k * y(t)) < 1e-6 * (1 + abs(y(t)))
        z_end = rk4(lambda t, z: k * z, 0, y0, 1e-3, 1500)
        assert abs(z_end * math.exp(-k * 1.5) - y0) < 1e-9 * (1 + abs(y0))
    print("[OK] 주장 2: 지수함수 해")

    f = lambda t, y: -y + math.sin(t)
    exact = lambda t: 0.5 * (math.sin(t) - math.cos(t)) + 1.5 * math.exp(-t)   # y(0) = 1
    ge = [abs(euler(f, 0, 1.0, 2 / n, n) - exact(2)) for n in (100, 200, 400, 800)]
    for a, b in zip(ge, ge[1:]):
        assert 1.8 < a / b < 2.2
    le = [abs(euler(f, 0, 1.0, h, 1) - exact(h)) for h in (0.1, 0.05, 0.025)]
    for a, b in zip(le, le[1:]):
        assert 3.5 < a / b < 4.5
    print("[OK] 주장 3: 전역 오차 O(h), 한 걸음 오차 O(h²)")

    for h, fac in ((0.05, 0.5), (0.15, -0.5), (0.25, -1.5)):
        y1 = euler(lambda t, y: -10 * y, 0, 1.0, h, 1)
        assert abs(y1 - fac) < 1e-12
    assert abs(euler(lambda t, y: -10 * y, 0, 1.0, 0.25, 40)) > 1e6
    assert abs(euler(lambda t, y: -10 * y, 0, 1.0, 0.15, 40)) < 1e-10
    for h in (0.1, 0.19, 0.21, 0.3):
        assert (abs(1 - 10 * h) < 1) == (h < 0.2)
    print("[OK] 주장 4: 안정 조건 h < 2/λ")

    h, n = 0.1, 1000
    x, v = 1.0, 0.0
    for _ in range(n):
        x, v = x + h * v, v - h * x
    e_exp = (x * x + v * v) / 1
    assert abs(e_exp / (1.01 ** n) - 1) < 1e-9 and 20000 < e_exp < 21000
    x, v = 1.0, 0.0
    lo = hi = 1.0
    for _ in range(n):
        v = v - h * x
        x = x + h * v
        e = x * x + v * v
        lo, hi = min(lo, e), max(hi, e)
    assert 0.94 < lo and hi < 1.06
    r = [abs(rk4(lambda t, y: y, 0, 1.0, 1 / n, n) - math.e) for n in (10, 20, 40)]
    for a, b in zip(r, r[1:]):
        assert 14 < a / b < 18
    print(f"[OK] 주장 5: 명시적 오일러 에너지 {e_exp:.0f}배, 반암시적 [{lo:.3f}, {hi:.3f}], RK4 16분의 1")

    y = 1.0
    ys = []
    for _ in range(2):
        y = y + 0.25 * (-2 * y)
        ys.append(y)
    assert ys == [0.5, 0.25] and abs(math.exp(-1) - 0.3679) < 1e-4
    for lam in (1.0, 10.0):
        for hh in (0.5 / lam, 1.9 / lam, 2.1 / lam):
            assert abs(euler(lambda t, yy: -lam * yy, 0, 1.0, hh, 1) - (1 - hh * lam)) < 1e-12
    grad = lambda p: [2 * p[0], 20 * p[1]]
    for _ in range(20):
        p = [rng.uniform(-2, 2), rng.uniform(-2, 2)]
        eta = rng.uniform(0.01, 0.09)
        gd_next = [a - eta * b for a, b in zip(p, grad(p))]
        euler_next = [a + eta * b for a, b in zip(p, [-g for g in grad(p)])]
        assert gd_next == euler_next
    print("[OK] 주장 6: 카드 C1·C2·C3")
    # 수치해석(2-2) 과목별 관점: 던진 공 y' = v0 − g t, 카드
    v0, gg, hh = 10.0, 9.8, 0.5
    ys = [0.0]; ts = [0.0]
    for _ in range(2):
        ys.append(ys[-1] + hh * (v0 - gg * ts[-1])); ts.append(ts[-1] + hh)
    assert ys == [0.0, 5.0, 7.55] and abs((v0 * 1 - gg / 2) - 5.1) < 1e-12
    assert all(y >= v0 * t - gg / 2 * t * t for y, t in zip(ys, ts))          # 오일러 점이 참 곡선보다 위
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
