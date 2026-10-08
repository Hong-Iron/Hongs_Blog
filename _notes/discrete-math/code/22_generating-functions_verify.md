---
layout: "note"
title: "22_generating-functions_verify.py"
display_title: "22_generating-functions_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/generating-functions/"
parent_title: "생성함수"
description: "이산수학 · 생성함수 검증 코드"
permalink: "/studies/discrete-math/code/22_generating-functions_verify/"
---
{% raw %}
[생성함수](/Hongs_Blog/studies/discrete-math/generating-functions/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""생성함수 검증.

문서: 22.생성함수 (예시, 정의, 예제, 활용, 카드 C1~C3)
주장 1: (x + … + x^6)²에서 x^7의 계수 6 = 주사위 두 개 합이 7인 경우의 수. 합이 2..12인 경우 수 전체도 일치.
주장 2: 1원·2원·5원 동전으로 10원을 만드는 방법 10가지 = 1/((1-x)(1-x²)(1-x⁵))의 x^10 계수.
주장 3: 1/(1-x)^k의 x^n 계수는 C(n+k-1, k-1).
주장 4: x/(1 - x - x²)의 계수는 피보나치 수. 1/(1 - 3x)의 계수는 3^n.
주장 5: 두 다항식의 곱의 계수는 계수열의 합성곱이다.
"""
import math
import random
from itertools import product


def mul(p, q, cap=None):
    out = [0] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            out[i + j] += a * b
    return out[:cap] if cap else out


def series_inverse(den, n):
    """1/den(x)의 처음 n개 계수 (den[0] = 1)."""
    out = [0] * n
    for k in range(n):
        s = 1 if k == 0 else 0
        s -= sum(den[j] * out[k - j] for j in range(1, min(k, len(den) - 1) + 1))
        out[k] = s
    return out


def main():
    die = [0] + [1] * 6
    two = mul(die, die)
    assert two[7] == 6
    for s in range(2, 13):
        assert two[s] == sum(1 for a, b in product(range(1, 7), repeat=2) if a + b == s)
    print("[OK] 주장 1·카드 C1")

    gf = [1]
    for c in (1, 2, 5):
        geo = [1 if i % c == 0 else 0 for i in range(11)]
        gf = mul(gf, geo, 11)
    brute = sum(1 for a in range(11) for b in range(6) for c in range(3) if a + 2 * b + 5 * c == 10)
    assert gf[10] == brute == 10
    print("[OK] 주장 2: 동전 10가지")

    for k in range(1, 6):
        s = series_inverse([1, -1], 30)
        p = [1]
        for _ in range(k):
            p = mul(p, s, 30)
        assert all(p[n] == math.comb(n + k - 1, k - 1) for n in range(30))
    print("[OK] 주장 3·카드 C2")

    fib = mul([0, 1], series_inverse([1, -1, -1], 40), 40)
    F = [0, 1]
    for _ in range(40):
        F.append(F[-1] + F[-2])
    assert fib == F[:40]
    assert series_inverse([1, -3], 20) == [3 ** n for n in range(20)]
    print("[OK] 주장 4")

    rng = random.Random(22)
    for _ in range(500):
        p = [rng.randint(-5, 5) for _ in range(rng.randint(1, 8))]
        q = [rng.randint(-5, 5) for _ in range(rng.randint(1, 8))]
        conv = [sum(p[i] * q[n - i] for i in range(len(p)) if 0 <= n - i < len(q)) for n in range(len(p) + len(q) - 1)]
        assert mul(p, q) == conv
    print("[OK] 주장 5·카드 C3: 곱 = 합성곱")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
