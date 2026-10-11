---
layout: "note"
title: "09_power-vs-exponential_verify.py"
display_title: "09_power-vs-exponential_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "대학수학"
course_slug: "college-math"
course_url: "/studies/college-math/"
track: "수학"
parent_url: "/studies/college-math/power-vs-exponential/"
parent_title: "거듭제곱함수와 지수함수 비교"
description: "대학수학 · 거듭제곱함수와 지수함수 비교 검증 코드"
permalink: "/studies/college-math/code/09_power-vs-exponential_verify/"
---
{% raw %}
[거듭제곱함수와 지수함수 비교](/Hongs_Blog/studies/college-math/power-vs-exponential/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""거듭제곱함수와 지수함수 비교 검증.

문서: 09.거듭제곱함수와 지수함수 비교 (카드 C1~C3, 결정적 차이, 둘 다 아닐 때)
주장 1: 2^n과 n^2은 n = 2, 4에서 같고, n = 3에서만 2^n < n^2이며, n >= 5에서는 늘 2^n > n^2이다 (n <= 10,000 전수).
주장 2: n = 100에서 n^10 = 10^20이 1.1^n ≈ 13,781보다 크지만, n >= 686부터는 늘 1.1^n > n^10이다.
주장 3: 컴퓨터가 1000배 빨라지면 n^2 알고리즘은 같은 시간에 약 31.6배 큰 입력을, 2^n 알고리즘은 약 10만큼 큰 입력을 푼다.
주장 4: 입력을 2배로 하면 n^k는 2^k배, 2^n은 제곱이 된다.
주장 5: n >= 4에서 n! > 2^n.
"""
import math


def main():
    eq = [n for n in range(1, 10_001) if 2 ** n == n * n]
    less = [n for n in range(1, 10_001) if 2 ** n < n * n]
    assert eq == [2, 4] and less == [3]
    print("[OK] 카드 C3: 2^n = n^2은 n = 2, 4, 2^n < n^2은 n = 3뿐, n >= 5에서 2^n > n^2 (n <= 10,000)")

    assert 100 ** 10 == 10 ** 20 and round(1.1 ** 100) == 13_781
    # 정수로 정확히 비교: 1.1^n > n^10  <=>  11^n > 10^n · n^10
    bigger = [n for n in range(1, 5001) if 11 ** n > 10 ** n * n ** 10]
    last_small = max(n for n in range(1, 5001) if 11 ** n <= 10 ** n * n ** 10)
    assert last_small == 685 and all(n in bigger for n in range(686, 5001))
    print(f"[OK] 카드 C2: n = 100에서 n^10 = 1e20 > 1.1^100 ≈ {1.1**100:,.0f}, n >= {last_small + 1}에서 늘 1.1^n > n^10 (n <= 5,000)")

    assert f"{math.sqrt(1000):.1f}" == "31.6" and f"{math.log2(1000):.2f}" == "9.97"
    print(f"[OK] 결정적 차이: 1000배 빠르면 n^2 -> 입력 ×{math.sqrt(1000):.1f}, 2^n -> 입력 +{math.log2(1000):.2f}")

    for k in (1, 2, 3):
        for n in (10, 100, 1000):
            assert (2 * n) ** k == 2 ** k * n ** k
    for n in (5, 10, 20):
        assert 2 ** (2 * n) == (2 ** n) ** 2
    print("[OK] 입력 2배: n^k -> 2^k배, 2^n -> (2^n)^2")

    assert [n for n in range(1, 200) if math.factorial(n) <= 2 ** n] == [1, 2, 3]
    print("[OK] 둘 다 아닐 때: n >= 4에서 n! > 2^n (n < 200)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
