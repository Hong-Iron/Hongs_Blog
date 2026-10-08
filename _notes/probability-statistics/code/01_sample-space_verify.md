---
layout: "note"
title: "01_sample-space_verify.py"
display_title: "01_sample-space_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "01"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/sample-space/"
parent_title: "표본공간과 사건"
description: "확률과 통계 · 표본공간과 사건 검증 코드"
permalink: "/studies/probability-statistics/code/01_sample-space_verify/"
---
{% raw %}
[표본공간과 사건](/Hongs_Blog/studies/probability-statistics/sample-space/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""표본공간과 사건 검증.

문서: 01.표본공간과 사건 (예시, 정의, 예제, 카드 C1~C3)
주장 1: 예시 — 주사위 두 개의 표본공간은 36개, 합이 7인 사건은 6개. 합만 적은 표본공간 {2..12}의 결과는
        똑같이 그럴듯하지 않다(합 2는 1/36, 합 7은 6/36).
주장 2: 정의 — 드모르간 법칙 (A ∪ B)^c = A^c ∩ B^c, (A ∩ B)^c = A^c ∪ B^c를 작은 표본공간의 모든 사건 쌍에서 확인.
주장 3: 예제 — 서버 세 대의 상태 공간(정상/다운) 8개, "적어도 한 대 다운"의 여사건 = "모두 정상"(1개 결과).
주장 4: 카드 C1 — 동전 세 번: 결과 8개, 앞면이 정확히 두 번인 사건 {HHT, HTH, THH}.
"""
from fractions import Fraction
from itertools import product, combinations


def main():
    omega = list(product(range(1, 7), repeat=2))
    assert len(omega) == 36
    seven = [w for w in omega if sum(w) == 7]
    assert len(seven) == 6
    by_sum = {s: Fraction(sum(1 for w in omega if sum(w) == s), 36) for s in range(2, 13)}
    assert by_sum[2] == Fraction(1, 36) and by_sum[7] == Fraction(6, 36) and sum(by_sum.values()) == 1
    assert len(set(by_sum.values())) > 1
    print("[OK] 주장 1: 주사위 두 개")

    U = frozenset(range(4))
    events = [frozenset(c) for r in range(5) for c in combinations(U, r)]
    for A in events:
        for B in events:
            assert U - (A | B) == (U - A) & (U - B)
            assert U - (A & B) == (U - A) | (U - B)
    print("[OK] 주장 2: 드모르간 (사건 쌍 %d개)" % (len(events) ** 2))

    states = list(product((0, 1), repeat=3))    # 1 = 다운
    some_down = {s for s in states if any(s)}
    all_up = {s for s in states if not any(s)}
    assert len(states) == 8 and set(states) - some_down == all_up and len(all_up) == 1
    print("[OK] 주장 3: 서버 세 대")

    coins = ["".join(c) for c in product("HT", repeat=3)]
    two = {c for c in coins if c.count("H") == 2}
    assert len(coins) == 8 and two == {"HHT", "HTH", "THH"}
    print("[OK] 주장 4·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
