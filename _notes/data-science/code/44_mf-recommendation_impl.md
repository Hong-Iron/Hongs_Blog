---
layout: "note"
title: "44_mf-recommendation_impl.py"
display_title: "44_mf-recommendation_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "44"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/mf-recommendation/"
parent_title: "행렬 분해 추천"
description: "데이터 과학 · 행렬 분해 추천 구현 코드"
permalink: "/studies/data-science/code/44_mf-recommendation_impl/"
---
{% raw %}
[행렬 분해 추천](/Hongs_Blog/studies/data-science/mf-recommendation/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""행렬 분해 추천(PureSVD, Biased MF) 구현과 실험.

문서: 44.행렬 분해 추천 (예시, 정의, 카드)
출처: 데이터 과학 12회 슬라이드 12-1 p.3~16
PureSVD: 빈칸을 0으로 채운 R을 특잇값 분해하고 위 d개만 남겨 다시 곱한다(학습 없음, 닫힌 해).
         특잇값 분해는 RᵀR의 고유분해(야코비)로 구한다: RᵀR = V Σ² Vᵀ, U = R V Σ⁻¹.
Biased MF: r̂_ui = μ + b_u + b_i + p_uᵀq_i, 관측된 칸에서 (r - r̂)² + λ(b_u² + b_i² + ||p||² + ||q||²)를 확률적 경사 하강으로 최소화.
주장:
  1. 계수 d의 PureSVD 재구성은 d가 커질수록 R에 가까워지고 d = 전체 계수면 R과 같다.
  2. PureSVD는 빈칸(0)을 "싫어함"으로 학습한다: 관측 평점이 모두 5인 사용자의 빈칸 예측도 0 근처로 끌린다.
  3. Biased MF의 사용자 편향은 늘 후하게 주는 사용자에서 양수, 짜게 주는 사용자에서 음수가 된다.
  4. Biased MF의 훈련 오차는 학습할수록 줄어든다.
  5. 카드 C2: μ = 3.5, b_u = 0.5, b_i = -0.3, p·q = 0.4 -> 예측 4.1.
"""
import math
import random


def jacobi(A, iters=500):
    n = len(A); A = [r[:] for r in A]; V = [[float(i == j) for j in range(n)] for i in range(n)]
    for _ in range(iters):
        off = max(((abs(A[i][j]), i, j) for i in range(n) for j in range(n) if i < j), default=(0, 0, 0))
        if off[0] < 1e-12:
            break
        _, p, q = off
        th = 0.5 * math.atan2(2 * A[p][q], A[q][q] - A[p][p]); c, s = math.cos(th), math.sin(th)
        for k in range(n):
            a, b = A[k][p], A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b
        for k in range(n):
            a, b = A[p][k], A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b
        for k in range(n):
            a, b = V[k][p], V[k][q]; V[k][p] = c * a - s * b; V[k][q] = s * a + c * b
    order = sorted(range(n), key=lambda i: -A[i][i])
    return [A[i][i] for i in order], [[V[k][i] for k in range(n)] for i in order]


def puresvd(R, d):
    m = len(R[0])
    RtR = [[sum(R[u][i] * R[u][j] for u in range(len(R))) for j in range(m)] for i in range(m)]
    vals, vecs = jacobi(RtR)
    out = [[0.0] * m for _ in R]
    for k in range(d):
        if vals[k] < 1e-10:
            continue
        sig = math.sqrt(vals[k]); v = vecs[k]
        u = [sum(R[a][j] * v[j] for j in range(m)) / sig for a in range(len(R))]
        for a in range(len(R)):
            for j in range(m):
                out[a][j] += sig * u[a] * v[j]
    return out


def biased_mf(obs, nu, ni, k=2, lr=0.02, lam=0.02, epochs=300, seed=0):
    rnd = random.Random(seed)
    mu = sum(r for _, _, r in obs) / len(obs)
    bu = [0.0] * nu; bi = [0.0] * ni
    P = [[rnd.gauss(0, 0.1) for _ in range(k)] for _ in range(nu)]
    Q = [[rnd.gauss(0, 0.1) for _ in range(k)] for _ in range(ni)]
    losses = []
    for _ in range(epochs):
        rnd.shuffle(obs)
        for u, i, r in obs:
            e = r - (mu + bu[u] + bi[i] + sum(a * b for a, b in zip(P[u], Q[i])))
            bu[u] += lr * (e - lam * bu[u]); bi[i] += lr * (e - lam * bi[i])
            for f in range(k):
                pu, qi = P[u][f], Q[i][f]
                P[u][f] += lr * (e * qi - lam * pu); Q[i][f] += lr * (e * pu - lam * qi)
        losses.append(sum((r - (mu + bu[u] + bi[i] + sum(a * b for a, b in zip(P[u], Q[i])))) ** 2 for u, i, r in obs) / len(obs))
    return mu, bu, bi, losses


def main():
    R = [[5, 3, 0, 1], [4, 0, 0, 1], [1, 1, 0, 5], [1, 0, 0, 4], [0, 1, 5, 4]]
    errs = []
    for d in range(1, 5):
        Rh = puresvd(R, d)
        errs.append(sum((R[a][j] - Rh[a][j]) ** 2 for a in range(5) for j in range(4)))
    assert all(a >= b - 1e-9 for a, b in zip(errs, errs[1:])) and errs[-1] < 1e-8
    print("[OK] PureSVD 재구성 오차 d = 1..4:", [round(e, 3) for e in errs])
    Rh2 = puresvd(R, 2)
    print("     d = 2 재구성의 사용자 2(빈칸 2개):", [round(x, 2) for x in Rh2[1]])

    S = [[5, 5, 0, 0], [5, 5, 5, 5], [5, 5, 5, 5], [5, 5, 5, 5]]
    Rs = puresvd(S, 1)
    assert Rs[0][2] < 3
    print(f"[OK] 평점이 모두 5인 사용자의 빈칸 예측 {Rs[0][2]:.2f}: 0으로 채운 빈칸이 '싫어함'처럼 끌어내린다")

    rnd = random.Random(3)
    gen = [1.0, 0.0, -1.0]                     # 사용자 0은 후하고 2는 짜다
    obs = []
    for u in range(3):
        for i in range(8):
            if rnd.random() < 0.8:
                obs.append((u, i, min(5, max(1, 3 + gen[u] + (i % 3 - 1) * 0.5 + rnd.gauss(0, 0.2)))))
    mu, bu, bi, losses = biased_mf(obs[:], 3, 8)
    assert bu[0] > 0.5 and bu[2] < -0.5 and losses[-1] < losses[0]
    print(f"[OK] Biased MF: 전체 평균 {mu:.2f}, 사용자 편향 {[round(b, 2) for b in bu]}, 오차 {losses[0]:.3f} -> {losses[-1]:.3f}")

    assert abs(3.5 + 0.5 - 0.3 + 0.4 - 4.1) < 1e-12
    print("[OK] 카드 C2: 3.5 + 0.5 - 0.3 + 0.4 = 4.1")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
