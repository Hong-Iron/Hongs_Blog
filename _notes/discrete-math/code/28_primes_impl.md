---
layout: "note"
title: "28_primes_impl.py"
display_title: "28_primes_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "28"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/primes/"
parent_title: "소수와 산술의 기본정리"
description: "이산수학 · 소수와 산술의 기본정리 구현 코드"
permalink: "/studies/discrete-math/code/28_primes_impl/"
---
{% raw %}
[소수와 산술의 기본정리](/Hongs_Blog/studies/discrete-math/primes/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""소수: 에라토스테네스의 체, 시험 나눗셈 판정, 소인수분해.

문서: 28.소수와 산술의 기본정리
sieve(n): n 이하 소수 목록. 각 소수 p에 대해 p²부터 p의 배수를 지운다. O(n log log n).
is_prime(n): √n 이하의 수로만 나눠 본다. O(√n).
factorize(n): 작은 약수부터 나눠 가며 (소수, 지수) 목록을 만든다.
"""
import math


def sieve(n):
    if n < 2:
        return []
    mark = bytearray([1]) * (n + 1)
    mark[0] = mark[1] = 0
    for p in range(2, math.isqrt(n) + 1):
        if mark[p]:
            mark[p * p::p] = bytearray(len(range(p * p, n + 1, p)))
    return [i for i in range(n + 1) if mark[i]]


def is_prime(n):
    if n < 2:
        return False
    for d in range(2, math.isqrt(n) + 1):
        if n % d == 0:
            return False
    return True


def factorize(n):
    if n < 1:
        raise ValueError("양의 정수만")
    out, d = [], 2
    while d * d <= n:
        e = 0
        while n % d == 0:
            n //= d
            e += 1
        if e:
            out.append((d, e))
        d += 1
    if n > 1:
        out.append((n, 1))
    return out


if __name__ == "__main__":
    ps = sieve(10 ** 5)
    assert len(ps) == 9592 and ps[:10] == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
    assert all(is_prime(k) == (k in set(ps)) for k in range(0, 3000))
    assert factorize(360) == [(2, 3), (3, 2), (5, 1)] and factorize(30031) == [(59, 1), (509, 1)]
    for n in range(1, 5000):
        prod = 1
        for p, e in factorize(n):
            assert is_prime(p)
            prod *= p ** e
        assert prod == n
    print("ALL CHECKS PASSED")
```
{% endraw %}
