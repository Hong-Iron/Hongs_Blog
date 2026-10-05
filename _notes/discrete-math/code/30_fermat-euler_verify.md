---
layout: "note"
title: "30_fermat-euler_verify.py"
display_title: "30_fermat-euler_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "30"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/fermat-euler/"
parent_title: "페르마 소정리와 오일러 정리"
description: "이산수학 · 페르마 소정리와 오일러 정리 검증 코드"
permalink: "/studies/discrete-math/code/30_fermat-euler_verify/"
---
{% raw %}
[페르마 소정리와 오일러 정리](/Hongs_Blog/studies/discrete-math/fermat-euler/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""페르마 소정리와 오일러 정리 검증.

문서: 30.페르마 소정리와 오일러 정리 (예시, 정의, 정리, 증명, 빠른 거듭제곱, 예제, 활용, 카드 C1~C3)
주장 1: 예시 표 3^k mod 7 = 3, 2, 6, 4, 5, 1, 3, 2와 3^100 mod 7 = 4.
주장 2: 페르마 — 소수 p < 200, 1 <= a < p에서 a^{p-1} ≡ 1, 모든 a에서 a^p ≡ a.
주장 3: 오일러 — n <= 150, gcd(a, n) = 1인 모든 a에서 a^{φ(n)} ≡ 1. 증명의 "a·r_i가 순서만 바뀐다"도 확인.
주장 4: φ — φ(7) = 6, φ(10) = 4, φ(p^k) = p^k - p^{k-1}, 서로소면 곱셈적, 곱 공식, φ(36) = 12.
주장 5: 빠른 거듭제곱 — 결과가 pow와 같고, 3^100에서 제곱 6번과 곱셈 2번.
주장 6: 예제 — 2^14 mod 15 = 4, 561은 카마이클 수(서로소인 모든 a), 341은 밑 2의 유사소수.
주장 7: 활용 — a^{p-2}가 역원.
"""
import math
from fractions import Fraction


def is_prime(n):
    return n >= 2 and all(n % d for d in range(2, math.isqrt(n) + 1))


def phi(n):
    return sum(1 for k in range(1, n + 1) if math.gcd(k, n) == 1)


def fast_pow(a, e, n):
    result, base, sq, mul = 1, a % n, 0, 0
    first = True
    while e:
        if e & 1:
            if first:
                result, first = base, False
            else:
                result = result * base % n
                mul += 1
        e >>= 1
        if e:
            base = base * base % n
            sq += 1
    return result % n, sq, mul


def main():
    assert [pow(3, k, 7) for k in range(1, 9)] == [3, 2, 6, 4, 5, 1, 3, 2]
    assert 100 == 6 * 16 + 4 and pow(3, 100, 7) == 4 == 81 % 7
    print("[OK] 주장 1·카드 C1: 주기 6과 3^100")

    for p in [q for q in range(2, 200) if is_prime(q)]:
        assert all(pow(a, p - 1, p) == 1 for a in range(1, p))
        assert all(pow(a, p, p) == a % p for a in range(-50, 300))
    print("[OK] 주장 2: 페르마 소정리")

    for n in range(2, 151):
        ph = phi(n)
        rs = [r for r in range(1, n + 1) if math.gcd(r, n) == 1]
        for a in range(1, n):
            if math.gcd(a, n) == 1:
                assert pow(a, ph, n) == 1
                assert sorted((a * r) % n for r in rs) == sorted(r % n for r in rs)
    print("[OK] 주장 3·카드 C2: 오일러 정리와 재배열")

    assert phi(7) == 6 and phi(10) == 4 and [k for k in range(1, 11) if math.gcd(k, 10) == 1] == [1, 3, 7, 9]
    for p in (2, 3, 5, 7):
        for k in range(1, 5):
            assert phi(p ** k) == p ** k - p ** (k - 1)
    for m in range(1, 40):
        for n in range(1, 40):
            if math.gcd(m, n) == 1:
                assert phi(m * n) == phi(m) * phi(n)
    for n in range(1, 300):
        prod = Fraction(n)
        for p in {p for p in range(2, n + 1) if n % p == 0 and is_prime(p)}:
            prod *= Fraction(p - 1, p)
        assert prod == phi(n)
    assert phi(36) == 12
    print("[OK] 주장 4: 피 함수")

    for a in range(2, 30):
        for e in range(1, 300):
            for n in (7, 97, 561, 1000):
                assert fast_pow(a, e, n)[0] == pow(a, e, n)
    r, sq, mul = fast_pow(3, 100, 7)
    assert r == 4 and sq == 6 and mul == 2 and bin(100) == "0b1100100" and 100 == 64 + 32 + 4
    print("[OK] 주장 5: 빠른 거듭제곱")

    assert pow(2, 14, 15) == 4
    assert not is_prime(561) and 561 == 3 * 11 * 17
    assert all(pow(a, 560, 561) == 1 for a in range(1, 561) if math.gcd(a, 561) == 1)
    assert all(560 % (p - 1) == 0 for p in (3, 11, 17))
    assert pow(2, 340, 341) == 1 and 341 == 11 * 31
    print("[OK] 주장 6·카드 C3: 카마이클 수와 유사소수")

    for p in (7, 101, 10 ** 9 + 7):
        for a in (2, 3, 12345 % p or 1):
            assert a * pow(a, p - 2, p) % p == 1
    print("[OK] 주장 7: a^{p-2}는 역원")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
