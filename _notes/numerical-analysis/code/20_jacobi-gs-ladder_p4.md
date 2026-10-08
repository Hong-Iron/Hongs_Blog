---
layout: "note"
title: "20_jacobi-gs-ladder_p4.py"
display_title: "20_jacobi-gs-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "20"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/jacobi-gs-ladder/"
parent_title: "야코비와 가우스-자이델 예제 사다리"
description: "수치해석 · 야코비와 가우스-자이델 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/numerical-analysis/code/20_jacobi-gs-ladder_p4/"
---
{% raw %}
[야코비와 가우스-자이델 예제 사다리](/Hongs_Blog/studies/numerical-analysis/jacobi-gs-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""야코비·가우스-자이델 예제 사다리 문제 1~4 검증."""
from fractions import Fraction as F


def jacobi(A, b, x):
    n = len(b)
    return [(b[i] - sum(A[i][j] * x[j] for j in range(n) if j != i)) / A[i][i] for i in range(n)]


def gs(A, b, x, lam=1):
    x = list(x)
    for i in range(len(b)):
        new = (b[i] - sum(A[i][j] * x[j] for j in range(len(b)) if j != i)) / A[i][i]
        x[i] = lam * new + (1 - lam) * x[i]
    return x


def main():
    A1, b1 = [[F(3), F(1)], [F(1), F(2)]], [F(5), F(5)]                        # 문제 1
    g1 = gs(A1, b1, [0, 0]); g2 = gs(A1, b1, g1)
    assert g1 == [F(5, 3), F(5, 3)] and g2 == [F(10, 9), F(35, 18)]
    j1 = jacobi(A1, b1, [0, 0]); assert j1 == [F(5, 3), F(5, 2)]
    A2, b2 = [[F(4), F(-1)], [F(-1), F(4)]], [F(2), F(7)]                      # 문제 2
    s1 = gs(A2, b2, [0, 0]); s2 = gs(A2, b2, s1)
    assert s1 == [F(1, 2), F(15, 8)] and s2 == [F(31, 32), F(255, 128)]
    ea = abs((s2[0] - s1[0]) / s2[0]) * 100
    assert round(float(ea), 1) == 48.4
    A3, b3 = [[F(4), F(1)], [F(1), F(5)]], [F(6), F(11)]                      # 문제 3 (행을 바꾼 뒤)
    assert abs(A3[0][0]) > abs(A3[0][1]) and abs(A3[1][1]) > abs(A3[1][0])
    t1 = jacobi(A3, b3, [0, 0]); t2 = jacobi(A3, b3, t1)
    assert t1 == [F(3, 2), F(11, 5)] and t2 == [F(19, 20), F(19, 10)]
    assert 4 * 1 + 2 == 6 and 1 + 5 * 2 == 11
    r1 = gs(A2, b2, [0, 0], lam=F(6, 5))                                        # 문제 4 (a)
    assert r1 == [F(3, 5), F(57, 25)]
    A4, b4 = [[F(1), F(2)], [F(2), F(1)]], [F(3), F(3)]                        # 문제 4 (b)
    x = [F(0), F(0)]; seq = []
    for _ in range(4):
        x = jacobi(A4, b4, x); seq.append(x)
    assert seq == [[3, 3], [-3, -3], [9, 9], [-15, -15]]
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
