---
layout: "note"
title: "44_multicore-parallelism_verify.py"
display_title: "44_multicore-parallelism_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "44"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/multicore-parallelism/"
parent_title: "멀티코어와 병렬 처리"
description: "컴퓨터 구조 · 멀티코어와 병렬 처리 검증 코드"
permalink: "/studies/computer-architecture/code/44_multicore-parallelism_verify/"
---
{% raw %}
[멀티코어와 병렬 처리](/Hongs_Blog/studies/computer-architecture/multicore-parallelism/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""멀티코어: 암달의 법칙 수치와 거짓 공유 흉내를 확인한다.

실행: python3 44_multicore-parallelism_verify.py  (표준 라이브러리만 쓴다. 다른 파일을 불러오지 않는다.)
캐시 흉내기는 실제 하드웨어가 아니라 동작 규칙을 옮긴 파이썬 코드다.
주소는 0부터 세는 바이트 주소, 줄·집합·way 번호도 0부터 센다.
"""
import math


def speedup(f, n):
    """암달의 법칙: 전체 중 f만큼을 n배 빠르게 했을 때의 전체 향상."""
    return 1 / ((1 - f) + f / n)


def coherence_misses(writes, block_of):
    """코어마다 자기 캐시가 있다. 어느 코어가 블록에 쓰면 다른 코어가 가진 그 블록 사본은 못 쓰게 된다.
    writes: [(코어, 변수)], block_of: 변수 -> 블록 번호. 실패(블록을 다시 가져온 횟수)를 센다.
    실제 하드웨어가 아니라 규칙 하나만 옮긴 흉내다."""
    valid = {}                      # 코어 -> 쓸 수 있는 블록 집합
    misses = 0
    for core, var in writes:
        b = block_of[var]
        if b not in valid.setdefault(core, set()):
            misses += 1
            valid[core].add(b)
        for other in valid:
            if other != core:
                valid[other].discard(b)
    return misses


if __name__ == "__main__":
    # 프로그램의 90%를 나눠 돌릴 수 있을 때
    assert round(speedup(0.9, 8), 2) == 4.71
    assert round(speedup(0.9, 64), 2) == 8.77
    assert abs(1 / (1 - 0.9) - 10) < 1e-9                 # 코어가 아무리 많아도 10배 미만
    assert all(speedup(0.9, n) < 10 for n in (2, 8, 64, 1024, 10 ** 6))
    assert round(speedup(0.5, 8), 2) == 1.78
    # 코어 32개로 16배를 얻으려면 나눠 돌릴 수 있는 부분이 얼마나 되어야 하나
    f = (1 - 1 / 16) / (1 - 1 / 32)
    assert abs(speedup(f, 32) - 16) < 1e-9 and round(f * 100, 1) == 96.8
    # 카드 C2: 80%를 4코어로
    assert round(speedup(0.8, 4), 2) == 2.5 and abs(1 / (1 - 0.8) - 5) < 1e-9

    # 플린 분류: 명령어 흐름 수 x 데이터 흐름 수
    flynn = {(1, 1): "SISD", (1, 2): "SIMD", (2, 1): "MISD", (2, 2): "MIMD"}
    assert len(flynn) == 4 and flynn[(2, 2)] == "MIMD"

    # 거짓 공유: 두 코어가 서로 다른 변수 x, y를 번갈아 100번씩 쓴다
    writes = [(0, "x"), (1, "y")] * 100
    same_block = coherence_misses(writes, {"x": 0, "y": 0})     # x와 y가 한 블록에
    apart = coherence_misses(writes, {"x": 0, "y": 1})          # 서로 다른 블록에
    assert (same_block, apart) == (200, 2)
    print("ALL CHECKS PASSED")
```
{% endraw %}
