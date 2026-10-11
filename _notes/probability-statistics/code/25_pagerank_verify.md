---
layout: "note"
title: "25_pagerank_verify.py"
display_title: "25_pagerank_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "25"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/pagerank/"
parent_title: "PageRank"
description: "확률과 통계 · PageRank 검증 코드"
permalink: "/studies/probability-statistics/code/25_pagerank_verify/"
---
{% raw %}
[PageRank](/Hongs_Blog/studies/probability-statistics/pagerank/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""PageRank 검증.

문서: 25.PageRank (예시, 정의, 정확성, 예제, 활용, 카드 C1~C3)
주장 1: 예시·카드 C1 — 네 페이지(A→B, A→C, B→C, C→A, D→C), d = 0.85: 반복 추적 표 1~3회와 수렴값 (0.3725, 0.1958, 0.3941, 0.0375).
주장 2: 정확성 — 거듭제곱법 결과가 선형방정식 r(I - dP) = (1-d)/n·1의 해(가우스 소거)와 일치(무작위 그래프 100개, 댕글링 포함).
주장 3: 불변식 — 매 반복 r은 음이 아니고 합이 1. 수렴 속도 — L1 오차가 매 반복 d배 이하로 준다.
주장 4: 반복 수 — 허용오차 1e-8이면 약 log(1e-8)/log(0.85) ≈ 114회 안쪽.
주장 5: 순간이동의 필요성 — d = 1이면 갇힌 구역(서로만 가리키는 두 페이지)이 모든 점수를 빨아들이고, 사이클에서는 진동한다.
주장 6: 카드 C2 — 설명 카드의 코드 한 줄이 한 반복과 같다.
"""
import random


def power(links, n, d, iters=None, tol=1e-13):
    r = [1.0 / n] * n
    hist = [r]
    for _ in range(iters or 10000):
        dangling = sum(r[i] for i in range(n) if not links.get(i))
        new = [(1 - d) / n + d * dangling / n] * n
        for i, outs in links.items():
            for j in outs:
                new[j] += d * r[i] / len(outs)
        hist.append(new)
        done = sum(abs(a - b) for a, b in zip(new, r)) < tol
        r = new
        if iters is None and done:
            break
    return r, hist


def solve(M, b):
    n = len(M)
    A = [row[:] + [v] for row, v in zip(M, b)]
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(A[i][k]))
        A[k], A[p] = A[p], A[k]
        for i in range(k + 1, n):
            f = A[i][k] / A[k][k]
            A[i] = [a - f * c for a, c in zip(A[i], A[k])]
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = (A[i][n] - sum(A[i][j] * x[j] for j in range(i + 1, n))) / A[i][i]
    return x


def main():
    links = {0: [1, 2], 1: [2], 2: [0], 3: [2]}
    r, hist = power(links, 4, 0.85)
    assert [round(x, 4) for x in hist[1]] == [0.25, 0.1437, 0.5687, 0.0375]
    assert [round(x, 4) for x in hist[2]] == [0.5209, 0.1437, 0.2978, 0.0375]
    assert [round(x, 4) for x in hist[3]] == [0.2906, 0.2589, 0.413, 0.0375]
    assert [round(x, 4) for x in r] == [0.3725, 0.1958, 0.3941, 0.0375]
    print("[OK] 주장 1·카드 C1: 추적 표와 수렴값")

    rng = random.Random(25)
    for _ in range(100):
        n = rng.randint(2, 8)
        L = {i: [j for j in range(n) if j != i and rng.random() < 0.4] for i in range(n)}
        d = rng.uniform(0.5, 0.95)
        r, hist = power(L, n, d)
        # 전이행렬(댕글링은 균등 행)
        P = [[(1 / len(L[i]) if j in L[i] else 0.0) if L[i] else 1 / n for j in range(n)] for i in range(n)]
        # r = r(dP) + (1-d)/n·1  ⇔  (I - dPᵀ) rᵀ = (1-d)/n·1
        M = [[(1 if i == j else 0) - d * P[j][i] for j in range(n)] for i in range(n)]
        x = solve(M, [(1 - d) / n] * n)
        assert all(abs(a - b) < 1e-9 for a, b in zip(r, x))
        for h in hist:
            assert min(h) >= 0 and abs(sum(h) - 1) < 1e-12
        errs = [sum(abs(a - b) for a, b in zip(h, x)) for h in hist[:30]]
        for e0, e1 in zip(errs, errs[1:]):
            assert e1 <= d * e0 + 1e-12
    print("[OK] 주장 2·3: 선형방정식과 일치, 합 1, 오차 d배 감소")

    big_n = 300
    L = {i: [j for j in rng.sample(range(big_n), 5) if j != i] for i in range(big_n)}
    r = [1 / big_n] * big_n
    it = 0
    while True:
        it += 1
        dangling = sum(r[i] for i in range(big_n) if not L[i])
        new = [0.15 / big_n + 0.85 * dangling / big_n] * big_n
        for i, outs in L.items():
            for j in outs:
                new[j] += 0.85 * r[i] / len(outs)
        diff = sum(abs(a - b) for a, b in zip(new, r))
        r = new
        if diff < 1e-8:
            break
    assert it <= 114
    import math
    assert math.ceil(math.log(1e-8) / math.log(0.85)) == 114 and 0.85 ** 113 > 1e-8 >= 0.85 ** 114   # 예제의 반복 수 상한
    print(f"[OK] 주장 4: 반복 {it}회 (한계 114)")

    trap = {0: [1, 2], 1: [2], 2: [3], 3: [2]}      # 2와 3이 서로만 가리킨다
    r1, _ = power(trap, 4, 1.0, iters=2000)
    assert r1[0] < 1e-9 and r1[1] < 1e-9 and abs(r1[2] + r1[3] - 1) < 1e-9
    Pc = [[0.0, 1.0], [1.0, 0.0]]                    # 서로만 가리키는 두 페이지, d = 1
    rr, seq = [1.0, 0.0], []                         # 한쪽에서 출발하면
    for _ in range(4):
        rr = [sum(rr[i] * Pc[i][j] for i in range(2)) for j in range(2)]
        seq.append(rr[0])
    assert seq == [0.0, 1.0, 0.0, 1.0]               # 점수가 번갈아 뛰며 수렴하지 않는다
    print("[OK] 주장 5: 순간이동이 없을 때의 실패")

    r0 = [0.25] * 4
    one = power(links, 4, 0.85, iters=1)[1][1]
    n = 4
    snippet = [0.15 / n + sum(0.85 * r0[i] / len(links[i]) for i in links if j in links[i]) for j in range(n)]
    assert all(abs(a - b) < 1e-15 for a, b in zip(one, snippet))
    print("[OK] 주장 6: 카드 C2")
    # 데이터 과학 13회 관점: 슬라이드 p.10 거듭제곱법, p.12 막다른 페이지, p.14 구글 행렬
    from fractions import Fraction as Fr
    def step(r, M):
        return [sum(r[i] * M[i][j] for i in range(len(r))) for j in range(len(r))]
    M = [[Fr(1, 2), Fr(1, 2), 0], [Fr(1, 2), 0, Fr(1, 2)], [0, 1, 0]]
    r = [Fr(1, 3)] * 3
    seq = []
    for _ in range(3):
        r = step(r, M); seq.append(r)
    assert seq == [[Fr(1, 3), Fr(1, 2), Fr(1, 6)], [Fr(5, 12), Fr(1, 3), Fr(1, 4)], [Fr(9, 24), Fr(11, 24), Fr(1, 6)]]
    st = [Fr(6, 15), Fr(6, 15), Fr(3, 15)]
    assert step(st, M) == st
    Mde = [[0, 1, 0], [Fr(1, 3)] * 3, [0, 1, 0]]
    r1 = step([Fr(1, 3)] * 3, Mde); r2 = step(r1, Mde)
    assert r1 == [Fr(1, 9), Fr(7, 9), Fr(1, 9)] and r2 == [Fr(7, 27), Fr(13, 27), Fr(7, 27)]
    G = [[Fr(4, 5) * M[i][j] + Fr(1, 5) * Fr(1, 3) for j in range(3)] for i in range(3)]
    assert G == [[Fr(7, 15), Fr(7, 15), Fr(1, 15)], [Fr(7, 15), Fr(1, 15), Fr(7, 15)], [Fr(1, 15), Fr(13, 15), Fr(1, 15)]]
    Gm = [[Fr(4, 5) * M[i][j] - Fr(1, 5) * Fr(1, 3) for j in range(3)] for i in range(3)]
    assert all(sum(row) == Fr(3, 5) for row in Gm)        # 빼기로 하면 행의 합이 2β - 1 = 0.6
    print("[OK] 데이터 과학 관점·카드 C4: r^1~r^3, 정상분포 (6,6,3)/15, 막다른 페이지 (7,13,7)/27, G 성분(더하기)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
