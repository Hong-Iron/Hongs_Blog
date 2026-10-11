---
layout: "note"
title: "11_clocked-sequential-logic_verify.py"
display_title: "11_clocked-sequential-logic_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/clocked-sequential-logic/"
parent_title: "클록과 순차 회로"
description: "컴퓨터 구조 · 클록과 순차 회로 검증 코드"
permalink: "/studies/computer-architecture/code/11_clocked-sequential-logic_verify/"
---
{% raw %}
[클록과 순차 회로](/Hongs_Blog/studies/computer-architecture/clocked-sequential-logic/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 11.클록과 순차 회로: 레지스터 + 가산기로 만든 누산기를 클록 에지마다 흉내 내고,
# 클록 주기 계산과 "플립플롭 대신 래치를 쓰면 생기는 경주"를 확인한다.
# 실행: python3 11_clocked-sequential-logic_verify.py  (표준 라이브러리만 쓴다)
# 실제 하드웨어가 아니라 파이썬 흉내다.
from fractions import Fraction as F

MASK = 0xFF


def accumulator_flipflop(xs, r0=0):
    """에지 트리거: 사이클 동안 R은 그대로고, 에지에서 딱 한 번 R <- R + x"""
    r, rows = r0, []
    for x in xs:
        nxt = (r + x) & MASK                   # 조합 회로(가산기)의 출력
        rows.append((x, r, nxt))
        r = nxt                                # 상승 에지
    return r, rows


def accumulator_latch(xs, open_time, adder_delay, r0=0):
    """래치: 클록이 높은 동안(open_time) 열려 있다. 가산기 지연(adder_delay)이 지날 때마다
    새 합이 다시 래치를 뚫고 나가 가산기 입력으로 돌아온다."""
    r, out = r0, []
    for x in xs:
        laps = open_time // adder_delay        # 열려 있는 동안 고리를 도는 횟수
        for _ in range(laps):
            r = (r + x) & MASK
        out.append(r)
    return out


def min_period(clk_to_q, logic_max, setup, skew=0):
    return clk_to_q + logic_max + setup + skew


def hold_ok(clk_to_q_min, logic_min, hold):
    return clk_to_q_min + logic_min >= hold


if __name__ == "__main__":
    # 문서의 추적 표
    xs = [5, 3, 0, 250, 4]
    r, rows = accumulator_flipflop(xs)
    assert rows == [(5, 0, 5), (3, 5, 8), (0, 8, 8), (250, 8, 2), (4, 2, 6)], rows
    assert r == 6 and (8 + 250) % 256 == 2
    # 래치로 바꾸면: 높은 구간 300 ps, 가산기 지연 100 ps -> 한 사이클에 세 번 더한다
    assert accumulator_latch([5, 3], 300, 100) == [15, 24]
    # 높은 구간이 가산기 지연보다 짧거나 같아 한 바퀴만 돌 때만 플립플롭과 같은 답이 나온다
    assert accumulator_latch(xs, 100, 100) == [row[2] for row in rows]
    # 클록 주기: clk-to-q 30 + 가장 긴 조합 회로 420 + 준비 시간 50 = 500 ps -> 2 GHz
    t = min_period(30, 420, 50)
    assert t == 500 and F(10**12, t) == 2 * 10**9
    # 어긋남 20 ps가 있으면 520 ps -> 약 1.92 GHz
    t2 = min_period(30, 420, 50, 20)
    assert t2 == 520 and abs(float(F(10**12, t2)) / 1e9 - 1.923) < 0.001
    # 유지 시간: 30 + 가장 짧은 길 40 = 70 >= 25 이므로 괜찮다. 유지 시간이 80이면 어긴다
    assert hold_ok(30, 40, 25) and not hold_ok(30, 40, 80)
    # 주기를 400 ps로 줄이면: 값이 도착하는 때 450 ps > 마감 400 - 50 = 350 ps -> 어긴다
    assert 30 + 420 == 450 and 400 - 50 == 350 and 450 > 350
    # 길이 여러 개일 때는 가장 긴 길이 정한다: 420, 300, 150 가운데 420
    paths = [420, 300, 150]
    assert max(min_period(30, p, 50) for p in paths) == 500
    # 카드 C2: clk-to-q 40, 조합 회로 900, 준비 60 -> 1000 ps = 1 GHz
    assert min_period(40, 900, 60) == 1000 and F(10**12, 1000) == 10**9
    # 카드 C3: 조합 회로 가운데에 레지스터를 하나 더 넣어 450 + 450으로 나누면 550 ps
    assert min_period(40, 450, 60) == 550
    assert abs(float(F(10**12, 550)) / 1e9 - 1.818) < 0.001
    assert F(1000, 550) == F(20, 11)           # 약 1.82배이고 2배는 아니다
    # 카드 C4: x = 7, 7, 7, 처음 R = 250 (8비트)
    r, rows = accumulator_flipflop([7, 7, 7], 250)
    assert [row[2] for row in rows] == [1, 8, 15]
    print("ALL CHECKS PASSED")
```
{% endraw %}
