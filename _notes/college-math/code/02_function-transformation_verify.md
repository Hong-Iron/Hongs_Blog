---
layout: "note"
title: "02_function-transformation_verify.py"
display_title: "02_function-transformation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/function-transformation/"
parent_title: "함수의 변환과 합성"
description: "대학수학 · 함수의 변환과 합성 검증 코드"
permalink: "/studies/college-math/code/02_function-transformation_verify/"
---
{% raw %}
[함수의 변환과 합성](/Hongs_Blog/studies/college-math/function-transformation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""함수의 변환과 합성 검증.

문서: 02.함수의 변환과 합성 (정의의 점 대응, 예제, 카드 C1·C3)
주장 1: g(x) = a·f(b(x - h)) + k이면 f 위의 점 (x0, y0)은 g 위의 점 (x0/b + h, a·y0 + k)로 간다.
주장 2: 합성은 순서를 바꾸면 결과가 달라진다. f(x) = x + 1, g(x) = x^2이면 f(g(2)) = 5, g(f(2)) = 9.
주장 3: 변환을 적용하는 순서가 바뀌면 결과 식이 달라진다 (카드 C1).
방법: 유리수(Fraction)로 정확히 계산하고, 무작위 계수 2,000세트에 대해 대입해 본다.
"""
import random
from fractions import Fraction as F

BASE = {
    "x^2": lambda x: x * x,
    "x^3 - x": lambda x: x ** 3 - x,
    "1/(1+x^2)": lambda x: 1 / (1 + x * x),
}


def transform(f, a, b, h, k):
    return lambda x: a * f(b * (x - h)) + k


def main():
    rng = random.Random(1)
    for name, f in BASE.items():
        for _ in range(2000):
            a, b, h, k = (F(rng.randint(-9, 9) or 1, rng.randint(1, 5)) for _ in range(4))
            x0 = F(rng.randint(-20, 20), rng.randint(1, 7))
            g = transform(f, a, b, h, k)
            assert g(x0 / b + h) == a * f(x0) + k
    print("[OK] 점 대응 (x0, y0) -> (x0/b + h, a·y0 + k): 함수 3개 × 무작위 2,000세트")

    # 예시: f(x - 3)은 x = 3에서 f(0)을 낸다 -> 오른쪽 이동
    f = BASE["x^2"]
    assert transform(f, 1, 1, 3, 0)(3) == f(0)
    # 예제: y = -2(x - 1)^2 + 3의 꼭짓점은 (1, 3), 아래로 열림
    g = transform(f, -2, 1, 1, 3)
    assert g(1) == 3 and g(0) < 3 and g(2) < 3 and g(0) == g(2) == 1
    print("[OK] 예제: -2(x-1)^2 + 3의 꼭짓점 (1, 3), g(0) = g(2) = 1")

    # 카드 C1: 왼쪽 2 -> 세로 3배 -> 아래로 1 = 3(x+2)^2 - 1
    step1 = lambda x: f(x + 2)
    step2 = lambda x: 3 * step1(x)
    step3 = lambda x: step2(x) - 1
    other = lambda x: 3 * (step1(x) - 1)  # 아래로 1을 먼저, 세로 3배를 나중에
    for x in range(-10, 11):
        assert step3(x) == 3 * (x + 2) ** 2 - 1
        assert other(x) == 3 * (x + 2) ** 2 - 3
    print("[OK] 카드 C1: 3(x+2)^2 - 1, 순서를 바꾸면 3(x+2)^2 - 3")

    # 카드 C3 / 주장 2
    p = lambda x: x + 1
    q = lambda x: x * x
    assert p(q(2)) == 5 and q(p(2)) == 9
    for x in range(-5, 6):
        assert p(q(x)) == x * x + 1 and q(p(x)) == (x + 1) ** 2
    print("[OK] 카드 C3: f∘g(2) = 5, g∘f(2) = 9")

    # 합성의 정의역: u(x) = x - 1, v(x) = sqrt(x)이면 v∘u는 u(x)가 v의 정의역 [0, ∞)에 드는 x >= 1에서만 정의된다
    import math
    u = lambda x: x - 1

    def works(x):
        try:
            math.sqrt(u(x))
            return True
        except ValueError:
            return False

    assert [x for x in range(-3, 4) if works(x)] == [1, 2, 3]
    print("[OK] 합성의 정의역: sqrt(x - 1)은 x >= 1에서만 계산된다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
