---
layout: "note"
title: "11_routing_verify.py"
display_title: "11_routing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/routing/"
parent_title: "라우팅"
description: "컴퓨터 통신 · 라우팅 검증 코드"
permalink: "/studies/computer-communication/code/11_routing_verify/"
---
{% raw %}
[라우팅](/Hongs_Blog/studies/computer-communication/routing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""라우팅 예시와 카드 C3의 경로·전달표 검증.

문서: 11.라우팅 (예시, 카드 C3)
그래프: H1-S1, S1-S2, S2-S3, S1-S4, S4-S3, S3-H2
주장 1: H1 -> H2 단순 경로는 H1-S1-S2-S3-H2, H1-S1-S4-S3-H2 두 개뿐이다.
주장 2: S2-S3 링크가 끊기면 남는 경로는 S4를 지나는 것 하나이고,
        S1의 전달표에서 H2의 다음 노드는 S4가 된다.
방법: 단순 경로 전수 탐색(DFS), 전달표는 BFS 최단 경로의 첫 다음 노드로 만든다.
"""
from collections import deque


def graph(edges):
    g = {}
    for u, v in edges:
        g.setdefault(u, set()).add(v)
        g.setdefault(v, set()).add(u)
    return g


def simple_paths(g, s, d):
    out, stack = [], [(s, [s])]
    while stack:
        v, path = stack.pop()
        if v == d:
            out.append(path)
            continue
        for w in g[v]:
            if w not in path:
                stack.append((w, path + [w]))
    return sorted(out)


def next_hop(g, v, d):
    """v에서 d로 가는 최단 경로의 다음 노드 (BFS). 같은 길이면 이름 순으로 먼저인 것."""
    prev, q = {d: None}, deque([d])
    while q:  # d에서 거꾸로 BFS
        x = q.popleft()
        for y in sorted(g[x]):
            if y not in prev:
                prev[y] = x
                q.append(y)
    return prev.get(v)


def main() -> None:
    edges = [("H1", "S1"), ("S1", "S2"), ("S2", "S3"), ("S1", "S4"), ("S4", "S3"), ("S3", "H2")]
    g = graph(edges)
    paths = simple_paths(g, "H1", "H2")
    assert paths == [["H1", "S1", "S2", "S3", "H2"], ["H1", "S1", "S4", "S3", "H2"]]
    assert next_hop(g, "S1", "H2") in {"S2", "S4"}
    print("[OK] H1 -> H2 경로:", [" - ".join(p) for p in paths])

    g2 = graph([e for e in edges if set(e) != {"S2", "S3"}])
    assert simple_paths(g2, "H1", "H2") == [["H1", "S1", "S4", "S3", "H2"]]
    assert next_hop(g2, "S1", "H2") == "S4"
    print("[OK] S2-S3 고장 뒤: 경로 하나, S1 전달표 H2 -> S4")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
