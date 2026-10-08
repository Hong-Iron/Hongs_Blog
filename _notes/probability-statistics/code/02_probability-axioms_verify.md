---
layout: "note"
title: "02_probability-axioms_verify.py"
display_title: "02_probability-axioms_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/probability-axioms/"
parent_title: "확률의 공리와 계산"
description: "확률과 통계 · 확률의 공리와 계산 검증 코드"
permalink: "/studies/probability-statistics/code/02_probability-axioms_verify/"
---
{% raw %}
[확률의 공리와 계산](/Hongs_Blog/studies/probability-statistics/probability-axioms/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""확률의 공리와 계산 검증.

문서: 02.확률의 공리와 계산 (예시, 정의, 증명, 예제, 활용, 카드 C1~C4)
주장 1: 공리에서 나온 성질 — 여사건, 포함-배제, 합집합 한계를 균등 표본공간(주사위 두 개)의 모든 사건 쌍 일부에서 확인.
주장 2: 예제 — 생일 문제: 23명이면 같은 생일이 있을 확률 0.5073, 57명이면 0.9901(정확 계산과 몬테카를로).
주장 3: 카드 C1 — 주사위 두 개의 합이 7일 확률 1/6. 카드 C4 — 합 2의 확률은 1/11이 아니라 1/36.
주장 4: 카드 C2 — 주사위 네 번 중 6이 적어도 한 번: 1 - (5/6)^4 ≈ 0.5177(전수 1296가지).
주장 5: 활용 — 해시 충돌: 칸 n = 2^32에 키가 77,164개 이상이면 충돌 확률이 절반 이상(√(2n ln 2) ≈ 77,163 근사와 정확 계산).
"""
from fractions import Fraction
from itertools import product
import math
import random


def main():
    rng = random.Random(2)
    omega = list(product(range(1, 7), repeat=2))
    P = lambda A: Fraction(len(A), len(omega))
    allset = set(omega)
    for _ in range(2000):
        A = {w for w in omega if rng.random() < 0.4}
        B = {w for w in omega if rng.random() < 0.4}
        assert P(allset - A) == 1 - P(A)
        assert P(A | B) == P(A) + P(B) - P(A & B)
        assert P(A | B) <= P(A) + P(B)
    print("[OK] 주장 1: 여사건·포함-배제·합집합 한계")

    def shared(k, n=365):
        p = 1.0
        for i in range(k):
            p *= (n - i) / n
        return 1 - p
    assert abs(shared(23) - 0.5073) < 1e-4 and abs(shared(57) - 0.9901) < 1e-4 and shared(22) < 0.5
    hits = sum(1 for _ in range(20000) if len({rng.randrange(365) for _ in range(23)}) < 23)
    assert abs(hits / 20000 - 0.5073) < 0.015
    print("[OK] 주장 2: 생일 문제")

    assert P({w for w in omega if sum(w) == 7}) == Fraction(1, 6)
    assert P({w for w in omega if sum(w) == 2}) == Fraction(1, 36) != Fraction(1, 11)
    print("[OK] 주장 3: 카드 C1·C4")

    four = list(product(range(1, 7), repeat=4))
    assert Fraction(sum(1 for w in four if 6 in w), len(four)) == 1 - Fraction(5, 6) ** 4
    assert abs(float(1 - Fraction(5, 6) ** 4) - 0.5177) < 1e-4
    print("[OK] 주장 4: 카드 C2")

    n = 2 ** 32
    k_half = math.sqrt(2 * n * math.log(2))
    assert 77000 < k_half < 77300
    exact = lambda k: -math.expm1(sum(math.log1p(-i / n) for i in range(k)))   # 큰 n에서 정밀하게
    assert exact(77164) >= 0.5 > exact(77163)
    print(f"[OK] 주장 5: 해시 충돌 절반 지점 약 {k_half:.0f}개")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
