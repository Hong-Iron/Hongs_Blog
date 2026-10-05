---
layout: "note"
title: "13_substitution_verify.py"
display_title: "13_substitution_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "13"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/substitution/"
parent_title: "치환적분"
description: "미분적분학 · 치환적분 검증 코드"
permalink: "/studies/calculus/code/13_substitution_verify/"
---
{% raw %}
[치환적분](/Hongs_Blog/studies/calculus/substitution/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""치환적분 검증.

문서: 13.치환적분 (예시, 정리, 표, 예제, 카드 C1~C3)
주장 1: sin(x²)의 도함수는 2x cos(x²), -ln|cos x|의 도함수는 tan x (수치 미분).
주장 2: 표의 세 모양 — ln|g|, e^g, (ax+b)^(n+1)/(a(n+1))의 도함수가 피적분함수와 같다.
주장 3: ∫_0^1 x e^{x²} dx = (e - 1)/2, 카드 C1 ∫_0^{π/2} sin³x cos x dx = 1/4 (수치 적분).
주장 4: 카드 C2 — (1/2)ln(1 + x²)과 arctan x의 도함수. 정적분에서 끝값을 바꾸지 않으면 틀린 값이 나온다.
주장 5: 카드 C3 — ∫_0^1 cos(x²) dx와 ∫_0^1 cos(u)/(2√u) du가 같은 값(치환은 맞지만 쉬워지지 않음).
"""
import math


def d(f, x, h=1e-6):
    return (f(x + h) - f(x - h)) / (2 * h)


def simpson(f, a, b, n=4000):
    dx = (b - a) / n
    s = f(a) + f(b) + 4 * sum(f(a + i * dx) for i in range(1, n, 2)) + 2 * sum(f(a + i * dx) for i in range(2, n, 2))
    return s * dx / 3


def main():
    for x in (-1.2, 0.4, 1.5):
        assert abs(d(lambda t: math.sin(t * t), x) - 2 * x * math.cos(x * x)) < 1e-6
        assert abs(d(lambda t: -math.log(abs(math.cos(t))), x) - math.tan(x)) < 1e-5
    print("[OK] 주장 1: 예시와 탄젠트")

    g, gp = (lambda x: x ** 3 + 2), (lambda x: 3 * x * x)
    a, b, n = 3.0, -1.0, 4
    for x in (0.3, 1.1, 2.0):
        assert abs(d(lambda t: math.log(abs(g(t))), x) - gp(x) / g(x)) < 1e-6
        assert abs(d(lambda t: math.exp(g(t)), x) - gp(x) * math.exp(g(x))) < 1e-3 * math.exp(g(x))
        assert abs(d(lambda t: (a * t + b) ** (n + 1) / (a * (n + 1)), x) - (a * x + b) ** n) < 1e-4
    print("[OK] 주장 2: 표의 세 모양")

    assert abs(simpson(lambda x: x * math.exp(x * x), 0, 1) - (math.e - 1) / 2) < 1e-10
    assert abs(simpson(lambda x: math.sin(x) ** 3 * math.cos(x), 0, math.pi / 2) - 0.25) < 1e-10
    print("[OK] 주장 3·카드 C1: (e-1)/2 ≈ %.3f, 1/4" % ((math.e - 1) / 2))

    for x in (-2.0, 0.5, 3.0):
        assert abs(d(lambda t: 0.5 * math.log(1 + t * t), x) - x / (1 + x * x)) < 1e-7
        assert abs(d(math.atan, x) - 1 / (1 + x * x)) < 1e-7
    # 끝값을 그대로 둔 실수: u = x² 로 바꾸고 x의 끝값 [1, 2]를 그대로 쓰면 다른 값
    right = simpson(lambda x: x * math.exp(x * x), 1, 2)
    wrong = 0.5 * simpson(math.exp, 1, 2)
    fixed = 0.5 * simpson(math.exp, 1, 4)
    assert abs(right - fixed) < 1e-8 and abs(right - wrong) > 1
    print("[OK] 주장 4·카드 C2: 치환이 통하는 쪽과 끝값 바꾸기")

    v1 = simpson(lambda x: math.cos(x * x), 0, 1)
    # 두 번째는 u = 0에서 1/√u로 커져 끝점을 쓰지 않는 중점 합으로 계산한다(수렴이 느리다).
    n = 10 ** 6
    v2 = sum(math.cos((i + 0.5) / n) / (2 * math.sqrt((i + 0.5) / n)) for i in range(n)) / n
    assert abs(v1 - v2) < 2e-3
    print(f"[OK] 주장 5·카드 C3: 두 적분 모두 ≈ {v1:.4f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
