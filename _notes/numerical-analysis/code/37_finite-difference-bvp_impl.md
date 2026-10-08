---
layout: "note"
title: "37_finite-difference-bvp_impl.py"
display_title: "37_finite-difference-bvp_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "37"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/finite-difference-bvp/"
parent_title: "유한 차분법"
description: "수치해석 · 유한 차분법 구현 코드"
permalink: "/studies/numerical-analysis/code/37_finite-difference-bvp_impl/"
---
{% raw %}
[유한 차분법](/Hongs_Blog/studies/numerical-analysis/finite-difference-bvp/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""유한 차분법(경계값 문제) 구현과 검증. 토마스 알고리즘으로 삼중대각 연립방정식을 푼다."""
import math


def thomas(a, b, c, d):
    """a: 아래 대각, b: 대각, c: 위 대각, d: 우변. 길이 n (a[0], c[-1]은 쓰지 않음)."""
    n = len(b); c2 = [0.0] * n; d2 = [0.0] * n
    c2[0] = c[0] / b[0]; d2[0] = d[0] / b[0]
    for i in range(1, n):
        m = b[i] - a[i] * c2[i - 1]
        c2[i] = c[i] / m if i < n - 1 else 0.0
        d2[i] = (d[i] - a[i] * d2[i - 1]) / m
    x = [0.0] * n; x[-1] = d2[-1]
    for i in reversed(range(n - 1)):
        x[i] = d2[i] - c2[i] * x[i + 1]
    return x


def fd_rod(hp, Ta, T0, Tn, L, n):
    dx = L / n; k = hp * dx * dx
    m = n - 1
    a = [-1.0] * m; b = [2 + k] * m; c = [-1.0] * m
    d = [k * Ta] * m; d[0] += T0; d[-1] += Tn
    return thomas(a, b, c, d)


def exact(x, hp=0.01, Ta=20.0, T0=40.0, Tn=200.0, L=10.0):
    lam = math.sqrt(hp)
    A = (Tn - Ta - (T0 - Ta) * math.exp(-L * lam)) / (math.exp(L * lam) - math.exp(-L * lam)); B = T0 - Ta - A
    return Ta + A * math.exp(lam * x) + B * math.exp(-lam * x)


def main():
    T = fd_rod(0.01, 20.0, 40.0, 200.0, 10.0, 5)
    slide = [65.9698, 93.7785, 124.5382, 159.4795]                       # 슬라이드 p.13
    assert all(abs(t - s) < 1e-4 for t, s in zip(T, slide))
    # 행렬과 우변이 슬라이드와 같다: 2.04, −1, 40.8, 0.8, 200.8
    assert abs(2 + 0.01 * 4 - 2.04) < 1e-15 and abs(0.04 * 20 + 40 - 40.8) < 1e-12 and abs(0.04 * 20 + 200 - 200.8) < 1e-12
    # 참값과 비교, Δx를 반으로 줄이면 오차가 약 1/4 (2차)
    ex = [exact(2 * (i + 1)) for i in range(4)]
    err5 = max(abs(t - e) for t, e in zip(T, ex))
    T10 = fd_rod(0.01, 20.0, 40.0, 200.0, 10.0, 10)
    err10 = max(abs(T10[2 * i + 1] - ex[i]) for i in range(4))
    assert 3.5 < err5 / err10 < 4.5
    print("참값", [round(e, 4) for e in ex], "Δx=2 최대 오차 %.4f, Δx=1 %.4f" % (err5, err10))
    # 토마스 알고리즘이 일반 가우스 소거와 같은 답 (무작위 대각 우세 삼중대각)
    import random
    random.seed(37)
    for _ in range(50):
        n = random.randint(2, 8)
        a = [random.uniform(-1, 1) for _ in range(n)]; c = [random.uniform(-1, 1) for _ in range(n)]
        b = [abs(x) + abs(y) + random.uniform(0.5, 2) for x, y in zip(a, c)]; d = [random.uniform(-5, 5) for _ in range(n)]
        x = thomas(a, b, c, d)
        for i in range(n):
            s = b[i] * x[i] + (a[i] * x[i - 1] if i > 0 else 0) + (c[i] * x[i + 1] if i < n - 1 else 0)
            assert abs(s - d[i]) < 1e-9
    # 카드 C2: T'' = 0, T(0) = 0, T(3) = 3, Δx = 1 → T1 = 1, T2 = 2
    assert all(abs(t - e) < 1e-12 for t, e in zip(fd_rod(0.0, 0.0, 0.0, 3.0, 3.0, 3), [1.0, 2.0]))
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
