---
layout: "note"
title: "24_matrix-calculus_verify.py"
display_title: "24_matrix-calculus_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/matrix-calculus/"
parent_title: "행렬 미분"
description: "미분적분학 · 행렬 미분 검증 코드"
permalink: "/studies/calculus/code/24_matrix-calculus_verify/"
---
{% raw %}
[행렬 미분](/Hongs_Blog/studies/calculus/matrix-calculus/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""행렬 미분 검증.

문서: 24.행렬 미분 (예시, 규칙표, 근거, 예제 둘, 카드 C1~C3)
주장 1: 예시·카드 C1 — A = [[1,2],[0,3]]: ∇(x^T A x) = (A + A^T)x = [[2,2],[2,6]]x.
주장 2: 규칙표 — a^T x, x^T x, x^T A x, ||Ax - b||², g(h(x))의 그래디언트가 중앙 차분과 일치(무작위).
주장 3: 예제 — 릿지 해 (A^T A + λI)x = A^T b에서 기울기 0, 주변 무작위 점보다 손실이 작다.
주장 4: 로지스틱 회귀 — ∇_w L = X^T (σ(Xw) - y) (무작위 데이터, 중앙 차분).
"""
import math
import random


def num_grad(f, x, h=1e-6):
    g = []
    for i in range(len(x)):
        p, q = x[:], x[:]
        p[i] += h
        q[i] -= h
        g.append((f(p) - f(q)) / (2 * h))
    return g


def mv(A, x):
    return [sum(a * b for a, b in zip(r, x)) for r in A]


def T(A):
    return [list(r) for r in zip(*A)]


def solve(M, y):
    n = len(M)
    A = [r[:] + [v] for r, v in zip(M, y)]
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(A[i][k]))
        A[k], A[p] = A[p], A[k]
        for i in range(k + 1, n):
            f = A[i][k] / A[k][k]
            A[i] = [a - f * b for a, b in zip(A[i], A[k])]
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (A[i][n] - sum(A[i][j] * x[j] for j in range(i + 1, n))) / A[i][i]
    return x


def close(u, v, tol=1e-5):
    return all(abs(a - b) < tol * max(1, abs(b)) for a, b in zip(u, v))


def main():
    A = [[1, 2], [0, 3]]
    AAt = [[A[i][j] + A[j][i] for j in range(2)] for i in range(2)]
    assert AAt == [[2, 2], [2, 6]]
    rng = random.Random(24)
    for _ in range(100):
        x = [rng.uniform(-3, 3), rng.uniform(-3, 3)]
        f = lambda v: sum(v[i] * A[i][j] * v[j] for i in range(2) for j in range(2))
        assert close(num_grad(f, x), mv(AAt, x))
        assert close(num_grad(f, x), [2 * x[0] + 2 * x[1], 2 * x[0] + 6 * x[1]])
    print("[OK] 주장 1·카드 C1·C3")

    for _ in range(100):
        n, m = rng.randint(1, 5), rng.randint(1, 5)
        a = [rng.uniform(-2, 2) for _ in range(n)]
        B = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(n)]
        M = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(m)]
        b = [rng.uniform(-2, 2) for _ in range(m)]
        x = [rng.uniform(-2, 2) for _ in range(n)]
        assert close(num_grad(lambda v: sum(p * q for p, q in zip(a, v)), x), a)
        assert close(num_grad(lambda v: sum(t * t for t in v), x), [2 * t for t in x])
        BBt = [[B[i][j] + B[j][i] for j in range(n)] for i in range(n)]
        assert close(num_grad(lambda v: sum(v[i] * B[i][j] * v[j] for i in range(n) for j in range(n)), x), mv(BBt, x))
        r = [p - q for p, q in zip(mv(M, x), b)]
        assert close(num_grad(lambda v: sum((p - q) ** 2 for p, q in zip(mv(M, v), b)), x), [2 * t for t in mv(T(M), r)])
        # g(h(x)): h(x) = Mx, g(y) = Σ sin(y_i)  ->  J_h^T ∇g = M^T cos(Mx)
        hx = mv(M, x)
        assert close(num_grad(lambda v: sum(math.sin(t) for t in mv(M, v)), x), mv(T(M), [math.cos(t) for t in hx]))
    print("[OK] 주장 2: 규칙표")

    for _ in range(100):
        m, n = rng.randint(3, 7), rng.randint(1, 3)
        M = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(m)]
        b = [rng.uniform(-2, 2) for _ in range(m)]
        lam = rng.uniform(0.1, 2)
        G = [[sum(M[k][i] * M[k][j] for k in range(m)) + (lam if i == j else 0) for j in range(n)] for i in range(n)]
        x = solve(G, mv(T(M), b))
        L = lambda v: sum((p - q) ** 2 for p, q in zip(mv(M, v), b)) + lam * sum(t * t for t in v)
        assert all(abs(g) < 1e-6 for g in num_grad(L, x))
        base = L(x)
        for _ in range(30):
            y = [t + rng.uniform(-0.5, 0.5) for t in x]
            assert L(y) >= base - 1e-12
    print("[OK] 주장 3·카드 C2: 릿지")

    sig = lambda s: 1 / (1 + math.exp(-s))
    for _ in range(100):
        m, n = rng.randint(3, 8), rng.randint(1, 4)
        X = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(m)]
        y = [rng.randint(0, 1) for _ in range(m)]
        w = [rng.uniform(-1, 1) for _ in range(n)]

        def L(v):
            tot = 0.0
            for i in range(m):
                p = sig(sum(X[i][j] * v[j] for j in range(n)))
                tot -= y[i] * math.log(p) + (1 - y[i]) * math.log(1 - p)
            return tot
        p = [sig(sum(X[i][j] * w[j] for j in range(n))) for i in range(m)]
        formula = mv(T(X), [pi - yi for pi, yi in zip(p, y)])
        assert close(num_grad(L, w), formula)
    print("[OK] 주장 4: 로지스틱 회귀 기울기")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
