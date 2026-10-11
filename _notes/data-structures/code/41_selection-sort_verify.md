---
layout: "note"
title: "41_selection-sort_verify.py"
display_title: "41_selection-sort_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "41"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/selection-sort/"
parent_title: "선택 정렬"
description: "자료구조 · 선택 정렬 검증 코드"
permalink: "/studies/data-structures/code/41_selection-sort_verify/"
---
{% raw %}
[선택 정렬](/Hongs_Blog/studies/data-structures/selection-sort/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선택 정렬의 횟수 세기 검증.

실행: python3 41_selection-sort_verify.py
문서: 41.선택 정렬 (복잡도 절, 삽입 정렬과 견주는 표, 카드 C3)
출처: 자료구조 14주차 슬라이드 p.5

주장
  1. 모든 순열(n <= 7)에서 비교 횟수는 늘 n(n - 1)/2다. 입력이 정렬되어 있어도 줄지 않는다.
  2. 맞바꾸기는 많아야 n - 1번이다. 삽입 정렬의 밀기는 많으면 n(n - 1)/2번이다.
  3. 같은 값의 순서가 뒤집힐 수 있다(불안정). 예: [2a, 2b, 1] -> [1, 2b, 2a].
     가장 큰 값이 여럿일 때 앞의 것을 고르든 뒤의 것을 고르든 뒤집히는 입력이 있다.
  4. 정렬된 8개: 선택 정렬은 비교 28번, 삽입 정렬은 7번 (카드 C3).
"""
from itertools import permutations, product


def selection_sort(a, last_max=False):
    """가장 큰 값을 오른쪽 끝으로 보내기를 되풀이한다. (정렬된 리스트, 비교 횟수, 맞바꾸기 횟수)"""
    a = list(a)
    cmp_count = 0
    swaps = 0
    for size in range(len(a), 1, -1):
        big = 0
        for i in range(1, size):
            cmp_count += 1
            if key(a[i]) > key(a[big]) or (last_max and key(a[i]) == key(a[big])):
                big = i
        if big != size - 1:
            a[big], a[size - 1] = a[size - 1], a[big]
            swaps += 1
    return a, cmp_count, swaps


def insertion_counts(a):
    a = list(a)
    cmp_count = moves = 0
    for i in range(1, len(a)):
        t = a[i]
        j = i - 1
        while j >= 0:
            cmp_count += 1
            if not (t < a[j]):
                break
            a[j + 1] = a[j]
            moves += 1
            j -= 1
        a[j + 1] = t
    return cmp_count, moves


def key(x):
    return x[0] if isinstance(x, tuple) else x


def is_stable(result):
    return all(not (x[0] == y[0] and x[1] > y[1]) for x, y in zip(result, result[1:]))


if __name__ == "__main__":
    # 1, 2. 모든 순열
    for n in range(1, 8):
        max_swaps = 0
        max_moves = 0
        for p in permutations(range(n)):
            s, c, sw = selection_sort(p)
            assert s == sorted(p)
            assert c == n * (n - 1) // 2
            assert sw <= n - 1
            max_swaps = max(max_swaps, sw)
            max_moves = max(max_moves, insertion_counts(p)[1])
        assert max_swaps == n - 1
        assert max_moves == n * (n - 1) // 2

    # 문서의 예
    assert selection_sort([7, 3, 6, 2, 1]) == ([1, 2, 3, 6, 7], 10, 3)

    # 3. 불안정
    a = [(2, "a"), (2, "b"), (1, "c")]
    s, _, _ = selection_sort(a)
    assert s == [(1, "c"), (2, "b"), (2, "a")] and not is_stable(s)
    for last in (False, True):
        found = None
        for keys in product(range(1, 4), repeat=3):
            arr = [(k, i) for i, k in enumerate(keys)]
            s, _, _ = selection_sort(arr, last_max=last)
            assert [x[0] for x in s] == sorted(keys)
            if not is_stable(s):
                found = keys
                break
        assert found is not None          # 어느 쪽 규칙이든 뒤집히는 입력이 있다

    # 4. 카드 C3
    srt = list(range(1, 9))
    assert selection_sort(srt)[1:] == (28, 0)
    assert insertion_counts(srt) == (7, 0)
    rev = srt[::-1]
    assert selection_sort(rev)[1:] == (28, 4)
    assert insertion_counts(rev) == (28, 28)

    print("모든 순열 n <= 7: 비교 n(n-1)/2, 맞바꾸기 최대 n-1")
    print("불안정 예 [2a, 2b, 1] -> [1, 2b, 2a]")
    print("정렬된 8개: 선택 28번 / 삽입 7번, 역순 8개: 선택 맞바꾸기 4번 / 삽입 밀기 28번")
    print("ALL CHECKS PASSED")
```
{% endraw %}
