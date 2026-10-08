---
layout: "note"
title: "28_primes_verify.py"
display_title: "28_primes_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/primes/"
parent_title: "소수와 산술의 기본정리"
description: "이산수학 · 소수와 산술의 기본정리 검증 코드"
permalink: "/studies/discrete-math/code/28_primes_verify/"
---
{% raw %}
[소수와 산술의 기본정리](/Hongs_Blog/studies/discrete-math/primes/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""소수와 산술의 기본정리 검증.

문서: 28.소수와 산술의 기본정리 (예시, 정리, 증명, 판정, 밀도, 예제, 활용, 카드 C1~C3)
주장 1: 360 = 2³·3²·5, 약수 24개(직접 세기).
주장 2: 유클리드 보조정리 — 소수 p <= 50, a, b <= 200에서 p | ab => p | a 또는 p | b.
        합성수에서는 깨진다(6 | 2·3이지만 6 ∤ 2, 6 ∤ 3).
주장 3: 1 < n <= 5000을 소인수분해해 다시 곱하면 n, 모든 인수가 소수(존재). 유일성은 증명.
주장 4: 합성수 n은 √n 이하의 약수를 가진다(n <= 20000). 체와 시험 나눗셈이 같다.
주장 5: π(10^6) = 78498, n/ln n ≈ 72382.
주장 6: 예제 — 2+1, 2·3+1, ..., 2·3·5·7·11+1은 소수, 30031 = 59·509이고 59, 509는 13보다 크다.
주장 7: 해시 — 4의 배수 키 100개가 칸 8개에서는 2칸, 칸 7개에서는 7칸에 14~15개씩.
"""
import math
from collections import Counter


def sieve(n):
    mark = bytearray([1]) * (n + 1)
    mark[0] = mark[1] = 0
    for p in range(2, math.isqrt(n) + 1):
        if mark[p]:
            mark[p * p::p] = bytearray(len(range(p * p, n + 1, p)))
    return [i for i in range(n + 1) if mark[i]]


def is_prime(n):
    return n >= 2 and all(n % d for d in range(2, math.isqrt(n) + 1))


def main():
    assert 2 ** 3 * 3 ** 2 * 5 == 360 and sum(1 for d in range(1, 361) if 360 % d == 0) == 24
    print("[OK] 주장 1·카드 C1")

    for p in [q for q in range(2, 51) if is_prime(q)]:
        for a in range(1, 201):
            for b in range(1, 201):
                if (a * b) % p == 0:
                    assert a % p == 0 or b % p == 0
    assert (2 * 3) % 6 == 0 and 2 % 6 and 3 % 6
    print("[OK] 주장 2: 유클리드 보조정리")

    for n in range(2, 5001):
        m, prod, d = n, 1, 2
        while d * d <= m:
            while m % d == 0:
                assert is_prime(d)
                prod *= d
                m //= d
            d += 1
        if m > 1:
            assert is_prime(m)
            prod *= m
        assert prod == n
    print("[OK] 주장 3: 분해의 존재")

    for n in range(4, 20001):
        if not is_prime(n):
            assert any(n % d == 0 for d in range(2, math.isqrt(n) + 1))
    ps = sieve(20000)
    assert ps == [n for n in range(20001) if is_prime(n)]
    print("[OK] 주장 4·카드 C2: √n 판정과 체")

    assert len(sieve(10 ** 6)) == 78498 and round(1e6 / math.log(1e6)) == 72382
    print("[OK] 주장 5: π(10^6)")

    prods, pr = [], 1
    for p in [2, 3, 5, 7, 11, 13]:
        pr *= p
        prods.append(pr + 1)
    assert prods == [3, 7, 31, 211, 2311, 30031]
    assert all(is_prime(x) for x in prods[:5]) and 30031 == 59 * 509 and is_prime(59) and is_prime(509)
    print("[OK] 주장 6·카드 C3: 30031 = 59 × 509")

    keys = [4 * i for i in range(100)]
    c8, c7 = Counter(k % 8 for k in keys), Counter(k % 7 for k in keys)
    assert set(c8) == {0, 4} and set(c7) == set(range(7)) and set(c7.values()) == {14, 15}
    print("[OK] 주장 7: 해시 칸")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
