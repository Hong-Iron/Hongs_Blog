---
layout: "note"
title: "24_asymptotic-notation_verify.py"
display_title: "24_asymptotic-notation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/asymptotic-notation/"
parent_title: "점근 표기"
description: "이산수학 · 점근 표기 검증 코드"
permalink: "/studies/discrete-math/code/24_asymptotic-notation_verify/"
---
{% raw %}
[점근 표기](/Hongs_Blog/studies/discrete-math/asymptotic-notation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""점근 표기 검증.

문서: 24.점근 표기 (예시, 정의, 증명, 예제, 카드 C1~C4, 자주 하는 오해)
주장 1: 3n² + 5n + 7 <= 15n² (n >= 1), >= 3n² — 따라서 Θ(n²) (n <= 10^5 확인. 증명은 문서).
주장 2: log_10 n / lg n = 1/lg 10으로 일정하다 — 밑이 다른 로그는 서로 Θ.
주장 3: 서열 lg n < √n < n < n lg n < n^1.5 < n² < 2^n < n!이 n = 64에서 성립하고, 비가 벌어진다.
주장 4: f(n) = n, g(n) = n² (n 짝수), 1 (n 홀수)은 f = O(g)도 f = Ω(g)도 아니다.
주장 5: 오해 — 100n > n²은 n < 100에서다. n = 50이면 5000 > 2500.
주장 6: 예시 표 A(n) = 3n² + 5n + 7, B(n) = 50 n lg n의 값과 입력 크기 어림(1초 10^8번).
"""
import math


def main():
    for n in range(1, 10 ** 5 + 1):
        v = 3 * n * n + 5 * n + 7
        assert 3 * n * n <= v <= 15 * n * n
    print("[OK] 주장 1·카드 C2: c₁ = 3, c₂ = 15, n₀ = 1")

    r = {n: math.log10(n) / math.log2(n) for n in (2, 10, 1000, 10 ** 9)}
    assert all(abs(v - 1 / math.log2(10)) < 1e-12 for v in r.values())
    print(f"[OK] 주장 2·카드 C3: log10 n / lg n = {1/math.log2(10):.4f}")

    n = 64
    order = [math.log2(n), math.sqrt(n), n, n * math.log2(n), n ** 1.5, n ** 2, 2.0 ** n, float(math.factorial(n))]
    assert all(a < b for a, b in zip(order, order[1:]))
    print("[OK] 주장 3: n = 64에서 서열 성립")

    f = lambda n: n
    g = lambda n: n * n if n % 2 == 0 else 1
    # O가 아님: 홀수 n에서 f/g = n이 한없이 큼. Ω가 아님: 짝수 n에서 f/g = 1/n이 0으로 감.
    assert max(f(n) / g(n) for n in range(1, 10 ** 4, 2)) > 9000
    assert min(f(n) / g(n) for n in range(2, 10 ** 4, 2)) < 1e-3
    print("[OK] 주장 4·카드 C4")

    assert 100 * 50 > 50 * 50 and all(100 * n > n * n for n in range(1, 100)) and 100 * 100 == 100 * 100
    print("[OK] 주장 5·오해")

    A = lambda n: 3 * n * n + 5 * n + 7
    B = lambda n: round(50 * n * math.log2(n))
    assert [A(n) for n in (10, 100, 1000, 10000)] == [357, 30507, 3005007, 300050007]
    assert [B(n) for n in (10, 100, 1000, 10000)] == [1661, 33219, 498289, 6643856]
    assert A(10) < B(10) and A(100) < B(100) and A(1000) > B(1000)
    assert 0.5e8 < (10 ** 4) ** 2 <= 1e8 * 1.01 and 0.5e8 < 5e6 * math.log2(5e6) < 1.2e8
    print("[OK] 주장 6: 예시 표와 입력 크기 어림")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
