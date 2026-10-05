---
layout: "note"
title: "01_limits_verify.py"
display_title: "01_limits_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/limits/"
parent_title: "극한"
description: "미분적분학 · 극한 검증 코드"
permalink: "/studies/calculus/code/01_limits_verify/"
---
{% raw %}
[극한](/Hongs_Blog/studies/calculus/limits/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""극한 검증.

문서: 01.극한 (예시, 정의, 증명, 예제, 활용, 카드 C1~C4, 자주 하는 오해)
주장 1: (x² - 1)/(x - 1)은 x -> 1에서 2에 다가간다(표), x = 1에서는 정의되지 않는다.
주장 2: sin x / x -> 1, sin 3x / x -> 3.
주장 3: 2x + 1 -> 7 (x -> 3)의 ε-δ 증명에서 δ = ε/2이면 0 < |x-3| < δ인 모든 x에서 |f(x) - 7| < ε (무작위 확인).
주장 4: 부호 함수는 0에서 왼쪽 극한 -1, 오른쪽 극한 1이라 극한이 없다. sin(1/x)는 0 근처에서 -1과 1 사이를 계속 오간다.
주장 5: 부동소수점에서 1 + 1e-17 == 1이라 (x²-1)/(x-1)을 x = 1 + 1e-17에서 계산할 수 없다.
주장 6: cos x <= sin x / x <= 1 (0 < |x| < π/2) — 조임 정리의 부등식.
주장 7: 오해 — x ≠ 0에서 x², x = 0에서 5인 함수의 극한은 0이고 함숫값은 5다.
"""
import math
import random


def main():
    f = lambda x: (x * x - 1) / (x - 1)
    for h in (0.1, 0.01, 0.001, 1e-6):
        assert abs(f(1 + h) - 2) <= h * 1.0001 and abs(f(1 - h) - 2) <= h * 1.0001
    assert f"{f(0.9):.2f}" == "1.90" and f"{f(1.01):.2f}" == "2.01"
    try:
        f(1)
        raise AssertionError
    except ZeroDivisionError:
        pass
    print("[OK] 주장 1·카드 C2: 표의 값, x = 1에서 정의 안 됨")

    for h in (1e-1, 1e-3, 1e-5):
        assert abs(math.sin(h) / h - 1) < h * h and abs(math.sin(3 * h) / h - 3) < 10 * h * h
    print("[OK] 주장 2·카드 C2")

    rng = random.Random(1)
    for _ in range(20000):
        eps = 10 ** rng.uniform(-8, 1)
        delta = eps / 2
        x = 3 + rng.uniform(-delta, delta) * 0.999999
        if x == 3:
            continue
        assert abs((2 * x + 1) - 7) < eps
    print("[OK] 주장 3·카드 C4: δ = ε/2 (무작위 2만 회)")

    sign = lambda x: (x > 0) - (x < 0)
    assert all(sign(-10 ** -k) == -1 and sign(10 ** -k) == 1 for k in range(1, 15))
    vals = [math.sin(1 / x) for x in (1 / (math.pi / 2 + 2 * math.pi * k) for k in range(1, 1000))]
    vals2 = [math.sin(1 / x) for x in (1 / (3 * math.pi / 2 + 2 * math.pi * k) for k in range(1, 1000))]
    assert all(abs(v - 1) < 1e-9 for v in vals) and all(abs(v + 1) < 1e-9 for v in vals2)
    print("[OK] 주장 4·카드 C3: 부호 함수의 한쪽 극한 -1, 1; sin(1/x)는 0 근처에서 1과 -1을 모두 낸다")

    x = 1 + 1e-17
    assert x == 1.0
    print("[OK] 주장 5: 1 + 1e-17 == 1.0")

    for _ in range(10000):
        t = rng.uniform(-math.pi / 2 + 1e-6, math.pi / 2 - 1e-6)
        if abs(t) < 1e-9:
            continue
        assert math.cos(t) <= math.sin(t) / t + 1e-15 and math.sin(t) / t <= 1 + 1e-15
    print("[OK] 주장 6: cos x <= sin x/x <= 1")

    g = lambda x: 5 if x == 0 else x * x
    assert g(0) == 5 and all(abs(g(10 ** -k)) < 10 ** (-2 * k + 1) for k in range(1, 8))
    print("[OK] 주장 7·오해")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
