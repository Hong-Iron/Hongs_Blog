---
layout: "note"
title: "24_data-linearization_verify.py"
display_title: "24_data-linearization_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/data-linearization/"
parent_title: "자료 선형화"
description: "수치해석 · 자료 선형화 검증 코드"
permalink: "/studies/numerical-analysis/code/24_data-linearization_verify/"
---
{% raw %}
[자료 선형화](/Hongs_Blog/studies/numerical-analysis/data-linearization/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""자료 선형화 문서의 주장 검증."""
import math


def line_fit(X, Y):
    """Y = AX + B의 최소제곱 해(정규방정식)."""
    n = len(X); sx, sy = sum(X), sum(Y); sxx = sum(x * x for x in X); sxy = sum(x * y for x, y in zip(X, Y))
    d = sxx * n - sx * sx
    return (sxy * n - sx * sy) / d, (sxx * sy - sx * sxy) / d


def sse(f, xs, ys):
    return sum((f(x) - y) ** 2 for x, y in zip(xs, ys))


def main():
    # 거듭제곱 맞춤 y = A x^M, M = 2 (슬라이드 p.16)
    t = [0.2, 0.4, 0.6, 0.8, 1.0]; d = [0.1960, 0.7850, 1.7665, 3.1405, 4.9075]
    num = sum(dk * tk ** 2 for tk, dk in zip(t, d)); den = sum(tk ** 4 for tk in t)
    assert round(num, 5) == 7.6868 and round(den, 4) == 1.5664
    A = num / den
    assert round(A, 4) == 4.9073
    assert round(2 * A, 4) == 9.8146                             # 슬라이드는 9.7146으로 적음
    # E'(A) = 0의 해가 최소인지: 근처 A보다 오차가 작다
    E = lambda a: sum((a * tk ** 2 - dk) ** 2 for tk, dk in zip(t, d))
    assert E(A) < E(A + 0.01) and E(A) < E(A - 0.01)
    # 지수 맞춤 y = C e^{Ax}: 로그로 선형화 (슬라이드 p.20~22)
    xs = [0, 1, 2, 3, 4]; ys = [1.5, 2.5, 3.5, 5.0, 7.5]
    Y = [math.log(y) for y in ys]
    assert [round(v, 5) for v in Y] == [0.40547, 0.91629, 1.25276, 1.60944, 2.0149]
    a, b = line_fit(xs, Y)
    C = math.exp(b)
    assert round(a, 6) == 0.391202 and round(C, 5) == 1.57991
    # 비선형 최소제곱: E(A, C) = Σ(C e^{Ax} − y)²을 직접 최소화 (가우스-뉴턴)
    A2, C2 = a, C
    for _ in range(50):
        r = [C2 * math.exp(A2 * x) - y for x, y in zip(xs, ys)]
        J = [(C2 * x * math.exp(A2 * x), math.exp(A2 * x)) for x in xs]
        g11 = sum(j[0] ** 2 for j in J); g12 = sum(j[0] * j[1] for j in J); g22 = sum(j[1] ** 2 for j in J)
        r1 = sum(j[0] * ri for j, ri in zip(J, r)); r2 = sum(j[1] * ri for j, ri in zip(J, r))
        det = g11 * g22 - g12 * g12
        A2 -= (g22 * r1 - g12 * r2) / det; C2 -= (-g12 * r1 + g11 * r2) / det
    assert abs(A2 - 0.38357) < 1e-5 and round(C2, 4) == 1.6109                # 슬라이드 p.40 (0.383575를 버림)
    f_lin = lambda x: C * math.exp(a * x); f_non = lambda x: C2 * math.exp(A2 * x)
    assert sse(f_non, xs, ys) < sse(f_lin, xs, ys)                           # 원래 오차는 비선형이 더 작다
    lin_err = lambda A_, B_: sum((A_ * x + B_ - yy) ** 2 for x, yy in zip(xs, Y))
    assert lin_err(a, b) < lin_err(A2, math.log(C2))                         # 로그 공간에서는 선형화가 더 작다
    print("SSE 선형화", round(sse(f_lin, xs, ys), 4), "비선형", round(sse(f_non, xs, ys), 4))
    print("x = 10 예측", round(f_lin(10), 4), round(f_non(10), 4))
    assert round(f_lin(10), 4) == 78.9955 and round(f_non(10), 4) == 74.6287
    # y = A ln x + B, y = x/(Cx + D)의 선형화 (슬라이드 p.24, p.26)
    xs2 = [1, 2, 4, 8]; ys2 = [3 * math.log(x) + 1 for x in xs2]
    a3, b3 = line_fit([math.log(x) for x in xs2], ys2); assert abs(a3 - 3) < 1e-12 and abs(b3 - 1) < 1e-12
    ys3 = [x / (2 * x + 5) for x in xs2]
    a4, b4 = line_fit([1 / x for x in xs2], [1 / y for y in ys3]); assert abs(a4 - 5) < 1e-12 and abs(b4 - 2) < 1e-12   # D = A, C = B
    # 카드 C2: y = C e^{Ax}가 (0, 2), (1, 2e)를 지나면 ln y = x + ln 2
    a5, b5 = line_fit([0, 1], [math.log(2), math.log(2 * math.e)])
    assert abs(a5 - 1) < 1e-12 and abs(math.exp(b5) - 2) < 1e-12
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
