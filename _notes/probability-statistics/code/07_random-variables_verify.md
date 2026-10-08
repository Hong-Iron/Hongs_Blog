---
layout: "note"
title: "07_random-variables_verify.py"
display_title: "07_random-variables_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "07"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/random-variables/"
parent_title: "확률변수와 분포"
description: "확률과 통계 · 확률변수와 분포 검증 코드"
permalink: "/studies/probability-statistics/code/07_random-variables_verify/"
---
{% raw %}
[확률변수와 분포](/Hongs_Blog/studies/probability-statistics/random-variables/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""확률변수와 분포 검증.

문서: 07.확률변수와 분포 (예시, 정의, 예제, 카드 C1~C3)
주장 1: 예시 — 동전 두 번의 앞면 수 X: PMF 1/4, 1/2, 1/4, CDF F(0) = 1/4, F(0.5) = 1/4, F(1) = 3/4, F(2) = 1.
주장 2: 정의 — CDF는 감소하지 않고 오른쪽 연속, 왼쪽 끝 0·오른쪽 끝 1. P(a < X <= b) = F(b) - F(a).
주장 3: 예제 — 두 주사위: X1, X2는 독립, X1과 합 S는 독립이 아니다. 지시 확률변수의 기댓값 = 확률.
주장 4: 카드 C1 — 두 주사위의 최댓값 PMF (2k - 1)/36. 카드 C2 — CDF의 점프에서 PMF 복원.
"""
from fractions import Fraction
from itertools import product


def main():
    coins = list(product((0, 1), repeat=2))
    X = lambda w: sum(w)
    pmf = {k: Fraction(sum(1 for w in coins if X(w) == k), 4) for k in range(3)}
    assert pmf == {0: Fraction(1, 4), 1: Fraction(1, 2), 2: Fraction(1, 4)}
    F = lambda x: sum(p for k, p in pmf.items() if k <= x)
    assert (F(0), F(0.5), F(1), F(2), F(-1), F(5)) == (Fraction(1, 4), Fraction(1, 4), Fraction(3, 4), 1, 0, 1)
    print("[OK] 주장 1: PMF와 CDF")

    xs = [i / 10 for i in range(-20, 41)]
    assert all(F(a) <= F(b) for a, b in zip(xs, xs[1:]))
    for k in range(3):
        assert F(k) == F(k + 1e-9)          # 오른쪽 연속
        assert F(k) - F(k - 1e-9) == pmf[k]  # 점프 크기 = PMF
    assert F(2) - F(0) == pmf[1] + pmf[2]
    print("[OK] 주장 2: CDF의 성질")

    omega = list(product(range(1, 7), repeat=2))
    P = lambda cond: Fraction(sum(1 for w in omega if cond(w)), 36)
    for a in range(1, 7):
        for b in range(1, 7):
            assert P(lambda w: w[0] == a and w[1] == b) == P(lambda w: w[0] == a) * P(lambda w: w[1] == b)
    assert P(lambda w: w[0] == 1 and sum(w) == 12) != P(lambda w: w[0] == 1) * P(lambda w: sum(w) == 12)
    ind = lambda w: 1 if sum(w) == 7 else 0
    assert sum(Fraction(ind(w), 36) for w in omega) == P(lambda w: sum(w) == 7)
    print("[OK] 주장 3: 독립과 지시 확률변수")

    for k in range(1, 7):
        assert P(lambda w: max(w) == k) == Fraction(2 * k - 1, 36)
    Fc = {0: Fraction(2, 10), 1: Fraction(5, 10), 3: Fraction(1)}
    pm = {0: Fc[0], 1: Fc[1] - Fc[0], 3: Fc[3] - Fc[1]}
    assert pm == {0: Fraction(1, 5), 1: Fraction(3, 10), 3: Fraction(1, 2)} and sum(pm.values()) == 1
    print("[OK] 주장 4: 카드 C1·C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
