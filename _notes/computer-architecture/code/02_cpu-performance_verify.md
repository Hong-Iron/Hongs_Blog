---
layout: "note"
title: "02_cpu-performance_verify.py"
display_title: "02_cpu-performance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "02"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/cpu-performance/"
parent_title: "성능과 실행 시간"
description: "컴퓨터 구조 · 성능과 실행 시간 검증 코드"
permalink: "/studies/computer-architecture/code/02_cpu-performance_verify/"
---
{% raw %}
[성능과 실행 시간](/Hongs_Blog/studies/computer-architecture/cpu-performance/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 02.성능과 실행 시간: 문서의 수치와 카드 답을 확인한다.
# 실행: python3 02_cpu-performance_verify.py  (표준 라이브러리만 쓴다)
from fractions import Fraction as F


def performance(time):
    return 1 / F(time)


def times_faster(time_x, time_y):
    """X가 Y보다 몇 배 빠른가 = 성능_X / 성능_Y = 시간_Y / 시간_X"""
    return performance(time_x) / performance(time_y)


if __name__ == "__main__":
    # 예시: A 12초, B 18초
    assert times_faster(12, 18) == F(3, 2)
    assert times_faster(12, 18) == F(18, 12)
    # B는 A보다 시간이 50% 더 걸리고, A는 B보다 시간이 33.3% 덜 걸린다
    assert F(18 - 12, 12) == F(1, 2)
    assert F(18 - 12, 18) == F(1, 3)
    # 응답 시간 20초 = CPU 시간 14초(사용자 11 + 시스템 3) + 기다린 시간 6초
    assert 11 + 3 == 14 and 14 + 6 == 20
    assert F(14, 20) == F(7, 10)
    # 처리량: 프로세서를 1.5배 빠른 것으로 바꾸면 작업 하나 12초 -> 8초, 한 시간에 300개 -> 450개
    assert F(12) / F(3, 2) == 8
    assert 3600 // 12 == 300 and 3600 // 8 == 450
    # 프로세서를 2개로 늘리면(작업 하나는 그대로 12초) 한 시간에 600개
    assert 2 * (3600 // 12) == 600
    # 카드 C2: X 45초, Y 30초 -> Y가 1.5배 빠르다
    assert times_faster(30, 45) == F(3, 2)
    # 카드 C3: 응답 시간 50초 가운데 CPU 20초. CPU만 2배 빨라지면 40초, 1.25배
    assert 20 / F(2) + 30 == 40 and F(50, 40) == F(5, 4)
    print("ALL CHECKS PASSED")
```
{% endraw %}
