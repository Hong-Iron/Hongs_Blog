---
layout: "note"
title: "36_pca_verify.py"
display_title: "36_pca_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "36"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "공학수학"
parent_url: "/studies/probability-statistics/pca/"
parent_title: "주성분 분석"
description: "확률과 통계 · 주성분 분석 검증 코드"
permalink: "/studies/probability-statistics/code/36_pca_verify/"
---
{% raw %}
[주성분 분석](/Hongs_Blog/studies/probability-statistics/pca/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""주성분 분석 검증.

문서: 36.주성분 분석, 4.연습문제/36.주성분 분석 예제 사다리
주장 1: 예시 — 공분산 [[4, 2], [2, 3]]의 첫 주성분 고윳값 ≈ 5.56, 설명 비율 ≈ 79.5%(표본 20만 개에서도).
주장 2: 정리 — 무작위 자료에서 첫 주성분 방향의 분산이 모든 단위 방향의 분산 이상(방향 전수), 주성분 점수끼리 무상관,
        설명 비율의 합 1, 가운데로 옮긴 자료 행렬의 오른쪽 특이벡터와 같다(공분산 = XᵀX/n).
주장 3: 오해 — 두 부류가 분산이 작은 축으로만 갈리면 첫 주성분에 투영했을 때 부류가 섞인다.
주장 4: 표준화 — 한 변수의 단위를 1000배 하면 첫 주성분이 그 변수로 쏠린다(표준화하면 사라짐).
주장 5: 사다리 — 점 (2,1), (-2,-1), (1,2), (-1,-2): 공분산 [[2.5, 2], [2, 2.5]], 고윳값 4.5·0.5, 첫 방향 (1,1)/√2, 90%,
        (2,1)의 점수 3/√2 ≈ 2.121. 점 (1,1)..(4,4)는 100%. 공분산 [[2,1],[1,2]]는 75%.
"""
import math
import random


def eig2(S):
    a, b, c = S[0][0], S[0][1], S[1][1]
    tr, det = a + c, a * c - b * b
    disc = math.sqrt(tr * tr / 4 - det)
    l1, l2 = tr / 2 + disc, tr / 2 - disc
    v = (b, l1 - a) if abs(b) > 1e-15 else ((1.0, 0.0) if a >= c else (0.0, 1.0))
    nv = math.hypot(*v)
    return l1, l2, (v[0] / nv, v[1] / nv)


def cov(pts):
    n = len(pts)
    m = [sum(p[i] for p in pts) / n for i in range(2)]
    return [[sum((p[i] - m[i]) * (p[j] - m[j]) for p in pts) / n for j in range(2)] for i in range(2)], m


def main():
    l1, l2, v = eig2([[4.0, 2.0], [2.0, 3.0]])
    assert abs(l1 - 5.5616) < 1e-4 and abs(l1 / 7 - 0.795) < 1e-3
    rng = random.Random(36)
    L = [[2.0, 0.0], [1.0, math.sqrt(2)]]
    pts = []
    for _ in range(200000):
        z = (rng.gauss(0, 1), rng.gauss(0, 1))
        pts.append((L[0][0] * z[0], L[1][0] * z[0] + L[1][1] * z[1]))
    S, _ = cov(pts)
    s1, s2, _ = eig2(S)
    assert abs(s1 / (s1 + s2) - 0.795) < 0.005
    print("[OK] 주장 1: 설명 비율 79.5%")

    for _ in range(50):
        a = rng.uniform(0.2, 3)
        th = rng.uniform(0, math.pi)
        pts = []
        for _ in range(300):
            u, w = rng.gauss(0, a), rng.gauss(0, 1)
            pts.append((math.cos(th) * u - math.sin(th) * w + 5, math.sin(th) * u + math.cos(th) * w - 2))
        S, m = cov(pts)
        l1, l2, v = eig2(S)
        var_dir = lambda d: sum(((p[0] - m[0]) * d[0] + (p[1] - m[1]) * d[1]) ** 2 for p in pts) / len(pts)
        assert abs(var_dir(v) - l1) < 1e-8 * (1 + l1)
        for k in range(180):
            ang = math.pi * k / 180
            assert var_dir((math.cos(ang), math.sin(ang))) <= l1 + 1e-9
        w2 = (-v[1], v[0])
        sc1 = [(p[0] - m[0]) * v[0] + (p[1] - m[1]) * v[1] for p in pts]
        sc2 = [(p[0] - m[0]) * w2[0] + (p[1] - m[1]) * w2[1] for p in pts]
        assert abs(sum(x * y for x, y in zip(sc1, sc2)) / len(pts)) < 1e-8 * (1 + l1)
        assert abs(l1 / (l1 + l2) + l2 / (l1 + l2) - 1) < 1e-12
        # 오른쪽 특이벡터: XᵀX v = n λ v
        XtX = [[sum((p[i] - m[i]) * (p[j] - m[j]) for p in pts) for j in range(2)] for i in range(2)]
        Xv = [XtX[0][0] * v[0] + XtX[0][1] * v[1], XtX[1][0] * v[0] + XtX[1][1] * v[1]]
        assert abs(Xv[0] - len(pts) * l1 * v[0]) < 1e-6 * len(pts) * (1 + l1) and abs(Xv[1] - len(pts) * l1 * v[1]) < 1e-6 * len(pts) * (1 + l1)
    print("[OK] 주장 2: 최대 분산, 무상관 점수, SVD와 일치")

    pts, lab = [], []
    for _ in range(2000):
        c = rng.random() < 0.5
        pts.append((rng.gauss(0, 5), rng.gauss(1 if c else -1, 0.3)))
        lab.append(c)
    S, m = cov(pts)
    _, _, v = eig2(S)
    proj = [(p[0] - m[0]) * v[0] + (p[1] - m[1]) * v[1] for p in pts]
    acc_pc1 = sum(1 for s, c in zip(proj, lab) if (s > 0) == c) / len(pts)
    acc_pc2 = sum(1 for p, c in zip(pts, lab) if (p[1] > 0) == c) / len(pts)
    assert abs(v[0]) > 0.99 and 0.4 < acc_pc1 < 0.6 and acc_pc2 > 0.99
    print(f"[OK] 주장 3: 첫 주성분으로 가른 정확도 {acc_pc1:.2f}, 둘째 축 {acc_pc2:.2f}")

    pts = []
    for _ in range(5000):
        z = rng.gauss(0, 1)
        pts.append((z + rng.gauss(0, 0.5), z + rng.gauss(0, 0.5)))
    _, _, v = eig2(cov(pts)[0])
    assert abs(abs(v[0]) - abs(v[1])) < 0.1
    scaled = [(1000 * a, b) for a, b in pts]
    _, _, v2 = eig2(cov(scaled)[0])
    assert abs(v2[0]) > 0.999
    sd = [math.sqrt(cov(scaled)[0][i][i]) for i in range(2)]
    std = [(a / sd[0], b / sd[1]) for a, b in scaled]
    _, _, v3 = eig2(cov(std)[0])
    assert abs(abs(v3[0]) - abs(v3[1])) < 0.1
    print("[OK] 주장 4: 단위와 표준화")

    pts = [(2, 1), (-2, -1), (1, 2), (-1, -2)]
    S, m = cov(pts)
    assert S == [[2.5, 2.0], [2.0, 2.5]] and m == [0.0, 0.0]
    l1, l2, v = eig2(S)
    assert abs(l1 - 4.5) < 1e-12 and abs(l2 - 0.5) < 1e-12 and abs(v[0] - v[1]) < 1e-12 and abs(l1 / (l1 + l2) - 0.9) < 1e-12
    assert abs((2 * v[0] + 1 * v[1]) - 3 / math.sqrt(2)) < 1e-12 and abs(3 / math.sqrt(2) - 2.121) < 1e-3
    S3, m3 = cov([(1, 1), (2, 2), (3, 3), (4, 4)])
    l1, l2, _ = eig2(S3)
    assert m3 == [2.5, 2.5] and S3 == [[1.25, 1.25], [1.25, 1.25]] and abs(l1 - 2.5) < 1e-12 and abs(l2) < 1e-12
    S4, _ = cov([(2, 0), (0, 2), (-2, 0), (0, -2)])
    assert S4 == [[2.0, 0.0], [0.0, 2.0]]        # 변형: 모든 방향의 분산이 같다
    l1, l2, v = eig2([[2.0, 1.0], [1.0, 2.0]])
    assert abs(l1 / (l1 + l2) - 0.75) < 1e-12
    assert abs((3 + 1) / math.sqrt(2) - 2.83) < 0.005   # 카드 C3
    print("[OK] 주장 5: 예제 사다리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
