---
layout: "note"
title: "18_binomial-theorem_verify.py"
display_title: "18_binomial-theorem_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/binomial-theorem/"
parent_title: "이항정리"
description: "이산수학 · 이항정리 검증 코드"
permalink: "/studies/discrete-math/code/18_binomial-theorem_verify/"
---
{% raw %}
[이항정리](/Hongs_Blog/studies/discrete-math/binomial-theorem/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이항정리 검증.

문서: 18.이항정리 (예시, 정리, 증명, 예제, 카드 C1~C3)
주장 1: (x + y)^n의 계수가 C(n,k)다 (다항식을 직접 곱해 n <= 20에서 비교).
주장 2: Σ C(n,k) = 2^n, n >= 1에서 Σ (-1)^k C(n,k) = 0, Σ k·C(n,k) = n·2^(n-1), 방데르몽드 Σ C(m,j)C(n,k-j) = C(m+n,k).
주장 3: (2x - 1)^5의 x³ 계수는 C(5,3)·2³·(-1)² = 80.
주장 4: 1이 짝수 개인 n비트 문자열은 2^(n-1)개 (n >= 1).
"""
import math
from itertools import product


def poly_pow(p, n):
    out = [1]
    for _ in range(n):
        new = [0] * (len(out) + len(p) - 1)
        for i, a in enumerate(out):
            for j, b in enumerate(p):
                new[i + j] += a * b
        out = new
    return out


def main():
    for n in range(0, 21):
        assert poly_pow([1, 1], n) == [math.comb(n, k) for k in range(n + 1)]
    print("[OK] 주장 1: (1 + x)^n 계수 = 파스칼 삼각형 (n <= 20)")

    for n in range(0, 40):
        assert sum(math.comb(n, k) for k in range(n + 1)) == 2 ** n
        if n >= 1:
            assert sum((-1) ** k * math.comb(n, k) for k in range(n + 1)) == 0
            assert sum(k * math.comb(n, k) for k in range(n + 1)) == n * 2 ** (n - 1)
    for m in range(0, 10):
        for n in range(0, 10):
            for k in range(0, m + n + 1):
                assert sum(math.comb(m, j) * math.comb(n, k - j) for j in range(0, k + 1)) == math.comb(m + n, k)
    print("[OK] 주장 2·카드 C2")

    coeffs = poly_pow([-1, 2], 5)
    assert coeffs[3] == 80 == math.comb(5, 3) * 8
    print("[OK] 주장 3·카드 C1: 80")

    for n in range(1, 15):
        assert sum(1 for b in product([0, 1], repeat=n) if sum(b) % 2 == 0) == 2 ** (n - 1)
    print("[OK] 주장 4")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
