---
layout: "note"
title: "11_multiprogramming_verify.py"
display_title: "11_multiprogramming_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "11"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/multiprogramming/"
parent_title: "다중 프로그래밍"
description: "운영체제 · 다중 프로그래밍 검증 코드"
permalink: "/studies/operating-systems/code/11_multiprogramming_verify/"
---
{% raw %}
[다중 프로그래밍](/Hongs_Blog/studies/operating-systems/multiprogramming/) 문서의 검증 코드다.

```python
"""다중 프로그래밍 슬라이드의 수치를 다시 계산한다 (Stallings 그림 2.4, 표 2.1, 그림 2.6)."""
from fractions import Fraction as F

# 그림 2.4: 레코드 하나 읽기 15us, 명령어 100개 실행 1us, 쓰기 15us
read, compute, write = 15, 1, 15
util = F(compute, read + compute + write)
print("CPU 사용률", util, float(util))
assert read + compute + write == 31 and round(float(util), 3) == 0.032

# 표 2.1: 작업 이름 -> (걸리는 분, 메모리 MB, 디스크, 터미널, 프린터)
jobs = {"JOB1": (5, 50, 0, 0, 0), "JOB2": (15, 100, 0, 1, 0), "JOB3": (10, 75, 1, 0, 1)}
MEM = 250

# 단일 프로그래밍: 차례로 실행 -> 끝나는 시각 5, 20, 30
t, finish_uni = 0, {}
for name, (d, *_ ) in jobs.items():
    t += d
    finish_uni[name] = t
# 다중 프로그래밍: 자원 다툼이 거의 없어 각자 최소 시간에 끝남 -> 5, 15, 10
finish_multi = {name: d for name, (d, *_) in jobs.items()}

for label, fin in [("단일", finish_uni), ("다중", finish_multi)]:
    elapsed = max(fin.values())
    throughput = F(len(jobs) * 60, elapsed)                 # 시간당 작업 수
    response = F(sum(fin.values()), len(jobs))              # 평균 응답 시간(분)
    mem = F(sum(d * m for d, m, *_ in jobs.values()), MEM * elapsed)
    disk = F(sum(d * k for d, _, k, _, _ in jobs.values()), elapsed)
    printer = F(sum(d * p for d, _, _, _, p in jobs.values()), elapsed)
    print(label, "경과", elapsed, "처리량", throughput, "평균응답", response, float(response),
          "메모리", mem, "디스크", disk, "프린터", printer)
    if label == "단일":
        assert (elapsed, throughput, mem, disk, printer) == (30, 6, F(1, 3), F(1, 3), F(1, 3))
        assert response == F(55, 3)           # 18.3분
    else:
        assert (elapsed, throughput, response, mem, disk, printer) == (15, 12, 10, F(2, 3), F(2, 3), F(2, 3))

# 카드 C4: 단일 프로그래밍에서 JOB1 -> JOB3 -> JOB2 순서면 끝나는 시각 5, 15, 30
assert F(5 + 15 + 30, 3) == F(50, 3)      # 약 16.7분

# 예제 사다리 문제들
def cpu_util(read, compute, write):
    return F(compute, read + compute + write)

assert cpu_util(10, 2, 10) == F(1, 11)                          # p2: 약 9.1%
assert round(float(cpu_util(20, 4, 16)), 3) == 0.1               # p3: 4/40 = 10%
assert cpu_util(8, 1, 8) == F(1, 17)                             # p4 (1): 약 5.9%
# p4 (2): 프로그램 k개가 서로 겹치지 않고 번갈아 계산하면 사용률은 k배 (단, 100%를 넘을 수 없다)
assert min(1, 3 * cpu_util(8, 1, 8)) == F(3, 17)                 # 약 17.6%
assert min(1, 17 * cpu_util(8, 1, 8)) == 1

# 보충: 각 프로그램이 시간의 비율 p만큼 입출력을 기다리고 서로 독립이면 사용률 = 1 - p^n
for n, expect in [(1, 0.2), (3, 0.488), (5, 0.67232)]:
    assert abs((1 - 0.8 ** n) - expect) < 1e-9
print("ALL CHECKS PASSED")
```
{% endraw %}
