---
layout: "note"
title: "03_cpu-time-ladder_p4.py"
display_title: "03_cpu-time-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "03"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/cpu-time-ladder/"
parent_title: "CPU 시간 계산 예제 사다리"
description: "컴퓨터 구조 · CPU 시간 계산 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/computer-architecture/code/03_cpu-time-ladder_p4/"
---
{% raw %}
[CPU 시간 계산 예제 사다리](/Hongs_Blog/studies/computer-architecture/cpu-time-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 03.CPU 시간 계산 예제 사다리: 문제 1~4의 답을 분수로 정확히 확인한다.
# 실행: python3 03_cpu-time-ladder_p4.py  (표준 라이브러리만 쓴다)
from fractions import Fraction as F

PS = F(1, 10**12)


def avg_cpi(mix):
    """mix: [(비율, 사이클 수)] -> 가중 평균 CPI"""
    return sum(F(p) * F(c) for p, c in mix)


def cpu_time(ic, cpi, tc):
    return F(ic) * F(cpi) * F(tc)


if __name__ == "__main__":
    # 문제 1: 30억 개, 3 GHz, 산술 40%x1, 적재 30%x3, 저장 10%x3, 분기 20%x2
    mix = [(F(4, 10), 1), (F(3, 10), 3), (F(1, 10), 3), (F(2, 10), 2)]
    assert [p * c for p, c in mix] == [F(4, 10), F(9, 10), F(3, 10), F(4, 10)]
    cpi = avg_cpi(mix)
    assert cpi == 2
    cycles = 3 * 10**9 * cpi
    assert cycles == 6 * 10**9
    assert cycles / (3 * 10**9) == 2                      # 2.0초
    assert cpu_time(3 * 10**9, cpi, F(1, 3 * 10**9)) == 2
    # 문제 2: P(2.5 GHz, CPI 1.8), Q(4 GHz, CPI 3.2)
    tp, tq = 1 / F(25 * 10**8), 1 / F(4 * 10**9)
    assert tp == 400 * PS and tq == 250 * PS
    per_p, per_q = F(18, 10) * 400, F(32, 10) * 250
    assert per_p == 720 and per_q == 800
    assert per_q / per_p == F(10, 9)                      # P가 약 1.11배 빠르다
    # 문제 3: 원래 40억 개, CPI 1.5, 2 GHz. 새 컴파일러: 명령어 수 0.75배, CPI 1.7
    f = 2 * 10**9
    c_old = 4 * 10**9 * F(3, 2)
    assert c_old == 6 * 10**9 and c_old / f == 3
    ic_new = 4 * 10**9 * F(3, 4)
    assert ic_new == 3 * 10**9
    c_new = ic_new * F(17, 10)
    assert c_new == 51 * 10**8 and c_new / f == F(51, 20)  # 2.55초
    assert F(3) / F(51, 20) == F(20, 17)                   # 약 1.18배
    assert F(4, 3) > F(20, 17)                             # 명령어 수만 보면 1.33배라고 잘못 답한다
    # 문제 4: 기준(문제 1의 섞임, 주기 400 ps) / 안 가(적재 3->2) / 안 나(주기 320 ps, 분기 2->3)
    base = avg_cpi(mix) * 400
    mix_a = [(F(4, 10), 1), (F(3, 10), 2), (F(1, 10), 3), (F(2, 10), 2)]
    mix_b = [(F(4, 10), 1), (F(3, 10), 3), (F(1, 10), 3), (F(2, 10), 3)]
    assert avg_cpi(mix_a) == F(17, 10) and avg_cpi(mix_b) == F(22, 10)
    a = avg_cpi(mix_a) * 400
    b = avg_cpi(mix_b) * 320
    assert (base, a, b) == (800, 680, 704)
    assert base / a == F(20, 17) and base / b == F(25, 22)
    assert b / a == F(88, 85) and a < b                    # 안 가가 약 3.5% 더 빠르다
    assert abs(float(base / a) - 1.176) < 0.001 and abs(float(base / b) - 1.136) < 0.001
    assert abs(float(b / a) - 1.035) < 0.001
    print("ALL CHECKS PASSED")
```
{% endraw %}
