---
layout: "note"
title: "31_control-hazard-branch-prediction_verify.py"
display_title: "31_control-hazard-branch-prediction_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "31"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/control-hazard-branch-prediction/"
parent_title: "제어 해저드와 분기 예측"
description: "컴퓨터 구조 · 제어 해저드와 분기 예측 검증 코드"
sitemap: false
permalink: "/studies/computer-architecture/code/31_control-hazard-branch-prediction_verify/"
---
{% raw %}
[제어 해저드와 분기 예측](/Hongs_Blog/studies/computer-architecture/control-hazard-branch-prediction/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 분기 예측기의 적중 횟수와 분기 손실 계산 (실제 하드웨어가 아니라 파이썬 흉내다)
# 실행: python3 31_control-hazard-branch-prediction_verify.py
# 분기 결과는 T(간다)와 N(안 간다)의 문자열로 적는다. 분기 하나에 예측기 한 칸이 붙어 있다고 놓는다.
# 버리는 명령어 수와 사이클별 표는 27_mips-pipeline_impl.py가 확인한다.

def always(outcomes, guess):
    return [guess] * len(outcomes)


def one_bit(outcomes, start="N"):
    """바로 앞 결과를 그대로 예측한다."""
    preds, last = [], start
    for o in outcomes:
        preds.append(last)
        last = o
    return preds


def two_bit(outcomes, start=1):
    """0~3을 오가는 계수기. 0·1이면 '안 간다', 2·3이면 '간다'. 가면 +1, 안 가면 -1 (끝에서 멈춘다)."""
    preds, states, c = [], [], start
    for o in outcomes:
        states.append(c)
        preds.append("T" if c >= 2 else "N")
        c = min(3, c + 1) if o == "T" else max(0, c - 1)
    return preds, states


def hits(preds, outcomes):
    return sum(p == o for p, o in zip(preds, outcomes))


def loop_outcomes(n):
    """아래 반복문의 beq가 내는 결과를 뜻대로 실행해서 얻는다 (n번 도는 반복문).
       loop: add $s0, $s0, $t1 / slt $t2, $s0, $s1 / beq $t2, $t1, loop      ($t1 = 1, $s1 = n)"""
    s0, out = 0, ""
    while True:
        s0 += 1
        t2 = 1 if s0 < n else 0
        if t2 == 1:
            out += "T"
        else:
            return out + "N"


if __name__ == "__main__":
    assert loop_outcomes(4) == "TTTN" and loop_outcomes(10) == "T" * 9 + "N"
    seq = loop_outcomes(4) * 3                    # 4번 도는 안쪽 반복문에 세 번 들어간다
    assert seq == "TTTNTTTNTTTN" and len(seq) == 12
    # 정적 예측
    assert hits(always(seq, "N"), seq) == 3 and hits(always(seq, "T"), seq) == 9
    # 1비트
    p1 = one_bit(seq)
    assert "".join(p1) == "NTTTNTTTNTTT" and hits(p1, seq) == 6
    miss1 = [i + 1 for i, (p, o) in enumerate(zip(p1, seq)) if p != o]
    assert miss1 == [1, 4, 5, 8, 9, 12]           # 들어갈 때 한 번, 나올 때 한 번
    # 2비트 (처음 상태 1 = 약하게 '안 간다')
    p2, s2 = two_bit(seq)
    assert "".join(p2) == "NTTTTTTTTTTT" and s2 == [1, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3] and hits(p2, seq) == 8
    miss2 = [i + 1 for i, (p, o) in enumerate(zip(p2, seq)) if p != o]
    assert miss2 == [1, 4, 8, 12]                 # 나올 때만 한 번
    # 길게: 10번 도는 반복문에 100번 들어가면
    long = loop_outcomes(10) * 100
    assert hits(one_bit(long), long) == 1000 - 200 and hits(two_bit(long)[0], long) == 1000 - 101
    assert hits(always(long, "T"), long) == 900 and hits(always(long, "N"), long) == 100
    # 처음 상태에 따라 2비트의 처음 몇 번이 달라진다
    assert [hits(two_bit(long, s)[0], long) for s in (0, 1, 2, 3)] == [898, 899, 900, 900]
    # 번갈아 가는 분기(TNTN...)에서는 1비트가 전부 틀린다. 2비트는 처음 상태에 따라 절반 또는 전부 틀린다
    alt = "TN" * 10
    assert hits(one_bit(alt), alt) == 0
    assert [hits(two_bit(alt, s)[0], alt) for s in (0, 1, 2, 3)] == [10, 0, 10, 10]
    # 2비트는 잇달아 두 번 틀려야 예측을 바꾼다
    assert "".join(two_bit("TTTTNNT", 3)[0]) == "TTTTTTN"
    # 카드
    c2 = "TTNTTNTTN"
    assert "".join(one_bit(c2)) == "NTTNTTNTT" and hits(one_bit(c2), c2) == 3
    assert two_bit(c2)[1] == [1, 2, 3, 2, 3, 3, 2, 3, 3] and "".join(two_bit(c2)[0]) == "NTTTTTTTT" and hits(two_bit(c2)[0], c2) == 5
    c6 = "TTNNTTNN"
    assert "".join(one_bit(c6)) == "NTTNNTTN" and hits(one_bit(c6), c6) == 4
    assert two_bit(c6)[1] == [1, 2, 3, 2, 1, 2, 3, 2] and "".join(two_bit(c6)[0]) == "NTTTNTTT" and hits(two_bit(c6)[0], c6) == 2
    # 분기 손실: CPI = 1 + 분기 비율 x 틀리는 비율 x 버리는 사이클 수
    cpi = lambda branch, miss, penalty: 1 + branch * miss * penalty
    assert abs(cpi(0.15, 6 / 12, 1) - 1.075) < 1e-9 and abs(cpi(0.15, 4 / 12, 1) - 1.05) < 1e-9
    assert abs(cpi(0.15, 6 / 12, 3) - 1.225) < 1e-9 and abs(cpi(0.15, 4 / 12, 3) - 1.15) < 1e-9
    assert abs(cpi(0.20, 0.10, 15) - 1.30) < 1e-9          # 카드: 깊은 파이프라인
    assert abs(cpi(0.20, 0.02, 15) - 1.06) < 1e-9
    assert abs(cpi(0.20, 0.25, 3) - 1.15) < 1e-9 and abs(cpi(0.20, 0.05, 3) - 1.03) < 1e-9
    print("ALL CHECKS PASSED")
```
{% endraw %}
