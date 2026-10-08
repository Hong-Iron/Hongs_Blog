---
layout: "note"
title: "19_bounding-volume_verify.py"
display_title: "19_bounding-volume_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "19"
course: "수치해석"
course_slug: "numerical-analysis"
course_url: "/studies/numerical-analysis/"
track: "수학"
parent_url: "/studies/numerical-analysis/bounding-volume/"
parent_title: "경계 볼륨"
description: "수치해석 · 경계 볼륨 검증 코드"
permalink: "/studies/numerical-analysis/code/19_bounding-volume_verify/"
---
{% raw %}
[경계 볼륨](/Hongs_Blog/studies/numerical-analysis/bounding-volume/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""경계 볼륨 문서의 주장 검증. 고유분해는 야코비 회전법(numpy 없이)."""
import math, random
from fractions import Fraction as F


def jacobi(A, iters=100):
    n = len(A); A = [list(map(float, r)) for r in A]; V = [[float(i == j) for j in range(n)] for i in range(n)]
    for _ in range(iters):
        p, q = max(((i, j) for i in range(n) for j in range(i + 1, n)), key=lambda t: abs(A[t[0]][t[1]]))
        if abs(A[p][q]) < 1e-15:
            break
        th = 0.5 * math.atan2(2 * A[p][q], A[q][q] - A[p][p]); c, s = math.cos(th), math.sin(th)
        for k in range(n):
            akp, akq = A[k][p], A[k][q]; A[k][p], A[k][q] = c * akp - s * akq, s * akp + c * akq
        for k in range(n):
            apk, aqk = A[p][k], A[q][k]; A[p][k], A[q][k] = c * apk - s * aqk, s * apk + c * aqk
        for k in range(n):
            vkp, vkq = V[k][p], V[k][q]; V[k][p], V[k][q] = c * vkp - s * vkq, s * vkp + c * vkq
    pairs = sorted(((A[i][i], [V[k][i] for k in range(n)]) for i in range(n)), key=lambda t: -t[0])
    return [p[0] for p in pairs], [p[1] for p in pairs]


def mean_cov(P):
    N = len(P); d = len(P[0])
    m = [sum(F(p[k]) for p in P) / N for k in range(d)]
    C = [[sum((p[i] - m[i]) * (p[j] - m[j]) for p in P) / N for j in range(d)] for i in range(d)]
    return m, C


def box(P, axes):
    """각 축으로 사영한 최솟값·최댓값과 부피."""
    ext = []
    for a in axes:
        s = [sum(x * y for x, y in zip(p, a)) for p in P]
        ext.append((min(s), max(s)))
    return ext, math.prod(hi - lo for lo, hi in ext)


def main():
    P = [(-1, -2, 1), (1, 0, 2), (2, -1, 3), (2, -1, 2)]                         # 슬라이드 p.10
    m, C = mean_cov(P)
    assert m == [1, -1, 2]
    assert C == [[F(3, 2), F(1, 2), F(3, 4)], [F(1, 2), F(1, 2), F(1, 4)], [F(3, 4), F(1, 4), F(1, 2)]]
    # 특성다항식 −λ³ + (5/2)λ² − (7/8)λ + 1/16 (슬라이드 p.11)
    det3 = lambda M: (M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
                      + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]))
    for lam in (F(0), F(1), F(2), F(-1), F(1, 3)):
        Cl = [[C[i][j] - (lam if i == j else 0) for j in range(3)] for i in range(3)]
        assert det3(Cl) == -lam ** 3 + F(5, 2) * lam ** 2 - F(7, 8) * lam + F(1, 16)
    vals, vecs = jacobi(C)
    assert all(abs(v - s) < 5e-4 for v, s in zip(vals, [2.097, 0.3055, 0.09756]))
    slide = [(-0.833, -0.330, -0.443), (-0.257, 0.941, -0.218), (0.489, -0.0675, -0.870)]
    for v, s in zip(vecs, slide):
        sign = 1 if sum(a * b for a, b in zip(v, s)) > 0 else -1
        assert all(abs(sign * a - b) < 2e-3 for a, b in zip(v, s))
    # A의 행이 고유벡터이면 ACA^T는 대각
    A = vecs
    Cf = [[float(x) for x in r] for r in C]
    ACA = [[sum(A[i][k] * Cf[k][l] * A[j][l] for k in range(3) for l in range(3)) for j in range(3)] for i in range(3)]
    assert all(abs(ACA[i][j]) < 1e-9 for i in range(3) for j in range(3) if i != j)
    ext, vol = box(P, A)
    _, vol_aabb = box(P, [(1, 0, 0), (0, 1, 0), (0, 0, 1)])
    print("슬라이드 예 OBB 폭", [round(hi - lo, 3) for lo, hi in ext], "부피", round(vol, 3), "AABB 부피", vol_aabb)
    # 비스듬히 길쭉한 점 구름: OBB가 AABB보다 훨씬 작다
    random.seed(19)
    th = math.radians(35)
    cloud = []
    for _ in range(400):
        a, b, c = random.uniform(-5, 5), random.uniform(-0.5, 0.5), random.uniform(-0.5, 0.5)
        cloud.append((a * math.cos(th) - b * math.sin(th), a * math.sin(th) + b * math.cos(th), c))
    m2, C2 = mean_cov(cloud)
    _, axes = jacobi(C2)
    assert abs(abs(axes[0][0]) - math.cos(th)) < 0.02 and abs(abs(axes[0][1]) - math.sin(th)) < 0.02
    _, vo = box(cloud, axes); _, va = box(cloud, [(1, 0, 0), (0, 1, 0), (0, 0, 1)])
    assert vo < 0.5 * va
    print("길쭉한 구름 OBB/AABB 부피", round(vo, 2), round(va, 2))
    # 카드 C2: 2차원 점 (0,0), (2,2), (4,4)의 첫 주성분 방향은 (1,1)/√2
    m3, C3 = mean_cov([(0, 0), (2, 2), (4, 4)])
    assert C3 == [[F(8, 3), F(8, 3)], [F(8, 3), F(8, 3)]]
    v3, a3 = jacobi(C3)
    assert abs(abs(a3[0][0]) - 1 / math.sqrt(2)) < 1e-12 and abs(v3[0] - 16 / 3) < 1e-12 and abs(v3[1]) < 1e-12
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
