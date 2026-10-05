---
layout: "note"
title: "08_expectation_verify.py"
display_title: "08_expectation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "08"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/expectation/"
parent_title: "기댓값과 선형성"
description: "확률과 통계 · 기댓값과 선형성 검증 코드"
permalink: "/studies/probability-statistics/code/08_expectation_verify/"
---
{% raw %}
[기댓값과 선형성](/Hongs_Blog/studies/probability-statistics/expectation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""기댓값과 선형성 검증.

문서: 08.기댓값과 선형성, 4.연습문제/08.기댓값 선형성 예제 사다리
주장 1: 예시 — 주사위 한 개 E = 7/2, 두 개의 합 E = 7(분포로 직접, 선형성으로).
주장 2: 정리 — 선형성: 무작위 결합분포(독립 아님)에서 E[aX + bY] = aE[X] + bE[Y].
        독립이면 E[XY] = E[X]E[Y](두 주사위 49/4), 독립이 아니면 깨진다(X = Y = ±1: 1 ≠ 0).
        LOTUS: 주사위 E[X²] = 91/6.
주장 3: 예제 — 모자 돌려받기: n = 1..8의 모든 순열에서 고정점 수의 평균이 정확히 1.
주장 4: 활용 — 23명 중 생일이 같은 쌍의 수의 기댓값 253/365 ≈ 0.693(모의실험).
        상트페테르부르크 게임: 판을 N번까지로 자르면 기댓값이 N/2라 끝없이 커진다.
주장 5: 사다리 — 10번 던져 HH 위치 수 9/4(1024가지 전수), 기록 갱신 수 H_4 = 25/12(24개 순열 전수),
        10칸 해시에 키 10개일 때 빈 칸 수 10(0.9)^10 ≈ 3.487(모의실험).
"""
from fractions import Fraction
from itertools import product, permutations
import random


def main():
    rng = random.Random(8)
    E1 = sum(Fraction(k, 6) for k in range(1, 7))
    assert E1 == Fraction(7, 2)
    omega = list(product(range(1, 7), repeat=2))
    assert sum(Fraction(sum(w), 36) for w in omega) == 7 == 2 * E1
    print("[OK] 주장 1: 3.5와 7")

    for _ in range(300):
        vals = [(rng.randint(-3, 3), rng.randint(-3, 3)) for _ in range(5)]
        ps = [Fraction(rng.randint(1, 9)) for _ in range(5)]
        tot = sum(ps)
        ps = [p / tot for p in ps]
        a, b = rng.randint(-4, 4), rng.randint(-4, 4)
        EX = sum(p * x for p, (x, y) in zip(ps, vals))
        EY = sum(p * y for p, (x, y) in zip(ps, vals))
        assert sum(p * (a * x + b * y) for p, (x, y) in zip(ps, vals)) == a * EX + b * EY
    assert sum(Fraction(w[0] * w[1], 36) for w in omega) == Fraction(49, 4)
    EXY = Fraction(1, 2) * 1 + Fraction(1, 2) * 1          # X = Y = ±1
    EX = Fraction(1, 2) * 1 + Fraction(1, 2) * (-1)
    assert EXY == 1 and EX * EX == 0
    assert sum(Fraction(k * k, 6) for k in range(1, 7)) == Fraction(91, 6)
    print("[OK] 주장 2: 선형성, 곱, LOTUS")

    for n in range(1, 9):
        perms = list(permutations(range(n)))
        fixed = sum(sum(1 for i, p in enumerate(q) if i == p) for q in perms)
        assert Fraction(fixed, len(perms)) == 1
    print("[OK] 주장 3: 모자 돌려받기 = 1")

    assert abs(253 / 365 - 0.693) < 1e-3
    trials, tot = 20000, 0
    for _ in range(trials):
        bd = [rng.randrange(365) for _ in range(23)]
        cnt = {}
        for d in bd:
            cnt[d] = cnt.get(d, 0) + 1
        tot += sum(c * (c - 1) // 2 for c in cnt.values())
    assert abs(tot / trials - 253 / 365) < 0.02
    for N in (1, 5, 30):
        # k번째 판(1 <= k <= N)에서 처음 앞면: 확률 2^-k, 상금 2^k
        assert sum(Fraction(1, 2 ** k) * 2 ** k for k in range(1, N + 1)) == N
    print("[OK] 주장 4: 생일 쌍, 상트페테르부르크")

    seqs = list(product("HT", repeat=10))
    hh = sum(sum(1 for i in range(9) if s[i] == s[i + 1] == "H") for s in seqs)
    assert Fraction(hh, 1024) == Fraction(9, 4)
    rec = 0
    for q in permutations(range(4)):
        best = -1
        for v in q:
            if v > best:
                rec += 1
                best = v
    assert Fraction(rec, 24) == Fraction(25, 12) == sum(Fraction(1, i) for i in range(1, 5))
    m = n = 10
    assert abs(m * (1 - 1 / m) ** n - 3.487) < 1e-3
    empt = sum(m - len({rng.randrange(m) for _ in range(n)}) for _ in range(40000)) / 40000
    assert abs(empt - m * (1 - 1 / m) ** n) < 0.03
    print("[OK] 주장 5: 예제 사다리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
