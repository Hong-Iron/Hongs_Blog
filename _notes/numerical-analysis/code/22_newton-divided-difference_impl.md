---
layout: "note"
title: "22_newton-divided-difference_impl.py"
display_title: "22_newton-divided-difference_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "22"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/newton-divided-difference/"
parent_title: "뉴턴 다항식과 분할 차분"
description: "수치해석 · 뉴턴 다항식과 분할 차분 구현 코드"
permalink: "/studies/numerical-analysis/code/22_newton-divided-difference_impl/"
---
{% raw %}
[뉴턴 다항식과 분할 차분](/Hongs_Blog/studies/numerical-analysis/newton-divided-difference/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""뉴턴 다항식과 분할 차분 구현과 검증."""
from fractions import Fraction as F


def divided_differences(xs, ys):
    """표 T[k][j] = f[x_{k-j}, ..., x_k]. 대각선 T[k][k]가 뉴턴 계수 a_k."""
    n = len(xs); T = [[F(y)] + [None] * (n - 1) for y in ys]
    for j in range(1, n):
        for k in range(j, n):
            T[k][j] = (T[k][j - 1] - T[k - 1][j - 1]) / (xs[k] - xs[k - j])
    return T


def newton_eval(coef, centers, x):
    """중첩 곱셈(호너 방식): a0 + (x − x0)(a1 + (x − x1)(a2 + ...))."""
    s = coef[-1]
    for a, c in zip(reversed(coef[:-1]), reversed(centers[:len(coef) - 1])):
        s = a + (x - c) * s
    return s


def main():
    # 슬라이드 p.18: 중심 1, 3, 4, 4.5, 계수 5, −2, 0.5, −0.1, 0.003
    cen = [F(1), F(3), F(4), F(9, 2)]; co = [F(5), F(-2), F(1, 2), F(-1, 10), F(3, 1000)]
    vals = [newton_eval(co[:k + 1], cen, F(5, 2)) for k in range(1, 5)]
    assert vals == [2, F(13, 8), F(121, 80), F(30115, 20000)]
    assert [float(v) for v in vals] == [2.0, 1.625, 1.5125, 1.50575]
    # 슬라이드 p.28: f(x) = x³ − 4x, x = 1..6
    xs = [F(x) for x in range(1, 7)]; ys = [x ** 3 - 4 * x for x in xs]
    T = divided_differences(xs, ys)
    assert [T[k][0] for k in range(6)] == [-3, 0, 15, 48, 105, 192]
    assert [T[k][1] for k in range(1, 6)] == [3, 15, 33, 57, 87]
    assert [T[k][2] for k in range(2, 6)] == [6, 9, 12, 15]
    assert [T[k][3] for k in range(3, 6)] == [1, 1, 1]
    assert [T[k][4] for k in range(4, 6)] == [0, 0] and T[5][5] == 0
    coef = [T[k][k] for k in range(6)]
    assert coef[:4] == [-3, 3, 6, 1]
    for x in [F(v, 3) for v in range(-6, 25)]:
        assert newton_eval(coef[:4], xs, x) == x ** 3 - 4 * x      # 3차라 P3이 f와 같다
    # 점 하나를 더하면 앞 계수는 그대로, 항 하나만 붙는다
    T2 = divided_differences(xs[:3], ys[:3])
    assert [T2[k][k] for k in range(3)] == coef[:3]
    # 1계 분할 차분 ≈ 가운데 점의 도함수 (평균값 정리)
    f = lambda x: x ** 3 - 4 * x; df = lambda x: 3 * x * x - 4
    x0, x1 = F(2), F(21, 10)
    dd = (f(x1) - f(x0)) / (x1 - x0)
    assert abs(dd - df((x0 + x1) / 2)) < abs(dd - df(x0))
    # 2계 분할 차분 = f''(c)/2 (2차식이면 정확히)
    g = lambda x: 3 * x * x - x + 2
    T3 = divided_differences([F(0), F(1), F(5)], [g(F(0)), g(F(1)), g(F(5))])
    assert T3[2][2] == 3
    # 카드 C2: (0, 1), (1, 3), (2, 7)
    T4 = divided_differences([F(0), F(1), F(2)], [F(1), F(3), F(7)])
    assert [T4[k][k] for k in range(3)] == [1, 2, 1]
    assert newton_eval([F(1), F(2), F(1)], [F(0), F(1)], F(3)) == 13
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
