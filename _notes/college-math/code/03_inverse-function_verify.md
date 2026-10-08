---
layout: "note"
title: "03_inverse-function_verify.py"
display_title: "03_inverse-function_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/inverse-function/"
parent_title: "역함수"
description: "대학수학 · 역함수 검증 코드"
permalink: "/studies/college-math/code/03_inverse-function_verify/"
---
{% raw %}
[역함수](/Hongs_Blog/studies/college-math/inverse-function/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""역함수 검증.

문서: 03.역함수 (예시, 예제, 카드 C2·C3, 자주 하는 오해)
주장 1: 섭씨 -> 화씨 F = 1.8C + 32의 역함수는 C = (F - 32)/1.8이다.
주장 2: f(x) = (2x + 1)/(x - 3)의 역함수는 (3x + 1)/(x - 2)이고, 2는 f의 치역에 없다.
주장 3: x^2은 실수 전체에서 역함수가 없고, [0, ∞)로 자르면 sqrt가 역함수다.
주장 4: f^{-1}(x)와 1/f(x)는 다르다 (f(x) = x + 1, x = 1에서 0과 1/2).
"""
import math
import random
from fractions import Fraction as F


def main():
    to_f = lambda c: F(9, 5) * c + 32
    to_c = lambda t: (t - 32) / F(9, 5)
    assert to_f(100) == 212 and to_c(212) == 100 and to_f(-40) == -40
    for c in range(-100, 101):
        assert to_c(to_f(c)) == c
    print("[OK] 주장 1: 100°C -> 212°F -> 100°C, -40에서 두 눈금이 같다")

    f = lambda x: (2 * x + 1) / (x - 3)
    finv = lambda y: (3 * y + 1) / (y - 2)
    rng = random.Random(2)
    for _ in range(5000):
        x = F(rng.randint(-1000, 1000), rng.randint(1, 50))
        if x == 3:
            continue
        assert finv(f(x)) == x
        y = F(rng.randint(-1000, 1000), rng.randint(1, 50))
        if y == 2:
            continue
        assert f(finv(y)) == y
    # f(x) = 2  <=>  2x + 1 = 2x - 6  <=>  1 = -6: 해가 없다
    assert all(f(F(n, 7)) != 2 for n in range(-700, 700) if n != 21)
    print("[OK] 카드 C2: f^{-1}(x) = (3x+1)/(x-2), 무작위 5,000쌍 왕복 일치, 2는 치역 밖")

    assert (-3) ** 2 == 3 ** 2  # 일대일이 아니다
    for i in range(0, 1000):
        x = i / 10
        assert math.isclose(math.sqrt(x * x), x)
    print("[OK] 카드 C3: x^2은 f(-3) = f(3), [0, ∞)에서는 sqrt(x^2) = x")

    g = lambda x: x + 1
    ginv = lambda x: x - 1
    assert ginv(1) == 0 and F(1, g(1)) == F(1, 2)
    print("[OK] 오해: f(x) = x + 1에서 f^{-1}(1) = 0, 1/f(1) = 1/2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
