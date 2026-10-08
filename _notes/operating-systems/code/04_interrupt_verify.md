---
layout: "note"
title: "04_interrupt_verify.py"
display_title: "04_interrupt_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "04"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/interrupt/"
parent_title: "인터럽트"
description: "운영체제 · 인터럽트 검증 코드"
permalink: "/studies/operating-systems/code/04_interrupt_verify/"
---
{% raw %}
[인터럽트](/Hongs_Blog/studies/operating-systems/interrupt/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""여러 인터럽트를 처리하는 두 방식을 시간 단위로 흉내 낸다.

- sequential: 처리 중에는 인터럽트를 막는다. 막혀 있던 요청은 도착 순서대로 처리한다.
- nested: 우선순위가 더 높은 요청만 지금 처리 중인 루틴을 끊는다.
슬라이드 예(Stallings 그림 1.12): 프린터(우선순위 2) t=10, 통신(5) t=15, 디스크(4) t=20,
각 처리 루틴은 10단위 걸린다.
"""


def simulate(requests, mode, end=60):
    """requests: [(이름, 우선순위, 도착 시각, 처리 시간)]. 시각마다 누가 CPU를 쓰는지 구간으로 돌려준다."""
    remaining = {name: dur for name, _, _, dur in requests}
    prio = {name: p for name, p, _, _ in requests}
    arrive = {name: t for name, _, t, _ in requests}
    stack = []          # 끊긴 루틴들 (중첩 방식)
    pending = []        # 도착했지만 아직 시작 못 한 요청
    current = "user"
    timeline = []
    for t in range(end):
        pending += [n for n, _, a, _ in requests if a == t]
        if mode == "nested":
            # 지금보다 우선순위가 높은 대기 요청이 있으면 지금 것을 스택에 넣고 그쪽으로 간다
            best = max(pending, key=lambda n: prio[n], default=None)
            cur_p = prio.get(current, 0)
            if best is not None and prio[best] > cur_p:
                stack.append(current)
                pending.remove(best)
                current = best
        else:
            if current == "user" and pending:
                pending.sort(key=lambda n: arrive[n])
                stack.append(current)
                current = pending.pop(0)
        timeline.append(current)
        if current != "user":
            remaining[current] -= 1
            if remaining[current] == 0:
                # 루틴이 끝나면 저장해 둔 상태를 꺼내 돌아간다
                current = stack.pop()
    # 같은 이름이 이어지는 구간으로 묶는다
    spans, start = [], 0
    for t in range(1, end + 1):
        if t == end or timeline[t] != timeline[start]:
            spans.append((start, t, timeline[start]))
            start = t
    return spans


REQ = [("printer", 2, 10, 10), ("comm", 5, 15, 10), ("disk", 4, 20, 10)]

if __name__ == "__main__":
    nested = simulate(REQ, "nested", 50)
    print("nested    ", nested)
    assert nested == [(0, 10, "user"), (10, 15, "printer"), (15, 25, "comm"),
                      (25, 35, "disk"), (35, 40, "printer"), (40, 50, "user")]
    seq = simulate(REQ, "sequential", 50)
    print("sequential", seq)
    assert seq == [(0, 10, "user"), (10, 20, "printer"), (20, 30, "comm"),
                   (30, 40, "disk"), (40, 50, "user")]
    # 통신 요청이 처리 시작까지 기다린 시간: 중첩 0, 순차 5
    assert 15 - 15 == 0 and 20 - 15 == 5

    # 카드 C5: 디스크(4) t=5 처리 8, 프린터(2) t=7 처리 4, 통신(5) t=9 처리 3
    c5 = simulate([("disk", 4, 5, 8), ("printer", 2, 7, 4), ("comm", 5, 9, 3)], "nested", 25)
    print("card C5   ", c5)
    assert c5 == [(0, 5, "user"), (5, 9, "disk"), (9, 12, "comm"), (12, 16, "disk"),
                  (16, 20, "printer"), (20, 25, "user")]
    print("ALL CHECKS PASSED")
```
{% endraw %}
