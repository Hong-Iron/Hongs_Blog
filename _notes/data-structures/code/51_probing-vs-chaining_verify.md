---
layout: "note"
title: "51_probing-vs-chaining_verify.py"
display_title: "51_probing-vs-chaining_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "51"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/probing-vs-chaining/"
parent_title: "선형 탐사와 체이닝 비교"
description: "자료구조 · 선형 탐사와 체이닝 비교 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/51_probing-vs-chaining_verify/"
---
{% raw %}
[선형 탐사와 체이닝 비교](/Hongs_Blog/studies/data-structures/probing-vs-chaining/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형 탐사와 체이닝을 같은 키로 채워 찾는 수고를 견준다.

실행: python3 51_probing-vs-chaining_verify.py
문서: 51.선형 탐사와 체이닝 비교 (결정적 차이 표, 카드 C1~C3)
세는 것: 선형 탐사는 들여다본 버킷 수, 체이닝은 들여다본 체인 노드 수(끝까지 훑는다).

주장 (실험으로 확인한 것이고 증명이 아니다)
  1. 같은 키, 같은 버킷 수에서 적재율 0.5, 0.75, 0.9마다
     선형 탐사는 문서의 식 (1 + 1/(1 - a))/2, (1 + 1/(1 - a)^2)/2에,
     체이닝은 1 + a/2, a에 가깝다.
  2. 적재율이 오를수록 선형 탐사의 "없는 키 찾기"만 가파르게 는다(0.9에서 체이닝의 50배쯤).
  3. 문서 예시의 키 12개(b = 17): 있는 키 평균은 선형 탐사 29/12, 체이닝 18/12.
  4. 체이닝은 키가 버킷보다 많아도(a = 3) 돌아간다. 선형 탐사는 a가 1을 넘을 수 없다.
"""
import random


def build_probing(keys, b):
    table = [None] * b
    for k in keys:
        i = k % b
        while table[i] is not None:
            i = (i + 1) % b
        table[i] = k
    return table


def probing_success(table, k):
    b = len(table)
    i, count = k % b, 1
    while table[i] != k:
        i = (i + 1) % b
        count += 1
    return count


def probing_fail_all(table):
    b = len(table)
    first_empty = next(i for i in range(b) if table[i] is None)
    out = [0] * b
    run = 0
    for step in range(b):
        i = (first_empty - step) % b
        run = 1 if table[i] is None else run + 1
        out[i] = run
    return out


def build_chains(keys, b):
    chains = [[] for _ in range(b)]
    for k in keys:
        chains[k % b].append(k)
    return chains


def measure(b, alpha, trials, rng):
    n = int(alpha * b)
    ps = pu = cs = cu = 0.0
    for _ in range(trials):
        keys = rng.sample(range(10 ** 9), n)
        table = build_probing(keys, b)
        chains = build_chains(keys, b)
        ps += sum(probing_success(table, k) for k in keys) / n
        pu += sum(probing_fail_all(table)) / b
        cs += sum(chains[k % b].index(k) + 1 for k in keys) / n
        cu += sum(len(c) for c in chains) / b            # 홈 버킷이 고르면 평균 체인 길이
    return ps / trials, pu / trials, cs / trials, cu / trials


if __name__ == "__main__":
    rng = random.Random(51)
    b = 20011
    rows = {}
    for alpha, trials, tol in ((0.5, 10, 0.05), (0.75, 10, 0.05), (0.9, 30, 0.15)):
        ps, pu, cs, cu = measure(b, alpha, trials, rng)
        rows[alpha] = (ps, pu, cs, cu)
        assert abs(ps - (1 + 1 / (1 - alpha)) / 2) / ps < tol
        assert abs(pu - (1 + 1 / (1 - alpha) ** 2) / 2) / pu < tol
        assert abs(cs - (1 + alpha / 2)) < 0.02
        assert abs(cu - alpha) < 0.01
        assert cs < ps and cu < pu                        # 세는 단위는 다르지만 수는 체이닝이 작다

    # 2. 가파르게 느는 것은 선형 탐사의 없는 키 찾기
    assert rows[0.9][1] / rows[0.5][1] > 15               # 2.5쯤 -> 48쯤
    assert rows[0.9][3] / rows[0.5][3] < 2                # 0.5 -> 0.9
    assert 40 < rows[0.9][1] / rows[0.9][3] < 65

    # 3. 문서 예시의 키
    slide_keys = [6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45]
    table = build_probing(slide_keys, 17)
    chains = build_chains(sorted(slide_keys), 17)
    assert sum(probing_success(table, k) for k in slide_keys) == 29
    assert sum(chains[k % 17].index(k) + 1 for k in slide_keys) == 18

    # 4. a = 3인 체이닝
    keys = rng.sample(range(10 ** 9), 3 * 2003)
    chains = build_chains(keys, 2003)
    assert sum(len(c) for c in chains) == 3 * 2003
    assert abs(sum(chains[k % 2003].index(k) + 1 for k in keys) / len(keys) - 2.5) < 0.05

    print("적재율 | 선형 탐사 있는 키, 없는 키 | 체이닝 있는 키, 없는 키")
    for alpha in (0.5, 0.75, 0.9):
        ps, pu, cs, cu = rows[alpha]
        print(f"{alpha:5} | {ps:5.2f} {pu:6.2f} | {cs:5.2f} {cu:5.2f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
