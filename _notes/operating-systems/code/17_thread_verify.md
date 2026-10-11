---
layout: "note"
title: "17_thread_verify.py"
display_title: "17_thread_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "17"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/thread/"
parent_title: "스레드"
description: "운영체제 · 스레드 검증 코드"
permalink: "/studies/operating-systems/code/17_thread_verify/"
---
{% raw %}
[스레드](/Hongs_Blog/studies/operating-systems/thread/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""스레드는 프로세스의 메모리를 함께 쓰고, 프로세스끼리는 따로 쓴다는 것을 확인한다.
또 입출력을 기다리는 일(여기서는 sleep)을 스레드로 나누면 기다림이 겹쳐 빨라진다는 것도 확인한다
(슬라이드의 RPC 예: 서버 두 곳에 요청을 보내고 답을 기다림)."""
import multiprocessing as mp
import threading
import time

counter = {"value": 0}


def bump():
    counter["value"] += 1


def fake_rpc(results, i, delay):
    time.sleep(delay)          # 원격 서버의 답을 기다리는 시간
    results[i] = f"server{i}"


if __name__ == "__main__":
    # 1. 스레드: 같은 프로세스의 메모리를 함께 본다
    t = threading.Thread(target=bump)
    t.start(); t.join()
    assert counter["value"] == 1, counter

    # 2. 프로세스: 자식은 자기 복사본을 고친다. 부모의 값은 그대로다
    p = mp.get_context("spawn").Process(target=bump)
    p.start(); p.join()
    assert counter["value"] == 1, counter

    # 3. RPC 두 번, 각 0.3초 대기
    delay = 0.3
    start = time.perf_counter()
    res = [None, None]
    for i in range(2):
        fake_rpc(res, i, delay)                     # 스레드 하나: 차례로 기다림
    single = time.perf_counter() - start

    start = time.perf_counter()
    res = [None, None]
    ths = [threading.Thread(target=fake_rpc, args=(res, i, delay)) for i in range(2)]
    for th in ths: th.start()
    for th in ths: th.join()                        # 서버마다 스레드 하나: 함께 기다림
    multi = time.perf_counter() - start
    print(f"스레드 하나 {single:.2f}s, 서버마다 스레드 {multi:.2f}s")
    assert res == ["server0", "server1"]
    assert single >= 2 * delay and multi < 1.5 * delay
    # 카드 C4: 디스크 40ms + 계산 2ms, 요청 5개
    assert 5 * (40 + 2) == 210                      # 스레드 하나로 차례로
    assert 40 + 5 * 2 == 50                         # 읽기는 겹치고 계산은 차례로
    print("ALL CHECKS PASSED")
```
{% endraw %}
