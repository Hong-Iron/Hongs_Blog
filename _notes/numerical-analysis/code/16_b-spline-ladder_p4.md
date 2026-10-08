---
layout: "note"
title: "16_b-spline-ladder_p4.py"
display_title: "16_b-spline-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "16"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/b-spline-ladder/"
parent_title: "B-스플라인 예제 사다리"
description: "수치해석 · B-스플라인 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/numerical-analysis/code/16_b-spline-ladder_p4/"
---
{% raw %}
[B-스플라인 예제 사다리](/Hongs_Blog/studies/numerical-analysis/b-spline-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""B-스플라인 예제 사다리 문제 1~4 검증."""
from fractions import Fraction as F


def blend(u):
    return [F(1, 6) * (1 - u) ** 3, F(1, 6) * (4 - 6 * u ** 2 + 3 * u ** 3),
            F(1, 6) * (1 + 3 * u + 3 * u ** 2 - 3 * u ** 3), F(1, 6) * u ** 3]


def point(P, u):
    b = blend(u)
    return tuple(sum(bi * p[d] for bi, p in zip(b, P)) for d in range(2))


def main():
    P = [(0, 0), (2, 4), (4, 4), (6, 0)]
    assert blend(F(1, 2)) == [F(1, 48), F(23, 48), F(23, 48), F(1, 48)]       # 문제 1
    assert point(P, F(1, 2)) == (3, F(23, 6))
    assert blend(F(0)) == [F(1, 6), F(4, 6), F(1, 6), 0] and point(P, F(0)) == (2, F(10, 3))   # 문제 2
    Q = [(0, 0), (1, 2), (3, 3), (5, 2), (6, 0)]                                # 문제 3
    end1 = point(Q[0:4], F(1)); start2 = point(Q[1:5], F(0))
    assert end1 == start2 == (3, F(8, 3))
    d = tuple(F(a - b, 2) for a, b in zip(Q[3], Q[1]))
    assert d == (2, 0)
    # 문제 4: 조절점 8개 → 조각 5개, p3을 쓰는 조각
    segs = [list(range(i, i + 4)) for i in range(5)]
    assert [i for i, s in enumerate(segs) if 3 in s] == [0, 1, 2, 3]
    p0 = (1, 1)
    assert point([p0, p0, p0, (4, 5)], F(0)) == p0
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
