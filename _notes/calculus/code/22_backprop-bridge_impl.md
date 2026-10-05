---
layout: "note"
title: "22_backprop-bridge_impl.py"
display_title: "22_backprop-bridge_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "22"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/backprop-bridge/"
parent_title: "연쇄 법칙 ↔ 역전파"
description: "미분적분학 · 연쇄 법칙 ↔ 역전파 구현 코드"
permalink: "/studies/calculus/code/22_backprop-bridge_impl/"
---
{% raw %}
[연쇄 법칙 ↔ 역전파](/Hongs_Blog/studies/calculus/backprop-bridge/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""스칼라 역방향 자동미분(역전파)의 최소 구현.

문서: 22.연쇄 법칙 ↔ 역전파
Value는 값 하나와 기울기 하나를 들고, 자신을 만든 연산(부모와 국소 도함수)을 기억한다.
backward(): 출력에서 시작해 계산 그래프를 위상 정렬의 역순으로 훑으며
    부모.grad += (국소 도함수) × 자신.grad
를 한다(연쇄 법칙). 한 값이 여러 곳에 쓰이면 기울기가 더해진다(여러 길의 합).
"""
import math


class Value:
    def __init__(self, data, parents=()):
        self.data = float(data)
        self.grad = 0.0
        self._parents = parents          # [(부모 Value, 국소 도함수), ...]

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data + other.data, ((self, 1.0), (other, 1.0)))

    __radd__ = __add__

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        return Value(self.data * other.data, ((self, other.data), (other, self.data)))

    __rmul__ = __mul__

    def __neg__(self):
        return self * -1.0

    def __sub__(self, other):
        return self + (-other if isinstance(other, Value) else Value(-other))

    def __pow__(self, k):
        return Value(self.data ** k, ((self, k * self.data ** (k - 1)),))

    def exp(self):
        e = math.exp(self.data)
        return Value(e, ((self, e),))

    def sigmoid(self):
        s = 1 / (1 + math.exp(-self.data))
        return Value(s, ((self, s * (1 - s)),))

    def backward(self):
        order, seen = [], set()

        def visit(v):
            if id(v) in seen:
                return
            seen.add(id(v))
            for p, _ in v._parents:
                visit(p)
            order.append(v)
        visit(self)
        self.grad = 1.0
        for v in reversed(order):
            for p, local in v._parents:
                p.grad += local * v.grad


if __name__ == "__main__":
    # 문서의 예: f = (x + y) * y, x = 2, y = 3 -> f = 15, df/dx = y = 3, df/dy = x + 2y = 8
    x, y = Value(2), Value(3)
    f = (x + y) * y
    f.backward()
    assert f.data == 15 and x.grad == 3 and y.grad == 8
    # 수치 미분과 비교: 뉴런 하나 L = (σ(w1 x1 + w2 x2 + b) - t)²
    import random
    rng = random.Random(22)
    for _ in range(200):
        vals = [rng.uniform(-2, 2) for _ in range(6)]
        w1, w2, b, x1, x2, t = (Value(v) for v in vals)
        L = ((w1 * x1 + w2 * x2 + b).sigmoid() - t) ** 2
        L.backward()

        def Lnum(v):
            s = 1 / (1 + math.exp(-(v[0] * v[3] + v[1] * v[4] + v[2])))
            return (s - v[5]) ** 2
        for i, node in enumerate((w1, w2, b, x1, x2, t)):
            p, q = vals[:], vals[:]
            p[i] += 1e-6
            q[i] -= 1e-6
            assert abs(node.grad - (Lnum(p) - Lnum(q)) / 2e-6) < 1e-6
    print("ALL CHECKS PASSED")
```
{% endraw %}
