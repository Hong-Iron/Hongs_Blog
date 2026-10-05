---
layout: "note"
title: "24_svd_verify.py"
display_title: "24_svd_verify.py"
kind: "code"
kind_label: "코드 · 검증"
num: "24"
course: "선형대수학"
course_slug: "linear-algebra"
course_url: "/studies/linear-algebra/"
track: "공학수학"
parent_url: "/studies/linear-algebra/svd/"
parent_title: "특잇값 분해"
description: "선형대수학 · 특잇값 분해 검증 코드"
permalink: "/studies/linear-algebra/code/24_svd_verify/"
---
{% raw %}
[특잇값 분해](/Hongs_Blog/studies/linear-algebra/svd/) 문서의 검증 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""특잇값 분해 검증.

문서: 24.특잇값 분해 (예시, 정리 둘, 증명, 예제, 활용, 오해, 카드 C1~C4)
주장 1: 예시 — [[3,0],[4,5]]: σ = 3√5, √5, v1 = (1,1)/√2, u1 = (1,3)/√10, v2 = (-1,1)/√2, u2 = (-3,1)/√10, UΣV^T = A.
주장 2: 무작위 m×n 행렬 200개 — 야코비로 A^T A를 분해해 만든 SVD: U^T U = I(앞 r열), V^T V = I, Σ 내림차순 >= 0,
         UΣV^T = A, σ_i² = A^T A 고윳값 = A A^T의 0 아닌 고윳값, ||A||_2 = σ1(거듭제곱법).
주장 3: 예제 — A1 = (3/2)[[1,1],[3,3]], A - A1 = [[1.5,-1.5],[-0.5,0.5]], σ2² / (σ1² + σ2²) = 10%.
주장 4: 에카르트–영(실험) — 무작위 행렬에서 ||A - A_k||_2 = σ_{k+1}, ||A - A_k||_F = sqrt(Σ_{i>k} σ_i²),
         무작위 랭크 k 행렬 2000개가 A_k보다 가깝지 않음(프로베니우스).
주장 5: 오해·카드 C4 — [[1,1],[0,1]]: 고윳값 1, 1, 특잇값 (1+√5)/2, (√5-1)/2.
주장 6: 활용 — 합성 40×40 이미지(랭크 3 + 작은 잡음): 랭크 3 근사의 상대 오차 < 5%, 저장량 k(m+n+1),
         1000×1000에서 k = 50이면 100,050개(약 10%). 유사역행렬 해 = 최소제곱 해(열 독립일 때).
