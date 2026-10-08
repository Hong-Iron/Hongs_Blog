---
layout: "note"
title: "34_runge-kutta_impl.py"
display_title: "34_runge-kutta_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "34"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/runge-kutta/"
parent_title: "룽게-쿠타 방법"
description: "수치해석 · 룽게-쿠타 방법 구현 코드"
permalink: "/studies/numerical-analysis/code/34_runge-kutta_impl/"
---
{% raw %}
[룽게-쿠타 방법](/Hongs_Blog/studies/numerical-analysis/runge-kutta/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""룽게-쿠타 방법 구현과 검증."""
import math


def rk2(f, x, y, h, a):
    """슬라이드 p.9~10: F = w1 f(x, y) + w2 f(x + ah, y + ah f), w2 = 1/(2a), w1 = 1 − w2."""
    w2 = 1 / (2 * a); w1 = 1 - w2
    k1 = f(x, y); k2 = f(x + a * h, y + a * h * k1)
    return y + h * (w1 * k1 + w2 * k2)


def rk4(f, x, y, h):
    k1 = f(x, y); k2 = f(x + h / 2, y + h / 2 * k1); k3 = f(x + h / 2, y + h / 2 * k2); k4 = f(x + h, y + h * k3)
    return y + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)


def euler(f, x, y, h):
    return y + h * f(x, y)


def integrate(step, f, h, X, *extra):
    n = round(X / h); x, y = 0.0, 1.0
    for _ in range(n):
        y = step(f, x, y, h, *extra); x += h
    return y


def main():
    f = lambda x, y: x + y
    exact = lambda x: 2 * math.exp(x) - x - 1
    # 2차 RK 세 가지(호인 a = 1, 중점 a = 1/2, 랄스턴 a = 3/4) 모두 전역 오차 차수 2
    for a in (1.0, 0.5, 0.75):
        e1 = abs(integrate(rk2, f, 0.1, 1.0, a) - exact(1)); e2 = abs(integrate(rk2, f, 0.05, 1.0, a) - exact(1))
        assert abs(math.log2(e1 / e2) - 2) < 0.15
    # 한 걸음 오차는 h³ 차수 (테일러 2차와 맞춤)
    for a in (1.0, 0.5):
        l1 = abs(rk2(f, 0.0, 1.0, 0.1, a) - exact(0.1)); l2 = abs(rk2(f, 0.0, 1.0, 0.05, a) - exact(0.05))
        assert abs(math.log2(l1 / l2) - 3) < 0.15
    # 조건 w1 + w2 = 1, a w2 = 1/2를 어기면 차수가 1로 떨어진다
    bad = lambda f, x, y, h: y + h * (0.5 * f(x, y) + 0.5 * f(x + 0.5 * h, y + 0.5 * h * f(x, y)))   # a w2 = 1/4
    e1 = abs(integrate(bad, f, 0.1, 1.0) - exact(1)); e2 = abs(integrate(bad, f, 0.05, 1.0) - exact(1))
    assert abs(math.log2(e1 / e2) - 1) < 0.2
    # RK4는 차수 4, 같은 h에서 오일러보다 훨씬 정확
    e1 = abs(integrate(rk4, f, 0.1, 1.0) - exact(1)); e2 = abs(integrate(rk4, f, 0.05, 1.0) - exact(1))
    assert abs(math.log2(e1 / e2) - 4) < 0.2
    ee = abs(integrate(euler, f, 0.1, 1.0) - exact(1))
    print("h=0.1 오차: 오일러 %.1e, 호인 %.1e, RK4 %.1e" % (ee, abs(integrate(rk2, f, 0.1, 1.0, 1.0) - exact(1)), e1))
    assert e1 < ee / 1000
    # 카드 C2: 호인 방법 한 걸음, y' = x + y, h = 0.1
    k1 = 1.0; k2 = f(0.1, 1.0 + 0.1 * k1)
    assert abs(rk2(f, 0.0, 1.0, 0.1, 1.0) - (1 + 0.05 * (k1 + k2))) < 1e-15 and abs(rk2(f, 0.0, 1.0, 0.1, 1.0) - 1.11) < 1e-12
    # f가 y에 안 달리면(적분) 호인은 사다리꼴, RK4는 심프슨 공식
    g = lambda x, y: math.cos(x)
    assert abs(rk4(g, 0.0, 0.0, 0.5) - 0.5 / 6 * (1 + 4 * math.cos(0.25) + math.cos(0.5))) < 1e-15
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
