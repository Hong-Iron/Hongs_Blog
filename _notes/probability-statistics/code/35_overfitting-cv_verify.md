---
layout: "note"
title: "35_overfitting-cv_verify.py"
display_title: "35_overfitting-cv_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "35"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/overfitting-cv/"
parent_title: "과적합과 교차검증"
description: "확률과 통계 · 과적합과 교차검증 검증 코드"
permalink: "/studies/probability-statistics/code/35_overfitting-cv_verify/"
---
{% raw %}
[과적합과 교차검증](/Hongs_Blog/studies/probability-statistics/overfitting-cv/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""과적합과 교차검증 검증.

문서: 35.과적합과 교차검증 (예시, 정의, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — sin(2πx) + 잡음(σ = 0.3)의 훈련점 10개(x = 0.05, 0.15, ..., 0.95)에 다항식 차수 0~9를 맞추면
        훈련 오차는 차수와 함께 줄어 9차에서 0, 시험 오차(새 점 2,000개)는 3차에서 가장 작고(약 0.129) 9차에서 약 0.544.
주장 2: 예제 — 5겹 교차검증 오차가 가장 작은 차수가 3(시험 오차가 가장 작은 차수와 같다).
주장 3: 잡음의 바닥 — 어떤 차수도 시험 오차가 잡음 분산 0.09보다 작지 않다.
주장 4: 카드 C1 — 차수를 올리면 모델 집합이 커져(이전 차수를 포함) 훈련 오차가 늘 수 없다.
"""
from fractions import Fraction as Fr
import math
import random


def fit(data, d):
    X = [[Fr(x) ** k for k in range(d + 1)] for x, _ in data]
    Y = [Fr(y) for _, y in data]
    n = d + 1
    M = [[sum(r[i] * r[j] for r in X) for j in range(n)] + [sum(r[i] * y for r, y in zip(X, Y))] for i in range(n)]
    for k in range(n):
        p = next(i for i in range(k, n) if M[i][k] != 0)
        M[k], M[p] = M[p], M[k]
        for i in range(k + 1, n):
            f = M[i][k] / M[k][k]
            M[i] = [a - f * c for a, c in zip(M[i], M[k])]
    c = [Fr(0)] * n
    for i in range(n - 1, -1, -1):
        c[i] = (M[i][n] - sum(M[i][j] * c[j] for j in range(i + 1, n))) / M[i][i]
    return [float(t) for t in c]


def mse(c, data):
    return sum((y - sum(ci * x ** k for k, ci in enumerate(c))) ** 2 for x, y in data) / len(data)


def main():
    rng = random.Random(37)
    train = [((i + 0.5) / 10, math.sin(2 * math.pi * (i + 0.5) / 10) + rng.gauss(0, 0.3)) for i in range(10)]
    test = [(x, math.sin(2 * math.pi * x) + rng.gauss(0, 0.3)) for x in [rng.uniform(0.05, 0.95) for _ in range(2000)]]
    tr, te = [], []
    for d in range(10):
        c = fit(train, d)
        tr.append(mse(c, train))
        te.append(mse(c, test))
    assert all(a >= b - 1e-12 for a, b in zip(tr, tr[1:])) and tr[9] < 1e-12
    assert te.index(min(te)) == 3 and abs(te[3] - 0.129) < 0.002 and abs(te[9] - 0.544) < 0.002
    table_tr = {0: 0.488, 1: 0.195, 3: 0.029, 5: 0.022, 7: 0.011, 9: 0.0}
    table_te = {0: 0.704, 1: 0.289, 3: 0.129, 5: 0.134, 7: 0.148, 9: 0.544}
    assert all(round(tr[d], 3) == v for d, v in table_tr.items()) and all(round(te[d], 3) == v for d, v in table_te.items())
    print("[OK] 주장 1: 훈련", [round(t, 3) for t in tr], "시험", [round(t, 3) for t in te])

    cv = []
    for d in range(8):
        err = 0.0
        for f in range(5):
            val = [train[i] for i in range(10) if i % 5 == f]
            trn = [train[i] for i in range(10) if i % 5 != f]
            err += mse(fit(trn, d), val) * len(val)
        cv.append(err / 10)
    assert cv.index(min(cv)) == 3
    print("[OK] 주장 2: 교차검증이 고른 차수 3", [round(t, 3) for t in cv])

    assert min(te) > 0.09
    print("[OK] 주장 3: 잡음의 바닥")

    for d in range(9):
        c = fit(train, d)
        assert mse(c + [0.0], train) == mse(c, train) >= tr[d + 1] - 1e-12
    print("[OK] 주장 4·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
