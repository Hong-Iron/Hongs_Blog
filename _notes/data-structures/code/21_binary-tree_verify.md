---
layout: "note"
title: "21_binary-tree_verify.py"
display_title: "21_binary-tree_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/binary-tree/"
parent_title: "이진 트리"
description: "자료구조 · 이진 트리 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/21_binary-tree_verify/"
---
{% raw %}
[이진 트리](/Hongs_Blog/studies/data-structures/binary-tree/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""이진 트리 문서의 수치 검증.

실행: python3 21_binary-tree_verify.py   (표준 라이브러리만 쓴다)

높이를 두 가지로 센다.
  - 볼트 표기 h: 뿌리에서 가장 먼 잎까지의 간선 수 (노드 하나 = 0, 빈 트리 = -1)
  - 층 수 표기 L: 층 수 (노드 하나 = 1, 빈 트리 = 0).  L = h + 1

트리는 (왼쪽, 오른쪽) 튜플로, 빈 트리는 None으로 적는다.
"""
from functools import lru_cache
from math import comb, ceil, log2


@lru_cache(maxsize=None)
def shapes(n):
    """노드 n개인 이진 트리 모양 전부. 왼쪽·오른쪽을 구별한다."""
    if n == 0:
        return (None,)
    out = []
    for k in range(n):                      # 왼쪽 부분 트리의 노드 수
        for left in shapes(k):
            for right in shapes(n - 1 - k):
                out.append((left, right))
    return tuple(out)


@lru_cache(maxsize=None)
def height_edges(t):
    """볼트 표기의 높이(간선 수). 빈 트리는 -1."""
    if t is None:
        return -1
    return 1 + max(height_edges(t[0]), height_edges(t[1]))


def levels(t):
    """층 수 표기의 높이(층 수). 빈 트리는 0."""
    return height_edges(t) + 1


def count(t):
    return 0 if t is None else 1 + count(t[0]) + count(t[1])


def level_sizes(t):
    """층마다 노드가 몇 개인지. 0번 원소가 뿌리 층."""
    sizes, layer = [], [t] if t is not None else []
    while layer:
        sizes.append(len(layer))
        layer = [c for node in layer for c in node if c is not None]
    return sizes


def catalan(n):
    return comb(2 * n, n) // (n + 1)


if __name__ == "__main__":
    N = 10
    total = 0
    for n in range(0, N + 1):
        ts = shapes(n)
        total += len(ts)
        # 모양의 수는 카탈란 수다 (n = 3이면 5가지)
        assert len(ts) == catalan(n), (n, len(ts))
        if n == 0:
            continue
        hs = [height_edges(t) for t in ts]
        for t, h in zip(ts, hs):
            assert count(t) == n
            L = h + 1
            # 층 수 표기: L <= n <= 2^L - 1
            assert L <= n <= 2 ** L - 1
            # 볼트 표기: h + 1 <= n <= 2^(h+1) - 1
            assert h + 1 <= n <= 2 ** (h + 1) - 1
            # 거꾸로: ceil(lg(n+1)) - 1 <= h <= n - 1,  ceil(lg(n+1)) <= L <= n
            assert ceil(log2(n + 1)) - 1 <= h <= n - 1
            assert ceil(log2(n + 1)) <= L <= n
            # 증명의 두 보조 사실: 층마다 1개 이상, k번째 층(1부터)에는 2^(k-1)개 이하
            sizes = level_sizes(t)
            assert len(sizes) == L
            for k, s in enumerate(sizes, start=1):
                assert 1 <= s <= 2 ** (k - 1)
        # 두 끝값이 실제로 나온다
        assert max(hs) == n - 1                       # 한 줄로 늘어선 트리
        assert min(hs) == ceil(log2(n + 1)) - 1       # 가장 낮게 채운 트리
        # 높이가 n - 1인 모양(층마다 노드 하나)은 2^(n-1)가지다: 내려갈 때마다 왼쪽·오른쪽을 고른다
        assert sum(1 for h in hs if h == n - 1) == 2 ** (n - 1)
        # n = 2^L - 1이면 모든 층이 꽉 찬 모양이 정확히 하나 있다
        L = n.bit_length()
        if n == 2 ** L - 1:
            assert sum(1 for h in hs if h == L - 1) == 1
    assert total == sum(catalan(n) for n in range(N + 1)) == 23714

    # 본문과 카드의 수치
    assert len(shapes(2)) == 2 and len(shapes(3)) == 5
    # 층이 4개(층 수 높이 4, 볼트 높이 3)면 노드는 4개 이상 15개 이하
    assert (4, 2 ** 4 - 1) == (4, 15)
    hs7 = {height_edges(t) for t in shapes(7)}
    assert min(hs7) == 2 and max(hs7) == 6            # 노드 7개: 볼트 높이 2 ~ 6, 층 3 ~ 7
    # 변별 카드: "높이 3"의 최대 노드 수 - 층 수 표기 7, 볼트 표기 15
    assert 2 ** 3 - 1 == 7 and 2 ** (3 + 1) - 1 == 15
    # 적용 카드: 노드 100개 - 볼트 높이 6 ~ 99, 층 수 7 ~ 100
    assert ceil(log2(101)) - 1 == 6 and ceil(log2(101)) == 7
    # 오해 항목: 노드 1,000개 - 볼트 높이 9 ~ 999
    assert ceil(log2(1001)) - 1 == 9
    # 예시: 문서 그림의 트리 (노드 9개, 층 4개)
    p7 = (((None, None), (None, None)), (None, (None, None)))   # 왼쪽 부분 트리
    p7 = (p7, ((None, None), None))
    assert count(p7) == 9 and levels(p7) == 4 and level_sizes(p7) == [1, 2, 3, 3]

    # 스스로 설명해 보기: 자식이 셋까지인 트리면 층마다 3배, 합은 (3^L - 1) / 2
    for L in range(1, 12):
        assert sum(3 ** (k - 1) for k in range(1, L + 1)) == (3 ** L - 1) // 2
    assert sum(3 ** (k - 1) for k in range(1, 5)) == 40

    print(f"모양 {total}개(n = 0 ~ {N})에서 노드 수 한계 확인")
    print("ALL CHECKS PASSED")
```
{% endraw %}
