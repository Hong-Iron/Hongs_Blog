---
layout: "note"
title: "06_cache-memory_verify.py"
display_title: "06_cache-memory_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/cache-memory/"
parent_title: "캐시 메모리"
description: "운영체제 · 캐시 메모리 검증 코드"
permalink: "/studies/operating-systems/code/06_cache-memory_verify/"
---
{% raw %}
[캐시 메모리](/Hongs_Blog/studies/operating-systems/cache-memory/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""캐시 교체 규칙 두 가지가 실제로 다른 블록을 내보낸다는 것을 확인한다.

- LRU(least recently used): 마지막으로 쓴 때가 가장 오래된 블록을 내보낸다.
- LFU(least frequently used): 지금까지 쓴 횟수가 가장 적은 블록을 내보낸다.
슬라이드 53은 LRU를 "다른 블록보다 덜 쓰인 블록"이라고 적었는데, 그것은 LFU의 설명이다.
"""
from collections import OrderedDict, Counter


def lru(refs, slots):
    cache, evicted, hits = OrderedDict(), [], 0
    for b in refs:
        if b in cache:
            hits += 1
            cache.move_to_end(b)        # 방금 썼으니 가장 최근 쪽으로
            continue
        if len(cache) == slots:
            evicted.append(cache.popitem(last=False)[0])   # 가장 오래 안 쓴 블록
        cache[b] = True
    return hits, evicted


def lfu(refs, slots):
    cache, count, evicted, hits = [], Counter(), [], 0
    for b in refs:
        count[b] += 1
        if b in cache:
            hits += 1
            continue
        if len(cache) == slots:
            victim = min(cache, key=lambda x: count[x])     # 쓴 횟수가 가장 적은 블록 (동률이면 먼저 들어온 것)
            cache.remove(victim)
            evicted.append(victim)
        cache.append(b)
    return hits, evicted


if __name__ == "__main__":
    # 칸 2개. A를 여러 번 쓴 뒤 B를 쓰고 C가 들어온다
    refs = ["A", "A", "A", "B", "C"]
    print("LRU", lru(refs, 2), "LFU", lfu(refs, 2))
    assert lru(refs, 2) == (2, ["A"])   # A는 많이 썼지만 마지막으로 쓴 지 가장 오래됐다
    assert lfu(refs, 2) == (2, ["B"])   # B는 최근에 썼지만 한 번밖에 안 썼다

    # 지역성: 같은 블록 근처를 되풀이해 쓰면 칸이 적어도 적중이 많다
    loop = ["A", "B", "C"] * 10
    print("loop LRU 3칸", lru(loop, 3)[0], "/ 30")
    assert lru(loop, 3)[0] == 27         # 처음 세 번만 실패
    # 칸이 하나 모자라면 LRU는 매번 다음에 쓸 블록을 내보낸다
    assert lru(loop, 2)[0] == 0
    print("ALL CHECKS PASSED")
```
{% endraw %}
