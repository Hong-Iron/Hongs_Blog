---
layout: "note"
title: "10_linear-approx-newton_impl.py"
display_title: "10_linear-approx-newton_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "10"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/linear-approx-newton/"
parent_title: "선형 근사와 뉴턴 방법"
description: "미분적분학 · 선형 근사와 뉴턴 방법 구현 코드"
permalink: "/studies/calculus/code/10_linear-approx-newton_impl/"
---
{% raw %}
[선형 근사와 뉴턴 방법](/Hongs_Blog/studies/calculus/linear-approx-newton/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""뉴턴 방법 구현과 자체 테스트.

문서: 10.선형 근사와 뉴턴 방법 (의사코드, 실행 추적, 카드 C1~C3)
newton(f, df, x0): x_{n+1} = x_n - f(x_n)/df(x_n). 이웃 값의 차가 tol 이하이거나 max_iter에 이르면 멈춘다.
"""


def newton(f, df, x0, tol=1e-12, max_iter=50):
    """뉴턴 방법. 반환: (근의 어림, 지나온 값 목록). 기울기가 0이면 ZeroDivisionError를 낸다."""
    xs = [x0]
    x = x0
    for _ in range(max_iter):
        slope = df(x)
        if slope == 0:
            raise ZeroDivisionError(f"기울기 0 at x = {x}")
        x_new = x - f(x) / slope
        xs.append(x_new)
        if abs(x_new - x) <= tol:
            return x_new, xs
        x = x_new
    return x, xs


if __name__ == "__main__":
    import math
    root, xs = newton(lambda x: x * x - 2, lambda x: 2 * x, 1.0)
    assert abs(root - math.sqrt(2)) < 1e-15
    assert xs[1] == 1.5 and abs(xs[2] - 17 / 12) < 1e-15 and abs(xs[3] - 577 / 408) < 1e-15
    root3, _ = newton(lambda x: x ** 3 - x - 2, lambda x: 3 * x * x - 1, 1.5)
    assert abs(root3 ** 3 - root3 - 2) < 1e-12
    try:
        newton(lambda x: x * x - 2, lambda x: 2 * x, 0.0)
        raise AssertionError
    except ZeroDivisionError:
        pass
    _, cyc = newton(lambda x: x ** 3 - 2 * x + 2, lambda x: 3 * x * x - 2, 0.0, max_iter=8)
    assert cyc[:6] == [0.0, 1.0, 0.0, 1.0, 0.0, 1.0]
    print("ALL CHECKS PASSED")
```
{% endraw %}
