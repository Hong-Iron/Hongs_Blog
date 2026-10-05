---
layout: "note"
title: "19_inclusion-exclusion_verify.py"
display_title: "19_inclusion-exclusion_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/inclusion-exclusion/"
parent_title: "포함-배제 원리"
description: "이산수학 · 포함-배제 원리 검증 코드"
permalink: "/studies/discrete-math/code/19_inclusion-exclusion_verify/"
---
{% raw %}
[포함-배제 원리](/Hongs_Blog/studies/discrete-math/inclusion-exclusion/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""포함-배제 원리 검증.

문서: 19.포함-배제 원리 (예시, 정리, 증명, 예제, 카드 C1~C3)
주장 1: 무작위 집합 1~5개에서 포함-배제 공식 = 합집합의 크기 (2,000회).
주장 2: 1..1000에서 2, 3, 5 중 하나 이상으로 나누어떨어지는 수는 734개.
주장 3: 교란순열 D_n = n! Σ (-1)^k / k!: D_1..D_6 = 0, 1, 2, 9, 44, 265. D_n / n! -> 1/e.
주장 4: 5개를 3곳에 빠짐없이 보내는 전사 150개.
주장 5: m개 집합에 속한 원소는 Σ_{j=1}^{m} (-1)^(j+1) C(m,j) = 1번 세어진다.
"""
import math
import random
from itertools import combinations, permutations, product


def main():
    rng = random.Random(19)
    for _ in range(2000):
        m = rng.randint(1, 5)
        sets = [{x for x in range(20) if rng.random() < 0.3} for _ in range(m)]
        total = 0
        for j in range(1, m + 1):
            for group in combinations(sets, j):
                total += (-1) ** (j + 1) * len(set.intersection(*group))
        assert total == len(set().union(*sets))
    print("[OK] 주장 1: 무작위 2,000회")

    brute = sum(1 for x in range(1, 1001) if x % 2 == 0 or x % 3 == 0 or x % 5 == 0)
    ie = 500 + 333 + 200 - 166 - 100 - 66 + 33
    assert brute == ie == 734
    print("[OK] 주장 2·카드 C1: 734")

    D = [sum(1 for p in permutations(range(n)) if all(p[i] != i for i in range(n))) for n in range(1, 7)]
    assert D == [0, 1, 2, 9, 44, 265]
    for n in range(1, 7):
        assert D[n - 1] == round(math.factorial(n) * sum((-1) ** k / math.factorial(k) for k in range(n + 1)))
    ratio = 1334961 / math.factorial(10)  # D_10
    assert abs(ratio - 1 / math.e) < 1e-7
    print("[OK] 주장 3·카드 C3: D_4 = 9, D_10/10! ≈ 1/e")

    assert sum(1 for f in product(range(3), repeat=5) if set(f) == {0, 1, 2}) == 150
    print("[OK] 주장 4")

    for m in range(1, 30):
        assert sum((-1) ** (j + 1) * math.comb(m, j) for j in range(1, m + 1)) == 1
    print("[OK] 주장 5·카드 C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
