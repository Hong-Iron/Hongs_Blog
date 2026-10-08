---
layout: "note"
title: "03_conditional-probability_verify.py"
display_title: "03_conditional-probability_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/conditional-probability/"
parent_title: "조건부 확률"
description: "확률과 통계 · 조건부 확률 검증 코드"
permalink: "/studies/probability-statistics/code/03_conditional-probability_verify/"
---
{% raw %}
[조건부 확률](/Hongs_Blog/studies/probability-statistics/conditional-probability/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""조건부 확률 검증.

문서: 03.조건부 확률 (예시, 정의, 증명, 예제, 오해, 카드 C1~C4)
주장 1: 예시 — 두 주사위: P(합 8) = 5/36, P(합 8 | 첫 주사위 3) = 1/6 (조건을 주면 커질 수도 있다),
        P(합 8 | 첫 주사위 1) = 0.
주장 2: 설계 이유 — 상대도수 해석: 모의실험에서 B가 일어난 시행 중 A의 비율이 P(A ∩ B)/P(B)에 가깝다.
        조건부 확률도 공리를 만족한다(P(Ω|B) = 1, 배반 사건의 덧셈).
주장 3: 곱셈 법칙·연쇄 법칙 — 카드 C1: 52장에서 두 장 모두 에이스 1/221(전수).
주장 4: 전확률 — 카드 C3: 0.6·0.02 + 0.4·0.05 = 0.032.
주장 5: 예제·카드 C4 — 몬티 홀: 바꾸면 2/3(전수와 모의실험).
"""
from fractions import Fraction
from itertools import product, permutations
import random


def main():
    rng = random.Random(3)
    omega = list(product(range(1, 7), repeat=2))
    P = lambda A: Fraction(len(A), 36)
    s8 = {w for w in omega if sum(w) == 8}
    f3 = {w for w in omega if w[0] == 3}
    f1 = {w for w in omega if w[0] == 1}
    assert P(s8) == Fraction(5, 36) and P(s8 & f3) / P(f3) == Fraction(1, 6) and P(s8 & f1) == 0
    assert P(s8 & f3) / P(f3) > P(s8)
    print("[OK] 주장 1: 예시")

    nB = nAB = 0
    for _ in range(100000):
        w = (rng.randint(1, 6), rng.randint(1, 6))
        if w[0] == 3:
            nB += 1
            nAB += sum(w) == 8
    assert abs(nAB / nB - 1 / 6) < 0.01
    B = f3
    PB = lambda A: P(A & B) / P(B)
    assert PB(set(omega)) == 1
    A1 = {w for w in omega if w[1] <= 2}
    A2 = {w for w in omega if w[1] >= 5}
    assert PB(A1 | A2) == PB(A1) + PB(A2)
    print("[OK] 주장 2: 상대도수, 조건부 확률의 공리")

    deck = [(r, s) for r in range(13) for s in range(4)]
    pairs = list(permutations(range(52), 2))
    both = sum(1 for i, j in pairs if deck[i][0] == 0 and deck[j][0] == 0)
    assert Fraction(both, len(pairs)) == Fraction(4, 52) * Fraction(3, 51) == Fraction(1, 221)
    print("[OK] 주장 3·카드 C1: 1/221")

    assert Fraction(6, 10) * Fraction(2, 100) + Fraction(4, 10) * Fraction(5, 100) == Fraction(32, 1000)
    print("[OK] 주장 4·카드 C3: 전확률 0.032")

    win_switch = Fraction(0)
    for car in range(3):
        for pick in range(3):
            # 진행자는 차가 없고 참가자가 고르지 않은 문을 연다. 두 문이 가능하면 반반.
            opts = [d for d in range(3) if d != car and d != pick]
            for opened in opts:
                w = Fraction(1, 9) / len(opts)
                other = next(d for d in range(3) if d != pick and d != opened)
                win_switch += w * (other == car)
    assert win_switch == Fraction(2, 3)
    wins = 0
    for _ in range(60000):
        car, pick = rng.randrange(3), rng.randrange(3)
        opened = rng.choice([d for d in range(3) if d != car and d != pick])
        other = next(d for d in range(3) if d != pick and d != opened)
        wins += other == car
    assert abs(wins / 60000 - 2 / 3) < 0.01
    print("[OK] 주장 5·카드 C4: 몬티 홀 2/3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
