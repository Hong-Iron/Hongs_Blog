---
layout: "note"
title: "44_scheduling_impl.py"
display_title: "44_scheduling_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "44"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/scheduling-algorithms/"
parent_title: "스케줄링 알고리즘"
description: "운영체제 · 스케줄링 알고리즘 구현 코드"
permalink: "/studies/operating-systems/code/44_scheduling_impl/"
---
{% raw %}
[스케줄링 알고리즘](/Hongs_Blog/studies/operating-systems/scheduling-algorithms/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""단일 프로세서 스케줄링 정책을 Stallings 표 9.4의 다섯 프로세스로 시뮬레이션하고 표 9.5의 값과 비교한다.
시간 단위 1씩 진행한다. 선점형 정책에서는 같은 시각에 새로 도착한 프로세스가 시간을 다 쓴 프로세스보다 먼저 큐에 선다."""
from fractions import Fraction as F

PROCS = [("A", 0, 3), ("B", 2, 6), ("C", 4, 4), ("D", 6, 5), ("E", 8, 2)]


def run(policy, procs=PROCS, q=1):
    arrive = {n: a for n, a, _ in procs}
    service = {n: s for n, _, s in procs}
    left = dict(service)
    finish, ready, t, cur, slice_used = {}, [], 0, None, 0
    level = {n: 0 for n in service}          # 피드백 큐 단계
    timeline = []
    while len(finish) < len(procs):
        for n, a, _ in procs:
            if a == t:
                ready.append(n)
        # 지금 프로세스를 끊을지
        if cur is not None:
            if policy in ("RR", "FB", "FB2") and slice_used >= (q if policy == "RR" else (1 if policy == "FB" else 2 ** level[cur])):
                if ready:                         # 기다리는 프로세스가 있을 때만 끊는다
                    if policy != "RR":
                        level[cur] += 1
                    ready.append(cur); cur = None
                else:
                    slice_used = 0
            elif policy == "SRT" and ready and min(left[r] for r in ready) < left[cur]:
                ready.append(cur); cur = None
        if cur is None and ready:
            if policy in ("FCFS", "RR"):
                cur = ready.pop(0)
            elif policy == "SPN":
                cur = min(ready, key=lambda n: (service[n], arrive[n])); ready.remove(cur)
            elif policy == "SRT":
                cur = min(ready, key=lambda n: (left[n], arrive[n])); ready.remove(cur)
            elif policy == "HRRN":
                cur = max(ready, key=lambda n: (F(t - arrive[n] + service[n], service[n]), -arrive[n])); ready.remove(cur)
            elif policy in ("FB", "FB2"):
                lv = min(level[n] for n in ready)
                cur = next(n for n in ready if level[n] == lv); ready.remove(cur)
            slice_used = 0
        timeline.append(cur or "-")
        if cur is not None:
            left[cur] -= 1; slice_used += 1
            if left[cur] == 0:
                finish[cur] = t + 1; cur = None
        t += 1
    tr = {n: finish[n] - arrive[n] for n in service}
    norm = {n: F(tr[n], service[n]) for n in service}
    return finish, tr, norm, "".join(timeline)


TABLE_9_5 = {   # 정책: 끝나는 시각 A..E, 평균 반환 시간
    ("FCFS", 1): ([3, 9, 13, 18, 20], F(86, 10)),
    ("RR", 1): ([4, 18, 17, 20, 15], F(108, 10)),
    ("RR", 4): ([3, 17, 11, 20, 19], F(100, 10)),
    ("SPN", 1): ([3, 9, 15, 20, 11], F(76, 10)),
    ("SRT", 1): ([3, 15, 8, 20, 10], F(72, 10)),
    ("HRRN", 1): ([3, 9, 13, 20, 15], F(80, 10)),
    ("FB", 1): ([4, 20, 16, 19, 11], F(100, 10)),
    ("FB2", 1): ([4, 17, 18, 20, 14], F(106, 10)),
}

if __name__ == "__main__":
    for (pol, q), (fin, mean_tr) in TABLE_9_5.items():
        f, tr, norm, tl = run(pol, q=q)
        got = [f[n] for n in "ABCDE"]
        m = F(sum(tr.values()), 5)
        mn = F(sum(norm.values()), 5)
        print(f"{pol:5s} q={q} {tl} 끝 {got} 평균 반환 {float(m):.2f} 평균 정규화 {float(mn):.2f}")
        assert got == fin and m == mean_tr, (pol, q, got)
    # FCFS 정규화 반환 시간: E는 2만큼 일하려고 12를 보냄 -> 6.00
    assert run("FCFS")[2]["E"] == 6
    # HRRN 시각 9의 선택: C (9-4+4)/4 = 2.25, D (9-6+5)/5 = 1.6, E (9-8+2)/2 = 1.5
    assert (F(9, 4), F(8, 5), F(3, 2)) == (F(9 - 4 + 4, 4), F(9 - 6 + 5, 5), F(9 - 8 + 2, 2))

    # 카드 C3: 시각 13 HRRN, D (13-6+5)/5 = 2.4, E (13-8+2)/2 = 3.5 -> E
    assert F(13 - 6 + 5, 5) == F(12, 5) and F(13 - 8 + 2, 2) == F(7, 2)
    assert run("HRRN")[3][13:15] == "EE"
    # 카드 C2: RR q=4에서 시각 7~11에 C가 실행되고 그다음 D, 그다음 B
    assert run("RR", q=4)[3][7:17] == "CCCCDDDDBB"
    # 사다리 문제: P1(0,5) P2(1,3) P3(2,1) P4(3,2)
    LP = [("P1", 0, 5), ("P2", 1, 3), ("P3", 2, 1), ("P4", 3, 2)]
    for pol, q, fin in [("FCFS", 1, [5, 8, 9, 11]), ("SPN", 1, [5, 11, 6, 8]), ("SRT", 1, [11, 5, 3, 7]), ("RR", 2, [11, 10, 5, 9])]:
        f, tr, norm, tl = run(pol, LP, q)
        got = [f[n] for n in ["P1", "P2", "P3", "P4"]]
        print("사다리", pol, q, tl, got, float(F(sum(tr.values()), 4)))
        assert got == fin, (pol, got)
    print("ALL CHECKS PASSED")
```
{% endraw %}
