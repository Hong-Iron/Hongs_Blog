---
layout: "note"
title: "03_predicate-logic_verify.py"
display_title: "03_predicate-logic_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "이산수학"
course_slug: "discrete-math"
course_url: "/studies/discrete-math/"
track: "공학수학"
parent_url: "/studies/discrete-math/predicate-logic/"
parent_title: "술어와 한정기호"
description: "이산수학 · 술어와 한정기호 검증 코드"
permalink: "/studies/discrete-math/code/03_predicate-logic_verify/"
---
{% raw %}
[술어와 한정기호](/Hongs_Blog/studies/discrete-math/predicate-logic/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""술어와 한정기호 검증.

문서: 03.술어와 한정기호 (예시, 정의, 예제, 활용, 카드 C1~C4, 자주 하는 오해)
주장 1: 유한 정의역에서 ∀는 all, ∃는 any이고, ¬∀x P(x) ≡ ∃x ¬P(x), ¬∃x P(x) ≡ ∀x ¬P(x)이다 (무작위 술어 3,000개).
주장 2: 한정기호 순서: ∀x∃y L(x,y)는 참이지만 ∃y∀x L(x,y)는 거짓인 좋아함 표가 있다. 거꾸로 ∃y∀x이면 늘 ∀x∃y다.
주장 3: ∀x (x² >= x)는 정수에서 참, 실수에서 거짓 (x = 0.5).
주장 4: "정렬됨"의 부정은 "어떤 i에서 a[i] > a[i+1]"이다.
주장 5: 오해 — ¬∀x P(x)와 ∀x ¬P(x)는 다르다.
"""
from itertools import product
import random


def main():
    rng = random.Random(3)
    for _ in range(3000):
        D = range(rng.randint(1, 6))
        P = {x: rng.random() < 0.5 for x in D}
        assert (not all(P[x] for x in D)) == any(not P[x] for x in D)
        assert (not any(P[x] for x in D)) == all(not P[x] for x in D)
    print("[OK] 주장 1·카드 C1: 부정 규칙 (무작위 3,000개)")

    people = ["가", "나", "다"]
    likes = {("가", "나"), ("나", "다"), ("다", "가")}
    L = lambda x, y: (x, y) in likes
    assert all(any(L(x, y) for y in people) for x in people)
    assert not any(all(L(x, y) for x in people) for y in people)
    for _ in range(3000):
        n = rng.randint(1, 4)
        R = {(x, y): rng.random() < 0.5 for x in range(n) for y in range(n)}
        ea = any(all(R[x, y] for x in range(n)) for y in range(n))
        ae = all(any(R[x, y] for y in range(n)) for x in range(n))
        assert (not ea) or ae
    print("[OK] 주장 2·카드 C2: ∀∃ 참·∃∀ 거짓인 예, ∃∀ ⇒ ∀∃ (무작위 3,000개)")

    assert all(x * x >= x for x in range(-10000, 10001))
    assert not (0.5 * 0.5 >= 0.5)
    print("[OK] 주장 3: 정의역에 따라 참·거짓이 바뀐다")

    for _ in range(2000):
        a = [rng.randint(0, 5) for _ in range(rng.randint(0, 7))]
        is_sorted = all(a[i] <= a[i + 1] for i in range(len(a) - 1))
        negation = any(a[i] > a[i + 1] for i in range(len(a) - 1))
        assert is_sorted == (not negation) and is_sorted == (a == sorted(a))
    print("[OK] 주장 4·카드 C3: 정렬됨의 부정")

    D = [0, 1]
    P = {0: True, 1: False}
    assert (not all(P[x] for x in D)) != all(not P[x] for x in D)
    print("[OK] 주장 5·오해: ¬∀ ≠ ∀¬")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
