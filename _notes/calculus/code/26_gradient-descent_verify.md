---
layout: "note"
title: "26_gradient-descent_verify.py"
display_title: "26_gradient-descent_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "26"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/gradient-descent/"
parent_title: "경사 하강법"
description: "미분적분학 · 경사 하강법 검증 코드"
permalink: "/studies/calculus/code/26_gradient-descent_verify/"
---
{% raw %}
[경사 하강법](/Hongs_Blog/studies/calculus/gradient-descent/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""경사 하강법 검증.

문서: 26.경사 하강법, 4.연습문제/26.경사 하강법 예제 사다리
주장 1: 예시 — x^2에서 x_k = (1 - 2η)^k: η = 0.1, 0.5, 1, 1.1의 추적 표.
주장 2: 하강 보조정리 — L-매끄러운 함수에서 f(x - η∇f) <= f(x) - η(1 - Lη/2)||∇f||² (무작위 이차함수, Σ log cosh).
주장 3: 수렴 속도 — 강볼록 이차함수에서 (1 - μ/L)^k 한계, 볼록 log cosh에서 L||x0 - x*||²/(2k) 한계,
        비볼록 sin x + sin y에서 min ||∇f||² <= 2L(f(x0) - f_inf)/K.
주장 4: 예제 — x² + 10y²: η = 0.09는 y가 부호를 바꾸며(지그재그) 수렴, 0.1은 y가 제자리 진동, 0.11은 발산.
주장 5: 활용 — 조건수 100 이차함수에서 오차 10^-6까지의 반복 수(η = 1/L, η = 2/(L+μ), 헤비볼), 뉴턴 방법은 1회.
주장 6: 오해 — 안장점 x² - y²: (1, 0)에서 출발하면 (0, 0)에 멈추고, (1, 1e-8)에서 출발하면 빠져나간다.
주장 7: 카드 — C1 추적 (x-3)² → 1.5, 2.25, 2.625, C2 설명 코드가 MSE 기울기 한 걸음, C3 |1 - ηλ| < 1 ⇔ η < 2/λ.
주장 8: 예제 사다리의 수치.
"""
import math
import random


def norm(v):
    return math.sqrt(sum(t * t for t in v))


def gd(grad, x0, lr, steps):
    x = list(x0)
    hist = [list(x)]
    for _ in range(steps):
        g = grad(x)
        x = [a - lr * b for a, b in zip(x, g)]
        hist.append(list(x))
    return hist


def jacobi_eigs(S, sweeps=60):
    n = len(S)
    A = [r[:] for r in S]
    for _ in range(sweeps):
        if sum(A[i][j] ** 2 for i in range(n) for j in range(n) if i != j) < 1e-24:
            break
        for p in range(n):
            for q in range(p + 1, n):
                if abs(A[p][q]) < 1e-300:
                    continue
                th = 0.5 * math.atan2(2 * A[p][q], A[q][q] - A[p][p])
                c, s = math.cos(th), math.sin(th)
                for k in range(n):
                    A[k][p], A[k][q] = c * A[k][p] - s * A[k][q], s * A[k][p] + c * A[k][q]
                for k in range(n):
                    A[p][k], A[q][k] = c * A[p][k] - s * A[q][k], s * A[p][k] + c * A[q][k]
    return [A[i][i] for i in range(n)]


def count_iters(step, x0, tol, cap=100000):
    x, state = list(x0), None
    r0 = norm(x0)
    for k in range(1, cap + 1):
        x, state = step(x, state)
        if norm(x) <= tol * r0:
            # 이후로도 계속 작게 유지되는지 확인(진동하며 잠깐 작아진 것 배제)
            return k
    return None


def main():
    rng = random.Random(26)

    tab = {}
    for eta in (0.1, 0.5, 1.0, 1.1):
        h = gd(lambda x: [2 * x[0]], [1.0], eta, 3)
        tab[eta] = [round(p[0], 10) for p in h]
        assert all(abs(p[0] - (1 - 2 * eta) ** k) < 1e-12 for k, p in enumerate(h))
    assert tab[0.1] == [1.0, 0.8, 0.64, 0.512] and tab[0.5] == [1.0, 0.0, 0.0, 0.0]
    assert tab[1.0] == [1.0, -1.0, 1.0, -1.0] and tab[1.1] == [1.0, -1.2, 1.44, -1.728]
    print("[OK] 주장 1: 추적 표")

    for _ in range(200):
        n = rng.randint(1, 5)
        M = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(n)]
        A = [[sum(M[k][i] * M[k][j] for k in range(n)) for j in range(n)] for i in range(n)]
        b = [rng.uniform(-2, 2) for _ in range(n)]
        L = max(jacobi_eigs(A))
        if L < 1e-6:
            continue
        f = lambda x: 0.5 * sum(x[i] * A[i][j] * x[j] for i in range(n) for j in range(n)) - sum(p * q for p, q in zip(b, x))
        grad = lambda x: [sum(A[i][j] * x[j] for j in range(n)) - b[i] for i in range(n)]
        x = [rng.uniform(-3, 3) for _ in range(n)]
        g = grad(x)
        for eta in (0.3 / L, 1 / L, 1.7 / L):
            y = [a - eta * c for a, c in zip(x, g)]
            assert f(y) <= f(x) - eta * (1 - L * eta / 2) * norm(g) ** 2 + 1e-9
    f = lambda x: sum(math.log(math.cosh(t)) for t in x)
    grad = lambda x: [math.tanh(t) for t in x]
    for _ in range(300):
        x = [rng.uniform(-4, 4) for _ in range(3)]
        g = grad(x)
        for eta in (0.5, 1.0, 1.5):
            y = [a - eta * c for a, c in zip(x, g)]
            assert f(y) <= f(x) - eta * (1 - eta / 2) * norm(g) ** 2 + 1e-12
    print("[OK] 주장 2: 하강 보조정리")

    L, mu = 10.0, 1.0
    fq = lambda x: 0.5 * (mu * x[0] ** 2 + L * x[1] ** 2)
    h = gd(lambda x: [mu * x[0], L * x[1]], [3.0, -2.0], 1 / L, 200)
    for k, p in enumerate(h):
        assert fq(p) <= (1 - mu / L) ** k * fq(h[0]) + 1e-15
    h = gd(lambda x: [math.tanh(x[0])], [5.0], 1.0, 400)
    for k, p in enumerate(h[1:], 1):
        assert math.log(math.cosh(p[0])) <= 25 / (2 * k) + 1e-12
    for _ in range(50):
        x0 = [rng.uniform(-5, 5), rng.uniform(-5, 5)]
        K = 60
        h = gd(lambda x: [math.cos(x[0]), math.cos(x[1])], x0, 1.0, K)
        gn = min(math.cos(p[0]) ** 2 + math.cos(p[1]) ** 2 for p in h[:K])
        assert gn <= 2 * 1 * (math.sin(x0[0]) + math.sin(x0[1]) + 2) / K + 1e-12
    print("[OK] 주장 3: 수렴 속도 한계")

    g2 = lambda x: [2 * x[0], 20 * x[1]]
    h = gd(g2, [1.0, 1.0], 0.09, 300)
    ys = [p[1] for p in h[:10]]
    assert all(ys[i] * ys[i + 1] < 0 for i in range(9)) and norm(h[-1]) < 1e-12
    assert abs(h[1][0] - 0.82) < 1e-12 and abs(h[1][1] + 0.8) < 1e-12
    h = gd(g2, [1.0, 1.0], 0.1, 300)
    assert abs(abs(h[-1][1]) - 1) < 1e-12 and abs(h[-1][0]) < 1e-12
    h = gd(g2, [1.0, 1.0], 0.11, 300)
    assert abs(h[-1][1]) > 1e10
    print("[OK] 주장 4: 지그재그와 발산")

    L, mu = 100.0, 1.0
    gq = lambda x: [mu * x[0], L * x[1]]

    def gd_step(lr):
        def step(x, s):
            g = gq(x)
            return [a - lr * b for a, b in zip(x, g)], s
        return step

    def hb_step(lr, beta):
        def step(x, v):
            v = v or [0.0, 0.0]
            g = gq(x)
            v = [beta * vi - lr * gi for vi, gi in zip(v, g)]
            return [a + b for a, b in zip(x, v)], v
        return step

    n1 = count_iters(gd_step(1 / L), [1.0, 1.0], 1e-6)
    n2 = count_iters(gd_step(2 / (L + mu)), [1.0, 1.0], 1e-6)
    sl, sm = math.sqrt(L), math.sqrt(mu)
    n3 = count_iters(hb_step(4 / (sl + sm) ** 2, ((sl - sm) / (sl + sm)) ** 2), [1.0, 1.0], 1e-6)
    assert 1330 <= n1 <= 1350 and 685 <= n2 <= 695 and 85 <= n3 <= 100
    # 뉴턴: x - H^{-1}∇f = 0, 한 번에 최솟점
    x = [1.0, 1.0]
    newton = [x[0] - gq(x)[0] / mu, x[1] - gq(x)[1] / L]
    assert newton == [0.0, 0.0]
    print(f"[OK] 주장 5: 반복 수 GD(1/L) {n1}, GD(2/(L+μ)) {n2}, 헤비볼 {n3}, 뉴턴 1")

    gs = lambda x: [2 * x[0], -2 * x[1]]
    h = gd(gs, [1.0, 0.0], 0.1, 200)
    assert norm(h[-1]) < 1e-15
    h = gd(gs, [1.0, 1e-8], 0.1, 200)
    k_escape = next(k for k, p in enumerate(h) if abs(p[1]) > 1)
    assert 70 <= k_escape <= 110
    print(f"[OK] 주장 6: 안장점 (y가 1을 넘는 걸음 {k_escape})")

    h = gd(lambda x: [2 * (x[0] - 3)], [0.0], 0.25, 3)
    assert [p[0] for p in h] == [0.0, 1.5, 2.25, 2.625]

    def step(w, X, y, lr):
        grad = [0.0] * len(w)
        for xi, yi in zip(X, y):
            err = sum(a * b for a, b in zip(w, xi)) - yi
            for j in range(len(w)):
                grad[j] += 2 * err * xi[j] / len(X)
        return [wj - lr * gj for wj, gj in zip(w, grad)]
    for _ in range(50):
        m, n = rng.randint(2, 6), rng.randint(1, 3)
        X = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(m)]
        y = [rng.uniform(-2, 2) for _ in range(m)]
        w = [rng.uniform(-1, 1) for _ in range(n)]
        mse = lambda v: sum((sum(a * b for a, b in zip(v, xi)) - yi) ** 2 for xi, yi in zip(X, y)) / m
        hstep = 1e-6
        num = [(mse([w[k] + (hstep if k == j else 0) for k in range(n)]) - mse([w[k] - (hstep if k == j else 0) for k in range(n)])) / (2 * hstep) for j in range(n)]
        new = step(w, X, y, 0.1)
        assert all(abs(a - (b - 0.1 * c)) < 1e-6 for a, b, c in zip(new, w, num))
    for lam in (0.5, 2.0, 10.0):
        for eta in (0.1 / lam, 1.9 / lam, 2.1 / lam):
            factor = 1 - eta * lam
            assert (abs(factor) < 1) == (eta < 2 / lam)
    print("[OK] 주장 7: 카드 C1·C2·C3")

    h = gd(lambda p: [2 * p[0], 8 * p[1]], [2.0, 1.0], 0.1, 30)
    assert all(abs(a - b) < 1e-12 for a, b in zip(h[1], [1.6, 0.2]))
    assert all(abs(a - b) < 1e-12 for a, b in zip(h[2], [1.28, 0.04]))
    k01 = next(k for k, p in enumerate(h) if abs(p[0]) < 0.01)
    assert k01 == 24
    fr = lambda w: ((w - 2) ** 2 + (2 * w - 4) ** 2) / 2
    num = (fr(1 + 1e-6) - fr(1 - 1e-6)) / 2e-6
    assert abs(num - 5 * (1 - 2)) < 1e-6
    h = gd(lambda w: [5 * (w[0] - 2)], [0.0], 0.1, 10)
    assert [round(p[0], 12) for p in h[:4]] == [0.0, 1.0, 1.5, 1.75]
    assert abs((2 - h[10][0]) - 2 / 1024) < 1e-12
    h = gd(lambda p: [2 * p[0] + p[1], p[0] + 2 * p[1]], [1.0, 0.0], 1 / 3, 3)
    exp = [[1, 0], [1 / 3, -1 / 3], [2 / 9, -2 / 9], [4 / 27, -4 / 27]]
    assert all(abs(a - b) < 1e-12 for p, q in zip(h, exp) for a, b in zip(p, q))
    assert sorted(round(e, 9) for e in jacobi_eigs([[2.0, 1.0], [1.0, 2.0]])) == [1.0, 3.0]
    h = gd(lambda p: [6 * p[0], 2 * p[1]], [1.0, 1.0], 0.4, 40)
    assert abs(h[1][0] + 1.4) < 1e-12 and abs(h[1][1] - 0.2) < 1e-12 and abs(h[-1][0]) > 1e5
    h = gd(lambda p: [6 * p[0], 2 * p[1]], [1.0, 1.0], 0.25, 3)
    assert all(abs(a - b) < 1e-12 for a, b in zip(h[1], [-0.5, 0.5]))
    print("[OK] 주장 8: 예제 사다리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
