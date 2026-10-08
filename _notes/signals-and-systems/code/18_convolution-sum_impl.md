---
layout: "note"
title: "18_convolution-sum_impl.py"
display_title: "18_convolution-sum_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "18"
course: "신호 및 시스템"
course_slug: "signals-and-systems"
course_url: "/studies/signals-and-systems/"
track: "신호와 미디어"
parent_url: "/studies/signals-and-systems/convolution-sum/"
parent_title: "컨벌루션 합"
description: "신호 및 시스템 · 컨벌루션 합 구현 코드"
permalink: "/studies/signals-and-systems/code/18_convolution-sum_impl/"
---
{% raw %}
[컨벌루션 합](/Hongs_Blog/studies/signals-and-systems/convolution-sum/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""컨벌루션 합 문서: 유한 길이 수열의 컨벌루션을 구현하고, 예제 2.1~2.5의 결과와 닫힌 꼴을 직접 합과 비교한다.
인덱스: 수열은 (시작 번호 n0, 값 목록)으로 나타낸다. 값 목록의 i번째는 n = n0 + i의 값이다."""
import random
from fractions import Fraction as F

def conv(x, h):
    """y[n] = sum_k x[k] h[n-k]. x = (nx, xs), h = (nh, hs) -> (nx + nh, ys)"""
    (nx, xs), (nh, hs) = x, h
    ys = [0] * (len(xs) + len(hs) - 1)
    for i, a in enumerate(xs):
        for j, b in enumerate(hs):
            ys[i + j] += a * b
    return nx + nh, ys

def conv_direct(xf, hf, n, lo, hi):
    """정의대로: sum_{k=lo}^{hi} x[k] h[n-k] (함수로 주어진 신호)"""
    return sum(xf(k) * hf(n - k) for k in range(lo, hi + 1))

if __name__ == "__main__":
    # 예제 2.1·2.2: h = [1, 1, 1] (n = 0..2), x = [0.5, 2] (n = 0..1) -> y = 0.5, 2.5, 2.5, 2
    n0, y = conv((0, [F(1, 2), F(2)]), (0, [1, 1, 1]))
    assert n0 == 0 and y == [F(1, 2), F(5, 2), F(5, 2), F(2)]
    # 교환법칙: 순서를 바꿔도 같다
    assert conv((0, [1, 1, 1]), (0, [F(1, 2), F(2)]))[1] == y

    # 예제 2.3: x = α^n u[n], h = u[n] -> y = (1 - α^{n+1})/(1 - α) u[n]
    for a in (F(1, 2), F(3, 4), F(-1, 3)):
        x = lambda k, a=a: a ** k if k >= 0 else 0
        u = lambda k: 1 if k >= 0 else 0
        for n in range(-3, 15):
            want = (1 - a ** (n + 1)) / (1 - a) if n >= 0 else 0
            assert conv_direct(x, u, n, -5, 40) == want

    # 예제 2.4: x = 1 (0..4), h = α^n (0..6), 다섯 구간의 닫힌 꼴
    for a in (F(2), F(3, 2)):
        n0, y = conv((0, [1] * 5), (0, [a ** k for k in range(7)]))
        def closed(n):
            if n < 0 or n > 10: return 0
            if n <= 4: return (1 - a ** (n + 1)) / (1 - a)
            if n <= 6: return (a ** (n - 4) - a ** (n + 1)) / (1 - a)
            return (a ** (n - 4) - a ** 7) / (1 - a)
        assert len(y) == 11 and all(y[n] == closed(n) for n in range(11))
        assert closed(11) == 0 and closed(-1) == 0
        # 구간 3에서는 n과 관계없이 5개가 겹친다
        for n in (5, 6):
            assert sum(1 for k in range(0, 5) if 0 <= n - k <= 6) == 5

    # 예제 2.5: x = 2^n u[-n], h = u[n] -> y = 2 (n >= 0), 2^{n+1} (n < 0)
    x = lambda k: F(2) ** k if k <= 0 else 0
    u = lambda k: 1 if k >= 0 else 0
    for n in range(-6, 6):
        got = conv_direct(x, u, n, -80, 0)
        want = 2 if n >= 0 else F(2) ** (n + 1)
        assert abs(got - want) < F(1, 2 ** 70)

    # 무작위: 유한 수열의 구현과 정의대로의 합이 같다
    random.seed(1)
    for _ in range(200):
        xs = [random.randint(-5, 5) for _ in range(random.randint(1, 8))]
        hs = [random.randint(-5, 5) for _ in range(random.randint(1, 8))]
        nx, nh = random.randint(-4, 4), random.randint(-4, 4)
        n0, ys = conv((nx, xs), (nh, hs))
        xf = lambda k: xs[k - nx] if 0 <= k - nx < len(xs) else 0
        hf = lambda k: hs[k - nh] if 0 <= k - nh < len(hs) else 0
        for i, v in enumerate(ys):
            assert v == conv_direct(xf, hf, n0 + i, -20, 20)
        # δ[n]과의 컨벌루션은 원래 신호
        assert conv((nx, xs), (0, [1])) == (nx, xs)
    print("ALL CHECKS PASSED")
```
{% endraw %}
