---
layout: "note"
title: "46_unix-fair-share_verify.py"
display_title: "46_unix-fair-share_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "46"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/fair-share-unix-scheduling/"
parent_title: "공정 분배와 UNIX 스케줄링"
description: "운영체제 · 공정 분배와 UNIX 스케줄링 검증 코드"
permalink: "/studies/operating-systems/code/46_unix-fair-share_verify/"
---
{% raw %}
[공정 분배와 UNIX 스케줄링](/Hongs_Blog/studies/operating-systems/fair-share-unix-scheduling/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""전통 UNIX 스케줄링(그림 9.17)과 공정 분배 스케줄러(그림 9.16)의 우선순위 계산을 재현한다.
매 초 끝에: CPU = CPU/2, 우선순위 = 기본 + CPU/2 (+ 그룹 CPU/(4W)). 나눗셈은 항마다 소수점을 버린다. 값이 작을수록 우선순위가 높다.
한 초 동안 실행된 프로세스는 CPU 카운트가 60 늘어난다. 동률이면 앞 프로세스(A, B, C 순)."""


def unix(seconds=5, base=60):
    cpu = {p: 0 for p in "ABC"}
    prio = {p: base for p in "ABC"}
    rows = []
    for _ in range(seconds):
        run = min("ABC", key=lambda p: (prio[p], "ABC".index(p)))
        rows.append((run, dict(prio)))
        cpu[run] += 60
        for p in "ABC":
            cpu[p] //= 2
            prio[p] = base + cpu[p] // 2
    rows.append((None, dict(prio)))
    return rows


def fair(seconds=5, base=60, W=0.5):
    group = {"A": 1, "B": 2, "C": 2}
    cpu = {p: 0 for p in "ABC"}; gcpu = {1: 0, 2: 0}
    prio = {p: base for p in "ABC"}
    rows = []
    for _ in range(seconds):
        run = min("ABC", key=lambda p: (prio[p], "ABC".index(p)))
        rows.append((run, dict(prio)))
        cpu[run] += 60; gcpu[group[run]] += 60
        for p in "ABC":
            cpu[p] //= 2
        for g in gcpu:
            gcpu[g] //= 2
        for p in "ABC":
            prio[p] = base + int(cpu[p] / 2) + int(gcpu[group[p]] / (4 * W))   # 항마다 소수점 버림 (그림 9.16과 같음)
    rows.append((None, dict(prio)))
    return rows


if __name__ == "__main__":
    u = unix()
    print(u)
    assert [r[0] for r in u[:5]] == ["A", "B", "C", "A", "B"]
    assert [r[1]["A"] for r in u] == [60, 75, 67, 63, 76, 68]
    assert [r[1]["C"] for r in u] == [60, 60, 60, 75, 67, 63]
    f = fair()
    print(f)
    assert [r[0] for r in f[:5]] == ["A", "B", "A", "C", "A"]
    assert [r[1]["A"] for r in f] == [60, 90, 74, 96, 78, 98]
    assert [r[1]["B"] for r in f] == [60, 60, 90, 74, 81, 70]
    assert [r[1]["C"] for r in f] == [60, 60, 75, 67, 93, 76]
    assert 60 + (80 // 2) // 2 == 80          # 카드 C1
    print("ALL CHECKS PASSED")
```
{% endraw %}
