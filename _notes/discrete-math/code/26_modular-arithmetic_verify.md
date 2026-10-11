---
layout: "note"
title: "26_modular-arithmetic_verify.py"
display_title: "26_modular-arithmetic_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/modular-arithmetic/"
parent_title: "나눗셈과 합동"
description: "이산수학 · 나눗셈과 합동 검증 코드"
permalink: "/studies/discrete-math/code/26_modular-arithmetic_verify/"
---
{% raw %}
[나눗셈과 합동](/Hongs_Blog/studies/discrete-math/modular-arithmetic/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""나눗셈과 합동 검증.

문서: 26.나눗셈과 합동 (예시, 정의, 증명, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 나눗셈 정리 — |a| <= 200, 1 <= d <= 30에서 조건을 만족하는 (q, r)이 정확히 하나(전수).
주장 2: 동치 정의 — m | (a - b) <=> a mod m = b mod m (전수).
주장 3: 맞물림 — 합·차·곱·거듭제곱이 합동을 보존(무작위 1만 쌍). ac - bd = a(c-d) + d(a-b).
주장 4: 소거 실패 — 2·3 ≡ 2·0 (mod 6), 3 ≢ 0. gcd(c, m) = 1이면 소거 가능(전수, m <= 30).
주장 5: 예시 — 2026-09-25는 금요일, 100일 뒤 일요일, 1000일 뒤 목요일. 123456789·987654321 ≡ 0 (mod 9).
주장 6: 예제 — ISBN 0-306-40615-2의 가중합 132 ≡ 0 (mod 11). 모든 한 자리 오류와 이웃 자리 바꿈(값이 다를 때)이 검출된다.
주장 7: 활용·오해 — Python -7 % 3 = 2, C식(0 쪽으로 버림) 나머지 -1, ((a % m) + m) % m 보정. 32비트 오버플로는 mod 2^32. a mod 2^k = a & (2^k - 1).
주장 8: 정의의 예 — 38 ≡ 14 (mod 12), -7 ≡ 2 (mod 3), 10 ≡ 0 (mod 5), 7 ≢ 2 (mod 3).
"""
import datetime
import math
import random


def main():
    for a in range(-200, 201):
        for d in range(1, 31):
            sols = [(q, a - d * q) for q in range(-201, 202) if 0 <= a - d * q < d]
            assert len(sols) == 1 and sols[0] == (a // d, a % d)
    print("[OK] 주장 1·카드 C1: 나눗셈 정리의 존재와 유일성")

    for m in range(1, 25):
        for a in range(-50, 51):
            for b in range(-50, 51, 7):
                assert ((a - b) % m == 0) == (a % m == b % m)
    print("[OK] 주장 2: 동치 정의")

    rng = random.Random(26)
    for _ in range(10000):
        m = rng.randint(1, 1000)
        a, c = rng.randint(-10 ** 6, 10 ** 6), rng.randint(-10 ** 6, 10 ** 6)
        b, d = a + m * rng.randint(-50, 50), c + m * rng.randint(-50, 50)
        k = rng.randint(0, 20)
        assert (a + c - (b + d)) % m == 0 and (a - c - (b - d)) % m == 0
        assert (a * c - b * d) % m == 0 and (a ** k - b ** k) % m == 0
        assert a * c - b * d == a * (c - d) + d * (a - b)
    print("[OK] 주장 3·카드 C4: 맞물림")

    assert (2 * 3 - 2 * 0) % 6 == 0 and (3 - 0) % 6 != 0
    for m in range(1, 31):
        for c in range(1, m + 1):
            if math.gcd(c, m) == 1:
                for a in range(m):
                    for b in range(m):
                        if (a * c - b * c) % m == 0:
                            assert a == b
    print("[OK] 주장 4·카드 C3: 소거의 조건")

    d = datetime.date(2026, 9, 25)
    assert d.weekday() == 4
    assert (d + datetime.timedelta(100)).weekday() == 6 and (d + datetime.timedelta(1000)).weekday() == 3
    assert 100 % 7 == 2 and 1000 % 7 == 6 and 1000 == 7 * 142 + 6
    assert sum(map(int, "123456789")) == 45 and (123456789 * 987654321) % 9 == 0
    print("[OK] 주장 5·카드 C2: 요일과 자릿수 합")

    isbn = [0, 3, 0, 6, 4, 0, 6, 1, 5, 2]
    w = lambda ds: sum((10 - i) * x for i, x in enumerate(ds))
    assert w(isbn) == 132 and w(isbn) % 11 == 0
    for i in range(10):
        for v in range(10):
            if v != isbn[i]:
                bad = isbn[:]
                bad[i] = v
                assert w(bad) % 11 != 0
    for i in range(9):
        if isbn[i] != isbn[i + 1]:
            bad = isbn[:]
            bad[i], bad[i + 1] = bad[i + 1], bad[i]
            assert w(bad) % 11 != 0
    print("[OK] 주장 6: ISBN 예제와 오류 검출")

    assert -7 % 3 == 2 and -7 // 3 == -3 and math.fmod(-7, 3) == -1.0
    c_rem = lambda a, m: int(math.copysign(abs(a) % m, a))  # 0 쪽으로 버리는 C식 나머지
    for a in range(-40, 41):
        for m in range(1, 12):
            assert ((c_rem(a, m) + m) % m) == a % m
    MASK = 2 ** 32
    for _ in range(1000):
        x, y = rng.randrange(MASK), rng.randrange(MASK)
        assert ((x + y) & (MASK - 1)) == (x + y) % MASK and ((x * y) & (MASK - 1)) == (x * y) % MASK
        k = rng.randint(1, 20)
        assert x % 2 ** k == x & (2 ** k - 1)
    print("[OK] 주장 7·오해: 음수 나머지, 오버플로, 비트 마스크")

    assert (38 - 14) % 12 == 0 and (-7 - 2) % 3 == 0 and 10 % 5 == 0 and (7 - 2) % 3 != 0
    print("[OK] 주장 8: 정의의 예")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
