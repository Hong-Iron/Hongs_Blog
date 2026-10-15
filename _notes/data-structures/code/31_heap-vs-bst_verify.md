---
layout: "note"
title: "31_heap-vs-bst_verify.py"
display_title: "31_heap-vs-bst_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/heap-vs-bst/"
parent_title: "최대 힙과 이진 탐색 트리 비교"
description: "자료구조 · 최대 힙과 이진 탐색 트리 비교 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/31_heap-vs-bst_verify/"
---
{% raw %}
[최대 힙과 이진 탐색 트리 비교](/Hongs_Blog/studies/data-structures/heap-vs-bst/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""최대 힙과 이진 탐색 트리 비교: 문서에 실은 예와 카드의 답 확인.

문서: 1-2학기/자료구조/3.개념집/31.최대 힙과 이진 탐색 트리 비교.md
실행: python3 31_heap-vs-bst_verify.py
힙은 최대 힙 문서처럼 1번 칸부터 쓴다(부모 i // 2, 자식 2i, 2i + 1).

확인하는 것
  1. 같은 키 아홉 개를 같은 순서(20, 10, 40, 6, 15, 30, 2, 8, 25)로 넣으면
     최대 힙의 배열은 40 25 30 15 10 20 2 6 8, 이진 탐색 트리는 이진 탐색 트리 문서의 예시 나무(전위 20 10 6 2 8 15 40 30 25).
  2. 그 힙은 이진 탐색 트리가 아니고, 그 이진 탐색 트리는 힙이 아니다(20 < 40, 완전 이진 트리도 아니다).
  3. 가장 큰 값: 힙은 1번 칸 하나, 이진 탐색 트리는 오른쪽으로 내려가 노드 2개.
  4. 없는 값 9 찾기: 힙은 가지를 쳐도 노드 9개를 다 보고, 이진 탐색 트리는 4개(20, 10, 6, 8)만 본다.
  5. 크기 순으로 읽기: 이진 탐색 트리의 중위 순회는 오름차순, 힙의 배열 순서는 정렬이 아니다.
  6. 높이(간선 수): 힙은 늘 floor(lg n). 1 ~ 9를 오름차순으로 넣으면 힙의 높이는 3, 이진 탐색 트리의 높이는 8.
  7. 카드 C3의 나무와 그 짝인 최소 힙 그림이 각각 최대 힙, 최소 힙이다. 무작위 300묶음에서 1 ~ 6이 모두 같은 꼴로 맞다.
"""
import math
import random


def heap_push(heap, x):
    """heap[0]은 쓰지 않는다. 구멍을 위로 올리며 넣는다."""
    heap.append(x)
    i = len(heap) - 1
    while i != 1 and x > heap[i // 2]:
        heap[i] = heap[i // 2]
        i //= 2
    heap[i] = x


def is_max_heap(heap):
    return all(heap[i // 2] >= heap[i] for i in range(2, len(heap)))


def is_min_heap(heap):
    return all(heap[i // 2] <= heap[i] for i in range(2, len(heap)))


def heap_search_count(heap, x):
    """최대 힙에서 x 찾기. 노드 값이 x보다 작으면 그 아래는 보지 않는다. (찾았나, 들른 노드 수)"""
    count = 0
    stack = [1]
    while stack:
        i = stack.pop()
        if i >= len(heap):
            continue
        count += 1
        if heap[i] == x:
            return True, count
        if heap[i] > x:                 # 아래에 x가 있을 수 있다
            stack.append(2 * i + 1)
            stack.append(2 * i)
    return False, count


class Node:
    def __init__(self, key):
        self.key, self.left, self.right = key, None, None


def bst_insert(root, x):
    if root is None:
        return Node(x)
    t = root
    while True:
        if x == t.key:
            return root
        nxt = t.left if x < t.key else t.right
        if nxt is None:
            if x < t.key:
                t.left = Node(x)
            else:
                t.right = Node(x)
            return root
        t = nxt


def bst_search_count(root, x):
    count, t = 0, root
    while t:
        count += 1
        if x == t.key:
            return True, count
        t = t.left if x < t.key else t.right
    return False, count


def bst_max_count(root):
    count, t = 1, root
    while t.right:
        t = t.right
        count += 1
    return t.key, count


def preorder(t, out):
    if t:
        out.append(t.key)
        preorder(t.left, out)
        preorder(t.right, out)
    return out


def inorder(t, out):
    if t:
        inorder(t.left, out)
        out.append(t.key)
        inorder(t.right, out)
    return out


def height(t):
    return -1 if t is None else 1 + max(height(t.left), height(t.right))


def heap_as_tree(heap, i=1):
    if i >= len(heap):
        return None
    t = Node(heap[i])
    t.left, t.right = heap_as_tree(heap, 2 * i), heap_as_tree(heap, 2 * i + 1)
    return t


def is_bst(t, lo=-math.inf, hi=math.inf):
    if t is None:
        return True
    return lo < t.key < hi and is_bst(t.left, lo, t.key) and is_bst(t.right, t.key, hi)


def is_complete(t):
    """층 순서로 번호를 매겼을 때 빈 번호가 없는가."""
    nums, queue = [], [(t, 1)]
    while queue:
        node, i = queue.pop(0)
        nums.append(i)
        if node.left:
            queue.append((node.left, 2 * i))
        if node.right:
            queue.append((node.right, 2 * i + 1))
    return sorted(nums) == list(range(1, len(nums) + 1))


def tree_is_max_tree(t):
    if t is None:
        return True
    for c in (t.left, t.right):
        if c and c.key > t.key:
            return False
    return tree_is_max_tree(t.left) and tree_is_max_tree(t.right)


def main():
    order = [20, 10, 40, 6, 15, 30, 2, 8, 25]
    heap, root = [None], None
    for x in order:
        heap_push(heap, x)
        root = bst_insert(root, x)

    # 1
    assert heap[1:] == [40, 25, 30, 15, 10, 20, 2, 6, 8] and is_max_heap(heap)
    assert preorder(root, []) == [20, 10, 6, 2, 8, 15, 40, 30, 25]
    print("[OK] 같은 순서로 넣기: 힙 배열 40 25 30 15 10 20 2 6 8, 이진 탐색 트리는 예시 나무")

    # 2
    assert not is_bst(heap_as_tree(heap))
    assert not tree_is_max_tree(root) and not is_complete(root)
    assert is_complete(heap_as_tree(heap))
    print("[OK] 힙은 이진 탐색 트리가 아니고, 이진 탐색 트리는 힙이 아니다")

    # 3
    assert heap[1] == 40 and bst_max_count(root) == (40, 2)
    # 4
    assert heap_search_count(heap, 9) == (False, 9) and bst_search_count(root, 9) == (False, 4)
    assert heap_search_count(heap, 1) == (False, 9) and bst_search_count(root, 1) == (False, 4)
    assert bst_search_count(root, 15) == (True, 3)
    # 5
    assert inorder(root, []) == sorted(order)
    assert heap[1:] != sorted(order, reverse=True) and heap[1:] != sorted(order)
    print("[OK] 가장 큰 값: 힙 1칸, 트리 2노드 / 없는 9 찾기: 힙 9노드, 트리 4노드 / 중위 순회만 정렬되어 나온다")

    # 6
    heap2, root2 = [None], None
    for x in range(1, 10):
        heap_push(heap2, x)
        root2 = bst_insert(root2, x)
    assert height(heap_as_tree(heap2)) == 3 == math.floor(math.log2(9)) and height(root2) == 8
    assert height(root) == 3 and height(heap_as_tree(heap)) == 3
    print("[OK] 1 ~ 9를 오름차순으로 넣으면 힙의 높이 3, 이진 탐색 트리의 높이 8")

    # 7
    c3_max = [None, 9, 7, 6, 5, 4, 3, 2, 2, 1, 3]
    c3_min = [None, 1, 4, 2, 7, 5, 3, 3, 7, 8, 9]
    assert is_max_heap(c3_max) and not is_min_heap(c3_max)
    assert is_min_heap(c3_min) and not is_max_heap(c3_min)
    assert not is_bst(heap_as_tree(c3_max))
    rng = random.Random(20261012)
    for _ in range(300):
        n = rng.randint(2, 30)
        keys = rng.sample(range(1, 200), n)
        h, r = [None], None
        for x in keys:
            heap_push(h, x)
            r = bst_insert(r, x)
        assert is_max_heap(h) and is_bst(r) and inorder(r, []) == sorted(keys)
        assert height(heap_as_tree(h)) == math.floor(math.log2(n))
        assert math.floor(math.log2(n)) <= height(r) <= n - 1
        assert h[1] == max(keys) == bst_max_count(r)[0]
        missing = rng.choice([x for x in range(0, 201) if x not in keys])
        assert heap_search_count(h, missing)[0] is False and bst_search_count(r, missing)[0] is False
        assert bst_search_count(r, missing)[1] <= height(r) + 1
        if n >= 3:
            assert not is_bst(heap_as_tree(h))      # 키가 셋 이상이면 힙은 이진 탐색 트리일 수 없다
    print("[OK] 카드 C3의 나무와 짝 그림은 최대 힙과 최소 힙. 무작위 300묶음에서도 같은 성질")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
