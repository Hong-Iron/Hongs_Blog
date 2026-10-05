---
layout: "note"
title: "22_backprop-bridge_verify.py"
display_title: "22_backprop-bridge_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "22"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/backprop-bridge/"
parent_title: "연쇄 법칙 ↔ 역전파"
description: "미분적분학 · 연쇄 법칙 ↔ 역전파 검증 코드"
permalink: "/studies/calculus/code/22_backprop-bridge_verify/"
---
{% raw %}
[연쇄 법칙 ↔ 역전파](/Hongs_Blog/studies/calculus/backprop-bridge/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""연쇄 법칙 ↔ 역전파 검증.

문서: 22.연쇄 법칙 ↔ 역전파 (비교 표, 대응 관계, 어디까지 같은가, 얻는 것, 전이 문제, 카드 C1~C3)
주장 1: 비교 표 — f = (x + y)y, (2,3): f = 15, df/dx = 3, df/dy = 8 (자동미분, 손 계산 y + u).
주장 2: 자동미분이 무작위 뉴런 손실 (σ(w·x + b) - t)² 200개에서 중앙 차분과 일치.
주장 3: 카드 C2 — (xy + x)², (1,2): 18, 6.
주장 4: 전이 문제 — C = AB, D = C + A, E = D², (2,3): 64, 32.
주장 5: 비용 — 1×n 기울기와 n×n 야코비 L개: 왼쪽부터 L n² 곱셈, 오른쪽부터 (L-1)n³ + n², 결과는 같다(유리수 무작위).
"""
import math
import random
from fractions import Fraction as F


class Value:
    """22_backprop-bridge_impl.py의 Value를 복사(파일끼리 import하지 않는다)."""

    def __init__(self, data, parents=()):
        self.data = float(data)
        self.grad = 0.0
        self._parents = parents

    def __add__(self, o):
        o = o if isinstance(o, Value) else Value(o)
        return Value(self.data + o.data, ((self, 1.0), (o, 1.0)))

    __radd__ = __add__

    def __mul__(self, o):
        o = o if isinstance(o, Value) else Value(o)
        return Value(self.data * o.data, ((self, o.data), (o, self.data)))

    __rmul__ = __mul__

    def __sub__(self, o):
        o = o if isinstance(o, Value) else Value(o)
        return Value(self.data - o.data, ((self, 1.0), (o, -1.0)))

    def __pow__(self, k):
        return Value(self.data ** k, ((self, k * self.data ** (k - 1)),))

    def sigmoid(self):
        s = 1 / (1 + math.exp(-self.data))
        return Value(s, ((self, s * (1 - s)),))

    def backward(self):
        order, seen = [], set()

        def visit(v):
            if id(v) not in seen:
                seen.add(id(v))
                for p, _ in v._parents:
                    visit(p)
                order.append(v)
        visit(self)
        self.grad = 1.0
        for v in reversed(order):
            for p, local in v._parents:
                p.grad += local * v.grad


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def main():
    x, y = Value(2), Value(3)
    u = x + y
    f = u * y
    f.backward()
    assert (f.data, x.grad, y.grad) == (15, 3, 8) and 3 + 5 == 8
    print("[OK] 주장 1·카드 C1: 비교 표")

    rng = random.Random(22)
    for _ in range(200):
        vals = [rng.uniform(-2, 2) for _ in range(6)]
        nodes = [Value(v) for v in vals]
        w1, w2, b, x1, x2, t = nodes
        L = ((w1 * x1 + w2 * x2 + b).sigmoid() - t) ** 2
        L.backward()

        def Ln(v):
            s = 1 / (1 + math.exp(-(v[0] * v[3] + v[1] * v[4] + v[2])))
            return (s - v[5]) ** 2
        for i, nd in enumerate(nodes):
            p, q = vals[:], vals[:]
            p[i] += 1e-6
            q[i] -= 1e-6
            assert abs(nd.grad - (Ln(p) - Ln(q)) / 2e-6) < 1e-6
    print("[OK] 주장 2: 자동미분 = 중앙 차분")

    x, y = Value(1), Value(2)
    f = (x * y + x) ** 2
    f.backward()
    assert (f.data, x.grad, y.grad) == (9, 18, 6)
    print("[OK] 주장 3·카드 C2")

    A, B = Value(2), Value(3)
    C = A * B
    D = C + A
    E = D ** 2
    E.backward()
    assert (C.data, D.data, E.data, A.grad, B.grad) == (6, 8, 64, 64, 32)
    print("[OK] 주장 4: 전이 문제")

    for n, Lc in ((3, 4), (5, 3), (8, 5)):
        g = [[F(rng.randint(-3, 3)) for _ in range(n)]]
        Js = [[[F(rng.randint(-3, 3)) for _ in range(n)] for _ in range(n)] for _ in range(Lc)]
        left, cost_l = g, 0
        for J in Js:
            left = mm(left, J)
            cost_l += n * n
        # 오른쪽부터: 야코비끼리의 행렬 곱을 먼저 모두 만든 뒤 마지막에 g를 곱한다
        cost_r = 0
        prod = Js[0]
        for J in Js[1:]:
            prod = mm(prod, J)
            cost_r += n ** 3
        res_r = mm(g, prod)
        cost_r += n * n
        assert res_r == left
        assert cost_l == Lc * n * n and cost_r == (Lc - 1) * n ** 3 + n * n
    print("[OK] 주장 5·카드 C3: 곱하는 순서와 비용")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
