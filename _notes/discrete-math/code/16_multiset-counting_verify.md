---
layout: "note"
title: "16_multiset-counting_verify.py"
display_title: "16_multiset-counting_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/multiset-counting/"
parent_title: "중복을 허용하는 셈"
description: "이산수학 · 중복을 허용하는 셈 검증 코드"
permalink: "/studies/discrete-math/code/16_multiset-counting_verify/"
---
{% raw %}
[중복을 허용하는 셈](/Hongs_Blog/studies/discrete-math/multiset-counting/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""중복을 허용하는 셈 검증.

문서: 16.중복을 허용하는 셈 (예시, 정의, 증명, 예제, 카드 C1~C3)
주장 1: n종류에서 k개를 중복 허용으로 고르는 수 = C(n+k-1, k) (n, k <= 6 전수).
주장 2: 아이스크림 3가지 맛에서 5스쿱: C(7,5) = 21.
주장 3: x1+x2+x3 = 10의 음이 아닌 정수해 C(12,2) = 66, 양의 정수해 C(9,2) = 36.
주장 4: MISSISSIPPI의 서로 다른 배열 11!/(1!4!4!2!) = 34,650 (작은 단어 전수로 공식 확인).
주장 5: 변수 n개의 d차 단항식 수 = C(n+d-1, d).
"""
import math
from itertools import combinations_with_replacement, permutations, product


def main():
    for n in range(1, 7):
        for k in range(0, 7):
            assert len(list(combinations_with_replacement(range(n), k))) == math.comb(n + k - 1, k)
    print("[OK] 주장 1: 전수")

    assert len(list(combinations_with_replacement("abc", 5))) == math.comb(7, 5) == 21
    print("[OK] 주장 2·카드 C1")

    sols = [(a, b, 10 - a - b) for a in range(11) for b in range(11 - a)]
    assert len(sols) == math.comb(12, 2) == 66
    assert sum(1 for s in sols if min(s) >= 1) == math.comb(9, 2) == 36
    print("[OK] 주장 3·카드 C2")

    for w in ("AAB", "AABB", "BANANA", "MISSIS", "AABBCC"):
        brute = len(set(permutations(w)))
        formula = math.factorial(len(w))
        for c in set(w):
            formula //= math.factorial(w.count(c))
        assert brute == formula
    m = math.factorial(11) // (math.factorial(4) * math.factorial(4) * math.factorial(2))
    assert m == 34650
    print("[OK] 주장 4·카드 C3: 34,650")

    for n in range(1, 5):
        for d in range(0, 6):
            monos = {tuple(sorted(c)) for c in product(range(n), repeat=d)}
            assert len(monos) == math.comb(n + d - 1, d)
    print("[OK] 주장 5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
