---
layout: "note"
title: "13_b-tree-search_impl.py"
display_title: "13_b-tree-search_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "13"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/b-tree-search/"
parent_title: "B-트리 검색"
description: "데이터베이스 설계 · B-트리 검색 구현 코드"
sitemap: false
permalink: "/studies/database-design/code/13_b-tree-search_impl/"
---
{% raw %}
[B-트리 검색](/Hongs_Blog/studies/database-design/b-tree-search/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-트리 검색 구현과 검증.

문서: 13.B-트리 검색, 연습 17.B-트리 연습 p3
출처: Cormen 외, Introduction to Algorithms 3판 18.2절 (B-TREE-SEARCH)
인덱스: 문서의 의사코드(CLRS)는 1부터 센다. 이 코드는 0부터 센다.
        search가 돌려주는 자리 i는 의사코드의 i - 1이다(의사코드가 (y, 2)를 돌려주면 여기서는 (y, 1)).
실행: python3 13_b-tree-search_impl.py

확인하는 것
  1. 문서의 예: R을 찾으면 [M] -> [Q T X] -> [R S]를 지나 [R S]의 첫째 키에서 멈춘다. 디스크 읽기는 2번.
  2. 없는 키 U는 잎 [V W]에서 NIL로 끝난다.
  3. 무작위 트리(t = 2~6): 결과가 "그 키가 들어 있는가"와 늘 같다. 지나는 노드는 높이 + 1개, 디스크 읽기는 높이 이하.
     노드 안에서 차례로 찾기와 이분 탐색은 같은 답을 낸다.
  4. 비교 횟수: 차례로 찾으면 노드마다 많아야 2t - 1번, 이분 탐색이면 많아야 ceil(lg 2t)번.
     키 수가 같을 때 t를 키우면 차례로 찾기의 비교는 늘고, 이분 탐색의 비교는 lg n 언저리에 머문다.
  5. 확인 문제의 답.
"""
import math
import random


class Node:
    def __init__(self, keys=None, ch=None):
        self.keys = list(keys or [])
        self.ch = list(ch or [])

    @property
    def leaf(self):
        return not self.ch


def K(keys):
    if isinstance(keys, str):
        return [int(a) if a.isdigit() else a for a in keys.split()]
    return list(keys)


def T(spec):
    if isinstance(spec, tuple):
        keys, kids = spec
        return Node(K(keys), [T(c) for c in kids])
    return Node(K(spec))


def height(x):
    return 0 if x.leaf else 1 + height(x.ch[0])


class Count:
    """세는 것: 지나간 노드, 디스크 읽기(DISK-READ), 키 비교."""

    def __init__(self):
        self.path = []
        self.reads = 0
        self.compares = 0


def search(x, k, c=None):
    """B-TREE-SEARCH(x, k). 찾으면 (노드, 자리), 없으면 None(NIL)."""
    c = c or Count()
    c.path.append(x.keys)
    i = 0                                           # 1행 (의사코드의 i = 1)
    while i < len(x.keys):                          # 2~3행: k 이상인 첫 키를 찾는다
        c.compares += 1
        if not k > x.keys[i]:
            break
        i += 1
    if i < len(x.keys) and k == x.keys[i]:          # 4~5행: 찾았다
        return x, i
    if x.leaf:                                      # 6~7행: 잎인데 없으면 트리에 없다
        return None
    c.reads += 1                                    # 8행: DISK-READ(x.c_i)
    return search(x.ch[i], k, c)                    # 9행


def search_binary(x, k, c=None):
    """노드 안에서 이분 탐색을 쓰는 판(17.B-트리 연습 p3). 돌려주는 값은 search와 같다."""
    c = c or Count()
    c.path.append(x.keys)
    lo, hi = 0, len(x.keys)                         # k 이상인 첫 키의 자리를 [lo, hi)에서 좁힌다
    while lo < hi:
        mid = (lo + hi) // 2
        c.compares += 1
        if x.keys[mid] < k:
            lo = mid + 1
        else:
            hi = mid
    i = lo
    if i < len(x.keys) and k == x.keys[i]:
        return x, i
    if x.leaf:
        return None
    c.reads += 1
    return search_binary(x.ch[i], k, c)


def split_child(x, i, t):
    y = x.ch[i]
    z = Node(y.keys[t:], y.ch[t:])
    mid = y.keys[t - 1]
    y.keys = y.keys[:t - 1]
    y.ch = y.ch[:t]
    x.ch.insert(i + 1, z)
    x.keys.insert(i, mid)


def insert(root, k, t):
    if len(root.keys) == 2 * t - 1:
        root = Node([], [root])
        split_child(root, 0, t)
    x = root
    while not x.leaf:
        i = sum(1 for a in x.keys if a < k)
        if len(x.ch[i].keys) == 2 * t - 1:
            split_child(x, i, t)
            if k > x.keys[i]:
                i += 1
        x = x.ch[i]
    x.keys.append(k)
    x.keys.sort()
    return root


def main():
    # 1. 문서의 예
    tree = T(("M", [("D H", ["B C", "F G", "J K L"]), ("Q T X", ["N P", "R S", "V W", "Y Z"])]))
    c = Count()
    node, i = search(tree, "R", c)
    assert node.keys == ["R", "S"] and i == 0                       # 의사코드로는 (y, 1)
    assert c.path == [["M"], ["Q", "T", "X"], ["R", "S"]] and c.reads == 2
    print("[OK] R 찾기: [M] -> [Q T X] -> [R S], [R S]의 첫째 키, 디스크 읽기 2번")

    # 2. 없는 키
    c = Count()
    assert search(tree, "U", c) is None
    assert c.path == [["M"], ["Q", "T", "X"], ["V", "W"]] and c.reads == 2
    print("[OK] U 찾기: [M] -> [Q T X] -> [V W]에서 NIL")

    # 3. 무작위 트리
    rnd = random.Random(20261012)
    searches = 0
    for t in (2, 3, 4, 5, 6):
        for _ in range(60):
            n = rnd.randint(1, 400)
            keys = rnd.sample(range(2000), n)
            r = Node()
            for k in keys:
                r = insert(r, k, t)
            h = height(r)
            present = set(keys)
            for q in rnd.sample(range(-5, 2005), 80):
                a, b = Count(), Count()
                ra, rb = search(r, q, a), search_binary(r, q, b)
                assert (ra is not None) == (q in present)
                assert (ra is None and rb is None) or (ra[0] is rb[0] and ra[1] == rb[1])
                if ra is not None:
                    assert ra[0].keys[ra[1]] == q
                else:
                    assert len(a.path) == h + 1                      # 없는 키는 잎까지 내려가야 끝난다
                assert a.path == b.path and len(a.path) <= h + 1 and a.reads == len(a.path) - 1 <= h
                assert a.compares <= (h + 1) * (2 * t - 1)
                assert b.compares <= (h + 1) * math.ceil(math.log2(2 * t))
                searches += 1
    print("[OK] 무작위 검색 %d번(t = 2~6): 답이 맞고, 지나는 노드는 높이 + 1개 이하, 차례로 찾기와 이분 탐색이 같은 자리" % searches)

    # 4. 키 수가 같을 때 t에 따른 비교 횟수 (가장 많이 든 검색 기준)
    n = 20000
    keys = [(j * 7919) % n for j in range(n)]                       # 0 ~ n-1을 뒤섞은 순서(7919와 n은 서로소)
    assert sorted(keys) == list(range(n))
    lg_n = math.log2(n)
    rows = []
    for t in (2, 8, 32, 128, 512):
        r = Node()
        for k in keys:
            r = insert(r, k, t)
        h = height(r)
        worst_lin = worst_bin = 0
        for q in range(0, n, 7):
            a, b = Count(), Count()
            search(r, q, a)
            search_binary(r, q, b)
            worst_lin = max(worst_lin, a.compares)
            worst_bin = max(worst_bin, b.compares)
        rows.append((t, h, worst_lin, worst_bin))
        assert worst_bin <= 2 * lg_n                                # 이분 탐색 판은 t와 무관하게 lg n의 몇 배 안
    assert rows == [(2, 10, 19, 19), (8, 4, 43, 17), (32, 2, 86, 15), (128, 1, 277, 15), (512, 1, 651, 15)]   # 문서의 표
    assert [h for _, h, _, _ in rows] == sorted((h for _, h, _, _ in rows), reverse=True)     # t가 크면 낮아진다
    assert rows[-1][2] > 10 * rows[-1][3]                           # t = 512: 차례로 찾기는 이분 탐색의 10배 넘게 비교한다
    assert rows[0][2] < rows[-1][2]                                 # 차례로 찾기의 비교는 t가 크면 는다
    print("[OK] 키 %d개(lg n = %.1f)에서 가장 많이 든 비교 횟수" % (n, lg_n))
    for t, h, wl, wb in rows:
        print("     t = %-3d 높이 %d  차례로 %4d번  이분 탐색 %2d번" % (t, h, wl, wb))
    # lg t * log_t n = lg n
    for t in (2, 8, 32, 128, 512):
        assert abs(math.log2(t) * math.log(n, t) - lg_n) < 1e-9

    # 5. 확인 문제
    c = Count()
    node, i = search(tree, "K", c)
    assert c.path == [["M"], ["D", "H"], ["J", "K", "L"]] and i == 1 and c.reads == 2       # C1: 의사코드로는 (y, 2)
    c = Count()
    assert search(tree, "A", c) is None and c.path == [["M"], ["D", "H"], ["B", "C"]]       # C1 뒷부분
    c = Count()
    node, i = search(tree, "T", c)
    assert c.path == [["M"], ["Q", "T", "X"]] and i == 1 and c.reads == 1                   # C4: 내부 노드에서 멈춘다
    c = Count()
    node, i = search(tree, "M", c)
    assert c.reads == 0 and i == 0                                                          # 뿌리에 있으면 디스크 읽기 0번
    # 알고리즘/20.이분 탐색의 카드 C5: 키 1,023개짜리 노드 하나(t = 512의 가득 찬 노드)
    big = Node(list(range(1, 2047, 2)))                      # 홀수 1, 3, ..., 2045: 1,023개
    assert len(big.keys) == 1023 == 2 * 512 - 1
    worst_lin = worst_bin = 0
    for q in range(0, 2048):                                 # 들어 있는 키와 그 사이의 값을 모두 찾아 본다
        a, b = Count(), Count()
        ra, rb = search(big, q, a), search_binary(big, q, b)
        assert (ra is None) == (rb is None) == (q % 2 == 0 or q > 2045)
        worst_lin, worst_bin = max(worst_lin, a.compares), max(worst_bin, b.compares)
    assert worst_lin == 1023 and worst_bin == 10 == math.ceil(math.log2(1023 + 1))
    print("[OK] 확인 문제 C1, C4의 답. 키 1,023개짜리 노드: 차례로 많아야 1,023번, 이분 탐색 많아야 10번")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
