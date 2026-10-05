---
layout: "note"
title: "06_sets_verify.py"
display_title: "06_sets_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "06"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/sets/"
parent_title: "집합"
description: "이산수학 · 집합 검증 코드"
permalink: "/studies/discrete-math/code/06_sets_verify/"
---
{% raw %}
[집합](/Hongs_Blog/studies/discrete-math/sets/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""집합 검증.

문서: 06.집합 (예시, 정의, 증명, 예제, 활용, 카드 C1~C3, 자주 하는 오해)
주장 1: 무작위 부분집합에서 드모르간 A - (B ∪ C) = (A - B) ∩ (A - C), A - (B ∩ C) = (A - B) ∪ (A - C), 분배법칙.
주장 2: |𝒫(A)| = 2^|A|, |A × B| = |A|·|B|.
주장 3: 카드 C1 — A = {1,2,3,4}, B = {3,4,5}: A∪B = {1..5}, A∩B = {3,4}, A−B = {1,2}, B−A = {5}, |𝒫(A∩B)| = 4.
주장 4: 비트마스크: A = {0,2,3} -> 13, B = {1,2} -> 6, 합집합 15, 교집합 4.
주장 5: ∅와 {∅}는 크기가 0과 1로 다르다.
"""
import random
from itertools import chain, combinations, product


def powerset(s):
    s = list(s)
    return [set(c) for c in chain.from_iterable(combinations(s, k) for k in range(len(s) + 1))]


def main():
    rng = random.Random(6)
    U = set(range(10))
    for _ in range(3000):
        A, B, C = ({x for x in U if rng.random() < 0.5} for _ in range(3))
        assert A - (B | C) == (A - B) & (A - C) and A - (B & C) == (A - B) | (A - C)
        assert A & (B | C) == (A & B) | (A & C) and A | (B & C) == (A | B) & (A | C)
        assert U - (A | B) == (U - A) & (U - B)
    print("[OK] 주장 1·카드 C2: 드모르간·분배 (무작위 3,000개)")

    for n in range(0, 11):
        assert len(powerset(range(n))) == 2 ** n
        for m in range(0, 6):
            assert len(list(product(range(n), range(m)))) == n * m
    print("[OK] 주장 2")

    A, B = {1, 2, 3, 4}, {3, 4, 5}
    assert A | B == {1, 2, 3, 4, 5} and A & B == {3, 4} and A - B == {1, 2} and B - A == {5}
    assert len(powerset(A & B)) == 4
    print("[OK] 주장 3·카드 C1")

    mask = lambda s: sum(1 << x for x in s)
    a, b = mask({0, 2, 3}), mask({1, 2})
    assert a == 13 and b == 6 and a | b == 15 and a & b == 4
    for _ in range(2000):
        S, T = ({x for x in range(16) if rng.random() < 0.5} for _ in range(2))
        assert mask(S | T) == mask(S) | mask(T) and mask(S & T) == mask(S) & mask(T) and mask(S - T) == mask(S) & ~mask(T)
    print("[OK] 주장 4·카드 C3: 비트마스크")

    empty = frozenset()
    assert len(empty) == 0 and len({empty}) == 1 and empty != frozenset({empty})
    print("[OK] 주장 5·오해")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
