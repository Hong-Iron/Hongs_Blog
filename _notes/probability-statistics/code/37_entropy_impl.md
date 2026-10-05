---
layout: "note"
title: "37_entropy_impl.py"
display_title: "37_entropy_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "37"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/entropy/"
parent_title: "엔트로피"
description: "확률과 통계 · 엔트로피 구현 코드"
permalink: "/studies/probability-statistics/code/37_entropy_impl/"
---
{% raw %}
[엔트로피](/Hongs_Blog/studies/probability-statistics/entropy/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""허프만 부호 구현과 자체 테스트.

문서: 37.엔트로피
huffman(probs) -> 기호별 부호 길이 목록
    가장 작은 확률 둘을 합치는 일을 하나가 남을 때까지 되풀이한다. 합쳐질 때마다 그 안의 기호들의 부호가 한 비트씩 길어진다.
entropy(probs) -> 비트 단위 엔트로피
"""
import heapq
import math


def entropy(probs):
    return -sum(p * math.log2(p) for p in probs if p > 0)


def huffman(probs):
    if len(probs) == 1:
        return [1]
    heap = [(p, i, [i]) for i, p in enumerate(probs)]
    heapq.heapify(heap)
    lengths = [0] * len(probs)
    tie = len(probs)
    while len(heap) > 1:
        p1, _, s1 = heapq.heappop(heap)
        p2, _, s2 = heapq.heappop(heap)
        for s in s1 + s2:
            lengths[s] += 1
        heapq.heappush(heap, (p1 + p2, tie, s1 + s2))
        tie += 1
    return lengths


if __name__ == "__main__":
    p = [0.5, 0.25, 0.125, 0.125]
    L = huffman(p)
    assert sorted(L) == [1, 2, 3, 3] and abs(sum(a * b for a, b in zip(p, L)) - 1.75) < 1e-12
    assert abs(entropy(p) - 1.75) < 1e-12
    assert sum(2 ** -l for l in L) <= 1 + 1e-12              # 크래프트 부등식
    q = [0.9, 0.1]
    assert huffman(q) == [1, 1] and abs(entropy(q) - 0.469) < 1e-3
    print("impl tests passed")
```
{% endraw %}
