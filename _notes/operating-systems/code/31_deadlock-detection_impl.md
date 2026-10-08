---
layout: "note"
title: "31_deadlock-detection_impl.py"
display_title: "31_deadlock-detection_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "31"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "3-1학기"
parent_url: "/studies/operating-systems/deadlock-detection/"
parent_title: "교착상태 탐지와 복구"
description: "운영체제 · 교착상태 탐지와 복구 구현 코드"
permalink: "/studies/operating-systems/code/31_deadlock-detection_impl/"
---
{% raw %}
[교착상태 탐지와 복구](/Hongs_Blog/studies/operating-systems/deadlock-detection/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""교착상태 탐지 알고리즘(Stallings 6.4절, 그림 6.10).
Q: 요청 행렬, A: 할당 행렬, V: 사용 가능 벡터. 표시되지 않고 남는 프로세스가 교착상태다."""


def detect(Q, A, V):
    n, m = len(A), len(V)
    marked = [all(x == 0 for x in A[i]) for i in range(n)]   # 1. 아무것도 안 가진 프로세스는 표시
    W = list(V)                                               # 2. W = V
    steps = []
    while True:
        for i in range(n):                                    # 3. Q의 i행 <= W인 표시 안 된 i를 찾는다
            if not marked[i] and all(Q[i][k] <= W[k] for k in range(m)):
                marked[i] = True                              # 4. 표시하고 그 할당을 W에 더한다
                W = [W[k] + A[i][k] for k in range(m)]
                steps.append((i + 1, W[:]))
                break
        else:
            break
    return [i + 1 for i in range(n) if not marked[i]], steps


if __name__ == "__main__":
    Q = [[0, 1, 0, 0, 1], [0, 0, 1, 0, 1], [0, 0, 0, 0, 1], [1, 0, 1, 0, 1]]
    A = [[1, 0, 1, 1, 0], [1, 1, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 0]]
    R = [2, 1, 1, 2, 1]
    V = [R[k] - sum(A[i][k] for i in range(4)) for k in range(5)]
    assert V == [0, 0, 0, 0, 1]          # 슬라이드 48의 "Allocation vector"는 실제로 사용 가능 벡터
    dead, steps = detect(Q, A, V)
    print("교착", dead, "단계", steps)
    assert dead == [1, 2] and steps == [(3, [0, 0, 0, 1, 1])]

    # 카드 C2: P2의 요청이 R3 대신 R4라면 (Q[1] = 0 0 0 1 1)
    Q2 = [row[:] for row in Q]; Q2[1] = [0, 0, 0, 1, 1]
    dead2, _ = detect(Q2, A, V)
    assert dead2 == []                    # P3 -> P2 -> P1 순서로 모두 표시

    # 6장 슬라이드 14 메모리 예: 200KB, P1 80 -> 60, P2 70 -> 80
    free = 200 - 80 - 70
    assert free == 50 and 60 > free and 80 > free   # 둘 다 두 번째 요청에서 막힘
    print("ALL CHECKS PASSED")
```
{% endraw %}
