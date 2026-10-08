---
layout: "note"
title: "137_gamblers-fallacy--independence_verify.py"
display_title: "137_gamblers-fallacy--independence_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "137"
course: "이상 심리학"
course_slug: "abnormal-psychology"
course_url: "/studies/abnormal-psychology/"
track: "심리학"
parent_url: "/studies/abnormal-psychology/gamblers-fallacy--independence/"
parent_title: "도박사의 오류 ↔ 독립"
description: "이상 심리학 · 도박사의 오류 ↔ 독립 검증 코드"
permalink: "/studies/abnormal-psychology/code/137_gamblers-fallacy--independence_verify/"
---
{% raw %}
[도박사의 오류 ↔ 독립](/Hongs_Blog/studies/abnormal-psychology/gamblers-fallacy--independence/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""도박사의 오류 ↔ 독립 브리지 문서의 수치를 검증한다.

1. 공정한 동전에서 뒷면 5번 연속 뒤 앞면의 확률 (모의실험)
2. 유럽식 룰렛(0 하나, 37칸) 빨강 베팅의 기댓값 -1/37 (정확값과 모의실험)
3. 마틴게일(잃으면 두 배로 걸기) 전략의 평균 손익과 파산 확률 (모의실험)
4. 로또 6/45 한 조합의 확률 1/C(45,6)
5. 큰 수의 법칙: 비율은 1/2로 가지만 개수 차이의 기댓값은 그대로다
"""
import random
from fractions import Fraction
from math import comb

random.seed(20260927)


def after_streak(n_flips: int, streak: int) -> float:
    """뒷면이 streak번 연속된 직후 던지기에서 앞면이 나온 비율."""
    run, hits, total = 0, 0, 0
    for _ in range(n_flips):
        heads = random.random() < 0.5
        if run >= streak:
            total += 1
            hits += heads
        run = 0 if heads else run + 1
    return hits / total


def roulette_red(n: int) -> float:
    """1단위씩 빨강에 n번 걸었을 때 한 판당 평균 손익."""
    net = 0
    for _ in range(n):
        slot = random.randrange(37)  # 0은 초록, 1~18 빨강, 19~36 검정으로 둔다
        net += 1 if 1 <= slot <= 18 else -1
    return net / n


def martingale(bankroll: int, spins: int) -> tuple[int, bool]:
    """빨강에 1부터 걸고 잃으면 두 배로 건다. 걸 돈이 모자라면 파산으로 멈춘다."""
    money, bet = bankroll, 1
    for _ in range(spins):
        if bet > money:
            return money - bankroll, True
        if 1 <= random.randrange(37) <= 18:
            money += bet
            bet = 1
        else:
            money -= bet
            bet *= 2
    return money - bankroll, False


if __name__ == "__main__":
    p = after_streak(2_000_000, 5)
    assert abs(p - 0.5) < 0.01, p
    print(f"뒷면 5연속 뒤 앞면 비율: {p:.4f}")

    ev = Fraction(18, 37) * 1 + Fraction(19, 37) * (-1)
    assert ev == Fraction(-1, 37)
    sim = roulette_red(2_000_000)
    assert abs(sim - float(ev)) < 0.003, sim
    print(f"빨강 베팅 기댓값: {ev} = {float(ev):.4f}, 모의실험 {sim:.4f}")
    # 1만 원씩 100판 걸면 기대 손실은 약 2만 7천 원
    loss_100 = 100 * 10_000 * float(ev)
    assert round(loss_100) == -27027, loss_100
    print(f"1만 원씩 100판의 기대 손익: {loss_100:,.0f}원")
    loss_c1 = 40 * 50_000 * float(ev)  # 확인 문제 C1
    assert round(loss_c1) == -54054, loss_c1
    print(f"5만 원씩 40판의 기대 손익: {loss_c1:,.0f}원")

    results = [martingale(100, 200) for _ in range(20_000)]
    mean_net = sum(r for r, _ in results) / len(results)
    ruin = sum(b for _, b in results) / len(results)
    assert mean_net < 0 and ruin > 0.5, (mean_net, ruin)
    print(f"마틴게일(자금 100, 최대 200판): 평균 손익 {mean_net:.1f}, 파산 비율 {ruin:.3f}")

    assert comb(45, 6) == 8_145_060
    print(f"로또 6/45 한 조합의 확률: 1/{comb(45, 6):,}")

    # 뒷면 5개가 앞선 상태에서 n번 더 던질 때: 앞면-뒷면 차이의 기댓값은 -5 그대로,
    # 앞면 비율의 기댓값은 n/2 / (n+5)로 1/2에 다가간다.
    for n in (10, 100, 10_000):
        expected_diff = -5 + 0  # 새 던지기의 앞면-뒷면 기댓값은 0
        expected_ratio = (n / 2) / (n + 5)
        assert expected_diff == -5
        print(f"n={n}: 차이 기댓값 {expected_diff}, 앞면 비율 기댓값 {expected_ratio:.4f}")
    assert abs((10_000 / 2) / 10_005 - 0.5) < 0.001
    print("ALL CHECKS PASSED")
```
{% endraw %}
