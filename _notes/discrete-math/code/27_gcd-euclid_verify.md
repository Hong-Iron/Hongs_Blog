---
layout: "note"
title: "27_gcd-euclid_verify.py"
display_title: "27_gcd-euclid_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/gcd-euclid/"
parent_title: "최대공약수와 유클리드 호제법"
description: "이산수학 · 최대공약수와 유클리드 호제법 검증 코드"
permalink: "/studies/discrete-math/code/27_gcd-euclid_verify/"
---
{% raw %}
[최대공약수와 유클리드 호제법](/Hongs_Blog/studies/discrete-math/gcd-euclid/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""최대공약수와 유클리드 호제법 검증.

문서: 27.최대공약수와 유클리드 호제법 (예시, 추적 표, 원리, 베주, 증명, 예제, 활용, 오해, 카드 C1~C4),
      4.연습문제/27.유클리드 호제법 예제 사다리
주장 1: 원리 — gcd(a, b) = gcd(b, a mod b): 공약수 집합이 같다(a, b <= 150 전수).
주장 2: 추적 표 — 252, 105의 (q, r, s, t) 줄과 21 = 252·(-2) + 105·5, 마지막 줄 (5, -12).
주장 3: 베주 — gcd는 as + bt 꼴의 가장 작은 양의 정수(|s|, |t| <= 60 전수, a, b <= 40).
주장 4: 속도 — 나눗셈 횟수 <= 2 lg b + 2 (b <= 3000 전수, a <= 3000). 피보나치 쌍의 횟수, gcd(89, 55)는 9번.
주장 5: 예제 — 252x + 105y = 63의 해 (-6, 15), 모든 해가 (-6 + 5k, 15 - 12k) (범위 전수).
         ax + by = c의 해가 있는 것 <=> gcd | c (전수).
주장 6: 카드 — C1 1071, 462의 줄, C4 (240, 46) -> (-9, 47). 오해 — gcd(105, 252)는 한 번 더 나눠 같은 답.
주장 7: 활용 — 1920:1080 -> 16:9, pow(a, -1, m)이 베주 계수 s와 합동.
주장 8: 사다리 — (1071, 462) -> (-3, 7), 12x + 18y = 30 -> (-5, 5), 91x + 35y = 14 -> (4, -10), 91x + 35y = 10은 해 없음.
"""
import math


def ext_gcd(a, b):
    r0, s0, t0, r1, s1, t1 = a, 1, 0, b, 0, 1
    rows = []
    while r1:
        q = r0 // r1
        r0, r1 = r1, r0 - q * r1
        s0, s1 = s1, s0 - q * s1
        t0, t1 = t1, t0 - q * t1
        rows.append((q, r1, s1, t1))
    return (r0, s0, t0), rows


def steps(a, b):
    n = 0
    while b:
        a, b = b, a % b
        n += 1
    return n


def divisors(n):
    return {d for d in range(1, n + 1) if n % d == 0} if n else None


def main():
    for a in range(0, 151):
        for b in range(1, 151):
            common1 = {d for d in range(1, 151) if a % d == 0 and b % d == 0}
            r = a % b
            common2 = {d for d in range(1, 151) if b % d == 0 and r % d == 0}
            assert common1 == common2 and max(common1) == math.gcd(a, b)
    print("[OK] 주장 1·카드 C3: 공약수 집합이 같다")

    (g, s, t), rows = ext_gcd(252, 105)
    assert (g, s, t) == (21, -2, 5) and rows == [(2, 42, 1, -2), (2, 21, -2, 5), (2, 0, 5, -12)]
    assert 252 * 5 + 105 * -12 == 0
    print("[OK] 주장 2: 추적 표")

    for a in range(1, 41):
        for b in range(1, 41):
            combos = {a * s + b * t for s in range(-60, 61) for t in range(-60, 61)}
            assert min(c for c in combos if c > 0) == math.gcd(a, b)
    print("[OK] 주장 3: 가장 작은 양의 결합")

    for b in range(1, 3001):
        for a in range(0, 3001, 7):
            assert steps(a, b) <= 2 * math.log2(b) + 2
    fib = [1, 1]
    while len(fib) < 30:
        fib.append(fib[-1] + fib[-2])
    assert steps(89, 55) == 9 and [steps(fib[i + 1], fib[i]) for i in range(3, 12)] == list(range(3, 12))
    print("[OK] 주장 4: 나눗셈 횟수의 한계와 피보나치")

    assert 252 * -6 + 105 * 15 == 63
    sols = {(x, y) for x in range(-200, 201) for y in range(-400, 401) if 252 * x + 105 * y == 63}
    assert sols == {(-6 + 5 * k, 15 - 12 * k) for k in range(-100, 100) if -200 <= -6 + 5 * k <= 200 and -400 <= 15 - 12 * k <= 400}
    for a in range(1, 13):
        for b in range(1, 13):
            for c in range(-20, 21):
                has = any(a * x + b * y == c for x in range(-30, 31) for y in range(-30, 31))
                assert has == (c % math.gcd(a, b) == 0)
    print("[OK] 주장 5: 일차 부정방정식")

    rows = []
    a, b = 1071, 462
    while b:
        rows.append((a, b, a // b, a % b))
        a, b = b, a % b
    assert rows == [(1071, 462, 2, 147), (462, 147, 3, 21), (147, 21, 7, 0)]
    assert ext_gcd(240, 46)[0] == (2, -9, 47) and 240 * -9 + 46 * 47 == 2
    assert math.gcd(105, 252) == 21 and steps(105, 252) == steps(252, 105) + 1
    print("[OK] 주장 6·카드 C1·C4·오해")

    g = math.gcd(1920, 1080)
    assert g == 120 and (1920 // g, 1080 // g) == (16, 9)
    for a, m in ((7, 26), (17, 3120), (3, 40)):
        (g, s, t), _ = ext_gcd(a, m)
        assert g == 1 and pow(a, -1, m) == s % m
    print("[OK] 주장 7: 활용")

    assert ext_gcd(1071, 462)[0] == (21, -3, 7)
    assert ext_gcd(12, 18)[0] == (6, -1, 1) and 12 * -5 + 18 * 5 == 30
    assert ext_gcd(91, 35)[0] == (7, 2, -5) and 91 * 4 + 35 * -10 == 14
    assert 10 % 7 != 0 and not any(91 * x + 35 * y == 10 for x in range(-100, 101) for y in range(-100, 101))
    print("[OK] 주장 8: 사다리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
