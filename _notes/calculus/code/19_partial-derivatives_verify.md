---
layout: "note"
title: "19_partial-derivatives_verify.py"
display_title: "19_partial-derivatives_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/partial-derivatives/"
parent_title: "다변수 함수와 편미분"
description: "미분적분학 · 다변수 함수와 편미분 검증 코드"
permalink: "/studies/calculus/code/19_partial-derivatives_verify/"
---
{% raw %}
[다변수 함수와 편미분](/Hongs_Blog/studies/calculus/partial-derivatives/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다변수 함수와 편미분 검증.

문서: 19.다변수 함수와 편미분 (예시, 정의, 클레로, 등고선, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — f = x²y + sin y: f_x = 2xy, f_y = x² + cos y, (1,0)에서 0, 2 (중앙 차분과 비교).
주장 2: 무작위 점에서 여러 함수의 기호 편미분 = 중앙 차분.
주장 3: 클레로 — f_xy = f_yx (수치 2계 차분, 여러 함수).
주장 4: 예제·카드 C2 — xy/(x²+y²): 축 위 0, 대각선 위 1/2, 원점 편미분 0.
주장 5: 등고선 — x² + y² = c 위의 점에서 값이 c. 카드 C3 — x² + 4y² = 4는 반지름 2, 1인 타원, f_y/f_x 비교.
주장 6: 활용 — 밝기가 i = 3x + 5y인 이미지에서 전진 차분이 (3, 5).
"""
import math
import random


def pd(f, p, i, h=1e-6):
    a = list(p)
    b = list(p)
    a[i] += h
    b[i] -= h
    return (f(*a) - f(*b)) / (2 * h)


def main():
    f = lambda x, y: x * x * y + math.sin(y)
    assert abs(pd(f, (1, 0), 0) - 0) < 1e-8 and abs(pd(f, (1, 0), 1) - 2) < 1e-8
    rng = random.Random(19)
    for _ in range(300):
        x, y = rng.uniform(-3, 3), rng.uniform(-3, 3)
        assert abs(pd(f, (x, y), 0) - 2 * x * y) < 1e-6 and abs(pd(f, (x, y), 1) - (x * x + math.cos(y))) < 1e-6
    print("[OK] 주장 1·카드 C1: 예시")

    cases = [
        (lambda x, y: math.exp(x * y), lambda x, y: y * math.exp(x * y), lambda x, y: x * math.exp(x * y)),
        (lambda x, y: x ** 3 - 3 * x * y ** 2, lambda x, y: 3 * x * x - 3 * y * y, lambda x, y: -6 * x * y),
        (lambda x, y: math.sin(x) * math.cos(y), lambda x, y: math.cos(x) * math.cos(y), lambda x, y: -math.sin(x) * math.sin(y)),
    ]
    for g, gx, gy in cases:
        for _ in range(200):
            x, y = rng.uniform(-1.5, 1.5), rng.uniform(-1.5, 1.5)
            assert abs(pd(g, (x, y), 0) - gx(x, y)) < 1e-5 and abs(pd(g, (x, y), 1) - gy(x, y)) < 1e-5
    print("[OK] 주장 2: 기호 편미분 = 차분")

    for g, _, _ in cases + [(f, None, None)]:
        for _ in range(100):
            x, y = rng.uniform(-1, 1), rng.uniform(-1, 1)
            h = 1e-4
            fxy = (g(x + h, y + h) - g(x + h, y - h) - g(x - h, y + h) + g(x - h, y - h)) / (4 * h * h)
            gx = lambda xx, yy: pd(g, (xx, yy), 0, 1e-5)
            fyx = (gx(x, y + h) - gx(x, y - h)) / (2 * h)
            assert abs(fxy - fyx) < 1e-3
    for _ in range(50):
        x = rng.uniform(-2, 2)
        h = 1e-4
        fxy = (f(x + h, h) - f(x + h, -h) - f(x - h, h) + f(x - h, -h)) / (4 * h * h)
        assert abs(fxy - 2 * x) < 1e-4
    print("[OK] 주장 3: 클레로")

    g = lambda x, y: x * y / (x * x + y * y) if (x, y) != (0, 0) else 0.0
    for t in (1e-1, 1e-3, 1e-6):
        assert g(t, 0) == 0 and g(0, t) == 0 and abs(g(t, t) - 0.5) < 1e-15
    assert (g(1e-8, 0) - g(0, 0)) / 1e-8 == 0 and (g(0, 1e-8) - g(0, 0)) / 1e-8 == 0
    print("[OK] 주장 4·예제·카드 C2")

    for _ in range(200):
        c = rng.uniform(0.1, 9)
        th = rng.uniform(0, 2 * math.pi)
        x, y = math.sqrt(c) * math.cos(th), math.sqrt(c) * math.sin(th)
        assert abs(x * x + y * y - c) < 1e-12
        x2, y2 = 2 * math.cos(th), math.sin(th)
        assert abs(x2 * x2 + 4 * y2 * y2 - 4) < 1e-12
    for s in (0.5, 1.0):
        assert 8 * s > 2 * s
    print("[OK] 주장 5·카드 C3: 등고선")

    img = [[3 * x + 5 * y for x in range(6)] for y in range(6)]
    for y in range(5):
        for x in range(5):
            assert img[y][x + 1] - img[y][x] == 3 and img[y + 1][x] - img[y][x] == 5
    print("[OK] 주장 6: 이미지 차분")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
