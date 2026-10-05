---
layout: "note"
title: "31_rsa_impl.py"
display_title: "31_rsa_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "31"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/rsa/"
parent_title: "RSA 암호"
description: "이산수학 · RSA 암호 구현 코드"
permalink: "/studies/discrete-math/code/31_rsa_impl/"
---
{% raw %}
[RSA 암호](/Hongs_Blog/studies/discrete-math/rsa/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""교과서 RSA (교육용. 실제 보안에 쓰지 않는다: 패딩이 없고 난수 생성도 암호학적으로 안전하지 않다).

문서: 31.RSA 암호
keygen(p, q, e): n = pq, φ = (p-1)(q-1), d = e^{-1} mod φ. e와 φ가 서로소여야 한다.
encrypt(m, pub) = m^e mod n, decrypt(c, priv) = c^d mod n.
decrypt_crt: mod p와 mod q에서 따로 거듭제곱해 중국인의 나머지 정리로 합친다.
random_prime(bits): 밀러–라빈 판정으로 소수를 고른다.
"""
import math
import random


def is_probable_prime(n, rounds=30, rng=random.Random(0)):
    if n < 2:
        return False
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n % p == 0:
            return n == p
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    for _ in range(rounds):
        a = rng.randrange(2, n - 1)
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True


def random_prime(bits, rng):
    while True:
        c = rng.getrandbits(bits) | (1 << (bits - 1)) | 1
        if is_probable_prime(c):
            return c


def keygen(p, q, e=65537):
    if p == q:
        raise ValueError("p와 q는 서로 달라야 한다")
    n, phi = p * q, (p - 1) * (q - 1)
    if math.gcd(e, phi) != 1:
        raise ValueError("e와 φ(n)이 서로소가 아니다")
    d = pow(e, -1, phi)
    return (n, e), (n, d, p, q)


def encrypt(m, pub):
    n, e = pub
    if not 0 <= m < n:
        raise ValueError("평문은 0 이상 n 미만")
    return pow(m, e, n)


def decrypt(c, priv):
    n, d, _, _ = priv
    return pow(c, d, n)


def decrypt_crt(c, priv):
    n, d, p, q = priv
    mp, mq = pow(c, d % (p - 1), p), pow(c, d % (q - 1), q)
    h = (pow(q, -1, p) * (mp - mq)) % p   # m = mq + q·h (가너 방식의 CRT)
    return mq + q * h


if __name__ == "__main__":
    pub, priv = keygen(5, 11, 3)
    assert pub == (55, 3) and priv[1] == 27 and encrypt(2, pub) == 8 and decrypt(8, priv) == 2
    pub, priv = keygen(61, 53, 17)
    assert pub == (3233, 17) and priv[1] == 2753
    assert encrypt(65, pub) == 2790 and decrypt(2790, priv) == 65 == decrypt_crt(2790, priv)
    assert all(decrypt(encrypt(m, pub), priv) == m for m in range(3233))  # 서로소가 아닌 m도 포함
    rng = random.Random(31)
    p, q = random_prime(512, rng), random_prime(512, rng)
    pub, priv = keygen(p, q)
    for _ in range(20):
        m = rng.randrange(pub[0])
        c = encrypt(m, pub)
        assert decrypt(c, priv) == m == decrypt_crt(c, priv)
    for bad in (lambda: keygen(7, 7), lambda: keygen(5, 11, 5), lambda: encrypt(99, (55, 3))):
        try:
            bad()
            raise AssertionError("예외가 나야 한다")
        except ValueError:
            pass
    print("ALL CHECKS PASSED")
```
{% endraw %}
