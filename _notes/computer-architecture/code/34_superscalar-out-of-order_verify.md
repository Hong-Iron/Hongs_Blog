---
layout: "note"
title: "34_superscalar-out-of-order_verify.py"
display_title: "34_superscalar-out-of-order_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "34"
course: "컴퓨터 구조"
course_slug: "computer-architecture"
course_url: "/studies/computer-architecture/"
track: "컴퓨터 과학"
parent_url: "/studies/computer-architecture/superscalar-out-of-order/"
parent_title: "슈퍼스칼라와 비순차 실행"
description: "컴퓨터 구조 · 슈퍼스칼라와 비순차 실행 검증 코드"
permalink: "/studies/computer-architecture/code/34_superscalar-out-of-order_verify/"
---
{% raw %}
[슈퍼스칼라와 비순차 실행](/Hongs_Blog/studies/computer-architecture/superscalar-out-of-order/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
# 한 사이클에 여러 명령어를 시작하는 프로세서의 장난감 일정표 (실제 하드웨어가 아니라 파이썬 흉내다)
# 실행: python3 34_superscalar-out-of-order_verify.py
# 가정: 명령어마다 실행에 1사이클(lw는 2사이클)이 들고, 결과는 끝난 다음 사이클부터 쓸 수 있다.
# 가져오기·해독·확정 단계는 세지 않고 '실행을 시작하는 사이클'만 센다.
PROG = [  # (이름, 쓰는 레지스터, 읽는 레지스터들, 걸리는 사이클)
    ("lw  $t0, 0($s0)",   "t0", ["s0"], 2),
    ("add $t1, $t0, $s1", "t1", ["t0"], 1),
    ("sub $t2, $t1, $s2", "t2", ["t1"], 1),
    ("lw  $t3, 4($s0)",   "t3", ["s0"], 2),
    ("add $t4, $t3, $s1", "t4", ["t3"], 1),
    ("or  $t5, $t4, $t2", "t5", ["t4", "t2"], 1),
]


def schedule(prog, width, out_of_order):
    """돌려주는 것: 명령어마다 실행을 시작한 사이클(1부터)."""
    ready_at = {}                    # 레지스터 -> 값을 쓸 수 있는 첫 사이클
    start = [None] * len(prog)
    cycle = 0
    while None in start:
        cycle += 1
        issued = 0
        for i, (_, dst, srcs, lat) in enumerate(prog):
            if start[i] is not None:
                continue
            # 앞선 명령어가 만들 값이면 그 값이 나올 때까지 기다린다
            producers_done = True
            for s in srcs:
                prod = [j for j in range(i) if prog[j][1] == s]
                if prod:
                    j = prod[-1]
                    if start[j] is None or start[j] + prog[j][3] > cycle:
                        producers_done = False
            if producers_done and issued < width:
                start[i] = cycle
                issued += 1
            elif not out_of_order:
                break                # 순서대로만: 앞이 막히면 뒤도 못 간다
    return start


def finish(prog, start):
    return max(s + p[3] - 1 for s, p in zip(start, prog))


if __name__ == "__main__":
    s1 = schedule(PROG, 1, False)
    s2 = schedule(PROG, 2, False)
    s3 = schedule(PROG, 2, True)
    assert s1 == [1, 3, 4, 5, 7, 8] and finish(PROG, s1) == 8
    assert s2 == [1, 3, 4, 4, 6, 7] and finish(PROG, s2) == 7
    assert s3 == [1, 3, 4, 1, 3, 5] and finish(PROG, s3) == 5
    # 사이클당 명령어 수(IPC) = 명령어 수 / 사이클 수
    assert round(6 / 8, 2) == 0.75 and round(6 / 7, 2) == 0.86 and round(6 / 5, 2) == 1.2
    # 폭을 4로 늘려도 5사이클 밑으로는 못 간다: lw -> add -> sub -> or 사슬이 2 + 1 + 1 + 1 = 5사이클
    assert finish(PROG, schedule(PROG, 4, True)) == 5 and finish(PROG, schedule(PROG, 100, True)) == 5
    # 서로 기대지 않는 명령어 6개라면 폭 2로 3사이클, IPC 2
    indep = [(f"add $t{i}", f"t{i}", ["s0"], 1) for i in range(6)]
    assert finish(indep, schedule(indep, 2, False)) == 3 and finish(indep, schedule(indep, 1, False)) == 6
    # 줄줄이 기대는 명령어 6개라면 폭이 아무리 넓어도 6사이클
    chain = [(f"add $t{i}", f"t{i}", [f"t{i-1}"] if i else ["s0"], 1) for i in range(6)]
    assert finish(chain, schedule(chain, 4, True)) == 6
    print("ALL CHECKS PASSED")
```
{% endraw %}
