---
layout: "note"
title: "29_lpt-scheduling_verify.py"
display_title: "29_lpt-scheduling_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "29"
course: "자료구조"
course_slug: "data-structures"
course_url: "/studies/data-structures/"
track: "컴퓨터 과학"
track_sub: "소프트웨어"
parent_url: "/studies/data-structures/lpt-scheduling/"
parent_title: "LPT 스케줄링"
description: "자료구조 · LPT 스케줄링 검증 코드"
sitemap: false
permalink: "/studies/data-structures/code/29_lpt-scheduling_verify/"
---
{% raw %}
[LPT 스케줄링](/Hongs_Blog/studies/data-structures/lpt-scheduling/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""LPT 스케줄링 문서의 수치 검증.

실행: python3 29_lpt-scheduling_verify.py   (표준 라이브러리만 쓴다)

기계 m대, 작업 n개. 작업을 긴 것부터, 그때 가장 먼저 비는 기계에 맡긴다.
가장 먼저 비는 기계는 최소 우선순위 큐(heapq)로 찾는다. 큐에는 (끝나는 시각, 기계 번호)를 넣는다.
끝나는 시각이 같으면 번호가 작은 기계가 먼저 나온다.
"""
import heapq
import random
from fractions import Fraction
from itertools import product


def lpt(times, m, trace=None, counter=None):
    """LPT 일정. 돌려주는 값: (전체가 끝나는 시각, 기계별 작업 목록)"""
    heap = [(0, k) for k in range(m)]            # 처음에는 모든 기계가 시각 0에 빈다
    heapq.heapify(heap)
    jobs = [[] for _ in range(m)]
    for t in sorted(times, reverse=True):         # 긴 작업부터
        finish, k = heapq.heappop(heap)           # 가장 먼저 비는 기계
        jobs[k].append(t)
        heapq.heappush(heap, (finish + t, k))     # 그 기계의 끝나는 시각을 고쳐 다시 넣는다
        if counter is not None:
            counter[0] += 2                       # 꺼내기 1번 + 넣기 1번
        if trace is not None:
            trace.append((t, k, sorted(heap, key=lambda p: p[1])))
    return max(f for f, _ in heap), jobs


def lpt_scan(times, m):
    """큐 없이, 작업마다 기계 m대를 다 훑어 가장 먼저 비는 기계를 찾는 단순한 방법"""
    finish = [0] * m
    for t in sorted(times, reverse=True):
        k = min(range(m), key=lambda j: (finish[j], j))
        finish[k] += t
    return max(finish)


def optimal(times, m):
    """모든 맡기는 방법(m^n가지)을 다 해 본 가장 이른 끝나는 시각"""
    best = sum(times)
    for assign in product(range(m), repeat=len(times)):
        load = [0] * m
        for t, k in zip(times, assign):
            load[k] += t
        best = min(best, max(load))
    return best


def bound(m):
    """문서의 한계: 4/3 - 1/(3m)"""
    return Fraction(4, 3) - Fraction(1, 3 * m)


if __name__ == "__main__":
    # 1. 문서 예시: 기계 3대, 작업 [6, 2, 3, 5, 10, 7, 14]
    times = [6, 2, 3, 5, 10, 7, 14]
    # 문서의 "아무렇게나 맡긴 일정": A = 6, 7 / B = 2, 5, 14 / C = 3, 10 -> 13, 21, 13
    assert [sum(x) for x in ([6, 7], [2, 5, 14], [3, 10])] == [13, 21, 13]
    assert sorted([6, 7] + [2, 5, 14] + [3, 10]) == sorted(times)
    trace = []
    finish, jobs = lpt(times, 3, trace)
    assert finish == 16                                           # LPT로 맡기면 16에 끝난다
    assert jobs == [[14, 2], [10, 5], [7, 6, 3]]                  # A, B, C
    assert [sum(j) for j in jobs] == [16, 15, 16]
    # 본문의 추적 표: (작업, 맡은 기계, 그 뒤 세 기계의 끝나는 시각)
    assert [(t, "ABC"[k], [f for f, _ in state]) for t, k, state in trace] == [
        (14, "A", [14, 0, 0]),
        (10, "B", [14, 10, 0]),
        (7, "C", [14, 10, 7]),
        (6, "C", [14, 10, 13]),
        (5, "B", [14, 15, 13]),
        (3, "C", [14, 15, 16]),
        (2, "A", [16, 15, 16]),
    ]
    assert optimal(times, 3) == 16                                # 이 예에서는 LPT가 최적이다
    assert sum(times) == 47 and -(-47 // 3) == 16                 # 47 / 3 = 15.67이라 16보다 이를 수 없다

    # 2. LPT가 최적이 아닌 예: 기계 2대, 작업 [3, 3, 2, 2, 2]
    f, jobs = lpt([3, 3, 2, 2, 2], 2)
    assert f == 7 and jobs == [[3, 2, 2], [3, 2]]
    assert optimal([3, 3, 2, 2, 2], 2) == 6                       # {3, 3}과 {2, 2, 2}
    assert Fraction(7, 6) == bound(2)                             # 한계 4/3 - 1/6에 딱 닿는다
    # 같은 꼴의 입력: 2m-1, 2m-1, 2m-2, 2m-2, ..., m+1, m+1, m, m, m -> LPT 4m - 1, 최적 3m
    for m in (2, 3, 4):
        ts = [x for v in range(2 * m - 1, m, -1) for x in (v, v)] + [m, m, m]
        assert len(ts) == 2 * m + 1
        f, _ = lpt(ts, m)
        opt = optimal(ts, m)                                      # m = 4면 4^9 = 262,144가지
        assert (f, opt) == (4 * m - 1, 3 * m)
        assert Fraction(f, opt) == bound(m)
    assert [bound(m) for m in (1, 2, 3)] == [1, Fraction(7, 6), Fraction(11, 9)]

    # 3. 작은 무작위 입력 3,000개: 큐 판 = 훑기 판, 최적 <= LPT <= (4/3 - 1/(3m)) * 최적
    rng = random.Random(29)
    worst = Fraction(1)
    not_opt = 0
    for _ in range(3000):
        m = rng.randint(1, 4)
        n = rng.randint(1, 8 if m <= 3 else 7)
        ts = [rng.randint(1, 20) for _ in range(n)]
        f, jobs = lpt(ts, m)
        assert f == lpt_scan(ts, m)
        assert sorted(x for j in jobs for x in j) == sorted(ts)   # 모든 작업을 한 번씩 맡겼다
        opt = optimal(ts, m)
        assert opt <= f and Fraction(f, opt) <= bound(m)
        assert opt >= max(max(ts), -(-sum(ts) // m))              # 최적의 두 하한
        worst = max(worst, Fraction(f, opt))
        not_opt += f != opt
    assert not_opt > 0
    print(f"무작위 3,000개: LPT가 최적이 아닌 입력 {not_opt}개, 가장 나쁜 비율 {worst} = {float(worst):.3f}")

    # 4. 큐 연산 횟수: 처음 m대 넣기 + 작업마다 꺼내기 1번과 넣기 1번
    counter = [0]
    lpt(list(range(1, 101)), 8, counter=counter)
    assert counter[0] == 2 * 100

    # 5. 카드: 기계 2대, 작업 [4, 3, 7, 5, 3, 4] -> 긴 것부터 7, 5, 4, 4, 3, 3
    trace = []
    f, jobs = lpt([4, 3, 7, 5, 3, 4], 2, trace)
    assert f == 14 and jobs == [[7, 4, 3], [5, 4, 3]]
    assert [(t, "AB"[k], [x for x, _ in st]) for t, k, st in trace] == [
        (7, "A", [7, 0]), (5, "B", [7, 5]), (4, "B", [7, 9]),
        (4, "A", [11, 9]), (3, "B", [11, 12]), (3, "A", [14, 12]),
    ]
    assert optimal([4, 3, 7, 5, 3, 4], 2) == 13                   # {7, 3, 3}과 {5, 4, 4}
    assert Fraction(14, 13) <= bound(2)
    # 카드: 받은 차례대로(1, 1, 2) 맡기면 3, 긴 것부터 맡기면 2
    finish = [0, 0]
    for t in [1, 1, 2]:
        k = min(range(2), key=lambda j: (finish[j], j))
        finish[k] += t
    assert max(finish) == 3 and lpt([1, 1, 2], 2)[0] == 2 and optimal([1, 1, 2], 2) == 2

    print("ALL CHECKS PASSED")
```
{% endraw %}
