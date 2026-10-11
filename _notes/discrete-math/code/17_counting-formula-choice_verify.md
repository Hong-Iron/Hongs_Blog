---
layout: "note"
title: "17_counting-formula-choice_verify.py"
display_title: "17_counting-formula-choice_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "수학"
parent_url: "/studies/discrete-math/counting-formula-choice/"
parent_title: "순열·조합·중복조합 비교"
description: "이산수학 · 순열·조합·중복조합 비교 검증 코드"
permalink: "/studies/discrete-math/code/17_counting-formula-choice_verify/"
---
{% raw %}
[순열·조합·중복조합 비교](/Hongs_Blog/studies/discrete-math/counting-formula-choice/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""순열·조합·중복조합 비교 검증과 경우의 수 예제 사다리 검증.

문서: 17.순열·조합·중복조합 비교 (카드 C1~C4), 4.연습문제/17.경우의 수 예제 사다리
주장 1: 네 칸 표(순서 × 중복)의 공식을 작은 n, k에서 전수로 확인.
주장 2: 카드 — P(10,3) = 720, C(10,3) = 120, 10^4, C(16,12) = 1,820, C(45,6) = 8,145,060.
주장 3: 서로 다른 작업 5개를 서버 3대에 빠짐없이 나누는 수(전사) 3^5 - 3·2^5 + 3 = 150.
사다리: 26·25·24 = 15,600, C(7,3) = 35, C(12,8) = 495, 각 자리 숫자 합이 5인 세 자리 수 15개, 원탁 5명 4! = 24.
"""
import math
from itertools import combinations, combinations_with_replacement, permutations, product


def main():
    for n in range(1, 6):
        for k in range(0, 5):
            assert len(list(permutations(range(n), k))) == math.perm(n, k)
            assert len(list(product(range(n), repeat=k))) == n ** k
            assert len(list(combinations(range(n), k))) == math.comb(n, k)
            assert len(list(combinations_with_replacement(range(n), k))) == math.comb(n + k - 1, k)
    print("[OK] 주장 1: 네 칸 공식")

    assert math.perm(10, 3) == 720 and math.comb(10, 3) == 120 and 10 ** 4 == 10000
    assert math.comb(16, 12) == 1820 and math.comb(45, 6) == 8_145_060
    print("[OK] 주장 2·카드 C1~C3")

    onto = sum(1 for f in product(range(3), repeat=5) if set(f) == {0, 1, 2})
    assert onto == 3 ** 5 - 3 * 2 ** 5 + 3 * 1 ** 5 == 150
    print("[OK] 주장 3·카드 C4: 150")

    assert 26 * 25 * 24 == 15600 and math.comb(7, 3) == 35 and math.comb(12, 8) == 495
    assert sum(1 for x in range(100, 1000) if sum(map(int, str(x))) == 5) == 15 == math.comb(6, 2)
    assert math.factorial(4) == 24
    print("[OK] 사다리: 15,600 / 35 / 495 / 15 / 24")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
