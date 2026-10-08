---
layout: "note"
title: "30_bankers-algorithm_impl.py"
display_title: "30_bankers-algorithm_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "30"
course: "운영체제"
course_slug: "operating-systems"
course_url: "/studies/operating-systems/"
track: "컴퓨터 과학"
parent_url: "/studies/operating-systems/deadlock-avoidance/"
parent_title: "교착상태 회피"
description: "운영체제 · 교착상태 회피 구현 코드"
permalink: "/studies/operating-systems/code/30_bankers-algorithm_impl/"
---
{% raw %}
[교착상태 회피](/Hongs_Blog/studies/operating-systems/deadlock-avoidance/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""은행원 알고리즘(Stallings 6.3절, 그림 6.7~6.9).

C: 최대 요구(claim) 행렬, A: 할당 행렬, R: 자원 총량, V: 사용 가능 = R - A의 열 합.
안전 상태: 어떤 순서로 프로세스를 하나씩 끝까지 실행시킬 수 있다(각자 C - A만큼 더 받아 끝나고 A를 돌려줌).
"""


def available(R, A):
    return [R[j] - sum(row[j] for row in A) for j in range(len(R))]


def safe_sequence(C, A, V):
    """안전하면 끝낼 수 있는 순서(프로세스 번호, 1부터)를, 아니면 None을 돌려준다."""
    n, m = len(C), len(V)
    work, done, order = list(V), [False] * n, []
    progress = True
    while progress:
        progress = False
        for i in range(n):
            if not done[i] and all(C[i][j] - A[i][j] <= work[j] for j in range(m)):
                work = [work[j] + A[i][j] for j in range(m)]   # 끝나면 가진 것을 돌려준다
                done[i] = True
                order.append(i + 1)
                progress = True
    return order if all(done) else None


def request(C, A, R, i, req):
    """프로세스 i(0부터)의 요청 req를 들어줘도 안전하면 새 A를, 아니면 None."""
    V = available(R, A)
    if any(A[i][j] + req[j] > C[i][j] for j in range(len(R))):
        raise ValueError("최대 요구를 넘는 요청")
    if any(req[j] > V[j] for j in range(len(R))):
        return None                                    # 지금 자원이 모자라 기다림
    newA = [row[:] for row in A]
    newA[i] = [A[i][j] + req[j] for j in range(len(R))]
    return newA if safe_sequence(C, newA, available(R, newA)) else None


C = [[3, 2, 2], [6, 1, 3], [3, 1, 4], [4, 2, 2]]
R = [9, 3, 6]

if __name__ == "__main__":
    # 그림 6.7a: 안전 상태
    A = [[1, 0, 0], [6, 1, 2], [2, 1, 1], [0, 0, 2]]
    assert available(R, A) == [0, 1, 1]
    seq = safe_sequence(C, A, available(R, A))
    print("6.7a 순서", seq)
    assert seq is not None and seq[0] == 2              # 처음 끝낼 수 있는 것은 P2뿐
    # 슬라이드 순서 P2 -> P1 -> P3 -> P4 도 가능한지 직접 따라가 확인
    work = [0, 1, 1]
    for p in [2, 1, 3, 4]:
        need = [C[p-1][j] - A[p-1][j] for j in range(3)]
        assert all(need[j] <= work[j] for j in range(3)), p
        work = [work[j] + A[p-1][j] for j in range(3)]
    assert work == R

    # 그림 6.8: 다른 초기 상태에서 P1이 R1, R3를 하나씩 요청 -> 불안전이므로 거절
    A2 = [[1, 0, 0], [5, 1, 1], [2, 1, 1], [0, 0, 2]]
    assert available(R, A2) == [1, 1, 2]
    assert safe_sequence(C, A2, available(R, A2)) is not None   # 요청 전에는 안전
    assert request(C, A2, R, 0, [1, 0, 1]) is None
    after = [[2, 0, 1], [5, 1, 1], [2, 1, 1], [0, 0, 2]]
    assert available(R, after) == [0, 1, 1] and safe_sequence(C, after, [0, 1, 1]) is None

    # 예제 사다리와 카드 문제
    # C3: 그림 6.8 초기 상태에서 (가) P2가 R1 하나 요청 -> 허락, (나) P3가 R3 하나 요청 -> 거절
    assert request(C, A2, R, 1, [1, 0, 0]) is not None
    assert safe_sequence(C, request(C, A2, R, 1, [1, 0, 0]), [0, 1, 2])[0] == 2
    assert request(C, A2, R, 2, [0, 0, 1]) is None
    # C4: 그림 6.7a에서 P4가 R1 하나를 요청 -> 지금 R1 가용 0이라 기다림
    assert request(C, A, R, 3, [1, 0, 0]) is None and available(R, A)[0] == 0
    # 사다리 p2~p4
    C_l = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]]
    A_l = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]]
    R_l = [10, 5, 7]
    assert available(R_l, A_l) == [3, 3, 2]
    s = safe_sequence(C_l, A_l, [3, 3, 2])
    print("사다리 순서", s)
    assert s is not None
    # p3: P2가 (1,0,2) 요청 -> 허락, 그 뒤 가용 (2,3,0)
    A_p3 = request(C_l, A_l, R_l, 1, [1, 0, 2])
    assert A_p3 is not None and available(R_l, A_p3) == [2, 3, 0]
    assert safe_sequence(C_l, A_p3, [2, 3, 0]) == [2, 4, 5, 1, 3]
    # p4 (1): 그 상태에서 P1이 (0,2,0) 요청 -> 자원은 있지만 들어주면 불안전 -> 거절
    A_try = [row[:] for row in A_p3]; A_try[0] = [0, 3, 0]
    assert available(R_l, A_try) == [2, 1, 0] and safe_sequence(C_l, A_try, [2, 1, 0]) is None
    assert request(C_l, A_p3, R_l, 0, [0, 2, 0]) is None
    # p4 (2): 그 상태에서 P5가 (3,3,0) 요청 -> R1이 2개뿐이라 지금 줄 수 없음 -> 기다림
    assert 3 > available(R_l, A_p3)[0] and request(C_l, A_p3, R_l, 4, [3, 3, 0]) is None
    print("ALL CHECKS PASSED")
```
{% endraw %}
