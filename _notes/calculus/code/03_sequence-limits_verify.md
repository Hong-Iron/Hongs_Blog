---
layout: "note"
title: "03_sequence-limits_verify.py"
display_title: "03_sequence-limits_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/sequence-limits/"
parent_title: "수열의 극한과 e"
description: "미분적분학 · 수열의 극한과 e 검증 코드"
permalink: "/studies/calculus/code/03_sequence-limits_verify/"
---
{% raw %}
[수열의 극한과 e](/Hongs_Blog/studies/calculus/sequence-limits/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""수열의 극한과 e 검증.

문서: 03.수열의 극한과 e (예시, 정의, 증명, 예제, 카드 C1~C3, 자주 하는 오해)
주장 1: a_n = (1 + 1/n)^n은 n = 1..2000에서 늘 증가하고 3보다 작다(유리수로 정확히, n <= 60).
주장 2: 1/n -> 0에서 ε = 0.001이면 N = 1001부터 |a_n| < ε.
주장 3: (3n² + n)/(n² + 5) -> 3, 0.9^n -> 0 (0.9^n < 0.001은 n >= 66).
주장 4: 조화수 H_n의 이웃 차 1/(n+1)은 0으로 가지만 H_n은 한없이 커진다 (H_{2^k} >= 1 + k/2).
주장 5: 바빌로니아(뉴턴) 반복 x -> (x + 2/x)/2는 맞는 자릿수가 거의 두 배씩 는다.
"""
import math
from fractions import Fraction as F


def main():
    prev = F(0)
    for n in range(1, 61):
        a = (1 + F(1, n)) ** n
        assert prev < a < 3
        prev = a
    vals = [(1 + 1 / n) ** n for n in range(1, 2001)]
    assert all(x < y for x, y in zip(vals, vals[1:])) and vals[-1] < math.e
    print("[OK] 주장 1: 증가하고 3 미만")

    eps = 0.001
    N = next(n for n in range(1, 10 ** 6) if all(1 / m < eps for m in (n, n + 1, n + 1000)))
    assert N == 1001 and 1 / 1000 >= eps
    print("[OK] 주장 2: N = 1001")

    for n in (10, 100, 1000, 10 ** 6):
        assert abs((3 * n * n + n) / (n * n + 5) - 3) < 2 / n
    assert next(n for n in range(1000) if 0.9 ** n < 0.001) == 66
    print("[OK] 주장 3·카드 C2")

    H = 0.0
    for n in range(1, 2 ** 16 + 1):
        H += 1 / n
        if n & (n - 1) == 0:
            k = int(math.log2(n))
            assert H >= 1 + k / 2 - 1e-12
    print(f"[OK] 주장 4·카드 C3: H_65536 = {H:.3f} >= 9")

    x = 1.0
    errs = []
    for _ in range(5):
        x = (x + 2 / x) / 2
        errs.append(abs(x - math.sqrt(2)))
    digits = [-math.log10(e) if e > 0 else 16 for e in errs]
    assert digits[1] > 1.9 * digits[0] - 1 and digits[2] > 1.9 * digits[1] - 1
    print("[OK] 주장 5: 맞는 자릿수 " + ", ".join(f"{d:.1f}" for d in digits))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
