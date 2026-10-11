---
layout: "note"
title: "23_hessian_verify.py"
display_title: "23_hessian_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "23"
course: "미분적분학"
course_slug: "calculus"
course_url: "/studies/calculus/"
track: "수학"
parent_url: "/studies/calculus/hessian/"
parent_title: "헤세 행렬과 극값 판정"
description: "미분적분학 · 헤세 행렬과 극값 판정 검증 코드"
permalink: "/studies/calculus/code/23_hessian_verify/"
---
{% raw %}
[헤세 행렬과 극값 판정](/Hongs_Blog/studies/calculus/hessian/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""헤세 행렬과 극값 판정 검증.

문서: 23.헤세 행렬과 극값 판정 (예시, 정의, 판정, 증명, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — x²+y², -x²-y², x²-y²의 수치 헤세와 원점 주변 무작위 점 비교(극소, 극대, 안장).
주장 2: 예제·카드 C1 — x³ - 3x + y²: 임계점 (±1, 0), (1,0) 극소(값 -2), (-1,0) 안장점(주변 비교).
주장 3: D 판정 = 고윳값 판정 — 무작위 2차식 a x² + b xy + c y²(원점 임계점)에서 분류가 일치하고 주변 값과 맞다.
주장 4: 판정 불가(카드 C2) — x⁴+y⁴, x⁴-y⁴의 원점 헤세 = 0, 하나는 극소, 하나는 안장점.
주장 5: 활용 — 무작위 대칭 행렬(n = 1..8)에서 모든 고윳값이 같은 부호일 비율이 n이 커질수록 작아진다.
"""
import math
import random


def hess(f, p, h=1e-4):
    n = len(p)
    H = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            def ev(di, dj):
                q = list(p)
                q[i] += di
                q[j] += dj
                return f(*q)
            H[i][j] = (ev(h, h) - ev(h, -h) - ev(-h, h) + ev(-h, -h)) / (4 * h * h)
    return H


def classify2(H):
    a, b, c = H[0][0], H[0][1], H[1][1]
    D = a * c - b * b
    if D > 1e-9:
        return "min" if a > 0 else "max"
    if D < -1e-9:
        return "saddle"
    return "?"


def around(f, p, rng, r=1e-2, k=300):
    base = f(*p)
    up = dn = 0
    for _ in range(k):
        th = rng.uniform(0, 2 * math.pi)
        s = rng.uniform(0.2, 1) * r
        v = f(p[0] + s * math.cos(th), p[1] + s * math.sin(th)) - base
        up += v > 0
        dn += v < 0
    return up, dn


def jacobi_eigs(S, sweeps=60):
    n = len(S)
    A = [r[:] for r in S]
    for _ in range(sweeps):
        if sum(A[i][j] ** 2 for i in range(n) for j in range(n) if i != j) < 1e-20:
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


def main():
    rng = random.Random(23)
    fs = [(lambda x, y: x * x + y * y, "min"), (lambda x, y: -x * x - y * y, "max"), (lambda x, y: x * x - y * y, "saddle")]
    for f, kind in fs:
        H = hess(f, (0.0, 0.0))
        assert classify2(H) == kind
        up, dn = around(f, (0.0, 0.0), rng)
        assert (kind == "min" and dn == 0) or (kind == "max" and up == 0) or (kind == "saddle" and up > 0 and dn > 0)
    print("[OK] 주장 1: 예시 세 함수")

    f = lambda x, y: x ** 3 - 3 * x + y * y
    for p in ((1.0, 0.0), (-1.0, 0.0)):
        gx = 3 * p[0] ** 2 - 3
        assert abs(gx) < 1e-12 and p[1] == 0
    H1, H2 = hess(f, (1.0, 0.0)), hess(f, (-1.0, 0.0))
    assert abs(H1[0][0] - 6) < 1e-4 and abs(H2[0][0] + 6) < 1e-4 and abs(H1[1][1] - 2) < 1e-4
    assert classify2(H1) == "min" and classify2(H2) == "saddle" and f(1, 0) == -2
    up, dn = around(f, (1.0, 0.0), rng)
    assert dn == 0
    up, dn = around(f, (-1.0, 0.0), rng)
    assert up > 0 and dn > 0
    print("[OK] 주장 2·예제·카드 C1·C3")

    for _ in range(500):
        a, b, c = (rng.uniform(-3, 3) for _ in range(3))
        q = lambda x, y, a=a, b=b, c=c: a * x * x + b * x * y + c * y * y
        H = [[2 * a, b], [b, 2 * c]]
        tr, det = 2 * a + 2 * c, 4 * a * c - b * b
        disc = math.sqrt(max(tr * tr - 4 * det, 0))
        l1, l2 = (tr + disc) / 2, (tr - disc) / 2
        if min(abs(l1), abs(l2)) < 1e-3:
            continue
        kind_eig = "min" if l2 > 0 else "max" if l1 < 0 else "saddle"
        assert classify2(H) == kind_eig
        up, dn = around(q, (0.0, 0.0), rng, 1.0, 200)
        assert (kind_eig == "min" and dn == 0) or (kind_eig == "max" and up == 0) or (kind_eig == "saddle" and up > 0 and dn > 0)
    print("[OK] 주장 3: D 판정 = 고윳값 판정")

    f1 = lambda x, y: x ** 4 + y ** 4
    f2 = lambda x, y: x ** 4 - y ** 4
    for g in (f1, f2):
        H = hess(g, (0.0, 0.0), 1e-3)
        assert all(abs(H[i][j]) < 1e-5 for i in range(2) for j in range(2))
    assert around(f1, (0.0, 0.0), rng)[1] == 0
    u2, d2 = around(f2, (0.0, 0.0), rng)
    assert u2 > 0 and d2 > 0
    print("[OK] 주장 4·카드 C2: 판정 불가")

    fracs = []
    for n in (1, 2, 4, 8):
        same = 0
        trials = 400
        for _ in range(trials):
            S = [[0.0] * n for _ in range(n)]
            for i in range(n):
                for j in range(i, n):
                    S[i][j] = S[j][i] = rng.gauss(0, 1)
            ev = jacobi_eigs(S)
            same += all(e > 0 for e in ev) or all(e < 0 for e in ev)
        fracs.append(same / trials)
    assert fracs[0] == 1.0 and fracs[1] < 0.5 and fracs[1] >= fracs[2] >= fracs[3] and fracs[3] < 0.02
    print(f"[OK] 주장 5: 한 부호 비율 {fracs}")
    # 수치해석(2-2) 과목별 관점: 중심 차분 근사, 카드 C4
    fd = lambda x, y: x * x * y
    dd = 0.1
    mixed = (fd(1 + dd, 1 + dd) - fd(1 + dd, 1 - dd) - fd(1 - dd, 1 + dd) + fd(1 - dd, 1 - dd)) / (4 * dd * dd)
    assert abs(mixed - 2) < 1e-9
    fxx = (fd(1 + dd, 1) - 2 * fd(1, 1) + fd(1 - dd, 1)) / dd ** 2
    fx = (fd(1 + dd, 1) - fd(1 - dd, 1)) / (2 * dd)
    assert abs(fxx - 2) < 1e-9 and abs(fx - 2) < 1e-9
    # 안장점 예 f = xy: x, y 방향으로는 평평하지만 대각선 방향으로 오르내림
    fs_ = lambda x, y: x * y
    assert fs_(0.5, 0) == fs_(0, 0.5) == 0 and fs_(0.5, 0.5) > 0 and fs_(0.5, -0.5) < 0
    assert 0 * 0 - 1 ** 2 < 0                                                # |H| = −1 < 0
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
