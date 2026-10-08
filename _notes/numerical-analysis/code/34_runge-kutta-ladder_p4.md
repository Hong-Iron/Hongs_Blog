---
layout: "note"
title: "34_runge-kutta-ladder_p4.py"
display_title: "34_runge-kutta-ladder_p4.py"
kind: "code"
kind_label: "코드 · 문제 4 풀이"
num: "34"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/runge-kutta-ladder/"
parent_title: "룽게-쿠타 예제 사다리"
description: "수치해석 · 룽게-쿠타 예제 사다리 문제 4 풀이 코드"
permalink: "/studies/numerical-analysis/code/34_runge-kutta-ladder_p4/"
---
{% raw %}
[룽게-쿠타 예제 사다리](/Hongs_Blog/studies/numerical-analysis/runge-kutta-ladder/) 문서의 문제 4 풀이 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""룽게-쿠타 예제 사다리 문제 1~4 검증."""
import math


def rk2(f, x, y, h, a):
    w2 = 1 / (2 * a); w1 = 1 - w2
    k1 = f(x, y); k2 = f(x + a * h, y + a * h * k1)
    return k1, k2, y + h * (w1 * k1 + w2 * k2)


def main():
    f = lambda x, y: y                                                        # 문제 1: RK4
    h = 0.1; k1 = f(0, 1); k2 = f(h / 2, 1 + h / 2 * k1); k3 = f(h / 2, 1 + h / 2 * k2); k4 = f(h, 1 + h * k3)
    assert (k1, round(k2, 10), round(k3, 10), round(k4, 10)) == (1, 1.05, 1.0525, 1.10525)
    y1 = 1 + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    assert abs(y1 - 1.1051708333) < 1e-10 and abs(y1 - math.exp(0.1)) < 1e-7
    k1, k2, y = rk2(lambda x, y: -2 * y, 0, 1, 0.1, 0.5)                       # 문제 2: 중점
    assert (k1, round(k2, 12), round(y, 12)) == (-2, -1.8, 0.82)
    assert abs(y - math.exp(-0.2)) < 2e-3
    k1, k2, y = rk2(lambda x, y: x - y, 0, 1, 0.2, 1.0)                        # 문제 3: 호인
    assert (k1, round(k2, 12), round(y, 12)) == (-1, -0.6, 0.84)
    assert abs((0.2 - 1 + 2 * math.exp(-0.2)) - 0.837462) < 1e-6
    k1, k2, y = rk2(lambda x, y: y * y, 0, 1, 0.1, 0.75)                       # 문제 4: 랄스턴
    assert k1 == 1 and abs(k2 - 1.155625) < 1e-12 and abs(y - 1.1103750) < 1e-7
    assert abs(1 / (1 - 0.1) - y) < 1e-3
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
