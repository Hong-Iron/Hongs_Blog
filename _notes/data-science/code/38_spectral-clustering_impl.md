---
layout: "note"
title: "38_spectral-clustering_impl.py"
display_title: "38_spectral-clustering_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "38"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/spectral-clustering/"
parent_title: "스펙트럼 군집화"
description: "데이터 과학 · 스펙트럼 군집화 구현 코드"
permalink: "/studies/data-science/code/38_spectral-clustering_impl/"
---
{% raw %}
[스펙트럼 군집화](/Hongs_Blog/studies/data-science/spectral-clustering/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""그래프 분할과 스펙트럼 군집화 - 구현과 자체 테스트 (고유분해는 야코비 방법으로 직접 계산).

문서: 37.그래프 분할과 정규화 컷 (예시, 정의, 카드), 38.스펙트럼 군집화 (예시, 정의, 증명, 카드)
출처: 데이터 과학 10회 슬라이드 10-2 p.11~18
주장:
  1. 슬라이드 p.15의 4꼭짓점 그래프(1-2, 1-3, 2-3, 2-4, 3-4): D = diag(2, 3, 3, 2), L = D - A가 슬라이드와 같다.
  2. f_i = ±1이면 fᵀLf = Σ_{i<j} w_ij (f_i - f_j)² = 4·cut(A, B). (모든 나눔에서 확인)
  3. L의 가장 작은 고윳값은 0이고 고유벡터는 모두 같은 값(나누지 않음). 둘째로 작은 고유벡터의 부호로 나눈다.
  4. 삼각형 둘을 다리 하나로 이은 그래프: 둘째 고유벡터의 부호가 두 삼각형을 가른다. 컷 1, NCut = 1/7 + 1/7.
  5. 컷만 최소화하면 꼭짓점 하나를 떼는 답이 나올 수 있다(꼬리가 달린 그래프). NCut은 크기가 비슷한 나눔을 고른다.
  6. 일반화 고유문제 Lf = λDf는 D^{-1/2} L D^{-1/2} g = λ g, f = D^{-1/2} g로 푼다.
  7. 덩어리 셋 그래프: 둘째·셋째 고유벡터로 점을 옮기면 같은 덩어리가 같은 자리에 모인다(k-분할).
"""
import math
from itertools import product


def jacobi(A, iters=200):
    n = len(A); A = [r[:] for r in A]; V = [[float(i == j) for j in range(n)] for i in range(n)]
    for _ in range(iters):
        off = max((abs(A[i][j]), i, j) for i in range(n) for j in range(n) if i < j) if n > 1 else (0, 0, 0)
        if off[0] < 1e-12:
            break
        _, p, q = off
        th = 0.5 * math.atan2(2 * A[p][q], A[q][q] - A[p][p])
        c, s = math.cos(th), math.sin(th)
        for k in range(n):
            akp, akq = A[k][p], A[k][q]
            A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq
        for k in range(n):
            apk, aqk = A[p][k], A[q][k]
            A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk
        for k in range(n):
            vkp, vkq = V[k][p], V[k][q]
            V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq
    vals = [A[i][i] for i in range(n)]
    order = sorted(range(n), key=lambda i: vals[i])
    return [vals[i] for i in order], [[V[k][i] for k in range(n)] for i in order]


def laplacian(n, edges):
    W = [[0.0] * n for _ in range(n)]
    for i, j, w in edges:
        W[i][j] = W[j][i] = w
    D = [sum(r) for r in W]
    L = [[(D[i] if i == j else 0) - W[i][j] for j in range(n)] for i in range(n)]
    return W, D, L


def cut(W, A):
    return sum(W[i][j] for i in A for j in range(len(W)) if j not in A)


def ncut(W, D, A):
    c = cut(W, A); va = sum(D[i] for i in A); vb = sum(D) - va
    return c / va + c / vb


def fiedler(W, D, L, normalized=True):
    n = len(W)
    if normalized:
        Dm = [1 / math.sqrt(d) for d in D]
        M = [[Dm[i] * L[i][j] * Dm[j] for j in range(n)] for i in range(n)]
        vals, vecs = jacobi(M)
        return vals, [[Dm[i] * v[i] for i in range(n)] for v in vecs]
    return jacobi(L)


def main():
    W, D, L = laplacian(4, [(0, 1, 1), (0, 2, 1), (1, 2, 1), (1, 3, 1), (2, 3, 1)])
    assert D == [2, 3, 3, 2]
    assert L == [[2, -1, -1, 0], [-1, 3, -1, -1], [-1, -1, 3, -1], [0, -1, -1, 2]]
    print("[OK] p.15: D = diag(2,3,3,2), L = D - A")
    for f in product((1, -1), repeat=4):
        A = {i for i in range(4) if f[i] == 1}
        q = sum(f[i] * L[i][j] * f[j] for i in range(4) for j in range(4))
        assert q == 4 * cut(W, A)
    print("[OK] 모든 ±1 나눔에서 fᵀLf = 4·cut")
    vals, vecs = jacobi(L)
    assert abs(vals[0]) < 1e-9 and max(vecs[0]) - min(vecs[0]) < 1e-9
    print("     p.15 그래프 L의 고윳값:", [round(v, 3) for v in vals], "둘째 고유벡터:", [round(x, 3) for x in vecs[1]])

    # 카드 C2: 경로 1-2-3, f = (1, 1, -1)
    W2, D2, L2 = laplacian(3, [(0, 1, 1), (1, 2, 1)])
    f = [1, 1, -1]
    assert D2 == [1, 2, 1] and sum(f[i] * L2[i][j] * f[j] for i in range(3) for j in range(3)) == 4 == 4 * cut(W2, {0, 1})
    print("[OK] 카드 C2: fᵀLf = 4 = 4·cut")

    # 삼각형 둘 + 다리
    E = [(0, 1, 1), (0, 2, 1), (1, 2, 1), (3, 4, 1), (3, 5, 1), (4, 5, 1), (2, 3, 1)]
    W, D, L = laplacian(6, E)
    vals, vecs = fiedler(W, D, L)
    f = vecs[1]; A = {i for i in range(6) if f[i] > 0}
    assert A in ({0, 1, 2}, {3, 4, 5})
    assert cut(W, {0, 1, 2}) == 1 and abs(ncut(W, D, {0, 1, 2}) - 2 / 7) < 1e-12
    print(f"[OK] 두 삼각형: 둘째 고유벡터 부호로 {sorted(A)} / 나머지, 컷 1, NCut 2/7")

    # 꼬리: 큰 덩어리(완전그래프 K4 두 개를 다리 둘로) + 꼭짓점 하나가 약한 간선으로 매달림
    E = [(i, j, 1) for i in range(4) for j in range(i + 1, 4)] + [(i, j, 1) for i in range(4, 8) for j in range(i + 1, 8)]
    E += [(3, 4, 1), (2, 5, 1), (7, 8, 0.5)]
    W, D, L = laplacian(9, E)
    allA = [set(c) for r in range(1, 9) for c in __import__("itertools").combinations(range(9), r)]
    best_cut = min(allA, key=lambda A: (cut(W, A), len(A)))
    best_ncut = min(allA, key=lambda A: ncut(W, D, A))
    assert best_cut in ({8}, set(range(8)))
    assert best_ncut in ({0, 1, 2, 3}, {4, 5, 6, 7, 8})
    vals, vecs = fiedler(W, D, L)
    A = {i for i in range(9) if vecs[1][i] > 0}
    assert A in ({0, 1, 2, 3}, {4, 5, 6, 7, 8})
    print(f"[OK] 컷 최소는 꼬리 하나 {sorted(best_cut) if len(best_cut) == 1 else '[8]'} (컷 0.5), NCut 최소와 스펙트럼 나눔은 두 덩어리")

    # 덩어리 셋 (각 K4), 덩어리 사이 간선 하나씩
    E = []
    for b in range(3):
        E += [(4 * b + i, 4 * b + j, 1) for i in range(4) for j in range(i + 1, 4)]
    E += [(3, 4, 0.2), (7, 8, 0.2), (11, 0, 0.2)]
    W, D, L = laplacian(12, E)
    vals, vecs = fiedler(W, D, L)
    emb = [(vecs[1][i], vecs[2][i]) for i in range(12)]
    for b in range(3):
        pts = emb[4 * b:4 * b + 4]
        spread = max(math.dist(p, q) for p in pts for q in pts)
        others = min(math.dist(p, q) for p in pts for c in range(3) if c != b for q in emb[4 * c:4 * c + 4])
        assert spread < others
    print("[OK] 덩어리 셋: 둘째·셋째 고유벡터 공간에서 같은 덩어리가 가깝게 모이고 서로 떨어진다")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
