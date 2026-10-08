---
layout: "note"
title: "14_change-of-basis_verify.py"
display_title: "14_change-of-basis_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "14"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/change-of-basis/"
parent_title: "기저 변환"
description: "선형대수학 · 기저 변환 검증 코드"
permalink: "/studies/linear-algebra/code/14_change-of-basis_verify/"
---
{% raw %}
[기저 변환](/Hongs_Blog/studies/linear-algebra/change-of-basis/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""기저 변환 검증.

문서: 14.기저 변환 (예시, 정의, 바뀌지 않는 것, 예제, 카드 C1~C3)
주장 1: 예시·카드 C1 — (3,1) = 2(1,1) + 1(1,-1), 반사 후 새 좌표 (2,-1) -> 표준 좌표 (1,3).
주장 2: 예제 — P^{-1} = (1/2)[[1,1],[1,-1]], AP = [[1,-1],[1,1]], P^{-1}AP = diag(1,-1), det -1, trace 0.
주장 3: 정의 — 무작위 A, 가역 P에서 B c = P^{-1}(A (P c)) (유리수), 좌표 왕복 x = P c.
주장 4: 불변량 — det, trace, rank가 A와 P^{-1}AP에서 같다.
주장 5: 카드 C2 — 사영 [[1,0],[0,0]], P = [[1,0],[1,1]]: P^{-1}AP = [[1,0],[-1,0]]. 사영 방향 기저 (1,0),(0,1)에서는 이미 대각.
"""
import random
from fractions import Fraction as F
from itertools import permutations


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def mv(A, x):
    return [sum(a * b for a, b in zip(r, x)) for r in A]


def inv(A):
    n = len(A)
    M = [[F(v) for v in row] + [F(int(i == j)) for j in range(n)] for i, row in enumerate(A)]
    for c in range(n):
        p = next((i for i in range(c, n) if M[i][c] != 0), None)
        if p is None:
            return None
        M[c], M[p] = M[p], M[c]
        M[c] = [x / M[c][c] for x in M[c]]
        for i in range(n):
            if i != c and M[i][c] != 0:
                f = M[i][c]
                M[i] = [a - f * b for a, b in zip(M[i], M[c])]
    return [row[n:] for row in M]


def det(A):
    n = len(A)
    tot = F(0)
    for p in permutations(range(n)):
        s = sum(1 for i in range(n) for j in range(i + 1, n) if p[i] > p[j])
        prod = F(1)
        for i in range(n):
            prod *= A[i][p[i]]
        tot += (-1) ** s * prod
    return tot


def rank(A):
    M = [[F(v) for v in row] for row in A]
    m, n = len(M), len(M[0])
    r = 0
    for c in range(n):
        p = next((i for i in range(r, m) if M[i][c] != 0), None)
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]
        for i in range(r + 1, m):
            f = M[i][c] / M[r][c]
            M[i] = [a - f * b for a, b in zip(M[i], M[r])]
        r += 1
    return r


def main():
    b1, b2 = (1, 1), (1, -1)
    assert tuple(2 * a + 1 * b for a, b in zip(b1, b2)) == (3, 1)
    assert tuple(2 * a - 1 * b for a, b in zip(b1, b2)) == (1, 3)
    A = [[0, 1], [1, 0]]
    assert mv(A, [3, 1]) == [1, 3]
    print("[OK] 주장 1·카드 C1: 예시")

    P = [[1, 1], [1, -1]]
    Pi = inv(P)
    assert Pi == [[F(1, 2), F(1, 2)], [F(1, 2), F(-1, 2)]]
    assert mm(A, P) == [[1, -1], [1, 1]] and mm(Pi, mm(A, P)) == [[1, 0], [0, -1]]
    assert det(A) == -1 and A[0][0] + A[1][1] == 0
    print("[OK] 주장 2: 예제")

    rng = random.Random(14)
    done = 0
    while done < 300:
        n = rng.randint(1, 4)
        A = [[F(rng.randint(-4, 4)) for _ in range(n)] for _ in range(n)]
        P = [[F(rng.randint(-4, 4)) for _ in range(n)] for _ in range(n)]
        Pi = inv(P)
        if Pi is None:
            continue
        done += 1
        B = mm(Pi, mm(A, P))
        c = [F(rng.randint(-5, 5)) for _ in range(n)]
        assert mv(B, c) == mv(Pi, mv(A, mv(P, c)))
        x = mv(P, c)
        assert mv(Pi, x) == c
        assert det(B) == det(A) and sum(B[i][i] for i in range(n)) == sum(A[i][i] for i in range(n))
        assert rank(B) == rank(A)
    print("[OK] 주장 3·4·카드 C3: 정의와 불변량")

    Ap = [[1, 0], [0, 0]]
    P = [[1, 0], [1, 1]]
    assert inv(P) == [[1, 0], [-1, 1]] and mm(inv(P), mm(Ap, P)) == [[1, 0], [-1, 0]]
    assert mv(Ap, [1, 1]) == [1, 0] and mv(Ap, [0, 1]) == [0, 0]
    print("[OK] 주장 5·카드 C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
