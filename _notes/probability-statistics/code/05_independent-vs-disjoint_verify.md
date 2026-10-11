---
layout: "note"
title: "05_independent-vs-disjoint_verify.py"
display_title: "05_independent-vs-disjoint_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/independent-vs-disjoint/"
parent_title: "독립과 배반 비교"
description: "확률과 통계 · 독립과 배반 비교 검증 코드"
permalink: "/studies/probability-statistics/code/05_independent-vs-disjoint_verify/"
---
{% raw %}
[독립과 배반 비교](/Hongs_Blog/studies/probability-statistics/independent-vs-disjoint/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""독립과 배반 비교 검증.

문서: 05.독립과 배반 비교 (카드 C1~C4, 결정적 차이)
주장 1: 카드 C1 — 주사위 한 번: 짝수와 홀수는 배반이고 독립이 아니다.
주장 2: 카드 C2 — 두 주사위: 첫째 짝수와 둘째 짝수는 독립이고 배반이 아니다.
주장 3: 카드 C3 — P(A) = 0.3, P(B) = 0.4: 배반이면 P(A ∪ B) = 0.7, 독립이면 0.58.
주장 4: 카드 C4·결정적 차이 — 확률이 양수인 두 사건은 배반이면서 독립일 수 없다(작은 표본공간 전수).
        한쪽 확률이 0이면 둘 다일 수 있다.
"""
from fractions import Fraction
from itertools import product, combinations


def main():
    die = set(range(1, 7))
    P1 = lambda A: Fraction(len(A), 6)
    ev, od = {2, 4, 6}, {1, 3, 5}
    assert not (ev & od) and P1(ev & od) != P1(ev) * P1(od)
    print("[OK] 주장 1·카드 C1")

    omega = list(product(range(1, 7), repeat=2))
    P = lambda A: Fraction(len(A), 36)
    A = {w for w in omega if w[0] % 2 == 0}
    B = {w for w in omega if w[1] % 2 == 0}
    assert P(A & B) == P(A) * P(B) and A & B
    print("[OK] 주장 2·카드 C2")

    pa, pb = Fraction(3, 10), Fraction(4, 10)
    assert pa + pb == Fraction(7, 10) and pa + pb - pa * pb == Fraction(58, 100)
    print("[OK] 주장 3·카드 C3")

    U = list(range(6))
    events = [set(c) for r in range(7) for c in combinations(U, r)]
    PU = lambda E: Fraction(len(E), 6)
    for X in events:
        for Y in events:
            if not (X & Y) and PU(X) > 0 and PU(Y) > 0:
                assert PU(X & Y) != PU(X) * PU(Y)
    empty = set()
    assert not (empty & ev) and P1(empty & ev) == P1(empty) * P1(ev)
    print("[OK] 주장 4·카드 C4")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
