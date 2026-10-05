---
layout: "note"
title: "05_gaussian-elimination_verify.py"
display_title: "05_gaussian-elimination_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "05"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/gaussian-elimination/"
parent_title: "가우스 소거법"
description: "선형대수학 · 가우스 소거법 검증 코드"
permalink: "/studies/linear-algebra/code/05_gaussian-elimination_verify/"
---
{% raw %}
[가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""가우스 소거법 검증.

문서: 05.가우스 소거법 (예시, 알고리즘, 불변식, 해의 종류, 증명, 예제, 활용, 오해, 카드 C1~C4),
      4.연습문제/05.가우스 소거 예제 사다리
주장 1: 예시 — 단계별 첨가행렬과 해 (2, 1, -2). 피벗 1, 2, 5, 곱수 3, 0, 2.
주장 2: 무작위 정수 행렬 500개(n <= 6) — 유리수 소거의 해를 대입하면 Ax = b, 부동소수점 해와 1e-8 이내.
주장 3: 해의 종류 — 무작위(일부러 특이하게 만든 것 포함) 행렬에서 판정이 전수 탐색(작은 정수 해)과 모순 없음,
         "infinite"의 일반해가 모두 해.
주장 4: 기본 행 연산이 해 집합을 보존(2×2, 계수·해 -3..3 전수).
주장 5: 예제 — 1e-20 피벗: 피벗팅 없이 x = 0(틀림), 피벗팅하면 (1, 1).
주장 6: 연산 수 — 곱셈 횟수 Σ(n-k)(n-k+1)이 n³/3에 가깝고, n = 1000이면 전체 약 6.7 × 10^8.
주장 7: 오해·카드 C4 — x + y = 1, 2x + 2y = 3은 없음, = 2는 무한. 계단 모양 셋의 판정.
주장 8: 카드 C1 — (-4, 4.5). 사다리 — 모순 계와 무한해 계, 행 바꾸기가 필요한 계.
"""
import random
from fractions import Fraction as F
from fractions import Fraction
from itertools import product


# 05_gaussian-elimination_impl.py의 함수를 복사해 둔다(파일끼리 import하지 않는다).
def rref(M):
    """행 연산으로 기약 행 사다리꼴을 만든다. (결과, 피벗 열 목록)."""
    M = [[Fraction(x) for x in row] for row in M]
    rows, cols = len(M), len(M[0])
    pivots, r = [], 0
    for c in range(cols):
        p = next((i for i in range(r, rows) if M[i][c] != 0), None)
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]                       # 행 바꾸기
        piv = M[r][c]
        M[r] = [x / piv for x in M[r]]                # 피벗을 1로
        for i in range(rows):
            if i != r and M[i][c] != 0:
                f = M[i][c]
                M[i] = [a - f * b for a, b in zip(M[i], M[r])]   # 다른 행에서 빼기
        pivots.append(c)
        r += 1
        if r == rows:
            break
    return M, pivots


def solve_exact(A, b):
    n = len(A[0])
    R, piv = rref([list(row) + [bi] for row, bi in zip(A, b)])
    if n in piv:                                      # 0 = (0이 아닌 수) 줄
        return "none", None
    x = [Fraction(0)] * n
    for i, c in enumerate(piv):
        x[c] = R[i][n]
    free = [j for j in range(n) if j not in piv]
    if not free:
        return "unique", x
    basis = []
    for f in free:
        v = [Fraction(0)] * n
        v[f] = Fraction(1)
        for i, c in enumerate(piv):
            v[c] = -R[i][f]
        basis.append(v)
    return "infinite", (x, free, basis)


def solve_float(A, b, pivot=True):
    n = len(A)
    M = [list(map(float, row)) + [float(bi)] for row, bi in zip(A, b)]
    for k in range(n):
        if pivot:
            p = max(range(k, n), key=lambda i: abs(M[i][k]))
            M[k], M[p] = M[p], M[k]
        if M[k][k] == 0:
            raise ZeroDivisionError("피벗이 0: 행을 바꾸거나 특이 행렬")
        for i in range(k + 1, n):
            m = M[i][k] / M[k][k]
            for j in range(k, n + 1):
                M[i][j] -= m * M[k][j]
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        s = sum(M[i][j] * x[j] for j in range(i + 1, n))
        x[i] = (M[i][n] - s) / M[i][i]
    return x


class ge:
    rref = staticmethod(rref)
    solve_exact = staticmethod(solve_exact)
    solve_float = staticmethod(solve_float)


def mat_vec(A, x):
    return [sum(a * b for a, b in zip(row, x)) for row in A]


def main():
    M = [[F(v) for v in r] for r in [[1, 2, 1, 2], [3, 8, 1, 12], [0, 4, 1, 2]]]
    M[1] = [a - 3 * b for a, b in zip(M[1], M[0])]
    assert M[1] == [0, 2, -2, 6]
    l31 = M[2][0] / M[0][0]
    M[2] = [a - 2 * b for a, b in zip(M[2], M[1])]
    assert l31 == 0 and M[2] == [0, 0, 5, -10]
    z = M[2][3] / M[2][2]
    y = (M[1][3] - M[1][2] * z) / M[1][1]
    x = (M[0][3] - M[0][1] * y - M[0][2] * z) / M[0][0]
    assert (x, y, z) == (2, 1, -2) and [M[0][0], M[1][1], M[2][2]] == [1, 2, 5]
    print("[OK] 주장 1: 예시")

    rng = random.Random(5)
    done = 0
    while done < 500:
        n = rng.randint(1, 6)
        A = [[rng.randint(-9, 9) for _ in range(n)] for _ in range(n)]
        b = [rng.randint(-9, 9) for _ in range(n)]
        kind, sol = ge.solve_exact(A, b)
        if kind != "unique":
            continue
        done += 1
        assert mat_vec(A, sol) == b
        xf = ge.solve_float(A, b)
        assert all(abs(p - float(q)) < 1e-8 * max(1, abs(float(q))) for p, q in zip(xf, sol))
    print("[OK] 주장 2: 유리수 소거와 부동소수점 소거")

    for _ in range(400):
        m, n = rng.randint(1, 3), rng.randint(1, 3)
        A = [[rng.randint(-2, 2) for _ in range(n)] for _ in range(m)]
        if rng.random() < 0.5 and m >= 2:
            A[-1] = [2 * v for v in A[0]]
        b = [rng.randint(-2, 2) for _ in range(m)]
        kind, sol = ge.solve_exact(A, b)
        found = [xs for xs in product(range(-6, 7), repeat=n) if mat_vec(A, xs) == b]
        if kind == "none":
            assert not found
        elif kind == "unique":
            assert mat_vec(A, sol) == b and all(list(xs) == sol for xs in found)
        else:
            xp, free, basis = sol
            assert mat_vec(A, xp) == b
            for _ in range(5):
                ts = [F(rng.randint(-5, 5), rng.randint(1, 3)) for _ in basis]
                xx = [p + sum(t * v[i] for t, v in zip(ts, basis)) for i, p in enumerate(xp)]
                assert mat_vec(A, xx) == b
    print("[OK] 주장 3·카드 C4 방법: 해의 종류")

    rng2 = random.Random(55)
    for _ in range(300):
        A = [[rng2.randint(-3, 3) for _ in range(2)] for _ in range(2)]
        b = [rng2.randint(-3, 3) for _ in range(2)]
        l = rng2.randint(-3, 3)
        A2 = [A[0], [A[1][j] - l * A[0][j] for j in range(2)]]
        b2 = [b[0], b[1] - l * b[0]]
        S1 = {xs for xs in product(range(-4, 5), repeat=2) if mat_vec(A, xs) == b}
        S2 = {xs for xs in product(range(-4, 5), repeat=2) if mat_vec(A2, xs) == b2}
        assert S1 == S2
    print("[OK] 주장 4·카드 C3: 행 연산은 해 집합을 보존")

    E = [[1e-20, 1], [1, 1]]
    bad = ge.solve_float(E, [1, 2], pivot=False)
    good = ge.solve_float(E, [1, 2], pivot=True)
    assert bad[0] == 0.0 and bad[1] == 1.0 and all(abs(v - 1) < 1e-12 for v in good)
    print("[OK] 주장 5: 피벗팅")

    for n in (10, 100, 1000):
        mults = sum((n - k) * (n - k + 1) for k in range(1, n + 1))
        assert abs(mults / (n ** 3 / 3) - 1) < 3.5 / n
    assert abs(2 / 3 * 1000 ** 3 - 6.67e8) < 1e6
    print("[OK] 주장 6: 연산 수")

    assert ge.solve_exact([[1, 1], [2, 2]], [1, 3])[0] == "none"
    assert ge.solve_exact([[1, 1], [2, 2]], [1, 2])[0] == "infinite"
    assert ge.solve_exact([[1, 2], [0, 0]], [3, 1])[0] == "none"
    assert ge.solve_exact([[1, 2], [0, 0]], [3, 0])[0] == "infinite"
    assert ge.solve_exact([[1, 2], [0, 5]], [3, 1])[0] == "unique"
    print("[OK] 주장 7·오해·카드 C4")

    assert ge.solve_exact([[1, 2], [3, 4]], [5, 6]) == ("unique", [-4, F(9, 2)])
    assert ge.solve_exact([[1, 1, 1], [1, 2, 3], [2, 3, 4]], [1, 2, 4])[0] == "none"
    kind, (xp, free, basis) = ge.solve_exact([[1, 1, 1], [1, 2, 3], [2, 3, 4]], [2, 3, 5])
    assert kind == "infinite" and xp == [1, 1, 0] and basis == [[1, -2, 1]]
    assert ge.solve_exact([[0, 1], [1, 1]], [1, 3]) == ("unique", [2, 1])
    print("[OK] 주장 8·카드 C1·사다리")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
