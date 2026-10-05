---
layout: "note"
title: "11_partial-orders_verify.py"
display_title: "11_partial-orders_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/partial-orders/"
parent_title: "부분순서와 위상 정렬"
description: "이산수학 · 부분순서와 위상 정렬 검증 코드"
permalink: "/studies/discrete-math/code/11_partial-orders_verify/"
---
{% raw %}
[부분순서와 위상 정렬](/Hongs_Blog/studies/discrete-math/partial-orders/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""부분순서와 위상 정렬 검증.

문서: 11.부분순서와 위상 정렬 (예시, 정의, 증명, 예제, 카드 C1~C3)
주장 1: 칸 알고리즘(쓸 수 있는 것 중 가장 작은 번호를 고름)의 결과는 모든 간선 u -> v에서 u가 앞이다.
        사이클이 있으면 남는 정점이 생긴다 (무작위 그래프 2,000개).
주장 2: 무작위 DAG에서 칸 알고리즘이 만든 순서는 전수로 센 선형 확장 중 하나이고, 선형 확장 수를 셀 수 있다.
주장 3: 예시 과목 그래프의 순서와 선형 확장 수.
주장 4: {1..12}에서 나누어떨어짐은 부분순서이고, 최소 원소는 1, 극대 원소는 7..12이다.
"""
import heapq
import random
from itertools import permutations


def kahn(n, edges):
    indeg = [0] * n
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v); indeg[v] += 1
    heap = [v for v in range(n) if indeg[v] == 0]
    heapq.heapify(heap)
    out, steps = [], []
    while heap:
        u = heapq.heappop(heap)
        steps.append((u, sorted(heap)))
        out.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                heapq.heappush(heap, v)
    return out, steps


def linear_extensions(n, edges):
    return [p for p in permutations(range(n)) if all(p.index(u) < p.index(v) for u, v in edges)]


def main():
    rng = random.Random(11)
    for _ in range(2000):
        n = rng.randint(1, 7)
        edges = {(u, v) for u in range(n) for v in range(n) if u != v and rng.random() < 0.25}
        order, _ = kahn(n, edges)
        exts = linear_extensions(n, edges)
        if exts:
            assert len(order) == n and tuple(order) in exts
        else:
            assert len(order) < n
    print("[OK] 주장 1·2·카드 C3: 칸 알고리즘 vs 전수 (무작위 2,000개)")

    names = ["함수", "지수", "로그", "삼각함수", "미분", "적분"]
    edges = [(0, 1), (1, 2), (0, 3), (2, 4), (3, 4), (4, 5)]
    order, steps = kahn(6, edges)
    assert [names[i] for i in order] == ["함수", "지수", "로그", "삼각함수", "미분", "적분"]
    assert len(linear_extensions(6, edges)) == 3
    print(f"[OK] 주장 3·카드 C2: 순서 {[names[i] for i in order]}, 선형 확장 3가지")

    X = range(1, 13)
    R = {(a, b) for a in X for b in X if b % a == 0}
    assert all((a, a) in R for a in X)
    assert all(not ((b, a) in R and a != b) for a, b in R)
    assert all((a, d) in R for a, b in R for c, d in R if b == c)
    minimal = [x for x in X if not any((y, x) in R and y != x for y in X)]
    maximal = [x for x in X if not any((x, y) in R and y != x for y in X)]
    assert minimal == [1] and maximal == [7, 8, 9, 10, 11, 12]
    print("[OK] 주장 4: 나누어떨어짐 부분순서, 최소 1, 극대 7..12")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
