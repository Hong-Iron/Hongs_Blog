---
layout: "note"
title: "12_b-tree-height_verify.py"
display_title: "12_b-tree-height_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "12"
course: "데이터베이스 설계"
course_slug: "database-design"
course_url: "/studies/database-design/"
track: "데이터와 계산"
track_sub: "데이터"
parent_url: "/studies/database-design/b-tree-height/"
parent_title: "B-트리의 높이"
description: "데이터베이스 설계 · B-트리의 높이 검증 코드"
permalink: "/studies/database-design/code/12_b-tree-height_verify/"
---
{% raw %}
[B-트리의 높이](/Hongs_Blog/studies/database-design/b-tree-height/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-트리의 높이 검증: 가장 적게 담을 때 2t^h - 1개, 가득 찼을 때 (2t)^(h+1) - 1개.

문서: 12.B-트리의 높이, 16.B-트리와 이진 탐색 트리 비교, 연습 17.B-트리 연습 p2
출처: 03.3_B-tree.pdf p.18~19, 03.3-2_B-tree-insertion.pdf p.8~9, 03.3_B-tree-solutions.pdf p.2
실행: python3 12_b-tree-height_verify.py

확인하는 것 (증명이 아니라 실험이다. 증명은 문서에 있다)
  1. 가장 홀쭉한 트리(뿌리는 키 1개, 나머지는 t - 1개)를 실제로 만들어 세면 깊이 i의 노드가 2t^(i-1)개, 키가 2t^h - 1개다.
  2. 모든 노드가 가득 찬 트리를 만들어 세면 깊이 i의 노드가 (2t)^i개, 키가 (2t)^(h+1) - 1개다.
  3. 등비급수: 1 + (t-1) * sum 2t^(i-1) = 2t^h - 1, (2t-1) * sum (2t)^i = (2t)^(h+1) - 1.
  4. 정리 h <= log_t((n+1)/2): 작은 n에서는 올바른 B-트리를 빠짐없이 만들어, 큰 n에서는 무작위 삽입으로 만든 트리에서 확인한다.
     상한은 딱 맞는다(그 높이의 트리가 실제로 있다). 아래쪽 한계 h >= log_2t(n+1) - 1도 같이 본다.
  5. 가정을 빼면 깨지는 예: 잎 깊이가 달라도 되면 높이가 한없이 커진다.
  6. 문서와 확인 문제의 수.
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


def height(x):
    return 0 if x.leaf else 1 + height(x.ch[0])


def count_keys(x):
    return len(x.keys) + sum(count_keys(c) for c in x.ch)


def nodes_by_depth(x):
    out, cur = [], [x]
    while cur:
        out.append(len(cur))
        cur = [c for n in cur for c in n.ch]
    return out


def check(root, t):
    """B-트리 성질을 모두 확인하고 높이를 돌려준다."""
    depths = set()

    def rec(x, lo, hi, depth, is_root):
        n = len(x.keys)
        assert n <= 2 * t - 1 and (is_root or n >= t - 1)
        assert all(a <= b for a, b in zip(x.keys, x.keys[1:]))
        assert all((lo is None or lo <= k) and (hi is None or k <= hi) for k in x.keys)
        if x.leaf:
            depths.add(depth)
            return
        assert n >= 1 and len(x.ch) == n + 1
        bounds = [lo] + x.keys + [hi]
        for i, c in enumerate(x.ch):
            rec(c, bounds[i], bounds[i + 1], depth + 1, False)

    rec(root, None, None, 0, True)
    assert len(depths) == 1
    return depths.pop()


def shaped(t, h, root_keys, other_keys):
    """뿌리는 키 root_keys개, 나머지 노드는 other_keys개인 높이 h짜리 트리. 키는 1부터 차례로 매긴다."""
    counter = [0]

    def make(depth, nkeys):
        node = Node()
        if depth == h:
            for _ in range(nkeys):
                counter[0] += 1
                node.keys.append(counter[0])
            return node
        for j in range(nkeys + 1):
            node.ch.append(make(depth + 1, other_keys))
            if j < nkeys:
                counter[0] += 1
                node.keys.append(counter[0])
        return node

    return make(0, root_keys)


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


def heights_of_all_btrees(n, t):
    """키 n개를 담는 최소 차수 t의 B-트리가 가질 수 있는 높이를 모두 구한다(모양을 빠짐없이 따진다)."""
    memo = {}

    def can(m, h, is_root):
        """키 m개로 높이 h짜리 (서브)트리를 만들 수 있는가."""
        key = (m, h, is_root)
        if key in memo:
            return memo[key]
        lo = 1 if is_root else t - 1
        if h == 0:
            ok = lo <= m <= 2 * t - 1
        else:
            ok = False
            for r in range(lo, 2 * t):                # 이 노드의 키 수 r, 자식 r + 1개
                rest = m - r
                # 자식 r + 1개가 키 rest개를 나눠 갖는다. 자식 하나가 가질 수 있는 키 수의 집합으로 따진다.
                sizes = [s for s in range(0, rest + 1) if can(s, h - 1, False)]
                reach = {0}
                for _ in range(r + 1):
                    reach = {a + s for a in reach for s in sizes if a + s <= rest}
                if rest in reach:
                    ok = True
                    break
        memo[key] = ok
        return ok

    return [h for h in range(0, n + 1) if can(n, h, True)]


def upper(n, t):
    """h <= log_t((n+1)/2)인 가장 큰 정수 h. 2t^h <= n + 1을 정수로 따진다."""
    h = 0
    while 2 * t ** (h + 1) <= n + 1:
        h += 1
    return h


def lower(n, t):
    """(2t)^(h+1) - 1 >= n인 가장 작은 정수 h."""
    h = 0
    while (2 * t) ** (h + 1) - 1 < n:
        h += 1
    return h


def main():
    # 1. 가장 홀쭉한 트리
    for t in (2, 3, 4, 5):
        for h in range(0, 5):
            tree = shaped(t, h, 1, t - 1)
            assert check(tree, t) == h
            assert nodes_by_depth(tree) == [1] + [2 * t ** (i - 1) for i in range(1, h + 1)]
            assert count_keys(tree) == 2 * t ** h - 1
    print("[OK] 가장 홀쭉한 트리(t = 2~5, h = 0~4): 깊이 i의 노드 2t^(i-1)개, 키 2t^h - 1개")

    # 2. 가득 찬 트리
    for t in (2, 3, 4):
        for h in range(0, 4):
            tree = shaped(t, h, 2 * t - 1, 2 * t - 1)
            assert check(tree, t) == h
            assert nodes_by_depth(tree) == [(2 * t) ** i for i in range(h + 1)]
            assert count_keys(tree) == (2 * t) ** (h + 1) - 1
    print("[OK] 가득 찬 트리(t = 2~4, h = 0~3): 깊이 i의 노드 (2t)^i개, 키 (2t)^(h+1) - 1개")

    # 3. 등비급수
    for t in range(2, 12):
        for h in range(0, 9):
            assert 1 + (t - 1) * sum(2 * t ** (i - 1) for i in range(1, h + 1)) == 2 * t ** h - 1
            assert sum(t ** (i - 1) for i in range(1, h + 1)) * (t - 1) == t ** h - 1
            assert (2 * t - 1) * sum((2 * t) ** i for i in range(h + 1)) == (2 * t) ** (h + 1) - 1
    print("[OK] 두 등비급수의 합 (t = 2~11, h = 0~8)")

    # 4. 정리: 전수(작은 n)와 무작위(큰 n)
    for t in (2, 3, 4):
        for n in range(1, 41):
            hs = heights_of_all_btrees(n, t)
            assert hs and max(hs) == upper(n, t) and min(hs) == lower(n, t), (t, n, hs)
            assert hs == list(range(min(hs), max(hs) + 1))
            assert all(h <= math.log((n + 1) / 2, t) + 1e-9 for h in hs)
    print("[OK] 키 1~40개(t = 2, 3, 4)의 모든 B-트리: 가장 큰 높이 = floor(log_t((n+1)/2)), 가장 작은 높이 = ceil(log_2t(n+1)) - 1")
    rnd = random.Random(20261012)
    trees = 0
    for t in (2, 3, 5, 10, 50):
        for _ in range(40):
            n = rnd.randint(1, 3000)
            r = Node()
            for k in rnd.sample(range(10 ** 6), n):
                r = insert(r, k, t)
            h = check(r, t)
            assert count_keys(r) == n and lower(n, t) <= h <= upper(n, t)
            assert 2 * t ** h - 1 <= n <= (2 * t) ** (h + 1) - 1
            trees += 1
    print("[OK] 무작위 삽입으로 만든 트리 %d개(t = 2~50, 키 1~3,000개): 2t^h - 1 <= n <= (2t)^(h+1) - 1" % trees)

    # 5. 가정을 빼면: 잎 깊이가 달라도 되면 한 줄로 늘어진다 (t = 2, 키 7개인데 높이 3)
    chain = Node([2], [Node([1]), Node([4], [Node([3]), Node([6], [Node([5]), Node([7])])])])

    def deepest(x):
        return 0 if x.leaf else 1 + max(deepest(c) for c in x.ch)

    assert count_keys(chain) == 7 and deepest(chain) == 3 and upper(7, 2) == 2
    try:
        check(chain, 2)
        raise SystemExit("잎 깊이가 다른 트리가 통과했다")
    except AssertionError:
        pass
    # 키 수의 아래 한계를 빼면: t = 3인데 노드마다 키 1개씩만 두면 키 7개로 높이 2가 된다(정리의 한계는 1)
    thin = shaped(3, 2, 1, 1)
    assert count_keys(thin) == 7 and height(thin) == 2 and upper(7, 3) == 1 and abs(math.log(4, 3) - 1.262) < 0.001
    try:
        check(thin, 3)
        raise SystemExit("키가 모자란 트리가 통과했다")
    except AssertionError:
        pass
    assert check(thin, 2) == 2                                                       # 같은 트리가 t = 2로는 올바르다
    # 뿌리는 키 1개여도 되므로 식 앞에 2가 붙는다: t = 3, 높이 1의 가장 적은 키 수는 5
    assert 2 * 3 ** 1 - 1 == 5 and count_keys(shaped(3, 1, 1, 2)) == 5
    # 키가 없는 트리(빈 잎 하나)는 높이 0인데 log_t(1/2)는 음수다
    assert height(Node()) == 0 and math.log(0.5, 2) < 0
    print("[OK] 가정을 빼면: 잎 깊이가 달라도 되면 키 7개로 깊이 3(한계 2), 키 수 아래 한계가 없으면 t = 3에서 키 7개로 높이 2(한계 1)")

    # 6. 문서의 수
    table = [(h, 2 * 2 ** h - 1, 4 ** (h + 1) - 1) for h in range(4)]
    assert table == [(0, 1, 3), (1, 3, 15), (2, 7, 63), (3, 15, 255)]                 # 예시 표, t = 2
    assert upper(5, 2) == 1 and lower(5, 2) == 1                                     # 연습 1의 네 트리는 모두 높이 1
    assert heights_of_all_btrees(3, 2) == [0, 1] and upper(3, 2) == 1                # 오해 항목: 키 3개면 높이 0 또는 1
    assert upper(1000, 3) == 5 and 3 ** 5 == 243 and 3 ** 6 == 729                   # C3
    assert abs(math.log(500.5, 3) - 5.657) < 0.001
    assert lower(1000, 3) == 3 and 6 ** 3 - 1 == 215 and 6 ** 4 - 1 == 1295          # C3: 가장 낮으면 3
    assert 4 ** 3 - 1 == 63 and 2 * 2 ** 2 - 1 == 7                                  # C5: t = 2, h = 2
    assert 1001 ** 3 - 1 == 1003003000                                               # 3 p.13 그림
    # 16.비교 문서: 키 100만 개
    n = 10 ** 6
    assert math.ceil(math.log2(n + 1)) - 1 == 19                                     # 가장 고른 이진 탐색 트리의 높이
    assert upper(n, 100) == 2 and lower(n, 100) == 2                                 # t = 100인 B-트리는 높이 2
    assert abs(math.log((n + 1) / 2, 100) - 2.849) < 0.001
    assert upper(n, 2) == 18 and lower(n, 2) == 9                                    # t = 2면 9~18
    # log_t n = lg n / lg t
    for t in (2, 4, 16, 100, 1024):
        for m in (10, 1000, 10 ** 6, 10 ** 9):
            assert abs(math.log(m, t) - math.log2(m) / math.log2(t)) < 1e-9
    print("[OK] 문서의 표와 확인 문제의 수")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
