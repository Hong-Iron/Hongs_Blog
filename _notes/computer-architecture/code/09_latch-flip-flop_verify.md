---
layout: "note"
title: "09_latch-flip-flop_verify.py"
display_title: "09_latch-flip-flop_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/latch-flip-flop/"
parent_title: "래치와 플립플롭"
description: "컴퓨터 구조 · 래치와 플립플롭 검증 코드"
sitemap: false
permalink: "/studies/computer-architecture/code/09_latch-flip-flop_verify/"
---
{% raw %}
[래치와 플립플롭](/Hongs_Blog/studies/computer-architecture/latch-flip-flop/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 09.래치와 플립플롭: NOR 두 개를 맞물린 SR 래치, D 래치, 래치 두 개로 만든 D 플립플롭을 흉내 내어
# 문서의 추적 표와 성질을 확인한다.
# 실행: python3 09_latch-flip-flop_verify.py  (표준 라이브러리만 쓴다)
# 실제 하드웨어가 아니라 파이썬 흉내다. 게이트 지연, 준비 시간, 유지 시간은 다루지 않고
# "입력이 바뀐 뒤 값이 가라앉은 상태"만 계산한다.
import random


def NOR(a, b): return 1 - (a | b)


class SRLatch:
    """NOR 두 개를 서로의 입력에 맞물린 회로. Q = NOR(R, Qbar), Qbar = NOR(S, Q)"""

    def __init__(self, q=0):
        self.q, self.qb = q, 1 - q

    def step(self, s, r):
        for _ in range(4):                     # 값이 더 안 바뀔 때까지 되풀이
            q = NOR(r, self.qb)
            qb = NOR(s, q)
            if (q, qb) == (self.q, self.qb):
                break
            self.q, self.qb = q, qb
        return self.q


class DLatch:
    """C=1이면 열려서 Q가 D를 따라가고, C=0이면 닫혀서 마지막 값을 붙든다."""

    def __init__(self, q=0):
        self.sr = SRLatch(q)

    def step(self, d, c):
        return self.sr.step(s=d & c, r=(1 - d) & c)

    @property
    def q(self):
        return self.sr.q


class DFlipFlop:
    """상승 에지에서 D를 잡는다. 앞 래치는 CLK=0일 때, 뒤 래치는 CLK=1일 때 열린다."""

    def __init__(self, q=0):
        self.master, self.slave = DLatch(q), DLatch(q)

    def step(self, d, clk):
        m = self.master.step(d, 1 - clk)
        return self.slave.step(m, clk)

    @property
    def q(self):
        return self.slave.q


# 문서의 추적 표: 시각마다 (CLK, D)
WAVE = [(0, 0), (0, 1), (1, 1), (1, 0), (1, 1), (0, 1), (0, 0), (1, 0), (1, 1), (0, 1), (1, 1), (0, 0)]


def run_trace(wave):
    latch, ff = DLatch(0), DFlipFlop(0)
    rows = []
    for clk, d in wave:
        rows.append((clk, d, latch.step(d, clk), ff.step(d, clk)))
    return rows


if __name__ == "__main__":
    # SR 래치: S=1이면 1, R=1이면 0, 둘 다 0이면 붙든다
    sr = SRLatch(0)
    assert sr.step(1, 0) == 1 and sr.step(0, 0) == 1
    assert sr.step(0, 1) == 0 and sr.step(0, 0) == 0
    assert (sr.q, sr.qb) == (0, 1)
    # S=R=1이면 Q와 Qbar가 둘 다 0이 되어 "서로 반대"가 깨진다
    sr.step(1, 1)
    assert (sr.q, sr.qb) == (0, 0)
    # D 래치: 열려 있으면 따라가고 닫혀 있으면 붙든다
    rnd = random.Random(3)
    lt = DLatch(0)
    held = 0
    for _ in range(5000):
        d, c = rnd.randint(0, 1), rnd.randint(0, 1)
        q = lt.step(d, c)
        if c:
            held = d
        assert q == held
    # D 플립플롭: 출력은 상승 에지에서만 바뀌고, 그때의 D가 된다
    ff = DFlipFlop(0)
    prev_clk, q_model, prev_d = 0, 0, 0
    for _ in range(5000):
        # 한 번에 CLK와 D 가운데 하나만 바꾼다(에지와 D가 동시에 바뀌는 것은 준비·유지 시간 위반이라 뺀다)
        if rnd.random() < 0.5:
            clk, d = 1 - prev_clk, prev_d
        else:
            clk, d = prev_clk, rnd.randint(0, 1)
        q = ff.step(d, clk)
        if prev_clk == 0 and clk == 1:
            q_model = d
        assert q == q_model
        prev_clk, prev_d = clk, d
    # 문서의 추적 표
    rows = run_trace(WAVE)
    assert [r[2] for r in rows] == [0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], [r[2] for r in rows]
    assert [r[3] for r in rows] == [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1], [r[3] for r in rows]
    for i, r in enumerate(rows, 1):
        print(i, *r)
    # 카드 C2: CLK,D = (0,1),(1,1),(1,0),(0,0),(0,1),(1,1) 처음 Q=0
    rows = run_trace([(0, 1), (1, 1), (1, 0), (0, 0), (0, 1), (1, 1)])
    assert [r[2] for r in rows] == [0, 1, 0, 0, 0, 1]
    assert [r[3] for r in rows] == [0, 1, 1, 1, 1, 1]
    print("ALL CHECKS PASSED")
```
{% endraw %}
