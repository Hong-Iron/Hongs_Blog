---
layout: "note"
title: "14_integration-by-parts_verify.py"
display_title: "14_integration-by-parts_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/integration-by-parts/"
parent_title: "부분적분"
description: "미분적분학 · 부분적분 검증 코드"
permalink: "/studies/calculus/code/14_integration-by-parts_verify/"
---
{% raw %}
[부분적분](/Hongs_Blog/studies/calculus/integration-by-parts/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""부분적분 검증.

문서: 14.부분적분 (예시, 표 방법, 예제, 활용, 카드 C1~C3), 4.연습문제/14.적분 계산 예제 사다리
주장 1: 원시함수 — (x-1)e^x, (x²-2x+2)e^x, x ln x - x, e^x(sin x - cos x)/2, x sin x + cos x, (1/2)e^{x²}의
        도함수가 각각의 피적분함수와 같다(수치 미분).
주장 2: 카드 C2 ∫_1^e ln x = 1.
주장 3: ∫_0^∞ x^n e^{-x} dx = n! (n = 0..6, [0, 60]에서 수치 적분).
주장 4: 푸리에 계수 ∫_{-π}^{π} x sin(kx) dx = 2π(-1)^{k+1}/k (k = 1..6).
주장 5: 사다리 — ∫ x cos x, ∫_0^1 x e^{x²} = (e-1)/2, ∫ x² e^x, ∫_1^e x ln x = (e²+1)/4,
        변형 ∫_0^π e^x sin x = (e^π + 1)/2, ∫_0^{π/2} x sin x = 1.
"""
import math


def d(f, x, h=1e-6):
    return (f(x + h) - f(x - h)) / (2 * h)


def simpson(f, a, b, n=20000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    pairs = [
        (lambda x: (x - 1) * math.exp(x), lambda x: x * math.exp(x)),
        (lambda x: (x * x - 2 * x + 2) * math.exp(x), lambda x: x * x * math.exp(x)),
        (lambda x: x * math.log(x) - x, math.log),
        (lambda x: math.exp(x) * (math.sin(x) - math.cos(x)) / 2, lambda x: math.exp(x) * math.sin(x)),
        (lambda x: x * math.sin(x) + math.cos(x), lambda x: x * math.cos(x)),
        (lambda x: 0.5 * math.exp(x * x), lambda x: x * math.exp(x * x)),
        (lambda x: x * x / 2 * math.log(x) - x * x / 4, lambda x: x * math.log(x)),
    ]
    for F, f in pairs:
        for x in (0.5, 1.3, 2.2):
            assert abs(d(F, x) - f(x)) < 1e-5 * max(1, abs(f(x)))
    print("[OK] 주장 1·카드 C1·C3: 원시함수 7개")

    assert abs(simpson(math.log, 1, math.e) - 1) < 1e-10
    print("[OK] 주장 2·카드 C2: ∫_1^e ln x = 1")

    for n in range(7):
        v = simpson(lambda x: x ** n * math.exp(-x), 0, 60, 60000)
        assert abs(v - math.factorial(n)) < 1e-8 * math.factorial(n)
    print("[OK] 주장 3: ∫_0^∞ xⁿe^{-x} = n!")

    for k in range(1, 7):
        v = simpson(lambda x: x * math.sin(k * x), -math.pi, math.pi)
        assert abs(v - 2 * math.pi * (-1) ** (k + 1) / k) < 1e-9
    print("[OK] 주장 4: 푸리에 계수")

    assert abs(simpson(lambda x: x * math.exp(x * x), 0, 1) - (math.e - 1) / 2) < 1e-10
    assert abs(simpson(lambda x: x * math.log(x), 1, math.e) - (math.e ** 2 + 1) / 4) < 1e-10
    assert abs(simpson(lambda x: math.exp(x) * math.sin(x), 0, math.pi) - (math.exp(math.pi) + 1) / 2) < 1e-8
    assert abs(simpson(lambda x: x * math.sin(x), 0, math.pi / 2) - 1) < 1e-10
    print("[OK] 주장 5: 사다리의 정적분 값")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
