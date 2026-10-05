---
layout: "note"
title: "15_improper-integrals_verify.py"
display_title: "15_improper-integrals_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/improper-integrals/"
parent_title: "이상적분"
description: "미분적분학 · 이상적분 검증 코드"
permalink: "/studies/calculus/code/15_improper-integrals_verify/"
---
{% raw %}
[이상적분](/Hongs_Blog/studies/calculus/improper-integrals/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이상적분 검증.

문서: 15.이상적분 (예시, 정의, p-적분, 비교 판정, 예제, 활용, 오해, 카드 C1~C3)
주장 1: 예시 표 — ∫_1^t dx/x² = 1 - 1/t, ∫_1^t dx/x = ln t (t = 10, 1000, 10^6).
주장 2: p-적분 — ∫_1^∞ x^{-p} = 1/(p-1) (p = 1.01, 2, 3), ∫_0^1 x^{-p} = 1/(1-p) (p = 0.5).
        p = 1은 ln t가 한없이 커진다.
주장 3: 예제 — x >= 1에서 e^{-x²} <= e^{-x}, ∫_1^∞ e^{-x} = 1/e, ∫_0^∞ e^{-x²} = √π/2.
주장 4: 카드 C1 — ∫_0^t x e^{-x} = 1 - t e^{-t} - e^{-t} -> 1.
주장 5: 오해·카드 C3 — ∫_{-t}^{t} x = 0, ∫_{-t}^{2t} x = 3t²/2.
주장 6: 활용 — 지수분포 넓이 1, 파레토 꼬리 x^{-p}의 평균은 p > 2에서만 유한(p = 2.5, 3에서 값, p = 2에서 ln 발산).
"""
import math


def simpson(f, a, b, n=20000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    for t, v1, v2 in ((10, 0.9, 2.30), (1000, 0.999, 6.91), (10 ** 6, 0.999999, 13.8)):
        assert abs((1 - 1 / t) - v1) < 1e-12 and abs(math.log(t) - v2) < 0.05
    # 적분 자체도 수치로(로그 눈금으로 치환한 적분 x = e^s)
    assert abs(simpson(lambda s: math.exp(-s), 0, math.log(1000)) - 0.999) < 1e-9
    print("[OK] 주장 1: 예시 표")

    for p in (1.01, 2, 3):
        F = lambda t, p=p: (t ** (1 - p) - 1) / (1 - p)
        assert abs(F(10.0 ** 290) - 1 / (p - 1)) < 1e-2 * (1 / (p - 1))  # 극한값에 다가감
        # 로그 치환으로 [1, T] 수치 적분: ∫ x^{-p} dx = ∫ e^{(1-p)s} ds
        T = 60 if p > 1.5 else 3000
        v = simpson(lambda s, p=p: math.exp((1 - p) * s), 0, T, 200000)
        assert abs(v - (1 - math.exp((1 - p) * T)) / (p - 1)) < 1e-8 * max(1, 1 / (p - 1))
    n = 10 ** 6
    mid = sum(((i + 0.5) / n) ** -0.5 for i in range(n)) / n
    assert abs(mid - 2) < 2e-3
    assert math.log(1e100) > 230
    print("[OK] 주장 2·카드 C2: p-적분")

    assert all(math.exp(-x * x) <= math.exp(-x) for x in [1 + i / 100 for i in range(1000)])
    assert abs(simpson(lambda x: math.exp(-x), 1, 60) - 1 / math.e) < 1e-10
    assert abs(simpson(lambda x: math.exp(-x * x), 0, 10) - math.sqrt(math.pi) / 2) < 1e-12
    print("[OK] 주장 3: 가우스 꼬리와 √π/2")

    for t in (5.0, 20.0, 40.0):
        assert abs(simpson(lambda x: x * math.exp(-x), 0, t) - (1 - t * math.exp(-t) - math.exp(-t))) < 1e-9
    assert 40 * math.exp(-40) < 1e-15
    print("[OK] 주장 4·카드 C1: 1로 수렴")

    for t in (1.0, 10.0, 100.0):
        assert abs(simpson(lambda x: x, -t, t)) < 1e-9
        assert abs(simpson(lambda x: x, -t, 2 * t) - 1.5 * t * t) < 1e-6 * t * t
    print("[OK] 주장 5·오해·카드 C3: 자르는 방식에 따라 0과 무한대")

    lam = 2.5
    assert abs(simpson(lambda x: lam * math.exp(-lam * x), 0, 40) - 1) < 1e-10
    for p, mean in ((2.5, 1 / 0.5), (3, 1 / 1)):
        # 꼬리 x^{-p}(x >= 1)에서 ∫_1^∞ x · x^{-p} dx = 1/(p - 2)
        v = simpson(lambda s, p=p: math.exp((2 - p) * s), 0, 200, 200000)
        assert abs(v - mean) < 1e-6
    assert abs(simpson(lambda s: 1.0, 0, math.log(1e6)) - math.log(1e6)) < 1e-9  # p = 2이면 ln T
    print("[OK] 주장 6: 지수분포, 파레토 꼬리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
