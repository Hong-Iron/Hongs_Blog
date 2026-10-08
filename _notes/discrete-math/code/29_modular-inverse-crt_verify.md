---
layout: "note"
title: "29_modular-inverse-crt_verify.py"
display_title: "29_modular-inverse-crt_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "29"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/modular-inverse-crt/"
parent_title: "모듈러 역원과 중국인의 나머지 정리"
description: "이산수학 · 모듈러 역원과 중국인의 나머지 정리 검증 코드"
permalink: "/studies/discrete-math/code/29_modular-inverse-crt_verify/"
---
{% raw %}
[모듈러 역원과 중국인의 나머지 정리](/Hongs_Blog/studies/discrete-math/modular-inverse-crt/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""모듈러 역원과 중국인의 나머지 정리 검증.

문서: 29.모듈러 역원과 중국인의 나머지 정리 (예시, 정리, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 역원은 gcd(a, m) = 1일 때만 있고 하나뿐(m <= 60 전수). 소수 p에서 0 아닌 모든 수에 역원.
주장 2: 예시 — 7·15 = 105 ≡ 1 (mod 26), 아핀 암호 y = 7x + 3의 왕복, y = 2x는 0과 13이 충돌.
주장 3: CRT — 쌍마다 서로소인 법(작은 범위 전수)에서 해가 법 M에 대해 정확히 하나. 구성식이 그 해.
         서로소가 아니면: x ≡ 1 (mod 4), x ≡ 2 (mod 6)은 해 없음, x ≡ 1 (mod 4), x ≡ 3 (mod 6)은 해가 법 24에서 둘.
주장 4: 예제 — 손자산경 23, 구성 중간값 233. 카드 C3 — 29 (mod 36), 중간값 65.
주장 5: 카드 C1 — 거꾸로 대입한 1 = 3·26 - 11·7. 카드 C2 — 4x mod 6은 0, 4, 2, 0, 4, 2.
주장 6: 활용 — RSA-CRT 복호가 직접 복호와 같다(작은 키 여러 개). 잉여 수 체계로 한 곱셈이 맞다.
         C(n, k) mod p를 역원으로 계산한 값이 정확한 값과 같다(p = 10^9 + 7).
"""
import math
import random
from itertools import product


def inv(a, m):
    return pow(a, -1, m)


def crt(res, mods):
    M = math.prod(mods)
    x = 0
    for a, m in zip(res, mods):
        Mi = M // m
        x += a * Mi * inv(Mi % m, m)
    return x % M, x


def main():
    for m in range(1, 61):
        for a in range(m):
            sols = [x for x in range(m) if (a * x) % m == 1 % m]
            if m == 1:
                continue
            assert (len(sols) == 1) == (math.gcd(a, m) == 1) and len(sols) <= 1
    for p in (2, 3, 5, 7, 11, 13, 101):
        assert all(any((a * x) % p == 1 for x in range(p)) for a in range(1, p))
    print("[OK] 주장 1: 역원의 조건과 유일성")

    assert 7 * 15 == 105 == 4 * 26 + 1 and inv(7, 26) == 15
    for x in range(26):
        y = (7 * x + 3) % 26
        assert (15 * (y - 3)) % 26 == x
    assert (2 * 0) % 26 == (2 * 13) % 26
    print("[OK] 주장 2: 아핀 암호")

    moduli_sets = [(3, 5), (4, 9), (3, 5, 7), (2, 5, 9), (8, 3, 5)]
    for mods in moduli_sets:
        M = math.prod(mods)
        for res in product(*[range(m) for m in mods]):
            sols = [x for x in range(M) if all(x % m == a for a, m in zip(res, mods))]
            assert len(sols) == 1 and crt(res, mods)[0] == sols[0]
    assert not [x for x in range(24) if x % 4 == 1 and x % 6 == 2]
    assert [x for x in range(24) if x % 4 == 1 and x % 6 == 3] == [9, 21]
    print("[OK] 주장 3: CRT 존재·유일성, 서로소가 아닐 때")

    assert crt((2, 3, 2), (3, 5, 7)) == (23, 233)
    assert crt((1, 2), (4, 9)) == (29, 65) and inv(4, 9) == 7
    print("[OK] 주장 4·카드 C3")

    assert 3 * 26 - 11 * 7 == 1 and -11 % 26 == 15
    assert [(4 * x) % 6 for x in range(6)] == [0, 4, 2, 0, 4, 2]
    print("[OK] 주장 5·카드 C1·C2")

    rng = random.Random(29)
    primes = [p for p in range(1000, 1300) if all(p % d for d in range(2, 37))]
    for _ in range(50):
        p, q = rng.sample(primes, 2)
        n, phi = p * q, (p - 1) * (q - 1)
        e = 65537 if math.gcd(65537, phi) == 1 else 3
        if math.gcd(e, phi) != 1:
            continue
        d = inv(e, phi)
        m = rng.randrange(n)
        c = pow(m, e, n)
        mp, mq = pow(c, d % (p - 1), p), pow(c, d % (q - 1), q)
        assert crt((mp, mq), (p, q))[0] == pow(c, d, n) == m
    ps = [10007, 10009, 10037]
    a, b = 123456, 654321
    assert crt([(a % q) * (b % q) % q for q in ps], ps)[0] == a * b
    P = 10 ** 9 + 7
    for n_, k in ((50, 20), (100, 37), (1000, 500)):
        num = math.factorial(n_) % P
        den = math.factorial(k) * math.factorial(n_ - k) % P
        assert num * inv(den, P) % P == math.comb(n_, k) % P
    print("[OK] 주장 6: RSA-CRT, 잉여 수 체계, 조합 수")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
