---
layout: "note"
title: "49_linear-probing_verify.py"
display_title: "49_linear-probing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "49"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/linear-probing/"
parent_title: "선형 탐사"
description: "자료구조 · 선형 탐사 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/49_linear-probing_verify/"
---
{% raw %}
[선형 탐사](/Hongs_Blog/studies/data-structures/linear-probing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형 탐사에서 찾을 때 보는 버킷 수: 슬라이드 표의 정확한 값과 큰 표의 모의실험.

실행: python3 49_linear-probing_verify.py
문서: 49.선형 탐사 (성능 절, 카드 C4~C5)
출처: 자료구조 15주차 슬라이드 p.21, p.25~27

주장
  1. 슬라이드의 표(키 12개, b = 17): 있는 키를 찾을 때 보는 버킷 수의 합은 29(평균 29/12 = 2.42),
     없는 키를 찾을 때는 홈 버킷 17곳에 대한 합이 68(평균 4)이다.
  2. 슬라이드의 식 S_n = (1 + 1/(1 - a))/2, U_n = (1 + 1/(1 - a)^2)/2의 값:
     a = 0.50 -> 1.5, 2.5 / a = 0.75 -> 2.5, 8.5 / a = 0.90 -> 5.5, 50.5.
  3. 큰 표(b = 20,011)에 무작위 키를 넣어 잰 평균이 위 식과 가깝다.
     a = 0.5, 0.75는 5% 안, a = 0.9는 15% 안 (실험으로 확인한 것이고 증명이 아니다).
  4. 모든 키가 한 뭉치에 들어가면 없는 키를 찾을 때 n + 1개까지 본다 (p.25의 최악).
"""
import random
from fractions import Fraction


def build(keys, b):
    table = [None] * b
    for k in keys:
        i = k % b
        while table[i] is not None:
            if table[i] == k:
                break
            i = (i + 1) % b
        table[i] = k
    return table


def probes_success(table, k):
    b = len(table)
    i = k % b
    count = 1
    while table[i] != k:
        i = (i + 1) % b
        count += 1
    return count


def probes_fail_from(table, home):
    """홈 버킷이 home인 없는 키를 찾을 때 보는 버킷 수(빈 버킷까지 포함)."""
    b = len(table)
    i = home
    count = 1
    while table[i] is not None:
        i = (i + 1) % b
        count += 1
        if count > b:
            return b
    return count


def all_fail_probes(table):
    """모든 홈 버킷에 대해 probes_fail_from을 한 번에 구한다(뒤에서부터 채운다)."""
    b = len(table)
    first_empty = next(i for i in range(b) if table[i] is None)
    out = [0] * b
    run = 0
    for step in range(b):
        i = (first_empty - step) % b
        run = 1 if table[i] is None else run + 1
        out[i] = run
    return out


def S(a):
    return (1 + 1 / (1 - a)) / 2


def U(a):
    return (1 + 1 / (1 - a) ** 2) / 2


def simulate(b, alpha, trials, rng):
    n = int(alpha * b)
    s_total = u_total = 0.0
    for _ in range(trials):
        keys = rng.sample(range(10 ** 9), n)
        table = build(keys, b)
        s_total += sum(probes_success(table, k) for k in keys) / n
        u_total += sum(all_fail_probes(table)) / b
    return s_total / trials, u_total / trials


if __name__ == "__main__":
    # 1. 슬라이드의 표
    slide_keys = [6, 12, 34, 29, 28, 11, 23, 7, 0, 33, 30, 45]
    t = build(slide_keys, 17)
    assert t == [34, 0, 45, None, None, None, 6, 23, 7, None, None, 28, 12, 29, 11, 30, 33]
    per_key = {k: probes_success(t, k) for k in slide_keys}
    assert per_key == {6: 1, 12: 1, 34: 1, 29: 2, 28: 1, 11: 4, 23: 2, 7: 2, 0: 2, 33: 1, 30: 3, 45: 9}
    assert sum(per_key.values()) == 29
    fails = [probes_fail_from(t, h) for h in range(17)]
    assert fails == all_fail_probes(t)
    assert fails == [4, 3, 2, 1, 1, 1, 4, 3, 2, 1, 1, 10, 9, 8, 7, 6, 5] and sum(fails) == 68
    a = Fraction(12, 17)
    assert (1 + 1 / (1 - a)) / 2 == Fraction(11, 5)                 # 2.2
    assert (1 + 1 / (1 - a) ** 2) / 2 == Fraction(157, 25)          # 6.28

    # 2. 식의 값
    assert [(S(x), U(x)) for x in (0.5, 0.75)] == [(1.5, 2.5), (2.5, 8.5)]
    assert abs(S(0.9) - 5.5) < 1e-9 and abs(U(0.9) - 50.5) < 1e-9

    # 3. 모의실험
    rng = random.Random(49)
    b = 20011
    measured = {}
    for alpha, trials, tol in ((0.5, 10, 0.05), (0.75, 10, 0.05), (0.9, 30, 0.15)):
        s, u = simulate(b, alpha, trials, rng)
        measured[alpha] = (s, u)
        assert abs(s - S(alpha)) / S(alpha) < tol, (alpha, s)
        assert abs(u - U(alpha)) / U(alpha) < tol, (alpha, u)

    # 4. 한 뭉치: 홈 버킷이 모두 3인 키 5개를 b = 11에 넣으면 버킷 3..7이 한 뭉치
    one = build([3, 14, 25, 36, 47], 11)
    assert one[3:8] == [3, 14, 25, 36, 47]
    assert probes_fail_from(one, 3) == 6 and probes_success(one, 47) == 5

    # 카드 C5: a = 0.8
    assert abs(S(0.8) - 3.0) < 1e-9 and abs(U(0.8) - 13.0) < 1e-9

    print("슬라이드 표: 있는 키 평균 29/12 = 2.42, 없는 키 평균 68/17 = 4 (식의 값 2.2, 6.28)")
    for alpha in (0.5, 0.75, 0.9):
        s, u = measured[alpha]
        print(f"a = {alpha}: 잰 값 S = {s:.2f}, U = {u:.2f} / 식 S = {S(alpha):.2f}, U = {U(alpha):.2f}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
