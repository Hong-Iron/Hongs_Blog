---
layout: "note"
title: "26_single-cycle-timing_verify.py"
display_title: "26_single-cycle-timing_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/single-cycle-timing/"
parent_title: "단일 사이클의 클록 주기"
description: "컴퓨터 구조 · 단일 사이클의 클록 주기 검증 코드"
permalink: "/studies/computer-architecture/code/26_single-cycle-timing_verify/"
---
{% raw %}
[단일 사이클의 클록 주기](/Hongs_Blog/studies/computer-architecture/single-cycle-timing/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 단일 사이클의 클록 주기와 파이프라인의 클록 주기 계산
# 실행: python3 26_single-cycle-timing_verify.py
# 부품 지연 시간은 이 문서에서 직접 정한 값이다(교재의 수치가 아니다). 단위는 ps.
DELAY = dict(IM=250, RegRead=150, ALU=200, DM=250, RegWrite=100)
PATH = {            # 명령어 종류마다 차례로 지나는 부품
    "lw":  ["IM", "RegRead", "ALU", "DM", "RegWrite"],
    "sw":  ["IM", "RegRead", "ALU", "DM"],
    "R형": ["IM", "RegRead", "ALU", "RegWrite"],
    "beq": ["IM", "RegRead", "ALU"],
    "j":   ["IM"],
}


def path_time(kind, delay=DELAY):
    return sum(delay[p] for p in PATH[kind])


def clock_single(delay=DELAY):
    return max(path_time(k, delay) for k in PATH)


def clock_pipeline(delay=DELAY, reg_overhead=0):
    """단계 다섯 개 가운데 가장 긴 것 + 파이프라인 레지스터가 쓰는 시간."""
    return max(delay.values()) + reg_overhead


if __name__ == "__main__":
    t = {k: path_time(k) for k in PATH}
    assert t == {"lw": 950, "sw": 850, "R형": 700, "beq": 600, "j": 250}
    assert clock_single() == 950 and max(t, key=t.get) == "lw"
    assert round(1e12 / 950 / 1e9, 2) == 1.05                     # 약 1.05 GHz
    # 명령어마다 제 시간만 쓸 수 있다면 (가상의 가변 클록)
    mix = {"lw": 0.25, "sw": 0.10, "R형": 0.45, "beq": 0.15, "j": 0.05}
    assert abs(sum(mix.values()) - 1) < 1e-12
    avg = sum(mix[k] * t[k] for k in mix)
    assert abs(avg - 740) < 1e-9 and round(950 / avg, 2) == 1.28
    # 카드: 다른 지연값
    d2 = dict(IM=300, RegRead=100, ALU=250, DM=300, RegWrite=100)
    assert {k: path_time(k, d2) for k in PATH} == {"lw": 1050, "sw": 950, "R형": 750, "beq": 650, "j": 300}
    assert clock_single(d2) == 1050
    # ALU만 두 배 빨라져도 주기는 조금만 준다 (가장 긴 길의 일부일 뿐)
    d3 = dict(DELAY, ALU=100)
    assert clock_single(d3) == 850 and round(950 / 850, 2) == 1.12
    # 카드: 데이터 메모리를 150ps로 줄이면 850ps, j를 줄여도 그대로
    assert clock_single(dict(DELAY, DM=150)) == 850 and clock_single(dict(DELAY, IM=250)) == 950
    # 곱셈기처럼 느린 부품(900ps)이 EX에 들어오면 모든 명령어가 그만큼 느려진다
    d4 = dict(DELAY, ALU=900)
    assert clock_single(d4) == 1650

    # 파이프라인 (27, 33 문서)
    assert clock_pipeline() == 250 and sum(DELAY.values()) == 950
    assert 5 * 250 == 1250 > 950                                  # 명령어 하나가 끝나는 데 드는 시간은 오히려 는다
    assert round(950 / 250, 2) == 3.8                             # 5배가 아니다: 단계가 고르지 않다
    assert sum(DELAY.values()) / 5 == 190                         # 다섯 단계가 똑같다면 190ps
    for n, single, pipe in [(5, 4750, 2250), (100, 95000, 26000), (1000, 950000, 251000)]:
        assert n * 950 == single and (n + 4) * 250 == pipe
    assert round(4750 / 2250, 2) == 2.11 and round(95000 / 26000, 2) == 3.65 and round(950000 / 251000, 2) == 3.78
    # 27 문서 카드: 300, 100, 250, 300, 100
    assert clock_single(d2) == 1050 and clock_pipeline(d2) == 300 and 1050 / 300 == 3.5
    # 파이프라인 레지스터가 20ps를 쓰면
    assert clock_pipeline(reg_overhead=20) == 270 and round(950 / 270, 2) == 3.52
    # 33 문서 카드: 데이터 메모리만 600ps로 느려지면
    d5 = dict(DELAY, DM=600)
    assert clock_single(d5) == 1300 and clock_pipeline(d5) == 600 and round(1300 / 950, 2) == 1.37 and 600 / 250 == 2.4
    assert abs(3.8 * 250 - 950) < 1e-9
    # 다중 사이클(33 문서): 주기 250ps, 명령어마다 3~5사이클
    cyc = {"lw": 5, "sw": 4, "R형": 4, "beq": 3, "j": 3}
    cpi = sum(mix[k] * cyc[k] for k in mix)
    assert abs(cpi - 4.05) < 1e-9 and abs(cpi * 250 - 1012.5) < 1e-9
    # 해저드까지 넣은 파이프라인의 CPI (33 문서): 쉬는 사이클이 명령어당 평균 0.2라면
    assert abs((1 + 0.2) * 250 - 300) < 1e-9 and round(950 / 300, 2) == 3.17
    print("ALL CHECKS PASSED")
```
{% endraw %}
