---
layout: "note"
title: "48_hash-function-division_verify.py"
display_title: "48_hash-function-division_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "48"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/hash-function-division/"
parent_title: "나눗셈 해시 함수"
description: "자료구조 · 나눗셈 해시 함수 검증 코드"
permalink: "/studies/data-structures/code/48_hash-function-division_verify/"
---
{% raw %}
[나눗셈 해시 함수](/Hongs_Blog/studies/data-structures/hash-function-division/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""나누는 수에 따라 홈 버킷이 얼마나 치우치는지 센다.

실행: python3 48_hash-function-division_verify.py
문서: 48.나눗셈 해시 함수 (치우침 표, 까닭, 카드 C2)
출처: 자료구조 15주차 슬라이드 p.13~19

주장
  1. b가 p의 배수이면 (k % b) % p == k % p다. 키의 "p로 나눈 나머지"가 버킷 번호에 그대로 남는다
     (k < 5,000, b <= 60 전수).
  2. 짝수 키 1,000개: b = 14이면 짝수 버킷 7개만 쓴다. b = 15, 17이면 모든 버킷을 쓴다.
  3. 5의 배수 키 1,000개: b = 15이면 버킷 3개(0, 5, 10)만 쓴다. b = 14, 17이면 모든 버킷을 쓴다.
  4. 홀수가 90%인 키 10,000개: b = 14이면 홀수 버킷에 90%가 몰리고, b = 15이면 절반쯤이다.
  5. 32비트 정수 전체에서는 어떤 b든 버킷마다 floor(2^32 / b) 또는 그보다 1개 많게 들어간다 (p.16).
  6. 슬라이드의 나머지 12개 (p.17~18).
"""
import random


def used_buckets(keys, b):
    return sorted({k % b for k in keys})


def loads(keys, b):
    out = [0] * b
    for k in keys:
        out[k % b] += 1
    return out


if __name__ == "__main__":
    # 1. 약수의 나머지가 남는다
    for b in range(2, 61):
        for p in range(2, b + 1):
            if b % p == 0:
                assert all((k % b) % p == k % p for k in range(5000))

    rng = random.Random(48)

    # 2. 짝수 키
    even_keys = [2 * rng.randrange(10 ** 6) for _ in range(1000)]
    assert used_buckets(even_keys, 14) == [0, 2, 4, 6, 8, 10, 12]
    assert len(used_buckets(even_keys, 15)) == 15
    assert len(used_buckets(even_keys, 17)) == 17
    max14, max15 = max(loads(even_keys, 14)), max(loads(even_keys, 15))

    # 3. 5의 배수 키
    five_keys = [5 * rng.randrange(10 ** 6) for _ in range(1000)]
    assert used_buckets(five_keys, 15) == [0, 5, 10]
    assert len(used_buckets(five_keys, 14)) == 14
    assert len(used_buckets(five_keys, 17)) == 17
    # 3의 배수 키는 b = 15에서 버킷 5개만
    three_keys = [3 * rng.randrange(10 ** 6) for _ in range(1000)]
    assert used_buckets(three_keys, 15) == [0, 3, 6, 9, 12]

    # 4. 홀수가 90%인 키
    biased = [2 * rng.randrange(10 ** 6) + (1 if rng.random() < 0.9 else 0) for _ in range(10000)]
    share14 = sum(loads(biased, 14)[1::2]) / len(biased)
    share15 = sum(loads(biased, 15)[1::2]) / len(biased)
    share_keys = sum(k % 2 for k in biased) / len(biased)
    assert share14 == share_keys and 0.88 < share14 < 0.92
    assert 0.42 < share15 < 0.52                         # 홀수 버킷은 15개 가운데 7개

    # 5. 32비트 정수 전체
    total = 2 ** 32
    for b in (7, 8, 14, 15, 17, 1000, 1259):
        counts = {(total - i + b - 1) // b for i in range(b)}   # 버킷 i에 들어가는 정수의 수
        assert counts <= {total // b, total // b + 1}
        assert sum((total - i + b - 1) // b for i in range(b)) == total

    # 6. 슬라이드의 나머지
    assert [k % 14 for k in (20, 30, 8, 15, 3, 23)] == [6, 2, 8, 1, 3, 9]
    assert [k % 15 for k in (20, 30, 8, 15, 3, 23)] == [5, 0, 8, 0, 3, 8]

    # 카드 C2: 키가 모두 10의 배수(10, 20, ..., 1000)일 때 쓰는 버킷 수
    tens = range(10, 1001, 10)
    assert len(used_buckets(tens, 20)) == 2 and len(used_buckets(tens, 25)) == 5
    assert len(used_buckets(tens, 23)) == 23

    print(f"짝수 키 1,000개: b = 14는 버킷 7개(가장 찬 버킷 {max14}개), b = 15는 15개(가장 찬 버킷 {max15}개)")
    print("5의 배수 키: b = 15는 버킷 0, 5, 10만 쓴다")
    print(f"홀수 90% 키: 홀수 버킷 몫 b = 14에서 {share14:.2f}, b = 15에서 {share15:.2f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
