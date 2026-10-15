---
layout: "note"
title: "40_insertion-sort_verify.py"
display_title: "40_insertion-sort_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "40"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/insertion-sort/"
parent_title: "삽입 정렬"
description: "자료구조 · 삽입 정렬 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/40_insertion-sort_verify/"
---
{% raw %}
[삽입 정렬](/Hongs_Blog/studies/data-structures/insertion-sort/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""삽입 정렬의 횟수 세기 검증.

실행: python3 40_insertion-sort_verify.py
문서: 40.삽입 정렬 (복잡도 절, 카드 C3)

주장
  1. 모든 순열(n <= 8)에서 비교 횟수는 n - 1 이상 n(n - 1)/2 이하다.
     밀기가 0번인 순열은 이미 정렬된 것 하나뿐이다.
  2. 밀기 횟수 = 순서가 뒤집힌 쌍의 수(역전 수).
  3. 한 번 끼울 때의 비교 횟수 = min(i, 앞쪽에서 t보다 큰 값의 수 + 1).
     그래서 비교 횟수 = 역전 수 + (n - 1) - (그때까지의 가장 작은 값으로 들어온 횟수).
  4. 비교 횟수가 최대인 순열은 역순 하나가 아니다. 2^(n-1)개이고 n = 5이면 16개다
     ([7, 3, 6, 2, 1]과 같은 꼴 포함).
  5. 같은 값끼리는 처음 순서가 지켜진다(안정 정렬). 무작위 2,000개.
  6. 최악의 비교 횟수는 n이 두 배가 되면 약 네 배가 된다.
  7. 조건을 t <= a[j]로 바꾸면 같은 값의 순서가 뒤집힌다: [1a, 1b] -> [1b, 1a].
"""
import random
from itertools import permutations


def insertion_sort(a):
    """문서의 코드. (정렬된 리스트, 비교 횟수, 밀기 횟수, 끼울 때마다의 비교 횟수)"""
    a = list(a)
    cmp_count = 0
    moves = 0
    per_pass = []
    for i in range(1, len(a)):
        t = a[i]
        j = i - 1
        c = 0
        while j >= 0:
            c += 1                      # t < a[j] 비교 한 번
            if not (key(t) < key(a[j])):
                break
            a[j + 1] = a[j]
            moves += 1
            j -= 1
        a[j + 1] = t
        cmp_count += c
        per_pass.append(c)
    return a, cmp_count, moves, per_pass


def key(x):
    return x[0] if isinstance(x, tuple) else x


def inversions(p):
    return sum(1 for i in range(len(p)) for j in range(i + 1, len(p)) if p[i] > p[j])


def check_all_permutations():
    for n in range(1, 9):
        lo, hi = None, None
        n_hi = 0
        n_zero_moves = 0
        for p in permutations(range(n)):
            s, c, m, per = insertion_sort(p)
            assert s == sorted(p)
            inv = inversions(p)
            assert m == inv
            new_min = sum(1 for i in range(1, n) if p[i] < min(p[:i]))
            assert c == inv + (n - 1) - new_min
            for i in range(1, n):
                bigger = sum(1 for x in p[:i] if x > p[i])
                assert per[i - 1] == min(i, bigger + 1)
            if m == 0:
                n_zero_moves += 1
                assert list(p) == sorted(p) and c == n - 1
            if lo is None or c < lo:
                lo = c
            if hi is None or c > hi:
                hi, n_hi = c, 1
            elif c == hi:
                n_hi += 1
        assert lo == n - 1 and n_zero_moves == 1
        assert hi == n * (n - 1) // 2
        assert n_hi == 2 ** (n - 1)
    return True


def check_examples():
    s, c, m, per = insertion_sort([7, 3, 6, 2, 1])
    assert (s, c, m, per) == ([1, 2, 3, 6, 7], 10, 9, [1, 2, 3, 4])
    s, c, m, per = insertion_sort([5, 4, 3, 2, 1])
    assert (c, m) == (10, 10)
    # 카드 C3: 거의 정렬된 입력 [1, 2, 4, 3, 5, 6, 8, 7]
    s, c, m, per = insertion_sort([1, 2, 4, 3, 5, 6, 8, 7])
    assert (c, m) == (9, 2) and inversions([1, 2, 4, 3, 5, 6, 8, 7]) == 2
    # 같은 길이의 역순
    s, c, m, per = insertion_sort([8, 7, 6, 5, 4, 3, 2, 1])
    assert (c, m) == (28, 28)


def check_stability():
    rng = random.Random(40)
    for _ in range(2000):
        n = rng.randint(0, 30)
        a = [(rng.randint(0, 5), i) for i in range(n)]      # (키, 처음 자리)
        s, _, _, _ = insertion_sort(a)
        assert s == sorted(a, key=lambda x: x[0])           # sorted는 안정 정렬이다
        for x, y in zip(s, s[1:]):
            if x[0] == y[0]:
                assert x[1] < y[1]


def check_less_or_equal_breaks_stability():
    """조건을 t <= a[j]로 바꾸면 같은 값끼리 자리가 뒤집힌다."""
    a = [(1, "a"), (1, "b")]
    for i in range(1, len(a)):
        t = a[i]
        j = i - 1
        while j >= 0 and t[0] <= a[j][0]:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = t
    assert a == [(1, "b"), (1, "a")]


def check_doubling():
    ratios = []
    for n in (100, 200, 400, 800):
        _, c1, _, _ = insertion_sort(range(n, 0, -1))
        _, c2, _, _ = insertion_sort(range(2 * n, 0, -1))
        assert c1 == n * (n - 1) // 2
        ratios.append(c2 / c1)
    assert all(4.0 < r < 4.03 for r in ratios)
    return ratios


if __name__ == "__main__":
    check_examples()
    check_all_permutations()
    check_stability()
    check_less_or_equal_breaks_stability()
    r = check_doubling()
    print("모든 순열 n <= 8: 비교 n-1 ~ n(n-1)/2, 밀기 = 역전 수")
    print("n = 5에서 비교 10번인 순열 16개")
    print("역순 입력: n이 두 배일 때 비교 횟수 비", [round(x, 3) for x in r])
    print("ALL CHECKS PASSED")
```
{% endraw %}
