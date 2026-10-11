---
layout: "note"
title: "27_convexity_verify.py"
display_title: "27_convexity_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "27"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/convexity/"
parent_title: "볼록 함수와 볼록 최적화"
description: "미분적분학 · 볼록 함수와 볼록 최적화 검증 코드"
permalink: "/studies/calculus/code/27_convexity_verify/"
---
{% raw %}
[볼록 함수와 볼록 최적화](/Hongs_Blog/studies/calculus/convexity/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""볼록 함수와 볼록 최적화 검증.

문서: 27.볼록 함수와 볼록 최적화 (예시, 정의, 정리, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 예시·카드 C3 — 현(chord) 부등식을 무작위로 검사: x², e^x, |x|, max(x, 0), -ln x(x > 0)는 볼록,
        x³, sin x, ln x는 위반 사례가 있다. x²에서 0과 2의 중점 값 1 <= 평균 2.
주장 2: 동치 조건 — 볼록 이차함수·log-sum-exp에서 접선 부등식 f(y) >= f(x) + ∇f(x)·(y - x)와 헤세 준정부호가 성립,
        비볼록 함수에서는 접선 부등식 위반을 찾는다.
주장 3: 정리 — 볼록 함수에서 경사 하강법은 여러 시작점에서 같은 최솟값에 도착한다.
주장 4: 예제 — x⁴ - 3x² + x의 두 지역 최솟점: 시작점 2와 -2에서 다른 곳에 멈추고 값이 다르다.
주장 5: 볼록성 보존 — ||Ax - b||², 로지스틱 손실의 헤세가 준정부호(무작위), 힌지 손실의 현 부등식,
        곱은 보존되지 않음: x²(x - 1)²은 x = 1/2에서 현 부등식 위반.
주장 6: 카드 C1 — x² + xy + y²의 헤세 고윳값 3, 1. 순볼록이 아니면 최솟점이 여럿: x²의 최솟점은 직선 x = 0 전체.
"""
import math
import random


def chord_ok(f, a, b, rng, trials=4000):
    for _ in range(trials):
        x, y, t = rng.uniform(a, b), rng.uniform(a, b), rng.random()
        if f(t * x + (1 - t) * y) > t * f(x) + (1 - t) * f(y) + 1e-12 * (1 + abs(f(x)) + abs(f(y))):
            return False
    return True


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


def gd1(fp, x, lr, steps):
    for _ in range(steps):
        x -= lr * fp(x)
    return x


def main():
    rng = random.Random(27)
    convex = [(lambda x: x * x, -5, 5), (math.exp, -5, 5), (abs, -5, 5), (lambda x: max(x, 0.0), -5, 5),
              (lambda x: -math.log(x), 0.01, 10)]
    nonconvex = [(lambda x: x ** 3, -5, 5), (math.sin, -5, 5), (math.log, 0.01, 10)]
    assert all(chord_ok(f, a, b, rng) for f, a, b in convex)
    assert not any(chord_ok(f, a, b, rng) for f, a, b in nonconvex)
    assert (1.0 ** 2) <= (0 ** 2 + 2 ** 2) / 2
    print("[OK] 주장 1·카드 C3: 현 부등식")

    for _ in range(100):
        n = rng.randint(1, 4)
        M = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(n)]
        A = [[sum(M[k][i] * M[k][j] for k in range(n)) for j in range(n)] for i in range(n)]
        f = lambda x: sum(x[i] * A[i][j] * x[j] for i in range(n) for j in range(n))
        g = lambda x: [2 * sum(A[i][j] * x[j] for j in range(n)) for i in range(n)]
        assert min(jacobi_eigs(A)) > -1e-9
        lse = lambda x: math.log(sum(math.exp(t) for t in x))
        lse_g = lambda x: [math.exp(t) / sum(math.exp(s) for s in x) for t in x]
        for _ in range(20):
            x = [rng.uniform(-3, 3) for _ in range(n)]
            y = [rng.uniform(-3, 3) for _ in range(n)]
            assert f(y) >= f(x) + sum(p * (q - r) for p, q, r in zip(g(x), y, x)) - 1e-9
            assert lse(y) >= lse(x) + sum(p * (q - r) for p, q, r in zip(lse_g(x), y, x)) - 1e-12
    viol = 0
    for _ in range(200):
        x, y = rng.uniform(-3, 3), rng.uniform(-3, 3)
        if y ** 3 < x ** 3 + 3 * x * x * (y - x) - 1e-9:
            viol += 1
    assert viol > 0
    print("[OK] 주장 2: 접선 부등식과 헤세")

    f = lambda x: (x - 1.5) ** 2 + math.log(1 + math.exp(x))
    fp = lambda x: 2 * (x - 1.5) + 1 / (1 + math.exp(-x))
    ends = [gd1(fp, x0, 0.2, 500) for x0 in (-10.0, -1.0, 0.0, 3.0, 20.0)]
    assert max(ends) - min(ends) < 1e-9
    print("[OK] 주장 3: 볼록 함수는 시작점과 무관")

    q = lambda x: x ** 4 - 3 * x * x + x
    qp = lambda x: 4 * x ** 3 - 6 * x + 1
    r_pos = gd1(qp, 2.0, 0.01, 5000)
    r_neg = gd1(qp, -2.0, 0.01, 5000)
    assert abs(qp(r_pos)) < 1e-9 and abs(qp(r_neg)) < 1e-9
    assert 12 * r_pos ** 2 - 6 > 0 and 12 * r_neg ** 2 - 6 > 0
    assert abs(r_pos - 1.13) < 0.01 and abs(r_neg + 1.30) < 0.01
    assert abs(q(r_pos) + 1.07) < 0.01 and abs(q(r_neg) + 3.51) < 0.01
    print(f"[OK] 주장 4: x⁴-3x²+x 지역 최소 {r_pos:.4f}({q(r_pos):.4f}), 전역 최소 {r_neg:.4f}({q(r_neg):.4f})")

    sig = lambda s: 1 / (1 + math.exp(-s))
    for _ in range(100):
        m, n = rng.randint(2, 6), rng.randint(1, 4)
        X = [[rng.uniform(-2, 2) for _ in range(n)] for _ in range(m)]
        w = [rng.uniform(-2, 2) for _ in range(n)]
        p = [sig(sum(a * b for a, b in zip(r, w))) for r in X]
        H = [[sum(p[k] * (1 - p[k]) * X[k][i] * X[k][j] for k in range(m)) for j in range(n)] for i in range(n)]
        assert min(jacobi_eigs(H)) > -1e-9
        H2 = [[2 * sum(X[k][i] * X[k][j] for k in range(m)) for j in range(n)] for i in range(n)]
        assert min(jacobi_eigs(H2)) > -1e-9
    assert chord_ok(lambda w: max(0.0, 1 - 0.8 * w), -5, 5, rng)
    prod = lambda x: x * x * (x - 1) ** 2
    assert prod(0.5) > (prod(0) + prod(1)) / 2 and prod(0.5) == 0.0625
    print("[OK] 주장 5: 볼록성 보존과 곱의 반례")

    ev = sorted(round(e, 9) for e in jacobi_eigs([[2.0, 1.0], [1.0, 2.0]]))
    assert ev == [1.0, 3.0]
    assert all((lambda x, y: x * x)(0.0, y) == 0.0 for y in (-3, 0, 5))
    print("[OK] 주장 6·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
