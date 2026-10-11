---
layout: "note"
title: "05_differentiation-rules_verify.py"
display_title: "05_differentiation-rules_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/differentiation-rules/"
parent_title: "미분 법칙"
description: "미분적분학 · 미분 법칙 검증 코드"
permalink: "/studies/calculus/code/05_differentiation-rules_verify/"
---
{% raw %}
[미분 법칙](/Hongs_Blog/studies/calculus/differentiation-rules/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""미분 법칙 검증.

문서: 05.미분 법칙 (정의, 증명, 예제, 카드 C1~C3, 자주 하는 오해)
방법: 기본 도함수와 곱·몫 법칙을 무작위 점에서 중앙 차분과 비교한다(실험. 증명은 문서).
주장 1: (x^r)' = r x^(r-1), (e^x)' = e^x, (a^x)' = a^x ln a, (ln x)' = 1/x, (sin)' = cos, (cos)' = -sin, (tan)' = 1/cos².
주장 2: 곱·몫 법칙. 예제 (x² e^x)' = (2x + x²) e^x, ((x+1)/(x-1))' = -2/(x-1)².
주장 3: 도(°) 단위 사인 sin(x°)의 도함수는 (π/180) cos(x°)이다.
주장 4: (fg)' ≠ f'g' (x·x에서 2x vs 1).
주장 5: 극한 sin h / h -> 1, (cos h - 1)/h -> 0, (e^h - 1)/h -> 1.
"""
import math
import random


def d(f, x, h=1e-6):
    return (f(x + h) - f(x - h)) / (2 * h)


def close(a, b, tol=1e-6):
    return abs(a - b) <= tol * max(1, abs(a), abs(b))


def main():
    rng = random.Random(5)
    for _ in range(3000):
        x = rng.uniform(0.2, 3)
        r = rng.uniform(-3, 3)
        a = rng.uniform(0.2, 5)
        assert close(d(lambda t: t ** r, x), r * x ** (r - 1))
        assert close(d(math.exp, x), math.exp(x))
        assert close(d(lambda t: a ** t, x), a ** x * math.log(a))
        assert close(d(math.log, x), 1 / x)
        assert close(d(math.sin, x), math.cos(x)) and close(d(math.cos, x), -math.sin(x))
        if abs(math.cos(x)) > 0.1:
            assert close(d(math.tan, x), 1 / math.cos(x) ** 2, 1e-5)
    print("[OK] 주장 1·카드 C1: 기본 도함수 (무작위 3,000점)")

    for _ in range(3000):
        x = rng.uniform(-3, 3)
        f = lambda t: math.sin(t) + 2; g = lambda t: t * t + 1
        assert close(d(lambda t: f(t) * g(t), x), d(f, x) * g(x) + f(x) * d(g, x))
        assert close(d(lambda t: f(t) / g(t), x), (d(f, x) * g(x) - f(x) * d(g, x)) / g(x) ** 2)
        assert close(d(lambda t: t * t * math.exp(t), x), (2 * x + x * x) * math.exp(x))
        if abs(x - 1) > 0.1:
            assert close(d(lambda t: (t + 1) / (t - 1), x), -2 / (x - 1) ** 2, 1e-5)
    print("[OK] 주장 2·카드 C2: 곱·몫 법칙과 예제")

    for _ in range(1000):
        x = rng.uniform(-360, 360)
        assert close(d(lambda t: math.sin(math.radians(t)), x, 1e-4), math.pi / 180 * math.cos(math.radians(x)))
    print("[OK] 주장 3·카드 C3: 도 단위에서는 π/180이 붙는다")

    assert close(d(lambda t: t * t, 1.0), 2.0) and 1 * 1 == 1
    print("[OK] 주장 4·오해")

    for h in (1e-2, 1e-4):
        assert abs(math.sin(h) / h - 1) < h and abs((math.cos(h) - 1) / h) < h and abs((math.exp(h) - 1) / h - 1) < h
    print("[OK] 주장 5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
