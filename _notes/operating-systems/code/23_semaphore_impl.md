---
layout: "note"
title: "23_semaphore_impl.py"
display_title: "23_semaphore_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "23"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/semaphore/"
parent_title: "세마포어"
description: "운영체제 · 세마포어 구현 코드"
permalink: "/studies/operating-systems/code/23_semaphore_impl/"
---
{% raw %}
[세마포어](/Hongs_Blog/studies/operating-systems/semaphore/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""Stallings 그림 5.3의 세마포어를 그대로 흉내 낸다 (프로세스 대기는 큐에 넣는 것으로 표시).

semWait: count를 1 줄이고, 0보다 작아지면 부른 프로세스를 큐에 넣어 막는다.
semSignal: count를 1 늘리고, 0 이하이면 큐에서 하나를 꺼내 준비 상태로 만든다.
강한 세마포어는 큐를 FIFO로 다룬다.
"""
from collections import deque


class Semaphore:
    def __init__(self, count):
        self.count = count
        self.queue = deque()

    def wait(self, p):
        self.count -= 1
        if self.count < 0:
            self.queue.append(p)
            return "blocked"
        return "go"

    def signal(self):
        self.count += 1
        if self.count <= 0:
            return self.queue.popleft()      # 준비 상태로 옮길 프로세스
        return None


if __name__ == "__main__":
    # 그림 5.7: A, B, C가 s(초기값 1)로 보호한 자원을 쓴다
    s = Semaphore(1)
    log = []
    log.append(("A wait", s.wait("A"), s.count))   # A 들어감, 0
    log.append(("B wait", s.wait("B"), s.count))   # B 막힘, -1
    log.append(("C wait", s.wait("C"), s.count))   # C 막힘, -2
    log.append(("A signal", s.signal(), s.count))  # B 깨움, -1
    log.append(("B signal", s.signal(), s.count))  # C 깨움, 0
    log.append(("C signal", s.signal(), s.count))  # 깨울 것 없음, 1
    for row in log:
        print(row)
    assert [r[2] for r in log] == [0, -1, -2, -1, 0, 1]
    assert [r[1] for r in log] == ["go", "blocked", "blocked", "B", "C", None]

    # count가 음수이면 그 절댓값이 기다리는 프로세스 수
    s = Semaphore(2)
    for p in "PQRST":
        s.wait(p)
    assert s.count == -3 and len(s.queue) == 3 and list(s.queue) == ["R", "S", "T"]

    # 카드 C4: 초기값 3, wait 5번, signal 1번 -> count -1, 대기 1개(첫 대기자는 깨어남)
    s = Semaphore(3)
    for p in "ABCDE":
        s.wait(p)
    woke = s.signal()
    assert (s.count, woke, list(s.queue)) == (-1, "D", ["E"])
    print("ALL CHECKS PASSED")
```
{% endraw %}
