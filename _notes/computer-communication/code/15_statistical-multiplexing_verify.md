---
layout: "note"
title: "15_statistical-multiplexing_verify.py"
display_title: "15_statistical-multiplexing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "컴퓨터 통신"
course_slug: "computer-communication"
course_url: "/studies/computer-communication/"
track: "4-1학기"
parent_url: "/studies/computer-communication/statistical-multiplexing/"
parent_title: "통계적 다중화"
description: "컴퓨터 통신 · 통계적 다중화 검증 코드"
permalink: "/studies/computer-communication/code/15_statistical-multiplexing_verify/"
---
{% raw %}
[통계적 다중화](/Hongs_Blog/studies/computer-communication/statistical-multiplexing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""통계적 다중화의 동작과 통계적 이득 계산 검증.

문서: 15.통계적 다중화 (예시, 정리, 예제, 카드 C2·C3·C4), 16.시분할 다중화와 통계적 다중화 비교
주장 1: 슬라이드 그림(A~D, 2주기)에서 동기식 TDM은 8칸 중 4칸이 비고, 통계적 다중화는 A1 B1 | B2 C2만 싣는다.
주장 2: 사용자 n명이 서로 독립으로 확률 p만큼 활동하면 동시 활동자 수 X ~ Bin(n, p)이고,
        링크가 넘칠 확률은 Pr[X > n_max], n_max = floor(R/a)이다.
주장 3: 독립 가정을 빼면(모두 함께 켜지고 꺼짐) 넘칠 확률이 p까지 커진다.
방법: 프레임을 직접 만들어 비교, 정확한 이항분포(유리수)와 몬테카를로 시뮬레이션 비교.
"""
import random
from fractions import Fraction as F
from math import comb


def sync_tdm(activity, inputs):
    """activity[c] = 주기 c에 데이터가 있는 입력 집합. 빈 칸은 None."""
    return [[f"{x}{c + 1}" if x in act else None for x in inputs] for c, act in enumerate(activity)]


def stat_tdm(activity, inputs, capacity):
    """주기마다 도착한 조각을 입력 순서대로 버퍼에 넣고, 주기당 capacity개까지 (주소, 조각)으로 보낸다.
    반환: 주기별 전송 목록, 주기별 전송 뒤 버퍼 내용."""
    buffer, sent, left = [], [], []
    c = 0
    while c < len(activity) or buffer:
        if c < len(activity):
            buffer += [f"{x}{c + 1}" for x in inputs if x in activity[c]]
        out, buffer = buffer[:capacity], buffer[capacity:]
        sent.append([(blk[0], blk) for blk in out])  # (주소, 데이터)
        left.append(list(buffer))
        c += 1
    return sent, left


def binom_tail(n: int, p: F, k: int) -> F:
    """Pr[X >= k], X ~ Bin(n, p). 정확한 유리수."""
    return sum(comb(n, j) * p**j * (1 - p) ** (n - j) for j in range(k, n + 1))


def monte_carlo_tail(n, p, k, trials, rng, correlated=False):
    hits = 0
    for _ in range(trials):
        if correlated:  # 모든 사용자가 동전 하나를 같이 던짐: 다 같이 켜지거나 다 같이 꺼짐
            active = n if rng.random() < p else 0
        else:
            active = sum(rng.random() < p for _ in range(n))
        hits += active >= k
    return hits / trials


def main() -> None:
    # --- 주장 1: 슬라이드 그림 재현 ---
    inputs = "ABCD"
    act = [{"A", "B"}, {"B", "C"}]
    s = sync_tdm(act, inputs)
    assert s == [["A1", "B1", None, None], [None, "B2", "C2", None]]
    assert sum(x is None for fr in s for x in fr) == 4
    sent, _ = stat_tdm(act, inputs, capacity=4)
    assert [[b for _, b in cyc] for cyc in sent] == [["A1", "B1"], ["B2", "C2"]]
    print("[OK] 슬라이드 그림: 동기식 8칸 중 4칸 빈 칸, 통계적은 A1 B1 | B2 C2 (+주소)")

    # --- 카드 statistical-multiplexing#C2 ---
    inputs = "ABC"
    act = [{"A", "C"}, {"B"}, {"A", "B", "C"}]
    s = sync_tdm(act, inputs)
    assert sum(x is None for fr in s for x in fr) == 3 and sum(len(fr) for fr in s) == 9
    sent, left = stat_tdm(act, inputs, capacity=2)
    blocks = [[b for _, b in cyc] for cyc in sent]
    assert blocks == [["A1", "C1"], ["B2"], ["A3", "B3"], ["C3"]]
    assert left[2] == ["C3"]
    print("[OK] 카드 C2: 동기식 9칸 중 빈 칸 3 / 통계적(주기당 2):", blocks, "주기 3 뒤 버퍼", left[2])

    # --- 주장 2: 예제 (Kurose & Ross 1.3절의 수치) ---
    p = F(1, 10)
    n_max = 1_000_000 // 100_000
    assert n_max == 10
    tail35 = binom_tail(35, p, n_max + 1)
    assert round(float(tail35), 6) == 0.000424
    assert 35 * p == F(7, 2)
    rng = random.Random(2026)
    trials = 200_000
    mc = monte_carlo_tail(35, 0.1, 11, trials, rng)
    se = (float(tail35) * (1 - float(tail35)) / trials) ** 0.5
    assert abs(mc - float(tail35)) < 5 * se + 1e-4
    print(f"[OK] n=35, p=0.1: Pr[X>=11] = {float(tail35):.6f} (정확), 몬테카를로 {mc:.6f} ({trials:,}회)")

    table = {n: float(binom_tail(n, p, 11)) for n in (30, 35, 40, 50)}
    assert (round(table[30], 6), round(table[40], 5), round(table[50], 5)) == (0.000089, 0.00147, 0.00935)
    for n, v in table.items():
        print(f"    n={n:>2}: Pr[X>=11] = {v:.6f}")

    # --- 주장 3: 독립 가정을 빼면 ---
    mc_corr = monte_carlo_tail(35, 0.1, 11, trials, rng, correlated=True)
    assert abs(mc_corr - 0.1) < 0.005
    assert round(0.1 / float(tail35)) == 236
    print(f"[OK] 모두 함께 켜지는 경우: Pr[X>=11] ~= {mc_corr:.4f} (이론값 0.1, 독립일 때의 약 236배)")

    # --- 카드 statistical-multiplexing#C3 ---
    R, a = 2_000_000, 200_000
    assert R // a == 10
    q = F(5, 100)
    tail60 = binom_tail(60, q, 11)
    assert round(float(tail60), 6) == 0.000172 and 60 * q == 3
    print(f"[OK] 카드 C3: 회선 방식 {R // a}명, n=60 p=0.05: E[X]=3, Pr[X>=11] = {float(tail60):.6f}")

    # --- 카드 statistical-multiplexing#C4: 버스티하지 않으면 (p = 1) 빈 칸이 원래 없다 ---
    full = [{"A", "B", "C"}] * 3
    assert sum(x is None for fr in sync_tdm(full, "ABC") for x in fr) == 0
    print("[OK] 카드 C4: p = 1이면 동기식 TDM의 빈 칸 0개 -> 통계적 이득 없음")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
