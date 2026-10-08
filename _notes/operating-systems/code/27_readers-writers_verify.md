---
layout: "note"
title: "27_readers-writers_verify.py"
display_title: "27_readers-writers_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/readers-writers/"
parent_title: "독자-저자 문제"
description: "운영체제 · 독자-저자 문제 검증 코드"
permalink: "/studies/operating-systems/code/27_readers-writers_verify/"
---
{% raw %}
[독자-저자 문제](/Hongs_Blog/studies/operating-systems/readers-writers/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""독자 우선 독자-저자 해법(Stallings 그림 5.22)을 실제 스레드로 돌려,
(1) 저자는 언제나 혼자 쓰고, (2) 저자가 쓰는 동안 독자가 없고, (3) 독자는 여럿이 함께 읽을 수 있음을 확인한다."""
import threading
import time

readcount = 0
x = threading.Semaphore(1)      # readcount 보호
wsem = threading.Semaphore(1)   # 쓰기 권한
state = {"readers": 0, "writers": 0, "max_readers": 0, "violations": 0}
guard = threading.Lock()        # 검사용 기록 보호(해법의 일부가 아님)


def check():
    if state["writers"] > 1 or (state["writers"] and state["readers"]):
        state["violations"] += 1


def reader():
    global readcount
    for _ in range(200):
        x.acquire()
        readcount += 1
        if readcount == 1:
            wsem.acquire()          # 첫 독자가 저자를 막는다
        x.release()
        with guard:
            state["readers"] += 1
            state["max_readers"] = max(state["max_readers"], state["readers"])
            check()
        time.sleep(0.0002)          # 읽는 중
        with guard:
            state["readers"] -= 1
        x.acquire()
        readcount -= 1
        if readcount == 0:
            wsem.release()          # 마지막 독자가 저자를 풀어 준다
        x.release()


def writer():
    for _ in range(50):
        wsem.acquire()
        with guard:
            state["writers"] += 1
            check()
        time.sleep(0.0002)          # 쓰는 중
        with guard:
            state["writers"] -= 1
        wsem.release()


if __name__ == "__main__":
    ts = [threading.Thread(target=reader) for _ in range(4)] + [threading.Thread(target=writer) for _ in range(2)]
    for t in ts: t.start()
    for t in ts: t.join(timeout=60)
    assert not any(t.is_alive() for t in ts)
    print(state)
    assert state["violations"] == 0
    assert state["max_readers"] >= 2     # 여러 독자가 함께 읽은 적이 있다
    print("ALL CHECKS PASSED")
```
{% endraw %}
