---
layout: "note"
title: "42_quick-sort_verify.py"
display_title: "42_quick-sort_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "42"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/quick-sort/"
parent_title: "퀵 정렬"
description: "자료구조 · 퀵 정렬 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/42_quick-sort_verify/"
---
{% raw %}
[퀵 정렬](/Hongs_Blog/studies/data-structures/quick-sort/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""퀵 정렬의 횟수 세기 검증.

실행: python3 42_quick-sort_verify.py
문서: 42.퀵 정렬 (복잡도 절, 오해 항목, 카드 C3~C5), 44.퀵 정렬과 병합 정렬 비교
분할은 42_quick-sort_impl.c의 partition과 같은 규칙이다(피벗은 맨 왼쪽, big은 피벗 이상, small은 피벗 이하).

주장
  1. 이미 정렬된 n개를 맨 왼쪽 피벗으로 정렬하면 비교가 정확히 (n - 1)(n + 4)/2번이다(n = 1..300).
     재귀 깊이는 n - 1이다. 조각이 0개와 n - 1개로 갈리기 때문이다.
  2. 최악의 점화식 t(n) = t(n - 1) + dn, t(1) = c의 답은 c + d(n(n + 1)/2 - 1)이다(n <= 200).
  3. 조각이 늘 반반이면 t(n) = 2t(n/2) + dn, t(1) = c의 답은 cn + dn lg n이다(n = 2^k, k <= 20).
  4. 무작위 입력의 평균 비교 횟수는 n lg n과 2n ln n + 2n 사이다(n = 1,000, 200번. 실험).
  5. 가운데 값 피벗(median-of-three)이면 정렬된 입력에서도 비교가 2n lg n 아래다.
     그래도 최악이 없어지지는 않는다. 이 코드에서는 역순 입력이 여전히 n^2에 비례한다
     (1,000개 126,748번, 2,000개 503,498번: 두 배에 약 네 배).
  6. 모두 같은 값일 때: 등호를 넣은 규칙은 조각이 반반, 등호 없는 규칙은 0개와 n - 1개로 갈린다.
  7. 작은 조각만 재귀로 부르면 정렬된 입력에서도 재귀 깊이가 lg n + 1 이하다.
  8. 문서와 카드의 수치.
"""
import math
import random
import sys

sys.setrecursionlimit(20000)


def partition(a, left, right, cnt, strict=False):
    """strict=False: big은 피벗 이상인 첫 값, small은 피벗 이하인 첫 값 (같은 값이 많을 때의 규칙).
    strict=True : big은 피벗보다 큰 첫 값, small은 피벗보다 작은 첫 값 (등호 없는 규칙)."""
    pivot = a[left]
    i, j = left, right + 1
    while True:
        while True:
            i += 1
            if i > right:
                break
            cnt[0] += 1
            if (a[i] > pivot) if strict else (a[i] >= pivot):
                break
        while True:
            j -= 1
            if strict and j == left:
                break
            cnt[0] += 1
            if (a[j] < pivot) if strict else (a[j] <= pivot):
                break
        if i >= j:
            break
        a[i], a[j] = a[j], a[i]
    a[left], a[j] = a[j], pivot
    return j


def median_of_three(a, left, right):
    mid = (left + right) // 2
    return sorted([(a[left], left), (a[mid], mid), (a[right], right)])[1][1]


def quick_sort(a, left, right, cnt, depth, strict=False, m3=False, sizes=None):
    if left >= right:
        return
    depth[0] += 1
    depth[1] = max(depth[1], depth[0])
    if m3:
        m = median_of_three(a, left, right)
        a[left], a[m] = a[m], a[left]
    p = partition(a, left, right, cnt, strict)
    if sizes is not None:
        sizes.append((p - left, right - p))
    quick_sort(a, left, p - 1, cnt, depth, strict, m3, sizes)
    quick_sort(a, p + 1, right, cnt, depth, strict, m3, sizes)
    depth[0] -= 1


def quick_sort_small_first(a, left, right, depth):
    """작은 조각만 재귀로 부르고 큰 조각은 고리로 돈다."""
    depth[0] += 1
    depth[1] = max(depth[1], depth[0])
    cnt = [0]
    while left < right:
        p = partition(a, left, right, cnt)
        if p - left < right - p:
            quick_sort_small_first(a, left, p - 1, depth)
            left = p + 1
        else:
            quick_sort_small_first(a, p + 1, right, depth)
            right = p - 1
    depth[0] -= 1


def run(data, **kw):
    a = list(data)
    cnt, depth = [0], [0, 0]
    quick_sort(a, 0, len(a) - 1, cnt, depth, **kw)
    assert a == sorted(data)
    return cnt[0], depth[1]


if __name__ == "__main__":
    # 1. 정렬된 입력 + 맨 왼쪽 피벗
    for n in range(1, 301):
        c, d = run(range(n))
        assert c == (n - 1) * (n + 4) // 2, (n, c)
        assert d == max(n - 1, 0)
    sizes = []
    run(range(10), sizes=sizes)
    assert sizes == [(0, m) for m in range(9, 0, -1)]       # 왼쪽 조각이 늘 0개

    # 2. 최악의 점화식을 되풀이 대입으로 푼 꼴
    c0, d0 = 3, 5
    t = {1: c0}
    for n in range(2, 201):
        t[n] = t[n - 1] + d0 * n
        assert t[n] == c0 + d0 * (n * (n + 1) // 2 - 1)

    # 3. 반반으로 갈릴 때
    t = {1: c0}
    for k in range(1, 21):
        n = 2 ** k
        t[n] = 2 * t[n // 2] + d0 * n
        assert t[n] == c0 * n + d0 * n * k

    # 4. 무작위 입력의 평균
    rng = random.Random(42)
    n = 1000
    total = 0
    deepest = 0
    for _ in range(200):
        a = list(range(n))
        rng.shuffle(a)
        c, d = run(a)
        total += c
        deepest = max(deepest, d)
    avg = total / 200
    assert n * math.log2(n) < avg < 2 * n * math.log(n) + 2 * n
    assert deepest < 40

    # 5. 가운데 값 피벗
    c_sorted_left, d_sorted_left = run(range(n))
    c_sorted_m3, d_sorted_m3 = run(range(n), m3=True)
    assert c_sorted_left == 501498 and d_sorted_left == 999
    assert c_sorted_m3 < 2 * n * math.log2(n) and d_sorted_m3 <= 10
    c_rev_left, _ = run(range(n, 0, -1))
    c_rev_m3, d_rev_m3 = run(range(n, 0, -1), m3=True)
    c_rev_m3_2n, _ = run(range(2 * n, 0, -1), m3=True)
    assert (c_rev_left, c_rev_m3, c_rev_m3_2n) == (500998, 126748, 503498)
    assert 3.9 < c_rev_m3_2n / c_rev_m3 < 4.1                 # 두 배에 네 배: 여전히 제곱

    # 6. 모두 같은 값
    same = [7] * n
    c_eq, d_eq = run(same)
    c_eq_strict, d_eq_strict = run(same, strict=True)
    assert d_eq <= 10 and c_eq < 2 * n * math.log2(n)
    assert d_eq_strict == n - 1 and c_eq_strict == n * (n - 1)
    sizes = []
    run([7] * 9, sizes=sizes)
    assert sizes[0] == (4, 4)                                 # 반반
    sizes = []
    run([7] * 9, strict=True, sizes=sizes)
    assert sizes[0] == (0, 8)                                 # 한쪽으로 몰림
    # 등호 없는 규칙도 값이 모두 다르면 같은 결과를 낸다(문서의 제자리 분할 예)
    for strict in (False, True):
        a = [6, 2, 8, 5, 11, 10, 4, 1, 9, 7, 3]
        partition(a, 0, 10, [0], strict)
        assert a == [4, 2, 3, 5, 1, 6, 10, 11, 9, 7, 8]

    # 7. 작은 조각 먼저
    for m in (16, 1000, 4096):
        a = list(range(m))
        depth = [0, 0]
        quick_sort_small_first(a, 0, m - 1, depth)
        assert a == list(range(m)) and depth[1] <= math.log2(m) + 1

    # 8. 카드
    # C3: 정렬된 [1..5], 맨 왼쪽 피벗 -> 조각 크기 (0, 4), (0, 3), (0, 2), (0, 1), 비교 18번
    sizes = []
    c, d = run([1, 2, 3, 4, 5], sizes=sizes)
    assert sizes == [(0, 4), (0, 3), (0, 2), (0, 1)] and c == 18 and d == 4
    # C5: a[0..8]에서 a[0], a[4], a[8]만 본다
    assert median_of_three({0: 12, 4: 40, 8: 7}, 0, 8) == 0      # 12가 가운데 값: 이미 맨 왼쪽
    assert median_of_three({0: 12, 4: 9, 8: 7}, 0, 8) == 4       # 9가 가운데 값: a[0]과 맞바꾼다
    # 문서의 가운데 값 규칙 세 예 (a[6], a[13], a[20])
    assert median_of_three({6: 30, 13: 2, 20: 10}, 6, 20) == 20
    assert median_of_three({6: 3, 13: 2, 20: 10}, 6, 20) == 6
    assert median_of_three({6: 30, 13: 25, 20: 10}, 6, 20) == 13

    # 문서의 나무 그림: 예시 배열을 두 층까지 나눈 모습
    a = [6, 2, 8, 5, 11, 10, 4, 1, 9, 7, 3]
    assert partition(a, 0, 10, [0]) == 5 and a == [4, 2, 3, 5, 1, 6, 10, 11, 9, 7, 8]
    assert partition(a, 0, 4, [0]) == 3 and a[0:5] == [1, 2, 3, 4, 5]
    assert partition(a, 6, 10, [0]) == 9 and a[6:11] == [7, 8, 9, 10, 11]
    # 스스로 설명해 보기 2: 피벗이 가장 큰 값이면 i는 오른쪽 끝을 넘어가서야 멈춘다
    a = [9, 1, 2]
    assert partition(a, 0, 2, [0]) == 2 and a == [2, 1, 9]
    # 오해 항목의 배수
    assert 41 < 501498 / avg < 42

    print(f"정렬된 1,000개 + 맨 왼쪽 피벗: 비교 {c_sorted_left:,}번, 재귀 깊이 {d_sorted_left}")
    print(f"정렬된 1,000개 + 가운데 값 피벗: 비교 {c_sorted_m3:,}번, 재귀 깊이 {d_sorted_m3}")
    print(f"역순 1,000개: 맨 왼쪽 피벗 {c_rev_left:,}번 / 가운데 값 피벗 {c_rev_m3:,}번 (깊이 {d_rev_m3})")
    print(f"무작위 1,000개(200번 평균): 비교 {avg:,.0f}번, 가장 깊은 재귀 {deepest}")
    print(f"모두 같은 1,000개: 등호 있는 규칙 {c_eq:,}번 / 등호 없는 규칙 {c_eq_strict:,}번")
    print("ALL CHECKS PASSED")
```
{% endraw %}
