---
layout: "note"
title: "27_direct-search_impl.py"
display_title: "27_direct-search_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "27"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/direct-search/"
parent_title: "직접 탐색법"
description: "수치해석 · 직접 탐색법 구현 코드"
permalink: "/studies/numerical-analysis/code/27_direct-search_impl/"
---
{% raw %}
[직접 탐색법](/Hongs_Blog/studies/numerical-analysis/direct-search/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""직접 탐색법(무작위 탐색, 단변수 탐색, 패턴 탐색) 구현과 검증."""
import math, random

f = lambda x, y: y - x - 2 * x * x - 2 * x * y - y * y          # 슬라이드 p.3~4, 최댓값 1.25 at (−1, 1.5)


def random_search(f, box, n, rng):
    best = (-math.inf, None)
    for _ in range(n):
        x = rng.uniform(*box[0]); y = rng.uniform(*box[1])
        v = f(x, y)
        if v > best[0]:
            best = (v, (x, y))
    return best


def golden_max(g, a, b, tol=1e-10):
    R = (math.sqrt(5) - 1) / 2
    c, d = b - R * (b - a), a + R * (b - a)
    while b - a > tol:
        if g(c) >= g(d):
            b, d = d, c; c = b - R * (b - a)
        else:
            a, c = c, d; d = a + R * (b - a)
    return (a + b) / 2


def univariate(f, x, y, rounds):
    path = [(x, y)]
    for _ in range(rounds):
        x = golden_max(lambda t: f(t, y), -5, 5); path.append((x, y))
        y = golden_max(lambda t: f(x, t), -5, 5); path.append((x, y))
    return path


def pattern(f, x, y, rounds):
    """단변수 두 번 뒤, 처음 점과 지금 점을 잇는 방향(패턴 방향)으로 한 번 더 찾는다."""
    path = [(x, y)]
    for _ in range(rounds):
        x0, y0 = x, y
        x = golden_max(lambda t: f(t, y), -5, 5)
        y = golden_max(lambda t: f(x, t), -5, 5)
        dx, dy = x - x0, y - y0
        s = golden_max(lambda t: f(x + t * dx, y + t * dy), -5, 5)
        x, y = x + s * dx, y + s * dy
        path.append((x, y))
    return path


def main():
    assert f(-1, 1.5) == 1.25
    rng = random.Random(27)
    vals = [random_search(f, ((-2, 2), (1, 3)), n, rng)[0] for n in (100, 1000, 10000)]
    assert vals[-1] > 1.249 and vals[0] < vals[-1] + 1e-12
    v, (x, y) = random_search(f, ((-2, 2), (1, 3)), 10000, random.Random(1))
    assert abs(x + 1) < 0.05 and abs(y - 1.5) < 0.05
    print("무작위 탐색 최댓값", [round(v, 4) for v in vals])
    # 단변수 탐색: 한 번에 한 변수만 바꾼다. 갈수록 걸음이 작아진다
    p = univariate(f, 0.0, 0.0, 30)
    steps = [math.dist(p[i], p[i + 1]) for i in range(len(p) - 1)]
    assert steps[-1] < steps[0] / 100
    assert abs(p[-1][0] + 1) < 1e-6 and abs(p[-1][1] - 1.5) < 1e-6
    # 패턴 탐색은 같은 정확도에 회차가 더 적다
    def rounds_needed(method):
        for r in range(1, 200):
            q = method(f, 0.0, 0.0, r)[-1]
            if abs(q[0] + 1) < 1e-6 and abs(q[1] - 1.5) < 1e-6:
                return r
    ru, rp = rounds_needed(univariate), rounds_needed(pattern)
    assert rp < ru
    print("필요한 회차: 단변수", ru, "패턴", rp)
    # 카드 C2: (0, 0)에서 x만 바꿔 최대 → −1 − 4x − 2y = 0 → x = −0.25
    assert abs(golden_max(lambda t: f(t, 0.0), -5, 5) + 0.25) < 1e-8
    # 미분할 수 없는 함수에도 무작위 탐색은 쓸 수 있다
    h = lambda x, y: -abs(x - 0.3) - abs(y + 0.7)
    v, (x, y) = random_search(h, ((-1, 1), (-1, 1)), 20000, random.Random(5))
    assert abs(x - 0.3) < 0.03 and abs(y + 0.7) < 0.03
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
