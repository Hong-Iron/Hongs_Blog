---
layout: "note"
title: "05_gaussian-elimination_impl.py"
display_title: "05_gaussian-elimination_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "05"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/gaussian-elimination/"
parent_title: "가우스 소거법"
description: "선형대수학 · 가우스 소거법 구현 코드"
permalink: "/studies/linear-algebra/code/05_gaussian-elimination_impl/"
---
{% raw %}
[가우스 소거법](/Hongs_Blog/studies/linear-algebra/gaussian-elimination/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""가우스 소거법.

문서: 05.가우스 소거법
solve_exact(A, b): 유리수(Fraction)로 정확히 풀고 해의 종류를 돌려준다.
    ("unique", x) / ("none", None) / ("infinite", (특수해, 자유변수 번호 목록, 영공간 기저))
    첨가행렬 [A | b]를 기약 행 사다리꼴(RREF)까지 줄인다. m × n 어떤 모양이든 된다.
solve_float(A, b, pivot=True): 정사각 가역 행렬을 부동소수점으로 푼다. 전진 소거 + 후진 대입.
    pivot=True면 부분 피벗팅(열에서 절댓값이 가장 큰 행을 피벗으로)을 쓴다. O(n³).
인덱스는 0부터 센다.
"""
from fractions import Fraction


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


if __name__ == "__main__":
    A, b = [[1, 2, 1], [3, 8, 1], [0, 4, 1]], [2, 12, 2]
    assert solve_exact(A, b) == ("unique", [2, 1, -2])
    assert all(abs(u - v) < 1e-12 for u, v in zip(solve_float(A, b), [2, 1, -2]))
    assert solve_exact([[1, 1, 1], [1, 2, 3], [2, 3, 4]], [1, 2, 4])[0] == "none"
    kind, (xp, free, basis) = solve_exact([[1, 1, 1], [1, 2, 3], [2, 3, 4]], [2, 3, 5])
    assert kind == "infinite" and xp == [1, 1, 0] and free == [2] and basis == [[1, -2, 1]]
    # 피벗팅이 필요한 예
    E = [[1e-20, 1], [1, 1]]
    assert abs(solve_float(E, [1, 2], pivot=False)[0] - 1) > 0.5
    assert all(abs(v - 1) < 1e-12 for v in solve_float(E, [1, 2], pivot=True))
    print("ALL CHECKS PASSED")
```
{% endraw %}
