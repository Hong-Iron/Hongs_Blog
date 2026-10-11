---
layout: "note"
title: "14_process-states_verify.py"
display_title: "14_process-states_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/process-states/"
parent_title: "프로세스 상태"
description: "운영체제 · 프로세스 상태 검증 코드"
permalink: "/studies/operating-systems/code/14_process-states_verify/"
---
{% raw %}
[프로세스 상태](/Hongs_Blog/studies/operating-systems/process-states/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""일시 중단 상태 둘을 넣은 7상태 프로세스 모델(Stallings 그림 3.9b)의 전이를 표로 두고,
문서의 추적 문제를 사건 순서대로 따라가 확인한다."""

# (지금 상태, 사건) -> 다음 상태
T = {
    ("New", "admit"): "Ready",
    ("New", "admit_suspend"): "Ready/Suspend",
    ("Ready", "dispatch"): "Running",
    ("Running", "timeout"): "Ready",
    ("Running", "event_wait"): "Blocked",
    ("Running", "release"): "Exit",
    ("Blocked", "event_occurs"): "Ready",
    ("Blocked", "suspend"): "Blocked/Suspend",
    ("Blocked/Suspend", "event_occurs"): "Ready/Suspend",
    ("Blocked/Suspend", "activate"): "Blocked",
    ("Ready/Suspend", "activate"): "Ready",
    ("Ready", "suspend"): "Ready/Suspend",
    ("Running", "suspend"): "Ready/Suspend",
}


def run(events, start="New"):
    s, path = start, [start]
    for e in events:
        if (s, e) not in T:
            raise ValueError(f"{s} 상태에서 '{e}'는 일어날 수 없다")
        s = T[(s, e)]
        path.append(s)
    return path


if __name__ == "__main__":
    # 카드 C3
    p = run(["admit", "dispatch", "event_wait", "suspend", "event_occurs", "activate", "dispatch", "release"])
    print(" -> ".join(p))
    assert p == ["New", "Ready", "Running", "Blocked", "Blocked/Suspend", "Ready/Suspend", "Ready", "Running", "Exit"]
    # 5상태 모델에는 대기에서 실행으로 바로 가는 길이 없다 (카드 C4)
    try:
        run(["admit", "dispatch", "event_wait", "dispatch"])
        raise AssertionError("Blocked -> Running이 허용됨")
    except ValueError:
        pass
    # 일시 중단 상태에서는 바로 실행될 수 없다
    assert all(not (s.endswith("Suspend") and nxt == "Running") for (s, _), nxt in T.items())
    print("ALL CHECKS PASSED")
```
{% endraw %}
