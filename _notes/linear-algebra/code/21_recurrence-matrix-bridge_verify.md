---
layout: "note"
title: "21_recurrence-matrix-bridge_verify.py"
display_title: "21_recurrence-matrix-bridge_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "21"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/recurrence-matrix-bridge/"
parent_title: "선형 점화식 ↔ 행렬 거듭제곱"
description: "선형대수학 · 선형 점화식 ↔ 행렬 거듭제곱 검증 코드"
permalink: "/studies/linear-algebra/code/21_recurrence-matrix-bridge_verify/"
---
{% raw %}
[선형 점화식 ↔ 행렬 거듭제곱](/Hongs_Blog/studies/linear-algebra/recurrence-matrix-bridge/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형 점화식 ↔ 행렬 거듭제곱 검증.

문서: 21.선형 점화식 ↔ 행렬 거듭제곱 (비교 표, 대응 관계, 어디까지 같은가, 얻는 것, 전이 문제, 카드 C1~C3)
주장 1: Q^n = [[F_{n+1}, F_n],[F_n, F_{n-1}]] (n <= 90, 정수), Q^10 = [[89,55],[55,34]].
주장 2: 동반 행렬 [[c1,c2],[1,0]]의 특성다항식 λ² - c1 λ - c2 (무작위 정수, 유리수 λ에서 값 비교).
주장 3: 대각화 결과 = 점화식 일반해 — a_n = 5a_{n-1} - 6a_{n-2}(근 2, 3)에서 X Λ^n X^{-1} u_1 = 점화식 값(유리수).
주장 4: 비네 공식을 부동소수점으로 계산해 반올림하면 n = 71에서 처음 틀린다.
주장 5: 빠른 거듭제곱 — Q^n을 제곱 되풀이로 계산(곱셈 수 <= 2 log2 n), F_{10^18} mod 1e9+7 같은 큰 n도 즉시.
주장 6: F_{n+1}/F_n -> φ, 겹근 a_n = 4a_{n-1} - 4a_{n-2}의 해 (α + βn)2^n과 동반 행렬이 대각화되지 않음(고유공간 1차원).
주장 7: 전이 문제 — {a,b,c}에서 aa 없는 문자열 수 3, 8, 22, 60, 164 (전수), 행렬 [[0,1],[2,2]] 계산과 일치, 성장률 1+√3.
주장 8: 카드 C2 — Q^2, Q^4, Q^8, Q^8·Q^2의 곱셈 4번.
"""
import math
from fractions import Fraction as F
from itertools import product


def mm(A, B, mod=None):
    C = [[sum(A[i][k] * B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]
    return [[x % mod for x in r] for r in C] if mod else C


def mpow_count(A, n, mod=None):
    R, base, cnt = None, A, 0
    while n:
        if n & 1:
            if R is None:
                R = base
            else:
                R = mm(R, base, mod)
                cnt += 1
        n >>= 1
        if n:
            base = mm(base, base, mod)
            cnt += 1
    return (R if R is not None else [[1, 0], [0, 1]]), cnt


def main():
    fib = [0, 1]
    while len(fib) < 95:
        fib.append(fib[-1] + fib[-2])
    Q = [[1, 1], [1, 0]]
    P = [[1, 0], [0, 1]]
    for n in range(1, 91):
        P = mm(P, Q)
        assert P == [[fib[n + 1], fib[n]], [fib[n], fib[n - 1]]]
    assert mpow_count(Q, 10) == ([[89, 55], [55, 34]], 4)   # Q^2, Q^4, Q^8, Q^8·Q^2
    print("[OK] 주장 1·카드 C2: Q^n과 피보나치")

    import random
    rng = random.Random(21)
    for _ in range(500):
        c1, c2 = rng.randint(-9, 9), rng.randint(-9, 9)
        lam = F(rng.randint(-20, 20), rng.randint(1, 5))
        detv = (c1 - lam) * (0 - lam) - c2 * 1
        assert detv == lam * lam - c1 * lam - c2
    print("[OK] 주장 2: 특성다항식 = 특성방정식")

    a = [None, F(1), F(5)]      # a_1 = 1, a_2 = 5
    for n in range(3, 30):
        a.append(5 * a[-1] - 6 * a[-2])
    X = [[F(2), F(3)], [F(1), F(1)]]     # 고유벡터 (λ, 1): λ = 2, 3
    Xi_det = X[0][0] * X[1][1] - X[0][1] * X[1][0]
    Xi = [[X[1][1] / Xi_det, -X[0][1] / Xi_det], [-X[1][0] / Xi_det, X[0][0] / Xi_det]]
    u1 = [a[2], a[1]]
    c = [sum(Xi[i][j] * u1[j] for j in range(2)) for i in range(2)]
    for n in range(2, 29):
        k = n - 2
        un = [c[0] * 2 ** k * X[i][0] + c[1] * 3 ** k * X[i][1] for i in range(2)]
        assert un == [a[n], a[n - 1]]
    A = [[5, -6], [1, 0]]
    for lam, v in ((2, [2, 1]), (3, [3, 1])):
        assert [sum(A[i][j] * v[j] for j in range(2)) for i in range(2)] == [lam * x for x in v]
    print("[OK] 주장 3·카드 C1: 대각화 = 일반해")

    phi, psi = (1 + math.sqrt(5)) / 2, (1 - math.sqrt(5)) / 2
    bad = [n for n in range(95) if round((phi ** n - psi ** n) / math.sqrt(5)) != fib[n]]
    assert bad[0] == 71
    print("[OK] 주장 4: 비네 부동소수점은 n = 71부터 틀림")

    for n in (10, 1000, 10 ** 6):
        R, cnt = mpow_count(Q, n)
        assert cnt <= 2 * math.log2(n) and R[0][1] == (fib[n] if n < 95 else R[0][1])
    R, cnt = mpow_count(Q, 10 ** 18, 10 ** 9 + 7)
    assert cnt <= 2 * 60 and 0 <= R[0][1] < 10 ** 9 + 7
    R1 = mpow_count(Q, 200)[0]
    f200 = fib[:]
    while len(f200) < 202:
        f200.append(f200[-1] + f200[-2])
    assert R1[0][1] == f200[200]
    print("[OK] 주장 5: 빠른 거듭제곱")

    assert abs(fib[91] / fib[90] - phi) < 1e-15
    b = [F(1), F(6)]           # b_0 = 1, b_1 = 6 -> (1 + 2n) 2^n
    for n in range(2, 25):
        b.append(4 * b[-1] - 4 * b[-2])
    assert all(b[n] == (1 + 2 * n) * 2 ** n for n in range(25))
    Mrep = [[4 - 2, -4], [1, 0 - 2]]           # A - 2I, A = [[4,-4],[1,0]]
    assert Mrep[0][0] * Mrep[1][1] - Mrep[0][1] * Mrep[1][0] == 0 and any(any(r) for r in Mrep)
    print("[OK] 주장 6: 성장률 φ, 겹근 ↔ 대각화 불가")

    counts = [sum(1 for s in product("abc", repeat=n) if "aa" not in "".join(s)) for n in range(1, 8)]
    assert counts[:5] == [3, 8, 22, 60, 164]
    M = [[0, 1], [2, 2]]
    x, y = 1, 2
    seq = [x + y]
    for _ in range(6):
        x, y = M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y
        seq.append(x + y)
    assert seq == counts
    assert abs(counts[-1] / counts[-2] - (1 + math.sqrt(3))) < 0.01
    print("[OK] 주장 7: 전이 문제")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
