---
layout: "note"
title: "12_ftc_verify.py"
display_title: "12_ftc_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/ftc/"
parent_title: "미적분의 기본정리"
description: "미분적분학 · 미적분의 기본정리 검증 코드"
permalink: "/studies/calculus/code/12_ftc_verify/"
---
{% raw %}
[미적분의 기본정리](/Hongs_Blog/studies/calculus/ftc/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""미적분의 기본정리 검증.

문서: 12.미적분의 기본정리 (예시, 정리, 증명, 가정, 예제, 오해, 카드 C1~C4)
주장 1: 누적합 예시 — a = [3, 1, 4, 1, 5], S = [0, 3, 4, 8, 9, 14], S[3] - S[2] = 4, S[4] - S[1] = 6.
        무작위 배열 200개에서 모든 구간 합 = S[r] - S[l-1] (카드 C4).
주장 2: 2부 — 여러 함수에서 수치 적분(심프슨) = G(b) - G(a). ∫_0^3 t² = 9.
주장 3: 1부 — F(x) = ∫_a^x f의 수치 미분이 f(x)와 같다.
주장 4: 예제·카드 C2 — d/dx ∫_1^{x²} sin t / t dt = 2 sin(x²)/x, d/dx ∫_0^{x³} e^{-t²} dt = 3x² e^{-x⁶} (수치 적분 후 수치 미분).
주장 5: 가정 — 계단 함수의 누적 F(x) = max(x, 0)은 0에서 좌우 기울기가 0과 1로 다르다.
주장 6: 오해·카드 C3 — ∫_ε^1 1/x² = 1/ε - 1이 ε -> 0에서 한없이 커진다. [-1/x]_{-1}^{1} = -2는 음수.
"""
import math
import random


def simpson(f, a, b, n=2000):
    if a == b:
        return 0.0
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    a = [3, 1, 4, 1, 5]
    S = [0]
    for v in a:
        S.append(S[-1] + v)
    assert S == [0, 3, 4, 8, 9, 14] and S[3] - S[2] == 4 and S[4] - S[1] == 6 == sum(a[1:4])
    rng = random.Random(12)
    for _ in range(200):
        arr = [rng.randint(-9, 9) for _ in range(rng.randint(1, 15))]
        P = [0]
        for v in arr:
            P.append(P[-1] + v)
        for l in range(1, len(arr) + 1):
            for r in range(l, len(arr) + 1):
                assert sum(arr[l - 1:r]) == P[r] - P[l - 1]
    print("[OK] 주장 1·카드 C4: 누적합")

    pairs = [
        (lambda t: t * t, lambda t: t ** 3 / 3, 0, 3),
        (math.exp, math.exp, -1, 2),
        (math.sin, lambda t: -math.cos(t), 0, math.pi),
        (lambda t: 1 / t, math.log, 1, math.e),
        (lambda t: 3 * t ** 2 - 2 * t + 1, lambda t: t ** 3 - t ** 2 + t, -2, 1.5),
    ]
    for f, G, lo, hi in pairs:
        assert abs(simpson(f, lo, hi) - (G(hi) - G(lo))) < 1e-9
    assert abs(simpson(lambda t: t * t, 0, 3) - 9) < 1e-12
    print("[OK] 주장 2: 수치 적분 = 원시함수의 차, ∫_0^3 t² = 9")

    for f in (math.cos, lambda t: math.exp(-t * t), lambda t: t ** 3):
        F = lambda x, f=f: simpson(f, 0.0, x)
        for x in (0.3, 1.0, 1.7):
            h = 1e-4
            assert abs((F(x + h) - F(x - h)) / (2 * h) - f(x)) < 1e-6
    print("[OK] 주장 3: 누적 함수의 도함수 = f")

    sinc = lambda t: math.sin(t) / t
    H = lambda x: simpson(sinc, 1.0, x * x)
    E = lambda x: simpson(lambda t: math.exp(-t * t), 0.0, x ** 3)
    for x in (0.8, 1.3, 2.0):
        h = 1e-4
        assert abs((H(x + h) - H(x - h)) / (2 * h) - 2 * math.sin(x * x) / x) < 1e-5
        assert abs((E(x + h) - E(x - h)) / (2 * h) - 3 * x * x * math.exp(-x ** 6)) < 1e-5
    print("[OK] 주장 4·예제·카드 C2")

    step = lambda t: 0.0 if t < 0 else 1.0
    F = lambda x: sum(step(-1 + (i + 0.5) * (x + 1) / 4000) for i in range(4000)) * (x + 1) / 4000
    for x in (-0.5, 0.0, 0.5):
        assert abs(F(x) - max(x, 0)) < 1e-3
    h = 1e-2
    left, right = (F(0) - F(-h)) / h, (F(h) - F(0)) / h
    assert abs(left) < 0.1 and abs(right - 1) < 0.1
    print("[OK] 주장 5: 계단 함수의 누적은 0에서 꺾인다")

    vals = [simpson(lambda x: 1 / x ** 2, eps, 1.0, 20000) for eps in (1e-1, 1e-2, 1e-3)]
    assert all(abs(v - (1 / e - 1)) < 1e-3 * (1 / e) for v, e in zip(vals, (1e-1, 1e-2, 1e-3)))
    assert (-1 / 1) - (-1 / -1) == -2
    print("[OK] 주장 6·오해·카드 C3: 0 근처에서 발산, 잘못된 계산은 -2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
