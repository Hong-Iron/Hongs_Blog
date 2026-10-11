---
layout: "note"
title: "05_combinational-logic_verify.py"
display_title: "05_combinational-logic_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
track_sub: "컴퓨터 시스템"
parent_url: "/studies/computer-architecture/combinational-logic/"
parent_title: "논리 게이트와 조합 회로"
description: "컴퓨터 구조 · 논리 게이트와 조합 회로 검증 코드"
permalink: "/studies/computer-architecture/code/05_combinational-logic_verify/"
---
{% raw %}
[논리 게이트와 조합 회로](/Hongs_Blog/studies/computer-architecture/combinational-logic/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 05.논리 게이트와 조합 회로: 진리표 -> 곱의 합 -> 회로, 줄인 식, 지연 계산을 전수 검사한다.
# 실행: python3 05_combinational-logic_verify.py  (표준 라이브러리만 쓴다)
# 실제 하드웨어가 아니라 파이썬으로 게이트를 흉내 낸 것이다.
from itertools import product


def NOT(a): return 1 - a
def AND(*x): return int(all(x))
def OR(*x): return int(any(x))
def XOR(a, b): return a ^ b
def NAND(a, b): return NOT(AND(a, b))
def NOR(a, b): return NOT(OR(a, b))


def sop_from_truth_table(table):
    """진리표(입력 튜플 -> 출력)에서 출력이 1인 줄만 모아 곱의 합 함수를 만든다."""
    ones = [row for row, out in table.items() if out == 1]

    def f(*xs):
        return OR(*[AND(*[x if bit else NOT(x) for x, bit in zip(xs, row)]) for row in ones])
    return f, ones


def majority_sop(a, b, c):
    return OR(AND(NOT(a), b, c), AND(a, NOT(b), c), AND(a, b, NOT(c)), AND(a, b, c))


def majority_min(a, b, c):
    return OR(AND(a, b), AND(b, c), AND(a, c))


# 지연: 게이트마다 걸리는 시간(ps). 문서의 예와 같은 값.
D_NOT, D_AND, D_OR = 20, 40, 40


if __name__ == "__main__":
    # 게이트 진리표
    assert [AND(a, b) for a, b in product((0, 1), repeat=2)] == [0, 0, 0, 1]
    assert [OR(a, b) for a, b in product((0, 1), repeat=2)] == [0, 1, 1, 1]
    assert [XOR(a, b) for a, b in product((0, 1), repeat=2)] == [0, 1, 1, 0]
    assert [NAND(a, b) for a, b in product((0, 1), repeat=2)] == [1, 1, 1, 0]
    assert [NOR(a, b) for a, b in product((0, 1), repeat=2)] == [1, 0, 0, 0]
    # 예시: 세 명 가운데 둘 이상 찬성(다수결)
    table = {r: int(sum(r) >= 2) for r in product((0, 1), repeat=3)}
    assert [table[r] for r in sorted(table)] == [0, 0, 0, 1, 0, 1, 1, 1]
    f, ones = sop_from_truth_table(table)
    assert sorted(ones) == [(0, 1, 1), (1, 0, 1), (1, 1, 0), (1, 1, 1)]
    for r in product((0, 1), repeat=3):
        assert f(*r) == table[r] == majority_sop(*r) == majority_min(*r)
    # 게이트 수: 곱의 합 그대로 = NOT 3 + AND 4 + OR 1 = 8, 줄인 식 = AND 3 + OR 1 = 4
    assert 3 + 4 + 1 == 8 and 3 + 1 == 4
    # 지연: 그대로 = NOT -> AND -> OR = 100 ps, 줄인 식 = AND -> OR = 80 ps
    assert D_NOT + D_AND + D_OR == 100 and D_AND + D_OR == 80
    # 가장 짧은 길(그대로인 회로에서 NOT을 거치지 않는 abc 항) = 80 ps
    assert D_AND + D_OR == 80
    # 모든 3입력 불 함수 256개를 곱의 합으로 만들 수 있다
    rows = list(product((0, 1), repeat=3))
    for code in range(256):
        t = {r: (code >> i) & 1 for i, r in enumerate(rows)}
        g, on = sop_from_truth_table(t)
        if not on:
            continue  # 늘 0인 함수는 항이 없다(상수 0)
        assert all(g(*r) == t[r] for r in rows)
    # 카드 C1: 진리표 0,1,1,0,1,0,0,1 (홀수 개가 1) -> 항 4개, XOR 두 번과 같다
    t = {r: sum(r) % 2 for r in rows}
    g, on = sop_from_truth_table(t)
    assert sorted(on) == [(0, 0, 1), (0, 1, 0), (1, 0, 0), (1, 1, 1)]
    assert all(g(*r) == XOR(XOR(r[0], r[1]), r[2]) for r in rows)
    # 카드 C3: y = (a AND b) OR (NOT c): 가장 긴 길 = 60 또는 80 가운데 80
    assert max(D_AND + D_OR, D_NOT + D_OR) == 80
    assert min(D_AND + D_OR, D_NOT + D_OR) == 60
    print("ALL CHECKS PASSED")
```
{% endraw %}
