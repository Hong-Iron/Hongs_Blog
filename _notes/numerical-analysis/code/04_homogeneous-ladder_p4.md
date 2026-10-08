---
layout: "note"
title: "04_homogeneous-ladder_p4.py"
display_title: "04_homogeneous-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "04"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/homogeneous-ladder/"
parent_title: "동차 좌표 예제 사다리"
description: "수치해석 · 동차 좌표 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/numerical-analysis/code/04_homogeneous-ladder_p4/"
---
{% raw %}
[동차 좌표 예제 사다리](/Hongs_Blog/studies/numerical-analysis/homogeneous-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""동차 좌표 예제 사다리 문제 1~4 검증. 3×3 동차 좌표, 분수로 정확히."""
from fractions import Fraction as F


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]


def mv(A, p):
    v = [p[0], p[1], 1]
    return tuple(sum(A[i][k] * v[k] for k in range(3)) for i in range(2))


T = lambda a, b: [[1, 0, a], [0, 1, b], [0, 0, 1]]
S = lambda s: [[s, 0, 0], [0, s, 0], [0, 0, 1]]
R90 = [[0, -1, 0], [1, 0, 0], [0, 0, 1]]
Fx = [[1, 0, 0], [0, -1, 0], [0, 0, 1]]


def main():
    # 문제 1: 점 (1, 1) 중심 2배 확대, 점 (3, 2)
    H1 = mm(T(1, 1), mm(S(2), T(-1, -1)))
    assert H1 == [[2, 0, -1], [0, 2, -1], [0, 0, 1]] and mv(H1, (3, 2)) == (5, 3)
    # 문제 2: 점 (2, 0) 중심 90° 회전, 점 (3, 0)
    H2 = mm(T(2, 0), mm(R90, T(-2, 0)))
    assert H2 == [[0, -1, 2], [1, 0, -2], [0, 0, 1]] and mv(H2, (3, 0)) == (2, 1)
    # 문제 3: 직선 y = 1에 대한 반사 다음 (3, 0) 평행이동, 점 (1, 4)
    M = mm(T(0, 1), mm(Fx, T(0, -1)))
    assert M == [[1, 0, 0], [0, -1, 2], [0, 0, 1]]
    H3 = mm(T(3, 0), M)
    assert H3 == [[1, 0, 3], [0, -1, 2], [0, 0, 1]] and mv(H3, (1, 4)) == (4, -2)
    # 문제 4: 90° 회전 뒤 (1, 2) 이동, 역행렬과 되돌리기
    H4 = mm(T(1, 2), R90)
    assert H4 == [[0, -1, 1], [1, 0, 2], [0, 0, 1]] and mv(H4, (3, 4)) == (-3, 5)
    H4i = mm([[0, 1, 0], [-1, 0, 0], [0, 0, 1]], T(-1, -2))
    assert H4i == [[0, 1, -2], [-1, 0, 1], [0, 0, 1]]
    assert mm(H4, H4i) == [[1, 0, 0], [0, 1, 0], [0, 0, 1]] and mv(H4i, (-3, 5)) == (3, 4)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
