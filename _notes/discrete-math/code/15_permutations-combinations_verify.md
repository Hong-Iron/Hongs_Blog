---
layout: "note"
title: "15_permutations-combinations_verify.py"
display_title: "15_permutations-combinations_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/permutations-combinations/"
parent_title: "순열과 조합"
description: "이산수학 · 순열과 조합 검증 코드"
permalink: "/studies/discrete-math/code/15_permutations-combinations_verify/"
---
{% raw %}
[순열과 조합](/Hongs_Blog/studies/discrete-math/permutations-combinations/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""순열과 조합 검증.

문서: 15.순열과 조합 (예시, 정의, 증명, 예제, 카드 C1~C4, 자주 하는 오해)
주장 1: P(n,k) = n!/(n-k)!, C(n,k) = n!/(k!(n-k)!), P(n,k) = C(n,k)·k! (n <= 8 전수).
주장 2: C(n,k) = C(n,n-k), 파스칼 항등식 C(n,k) = C(n-1,k-1) + C(n-1,k).
주장 3: C(52,5) = 2,598,960, 풀하우스 13·C(4,3)·12·C(4,2) = 3,744.
        축소 덱(무늬 4 × 숫자 5 = 20장)에서 전수로 센 풀하우스 = 5·C(4,3)·4·C(4,2) = 480.
주장 4: (0,0)에서 (4,3)까지 오른쪽·위로만 가는 경로 = C(7,3) = 35 = 1이 3개인 7비트 문자열 수.
주장 5: C(5,2) = 10이고 5·4 = 20은 순서를 센 것이다.
주장 6: C(2n, n) ≈ 4^n / √(πn) (n = 100에서 상대오차 < 0.2%).
"""
import math
from collections import Counter
from itertools import combinations, permutations, product


def main():
    for n in range(0, 9):
        for k in range(0, n + 1):
            P = len(list(permutations(range(n), k)))
            C = len(list(combinations(range(n), k)))
            assert P == math.factorial(n) // math.factorial(n - k) == math.perm(n, k)
            assert C == math.comb(n, k) and P == C * math.factorial(k)
            assert math.comb(n, k) == math.comb(n, n - k)
            if 1 <= k <= n - 1:
                assert math.comb(n, k) == math.comb(n - 1, k - 1) + math.comb(n - 1, k)
    print("[OK] 주장 1·2·카드 C1·C3")

    assert math.comb(52, 5) == 2_598_960 and 13 * math.comb(4, 3) * 12 * math.comb(4, 2) == 3744
    deck = [(r, s) for r in range(5) for s in range(4)]
    fh = 0
    for hand in combinations(deck, 5):
        if sorted(Counter(r for r, _ in hand).values()) == [2, 3]:
            fh += 1
    assert fh == 5 * math.comb(4, 3) * 4 * math.comb(4, 2) == 480
    print("[OK] 주장 3·카드 C2: 풀하우스 공식 (축소 덱 전수 480)")

    paths = sum(1 for p in product("RU", repeat=7) if p.count("R") == 4)
    assert paths == math.comb(7, 3) == 35
    print("[OK] 주장 4·카드 C4: 경로 35")

    assert math.comb(5, 2) == 10 and 5 * 4 == 20
    print("[OK] 주장 5·오해")

    n = 100
    approx = 4 ** n / math.sqrt(math.pi * n)
    assert abs(approx / math.comb(2 * n, n) - 1) < 0.002
    print(f"[OK] 주장 6: C(200,100) 어림 상대오차 {abs(approx / math.comb(2*n, n) - 1):.4%}")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
