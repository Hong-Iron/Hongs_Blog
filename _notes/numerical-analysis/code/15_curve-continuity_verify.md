---
layout: "note"
title: "15_curve-continuity_verify.py"
display_title: "15_curve-continuity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "15"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/curve-continuity/"
parent_title: "곡선의 연속성"
description: "수치해석 · 곡선의 연속성 검증 코드"
permalink: "/studies/numerical-analysis/code/15_curve-continuity_verify/"
---
{% raw %}
[곡선의 연속성](/Hongs_Blog/studies/numerical-analysis/curve-continuity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""곡선의 연속성 문서의 주장 검증."""
from fractions import Fraction as F


def bez(P, u, order=0):
    b = [[(1 - u) ** 3, 3 * u * (1 - u) ** 2, 3 * u * u * (1 - u), u ** 3],
         [-3 * (1 - u) ** 2, 3 * (1 - u) ** 2 - 6 * u * (1 - u), 6 * u * (1 - u) - 3 * u * u, 3 * u * u],
         [6 * (1 - u), -12 * (1 - u) + 6 * u, 6 * (1 - u) - 12 * u, 6 * u]][order]
    return tuple(sum(bi * p[d] for bi, p in zip(b, P)) for d in range(2))


def main():
    A = [(0, 0), (1, 2), (3, 2), (4, 0)]
    # C⁰만: 끝점만 공유
    B0 = [(4, 0), (6, 3), (7, 1), (8, 0)]
    assert bez(A, F(1)) == bez(B0, F(0)) and bez(A, F(1), 1) != bez(B0, F(0), 1)
    # G¹이지만 C¹ 아님: p3 − p2와 q1 − q0가 같은 방향, 다른 길이
    B1 = [(4, 0), (6, -4), (7, 1), (8, 0)]
    dA, dB = bez(A, F(1), 1), bez(B1, F(0), 1)
    assert dA == (3, -6) and dB == (6, -12)
    assert dA[0] * dB[1] - dA[1] * dB[0] == 0 and dA[0] * dB[0] + dA[1] * dB[1] > 0 and dA != dB
    # C¹: q1 = 2 p3 − p2
    B2 = [(4, 0), (5, -2), (7, 1), (8, 0)]
    assert bez(A, F(1), 1) == bez(B2, F(0), 1)
    assert bez(A, F(1), 2) != bez(B2, F(0), 2)                               # C²는 아님
    # 카드 C2: p2 = (3, 2), p3 = (4, 0)이면 q1 = (5, −2)
    assert tuple(2 * a - b for a, b in zip(A[3], A[2])) == (5, -2)
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
