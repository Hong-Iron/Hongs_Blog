---
layout: "note"
title: "10_basis-dimension_verify.py"
display_title: "10_basis-dimension_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "10"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/basis-dimension/"
parent_title: "부분공간, 기저와 차원"
description: "선형대수학 · 부분공간, 기저와 차원 검증 코드"
permalink: "/studies/linear-algebra/code/10_basis-dimension_verify/"
---
{% raw %}
[부분공간, 기저와 차원](/Hongs_Blog/studies/linear-algebra/basis-dimension/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""부분공간, 기저와 차원 검증.

문서: 10.부분공간, 기저와 차원 (예시, 정의, 동치 정의, 정리, 증명, 예제, 오해, 카드 C1~C4)
주장 1: 예시 — 평면 x+y+z=0이 덧셈·스칼라배에 닫힘(무작위), 기저 (1,0,-1),(0,1,-1), (2,3,-5)의 좌표 (2,3).
주장 2: 예제 — (-s, s, 2t, t) = s(-1,1,0,0) + t(0,0,2,1), 두 벡터 독립, 차원 2.
주장 3: 정리 — 무작위 부분공간(생성 벡터 여러 개)에서 서로 다른 순서로 뽑은 기저 두 개의 크기가 같다.
주장 4: 보조정리 — k개로 생성되는 공간의 m > k개 벡터는 종속(무작위 결합).
주장 5: 동치 — 기저이면 좌표가 하나뿐(무작위 정수 좌표를 되찾음), 하나 빼면 생성 못 함, 하나 더하면 종속.
주장 6: 오해 — (1,1),(1,-1)도 R^2의 기저. 카드 C4 — x축 ∪ y축은 (1,1)을 포함하지 않음.
"""
import random
from fractions import Fraction as F


def rank(vs):
    if not vs:
        return 0
    n = len(vs[0])
    M = [[F(v[i]) for v in vs] for i in range(n)]
    r = 0
    for c in range(len(vs)):
        p = next((i for i in range(r, n) if M[i][c] != 0), None)
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]
        for i in range(r + 1, n):
            f = M[i][c] / M[r][c]
            M[i] = [a - f * b for a, b in zip(M[i], M[r])]
        r += 1
    return r


def greedy_basis(vs):
    basis = []
    for v in vs:
        if rank(basis + [v]) > len(basis):
            basis.append(v)
    return basis


def solve_coords(basis, x):
    """basis가 독립일 때 x = Σ c_i basis_i의 c (유리수 소거)."""
    n, k = len(x), len(basis)
    M = [[F(b[i]) for b in basis] + [F(x[i])] for i in range(n)]
    piv_cols, r = [], 0
    for c in range(k):
        p = next(i for i in range(r, n) if M[i][c] != 0)
        M[r], M[p] = M[p], M[r]
        M[r] = [v / M[r][c] for v in M[r]]
        for i in range(n):
            if i != r and M[i][c] != 0:
                f = M[i][c]
                M[i] = [a - f * b for a, b in zip(M[i], M[r])]
        r += 1
    return [M[i][k] for i in range(k)]


def main():
    rng = random.Random(10)
    for _ in range(500):
        u = [rng.randint(-9, 9), rng.randint(-9, 9)]
        u.append(-u[0] - u[1])
        v = [rng.randint(-9, 9), rng.randint(-9, 9)]
        v.append(-v[0] - v[1])
        c = rng.randint(-9, 9)
        assert sum(a + b for a, b in zip(u, v)) == 0 and sum(c * a for a in u) == 0
    B = [(1, 0, -1), (0, 1, -1)]
    assert rank(B) == 2 and solve_coords(B, (2, 3, -5)) == [2, 3]
    print("[OK] 주장 1·카드 C2: 예시 평면")

    for _ in range(200):
        s, t = rng.randint(-9, 9), rng.randint(-9, 9)
        assert (-s, s, 2 * t, t) == tuple(s * a + t * b for a, b in zip((-1, 1, 0, 0), (0, 0, 2, 1)))
    assert rank([(-1, 1, 0, 0), (0, 0, 2, 1)]) == 2
    print("[OK] 주장 2: 예제")

    for _ in range(300):
        n = rng.randint(1, 5)
        gens = [tuple(rng.randint(-3, 3) for _ in range(n)) for _ in range(rng.randint(1, 6))]
        if rng.random() < 0.5 and len(gens) >= 2:
            gens.append(tuple(a - 2 * b for a, b in zip(gens[0], gens[1])))
        b1 = greedy_basis(gens)
        shuffled = gens[:]
        rng.shuffle(shuffled)
        b2 = greedy_basis(shuffled)
        assert len(b1) == len(b2) == rank(gens)
        for v in gens:
            assert rank(b1 + [v]) == len(b1) and rank(b2 + [v]) == len(b2)
    print("[OK] 주장 3: 기저의 크기가 같다")

    for _ in range(300):
        n, k = rng.randint(1, 5), rng.randint(1, 3)
        vs = [tuple(rng.randint(-5, 5) for _ in range(n)) for _ in range(k)]
        m = k + rng.randint(1, 3)
        coefs = [[rng.randint(-4, 4) for _ in vs] for _ in range(m)]   # w_j마다 계수를 한 번만 뽑는다
        ws = [tuple(sum(c * v[i] for c, v in zip(cj, vs)) for i in range(n)) for cj in coefs]
        assert rank(ws) < m
    print("[OK] 주장 4: 보조정리")

    for _ in range(300):
        n = rng.randint(2, 5)
        basis = []
        while len(basis) < rng.randint(1, n):
            v = tuple(rng.randint(-5, 5) for _ in range(n))
            if rank(basis + [v]) > len(basis):
                basis.append(v)
        cs = [F(rng.randint(-9, 9)) for _ in basis]
        x = tuple(sum(c * b[i] for c, b in zip(cs, basis)) for i in range(n))
        assert solve_coords(basis, x) == cs
        for j in range(len(basis)):
            rest = basis[:j] + basis[j + 1:]
            assert rank(rest + [basis[j]]) > rank(rest)
        ec = [rng.randint(-3, 3) for _ in basis]
        extra = tuple(sum(c * b[i] for c, b in zip(ec, basis)) for i in range(n))
        assert rank(basis + [extra]) == len(basis)
    print("[OK] 주장 5·카드 C3: 좌표 유일, 최소 생성, 최대 독립")

    assert rank([(1, 1), (1, -1)]) == 2
    X = {(t, 0) for t in range(-5, 6)} | {(0, t) for t in range(-5, 6)}
    assert (1, 0) in X and (0, 1) in X and (1, 1) not in X
    print("[OK] 주장 6·오해·카드 C4")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
