---
layout: "note"
title: "09_linear-independence_verify.py"
display_title: "09_linear-independence_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "09"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "수학"
parent_url: "/studies/linear-algebra/linear-independence/"
parent_title: "선형독립"
description: "선형대수학 · 선형독립 검증 코드"
permalink: "/studies/linear-algebra/code/09_linear-independence_verify/"
---
{% raw %}
[선형독립](/Hongs_Blog/studies/linear-algebra/linear-independence/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""선형독립 검증.

문서: 09.선형독립 (예시, 정의, 동치 정의, 정리, 증명, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — (2,3) = 2(1,0) + 3(0,1) = 1(1,0) + 2(0,1) + 1(1,1).
주장 2: 동치 조건 — 무작위 정수 벡터 모임(k <= 4, n <= 4) 1000개에서
         (피벗이 모든 열에) <=> (Ac = 0의 해가 0뿐, 작은 범위 전수) <=> (어느 벡터도 나머지의 결합이 아님, 유리수 풀이) 판정이 같다.
주장 3: 정리 — R^n의 n+1개 벡터는 늘 종속(무작위 500개).
주장 4: 예 — e1,e2,e3 / (1,2),(3,1) / (1,0,0),(1,1,0),(1,1,1) 독립, (1,2),(2,4)와 0을 포함한 모임은 종속.
주장 5: 예제 — (1,1,0),(0,1,1),(1,0,1)의 피벗 1,1,2(독립), (1,2,1)로 바꾸면 종속.
         카드 C2 — (7,8,9) = 2(4,5,6) - (1,2,3). 카드 C3·오해 — (1,0),(0,1),(1,1).
주장 6: 활용 — 해밍(7,4): H의 열은 서로 다른 0 아닌 3비트, 부호어 16개, 최소 무게 3, 한 비트 오류의 신드롬이 모두 다름.
"""
import random
from fractions import Fraction as F
from itertools import product


def rank(vectors):
    """벡터들을 열로 세운 행렬의 피벗 수."""
    if not vectors:
        return 0
    n = len(vectors[0])
    M = [[F(v[i]) for v in vectors] for i in range(n)]
    r = 0
    for c in range(len(vectors)):
        p = next((i for i in range(r, n) if M[i][c] != 0), None)
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]
        for i in range(r + 1, n):
            f = M[i][c] / M[r][c]
            M[i] = [a - f * b for a, b in zip(M[i], M[r])]
        r += 1
    return r


def pivots_list(vectors):
    n = len(vectors[0])
    M = [[F(v[i]) for v in vectors] for i in range(n)]
    piv = []
    r = 0
    for c in range(len(vectors)):
        p = next((i for i in range(r, n) if M[i][c] != 0), None)
        if p is None:
            continue
        M[r], M[p] = M[p], M[r]
        for i in range(r + 1, n):
            f = M[i][c] / M[r][c]
            M[i] = [a - f * b for a, b in zip(M[i], M[r])]
        piv.append(M[r][c])
        r += 1
    return piv


def main():
    e1, e2, s = (1, 0), (0, 1), (1, 1)
    comb = lambda cs, vs: tuple(sum(c * v[i] for c, v in zip(cs, vs)) for i in range(2))
    assert comb((2, 3), (e1, e2)) == (2, 3) == comb((1, 2, 1), (e1, e2, s))
    print("[OK] 주장 1: 예시")

    rng = random.Random(9)
    for _ in range(1000):
        n, k = rng.randint(1, 4), rng.randint(1, 4)
        vs = [tuple(rng.randint(-2, 2) for _ in range(n)) for _ in range(k)]
        if rng.random() < 0.3 and k >= 2:
            vs[-1] = tuple(a + b for a, b in zip(vs[0], vs[1 % k]))
        c_piv = rank(vs) == k
        c_null = not any(any(cs) and all(sum(c * v[i] for c, v in zip(cs, vs)) == 0 for i in range(n))
                         for cs in product(range(-4, 5), repeat=k))
        c_none = all(rank([v for j, v in enumerate(vs) if j != i] + [vs[i]]) > rank([v for j, v in enumerate(vs) if j != i])
                     for i in range(k))
        assert c_piv == c_none
        if c_piv:
            assert c_null
    print("[OK] 주장 2·카드 C1: 동치 조건")

    for _ in range(500):
        n = rng.randint(1, 5)
        vs = [tuple(rng.randint(-9, 9) for _ in range(n)) for _ in range(n + 1)]
        assert rank(vs) < n + 1
    print("[OK] 주장 3·카드 C4: n+1개는 종속")

    assert rank([(1, 0, 0), (0, 1, 0), (0, 0, 1)]) == 3 and rank([(1, 2), (3, 1)]) == 2
    assert rank([(1, 0, 0), (1, 1, 0), (1, 1, 1)]) == 3
    assert rank([(1, 2), (2, 4)]) == 1 and rank([(0, 0, 0), (1, 2, 3)]) < 2
    print("[OK] 주장 4: 해당하는 예·않는 예")

    assert pivots_list([(1, 1, 0), (0, 1, 1), (1, 0, 1)]) == [1, 1, 2]
    assert rank([(1, 1, 0), (0, 1, 1), (1, 2, 1)]) == 2
    assert rank([(1, 2, 3), (4, 5, 6), (7, 8, 9)]) == 2 and (7, 8, 9) == tuple(2 * b - a for a, b in zip((1, 2, 3), (4, 5, 6)))
    assert rank([(1, 0), (0, 1), (1, 1)]) == 2
    print("[OK] 주장 5·예제·카드 C2·C3·오해")

    cols = [tuple((j >> b) & 1 for b in (2, 1, 0)) for j in range(1, 8)]
    H = [[c[i] for c in cols] for i in range(3)]
    code = [x for x in product((0, 1), repeat=7) if all(sum(h * xi for h, xi in zip(row, x)) % 2 == 0 for row in H)]
    assert len(code) == 16 and min(sum(x) for x in code if any(x)) == 3
    synd = {tuple(H[i][j] for i in range(3)) for j in range(7)}
    assert len(synd) == 7 and (0, 0, 0) not in synd
    print("[OK] 주장 6: 해밍(7, 4)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
