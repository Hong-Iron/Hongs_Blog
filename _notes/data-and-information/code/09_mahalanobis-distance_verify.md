---
layout: "note"
title: "09_mahalanobis-distance_verify.py"
display_title: "09_mahalanobis-distance_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "자료와 정보"
course_slug: "data-and-information"
course_url: "/studies/data-and-information/"
track: "데이터와 계산"
parent_url: "/studies/data-and-information/mahalanobis-distance/"
parent_title: "마할라노비스 거리"
description: "자료와 정보 · 마할라노비스 거리 검증 코드"
permalink: "/studies/data-and-information/code/09_mahalanobis-distance_verify/"
---
{% raw %}
[마할라노비스 거리](/Hongs_Blog/studies/data-and-information/mahalanobis-distance/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""마할라노비스 거리 문서의 주장 확인 (2차원, 표준 라이브러리만).

문서: 09.마할라노비스 거리
출처: 자료와 정보 4회 슬라이드(강의04-1) p.10~11
주장:
  1. 공분산 행렬이 단위행렬이면 유클리드 거리와 같다.
  2. 대각 행렬이면 좌표마다 표준편차로 나눈 뒤 잰 유클리드 거리다.
     예: 분산 (4, 1), A = (2, 0), B = (0, 2) -> 유클리드는 둘 다 2, 마할라노비스는 1과 2.
  3. 기울어진 예: Sigma = [[5, 4], [4, 5]], A = (1, 1), B = (1, -1) -> 유클리드 둘 다 1.414,
     마할라노비스 0.471과 1.414. 대각선 방향 분산 9, 반대 대각선 방향 분산 1.
  4. 거리의 네 조건을 지킨다 (Sigma가 양의 정부호일 때, 무작위 검사).
  5. 같은 마할라노비스 거리의 점들은 타원 위에 있다.
  6. 자료를 한 방향으로 늘려도(단위를 바꿔도) 마할라노비스 거리는 그대로다.
실행: python3 09_mahalanobis-distance_verify.py
"""
import math
import random


def inv2(S):
    (a, b), (c, d) = S
    det = a * d - b * c
    assert det != 0
    return [[d / det, -b / det], [-c / det, a / det]]


def maha(x, y, S):
    Si = inv2(S)
    v = (x[0] - y[0], x[1] - y[1])
    q = v[0] * (Si[0][0] * v[0] + Si[0][1] * v[1]) + v[1] * (Si[1][0] * v[0] + Si[1][1] * v[1])
    return math.sqrt(q)


def cov(pts):
    n = len(pts)
    mx, my = sum(p[0] for p in pts) / n, sum(p[1] for p in pts) / n
    sxx = sum((p[0] - mx) ** 2 for p in pts) / (n - 1)
    syy = sum((p[1] - my) ** 2 for p in pts) / (n - 1)
    sxy = sum((p[0] - mx) * (p[1] - my) for p in pts) / (n - 1)
    return [[sxx, sxy], [sxy, syy]]


if __name__ == "__main__":
    rng = random.Random(3)
    I = [[1, 0], [0, 1]]
    for _ in range(500):
        x, y = (rng.uniform(-3, 3), rng.uniform(-3, 3)), (rng.uniform(-3, 3), rng.uniform(-3, 3))
        assert abs(maha(x, y, I) - math.dist(x, y)) < 1e-12
        S = [[4, 0], [0, 1]]
        assert abs(maha(x, y, S) - math.hypot((x[0] - y[0]) / 2, (x[1] - y[1]) / 1)) < 1e-12

    O = (0, 0)
    S = [[4, 0], [0, 1]]
    assert math.dist(O, (2, 0)) == math.dist(O, (0, 2)) == 2
    assert maha((2, 0), O, S) == 1 and maha((0, 2), O, S) == 2

    S = [[5, 4], [4, 5]]
    Si = inv2(S)
    assert all(abs(Si[i][j] - [[5 / 9, -4 / 9], [-4 / 9, 5 / 9]][i][j]) < 1e-12 for i in range(2) for j in range(2))
    A, B = (1, 1), (1, -1)
    assert abs(math.dist(O, A) - math.dist(O, B)) < 1e-12 and round(math.dist(O, A), 3) == 1.414
    assert abs(maha(A, O, S) ** 2 - 2 / 9) < 1e-12 and abs(maha(B, O, S) ** 2 - 2) < 1e-12
    assert round(maha(A, O, S), 3) == 0.471 and round(maha(B, O, S), 3) == 1.414
    # 방향별 분산: u = (1,1)/sqrt2 방향 u^T S u = 9, v = (1,-1)/sqrt2 방향 1
    q = lambda u: u[0] * (S[0][0] * u[0] + S[0][1] * u[1]) + u[1] * (S[1][0] * u[0] + S[1][1] * u[1])
    r2 = math.sqrt(2)
    assert abs(q((1 / r2, 1 / r2)) - 9) < 1e-12 and abs(q((1 / r2, -1 / r2)) - 1) < 1e-12
    # 그 방향의 표준편차로 나눈 값과 같다: sqrt2 / 3, sqrt2 / 1
    assert abs(maha(A, O, S) - r2 / 3) < 1e-12 and abs(maha(B, O, S) - r2 / 1) < 1e-12
    # 타원: 거리 1인 점들 -> 대각선 방향으로 3, 반대 방향으로 1
    assert abs(maha((3 / r2, 3 / r2), O, S) - 1) < 1e-12 and abs(maha((1 / r2, -1 / r2), O, S) - 1) < 1e-12

    # 4. 네 조건
    for _ in range(2000):
        a, b = rng.uniform(0.5, 4), rng.uniform(0.5, 4)
        c = rng.uniform(-0.9, 0.9) * math.sqrt(a * b)
        S = [[a, c], [c, b]]
        x, y, z = [(rng.uniform(-3, 3), rng.uniform(-3, 3)) for _ in range(3)]
        assert maha(x, y, S) > 0 and maha(x, x, S) == 0
        assert abs(maha(x, y, S) - maha(y, x, S)) < 1e-12
        assert maha(x, z, S) <= maha(x, y, S) + maha(y, z, S) + 1e-9

    # 6. 단위를 바꿔도 그대로 (첫 좌표를 100배: m -> cm)
    pts = [(rng.gauss(0, 1), 0) for _ in range(300)]
    pts = [(p[0], 0.6 * p[0] + rng.gauss(0, 0.5)) for p in pts]
    S1 = cov(pts)
    pts2 = [(100 * p[0], p[1]) for p in pts]
    S2 = cov(pts2)
    for i in range(0, 300, 7):
        d1 = maha(pts[i], pts[(i + 1) % 300], S1)
        d2 = maha(pts2[i], pts2[(i + 1) % 300], S2)
        assert abs(d1 - d2) < 1e-6
        e1, e2 = math.dist(pts[i], pts[(i + 1) % 300]), math.dist(pts2[i], pts2[(i + 1) % 300])
    # 카드: Sigma = [[9, 0], [0, 1]], P = (3, 0), Q = (0, 2)
    S = [[9, 0], [0, 1]]
    assert maha((3, 0), O, S) == 1 and maha((0, 2), O, S) == 2 and math.dist(O, (3, 0)) > math.dist(O, (0, 2))
    print("ALL CHECKS PASSED")
```
{% endraw %}
