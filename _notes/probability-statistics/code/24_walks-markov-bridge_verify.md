---
layout: "note"
title: "24_walks-markov-bridge_verify.py"
display_title: "24_walks-markov-bridge_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "확률과 통계"
course_slug: "probability-statistics"
course_url: "/studies/probability-statistics/"
track: "수학"
parent_url: "/studies/probability-statistics/walks-markov-bridge/"
parent_title: "인접행렬 거듭제곱 ↔ 마르코프 전이"
description: "확률과 통계 · 인접행렬 거듭제곱 ↔ 마르코프 전이 검증 코드"
permalink: "/studies/probability-statistics/code/24_walks-markov-bridge_verify/"
---
{% raw %}
[인접행렬 거듭제곱 ↔ 마르코프 전이](/Hongs_Blog/studies/probability-statistics/walks-markov-bridge/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""인접행렬 거듭제곱 ↔ 마르코프 전이 검증.

문서: 24.인접행렬 거듭제곱 ↔ 마르코프 전이 (비교, 대응, 이 연결로 얻는 것, 전이 문제, 카드 C1~C3)
주장 1: 무작위 그래프에서 (A^k)_ij = 길이 k 보행 수(전수 나열), (P^k)_ij = k걸음 무작위 보행 확률(모의실험).
주장 2: 무방향 연결 그래프의 무작위 보행 P = D⁻¹A의 정상분포는 deg(i)/2m.
주장 3: 이분 그래프이면 A의 고윳값에 -λ_max가 있고 무작위 보행이 주기 2(분포가 번갈아 수렴하지 않음). 홀수 사이클이 있으면 수렴.
주장 4: 전이 문제 — "11"이 없는 길이 k 이진 문자열 수 = 2상태 그래프의 보행 수 = 피보나치 F(k+2).
주장 5: 카드 C1 — 경로 1-2-3-4에서 (A²)_{13} = 1, (A²)_{22} = 2. 카드 C2 — 별 그래프(중심 1, 잎 4)의 정상분포 중심 1/2, 잎 1/8.
"""
from itertools import product
import random


def matmul(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def matpow(A, k):
    n = len(A)
    R = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
    for _ in range(k):
        R = matmul(R, A)
    return R


def walks(A, i, j, k):
    n = len(A)
    cnt = 0
    for mid in product(range(n), repeat=k - 1):
        path = (i,) + mid + (j,)
        if all(A[path[t]][path[t + 1]] for t in range(k)):
            cnt += 1
    return cnt


def main():
    rng = random.Random(24)
    for _ in range(30):
        n = rng.randint(3, 5)
        A = [[0] * n for _ in range(n)]
        for a in range(n):
            for b in range(n):
                if a != b and rng.random() < 0.5:
                    A[a][b] = 1
        for k in (1, 2, 3):
            Ak = matpow(A, k)
            for i in range(n):
                for j in range(n):
                    assert Ak[i][j] == walks(A, i, j, k)
    G = [[0, 1, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 1, 0]]
    deg = [sum(r) for r in G]
    P = [[G[i][j] / deg[i] for j in range(4)] for i in range(4)]
    P3 = matpow(P, 3)
    hits = 0
    for _ in range(100000):
        v = 0
        for _ in range(3):
            v = rng.choice([j for j in range(4) if G[v][j]])
        hits += v == 3
    assert abs(hits / 100000 - P3[0][3]) < 0.005
    print("[OK] 주장 1: 보행 수와 보행 확률")

    m = sum(deg) // 2
    pi = [d / (2 * m) for d in deg]
    piP = [sum(pi[i] * P[i][j] for i in range(4)) for j in range(4)]
    assert all(abs(a - b) < 1e-12 for a, b in zip(pi, piP))
    print("[OK] 주장 2: 정상분포 deg/2m")

    C4 = [[0, 1, 0, 1], [1, 0, 1, 0], [0, 1, 0, 1], [1, 0, 1, 0]]   # 짝수 사이클(이분)
    v = [1, -1, 1, -1]
    Av = [sum(C4[i][j] * v[j] for j in range(4)) for i in range(4)]
    assert Av == [-2 * t for t in v]                                   # 고윳값 -2 = -λ_max
    Pc = [[C4[i][j] / 2 for j in range(4)] for i in range(4)]
    d = [1, 0, 0, 0]
    seq = []
    for _ in range(6):
        d = [sum(d[i] * Pc[i][j] for i in range(4)) for j in range(4)]
        seq.append(d[0])
    assert seq[0] == 0 and seq[1] == 0.5 and seq[4] == 0 and seq[5] == 0.5
    C3 = [[0, 1, 1], [1, 0, 1], [1, 1, 0]]                              # 홀수 사이클
    Pt = [[C3[i][j] / 2 for j in range(3)] for i in range(3)]
    d = [1, 0, 0]
    for _ in range(60):
        d = [sum(d[i] * Pt[i][j] for i in range(3)) for j in range(3)]
    assert all(abs(x - 1 / 3) < 1e-12 for x in d)
    print("[OK] 주장 3: 이분 그래프의 주기성")

    T = [[1, 1], [1, 0]]   # 상태 0 = 마지막이 0(또는 시작), 1 = 마지막이 1
    fib = [0, 1]
    for _ in range(40):
        fib.append(fib[-1] + fib[-2])
    for k in range(1, 16):
        brute = sum(1 for s in product("01", repeat=k) if "11" not in "".join(s))
        Tk = matpow(T, k)
        assert brute == Tk[0][0] + Tk[0][1] == fib[k + 2]
    print("[OK] 주장 4: 전이 문제(피보나치)")

    Pth = [[0, 1, 0, 0], [1, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0]]
    A2 = matpow(Pth, 2)
    assert A2[0][2] == 1 and A2[1][1] == 2
    star_deg = [4, 1, 1, 1, 1]
    assert [d / 8 for d in star_deg] == [0.5, 0.125, 0.125, 0.125, 0.125]
    print("[OK] 주장 5: 카드 C1·C2")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
