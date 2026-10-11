---
layout: "note"
title: "26_tree-from-traversals_verify.py"
display_title: "26_tree-from-traversals_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/tree-from-traversals/"
parent_title: "순회 결과로 이진 트리 되살리기"
description: "자료구조 · 순회 결과로 이진 트리 되살리기 검증 코드"
permalink: "/studies/data-structures/code/26_tree-from-traversals_verify/"
---
{% raw %}
[순회 결과로 이진 트리 되살리기](/Hongs_Blog/studies/data-structures/tree-from-traversals/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""순회 결과로 이진 트리 되살리기: 어느 조합이 트리를 하나로 정하는지 전수로 센다.

실행: python3 26_tree-from-traversals_verify.py   (표준 라이브러리만 쓴다)

글자가 서로 다른 노드 n개짜리 이진 트리를 모두 만든다(모양 × 글자 붙이는 순서).
트리는 (글자, 왼쪽, 오른쪽) 튜플, 빈 트리는 None.
순회 결과가 같은 트리끼리 묶어서, 묶음의 크기가 1이면 그 순회 결과가 트리를 하나로 정한 것이다.
"""
from collections import defaultdict, deque
from functools import lru_cache
from itertools import permutations
from math import comb, factorial


@lru_cache(maxsize=None)
def shapes(n):
    if n == 0:
        return (None,)
    return tuple((l, r) for k in range(n) for l in shapes(k) for r in shapes(n - 1 - k))


def label(shape, letters):
    """모양에 글자를 전위 순서로 붙인다. letters는 리스트이고 앞에서부터 꺼낸다"""
    if shape is None:
        return None
    x = letters.pop(0)
    left = label(shape[0], letters)
    right = label(shape[1], letters)
    return (x, left, right)


def pre(t):
    return "" if t is None else t[0] + pre(t[1]) + pre(t[2])


def ino(t):
    return "" if t is None else ino(t[1]) + t[0] + ino(t[2])


def post(t):
    return "" if t is None else post(t[1]) + post(t[2]) + t[0]


def level(t):
    out, q = "", deque([t] if t is not None else [])
    while q:
        x, l, r = q.popleft()
        out += x
        if l is not None:
            q.append(l)
        if r is not None:
            q.append(r)
    return out


def one_child_nodes(t):
    """자식이 정확히 하나인 노드의 수"""
    if t is None:
        return 0
    here = 1 if (t[1] is None) != (t[2] is None) else 0
    return here + one_child_nodes(t[1]) + one_child_nodes(t[2])


def all_trees(n):
    letters = "abcdefg"[:n]
    for s in shapes(n):
        for p in permutations(letters):
            yield label(s, list(p))


def catalan(n):
    return comb(2 * n, n) // (n + 1)


if __name__ == "__main__":
    KEYS = {
        "전위": pre, "중위": ino, "후위": post, "레벨": level,
    }
    PAIRS = [("중위", "전위"), ("중위", "후위"), ("중위", "레벨"),
             ("전위", "후위"), ("전위", "레벨"), ("후위", "레벨")]
    table = {}
    for n in range(1, 7):
        trees = list(all_trees(n))
        assert len(trees) == catalan(n) * factorial(n)
        assert len(set(trees)) == len(trees)                 # 모두 다른 트리다
        seqs = [{name: f(t) for name, f in KEYS.items()} for t in trees]

        # (1) 순회 결과 하나: 글자 n개를 늘어놓은 줄마다 트리가 카탈란 수만큼 있다
        for name in KEYS:
            groups = defaultdict(int)
            for s in seqs:
                groups[s[name]] += 1
            assert len(groups) == factorial(n)
            assert set(groups.values()) == {catalan(n)}

        # (2) 순회 결과 둘
        for x, y in PAIRS:
            groups = defaultdict(list)
            for t, s in zip(trees, seqs):
                groups[(s[x], s[y])].append(t)
            biggest = max(len(g) for g in groups.values())
            table[(n, x, y)] = (len(groups), biggest)
            if x == "중위":
                assert biggest == 1                           # 중위가 끼면 늘 하나로 정해진다
            elif n >= 2:
                assert biggest >= 2                           # 중위가 없으면 겹치는 트리가 있다
            if (x, y) == ("전위", "후위"):
                # 전위·후위가 같은 트리는 정확히 2^(자식이 하나인 노드 수)개다
                for g in groups.values():
                    k = one_child_nodes(g[0])
                    assert all(one_child_nodes(t) == k for t in g)
                    assert len(g) == 2 ** k
        # (3) 넷 다 주면 당연히 하나다
        assert len({tuple(s.values()) for s in seqs}) == len(trees)

    # 본문의 수치
    assert catalan(2) == 2 and catalan(3) == 5 and catalan(10) == 16796
    # 노드 3개, 전위 abc: 다섯 모양 모두 가능하다
    three = [t for t in all_trees(3) if pre(t) == "abc"]
    assert len(three) == 5
    # 그 가운데 후위가 cba인 것은 한 줄로 늘어선 네 개(왼왼, 왼오, 오왼, 오오)다
    chains = [t for t in three if post(t) == "cba"]
    assert len(chains) == 4 and all(one_child_nodes(t) == 2 for t in chains)
    assert sorted(ino(t) for t in chains) == ["abc", "acb", "bca", "cba"]
    # 남은 하나(a 아래에 b, c)는 후위가 bca이고 혼자다
    assert [post(t) for t in three if post(t) != "cba"] == ["bca"]
    # 전위 + 레벨, 후위 + 레벨로 안 정해지는 가장 작은 예는 슬라이드의 노드 둘짜리다
    assert table[(2, "전위", "레벨")] == (2, 2) and table[(2, "후위", "레벨")] == (2, 2)
    assert table[(2, "전위", "후위")] == (2, 2) and table[(2, "중위", "전위")] == (4, 1)
    # 노드 3개: 트리 30개, (전위, 후위) 쌍은 12가지뿐
    assert table[(3, "전위", "후위")] == (12, 4) and table[(3, "중위", "전위")] == (30, 1)

    # 슬라이드 p.51의 예: 중위·전위가 같은 트리는 하나뿐임은 n = 10이라 전수로는 못 본다.
    # 여기서는 그 트리의 네 순회가 슬라이드와 같은지만 본다
    T = ("a", ("b", ("d", ("g", None, None), ("h", None, None)), ("e", None, ("i", None, None))),
              ("c", ("f", None, ("j", None, None)), None))
    assert (pre(T), ino(T), post(T), level(T)) == ("abdgheicfj", "gdhbeiafjc", "ghdiebjfca", "abcdefghij")

    # 이진 탐색 트리는 전위 한 줄로 되살아난다: 값을 크기 순으로 세운 것이 중위 결과이기 때문이다
    import random
    rng = random.Random(26)

    def bst_insert(t, x):
        if t is None:
            return (x, None, None)
        if x < t[0]:
            return (t[0], bst_insert(t[1], x), t[2])
        return (t[0], t[1], bst_insert(t[2], x))

    def from_in_pre(i, p):
        if not p:
            return None
        k = i.index(p[0])
        return (p[0], from_in_pre(i[:k], p[1:k + 1]), from_in_pre(i[k + 1:], p[k + 1:]))

    for _ in range(500):
        keys = rng.sample("abcdefghijklmnop", rng.randint(1, 12))
        t = None
        for x in keys:
            t = bst_insert(t, x)
        assert ino(t) == "".join(sorted(keys))
        assert from_in_pre("".join(sorted(keys)), pre(t)) == t

    # "작으면 왼쪽, 크거나 같으면 오른쪽" 규칙으로 5, 3, 5를 넣으면 둘째 5는 뿌리의 오른쪽 자식이다
    t = None
    for x in (5, 3, 5):
        t = bst_insert(t, x)
    assert t == (5, (3, None, None), (5, None, None))
    # 1, 2, 3, 4, 5를 차례로 넣으면 오른쪽으로만 내려가는 한 줄: 간선 4개, 층 5개
    t, depth = None, 0
    for x in (1, 2, 3, 4, 5):
        t = bst_insert(t, x)
    while t[2] is not None:
        assert t[1] is None
        t, depth = t[2], depth + 1
    assert depth == 4

    for n in range(1, 7):
        row = ", ".join(f"{x}+{y}: 가장 큰 묶음 {table[(n, x, y)][1]}" for x, y in PAIRS)
        print(f"n = {n} (트리 {catalan(n) * factorial(n)}개) {row}")
    print("ALL CHECKS PASSED")
```
{% endraw %}
