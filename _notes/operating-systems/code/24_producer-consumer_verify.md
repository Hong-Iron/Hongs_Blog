---
layout: "note"
title: "24_producer-consumer_verify.py"
display_title: "24_producer-consumer_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/producer-consumer/"
parent_title: "생산자-소비자 문제"
description: "운영체제 · 생산자-소비자 문제 검증 코드"
permalink: "/studies/operating-systems/code/24_producer-consumer_verify/"
---
{% raw %}
[생산자-소비자 문제](/Hongs_Blog/studies/operating-systems/producer-consumer/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""유한 버퍼 생산자-소비자(Stallings 그림 5.13)를 실제 스레드와 세마포어로 돌린다.
s: 버퍼 접근 상호 배제(1), n: 찬 칸 수(0), e: 빈 칸 수(버퍼 크기)."""
import threading

SIZE, ITEMS = 4, 2000


def run_bounded(producers=2):
    buf, inp, out = [None] * SIZE, 0, 0
    s, n, e = threading.Semaphore(1), threading.Semaphore(0), threading.Semaphore(SIZE)
    produced, consumed, max_fill = [], [], [0]
    fill = [0]

    def producer(pid):
        nonlocal inp
        for i in range(ITEMS):
            v = (pid, i)
            e.acquire()            # semWait(e): 빈 칸이 있을 때까지
            s.acquire()            # semWait(s)
            buf[inp] = v; inp = (inp + 1) % SIZE
            fill[0] += 1; max_fill[0] = max(max_fill[0], fill[0])
            produced.append(v)
            s.release()            # semSignal(s)
            n.release()            # semSignal(n)

    def consumer():
        nonlocal out
        for _ in range(ITEMS * producers):
            n.acquire()            # semWait(n): 찬 칸이 있을 때까지
            s.acquire()
            w = buf[out]; out = (out + 1) % SIZE
            fill[0] -= 1
            consumed.append(w)
            s.release()
            e.release()            # semSignal(e)

    ts = [threading.Thread(target=producer, args=(p,)) for p in range(producers)]
    ts.append(threading.Thread(target=consumer))
    for t in ts: t.start()
    for t in ts: t.join(timeout=20)
    assert not any(t.is_alive() for t in ts), "멈춤"
    return produced, consumed, max_fill[0]


if __name__ == "__main__":
    produced, consumed, mx = run_bounded()
    print("생산", len(produced), "소비", len(consumed), "버퍼 최대 칸", mx)
    assert consumed == produced          # 넣은 순서대로 하나도 빠짐없이 꺼냄
    assert mx <= SIZE                    # 넘치지 않음
    # 생산자마다 자기 물건의 순서가 지켜짐
    for p in range(2):
        mine = [i for (q, i) in consumed if q == p]
        assert mine == list(range(ITEMS))

    # 카드 C3: 생산자가 semWait(s)를 먼저, semWait(e)를 나중에 하면 버퍼가 찼을 때 멈출 수 있다.
    # 결정적으로 재현: 버퍼가 가득 찬 상태에서 생산자가 s를 쥔 채 e를 기다리면 소비자는 s를 못 얻는다.
    s, e = threading.Semaphore(1), threading.Semaphore(0)   # e=0: 빈 칸 없음
    s.acquire()                                             # 생산자가 s를 쥠
    got_e = e.acquire(timeout=0.2)                          # 생산자: 빈 칸을 기다림 -> 영원히 못 얻음
    consumer_got_s = s.acquire(timeout=0.2)                 # 소비자: s가 필요함 -> 못 얻음
    assert not got_e and not consumer_got_s
    # 카드 C3: 칸 5개 원형 버퍼, in=3, out=4 -> (in+1)%5 == out 이므로 가득 참
    assert (3 + 1) % 5 == 4
    print("ALL CHECKS PASSED")
```
{% endraw %}
