---
layout: "note"
title: "21_race-condition_verify.py"
display_title: "21_race-condition_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/race-condition-critical-section/"
parent_title: "경쟁 조건과 임계 구역"
description: "운영체제 · 경쟁 조건과 임계 구역 검증 코드"
permalink: "/studies/operating-systems/code/21_race-condition_verify/"
---
{% raw %}
[경쟁 조건과 임계 구역](/Hongs_Blog/studies/operating-systems/race-condition-critical-section/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""경쟁 조건: 두 프로세스가 공유 변수 x에 1을 더한다. x = x + 1은 기계어로
읽기(load) -> 더하기(add) -> 쓰기(store) 세 단계다. 두 프로세스의 단계를 섞을 수 있는
모든 순서를 다 해 보고, 결과가 실행 순서에 따라 달라지는지 확인한다."""
from itertools import combinations


def interleavings(n_a, n_b):
    """A의 단계 n_a개와 B의 단계 n_b개를 각자의 순서는 지키며 섞는 모든 방법."""
    total = n_a + n_b
    for pos in combinations(range(total), n_a):
        seq, ia, ib = [], 0, 0
        for k in range(total):
            if k in pos:
                seq.append(("A", ia)); ia += 1
            else:
                seq.append(("B", ib)); ib += 1
        yield seq


def run(seq, x0=0):
    x = x0
    reg = {"A": None, "B": None}          # 프로세스마다 자기 레지스터
    for who, step in seq:
        if step == 0:
            reg[who] = x                  # load
        elif step == 1:
            reg[who] += 1                 # add
        else:
            x = reg[who]                  # store
    return x


if __name__ == "__main__":
    results = {}
    for seq in interleavings(3, 3):
        results.setdefault(run(seq), []).append(seq)
    print({k: len(v) for k, v in results.items()})
    # 섞는 방법은 C(6,3) = 20가지, 결과는 2(맞음)와 1(갱신 하나가 사라짐) 두 가지
    assert sum(len(v) for v in results.values()) == 20
    assert set(results) == {1, 2}
    # 결과가 2인 것은 한쪽이 세 단계를 다 끝낸 뒤 다른 쪽이 시작한 두 경우뿐
    assert len(results[2]) == 2
    # 카드 C3: A load, B load, A add, A store, B add, B store -> 1
    assert run([("A", 0), ("B", 0), ("A", 1), ("A", 2), ("B", 1), ("B", 2)]) == 1
    print("ALL CHECKS PASSED")
```
{% endraw %}
