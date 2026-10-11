---
layout: "note"
title: "52_load-factor-design_verify.py"
display_title: "52_load-factor-design_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "52"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/load-factor-design/"
parent_title: "적재율로 해시 테이블 크기 정하기"
description: "자료구조 · 적재율로 해시 테이블 크기 정하기 검증 코드"
permalink: "/studies/data-structures/code/52_load-factor-design_verify/"
---
{% raw %}
[적재율로 해시 테이블 크기 정하기](/Hongs_Blog/studies/data-structures/load-factor-design/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""적재율로 해시 테이블 크기 정하기: 식 풀기, 버킷 수 고르기, 두 배로 늘려 다시 넣기.

실행: python3 52_load-factor-design_verify.py
문서: 52.적재율로 해시 테이블 크기 정하기 (예제, 카드 C1~C3)
출처: 자료구조 15주차 슬라이드 p.26~29

주장
  1. S_n = (1 + 1/(1 - a))/2 <= 10 은 a <= 18/19 와 같고,
     U_n = (1 + 1/(1 - a)^2)/2 <= 13 은 a <= 4/5 와 같다. 둘 다 지키려면 a <= 4/5 (분수로 정확히).
  2. 일반 꼴: S_n <= s 는 a <= 1 - 1/(2s - 1), U_n <= u 는 a <= 1 - 1/sqrt(2u - 1).
  3. 쌍이 많아야 1,000개이고 a <= 4/5 이면 b >= 1,250. 1,250 이상에서 가장 작은 소수는 1,259,
     소수가 아니면서 20보다 작은 소인수가 없는 가장 작은 홀수는 1,271 = 31 * 41.
  4. b = 1,259에 키 1,000개를 넣은 선형 탐사(무작위 100번)에서 있는 키는 평균 3번 안쪽,
     없는 키는 평균 13번 안쪽으로 본다 (실험으로 확인한 것이고 증명이 아니다).
  5. 적재율이 4/5를 넘을 때마다 버킷 수를 2b + 1로 늘려 다시 넣으면, 키 n개를 넣는 동안
     다시 넣은 횟수의 합이 2n보다 작다(n = 100 ~ 100,000).
  6. 카드의 답.
"""
import math
import random
from fractions import Fraction


def S(a):
    return (1 + 1 / (1 - a)) / 2


def U(a):
    return (1 + 1 / (1 - a) ** 2) / 2


def smallest_prime_factor(m):
    d = 2
    while d * d <= m:
        if m % d == 0:
            return d
        d += 1
    return m


def build(keys, b):
    table = [None] * b
    for k in keys:
        i = k % b
        while table[i] is not None:
            i = (i + 1) % b
        table[i] = k
    return table


def avg_probes(table, keys):
    b = len(table)
    total = 0
    for k in keys:
        i, c = k % b, 1
        while table[i] != k:
            i = (i + 1) % b
            c += 1
        total += c
    first_empty = next(i for i in range(b) if table[i] is None)
    run = fail = 0
    for step in range(b):
        i = (first_empty - step) % b
        run = 1 if table[i] is None else run + 1
        fail += run
    return total / len(keys), fail / b


def grow_and_count(n, b0=5, limit=Fraction(4, 5)):
    """키를 하나씩 넣다가 적재율이 limit를 넘으면 2b + 1칸으로 옮긴다. (마지막 b, 다시 넣은 횟수, 늘린 횟수)"""
    b, stored, moved, grows = b0, 0, 0, 0
    for _ in range(n):
        stored += 1
        if Fraction(stored, b) > limit:
            b = 2 * b + 1
            moved += stored            # 지금까지의 키를 모두 새 표에 다시 넣는다
            grows += 1
    return b, moved, grows


if __name__ == "__main__":
    # 1. 슬라이드의 두 조건
    a1, a2 = Fraction(18, 19), Fraction(4, 5)
    assert S(a1) == 10 and U(a2) == 13
    eps = Fraction(1, 10 ** 6)
    assert S(a1 - eps) < 10 < S(a1 + eps)                 # a가 커지면 S도 커진다: 경계가 18/19
    assert U(a2 - eps) < 13 < U(a2 + eps)
    assert min(a1, a2) == a2
    assert S(a2) == 3                                     # a = 4/5에서 있는 키는 3번

    # 2. 일반 꼴
    for s in range(2, 60):
        bound = 1 - Fraction(1, 2 * s - 1)
        assert S(bound) == s
    for u in (1, 5, 13, 25, 41, 61):                      # 2u - 1이 제곱수인 값들
        r = math.isqrt(2 * u - 1)
        assert r * r == 2 * u - 1
        if r > 1:
            assert U(1 - Fraction(1, r)) == u

    # 3. 버킷 수
    need = Fraction(1000) / a2
    assert need == 1250
    b_prime = next(m for m in range(1250, 2000) if smallest_prime_factor(m) == m)
    assert b_prime == 1259
    b_odd = next(m for m in range(1250, 2000)
                 if m % 2 == 1 and smallest_prime_factor(m) != m and smallest_prime_factor(m) >= 20)
    assert b_odd == 1271 and 31 * 41 == 1271
    assert [smallest_prime_factor(m) for m in (1250, 1251, 1253, 1255, 1257)] == [2, 3, 7, 5, 3]

    # 4. b = 1,259에 1,000개
    rng = random.Random(52)
    s_sum = u_sum = 0.0
    for _ in range(100):
        keys = rng.sample(range(10 ** 9), 1000)
        s, u = avg_probes(build(keys, 1259), keys)
        s_sum += s
        u_sum += u
    s_avg, u_avg = s_sum / 100, u_sum / 100
    alpha = 1000 / 1259
    assert s_avg < 3 and u_avg < 13
    assert abs(s_avg - S(alpha)) / S(alpha) < 0.05 and abs(u_avg - U(alpha)) / U(alpha) < 0.10

    # 5. 두 배로 늘려 다시 넣기
    for n in (100, 1000, 10000, 100000):
        b, moved, grows = grow_and_count(n)
        assert moved < 2 * n and Fraction(n, b) <= a2
    b, moved, grows = grow_and_count(1000)
    assert (b, moved, grows) == (1535, 1222, 8)

    # 6. 카드
    # C1: 있는 키 6번 이하 -> a <= 10/11, 없는 키 5번 이하 -> a <= 2/3. 둘 다면 2/3
    assert 1 - Fraction(1, 2 * 6 - 1) == Fraction(10, 11) and U(Fraction(2, 3)) == 5
    # C2: 쌍 600개, a <= 2/3 -> b >= 900. 900 이상의 가장 작은 소수는 907
    assert Fraction(600) / Fraction(2, 3) == 900
    assert next(m for m in range(900, 1000) if smallest_prime_factor(m) == m) == 907
    # C3: a = 0.75의 U = 8.5, a = 0.9의 U = 50.5. 쌍 1,000개에 필요한 버킷은 1,334개와 1,112개
    assert U(Fraction(3, 4)) == Fraction(17, 2) and U(Fraction(9, 10)) == Fraction(101, 2)
    assert math.ceil(Fraction(1000) / Fraction(3, 4)) == 1334
    assert math.ceil(Fraction(1000) / Fraction(9, 10)) == 1112
    assert [smallest_prime_factor(m) for m in (901, 903, 905)] == [17, 3, 5]

    print("a <= min(18/19, 4/5) = 4/5, b >= 1,250 -> 소수 1,259 (또는 1,271 = 31 * 41)")
    print(f"b = 1,259, 키 1,000개: 있는 키 {s_avg:.2f}번 (식 {S(alpha):.2f}), 없는 키 {u_avg:.2f}번 (식 {U(alpha):.2f})")
    print(f"두 배로 늘리기: 키 1,000개에 늘리기 {grows}번, 다시 넣기 {moved}번, 마지막 b = {b}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
