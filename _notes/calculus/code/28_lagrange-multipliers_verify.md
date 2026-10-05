---
layout: "note"
title: "28_lagrange-multipliers_verify.py"
display_title: "28_lagrange-multipliers_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "28"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/lagrange-multipliers/"
parent_title: "라그랑주 승수법"
description: "미분적분학 · 라그랑주 승수법 검증 코드"
permalink: "/studies/calculus/code/28_lagrange-multipliers_verify/"
---
{% raw %}
[라그랑주 승수법](/Hongs_Blog/studies/calculus/lagrange-multipliers/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""라그랑주 승수법 검증.

문서: 28.라그랑주 승수법 (예시, 정리, 증명 스케치, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — x + y = 10 위에서 xy의 최댓값 25는 (5, 5), 그 점에서 ∇f = 5∇g. 최댓값 c²/4의 c 변화율이 λ = 5.
주장 2: 정리 — 무작위 이차함수를 단위원 위에서 최대화(각도 전수)하면 최댓점에서 ∇f와 ∇g가 평행.
주장 3: 가정 ∇g ≠ 0의 필요성 — y² = x³ 위에서 x의 최솟점은 원점인데, 거기서 ∇g = 0이라 ∇f = λ∇g인 λ가 없다.
주장 4: 예제 — 합이 1인 확률 p_1..p_n의 엔트로피 최댓값은 ln n(균등분포), 무작위 분포는 넘지 못함.
주장 5: 예제 — 단위구 위에서 xᵀAx의 최댓값 = A의 최대 고윳값, 최댓점은 고유벡터(무작위 대칭행렬).
주장 6: 카드 C1 — x + 2y = 5 위에서 x² + y²의 최솟점 (1, 2), 최솟값 5, λ = 2. C3 — [[2,1],[1,2]]의 최대 3, 최소 1.
"""
import math
import random


def jacobi(S, sweeps=80):
    n = len(S)
    A = [r[:] for r in S]
    V = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
    for _ in range(sweeps):
        if sum(A[i][j] ** 2 for i in range(n) for j in range(n) if i != j) < 1e-26:
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
                for k in range(n):
                    V[k][p], V[k][q] = c * V[k][p] - s * V[k][q], s * V[k][p] + c * V[k][q]
    return [A[i][i] for i in range(n)], V


def main():
    rng = random.Random(28)
    best = max((x * (10 - x), x) for x in [i / 1000 for i in range(10001)])
    assert abs(best[0] - 25) < 1e-12 and abs(best[1] - 5) < 1e-12
    grad_f, grad_g = (5.0, 5.0), (1.0, 1.0)
    assert grad_f[0] / grad_g[0] == grad_f[1] / grad_g[1] == 5
    M = lambda c: max(x * (c - x) for x in [c * i / 20000 for i in range(20001)])
    rate = (M(10.001) - M(9.999)) / 0.002
    assert abs(rate - 5) < 1e-3
    print("[OK] 주장 1: xy 최대 25, λ = 5 = 최댓값의 변화율")

    for _ in range(200):
        a, b, c, d, e = (rng.uniform(-3, 3) for _ in range(5))
        f = lambda x, y: a * x * x + b * x * y + c * y * y + d * x + e * y
        step = 2 * math.pi / 20000
        th = max((f(math.cos(t), math.sin(t)), t) for t in [step * i for i in range(20000)])[1]
        lo, hi = th - step, th + step            # 격자 한 칸 안에서 삼분 탐색으로 다듬는다
        h = lambda t: f(math.cos(t), math.sin(t))
        for _ in range(200):
            m1, m2 = lo + (hi - lo) / 3, hi - (hi - lo) / 3
            if h(m1) < h(m2):
                lo = m1
            else:
                hi = m2
        th = (lo + hi) / 2
        x, y = math.cos(th), math.sin(th)
        fx, fy = 2 * a * x + b * y + d, b * x + 2 * c * y + e
        gx, gy = 2 * x, 2 * y
        cross = fx * gy - fy * gx
        assert abs(cross) < 1e-6 * (1 + math.hypot(fx, fy))
    print("[OK] 주장 2: 최댓점에서 두 그래디언트가 평행")

    pts = [(t * t, t ** 3) for t in [i / 1000 - 2 for i in range(4001)]]
    xmin = min(pts)
    assert xmin == (0.0, 0.0)
    gx, gy = -3 * 0.0 ** 2, 2 * 0.0
    assert (gx, gy) == (0.0, 0.0) and (1.0, 0.0) != (0.0, 0.0)
    print("[OK] 주장 3: 첨점 반례")

    for n in (2, 3, 5, 10):
        H = lambda p: -sum(q * math.log(q) for q in p if q > 0)
        assert abs(H([1 / n] * n) - math.log(n)) < 1e-12
        for _ in range(500):
            w = [rng.random() for _ in range(n)]
            s = sum(w)
            assert H([t / s for t in w]) <= math.log(n) + 1e-12
    print("[OK] 주장 4: 엔트로피 최대 ln n")

    for _ in range(100):
        n = rng.randint(2, 5)
        S = [[0.0] * n for _ in range(n)]
        for i in range(n):
            for j in range(i, n):
                S[i][j] = S[j][i] = rng.uniform(-2, 2)
        ev, V = jacobi(S)
        k = max(range(n), key=lambda i: ev[i])
        v = [V[i][k] for i in range(n)]
        q = lambda x: sum(x[i] * S[i][j] * x[j] for i in range(n) for j in range(n))
        assert abs(q(v) - ev[k]) < 1e-9
        for _ in range(200):
            x = [rng.gauss(0, 1) for _ in range(n)]
            r = math.sqrt(sum(t * t for t in x))
            assert q([t / r for t in x]) <= ev[k] + 1e-9
    print("[OK] 주장 5: 레일리 몫의 최대 = 최대 고윳값")

    best = min(((5 - 2 * y) ** 2 + y * y, y) for y in [i / 10000 for i in range(-50000, 50001)])
    assert abs(best[0] - 5) < 1e-9 and abs(best[1] - 2) < 1e-9
    x, y = 1.0, 2.0
    lam = 2.0
    assert (2 * x, 2 * y) == (lam * 1, lam * 2) and x + 2 * y == 5   # ∇f = λ∇g, 제약 만족
    S = [[2.0, 1.0], [1.0, 2.0]]
    vals = [2 * math.cos(t) ** 2 + 2 * math.cos(t) * math.sin(t) + 2 * math.sin(t) ** 2 for t in [2 * math.pi * i / 36000 for i in range(36000)]]
    assert abs(max(vals) - 3) < 1e-6 and abs(min(vals) - 1) < 1e-6
    r = 1 / math.sqrt(2)
    assert abs(2 * r * r + 2 * r * r + 2 * r * r - 3) < 1e-12
    print("[OK] 주장 6: 카드 C1·C3")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
