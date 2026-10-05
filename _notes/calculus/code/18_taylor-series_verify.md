---
layout: "note"
title: "18_taylor-series_verify.py"
display_title: "18_taylor-series_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/taylor-series/"
parent_title: "테일러 급수"
description: "미분적분학 · 테일러 급수 검증 코드"
permalink: "/studies/calculus/code/18_taylor-series_verify/"
---
{% raw %}
[테일러 급수](/Hongs_Blog/studies/calculus/taylor-series/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""테일러 급수 검증.

문서: 18.테일러 급수 (예시, 정의, 정리, 증명, 가정, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 표 — Σ_{k<=n} 1/k! (n = 1, 2, 3, 5, 10)과 오차 |e - T_n(1)| <= 3/(n+1)!.
주장 2: 카드 C2 — T_3(0.5) = 1.64583..., 실제 오차 0.00289 <= 1.65·0.5⁴/24 ≈ 0.0043.
주장 3: 표의 다섯 급수가 범위 안의 여러 x에서 함수값으로 모인다(부분합 비교). 나머지 한계가 무작위 x, n에서 성립.
주장 4: 오해 — ln(1+x)의 급수에 x = 2: 부분합 2, 0, 2.67, -1.33, 5.07, -5.6, ...이 커지며 흔들린다.
        ln 3 = ln 4 - ln(4/3)으로 반지름 안에서 계산된다.
주장 5: 카드 C3 — e^{-1/x²}/x^n -> 0 (x -> 0, n <= 10). 차분몫으로 본 도함수들이 0 근처에서 0.
주장 6: 가정 — |x|^{3/2}의 1차 근사 오차 / x² 이 x -> 0에서 한없이 커진다.
주장 7: 예제 — 복소수 부분합 Σ (iθ)^k/k! = cos θ + i sin θ (θ = 0.5, 2, π, 10).
주장 8: 증명 뒤 활용 — 앞방향 차분 오차는 h에 비례, 중앙 차분 오차는 h²에 비례(실험). C4의 등비급수 1/(1+x²).
주장 9: 증명 2~3단계의 적분 나머지 공식 R_n(x) = ∫ f^{(n+1)}(t)(x-t)^n/n! dt가 수치로 맞는다(e^x, sin, n = 0..5).
"""
import cmath
import math
import random


def simpson(f, a, b, n=4000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    exp_table = {1: 2.0, 2: 2.5, 3: 2.6667, 5: 2.71667, 10: 2.7182818011}
    for n, v in exp_table.items():
        T = sum(1 / math.factorial(k) for k in range(n + 1))
        digits = len(str(v).split(".")[1]) if "." in str(v) else 0
        assert abs(T - v) < 0.5 * 10 ** -digits + 1e-15
        assert abs(math.e - T) <= 3 / math.factorial(n + 1)
    assert abs(3 / math.factorial(11) - 7.5e-8) < 1e-9
    print("[OK] 주장 1: 예시 표")

    T3 = 1 + 0.5 + 0.125 + 0.5 ** 3 / 6
    err = math.exp(0.5) - T3
    bound = 1.65 * 0.5 ** 4 / 24
    assert f"{T3:.5f}" == "1.64583" and f"{err:.5f}" == "0.00289" and err <= bound and f"{bound:.4f}" == "0.0043"
    assert math.exp(0.5) < 1.65
    print("[OK] 주장 2·카드 C2")

    series = [
        (math.exp, lambda x, k: x ** k / math.factorial(k), [-3, -0.5, 0.7, 4], 80),
        (math.sin, lambda x, k: (-1) ** k * x ** (2 * k + 1) / math.factorial(2 * k + 1), [-3, 0.2, 1.5, 6], 40),
        (math.cos, lambda x, k: (-1) ** k * x ** (2 * k) / math.factorial(2 * k), [-3, 0.2, 1.5, 6], 40),
        (lambda x: 1 / (1 - x), lambda x, k: x ** k, [-0.9, -0.3, 0.5, 0.9], 400),
        (lambda x: math.log(1 + x), lambda x, k: (-1) ** k * x ** (k + 1) / (k + 1), [-0.5, 0.3, 0.9], 400),
    ]
    for f, term, xs, K in series:
        for x in xs:
            s = sum(term(float(x), k) for k in range(K))
            assert abs(s - f(x)) < 1e-9, (x, s, f(x))
    rng = random.Random(18)
    for _ in range(300):
        x, n = rng.uniform(-3, 3), rng.randint(0, 12)
        Tn = sum(x ** k / math.factorial(k) for k in range(n + 1))
        M = math.exp(max(0.0, x))
        assert abs(math.exp(x) - Tn) <= M * abs(x) ** (n + 1) / math.factorial(n + 1) + 1e-15
    s_ln1 = sum((-1) ** (k + 1) / k for k in range(1, 200001))
    assert abs(s_ln1 - math.log(2)) < 1e-5
    print("[OK] 주장 3·카드 C1: 표의 급수와 나머지 한계")

    parts, s = [], 0.0
    for k in range(1, 9):
        s += (-1) ** (k + 1) * 2 ** k / k
        parts.append(s)
    assert [round(p, 2) for p in parts[:6]] == [2.0, 0.0, 2.67, -1.33, 5.07, -5.6]
    assert abs(parts[-1]) > abs(parts[-3]) > abs(parts[-5])
    y = 1 / 3  # 4/3 = 1 + 1/3
    ln43 = sum((-1) ** (k + 1) * y ** k / k for k in range(1, 60))
    assert abs((2 * math.log(2) - ln43) - math.log(3)) < 1e-15
    print("[OK] 주장 4·오해: x = 2에서 발산, ln 3은 식을 바꿔 계산")

    g = lambda x: math.exp(-1 / (x * x)) if x != 0 else 0.0
    for n in range(0, 11):
        assert g(0.05) / 0.05 ** n < 1e-150
    for h in (1e-1, 5e-2):
        assert abs((g(h) - g(-h)) / (2 * h)) < 1e-40 and g(h) / h < 1e-40
    assert g(1.0) > 0.36
    print("[OK] 주장 5·카드 C3: e^{-1/x²}")

    for x in (1e-2, 1e-4, 1e-6):
        assert abs(x) ** 1.5 / x ** 2 >= 1 / math.sqrt(x) * 0.999
    assert (1e-6) ** 1.5 / (1e-6) ** 2 > 999
    print("[OK] 주장 6: |x|^{3/2}의 오차는 x²보다 느리게 준다")

    for th in (0.5, 2.0, math.pi, 10.0):
        s, term = 0j, 1 + 0j
        for k in range(120):
            s += term
            term *= 1j * th / (k + 1)
        assert abs(s - complex(math.cos(th), math.sin(th))) < 1e-12
    assert abs(cmath.exp(1j * math.pi) + 1) < 1e-15
    print("[OK] 주장 7: 오일러 공식")

    f, x = math.sin, 1.0
    fw = [abs((f(x + h) - f(x)) / h - math.cos(x)) for h in (1e-2, 1e-3)]
    ce = [abs((f(x + h) - f(x - h)) / (2 * h) - math.cos(x)) for h in (1e-2, 1e-3)]
    assert 8 < fw[0] / fw[1] < 12 and 80 < ce[0] / ce[1] < 120
    for x in (-0.9, 0.5):
        assert abs(sum((-x * x) ** k for k in range(2000)) - 1 / (1 + x * x)) < 1e-12
    assert abs(sum((-1.0) ** k for k in range(11))) == 1 and sum((-1.0) ** k for k in range(12)) == 0
    print("[OK] 주장 8·카드 C4: 차분 오차의 차수, 1/(1+x²)")

    for f, dn in ((math.exp, lambda t, m: math.exp(t)),
                  (math.sin, lambda t, m: math.sin(t + m * math.pi / 2))):
        a, x = 0.0, 1.3
        for n in range(6):
            Tn = sum(dn(a, k) / math.factorial(k) * (x - a) ** k for k in range(n + 1))
            R = simpson(lambda t: dn(t, n + 1) * (x - t) ** n / math.factorial(n), a, x)
            assert abs(f(x) - Tn - R) < 1e-12
    print("[OK] 주장 9: 적분 나머지 공식")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
