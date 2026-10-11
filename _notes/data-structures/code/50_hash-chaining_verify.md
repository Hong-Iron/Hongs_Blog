---
layout: "note"
title: "50_hash-chaining_verify.py"
display_title: "50_hash-chaining_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "50"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/hash-chaining/"
parent_title: "체이닝"
description: "자료구조 · 체이닝 검증 코드"
permalink: "/studies/data-structures/code/50_hash-chaining_verify/"
---
{% raw %}
[체이닝](/Hongs_Blog/studies/data-structures/hash-chaining/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""체이닝에서 찾을 때 보는 노드 수: 슬라이드 그림의 정확한 값과 모의실험.

실행: python3 50_hash-chaining_verify.py
문서: 50.체이닝 (성능 절, 원본 오류 의심, 카드 C2~C3)
출처: 자료구조 15주차 슬라이드 p.31~32
세는 것은 체인에서 들여다본 노드 수다(버킷 칸 자체는 세지 않는다).

주장 (3~5는 실험으로 확인한 것이고 증명이 아니다)
  1. 슬라이드의 체인(키 12개, b = 17): 체인 길이의 평균은 12/17, 있는 키를 찾을 때 본 노드 수의 합은 18(평균 1.5).
  2. 있는 키를 찾을 때의 기댓값은 정확히 1 + (n - 1)/(2b)다(키가 버킷에 고르게 흩어진다고 볼 때).
     n이 크면 슬라이드의 1 + a/2가 된다. 모의실험 값과 2% 안에서 맞는다.
  3. 체인 길이의 평균은 a다.
  4. 없는 키를 찾을 때: 체인을 끝까지 훑으면 평균 a개를 본다(슬라이드의 U_n ~ a).
  5. 정렬된 체인에서 "찾는 키보다 큰 노드에서 멈춘다"로 세면 더 적다.
     a = 3이면 약 2.18개로, a/2 + 1 - (1 - e^-a)/a와 2% 안에서 맞는다. a가 작으면(0.5) 둘의 차이는 거의 없다.
"""
import math
import random


def build(keys, b):
    chains = [[] for _ in range(b)]
    for k in keys:
        chains[k % b].append(k)
    for c in chains:
        c.sort()
    return chains


def nodes_success(chains, k):
    return chains[k % len(chains)].index(k) + 1


def nodes_fail_full(chains, k):
    """정렬하지 않은 체인처럼 끝까지 훑는다."""
    return len(chains[k % len(chains)])


def nodes_fail_sorted(chains, k):
    """정렬된 체인: 찾는 키보다 큰 노드를 만나면 그 노드까지만 보고 멈춘다."""
    count = 0
    for x in chains[k % len(chains)]:
        count += 1
        if x > k:
            break
    return count


def predicted_sorted(a):
    return a / 2 + 1 - (1 - math.exp(-a)) / a


def simulate(b, alpha, trials, rng):
    n = int(alpha * b)
    universe = 10 ** 9
    s = full = srt = length = 0.0
    for _ in range(trials):
        keys = rng.sample(range(universe), n)
        chains = build(keys, b)
        present = set(keys)
        s += sum(nodes_success(chains, k) for k in keys) / n
        length += sum(len(c) for c in chains) / b
        misses = []
        while len(misses) < 2000:
            k = rng.randrange(universe)
            if k not in present:
                misses.append(k)
        full += sum(nodes_fail_full(chains, k) for k in misses) / len(misses)
        srt += sum(nodes_fail_sorted(chains, k) for k in misses) / len(misses)
    return s / trials, full / trials, srt / trials, length / trials, n


if __name__ == "__main__":
    # 1. 슬라이드의 체인
    slide_keys = [6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45]
    chains = build(slide_keys, 17)
    assert [c for c in chains if c] == [[0, 34], [6, 23], [7], [11, 28, 45], [12, 29], [30], [33]]
    assert sum(nodes_success(chains, k) for k in slide_keys) == 18
    assert sum(len(c) for c in chains) / 17 == 12 / 17
    # 카드 C2: 이 표에서 없는 키를 찾을 때. 홈 버킷 17곳의 체인 길이 평균 = 12/17
    assert sum(len(c) for c in chains) == 12

    # 2~5. 모의실험
    rng = random.Random(50)
    b = 2003
    out = {}
    for alpha in (0.5, 1.0, 3.0):
        s, full, srt, length, n = simulate(b, alpha, 20, rng)
        out[alpha] = (s, full, srt)
        exact_s = 1 + (n - 1) / (2 * b)
        assert abs(s - exact_s) / exact_s < 0.02
        assert abs(exact_s - (1 + alpha / 2)) < 0.01
        assert abs(length - n / b) < 1e-9
        assert abs(full - alpha) / alpha < 0.03
        assert abs(srt - predicted_sorted(alpha)) / predicted_sorted(alpha) < 0.03
        assert srt <= full
    assert out[3.0][2] < 2.3 and out[3.0][1] > 2.9          # 2.18쯤 대 3쯤
    assert out[0.5][1] - out[0.5][2] < 0.05                 # a가 작으면 차이가 거의 없다

    # 카드 C3: a = 2일 때 식의 값
    assert 1 + 2 / 2 == 2.0

    for alpha in (0.5, 1.0, 3.0):
        s, full, srt = out[alpha]
        print(f"a = {alpha}: 있는 키 {s:.2f} (식 {1 + alpha / 2:.2f}), 없는 키 끝까지 {full:.2f} (식 {alpha:.2f}), "
              f"정렬된 체인에서 멈추기 {srt:.2f} (어림 {predicted_sorted(alpha):.2f})")
    print("ALL CHECKS PASSED")
```
{% endraw %}
