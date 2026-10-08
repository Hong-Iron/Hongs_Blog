---
layout: "note"
title: "09_euler-angles_verify.py"
display_title: "09_euler-angles_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/euler-angles/"
parent_title: "오일러 각과 짐벌 잠금"
description: "수치해석 · 오일러 각과 짐벌 잠금 검증 코드"
permalink: "/studies/numerical-analysis/code/09_euler-angles_verify/"
---
{% raw %}
[오일러 각과 짐벌 잠금](/Hongs_Blog/studies/numerical-analysis/euler-angles/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""오일러 각과 짐벌 잠금 문서의 주장 검증."""
import math, random


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]


def mv(A, v):
    return [sum(A[i][k] * v[k] for k in range(3)) for i in range(3)]


def Rx(t):
    c, s = math.cos(t), math.sin(t); return [[1, 0, 0], [0, c, -s], [0, s, c]]


def Ry(t):
    c, s = math.cos(t), math.sin(t); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]


def Rz(t):
    c, s = math.cos(t), math.sin(t); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]


def diff(A, B):
    return max(abs(A[i][j] - B[i][j]) for i in range(3) for j in range(3))


def main():
    random.seed(9)
    zxz = lambda a, b, c: mm(Rz(c), mm(Rx(b), Rz(a)))         # 슬라이드 p.21: X' = Rz Rx Rz X
    zxy = lambda a, b, c: mm(Ry(c), mm(Rx(b), Rz(a)))         # 슬라이드 p.22: X' = Ry Rx Rz X
    for _ in range(100):
        a, b, c = (random.uniform(-3, 3) for _ in range(3))
        for M in (zxz(a, b, c), zxy(a, b, c)):
            MtM = mm([list(r) for r in zip(*M)], M)
            assert diff(MtM, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) < 1e-12           # 회전 행렬
    # 같은 세 각이라도 순서가 다르면 다른 회전
    assert diff(zxz(0.3, 0.6, 0.9), zxz(0.9, 0.6, 0.3)) > 0.1
    # 짐벌 잠금: X' = Rz(γ) Ry(β) Rx(α) X 에서 β = 90°
    xyz = lambda a, b, g: mm(Rz(g), mm(Ry(b), Rx(a)))
    h = math.pi / 2
    assert all(abs(x - y) < 1e-12 for x, y in zip(mv(Ry(h), [0, 0, 1]), [1, 0, 0]))   # z축이 x축으로
    for _ in range(100):
        a, g, d = (random.uniform(-3, 3) for _ in range(3))
        assert diff(xyz(a, h, g), xyz(a + d, h, g + d)) < 1e-12               # γ − α만 남는다
    # β가 90°가 아니면 그렇지 않다
    assert diff(xyz(0.3, 1.0, 0.5), xyz(0.5, 1.0, 0.7)) > 0.05
    # 카드 C2: α = 10°, γ = 40°는 α = 0°, γ = 30°와 같은 회전
    r = math.radians
    assert diff(xyz(r(10), h, r(40)), xyz(0, h, r(30))) < 1e-12
    # 같은 자세를 나타내는 두 세 각 (ZXZ): (φ, θ, ψ)와 (φ + π, −θ, ψ + π)
    for _ in range(50):
        a, b, c = (random.uniform(-3, 3) for _ in range(3))
        assert diff(zxz(a, b, c), zxz(a + math.pi, -b, c + math.pi)) < 1e-12
    # 그래서 각을 선형 보간하면 같은 두 자세 사이에서 다른 경로가 나온다
    A0 = (0, 0, 0); A1 = (0.2, 0.8, 0.4); A1b = (0.2 + math.pi, -0.8, 0.4 + math.pi)
    mid = lambda p, q: zxz(*[(x + y) / 2 for x, y in zip(p, q)])
    assert diff(zxz(*A1), zxz(*A1b)) < 1e-12 and diff(mid(A0, A1), mid(A0, A1b)) > 0.5
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
