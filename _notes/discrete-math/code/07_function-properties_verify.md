---
layout: "note"
title: "07_function-properties_verify.py"
display_title: "07_function-properties_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/function-properties/"
parent_title: "함수의 성질과 집합의 크기"
description: "이산수학 · 함수의 성질과 집합의 크기 검증 코드"
permalink: "/studies/discrete-math/code/07_function-properties_verify/"
---
{% raw %}
[함수의 성질과 집합의 크기](/Hongs_Blog/studies/discrete-math/function-properties/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""함수의 성질과 집합의 크기 검증.

문서: 07.함수의 성질과 집합의 크기 (예시, 정의, 예제, 카드 C1~C3)
주장 1: 정수에서 2x는 단사·비전사, ⌊x/2⌋는 전사·비단사, x + 1은 전단사, x²은 둘 다 아님.
주장 2: 유한 집합에서 단사 A -> B가 있으면 |A| <= |B|, 전사가 있으면 |A| >= |B| (작은 집합 전수).
주장 3: A에서 B로 가는 함수는 |B|^|A|개, 단사는 |B|!/(|B|-|A|)!개 (전수로 셈).
주장 4: {0..n-1}의 부분집합과 n비트 문자열 사이의 대응은 전단사다 (n <= 10).
주장 5: 전단사의 합성은 전단사이고, 역함수와 합성하면 항등함수다.
"""
from itertools import product
import math


def classify(f, window=range(-50, 51), target=range(-20, 21)):
    xs = list(window)
    ys = [f(x) for x in xs]
    inj = len(set(ys)) == len(ys)
    sur = all(any(f(x) == t for x in range(-200, 201)) for t in target)
    return inj, sur


def main():
    assert classify(lambda x: 2 * x) == (True, False)
    assert classify(lambda x: x // 2) == (False, True)
    assert classify(lambda x: x + 1) == (True, True)
    assert classify(lambda x: x * x) == (False, False)
    print("[OK] 주장 1·카드 C1 (유한 창에서 확인)")

    for a in range(0, 5):
        for b in range(0, 5):
            funcs = list(product(range(b), repeat=a))
            has_inj = any(len(set(f)) == a for f in funcs)
            has_sur = any(set(f) == set(range(b)) for f in funcs)
            assert (not has_inj or a <= b) and (not has_sur or a >= b)      # 정리의 방향
            assert (a > b or has_inj) and (not (a >= b >= 1) or has_sur)     # 역방향(공집합이 아닐 때)
            assert len(funcs) == b ** a
            assert sum(1 for f in funcs if len(set(f)) == a) == (math.perm(b, a) if a <= b else 0)
    funcs32 = list(product(range(2), repeat=3))
    assert len(funcs32) == 8 and sum(1 for f in funcs32 if set(f) == {0, 1}) == 6
    print("[OK] 주장 2·3·카드 C2·C3: |A|, |B| <= 4 전수, 3 -> 2 함수 8개 중 전사 6개")

    for n in range(0, 11):
        subsets = {frozenset(i for i in range(n) if m >> i & 1) for m in range(2 ** n)}
        assert len(subsets) == 2 ** n
    print("[OK] 주장 4: 부분집합 ↔ 비트열 전단사")

    f = lambda x: x + 1; finv = lambda x: x - 1; g = lambda x: -x
    for x in range(-100, 101):
        assert finv(f(x)) == x and f(finv(x)) == x
        assert g(f(x)) != g(f(x + 1))
    print("[OK] 주장 5")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
