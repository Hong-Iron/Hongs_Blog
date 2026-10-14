---
layout: "note"
title: "44_quick-vs-merge-sort_verify.py"
display_title: "44_quick-vs-merge-sort_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "44"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/quick-vs-merge-sort/"
parent_title: "퀵 정렬과 병합 정렬 비교"
description: "자료구조 · 퀵 정렬과 병합 정렬 비교 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/44_quick-vs-merge-sort_verify/"
---
{% raw %}
[퀵 정렬과 병합 정렬 비교](/Hongs_Blog/studies/data-structures/quick-vs-merge-sort/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""퀵 정렬과 병합 정렬을 같은 입력에서 세어 견준다.

실행: python3 44_quick-vs-merge-sort_verify.py
문서: 44.퀵 정렬과 병합 정렬 비교 (결정적 차이 표, 카드 C1~C3)
출처: 자료구조 14주차 슬라이드 p.15~19, p.25, p.27
퀵 정렬의 분할은 42_quick-sort_impl.c와, 병합은 43_merge-sort_impl.c와 같은 규칙이다.
세는 것: 키 비교 횟수, 배열 칸에 값을 써넣은 횟수(퀵은 맞바꾸기 한 번에 2칸, 병합은 덤 배열에 쓰기와
되옮겨 쓰기), 재귀 깊이.

주장 (실험으로 확인한 것이고 증명이 아니다)
  1. 무작위 1,000개(200번 평균): 비교는 병합 쪽이 적고, 써넣기는 퀵 쪽이 훨씬 적다.
  2. 이미 정렬된 1,000개: 맨 왼쪽 피벗 퀵은 비교 501,498번, 병합은 5,000번 안팎.
  3. 병합 정렬의 비교는 어떤 입력에서도 n * ceil(lg n) 이하, 재귀 깊이는 ceil(lg n).
  4. 퀵 정렬의 재귀 깊이는 정렬된 입력에서 n - 1, 병합 정렬은 늘 10 (n = 1,000).
  5. 퀵 정렬은 같은 값의 순서를 뒤집을 수 있다: [1a, 1b] -> [1b, 1a].
"""
import math
import random
import sys

sys.setrecursionlimit(20000)


def quick(a, left, right, st, depth=1):
    if left >= right:
        return
    st["depth"] = max(st["depth"], depth)
    pivot = a[left]
    i, j = left, right + 1
    while True:
        while True:
            i += 1
            if i > right:
                break
            st["cmp"] += 1
            if a[i] >= pivot:
                break
        while True:
            j -= 1
            st["cmp"] += 1
            if a[j] <= pivot:
                break
        if i >= j:
            break
        a[i], a[j] = a[j], a[i]
        st["write"] += 2
    a[left], a[j] = a[j], pivot
    st["write"] += 2
    quick(a, left, j - 1, st, depth + 1)
    quick(a, j + 1, right, st, depth + 1)


def merge_sort(a, lo, hi, tmp, st, depth=1):
    n = hi - lo
    if n <= 1:
        return
    st["depth"] = max(st["depth"], depth)
    mid = lo + (n + 1) // 2
    merge_sort(a, lo, mid, tmp, st, depth + 1)
    merge_sort(a, mid, hi, tmp, st, depth + 1)
    i, j, k = lo, mid, lo
    while i < mid and j < hi:
        st["cmp"] += 1
        if a[j] < a[i]:
            tmp[k] = a[j]
            j += 1
        else:
            tmp[k] = a[i]
            i += 1
        k += 1
    while i < mid:
        tmp[k] = a[i]
        i += 1
        k += 1
    while j < hi:
        tmp[k] = a[j]
        j += 1
        k += 1
    a[lo:hi] = tmp[lo:hi]
    st["write"] += 2 * n                      # 덤 배열에 n칸, 되옮겨 n칸


def measure(data):
    q, m = list(data), list(data)
    sq = {"cmp": 0, "write": 0, "depth": 0}
    sm = {"cmp": 0, "write": 0, "depth": 0}
    quick(q, 0, len(q) - 1, sq)
    merge_sort(m, 0, len(m), [0] * len(m), sm)
    assert q == sorted(data) and m == sorted(data)
    return sq, sm


if __name__ == "__main__":
    n = 1000
    rng = random.Random(44)
    tq = {"cmp": 0, "write": 0}
    tm = {"cmp": 0, "write": 0}
    worst_merge_cmp = 0
    deepest_quick = 0
    trials = 200
    for _ in range(trials):
        a = list(range(n))
        rng.shuffle(a)
        sq, sm = measure(a)
        for k in ("cmp", "write"):
            tq[k] += sq[k]
            tm[k] += sm[k]
        worst_merge_cmp = max(worst_merge_cmp, sm["cmp"])
        deepest_quick = max(deepest_quick, sq["depth"])
        assert sm["depth"] == 10
    avg_q = {k: v / trials for k, v in tq.items()}
    avg_m = {k: v / trials for k, v in tm.items()}

    # 1. 무작위 입력
    assert avg_m["cmp"] < avg_q["cmp"]                 # 비교는 병합이 적다
    assert avg_q["write"] < avg_m["write"] / 3         # 써넣기는 퀵이 3분의 1도 안 된다
    assert avg_m["write"] == 2 * 9976                  # 2 * (층마다 합친 칸 수의 합) = 19,952

    # 2. 정렬된 입력
    sq, sm = measure(range(n))
    assert sq["cmp"] == 501498 and sq["depth"] == n - 1
    assert sm["cmp"] < 6000 and sm["depth"] == 10
    sorted_q, sorted_m = sq, sm

    # 역순 입력
    rq, rm = measure(range(n, 0, -1))
    assert rq["cmp"] == 500998 and rm["cmp"] < 6000

    # 3. 병합 정렬의 한계
    bound = n * math.ceil(math.log2(n))
    assert max(worst_merge_cmp, sm["cmp"], rm["cmp"]) <= bound

    # 카드 C2의 수: 정렬된 2,000개에서 퀵은 약 네 배
    sq2, sm2 = measure(range(2 * n))
    assert sq2["cmp"] == 2002998 and 3.9 < sq2["cmp"] / sq["cmp"] < 4.1
    assert 2.0 < sm2["cmp"] / sm["cmp"] < 2.3

    # 5. 같은 값의 순서: 퀵 정렬은 [1a, 1b]를 [1b, 1a]로 뒤집는다(피벗과 small을 맞바꿀 때)
    pair = [(1, "a"), (1, "b")]
    pivot = pair[0]
    i, j = 0, 2
    while True:
        i += 1
        while i <= 1 and pair[i][0] < pivot[0]:
            i += 1
        j -= 1
        while pair[j][0] > pivot[0]:
            j -= 1
        if i >= j:
            break
        pair[i], pair[j] = pair[j], pair[i]
    pair[0], pair[j] = pair[j], pivot
    assert pair == [(1, "b"), (1, "a")]

    print(f"무작위 1,000개(200번 평균): 퀵 비교 {avg_q['cmp']:,.0f} / 써넣기 {avg_q['write']:,.0f}, "
          f"병합 비교 {avg_m['cmp']:,.0f} / 써넣기 {avg_m['write']:,.0f}")
    print(f"정렬된 1,000개: 퀵 비교 {sorted_q['cmp']:,} (깊이 {sorted_q['depth']}), "
          f"병합 비교 {sorted_m['cmp']:,} (깊이 {sorted_m['depth']})")
    print(f"정렬된 2,000개: 퀵 비교 {sq2['cmp']:,}, 병합 비교 {sm2['cmp']:,}")
    print(f"무작위에서 퀵의 가장 깊은 재귀 {deepest_quick}, 병합 비교의 최댓값 {worst_merge_cmp:,} <= {bound:,}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
