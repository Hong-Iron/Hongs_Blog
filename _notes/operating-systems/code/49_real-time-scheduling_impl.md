---
layout: "note"
title: "49_real-time-scheduling_impl.py"
display_title: "49_real-time-scheduling_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "49"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/real-time-scheduling/"
parent_title: "실시간 스케줄링"
description: "운영체제 · 실시간 스케줄링 구현 코드"
permalink: "/studies/operating-systems/code/49_real-time-scheduling_impl/"
---
{% raw %}
[실시간 스케줄링](/Hongs_Blog/studies/operating-systems/real-time-scheduling/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""실시간 스케줄링 (Stallings 10.2절).
(1) 주기 작업 A(주기 20, 실행 10), B(주기 50, 실행 25)의 고정 우선순위 vs 가장 이른 마감 우선(EDF) — 그림 10.6
(2) 시작 마감이 있는 비주기 작업 — 그림 10.7
(3) 비율 단조(RMS)의 이용률 한계 n(2^(1/n) - 1)
시간 단위는 ms, 1씩 진행한다."""


def periodic(policy, horizon=100):
    tasks = {"A": (20, 10), "B": (50, 25)}          # 이름: (주기, 실행 시간). 마감 = 다음 도착
    jobs, timeline, missed = [], [], []
    for t in range(horizon):
        for n, (T, C) in tasks.items():
            if t % T == 0:
                jobs.append({"n": n, "k": t // T + 1, "left": C, "dl": t + T, "rel": t})
        for j in [j for j in jobs if j["left"] > 0 and j["dl"] <= t]:
            missed.append(f'{j["n"]}{j["k"]}'); j["left"] = 0
        ready = [j for j in jobs if j["left"] > 0]
        if not ready:
            timeline.append("-"); continue
        if policy == "EDF":
            cur = min(ready, key=lambda j: (j["dl"], j["rel"]))   # 마감이 같으면 먼저 도착한 작업
        else:                                        # 고정 우선순위: policy가 높은 쪽 이름
            cur = min(ready, key=lambda j: (j["n"] != policy, j["dl"]))
        cur["left"] -= 1
        timeline.append(cur["n"])
    for j in jobs:                                   # 기간 끝에 마감이 온 작업
        if j["left"] > 0 and j["dl"] <= horizon:
            missed.append(f'{j["n"]}{j["k"]}')
    return "".join(timeline), sorted(set(missed))


def aperiodic(policy):
    # 이름: (도착, 실행, 시작 마감) — 표 10.3
    T = {"A": (10, 20, 110), "B": (20, 20, 20), "C": (40, 20, 50), "D": (50, 20, 90), "E": (60, 20, 70)}
    t, done, order, missed = 0, set(), [], []
    while len(done) + len(missed) < len(T):
        ready = [n for n in T if n not in done and n not in missed and T[n][0] <= t]
        if policy == "EDF-idle":                     # 앞으로 올 작업의 마감까지 보고, 필요하면 쉬며 기다린다
            ready = [n for n in T if n not in done and n not in missed]
        for n in list(ready):
            if t > T[n][2]:
                missed.append(n); ready.remove(n)
        if not ready:
            t += 1; continue
        if policy == "FCFS":
            n = min(ready, key=lambda x: T[x][0])
        else:
            n = min(ready, key=lambda x: T[x][2])
        start = max(t, T[n][0])
        if start > T[n][2]:
            missed.append(n); continue
        order.append((n, start)); done.add(n); t = start + T[n][1]
    return order, sorted(missed)


if __name__ == "__main__":
    tl, miss = periodic("A")
    print("A 우선", tl, miss)
    assert miss == ["B1"]
    tl, miss = periodic("B")
    print("B 우선", tl, miss)
    assert miss == ["A1", "A4"]
    tl, miss = periodic("EDF")
    print("EDF   ", tl, miss)
    assert miss == []
    # 그림 10.6 EDF 막대: A1 B1 A2 B1 A3 B2 A4 B2 A5
    runs = []
    for c in tl:
        if not runs or runs[-1][0] != c:
            runs.append([c, 0])
        runs[-1][1] += 1
    assert [r[0] for r in runs] == list("ABABABABA")
    assert [r[1] for r in runs] == [10, 10, 10, 15, 10, 5, 10, 20, 10]   # B2는 55~60과 70~90, A5는 90~100
    # 이용률: 10/20 + 25/50 = 1.0 (빈틈 없이 꽉 참)
    assert 10 / 20 + 25 / 50 == 1.0

    o, m = aperiodic("EDF");      print("EDF        ", o, m); assert [x for x, _ in o] == ["A", "C", "E", "D"] and m == ["B"]
    o, m = aperiodic("EDF-idle"); print("EDF+쉼     ", o, m); assert [x for x, _ in o] == ["B", "C", "E", "D", "A"] and m == []
    o, m = aperiodic("FCFS");     print("FCFS       ", o, m); assert [x for x, _ in o] == ["A", "C", "D"] and m == ["B", "E"]

    # 비율 단조 한계
    bound = lambda n: n * (2 ** (1 / n) - 1)
    assert round(bound(1), 3) == 1.0 and round(bound(2), 3) == 0.828 and round(bound(3), 3) == 0.780
    U = 20 / 100 + 40 / 150 + 100 / 350
    assert round(U, 3) == 0.752 and U <= bound(3)     # 교재 예: 세 작업 모두 마감 보장
    # 카드: 두 작업 C/T = 2/5, 3/10 -> U = 0.7 <= 0.828
    assert abs(2 / 5 + 3 / 10 - 0.7) < 1e-12 and 0.7 <= bound(2)
    # 사다리 문제 3: 1/4 + 2/6 + 3/12 = 0.833 > 0.780
    U3 = 1 / 4 + 2 / 6 + 3 / 12
    assert round(U3, 3) == 0.833 and U3 > bound(3) and U3 <= 1
    print("ALL CHECKS PASSED")
```
{% endraw %}
