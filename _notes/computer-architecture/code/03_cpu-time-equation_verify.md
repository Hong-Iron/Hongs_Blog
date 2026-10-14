---
layout: "note"
title: "03_cpu-time-equation_verify.py"
display_title: "03_cpu-time-equation_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "03"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/cpu-time-equation/"
parent_title: "CPU 시간 식"
description: "컴퓨터 구조 · CPU 시간 식 검증 코드"
sitemap: false
permalink: "/studies/computer-architecture/code/03_cpu-time-equation_verify/"
---
{% raw %}
[CPU 시간 식](/Hongs_Blog/studies/computer-architecture/cpu-time-equation/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 03.CPU 시간 식: 문서의 예제, 표, 카드 답을 분수로 정확히 확인한다.
# 실행: python3 03_cpu-time-equation_verify.py  (표준 라이브러리만 쓴다)
from fractions import Fraction as F
import random

PS = F(1, 10**12)
NS = F(1, 10**9)


def cpu_time(ic, cpi, tc):
    """CPU 시간 = 명령어 수 x CPI x 클록 주기"""
    return F(ic) * F(cpi) * F(tc)


def avg_cpi(mix):
    """mix: [(비율 또는 개수, CPI)] -> 가중 평균 CPI"""
    total = sum(F(c) for c, _ in mix)
    return sum(F(c) * F(k) for c, k in mix) / total


if __name__ == "__main__":
    # 예시: 명령어 20억 개, CPI 1.5, 2.5 GHz
    tc = 1 / F(25 * 10**8)
    assert tc == 400 * PS
    assert cpu_time(2 * 10**9, F(3, 2), tc) == F(6, 5)          # 1.2초
    assert 2 * 10**9 * F(3, 2) == 3 * 10**9                     # 30억 사이클
    # 주기와 주파수
    assert 1 / F(4 * 10**9) == 250 * PS
    # 예제 1: A(200 ps, CPI 2.5), B(350 ps, CPI 1.2), 같은 명령어 집합
    ta = F(5, 2) * 200
    tb = F(6, 5) * 350
    assert ta == 500 and tb == 420
    assert ta / tb == F(25, 21) and abs(float(ta / tb) - 1.19) < 0.001
    # 예제 2: 명령어 섞임 -> 평균 CPI
    mix = [(F(45, 100), 1), (F(25, 100), 3), (F(10, 100), 2), (F(20, 100), 2)]
    assert avg_cpi(mix) == F(9, 5)                              # 1.8
    parts = [F(45, 100) * 1, F(25, 100) * 3, F(10, 100) * 2, F(20, 100) * 2]
    assert parts == [F(45, 100), F(75, 100), F(20, 100), F(40, 100)]
    assert parts[1] / F(9, 5) == F(5, 12)                       # 적재가 시간의 41.7%
    # 적재를 3 -> 2 사이클로 줄이면 CPI 1.55, 1.161배
    mix2 = [(F(45, 100), 1), (F(25, 100), 2), (F(10, 100), 2), (F(20, 100), 2)]
    assert avg_cpi(mix2) == F(31, 20)
    assert F(9, 5) / F(31, 20) == F(36, 31)
    # 예제 3: 두 가지 코드. 종류 A/B/C의 CPI = 1/2/4
    seq1 = [(3, 1), (2, 2), (1, 4)]
    seq2 = [(6, 1), (1, 2), (0, 4)]
    c1 = sum(n * k for n, k in seq1)
    c2 = sum(n * k for n, k in seq2)
    assert (c1, c2) == (11, 8)
    assert avg_cpi(seq1) == F(11, 6) and avg_cpi(seq2) == F(8, 7)
    # MIPS 값의 함정: 4 GHz, 컴파일러 1(50억, CPI 1.2) vs 컴파일러 2(80억, CPI 1.0)
    f = 4 * 10**9
    t1 = cpu_time(5 * 10**9, F(6, 5), F(1, f))
    t2 = cpu_time(8 * 10**9, 1, F(1, f))
    assert t1 == F(3, 2) and t2 == 2
    m1 = F(5 * 10**9) / (t1 * 10**6)
    m2 = F(8 * 10**9) / (t2 * 10**6)
    assert m1 == F(10000, 3) and m2 == 4000 and m2 > m1 and t2 > t1
    assert m1 == F(f) / (F(6, 5) * 10**6)                       # MIPS = 클록 속도 / (CPI x 10^6)
    # 오해 항목: 3 GHz에 CPI 2.4 vs 2 GHz에 CPI 1.2
    assert F(24, 10) / 3 == F(4, 5) and F(12, 10) / 2 == F(3, 5)
    assert F(4, 5) / F(3, 5) == F(4, 3)
    # 스스로 설명: 식의 단위가 초로 떨어진다 (명령어 x 사이클/명령어 x 초/사이클)
    # 무작위로: 시간 = 사이클 수 x 주기 = 사이클 수 / 주파수
    rnd = random.Random(1)
    for _ in range(1000):
        ic = rnd.randint(1, 10**10)
        cpi = F(rnd.randint(1, 50), 10)
        fr = rnd.randint(10**8, 5 * 10**9)
        assert cpu_time(ic, cpi, F(1, fr)) == ic * cpi / fr
    # 카드 C2: 15억 개, CPI 2, 주기 250 ps -> 0.75초
    assert cpu_time(15 * 10**8, 2, 250 * PS) == F(3, 4)
    # 카드 C3: 클록을 3 GHz -> 4 GHz로 올렸더니 CPI가 1.5 -> 2.1
    assert F(15, 10) / 3 == F(1, 2) and F(21, 10) / 4 == F(21, 40)
    assert F(21, 40) / F(1, 2) == F(21, 20)                     # 5% 느려진다
    # 카드 C4: 10초, 2 GHz -> 6초에 끝내려는데 사이클이 1.5배 든다 -> 5 GHz
    cycles = 10 * 2 * 10**9
    assert F(cycles * 3, 2) / 6 == 5 * 10**9
    # 카드 C5: 새 컴파일러가 명령어 수를 0.8배로, CPI를 1.1배로
    assert F(8, 10) * F(11, 10) == F(22, 25) and 1 / F(22, 25) == F(25, 22)
    print("ALL CHECKS PASSED")
```
{% endraw %}
