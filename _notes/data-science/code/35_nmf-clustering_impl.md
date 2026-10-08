---
layout: "note"
title: "35_nmf-clustering_impl.py"
display_title: "35_nmf-clustering_impl.py"
kind: "code"
kind_label: "코드 · 구현"
num: "35"
course: "데이터 과학"
course_slug: "data-science"
course_url: "/studies/data-science/"
track: "컴퓨터 과학"
parent_url: "/studies/data-science/nmf-clustering/"
parent_title: "행렬 분해 군집화"
description: "데이터 과학 · 행렬 분해 군집화 구현 코드"
permalink: "/studies/data-science/code/35_nmf-clustering_impl/"
---
{% raw %}
[행렬 분해 군집화](/Hongs_Blog/studies/data-science/nmf-clustering/) 문서의 구현 코드다. `if __name__ == "__main__":` 아래가 자체 테스트다.

```python
"""비음수 행렬 분해(NMF)로 군집화 - 구현과 실험.

문서: 35.행렬 분해 군집화 (예시, 정의, 카드), 36.PCA와 NMF 비교
출처: 데이터 과학 10회 슬라이드 10-1 p.17~21
문제: X (n×d, 음수 없음) ≈ W H, W (n×k) >= 0, H (k×d) >= 0.
      min ||X - WH||_F² (+ λ Σ|W|)
갱신(리-승 곱셈 갱신): H ← H ⊙ (WᵀX) / (WᵀWH),  W ← W ⊙ (XHᵀ) / (WHHᵀ + λ)
  곱셈과 나눗셈만 써서 음수가 생기지 않는다. λ > 0이면 W의 작은 값이 더 작아진다(L1).
주장:
  1. 갱신 뒤에도 W, H는 음수가 없고, 오차 ||X - WH||는 (λ = 0일 때) 줄지 않는 쪽으로 간다.
  2. 단어 6개 × 문서 6개 예(주제 2개): 문서마다 W의 큰 칸이 군집을 알려 주고, 같은 주제 문서끼리 같은 군집이 된다.
  3. L1(λ > 0)을 더하면 행마다 작은 칸이 줄어 "주된 군집"이 더 뚜렷해진다(행의 최대 비율이 커진다).
  4. PCA의 첫 성분은 양수·음수 가중치가 섞이지만 NMF 성분은 음수가 없다.
"""
import random


def matmul(A, B):
    return [[sum(a * b for a, b in zip(r, c)) for c in zip(*B)] for r in A]


def T(A):
    return [list(r) for r in zip(*A)]


def frob(X, W, H):
    R = matmul(W, H)
    return sum((x - r) ** 2 for xr, rr in zip(X, R) for x, r in zip(xr, rr))


def nmf(X, k, iters=500, lam=0.0, seed=0):
    rnd = random.Random(seed); n, d = len(X), len(X[0]); eps = 1e-12
    W = [[rnd.random() + 0.1 for _ in range(k)] for _ in range(n)]
    H = [[rnd.random() + 0.1 for _ in range(d)] for _ in range(k)]
    errs = []
    for _ in range(iters):
        WtX = matmul(T(W), X); WtWH = matmul(matmul(T(W), W), H)
        H = [[H[a][j] * WtX[a][j] / (WtWH[a][j] + eps) for j in range(d)] for a in range(k)]
        XHt = matmul(X, T(H)); WHHt = matmul(W, matmul(H, T(H)))
        W = [[W[i][a] * XHt[i][a] / (WHHt[i][a] + lam + eps) for a in range(k)] for i in range(n)]
        errs.append(frob(X, W, H))
    return W, H, errs


def main():
    # 문서 6개(행) × 단어 6개(열). 문서 0~2는 스포츠 단어(공, 골, 경기), 3~5는 요리 단어(맛, 불, 냄비)
    X = [[5, 3, 4, 0, 1, 0],
         [4, 4, 3, 0, 0, 1],
         [3, 5, 4, 1, 0, 0],
         [0, 1, 0, 4, 5, 3],
         [1, 0, 0, 5, 3, 4],
         [0, 0, 1, 3, 4, 5]]
    W, H, errs = nmf(X, 2, iters=800)
    assert all(v >= 0 for r in W for v in r) and all(v >= 0 for r in H for v in r)
    assert all(a >= b - 1e-6 for a, b in zip(errs, errs[1:]))
    lab = [max(range(2), key=lambda a: r[a]) for r in W]
    assert lab[0] == lab[1] == lab[2] and lab[3] == lab[4] == lab[5] and lab[0] != lab[3]
    print("     W(문서의 군집 소속):", [[round(v, 2) for v in r] for r in W])
    print(f"[OK] 음수 없음, 오차 {errs[0]:.2f} -> {errs[-1]:.2f} 단조 감소, 군집 {lab}")

    def peak(W):
        return sum(max(r) / sum(r) for r in W) / len(W)
    W1, _, _ = nmf(X, 2, iters=800, lam=5.0)
    assert peak(W1) > peak(W)
    print(f"[OK] L1(λ = 5): 행의 최대 비율 평균 {peak(W):.3f} -> {peak(W1):.3f} (주된 군집이 더 뚜렷)")

    # PCA 첫 성분의 부호: 가운데로 옮긴 X의 공분산 행렬의 최대 고유벡터(거듭제곱법)
    n, d = len(X), len(X[0]); mean = [sum(c) / n for c in zip(*X)]
    Xc = [[x - m for x, m in zip(r, mean)] for r in X]
    C = matmul(T(Xc), Xc); v = [1.0] * d
    for _ in range(500):
        v = [sum(C[i][j] * v[j] for j in range(d)) for i in range(d)]
        s = sum(x * x for x in v) ** 0.5; v = [x / s for x in v]
    assert any(x > 0.1 for x in v) and any(x < -0.1 for x in v)
    print("[OK] PCA 첫 성분:", [round(x, 2) for x in v], "(양수와 음수가 섞인다)")
    print("ALL CHECKS PASSED")


if __name__ == "__main__":
    main()
```
{% endraw %}