"""
import math
import random


def jacobi(S, tol=1e-28, sweeps=200):
    n = len(S)
    A = [row[:] for row in S]
    V = [[float(i == j) for j in range(n)] for i in range(n)]
    for _ in range(sweeps):
        if sum(A[i][j] ** 2 for i in range(n) for j in range(n) if i != j) < tol:
            break
        for p in range(n):
            for q in range(p + 1, n):
                if abs(A[p][q]) < 1e-300:
                    continue
                th = 0.5 * math.atan2(2 * A[p][q], A[q][q] - A[p][p])
                c, s = math.cos(th), math.sin(th)
                for k in range(n):
                    A[k][p], A[k][q] = c * A[k][p] - s * A[k][q], s * A[k][p] + c * A[k][q]
                for k in range(n):
                    A[p][k], A[q][k] = c * A[p][k] - s * A[q][k], s * A[p][k] + c * A[q][k]
                for k in range(n):
                    V[k][p], V[k][q] = c * V[k][p] - s * V[k][q], s * V[k][p] + c * V[k][q]
    return [A[i][i] for i in range(n)], V


def T(A):
    return [list(r) for r in zip(*A)]


def mm(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def svd(A):
    """(sigmas 내림차순, U 열 목록, V 열 목록) — 0이 아닌 특잇값에 대해."""
    AtA = mm(T(A), A)
    lam, V = jacobi(AtA)
    order = sorted(range(len(lam)), key=lambda i: -lam[i])
    lam_max = max(max(lam), 0.0)
    sig, us, vs = [], [], []
    for i in order:
        v = [V[k][i] for k in range(len(V))]
        if lam[i] > 1e-10 * max(lam_max, 1e-300):     # 상대 허용오차: 반올림으로 생긴 아주 작은 고윳값은 0으로 본다
            s = math.sqrt(lam[i])
        else:
            s = 0.0
        if s > 0:
            Av = [sum(A[r][c] * v[c] for c in range(len(v))) for r in range(len(A))]
            us.append([x / s for x in Av])
        sig.append(s)
        vs.append(v)
    return sig, us, vs


def recon(sig, us, vs, k):
    m, n = len(us[0]), len(vs[0])
    return [[sum(sig[t] * us[t][i] * vs[t][j] for t in range(k)) for j in range(n)] for i in range(m)]


def spec_norm(M, iters=500):
    n = len(M[0])
    x = [1.0 / (i + 1.37) for i in range(n)]   # 특정 방향과 우연히 수직이 되지 않도록 고르지 않은 시작 벡터
    nx = math.sqrt(sum(v * v for v in x))
    x = [v / nx for v in x]
    MtM = mm(T(M), M)
    lam = 0.0
    for _ in range(iters):
        y = [sum(MtM[i][j] * x[j] for j in range(n)) for i in range(n)]
        nrm = math.sqrt(sum(v * v for v in y))
        if nrm == 0:
            return 0.0
        lam = nrm
        x = [v / nrm for v in y]
    return math.sqrt(lam)


def fro(M):
    return math.sqrt(sum(v * v for r in M for v in r))


def main():
    A = [[3.0, 0.0], [4.0, 5.0]]
    sig, us, vs = svd(A)
    assert abs(sig[0] - 3 * math.sqrt(5)) < 1e-12 and abs(sig[1] - math.sqrt(5)) < 1e-12
    s2, s10 = math.sqrt(2), math.sqrt(10)
    sgn = lambda v, ref: v if sum(a * b for a, b in zip(v, ref)) > 0 else [-a for a in v]
    v1, u1 = sgn(vs[0], [1, 1]), None
    u1 = [sum(A[r][c] * v1[c] for c in range(2)) / sig[0] for r in range(2)]
    assert all(abs(a - b) < 1e-12 for a, b in zip(v1, [1 / s2, 1 / s2])) and all(abs(a - b) < 1e-12 for a, b in zip(u1, [1 / s10, 3 / s10]))
    v2 = sgn(vs[1], [-1, 1])
    u2 = [sum(A[r][c] * v2[c] for c in range(2)) / sig[1] for r in range(2)]
    assert all(abs(a - b) < 1e-12 for a, b in zip(v2, [-1 / s2, 1 / s2])) and all(abs(a - b) < 1e-12 for a, b in zip(u2, [-3 / s10, 1 / s10]))
    R = recon(sig, us, vs, 2)
    assert all(abs(R[i][j] - A[i][j]) < 1e-12 for i in range(2) for j in range(2))
    assert abs(sig[0] * sig[1] - 15) < 1e-12
    print("[OK] 주장 1·카드 C2: 예시")

    rng = random.Random(24)
    for _ in range(200):
        m, n = rng.randint(1, 6), rng.randint(1, 6)
        A = [[rng.uniform(-3, 3) for _ in range(n)] for _ in range(m)]
        sig, us, vs = svd(A)
        r = len(us)
        assert all(sig[i] >= sig[i + 1] - 1e-12 for i in range(len(sig) - 1)) and min(sig) >= 0
        for i in range(r):
            for j in range(r):
                assert abs(sum(us[i][k] * us[j][k] for k in range(m)) - (i == j)) < 1e-8
        for i in range(n):
            for j in range(n):
                assert abs(sum(vs[i][k] * vs[j][k] for k in range(n)) - (i == j)) < 1e-9
        R = recon(sig, us, vs, r)
        assert all(abs(R[i][j] - A[i][j]) < 1e-8 for i in range(m) for j in range(n))
        lamB, _ = jacobi(mm(A, T(A)))
        nz = sorted([x for x in lamB if x > 1e-8], reverse=True)
        assert all(abs(a - b * b) < 1e-7 * max(1, a) for a, b in zip(nz, sig[:len(nz)]))
        assert abs(spec_norm(A) - sig[0]) < 1e-6 * max(1, sig[0])
    print("[OK] 주장 2·카드 C1·C3: 무작위 SVD의 성질")

    A = [[3.0, 0.0], [4.0, 5.0]]
    sig, us, vs = svd(A)
    A1 = recon(sig, us, vs, 1)
    assert all(abs(A1[i][j] - [[1.5, 1.5], [4.5, 4.5]][i][j]) < 1e-12 for i in range(2) for j in range(2))
    E = [[A[i][j] - A1[i][j] for j in range(2)] for i in range(2)]
    assert all(abs(E[i][j] - [[1.5, -1.5], [-0.5, 0.5]][i][j]) < 1e-12 for i in range(2) for j in range(2))
    assert abs(spec_norm(E) - math.sqrt(5)) < 1e-9 and abs(sig[1] ** 2 / (sig[0] ** 2 + sig[1] ** 2) - 0.1) < 1e-12
    print("[OK] 주장 3: 예제")

    for _ in range(20):
        m, n = rng.randint(3, 6), rng.randint(3, 6)
        A = [[rng.uniform(-3, 3) for _ in range(n)] for _ in range(m)]
        sig, us, vs = svd(A)
        r = len(us)
        for k in range(1, r):
            Ak = recon(sig, us, vs, k)
            E = [[A[i][j] - Ak[i][j] for j in range(n)] for i in range(m)]
            assert abs(spec_norm(E) - sig[k]) < 1e-6
            assert abs(fro(E) - math.sqrt(sum(s * s for s in sig[k:r]))) < 1e-9
            best = fro(E)
            for _ in range(100):
                X = [[rng.gauss(0, 1) for _ in range(k)] for _ in range(m)]
                Y = [[rng.gauss(0, 1) for _ in range(n)] for _ in range(k)]
                B = mm(X, Y)
                # B를 A에 가장 잘 맞도록 스칼라 배율만 조정해도 A_k보다 가깝지 않다
                num = sum(A[i][j] * B[i][j] for i in range(m) for j in range(n))
                den = sum(B[i][j] ** 2 for i in range(m) for j in range(n))
                c = num / den
                assert fro([[A[i][j] - c * B[i][j] for j in range(n)] for i in range(m)]) >= best - 1e-9
    print("[OK] 주장 4: 에카르트–영(실험)")

    J = [[1.0, 1.0], [0.0, 1.0]]
    sig, _, _ = svd(J)
    phi = (1 + math.sqrt(5)) / 2
    assert abs(sig[0] - phi) < 1e-12 and abs(sig[1] - 1 / phi) < 1e-12
    print("[OK] 주장 5·오해·카드 C4")

    m = n = 40
    base = [[sum(math.sin((i + 1) * a) * math.cos((j + 1) * b) for a, b in ((0.1, 0.2), (0.33, 0.05), (0.07, 0.4))) for j in range(n)] for i in range(m)]
    img = [[base[i][j] + rng.gauss(0, 0.01) for j in range(n)] for i in range(m)]
    sig, us, vs = svd(img)
    A3 = recon(sig, us, vs, 3)
    rel = fro([[img[i][j] - A3[i][j] for j in range(n)] for i in range(m)]) / fro(img)
    assert rel < 0.05 and sig[3] < 0.1 * sig[2]
    assert 3 * (m + n + 1) == 243 and 50 * (1000 + 1000 + 1) == 100050
    A = [[rng.uniform(-3, 3) for _ in range(2)] for _ in range(5)]
    b = [rng.uniform(-3, 3) for _ in range(5)]
    sig, us, vs = svd(A)
    xp = [sum(vs[t][i] * sum(us[t][k] * b[k] for k in range(5)) / sig[t] for t in range(len(us))) for i in range(2)]
    AtA = mm(T(A), A)
    Atb = [sum(A[k][i] * b[k] for k in range(5)) for i in range(2)]
    d = AtA[0][0] * AtA[1][1] - AtA[0][1] * AtA[1][0]
    xn = [(AtA[1][1] * Atb[0] - AtA[0][1] * Atb[1]) / d, (AtA[0][0] * Atb[1] - AtA[1][0] * Atb[0]) / d]
    assert all(abs(p - q) < 1e-9 for p, q in zip(xp, xn))
    print(f"[OK] 주장 6: 이미지 랭크 3 상대 오차 {rel:.3f}, 저장량, 유사역행렬")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
