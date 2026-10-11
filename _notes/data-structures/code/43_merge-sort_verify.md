---
layout: "note"
title: "43_merge-sort_verify.py"
display_title: "43_merge-sort_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "43"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/merge-sort/"
parent_title: "병합 정렬"
description: "자료구조 · 병합 정렬 검증 코드"
permalink: "/studies/data-structures/code/43_merge-sort_verify/"
---
{% raw %}
[병합 정렬](/Hongs_Blog/studies/data-structures/merge-sort/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""병합 정렬의 횟수 세기 검증.

실행: python3 43_merge-sort_verify.py
문서: 43.병합 정렬 (합치기 추적 표, 복잡도 절, 카드 C1~C3)
출처: 자료구조 14주차 슬라이드 p.19~25

주장
  1. A = (2, 5, 6), B = (1, 3, 8, 9, 10)을 합칠 때 한 개씩 옮긴 뒤의 A, B, C가 슬라이드와 같다.
     비교는 5번, 옮기기는 8번이다.
  2. 길이 n, m인 두 줄을 합칠 때 비교는 min(n, m)번 이상 n + m - 1번 이하, 옮기기는 n + m번이다
     (무작위 3,000쌍).
  3. 점화식 t(n) = t(ceil(n/2)) + t(floor(n/2)) + dn, t(0) = t(1) = c:
     n = 2^k이면 정확히 cn + dn lg n, 모든 n <= 5,000에서 cn + dn * ceil(lg n) 이하다.
  4. 13개짜리 예: 조각 크기가 13 -> 7 + 6 -> (4 + 3) + (3 + 3) ..., 합치기는 12번, 재귀 깊이는 4.
  5. 같은 값끼리는 처음 순서가 지켜진다(안정 정렬). 무작위 2,000개.
  6. 비교 횟수는 어떤 입력에서도 n * ceil(lg n) 이하다(n = 1,000, 입력 300개 + 정렬됨 + 역순).
"""
import math
import random


def merge_steps(A, B):
    """맨 앞끼리 견주어 작은 쪽을 옮긴다. 한 개 옮길 때마다 (A, B, C)를 적는다."""
    A, B, C = list(A), list(B), []
    steps = []
    cmp_count = 0
    while A and B:
        cmp_count += 1
        if key(B[0]) < key(A[0]):
            C.append(B.pop(0))
        else:
            C.append(A.pop(0))
        steps.append((tuple(A), tuple(B), tuple(C)))
    C.extend(A)
    C.extend(B)
    return C, cmp_count, steps


def key(x):
    return x[0] if isinstance(x, tuple) else x


def merge_sort(a, stat, depth=1):
    n = len(a)
    if n <= 1:
        return list(a)
    stat["depth"] = max(stat["depth"], depth)
    half = (n + 1) // 2                      # 앞 조각이 ceil(n/2)개
    stat["splits"].append((n, half, n - half))
    left = merge_sort(a[:half], stat, depth + 1)
    right = merge_sort(a[half:], stat, depth + 1)
    out, c, _ = merge_steps(left, right)
    stat["cmp"] += c
    stat["merges"] += 1
    stat["moves"] += n
    return out


def new_stat():
    return {"cmp": 0, "merges": 0, "moves": 0, "depth": 0, "splits": []}


def t_rec(n, c, d, memo):
    if n <= 1:
        return c
    if n not in memo:
        memo[n] = t_rec((n + 1) // 2, c, d, memo) + t_rec(n // 2, c, d, memo) + d * n
    return memo[n]


if __name__ == "__main__":
    # 1. 슬라이드 p.20~22
    C, cmp_count, steps = merge_steps((2, 5, 6), (1, 3, 8, 9, 10))
    assert C == [1, 2, 3, 5, 6, 8, 9, 10] and cmp_count == 5
    assert steps == [
        ((2, 5, 6), (3, 8, 9, 10), (1,)),
        ((5, 6), (3, 8, 9, 10), (1, 2)),
        ((5, 6), (8, 9, 10), (1, 2, 3)),
        ((6,), (8, 9, 10), (1, 2, 3, 5)),
        ((), (8, 9, 10), (1, 2, 3, 5, 6)),
    ]

    # 카드 C1: A = (1, 4, 7), B = (2, 3, 9, 10)에서 네 개를 옮긴 뒤
    C, cmp_count, steps = merge_steps((1, 4, 7), (2, 3, 9, 10))
    assert steps[3] == ((7,), (9, 10), (1, 2, 3, 4))
    assert C == [1, 2, 3, 4, 7, 9, 10] and cmp_count == 5

    # 2. 합치기의 비교 횟수
    rng = random.Random(43)
    for _ in range(3000):
        n, m = rng.randint(1, 12), rng.randint(1, 12)
        A = sorted(rng.randint(0, 30) for _ in range(n))
        B = sorted(rng.randint(0, 30) for _ in range(m))
        C, c, _ = merge_steps(A, B)
        assert C == sorted(A + B) and len(C) == n + m
        assert min(n, m) <= c <= n + m - 1
    # 양 끝이 실제로 나온다
    assert merge_steps((1, 2, 3), (4, 5, 6, 7))[1] == 3            # min(n, m)
    assert merge_steps((1, 3, 5), (2, 4, 6, 7))[1] == 5            # 한 줄이 먼저 비면 n + m - 1보다 적다
    assert merge_steps((1, 3, 5, 7), (2, 4, 6))[1] == 6            # n + m - 1

    # 3. 점화식
    c0, d0 = 3, 5
    memo = {}
    for k in range(0, 21):
        n = 2 ** k
        assert t_rec(n, c0, d0, memo) == c0 * n + d0 * n * k
    for n in range(2, 5001):
        assert t_rec(n, c0, d0, memo) <= c0 * n + d0 * n * math.ceil(math.log2(n))
    assert t_rec(8, 1, 1, {}) == 32                                # 카드 C3: 8 + 8 * 3

    # 4. 13개짜리 예 (p.23~24)
    stat = new_stat()
    a = [8, 3, 13, 6, 2, 14, 5, 9, 10, 1, 7, 12, 4]
    assert merge_sort(a, stat) == sorted(a)
    assert stat["splits"][:3] == [(13, 7, 6), (7, 4, 3), (4, 2, 2)]
    assert (6, 3, 3) in stat["splits"] and (3, 2, 1) in stat["splits"]
    assert stat["merges"] == 12 and stat["depth"] == 4
    cmp13 = stat["cmp"]
    assert cmp13 <= 13 * 4

    # 5. 안정 정렬
    for _ in range(2000):
        n = rng.randint(0, 40)
        a = [(rng.randint(0, 5), i) for i in range(n)]
        out = merge_sort(a, new_stat())
        assert out == sorted(a, key=lambda x: x[0])

    # 조건을 b[j] <= a[i]로 바꾸면 같은 값에서 뒤 조각의 것이 먼저 나온다(순서가 뒤집힌다)
    A, B, C = [(1, "a")], [(1, "b")], []
    while A and B:
        C.append(B.pop(0) if B[0][0] <= A[0][0] else A.pop(0))
    C += A + B
    assert C == [(1, "b"), (1, "a")]

    # 6. 비교 횟수의 위쪽 한계
    n = 1000
    bound = n * math.ceil(math.log2(n))
    worst = 0
    total = 0
    for _ in range(300):
        a = [rng.random() for _ in range(n)]
        stat = new_stat()
        merge_sort(a, stat)
        worst = max(worst, stat["cmp"])
        total += stat["cmp"]
    s_sorted, s_rev = new_stat(), new_stat()
    merge_sort(list(range(n)), s_sorted)
    merge_sort(list(range(n, 0, -1)), s_rev)
    assert max(worst, s_sorted["cmp"], s_rev["cmp"]) <= bound
    assert s_sorted["depth"] == 10 and s_sorted["merges"] == n - 1

    print("합치기 예: 비교 5번, 옮기기 8번")
    print(f"13개짜리 예: 합치기 12번, 비교 {cmp13}번, 재귀 깊이 4")
    print(f"1,000개: 무작위 평균 비교 {total / 300:,.0f}번, 정렬됨 {s_sorted['cmp']:,}번, "
          f"역순 {s_rev['cmp']:,}번, 한계 n*ceil(lg n) = {bound:,}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
