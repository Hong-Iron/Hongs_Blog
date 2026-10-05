---
layout: "note"
title: "18_gram-schmidt-qr_impl.py"
display_title: "18_gram-schmidt-qr_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "18"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/gram-schmidt-qr/"
parent_title: "그람-슈미트와 QR 분해"
description: "선형대수학 · 그람-슈미트와 QR 분해 구현 코드"
permalink: "/studies/linear-algebra/code/18_gram-schmidt-qr_impl/"
---
{% raw %}
[그람-슈미트와 QR 분해](/Hongs_Blog/studies/linear-algebra/gram-schmidt-qr/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""그람–슈미트 직교화와 QR 분해, QR로 푸는 최소제곱.

문서: 18.그람-슈미트와 QR 분해
qr(A, modified=True): 열이 독립인 m×n 행렬 A를 A = QR로 나눈다. Q는 열이 정규직교인 m×n, R은 n×n 위삼각.
    classical(고전): 새 열에서 이전 q들로의 사영을 모두 원래 열 기준으로 계산해 뺀다.
    modified(수정): 한 q로의 사영을 빼고 난 결과에서 다음 사영을 계산한다. 수학적으로 같지만 반올림에 강하다.
lstsq_qr(A, b): R x = Q^T b를 후진 대입으로 푼다. 정규방정식 A^T A x = A^T b보다 정확하다.
"""
import math


def qr(A, modified=True):
    m, n = len(A), len(A[0])
    V = [[float(A[i][j]) for i in range(m)] for j in range(n)]   # 열들
    Q, R = [], [[0.0] * n for _ in range(n)]
    for j in range(n):
        v = V[j][:]
        for i in range(j):
            src = v if modified else V[j]
            R[i][j] = sum(Q[i][k] * src[k] for k in range(m))
            v = [v[k] - R[i][j] * Q[i][k] for k in range(m)]
        R[j][j] = math.sqrt(sum(x * x for x in v))
        if R[j][j] == 0:
            raise ValueError("열이 종속이다")
        Q.append([x / R[j][j] for x in v])
    Qm = [[Q[j][i] for j in range(n)] for i in range(m)]
    return Qm, R


def lstsq_qr(A, b, modified=True):
    Q, R = qr(A, modified)
    n = len(R)
    c = [sum(Q[i][j] * b[i] for i in range(len(b))) for j in range(n)]   # Q^T b
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (c[i] - sum(R[i][j] * x[j] for j in range(i + 1, n))) / R[i][i]
    return x


def orth_error(Q):
    n = len(Q[0])
    return max(abs(sum(Q[k][i] * Q[k][j] for k in range(len(Q))) - (1.0 if i == j else 0.0))
               for i in range(n) for j in range(n))


if __name__ == "__main__":
    Q, R = qr([[1, 1], [1, 0], [0, 1]])
    s2, s6 = math.sqrt(2), math.sqrt(6)
    assert all(abs(a - b) < 1e-12 for a, b in zip([Q[i][0] for i in range(3)], [1 / s2, 1 / s2, 0]))
    assert all(abs(a - b) < 1e-12 for a, b in zip([Q[i][1] for i in range(3)], [1 / s6, -1 / s6, 2 / s6]))
    assert abs(R[0][0] - s2) < 1e-12 and abs(R[0][1] - 1 / s2) < 1e-12 and abs(R[1][1] - math.sqrt(1.5)) < 1e-12
    x = lstsq_qr([[1, 0], [1, 1], [1, 2]], [6, 0, 0])
    assert abs(x[0] - 5) < 1e-12 and abs(x[1] + 3) < 1e-12
    eps = 1e-8                                   # 라우흘리 행렬: 고전 방식이 직교성을 잃는 예
    L = [[1, 1, 1], [eps, 0, 0], [0, eps, 0], [0, 0, eps]]
    assert orth_error(qr(L, modified=False)[0]) > 0.1 and orth_error(qr(L, modified=True)[0]) < 1e-6
    try:
        qr([[1, 2], [2, 4]])
        raise AssertionError("예외가 나야 한다")
    except ValueError:
        pass
    print("ALL CHECKS PASSED")
```
{% endraw %}
