---
layout: "note"
title: "20_gradient_verify.py"
display_title: "20_gradient_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "20"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/gradient/"
parent_title: "그래디언트와 방향도함수"
description: "미분적분학 · 그래디언트와 방향도함수 검증 코드"
permalink: "/studies/calculus/code/20_gradient_verify/"
---
{% raw %}
[그래디언트와 방향도함수](/Hongs_Blog/studies/calculus/gradient/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""그래디언트와 방향도함수 검증.

문서: 20.그래디언트와 방향도함수 (예시 표, 정의, 정리, 증명, 가정, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — f = 10 - x² - 2y², (1,1): ∇f = (-2,-4), 방향도함수 -2, -4, √20, 0 (정의의 극한을 작은 h로).
주장 2: 무작위 매끄러운 함수·점·단위벡터 — 정의의 차분 = ∇f·u.
주장 3: 무작위 방향 2000개 중 방향도함수의 최댓값이 ||∇f||에 가깝고 넘지 않음, 최대 방향이 ∇f 방향.
주장 4: 등고선 x² + 2y² = 3 위 곡선 c(t)에서 ∇f·c'(t) = 0.
주장 5: 가정·오해·카드 C3 — x²y/(x²+y²): 원점 편미분 0, 대각 방향도함수 1/(2√2).
주장 6: 예제 — i = 3x + 4y: ∇i = (3,4), 크기 5, 등고선 방향 (4,-3) 수직. 카드 C1 — x²y의 (1,2): (4,1), 3.2.
"""
import math
import random


def grad(f, p, h=1e-6):
    out = []
    for i in range(len(p)):
        a, b = list(p), list(p)
        a[i] += h
        b[i] -= h
        out.append((f(*a) - f(*b)) / (2 * h))
    return out


def ddir(f, p, u, h=1e-6):
    a = [pi + h * ui for pi, ui in zip(p, u)]
    b = [pi - h * ui for pi, ui in zip(p, u)]
    return (f(*a) - f(*b)) / (2 * h)


def main():
    f = lambda x, y: 10 - x * x - 2 * y * y
    g = grad(f, (1, 1))
    assert abs(g[0] + 2) < 1e-8 and abs(g[1] + 4) < 1e-8
    s5 = math.sqrt(5)
    vals = [ddir(f, (1, 1), u) for u in ((1, 0), (0, 1), (-1 / s5, -2 / s5), (2 / s5, -1 / s5))]
    assert all(abs(a - b) < 1e-7 for a, b in zip(vals, [-2, -4, math.sqrt(20), 0]))
    assert abs(math.sqrt(20) - 4.47) < 0.01
    print("[OK] 주장 1: 예시 표")

    rng = random.Random(20)
    funcs = [lambda x, y: math.sin(x) * math.exp(y), lambda x, y: x ** 3 * y - y ** 2, lambda x, y: math.log(1 + x * x + y * y)]
    for F in funcs:
        for _ in range(200):
            p = (rng.uniform(-1.5, 1.5), rng.uniform(-1.5, 1.5))
            th = rng.uniform(0, 2 * math.pi)
            u = (math.cos(th), math.sin(th))
            gr = grad(F, p)
            assert abs(ddir(F, p, u) - (gr[0] * u[0] + gr[1] * u[1])) < 1e-6
    print("[OK] 주장 2·카드 C2 바탕: D_u f = ∇f·u")

    for F in funcs:
        p = (rng.uniform(-1, 1), rng.uniform(-1, 1))
        gr = grad(F, p)
        n = math.hypot(*gr)
        best, bu = -1e9, None
        for _ in range(2000):
            th = rng.uniform(0, 2 * math.pi)
            u = (math.cos(th), math.sin(th))
            d = ddir(F, p, u)
            if d > best:
                best, bu = d, u
        assert best <= n + 1e-6 and best > n - 1e-3
        assert (bu[0] * gr[0] + bu[1] * gr[1]) / n > 0.999
    print("[OK] 주장 3: 가장 가파른 방향")

    for _ in range(200):
        t = rng.uniform(0, 2 * math.pi)
        c = (math.sqrt(3) * math.cos(t), math.sqrt(1.5) * math.sin(t))
        dc = (-math.sqrt(3) * math.sin(t), math.sqrt(1.5) * math.cos(t))
        assert abs(f(*c) - 7) < 1e-12
        gr = grad(f, c)
        assert abs(gr[0] * dc[0] + gr[1] * dc[1]) < 1e-6
    print("[OK] 주장 4·카드 C4: 등고선과 수직")

    h = lambda x, y: x * x * y / (x * x + y * y) if (x, y) != (0, 0) else 0.0
    for t in (1e-3, 1e-6):
        assert h(t, 0) == 0 and h(0, t) == 0
    u = (1 / math.sqrt(2), 1 / math.sqrt(2))
    for t in (1e-2, 1e-5):
        assert abs(h(t * u[0], t * u[1]) / t - 1 / (2 * math.sqrt(2))) < 1e-12
    assert abs(1 / (2 * math.sqrt(2)) - 0.354) < 0.001
    print("[OK] 주장 5·오해·카드 C3: 미분 가능성이 필요")

    I = lambda x, y: 3 * x + 4 * y
    gi = grad(I, (0.3, -0.7))
    assert abs(gi[0] - 3) < 1e-8 and abs(gi[1] - 4) < 1e-8 and abs(math.hypot(*gi) - 5) < 1e-8
    assert 3 * 4 + 4 * -3 == 0
    q = lambda x, y: x * x * y
    gq = grad(q, (1, 2))
    assert abs(gq[0] - 4) < 1e-8 and abs(gq[1] - 1) < 1e-8 and abs(ddir(q, (1, 2), (0.6, 0.8)) - 3.2) < 1e-8
    print("[OK] 주장 6·예제·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
