---
layout: "note"
title: "26_gradient-descent_impl.py"
display_title: "26_gradient-descent_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "26"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/gradient-descent/"
parent_title: "경사 하강법"
description: "미분적분학 · 경사 하강법 구현 코드"
permalink: "/studies/calculus/code/26_gradient-descent_impl/"
---
{% raw %}
[경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""경사 하강법 구현과 자체 테스트.

문서: 26.경사 하강법
gradient_descent(grad, x0, lr, tol, max_iter) -> (x, history)
    기울기의 크기가 tol 이하가 되거나 max_iter번 돌면 멈춘다. 값이 발산하면 즉시 멈춘다.
heavy_ball(grad, x0, lr, beta, tol, max_iter) -> (x, history)
    모멘텀(폴랴크의 헤비볼) 변형: v <- beta*v - lr*grad(x), x <- x + v.
인덱스는 0부터, 벡터는 파이썬 리스트다.
"""
import math


def norm(v):
    return math.sqrt(sum(t * t for t in v))


def _diverged(x):
    return not all(math.isfinite(t) for t in x) or norm(x) > 1e100


def gradient_descent(grad, x0, lr, tol=1e-10, max_iter=100000):
    x = list(x0)
    hist = [list(x)]
    for _ in range(max_iter):
        g = grad(x)
        if norm(g) <= tol:
            break
        x = [xi - lr * gi for xi, gi in zip(x, g)]
        hist.append(list(x))
        if _diverged(x):
            break
    return x, hist


def heavy_ball(grad, x0, lr, beta, tol=1e-10, max_iter=100000):
    x = list(x0)
    v = [0.0] * len(x)
    hist = [list(x)]
    for _ in range(max_iter):
        g = grad(x)
        if norm(g) <= tol:
            break
        v = [beta * vi - lr * gi for vi, gi in zip(v, g)]
        x = [xi + vi for xi, vi in zip(x, v)]
        hist.append(list(x))
        if _diverged(x):
            break
    return x, hist


if __name__ == "__main__":
    # 1. 확인 문제의 추적: f(x) = (x - 3)^2, x0 = 0, 학습률 0.25
    _, h = gradient_descent(lambda x: [2 * (x[0] - 3)], [0.0], 0.25, max_iter=3)
    assert [p[0] for p in h] == [0.0, 1.5, 2.25, 2.625]

    # 2. 조건이 나쁜 이차함수 x^2 + 10 y^2: 학습률 0.09는 수렴, 0.11은 발산
    g = lambda p: [2 * p[0], 20 * p[1]]
    x, _ = gradient_descent(g, [1.0, 1.0], 0.09)
    assert norm(x) < 1e-9
    x, _ = gradient_descent(g, [1.0, 1.0], 0.11, max_iter=2000)
    assert _diverged(x) or norm(x) > 1e6

    # 3. 선형 회귀: 평균제곱오차의 경사 하강 결과가 정규방정식의 해와 같다
    X = [[1, 0.0], [1, 1.0], [1, 2.0], [1, 3.0]]
    y = [1.0, 3.1, 4.9, 7.2]
    def mse_grad(w):
        gr = [0.0, 0.0]
        for xi, yi in zip(X, y):
            err = sum(a * b for a, b in zip(w, xi)) - yi
            for j in range(2):
                gr[j] += 2 * err * xi[j] / len(X)
        return gr
    w, _ = gradient_descent(mse_grad, [0.0, 0.0], 0.1)
    n = len(X)
    sx = sum(r[1] for r in X); sxx = sum(r[1] ** 2 for r in X)
    sy = sum(y); sxy = sum(r[1] * t for r, t in zip(X, y))
    b1 = (n * sxy - sx * sy) / (n * sxx - sx * sx)
    b0 = (sy - b1 * sx) / n
    assert abs(w[0] - b0) < 1e-8 and abs(w[1] - b1) < 1e-8

    # 4. 모멘텀이 조건수 100인 이차함수에서 더 적은 반복으로 수렴한다
    L, mu = 100.0, 1.0
    g = lambda p: [mu * p[0], L * p[1]]
    _, h1 = gradient_descent(g, [1.0, 1.0], 1 / L, tol=1e-8)
    _, h2 = heavy_ball(g, [1.0, 1.0], 4 / (math.sqrt(L) + math.sqrt(mu)) ** 2,
                       ((math.sqrt(L) - math.sqrt(mu)) / (math.sqrt(L) + math.sqrt(mu))) ** 2, tol=1e-8)
    assert len(h2) < len(h1) / 5
    print("impl tests passed")
```
{% endraw %}
