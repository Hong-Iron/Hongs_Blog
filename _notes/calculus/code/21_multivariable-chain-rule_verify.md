---
layout: "note"
title: "21_multivariable-chain-rule_verify.py"
display_title: "21_multivariable-chain-rule_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "공학수학"
parent_url: "/studies/calculus/multivariable-chain-rule/"
parent_title: "다변수 연쇄 법칙과 야코비 행렬"
description: "미분적분학 · 다변수 연쇄 법칙과 야코비 행렬 검증 코드"
permalink: "/studies/calculus/code/21_multivariable-chain-rule_verify/"
---
{% raw %}
[다변수 연쇄 법칙과 야코비 행렬](/Hongs_Blog/studies/calculus/multivariable-chain-rule/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""다변수 연쇄 법칙과 야코비 행렬 검증.

문서: 21.다변수 연쇄 법칙과 야코비 행렬 (예시, 정의, 정리, 증명, 가정, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — z = uv, u = x², v = sin x: 두 길의 합 2x sin x + x² cos x = (x² sin x)', 한 길만 쓰면 틀림.
주장 2: 무작위 합성(R² -> R³ -> R², R³ -> R² -> R¹ 등) — 수치 J_{g∘f} = J_g(f(a)) J_f(a).
주장 3: 선형 근사 — |f(a+h) - f(a) - J h| / |h|가 |h| -> 0에서 0으로(비율이 h에 비례해 줄어듦).
주장 4: 가정 — g = x²y/(x²+y²), f(t) = (t,t): 실제 (g∘f)'(0) = 1/2, 편미분 공식 0.
주장 5: 예제·카드 C4 — 극좌표 야코비와 행렬식 r, 원 운동 속도.
주장 6: 활용 — 층 y = σ(Wx)의 야코비 = diag(σ'(Wx)) W (수치).
주장 7: 카드 C2 — z = x²y, x = cos t, y = sin t: dz/dt = -2cos t sin² t + cos³ t.
"""
import math
import random


def jac(F, a, h=1e-6):
    m = len(F(*a))
    n = len(a)
    J = [[0.0] * n for _ in range(m)]
    for j in range(n):
        p, q = list(a), list(a)
        p[j] += h
        q[j] -= h
        Fp, Fq = F(*p), F(*q)
        for i in range(m):
            J[i][j] = (Fp[i] - Fq[i]) / (2 * h)
    return J


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def main():
    z = lambda x: (x * x) * math.sin(x)
    for x in (0.3, 1.2, -2.0):
        d = (z(x + 1e-6) - z(x - 1e-6)) / 2e-6
        both = 2 * x * math.sin(x) + x * x * math.cos(x)
        one = 2 * x * math.sin(x)
        assert abs(d - both) < 1e-7 and abs(d - one) > 1e-3
    print("[OK] 주장 1·오해: 두 길의 합")

    rng = random.Random(21)
    f = lambda x, y: (x * y, math.sin(x) + y, math.exp(0.3 * x - 0.2 * y))
    g = lambda u, v, w: (u * v + w, math.cos(u) * w)
    fs = lambda x, y, z: (x * y * z, x + z * z)
    gs = lambda u, v: (math.sin(u) * v,)
    for _ in range(100):
        a = (rng.uniform(-1, 1), rng.uniform(-1, 1))
        lhs = jac(lambda x, y: g(*f(x, y)), a)
        rhs = mm(jac(g, f(*a)), jac(f, a))
        assert all(abs(lhs[i][j] - rhs[i][j]) < 1e-6 for i in range(2) for j in range(2))
        b = (rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))
        lhs = jac(lambda x, y, zz: gs(*fs(x, y, zz)), b)
        rhs = mm(jac(gs, fs(*b)), jac(fs, b))
        assert all(abs(lhs[0][j] - rhs[0][j]) < 1e-6 for j in range(3))
    print("[OK] 주장 2·카드 C1·C3: J_{g∘f} = J_g J_f")

    a = (0.4, -0.3)
    J = jac(f, a)
    ratios = []
    for s in (1e-1, 1e-2, 1e-3):
        hvec = (0.6 * s, 0.8 * s)
        Fa, Fh = f(*a), f(a[0] + hvec[0], a[1] + hvec[1])
        lin = [Fa[i] + sum(J[i][j] * hvec[j] for j in range(2)) for i in range(3)]
        err = math.sqrt(sum((Fh[i] - lin[i]) ** 2 for i in range(3)))
        ratios.append(err / s)
    assert ratios[0] > ratios[1] > ratios[2] and ratios[2] < 1e-2
    print("[OK] 주장 3: 선형 근사 오차가 |h|보다 빨리 줄어듦")

    G = lambda x, y: x * x * y / (x * x + y * y) if (x, y) != (0, 0) else 0.0
    for t in (1e-2, 1e-6):
        assert abs(G(t, t) / t - 0.5) < 1e-12
    gx = (G(1e-8, 0) - G(-1e-8, 0)) / 2e-8
    gy = (G(0, 1e-8) - G(0, -1e-8)) / 2e-8
    assert gx * 1 + gy * 1 == 0
    print("[OK] 주장 4: 미분 가능하지 않으면 공식이 틀림(1/2 대 0)")

    P = lambda r, th: (r * math.cos(th), r * math.sin(th))
    for _ in range(100):
        r, th = rng.uniform(0.1, 3), rng.uniform(0, 2 * math.pi)
        Jp = jac(P, (r, th))
        exact = [[math.cos(th), -r * math.sin(th)], [math.sin(th), r * math.cos(th)]]
        assert all(abs(Jp[i][j] - exact[i][j]) < 1e-6 for i in range(2) for j in range(2))
        assert abs(Jp[0][0] * Jp[1][1] - Jp[0][1] * Jp[1][0] - r) < 1e-6
    for t in (0.3, 2.0):
        v = [row[1] for row in jac(P, (2, t))]
        assert abs(v[0] + 2 * math.sin(t)) < 1e-6 and abs(v[1] - 2 * math.cos(t)) < 1e-6
    print("[OK] 주장 5·예제·카드 C4: 극좌표")

    sig = lambda s: 1 / (1 + math.exp(-s))
    W = [[rng.uniform(-1, 1) for _ in range(3)] for _ in range(2)]
    layer = lambda x, y, zz: tuple(sig(sum(W[i][j] * v for j, v in enumerate((x, y, zz)))) for i in range(2))
    x0 = (0.2, -0.5, 0.9)
    s = [sum(W[i][j] * x0[j] for j in range(3)) for i in range(2)]
    D = [[sig(s[i]) * (1 - sig(s[i])) if i == k else 0 for k in range(2)] for i in range(2)]
    exact = mm(D, W)
    num = jac(layer, x0)
    assert all(abs(num[i][j] - exact[i][j]) < 1e-8 for i in range(2) for j in range(3))
    print("[OK] 주장 6: 층의 야코비 diag(σ')W")

    Z = lambda t: math.cos(t) ** 2 * math.sin(t)
    for t in (0.4, 1.7):
        d = (Z(t + 1e-6) - Z(t - 1e-6)) / 2e-6
        assert abs(d - (-2 * math.cos(t) * math.sin(t) ** 2 + math.cos(t) ** 3)) < 1e-8
    print("[OK] 주장 7·카드 C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
