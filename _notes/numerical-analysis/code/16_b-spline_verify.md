---
layout: "note"
title: "16_b-spline_verify.py"
display_title: "16_b-spline_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "16"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/b-spline/"
parent_title: "B-스플라인"
description: "수치해석 · B-스플라인 검증 코드"
permalink: "/studies/numerical-analysis/code/16_b-spline_verify/"
---
{% raw %}
[B-스플라인](/Hongs_Blog/studies/numerical-analysis/b-spline/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-스플라인 문서의 주장 검증. 균등 3차 B-스플라인."""
import random
from fractions import Fraction as F

MS = [[F(v, 6) for v in r] for r in [[1, 4, 1, 0], [-3, 0, 3, 0], [3, -6, 3, 0], [-1, 3, -3, 1]]]


def blend(u):
    return [F(1, 6) * (1 - u) ** 3, F(1, 6) * (4 - 6 * u ** 2 + 3 * u ** 3),
            F(1, 6) * (1 + 3 * u + 3 * u ** 2 - 3 * u ** 3), F(1, 6) * u ** 3]


def seg(P, i, u, order=0):
    """i번째 조각(조절점 P[i..i+3])의 order계 도함수."""
    uu = [[1, u, u * u, u ** 3], [0, 1, 2 * u, 3 * u * u], [0, 0, 2, 6 * u]][order]
    b = [sum(uu[k] * MS[k][j] for k in range(4)) for j in range(4)]
    return tuple(sum(b[j] * P[i + j][d] for j in range(4)) for d in range(len(P[0])))


def main():
    # 네 조건에서 M_S가 나온다: p(0), p'(0), p(1), p'(1)
    for k in range(21):
        u = F(k, 20)
        uu = [1, u, u * u, u ** 3]
        b = [sum(uu[r] * MS[r][i] for r in range(4)) for i in range(4)]
        assert b == blend(u) and sum(b) == 1 and all(x >= 0 for x in b)
    P = [(0, 0), (1, 3), (3, 3), (4, 0), (6, 1), (7, 4)]
    assert seg(P, 0, F(0)) == tuple(F(a + 4 * b + c, 6) for a, b, c in zip(P[0], P[1], P[2]))
    assert seg(P, 0, F(0), 1) == tuple(F(c - a, 2) for a, c in zip(P[0], P[2]))
    assert seg(P, 0, F(0)) == (F(7, 6), F(5, 2))                            # 카드 C2
    assert seg(P, 0, F(0)) != P[1]                                         # 조절점을 지나지 않는다
    # 이음점에서 위치·1계·2계 도함수가 모두 같다 (C²)
    random.seed(16)
    for _ in range(200):
        Q = [(random.randint(-9, 9), random.randint(-9, 9)) for _ in range(7)]
        for i in range(3):
            for o in range(3):
                assert seg(Q, i, F(1), o) == seg(Q, i + 1, F(0), o)
        # 3계 도함수는 보통 다르다
    Q = [(0, 0), (1, 0), (2, 0), (3, 5), (4, 0)]
    third = lambda Q, i: tuple(sum(sum([0, 0, 0, 6][k] * MS[k][j] for k in range(4)) * Q[i + j][d] for j in range(4)) for d in range(2))
    assert third(Q, 0) != third(Q, 1)
    # 국소 조절: P[5]를 옮기면 조각 0, 1은 그대로
    P2 = list(P); P2[5] = (100, 100)
    for u in (F(0), F(1, 2), F(1)):
        assert seg(P, 0, u) == seg(P2, 0, u) and seg(P, 1, u) == seg(P2, 1, u)
        assert seg(P, 2, F(1, 2)) != seg(P2, 2, F(1, 2))
    # 볼록 껍질: 블렌딩 값이 0 이상이고 합이 1 → 네 조절점의 가중 평균
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
