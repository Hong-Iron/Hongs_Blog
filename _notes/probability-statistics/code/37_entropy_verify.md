---
layout: "note"
title: "37_entropy_verify.py"
display_title: "37_entropy_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "37"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/entropy/"
parent_title: "엔트로피"
description: "확률과 통계 · 엔트로피 검증 코드"
permalink: "/studies/probability-statistics/code/37_entropy_verify/"
---
{% raw %}
[엔트로피](/Hongs_Blog/studies/probability-statistics/entropy/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""엔트로피 검증.

문서: 37.엔트로피 (예시, 정의, 증명, 예제, 오해, 카드 C1~C4)
주장 1: 예시·카드 C1 — (1/2, 1/4, 1/8, 1/8)의 엔트로피 1.75비트 = 부호 0, 10, 110, 111의 평균 길이.
주장 2: 성질 — 0 <= H <= log₂ n(무작위 분포), 균등분포에서 최대, 한 값에 몰리면 0. 독립 쌍의 엔트로피는 합.
주장 3: 카드 C3 — 이진 엔트로피 h(0.9) ≈ 0.469, h(0.5) = 1.
주장 4: 원천 부호화 — 무작위 분포 300개에서 허프만 평균 길이 L이 H <= L < H + 1, 크래프트 합 <= 1.
주장 5: 블록 부호화 — (0.9, 0.1) 기호를 k개씩 묶어 허프만하면 기호당 길이가 1 → 0.469에 다가간다(k = 1, 2, 4, 8).
주장 6: 카드 C4 — (0.25, 0.25, 0.25, 0.25) 2비트 > (0.7, 0.1, 0.1, 0.1) ≈ 1.357비트.
"""
from itertools import product
import heapq
import math
import random


def H(ps):
    return -sum(p * math.log2(p) for p in ps if p > 0)


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


def main():
    p = [0.5, 0.25, 0.125, 0.125]
    codes = ["0", "10", "110", "111"]
    assert H(p) == 1.75 and sum(q * len(c) for q, c in zip(p, codes)) == 1.75
    assert all(not b.startswith(a) for a in codes for b in codes if a != b)     # 접두어 부호
    print("[OK] 주장 1·카드 C1: 1.75비트")

    rng = random.Random(37)
    for _ in range(300):
        n = rng.randint(1, 10)
        w = [rng.random() for _ in range(n)]
        s = sum(w)
        ps = [x / s for x in w]
        assert -1e-12 <= H(ps) <= math.log2(n) + 1e-12
    for n in (2, 5, 16):
        assert abs(H([1 / n] * n) - math.log2(n)) < 1e-12
    assert H([1.0, 0.0, 0.0]) == 0
    a, b = [0.3, 0.7], [0.2, 0.5, 0.3]
    joint = [x * y for x in a for y in b]
    assert abs(H(joint) - H(a) - H(b)) < 1e-12
    print("[OK] 주장 2: 범위, 최대, 독립 합")

    assert abs(H([0.9, 0.1]) - 0.469) < 1e-3 and H([0.5, 0.5]) == 1
    print("[OK] 주장 3·카드 C3")

    for _ in range(300):
        n = rng.randint(2, 12)
        w = [rng.random() ** 3 for _ in range(n)]
        s = sum(w)
        ps = [x / s for x in w]
        L = huffman(ps)
        avg = sum(q * l for q, l in zip(ps, L))
        assert H(ps) - 1e-12 <= avg < H(ps) + 1 and sum(2 ** -l for l in L) <= 1 + 1e-12
    print("[OK] 주장 4: H <= L < H + 1")

    per = []
    for k in (1, 2, 4, 8):
        blocks = [math.prod(t) for t in product([0.9, 0.1], repeat=k)]
        L = huffman(blocks)
        per.append(sum(q * l for q, l in zip(blocks, L)) / k)
    assert per[0] == 1 and all(x >= y - 1e-12 for x, y in zip(per, per[1:])) and per[-1] - H([0.9, 0.1]) < 1 / 8
    print("[OK] 주장 5: 블록 부호", [round(x, 3) for x in per])

    assert H([0.25] * 4) == 2 and abs(H([0.7, 0.1, 0.1, 0.1]) - 1.357) < 1e-3
    print("[OK] 주장 6·카드 C4")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
