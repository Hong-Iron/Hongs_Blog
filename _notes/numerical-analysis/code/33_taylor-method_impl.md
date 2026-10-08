---
layout: "note"
title: "33_taylor-method_impl.py"
display_title: "33_taylor-method_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "33"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/taylor-method/"
parent_title: "테일러 급수 방법"
description: "수치해석 · 테일러 급수 방법 구현 코드"
permalink: "/studies/numerical-analysis/code/33_taylor-method_impl/"
---
{% raw %}
[테일러 급수 방법](/Hongs_Blog/studies/numerical-analysis/taylor-method/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""테일러 급수 방법(상미분방정식) 구현과 검증. y' = x + y, y(0) = 1, 참값 y = 2eˣ − x − 1."""
import math


def taylor_step(x, y, h, k):
    """y' = x + y이면 y'' = 1 + x + y, y''' 이상도 1 + x + y."""
    d = [x + y] + [1 + x + y] * (k - 1)             # f, f', f'', ... (전미분)
    T = sum(h ** j / math.factorial(j + 1) * d[j] for j in range(k))
    return y + h * T


def solve(k, h, X=1.0):
    n = round(X / h); x, y = 0.0, 1.0
    for _ in range(n):
        y = taylor_step(x, y, h, k); x += h
    return y


def main():
    exact = 2 * math.e - 2
    # k = 1은 오일러 방법
    x, y, h = 0.0, 1.0, 0.1
    assert taylor_step(x, y, h, 1) == y + h * (x + y)
    # 전역 오차의 차수: h를 반으로 줄이면 오차가 2^k분의 1
    for k in (1, 2, 3, 4):
        e1 = abs(solve(k, 0.1) - exact); e2 = abs(solve(k, 0.05) - exact)
        ratio = e1 / e2
        assert abs(math.log2(ratio) - k) < 0.2, (k, ratio)
    # 카드 C2: h = 0.1, 한 걸음, k = 2
    y1 = taylor_step(0.0, 1.0, 0.1, 2)
    assert abs(y1 - (1 + 0.1 * 1 + 0.01 / 2 * 2)) < 1e-15 and abs(y1 - 1.11) < 1e-15
    print("k별 오차(h=0.1):", ["%.1e" % abs(solve(k, 0.1) - exact) for k in (1, 2, 3, 4)])
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
