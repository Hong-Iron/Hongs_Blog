---
layout: "note"
title: "14_hermite-curve_verify.py"
display_title: "14_hermite-curve_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/hermite-curve/"
parent_title: "에르미트 곡선"
description: "수치해석 · 에르미트 곡선 검증 코드"
permalink: "/studies/numerical-analysis/code/14_hermite-curve_verify/"
---
{% raw %}
[에르미트 곡선](/Hongs_Blog/studies/numerical-analysis/hermite-curve/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""에르미트 곡선 문서의 주장 검증."""
from fractions import Fraction as F


def inv(A):
    n = len(A); M = [[F(x) for x in r] + [F(int(i == j)) for j in range(n)] for i, r in enumerate(A)]
    for c in range(n):
        p = next(r for r in range(c, n) if M[r][c] != 0); M[c], M[p] = M[p], M[c]
        M[c] = [x / M[c][c] for x in M[c]]
        for r in range(n):
            if r != c:
                M[r] = [x - M[r][c] * y for x, y in zip(M[r], M[c])]
    return [r[n:] for r in M]


A = [[1, 0, 0, 0], [1, 1, 1, 1], [0, 1, 0, 0], [0, 1, 2, 3]]   # p(0), p(1), p'(0), p'(1) 행
MH = inv(A)


def blend(u):
    return [2 * u ** 3 - 3 * u ** 2 + 1, -2 * u ** 3 + 3 * u ** 2, u ** 3 - 2 * u ** 2 + u, u ** 3 - u ** 2]


def point(q, u):
    return tuple(sum(b * qi[d] for b, qi in zip(blend(u), q)) for d in range(len(q[0])))


def deriv(q, u):
    db = [6 * u * u - 6 * u, -6 * u * u + 6 * u, 3 * u * u - 4 * u + 1, 3 * u * u - 2 * u]
    return tuple(sum(b * qi[d] for b, qi in zip(db, q)) for d in range(len(q[0])))


def main():
    assert MH == [[1, 0, 0, 0], [0, 0, 1, 0], [-3, 3, -2, -1], [2, -2, 1, 1]]     # 슬라이드 p.19
    for k in range(21):
        u = F(k, 20)
        uu = [1, u, u * u, u ** 3]
        assert [sum(uu[r] * MH[r][i] for r in range(4)) for i in range(4)] == blend(u)
        assert blend(u)[0] + blend(u)[1] == 1
    # 예: p(0) = (0,0), p(1) = (4,0), p'(0) = (0,6), p'(1) = (0,−6) → 아치
    q = [(0, 0), (4, 0), (0, 6), (0, -6)]
    assert point(q, F(0)) == (0, 0) and point(q, F(1)) == (4, 0)
    assert deriv(q, F(0)) == (0, 6) and deriv(q, F(1)) == (0, -6)
    assert point(q, F(1, 2)) == (2, F(3, 2))                                # 카드 C2
    # 이음점에서 기울기를 같게 주면 C¹: 두 조각
    q2 = [(4, 0), (8, 0), (0, -6), (0, 6)]
    assert point(q, F(1)) == point(q2, F(0)) and deriv(q, F(1)) == deriv(q2, F(0))
    # 기울기 길이만 키우면 곡선 모양이 바뀐다(같은 방향, 더 크게 부풂)
    qbig = [(0, 0), (4, 0), (0, 12), (0, -12)]
    assert point(qbig, F(1, 2))[1] == 3 > point(q, F(1, 2))[1]
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
