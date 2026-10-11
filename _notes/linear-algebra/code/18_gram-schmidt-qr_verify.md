---
layout: "note"
title: "18_gram-schmidt-qr_verify.py"
display_title: "18_gram-schmidt-qr_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "18"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/gram-schmidt-qr/"
parent_title: "그람-슈미트와 QR 분해"
description: "선형대수학 · 그람-슈미트와 QR 분해 검증 코드"
permalink: "/studies/linear-algebra/code/18_gram-schmidt-qr_verify/"
---
{% raw %}
[그람-슈미트와 QR 분해](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""그람-슈미트와 QR 분해 검증.

문서: 18.그람-슈미트와 QR 분해 (예시, 알고리즘, 불변식, 정확성, 예제, 활용, 카드 C1~C3)
주장 1: 예시 — q1 = (1,1,0)/√2, q2 = (1,-1,2)/√6, R = [[√2, 1/√2],[0, √1.5]].
주장 2: 무작위 행렬 300개 — Q^T Q = I, QR = A, R 위삼각·대각 양수, 앞 j개 q의 생성 = 앞 j개 a의 생성(사영 잔차 0).
주장 3: QR 최소제곱 = 정규방정식 해(잘 조건화된 무작위 문제), Strang 예 (5, -3).
주장 4: 예제 — 라우흘리 행렬(ε = 1e-8): 고전 q2·q3 ≈ 0.5, 수정은 1e-8 이하 수준.
주장 5: 활용 — 불량 조건(t^0..t^7 다항식 맞추기, t ∈ [0,1] 20점)에서 QR 해의 오차가 정규방정식보다 작다(정답을 아는 합성 데이터).
주장 6: 카드 C1 — (3,4),(1,0): q1 = (0.6,0.8), q2 = (0.8,-0.6), R = [[5,0.6],[0,0.8]].
"""
import math
import random


def qr(A, modified=True):
    m, n = len(A), len(A[0])
    V = [[float(A[i][j]) for i in range(m)] for j in range(n)]
    Q, R = [], [[0.0] * n for _ in range(n)]
    for j in range(n):
        v = V[j][:]
        for i in range(j):
            src = v if modified else V[j]
            R[i][j] = sum(Q[i][k] * src[k] for k in range(m))
            v = [v[k] - R[i][j] * Q[i][k] for k in range(m)]
        R[j][j] = math.sqrt(sum(x * x for x in v))
        Q.append([x / R[j][j] for x in v])
    return [[Q[j][i] for j in range(n)] for i in range(m)], R


def lstsq_qr(A, b):
    Q, R = qr(A)
    n = len(R)
    c = [sum(Q[i][j] * b[i] for i in range(len(b))) for j in range(n)]
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (c[i] - sum(R[i][j] * x[j] for j in range(i + 1, n))) / R[i][i]
    return x


def solve(M, y):
    n = len(M)
    A = [row[:] + [yy] for row, yy in zip(M, y)]
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(A[i][k]))
        A[k], A[p] = A[p], A[k]
        for i in range(k + 1, n):
            f = A[i][k] / A[k][k]
            A[i] = [a - f * b for a, b in zip(A[i], A[k])]
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (A[i][n] - sum(A[i][j] * x[j] for j in range(i + 1, n))) / A[i][i]
    return x


def lstsq_normal(A, b):
    m, n = len(A), len(A[0])
    AtA = [[sum(A[k][i] * A[k][j] for k in range(m)) for j in range(n)] for i in range(n)]
    Atb = [sum(A[k][i] * b[k] for k in range(m)) for i in range(n)]
    return solve(AtA, Atb)


def main():
    Q, R = qr([[1, 1], [1, 0], [0, 1]])
    s2, s6 = math.sqrt(2), math.sqrt(6)
    assert all(abs(Q[i][0] - v) < 1e-12 for i, v in enumerate([1 / s2, 1 / s2, 0]))
    assert all(abs(Q[i][1] - v) < 1e-12 for i, v in enumerate([1 / s6, -1 / s6, 2 / s6]))
    assert abs(R[0][0] - s2) < 1e-12 and abs(R[0][1] - 1 / s2) < 1e-12 and abs(R[1][1] - math.sqrt(1.5)) < 1e-12 and R[1][0] == 0
    print("[OK] 주장 1: 예시")

    rng = random.Random(18)
    for _ in range(300):
        m = rng.randint(2, 6)
        n = rng.randint(1, m)
        A = [[rng.uniform(-3, 3) for _ in range(n)] for _ in range(m)]
        Q, R = qr(A)
        for i in range(n):
            for j in range(n):
                assert abs(sum(Q[k][i] * Q[k][j] for k in range(m)) - (i == j)) < 1e-9
                if i > j:
                    assert R[i][j] == 0
            assert R[i][i] > 0
        for i in range(m):
            for j in range(n):
                assert abs(sum(Q[i][k] * R[k][j] for k in range(n)) - A[i][j]) < 1e-9
        for j in range(n):
            a = [A[i][j] for i in range(m)]
            proj = [sum(Q[i][k] * sum(Q[t][k] * a[t] for t in range(m)) for k in range(j + 1)) for i in range(m)]
            assert all(abs(x - y) < 1e-9 for x, y in zip(a, proj))
    print("[OK] 주장 2·카드 C3: Q^T Q = I, QR = A, 위삼각, 같은 생성")

    x = lstsq_qr([[1, 0], [1, 1], [1, 2]], [6, 0, 0])
    assert abs(x[0] - 5) < 1e-12 and abs(x[1] + 3) < 1e-12
    for _ in range(200):
        m, n = rng.randint(3, 8), rng.randint(1, 3)
        A = [[rng.uniform(-3, 3) for _ in range(n)] for _ in range(m)]
        b = [rng.uniform(-3, 3) for _ in range(m)]
        assert all(abs(p - q) < 1e-8 for p, q in zip(lstsq_qr(A, b), lstsq_normal(A, b)))
    print("[OK] 주장 3: QR 최소제곱 = 정규방정식")

    eps = 1e-8
    L = [[1, 1, 1], [eps, 0, 0], [0, eps, 0], [0, 0, eps]]
    d = lambda Q, i, j: sum(Q[k][i] * Q[k][j] for k in range(4))
    Qc, Qm = qr(L, False)[0], qr(L, True)[0]
    assert abs(d(Qc, 1, 2) - 0.5) < 1e-6 and abs(d(Qm, 1, 2)) < 1e-8
    print(f"[OK] 주장 4: 고전 {d(Qc, 1, 2):.3f}, 수정 {d(Qm, 1, 2):.1e}")

    ts = [i / 19 for i in range(20)]
    deg = 7
    true = [1.0, -2.0, 0.5, 3.0, -1.0, 2.0, -0.5, 1.5]
    A = [[t ** k for k in range(deg + 1)] for t in ts]
    b = [sum(c * t ** k for k, c in enumerate(true)) for t in ts]
    err_qr = max(abs(p - q) for p, q in zip(lstsq_qr(A, b), true))
    err_ne = max(abs(p - q) for p, q in zip(lstsq_normal(A, b), true))
    assert err_qr < err_ne
    print(f"[OK] 주장 5: 계수 오차 QR {err_qr:.1e}, 정규방정식 {err_ne:.1e}")

    Q, R = qr([[3, 1], [4, 0]])
    assert all(abs(a - b) < 1e-12 for a, b in zip([Q[0][0], Q[1][0], Q[0][1], Q[1][1]], [0.6, 0.8, 0.8, -0.6]))
    assert all(abs(a - b) < 1e-12 for a, b in zip([R[0][0], R[0][1], R[1][1]], [5, 0.6, 0.8]))
    print("[OK] 주장 6·카드 C1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
