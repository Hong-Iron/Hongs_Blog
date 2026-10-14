---
layout: "note"
title: "28_heap-sort_verify.py"
display_title: "28_heap-sort_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/heap-sort/"
parent_title: "우선순위 큐 정렬과 힙 정렬"
description: "자료구조 · 우선순위 큐 정렬과 힙 정렬 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/28_heap-sort_verify/"
---
{% raw %}
[우선순위 큐 정렬과 힙 정렬](/Hongs_Blog/studies/data-structures/heap-sort/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""우선순위 큐 정렬과 힙 정렬: 값을 옮겨 적는 횟수와 비교 횟수를 센다.

실행: python3 28_heap-sort_verify.py   (표준 라이브러리만 쓴다)

C 구현(28_heap-sort_impl.c)과 같은 알고리즘을 다시 짜고 횟수를 세는 칸을 달았다.
  - 힙 만들기(아래에서 위로)의 옮겨 적기는 n번을 넘지 않는다.
  - 한 개씩 n번 넣기는 가장 나쁜 입력(오름차순)에서 n lg n에 비례한다.
배열은 0번 칸부터 쓴다(자식 2i + 1, 2i + 2).
"""
import random
from math import floor, log2


class Counter:
    def __init__(self):
        self.moves = 0        # 자식을 구멍으로 올려(부모를 내려) 적은 횟수
        self.compares = 0     # 값끼리 비교한 횟수


def sift_down(a, n, root, c, key=lambda x: x):
    tmp = a[root]
    parent, child = root, 2 * root + 1
    while child < n:
        if child + 1 < n:
            c.compares += 1
            if key(a[child]) < key(a[child + 1]):
                child += 1
        c.compares += 1
        if key(tmp) >= key(a[child]):
            break
        a[parent] = a[child]
        c.moves += 1
        parent, child = child, 2 * child + 1
    a[parent] = tmp


def build_heap(a, c, key=lambda x: x):
    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(a, n, i, c, key)


def heap_sort(a, c, key=lambda x: x):
    build_heap(a, c, key)
    for last in range(len(a) - 1, 0, -1):
        a[0], a[last] = a[last], a[0]
        sift_down(a, last, 0, c, key)


def push_all(values, c):
    """빈 힙에 하나씩 넣는다(위로 올리기). 0번 칸부터 쓰므로 부모는 (i - 1) // 2"""
    heap = []
    for x in values:
        heap.append(x)
        i = len(heap) - 1
        while i != 0:
            c.compares += 1
            if x <= heap[(i - 1) // 2]:
                break
            heap[i] = heap[(i - 1) // 2]
            c.moves += 1
            i = (i - 1) // 2
        heap[i] = x
    return heap


def is_max_heap(a):
    return all(a[(i - 1) // 2] >= a[i] for i in range(1, len(a)))


def sum_of_heights(n):
    """노드 n개인 완전 이진 트리에서 모든 노드의 높이(잎 = 0)를 더한 값"""
    total = 0
    for i in range(n):
        h, j = 0, i
        while 2 * j + 1 < n:
            j = 2 * j + 1
            h += 1
        total += h
    return total


if __name__ == "__main__":
    rng = random.Random(28)

    # 1. 힙 만들기: 옮겨 적기 <= 높이의 합 = n - (n을 2진수로 썼을 때 1의 개수) < n
    for n in range(1, 3001):
        hs = sum_of_heights(n)
        assert hs == n - bin(n).count("1") < n
        if n <= 400 or n % 97 == 0:
            for make in (lambda: list(range(n)),              # 오름차순: 가장 많이 내려간다
                         lambda: list(range(n, 0, -1)),       # 내림차순: 이미 힙이다
                         lambda: [rng.randrange(1000) for _ in range(n)]):
                a, c = make(), Counter()
                build_heap(a, c)
                assert is_max_heap(a)
                assert c.moves <= hs and c.compares <= 2 * hs + n
    a, c = list(range(1000, 0, -1)), Counter()
    build_heap(a, c)
    assert c.moves == 0                                        # 내림차순은 옮길 것이 없다

    # 2. 하나씩 n번 넣기: 오름차순이면 새 값이 늘 뿌리까지 올라가 sum floor(lg i)번 옮긴다
    for n in (10, 100, 1000, 4096):
        c = Counter()
        heap = push_all(range(1, n + 1), c)
        assert is_max_heap(heap)
        assert c.moves == sum(floor(log2(i)) for i in range(1, n + 1))
    # 본문의 수치: n = 1,000
    c1, c2 = Counter(), Counter()
    push_all(range(1, 1001), c1)
    a = list(range(1, 1001))
    build_heap(a, c2)
    assert c1.moves == 7987                                    # 하나씩 넣기
    assert sum_of_heights(1000) == 994 and c2.moves <= 994     # 힙 만들기
    print(f"n = 1,000 오름차순: 하나씩 넣기 {c1.moves}번, 힙 만들기 {c2.moves}번 옮겨 적음")
    # n이 10배가 되면 힙 만들기는 약 10배, 하나씩 넣기는 10배보다 더 는다
    c3, c4 = Counter(), Counter()
    push_all(range(1, 10001), c3)
    a = list(range(1, 10001))
    build_heap(a, c4)
    assert c4.moves <= 10000 and c3.moves > 10 * c1.moves
    print(f"n = 10,000 오름차순: 하나씩 넣기 {c3.moves}번, 힙 만들기 {c4.moves}번 옮겨 적음")

    # 3. 힙 정렬 전체: sorted와 같은 결과, 비교 횟수 <= 2 n lg n + 2n
    for _ in range(2000):
        n = rng.randrange(0, 200)
        a = [rng.randrange(-50, 50) for _ in range(n)]
        want, c = sorted(a), Counter()
        heap_sort(a, c)
        assert a == want
        if n >= 2:
            assert c.compares <= 2 * n * log2(n) + 2 * n
    # 삽입 정렬의 가장 나쁜 경우 n(n-1)/2와 견준다: n = 1,000
    a, c = list(range(1000, 0, -1)), Counter()
    heap_sort(a, c)
    assert a == list(range(1, 1001)) and c.compares < 20000 < 1000 * 999 // 2 == 499500
    print(f"n = 1,000 내림차순: 힙 정렬 비교 {c.compares}번, 삽입 정렬은 499,500번")

    # 4. 힙 정렬은 같은 값의 처음 차례를 지키지 않는다(불안정): (2, 'a'), (2, 'b'), (1, 'c')
    recs, c = [(2, "a"), (2, "b"), (1, "c")], Counter()
    heap_sort(recs, c, key=lambda r: r[0])
    assert recs == [(1, "c"), (2, "b"), (2, "a")]              # 2a가 2b 뒤로 갔다

    # 5. 본문 추적: 6, 8, 2, 4, 1
    a, c = [6, 8, 2, 4, 1], Counter()
    build_heap(a, c)
    assert a == [8, 6, 2, 4, 1] and c.moves == 1
    heap = push_all([6, 8, 2, 4, 1], Counter())
    assert heap == [8, 6, 2, 4, 1]

    # 6. 카드: 힙 만들기를 0번 칸부터 앞에서 뒤로 하면 힙이 안 될 수 있다
    a, c = [1, 2, 3, 4, 5, 6, 7], Counter()
    for i in range(len(a) // 2):                      # 잘못된 차례: 0, 1, 2
        sift_down(a, len(a), i, c)
    assert a == [3, 5, 7, 4, 2, 6, 1] and not is_max_heap(a)
    a, c = [1, 2, 3, 4, 5, 6, 7], Counter()
    build_heap(a, c)                                   # 옳은 차례: 2, 1, 0
    assert a == [7, 5, 6, 4, 2, 1, 3] and is_max_heap(a)

    print("ALL CHECKS PASSED")
```
{% endraw %}
