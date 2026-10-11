---
layout: "note"
title: "32_dining-philosophers_verify.py"
display_title: "32_dining-philosophers_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "32"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/dining-philosophers/"
parent_title: "식사하는 철학자 문제"
description: "운영체제 · 식사하는 철학자 문제 검증 코드"
permalink: "/studies/operating-systems/code/32_dining-philosophers_verify/"
---
{% raw %}
[식사하는 철학자 문제](/Hongs_Blog/studies/operating-systems/dining-philosophers/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""식사하는 철학자: (1) 모두 왼쪽 포크부터 잡으면 교착상태가 생기는 순서를 재현하고,
(2) 방에 최대 4명만 들이는 해법(Stallings 그림 6.13)과 (3) 포크 번호 순서 해법이 실제로 멈추지 않는지 돌려 본다."""
import threading

N, MEALS = 5, 300


def naive_deadlock():
    forks = [threading.Lock() for _ in range(N)]
    for i in range(N):
        forks[i].acquire()                       # 다섯 명이 동시에 왼쪽 포크를 잡은 순간
    # 이제 누구도 오른쪽 포크 (i+1)%N을 얻을 수 없다
    return [forks[(i + 1) % N].acquire(timeout=0.05) for i in range(N)]


def run(strategy):
    forks = [threading.Lock() for _ in range(N)]
    room = threading.Semaphore(N - 1)
    eaten = [0] * N

    def phil(i):
        left, right = i, (i + 1) % N
        for _ in range(MEALS):
            if strategy == "room":
                room.acquire()
                forks[left].acquire(); forks[right].acquire()
            else:  # "order": 번호가 작은 포크부터
                a, b = sorted((left, right))
                forks[a].acquire(); forks[b].acquire()
            eaten[i] += 1
            forks[right].release(); forks[left].release()
            if strategy == "room":
                room.release()

    ts = [threading.Thread(target=phil, args=(i,)) for i in range(N)]
    for t in ts: t.start()
    for t in ts: t.join(timeout=30)
    return not any(t.is_alive() for t in ts), eaten


if __name__ == "__main__":
    assert naive_deadlock() == [False] * N
    for s in ("room", "order"):
        ok, eaten = run(s)
        print(s, ok, eaten)
        assert ok and eaten == [MEALS] * N
    print("ALL CHECKS PASSED")
```
{% endraw %}
