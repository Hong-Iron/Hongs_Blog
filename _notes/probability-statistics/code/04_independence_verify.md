---
layout: "note"
title: "04_independence_verify.py"
display_title: "04_independence_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/independence/"
parent_title: "독립"
description: "확률과 통계 · 독립 검증 코드"
permalink: "/studies/probability-statistics/code/04_independence_verify/"
---
{% raw %}
[독립](/Hongs_Blog/studies/probability-statistics/independence/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""독립 검증.

문서: 04.독립 (예시, 정의, 증명, 예제, 오해, 카드 C1~C3)
주장 1: 예시·카드 C1 — 두 주사위: "첫 주사위 6"과 "합 7"은 독립, "첫 주사위 6"과 "합 8"은 독립이 아니다.
주장 2: 정리 — A, B가 독립이면 A와 B^c도 독립(무작위 독립 사건 쌍, 곱 표본공간).
주장 3: 반례·카드 C2 — 동전 두 개: A = 첫째 앞, B = 둘째 앞, C = 둘이 같음. 쌍마다 독립이지만 셋은 독립이 아니다.
주장 4: 예제 — 복제본 세 개가 각자 0.01로 고장: 모두 고장 10^-6. 공통 원인(확률 0.001로 셋 다 고장)이 있으면 약 0.001.
주장 5: 카드 C3 — 서버 세 대가 각자 0.9로 정상일 때 적어도 한 대 정상 1 - 0.1^3 = 0.999.
"""
from fractions import Fraction
from itertools import product
import random


def main():
    omega = list(product(range(1, 7), repeat=2))
    P = lambda A: Fraction(len(A), 36)
    six = {w for w in omega if w[0] == 6}
    s7 = {w for w in omega if sum(w) == 7}
    s8 = {w for w in omega if sum(w) == 8}
    assert P(six & s7) == P(six) * P(s7) == Fraction(1, 36)
    assert P(six & s8) != P(six) * P(s8)
    print("[OK] 주장 1·카드 C1")

    rng = random.Random(4)
    for _ in range(200):
        pa, pb = Fraction(rng.randint(0, 10), 10), Fraction(rng.randint(0, 10), 10)
        # 곱 표본공간 {0,1}²에서 A = 첫 좌표 1, B = 둘째 좌표 1
        w = {(a, b): (pa if a else 1 - pa) * (pb if b else 1 - pb) for a in (0, 1) for b in (0, 1)}
        PA = sum(v for (a, b), v in w.items() if a)
        PBc = sum(v for (a, b), v in w.items() if not b)
        PABc = sum(v for (a, b), v in w.items() if a and not b)
        assert PABc == PA * PBc
    print("[OK] 주장 2: A와 B^c의 독립")

    coins = list(product("HT", repeat=2))
    Pc = lambda E: Fraction(len(E), 4)
    A = {c for c in coins if c[0] == "H"}
    B = {c for c in coins if c[1] == "H"}
    C = {c for c in coins if c[0] == c[1]}
    for X, Y in ((A, B), (A, C), (B, C)):
        assert Pc(X & Y) == Pc(X) * Pc(Y)
    assert Pc(A & B & C) == Fraction(1, 4) != Pc(A) * Pc(B) * Pc(C)
    print("[OK] 주장 3·카드 C2: 쌍마다 독립 ≠ 셋이 독립")

    assert abs(0.01 ** 3 - 1e-6) < 1e-18
    common = 0.001 + 0.999 * 0.01 ** 3
    assert abs(common - 0.001) < 2e-6 and common / 1e-6 > 900
    fails = sum(1 for _ in range(400000) if rng.random() < 0.001 or all(rng.random() < 0.01 for _ in range(3)))
    assert abs(fails / 400000 - common) < 3e-4
    print("[OK] 주장 4: 공통 원인")

    assert abs(1 - 0.1 ** 3 - 0.999) < 1e-12
    print("[OK] 주장 5·카드 C3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
