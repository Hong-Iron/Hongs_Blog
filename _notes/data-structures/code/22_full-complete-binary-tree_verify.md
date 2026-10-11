---
layout: "note"
title: "22_full-complete-binary-tree_verify.py"
display_title: "22_full-complete-binary-tree_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/full-complete-binary-tree/"
parent_title: "포화 이진 트리와 완전 이진 트리"
description: "자료구조 · 포화 이진 트리와 완전 이진 트리 검증 코드"
permalink: "/studies/data-structures/code/22_full-complete-binary-tree_verify/"
---
{% raw %}
[포화 이진 트리와 완전 이진 트리](/Hongs_Blog/studies/data-structures/full-complete-binary-tree/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""포화 이진 트리와 완전 이진 트리 문서의 수치 검증.

실행: python3 22_full-complete-binary-tree_verify.py   (표준 라이브러리만 쓴다)

번호 규칙을 쓰지 않고 트리를 먼저 만든 뒤(위층부터, 같은 층은 왼쪽부터 자식을 하나씩 붙인다),
만들어진 연결에서 부모·자식 번호를 읽어 공식과 비교한다.
번호는 1부터 센다. 높이 h는 간선 수(볼트 표기), 층 수 L = h + 1이 강의의 높이다.
"""
from collections import deque
from math import ceil, floor, log2


def build_complete(n):
    """노드 n개인 완전 이진 트리를 '빈자리를 위에서부터, 왼쪽부터 채우기'로 만든다.

    돌려주는 것: parent[i], left[i], right[i], depth[i] (없으면 0, 깊이는 뿌리가 0).
    번호 i는 붙인 순서다. 공식 i // 2, 2 * i, 2 * i + 1은 여기서 쓰지 않는다.
    """
    parent = [0] * (n + 1)
    left = [0] * (n + 1)
    right = [0] * (n + 1)
    depth = [0] * (n + 1)
    if n == 0:
        return parent, left, right, depth
    waiting = deque([1])            # 아직 자식 자리가 남은 노드, 위층·왼쪽부터
    nxt = 2
    while nxt <= n:
        p = waiting[0]
        if left[p] == 0:
            left[p] = nxt
        else:
            right[p] = nxt
            waiting.popleft()
        parent[nxt] = p
        depth[nxt] = depth[p] + 1
        waiting.append(nxt)
        nxt += 1
    return parent, left, right, depth


if __name__ == "__main__":
    N = 1000
    for n in range(1, N + 1):
        parent, left, right, depth = build_complete(n)
        for i in range(1, n + 1):
            # 부모: i = 1이면 없고, 아니면 floor(i / 2)
            assert parent[i] == (0 if i == 1 else i // 2)
            # 왼쪽 자식 2i (2i <= n일 때만), 오른쪽 자식 2i + 1 (2i + 1 <= n일 때만)
            assert left[i] == (2 * i if 2 * i <= n else 0)
            assert right[i] == (2 * i + 1 if 2 * i + 1 <= n else 0)
            # 번호 i의 깊이는 floor(lg i): k번째 층(1부터)은 번호 2^(k-1) ~ 2^k - 1
            assert depth[i] == i.bit_length() - 1 == floor(log2(i))
        h = max(depth[1:])                       # 높이(간선 수)
        L = h + 1                                # 층 수 = 강의의 높이
        assert h == floor(log2(n)) == ceil(log2(n + 1)) - 1
        assert L == ceil(log2(n + 1)) == n.bit_length()
        assert 2 ** (L - 1) <= n <= 2 ** L - 1
        # 잎(자식 없는 노드)은 번호 floor(n/2) + 1 ~ n, 모두 ceil(n/2)개
        leaves = [i for i in range(1, n + 1) if left[i] == 0]
        assert leaves == list(range(n // 2 + 1, n + 1)) and len(leaves) == (n + 1) // 2
        # 자식이 하나뿐인 노드는 n이 짝수일 때 n/2번 하나, 홀수면 없다
        one_child = [i for i in range(1, n + 1) if left[i] and not right[i]]
        assert one_child == ([n // 2] if n % 2 == 0 else [])
        # 포화 이진 트리는 n = 2^L - 1일 때다. 그때 맨 아래층에 2^(L-1)개가 있다
        if n == 2 ** L - 1:
            assert sum(1 for i in range(1, n + 1) if depth[i] == h) == 2 ** h

    # 0번 칸부터 번호를 매기면(j = i - 1): 부모 (j - 1) // 2, 자식 2j + 1, 2j + 2
    for i in range(1, 5000):
        j = i - 1
        assert 2 * j + 1 == (2 * i) - 1 and 2 * j + 2 == (2 * i + 1) - 1
        if i > 1:
            assert (j - 1) // 2 == (i // 2) - 1

    # 본문과 카드의 수치
    parent, left, right, depth = build_complete(10)          # 슬라이드 p.18의 10개짜리
    assert (parent[5], left[5], right[5]) == (2, 10, 0)
    assert (parent[10], left[4], right[4]) == (5, 8, 9)
    assert [i for i in range(1, 11) if left[i] == 0] == [6, 7, 8, 9, 10]
    assert max(depth[1:]) == 3                                # 높이 3(간선), 층 4개
    assert 2 ** 4 - 1 == 15                                   # 층 4개짜리 포화 이진 트리
    parent, left, right, depth = build_complete(15)
    assert all(left[i] and right[i] for i in range(1, 8)) and all(left[i] == 0 for i in range(8, 16))
    parent, left, right, depth = build_complete(12)           # 카드: 노드 12개
    assert (parent[11], left[6], right[6], left[7]) == (5, 12, 0, 0)
    assert max(depth[1:]) == 3 and (12 + 1) // 2 == 6
    assert (1000).bit_length() == 10 and floor(log2(1000)) == 9   # 노드 1,000개: 층 10개
    assert [i.bit_length() for i in (1, 2, 3, 4, 7, 8, 15)] == [1, 2, 2, 3, 3, 4, 4]

    print(f"n = 1 ~ {N}에서 번호 규칙, 높이, 잎의 수 확인")
    print("ALL CHECKS PASSED")
```
{% endraw %}
