---
layout: "note"
title: "31_rsa_verify.py"
display_title: "31_rsa_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/rsa/"
parent_title: "RSA 암호"
description: "이산수학 · RSA 암호 검증 코드"
permalink: "/studies/discrete-math/code/31_rsa_verify/"
---
{% raw %}
[RSA 암호](/Hongs_Blog/studies/discrete-math/rsa/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""RSA 암호 검증.

문서: 31.RSA 암호 (예시, 알고리즘, 정확성 증명, 추적 표, 복잡도, 예제, 오해, 카드 C1~C3)
주장 1: 작은 예 — n = 55, φ = 40, d = 27 (81 = 2·40 + 1), 2^3 mod 55 = 8, 8^27 mod 55 = 2.
주장 2: 추적 표 — 3233, 3120, 2753, 65^17 mod 3233 = 2790, 2790^2753 mod 3233 = 65.
주장 3: 정확성 — 작은 소수쌍 여러 개에서 0 <= m < n의 모든 m이 (m^e)^d ≡ m (p, q의 배수 포함).
         증명 2단계: p | m이면 양변 0, 아니면 페르마로 m^{ed} ≡ m (mod p).
주장 4: φ(n)을 알면 p + q = n - φ + 1, pq = n에서 p, q가 나온다(512비트 키 포함).
주장 5: 오해 — m = 2, e = 3, n = 55에서 c = 8 = 2³이라 세제곱근이 평문. 곱셈 조작: E(a)E(b) ≡ E(ab).
         같은 평문은 같은 암호문(결정적).
주장 6: 카드 C3 — e = 5, φ = 40이면 역원 없음, 그리고 m -> m^5 mod 55가 일대일이 아님.
주장 7: 복잡도 — 빠른 거듭제곱의 곱셈 수가 2·(지수의 비트 수) 이하. k비트 수 중 소수 비율이 1/(k ln 2)에 가깝다(실험, k = 64).
"""
import math
import random


def is_prime(n):
    return n >= 2 and all(n % d for d in range(2, math.isqrt(n) + 1))


def mr(n, rng, rounds=25):
    if n < 4:
        return n in (2, 3)
    if n % 2 == 0:
        return False
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    for _ in range(rounds):
        x = pow(rng.randrange(2, n - 1), d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True


def mults(e):
    return (e.bit_length() - 1) + bin(e).count("1") - 1


def main():
    assert 5 * 11 == 55 and 4 * 10 == 40 and pow(3, -1, 40) == 27 and 81 == 2 * 40 + 1
    assert pow(2, 3, 55) == 8 and pow(8, 27, 55) == 2
    print("[OK] 주장 1·카드 C1: 작은 예")

    assert 61 * 53 == 3233 and 60 * 52 == 3120 and pow(17, -1, 3120) == 2753
    assert pow(65, 17, 3233) == 2790 and pow(2790, 2753, 3233) == 65
    print("[OK] 주장 2: 추적 표")

    small = [p for p in range(3, 60) if is_prime(p)]
    for p in small:
        for q in small:
            if p >= q:
                continue
            n, phi = p * q, (p - 1) * (q - 1)
            for e in (3, 5, 7, 17):
                if math.gcd(e, phi) != 1:
                    continue
                d = pow(e, -1, phi)
                for m in range(n):
                    assert pow(pow(m, e, n), d, n) == m
                    assert pow(m, e * d, p) == m % p
    print("[OK] 주장 3: 정확성(배수 포함 전수)")

    rng = random.Random(31)
    def rprime(bits):
        while True:
            c = rng.getrandbits(bits) | (1 << (bits - 1)) | 1
            if mr(c, rng):
                return c
    for bits in (16, 64, 512):
        p, q = rprime(bits), rprime(bits)
        n, phi = p * q, (p - 1) * (q - 1)
        s = n - phi + 1               # p + q
        disc = math.isqrt(s * s - 4 * n)
        assert disc * disc == s * s - 4 * n and {(s + disc) // 2, (s - disc) // 2} == {p, q}
    print("[OK] 주장 4: φ(n)에서 p, q 되살리기")

    c = pow(2, 3, 55)
    assert c == 8 and round(c ** (1 / 3)) == 2
    n, e = 3233, 17
    a, b = 12, 34
    assert pow(a, e, n) * pow(b, e, n) % n == pow(a * b, e, n)
    assert pow(42, e, n) == pow(42, e, n)
    print("[OK] 주장 5·오해: 세제곱근, 곱셈 조작, 결정성")

    assert math.gcd(5, 40) == 5
    try:
        pow(5, -1, 40)
        raise AssertionError
    except ValueError:
        pass
    images = [pow(m, 5, 55) for m in range(55)]
    assert len(set(images)) < 55
    print("[OK] 주장 6·카드 C3: e가 서로소가 아니면 복호 불가")

    for e in (3, 17, 65537, 2753, 2 ** 2048 - 1):
        assert mults(e) <= 2 * e.bit_length()
    k, trials = 64, 20000
    hits = sum(mr(rng.getrandbits(k) | (1 << (k - 1)), rng, 8) for _ in range(trials))
    ratio = hits / trials
    assert abs(ratio - 1 / (k * math.log(2))) < 0.006
    odd_hits = sum(mr(rng.getrandbits(k) | (1 << (k - 1)) | 1, rng, 8) for _ in range(trials))
    assert abs(odd_hits / trials - 2 / (k * math.log(2))) < 0.01   # 홀수만 보면 두 배
    assert round(1024 * math.log(2) / 2) == 355
    print(f"[OK] 주장 7: 64비트 무작위 수의 소수 비율 {ratio:.4f} ≈ {1 / (k * math.log(2)):.4f}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
